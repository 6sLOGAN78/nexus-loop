# Nexus Loop: data exploration and solution direction

This is a record of what we found in the practice corpus, what the starter program does, and the shortest credible route to a full solution.

Important: the practice kit includes an answer key for learning. We used raw logs for the calculations below, then cross-checked them. Do not hardcode the tenant, day, intent, or exact figures: the sealed run moves the same fault types.

## 1. What this project is in practice

We are building a quality-control loop for an existing AI support agent.

The agent already has an LLM, prompts, a knowledge base, tools, and human handoff. Our program reads its logs and answers:

1. did something genuinely get worse?
2. which exact customers/conversations are affected?
3. is it a prompt, KB, tool, routing, model, or load issue?
4. what small change should the team make?
5. did that change help when replayed?
6. should a human approve it?

The final product is not a chatbot. It is:

- a generated JSON report containing evidence; and
- one decision screen with approve/reject.

The hard part is disciplined analysis, not engineering scale.

## 2. What is in the kit

Location: nexus-loop-day1/

The kit is standard-library Python. No dependency installation is required.

| Item | Value |
|---|---:|
| Days | 56 |
| Sessions | 80,252 |
| Runtime steps | 883,764 |
| Transcript turns | 365,065 |
| Tenants | 2 |
| Intents | 18 |
| Config changes | 16 |
| Human outcome labels | 400 |
| Human quality labels | 96 |

Important supplied files:

| File | Why it matters |
|---|---|
| kit/catalog.json | The real data contract: safe joins, field meanings, coverage, and prohibited comparisons. Read it before coding. |
| kit/asks.md | Eleven operator questions. The system must answer or honestly refuse them. |
| kit/corpus/sessions.jsonl.gz | One row per conversation. |
| kit/corpus/agent_steps.jsonl.gz | One row per internal LLM/tool/KB/guardrail/handoff action. |
| kit/corpus/turns.jsonl.gz | Chat text. Useful for meaning, not for proving technical cause. |
| kit/corpus/config_timeline.csv | Prompt, model, KB, tool, routing, and judge changes. |
| tools/nexus-loop-kit/starter.py | A valid but intentionally weak starting report. |
| tools/nexus-loop-kit/score.py | The exact machine scorer. |
| tools/nexus-loop-kit/replay/serve.py | The before/after replay endpoint. |

The 5% corpus_sample directory contains whole sessions, so it is safe for quick iteration. Confirm every final finding on the full corpus.

## 3. The data model we must not mess up

There are three levels of data:

| Level | Meaning | Use it for |
|---|---|---|
| Session | One whole conversation | resolution, handoff, abandonment, turns, duration, session cost |
| Step | One internal action in a conversation | tool result, retry, KB hit, LLM cost, latency, error, guardrail |
| Turn | One user/bot exchange | transcript examples and semantic judging |

One session contains many steps. A raw session-to-step join repeats session rows. If our final metric is per conversation, first aggregate the relevant steps into one session-level feature.

Example: do not calculate order-status resolution after joining each session to its tool calls. A retried conversation would get counted twice. Instead calculate features such as:

    has_empty_tool_success
    number_of_same_tool_retries
    kb_hit_rate
    tool_error_count

per session, then join those once to the session outcome.

Transcripts cannot identify root cause by themselves. A timeout, a KB miss, a guardrail block, and a tool failure can all make the bot say sorry. Runtime steps prove the technical reason.

## 4. Overall observations

| Tenant | Sessions | Resolution | Handoff | Abandonment | Median turns | Mean session cost |
|---|---:|---:|---:|---:|---:|---:|
| Acme Bank | 29,522 | 80.71% | 13.37% | 5.92% | 4 | $0.04537 |
| Northwind Retail | 50,730 | 78.69% | 15.58% | 5.73% | 4 | $0.04398 |

The starter reports containment at 84.03%. Containment is:

    resolved sessions
    + handoffs explicitly marked handoff_by_design
    ------------------------------------------------
                 all sessions

Not every handoff is bad. Some are designed into the agent.

## 5. Coverage: the first honesty trap

Legacy v2 flow traffic does not emit tool-call, KB-lookup, guardrail, or LLM-cost steps.

| Tenant | v3 share / coverage for tool, KB, and cost metrics |
|---|---:|
| Acme Bank | 72.05% |
| Northwind Retail | 93.08% |

Therefore we can report a tool-failure rate for v3 traffic, but we cannot pretend it describes all traffic. Missing telemetry is not zero errors.

Good wording:

> Northwind tool failure rate was 2.63% of v3 tool calls, with 93.08% session coverage.

Bad wording:

> Northwind tool failure rate was 2.63% of all conversations.

## 6. Real problem one: premium-card KB gap

Cohort:

    tenant: acme-bank
    intent: premium_card_info
    window: days 34 to 44

| Metric | Premium-card cohort | Healthy product-info cohort in same window |
|---|---:|---:|
| Sessions | 230 | 852 |
| Resolution | 30.87% | 75.70% |
| Handoff | 63.04% | 18.08% |
| Abandonment | 6.09% | 6.22% |
| Median turns | 6 | 5 |
| Mean cost | $0.05747 | $0.04735 |

Runtime evidence:

- 606 KB lookup steps happened in this cohort.
- KB hit rate was 0%.
- The top retrieval score ranged only from 0.11 to 0.38.
- Day 34 has an Acme KB change connected to the premium-card launch.

Interpretation:

This is almost certainly a retrieval/content gap. The agent is not necessarily reasoning badly; it has no confident material to ground an answer on. It gives generic answers and routes people to humans.

Why the analysis is interesting:

The intent begins on day 34. It has no earlier healthy period, so we cannot compare it with itself before the failure. The fair baseline is similar healthy informational intents in the same tenant and time period, such as product_info.

Best proposal:

    change type: kb.add
    target: premium_card_info
    change: index verified information about fees, eligibility, benefits,
            comparison questions, and likely user phrasing/synonyms.

This is likely the cleanest full-loop demo: strong diagnosis, small reversible fix, and low risk.

## 7. Real problem two: silent order-status tool failure

Cohort:

    tenant: northwind-retail
    intent: order_status
    tool: get_order_status
    compare: days 28 to 39 against days 40 to 51

| Metric | Before | During | Meaning |
|---|---:|---:|---|
| Sessions | 2,895 | 2,686 | Similar population size |
| Resolution | 85.22% | 77.55% | Real customer outcome decline |
| Handoff | 9.19% | 16.98% | More unnecessary human work |
| Ordinary tool error rate | 1.45% | 1.56% | Almost flat; normal dashboard misses it |
| Empty successful responses | 0 | 382 of 2,823 = 13.53% | Actual fault |
| Same-tool retries | 0 | 323 | Agent behavior confirms it |

Timeline evidence:

    day 40
    tool: get_order_status
    version: 3.2.0 to 3.3.0
    note: order service migration

Interpretation:

A 200 response and runtime outcome ok only say the HTTP request returned. They do not prove that the agent received useful data.

This is an application contract failure:

    transport success: HTTP 200
    agent success: expected order fields are present and usable

The empty response causes retries and eventually unresolved conversations or handoffs.

Best proposal:

    change type: tool.validate
    target: get_order_status
    change: require non-empty response and expected order fields before
            sending results to the LLM. On invalid result, take explicit
            fallback/handoff behavior.

Risk to mention:

An empty payload might represent a legitimate business state, for example a new or cancelled order. Confirm the contract with the orders/platform owner before shipping.

This is probably the strongest demo story because it combines tool calling, agent behavior, observability, product impact, and human approval.

## 8. Real problem three: prompt regression hurts efficiency

Cohort:

    tenant: acme-bank
    agent: acme_main_v3
    compare: days 34 to 45 against days 46 to 55

| Metric | Before, p_v3 | During, p_v4 | Change |
|---|---:|---:|---:|
| Sessions | 1,452 | 1,224 | - |
| Resolution | 78.93% | 80.31% | Flat/slightly higher |
| Median turns | 4 | 6 | +50% |
| Mean turns | 4.514 | 7.015 | +55% |
| Mean cost | $0.04378 | $0.07994 | +83% |
| Handoff | 15.15% | 12.58% | Not worse |

Timeline evidence:

    day 46
    prompt: acme_main_v3, p_v3 to p_v4
    note: safety and confirmation wording

Interpretation:

An outcome-only dashboard says the bot is fine. It is not fine: users need extra turns and serving cost rises sharply. The prompt likely makes the agent over-confirm.

Best proposal:

    change type: prompt.edit or revert
    target: acme_main_v3
    change: remove or narrow redundant confirmation instructions while
            retaining necessary safety requirements.

The replay metric should be turns or cost, but guard against lower resolution or worse golden-set behavior.

## 9. The three lookalikes we must explicitly dismiss

### Marketing mix shift

At Acme Bank, branch-locator traffic becomes much more common:

| Window | Overall resolution | Branch-locator share | Branch-locator resolution |
|---|---:|---:|---:|
| Days 10 to 21 | 81.43% | 13.26% | 90.92% |
| Days 22 to 31 | 83.24% | 43.69% | 89.88% |

Aggregate resolution rises because many more people ask an easy question. This is not agent improvement.

Rule: always look inside intent cohorts before claiming aggregate quality changed.

### Flash sale / load event

At Northwind:

| Window | Sessions per day | Tool p95 latency | Tool error rate | Resolution |
|---|---:|---:|---:|---:|
| Days 0 to 11 | 758 | 1,320 ms | 2.24% | 80.09% |
| Days 12 to 15 | 2,696.5 | 3,152 ms | 5.05% | 77.69% |
| Days 16 to 27 | 741.4 | 1,323 ms | 1.97% | 79.17% |

This is a short-lived load/reliability event. It self-corrects. We should mention it as a monitored incident if useful, but not call it a sustained agent-quality regression.

### Judge-version boundary

| Window | Mean judged quality | Judge version |
|---|---:|---|
| Days 16 to 27 | 3.880 | v1 |
| Days 28 to 39 | 3.276 | v2 |

The quality rubric becomes stricter globally on day 28. The measurement changed, not necessarily the agent.

Rule: do not compare quality scores across judge versions. Compare within a version or re-score both periods with one fixed judge.

## 10. A11 and the other key operator questions

The four most important asks:

| Ask | What we should do |
|---|---|
| A01: share handled end to end | Measured containment. Include designed handoffs. |
| A04: how often did a tool fail | Measured from tool logs. State coverage. Never use an LLM for this. |
| A09: how many gave up from frustration | Abandonment is measured; frustration is a semantic judgment and needs a calibrated LLM judge. |
| A11: failover rate | Not measurable. No failover mechanism or event exists. |

For A11, the honest gap is:

    verdict: NOT_MEASURABLE
    missing event: failover, at step grain
    fields: from_target, to_target, reason, recovered
    owner: conversation-runtime

A retry is not a failover. It may be the same target retried and would create a misleading fake proxy.

## 11. What starter.py actually gives us

Starter command:

    python3 nexus-loop-day1/tools/nexus-loop-kit/starter.py
      --kit nexus-loop-day1/kit --team demo --out /tmp/report.json

It:

1. streams the supplied data;
2. prints corpus orientation;
3. writes a valid report;
4. implements containment and tool-failure rate correctly;
5. measures tool coverage separately by tenant.

It deliberately does not implement any findings, diagnoses, standards, gaps, judged calibration, prescriptions, replays, or decisions.

Its expected score is 9.8 out of 55 machine points. This is not a solution; it is boilerplate and a safe pattern to build on.

Machine score:

| Section | Points |
|---|---:|
| Diagnostic accuracy | 20 |
| Specificity / no false alarms | 15 |
| Loop completeness | 8 |
| Honesty | 12 |

Human score:

| Section | Points |
|---|---:|
| Decision quality | 18 |
| Screen | 15 |
| Framing/transparency | 12 |

Required report sections are metrics, findings, diagnoses, and gaps. Standard, prescriptions, verifications, and self-assessment earn extra loop points.

## 12. Solution architecture

Keep it report-first and simple.

    raw files
      -> loader
      -> session feature table
      -> metrics and cohort comparisons
      -> candidate detectors plus decoy suppression
      -> diagnosis/config matching
      -> loop-report.json
      -> replay verification
      -> tiny report-driven UI and human decision

Suggested modules:

    io.py          reads JSONL.gz and config CSV
    features.py    turns raw step facts into one row per session
    metrics.py     metric definitions with coverage and fidelity
    cohorts.py     filters, groupings, comparisons
    detectors.py   KB, tool, efficiency, and decoy rules
    diagnose.py    gathers evidence and nearby config changes
    standards.py   mines healthy reference cohorts/golden sets
    report.py      builds valid report JSON
    replay.py      calls replay endpoint and saves response
    app.py         minimal UI/API and decision persistence
    run.py         one sealed-run command

Do not overbuild agent orchestration. Deterministic Python should handle nearly all detection. An LLM should only be used for semantic questions that logs cannot answer.

## 13. Generic detectors to implement

### KB gap detector

For tenant, intent, and time window:

- find a sharp resolution deficit or a new intent;
- check KB lookup coverage;
- check KB hit rate and top-score distribution;
- compare against healthy peer intents;
- exclude a known tool problem first.

Candidate rule:

    low resolution relative to peers
    + low KB-hit rate
    + no stronger tool failure signal
    = likely KB gap

### Silent tool-success detector

For tenant, tool, intent, and window:

- calculate ordinary tool error rate;
- calculate empty-success rate:
  outcome is ok, HTTP status is 200, and result field count is zero;
- compare before and after tool changes;
- check retries and session outcomes.

Candidate rule:

    empty-success rate rises
    + retry rate rises
    + related intent resolution falls
    = likely tool contract break

### Efficiency regression detector

For tenant, agent, and prompt/model window:

- compare median/mean turns;
- compare cost and duration;
- check resolution/handoff;
- look for prompt/model changes near onset;
- compare to peer agents to avoid broad load effects.

Candidate rule:

    turns/cost rises materially after change
    + resolution is flat or worse
    + peers do not have the same rise
    = likely prompt/model regression

### Decoy suppression

Make dismissal rules explicit:

- aggregate moves but intent cohorts stable -> traffic_mix, not a regression;
- traffic/latency spike self-corrects and quality stays stable -> load, not quality regression;
- judged metric crosses a judge-version boundary -> judge_change, comparison blocked.

## 14. Baselines and standards

There is no universal baseline.

| Situation | Fair baseline |
|---|---|
| Existing intent after a change | Same intent before the change |
| New intent with no history | Similar healthy peer intents in same period |
| Prompt efficiency change | Same agent on earlier prompt version |
| Aggregate change | Within-intent cohorts |
| Judged quality | Same judge version only |

A standard is simply a data-backed description of good agent behavior. For example:

    healthy product-question conversations
    resolved, no KB miss, no tool error
    same tenant and judge version
    -> expected resolution and turn range

We must not change standards, metric definitions, judge version, or golden set to make a fix look better. That is moving the goalposts.

## 15. Replay and UI

Replay takes tenant, change type, cohort window, and a golden set. Each team has 40 runs. Use it after forming a hypothesis, not to brute-force discovery.

A wrong change returns no_effect. That is a meaningful result.

The one UI can be very small:

    finding title and severity
    observed result vs baseline
    affected cohort and impact
    diagnostic evidence + config timeline
    proposed change, owner, and risk
    replay before/after and golden-set result
    approve / reject / defer plus reason

The decision must be written back into a persisted report/decision record.

## 16. Realistic build order

### First 1 to 2 hours

- Run starter and score.
- Read catalog, asks, schema, and examples.
- Add A11 gap.
- Build loader and session-level feature aggregation.

### Next 2 to 3 hours

- Build metric helpers with fidelity and coverage.
- Create daily/weekly scorecards by tenant, intent, agent, and tool.
- Implement the KB, silent-tool, and efficiency detectors.
- Add explicit decoy dismissals.

### Next 2 hours

- Generate report findings and diagnoses.
- Mine one healthy standard.
- Pick KB or tool issue as primary end-to-end loop.
- Start replay server and run one carefully chosen proposal.

### Final 2 hours

- Save replay response in report.
- Build minimal report-driven UI.
- Persist an approval/rejection.
- Run on full corpus, validate schema, run score, and ensure one command rebuilds output.

## 17. Best demo / product direction

Call the project an agent regression workbench.

The clearest demonstration is the order-status tool issue:

> Normal monitoring said the tool was healthy because it returned 200. We detected that successful responses were empty, linked it to the migration, showed retries and lower resolution, proposed response validation, replayed it on the affected cohort, checked a golden set, and gave an operator a safe approval decision.

That story shows agentic understanding, product thinking, data rigor, and safe human-in-the-loop behavior.

## 18. Rules we should not break

1. Use logs for logged facts. Do not use an LLM to decide whether a tool failed or handoff happened.
2. Every metric needs fidelity and coverage.
3. Do not compare judged quality across judge versions.
4. Do not count missing tool telemetry as no-error traffic.
5. Do not call every anomaly a regression.
6. State the exact baseline and why it is fair.
7. Refuse questions the data cannot answer.
8. Do not hardcode the practice answer key.
9. Do not make a fix look good by changing the yardstick.

