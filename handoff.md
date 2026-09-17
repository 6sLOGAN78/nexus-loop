# Operator desk handoff — psychology and the person in the chair

This file is for another chatbot (or human) continuing work on the Nexus Loop
operator screen. It is **not** a style guide and **not** an API reference.
It is the mental model of **who the user is**, **what their Monday-morning job
is**, and **why the UI is shaped the way it is**.

Live screen: [`nexus_loop/static/index.html`](nexus_loop/static/index.html)  
Report contract: every number is copied from `loop-report.json` — never recomputed in JS.  
Only write: `POST /decision` with a required reason.  
Companion docs (contracts / glossary / scored paste):  
[`docs/ui-handoff.md`](docs/ui-handoff.md),  
[`docs/ux-psychology.md`](docs/ux-psychology.md),  
[`docs/manager-english.md`](docs/manager-english.md),  
[`docs/operator-screen-report.md`](docs/operator-screen-report.md).

If this handoff and the live HTML disagree, **the HTML is right** — update this
file. If this handoff and a scoring doc disagree on *why* a control exists,
prefer this file for user psychology and the scoring doc for rubric wording.

---

## 0. One-sentence product truth

The screen is a **change ticket a non-technical manager can sign**, not a
dashboard, not a log, and not a journalism brief. One finding. One causal
story. One written verdict. The human is the loop; the page must never choose
the verdict for them.

---

## 1. Who sits here

### 1.1 The user is a manager, not an SRE

They are **not fluent with tech**. They do not live in Phoenix, Langfuse, or
Helicone. Detector codes (`tool.contract_break`, `resolution_rate`,
`NOT_MEASURABLE`, A11) are noise until translated. They will not learn a
glossary to finish the page. If a label needs a glossary, it is the wrong
label for the open surface (codes belong under **Technical names**).

They open the page on a **Monday morning**. They have limited time, limited
patience for exploration, and a named organisational act to make: accept,
reject, or defer a proposed change — with a reason that will be stored.

### 1.2 Their real job: eight questions under uncertainty

They must leave able to answer:

1. What broke?
2. Who was affected?
3. How bad is it?
4. Why do we think it happened?
5. Who needs to fix it?
6. What are we asking permission to change?
7. What could go wrong if the diagnosis is wrong?
8. Did the replay test say the fix helped?

That is a **single high-stakes decision under uncertainty**, with a named
owner, a named risk, and a written reason. It is closer to signing a change
ticket than to using Grafana.

**Do not number these eight questions on the page.** Numbered questionnaires
trigger “fill this in” behaviour. The psychology test of the layout is: the
manager notices they can *already* answer them from the spatial story.

### 1.3 What they are not doing

| They are not… | Because… |
|---|---|
| Exploring 80k sessions | Exploration feels like diligence and **delays the call** (Hick’s law: more choices → slower / worse decisions). |
| Learning tracing jargon | Recognition schemas from Phoenix/Langfuse help *experts*; this reader has neither schema. Keep the **spatial** list/story/decision layout; throw away the jargon. |
| Reading a paper “brief” | Paper + cream + all-serif primes *reading*, not *signing*. Wrong genre for a go/stop gate. |
| Watching a night-ops log | Acid-green-on-black / fake span timelines invent telemetry and burn trust. |

### 1.4 Emotional and cognitive state to design for

- **Anxiety about being wrong.** Accepting a bad fix ships risk; rejecting a
  real fix leaves harm running. Equal-size Accept / Reject / Defer (Fitts)
  and a required reason (elaboration) are the brake, not camouflage.
- **Loss aversion.** Harm KPIs (“conversations affected”, “would have
  resolved”) sit *before* the buttons so inaction feels like a choice, not a
  default. Owner + `if_nothing_changes` make the cost concrete and socially
  addressed (*this cohort, this week, this team*).
- **Confirmation bias.** The kit plants lookalikes. If the UI only shows bad
  news, the manager (and the judge) never see that the loop correctly
  dismissed noise. **Dismissed signals** must be first-class.
- **Availability bias.** The memorable tool-break should not erase A11. The
  refusal must be a visible row, not a footer footnote.
- **Authority confusion.** One source of truth (`loop-report.json`). If the
  screen recomputes a number, the manager’s memory becomes a second source.
  Dual sources destroy “where did 2,686 come from?”

---

## 2. Cognitive budget: three jobs, then stop

Miller’s bound (~7 chunks) is a ceiling, not a target. Sweller: germane load
is the diagnosis; extraneous load is everything competing with it.

The desk is therefore **orientation → understanding → commit**, and nothing
else on the first pass.

| Layer | Region | Psychological job | Manager experience |
|---|---|---|---|
| Brand + honesty | `header.top` | Secondary chrome: “am I in the right product?” + “can I trust the denominators?” | Brand mark; coverage/fidelity chips; REAL/STUBBED/SIMULATED under a disclosure — not a wall. |
| Mode | `#modebar` / `.mode-bar` | **Primary orientation:** which *kind* of finding am I in? | Full-width strip **between** brand header and the three panes. |
| Orient | Left list | Which row is in front of me? | Dense rows; scroll the list, not the mode control. |
| Understand | Centre story | What changed → why → what we’d change → did the test help | Four headed steps; evidence under disclosure; codes in pinned Technical names. |
| Commit | Right gate | Sign, refuse, or wait — or be told there is nothing to approve | Accept / Reject / Defer + required reason **only** on work-queue findings. |

### 2.1 Why the mode bar sits above the panes (not in the list, not in the brand row)

Choosing the bucket is the **primary** orientation job for a manager who does
not already know the product. Brand mark and fidelity chips are secondary.
Mixing them in one header row collapses hierarchy.

Tabs buried only in the left list look like *list chrome*. A strip above all
three panes reads as **desk-wide mode**: list, story, and gate all follow the
same bucket. A bar only in the story column would falsely imply story-local
filters.

**Internal filters → manager labels (current UI):**

| `listFilter` | Report bucket | Top-bar label | Colour psychology | Is it a work queue? |
|---|---|---|---|---|
| `open` | regressions (`is_regression: true`) | **Needs attention** | Danger red — same token as `.dot.bad` / To-decide energy | **Yes** — Accept / Reject / Defer |
| `ignored` | lookalikes (`is_regression: false`) | **Dismissed signals** | Muted grey | **No** — idle: “This is not a problem.” |
| `refused` | `gaps[]` | **No measurement** | Subtle / info grey | **No** — idle: will-not-invent copy; A11 first |

Counts stay in the control (`Needs attention (3)`). Kickers/chips in the
story align lightly: needs attention / dismissed signals / no measurement.

Older docs may still say “To decide / Not a problem / We will not invent.”
Those were the previous tab labels for the **same three buckets**. Prefer the
mode-bar wording when describing the live desk; idle gate *sentences* may
still say “This is not a problem” / “We will not invent a failover rate”
because those are verdicts, not navigation labels.

### 2.2 Progressive disclosure is respect, not hiding

Evidence, baseline working, honesty notes, full risk/no-ship sit under
disclosures (Nielsen). Experts can open them. Strangers must not parse a wall
of logs before they know what broke. The first screen is claim, harm, owner,
change, replay — the eight questions in spatial order.

---

## 3. Recognition without forcing a new language

Tracing products gave us a **spatial schema** (list of traces → detail →
annotation). That schema is useful even for people who never used those
tools, because it maps cleanly onto orient / understand / commit.

What we **refused** to borrow: tables of every session, fake span durations,
token/latency chrome we do not have, like/dislike that writes nothing.

Waterfall bars are Cleveland–McGill **position** encodings of report values
(observed vs expected, predicted from → to, replay before → after), with the
number still visible (Paivio dual coding). If a bar and a number disagreed,
the screen would be wrong. Invented timelines are the most tempting lie in
this genre — do not add them.

---

## 4. Language psychology (manager English)

Open surface = English a manager can say out loud. Codes = Technical names
footer (pinned at the bottom of the story column).

Examples of the speech act we want:

| Report | Open screen |
|---|---|
| `resolution_rate` | Share we finished |
| `tool.contract_break` | The tool said success but sent an empty answer |
| A11 / `NOT_MEASURABLE` | We will not invent a failover rate |
| `agent_builder` | Agent team needs to act |

**Ledes stay short.** A11 story open: “Failover does not exist here. There is
no rate to show.” Full report `why` under **Full reason**. Long honesty in
the first paragraph recreates the narrative trap.

Type hierarchy reinforces speech acts:

- **Newsreader (serif, ~500)** = claims and span titles — status you can say
  out loud (“Silent tool failure…”, “Share we finished”).
- **Source Sans 3** = chrome, KPI figures, buttons — the ticket layer.
- Do **not** set the whole UI in Georgia/serif (generated-brief tell).
- Do **not** put serif on Accept/Reject (wrong speech act).

---

## 5. Colour is a decision primer, not brand decoration

The desk is a **sunken canvas + raised cards**: sunken `#F7F8F9`, raised white
columns. Not cream magazine, not night-ops black.

| Signal | Meaning for the hand |
|---|---|
| Accept `#1F845A` (success green) | **Go** — pre-attentive proceed |
| Reject `#C9372C` (danger red) | **Stop** — valid outcome, equally easy |
| Defer (subtle grey) | **Wait** — no valence |
| Brand blue `#0C66E4` | Navigation / selection / links — **never** Accept |
| Needs attention selected | Danger red inset — matches `.dot.bad` on regressions |
| Dismissed / No measurement | Grey / muted — not a work queue |

Green and red are complementary so they **pop apart** without reading
(Treisman feature search). Copper + warm red both read as “alert” — rejected
on purpose. Brand-blue Accept was rejected: blue means “selected,” not “ship.”

**Prospect / bias:** people overweight the frame. Keep the three verdict
targets the same size. The **bias brake is the required reason**, not a
smaller Reject. A rejection with a reason is a successful product decision.

KPI strip is colour-coded (info / warn / bad) so harm is glanceable before
the signature. Green is isolated in the gate so “healthy” chrome does not
drown the proceed control.

---

## 6. Trust is Stage 1 transparency

Relationship-design’s trust ladder starts at **transparency**, not autonomy.
This product never auto-ships a prompt.

- Coverage / fidelity chips answer “can I believe this denominator?” before
  the claim is trusted.
- REAL / STUBBED / SIMULATED live under one disclosure (Framing score wants
  honesty spoken out loud, not a header wall that burns ten seconds).
- Replay “before” is labelled as the endpoint’s **simulated** baseline, not
  the corpus number — otherwise the manager learns a false correlation.
- After save, re-fetch `/report.json` and show the recorded verdict on the
  same screen (Norman: immediate feedback). Do not make them trust that a
  POST happened.

Empty reason → inline error, `aria-invalid`, focus the field. Name the fix
(“A reason is required”), not a mood. No vanishing toast.

---

## 7. Three buckets and the biases they fight

### 7.1 Needs attention (work queue)

Real regressions. Default selection prefers the verification’s prescription,
else `tool.contract_break` — **sensible default for which story to read**,
never for the verdict. Do not auto-Accept. Do not hide Reject. Do not
pre-fill the reason.

Harm before the ask. Owner and consequence of inaction together. A finding
is a **decision**, never a bare chart.

### 7.2 Dismissed signals (lookalikes)

The kit plants false alarms. Flagging one as a regression costs more than
missing a real problem. This bucket exists so the manager and the judge see
the near-miss **and** the dismissal in the same genre as real findings.

Counters:

- **Confirmation bias** (“show me only the bad news”)
- **Availability** (“I only remember the tool break”)

Gate idle (deterministic, never blended with refusal copy):  
**Nothing to approve. This is not a problem.**

Buttons must not appear here — that would be an affordance error (approving
an all-clear).

### 7.3 No measurement (refusals / gaps)

Absence has to be **visible**. A11 first. Claim on the row: “We will not
invent a failover rate.” Required event stays on the page. Peak-end +
isolation: a first-class row sticks; a footer paragraph is honest and
forgettable.

Gate idle for A11 / `NOT_MEASURABLE`:  
**Nothing to approve. We will not invent a failover rate.**  
Other gaps: claim / “We will not invent this number.”

A refusal is **not** a change request. Never show Accept/Reject/Defer on a
gap. Never blend “not a problem” and “will not invent” idle lines
(`idleGateCopy` chooses A11 / `NOT_MEASURABLE` first so failover is named).

### 7.4 After the signature: Signed copy

The Signed copy control belongs to **the minute after the signature**, not
before it. It appears only once `/report.json` shows a recorded decision on a
**Needs attention** finding. Nothing new appears while the manager is still
choosing — otherwise writing the hand-off note would leak into deciding, and
whichever verdict produced a nicer paste would pull them toward it (Goal 4).

Accept, Reject, and Defer get the **same** quiet control: same label, size,
and style. Reject is not a lesser paste. Honesty travels with the note —
verbatim reason, simulated-baseline replay qualifier, coverage, technical
names, and a deep link — with **no recomputed numbers**. The only action is
clipboard copy; there is no Send, mailto, or claim of delivery.

---

## 8. Spatial story: four steps, one causal arc

1. **What changed** — metric in manager English; observed vs expected; matching
   `standard[]` sentence when present.
2. **Why we think so** — cause in English + attributed configuration change.
3. **What we would change** — target + open description + predicted bars.
4. **Did the test help** — replay before/after, or explicit “No test this run.”

Step labels (`.span .kind`) = uppercase tracked job name.  
`.span .name` = Newsreader heading = the **claim**.  
`.span .val` = bold tabular number — a manager comparing 77.5% to 85.5% should
not hunt a muted caption.

Keyboard: ArrowUp / ArrowDown / Home / End move list selection without mouse
hunt (recognition over recall for keyboard-first reviewers). Hash deep-links
(`#f01_…`, `#gap:A11`) exist so a reviewer can point at a row without
describing it.

---

## 9. What another chatbot must not “improve” away

These temptations look helpful and break the psychology:

| Temptation | Why it fails the user |
|---|---|
| Session dashboard / more charts | Exploration trap; delays the call |
| Recompute metrics in the browser | Second source of truth; authority confusion |
| Make Accept larger / bluer / easier than Reject | Punishes a valid no; frames the page as wanting yes |
| Paper cream + all-serif brief | Wrong genre; generic generated-UI cluster |
| Fake waterfall durations | Invented telemetry |
| Label the eight questions on-screen | Turns a brief into a form |
| Bury A11 in a footer | Honest, not memorable |
| Put mode filters only in the list or only in the story | Collapses primary orientation / implies wrong scope |
| Show verdict buttons on dismissed or gap rows | Affordance error — “approving” absence or all-clear |
| Pre-fill the reason or auto-Accept | Dark pattern; defaults may choose the *story*, not the *verdict* |
| Mix idle copy across buckets | Manager cannot tell “not a problem” from “cannot measure” |
| Purple-on-white / glow / pill clusters / emoji chrome | Competes with the traffic-light gate; wrong desk |
| Show Signed copy before the save | Pulls the manager toward whichever verdict pastes nicer |
| Editable note inside the desk | Second source of truth; the paste must match the record |
| LLM-written or free-text note | Paraphrase drift; numbers and honesty fall off |
| Send / mailto / Slack from the desk | Claims delivery the product does not make; clipboard only |

---

## 10. How to judge whether a change helped the user

Ask, in order:

1. Can a stranger manager answer the eight questions without a developer in
   the room?
2. Is every impact figure traceable to the report (no invented plot)?
3. Can they find **Dismissed signals** and **No measurement** in one click?
4. Is A11 visible and legible as a first-class refusal?
5. Is Reject as easy to hit as Accept, with a required reason either way?
6. Does the page feel like it wanted a yes — or like it wanted a *thought*?

Human rubric the psychology is aiming at:

| Rubric | User outcome |
|---|---|
| Decision quality (18) | Harm, owner, inaction, risk, written reason on one view; one write path |
| The screen (15) | Spatial, readable, stranger-friendly; evidence one click away, not in the way |
| Framing (12) | Opens on the problem; shows lookalike; shows refusal; states coverage; admits simulated replay |

If a judge can sit down, dismiss a lookalike, read A11, and record a reasoned
verdict without hunting, the psychology did its job.

---

## 11. Practical map for the next agent

**When changing copy:** speak as the manager’s Monday ticket, not as the
detector author. Check [`docs/manager-english.md`](docs/manager-english.md)
and the maps inside `index.html`.

**When changing layout:** protect the hierarchy — brand (secondary) → mode bar
(primary orientation) → three panes (orient / understand / commit). Do not
fold the three buckets back into the brand row or only into the list.

**When changing the gate:** only `open` / Needs attention gets buttons.
Dismissed and refused get idle lines from the loaded finding, never blended.
Signed copy mounts only in the open + prescription path, below the recorded
verdict, via `data-testid="signed-copy-slot"`.

**When changing visuals:** colour encodes go/stop/wait and work-queue vs not;
size stays equal on verdicts; numbers stay report-backed; type stays claim
serif vs chrome sans.

**When adding features:** if it helps exploration more than the eight
questions, it probably hurts this user.

---

## 12. Closing reminder

Treat the finding as one decision, the loop as four plain headed steps, and
the human as the person who signs — because a manager will not learn “span,”
and a signature on a short causal story still beats a dashboard they will not
finish.
