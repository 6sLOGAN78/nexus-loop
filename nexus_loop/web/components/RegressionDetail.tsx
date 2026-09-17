// Ported 1:1 from renderRegression() in nexus_loop/static/index.html (lines ~1646-1748).
import { audienceLbl, causeLbl, changeLine, metricLbl, replayLbl, toManagerEnglish } from "@/lib/copy";
import { cohortPath, fmt, pct, showVal, windowLbl } from "@/lib/format";
import { matchStandard, standardLine } from "@/lib/report";
import type { Report, FindingPack } from "@/lib/types";
import { MoreDetails, PairBars, ShareWeight } from "./Visuals";

type Kpi = [string, string, string, "info" | "warn" | "bad" | ""];

export function regressionTechRows(pack: FindingPack): Array<{ k: string; v: unknown }> {
  const { f, d, p, v } = pack;
  const ac = d && d.attributed_change;
  return [
    { k: "cause", v: d && d.cause_class },
    { k: "metric", v: f.metric },
    { k: "change", v: p && p.change_type },
    { k: "attributed kind", v: ac && ac.kind },
    { k: "test run", v: v && v.replay_run_id },
    { k: "finding", v: f.id },
  ];
}

export function RegressionDetail({ rep, pack }: { rep: Report; pack: FindingPack }) {
  const { f, d, p, v } = pack;
  const ac = d && d.attributed_change;
  const pd = (p && p.predicted_delta) || {};
  const imp = f.impact || {};
  const down = imp.downstream || {};
  const who = audienceLbl(f.audience);

  const extra: string[] = [];
  if (imp.share_of_traffic != null) extra.push(`${pct(imp.share_of_traffic)} of ${f.tenant || "tenant"}`);
  if (imp.days_running != null) extra.push(`${fmt(imp.days_running, 0)} days`);
  extra.push(imp.cost_usd == null ? "no recorded cost" : `recorded cost $${fmt(imp.cost_usd)}`);
  if (down.abandoned != null) extra.push(`${fmt(down.abandoned, 0)} abandoned`);
  if (down.extra_turns != null) extra.push(`${fmt(down.extra_turns, 0)} extra turns`);
  if (down.excess_cost_usd != null) extra.push(`$${fmt(down.excess_cost_usd)} excess`);

  const kpis: Kpi[] = [
    [fmt(imp.conversations_affected, 0), "conversations", extra[0] || "", "info"],
    down.would_have_resolved_at_baseline != null
      ? [fmt(down.would_have_resolved_at_baseline, 0), "would have resolved", "at baseline", "warn"]
      : [fmt(down.resolved_conversations_slowed, 0), "resolved, slowed", "outcomes flat", "warn"],
    [
      down.extra_turns != null ? fmt(down.extra_turns, 0) : fmt(down.unplanned_handoffs, 0),
      down.extra_turns != null ? "extra turns" : "unplanned handoffs",
      "",
      "bad",
    ],
  ];
  if (down.abandoned != null) kpis.push([fmt(down.abandoned, 0), "abandoned", "left without resolving", "bad"]);
  kpis.push([
    imp.cost_usd == null ? "—" : "$" + fmt(imp.cost_usd),
    "recorded cost",
    imp.days_running != null ? `${fmt(imp.days_running, 0)} days running` : windowLbl(f.window),
    "warn",
  ]);

  const weight = <ShareWeight share={imp.share_of_traffic} tenant={f.tenant} />;
  const evList = ([] as string[]).concat(f.evidence || [], (d && d.evidence) || []);
  const ev0 = evList[0] ? toManagerEnglish(evList[0]) : "";
  const evRest = evList.slice(1).map((e) => toManagerEnglish(e));
  const std = matchStandard(rep, f);
  const stdHint = std ? <p className="hint">{standardLine(std, f.metric)}</p> : null;
  const defn = (imp.derivation || f.baseline || "").trim();
  const defnShort = defn.length > 220 ? defn.slice(0, 217) + "…" : defn;

  return (
    <>
      <p className="kicker bad">Needs attention</p>
      <p className="path">{cohortPath(f)}</p>
      <h1 className="claim">{f.headline || metricLbl(f.metric)}</h1>
      <div className="chips">
        <span className={`badge ${f.severity === "high" || f.severity === "critical" ? "bad" : "warn"}`}>{f.severity || ""}</span>
        {f.tenant ? <span className="badge ghost">{f.tenant}</span> : null}
        {windowLbl(f.window) ? <span className="badge ghost">{windowLbl(f.window)}</span> : null}
      </div>
      <p className="lede">
        {metricLbl(f.metric)} is {showVal(f.observed)} against {showVal(f.expected)} before this broke.
      </p>
      {defnShort ? <p className="defn">{defnShort}</p> : null}
      <div className="impact-viz">
        <div className="kpis">
          {kpis.map(([val, k, s, tone], i) => (
            <div className={`kpi${tone ? " " + tone : ""}`} key={i}>
              <div className="k">{k}</div>
              <div className="v">{val}</div>
              <div className="s">{s}</div>
            </div>
          ))}
        </div>
        {weight}
      </div>
      <div className="who">
        <p className="owner">{who} needs to act.</p>
        <p className="inaction">{f.if_nothing_changes || ""}</p>
      </div>
      {ev0 ? <p className="lead-ev">{ev0}</p> : null}
      <div className="spans">
        <div className="span">
          <span className="kind">What changed</span>
          <div className="body">
            <h2 className="name">{metricLbl(f.metric)}</h2>
            {stdHint}
            <div className="hint">{f.baseline || "Baseline named in the report"}</div>
            <PairBars aLbl="Now" aVal={f.observed} bLbl="Before this broke" bVal={f.expected} aCls="bad" bCls="ok" title="Now vs before" />
          </div>
          <span className="val">{showVal(f.observed)}</span>
        </div>
        <div className="span">
          <span className="kind">Why we think so</span>
          <div className="body">
            <h2 className="name">
              {causeLbl(d && d.cause_class)}
              {d && d.confidence != null ? ` · confidence ${fmt(d.confidence, 2)}` : ""}
            </h2>
            <div className="hint">{changeLine(ac)}</div>
          </div>
          <span className="val">{ac && ac.day != null ? `day ${ac.day}` : "—"}</span>
        </div>
        <div className="span">
          <span className="kind">What we would change</span>
          <div className="body">
            {p ? (
              <>
                <h2 className="name">{p.target}</h2>
                <div className="hint">{p.description || ""}</div>
                <PairBars aLbl="Today" aVal={pd.from} bLbl="If we change it" bVal={pd.to} aCls="bad" bCls="ok" title="Today vs if we change it" />
              </>
            ) : (
              <h2 className="name">No change proposed</h2>
            )}
          </div>
          <span className="val">{pd.metric ? metricLbl(pd.metric) : "—"}</span>
        </div>
        <div className="span">
          <span className="kind">Did the test help</span>
          <div className="body">
            {v ? (
              <>
                <h2 className="name">
                  {replayLbl(v)}
                  {v.golden_set_pass === true
                    ? " · known-good conversations still passed"
                    : v.golden_set_pass === false
                    ? " · a known-good conversation got worse"
                    : ""}
                </h2>
                <div className="hint">
                  {"The test’s “before” is simulated, not our measured number."}
                  {v.prediction_error == null ? "" : " Gap vs prediction " + fmt(v.prediction_error, 4)}.
                </div>
                <PairBars aLbl="Test before" aVal={v.before} bLbl="Test after" bVal={v.after} aCls="bad" bCls="ok" title="Test before / after" />
              </>
            ) : (
              <>
                <h2 className="name">No test this run</h2>
                <div className="hint">The report is still the decision record.</div>
              </>
            )}
          </div>
          <span className="val">{v ? showVal(v.after) : "—"}</span>
        </div>
      </div>
      <MoreDetails summary="More evidence and why this baseline is fair">
        <p className="idle">
          {extra.join(" · ")}. {imp.derivation || "—"}
        </p>
        {evRest.length ? (
          <ul className="evidence">
            {evRest.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        ) : null}
      </MoreDetails>
    </>
  );
}
