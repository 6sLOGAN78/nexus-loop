// Ported 1:1 from renderDismissed() in nexus_loop/static/index.html (lines ~1596-1644).
import { audienceFor, causeLbl, toManagerEnglish, metricLbl } from "@/lib/copy";
import { cohortPath, showVal, valuesNear, windowLbl } from "@/lib/format";
import type { FindingPack } from "@/lib/types";
import { ClearCompare, MoreDetails, PairBars } from "./Visuals";

export function dismissedTechRows(pack: FindingPack): Array<{ k: string; v: unknown }> {
  const { f, d } = pack;
  return [
    { k: "cause", v: d && d.cause_class },
    { k: "metric", v: f.metric },
    { k: "finding", v: f.id },
  ];
}

export function DismissedDetail({ pack }: { pack: FindingPack }) {
  const { f, d } = pack;
  const who = audienceFor(pack);
  const claim = toManagerEnglish(f.not_a_regression_because || "—");
  const ev = (f.evidence || []).map((e) => toManagerEnglish(e));
  const near = valuesNear(f.observed, f.expected);
  const clearLine = near
    ? " Observed stays near usual — nothing to approve."
    : " The move is explained without a quality regression — nothing to approve.";

  return (
    <>
      <p className="kicker ok">Dismissed signals</p>
      <p className="path">{cohortPath(f)}</p>
      <h1 className="claim">{f.headline || metricLbl(f.metric) || f.id}</h1>
      <div className="chips">
        <span className="badge ghost">dismissed signals</span>
        {who && who !== "—" ? <span className="badge ok">{who}</span> : null}
        {f.tenant ? <span className="badge ghost">{f.tenant}</span> : null}
        {windowLbl(f.window) ? <span className="badge ghost">{windowLbl(f.window)}</span> : null}
      </div>
      <div className="state-fig ok">
        <ClearCompare observed={f.observed} expected={f.expected} />
        <p className="state-cap">
          <strong>This is not a problem.</strong>
          {who && who !== "—" ? ` A closed all-clear for the ${who}.` : ""}
          {clearLine}
        </p>
      </div>
      <p className="lede">{claim}</p>
      <div className="spans">
        <div className="span">
          <span className="kind">What we checked</span>
          <div className="body">
            <h2 className="name">{metricLbl(f.metric)}</h2>
            <div className="hint">Copied from the report. This is not a quality regression.</div>
            {f.observed != null && f.expected != null ? (
              <PairBars aLbl="This window" aVal={f.observed} bLbl="Usual" bVal={f.expected} aCls="ok" bCls="ok" title="Checked against usual" forceTone="ok" />
            ) : null}
          </div>
          <span className="val">{showVal(f.observed)}</span>
        </div>
        <div className="span">
          <span className="kind">Why we are sure</span>
          <div className="body">
            <h2 className="name">{causeLbl(d && d.cause_class)}</h2>
            <div className="hint">{who && who !== "—" ? `For the ${who} — nothing to approve.` : "Nothing to approve."}</div>
          </div>
          <span className="val">closed</span>
        </div>
      </div>
      <MoreDetails summary="Evidence">
        <ul className="evidence">
          {ev.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </MoreDetails>
    </>
  );
}
