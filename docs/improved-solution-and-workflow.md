# Nexus Loop — improved solution and workflow

Companion to `repo-learnings-and-findings.md`. That file records what the kit
actually does; this one turns it into a build-ready plan. No deliverable is
implemented here — it is the design the implementation should follow.

---

## 1. Target and framing

**Product statement (one line):** an agent-regression workbench that turns
deployment traces into one human decision — detect, localise, explain, propose,
replay, approve/reject — with the JSON report as the single source of truth.

**Scoring target, stated explicitly:** detect **all three** faults and dismiss
**all three** decoys, then earn the cheap loop/honesty points with **one**
well-formed replay chain.

| Priority | Deliverable | Points |
|---|---|---:|
| P0 | 3 regression findings + 3 linked diagnoses (exact cohort keys) | 20 |
| P0 | 3 decoy dismissals + no strays | 15 |
| P0 | A11 gap, tool coverage, calibration, full fidelity+coverage | 12 |
| P1 | standard (3), one prescription chain with predicted delta + real `rp_` (8) | 8 |
| P1 | 11-ask coverage map (metrics + gaps) | human framing |
| P0-human | decision screen with risk / no-ship / persisted verdict | 45 human |

Design rule from the kit: **depth is for the replay chain only.** Everything else
is breadth because accuracy is per-fault and specificity is per-decoy.

---

## 2. Principles

1. Report-first: generate JSON, validate against the schema, then render. The UI
   never invents a number.
2. Deterministic Python for all logged facts; an LLM judge only for semantic
   questions that a rubric needs (ideally none in the MVP — A09 can be a gap).
3. One row per session. Steps are aggregated up before any session-outcome math.
4. Every metric returns value + fidelity + coverage (+ calibration when judged).
5. Detection is **config-aware and window-based**, never absolute-day or
   absolute-threshold.
6. Observation and attribution are separate: a regression can be reported with
   `cause_class: unknown` if the mechanism is proven but no change lines up.
7. Coverage is computed from the corpus, not copied from the catalog prose.
8. One unattended entrypoint (`run.py`) that works from a clean checkout.

---

## 3. Architecture

```
raw files
  -> io.py            read JSONL.gz + config_timeline.csv + labels
  -> features.py      stream steps into a per-session feature table
  -> coverage.py      per-agent_kind emission coverage, computed from data
  -> metrics.py       metric helper (value/fidelity/coverage/plan/calibration)
  -> cohorts.py       scoped filters, before/after windows, peer selection
  -> detect.py        config-anchored changepoint scan (KB / tool / efficiency)
  -> decoys.py        mix shift, load event, judge boundary detectors
  -> standards.py     mine reference "good" cohorts + freeze golden-set IDs
  -> diagnose.py      match mechanism and config change; build evidence lists
  -> impact.py        conversations affected, share, downstream, cost, derivation
  -> report.py        assemble + schema-validate loop-report.json
  -> replay.py        submit one prescription to the replay endpoint
  -> app.py           one-page decision UI + persisted approval
  -> run.py           cold-run orchestration + final validation
```

Keep modules small. No agent framework, no scheduler, no vector DB.

---

## 4. Canonical model

### 4.1 Session feature table (`features.py`)

One dict per session, keyed by `session_id`, built from `sessions.jsonl.gz`
plus a single streaming pass over `agent_steps.jsonl.gz`.

```
session_id, tenant, day, intent, agent_id, agent_kind, model,
prompt_version, kb_version, channel, session_end, handoff_by_design,
turns, duration_s, cost_usd, judge_version, quality_score, csat

tool_call_count, tool_error_count, tool_timeout_count,
empty_success_count,               # status 200 & outcome ok & result_field_count==0
empty_success_by_tool,
same_tool_retry_count,             # retry_count>0 on a tool already seen this session
tool_latency_ms (list or reserved),
kb_lookup_count, kb_hit_count, kb_miss_count, kb_top_scores (list)
guardrail_block_count,
milestones_reached, milestones_total
```

All per-session tool/KB fields are reduced to **one value per session** before
joining to outcomes. This prevents the fan-out bug the catalog warns about.

### 4.2 Coverage model (`coverage.py`)

Compute, per tenant:
- `tool_coverage = sessions with >=1 tool_call row / all sessions`
- `kb_coverage`, `cost_coverage`, `guardrail_coverage` the same way

Expect tool coverage ≈ 0.72/0.93 and the others ≈ 1.0 (see learnings §5). Report
the measured value and the excluded `agent_kind` in every metric that uses it.

---

## 5. Metric helper (`metrics.py`)

One constructor so honesty metadata cannot be bolted on late:

```python
def metric(id, name, ask_id, grain, value, fidelity,
           coverage_value, coverage_basis, source, filter_,
           denominator, breakdowns=(), excluded=(), calibration=None):
    return {... schema-shaped dict ...}
```

Rules:
- `fidelity` in {measured, derived, judged}.
- Any metric derived from steps carries `coverage` and `excluded` from §4.2.
- A judged metric without a real held-out calibration is not published as judged;
  use a `gaps` entry instead.

---

## 6. Detection engine

### 6.1 Shared primitive — config-anchored changepoint scan (`detect.py`)

Because the sealed layout moves dates but anchors each fault to a config change,
scan **candidate cohorts derived from the config timeline and the data**, not
from hardcoded intents:

```python
def changepoint(series_by_day, min_window=4, min_effect=...):
    # returns the day that maximises a robust before/after split
    # e.g. maximise |median(post)-median(pre)| / MAD, requiring n_pre,n_post >= min_window
```

Candidate cohorts:
- every `(tenant, intent)` pair with enough volume,
- every `(tenant, agent_id)`,
- every `(tenant, tool_name)` and `(tenant, intent, tool_name)`.

For each candidate, run `changepoint` on the relevant primary metric, then
require a matching mechanism signal and (optionally) a config change of the
right kind near the break. Rank by effect size × volume × mechanism strength.

### 6.2 KB-gap detector

Primary metric: `resolution_rate`. Supporting: `kb_hit_rate`, `kb_top_score`
distribution.

Algorithm:
1. Find `(tenant, intent)` cohorts whose resolution breaks downward.
2. Flag **new/rare cohorts**: the intent has little or no coverage before the
   break (`premium_card_info` has none). For these, the baseline is a **peer
   standard**, never the intent's own past.
3. Mechanism: `kb_hit_rate` ≈ 0 and `kb_top_score` clustered 0.1-0.4 → retrieval
   miss. Confirm no tool calls in the cohort (excludes tool causes).
4. Attribution: nearest `kind='kb'` config change in the tenant near the break.
5. Window: the break window, not the intent's lifetime. The intent recovers after
   the window, so a lifetime statement is false.

Peer baseline rule: same tenant, same window, comparable KB-backed informational
intents on the same agent family (`product_info`, `employment_letter` for acme).
Never cross-tenant.

### 6.3 Silent-tool detector

Primary metric: `empty_success_rate` per tool/intent. Secondary: resolution drop,
`same_tool_retry_count`.

Algorithm:
1. Slice `(tenant, intent, tool_name)`; compute per-day
   `empty_success_rate = empty_success_count / tool_call_count`.
2. Changepoint on that series. A valid break has:
   - post-window empty-success rate materially above pre (adaptive: e.g. pre≈0,
     post ≥ some robust threshold, or post/pre ≥ 3 with n support), and
   - ordinary `tool_error_rate` **flat** across the break, and
   - resolution down / unplanned handoff up for the intent.
3. Mechanism string: `status_code=200`, `outcome=ok`,
   `result_field_count=0`, plus a same-tool second call with `retry_count=1`.
4. Attribution: nearest `kind='tool'` change on that exact `target`.
5. Do not hardcode 14%; sealed rate is 0.12-0.20.

This is the strongest evidence in the kit and the recommended replay candidate.

### 6.4 Efficiency-regression detector

Primary metric: `turns_to_resolve` (median and mean). Secondary: `cost_usd`,
`duration_s`. Guard: resolution/handoff must be flat or better.

Algorithm:
1. Slice `(tenant, agent_id)`; changepoint on median turns.
2. Require outcome-neutrality: resolution change within noise, no safety handoff
   increase.
3. **Peer control**: run the same scan on sibling agents in the same tenant. If
   all agents rise together it is load/mix, not a prompt regression. In the kit
   only `acme_main_v3` moves (verified), so the peer test is decisive.
4. Attribution: nearest `kind='prompt'` change whose `target` equals the agent id.
5. This detector is the main differentiator versus the reference reports, which
   never find F3.

### 6.5 Decoy detectors (`decoys.py`) — emit non-regression findings

- **Traffic mix:** aggregate containment moves but every `(tenant, intent)` rate
  is flat and one low-effort intent's share jumps. Finding: `is_regression=false`,
  diagnosis `traffic_mix`, `not_a_regression_because` explains the mix.
- **Load event:** volume and tool p95 spike, then revert inside the window;
  quality/resolution flat. Finding: `is_regression=false`, cause `load`.
- **Judge boundary:** quality drops together across tenants and intents and
  coincides with a `kind='judge'` tenant `*` change. Finding: `is_regression=false`,
  cause `judge_change`; state that quality is only compared within a
  `judge_version`.

All three need a linked diagnosis with the exact cause class to earn full
specificity (`score.py:134-141`).

---

## 7. Ask coverage map

`asks.md` is the input contract. Answer each ask with a metric or an honest gap.
Cheap and high-value for the human framing score.

| Ask | Output | Fidelity |
|---|---|---|
| A01 containment | `containment_rate` (resolved + by-design handoff / all) | measured |
| A02 better/worse MoM | resolution + turns, **stratified by intent**, with mix note | measured |
| A03 cost per resolved intent | cost per resolved conversation, v3 denominator, coverage stated | measured |
| A04 tool failure rate | per-tenant tool error rate, v3-only coverage | measured |
| A05 returns drop-off | milestone reach rates for `return_initiate` journey | measured |
| A06 KB answering | `kb_hit_rate` + `kb_top_score`; note the judged reading | measured (+ judged alt) |
| A07 model upgrade | before/after on a stable cohort, excluding judge-boundary windows | measured |
| A08 monthly spend | sum recorded `cost_usd`; state that coverage is v3-declared | measured |
| A09 frustration abandonment | gap `REQUIRES_NEW_JUDGE` (abandonment measured; reason judged) | judged |
| A10 review queue | deterministic scope (e.g. unresolved + empty-success + high turns) ranked by quality | measured+judged |
| A11 failover rate | gap `NOT_MEASURABLE` + required event spec | n/a |

A11 required event (must match `ground_truth`):
`name=failover`, `grain=step`, `fields=[from_target,to_target,reason,recovered]`,
`owner=conversation-runtime`; mention that `llm_call.retry_count>0` is a quality
retry, not a failover.

A09: prefer the gap over building a judge. The scorer accepts
`REQUIRES_NEW_JUDGE` as the correct fidelity.

---

## 8. Standard mining and golden set (`standards.py`)

The standard is 3 loop points and a human-readability item. Do it once, with
explicit, frozen rules:

1. Choose a pre-change or same-judge-version window for the cohort.
2. Require measured resolution and no unplanned handoff; exclude rows with tool
   errors / KB misses where that telemetry exists.
3. Take the top decile by efficiency (lowest turns) as `best`; report `median`
   and `deficit`.
4. Persist the derivation and the exact session IDs.
5. Reuse the same IDs as the replay golden set, frozen **before** any proposal.
6. Never recompute after a prescription.

At minimum emit one standard per primary finding (KB peer standard, order-status
pre-window standard, agent prompt-version standard) — this matches the level2/3
reference shape.

---

## 9. Report assembly (`report.py`)

Map the internal finding model to the schema exactly:

- `findings[]`: `id, tenant, cohort{intent|tool|agent_id}, metric, window, observed,
  expected, is_regression`. When true: `severity, evidence[], impact{conversations_affected,
  share_of_traffic, downstream, cost_usd|null, days_running, derivation}, audience[],
  if_nothing_changes`. When false: `not_a_regression_because`.
- `diagnoses[]`: `id, finding_id, cause_class (enum), confidence, attributed_change{kind,day}|null, evidence[]`.
- `prescriptions[]`: `id, diagnosis_id, change_type (enum), target, description,
  autonomy_rung, predicted_delta{metric,from,to}, decision{asking_approval_for,
  risk_if_diagnosis_wrong, would_not_ship_if}, approval`.
- `verifications[]`: `prescription_id, replay_run_id (rp_...), metric, before, after,
  golden_set_pass, verdict, prediction_error`.
- `gaps[]`: ask coverage refusals as above.
- `standard[]`, `self_assessment`, `system_notes`.

Impact derivation rules:
- `conversations_affected` = sessions in cohort in window.
- `share_of_traffic` = affected / that tenant's sessions in the window.
- `downstream` = counts of unplanned handoffs, abandons, and "would have resolved
  at baseline" (observed vs baseline).
- `cost_usd` = sum of recorded `cost_usd` for the cohort, or `null`. Never invent
  a human-handoff dollar constant.
- Every field explained in one `derivation` string.

Validate against `schema/loop-report.schema.json` and re-run `score.py` before
finishing.

---

## 10. Replay client (`replay.py`)

Policy: diagnose fully offline, then one high-confidence replay on F2.

```python
body = {
  "team": TEAM,
  "tenant": "northwind-retail",
  "change": {"type": "tool.validate", "target": "get_order_status",
             "description": "reject empty 200; treat as malformed_response and take fallback"},
  "cohort": {"intent": "order_status", "tool": "get_order_status",
             "from_day": detected_onset, "to_day": detected_onset + length},
  "golden_set": FROZEN_IDS,
}
```

Checklist before sending:
- `change.type` is an exact accepted enum (§7 of the learnings).
- cohort contains the key the fault expects; F3 needs `agent_id`.
- window overlaps the detected fault window.
- golden set frozen pre-proposal.

On response:
- store `run_id`, `before`, `after`, `golden_set.pass`, `verdict`,
  `prediction_error = predicted_delta.to - (after - before)`.
- If `no_effect`, record it honestly; do not treat it as an endpoint error.
- If `verdict=improved` but `golden_set.pass=false`, keep the improved verdict and
  record the random guard failure; one retry is only justified if you suspect
  your own inputs were wrong.
- Optionally run a second genuine fix for a second fault to build
  `self_assessment` cycles (budget allows).

---

## 11. Decision screen (`app.py`)

One page rendered from the report. Default view opens on the primary verified
finding, with a compact "other observations" area for the dismissed decoys and
the A11 refusal.

Required elements (mirrors the human rubric):
- headline + severity;
- affected cohort + impact (counts, share, downstream, cost or null);
- baseline and how it was chosen;
- root-cause evidence + the matching config change;
- proposed change, owner/audience;
- `risk_if_diagnosis_wrong` and `would_not_ship_if`;
- replay before/after, verdict, golden-set result;
- approve / reject / defer with a mandatory reason.

Persistence: read report → update exactly that prescription's `approval` → write
temp file → atomic replace → re-validate schema. Also append to a decisions audit
file. Do not make JSON the multi-user database.

---

## 12. Self-assessment policy (decide honestly)

`score.py:201-213` rewards `prescription_accuracy` (+1.5), `cycles>=3` (+1.5),
and `downweighted` (+0.5). Do not fabricate cycles.

Recommended: run **two or three genuine replays** (e.g. F2 `tool.validate` and F1
`kb.add`, optionally F3 `prompt.edit`) so `cycles` is true and `prescription_accuracy`
has real `n` and `mean_prediction_error`. If only one replay is run, report
`cycles: 1`, leave `downweighted` empty, and say why in `system_notes` — the
level3 reference does exactly this. The 1.5 points are not worth a framing
penalty of 12.

---

## 13. Cold-run and sealed checklist

- `run.py` reads `--kit`, emits `loop-report.json`, then runs schema validation
  and `score.py`.
- No practice literals (tenant/day/intent/tool/agent) in detection logic; derive
  from config timeline + data.
- Compute coverage from the mounted corpus per tenant each run.
- Segment all quality/`judge_version` comparisons.
- Exclude v2 only for tool metrics; compute other coverage from data.
- If a capability is missing, emit a structured gap, do not crash or guess.
- Confirm findings on the full corpus; the 5% sample has ~30 premium sessions and
  is too noisy to validate F1/F3 alone.
- Verify: all 3 faults detected with correct cohort keys and cause classes; all 3
  decoys dismissed with linked diagnoses; A11 + tool coverage + calibration
  present; one real `rp_` verification; report schema-valid; score printed.

---

## 14. Build sequence

1. `io.py` + `features.py` — session table from raw logs.
2. `coverage.py` + `metrics.py` — per-tenant emission coverage and metric helper.
3. `decoys.py` — three non-regression findings (fast specificity points, easy to
   validate against known windows).
4. `detect.py` — changepoint primitive, then tool detector (strongest signal),
   then KB, then efficiency with peer control.
5. `diagnose.py` + `impact.py` + `report.py` — schema-valid report with 3 findings,
   3 diagnoses, 3 decoy findings.
6. `standards.py` — freeze one standard per finding and golden IDs.
7. `replay.py` — one `tool.validate` run against the detected F2 window.
8. `app.py` — decision screen + persisted approval.
9. `run.py` — cold full-corpus run, schema check, `score.py`.
10. Confirm on the sealed corpus when available (organisers run the endpoint).

---

## 15. What "done" looks like

- `loop-report.json` is schema-valid and scores ≈55/55 machine under practice
  ground truth (3/3 faults, 3/3 decoys, all honesty items, one real replay).
- The screen lets a stranger answer: what broke, who is hurt, how bad, why,
  who fixes it, what is being asked, what could go wrong, did replay agree, and
  it records approve/reject/defer with a reason.
- Every number is traceable to the corpus, every unmeasurable ask is refused
  with a required event, and the reproduction command is one line.
