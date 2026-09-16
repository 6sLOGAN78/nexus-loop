# Skill: bencium-aeo

**Category:** marketing

**Cursor invoke:** `/bencium-aeo`

---


## SKILL: SKILL.md

# AEO Content Optimization Skill

**Answer Engine Optimization** - Optimize content for AI citations, not traditional search rankings.

## When to Use This Skill

Use this skill when:
- User asks to optimize content for AI search/citations
- User mentions ChatGPT, Claude, Gemini visibility
- User wants FAQ schema, JSON-LD, or structured data for AI
- User asks about GEO (Generative Engine Optimization)
- User wants to analyze content for AI extraction readiness
- User mentions "AI Overviews" or "answer engines"

**NOT for traditional SEO** - This is specifically for AI/LLM citation optimization.

## Core Reference

**Full templates and guidelines:** Read `prd.md` in this directory for complete implementation details.

## Quick Reference: Key Principles

### The 18-Token Extraction Rule
LLMs extract self-contained sentences of ~18 tokens (~15-20 words). Key claims must be complete, quotable statements requiring zero surrounding context.

**Good:** "Eight-API synthesis reduces property analysis errors by 67%." (9 tokens)
**Bad:** "Our system is incredibly fast and delivers amazing results." (vague)

### Single-Topic Focus Pages
Single-concept pages vastly outperform multi-topic content. Create focused URLs like `domain.com/specific-concept` rather than comprehensive guides.

### Citations + Statistics = 30-40% More Visibility
Every major claim needs:
- Verifiable data with methodology
- Date of data collection
- Expert attribution (Name + Credentials + Org)

### Freshness is Critical
95% of AI citations come from content updated in last 10 months. Static content dies.

### Authority Level Determines Strategy

| Authority Level | Optimization Approach |
|-----------------|----------------------|
| **Challenger** (new sites, low authority) | Aggressive: 5-7 extraction points per page, heavy citations, weekly micro-updates |
| **Established** (top-ranked, well-known) | Light touch: 1-2 strategic points, trust existing credibility, avoid over-optimization |

**Princeton finding:** Rank-5 sites gained 115% visibility with aggressive optimization. Rank-1 sites that over-optimized lost 30%.

## What to Generate

When user requests AEO content, generate:

### 1. Product Overview (50 words)
- What it is (one clause)
- Scope/timeframe context
- Why it matters (value proposition)
- "Last updated" date

### 2. 15 FAQs with Schema
- Questions: 7-12 words, natural language
- Answers: 30-50 words (sweet spot for AI extraction)
- FAQPage JSON-LD schema with `datePublished` and `dateModified`
- Persistent anchor IDs (#faq-slug)

### 3. Evidence Panels
For every important claim:
- Claim statement
- Methodology
- Data source + URL
- Date of data collection
- Limitations
- Contact for questions

### 4. JSON-LD Schema
- FAQPage (most important)
- HowTo (for guides)
- Product (for product pages)
- Organization (for About page)

## Anti-Patterns (What to Avoid)

### Traditional SEO Tactics Harm GEO
- Keyword stuffing
- Generic listicles without original insight
- Vague hedged language ("may help", "could potentially")
- Multi-topic comprehensive guides
- Over-optimization on established sites

### Content Structure Errors
- FAQ answers over 50 words
- Buried answers (put conclusion first)
- Pronoun ambiguity ("it" instead of "the product")
- Missing dates and freshness signals
- No schema markup

## Assessment Framework

When analyzing content for AEO readiness, score (0-10):

| Dimension | What to Check |
|-----------|--------------|
| **Extraction** | How many citation-ready sentences under 18 tokens? |
| **Focus** | Single topic or sprawling multi-topic? |
| **Authority** | Expert attribution with credentials? Citations? |
| **Freshness** | Updated within 90 days? Dated content? |

**Quick test:** Can you copy-paste 3 sentences that fully answer a question without context?

## Implementation Checklist

- [ ] Product overview: 50 words, dated, under H1
- [ ] 15 FAQs: 30-50 words each, natural questions
- [ ] Evidence panels: method, data, date, limitations
- [ ] "Last updated" dates on every section
- [ ] FAQPage JSON-LD schema in `<head>`
- [ ] Persistent anchor IDs for FAQs
- [ ] Validated with Google Rich Results Test

## Testing Protocol

After implementation, test with:

1. **Recognition:** "What is [Product]?" (ChatGPT, Claude, Gemini)
2. **Comparison:** "Compare [Product] to [Competitor]"
3. **Best for:** "What's the best [category] for [use case]?"
4. **How-to:** "How do I [task with product]?"

**Track:** Mentioned? Linked? Accurate? Evidence quoted?

## Full Documentation

For complete templates, examples, and detailed guidelines, read:
- `prd.md` - Full AEO content generation guide with HTML templates
- `story-structured.md` - Framework summary from Princeton study


## REF: CLAUDE.md

# AEO Content Generation Guide

This skill provides guidance for generating Answer Engine Optimization (AEO) content - optimizing websites for AI-powered answer engines (ChatGPT, Claude, Gemini, AI Overviews).

**This is NOT a tool or software project.** This is a content generation workflow for use with Claude Code.

## What This Skill Does

When invoked, Claude should:
1. Analyze target website/content for AEO gaps
2. Generate optimized content using research-backed templates
3. Create complete JSON-LD schema markup
4. Provide copy-paste ready HTML

## Core Philosophy: Machine-First Content

Optimize for **AI agents as primary consumers** (~90%), humans secondary (~10%):
- Make facts **copyable** (JSON snippets, 18-token sentences)
- Make claims **verifiable** (Evidence Panels with methods, dates, sources)
- Make structure **scannable** (short answers, clear hierarchy, anchors)
- Make updates **visible** (dated change logs, freshness signals)

## Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Skill definition and quick reference |
| `prd.md` | **Main guide** - Complete templates, examples, implementation checklist |
| `story-structured.md` | Princeton study insights and strategic framework |

## Content Generation Workflow

### Input Required
- Target URL or page description
- Product/service details (what, why, differentiators)
- Top 15 customer questions
- Evidence/data (benchmarks, research, case studies)

### Output Generated
1. **Product Overview** - 50 words + Product schema
2. **15 FAQs** - 30-50 word answers + FAQPage schema
3. **Evidence Panels** - Claim, methodology, source, date, limitations
4. **JSON-LD Schema** - FAQPage, HowTo, Product, Organization
5. **Implementation Checklist** - Validation steps

## Research-Backed Principles

### The 18-Token Rule
LLMs extract self-contained sentences of ~18 tokens. Structure content with quotable, context-free statements.

### Single-Topic Focus
One concept per page. `domain.com/specific-concept` beats comprehensive guides.

### Authority-Based Strategy
- **Challengers:** Aggressive optimization (5-7 extraction points, heavy citations)
- **Established sites:** Light touch (1-2 points, trust existing credibility)

### Freshness Requirement
95% of AI citations come from content updated in last 10 months. Static content dies.

## Anti-Patterns to Avoid

- Keyword stuffing (actively harms GEO)
- FAQ answers over 50 words
- Missing dates and freshness signals
- No schema markup
- Pronoun ambiguity ("it" vs "the product")
- Over-optimization on established sites

## Validation

After generating content:
1. Validate schema: [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Test with AI engines (ChatGPT, Claude, Gemini)
3. Track citations in scorecard over 4-8 weeks

## Full Documentation

See `prd.md` for complete templates, HTML examples, and detailed implementation guidance.


## REF: README.md

# AISEO - Answer Engine Optimization Content Generator

Generate machine-readable content that earns citations from ChatGPT, Claude, Gemini, and Google AI Overviews.

**Not a tool or app** - this is a guided workflow with templates for use with Claude Code.

---

## What This Repository Does

This repo contains instructions and templates for Claude Code to generate AEO-optimized content for any website. When you start a Claude Code session here, Claude will:

1. Analyze your website for AEO gaps
2. Generate optimized content using research-backed templates
3. Create complete JSON-LD schema markup
4. Provide copy-paste ready HTML

**No coding required.** Just natural language requests to Claude.

---

## Quick Start

### 1. Open Claude Code in this directory
```bash
cd /Users/bencium/AISEO
# Start Claude Code session
```

### 2. Make a request
```
"Generate AEO content for my product at example.com/product"
```

### 3. Receive optimized content
- Product overview (50 words + schema)
- 15 FAQs (30-50 words each + FAQPage schema)
- Evidence blocks with citations
- Complete JSON-LD markup

### 4. Implement on your site
Copy the generated HTML into your website or CMS.

### 5. Validate
- Test schema with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Run manual prompts on ChatGPT, Claude, Gemini

---

## Files in This Repository

| File | Purpose | Audience |
|------|---------|----------|
| `prd.md` | Complete AEO content generation guide with templates | Claude Code |
| `CLAUDE.md` | Project context and development guidelines | Claude Code |
| `README.md` | Usage instructions and workflow | You (human) |

**Key file:** `prd.md` contains all the templates, best practices, and guidelines Claude uses to generate content.

---

## What You'll Get

### 1. Product Overview Block
```
50-word definition with:
- What the product is
- Why it matters
- "Last updated" date
- Product schema markup
```

### 2. 15 FAQ Items
```
Each FAQ includes:
- 7-12 word natural question
- 30-50 word answer (AI sweet spot)
- Persistent anchor link
- FAQPage JSON-LD schema
- "Last updated" date
```

### 3. Evidence Blocks
```
For key claims:
- Claim statement
- Methodology
- Data source + date
- Limitations
- Contact info
```

### 4. JSON-LD Schema
```
Complete working schemas for:
- FAQPage (FAQ sections)
- HowTo (step-by-step guides)
- Product (product pages)
- Organization (about page)
```

### 5. How-To Sections
```
When relevant:
- Numbered steps
- Prerequisites/constraints
- Expected outcomes
- HowTo schema markup
```

---

## How to Use This Repository

### Preparation (Before Starting Claude Session)

Gather this information about your website/product:

1. **Target URL or page description**
   - What page are you optimizing?
   - Current content (if any)

2. **Product/service details**
   - What is it?
   - Why does it matter?
   - Key differentiators

3. **Top customer questions** (aim for 15)
   - Check support tickets
   - Review sales call recordings
   - Look at "People Also Ask" in Google
   - Check competitor FAQs

4. **Evidence/data** (if available)
   - Research findings
   - Benchmarks or performance data
   - Case studies
   - Industry statistics

5. **Competitor information** (optional)
   - 2-3 competitor URLs
   - How they position themselves

### During Claude Code Session

**Simple approach:**
```
"Generate AEO content for [website URL or product description]"
```

**Detailed approach:**
```
"I need AEO-optimized content for [product name].

Product: [brief description]
Target page: [URL]
Top questions: [list 5-10 customer questions]
Data available: [any benchmarks, research, or stats]

Generate:
- Product overview (50 words)
- 15 FAQs with schema
- Evidence blocks for key claims
- All necessary JSON-LD markup"
```

Claude will:
1. Ask clarifying questions if needed
2. Use templates from `prd.md` to generate content
3. Create complete, working HTML/schema
4. Provide implementation guidance

### After Receiving Generated Content

1. **Review the content**
   - Check FAQ answers are 30-50 words
   - Verify evidence blocks have sources + dates
   - Ensure product overview is clear and specific

2. **Implement on your website**
   - Copy HTML to your page
   - Add JSON-LD schema to `<head>` section
   - Ensure anchor links work

3. **Validate**
   - Schema: [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Content: Check FAQ word counts, dates present
   - Links: Test all anchor IDs work

4. **Test with AI engines**
   - ChatGPT: "What is [your product]?"
   - Claude: "Compare [your product] to [competitor]"
   - Gemini: "What's the best [category] for [use case]?"
   - Check if your site is mentioned, linked, cited

5. **Track results**
   - Create simple scorecard (CSV or spreadsheet)
   - Test monthly with same prompts
   - Update content quarterly

---

## Example Claude Code Session

### You:
```
"Generate AEO content for my SaaS analytics product.

Product: Real-time analytics dashboard for e-commerce stores
URL: analytics.example.com
Top questions:
- What is real-time analytics?
- How is this different from Google Analytics?
- What metrics can I track?
- How long does setup take?
- What integrations are supported?

We have benchmark data: 127ms median query latency from Q3 2025 study"
```

### Claude Will Generate:

**1. Product Overview:**
```html
<article id="product-overview">
  <h1>What is [Product Name]?</h1>
  <div class="overview-answer">
    <p>[Product Name] is a real-time analytics dashboard for
    e-commerce stores that tracks customer behavior and sales metrics.
    As of October 2025, it processes over 10M events daily with
    sub-second latency. This matters because real-time insights enable
    immediate optimization of marketing campaigns and inventory.</p>
    <p class="meta">Last updated: 2025-10-31</p>
  </div>
  <!-- Product schema -->
  <script type="application/ld+json">
  { ... complete schema ... }
  </script>
</article>
```

**2. 15 FAQs with Schema:**
```html
<section id="faq">
  <h2>Frequently Asked Questions</h2>

  <div class="faq-item" id="faq-what-is-realtime-analytics">
    <h3>What is real-time analytics?</h3>
    <p>Real-time analytics processes and displays customer behavior
    data within seconds of events occurring, enabling immediate
    business decisions. Unlike batch processing (hourly/daily),
    real-time systems update dashboards continuously as customers
    interact with your store.</p>
    <p class="meta">Last updated: 2025-10-31</p>
  </div>

  <!-- 14 more FAQs -->

  <!-- FAQPage Schema -->
  <script type="application/ld+json">
  { ... complete FAQPage schema with all 15 FAQs ... }
  </script>
</section>
```

**3. Evidence Block:**
```html
<aside class="evidence-panel" id="evidence-query-latency">
  <h4>Evidence: Query Performance Benchmark</h4>
  <dl>
    <dt>Claim:</dt>
    <dd>127ms median query latency for dashboard analytics</dd>

    <dt>Methodology:</dt>
    <dd>Measured 10,000 dashboard queries across 50 e-commerce stores
    over 30-day period</dd>

    <dt>Data Source:</dt>
    <dd><a href="https://example.com/benchmarks/2025-q3">Q3 2025
    Performance Report</a></dd>

    <dt>Date:</dt>
    <dd>September 15, 2025</dd>

    <dt>Limitations:</dt>
    <dd>Performance measured on standard tier; enterprise tier may
    vary ±15ms based on custom configurations</dd>
  </dl>
</aside>
```

Plus complete schema markup, validation guidance, and implementation checklist.

---

## Key Principles from Research

### Content Structure
- **30-50 word answers** - Sweet spot for AI extraction and voice search
- **Front-load answers** - Put conclusion first, details second
- **Evidence over claims** - "127ms latency" not "incredibly fast"
- **Fresh dates** - 95% of ChatGPT citations from last 10 months

### Schema Requirements
- **JSON-LD format** - Place in `<script type="application/ld+json">` in `<head>`
- **FAQPage is critical** - Most important schema for AEO
- **Persistent anchors** - Each FAQ needs stable ID (#faq-slug)
- **Validate everything** - Use Google Rich Results Test

### Writing Style
- **Specific over vague** - Include numbers, dates, methods
- **Structured over narrative** - Lists, tables, clear sections
- **Complete sentences** - Avoid pronoun ambiguity ("the product" not "it")
- **Short paragraphs** - 2-3 sentences maximum

---

## Validation Checklist

After implementing generated content, verify:

### Content Quality
- [ ] Product overview is exactly 50 words (±5)
- [ ] All 15 FAQs present with 30-50 word answers
- [ ] "Last updated" date on every section
- [ ] Evidence blocks include: claim, method, data, date, limitations
- [ ] No marketing fluff - specific, factual language

### Structure
- [ ] Clear H2/H3 heading hierarchy
- [ ] Each FAQ has unique anchor ID (#faq-slug-format)
- [ ] Bullet points used for lists
- [ ] Comparison tables where relevant
- [ ] Short paragraphs (2-3 sentences)

### Schema Markup
- [ ] FAQPage schema in `<head>` section
- [ ] Every FAQ Question includes `datePublished` and `dateModified` fields
- [ ] Product schema (if product page)
- [ ] HowTo schema (if guide/tutorial)
- [ ] Schema validates with no errors in [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] All FAQ content matches between HTML and JSON-LD
- [ ] All dates use YYYY-MM-DD format (or ISO 8601 for timestamps)

### Technical
- [ ] All anchor links work when clicked
- [ ] Schema is valid JSON (no syntax errors)
- [ ] "Last updated" dates are current
- [ ] Evidence block sources are real, working URLs
- [ ] Facts JSON (if used) includes `lastUpdated` timestamp in ISO 8601 format

---

## Testing Protocol

### Manual AI Engine Testing

Run these prompts across ChatGPT, Claude, and Gemini:

1. **Recognition:** "What is [Your Product]?"
2. **Comparison:** "Compare [Your Product] to [Competitor]"
3. **Best for:** "What's the best [category] for [use case]?"
4. **How-to:** "How do I [task with your product]?"
5. **Alternatives:** "What are alternatives to [Your Product]?"

### Track in Scorecard

| Intent | Engine | Mentioned? | Linked? | Accurate? | Evidence Quoted? | Notes |
|--------|--------|------------|---------|-----------|------------------|-------|
| What is X | ChatGPT | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | Generic description |
| Compare X vs Y | Claude | ❌ No | ❌ No | N/A | N/A | Doesn't know us yet |
| Best [category] | Gemini | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | Cited our benchmark |

### Success Criteria

**4-8 weeks after implementation:**
- Mentioned in ≥3 target intents across ≥2 engines
- At least 1 engine links to your site
- Information cited is accurate

**12 weeks:**
- Stable inclusion for top intents
- Rising mentions in AI Overviews
- Agent-extractable facts being used

---

## Content Refresh Cadence

**Critical insight:** 95% of AI citations come from content updated in the last 10 months.

### Update Schedule

| Content Type | Check | Update |
|--------------|-------|--------|
| Homepage & FAQ | Monthly review | Quarterly update |
| Product pages | When features change | Immediately |
| Evidence blocks | Every 6 months | When data refreshes |
| Blog posts | Quarterly | Add "Last reviewed" even if unchanged |
| How-to guides | When process changes | Immediately |

### Quick Refresh Checklist
1. Update "Last updated" dates
2. Refresh time-sensitive data
3. Add new FAQs from recent customer questions
4. Retire outdated information
5. Re-validate schema markup
6. Re-run AI engine tests

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| ❌ FAQ answers too long | ✅ Keep to 30-50 words |
| ❌ Missing dates | ✅ Add "Last updated" everywhere |
| ❌ Vague claims | ✅ Include specific data, methods, dates |
| ❌ No schema markup | ✅ FAQPage schema is essential |
| ❌ Marketing speak | ✅ Use factual, specific language |
| ❌ Buried answers | ✅ Front-load the answer, details second |
| ❌ Pronoun ambiguity | ✅ Say "the product" not "it" |
| ❌ Missing evidence | ✅ Add methodology for all claims |
| ❌ Stale content | ✅ Update within 10 months or lose visibility |

---

## Tools & Resources

### Schema Validation
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Validate schema markup
- [Schema.org Documentation](https://schema.org/) - Official schema reference
- [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/faqpage) - FAQPage guidelines

### AEO Monitoring (Optional)
- **ChatRank.ai** - Track citations across AI engines ($49/month)
- **Otterly** - GEO audit tool with citation tracking
- **Profound** - Content optimization for AI search

### Manual Testing
- **ChatGPT** - chat.openai.com
- **Claude** - claude.ai
- **Gemini** - gemini.google.com
- **Google AI Overviews** - google.com (enable AI mode)
- **Perplexity** - perplexity.ai (shows sources clearly)

---

## Tech Stack

**No dependencies required:**
- Pure HTML/CSS
- JSON-LD schema (JavaScript in `<script>` tags)
- Works with any CMS or static site generator
- Claude Code for content generation only

**Compatible with:**
- WordPress (paste into Gutenberg blocks or HTML)
- Shopify (paste into pages or theme templates)
- Webflow (paste into Embed components)
- Static sites (paste into HTML files)
- Any CMS that accepts HTML

---

## Future Claude Code Sessions

Each new Claude Code session in this directory can:

### Generate New Content
```
"Generate AEO content for [new page/product]"
```

### Refresh Existing Content
```
"Update the FAQ section with new questions and refresh dates"
```

### Expand Content
```
"Add 5 more FAQs about [topic]"
"Generate evidence blocks for [specific claims]"
```

### Validate Schema
```
"Check if this schema is correct: [paste schema]"
```

### Analyze Competitors
```
"Analyze how [competitor URL] structures their content for AEO"
```

---

## Workflow Summary

```
1. PREPARE
   ├─ Gather product info
   ├─ List top 15 customer questions
   ├─ Collect evidence/data
   └─ Note competitors

2. GENERATE (Claude Code session)
   ├─ "Generate AEO content for [URL/product]"
   ├─ Claude analyzes requirements
   ├─ Claude uses prd.md templates
   └─ Receive complete HTML + schema

3. IMPLEMENT
   ├─ Copy HTML to your website
   ├─ Add schema to <head>
   └─ Verify anchor links work

4. VALIDATE
   ├─ Google Rich Results Test
   ├─ Check FAQ word counts
   ├─ Verify all dates present
   └─ Test anchor links

5. TEST
   ├─ Manual prompts (ChatGPT, Claude, Gemini)
   ├─ Track in scorecard
   └─ Monitor over 4-8 weeks

6. MAINTAIN
   ├─ Monthly review
   ├─ Quarterly updates
   └─ Refresh data every 6 months
```

---

## Questions?

### "Do I need coding skills?"
No. Claude generates ready-to-use HTML. Just copy/paste into your CMS.

### "How long does it take?"
- Claude session: 10-15 minutes
- Implementation: 20-30 minutes
- Validation: 10 minutes
- **Total: ~1 hour per page**

### "Can I use this for multiple websites?"
Yes. Each Claude session can generate content for different sites/products.

### "What if I don't have 15 customer questions?"
Claude can help generate relevant questions based on your product description.

### "Do I need all the evidence blocks?"
No. Start with product overview + 15 FAQs. Add evidence blocks as you gather data.

### "How do I know if it's working?"
Track with manual AI engine tests (prompt scorecard). Results typically visible in 4-8 weeks.

### "Can I modify the generated content?"
Yes! Treat Claude's output as a strong starting point. Edit to match your voice, but keep:
- 30-50 word FAQ answers
- Specific evidence with dates
- "Last updated" dates
- Schema structure intact

---

## Example Use Cases

### SaaS Product Pages
Generate optimized product overviews, feature FAQs, and comparison content that helps AI engines understand and cite your product.

### E-commerce Category Pages
Create category overviews with structured product information that AI can extract and recommend to shoppers.

### Service Business Websites
Build expertise-demonstrating content with evidence blocks showing methodology, case studies, and credentials.

### Documentation Sites
Structure technical docs with HowTo schema and clear step-by-step guides that AI can parse and cite.

### Blog Posts
Transform blog content with FAQ sections, evidence blocks, and proper schema to increase AI discoverability.

---

## Next Steps

1. **Read prd.md** - Familiarize yourself with the templates and best practices
2. **Prepare your info** - Gather product details and customer questions
3. **Start a Claude session** - Say "Generate AEO content for [your website]"
4. **Implement & validate** - Copy content to your site, test schema
5. **Track results** - Monitor AI engine citations over 4-8 weeks

**Remember:** This is about immediate action over perfect strategy. Generate content, test with AI engines, iterate based on results.

---

## License

This repository contains guides and templates for content generation. Generated content is yours to use freely.


## REF: prd.md

# AEO Content Generation Guide for Claude Code

**Goal:** Generate machine-readable content that earns citations and links from ChatGPT, Claude, Gemini, and Google AI Overviews.

**Not in scope:** Building automation tools or complex workflows. This is a content generation guide for manual/Claude-assisted implementation.

---

## Core AEO Principles (Research-Backed)

These principles are derived from LLM citation behavior analysis and should inform all content optimization decisions:

### The 18-Token Extraction Rule
- **Finding:** LLMs extract self-contained sentences of approximately 18 tokens (~15-20 words)
- **Implication:** Key claims must be complete, quotable statements requiring zero surrounding context
- **Example:** "Eight-API synthesis reduces property analysis errors by 67%." (9 tokens, self-contained)

### Single-Topic Focus Pages
- **Finding:** Single-concept pages vastly outperform multi-topic content for AI citations
- **Implication:** Create focused URLs like `domain.com/specific-concept` rather than comprehensive guides
- **Structure:** One clear concept per page with extractable statements

### Citations, Statistics, and Quotations
- **Finding:** Content with citations, stats, and expert quotations receives 30-40% more visibility
- **Implication:** Every major claim needs verifiable data, methodology, and expert attribution
- **Format:** "[Specific claim with number]" + [Citation] + "Expert quote" + [Attribution]

### Micro-Updates Maintain Visibility
- **Finding:** 95% of AI citations come from content updated in the last 10 months
- **Implication:** Static content dies; implement weekly micro-updates (refresh stats, add citations, update examples)
- **Strategy:** Schedule recurring content freshness reviews

### Traditional SEO Tactics Harm GEO Performance
- **Finding:** Keyword stuffing, over-optimization actively hurt GEO performance
- **Implication:** Write for AI extraction, not keyword density
- **Anti-patterns:** ❌ Keyword stuffing, ❌ Generic listicles, ❌ Vague hedged language

### Optimization Aggressiveness by Authority Level
- **Finding:** Princeton study shows rank-5 sites gained 115% visibility with aggressive optimization, while rank-1 sites lost 30% with over-optimization
- **Challenger sites (low authority):** ✅ Aggressive optimization with multiple extraction points, citations, stats
- **Established sites (high authority):** ⚠️ Light touch optimization; trust existing credibility

---

## What Claude Should Generate

When analyzing a website for AEO optimization, Claude Code should produce:

### 1. Homepage Product Overview (50-Word Block)
A concise definition that appears immediately under the H1, including:
- What the product/service is (one clause)
- Scope or timeframe context
- Why it matters (value proposition)
- "Last updated" date

### 2. 15 FAQ Items with Schema
Structured question-answer pairs optimized for AI extraction:
- Questions: 7-12 words, natural language
- Answers: 30-50 words (sweet spot for voice/AI)
- Each FAQ gets a persistent anchor link
- Full FAQPage JSON-LD schema implementation
- "Last updated" date per FAQ

### 3. Evidence Blocks for Key Claims
For every important assertion, add a citation-worthy evidence panel:
- Claim statement
- Methodology
- Data source/dataset
- Date of data collection
- Limitations
- Contact for questions

### 4. JSON-LD Schema Markup
Complete, working schema for:
- FAQPage (for FAQ sections)
- HowTo (for step-by-step guides)
- Product (for product pages)
- Organization (for About page)

### 5. How-To Sections
When relevant, add step-by-step guides with:
- Clear numbered steps
- Explicit constraints or prerequisites
- Expected outcomes
- HowTo schema markup

---

## Content Guidelines (Research-Backed)

### Writing Style for AI Extraction

**Front-load value propositions**
- Put the answer/conclusion first, details second
- Use complete, context-rich sentences
- Avoid pronoun ambiguity (say "the product" not "it")

**Structure for scannability**
- Use clear semantic headings (H2, H3)
- Bullet points for lists
- Comparison tables for product/feature comparisons
- Short paragraphs (2-3 sentences max)

**Optimize for quotability and extraction**
- **Target 15-20 words** (18-token rule) for citation-ready statements
- **Self-contained sentences:** No pronouns requiring context ("the product" not "it")
- **Complete thoughts:** Must be quotable without surrounding paragraphs
- **Declarative structure:** Subject-predicate-object patterns for clarity
- **Confident claims:** Avoid hedging language ("reduces errors by 67%" not "may help reduce errors")
- **Define inline:** All terms understandable without external context
- **FAQ answers:** 30-50 words total, front-loaded with direct answer

**Extraction-Ready Sentence Examples:**
- ✅ "Eight-API synthesis reduces property analysis errors by 67%." (9 tokens, self-contained)
- ✅ "RAG-based systems maintain brand voice 3x better than rule-based approaches." (11 tokens)
- ❌ "Our system is incredibly fast and delivers amazing results." (vague, no specifics)
- ❌ "It significantly improves performance when compared to alternatives." (pronoun ambiguity)

### Content Freshness Signals

**Critical:** 95% of ChatGPT citations come from content updated in the last 10 months.

**Required freshness indicators:**
- "Last updated: YYYY-MM-DD" on every page
- "Last reviewed: YYYY-MM-DD" on evergreen content
- Date stamps on data/benchmarks: "as of YYYY-MM-DD"
- Version numbers on technical docs

### Evidence & Credibility

**AI engines reward specificity over marketing claims:**

✅ **Good:** "In a benchmark of 1,000 queries (July 2025), our system achieved 127ms median latency using the GPT-4 API."

❌ **Bad:** "Our system is incredibly fast and delivers amazing results."

**Include:**
- Original research and first-hand data
- Methodology descriptions
- Dataset sources and dates
- Clear limitations and constraints
- Author expertise/credentials

### Schema & Structure

**Essential schema types:**
1. **FAQPage** - For FAQ sections (most important)
2. **HowTo** - For step-by-step guides
3. **Product** - For product pages
4. **Organization** - For About/Company pages

**Technical requirements:**
- Use JSON-LD format (recommended by Google)
- Place schema in `<script type="application/ld+json">` in `<head>`
- Validate with Google Rich Results Test
- Use persistent anchor IDs for FAQs (#faq-what-is-x)

---

## Templates

### Template 1: Product Overview Block

```html
<article id="product-overview">
  <h1>What is [Product Name]?</h1>

  <div class="overview-answer">
    <p>[Product Name] is a [category] that [core function].
    As of [Month Year], it [key differentiator/scope].
    This matters because [value proposition in one sentence].</p>

    <p class="meta">Last updated: 2025-10-31</p>
  </div>

  <!-- Schema markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "[Product Name]",
    "description": "[50-word description from above]",
    "brand": {
      "@type": "Brand",
      "name": "[Your Company]"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://example.com/product",
      "priceCurrency": "USD",
      "price": "99.00",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>
</article>
```

**Example:**
```
What is AEO Optimizer?

AEO Optimizer is a content analysis tool that identifies gaps in website
structure for AI search engines. As of October 2025, it supports ChatGPT,
Claude, and Gemini analysis. This matters because 60% of searches now end
without a click, making AI citation the new discovery channel.

Last updated: 2025-10-31
```

---

### Template 2: FAQ Section with Schema

```html
<section id="faq">
  <h2>Frequently Asked Questions</h2>

  <div class="faq-item" id="faq-what-is-aeo">
    <h3>What is Answer Engine Optimization?</h3>
    <p>Answer Engine Optimization (AEO) is the practice of structuring
    website content so AI systems like ChatGPT, Claude, and Gemini can
    easily extract, cite, and link to your information. It focuses on
    machine-readable formats like JSON-LD and 30-50 word answers.</p>
    <p class="meta">Last updated: 2025-10-31</p>
  </div>

  <div class="faq-item" id="faq-how-different-from-seo">
    <h3>How is AEO different from SEO?</h3>
    <p>SEO optimizes for ranking in search result lists, while AEO
    optimizes for being cited in AI-generated answers. AEO requires
    shorter, more structured answers (30-50 words), strict schema markup,
    and evidence blocks that AI can verify and quote directly.</p>
    <p class="meta">Last updated: 2025-10-31</p>
  </div>

  <!-- Add 13 more FAQ items following same pattern -->

  <!-- FAQPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Answer Engine Optimization?",
        "datePublished": "2025-01-15",
        "dateModified": "2025-10-31",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Answer Engine Optimization (AEO) is the practice of structuring website content so AI systems like ChatGPT, Claude, and Gemini can easily extract, cite, and link to your information. It focuses on machine-readable formats like JSON-LD and 30-50 word answers."
        }
      },
      {
        "@type": "Question",
        "name": "How is AEO different from SEO?",
        "datePublished": "2025-01-15",
        "dateModified": "2025-10-31",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SEO optimizes for ranking in search result lists, while AEO optimizes for being cited in AI-generated answers. AEO requires shorter, more structured answers (30-50 words), strict schema markup, and evidence blocks that AI can verify and quote directly."
        }
      }
      // Add remaining 13 FAQs with datePublished and dateModified
    ]
  }
  </script>
</section>
```

**FAQ Generation Guidelines:**
- Cover top customer questions (use "People Also Ask," support tickets, sales calls)
- Use natural question phrasing ("What is X?" not "X definition")
- Keep answers factual and specific
- Link to deeper content with "Learn more about [topic]"
- Each FAQ must appear in both HTML and JSON-LD

**Date Fields Explained:**
- `datePublished`: When the FAQ was first created (YYYY-MM-DD format)
- `dateModified`: When the FAQ was last updated (YYYY-MM-DD format)
- **Why they matter**: AI engines prioritize fresh content (95% of citations from content updated in last 10 months). These machine-readable dates signal content currency.
- **HTML vs Schema dates**: Use both! `<p class="meta">Last updated: ...</p>` is for humans; `datePublished`/`dateModified` are for AI engines

---

### Template 3: Evidence Panel

```html
<aside class="evidence-panel" id="evidence-latency-benchmark">
  <h4>Evidence: Response Time Benchmark</h4>

  <dl>
    <dt>Claim:</dt>
    <dd>Median API response time of 127ms for standard queries</dd>

    <dt>Methodology:</dt>
    <dd>Measured 1,000 API calls using standardized test queries
    against GPT-4 endpoint</dd>

    <dt>Data Source:</dt>
    <dd><a href="https://example.com/benchmarks/2025-07">Internal
    Benchmark Report Q3 2025</a></dd>

    <dt>Date:</dt>
    <dd>July 15, 2025</dd>

    <dt>Limitations:</dt>
    <dd>Results measured under optimal network conditions with pre-warmed
    connections; production performance may vary ±20ms</dd>

    <dt>Contact:</dt>
    <dd>research@example.com</dd>
  </dl>

  <p class="meta">Last updated: 2025-07-15</p>
</aside>
```

**Machine-Readable Facts JSON (optional but recommended):**

```json
{
  "page": "https://example.com/product-performance",
  "version": "2025-10-31",
  "lastUpdated": "2025-10-31T14:30:00Z",
  "facts": [
    {
      "id": "latency_median",
      "value": "127ms",
      "source": "https://example.com/benchmarks/2025-07",
      "as_of": "2025-07-15",
      "method": "1000 API calls, GPT-4 endpoint, standard queries"
    },
    {
      "id": "price",
      "value": "$99/month",
      "source": "https://example.com/pricing",
      "as_of": "2025-10-01"
    }
  ]
}
```

**Facts JSON Field Definitions:**
- `page`: URL of the page this data describes
- `version`: Human-readable version date (YYYY-MM-DD)
- `lastUpdated`: ISO 8601 timestamp when this JSON was last generated (YYYY-MM-DDTHH:MM:SSZ)
- `facts[].as_of`: When each specific fact's data was collected

**Why lastUpdated matters**: Enables AI agents to programmatically check data staleness and determine whether to fetch fresh data.

Host this as `page-name.json` alongside the HTML page so agents can fetch structured data directly.

---

### Template 4: How-To Section with Schema

```html
<article id="how-to-implement-faq-schema">
  <h2>How to Implement FAQ Schema on Your Website</h2>

  <ol>
    <li>
      <strong>Identify your top 15 customer questions</strong>
      <p>Review support tickets, "People Also Ask" results, and sales
      call recordings to find the most common questions.</p>
    </li>

    <li>
      <strong>Write 30-50 word answers for each question</strong>
      <p>Keep answers concise and factual. Front-load the direct answer,
      then add supporting details.</p>
    </li>

    <li>
      <strong>Add HTML structure with semantic markup</strong>
      <p>Use H3 for questions, paragraph tags for answers, and assign
      unique IDs to each FAQ item (#faq-question-slug).</p>
    </li>

    <li>
      <strong>Generate FAQPage JSON-LD schema</strong>
      <p>Use the template above or a schema generator. Place the script
      in your page's &lt;head&gt; section.</p>
    </li>

    <li>
      <strong>Validate with Google Rich Results Test</strong>
      <p>Visit search.google.com/test/rich-results and enter your page
      URL. Fix any errors reported.</p>
    </li>
  </ol>

  <p class="meta">Last updated: 2025-10-31</p>

  <!-- HowTo Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Implement FAQ Schema on Your Website",
    "description": "Step-by-step guide to adding FAQPage schema markup for better AI search visibility",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Identify your top 15 customer questions",
        "text": "Review support tickets, 'People Also Ask' results, and sales call recordings to find the most common questions."
      },
      {
        "@type": "HowToStep",
        "name": "Write 30-50 word answers for each question",
        "text": "Keep answers concise and factual. Front-load the direct answer, then add supporting details."
      },
      {
        "@type": "HowToStep",
        "name": "Add HTML structure with semantic markup",
        "text": "Use H3 for questions, paragraph tags for answers, and assign unique IDs to each FAQ item."
      },
      {
        "@type": "HowToStep",
        "name": "Generate FAQPage JSON-LD schema",
        "text": "Use the template above or a schema generator. Place the script in your page's head section."
      },
      {
        "@type": "HowToStep",
        "name": "Validate with Google Rich Results Test",
        "text": "Visit search.google.com/test/rich-results and enter your page URL. Fix any errors reported."
      }
    ]
  }
  </script>
</article>
```

---

## Implementation Checklist

When Claude Code generates AEO-optimized content for a website, verify:

### Content
- [ ] Product overview: 50 words, dated, under H1
- [ ] 15 FAQs: 30-50 words each, natural questions
- [ ] Evidence panels: method, data, date, limitations for key claims
- [ ] How-to sections: numbered steps with constraints
- [ ] "Last updated" dates on every page

### Structure
- [ ] Clear H2/H3 hierarchy
- [ ] Bullet points for lists
- [ ] Comparison tables where relevant
- [ ] Persistent anchor IDs for all FAQs (#faq-slug)
- [ ] Short paragraphs (2-3 sentences)

### Schema Markup
- [ ] FAQPage schema for FAQ section
- [ ] Every FAQ Question includes `datePublished` and `dateModified` fields
- [ ] Product schema for product pages
- [ ] HowTo schema for guides
- [ ] Organization schema for About page
- [ ] All schema placed in `<script type="application/ld+json">` in `<head>`
- [ ] All dates in YYYY-MM-DD format (or ISO 8601 for lastUpdated)

### Validation
- [ ] Validate schema with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test anchor links work
- [ ] Verify dates are current
- [ ] Check FAQ answers are 30-50 words
- [ ] Confirm all evidence blocks have sources + dates
- [ ] Facts JSON (if used) includes `lastUpdated` timestamp in ISO 8601 format

---

## Quick Testing Protocol

After generating content, test with AI engines:

### Manual Prompt Testing
Run these prompts against ChatGPT, Claude, and Gemini:

1. **Recognition:** "What is [Your Product]?"
2. **Comparison:** "Compare [Your Product] to [Competitor]"
3. **Best for:** "What's the best [category] for [use case]?"
4. **How-to:** "How do I [task with your product]?"
5. **Alternatives:** "What are alternatives to [Your Product]?"

### Check for:
- ✅ Brand mentioned by name
- ✅ Link to your website included
- ✅ Accurate information cited
- ✅ Evidence/data quoted
- ❌ Hallucinations or incorrect claims

### Track Results:
Create a simple scorecard (CSV or spreadsheet):

| Intent | Engine | Mentioned? | Linked? | Accurate? | Evidence Quoted? | Notes |
|--------|--------|------------|---------|-----------|------------------|-------|
| What is X | ChatGPT | Yes | Yes | Yes | No | Generic description |
| Compare X vs Y | Claude | No | No | N/A | N/A | Doesn't know us |

---

## Competitive Positioning Strategy

**Critical Insight:** Optimization aggressiveness should match your current authority level. The Princeton study reveals that challenger sites and established sites require opposite approaches.

### Authority Level Assessment

**Determine your site's authority tier:**

1. **Challenger/Low Authority** (Most startups, new sites, rank 5+)
   - Domain age < 2 years
   - Few inbound links from authoritative sources
   - Not currently cited by AI engines
   - Low search engine rankings for target keywords

2. **Established/High Authority** (Top-ranked, well-known brands, rank 1-3)
   - Domain age > 5 years
   - Strong backlink profile from authoritative sources
   - Already cited by AI engines regularly
   - Top 3 search rankings for target keywords

### Optimization Approach by Authority Level

#### For Challenger Sites (Aggressive Optimization)

**✅ DO: Go aggressive with GEO tactics**
- **Multiple extraction points:** 5-7 citation-ready sentences per page
- **Heavy citation layer:** Reference studies, papers, original research
- **Stat callouts everywhere:** Every claim backed by specific numbers
- **Expert attribution:** Your name + credentials + company format on all insights
- **Weekly micro-updates:** Constant freshness signals
- **Focused domain claiming:** Narrow expertise, deep coverage

**Princeton study finding:** Rank-5 sites gained **115% visibility** with proper aggressive optimization.

**Why this works:** You have nothing to lose and everything to gain. AI engines reward specificity and verifiability from emerging sources.

**Example structure:**
```markdown
## Property Valuation Accuracy

Eight-API synthesis reduces property analysis errors by 67%.
[Our 2024 accuracy study - https://example.com/studies/accuracy]

"Multi-source validation eliminates single-point-of-failure bias."
- John Doe, AI CTO at Company, developed the synthesis algorithm

Last updated: 2025-10-31
```

#### For Established Sites (Light Touch Optimization)

**⚠️ CAUTION: Over-optimization hurts established sites**
- **1-2 strategic extraction points:** Don't stuff every paragraph
- **Trust existing credibility:** Your brand already has authority
- **Natural language:** Avoid keyword-stuffed optimization patterns
- **Selective citations:** Add where genuinely valuable, not everywhere
- **Quarterly updates:** Less aggressive freshness signaling

**Princeton study finding:** Rank-1 sites that over-optimized **lost 30% visibility**.

**Why caution matters:** AI engines detect over-optimization patterns. When established sites suddenly shift to aggressive GEO tactics, it triggers quality penalties.

**Example structure:**
```markdown
## Our Approach to Property Valuation

We combine eight data sources including tax assessments, recent comparable sales,
and neighborhood trend analysis. Our methodology has been refined over five years
of serving 10,000+ real estate professionals.

Independent validation: 94% accuracy rate (National Real Estate Technology Council, 2024)
```

### Competitive Advantage Tactics

**Your position as challenger is an advantage:**
- Nike (rank-1) must be conservative
- You (rank-5+) can be aggressive
- AI engines reward emerging sources with strong verification
- Established brands often underestimate GEO, leaving opportunity

**Strategic opportunities:**
- ✅ Claim narrow domains with authoritative depth
- ✅ Publish original research and data
- ✅ Weekly micro-updates show active expertise
- ✅ Focus on extractable, quotable claims
- ✅ Build citation-worthy evidence panels

**Avoid competing head-on:**
- ❌ Don't try to rank for "real estate" (too broad, dominated)
- ✅ DO claim "eight-API property valuation methodology" (specific, ownable)

### Self-Assessment Checklist

Before optimizing, determine your approach:

- [ ] Identified authority level (Challenger vs Established)
- [ ] Chosen appropriate optimization aggressiveness
- [ ] If Challenger: Prepared for 3-5 extraction points per page
- [ ] If Established: Limiting to 1-2 strategic extraction points
- [ ] Avoided traditional SEO keyword stuffing
- [ ] Focused on narrow domain claiming vs broad coverage

---

## Content Refresh Cadence

**Critical insight:** 95% of AI citations come from content published/updated in the last 10 months.

**Recommended schedule:**

- **Homepage & FAQ:** Review monthly, update quarterly
- **Product pages:** Update when features change (immediately)
- **Evidence blocks:** Refresh data every 6 months minimum
- **Blog posts:** Add "Last reviewed" date even if unchanged
- **How-to guides:** Update when process changes

**Quick refresh checklist:**
1. Update "Last updated" dates
2. Refresh any time-sensitive data
3. Add new FAQs from recent customer questions
4. Retire outdated information
5. Re-validate schema markup

---

## Key Principles

### 1. Machine-First Content
Write for AI agents as primary audience. Humans benefit from the summaries AI generates.

### 2. Evidence Over Claims
Don't say "fastest" - say "127ms median latency in Q3 2025 benchmark of 1,000 queries."

### 3. Structured Over Creative
AI prefers scannable structure over narrative flow. Use lists, tables, and clear sections.

### 4. Fresh Over Perfect
Content updated 6 months ago outperforms perfect content from 2 years ago.

### 5. Quotable Over Comprehensive
Better to have 50 words AI can quote exactly than 500 words it has to summarize.

---

## Common Mistakes to Avoid

### Content Structure Errors
❌ **FAQ answers too long** → Keep to 30-50 words, front-load direct answer
❌ **Buried answers** → Put the conclusion first, details second
❌ **Pronoun ambiguity** → Say "the product" not "it" (breaks extraction)
❌ **Long sentences** → Violates 18-token rule; aim for 15-20 words for key claims
❌ **Multi-topic pages** → Split into focused single-concept pages (domain.com/specific-topic)

### Evidence & Authority Errors
❌ **Vague claims** → Include specific data, methods, dates ("reduces by 67%" not "improves significantly")
❌ **Missing evidence** → Add methodology, dataset, limitations for all claims
❌ **No individual attribution** → Use "Name, Title at Company" format, not company name alone
❌ **Missing citations** → Reference studies, papers, original research with dates
❌ **Unsupported statistics** → Every number needs source + "as of [date]"

### Technical Implementation Errors
❌ **Missing dates** → Add "Last updated: YYYY-MM-DD" on every page
❌ **No schema markup** → FAQPage schema is essential; validate with Google Rich Results Test
❌ **Stale content** → Update within 10 months or lose 95% of citation opportunity
❌ **Generic metadata** → Specific, extractable meta descriptions

### Optimization Strategy Errors

#### Traditional SEO Tactics (Actively Harmful for GEO)
❌ **Keyword stuffing** → AI engines penalize unnatural keyword density
❌ **Generic listicles** → "Top 10 X" without original insight or data
❌ **Vague hedging** → "May help improve" instead of specific claims with data
❌ **Aggregated content** → Synthesizing others' work without unique angle
❌ **Over-optimization patterns** → Especially harmful for established/high-authority sites

#### Authority-Level Mismatches
❌ **Established sites going aggressive** → Rank-1 sites lost 30% with over-optimization
❌ **Challengers being too conservative** → New sites need 5-7 extraction points per page, not 1-2
❌ **Broad topic claiming** → Better to own "eight-API property valuation" than "real estate"
❌ **Ignoring competitive position** → Assess authority level before choosing optimization approach

### Content Quality Errors
❌ **Marketing speak** → Use factual, specific language with verifiable claims
❌ **AI-generated without verification** → Obvious patterns trigger quality filters
❌ **No first-hand expertise** → Original research and data beats synthesis
❌ **Anonymous content** → Attribution matters for authority signals

### Update & Maintenance Errors
❌ **One-and-done publishing** → Static content dies; need weekly micro-updates
❌ **No freshness signals** → Dates, version numbers, "last reviewed" timestamps required
❌ **Outdated examples** → References to old data without update notes
❌ **Ignoring feedback loops** → Not testing with actual AI engines (ChatGPT, Claude, Gemini)

---

## Tools & Resources

**Schema Generators:**
- [Google FAQ Schema Generator](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

**AEO Monitoring (optional):**
- ChatRank.ai - Track mentions across AI engines
- Otterly - GEO audit tool with citation tracking
- Profound - Content optimization for AI search

**Testing:**
- Manual prompts to ChatGPT, Claude, Gemini
- Google AI Overviews (google.com with AI mode)
- Perplexity.ai (tracks sources)

---

## AI Visibility Assessment Framework

Use this framework to evaluate existing content for AI citation readiness and identify optimization priorities.

### Assessment Dimensions

For each URL analyzed, score across four dimensions (0-10 scale):

#### 1. Extraction Score (0-10)
**Question:** How many citation-ready sentences exist?

**Scoring:**
- **0-2:** No extractable sentences; all content requires context or summarization
- **3-5:** 1-2 quotable statements but buried in long paragraphs
- **6-8:** 3-5 clear, self-contained statements under 20 words
- **9-10:** 5+ citation-ready statements, highlighted and easily identifiable

**Red flags:**
- Long, winding sentences requiring summarization
- Claims dependent on surrounding paragraphs
- Ambiguous references ("this", "that", "it" without clear antecedents)
- No statements under 25 words

**What to look for:**
- Self-contained statements under 18 tokens (~15-20 words)
- Complete thoughts requiring zero surrounding context
- Confident, declarative claims
- No nested clauses or complex syntax

#### 2. Focus Score (0-10)
**Question:** How narrowly defined is the topic?

**Scoring:**
- **0-2:** Multi-topic page covering 5+ concepts; sprawling content
- **3-5:** 2-4 related topics on same page
- **6-8:** Single primary concept with 1-2 supporting subtopics
- **9-10:** Laser-focused on ONE specific concept/question

**Red flags:**
- Sprawling multi-topic coverage
- Adjacent topic dilution
- Content outside core expertise area
- Signals of being an "aggregator" rather than expert

**What to look for:**
- Single-topic pages (domain.com/specific-concept)
- Narrow, deep expertise in one area
- Consistent topic clustering
- Clear domain boundaries

#### 3. Authority Score (0-10)
**Question:** How strong are expertise signals?

**Scoring:**
- **0-2:** Anonymous authorship; no citations; unsupported claims
- **3-5:** Generic claims with minimal attribution; company name only
- **6-8:** Clear authorship, some citations, specific data points
- **9-10:** Expert attribution (name + credentials + org), verifiable citations, first-hand research

**Red flags:**
- Anonymous or ambiguous authorship
- Institution name without individual attribution
- Unsupported claims
- Institutional shadow (org overshadowing individual)

**What to look for:**
- Proper name + credential + org in clean format
- Citations to verifiable sources
- Specific data points and studies referenced
- First-hand expertise signals

#### 4. Freshness Score (0-10)
**Question:** How recently updated?

**Scoring:**
- **0-2:** No dates; appears 2+ years old based on content
- **3-5:** Dated 12-24 months ago; no recent updates
- **6-8:** Updated within 6-11 months
- **9-10:** Updated within last 90 days; clear micro-update signals

**Red flags:**
- Static "evergreen" content with no updates
- Outdated examples or references
- No indication of ongoing maintenance

**What to look for:**
- Recent update timestamps
- Micro-updates to existing content (refreshed stats, new citations)
- Living document signals
- "Last updated" dates visible

### Optimization Level Assessment

Based on scores + authority level:

**For High-Authority/Top-Ranked Sites:**
- **Optimal:** Light touch optimization
  - 1-2 strategic extractable sentences per page
  - Trust existing credibility
  - Natural fluency over keyword stuffing
- **Avoid:** Aggressive multi-technique optimization (triggers detection)

**For Low-Authority/Challenger Sites:**
- **Optimal:** Aggressive but focused optimization
  - Multiple 18-token extraction points (5-7 per page)
  - Clear expertise signals
  - Citation-rich content
  - Focused domain claiming
- **Avoid:** Trying to cover too many topics; dilution of expertise

### Content Evaluation Checklist

**Scan content for:**

- [ ] Can you extract 3-5 self-contained sentences under 18 tokens?
- [ ] Does the page focus on ONE specific concept/question?
- [ ] Are key claims highlighted or easily identifiable?
- [ ] Is authorship clearly attributed with credentials?
- [ ] Are there verifiable data points or citations?
- [ ] Has content been updated in the last 90 days?
- [ ] Does the URL structure indicate topic specificity?
- [ ] Is the content human-readable while being extraction-friendly?
- [ ] Does it avoid content sprawl outside core expertise?
- [ ] Are claims confident and definitive (not hedged)?

### Signal Quality Markers

**High Signal (Citation-Worthy):**
- Verifiable data with methodology
- Specific studies/sources named with dates
- First-hand expertise and original research
- Unique insights not found elsewhere
- Clear, quotable statements

**Low Signal (Noise Floor):**
- Generic listicles without original insight
- Synthesized content without unique angle
- Obvious AI generation patterns
- Vague, hedged language ("may help", "could potentially")
- Aggregated content without attribution

### Output Format for Assessment

Create a simple scorecard per URL:

| Dimension | Score (0-10) | Notes |
|-----------|-------------|-------|
| **Extraction** | X | "Found 2 quotable statements but buried in 300-word paragraphs" |
| **Focus** | X | "Single topic (property valuation) with clear boundaries" |
| **Authority** | X | "Company name only; no individual attribution or citations" |
| **Freshness** | X | "Last updated 14 months ago; several outdated stats" |
| **Overall** | XX/40 | |
| **Optimization Level** | Under/Optimal/Over | "Challenger site - recommend aggressive optimization" |

**Priority Actions:** List top 3-5 changes needed based on lowest scores.

### Quick Assessment Questions

Answer these to rapidly gauge AEO readiness:

1. **Extraction test:** Can you copy-paste 3 sentences that fully answer a question without context? (Yes/No)
2. **Focus test:** Does the URL indicate exactly one topic? (Yes/No)
3. **Authority test:** Is the author named with credentials? (Yes/No)
4. **Freshness test:** Updated within 90 days? (Yes/No)
5. **Citation test:** Are there 2+ verifiable sources with dates? (Yes/No)

**Score:**
- **0-2 Yes:** Critical optimization needed
- **3-4 Yes:** Good foundation, needs enhancement
- **5 Yes:** Excellent AEO readiness

---

## Example: Full Homepage Optimization

Here's what the top of an optimized homepage looks like:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AEO Optimizer - AI Search Engine Optimization Tool</title>

  <!-- Product Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "AEO Optimizer",
    "description": "Content analysis tool that identifies gaps in website structure for AI search engines. Supports ChatGPT, Claude, and Gemini analysis.",
    "brand": {
      "@type": "Brand",
      "name": "Example Company"
    }
  }
  </script>

  <!-- FAQPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is AEO Optimizer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AEO Optimizer is a content analysis tool that identifies gaps in website structure for AI search engines. As of October 2025, it supports ChatGPT, Claude, and Gemini analysis. This matters because 60% of searches now end without a click."
        }
      }
      // ... 14 more FAQs
    ]
  }
  </script>
</head>
<body>
  <!-- Product Overview -->
  <main>
    <article id="product-overview">
      <h1>What is AEO Optimizer?</h1>
      <div class="overview-answer">
        <p>AEO Optimizer is a content analysis tool that identifies gaps
        in website structure for AI search engines. As of October 2025,
        it supports ChatGPT, Claude, and Gemini analysis. This matters
        because 60% of searches now end without a click, making AI
        citation the new discovery channel.</p>
        <p class="meta">Last updated: 2025-10-31</p>
      </div>
    </article>

    <!-- FAQ Section -->
    <section id="faq">
      <h2>Frequently Asked Questions</h2>

      <div class="faq-item" id="faq-what-is-aeo-optimizer">
        <h3>What is AEO Optimizer?</h3>
        <p>AEO Optimizer is a content analysis tool that identifies gaps
        in website structure for AI search engines. As of October 2025,
        it supports ChatGPT, Claude, and Gemini analysis. This matters
        because 60% of searches now end without a click.</p>
        <p class="meta">Last updated: 2025-10-31</p>
      </div>

      <!-- 14 more FAQ items -->
    </section>
  </main>
</body>
</html>
```

---

## Next Steps

When using this guide in a Claude Code session:

1. **Analyze target website:** Identify missing elements (product overview, FAQs, schema, evidence)
2. **Generate content:** Use templates above to create optimized content
3. **Add schema markup:** Implement JSON-LD for all relevant sections
4. **Validate:** Test with Google Rich Results Test and manual AI prompts
5. **Track results:** Create simple scorecard to monitor citations over 4-8 weeks

This guide prioritizes **immediate action** over perfect strategy. Generate content, test with AI engines, iterate based on results.


## REF: story-structured.md

# Princeton GEO Study: Strategic Insights

Key findings from the Princeton-validated study on Generative Engine Optimization (GEO) and AI visibility.

## The 12-18 Month Window

**Current state:** Top-ranked sites are losing AI visibility while challengers gain 2-3x citation rates.

**Why:** Most top-ranked content isn't optimized for LLM extraction patterns yet. Lower-ranked sources with proper AI structure are getting cited at higher rates.

**Window closes when:** Everyone optimizes, advantage disappears, authority signals matter again (measured differently).

## Position Bias Inversion

LLMs actively diversify sources to avoid appearing captured by dominant players.

| If you are... | Strategy |
|---------------|----------|
| **Top 3 on Google** | Under-optimize. Light fluency + 1-2 citations. Let existing credibility carry. |
| **Challenger with expertise** | Aggressive optimization. Leapfrog without backlinks. |

**Princeton finding:**
- Rank-5 sites: **+115% visibility** with aggressive optimization
- Rank-1 sites: **-30% visibility** when over-optimized

## The 18-Token Extraction Pattern

LLMs optimize for synthesis efficiency. Almost all citations are single-sentence extractions under 18 tokens.

**Why 18 tokens:**
- Longer sentences require summarization
- Summarization introduces errors
- Models reduce hallucination risk by quoting clean, complete statements

**Implication:** Your 30,000-word definitive guide may get summarized while a competitor's 600-word piece with 5 "golden nugget" sentences gets quoted verbatim.

**Good structure:**
- Self-contained statement
- Complete thought, zero surrounding context needed
- Confident, declarative claim
- Snack-sized for LLM extraction

## Institution Shadow Problem

Individual experts become invisible when institution overshadows attribution.

**Problem format:** "Jane Doe did work at Google" → Google gets credit, Jane invisible

**Solution format:** "Quote" - Jane Doe, PhD, AI Researcher at Google (all in one clean line)

**Finding:** Claim pages (yourname.com/specific-concept) get cited 4x more often than multi-topic blogs.

## Single-Topic Focus Pages

LLMs want clarity. One concept per page.

**Pattern:** Dedicated URLs for single concepts (like AI 2027, Situational Awareness essays)
- Sit on own URL
- Only about one thing
- Cover page with 18-token tidbits
- Deep content for humans who click through

**Opportunity:** Most experts haven't figured out their "claim page" yet. If you structure expertise as unique answer to specific question, you can establish AI authority while others figure this out.

## The Noise Floor Paradox

~50% of new pages are AI-generated spam. This makes high-signal content rarer and more valuable.

**Why this helps you:**
- AI is desperate to avoid hallucination penalties
- Clean signal sources become premium
- Frontier labs pay for trustworthy corpora (Reuters: $5M/year to Anthropic)

**Strategy:** Be signal in a world of noise. Genuine expertise + verifiable data = window to establish value.

## Citation Churn: Static Content Dies

Pattern: Get cited week 1, vanish by week 3-4.

**Why:** Models re-rank based on competitor updates and freshness signals.

**Implication:** Content requires ongoing maintenance or drops out of model's mind. May need dedicated resources for micro-updates vs. long-form pieces.

## Domain Mismatch Penalty

LLMs cross-check domain alignment to avoid hallucinations.

**Traditional SEO:** Write about adjacent topics, capture long-tail keywords
**GEO reality:** Content sprawl flags you as non-expert/aggregator

**Strategy:** Obsess over one domain. Similar to TikTok algorithm - talk about one thing, algorithm knows what to expect.

## Under-Optimization Strategy

Most counterintuitive finding: For top-ranked sites, less is more.

**Top-ranked sites:**
- Light AI fluency + 1 strategic citation = +22% net gains
- Aggressive multi-technique optimization = triggered detection, reduced visibility

**Why:** Intelligence is filtering the web. LLM figured out you were gaming the system.

## Strategic Summary

| Principle | Action |
|-----------|--------|
| **18-token rule** | Structure quotable sentences under 18 tokens |
| **Single-topic focus** | One concept per page, dedicated URLs |
| **Authority matching** | Challengers aggressive, established sites light touch |
| **Freshness** | Weekly micro-updates, visible dates |
| **Signal over noise** | Genuine expertise, verifiable data, citations |
| **Individual attribution** | Name + credentials + org in clean format |
| **Domain focus** | Stay in lane, avoid content sprawl |

## The Bottom Line

The web isn't dying - it's evolving. AI is the "pair of glasses" people use to view the web.

**Your job:** Help that pair of glasses focus on real signal. Make expertise legible to AI. Don't game the system - convey real authority.

**Window:** 12-18 months before optimization becomes table stakes and we're back to authority signals (measured differently).
