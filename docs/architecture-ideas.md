# Working architecture and idea bank

This is a temporary design note. It contains only ideas that survived the adversarial review of the supplied solution PDF and the kit analysis.

## Product thesis

Build an agent regression workbench.

It turns deployment traces into one decision a human can make:

    What changed?
    Who is hurt?
    Why do we believe it?
    What small change should we make?
    Did replay say it helped?
    Approve, reject, or defer?

The JSON report is the source of truth. The screen is a readable view of that report.

## Minimum viable complete loop

Primary candidate: silent tool-contract failure.

Why it is the best first loop:

- strong deterministic evidence;
- familiar agentic concept: tool success versus useful tool result;
- clear platform and agent-builder owners;
- small, reversible fix;
- replay supports a matching tool.validate change type;
- easy to explain to judges.

Complete path:

    detect empty 200 responses
    -> show lower resolution and higher retries
    -> link onset to tool config change
    -> propose response validation/fallback
    -> replay exact cohort with frozen golden set
    -> human decision is persisted

Secondary candidate: KB gap.

It is lower risk and may be easier to replay, but requires a peer/standard baseline because the intent is new.

Third candidate: prompt efficiency regression.

It demonstrates advanced agent evaluation, but prompt fixes are harder to explain and verify safely. It is an excellent detected finding even if not the first replayed fix.

## Canonical internal model

Create one row per session. Do not expose raw joins to every detector.

Suggested SessionFeatures fields:

    session_id
    tenant
    day
    intent
    agent_id
    agent_kind
    model
    prompt_version
    kb_version
    channel
    session_end
    handoff_by_design
    turns
    duration_s
    session_cost_usd
    judge_version
    quality_score

    tool_call_count
    tool_error_count
    empty_success_tool_count
    empty_success_by_tool
    retry_count
    retry_by_tool
    tool_latency_values

    kb_lookup_count
    kb_hit_count
    kb_miss_count
    kb_top_scores

    guardrail_block_count

This can be built from sessions plus a streamed pass over agent_steps.

## Metric contract

Use one helper to define each metric:

    MetricResult(
      name,
      value,
      grain,
      fidelity,
      coverage_value,
      coverage_basis,
      numerator_description,
      denominator_description,
      source,
      filters,
      breakdowns,
      calibration_or_none
    )

This prevents last-minute honesty annotations.

Important metric definitions:

| Metric | Numerator | Denominator | Fidelity |
|---|---|---|---|
| Containment | resolved plus by-design handoff sessions | all sessions | measured |
| Resolution | resolved sessions | all sessions in cohort | measured |
| Tool failure | non-ok tool calls | emitted tool calls | measured |
| Empty success | HTTP 200 ok calls with zero result fields | inspectable emitted tool calls | derived |
| KB hit rate | confident KB hits | emitted KB lookups | measured |
| Turns to resolve | turns in resolved sessions | resolved sessions | measured |
| Cost/session | recorded session cost | sessions with cost telemetry | measured |
| Frustration abandonment | judged frustration-abandonment sessions | relevant judged sessions | judged |

## Detector map

| Detector | Scan dimensions | Primary signals | Baseline |
|---|---|---|---|
| KB gap | tenant, intent, agent, window, KB version | low KB hit, low retrieval score, low resolution, high unplanned handoff | comparable healthy same-tenant intents/agent |
| Tool contract | tenant, tool, intent, window | empty 200, zero result fields, retry, resolution drop | same intent/tool before change |
| Prompt efficiency | tenant, agent, prompt version, window | turns/cost/duration increase with flat outcome | same agent before prompt change |
| Traffic mix | tenant, intent, window | aggregate change but stable per-intent behavior | within-intent rates |
| Load event | tenant, window | traffic and latency spike that reverts | before/after plus quality check |
| Judge boundary | judge version, tenant, window | score cliff exactly at version change | comparison blocked across versions |

## Detection pipeline

    load sessions
    aggregate steps into SessionFeatures
    calculate coverage by tenant and agent_kind
    read config timeline

    run KB detector
    run tool detector
    run efficiency detector
    run decoy detectors

    convert candidates to:
      confirmed regression
      dismissed non-regression
      insufficient evidence

    collect diagnosis evidence
    generate report
    choose one primary prescription
    replay
    render decision screen

Do not require every finding to have a config cause. Evidence should be ranked:

    observed behavior
    + affected cohort
    + fair baseline
    + runtime mechanism
    + matching config change
    = highest confidence

If the last item is absent, emit diagnosis unknown/no candidate rather than inventing causality.

## Standard and golden set

Keep the rule simple and fixed before replay.

For a primary finding:

1. choose comparable healthy sessions before any proposed change;
2. require measured resolution;
3. exclude unplanned handoffs;
4. exclude relevant runtime failure signals when telemetry exists;
5. select a small fixed set of IDs;
6. store selection rule, IDs/version, and derivation in standard metadata;
7. reuse unchanged IDs for replay.

Use the same tenant and related agent/intent behavior. Do not make a golden set from another tenant merely because a label sounds similar.

## Proposed report objects

A confirmed finding needs:

    id
    tenant
    cohort
    metric
    window
    observed
    expected
    is_regression = true
    evidence
    impact:
      conversations_affected
      share_of_traffic
      downstream counts
      recorded cost or null
      days_running
      derivation
    audience
    if_nothing_changes

A dismissed finding needs:

    is_regression = false
    not_a_regression_because
    diagnosis cause class:
      traffic_mix / load / judge_change

A prescription needs:

    diagnosis_id
    change_type
    target
    predicted metric from/to
    asking_approval_for
    risk_if_diagnosis_wrong
    would_not_ship_if
    approval verdict/reason

## Replay policy

The endpoint is a hypothesis verifier, not a search engine.

Use runs like this:

1. inspect raw evidence first;
2. select exact tenant, cohort, valid change type, and golden set;
3. replay the direct fix;
4. write returned rp_ ID, before, after, verdict, and golden-set pass;
5. use more runs only for another real fix or recovery from an input error.

Avoid intentional wrong-fix/null-fix experiments. The endpoint makes wrong fix and inactive cohort look the same, so those runs teach little and consume the budget.

## UI idea

One-page, report-driven layout:

    headline and severity
    affected cohort and impact
    baseline and calculation
    root-cause evidence and config change
    proposed fix, owner, risk, no-ship condition
    replay result and golden-set result
    approve / reject / defer with mandatory reason
    small sidebar: dismissed lookalike + A11 refusal

Implementation can be a tiny local HTTP app. It should atomically update the decision record and then rebuild/validate the report.

## Sealed-run rules

- No practice tenant/day/intent literals in detection logic.
- Read catalog capabilities and cardinality budgets at runtime.
- Compute coverage from current corpus, preferably report tool metrics separately per tenant.
- Use safe catalog joins only.
- Run from a clean checkout with one command.
- If a capability is unavailable, emit a structured gap instead of crashing or guessing.
- Generate evidence and numbers from the mounted corpus only.

## Near-term build sequence

1. Copy starter report shape and add A11 gap.
2. Implement loader plus session feature aggregation.
3. Implement metric helper and coverage metadata.
4. Build silent-tool detector first.
5. Add traffic-mix and judge-change dismissal outputs.
6. Generate a valid finding/diagnosis/impact report.
7. Add KB and prompt detectors.
8. Implement replay client and one decision UI.
9. Full-corpus cold run, score, schema check.

## Non-goals for MVP

- General autonomous code-writing agents.
- Live alert scheduling.
- Complex multi-agent orchestration.
- An LLM judge for facts already logged.
- Invented human-handoff dollar costs.
- Cross-tenant semantic comparisons without explicit data support.
- A dashboard full of weak unverified alerts.

