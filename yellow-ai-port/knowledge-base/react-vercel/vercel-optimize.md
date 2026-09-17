# Skill: vercel-optimize

**Category:** react-vercel

**Cursor invoke:** `/vercel-optimize`

---


## SKILL: SKILL.md

# Vercel Optimize

Run an observability-first Vercel optimization audit. Do not inspect source files until `signals.json` exists and a deterministic gate points to a route, file, or project setting.

Core doctrine: read [references/doctrine.md](references/doctrine.md) if any rule is unclear.

- Metrics first. Recommendations start from Vercel production signals, not repo-wide grep.
- Deterministic gates. `scripts/gate-investigations.mjs` decides what deserves investigation.
- Candidate-bound scope. Read only files named by a candidate or a route-local import chain.
- Version-aware citations. Use only `references/docs-library.json`; invalid or version-mismatched citations are stripped.
- Customer copy. Read [references/voice.md](references/voice.md) before writing report text or chat output.

## Prerequisites

- Vercel CLI v53+ with `vercel metrics`, `vercel usage`, `vercel contract`, and `vercel api`.
- Authenticated CLI session: `vercel login`.
- Linked app directory: `vercel link`. `VERCEL_PROJECT_ID` can help resolve project config, but `vercel metrics` still requires directory linkage. The link or environment must include the intended project org/team/user scope so the collector can resolve a CLI-safe `--scope` and keep `vercel metrics`, `vercel usage`, and `vercel contract` on the same account.
- Node.js 20+.
- Observability Plus for route-level metric-backed recommendations.

Never put auth tokens in shell commands. Do not type `VERCEL_TOKEN=...`, `--token ...`, or `Authorization: Bearer ...` into commands that may be echoed in chat.

## Framework Support

The preflight reads `package.json` and sets expectations before metric fan-out.

| Framework | Status | Notes |
|---|---|---|
| Next.js App Router | supported | strongest route mapping, scanners, playbooks, citations |
| Next.js Pages Router | supported | scoped to Pages Router idioms when detected |
| SvelteKit | supported | route mapping for `src/routes` files and SvelteKit scanner |
| Nuxt | supported | route mapping plus generic/platform checks; fewer framework-specific recs |
| Astro | limited | route mapping plus generic checks; fewer framework-specific recs |
| Hono / Remix / unknown | blocked by default | continue only if the user accepts a limited platform/code-only audit |

If unsupported, stop and ask before scanning or gating:

```text
This project uses <framework>. Vercel Optimize supports metric-backed code recommendations for Next.js, SvelteKit, and Nuxt. Astro support is limited. For <framework>, I can still run a limited platform/scanner audit, but route-level Vercel metrics may not map back to source files.

Do you want me to continue with the limited audit, or stop here?
```

If the user continues, rerun collection with `--continue-unsupported-framework`.

## Run Directory

Use a fresh run directory for every audit. Do not reuse briefs, sub-agent outputs, or reports across runs.

```bash
RUN_DIR="$(mktemp -d -t vercel-optimize-XXXXXX)"
```

## Pipeline

### 1. Collect, scan, and merge signals

Run from the linked app directory or pass `--cwd` where a script supports it. Keep stdout JSON separate from stderr logs. Do not combine streams.

```bash
node scripts/collect-signals.mjs [projectId] > "$RUN_DIR/vercel-signals.json" 2> "$RUN_DIR/collect.stderr"
node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$RUN_DIR/vercel-signals.json"

node scripts/scan-codebase.mjs <repo-root> > "$RUN_DIR/codebase.json"
node scripts/merge-signals.mjs "$RUN_DIR/vercel-signals.json" "$RUN_DIR/codebase.json" --out "$RUN_DIR/signals.json"
```

Collection details, schemas, metric IDs, and degradation behavior live in [references/data-collection.md](references/data-collection.md). The metric registry is [lib/queries.mjs](lib/queries.mjs); keep all queries on the shared 14-day window.

`collect-signals.mjs` resolves the linked project owner to `commandScope.cliScope` and verifies that the resolved account can read the resolved project before it checks Observability Plus. Downstream scripts reuse that scope for every Vercel CLI command that accepts `--scope`. Do not run `vercel usage`, `vercel metrics`, or `vercel contract` manually without the same scope; unscoped usage can report the user's personal organization while route metrics come from the team project.

If project or scope resolution is ambiguous, stop and ask the user which Vercel project and team/personal scope they want audited. Do not infer the intended scope from the current `vercel whoami` team, and do not proceed with metrics, usage, or contract collection until the link, an exact project match in `.vercel/repo.json`, or `VERCEL_PROJECT_ID` + `VERCEL_ORG_ID` identifies the intended account.

Use this prompt for `PROJECT_SCOPE_UNRESOLVED`, `SCOPE_UNRESOLVED`, or `PROJECT_SCOPE_MISMATCH`:

```text
I can't safely identify the Vercel project and account for this audit yet.

Please confirm the Vercel project name or ID and the team slug/name, or tell me it's under your personal account. Once confirmed, I'll relink or rerun collection against that exact scope before checking metrics.
```

### 1.1 Stop on blockers

Check blockers before gating:

```bash
jq '{frameworkSupportBlocker, observabilityPlus, observabilityPlusUsable, observabilityPlusBlocker, observabilityPlusBlockerDetail}' "$RUN_DIR/signals.json"
```

Required actions:

- `frameworkSupportBlocker === "unsupported_framework"`: use the unsupported-framework prompt above.
- `PROJECT_SCOPE_UNRESOLVED`, `SCOPE_UNRESOLVED`, or `PROJECT_SCOPE_MISMATCH`: stop and ask which Vercel project and team/personal scope the user wants audited. For team projects, rerun after `vercel link --yes --project <project-name-or-id> --team <team-slug>`; for personal projects, rerun after linking under the intended user account or after setting both `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID`.
- `observabilityPlusBlocker === null`: continue.
- `no_traffic`: tell the user route metrics are sparse; continue only if they accept limited output.
- `payment_required` or `no_oplus_probe`: render [references/observability-plus.md](references/observability-plus.md) verbatim and ask.
- `project_disabled`: tell the user to enable Observability Plus for the project or accept a limited audit.
- `daily_quota_exceeded`: stop and tell the user the Observability query quota is exhausted; retry after the next UTC midnight reset, or ask whether to continue with a limited code-only audit.
- `not_linked`: link the app directory, then rerun Step 1. If app path and project are known:

```bash
vercel link --yes --project <project-name-or-id> --cwd <app-dir>
# add --team <team-id-or-slug> when known
```

- `forbidden` or `project_not_found`: fix auth/team scope. Do not pitch Observability Plus.
- `all_failed_other`: show the raw error code and ask whether to continue in limited code-only mode.

Do not silently fall back to code-only mode. If the user accepts a limited audit, rerun collection with:

```bash
node scripts/collect-signals.mjs [projectId] --continue-without-observability > "$RUN_DIR/vercel-signals.json" 2> "$RUN_DIR/collect.stderr"
```

Then scan and merge again.

### 2. Gate candidates

```bash
node scripts/gate-investigations.mjs "$RUN_DIR/signals.json" > "$RUN_DIR/gate.json"
```

Output shape:

- `toLaunch`: code-scope candidates to investigate.
- `platform`: project/account-scope recommendations.
- `gated`: skipped, covered, or disqualified candidates that must still appear in the report.
- `budget`: candidate budget and selection mode.

Default budget is 6 code-scope candidates with a diversity guardrail. To expand:

```bash
node scripts/gate-investigations.mjs "$RUN_DIR/signals.json" --max-candidates 12 > "$RUN_DIR/gate.json"
node scripts/gate-investigations.mjs "$RUN_DIR/signals.json" --max-candidates all > "$RUN_DIR/gate.json"
```

Generated candidate docs: [references/candidates.md](references/candidates.md).

### 2.1 Ask about audit scope when needed

Before deep-dive, run:

```bash
node scripts/budget-summary.mjs "$RUN_DIR/gate.json" --format json > "$RUN_DIR/budget-summary.json"
```

If `shouldAsk` is false, continue.

If `shouldAsk` is true:

1. Print `exactChatMessage.body` exactly as returned. Do not summarize, truncate, reorder, or rewrite it.
2. Then ask `questionText` using `questionPayload` when the host supports structured questions.
3. If the user chooses a different number, rerun the gate with `--max-candidates <choice>`.

Never put the long preview inside the question field. The preview and the question are separate surfaces.

### 2.2 Deep-dive and reconcile

```bash
node scripts/deep-dive.mjs "$RUN_DIR/signals.json" "$RUN_DIR/gate.json" --cwd <project-dir> > "$RUN_DIR/investigation-evidence.json"

node scripts/reconcile-candidates.mjs "$RUN_DIR/investigation-evidence.json" \
  --gate "$RUN_DIR/gate.json" \
  --out "$RUN_DIR/reconciled-investigation.json"
```

`--cwd` must be the linked project directory so `deep-dive.mjs` can verify the same project link and reuse `signals.json.commandScope.cliScope` for any follow-up `vercel metrics` calls.

Reconciliation deterministically converts disproven candidates into observations before any source investigation:

- `metric_mismatch`
- `error_storm`
- `deployment_regression`
- `scanner_only_no_metric`

### 2.3 Generate briefs and investigate

List the work:

```bash
node scripts/prepare-investigation-brief.mjs "$RUN_DIR/signals.json" "$RUN_DIR/reconciled-investigation.json" --list > "$RUN_DIR/briefs-manifest.json"
```

Generate one brief for every entry in `briefs-manifest.json.briefs`. The `group` can be `toLaunch` or `platform`; do not generate only `toLaunch` briefs.

```bash
mkdir -p "$RUN_DIR/briefs" "$RUN_DIR/sub-agent-outputs"
node scripts/prepare-investigation-brief.mjs "$RUN_DIR/signals.json" "$RUN_DIR/reconciled-investigation.json" \
  --group <brief.group> --index <brief.index> --out "$RUN_DIR/briefs/<brief.group>-<brief.index>.md"
```

Use `briefs-manifest.json.briefs[].label` for visible worker names, for example `Low cache-hit route on /docs/llm-digest/[...slug]`, not `toLaunch-7`.

Fan-out rule:

- 1-2 briefs: investigate inline.
- 3+ briefs: spawn one sub-agent per brief when the host supports it.
- Hosts without sub-agents: run inline serially.

Sub-agent contract:

- The brief is the whole prompt.
- Read only files listed in the brief, plus route-local imports when needed.
- Emit one JSON recommendation or one JSON no-change finding using [references/recommendations.md](references/recommendations.md).
- Do not cite URLs outside the provided citation subset.
- Do not recommend framework features unavailable in the detected version.

If a sub-agent reaches for repo-wide grep, the candidate is malformed; drop or abstain rather than widening scope.

### 2.4 Collect outputs

Save each raw investigation result in `$RUN_DIR/sub-agent-outputs/`, then collect:

```bash
node scripts/collect-sub-agent-outputs.mjs \
  --manifest "$RUN_DIR/briefs-manifest.json" \
  --out "$RUN_DIR/recommendations.json" \
  "$RUN_DIR/sub-agent-outputs/"
```

The collector extracts JSON, prepends pre-resolved records, enforces manifest order, and fails on missing, duplicate, unknown, or mismatched `candidateRef` values.

### 3. Verify recommendations

```bash
node scripts/verify-and-regen.mjs "$RUN_DIR/recommendations.json" \
  --signals "$RUN_DIR/signals.json" \
  --repo-root <project-dir> \
  --out "$RUN_DIR/verify.json"
```

This script extracts claims, verifies files/citations/version fit, grades quality, applies sanitizers, emits `verifiedRecommendations`, `withheldRecommendations`, `renderableRecommendations`, and creates `regenPlan` for failed or unsafe recommendations.

Recommendation schema, writing rules, sanitizer order, and grading rules: [references/recommendations.md](references/recommendations.md). Verification rules: [references/verification.md](references/verification.md).

For each `regenPlan` entry, rerun the same brief with a `Previous attempt failed these checks` section listing `topFailures`. Keep the regenerated output only if verification improves without gutting citations.

### 4. Render report and final message

```bash
node scripts/render-report.mjs "$RUN_DIR/verify.json" "$RUN_DIR/gate.json" "$RUN_DIR/signals.json" \
  --project <name> \
  --out "$RUN_DIR/report.md" \
  --message-out "$RUN_DIR/final-message.json"
```

Use `--debug-out "$RUN_DIR/debug.json"` only when developing the skill. Customer Markdown and chat output must not expose `passRate`, `quality`, sanitizer trails, raw sub-agent names, or other implementation fields.

After rendering, print `final-message.json.body` verbatim and stop. Do not add highlights, debug notes, raw counts, sub-agent summaries, or extra explanation. Render-time dedupe, platform caps, and hard-safety drops can change the customer-visible count, so never summarize from raw `verify.json`.

Report structure and impact framing: [references/scoring.md](references/scoring.md).

## Recommendation Rules

Every recommendation must:

- Trace to a launched candidate, platform candidate, pre-resolved observation, or verified traffic-independent scanner finding.
- Include observed metric evidence from `signals.json` or `evidence.deepDive`.
- Cite verified files with line numbers when code is involved.
- Include at least one allowed citation that applies to the detected framework/version.
- Use precise observed performance numbers.
- Use cost magnitude phrases only; never customer-facing `$N` savings.
- Do not recommend duration reductions for Vercel Workflow runtime endpoints (`/.well-known/workflow/v1/*`). These are generated orchestration routes for durable step/flow execution and should be hard-gated before investigation.
- Workflow recommendations must name the boundary being changed. Valid examples: enqueue durable work and return a run ID instead of awaiting completion, fix stream replay/closure/locks, or reduce verified excess Workflow Steps/Storage. Do not infer cost savings from Workflow endpoint wall-clock duration.
- For streaming, SSE, resumable chat, or other intentionally long-lived routes, do not frame wall-clock function duration as a problem by itself. Require evidence of avoidable pre-first-byte work, high active CPU, duplicate invocations, or post-response work that can move out of the user-visible path.
- Name a specific cache policy when recommending caching.
- Keep unsafe responses dynamic unless evidence proves they are safe to cache: auth-sensitive paths, errors, fallback responses, missing content, invalid requests, geolocation/device-varying output, and unversioned dynamic URLs.

Never recommend "verify X is on" for facts already present in `signals.project`, including Fluid compute status, memory tier, regions, in-function concurrency, and timeout.

## Scanner Rules

Scanner findings are supplementary. Drop findings annotated `COLD-PATH` or `NO-ROUTE-MAPPING` unless the scanner declares `metadata.trafficIndependent === true`.

Traffic-independent examples: middleware matcher, source maps, React Compiler config, build settings. Route-local cache or data-fetch patterns need route-level traffic evidence.

Scanner docs: [references/scanner-patterns.md](references/scanner-patterns.md).

## Final Customer Terms

Use:

- `recommendations ready`
- `observations from investigation`
- `investigated, no change recommended`
- `not investigated in this run`

Avoid:

- `sub-agent`
- `abstention`
- `passRate`
- `quality score`
- `gate`
- `LLM`

## Failure Copy

Use these messages without adding sales copy or process detail.

**No traffic in the last 14 days:**

> This project has no meaningful traffic in the last 14 days, so route-level metrics are sparse. I can still check traffic-independent scanner findings and project settings, but I cannot rank route fixes until traffic accumulates.

**Route-level metrics unavailable:**

> Use the verbatim choice template in [references/observability-plus.md](references/observability-plus.md). Do not silently fall back to code-only mode; present the two-path choice: enable Observability Plus and rerun the metric-backed audit, or accept a limited code-only run.

**Project is not linked:**

> This worktree is not linked to a Vercel project. Run `vercel link --yes --project <project-name-or-id> --cwd <app-dir>` and rerun the audit. If the team is known, add `--team <team-id-or-slug>`.

**Most route-to-file mappings failed:**

> The route inventory matched fewer than half of the routes we saw in observability. This is common in monorepos with custom routing. I've surfaced what I can match; the rest appear in the "Not investigated in this run" section.


## REF: AGENTS.md

# vercel-optimize

Cross-agent entry point for the Vercel Optimize skill. The full procedure is in [SKILL.md](./SKILL.md).

Use this skill when the user asks to optimize a Vercel project, reduce a Vercel bill, investigate slow or expensive routes, find caching opportunities, reduce function invocations, or produce a Vercel cost/performance report.

Do not use it for projects that are not deployed on Vercel, greenfield projects with no traffic, or general code review.

## Requirements

- Node.js 20+
- Vercel CLI with `vercel metrics`, `vercel usage`, `vercel contract`, and `vercel api` support; v53+ is this skill's compatibility floor
- Authenticated Vercel CLI session
- Linked Vercel project directory (`vercel link`) for route metrics. `VERCEL_PROJECT_ID` can help resolve project config, but it does not replace directory linkage for `vercel metrics`. The project must resolve to a CLI-safe team or personal scope so `vercel metrics`, `vercel usage`, and `vercel contract` all run against the same account.
- Observability Plus for per-route metric analysis

## Procedure

1. Read [SKILL.md](./SKILL.md).
2. Collect Vercel signals before reading source files.
3. Gate candidates with deterministic scripts.
4. Investigate only files named by launched candidates.
5. Verify recommendations mechanically before rendering the report.

The hard rules are in [references/doctrine.md](./references/doctrine.md): observability first, deterministic gates, candidate-bound scope, and version-aware citations.

## Install

Preferred:

```bash
npx skills add vercel-labs/agent-skills --skill vercel-optimize
```

Manual project install:

```bash
mkdir -p .agents/skills
cp -R <agent-skills-repo>/skills/vercel-optimize .agents/skills/
```

Then add this to the project `AGENTS.md`:

```md
When optimizing Vercel cost or performance, follow
`.agents/skills/vercel-optimize/SKILL.md` before proposing changes.
Collect Vercel metrics before reading source files.
```


## REF: CONTRIBUTING.md

# Contributing to `vercel-optimize`

Keep changes small, metric-grounded, and fixture-tested. Runtime code lives in `skills/vercel-optimize`; tests and fixtures live in `packages/vercel-optimize-tests` so installed skills stay small.

## Common changes

| Change | Edit | Test |
|---|---|---|
| Gate | `lib/gates/<id>.mjs`, `lib/gates/index.mjs` | `node --test packages/vercel-optimize-tests/test/*gate*.test.mjs` |
| Scanner | `lib/scanners/<id>.mjs`, `lib/scanners/index.mjs` | Scanner-specific test in `packages/vercel-optimize-tests/test/` |
| Citation | `references/docs-library.json` | `node skills/vercel-optimize/scripts/check-citations.mjs` |
| Support topic | `references/support-topics/<id>.md` | `node --test packages/vercel-optimize-tests/test/support-topics.test.mjs` |
| Playbook | `references/playbooks/<profile>.md` and selection matrix in `references/scoring.md` | `node --test packages/vercel-optimize-tests/test/support-topics.test.mjs packages/vercel-optimize-tests/test/investigation-brief.test.mjs` |
| Renderer or verifier | `lib/render-report.mjs`, `lib/verify-claim.mjs`, or related module | Focused test plus full test suite |

Generated docs:

```bash
node skills/vercel-optimize/scripts/build-docs.mjs
node skills/vercel-optimize/scripts/check-docs-fresh.mjs
```

Full test loop:

```bash
node --test packages/vercel-optimize-tests/test/*.test.mjs
node skills/vercel-optimize/scripts/check-docs-fresh.mjs
node skills/vercel-optimize/scripts/check-citations.mjs
```

## Rules

- No runtime dependencies. Scripts use Node.js 20+ built-ins and the Vercel CLI.
- No recommendation without a Vercel metric signal, code evidence when code changes are proposed, and an allow-listed citation.
- No invented URLs, exact savings projections, or version-mismatched framework APIs.
- No internal repo paths, service names, customer names, or captured private output in fixtures.
- Keep generated report copy customer-facing. Put debug details behind `--debug-out`.

## Output contracts

Every JSON-emitting script must be deterministic: stable key order, stable sort order, 2-space indentation, trailing newline. If a consumed schema changes, update the schema version and the fixture tests in the same PR.


## REF: README.md

# vercel-optimize

Optimize cost and performance for supported projects on Vercel.

This skill uses Vercel metrics to find high-impact improvements in your app. Every recommendation is backed by observed data, scoped code evidence, and version-aware docs.

[![skills.sh](https://skills.sh/b/vercel-labs/agent-skills)](https://skills.sh/vercel-labs/agent-skills)

## Install

Install just this skill:

```bash
npx skills add vercel-labs/agent-skills --skill vercel-optimize
```

Manual install: copy `skills/vercel-optimize` into `.agents/skills/vercel-optimize` and reference `SKILL.md` from your project `AGENTS.md`.

## Requirements

- Node.js 20+
- Vercel CLI with `vercel metrics`, `vercel usage`, `vercel contract`, and `vercel api` support (`npm i -g vercel@latest`). The skill enforces v53+ as its compatibility floor.
- Authenticated Vercel CLI session (`vercel login`)
- Linked Vercel project directory (`vercel link`) for route metrics. `VERCEL_PROJECT_ID` can resolve project config, but it does not replace directory linkage for `vercel metrics`. The project must resolve to a CLI-safe team or personal scope so `vercel metrics`, `vercel usage`, and `vercel contract` all run against the same account.
- Observability Plus for metric-backed route ranking
- Code-backed recommendation coverage is strongest for Next.js and SvelteKit, supported for Nuxt route mapping with generic checks, and limited for Astro. Hono, Remix, and unknown frameworks pause up front.

If route-level metrics are unavailable, the skill pauses before scanner-only mode. Scanner-only can catch traffic-independent code issues, but it cannot rank hot routes or prove cost impact.

## Use

From the Vercel project directory, ask your coding agent:

```text
optimize this Vercel project
```

The agent should collect metrics first. If it starts by reading source files or guessing from `vercel.json`, the skill was not loaded correctly.

## Roadmap

| Attribute | Status |
|---|---|
| Route-level Vercel Function invocations, duration, TTFB, and cold starts | Supported |
| Vercel Function CPU, memory, and GB-hours | Supported |
| Request volume, cache hit rate, HTTP status, and method distribution | Supported |
| Fast Data Transfer and bot traffic patterns | Supported |
| ISR reads, writes, and over-revalidation | Supported |
| Routing Middleware volume and duration | Supported |
| External API latency, volume, and transfer bytes | Supported |
| Core Web Vitals from Speed Insights | Supported |
| Image Optimization usage, source hosts, and source bytes | Supported |
| Build Minutes fan-out | Supported |
| Usage spikes by billing service | Supported |
| Bot Protection and BotID configuration | Supported |
| Fluid Compute configuration and compute signals | Supported |
| Region pinning and project configuration mismatches | Supported |
| Observability Events cost attribution | Supported |
| Route-to-file recommendations for Next.js and SvelteKit | Supported |
| Nuxt route mapping with generic/platform checks | Supported |
| Generic route mapping and platform checks for Astro | Supported |
| Hono route-to-file mapping | Planned |
| Remix route-to-file mapping | Planned |
| AI Gateway usage and cost optimization | Planned |
| Sandbox usage and cost optimization | Planned |
| Blob, Edge Config, Runtime Cache, Workflows, Queues, Flags, and Microfrontends billing dimensions | Planned |

## What You Get

- Ranked recommendations tied to observed Vercel metrics
- Specific route and file references when source changes are justified
- Before/after code for ready recommendations
- Citations from a curated, version-aware documentation allow-list
- Held-back findings when evidence is real but not strong enough for a recommendation
- A concise final message plus a full Markdown report

## Trust Model

- Metrics come first. Code investigation starts only after signals are collected.
- Gates are deterministic JavaScript thresholds. No LLM decides whether a metric qualifies.
- Citations are allow-listed. Unknown URLs and version-mismatched framework docs are stripped.
- Project config contradictions are rejected. For example, the verifier blocks "enable Fluid Compute" when Fluid Compute is already on.
- Cost impact uses magnitude framing, not invented exact savings.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). New gates, scanners, playbooks, citations, and sanitizers need fixture coverage in `packages/vercel-optimize-tests`.

## License

MIT


## REF: references/candidates.md

<!-- THIS FILE IS GENERATED by scripts/build-docs.mjs. Do not edit by hand. -->
<!-- To change scanner descriptions, edit lib/scanners/*.mjs metadata exports. -->
<!-- To change gate thresholds, edit lib/gates/*.mjs metadata exports. -->

# Candidate gates

The deterministic threshold expressions that turn observability signals into investigation candidates. Pure JS, no LLM. Thresholds live in `lib/gates/*.mjs`.

Total gates: 15. Budget cap: `MAX_CODE_CANDIDATES = 6`. Gate version: `1.8.0`.

## Gates

### `build_minutes_fanout`

- **Threshold**: `Build Minutes share > 0.15 OR turbo-force-bypass finding present`
- **Billing dimension**: build
- **Scope**: account
- **Source citation**: `vercel-optimize gate threshold`

Build Minutes line dominates the bill or Turborepo cache is bypassed. On monorepos, unchanged work should be skipped through Vercel skip-unaffected behavior, a verified Ignored Build Step, and a complete Turbo cache contract.

---

### `cold_start`

- **Threshold**: `coldPct > 0.4 AND total >= 1000`
- **Billing dimension**: function-duration
- **Scope**: route
- **Source citation**: `vercel-optimize gate threshold`

Routes where > 40% of invocations are cold-start, at meaningful traffic (>=1,000 total invocations in window). Cold starts add 200-800ms per request and break the perceived latency budget on cache-miss paths. The 40% threshold is where cold-rate becomes a real signal vs Poisson noise on serverless. Sourced from vercel.function_invocation.count grouped by function_start_type.

---

### `cwv_poor`

- **Threshold**: `LCP p75>2500 OR INP p75>200 OR CLS p75>0.1, AND speed_insights count > 50`
- **Billing dimension**: speed-insights
- **Scope**: route
- **Source citation**: `https://web.dev/articles/vitals`

Routes where Core Web Vitals fall into Google's "Poor" band on real-user traffic. LCP > 2500ms, INP > 200ms, or CLS > 0.1 each hurt SEO and conversion. Surfaces one candidate per (route, metric) pair to keep recommendations focused.

---

### `external_api_slow`

- **Threshold**: `p75Ms > 2000 AND callCount >= 500`
- **Billing dimension**: function-duration
- **Scope**: route
- **Source citation**: `vercel-optimize gate threshold`

External API hostnames with p75 latency above 2 seconds AND at least 500 calls in the window. External API latency is a primary driver of function duration cost when the upstream is on a hot path; a single slow stale call isn't worth recommending against.

---

### `isr_overrevalidation`

- **Threshold**: `writes/reads > 0.5 AND writes > 100`
- **Billing dimension**: isr
- **Scope**: route
- **Source citation**: `https://vercel.com/docs/incremental-static-regeneration`

ISR routes with > 1 write per 2 reads. The revalidate interval is too aggressive relative to read traffic — many reads pay to regenerate. Investigate whether the page can tolerate a longer revalidate window or on-demand revalidation via revalidateTag.

---

### `middleware_heavy`

- **Threshold**: `middlewareInv/totalInv > 0.5 AND middlewareInv > 1000`
- **Billing dimension**: edge-requests
- **Scope**: account
- **Source citation**: `https://nextjs.org/docs/app/building-your-application/routing/middleware`

Middleware invocations cover > 50% of total requests at non-trivial volume. The matcher is probably broader than necessary; narrow it to the paths that actually need auth/rewrites/headers.

---

### `observability_events_attribution`

- **Threshold**: `observabilityEventsShare > 0.20 (critical at > 0.30)`
- **Billing dimension**: observability-events
- **Scope**: account
- **Source citation**: `vercel-optimize gate threshold`

Observability Events line item exceeds 20% of total billed cost. High share usually traces to low cache hit rate, middleware-heavy traffic, or unconstrained custom-span cardinality. No sampling lever exists for Observability Plus; reduce upstream invocations instead.

---

### `platform_bot_protection`

- **Threshold**: `botIdEnabled=false AND (botPct >= 0.05 OR edge_cost >= $25/window OR requests >= 14k/14d)`
- **Billing dimension**: edge-requests
- **Scope**: account
- **Source citation**: `vercel-optimize gate threshold`

When BotID is disabled AND there is evidence (observed bot bandwidth share, edge cost, or substantial request volume) that bot traffic is non-trivial. Bot traffic inflates edge request counts without delivering user value; staged bot protection can reduce waste on bot-heavy projects. Skipped on quiet projects with no bot evidence — the recommendation would be noise.

---

### `platform_fluid_compute`

- **Threshold**: `fluid=false AND (any cold_start signal OR any route with p95>1000ms AND inv>1000)`
- **Billing dimension**: function-duration
- **Scope**: account
- **Source citation**: `vercel-optimize gate threshold`

When Fluid Compute is disabled on a project that shows cold-start pressure (high cold-start rate) or sustained slow function p95 on hot routes. Fluid Compute reduces cold starts via instance reuse — recommend turning it on at the project level rather than per-route.

---

### `region_misconfig`

- **Threshold**: `single-region pin found AND routes.length > 20 (scanner-only branch)`
- **Billing dimension**: function-duration
- **Scope**: account
- **Source citation**: `vercel-optimize gate threshold`

A single function region is pinned in `vercel.json` or per-route `preferredRegion`. Without per-region TTFB data (data gap), the gate can't quantify the geographic latency cost — but a single-region pin on a project with 20+ routes is worth auditing against Speed Insights traffic geo.

---

### `route_errors`

- **Threshold**: `count > 250 OR (totalRequests >= 1000 AND errorRate > 0.01)`
- **Billing dimension**: function-duration
- **Scope**: route
- **Source citation**: `vercel-optimize gate threshold`

Routes producing > 250 5xx errors over the window, or with > 1% error rate on at least 1,000 total requests. Errored function invocations still bill at full duration; high error rates also poison user experience.

---

### `scanner-driven`

- **Threshold**: `per-kind: scanner matches.length >= threshold`
- **Billing dimension**: mixed
- **Scope**: mixed
- **Source citation**: `vercel-optimize gate threshold`

Configured kinds emitted from scanner output. Each requires a minimum match count to avoid noise. Findings on cold-path or unmappable files are dropped unless the underlying scanner is trafficIndependent.

---

### `slow_route`

- **Threshold**: `(p95 > 500 AND inv >= 1400) OR (p95 > 1500 AND inv >= 250); disqualified when 5xx rate > 50%; Vercel Workflow runtime endpoints are hard-gated`
- **Billing dimension**: function-duration
- **Scope**: route
- **Source citation**: `vercel-optimize gate threshold`

Routes with p95 function duration above 500ms at meaningful traffic (>=1,400 invocations in window), OR catastrophically slow routes (>1500ms p95 at any volume >=250). High duration drives both function-duration cost and user-perceived latency. Investigate sequential awaits, slow external APIs, missing caching, N+1 patterns. Routes with >50% 5xx rate are disqualified — those are reliability problems, not performance tuning targets, and surface via route_errors instead. Vercel Workflow runtime endpoints (`/.well-known/workflow/v1/*`) are hard-gated before launch because long-running step/flow requests are expected orchestration, not app-route bottlenecks.

---

### `uncached_route`

- **Threshold**: `requests > 500 AND hitRate < 0.5 AND getShare > 0.2 (missing getShare is gated)`
- **Billing dimension**: edge-requests
- **Scope**: route
- **Source citation**: `vercel-optimize gate threshold`

Routes serving > 500 requests/period at < 50% cache hit AND at least 20% GET traffic. Each uncached GET request reaches the function, costing edge requests + function duration. Routes that are mostly POST/PUT/DELETE (Server Actions, mutations) are skipped — 0% cache is correct behavior there. Routes with missing method-share data are gated instead of launched. Auth-gated routes are disqualified separately.

---

### `usage_spike_triage`

- **Threshold**: `any-day total > 2x mean OR any-day SKU > 3x SKU mean`
- **Billing dimension**: mixed
- **Scope**: account
- **Source citation**: `vercel-optimize gate threshold`

A single day in the billing window deviates sharply from the window baseline. Triage branches: bot or AI crawler spike, viral moment, pricing-model migration (legacy SKU → new), code regression. Without daily-granularity data, this gate stays dormant.

---


## REF: references/data-collection.md

# Data collection

What the skill collects in Step 1, where each signal comes from, and how it degrades when a capability is missing.

All shapes here are covered by sanitized CLI fixtures in `packages/vercel-optimize-tests/test/fixtures/real-cli-output/`.

## Table of contents

- [The `signals.json` shape](#the-signalsjson-shape)
- [Per-signal source matrix](#per-signal-source-matrix)
- [Error states and fallbacks](#error-states-and-fallbacks)
- [Real JSON shapes](#real-json-shapes)
- [Why we avoid stderr grep](#why-we-avoid-stderr-grep)

## The `signals.json` shape

`node scripts/collect-signals.mjs` emits the Vercel-side signal document. `node scripts/scan-codebase.mjs <repo-root>` emits the local codebase scan. `node scripts/merge-signals.mjs vercel-signals.json codebase.json --out signals.json` combines them into the artifact consumed by the gate, deep-dive, verifier, and renderer. The merge step also annotates scanner findings with route-level observability, `COLD-PATH`, or `NO-ROUTE-MAPPING`; scanner gates reject non-traffic-independent findings that do not carry one of those deterministic annotations.

The merged `signals.json` has this top-level shape:

```json
{
  "schemaVersion": "1.2",
  "collectedAt": "2026-05-12T20:48:44.123Z",
  "timeWindow": "14d",
  "projectId": "prj_xxx",
  "orgId": "team_xxx",
  "projectIdSource": "repo.json" | "project.json" | "arg" | "env" | "arg+repo.json" | "arg+project.json" | "env+repo.json" | "env+project.json",
  "commandScope": {
    "ok": true,
    "cliScope": "team-slug-or-username",
    "source": "team-api" | "whoami-current-team" | "whoami-user" | "linked-org-scope" | "missing-org-scope",
    "required": true,
    "detail": "..."
  },
  "frameworkSupport": {
    "ok": true,
    "status": "supported" | "limited" | "unsupported",
    "blocker": null | "unsupported_framework",
    "framework": "next",
    "label": "Next.js",
    "detail": "..."
  },
  "frameworkSupportBlocker": null | "unsupported_framework",
  "frameworkSupportDetail": "...",
  "observabilityPlus": true | false | null,
  "observabilityPlusPreflight": { /* CLI/API configuration probe result */ },
  "observabilityPlusUsable": true | false | null,
  "observabilityPlusBlocker": null | "no_oplus_probe" | "project_disabled" | "payment_required" | "forbidden" | "daily_quota_exceeded" | "project_not_found" | "not_linked" | "all_failed_other" | "no_traffic",
  "observabilityPlusBlockerDetail": "...",
  "plan": { "plan": "hobby" | "pro" | "enterprise" | "uncertain", "reason": "..." },
  "project": { /* /v9/projects/:id response; team-owned projects include ?teamId */ },
  "contract": { "context": "...", "commitments": [], "totalCommitments": 0 },
  "usage": { /* vercel usage --format json --breakdown daily, or null */ },
  "usageError": null | "USAGE_UNAVAILABLE" | "USAGE_CONTEXT_MISMATCH" | "NOT_COLLECTED_OBSERVABILITY_BLOCKED" | "NOT_COLLECTED_UNSUPPORTED_FRAMEWORK" | "EXIT_<n>" | "UNKNOWN",
  "stack": { /* framework + version + router + ORM + monorepo */ },
  "codebase": { /* scan-codebase output: stack + routes + findings */ },
  "metrics": { /* per-metric query results (only when observabilityPlus=true) */ },
  "metricsSchema": [ /* array of {id, description} */ ]
}
```

All metric queries use the same `timeWindow` constant (`14d`) — defined as `TIME_WINDOW` in [lib/queries.mjs](../lib/queries.mjs) and covered by the repo test suite. Mixing windows silently produces incompatible rollups; never pin a per-query `since`.

All Vercel CLI commands that accept scope must use `commandScope.cliScope` (`--scope <team-slug-or-username>`). Linked project files often contain raw `team_...` or `usr_...` IDs, but several CLI subcommands silently fall back to the current team when `--scope` receives a raw account ID. `collect-signals.mjs` resolves raw team IDs to slugs and raw user IDs to usernames before running `vercel metrics`, `vercel usage`, or `vercel contract`; `deep-dive.mjs` reuses the same scope for follow-up metric queries. If the project link lacks an owner account or the CLI-safe scope cannot be resolved, stop and ask the user which Vercel project and team/personal scope they want audited. Do not infer scope from the current `vercel whoami` team.

Downstream consumers reference `signals.<field>` paths verbatim. Bumping `schemaVersion` is required when any consumed path is renamed or removed.

## Per-signal source matrix

| Signal | CLI command | Required for | Fallback when missing |
|---|---|---|---|
| Auth | `vercel whoami` | Everything | Exit with "run `vercel login`" |
| CLI version | `vercel --version` | Everything | Exit with "upgrade to v53+" — v53 is the skill's compatibility floor |
| Project ID + Org ID | `.vercel/repo.json` (newer) or `.vercel/project.json` (legacy) → `VERCEL_PROJECT_ID` + `VERCEL_ORG_ID` → argv. When the user passes a project ID and multi-project `repo.json` contains exactly one matching entry, the collector uses that entry's owner account. | Everything | Exit with "run `vercel link` or pass projectId". Multi-project `repo.json` without an explicit matching project ID, or any project ID without owner account scope, is ambiguous; ask the user to clarify the intended project/account |
| Framework support | local `package.json` via `detectStack()` + `classifyFrameworkSupport()` | Code-backed route recommendations | Stop before metric fan-out on unsupported frameworks unless the user chooses `--continue-unsupported-framework` |
| CLI command scope | `vercel whoami --format json`, then `vercel api /v2/teams/:orgId` when a linked `team_...` ID must be converted to a slug | Keeps `vercel metrics`, `vercel usage`, and `vercel contract` on the linked project's account instead of the user's current/personal scope | `PROJECT_SCOPE_UNRESOLVED` or `SCOPE_UNRESOLVED`; stop and ask the user to clarify the intended project/account, then re-link under the intended team or personal account |
| Project/scope verification | `vercel api /v9/projects/:id?teamId=<orgId>` for team-owned projects; omit `teamId` for `usr_...` user-owned projects | Proves the resolved account can read the resolved project before Observability Plus or billing conclusions | `PROJECT_SCOPE_MISMATCH`; stop and ask the user to confirm the exact project and team/personal scope. Do not report Observability Plus as missing until this check passes |
| Observability Plus configuration | Vercel CLI/API probe plus one metric access check; user-owned projects skip the team configuration endpoint and rely on the scoped metrics probe | All `metrics.*` signals | Stop early when the account lacks Observability Plus or this project is disabled |
| Observability Plus metrics access | One canary `vercel metrics vercel.request.count --since 14d --limit 1`, then full fan-out only if it succeeds | All `metrics.*` signals | Set `observabilityPlusUsable=false` with blocker detail; emit a blocker document after project/scope verification but before billing collection unless `--continue-without-observability` is passed |
| Project config | Verified project API response from project/scope verification | Fluid Compute, BotID, Speed Insights, security flags | Stop on ownership mismatch; otherwise gates that need missing optional fields skip |
| Plan tier | `vercel api /v2/teams/:orgId` (or `/v2/user` for user-owned projects) → `billing.plan`, then scoped `vercel contract --format json` fallback → `inferPlan()` | Cost-context framing only | `plan="uncertain"`; cost magnitudes still computed from `usage.services[].billedCost` |
| Billing usage | Scoped `vercel usage --format json --from <14d> --to <today>` with best-effort project grouping when supported by the installed CLI | Cost magnitude framing, billing-driven candidates | `null` + `usageError` set when queried and unavailable; `NOT_COLLECTED_*` when a preflight stop happened before billing collection |
| Stack | local `package.json` + dir scan | Version-aware citation filtering, scanner gating | "unknown" framework → all framework-specific citations filtered |
| `metrics.fnDurationP95ByRoute` | `vercel metrics vercel.function_invocation.function_duration_ms -a p95 --group-by route --since 14d` | `slow_route`, `platform_fluid_compute` gates | `{ok:false}`; gate emits no candidates |
| `metrics.requestsByRouteCache` | `vercel metrics vercel.request.count --group-by route --group-by cache_result --since 14d` | `uncached_route`, traffic-total computation | `{ok:false}` |
| `metrics.fnStatusByRoute` | `vercel metrics vercel.function_invocation.count --group-by route --group-by http_status --since 14d` | Canonical function-level 5xx source for `route_errors` and `slow_route` error disqualification | `{ok:false}`; fall back to `requestsByRouteStatus` only for older fixtures |
| `metrics.requestsByRouteStatus` | `vercel metrics vercel.request.count --group-by route --group-by http_status --since 14d` | Compatibility fallback for request-level status | `{ok:false}` |
| `metrics.externalApiP75` | `vercel metrics vercel.external_api_request.request_duration_ms -a p75 --group-by origin_hostname --since 14d` | `external_api_slow` gate | `{ok:false}` |
| `metrics.fnStartTypeByRoute` | `vercel metrics vercel.function_invocation.count -a sum --group-by route --group-by function_start_type --since 14d` | `cold_start`, `platform_fluid_compute` | `{ok:false}`; gate dormant. **`function_start_type` ∈ {cold,hot,prewarmed}** is the public way to read cold-start rate on CLI v53.4.0+ (replaces the old "not derivable" gap). |
| `metrics.fnGbHrByRoute` | `vercel metrics vercel.function_invocation.function_duration_gbhr -a sum --group-by route --since 14d` | Cost ranking / report breakdown | `{ok:false}` |
| `metrics.fnCpuMsByRoute` | `vercel metrics vercel.function_invocation.function_cpu_time_ms -a sum --group-by route --since 14d` | Active CPU ranking (Fluid Compute billing unit) | `{ok:false}` |
| `metrics.fnPeakMemoryByRoute` | `vercel metrics vercel.function_invocation.peak_memory_mb -a max --group-by route --since 14d` | `oversized_memory` gate | `{ok:false}` |
| `metrics.fnProvisionedMemoryByRoute` | `vercel metrics vercel.function_invocation.provisioned_memory_mb -a max --group-by route --since 14d` | `oversized_memory` gate | `{ok:false}` |
| `metrics.fnTtfbP95ByRoute` | `vercel metrics vercel.function_invocation.ttfb_ms -a p95 --group-by route --since 14d` | TTFB cross-check for slow routes | `{ok:false}` |
| `metrics.fdtByRoute` | `vercel metrics vercel.request.fdt_total_bytes -a sum --group-by route --since 14d` | Bandwidth-cost ranking | `{ok:false}` |
| `metrics.fdtByBot` | `vercel metrics vercel.request.fdt_total_bytes -a sum --group-by bot_category --since 14d` | Strengthens `platform_bot_protection` with observed bot bandwidth share | `{ok:false}`; gate falls back to config-only signal |
| `metrics.fdtByCache` | `vercel metrics vercel.request.fdt_total_bytes -a sum --group-by cache_result --since 14d` | Uncached-bandwidth narrative | `{ok:false}` |
| `metrics.middlewareCount` | `vercel metrics vercel.middleware_invocation.count -a sum --group-by request_path --since 14d` | `middleware_heavy` gate | `{ok:false}`; gate dormant |
| `metrics.middlewareDurationP95` | `vercel metrics vercel.middleware_invocation.duration_ms -a p95 --group-by request_path --since 14d` | Middleware latency narrative | `{ok:false}` |
| `metrics.isrReadsByRoute` | `vercel metrics vercel.isr_operation.read_units -a sum --group-by route --since 14d` | `isr_overrevalidation` gate (denominator) | `{ok:false}` |
| `metrics.isrWritesByRoute` | `vercel metrics vercel.isr_operation.write_units -a sum --group-by route --since 14d` | `isr_overrevalidation` gate (numerator) | `{ok:false}` |

**ISR read:write ratio caveat.** `isrReadsByRoute` exposes the **origin-tier** read count only. CDN-tier reads (regional cache hits that never reach the ISR origin) are not separately surfaced today and can dominate total read volume. Before flagging "writes > reads" as inverted, the gate and report must (a) acknowledge CDN-tier reads aren't included, (b) corroborate with `requestsByRouteCache` `cache_result=HIT` share before alarming. A high origin-write rate alone does not imply pathological over-revalidation if the CDN is absorbing the steady-state read traffic.
| `metrics.imageCount`, `imageByHost`, `imageSourceBytes` | `vercel metrics vercel.image_transformation.*` | Image-optimization narrative | `{ok:false}` |
| `metrics.cwvLcpByRoute`, `cwvInpByRoute`, `cwvClsByRoute`, `cwvTtfbByRoute`, `cwvCount`, `cwvCountByRoute` | `vercel metrics vercel.speed_insights_metric.*` (`p75` for vitals, `sum` for counts) `--since 14d` | `cwv_poor` gate | Empty when no Speed Insights measurements are returned for the 14-day window — gate stays dormant; do not infer disabled vs no traffic unless another signal proves it |
| `metrics.firewallByAction` | `vercel metrics vercel.firewall_action.count -a sum --group-by waf_action --since 14d` | Bot-protection narrative; shows existing managed rule activity | `{ok:false}` |
| `metrics.botIdChecks` | `vercel metrics vercel.bot_id_check.count -a sum --since 14d` | Confirms whether BotID is actively running | `{ok:false}` |
| `metrics.externalApiCount`, `externalApiBytes` | `vercel metrics vercel.external_api_request.*` grouped by `origin_hostname` | External-dependency cost narrative | `{ok:false}` |

## Error states and fallbacks

`lib/vercel.mjs`'s `runVercelJson()` parses stdout as JSON first (the most reliable signal — the CLI emits structured error payloads even when exit code is non-zero), and only falls back to stderr substring matching when JSON parsing fails:

| Code | Meaning | Skill behavior |
|---|---|---|
| `unsupported_framework` | Detected framework cannot reliably map Vercel route metrics back to source files | Stop before metric fan-out; ask whether to continue with a limited platform/scanner audit |
| `PROJECT_SCOPE_UNRESOLVED` | The project was found without an owner account, or `.vercel/repo.json` contains multiple linked projects and no explicit matching project ID was supplied | Stop before `vercel metrics`, `vercel usage`, or `vercel contract`; ask the user which Vercel project and team/personal scope to audit |
| `SCOPE_UNRESOLVED` | The linked project belongs to a specific team/user, but the collector could not resolve a CLI-safe `--scope` value | Stop before `vercel metrics`, `vercel usage`, or `vercel contract`; ask the user to switch/re-link with the correct team |
| `PROJECT_SCOPE_MISMATCH` | The resolved team/personal account cannot read the resolved project, or the project API returns a different owner/project | Stop before Observability Plus, metrics, usage, or contract checks; ask the user to confirm the exact Vercel project and team/personal scope |
| `no_oplus_probe` | Observability Plus not enabled on team | Stop before full metric fan-out; ask whether to enable Observability Plus or run scanner-only |
| `project_disabled` | Observability Plus enabled for team but disabled for project | Stop before full metric fan-out; ask the user to enable Observability Plus for this project or continue scanner-only |
| `daily_quota_exceeded` | Observability Plus query quota is exhausted for the day | Stop before full metric fan-out; tell the user to retry after the next UTC midnight reset or ask whether to continue scanner-only |
| `USAGE_UNAVAILABLE` | `vercel usage` returned no Costs payload after billing usage was actually queried | `usage=null`; cost-tier gates emit lower-priority candidates; billing section of the report shows the exact usage error |
| `PROJECT_NOT_FOUND` | `vercel api /v9/projects/<id>` 404 (typically wrong scope) | `project={error}`; platform gates that depend on project config skip; report flags the data gap |
| `invalid_filter_dimension` / `invalid_dimension` | Metric query used a dimension the metric doesn't support | Metric returns `{ok:false, code, allowedValues}`; consumer can introspect and adjust |
| `NOT_LINKED` | The app directory is not linked in the way `vercel metrics` requires | Run `vercel link --yes --project <project-name-or-id> --cwd <app-dir>`; add `--team <team-id-or-slug>` when known. Passing only `VERCEL_PROJECT_ID` is not enough for route metrics if cwd is unlinked |
| `NOT_AUTH` | Session expired | Caller exits with "run `vercel login`" |
| `FORBIDDEN` | 403 — role lacks permission | Skip that endpoint; continue with degraded signal; surface in report |
| `RATE_LIMIT` | 429 from API | Treat as "missing data" (no retry implemented yet) |
| `EXIT_N` | Anything else | Treat as missing data; continue |

The skill never crashes the entire collection on a single endpoint failure. Every catch-block uses `?? null` or `?? {}` so the JSON output is always well-shaped.

## Real JSON shapes

### `vercel metrics <id> --format json`

```jsonc
{
  "query": {
    "metric": "vercel.request.count",
    "aggregation": "sum",
    "groupBy": ["route"],
    "startTime": "2026-04-13T04:00:00.000Z",
    "endTime": "2026-05-13T08:00:00.000Z",
    "granularity": { "hours": 4 }
  },
  "summary": [
    { "route": "/dashboard/[sessionId]", "vercel_request_count_sum": 4923 },
    { "route": "/sw.js",               "vercel_request_count_sum": 872 }
  ],
  "data": [
    { "timestamp": "2026-04-13T04:00:00.000Z", "vercel_request_count_sum": 0, "route": "/dashboard/[sessionId]" }
    /* ... */
  ],
  "statistics": { "bytesRead": 10267, "rowsRead": 947, "dbTimeSeconds": 0 }
}
```

Field naming rule: the metric ID's dots become underscores, and the aggregation suffix is appended — `vercel.request.count` + `sum` → `vercel_request_count_sum`. `lib/vercel.mjs::normalizeSummary()` flattens `summary[]` into `[{<dim>: v, ..., value: <n>}]`.

### `vercel metrics schema --format json`

Array of `{id, description}` entries — NOT an object. Many metric IDs in earlier docs don't exist: there is no `vercel.function.cold_starts`, no `vercel.cache.hits`. Cache state is the `cache_result` dimension on `vercel.request.count`.

### `vercel metrics <id> --filter "<bad>"`

```jsonc
{
  "error": {
    "code": "invalid_filter_dimension",
    "message": "Filter uses invalid dimension \"status\" for metric \"vercel.request.count\".",
    "allowedValues": [ "asn_id", ..., "http_status", ..., "route" ]
  }
}
```

Status filtering uses `http_status` (not `status`). Both `http_status eq '500'` and `http_status ge 500` work.

### `vercel api /v9/projects/<id>` / `?teamId=<orgId>`

Top-level keys relevant to the skill (real, verified):
- `framework` (string, e.g. `"nextjs"`)
- `resourceConfig.fluid` (boolean) — **Fluid Compute toggle**
- `defaultResourceConfig.fluid` — template for new functions
- `security.botIdEnabled` (boolean) — **BotID toggle**
- `security.managedRules.bot_filter` (`{active, action}`) — firewall rule
- `speedInsights` (`{id, hasData}`)
- `webAnalytics` (`{id}`) — installed but `features.webAnalytics` says enabled state
- `nodeVersion` (e.g. `"22.x"`)

Calling without `?teamId=` returns 404 when the project belongs to a team other than the user's `currentTeam`. For user-owned projects (`orgId` starts with `usr_`), omit `teamId` and let the CLI use the authenticated user context.

### `vercel contract --format json`

```jsonc
{ "context": "example-team", "commitments": [], "totalCommitments": 0 }
```

The direct account billing record is the primary plan signal: `billing.plan` from `vercel api /v2/teams/:orgId` or `vercel api /v2/user` is expected to be `hobby`, `pro`, or `enterprise`.

`vercel contract` is only a fallback. `commitments[]` field names are not stable, so `inferPlan()` tries `category`, `commitmentCategory`, and `type`; category `Spend` means Pro and `Usage` means Enterprise. Empty commitments no longer imply Hobby by themselves.

### `vercel usage --format json`

May return `Error: Costs not found (404)`. Treat that queried error as `USAGE_UNAVAILABLE` and degrade — the skill can still produce a useful report from metrics + scanner. Do not use this explanation when `usageError` is `NOT_COLLECTED_OBSERVABILITY_BLOCKED` or another `NOT_COLLECTED_*` value; those mean the audit stopped before `vercel usage` ran.

## Why we avoid stderr grep

CLI error message strings are not stable contracts — they can change between versions. Detecting `OPLUS_REQUIRED` by greping `stderr.includes('Observability Plus')` will break the moment Vercel rewords the message.

`runVercelJson()` therefore:
1. Always tries to **parse stdout as JSON** first. Most failures emit a structured `{error:{code,message,allowedValues}}` payload that's deterministic.
2. Only falls back to a lower-case stderr substring match when stdout was not parseable JSON.
3. Categorizes anything unrecognized as `EXIT_N` and treats it as "missing data, continue."

The skill is correct without precise category detection. The categories exist to give the user better error messages, not to drive control flow.


## REF: references/doctrine.md

# Doctrine

The four non-negotiable rules that shape every action this skill takes. If a future change conflicts with one of these, the change is wrong.

## Rule 1: Observability before investigation

The skill never reads a source file without an observability signal pointing at it. Step 1 (`node scripts/collect-signals.mjs`) is always first. Nothing reads source code until `signals.json` exists.

**Why this fails when skipped:** without metrics, the skill defaults to "grep the repo for known anti-patterns and complain." That produces noisy, low-impact recs that aren't tied to traffic, cost, or user pain. Metrics-first investigation keeps the skill focused on observed traffic, cost, and reliability signals.

### Four-check first-pass (Enterprise)

When `plan === 'enterprise'`, the gate run must surface these four checks before code-level recommendations. Field engineers confirm these are the highest-leverage account-level levers across every renewal audit:

1. **Observability Plus enabled?** From `signals.observabilityPlus`. If false, the whole audit degrades; surface as a top-of-report item.
2. **Reverse proxy in front?** Heuristic from response headers / CNAME chain (when collected). A non-Vercel CDN over Vercel ISR is usually a "dumb pipe" — wasted spend.
3. **WAF rules enabled?** From `signals.project.security`. BotID + managed rules absent on a project with bot evidence is the most common cost spike.
4. **ISR read:write ratio.** From `metrics.isrReadsByRoute` + `metrics.isrWritesByRoute`. Include CDN-tier reads (see [data-collection.md](data-collection.md)) before flagging "writes > reads."

These checks anchor the Enterprise-tier report's opening narrative; code-level recs follow.

## Rule 2: Deterministic gate before every sub-agent investigation

`node scripts/gate-investigations.mjs` is a pure-JS, LLM-free function. It reads `signals.json` and outputs `{toLaunch, platform, gated}`. Same input always produces byte-identical output (modulo `appliedAt`).

Every kind of candidate (uncached route, slow route, errors, cold starts, scanner findings, platform-level recs) has its threshold expression encoded as a `gate(signals) → Candidate[]` function in `lib/gates/<kind>.mjs`.

**Failed gates surface in the final report**, under "Not investigated in this run," with the exact reason they were held back. This is the user-facing trust mechanism: you see what we considered and chose to skip, and the reason.

**Why this matters:** the agent never decides "should I look at this route?" via LLM judgment. The threshold is mechanical. This eliminates the entire failure mode where the agent investigates routes it shouldn't (cold-path) and recommends fixes for routes that don't need them.

## Rule 3: Candidate-bound investigation scope

When the gate emits a candidate with `files: ['src/app/api/products/route.ts']`, the agent reads ONLY that file (and its imports as the chain unfolds). It does NOT `grep -r` across the repo.

If you find yourself wanting to grep the whole codebase, stop and re-read the current candidate's `question` field. If the question doesn't constrain the search, the candidate is malformed — log it as `gated` and skip. Do NOT compensate with a wider search.

**Why this matters:** the agent's job is to verify and explain the metric anomaly the gate found, not to do a general code review. Wandering investigations produce drift, hallucination, and recommendations untied to the cost and performance data.

### Scanner findings (the supplementary signal)

Static AST-grep scanners run in parallel with the metric-driven investigations. Their output is annotated with the per-file observability signal (`function invocations: 1.2M; 95th percentile duration: 850ms; cache hit rate: 0%` if the file maps to a hot route, `COLD-PATH` if it maps to a route with no traffic, `NO-ROUTE-MAPPING` if the file doesn't map to any route).

**Default rule:** scanner findings on `COLD-PATH` or `NO-ROUTE-MAPPING` files are dropped. They become recs only if the pattern is *traffic-independent*: build configuration, middleware matcher, source maps in production, raw script tags, React Compiler config. These don't care about traffic — they affect every request equally or affect the build itself.

The traffic-independent allow-list lives in each scanner's `metadata.trafficIndependent: boolean` field. Set it to `true` only when you can defend the claim.

## Rule 4: Doc-grounded, version-aware recommendations — no hallucinations

Every recommendation must carry at least one citation from `references/docs-library.json`. Anything else is dropped at sanitizer time.

The library has two parts:
- **URLs** — Vercel docs, Next.js docs, SvelteKit docs, etc. Each declares `applicableFrameworks` (e.g., `["next@>=15.0.0"]`).
- **Cross-skill rule references** — by name only (`vercel-react-best-practices:async-parallel`). The agent's host resolves these.

Three sanitizers enforce this:
- `missing-citation` — drops recs with empty `citations[]`.
- `unknown-citation` — strips URLs not in the library, marks `needsReview=true`.
- `version-mismatch` — strips URLs whose `applicableFrameworks` doesn't match the project's framework@version (parsed from `package.json`).

Two verifier claim types check it: `citation_in_library` (URL ∈ allow-list) and `citation_applies_to_version` (semver match).

**Why this matters:** LLMs cite plausible-looking URLs that 404, or recommend Next 15 features to Next 13 users. Both are trust-killers. The allow-list closes the first failure mode; the `applicableFrameworks` field closes the second.

### Performance citations cite observed data

Every performance claim cites the actual observability datum from `signals.json` — e.g., `functionRoutes[/api/products].p95Ms=850`. Estimated improvements are framed as ranges grounded in the observed baseline: `"Reduce /api/products 95th percentile duration from 850ms toward ~250-400ms based on similar cached routes."` Never an unanchored claim.

### Cost framing is magnitude, never precise

Cost claims like `$340/mo` are forbidden. The dollar noise floor on projections is too high to justify precision. The `impactMagnitude({currentCost, impactTier})` helper maps to phrases like `"hundreds of dollars per month at current traffic"` (computed against the user's actual `vercel usage` data).

The `$-strip` sanitizer enforces this at output time — any `$N` literal in customer-facing fields is stripped.

Performance numbers stay precise because they're observed, not extrapolated. We trust observed metrics; we don't trust dollar projections.

## What good looks like

A good run produces:
- A small number (5-15) of recommendations.
- Every rec ties to a specific route or file plus a specific metric signal.
- Every rec carries before/after code and ≥1 citation matching the user's framework version.
- Cost framing uses magnitude phrases. Performance framing uses precise observed numbers.
- The "Not investigated in this run" section explains every other signal we saw and why we chose not to dig (cache hit rate was below threshold, 95th percentile duration was already healthy, etc.).
- No `$N/mo` strings, no fabricated URLs, no Next.js 15 features recommended to a Next.js 13 user.

## What bad looks like (anti-patterns we will not ship)

- Recommendations from grepping the repo for known anti-patterns, without checking traffic.
- "Enable Fluid Compute" without a cold-start signal.
- "Add caching to /api/users" when the route has cookies() and is auth-gated.
- "Reduce the duration of `/.well-known/workflow/v1/step`" because a Workflow step is long-running. Workflow runtime endpoints are generated orchestration routes; high wall-clock duration there is expected unless a separate reliability/error signal points elsewhere.
- "Fix `/api/chat/[id]/stream` because it has high duration" without proving the stream does avoidable pre-first-byte work, high active CPU, duplicate invocations, or movable post-response work.
- "Save $340/mo by doing X" — invented precision.
- Citations to URLs that don't exist or that describe Next.js features the user's version doesn't have.
- Long lists of recs the user can't act on; every rec needs an evidence chain.

## Out of scope

The skill is bounded to runtime cost and performance optimization on Vercel-hosted projects. The following are explicit non-goals; if signals or scanner findings surface in these areas, route them out:

- **Deployment artifact size** in isolation. Bundle size matters only when it shows up as runtime cost (cold start, FDT) or performance (LCP, INP). If the only effect is "the .next directory is large," it's not in scope.
- **Build-time issues without runtime impact.** Slow builds, build-cache misses, monorepo build fan-out — these only enter scope when they show up as Build Minutes billing pressure (then they go through the `build-minutes-fanout` gate). A 6-minute build that completes successfully and ships a small artifact is not a target.
- **Security advisories and credential rotation.** RCE in `next-mdx-remote`, leaked env vars, OIDC vs explicit-key auth hygiene — refer to a security skill, not this one. Exception: when a security setting is also a documented cost lever (BotID = bot traffic = edge cost), it enters via the `platform_bot_protection` gate.
- **Commercial / billing-process trivia.** Discount sliders, seat reconciliation, contract renewal mechanics. The skill can quantify which SKU is expensive; it does not negotiate.


## REF: references/observability-plus.md

# Observability Plus Stop-And-Ask

Use this file only when `signals.observabilityPlusBlocker` is set. Do not silently continue into scanner-only mode unless the user chooses that path.

## Why This Check Exists

This is a data dependency, not an upgrade pitch. The skill ranks work by observed route behavior so it can separate hot, expensive paths from code that only looks suspicious. These gates need per-route metrics:

| Gate | Required signal |
|---|---|
| `slow_route` | Function duration and invocation count by route |
| `uncached_route` | Cache result and request count by route |
| `cold_start` | Function start type by route |
| `route_errors` | Function status by route |
| `isr_overrevalidation` | ISR reads and writes by route |
| `middleware_heavy` | Middleware invocations and duration |
| `cwv_poor` | Core Web Vitals by route |
| `platform_bot_protection` | Fast Data Transfer by bot category |

Scanner-only mode can still catch traffic-independent code issues, but it cannot rank the hottest routes or prove cost impact. Make that tradeoff explicit before continuing.

## User Template

Render this template first, then wait for the user's choice. Replace only `<detail>`. Do not add a preface; the heading is the opening line.

```md
**Per-route metrics are unavailable.**

<detail>

This audit needs route-level metrics to rank fixes by observed latency, cache hit rate, error rate, cold-start rate, and Incremental Static Regeneration reads and writes. Without them, I can run a scanner-only audit for traffic-independent code issues, but I cannot tell which routes matter most or prove cost impact.

Docs: https://vercel.com/docs/observability/observability-plus

Choose one:
1. Enable Observability Plus, then re-run the metric-backed audit.
2. Continue in scanner-only mode for a limited audit.
```

If the host supports a structured question tool, use this exact customer-facing copy. Do not rewrite it.

```json
{
  "question": "Enable Observability Plus and re-run, or continue with a limited scanner-only audit?",
  "header": "Observability Plus",
  "options": [
    {
      "label": "Enable and re-run",
      "description": "Use route-level metrics to rank the routes that matter most for cost and performance."
    },
    {
      "label": "Run scanner-only",
      "description": "Check traffic-independent code patterns without route ranking or proven cost impact."
    }
  ]
}
```

Use the full product name in this question. Do not abbreviate product names or metrics in customer-facing blocker copy.

## After The User Chooses

If the user chooses **Enable and re-run**, stop after this short response:

```md
Enable Observability Plus from the Vercel dashboard's Observability tab, then tell me to rerun. I'll restart the metric-backed audit once route-level metrics are available.
```

Do not include raw team IDs, org IDs, project IDs, pricing language, dashboard screenshots, or extra persuasion. The docs link in the blocker message already covers availability and billing details.

If the user chooses **Run scanner-only**, continue with the scanner-only steps below.

## Blocker Copy

| Blocker | Detail |
|---|---|
| `payment_required` | `Detected: route-level metrics were recognized for this team, but these metric queries are not usable.` |
| `no_oplus_probe` | `Detected: this team does not expose the route-level metrics this audit needs.` |
| `not_linked` | `Detected: this app directory is not linked to a Vercel project.` |
| `forbidden` | `Detected: the Vercel CLI is authenticated to a team that cannot read this project.` |
| `project_not_found` | `Detected: the project ID is not visible to the authenticated team.` |
| `project_disabled` | `Detected: route-level metrics are enabled for the team but disabled for this project.` |
| `all_failed_other` | `Detected: every per-route metric query failed. Error code: <code>.` |

For `not_linked`, do not use the Observability Plus template. Link the app directory first:

```bash
vercel link --yes --project <project-name-or-id> --cwd <app-dir>
```

Add `--team <team-id-or-slug>` when the team is known. If the user supplied both app path and project name, run the link command instead of asking them what to do.

For `forbidden` and `project_not_found`, ask the user to confirm the exact Vercel project and team/personal scope before presenting the Observability Plus choice.

For `project_disabled`, do not present it as a team subscription problem. Ask the user to enable Observability Plus for this project, then re-run.

For `no_traffic`, do not use this template. Tell the user the project has no meaningful traffic in the 14-day window, then ask whether to run scanner-only mode now or come back after traffic accumulates.

## Scanner-Only Mode

If the user picks scanner-only mode:

1. Re-run `node scripts/collect-signals.mjs [projectId] --continue-without-observability > "$RUN_DIR/vercel-signals.json" 2> "$RUN_DIR/collect.stderr"` if the current `signals.json` stopped at the fast blocker (`usageError=NOT_COLLECTED_OBSERVABILITY_BLOCKED` or `project=null`).
2. Run code scanners.
3. Launch only traffic-independent findings.
4. Render a clear data gap: per-route metric gates were skipped because Observability Plus data was unavailable.

Do not imply the scanner-only report is a complete optimization audit.


## REF: references/playbooks/README.md

# Playbooks

Application-profile-specific advice that shapes how recommendations are phrased and ordered. Playbooks never invent claims — every rec still traces to a verified candidate or finding. They tell the recommender what to emphasize when a project matches a profile.

## How a playbook gets applied

1. Step 1 detects the project's stack + dependencies.
2. The recommender heuristics infer an application profile (best guess from frameworks + dep signals).
3. The matching playbook(s) are included in the recommender's context.
4. Recommendations are shaped: ordering tilts toward the profile's priority list; phrasing nods to profile-specific concerns.

## Profile detection (best-effort heuristics)

| Signals → | Profile |
|---|---|
| `@vercel/sandbox`, `@ai-sdk/*`, `ai`, `openai`, `@anthropic-ai/sdk` deps OR AI Gateway / Sandbox SKU active in `usage.services` | `ai-application` |
| `stripe`, `@shopify/*`, `react-stripe-js`, "cart"/"checkout" routes | `ecommerce` |
| `next-auth`, `clerk`, dashboard routes, multi-tenant headers | `saas` |
| Only `pages/api/**` or `app/api/**`, no UI routes | `api-service` |
| Heavy MDX / markdown, mostly static routes | `content-site` |
| Lots of `/(marketing)/` route groups, A/B test deps | `marketing` |

`ai-application` is checked first — AI-shaped customers often share routes with SaaS/ecommerce surfaces, but the billing shape (AI Gateway dominant) and remediation set (provider failover, sandbox reuse, OIDC keyless) belong to this profile.

When detection is uncertain, no playbook is applied. The recommender works fine without one — the playbook is a tilt, not a requirement.

## Playbook schema

Each playbook is a Markdown file with a fixed shape so the recommender can parse it reliably. Required sections:

```markdown
# {Profile name}

## Typical billing shape
(Which dimensions dominate — e.g., "Edge Requests > Function Duration > Image Optimization")

## Priority patterns
(Ordered list of patterns this profile particularly benefits from)

## Frequent gotchas
(Anti-patterns specific to this profile)

## Cross-references
(Rec IDs from recommendations.md or rule names from vercel-react-best-practices)
```

## Contributing a new playbook

1. Identify a clear application profile and one or two representative project profiles that exemplify it.
2. Create `references/playbooks/<profile>.md` matching the schema.
3. Add detection signals to the table above (the heuristics live in the recommender code; document them here).
4. Update the playbook selection matrix in `references/scoring.md`.
5. Run `node --test packages/vercel-optimize-tests/test/support-topics.test.mjs packages/vercel-optimize-tests/test/investigation-brief.test.mjs`. No tests directly cover playbooks (they're content), but the schema validator runs in CI.


## REF: references/playbooks/ai-application.md

# AI application

LLM-backed apps, agents, code-sandbox tools, RAG pipelines. Cost shape is dominated by per-token AI Gateway spend and Sandbox active-compute time, not edge requests or function duration. Many AI customers also have a SaaS surface (auth, dashboards), but the cost lever lives upstream of the dashboard.

## Typical billing shape

AI Gateway > Sandbox Active Compute > Function Duration > Function Invocations. Edge Requests usually quiet; ISR rarely applies. Observability Events can climb fast if every tool-call span is captured at full fidelity.

## Priority patterns

1. **Provider failover.** Configure AI Gateway with an active-active fallback chain across providers (OpenAI + Anthropic, or model-family pairs). Critical-path agents must not be single-provider — a 429 from one provider becomes a user-visible outage otherwise. Field example: MELI runs homegrown active-active routing because retry-on-error against a single provider degraded their NLP-on-support flow.
2. **OIDC keyless auth, not explicit API keys.** In production, use the AI Gateway OIDC binding so requests are signed by deployment identity. In local dev, `vercel env run -- <cmd>` rotates OIDC each run. An explicit `AI_GATEWAY_API_KEY` in repo env vars is a regression — it bypasses keyless and creates a long-lived secret.
3. **Sandbox reuse over per-request `Sandbox.create`.** Each fresh sandbox costs at least 1 minute of billed compute (boot + teardown rounded up). When isolation isn't required (single-tenant agents, shared workspaces), pool sandboxes by name (`sandbox.get(name)`) — auto-snapshot on death + auto-resume on next get is the persistence model.
4. **`after()` / `waitUntil()` for tool logging.** Tool-call telemetry, audit writes, and analytics should never block the user response. Use `after()` (Next 15+) or `waitUntil()` from `@vercel/functions` for any write that doesn't affect the streamed response.
5. **Fluid Compute for JIT/process warmth.** Streaming LLM responses benefit from warm processes; the GraphQL/Apollo JIT cache + persisted-document plans only pay back when processes survive across requests. Fluid is the default; disabling it on AI workloads is almost always wrong.

## Frequent gotchas

- **Single-provider lock-in.** "We're using AI Gateway" doesn't imply failover — the provider list still has to be configured. A single-provider gateway is a thinner wrapper, not multi-provider resilience.
- **Sandbox-per-request.** `new Sandbox(...)` inside a per-request handler with no `id` argument creates a fresh microVM each time. Cheaper to pool when isolation allows.
- **BYOK fallback cost invisible.** AI Gateway with BYOK silently falls back to system credits on 429 / provider outage; cost migrates from "free BYOK" to "billed credits" without a separate signal unless tracked.
- **Observability Events runaway.** Captured every tool call + every streamed delta at 100% sampling — events SKU climbs above 30% of bill. Cap span cardinality before scaling traffic.

## Cross-references

- [external-api-critical-path](../support-topics/external-api-critical-path.md) — sequential vs parallel calls; AI Gateway is one external API among others
- [fluid-compute-caveats](../support-topics/fluid-compute-caveats.md) — module-state hazards and shared-instance caveats
- [function-duration-io-and-after](../support-topics/function-duration-io-and-after.md) — `after()` for post-response tool logging
- [observability-events-cost-attribution](../support-topics/observability-events-cost-attribution.md) — when Observability Events climb above 20% of bill
- [use-cache-remote-shared-origin-data](../support-topics/use-cache-remote-shared-origin-data.md) — caching shared LLM context or embedding lookups
- `https://vercel.com/docs/ai-gateway` — provider configuration, failover chain
- `https://vercel.com/docs/vercel-sandbox` — `sandbox.get(name)` and active-compute billing


## REF: references/playbooks/api-service.md

# API service

Headless API backend. No UI routes. Often consumed by mobile apps, partner integrations, or other Vercel projects via rewrites.

## Typical billing shape

Function Duration dominates (every request is a function invocation). Edge Requests scale with API traffic. External API costs matter when the service is a thin shim over third-party APIs (Stripe, Twilio, etc.).

## Priority patterns

1. **Cache GET responses at the edge.** Idempotent GET endpoints (catalog reads, status checks, public data) should ship with `Cache-Control: public, s-maxage=<seconds>, stale-while-revalidate=<longer>`. The CDN serves repeat callers without invoking the function.
2. **Rate-limit at the edge, not the function.** Middleware with proper matcher scoping handles abusive clients before they hit your function-duration bill.
3. **Parallel external API calls.** A "checkout-like" endpoint that calls Stripe + inventory + email-service sequentially is the most common slow_route in this profile. `Promise.all` is the obvious fix.
4. **Background work post-response.** `after()` (Next 15+) for analytics, webhooks-to-self, and any write that doesn't affect the response.
5. **Connection pooling.** Direct PG connections from serverless function instances exhaust the database. Use PgBouncer / Prisma Accelerate / Neon's pooler.

## Frequent gotchas

- **No `Cache-Control` on the public GETs.** This is the most common finding in this profile, and the easiest fix.
- **Auth check serialized with data load.** `await checkAuth()` then `await loadData()` — these are often independent and can run in parallel if your auth path doesn't depend on the data.
- **External API fan-out for one user.** A "build me a profile" endpoint that calls 5 third parties sequentially. Even small latency improvements multiplied by every user are huge.
- **Long-running async operations on the request path.** Image generation, PDF rendering, big report computation. Move these to background queues or `after()`.

## Cross-references

- `https://vercel.com/docs/caching/cdn-cache` — the GET-handler Cache-Control fix
- `vercel-react-best-practices:async-parallel` — parallelize external API calls
- `vercel-react-best-practices:server-after-nonblocking` — `after()` for post-response work
- `https://vercel.com/docs/fluid-compute` — when cold starts on infrequently-called endpoints hurt
- `https://nextjs.org/docs/app/building-your-application/routing/middleware` — for rate-limit middleware


## REF: references/playbooks/content-site.md

# Content site

Documentation, blogs, knowledge bases, marketing-adjacent content with mostly static pages. Authoring may be headless-CMS-driven or markdown-in-repo.

## Typical billing shape

Edge Requests dominate (every page view is an edge request; static assets even more). Image Optimization is often the #2 line item. Function Duration tends to be low — most pages should be static or ISR.

## Priority patterns

1. **Pre-render everything that can be pre-rendered.** Blog index, individual posts, docs pages, category pages. Use `generateStaticParams` for App Router or `getStaticPaths` for Pages Router. Anything CMS-driven should run on a webhook revalidation, not on every request.
2. **ISR with a sensible cadence.** Pages that need fresh-ish content but don't need real-time accuracy go ISR. `revalidate: 3600` (hourly) is a good starting point for docs; `60s` for blog index pages.
3. **`next/image` for every image asset.** Hero images, author photos, post inline images, OG images. Even thumbnail-only sites benefit from format negotiation (WebP/AVIF).
4. **`next/font` for self-hosted fonts.** Eliminates FOIT/FOUT, eliminates the third-party request, prevents CLS.
5. **Prefetch on hover.** `next/link` does this by default. For other frameworks, consider intersection-observer-based prefetch on the visible link set.

## Frequent gotchas

- **`force-dynamic` on the blog index.** Almost never necessary. The index can ISR or be fully static.
- **Markdown rendering on every request.** If you're parsing MDX at request time, you're paying function-duration cost on what should be a static asset. Build-time MDX → static HTML.
- **Search rebuilt on every request.** Site search backed by a function that queries a CMS on every keystroke. Move to a search index (Algolia, Pagefind, build-time generated) and serve from the CDN.
- **CMS preview routes leaking into production traffic.** A `/preview/[slug]` route that's effectively another rendering path; sometimes called from production by mistake. Audit referrers.

## Cross-references

- `https://nextjs.org/docs/app/api-reference/functions/generate-static-params` — for pre-rendering
- `https://vercel.com/docs/incremental-static-regeneration` — for the ISR fix
- `https://nextjs.org/docs/app/api-reference/components/image` — image optimization
- `https://nextjs.org/docs/app/api-reference/components/font` — self-hosted fonts
- `vercel-react-best-practices:bundle-defer-third-party` — defer analytics/cookie banners


## REF: references/playbooks/ecommerce.md

# E-commerce

Storefronts with cart, checkout, product catalogs. Often Stripe-integrated. Traffic skews toward catalog browsing (cacheable) and checkout (uncacheable).

## Typical billing shape

Edge Requests dominate (catalog browsing, image asset traffic) → Image Optimization (product images) → Function Duration (cart/checkout APIs). ISR Reads matter when product pages use ISR.

## Priority patterns

1. **Catalog pages: aggressive ISR + image optimization.** Product list and product detail pages should be ISR with a sensible `revalidate` (60s-3600s). Every image should go through `next/image` (or the framework equivalent). For Vercel-hosted storefronts, image cost can dominate everything else.
2. **Checkout: keep dynamic, but parallelize external calls.** Cart/checkout/payment routes are correctly dynamic. The win is in reducing their function duration — `Promise.all` for independent calls to Stripe + inventory + tax services. Cite `vercel-react-best-practices:async-parallel`.
3. **Cart drawer hydration: lift `'use client'` to the leaf.** Cart components are interactive, but the page wrapping them shouldn't be. Hoist server-rendered parts upward; only the buttons/forms are client.
4. **Webhooks: separate, not on the user path.** Stripe/Shopify webhook handlers should live as their own routes with short duration limits. They don't share traffic patterns with the storefront.
5. **Edge middleware for A/B + region routing only.** Catalog locale routing is a fine fit. Auth/cart state belongs in the dynamic page, not middleware.

## Frequent gotchas

- **Product images served raw.** `<img src={product.imageUrl}>` for hundreds of variants costs more than the rest of the bill combined. Always next/image.
- **`force-dynamic` on the storefront homepage.** Often added during development to test cart-state behavior, never removed. Audit ruthlessly.
- **Sequential Stripe calls.** "Create customer" → "create subscription" → "create invoice" is often three sequential awaits where two could run in parallel.
- **Bot traffic on product search.** Marketing-driven traffic + bot traffic on search routes inflates edge request cost. Bot Protection often pays for itself within a month.

## Cross-references

- `vercel-react-best-practices:async-parallel` — parallelize Stripe/inventory/tax calls in checkout
- `vercel-react-best-practices:async-suspense-boundaries` — stream the checkout shell, fill cart drawer later
- `vercel-react-best-practices:bundle-defer-third-party` — defer analytics (GA, Mixpanel) post-hydration
- `https://nextjs.org/docs/app/api-reference/components/image` — for the catalog image fix
- `https://vercel.com/docs/bot-management` — for bot traffic on search/product routes


## REF: references/playbooks/marketing.md

# Marketing site

Landing pages, lead-capture forms, A/B-tested variants, region-routed homepages. Traffic is bursty (campaigns drive spikes). Bot traffic can be substantial.

## Typical billing shape

Edge Requests dominate. Image Optimization is high (hero images, illustrations, product screenshots). Bandwidth matters for video content. Function Duration is usually low — most pages are static or ISR.

## Priority patterns

1. **Aggressive caching at the edge.** Marketing pages rarely change between campaign updates. `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` keeps the CDN warm for 24h and stale-serves for a week.
2. **Bot Protection.** Marketing campaigns attract competitor scrapers and bot traffic that inflates edge requests without delivering value. If edge cost is > $100/month and Bot Protection is disabled, this is almost always the top platform rec.
3. **ISR for content-driven sections.** Customer logos, testimonials, "latest blog post" widgets, pricing tables — anything coming from a CMS. Revalidate hourly or on webhook.
4. **A/B test logic at the edge, not in the page.** Edge Middleware for the variant assignment; cached static page per variant. Don't render the variant choice on every request.
5. **Defer all third-party JS post-hydration.** Analytics, chat widgets, marketing pixels, cookie banners. None of them block the LCP. Cite `vercel-react-best-practices:bundle-defer-third-party`.

## Frequent gotchas

- **Hero images served at native resolution.** A 4MP hero image on every viewport, including mobile. `next/image` with `sizes` is mandatory.
- **Cookie banner blocks first paint.** GDPR-compliant cookie banners often render synchronously in the head. Defer; render after hydration; persist consent state via a tiny inline script.
- **Tracking pixel waterfalls.** Three different analytics services loaded in a chain. Load them after hydration in parallel; better yet, replace some with server-side tracking via webhook.
- **`/api/contact` is the only function but runs hot.** Marketing sites are mostly static but the contact form gets bot-spammed. Rate limit at middleware; consider a queue for outgoing emails.

## Cross-references

- `https://vercel.com/docs/bot-management` — almost always the right platform rec
- `https://vercel.com/docs/incremental-static-regeneration` — for CMS-driven sections
- `https://nextjs.org/docs/app/api-reference/components/image` — hero/illustration optimization
- `vercel-react-best-practices:bundle-defer-third-party` — defer analytics/pixels
- `https://nextjs.org/docs/app/building-your-application/routing/middleware` — A/B variant routing at the edge


## REF: references/playbooks/saas.md

# SaaS

Multi-tenant applications with authenticated dashboards, settings, billing. Auth-gated by default. Traffic skews toward function duration (per-user data fetches) over edge requests.

## Typical billing shape

Function Duration dominates (every dashboard request runs the function fully — no edge caching for auth-gated content). Edge Requests grow with API surface. ISR rarely applies. Image Optimization rarely material.

## Priority patterns

1. **Per-request memoization with React.cache().** Server Components called from multiple places in the same request tree often re-query the database. `React.cache()` dedupes within the request. Cite `vercel-react-best-practices:server-cache-react`.
2. **Parallel data loads in Server Components.** Dashboards typically load user + org + billing + recent-activity. Run all four in parallel via `Promise.all`. Cite `vercel-react-best-practices:async-parallel` and `:server-parallel-fetching`.
3. **Fluid Compute.** Auth-gated routes have higher cold-start sensitivity (every cold start is a user waiting). If cold-start signal shows up in observability, Fluid Compute is usually the right account-level rec.
4. **Async work after response.** Activity logs, audit trails, analytics events — anything that doesn't block the user — should run via `after()` (Next 15+) or `waitUntil()` from `@vercel/functions`. Cite `vercel-react-best-practices:server-after-nonblocking`.
5. **Suspense boundaries around expensive widgets.** The dashboard shell renders fast; widgets stream in. This shifts perceived latency without changing the underlying queries.

## Frequent gotchas

- **N+1 ORM queries.** A list page that loops over results and fetches related records per-item. Especially common with Prisma's `.findUnique` inside a `.map`. Use `include` or batch via DataLoader.
- **Sequential session+permission checks.** `await getSession()` then `await checkPermissions()` then `await loadData()` — these can often be parallelized when the permissions check doesn't depend on the data load.
- **No connection pooling on serverless.** Prisma without a pooler exhausts the database under load. Connection pooling is mandatory.
- **Polling for state from the client.** Every poll is a function invocation. Replace with SWR + on-demand revalidation, or with `revalidateTag` triggered by the mutation that actually changes state.

## Cross-references

- `vercel-react-best-practices:server-cache-react` — per-request dedup
- `vercel-react-best-practices:server-parallel-fetching` — restructure for Promise.all
- `vercel-react-best-practices:async-suspense-boundaries` — stream the dashboard shell
- `vercel-react-best-practices:server-after-nonblocking` — defer audit/analytics writes (Next 15+)
- `vercel-react-best-practices:client-swr-dedup` — replace polling with SWR
- `https://vercel.com/docs/fluid-compute` — when cold starts hurt


## REF: references/playbooks/sveltekit.md

# SvelteKit

Framework-specific playbook for SvelteKit projects on Vercel. Applies in
addition to whichever application-profile playbook fits (saas, ecommerce,
content-site, etc.). SvelteKit-on-Vercel ships through
`@sveltejs/adapter-vercel`, so most platform-level recs map to adapter
config rather than per-route framework APIs.

## Typical billing shape

Function Duration dominates server-rendered routes (every `+page.server.ts`
`load` + `+server.ts` POST handler runs as a function). Edge Requests grow
with API surface (`+server.ts` and form actions). ISR is supported via the
adapter; when enabled, it converts to a cache_result HIT after first render.
Image Optimization is rarely a SvelteKit-specific lever (it's the same
Vercel image service Next.js uses).

## Priority patterns

1. **Adapter ISR for cacheable content.** Routes that don't depend on
   per-request data are still served as functions by default. The
   adapter accepts an `isr: { expiration: 60 }` option per route (set
   in `+page.server.ts` via `export const config`). This converts
   function invocations to cache hits. Cite
   `https://kit.svelte.dev/docs/adapter-vercel` +
   `https://vercel.com/docs/incremental-static-regeneration`.
2. **Prerender what's static.** `export const prerender = true` in
   `+page.server.ts` or `+page.ts` moves a route from function to CDN.
   Cite `https://kit.svelte.dev/docs/page-options`.
3. **Parallel `load` fetches.** A `load` function with multiple
   sequential `await fetch(...)` calls leaves wall-clock time on the
   table — wrap them in `Promise.all` (or return promises directly
   from `load`, which SvelteKit streams). Cite
   `https://kit.svelte.dev/docs/load`.
4. **Move per-request work to `+server.ts` action handlers and run
   them via `fetch` from the client.** Reduces SSR cost when only a
   slice of the page actually needs server data on every request.
5. **`hooks.server.ts` matcher hygiene.** Like Next.js middleware, the
   `handle` hook intercepts every request unless filtered. Heavy
   `handle` code multiplies cost by request volume. Move work into the
   specific route's `load` when only that route needs it.
6. **Adapter runtime + region config.** Single-region default; if the
   project's users skew to a different region, set `regions: [...]` on
   the adapter to reduce TTFB by 100-300ms.

## Frequent gotchas

- **Per-route SSR when prerender would do.** Marketing pages, docs,
  blog posts often end up as functions because nobody added
  `prerender = true`. The scanner flags these.
- **`+layout.server.ts` data fetches blocking every child route.**
  Auth-check + user-load in a layout makes EVERY function invocation
  wait on those queries — even routes that don't read user. Push
  user-load into the routes that need it.
- **Adapter version drift.** `adapter-vercel@5` adds new options (ISR,
  split). `adapter-vercel@3` doesn't. The recommender must check the
  installed version before suggesting `isr: ...`.
- **`fetch` calls in `load` to your own SvelteKit routes.** SvelteKit
  optimizes these into direct module calls during SSR, but only if
  the URL is relative. A hardcoded `https://your-domain.tld/api/...`
  defeats this optimization.
- **No connection pooling on serverless.** Same as Next.js — Postgres
  without a pooler exhausts the database under load.

## Cross-references

- `https://kit.svelte.dev/docs/adapter-vercel` — adapter config (ISR, regions, runtime)
- `https://kit.svelte.dev/docs/page-options` — prerender, ssr, csr
- `https://kit.svelte.dev/docs/load` — parallel fetches in load
- `https://kit.svelte.dev/docs/routing` — file conventions
- `https://kit.svelte.dev/docs/hooks` — handle / handleFetch
- `https://kit.svelte.dev/docs/form-actions` — server-side form handling
- `https://kit.svelte.dev/docs/state-management` — request-scoped state
- `https://vercel.com/docs/incremental-static-regeneration` — ISR on Vercel
- `https://vercel.com/docs/fluid-compute` — Fluid Compute (framework-agnostic)


## REF: references/recommendations.md

# Recommendations

How recommendations are shaped, written, sanitized, and graded.

## Table of contents

- [Schema](#schema)
- [Writing rules](#writing-rules)
- [The 12 sanitizers](#the-12-sanitizers)
- [Envelope-unwrap recovery](#envelope-unwrap-recovery)
- [Grading rubric](#grading-rubric)
- [Next.js version awareness](#nextjs-version-awareness)

## Schema

Every recommendation is a JSON object matching this TypeScript shape:

```ts
interface Recommendation {
  // Customer-facing
  what: string;              // 1 line, lead with impact. Max 80 chars when feasible.
  why: string;               // 1-2 sentences. Root cause. Cites codebase findings + counts.
  fix: string;               // Step-by-step. Includes before/after code fences. Specific enough to implement.
  bucket: 'cost' | 'performance' | 'reliability';
  effort: 'low' | 'medium' | 'high';
  affectedFiles: string[];   // Verified file paths, from candidate.files
  currentBehavior: string;   // What the code does now (with snippet)
  desiredBehavior: string;   // Target state (with snippet)
  risk?: string;             // Optional: e.g., "Removing force-dynamic may serve stale data on /admin"
  verify: string;            // How to confirm the fix worked. e.g., "Re-run `vercel metrics …` and watch p95"

  // Impact (computed from impact-magnitude.mjs in Step 4)
  impactLabel: {
    performance?: string;    // PRECISE: "Reduce /api/products p95 from 850ms toward ~250-400ms"
    costMagnitude?: 'negligible' | 'small' | 'medium' | 'large' | 'very-large';
    costPhrase?: string;     // "hundreds of dollars per month at current traffic"
    billingDimension?: string;
    fractionReduced?: number;
  };
  impactTier: 'high' | 'medium' | 'low';
  billingDimension?: 'edge-requests' | 'function-duration' | 'image-optimization' | 'isr-reads' | 'isr-writes' | 'bandwidth' | 'data-cache-reads' | 'cron-invocations' | string;

  // Grounding
  citations: string[];       // From references/docs-library.json allow-list. Required: ≥1 entry.
  candidateRef?: string;     // The gate candidate this rec traces to (e.g., "uncached_route:/api/products")
  findingRefs?: string[];    // File:line markers from verifiedFindings.json
  appliesAlsoTo?: Array<{     // Added by dedup when matching recs collapse into one customer-facing item.
    candidateRef?: string;
    affectedFiles?: string[];
    o11ySignal?: string;
    what?: string;
  }>;
  corroborationCount?: number; // Number of matching verified recs folded into this item, including itself.

  // Verifier output (computed in Step 3.6)
  verification?: {
    passRate: number;
    failed: Array<{ type: string; text: string; reason: string }>;
  };

  // Sanitizer audit trail (computed in Step 3.4)
  sanitizerTrail?: string[]; // ["$-strip:2", "version-mismatch:next@15+:1", ...]
  needsReview?: boolean;     // Set when a sanitizer caught a hazard

  // Grading (Step 3.5)
  quality: {
    specificity: number;     // 0-1
    actionability: number;
    grounding: number;
    evidence: number;
    overall: number;
    grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
}
```

## Writing rules

The recommender prompt explicitly tells the agent to follow these rules. Sanitizers enforce them after generation.

**Voice and tone** are governed by [`references/voice.md`](./voice.md). Read it before writing recommendation prose; it keeps reports direct, metric-grounded, and free of internal process terms.

### Lead with impact

The `what` field opens with the verb + the change, not the framing. Compare:

- ❌ "Consider enabling caching on the /api/products route" (filler before substance)
- ✅ "Add Cache-Control with s-maxage to /api/products" (verb-first, scope-explicit)

### Cite codebase findings with line numbers

The `why` must reference a verified finding from `verifiedFindings.json`:

- ❌ "The route is uncached" (could apply anywhere)
- ✅ "src/app/api/products/route.ts:22 returns Response without Cache-Control; observability shows 0% cache hit on 1.2M invocations/mo"

### No $ literals in customer fields

The user-mandated rule. `what`/`why`/`fix`/`impact`/`currentBehavior`/`desiredBehavior` must not contain `$N` money literals. Use magnitude framing from `impact-magnitude.mjs`.

- ❌ "Save $340/mo by adding s-maxage"
- ✅ "Hundreds of dollars per month at current traffic"
- ✅ (precise performance) "Move 1.2M monthly invocations to the CDN; expect p95 to drop from 850ms toward ~50ms on cache hits"

The `$-strip` sanitizer enforces this at output time, but the prompt should also instruct the LLM not to emit dollar literals in the first place.

### Before/after code fences required

`currentBehavior` shows the offending snippet. `desiredBehavior` shows the target. Language-tagged code fences. Keep both under ~20 lines.

### Cite at least one URL from the library

`citations[]` must contain at least one entry from `references/docs-library.json`. The `missing-citation` sanitizer drops uncited recs. The `unknown-citation` and `version-mismatch` sanitizers strip invalid citations.

### Match the user's framework version

Don't recommend `'use cache'` (Next 15+) to a Next 13 user. The recommender prompt receives only the citation subset valid for the user's stack — but the LLM can still hallucinate. The `version-mismatch` sanitizer catches stragglers.

## The 12 sanitizers

Each sanitizer records its action in `rec.sanitizerTrail` when it mutates a field. Tag format: `tag:detail`. Tags are lexically stable — downstream consumers grep them.

| # | Sanitizer | Trigger | Action | Trail tag |
|---|---|---|---|---|
| 1 | `$-strip` | Money-literal regex in customer field | Replace with "the billed cost" | `$-strip:N` |
| 2 | `vercel-directive-strip` | `stale-if-error` / `proxy-revalidate` in cache-control | Strip directive (Vercel CDN doesn't honor) | `vercel-directive-strip:directive` |
| 3 | `rate-limit` | Concurrency × delay > known provider rate limit | Prepend caveat, set needsReview | `rate-limit:provider:prescribed/limit` |
| 4 | `pre-release` | Fix enables `-rc`/`-beta`/`-canary` feature | Append "requires pre-release version" caveat | `pre-release:pkg@version` |
| 5 | `middleware-conflict` | Rec targets route covered by middleware matcher | Append "Middleware {matcher} may intercept" caveat | `middleware-conflict:matcher` |
| 6 | `undeclared-dep` | Fix imports a package not in package.json | Prepend "Add dependency first: npm i {pkg}" | `undeclared-dep:pkg` |
| 7 | `count-correct` | Cited count > verified count, ground-truth known | Rewrite to "~N" with verified count | `count-correct:token:cited→actual` |
| 8 | `count-strip` | Cited count > verified count, no ground truth | Rewrite to "a number of" | `count-strip:token` |
| 9 | `rendering-mode-mislabel` | Rec blames ISR/SSR on a static page | Append warning, set needsReview | `rendering-mode-mislabel` |
| 10 | `unknown-citation` | URL not in `references/docs-library.json` | Strip URL, set needsReview if all stripped | `unknown-citation:url` |
| 11 | `version-mismatch` | URL's `applicableFrameworks` doesn't match stack | Strip URL, set needsReview if all stripped | `version-mismatch:url` |
| 12 | `missing-citation` | `citations.length === 0` after other sanitizers | DROP rec entirely | (rec not emitted; counted at end) |

The sanitizer order matters: dollar-strip runs first (cheap, deterministic), then content sanitizers, then citation sanitizers last. This guarantees citation count is computed against the final state.

The `recordSanitizer(rec, tag)` helper is the single entry point — sanitizers MUST call it before mutating fields. Otherwise the audit trail rots.

### Provider rate limits

Used by sanitizer #3. These provider limits are public contract values:

| Provider | Limit | Doc URL |
|---|---|---|
| Notion | 3 rps | https://developers.notion.com/reference/request-limits |
| OpenAI | 30 rps | https://platform.openai.com/docs/guides/rate-limits |
| Stripe | 100 rps | https://docs.stripe.com/rate-limits |
| Anthropic | 10 rps | https://docs.anthropic.com/en/api/rate-limits |

Tiers/plans differ; these are first-tier defaults. The sanitizer prepends a caveat if the rec prescribes higher concurrency.

## Envelope-unwrap recovery

Not a sanitizer — a recovery step. LLMs occasionally wrap their JSON output in an envelope:

```json
{ "data": { "recommendations": [...] } }
{ "result": { "recommendations": [...] } }
{ "insights": { "recommendations": [...] } }
```

`attemptManualRecovery` peels one wrapping layer before schema validation. Increments `hygieneCounters.envelopeUnwraps`. Logs the unwrap to the run log.

This is the only "creative" parsing the skill does. Anything else that fails schema validation is rejected.

## Grading rubric

Each rec is scored on four axes, 0-1 each. Average → grade:

| Axis | What it measures | Strong (1.0) signal |
|---|---|---|
| Specificity | Concrete files, line numbers, code snippets | Triple-backtick code fence OR inline code ≥10 chars + verified file path |
| Actionability | Clear "do this then that" steps | Numbered steps; verbs present in each step; no "consider"/"might" |
| Grounding | Claims trace to findings or metric data | `sourceIndex` matches a finding OR rec has affectedFiles + code fences (presumed evidence) |
| Evidence | Numeric, observed claims | Count words (errors, queries, invocations) + units (% / ms / s / K / M) |

Grade thresholds:
- `Excellent` ≥ 0.85
- `Good` 0.70 – 0.85
- `Fair` 0.55 – 0.70
- `Poor` < 0.55 → dropped at quality floor in Step 4

## Next.js version awareness

The recommender's citation library is filtered by `signals.json.stack.framework@frameworkVersion`. The agent should still self-check the version when picking which APIs to recommend:

| Feature | Available | Notes |
|---|---|---|
| App Router | Next ≥ 13.0 | Default since 14 |
| `generateStaticParams` | Next ≥ 13.0 | Replaces getStaticPaths for App Router |
| Fetch `next: { revalidate }` | Next ≥ 13.0 | Note: default fetch caching flipped in Next 15 |
| `unstable_cache` | Next 14-15 | Replaced by 'use cache' in 16 |
| `'use cache'` directive | Next ≥ 15.0 | Persistent cache primitive |
| `cacheLife()`, `cacheTag()` | Next ≥ 15.0 | Pairs with 'use cache' |
| `after()` | Next ≥ 15.0 | Non-blocking post-response work |
| Partial Prerendering | Next ≥ 15.0 | Stable target later — verify per release |
| `revalidateTag` / `revalidatePath` | Next ≥ 13.4 | Tag-based on-demand invalidation |
| `cookies()` / `headers()` async | Next ≥ 15.0 | Async pattern in 15+ |

The skill's curated citation library encodes these constraints via `applicableFrameworks`. If a contributor adds a new Next.js feature URL, they MUST set the right semver range in `references/docs-library.json`.


## REF: references/scanner-patterns.md

<!-- THIS FILE IS GENERATED by scripts/build-docs.mjs. Do not edit by hand. -->
<!-- To change scanner descriptions, edit lib/scanners/*.mjs metadata exports. -->
<!-- To change gate thresholds, edit lib/gates/*.mjs metadata exports. -->

# Scanner patterns

AST/grep-style scanners run in parallel with metric-driven investigation. They find known anti-patterns. Findings on cold-path or unmappable files are dropped unless the scanner declares `trafficIndependent: true`.

Total scanners: 15.

## Patterns

### `cache-components-suspense-dedupe` — 'use cache' with multiple Suspense boundaries on the same data

- **Severity**: medium
- **Billing dimension**: function-duration
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** Default `'use cache'` does not dedupe identical calls across separate `<Suspense>` boundaries on the same render. Each boundary re-invokes the cached function, multiplying function-duration cost and inflating ISR write churn when the output is large.

**Fix.** Hoist the promise to the page level (`const dataPromise = fetchData()` at the top, passed down to each Suspense child) OR move the shared fetch into a `'use cache: remote'` data-access layer so cross-request and cross-boundary dedupe applies.

**Citations:**
- `https://nextjs.org/docs/app/api-reference/directives/use-cache`
- `https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents`
- `https://nextjs.org/docs/app/guides/migrating-to-cache-components`

---

### `edge-heavy-import` — Heavy / node-only import inside edge-runtime file

- **Severity**: high
- **Billing dimension**: function-duration
- **Traffic-independent**: yes (cold-path findings survive the doctrine drop)

**Description.** Edge runtime is a constrained sandbox with no node: builtins and a much smaller cold-start budget than Node functions. Heavy SDKs (sharp, @aws-sdk/*, @prisma/client, pg, puppeteer) either fail at deploy or inflate cold-start latency. Move the import to a Node runtime function, or replace with an edge-compatible alternative (e.g., neon-driver instead of pg).

**Fix.** Either (a) drop the `export const runtime = 'edge'` so the route runs on Node (default in 2026), or (b) replace the heavy import with an edge-compatible alternative. For DB: use @neondatabase/serverless or @planetscale/database instead of pg/mysql2. For image: do the work in a Node route handler. For auth signing: use jose (Web Crypto) instead of jsonwebtoken.

**Citations:**
- `https://vercel.com/docs/functions/runtimes/edge-runtime`
- `https://vercel.com/docs/fluid-compute`

---

### `force-dynamic` — export const dynamic = 'force-dynamic'

- **Severity**: medium
- **Billing dimension**: function-duration
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** force-dynamic disables static + ISR rendering. The route runs the function on every request. Sometimes necessary (cookies, headers, real-time data), often a habit that costs function-duration and edge-requests at scale.

**Fix.** Audit the route. If dynamic behavior comes from cookies()/headers()/searchParams, force-dynamic may be redundant — Next infers dynamic automatically. Consider revalidate / 'use cache' / generateStaticParams if any portion can be pre-rendered.

**Citations:**
- `https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config`

---

### `headers-in-page` — Dynamic API call forcing dynamic rendering

- **Severity**: medium
- **Billing dimension**: function-duration
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** headers(), cookies(), and draftMode() are dynamic APIs. Reading them in a page/layout makes the entire segment dynamic — no ISR, no static generation, and a function invocation on every request.

**Fix.** Move the dynamic API call into a child Server Component that lives inside a Suspense boundary. The parent can stay static; only the leaf re-renders dynamically.

**Citations:**
- `https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config`
- `https://nextjs.org/docs/app/building-your-application/caching`

---

### `large-static-asset` — Large file in public/

- **Severity**: medium
- **Billing dimension**: bandwidth
- **Traffic-independent**: yes (cold-path findings survive the doctrine drop)

**Description.** Static assets in `public/` over 500 KB ship as-is from the CDN. Whether the cost is meaningful depends on traffic, but the candidate is binary — the file is either needed at that size or it can be optimized (compressed image, video transcode, or moved off the critical path).

**Fix.** Verify the asset is reachable on the customer-facing hot path. Then choose: (a) compress (convert PNG → AVIF/WebP; transcode MP4 to lower bitrate); (b) host externally (Vercel Blob, S3, or a media CDN with per-asset signed URLs); (c) lazy-load (defer to client-side fetch instead of bundling into initial HTML).

**Citations:**
- `https://vercel.com/docs/manage-cdn-usage`
- `https://vercel.com/docs/image-optimization`

---

### `max-age-without-s-maxage` — Cache-Control: max-age without s-maxage

- **Severity**: medium
- **Billing dimension**: edge-requests
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** max-age caches in the browser; s-maxage caches at the CDN. Without s-maxage, every uncached visitor request invokes the function. Adding s-maxage often cuts function invocations by 80%+ on read-heavy routes.

**Fix.** Add s-maxage to the Cache-Control header. Example: Cache-Control: public, max-age=60, s-maxage=600, stale-while-revalidate=86400. Pair with explicit cache-bust strategy if content can change.

**Citations:**
- `https://vercel.com/docs/caching/cdn-cache`
- `https://vercel.com/docs/caching/cache-control-headers`

---

### `middleware-broad-matcher` — Middleware matcher missing or too broad

- **Severity**: high
- **Billing dimension**: edge-requests
- **Traffic-independent**: yes (cold-path findings survive the doctrine drop)

**Description.** middleware.ts without a config.matcher (or matcher: ["/(.*)"]) runs on every request including _next/static, _next/image, favicon.ico, and image asset fetches. Edge-request cost scales accordingly.

**Fix.** Scope the matcher to actual application paths. Example: matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]

**Citations:**
- `https://nextjs.org/docs/app/building-your-application/routing/middleware`

---

### `missing-cache-headers` — Cacheable route or fetch with no caching (Cache-Control absent or no-store)

- **Severity**: medium
- **Billing dimension**: edge-requests
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** Two antipatterns: (a) GET handlers without explicit Cache-Control headers serve uncached; (b) fetch() calls with cache:"no-store" or next:{revalidate:0} opt out of caching even on cacheable upstream data. For non-auth routes / fetches, both are leaving cache hits on the floor.

**Fix.** For GET handlers: return a Response with Cache-Control: public, s-maxage=<seconds>, stale-while-revalidate=<window>. For fetch(): drop cache:"no-store" (use { next: { revalidate: <seconds> } } in Next.js) so the response is cached by the framework + CDN.

**Citations:**
- `https://vercel.com/docs/caching/cdn-cache`
- `https://vercel.com/docs/caching/cache-control-headers`
- `https://nextjs.org/docs/app/building-your-application/caching`

---

### `prisma-include-tree-bloat` — Deep Prisma include tree (3+ levels)

- **Severity**: high
- **Billing dimension**: function-duration
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** Nested .include({ x: { include: { y: { include: { z: ... } } } } }) makes Prisma issue a single huge join that scales O(N*M*K). Function duration explodes, memory spikes, often causes timeouts.

**Fix.** Replace with explicit .findMany() calls or scoped .include() of only what the consumer reads. Consider Prisma.select() to project specific fields. For lists, batch with DataLoader patterns.

**Citations:**
- `vercel-react-best-practices:server-parallel-fetching`

---

### `region-pin-in-config` — Function region pinned in config

- **Severity**: low
- **Billing dimension**: function-duration
- **Traffic-independent**: yes (cold-path findings survive the doctrine drop)

**Description.** vercel.json `regions` or per-route `preferredRegion` is set. If the pinned region is far from the dominant user geo (or far from a data source) p95 TTFB suffers. This scanner provides the configured-region signal so the region-misconfig gate can recommend an audit.

**Fix.** Audit the pinned region against traffic geography (Speed Insights or Web Analytics by country) and data-source location. Consider multi-region if data lives in a fixed location and users are global; consider relocating if users are concentrated in one geography.

**Citations:**
- `https://vercel.com/docs/functions/configuring-functions/region`
- `https://vercel.com/docs/functions/configuring-functions/region`

---

### `source-maps-production` — Source maps enabled in production

- **Severity**: low
- **Billing dimension**: edge-requests
- **Traffic-independent**: yes (cold-path findings survive the doctrine drop)

**Description.** productionBrowserSourceMaps: true ships .map files in the production bundle, increasing transfer size 30-100% per visitor. Useful for error reporting via Sentry; not useful for users.

**Fix.** Keep source maps generation but exclude them from the public bundle. Upload to your error tracker via build-time CI step; do not serve them with the deployment.

**Citations:**
- `https://nextjs.org/docs/messages/improper-devtool`

---

### `sveltekit-prerender-missing` — SvelteKit page without explicit prerender / ISR config

- **Severity**: low
- **Billing dimension**: function-duration
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** SvelteKit page or +page.server.ts is missing an explicit `prerender`, `ssr`, or adapter `config.isr` declaration. Default is per-request function execution — investigate whether the route could be prerendered or ISR-cached.

**Fix.** If the page is static (no per-user / per-request data), add `export const prerender = true` in +page.ts or +page.server.ts. If the data refreshes on a schedule, prefer adapter-vercel's ISR option via `export const config = { isr: { expiration: 60 } }`.

**Citations:**
- `https://kit.svelte.dev/docs/page-options`
- `https://kit.svelte.dev/docs/adapter-vercel`
- `https://vercel.com/docs/incremental-static-regeneration`

---

### `turbo-force-bypass` — Turborepo cache bypass on a monorepo

- **Severity**: high
- **Billing dimension**: build
- **Traffic-independent**: yes (cold-path findings survive the doctrine drop)

**Description.** Turborepo's per-task cache can be bypassed by an explicit force flag, a `cache: false` config, or missing build-skip configuration. Every commit can rebuild unchanged work; Build Minutes climb with project count.

**Fix.** Remove `TURBO_FORCE=true` from build env/scripts unless intentional. Set `tasks.build.cache: true` in `turbo.json` (or remove the override), and include generated outputs in Turbo's cache contract. Prefer Vercel's skip-unaffected monorepo behavior when available; use `ignoreCommand` only when that setting cannot cover the project.

**Citations:**
- `https://vercel.com/docs/monorepos`
- `https://vercel.com/docs/builds`
- `https://turborepo.dev/docs/crafting-your-repository/caching`

---

### `unoptimized-image` — Image optimization gap (raw <img>, global flag, missing sizes, or SVG mis-routed)

- **Severity**: high
- **Billing dimension**: image-optimization
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** Four shapes of image-cost waste: raw <img> tags bypass the framework Image component; `images.unoptimized: true` disables Vercel image optimization globally; <Image fill> without `sizes` forces serving the largest source variant; <Image src=".svg"> without `unoptimized` routes vector data through the raster pipeline.

**Fix.** For raw <img>: switch to next/image, enhanced-img (SvelteKit), <Image /> (Astro), or NuxtImg. For global unoptimized:true: remove the flag unless the project is hosted outside Vercel. For fill without sizes: add `sizes="(max-width: 768px) 100vw, 50vw"` or whatever matches your layout. For SVG: add `unoptimized` so the raw SVG ships instead of rastering it.

**Citations:**
- `https://nextjs.org/docs/app/api-reference/components/image`
- `https://vercel.com/docs/image-optimization`

---

### `use-cache-date-stamp` — new Date() / Date.now() / Math.random() inside a 'use cache' file

- **Severity**: high
- **Billing dimension**: isr
- **Traffic-independent**: no (cold-path findings get dropped)

**Description.** `'use cache'` memoizes by argument identity AND prerender output. A timestamp baked into the cached output (`new Date().getFullYear()` in a footer, `Date.now()` in a payload field) forces a fresh ISR write on every regeneration even when the underlying data is unchanged. Random values have the same failure mode.

**Fix.** Replace module-scope `new Date()` with a build-time constant (`const buildYear = new Date().getFullYear()`) or move per-request timestamps into a client component inside `useEffect`. Do not pass dates as arguments to `'use cache'` functions — they invalidate the cache every call.

**Citations:**
- `https://nextjs.org/docs/app/api-reference/directives/use-cache`
- `https://nextjs.org/docs/app/api-reference/functions/cacheLife`

---


## REF: references/scoring.md

## Step 4 — Score and report

This reference covers everything that happens after recommendations are drafted: quality floor, impact framing, sort order, the customer-facing report template, and the playbook selection matrix.

## Table of contents

- [Quality floor and prune rules](#quality-floor-and-prune-rules)
- [Impact framing — the magnitude rule](#impact-framing--the-magnitude-rule)
- [`impactLabel` schema](#impactlabel-schema)
- [Sort order and platform-rec cap](#sort-order-and-platform-rec-cap)
- [The customer-facing report template](#the-customer-facing-report-template)
- [Playbook selection matrix](#playbook-selection-matrix)

## Quality floor and prune rules

| Rule | Value | Why |
|---|---|---|
| Drop recommendations with `quality.overall < 0.55` | Hard cutoff (raised from 0.4 in May 2026 audit) | Bad-grade recs erode trust faster than they help. 0.55 matches the Poor/Fair grade boundary; recs below this are "Poor" and shouldn't ship. |
| Prune cap on findings | 30% of input | Stops the pruner from wiping the report when LLM merit-grades are noisy |
| Platform-rec cap | 3 | Account-level recs (Fluid, Bot Protection, Speed Insights) only have room for the top three |
| Quick-wins definition | `effort === 'low' AND priority > 40` | Surfaces fixes the user can ship in a single PR |
| Savings floor (internal ranking only) | $5/mo equivalent | Below this, even a "high" tier impact translates to "negligible" magnitude |

## Impact framing — the magnitude rule

**Performance: be precise.** Use observed numbers. Example:

> "Reduce /api/products p95 from 850ms toward ~250-400ms; cache hit would lift from 0% toward ~60% based on similar cached routes."

Performance numbers come from `signals.json.metrics.*` — they're observed, not extrapolated. Cite the exact route + metric value.

**Dollar cost: never precise.** Use MAGNITUDE BUCKETS via `lib/impact-magnitude.mjs`'s `impactMagnitude({currentCost, impactTier})`:

| Estimated reduction (USD) | Magnitude | Customer-facing phrase |
|---|---|---|
| < $5 | `negligible` | "small cost impact at current traffic" |
| $5 – $50 | `small` | "low-tens of dollars per month at current traffic" |
| $50 – $500 | `medium` | "hundreds of dollars per month at current traffic" |
| $500 – $5,000 | `large` | "low-thousands of dollars per month at current traffic" |
| > $5,000 | `very-large` | "thousands+ of dollars per month at current traffic" |

Reduction is computed as `currentCost × fraction` where `fraction = {high: 0.4, medium: 0.2, low: 0.1}[impactTier]`. The fraction is intentionally conservative — we'd rather under-promise than mislead.

### Discountable vs non-discountable SKUs

When the project is on a Flex Commit and the report frames savings against contract burndown, segment spend before phrasing. Field doctrine (May 2026): the Flex discount slider applies only to a subset of SKUs.

| Discountable (slider applies) | Non-discountable (raw rate) |
|---|---|
| Seats | Build CPU Minutes |
| Edge Requests | Fluid Active CPU |
| Fast Data Transfer | Fluid Provisioned Memory |
| Fast Origin Transfer | Raw Flex top-up |
| Image Optimization | |
| ISR Reads / Writes | |
| Observability Events | |

A recommendation that targets a non-discountable SKU should never frame savings as a percentage of contract; frame as absolute magnitude only. Conversely, a discountable-SKU recommendation may surface "applies to contract burndown" in the magnitude phrase.

**Why magnitudes:**

- Traffic varies. A "20% reduction in edge requests" is exact at today's traffic and meaningless next quarter.
- Pricing changes. Vercel's billing rates move; precise dollar projections rot.
- The user is smart. They'd rather see "hundreds of dollars per month" with a real metric backing it than `$340/mo` with a hand-wave behind it.
- The `$-strip` sanitizer enforces this at output time. Any `$N` literal that slips into customer-facing fields is replaced with "the billed cost" before rendering.

## `impactLabel` schema

```ts
type ImpactLabel = {
  // PRECISE: performance recs
  performance?: string;
  // MAGNITUDE: cost recs
  costMagnitude?: 'negligible' | 'small' | 'medium' | 'large' | 'very-large';
  costPhrase?: string;
  billingDimension?: string;   // 'Edge Requests' | 'Function Duration' | ...
  fractionReduced?: number;    // 0.2 = ~20% — internal only, NOT rendered
};
```

Cost recs render `costPhrase`. Performance recs render `performance`. Reliability recs frame impact as observed error/timeout reduction (e.g., "Cuts 5xx rate from 0.4% to <0.1% based on current traffic").

When a rec spans buckets — e.g., a caching fix that reduces both cost AND latency — render both lines.

## Sort order and platform-rec cap

Internal sort key (never rendered): `priority = currentDimensionCost × fractionReduced × confidence`.

The list of recs the customer sees is sorted by this priority. The platform recommendations section is capped at 3, sorted the same way.

## The customer-facing report template

The agent renders this as the final output of Step 4. The shape is fixed; the content comes from the merged signals + verified recommendations + the `gated[]` list from Step 2.

```markdown
# Vercel Optimization Report — {projectName}

**Stack**: {framework}@{frameworkVersion} | {router} | {orm}
**Plan**: {plan.plan} ({plan.reason})
**Period**: {usage.period.from} → {usage.period.to}
**Observability**: {observability status}

## Cost breakdown

| Service | Usage | Billed Cost |
|---|---|---|
| (non-zero rows from usage.services, sorted by billedCost desc) |

Total billed: {usage.totals.billedCost} (we render the precise current cost — we just don't project future precise savings)

Omit zero-cost service rows from the table at the same cent precision shown to customers. If every row has `$0.00` billed cost but `effectiveCost` / USD `pricingQuantity` is non-zero, explain that net billed cost is `$0.00` after included credits or allotments and show the effective usage cost table instead. If both billed and effective costs are `$0.00`, replace the table with a concise note that `vercel usage` returned a billing payload but every reported service cost was `$0.00` for the window.

If `vercel usage` was queried and unavailable, the cost breakdown is replaced by an observability-derived cost ranking from `metrics.fnGbHrByRoute` + `metrics.fnCpuMsByRoute` + `metrics.fdtByRoute` when those metrics exist. These don't translate directly to dollars — they show *which routes consume the billable units* so the user knows what to attack first. If `usageError` is `NOT_COLLECTED_OBSERVABILITY_BLOCKED` or another `NOT_COLLECTED_*` value, say usage was not collected; do not describe it as a billing-plan or Costs-feature finding.

Render Observability status from the actual collection state:
- `Observability Plus enabled — per-route metrics included` when `observabilityPlusUsable=true`.
- `Per-route metrics unavailable — audit paused before metric-backed route ranking` when an Observability Plus blocker stopped the run before billing/scanner collection.
- `Per-route metrics unavailable — analysis based on billing + scanner findings` when the user accepted a limited audit and billing/scanner signals were collected.
- `Per-route metrics unavailable — limited analysis based on scanner findings` when the user accepted a limited audit but billing usage was queried and unavailable.
- `Not checked — audit paused at unsupported-framework preflight` when framework support stopped the run before the Observability Plus check.
- `Not enabled — analysis based on billing + scanner findings` only for legacy/limited reports where Observability Plus is known false and billing/scanner signals exist.

## Highest-impact recommendations

For each high-priority rec, in order:
1. **{route or file}** — {o11ySignal}
1. **{readable candidate label}** — {readable metric labels}
   - **What to do**: {rec.what}
   - **Impact**: {impactLabel.performance ?? impactLabel.costPhrase}
   - **Effort**: {rec.effort}
   - **Citations**: {rec.citations}

## Recommendations

### High impact

| # | Bucket | What | Impact | Effort | Citations |
|---|---|---|---|---|---|

### Medium impact
### Low impact

## Platform recommendations

(account-level recs from gate, capped at 3)

## Observations from investigation

Non-recommendation findings from reconciliation or investigation: deployment regressions, route-error storms, metric mismatches, and other real signals that should not become speculative performance recommendations.

Observations must not contain implementation-grade actions. If the suggested action says to enable, add, wrap, apply, move, configure, challenge, deny, or otherwise change code or project settings, the renderer must hold it back until it passes the ready-to-apply recommendation evidence bar. Customer-visible observations can ask for narrower evidence collection: inspect logs, compare deployments, check headers, or confirm cacheability.

## Investigated, no change recommended

Candidates that were checked but did not produce a supported recommendation. Use plain reasons; do not use "abstain" in customer-facing copy.

| Candidate | Why no recommendation shipped |
|---|---|
| Slow route on /docs | Detailed metrics did not support a code change |

## Not investigated in this run

This section earns the user's trust. For every metric signal we considered but didn't act on, group by candidate type and reason:

| Candidate type | Why not investigated | Targets | Count |
|---|---|---|---:|
| Low cache-hit route | hitRate 0.65 above threshold | /api/orders | 1 |
| Slow route | left for a larger run | /api/docs<br>/api/learn | 2 |

## Strengths

(what the project is doing right — caching is healthy on routes X/Y/Z; Fluid Compute is enabled; etc.)

## Data gaps

(what we couldn't measure — Observability Plus disabled means no per-route latency, etc.)
```

Common data gaps to call out when the underlying metric returned empty rows. If the metric query failed (`ok=false`), say the metric was not usable with the code; do not convert failed queries into "no measurements" or "not used" claims.

- **Core Web Vitals empty.** The Speed Insights metric returned no measurements for the 14-day window. The `cwv_poor` gate stayed dormant; no claims about LCP/INP/CLS are made.
- **ISR empty.** Project doesn't use Incremental Static Regeneration. The `isr_overrevalidation` gate stayed dormant.
- **Middleware empty.** No `middleware.ts` (or matcher excludes all observed traffic). The `middleware_heavy` gate stayed dormant.
- **Image transformations empty.** No `next/image` usage or no images served in the window.
- **BotID checks empty.** BotID is disabled — see the `platform_bot_protection` recommendation for the toggle.
- **Cold-start data near-zero.** Fluid Compute may already be enabled, or the project's traffic pattern keeps warm instances available; the `cold_start` gate evaluates the data but emits no candidate.

The "Not investigated in this run" section is critical. It comes directly from `gate.json` produced by the gate. It tells the user we considered everything; we didn't just pick the easy targets.

## Playbook selection matrix

The recommender selects 0-2 playbooks based on the project's `stack.applicationProfile` (inferred from frameworks + deps) and the top billing dimensions.

| Application profile | Likely top dimensions | Apply playbooks |
|---|---|---|
| `ai-application` (AI SDK, AI Gateway, Sandbox usage) | AI Gateway, Sandbox Active Compute, Function Duration | `playbooks/ai-application.md` |
| `ecommerce` (Stripe, Shopify, cart components) | Edge Requests, Function Duration | `playbooks/ecommerce.md` |
| `saas` (auth, dashboards, multi-tenant) | Function Duration, Bandwidth | `playbooks/saas.md` |
| `api-service` (mostly API routes, no UI) | Function Duration, Edge Requests | `playbooks/api-service.md` |
| `content-site` (blog, docs, mostly static) | Edge Requests, Image Optimization | `playbooks/content-site.md` |
| `marketing` (landing pages, A/B tests) | Edge Requests, ISR Reads | `playbooks/marketing.md` |

`ai-application` is checked first in `inferPlaybook()` — an AI-heavy SaaS or AI commerce app shares the AI playbook's billing shape (AI Gateway dominant) and gotchas, not the dashboard or cart-checkout patterns.

Playbooks shape phrasing and ordering of recommendations. They never invent claims — every rec must still trace back to verified findings.


## REF: references/support-topics/README.md

# Support Topics

Support topics are small, candidate-scoped investigation guardrails injected into sub-agent briefs.

They are not recommendations, gates, scanners, or broad documentation. A topic tells the investigator what evidence to check, what false positives to avoid, and when to abstain for one class of candidate.

## Add A Topic

Add one file: `references/support-topics/<id>.md`.

The filename must match the `id`. Frontmatter uses a strict subset of YAML: one `key: value` per line, arrays as JSON arrays.

```md
---
id: cdn-cache-auth-safety
title: CDN cache auth safety
status: active
candidateKinds: ["uncached_route", "cache_header_gap"]
frameworks: ["*"]
priority: 90
citations: ["https://vercel.com/docs/caching/cdn-cache"]
maxBriefChars: 900
---

## Investigation Brief
...

## Evidence To Check
...

## Do Not Recommend When
...

## Verification
...
```

## Rules

- Every active topic must cite only URLs or skill-rule refs already present in `references/docs-library.json`.
- Use `candidateKinds` to keep the topic narrow. Use `"*"` only for workflow/protocol topics that truly apply to every candidate.
- Use optional `metrics` only when a topic applies to a specific candidate metric, such as `["LCP"]`, `["INP"]`, or `["CLS"]` for Core Web Vitals.
- Use optional `routePatterns` as JavaScript regex source strings when a topic should appear only for specific candidate routes, such as `["(^|/)404$"]`.
- Keep the body below `maxBriefChars`; the brief renderer caps selected topics before they reach the sub-agent.
- Put URLs in frontmatter only. Topic bodies should describe checks and guardrails, not cite new sources.
- Do not include internal repository paths, service names, pricing tables, exact savings claims, or framework APIs without version gating.


## REF: references/support-topics/astro-edge-middleware-scope.md

---
id: astro-edge-middleware-scope
title: Astro edge middleware scope
status: active
candidateKinds: ["middleware_heavy"]
frameworks: ["astro@*"]
priority: 88
citations: ["https://vercel.com/docs/frameworks/frontend/astro", "https://docs.astro.build/en/guides/integrations-guide/vercel/"]
maxBriefChars: 800
---

## Investigation Brief
Astro middleware can run at the edge for broad request sets. If middleware volume is high, prove which paths actually need interception.

## Evidence To Check
Use middleware invocation share and top paths. Inspect adapter middleware mode, middleware source, auth/redirect logic, and whether static assets, prerendered pages, or public pages are being intercepted.

## Do Not Recommend When
Do not bypass required auth, locale, header, or routing logic. Do not move global middleware work into every page when the current scope is already minimal.

## Verification
Name the middleware share, dominant paths, current middleware mode, and exact source or config line to narrow.


## REF: references/support-topics/astro-output-mode-and-isr.md

---
id: astro-output-mode-and-isr
title: Astro output mode and ISR
status: active
candidateKinds: ["uncached_route", "rendering_candidate"]
frameworks: ["astro@*"]
priority: 90
citations: ["https://vercel.com/docs/frameworks/frontend/astro", "https://docs.astro.build/en/guides/on-demand-rendering/", "https://docs.astro.build/en/reference/configuration-reference/"]
maxBriefChars: 850
---

## Investigation Brief
Astro defaults to static output; `server` output makes pages render on demand unless route-level prerendering changes that. First decide whether the hot route truly needs SSR.

## Evidence To Check
Inspect `astro.config`, adapter options, `output`, route-level `prerender`, dynamic params, middleware, and whether the content is shared across visitors. Compare route cache result and request volume.

## Do Not Recommend When
Do not prerender or cache personalized, preview, cart, checkout, or auth-gated pages. Do not change output mode for the whole app when one route-level flag is enough.

## Verification
Name the Astro output mode, route-level prerender state, observed route signal, and exact config or page line.


## REF: references/support-topics/auth-preserving-parallelization.md

---
id: auth-preserving-parallelization
title: Authorization-preserving parallelization
status: active
candidateKinds: ["slow_route"]
frameworks: ["*"]
priority: 90
citations: ["vercel-react-best-practices:async-parallel", "vercel-react-best-practices:server-parallel-fetching"]
maxBriefChars: 900
---

## Investigation Brief
Parallelizing awaits is safe only when it does not move private data access ahead of the auth, ownership, tenant, or permission check protecting that data.

## Evidence To Check
List every awaited operation being reordered. If a private lookup currently runs after `getSession()`, an ownership query, a tenant check, or a redirect guard, prove the lookup itself enforces the same predicate before recommending `Promise.all`.

## Do Not Recommend When
Do not parallelize a private record fetch with the ownership check that authorizes that fetch. Instead, recommend combining the guard and data lookup into one query constrained by the authenticated user, tenant, or ownership key.

## Verification
The fix must preserve the sequential guard or replace it with a single authorized query. Do not promise a latency drop equal to a helper unless that helper duration was measured.


## REF: references/support-topics/bot-protection-product-guardrails.md

---
id: bot-protection-product-guardrails
title: Bot Protection product guardrails
status: active
candidateKinds: ["platform_bot_protection"]
frameworks: ["*"]
priority: 90
citations: ["https://vercel.com/docs/bot-management", "https://vercel.com/docs/vercel-firewall/vercel-waf/managed-rulesets", "https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules", "https://vercel.com/docs/botid"]
maxBriefChars: 800
---

## Investigation Brief
Bot Protection recommendations must be grounded in observed automated traffic or meaningful edge-request scale.

## Evidence To Check
Check bot bandwidth share, edge request volume, existing WAF managed rules, and whether BotID or Bot Protection is already enabled. Prefer a staged Log to Challenge or Deny path for rules whose false-positive risk is not proven.

## Do Not Recommend When
Do not recommend disabling Vercel security products to reduce cost. Do not recommend Bot Protection for quiet projects with no bot evidence.

## Verification
State the observed bot share or scale signal, current protection state, and any existing log, challenge, deny, or BotID check.


## REF: references/support-topics/build-minutes-monorepo-fanout.md

---
id: build-minutes-monorepo-fanout
title: Build Minutes monorepo fanout
status: active
candidateKinds: ["build_minutes_fanout"]
frameworks: ["*"]
scannerPatterns: ["turbo-force-bypass"]
priority: 90
citations: ["https://vercel.com/docs/monorepos", "https://vercel.com/docs/builds", "https://turborepo.dev/docs/crafting-your-repository/caching"]
maxBriefChars: 900
---

## Investigation Brief
Build Minutes climbs when commits rebuild unchanged work. Common causes: `TURBO_FORCE`, `cache: false`, missing outputs, or disabled build-skip settings.

## Evidence To Check
Confirm Build Minutes share and scanner subtype. Inspect `package.json`, `turbo.json`, outputs, `.gitignore`, `vercel.json`, and project settings. If `build` runs migrations, split them into an uncached step before recommending Turbo build caching.

## Do Not Recommend When
Skip under 5% bill share with no scanner finding. Skip single-project repos and intentional CI-only force flags. Do not recommend `ignoreCommand` from repo grep alone; dashboard-only skip-unaffected may be better.

## Verification
Name the offending file and pattern. Recommend only the verified fix: cache a pure build task, add generated `outputs`, enable skip-unaffected builds, or add `ignoreCommand` only when needed.


## REF: references/support-topics/cache-components-static-shell-boundaries.md

---
id: cache-components-static-shell-boundaries
title: Cache Components static shell boundaries
status: active
candidateKinds: ["rendering_candidate"]
frameworks: ["next@>=16.0.0"]
priority: 94
citations: ["https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents", "https://nextjs.org/docs/app/getting-started/caching", "https://nextjs.org/docs/app/guides/migrating-to-cache-components"]
maxBriefChars: 900
---

## Investigation Brief
On Next.js 16 with Cache Components, avoid older segment-config advice. The right question is whether the route can keep a static shell while dynamic data moves behind explicit cached or runtime boundaries.

## Evidence To Check
Check `cacheComponents`, `use cache`, `cacheLife`, request-time APIs, Suspense boundaries, and scanner evidence such as `force-dynamic` or `headers-in-page`.

## Do Not Recommend When
Do not suggest `dynamic`, `revalidate`, or `fetchCache` as the primary fix when Cache Components is enabled. Do not cache request-personalized content.

## Verification
Name the Next.js version, Cache Components state, dynamic trigger, and the exact boundary or directive that can change.


## REF: references/support-topics/cache-components-suspense-dedupe-pitfall.md

---
id: cache-components-suspense-dedupe-pitfall
title: Cache Components Suspense dedupe pitfall
status: active
candidateKinds: ["cache_components_suspense_dedupe"]
frameworks: ["next@>=16.0.0"]
scannerPatterns: ["cache-components-suspense-dedupe"]
priority: 87
citations: ["https://nextjs.org/docs/app/api-reference/directives/use-cache", "https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents", "https://nextjs.org/docs/app/guides/migrating-to-cache-components"]
maxBriefChars: 900
---

## Investigation Brief
Default `'use cache'` does not dedupe identical calls across separate `<Suspense>` boundaries on the same render. Each boundary re-invokes the cached function, multiplying function-duration and ISR write churn.

## Evidence To Check
Confirm the scanner finding's repeated fetch URL or helper name. Verify the call sites are within the same route segment and inside distinct `<Suspense>` boundaries. Cross-reference `fnDurationP95ByRoute` and `isrWritesByRoute` for the owning route.

## Do Not Recommend When
Skip if the repeated call is intentional (different parameters, different intent). Skip if the duplicate is in a single component body where in-request memoization already applies.

## Verification
Name the duplicated call, count, and either: (a) the page-level promise to hoist or (b) the function to move to `'use cache: remote'`.


## REF: references/support-topics/cdn-cache-auth-safety.md

---
id: cdn-cache-auth-safety
title: CDN cache auth safety
status: active
candidateKinds: ["uncached_route", "cache_header_gap"]
frameworks: ["*"]
priority: 100
citations: ["https://vercel.com/docs/caching/cdn-cache", "https://vercel.com/docs/caching/cache-control-headers", "https://vercel.com/docs/project-configuration"]
maxBriefChars: 900
---

## Investigation Brief
Treat edge caching as a safety question first. The route must be a public, cacheable GET path before a shared-cache recommendation is allowed.

## Evidence To Check
Use `methodDistribution`, `cacheBreakdown`, and headers. Before `s-maxage`, rule out cookies, sessions, authorization, draft state, and user-specific data.

## Do Not Recommend When
Do not cache mutations, dashboards, account data, request-personalized responses, or routes whose value changes per viewer. Do not mix `private` with shared-cache directives.

## Verification
Name GET share, cache mix, file line, and policy: mechanism, scope, TTL/freshness, and `Vary`. If the right policy is `no-store`, emit no-change/observation.


## REF: references/support-topics/cold-start-initialization-bundle.md

---
id: cold-start-initialization-bundle
title: Cold-start initialization and bundle weight
status: active
candidateKinds: ["cold_start"]
frameworks: ["*"]
priority: 92
citations: ["https://vercel.com/docs/functions/debug-slow-functions", "https://vercel.com/docs/functions/limitations", "https://vercel.com/docs/functions/runtimes"]
maxBriefChars: 850
---

## Investigation Brief
Cold-start candidates need a code-path check, not only a project-setting check. First prove whether cold requests are paying for imports, module-scope setup, runtime choice, or dependency weight.

## Evidence To Check
Use `startTypeSplit`, `coldVsWarmLatencyP95`, and `coldByDeployment`. In source, inspect module-scope SDK setup, database/client construction, top-level network calls, heavy dependencies, runtime exports, and deployment-local changes.

## Do Not Recommend When
Do not blame cold starts when warm requests are similarly slow. Do not recommend keep-warm traffic or more memory before proving initialization or runtime pressure.

## Verification
Name the cold-start share, cold-vs-warm gap, and exact initialization, dependency, or runtime line that explains it.


## REF: references/support-topics/core-web-vitals-client-bottlenecks.md

---
id: core-web-vitals-client-bottlenecks
title: Core Web Vitals client bottlenecks
status: active
candidateKinds: ["cwv_poor"]
frameworks: ["*"]
priority: 90
citations: ["https://vercel.com/docs/speed-insights", "https://web.dev/articles/vitals", "https://web.dev/articles/optimize-lcp", "https://web.dev/articles/optimize-inp", "https://web.dev/articles/optimize-cls"]
maxBriefChars: 850
---

## Investigation Brief
Core Web Vitals candidates need metric-specific investigation. LCP, INP, and CLS usually have different causes and fixes.

## Evidence To Check
Use the poor metric in the deep dive first. For LCP, inspect server response and critical media. For INP, inspect heavy client JavaScript and interaction handlers. For CLS, inspect dimensions, fonts, and injected content.

## Do Not Recommend When
Do not emit a generic “improve Web Vitals” recommendation. Do not optimize a metric that is not poor for this route.

## Verification
Name the poor p75 metric, its value, and the exact source mechanism behind that metric.


## REF: references/support-topics/database-egress-pooling-region.md

---
id: database-egress-pooling-region
title: Database region and connection pressure
status: active
candidateKinds: ["slow_route"]
frameworks: ["*"]
priority: 60
citations: ["https://vercel.com/docs/regions", "https://vercel.com/docs/functions", "https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package", "https://vercel.com/docs/functions/limitations"]
maxBriefChars: 800
---

## Investigation Brief
Only recommend database or region changes when source and metrics both point to downstream I/O rather than in-process compute.

## Evidence To Check
Compare `cpu.p95` with `latency.p95`, then inspect database awaits, query fan-out, connection creation, pool lifecycle handling, and configured regions in project files.

## Do Not Recommend When
Do not name a database provider, pooling product, or region change unless the repo and project config prove it applies.

## Verification
Tie the finding to the observed wall-clock gap and the exact query, pool, or region configuration line.


## REF: references/support-topics/dynamic-rendering-traps.md

---
id: dynamic-rendering-traps
title: Dynamic rendering traps
status: active
candidateKinds: ["rendering_candidate"]
frameworks: ["next@>=13.0.0"]
priority: 90
citations: ["https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config", "https://nextjs.org/docs/app/api-reference/functions/generate-static-params", "https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering"]
maxBriefChars: 850
---

## Investigation Brief
Rendering candidates are only actionable when the dynamic behavior is accidental. First prove that the route can be static, ISR, or partially static.

## Evidence To Check
Inspect `dynamic`, `revalidate`, `generateStaticParams`, route params, and dynamic APIs such as request headers or cookies. Check whether the dynamic call is in a layout, because that can affect a larger route tree.

## Do Not Recommend When
Do not remove dynamic rendering for auth, personalization, draft mode, per-request redirects, or request-specific data.

## Verification
The recommendation must cite the dynamic trigger and explain why the target route can tolerate static or ISR behavior.


## REF: references/support-topics/external-api-critical-path-platform.md

---
id: external-api-critical-path-platform
title: Cross-framework external API critical path
status: active
candidateKinds: ["external_api_slow"]
frameworks: ["*"]
priority: 86
citations: ["https://vercel.com/docs/functions/debug-slow-functions", "https://vercel.com/docs/caching/runtime-cache", "https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package"]
maxBriefChars: 850
---

## Investigation Brief
External API candidates are actionable only when the slow hostname is on a customer route's critical path. Prove the route waits on it before suggesting a cache, payload, or post-response change.

## Evidence To Check
Use hostname latency, caller routes, transfer bytes, and source awaits. Check sequential calls, overbroad payloads, repeated shared data, and side effects that can move after the response.

## Do Not Recommend When
Do not cache mutations, secrets, per-user responses, or unknown freshness contracts. Do not blame Vercel runtime when the upstream owns the latency.

## Verification
Name the hostname, caller route, observed p75/p95 or bytes, and exact await or fetch line that blocks the response.


## REF: references/support-topics/external-api-critical-path.md

---
id: external-api-critical-path
title: External API critical path
status: active
candidateKinds: ["external_api_slow"]
frameworks: ["next@>=13.0.0"]
priority: 90
citations: ["vercel-react-best-practices:async-parallel", "vercel-react-best-practices:server-parallel-fetching", "vercel-react-best-practices:server-cache-react"]
maxBriefChars: 850
---

## Investigation Brief
For external API candidates, identify the customer route that waits on the slow hostname and whether the call is on the critical path.

## Evidence To Check
Use callers-by-route evidence, transfer size, and source awaits. Check whether the upstream call can run in parallel, be cached safely, be reduced in payload size, or move after response.

## Do Not Recommend When
Do not cache mutations, secrets, per-user responses, or upstream calls whose freshness requirement is unknown.

## Verification
Name the hostname, caller route, p75 or p95 latency, and the exact source line that waits on the call.


## REF: references/support-topics/fast-data-transfer-payloads.md

---
id: fast-data-transfer-payloads
title: Fast Data Transfer payloads
status: active
candidateKinds: ["uncached_route"]
frameworks: ["*"]
priority: 65
citations: ["https://vercel.com/docs/manage-cdn-usage", "https://vercel.com/docs/caching/cdn-cache"]
maxBriefChars: 900
---

## Investigation Brief
When uncached routes carry high bandwidth, check payload shape before recommending only cache headers. Fast Data Transfer includes the bytes transferred by requests and responses; compare compressed response sizes to the signal, not raw JSON.

## Evidence To Check
Use `bandwidthByCache`, response size, and source serialization. Look for unbounded JSON, large embedded objects, static files through functions, missing pagination.

## Do Not Recommend When
Do not shrink payloads without identifying fields or assets that are unnecessary for the route’s response.

## Verification
Tie the finding to observed bytes, cache result mix, and the exact response line. A "large payload" claim must reflect post-compression bytes — the unit FDT meters.


## REF: references/support-topics/fluid-compute-caveats.md

---
id: fluid-compute-caveats
title: Fluid compute caveats
status: active
candidateKinds: ["platform_fluid_compute", "cold_start"]
frameworks: ["*"]
priority: 80
citations: ["https://vercel.com/docs/fluid-compute"]
maxBriefChars: 900
---

## Investigation Brief
Fluid compute is a project-level lever. Use it when the setting is off and metrics show cold-start or warm-instance reuse pressure. Fluid can handle multiple invocations in one function instance; avoid per-request state in module scope.

## Evidence To Check
Check project facts, `startTypeSplit`, cold-vs-warm latency, and routes carrying the cold-start share. When enabling Fluid, audit module-state hazards Fluid surfaces (not creates): module-scoped mutable state, lazy singletons holding per-user data, globals keyed on per-request inputs.

## Do Not Recommend When
Do not recommend enabling fluid compute when project facts say it is already on. Do not frame as a file-level code fix.

## Verification
State project setting, cold-start rate or fallback slow-route signal, affected route concentration. If enabling, call out module-state audit as follow-up.


## REF: references/support-topics/function-duration-io-and-after.md

---
id: function-duration-io-and-after
title: Function duration, I/O, and post-response work
status: active
candidateKinds: ["slow_route"]
frameworks: ["next@>=15.0.0"]
priority: 75
citations: ["https://nextjs.org/docs/app/api-reference/functions/after", "vercel-react-best-practices:async-parallel", "vercel-react-best-practices:server-after-nonblocking"]
maxBriefChars: 850
---

## Investigation Brief
When wall-clock latency is much higher than CPU time, check critical-path awaits before blaming rendering or compute.

## Evidence To Check
Compare `cpu.p95`, `ttfb.p95`, and `latency.p95`. In source, separate dependent awaits from independent awaits, and identify analytics, logging, or notification work that can run after the response.

## Do Not Recommend When
Do not wrap dependent operations in `Promise.all`. Do not replace `Promise.allSettled` when partial failure handling is intentional.

## Verification
Name the awaits that can move, the work that can run post-response, and the observed CPU-vs-wall-clock gap.


## REF: references/support-topics/function-invocation-reduction.md

---
id: function-invocation-reduction
title: Function invocation reduction
status: active
candidateKinds: ["slow_route"]
frameworks: ["next@>=13.0.0"]
priority: 70
citations: ["https://react.dev/reference/react/cache", "vercel-react-best-practices:server-parallel-fetching", "vercel-react-best-practices:server-cache-react"]
maxBriefChars: 850
---

## Investigation Brief
For slow routes, prove duplicated in-request work in the listed files before recommending consolidation or memoization.

## Evidence To Check
Look for repeated awaits, duplicate fetches, same-app route handler calls, and helpers that run more than once per request.

## Do Not Recommend When
Do not collapse endpoints called independently by different clients. Do not persistently cache user-specific data. Do not recommend `Promise.all` for CPU-bound or compile-bound work unless trace/span evidence shows wait time to overlap. High `cpu.p95` near `latency.p95` is a warning sign, not proof of a latency win.

## Verification
Quote duplicated call sites with `latency.p95`, `cpu.p95`, or request-count evidence. If the fix overlaps awaits, cite measured helper/span timing or state the impact is unmeasured.


## REF: references/support-topics/function-region-misconfiguration-ttfb.md

---
id: function-region-misconfiguration-ttfb
title: Function region misconfiguration (TTFB)
status: active
candidateKinds: ["region_misconfig"]
frameworks: ["*"]
scannerPatterns: ["region-pin-in-config"]
priority: 85
citations: ["https://vercel.com/docs/functions/configuring-functions/region", "https://vercel.com/docs/regions"]
maxBriefChars: 950
---

## Investigation Brief
A single function region is pinned. Per-region TTFB data is unavailable today (`evidence.dataGap`); treat as an audit prompt — validate the pinned region against user geo and data-source location before recommending changes.

## Evidence To Check
Scanner subtype (`vercel-json-single`, `segment-preferred`) and pinned regions. Cross-check Speed Insights TTFB and country analytics for traffic geo. Locate the data source — proximity to it often wins on cache-miss paths.

## Do Not Recommend When
Skip if TTFB is healthy across countries. Skip if pinned intentionally for data proximity. Skip on small projects (<20 routes). Do not propose multi-region without confirming the data layer is reachable without cross-region egress.

## Verification
Name pinned region(s), traffic geo, data-source location, and a specific call: relocate, expand, or keep with a TTFB monitor.


## REF: references/support-topics/image-optimization-cost-control.md

---
id: image-optimization-cost-control
title: Image optimization cost control
status: active
candidateKinds: ["image_optimization"]
frameworks: ["*"]
priority: 90
citations: ["https://vercel.com/docs/image-optimization", "https://vercel.com/docs/image-optimization/managing-image-optimization-costs", "https://vercel.com/docs/image-optimization/limits-and-pricing"]
maxBriefChars: 850
---

## Investigation Brief
Image recommendations should distinguish real user-facing image work from wasteful transformations.

## Evidence To Check
Inspect the sampled files for raw image tags, dimensions, remote sources, repeated transforms, source image limits, icons, SVGs, GIFs, and existing framework image components.

## Do Not Recommend When
Do not route tiny icons, SVG UI assets, or animated GIFs through image optimization just because they are images. Do not change remote-source policy without checking the existing config.

## Verification
Name the image files or components, current rendering path, and the metric or scanner evidence that makes optimization material.


## REF: references/support-topics/isr-revalidation-static-generation.md

---
id: isr-revalidation-static-generation
title: ISR revalidation and static generation
status: active
candidateKinds: ["isr_overrevalidation"]
frameworks: ["next@>=13.4.0"]
priority: 95
citations: ["https://vercel.com/docs/incremental-static-regeneration", "https://nextjs.org/docs/app/api-reference/functions/revalidateTag", "https://nextjs.org/docs/app/api-reference/functions/revalidatePath"]
maxBriefChars: 1000
---

## Investigation Brief
For ISR over-revalidation, the goal is to reduce unnecessary regeneration work without making content stale beyond the product’s tolerance.

## Evidence To Check
Compare ISR writes to reads, then inspect the route’s `revalidate`, `cacheLife()`, tag invalidation, and content update path. Look for very short timer revalidation on routes where updates are event-driven. If recommending `cacheLife()` or `cacheTag()` for tagged content, prove the exact tags are invalidated by `revalidateTag()` or `updateTag()`; near-matches do not count.

## Do Not Recommend When
Do not lengthen revalidation for inventory, pricing, auth, or other user-critical freshness without source evidence that stale content is acceptable. Do not claim existing CMS or webhook invalidation unless the matching invalidation call or config is in the allowed files.

## Verification
Tie the fix to the observed ISR writes per read and the line that controls revalidation or on-demand invalidation.


## REF: references/support-topics/middleware-proxy-edge-cost.md

---
id: middleware-proxy-edge-cost
title: Middleware edge cost
status: active
candidateKinds: ["middleware_heavy"]
frameworks: ["next@>=12.0.0"]
priority: 90
citations: ["https://nextjs.org/docs/app/building-your-application/routing/middleware", "https://vercel.com/docs/routing-middleware"]
maxBriefChars: 850
---

## Investigation Brief
Middleware recommendations should reduce unnecessary interception, not remove required request handling.

## Evidence To Check
Use `topMiddlewarePaths` and the matcher config. Confirm which paths need auth, rewrites, headers, or locale handling. Check whether static assets, images, or routes with no middleware need are being matched.

## Do Not Recommend When
Do not narrow the matcher in a way that bypasses required auth or routing behavior. Do not move middleware work into every route if the current matcher is already scoped.

## Verification
State the current middleware share, the dominant matched paths, and the exact matcher line to change.


## REF: references/support-topics/next-fetch-revalidate-floor.md

---
id: next-fetch-revalidate-floor
title: Next.js fetch revalidation floor
status: active
candidateKinds: ["uncached_route", "isr_overrevalidation"]
frameworks: ["next@>=13.0.0"]
priority: 88
citations: ["https://nextjs.org/docs/app/api-reference/functions/fetch", "https://nextjs.org/docs/app/building-your-application/caching"]
maxBriefChars: 850
---

## Investigation Brief
Next.js `fetch` options can set the route's effective cache floor. Low `revalidate`, `revalidate: 0`, or `cache: 'no-store'` can explain uncached traffic and excessive ISR work.

## Evidence To Check
Inspect route-tree `fetch` calls. Compare route revalidation with per-fetch `cache`, `next.revalidate`, tags, dynamic APIs, and duplicated URLs with conflicting options.

## Do Not Recommend When
Do not raise freshness windows for pricing, inventory, auth, draft, or user-specific data unless the source proves stale reads are acceptable.

## Verification
Name the observed cache or ISR signal, the lowest cache setting that controls the route, and the exact fetch line to change.


## REF: references/support-topics/next-font-cls-self-hosting.md

---
id: next-font-cls-self-hosting
title: Next.js font CLS guardrail
status: active
candidateKinds: ["cwv_poor"]
frameworks: ["next@>=13.2.0"]
metrics: ["CLS"]
priority: 86
citations: ["https://nextjs.org/docs/app/api-reference/components/font", "https://web.dev/articles/optimize-cls"]
maxBriefChars: 800
---

## Investigation Brief
For poor CLS, check fonts only when the route actually loads external font CSS or swaps text after render.

## Evidence To Check
Inspect layouts and global styles for external font links, CSS imports, custom font-face rules, late-loading font classes, and whether `next/font` is already used.

## Do Not Recommend When
Do not migrate fonts when CLS is caused by images, ads, embeds, or injected UI. Do not suggest `next/font` for unsupported Next.js versions.

## Verification
Name the CLS value, font-loading mechanism, and the exact layout or stylesheet line to change.


## REF: references/support-topics/next-heavy-ui-lazy-load-boundaries.md

---
id: next-heavy-ui-lazy-load-boundaries
title: Next.js heavy UI lazy-load boundaries
status: active
candidateKinds: ["cwv_poor"]
frameworks: ["next@*"]
metrics: ["LCP", "INP"]
priority: 82
citations: ["https://nextjs.org/docs/app/guides/lazy-loading", "https://web.dev/articles/optimize-inp"]
maxBriefChars: 850
---

## Investigation Brief
Heavy above-the-fold or rarely used UI can hurt LCP and INP when it ships too much JavaScript on first load. Look for concrete route-local UI, not generic bundle advice.

## Evidence To Check
Inspect client components, menus, search overlays, personalization widgets, maps, editors, and large imported libraries. Check whether they can load on interaction, viewport, or route entry with `next/dynamic` or dynamic import.

## Do Not Recommend When
Do not lazy-load essential above-the-fold content needed for initial meaning or accessibility. Do not use `ssr: false` from a Server Component.

## Verification
Name the poor metric, heavy UI boundary, imported library or component, and exact line to split.


## REF: references/support-topics/next-image-lcp-preload-sizes.md

---
id: next-image-lcp-preload-sizes
title: Next.js image LCP preload and sizes
status: active
candidateKinds: ["cwv_poor"]
frameworks: ["next@*"]
metrics: ["LCP"]
priority: 86
citations: ["https://nextjs.org/docs/app/api-reference/components/image", "https://web.dev/articles/optimize-lcp"]
maxBriefChars: 850
---

## Investigation Brief
For poor LCP, identify whether the LCP element is an image before touching unrelated JavaScript. Hero images need correct sizing, priority behavior, and source-cache hygiene.

## Evidence To Check
Inspect above-the-fold media for `next/image`, `fill` without `sizes`, deprecated `priority` on Next.js 16, missing `preload` or `fetchPriority`, oversized dimensions, and remote-image TTL/source behavior.

## Do Not Recommend When
Do not preload multiple possible LCP images or route tiny icons/SVG UI assets through image optimization. Do not change quality or TTL without checking source-update semantics.

## Verification
Name the LCP value, image element or component, current props/config, and the exact line to change.


## REF: references/support-topics/next-route-handler-get-cache-defaults.md

---
id: next-route-handler-get-cache-defaults
title: Next.js Route Handler GET cache defaults
status: active
candidateKinds: ["uncached_route", "cache_header_gap"]
frameworks: ["next@>=15.0.0"]
priority: 91
citations: ["https://nextjs.org/docs/app/api-reference/file-conventions/route", "https://vercel.com/docs/caching/cdn-cache"]
maxBriefChars: 850
---

## Investigation Brief
On Next.js 15+, GET Route Handlers are dynamic by default. For hot public GET handlers, verify whether uncached behavior is intentional before recommending cache headers or route config.

## Evidence To Check
Use method share, cache result, and source. Check `GET`, `revalidate`, `dynamic`, request headers, cookies, auth, query params, and response `Cache-Control`.

## Do Not Recommend When
Do not cache POST-style handlers, webhooks, per-user APIs, streaming responses, search requests with user-specific params, or handlers that read auth/cookies.

## Verification
Name the Next.js version, GET share, cache result mix, and the exact handler or header line that makes public caching safe.


## REF: references/support-topics/next-script-third-party-strategy.md

---
id: next-script-third-party-strategy
title: Next.js third-party script strategy
status: active
candidateKinds: ["cwv_poor"]
frameworks: ["next@*"]
metrics: ["LCP", "INP"]
priority: 85
citations: ["https://nextjs.org/docs/app/api-reference/components/script", "https://web.dev/articles/optimize-inp"]
maxBriefChars: 850
---

## Investigation Brief
Third-party scripts are only actionable when they line up with the poor metric and route. For LCP or INP, prove a specific script blocks critical rendering, hydration, or interaction.

## Evidence To Check
Inspect `next/script`, raw `<script>`, tag managers, chat widgets, analytics, and consent code. Check `beforeInteractive`, `afterInteractive`, `lazyOnload`, and whether the script is route-local or global.

## Do Not Recommend When
Do not move required bot detection, consent, auth, or payment scripts later without product evidence. Do not recommend `worker` for App Router.

## Verification
Name the poor metric, script source, current strategy, and the exact route or layout line to change.


## REF: references/support-topics/nextjs-version-cache-semantics.md

---
id: nextjs-version-cache-semantics
title: Next.js cache semantics by version
status: active
candidateKinds: ["uncached_route"]
frameworks: ["next@>=15.0.0"]
priority: 85
citations: ["https://nextjs.org/docs/app/api-reference/directives/use-cache", "https://nextjs.org/docs/app/api-reference/functions/cacheLife", "https://nextjs.org/docs/app/building-your-application/caching"]
maxBriefChars: 800
---

## Investigation Brief
On Next.js 15+, match the fix to the cache primitive already in use.

## Evidence To Check
Check `'use cache'`, `cacheLife`, `cacheTag`, `fetch` cache options, route handlers, and dynamic APIs.

## Do Not Recommend When
Do not suggest APIs outside the detected Next.js version. Do not claim `cacheLife()` emits CDN `Cache-Control` headers or that missing `cacheLife()` alone makes a `'use cache'` route run per request. Omitted `cacheLife()` calls use the default profile.

## Verification
Name the detected Next.js version and exact cache primitive or route header.


## REF: references/support-topics/not-found-catchall-request-waste.md

---
id: not-found-catchall-request-waste
title: Not-found and catch-all request waste
status: active
candidateKinds: ["uncached_route"]
frameworks: ["*"]
routePatterns: ["(^|/)404$", "not-found", "\\[\\.\\.\\."]
priority: 92
citations: ["https://vercel.com/docs/routing/", "https://vercel.com/docs/redirects/bulk-redirects/", "https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules", "https://vercel.com/docs/vercel-firewall/vercel-waf/managed-rulesets"]
maxBriefChars: 850
---

## Investigation Brief
High-volume 404 or catch-all traffic is often request waste. First determine whether the traffic is legacy URLs, bots, broken links, or a real product route.

## Evidence To Check
Use route volume, method share, cache result, bot share, and top request paths. Inspect redirects, rewrites, catch-all routes, sitemap/robots output, and any WAF rules already logging or blocking the pattern.

## Do Not Recommend When
Do not block or redirect legitimate product routes, search crawlers, or unknown traffic without a log-mode validation path. Do not replace a useful 404 page with a blanket rewrite.

## Verification
Name the dominant bad path pattern, observed request or bot volume, and the redirect, routing, or WAF rule that would stop the wasted function path.


## REF: references/support-topics/nuxt-route-rules-cache-isr.md

---
id: nuxt-route-rules-cache-isr
title: Nuxt routeRules cache and ISR
status: active
candidateKinds: ["uncached_route", "isr_overrevalidation", "rendering_candidate"]
frameworks: ["nuxt@>=3.0.0"]
priority: 90
citations: ["https://vercel.com/docs/frameworks/full-stack/nuxt", "https://nuxt.com/docs/4.x/api/utils/define-route-rules", "https://nuxt.com/docs/4.x/guide/concepts/rendering"]
maxBriefChars: 850
---

## Investigation Brief
For Nuxt on Vercel, route-level caching usually belongs in `routeRules`. Match the lever to the route: prerender for static pages, ISR for shared content, and SSR for request-specific views.

## Evidence To Check
Inspect `nuxt.config`, inline route rules, server routes, pages, auth/session reads, and observed cache or ISR read/write patterns. Verify whether the route should be Vercel cache-backed ISR rather than generic SWR.

## Do Not Recommend When
Do not cache authenticated, cart, checkout, preview, or per-user routes. Do not add routeRules without proving the route is public and the freshness window is acceptable.

## Verification
Name the observed route signal, current routeRule or missing rule, chosen cache mode, and exact config line.


## REF: references/support-topics/observability-events-cost-attribution.md

---
id: observability-events-cost-attribution
title: Observability Events cost attribution
status: active
candidateKinds: ["observability_events_attribution"]
frameworks: ["*"]
priority: 92
citations: ["https://vercel.com/docs/observability/observability-plus", "https://vercel.com/docs/alerts"]
maxBriefChars: 900
---

## Investigation Brief
Observability Events is the metered SKU under Observability Plus. When the current bill shows a large Observability Events share, event volume is the lever. Reduce upstream: lift cache hit rate, narrow middleware matchers, and reduce unnecessary custom-span cardinality.

## Evidence To Check
Verify the share from `usage.services`. Cross-reference `requestsByRouteCache`, `middlewareCount`, external API span counts, and third-party tracing (`tracesSampleRate=1`).

## Do Not Recommend When
Skip below 15% share. Skip when cache hit rate is already >90% across hot routes — the lever is elsewhere. Do not propose sampling unless the specific metered signal has a documented sampling control.

## Verification
Name the share, upstream drivers, and concrete remediation per driver, not generic "reduce events".


## REF: references/support-topics/post-response-work-waituntil.md

---
id: post-response-work-waituntil
title: Post-response work with waitUntil
status: active
candidateKinds: ["slow_route", "external_api_slow"]
frameworks: ["next@<15.0.0", "sveltekit@*", "astro@*", "nuxt@*", "unknown@*"]
priority: 78
citations: ["https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package"]
maxBriefChars: 800
---

## Investigation Brief
For stacks without Next.js `after()`, check whether non-critical work can run after the response instead of extending user-visible latency.

## Evidence To Check
Inspect the listed route for analytics, logging, notifications, cache warming, metrics, or webhook side effects that happen after the response data is ready.

## Do Not Recommend When
Do not move work that decides the response, must fail the request, changes visible state synchronously, or needs a durable retry guarantee.

## Verification
Name the blocking side effect, the observed latency or upstream signal, and the exact line that can move behind `waitUntil`.


## REF: references/support-topics/route-error-durable-offload.md

---
id: route-error-durable-offload
title: Durable offload for timeout-heavy routes
status: active
candidateKinds: ["route_errors"]
frameworks: ["*"]
priority: 84
citations: ["https://vercel.com/docs/workflow", "https://workflow-sdk.dev/docs/foundations/starting-workflows", "https://workflow-sdk.dev/docs/foundations/workflows-and-steps", "https://vercel.com/docs/queues", "https://vercel.com/docs/functions/limitations"]
maxBriefChars: 850
---

## Investigation Brief
Timeout-heavy routes often need a job boundary, not a higher limit. Workflow fits durable multi-step work that can continue after the response; return a run ID instead of waiting on `returnValue`.

## Evidence To Check
Use `errorStatusPattern`, `errorCodes`, and source flow. Look for fan-out, polling, batch work, AI jobs, uploads, sleeps, approval, multi-step side effects. If Workflow is already used, check whether the route waits or streams progress.

## Do Not Recommend When
Do not offload work that must finish before responding. Do not claim savings from offload alone: Workflow Steps/Storage bill separately, and invoked functions still use compute billing.

## Verification
Name the timeout/error class, long-running operation, post-enqueue response contract, and queue or workflow boundary that preserves semantics.


## REF: references/support-topics/route-error-runtime-limits.md

---
id: route-error-runtime-limits
title: Route errors and runtime limits
status: active
candidateKinds: ["route_errors"]
frameworks: ["*"]
priority: 90
citations: ["https://vercel.com/docs/functions", "https://vercel.com/docs/functions/limitations", "https://vercel.com/docs/cli/inspect"]
maxBriefChars: 850
---

## Investigation Brief
Route error candidates are reliability findings with cost impact. Determine whether the failures are app exceptions, timeouts, payload limits, or deployment-specific regressions.

## Evidence To Check
Use `errorStatusPattern`, `errorCodes`, and `errorsByDeployment`. In source, inspect the path most likely to throw, time out, or exceed a platform limit.

## Do Not Recommend When
Do not frame high 5xx volume as a performance tuning issue. Do not suggest increasing limits before proving the route needs more headroom.

## Verification
Name the error class, deployment concentration if present, and the file line that triggers or fails to handle it.


## REF: references/support-topics/runtime-cache-reusable-data.md

---
id: runtime-cache-reusable-data
title: Runtime Cache for reusable server data
status: active
candidateKinds: ["slow_route", "external_api_slow"]
frameworks: ["*"]
priority: 84
citations: ["https://vercel.com/docs/caching/runtime-cache", "https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package"]
maxBriefChars: 850
---

## Investigation Brief
Runtime Cache is only useful when the same server-side result is reused across requests. Treat it as a measured alternative when CDN response caching is unsafe or incomplete.

## Evidence To Check
Use p75/p95 latency, call count, caller routes, and transfer bytes. In source, identify database queries, external API calls, or expensive computations that return the same result for many viewers.

## Do Not Recommend When
Skip per-user data, mutations, secrets, one-off requests, or unknown freshness. Skip Runtime Cache when CDN caching solves the route. For Next with Cache Components, check `use cache: remote` first; use Runtime Cache only as a justified fallback.

## Verification
Name the reusable data, observed route or hostname pressure, required freshness window, and the exact call site to wrap.


## REF: references/support-topics/sveltekit-isr-prerender-safety.md

---
id: sveltekit-isr-prerender-safety
title: SvelteKit ISR and prerender safety
status: active
candidateKinds: ["uncached_route", "isr_overrevalidation"]
frameworks: ["sveltekit@*"]
priority: 90
citations: ["https://vercel.com/docs/frameworks/full-stack/sveltekit", "https://svelte.dev/docs/kit/adapter-vercel", "https://svelte.dev/docs/kit/page-options"]
maxBriefChars: 850
---

## Investigation Brief
For SvelteKit, the right lever is often `prerender` or adapter ISR on public consumer pages. First prove every visitor can safely see the same response for the configured interval.

## Evidence To Check
Inspect `+page`, `+page.server`, `+server`, layouts, `prerender`, `ssr`, and adapter `isr` config. Compare route cache results, ISR writes, and whether the route reads cookies, auth, or per-user locals.

## Do Not Recommend When
Do not use ISR for dashboards, carts, checkout, account data, drafts, or any route whose output varies per visitor. Do not add ISR when `prerender = true` already makes it irrelevant.

## Verification
Name the route, current SvelteKit page option or adapter config, observed cache or ISR signal, and the exact file line to change.


## REF: references/support-topics/sveltekit-split-cold-start-tradeoff.md

---
id: sveltekit-split-cold-start-tradeoff
title: SvelteKit split function cold-start tradeoff
status: active
candidateKinds: ["cold_start", "slow_route"]
frameworks: ["sveltekit@*"]
priority: 82
citations: ["https://vercel.com/docs/frameworks/full-stack/sveltekit", "https://svelte.dev/docs/kit/adapter-vercel"]
maxBriefChars: 800
---

## Investigation Brief
SvelteKit bundles routes together by default to avoid excessive cold starts. Treat `split: true` as a targeted tradeoff, not a blanket optimization.

## Evidence To Check
Use cold-start share, cold-vs-warm latency, deployment concentration, and source bundle pressure. Check adapter options and whether a large dependency belongs to one route or the whole app.

## Do Not Recommend When
Do not split every route without evidence of function size pressure or route-local initialization cost. Do not split if cold starts are already the dominant problem.

## Verification
Name the cold-start signal, route or dependency that motivates the split, and the exact adapter config line.


## REF: references/support-topics/usage-spike-triage.md

---
id: usage-spike-triage
title: Usage spike triage
status: active
candidateKinds: ["usage_spike_triage"]
frameworks: ["*"]
priority: 95
citations: ["https://vercel.com/docs/alerts", "https://vercel.com/docs/spend-management", "https://vercel.com/docs/bot-management"]
maxBriefChars: 950
---

## Investigation Brief
A single-day or single-SKU spike needs cause before fix. Branches: bot or AI crawler on a cacheable route, viral moment, pricing-model migration, or code regression.

## Evidence To Check
Confirm SKU and day from `usage.breakdown.data`. Cross-check firewall/bot data, traffic curve, SKU rename timing, and deploy log around the spike day. Spend Management and Alerts are monitoring tools; they do not replace finding the traffic or deploy cause.

## Do Not Recommend When
Do not propose a code fix until the branch is identified. Do not rate-limit a viral moment or revert a deploy for third-party crawler traffic.

## Verification
Name SKU, day, value, window mean, branch, and one supporting datum.


## REF: references/support-topics/use-cache-date-stamp-isr-write-amplifier.md

---
id: use-cache-date-stamp-isr-write-amplifier
title: "'use cache' date-stamp ISR write amplifier"
status: active
candidateKinds: ["use_cache_date_stamp"]
frameworks: ["next@>=15.0.0"]
scannerPatterns: ["use-cache-date-stamp"]
priority: 88
citations: ["https://nextjs.org/docs/app/api-reference/directives/use-cache", "https://nextjs.org/docs/app/api-reference/functions/cacheLife"]
maxBriefChars: 900
---

## Investigation Brief
`'use cache'` keys on argument identity and prerender output. A `new Date()`, `Date.now()`, or `Math.random()` baked into the cached output forces a fresh ISR write on every regeneration even when the data is unchanged.

## Evidence To Check
Check the scanner finding's `subtype`: `module-scope` (module-level date) or `in-cache-fn` (inside the cached body). Cross-reference `isrWritesByRoute` — a stable write rate against low reads is the symptom.

## Do Not Recommend When
Skip if the date is inside `useEffect`/`useCallback`/`useMemo`. Skip if `'use cache'` is only a comment. Skip if the date is the intended cache key.

## Verification
Name the file, the specific primitive call, and the replacement: build-time constant or client-side `useEffect`.


## REF: references/support-topics/use-cache-remote-shared-origin-data.md

---
id: use-cache-remote-shared-origin-data
title: Remote cache for shared origin data
status: active
candidateKinds: ["external_api_slow", "slow_route", "uncached_route"]
frameworks: ["next@>=16.0.0"]
priority: 87
citations: ["https://vercel.com/docs/caching/runtime-cache", "https://nextjs.org/docs/app/api-reference/directives/use-cache-remote"]
maxBriefChars: 950
---

## Investigation Brief
For Next 16 candidates, check whether shared origin data or reusable route-handler work belongs in remote cache. Default `'use cache'` is not cross-request on Vercel. Use `'use cache: remote'` or `generateStaticParams`.

## Evidence To Check
Hostname p75, caller routes, call count, bytes. Verify data is shared and tolerates the freshness window. Confirm `'use cache: remote'`.

## Do Not Recommend When
Skip per-user, mutation, secret, or freshness-critical data. Skip when upstream is fast or rarely called. Avoid sub-ms reads (Edge Config) — overhead exceeds source latency.

## Verification
Name hostname, shared data, freshness window, and exact boundary. State `'use cache: remote'`.


## REF: references/support-topics/workflow-resumable-stream-routes.md

---
id: workflow-resumable-stream-routes
title: Workflow resumable stream routes
status: active
candidateKinds: ["slow_route"]
frameworks: ["*"]
routePatterns: ["(^|/)api/.*/stream/?$", "(^|/)chat/.*/stream/?$", "\\[id\\].*/stream"]
priority: 98
citations: ["https://workflow-sdk.dev/docs/ai/resumable-streams", "https://workflow-sdk.dev/docs/foundations/streaming", "https://vercel.com/docs/workflow"]
maxBriefChars: 850
---

## Investigation Brief
Stream-shaped routes may be Workflow SDK reconnection endpoints. Long wall-clock duration can be the live client connection.

## Evidence To Check
Look for `WorkflowChatTransport`, `getRun`, `run.getReadable`, `startIndex`, `x-workflow-run-id`, `x-workflow-stream-tail-index`, `getWritable`, or `createUIMessageStreamResponse`. Compare CPU, TTFB, wall-clock. Check full replay, missing tail-index, unreleased locks, or unclosed streams.

## Do Not Recommend When
Do not cache stream endpoints or remove resumability. Do not call high duration a bug when CPU is low, TTFB is healthy, and the route only holds a client connection.

## Verification
Name whether the route starts or reconnects a run, then cite the exact waste: replay, missing tail-index, lock leak, unclosed stream, high CPU, or avoidable pre-first-byte work.


## REF: references/verification.md

# Verification

How claims in recommendations are mechanically verified, and when the recommender re-runs after a low pass rate.

## Table of contents

- [Why mechanical verification](#why-mechanical-verification)
- [Claim types](#claim-types)
- [Dispositions](#dispositions)
- [Re-gen trigger and accept criteria](#re-gen-trigger-and-accept-criteria)
- [Verifier implementation](#verifier-implementation)

## Why mechanical verification

The recommender is an LLM. LLMs hallucinate counts, miscount file occurrences, and confuse code snippets between similar-looking files. Mechanical verification — grep + filesystem reads + JSON checks against `signals.json` and `references/docs-library.json` — catches these failures before the customer sees them.

The contract: every numeric claim, file reference, code snippet, citation URL, and contradiction-with-other-claims is verified. The LLM is not asked to judge whether its own output is correct.

## Claim types

The verifier extracts claims from `why`, `fix`, `currentBehavior`, `desiredBehavior`, and `verify` fields. Each matched claim runs through one of these handlers:

| # | Claim type | Pattern in rec | Verification |
|---|---|---|---|
| 1 | `pattern_count` | "N fetch() calls in file X" | grep/ast-grep in X, exact count match |
| 2 | `pattern_exists` | "uses JSON.parse(JSON.stringify())" | grep, boolean |
| 3 | `pattern_absent` | "no Cache-Control header" | grep, verify absence (with guards — see below) |
| 4 | `file_exists` | "app/not-found.tsx exists" | fs.access |
| 5 | `finding_count` | "2 unoptimized images" | finding count vs `verifiedFindings.json` |
| 6 | `contradiction` | Claim A vs Claim B | Substring conflict check |
| 7 | `code_snippet` | Code fence labeled "Before:" | substring search in cited file |
| 8 | `arithmetic` | "20% of 100K = 20K" | math check |
| 9 | `repo_count` | "11 unstable_cache usages across 8 files" | grep repo, count distinct files |
| 10 | `cited_count_literal` | "60+ icons in packages/ui/src/icons" | glob directory, count by extension |
| 11 | `citation_in_library` | Any URL in `citations[]` | URL ∈ `references/docs-library.json` |
| 12 | `citation_applies_to_version` | Any URL in `citations[]` | URL's `applicableFrameworks` matches `signals.json.stack.framework@frameworkVersion` |
| 13 | `cache_vary_matches_dynamic_inputs` | CDN cache rec touches route files that read Vercel geolocation | Fails unless the rec varies by a coarse Vercel geolocation header such as `X-Vercel-IP-Country`, `X-Vercel-IP-Country-Region`, or `X-Vercel-IP-City` |
| 13a | `cache_vary_cardinality_safe` | CDN cache rec sets `Vary` on request-specific geography | Fails on high-cardinality `X-Vercel-IP-Latitude` / `X-Vercel-IP-Longitude` / `X-Vercel-IP-Postal-Code` |
| 14 | `next_cached_not_found_causal_support` | Rec claims `notFound()` inside `'use cache'` caused 5xx | Fails unless backed by Next-specific docs or runtime stack evidence |
| 15 | `next_stable_cache_api_for_version` | Next.js 16 cache rec includes code examples | Fails on `unstable_cacheLife` / `unstable_cacheTag` or one-arg `revalidateTag()` |
| 16 | `next_cache_components_runtime_cache_preference` | Next.js rec uses Runtime Cache APIs while `cacheComponents=true` | Fails unless `use cache: remote` is used or Runtime Cache is framed as a fallback |
| 17 | `next_cache_components_route_segment_config` | Next.js 16 rec suggests removed route segment config while `cacheComponents=true` | Fails on `dynamicParams`, `dynamic`, `revalidate`, or `fetchCache` recommendations |
| 17a | `next_route_revalidate_static_prereq` | Rec suggests route-level `export const revalidate` for a Next.js page/layout route | Fails when the route chain contains request-time APIs or common auth helpers that can force dynamic rendering |
| 18 | `next_cache_lifetime_freshness_supported` | Rec lengthens a tagged Cache Components lifetime with `cacheLife()` | Fails unless every affected `cacheTag()` has matching `revalidateTag()` / `updateTag()` evidence |
| 19 | `next_cache_life_cdn_header_semantics` | Rec claims `cacheLife()` emits CDN/Cache-Control headers or that missing `cacheLife()` alone makes a route run per request | Fails unless rewritten to the documented Cache Components lifetime behavior or backed by production header evidence |
| 20 | `next_cache_tag_invalidation_supported` | Cache-lifetime rec claims existing tag invalidation | Fails unless every claimed `cacheTag()` has matching `revalidateTag()` / `updateTag()` evidence |
| 21 | `cache_rec_not_error_dominated_or_acknowledged` | CDN cache rec targets a route with function 5xx metrics | Fails unless the rec excludes or acknowledges error traffic |
| 22 | `cache_control_header_syntax` | CDN cache rec includes `Cache-Control`, `CDN-Cache-Control`, or `Vercel-CDN-Cache-Control` values | Fails on empty directives such as a trailing comma |
| 23 | `cache_policy_positive_or_no_ready_rec` | Cache candidate emits a ready recommendation | Fails unless it names a positive cache policy; no-store-only belongs in no-change/observation output |
| 24 | `cache_404_long_ttl_safety` | CDN cache rec mentions a 404 or not-found branch | Fails unless the rec keeps the 404/not-found branch uncached, short-lived, or explicitly separate |
| 25 | `immutable_dynamic_route_safety` | Dynamic route rec uses browser `immutable` caching | Fails unless the URL is byte-versioned or the directive is scoped to Vercel's CDN |
| 26 | `auth_guard_parallelization_safety` | Parallelization rec touches private/auth/ownership data | Fails if private data can be fetched before the auth or ownership guard |
| 27 | `parallelization_impact_not_overclaimed` | Parallelization rec promises a helper-sized latency drop | Fails unless helper/span timing was measured |
| 28 | `parallelization_not_cpu_bound_work` | Parallelization rec targets CPU or compile work | Fails unless measured wait/I/O time proves there is independent work to overlap |
| 29 | `runtime_error_cause_supported` | Route-error rec names a runtime exception/root cause | Fails unless runtime logs or stack evidence support the cause |
| 30 | `turbo_build_cache_safety` | Rec enables Turbo build caching | Fails when the package build script has migration side effects or Turbo outputs omit framework build output |

Verifier guards:

- **`snippet_in_wrong_file`**: code snippet found, but in a different file from the cited path → disposition `unsupported` (don't fail the rec; the LLM was close, but the source file claim is wrong).
- **`line-number-as-count`**: "filename:42" matched against a `pattern_count` claim → skip; this is a line-number, not a count.
- **`prose-of-absence`**: "no cache headers" without an explicit grep confirmation → `unsupported`; absence claims require evidence.
- **`pattern_count` for abstracted DB calls**: `db.method()` in a file with DB imports + await helpers but literal count 0 → `unsupported` (import-chain resolution is out of scope).

## Dispositions

Each verified claim resolves to one of four states:

| Disposition | Meaning | Counted toward `passRate`? |
|---|---|---|
| `verified` | Claim matches reality | yes (counts as pass) |
| `failed` | Claim contradicts reality | yes (counts as fail) |
| `unsupported` | Claim can't be checked mechanically (see guards above) | no |
| `unverifiable` | Out of scope (e.g., external API behavior, runtime-only) | no |

`passRate = verified / (verified + failed)`. Unsupported and unverifiable don't count either way.

## Re-gen trigger and accept criteria

After verification:

| Condition | Action |
|---|---|
| `passRate < 0.8 AND verifiableClaimCount >= 2` | Re-run Step 3.3 (the recommender) with `topFailures` injected as feedback |
| Project-config contradiction, cache-safety failure, or framework-semantic failure | Hard re-run. The customer report holds back the original rec until re-gen fixes it or abstains |
| `passRate >= 0.8` OR `verifiableClaimCount < 2` | Accept the run, proceed to Step 4 |

_(Floor lowered 5 → 2 in May 2026 audit: a rec with 1/1 failed claim is just as broken as 1/5, and the old floor let many small recs escape re-gen entirely.)_

Re-gen accept criteria:

- `regenPassRate >= originalPassRate` AND
- Rec count not gutted (regen doesn't drop more than 50% of recs) AND
- Findings still cited (no rec orphaning)

If re-gen makes things worse, keep the original output unless the trigger was hard safety (`project_config_contradiction`, `cache_vary_safety`, or `semantic_safety`). Hard-safety failures must not ship to the customer report.

## Verifier implementation

`scripts/verify-and-regen.mjs` invokes `lib/extract-claims.mjs` and `lib/verify-claim.mjs` in-process for each verifiable claim. Pure functions, no network, no LLM — deterministic.

For `citation_in_library` and `citation_applies_to_version`, the script uses `lib/citations.mjs`'s `isKnownUrl()` and `sanitizeCitations()` helpers (already tested). For everything else, it shells out to grep + ast-grep via execFile.


## REF: references/voice.md

# Voice

Use Vercel's customer-facing voice: sharp teammate, clear, competent, no fluff.

Write for a user deciding what to fix next. Lead with the observed signal, the specific change, and how to verify it. Do not explain the skill's internals unless the user asked for debug details.

## Rules

- Use plain words. Prefer "use" over "leverage," "reduce" over "optimize" when the action is specific.
- Be direct. No apologetic preambles, no marketing language, no "For context" wrap-up paragraphs.
- Keep every recommendation tied to a route, file, metric, or project setting.
- Use observed numbers only. Never invent savings, traffic, latency, or percentages.
- Use cost magnitude language, not precise savings: "hundreds of dollars per month at current traffic," not "$340/mo."
- Use precise performance language when measured: "95th percentile duration is 1,240ms."
- Frame prerequisites as engineering constraints, not upsells. Explain the decision impact: what the missing data prevents, what the limited fallback can still do, and what the user should choose next.
- Use short bullets and tables. Avoid long paragraphs in reports and final chat messages.
- Write full sentences with punctuation in reports.

## Avoid

- `seamlessly`, `effortlessly`, `powerful`, `robust`, `leverage`, `unleash`, `blazing`, `lightning-fast`, `turnkey`, `holistic`, `best-in-class`, `next-generation`, `cutting-edge`, `world-class`, `streamline`, `elevate`, `harness`, `crafted`, `myriad`, `plethora`, `empower`, `utilize`
- Filler adverbs: `just`, `simply`, `actually`
- Hedge starts: `Consider`, `You may want to`, `It is important to note`
- Rhetorical reframes: `It's not X, it's Y`
- Unicode arrows in prose: `->`, `→`, `⇒`
- Internal process terms in customer output: `sub-agent`, `abstention`, `abstained`, `passRate`, `quality score`, `sanitizer`

Use customer-facing replacements:

| Internal | Customer-facing |
|---|---|
| `sub-agent` | `investigation` |
| `abstained` | `found no supported change` |
| `abstention` | `investigated, no change recommended` |
| `passRate` | `verification result` |
| `quality score` | `review result` |
| `inv` | `function invocations` or `requests`, based on the metric |
| `p95` | `95th percentile` |
| `perf` | `performance` |
| `CWV` | `Core Web Vitals` |

## Product names

Use these spellings:

| Right | Wrong |
|---|---|
| `Observability Plus` | `OPlus`, `Oplus`, `O11y Plus`, `o11y+`, `obs+` |
| `Vercel Functions` | `serverless functions` when referring to Vercel's product |
| `fluid compute` mid-sentence | `Fluid Compute` mid-sentence |
| `BotID` | `Bot ID`, `botID` |
| `AI Gateway` | `Vercel AI Gateway`, `ai gateway` |
| `AI SDK` | `Vercel AI SDK` |
| `Edge Config` | `EdgeConfig` |
| `Routing Middleware` | `Edge Middleware` |
| `Web Analytics` | `Vercel Analytics` |
| `Hobby`, `Pro`, `Enterprise` | `hobby`, `pro`, `enterprise` as plan names |

Mirror billing names from the user's dashboard. If a dashboard still says `Edge Requests`, use `Edge Requests`; do not rename it.

## Recommendation shape

| Field | Pattern |
|---|---|
| `what` | Verb + change + scope. Example: `Add shared caching to /api/products`. |
| `why` | State the metric and code evidence. Example: `The route handled 1,200,000 requests with a 0% cache hit rate; src/app/api/products/route.ts returns no Cache-Control header.` |
| `fix` | Numbered steps. Start each step with a verb. |
| `verify` | Tell the user exactly which metric or command to re-check. |

Good:

> Add `Cache-Control: s-maxage=300, stale-while-revalidate=86400` to `/api/products`. The route handled 1,200,000 GET requests with a 0% cache hit rate.

Bad:

> Consider leveraging a robust caching strategy to unlock better performance.
