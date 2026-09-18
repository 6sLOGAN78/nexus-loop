// Ported 1:1 from nexus_loop/static/index.html (pairBars, shareWeight,
// clearCompare, inventBlock, rateBar -- lines ~1214-1281). Same markup/classes,
// same computed widths, now as JSX instead of template strings.
import type { ReactNode } from "react";
import { deltaTone, fmt, formatDelta, pct, showVal } from "@/lib/format";

export function RateBar({ n, cls }: { n: number | null | undefined; cls?: string }) {
  const w = n == null || Number.isNaN(Number(n)) ? 0 : Math.max(2, Math.min(100, Number(n) * 100));
  return (
    <span className="track">
      <i className={cls || ""} style={{ width: `${w}%` }} />
    </span>
  );
}

export function PairBars({
  aLbl,
  aVal,
  bLbl,
  bVal,
  aCls,
  bCls,
  title,
  forceTone,
}: {
  aLbl: string;
  aVal: number | null | undefined;
  bLbl: string;
  bVal: number | null | undefined;
  aCls: "ok" | "bad";
  bCls: "ok" | "bad";
  title?: string;
  forceTone?: "ok" | "bad";
}) {
  if (aVal == null || bVal == null) return null;
  const a = Number(aVal);
  const b = Number(bVal);
  const asRate = a >= 0 && b >= 0 && a <= 1 && b <= 1;
  const max = Math.max(a, b, asRate ? 1 : 0.0001);
  const show = (n: number) => (asRate ? pct(n) : fmt(n, 4));
  const higherIsWorse = aCls === "bad" ? a > b : !asRate && Math.max(a, b) > 1;
  const tone = forceTone || (aCls === "ok" && bCls === "ok" ? "ok" : deltaTone(a, b, higherIsWorse));
  const delta = formatDelta(a, b, asRate);
  const aria = `${aLbl} ${show(a)}, ${bLbl} ${show(b)}${delta ? ", delta " + delta : ""}`;
  return (
    <div className="pair-fig" role="img" aria-label={aria}>
      <div className="pair-head">
        <span className="pair-title">{title || "Compared from the report"}</span>
        {delta ? <span className={`pair-delta ${tone}`}>{delta}</span> : null}
      </div>
      <div className="bars">
        <div className="barrow">
          <span className="bl">{aLbl}</span>
          <RateBar n={asRate ? a : a / max} cls={aCls} />
          <span className="bv">{show(a)}</span>
        </div>
        <div className="barrow">
          <span className="bl">{bLbl}</span>
          <RateBar n={asRate ? b : b / max} cls={bCls} />
          <span className="bv">{show(b)}</span>
        </div>
      </div>
    </div>
  );
}

export function ShareWeight({ share, tenant }: { share: number | null | undefined; tenant?: string | null }) {
  if (share == null || Number.isNaN(Number(share))) return null;
  const w = Math.max(2, Math.min(100, Number(share) * 100));
  const label = tenant || "tenant";
  return (
    <div className="share-weight" role="img" aria-label={pct(share) + " of " + label}>
      <div className="share-meta">
        <span className="share-lbl">Weight of conversations</span>
        <span className="share-val">
          {pct(share)} of {label}
        </span>
      </div>
      <div className="share-track">
        <i style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

export function ClearCompare({ observed, expected }: { observed: number | null | undefined; expected: number | null | undefined }) {
  if (observed == null || expected == null) return null;
  return (
    <div className="clear-strip" role="img" aria-label={"This window " + showVal(observed) + ", usual " + showVal(expected)}>
      <div className="clear-col">
        <span className="clear-lbl">This window</span>
        <span className="clear-val">{showVal(observed)}</span>
      </div>
      <span className="clear-mid">vs</span>
      <div className="clear-col">
        <span className="clear-lbl">Usual</span>
        <span className="clear-val">{showVal(expected)}</span>
      </div>
    </div>
  );
}

export function InventBlock() {
  return (
    <div className="state-meter" aria-hidden="true">
      <span className="state-block">No rate to plot</span>
    </div>
  );
}

export function TechFoot({ rows }: { rows: Array<{ k: string; v: unknown }> }) {
  const bits = (rows || []).filter((r) => r && r.v != null && String(r.v) !== "");
  if (!bits.length) return null;
  return (
    <footer className="tech-foot">
      <h2 className="tech-head">Technical names</h2>
      {bits.map((r, i) => (
        <div className="tech" key={i}>
          <span className="tk">{r.k}</span>
          <code translate="no">{String(r.v)}</code>
        </div>
      ))}
    </footer>
  );
}

export function MoreDetails({ summary, children }: { summary: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <details className="more">
      <summary>{summary}</summary>
      <div className="inner">{children}</div>
    </details>
  );
}
