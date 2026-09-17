// Ported 1:1 from renderList()/bindListKeys() in nexus_loop/static/index.html
// (lines ~1484-1556).
import { useEffect, useRef, type KeyboardEvent } from "react";
import { fmt, windowLbl } from "@/lib/format";
import { gapClaim } from "@/lib/copy";
import type { Bucket, Finding, Gap, Report } from "@/lib/types";

interface Row {
  key: string;
  dot: "ok" | "bad" | "warn" | "miss";
  tone: string;
  title: string;
  sub: string;
  stat: { kind: "ghost"; text: string } | { kind: "text"; text: string } | null;
}

function findingRow(f: Finding, kind: "regression" | "dismissed"): Row {
  const imp = f.impact || {};
  const sev = f.severity || "";
  const dot = kind === "dismissed" ? "ok" : sev === "critical" || sev === "high" ? "bad" : "warn";
  const tone = kind === "dismissed" ? " ok" : "";
  const sub = `${f.tenant || "—"} · ${windowLbl(f.window) || "—"}`;
  const title = f.headline || f.metric || f.id;
  const n = imp.conversations_affected;
  const stat: Row["stat"] =
    kind === "dismissed"
      ? { kind: "ghost", text: "dismissed signals" }
      : n != null
      ? { kind: "text", text: fmt(n, 0) + " conv." }
      : null;
  return { key: f.id, dot, tone, title, sub, stat };
}

function gapRow(g: Gap): Row {
  const key = "gap:" + g.ask_id;
  const title = gapClaim(g);
  return { key, dot: "miss", tone: " miss", title, sub: "No measurement", stat: { kind: "ghost", text: "no measurement" } };
}

export function ListColumn({
  rep,
  listFilter,
  selectedKey,
  onSelect,
}: {
  rep: Report;
  listFilter: Bucket;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const focusPending = useRef(false);

  const regs = (rep.findings || []).filter((f) => f.is_regression);
  const dismissed = (rep.findings || []).filter((f) => !f.is_regression);
  const gaps = rep.gaps || [];
  const a11 = gaps.filter((g) => g.ask_id === "A11");
  const rest = gaps.filter((g) => g.ask_id !== "A11");

  let rows: Row[] = [];
  if (listFilter === "open") rows = regs.map((f) => findingRow(f, "regression"));
  else if (listFilter === "ignored") rows = dismissed.map((f) => findingRow(f, "dismissed"));
  else rows = [...a11, ...rest].map(gapRow);

  useEffect(() => {
    const el = navRef.current?.querySelector<HTMLElement>(".trace.is-on");
    if (!el) return;
    el.scrollIntoView({ block: "nearest" });
    // Mirrors bindListKeys() re-focusing the new row after an arrow/Home/End
    // move -- the original DOM was rebuilt via innerHTML on every keypress,
    // destroying focus, so it explicitly refocused `.trace.is-on` afterward.
    if (focusPending.current) {
      focusPending.current = false;
      el.focus();
    }
  }, [selectedKey, listFilter]);

  function onKeyDown(ev: KeyboardEvent<HTMLElement>) {
    if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp" && ev.key !== "Home" && ev.key !== "End") return;
    if (!rows.length) return;
    ev.preventDefault();
    focusPending.current = true;
    let i = rows.findIndex((r) => r.key === selectedKey);
    if (i < 0) i = 0;
    if (ev.key === "ArrowDown") i = Math.min(rows.length - 1, i + 1);
    else if (ev.key === "ArrowUp") i = Math.max(0, i - 1);
    else if (ev.key === "Home") i = 0;
    else i = rows.length - 1;
    onSelect(rows[i].key);
  }

  return (
    <nav className="list-col" id="list" aria-label="Findings" tabIndex={0} ref={navRef} onKeyDown={onKeyDown}>
      <div className="list-body">
        {rows.length ? (
          rows.map((r) => (
            <button
              type="button"
              key={r.key}
              className={`trace${r.tone}${selectedKey === r.key ? " is-on" : ""}`}
              data-key={r.key}
              title={r.title}
              aria-current={selectedKey === r.key ? "true" : "false"}
              onClick={() => onSelect(r.key)}
            >
              <span className={`dot ${r.dot}`} aria-hidden="true" />
              <span className="t-main">
                <span className="t-title">{r.title}</span>
                <span className="t-sub">{r.sub}</span>
              </span>
              <span className="t-stat">
                {r.stat ? r.stat.kind === "ghost" ? <span className="badge ghost">{r.stat.text}</span> : r.stat.text : null}
              </span>
            </button>
          ))
        ) : (
          <p className="idle" style={{ padding: "1rem" }}>
            Nothing in this group.
          </p>
        )}
      </div>
    </nav>
  );
}
