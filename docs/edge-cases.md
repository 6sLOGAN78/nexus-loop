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
total spend (not last), and they are listed under
`breakdown.unbounded_intents`. The old `cost_per_resolved or 0` key sorted
"cannot compute" as "cheapest"; that is fixed. None exist in the practice corpus
(min resolved per intent is 309), but a hostile sealed corpus can produce them.
> "An intent that spends money and resolves nothing has infinite unit cost — that
> is the loudest row on the page, not a blank one."

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
explicitly dismissed with the scorer's cause class and a written reason.
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
  month, renormalised). It reports `raw`, `adjusted`, `mix_effect = raw − adjusted`,
  and `change_beyond_mix = adjusted − month_1`. The `breakdown` lists the excluded
  intents, the month-1 weights, and any detected event overlapping a month window.

The idea is exactly the teammate's: freezing the fraction-of-people removes the mix
from the comparison, so whatever is left is the agent. Quality is never trended
month over month — the judge-version boundary (4.4) makes that a measurement of the
rubric, not the agent.
> "We hold last month's mix fixed and apply this month's per-intent rates. The gap
> between raw and adjusted is the mix effect; the rest is the agent."

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
