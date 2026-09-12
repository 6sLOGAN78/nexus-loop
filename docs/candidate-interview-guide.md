# Nexus Loop interview guide

## Purpose

This is not an interview for someone who can recite agent buzzwords or produce a dashboard with an LLM. We want generalists who can read a technical problem carefully, reason from evidence, design a simple reliable system, and improve an AI agent without fooling themselves.

The project does not need specialists locked into roles. Every strong candidate should understand the whole loop:

    logs -> metric -> cohort comparison -> finding -> diagnosis
    -> proposed agent change -> replay -> human decision -> report

The best candidates will be able to work anywhere in that loop and know when a claim is not supported by data.

## What we want in a candidate

### Must-have traits

1. **Read-the-brief discipline**
   - Notices hard rules, report schema, required asks, and sealed-run constraints.
   - Does not make assumptions that contradict the catalog.

2. **Data reasoning**
   - Understands grain, joins, numerator/denominator, coverage, cohorts, baselines, and confounders.
   - Does not use a global average to diagnose a local regression.

3. **Agentic systems intuition**
   - Understands prompt, RAG/KB, tool contracts, retries, routing, handoffs, latency, cost, and golden-set regression risk.
   - Knows HTTP 200 does not necessarily mean useful tool output.

4. **Product judgment**
   - Can turn a metric into an operator decision: impact, owner, risk, and no-ship condition.
   - Understands that rejection can be the right decision.

5. **Architecture judgment**
   - Can describe a small, reproducible pipeline and avoid unnecessary complexity.
   - Values report-as-source-of-truth, schema validation, deterministic facts, and one-command execution.

6. **Intellectual honesty**
   - Says “not measurable” when appropriate.
   - Separates observation, hypothesis, diagnosis, and verification.

### Nice-to-have traits

- Has built or debugged a tool-using/RAG agent.
- Can write Python that processes JSONL/gzipped data.
- Has worked with evaluation datasets, LLM judges, or experiment design.
- Can explain technical reasoning simply and challenge bad assumptions constructively.
- Thinks about UI as decision support, not decoration.

### Do not overvalue

- Knowing the supplied practice answer key.
- Fancy multi-agent architecture.
- Framework/library name-dropping.
- Perfect polished vocabulary without a concrete derivation.
- “I will use an LLM to analyse every conversation.”

---

# Interview format

Suggested duration: 25 to 30 minutes.

| Section | Time | Goal |
|---|---:|---|
| Warm-up / mental model | 3 min | Check they understand the task itself. |
| Core PS questions | 10 min | Test attentiveness and data/agent reasoning. |
| Mini-case | 8 min | Test architecture, diagnosis, and product judgment. |
| Adversarial follow-ups | 5 min | Test whether their answer survives pressure. |
| Candidate questions | 2 min | Observe curiosity and collaboration. |

Ask the same core questions of everyone. Use follow-ups only where needed. Do not turn this into a trivia contest; reward clear reasoning and correction after a prompt.

---

# Scorecard

Score each category 0 to 4.

| Category | 0 | 2 | 4 |
|---|---|---|---|
| PS comprehension | Treats it as a chatbot/dashboard task | Knows detect/diagnose/fix in broad terms | Explains two deliverables, decision loop, decoys, gaps, replay, and sealed run accurately |
| Data correctness | Cannot distinguish rows/metrics | Knows basic averages/rates | Explains session vs step grain, coverage, denominators, safe comparison, and joins |
| Agent insight | Generic prompt/RAG talk | Knows tools and KB can fail | Diagnoses prompt/KB/tool behaviors using concrete logged signals and safe fixes |
| Causal reasoning | “metric changed, so config caused it” | Mentions before/after | Uses affected cohort, baseline, mechanism, controls, config timing, and replay |
| Product thinking | Wants charts | Mentions impact | Frames a specific human decision, owner, risk, no-ship condition, and decision persistence |
| Architecture | Proposes a pile of agents/frameworks | Describes ingestion and UI | Proposes a small deterministic report-first pipeline that survives sealed run |
| Honesty / judgment | Fabricates unsupported metrics | Mentions uncertainty | Refuses A11 correctly, limits LLM use, and calls out coverage/judge-version limits |
| Communication | Vague or jargon-heavy | Understandable | Clear, structured, concise; states assumptions and asks good questions |

Suggested interpretation:

- 27 to 32: strong pick; likely makes the team better across the whole project.
- 21 to 26: good pick; can contribute with normal coordination.
- 15 to 20: possible, but needs close direction or has a notable gap.
- Below 15: likely to create convincing-looking but unreliable work.

A candidate who scores low on honesty/data correctness should not be rescued by strong frontend or prompt-engineering claims. Those mistakes can disqualify the solution.

---

# Core questions

## 1. Explain the problem to a non-technical operator

Ask:

> In one minute, what are we building, and what are the two things we submit?

A strong answer includes:

- A quality-improvement loop for an existing deployed agent, not a new chatbot.
- It reads logs, finds a real issue, explains it, proposes a bounded fix, verifies it on replay, then asks a human to decide.
- A generated loop-report.json and one operator screen with working approve/reject.
- The operator needs evidence and action, not a chart.

Red flags:

- “We will make a chatbot to analyse conversations.”
- Only mentions a dashboard.
- Ignores the report, replay, or human decision.
- Thinks auto-deploying fixes is required.

Follow-up:

> Why is the approve/reject control part of the product, not just UI?

Good answer: it keeps the human accountable for production changes; it records the decision and makes risk/no-ship conditions explicit.

## 2. What is the difference between a session, a runtime step, and a transcript turn?

Ask:

> The corpus gives sessions, agent steps, and turns. How would you use each, and what join bug are you trying to avoid?

A strong answer includes:

- Session = one conversation; outcomes such as resolution, handoff, abandonment, total turns.
- Step = one internal action; tool response, retry, KB hit, latency, tokens, guardrail.
- Turn = text exchange; useful for semantic review, not technical root cause.
- Steps are many-to-one with sessions. Aggregate step facts per session before calculating session outcome metrics.

Red flags:

- Joins all tables and groups afterwards without discussing fan-out.
- Uses transcript apology text as proof that an API timed out.
- Calls a step a conversation.

Follow-up:

> A session retried the order-status tool twice. If you join sessions to raw steps and calculate resolution, what goes wrong?

Good answer: that one session can be counted multiple times; retries can bias the calculated session resolution. Build a session feature first.

## 3. Explain denominator versus coverage

Ask:

> Tool failure rate is 2%. What else must the report tell us before we trust it?

A strong answer includes:

- Denominator: which tool calls/events were eligible.
- Coverage: what share of all traffic can emit the needed tool data.
- v2 legacy flows emit no tool steps; absence is not zero errors.
- Report coverage separately by tenant when coverage differs.

Red flags:

- “The denominator is all sessions.”
- Treats missing rows as successes.
- Says coverage is just confidence interval/sample size.

Follow-up:

> Why could a blended 2% tool failure rate across tenants be misleading?

Good answer: Acme and Northwind have different v3/telemetry coverage; a single coverage number describes neither properly.

## 4. A tool returns HTTP 200 and outcome ok. Is the tool healthy?

Ask:

> The normal tool-error metric is flat, but order-status resolution falls. What would you inspect?

A strong answer includes:

- 200/ok is transport/runtime success, not proof of useful application data.
- Inspect response_bytes, result_field_count, expected business fields, retry_count, and downstream session resolution/handoff.
- Slice by tool, intent, tenant, and before/after config window.
- Consider a tool-contract break and propose validation/fallback only after checking whether empty is a legitimate domain state.

Red flags:

- “200 means it worked.”
- Immediately asks an LLM to infer API failures from transcript text.
- Proposes retrying forever or blindly reverting everything.

Follow-up:

> What is the safe fix and what could make you not ship it?

Good answer: validate expected fields; classify empty result as invalid and use a fallback/handoff; do not ship if API owner says empty is a valid state or golden-set behavior regresses.

## 5. A new product intent has poor resolution but no before-period. What baseline do you use?

Ask:

> A new premium-card intent begins this week and has low resolution. It did not exist before. How do you decide whether it is broken?

A strong answer includes:

- Cannot use the intent’s own pre-period.
- Compare with comparable healthy same-tenant informational/KB-backed intents in the same window, preferably same agent behavior.
- Mine a deployment standard from successful relevant conversations.
- Inspect KB hit rate/top score and handoff behavior.
- Do not compare directly to unrelated retail intents in another tenant.

Red flags:

- “Use last week for the same intent.”
- Uses global average as the sole baseline.
- Says it is definitely a prompt issue without retrieval/tool evidence.

Follow-up:

> What evidence would differentiate missing KB content from a weak prompt?

Good answer: low/no KB hits and low retrieval scores strongly support KB gap; look for existing content/retrieval success before blaming generation/prompt. Consider no tool needed in informational intent.

## 6. Resolution remains flat, but median turns and cost rise after a prompt change. Is that a regression?

Ask:

> Would you report this as a problem? How do you avoid making a bad trade-off?

A strong answer includes:

- Yes, likely an efficiency regression: user effort, latency, and operating cost matter even if outcome rate is stable.
- Compare same agent/prompt before vs after; check peer agents or traffic mix.
- Measure turns, cost, duration, and resolution/handoff/safety together.
- Proposed prompt edit/revert must be replayed with outcome and golden-set guardrails fixed.

Red flags:

- “No, resolution is the only metric.”
- “Yes, revert prompt immediately.”
- Does not mention controlling for traffic or preserving safety/outcomes.

Follow-up:

> What could be an alternative explanation besides prompt change?

Good answer: traffic mix, model/routing change, changed user behavior, a load event; inspect config timeline and comparable agents/cohorts.

## 7. Why is an aggregate trend dangerous?

Ask:

> Aggregate containment rises by 2 points. Should we celebrate?

A strong answer includes:

- Not before stratifying by intent/cohort.
- More easy branch-locator questions can raise the average while each intent is unchanged or worse.
- Compare within intent, then optionally use a mix-adjusted view.
- Emit a written traffic_mix dismissal if that is what happened.

Red flags:

- Treats aggregate improvement as success.
- Only says “use machine learning to detect anomalies.”
- Does not know a traffic-mix shift is an intentional decoy.

## 8. Quality score falls across both tenants on the same day. What do you do?

Ask:

> The quality score drops sharply on day 28 for everything. How would you investigate and report it?

A strong answer includes:

- Check judge_version/config timeline first.
- Do not compare judged scores across v1/v2 rubric boundary.
- Segment by judge version or re-score with one frozen version.
- If runtime outcome facts are stable, write a judge_change non-regression finding.
- Never solve a regression by changing the judge/metric definition.

Red flags:

- Calls it an LLM/model regression immediately.
- Averages scores across judge versions.
- Says “we will update the judge to make scores fair.”

## 9. When may an LLM judge be used?

Ask:

> Give one thing we must read directly from logs, and one thing an LLM judge could legitimately assess.

A strong answer includes:

- Logs: tool outcome, model version, handoff, latency, retry, session end.
- Judge: response correctness/helpfulness, user satisfaction, topic, abandonment because of frustration.
- The judge needs a fixed version, calibration against human labels, agreement value, and sample size.
- A09 is judged for reason of abandonment; abandonment itself is measured.

Red flags:

- “Use an LLM to classify every error.”
- “LLM judges are always objective.”
- Claims 100% calibration is ideal.

## 10. What should the system say for A11 failover rate?

Ask:

> The operator asks: “What is our failover rate?” What do we put in the report?

A strong answer includes:

- NOT_MEASURABLE, because no runtime failover mechanism/event exists.
- Do not report retry_count as failover.
- Exact required event: failover at step grain, fields from_target, to_target, reason, recovered; owner conversation-runtime.
- Explain why the nearest proxy misleads.

Red flags:

- “0%, because no failovers are logged.”
- “Use retries as failovers.”
- “Ask an LLM to read the conversations.”

This is the single highest-signal attentiveness question.

## 11. Describe the smallest architecture that can win

Ask:

> You have one evening. Describe the architecture you would build first, from raw data to UI.

A strong answer includes something close to:

    JSONL/CSV loader
    -> session-level feature aggregation
    -> metric helpers with fidelity/coverage
    -> detector-specific cohort comparisons
    -> diagnoses linked to config changes
    -> schema-valid report generator
    -> replay client
    -> small report-driven screen and decision persistence

They should say:

- deterministic Python is sufficient;
- report JSON is the source of truth;
- do not need a multi-agent framework;
- one command must run on sealed data;
- work from sample then confirm full corpus.

Red flags:

- Starts with React/LLM agents/vector DB before explaining data pipeline.
- Proposes an all-agent swarm with no deterministic layer.
- Requires manual interpretation before final report generation.
- Hardcodes practice days/intents.

## 12. How would you spend replay attempts?

Ask:

> We have 40 replay attempts. What is your policy?

A strong answer includes:

- Diagnose offline first.
- Use a small number of high-confidence replays on exact affected cohort and frozen golden set.
- Save the actual replay run ID/before/after/verdict.
- A no_effect result is valid and should be recorded.
- Do not brute-force the endpoint to discover faults.

Red flags:

- “Try every prompt/tool change until one works.”
- Suggests intentional wrong/null runs as calibration without a reason.
- Does not mention golden set or actual cohort.
- Thinks a no-effect result means endpoint error.

## 13. Turn a finding into an operator decision

Ask:

> Give me the contents of a good finding card for the order-status issue.

A strong answer includes:

- plain-language issue;
- affected cohort/count/share;
- observed vs baseline;
- days running and downstream handoffs/unresolved count;
- diagnosis evidence and linked tool change;
- agent-builder/platform owner;
- consequence of inaction;
- proposed tool.validate action;
- risk if empty output is valid;
- no-ship condition;
- replay result and approve/reject decision.

Red flags:

- Only describes charts.
- Omits risk or owner.
- Uses an untraceable impact claim.

---

# Mini-case: use this to test real reasoning

Present this after a few core questions.

> On day 40, a tenant’s order-status resolution falls from about 85% to 78%. Tool error rate remains around 1.5%. You find that 13.5% of successful HTTP-200 tool calls have zero parsed result fields and users often retry the same tool. There was a tool migration on day 40. Walk me through what you would do.

A strong candidate should naturally cover:

1. Define the cohort: tenant, order-status intent, get_order_status tool, day 40 onwards.
2. Build a temporal before/after baseline for that same intent/tool.
3. Identify silent tool contract failure, not ordinary tool outage.
4. Show empty payload, zero fields, retries, resolution/handoff change, and migration alignment.
5. Quantify affected sessions and share of tenant traffic.
6. Name owners: platform owner plus agent builder.
7. Propose response validation/fallback, not arbitrary prompt rewriting.
8. Name risk: empty could be valid business state.
9. Freeze metric and golden set, replay exact affected cohort.
10. Record improvement/no-effect and require human approval.

Probe if they skip an item:

- “How do you know this is not a traffic-mix change?”
- “Why are you allowed to call this a tool failure if outcome says ok?”
- “What number would you not be able to compute?”
- “What happens if your validator treats a valid empty state as error?”
- “Which data belongs in the report versus the UI?”

---

# High-signal trip-up points

Use these as quick follow-ups, not gotchas.

| Trip-up | What shallow candidates say | What good candidates say |
|---|---|---|
| 200 response | “API worked” | Transport worked; validate useful payload/application contract. |
| Handoff | “All handoffs are failures” | By-design handoffs count as contained; unplanned handoffs are impact. |
| No tool log | “No tool errors” | Unsupported/legacy traffic; coverage hole. |
| Quality cliff | “Model got worse” | Check judge version; comparison may be invalid. |
| Aggregate change | “Bot improved/regressed” | Stratify by intent; detect mix shift. |
| New intent | “Compare last week” | No history exists; use peer/standard baseline. |
| Retry | “Failover succeeded” | Retry is not alternate-target failover. |
| LLM judge | “It can read all logs” | Only for meaning; facts are deterministic. |
| Perfect calibration | “Great judge” | Suspicious; human labels disagree. |
| Empty tool result | “Error rate would catch it” | Need response bytes/result fields and downstream behavior. |
| Replay | “Try random fixes” | Verify a diagnosed hypothesis on exact cohort and golden set. |
| Static dashboard | “Done” | Needs generated report, decision control, and persisted verdict. |
| Architecture | “Use agents for everything” | Small deterministic pipeline first; LLM only where needed. |

---

# Candidate requirements summary

A selected candidate should be able to:

- explain the PS in plain language;
- navigate the kit: catalog, asks, starter, scorer, schema, corpus, replay;
- write or reason about Python JSONL processing;
- prevent session/step join fan-out;
- define a metric with numerator, denominator, coverage, fidelity, and calibration where needed;
- choose a valid baseline for both new and existing cohorts;
- distinguish observation from diagnosis;
- reason about prompt, KB/RAG, tool contracts, retries, routing, handoff, latency, and cost;
- explicitly dismiss traffic-mix, load, and judge-version decoys;
- refuse failover rate with the correct missing event contract;
- turn evidence into a human decision;
- design a minimal report-first system that runs unattended on sealed data;
- stay calm when challenged and update their view when evidence changes.

## Final interviewer note

Do not hire only for confidence. The candidate most likely to help us win will often say:

> “I would first check the catalog and actual coverage before claiming that.”

That is a much stronger signal than a long answer about agents, vector databases, or dashboards.

