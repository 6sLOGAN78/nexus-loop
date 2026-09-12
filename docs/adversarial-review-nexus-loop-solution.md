# Adversarial review: Nexus Loop solution design PDF

## Review scope

This reviews nexus-loop-solution.pdf as a design proposal, not as a working code submission. It was checked against:

- kit/catalog.json
- kit/asks.md
- tools/nexus-loop-kit/starter.py
- tools/nexus-loop-kit/score.py
- tools/nexus-loop-kit/replay/serve.py
- tools/nexus-loop-kit/schema/loop-report.schema.json
- raw practice corpus calculations

The short verdict:

> It is a well-written, strategically aware design document. It correctly understands most of the game. However, it sounds more complete than it is, has several factual mismatches with the kit, and over-designs parts that should be implemented as simple deterministic functions. It is a strong source of product framing and architecture ideas, but should not be copied as an implementation plan without corrections.

## Scorecard

| Area | Assessment | Reason |
|---|---|---|
| Reading the rubric | Strong | Correctly values honesty, explicit decoy dismissal, and a complete decision loop. |
| Product framing | Strong | Treats a finding as a human decision, not a chart. |
| Deterministic-first agent evaluation | Strong | Correctly keeps logged facts out of LLM inference. |
| Baseline thinking | Good, with important caveats | The three baseline idea is useful, but its peer-baseline description is partially wrong. |
| Data-contract accuracy | Mixed | Several catalog-specific details are misstated or too vague. |
| Detector design | Mixed | Good ideas, but segmentation is too narrow to safely find all real patterns. |
| Replay strategy | Weak | Wastes scarce attempts and misunderstands what the endpoint can teach. |
| UI / decision layer | Good | Report-backed screen and recorded human decision are exactly right. |
| Sealed-run readiness | Good intention, incomplete execution detail | Correct anti-hardcoding instinct, but no robust concrete interface or test plan. |
| Scope control | Mixed | Correctly prioritises depth, but adds needless architecture/CI/hash theatre. |

---

# 1. Ideas worth taking

## 1.1 Depth on one full loop beats a wide but shallow build

The proposal correctly reads the scoring tradeoff:

    finding -> impact -> diagnosis -> proposed fix -> replay -> human decision

A polished complete loop on one real issue, plus all decoys dismissed and A11 refused, is better than three vague findings and a fancy dashboard.

Keep this as our core delivery rule.

## 1.2 The report should be the single source of truth

The suggestion that the report generator and screen share one structured finding model is excellent.

It prevents a common demo failure:

- JSON says one number;
- UI has a manually typed different number;
- judges ask where a chart came from;
- nobody can reproduce it.

Our UI should render generated report data. The approve/reject action can update a decision record that is merged into the final report.

## 1.3 Every metric should carry metadata at calculation time

The proposal’s “number passport” is a good mental model:

    value
    fidelity: measured / derived / judged
    coverage
    calibration when judged
    denominator / derivation

This should be part of the metric helper’s return type, not prose added late before demo.

## 1.4 Explicit decoy dismissal is a first-class feature

Correct. The scorer gives specificity credit for findings marked as not regressions, with a matching diagnosis cause class:

- traffic_mix
- load
- judge_change

We should build these output records intentionally, not merely avoid emitting false positives.

## 1.5 Agent changes must be small and decision-shaped

The proposal’s fix framing is strong:

- what exactly are we asking the human to approve?
- what happens if the diagnosis is wrong?
- what would make us not ship it?

This is much better than writing “fix KB” or “improve prompt.”

## 1.6 Cold-run and anti-hardcoding mindset

One unattended entrypoint and a clean-corpus drill are exactly the right operational goal. The sealed run should not depend on notebook state, manual editing, or practice tenant names.

---

# 2. Critical factual issues

These should be fixed before borrowing the proposal.

## 2.1 The A11 failover event specification does not match the kit

The PDF proposes:

    event: failover_triggered
    fields: conversation_id, timestamp, from_target, to_target,
            trigger_reason, success

The catalog and scorer expect the useful missing event to be:

    name: failover
    grain: step
    fields: from_target, to_target, reason, recovered
    owner: conversation-runtime

This is not cosmetic. The scorer explicitly checks overlap with its expected fields. The PDF’s version only overlaps on from_target and to_target; it misses reason and recovered.

Correct report wording:

    NOT_MEASURABLE: no runtime failover mechanism exists.
    Required event: failover at step grain, with from_target,
    to_target, reason, recovered; owner conversation-runtime.

Also state why retry_count is misleading: retries are quality retries, not switches to an alternate primary/secondary target.

## 2.2 The KB peer baseline should not use “same intent-family, other tenants”

The PDF proposes comparing the new Acme premium-card cohort with “same intent-family, other tenants.”

The catalog does not define a cross-tenant intent family. Acme Bank and Northwind Retail are different verticals with different intents, agents, tools, traffic, and business journeys. Comparing a bank product-information intent to a retail sizing-help intent is a weak and unnecessary control.

Better baseline for the no-before-period KB issue:

- same tenant;
- same time window;
- comparable informational or KB-backed intents;
- preferably same agent/agent family when available;
- healthy conversations from the deployment’s own mined standard.

The reference Level 3 report uses other question-answering intents on the same agent in the same window. That is a much safer comparison.

## 2.3 The KB issue does align with a configuration change

The PDF says the KB gap should have “onset at the launch date rather than at any config change.”

In practice, day 34 contains the KB change:

    Acme Bank KB, kb_2026_06_a to kb_2026_06_c
    note: premium card launch content pack

The issue is a launch/content-pack failure that coincides with a KB deployment marker. The design should not claim there is no config candidate. A correct diagnosis can say the product launch/change had inadequate retrievable coverage.

## 2.4 “Double the conversation length” is inaccurate for this practice fault

The prompt regression has:

- median turns: 4 to 6, a 50% increase;
- mean turns: 4.514 to 7.015, about 55%;
- mean cost: $0.04378 to $0.07994, about 83%.

“Roughly double tokens and user time” is plausible only if separately measured and calculated. It should not be asserted from the supplied summary. Use actual measured turns/cost in the report.

## 2.5 Cardinality-budget logic is wrong or too loose

The PDF says to refuse fields that exceed “a threshold relative to row count” and says the customer reference may remain usable as a join key.

The catalog declares a fixed budget:

    session.custom_dims.customer_ref budget = 200

The rule is: a breakdown whose distinct value count exceeds the declared budget must be refused, citing that budget. Do not invent a relative threshold.

The catalog also does not declare customer_ref as a safe join key. The safe join key is session_id. Do not encourage joining on customer_ref without catalog support.

## 2.6 The cost assumption is dangerous

The PDF says it will use “per-token and per-human-handoff price constants” because real unit economics are unavailable.

Session and LLM cost are actually available for v3 traffic. The report can sum the recorded cost_usd and explicitly state coverage. Adding an invented per-human-handoff price to report impact is not supported by the corpus and risks violating the requirement that figures be computed from data.

Recommendation:

- report recorded agent cost where available;
- report additional handoffs as counts;
- phrase human-operation cost qualitatively unless organisers provide a price constant;
- if a hypothetical price is used for a demo, label it clearly as a stub and never make it the only impact evidence.

---

# 3. Important design weaknesses

## 3.1 The detector segmentation is too narrow

The PDF says detection segments only:

    intent x tenant x week

That is insufficient for the actual fault classes.

- The silent tool issue needs tool_name and often agent/intent.
- The prompt issue is scoped by agent_id, not one intent.
- Quality comparisons need judge_version.
- Coverage and behavior differ by agent_kind.
- Configuration impact may be scoped to model, prompt_version, KB version, channel, or routing target.

Better approach: use a small number of detector-specific dimensions.

| Detector | Required dimensions |
|---|---|
| KB gap | tenant, intent, agent_id, day/window, KB version |
| Tool contract break | tenant, tool_name, intent, day/window, tool version if inferred |
| Prompt/model efficiency | tenant, agent_id, prompt/model version, day/window |
| Traffic mix | tenant, intent, day/window |
| Judge boundary | judge_version, tenant, day/window |
| Coverage | tenant, agent_kind |

Do not brute-force every possible Cartesian product. Each detector owns a safe grouping.

## 3.2 “Every candidate must align to a config change” is too rigid

The PDF requires every candidate to align to a config change or external verifiable event before becoming a finding.

It is good evidence when present, but a robust monitoring system should not suppress a genuine sustained degradation merely because its causal change marker is missing. The schema allows cause_class unknown. The right behavior is:

- high-confidence diagnosis when timing, slice, mechanism, and change align;
- a measured finding with diagnosis unknown or no config candidate when only the outcome/mechanism is proven;
- no speculative blamed change.

For this challenge, the planted faults are attributable, but sealed-run robustness improves when observation and attribution are separate.

## 3.3 “Validate every field against catalog and quarantine unknowns” is brittle

The catalog is a semantic planning contract, not necessarily an exhaustive raw-column schema. Rejecting/quarantining fields not enumerated there can accidentally remove useful raw information or cause unnecessary sealed-run failures.

Safer ingest behavior:

- validate required known keys for each file;
- preserve unknown fields;
- only use dimensions/measures that the catalog authorises;
- fail clearly if a needed known field is missing;
- record unavailable capability as a gap.

## 3.4 Streaming single pass is not a realistic description of the proposed analysis

The PDF claims streaming single-pass ingest while also needing:

- before/after baselines;
- several groupings;
- session-step aggregation;
- config matching;
- standard mining;
- impact derivations;
- labels and golden-set selection.

This can be done with a few deterministic passes and compact aggregation dictionaries. Pretending it is a strict single pass adds complexity without scoring benefit.

For 80k sessions and 884k steps, a straightforward in-memory session map plus streaming steps is completely reasonable. Optimise only if measurement shows a problem.

## 3.5 The standard-mining recipe needs fixed, explicit rules

“Top conversations selected by deterministic outcomes plus sparse human ratings” is directionally good but underspecified.

Questions the implementation must answer:

- Are sparse ratings required or optional?
- What happens for intents without ratings?
- Which judge version is allowed?
- What threshold is applied?
- How do we freeze the selected golden-set IDs before proposing a fix?
- Is the standard per intent, per agent, or intent family?

A workable first version:

1. select sessions in a pre-change or same-version period;
2. require measured resolution and no unplanned handoff;
3. exclude tool errors / KB misses only when relevant telemetry exists;
4. calculate an intent-or-agent standard from top-decile efficient sessions;
5. persist the selected session IDs and derivation in the report;
6. never recalculate that selection after a prescription.

## 3.6 The judge discussion overpromises calibration

The PDF claims expected agreement should “plateau around 0.92–0.93” because human disagreement is 7.5%.

That is not justified by the kit. Human disagreement does not mathematically provide a universal calibration ceiling, and the supplied example reports 0.87 for quality and 0.71 for abandonment reason.

Also, outcome labels and quality labels represent different tasks. Do not combine them into one generic agreement score. A new frustration/abandonment judge needs its own labeled or reviewed calibration set.

Safer statement:

- publish actual held-out agreement and n;
- never report suspiciously perfect 1.00;
- use separate versions/calibrations for distinct judgment tasks;
- skip an LLM judge if it does not materially help a required ask.

## 3.7 The “measurability engine answers asks from catalog” wording is misleading

The catalog tells us what may be measurable. It does not answer A01 through A10 by itself.

The system still needs query/metric implementations. The engine should have:

    ask specification
    -> metric/query plan
    -> capability/coverage check
    -> computed answer or structured gap

This matters because a superficial catalog-only answer would be no more than a glossary.

---

# 4. Replay strategy: the weakest part

## 4.1 Do not waste runs on intentional null or wrong fixes

The PDF suggests:

- 4 runs on a null fix and deliberately wrong fixes to learn variance;
- up to 20 iterations;
- a control cohort per attempt;
- 8 attempts reserved for sealed week/demo contingency.

This is poor advice for the supplied endpoint.

Why:

1. There are 40 attempts per team.
2. The endpoint deliberately returns the same no_effect for a wrong fix and a cohort with no active fault.
3. The endpoint uses deterministic seeded output for tenant/change/cohort. It is not a normal stochastic experiment that needs calibration runs.
4. Practice and sealed service state/budgets are not documented as transferable, so “reserve for sealed week” may have no meaning.
5. A control cohort is not required by the replay contract and spends budget without directly improving the scored verification.

Better replay policy:

- do all diagnosis offline first;
- choose one high-confidence direct fix;
- use one replay on the exact active cohort with a small frozen golden set;
- if successful, save the real rp_ run ID and values;
- use a second run only for a materially different valid fix or a needed confirmation;
- retain budget for another real finding or recovery from an input mistake;
- record no_effect honestly instead of fishing for a positive result.

The replay endpoint verifies a hypothesis; it is not a discovery or statistical-calibration service.

## 4.2 Golden-set selection must be defined before replay

The PDF correctly mentions golden-set protection but does not operationalise it.

A simple, defensible golden set can be:

- 20 to 50 known-good sessions;
- same tenant and related agent/intent family;
- selected before proposal;
- fixed IDs stored in standard/golden-set metadata;
- no sessions from the known fault cohort;
- reported with replayed count and regression count.

Do not dynamically choose a golden set after seeing replay output.

---

# 5. UI and persistence review

## What is good

- One screen focused on one decision is appropriate.
- Showing a dismissed decoy and A11 refusal in the evidence zone is memorable and scores framing.
- Requiring a decision reason is strong product behavior.
- Rendering directly from report data is correct.

## What needs care

### “Static HTML plus endpoint appends to report” is underspecified

A static page cannot mutate a file without a server. A tiny stdlib HTTP server is fine, but file writes should be safe:

1. read report;
2. update only the target prescription approval;
3. write a temporary file;
4. atomically replace the report;
5. validate report shape again;
6. optionally also write an append-only decisions audit file.

For the demo, a small local server is enough. At larger scale, report JSON is not a multi-user decision database.

### One screen must still make the primary finding obvious

Do not cram all metrics, all asks, and all findings into a single dense card. The default screen should open on:

- one real verified finding;
- its impact and evidence;
- its prescription and decision;
- a compact “other observations” area for decoys/refusal.

---

# 6. What we should borrow, change, and reject

## Borrow directly

- Report is the source of truth for UI.
- Findings must include owner, impact, consequence of inaction, baseline, and derivation.
- Explicit dismissal engine.
- A11 early.
- Deterministic-first analysis.
- One unattended run command.
- Depth before breadth.
- Human approval is an outcome, not a cosmetic button.

## Borrow with corrections

| Idea from PDF | Corrected version |
|---|---|
| Three baselines | Use detector-specific baselines, not one rigid three-way comparison for every segment. |
| Peer comparison | Same tenant and comparable agent/intent behavior; avoid cross-tenant intent-family assumptions. |
| Frozen yardstick | Freeze metric/judge/golden-set config and store version/hash, but implement it simply. |
| Standard mining | Use a deterministic, explicit eligibility rule and frozen session IDs. |
| Streaming | Stream files where convenient, but allow a few aggregation passes/in-memory maps. |
| Cardinality refusal | Use catalog’s declared budget exactly, not a made-up dynamic threshold. |
| Cost impact | Use recorded v3 cost; avoid invented handoff-dollar values. |
| Replay guard | Use a preselected golden set and a very small number of high-confidence runs. |

## Reject

- Wrong A11 failover event contract.
- Cross-tenant “same intent family” baseline.
- Statement that the KB issue lacks a config candidate.
- Claim that prompt behavior doubled without calculating it.
- Null/wrong replay “calibration” runs.
- Overconfident expected judge-calibration ceiling.
- Quarantining all catalog-unknown fields.
- Claiming customer_ref is a safe join key.
- Architecture theatre such as mandatory CI linting/config hashes unless actually implemented and tested.

---

# 7. Bottom-line assessment

This is the kind of document that could impress judges in a planning round because it speaks the rubric’s language. The best parts are its disciplined framing: facts from logs, decision-ready findings, explicit refusals, and a report-backed human approval flow.

But the successful submission is not the PDF. It is a compact implementation that gets the catalog details right, produces valid scoreable JSON, survives the sealed dataset, and does not burn its replay budget.

Our strongest approach is simpler than this document:

1. session-level feature table from raw logs;
2. three detector-specific analyses;
3. explicit decoy outputs and A11;
4. one complete KB or silent-tool loop;
5. small report-driven UI;
6. full-corpus cold run.

That is more likely to score well than reproducing every claimed subsystem in the PDF.

