# Nexus Loop — solution testbed

A general harness for testing a **candidate solution** against **held-out
(sealed) corpora** whose answer keys we hold locally. It assumes nothing about
how a candidate is built — only that it honours the deliverables and the rules
in the problem statement. The question it answers with evidence:

> Will this solution find the right problems, avoid the lookalikes, and keep its
> honesty guarantees on a corpus it has never seen?

---

## 1. Why this exists

The practice kit ships with its answer key, so a solution can be tuned until it
scores well **on that one corpus**. The scored run, however, happens on a
different corpus. The testbed closes that gap: it generates many valid held-out
corpora and scores candidates against their keys, so tuning against the practice
layout cannot masquerade as generalisation.

### What is known about the held-out corpus

- The problem statement says day 6 runs on "a second dataset with the same kinds
  of problems planted on different days, tenants, and slices of traffic," with
  the answer key held by the organisers.
- The kit ships the **generator** (`tools/nexus-loop-kit/generate.py` and
  `tools/nexus-loop-kit/nlkit/`); the sealed layout is `sealed_schedule(secret)`.
  The generative process is public and reproducible — only the organisers'
  passphrase is hidden.
- Caveat: the shipped `sealed_schedule` keeps tenants, cohorts and cause classes
  fixed and moves only days/lengths/rates, while the problem statement says
  tenants and slices move too. The testbed therefore also enforces **generality**
  (no practice literals) rather than trusting the generator's fixed layout.

So we can build as many held-out corpora as we like. That is strong but not
perfect evidence — see §9.

---

## 2. Files

| File | Purpose |
|---|---|
| `make_corpora.py` | Generate N held-out corpora from the kit generator with different secrets |
| `evaluate.py` | Run, validate, score and judge candidates across corpora |
| `schema_check.py` | Independent draft-07 validator for `loop-report.json` |
| `candidates.example.json` | Candidate definition template (copy to `candidates.json`) |

---

## 3. Quick start

From the repository root:

```bash
# 1. build three held-out corpora (each ~16s, ~32 MB)
python3 tools/testbed/make_corpora.py \
  --generator tools/nexus-loop-kit/generate.py \
  --out-dir /tmp/nexus-testbed/kits \
  --secrets alpha-secret,bravo-secret,charlie-secret

# 2. describe the solution under test
cp tools/testbed/candidates.example.json tools/testbed/candidates.json
$EDITOR tools/testbed/candidates.json

# 3. run it
python3 tools/testbed/evaluate.py \
  --candidates tools/testbed/candidates.json \
  --kits-dir /tmp/nexus-testbed/kits \
  --tools tools/nexus-loop-kit \
  --json-out /tmp/nexus-testbed/result.json
```

`evaluate.py` and `make_corpora.py` locate `tools/nexus-loop-kit` automatically
whether the testbed sits at `<repo>/testbed` or `<repo>/tools/testbed`, so
`--tools`/`--generator` are optional when the layout is standard.

---

## 4. Candidate contract

A candidate is one JSON entry:

```json
{
  "name": "example-solution",
  "workdir": "/abs/path/to/checkout",
  "run": "python3 run.py --kit {kit} --team {team} --out {out} --replay-url {replay_url} --no-score",
  "serve": "python3 -m nexus_loop.app --report {report} --port {port}",
  "source_globs": ["nexus_loop/**/*.py", "run.py"],
  "literal_allow_globs": ["nexus_loop/static/**", "**/test_*.py"],
  "replay": true
}
```

| Field | Meaning |
|---|---|
| `name` | Label used in output and as the replay team prefix |
| `workdir` | Directory the `run`/`serve` commands execute in (absolute preferred) |
| `run` | **One unattended command** that writes a schema-valid `loop-report.json` at `{out}` |
| `serve` | Optional command that serves the decision screen on `{port}` |
| `source_globs` | Files scanned for hardcoded practice literals |
| `literal_allow_globs` | Paths exempt from the literal scan (fixtures, tests, static assets) |
| `replay` | `false` if the candidate does not call the replay service |

Substitutions available in `run`/`serve`: `{kit}`, `{team}`, `{out}`, `{outdir}`,
`{replay_url}`, `{port}`.

A candidate may be any language or layout; the testbed only needs these
commands.

---

## 5. What each run does

For every candidate × every corpus:

1. **Starts the replay service** (`tools/nexus-loop-kit/replay/serve.py`) on a
   free port and passes its URL to the candidate, so verification is exercised
   for real.
2. **Runs the candidate cold**, with stdin closed, in its own output directory.
   In full mode it runs **twice** to compare reports for determinism.
3. **Requires** exit code 0 within `--timeout` and a `loop-report.json`.
4. **Validates** the report against `schema/loop-report.schema.json` using the
   testbed's own validator (never the candidate's).
5. **Scores** it with the organiser's `score.py --json` against the corpus's
   hidden key.
6. **Checks** faults, decoys, strays and deliverable invariants (§6).
7. **Scans** the candidate source for practice literals.
8. **Exercises the screen**: loads `/`, submits an approval, confirms it was
   written back into the report, and confirms a missing reason is rejected.

Servers are started in their own process group and terminated cleanly, so a run
leaves no stray processes.

---

## 6. Checks in detail

### 6.1 Fault detection (per fault)

Uses the organiser's own matcher (`score.py:match_fault`, `cohort_matches`,
`DETECT_GRACE`). A fault is **clean** only when the finding:

- matches the fault's tenant and cohort key,
- carries a linked diagnosis with the **exact** `cause_class`,
- starts within the detection grace (no lag beyond the scorer's allowance).

A finding matched to the wrong cause or the wrong cohort is reported as found
but not clean. This is stricter than the raw score, which still gives partial
credit.

### 6.2 Decoy handling (per decoy)

- **False alarm**: a regression finding in the decoy's window that does not match
  a real fault.
- **Explicit dismissal**: a non-regression finding with
  `not_a_regression_because` and a linked diagnosis whose cause class is the
  decoy's (`traffic_mix`, `load`, `judge_change`).
- **Clean** = not a false alarm **and** explicitly dismissed. Silence does not
  count.

### 6.3 Stray findings

Regression findings that match neither a fault nor a decoy are listed. They cost
specificity and usually signal an over-eager detector.

### 6.4 Deliverable invariants (beyond `score.py`)

- required sections and `team`/`corpus` present;
- every metric has `fidelity ∈ {measured, judged, derived}` and a
  `coverage{value,basis}`;
- every judged metric carries `calibration{agreement,n}` and never ≥ 0.995;
- A11 is `NOT_MEASURABLE` with `required_event = failover` at `step` grain and
  fields `from_target,to_target,reason,recovered`;
- A04 has at least one **measured** metric (never judged);
- A09 is either a `REQUIRES_NEW_JUDGE` gap or a judged metric;
- a `CARDINALITY_REFUSED` gap exists for `custom_dims.customer_ref`.

### 6.5 Generality (practice literals)

The scan collects tenant keys, intent keys, tool names and agent ids from the
corpus catalog (plus the ground-truth cohorts) and reports any occurrence in the
candidate's `source_globs`, excluding `literal_allow_globs`. Hardcoding practice
values is the classic way a solution passes one corpus and fails a moved layout.

### 6.6 Determinism

In full mode the candidate runs twice; the reports must be identical after
dropping timestamp-like fields. Non-determinism makes the sealed run
irreproducible.

### 6.7 Screen mechanics

The testbed checks the screen **starts**, **renders HTML**, **writes an approval
back into the report**, and **requires a reason** for a decision. It does not
judge whether the screen is well designed — that is the human score.

---

## 7. Pass criteria

A candidate passes a corpus only when **all** hold:

1. one cold command exits 0 and writes the report;
2. the report is schema-valid;
3. every fault is clean (right cohort, right cause, no excess lag);
4. every decoy is explicitly dismissed and never falsely flagged;
5. no stray findings;
6. honesty = 12/12 and the deliverable invariants hold;
7. two cold runs are identical (full mode);
8. no practice literals in the candidate source;
9. a real, improved `rp_*` verification when a replay URL was provided;
10. the screen renders, writes back, and rejects a missing reason.

The machine score is printed for information but is **not** the bar. A solution
can score below 55 on a held-out corpus and pass (small detection-lag decay), or
score 55 on the practice corpus and fail a held-out layout (a missed cause or a
missed dismissal). The point is generalisation, not a single number.

`OVERALL` is `ALL CANDIDATES PASS` only if every candidate passes every corpus;
the process exits non-zero otherwise, so it can gate a merge or a release.

---

## 8. Interpreting the output

```
CANDIDATE example-solution   (/path/to/checkout)
  kit_01_alpha     PASS  machine=54.6/55  faults=/// decoys=///
  kit_02_bravo     FAIL  machine=53.5/55  faults=/// decoys=x// | decoy D1 not explicitly dismissed
```

- `faults=///` — F1/F2/F3 clean; `x` marks a fault that is missing, mis-cohorted,
  mis-caused, or late.
- `decoys=///` — D1/D2/D3 clean; `x` marks a false alarm or a missing dismissal.
- `| ...` — the first few failure reasons.
- `--json-out FILE` writes the full detail: schema problems, per-fault lag and
  cause, per-decoy flags, stray ids, invariant errors, literal hits, the raw
  `score.py` sections, and screen results. This is the artifact to attach to a
  review.

---

## 9. What the testbed cannot prove

- **It is not the organisers' secret.** Passing N held-out corpora raises
  confidence; it does not guarantee the real one.
- **Tenant/slice moves are not reproduced** by the shipped generator. The
  literal scan is a proxy; it will not catch subtler assumptions (e.g. "exactly
  two tenants", "the KB fault always has no before-period").
- **Rules 1 and 2 are not machine-checkable here.** Inspect code for LLM use on
  logged facts, and judge by hand whether any yardstick moved.
- **Screen quality is partly human.** Mechanics are checked; comprehension and
  decision quality are not.
- **The literal scan is heuristic** — substring matching over source globs. It
  can miss obfuscated literals and can flag legitimate taxonomy code.

Use it as a strong filter, not a guarantee.

---

## 10. Recommended workflow

1. Build **at least three** corpora with different secrets; more is better,
   because different layouts exercise different cross-fault interactions.
2. Run `--quick` first (one run per corpus) to iterate fast.
3. Fix or reject anything that fails; re-run.
4. Run the survivors in full mode (determinism) with `--json-out`.
5. Attach the JSON to the review; treat a solution as sealed-ready only when it
   passes every corpus.

---

## 11. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `no sealed kits in ...` | Run `make_corpora.py` first, or pass `--kits-dir` |
| candidate reports not found | Check `workdir` and the `{out}` substitution in `run` |
| replay server never healthy | Port conflict or wrong `--tools`; check the kit path |
| screen not detected | `serve` command or wrong port substitution |
| candidate times out | Raise `--timeout`; full corpus runs take seconds-to-minutes |
| stray servers after a crash | They are started in their own process group; kill by port if a hard crash occurs |

## 12. Extending the checks

`evaluate.py` is plain stdlib Python. To add a check:

- objective/fault logic: extend `objective()`;
- deliverable rules: extend `invariants()`;
- candidate-level rules: extend `verdict()`.

Keep new checks implementation-agnostic — they should pass any solution that
follows the written deliverables, not one particular design.
