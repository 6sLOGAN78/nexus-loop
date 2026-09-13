# Nexus Loop — `anupamgt-sol-v1`

This branch holds one candidate solution to the Nexus Loop problem, plus the
held-out evaluation of it. It exists so the solution can be iterated in
isolation from the shared tooling on `master`.

- **For the challenge brief, the kit tour, the verified findings, the build
  plan, and how to catch up: read the `master` branch README and `docs/`.**
  None of that is repeated here.
- This README is only about this solution, how to run it, and how it scores on
  corpora it has never seen.

No implementation changes have been made on this branch; the results below are
the solution as-is, with the issues left for the author to address.

---

## What is on this branch

| Path | What it is |
|---|---|
| `nexus_loop/` | The pipeline package: ingest + session features, coverage, metrics, asks, detectors, decoys, standards, diagnose, impact, report, validator, replay client, decision screen |
| `run.py` | The unattended cold-run entrypoint |
| `nexus_loop/static/index.html` | The decision screen |
| `docs/submission-note.md` | The one-page real / stubbed / simulated / breaks-at-100× note |

Run it exactly as the organiser tooling expects:

```bash
python3 run.py --kit <kit-dir> --team <name> --out out/loop-report.json \
  --replay-url http://127.0.0.1:8719
```

With no `--replay-url` it still produces a valid report; verification is then
omitted. The decision screen is served separately:

```bash
python3 -m nexus_loop.app --report out/loop-report.json --port 8765
```

The practice corpus (`kit/`) scores **55/55** machine. That is the in-sample
number; the point of this branch is the out-of-sample number below.

---

## Held-out evaluation

The suite is on `master` at `tools/testbed/`. It generates sealed corpora with
the kit's own generator — so the fault layout differs and the answer key is held
locally — runs the candidate unattended against each, and checks every fault,
every lookalike, the honesty and deliverable invariants, determinism, generality
and the screen write-back.

The pool below is six corpora: three ordinary layouts (`pool-*`) and three
**hard-mode** layouts (`hard-*`) where every tenant, intent, tool and agent
label is renamed to an opaque id. Hard mode catches solutions that rely on
practice names rather than structure.

Re-run it with:

```bash
python3 tools/testbed/make_corpora.py --out-dir /tmp/nexus-testbed/pool \
  --secrets pool-alpha,pool-bravo,pool-charlie
python3 tools/testbed/make_corpora.py --out-dir /tmp/nexus-testbed/pool \
  --secrets hard-alpha,hard-bravo,hard-charlie --rename
python3 tools/testbed/evaluate.py \
  --candidates tools/testbed/candidates.json \
  --kits-dir /tmp/nexus-testbed/pool --quick --explain \
  --json-out /tmp/nexus-testbed/result.json \
  --matrix-out /tmp/nexus-testbed/matrix.md
```

### Result: 0 / 6 corpora pass

| corpus | verdict | machine | faults F1/F2/F3 | decoys D1/D2/D3 |
|---|---|---|---|---|
| `kit_01_pool-alpha` | FAIL | 53.5 | `///` | `x//` |
| `kit_02_pool-bravo` | FAIL | 53.5 | `///` | `x//` |
| `kit_03_pool-charlie` | FAIL | 53.5 | `///` | `x//` |
| `kit_01_hard-alpha_renamed` | FAIL | 53.5 | `///` | `x//` |
| `kit_02_hard-bravo_renamed` | FAIL | 51.2 | `//x` | `x//` |
| `kit_03_hard-charlie_renamed` | FAIL | 52.9 | `///` | `x//` |

`/` = clean, `x` = not clean. All three faults are detected in all six layouts;
the failures are in cause attribution and one lookalike dismissal.

### Point ledger (from `--explain`)

| corpus | points lost | cause |
|---|---|---|
| `kit_01_*`, `kit_02_pool-bravo`, `kit_03_pool-charlie` | 1.47 | D1 not dismissed |
| `kit_02_hard-bravo_renamed` | 2.33 + 1.47 | F3 wrong cause + D1 not dismissed |
| `kit_03_hard-charlie_renamed` | 0.59 + 1.47 | F1 detection 3 days late + D1 not dismissed |

---

## Failure points to address

These are the issues the held-out corpora surface. They are described, not
fixed, and each has a pointer to where it arises.

### 1. The traffic-mix lookalike is never dismissed (6 / 6 corpora, −1.47 each)

Every corpus loses the same 1.47 points: decoy **D1 is never examined**, so it
earns only "quiet" partial credit instead of a clean dismissal.

```
QUIET D1 — not flagged, but never examined either (partial credit)
lost 1.47
```

Where it arises: `nexus_loop/decoys.py`, `detect_traffic_mix`. The detector
requires every intent's resolution to be flat inside the candidate window
(`if moved: continue`). When a real regression's cohort — here the new
product-line intent — sits in the mix window's *outside* period, its resolution
legitimately moves, `moved` becomes non-empty, and the whole traffic-mix
candidate is discarded. On layouts where the mix shift is early this doesn't
happen; on held-out layouts it almost always does.

Suggested direction: exclude cohorts that are themselves findings from the
flatness check (any window, not only overlapping), or compare each intent's rate
against a local baseline on both sides of the mix window and require the
aggregate movement to be explained by share with rates flat over that local
contrast.

### 2. The efficiency fault is attributed to the wrong config kind (1 / 6, −2.33)

On `kit_02_hard-bravo_renamed`, F3 is found with the right cohort and window but
diagnosed `model.change` instead of `prompt.regression`:

```
HIT   F3  lag=0d  cohort=ok  cause=model.change  -> 4.3/6.7
LOST F3 2.33 — candidate finding f03_efficiency_xt1 said cause=model.change,
     expected prompt.regression; cohort_ok=True lag=0
     cohort={'agent_id': 'xag4'} window={'from_day': 9, 'to_day': 20}
     attributed={'kind': 'model', 'day': 9, 'target': 'xag4', ...} (wanted {'kind': 'prompt', 'day': 9})
```

Where it arises: `nexus_loop/detect.py`, `detect_efficiency`. The cause is
chosen by proximity —
`corpus.nearest_change(tenant, a, {"prompt", "model"}, target=agent, ...)` — and
on this layout an innocuous model upgrade and the guilty prompt change both fall
on the fault's onset day, so proximity can return the model change.

Suggested direction: choose the cause from what actually changed in the data
between the baseline and the window (the agent's `prompt_version` versus its
`model`), not from proximity: if `prompt_version` changed, attribute
`prompt.regression` to the matching `kind=prompt` change; only call
`model.change` if the model field changed and no prompt change did; otherwise
`unknown`.

### 3. Detection lag costs points even when the fault is found (1 / 6, −0.59)

On `kit_03_hard-charlie_renamed`, F1 is found with the right cohort and cause but
three days after onset, so the scorer decays the detection component:

```
HIT   F1  lag=3d  cohort=ok  cause=kb.gap  -> 6.1/6.7
```

This is a point-loss rather than a correctness failure, but it is worth
tightening the KB-gap onset window so the finding starts at the break.

---

## Summary

| | |
|---|---|
| In-sample (practice corpus) | 55 / 55 |
| Out-of-sample (this pool) | 0 / 6 pass; 51.2–53.5 / 55 |
| Systematic issue | D1 traffic-mix dismissal (all corpora) |
| Conditional issue | F3 cause attribution when an innocent change shares the onset day |
| Minor | F1 detection lag |

Fixing (1) and (2) is the difference between this branch and a clean matrix. The
suite re-runs in under a minute with the commands above.
