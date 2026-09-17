# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Yellow.ai TechQuest "Nexus Loop" (problem statement: `docs/YellowAI_PS_TechQuest (1).pdf`). Two deliverables:

1. `loop-report.json` — generated unattended by `run.py` from 8 weeks of agent logs, valid against `tools/nexus-loop-kit/schema/loop-report.schema.json`. Scored by `score.py` (55 pts). The current pipeline scores 55/55 on the practice kit and on held-out corpora; treat detection logic as frozen unless a task is explicitly about it.
2. One operator screen — a finding, its evidence, and an Approve/Reject control that writes the human decision back into the report. Scored by people (screen 15, decision quality 18, framing 12).

Two disqualifying rules shape every change: never ask a model for a fact the logs record (everything here is deterministic stdlib Python, no LLM), and never change the yardstick (metric definitions, judge versions, frozen golden set) to improve a number. Never hand-edit a report to raise a score.

## Commands

Windows machine: use `python` (no `python3`, no `make`). The README/docs say `python3`; substitute.

```bash
# full cold run (writes out/loop-report.json, golden_set.json, replay.log; runs score.py unless --no-score)
python run.py --kit kit --team demo --out out/loop-report.json --no-replay
#   faster iteration on the 5% slice:   --corpus-dir kit/corpus_sample
#   with replay verification: start the service first, then drop --no-replay
python tools/nexus-loop-kit/replay/serve.py --kit kit --port 8719
#   run + serve the screen in one process:  --serve --port 8765

# score a report against the practice answer key
python tools/nexus-loop-kit/score.py --report out/loop-report.json --ground-truth kit/ground_truth/ground_truth.json

# decision screen only (renders an existing report)
python -m nexus_loop.app --report out/loop-report.json --port 8765

# tests (stdlib unittest; the only test module is the screen/HTTP contract)
python -m unittest nexus_loop.test_app
python -m unittest nexus_loop.test_app.ScreenHttp.test_concurrent_decisions_both_persist

# held-out evaluation (see tools/testbed/README.md for the candidate contract)
python tools/testbed/make_corpora.py --out-dir <dir>/pool --secrets pool-alpha,pool-bravo,pool-charlie
python tools/testbed/evaluate.py --candidates tools/testbed/candidates.json --kits-dir <dir>/pool --quick --explain
```

If `score.py` output crashes on the console encoding, set `PYTHONIOENCODING=utf-8` (`run.py` already reconfigures its own stdout). No linter or build step is configured.

## Pipeline architecture (`run.py` → `nexus_loop/`)

`run.py:main` is the whole loop, in order:

1. `io.Kit` loads the kit (`catalog.json`, `manifest.json`, `labels/`, corpus dir). `features.Corpus` folds `agent_steps` down to one row per session — every detector and ask works on this session-grain table.
2. `coverage.Coverage` measures per-tenant emission coverage from the corpus itself (e.g. `v2_flow` emits no `tool_call`), never from catalog prose. Coverage feeds every metric's denominator.
3. `detect.detect_faults` (real regressions: tool contract break, KB gap vs same-tenant peers, prompt/efficiency regression vs sibling agent) and `decoys.detect_decoys` (traffic mix, load, judge-version boundary → `is_regression: false` findings with the cause class the scorer expects). `series.py` holds the shared per-day window scan.
4. `asks.build_asks` answers the 11 operator asks (`kit/asks.md`; A01, A04, A09, A11 are required) as metrics built through `metrics.metric` (the "number passport": fidelity, coverage, calibration, plan) or as `metrics.gap` refusals with a `required_event`.
5. `standards.freeze_golden_sets` writes `golden_set.json` **before** any prescription exists (Rule 2).
6. `report.assemble` builds findings + `impact.py` blocks (every figure derived from cohort rows with a checkable `derivation`; cost is summed `cost_usd` or null) + `diagnose.py` diagnoses and decision-shaped prescriptions. It also carries forward prior human `approval`s from the existing report at `--out`, matched by prescription id/diagnosis/target, so re-running does not erase decisions.
7. Optional `replay.run_replays` against the kit replay service → `verifications`.
8. `validate.py` schema + `extra_checks`, then `strip_internal` removes internal keys before writing. A validation failure still writes the file but exits 3.

## Decision screen (`nexus_loop/app.py` + `nexus_loop/static/`)

- `app.py` is a stdlib `ThreadingHTTPServer`: `GET /` (index.html), `GET /static/<whitelisted file>`, `GET /report.json`, `GET /health`, `POST /decision {prescription_id, verdict: accepted|rejected|deferred, decided_by, reason}`. `ReportStore.decide` holds a lock across read → set `prescriptions[].approval` → re-validate → atomic write (`io.write_json_atomic`: mkstemp in same dir + fsync + replace) → append `decisions.log`. A corrupt report returns `500 {"error": "report_invalid"}`.
- CSP is strict (`script-src 'self'; style-src 'self'`, no remote hosts): no inline `<script>`/`style=""`, no CDN or web fonts. Dynamic widths/styles must be set via CSSOM.
- The screen renders **only** from `/report.json` — never recompute or retype a number in JS. After a decision it must re-fetch the report and re-render. All report text must be escaped.
- `examples/demo.html` is a standalone wireframe over `examples/sample-report.json`, not the scored screen.

### Report fields the screen depends on

- Finding ↔ diagnosis via `diagnoses[].finding_id`; diagnosis ↔ prescription via `prescriptions[].diagnosis_id`; prescription ↔ verification via `verifications[].prescription_id`.
- `findings[].impact.downstream` has **two shapes**: outcome faults carry `would_have_resolved_at_baseline`/`unplanned_handoffs`/`abandoned`; the prompt-efficiency fault carries `extra_turns`/`resolved_conversations_slowed`/`excess_cost_usd` (outcomes did not move). Render whichever exists.
- `standard[]` matches a finding by tenant + metric, with the standard's cohort keys treated as wildcards when null.
- A02 appears both as metrics and as a `CARDINALITY_REFUSED` gap. A09 is a `REQUIRES_NEW_JUDGE` gap (abandonment is measured inside its `why`); A11 is `NOT_MEASURABLE` with `required_event` failover.
- `system_notes` is free text with `REAL:` / `STUBBED:` / `SIMULATED:` / `BREAKS AT 100x:` paragraphs — the "admit what was faked" content judges look for.
- Operator-facing wording (metric/cause/audience labels, gap ledes) is catalogued in `docs/manager-english.md`; field contract in `docs/ui-handoff.md`.

## Repo conventions

- `kit/` (practice data + answer key) and `tools/nexus-loop-kit/` (organiser generator, scorer, replay, schema, level 1–3 example reports) are organiser material: do not modify.
- `out/` is gitignored generated output. Root `report.json` is the weak `starter.py` baseline (9.8/55), not the solution's output.
- `yellow-ai-port/` is an unrelated skills knowledge-base export, not part of the solution.
- `docs/` holds the problem statement, solution overview, edge cases, submission note, and the UI/UX rationale; update them when behaviour they describe changes.
