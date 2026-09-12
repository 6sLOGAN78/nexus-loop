# Research consolidation and comparison

Two bodies of work now live in `yellow-ai`:

- **Prior work** — the supplied kit and PS, the "TechQuest Team" solution design
  (`docs/nexus-loop-solution.pdf`), the team analysis docs, and the teammate's
  report artifacts.
- **Our work** — `repo-learnings-and-findings.md`,
  `improved-solution-and-workflow.md`, `deliverables-replay-and-demo.md`.

This file consolidates the prior material and compares the two approaches
side by side, with a verification ledger showing which claims the kit actually
supports.

---

## 1. Provenance of everything in the repo

| Item | Origin | Status |
|---|---|---|
| `docs/YellowAI_PS_TechQuest (1).pdf` | Official problem statement | Authoritative |
| `docs/nexus-loop-solution.pdf` | "TechQuest Team" design proposal (10 pages) | Prior design, unverified |
| `kit/**`, `tools/**` | Supplied kit | Authoritative data/tooling |
| `report.json` | `starter.py` output | Baseline (9.8/55) |
| `experiments/fix_report.py`, `experiments/loop-report.55.json` | Teammate shortcut | Experiment only, not submittable |
| `docs/brief.md`, `docs/data-exploration-and-solution.md`, `docs/architecture-ideas.md` | Team working docs derived from kit | Good but with factual drift |
| `docs/adversarial-review-nexus-loop-solution.md` | Team review of the design PDF | Corrective, aligns with ours |
| `docs/repo-learnings-and-findings.md`, `docs/improved-solution-and-workflow.md`, `docs/deliverables-replay-and-demo.md` | Ours (verified against kit) | Current plan |

No pre-existing prose research from the teammate exists beyond the design PDF and
the artifacts; the initial commit was the kit plus reports.

---

## 2. Consolidated prior work

### 2.1 Official problem statement (the bar)
Two deliverables — a schema-valid `loop-report.json` (produced unedited from the
sealed run) and one screen with a working approve/reject that writes back into the
report — plus a one-page note (real / stubbed / breaks at 100×). Four required
asks (A01, A04, A09, A11). 55 machine points + 45 human. Day-6 sealed run
unattended. 40 replay attempts per team.

### 2.2 "TechQuest Team" solution design (PDF)
A deterministic-first, eight-stage pipeline with a strong product instinct:

- One human touchpoint (approve/reject); unattended `run_loop.py`.
- "Three baselines" because each planted fault defeats a different naive
  comparison: temporal self, peer, and best-of-deployment standard.
- Explicit written dismissals for the three lookalikes.
- Refusal-native A11 gap; cardinality and coverage refusals.
- Replay "spent like money" with reserve/calibrate/iterate/confirm tranches.
- One-screen, three-zone UI (finding / evidence / decision) from the same JSON.
- Strong tradeoff, assumptions (real/stubbed/100×), and a 7-person, 6-day plan.
- Depth-on-one-problem-first, on the PS's own Level-1+screen ≈ 70 arithmetic.

Its weaknesses (verified later): several factual mismatches with the kit, an
under-wide detection segmentation, an evidence-suppressing "must align to a
config change" rule, and a wasteful replay policy.

### 2.3 Team analysis docs
- `data-exploration-and-solution.md` — the most detailed prior analysis; maps the
  three faults and three decoys and proposes detectors. Some numbers are
  window-specific and drift from `observed_effects`.
- `architecture-ideas.md` — distilled design: session feature table, metric
  contract, detector map, replay policy, sealed-run rules.
- `adversarial-review-nexus-loop-solution.md` — already corrects the PDF: A11
  event contract, no cross-tenant intent-family baseline, KB issue does align to
  a KB change, no invented handoff dollars, no null/wrong replay runs, catalog
  budget is fixed (200) not relative, don't quarantine all unknown fields.
- `brief.md` — plain-language restatement of the task; repeats a coverage claim
  that is only half true (see §6).

### 2.4 Teammate code artifacts
- `report.json` — honest `starter.py` baseline, **9.8/55**.
- `experiments/fix_report.py` — loads the organiser's Level-3 example, appends a
  hardcoded F3 and D2, fakes `rp_abcd`, sets `cycles = 5`, writes
  `experiments/loop-report.55.json`.
- `experiments/loop-report.55.json` — **55/55 against the practice ground truth**,
  but hand-edited, hardcoded to variant A, with asserted impact figures. Under
  the PS ("produced by the system ... without edits") this is disqualifying if
  submitted; it is kept only as a shape reference.

---

## 3. Our consolidated work (this session)

- `repo-learnings-and-findings.md` — verified evidence base: corpus shape and
  v2/v3 emission, exact fault mechanics and numbers, sealed-schedule analysis,
  scorer math, replay contract, label calibration, and a table of the prior
  strategy's errors.
- `improved-solution-and-workflow.md` — scoreboard target, module architecture,
  session feature table, data-derived coverage, config-anchored changepoint
  detectors, decoy detectors, 11-ask map, standard/golden rules, report/schema
  mapping, replay client, decision screen, honest self-assessment.
- `deliverables-replay-and-demo.md` — exact deliverables, required report
  sections, the four tasks, replay mechanics and budget, sealed run, scoring and
  levels, submission checklist, and an explicit "no agentic framework, almost no
  LLM" section.

Key verified additions the prior work did not have:
1. Only **`tool_call`** is absent from v2; v2 emits KB, guardrail, and cost.
2. The shipped **sealed generator moves only days/lengths/rates**; tenants/cohorts/
   cause classes are fixed (design for the stricter official claim anyway).
3. The reference ceiling is **46.3/55** and **no reference detects F3**, and
   Level-3 misses the load decoy.
4. Exact replay contract: accepted enums, `agent_id` cohort key for F3,
   deterministic per `[tenant, change, cohort]`, seeded `before`, random golden
   guard, and the 400-vs-consumed budget nuance.
5. `score.py` details: empty `standard` is worth 3, self-assessment up to 3,
   decoy dismissal needs a linked diagnosis with the exact cause class, A09 gap
   `REQUIRES_NEW_JUDGE` is accepted as `judged`.
6. Label-calibration anchors: outcome agreement ≈ 0.91, rubric MAE ≈ 0.44.

---

## 4. Side-by-side comparison (the two approaches)

| Dimension | Prior work (PDF + docs) | Ours |
|---|---|---|
| Framing | Agent regression workbench, one human touchpoint | Same |
| Engine | Deterministic Python, no deps | Same |
| Report as truth | Yes; UI from same JSON | Same |
| Detection segmentation | `intent × tenant × week` (PDF); architecture doc widens | Detector-specific: `(tenant,intent)`, `(tenant,agent)`, `(tenant,tool)` + config-anchored changepoint |
| Baselines | Three fixed families for every segment | Baseline chosen per detector, anchored to config timeline |
| KB peer baseline | "same intent-family, other tenants" (PDF) | Same tenant, same window, comparable KB-backed intents; never cross-tenant |
| Config attribution | Required for a finding (PDF) | Evidence-ranked; allow `unknown` when mechanism is proven but no change aligns |
| A11 event spec | `failover_triggered` + wrong fields (PDF) | `failover`, step, `from_target,to_target,reason,recovered`, owner `conversation-runtime` |
| Coverage | State coverage; PDF basis assumes all tool metrics v3-only | Tool-only hole (0.72/0.93); KB/guardrail/cost computed from data (≈1.0) |
| Calibration | Expected ceiling ≈0.92-0.93 (overconfident) | Compute actual agreement/MAE; no ceiling claim; never 1.00 |
| Cost impact | Per-token + per-handoff price constants (PDF) | Sum recorded `cost_usd`; null if unavailable; no invented prices |
| Replay policy | Reserve 8, calibrate with null/wrong fixes, control cohorts, up to 20 iterations | One diagnosed, exact-cohort, frozen-golden run; no null/wrong probes |
| Replay contract detail | "POST a fix and a slice" | Exact enum, cohort key, seeded before, golden noise, budget accounting |
| Sealed run | No practice literals; one command | Same, plus the timings-only finding and cohort-move contingency |
| UI | Static HTML + ~50-line stdlib server | Same, plus atomic write, audit file, schema revalidation |
| Self-assessment | Running tally | Honest cycles policy; runs 2-3 genuine replays or under-claims |
| Score target | Depth on one, expand if time | All 3 faults + 3 decoys, depth (one replay chain) on F2 |
| LLM use | One versioned judge | Zero required; optional calibrated judge; A09 gap suffices |
| Agentic framework | None | None |
| Planning | 7-person, 6-day plan, tradeoff/assumptions tables | Build sequence + sealed checklist + submission checklist |

---

## 5. Where prior work is stronger, equal, or wrong

**Stronger / keep:**
- The product framing, the finding-as-decision discipline, and the UI zones.
- The three-baseline *idea* (each fault needs a different comparison) — ours
  specializes rather than discards it.
- The 7-person, 6-day plan and the assumptions/tradeoff sections.
- The adversarial review's corrections, which already anticipated much of ours.

**Equal:** report-first, deterministic facts, explicit decoys, A11 refusal,
refusal-native gaps, one human approval.

**Wrong (must not be copied):**
- A11 event name/fields.
- Cross-tenant intent-family baseline for the KB issue.
- Claim that the KB issue has no config candidate.
- Invented handoff-dollar cost constants.
- Null/wrong-fix replay "calibration" and the reserve tranche.
- Calibration ceiling ≈0.92-0.93.
- Cardinality "threshold relative to row count" instead of the fixed budget 200.
- Treating `customer_ref` as a safe join key.
- The parenthetical that v2 emits no KB/cost/guardrail (only tool calls are absent).
- The "conversations twice as long" claim (actual: median +50%, mean +55%, cost +83%).

---

## 6. Verification ledger: prior claim → kit evidence

| Prior claim | Kit reality |
|---|---|
| v2 emits no tool/KB/guardrail/cost steps | v2 `tool_call=0`; `kb_lookup=10,997`; `guardrail=612`; `cost_usd>0` on all 11,760 v2 sessions |
| Failover event = `failover_triggered` | Catalog/ground truth require `failover` (step) with `from_target,to_target,reason,recovered` |
| KB peer = same intent-family, other tenants | Catalog defines no cross-tenant intent family; peer must be same tenant |
| KB has no config change | Day 34 KB change "premium card launch content pack" |
| Prompt doubles length | median 4→6 (+50%), mean 4.514→7.015 (+55%), cost +83% |
| Replay variance needs null/wrong runs | Endpoint is deterministic per `[tenant,change,cohort]`; `no_effect` is identical for wrong fix and inactive cohort |
| Calibration plateaus ≈0.92-0.93 | Human binary disagreement 7.5%; measured outcome agreement 0.9125, rubric MAE 0.439 — compute, don't assume |
| Cardinality refused by relative threshold | Fixed budget `customer_ref = 200`; refuse and cite the budget |
| `customer_ref` safe join key | Catalog's safe key is `session_id` |

---

## 7. Net assessment

Prior work is a strong **product and architecture narrative**; our work is the
**verified, kit-grounded execution plan** that keeps the narrative and fixes the
facts. The differences are not stylistic — several prior specifics (A11 spec,
peer baseline, replay policy, coverage, calibration, cost) would lose points or
disqualify. The teammate's 55/55 artifact is a scoring curiosity, not a result.

Recommended position:
1. Adopt our three docs as the source of truth for build and demo.
2. Keep the prior UI zones, decision framing, and 6-day plan.
3. Never submit or reference `experiments/loop-report.55.json` as output.
4. Reconcile any number quoted in the report against the corpus, not the notes.
5. Re-read `adversarial-review-nexus-loop-solution.md`; its corrections match
   ours and it is the bridge between the two bodies.

---

## 8. Open risks / next actions

- The brief says the sealed run moves tenants and slices; the shipped generator
  moves only dates. Keep detection generic so either is survivable.
- Decide the self-assessment honesty question (run 2-3 genuine replays, or
  under-claim).
- Build the 11-ask coverage map; four asks are required.
- Do not let the design PDF's wrong specifics leak into implementation via
  copy-paste.
