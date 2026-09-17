// Implements the FROZEN window.NexusDesk contract from
// docs/prd-signed-copy.md §6.2 / Appendix A, ported 1:1 from the exact source
// expressions in nexus_loop/static/index.html (lines 1908-2089). Every method
// returns exactly what the desk displays -- no new computation, no rounding,
// no reformatting. The Signed copy subsystem (loaded unmodified from
// /signed-copy/*.js) calls into this object exactly as it does on the
// original static page.
import { audienceLbl, causeLbl, changeLine, metricLbl } from "./copy";
import { fmt, pct, showVal } from "./format";
import { filterForPack, packForFinding, pickHonestyMetrics, refusalClaims as refusalClaimsFor } from "./report";
import type { Bucket, Finding, Report } from "./types";

export interface NexusDeskApi {
  selectedFinding(): Finding | null;
  bucketOf(finding: Finding | null): Bucket | null;
  findingsIn(bucket: Bucket): Finding[];
  bucketCountText(bucket: Bucket): string | null;
  findingUrl(finding: Finding | null): string | null;
  runLabelText(): string | null;
  claimText(finding: Finding | null): string | null;
  metricLabel(finding: Finding | null): string | null;
  observedText(finding: Finding | null): string | null;
  expectedText(finding: Finding | null): string | null;
  affectedFigureText(finding: Finding | null): string | null;
  causeText(finding: Finding | null): string | null;
  configChangeText(finding: Finding | null): string | null;
  changeTargetText(finding: Finding | null): string | null;
  changeDescriptionText(finding: Finding | null): string | null;
  replayText(finding: Finding | null): { before: string; after: string } | null;
  riskText(finding: Finding | null): string | null;
  ifNothingChangesText(finding: Finding | null): string | null;
  ownerText(finding: Finding | null): string | null;
  technicalNames(finding: Finding | null): string[];
  coverageText(): string | null;
  refusalClaims(): string[];
  decisionFor(finding: Finding | null): { verdict: string; reason?: string | null; recordedAtText: null } | null;
}

// selectedFinding() needs "the finding currently on screen", which in the
// original is derived from module-level `selectedKey` state via currentPack().
// Here that's owned by the Desk component; it's threaded in via getSelected.
export function createNexusDesk(rep: Report | null, getSelected: () => Finding | null): NexusDeskApi {
  return {
    selectedFinding() {
      if (!rep) return null;
      return getSelected();
    },
    bucketOf(finding) {
      if (!rep || !finding) return null;
      return filterForPack(packForFinding(rep, finding));
    },
    findingsIn(bucket) {
      if (!rep) return [];
      const findings = rep.findings || [];
      if (bucket === "open") return findings.filter((f) => f.is_regression);
      if (bucket === "ignored") return findings.filter((f) => !f.is_regression);
      return [];
    },
    bucketCountText(bucket) {
      if (!rep) return null;
      if (bucket === "open") return String((rep.findings || []).filter((f) => f.is_regression).length);
      if (bucket === "ignored") return String((rep.findings || []).filter((f) => !f.is_regression).length);
      if (bucket === "refused") return String((rep.gaps || []).length);
      return null;
    },
    findingUrl(finding) {
      if (!finding || !finding.id || typeof window === "undefined") return null;
      return window.location.origin + window.location.pathname + window.location.search + "#" + finding.id;
    },
    runLabelText() {
      if (!rep) return null;
      const team = rep.team || "";
      const corpus = rep.corpus || "";
      if (!team && !corpus) return null;
      return `${team || "—"} · ${corpus || "—"}`;
    },
    claimText(finding) {
      if (!finding) return null;
      return finding.headline || metricLbl(finding.metric) || null;
    },
    metricLabel(finding) {
      if (!finding) return null;
      const s = metricLbl(finding.metric);
      return s || null;
    },
    observedText(finding) {
      if (!finding || finding.observed == null) return null;
      return showVal(finding.observed);
    },
    expectedText(finding) {
      if (!finding || finding.expected == null) return null;
      return showVal(finding.expected);
    },
    affectedFigureText(finding) {
      if (!finding) return null;
      const n = (finding.impact || {}).conversations_affected;
      if (n == null) return null;
      return fmt(n, 0);
    },
    causeText(finding) {
      if (!rep || !finding) return null;
      const d = packForFinding(rep, finding).d;
      if (!d || d.cause_class == null) return null;
      return causeLbl(d.cause_class);
    },
    configChangeText(finding) {
      if (!rep || !finding) return null;
      const d = packForFinding(rep, finding).d;
      const ac = d && d.attributed_change;
      return changeLine(ac);
    },
    changeTargetText(finding) {
      if (!rep || !finding) return null;
      const p = packForFinding(rep, finding).p;
      return p && p.target != null && String(p.target) !== "" ? String(p.target) : null;
    },
    changeDescriptionText(finding) {
      if (!rep || !finding) return null;
      const p = packForFinding(rep, finding).p;
      return p && p.description != null && String(p.description) !== "" ? String(p.description) : null;
    },
    replayText(finding) {
      if (!rep || !finding) return null;
      const v = packForFinding(rep, finding).v;
      if (!v) return null;
      if (v.before == null || v.after == null) return null;
      return { before: showVal(v.before), after: showVal(v.after) };
    },
    riskText(finding) {
      if (!rep || !finding) return null;
      const p = packForFinding(rep, finding).p;
      const risk = p && p.decision && p.decision.risk_if_diagnosis_wrong;
      if (risk == null || String(risk) === "") return null;
      return String(risk);
    },
    ifNothingChangesText(finding) {
      if (!finding) return null;
      const t = finding.if_nothing_changes;
      if (t == null || String(t) === "") return null;
      return String(t);
    },
    ownerText(finding) {
      if (!finding) return null;
      const who = audienceLbl(finding.audience);
      return who + " needs to act.";
    },
    technicalNames(finding) {
      if (!rep || !finding) return [];
      const pack = packForFinding(rep, finding);
      const { f, d, p, v } = pack;
      if (!f) return [];
      let rows: Array<{ k: string; v: unknown }>;
      if (pack.kind === "dismissed") {
        rows = [
          { k: "cause", v: d && d.cause_class },
          { k: "metric", v: f.metric },
          { k: "finding", v: f.id },
        ];
      } else {
        const ac = d && d.attributed_change;
        rows = [
          { k: "cause", v: d && d.cause_class },
          { k: "metric", v: f.metric },
          { k: "change", v: p && p.change_type },
          { k: "attributed kind", v: ac && ac.kind },
          { k: "test run", v: v && v.replay_run_id },
          { k: "finding", v: f.id },
        ];
      }
      return rows.filter((r) => r && r.v != null && String(r.v) !== "").map((r) => String(r.v));
    },
    coverageText() {
      if (!rep) return null;
      const metrics = rep.metrics || [];
      const pick = pickHonestyMetrics(rep);
      for (const m of pick) {
        if (m && m.coverage && m.coverage.value != null) return "coverage " + pct(m.coverage.value);
      }
      for (const m of metrics) {
        if (m && m.coverage && m.coverage.value != null) return "coverage " + pct(m.coverage.value);
      }
      return null;
    },
    refusalClaims() {
      if (!rep) return [];
      return refusalClaimsFor(rep);
    },
    decisionFor(finding) {
      if (!rep || !finding) return null;
      const p = packForFinding(rep, finding).p;
      const a = p && p.approval;
      if (!a || !a.verdict) return null;
      return {
        verdict: a.verdict,
        reason: a.reason,
        recordedAtText: null,
      };
    },
  };
}
