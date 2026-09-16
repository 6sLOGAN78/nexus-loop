# Skill: accessibility-fix

**Category:** accessibility

**Cursor invoke:** `/accessibility-fix`

---


## SKILL: SKILL.md

This skill remediates accessibility violations: baseline, edit, verify. It only fixes. To find what's wrong, use `accesslint:accessibility-scan` (one page, automated), `accesslint:accessibility-inspect` (one page, manual), or `accesslint:accessibility-audit` (whole site, WCAG-EM); to check for regressions, use `accesslint:accessibility-diff`. The engine runs here are internal to the loop — a baseline before and a check after — not a report.

Shared conventions (grounding, never invent content): [`../shared/methodology.md`](../shared/methodology.md).

For large remediations, run via `Task` for context isolation; the steps are the same.

## Input

- A findings worklist (from `accessibility-scan`, `accessibility-inspect`, or `accessibility-audit`, or pasted): apply it directly; the baseline is already done.
- A target (URL, config target name, files, or a directory): audit it first for the baseline, then fix.

Given neither, ask what to fix. Don't sweep a whole codebase unprompted.

## Picking a flow (for baseline and verify)

1. `audit_live` for any URL. It ensures a debuggable Chrome (auto-launches a headless one if none is reachable) and audits the live DOM. Use `selector` to scope and `wait_for` for async content. The live DOM catches what source can't.
2. `audit_html` for raw HTML strings, files (`Read` first), or JSX rendered to a string.

For an authenticated session, have the user start a headed debuggable Chrome (`npx @accesslint/chrome ensure --headed`), sign in, then call `audit_live({ url, port })` to attach to it.

## Steps

1. Baseline. Audit with `format: "compact"` and record the violation set (rule ID and selector for each). Skip this if you were handed a worklist.
2. Apply. For each violation:
   - If a `Source:` line is present, open that file at that line. If several are listed (separated by `←`), the first is the JSX literal and the rest are enclosing components; use `Symbol` to disambiguate.
   - If not, grep stable hooks (`data-testid`, `id`, `aria-label`), then visible text, then tree position.
   - Use the `Fixability:` and `Fix:` fields: apply `mechanical` fixes as given; leave a `TODO` with the rule ID for `contextual` or `visual`. Don't invent content (alt text, labels, link text).
   - Group edits to the same file into one operation.
   - Confirm scope before editing files outside the obvious target, or before more than about 10 mechanical fixes.
3. Verify. Re-run the same audit and compare to the baseline: every targeted violation gone, no new ones. For a precise new/fixed/pre-existing comparison on a URL, use `accesslint:accessibility-diff` rather than checking by eye.

`Source:` lines come from React DevTools fibers and appear only in live-DOM audits against React dev builds. Static audits won't have them; fall back to selectors. When unsure about a rule, use `explain_rule({ id })`.

## When to stop

- A violation with no `Fix:` directive: leave a `TODO`, don't guess.
- Verification fails (a new violation appeared, or a targeted one remains): report it and stop. Don't iterate silently.

## Output

Per cycle: the flow used, violations by impact, what was applied (file and rule), what was deferred (TODOs and why), and the before and after counts.


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
