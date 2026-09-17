// Ported 1:1 from renderModeBar() in nexus_loop/static/index.html (lines ~1438-1482).
import { modeSegs } from "@/lib/report";
import type { Bucket, Report } from "@/lib/types";

export function ModeBar({ rep, listFilter, onSelect }: { rep: Report; listFilter: Bucket; onSelect: (bucket: Bucket) => void }) {
  const segs = modeSegs(rep);
  return (
    <nav className="mode-bar" id="modebar" role="tablist" aria-label="Finding groups">
      {segs.map(([id, label]) => (
        <button
          type="button"
          key={id}
          className={`seg${listFilter === id ? " is-on" : ""}`}
          data-filter={id}
          role="tab"
          aria-selected={listFilter === id}
          onClick={() => onSelect(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
