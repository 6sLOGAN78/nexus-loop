# Nexus Loop — `anupamgt-sol-v1`

This branch holds one candidate solution to the Nexus Loop problem and the
held-out evaluation of it. It exists so the solution can be iterated in
isolation from the shared tooling on `master`.

- **For the challenge brief, the kit tour, the verified findings, the build
  plan, and how to catch up: read the `master` branch README and `docs/`.**
  None of that is repeated here.
- This README is only about this solution, how to run it, and how it scores on
  corpora it has never seen.

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

The practice corpus (`kit/`) scores **55/55** machine.

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
  --kits-dir /tmp/nexus-testbed/pool --explain \
  --json-out /tmp/nexus-testbed/result.json \
  --matrix-out /tmp/nexus-testbed/matrix.md
```

### Result: 6 / 6 corpora pass

| corpus | verdict | machine | faults F1/F2/F3 | decoys D1/D2/D3 |
|---|---|---|---|---|
| `kit_01_pool-alpha` | PASS | 55.0 | `///` | `///` |
| `kit_02_pool-bravo` | PASS | 55.0 | `///` | `///` |
| `kit_03_pool-charlie` | PASS | 55.0 | `///` | `///` |
| `kit_01_hard-alpha_renamed` | PASS | 55.0 | `///` | `///` |
| `kit_02_hard-bravo_renamed` | PASS | 55.0 | `///` | `///` |
| `kit_03_hard-charlie_renamed` | PASS | 54.4 | `///` | `///` |

`/` = clean. All three faults are found with the right cohort and cause, all
three lookalikes are explicitly dismissed, and no false alarms, strays, honesty
gaps, hardcoded labels, non-determinism or replay-provenance problems remain.
One corpus scores 54.4 rather than 55.0 because the KB-gap finding starts three
days after onset, which decays the detection component — a point loss, not a
correctness failure.

---

## Issues found and fixed

### 1. The traffic-mix lookalike was never dismissed (was 6 / 6, −1.47 each)

`nexus_loop/decoys.py` `detect_traffic_mix` required every intent's resolution to
be flat in the candidate window before emitting the dismissal. Two things broke
it under a different layout:

- an intent that is itself a detected regression — the newly launched product
  line — moved for real, and its own fault window need not overlap the mix
  window;
- a fixed 0.05-point tolerance flagged small cohorts on noise (e.g. a ~0.065
  swing on a low-volume dispute intent).

**Fix:** excuse regression cohorts in the same tenant regardless of window
overlap, and replace the absolute tolerance with a two-proportion z test
(floor 0.05, z ≥ 3) so only statistically real moves count.

### 2. The efficiency fault was attributed to the wrong config kind (was 1 / 6, −2.33)

`nexus_loop/detect.py` `detect_efficiency` chose the cause by proximity —
`nearest_change(..., {"prompt", "model"}, target=agent)` — so when an innocuous
model upgrade shared the fault's onset day with the guilty prompt change, F3 was
diagnosed `model.change`.

**Fix:** attribute by the dimension that actually changed between the baseline
and the window, read from the sessions themselves: prefer `prompt.regression`
when the agent's `prompt_version` changed, fall back to `model.change` only when
the model changed instead, otherwise `unknown`. The changed dimension is
recorded in the finding's evidence.

---

## Summary

| | |
|---|---|
| In-sample (practice corpus) | 55.0 / 55 |
| Out-of-sample (this pool, 6 corpora) | 6 / 6 pass; 54.4–55.0 |
| Remaining point loss | KB-gap detection lag on one corpus (3 days) |
| Remaining correctness work | none observed on this pool |

The suite re-runs in a couple of minutes with the commands above. Grow the pool
with more secrets before the sealed run; treat any FAIL as a stop.
