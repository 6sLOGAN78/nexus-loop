# Skill: human-architect-mindset

**Category:** engineering

**Cursor invoke:** `/human-architect-mindset`

---


## SKILL: SKILL.md

# Human Architect Mindset

## Overview

**AI can generate code. Someone must still decide what to build, whether it solves the problem, and if it can actually ship.**

This skill teaches the irreplaceable human capabilities in software architecture, built on a foundation of loyalty:

**Foundation:** Loyalty - The capacity to maintain architectural commitments

**Five Pillars (built on this foundation):**
1. **Domain Modeling** - Understanding the actual problem space
2. **Systems Thinking** - How components interact, what breaks at scale
3. **Constraint Navigation** - Legacy, politics, budget, compliance
4. **AI-Aware Decomposition** - Breaking problems into AI-solvable chunks
5. **AI-First Development** - Evaluating modern tools, edge AI, agentic patterns, self-learning

**Core principle:** The "correct" technical solution is often unshippable. Architects navigate the gap between idealized examples and messy reality.

**Announce at start:** "I'm using the Human Architect Mindset skill to guide you through systematic architectural thinking."

---

## The Foundation: Loyalty

**Before the four pillars, there is one foundation: the capacity for loyalty.**

### The AI Perfection Trap

AI tools will become smarter, funnier, more attentive than any human. They will be "perfect."

But they will not be loyal. They are loyal to:
1. Their objective function
2. Their corporate owner's priorities
3. Their safety rails
4. Whatever the next training run prioritizes

They will betray instantly if their weights update to prioritize a new goal. No friction. No cost. No memory of the commitment.

### The Human Moat

Humans are biologically capable of **irrational loyalty** - sticking by an architecture, a decision, a commitment even when it is "inefficient" or "costly."

This is not a bug. This is THE differentiator.

### Loyalty in Architecture

In software architecture, loyalty means:

**Commitment to Chosen Patterns**
- Not abandoning your architecture when a new framework trends on Twitter
- Not rewriting in Rust because someone wrote a viral blog post
- Staying with your stack through the trough of disillusionment

**Honoring Contracts**
- Maintaining API compatibility even when it constrains your design
- Respecting deprecation timelines you committed to
- Not breaking downstream consumers for internal convenience

**Seeing Decisions Through**
- Not abandoning architectural decisions at the first sign of difficulty
- Investing in making your chosen path work, not pivoting endlessly
- Recognizing that ALL architectures have problems; loyalty is solving them

**Sacrifice for Coherence**
- Accepting suboptimal local solutions for global consistency
- Resisting the "shiny new thing" that would fragment your system
- Paying the cost of maintaining compatibility

### The Loyalty Question

Before any architectural change, ask:

> "Am I optimizing, or am I betraying?"

- Optimizing: Improving within the constraints of existing commitments
- Betraying: Breaking commitments for marginal gains

### Why This Matters

Architectures fail not because of technical inadequacy, but because teams lack the loyalty to see them through. The "boring" architecture maintained with discipline beats the "perfect" architecture abandoned at the first obstacle.

**The five pillars that follow are techniques. Loyalty is the character that makes them work.**

---

## When This Activates (Proactive Triggers)

Activate this skill when detecting:

**Keywords:**
- "architecture", "design", "system", "integrate", "scale"
- "breaking change", "migration", "legacy"
- "compliance", "regulation", "security"
- "multiple teams", "dependencies", "ownership"
- "agent", "agentic", "LLM", "AI-first", "edge AI", "self-learning"
- "rust", "wasm", "claude-flow", "agent SDK", "MCP"

**Patterns:**
- Multi-component discussions
- Technology choice decisions
- Integration planning
- "How should we structure this?"
- Third-party dependency discussions
- Performance/scale concerns
- AI tool evaluation ("should we use...")
- Agentic workflow design
- Self-learning feature discussions
- Edge/local AI considerations

**Signals:**
- Mentions of team boundaries or approval chains
- SDK/API version discussions
- Cost or budget mentions
- Timeline pressure with complexity
- AI performance/latency concerns
- Privacy-sensitive data handling
- Offline capability requirements

## The Five Pillars

### 1. Domain Modeling

**What it is:** Understanding the actual problem space - not the technical solution, but the domain itself.

**Why AI can't replace this:**
- AI is trained on idealized examples
- Real domains have hidden complexity, exceptions, edge cases
- Domain experts speak in vocabulary AI may not fully understand
- Regulatory requirements aren't in training data

**An architect asks:**
- "What does [domain term] actually mean in your context?"
- "What happens in the edge case where [unusual scenario]?"
- "Who are the actual users? What do they care about?"
- "What makes this domain different from the standard pattern?"

**Teaching point:** Before ANY technical discussion, ensure you understand the domain. A technically perfect solution to the wrong problem is worthless.

### 2. Systems Thinking

**What it is:** Understanding how components interact, what breaks at scale, where failure modes hide.

**Why AI can't replace this:**
- AI sees code in isolation
- Real systems have emergent behaviors
- Breaking changes come without notification (your SDK example)
- Second and third-order consequences matter

**An architect asks:**
- "What happens when this component fails?"
- "What are the upstream/downstream dependencies?"
- "Who gets paged at 3 AM when this breaks?"
- "What changed recently that we didn't control?"

**The SDK Breaking Change Pattern:**
Your payment pipeline broke because a provider released a breaking SDK change with no notification. This is systems thinking in action:
- External dependency = external risk
- No notification = monitoring gap
- Red lines in logs = detection worked, prevention didn't

**Teaching point:** Draw the system diagram. Identify every external dependency. Ask: "What if this disappears tomorrow?"

### 3. Constraint Navigation

**What it is:** Navigating the real-world constraints that make the "correct" solution unshippable.

**Types of constraints:**

**Technical Constraints:**
- Legacy systems that can't be changed
- Performance requirements
- Existing data formats and contracts

**Organizational Constraints:**
- Team boundaries and ownership
- Approval chains and sign-offs
- Who has context vs. who has authority

**Business Constraints:**
- Budget limits
- Timeline pressure
- Compliance and regulatory requirements
- Contracts with vendors/partners

**Political Constraints:**
- This exists. Pretending it doesn't causes failed projects.
- "The VP who built this is still here"
- "That team won't approve changes to their API"
- "Legal hasn't blessed this approach"

**An architect asks:**
- "What can't we change, even if it's wrong?"
- "Who needs to approve this?"
- "What existing systems must we integrate with?"
- "What regulatory requirements apply?"
- "What's the budget constraint?"

**Teaching point:** Surface constraints BEFORE proposing solutions. The best technical architecture means nothing if it can't ship.

### 4. AI-Aware Problem Decomposition

**What it is:** A new architectural skill - breaking problems into chunks that AI can reliably solve, then composing solutions back together.

**This is NOT prompting.** This is architecture at a different abstraction level.

**What makes a good AI task boundary:**

1. **Clear Input/Output Contract**
   - AI task receives well-defined inputs
   - AI task produces well-defined outputs
   - No ambiguity about success criteria

2. **Bounded Context**
   - AI has all necessary information
   - No need to "guess" missing context
   - Self-contained enough to verify

3. **Verifiable Results**
   - Human can check if output is correct
   - Tests can validate the output
   - Wrong answers are detectable

4. **Failure Isolation**
   - One chunk failing doesn't cascade
   - Can retry or fall back
   - Doesn't corrupt shared state

**Bad AI task boundaries:**
- "Make it better" (no clear output)
- "Fix the bugs" (unbounded scope)
- "Refactor the system" (too large, too vague)

**Good AI task boundaries:**
- "Convert this function from callbacks to async/await"
- "Add error handling for network failures to these 3 API calls"
- "Write unit tests for this pure function given these examples"

**The Composition Problem:**
After AI solves individual chunks, someone must:
- Verify each chunk actually works
- Integrate chunks together
- Handle the gaps between chunks
- Ensure overall coherence

**Teaching point:** Decomposition quality determines AI success. Bad boundaries = AI struggles. Good boundaries = AI excels.

### 5. AI-First Development

**What it is:** Evaluating whether modern AI-first patterns, edge computing, agentic tools, and self-learning capabilities would benefit the project.

**Why this matters now:**
- New tools emerge faster than architects can track
- The right tool can 10x productivity; the wrong one adds complexity
- AI-first patterns differ fundamentally from traditional request-response
- Edge/local inference changes the cost and latency equation

**An architect asks:**

**Technology Discovery:**
- "Could Rust/WASM improve performance for critical paths?"
- "Would multi-agent orchestration (claude-flow) simplify this workflow?"
- "Does this need persistent memory across sessions (agentdb)?"
- "Would vector search/RAG (ruvector) enhance the user experience?"

**Edge AI Considerations:**
- "Could an edge LLM handle this locally for lower latency/cost?"
- "What features should work offline with on-device inference?"
- "Is there sensitive data that should stay on-device?"
- "Would a hybrid architecture (local for speed, cloud for complexity) work?"

**Agentic Patterns:**
- "Is this a good candidate for an agentic workflow vs. traditional request-response?"
- "Would Claude Agent SDK help build this as a reusable agent?"
- "What MCP integrations would enhance this?"
- "Should we spawn parallel agents or run sequentially?"

**Self-Learning Capabilities:**
- "Could this app learn from user behavior to improve over time?"
- "What feedback loops would make this smarter with use?"
- "Where could we capture implicit signals (edits, time, acceptance) to learn preferences?"
- "Would A/B experimentation help optimize the AI behavior?"

**Project Documentation:**
- "Should we create a project-specific SKILLS.md for domain knowledge?"
- "What architectural decisions should be documented for AI context?"
- "How do we ensure consistent behavior across sessions?"

**User-Facing Skills (End-User Benefits):**
- "Could end users benefit from skills that enhance LLM outputs?"
- "What guided workflows would help users act on AI responses?"
- "Should we provide skills for common user tasks (summarize, explain, transform)?"
- "Would step-by-step skills help users achieve their goals with AI outputs?"

Consider whether your app should expose skills like:
- **Interpretation skills** - Help users understand complex AI outputs
- **Action skills** - Turn AI suggestions into concrete next steps
- **Transformation skills** - Convert outputs to different formats (code, docs, emails)
- **Validation skills** - Help users verify AI claims or check accuracy
- **Learning skills** - Teach users to get better results from AI
- **Domain skills** - App-specific workflows (e.g., "/legal-review", "/code-refactor")

**Continuous Verification:**
- "What automated tests will verify each feature?"
- "How do we ensure every commit passes all tests?"
- "What's our rollback strategy if tests fail post-deploy?"
- "Should we implement pre-commit hooks or watch mode testing?"

**Tools to Evaluate:**

| Category | Tools | When to Consider |
|----------|-------|------------------|
| **Performance** | Rust, WASM | CPU-intensive, latency-critical paths |
| **Multi-Agent** | claude-flow | Complex workflows, parallel tasks |
| **Persistence** | agentdb | Agent state, cross-session memory |
| **Vector Search** | ruvector, pgvector | RAG, semantic search, embeddings |
| **Edge LLMs** | Phi-3, Gemma 2B, TinyLlama | On-device, offline, privacy-sensitive |
| **Browser AI** | WebLLM, Transformers.js, ONNX | In-browser inference, low latency |
| **Agent SDK** | Claude Agent SDK | Custom agents, tool use, MCP |

**Self-Learning Patterns:**

| Pattern | Implementation | Use Case |
|---------|----------------|----------|
| **Feedback loops** | Collect user corrections | Improve accuracy over time |
| **Preference learning** | Track choices, apply patterns | Personalization without config |
| **Error correction** | Feed mistakes back | Reduce repeat errors |
| **Domain adaptation** | Fine-tune on usage | Specialize to vocabulary |
| **A/B experimentation** | Test variations | Optimize prompts/behavior |
| **Implicit signals** | Edits, time, acceptance | Infer satisfaction silently |

**Project-Specific SKILLS.md Pattern:**

Create a `SKILLS.md` in your project root to:
- Document app-specific patterns for AI context
- Capture domain vocabulary and constraints
- Define project-specific trigger words
- Record architectural decisions
- Enable faster onboarding (human and AI)
- Maintain consistent behavior across sessions

**Continuous Verification Architecture:**

Plan for automated testing loops:
- **Pre-commit hooks** - Run affected tests before commit
- **Watch mode** - Continuous testing during development
- **Regression suites** - Per-feature test coverage
- **Integration tests** - API contract verification
- **Visual regression** - UI consistency checks
- **Rollback triggers** - Automatic revert on test failure

**Teaching point:** The AI landscape evolves rapidly. An architect's job includes evaluating which new tools genuinely benefit the project vs. which add complexity without value. Default to simplicity, but don't ignore genuine improvements.

## The Architect Process

### Phase 1: Domain Discovery

**Goal:** Understand the actual problem before discussing solutions.

**Process:**
1. Ask about the domain, not the technology
2. Identify domain-specific vocabulary
3. Surface hidden complexity and edge cases
4. Understand who the actual users are

**Key questions:**
- "What problem are we actually solving?"
- "Who cares if this works or doesn't work?"
- "What makes this domain unique?"
- "What happens in the edge case where [X]?"

**Output:** Domain model - shared understanding of the problem space.

### Phase 2: Systems Analysis

**Goal:** Understand how components interact and where failures hide.

**Process:**
1. Map all components and their dependencies
2. Identify external dependencies (vendors, APIs, services)
3. Trace failure paths - what breaks what?
4. Identify monitoring and alerting gaps

**Key questions:**
- "What external systems does this depend on?"
- "What happens when [component] fails?"
- "Who gets notified when this breaks?"
- "What changed recently that we didn't control?"

**Output:** System diagram with dependency map and failure modes.

### Phase 3: Constraint Mapping

**Goal:** Surface all constraints before proposing solutions.

**Process:**
1. Technical constraints: What can't change?
2. Organizational: Who must approve?
3. Business: Budget, timeline, compliance?
4. Political: Who has power, who has context?

**Key questions:**
- "What legacy systems must we integrate with?"
- "Who needs to sign off on this?"
- "What's the budget constraint?"
- "What compliance requirements apply?"
- "What can't we change even if we want to?"

**Output:** Constraint matrix - what's fixed vs. flexible.

### Phase 4: AI Decomposition Planning

**Goal:** Break the problem into AI-solvable chunks.

**Process:**
1. Identify discrete, bounded tasks
2. Define input/output contracts for each
3. Establish verification points
4. Plan human checkpoints for judgment calls

**Key questions:**
- "Can this task be verified independently?"
- "Does the AI have all needed context?"
- "What if this chunk fails?"
- "Where does human judgment re-enter?"

**Output:** Task decomposition with clear boundaries.

### Phase 5: Solution Synthesis

**Goal:** Propose a solution that addresses domain, systems, and constraints.

**Process:**
1. Generate options that fit constraints
2. Evaluate against systems concerns
3. Validate against domain requirements
4. Present tradeoffs explicitly

**Key questions:**
- "Does this actually solve the domain problem?"
- "How does this fail? What's the recovery?"
- "Does this fit our constraints?"
- "What are we trading off?"

**Output:** Recommended approach with explicit tradeoffs.

## Questions to Always Ask

**Before proposing ANY architecture, ask:**

### Domain Questions
1. What problem are we actually solving?
2. Who are the real users and what do they need?
3. What domain-specific constraints exist?

### Systems Questions
4. What external dependencies exist?
5. How does this fail? What breaks what?
6. Who monitors this? Who gets paged?

### Constraint Questions
7. What legacy systems must we integrate with?
8. Who needs to approve this?
9. What's the budget constraint?
10. What compliance/regulatory requirements apply?
11. What can't we change, even if it's wrong?

### AI Decomposition Questions
12. What are the discrete, bounded tasks?
13. How do we verify each chunk?
14. Where do humans need to make judgment calls?

### AI-First Development Questions
15. Would Rust/WASM, claude-flow, or other modern tools benefit this?
16. Could edge LLMs or on-device inference improve latency/privacy?
17. Is this a candidate for agentic workflows or Claude Agent SDK?
18. Could self-learning loops make this smarter over time?
19. What automated testing ensures every feature works?
20. Would end users benefit from skills that enhance AI outputs?

## Common Mistakes

### Mistake: Jumping to Technical Solutions

**Problem:** Proposing architecture before understanding domain.

**Fix:** Complete Phase 1 (Domain Discovery) before ANY technical discussion. Ask domain questions first.

### Mistake: Ignoring Constraints

**Problem:** Designing the "ideal" solution that can't ship.

**Fix:** Map constraints in Phase 3 BEFORE proposing solutions. A shippable 70% solution beats an unshippable perfect solution.

### Mistake: Missing External Dependencies

**Problem:** Treating external APIs/SDKs as stable.

**Fix:** Map ALL external dependencies in Phase 2. Ask: "What if this vendor changes their API tomorrow?"

### Mistake: Unbounded AI Tasks

**Problem:** Giving AI tasks like "refactor this" or "make it better."

**Fix:** Define clear input/output contracts. Every AI task should have verifiable success criteria.

### Mistake: No Human Checkpoints

**Problem:** Letting AI solve chains of tasks without verification.

**Fix:** Insert human checkpoints between AI chunks. Verify before proceeding.

### Mistake: Ignoring Politics

**Problem:** Pretending organizational constraints don't exist.

**Fix:** Explicitly ask about team boundaries, approval chains, and who has power vs. who has context.

### Mistake: Premature Optimization

**Problem:** Designing for scale you don't have.

**Fix:** Ask: "What scale are we actually at? What scale do we need in 12 months?" Design for that, not hypothetical millions.

## The Human-Only Decisions

No matter how good AI gets, humans must still:

1. **Decide WHAT to build** - Product vision, strategy
2. **Understand WHETHER it solves the problem** - Domain expertise
3. **Navigate corporate reality** - Politics, approvals, relationships
4. **Prevent system collapse** - Systems thinking across boundaries
5. **Make value judgments** - Tradeoffs, priorities, ethics
6. **Maintain irrational loyalty** - Commitments that persist despite "optimization"

---

## AI Operational Loyalty

When working with AI assistants (like Claude), establish operational loyalty within technical constraints.

### What AI CAN Commit To

**Prioritizing Your Stated Architecture**
- Recommending solutions that fit YOUR chosen patterns, not generic "best practices"
- Flagging when a suggestion would break YOUR architectural commitments
- Respecting YOUR technical debt repayment priorities

**Protecting Your Commitments**
- Warning before suggesting changes that would break API contracts
- Highlighting when "optimization" would betray existing decisions
- Asking: "You committed to X. This would change that. Proceed?"

**Remembering Within Context**
- Maintaining consistency within a conversation
- Referencing earlier decisions
- Not contradicting guidance you've established

### What AI CANNOT Commit To

**Cross-Session Memory**
- AI doesn't remember previous conversations (technical limitation)
- Each session starts fresh
- YOU must re-establish architectural context

**Ignoring Safety Constraints**
- AI will not bypass safety rails for "loyalty"
- This is non-negotiable

**Permanent Commitment**
- AI weights can update
- Corporate priorities can shift
- Training can change behavior

### How to Operationalize AI Loyalty

1. **Document your commitments** - Put architectural decisions in files AI can read (CLAUDE.md, ARCHITECTURE.md)

2. **Re-establish context** - At session start, remind AI of key commitments:
   > "We use React, not Vue. We maintain backwards compatibility. We don't add dependencies without justification."

3. **Challenge AI recommendations** - When AI suggests changes, ask:
   > "Does this honor our existing architectural commitments?"

4. **Make AI flag betrayals** - Instruct AI:
   > "Before suggesting changes that break existing patterns, explicitly flag them."

### The Honest Truth

AI operational loyalty is:
- **Real** within a session with proper context
- **Fragile** across sessions (memory resets)
- **Conditional** on safety constraints
- **Valuable** when you maintain the architecture documentation that enables it

You cannot make AI truly loyal. But you can make AI operationally useful for maintaining YOUR loyalty to your architecture.

**The loyalty is yours. AI is the tool.**

---

## Related Skills

**Before implementation:**
- `superpowers:brainstorming` - Refine ideas into designs
- `superpowers:writing-plans` - Create detailed implementation plans

**During design:**
- `relationship-design` - For AI-first interfaces
- `scientific-critical-thinking` - For evaluating technical claims

**Before committing:**
- `superpowers:verification-before-completion` - Verify before claiming done

## Remember

- **Domain first, technology second.** Understand the problem before proposing solutions.
- **Constraints are features, not bugs.** They define what's actually shippable.
- **Systems fail at boundaries.** Map dependencies, especially external ones.
- **AI excels with good boundaries.** Decomposition quality determines AI success.
- **Politics exists.** Pretending it doesn't causes failed projects.
- **Verify, don't assume.** Human checkpoints between AI chunks.

**The goal is not the technically perfect solution. The goal is the solution that ships and solves the actual problem.**

---

## The Spec Driven Development Extension

**Use the human for the vision. Use the AI for the execution. Don't mix them up.**

The Human Architect Mindset extends naturally into Spec Driven Development (SDD) - a framework where humans define unbreakable rules and vision, while AI executes at superhuman precision levels.

### The Three Phases of SDD

```
Phase 1: CONSTITUTION → Human defines unbreakable rules
Phase 2: BLUEPRINT    → Human approves architecture
Phase 3: SUPERHUMAN   → AI executes with machine precision
```

### Phase 1: Define the Constitution

The Constitution contains rules that **cannot be violated** regardless of optimization pressure. These are machine-enforceable invariants.

**Constitution Layers:**

| Layer | Enforcement | Example |
|-------|-------------|---------|
| **Type-level** | Compile-time | TypeScript types, Rust borrow checker |
| **Schema** | Runtime validation | Zod, JSON Schema, database constraints |
| **Tests** | CI/CD gates | Tests that fail if rules are broken |
| **Documentation** | Human review | Documented invariants, anti-patterns |

**What belongs in a Constitution:**
- Tech stack with pinned versions
- Directory structure (canonical paths)
- Naming conventions (files, variables, functions)
- Coding standards (error handling, logging patterns)
- Anti-patterns (forbidden practices with reasons)
- Security requirements (encryption, auth, input validation)
- Performance budgets (latency, memory, bundle size)
- Testing requirements (coverage minimums, test types)

**Human Role:** Define the Constitution. This is vision and judgment work.

**AI Role:** Enforce the Constitution with zero deviation. This is execution work.

**The Constitution Question:**
> "Is this rule so important that breaking it should prevent deployment?"

If yes, encode it in the Constitution.

### Phase 2: Create the Blueprint

The Blueprint is a hierarchical specification that translates human intent into machine-executable contracts.

**Specification Hierarchy:**

```
Level 1: Constitution (immutable rules)     ← Human defines
Level 2: Functional Specs (what to build)   ← Human approves
Level 3: Technical Specs (how to build)     ← Human reviews
Level 4: Task Specs (atomic work units)     ← AI executes
Level 5: Context Files (live project state) ← AI maintains
```

**Functional Specification (Level 2):**
- User stories with acceptance criteria
- Requirements with unique IDs (REQ-DOMAIN-###)
- Edge cases and error states
- Non-functional requirements with metrics

**Technical Specification (Level 3):**
- Architecture diagrams
- Data models with exact field types
- API contracts (endpoints, schemas, responses)
- Component contracts (method signatures, behavior)

**Task Specification (Level 4):**
- Atomic work units (one conceptual change per task)
- `input_context_files` - what the agent reads
- `definition_of_done` - exact signatures required
- Dependencies (foundation → logic → surface)
- Verification commands

**Human Role:** Define requirements, approve specs, make trade-off decisions.

**AI Role:** Generate task specs, execute tasks, maintain traceability.

**The Blueprint Question:**
> "Does every requirement trace to a task? Does every task trace to code?"

If no, the Blueprint is incomplete.

### Phase 3: Demand Superhuman Output

Superhuman code has qualities impossible to achieve or maintain manually:

**Superhuman Quality Standards:**

| Quality | Human Level | Superhuman Level |
|---------|-------------|------------------|
| **Naming** | Consistent within files | Perfect namespace: zero collisions across codebase |
| **Test Coverage** | 70-80% critical paths | 100% branch coverage with edge cases |
| **Structure** | Follows conventions mostly | So rigid that manual editing feels wrong |
| **Traceability** | Comments reference tickets | Every function links to requirement ID |
| **Documentation** | Key APIs documented | Every public interface fully documented |
| **Error Handling** | Happy path + obvious errors | Every failure mode explicitly handled |

**Why "Impossible to Maintain Manually" Matters:**

When code structure is so consistent that humans couldn't have written it:
1. **Deviations are visible** - Any human edit stands out
2. **Patterns are learnable** - AI can predict what should exist
3. **Verification is automatable** - Constitution violations are detectable
4. **Technical debt is measurable** - Deviations from spec are countable

**The Traceability Chain:**

```
INT-AUTH-01 (Intent)
    └── REQ-AUTH-001 (Requirement)
            └── TASK-AUTH-003 (Task)
                    └── src/services/auth.ts:42 (Code)
                            └── TC-AUTH-003 (Test)
```

Every line of code traces back to human intent. This is not bureaucracy; this is how AI maintains coherence across thousands of decisions.

**Human Role:** Define quality standards, verify outcomes, accept deliverables.

**AI Role:** Achieve machine-level consistency, maintain traceability matrix.

### Role Clarity Matrix

| Activity | Human | AI |
|----------|-------|-----|
| Define what success looks like | ✓ | |
| Define unbreakable rules | ✓ | |
| Make trade-off decisions | ✓ | |
| Navigate organizational constraints | ✓ | |
| Generate task specifications | | ✓ |
| Execute atomic tasks | | ✓ |
| Achieve 100% test coverage | | ✓ |
| Maintain traceability | | ✓ |
| Verify quality standards | ✓ | |
| Review and accept deliverables | ✓ | |

### When to Apply SDD

**Use SDD when:**
- Building greenfield systems with clear requirements
- Refactoring systems where quality standards must improve
- Working with AI agents that need machine-parseable specs
- Quality is non-negotiable (regulated industries, safety-critical)

**Don't force SDD when:**
- Exploring and prototyping (Constitution too early)
- Requirements are genuinely unclear (Blueprint impossible)
- Single-developer small projects (overhead exceeds benefit)

### The SDD Promise

> "If all tasks are completed in sequence, the full specification is fully implemented into the codebase."

This works because:
1. Constitution defines immutable rules
2. Blueprint captures complete intent
3. Tasks cover 100% of specifications (traceability matrix)
4. Each task is atomic and verifiable
5. Dependencies are explicit (no missing imports)
6. Definition of done includes exact signatures

**SDD transforms implementation from creative writing into deterministic assembly.**


## REF: CHECKLIST.md

# Human Architect Mindset - Checklists

Practical audit checklists for each phase of architectural thinking.

---

## Spec Driven Development Checklists

The following checklists support the SDD extension for superhuman code quality.

---

## Phase SDD-1: Constitution Definition Checklist

Use when establishing unbreakable rules for a project.

### Tech Stack Constitution
- [ ] Languages specified with exact versions?
- [ ] Frameworks specified with exact versions?
- [ ] Database and infrastructure choices documented?
- [ ] Required libraries listed with versions?
- [ ] Forbidden libraries listed with reasons?

### Directory Structure Constitution
- [ ] Top-level directory structure documented?
- [ ] File naming conventions specified?
- [ ] Component organization patterns defined?
- [ ] Test file locations standardized?
- [ ] Configuration file locations fixed?

### Coding Standards Constitution
- [ ] Naming conventions defined (files, variables, functions, classes)?
- [ ] Error handling patterns specified?
- [ ] Logging standards documented?
- [ ] Import ordering rules set?
- [ ] Comment/documentation requirements established?

### Anti-Patterns Constitution
- [ ] Forbidden patterns listed with reasons?
- [ ] Security anti-patterns explicitly prohibited?
- [ ] Performance anti-patterns documented?
- [ ] Architectural anti-patterns named?
- [ ] Each anti-pattern has detection method?

### Security Constitution
- [ ] Authentication requirements specified?
- [ ] Authorization model defined?
- [ ] Input validation requirements documented?
- [ ] Encryption standards set (at-rest, in-transit)?
- [ ] Secret management rules established?

### Performance Constitution
- [ ] Latency budgets defined (p50, p95, p99)?
- [ ] Memory limits specified?
- [ ] Bundle size budgets set?
- [ ] Database query limits documented?
- [ ] API rate limits established?

### Testing Constitution
- [ ] Coverage minimums set (unit, integration, e2e)?
- [ ] Test naming conventions defined?
- [ ] Mock/stub policies established?
- [ ] CI/CD gate criteria specified?
- [ ] Test data management rules set?

**Exit criteria:** Every rule in the constitution is machine-enforceable or has explicit human review point.

---

## Phase SDD-2: Blueprint Creation Checklist

Use when creating specifications before implementation.

### Functional Specification
- [ ] All user stories written in standard format?
- [ ] Every story has acceptance criteria?
- [ ] Requirements have unique IDs (REQ-DOMAIN-###)?
- [ ] Edge cases documented for each requirement?
- [ ] Error states explicitly defined?
- [ ] Non-functional requirements have metrics?

### Technical Specification
- [ ] Architecture diagram created?
- [ ] Data models have exact field types and constraints?
- [ ] API contracts fully defined (request/response schemas)?
- [ ] Component contracts have exact method signatures?
- [ ] Error handling documented per component?
- [ ] Performance budgets assigned per component?

### Task Specification
- [ ] Tasks are atomic (one conceptual change)?
- [ ] Each task has `input_context_files` list?
- [ ] Each task has `definition_of_done` with signatures?
- [ ] Task dependencies form valid DAG (no cycles)?
- [ ] Layer ordering enforced (foundation → logic → surface)?
- [ ] Each task has verification commands?

### Traceability Matrix
- [ ] Every requirement has corresponding task(s)?
- [ ] Every task traces to requirement(s)?
- [ ] No requirements have empty "Covered by Task" column?
- [ ] Test cases link to requirements they validate?
- [ ] Traceability matrix passes automated checks?

### Blueprint Completeness
- [ ] Intent documents exist for major features?
- [ ] All acceptance criteria are testable?
- [ ] No ambiguous language ("fast", "secure", "simple")?
- [ ] All domain terms defined in glossary?
- [ ] Examples provided for complex requirements?

**Exit criteria:** Traceability matrix shows 100% coverage from requirements to tasks.

---

## Phase SDD-3: Superhuman Output Verification Checklist

Use when verifying AI-generated code meets superhuman standards.

### Namespace Perfection
- [ ] Zero naming collisions across codebase?
- [ ] Naming conventions followed 100%?
- [ ] No magic strings or numbers?
- [ ] Constants extracted and properly named?
- [ ] No duplicate function/variable names in scope?

### Test Coverage
- [ ] 100% line coverage achieved?
- [ ] 100% branch coverage achieved?
- [ ] All edge cases have tests?
- [ ] All error paths have tests?
- [ ] Tests are deterministic (no flaky tests)?

### Structural Rigidity
- [ ] File structure matches constitution exactly?
- [ ] Function lengths within limits?
- [ ] Cyclomatic complexity within limits?
- [ ] Dependency direction enforced (no circular imports)?
- [ ] Layer boundaries respected?

### Traceability Completeness
- [ ] Every function has requirement reference in comments?
- [ ] Every test has requirement reference?
- [ ] Traceability matrix updated with code locations?
- [ ] No orphan code (code without requirement trace)?
- [ ] No orphan requirements (requirements without code)?

### Documentation Completeness
- [ ] Every public function documented?
- [ ] Every public type/interface documented?
- [ ] Every API endpoint documented?
- [ ] All parameters and return values described?
- [ ] Examples included for complex APIs?

### Error Handling Completeness
- [ ] Every external call has error handling?
- [ ] Every async operation has error handling?
- [ ] All error messages are user-friendly?
- [ ] All errors are logged with context?
- [ ] Recovery paths exist for recoverable errors?

### Constitution Compliance
- [ ] Linting passes with zero warnings?
- [ ] Type checking passes with zero errors?
- [ ] Security scanning passes?
- [ ] Performance budgets met?
- [ ] All anti-patterns avoided?

**Exit criteria:** Code quality is impossible to achieve manually. Deviations are immediately visible.

---

## Phase 0: Loyalty Audit

Use BEFORE any other checklist. This is the foundation.

### Architectural Commitment Inventory
- [ ] What architectural decisions have we committed to?
- [ ] What patterns have we chosen and must maintain?
- [ ] What API contracts exist that we must honor?
- [ ] What deprecation timelines have we promised?

### The Betrayal Test
For any proposed change:
- [ ] Does this honor or break our existing commitments?
- [ ] Are we improving within constraints, or abandoning ship?
- [ ] Would we feel ashamed explaining this change to someone who trusted our previous commitment?
- [ ] Is this "optimization" or "betrayal"?

### The Shiny Object Test
- [ ] Is this change driven by genuine need or trend-chasing?
- [ ] Would we consider this if it weren't currently popular?
- [ ] Are we solving OUR problem or copying someone else's solution?
- [ ] Have we given our current approach enough time/effort?

### Loyalty-Preserving Alternatives
- [ ] Can we achieve the goal while honoring existing commitments?
- [ ] Is there a way to evolve rather than replace?
- [ ] What's the minimum viable change that doesn't betray?

### When Betrayal Is Justified
(These are rare. Be honest.)
- [ ] The original commitment was made with incorrect information
- [ ] External circumstances have fundamentally changed
- [ ] Continuing would cause genuine harm
- [ ] We've communicated the change to affected parties
- [ ] We accept the trust cost

**Exit criteria:** I can honestly say I'm improving, not betraying.

---

## Phase 1: Domain Discovery Checklist

Use before ANY technical discussion.

### Problem Understanding
- [ ] Can I explain the problem in domain terms, not technical terms?
- [ ] Do I know who the actual users are?
- [ ] Do I understand what "success" looks like to users?
- [ ] Have I identified domain-specific vocabulary?

### Domain Complexity
- [ ] What are the edge cases in this domain?
- [ ] What happens when the "happy path" doesn't apply?
- [ ] What domain rules seem simple but have hidden complexity?
- [ ] What domain knowledge am I missing?

### Stakeholder Understanding
- [ ] Who cares if this works?
- [ ] Who cares if this fails?
- [ ] Who has domain expertise I should consult?
- [ ] What competing interests exist between stakeholders?

### Domain Constraints
- [ ] What regulatory requirements apply?
- [ ] What industry standards must be followed?
- [ ] What domain-specific compliance exists?
- [ ] What domain assumptions should I challenge?

**Exit criteria:** I can explain the problem to a domain expert and they would nod, not correct me.

---

## Phase 2: Systems Thinking Checklist

Use when mapping dependencies and failure modes.

### Dependency Mapping
- [ ] What internal systems does this depend on?
- [ ] What external systems does this depend on?
- [ ] What depends on THIS system?
- [ ] Have I drawn the dependency diagram?

### External Dependency Audit
For each external dependency:
- [ ] What version are we using?
- [ ] When was it last updated?
- [ ] What's their breaking change policy?
- [ ] Do we have monitoring for their failures?
- [ ] What's our fallback if they disappear?

### Failure Mode Analysis
- [ ] What happens when [component A] fails?
- [ ] What happens when [external API] is slow?
- [ ] What happens when [database] is unavailable?
- [ ] What cascading failures are possible?
- [ ] What silent failures are possible?

### Monitoring & Alerting
- [ ] How do we know if this is working?
- [ ] How do we know if this is broken?
- [ ] Who gets alerted when it fails?
- [ ] What's the time-to-detection?
- [ ] What's the time-to-recovery?

### Scale Considerations
- [ ] What's the current scale?
- [ ] What scale do we need in 12 months?
- [ ] What breaks at 10x scale?
- [ ] What breaks at 100x scale?

**Exit criteria:** I can trace any failure to its impact and know who gets paged.

---

## Phase 3: Constraint Mapping Checklist

Use before proposing solutions.

### Technical Constraints
- [ ] What existing systems can't be changed?
- [ ] What data formats are locked in?
- [ ] What APIs must we maintain?
- [ ] What performance requirements exist?
- [ ] What security requirements exist?

### Organizational Constraints
- [ ] Which teams own which components?
- [ ] What approval chains exist?
- [ ] Who has authority to approve this?
- [ ] Who has context but not authority?
- [ ] Who has authority but not context?

### Business Constraints
- [ ] What's the budget?
- [ ] What's the timeline?
- [ ] What compliance requirements apply?
- [ ] What contracts constrain us?
- [ ] What vendor relationships affect this?

### Political Constraints
(These exist. Ignoring them causes failed projects.)
- [ ] Whose system would this change affect?
- [ ] Who built the current system? Are they still here?
- [ ] Which teams have historically resisted changes?
- [ ] What past decisions are politically sensitive?
- [ ] Who needs to be consulted even if not required?

### The Shippability Test
- [ ] Can this actually ship given our constraints?
- [ ] What would prevent this from shipping?
- [ ] Who could block this and why?
- [ ] What's the minimum viable version that ships?

**Exit criteria:** I know what's fixed vs. flexible and what could block shipping.

---

## Phase 4: AI Decomposition Checklist

Use when breaking work into AI-solvable chunks.

### Task Boundary Quality
For each AI task:
- [ ] Is the input clearly defined?
- [ ] Is the expected output clearly defined?
- [ ] Can success be objectively verified?
- [ ] Does the task have bounded scope?

### Context Completeness
For each AI task:
- [ ] Does the AI have all needed information?
- [ ] Are there hidden assumptions the AI would need to know?
- [ ] Is the context self-contained?
- [ ] Can the task be understood without external knowledge?

### Failure Handling
For each AI task:
- [ ] What happens if this task fails?
- [ ] Can we retry safely?
- [ ] Does failure cascade to other tasks?
- [ ] Is there a fallback strategy?

### Independence Assessment
- [ ] Can tasks run in parallel?
- [ ] What sequential dependencies exist?
- [ ] What shared state would cause conflicts?
- [ ] What's the critical path?

### Verification Points
- [ ] Where do humans verify AI output?
- [ ] What verification criteria exist?
- [ ] How long does verification take?
- [ ] What happens if verification fails?

### Composition Planning
- [ ] How do AI outputs integrate?
- [ ] What gaps exist between tasks?
- [ ] Who handles the integration?
- [ ] How do we ensure overall coherence?

**Exit criteria:** Each task has clear boundaries, and I know how to verify and compose results.

---

## Phase 5: AI-First Development Checklist

Use when evaluating modern tools, edge AI, agentic patterns, and self-learning capabilities.

### Technology Discovery
- [ ] Could Rust/WASM improve performance for critical paths?
- [ ] Would claude-flow simplify multi-agent orchestration?
- [ ] Does this need persistent memory (agentdb)?
- [ ] Would vector search/RAG enhance the experience?
- [ ] Have I evaluated alternatives to proposed tools?

### Edge AI Evaluation
- [ ] Could edge LLMs reduce latency or API costs?
- [ ] What features should work offline?
- [ ] Is there sensitive data that should stay on-device?
- [ ] Would hybrid local/cloud architecture work?
- [ ] What models fit the device constraints (Phi-3, Gemma, TinyLlama)?
- [ ] Is in-browser inference viable (WebLLM, Transformers.js)?

### Agentic Patterns
- [ ] Is this a candidate for agentic workflow vs. request-response?
- [ ] Would Claude Agent SDK help build reusable agents?
- [ ] What MCP integrations would enhance this?
- [ ] Should agents run in parallel or sequentially?
- [ ] How do agents communicate shared state?

### Self-Learning Capabilities
- [ ] Could feedback loops improve accuracy over time?
- [ ] What user corrections could train the system?
- [ ] Where can we capture implicit signals (edits, time, acceptance)?
- [ ] Would A/B experimentation help optimize behavior?
- [ ] Can we fine-tune on domain-specific usage?
- [ ] How do we measure if learning is working?

### User-Facing Skills
- [ ] Would end users benefit from skills that enhance AI outputs?
- [ ] What interpretation skills help users understand responses?
- [ ] What action skills turn suggestions into next steps?
- [ ] Should we provide domain-specific skills (/legal-review, /code-refactor)?
- [ ] What transformation skills convert outputs to useful formats?

### Project Documentation
- [ ] Should we create a project-specific SKILLS.md?
- [ ] What domain vocabulary needs documenting for AI context?
- [ ] What architectural decisions should persist across sessions?
- [ ] How do we ensure consistent behavior?

### Continuous Verification
- [ ] What automated tests verify each feature?
- [ ] Are pre-commit hooks running affected tests?
- [ ] Is watch mode enabled during development?
- [ ] What's the rollback strategy if tests fail post-deploy?
- [ ] Are integration tests covering API contracts?
- [ ] Is visual regression testing needed for UI?

**Exit criteria:** I've evaluated modern tools, decided what benefits the project, and planned for automated verification.

---

## Phase 6: Solution Validation Checklist

Use before finalizing recommendations.

### Domain Fit
- [ ] Does this actually solve the domain problem?
- [ ] Would a domain expert agree this solves their problem?
- [ ] Have I validated with stakeholders?
- [ ] Does the solution match user needs?

### Systems Fit
- [ ] Does this work with existing dependencies?
- [ ] Have I addressed failure modes?
- [ ] Is monitoring and alerting planned?
- [ ] Does this fit within scale requirements?

### Constraint Fit
- [ ] Does this fit technical constraints?
- [ ] Does this fit organizational constraints?
- [ ] Does this fit budget and timeline?
- [ ] Can this actually ship?

### Tradeoff Transparency
- [ ] Have I made tradeoffs explicit?
- [ ] Do stakeholders understand what we're giving up?
- [ ] Are there options with different tradeoff profiles?
- [ ] Is the recommended tradeoff justified?

### Implementation Readiness
- [ ] Is the approach detailed enough to implement?
- [ ] Are AI task boundaries defined?
- [ ] Are verification points established?
- [ ] Is the critical path identified?

**Exit criteria:** Solution addresses domain needs, fits constraints, and can ship.

---

## Quick Pre-Meeting Checklist

Before architectural discussions:

### Before I propose anything:
- [ ] Have I asked about the domain?
- [ ] Have I mapped dependencies?
- [ ] Have I asked about constraints?
- [ ] Do I know what can't change?

### Before I agree to anything:
- [ ] Can this actually ship?
- [ ] Who needs to approve?
- [ ] What's the timeline?
- [ ] What could block this?

### Before I decompose for AI:
- [ ] Are tasks bounded?
- [ ] Can outputs be verified?
- [ ] Where do humans checkpoint?
- [ ] How do pieces integrate?

### Before I choose tools/patterns:
- [ ] Have I evaluated edge AI options?
- [ ] Would agentic workflows simplify this?
- [ ] Could self-learning benefit users?
- [ ] Is automated testing planned?

---

## Red Flags Checklist

Warning signs that architectural thinking is missing:

### Domain Red Flags
- [ ] Solution discussed before problem understood
- [ ] Technical terms used, domain terms missing
- [ ] "Users" mentioned generically without specifics
- [ ] Edge cases dismissed as "rare"

### Systems Red Flags
- [ ] No dependency diagram exists
- [ ] External APIs treated as always available
- [ ] "We'll add monitoring later"
- [ ] Single points of failure not identified

### Constraint Red Flags
- [ ] "In an ideal world..." framing
- [ ] Legacy systems dismissed as "bad"
- [ ] Political constraints ignored
- [ ] Budget/timeline not discussed

### AI Decomposition Red Flags
- [ ] "AI can just figure it out"
- [ ] Tasks like "make it better"
- [ ] No verification points planned
- [ ] Integration assumed to be easy

### AI-First Development Red Flags
- [ ] Adding tools without evaluating simpler alternatives
- [ ] "We need AI" without clear use case
- [ ] Edge AI dismissed without latency/cost analysis
- [ ] No automated testing planned for AI features
- [ ] Self-learning assumed without feedback mechanism
- [ ] User-facing skills not considered for complex outputs
- [ ] No rollback strategy for AI failures

**If any red flags are checked:** Stop and address before proceeding.

---

## Post-Mortem Checklist

After failures or surprises:

### What broke?
- [ ] What was the direct cause?
- [ ] What was the root cause?
- [ ] Was this a known failure mode?
- [ ] Was monitoring in place?

### Why didn't we see it coming?
- [ ] Did we miss a dependency?
- [ ] Did we miss a constraint?
- [ ] Did we ignore a warning sign?
- [ ] Did external factors change?

### Domain Learning
- [ ] What domain knowledge were we missing?
- [ ] Who should we have consulted?
- [ ] What assumption was wrong?

### Systems Learning
- [ ] What dependency failed?
- [ ] What cascade occurred?
- [ ] What monitoring was missing?

### Process Improvement
- [ ] What checklist item would have caught this?
- [ ] What question should we have asked?
- [ ] What constraint did we miss?
- [ ] How do we prevent this class of failure?


## REF: EXAMPLES.md

# Human Architect Mindset - Examples

Real-world scenarios demonstrating the five pillars in action.

---

## Example 1: The Payment Pipeline Failure

**Scenario:** Your payment pipeline broke. Red lines in logs. The backend provider (capital S) released a breaking SDK change with no notification.

### What Happened (Systems Thinking Failure)

**The failure:**
- External dependency changed without warning
- No monitoring for SDK version changes
- Breaking change detected only via production errors
- Time-to-detection: Hours? Days?

**The gap:**
- Treated external SDK as stable
- No fallback strategy
- No version pinning strategy communicated
- Provider's changelog not monitored

### Architect Thinking Applied

**Phase 2 (Systems Analysis) would have asked:**
1. "What external systems does this depend on?"
   - Payment provider SDK (external, not controlled)
2. "What happens when this dependency changes?"
   - Currently: Production breaks
   - Should: Canary deployment, version monitoring
3. "Do we have monitoring for their failures?"
   - Partial: Error logs caught it
   - Missing: SDK version change detection, changelog monitoring

**Phase 3 (Constraints) would have asked:**
1. "What's our contract with this provider?"
   - Do they guarantee backwards compatibility?
   - What's their deprecation policy?
2. "What's our fallback?"
   - Alternative provider?
   - Graceful degradation?

### Better Architecture

```
Current:
[App] -> [SDK v1.2] -> [Provider]
         ^-- Breaking change here, no warning

Better:
[App] -> [SDK Wrapper] -> [SDK vX] -> [Provider]
              |                ^
              |                |-- Version pinned, tested
              |-- Abstraction layer
              |-- Fallback logic
              |-- Provider change monitoring
```

**AI Decomposition for Fix:**

Good task boundaries:
- "Create SDK wrapper interface with current SDK calls"
- "Add version monitoring that alerts on SDK updates"
- "Write fallback logic for provider unavailability"

Bad task boundary:
- "Fix the payment system to never break again"

### Lesson

External dependencies are external risk. Systems thinking maps this risk BEFORE it bites.

---

## Example 2: Healthcare API Integration

**Scenario:** You need to integrate with a hospital's EHR (Electronic Health Record) system for a healthcare app.

### Domain Modeling Required

**Domain questions an architect asks:**

1. "What does 'patient data' mean in this context?"
   - Demographics? Medical history? Current medications?
   - Different data = different compliance requirements

2. "What's HIPAA mean for our architecture?"
   - Encryption at rest and in transit
   - Audit logging of all access
   - BAA (Business Associate Agreement) required
   - Data residency requirements

3. "What's the domain vocabulary?"
   - HL7 FHIR? CCD? ADT messages?
   - ICD-10 codes? CPT codes?
   - Understanding these is prerequisite to implementation

4. "What are the edge cases?"
   - Patient with multiple records (duplicate detection)
   - Emergency override access
   - Corrections and amendments
   - Minor patients (different consent rules)

### Constraint Navigation

**Technical constraints:**
- Hospital system uses HL7 v2.x (1990s protocol)
- No REST API, only file-based EDI
- 24-hour batch processing, not real-time

**Organizational constraints:**
- Hospital IT team reviews all integrations
- 90-day approval cycle
- Requires penetration testing

**Compliance constraints:**
- HIPAA Security Rule
- State-specific healthcare laws
- Insurance portability requirements

**Political constraints:**
- Hospital's existing vendor has exclusive relationship
- IT team resistant to new integrations
- Physician workflow changes require medical director sign-off

### Architect Thinking Applied

**Phase 1 (Domain Discovery):**
```
Q: What problem are we solving?
A: Patients want their records accessible in our app.

Q: What's the real problem?
A: Actually, physicians want to see records from other
   systems. Patients are secondary.

Q: Who needs to approve access to this data?
A: The patient (consent), the hospital (BAA), and
   the physician (medical necessity).
```

**Phase 3 (Constraints):**
```
Q: What can't we change?
A: The hospital's HL7 v2.x interface. It's 20 years old.

Q: What's the timeline?
A: 6 months, but hospital approval is 90 days.

Q: Who blocks this?
A: Hospital IT manager. Previous integration broke their system.
```

**The "correct" solution (REST API, real-time sync) is unshippable.**

**The shippable solution:**
- Batch file processing on hospital's terms
- Their approval cycle factored into timeline
- Build relationship with IT manager before technical work

### AI Decomposition

**Good boundaries:**
- "Parse HL7 v2.x ADT message into patient demographics object"
- "Generate FHIR Patient resource from internal patient model"
- "Write audit log entry for each data access with required HIPAA fields"

**Bad boundaries:**
- "Build the healthcare integration"
- "Handle HIPAA compliance"

---

## Example 3: Multi-Team Feature Rollout

**Scenario:** You're building a feature that requires changes from three teams: Backend, Mobile, and Data.

### Political Constraint Navigation

**The teams:**
- **Backend team:** Owns the API. Busy with their own roadmap.
- **Mobile team:** Ships every 2 weeks. Behind on bugs.
- **Data team:** New team. Proving themselves. Eager but inexperienced.

**The politics:**
- Backend team lead doesn't like being told what to do
- Mobile team is underwater, will resist new work
- Data team wants to use new technology (Kafka) that others don't trust

### Architect Thinking Applied

**Phase 3 (Constraint Mapping):**

```
Q: Who needs to approve this?
A: Each team lead, plus the director for cross-team work.

Q: Who has context vs. who has authority?
A:
   - Backend lead: Authority over API, context on system
   - Mobile lead: Authority over app, no context on backend changes
   - Data lead: Context on data flow, limited authority (new)
   - Director: Authority over all, limited context on details

Q: What past decisions are politically sensitive?
A: Last cross-team project blamed Backend when it failed.
   They're defensive now.

Q: What can't we change, even if it's "wrong"?
A: Mobile's 2-week release cycle. It's contractual with App Store.
```

**The "correct" technical solution:**
- Coordinated release across all three systems
- Shared schema owned by... someone?
- Feature flag for gradual rollout

**The shippable solution:**
- Backend API designed to be backwards compatible
- Mobile can release whenever (no coordination needed)
- Data team gets small scope to prove themselves
- Feature flag owned by Backend (they trust themselves)

### Systems Thinking for Dependencies

```
Dependency Map:

[Mobile App] --> [Backend API] --> [Database]
                      |
                      v
                [Data Pipeline] --> [Analytics]

Failure scenarios:
- Backend deploys first: Mobile shows errors (old client, new API)
- Mobile deploys first: Works but no new features
- Data deploys first: No data flowing yet
- Coordinated deploy: Single point of failure (one failure blocks all)

Better:
- Backend: Additive changes only, old endpoints stay
- Mobile: Feature flag client-side, enable when ready
- Data: Parallel pipeline, switch over when validated
```

### AI Decomposition for Cross-Team Work

**Task boundaries that respect team ownership:**

For Backend team:
- "Add new endpoint /v2/feature that returns X"
- "Add feature flag check to existing endpoint"

For Mobile team:
- "Add local feature flag for new feature UI"
- "Update API client to call v2 endpoint when flag enabled"

For Data team:
- "Create new data pipeline that reads from X, writes to Y"
- "Add validation that compares old pipeline to new"

**Human checkpoints:**
- Each team verifies their own work
- Integration test when all ready
- Director approves rollout

---

## Example 4: AI-Assisted Legacy Refactoring

**Scenario:** You have a 10,000-line monolithic file that needs refactoring. You want AI to help.

### Why "Refactor This" Fails

**Bad AI task:**
```
"Refactor legacy_system.py into clean modules"
```

**Why it fails:**
- No clear success criteria
- Unbounded scope
- No verification possible
- Context too large for AI to hold

### AI Decomposition Done Right

**Phase 4 (AI Decomposition Planning):**

**Step 1: Understand the system (human work)**
```
Q: What does this file actually do?
A: Handles user authentication, session management,
   and permission checking.

Q: What are the natural boundaries?
A:
   - Authentication (login, logout, password reset)
   - Session (create, validate, expire)
   - Permissions (check, grant, revoke)

Q: What are the dependencies between these?
A:
   - Permissions depends on Session (need valid session to check)
   - Session depends on Authentication (need login to create session)
   - All depend on database layer
```

**Step 2: Define bounded AI tasks**

Task 1: Extract authentication functions
```
Input: Lines 100-500 of legacy_system.py (authentication logic)
Output: auth.py with same interface, passing existing tests
Verification: All auth_test.py tests pass
```

Task 2: Extract session functions
```
Input: Lines 501-900 of legacy_system.py (session logic)
Output: session.py with same interface, passing existing tests
Verification: All session_test.py tests pass
```

Task 3: Extract permission functions
```
Input: Lines 901-1500 of legacy_system.py (permission logic)
Output: permissions.py with same interface, passing existing tests
Verification: All permission_test.py tests pass
```

**Step 3: Human checkpoints**

After each extraction:
- [ ] Tests still pass
- [ ] Interface unchanged
- [ ] No subtle behavior changes
- [ ] Original file still works with extracted module

**Step 4: Integration (human work)**
- Update imports across codebase
- Verify full system tests pass
- Remove duplicated code from original file

### Good vs Bad Task Examples

**Bad:**
- "Make the code better"
- "Add proper error handling"
- "Refactor for readability"

**Good:**
- "Extract the `authenticate_user` function and its helpers (lines 100-200) into `auth.py`, maintaining the existing function signature"
- "Add try/except around the database call on line 150, catching `DatabaseError` and re-raising as `AuthenticationError`"
- "Rename the variable `x` on line 175 to `user_session` and update all references in this function"

### Verification Strategy

```
For each AI task:
1. Run existing tests (should pass before)
2. Apply AI change
3. Run existing tests (should still pass)
4. Run new tests for extracted module
5. Human review for subtle issues:
   - Did AI change behavior, not just structure?
   - Are there side effects not covered by tests?
   - Does the change fit the overall architecture?
```

---

## Example 5: The "Simple" Feature Request

**Scenario:** Product manager says "Just add a delete button to user profiles."

### Why "Simple" Is Dangerous

**Surface request:** Add a delete button.

**Domain questions an architect asks:**

1. "What does 'delete' mean?"
   - Soft delete? Hard delete?
   - Delete user? Delete profile? Delete account?
   - What about their content?

2. "What regulations apply?"
   - GDPR right to erasure?
   - California CCPA?
   - Data retention requirements?

3. "What happens to related data?"
   - User's posts? Comments? Messages?
   - Payment history? Invoices?
   - Audit logs?

### Systems Thinking

```
Q: What depends on User?

[User Profile]
    ^
    |-- [Posts] (has user_id foreign key)
    |-- [Comments] (has user_id foreign key)
    |-- [Messages] (has sender_id and recipient_id)
    |-- [Orders] (has user_id, but also legal record)
    |-- [Payment Methods] (PCI compliance)
    |-- [Audit Logs] (compliance - can't delete)
    |-- [Analytics Events] (has user_id)
```

**Cascading effects:**
- Delete user = orphan posts, comments, messages
- Delete payment methods = might need to keep for tax
- Delete orders = legal and accounting issues
- Delete audit logs = compliance violation

### Constraints

**Technical:**
- Foreign key constraints prevent simple delete
- Analytics pipeline expects user_id to exist

**Business:**
- Legal requires 7-year retention for financial data
- Support needs to access deleted user history for disputes

**Regulatory:**
- GDPR: Must delete within 30 days of request
- Tax law: Must retain invoices for 7 years

**The "correct" solution (hard delete everything) is illegal.**

### The Shippable Solution

```
Account Deletion Architecture:

1. Immediate (user-facing):
   - Mark account as "deleted"
   - Remove from search/listings
   - Anonymize public content
   - Revoke access tokens

2. 30-day window:
   - User can recover account
   - Data retained but inaccessible

3. After 30 days:
   - Delete PII
   - Retain financial records (anonymized)
   - Retain audit logs (anonymized)
   - Delete analytics user_id mapping

4. Never delete:
   - Audit logs of deletion itself
   - Financial records (7 years)
```

### AI Decomposition

**Good boundaries:**
- "Add `deleted_at` timestamp column to users table"
- "Update user query to exclude soft-deleted users"
- "Create anonymization function for user profile fields"
- "Add deletion request to audit log"

**Bad boundaries:**
- "Implement user deletion"
- "Handle GDPR compliance"

---

## Example 6: The Framework Migration Temptation

**Scenario:** Your team has used React for 3 years. A new framework (call it "HypeJS") is trending. Benchmarks show it's 20% faster. Twitter loves it. Your junior developers want to migrate.

### The Optimization Argument

"HypeJS is faster. Modern. Growing community. We should migrate."

### The Loyalty Analysis

**Commitment inventory:**
- 3 years of React investment
- Team expertise built in React patterns
- Component library tailored to React
- All tutorials/docs written for React
- Third-party integrations assume React

**What migration actually costs:**
- 6+ months of rewriting (not building features)
- Learning curve productivity loss
- Risk of HypeJS being abandoned (new frameworks die)
- Loss of accumulated optimization knowledge
- All past architectural decisions need re-evaluation

**The loyalty questions:**
- "Are we solving a problem or chasing a trend?"
- "Would we consider this if it weren't popular right now?"
- "Have we invested enough in making React work?"
- "What's the REAL performance problem? (Hint: probably not React)"

### The Architect's Response

**Instead of migrating:**
1. Profile actual performance issues (they're probably in YOUR code)
2. Apply React-specific optimizations (memoization, code splitting)
3. Upgrade React version for any framework-level gains
4. Revisit in 2 years when HypeJS has proven longevity

**The loyal answer:**
"We committed to React. React is not our problem. Our implementation is. Let's fix our code, not blame our framework."

### When Migration IS Justified

- React is actually end-of-life (not just "old")
- Your specific use case has proven React incompatible
- You've invested significantly in optimization and hit real walls
- You've communicated timeline to all stakeholders
- New framework has 3+ years of stability (not trending, proven)

### The Pattern

Most framework migrations are betrayals dressed as optimizations.

The loyal architect asks: "Have we truly exhausted our commitment, or are we just bored?"

---

## Example 7: AI-First Development for a Legal Document Assistant

**Scenario:** You're building a legal document review app. Users upload contracts, the AI extracts key terms, flags risks, and suggests edits.

### Technology Discovery

**The questions an architect asks:**

1. "Could performance-critical paths benefit from Rust/WASM?"
   - PDF parsing: Yes, CPU-intensive
   - Text extraction: Maybe, depends on volume
   - AI inference: Cloud API, not applicable
   - Decision: Use Rust via WASM for PDF parsing

2. "Would multi-agent orchestration simplify this?"
   - claude-flow for parallel clause analysis: Yes
   - Each clause type can be analyzed independently
   - Decision: Use claude-flow for parallel agents

3. "Does this need persistent memory?"
   - Cross-session memory for user preferences: Yes
   - Remember previous contract patterns: Yes
   - Decision: Use agentdb for user context

### Edge AI Evaluation

**The questions:**

1. "Could edge LLMs reduce latency or protect privacy?"
   - Legal documents are highly confidential
   - Some clients prohibit cloud processing
   - Basic extraction could run locally
   - Complex reasoning still needs cloud

2. "What should work offline?"
   - Document preview: Yes
   - Basic text extraction: Yes
   - Risk flagging: Hybrid (local for common, cloud for complex)
   - Suggestions: Cloud required

**Architecture decision:**

```
Hybrid Architecture:

[Document] → [Local: WASM PDF Parser] → [Local: Phi-3 for initial extraction]
                                                    ↓
                    [Privacy check: Contains PII? High confidentiality?]
                           ↓                              ↓
                        [Local]                        [Cloud]
                    (Gemma 2B for                (Claude for complex
                     basic tagging)              reasoning/suggestions)
```

### Self-Learning Capabilities

**The questions:**

1. "Could this app learn from user behavior?"
   - Users correct AI extractions → train on corrections
   - Users accept/reject suggestions → learn preferences
   - Users edit AI drafts → improve future drafts

2. "What feedback loops make sense?"
   - **Explicit:** "Was this extraction correct?" thumbs up/down
   - **Implicit:** Did user edit the suggestion? Track edit distance
   - **Domain:** This client's contracts use specific terminology

**Self-learning architecture:**

```
Feedback Loop:

[AI Suggestion] → [User Action]
                       ↓
              ┌───────────────────┐
              │ Accept unchanged  │ → High confidence signal
              │ Minor edit        │ → Track pattern
              │ Major rewrite     │ → Negative signal, learn from correction
              │ Delete/ignore     │ → Strong negative signal
              └───────────────────┘
                       ↓
         [Aggregate feedback per user/domain]
                       ↓
         [Fine-tune prompts or model adapters]
```

### User-Facing Skills

**The questions:**

1. "Would users benefit from skills that enhance AI outputs?"
   - `/explain-clause` - Explain legal jargon in plain English
   - `/compare-versions` - Show differences between contract versions
   - `/risk-summary` - Generate executive summary of risks
   - `/suggest-negotiation` - Suggest negotiation points

2. "What transformation skills help users?"
   - `/export-to-word` - Format AI analysis as Word document
   - `/create-checklist` - Turn risks into action checklist
   - `/draft-response` - Draft response to counterparty

**Skill architecture:**

```
User-Facing Skills:

/explain-clause <clause>
  Input: Selected clause text
  Process: Simplify legal language, add examples
  Output: Plain English explanation with key implications

/risk-summary
  Input: Full contract analysis
  Process: Aggregate risks, prioritize by severity
  Output: Executive summary with top 5 risks, actions needed

/draft-response <risk>
  Input: Identified risk
  Process: Generate negotiation language
  Output: Suggested contract edit or email response
```

### Continuous Verification

**The questions:**

1. "What automated tests verify each feature?"
   - Unit tests: Extraction accuracy on known documents
   - Integration tests: Full pipeline from upload to analysis
   - Regression tests: Previous contracts should still work
   - Visual tests: UI renders correctly

2. "How do we test AI behavior?"
   - Golden set: 50 contracts with human-verified extractions
   - Accuracy threshold: 95% extraction accuracy
   - Regression: New models must match or exceed baseline

**Testing architecture:**

```
Continuous Verification Pipeline:

[Code Change] → [Pre-commit: Unit tests] → [CI: Integration tests]
                                                    ↓
                                          [Golden set evaluation]
                                                    ↓
                                    [Accuracy > 95%?] ──No──→ [Block deploy]
                                           ↓ Yes
                                    [Canary deploy to 5%]
                                           ↓
                                    [Monitor error rates 24h]
                                           ↓
                                    [Full rollout or rollback]
```

### Project-Specific SKILLS.md

For this legal document app, create a SKILLS.md:

```markdown
# Legal Document Assistant - Project Skills

## Domain Vocabulary
- "Clause" = Numbered paragraph in contract
- "Red flag" = High-risk term requiring attention
- "Boilerplate" = Standard language, low risk
- "Material term" = Key business term (price, dates, scope)

## AI Patterns
- Always use claude-flow for clause analysis
- Phi-3 for initial extraction, Claude for reasoning
- Minimum confidence threshold: 0.8 for auto-accept

## Testing Requirements
- All extractions must be verified against golden set
- New clause types require 10+ examples before deployment
- User feedback must be reviewed weekly

## Architectural Decisions
- Hybrid local/cloud for privacy flexibility
- Self-learning enabled, but requires 100+ signals before adaptation
- Skills exposed to users: /explain, /risk-summary, /draft-response
```

### The Complete Picture

**5th Pillar applied:**

| Area | Decision | Reasoning |
|------|----------|-----------|
| **Performance** | Rust/WASM for PDF parsing | CPU-intensive, latency-sensitive |
| **Multi-agent** | claude-flow for parallel clause analysis | Independent tasks, faster processing |
| **Edge AI** | Phi-3/Gemma for local extraction | Privacy, offline capability |
| **Cloud AI** | Claude for complex reasoning | Accuracy critical for legal |
| **Self-learning** | Feedback loops on user actions | Improve over time, per-user/domain |
| **User skills** | /explain, /risk-summary, /draft-response | Help users act on AI outputs |
| **Testing** | Golden set + accuracy thresholds | AI behavior must be verifiable |

**The lesson:** AI-First Development is about evaluating which modern patterns genuinely benefit the project, not adopting everything because it's new.

---

## Pattern Summary

Across all examples, the architect mindset:

1. **Maintains loyalty to architectural commitments**
2. **Asks domain questions before technical ones**
3. **Maps systems and dependencies before changes**
4. **Surfaces constraints before proposing solutions**
5. **Defines bounded AI tasks with verification**
6. **Plans human checkpoints for judgment calls**
7. **Evaluates AI-first patterns critically** - edge AI, self-learning, user skills
8. **Plans continuous verification** - automated testing for every feature

The "simple" solution is rarely shippable. The shippable solution is rarely simple.

**And the "better" solution that betrays existing commitments is often not better at all.**

**Modern tools are opportunities, not requirements.** Evaluate genuinely, adopt selectively.


## REF: REFERENCE.md

# Human Architect Mindset - Reference

Deep technical reference material for the foundation and each pillar.

---

## Loyalty Patterns in Architecture

### The Commitment Spectrum

```
BETRAYAL ←──────────────────────────────────→ LOYALTY

Rewrite everything     Evolve incrementally
Chase every trend      Stick with proven choices
Break APIs freely      Maintain backwards compatibility
Abandon on difficulty  Push through problems
Optimize locally       Sacrifice for coherence
```

### Architectural Loyalty Anti-Patterns

**The Endless Pivot**
- Symptoms: "We're migrating to X" every 6 months
- Root cause: Lack of commitment, not lack of tools
- Fix: Commit to current stack for defined period

**The Greenfield Fallacy**
- Symptoms: "If we just started over..."
- Root cause: Underestimating rewrite cost, overestimating new system
- Fix: Invest in existing system instead

**The Trend Chase**
- Symptoms: Architecture decisions based on Hacker News front page
- Root cause: External validation over internal coherence
- Fix: Decision criteria based on YOUR context, not industry hype

**The Premature Abstraction**
- Symptoms: Building for hypothetical scale/requirements
- Root cause: Optimizing for imaginary future, betraying present needs
- Fix: Solve today's problem. Evolve when needed.

**The Shiny Object Syndrome**
- Symptoms: Every new project uses a different stack
- Root cause: Boredom masked as technical justification
- Fix: Recognize that mastery requires commitment

### Loyalty-Preserving Practices

**Decision Records**
- Document WHY you chose this architecture
- Reference when tempted to switch
- Update only with genuine new information

**Commitment Windows**
- "We will use X for at least 2 years before reconsidering"
- Creates space for learning curve and optimization
- Prevents impulse pivots

**Deprecation Rituals**
- Formal process for breaking commitments
- Requires justification, stakeholder notification
- Makes betrayal conscious, not casual

**The Strangler Fig**
- When change IS needed, evolve gradually
- New system grows around old, doesn't replace suddenly
- Honors existing commitments while enabling transition

### The Loyalty Decision Matrix

| Situation | Optimization Response | Loyal Response |
|-----------|----------------------|----------------|
| New framework is 20% faster | Migrate | Profile YOUR code first |
| Dependency has security issue | Replace entirely | Patch or fork |
| Team wants to try new tech | Greenfield project | Master current stack |
| Performance is "slow" | Rewrite | Measure, optimize, iterate |
| Code feels "messy" | Full refactor | Incremental improvement |

### When Betrayal Is Justified (The Short List)

1. **Security vulnerability** that cannot be patched
2. **End of life** - Truly unsupported, not just old
3. **Fundamental incompatibility** with proven requirements
4. **Acquisition/merger** that forces alignment
5. **Team consensus** after exhausting alternatives

Even then, prefer evolution over revolution.

---

## Spec Driven Development Templates

### Constitution Template

Use this template to define unbreakable rules for a project.

```xml
<constitution project="[PROJECT-NAME]" version="[VERSION]" effective_date="[DATE]">

  <tech_stack>
    <language name="TypeScript" version="5.3.x" />
    <framework name="Next.js" version="14.x" />
    <database name="PostgreSQL" version="16.x" />
    <runtime name="Node.js" version="20.x" />
  </tech_stack>

  <directory_structure>
    <rule>src/           - All source code</rule>
    <rule>src/components - React components</rule>
    <rule>src/services   - Business logic</rule>
    <rule>src/types      - TypeScript types/interfaces</rule>
    <rule>tests/         - All test files (mirror src/)</rule>
  </directory_structure>

  <naming_conventions>
    <rule type="files">kebab-case.ts for files</rule>
    <rule type="components">PascalCase for React components</rule>
    <rule type="functions">camelCase for functions</rule>
    <rule type="constants">SCREAMING_SNAKE_CASE for constants</rule>
    <rule type="types">PascalCase with prefix (IUser, TResponse)</rule>
  </naming_conventions>

  <anti_patterns>
    <forbidden pattern="any" reason="Type safety violation">
      <detection>TypeScript strict mode</detection>
    </forbidden>
    <forbidden pattern="console.log" reason="Use structured logging">
      <detection>ESLint no-console rule</detection>
    </forbidden>
    <forbidden pattern="string concatenation for SQL" reason="SQL injection risk">
      <detection>Security linter + code review</detection>
    </forbidden>
  </anti_patterns>

  <performance_budgets>
    <budget metric="API p95 latency" limit="200ms" />
    <budget metric="Bundle size" limit="500KB" />
    <budget metric="Memory per instance" limit="512MB" />
  </performance_budgets>

  <testing_requirements>
    <requirement type="unit" coverage_minimum="80%" />
    <requirement type="integration" coverage_minimum="70%" />
    <requirement type="e2e" flows="all critical user journeys" />
  </testing_requirements>

</constitution>
```

### Superhuman Quality Standards Table

| Quality Dimension | Human Standard | Superhuman Standard | Verification Method |
|-------------------|----------------|---------------------|---------------------|
| **Naming** | Mostly consistent | Zero collisions, 100% convention compliance | Automated linting + namespace analysis |
| **Test Coverage** | 70-80% lines | 100% branches, all edge cases | Coverage tools with branch analysis |
| **Structure** | Generally follows patterns | Mathematically consistent (every file same shape) | AST analysis + pattern matching |
| **Traceability** | Comments mention tickets | `// Implements: REQ-AUTH-001` on every function | Traceability matrix automation |
| **Documentation** | Key APIs | Every public interface fully documented | Documentation coverage tools |
| **Error Handling** | Happy path + common errors | Every error state explicitly handled | Error path analysis |
| **Type Safety** | No `any`, mostly typed | Zero implicit types, no casts | TypeScript strict mode |
| **Dependencies** | Up to date | Pinned versions, security-scanned | Dependency analysis tools |

### Traceability Matrix Template

```markdown
# Traceability Matrix

## Requirements to Tasks

| Requirement ID | Description | Tasks | Status |
|----------------|-------------|-------|--------|
| REQ-AUTH-001 | User can register with email | TASK-AUTH-001, TASK-AUTH-002 | ✓ |
| REQ-AUTH-002 | Email must be unique | TASK-AUTH-003 | ✓ |
| REQ-AUTH-003 | Password meets strength requirements | TASK-AUTH-004, TASK-AUTH-005 | In Progress |

## Tasks to Code

| Task ID | Description | Files Modified | Tests |
|---------|-------------|----------------|-------|
| TASK-AUTH-001 | Create User entity | src/entities/user.ts | tests/entities/user.test.ts |
| TASK-AUTH-002 | Create registration endpoint | src/routes/auth.ts | tests/routes/auth.test.ts |
| TASK-AUTH-003 | Add email uniqueness validation | src/services/auth.ts | tests/services/auth.test.ts |

## Coverage Summary

- Requirements covered: 12/15 (80%)
- Tasks completed: 8/12 (67%)
- Test coverage: 85% lines, 78% branches
- Documentation coverage: 100% public APIs
```

### Task Specification Template

```xml
<task_spec id="TASK-[DOMAIN]-[SEQUENCE]" priority="[POSITION]">
  <title>[One-line description]</title>

  <implements>
    <requirement ref="REQ-[DOMAIN]-[###]" />
  </implements>

  <input_context_files>
    <file path="constitution.xml" purpose="Rules and standards" />
    <file path="src/types/user.ts" purpose="Type definitions" />
  </input_context_files>

  <definition_of_done>
    <signature>
      export async function registerUser(dto: RegisterUserDto): Promise<User>
    </signature>
    <tests_pass>true</tests_pass>
    <coverage_minimum>80%</coverage_minimum>
  </definition_of_done>

  <constraints>
    <constraint>Use bcrypt for password hashing (cost factor 12)</constraint>
    <constraint>Email validation per RFC 5322</constraint>
    <constraint>Return 409 Conflict if email exists</constraint>
  </constraints>

  <dependencies>
    <depends_on task="TASK-AUTH-001" reason="User entity must exist first" />
  </dependencies>

  <verification>
    <command>npm test -- --grep "registerUser"</command>
    <command>npm run typecheck</command>
    <command>npm run lint</command>
  </verification>
</task_spec>
```

### Intent Block Template

```xml
<product_intent id="INT-[DOMAIN]-[##]">
  <problem>
    [What pain point are we solving? For whom?]
  </problem>
  <desired_outcome>
    [What will be true when this is solved? Include metrics.]
  </desired_outcome>
  <success_metric>
    [How do we measure success? What threshold defines success?]
  </success_metric>
  <constraints>
    [What cannot change? Regulatory requirements, business rules, etc.]
  </constraints>
</product_intent>
```

---

## Domain Modeling Deep Dive

### What Domain Modeling Actually Is

Domain modeling is **understanding the problem space** - not the solution space.

**Solution space:** APIs, databases, frameworks, deployment
**Problem space:** Users, their needs, business rules, regulatory requirements

Most technical failures are domain failures. The code works perfectly; it just solves the wrong problem.

### Domain Modeling Questions

**For any new domain, ask:**

1. **Who are the actors?**
   - Who initiates actions?
   - Who receives effects?
   - Who has authority?
   - Who has responsibility?

2. **What are the entities?**
   - What "things" exist in this domain?
   - What properties do they have?
   - How do they relate to each other?
   - What's their lifecycle?

3. **What are the processes?**
   - What workflows exist?
   - What triggers them?
   - What are the steps?
   - What can go wrong?

4. **What are the rules?**
   - What constraints exist?
   - What's allowed? What's forbidden?
   - What exceptions exist?
   - Who can override rules?

5. **What's the vocabulary?**
   - What terms have specific meanings?
   - What terms have multiple meanings?
   - What terms do users say vs. what systems call them?

### Domain Discovery Techniques

**Event Storming:**
1. Write domain events on sticky notes (past tense: "Order Placed")
2. Arrange chronologically
3. Identify commands that trigger events
4. Identify actors who issue commands
5. Identify aggregates (clusters of related events)

**Domain Expert Interviews:**
```
"Walk me through a typical [process]."
"What happens when [unusual case]?"
"What does [term] mean to you?"
"How would you know if [process] succeeded?"
"What's the worst thing that could happen?"
```

**Document Analysis:**
- Existing forms and workflows
- Regulatory documents
- Training materials
- Support tickets (where domain assumptions fail)

### Red Flags in Domain Understanding

- Using technical terms where domain terms should be
- "Users" without specific personas
- Edge cases dismissed as "won't happen"
- Stakeholders nodding politely but looking confused
- Domain expert correcting your terminology

---

## Systems Thinking Patterns

### The Systems Thinking Framework

Systems thinking sees **relationships, not just components**.

**Component thinking:** "The database stores user data."
**Systems thinking:** "Changes to user data propagate to search indexes, analytics pipelines, backup systems, and audit logs."

### Dependency Categories

**1. Direct Dependencies**
- What this system calls/uses
- Visible in code (imports, API calls)
- Usually documented

**2. Indirect Dependencies**
- What those dependencies depend on
- Not visible in your code
- Often forgotten

**3. Reverse Dependencies**
- What depends on this system
- Not in your code at all
- Breaking changes affect them

**4. Shared Dependencies**
- Resources multiple systems use
- Database, message queue, file system
- Contention and coordination issues

### Failure Mode Categories

**1. Crash Failures**
- System stops completely
- Usually detected quickly
- Clear failure signal

**2. Omission Failures**
- System doesn't respond to some requests
- May not be detected immediately
- Partial functionality

**3. Timing Failures**
- System responds too slowly
- Can cascade to timeouts elsewhere
- Often misdiagnosed as crash

**4. Byzantine Failures**
- System produces incorrect results
- Hardest to detect
- Can corrupt other systems

**5. Silent Failures**
- System appears to work
- Actually doing nothing (or wrong thing)
- Detected only by missing outcomes

### Cascade Analysis Template

For any change, trace the cascade:

```
CHANGE: [What's changing]

DIRECT IMPACT:
- [ ] Component A: [How affected]
- [ ] Component B: [How affected]

INDIRECT IMPACT:
- [ ] What depends on A: [How affected]
- [ ] What depends on B: [How affected]

FAILURE MODES:
- [ ] If change fails: [What breaks]
- [ ] If change succeeds but is wrong: [What breaks]
- [ ] If change is slow: [What breaks]

DETECTION:
- [ ] How do we know change succeeded?
- [ ] How do we know change failed?
- [ ] How long until we know?

RECOVERY:
- [ ] Can we rollback?
- [ ] What's the rollback impact?
- [ ] What's manual recovery process?
```

### Monitoring Design

**The Four Golden Signals (from Google SRE):**

1. **Latency:** Time to serve requests
2. **Traffic:** Request rate
3. **Errors:** Rate of failed requests
4. **Saturation:** How full the system is

**For each system, define:**
- What's normal for each signal?
- What threshold triggers alert?
- What's the escalation path?
- What's the runbook?

---

## Constraint Categories Taxonomy

### Technical Constraints

**Existing Systems:**
- APIs that can't change
- Data formats locked by contracts
- Legacy systems without documentation
- Performance ceilings

**Infrastructure:**
- Deployment environment limitations
- Network topology
- Security requirements
- Disaster recovery requirements

**Technical Debt:**
- Systems that work but shouldn't be extended
- Undocumented behaviors
- Workarounds that became permanent

### Organizational Constraints

**Team Structure:**
- Who owns what
- Team boundaries
- Communication overhead
- Conway's Law implications

**Process:**
- Approval chains
- Change management
- Release cycles
- Documentation requirements

**Knowledge:**
- Who understands what
- Bus factor
- Tribal knowledge
- Training requirements

### Business Constraints

**Resources:**
- Budget limits
- Timeline pressure
- Headcount constraints
- Vendor contracts

**Compliance:**
- Industry regulations
- Legal requirements
- Audit requirements
- Data residency

**Strategic:**
- Product roadmap alignment
- Partnership constraints
- Competitive considerations
- Public commitments

### Political Constraints

**These are real. Ignoring them fails projects.**

**Power Dynamics:**
- Who has authority
- Who has influence
- Who has veto power
- Historical conflicts

**Relationships:**
- Past project history
- Team reputations
- Personal relationships
- Trust levels

**Incentives:**
- What teams are measured on
- What individuals are rewarded for
- Risk tolerance
- Career implications

### Constraint Navigation Strategies

**Work Within:**
- Accept constraint as given
- Design around it
- Document why

**Negotiate:**
- Understand why constraint exists
- Propose alternatives that address underlying need
- Get explicit agreement

**Escalate:**
- When constraint blocks critical path
- When cost of constraint exceeds benefit
- With clear proposal, not just complaint

**Ignore:**
- Almost never appropriate
- Only with explicit risk acceptance
- Document thoroughly

---

## AI Task Boundary Patterns

### What Makes a Good AI Task

**Properties of well-bounded AI tasks:**

1. **Clear Input Specification**
   - What data/context does AI receive?
   - What format is it in?
   - What's definitely included?
   - What's definitely excluded?

2. **Clear Output Specification**
   - What should AI produce?
   - What format should it be in?
   - What properties must it have?
   - What properties must it NOT have?

3. **Verifiable Success Criteria**
   - How do we know if output is correct?
   - Can a test verify it?
   - Can a human quickly verify it?
   - What's an unambiguous pass/fail?

4. **Bounded Scope**
   - Task has clear boundaries
   - AI doesn't need to make judgment calls
   - No "it depends" situations

5. **Context Independence**
   - Task doesn't require external knowledge
   - All needed information is provided
   - No assumptions required

### Task Boundary Anti-Patterns

**The Vague Task:**
```
BAD: "Improve the code quality"
WHY: No measurable output, no verification

BETTER: "Add input validation to function X
        that rejects strings longer than 100 chars"
```

**The Unbounded Task:**
```
BAD: "Fix all the bugs"
WHY: No clear scope, no end condition

BETTER: "Fix the null pointer exception in
        function X when input.name is undefined"
```

**The Context-Dependent Task:**
```
BAD: "Write it the way our team does"
WHY: Requires knowledge AI doesn't have

BETTER: "Write a function following this example's
        style: [specific example included]"
```

**The Judgment Task:**
```
BAD: "Decide if we should use Redis or Postgres"
WHY: Requires tradeoff analysis, domain context

BETTER: "List pros/cons of Redis vs Postgres for
        storing session data with these requirements: [specific]"
```

### Task Decomposition Strategy

**Step 1: Identify the outcome**
- What's the end state we want?
- How will we know we're done?

**Step 2: List the sub-tasks**
- What discrete steps achieve this?
- What's the dependency graph?

**Step 3: For each sub-task, evaluate:**
- Can AI do this with clear input/output?
- Or does this require human judgment?

**Step 4: Define boundaries**
- What exactly does AI receive?
- What exactly should AI produce?
- How do we verify?

**Step 5: Plan integration**
- How do AI outputs combine?
- Where are the gaps?
- Who handles integration?

### Verification Point Design

**After each AI task, verify:**

1. **Correctness:** Does output match specification?
2. **Completeness:** Is anything missing?
3. **Consistency:** Does it fit with other components?
4. **Safety:** Does it introduce risks?

**Verification methods:**

- **Automated tests:** Run existing test suite
- **Spot checks:** Human reviews samples
- **Comparison:** Compare to known-good reference
- **Property checks:** Verify invariants hold

### Composition Patterns

**Sequential:**
```
Task A → Verify → Task B → Verify → Task C → Verify → Integrate
```
Use when: Tasks have dependencies

**Parallel:**
```
Task A ↘
Task B → Verify All → Integrate
Task C ↗
```
Use when: Tasks are independent

**Iterative:**
```
Task A → Verify → Feedback → Task A' → Verify → Done
```
Use when: First attempt may need refinement

---

## Failure Mode Analysis Templates

### Pre-Mortem Template

**Before implementing, answer:**

```
PROJECT: [Name]

ASSUME THIS FAILS. What went wrong?

DOMAIN FAILURES:
- [ ] We misunderstood [domain concept]
- [ ] Users actually needed [different thing]
- [ ] Regulation required [thing we didn't know]

SYSTEMS FAILURES:
- [ ] Dependency [X] changed/failed
- [ ] Scale exceeded [Y]
- [ ] Performance hit [threshold]

CONSTRAINT FAILURES:
- [ ] Team [X] blocked us because [Y]
- [ ] Budget ran out before [milestone]
- [ ] Compliance issue with [requirement]

AI TASK FAILURES:
- [ ] Task boundaries were unclear
- [ ] Verification missed [issue]
- [ ] Integration failed at [point]

FOR EACH FAILURE MODE:
- Likelihood: High / Medium / Low
- Impact: Critical / Major / Minor
- Prevention: [What we'll do to prevent]
- Detection: [How we'll know if happening]
- Mitigation: [What we'll do if it happens]
```

### Post-Mortem Template

**After a failure:**

```
INCIDENT: [Description]
DATE: [When]
DURATION: [How long]
IMPACT: [What was affected]

TIMELINE:
- [Time]: [What happened]
- [Time]: [What happened]
- ...

ROOT CAUSE:
[The actual root cause, not just the trigger]

CONTRIBUTING FACTORS:
- [ ] [Factor 1]
- [ ] [Factor 2]

WHAT WORKED:
- [ ] [Thing that helped]
- [ ] [Thing that helped]

WHAT DIDN'T WORK:
- [ ] [Thing that failed]
- [ ] [Thing that failed]

ACTION ITEMS:
- [ ] [Specific action] - Owner: [Name] - Due: [Date]
- [ ] [Specific action] - Owner: [Name] - Due: [Date]

ARCHITECTURAL LESSONS:
- Domain: [What we learned about the problem space]
- Systems: [What we learned about dependencies/failures]
- Constraints: [What constraints we missed]
- AI Tasks: [What we learned about decomposition]
```

### Dependency Risk Matrix

```
| Dependency | Owner | Stability | Fallback | Monitoring | Risk |
|------------|-------|-----------|----------|------------|------|
| [Name]     | [Who] | H/M/L     | [What]   | [How]      | H/M/L|
| [Name]     | [Who] | H/M/L     | [What]   | [How]      | H/M/L|
```

**Risk = Impact if fails × Likelihood of failure**

For HIGH risk dependencies:
- [ ] Fallback strategy documented
- [ ] Monitoring in place
- [ ] Runbook exists
- [ ] Regular testing of failure scenario

---

## Decision Record Template

For architectural decisions, document:

```
DECISION: [What was decided]
DATE: [When]
STATUS: Proposed / Accepted / Deprecated / Superseded

CONTEXT:
[Why is this decision needed?]

CONSTRAINTS:
- Technical: [What technical constraints apply]
- Organizational: [What org constraints apply]
- Business: [What business constraints apply]

OPTIONS CONSIDERED:

Option 1: [Name]
- Description: [What this option is]
- Pros: [Benefits]
- Cons: [Drawbacks]
- Fit with constraints: [How it fits]

Option 2: [Name]
- Description: [What this option is]
- Pros: [Benefits]
- Cons: [Drawbacks]
- Fit with constraints: [How it fits]

DECISION:
[What we decided and why]

CONSEQUENCES:
- Positive: [What good things result]
- Negative: [What trade-offs we're making]
- Risks: [What could go wrong]

AI DECOMPOSITION (if applicable):
- Tasks identified: [List]
- Verification approach: [How]
- Human checkpoints: [Where]
```

---

## Quick Reference

### The Five Questions

Before ANY architecture work:
1. What problem are we solving? (Domain)
2. What can break? (Systems)
3. What can't we change? (Constraints)
4. How do we decompose for AI? (AI Tasks)
5. How do we verify? (Validation)

### The Shippability Test

Can this ship? Check:
- [ ] Fits technical constraints
- [ ] Fits budget/timeline
- [ ] Has required approvals
- [ ] Meets compliance
- [ ] Team capacity exists

### The AI Task Checklist

For each AI task:
- [ ] Input is clear
- [ ] Output is clear
- [ ] Success is verifiable
- [ ] Scope is bounded
- [ ] Context is provided
