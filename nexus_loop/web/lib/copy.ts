// Ported 1:1 from nexus_loop/static/index.html (inline <script>, lines ~1060-1176,
// 1646-1652, 1758-1773). Every quoted string here matches docs/manager-english.md
// and the live desk exactly — do not reword them (they're referenced by that doc).
import { firstBeat } from "./format";
import type { AttributedChange, Gap, Pack } from "./types";

export const AUDIENCE: Record<string, string> = {
  agent_builder: "Agent team",
  platform_owner: "Platform team",
  business_owner: "Business owner",
};

export const METRIC: Record<string, string> = {
  resolution_rate: "Share we finished",
  turns_to_resolve: "Turns to finish",
  tool_p95_latency_ms: "Tool wait time",
  containment_rate: "Share we handled end to end",
  quality_score: "Scorecard quality",
};

export const CAUSE: Record<string, string> = {
  "tool.contract_break": "The tool said success but sent an empty answer",
  "kb.gap": "The knowledge base has nothing for this question",
  "prompt.regression": "The prompt started taking more turns",
  traffic_mix: "Traffic mix, not quality",
  load: "A short load spike",
  judge_change: "The scorecard changed, not the agent",
};

export const ASK: Record<string, string> = {
  A01: "Handled end to end",
  A04: "Tool calls that failed",
  A06: "Knowledge base answers",
  A09: "Gave up frustrated",
  A11: "Failover rate",
};

const PHRASE_ENGLISH: Array<[string, string]> = [
  ["tool_call p95 duration_ms", "Tool wait time"],
  ["tool p95 latency", "Tool wait time"],
  ["duration_ms", "wait (ms)"],
  ["sessions/day", "sessions a day"],
  ["timeout rate", "timeouts"],
  ["platform owner", "Platform team"],
  ["agent builder", "Agent team"],
  ["business owner", "Business owner"],
  ["judge_version", "scorecard version"],
  ["config_timeline", "setup timeline"],
  ["quality_rubric", "quality rubric"],
  ["agent_kind", "agent kind"],
  ["tool_call", "tool call"],
  ["quality_score", "Scorecard quality"],
  ["aggregate containment", "Share we handled end to end"],
  ["containment rate", "Share we handled end to end"],
  ["Resolution is flat", "Share we finished is flat"],
  ["volume runs at", "Traffic ran at"],
  ["tool telemetry", "tool measurements"],
  ["coverage-limited to the", "only from the"],
];

const CAUSE_AUDIENCE: Record<string, string[]> = {
  load: ["platform_owner"],
  traffic_mix: ["business_owner"],
  judge_change: ["platform_owner"],
  "tool.outage": ["platform_owner"],
  "routing.error": ["platform_owner"],
  "kb.gap": ["agent_builder", "business_owner"],
  "tool.contract_break": ["agent_builder", "platform_owner"],
  "prompt.regression": ["agent_builder"],
  "model.change": ["agent_builder", "platform_owner"],
  unknown: ["agent_builder", "platform_owner"],
};

export const audienceLbl = (ids: string[] | null | undefined): string =>
  (ids || []).map((x) => AUDIENCE[x] || x).join(", ") || "—";

export function metricLbl(id: string | null | undefined): string {
  if (id && METRIC[id]) return METRIC[id];
  const s = String(id || "").replace(/_/g, " ").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export const causeLbl = (id: string | null | undefined): string =>
  (id && CAUSE[id]) || String(id || "unknown").replace(/[._]/g, " ");

export function audienceFor(pack: { f?: { audience?: string[] } | null; d?: { cause_class?: string | null } | null }): string {
  const f = pack && pack.f;
  if (f && f.audience && f.audience.length) return audienceLbl(f.audience);
  const cause = pack && pack.d && pack.d.cause_class;
  return audienceLbl((cause && CAUSE_AUDIENCE[cause]) || []);
}

export function toManagerEnglish(s: string | null | undefined): string {
  if (s == null) return "";
  let out = String(s);
  const pairs: Array<[string, string]> = [];
  [METRIC, CAUSE, AUDIENCE].forEach((map) => {
    Object.keys(map).forEach((k) => pairs.push([k, map[k]]));
  });
  PHRASE_ENGLISH.forEach((row) => pairs.push(row));
  pairs.sort((a, b) => b[0].length - a[0].length);
  const seen = new Set<string>();
  pairs.forEach(([k, v]) => {
    const key = k.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const re = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, v);
  });
  return out.replace(/\s*->\s*/g, " → ");
}

export const gapClaim = (g: Gap | null | undefined): string => {
  if (!g) return "We will not invent this number";
  if (g.ask_id === "A11") return "We will not invent a failover rate";
  if (g.ask_id === "A09") return "We will not invent why people left";
  if (g.ask_id === "A02") return "We will not break this down by customer";
  return "We will not invent this number";
};

const GAP_LEDE: Record<string, string> = {
  A11: "Failover does not exist here. There is no rate to show.",
  A09: "We count who left. We will not invent why.",
  A02: "Too many distinct customers to split this list.",
};

export function gapLede(g: Gap | null | undefined): string {
  if (g && GAP_LEDE[g.ask_id]) return GAP_LEDE[g.ask_id];
  return firstBeat(g && g.why, 140) || "We will not invent this number.";
}

export const replayLbl = (v: { verdict?: string | null } | null | undefined): string => {
  if (!v) return "No test this run";
  if (v.verdict === "improved") return "The test got better";
  if (v.verdict === "no_effect") return "The test did not move";
  return v.verdict || "Test result";
};

export function changeLine(ac: AttributedChange | null | undefined): string {
  if (!ac) return "Nothing in the setup changed with this";
  const who = ac.target || "Something";
  const day = ac.day != null ? ` on day ${ac.day}` : "";
  const vers = ac.from && ac.to ? ` (${ac.from} → ${ac.to})` : "";
  return `${who} changed${day}${vers}`;
}

export function idleGateCopy(pack: Pack): string {
  const g = (pack.kind === "gap" && pack.gap) || ({} as Gap);
  const notMeasurable = pack.kind === "gap" && (g.ask_id === "A11" || g.verdict === "NOT_MEASURABLE");
  if (notMeasurable) {
    return g.ask_id === "A11"
      ? "Nothing to approve. We will not invent a failover rate."
      : "Nothing to approve. We will not invent this number.";
  }
  if (pack.kind === "gap") {
    return "Nothing to approve. " + gapClaim(g) + ".";
  }
  if (pack.kind === "dismissed" || !pack.p) {
    return "Nothing to approve. This is not a problem.";
  }
  return "";
}
