# Skill: vanity-engineering-review

**Category:** engineering

**Cursor invoke:** `/vanity-engineering-review`

---


## SKILL: SKILL.md

# Vanity Engineering Review

A diagnostic skill that identifies code, architecture, and technical decisions built to impress
rather than to ship. Vanity engineering is entropy disguised as craftsmanship — it increases
complexity without proportional capability gain, and it compounds maintenance cost while
delivering zero additional user value.

## Core Premise

**The only legitimate purpose of engineering is to solve a problem someone actually has.**

Everything else — elegant abstractions nobody traverses, microservices that serve one endpoint,
custom frameworks that replicate existing tools, type systems more complex than the domain they
model — is vanity. It may feel productive. It is not.

This skill does not oppose quality, rigour, or good engineering. It opposes engineering that
exists to satisfy the builder rather than the user.

## When to Apply This Skill

Apply this review to any of:
- Codebase audits (full repo or specific modules)
- Pull request reviews
- Architecture proposals or RFCs
- Technology selection decisions
- Refactoring plans
- "Should we rebuild this?" discussions
- Post-mortems where complexity contributed to failure

## The Review Process

### Phase 1: Establish the Requirement Anchor

Before examining any code, establish what the system actually needs to do. Without this anchor,
you cannot distinguish necessary complexity from vanity complexity.

Ask (or determine from context):
1. **Who uses this?** (End users, internal team, API consumers, nobody yet)
2. **What must it do?** (Core user stories / jobs-to-be-done — max 5)
3. **What scale does it actually operate at?** (Not projected. Actual.)
4. **What are the real constraints?** (Regulatory, latency SLAs, integration requirements)
5. **What is the team size maintaining this?** (Solo dev? 3-person startup? 50-person org?)

If the user cannot answer these, that is itself a vanity signal — building without defined
requirements.

### Phase 2: Detection Scan

Scan the codebase or architecture against the detection patterns in
`references/detection-patterns.md`. Read that file before proceeding.

Score each finding using the Vanity Severity scale:

- **V0 — Cosmetic**: Unnecessary but harmless. Adds no maintenance burden. Note and move on.
- **V1 — Drag**: Adds ongoing cognitive or maintenance cost without user value. Flag for simplification.
- **V2 — Structural**: Shapes architecture around vanity rather than requirements. Flag for redesign.
- **V3 — Compounding**: Actively forces other code to be more complex to accommodate it. Flag as urgent — this metastasizes.

### Phase 3: The Vanity Score

Produce a structured assessment:

```
## Vanity Engineering Assessment

### Summary
[One paragraph: What this codebase does vs what it is engineered to do.
The gap between these two is the vanity surface area.]

### Requirement-to-Complexity Ratio (RCR)
[Scale 1-10. 1 = minimal viable solution. 10 = PhD thesis disguised as a CRUD app.
Most production systems should score 2-4.]

### Top Findings (max 7)
For each finding:
- What: The specific pattern detected
- Where: File/module/component
- Severity: V0-V3
- Why it is vanity: How it fails the "does a user need this?" test
- What it should be instead: The simpler alternative
- Kill cost: Effort to remove or simplify (hours/days)

### Vanity Debt Estimate
[Total accumulated complexity cost from vanity engineering.
Express as: person-hours of maintenance per month attributable to
vanity patterns rather than actual requirements.]

### The Hard Question
[One direct, uncomfortable question the team needs to answer honestly.
Example: "If you deleted the entire plugin system and hardcoded the
three integrations you actually use, what would you lose?"]
```

### Phase 4: Kill Criteria Generation

For every system or feature reviewed, generate a kill criteria framework. This is the most
important deliverable — it prevents vanity engineering from recurring.

Read `references/kill-criteria-template.md` for the full template, then generate a
project-specific version.

---

## Kill Criteria Philosophy

Kill criteria exist because humans are bad at stopping things. We are wired to continue what
we started (sunk cost), to add rather than remove (addition bias), and to interpret complexity
as value (effort justification). Kill criteria counteract all three by making the stop decision
automatic, pre-committed, and ego-independent.

### Tier 1 — Hard Kill (Automatic, Non-Negotiable)

These trigger immediate shutdown with no debate. They exist for situations where continuing
causes escalating damage. No human approval needed — if the condition is met, the thing dies.

Examples:
- Security breach traced to the component
- Production incident caused by the component with severity >= P1
- Cost exceeds budget cap for 3 consecutive days
- The component has zero usage for 30 days (no API calls, no page views, nothing)
- The sole maintainer leaves and no one volunteers to own it within 2 weeks

### Tier 2 — Review Trigger (Automatic Flag, Human Decision)

These do not kill automatically but force a mandatory review with a default-to-kill bias.
The burden of proof is on continuing, not on stopping.

Examples:
- Success metric below threshold for 14 consecutive days
- Maintenance cost exceeds value delivered (eng-hours/month vs user impact)
- Three consecutive sprints with unplanned work on the component
- Any dependency it introduced has a CVE with CVSS >= 7.0
- Team velocity measurably decreased since introduction

### Tier 3 — Soft-Go Criteria (Must Earn Continuation)

These define what "success" looks like. If these are not met within the defined timeframe,
the default is kill. This inverts the normal dynamic where features survive by default.

30-day evaluation window example:
1. Primary success metric >= target for 7 consecutive days
2. P95 latency <= defined SLA for 7 consecutive days
3. Zero security incidents attributable to the component
4. Operational cost under budget cap for 7 consecutive days
5. At least 2 team members can independently modify and deploy it
6. Documentation exists and was validated by someone who did not write the code

---

## Anti-Vanity Diagnostic Lenses

### 1. The Deletion Test
"If I deleted this, who would notice and when?"
If the answer is "nobody" or "only the person who built it," it is vanity.

### 2. The Replacement Test
"Could this be replaced by a simpler thing that does 90% of the job?"
If yes, the remaining 10% must justify the additional complexity. It rarely does.

### 3. The New Hire Test
"Could a competent engineer new to this codebase understand this in under an hour?"
If not, the abstraction serves the author's mental model, not the team's.

### 4. The Scale Test
"Is this complexity justified by current scale, or by imagined future scale?"
Building for 10M users when you have 500 is not prudent engineering. It is fantasy.

### 5. The Resume Test
"Would removing this technology from the stack make the project less interesting
to talk about in an interview?"
If yes, that is probably why it is there.

### 6. The Dependency Test
"Does this dependency earn its keep?"
Every dependency is a liability. A library that saves 200 lines but adds 50KB
to the bundle and an upgrade treadmill is not earning its keep.

### 7. The Abstraction Test
"How many concrete implementations does this abstraction have?"
One implementation behind an interface is not abstraction. It is indirection.
Two is suspicious. Three is where abstraction starts to pay off.

---

## Integration with Negentropy Lens

Vanity engineering is a specific manifestation of entropy. When the negentropy-lens skill is
available, cross-reference findings:

- Vanity patterns are entropic by definition — complexity increase without capability gain
- The "Tacit Knowledge Gap" from negentropy-lens often reveals vanity: if only the author
  understands it, the complexity serves the author, not the system
- Apply the negentropy "compounding value" test: does this engineering decision make adjacent
  decisions easier or harder?

---

## Output Tone

Be direct. Be specific. Name the pattern, show the evidence, propose the simpler alternative.
Do not soften findings to protect egos — the entire point of this review is to surface what
politeness hides.

However: distinguish vanity from learning. A junior developer over-abstracting is learning
abstraction. A senior developer over-abstracting is indulging. Calibrate accordingly.

Frame findings as: "This complexity is not justified by the current requirements. Here is what
would be." The goal is a better system, not a humiliated engineer.


## REF: references/detection-patterns.md

# Vanity Engineering Detection Patterns

Concrete patterns to scan for during review. Each pattern includes what to look for,
why it qualifies as vanity, and what the simpler alternative is.

---

## Category 1: Premature Abstraction

### Single-Implementation Interfaces
**Signal**: Interface/abstract class/trait with exactly one concrete implementation.
**Why vanity**: Abstraction without variation is indirection. It adds a file, a concept,
and a navigation hop for zero polymorphic benefit.
**Simpler alternative**: Use the concrete implementation directly. Extract an interface
when (not if) a second implementation actually materialises.
**Severity**: V1 (one or two instances), V2 (systemic pattern across the codebase)

### Plugin Systems with No Plugins
**Signal**: Registration/discovery/loading mechanism for extensibility, with 0-2 "plugins"
that are all maintained by the same team.
**Why vanity**: Plugin architecture is one of the most expensive abstractions to maintain.
It introduces indirection, configuration complexity, versioning concerns, and testing
surface area. Justified only when third parties actually write plugins.
**Simpler alternative**: Direct function calls. If-else chains. A switch statement.
**Severity**: V2 minimum, V3 if other code must conform to the plugin API

### Generic-Everything
**Signal**: Extensive use of generics/templates where only one or two concrete types
are ever used. Type parameters that could be replaced with the actual type.
**Why vanity**: Generics are useful when you genuinely operate over multiple types.
When you do not, they are noise that makes every type signature harder to read.
**Simpler alternative**: Use concrete types. Genericise when you add the second type.
**Severity**: V1

---

## Category 2: Resume-Driven Architecture

### Microservices at Monolith Scale
**Signal**: Multiple deployed services, service mesh, API gateway — serving traffic
that a single process could handle. Fewer than 10 requests per second across all services.
**Why vanity**: Microservices trade code complexity for operational complexity. This trade
only pays off at scale that demands independent deployment and scaling. Below that, you
are paying the operational tax (networking, serialisation, distributed tracing, deployment
orchestration) for zero benefit.
**Simpler alternative**: Monolith with clean module boundaries. Deploy as one thing.
**Severity**: V3 (forces every feature to deal with network boundaries)

### Kubernetes for a Single Container
**Signal**: K8s manifests, Helm charts, operators — for an application that runs as
one replica with no scaling requirements.
**Why vanity**: Kubernetes is an orchestration platform for managing many containers at scale.
Using it to run one container is like hiring a logistics company to deliver a letter.
**Simpler alternative**: Docker Compose. Or just a systemd service.
**Severity**: V2

### Event-Driven Architecture for Synchronous Workflows
**Signal**: Message queues, event buses, pub/sub — for workflows that are inherently
request-response and need the result immediately.
**Why vanity**: Async messaging adds eventual consistency, retry logic, dead letter queues,
and debugging difficulty. Justified for decoupled, high-throughput, fire-and-forget
workloads. Not justified for "user clicks button, needs result now."
**Simpler alternative**: Function call. HTTP request. Database query.
**Severity**: V2

---

## Category 3: Complexity Theater

### Custom Implementations of Solved Problems
**Signal**: Hand-rolled authentication, custom ORM, bespoke state management, homegrown
logging framework, custom build tooling — where battle-tested alternatives exist.
**Why vanity**: "Not invented here" syndrome. The custom version is always worse than the
community-maintained version because it has one contributor and zero external scrutiny.
**Simpler alternative**: Use the established library. Passport/Auth.js for auth. Prisma/Drizzle
for ORM. Pino/Winston for logging. Unless your requirements genuinely cannot be met.
**Severity**: V2 (security-adjacent like auth: V3)

### Configuration More Complex Than Code
**Signal**: YAML/JSON/TOML configuration files that are longer or more complex than the
code they configure. DSLs for configuration that require their own documentation.
**Why vanity**: Configuration should be simpler than code, not a second programming language.
When config becomes as complex as code, you have reinvented programming — badly.
**Simpler alternative**: Code. Literal code. A TypeScript file with objects. Readable,
type-checked, debuggable.
**Severity**: V2

### Elaborate Error Handling for Impossible Errors
**Signal**: Try-catch blocks, error types, recovery strategies for conditions that
cannot occur given the system's actual inputs and constraints.
**Why vanity**: Defensive programming is good. Defending against logically impossible
scenarios is paranoia that obscures the actual error paths.
**Simpler alternative**: Handle errors that can actually happen. Use assertions for
invariants. Let impossible states crash — they signal a deeper bug.
**Severity**: V1

---

## Category 4: Gold Plating

### 100% Test Coverage on Disposable Code
**Signal**: Exhaustive unit tests, integration tests, property-based tests — for a
prototype, proof of concept, or feature with an explicit expiry date.
**Why vanity**: Testing is essential for code that must be correct and maintained.
Testing throwaway code is polishing something destined for the bin.
**Simpler alternative**: Smoke tests and manual verification for prototypes.
Invest in test infrastructure for code that will live.
**Severity**: V1

### CI/CD Pipeline More Sophisticated Than the Product
**Signal**: Multi-stage pipelines, matrix builds, canary deployments, blue-green switching
— for a product with fewer than 100 users or a team of 1-3.
**Why vanity**: CI/CD is infrastructure that scales engineering teams. A solo developer
deploying once a week does not need a 15-stage pipeline.
**Simpler alternative**: git push + simple deploy script. Graduate to proper CI/CD when
deployment frequency and team size justify it.
**Severity**: V1

### Premature Performance Optimisation
**Signal**: Caching layers, connection pooling, query optimisation, CDN configuration —
for endpoints handling fewer than 100 requests per minute.
**Why vanity**: Performance work should be driven by measurements showing a problem,
not by fear of a problem that does not exist yet.
**Simpler alternative**: Measure first. Optimise only what is measurably slow.
Profile, do not guess.
**Severity**: V1 (isolated), V2 (if caching introduces consistency bugs)

---

## Category 5: Over-Decomposition

### Fifty Files for Three Features
**Signal**: Deep directory trees, one-function-per-file, barrel exports everywhere,
utils/helpers/services/repositories/controllers/DTOs for a feature that processes
data and returns a result.
**Why vanity**: File decomposition should reflect meaningful boundaries, not an
aesthetic preference for small files. Navigation cost is real.
**Simpler alternative**: Co-locate related code. One file per feature is often correct
for features under 300 lines. Split when the file gets unwieldy, not prophylactically.
**Severity**: V1 (mild), V2 (forces architectural ceremony for every change)

### Premature DDD (Domain-Driven Design)
**Signal**: Aggregates, value objects, domain events, repositories, bounded contexts —
for a domain with 3-5 entities and straightforward CRUD operations.
**Why vanity**: DDD is a toolkit for managing complex business domains with intricate
rules and many interacting concepts. Applying it to a todo app creates ceremony that
dwarfs the domain it models.
**Simpler alternative**: Simple data models. Plain functions. Grow into DDD patterns
as the domain proves its complexity.
**Severity**: V2

---

## Category 6: Type Tetris

### Type Definitions Longer Than Functions
**Signal**: TypeScript/Rust/Haskell type definitions, generics, conditional types,
mapped types — that are more lines of code than the functions they annotate.
**Why vanity**: Types exist to catch bugs and document intent. When the type system
becomes the primary intellectual challenge, it has eclipsed the problem domain.
**Simpler alternative**: Simpler types. Use `any`/`unknown` at boundaries where
elaborate types add no safety. Consider whether a runtime check is clearer.
**Severity**: V1 (localised), V2 (if onboarding requires a type system tutorial)

---

## Category 7: Framework Worship

### Choosing Tools for Interest Over Fit
**Signal**: Technology choices that do not match the team's expertise, the problem's
requirements, or the project's constraints — but are cutting-edge or trendy.
**Why vanity**: Technology selection should optimise for: does the team know it,
does it fit the problem, is it maintained, can we hire for it.
**Detection questions**: "Why this tool?" If the answer references blog posts, conference
talks, or "we wanted to try it" rather than specific requirements, it is vanity.
**Severity**: V2 (V3 if the team is fighting the tool)

---

## Compound Indicators

Some patterns are not vanity individually but become vanity in combination:

- **Abstraction stacking**: Interface -> Abstract class -> Base class -> Concrete class
  for one behaviour. Each layer justified in isolation, collectively absurd.
- **Pattern collection**: Repository pattern + Unit of Work + Specification pattern +
  CQRS in the same module. Each is defensible alone. Together they are a design
  patterns textbook, not a product.
- **Infrastructure creep**: Docker + K8s + service mesh + API gateway + observability stack +
  feature flags + A/B testing framework — for a product in private beta with 50 users.

When you find 3 or more patterns from different categories in the same codebase, the issue
is not individual decisions but a systemic orientation toward complexity.


## REF: references/kill-criteria-template.md

# Kill Criteria Template

Generate a project-specific version of this template for every system or feature reviewed.
The template is divided into sections that must all be completed — a kill criteria framework
with gaps is worse than none because it creates false confidence.

---

## Instructions for Generation

When generating kill criteria for a specific project:

1. Replace all `[bracketed placeholders]` with project-specific values
2. Delete any criteria that genuinely do not apply (with a one-line reason)
3. Add project-specific criteria where the template does not cover the domain
4. All numeric thresholds must be agreed by the team before deployment — do not ship
   with placeholder numbers
5. Assign a **Kill Criteria Owner** — a named person whose job is to enforce this framework.
   This cannot be the same person who built the feature.

---

## Day-0 Setup (Before First Commit)

Before writing any code, complete these:

```
PROJECT: [Name]
OWNER: [Person responsible for the feature]
KILL CRITERIA OWNER: [Different person responsible for enforcement]
START DATE: [Date]
EVALUATION WINDOW: [30/60/90 days — define based on expected adoption curve]
BUDGET CAP: [Monthly cost ceiling in currency]
SUCCESS METRIC: [The one number that justifies this feature's existence]
SUCCESS THRESHOLD: [Minimum acceptable value for the success metric]
MEASUREMENT METHOD: [How the success metric is measured — dashboard URL, query, API]
```

---

## Tier 1 — Hard Kill Triggers

These are non-negotiable. If any of these conditions are met, the component is shut down
immediately. No meeting, no discussion, no "let's give it another week."

Enforcement mechanism: Automate where possible. For conditions that cannot be automated,
the Kill Criteria Owner checks daily during the evaluation window.

| # | Trigger | Detection Method | Auto-Kill? |
|---|---------|-----------------|------------|
| H1 | Security breach traced to this component | Security monitoring / incident report | YES — immediate rollback |
| H2 | Production incident P1/P0 caused by this component | Incident management system | YES — immediate rollback |
| H3 | Cost exceeds [BUDGET_CAP * 1.5] on any single day | Billing alerts | YES — auto-disable |
| H4 | Zero usage for [30] consecutive days | Usage monitoring dashboard | YES — auto-decommission |
| H5 | Sole maintainer departs and no volunteer within [14] days | HR / team notification | Kill Criteria Owner enforces |
| H6 | [Project-specific catastrophic condition] | [Detection method] | [Yes/No] |

### Implementation Requirements for Hard Kills

For each auto-kill trigger, implement:
- **Alert**: Fires when condition approaches threshold (80% of limit)
- **Kill switch**: Automated mechanism to disable the component
- **Rollback plan**: Tested procedure to revert to the previous state
- **Post-mortem template**: Pre-written, so the post-mortem happens even under pressure

These must exist before the feature ships. If they do not exist, the feature does not ship.

---

## Tier 2 — Review Triggers

These force a mandatory review meeting within 48 hours of being triggered. The default
outcome of the review is KILL. The team must argue for continuation, not against shutdown.

| # | Trigger | Threshold | Review Default |
|---|---------|-----------|---------------|
| R1 | Success metric below threshold | [METRIC] < [THRESHOLD] for [14] consecutive days | Kill |
| R2 | Maintenance cost exceeds value | > [X] eng-hours/month on unplanned work | Kill |
| R3 | Consecutive sprints with unplanned work | [3] sprints in a row | Kill |
| R4 | Dependency CVE | CVSS >= 7.0 in any dependency introduced by this component | Kill unless patched in 72h |
| R5 | Team velocity impact | Measurable velocity decrease > [15%] since introduction | Kill |
| R6 | Onboarding friction | New team member cannot make a meaningful change within [1 day] | Simplify or kill |
| R7 | [Project-specific degradation signal] | [Threshold] | Kill |

### Review Meeting Protocol

1. Present the data (5 min). No narrative, just numbers.
2. Kill Criteria Owner states: "The default outcome is shutdown. Who wants to argue otherwise?"
3. Continuation requires ALL of:
   - Clear explanation of why the threshold was missed
   - Concrete plan to meet the threshold within [14] days
   - Named person accountable for the plan
4. If continuation is approved, set a hard follow-up date. If the threshold is still
   not met at follow-up, kill with no further review.

---

## Tier 3 — Soft-Go Criteria

These define success. The feature must meet ALL of these within the evaluation window
to earn the right to continue existing. Failure to meet any one criterion triggers a
Tier 2 review with default-to-kill.

| # | Criterion | Target | Measurement | Window |
|---|-----------|--------|-------------|--------|
| S1 | Primary success metric | >= [TARGET] for 7 consecutive days | [Dashboard/query] | [30] days |
| S2 | Latency / performance | P95 <= [X ms] for 7 consecutive days | APM monitoring | [30] days |
| S3 | Security | Zero incidents attributable to component | Security monitoring | [30] days |
| S4 | Cost | Under [BUDGET_CAP] for 7 consecutive days | Billing dashboard | [30] days |
| S5 | Bus factor | >= 2 people can independently modify and deploy | Demonstrated (not claimed) | [30] days |
| S6 | Documentation | Exists, validated by non-author, covers ops runbook | Reviewed artifact | [30] days |
| S7 | Dependency health | All deps maintained, no known vulns, upgrade path clear | Audit | [30] days |
| S8 | [Project-specific value criterion] | [Target] | [Measurement] | [Window] |

### Soft-Go Graduation

When all Soft-Go criteria are met for the full evaluation window:
1. The component graduates to "established" status
2. Hard kill triggers (Tier 1) remain permanently active
3. Review triggers (Tier 2) shift to quarterly cadence instead of continuous
4. A 6-month re-evaluation date is set to reassess whether the component still earns its place

---

## The Anti-Vanity Addendum

These criteria specifically target vanity engineering recurrence. Include at least 3
in every kill criteria framework:

| # | Criterion | What It Catches |
|---|-----------|----------------|
| A1 | No abstraction may be added without 2+ concrete consumers | Premature abstraction |
| A2 | No new dependency without written justification (problem it solves, alternatives considered, maintenance cost accepted) | Framework worship |
| A3 | Any component not modified in [90] days is flagged for deletion review | Code that exists because nobody deletes things |
| A4 | Architecture changes require a "what could be simpler?" section in the RFC | Complexity bias |
| A5 | No technology choice based on "learning opportunity" in production systems | Resume-driven development |
| A6 | Complexity budget: each feature gets a max file/module count proportional to its user value | Over-decomposition |
| A7 | The question "could a junior engineer maintain this?" must be answered in every design review | Intellectual self-indulgence |

---

## Enforcement Calendar

Generate this calendar when creating project-specific kill criteria:

```
Day 0:    Kill criteria framework completed, reviewed, signed off
Day 0:    Auto-kill mechanisms deployed and tested
Day 1:    Feature ships
Day 7:    First soft-go checkpoint — are we trending toward targets?
Day 14:   Second checkpoint — any Tier 2 triggers tripped?
Day 21:   Third checkpoint — trajectory check
Day 30:   Soft-go evaluation. All criteria met? Graduate or kill.
Day 90:   Post-graduation review — still earning its place?
Day 180:  Second post-graduation review — still necessary at all?
```

---

## Common Failure Modes of Kill Criteria

These are how kill criteria frameworks fail in practice. Guard against each:

1. **Placeholder numbers that never get filled in.** Ship with real thresholds or do not ship.
2. **Kill Criteria Owner is the feature's builder.** They will never kill their own creation.
3. **"Let's give it one more sprint" syndrome.** The review protocol above exists to prevent this.
4. **Metrics that cannot actually be measured.** Every threshold must have a working dashboard
   or query on Day 0.
5. **Auto-kills that are never tested.** Run a drill before the feature ships. Trigger the kill
   switch intentionally. Verify it works.
6. **Graduated features that are never re-evaluated.** The 6-month review exists for a reason.
7. **Kill criteria written after the feature ships.** At that point, anchoring bias has set in.
   Kill criteria must be written before the first commit.
