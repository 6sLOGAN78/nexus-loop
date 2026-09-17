// Ported 1:1 from renderGap() in nexus_loop/static/index.html (lines ~1558-1594).
import { gapClaim, gapLede, idleGateCopy, toManagerEnglish } from "@/lib/copy";
import type { Gap } from "@/lib/types";
import { InventBlock } from "./Visuals";

export function gapTechRows(gap: Gap): Array<{ k: string; v: unknown }> {
  const g = gap || ({} as Gap);
  const ev = g.required_event || {};
  return [
    { k: "ask", v: g.ask_id },
    { k: "verdict", v: g.verdict },
    { k: "nearest proxy", v: g.nearest_proxy },
    { k: "event", v: ev.name },
    { k: "grain", v: ev.grain },
    { k: "fields", v: (ev.fields || []).join(", ") },
    { k: "owner", v: ev.owner },
  ];
}

export function GapDetail({ gap }: { gap: Gap }) {
  const g = gap || ({} as Gap);
  const ev = g.required_event || {};
  const whyRaw = (g.why || "—").replace(/\s*Required event:[\s\S]*$/i, "").trim() || g.why || "—";
  const why = toManagerEnglish(whyRaw);
  void why; // matches original: computed but not rendered directly in this block

  return (
    <>
      <p className="kicker miss">No measurement</p>
      <h1 className="claim">{gapClaim(g)}</h1>
      <div className="chips">
        <span className="badge ghost">no measurement</span>
      </div>
      <div className="state-fig miss">
        <InventBlock />
        <p className="state-cap">
          <strong>Refusal, not a blank chart.</strong> {gapLede(g)}
        </p>
      </div>
      <div className="alert miss">
        <p>
          <strong>{idleGateCopy({ kind: "gap", gap: g })}</strong>
        </p>
      </div>
      <div className="spans">
        <div className="span">
          <span className="kind">What changed</span>
          <div className="body">
            <h2 className="name">There is nothing to count</h2>
            <div className="hint">The system never records this event, so a rate would be invented.</div>
          </div>
          <span className="val">—</span>
        </div>
        {g.why_the_proxy_misleads ? (
          <div className="span">
            <span className="kind">Lookalike</span>
            <div className="body">
              <h2 className="name">Why a retry is not failover</h2>
              <div className="hint">{toManagerEnglish(g.why_the_proxy_misleads)}</div>
            </div>
            <span className="val">not the same</span>
          </div>
        ) : null}
      </div>
      {ev.name ? (
        <div className="alert miss">
          <p>
            If this were counted, the event would be <code translate="no">{ev.name}</code> at {ev.grain || "—"} grain, owned by{" "}
            {ev.owner || "—"}.
          </p>
        </div>
      ) : null}
    </>
  );
}
