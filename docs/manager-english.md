# Manager English — jargon on the operator screen

This is the glossary a manager can keep next to the live desk. Every
operator-facing label below is copied from the maps in
`nexus_loop/static/index.html`. Detector codes stay under **Technical names**
on the page; the open story uses the English on the right.

Source of truth: the `AUDIENCE`, `METRIC`, `CAUSE`, `ASK`, `gapClaim`, and
`replayLbl` maps in that file. If the screen and this note disagree, the
screen is right — update this note.

---

## Who should act (`findings[].audience[]`)

| Code in the report | On the screen |
|---|---|
| `agent_builder` | Agent team |
| `platform_owner` | Platform team |
| `business_owner` | Business owner |

Rendered as “{team} needs to act.”

---

## What moved (`findings[].metric`, span titles)

| Code in the report | On the screen |
|---|---|
| `resolution_rate` | Share we finished |
| `turns_to_resolve` | Turns to finish |
| `tool_p95_latency_ms` | Tool wait time |
| `containment_rate` | Share we handled end to end |

Unknown ids are shown with underscores turned into spaces, first letter
capitalised. They are not invented names.

---

## Why we think so (`diagnoses[].cause_class`)

| Code in the report | On the screen |
|---|---|
| `tool.contract_break` | The tool said success but sent an empty answer |
| `kb.gap` | The knowledge base has nothing for this question |
| `prompt.regression` | The prompt started taking more turns |
| `traffic_mix` | Traffic mix, not quality |
| `load` | A short load spike |
| `judge_change` | The scorecard changed, not the agent |

---

## Refusals (`gaps[]`) — the claim, not the ask code

A11 is `NOT_MEASURABLE`. The list title is the claim, not `A11`.

| Ask | On the screen |
|---|---|
| A11 | We will not invent a failover rate |
| A09 | We will not invent why people left |
| A02 | We will not break this down by customer |
| any other gap | We will not invent this number |

A11’s story chip is **we will not invent**. The span title is **Why a retry is not failover** (from `why_the_proxy_misleads`). **There
is nothing to count** names the absence. The required event stays on the
page as a hypothetical (“If this were counted…”), not a promise to guess later. The decision pane is two mutually exclusive
idle lines, chosen from the selected tab — never blended:

| Selected kind | Idle gate |
|---|---|
| dismissed lookalike (`is_regression: false`) or no prescription | **Nothing to approve. This is not a problem.** |
| A11 / `NOT_MEASURABLE` | **Nothing to approve. We will not invent a failover rate.** |
| other `gaps[]` | **Nothing to approve.** plus `gapClaim` (or **We will not invent this number.**) |

The two buckets never mix. `idleGateCopy` chooses A11 / `NOT_MEASURABLE` first
so failover is named, then other refusals, then dismissed or missing
prescription. The long report `why` is not the idle line.

### Story lede (keep it short)

The open paragraph is one or two sentences. The full report `why` sits
under **Full reason**.

| Ask | Lede |
|---|---|
| A11 | Failover does not exist here. There is no rate to show. |
| A09 | We count who left. We will not invent why. |
| A02 | Too many distinct customers to split this list. |

Dismissed stories use `toManagerEnglish` on the full
`not_a_regression_because` so report numbers stay on the page. To-decide
ledes are “{metric} is {now} against {before}.”

---

## Coverage chips (`metrics[]`, header)

| Ask / fidelity | On the screen |
|---|---|
| A01 | Handled end to end |
| A04 | Tool calls that failed |
| A06 | Knowledge base answers |
| A09 | Gave up frustrated |
| A11 | Failover rate |
| `fidelity: judged` | Scorecard quality |

Chips still name fidelity (`measured`, `derived`, `judged`) and coverage
when the report has it. Judged chips show calibration, never a bare 100%.

---

## Finding list

| Internal group | Tab on the screen |
|---|---|
| regressions (`is_regression: true`) | To decide |
| dismissed lookalikes (`is_regression: false`) | Not a problem |
| `gaps[]` | We will not invent |

Only **To decide** is a work queue (Accept / Reject / Defer). **Not a
problem** is a closed mint all-clear that needs no decision. **We will not
invent** is a grey/info
refusal that needs no decision. They do not share idle copy or chips. List
titles wrap two lines. `.list-body` scrolls underneath sticky tabs.

Row copy:

| Situation | Subtitle / stat / chip |
|---|---|
| a gap | No measurement / **we will not invent** |
| a dismissal | tenant · days; chip **not a problem** |
| a regression | tenant · days; conversation count |

ArrowUp, ArrowDown, Home, and End move the selection while the list has
focus.

---

## The four story steps

| Kind (uppercase kicker) | Heading is… |
|---|---|
| What changed | the metric in manager English (e.g. Share we finished) |
| Why we think so | the cause in manager English |
| What we would change | `prescriptions[].target` plus the open description |
| Did the test help | the replay line below |

Replay lines (`verifications[].verdict`):

| Report value | On the screen |
|---|---|
| *(no verification)* | No test this run |
| `improved` | The test got better |
| `no_effect` | The test did not move |
| other verdict | the raw verdict, else “Test result” |

If a known-good conversation is checked: **known-good conversations still
passed** or **a known-good conversation got worse**. The hint states the
test’s “before” is simulated, not the corpus number.

Comparison bars (report values only; green vs red, not brown):

| Pair | Labels |
|---|---|
| observed vs expected | Now / Before this broke |
| predicted delta | Today / If we change it |
| replay | Test before / Test after |

---

## Evidence and hints (`toManagerEnglish`)

Evidence bullets and lead-ev lines run through `toManagerEnglish()` in
`nexus_loop/static/index.html`. Raw codes in the report are replaced with
the same English as the maps above (plus phrase pairs such as `tool p95
latency` → Tool wait time). Codes stay under **Technical names**; the open
Evidence list is manager-readable.

---

## Harm KPIs (colour-coded cards)

Each card is label / figure / caption. Tones match the live CSS:

| Card | Tone | Caption (when present) |
|---|---|---|
| conversations | info (blue) | share of tenant, from `impact.share_of_traffic` |
| would have resolved *or* resolved, slowed | warn | at baseline / outcomes flat |
| extra turns *or* unplanned handoffs | bad (danger red) | — |
| abandoned | bad | left without resolving |
| recorded cost | warn | days running |

---

## Your decision

| Report / schema | On the screen |
|---|---|
| `asking_approval_for` | the open ask (already English; not hidden) |
| `risk_if_diagnosis_wrong` | If we are wrong. |
| `would_not_ship_if` | Would not ship if. (under a disclosure) |
| `accepted` / `rejected` / `deferred` | Accept / Reject / Defer |
| empty reason | A reason is required. |
| A11 / `NOT_MEASURABLE` | Nothing to approve. We will not invent a failover rate. |
| other gap | Nothing to approve. plus `gapClaim` / We will not invent this number. |
| dismissal (`is_regression: false`) or no prescription | Nothing to approve. This is not a problem. |

Codes (`cause_class`, `change_type`, metric id, `replay_run_id`, ask ids,
gap verdicts) sit under **Technical names** in a `.tech-foot` footer pinned
at the bottom of the story column (the open story scrolls above it). The
prescription description and the ask stay in the open story and gate.

---

## Honesty disclosure

Header summary: **What is real, stubbed, simulated**. Parsed from
`system_notes`: REAL, STUBBED, SIMULATED, Breaks at 100×.
