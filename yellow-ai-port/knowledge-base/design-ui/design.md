# Skill: design

**Category:** design-ui

**Cursor invoke:** `/design`

---


## SKILL: SKILL.md

# Design

Unified design skill: brand, tokens, UI, logo, CIP, slides, banners, social photos, icons.

## When to Use

- Brand identity, voice, assets
- Design system tokens and specs
- UI styling with shadcn/ui + Tailwind
- Logo design and AI generation
- Corporate identity program (CIP) deliverables
- Presentations and pitch decks
- Banner design for social media, ads, web, print
- Social photos for Instagram, Facebook, LinkedIn, Twitter, Pinterest, TikTok

## Sub-skill Routing

| Task | Sub-skill | Details |
|------|-----------|---------|
| Brand identity, voice, assets | `brand` | External skill |
| Tokens, specs, CSS vars | `design-system` | External skill |
| shadcn/ui, Tailwind, code | `ui-styling` | External skill |
| Logo creation, AI generation | Logo (built-in) | `references/logo-design.md` |
| CIP mockups, deliverables | CIP (built-in) | `references/cip-design.md` |
| Presentations, pitch decks | Slides (built-in) | `references/slides.md` |
| Banners, covers, headers | Banner (built-in) | `references/banner-sizes-and-styles.md` |
| Social media images/photos | Social Photos (built-in) | `references/social-photos-design.md` |
| SVG icons, icon sets | Icon (built-in) | `references/icon-design.md` |

## Logo Design (Built-in)

55+ styles, 30 color palettes, 25 industry guides. Gemini Nano Banana models.

### Logo: Generate Design Brief

```bash
python3 ~/.claude/skills/design/scripts/logo/search.py "tech startup modern" --design-brief -p "BrandName"
```

### Logo: Search Styles/Colors/Industries

```bash
python3 ~/.claude/skills/design/scripts/logo/search.py "minimalist clean" --domain style
python3 ~/.claude/skills/design/scripts/logo/search.py "tech professional" --domain color
python3 ~/.claude/skills/design/scripts/logo/search.py "healthcare medical" --domain industry
```

### Logo: Generate with AI

**ALWAYS** generate output logo images with white background.

```bash
python3 ~/.claude/skills/design/scripts/logo/generate.py --brand "TechFlow" --style minimalist --industry tech
python3 ~/.claude/skills/design/scripts/logo/generate.py --prompt "coffee shop vintage badge" --style vintage
```

**IMPORTANT:** When scripts fail, try to fix them directly.

After generation, **ALWAYS** ask user about HTML preview via `AskUserQuestion`. If yes, invoke `/ui-ux-pro-max` for gallery.

## CIP Design (Built-in)

50+ deliverables, 20 styles, 20 industries. Gemini Nano Banana (Flash/Pro).

### CIP: Generate Brief

```bash
python3 ~/.claude/skills/design/scripts/cip/search.py "tech startup" --cip-brief -b "BrandName"
```

### CIP: Search Domains

```bash
python3 ~/.claude/skills/design/scripts/cip/search.py "business card letterhead" --domain deliverable
python3 ~/.claude/skills/design/scripts/cip/search.py "luxury premium elegant" --domain style
python3 ~/.claude/skills/design/scripts/cip/search.py "hospitality hotel" --domain industry
python3 ~/.claude/skills/design/scripts/cip/search.py "office reception" --domain mockup
```

### CIP: Generate Mockups

```bash
# With logo (RECOMMENDED)
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo /path/to/logo.png --deliverable "business card" --industry "consulting"

# Full CIP set
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo /path/to/logo.png --industry "consulting" --set

# Pro model (4K text)
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo logo.png --deliverable "business card" --model pro

# Without logo
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TechFlow" --deliverable "business card" --no-logo-prompt
```

Models: `flash` (default, `gemini-2.5-flash-image`), `pro` (`gemini-3-pro-image-preview`)

### CIP: Render HTML Presentation

```bash
python3 ~/.claude/skills/design/scripts/cip/render-html.py --brand "TopGroup" --industry "consulting" --images /path/to/cip-output
```

**Tip:** If no logo exists, use Logo Design section above first.

## Slides (Built-in)

Strategic HTML presentations with Chart.js, design tokens, copywriting formulas.

Load `references/slides-create.md` for the creation workflow.

### Slides: Knowledge Base

| Topic | File |
|-------|------|
| Creation Guide | `references/slides-create.md` |
| Layout Patterns | `references/slides-layout-patterns.md` |
| HTML Template | `references/slides-html-template.md` |
| Copywriting | `references/slides-copywriting-formulas.md` |
| Strategies | `references/slides-strategies.md` |

## Banner Design (Built-in)

22 art direction styles across social, ads, web, print. Uses `frontend-design`, `ai-artist`, `ai-multimodal`, `chrome-devtools` skills.

Load `references/banner-sizes-and-styles.md` for complete sizes and styles reference.

### Banner: Workflow

1. **Gather requirements** via `AskUserQuestion` — purpose, platform, content, brand, style, quantity
2. **Research** — Activate `ui-ux-pro-max`, browse Pinterest for references
3. **Design** — Create HTML/CSS banner with `frontend-design`, generate visuals with `ai-artist`/`ai-multimodal`
4. **Export** — Screenshot to PNG at exact dimensions via `chrome-devtools`
5. **Present** — Show all options side-by-side, iterate on feedback

### Banner: Quick Size Reference

| Platform | Type | Size (px) |
|----------|------|-----------|
| Facebook | Cover | 820 x 312 |
| Twitter/X | Header | 1500 x 500 |
| LinkedIn | Personal | 1584 x 396 |
| YouTube | Channel art | 2560 x 1440 |
| Instagram | Story | 1080 x 1920 |
| Instagram | Post | 1080 x 1080 |
| Google Ads | Med Rectangle | 300 x 250 |
| Website | Hero | 1920 x 600-1080 |

### Banner: Top Art Styles

| Style | Best For |
|-------|----------|
| Minimalist | SaaS, tech |
| Bold Typography | Announcements |
| Gradient | Modern brands |
| Photo-Based | Lifestyle, e-com |
| Geometric | Tech, fintech |
| Glassmorphism | SaaS, apps |
| Neon/Cyberpunk | Gaming, events |

### Banner: Design Rules

- Safe zones: critical content in central 70-80%
- One CTA per banner, bottom-right, min 44px height
- Max 2 fonts, min 16px body, ≥32px headline
- Text under 20% for ads (Meta penalizes)
- Print: 300 DPI, CMYK, 3-5mm bleed

## Icon Design (Built-in)

15 styles, 12 categories. Gemini 3.1 Pro Preview generates SVG text output.

### Icon: Generate Single Icon

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "settings gear" --style outlined
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "shopping cart" --style filled --color "#6366F1"
python3 ~/.claude/skills/design/scripts/icon/generate.py --name "dashboard" --category navigation --style duotone
```

### Icon: Generate Batch Variations

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "cloud upload" --batch 4 --output-dir ./icons
```

### Icon: Multi-size Export

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "user profile" --sizes "16,24,32,48" --output-dir ./icons
```

### Icon: Top Styles

| Style | Best For |
|-------|----------|
| outlined | UI interfaces, web apps |
| filled | Mobile apps, nav bars |
| duotone | Marketing, landing pages |
| rounded | Friendly apps, health |
| sharp | Tech, fintech, enterprise |
| flat | Material design, Google-style |
| gradient | Modern brands, SaaS |

**Model:** `gemini-3.1-pro-preview` — text-only output (SVG is XML text). No image generation API needed.

## Social Photos (Built-in)

Multi-platform social image design: HTML/CSS → screenshot export. Uses `ui-ux-pro-max`, `brand`, `design-system`, `chrome-devtools` skills.

Load `references/social-photos-design.md` for sizes, templates, best practices.

### Social Photos: Workflow

1. **Orchestrate** — `project-management` skill for TODO tasks; parallel subagents for independent work
2. **Analyze** — Parse prompt: subject, platforms, style, brand context, content elements
3. **Ideate** — 3-5 concepts, present via `AskUserQuestion`
4. **Design** — `/ckm:brand` → `/ckm:design-system` → randomly invoke `/ck:ui-ux-pro-max` OR `/ck:frontend-design`; HTML per idea × size
5. **Export** — `chrome-devtools` or Playwright screenshot at exact px (2x deviceScaleFactor)
6. **Verify** — Use Chrome MCP or `chrome-devtools` skill to visually inspect exported designs; fix layout/styling issues and re-export
7. **Report** — Summary to `plans/reports/` with design decisions
8. **Organize** — Invoke `assets-organizing` skill to sort output files and reports

### Social Photos: Key Sizes

| Platform | Size (px) | Platform | Size (px) |
|----------|-----------|----------|-----------|
| IG Post | 1080×1080 | FB Post | 1200×630 |
| IG Story | 1080×1920 | X Post | 1200×675 |
| IG Carousel | 1080×1350 | LinkedIn | 1200×627 |
| YT Thumb | 1280×720 | Pinterest | 1000×1500 |

## Workflows

### Complete Brand Package

1. **Logo** → `scripts/logo/generate.py` → Generate logo variants
2. **CIP** → `scripts/cip/generate.py --logo ...` → Create deliverable mockups
3. **Presentation** → Load `references/slides-create.md` → Build pitch deck

### New Design System

1. **Brand** (brand skill) → Define colors, typography, voice
2. **Tokens** (design-system skill) → Create semantic token layers
3. **Implement** (ui-styling skill) → Configure Tailwind, shadcn/ui

## References

| Topic | File |
|-------|------|
| Design Routing | `references/design-routing.md` |
| Logo Design Guide | `references/logo-design.md` |
| Logo Styles | `references/logo-style-guide.md` |
| Logo Colors | `references/logo-color-psychology.md` |
| Logo Prompts | `references/logo-prompt-engineering.md` |
| CIP Design Guide | `references/cip-design.md` |
| CIP Deliverables | `references/cip-deliverable-guide.md` |
| CIP Styles | `references/cip-style-guide.md` |
| CIP Prompts | `references/cip-prompt-engineering.md` |
| Slides Create | `references/slides-create.md` |
| Slides Layouts | `references/slides-layout-patterns.md` |
| Slides Template | `references/slides-html-template.md` |
| Slides Copy | `references/slides-copywriting-formulas.md` |
| Slides Strategy | `references/slides-strategies.md` |
| Banner Sizes & Styles | `references/banner-sizes-and-styles.md` |
| Social Photos Guide | `references/social-photos-design.md` |
| Icon Design Guide | `references/icon-design.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/logo/search.py` | Search logo styles, colors, industries |
| `scripts/logo/generate.py` | Generate logos with Gemini AI |
| `scripts/logo/core.py` | BM25 search engine for logo data |
| `scripts/cip/search.py` | Search CIP deliverables, styles, industries |
| `scripts/cip/generate.py` | Generate CIP mockups with Gemini |
| `scripts/cip/render-html.py` | Render HTML presentation from CIP mockups |
| `scripts/cip/core.py` | BM25 search engine for CIP data |
| `scripts/icon/generate.py` | Generate SVG icons with Gemini 3.1 Pro |

## Prerequisites

**Python:** This skill uses Python scripts. On Windows, use `python` instead of `python3` (e.g., `python scripts/logo/search.py` instead of `python3 scripts/logo/search.py`).

Check if Python is installed:
```bash
python3 --version || python --version
```

## Setup

```bash
export GEMINI_API_KEY="your-key"  # https://aistudio.google.com/apikey
pip install google-genai pillow
```

> **Note for Windows:** Use `python` instead of `pip` where needed (e.g., `python -m pip install ...`).

## Integration

**External sub-skills:** brand, design-system, ui-styling
**Related Skills:** frontend-design, ui-ux-pro-max, ai-multimodal, chrome-devtools


## REF: references/banner-sizes-and-styles.md

# Banner Sizes & Art Direction Styles Reference

## Complete Banner Sizes

### Social Media
| Platform | Type | Size (px) | Aspect Ratio |
|----------|------|-----------|--------------|
| Facebook | Cover (desktop) | 820 × 312 | ~2.6:1 |
| Facebook | Cover (mobile) | 640 × 360 | ~16:9 |
| Facebook | Event cover | 1920 × 1080 | 16:9 |
| Twitter/X | Header | 1500 × 500 | 3:1 |
| Twitter/X | Ad banner | 800 × 418 | ~2:1 |
| LinkedIn | Company cover | 1128 × 191 | ~6:1 |
| LinkedIn | Personal banner | 1584 × 396 | 4:1 |
| YouTube | Channel art | 2560 × 1440 | 16:9 |
| YouTube | Safe area | 1546 × 423 | ~3.7:1 |
| Instagram | Stories | 1080 × 1920 | 9:16 |
| Instagram | Post | 1080 × 1080 | 1:1 |
| Pinterest | Pin | 1000 × 1500 | 2:3 |

### Web / Display Ads (Google Display Network)
| Name | Size (px) | Notes |
|------|-----------|-------|
| Medium Rectangle | 300 × 250 | Highest CTR |
| Leaderboard | 728 × 90 | Top of page |
| Wide Skyscraper | 160 × 600 | Sidebar |
| Half Page | 300 × 600 | Premium |
| Large Rectangle | 336 × 280 | High performer |
| Mobile Banner | 320 × 50 | Mobile default |
| Large Mobile | 320 × 100 | Mobile hero |
| Billboard | 970 × 250 | Desktop hero |

### Website
| Type | Size (px) |
|------|-----------|
| Full-width hero | 1920 × 600–1080 |
| Section banner | 1200 × 400 |
| Blog header | 1200 × 628 |
| Email header | 600 × 200 |

### Print
| Type | Size |
|------|------|
| Roll-up | 850mm × 2000mm |
| Step-and-repeat | 8ft × 8ft |
| Vinyl outdoor | 6ft × 3ft |
| Trade show | 33in × 78in |

## 22 Art Direction Styles

1. **Minimalist** — White space dominant, single focal element, 1-2 colors, clean sans-serif
2. **Bold Typography** — Type IS the design; oversized, expressive letterforms fill canvas
3. **Gradient / Color Wash** — Smooth transitions, mesh gradients, chromatic blends
4. **Photo-Based** — Full-bleed photography with text overlay; hero lifestyle imagery
5. **Illustrated / Hand-Drawn** — Custom illustrations, bespoke icons, artisan feel
6. **Geometric / Abstract** — Shapes, lines, grids as primary visual elements
7. **Retro / Vintage** — Distressed textures, muted palettes, serif type, halftone dots
8. **Glassmorphism** — Frosted glass panels, blur backdrop, subtle border glow
9. **3D / Sculptural** — Rendered objects, depth, shadows; product-centric
10. **Neon / Cyberpunk** — Dark backgrounds, glowing neon accents, high contrast
11. **Duotone** — Two-color photo treatment; bold brand color overlay on image
12. **Editorial / Magazine** — Grid-heavy layouts, pull quotes, journalistic composition
13. **Collage / Mixed Media** — Cut-paper textures, photo cutouts, layered elements
14. **Retro Futurism** — Space-age nostalgia, chrome, gradients, optimism
15. **Expressive / Anti-Design** — Chaotic layouts, mixed fonts, deliberate "wrong" composition
16. **Digi-Cute / Kawaii** — Rounded shapes, pastel gradients, pixel art, playful characters
17. **Tactile / Sensory** — Puffy/squishy textures, hyper-real materials, embossed feel
18. **Data / Infographic** — Stats front-and-center, charts, numbers as heroes
19. **Dark Mode / Moody** — Near-black backgrounds, rich jewel tones, high contrast
20. **Flat / Solid Color** — Single background color, clean icons, no gradients
21. **Nature / Organic** — Earthy tones, botanical motifs, sustainable brand feel
22. **Motion-Ready / Kinetic** — Designed for animation; layered elements, loopable

## Design Principles

### Visual Hierarchy (3-Zone Rule)
- **Top**: Logo or main value prop
- **Middle**: Supporting message + visuals
- **Bottom**: CTA (button/QR/URL)

### Safe Zones
- Critical content in central 70-80% of canvas
- Avoid text/CTA within 50-100px of edges
- YouTube: 1546 × 423px safe area inside 2560 × 1440
- Meta/Instagram: central 80% to avoid UI chrome

### CTA Rules
- One CTA per banner
- High contrast vs background
- Bottom-right placement (terminal area)
- Min 44px height for mobile tap targets
- Action verbs: "Get", "Start", "Download", "Claim"

### Typography
- Max 2 typefaces per banner
- Min 16px body, ≥32px headline (digital)
- Min 4.5:1 contrast ratio
- Max 7 words/line, 3 lines for ads

### Text-to-Image Ratio
- Ads: under 20% text (Meta penalizes)
- Social covers: 60/40 image-to-text
- Print: 70pt+ headlines for 3-5m viewing distance

### Print Specs
- 300 DPI minimum (150 DPI for large format)
- 3-5mm bleed all sides
- CMYK color mode
- 1pt per foot viewing distance rule

## Pinterest Research Queries

Use these search queries on Pinterest for art direction references:
- `[purpose] banner design [style]` (e.g., "social media banner minimalist")
- `[platform] cover design inspiration` (e.g., "youtube channel art design")
- `creative banner layout [industry]` (e.g., "creative banner layout tech startup")
- `[style] graphic design 2026` (e.g., "gradient graphic design 2026")
- `banner ad design [product type]` (e.g., "banner ad design saas")


## REF: references/cip-deliverable-guide.md

# CIP Deliverable Guide

## Core Identity

### Primary Logo
- Vector format (SVG, AI, EPS)
- Clear space rules defined
- Scalable from favicon to billboard

### Logo Variations
- Horizontal, vertical, stacked
- Icon/symbol only
- Monochrome versions (black, white, reversed)

## Stationery Set

### Business Card
- Standard: 3.5x2 inches / 85x55mm
- Premium paper stock (300-400gsm)
- Finishes: matte, spot UV, foil, emboss

### Letterhead
- A4 or Letter size
- Header area for logo/contact
- Digital and print versions

### Envelope
- DL, C4, C5 sizes
- Logo on flap or front
- Return address styling

## Office Environment

### Reception Signage
- 3D dimensional letters
- Backlit LED options
- Materials: acrylic, metal, wood

### Wayfinding System
- Consistent icon system
- Clear hierarchy
- ADA compliance

### Wall Graphics
- Mission/values displays
- Large-scale murals
- Window frosting

## Apparel

### Polo Shirt
- Embroidery preferred
- Left chest placement
- Quality fabric (pique cotton)

### Uniforms
- Department color coding
- Name badge integration
- Safety requirements if applicable

## Vehicle Branding

### Car/Sedan
- Door panel branding
- Partial or full wrap
- Contact information visible

### Fleet Vehicles
- Consistent design across fleet
- High visibility contact details
- Professional installation

## Digital Assets

### Social Media
- Profile pictures (icon version)
- Cover images (platform-specific)
- Post templates

### Email Signature
- HTML responsive
- Max 600px width
- Essential contact only

## Events & Promotional

### Trade Show Booth
- Modular design
- Easy assembly
- Key messaging visible

### Promotional Items
- Quality over quantity
- Useful items preferred
- Brand colors prominent


## REF: references/cip-design.md

# CIP Design Reference

Corporate Identity Program design with 50+ deliverables, 20 styles, 20 industries. Generate mockups with Gemini Nano Banana (Flash/Pro).

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/cip/search.py` | Search deliverables, styles, industries; generate CIP briefs |
| `scripts/cip/generate.py` | Generate CIP mockups with Gemini (Flash/Pro) |
| `scripts/cip/render-html.py` | Render HTML presentation from CIP mockups |
| `scripts/cip/core.py` | BM25 search engine for CIP data |

## Commands

### CIP Brief (Start Here)

```bash
python3 ~/.claude/skills/design/scripts/cip/search.py "tech startup" --cip-brief -b "BrandName"
```

### Search Domains

```bash
# Deliverables
python3 ~/.claude/skills/design/scripts/cip/search.py "business card letterhead" --domain deliverable

# Design styles
python3 ~/.claude/skills/design/scripts/cip/search.py "luxury premium elegant" --domain style

# Industry guidelines
python3 ~/.claude/skills/design/scripts/cip/search.py "hospitality hotel" --domain industry

# Mockup contexts
python3 ~/.claude/skills/design/scripts/cip/search.py "office reception" --domain mockup
```

### Generate Mockups

```bash
# With logo (RECOMMENDED - uses image editing)
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo /path/to/logo.png --deliverable "business card" --industry "consulting"

# Full CIP set with logo
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo /path/to/logo.png --industry "consulting" --set

# Pro model for 4K text rendering
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo logo.png --deliverable "business card" --model pro

# Custom deliverables with aspect ratio
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "GreenLeaf" --logo logo.png --industry "organic food" --deliverables "letterhead,packaging,vehicle" --ratio 16:9

# Without logo (AI generates interpretation)
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TechFlow" --deliverable "business card" --no-logo-prompt
```

### Render HTML Presentation

```bash
python3 ~/.claude/skills/design/scripts/cip/render-html.py --brand "TopGroup" --industry "consulting" --images /path/to/cip-output
python3 ~/.claude/skills/design/scripts/cip/render-html.py --brand "TopGroup" --industry "consulting" --images ./topgroup-cip --output presentation.html
```

## Models

- `flash` (default): `gemini-2.5-flash-image` - Fast, cost-effective
- `pro`: `gemini-3-pro-image-preview` - Quality, 4K text rendering

## Deliverable Categories

| Category | Items |
|----------|-------|
| Core Identity | Logo, Logo Variations |
| Stationery | Business Card, Letterhead, Envelope, Folder, Notebook, Pen |
| Security/Access | ID Badge, Lanyard, Access Card |
| Office Environment | Reception Signage, Wayfinding, Meeting Room Signs, Wall Graphics |
| Apparel | Polo Shirt, T-Shirt, Cap, Jacket, Apron |
| Promotional | Tote Bag, Gift Box, USB Drive, Water Bottle, Mug, Umbrella |
| Vehicle | Car Sedan, Van, Truck |
| Digital | Social Media, Email Signature, PowerPoint, Document Templates |
| Product | Packaging Box, Labels, Tags, Retail Display |
| Events | Trade Show Booth, Banner Stand, Table Cover, Backdrop |

## Design Styles

| Style | Colors | Best For |
|-------|--------|----------|
| Corporate Minimal | Navy, White, Blue | Finance, Legal, Consulting |
| Modern Tech | Purple, Cyan, Green | Tech, Startups, SaaS |
| Luxury Premium | Black, Gold, White | Fashion, Jewelry, Hotels |
| Warm Organic | Brown, Green, Cream | Food, Organic, Artisan |
| Bold Dynamic | Red, Orange, Black | Sports, Entertainment |

## HTML Presentation Features

- Hero section with brand name, industry, style, mood
- Deliverable cards with mockup images
- Descriptions: concept, purpose, specifications
- Responsive desktop/mobile, dark theme
- Images embedded as base64 (single-file portable)

## Workflow

1. Generate CIP brief → `scripts/cip/search.py --cip-brief`
2. Generate mockups with logo → `scripts/cip/generate.py --brand --logo --industry --set`
3. Render HTML presentation → `scripts/cip/render-html.py --brand --industry --images`

**Tip:** If no logo exists, use Logo Design (built-in) to generate one first.

## Detailed References

- `references/cip-deliverable-guide.md` - Deliverable specifications
- `references/cip-style-guide.md` - Design style descriptions
- `references/cip-prompt-engineering.md` - AI generation prompts

## Setup

```bash
export GEMINI_API_KEY="your-key"
pip install google-genai pillow
```


## REF: references/cip-prompt-engineering.md

# CIP Mockup Prompt Engineering

## Base Prompt Structure

```
Professional corporate identity mockup photograph showing [DELIVERABLE] for brand '[BRAND_NAME]', [STYLE] design style, using colors [COLORS], [TYPOGRAPHY] typography, logo placement: [PLACEMENT], [MATERIALS] materials with [FINISHES] finish, [CONTEXT] setting, [MOOD] mood, photorealistic product photography, soft natural lighting, high quality professional shot, 8k resolution detailed
```

## Deliverable-Specific Modifiers

### Business Card
```
business card on marble surface, stack of cards, premium paper texture, soft shadows, 45 degree angle
```

### Letterhead
```
letterhead flat lay with envelope and pen, velvet fabric background, brand stationery set, overhead view
```

### Office Signage
```
3D logo signage on office wall, modern lobby interior, backlit LED, brushed metal finish, architectural photography
```

### Vehicle Branding
```
branded vehicle on urban street, 3/4 front angle view, professional car wrap, motion blur background optional
```

### Apparel (Polo/T-Shirt)
```
folded polo shirt on clean background, embroidered logo on chest, premium fabric texture, product photography
```

## Style Modifiers

### Corporate Minimal
```
clean minimal aesthetic, white space, subtle shadows, matte finish, professional
```

### Luxury Premium
```
dark background, dramatic rim lighting, gold accents, premium materials, sophisticated
```

### Modern Tech
```
gradient colors, geometric elements, clean surfaces, futuristic, innovative
```

### Warm Organic
```
natural materials, kraft paper texture, warm lighting, authentic, artisan
```

## Lighting Modifiers

- **Studio:** `professional studio lighting, even illumination`
- **Natural:** `soft natural daylight, window light`
- **Dramatic:** `dramatic rim light, dark background, high contrast`
- **Warm:** `warm golden hour lighting, cozy atmosphere`

## Context Modifiers

- **Marble desk:** `white marble surface, soft shadows, luxury`
- **Wooden table:** `warm wood grain, natural, artisan`
- **Office interior:** `modern office environment, architectural`
- **Flat lay:** `overhead view, organized arrangement`
- **Lifestyle:** `in-use context, human element`

## Quality Modifiers

Always include:
```
photorealistic, professional photography, high quality, 8k resolution, detailed, sharp focus
```

## Negative Prompts (what to avoid)

```
blurry, low quality, distorted text, misspelled, amateur, clipart, cartoon, illustration, watermark
```


## REF: references/cip-style-guide.md

# CIP Design Style Guide

## Corporate Minimal
**Industries:** Finance, Legal, Consulting, Tech
**Colors:** Navy (#0F172A), White (#FFFFFF), Blue accents
**Typography:** Clean sans-serif (Inter, Helvetica)
**Materials:** Premium matte paper, subtle textures
**Finishes:** Matte, spot UV on logo

## Modern Tech
**Industries:** Tech, SaaS, Startups, AI
**Colors:** Purple (#6366F1), Cyan (#0EA5E9), Green (#10B981)
**Typography:** Geometric sans (Outfit, Poppins)
**Materials:** Smooth surfaces, gradient prints
**Finishes:** Gloss, metallic accents

## Luxury Premium
**Industries:** Fashion, Jewelry, Hotels, Fine Dining
**Colors:** Black (#1C1917), Gold (#D4AF37), White
**Typography:** Elegant serif (Playfair), thin sans
**Materials:** Heavy cotton paper, leather, metal
**Finishes:** Gold foil, emboss, deboss, soft-touch

## Classic Traditional
**Industries:** Law Firms, Heritage Brands, Finance
**Colors:** Navy, Burgundy, Gold
**Typography:** Traditional serif (Times, Garamond)
**Materials:** Quality laid paper, wood
**Finishes:** Letterpress, gold emboss

## Warm Organic
**Industries:** Food, Organic, Wellness, Craft
**Colors:** Brown (#8B4513), Green (#228B22), Cream
**Typography:** Friendly serif, organic script
**Materials:** Kraft paper, recycled materials
**Finishes:** Uncoated, natural textures

## Bold Dynamic
**Industries:** Sports, Entertainment, Gaming
**Colors:** Red (#DC2626), Orange (#F97316), Black
**Typography:** Bold condensed sans
**Materials:** High-contrast, metallic
**Finishes:** Gloss, vibrant colors

## Fresh Modern
**Industries:** Healthcare, Wellness, Fintech
**Colors:** Mint (#10B981), Sky (#0EA5E9), White
**Typography:** Modern rounded sans
**Materials:** Light, clean surfaces
**Finishes:** Matte, clean minimal

## Soft Elegant
**Industries:** Beauty, Wedding, Spa, Fashion
**Colors:** Pink (#F472B6), Gold, White
**Typography:** Elegant script, thin sans
**Materials:** Soft-touch, quality paper
**Finishes:** Rose gold foil, emboss

## Color Psychology

| Color | Meaning | Best Use |
|-------|---------|----------|
| Blue | Trust, stability | Finance, Tech, Healthcare |
| Green | Growth, nature | Eco, Wellness, Organic |
| Gold | Luxury, prestige | Premium, Jewelry |
| Red | Energy, passion | Food, Sports |
| Black | Sophistication | Luxury, Fashion |
| White | Clean, minimal | Tech, Healthcare |


## REF: references/design-routing.md

# Design Routing Guide

When to use each design sub-skill.

## Skill Overview

| Skill | Purpose | Key Files |
|-------|---------|-----------|
| brand | Brand identity, voice, assets | SKILL.md + 10 references + 3 scripts |
| design-system | Token architecture, specs | SKILL.md + 7 references + 2 scripts |
| ui-styling | Component implementation | SKILL.md + 7 references + 2 scripts |
| logo-design | AI logo generation (55 styles, 30 palettes) | SKILL.md + 4 references + 2 scripts |
| cip-design | Corporate Identity Program (50 deliverables) | SKILL.md + 3 references + 3 scripts |
| slides | HTML presentations with Chart.js | SKILL.md + 4 references |
| banner-design | Banners for social, ads, web, print (22 styles) | SKILL.md + 1 reference |
| icon-design | SVG icon generation (15 styles, Gemini 3.1 Pro) | SKILL.md + 1 reference + 1 script |

## Routing by Task Type

### Brand Identity Tasks
**→ brand**

- Define brand colors and typography
- Create logo usage guidelines
- Establish brand voice and tone
- Organize and validate assets
- Create messaging frameworks
- Audit brand consistency

### Token System Tasks
**→ design-system**

- Create design tokens JSON
- Generate CSS variables
- Define component specifications
- Map tokens to Tailwind config
- Validate token usage in code
- Document state and variants

### Implementation Tasks
**→ ui-styling**

- Add shadcn/ui components
- Style with Tailwind classes
- Implement dark mode
- Create responsive layouts
- Build accessible components

### Logo Design Tasks
**→ logo-design**

- Create logos with AI (Gemini Nano Banana)
- Search logo styles, color palettes, industry guidelines
- Generate design briefs
- Explore 55+ styles (minimalist, vintage, luxury, geometric, etc.)

### Corporate Identity Program Tasks
**→ cip-design**

- Generate CIP deliverables (business cards, letterheads, signage, vehicles, apparel)
- Create CIP briefs with industry/style analysis
- Generate mockups with/without logo (Gemini Flash/Pro)
- Render HTML presentations from CIP mockups

### Presentation Tasks
**→ slides**

- Create strategic HTML presentations
- Data visualization with Chart.js
- Apply copywriting formulas to slide content
- Use layout patterns and design tokens

### Banner Design Tasks
**→ banner-design**

- Design banners for social media (Facebook, Twitter, LinkedIn, YouTube, Instagram)
- Create ad banners (Google Ads, Meta Ads)
- Website hero banners and headers
- Print banners and covers
- 22 art direction styles (minimalist, bold typography, gradient, glassmorphism, etc.)

### Icon Design Tasks
**→ icon-design**

- Generate SVG icons with AI (Gemini 3.1 Pro Preview)
- Batch icon variations in multiple styles
- Multi-size export (16px, 24px, 32px, 48px)
- 15 styles: outlined, filled, duotone, rounded, sharp, gradient, etc.
- 12 categories: navigation, action, communication, media, commerce, data

## Routing by Question Type

| Question | Skill |
|----------|-------|
| "What color should this be?" | brand |
| "How do I create a token for X?" | design-system |
| "How do I build a button component?" | ui-styling |
| "Is this on-brand?" | brand |
| "Should I use a CSS variable here?" | design-system |
| "How do I add dark mode?" | ui-styling |
| "Create a logo for my brand" | logo-design |
| "Generate business card mockups" | cip-design |
| "Create a pitch deck" | slides |
| "Design brand identity package" | cip-design |
| "What logo style fits my industry?" | logo-design |
| "Design a Facebook cover" | banner-design |
| "Create ad banners for Google" | banner-design |
| "Make a website hero banner" | banner-design |
| "Generate a settings icon" | icon-design |
| "Create SVG icons for my app" | icon-design |
| "Design an icon set" | icon-design |

## Multi-Skill Workflows

### New Project Setup

```
1. brand → Define identity
   - Colors, typography, voice

2. design-system → Create tokens
   - Primitive, semantic, component

3. ui-styling → Implement
   - Configure Tailwind, add components
```

### Design System Migration

```
1. brand → Audit existing
   - Extract brand colors, fonts

2. design-system → Formalize tokens
   - Create three-layer architecture

3. ui-styling → Update code
   - Replace hardcoded values
```

### Component Creation

```
1. design-system → Reference specs
   - Button states, sizes, variants

2. ui-styling → Implement
   - Build with shadcn/ui + Tailwind
```

## Skill Dependencies

```
brand
    ↓ (colors, typography)
design-system
    ↓ (tokens, specs)
ui-styling
    ↓ (components)
Application Code
```

## Quick Commands

**Brand:**
```bash
node .claude/skills/brand/scripts/inject-brand-context.cjs
node .claude/skills/brand/scripts/validate-asset.cjs <path>
```

**Tokens:**
```bash
node .claude/skills/design-system/scripts/generate-tokens.cjs -c tokens.json
node .claude/skills/design-system/scripts/validate-tokens.cjs -d src/
```

**Components:**
```bash
npx shadcn@latest add button card input
```

## When to Use Multiple Skills

Use **all eight** when:
- Complete brand package from scratch (logo → CIP → presentation)

Use **brand + design-system + ui-styling** when:
- Design system setup and implementation

Use **logo-design + cip-design** when:
- Complete brand identity package with deliverable mockups

Use **logo-design + cip-design + slides** when:
- Brand pitch: generate logo, create CIP mockups, build pitch deck

Use **banner-design + brand** when:
- Social media presence: branded banners across all platforms

Use **icon-design + design-system** when:
- Custom icon set matching design tokens and component specs

Use **brand + design-system** when:
- Defining design language without implementation

Use **design-system + ui-styling** when:
- Implementing existing brand in code
- Building component library


## REF: references/icon-design.md

# Icon Design Reference

AI-powered SVG icon generation using Gemini 3.1 Pro Preview. 15 styles, 12 categories, multi-size export.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/icon/generate.py` | Generate SVG icons with Gemini 3.1 Pro Preview |

## Commands

### Generate Single Icon

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "settings gear" --style outlined
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "shopping cart" --style filled --color "#6366F1"
python3 ~/.claude/skills/design/scripts/icon/generate.py --name "dashboard" --category navigation --style duotone
```

### Generate Batch Variations

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "cloud upload" --batch 4 --output-dir ./icons
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "notification bell" --batch 6 --style outlined --output-dir ./icons
```

### Generate Multiple Sizes

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "user profile" --sizes "16,24,32,48" --output-dir ./icons
```

### List Styles/Categories

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --list-styles
python3 ~/.claude/skills/design/scripts/icon/generate.py --list-categories
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--prompt, -p` | Icon description | required |
| `--name, -n` | Icon name (for filename) | - |
| `--style, -s` | Icon style (15 options) | - |
| `--category, -c` | Icon category for context | - |
| `--color` | Primary hex color | currentColor |
| `--size` | Display size in px | 24 |
| `--viewbox` | SVG viewBox size | 24 |
| `--output, -o` | Output file path | auto |
| `--output-dir` | Output directory (batch) | ./icons |
| `--batch` | Number of variations | - |
| `--sizes` | Comma-separated sizes | - |

## Available Styles

| Style | Stroke | Fill | Best For |
|-------|--------|------|----------|
| outlined | 2px | none | UI interfaces, web apps |
| filled | 0 | solid | Mobile apps, nav bars |
| duotone | 0 | dual | Marketing, landing pages |
| thin | 1-1.5px | none | Luxury brands, editorial |
| bold | 3px | none | Headers, hero sections |
| rounded | 2px | none | Friendly apps, health |
| sharp | 2px | none | Tech, fintech, enterprise |
| flat | 0 | solid | Material design, Google-style |
| gradient | 0 | gradient | Modern brands, SaaS |
| glassmorphism | 1px | semi | Modern UI, overlays |
| pixel | 0 | solid | Gaming, retro |
| hand-drawn | varies | none | Artisan, creative |
| isometric | 1-2px | partial | Tech docs, infographics |
| glyph | 0 | solid | System UI, compact |
| animated-ready | 2px | varies | Interactive UI, onboarding |

## Icon Categories

| Category | Icons |
|----------|-------|
| navigation | arrows, menus, home, chevrons |
| action | edit, delete, save, download, upload |
| communication | email, chat, phone, notification |
| media | play, pause, volume, camera |
| file | document, folder, archive, cloud |
| user | person, group, profile, settings |
| commerce | cart, bag, wallet, credit card |
| data | chart, graph, analytics, dashboard |
| development | code, terminal, bug, git, API |
| social | heart, star, bookmark, trophy |
| weather | sun, moon, cloud, rain |
| map | pin, location, compass, globe |

## SVG Best Practices

- **ViewBox**: Use `0 0 24 24` (standard) or `0 0 16 16` (compact)
- **Colors**: Use `currentColor` for CSS inheritance, avoid hardcoded colors
- **Accessibility**: Always include `<title>` element
- **Optimization**: Minimal path nodes, no embedded fonts or raster images
- **Sizing**: Design at 24px, test at 16px and 48px for clarity
- **Stroke**: Use `stroke-linecap="round"` and `stroke-linejoin="round"` for outlined styles

## Model

- **gemini-3.1-pro-preview**: Best thinking, token efficiency, factual consistency
- Text-only output (SVG is XML text) — no image generation API needed
- Supports structured output for consistent SVG formatting

## Workflow

1. Describe icon → `--prompt "settings gear"`
2. Choose style → `--style outlined`
3. Generate → script outputs .svg file
4. Optionally batch → `--batch 4` for variations
5. Multi-size export → `--sizes "16,24,32,48"`

## Setup

```bash
export GEMINI_API_KEY="your-key"
pip install google-genai
```


## REF: references/logo-color-psychology.md

# Logo Color Psychology

## Primary Color Meanings

### Blue
- **Psychology:** Trust, stability, professionalism, calm
- **Industries:** Finance, healthcare, tech, corporate
- **Hex Examples:** Navy #003366, Royal #0055A4, Sky #0EA5E9
- **Pairings:** White, gold, light gray

### Red
- **Psychology:** Energy, passion, urgency, excitement
- **Industries:** Food, sports, entertainment, sales
- **Hex Examples:** Crimson #DC2626, Scarlet #EF4444, Burgundy #9F1239
- **Pairings:** White, black, gold
- **Caution:** Avoid for healthcare (blood connotation)

### Green
- **Psychology:** Growth, nature, health, sustainability
- **Industries:** Eco, wellness, organic, finance (growth)
- **Hex Examples:** Forest #228B22, Sage #2E8B57, Mint #10B981
- **Pairings:** White, brown, blue

### Yellow/Gold
- **Psychology:** Optimism, warmth, luxury, attention
- **Industries:** Food, children, luxury (gold), energy
- **Hex Examples:** Gold #D4AF37, Amber #F59E0B, Lemon #FACC15
- **Pairings:** Black, navy, dark brown

### Purple
- **Psychology:** Creativity, wisdom, luxury, mystery
- **Industries:** Beauty, creative, spiritual, premium
- **Hex Examples:** Royal #7C3AED, Lavender #A78BFA, Deep #581C87
- **Pairings:** Gold, white, pink

### Orange
- **Psychology:** Friendly, energetic, confident, youthful
- **Industries:** Food, sports, entertainment, retail
- **Hex Examples:** Tangerine #F97316, Coral #FB923C, Burnt #EA580C
- **Pairings:** White, navy, dark gray

### Black
- **Psychology:** Sophistication, power, elegance, authority
- **Industries:** Luxury, fashion, tech, premium
- **Pairings:** White, gold, silver
- **Note:** Use for high-end positioning

### White
- **Psychology:** Purity, simplicity, cleanliness, modern
- **Use:** Backgrounds, negative space, contrast
- **Pairings:** Any color (universal neutral)

## Color Combinations by Industry

| Industry | Primary | Secondary | Accent | Avoid |
|----------|---------|-----------|--------|-------|
| Tech | Blue, Purple | Gray, White | Teal, Green | Brown, Beige |
| Healthcare | Blue, Green | Teal, White | Light Purple | Red, Black |
| Finance | Navy, Blue | Gold, Gray | Green | Bright colors |
| Food | Red, Orange | Yellow, Brown | Green | Blue (appetite suppressant) |
| Fashion | Black, White | Gold, Blush | Navy | Neon (unless intentional) |
| Eco | Green, Brown | Beige, Blue | Yellow | Neon, Black |
| Children | Multi-color | Pastels | Bright accents | Dark, muted |

## Color Harmony Types

### Monochromatic
Single color with tints/shades. Safe, cohesive.

### Complementary
Opposite colors (blue-orange). High contrast, vibrant.

### Analogous
Adjacent colors (blue-teal-green). Harmonious, natural.

### Triadic
Three evenly spaced colors. Balanced, dynamic.

## Accessibility Considerations

- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Avoid red-green only indicators
- Test in grayscale for clarity
- Consider colorblind users (~8% of males)

## Quick Reference Palettes

**Tech Professional:**
Primary: #6366F1 | Secondary: #8B5CF6 | Accent: #06B6D4

**Eco Sustainable:**
Primary: #228B22 | Secondary: #2E8B57 | Accent: #DEB887

**Luxury Premium:**
Primary: #1C1917 | Secondary: #D4AF37 | Accent: #FFFFFF

**Healthcare Trust:**
Primary: #0077B6 | Secondary: #00A896 | Accent: #FFFFFF

**Food Warm:**
Primary: #DC2626 | Secondary: #F97316 | Accent: #CA8A04


## REF: references/logo-design.md

# Logo Design Reference

AI-powered logo design with 55+ styles, 30 color palettes, 25 industry guides. Uses Gemini Nano Banana models.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/logo/search.py` | Search styles, colors, industries; generate design briefs |
| `scripts/logo/generate.py` | Generate logos with Gemini Nano Banana |
| `scripts/logo/core.py` | BM25 search engine for logo data |

## Commands

### Design Brief (Start Here)

```bash
python3 ~/.claude/skills/design/scripts/logo/search.py "tech startup modern" --design-brief -p "BrandName"
```

### Search Domains

```bash
# Styles
python3 ~/.claude/skills/design/scripts/logo/search.py "minimalist clean" --domain style

# Color palettes
python3 ~/.claude/skills/design/scripts/logo/search.py "tech professional" --domain color

# Industry guidelines
python3 ~/.claude/skills/design/scripts/logo/search.py "healthcare medical" --domain industry
```

### Generate Logo

**ALWAYS** use white background for output logos.

```bash
python3 ~/.claude/skills/design/scripts/logo/generate.py --brand "TechFlow" --style minimalist --industry tech
python3 ~/.claude/skills/design/scripts/logo/generate.py --prompt "coffee shop vintage badge" --style vintage
```

Options: `--style`, `--industry`, `--prompt`

## Available Styles

| Category | Styles |
|----------|--------|
| General | Minimalist, Wordmark, Lettermark, Pictorial Mark, Abstract Mark, Mascot, Emblem, Combination Mark |
| Aesthetic | Vintage/Retro, Art Deco, Luxury, Playful, Corporate, Organic, Neon, Grunge, Watercolor |
| Modern | Gradient, Flat Design, 3D/Isometric, Geometric, Line Art, Duotone, Motion-Ready |
| Clever | Negative Space, Monoline, Split/Fragmented, Responsive/Adaptive |

## Color Psychology

| Color | Psychology | Best For |
|-------|------------|----------|
| Blue | Trust, stability | Finance, tech, healthcare |
| Green | Growth, natural | Eco, wellness, organic |
| Red | Energy, passion | Food, sports, entertainment |
| Gold | Luxury, premium | Fashion, jewelry, hotels |
| Purple | Creative, innovative | Beauty, creative, tech |

## Industry Defaults

| Industry | Style | Colors | Typography |
|----------|-------|--------|------------|
| Tech | Minimalist, Abstract | Blues, purples, gradients | Geometric sans |
| Healthcare | Professional, Line Art | Blues, greens, teals | Clean sans |
| Finance | Corporate, Emblem | Navy, gold | Serif or clean sans |
| Food | Vintage Badge, Mascot | Warm reds, oranges | Friendly, script |
| Fashion | Wordmark, Luxury | Black, gold, white | Elegant serif |

## Workflow

1. Generate design brief → `scripts/logo/search.py --design-brief`
2. Generate logo variations → `scripts/logo/generate.py --brand --style --industry`
3. Ask user about HTML preview → `AskUserQuestion` tool
4. If yes, invoke `/ui-ux-pro-max` for HTML gallery

## Detailed References

- `references/logo-style-guide.md` - Detailed style descriptions
- `references/logo-color-psychology.md` - Color meanings and combinations
- `references/logo-prompt-engineering.md` - AI generation prompts

## Setup

```bash
export GEMINI_API_KEY="your-key"
pip install google-genai
```


## REF: references/logo-prompt-engineering.md

# Logo AI Prompt Engineering

## Core Prompt Structure

```
Professional logo design for [brand/industry]:
[Visual description]
Style: [style keywords]
Colors: [color palette]
Requirements: [technical specs]
```

## Effective Keywords by Style

### Minimalist
```
minimalist, clean lines, simple geometric shapes, essential elements only,
high white space, flat design, single color, modern, uncluttered,
negative space, subtle, refined
```

### Vintage/Retro
```
vintage, retro, heritage, established, classic, nostalgic, weathered,
distressed texture, badge style, hand-lettered, craft, artisan,
sepia tones, muted colors, aged paper effect
```

### Luxury/Premium
```
luxury, elegant, sophisticated, premium, refined, exclusive, high-end,
gold accents, metallic, minimal, tasteful, upscale, prestige,
thin lines, serif typography, foil effect
```

### Modern/Tech
```
modern, innovative, digital, tech-forward, sleek, futuristic,
gradient colors, geometric, abstract, dynamic, cutting-edge,
clean sans-serif, circuit-like, data visualization
```

### Playful/Fun
```
playful, fun, colorful, friendly, approachable, cheerful, whimsical,
bouncy, rounded shapes, bright colors, cartoon-like, energetic,
bubbly, hand-drawn elements
```

### Organic/Natural
```
organic, natural, flowing, botanical, eco-friendly, sustainable,
earth tones, leaf elements, hand-drawn, imperfect lines, growth,
green, nature-inspired, biophilic
```

## Negative Prompts (What to Avoid)

Always include to prevent unwanted results:
```
NOT: photorealistic, 3D render with realistic textures, photograph,
stock image, clip art, multiple logos, busy background, text watermarks,
low quality, blurry, distorted, complex detailed patterns
```

## Industry-Specific Prompts

### Tech Startup
```
Modern tech company logo, abstract geometric mark, gradient blue to purple,
clean minimal design, innovative feel, scalable vector style,
professional quality, silicon valley aesthetic
```

### Healthcare
```
Healthcare medical logo, clean professional design, cross or heart symbol,
calming blue and teal colors, trustworthy appearance, caring feel,
simple scalable mark, HIPAA-appropriate conservative style
```

### Restaurant/Food
```
Restaurant logo, warm inviting colors, appetizing feel, vintage badge style,
chef or utensil iconography, friendly welcoming design, rustic charm,
established look, readable at small sizes
```

### Fashion Brand
```
Fashion brand logo, elegant sophisticated wordmark, luxury aesthetic,
black and gold color scheme, thin refined typography, haute couture feel,
minimal exclusive design, high-end positioning
```

### Eco/Sustainable
```
Eco-friendly sustainable brand logo, organic natural elements, leaf motif,
earth green and brown colors, growth symbolism, environmental awareness,
clean modern yet natural feel, recyclable-look design
```

## Technical Requirements to Include

### Scalability
```
vector-style, scalable at any size, clear silhouette,
works as favicon, recognizable small scale, simple shapes
```

### Versatility
```
works on light and dark backgrounds, single color version possible,
horizontal and stacked layouts, brand mark can stand alone
```

### Quality
```
professional quality, print-ready, high resolution,
crisp edges, balanced composition, centered design
```

## Prompt Templates

### Quick Generation
```
Professional [industry] logo, [style] design, [color] colors,
clean modern aesthetic, scalable vector style
```

### Detailed Brief
```
Professional logo design for [brand name], a [industry] company.

Visual style: [style keywords]
Primary colors: [hex codes]
Mood: [emotional keywords]
Symbols: [iconography hints]

Technical: Vector-style illustration, scalable, works in single color,
centered on plain background, no text unless specified.
```

### Variation Request
```
Alternative version of [brand] logo:
Keep: [elements to preserve]
Change: [elements to modify]
Style direction: [new style keywords]
```

## Common Pitfalls

1. **Too detailed** - AI generates complexity; request "simple"
2. **Unclear background** - Specify "plain white background"
3. **Text issues** - AI struggles with text; generate mark separately
4. **Wrong aspect** - Specify "1:1 square" or "horizontal"
5. **Realistic style** - Add "illustration, vector-style, not photorealistic"


## REF: references/logo-style-guide.md

# Logo Style Guide

## Core Logo Types

### 1. Wordmark (Logotype)
Text-only logo using custom typography.
- **Best for:** Established brands, distinctive names
- **Examples:** Google, Coca-Cola, FedEx
- **Typography:** Custom letterforms, unique kerning
- **Tip:** Name must be memorable and pronounceable

### 2. Lettermark (Monogram)
Initials or abbreviated letters.
- **Best for:** Long company names, professional firms
- **Examples:** IBM, HBO, NASA
- **Typography:** Bold geometric sans-serif
- **Tip:** Works well for brands with 2-4 letter abbreviations

### 3. Pictorial Mark (Brand Mark)
Standalone icon or symbol.
- **Best for:** Global brands with recognition
- **Examples:** Apple, Twitter, Target
- **Design:** Simple, scalable, memorable shape
- **Tip:** Requires brand equity to work alone

### 4. Abstract Mark
Non-representational geometric shapes.
- **Best for:** Tech companies, differentiating brands
- **Examples:** Pepsi, Airbnb, Spotify
- **Design:** Unique shape conveying brand values
- **Tip:** Can represent complex ideas simply

### 5. Mascot
Character representing the brand.
- **Best for:** Family brands, sports teams, food
- **Examples:** KFC, Pringles, Michelin
- **Design:** Friendly, expressive, versatile
- **Tip:** Can evolve with brand while maintaining recognition

### 6. Emblem
Symbol enclosed within a shape.
- **Best for:** Traditional brands, organizations
- **Examples:** Starbucks, Harley-Davidson, NFL
- **Design:** Badge, seal, or crest style
- **Tip:** May have scalability challenges

### 7. Combination Mark
Icon + text in unified design.
- **Best for:** New brands, versatile applications
- **Examples:** Burger King, Lacoste, Doritos
- **Design:** Lockup with flexible arrangements
- **Tip:** Most versatile, can separate elements later

## Aesthetic Styles

### Minimalist
- Clean lines, essential elements only
- High white space, simple geometry
- Limited color palette (1-2 colors)
- **Use:** Tech, professional services, modern brands

### Vintage/Retro
- Nostalgic, heritage feel
- Distressed textures, muted colors
- Script or slab serif typography
- **Use:** Craft brands, artisan products

### Luxury/Premium
- Elegant, refined aesthetic
- Gold, black, white color scheme
- Thin serifs or sophisticated sans
- **Use:** Fashion, jewelry, high-end services

### Geometric
- Mathematical precision
- Circles, triangles, squares
- Perfect symmetry
- **Use:** Architecture, tech, modern brands

### Organic/Natural
- Flowing, imperfect lines
- Earth tones, natural colors
- Hand-drawn feel
- **Use:** Eco brands, wellness, organic products

### Gradient/Modern
- Color transitions, vibrant palettes
- Dimensional depth
- Contemporary feel
- **Use:** Apps, tech startups, digital products

## Style Selection Matrix

| Brand Type | Primary Style | Secondary Options |
|------------|---------------|-------------------|
| Tech Startup | Minimalist, Abstract | Geometric, Gradient |
| Law Firm | Wordmark, Emblem | Lettermark |
| Restaurant | Mascot, Badge | Vintage, Combination |
| Fashion | Wordmark, Luxury | Monogram, Line Art |
| Healthcare | Professional, Line Art | Abstract, Combination |
| Non-Profit | Combination, Emblem | Organic, Hand-Drawn |

## Scalability Checklist

- [ ] Recognizable at 16x16 pixels (favicon)
- [ ] Clear at business card size
- [ ] Works in single color
- [ ] Maintains clarity in black/white
- [ ] No tiny details that disappear when scaled


## REF: references/slides-copywriting-formulas.md

# Copywriting Formulas

25 formulas for persuasive slide copy.

## Core Formulas

### PAS (Problem-Agitate-Solution)
**Use:** Problem slides, pain points
**Components:** Problem → Agitate → Solution
**Template:** "[Pain point]? Every [time frame], [consequence]. [Solution] fixes this."

### AIDA (Attention-Interest-Desire-Action)
**Use:** CTAs, closing slides
**Components:** Attention → Interest → Desire → Action
**Template:** "[Bold statement]. [Benefit detail]. [Social proof]. [CTA]."

### FAB (Features-Advantages-Benefits)
**Use:** Feature slides, product showcases
**Components:** Feature → Advantage → Benefit
**Template:** "[Feature] lets you [advantage], so you can [benefit]."

### Cost of Inaction
**Use:** Agitation slides, urgency
**Components:** Status Quo → Loss → Time Decay
**Template:** "Without [solution], you're losing [amount] every [timeframe]."

### Before-After-Bridge
**Use:** Transformation slides, case studies
**Components:** Before → After → Bridge
**Template:** "[Pain point before]. [Desired state after]. [Your solution] is the bridge."

## Formula-to-Slide Mapping

| Slide Type | Primary Formula | Emotion |
|------------|-----------------|---------|
| Title/Hook | AIDA, Hook | curiosity |
| Problem | PAS, Agitate | frustration |
| Cost/Risk | Cost of Inaction | fear |
| Solution | FAB, BAB | hope |
| Features | FAB | confidence |
| Traction | Proof Stack | trust |
| Social Proof | Testimonial | trust |
| Pricing | Value Stack | confidence |
| CTA | AIDA, Urgency | urgency |

## Headline Patterns

### Power Words
- "Stop [bad thing]"
- "Get [desired result] in [timeframe]"
- "The [adjective] way to [action]"
- "Why [audience] choose [product]"
- "[Number] ways to [achieve goal]"

### Contrast Patterns
- "[Old way] is dead. Meet [new way]."
- "Don't [bad action]. Instead, [good action]."
- "From [pain point] to [benefit]."

### Social Proof Patterns
- "[Number]+ [users/companies] trust [product]"
- "Join [notable company] and [notable company]"
- "As seen in [publication]"

## Search Commands

```bash
# Find formula for slide type
python .claude/skills/design-system/scripts/search-slides.py "problem agitation" -d copy

# Get emotion-appropriate formula
python .claude/skills/design-system/scripts/search-slides.py "urgency cta" -d copy
```

## Quick Reference

| Need | Use Formula |
|------|------------|
| Create urgency | Cost of Inaction, Scarcity |
| Build trust | Social Proof, Testimonial |
| Show value | FAB, Value Stack |
| Drive action | AIDA, CTA |
| Tell story | BAB, Story Arc |
| Present data | Proof Stack |


## REF: references/slides-create.md

Invoke `slides` skill to create persuasive HTML slides using design tokens, Chart.js, and the slide knowledge database.

## Task
<task>$ARGUMENTS</task>


## REF: references/slides-html-template.md

# HTML Slide Template

Complete HTML structure with navigation, tokens, and Chart.js integration.

## Base Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation Title</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <style>
        /* Paste embed-tokens.cjs output here */
        :root {
            --color-primary: #FF6B6B;
            --color-background: #0D0D0D;
            /* ... more tokens */
        }

        /* Base slide styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: var(--color-background);
            color: #fff;
            font-family: var(--typography-font-body, 'Inter', sans-serif);
            overflow: hidden;
        }

        /* 16:9 Aspect Ratio Container (desktop) */
        .slide-deck {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }

        @media (min-width: 769px) {
            .slide-deck {
                /* Lock to 16:9 — letterbox if viewport ratio differs */
                max-width: calc(100vh * 16 / 9);
                max-height: calc(100vw * 9 / 16);
                margin: auto;
                position: absolute;
                inset: 0;
            }
        }

        .slide {
            position: absolute;
            width: 100%; height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 60px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.4s;
            background: var(--color-background);
            overflow: hidden; /* Prevent content overflow */
        }

        .slide.active { opacity: 1; visibility: visible; }

        /* Slide inner wrapper — constrains content within safe area */
        .slide-content {
            width: 100%;
            max-width: 100%;
            max-height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 16px;
        }

        /* Typography */
        h1, h2 { font-family: var(--typography-font-heading, 'Space Grotesk', sans-serif); }
        .slide-title {
            font-size: clamp(32px, 6vw, 80px);
            background: var(--primitive-gradient-primary, linear-gradient(135deg, #FF6B6B, #FF8E53));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.1;
        }

        /* ===== RESPONSIVE BREAKPOINTS ===== */

        /* Tablet (portrait) */
        @media (max-width: 768px) {
            .slide { padding: 32px 24px; }
            .slide-title { font-size: clamp(28px, 5vw, 48px); }
            h2 { font-size: clamp(20px, 4vw, 32px); }
            p, li { font-size: clamp(14px, 2.5vw, 18px); }
        }

        /* Mobile */
        @media (max-width: 480px) {
            .slide { padding: 24px 16px; }
            .slide-title { font-size: clamp(22px, 6vw, 36px); }
            h2 { font-size: clamp(18px, 4.5vw, 28px); }
            p, li { font-size: clamp(12px, 3vw, 16px); }
            .nav-controls { bottom: 16px; gap: 12px; }
            .nav-btn { width: 32px; height: 32px; font-size: 14px; }
        }

        /* Navigation */
        .progress-bar {
            position: fixed;
            top: 0; left: 0;
            height: 3px;
            background: var(--color-primary);
            transition: width 0.3s;
            z-index: 1000;
        }
        .nav-controls {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 1000;
        }
        .nav-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: #fff;
            width: 40px; height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.2); }
        .slide-counter { color: rgba(255,255,255,0.6); font-size: 14px; }
    </style>
</head>
<body>
    <!-- Progress Bar -->
    <div class="progress-bar" id="progressBar"></div>

    <!-- Slide Deck Container (16:9 on desktop) -->
    <div class="slide-deck">

    <!-- Slides -->
    <div class="slide active">
        <div class="slide-content">
            <h1 class="slide-title">Title Slide</h1>
            <p>Subtitle or tagline</p>
        </div>
    </div>

    <!-- More slides... (always wrap content in .slide-content) -->

    </div><!-- /.slide-deck -->

    <!-- Navigation -->
    <div class="nav-controls">
        <button class="nav-btn" onclick="prevSlide()">←</button>
        <span class="slide-counter"><span id="current">1</span> / <span id="total">9</span></span>
        <button class="nav-btn" onclick="nextSlide()">→</button>
    </div>

    <script>
        let current = 1;
        const total = document.querySelectorAll('.slide').length;
        document.getElementById('total').textContent = total;

        function showSlide(n) {
            if (n < 1) n = 1;
            if (n > total) n = total;
            current = n;
            document.querySelectorAll('.slide').forEach((s, i) => {
                s.classList.toggle('active', i === n - 1);
            });
            document.getElementById('current').textContent = n;
            document.getElementById('progressBar').style.width = (n / total * 100) + '%';
        }

        function nextSlide() { showSlide(current + 1); }
        function prevSlide() { showSlide(current - 1); }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-controls')) nextSlide();
        });

        showSlide(1);
    </script>
</body>
</html>
```

## Chart.js Integration

```html
<div class="chart-container" style="width: min(80%, 600px); height: clamp(200px, 40vh, 350px);">
    <canvas id="revenueChart"></canvas>
</div>

<script>
new Chart(document.getElementById('revenueChart'), {
    type: 'line', // or 'bar', 'doughnut', 'radar'
    data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'MRR ($K)',
            data: [5, 12, 28, 45],
            borderColor: '#FF6B6B',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#B8B8D0' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#B8B8D0' } }
        }
    }
});
</script>
```

## Animation Classes

```css
/* Fade Up */
.animate-fade-up {
    animation: fadeUp 0.6s ease-out forwards;
    opacity: 0;
}
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Count Animation */
.animate-count { animation: countUp 1s ease-out forwards; }

/* Scale */
.animate-scale {
    animation: scaleIn 0.5s ease-out forwards;
}
@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

/* Stagger Children */
.animate-stagger > * {
    opacity: 0;
    animation: fadeUp 0.5s ease-out forwards;
}
.animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
.animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
.animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
.animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }
```

## Background Images

```html
<div class="slide slide-with-bg" style="background-image: url('https://images.pexels.com/...')">
    <div class="overlay" style="background: linear-gradient(135deg, rgba(13,13,13,0.9), rgba(13,13,13,0.7))"></div>
    <div class="content" style="position: relative; z-index: 1;">
        <!-- Slide content -->
    </div>
</div>
```

## CSS Variables Reference

| Variable | Usage |
|----------|-------|
| `--color-primary` | Brand primary (CTA, highlights) |
| `--color-background` | Slide background |
| `--color-secondary` | Secondary elements |
| `--primitive-gradient-primary` | Title gradients |
| `--typography-font-heading` | Headlines |
| `--typography-font-body` | Body text |


## REF: references/slides-layout-patterns.md

# Layout Patterns

25 slide layouts with CSS structures and animation classes.

## Layout Selection by Use Case

| Layout | Use Case | Animation |
|--------|----------|-----------|
| Title Slide | Opening/first impression | `animate-fade-up` |
| Problem Statement | Establish pain point | `animate-stagger` |
| Solution Overview | Introduce solution | `animate-scale` |
| Feature Grid | Show capabilities (3-6 cards) | `animate-stagger` |
| Metrics Dashboard | Display KPIs (3-4 metrics) | `animate-stagger-scale` |
| Comparison Table | Compare options | `animate-fade-up` |
| Timeline Flow | Show progression | `animate-stagger` |
| Team Grid | Introduce people | `animate-stagger` |
| Quote Testimonial | Customer endorsement | `animate-fade-up` |
| Two Column Split | Compare/contrast | `animate-fade-up` |
| Big Number Hero | Single powerful metric | `animate-count` |
| Product Screenshot | Show product UI | `animate-scale` |
| Pricing Cards | Present tiers | `animate-stagger` |
| CTA Closing | Drive action | `animate-pulse` |

## CSS Structures

### Title Slide
```css
.slide-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}
```

### Two Column Split
```css
.slide-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
}
@media (max-width: 768px) {
    .slide-split { grid-template-columns: 1fr; gap: 24px; }
}
```

### Feature Grid (3 columns)
```css
.slide-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}
@media (max-width: 768px) {
    .slide-features { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
@media (max-width: 480px) {
    .slide-features { grid-template-columns: 1fr; }
}
```

### Metrics Dashboard (4 columns)
```css
.slide-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}
@media (max-width: 768px) {
    .slide-metrics { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
    .slide-metrics { grid-template-columns: 1fr; }
}
```

## Component Variants

### Card Styles
| Style | CSS Class | Use For |
|-------|-----------|---------|
| Icon Left | `.card-icon-left` | Features with icons |
| Accent Bar | `.card-accent-bar` | Highlighted features |
| Metric Card | `.card-metric` | Numbers/stats |
| Avatar Card | `.card-avatar` | Team members |
| Pricing Card | `.card-pricing` | Price tiers |

### Metric Styles
| Style | Effect |
|-------|--------|
| `gradient-number` | Gradient text on numbers |
| `oversized` | Extra large (120px+) |
| `sparkline` | Small inline chart |
| `funnel-numbers` | Conversion stages |

## Visual Treatments

| Treatment | When to Use |
|-----------|-------------|
| `gradient-glow` | Title slides, CTAs |
| `subtle-border` | Problem statements |
| `icon-top` | Feature grids |
| `screenshot-shadow` | Product screenshots |
| `popular-highlight` | Pricing (scale 1.05) |
| `bg-overlay` | Background images |
| `contrast-pair` | Before/after |
| `logo-grayscale` | Client logos |

## Search Commands

```bash
# Find layout for specific use
python .claude/skills/design-system/scripts/search-slides.py "metrics dashboard" -d layout

# Contextual recommendation
python .claude/skills/design-system/scripts/search-slides.py "traction slide" \
  --context --position 4 --total 10
```

## Layout Decision Flow

```
1. What's the slide goal?
   └─> Search layout-logic.csv

2. What emotion should it trigger?
   └─> Search color-logic.csv

3. What's the content type?
   └─> Search typography.csv

4. Should it break pattern?
   └─> Check position (1/3, 2/3) → Use full-bleed
```


## REF: references/slides-strategies.md

# Slide Strategies

15 proven deck structures with emotion arcs.

## Strategy Selection

| Strategy | Slides | Goal | Audience |
|----------|--------|------|----------|
| YC Seed Deck | 10-12 | Raise seed funding | VCs |
| Guy Kawasaki | 10 | Pitch in 20 min | Investors |
| Series A | 12-15 | Raise Series A | Growth VCs |
| Product Demo | 5-8 | Demonstrate value | Prospects |
| Sales Pitch | 7-10 | Close deal | Qualified leads |
| Nancy Duarte Sparkline | Varies | Transform perspective | Any |
| Problem-Solution-Benefit | 3-5 | Quick persuasion | Time-pressed |
| QBR | 10-15 | Update stakeholders | Leadership |
| Team All-Hands | 8-12 | Align team | Employees |
| Conference Talk | 15-25 | Thought leadership | Attendees |
| Workshop | 20-40 | Teach skills | Learners |
| Case Study | 8-12 | Prove value | Prospects |
| Competitive Analysis | 6-10 | Strategic decisions | Internal |
| Board Meeting | 15-20 | Update board | Directors |
| Webinar | 20-30 | Generate leads | Registrants |

## Common Structures

### YC Seed Deck (10 slides)
1. Title/Hook
2. Problem
3. Solution
4. Traction
5. Market
6. Product
7. Business Model
8. Team
9. Financials
10. The Ask

**Emotion arc:** curiosity→frustration→hope→confidence→trust→urgency

### Sales Pitch (9 slides)
1. Personalized Hook
2. Their Problem
3. Cost of Inaction
4. Your Solution
5. Proof/Case Studies
6. Differentiators
7. Pricing/ROI
8. Objection Handling
9. CTA + Next Steps

**Emotion arc:** connection→frustration→fear→hope→trust→confidence→urgency

### Product Demo (6 slides)
1. Hook/Problem
2. Solution Overview
3. Live Demo/Screenshots
4. Key Features
5. Benefits/Pricing
6. CTA

**Emotion arc:** curiosity→frustration→hope→confidence→urgency

## Duarte Sparkline Pattern

Alternate between "What Is" (current pain) and "What Could Be" (better future):

```
What Is → What Could Be → What Is → What Could Be → New Bliss
(pain)     (hope)         (pain)     (hope)         (resolution)
```

Pattern breaks at 1/3 and 2/3 positions create engagement peaks.

## Search Commands

```bash
# Find strategy by goal
python .claude/skills/design-system/scripts/search-slides.py "investor pitch" -d strategy

# Get emotion arc
python .claude/skills/design-system/scripts/search-slides.py "series a funding" -d strategy --json
```

## Matching Strategy to Context

| Context | Recommended Strategy |
|---------|---------------------|
| Raising money | YC Seed, Series A, Guy Kawasaki |
| Selling product | Sales Pitch, Product Demo |
| Internal update | QBR, All-Hands, Board Meeting |
| Public speaking | Conference Talk, Workshop |
| Proving value | Case Study, Competitive Analysis |
| Lead generation | Webinar |


## REF: references/slides.md

# Slides Reference

Strategic HTML presentation design with Chart.js data visualization, design tokens, responsive layouts, and copywriting formulas.

## Usage

Activate the `design` skill and specify slides task, e.g. "create a pitch deck".

## Knowledge Base

| Topic | File | Purpose |
|-------|------|---------|
| Creation Guide | `references/slides-create.md` | Step-by-step slide creation workflow |
| Layout Patterns | `references/slides-layout-patterns.md` | Slide layout templates and grid systems |
| HTML Template | `references/slides-html-template.md` | Base HTML structure for presentations |
| Copywriting | `references/slides-copywriting-formulas.md` | AIDA, PAS, FAB for slide content |
| Strategies | `references/slides-strategies.md` | Contextual strategies by presentation type |

## When to Use

- Marketing presentations and pitch decks
- Data-driven slides with Chart.js visualizations
- Strategic slide design with layout patterns
- Copywriting-optimized presentation content
- Investor decks, sales presentations, team updates

## Key Features

- **Chart.js Integration**: Bar, line, pie, doughnut, radar charts
- **Design Tokens**: Consistent spacing, colors, typography
- **Responsive**: Works on desktop and mobile
- **Copywriting**: Built-in AIDA, PAS, FAB formulas
- **Layout Patterns**: Hero, split, grid, comparison, timeline

## Workflow

1. Parse presentation type from user request
2. Load `references/slides-create.md` for creation guide
3. Select layout patterns from `references/slides-layout-patterns.md`
4. Apply copywriting formulas from `references/slides-copywriting-formulas.md`
5. Use HTML template from `references/slides-html-template.md`
6. Apply strategy from `references/slides-strategies.md`


## REF: references/social-photos-design.md

# Social Photos Design Guide

Design social media images via HTML/CSS rendering + screenshot export. Orchestrates `ui-ux-pro-max`, `brand`, `design-system`, and `chrome-devtools` skills.

## Platform Sizes

| Platform | Type | Size (px) | Aspect |
|----------|------|-----------|--------|
| Instagram | Post | 1080 x 1080 | 1:1 |
| Instagram | Story/Reel | 1080 x 1920 | 9:16 |
| Instagram | Carousel | 1080 x 1350 | 4:5 |
| Facebook | Post | 1200 x 630 | ~1.9:1 |
| Facebook | Story | 1080 x 1920 | 9:16 |
| Twitter/X | Post | 1200 x 675 | 16:9 |
| Twitter/X | Card | 800 x 418 | ~1.91:1 |
| LinkedIn | Post | 1200 x 627 | ~1.91:1 |
| LinkedIn | Article | 1200 x 644 | ~1.86:1 |
| Pinterest | Pin | 1000 x 1500 | 2:3 |
| YouTube | Thumbnail | 1280 x 720 | 16:9 |
| TikTok | Cover | 1080 x 1920 | 9:16 |
| Threads | Post | 1080 x 1080 | 1:1 |

## Workflow

### Step 1: Activate Project Management

Invoke `project-management` skill to create persistent TODO tasks via Claude's native task orchestration. Break down into:
- Requirement analysis task
- Idea generation task(s)
- HTML design task(s) — can parallelize per size/variant
- Screenshot export task(s) — can parallelize per file
- Report generation task

Spawn parallel subagents for independent tasks (e.g., multiple HTML files for different sizes).

### Step 2: Analyze Requirements

Parse user input for:
- **Subject/topic** — what the social photo represents
- **Target platforms** — which sizes needed (default: Instagram Post 1:1 + Story 9:16)
- **Visual style** — minimalist, bold, gradient, photo-based, etc.
- **Brand context** — read from `docs/brand-guidelines.md` if exists
- **Content elements** — headline, subtext, CTA, images, icons
- **Quantity** — how many variations (default: 3)

### Step 3: Generate Ideas

Create 3-5 concept ideas that:
- Match the input prompt/requirements
- Consider platform-specific best practices
- Vary in composition, color, typography approach
- Align with brand guidelines if available

Present ideas to user via `AskUserQuestion` for approval before designing.

### Step 4: Design HTML Files

Activate these skills in sequence:

1. **`/ckm:brand`** — Extract brand colors, fonts, voice from user's project
2. **`/ckm:design-system`** — Get design tokens (spacing, typography scale, color palette)
3. **Randomly invoke ONE of:** `/ck:ui-ux-pro-max` OR `/ck:frontend-design` — for layout, hierarchy, visual balance. Pick one at random each run for design variety.

For each approved idea + each target size, create an HTML file:

```
output/social-photos/
├── idea-1-instagram-post-1080x1080.html
├── idea-1-instagram-story-1080x1920.html
├── idea-2-instagram-post-1080x1080.html
├── idea-2-instagram-story-1080x1920.html
└── ...
```

#### HTML Design Rules

- **Viewport** — Set exact pixel dimensions matching target size
- **Self-contained** — Inline all CSS, embed fonts via Google Fonts CDN
- **No scrolling** — Everything fits in one viewport
- **High contrast** — Text readable at thumbnail size
- **Brand-aligned** — Use extracted brand colors/fonts
- **Safe zones** — Critical content within central 80% area
- **Typography** — Min 24px for headlines, min 16px for body at 1080px width
- **Visual hierarchy** — One focal point, clear reading flow

#### HTML Template Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width={WIDTH}, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family={FONT}&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: {WIDTH}px;
      height: {HEIGHT}px;
      overflow: hidden;
      font-family: '{FONT}', sans-serif;
    }
    .canvas {
      width: {WIDTH}px;
      height: {HEIGHT}px;
      position: relative;
      /* Background: gradient, solid, or image */
    }
    /* Design tokens from brand/design-system */
  </style>
</head>
<body>
  <div class="canvas">
    <!-- Content layers -->
  </div>
</body>
</html>
```

### Step 5: Screenshot Export

Use Chrome headless, `chrome-devtools` skill, or Playwright/Puppeteer to capture exact-size screenshots.

**IMPORTANT:** Always add a delay (3-5s) after page load for fonts/images to fully render before capture.

#### Option A: Chrome Headless CLI (Recommended — zero dependencies)

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DELAY=5  # seconds for fonts/images to load

"$CHROME" \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --window-size="${WIDTH},${HEIGHT}" \
  --virtual-time-budget=$((DELAY * 1000)) \
  --screenshot="output.png" \
  "file:///path/to/file.html"
```

Key flags:
- `--virtual-time-budget=5000` — waits 5s virtual time for assets (Google Fonts, images) to load
- `--hide-scrollbars` — prevents scrollbar artifacts in screenshots
- `--window-size=WxH` — sets exact pixel dimensions

#### Option B: chrome-devtools skill

Invoke `/chrome-devtools` with instructions to:
1. Open each HTML file in browser
2. Set viewport to exact target dimensions
3. Wait 3-5s for fonts/images to fully load
4. Screenshot full page to PNG
5. Save to `output/social-photos/exports/`

#### Option C: Playwright script

```javascript
const { chromium } = require('playwright');

async function captureScreenshots(htmlFiles) {
  const browser = await chromium.launch();

  for (const file of htmlFiles) {
    const [width, height] = file.match(/(\d+)x(\d+)/).slice(1).map(Number);

    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(`file://${file}`, { waitUntil: 'networkidle' });
    // Wait for fonts/images to fully render
    await page.waitForTimeout(3000);

    const outputPath = file.replace('.html', '.png').replace('social-photos/', 'social-photos/exports/');
    await page.screenshot({ path: outputPath, type: 'png' });
    await page.close();
  }

  await browser.close();
}
```

#### Option D: Puppeteer script

```javascript
const puppeteer = require('puppeteer');

async function captureScreenshots(htmlFiles) {
  const browser = await puppeteer.launch();

  for (const file of htmlFiles) {
    const [width, height] = file.match(/(\d+)x(\d+)/).slice(1).map(Number);

    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 }); // 2x for retina
    await page.goto(`file://${file}`, { waitUntil: 'networkidle0' });
    // Wait for fonts/images to fully render
    await new Promise(r => setTimeout(r, 3000));

    const outputPath = file.replace('.html', '.png').replace('social-photos/', 'social-photos/exports/');
    await page.screenshot({ path: outputPath, type: 'png' });
    await page.close();
  }

  await browser.close();
}
```

**IMPORTANT:** Use `deviceScaleFactor: 2` for retina-quality output (Puppeteer only).

### Step 6: Verify & Fix Designs

Use Chrome MCP or `chrome-devtools` skill to visually inspect each exported PNG:

1. Open exported screenshots and check for layout/styling issues
2. Verify: fonts rendered correctly, colors match brand, text readable at thumbnail size
3. Check: no overflow, no cut-off content, safe zones respected, visual hierarchy clear
4. If issues found → fix HTML source → re-export screenshot → verify again
5. Repeat until all designs pass visual QA

**Common issues to check:**
- Fonts not loaded (fallback to system fonts)
- Text overflow or clipping
- Elements outside safe zone (central 80%)
- Low contrast text (below WCAG AA 4.5:1)
- Misaligned elements or broken layouts

### Step 7: Generate Summary Report

Save report to `plans/reports/` with naming pattern from session hooks.

Report structure:

```markdown
# Social Photos Design Report

## Overview
- Prompt/requirements: {original input}
- Platforms: {target platforms}
- Variations: {count}
- Style: {chosen style}

## Ideas Generated
1. **{Idea name}** — {brief description, rationale}
2. ...

## Design Decisions
- Color palette: {colors used, why}
- Typography: {fonts, sizes, why}
- Layout: {composition approach, why}
- Brand alignment: {how brand guidelines influenced design}

## Output Files
| File | Size | Platform | Preview |
|------|------|----------|---------|
| exports/{filename}.png | {WxH} | {platform} | {description} |

## Why This Works
- {Platform-specific reasoning}
- {Brand alignment reasoning}
- {Visual hierarchy reasoning}
- {Engagement potential reasoning}

## Recommendations
- {A/B test suggestions}
- {Platform-specific tips}
- {Iteration opportunities}
```

### Step 8: Organize Output

Invoke `assets-organizing` skill to organize all output files and reports:
- Move/copy exported PNGs to proper asset directories
- Ensure reports are in `plans/reports/` with correct naming
- Clean up intermediate HTML files if requested
- Tag outputs with metadata (platform, size, concept name)

## Design Best Practices

### Platform-Specific Tips

- **Instagram** — Visual-first, minimal text (<20%), strong colors, lifestyle feel
- **Facebook** — Informative, can have more text, eye-catching in feed
- **Twitter/X** — Bold headlines, contrast for dark/light mode, clear message
- **LinkedIn** — Professional, clean, data-driven visuals, thought leadership
- **Pinterest** — Vertical format, text overlay on images, how-to style
- **YouTube** — Face close-ups perform best, bright colors, readable at small size
- **TikTok** — Trendy, energetic, bold typography, youth-oriented

### Art Direction Styles (Reuse from Banner)

| Style | Best For | Key Elements |
|-------|----------|--------------|
| Minimalist | SaaS, tech, luxury | Whitespace, single accent color, clean type |
| Bold Typography | Announcements, quotes | Large type, high contrast, minimal imagery |
| Gradient Mesh | Modern brands, apps | Fluid color transitions, floating elements |
| Photo-Based | Lifestyle, e-commerce | Hero image, subtle overlay, text on image |
| Geometric | Tech, fintech | Shapes, patterns, structured layouts |
| Glassmorphism | SaaS, modern apps | Frosted glass, blur effects, transparency |
| Flat Illustration | Education, health | Custom illustrations, friendly, approachable |
| Duotone | Creative, editorial | Two-color treatment on photos |
| Collage | Fashion, culture | Mixed media, overlapping elements |
| 3D/Isometric | Tech, product | Depth, shadows, modern perspective |

### Color & Contrast

- Ensure WCAG AA contrast ratio (4.5:1 min) for all text
- Test designs at 50% size to verify readability
- Consider platform dark/light mode compatibility
- Use brand primary color as dominant, secondary as accent

### Typography Hierarchy

| Element | Min Size (at 1080px) | Weight |
|---------|---------------------|--------|
| Headline | 48px | Bold/Black |
| Subheadline | 32px | Semibold |
| Body | 24px | Regular |
| Caption | 18px | Regular/Light |
| CTA | 28px | Bold |

## Security & Scope

This sub-skill handles social media image design only. Does NOT handle:
- Video content creation
- Animation/motion graphics
- Print production files (CMYK, bleed)
- Direct social media posting/scheduling
- AI image generation (use `ai-artist` skill for that)
