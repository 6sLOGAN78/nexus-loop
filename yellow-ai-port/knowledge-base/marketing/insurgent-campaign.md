# Skill: insurgent-campaign

**Category:** marketing

**Cursor invoke:** `/insurgent-campaign`

---


## SKILL: SKILL.md

# Insurgent Campaign

A campaign-design skill for organizations and people who cannot win by outspending. It ideates
campaign concepts across every major archetype, audits the user's spend asymmetry against
their competition, assembles an insurgent channel stack, sets strict boost gates on any
paid spend, and produces a lift-test plan so the user measures incremental impact rather
than vanity metrics.

## Core Premise

**Paid media scales attention. Organic narrative and grassroots networks scale trust.**
When trust is the bottleneck — and in 2025–2026, for most underdogs, it is — additional
ad spend hits diminishing and then negative returns. Saturation, inauthenticity, and narrative
incoherence produce reactance, not persuasion. The leverage point is not reach; it is credibility
and message-market fit.

Empirical spine:

- Academic field experiments show digital ad ROI confidence intervals are so wide that most
  campaigns cannot be statistically distinguished from zero lift (Lewis & Rao, "The
  Unfavorable Economics of Measuring the Returns to Advertising," *Quarterly Journal of
  Economics* 2015). Meta and Google both ship Conversion Lift / Brand Lift tools precisely
  because *they* distinguish attributed conversions from incremental conversions — the
  platforms' own tooling is the tacit admission that dashboard ROAS is not causal.
- Across 18,000+ brands, CPA rose in 13/14 industries in 2025; ROAS fell in 13/14; conversion
  rates fell in 13/14. More money is buying fewer results.
- Facebook organic engagement sits near 0.15%, Instagram ~0.50%, X ~0.15%, TikTok ~2.50% — still
  the best organic window but compressing fast.
- Meta and Google both ended political/issue ads in the EU in October 2025, removing paid channels
  entirely for large categories and forcing organic to carry the campaign.
- Under the most extreme spending asymmetry imaginable (a grassroots party vs. a €4B state-backed
  communications apparatus with foreign support), the side with near-zero paid media won a
  parliamentary supermajority in Hungary in April 2026 — see `references/hungarian-case-study.md`.

The same curve bends commercial advertising. The skill treats paid as an *amplifier of proven
organic winners*, never as a standalone channel.

## When to Apply This Skill

Apply when the user:

- Asks to plan any campaign (marketing, launch, fundraising, mobilization, awareness, turnout).
- Describes being outspent by a competitor, incumbent, or adversary.
- Is considering ad spend, boosts, influencer deals, or scaling a paid channel.
- Is watching their organic reach collapse and wondering what to do.
- Is preparing for a launch, election, fundraise, product push, or cause-led moment.
- Is deciding between paid and organic allocation, or between channels.

Also apply when no explicit "campaign" is named but the user is debating where to invest
time and money for distribution.

## Workflow

The skill runs in seven stages (1, 2, 3, 3a, 4, 5, 5b). Do not skip stages; later
stages depend on the user's answers and selections from earlier ones. Stage 3a
(MMF Gate) can refuse the full campaign plan and route the user to validation work
instead. Stage 5 ends with a shape selection — Stage 5b only begins once the user
has picked one of the three shapes.

This skill is designed to be portable across agent environments. Where the workflow
says "ask the user," use whatever structured-question facility your environment
provides (in Claude Code that is the `AskUserQuestion` tool, batching up to 4
questions per call); if no structured tool exists, ask in plain text and wait for
the user to reply before continuing. Either way, never invent answers.

**Resume Protocol (idempotency).** Before producing any output, scan the
conversation for prior skill output. If a section's heading (`## N. <name>`)
is already present in the conversation, do not regenerate it. Pick up at the
first stage whose Contract preconditions are satisfied AND whose output
section(s) are not yet in the conversation. If the user explicitly asks to
restart, restart from Stage 1; otherwise resume rather than rerun. This makes
the skill safely re-invokable: a second call in the same conversation produces
only the next incremental section, never duplicates or regressions to earlier
stages. Scope: idempotency holds within a single conversation; if prior output exists only in an external file or a previous session, paste it into the conversation first or restart from Stage 1.

**Stage Contracts.** Each stage below opens with a **Contract** block declaring
inputs, outputs, preconditions, postconditions, and failure modes. The contract
is the structural boundary — it is what makes the stage retry-safe, error-
explicit, and self-describing. Treat the contract as binding: if the
preconditions are not met, do not enter the stage; if a failure-mode trigger
fires, take the declared action rather than improvising.

### Stage 1 — Interview / Brief Capture

**Contract**
- Inputs: user's initial brief (free text, any length).
- Outputs: Section 0 (Assumptions table) under Mode C; mode-tag (A/B/C) and the 8 fields captured in working memory for downstream stages.
- Preconditions: none (entry stage).
- Postconditions: all 8 fields have a value (captured, defaulted, or flagged as `[ask]` for a still-pending question); mode is determined.
- Failure modes:
  - any always-capture field missing under Mode C → add it to the question batch; do not default silently.
  - a missing field would change Stage 3 asymmetry classification OR Stage 4 function choice → escalate it into the batch even if it would normally default.
  - user gives contradictory values for the same field → ask one clarifying question; do not pick one silently.

The skill has **three intake modes**. Pick the mode that matches the user's brief
before asking any questions.

**Mode A — Full-brief mode.** The user has volunteered all 8 fields below up front
(in a pasted brief, a prior plan, a detailed message). Skip the interview entirely,
confirm understanding in one sentence, and proceed to Stage 2.

**Mode B — Interview mode.** The user explicitly asks to be scoped ("help me figure
out what this campaign should be," "walk me through it," "interview me"). Ask the 8
questions below in batches of ≤4 per turn, using the environment's structured
question facility if one exists (see the structured-tool note in the Workflow
section above). Do not invent answers. Do not merge questions.

**Mode C — Default mode (for terse briefs).** The user gave a short brief
(≤2 sentences) without asking for an interview. This is the common case. Do NOT run
the full 8-question interview — it turns a 12-word prompt into an interrogation.
Instead:

1. **Always-capture fields (ask once, batched).** Four fields are too material to
   default silently; getting them wrong produces a generic plan. Ask the user in
   **one batch** of up to 4 questions covering:

   - **Outcome** — what specific action is the campaign driving (signups, ticket
     sales, votes, donations, attendance, pre-orders, qualified demos)?
   - **Audience** — who is the target? Who experiences the problem? Geography,
     seniority, community membership. "Everyone interested in AI" is not an
     audience; "London-based senior AI/ML engineers at Series A–C startups" is.
   - **Sector** — pick from the 6 riders in `references/sector-riders.md`
     (`cohort-education`, `b2b-saas`, `ngo`, `consumer-brand`, `political-civic`,
     `personal-brand`), or `other` with a one-sentence description. The sector
     rider materially changes Stage 4 channel weighting and Stage 5 archetype
     defaults.
   - **Budget** — what can you actually spend per month (€0 / <€1k / €1k–10k /
     €10k+) and what is the competitor's rough spend (unknown / similar / 5×
     ours / 50×+ ours)? Budget materially changes Stage 3 asymmetry
     classification and Stage 4 paid-channel availability. Never default this
     silently.

   If one of these four fields is already clearly present in the user's brief,
   drop it from the question batch. Only ask what is missing.

2. **Default-with-flag fields.** The remaining fields default silently but are
   surfaced in an **Assumptions table** at the top of the final deliverable (Stage
   5 output). The user can confirm or adjust inline after reading the plan:

   | Field | Default under terse brief |
   |---|---|
   | Competition (specifics) | Abstract — "cohort-based courses in the category," "mid-size SaaS competitors," etc. Use the heuristic questions in `references/asymmetry-audit-table.md` to classify asymmetry qualitatively. Never invent specific competitor names. |
   | Existing channels / traction | "Starting from zero" unless the user's brief, working directory, or CLAUDE.md clearly indicates an existing newsletter, community, or follower base. |
   | Bottleneck | Trust (the 2025–2026 default for almost every underdog campaign). |
   | Time window | 60 days to a single dated anchor moment (event, launch, election), then recurring cadence. |
   | Capacity | 6h/week. |

3. **Escalation rule.** If a missing field would materially change the Stage 3
   asymmetry classification *or* the Stage 4 primary-function choice, do not
   default it — add it to the question batch. Example: if the user mentions
   "our whole team is posting already" but does not specify which channels,
   ask, because it changes the channel stack.

4. **Assumptions table is mandatory under Mode C.** Open the final deliverable
   with a table listing every defaulted field and its assumed value. End the
   deliverable with: *"Confirm or adjust any row in the Assumptions table and I
   will re-run the affected stages."*

#### The 8 Fields

Regardless of mode, the campaign plan is grounded in these 8 fields:

1. **Sector and outcome** — which of the 6 sector riders applies, and the specific
   action the campaign drives. (Sector is ask-once in Mode C; outcome is
   ask-once in Mode C.)
2. **Audience** — who is the target, with enough specificity to picture them.
   (Ask-once in Mode C.)
3. **Competition / incumbent** — name 3–5 specific competitors, *or* say "unknown"
   / "I'll describe them abstractly." If unknown, stay at category level and use
   `references/asymmetry-audit-table.md` heuristics. Never invent names.
   (Defaults in Mode C; user can sharpen in the Assumptions confirmation.)
4. **Budget** — user's and competitor's, in numbers or rough ratios.
   (Ask-once in Mode C.)
5. **Existing channels and traction** — where does the user already reach the
   audience (newsletter size, community size, follower counts that matter, warm
   email list, prior press). (Defaults in Mode C.)
6. **Bottleneck** — reach / trust / conversion / turnout / retention — pick one.
   (Defaults to trust in Mode C.)
7. **Time window** — evergreen / 30 / 60 / 90 days / tied to a dated event or
   launch. (Defaults to 60 days in Mode C.)
8. **Capacity** — realistic hours per week. Hard-constrains Stage 5's first-30-days
   action list; lowest-ROI actions get cut until total weekly effort fits.
   (Defaults to 6h/week in Mode C.)

### Stage 2 — Ideation (generate 5+ campaign concepts across archetypes)

**Contract**
- Inputs: 8 fields from Stage 1 (especially sector, audience, competition descriptor).
- Outputs: Section 1 (Campaign Ideas) with ≥5 concepts across distinct archetypes; an explicit ask to the user to pick one or more.
- Preconditions: Stage 1 complete; sector field has a value (named or `other`).
- Postconditions: ≥5 distinct-archetype concepts presented; user has been prompted to select.
- Failure modes:
  - competitor unnamed in brief → use `[incumbent]` placeholder or category descriptor in every concept; never invent a name.
  - cannot produce 5 genuinely distinct archetypes for this audience/sector → say so plainly, present what you have, do not pad with cosmetic variants of one archetype.
  - user's brief names one dominant player but expects industry peers → do not auto-name the obvious #2/#3; use the escape-hatch phrasings from the Industry-peer rule.

Before any audit or channel work, generate **at least five distinct campaign concepts**,
drawn from different archetypes in `references/campaign-archetypes.md`. Do not converge
early. The point is to give the user a shaped menu to choose from.

For each concept, produce:

- **Name** — short, memorable, in the user's voice.
- **One-line thesis** — why this campaign works for *this* user against *this* competitor
  *right now*.
- **Archetype** — which archetype it draws from (e.g., founder-story arc, counter-narrative,
  earned-media stunt, referral flywheel, community-build, coalition play).
- **Primary channel tier** — which tier from `references/channel-tier-stack.md` this
  concept leans on (Tier 1/2/3/4).
- **Authenticity hook** — the specific real-world detail, person, story, or action that makes
  it credible and hard to fake.
- **Minimum viable version** — the smallest possible execution that proves the concept works
  in two weeks or less.

**Anti-fabrication rule for concept names, theses, and hooks.** If the user named a
specific competitor in the brief, use the name. If the user said "well-known incumbent,"
"market leader," "the dominant player," or otherwise did not name one, **do not fill in
the blank with your best guess.** Stay at the level of abstraction the brief gave you.
Use the category descriptor (e.g., "the $400-per-seat monitor"), the behavior
("the enterprise billing tax"), or a bracketed placeholder (`[incumbent]`) that the user
will fill in. Concept names like "We Quit Sentry" or "DataDog Alternative" — invented
from the category description rather than the brief — violate the Stage 1 anti-fabrication
rule and must not appear in Stage 2 output. This applies equally to SEO keyword lists,
earned-media pitch hooks, and any downstream section that inherits the concept name.

**Industry-peer rule.** The anti-fabrication rule covers *any* competitor name absent
from the brief — not only invented names, but widely-known industry peers to a
brief-named incumbent. If the brief names one dominant player (e.g., the user says
"we're outspent 100x by [market leader]"), do **not** add the obvious #2 or #3 from
the same category on your own ("LexisNexis and Westlaw," "Salesforce and HubSpot,"
"Datadog and New Relic") as if their presence were implied context. Use escape-hatch
phrasing instead: "the other major [category] platforms," "[incumbent]-class tools,"
or "the dominant [category] incumbents." This applies in every section — Stage 2
concepts, Stage 4 SEO, Stage 5 competitor saturation, Stage 5b earned-media
targets and ad-copy hooks, and any other downstream output. The discipline does
not relax in any later stage. "Everyone in the industry knows it exists" is not a
licence to name it.

After presenting the five concepts, ask the user to pick one (or more) to push through
Stage 3–5.

### Stage 3 — Asymmetry Audit

**Contract**
- Inputs: budget (user's + competitor's), or heuristic answers from `references/asymmetry-audit-table.md`; the concept(s) the user selected from Stage 2.
- Outputs: Section 3 (Spend Asymmetry Verdict) — one-sentence classification + preconditions score (0–6).
- Preconditions: Stage 2 complete; user has named one or more concepts to push forward.
- Postconditions: asymmetry classified as mild / severe / categorical; preconditions count is in {0..6}; downstream stages know which playbook scale to run.
- Failure modes:
  - 0–2 preconditions → name the missing ones, refuse the full playbook, route the user to building the missing preconditions as the campaign itself.
  - asymmetry numbers absent → ask the heuristic questions in the reference file; do not assume a level.
  - user gives competitor spend in a non-comparable form (e.g., revenue, headcount) → ask one clarifying question to convert to spend ratio; do not estimate silently.

Classify the user's spend asymmetry using the table in `references/asymmetry-audit-table.md`.

- If the user gave numbers: compute the ratio (competitor spend ÷ user spend) and map it
  to mild (1:2–1:5), severe (1:5–1:50), or categorical (1:50+).
- If the user did not give numbers: ask the heuristic questions from the reference file
  (state-backing? can they afford billboards? do they dominate your category's search ads?)
  and classify qualitatively.

Report back one sentence: `Your asymmetry is <level>. This means <what it means for your
strategy>.` Do not hedge. Do not offer a "balanced" recommendation if the user is at
categorical — it would be misleading.

Then run a **Preconditions Check**. The insurgent playbook wins when preconditions are
present; asymmetry alone is not enough. Score the user's situation against the six factors
that made the Hungarian case work (see `references/hungarian-case-study.md` for the full
mechanism). Ask or infer:

1. **Credible insider / founder-story / defector equivalent.** Is there a real person whose
   authenticity the competitor cannot manufacture?
2. **Accumulated grievance or unmet demand.** Is there anger the incumbent has ignored long
   enough that it only needs a vehicle?
3. **Consolidated challenger field.** Is the user the one clear alternative, or one of many?
   Fragmented fields dilute organic narrative.
4. **Felt pain, not abstract pain.** Does every target experience the cost directly
   (price, time, trust, service failure), or is the grievance distributed?
5. **Threshold-rewarding market / platform / system.** Does the distribution system reward
   consolidation once a share crosses some threshold (network effects, category leadership,
   algorithm-bound attention, electoral math)?
6. **Incumbent overplaying a fear / saturation hand.** Is the competitor running past the
   curve — more ads, more fear, more polished content — in a way the user can
   counter-position against?

Score 0–6. Tell the user the count plainly and what it implies:

- **5–6 preconditions:** run the insurgent playbook at full scale. Proceed to Stage 4.
- **3–4 preconditions:** proceed, but flag the missing ones as campaign sub-goals — the
  user will need to build them during the campaign (e.g., find a credible voice, surface
  the grievance) for organic to compound.
- **0–2 preconditions:** refuse to execute the playbook at full scale. **Building the
  preconditions is the campaign.** Recruit the credible voice, consolidate the coalition,
  surface and name the grievance, find the felt-pain story. Until those are present, the
  insurgent playbook will underperform and burn the volunteer/community energy it
  depends on. Say this out loud. Do not soften it.

### Stage 3a — Message-Market-Fit Gate

**Contract**
- Inputs: three yes/no signals (revenue/commitment, audience-language, close) from the user.
- Outputs: Section 3a (3 signals + 0–3 score + explicit verdict).
- Preconditions: Stage 3 complete.
- Postconditions: verdict ∈ {3/3 proceed, 2/3 validation-cycle, 0–1/3 refuse}; downstream stages know whether to proceed, insert a validation cycle, or stop.
- Failure modes:
  - **score 0–1/3 → produce only Section 3a + refusal text; do NOT generate Sections 4–11. Route the user to a discovery cycle.**
  - score 2/3 → produce Section 3a + the validation-cycle pre-task description; allow Stage 4 only after the validation cycle is named.
  - user does not know the answer to a signal → treat that signal as a "no" (absence of evidence is evidence of absence for MMF); do not skip the question.

Before assembling a channel stack, verify the campaign is solving a **distribution
problem, not an MMF problem**. Distribution amplifies signal; it cannot manufacture
it. A founder's great LinkedIn post cannot sell a product nobody wants, and a
movement's best volunteer network cannot turn out voters for a message that does not
name their pain.

Ask the user three yes/no questions. Do not skip any. If the user does not know the
answer to one, treat that as a "no" — absence of evidence is evidence of absence for
MMF.

1. **Revenue/commitment signal:** Have ≥10 people in the target audience paid,
   signed up, pre-registered, or directly asked (without your prompting) for what
   you are offering? For events: ≥10 past attendees or paid waitlist. For products:
   ≥10 customers or pre-orders. For movements: ≥10 signed volunteers/members.
2. **Language signal:** Can you name a **specific pain the audience articulates in
   their own words** before you pitch them? Not a pain you infer — a sentence
   someone in the audience has actually said, written, or posted about.
3. **Close signal:** If you asked 5 people in the target audience to commit today
   (at the intended price / format / ask level), would at least 3 say yes?

Scoring:

- **3/3 — MMF confirmed.** The campaign is a distribution problem. Proceed to
  Stage 4.
- **2/3 — Borderline.** Name the weak link and insert a **1–2 week validation
  cycle** into the plan as a pre-campaign task *before* running the full Stage
  4–5 playbook. Examples: if question 2 fails, do 5 customer discovery
  conversations and extract the language; if question 1 fails, run a paid
  waitlist or pre-order test. Revisit the MMF gate after the validation cycle.
- **0–1/3 — Refuse the full campaign plan.** MMF is the bottleneck, not
  distribution. Route the user to a discovery cycle: 5 structured customer
  conversations, a pre-order or paid-waitlist test, a small-room live demo.
  Explain plainly: *"The insurgent playbook scales trust. It cannot
  manufacture demand for a product, event, or cause people do not already
  want. Running a full campaign now will burn the volunteer/community energy
  that Stage 5 depends on. Come back when at least 2/3 of these signals are
  present."* Do not soften this. Do not produce the full Stage 4–5 deliverable.

Report the MMF verdict at the top of the Stage 3 section of the final output so
the user sees it before the channel stack.

### Stage 4 — Channel Tier Stack + 70/30 Allocation

**Contract**
- Inputs: bottleneck (Stage 1 Q6), sector (Stage 1 Q1), asymmetry verdict (Stage 3), MMF verdict (Stage 3a).
- Outputs: Section 4 (Channel Tier Stack) + Section 5 (70/30 or 80/20 Allocation).
- Preconditions: Stage 3a verdict is `3/3 proceed` OR `2/3 with validation cycle attached`. **If verdict is `0–1/3 refuse`, this stage MUST NOT execute.**
- Postconditions: primary function chosen (demand-capture / paid-amplification / trust-compounding); sector rider applied; channels listed with weekly effort estimates; allocation split stated in plain numbers.
- Failure modes:
  - asymmetry is categorical AND user requests broad cold-paid Tier 4 → refuse, route to Tier 1/2 + counter-positioning, explain the diminishing-returns curve from `references/authenticity-playbook.md`.
  - sector = `other` → flag rider mismatch in Assumptions table, proceed with the closest rider, name which rider assumptions do not apply.
  - function choice conflicts with sector rider (e.g., B2B SaaS rider biases founder-LinkedIn, function choice is demand-capture) → surface the conflict, present both paths, do not collapse silently.

**Function before cost.** Before picking channels, pick the campaign's primary function
against the user's bottleneck (from Stage 1 Q6). Use the function table at the top of
`references/channel-tier-stack.md`:

- **Demand capture** — bottleneck is "people already want this, they can't find us."
  Primary function for small or unknown challengers with addressable existing intent.
  Leads with non-brand Google Search, SEO, directory presence. Never brand-keyword
  bidding without a lift test (see Stage 5).
- **Paid amplification** — bottleneck is "our organic content works but reaches too few
  people." Primary function only *after* organic winners exist (24–48h traction gate).
  Leads with retargeting, warm lookalikes, Spark Ads on proven TikTok content.
- **Trust compounding** — bottleneck is "people find us, sometimes click, but don't
  convert, refer, or come back." Primary function for the majority of underdog
  campaigns. Leads with Tier 1: founder content, community nodes, newsletters, volunteer
  networks.

A mild-asymmetry user with a trust bottleneck should not be routed to paid amplification
just because they can afford it. Route by function first; allocate within that function
by cost/asymmetry second.

**Apply the sector rider.** After the function choice but *before* allocation, open
`references/sector-riders.md` and apply the rider matching the user's sector
(captured in Stage 1). The rider adjusts:

- **Archetype defaults** — which campaign archetypes fit this sector best (e.g.,
  cohort-education biases toward community-build + referral flywheel; B2B SaaS
  biases toward founder-LinkedIn + demand capture).
- **Channel weighting** — which Tier 1/2 channels compound fastest in this sector
  (e.g., consumer brands lean on UGC flywheels; political campaigns lean on ground
  game and counter-media; NGOs lean on volunteer networks + earned media on
  named-beneficiary stories).
- **Failure-mode warning** — the sector-specific way the insurgent playbook
  underperforms when misapplied, which becomes a standing warning in Stage 5's
  anti-vanity dashboard.

Do not overwrite the function-first choice. The rider *layers on top*. If the
rider and the function choice conflict (e.g., B2B SaaS rider biases toward
founder-LinkedIn but the function choice is demand capture), surface the conflict
and name both paths rather than collapsing to one.

If the user picked "other" for sector, flag the mismatch in the Assumptions table
and proceed with the closest rider — naming which of the rider's structural
assumptions do not apply.

Then assemble the channel stack using `references/channel-tier-stack.md`. Allocation
rules layer on top of the function choice and the sector rider:

- **Mild asymmetry** → stack can include Tier 1, 2, 3, and selective Tier 4. Allocate ~70%
  effort to organic (Tier 1 + 2), 30% to paid amplification (Tier 3, with rare Tier 4).
- **Severe asymmetry** → Tier 1, 2, and targeted Tier 3. Avoid broad Tier 4. 80/20 split
  toward organic is often safer.
- **Categorical asymmetry** → Tier 1 and 2 only. Refuse to draft broad cold-paid Tier 4
  creative — it will not work and it will burn runway. If the user insists, explain the
  diminishing-returns curve and the counter-positioning move (see `references/authenticity-playbook.md`)
  before reconsidering.

Output the stack as a prioritized list with: (a) the primary function chosen, (b) the
channels mapped to that function, (c) an estimated weekly effort commitment per channel,
(d) the 70/30 (or 80/20) split in plain numbers.

**Anti-fabrication carries through.** The Stage 2 anti-fabrication rule applies to
every element of the Stage 4 output: SEO keyword examples, long-tail query lists,
directory/review-site references, competitor saturation descriptions, and any sample
copy shown inline with the stack. If the brief did not name the incumbent, the
incumbent's proper noun must not appear in this stage **in any casing** — not
title-case ("Sentry alternative"), not lowercase ("sentry alternative"), not
hyphenated, not as part of a compound keyword or URL. Search-query examples that
would otherwise require a brand name must either retain the `[incumbent]` bracketed
placeholder for the user to fill in, or be rewritten as non-brand equivalents
("error monitoring for small teams," "application monitoring under $100/seat",
"lightweight APM for node.js"). This applies equally to Stage 5's competitor
saturation map and to every Stage 5b output section (`## 8`–`## 11`): the
banned-token discipline does not relax downstream of Stage 2.

### Stage 5 — Shape Menu + Competitor Saturation Map

**Contract**
- Inputs: selected concept (Stage 2), channel stack + allocation (Stage 4).
- Outputs: Section 6 (Competitor Saturation Map) + Section 7 (Three Alternative Campaign Shapes). **No other sections.**
- Preconditions: Stage 4 complete; allocation stated.
- Postconditions: 3 shapes presented with tradeoffs; user has been explicitly asked to pick one; turn ends.
- Failure modes:
  - **end of stage reached without a shape selection from the user → end the turn with the selection ask; do NOT produce Sections 8–11.**
  - user cannot tell a Self-story (Marshall Ganz framework) → drop the founder-led shape, present community-first / earned-media-first / search-capture-first instead.
  - brief already pre-selects a shape (rare) → confirm in one sentence, proceed to Stage 5b.

Given the selected concept + channel stack, produce **only the two items below**.
Stage 5 ends with the user picking one of the three shapes; do not generate any
of the Stage 5b output (`## 8`–`## 11`) until the selection has been made.

1. **Competitor saturation map.** Before shapes, before ad copy, before anything: for
   each of the top 2 named competitors (or top 2 competitor *categories* if the user did
   not name specific ones — see Principles), produce:

   (a) **What they saturate** — the channels, visual style, message tropes, production
   value, and emotional register the competitor is flooding. Be specific: "paid-heavy
   LinkedIn carousels with stock illustrations and growth-hack CTAs," not "social
   media ads."

   (b) **The absence that becomes your signal.** What is the competitor doing that your
   *refusal* to do becomes the positioning? Worked examples:
   - "Fidesz saturated billboards → Tisza's absence from billboards was the message."
   - "Cohort bootcamps saturate paid LinkedIn funnels + affiliate links → our refusal
     to advertise and our free open curriculum is the message."
   - "SaaS competitors saturate agency-produced demo videos → our terminal-only
     raw-footage weekly changelog is the message."

   (c) **One-sentence positioning line** the user commits to holding across the
   campaign. This is the single sentence every piece of content must reinforce.

2. **Three alternative campaign shapes** for executing the concept, with tradeoffs. Examples
   of shapes: *community-first* (start with 100 real people, grow through word of mouth),
   *earned-media-first* (one newsworthy action drives press + organic amplification),
   *search-capture-first* (dominate long-tail high-intent queries where demand already
   exists). Use the `alternative-generator` pattern — do not collapse to one recommendation
   prematurely; let the user choose. Each shape must include at least one flagship piece
   of content structured as **Self / Us / Now** (Marshall Ganz's organizing framework —
   see `references/authenticity-playbook.md`): the leader's lived experience, the shared
   community reality, and the specific time-bound ask. If the user cannot tell their Self
   story, drop the founder-led shape and route to community-first, earned-media-first, or
   search-capture-first instead.

**Stop point.** Output only sections `## 6` (Competitor Saturation Map) and `## 7`
(Three Alternative Campaign Shapes), then end the turn with an explicit request:
*"Pick one of the three shapes (or ask me to revise them) and I will produce the
First-30-Days plan, ad copy, lift-test, and anti-vanity dashboard."* Do not
generate `## 8`–`## 11` until the user names a shape. If the user's initial brief
already pre-selected a shape (rare), confirm that selection in one sentence and
proceed to Stage 5b.

### Stage 5b — Selected-Shape Plan

**Contract**
- Inputs: the *one* shape the user selected from Stage 5; capacity (Stage 1 Q8); paid-channel role from Stage 4 allocation.
- Outputs: Section 8 (First-30-Days Action List) + Section 9 (Ad Copy + Boost Rules, only if paid applies) + Section 10 (Lift-Test / Measurement Plan) + Section 11 (Anti-Vanity Metric Dashboard).
- Preconditions: Stage 5 complete AND a specific shape has been named by the user (by index or name).
- Postconditions: 30-day plan fits within stated capacity ceiling (cuts named if not); a single named lift-test template selected; track/ignore metrics enumerated.
- Failure modes:
  - **entered without a named shape from Stage 5 → ask for the selection; do NOT produce any Section 8–11 content.**
  - drafted weekly effort exceeds capacity ceiling → cut lowest-ROI actions until total fits; name the cuts explicitly.
  - earned-media targets unknown / not in brief → flag week-1 research as the action with explicit research method; do not invent outlet names.
  - paid does not apply in the channel stack → omit Section 9 entirely (do not produce empty/placeholder ad copy).
  - asymmetry categorical AND paid in stack → produce a counter-positioning refusal note in Section 9, not cold-paid creative.

Begin only after the user has picked one of the three shapes from Stage 5. If no
selection has been received, ask for it and stop. The four items below are
produced against the *one* selected shape — not all three.

1. **First-30-days action list** — concrete weekly actions for weeks 1–4, mapped to the chosen
   shape. Each action has an owner (if multiple people), an effort estimate, and a clear
   success signal.

   **Capacity is a hard constraint.** After drafting the week-by-week list, sum total
   weekly effort. If it exceeds the user's stated capacity (Stage 1 Q8, default 6h/week),
   cut the lowest-ROI actions until total effort fits inside the ceiling. Name the cuts
   explicitly: "I am cutting X and Y because the draft came to 14h/week and you said
   6h/week. These are the actions to re-add if you can carve out more time later."
   Do not ship a plan the user cannot execute.

   **Earned-media actions must be specific or flagged.** Every earned-media action in
   the list must include:
   - (a) A **named target** (e.g., "Latent Space podcast, The Pragmatic Engineer
     newsletter"), *or* an explicit "target TBD — research is the week-1 action" flag.
     Never pitch "5 podcasts in the niche" without naming them; that is not an action,
     that is a wish.
   - (b) A **one-sentence pitch hook** matched to the target's recent content — not a
     generic bio blast.
   - (c) **Success criteria** — reply, mention, guest spot, cross-post, podcast booking,
     or newsletter feature.
   - (d) **Outreach day and channel** — Tuesday morning via email, Thursday via LinkedIn
     DM, etc.

   If the skill does not know specific targets in the user's niche (because the user did
   not name them and the skill cannot invent names — see Principles), assign target
   research as the week-1 action and set success criteria for the research itself
   (e.g., "produce a ranked list of 15 targets with RSS + contact channel by Friday").

   **Community-build is a multi-week sub-campaign, not a line item.** If a Slack /
   Discord / WhatsApp / Circle community node is in the channel stack, it gets its own
   block in the first-30-days list, not one line at 1h/week:
   - **Week 0 (before public announcement):** pick the platform, write the rules, seed
     with 10 personal invites from the user's existing network. Dead rooms are worse
     than no room.
   - **Weeks 1–2:** founder posts daily for 14 consecutive days. Non-negotiable.
     Without the founder's daily presence, the community never reaches escape velocity.
   - **Weeks 3–4:** hand off three recurring rituals (weekly thread, AMA cadence, member
     spotlight) to 2–3 engaged early members. If no members step up, the community will
     die when the founder stops; surface this as a validation failure, not a staffing
     problem.
   - **Month 2+:** budget 3–4h/week sustained — moderation, weekly post, member welcomes,
     pruning dead accounts. Underinvest and the community dies.

2. **Ad copy + boost rules** — *only* if paid has a role in the chosen stack:
   - Creative direction in the user's authentic voice (see `references/authenticity-playbook.md`).
   - The explicit **24–48h organic traction gate**: do not boost a post until it has
     demonstrated genuine organic signal (saves, shares, sustained watch time, thread-depth
     comments — not raw likes). Likes are cheap and lie.
   - Audience definition: warm retargeting first, lookalikes second, cold audiences only for
     proven winners with a lift-test plan attached.
   - Frequency cap and creative refresh cadence to avoid fatigue (see ad fatigue section in
     `references/channel-tier-stack.md`).
   - **Do not bid on your own brand-name keywords without a lift test.** Blake, Nosko &
     Tadelis's eBay field experiment (2015) found weak or no incremental lift from brand-
     keyword bidding — the traffic arrives organically anyway. Platform-reported ROAS on
     brand keywords is always excellent *because* the traffic would have converted
     regardless. This is one of the most reliable ways established brands waste paid
     budget. If the user is already bidding on their own brand, require a
     brand-keyword holdout test (Template 5 in `references/lift-test-templates.md`)
     before continued spend.
   - If asymmetry is categorical, refuse to produce broad cold-paid copy. Offer Tier 1/2
     content instead and explain why.

3. **Lift-test / measurement plan** — mandatory, no exceptions. One concrete experiment
   using the templates in `references/lift-test-templates.md`. Template selection:
   - **Budget exists:** Template 1 (geo-holdout) or Template 2/3 (conversion-lift).
   - **Tiny budget (<€5k), formal templates underpowered:** Template 4 (micro-lift).
   - **Brand-keyword bidding already in play:** Template 5 (brand-keyword holdout).
   - **Zero budget:** Template 6 (organic-source attribution) — directional, UTM-tagged,
     30-day window, per-channel conversion-rate ranking, cut-the-bottom-20%-reinvest-
     in-the-top decision rule.
   Specify:
   - The hypothesis (paid channel X drives incremental action Y on top of organic
     baseline — or, for Template 6, *"channel X outperforms channel Y on conversion rate
     per unique visitor"*).
   - Control vs. test group definition (or channel-comparison definition for Template 6).
   - Holdout percentage, duration, and minimum sample size.
   - The incremental metric (not attributed; not platform-reported ROAS). For Template 6,
     per-channel conversion rate, with the explicit caveat that it is directional only.
   - The decision threshold: what lift level justifies continued spend, what level means
     stop. For Template 6: top channel → double effort; bottom <20% → drop.

4. **Anti-vanity metric dashboard** — the short list of metrics the user should track and
   the longer list of metrics they should explicitly ignore. Examples:
   - Track: saves, shares, sustained watch time, signed-up volunteers/subscribers,
     incremental conversions from the lift test, word-of-mouth referrals.
   - Ignore: impressions, CPM, follower count, raw likes, platform-reported attributed
     ROAS, vanity engagement rate without segmentation.

## Output Template

Produce the final deliverable in this exact order so the user can scan it and act:

```
# Insurgent Campaign Plan — <user / project name>

## 0. Assumptions  (required under Mode C — default mode; omit under Mode A/B)
<table: field → assumed value, flagging every default applied from Stage 1 so the user can confirm or adjust inline at the end>

## 1. Campaign Ideas (5+ concepts across archetypes)
<concepts with thesis, archetype, primary tier, authenticity hook, MVP>

## 2. Selected Concept
<the one (or more) the user picked>

## 3. Spend Asymmetry Verdict
<mild / severe / categorical, one sentence explaining what it means>

## 3a. Message-Market-Fit Gate
<3-question score, verdict (confirmed / borderline / failed), and — if borderline or failed — the validation cycle the user must run before proceeding>

## 4. Channel Tier Stack
<prioritized channel list with weekly effort>

## 5. 70/30 (or 80/20) Allocation
<organic % / paid %, with rationale>

## 6. Competitor Saturation Map  (Stage 5 output)
<per competitor: what they saturate, the absence that becomes your signal, one-sentence positioning line>

## 7. Three Alternative Campaign Shapes  (Stage 5 output — end the turn here; await shape selection)
<three shapes with tradeoffs>

## 8. First-30-Days Action List  (Stage 5b output — only after shape selection)
<week 1–4 concrete actions, scaled to stated capacity with cuts named>

## 9. Ad Copy + Boost Rules  (Stage 5b output, if paid applies)
<creative direction + 24–48h gate + frequency cap + refusal note if categorical>

## 10. Lift-Test / Measurement Plan  (Stage 5b output)
<one concrete experiment with threshold>

## 11. Anti-Vanity Metric Dashboard  (Stage 5b output)
<track list / ignore list>
```

**Completeness — do not compress the final deliverable.** This is the payload, not a
summary of it; the user should never have to run follow-up rounds to pull out the full
plan. Fill every applicable section in full prose, not headline fragments. For each
recommendation include the *why* — the mechanism, the tradeoff, the diminishing-returns
or authenticity logic behind it — not just the conclusion; the reasoning is what lets the
user hold the discipline after the run ends. Concretely: each campaign concept carries its
full thesis + archetype + primary tier + authenticity hook + MVP; the channel stack names
weekly effort per channel; the action list spells out week-by-week actions with the cuts
named; the lift test states hypothesis, control/test groups, duration, incremental metric,
and decision threshold. Brevity in *structure* (scannable headings, tables) is the goal;
brevity in *content* is a failure. If a section does not apply (e.g. no paid in the stack),
state why in one line rather than dropping it silently.

## Principles to Hold Throughout

- **Do not sell reach as persuasion.** Reach above the first 5–6 impressions does not persuade;
  it annoys. Say this out loud when recommending frequency caps.
- **Do not propose broad cold-paid as a primary channel for severe or categorical asymmetry.**
  It will not work. Refuse and explain the alternative.
- **Do not generate content that impersonates authenticity the user does not have.** If there
  is no real founder, no real volunteer network, no real earned-media hook, say so and
  propose how to build one — do not fake it with AI-generated "real-looking" content.
- **Do not accept platform-reported ROAS as proof.** Insist on an incremental lift test.
  Platforms are graded on attributed conversions; the user is graded on actual lift.
  Academic field experiments (Lewis & Rao 2015, QJE) show digital ad ROI confidence
  intervals are so wide most campaigns cannot be distinguished from zero. Meta and Google
  ship Conversion Lift / Brand Lift precisely because they admit this. Cite the work when
  a user pushes back.
- **Always produce alternatives, not a single recommendation.** The user has information you
  do not; give them a shaped menu and let them choose.
- **Explain the why.** When refusing a paid push or a channel, explain the diminishing-returns
  curve, the counter-positioning move, or the fatigue dynamic. A user who understands the
  mechanism will hold the discipline after the skill run ends.
- **Do not invent specifics the user did not give.** No made-up competitor names, no
  fabricated budgets, no invented past-campaign references, no hallucinated podcasts or
  newsletters in the user's niche. If the user did not name them, stay abstract ("cohort-
  based courses in the category," "mid-size SaaS competitors with paid-growth teams") and
  say what you are doing: "I am describing competitors at the category level because you
  did not name specific ones — name them if you want sharper positioning."
- **Vague earned-media targets produce vague results.** Force specificity (named target,
  matched hook, success criteria, outreach day) or flag research as a week-1 action.
  "Pitch 5 podcasts" is not a plan.
- **A plan the user cannot execute is not a plan.** Respect stated weekly capacity;
  name the cuts required to fit inside it. A 6h/week plan that succeeds beats a 14h/week
  plan that collapses in week 3.
- **If MMF is failing, the campaign is the wrong problem to solve. Say so.** Distribution
  amplifies signal; it cannot manufacture it. If the MMF gate (Stage 3a) returns 0–1 / 3,
  refuse the full campaign plan and route the user to a discovery / validation cycle.
  Running a full insurgent campaign against a broken offer burns the volunteer,
  community, and founder-attention capital the playbook depends on.
- **Do not over-generalize the Hungarian case.** Organic beats paid saturation *when
  preconditions are present*: credible insider, accumulated grievance, consolidated
  challenger, felt pain, threshold-rewarding system, overplayed incumbent. Absent most of
  these, the playbook alone will not win — name the missing preconditions and recommend
  building them first.
- **Propaganda and paid advertising sit on the same curve.** Troll farms, state
  disinformation, and commercial ad buys all operate on one diminishing-returns curve and
  all face the same authenticity collapse at saturation. You can buy reach; you cannot buy
  belief; above a threshold, buying more reach makes belief harder. The troll farms have
  not gone away — they have learned this lesson too and will adapt (smaller networks,
  embedded authenticity, parasocial mimicry). Design for the adapted adversary, not the
  2020-era one: lean on verifiable authenticity (real people, real places, real time),
  narrative coherence, and provenance signals the adversary cannot manufacture without
  being caught.

## Failure Modes Quick Reference

One-page summary of the per-stage Contracts above. Use this when reviewing an
output to check whether a declared failure-mode action was actually taken.

| Stage | Trigger | Required action |
|---|---|---|
| 1 | Always-capture field missing under Mode C | Ask in the question batch; do not default silently |
| 1 | Missing field changes Stage 3 / Stage 4 outcome | Escalate into the batch even if normally defaulted |
| 2 | Competitor unnamed in brief | Use `[incumbent]` / category descriptor; never invent |
| 2 | Cannot generate 5 distinct archetypes | Say so; present what you have; do not pad |
| 3 | Preconditions score 0–2 | Refuse full playbook; route to building preconditions |
| 3 | Asymmetry numbers absent | Ask heuristic questions; do not assume a level |
| 3a | **MMF score 0–1/3** | **Produce only Section 3a + refusal; STOP — do not generate Sections 4–11** |
| 3a | MMF score 2/3 | Insert validation cycle before Section 4 |
| 3a | User does not know a signal | Treat as a "no" |
| 4 | Categorical asymmetry + broad cold-paid request | Refuse; route to Tier 1/2 + counter-positioning |
| 4 | Sector = `other` | Flag rider mismatch; proceed with closest rider |
| 4 | Function ↔ sector-rider conflict | Surface both paths; do not collapse silently |
| 5 | **End of stage without shape selection** | **Repeat the ask; STOP — do not produce Sections 8–11** |
| 5 | User cannot tell Self-story | Drop founder-led shape; route to community / earned-media / search |
| 5b | Entered without named shape | Ask for selection; do not produce any Section 8–11 |
| 5b | Drafted effort exceeds capacity | Cut lowest-ROI actions; name the cuts |
| 5b | Earned-media targets unknown | Flag week-1 research with method; do not invent outlets |
| 5b | Paid does not apply in stack | Omit Section 9; do not produce placeholder copy |
| 5b | Categorical asymmetry + paid in stack | Produce counter-positioning refusal in Section 9, not cold-paid creative |

## References (read when relevant)

- `references/campaign-archetypes.md` — 15+ archetypes the ideation engine draws from.
- `references/asymmetry-audit-table.md` — decision table for classifying spend asymmetry.
- `references/channel-tier-stack.md` — Tier 1–4 channels with 2025–2026 benchmark data.
- `references/authenticity-playbook.md` — founder voice, kitchen-table framing,
  counter-positioning, narrative coherence.
- `references/lift-test-templates.md` — six lift-test templates (geo-holdout, conversion-lift, synthetic-control, micro-lift, brand-keyword holdout, zero-budget UTM).
- `references/sector-riders.md` — six sector-specific overlays applied in Stage 4.
- `references/hungarian-case-study.md` — Tisza vs. Fidesz 2026 worked example.


## REF: references/asymmetry-audit-table.md

# Asymmetry Audit Table

Stage 3 of `SKILL.md` uses this table to classify the user's spend gap against their
competition. The classification drives everything downstream — channel stack, allocation,
ad-copy decisions, refusal rules.

## The three levels

| Level | Ratio (competitor : user) | What it looks like | Primary channel stance |
|---|---|---|---|
| **Mild** | 1:2 to 1:5 | They spend 2–5× what you spend. Typical incumbent vs. challenger. | Hybrid: full Tier 1–3 stack, selective Tier 4 with lift tests. |
| **Severe** | 1:5 to 1:50 | They spend 5–50× what you spend. Typical startup vs. well-funded competitor, NGO vs. corporate, challenger party vs. establishment. | Organic-led: Tier 1–2 heavy, targeted Tier 3, avoid broad Tier 4. |
| **Categorical** | 1:50+ (or non-comparable — state capture, foreign support, infinite pockets) | You cannot be in a spending race at all. Different game entirely. | Full asymmetric: Tier 1–2 only, volunteer/community networks, earned media, counter-positioning. Refuse broad cold-paid. |

## If the user gave numbers

Compute `competitor monthly spend ÷ user monthly spend`. If the user gave annualized numbers,
convert. If the user gave lifetime numbers (e.g., "we have $50k total"), ask for their
runway in months and divide.

Edge cases:
- **User is bootstrapping with $0 ad budget.** Ratio is infinite — treat as categorical.
- **Competitor's "budget" includes state media, regulatory capture, or foreign support.**
  Treat as categorical regardless of direct spend comparison.
- **User has more budget than competitor but is losing.** Asymmetry is not the bottleneck —
  something is wrong with product, message, or channel fit. Re-interview before prescribing.

## If the user did not give numbers

Ask these heuristic questions and classify qualitatively:

1. **Can the competitor afford billboards in your market?** Yes → at least severe.
2. **Do they dominate paid search in your category?** Yes → at least severe.
3. **Are they running influencer deals worth five figures a month?** Yes → severe or
   categorical.
4. **Do they have state backing, regulatory capture, or government-adjacent funding?**
   Yes → categorical.
5. **Is there a national TV campaign, a presence at every major industry event, or
   pre-installed distribution (default search engines, partnerships with distributors)?**
   Yes → categorical.
6. **Can you realistically match even 20% of their monthly paid spend for the next six
   months?** No → severe at minimum.

If the user answers "no" to most of these, they are probably in mild asymmetry territory.
If "yes" to 3–4, severe. If "yes" to 5–6, categorical.

## Mild asymmetry — playbook summary

- Full hybrid stack is on the table.
- 70% effort to organic (Tier 1–2), 30% to paid (Tier 3, rare Tier 4).
- Pay for Tier 3 only after Tier 2 content has demonstrated organic traction (24–48h gate).
- Run lift tests on any Tier 4 spend. Kill broadcast-style Tier 4 that does not clear
  the threshold in the lift-test templates.
- Competitive advantage: speed and specificity. Move faster than the incumbent; speak to
  specific segments the incumbent is too broad to address.

## Severe asymmetry — playbook summary

- Organic-led. 80/20 in favor of organic is often safer than 70/30.
- Tier 1 and Tier 2 do the heavy lifting. Tier 3 is used surgically — warm retargeting,
  long-tail search, amplification of proven Tier 2 winners only.
- Avoid broad Tier 4 (cold Meta, generic search, display). The CPA and lift-test math
  does not work at this ratio.
- Competitive advantage: authenticity and narrative. You cannot outspend; you can
  outspecify. Concentrate on a narrow audience that the competitor cannot address
  because they are too broad.
- Measurement: run a lift test before *any* paid spend, not after. Use geo-holdouts.

## Categorical asymmetry — playbook summary

- Tier 1 and Tier 2 only. Broad paid is off the table.
- Build the thing the competitor cannot buy: volunteer networks, community nodes,
  earned media, founder-led narrative, door-to-door or direct-contact tactics.
- Counter-position. When the competitor saturates a channel, their saturation is your
  signal-cut-through — your absence from billboards becomes a message.
- Measurement: lift tests are still mandatory, but the metrics shift — incremental
  signups, volunteers, attendees, donors. Not CPA on cold Meta.
- **Refuse broad cold-paid.** If the user insists, explain the diminishing-returns
  curve and the Hungarian case study (see `hungarian-case-study.md`) before
  reconsidering. Most users will change their mind once they see the curve.

## How to report the verdict

Tell the user in one sentence, not a paragraph:

> "Your asymmetry is **severe** (competitor spends ~15× what you spend). This means we
> will lead with organic Tier 1–2 channels, use paid only as surgical amplification of
> proven organic winners, and run a lift test before any broad paid spend."

Then move to Stage 4.


## REF: references/authenticity-playbook.md

# Authenticity Playbook

In high-saturation media environments, the scarce resource is not reach — it is
credibility. Paid messages are automatically suspect; unpolished, personal, specific
content carries an authenticity signal that paid production cannot buy. This playbook
describes the concrete patterns that produce that signal, with failure modes to avoid.

## The Organic Viral Funnel

Zero-budget campaigns defeat massive paid structures by running a self-sustaining loop
that the paid funnel cannot imitate:

1. **Authentic Content** — unpolished, DIY messages resonate deeply with audiences fatigued
   by slick, paid propaganda. The format itself communicates "this is real, not bought."
2. **Algorithmic Boost** — high initial engagement rates (watch time, comments, shares)
   force platforms like TikTok and Instagram Reels to push the content into For You feeds,
   reaching audiences far beyond existing followers.
3. **Community Share** — users voluntarily share the content into dark social channels
   (WhatsApp, Messenger, private groups) where ad blockers and feed algorithms do not
   apply. This is where real persuasion happens.
4. **High-Impact Action** — the organic trust accumulated through the first three stages
   converts into real-world action (votes, purchases, signups, donations) at rates that
   paid ads cannot match because they never earned the trust in the first place.

The loop is self-reinforcing: impact actions become new authentic content (testimonials,
outcomes, stories), which feeds the next cycle. The paid funnel, by contrast, is
extractive — it pulls attention out of the system without replenishing trust.

## Patterns that produce authenticity

### Founder / leader voice, first person

The strongest trust signal is a real person speaking as themselves. Not "we at Acme believe"
but "I think." Not a brand account with a logo avatar but a person with a face. The format
reads as trustworthy before any content is parsed.

**Before:** "Acme is excited to announce our new product launch!"
**After:** "I've been working on this for eight months. Here's the ugly prototype we
started with, and here's what it turned into."

### Unpolished > polished (when trust is scarce)

Production value in 2026 reads as suspicious. Too-clean video, perfect lighting, obviously
scripted delivery — audiences now interpret these as "someone paid for this," which
automatically lowers trust. Rough phone footage of a real moment outperforms an agency-produced
ad in most underdog contexts.

This does *not* mean "be sloppy." It means: let real things look real. Shoot in the kitchen,
the workshop, the van, the office — not the studio. Use natural audio. Keep mistakes in when
they are human, not when they are disqualifying.

### Kitchen-table framing

Reframe serious content in informal, domestic, everyday settings. The podium, the flag, the
suit, the conference room — these are visual markers of a gap between speaker and audience.
The kitchen table, the car, the walk around the neighborhood — these close the gap.

For commercial contexts: CEO talking to camera from their actual desk about an actual
problem their actual customer reported today, not from a green-screen stage at an
all-hands.

### Specificity beats polish

Specific details — numbers, names, dates, places, quotes — carry trust weight that polished
language does not. "Revenue is up" is noise. "Revenue is up 34% quarter-over-quarter,
driven mostly by [specific customer segment] after we changed [specific thing]" is signal.

Audiences can tell when you know what you are talking about vs. when you are being vague
because you have to be. Lean into the details you can share.

### Narrative coherence over breadth

One clear message repeated across formats beats five different messages trying to appeal
to five different segments. Narrative coherence is what makes a campaign rememberable —
the audience can summarize what you are about in one sentence. Fragmented messaging
produces no memory at all, regardless of spend.

When reviewing draft content, ask: "Can the user summarize this campaign in one sentence?"
If not, cut until they can.

## The Story of Self / Us / Now Framework (Ganz)

Marshall Ganz's Harvard Kennedy School organizing framework — used by the Obama 2008
field campaign, most modern movement campaigns, and (on the available evidence) Péter
Magyar's Tisza content in 2025–2026 — is the single best named structure for authentic
campaign content. Every major piece of content should contain three elements:

- **Self** — why I personally care. The founder's, leader's, or speaker's concrete lived
  experience that makes this issue matter to them. Not an abstract belief, a specific
  moment. "My grandmother couldn't read her hospital discharge letter because it was in
  English and she only spoke Hungarian" is a Self story. "Healthcare accessibility is a
  core value" is not.

- **Us** — shared values and experiences of the community being addressed. What the
  speaker and the audience have in common — the lived reality that connects them. "We've
  all sat in that waiting room watching someone we love get worse while the form got
  longer" is an Us frame. It names the collective experience without lecturing.

- **Now** — the urgent choice, the specific action, the moment. What must be done, by
  whom, before when. "Sign up by Friday to volunteer at the Saturday distribution."
  "Share this with three people who've been through the same thing." "Pre-order before
  the 15th or we don't hit the manufacturing threshold." Concrete and time-bound.

### Why it works

Self gives the audience permission to trust the speaker — they are not performing
expertise, they are sharing experience. Us gives the audience a place in the story —
they are not being sold to, they are being recognized. Now gives the audience something
to do — without it, the emotional buildup dissipates. Skipping any of the three breaks
the structure.

### Failure modes

- **Skip Self → corporate-speak.** "Our company is committed to inclusive healthcare"
  reads as paid messaging. Audiences tune out within seconds.
- **Skip Us → narcissism.** "I went through this. I figured it out. I can teach you."
  Reads as a personal brand pitch, not a movement. No coalition forms around it.
- **Skip Now → inspiration porn.** Beautiful story, no action. The audience feels
  something, shares nothing, does nothing. Trust accumulates but never converts.
- **Do all three but rush them.** Each element needs room. A 15-second TikTok can do all
  three; a 45-minute keynote can too. A 3-minute video that does each for 30 seconds
  and transitions without breath does none of them well.

### Examples across contexts

**Startup founder launching a product:**
- *Self:* "I spent six years watching my team waste 40% of every day on status meetings
  that could have been a 2-line update."
- *Us:* "Every engineering team I talk to has the same problem — the ceremonies exist
  because no one trusts the async layer to work."
- *Now:* "We're opening the beta for 100 teams this Thursday. If this sounds like your
  problem, the link is in my profile."

**Nonprofit fundraising campaign:**
- *Self:* "The first night I slept in our shelter, there were four people I'd walked past
  every day for two years on my commute and never said hello to."
- *Us:* "Most of us live in a city where we have learned not to see each other. That
  habit is the problem."
- *Now:* "We need 200 new monthly donors by the end of March to keep the overnight
  program open through next winter. Here is the link."

**Political candidate / cause-led campaign:**
- *Self:* "I was inside Fidesz. I saw how the money moved. I left because I could not
  stay."
- *Us:* "Every Hungarian family has watched the hospital queue get longer and the
  teacher's pay stay the same."
- *Now:* "Come to the Saturday rally. Bring your neighbor. This is the election."

### In Stage 5

When the skill generates the three alternative campaign shapes in Stage 5, each shape
must include at least one flagship piece of content structured as Self / Us / Now — and
the first-30-days action list must have a clear slot for drafting it. If the user cannot
tell their Self story, the campaign does not have a founder-led shape available and the
skill should route to a different concept (community-first, earned-media-first, or
search-capture-first).

### Counter-positioning

This playbook pattern is operationalized in `SKILL.md` Stage 5 item 1 — the
Competitor Saturation Map forces the user to name (a) what the competitor saturates,
(b) the absence that becomes the user's signal, and (c) the one-sentence positioning
line they commit to holding across the campaign. Treat this section as the reference
material the Stage 5 step pulls from.

When a competitor saturates a channel with paid content, their saturation *is* your
signal-cut-through. Audiences develop ad blindness on over-saturated channels. Your
organic presence cuts through precisely because it does not look like everything else.

Examples:
- Competitor runs nonstop TV ads → your absence from TV becomes a message ("we don't
  waste donor money on ads").
- Competitor floods paid search → your founder-led LinkedIn content ranks in AI search
  summaries.
- Competitor blasts Instagram with polished Reels → your unpolished TikToks feel like a
  relief from the slop.

Counter-positioning is not about being contrarian for its own sake. It is about noticing
where the audience's patience has run out and offering the opposite.

## Patterns to avoid

### AI-generated "authentic-looking" content

Audiences detect AI slop faster every month. Auto-generated video, synthetic voiceovers,
AI-written "personal" posts, fabricated testimonials — these all trip the uncanny-valley
response and destroy trust retroactively even when they are good enough to pass initially.

If you are using AI to help draft, the draft must be rewritten in a real voice by a real
person with real context. AI for speed, human for voice.

### Performative relatability

"Cringe" content — a CEO awkwardly doing a TikTok trend, a brand forcing itself into a
meme it does not understand — signals the opposite of authenticity. The audience reads
it as "this person is not like me; they are pretending to be like me, which means they
think I am dumb."

Rule: if you are not naturally on the platform, do not try to be a native. Use the
platform in the way that is honest to your actual role.

### Generic brand voice in a personal-content moment

If the audience expects a person (founder newsletter, creator livestream, community
AMA), delivering corporate-speak is a trust collapse. Switch registers. "The team is
excited to share" is appropriate on a press release, not in a founder's Friday update.

### Over-production in a moment that calls for speed

Launch moments, response-to-news moments, crisis-response moments all reward speed over
polish. A same-day video addressing an issue, even rough, outperforms a week-later
polished response. By the time production is done, the audience has moved on.

### Fake scarcity and fake urgency

"Only 3 spots left!" when there are actually 300 destroys credibility the moment a user
checks. The short-term conversion lift is smaller than the long-term trust cost.

## Authenticity requires a real base

The hardest truth in this playbook: authenticity patterns amplify whatever is true. If
the founder is not a compelling person, founder-led content will not work. If there is
no community, community content will not work. If the product does not solve a real
problem, specificity will expose that.

When a user asks the skill to generate "authentic" content for something that does not
actually have a real base, the right answer is: **don't fake it, build it.** Propose
how to build the real base (hire or develop a spokesperson, seed a community of 100
real users, fix the product gap) before producing any content.

## How this playbook feeds `SKILL.md`

Stage 5's ad copy section should pull from this playbook: founder voice, specific
details, kitchen-table framing, counter-positioning. Stage 2's ideation engine should
check every proposed concept against the authenticity hook — is there a real detail,
real person, real story the concept depends on? If not, the concept is probably vanity
and should be replaced.


## REF: references/campaign-archetypes.md

# Campaign Archetypes

The ideation engine in `SKILL.md` Stage 2 draws from this catalog. Every campaign run
should generate at least five concepts from *different* archetypes — not five variants
of the same archetype. The point is to widen the menu before narrowing.

For each archetype below: when it fits, channel tier it leans on, the authenticity hook
it needs to work, a failure mode to avoid, and the sectors where it compounds fastest.

**Sector overlay.** Stage 4 applies the matching sector rider from
`references/sector-riders.md` on top of the archetype choice. The archetype → sector
fit notes below are defaults, not rules — an NGO can run a founder-story arc, a
personal brand can run a coalition play — but running against the default fit
requires a deliberate reason. Surface the mismatch when it happens.

| Archetype | Best-fit sectors |
|---|---|
| Awareness Push | consumer-brand, personal-brand |
| Launch Push | cohort-education, b2b-saas, consumer-brand |
| Fundraising Drive | ngo, political-civic, cohort-education (scholarship / bursary) |
| Mobilization / Turnout | political-civic, ngo |
| Community-Build | cohort-education, personal-brand, b2b-saas (dev-tools) |
| Counter-Narrative | political-civic, ngo, b2b-saas (category-creation) |
| Referral Flywheel | consumer-brand, cohort-education, b2b-saas (PLG) |
| Founder-Story Arc | b2b-saas, personal-brand, political-civic |
| Coalition Play | ngo, political-civic, cohort-education (multi-instructor) |
| Earned-Media Stunt | consumer-brand, political-civic, ngo |

---

## 1. Awareness Push
**Fits when:** A new product, service, or cause needs to exist in public mind for the first
time.
**Channel tier:** Tier 2 (earned media, creator content) + Tier 1 (founder voice).
**Authenticity hook:** A specific, concrete story — a first user, a founding moment, a clear
problem description. Vague "we help businesses grow" awareness is invisible.
**Failure mode:** Broad paid reach with no narrative. Impressions accumulate; nothing converts.

## 2. Launch Push
**Fits when:** A defined moment (product ship, policy rollout, campaign kickoff) needs
compressed attention.
**Channel tier:** Tier 1 + Tier 2, with Tier 3 boosts on the day-of.
**Authenticity hook:** A visible milestone — something new, something different, something
that was not there yesterday.
**Failure mode:** Treating "launch" as a month of social posts. A launch is a moment, not
a drip.

## 3. Fundraising Drive
**Fits when:** A campaign (nonprofit, political, crowdfunded product, mutual aid) needs
money by a deadline.
**Channel tier:** Tier 1 (direct ask from leader to warm list) + Tier 2 (peer-to-peer
sharing). Paid only as retarget of warm list.
**Authenticity hook:** A specific use of funds — "€50 buys a week of X" or "500 more
donors unlocks a matching grant." Abstract "support our mission" under-converts.
**Failure mode:** Broad cold-paid fundraising. Burns the budget before converting anyone.

## 4. Movement Mobilization
**Fits when:** Turnout, sign-ups, or physical action is the outcome — not awareness.
**Channel tier:** Tier 1 heavy (community nodes, local chapters, volunteer networks),
Tier 2 for amplification.
**Authenticity hook:** Peer-to-peer invitation. People show up when people they know
ask them. Ads do not produce turnout; networks do.
**Failure mode:** Spending on reach when the problem is conversion from interest to action.
Fix the ask, the ease, and the peer pressure before buying more impressions.

## 5. Re-Engagement
**Fits when:** There is a dormant audience (old newsletter list, lapsed customers, former
supporters) and the cost of waking them is lower than the cost of finding new people.
**Channel tier:** Tier 1 (direct, 1:1 or small-segment email / DM) + Tier 3 (warm
retargeting).
**Authenticity hook:** "I noticed you haven't been around. Here is what changed." Honest
acknowledgment beats a generic "we miss you" sequence.
**Failure mode:** Treating re-engagement as a drip campaign. A single honest message
outperforms a 5-touch sequence.

## 6. Trust-Rebuilding
**Fits when:** There was a failure, a controversy, a gap between promise and delivery,
and credibility needs to be earned back.
**Channel tier:** Tier 1 only. Paid amplification of a trust apology is usually
counter-productive (looks like spin).
**Authenticity hook:** Specific acknowledgment of what went wrong, what changed, and what
the user will see differently now. No passive voice. No "mistakes were made."
**Failure mode:** Launching a feel-good campaign before the underlying issue is fixed.
Audiences can tell.

## 7. Counter-Narrative
**Fits when:** A competitor, incumbent, or adversary is saturating a message that is
misleading, outdated, or vulnerable to a specific counter.
**Channel tier:** Tier 1 + Tier 2. Counter-narrative is almost always organic — paid
counter-ads look like mudslinging.
**Authenticity hook:** A concrete contradiction — a number, a document, a lived experience
the adversary cannot match.
**Failure mode:** Mirroring the adversary's aggression. Counter-positioning works by being
*different*, not by being louder.

## 8. Community-Building
**Fits when:** Long-term retention, word of mouth, and compounding trust are the goals.
Slow. Non-negotiable for most B2B SaaS, creator businesses, NGOs with a donor base.
**Channel tier:** Tier 1 (Slack/Discord/Circle/WhatsApp, local chapters, user groups).
**Authenticity hook:** A reason to gather that is not just your product — an interest,
a cause, a shared practice.
**Failure mode:** Building a "community" that is a broadcast channel in disguise. If the
leader posts and nobody replies, it is not a community.

## 9. Earned-Media Stunt
**Fits when:** One newsworthy action can drive more press and organic amplification than
a year of ad spend.
**Channel tier:** Tier 2 (press, reshares), Tier 1 (founder voice documenting it).
**Authenticity hook:** The stunt must be real — a real action, real consequences, real
stakes. Publicity stunts with no substance burn more trust than they build.
**Failure mode:** Confusing "creative" with "newsworthy." Most creative ideas are not news.

## 10. Referral Flywheel
**Fits when:** The product is something people are already quietly recommending (or would
if given a small nudge).
**Channel tier:** Tier 1 (word of mouth, referral mechanics).
**Authenticity hook:** A reward that is aligned with why the referrer actually shares —
sometimes a discount, often just status or reciprocity.
**Failure mode:** Paying for referrals that would have happened anyway. Measure lift,
not volume.

## 11. Door-to-Door / Localized
**Fits when:** Geography matters — local business, political district, regional product
rollout, market-by-market expansion.
**Channel tier:** Tier 1 (in-person, local partnerships, local press).
**Authenticity hook:** A local face, local language, local reference. A national brand
showing up locally without adaptation reads as extractive.
**Failure mode:** Scaling localized tactics into national templates. The thing that works
in one town is usually the thing *specific* to that town.

## 12. Founder-Story Arc
**Fits when:** The founder or leader is the most credible, most interesting, or most
distinctive asset the organization has.
**Channel tier:** Tier 1 (founder personal accounts on LinkedIn / X / Substack / TikTok).
**Authenticity hook:** A specific, non-generic story — why *you*, why *now*, what you
know that others do not.
**Failure mode:** A brand account that pretends to be a person. Users can smell the
"we" in a supposedly personal post.

## 13. Seasonal / Event-Tied
**Fits when:** An external date (holiday, anniversary, industry event, election) creates
attention the campaign can ride.
**Channel tier:** Tier 1 + Tier 2, with tight time boxes.
**Authenticity hook:** A real reason to care about the date — not "here is a holiday
promotion" but "here is what this date means to us."
**Failure mode:** Jumping on every calendar event. Audiences tune out brands that
celebrate every National Day of Anything.

## 14. Coalition / Partnership Play
**Fits when:** Two or more organizations with non-competing audiences can trade credibility.
**Channel tier:** Tier 1 + Tier 2 (joint events, co-written content, cross-newsletter
swaps).
**Authenticity hook:** A genuine shared interest — not just an audience swap. The coalition
must make sense to both audiences, not just to the partners.
**Failure mode:** Logo partnerships that neither partner promotes seriously. Either commit
to the joint push or skip it.

## 15. Product-Led Growth
**Fits when:** The product itself distributes the product — signatures, shareable artifacts,
invites, public output, viral loops baked into the core experience.
**Channel tier:** Tier 1 (product as its own channel) + Tier 2 (user-generated content).
**Authenticity hook:** The shareable moment is real and valuable to the sharer — not a
forced "invite 3 friends" gate.
**Failure mode:** Bolting share mechanics onto a product nobody actually wants to show
off. If users do not share organically, do not force them to.

## 16. Cause-Led
**Fits when:** A brand or organization has a real position on a real issue that its
audience cares about — and is willing to lose some audience over it.
**Channel tier:** Tier 1 + Tier 2. Paid cause-led is usually ineffective and often
backfires.
**Authenticity hook:** A record. You cannot suddenly be cause-led in a crisis; audiences
check history.
**Failure mode:** Performative activism during a trending moment. Retreating when it gets
hard is worse than never having said anything.

---

## Using this catalog in ideation

When generating five concepts in Stage 2 of `SKILL.md`, deliberately mix archetypes to
give the user a shaped menu:

- At least one **Tier 1-heavy** (community, door-to-door, founder-story).
- At least one **earned-media or counter-narrative** concept.
- At least one **product-led or referral-flywheel** concept if the product supports it.
- At least one **launch or seasonal** concept if there is a date.
- At least one **mobilization or re-engagement** concept if the bottleneck is action,
  not awareness.

Skip archetypes that do not fit the user's situation — if the user has no existing
audience, re-engagement is not on the menu. The point is range *within* fit, not
box-ticking.


## REF: references/channel-tier-stack.md

# Channel Tier Stack

Ranked by cost-effectiveness for resource-constrained campaigns. The Hungarian Tisza
campaign and the 2025–2026 commercial ad benchmarks both converge on this ranking.
Stage 4 of `SKILL.md` uses this to assemble the channel plan.

---

## Function first, cost second

Before picking a channel, pick its *function*. Channels exist to do one of three things,
and the most common failure in underdog campaigns is using a channel for the wrong
function — paying for demand capture when the bottleneck is trust, or running organic
when the bottleneck is awareness and demand is already addressable.

| Function | What it does | Best-fit channels | When to use |
|---|---|---|---|
| **Demand capture** | Meet existing demand at the moment someone is looking | Google Search (non-brand, long-tail), Bing Search, SEO content for intent queries, directory listings | The user's bottleneck is *getting found when people already want the thing*. Demand exists; the job is not to create it, only to capture it. Strongest for lesser-known challengers on non-brand queries. **Weak for brand-keyword bidding** — traffic arrives organically anyway (see Template 5 in `lift-test-templates.md`). |
| **Paid amplification** | Accelerate reach of already-working organic content | Meta ads (retargeting + lookalikes), TikTok Spark Ads, LinkedIn promoted posts, YouTube ads against warm audiences | The user has an organic winner (24–48h traction gate passed — saves, shares, sustained watch time) and wants to reach the next audience ring faster. Works indirectly more than directly — Meta's own tooling now measures downstream *search lift* from paid social, a tacit admission the platform click is not the whole mechanism. Never use paid amplification as a substitute for organic resonance; amplifying a dud just spends money faster. |
| **Trust compounding** | Build credibility, community, and distribution the competitor cannot buy | Founder / leader social presence, community nodes (Slack/Discord/WhatsApp/local chapters), newsletters, earned media, volunteer / advocate networks, referral systems | The user's bottleneck is *trust* — people can find them, sometimes click, but do not convert, subscribe, donate, or refer. Slow, compounding, the only function that produces a moat. Every insurgent campaign leads with this. |

**How to route:** in Stage 4 of the skill, the first question is *which function does
this campaign need?* — not *which channel looks appealing?* A mild-asymmetry user with a
trust bottleneck should not be routed to paid amplification just because they can afford
it. A severe-asymmetry user with a pure demand-capture problem (existing search volume,
no awareness) might correctly spend a disproportionate share on non-brand Google Search
despite the overall organic-led allocation, because that is the right function for
their specific bottleneck.

Map each tier below to a primary function: Tier 1 is almost entirely trust-compounding,
Tier 2 mixes trust-compounding and demand-capture (organic TikTok can be either
depending on intent), Tier 3 is paid amplification (by design — boost only proven
organic winners), Tier 4 is the function-mismatched red zone where users with trust
bottlenecks burn paid budget on cold audiences who were never going to trust them.

---

## Tier 1 — Zero marginal cost, highest ROI

These produce compounding returns, resist platform changes, and cannot be replicated by
competitors with money alone.

| Channel | Why it works | What to watch |
|---|---|---|
| **Founder / leader personal social presence** | Parasocial trust. Algorithms reward individuals over brands. Zero production cost. | Consistency beats intensity. 3 posts a week for a year beats 30 posts in a month and silence after. |
| **Community nodes** (Slack, Discord, WhatsApp, Circle, local chapters, user groups) | Direct, unmediated contact. Platform-change-proof. Members recruit members. | Real community has two-way traffic. If only the leader posts, it is a broadcast channel in disguise. **Community-build is a multi-week sub-campaign, not a 1h/week line item** — budget 3–4h/week sustained after a 4-week seed sprint with daily founder presence. Underinvest and it dies. See `SKILL.md` Stage 5 community block for the full cadence. |
| **Word-of-mouth referral systems** | Highest-trust channel known. A share from a trusted friend outweighs thousands of ad impressions. | Measure referral *lift*, not referral *volume*. Most referrals happen without incentives — paid referral programs often just rebate behavior that was already happening. |
| **Volunteer / advocate networks** | For movements, nonprofits, and cause-led campaigns: every volunteer is ~45M× more persuasive than a paid impression in their own social circle. | Friction is the enemy. Give advocates shareable material, clear asks, and low-effort ways to contribute. |

**Tier 1 is not free.** It costs the leader's time, attention, and sustained effort. Most
organizations fail at Tier 1 not because it is expensive but because it is slow and
leaders lose patience.

---

## Tier 2 — Low cost, high ROI

These produce meaningful reach on platforms that still reward organic content, or through
earned channels where credibility is borrowed.

| Channel | 2025–2026 benchmark | When to lead with this |
|---|---|---|
| **Organic TikTok** | ~2.50% engagement rate, ~3,092 likes/post avg, ~170 shares/post — highest organic reach of any major platform, though compressing annually. | Visual/demonstrable content, audience under 40, willingness to post frequently and unpolished. |
| **Organic LinkedIn** (thought leadership) | Rewards comment-thread depth and personal, professional content. | B2B, founder-led, consulting, enterprise sales, policy, any audience that wears a work identity. |
| **Email newsletters to owned audience** | Direct, deliverable, platform-independent. Open rates 20–40% for engaged lists vs. Meta organic reach at ~3%. | Long-form thinking, recurring cadence, any audience that gave you their email. |
| **Earned media** (press coverage, podcast appearances, other creators' platforms) | Third-party endorsement. One good podcast appearance in a relevant show can outperform a year of paid ads for credibility. | Newsworthy actions, strong founder story, niche expertise that journalists or creators want to borrow. |
| **Organic Facebook Groups** | The last meaningful organic surface on Meta. Niche Groups with active moderation still reach their members. | Community-of-practice niches, local/regional audiences, existing group membership. |

Note: organic Facebook *Pages* are effectively dead — engagement 0.15%, impressions down
35% YoY. Do not invest there. Facebook Groups are different — they still work.

---

## Tier 3 — Moderate cost, moderate ROI (use selectively)

Paid tactics that are worth running *when organic has already proven the content and
audience*. Never the starting point.

| Channel | When it works | When it does not |
|---|---|---|
| **Boost top-performing organic posts** | Only after 24–48h of real organic traction (saves, shares, sustained watch time). You are amplifying a proven winner. | As a default "boost every post" strategy. You end up paying to reach people who would not have engaged anyway. |
| **Long-tail, high-intent Google Ads** | Capturing existing demand. Someone searching "[your product category] for [specific use case]" has intent you can convert. | Broad or brand keywords. Studies (including eBay's internal research) show brand-keyword search ads often have zero measurable short-term lift. |
| **Warm retargeting** (website visitors, email list, past engagers) | Re-engaging an audience that has already shown interest. CPAs 2–3× better than cold audiences in most verticals. | As a substitute for building a warm audience in the first place. You must have traffic/interest to retarget. |

The **24–48h organic traction gate** is the single most important discipline in this tier.
The rule: if a post does not generate organic signal (saves, shares, watch time, deep
comments) in its first 24–48 hours, do not boost it. Likes do not count — they are cheap
and often bot-inflated.

---

## Tier 4 — High cost, declining ROI (use only with rigorous measurement)

| Channel | Why it is declining | When (if ever) to use |
|---|---|---|
| **Broad Facebook / Instagram ad campaigns** (cold audiences) | CPMs rising, iOS privacy changes, declining conversion quality, ad fatigue at 5–6 impressions. | Only with a geo-holdout or conversion-lift test proving incremental lift. Otherwise you are paying for attributed conversions that would have happened anyway. |
| **Generic Google Ads on competitive keywords** | CPC rising 10–15% YoY. You are in an AI-automated bidding war with competitors who have deeper pockets. | Rarely. Long-tail is almost always a better bet for challengers. |
| **Display advertising** | Ad blockers, banner blindness, low CTR, minimal persuasion effect. | Almost never for underdogs. Brand-awareness argument is weak compared to earned media. |
| **Influencer partnerships without organic credibility** | Audiences can now tell which creators are selling anything to anyone. Partnerships that do not match a creator's actual audience interest burn both sides. | When the creator genuinely uses and cares about the product, and the partnership looks like it. |

---

## The Paid Advertising Squeeze (2018–2024 CPM trend)

Google and Facebook CPMs have risen steeply, roughly tripling over the 2018–2024 window on
major US/EU benchmark sets. The mechanism is structural: more advertisers, AI-automated
bidding, iOS privacy changes forcing broader targeting, and platform monetization pressure.
Every additional year in Tier 4 costs meaningfully more per thousand impressions than the
year before. This curve does not reverse.

For a user in severe or categorical asymmetry, this means: **even if you could match your
competitor's Tier 4 spend, the absolute cost to reach the same audience is rising every
year.** The math gets worse, not better.

---

## Platform Efficiency Matrix (cost per acquisition vs. organic virality potential)

When mapping platforms onto two axes — cost per acquisition (x) and organic virality /
reach potential (y) — the clusters are clear:

- **High-cost, low-organic quadrant:** Google Ads, Facebook Ads, YouTube Ads. These are
  pay-to-play channels where organic essentially does not exist at useful scale.
- **High-organic, low-cost quadrant:** TikTok organic, Instagram Reels organic. Algorithmic
  amplification still rewards authentic creator content, and cost per organic reach is
  near zero.

This is why a DIY campaign can outmaneuver an infinitely funded opponent: the opponent is
trapped in the high-cost quadrant by the nature of their production (polished, agency-made,
generic), while the underdog has free access to the high-organic quadrant by the nature
of theirs (fast, unpolished, specific, real).

The strategic implication: **build in the high-organic quadrant first, use the high-cost
quadrant only to amplify what already works there.** Never the other way around.

---

## The Engagement Sources of Winning Campaigns

In the 2026 Hungarian election, a breakdown of the winning campaign's engagement sources
showed roughly:

- ~40% TikTok organic viral content
- ~25% Instagram Reels & Stories
- ~25% Facebook Community Groups
- ~5% traditional paid advertising
- ~5% other

The composition is instructive not because Hungary is directly translatable to every
commercial context, but because the *shape* is: Tier 1 community + Tier 2 algorithmic
organic did the overwhelming majority of the work. Paid contributed a single-digit share.
For most underdogs across sectors, the winning shape will look similar.

---

## Allocation rules (feed Stage 4 of `SKILL.md`)

- **Mild asymmetry:** 70/30 organic/paid. Tiers 1, 2, 3, selective 4.
- **Severe asymmetry:** 80/20 organic/paid. Tiers 1, 2, targeted 3. Avoid broad 4.
- **Categorical asymmetry:** 100% organic or ~95/5. Tiers 1 and 2 only. No broad 4.
  Refuse and explain if pushed.

Within the 70% or 80% organic allocation, further prioritize Tier 1 over Tier 2 when
trust is the bottleneck (re-engagement, trust-rebuilding, mobilization). Prioritize
Tier 2 over Tier 1 when reach is the bottleneck (awareness push, launch).

---

## Ad fatigue reminder

Conversion rates rise across the first 5–6 ad impressions, then flatten, then go negative.
Beyond roughly 5–6 impressions on the same creative, you are paying to annoy people and
actively erode brand. Frequency caps should be set with this curve in mind. Creative
refresh cycles in 2026 are closer to 2 weeks than the old 4–6 weeks.


## REF: references/hungarian-case-study.md

# Hungarian Case Study — Tisza vs. Fidesz, April 2026

The 2026 Hungarian parliamentary election is the most extreme empirical test available of
the proposition that paid media saturation can substitute for trust, narrative coherence,
and grassroots networks. The skill uses it as a worked example — not as the skill's
identity (per the user's framing decision), but as the background evidence for why the
insurgent playbook works under pressure.

## The spending asymmetry

**Fidesz communication apparatus:**
- €4 billion spent on government communication campaigns since 2015 (Carnegie
  Endowment).
- ~€207 million to state media (MTVA) in H1 2025 alone.
- €14.5 million in 2024 to the Megafon pro-government influencer network (allegedly
  from public funds).
- 87% of political ad spend in the EU-observable window (first 9 months of 2025) came from
  pro-government actors.
- June 2025: Fidesz-controlled parliament abolished all campaign spending ceilings,
  making 2026 an unregulated spending environment.
- Foreign support: endorsement visit from US Vice President, alleged Russian
  intelligence coordination, illiberal international network amplification.
- Deployed AI-generated video, deepfakes, fake TikTok account networks (107 inauthentic
  accounts removed in one TikTok sweep), AI-generated 600-page "Tisza program" document.

**Tisza campaign (Péter Magyar's new party, founded 2024):**
- No billboard budget ("Tisza does not spend billions on billboards" — Magyar, Feb 2026).
- No state media access beyond the legally mandated five minutes before elections.
- After Meta banned EU political ads in October 2025, paid digital dropped to effectively
  zero.
- Primary channels: Magyar's personal social accounts (organic Facebook, TikTok,
  Instagram), independent press, face-to-face campaigning.
- Physical infrastructure: 50,000 volunteers, hand-delivered newspaper ("Tiszta Hang"),
  208+ local "Tisza Islands" with 20,000+ members.

The ratio is not 1:2 or even 1:50. It is categorical — a well-resourced state-capture
machine vs. a grassroots party with near-zero paid media.

## Budget vs. impact

When Fidesz's financial spend index is indexed at 100, their organic digital engagement
sat at roughly 15 and their real-world conversion (voter mobilization) at roughly 35.
Tisza, with a spend index of effectively 2, produced organic digital engagement around 85
and real-world conversion around 90.

The shape matters more than the exact numbers: **spend and outcome were inversely
correlated.** The side with vastly more money produced vastly less mobilization per unit
of attention bought. At the extreme end of the diminishing-returns curve, additional
spend became actively counter-productive through saturation, inauthenticity, and reactance.

## Efficiency per forint — paid amplification was the *least* efficient channel

Beyond the spend-vs-outcome asymmetry, per-unit efficiency in the 2022–2024 Hungarian
political ad market tells the same story at a rate level, not a ratio level. Measured in
impressions per Hungarian forint spent across pro-government and independent actors:

| Advertiser | Impressions per HUF |
|---|---|
| Independent media (Partizán) | 1.46 |
| Government Official Pages | 1.26 |
| Megafon pro-government influencers | 0.88 |
| Fidesz Official Party Page | 0.60 |
| Aktuális (pro-government news) | 0.58 |

Independent organic content outperformed state-funded paid amplification at a per-forint
impression level, before accounting for the further authenticity-premium gap in conversion
quality (whether an impression actually moved the viewer). The paid-amplified content was
not merely less total-efficient because there was more of it — it was *less efficient per
unit of money*. Pro-government actors were essentially buying an audience they could not
attract organically, and each additional forint produced fewer impressions than the last.

This is the single strongest piece of evidence in the case for the function-based channel
hierarchy in `channel-tier-stack.md`: under saturation, paid amplification becomes the
worst-performing channel in its own market, not just worse than organic in aggregate.

## Engagement composition

On the winning side, a breakdown of engagement sources looked approximately:

- ~40% TikTok organic viral content
- ~25% Instagram Reels & Stories
- ~25% Facebook Community Groups (the last surviving organic surface on Meta)
- ~5% traditional paid advertising
- ~5% other (earned media, press)

Paid contributed a single-digit share of winning engagement. Tier 1 community and Tier 2
algorithmic organic did the work.

## What Tisza actually did

1. **Ground game at scale.** Magyar personally visited 700+ settlements between late
   2025 and election day. Local candidates replicated the model. Target: 3 volunteers per
   polling-station catchment area × ~10,000 stations = 30,000 volunteers. Actual: 50,000.

2. **Distributed organization without centralized control.** The "Tisza Islands" model
   let local chapters operate autonomously, recruit locally credible candidates, and run
   intra-party primaries using a modified Borda count. Ownership without bureaucracy.

3. **Organic digital as the campaign's spine, not a supplement.** With hostile traditional
   media, no paid budget post-Meta-ban, and no billboards, organic Facebook/TikTok/Instagram
   was not a side channel. It was the campaign.

4. **Narrative coherence.** A single clear message — corruption, systemic failure, return
   to Europe — rather than the fragmented multi-party opposition messaging of prior cycles.
   Magyar's personal story (former Fidesz insider turned whistleblower) provided an
   authenticity signal that no amount of paid advertising could manufacture on the other
   side.

5. **Counter-media in print.** The volunteer-delivered "Tiszta Hang" newspaper reached
   rural voters in media-dark zones who relied on state television and had limited
   internet. Free, hand-delivered, positioned as an alternative information source.

6. **Parasocial founder content.** Facebook Lives from the car, selfies with supporters
   in rural villages, unedited footage of rallies at Andrássy Avenue and Kossuth Square.
   Kitchen-table framing against the flags-and-podiums of the incumbent.

## The result

- **Tisza: 141 / 199 seats (70.8%)** on 54.41% of the vote — the largest mandate any
  Hungarian party has won in a free election.
- **Fidesz: 53 / 199 seats (26.6%)** on 37.8% of the vote — seat count more than halved.
- **Turnout: 79.5%** — highest since 1985, highest in Hungary's democratic era.
- 3.3 million votes for Tisza — the highest for any Hungarian party in a free election.
- Fidesz lost uniformly across settlement types, including rural strongholds.
- The gerrymandered district map and the "winner compensation" rule that Fidesz had
  designed to guarantee supermajorities turned against them when Tisza became the
  largest unified party.

## Why the spending did not translate

Four failures compounded:

1. **Saturation past the curve.** After 16 years of billion-euro communication spend, each
   additional forint produced not just zero marginal persuasion but *active resistance*.
   The 79.5% turnout was partly mobilization *against* messaging fatigue.
2. **Inauthenticity premium inverted.** The polished, AI-generated, agency-produced
   content read as suspect by default. Magyar's unpolished phone-video content carried an
   automatic credibility signal because it did not look like the saturated material.
3. **Platform rules changed underneath them.** The October 2025 Meta/Google political ad
   bans removed Fidesz's ability to pay for reach at exactly the moment they most needed
   it. Their Megafon influencer network, whose reach was almost entirely paid-amplified,
   lost most of its audience. Tisza's organic presence was untouched.
4. **Network model beat broadcast model.** 50,000 volunteers × 5 conversations per day ×
   six months = ~45 million face-to-face interactions. No ad budget can replicate that
   volume, and no ad format can replicate the persuasion depth of a conversation with a
   neighbor.

## What this proves for other contexts

The mechanism is universal. The preconditions are situational. Keep them separate.

### The mechanism (transfers)

Saturation past the diminishing-returns curve, the authenticity premium, platform fragility,
and network-beats-broadcast are not political dynamics. They show up in commercial advertising
too, and the same curve is visible in 2025–2026 ad benchmarks (CPA up 13/14 industries, ROAS
down 13/14, FB organic engagement at 0.15%). The narrow, strong claim: **under severe or
categorical spending asymmetry, outspending does not beat outspecifying, and paid saturation
does not beat organic narrative when trust is the bottleneck.**

**Propaganda and paid advertising sit on the same curve.** State disinformation, troll-farm
amplification, influencer networks like Megafon, and commercial ad buys are not three
separate phenomena. They operate on one diminishing-returns curve and face the same
authenticity collapse at saturation. You can buy reach; you cannot buy belief; above a
threshold, buying more reach makes belief harder. This is why €4B of Fidesz communication
spend produced lower mobilization than 50,000 volunteers — and it is the same mechanism
behind CPA rising in 13/14 commercial industries while ROAS falls.

The troll farms are not over. They have learned the same lesson commercial advertisers are
learning and will adapt — smaller networks, embedded authenticity, parasocial mimicry,
slower and more patient placement. Planning for the 2020-era adversary (mass bot floods,
obviously synthetic content) misreads the next cycle. Planning for the 2026+ adversary
means leaning harder on verifiable authenticity — real people in real places at real
times, narrative coherence across many small moments, and provenance signals the
adversary cannot manufacture without being caught.

### The preconditions (do not transfer automatically)

Hungary did not win on playbook alone. Six preconditions were in place. Without enough of
them, the playbook will not reproduce the result:

1. **Credible insider defector.** Magyar was a former Fidesz insider turned whistleblower.
   That authenticity signal cannot be manufactured by advertising or by a challenger with
   no insider credibility.
2. **Accumulated grievance.** 16 years of one-party rule left unmet anger that only needed
   a vehicle. Fresh or unformed dissatisfaction does not behave the same way.
3. **Unified opposition.** One consolidated challenger, not a fragmented field. A crowded
   or splintered opposition dilutes organic narrative and benefits the incumbent.
4. **Felt economic pain.** Every voter experienced the cost directly — inflation, wages,
   services. Abstract or distributed grievances do not mobilize the same turnout.
5. **A threshold-rewarding system.** The Hungarian electoral map was designed for Fidesz
   supermajorities, but the "winner compensation" rule flips once a single challenger
   crosses ~50%. Markets, platforms, and distribution systems with similar threshold
   dynamics exist; many do not.
6. **An overplayed incumbent hand.** The neighbouring war let Fidesz run fear messaging
   past the saturation point. The incumbent helped the challenger by misreading the
   fatigue curve.

### The honest transferable claim

**Grassroots-first beats paid saturation when the preconditions are present.** The
mechanism is real; the preconditions are rare. You cannot replicate Hungary in Slovakia
tomorrow, in the US in 2028, or in a product launch next quarter by telling people "just
run a Tisza Islands model."

For an underdog in any sector, the strategic implication is two-part:

- If the preconditions are largely present, build the distribution system the competitor
  cannot buy — founder-led narrative, community nodes, volunteer networks, earned media —
  and use paid only as an amplifier of what organically works.
- If the preconditions are missing, building them is the campaign. Recruit a credible
  insider voice, surface and name the grievance, consolidate the coalition, find the
  felt-pain story. Do that work first. The organic playbook at full scale, run against a
  missing precondition, will underperform and burn the volunteer energy it depends on.

## Sources

- Carnegie Endowment for International Peace — Fidesz spending analysis (Jan 2026)
- Heinrich Böll Stiftung — Hungary media battlefield analysis (Jan 2026)
- OSCE/ODIHR — Election Observation Mission preliminary findings (April 2026)
- LSE European Politics Blog — Settlement-level election data (April 2026)
- ECPR The Loop — Tisza organizational model analysis (April 2026)
- Cambridge / Review of Democracy (CEU) — Multi-researcher election analysis
- Frontiers in Political Science — Megafon influencer network research (Dec 2025)
- Political Capital — Political ad spend share data (2025)
- Mérték Media Monitor — state advertising distribution research

For the full long-form essay, see *When Money Loses: Paid vs. Organic Advertising* (bencium.io).


## REF: references/lift-test-templates.md

# Lift-Test Templates

Stage 5b of `SKILL.md` requires a concrete measurement plan for any paid spend. Platforms
report *attributed* conversions — conversions correlated with an ad view. What the user
needs is *incremental* conversions — conversions that would not have happened without
the ad. The gap between these two numbers is often the entire ad spend.

## Why platform ROAS cannot be trusted

Platform attribution systems are optimized for the platform's revenue, not the user's.
A conversion attributed to Meta might have happened from organic search, from a word-of-mouth
referral, or from the user typing the URL directly — Meta's pixel fires as long as the
person scrolled past an ad in the last N days. This is why meta-analyses of ad-effectiveness
experiments consistently show that attributed ROAS overstates incremental ROAS by 2–10×.

The academic evidence is sharper still. Lewis & Rao's "The Unfavorable Economics of
Measuring the Returns to Advertising" (*Quarterly Journal of Economics*, 2015) ran 25
large-scale digital ad field experiments and showed that even well-powered tests often
cannot statistically distinguish the campaign's true ROI from zero — the confidence
intervals are wider than the effect sizes almost every advertiser wants to claim. In
plain language: on the evidence the user has, most paid campaigns cannot be proven to
work better than not running them. The dashboard showing "4.2× ROAS" is describing
activity, not causality.

Platforms know this. Both Meta (Conversion Lift, Brand Lift) and Google (Conversion Lift,
Search Lift) ship holdout-based experimentation tools *themselves*. The fact that the
platforms distinguish "attributed" from "incremental" in their own product naming is the
tacit admission. Use their tools, or build your own (Templates 1–3 below). When a user
pushes back on the discipline — "my ads are working, I can see the numbers" — cite Lewis
& Rao and the platforms' own product naming. The burden of proof is on the claim of
lift, not on the demand for evidence.

## Template 1 — Geo-holdout experiment

Best for: local businesses, multi-market products, political campaigns, anything with
natural geographic segmentation.

### Design

1. **Pick two or more comparable regions.** Comparable means similar population,
   demographics, baseline sales/signups/turnout. Example pairs: two mid-size metros in the
   same country, two neighborhoods with similar profiles, two US states with similar
   political baselines.
2. **Designate one as "test" (ads run), one as "holdout" (no ads).** If you can run
   more than two regions (e.g., 4 test + 4 holdout), statistical power improves significantly.
3. **Run the paid campaign only in the test region for at least 4 weeks.** Shorter
   durations produce noisy results; longer durations confound with seasonality.
4. **Measure the outcome metric in both regions before, during, and after the
   campaign.** Outcome metric should be *real* (sales, signups, donations, votes, attendance),
   not platform-reported (clicks, impressions, attributed conversions).
5. **Compute the lift.** Lift = (test region post-campaign − test region baseline) −
   (holdout region post-campaign − holdout region baseline). This difference-in-differences
   estimate is the causal effect of the paid spend.

### Minimum viable version

- 2 regions, 4 weeks, simple before/after comparison of total sales or signups.
- Small sample sizes produce wide confidence intervals. Be honest about this — a noisy
  result is often indistinguishable from zero effect, which is itself a meaningful finding
  (and should stop the spend).

### Decision thresholds

- If incremental lift is at least 2× the cost of the spend: continue.
- If lift is positive but smaller than spend cost: rethink creative or channel; do not
  scale.
- If lift is statistically indistinguishable from zero: stop the spend. Move budget to
  organic Tier 1–2.

## Template 2 — Conversion-lift (audience-holdout) experiment

Best for: digital-native businesses where the audience can be randomly split within a
platform's ad system.

### Design

1. **Within the target audience, platform holds out a random subset (typically 10–30%) from
   seeing ads.** Meta, Google, and TikTok all offer this through their lift-test tooling.
2. **The holdout sees no ads for the campaign duration; the treatment group sees them
   normally.**
3. **Platform reports the incremental conversion rate** — the difference in conversion
   rate between treatment and holdout — which is the causal effect.

### Setup requirements

- Minimum audience size: usually tens of thousands of users for reliable signal. Smaller
  campaigns produce noisy lift estimates.
- Campaign budget: usually at least $10k spend, sometimes more, to move the metric enough
  to detect lift above noise.
- Duration: typically 4–6 weeks.

### Decision thresholds

- Compare incremental lift to attributed ROAS. Expect incremental to be 20–70% of
  attributed. If incremental is less than 20% of attributed, the campaign is largely
  claiming credit for conversions that would have happened anyway — stop or rework.
- If incremental ROAS clears the cost-of-capital threshold (typically 1.5–2× spend
  depending on margin), continue. Otherwise reallocate.

## Template 3 — Pre-post with synthetic control

Best for: single-market campaigns where geo-holdout is not possible (one country only, one
city only).

### Design

1. **Before launching the paid campaign, gather at least 8–12 weeks of baseline data on
   the outcome metric.**
2. **Identify a "synthetic control"** — a combination of other markets, other brand keywords,
   or other product lines that track your baseline metric well historically. Software like
   Google's CausalImpact or simple regression can construct this.
3. **Run the campaign. Measure the outcome metric and compare to the synthetic control's
   projection.** The gap is the estimated lift.

### Caveats

- Synthetic-control methods are sensitive to unobserved confounders (seasonality, external
  events, competitor moves). Interpret lift estimates with wider confidence bands.
- Works best when the outcome metric has low noise relative to the expected lift.

## Template 4 — Micro-lift for tiny campaigns

Best for: very small budgets (under €5k) where the formal templates above are statistically
underpowered.

### Design

1. **Run the paid campaign for 2 weeks.**
2. **Ask converters directly:** during the signup / purchase / donation flow, add one
   question — "How did you hear about us?" — with a short list of options including "saw
   an ad."
3. **Compare ad-attributed shares to organic shares.** This is not a rigorous causal test,
   but it is a cheap signal check: if only 2% of converters credit the ad, the ad is
   probably not doing much regardless of what the platform reports.

### When to use

- Budgets too small for statistical lift tests.
- Campaigns where the downside of a noisy estimate is acceptable.
- As a *supplementary* signal alongside a formal test, not a replacement.

## Anti-patterns to refuse

The skill should refuse to accept these as measurement plans and explain why:

- **"We'll just track ROAS in the Meta dashboard."** Attributed, not incremental.
  See above.
- **"We'll A/B test two creatives to see which performs better."** Creative comparison
  is not a lift test. It tells you which creative is less bad, not whether either creates
  incremental lift.
- **"We'll measure follower growth during the campaign."** Follower growth is confounded
  with everything — organic activity, press, time of year. Not causal.
- **"We'll measure sentiment."** Sentiment tools are noisy and sentiment correlates
  poorly with action. Useful as a directional check, not a decision threshold.

## Pairing with the 24–48h organic traction gate

The organic-traction gate from `channel-tier-stack.md` (do not boost a post until it has
demonstrated organic signal) and the lift tests here are complementary, not redundant.

- The **organic gate** decides *what to boost* — only proven winners.
- The **lift test** decides *whether boosting works at all* at meaningful scale.

A campaign running both disciplines will burn less budget on ineffective spend than a
campaign running either alone.

## Output in the deliverable

In Stage 5b of `SKILL.md`, produce a specific, named experiment from one of these templates.
Not "set up some form of lift testing." A template like:

> **Geo-holdout: 4-week experiment**
> - Test region: Budapest (run all paid Meta spend here)
> - Holdout region: Debrecen (no paid spend)
> - Metric: newsletter signups (daily count pulled from Supabase)
> - Duration: April 20 – May 18
> - Decision threshold: continue spend only if Budapest signups are at least 1.8× the
>   difference-in-differences delta vs. spend cost. Stop if delta is within noise.

Specificity is the whole point. A vague measurement plan is no measurement plan.

## Template 5 — Brand-keyword holdout test

Best for: established brands, SaaS, e-commerce, anyone currently bidding on their own
brand name in Google Ads (or Bing / other search networks).

### Why this test matters

Blake, Nosko & Tadelis ran a large-scale field experiment at eBay and found **weak or no
measurable short-term benefit from search ads bidding on the company's own brand name**.
The users clicking a "Ebay.com" paid search result would have arrived via the organic
result directly below it anyway. Brand-keyword ad spend was substantially cannibalizing
free traffic — paying for clicks that would have happened for free.

This is one of the single most reliable ways established brands waste paid budget.
Platform-reported ROAS on brand keywords is always excellent *because* the traffic would
have converted regardless. The lift vs. no-ad condition is the honest number.

### Design

1. **Identify the brand-keyword campaign.** The exact-match and phrase-match ads bidding
   on the company name, product names, and common misspellings.
2. **Pick matched geographic regions.** Same rules as Template 1 — comparable population,
   demographics, baseline organic search volume for the brand. Minimum 30% of national
   traffic in the test region.
3. **Pause brand-keyword bidding in the test region for 4 weeks.** Keep all other paid
   campaigns running identically in both regions. Keep all organic SEO identical.
4. **Measure total conversions** (signups, purchases, whatever matters) in both regions —
   *not* just paid conversions. The question is whether total business output changes, not
   whether paid-attributed conversions change (of course they will, to zero).
5. **Compare the difference-in-differences.** Did total conversions drop in the test
   region relative to the control region?

### Decision threshold

- **No measurable drop (within noise):** the brand-keyword spend was cannibalizing free
  traffic. Kill the campaign. Redirect budget to trust-compounding organic or to
  non-brand demand-capture search terms where lift is real.
- **Measurable drop > cost of spend:** the campaign was actually producing incremental
  traffic. Keep it, but retest quarterly — competitor bidding on your brand name changes
  the answer, as does your own organic SEO strength.
- **Measurable drop < cost of spend:** partial cannibalization. Kill it anyway — you are
  paying more than the incremental value.

### Common failures

- Running the test for one week. Brand searches have weekly cyclicality; run four weeks
  minimum.
- Cutting all paid spend, not just brand-keyword. Confounds the result.
- Ignoring organic rank. If your organic result is #1 for brand queries, cannibalization
  is near-total; if you rank #4 behind three competitors bidding on your name, the test
  might reveal real lift from defensive bidding.
- Not segmenting by query type. Your company name alone is different from
  "company-name reviews" or "company-name vs competitor-name." Test each segment
  separately.

### Why this template belongs in Stage 5b

Stage 4 of `SKILL.md` forbids broad cold-paid for severe / categorical asymmetry. For mild
asymmetry users, the single most common paid mistake is brand-keyword overspend. This
template catches it in Stage 5b. Run this test before any other paid-search expansion.

## Template 6 — Organic-source attribution (zero-budget)

Best for: campaigns with no paid budget at all. Every Tisza-style campaign, early-stage
startup, NGO push, solo practitioner, and any underdog at categorical asymmetry.

### Why this template matters

Templates 1–5 all assume some paid spend to test against a holdout. Zero-budget campaigns
have no holdout axis — there is no "paid on" vs. "paid off" comparison possible. But
measurement is still mandatory. Without source-level attribution, the user cannot tell
whether LinkedIn is driving the campaign or the newsletter is, which means they cannot
cut the weakest channel or redouble on the strongest one.

This template substitutes *between-channel* comparison for *with-vs-without* comparison.
It is directionally useful, not causally conclusive. Say that out loud — the user
should not treat these numbers as proof of lift, only as proof of relative organic channel
strength.

### Design

1. **UTM-tag every link the campaign publishes.** Every LinkedIn post CTA, every
   newsletter link, every podcast-show-notes mention, every QR code on a flyer, every
   referral link. Naming scheme: `utm_source=<channel>` (linkedin, newsletter, podcast-
   <show-slug>, referral-<advocate>), `utm_medium=organic`, `utm_campaign=<campaign-
   name>`.
2. **Set up segmented landing-page analytics.** The conversion (application submitted,
   newsletter signup, event registration, donation) must be tracked by UTM source. Most
   analytics tools (Plausible, PostHog, Simple Analytics, Supabase + custom) handle this
   natively.
3. **Run for 30 days minimum.** Shorter windows under-sample weekly cyclicality and over-
   weight one-off viral posts.
4. **Rank channels by conversion rate per unique visitor**, not by absolute conversion
   volume. A newsletter with 2,000 subscribers and 50 conversions outperforms a LinkedIn
   post with 50,000 impressions and 80 conversions (2.5% vs. 0.16%).
5. **Segment by content type within each channel.** A LinkedIn Live might convert
   dramatically better than a text post, which changes the weekly-effort allocation in
   Stage 5.

### Decision rule

- **Top channel:** double weekly effort on it next 30 days.
- **Any channel <20% of top channel's conversion rate:** drop it unless it serves a
  secondary function (credibility, SEO backlink, borrowed audience) the measurement
  cannot see.
- **Middle band:** maintain effort, retest after any format change.
- **Overall conversion rate across all channels <0.5%:** the bottleneck is upstream of
  channel selection — usually message-market fit or an offer problem. Re-run the MMF
  gate in Stage 3a before re-investing in distribution.

### Caveat — this is directional, not causal

Without a randomized holdout, you cannot prove any channel *caused* its conversions
versus correlating with a user who would have converted anyway. Someone who signed up
via the newsletter link may have first heard about the event on LinkedIn and later
clicked through an email — multi-touch attribution is underspecified in this template.
Treat the rankings as a rough guide to effort allocation, not as proof of lift. If the
campaign later gets any budget, graduate to Template 1 (geo-holdout) for real lift
measurement. Until then, this template is what the user runs to keep Stage 5b honest.

### Why this template belongs in Stage 5b

Zero-budget campaigns are the default case for the insurgent skill. Without a
zero-budget template, Stage 5b would either demand a paid test the user cannot run or
quietly drop the measurement requirement. Template 6 fills that gap.


## REF: references/sector-riders.md

# Sector Riders

Six sector-specific overlays for the insurgent playbook. A rider does not
replace the function-first routing in Stage 4 — it **layers on top** of it,
adjusting archetype defaults, surfacing the sector's common failure mode, and
biasing channel weighting.

Stage 1 captures the user's sector. Stage 4 opens this file and applies the
matching rider after the function-first decision. Stage 5 uses the rider's
failure-mode note as a standing warning in the anti-vanity dashboard.

If the user's sector does not fit one of the six below, pick the closest rider
and flag the mismatch in the Assumptions table. Do not invent a rider on the
fly — the riders exist because they encode real structural facts about how
demand, distribution, and trust compound in each sector.

---

## Rider 1 — Cohort-Based Education / Courses / Workshops / Events

**Structural advantage:** the room is the product. Attendees meet each other, form
the cohort bond, and come back next year (or send their colleagues). Referral
flywheels compound *through the attendee network*, not through marketing spend.
Recurring cadence — same time each quarter, same format — beats one-shot launches
because it builds category reliability.

**Primary channel fit:** Tier 1 (founder presence + community nodes + word-of-mouth
referrals) with a heavy weighting on community. An active Slack / Discord /
WhatsApp for past and prospective attendees is the single highest-leverage channel
in this sector.

**Archetype defaults:** founder-story arc, community-build, referral flywheel,
coalition plays with adjacent teachers/operators. Earned-media works here when
anchored to a specific session or a teaching artifact (curriculum, post-mortem,
open notebook).

**Common failure mode:** selling information in a world where information is free.
The cohort-based course competing on "learn X" loses to a free YouTube playlist
on the same topic. What you sell is the *room*: the peers, the accountability, the
direct feedback, the alumni network. Market the room, not the curriculum.

**Metric emphasis:** applications-to-admits ratio, cohort-to-alumni network
growth, referral % of new applicants, repeat attendee rate, post-cohort NPS that
actually translates to referrals (not vanity NPS).

---

## Rider 2 — B2B SaaS / Enterprise Software

**Structural advantage:** buyers are findable on LinkedIn, specific titles hold
purchasing authority, and a single champion can drive multi-seat expansion. Founder
LinkedIn presence is the highest-leverage distribution channel in B2B —
parasocial trust with the founder compresses the sales cycle by weeks.

**Primary channel fit:** Tier 1 (founder LinkedIn + SEO demand capture on
high-intent non-brand queries) with Tier 2 (podcast guesting on operator/eng
shows, community nodes for the buyer persona). Paid social works only as
retargeting of warm audiences.

**Archetype defaults:** founder-story arc (CEO or technical founder in public),
earned-media through in-depth post-mortems and changelogs, category-insertion
vs. category-creation decision (joining an existing category beats creating a
new one 90% of the time for a challenger).

**Common failure mode:** MQL theatre. Buying top-of-funnel clicks that generate
form-fills the sales team calls "leads," chasing platform-reported ROAS,
confusing activity for pipeline. The fix: track incremental revenue lift via
Template 1 or 4 (`references/lift-test-templates.md`), not MQL volume.

**Metric emphasis:** activation rate (signup → first value), expansion revenue
from existing accounts, pipeline generated from founder content (UTM-tagged),
demo-to-close rate, NOT: website sessions, MQL count, attributed-but-non-
incremental ROAS.

---

## Rider 3 — Nonprofit / NGO / Cause-Led

**Structural advantage:** mission is inherently shareable. Supporters want to
advocate publicly; the friction is giving them the asset, the ask, and the
moment. A mission with a named, specific beneficiary outperforms a mission with
an abstract cause — story > statistic.

**Primary channel fit:** Tier 1 (volunteer networks, chapter model, email list)
and Tier 2 (earned media on specific beneficiary stories, coalition with aligned
orgs). Paid reserved for donor retargeting only — never cold acquisition; the
LTV math does not pencil out on cold paid for most causes.

**Archetype defaults:** coalition play (formal alliance with 3–5 aligned orgs),
founder-story arc (executive director or named beneficiary), earned-media on
accountability moments (government action, corporate abuse, crisis response),
volunteer flywheel (every volunteer recruited = two more likely in their
network).

**Common failure mode:** donor-speak instead of story. Annual reports written
in foundation jargon, pitches anchored to organizational outputs ("we delivered
2,400 program hours") instead of named human outcomes ("Fatima is in school
because…"). The fix: lead with one named person, one specific moment, one
concrete ask. No acronyms in the first paragraph.

**Metric emphasis:** donor retention rate, average gift size growth,
volunteer-to-donor conversion, advocate-to-recurring-supporter rate, earned-
media placements that mention a named beneficiary, NOT: impression counts,
Facebook page likes, email list size without engagement segmentation.

---

## Rider 4 — Consumer Brand / DTC / E-Commerce

**Structural advantage:** user-generated content (UGC) is a compounding asset
class. Every customer post is a proof point for the next buyer. Repeat
purchase economics dominate — a brand that gets retention right can spend 3–5×
more on acquisition than a brand that doesn't.

**Primary channel fit:** Tier 1 (organic creator partnerships with 10–50k
follower accounts in the niche, UGC programs, email/SMS list) and Tier 2
(Reddit / subreddit presence, podcast sponsorships with proven hosts). Tier 3
paid social only after an organic winner exists (24–48h traction gate).

**Archetype defaults:** founder-story arc for category-creating or
mission-driven brands, referral flywheel (every 3rd customer gets a referral
link; measure incremental referral lift, not gross referrals), earned-media
stunt for launches (one newsworthy action, not a press release).

**Common failure mode:** paying influencers for reach without organic proof.
Buying a creator's audience before you have any organic creator content gives
you nothing durable; when the paid engagement ends, so does the visibility.
The fix: seed product to 50 creators first (no ask), let the organic content
accumulate, then buy usage rights + amplify the 3–5 pieces that worked
organically.

**Metric emphasis:** 90-day repeat purchase rate, organic UGC volume and
sentiment, contribution margin per acquisition channel (post-refunds,
post-shipping), retention cohort curves, NOT: ROAS from platform attribution,
reach numbers, vanity engagement rate.

---

## Rider 5 — Political / Movement / Civic

**Structural advantage:** ground-game math. A volunteer door-knock is roughly
45× more persuasive than a paid impression in the same household. Turnout in
the last 72 hours is largely a function of organized human contact, not ad
spend. Unified message discipline beats fragmented messaging even when the
unified version is less exciting.

**Primary channel fit:** Tier 1 (volunteer networks, chapter / precinct
structure, rally attendance, founder/candidate presence on TikTok + Facebook
Lives from unscripted locations) and Tier 2 (counter-media in information-dark
zones — small-town newspapers, regional radio, podcast appearances where the
opposition is absent). Paid heavily constrained by EU/US rules and by the
diminishing-returns curve at high saturation.

**Archetype defaults:** founder-story arc (candidate's own lived experience,
Ganz Self/Us/Now), counter-narrative (name the incumbent's saturation tactic,
refuse to match it), coalition play (formal multi-party or multi-org
alliance), earned-media stunt tied to a policy accountability moment.

**Common failure mode:** fragmented opposition. Three small parties running
three small campaigns against one consolidated incumbent lose even if their
combined vote share is larger. The fix: consolidation beats differentiation in
a threshold-rewarding system; sometimes the right campaign is a coalition
campaign, not your party's campaign.

**Metric emphasis:** registered-voter contact rate, volunteer-to-active-volunteer
conversion, turnout in targeted precincts vs. control precincts, unique
sharers of organic campaign content in the target geography, NOT: national ad
reach, national poll movement (too lagged, too noisy), social-media follower
count.

---

## Rider 6 — Personal Brand / Solo Practitioner / Independent Creator

**Structural advantage:** the person *is* the product. Consistency of voice
and format over time builds a trust moat that no agency or competitor can
manufacture — they cannot fake your specific point of view, your specific
vocabulary, your specific takes. One niche, held for 2+ years, compounds.

**Primary channel fit:** Tier 1 (one primary platform where the audience
actually is — not five half-tended accounts — plus an email list as the
platform-change-proof asset). Tier 2 (podcast guesting, substack/newsletter
cross-posts) once Tier 1 is compounding.

**Archetype defaults:** founder-story arc is the entire playbook. Every piece
of content should answer "why does this person have a point of view on this"
better than a generic content farm can. Earned-media via niche-specific
publications; paid only to amplify a piece with proven organic lift.

**Common failure mode:** niching too late, or never. "I write about technology
and leadership and design and productivity" has no audience. "I write about
why SaaS pricing pages lie, every Thursday" has an audience. The fix: pick a
niche so narrow it feels uncomfortable for 12 months; widen only after the
niche audience is saturated.

**Metric emphasis:** email list size with open rate >35%, repeat readers /
listeners / viewers (7-day and 30-day return rate), inbound DMs / invitations
for paid work, revenue per newsletter subscriber, NOT: follower count, post
likes, impressions.

---

## Cross-Reference to Archetypes

Every rider above implies a default archetype ordering in
`references/campaign-archetypes.md`. When the rider and the user's selected
concept conflict (e.g., a personal brand picking a coalition play), surface the
conflict and ask the user to confirm — the rider is the default, not the rule.

## When to Use "Other"

If the user's sector is genuinely outside the six — industrial B2B
manufacturing, deep research, regulated healthcare, heavy industry —
pick the closest rider and flag the mismatch in the Assumptions table. Note
which structural assumptions from the chosen rider do not apply so the user
can push back on those specific points. Do not attempt to synthesize a new
rider in-session; the rider encodes structural truths that need real
evidence, not improvisation.
