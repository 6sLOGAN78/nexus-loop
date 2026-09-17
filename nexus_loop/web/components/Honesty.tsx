// Ported 1:1 from renderHonesty()/shortNotes()/metricChip() in
// nexus_loop/static/index.html (lines ~1386-1427).
import { metricChip, pickHonestyMetrics, shortNotes } from "@/lib/report";
import type { Report } from "@/lib/types";

export function Honesty({ rep }: { rep: Report }) {
  const pick = pickHonestyMetrics(rep);
  const notes = shortNotes(rep.system_notes);
  return (
    <div className="honesty" id="honesty">
      {pick.map((m, i) => {
        const chip = metricChip(m);
        if (!chip) return null;
        return (
          <span className={`badge ${chip.fidelityClass}`} title={chip.title} key={i}>
            {`${chip.name} · ${chip.fidelity}${chip.rest ? " · " + chip.rest : ""}`}
          </span>
        );
      })}
      {notes.length ? (
        <details>
          <summary>What is real, stubbed, simulated</summary>
          {notes.map((n, i) => (
            <p className="note" key={i}>
              <strong>{n.label}.</strong> {n.text}
            </p>
          ))}
        </details>
      ) : null}
    </div>
  );
}
