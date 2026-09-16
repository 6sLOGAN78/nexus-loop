# Edge cases and honesty traps — and how we handle them

This is the list of non-obvious things that are easy to get wrong and that the
scoring cares about (Framing 12 / Honesty 12). Each entry says what the trap is,
why it bites, what we actually do, and a one-liner to say out loud if a judge
probes it.

Status legend: **[handled]** in the current code · **[queued]** known gap with a
fix planned, stated honestly because pretending otherwise is worse.

---

## 1. Data grain

### 1.1 Step → session fan-out — [handled]
`agent_steps.jsonl.gz` has many rows per session. Joining it to `sessions` and
averaging double-counts chatty sessions. We fold every step measurement to one
row per session at load time (`features.py`, `_fold` → `s["derived"]`) before any
rate is computed.
> "We aggregate steps to the session before any outcome math, so a session with
> 40 tool calls can't outvote one with two."

### 1.2 Emitting vs non-emitting agent kinds — [handled]
v2 legacy flow emits no `tool_call` (and, per the catalog, no `kb_lookup`/cost).
A step-derived metric must exclude those sessions from the **denominator**, not
count them as zero.
> "Coverage is measured per tenant from this corpus and the non-emitting kinds
> leave the denominator. Counting them as zero-error would flatter the tool
> metric."

### 1.3 Declared vs observed coverage — [handled]
The catalog's coverage claims do not always match the generated corpus (e.g.
`v2_flow` does emit `kb_lookup` and carries `cost_usd` here). We publish the
**measured** value and attach `coverage.observed_vs_declared` with the reason.
(Same family as issue #7.)
> "We don't trust the catalog's coverage prose; we measure it and print the
> declared-vs-observed gap when they disagree."

### 1.4 Catalog drift we do not edit — [handled by measuring, not by trusting]
The kit's catalog is a planning contract, and in a few places it disagrees with
the mounted corpus. Kit files are organiser-owned, so we do not edit them; we
measure and flag:
- **Calibration set size.** `catalog.json` describes "100 human-scored sessions";
  `manifest.json` and `labels/rubric_scores.jsonl` are **96**, and the published
  calibration uses n=96.
- **v2 coverage.** `catalog.json` declares `cost_per_session` and
  `kb_fallthrough_rate` coverage `0.72`/`0.93` on the basis that `v2_flow` lacks
  `kb_lookup` and cost. In the corpus, v2 sessions carry `cost_usd` and emit
  `kb_lookup` (and guardrail) steps; only `tool_call` is truly absent. Each
  affected metric carries `coverage.observed_vs_declared` rather than trusting the
  prose.
> "We measure coverage from the corpus and print the declared-vs-observed gap,
> including where the catalog's own numbers are stale."

---

## 2. Cost — A03 / A08

### 2.1 Cost coverage (the v2 problem) — [handled]
The catalog declares cost coverage `acme-bank 0.72`, `northwind-retail 0.93`,
"cost is only emitted on llm_call steps, which v2_flow lacks." We measure it.
The practice corpus lands at **1.000 for both tenants** (v2_flow sessions carry
`cost_usd` here), so we publish 1.0 **and** flag declared-vs-observed.
> "If v2 had no cost, coverage would drop and those sessions would leave both
> numerator and denominator. We never treat missing cost as $0."

### 2.2 Missing cost is `null`, never `$0` — [handled]
`cost_usd` is summed from recorded values or reported `null`. Sessions without a
recorded cost are excluded from the cost numerator **and** the resolution
denominator for cost-per-resolved.

### 2.3 Grain assumption — [handled, with a caveat]
We read `cost_usd` at **session grain** (catalog says `grain: session`). If a
sealed variant stamped cost only on `llm_call` steps, we would need to roll it up
from steps; we'd rather state that assumption than hide it.
> "Cost is a session field per the catalog. If it moved to step grain we'd sum it
> up — the point is we know where the number comes from."

### 2.4 Cost per resolved is paired with escalation — [handled]
A cheap-looking intent that escalates to a human a lot is not cheap: the *hidden*
cost is the handoff. A03 now reports `unplanned_handoffs`, `escalation_rate`,
`abandoned` and `abandon_rate` beside `cost_usd` and `cost_per_resolved` for every
intent, as a two-point comparison. Handoffs are **never** converted to dollars —
no price constant exists in the corpus, so they stay counts and rates.
> "We refuse to invent a human-handling price. Instead we put the escalation
> rate next to the unit cost so the hidden cost is visible without fabricating a
> dollar figure."

### 2.5 Zero resolved ⇒ cost per resolution is unbounded — [handled]
If an intent resolves nothing, cost per successful resolution is not `0` and not
undefined-to-be-ignored — it is **unbounded**, the worst case. `cost_to_resolve`
is emitted as the literal `"unbounded"`, those intents are ranked **first** by
total spend (not last), and they are listed under `breakdown.unbounded_intents`.

A **different** state is kept separate: an intent that *does* resolve but whose
resolved sessions carry no recorded cost is `cost_to_resolve="cost_unavailable"`
(a coverage gap, ranked after unbounded, listed under
`breakdown.cost_unavailable_intents`) — never confused with infinite cost. The
old `cost_per_resolved or 0` key sorted "cannot compute" as "cheapest"; both
states are now explicit. None exist in the practice corpus (min resolved per
intent is 309), but a hostile sealed corpus can produce either.
> "An intent that spends money and resolves nothing has infinite unit cost; an
> intent whose cost telemetry is missing is a coverage gap — different states,
> and neither is ranked as 'cheapest'."

---

## 3. Asking the right thing (fidelity)

### 3.1 Measured vs judged — [handled]
- **A04 (tool failure) is `measured`.** We executed the call; answering with a
  model is a Rule 1 violation.
- **A09 (why users abandon) is `judged`.** Abandonment is measured, but the
  *reason* is a judgment about meaning. No versioned judge with a published
  calibration exists, so we publish a `REQUIRES_NEW_JUDGE` gap instead of a number.
- **Quality is `judged`** with a calibration against the kit's human rubric
  (`|Δ| ≤ 1`), per `judge_version`, never a suspicious 1.00.
> "We ask a model for nothing the logs already record, and we mark anything
> judgment-shaped as judged with its calibration."

### 3.2 Refusing to answer (A11, A02/cardinality) — [handled]
- **A11 failover is `NOT_MEASURABLE`.** No failover mechanism exists, so no event
  is emitted. We name the required event (`failover`, step grain, fields
  `from_target, to_target, reason, recovered`, owner `conversation-runtime`) and
  reject the tempting proxy: `llm_call.retry_count > 0` is a *quality retry*, not a
  switch to an alternate target.
- **A02 `customer_ref` breakdown is refused** against the catalog's fixed budget
  of 200 (≈80,252 distinct values). `session_id` is the only join key we use.
> "Sometimes the honest answer is a spec for the event you'd need, not a number
> drawn from a proxy that lies."

---

## 4. Detection and deconfounding

### 4.1 Observation vs attribution — [handled]
We report a regression when the behaviour proves it, even with no aligned deploy.
If nothing aligns: `cause_class: unknown`, `attributed_change: null`. We don't
force a scapegoat.
> "The mechanism is the finding; the config marker is evidence, not a gate."

### 4.2 The three lookalikes — [handled]
Traffic-mix shift, load spike, and judge-version boundary are each examined and
explicitly dismissed with the scorer's cause class and a written reason. The mix
dismissal flatness-tests **every** intent; a cohort too small for the z-test is
checked with an absolute guard (`MIX_SMALL_TOL`) and, if quiet, named in evidence,
so a genuine small-cohort drop cannot be waved away as mix.
> "We earn specificity by looking and being right, not by staying quiet."

### 4.3 Month-over-month is mix-adjusted (A02) — [handled]
Aggregate month-over-month resolution moves when the *traffic mix* moves, even if
every intent's own rate is unchanged: if a lower-rate intent grows from 13% to 44%
of traffic, the average falls without any quality change.

We answer A02 with **two** metrics, not one:
- `m_mom_resolution` (measured) — per tenant, per intent: `[month_1, month_2]` for
  resolution, containment and median turns, plus each intent's **share of traffic**
  so the mix is visible in the same table.
- `m_mom_resolution_adjusted` (derived) — hold **month-1 intent shares static**,
  apply **month-2 per-intent rates** over the common intents (≥30 sessions in each
  month, renormalised). Crucially, **both ends sit on the same common-intent
  scope**: it reports `raw_all_intents`, `common` = `[month_1_common, month_2_common]`,
  `adjusted` = `[month_1_common, mix-held month_2]`, `mix_effect = common_month2 −
  adjusted`, and `change_beyond_mix = adjusted − common_month1`. So
  `change_beyond_mix` is not contaminated by an intent entering or leaving.

The idea is the teammate's: freezing the fraction-of-people removes the mix from
the comparison, so whatever is left is the agent. One caveat is stated, not hidden:
a cohort **born in month 2** has no month-1 share and cannot be mix-held, so it is
excluded and named under `breakdown.<tenant>.born_in_month2`. A regression that
arrives as a brand-new cohort (here `premium_card_info`, the F1 fault) will *not*
show in the adjusted number — it shows in the raw per-intent table. Quality is
never trended month over month — the judge-version boundary (4.4) makes that a
measurement of the rubric, not the agent.
> "We hold last month's mix fixed and apply this month's per-intent rates, and both
> ends are the same common-intent scope. A cohort born this month can't be held
> fixed, so we name it and point you at the raw table instead."

### 4.4 Judge-version boundary — [handled]
Judged quality drops on every tenant on the day `judge_version` flips v1→v2.
That is the ruler changing. Quality is only compared **within** a judge version;
resolution and turns are unaffected.
> "We measured the rubric, not the agent, so we never trend quality across a
> judge boundary."

### 4.5 Born-broken cohorts — [handled]
A cohort whose traffic starts at/after the fault window has no before-period, so
its own history can't be the baseline. We baseline on same-tenant peer intents on
the same agents and days, and open the window on its first traffic (or the launch
change) to avoid detection lag.
> "It was born broken — its own history can't prove it, so we compare it to its
> peers."

### 4.6 Silent tool failure — [handled]
`status 200`, `outcome: ok`, `result_field_count: 0`. Every error metric reads
flat. We detect the empty-success rate and show the error metric is flat on
purpose.
> "The failure is invisible to alerting; that's exactly why it matters."

---

## 5. Verification discipline

### 5.1 Golden set frozen before any fix — [handled]
`out/golden_set.json` is written **before** a prescription exists and reused
verbatim, so we can't pick "known-good" sessions after seeing which fix helps.

### 5.2 Replay is a verifier, not a search — [handled]
Run budget is capped; we send one high-confidence run on the exact cohort with
the frozen golden set; no null or wrong calibration probes. `no_effect` is
recorded as a result. The endpoint's `before` is its own simulated baseline, not
our corpus number, and we say so.
> "A fix with no before/after is a hope. We spend the budget on one hypothesis we
> already believe and record whatever comes back."

---

## 6. Determinism

- No language model is called for any logged fact. All numbers are deterministic
  aggregations or fields read from the corpus. The only network call is the
  optional local replay. Thresholds are relative/statistical, not practice
  literals, which is why the same code passes renamed-label, moved-fault, and
  extra-tenant corpora.

---

## 7. Known limits we state rather than hide

| Limit | Status |
|---|---|
| Cost read at session grain (would need a roll-up if it moved to steps) | [handled caveat] |
| In-memory session map (~80k sessions comfortable; tens of millions need an on-disk grain) | [handled caveat] |
| Report JSON is a single-writer store (atomic replace, not multi-approver) | [handled caveat] |
| Detector bars are statistical; a sealed corpus under the lift/z floors won't fire (a miss, not a false calm) | [handled caveat] |

---

## 8. Demo talking points (one-liners)

1. **Coverage** — measured per tenant, non-emitting kinds excluded, declared-vs-observed called out.
2. **Missing cost** — `null`, excluded from both sides; never `$0`.
3. **No invented handoff price** — escalation reported as counts and rates.
4. **A04 measured, A09 judged** — right fidelity, calibration published.
5. **A11 refused** — required event named; retry ≠ failover.
6. **Cardinality** — `customer_ref` refused against the budget.
7. **Lookalikes** — mix, load, judge change each dismissed with a reason.
8. **Golden set frozen before the fix; replay is a verifier, not a search.**
9. **No model for logged facts; deterministic and reproducible.**
10. **Zero-resolved intent = infinite unit cost**, ranked first, not a blank.

---

## 9. Insight ledger (tracking for the write-up)

One row per non-obvious insight, with where it lives and the report path that shows
it. This is the working list for the end-term report — keep it in sync when a new
trap is found or a `[queued]` item ships.

| ID | Insight | Where handled | Report evidence | Status |
|---|---|---|---|---|
| GR1 | Step→session fan-out: aggregate steps to one row/session before any rate | `features.py` `_fold` → `s["derived"]` | drives every metric value | handled |
| GR2 | Emission coverage: non-emitting agent kinds leave the denominator, not counted as zero | `coverage.py` | `metrics[].coverage.value/basis/excluded` | handled |
| GR3 | Declared coverage ≠ observed: measure and publish both | `asks._cost_coverage`, coverage extras | `metrics[].coverage.observed_vs_declared` | handled |
| CO1 | Cost coverage is measured, not read from the catalog (the v2 problem) | `asks._cost_coverage` | `metrics[m_cost_per_resolved_*].coverage` | handled |
| CO2 | Missing cost is `null` and excluded from both sides — never `$0` | `asks` A03/A08, `impact._cost` | `metrics[].coverage.basis`, `findings[].impact.cost_usd` | handled |
| CO3 | No invented handoff price — escalation as counts, never dollars | `asks` A08 alternatives, `impact` | `metrics[m_spend_*].plan.alternatives` | handled |
| CO4 | Escalation is a hidden cost — pair it with cost per resolved | `asks` A03 | `metrics[m_cost_per_resolved_*].breakdown.by_intent[].escalation_rate` | handled |
| CO5 | Zero-resolved intent = unbounded unit cost → ranked first, not last | `asks` A03 | `...breakdown.unbounded_intents`, `...cost_to_resolve` | handled |
| MO1 | Stratify month-over-month by intent so a mix shift is visible | `asks` A02 | `metrics[m_mom_resolution].breakdown` | handled |
| MO2 | Mix-adjusted MoM: freeze month-1 shares, apply month-2 per-intent rates | `asks` A02 | `metrics[m_mom_resolution_adjusted].value` (`mix_effect`, `change_beyond_mix`) | handled |
| MO3 | Never trend judged quality across the judge-version boundary | `asks` A02 alternatives, §4.4 | `metrics[m_mom_resolution].plan.alternatives` | handled |
| FI1 | Right fidelity: A04 measured, A09 judged | `asks`, `metrics.metric` guard | `metrics[].fidelity`, `gaps[A09]` | handled |
| FI2 | Calibration published, rejected if suspiciously 1.00 | `asks._quality_calibration` | `metrics[m_quality_judged].calibration` | handled |
| FI3 | A11 refused: name the required event, reject the proxy (retry ≠ failover) | `asks` A11 | `gaps[A11]` | handled |
| FI4 | Cardinality refusal: cite the budget, don't group a near-unique field | `asks` A02 | `gaps[A02]` | handled |
| DE1 | Observation vs attribution kept separate (no forced scapegoat) | `detect.py` | `diagnoses[].cause_class`, `.attributed_change` | handled |
| DE2 | Lookalikes explicitly dismissed with a written reason | `decoys.py` | `findings[].not_a_regression_because` | handled |
| DE3 | Load ≠ quality: require outcomes flat | `decoys.detect_load` | `diagnoses[].cause_class = load` | handled |
| DE4 | Judge-version boundary moved the ruler, not the agent | `decoys.detect_judge_boundary` | `cause_class = judge_change` | handled |
| DE5 | Born-broken cohort: peer baseline, window on first traffic (less lag) | `detect.detect_resolution_drops` | `findings[].baseline`, `findings[].window.from_day` | handled |
| DE6 | Silent tool failure (empty 200) is invisible to the error metric | `detect.detect_tool_contract` | `findings[].evidence`, `...mechanism.empty_success_rate_in` | handled |
| DE7 | Peer / sibling / strata controls shown, not just asserted | `detect.py`, `decoys.py` | `findings[].evidence`, `diagnoses[].evidence` | handled |
| DE8 | Same-tool retry corroborates the empty answer | `features.n_same_tool_retry`, `detect` | `findings[].evidence` | handled |
| VE1 | Golden set frozen before any fix (no hindsight) | `standards.freeze_golden_sets` | `prescriptions[].golden_set`, `out/golden_set.json` | handled |
| VE2 | Replay is a verifier, not a search; `no_effect` honest | `replay.py` | `verifications[].verdict`, `.runs_used`, `.run_budget` | handled |
| VE3 | Replay "before" is the endpoint's simulated baseline, stated | `replay.verification_from` | `verifications[].note`, `system_notes` SIMULATED | handled |
| GE1 | Determinism: no LLM for logged facts; thresholds transfer | whole pipeline | `system_notes` REAL/STUBBED | handled |
| GE2 | Baseline fairness stated in words on every impact | `impact.derivation`, `report.finding_from` | `findings[].impact.derivation`, `findings[].baseline` | handled |
| GE3 | Deterministic scope, judged ordering (A10) | `asks._review_queue` | `metrics[m_review_queue]` | handled |
| GE4 | Decision shaped before the gate: asking / risk / would-not-ship | `diagnose.prescription` | `prescriptions[].decision` | handled |
| GE5 | Impact says who must act | `impact.AUDIENCE` | `findings[].audience` | handled |
| FX1 | Empty-success requires an explicit `result_field_count == 0`; a missing key is unknown, not empty | `features.py` `_fold` | `metrics[m_tool_empty_success_*]`, `findings[f01]` | handled |
| FX2 | Traffic-mix dismissal compares like outcomes (containment on both sides) | `decoys.detect_traffic_mix` | `findings[f05].not_a_regression_because` | handled |
| FX3 | A02 adjusted: both ends on the common-intent scope; born-in-month-2 named | `asks.py` A02 | `metrics[m_mom_resolution_adjusted].value`, `.breakdown.*.born_in_month2` | handled |
| FX4 | A03 `cost_state`: `unbounded` (0 resolved) vs `cost_unavailable` (no priced resolution) | `asks.py` A03 | `metrics[m_cost_per_resolved_*].breakdown` | handled |
| FX5 | `plan.breakdowns` matches the produced breakdown | `asks.py` (all metrics) | `metrics[].plan.breakdowns` | handled |
| FX6 | A06 files a gap when calibration is unavailable (no silent vanish); CSAT not over-claimed | `asks.py` A06 | `gaps[A06]` | handled |
| FX7 | Regeneration preserves recorded approvals by (id, diagnosis, target) | `run.py`, `report.assemble` | `prescriptions[].approval`, `system_notes` PRESERVED | handled |
| FX8 | Step-grain fallback for by-design handoff and milestones when the session field is absent | `features.by_design_handoff`, `features.milestones_of` | `metrics[m_containment]`, `metrics[m_returns_dropoff]` | handled |
| FX9 | Mix dismissal no longer silently skips small cohorts | `decoys.detect_traffic_mix` | `findings[f05].evidence` | handled |
| FX10 | Window length cap raised from `D//2` to `D` | `series.best_window` callers | `findings[].window` | handled |
| IN1 | z assumes independent sessions; clustering inflates z (high floors offset) | `series.best_window` | `findings[].evidence` z token | state-only |
| IN2 | Multiple comparisons: ~1,500 windows × ~50 cohorts under a fixed z floor | `series.py`, `detect.py` | `findings[].evidence` | state-only |
| IN3 | Winner's curse: window chosen for contrast, effect measured on same days | `series.py` | `findings[].observed/expected` | state-only |
| IN4 | Degenerate zero-variance baseline makes z huge (e.g. z=21 vs 0.0%) | `series.py:131-135` | `findings[f01].evidence` | state-only |
| IN5 | Detection uses Welch SE, mix guard uses pooled SE — same z bar, different tests | `series.py` vs `decoys._rate_moved` | — | state-only |
| IN6 | Detect on mean turns, report median turns (heavy tails disagree) | `detect.detect_efficiency` | `findings[f03].evidence` | state-only |
| IN7 | `diagnoses[].confidence` is an author prior, not a calibrated posterior | `detect.py`, `decoys.py` | `diagnoses[].confidence` | state-only |
| IN8 | Severity is effect size only (no n/significance) | `impact.severity_for` | `findings[].severity` | state-only |
| IN9 | Efficiency conditions on resolved sessions (selection if resolution shifts) | `detect.detect_efficiency` | `findings[f03]` | verify-later |
| IN10 | No cross-tenant control; a global fault is invisible except the judge decoy | `detect.py`, `decoys.py` | — | state-only |
| IN11 | Controls can move with the fault (sick KB peers; all siblings move) | `detect.py` | `findings[].evidence` | state-only |
| IN12 | Small intents: an absolute guard (`MIX_SMALL_TOL`) blocks a large small-cohort move; quiet ones are named | `decoys.detect_traffic_mix` | `findings[f05].evidence` | handled |
| IN13 | Window length cap raised to `D` (`min_days_out` still bounds); long faults now encloseable | `series.best_window` callers | `findings[].window` | handled |
| IN14 | Right-censoring at the corpus edge is unmodeled | `features.py`, `series.py` | — | verify-later |
| SC1 | Loop 8/8 saturates from metrics+links+predicted (replay not needed for the cap) | `score.py` | `metrics/diagnoses/prescriptions` | state-only |
| SC2 | Fidelity+coverage 4 points are automatic for schema-valid reports | `score.py`, schema | `metrics[].fidelity/coverage` | state-only |
| SC3 | Silence is punished: empty findings = 0; unexamined decoy −4.2 vs −1.47 | `score.py` | `findings[]` | state-only |
| SC4 | Fidelity asymmetry: A04 gap hurts (−1.0), A09 gap helps (+0.75) | `score.py` | `gaps[A04]/gaps[A09]` | state-only |
| SC5 | A11 field credit lenient in score.py, strict in the testbed | `score.py`, testbed | `gaps[A11].required_event` | state-only |
| SC6 | The gate is "real" only if a verdict is recorded (0/3 until clicked) | `score.py` judges' checklist, `app.py` | `prescriptions[].approval` | state-only |
| VL1 | Autocorrelation magnitude | — | — | verify-later |
| VL2 | Day-of-week / seasonality sensitivity | — | — | verify-later |
| VL3 | Right-censoring at export | — | — | verify-later |
| VL4 | Coverage computed globally vs per tenant | `coverage.py` | `metrics[].coverage` | verify-later |
| VL5 | Cost missingness MNAR (are expensive sessions unpriced?) | `_cost_coverage` | `metrics[].coverage` | verify-later |
| VL6 | A10 p90 over 56 days vs the last-7-day window | `asks._review_queue` | `metrics[m_review_queue]` | verify-later |
| VL7 | Golden-set fingerprint keys on corpus shape, not content | `standards.freeze_golden_sets` | `prescriptions[].golden_set` | verify-later |
| VL8 | Validation backend differs with/without `jsonschema` installed | `validate.py` | — | verify-later |

---

## 10. Statistical inference caveats (state them, don't hide them)

These are properties of the method, not bugs to fix — they are the "how much
should you trust this" answers. (Ledger rows IN1–IN14.)

- **Independence.** The Welch z treats every session as an independent draw.
  Sessions cluster by day, agent, prompt version and KB version, so the effective
  sample size is smaller than `n` and the z is optimistic. The high z floors (4–6)
  are an informal offset, not a cluster-robust test.
- **Multiple comparisons.** `best_window` maximises over ~1,500 candidate windows
  per series across ~50 cohorts, so an unadjusted z=4 is not a 1-in-30k event. The
  floors plus absolute-lift requirements are the family-wise guard; we say so.
- **Winner's curse.** The window is chosen because it contrasts most, and the
  effect and baseline are then estimated on those same days, so effect sizes are
  inflated. The frozen golden set removes hindsight for *fixes*, not for detection.
- **Degenerate baselines.** "0.0% outside (z=21.0)" is a zero-variance baseline;
  the z is driven by the degenerate outside, not by precision. A rule-of-three or
  an exact interval would be the honest scale.
- **Two z estimators.** Detection uses an unpooled (Welch) SE; the mix-flatness
  guard uses a pooled two-proportion SE. Both compare to ~4.0, so "z ≥ 4" is not
  the same test in the two places.
- **Estimand.** Efficiency detects on mean turns (z, severity ratio) but reports
  median turns; heavy tails make them disagree, so both are printed.
- **Confidence is a prior.** `diagnoses[].confidence` is a hand-set author value,
  not a calibrated posterior; it does not vary with z or n.
- **Severity is effect size only.** No n/significance term, so a 60-session cohort
  can be "critical" while a 5,000-session 6-point drop is "high".
- **Selection on resolution (efficiency).** Turns are measured only on resolved
  sessions, so if a fault changes *which* conversations resolve, the estimate is
  selection-biased.
- **No cross-tenant control by design.** Peers/siblings are same-tenant only, so a
  global model/provider fault is invisible to the detectors (only the judge
  boundary looks across tenants). This avoids tenant confounds at the cost of
  global-fault blindness.
- **Controls can move with the fault.** KB peers must be healthy and siblings must
  not move; if the whole KB degrades, or every sibling moves, the control defeats
  itself and the fault is under-reported.
- **Small cohorts exempt.** The mix-flatness guard only runs for intents with ≥60
  sessions on each side, so a genuine small-cohort drop can be waved away as mix.
- **Window caps.** `max_len = D//2` and `min_days_out = 7` mean a fault longer than
  half the corpus, or one starting in the first week, can fall outside the scan.
- **Right-censoring.** Conversations still open at export are not modelled; a real
  export could show a fake late drop. The simulator always writes an end state, so
  this is latent in-kit but real in production logs.

## 11. Scoring and delivery mechanics (worth knowing)

- **Loop points are already saturated.** Metrics + linked diagnoses + linked
  prescriptions + a predicted delta sum to 9 > the 8 cap, so the loop rubric is
  maxed before any replay. We still run replay because the demo and the testbed
  require a real `rp_` verification.
- **The 4 fidelity+coverage honesty points are automatic** for any schema-valid
  file (both fields are schema-required). The differentiating honesty points are
  the tool-coverage trap C1, the calibration, the A11 refusal, and the A04/A09
  fidelity traps.
- **Silence is punished, not rewarded.** Specificity starts at 15; an empty
  `findings` list scores 0, and an unexamined decoy costs −4.2 when nothing was
  flagged vs −1.47 when something was.
- **Fidelity asymmetry.** An A04 *gap* scores −1.0 (tool failure must be
  measured); an A09 *gap* scores +0.75 (abandonment reason must be judged). Never
  put a gap where a measured number belongs.
- **A11 field credit** needs only one overlapping field for `score.py` but all
  four for the testbed; we always name all four.
- **The gate is only "real" if you click it.** The judges' checklist counts
  recorded verdicts (0/3 until a decision is made). The demo should record a
  verdict on each prescription, and the printed scorecard is taken before any
  decision, so re-score after deciding.
- **Regeneration used to wipe verdicts — now fixed.** Approvals are carried
  forward by (id, diagnosis_id, target) and `run.py` notes PRESERVED.

## 12. Verify-later (data checks for a sealed or other corpus)

- Autocorrelation magnitude; day-of-week/seasonality; right-censoring.
- Coverage computed globally vs per tenant (a tenant-specific emission hole).
- Cost missingness MNAR — are expensive/long sessions preferentially unpriced?
- A10 uses a 56-day p90 but a last-7-day window, so a bad week flags more.
- Golden-set fingerprint keys on corpus shape (`n_sessions/tenants/days`), not
  content — two same-sized sealed corpora would share golden sets.
- `jsonschema` is absent here, so validation falls back to the built-in subset
  checker; an environment with it installed is the stricter authority.
