# Operator screen — TECHQUEST endterm report paste (UI / product only)

This file is the operator-screen, decision-layer, and product-UX justification,
structured to the TECHQUEST endterm template. Paste the numbered sections into
the paper. It does **not** cover detection mathematics, runtime tables, or
backend `[KEY RESULT]` placeholders. Every displayed quantity named below is
copied from `loop-report.json` as rendered by the live screen
(`nexus_loop/static/index.html` served by `nexus_loop/app.py`).

Source contracts: [`docs/ui-handoff.md`](ui-handoff.md),
[`docs/ux-psychology.md`](ux-psychology.md).
The attached glossary — jargon in the report → labels on the live screen —
is [`docs/manager-english.md`](manager-english.md).

---

## Abstract addendum (merge into the Abstract)

The submitted product includes a single operator-facing screen that closes a
human-in-the-loop decision rather than an analytics dashboard. After the
quality-control loop writes `loop-report.json`, a manager who is not fluent with
detector codes can answer what broke, who was affected, why that explanation is
offered, who must act, what follows if nobody acts, and whether a proposed fix
can be trusted. The page copies every figure from the report and never
recomputes a metric in the browser. The human act is Accept, Reject, or Defer,
each with a required written reason persisted into
`prescriptions[].approval` by `POST /decision`. A reasoned rejection is a
complete product outcome; the interface does not treat approval as the preferred
click.

## Keywords (add to the existing line)

Human-in-the-Loop; Operator Screen; Decision Quality

---

## 1. Problem and Objective (operator screen only)

The detection pipeline is specified elsewhere. The product problem addressed
here is narrower: once a schema-valid `loop-report.json` exists, an operator who
did not write the detectors must still make one high-stakes call under
uncertainty. That operator is a manager, not a tracing-tool expert. The screen
is the only artefact they are expected to use on a Monday morning.

The core questions the screen is designed to answer, in spatial order, are:

1. **What broke?** The selected finding’s headline and the observed-versus-expected
   comparison copied from `findings[].observed` and `findings[].expected`.
2. **Who was affected?** Cohort, tenant, window, and
   `findings[].impact.conversations_affected` (on the practice-kit report used
   by the live screen, 2686 conversations in the default tool-contract finding).
3. **Why?** The attributed cause in manager English, with the named configuration
   change from `diagnoses[].attributed_change`. Detector codes such as
   `tool.contract_break` remain under Technical names.
4. **Who should act?** `findings[].audience[]`, rendered as named teams (Agent
   team, Platform team, Business owner), so the cost is socially addressed.
5. **What if nobody acts?** `findings[].if_nothing_changes`, shown next to the
   owner, so inaction is a visible choice rather than a default.
6. **Can the fix be trusted?** The ask
   (`prescriptions[].decision.asking_approval_for`), the risk if the diagnosis
   is wrong, the no-ship condition, and, when present, the replay
   before/after copied from `verifications[]`. The test’s “before” is labelled
   as the replay service’s simulated baseline, not the corpus number.

The objective of the operator screen is decision quality, not exploration. One
finding is selected. One causal story is shown. One written verdict is
recorded. An 80k-session dashboard would invite browsing; browsing feels like
diligence and delays the call. The screen therefore refuses to become a corpus
browser. If a new operator can answer the six questions above without the
developers in the room, the product objective is met.

---

## 11. Decision Layer

The decision layer is the human gate between a proposed configuration change
and a recorded organisational act. The loop never auto-ships a prompt. The
screen is the only client of this layer.

### 11.1 Approve / Reject / Defer workflow

For a finding that carries a prescription, the right-hand pane is labelled
**Your decision**. It presents, in order: the recorded verdict if one already
exists; the English ask (`asking_approval_for`); a one-line risk; the full
risk and no-ship text under a disclosure; a required reason field; and three
equal-height controls — Accept, Reject, and Defer.

The operator submits a JSON body to `POST /decision`:

```json
{ "prescription_id": "p01_tool_contract_northwind",
  "verdict": "accepted",
  "decided_by": "operator",
  "reason": "evidence is strong" }
```

`verdict` is one of `accepted`, `rejected`, or `deferred`. An empty or
whitespace-only `reason` is rejected by both the page and the server (client
inline error “A reason is required”, `aria-invalid` on the field, focus
returned to the box; server HTTP 400). The required sentence is the bias
brake: writing is slower than clicking, and slower here is the point
(elaboration / implementation intention). People generate better justifications
when they know the justification will be stored.

After a successful write, the page re-fetches `GET /report.json` and re-renders
on the same view. The recorded verdict appears in Your decision (success
lozenge for accept, danger for reject, warning for defer). Closing the loop on
the same screen is immediate feedback in Norman’s sense: the operator sees that
the world changed and does not have to trust that a POST occurred.

On a gap (including A11) or a dismissed lookalike, the gate is withheld.
The idle line is one of two, from the selected tab, never blended: **No
number** (`gaps[]`) is “Nothing to approve. We will not invent this
number.” **All clear** (dismissed lookalike, `is_regression: false`) is
“Nothing to approve. This is all clear.” That prevents an affordance error
in which a manager “approves” an absence because buttons were still present.

The three targets share the same width and minimum height (Fitts’s law). Colour
encodes valence; size does not. Making Accept larger or easier than Reject
would punish a valid no. A rejection with a reason is a successful product
decision.

### 11.2 Decision record

The server (`nexus_loop/app.py`) reads the current report, updates only the
matching prescription, validates the result against
`tools/nexus-loop-kit/schema/loop-report.schema.json`, writes via a temporary
file and atomic replace, and appends `out/decisions.log`. If the change would
make the report invalid, the write is refused with HTTP 400. Unknown
prescription identifiers return 404. Bodies larger than 64 KiB return 413.
Wrong methods return 405.

The persisted record is `prescriptions[].approval`:

| Field | Meaning |
|---|---|
| `verdict` | `accepted` \| `rejected` \| `deferred` |
| `decided_by` | operator identity (default `"operator"`) |
| `reason` | required written justification |
| `at` | UTC timestamp of the write |

A rejection or a deferral is a first-class, schema-valid outcome. The report
remains the scored artefact; the screen is a writer of one nested object, not
a second source of truth.

---

## 13. Implementation (screen row only)

Paste the following row into the software-stack table. Other rows (detectors,
replay client, scorer) belong to the backend write-up.

| Component | Implementation |
|---|---|
| Operator screen | One-page standard-library HTML/CSS/JS (`nexus_loop/static/index.html`) served by a Python `http.server` (`nexus_loop/app.py`). No SPA framework, no build step, no API keys. Newsreader and Source Sans 3 load when the network is available; Iowan/Palatino and Segoe/Inter are the offline fallbacks. The page fetches `GET /report.json` and writes `POST /decision`. |

---

## 16. Operator Screen

This section is the product justification for the human score (decision quality,
readability, framing). The psychology citations belong here because they
justify layout, colour, and what is hidden; they do not invent a number.

### 16.1 One actionable screen, not a dashboard

The problem statement asks for one screen a person can read and act from, not a
platform and not a session browser. The live page is therefore a single
decision desk. Hick’s law applies: more simultaneous choices slow, and worsen,
the call. An 80k-row dashboard would be an exploration trap. The console
selects one finding at a time. Default selection is the verification’s
prescription if a replay result exists, otherwise the `tool.contract_break`
finding — a sensible default in Nielsen’s sense, choosing *which story to
read*, never *the verdict*. Hash deep-links (`#f01_…`, `#gap:A11`) let a
reviewer point at a row without describing it.

The footer states the contract in one sentence: every figure is copied from the
report; the decision is written into the report.

### 16.2 Three panes: list, story, decision

Sweller’s cognitive-load account treats germane load as the diagnosis and
extraneous load as everything competing with it. Miller’s bound (about seven
chunks) is a ceiling, not a target. The page is therefore three regions with
three jobs, and nothing else.

| Pane | Region in the live screen | Job |
|---|---|---|
| List | left column, raised card | Orient. Which problem is in front of me? |
| Story | centre column | Understand the causal loop. |
| Decision | right column, “Your decision” | Commit with a written reason. |

The list is segmented as **To decide**, **All clear**, and **No number**,
on a 3-column tab grid. Those labels are manager English for
regressions, explicit dismissals (`findings[]` with `is_regression: false`),
and `gaps[]`. Only **To decide** is a work queue. **To decide** is danger red `#C9372C`, the same token as
`.dot.bad` on regression rows, so the tab that needs a call matches the
pointers in that list. The kit plants three lookalikes; **All clear**
exists so the operator (and a judge) can see the near-miss and the dismissal
in the same genre as the real findings. That counters confirmation bias and
availability. **No number** places A11 first. The claim on the row is
“We will not invent a failover rate.” Rows are one line so a long queue
stays scannable; the list body scrolls under sticky tabs. The story lede
is one or two sentences (A11: “Failover does not exist here. There is no
rate to show.”); the full report `why` sits under Full reason. The required event stays on the page.
Absence is visible. A footer paragraph about A11 would be honest and
forgettable; a first-class row is honest and sticky.

The story is four named steps copied from the report, not a log dump:

1. **What changed** — observed versus expected, with a matching `standard[]`
   sentence when one exists.
2. **Why we think so** — cause in English plus the attributed configuration
   change.
3. **What we would change** — prescription target as a heading, description
   in the open story, with predicted from → to bars (red vs green, not brown)
   when present.
4. **Did the test help** — replay before → after, or an explicit “No test this
   run.”

Evidence, baseline derivation, honesty notes, and full risk/no-ship sit under
disclosures. That is progressive disclosure (Nielsen): experts can open them;
strangers are not forced to parse a wall of logs before they know what broke.
The eight operator questions from the problem statement are not numbered on the
page. Numbered questionnaires trigger “fill this in” behaviour. The operator
should notice they can already answer them.

The spatial schema (list / story / decision) is borrowed from tracing products
(Phoenix traces, Langfuse span trees, Helicone session paths, human
annotation). Recognition over recall applies to people who already live in
those tools. This screen’s reader often does not. The layout is kept; the
jargon is not. If a label needs a glossary, it is the wrong label. Detector
codes (`tool.contract_break`, `tool.validate`, `resolution_rate`,
`replay_run_id`, A11, `NOT_MEASURABLE`) sit under **Technical names**. The
prescription description and the ask stay in the open story and decision —
they are already English.

Waterfall bars plot report values (observed vs expected, predicted from → to,
replay before → after). They are Cleveland–McGill position encodings, not
decoration. Dual coding (Paivio) keeps the number visible next to the bar so
the visual comparison cannot drift from the report. The screen does not invent
span durations. A fake timeline would be the most tempting lie in this genre
and would violate the report contract.

### 16.3 Manager English and A11 as a first-class refusal

Copy is written for a manager who is not fluent with tech. The attached
glossary is [`docs/manager-english.md`](manager-english.md). Audience
identifiers are mapped to “Agent team”, “Platform team”, “Business owner.”
Metrics become “Share we finished”, “Turns to finish.” Cause classes become
“The tool said success but sent an empty answer.” A11’s list title is the
claim, not the ask code: “We will not invent a failover rate.” The story
states that a retry is not failover, because `llm_call.retry_count > 0` is a
quality retry, not a failover event. The required event (`failover` at step
grain, fields `from_target, to_target, reason, recovered`, owner
`conversation-runtime`) remains on the page so a later instrumentation
decision has an owner.

A refusal is not a change request. The decision pane says so. That is the
memorable beat the problem statement asks the demo to show.

### 16.4 Visual language: sunken canvas, raised cards

The desk is a light change-ticket, not a log and not a magazine. The canvas
is sunken `#F7F8F9`. Columns are raised white cards with a soft 12 px corner
radius and light elevation. Inner cards use 8 px. Controls (buttons, fields)
use 6 px. Lozenges use 4 px. Hex values exist only in the primitive token
layer. Sunken grey, not cream and not night-shift black, reads as a ticket a
manager can sign. Rounded corners and raised shadows mark containers versus
actions: the finding is a card; the verdict is a button.

Finding tabs sit on a 3-column grid. Impact KPIs sit on a 5-column strip with
a shared label / figure / caption stack so the numbers line up and recorded
cost is not an orphan.

Brand blue `#0C66E4` is reserved for navigation, selected list rows (inset
brand bar), links, and the small mark that a human is on the page. It is not
used for Accept. Using the brand colour as a proceed cue would collapse
navigation and verdict into one pre-attentive channel.

Type is a wealth-desk pairing: **Newsreader** serif for claims and span
headings, **Source Sans 3** for chrome, KPI figures, and buttons. Offline,
Newsreader falls back to Iowan / Palatino and Source Sans 3 to Segoe / Inter.

### 16.5 The gate as a traffic light

Accept is success green `#1F845A` (go). Reject is danger `#C9372C` (stop).
Defer is achromatic grey (wait; no valence). Green and red are complementary
hues, so they pop apart pre-attentively (Treisman: colour is a feature that
does not need the label). An earlier warm-brown plus warm-red pairing did not:
both read as “alert,” so the hand could not tell proceed from refuse without
reading. Green is isolated in the gate. Comparison bars in the story are the
same traffic light (red now / green before), not brown-plus-red. Coverage
chips in the header are small lozenges, not competing bars, so the proceed
control does not drown in “healthy.”

Prospect theory still applies — people overweight the frame — so all three
targets stay the same size (Fitts). The bias brake is the required reason, not
a camouflaged Accept. Colour is the primer; the sentence is the thought.

### 16.6 Span titles as headings

Each of the four story steps uses a sentence-case Newsreader heading
(`h2.name`), weight 500, not a sunken chip and not passive body copy. The kind
label (“What changed”, “Why we think so”, “What we would change”, “Did the test
help”) is a small uppercase tracked kicker; the serif heading is the claim the
operator should remember — “Share we finished”, not a muted caption and not
the only title on the span. Treating the span title as a heading rather than as
muted caption text is how the causal loop remains scannable when the evidence is
long.

### 16.7 Report-only numbers; colour-coded KPIs; no invented charts

The screen renders only from `loop-report.json`. It never retypes a number and
never recomputes a metric in JavaScript. On the practice-kit report the default
finding shows 2686 conversations affected and 213 that would have resolved at
baseline; those figures are `findings[].impact.conversations_affected` and
`findings[].impact.downstream.would_have_resolved_at_baseline`. Coverage and
fidelity appear as English chips in the header (A01 measured, A04 measured, a
judged chip with calibration when present — never a bare 100%). They are
passports on the numbers, not badges of quality. They answer “can I believe
this denominator?” before the operator reads the claim.

Harm KPIs are colour-coded cards on that 5-column strip: conversations
(info blue), would-have-resolved (warn), unplanned handoffs and abandoned
(danger / `.kpi.bad`), recorded cost (warn). Each card is label, figure,
caption — the same stack so figures share a baseline.

Loss aversion is used only as layout order. Harm KPIs sit in the middle pane,
before the buttons. Putting incurred losses above the signature makes inaction
feel like a choice. The sentence of `if_nothing_changes` sits next to the named
audience so the cost is concrete (this cohort, this window) and owned.

### 16.8 How a new operator acts without the developers

A stranger can run `python3 -m nexus_loop.app --report out/loop-report.json`
and open `http://127.0.0.1:8765`. No API key and no detector knowledge are
required. The list tells them which items need a call, which were correctly
ignored, and which questions the system refused. Selecting a row answers the
six questions of Section 1 in the centre and right panes. They type a reason
and press Accept, Reject, or Defer. The report on disk updates; the same page
shows the recorded verdict. If they are reviewing A11, they see the refusal and
the required event, and they are not offered a spurious approve. That is the
Monday-morning test: could an operator who was not on the team know what to do?

### 16.9 Mapping to the human score

| Rubric | What the screen is aiming at |
|---|---|
| Decision quality (18) | Harm, owner, inaction, risk, and a written reason on one view. Traceable numbers. Named baseline. |
| The screen (15) | A stranger can read it. List / story / decision is spatial, not a glossary. Evidence is one click away, not in the way. Approve / reject / defer all work. |
| Framing (12) | Opens on the problem (default = verified finding). Shows the lookalike. Shows the refusal as a first-class row. States coverage as chips. Admits simulated replay under a disclosure. |

### Figure 5 caption (paste under the screenshot of the live desk)

**Figure 5.** Final operator-facing screen. One page in three panes: (left) the
finding list segmented as To decide, All clear, and No number,
with A11 titled “We will not invent a failover rate” and the To decide tab in
danger red matching `.dot.bad`; (centre) the causal story with sentence-case
Newsreader span headings — what changed, why we think so, what we would
change, did the test help — and colour-coded harm KPIs (conversations info,
would-have-resolved warn, handoffs/abandoned bad, cost warn) copied from
`loop-report.json`; (right) Your decision, with equal-size Accept (success
green `#1F845A`), Reject (danger `#C9372C`), and Defer (grey) controls and a
required reason. Sunken canvas `#F7F8F9`, raised rounded cards. Brand blue is
used for selection and navigation only. Every figure on the page is copied from
the report; none is computed in the browser.

---

## 18. Transparency (screen only)

The following bullets apply to the operator screen. Backend honesty (what the
detectors compute, what replay simulates) is documented in
`docs/submission-note.md` and in `system_notes` inside the report. The screen’s
job is to disclose that honesty without becoming a second calculator.

- The page **renders** fields from `GET /report.json`. It does **not** compute
  rates, deltas, coverage, cost, or replay error in JavaScript. Bar widths are
  proportional encodings of values already present in the report; the numeral
  beside each bar is the same report value.
- Coverage and fidelity chips are copied from `metrics[]` (`fidelity`,
  `coverage.value`, judged `calibration`). They are passports, not scores the
  UI invented.
- REAL / STUBBED / SIMULATED (and breaks-at-100×) are parsed from
  `system_notes` and placed under a single disclosure in the header, so framing
  is spoken out loud without burning the first ten seconds on a wall of notes.
- Replay `before` is labelled on the span as the endpoint’s simulated baseline,
  not the corpus number. Presenting those two numbers as confirmation of each
  other would teach a false correlation.
- The footer restates the contract: every figure is copied from the report;
  the decision is written into the report.
- If the screen and the report ever disagreed, the screen would be wrong. Dual
  sources produce authority confusion. One source, copied, is how the page
  stays honest when a judge asks where a displayed 2686 came from.
- The screen never auto-Accepts, never hides Reject, and never pre-fills the
  reason. Defaults may choose the story; they must not choose the verdict.
