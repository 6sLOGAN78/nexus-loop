// Ported 1:1 from renderGate() in nexus_loop/static/index.html (lines ~1774-1849).
// The Signed copy subsystem is loaded unmodified from /signed-copy/*.js (see
// app/page.tsx) and mounted into the same `[data-testid="signed-copy-slot"]`
// element the original page used, via window.SignedCopy.ui.render(slotEl, finding)
// -- exactly like the inline script did.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { idleGateCopy } from "@/lib/copy";
import { postDecision, getReport } from "@/lib/api";
import type { Pack, Report } from "@/lib/types";
import { MoreDetails } from "./Visuals";

export function Gate({
  pack,
  signedCopyReady,
  onReportUpdated,
}: {
  pack: Pack;
  signedCopyReady: boolean;
  onReportUpdated: (rep: Report) => void;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLTextAreaElement>(null);
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState<{ text: string; tone: "" | "err" } | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);

  const findingForSlot = pack.kind !== "gap" ? pack.f : null;
  useEffect(() => {
    setReason("");
    setFlash(null);
    setInvalid(false);
    setBusy(false);
  }, [pack]);

  useEffect(() => {
    const slotEl = slotRef.current;
    if (!slotEl) return;
    if (signedCopyReady && window.SignedCopy?.ui?.render && findingForSlot) {
      window.SignedCopy.ui.render(slotEl, findingForSlot);
    }
  }, [findingForSlot, signedCopyReady]);

  if (pack.kind === "gap" || pack.kind === "dismissed" || !pack.p) {
    const tone = pack.kind === "dismissed" ? "ok" : pack.kind === "gap" ? "miss" : "";
    return (
      <aside className="gate-col" id="gate">
        <div className={`alert ${tone}`}>
          <p className="idle">{idleGateCopy(pack)}</p>
        </div>
      </aside>
    );
  }

  const p = pack.p;
  const dec = p.decision || {};
  const a = p.approval || {};
  const recCls = a.verdict === "accepted" ? "ok" : a.verdict === "rejected" ? "bad" : a.verdict === "deferred" ? "warn" : "";
  const risk = (dec.risk_if_diagnosis_wrong || "").trim();
  const riskLine = risk.length > 160 ? risk.slice(0, 157) + "…" : risk;

  async function onSubmit(ev: FormEvent<HTMLFormElement>, verdict: string) {
    ev.preventDefault();
    if (!reason.trim()) {
      setInvalid(true);
      setFlash({ text: "A reason is required.", tone: "err" });
      whyRef.current?.focus();
      return;
    }
    setInvalid(false);
    setBusy(true);
    setFlash({ text: "Saving…", tone: "" });
    try {
      await postDecision({
        prescription_id: p.id,
        verdict,
        decided_by: "operator",
        reason,
      });
      const next = await getReport();
      onReportUpdated(next);
    } catch (e) {
      setFlash({ text: String((e as Error).message || e), tone: "err" });
      setInvalid(true);
      setBusy(false);
    }
  }

  return (
    <aside className="gate-col" id="gate">
      <p className="eyebrow">Your decision</p>
      {a.verdict ? (
        <div className={`alert ${recCls}`}>
          <p>
            <strong>Recorded {a.verdict}</strong>
          </p>
          <p>{a.reason || ""}</p>
        </div>
      ) : null}
      <div data-testid="signed-copy-slot" ref={slotRef} />
      <p className="ask">{dec.asking_approval_for || ""}</p>
      {riskLine ? (
        <p className="risk">
          <strong>If we are wrong.</strong> {riskLine}
        </p>
      ) : null}
      <MoreDetails summary="Full risk and when we would not ship">
        <p>
          <strong>Risk.</strong> {dec.risk_if_diagnosis_wrong || "—"}
        </p>
        <p>
          <strong>Would not ship if.</strong> {dec.would_not_ship_if || "—"}
        </p>
      </MoreDetails>
      <form
        id="decform"
        onSubmit={(ev) => {
          const submitter = (ev.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
          onSubmit(ev, submitter?.value || "accepted");
        }}
      >
        <input type="hidden" name="decided_by" value="operator" />
        <label className="field" htmlFor="why">
          Reason
        </label>
        <textarea
          className="input"
          id="why"
          name="reason"
          required
          maxLength={4000}
          autoComplete="off"
          placeholder={"Why you are making this call…"}
          ref={whyRef}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-invalid={invalid}
        />
        <div className="btn-row">
          <button className="btn btn-ok" type="submit" name="verdict" value="accepted" disabled={busy}>
            Accept
          </button>
          <button className="btn btn-bad" type="submit" name="verdict" value="rejected" disabled={busy}>
            Reject
          </button>
          <button className="btn btn-ghost" type="submit" name="verdict" value="deferred" disabled={busy}>
            Defer
          </button>
        </div>
        <div className={`flash${flash?.tone ? " " + flash.tone : ""}`} id="flash" role="status" aria-live="polite">
          {flash?.text || ""}
        </div>
      </form>
    </aside>
  );
}
