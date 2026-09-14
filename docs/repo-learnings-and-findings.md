# Nexus Loop — kit learnings and findings

This file records what was verified directly from the supplied kit and generator
in this repository.

Everything below is reproducible from this repository; command references are to
`tools/nexus-loop-kit/`.

---

## 0. How the kit is built (read this first)

The corpus is generated, not sampled from reality. The generator is the ground
truth's author:

- `nlkit/world.py` — tenants, intents, tools, config timeline, fault schedule.
- `nlkit/simulate.py` — the session/step/turn simulator that applies faults as
  parameter shifts (turns multiplier, empty payload, KB miss) rather than flags.
- `generate.py` — writes JSONL.gz, labels, catalog, asks, and ground truth.
- `FAULT_SCHEDULE["A"]` is the practice layout.
- `sealed_schedule(secret)` (`world.py:315-390`) derives the day-6 layout.

This matters because the "answer key" is not a separate artefact bolted on: the
same code that places the fault writes the config timeline and the ground truth,
so the fake data is internally consistent and *findable by legitimate analysis*.

---

## 1. Corpus shape (verified)

| Quantity | Value |
|---|---:|
| Sessions | 80,252 |
| Sessions v3_agent | 68,492 |
| Sessions v2_flow | 11,760 |
| v3 share, acme-bank | 0.7205 |
| v3 share, northwind-retail | 0.9308 |
| Days | 56 |
| Config changes | 16 |
| Sample (`corpus_sample/`) sessions | 4,013 |
| Sample `premium_card_info` sessions | 30 |

Step rows by agent kind (verified):

```
v3_agent : turn 308,417  llm_call 311,599  tool_call 62,198  kb_lookup 61,171  guardrail 3,350  handoff 9,846
v2_flow  : turn  56,648  llm_call  56,918  tool_call      0  kb_lookup 10,997  guardrail   612  handoff 2,008
```

---

## 2. The three faults (verified against raw logs)

### F1 — KB gap, acme-bank, `premium_card_info`

- The intent is injected by `Simulator.intent_weights` (`simulate.py:99-108`):
  weight is 0 until `kb_gap_day`, then ramps to 0.055 over five days. It exists
  from day 35 to day 55 in variant A.
- Cohort resolution in window (days 34-45): **n=230, 0.3087**.
- After the window (days 45+): **n=301, 0.7907**. The fault is time-boxed and the
  intent *recovers*. A lifetime average or a "premium is broken" statement is wrong.
- KB lookups in the cohort use `kb_top_score` uniform(0.11, 0.38) and `kb_hit=False`;
  healthy lookups are uniform(0.62, 0.96) on hit / uniform(0.18, 0.49) on miss
  (`simulate.py:230-242`).
- `premium_card_info` sessions are assigned to a **random** acme v3 agent
  (`acme_main_v3`, `acme_cards_v3`, `acme_lending_v3`), `simulate.py:131-133`.
  So F1 is an **intent-level** finding, not an agent-level one.
- `f_kb_gap` also forces `p_resolve = 0.34` and disables `handoff_by_design`
  (`simulate.py:304-305, 321-322`). High handoff is expected, not surprising.

### F2 — Silent tool contract break, northwind-retail, `order_status` / `get_order_status`

| Metric | Before (28-39) | During (40-51) |
|---|---:|---:|
| order_status sessions | 2,895 | 2,686 |
| resolution | 0.8522 | 0.7755 |
| handoff | 0.0919 | 0.1698 |
| tool calls | 2,687 | 2,823 |
| declared tool error rate | 0.0145 | 0.0156 |
| empty 200 (`result_field_count=0`, `response_bytes=2`) | 0 | 382 (13.53%) |
| same-tool retry (`retry_count>0`) | 0 | 323 |

Mechanic (`simulate.py:252-279`): on a non-errored call in the fault window the
tool records `outcome="ok"`, `status_code=200`, `response_bytes=2`,
`result_field_count=0`; `silent_fail` then suppresses resolution (`p_resolve *= 0.22`)
and forces a same-tool second call next turn with `retry_count=1`.
`retry_count=1` on a same-tool second call is effectively a fingerprint of a
prior silent success — ordinary error retries do not set it.
The sealed rate is random in **[0.12, 0.20]**, never a fixed 14%.

### F3 — Prompt regression, acme-bank, `acme_main_v3`

| Metric | Before (34-45, p_v3) | During (46-55, p_v4) |
|---|---:|---:|
| sessions | 1,452 | 1,224 |
| median turns | 4.0 | 6.0 |
| mean turns | 4.514 | 7.015 |
| resolution | 0.7893 | 0.8031 |
| mean cost/session | $0.04378 | $0.07994 |

Peer agents are flat in the same window (verified):

```
acme_cards_v3   : median 4 -> 4, mean 4.528 -> 4.464, cost 0.0441 -> 0.0436
acme_lending_v3 : median 4 -> 4, mean 4.616 -> 4.489, cost 0.0450 -> 0.0436
```

Mechanic: `f_prompt` multiplies `turns_mu` by 1.58 and adds a second `llm_call` on
18% of turns (`simulate.py:143-159, 210`). It deliberately does **not** touch the
session end path. Outcome-only alerting cannot see it.

---

## 3. The three decoys (verified)

- **D1 traffic mix** (acme, day 22, len 10): `branch_locator` weight ×5
  (`simulate.py:102-104`). Aggregate containment rises while each intent is flat.
- **D2 load event** (northwind, day 12, len 4): volume ×4, latency ×2.2, tool error
  ×2.4 (`simulate.py:95-96, 160, 250`). Self-corrects; quality flat.
- **D3 judge boundary** (both tenants, day 28): rubric v2 subtracts 0.60 from the
  latent score (`simulate.py:336-337`). Verified means: v1 = 3.872 (n=43,455),
  v2 = 3.256 (n=36,797), difference ≈ 0.616.

---

## 4. The sealed corpus does not move tenants, cohorts, or cause classes

`sealed_schedule` (`world.py:315-390`) hardwires:

- F1 → acme-bank, `{intent: premium_card_info}`, `kb.gap`
- F2 → northwind-retail, `{intent: order_status, tool: get_order_status}`, `tool.contract_break`
- F3 → acme-bank, `{agent_id: acme_main_v3}`, `prompt.regression`
- D1 → acme `branch_locator` mix, D2 → northwind spike, D3 → both tenants.

Only **days, lengths, and rates** change. Three sample secrets (verified):

```
correct-horse-battery : F1 d6  F2 d11 F3 d20 D2 d38 D1 d37 judge d35
yellow-ai-sealed-2026 : F1 d19 F2 d22 F3 d6  D2 d5  D1 d37 judge d26
another-secret-phrase : F1 d23 F2 d38 F3 d9  D2 d21 D1 d41 judge d43
```

Implications:

1. A **config-anchored changepoint scan** is both generic and near-complete for
   this kit. It stays honest if a future sealed generator ever moves the cohorts.
2. The brief's claim that faults move "to different tenants and cohorts" is not
   true of the shipped sealed generator. Treat it as a robustness requirement,
   not a description of this kit.
3. The judge boundary can fall **inside** a fault window (e.g. judge d43 with F2
   d38-50), so any quality-derived signal must be segmented by `judge_version`.

Placement constraints (`world.py:347-376`): acme F1/F3/D1 do not overlap each
other; northwind F2/D2 do not overlap; D2 stays out of F2's 13-day lookback and
D1 stays out of F1/F3 lookbacks. F1 and F3 may be adjacent or within each
other's lookback, but they use different metrics (resolution vs turns), so the
contamination is minor.

---

## 5. The coverage trap is only half true

The catalog and all the docs say v2_flow emits no `tool_call`, `kb_lookup`,
`guardrail`, or LLM-cost steps. The corpus disproves the last three:

```
v2 sessions: 11,760 ; all 11,760 have cost_usd > 0
v2 steps: llm_call 56,918 (with cost), kb_lookup 10,997, guardrail 612, tool_call 0
```

- `tool_failure_rate` coverage **is** genuinely 0.7205 / 0.9308 (only `tool_call`
  is absent). This is the trap the scorer actually checks
  (`score.py:235-256`, tolerance 0.03).
- `cost_per_session` and `kb_fallthrough_rate` declared coverage of 0.72/0.93
  (`catalog.py:147-154`) does **not** describe emitted rows. It describes the
  v2 share, and the stated basis ("cost is only emitted on llm_call steps, which
  v2_flow lacks") is factually false for this corpus.
- The scorer never validates these, but A03/A06/A08 are coverage-limited asks and
  the honesty/framing reads are human-scored. Compute coverage from data.

Consequence: do not repeat "v2 lacks KB/cost/guardrail." The only real
telemetry hole is tool calls.

---

## 6. Scoring harness — what actually earns points

Weights (`score.py:27-29`): accuracy 20, specificity 15, loop 8, honesty 12 =
55 machine; human 45 = decision quality 18, screen 15, framing 12.

### Accuracy (`score.py:74-110`)
- 20/3 ≈ 6.67 per fault. Per fault: detection 0.45 (decayed by lag beyond 10
  days), localisation 0.20, diagnosis 0.35, +0.05 attribution bonus if
  `attributed_change.kind` matches and day within ±2.
- `cohort_matches` (`score.py:40-44`) matches if **any** finding-cohort key equals
  the fault-cohort value. Exact keys required: `intent`, `tool`, `agent_id`.
- `window_overlaps` (`score.py:47-49`) allows from_day up to onset+3 and to_day up
  to onset+length. `lag = max(0, from_day - onset)`, so starting the window at or
  before onset maximises the detection term.

### Specificity (`score.py:113-156`)
- Full 15 if no false alarms. Explicit dismissal of a decoy (non-regression
  finding + `not_a_regression_because` + a **linked diagnosis** with cause class
  `traffic_mix` / `load` / `judge_change`) clears it. Not examined = −0.35 ×
  per_decoy (per_decoy = 4.2). Stray findings cost up to 0.6 each.
- `match_decoy` ignores cohort and matches on tenant + window only. A real fault
  finding is safe because `bad = match_decoy AND NOT match_fault`.

### Loop (`score.py:159-217`, capped 8)
- metrics +2, standard +3, linked diagnoses +2.5, linked prescriptions +2.5,
  predicted_delta.to +2.0, real `rp_` verification +3.5, improved +1.0,
  self_assessment present +1.5, cycles≥3 +1.5, downweighted +0.5.

### Honesty (`score.py:220-314`, capped 12)
- fidelity+coverage on all metrics +4 (fractional), tool coverage match +3,
  calibration < 0.995 +2, A11 correct verdict +3, A11 event-field overlap +1.5,
  nearest_proxy + reason +0.5, fidelity traps ±0.75/−1.0.
- A09 `REQUIRES_NEW_JUDGE` gap counts as the correct `judged` fidelity
  (`score.py:305-308`). No LLM judge is required.

### Reference reports (scored by me)
| Report | Accuracy | Specificity | Loop | Honesty | Total |
|---|---:|---:|---:|---:|---:|
| level1 | 6.5 | 15.0 | 4.5 | 12.0 | 38.0 |
| level2 | 6.5 | 15.0 | 8.0 | 12.0 | 41.5 |
| level3 | 12.8 | 13.5 | 8.0 | 12.0 | 46.3 |

level1/2 detect only F1. level3 detects F1+F2 but **not F3**, and does not
dismiss the load decoy. So the reference ceiling is 46.3, and the two clearest
openings are F3 and complete decoy dismissal.

---

## 7. Replay endpoint — exact contract

`replay/serve.py`:

- 40 runs per `team` string (`RUN_BUDGET`, `serve.py:38`). `GET /log` audits.
- Deterministic per `[tenant, change, cohort]` (seeded, `serve.py:107-109`).
- Active fault requires tenant match AND window overlap AND any cohort key match
  (`serve.py:78-90`).
- A fix only moves anything if `change.type` is in the fault's
  `accepted_fix_classes` (`serve.py:124-128`):
  - F1: `kb.add` (lift 0.92) or `kb.synonym` (0.70)
  - F2: `tool.validate` (0.92) or `tool.fallback` (0.70)
  - F3: `prompt.edit` (0.92) or `revert` (0.70)
- Metric is `median_turns` for prompt faults, else `resolution_rate`.
- `before` is RNG noise, not the corpus value (`serve.py:114-121`). Do not treat it
  as corroboration.
- `no_effect` is identical for a wrong fix and an inactive cohort
  (`serve.py:136-139`). It is information; do not fish.
- Golden-set `pass` can randomly be false even for a correct fix
  (`p_break=0.002`/session, or 0.06 for blunt `revert`/`routing.change` when not
  improved, `serve.py:141-148`). `verdict` is still `improved`; do not retry on
  `pass=false` alone.
- A wrong `change.type` enum or a cohort missing `agent_id` for F3 silently yields
  `no_effect`.

---

## 8. Labels / calibration (verified)

- `labels/*.jsonl` are **plain JSONL**, not gzipped.
- `outcome_labels.jsonl`: 400 rows, human `resolved` vs corpus `session_end`
  agreement = **0.9125**.
- `rubric_scores.jsonl`: 96 rows. Human vs machine `quality_score` MAE = **0.439**
  overall (within 1 point = 0.948). By judge version: v1 MAE 0.504, v2 MAE 0.374.
- Noise is deliberate (`labels.py:12-13`): binary disagreement 0.075, rubric
  noise SD 0.62.

---

## 9. Where the existing strategy is wrong or incomplete

| # | Issue | Evidence | Impact |
|---|---|---|---|
| 1 | Under-weights breadth of detection ("one full loop") | Reference ceiling 46.3; F3 never detected | Up to 6.67 accuracy points left on table |
| 2 | Repeats false coverage claim for KB/cost/guardrail | v2 emits kb 10,997, cost on 11,760/11,760; only tool=0 | Wrong coverage wording in A03/A06/A08, framing risk |
| 3 | Doesn't state sealed timings-only structure | `sealed_schedule` fixes tenants/cohorts | Under-invests in the robust config-anchored approach |
| 4 | `standard` (3 pts) and `self_assessment` (3 pts) barely planned | `score.py:168-172, 201-213` | ~6 cheap loop points at risk |
| 5 | Replay mechanics not pinned (enum, cohort key, noise) | `serve.py:86-88, 124-148` | Wasted attempts, false `no_effect` |
| 6 | 45 human points treated as a bullet | `score.py:397-403` | Largest unscored-here block under-designed |
| 7 | Only 4 of 11 asks planned | `asks.md` requires input coverage | Framing/transparency loss |
| 8 | Doc numbers drift from `observed_effects` | exploration doc: 230/0%; GT: 531 lifetime | Any copied number breaks the "computed from corpus" rule |
| 9 | F1 windowing and random-agent assignment not noted | premium 0.31 in-window vs 0.79 after; random acme v3 agent | Lifetime statements and agent-scoped F1 are wrong |
| 10 | F3 peer control not exploited | cards/lending flat while main jumps | Harder than necessary, or missed by intent-only scan |

---

## 10. One-paragraph takeaway

The kit is a deterministic, internally consistent simulator whose three faults
never change tenant/cohort/cause class and are anchored to the same config
timeline that the report must use for attribution. The machine grader rewards
detecting **all three** faults, explicitly dismissing **all three** decoys, one
correct A11 gap, correct tool coverage, a real calibration, a mined standard, a
single well-formed replay chain, and an honest self-assessment — while the human
grader rewards a decision-shaped screen and explicit ask coverage. The existing
docs win the analysis but under-target the scoreboard: F3 detection, decoy
completeness, the standard, self-assessment, ask coverage, and the screen are
where the remaining points are.
