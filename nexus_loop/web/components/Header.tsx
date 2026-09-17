// Ported 1:1 from the header markup + generateReport() in
// nexus_loop/static/index.html (lines ~1013-1026, 1870-1893).
import { Honesty } from "./Honesty";
import type { Report } from "@/lib/types";

export function Header({
  rep,
  onGenerate,
  genBusy,
  genFlash,
}: {
  rep: Report | null;
  onGenerate: () => void;
  genBusy: boolean;
  genFlash: { text: string; tone: "" | "ok" | "err" } | null;
}) {
  return (
    <header className="top">
      <div className="brand-wrap">
        <span className="mark" aria-hidden="true" />
        <h2 className="brand">Nexus Loop</h2>
      </div>
      <div className="meta" id="hdr">
        {rep ? `${rep.team || "—"} · ${rep.corpus || "—"}` : "Loading report…"}
      </div>
      <div className="gen-wrap">
        <button type="button" className="btn-gen" id="gen-btn" title="Re-run the pipeline into this report" onClick={onGenerate} disabled={genBusy}>
          Generate report
        </button>
        <span className={`gen-flash${genFlash?.tone ? " " + genFlash.tone : ""}`} id="gen-flash" role="status" aria-live="polite">
          {genFlash?.text || ""}
        </span>
      </div>
      <div className="spacer" />
      {rep ? <Honesty rep={rep} /> : <div className="honesty" id="honesty" />}
    </header>
  );
}
