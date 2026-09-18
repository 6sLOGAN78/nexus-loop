// Ported 1:1 from nexus_loop/static/index.html (inline <script>, lines ~1047-1059,
// 1214-1281). Same output strings, same rounding — nothing here recomputes or
// reformats a report number differently than the original desk did.
import type { Cohort, Finding, Window_ } from "./types";

export const fmt = (n: number | null | undefined, d = 2): string =>
  n === null || n === undefined ? "—" : Number(n).toLocaleString(undefined, { maximumFractionDigits: d });

export const pct = (n: number | null | undefined): string =>
  n === null || n === undefined ? "—" : (100 * n).toFixed(1) + "%";

export const showVal = (n: number | null | undefined): string =>
  typeof n === "number" && n <= 1 && n >= 0 ? pct(n) : fmt(n, 4);

export function cohortPath(f: Finding | null | undefined): string {
  const c: Cohort = (f && f.cohort) || {};
  const bits = [f && f.tenant, c.intent || c.agent_id, c.tool].filter(Boolean);
  return bits.length ? "/" + bits.join("/") : "/";
}

export function windowLbl(w: Window_ | null | undefined): string {
  if (!w) return "";
  const a = w.from_day;
  const b = w.to_day;
  if (a == null && b == null) return "";
  return `days ${a ?? "—"}–${b ?? "—"}`;
}

export function valuesNear(a: number | null | undefined, b: number | null | undefined): boolean {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  const scale = Math.max(Math.abs(x), Math.abs(y), 1e-9);
  return Math.abs(x - y) / scale <= 0.12;
}

export function deltaTone(a: number, b: number, higherIsWorse: boolean): "ok" | "bad" {
  const d = Number(a) - Number(b);
  if (!Number.isFinite(d) || d === 0) return "ok";
  const worse = higherIsWorse ? d > 0 : d < 0;
  return worse ? "bad" : "ok";
}

export function formatDelta(a: number, b: number, asRate: boolean): string {
  const d = Number(a) - Number(b);
  if (!Number.isFinite(d)) return "";
  const abs = Math.abs(d);
  const body = asRate ? pct(abs) : fmt(abs, abs >= 10 ? 1 : 4);
  if (d === 0) return "No change";
  return (d > 0 ? "+" : "−") + body;
}

export function firstBeat(s: string | null | undefined, max?: number): string {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  const cut = t.split(/(?<=[.!?])\s+|:\s+|;\s+/)[0] || t;
  const cap = max || 140;
  return cut.length <= cap ? cut : cut.slice(0, cap - 1) + "…";
}
