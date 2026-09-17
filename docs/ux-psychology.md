# Why the operator screen is a tracing console

This is the psychology behind [`nexus_loop/static/index.html`](../nexus_loop/static/index.html). It is not a style note. It is the argument that the layout, colour, type, and what we hide are how an operator makes a *better Monday-morning call*, not how we make a prettier page.

The scored job of the screen is decision quality (18), readability (15), and framing (12). Those are human scores. They reward the same things cognitive psychology has names for: limited working memory, recognition over recall, calibrated trust, and a decision that has been thought, not clicked.

The contract in [`docs/ui-handoff.md`](ui-handoff.md) is unchanged: every figure is copied from `loop-report.json`. Psychology here is about *what the eye meets first* and *what the hand is asked to do*. It never invents a number, never draws a chart the report did not already contain, and records the verdict only through `POST /decision`. The on-screen glossary is [`docs/manager-english.md`](manager-english.md).

---

## 1. The person in the chair

The user is not exploring a corpus. They are a **manager who is not fluent with
tech**, opening the page on a Monday morning, and they have to answer eight
questions:

1. what broke?
2. who was affected?
3. how bad is it?
4. why do we think it happened?
5. who needs to fix it?
6. what are we asking permission to change?
7. what could go wrong if the diagnosis is wrong?
8. did the replay test say the fix helped?

That is a **single high-stakes decision under uncertainty**, with a named owner,
a named risk, and a written reason. It is closer to signing a change ticket than
to using Grafana.

The layout still borrows tracing products (list / story / decision) so the page
has a job per region. The **words** do not. Detector names (`tool.contract_break`,
`tool.validate`, `resolution_rate`, `replay_run_id`, A11, `NOT_MEASURABLE`) sit
under Technical names. The prescription description and the ask stay in the open
story and decision — they are already English. A11 stays first-class and live:
the claim is “We will not invent a failover rate,” and the required event stays
on the page.

Two failure modes follow from that job:

- **Exploration trap.** An 80k-session dashboard invites browsing. Browsing feels like diligence and delays the call. Hick’s law: more choices, slower (and worse) decisions.
- **Narrative trap.** A paper “brief” reads like journalism. A tracing console
  full of `observe` / `Annotate` / `NOT_MEASURABLE` reads like a log. This
  manager has neither schema. Layout can stay three panes; the words must be
  the eight questions.

The console is built against both. One finding is selected. The loop is four
English steps. The human act is labelled **Your decision**. Codes are in
Technical names.

---

## 2. Working memory is the budget

Miller’s classic bound (about seven chunks) is a ceiling, not a target. Sweller’s cognitive-load theory is the practical rule: germane load is the diagnosis; extraneous load is everything competing with it.

So the screen is three regions with three jobs, and nothing else:

| Region | Psychological job |
|---|---|
| List | **Orient.** Which problem is in front of me? To decide / Not a problem / We will not invent. Sticky tabs; the row list scrolls underneath. |
| Story | **Understand.** What changed → why we think so → what we would change → did the test help. Codes in a pinned **Technical names** footer. |
| Your decision | **Commit.** The ask, the risk, the signature — or an idle line on Not a problem / We will not invent. |

ArrowUp, ArrowDown, Home, and End move the list selection without mouse
hunt (recognition over recall for keyboard-first reviewers). Evidence,
baseline working, honesty notes, and risk/no-ship sit under disclosures. That is **progressive disclosure** (Nielsen): experts can open them; strangers are not forced to parse a wall of logs before they know what broke. The first screen is claim, harm, owner, change, replay — the eight questions in spatial order, not a questionnaire.

We do not number the eight questions on the page. Numbered questionnaires trigger “fill this in” behaviour. The operator should *notice they can already answer them*, which is a stronger test of the layout than a labelled form.

---

## 3. Recognition, not a new language

Operators who have used Phoenix, Langfuse, or Helicone already have a schema:

- a **list of traces** (root requests / conversations)
- a **span waterfall** (what happened, in order, with status)
- **human annotation** (a score or a verdict on that trace)

Using that schema is **recognition over recall** for people who already live in
those tools. This screen’s reader is a manager who does not. So we keep the
*spatial* schema (list / story / decision) and throw away the jargon. If a
label needs a glossary, it is the wrong label.

The mapping is deliberate and bounded:

| Tracing product | What we took | What we refused |
|---|---|---|
| Phoenix Traces / Spans / Sessions | To decide / Not a problem / We will not invent | A table of every session |
| Langfuse span tree + scores | Four named steps + fidelity chips | Token/latency chrome we do not have |
| Helicone session paths | `/tenant/intent/tool` | Fake durations or invented steps |
| Annotation / human review | Accept / Reject / Defer + required reason | A like/dislike that writes nothing |

The waterfall bars plot **report values** (observed vs expected, predicted from → to, replay before → after). They are Cleveland–McGill position encodings, not decoration. Dual coding (Paivio): the number stays visible next to the bar so the visual comparison cannot drift from the report. If a bar and a number ever disagreed, the screen would be wrong.

We do not invent span durations. A fake timeline would be the most tempting lie in this genre, and it would violate the report contract.

---

## 4. Span titles are headings, not body copy

The four steps are a story, so each step has a heading. `.span .name` is an `h2` in Newsreader, sentence case (“Share we finished”, not `RESOLUTION_RATE`), weight 500 — the same speech act as “Pacific Heights residence” on a wealth desk. Step labels (`.span .kind`) stay uppercase, tracked, and muted: they name the *job* of the row; the serif names the *claim*.

Observed values (`.span .val`) are tabular-nums and bold navy, aligned to the right of the heading. A manager comparing 77.5% to 85.5% should not have to hunt a muted caption. The bars still sit under the heading; they copy the same report numbers. Nothing in the span is a chart we invented.

That type hierarchy is the same argument as the three panes: the eye should find the claim, then the number, then the evidence — not a wall of equal-weight log lines.

---

## Type

The face is a **wealth-desk pairing** of exactly two families, not a paper brief and not a log. Claims, span titles, and technical jargon (Technical names, codes, paths) set in **Newsreader** (serif, weight 500): “Silent tool failure…” and “Share we finished” should read like “Your wealth, on pace” — a status you can say out loud. Chrome, KPI figures, and buttons stay **Source Sans 3** — no separate monospace stack: that is the $18.42M / FUNDED / TARGET layer — tabular, tracked labels. Offline, Newsreader falls back to Iowan / Palatino and Source Sans 3 to Segoe UI. We do not set the whole page in Georgia: a serif *UI* is the generated-brief tell; a serif *claim* (and its jargon) on a sans desk is the product.

---

## 5. Colour is a decision primer, not a brand

The previous screen was paper and navy: a brief to sign. That is a legitimate editorial move. It also primed **reading**, and it used a warm-cream + serif cluster that currently reads as generic generated UI. Copper and brand-blue Accept were both wrong for the same reason: they did not mean *go*.

The desk uses a **sunken canvas and raised cards**: a sunken `#F7F8F9` canvas, raised white cards, 12px columns, 8px inner cards, 6px controls, 4px lozenges.

- Sunken grey (not cream, not night-shift black) is a change ticket a manager can sign on Monday morning. It is not a log, not a magazine, not acid-green-on-black. Rounded corners and raised shadows mark *containers* vs *actions* — the finding is a card; the verdict is a button.
- **The gate is a traffic light.** Accept is success green `#1F845A` (go). Reject is danger red `#C9372C` (stop). Defer is subtle grey (wait / no valence). Green and red are complementary hues, so they **pop apart pre-attentively** (Treisman: colour is a feature that does not need the label). Warm brown plus warm red did not: both read as “alert,” so the hand could not tell proceed from refuse without reading. Brand blue `#0C66E4` stays on selected rows, links, the mark, and the step labels — it is navigation and selection, **not Accept**. Comparison bars in the story use the same green/red pairing, not brown.
- **To decide is danger red**, the same token as `.dot.bad` on regression rows, so the tab that needs a call matches the pointers in that list. Finding tabs sit on a 3-column grid.
- **KPI cards are colour-coded** on a 5-column strip with shared label / figure / caption rows: conversations info, would-have-resolved warn, handoffs/abandoned bad, cost warn.
- Green is isolated in the gate. Coverage chips are small lozenges in the header, not competing bars, so the proceed control does not drown in “healthy.” The **bias brake is the required reason**, not a camouflaged Accept: elaboration slows the click (implementation intention). Prospect theory still applies — people overweight the frame — so all three targets stay the same size (Fitts). A rejection with a reason is a successful product decision; red is as easy to hit as green.

Accept is success-bold because it must mean *proceed* before the word is read. Reject is danger-bold because it must mean *stop*. Defer is subtle because it must mean *not now*.

---

## 6. Harm before the ask

Your decision is on the right. The harm KPIs are in the middle, *before* the buttons. That order is the argument.

**Loss aversion.** “2,686 conversations” and “213 would have resolved” are losses already incurred. Putting them above the signature makes inaction feel like a choice, not a default. The sentence of `if_nothing_changes` sits next to the named `audience[]` so the cost is concrete (low construal: *this cohort, this week*) and socially addressed (*who* must act). A bare metric with no owner is a number someone else will worry about.

We always show impact, owner, and consequence of inaction together. A finding is a decision, not a chart. That is also how the problem statement defines it.

---

## 7. Trust is designed as Stage 1 transparency

Relationship-design’s trust ladder starts at **transparency**, not autonomy. This product never auto-ships a prompt. The human is the loop. So the screen must show its work without turning into an essay.

- Coverage and fidelity chips in the header (A01 measured, A04 measured, judged if present) are **passports on the numbers**, not badges of quality. They answer “can I believe this denominator?” before the operator reads the claim.
- REAL / STUBBED / SIMULATED is one disclosure. Framing score 12 wants honesty spoken out loud; it does not want a header wall that burns the first ten seconds.
- The replay span states, in muted type, that replay `before` is the endpoint’s simulated baseline, not our corpus number. That is **trust calibration**: if we let those two numbers look like confirmation of each other, we would be teaching a false correlation.

The rule “never recompute in JavaScript” is psychological as well as scoring. If the screen and the report diverge, the operator’s memory becomes a second source of truth. Dual sources produce **authority confusion**. One source, copied, is how the page stays honest when a judge asks “where did that 2,686 come from?”

The only mutating call the page makes is **`POST /decision`**: `{prescription_id, verdict, decided_by, reason}`. Empty reason is a 400. The screen re-fetches `GET /report.json` after save. There is no second write path, no client-side metric, no invented plot.

---

## 8. The reason box is the thinking

A verdict without a reason is a 400. That is a schema rule. It is also **elaboration**: writing a sentence is slower than clicking, and slower here is the point. People generate better justifications when they know the justification will be stored (`prescriptions[].approval.reason`, `decisions.log`). That is implementation-intention adjacent: “I am accepting *because*…” rather than “I am accepting.”

Empty-reason feedback is inline, `aria-invalid`, and the field is focused. Errors name the fix (“A reason is required”), not a mood. No apology, no toast that vanishes.

After save, the page re-fetches `/report.json` and the recorded verdict appears in Your decision (success lozenge for accept, danger for reject, warning for defer). Closing the loop on the same screen is **immediate feedback** (Norman): the operator sees that the world changed. They do not have to trust that a POST happened.

---

## 9. Lookalikes and refusals are there to fight bias

The kit plants three false alarms. Flagging one as a regression costs more than missing a real problem. **Not a problem** exists so the manager (and the judge) can see the near-miss *and* the dismissal in the same genre as the real findings. That counters **confirmation bias** (“show me only the bad news”) and **availability** (“I only remember the tool break”). Explicit dismissal is the product behaviour the scorer rewards; the UI has to make it findable in one click, not a footnote.

**We will not invent**, with A11 first, is the memorable beat the problem statement asks for. We render a refusal as a first-class row: “We will not invent a failover rate,” required event on the page, and why retry is not failover. Absence has to be *visible*. A footer paragraph about A11 would be honest and forgettable. An empty observation with a spec is honest and sticky (peak-end + isolation).

A refusal is not a change request. Your decision says so. That prevents the manager from “approving” a gap because the buttons were still there — an affordance error.

---

## 10. Default selection is a recommended path, not a dark pattern

On load we select the verification’s prescription, else `tool.contract_break`. That is **sensible defaults** (Nielsen), aligned with the loop: the finding that has replay evidence is the one a stranger can decide. Hash deep-links (`#f01_…`, `#gap:A11`) exist so a reviewer can point at a row without describing it. Shared attention is a coordination problem; the URL is the cheapest fix.

We do not auto-Accept. We do not hide Reject. We do not pre-fill the reason. Defaults may choose *which story to read*. They must not choose *the verdict*.

---

## 11. What we refused, on purpose

| Temptation | Why it was dropped |
|---|---|
| A dashboard of sessions | Exploration trap; 80k rows are not a decision |
| Charts we compute in the browser | Second source of truth |
| Making Accept larger, bluer, or greener-and-easier than Reject | Punishes a valid no; colour encodes go/stop, size stays equal |
| Paper + serif brief, copper, or brand-blue Accept | Wrong genre; copper and blue do not mean go |
| Fake waterfall durations | Invented telemetry |
| Labelling the eight questions | Turns a brief into a form |
| Putting A11 in the footer | Honest, not memorable |
| Making Reject harder to click | Punishes a valid outcome |
| Sticky gate covering the waterfall on a phone | Fitts at the cost of the claim — the claim has to be readable first |
| Span titles as muted body copy | The step claim has to scan as a heading |

---

## 12. How this maps to the human score

| Rubric | What the psychology is aiming at |
|---|---|
| Decision quality (18) | Harm, owner, inaction, risk, and a written reason on one view. Traceable numbers. Named baseline. `POST /decision` is the only write. |
| The screen (15) | A stranger can read it. List / story / decision is spatial, not a glossary. Span titles are headings. Evidence is one click away, not in the way. Approve / reject / defer all work. |
| Framing (12) | Opens on the problem (default = verified finding). Shows the lookalike. Shows the refusal as a first-class row. States coverage as chips. Admits simulated replay under a disclosure. |

If a judge can sit down, answer the eight questions without scrolling past a wall of evidence, dismiss a lookalike, read A11, and record a reasoned verdict, the psychology did its job. If they have to hunt, or if they feel the page wanted a yes, it did not.

---

## 13. One sentence

Treat the finding as one decision, the loop as four plain headed steps, and the
human as the person who signs — because a manager will not learn “span,” and a
signature on a short causal story still beats a dashboard they will not finish.
