// Ported 1:1 from nexus_loop/static/index.html (inline <script>, lines ~1197-1213,
// 1283-1436). Finding/diagnosis/prescription/verification lookups and the
// open/ignored/refused bucket split are unchanged from the original desk.
import { fmt, pct } from "./format";
import { ASK, gapClaim, metricLbl } from "./copy";
import type { Bucket, Diagnosis, EmptyPack, Finding, FindingPack, Metric, Pack, Prescription, Report, Standard, Verification } from "./types";

export const SAFE_KEY = /^(gap:[A-Z0-9]+|[A-Za-z0-9._-]+)$/;

interface Indexes {
  diags: Record<string, Diagnosis>;
  byFid: Record<string, Diagnosis>;
  pres: Prescription[];
  vers: Verification[];
  byDiag: Record<string, Prescription>;
}

export function indexes(rep: Report): Indexes {
  const diags = Object.fromEntries((rep.diagnoses || []).map((d) => [d.id, d]));
  const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
  const pres = rep.prescriptions || [];
  const vers = rep.verifications || [];
  const byDiag: Record<string, Prescription> = {};
  pres.forEach((p) => {
    byDiag[p.diagnosis_id] = p;
  });
  return { diags, byFid, pres, vers, byDiag };
}

export function packForFinding(rep: Report, f: Finding | null | undefined): FindingPack | EmptyPack {
  const { byFid, byDiag, vers } = indexes(rep);
  const d = f ? byFid[f.id] : null;
  const p = d ? byDiag[d.id] || null : null;
  const v = (p && vers.find((x) => x.prescription_id === p.id)) || null;
  if (!f) {
    return { kind: "regression", f: null, d: null, p: null, v: null };
  }
  return { kind: f.is_regression ? "regression" : "dismissed", f, d: d || null, p, v };
}

export function defaultFinding(rep: Report): Finding | null {
  const { diags, byFid, pres, vers } = indexes(rep);
  const findings = rep.findings || [];
  if (vers.length) {
    const p = pres.find((x) => x.id === vers[0].prescription_id);
    const d = p && diags[p.diagnosis_id];
    const f = d && findings.find((x) => x.id === d.finding_id);
    if (f) return f;
  }
  const regs = findings.filter((x) => x.is_regression);
  return regs.find((x) => (byFid[x.id] || ({} as Diagnosis)).cause_class === "tool.contract_break") || regs[0] || findings[0] || null;
}

export function keyFromHash(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const h = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
    return SAFE_KEY.test(h) ? h : null;
  } catch {
    return null;
  }
}

export function currentPack(rep: Report, selectedKey: string | null): { pack: Pack; key: string | null } {
  let key = selectedKey;
  if (key && key.startsWith("gap:")) {
    const ask = key.slice(4);
    const gap = (rep.gaps || []).find((g) => g.ask_id === ask);
    if (gap) return { pack: { kind: "gap", gap }, key };
  }
  const findings = rep.findings || [];
  const f = findings.find((x) => x.id === key) || defaultFinding(rep);
  if (f && !key) key = f.id;
  return { pack: packForFinding(rep, f), key };
}

export function filterForPack(pack: Pack): Bucket {
  if (pack.kind === "gap") return "refused";
  if (pack.kind === "dismissed") return "ignored";
  return "open";
}

export function modeSegs(rep: Report): Array<[Bucket, string]> {
  const regs = (rep.findings || []).filter((f) => f.is_regression);
  const dismissed = (rep.findings || []).filter((f) => !f.is_regression);
  const gaps = rep.gaps || [];
  return [
    ["open", `Needs attention (${regs.length})`],
    ["ignored", `Dismissed signals (${dismissed.length})`],
    ["refused", `No measurement (${gaps.length})`],
  ];
}

export function selectFirstInFilter(rep: Report, filter: Bucket): string | null {
  if (filter === "open") {
    const f = (rep.findings || []).find((x) => x.is_regression);
    return f ? f.id : null;
  }
  if (filter === "ignored") {
    const f = (rep.findings || []).find((x) => !x.is_regression);
    return f ? f.id : null;
  }
  const gaps = rep.gaps || [];
  const g = gaps.find((x) => x.ask_id === "A11") || gaps[0];
  return g ? "gap:" + g.ask_id : null;
}

export function matchStandard(rep: Report, f: Finding | null | undefined): Standard | null {
  if (!f) return null;
  const c = f.cohort || {};
  return (
    (rep.standard || []).find((s) => {
      if (s.tenant !== f.tenant || s.metric !== f.metric) return false;
      const sc = s.cohort || {};
      return Object.keys(sc).every((k) => sc[k] == null || sc[k] === (c as Record<string, unknown>)[k]);
    }) || null
  );
}

export function standardLine(s: Standard | null, metric: string | null | undefined): string {
  if (!s) return "";
  const rate = typeof s.median === "number" && s.median <= 1;
  const mid = rate ? pct(s.median) : fmt(s.median, 1);
  const best = rate ? pct(s.best) : fmt(s.best, 1);
  const what = metricLbl(metric || s.metric);
  return `Healthy conversations here sit around ${mid} ${what} (best ${best}).`;
}

export function fidelityClass(fid: string | null | undefined): "ok" | "warn" | "ghost" {
  if (fid === "measured") return "ok";
  if (fid === "derived") return "warn";
  return "ghost";
}

export interface ShortNote {
  label: string;
  text: string;
}

export function shortNotes(notes: unknown): ShortNote[] {
  const text = typeof notes === "string" ? notes : JSON.stringify(notes || "");
  const out: ShortNote[] = [];
  const specs: Array<[string, RegExp]> = [
    ["REAL", /REAL:\s*([\s\S]*?)(?=REAL:|STUBBED:|SIMULATED:|BREAKS AT|$)/],
    ["STUBBED", /STUBBED:\s*([\s\S]*?)(?=REAL:|STUBBED:|SIMULATED:|BREAKS AT|$)/],
    ["SIMULATED", /SIMULATED:\s*([\s\S]*?)(?=REAL:|STUBBED:|SIMULATED:|BREAKS AT|$)/],
    ["Breaks at 100×", /BREAKS AT(?: 100x)?:\s*([\s\S]*?)(?=REAL:|STUBBED:|SIMULATED:|BREAKS AT|$)/],
  ];
  specs.forEach(([label, re]) => {
    const m = text.match(re);
    if (!m) return;
    let s = m[1].replace(/\s+/g, " ").trim();
    if (s.length > 220) s = s.slice(0, 217) + "…";
    out.push({ label, text: s });
  });
  return out;
}

export interface MetricChip {
  name: string;
  fidelity: string;
  fidelityClass: "ok" | "warn" | "ghost";
  title: string;
  rest: string;
}

export function metricChip(m: Metric | null | undefined): MetricChip | null {
  if (!m) return null;
  const fid = m.fidelity || "unknown";
  const name = fid === "judged" ? "Scorecard quality" : ASK_FALLBACK(m);
  const cal = m.calibration || {};
  const basis = (m.coverage && m.coverage.basis) || "";
  let rest = "";
  if (fid === "judged" && cal.agreement != null) {
    rest = `agrees ${pct(cal.agreement)} (n=${fmt(cal.n, 0)})`;
  } else if (m.coverage && m.coverage.value != null) {
    rest = `coverage ${pct(m.coverage.value)}`;
  }
  const title = [fid, basis].filter(Boolean).join(" · ");
  return { name, fidelity: fid, fidelityClass: fidelityClass(fid), title, rest };
}

// Small local helper: mirrors `ASK[m.ask_id] || m.name || m.ask_id || m.id`
function ASK_FALLBACK(m: { ask_id?: string | null; name?: string | null; id?: string | null }): string {
  return (m.ask_id && ASK[m.ask_id]) || m.name || m.ask_id || m.id || "";
}

export function pickHonestyMetrics(rep: Report): Metric[] {
  const metrics = rep.metrics || [];
  const pick = ["A01", "A04"].map((id) => metrics.find((x) => x.ask_id === id)).filter(Boolean) as Metric[];
  const judged = metrics.find((x) => x.fidelity === "judged");
  if (judged && !pick.includes(judged)) pick.push(judged);
  return pick;
}

export function coverageText(rep: Report): string | null {
  const metrics = rep.metrics || [];
  const pick = pickHonestyMetrics(rep);
  for (const m of pick) {
    if (m && m.coverage && m.coverage.value != null) return "coverage " + pct(m.coverage.value);
  }
  for (const m of metrics) {
    if (m && m.coverage && m.coverage.value != null) return "coverage " + pct(m.coverage.value);
  }
  return null;
}

export function refusalClaims(rep: Report): string[] {
  const gaps = rep.gaps || [];
  const a11 = gaps.filter((g) => g.ask_id === "A11");
  const rest = gaps.filter((g) => g.ask_id !== "A11");
  return [...a11, ...rest].map(gapClaim);
}
