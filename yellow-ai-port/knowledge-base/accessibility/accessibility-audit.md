# Skill: accessibility-audit

**Category:** accessibility

**Cursor invoke:** `/accessibility-audit`

---


## SKILL: SKILL.md

This is a full WCAG 2.2 accessibility audit using WCAG-EM. It defines scope, samples representative pages and flows, runs both evaluation tiers, and produces one conformance report:

- Automated tier: `accesslint:accessibility-scan` (the rule engine).
- Semi-automated manual tier: `accesslint:accessibility-inspect` (keyboard, focus, state, reflow, and the rest the engine can't decide).

Assess; don't fix (`accesslint:accessibility-fix`) or diff (`accesslint:accessibility-diff`). One page with no sampling is a `accessibility-scan`, not an audit. This skill delegates each sampled page to its own subagent (step 4), so it stays light on large samples.

The full doctrine — WCAG-EM in detail, the severity rubric with examples, the no-proxy boundary, grounding — is in [`../shared/methodology.md`](../shared/methodology.md). The rules needed to run this skill are below.

## Grading

Each finding carries a severity and an evidence basis. Keep them separate.

- Evidence basis: ● verified (deterministic, with cited proof) · ◐ flagged (evidence captured, a person decides) · ○ human-required (needs assistive technology or lived experience; handed off, not emulated).
- Severity: critical (blocks a core task) · serious (major barrier) · moderate (friction, still completable) · minor (polish).

## WCAG-EM steps

Run in order and state what you did at each.

1. Scope. State the target and its boundary, the goal (default WCAG 2.2 AA; `--level AAA` adds AAA), the technologies in use, and the assistive-technology baseline the human handoff should cover. You scope that baseline; you don't test it.
2. Explore. Use Glob/Grep to find routes, templates, and shared components. Note key flows, content types, and stateful UI (modals, wizards, empty and error states). `accesslint.config.json` targets are a starting point.
3. Sample. Choose a structured set (entry page, each key flow end to end, every page with a new template or complex widget, and the important states) and a small random set. Say what's in each and why.
4. Evaluate. Delegate each sampled page or state to its own `Task` so it runs in its own context and returns its findings; independent pages can run in parallel. Each Task:
   - runs `accesslint:accessibility-scan` (`--format json`) first, then `accesslint:accessibility-inspect` against the same rendered state — same URL, `--selector`, `--wait-for` — passing scan's results (or at least the list of SCs the engine covered) into the inspect run;
   - dedups by SC ownership **before driving, not after**: `accessibility-scan` owns rule-detectable criteria, `accessibility-inspect` owns interaction and judgment criteria; inspect never re-checks an engine-owned SC, and where both still cover the same SC at the same element, `accessibility-scan`'s result wins;
   - returns a structured block: per finding, the SC, severity, evidence basis (●/◐/○), location, tier, evidence, and fix or handoff, plus this page's per-SC ledger (verified / flagged / engine-owned / N/A / not exercised).

   Aggregate the returned blocks in step 5. For a one- or two-page scope, run the tiers inline instead of spawning a `Task`.

   A shared browser is optional and improves selector matching across tiers, but it's a pre-wired precondition, not something this skill sets up at runtime: the browser MCP binds to its Chrome at server start (`--autoConnect` or `--browser-url`), with the engine pointed at the same port. Without it (the default), each Task runs both tiers against the same URL and `--wait-for` gate and dedups by SC ownership.
5. Report. Aggregate into the format below. Conformance has three states: pass or fail only for ● findings; everything ◐ or ○ — and every SC no page exercised — is undetermined and goes to a human. One sampled page failing an SC fails it for the whole scope at that level. Don't report conformance you can't support, and don't let a not-exercised SC read as a pass. Keep the ledger to counts and bare SC lists — group undetermined SCs by shared reason, one clause per group — and spend the report's words on failures, flags, and handoffs: a pass is its SC number in the list, with at most one sentence of narration for the whole passing set.

## Report format

```
# Accessibility audit — <product / scope>
WCAG 2.2 Level AA · WCAG-EM · <N> pages/states sampled

## Scope
- Target & boundary: <…>     Goal: WCAG 2.2 AA
- Technologies in use: <…>
- AT baseline (for the human handoff, not tested here): <SR+browser pairs, keyboard-only, …>

## Sample
- Structured: <page/state> — <why>   (×N)
- Random: <page/state>

## Conformance (per success criterion)
- Pass ●: <n>  ·  Fail ●: <n>  ·  Undetermined (◐/○/not exercised): <n>  ·  N/A: <n>
- Fail ●: <SCs>   Pass ●: <SCs>   N/A: <SCs>
- Undetermined: <SCs (shared reason)> · <SCs (shared reason)>
- Pass/fail is asserted only for ● criteria; ◐/○ and not-exercised are undetermined.

## Findings — by severity, tagged by evidence basis
### Critical
- [●] <barrier> — SC x.x.x — where: <selector / file:line> — tier: scan|inspect — → `accessibility-fix`
- [◐] <barrier> — SC x.x.x — evidence: <screenshot / measurement> — confirm: <what a person checks>
### Serious / Moderate / Minor
[same shape]

## Human-required (○) — the testing handoff
- <what only AT or lived experience reveals> — SC x.x.x
    needs: <functional ability + AT, per Section 508 FPC>   flow: <sampled flow>

## Recommendations
- Root-cause / pattern fixes (one change that clears many instances) → hand to `accessibility-fix`.
- What to send to human and AT testing, and on which flows.
- Wire `accesslint:accessibility-diff` into CI for the sampled targets.
```

## Notes

- Assess, don't fix (use `accessibility-fix`) or diff (use `accessibility-diff`). Don't emulate human experience: usability is ◐, lived experience is ○ and handed off.
- Conformance is per SC across the whole sample. Don't average failures away.
- Two browsers can drift selectors; prefer a shared browser for ●-precision, otherwise note that dedup is best-effort.
- State what wasn't covered (pages outside the sample, ○ criteria). Omitting it reads as "all clear".
- Use `list_rules` and `explain_rule` for engine-rule metadata.


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
