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
served by `nexus_loop/app.py` (Python stdlib `http.server`). No API keys. The only
external request is the optional web fonts (Newsreader, Source Sans 3); offline
they fall back to Iowan/Palatino and Segoe/Inter, and no data leaves the box.

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
| `GET /health` | `{ok, report, generate}` booleans. Does not leak a filesystem path. |
| `POST /decision` | Record a human decision. Wrong method → 405. Body > 64KiB → 413. |
| `POST /generate` | Re-run `run.py` into the same report path (gated). Then reload `/report.json`. |

`POST /generate` is **off by default**. Enable with `--allow-generate` or
`NEXUS_LOOP_ALLOW_GENERATE=1` (and a discoverable `kit/`). `run.py --serve`
turns it on automatically for that kit. Default regeneration uses `--no-replay`;
pass `--with-replay` / `NEXUS_LOOP_REPLAY_URL` only when the kit replay service
is up. Disabled → 403; already running → 409. The header **Generate report**
button calls this endpoint and reloads the screen from the new report.

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
[`docs/ux-psychology.md`](ux-psychology.md). Paste-ready TECHQUEST sections
(Decision Layer, Operator Screen, screen-only transparency) are in
[`docs/operator-screen-report.md`](operator-screen-report.md). The jargon →
manager-English glossary (audience, metric, cause, A11 claim, and the other
on-screen labels) is [`docs/manager-english.md`](manager-english.md).

**Regions (live screen):**

The page is an **operator console**, not a dashboard of every session. Layout
follows the tracing products (list / story / decision). Copy is manager English;
detector codes live under **Technical names**. The prescription description and
`asking_approval_for` stay in the open story and decision — they are already
English. An operator should see the claim, the harm, and the ask without
scrolling through evidence.

| Region | Role |
|--------|------|
| Header | Quiet title, corpus, **Generate report**, coverage/fidelity chips. REAL / STUBBED / SIMULATED sit under a disclosure — Framing 12 without a wall of notes. |
| List | To decide / Not a problem / We will not invent (A11 first, titled “We will not invent a failover rate”). 3-column sticky tab grid; **To decide** is danger red, same token as `.dot.bad`. Not a problem is mint; We will not invent is grey/info. Compact rows: title, tenant · days subtitle, stat (conversation count, **not a problem**, or **we will not invent**). The list body scrolls under the tabs. ArrowUp/ArrowDown and Home/End move the selection. Default selection is the verification’s prescription, else `tool.contract_break`. Hash deep-links the selected id. |
| Story | Four steps copied from the report: what changed, why we think so, what we would change, did the test help. Each step label is uppercase tracked; `.span .name` is a Newsreader heading; observed values are tabular sans. A matching `standard[]` sentence sits under what changed. Bars plot report values in red vs green (not brown). Colour-coded KPI strip (5 columns, label / figure / caption): conversations info, would-have-resolved warn, handoffs/abandoned bad, cost warn. Evidence under a disclosure. Codes under **Technical names** in a `.tech-foot` footer pinned at the bottom of the story column. Gap ledes are short (A11: “Failover does not exist here. There is no rate to show.”); full `why` under **Full reason**. |
| Your decision | The ask, a one-line risk, then full risk/no-ship under a disclosure, then Accept / Reject / Defer and a required reason. On **Not a problem** or **We will not invent**, the gate is an idle line only: “Nothing to approve. This is not a problem.” or “Nothing to approve. We will not invent a failover rate.” (A11 / `NOT_MEASURABLE`; other gaps name their claim or “this number”) After save, the page POSTs `/decision` and re-fetches `/report.json`. |

**Styles:** CSS follows the ui-ux-pro-max **design-system skill** (primitive →
semantic → component tokens; Button / Card / Badge / Input / Alert specs and
states). Hex exists only in the primitive layer. Numbers still come **only**
from the report — tokens do not invent charts or metrics. The page is a light
operator desk: sunken `#F7F8F9` canvas, raised 12px columns, 8px cards, 6px
buttons and fields, 4px lozenges. Accept is success green `#1F845A` (go).
Reject is danger `#C9372C` (stop). Defer is subtle grey (wait). Brand blue is
navigation, selected rows, and links — **not** Accept. Finding tabs sit on a
3-column grid; To decide is danger red matching `.dot.bad`. KPI cards are
colour-coded on a 5-column strip (label / figure / caption). Span titles
(`.span .name`) are Newsreader `h2`s: sentence case, weight 500. KPI labels
are uppercase tracked; observed values are tabular Source Sans. Offline
fallback: Iowan / Palatino + Segoe / Inter.

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

- One finding at a time; the list is To decide / Not a problem / We will not invent (A11 first). To decide is danger red matching `.dot.bad`. Tabs are a 3-column sticky grid; the list body scrolls; arrow keys move the selection.
- The loop is four English steps: what changed, why we think so, what we would change, did the test help. A matching `standard[]` sentence sits under what changed. Span titles are Newsreader headings, not passive body copy.
- Hybrid disclosure: `cause_class`, `change_type`, metric id, `replay_run_id`, ask ids, gap verdicts sit under Technical names. The prescription description and `asking_approval_for` stay in the open story and decision.
- A11 is a first-class list row. The claim is “We will not invent a failover rate.” The required event stays on the page.
- `coverage` / `fidelity` chips in English (coverage named as coverage; judged
  chips show calibration, never a bare 100%). REAL / STUBBED / SIMULATED / 100×
  sit under one disclosure.
- Sunken canvas, raised rounded cards, light elevation. Accept is success green (go);
  Reject is danger (stop, a valid outcome); Defer is subtle grey (wait). Brand
  blue is not a verdict colour. A recorded accept is a success lozenge.
  Comparison bars are green vs red, not brown plus red.
- Colour KPI cards on a 5-column strip (conversations info, would-have-resolved
  warn, handoffs/abandoned bad, cost warn). Label / figure / caption rows share
  a baseline.
- Span titles are Newsreader headings (sentence case, 500). Step labels
  are uppercase tracked. Observed values are tabular sans. Fitts: equal
  Accept / Reject / Defer targets; the required reason is the bias brake.

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

---

## 10. Signed copy modules and seam

After a recorded verdict on a **Needs attention** finding, the gate mounts a
slot and the Signed copy UI. Modules live under
`nexus_loop/static/signed-copy/` and load before the desk inline script:

| File | Global | Role |
|---|---|---|
| `contract.js` | `SignedCopy.contract` | Frozen `COPY`, helpers, `normalizeVerdict` |
| `template.js` | `SignedCopy.template` | `buildSignedCopy(input)` |
| `summary.js` | `SignedCopy.summary` | `toSummaryInput` / `buildDecisionsSummary` |
| `adapter.js` | `SignedCopy.adapter` | `toSignedCopyInput(desk, finding)` |
| `ui.js` | `SignedCopy.ui` | `render(slotEl, finding)` |
| `signed-copy.css` | — | Secondary control styles (existing tokens) |

### `window.NexusDesk`

Frozen read-only seam at the end of the desk script. Every method returns
display strings the screen already shows (or `null`). See
`docs/prd-signed-copy.md` Appendix A for the inventory. Decisions come only
from the loaded report (`decisionFor`); `recordedAtText` is always `null`
because the desk does not display `approval.at`.

### DOM contract

Inside `[data-testid="signed-copy-slot"]` (open + prescription path only,
directly under the recorded-verdict alert):

```html
<section data-testid="signed-copy" aria-label="Signed copy">
  <button type="button" data-testid="signed-copy-button">Copy signed copy</button>
  <p data-testid="signed-copy-status" role="status" aria-live="polite"></p>
  <details data-testid="signed-copy-preview">
    <summary>See the note</summary>
    <textarea data-testid="signed-copy-text" readonly rows="14"></textarea>
  </details>
</section>
```

When every open finding is decided, a second section
`[data-testid="decisions-summary"]` follows with the same pattern and the
`COPY.ui.summary*` labels. Static assets are served at `/signed-copy/*`.
