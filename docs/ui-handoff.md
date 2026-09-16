# UI / product handoff

This is the handoff for the screen and the demo. The backend/agent pipeline is
done; the report is generated, schema-valid, and stable. The job from here is the
**operator experience**: one screen an operator can read and act from, and the
demo that shows it.

You do not need to understand the detectors to build the screen. You need the
report contract below, which never changes shape.

---

## 1. Run it

```bash
# a report already exists, or generate one:
python3 run.py --kit kit --team demo --out out/loop-report.json --no-replay

# serve the screen (renders out/loop-report.json)
python3 -m nexus_loop.app --report out/loop-report.json --port 8765
# open http://127.0.0.1:8765
```

For a report with replay evidence, start the replay service first:

```bash
python3 tools/nexus-loop-kit/replay/serve.py --kit kit --port 8719 &
python3 run.py --kit kit --team demo --out out/loop-report.json
```

The screen is `nexus_loop/static/index.html` (plain HTML/CSS/JS, no build step)
served by `nexus_loop/app.py` (Python stdlib `http.server`). No API keys, no
external network.

For a zero-setup look without running anything, open `examples/demo.html` — a
standalone lo-fi **wireframe** populated with `examples/sample-report.json` (the
final solution's practice-kit run). It is one static file (no server, no fetch),
annotated with the numbered design rationale. Use it to align on layout and the
"why"; the scored operator screen is still `nexus_loop/static/index.html`.

---

## 2. The report is the source of truth

**Rule: the screen renders only from `loop-report.json`. Never retype a number
in the UI, never recompute a metric in JavaScript.** The report is what gets
scored; if the screen and the report disagree, the screen is wrong.

Schema: `tools/nexus-loop-kit/schema/loop-report.schema.json`.
A sample is written by any `run.py`; the practice corpus produces a rich one.

### Top-level sections

| Section | Meaning |
|---|---|
| `metrics` | Every measured/derived/judged number, with fidelity + coverage + plan |
| `findings` | What moved — including `is_regression: false` lookalikes you dismissed |
| `diagnoses` | Why, with the blamed config change |
| `gaps` | What cannot be measured, with the required event |
| `standard` | Mined "what good looks like" |
| `prescriptions` | The proposed fix as a decision |
| `verifications` | Replay before/after |
| `self_assessment` | The loop's own hit rate |
| `system_notes` | What is real/stubbed, in the report itself |

---

## 3. Server API (already implemented)

| Method + path | Purpose |
|---|---|
| `GET /` | The screen (`static/index.html`) |
| `GET /report.json` | The current report, verbatim |
| `GET /health` | `{ok, report}` booleans. Does not leak a filesystem path. |
| `POST /decision` | Record a human decision. Wrong method → 405. Body > 64KiB → 413. |

`POST /decision` body:

```json
{ "prescription_id": "p01_tool_contract_northwind",
  "verdict": "accepted",            // accepted | rejected | deferred
  "decided_by": "operator",
  "reason": "evidence is strong" }  // required; empty -> 400
```

The server reads the report, updates only that prescription's
`prescriptions[].approval = {verdict, decided_by, reason, at}`, validates the
report against the schema, writes it via a temp file + atomic replace, and
appends `out/decisions.log`. If the change would make the report invalid it is
rejected with a 400. **A rejection or deferral is a first-class, correct outcome.**

If you change the API, keep this contract: a decision must persist into the
report, and the report must stay schema-valid.

The operator screen is **one page, not a dashboard**. It exists so a reviewer can
answer the eight questions from the report without recomputing anything in the
browser. The psychology behind the tracing-console layout — working memory,
recognition, trust calibration, why Reject is easy — is in
[`docs/ux-psychology.md`](ux-psychology.md).

**Regions (live screen):**

The page is an **operator console**, not a dashboard of every session. Layout
follows the tracing products (list / story / decision). Copy is manager English;
detector codes live under **Technical names**. The prescription description and
`asking_approval_for` stay in the open story and decision — they are already
English. An operator should see the claim, the harm, and the ask without
scrolling through evidence.

| Region | Role |
|--------|------|
| Header | Quiet title, corpus, coverage/fidelity chips. REAL / STUBBED / SIMULATED sit under a disclosure — Framing 12 without a wall of notes. |
| List | To decide / Not a problem / We would not guess (A11 first, titled “We will not invent a failover rate”). Each row: headline, tenant, days, conversations. Default selection is the verification’s prescription, else `tool.contract_break`. Hash deep-links the selected id. |
| Story | Four steps copied from the report: what changed, why we think so, what we would change, did the test help. A matching `standard[]` sentence sits under what changed. Bars plot report values. Evidence under a disclosure. Codes under Technical names. |
| Your decision | The ask, a one-line risk, then full risk/no-ship under a disclosure, then Accept / Reject / Defer and a required reason. After save, the page re-fetches `/report.json`. |

**Styles:** CSS follows the ui-ux-pro-max **design-system skill** (primitive →
semantic → component tokens; Button / Card / Badge / Input / Alert specs and
states). Hex exists only in the primitive layer. Numbers still come **only**
from the report — tokens do not invent charts or metrics. Cool paper + ink, with
copper as the decision lamp.

---

## 4. Field map — where every element comes from

| Screen element | Report field |
|---|---|
| Headline / severity | `findings[].id`, `findings[].severity`, `findings[].metric`, linked `diagnoses[].cause_class` |
| Cohort / window | `findings[].cohort`, `findings[].window` |
| Impact: conversations, share, days, cost | `findings[].impact.conversations_affected`, `.share_of_traffic`, `.days_running`, `.cost_usd` |
| Impact: downstream harm | `findings[].impact.downstream` (would-have-resolved, unplanned handoffs, abandoned) |
| Baseline / why it is fair | `findings[].expected` + `findings[].impact.derivation` |
| Evidence | `findings[].evidence[]` and `diagnoses[].evidence[]` |
| Root cause / config change | `diagnoses[].cause_class`, `diagnoses[].attributed_change` |
| Who must act | `findings[].audience[]` |
| Consequence of inaction | `findings[].if_nothing_changes` |
| Proposed change | `prescriptions[].change_type`, `.target`, `.description`, `.predicted_delta` |
| Approve-what / risk / no-ship | `prescriptions[].decision.asking_approval_for`, `.risk_if_diagnosis_wrong`, `.would_not_ship_if` |
| Recorded verdict | `prescriptions[].approval` |
| Replay before/after | `verifications[].metric`, `.before`, `.after`, `.verdict`, `.golden_set_pass`, `.prediction_error` |
| Dismissed lookalikes | `findings[]` where `is_regression: false` (with `not_a_regression_because` and its diagnosis) |
| Refusals | `gaps[]` (`A11`, `A09`, and the `A02` / `CARDINALITY_REFUSED` gap), each with `verdict`, `why`, `required_event` |
| Number definitions | `metrics[].{fidelity, coverage, plan, calibration}`, `metrics[].value_note` |
| Mined standard | `standard[]` |
| Self-assessment | `self_assessment` |

A finding is a **decision, not a number**: the screen should always show impact,
owner, and the consequence of inaction together, never a bare metric.

---

## 5. The questions the screen must answer

From the problem statement, an operator must be able to tell:

1. what broke?
2. who was affected?
3. how bad is it?
4. why do we think it happened?
5. who needs to fix it?
6. what are we asking permission to change?
7. what could go wrong if the diagnosis is wrong?
8. did the replay test say the fix helped?

If any of these is hard to find on the screen, fix that first.

---

## 6. Demo checklist (10 minutes + 5 Q&A)

The problem statement asks the demo to show, opening on the operator's problem,
not the architecture:

1. the finding and its impact;
2. the lookalike you correctly ignored;
3. the diagnosis;
4. the configuration change behind it;
5. the proposed fix;
6. proof the fix works (replay before/after);
7. the approval gate (working approve/reject, decision written back);
8. the one question the system refused to answer;
9. why it refused.

The refusal (A11) is called out as the most memorable part — make sure it is
visible and legible.

The human score is **decision quality 18, the screen 15, framing 12**. Judges
ask: could an operator act on this? Is every impact figure traceable? Does the
demo show the refusal, state coverage out loud, and admit what is faked?

---

## 7. Presentation choices (already implemented)

These were presentation, not detector work. The loop still produces the data;
the screen only maps it.

- One finding at a time; the list is To decide / Not a problem / We would not guess (A11 first).
- The loop is four English steps: what changed, why we think so, what we would change, did the test help. A matching `standard[]` sentence sits under what changed.
- Hybrid disclosure: `cause_class`, `change_type`, metric id, `replay_run_id`, ask ids, gap verdicts sit under Technical names. The prescription description and `asking_approval_for` stay in the open story and decision.
- A11 is a first-class list row. The claim is “We will not invent a failover rate.” The required event stays on the page.
- `coverage` / `fidelity` chips in English (coverage named as coverage; judged
  chips show calibration, never a bare 100%). REAL / STUBBED / SIMULATED / 100×
  sit under one disclosure.
- Cool paper + ink, copper decision lamp. Accept is primary; Reject is
  destructive (a valid outcome); a recorded accept is success.

**Do not**: recompute metrics client-side, invent values, change the report shape
(ask the backend owner first), or let the screen and report diverge.

---

## 8. How to verify your changes

- Regenerate the report and confirm the screen still renders it:
  `python3 run.py --kit kit --team demo --out out/loop-report.json --no-replay`
  then `python3 -m nexus_loop.app --report out/loop-report.json`.
- Confirm a decision still persists: click accept, then check
  `prescriptions[].approval` in `out/loop-report.json` and `out/decisions.log`.
- The machine score should be unaffected by UI changes; run
  `python3 tools/nexus-loop-kit/score.py --report out/loop-report.json
  --ground-truth kit/ground_truth/ground_truth.json` if unsure.
- The testbed can also exercise your screen mechanically (it starts the `serve`
  command and checks the write-back); see `tools/testbed/README.md`.

---

## 9. Working against real variations

Development fixture: the practice report (`out/loop-report.json` from `run.py
--kit kit`). It contains all three faults, all three dismissals, a prescription
and, if replay is on, a verification.

To see the screen against a different layout, generate a held-out corpus and run
the solution on it (`tools/testbed/make_corpora.py`, then `run.py --kit <corpus>
--no-replay`). The screen needs no change: it reads whatever the report says,
including missing sections (e.g. an empty `verifications` when replay is off).
