// Ported 1:1 from nexus_loop/static/index.html's api() helper (lines ~1284-1316).
// Same timeout, same same-origin credentials, same error surface. The Next.js
// rewrites in next.config.js make these paths same-origin against the Python
// backend, exactly like the original static page.
import type { Report } from "./types";

export interface ApiOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const ctrl = new AbortController();
  const waitMs = opts.timeoutMs != null ? opts.timeoutMs : 15000;
  const t = setTimeout(() => ctrl.abort(), waitMs);
  const hdrs: Record<string, string> = Object.assign(
    { Accept: "application/json" },
    opts.body ? { "Content-Type": "application/json" } : {},
    opts.headers || {}
  );
  try {
    const res = await fetch(path, {
      credentials: "same-origin",
      signal: ctrl.signal,
      method: opts.method || "GET",
      headers: hdrs,
      body: opts.body,
    });
    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("The server returned something we could not read.");
      }
    }
    if (!res.ok) {
      const d = data as { detail?: string; error?: string } | null;
      const msg = (d && (d.detail || d.error)) || res.statusText || "request failed";
      throw new Error(String(msg));
    }
    return data as T;
  } finally {
    clearTimeout(t);
  }
}

export const getHealth = () => api<{ ok?: boolean; report?: boolean; generate?: boolean }>("/health");
export const getReport = () => api<Report>("/report.json");

export interface DecisionPayload {
  prescription_id: string;
  verdict: string;
  decided_by: string;
  reason: string;
}

export const postDecision = (payload: DecisionPayload) =>
  api("/decision", { method: "POST", body: JSON.stringify(payload) });

export interface GenerateSummary {
  findings?: number;
  verifications?: number;
}

export const postGenerate = () =>
  api<GenerateSummary>("/generate", { method: "POST", body: "{}", timeoutMs: 200000 });
