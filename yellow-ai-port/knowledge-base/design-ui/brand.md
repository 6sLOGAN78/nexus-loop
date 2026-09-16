# Skill: brand

**Category:** design-ui

**Cursor invoke:** `/brand`

---


## SKILL: SKILL.md

# Brand

Brand identity, voice, messaging, asset management, and consistency frameworks.

## When to Use

- Brand voice definition and content tone guidance
- Visual identity standards and style guide development
- Messaging framework creation
- Brand consistency review and audit
- Asset organization, naming, and approval
- Color palette management and typography specs

## Quick Start

**Inject brand context into prompts:**
```bash
node scripts/inject-brand-context.cjs
node scripts/inject-brand-context.cjs --json
```

**Validate an asset:**
```bash
node scripts/validate-asset.cjs <asset-path>
```

**Extract/compare colors:**
```bash
node scripts/extract-colors.cjs --palette
node scripts/extract-colors.cjs <image-path>
```

## Brand Sync Workflow

```bash
# 1. Edit docs/brand-guidelines.md (or use /brand update)
# 2. Sync to design tokens
node scripts/sync-brand-to-tokens.cjs
# 3. Verify
node scripts/inject-brand-context.cjs --json | head -20
```

**Files synced:**
- `docs/brand-guidelines.md` → Source of truth
- `assets/design-tokens.json` → Token definitions
- `assets/design-tokens.css` → CSS variables

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `update` | Update brand identity and sync to all design systems | `references/update.md` |

## References

| Topic | File |
|-------|------|
| Voice Framework | `references/voice-framework.md` |
| Visual Identity | `references/visual-identity.md` |
| Messaging | `references/messaging-framework.md` |
| Consistency | `references/consistency-checklist.md` |
| Guidelines Template | `references/brand-guideline-template.md` |
| Asset Organization | `references/asset-organization.md` |
| Color Management | `references/color-palette-management.md` |
| Typography | `references/typography-specifications.md` |
| Logo Usage | `references/logo-usage-rules.md` |
| Approval Checklist | `references/approval-checklist.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/inject-brand-context.cjs` | Extract brand context for prompt injection |
| `scripts/sync-brand-to-tokens.cjs` | Sync brand-guidelines.md → design-tokens.json/css |
| `scripts/validate-asset.cjs` | Validate asset naming, size, format |
| `scripts/extract-colors.cjs` | Extract and compare colors against palette |

## Templates

| Template | Purpose |
|----------|---------|
| `templates/brand-guidelines-starter.md` | Complete starter template for new brands |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments


## REF: references/approval-checklist.md

# Asset Approval Checklist

Comprehensive checklist for reviewing marketing assets before approval.

## Quick Review

Before detailed review, verify:
- [ ] Asset serves stated purpose
- [ ] Target audience appropriate
- [ ] No obvious errors or issues
- [ ] Aligns with campaign goals

## Visual Elements

### Logo Usage
- [ ] Correct logo variant for context
- [ ] Proper clear space maintained
- [ ] Minimum size requirements met
- [ ] Approved colors only
- [ ] No unauthorized modifications
- [ ] Appropriate for background

### Color Compliance
- [ ] Uses brand palette colors only
- [ ] Primary/secondary ratio appropriate (60/30/10)
- [ ] Semantic colors used correctly
- [ ] No off-brand colors introduced
- [ ] Consistent across all elements

### Typography
- [ ] Brand fonts used throughout
- [ ] Correct font weights applied
- [ ] Proper type hierarchy
- [ ] Appropriate sizes for medium
- [ ] Line heights adequate
- [ ] No orphans/widows in body text

### Imagery
- [ ] Matches brand photography style
- [ ] Appropriate subjects/content
- [ ] Quality meets requirements
- [ ] Properly licensed/credited
- [ ] Optimized for intended use

## Accessibility

### Visual Accessibility
- [ ] Text contrast ratio >= 4.5:1 (AA)
- [ ] Large text contrast >= 3:1
- [ ] Interactive elements have visible focus
- [ ] Color not sole indicator of meaning
- [ ] Alt text for all images

### Content Accessibility
- [ ] Clear and scannable layout
- [ ] Readable font sizes
- [ ] Logical reading order
- [ ] Meaningful headings structure
- [ ] Links describe destination

## Content Quality

### Copy Review
- [ ] Matches brand voice
- [ ] Appropriate tone for context
- [ ] No prohibited terms used
- [ ] Value proposition clear
- [ ] CTA compelling and clear
- [ ] Proofread for errors

### Messaging
- [ ] Aligns with key messages
- [ ] Differentiators highlighted
- [ ] Benefits over features
- [ ] Target audience addressed
- [ ] No conflicting claims

## Technical Requirements

### File Specifications
- [ ] Correct file format
- [ ] Appropriate resolution
- [ ] File size optimized
- [ ] Proper naming convention
- [ ] Metadata included

### Platform Requirements
| Platform | Verified |
|----------|----------|
| Instagram | [ ] Correct dimensions |
| Twitter/X | [ ] Meets requirements |
| LinkedIn | [ ] Professional standards |
| Facebook | [ ] Guidelines compliant |
| Email | [ ] Size under 1MB |
| Web | [ ] Optimized for web |

## Legal & Compliance

### Intellectual Property
- [ ] Stock images licensed
- [ ] Music/audio cleared
- [ ] No trademark violations
- [ ] User content authorized
- [ ] Credits included where needed

### Regulatory
- [ ] Required disclosures present
- [ ] No misleading claims
- [ ] Pricing accurate
- [ ] Terms linked where needed
- [ ] Privacy compliant

## Review Status

### Reviewer Sign-off

| Review Area | Reviewer | Date | Status |
|-------------|----------|------|--------|
| Visual Design | | | [ ] Pass / [ ] Revisions |
| Copy/Content | | | [ ] Pass / [ ] Revisions |
| Brand Compliance | | | [ ] Pass / [ ] Revisions |
| Technical | | | [ ] Pass / [ ] Revisions |
| Legal | | | [ ] Pass / [ ] Revisions |

### Final Approval

- [ ] All review areas passed
- [ ] Revisions completed (if any)
- [ ] Final version uploaded
- [ ] Metadata updated
- [ ] Ready for publish/use

**Approved By:** _______________

**Date:** _______________

**Version:** _______________

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Logo too small | Increase to minimum size |
| Wrong font | Replace with brand font |
| Low contrast | Adjust colors for accessibility |
| Off-brand color | Replace with palette color |
| Blurry image | Use higher resolution source |
| Missing alt text | Add descriptive alt text |
| Weak CTA | Strengthen action-oriented copy |

## Automation Support

The `validate-asset.cjs` script can auto-check:
- Color palette compliance
- Minimum dimensions
- File format/size
- Naming convention
- Basic metadata

Run: `node .claude/skills/brand/scripts/validate-asset.cjs <asset-path>`

## Archival

After approval:
1. Update asset status in manifest.json
2. Add approver and timestamp
3. Move previous versions to archive
4. Update campaign tracking
5. Notify relevant teams


## REF: references/asset-organization.md

# Asset Organization Guide

Guidelines for organizing marketing assets in a structured, searchable system.

## Directory Structure

```
project-root/
├── .assets/                          # Git-tracked metadata
│   ├── manifest.json                 # Central asset registry
│   ├── tags.json                     # Tagging system
│   ├── versions/                     # Version history
│   │   └── {asset-id}/
│   │       └── v{n}.json
│   └── metadata/                     # Type-specific metadata
│       ├── designs.json
│       ├── banners.json
│       ├── logos.json
│       └── videos.json
├── assets/                           # Raw files
│   ├── designs/
│   │   ├── campaigns/                # Campaign-specific designs
│   │   ├── web/                      # Website graphics
│   │   └── print/                    # Print materials
│   ├── banners/
│   │   ├── social-media/             # Platform banners
│   │   ├── email-headers/            # Email template headers
│   │   └── landing-pages/            # Hero/section images
│   ├── logos/
│   │   ├── full-horizontal/          # Full logo with wordmark
│   │   ├── icon-only/                # Symbol only
│   │   ├── monochrome/               # Single color versions
│   │   └── variations/               # Special versions
│   ├── videos/
│   │   ├── ads/                      # Promotional videos
│   │   ├── tutorials/                # How-to content
│   │   └── testimonials/             # Customer videos
│   ├── infographics/                 # Data visualizations
│   └── generated/                    # AI-generated assets
│       └── {YYYYMMDD}/               # Date-organized
```

## Naming Convention

### Format
```
{type}_{campaign}_{description}_{timestamp}_{variant}.{ext}
```

### Components
| Component | Format | Required | Examples |
|-----------|--------|----------|----------|
| type | lowercase | Yes | banner, logo, design, video |
| campaign | kebab-case | Yes* | claude-launch, q1-promo, evergreen |
| description | kebab-case | Yes | hero-image, email-header |
| timestamp | YYYYMMDD | Yes | 20251209 |
| variant | kebab-case | No | dark-mode, 1x1, mobile |

*Use "evergreen" for non-campaign assets

### Examples
```
banner_claude-launch_hero-image_20251209_16-9.png
logo_brand-refresh_horizontal-full-color_20251209.svg
design_holiday-campaign_email-hero_20251209_dark-mode.psd
video_product-demo_feature-walkthrough_20251209.mp4
infographic_evergreen_pricing-comparison_20251209.png
```

## Metadata Schema

### Asset Entry (manifest.json)
```json
{
  "id": "uuid-v4",
  "name": "Campaign Hero Banner",
  "type": "banner",
  "path": "assets/banners/landing-pages/banner_claude-launch_hero-image_20251209.png",
  "dimensions": { "width": 1920, "height": 1080 },
  "fileSize": 245760,
  "mimeType": "image/png",
  "tags": ["campaign", "hero", "launch"],
  "status": "approved",
  "source": {
    "model": "imagen-4",
    "prompt": "...",
    "createdAt": "2025-12-09T10:30:00Z"
  },
  "version": 2,
  "createdBy": "agent:content-creator",
  "approvedBy": "user:john",
  "approvedAt": "2025-12-09T14:00:00Z"
}
```

### Version Entry (versions/{id}/v{n}.json)
```json
{
  "version": 2,
  "previousVersion": 1,
  "path": "assets/banners/landing-pages/banner_claude-launch_hero-image_20251209_v2.png",
  "changes": "Updated CTA button color to match brand refresh",
  "createdAt": "2025-12-09T12:00:00Z",
  "createdBy": "agent:ui-designer"
}
```

## Tagging System

### Standard Tags
| Category | Values |
|----------|--------|
| status | draft, review, approved, archived |
| platform | instagram, twitter, linkedin, facebook, youtube, email, web |
| content-type | promotional, educational, brand, product, testimonial |
| format | 1x1, 4x5, 9x16, 16x9, story, reel, banner |
| source | imagen-4, veo-3, user-upload, canva, figma |

### Tag Usage
- Each asset should have: status + platform + content-type
- Optional: format, source, campaign

## File Organization Best Practices

1. **One file per variant** - Don't combine dark/light in one file
2. **Source files separate** - Keep .psd/.fig in same structure
3. **AI assets timestamped** - Auto-organize by generation date
4. **Archive don't delete** - Move to `archived/` with date prefix
5. **Large files external** - Videos > 100MB use cloud storage links

## Search Patterns

### By Type
```bash
# Find all banners
ls assets/banners/**/*
```

### By Campaign
```bash
# Find all assets for specific campaign
grep -l "claude-launch" .assets/manifest.json
```

### By Status
```bash
# Find approved assets only
jq '.assets[] | select(.status == "approved")' .assets/manifest.json
```

## Cleanup Workflow

1. Run `extract-colors.cjs` on new assets
2. Validate against brand guidelines
3. Update manifest.json with new entries
4. Tag appropriately
5. Remove duplicates/outdated versions


## REF: references/brand-guideline-template.md

# Brand Guidelines Template

Use this template to create comprehensive brand guidelines for any project.

## Document Structure

```markdown
# Brand Guidelines v{X.Y}

## Quick Reference
- **Primary Color:** #XXXXXX
- **Secondary Color:** #XXXXXX
- **Primary Font:** {font-family}
- **Voice:** {3 key traits}

## 1. Color Palette

### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| {Name} | #{hex} | rgb({r},{g},{b}) | Primary brand color, CTAs, headers |
| {Name} | #{hex} | rgb({r},{g},{b}) | Supporting accent |

### Secondary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| {Name} | #{hex} | rgb({r},{g},{b}) | Secondary elements |
| {Name} | #{hex} | rgb({r},{g},{b}) | Highlights |

### Neutral Palette
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Background | #{hex} | rgb({r},{g},{b}) | Page backgrounds |
| Text Primary | #{hex} | rgb({r},{g},{b}) | Body text |
| Text Secondary | #{hex} | rgb({r},{g},{b}) | Captions, muted text |
| Border | #{hex} | rgb({r},{g},{b}) | Dividers, borders |

### Accessibility
- Text/Background Contrast: {ratio}:1 (WCAG {level})
- CTA Contrast: {ratio}:1
- All interactive elements meet WCAG 2.1 AA

## 2. Typography

### Font Stack
```css
--font-heading: '{Font}', sans-serif;
--font-body: '{Font}', sans-serif;
--font-mono: '{Font}', monospace;
```

### Type Scale
| Element | Font | Weight | Size (Desktop/Mobile) | Line Height |
|---------|------|--------|----------------------|-------------|
| H1 | {font} | 700 | 48px / 32px | 1.2 |
| H2 | {font} | 600 | 36px / 28px | 1.25 |
| H3 | {font} | 600 | 28px / 24px | 1.3 |
| H4 | {font} | 600 | 24px / 20px | 1.35 |
| Body | {font} | 400 | 16px / 16px | 1.5 |
| Small | {font} | 400 | 14px / 14px | 1.5 |
| Caption | {font} | 400 | 12px / 12px | 1.4 |

## 3. Logo Usage

### Variants
- **Primary:** Full horizontal logo with wordmark
- **Stacked:** Vertical arrangement for square spaces
- **Icon:** Symbol only for favicons, app icons
- **Monochrome:** Single color for limited palettes

### Clear Space
Minimum clear space = height of logo mark

### Minimum Size
- Digital: 80px width minimum
- Print: 25mm width minimum

### Don'ts
- Don't rotate or skew
- Don't change colors outside approved palette
- Don't add effects (shadows, gradients)
- Don't crop or modify proportions
- Don't place on busy backgrounds

## 4. Voice & Tone

### Brand Personality
{Trait 1}: {Description}
{Trait 2}: {Description}
{Trait 3}: {Description}

### Voice Chart
| Trait | We Are | We Are Not |
|-------|--------|------------|
| {Trait} | {Description} | {Anti-description} |

### Tone by Context
| Context | Tone | Example |
|---------|------|---------|
| Marketing | {tone} | "{example}" |
| Support | {tone} | "{example}" |
| Error Messages | {tone} | "{example}" |
| Success | {tone} | "{example}" |

### Prohibited Terms
- {term 1} (reason)
- {term 2} (reason)

## 5. Imagery Guidelines

### Photography Style
- {Lighting preference}
- {Subject guidelines}
- {Color treatment}

### Illustrations
- Style: {description}
- Colors: Brand palette only
- Stroke: {weight}px

### Icons
- Style: {outlined/filled/duotone}
- Size: 24px base grid
- Corner radius: {value}px
```

## Usage

1. Copy template above
2. Fill in brand-specific values
3. Save as `docs/brand-guidelines.md`
4. Reference in content workflows

## Extractable Fields

Scripts can extract:
- `colors.primary`, `colors.secondary`, `colors.neutral`
- `typography.heading`, `typography.body`
- `voice.traits`, `voice.prohibited`
- `logo.variants`, `logo.minSize`


## REF: references/color-palette-management.md

# Color Palette Management

Guidelines for defining, extracting, and enforcing brand colors.

## Color System Structure

### Hierarchy
```
Primary Colors (1-2)
├── Main brand color - Used for CTAs, headers, key elements
└── Supporting primary - Secondary emphasis

Secondary Colors (2-3)
├── Accent colors - Highlights, interactive states
└── Supporting visuals - Icons, illustrations

Neutral Palette (3-5)
├── Background colors - Page, card, modal backgrounds
├── Text colors - Headings, body, muted text
└── UI elements - Borders, dividers, shadows

Semantic Colors (4)
├── Success - #22C55E (green)
├── Warning - #F59E0B (amber)
├── Error - #EF4444 (red)
└── Info - #3B82F6 (blue)
```

## Color Documentation Format

### Markdown Table
```markdown
| Name | Hex | RGB | HSL | Usage |
|------|-----|-----|-----|-------|
| Primary Blue | #2563EB | rgb(37,99,235) | hsl(217,91%,53%) | CTAs, links |
```

### CSS Variables
```css
:root {
  /* Primary */
  --color-primary: #2563EB;
  --color-primary-light: #3B82F6;
  --color-primary-dark: #1D4ED8;

  /* Secondary */
  --color-secondary: #8B5CF6;
  --color-accent: #F59E0B;

  /* Neutral */
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
}
```

### Tailwind Config
```javascript
colors: {
  primary: {
    DEFAULT: '#2563EB',
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  }
}
```

## Accessibility Requirements

### Contrast Ratios (WCAG 2.1)
| Level | Normal Text | Large Text | UI Components |
|-------|-------------|------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | 4.5:1 |

### Checking Contrast
```javascript
// Formula for relative luminance
function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

## Color Extraction

### From Images
Use `extract-colors.cjs` script to:
1. Load image file
2. Extract dominant colors using k-means clustering
3. Map to nearest brand colors
4. Report compliance percentage

### From Brand Guidelines
Parse markdown to extract:
- Hex values from tables
- CSS variable definitions
- Color names and usage descriptions

## Brand Compliance Validation

### Rules
1. **Primary color ratio**: 60-70% of design
2. **Secondary color ratio**: 20-30% of design
3. **Accent color ratio**: 5-10% of design
4. **Off-brand tolerance**: Max 20% non-palette colors

### Validation Output
```json
{
  "compliance": 85,
  "colors": {
    "brand": ["#2563EB", "#8B5CF6", "#FFFFFF"],
    "offBrand": ["#FF5500"],
    "dominant": "#2563EB"
  },
  "issues": [
    "Off-brand color #FF5500 detected (15% coverage)",
    "Primary color underused (45% vs 60% target)"
  ]
}
```

## Color Usage Guidelines

### Do's
- Use primary for main CTAs and key elements
- Maintain consistent hover/active states
- Test all combinations for accessibility
- Document color decisions

### Don'ts
- Use more than 2-3 colors in single component
- Mix warm and cool tones without intent
- Use pure black (#000) for text (use #111 or similar)
- Rely solely on color for meaning (use icons/text too)

## Color Palette Examples

### Tech/SaaS
```
Primary: #2563EB (Blue)
Secondary: #8B5CF6 (Purple)
Accent: #10B981 (Emerald)
Background: #F9FAFB
Text: #111827
```

### Marketing/Creative
```
Primary: #F97316 (Orange)
Secondary: #EC4899 (Pink)
Accent: #14B8A6 (Teal)
Background: #FFFFFF
Text: #1F2937
```

### Professional/Corporate
```
Primary: #1E40AF (Navy)
Secondary: #475569 (Slate)
Accent: #0EA5E9 (Sky)
Background: #F8FAFC
Text: #0F172A
```

## Tools & Resources

- [Coolors](https://coolors.co) - Palette generation
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind Color Reference](https://tailwindcss.com/docs/customizing-colors)
- [Color Hunt](https://colorhunt.co) - Curated palettes


## REF: references/consistency-checklist.md

# Brand Consistency Checklist

## Visual Consistency

### Logo
- [ ] Correct logo version used
- [ ] Proper clear space maintained
- [ ] Approved colors only
- [ ] Legible at all sizes
- [ ] No unauthorized modifications

### Colors
- [ ] Only brand palette colors
- [ ] Consistent color application
- [ ] Proper contrast for accessibility
- [ ] Color ratios maintained

### Typography
- [ ] Brand fonts used
- [ ] Correct weights/styles
- [ ] Proper hierarchy
- [ ] Consistent formatting

### Imagery
- [ ] Matches brand style
- [ ] Consistent editing/filters
- [ ] Appropriate subjects
- [ ] Quality standards met

## Voice Consistency

### Tone
- [ ] Matches brand personality
- [ ] Appropriate for context
- [ ] Consistent across channels
- [ ] No conflicting messages

### Language
- [ ] Brand terminology used
- [ ] Consistent capitalization
- [ ] Proper abbreviations
- [ ] Jargon level appropriate

### Messaging
- [ ] Aligns with key messages
- [ ] Value prop clear
- [ ] Differentiators highlighted
- [ ] CTAs consistent

## Channel Audit

### Website
- [ ] Homepage
- [ ] Product pages
- [ ] Blog/content
- [ ] Footer/navigation

### Social Media
- [ ] Profile images
- [ ] Cover images
- [ ] Bio/about sections
- [ ] Post templates

### Email
- [ ] Header/footer
- [ ] Templates
- [ ] Signatures
- [ ] Automated messages

### Collateral
- [ ] Presentations
- [ ] One-pagers
- [ ] Business cards
- [ ] Promotional materials

## Common Issues

| Issue | Fix |
|-------|-----|
| Outdated logo | Replace with current version |
| Off-brand colors | Update to palette |
| Wrong font | Replace with brand font |
| Inconsistent voice | Apply style guide |
| Mixed messaging | Align to framework |

## Audit Frequency

| Asset Type | Frequency |
|------------|-----------|
| Website | Monthly |
| Social profiles | Quarterly |
| Email templates | Quarterly |
| Sales materials | Quarterly |
| Full brand audit | Annually |


## REF: references/logo-usage-rules.md

# Logo Usage Rules

Guidelines for proper logo implementation across all marketing materials.

## Logo Variants

### Primary Variants
| Variant | File Name | Use Case |
|---------|-----------|----------|
| Full Horizontal | logo-full-horizontal.{ext} | Website headers, documents |
| Stacked | logo-stacked.{ext} | Square spaces, social avatars |
| Icon Only | logo-icon.{ext} | Favicons, app icons, small spaces |
| Wordmark Only | logo-wordmark.{ext} | When icon already present |

### Color Variants
| Variant | Use Case |
|---------|----------|
| Full Color | Default on white/light backgrounds |
| Reversed | On dark backgrounds |
| Monochrome Dark | On light backgrounds when color not possible |
| Monochrome Light | On dark backgrounds when color not possible |

## Clear Space

### Minimum Clear Space
The clear space around the logo should equal the height of the logo mark (icon portion).

```
    ┌─────────────────────────────┐
    │           [x]               │
    │   ┌───────────────────┐     │
    │   │                   │     │
[x] │   │    [LOGO]         │ [x] │
    │   │                   │     │
    │   └───────────────────┘     │
    │           [x]               │
    └─────────────────────────────┘
```

Where [x] = height of logo mark

## Minimum Size

### Digital
| Format | Minimum Width | Notes |
|--------|---------------|-------|
| Full Logo | 120px | All elements legible |
| Icon Only | 24px | Favicon/small icons |
| Icon Only | 32px | UI elements |

### Print
| Format | Minimum Width | Notes |
|--------|---------------|-------|
| Full Logo | 35mm | Business cards, letterhead |
| Icon Only | 10mm | Small print items |

## Color Usage

### Approved Backgrounds
| Background | Logo Version |
|------------|--------------|
| White | Full color or dark mono |
| Light gray (#F5F5F5+) | Full color or dark mono |
| Brand primary | Reversed (white) |
| Dark (#333 or darker) | Reversed (white) |
| Photography | Ensure sufficient contrast |

### Color Rules
1. Never change logo colors outside approved palette
2. Don't use gradients on the logo
3. Don't apply transparency to logo elements
4. Don't add shadows or effects

## Incorrect Usage

### Absolute Don'ts
- ❌ Stretch or compress logo
- ❌ Rotate at angles
- ❌ Add drop shadows
- ❌ Apply gradient fills
- ❌ Use unapproved colors
- ❌ Add strokes or outlines
- ❌ Place on busy backgrounds
- ❌ Crop any portion
- ❌ Rearrange elements
- ❌ Add additional elements

### Visual Examples
```
WRONG: Stretched      WRONG: Rotated       WRONG: Wrong color
┌──────────────┐      ┌────────┐          ┌────────┐
│   L O G O    │      │  /    │          │ LOGO   │ <- wrong color
└──────────────┘      │ /LOGO │          └────────┘
                      └───────/
```

## Co-branding

### Partner Logo Guidelines
1. Equal visual weight (same height)
2. Adequate separation between logos
3. Use divider line if needed
4. Both logos in their approved colors
5. Clear space applies to both

### Layout Options
```
Option A: Side by side with divider
[OUR LOGO] | [PARTNER LOGO]

Option B: Stacked
    [OUR LOGO]
        +
  [PARTNER LOGO]
```

## File Formats

### Recommended Formats
| Usage | Format | Notes |
|-------|--------|-------|
| Web | SVG | Preferred, scalable |
| Web fallback | PNG | With transparency |
| Print | PDF | Vector, high quality |
| Print alt | EPS | Legacy systems |
| Documents | PNG | High res (300dpi) |

### File Organization
```
assets/logos/
├── full-horizontal/
│   ├── logo-full-color.svg
│   ├── logo-full-color.png
│   ├── logo-reversed.svg
│   ├── logo-mono-dark.svg
│   └── logo-mono-light.svg
├── icon-only/
│   ├── icon-full-color.svg
│   ├── icon-reversed.svg
│   └── favicon.ico
└── monochrome/
    ├── logo-black.svg
    └── logo-white.svg
```

## Platform-Specific Guidelines

### Social Media
| Platform | Format | Size | Notes |
|----------|--------|------|-------|
| LinkedIn | PNG | 300x300px | Icon only |
| Twitter/X | PNG | 400x400px | Icon only |
| Facebook | PNG | 180x180px | Icon only |
| Instagram | PNG | 320x320px | Icon only |

### Website
| Location | Variant | Size |
|----------|---------|------|
| Header | Full horizontal | 120-200px width |
| Footer | Full horizontal | 100-150px width |
| Favicon | Icon only | 32x32px |
| Apple Touch | Icon only | 180x180px |

### Documents
| Document | Variant | Placement |
|----------|---------|-----------|
| Letterhead | Full horizontal | Top left |
| Presentation | Icon + wordmark | Title slide |
| Report | Full horizontal | Cover + footer |

## Logo Approval Process

### Before Using Logo
1. Verify you have the correct version
2. Check background compatibility
3. Ensure minimum size requirements
4. Confirm clear space allocation
5. Review against these guidelines

### Requesting Approval
For non-standard uses:
1. Submit mockup showing proposed usage
2. Include context (medium, audience)
3. Wait for brand team approval
4. Document approved exceptions


## REF: references/messaging-framework.md

# Messaging Framework

## Framework Structure

```
Mission (Why we exist)
    ↓
Vision (Where we're going)
    ↓
Value Proposition (What we offer)
    ↓
Positioning Statement (How we're different)
    ↓
Key Messages (What we say)
    ↓
Proof Points (Why to believe)
```

## Core Statements

### Mission Statement
```
We [action] for [audience] by [method] so they can [outcome].
```

### Vision Statement
```
A world where [aspiration/change we want to see].
```

### Value Proposition
```
For [target customer] who [need/problem],
[Product/Brand] is a [category]
that [key benefit].
Unlike [competitors],
we [unique differentiator].
```

### Positioning Statement
```
[Brand] is the [category] for [audience]
who want [desired outcome]
because [reason to believe].
```

## Message Architecture

### Primary Message
One sentence that captures your core value.

### Supporting Messages (3-5)
Each addresses a different benefit or audience need.

| Message | Audience Need | Proof Point |
|---------|---------------|-------------|
| [Message 1] | [Need] | [Evidence] |
| [Message 2] | [Need] | [Evidence] |
| [Message 3] | [Need] | [Evidence] |

### Elevator Pitches

**10-second:**
[One sentence that sparks interest]

**30-second:**
[Problem + solution + differentiation]

**60-second:**
[Full pitch with proof points]

## Message by Audience

| Audience | Pain Point | Key Message | CTA |
|----------|------------|-------------|-----|
| [Segment 1] | [Pain] | [Message] | [Action] |
| [Segment 2] | [Pain] | [Message] | [Action] |

## Message Testing

1. Is it clear? (No jargon)
2. Is it differentiated? (Competitors can't say it)
3. Is it credible? (Can we prove it)
4. Is it compelling? (Does audience care)
5. Is it consistent? (Aligns with brand)


## REF: references/typography-specifications.md

# Typography Specifications

Guidelines for defining and implementing brand typography.

## Font Stack Structure

### Primary Fonts
```css
/* Headings - Display font for impact */
--font-heading: 'Inter', system-ui, -apple-system, sans-serif;

/* Body - Readable for long-form content */
--font-body: 'Inter', system-ui, -apple-system, sans-serif;

/* Monospace - Code, technical content */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Loading
```html
<!-- Google Fonts (recommended) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Type Scale

### Base System
- Base size: 16px (1rem)
- Scale ratio: 1.25 (Major Third)

### Scale Definition
| Element | Size (rem) | Size (px) | Weight | Line Height |
|---------|------------|-----------|--------|-------------|
| Display | 3.815rem | 61px | 700 | 1.1 |
| H1 | 3.052rem | 49px | 700 | 1.2 |
| H2 | 2.441rem | 39px | 600 | 1.25 |
| H3 | 1.953rem | 31px | 600 | 1.3 |
| H4 | 1.563rem | 25px | 600 | 1.35 |
| H5 | 1.25rem | 20px | 600 | 1.4 |
| Body Large | 1.125rem | 18px | 400 | 1.6 |
| Body | 1rem | 16px | 400 | 1.5 |
| Small | 0.875rem | 14px | 400 | 1.5 |
| Caption | 0.75rem | 12px | 400 | 1.4 |

### Responsive Adjustments
```css
/* Mobile (< 768px) */
h1 { font-size: 2rem; }    /* 32px */
h2 { font-size: 1.5rem; }  /* 24px */
h3 { font-size: 1.25rem; } /* 20px */
body { font-size: 1rem; }  /* 16px */

/* Desktop (>= 768px) */
h1 { font-size: 3rem; }    /* 48px */
h2 { font-size: 2.25rem; } /* 36px */
h3 { font-size: 1.75rem; } /* 28px */
body { font-size: 1rem; }  /* 16px */
```

## Font Weights

### Weight Scale
| Name | Value | Usage |
|------|-------|-------|
| Regular | 400 | Body text, paragraphs |
| Medium | 500 | Buttons, nav items |
| Semibold | 600 | Subheadings, emphasis |
| Bold | 700 | Headings, CTAs |

### Weight Pairing
- Headings: 600-700
- Body: 400
- Links: 500
- Buttons: 600

## Line Height Guidelines

### Rules
| Content Type | Line Height | Notes |
|--------------|-------------|-------|
| Headings | 1.1-1.3 | Tighter for visual impact |
| Body text | 1.5-1.6 | Optimal readability |
| Small text | 1.4-1.5 | Slightly tighter |
| Long-form | 1.6-1.75 | Extra comfortable |

## Letter Spacing

### Guidelines
| Element | Tracking | Value |
|---------|----------|-------|
| Display | Tighter | -0.02em |
| Headings | Normal | 0 |
| Body | Normal | 0 |
| All caps | Wider | 0.05em |
| Small caps | Wider | 0.1em |

## Paragraph Spacing

### Margins
```css
/* Heading spacing */
h1, h2 { margin-top: 2rem; margin-bottom: 1rem; }
h3, h4 { margin-top: 1.5rem; margin-bottom: 0.75rem; }

/* Paragraph spacing */
p { margin-bottom: 1rem; }
p + p { margin-top: 0; }
```

### Maximum Line Length
- Body text: 65-75 characters (optimal)
- Headings: Can be wider
- Code blocks: 80-100 characters

```css
.prose {
  max-width: 65ch;
}
```

## CSS Implementation

### Full Variables
```css
:root {
  /* Font Families */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Tailwind Config
```javascript
theme: {
  fontFamily: {
    heading: ['Inter', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.1' }],
  }
}
```

## Common Font Pairings

### Clean & Modern
- Heading: Inter
- Body: Inter

### Professional
- Heading: Playfair Display
- Body: Source Sans Pro

### Startup/Tech
- Heading: Poppins
- Body: Open Sans

### Editorial
- Heading: Merriweather
- Body: Lato

## Accessibility

### Minimum Sizes
- Body text: 16px minimum
- Small text: 14px minimum, not for long content
- Caption: 12px minimum, use sparingly

### Contrast Requirements
- Text on background: 4.5:1 minimum (AA)
- Large text (18px+): 3:1 minimum

### Best Practices
- Don't use all caps for long text
- Avoid justified text (use left-align)
- Ensure adequate line spacing
- Don't use thin weights (<400) at small sizes


## REF: references/update.md

Update brand colors, typography, and style - automatically syncs to all design system files.

<args>$ARGUMENTS</args>

## Overview

This command systematically updates:
1. `docs/brand-guidelines.md` - Human-readable brand doc
2. `assets/design-tokens.json` - Token source of truth
3. `assets/design-tokens.css` - Generated CSS variables

## Workflow

### Step 1: Gather Brand Input

Use `AskUserQuestion` to collect:

**Theme Selection:**
- Theme name (e.g., "Ocean Professional", "Electric Creative", "Forest Calm")

**Primary Color:**
- Color name (e.g., "Ocean Blue", "Coral", "Forest Green")
- Hex code (e.g., #3B82F6)

**Secondary Color:**
- Color name (e.g., "Golden Amber", "Electric Purple")
- Hex code

**Accent Color:**
- Color name (e.g., "Emerald", "Neon Mint")
- Hex code

**Brand Mood (for AI image generation):**
- Mood keywords (e.g., "professional, trustworthy, premium" or "bold, creative, energetic")

### Step 2: Update Brand Guidelines

Edit `docs/brand-guidelines.md`:

1. **Quick Reference table** - Update color names and hex codes
2. **Brand Concept section** - Update theme name and description
3. **Color Palette section** - Update Primary, Secondary, Accent colors with shades
4. **AI Image Generation section** - Update base prompt, keywords, mood descriptors

### Step 3: Sync to Design Tokens

Run the sync script:
```bash
node .claude/skills/brand/scripts/sync-brand-to-tokens.cjs
```

This will:
- Update `assets/design-tokens.json` with new color names and values
- Regenerate `assets/design-tokens.css` with correct CSS variables

### Step 4: Verify Sync

Confirm all files are updated:
```bash
# Check brand context extraction
node .claude/skills/brand/scripts/inject-brand-context.cjs --json | head -30

# Check CSS variables
grep "primary" assets/design-tokens.css | head -5
```

### Step 5: Report

Output summary:
- Theme: [name]
- Primary: [name] ([hex])
- Secondary: [name] ([hex])
- Accent: [name] ([hex])
- Files updated: brand-guidelines.md, design-tokens.json, design-tokens.css

## Files Modified

| File | Purpose |
|------|---------|
| `docs/brand-guidelines.md` | Human-readable brand documentation |
| `assets/design-tokens.json` | Token definitions (primitive→semantic→component) |
| `assets/design-tokens.css` | CSS variables for UI components |

## Skills Used

- `brand` - Brand context extraction and sync
- `design-system` - Token generation

## Examples

```bash
# Interactive mode
/brand:update

# With theme hint
/brand:update "Ocean Professional"

# Quick preset
/brand:update "midnight purple"
```

## Color Presets

If user specifies a preset name, use these defaults:

| Preset | Primary | Secondary | Accent |
|--------|---------|-----------|--------|
| ocean-professional | #3B82F6 Ocean Blue | #F59E0B Golden Amber | #10B981 Emerald |
| electric-creative | #FF6B6B Coral | #9B5DE5 Electric Purple | #00F5D4 Neon Mint |
| forest-calm | #059669 Forest Green | #92400E Warm Brown | #FBBF24 Sunlight |
| midnight-purple | #7C3AED Violet | #EC4899 Pink | #06B6D4 Cyan |
| sunset-warm | #F97316 Orange | #DC2626 Red | #FACC15 Yellow |

## Important

- **Always sync all three files** - Never update just brand-guidelines.md alone
- **Verify extraction** - Run inject-brand-context.cjs after update to confirm
- **Test image generation** - Optionally generate a test image to verify brand application


## REF: references/visual-identity.md

# Visual Identity Basics

## Core Visual Elements

### Logo
- **Primary:** Full logo (horizontal/stacked)
- **Secondary:** Abbreviated version
- **Icon/Mark:** Symbol only
- **Clear space:** Minimum padding around logo
- **Minimum size:** Smallest readable size

### Color Palette
```
Primary Colors (1-2)
├── Main brand color
└── Supporting primary

Secondary Colors (2-3)
├── Accent colors
└── Supporting visuals

Neutrals (3-4)
├── Text colors
├── Background colors
└── UI elements
```

### Typography
| Usage | Font | Weight | Size |
|-------|------|--------|------|
| H1 | [Font] | Bold | 32-48px |
| H2 | [Font] | Semibold | 24-32px |
| Body | [Font] | Regular | 16-18px |
| Caption | [Font] | Regular | 12-14px |

## Visual Guidelines Template

```markdown
## Logo Usage

### Correct Usage
- [Guidelines for proper logo use]

### Incorrect Usage
- Don't stretch or distort
- Don't change colors (unless approved)
- Don't add effects
- Don't place on busy backgrounds

## Color Specifications

### Primary Palette
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| [Name] | #XXXXXX | r,g,b | [Where to use] |

### Accessibility
- Text contrast ratio: 4.5:1 minimum
- Button contrast: WCAG AA compliant

## Imagery Style

### Photography
- [Lighting preferences]
- [Subject guidelines]
- [Composition rules]
- [Editing style]

### Illustrations
- [Style description]
- [Color usage]
- [Complexity level]

### Icons
- [Style: outlined/filled/duotone]
- [Stroke weight]
- [Corner radius]
```

## Quick Checks

### Logo
- [ ] Correct version for context
- [ ] Sufficient clear space
- [ ] Legible at size used
- [ ] Correct color for background

### Colors
- [ ] From approved palette
- [ ] Accessible contrast
- [ ] Consistent across materials

### Typography
- [ ] Correct fonts
- [ ] Appropriate hierarchy
- [ ] Readable size


## REF: references/voice-framework.md

# Brand Voice Framework

## Voice vs. Tone

**Voice** = Brand's personality (consistent)
**Tone** = How voice adapts to context (variable)

Example: A friendly brand (voice) might be celebratory in a win announcement but empathetic in a support response (tone).

## Voice Dimensions

### Tone Spectrum
```
Formal ←――――――――――――――→ Casual
[Legal docs]     [Social media]
```

### Language Spectrum
```
Simple ←――――――――――――――→ Complex
[Consumer]       [Technical B2B]
```

### Character Spectrum
```
Serious ←――――――――――――――→ Playful
[Finance]        [Entertainment]
```

### Emotion Spectrum
```
Reserved ←――――――――――――――→ Expressive
[Corporate]      [Lifestyle brand]
```

## Voice Development Process

### Step 1: Define Personality Traits
Choose 3-5 traits that describe your brand:
- Confident, not arrogant
- Friendly, not unprofessional
- Knowledgeable, not condescending
- Innovative, not gimmicky
- Authentic, not casual

### Step 2: Create Voice Chart

| Trait | Description | Do | Don't |
|-------|-------------|-----|-------|
| [Trait] | [Meaning] | [Example] | [Example] |

### Step 3: Context Adaptation

| Context | Tone Shift | Example |
|---------|------------|---------|
| Social media | More casual | "Hey there!" |
| Support | More empathetic | "We understand..." |
| Legal | More formal | "In accordance with..." |
| Sales | More confident | "You'll see results..." |

## Voice Testing

Ask these questions:
1. Does this sound like our brand?
2. Would a competitor say this?
3. Does it resonate with our audience?
4. Is it consistent with our values?

## Voice Guide Template

```markdown
## [Brand] Voice Guide

### We Are
- [Trait 1]: [Description]
- [Trait 2]: [Description]
- [Trait 3]: [Description]

### We Sound Like
[Example phrases]

### We Don't Sound Like
[Anti-examples]

### Sample Rewrites
Before: [Generic copy]
After: [Branded copy]
```


## REF: templates/brand-guidelines-starter.md

# Brand Guidelines v1.0

> Last updated: {DATE}
> Status: Draft

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #2563EB |
| Secondary Color | #8B5CF6 |
| Primary Font | Inter |
| Voice | Professional, Helpful, Clear |

---

## 1. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary Blue | #2563EB | rgb(37,99,235) | CTAs, headers, links |
| Primary Dark | #1D4ED8 | rgb(29,78,216) | Hover states, emphasis |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Secondary Purple | #8B5CF6 | rgb(139,92,246) | Accents, highlights |
| Accent Green | #10B981 | rgb(16,185,129) | Success, positive states |

### Neutral Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Background | #FFFFFF | rgb(255,255,255) | Page backgrounds |
| Surface | #F9FAFB | rgb(249,250,251) | Cards, sections |
| Text Primary | #111827 | rgb(17,24,39) | Headings, body text |
| Text Secondary | #6B7280 | rgb(107,114,128) | Captions, muted text |
| Border | #E5E7EB | rgb(229,231,235) | Dividers, borders |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #22C55E | Positive actions, confirmations |
| Warning | #F59E0B | Cautions, pending states |
| Error | #EF4444 | Errors, destructive actions |
| Info | #3B82F6 | Informational messages |

### Accessibility

- Text on white background: 7.2:1 contrast ratio (AAA)
- Primary on white: 4.6:1 contrast ratio (AA)
- All interactive elements meet WCAG 2.1 AA standards

---

## 2. Typography

### Font Stack

```css
--font-heading: 'Inter', system-ui, -apple-system, sans-serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|----------------|---------------|--------|-------------|
| H1 | 48px | 32px | 700 | 1.2 |
| H2 | 36px | 28px | 600 | 1.25 |
| H3 | 28px | 24px | 600 | 1.3 |
| H4 | 24px | 20px | 600 | 1.35 |
| Body | 16px | 16px | 400 | 1.5 |
| Body Large | 18px | 18px | 400 | 1.6 |
| Small | 14px | 14px | 400 | 1.5 |
| Caption | 12px | 12px | 400 | 1.4 |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 3. Logo Usage

### Variants

| Variant | File | Use Case |
|---------|------|----------|
| Full Horizontal | logo-full-horizontal.svg | Headers, documents |
| Stacked | logo-stacked.svg | Square spaces |
| Icon Only | logo-icon.svg | Favicons, small spaces |
| Monochrome | logo-mono.svg | Limited color contexts |

### Clear Space

Minimum clear space = height of the logo icon (mark)

### Minimum Size

| Context | Minimum Width |
|---------|---------------|
| Digital - Full Logo | 120px |
| Digital - Icon | 24px |
| Print - Full Logo | 35mm |
| Print - Icon | 10mm |

### Don'ts

- Don't rotate or skew the logo
- Don't change colors outside approved palette
- Don't add shadows or effects
- Don't crop or modify proportions
- Don't place on busy backgrounds without sufficient contrast

---

## 4. Voice & Tone

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Professional** | Expert knowledge, authoritative yet approachable |
| **Helpful** | Solution-focused, actionable guidance |
| **Clear** | Direct communication, jargon-free |
| **Confident** | Assured without being arrogant |

### Voice Chart

| Trait | We Are | We Are Not |
|-------|--------|------------|
| Professional | Expert, knowledgeable | Stuffy, corporate |
| Helpful | Supportive, empowering | Patronizing |
| Clear | Direct, concise | Vague, wordy |
| Confident | Assured, trustworthy | Arrogant, overselling |

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Marketing | Engaging, benefit-focused | "Create campaigns that convert." |
| Documentation | Clear, instructional | "Run the command to start." |
| Error messages | Calm, solution-focused | "Try refreshing the page." |
| Success | Brief, celebratory | "Campaign published!" |

### Prohibited Terms

| Avoid | Reason |
|-------|--------|
| Revolutionary | Overused |
| Best-in-class | Vague claim |
| Seamless | Overused |
| Synergy | Corporate jargon |
| Leverage | Use "use" instead |

---

## 5. Imagery Guidelines

### Photography Style

- **Lighting:** Natural, soft lighting preferred
- **Subjects:** Real people, authentic scenarios
- **Color treatment:** Maintain brand colors in post
- **Composition:** Clean, focused subjects

### Illustrations

- Style: Modern, flat design with subtle gradients
- Colors: Brand palette only
- Line weight: 2px consistent stroke
- Corners: 4px rounded

### Icons

- Style: Outlined, 24px base grid
- Stroke: 1.5px consistent
- Corner radius: 2px
- Fill: None (outline only)

---

## 6. Design Components

### Buttons

| Type | Background | Text | Border Radius |
|------|------------|------|---------------|
| Primary | #2563EB | #FFFFFF | 8px |
| Secondary | Transparent | #2563EB | 8px |
| Tertiary | Transparent | #6B7280 | 8px |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Compact elements |
| md | 16px | Standard spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |
| 2xl | 48px | Section dividers |

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 12px |
| Inputs | 8px |
| Modals | 16px |
| Pills/Tags | 9999px |

---

## AI Image Generation

### Base Prompt Template

Always prepend to image generation prompts:

```
{DESCRIBE YOUR VISUAL STYLE HERE - mood, colors with hex codes, lighting, atmosphere}
```

### Style Keywords

| Category | Keywords |
|----------|----------|
| **Lighting** | {e.g., soft lighting, dramatic, natural} |
| **Mood** | {e.g., professional, energetic, calm} |
| **Composition** | {e.g., centered, rule of thirds, minimal} |
| **Treatment** | {e.g., high contrast, muted, vibrant} |
| **Aesthetic** | {e.g., modern, vintage, minimalist} |

### Visual Mood Descriptors

- {Mood descriptor 1}
- {Mood descriptor 2}
- {Mood descriptor 3}

### Visual Don'ts

| Avoid | Reason |
|-------|--------|
| {Item to avoid} | {Why to avoid it} |

### Example Prompts

**Hero Banner:**
```
{Example prompt for hero banners}
```

**Social Media Post:**
```
{Example prompt for social graphics}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | {DATE} | Initial guidelines |
