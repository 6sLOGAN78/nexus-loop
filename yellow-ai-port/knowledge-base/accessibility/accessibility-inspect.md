# Skill: accessibility-inspect

**Category:** accessibility

**Cursor invoke:** `/accessibility-inspect`

---


## SKILL: SKILL.md

This is the semi-automated manual tier of a WCAG assessment: the checks that need interaction (keyboard, focus, state changes, reflow) or human review (focus visibility, error recovery, reading order), which a static rule engine can't decide. Work against the running page; use source only to map a finding to `file:line`. Locate and assess — don't fix (that's `accesslint:accessibility-fix`). The automated tier is `accesslint:accessibility-scan`; `accesslint:accessibility-audit` runs both under WCAG-EM.

The shared rules — severity, the no-proxy boundary, high-risk patterns, conformance, grounding — are in [`../shared/methodology.md`](../shared/methodology.md). Read it when a call needs judgment. The rules that always apply are below.

## Grading

Tag each finding with a severity (user impact) and an evidence basis (what you can support). Keep the two separate.

- ● Verified — deterministic and reproducible. Cite the selector, the interaction, and the observed a11y-tree or DOM fact. Without that proof it is not ●.
- ◐ Flagged — you have evidence, but the decision needs a person. Attach the evidence and your opinion; don't decide it yourself.
- ○ Human-required — needs assistive technology or lived experience. Hand it off; don't emulate it.

When unsure between two evidence grades, use the lower one. The icons show evidence basis by fill, not color.

A finding that stacks a deterministic fact on an interpretive call takes the lower grade. The machine-checkable half (e.g. no programmatic status in the a11y tree — a 1.3.1 fact) is ● evidence *inside* a ◐ finding; the interpretive conclusion (e.g. that color is the sole carrier of the meaning — 1.4.1) stays ◐. Citing the ● half does not upgrade the whole.

Severity (user impact, separate from evidence basis):
- Critical — blocks a core task, with no workaround.
- Serious — a major barrier; the task is possible but difficult.
- Moderate — noticeable friction; the task still completes.
- Minor — a small inefficiency or polish issue.

## The ledger — a denominator, not a script

The checkpoint areas below are the run's denominator: every criterion in them ends the run in exactly one state, and the report says which.

- **● verified** or **◐/○ flagged** — you drove the check and have the evidence.
- **N/A** — the triggering feature isn't on the page (no form, no media, no drag UI). Decided from the snapshot; free.
- **Not exercised** — the feature is present but you didn't drive it. Reported as **undetermined**, never silently dropped, and never as a pass.

Not-exercised is a legitimate, honest outcome and it costs nothing. Drive only what the page's features and the engine's gaps demand; don't work through checkpoints to make the report look thorough. An "undetermined — not exercised" line and a driven-and-verified line differ in evidence, not in honesty.

Dedup **before** driving, not after: the engine (`accessibility-scan`) owns the statically-detectable criteria — name/label presence, `lang`, `autocomplete`, semantic markup, contrast of text on flat backgrounds. If a scan result set or engine-owned SC list was provided (as `accessibility-audit` does), never re-check those criteria; ledger them as engine-owned. Without one, read what you can from the initial snapshot rather than re-deriving what the engine would catch.

| Area | SCs | Trigger to drive |
|------|-----|------------------|
| Keyboard & focus | 2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11 | Always — one batched walk (below) |
| Structure & semantics | 1.3.1, 1.3.2, 2.4.1, 2.4.6 | Always — read from the initial snapshot; no extra driving |
| Names, roles, states | 4.1.2, 2.5.3, 4.1.3 | Custom widgets / stateful controls present (static name presence is engine-owned) |
| Visual adaptation | 1.4.1, 1.4.4, 1.4.10, 1.4.12, 1.3.4, 2.3.3, 1.4.11 | Reflow/zoom on every page (one resize each); motion checks only if motion is present |
| Forms & errors | 3.3.1–3.3.3, 1.3.5, 3.3.7, 3.3.8 | A form is present (label/`autocomplete` presence is engine-owned) |
| Media & timing | 1.2.x, 2.2.1, 2.2.2 | `<video>`/`<audio>`, autoplay, or timeouts present |
| Pointer & target | 2.5.1, 2.5.7, 2.5.8 | Target size comes free from the batched walk; drag checks only if drag UI |
| Content & navigation | 3.1.1/2, 2.4.4, 3.2.3/4, 3.2.6 | `lang` and link purpose from the snapshot; cross-page consistency is `accessibility-audit`'s (not exercised here) |

Per-checkpoint procedure and default grades: [`references/checkpoints.md`](references/checkpoints.md). Read it when a triggered area needs its detailed steps, or when the user asks for a deep pass (`--deep`: drive every triggered area through its full procedure).

## Evidence budget — cap spend by grade

Calibrated uncertainty must be cheaper than false certainty. The grade a finding can reach bounds the evidence worth gathering:

- **●** — full proof, gathered once: selector, interaction, observed DOM or a11y-tree fact. Don't repeat an interaction you already recorded.
- **◐** — hard cap: one selector, one screenshot (only if the question is visual), your opinion, and what a person should confirm. Then stop. A ◐ is re-decided by a human whichever way you lean; more evidence doesn't upgrade it to ●, it just costs more.
- **○** — zero driving: name the functional ability, the assistive technology, and the flow you already exercised. Never drive the page to "strengthen" a ○.

## Prerequisite: a browser to drive

This tier runs through a browser MCP: `chrome-devtools` (recommended), `playwright`, or `puppeteer`. If none is connected, run only the static checks, report the rest as ○ handoffs, and tell the user:

```bash
claude mcp add chrome-devtools npx -- -y chrome-devtools-mcp@latest
```

## Target

`$ARGUMENTS` is a URL, an `accesslint.config.json` target name, or empty for the default target. `--selector <css>` scopes to a component; `--wait-for <css>` waits for async content.

`navigate_page` needs a URL, so resolve first:
- A URL: use it.
- A target name or empty: read `accesslint.config.json` (and the gitignored `accesslint.config.local.json` overlay) and resolve the name (or `default`) to its `url`; also take its `waitFor` and `selector`.
- No config: ask for a URL, or suggest `npx @accesslint/cli init`.

Then navigate to the URL and wait for the gate (`--wait-for` if given, otherwise the target's `waitFor`) before testing.

## Driving efficiently

**One snapshot, then scoped reads.** Take one full snapshot after the wait gate; it is the basis for structure, names, roles, states, and the N/A decisions. After a state change, don't re-snapshot the page — read only the widget that changed, via `evaluate_script` scoped to its selector (or a snapshot of that subtree). A full-page re-snapshot per interaction is the single largest avoidable cost in this tier.

**One batched keyboard walk.** Traverse focus in a single `evaluate_script` call, not one `press_key`/snapshot cycle per stop: compute the tabbable sequence, `focus()` each element in order, and return compact JSON per stop — selector, role/name, `document.activeElement` confirmation, computed `outline`/`box-shadow` on `:focus`, bounding box (which settles 2.5.8 for free), and whether the element sits under a sticky/overlay rect (2.4.11). The walk is deterministic DOM fact, so its results are ●-citable.

The walk finds candidates; real key events confirm behavior. Scripted `focus()` doesn't run an app's keydown handlers, so operability (`Enter`/`Space`/arrows) and trap claims still need `press_key` — but only at the walk's suspects: composite widgets (roving tabindex, `aria-activedescendant`), elements whose handlers plausibly capture Tab/Esc, anything the walk couldn't reach. A ● keyboard-trap finding needs the real `Tab`/`Esc` presses at that widget; it doesn't need them at every widget on the page.

## High-risk patterns

For drag-and-drop, rich-text editors, tree views, data grids, custom comboboxes or menus, carousels, and toast or live-region-heavy UIs, heuristic checks are unreliable. Name the APG pattern, verify what you can (●/◐), and hand off the rest as ○ with the assistive-technology steps to run. Use `explain_rule` for engine rules and the APG for widget contracts.

## Report

Group findings by evidence basis; mark severity inline. Close the ledger at the top — every SC in the denominator lands in exactly one bucket — and keep it compact: counts, then bare SC numbers. Group not-exercised SCs by shared reason, one parenthetical clause per group, never a line per SC.

The report spends its words on failures, flags, and handoffs. A pass is its SC number in the ledger — not a paragraph: no "what passed" narration beyond at most one sentence, and no restating in the recommendations a fix already given on its finding.

```
# Manual inspection — <target>  ·  semi-automated tier
Severity: <c> critical · <s> serious · <m> moderate    Basis: ● <v> · ◐ <f> · ○ <h>
Ledger: pass ● <SCs> · fail ● <SCs> · flagged ◐/○ <SCs> · engine-owned <SCs> · N/A <SCs>
        not exercised → undetermined: <SCs (shared reason)> · <SCs (shared reason)>

## ● Verified
- [serious] Keyboard trap in date picker — SC 2.1.2
    where: div.datepicker[role=dialog]   repro: Tab into grid, focus never exits via Tab or Esc
    fix: <mechanical> | NEEDS HUMAN

## ◐ Flagged
- [moderate] Focus indicator may be too faint — SC 2.4.7
    where: button.ghost   evidence: focus-ghost.png; outline = 1px rgba(0,0,0,.2)
    opinion: likely fails 3:1 non-text contrast — confirm visually

## ○ Human-required
- Live-region announcement on add-to-cart — SC 4.1.3
    aria-live="polite" present (●); actual NVDA/JAWS/VoiceOver output unverified
    needs: screen-reader users (blind / low-vision, per Section 508 FPC)
    flow: add-to-cart → toast (exercised above)
```

Ground each entry by selector and visible text. Add `file:line (symbol)` only when `accessibility-scan`'s source maps provide it; don't guess. Each ○ entry is a handoff: the functional ability and assistive technology needed, plus the flow you exercised.

## Notes

- The a11y tree shows machine state, not what a screen reader announces. `aria-live` being present does not mean it announces.
- Browser zoom isn't exposed; CSS-zoom approximations are ◐.
- Wait for async content before the initial snapshot; after that, prefer selector-scoped reads over re-snapshots.
- Composing the tiers (dedup against `accessibility-scan`, one shared browser) is `accessibility-audit`'s job. On its own, this skill reports what its checks find — and its ledger says what they didn't.


## REF: references/checkpoints.md

# Inspect checkpoints — per-check procedure and default grades

The detailed procedure behind the ledger table in [`../SKILL.md`](../SKILL.md). Read this when a triggered area needs its steps, or for a `--deep` pass. Each checkpoint's icon is its default evidence grade: lower it freely, raise it only with proof. The evidence budget still applies — a ◐ check gets one selector, one screenshot, a handoff note, and stops.

**Keyboard and focus** — 2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11
- ● Every interactive element is reachable with `Tab` and operable with `Enter`/`Space`/arrows. The batched walk establishes reachability and order; confirm operability with `press_key` only at composite widgets and the walk's suspects.
- ● No keyboard trap: focus that can't leave with `Tab`/`Esc` is a trap. A ● trap claim needs the real key presses at that widget.
- ◐ Focus order follows reading and visual order. The walk captures the order; a person confirms whether it's coherent.
- ◐ Focus indicator is visible. The walk returns computed `outline`/`box-shadow` per stop; screenshot only the stops that look questionable.
- ◐ Focus is not hidden by sticky or overlay elements (2.4.11). The walk flags stops under overlay rects; screenshot the flagged ones.

**Structure and semantics** — 1.3.1, 1.3.2, 2.4.1, 2.4.6
- ● Landmarks are present (banner/nav/main/contentinfo), with exactly one `main`.
- ● Heading outline skips no levels and has one h1. Derive it from the initial snapshot.
- ● Lists and tables use semantic markup; data tables associate headers.
- ◐ Headings and labels are descriptive, and DOM reading order matches meaning. A person confirms.

**Names, roles, states** — 4.1.2, 2.5.3, 4.1.3
- ● Every control has an accessible name, and the visible label is part of that name (2.5.3). Name presence alone is engine-owned; inspect owns label-in-name and anything the engine's list didn't cover.
- ● Custom-widget roles match their APG pattern.
- ◐ States (expanded/checked/selected/disabled) update in the tree on interaction. Read the widget's subtree before and after — scoped, not a full re-snapshot; whether they are announced is ○.
- ○ Live-region and status-message announcement (4.1.3). `aria-live` being present is ●; that it actually announces is assistive-technology only.

**Visual adaptation** — 1.4.4, 1.4.10, 1.4.12, 1.3.4, 2.3.3, 1.4.1, 1.4.11
- ◐ Reflow at 320 CSS px (1.4.10). Resize to 320 wide; check for two-dimensional scrolling or clipped content. One resize, one screenshot.
- ◐ Zoom to 200% and 400% (1.4.4). Approximate with CSS zoom via `evaluate_script` (true browser zoom isn't exposed; note this) and screenshot.
- ◐ Text spacing (1.4.12). Inject the WCAG spacing override and check for clipping.
- ◐ Reduced motion (2.3.3). `emulate` prefers-reduced-motion and observe. Only if the page has motion.
- ◐ Color is not the only signal (1.4.1); non-text and state contrast (1.4.11). Screenshot states; the engine misses text-on-image and focus/hover contrast. Absent programmatic state in the tree is a ● 1.3.1 fact; "color is the sole carrier" is a look — the 1.4.1 finding stays ◐.

**Forms and errors** — 3.3.1–3.3.3, 1.3.5, 3.3.7, 3.3.8
- ● Every field has a programmatic label; `autocomplete`/input-purpose is set where it applies (1.3.5). Both are engine-owned when a scan ran; don't re-derive them.
- ◐ Submit invalid input: errors are programmatically associated (3.3.1, ●) and the message supports recovery (3.3.3, a person confirms).
- ◐ Redundant entry (3.3.7) and accessible authentication (3.3.8). Exercise the flow and note any cognitive burden.

**Media and timing** — 1.2.x, 2.2.1, 2.2.2
- ◐ `<video>`/`<audio>` have caption, transcript, or description tracks present. Presence is detectable; accuracy is ○.
- ◐ Autoplay and moving content can be paused (2.2.2); timeouts can be adjusted (2.2.1).

**Pointer and target** — 2.5.7, 2.5.8, 2.5.1
- ● Interactive targets are at least 24×24 CSS px (2.5.8). The batched walk's bounding boxes settle this; no separate pass.
- ◐ Dragging has a single-pointer alternative (2.5.7); path and multipoint gestures have a simple alternative (2.5.1).

**Content and navigation** — 3.1.1/2, 2.4.4, 3.2.3/4, 3.2.6
- ● `lang` is set on the page and on parts in other languages. Engine-owned when a scan ran.
- ◐ Link and button purpose is clear from the name alone (2.4.4); navigation and identification are consistent across pages (3.2.3/4); help is placed consistently (3.2.6). The cross-page criteria need `accessibility-audit`'s sample; on a single page, ledger them as not exercised.
- ○ Plain-language comprehension and cognitive load. Readable to you is not the same as usable for cognitive disabilities. Hand off.


## SHARED: methodology.md

# AccessLint accessibility methodology

Shared rules for the accesslint skills. The skills are the procedures (scan, inspect, audit, fix, diff); this file is the methodology they follow and the source for the rules they state inline. When a skill points here, read this and apply it.

The overall stance: augment, don't replace. These tools help human auditors and assistive-technology (AT) users work faster; they don't replace them.

## The pipeline

```
LOCATE                       ASSESS              REMEDIATE      GUARD
scan    (automated tier) ┐
                         ├─► audit ────────────► fix ────────► diff
inspect (manual tier)    ┘   (WCAG-EM umbrella)  (edit→verify)  (regression)
```

- scan — the automated rule engine. Locates mechanically-detectable violations. No judgment.
- inspect — the semi-automated manual tier. Drives a live page through checks the engine can't decide. Locates and grades.
- audit — the WCAG-EM umbrella. Defines scope, samples, runs scan and inspect, reports conformance.
- fix — remediation. Baseline, edit, verify.
- diff — regression check. New vs fixed against a baseline.

Each skill does one of these: locate, assess, remediate, or guard.

## WCAG-EM: the process

An audit differs from a scan by following a process. The W3C evaluation methodology has five steps:

1. Define scope — the target and its boundary, the conformance goal (default WCAG 2.2 AA), the technologies in use, and the AT baseline the human handoff should cover.
2. Explore — map routes, templates, key flows, content types, and stateful UI before sampling.
3. Select a representative sample — a structured set (the essential and the distinct pages and states) plus a small random set.
4. Evaluate the sample — run the tiers against each sampled state; grade and dedup.
5. Report — aggregate into per-criterion conformance.

Auditing one URL with no sampling is a scan, not an audit. Say which you did.

## Three tiers of evidence

| Tier | How | Catches | Skill |
|------|-----|---------|-------|
| Automated | rule engine | ~57% of real defects (Deque) | scan |
| Semi-automated | drive the browser, read the a11y tree | up to ~80% | inspect |
| Manual / human + AT | expert judgment, lived experience | the rest | human (prepared by inspect/audit) |

The coverage numbers measure different things: "~57% of defects caught by automation" (Deque) and "~64% of criteria partially auto-detectable, ~36% need manual review" (GitHub) are not the same metric. Don't conflate a defect-catch rate with a criteria-coverage rate.

## Two axes: severity and evidence basis

Every finding has two grades. Keep them separate. A finding can be serious and ●, or serious and ◐; those mean different things to a reader.

### Evidence basis — what you can support

- ● Verified — deterministic and reproducible. Cite the selector, the interaction, and the observed DOM or a11y-tree fact. Without that proof it is not ●.
- ◐ Flagged — you have evidence, but the decision needs a person. Attach the evidence and your opinion; don't decide it yourself.
- ○ Human-required — needs assistive technology or lived experience. Hand it off; don't emulate it.

When unsure between two grades, use the lower one. The icons show evidence basis by fill (● full, ◐ partial, ○ none), not color, so the list is readable for color-blind and low-vision readers and doesn't read as a severity scale.

Many findings stack a deterministic fact on an interpretive call. Grade the two separately, and give the finding the lower grade. The machine-checkable half — an attribute absent from the a11y tree, a measured box, a reproducible traversal — is ● on its own terms; the conclusion drawn from it — what a sighted reader relies on, what a pattern means to a person — is a look, and stays ◐. Worked example: status dots whose color shows open vs closed. That the tree exposes no programmatic status is ● (a 1.3.1 fact; cite the selector and the tree). That color is the *sole* carrier of the meaning (1.4.1) is interpretive — position, shape, or nearby text could also carry it — so the finding is reported ◐, with the ● fact attached as its evidence. Citing the deterministic half does not license upgrading the whole.

### Severity — user impact (separate from evidence basis)

- Critical — blocks a core task, with no workaround (a keyboard-trapped checkout; an unlabeled sole submit button).
- Serious — a major barrier; the task is possible but difficult (illogical focus order through a form; body-text contrast failure).
- Moderate — noticeable friction; the task still completes (a missing skip link; noisy repeated announcements).
- Minor — a small inefficiency or polish issue (slightly low non-text contrast on a non-essential control).

## The evidence budget: uncertainty must be cheaper than certainty

The grade a finding can reach bounds the evidence worth gathering for it. A ● claim deserves full proof — selector, interaction, observed fact — gathered once. A ◐ finding is re-decided by a human whichever way the evidence leans, so it gets one selector, one screenshot if the question is visual, an opinion, and what a person should confirm — then stop; more evidence never upgrades a ◐ to ●, it only costs more. A ○ handoff gets no driving at all: name the ability, the AT, and the flow already exercised.

The same principle governs coverage. A checkpoint list is a **denominator to cite, not a script to execute**: every criterion in scope ends a run as verified, flagged, engine-owned, N/A (the triggering feature is absent), or **not exercised** — reported as undetermined. Not-exercised is free and honest; driving a check the page's features and the engine's gaps don't demand buys thoroughness-looking output, not evidence. Never let a not-exercised criterion silently read as a pass.

And it governs the report. The ledger is counts and bare SC numbers, with undetermined SCs grouped by shared reason — one clause per group, never a line per SC. A pass is its SC number in the list: at most one sentence of narration for the whole passing set, no "what was checked" tour. The words go to failures, flags, and handoffs — the entries a reader acts on — and a fix stated on its finding isn't restated in the recommendations.

## The boundary: no proxy for human experience

- Usability and UX enter only as ◐ heuristics, clearly labeled — for example, "this focus order is valid but hard to follow," or "this error message doesn't help recovery." Not "users will feel…" or "a screen-reader user would struggle…".
- Real AT-user testing is ○: named, handed off, not emulated. No personas, no synthetic sessions, no predicted behavior. The a11y tree shows machine state, not announcement or lived experience.
- The handoff is a deliverable. For each ○, give the functional ability and AT that would reveal it (per Section 508 Functional Performance Criteria, described by ability rather than diagnosis) and the task or flow to run (from what was exercised). Prepare the handoff; don't predict the behavior.

## Conformance: three states

Conformance is stated per success criterion, across the whole sample:

- Pass or Fail — only for ●-verified criteria.
- Undetermined — everything ◐ or ○, and every criterion not exercised. Goes to a human.

One sampled page failing an SC fails it for the scope at that level; don't average it away. Don't report a pass rate you can't support, and don't let an unexercised criterion count toward one.

## High-risk patterns

For drag-and-drop, rich-text editors, tree views, data grids, custom comboboxes or menus, carousels, and toast or live-region-heavy UIs, heuristic checks are unreliable. Name the APG pattern, state the keyboard and ARIA contract it owes, verify what you can (●/◐), and hand off the rest as ○ with the AT steps to run. Use `explain_rule` for engine rules and the [APG](https://www.w3.org/WAI/ARIA/apg/) for widget contracts.

## Grounding and honesty

- Ground each finding by selector and visible text. Add `file:line (symbol)` only when scan/audit source maps (React DevTools fibers) provide it; don't fabricate a location.
- Don't invent content. Apply mechanical fixes as given; for contextual or visual changes (alt text, labels, link text, copy), leave a TODO with the rule ID.
- State what wasn't covered — pages outside the sample, ○ criteria, anything skipped. Omitting it reads as "all clear".
- The grades record uncertainty honestly. Don't state findings just to look thorough; when unsure, use the lower grade.
