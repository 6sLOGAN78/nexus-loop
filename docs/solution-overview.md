# Solution overview

The solution is a deterministic, stdlib-only Python pipeline (`nexus_loop/` +
`run.py`) that reads an AI agent deployment's logs and emits a schema-valid
`loop-report.json`, plus a small decision screen. It is the submission; the
testbed in `tools/testbed/` is how we check it generalizes.

This file explains what it does and how it is built. For the operator-facing
call to action, see `docs/ui-handoff.md`. For the one-page honesty note, see
`docs/submission-note.md`.

---

## How to run

```bash
# 1. (optional) start the replay service
python3 tools/nexus-loop-kit/replay/serve.py --kit kit --port 8719

# 2. cold run (one command, unattended)
python3 run.py --kit kit --team <name> --out out/loop-report.json

# 3. score against the practice key
python3 tools/nexus-loop-kit/score.py \
  --report out/loop-report.json \
  --ground-truth kit/ground_truth/ground_truth.json
```

Useful flags: `--no-replay` (valid report, no verification), `--corpus-dir` to
point at `kit/corpus_sample`, `--serve --port` to open the screen after writing,
`--no-score` to skip the built-in scorer.

Artifacts, all under the report's directory:

| File | What |
|---|---|
| `loop-report.json` | The deliverable report |
| `golden_set.json` | Frozen golden-set session IDs per finding (written before any prescription) |
| `replay.log` | Every replay call and response |
| `decisions.log` | Append-only record of human approve/reject/defer |

---

## Pipeline

```
kit/ (logs)
  → io.py         read gzipped JSONL, config_timeline.csv, labels, catalog, manifest
  → features.py   one row per session; step facts folded to session grain under row["derived"]
  → coverage.py   per-tenant emission coverage computed from the corpus
  → detect.py     3 fault detectors (tool contract, KB gap/resolution, efficiency)
  → decoys.py     3 lookalike dismissals (traffic mix, load, judge boundary)
  → asks.py       the 11 operator asks as metrics or gaps
  → standards.py  mine a "good" standard; freeze golden-set IDs
  → diagnose.py / impact.py   cause attribution and impact derivations
  → report.py     assemble + validate loop-report.json
  → replay.py     verify one fix (optional)
  → app.py        decision screen; writes the approval back
```

Run order matters in one place: the detectors run **before** the asks, so the
asks can deconfound themselves against detected faults/decoys.

---

## The data model (the first thing to get right)

The kit has three grains:

- **session** — one whole conversation (resolution, handoff, abandonment, turns, cost);
- **step** — one internal action (tool call, KB lookup, LLM call, guardrail, handoff);
- **turn** — one text exchange.

Steps fan out many-to-one onto sessions. `features.py` builds **one dict per
session** and folds every step fact down to it (`n_tool_calls`,
`n_empty_success` = HTTP 200 / `ok` / `result_field_count == 0`, same-tool
retries, KB hits and scores, LLM errors, guardrail blocks, milestones). Every
downstream metric works on this session table, so the fan-out bug cannot occur.

---

## Metrics, fidelity and coverage (`metrics.py`, `coverage.py`)

Every metric is built through one constructor that attaches the "number
passport" at calculation time:

- **value**
- **fidelity**: `measured` (read from logs), `derived` (computed from other
  numbers), or `judged` (a model/human decided meaning);
- **coverage**: the share of traffic that can even produce the metric, computed
  per tenant from which `agent_kind`s emit the step type;
- **plan**: source, filter, denominator, breakdowns;
- **calibration** for judged metrics.

Coverage is measured, not copied: `v2_flow` never emits `tool_call`, so tool
metrics cover ~0.72/0.93; cost, KB and guardrail *are* emitted by v2, so their
coverage is 1.0. Where this contradicts the catalog, the metric carries a
structured `coverage.observed_vs_declared` rather than a vague note.

---

## Fault detection (`detect.py`)

Three detectors, each owning its own cohort dimensions. A shared window scanner
(`series.py`) finds the contiguous day window whose inside mean differs most
from the outside mean (a Welch z-score), which suits faults that start and end.

1. **Silent tool contract break** — per `(tenant, tool)`: the per-day rate of
   responses that are HTTP 200 / `ok` but carry zero result fields. Requires the
   ordinary tool-error rate to stay flat, resolution to fall, same-tool retries
   to appear. Attributed to the nearest `kind='tool'` change on that tool.
2. **KB gap / resolution drop** — per `(tenant, intent)`. Mechanism check: KB hit
   rate near zero and low retrieval scores imply `kb.gap`; otherwise `unknown`.
   Baseline is same-tenant, same-window peer intents (never cross-tenant). A
   **born-broken** cohort (new intent, no before-period) opens its window on the
   launch `kind='kb'` change.
3. **Efficiency / prompt regression** — per `(tenant, agent)`: turns and cost
   rise while resolution stays flat. Sibling agents are the peer control, and the
   cause is chosen by the dimension that actually changed in the data
   (`prompt_version` vs `model`), not by the nearest config marker.

**Observation and attribution are separate.** If a mechanism is proven but no
config change aligns, the regression is still reported, with `unknown` cause.

---

## Decoy dismissal (`decoys.py`)

The kit plants three lookalikes; flagging one as a regression costs more than
missing a real problem. Each is emitted as a **non-regression finding with a
linked diagnosis** carrying the exact cause class:

- **traffic_mix** — aggregate moves, one intent's share jumps, per-intent rates
  flat (regression cohorts excused; flatness is a two-proportion z test).
- **load** — volume and latency spike then revert, outcomes flat.
- **judge_change** — quality drops on both tenants at a `judge_version`
  boundary; we never trend quality across it.

---

## Answering the eleven asks (`asks.py`)

Each ask in `kit/asks.md` becomes a metric or a gap. The four required asks
(A01, A04, A09, A11) are handled as:

- **A01** containment (resolved + by-design handoffs), measured;
- **A04** tool failure rate, measured, with the v3-only coverage stated; plus an
  empty-success metric, derived;
- **A09** a `REQUIRES_NEW_JUDGE` gap (abandonment is measured and reported in the
  gap; the *reason* needs a versioned judge);
- **A11** a `NOT_MEASURABLE` gap with the exact required event (`failover`, step
  grain, `from_target,to_target,reason,recovered`, owner `conversation-runtime`)
  and why the retry proxy misleads.

Notable among the rest: **A02** reports both the raw month-over-month comparison
and a **mix-adjusted** one (hold month-1 intent shares, apply month-2 per-intent
rates) with the mix effect isolated and overlapping events flagged; **A06**
offers the measured KB hit rate *and* a judged quality reading, segmented by
`judge_version` and calibrated against the kit's human labels; **A07** compares
model upgrades only on unconfounded windows; **A10** is a deterministic review
queue ordered by judged quality within the current judge version.

---

## Standard, report and verification

- **`standards.py`** mines "what good looks like" from the deployment's own
  resolved, low-turn conversations and **freezes the golden-set session IDs**
  before any prescription exists.
- **`report.py`** assembles findings (with impact, owner, consequence of
  inaction and a derivation), diagnoses (cause class + blamed change),
  prescriptions (change type, predicted delta, the decision a human approves,
  the risk, and a no-ship condition), then validates against the schema.
- **`replay.py`** posts the strongest fix to the replay service on the exact
  detected cohort with the frozen golden set, and records run id, before/after,
  verdict and prediction error. `no_effect` is recorded honestly. If the service
  is unreachable the report is still valid with no verifications.

---

## The decision screen (`app.py`, `static/index.html`)

A single stdlib HTTP server that renders **only** the report:

- `GET /` — the page; `GET /report.json` — the current report; `GET /health`;
- `POST /decision` — `{prescription_id, verdict, decided_by, reason}` (reason
  required); it updates exactly that prescription's `approval`, validates the
  report, replaces the file atomically, and appends `decisions.log`.

The screen is intentionally small and complete; the UI/product team can restyle
or rebuild it as long as it keeps rendering from the report. The contract, the
field-to-element mapping, and the constraints are in **`docs/ui-handoff.md`**.

---

## Results

| Corpus | Result |
|---|---|
| Practice `kit/` | 55.0 / 55 |
| Sealed pool (3 ordinary + 3 hard-mode labels) | 6 / 6 pass, all 55.0 |
| Moved-fault (faults relocated across tenants/slices) | 55.0 |
| Moved-fault + a clean unseen third tenant | 55.0 |

All faults are found with the right cohort and cause; all three lookalikes are
explicitly dismissed; no false alarms, strays, honesty gaps, hardcoded labels,
non-determinism or replay-provenance problems.

---

## What is real, stubbed, and where it breaks

See `docs/submission-note.md`. In short: all facts come from logs and deterministic
Python; no LLM is called; A09 is a gap rather than a judge; quality calibration is
the kit's human labels against the corpus judge; the replay service is a seeded
hypothesis verifier; everything is in-memory (fine at ~80k sessions, not at 10–100×).
