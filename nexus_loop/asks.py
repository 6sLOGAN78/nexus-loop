"""The eleven operator asks → a metric or a structured gap for each.

Rule 1 is respected everywhere: nothing here asks a model anything. Judged
values are read from the corpus's own judge (``quality_score``) and published
with a calibration computed against the kit's human rubric labels.
"""
from __future__ import annotations

from collections import Counter, defaultdict
from typing import Dict, List, Optional, Tuple

from .coverage import Coverage
from .features import (Corpus, abandoned, contained, mean, median, percentile, rate,
                       resolved, unplanned_handoff)
from .metrics import gap, metric, r4

SESSIONS = "corpus/sessions.jsonl.gz"
STEPS = "corpus/agent_steps.jsonl.gz"


def _short(tenant: str) -> str:
    return tenant.split("-")[0]


def _cost_coverage(cov: Coverage, corpus: Corpus, tenant: str) -> Tuple[float, str]:
    rows = list(corpus.rows(tenant))
    with_cost = sum(1 for s in rows if s.get("cost_usd") is not None)
    v = rate(with_cost, len(rows)) or 0.0
    declared = (cov.corpus.kit.capability("cost_per_session").get("coverage") or {}).get(tenant)
    basis = ("share of %s sessions carrying a recorded cost_usd, measured from this corpus" % tenant)
    if declared is not None and abs(declared - v) > 0.03:
        basis += (". NOTE the catalog declares cost coverage %.2f for this tenant (cost on llm_call "
                  "steps, said to be absent on v2_flow); in this corpus %.1f%% of sessions carry cost_usd, "
                  "so the measured presence is reported and the agent_kind breakdown is given below"
                  % (declared, 100 * v))
    return round(v, 4), basis


def build(corpus: Corpus, cov: Coverage, kit_catalog: dict) -> Tuple[List[dict], List[dict], dict]:
    """Returns (metrics, gaps, extras). ``extras`` carries derived facts the
    report reuses (e.g. the review queue) so nothing is computed twice."""
    metrics: List[dict] = []
    gaps: List[dict] = []
    extras: Dict = {}
    D = corpus.days
    half = D // 2
    tenants = corpus.tenants
    all_rows = list(corpus.sessions.values())

    # ---------------------------------------------------------------- A01 --
    per_t = {t: r4(rate(sum(1 for s in corpus.rows(t) if contained(s)), sum(1 for _ in corpus.rows(t))))
             for t in tenants}
    metrics.append(metric(
        "m_containment", "Containment rate", "A01", "session", "measured",
        r4(rate(sum(1 for s in all_rows if contained(s)), len(all_rows))),
        1.0, "session_end and handoff_by_design are present on every session, every agent_kind",
        SESSIONS, "session_end = 'resolved' OR (session_end = 'handoff' AND handoff_by_design = true)",
        "all sessions in scope", breakdowns=["tenant", "intent", "channel", "agent_kind"],
        alternatives=["resolution_rate — excludes by-design handoffs entirely"],
        breakdown={"by_tenant": per_t}))

    # ---------------------------------------------------------------- A04 --
    for t in tenants:
        rows = [s for s in corpus.rows(t) if cov.covered("tool_call", s)]
        calls = sum(s["derived"]["n_tool_calls"] for s in rows)
        errs = sum(s["derived"]["n_tool_errors"] for s in rows)
        ok = sum(s["derived"]["n_tool_ok"] for s in rows)
        empty = sum(s["derived"]["n_empty_success"] for s in rows)
        by_tool = Counter()
        by_tool_err = Counter()
        for s in rows:
            by_tool.update(s["derived"]["calls_by_tool"])
            by_tool_err.update(s["derived"]["errors_by_tool"])
        metrics.append(metric(
            "m_tool_failure_" + _short(t), "Tool failure rate — " + t, "A04", "step", "measured",
            r4(rate(errs, calls)), cov.value("tool_call", t), cov.basis("tool_call", t),
            STEPS + " WHERE step_type = 'tool_call'",
            "outcome IN ('error','timeout') AND tenant = '%s'" % t,
            "all tool_call steps for this tenant on agent_kinds that emit tool_call",
            breakdowns=["error_class", "tool_name", "channel", "agent_id"],
            excluded=cov.excluded_filter("tool_call"),
            breakdown={"by_tool": {k: r4(rate(by_tool_err[k], v)) for k, v in sorted(by_tool.items())},
                       "calls": calls}))
        metrics.append(metric(
            "m_tool_empty_success_" + _short(t), "Tool answered with nothing — " + t, "A04", "step", "derived",
            r4(rate(empty, ok)), cov.value("tool_call", t),
            "derived from the same tool_call rows; " + cov.basis("tool_call", t),
            STEPS + " WHERE step_type = 'tool_call'",
            "outcome = 'ok' AND status_code = 200 AND result_field_count = 0 AND tenant = '%s'" % t,
            "all tool_call steps with outcome = 'ok' for this tenant",
            breakdowns=["tool_name", "tool_version", "intent"], excluded=cov.excluded_filter("tool_call"),
            alternatives=["catalog lists silent_tool_success as derivable_not_declared — derived and declared here"],
            breakdown={"by_tool": {k: r4(rate(sum(s["derived"]["empty_by_tool"].get(k, 0) for s in rows),
                                                 v - by_tool_err[k])) for k, v in sorted(by_tool.items())}}))

    # ---------------------------------------------------------------- A02 --
    mom = {}
    for t in tenants:
        rows = list(corpus.rows(t))
        m1 = [s for s in rows if int(s["day"]) < half]
        m2 = [s for s in rows if int(s["day"]) >= half]
        by_intent = {}
        for it in sorted({s["intent"] for s in rows}):
            a = [s for s in m1 if s["intent"] == it]
            b = [s for s in m2 if s["intent"] == it]
            if len(a) >= 30 and len(b) >= 30:
                by_intent[it] = {
                    "resolution": [r4(rate(sum(1 for s in a if resolved(s)), len(a))),
                                   r4(rate(sum(1 for s in b if resolved(s)), len(b)))],
                    "median_turns_to_resolve": [median([s["turns"] for s in a if resolved(s)]),
                                                median([s["turns"] for s in b if resolved(s)])],
                    "share": [r4(len(a) / float(len(m1))), r4(len(b) / float(len(m2)))],
                }
        mom[t] = {
            "resolution": [r4(rate(sum(1 for s in m1 if resolved(s)), len(m1))),
                           r4(rate(sum(1 for s in m2 if resolved(s)), len(m2)))],
            "containment": [r4(rate(sum(1 for s in m1 if contained(s)), len(m1))),
                            r4(rate(sum(1 for s in m2 if contained(s)), len(m2)))],
            "median_turns_to_resolve": [median([s["turns"] for s in m1 if resolved(s)]),
                                        median([s["turns"] for s in m2 if resolved(s)])],
            "by_intent": by_intent,
        }
    metrics.append(metric(
        "m_mom_resolution", "Month-over-month resolution and turns, stratified by intent", "A02", "session",
        "measured", {t: {"resolution": v["resolution"], "containment": v["containment"],
                         "median_turns_to_resolve": v["median_turns_to_resolve"]} for t, v in mom.items()},
        1.0, "session_end and turns are present on every session",
        SESSIONS, "day < %d AS month_1, day >= %d AS month_2; per tenant, then per intent" % (half, half),
        "all sessions in each month, per tenant and per intent",
        breakdowns=["tenant", "intent", "agent_id", "channel"],
        alternatives=["quality_score is NOT trended month over month: the judge_version boundary makes "
                      "it a measurement of the rubric, not the agent",
                      "aggregate containment is shown with the intent-share column so a mix shift is visible"],
        value_note="[month_1, month_2] pairs. Read per intent: an aggregate move with flat intents is mix.",
        breakdown={t: v["by_intent"] for t, v in mom.items()}))
    metrics.append(metric(
        "m_abandon_rate", "Abandonment rate (the measured half of A09)", "A02", "session", "measured",
        {t: r4(rate(sum(1 for s in corpus.rows(t) if abandoned(s)), sum(1 for _ in corpus.rows(t)))) for t in tenants},
        1.0, "session_end is present on every session", SESSIONS, "session_end = 'abandoned'",
        "all sessions per tenant", breakdowns=["tenant", "intent", "channel"],
        alternatives=["WHY a user abandoned is not in this metric — see gap A09"]))

    # ---------------------------------------------------------------- A03 / A08 --
    for t in tenants:
        cval, cbasis = _cost_coverage(cov, corpus, t)
        rows = [s for s in corpus.rows(t) if s.get("cost_usd") is not None]
        by_intent = {}
        for it in sorted({s["intent"] for s in rows}):
            r = [s for s in rows if s["intent"] == it]
            n_res = sum(1 for s in r if resolved(s))
            by_intent[it] = {"cost_usd": r4(sum(float(s["cost_usd"]) for s in r)),
                             "resolved": n_res,
                             "cost_per_resolved": r4(rate(sum(float(s["cost_usd"]) for s in r), n_res))}
        ranked = sorted(by_intent.items(), key=lambda kv: -(kv[1]["cost_per_resolved"] or 0))
        by_kind = {k: r4(sum(float(s["cost_usd"]) for s in rows if s["agent_kind"] == k))
                   for k in sorted({s["agent_kind"] for s in rows})}
        metrics.append(metric(
            "m_cost_per_resolved_" + _short(t), "Cost per resolved conversation by intent — " + t, "A03",
            "session", "measured", {k: v["cost_per_resolved"] for k, v in ranked[:5]},
            cval, cbasis, SESSIONS, "cost_usd IS NOT NULL AND tenant = '%s'" % t,
            "resolved sessions of the intent (sessions without recorded cost leave both numerator and denominator)",
            breakdowns=["intent", "agent_id", "agent_kind"],
            value_note="top five intents by cost per resolved conversation; full table in breakdown",
            breakdown={"by_intent": by_intent, "cost_by_agent_kind": by_kind}))
        months = {}
        for m_i in range(0, D, half or D):
            r = [s for s in rows if m_i <= int(s["day"]) < m_i + half]
            if not r:
                continue
            months["days_%d_%d" % (m_i, min(D, m_i + half) - 1)] = {
                "total_usd": r4(sum(float(s["cost_usd"]) for s in r)),
                "by_intent": {it: r4(sum(float(s["cost_usd"]) for s in r if s["intent"] == it))
                              for it in sorted({s["intent"] for s in r})},
                "by_agent": {ag: r4(sum(float(s["cost_usd"]) for s in r if s["agent_id"] == ag))
                             for ag in sorted({s["agent_id"] for s in r})},
            }
        metrics.append(metric(
            "m_spend_" + _short(t), "Spend serving customers, per month and on what — " + t, "A08",
            "session", "measured", {k: v["total_usd"] for k, v in months.items()},
            cval, cbasis, SESSIONS, "SUM(cost_usd) WHERE tenant = '%s' GROUP BY %d-day month" % (t, half),
            "n/a — a total; recorded llm_call cost rolled up to session grain, nothing imputed",
            breakdowns=["intent", "agent_id", "model"],
            alternatives=["human handling cost is NOT included: no price constant exists in the corpus, so "
                          "handoffs are reported as counts, never as dollars"],
            breakdown=months))

    # ---------------------------------------------------------------- A05 --
    journeys = kit_catalog.get("milestones") or {}
    dropoff = {}
    headline = None
    for t in tenants:
        for it, steps in (journeys.get(t) or {}).items():
            rows = [s for s in corpus.rows(t) if s["intent"] == it]
            if len(rows) < 30 or not steps:
                continue
            reach = []
            for ms in steps:
                reach.append(r4(rate(sum(1 for s in rows if ms in (s.get("milestones_reached") or [])), len(rows))))
            drops = [(steps[i], (reach[i - 1] or 0) - (reach[i] or 0)) for i in range(1, len(steps))]
            worst = max(drops, key=lambda kv: kv[1]) if drops else None
            dropoff[t + "/" + it] = {"milestones": steps, "reach_rate": reach, "n": len(rows),
                                     "largest_drop_before": worst[0] if worst else None,
                                     "largest_drop": r4(worst[1]) if worst else None}
            if "return" in it and headline is None:
                headline = dropoff[t + "/" + it]
    metrics.append(metric(
        "m_returns_dropoff", "Milestone drop-off in the returns journey", "A05", "session", "measured",
        headline, 1.0, "milestones_reached is present on every session; journeys come from catalog.milestones",
        SESSIONS, "intent whose catalog journey is the returns journey; share of sessions reaching each milestone in order",
        "all sessions of the intent", breakdowns=["milestone", "channel", "agent_id"],
        value_note="journey chosen by matching the ask ('returns') against catalog.milestones keys; all journeys in breakdown",
        breakdown=dropoff))

    # ---------------------------------------------------------------- A06 --
    kb_by_t = {}
    for t in tenants:
        rows = [s for s in corpus.rows(t) if s["derived"]["n_kb_lookups"]]
        lookups = sum(s["derived"]["n_kb_lookups"] for s in rows)
        hits = sum(s["derived"]["n_kb_hits"] for s in rows)
        scores = [x for s in rows for x in s["derived"]["kb_scores"]]
        by_intent = {}
        for it in sorted({s["intent"] for s in rows}):
            r = [s for s in rows if s["intent"] == it]
            lk = sum(s["derived"]["n_kb_lookups"] for s in r)
            if lk >= 30:
                by_intent[it] = {"kb_hit_rate": r4(rate(sum(s["derived"]["n_kb_hits"] for s in r), lk)),
                                 "kb_top_score_median": median([x for s in r for x in s["derived"]["kb_scores"]])}
        kb_by_t[t] = {"kb_hit_rate": r4(rate(hits, lookups)), "kb_top_score_median": median(scores),
                      "lookups": lookups, "by_intent": by_intent}
    metrics.append(metric(
        "m_kb_hit_rate", "KB retrieval: confident hit rate and top score", "A06", "step", "measured",
        {t: {"kb_hit_rate": v["kb_hit_rate"], "kb_top_score_median": v["kb_top_score_median"]} for t, v in kb_by_t.items()},
        min(cov.value("kb_lookup", t) for t in tenants), cov.basis("kb_lookup", tenants[0]),
        STEPS + " WHERE step_type = 'kb_lookup'", "kb_hit = true", "all kb_lookup steps per tenant",
        breakdowns=["intent", "kb_version", "agent_id"], excluded=cov.excluded_filter("kb_lookup"),
        alternatives=["'actually answering' has a judged reading — see m_quality_judged, segmented by judge_version"],
        breakdown={t: v["by_intent"] for t, v in kb_by_t.items()}))

    # judged quality with a real calibration against the kit's human rubric scores
    cal, cal_detail = _quality_calibration(corpus)
    q_by_version = {}
    for v in sorted({s.get("judge_version") for s in all_rows if s.get("judge_version")}):
        qs = [float(s["quality_score"]) for s in all_rows if s.get("judge_version") == v and s.get("quality_score") is not None]
        q_by_version[v] = {"mean": r4(mean(qs)), "n": len(qs)}
    if cal:
        metrics.append(metric(
            "m_quality_judged", "Judged quality (rubric score), segmented by judge_version", "A06", "session",
            "judged", q_by_version, 1.0, "quality_score and judge_version are stamped on every session",
            SESSIONS, "quality_score SEGMENTED BY judge_version — never trended across the boundary",
            "sessions within one judge_version", breakdowns=["judge_version", "intent", "tenant"],
            calibration=cal,
            alternatives=["csat is measured but present on a small, not-missing-at-random subset; reported "
                          "alongside, never blended"],
            value_note="calibration = share of human-labelled sessions where |human - judge| <= 1 on the 1-5 "
                       "rubric, per-version detail in breakdown", breakdown=cal_detail))
    extras["quality_calibration"] = cal

    # ---------------------------------------------------------------- A07 --
    upgrades = []
    for c in corpus.changes:
        if c.get("kind") != "model":
            continue
        t, agent, d = c["tenant"], c["target"], c["day"]
        rows = [s for s in corpus.rows(t) if s["agent_id"] == agent]
        before = [s for s in rows if max(0, d - 7) <= int(s["day"]) < d]
        after = [s for s in rows if d <= int(s["day"]) < min(D, d + 7)]
        jv_b = {s.get("judge_version") for s in before}
        jv_a = {s.get("judge_version") for s in after}
        same_judge = len(jv_b | jv_a) == 1
        judge_near = corpus.nearest_change("*", d, {"judge"}, before=7, after=7)
        entry = {
            "tenant": t, "agent_id": agent, "day": d, "from": c.get("from_value"), "to": c.get("to_value"),
            "n_before": len(before), "n_after": len(after),
            "resolution": [r4(rate(sum(1 for s in before if resolved(s)), len(before))),
                           r4(rate(sum(1 for s in after if resolved(s)), len(after)))],
            "median_turns_to_resolve": [median([s["turns"] for s in before if resolved(s)]),
                                        median([s["turns"] for s in after if resolved(s)])],
            "cost_per_session": [r4(mean([float(s["cost_usd"]) for s in before if s.get("cost_usd") is not None])),
                                 r4(mean([float(s["cost_usd"]) for s in after if s.get("cost_usd") is not None]))],
            "quality": ([r4(mean([float(s["quality_score"]) for s in before])),
                         r4(mean([float(s["quality_score"]) for s in after]))] if same_judge else None),
            "quality_note": ("compared within judge_version %s" % list(jv_b)[0] if same_judge else
                             "NOT compared: a judge_version boundary%s sits inside the comparison window"
                             % (" (day %d)" % judge_near["day"] if judge_near else "")),
        }
        upgrades.append(entry)
    metrics.append(metric(
        "m_model_upgrade", "Model upgrade before/after on a stable cohort", "A07", "session", "measured",
        upgrades, 1.0, "session outcomes and turns are present on every session; cost where recorded",
        SESSIONS + " JOIN corpus/config_timeline.csv WHERE kind = 'model'",
        "agent_id = change.target, 7 days before vs 7 days after change.day",
        "sessions of the upgraded agent in each 7-day window", breakdowns=["intent", "channel"],
        alternatives=["judged quality is only included when both windows share one judge_version"],
        value_note="[before, after] pairs per model change found in the config timeline"))

    # ---------------------------------------------------------------- A09 --
    gaps.append(gap(
        "A09", "REQUIRES_NEW_JUDGE",
        "session_end = 'abandoned' is MEASURED (see m_abandon_rate). WHY a user abandoned — frustration versus "
        "having got what they needed — is a judgment about meaning. No versioned judge with a published "
        "calibration for that question exists in this deployment, and inferring the reason from the end "
        "code would be a Rule 1 violation dressed up as an aggregate. This system publishes no such number.",
        nearest_proxy="abandoned sessions with an unusually high turn count or a same-tool retry",
        why_the_proxy_misleads="it flags effort, not frustration; a user who leaves happy after two turns and one "
                               "who rage-quits after two turns look identical in the logs",
        required_event={"name": "abandonment_reason_judgement", "grain": "session",
                        "fields": ["judge_version", "reason_class", "confidence", "calibration_set_id"],
                        "owner": "quality-judging"}))

    # ---------------------------------------------------------------- A10 --
    queue = _review_queue(corpus, cov, D)
    extras["review_queue"] = queue
    metrics.append(metric(
        "m_review_queue", "Conversations a human should review this week", "A10", "session", "derived",
        {"count": len(queue["items"]), "by_reason": queue["by_reason"]},
        1.0, "the scope uses session fields present on every session; the empty-tool-answer criterion only "
             "fires on agent_kinds that emit tool_call (stated in each item's reason)",
        SESSIONS + " (last 7 days)",
        "unplanned handoff OR abandoned OR empty tool answer OR turns >= tenant p90, ranked by quality_score "
        "within the current judge_version (judged score used for ordering only)",
        "n/a — a queue", breakdowns=["tenant", "reason", "intent"],
        alternatives=["ordering by a judged score is a judged reading; the SCOPE itself is deterministic"],
        breakdown={"top": queue["items"][:25]}))

    # ---------------------------------------------------------------- A11 --
    cap = corpus.kit.capability("failover_rate")
    req = cap.get("required_event") or {"name": "failover", "grain": "step",
                                        "fields": ["from_target", "to_target", "reason", "recovered"],
                                        "owner": "conversation-runtime"}
    n_llm_retries = sum(s["derived"]["n_llm_retries"] for s in all_rows)
    gaps.append(gap(
        "A11", "NOT_MEASURABLE",
        "No failover mechanism exists in the runtime, so no failover event is ever emitted: there is no "
        "primary/secondary path to observe. Nothing in the corpus records a primary model or tool failing "
        "and an alternate serving the user, because that choice is never made. Required event: %s at %s "
        "grain with fields %s, owner %s." % (req["name"], req["grain"], ", ".join(req["fields"]), req["owner"]),
        nearest_proxy="llm_call rows with retry_count > 0 (%d in this corpus)" % n_llm_retries,
        why_the_proxy_misleads="those are QUALITY retries — the same target re-issued after a provider error or "
                               "malformed response, not a switch to an alternate target. Reporting them as "
                               "failover would show a small non-zero rate that reads as 'failover is working' "
                               "when failover does not exist; a chart here would be worse than no chart.",
        required_event={"name": req["name"], "grain": req["grain"], "fields": list(req["fields"]),
                        "owner": req["owner"]}))

    # ---------------------------------------------------------------- C2 --
    field = "session.custom_dims.customer_ref"
    budget = corpus.kit.cardinality_budget(field)
    distinct = len({(s.get("custom_dims") or {}).get("customer_ref") for s in all_rows
                    if (s.get("custom_dims") or {}).get("customer_ref") is not None})
    if budget is not None and distinct > budget:
        gaps.append(gap(
            "A02", "CARDINALITY_REFUSED",
            "a per-customer breakdown (custom_dims.customer_ref) was considered for the cohort drill-down and "
            "refused: %d distinct values against the catalog's declared cardinality budget of %d for %s. The "
            "field is near-unique per session; grouping by it is a planner error, not a cohort. session_id "
            "is the only declared join key; customer_ref is not one." % (distinct, budget, field),
            nearest_proxy="custom_dims.segment (closed set, budget %s)" % corpus.kit.cardinality_budget("session.custom_dims.segment"),
            why_the_proxy_misleads="segment groups customers into three bands; it answers 'which kind of customer', "
                                   "not 'which customer'"))
    extras["customer_ref_distinct"] = distinct
    return metrics, gaps, extras


def _quality_calibration(corpus: Corpus):
    rub = corpus.kit.rubric_scores()
    pairs = []
    skipped = 0
    for r in rub:
        s = corpus.sessions.get(r.get("session_id"))
        if not s or s.get("quality_score") is None or r.get("human_quality") is None:
            skipped += 1
            continue
        pairs.append((float(r["human_quality"]), float(s["quality_score"]),
                      r.get("judge_version_at_label_time") or s.get("judge_version")))
    if len(pairs) < 10:
        return None, {"note": "fewer than 10 human rubric labels join to sessions; no calibration published"}
    within1 = sum(1 for h, m, _ in pairs if abs(h - m) <= 1.0) / float(len(pairs))
    detail = {"definition": "|human_quality - quality_score| <= 1 on the 1-5 rubric",
              "n": len(pairs), "labels_not_joined": skipped,
              "mae": r4(mean([abs(h - m) for h, m, _ in pairs])),
              "within_half_point": r4(sum(1 for h, m, _ in pairs if abs(h - m) <= 0.5) / float(len(pairs))),
              "by_judge_version": {}}
    for v in sorted({p[2] for p in pairs if p[2]}):
        ps = [p for p in pairs if p[2] == v]
        detail["by_judge_version"][v] = {"n": len(ps),
                                         "within_1": r4(sum(1 for h, m, _ in ps if abs(h - m) <= 1.0) / float(len(ps))),
                                         "mae": r4(mean([abs(h - m) for h, m, _ in ps]))}
    agreement = round(within1, 4)
    if agreement >= 0.995:
        # a perfect agreement is a bug; publish the stricter reading and say so
        agreement = detail["within_half_point"]
        detail["note"] = "within-1 agreement was >= 0.995, which the label set's human disagreement rules out; " \
                         "the half-point agreement is published instead"
    versions = sorted(detail["by_judge_version"])
    return {"agreement": agreement, "n": len(pairs),
            "judge_version": "+".join(versions) if versions else "unknown"}, detail


def _review_queue(corpus: Corpus, cov: Coverage, D: int) -> dict:
    start = max(0, D - 7)
    items = []
    by_reason = Counter()
    p90 = {t: percentile([float(s["turns"]) for s in corpus.rows(t)], 0.90) for t in corpus.tenants}
    current_jv = Counter(s.get("judge_version") for s in corpus.sessions.values() if int(s["day"]) >= start).most_common(1)
    jv = current_jv[0][0] if current_jv else None
    for s in corpus.sessions.values():
        if int(s["day"]) < start:
            continue
        reasons = []
        if unplanned_handoff(s):
            reasons.append("unplanned_handoff")
        if abandoned(s):
            reasons.append("abandoned")
        if s["derived"]["n_empty_success"] and cov.covered("tool_call", s):
            reasons.append("empty_tool_answer")
        if float(s["turns"]) >= (p90.get(s["tenant"]) or 1e9):
            reasons.append("turns_at_or_above_p90")
        if not reasons:
            continue
        for r in reasons:
            by_reason[r] += 1
        q = s.get("quality_score")
        items.append({"session_id": s["session_id"], "tenant": s["tenant"], "day": int(s["day"]),
                      "intent": s["intent"], "agent_id": s["agent_id"], "reasons": reasons,
                      "quality_score": q if s.get("judge_version") == jv else None,
                      "judge_version": s.get("judge_version")})
    items.sort(key=lambda i: (i["quality_score"] if i["quality_score"] is not None else 99, -len(i["reasons"]), i["session_id"]))
    return {"items": items, "by_reason": dict(by_reason), "window_days": [start, D - 1], "ranking_judge_version": jv}
