// Shapes mirror the fields read by the original nexus_loop/static/index.html
// render logic. Fields are optional/loose on purpose: the report is produced
// by nexus_loop/report.py and this app never validates or reshapes it, only
// displays what's there (per handoff.md — never compute or reformat a number).

export interface Window_ {
  from_day?: number | null;
  to_day?: number | null;
}

export interface Cohort {
  intent?: string | null;
  agent_id?: string | null;
  tool?: string | null;
  [key: string]: unknown;
}

export interface Downstream {
  abandoned?: number | null;
  extra_turns?: number | null;
  excess_cost_usd?: number | null;
  would_have_resolved_at_baseline?: number | null;
  resolved_conversations_slowed?: number | null;
  unplanned_handoffs?: number | null;
}

export interface Impact {
  conversations_affected?: number | null;
  share_of_traffic?: number | null;
  days_running?: number | null;
  cost_usd?: number | null;
  downstream?: Downstream;
  derivation?: string | null;
}

export interface Finding {
  id: string;
  tenant?: string | null;
  cohort?: Cohort;
  metric?: string | null;
  window?: Window_;
  is_regression?: boolean;
  observed?: number | null;
  expected?: number | null;
  severity?: string | null;
  impact?: Impact;
  audience?: string[];
  if_nothing_changes?: string | null;
  headline?: string | null;
  baseline?: string | null;
  not_a_regression_because?: string | null;
  evidence?: string[];
}

export interface AttributedChange {
  kind?: string | null;
  target?: string | null;
  day?: number | null;
  from?: string | null;
  to?: string | null;
}

export interface Diagnosis {
  id: string;
  finding_id: string;
  cause_class?: string | null;
  confidence?: number | null;
  attributed_change?: AttributedChange | null;
  evidence?: string[];
}

export interface PredictedDelta {
  metric?: string | null;
  from?: number | null;
  to?: number | null;
}

export interface Decision {
  asking_approval_for?: string | null;
  risk_if_diagnosis_wrong?: string | null;
  would_not_ship_if?: string | null;
}

export interface Approval {
  verdict?: "accepted" | "rejected" | "deferred" | null;
  reason?: string | null;
}

export interface Prescription {
  id: string;
  diagnosis_id: string;
  target?: string | null;
  description?: string | null;
  change_type?: string | null;
  predicted_delta?: PredictedDelta;
  decision?: Decision;
  approval?: Approval;
}

export interface Verification {
  prescription_id: string;
  before?: number | null;
  after?: number | null;
  verdict?: string | null;
  golden_set_pass?: boolean | null;
  prediction_error?: number | null;
  replay_run_id?: string | null;
}

export interface RequiredEvent {
  name?: string | null;
  grain?: string | null;
  fields?: string[];
  owner?: string | null;
}

export interface Gap {
  ask_id: string;
  why?: string | null;
  why_the_proxy_misleads?: string | null;
  required_event?: RequiredEvent;
  verdict?: string | null;
  nearest_proxy?: string | null;
}

export interface Calibration {
  agreement?: number | null;
  n?: number | null;
}

export interface Coverage {
  basis?: string | null;
  value?: number | null;
}

export interface Metric {
  ask_id?: string | null;
  id?: string | null;
  name?: string | null;
  fidelity?: string | null;
  calibration?: Calibration;
  coverage?: Coverage;
}

export interface Standard {
  tenant?: string | null;
  metric?: string | null;
  cohort?: Cohort;
  median?: number | null;
  best?: number | null;
}

export interface Report {
  team?: string | null;
  corpus?: string | null;
  generated_at?: string | null;
  system_notes?: string | null;
  metrics?: Metric[];
  standard?: Standard[];
  findings?: Finding[];
  diagnoses?: Diagnosis[];
  prescriptions?: Prescription[];
  verifications?: Verification[];
  gaps?: Gap[];
}

export type Bucket = "open" | "ignored" | "refused";

export interface FindingPack {
  kind: "regression" | "dismissed";
  f: Finding;
  d: Diagnosis | null;
  p: Prescription | null;
  v: Verification | null;
}

export interface GapPack {
  kind: "gap";
  gap: Gap;
}

export interface EmptyPack {
  kind: "regression";
  f: null;
  d: null;
  p: null;
  v: null;
}

export type Pack = FindingPack | GapPack | EmptyPack;
