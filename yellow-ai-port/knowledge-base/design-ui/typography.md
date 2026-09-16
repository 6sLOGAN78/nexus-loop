# Skill: typography

**Category:** design-ui

**Cursor invoke:** `/typography`

---


## SKILL: SKILL.md

# UI Typography Skill

## Attribution

These rules are distilled from **Matthew Butterick's *Practical Typography*** (https://practicaltypography.com).
Butterick is a typographer, writer, and type designer whose work bridges professional typography and everyday
digital writing. Thank you, Matthew, for making this knowledge accessible and encyclopedic. If you find this
skill valuable, consider supporting his work directly.

## Mode of Operation

These are **permanent rules** — not trends, not opinions. They come from centuries of typographic practice,
validated by how the human eye reads. They do not go out of style.

**ENFORCEMENT (default):** When generating ANY UI with visible text, apply every rule automatically. Use
correct HTML entities, proper CSS. Do not ask permission. Do not explain. Just produce correct typography.

**AUDIT:** When reviewing existing code or design, identify violations and provide before/after fixes.

**Reference files** (read when generating CSS or looking up entities):
- `references/css-templates.md` — Full CSS baseline template, responsive patterns, OpenType features
- `references/html-entities.md` — Complete entity table with all characters and codes

---

## Characters

### Quotes and Apostrophes — Always Curly

Straight quotes are typewriter artifacts. Use `&ldquo;` `&rdquo;` for double, `&lsquo;` `&rsquo;` for single.

Apostrophes always point down — identical to closing single quote `&rsquo;`. Smart-quote engines wrongly
insert opening quotes before decade abbreviations ('70s) and word-initial contractions ('n'). Fix with
explicit `&rsquo;`.

The `<q>` tag auto-applies curly quotes when `<html lang="en">` is set.

Hawaiian okina points upward — it's a letter, not an apostrophe. Use opening single quote or anglicize.

### JSX/React Implementation Warning

**Unicode escape sequences (`\u2019`, `\u201C`, etc.) do NOT work in JSX text content.** They render
as literal characters — the user sees `\u2019` instead of a curly apostrophe. This is because JSX text
between tags is treated as string literals by the transpiler, not as JavaScript expressions.

**What fails:**
```jsx
{/* WRONG — renders literally as \u2019 */}
<p>Don\u2019t do this</p>
```

**What works (pick one):**

1. **Actual UTF-8 characters (preferred):** Paste the real character directly into the source file.
   ```jsx
   <p>Don\u2019t do this</p>  {/* This is the actual curly apostrophe character U+2019 */}
   ```

2. **JSX expression with string literal:** Wrap in curly braces so the JS engine interprets the escape.
   ```jsx
   <p>Don{'\u2019'}t do this</p>
   ```

3. **HTML entity (HTML files only):** Use `&rsquo;` — but this does NOT work in JSX/React.

**For bulk fixes via CLI**, use `sed` with raw UTF-8 bytes (not escape sequences):
```bash
CURLY=$(printf '\xe2\x80\x99')  # U+2019 RIGHT SINGLE QUOTATION MARK
sed -i '' "s/don't/don${CURLY}t/g" file.tsx
```

**In JavaScript data arrays and string literals**, `\u2019` works correctly because the JS engine
processes the escape. The bug only affects JSX text content between tags.

### Dashes and Hyphens — Three Distinct Characters

| Character | HTML | Use |
|-----------|------|-----|
| - (hyphen) | `-` | Compound words (cost-effective), line breaks |
| – (en dash) | `&ndash;` | Ranges (1–10), connections (Sarbanes–Oxley Act) |
| — (em dash) | `&mdash;` | Sentence breaks—like this |

Never approximate with `--` or `---`. If you open with "from", pair with "to" not en dash. Hyphen for
compound names (marriage); en dash for joint authorship. Em dash typically flush; add `&thinsp;` if crushed.
No slash where en dash belongs. Hyphenate phrasal adjectives (five-dollar bills). No hyphen after -ly adverbs.

### Ellipses — One Character

Use `&hellip;` (…), not three periods. Spaces before and after; use `&nbsp;` on the text-adjacent side.
For interrupted dialogue, prefer em dash over ellipsis.

### Math and Measurement

Use `&times;` for multiplication, `&minus;` for subtraction. Use `+` and `=` from keyboard.
En dash is acceptable as simple minus. Dimensions: 8.5″ × 14″ uses `&times;`.

**Foot and inch marks** — the ONE exception to curly quotes. Must be STRAIGHT: `&#39;` for foot,
`&quot;` for inch. Use `&nbsp;` between values: `6&#39;&nbsp;10&quot;`.

### Trademark and Copyright

Use real symbols: `&copy;` `&trade;` `&reg;`, never (c) (TM) (R). ™/® are superscripts, no space before.
© is inline, followed by `&nbsp;` then year. "Copyright ©" is redundant — word OR symbol, not both.

### Paragraph and Section Marks

`&sect;` (§) and `&para;` (¶) always followed by `&nbsp;`: `&sect;&nbsp;1782`. Spell out at sentence start.
Double for plurals: `&sect;&sect;`.

### Accented Characters

Proper names: accents are MANDATORY (François Truffaut, Plácido Domingo). Loanwords: check dictionary —
some naturalized (naive), some not (cause célèbre).

### Other Punctuation

- **Semicolons** join independent clauses. **Colons** introduce completion. Don't mix them
- **Question marks**: underused — simplify topic sentences with them
- **Exclamation points**: overused — budget ONE per long document. Never multiple in a row
- **Ampersands**: correct in proper names only. Write "and" in body text
- **Parentheses/brackets**: do NOT adopt formatting of surrounded material
- **Emoticons/emoji**: OK in email/Slack. Never in formal documents or professional UI copy

---

## Spacing

### One Space After Punctuation — Always

Exactly one space after any punctuation. Never two. Not debatable. Two spaces create rivers and
disrupt text balance. The period already contains visual white space.

### Nonbreaking Spaces

`&nbsp;` prevents line break. Use before numeric refs (`&sect;&nbsp;42`, `Fig.&nbsp;3`), after ©
(`&copy;&nbsp;2025`), after honorifics (`Dr.&nbsp;Smith`), between foot/inch values.

### White-Space Characters

| Need | Tool |
|------|------|
| Space between words | One word space (spacebar) |
| Prevent line break | `&nbsp;` |
| New line, same paragraph | `<br>` |
| New paragraph | `<p>` tags |
| New page (print) | `page-break-before: always` |
| Suggest hyphenation point | `&shy;` |

Never hold spacebar. Never double carriage returns for spacing. Never tabs for indentation in output.
HTML collapses all whitespace to single space (except `&nbsp;`).

---

## Text Formatting

### Bold and Italic

**Rule 1**: Bold OR italic. Mutually exclusive. Never combine.
**Rule 2**: Use as little as possible. If everything is emphasized, nothing is.

Serif: italic for gentle, bold for strong. Sans serif: bold only — italic sans barely stands out.
Never bold entire paragraphs. Never use quotation marks for emphasis.

### Underlining — Never

Never underline in a document or UI. Typewriter workaround. Use bold or italic. For web links,
use subtle styling: `text-decoration-thickness: 1px; text-underline-offset: 2px`.

### All Caps — Less Than One Line, Always Letterspaced

Caps are harder to read (homogeneous rectangles vs varied lowercase contour). Suitable for short
headings, labels, captions. **ALWAYS** add 5–12% letterspacing. **ALWAYS** ensure kerning is on.
**NEVER** capitalize whole paragraphs. `letter-spacing: 0.06em` in CSS.

### Small Caps — Real Only

Never fake (scaled-down regular caps). Use `font-variant-caps: small-caps` with fonts that have
real small caps (OpenType `smcp`). System fonts lack them. Add letterspacing + kerning.

### Point Size

Print: 10–12pt. Web: 15–25px. The 12pt default is a typewriter relic. Half-point differences
matter. Use smallest increment for emphasis. Use `clamp()` for fluid web sizing.

### Letterspacing

5–12% extra on ALL CAPS and small caps. Nothing on lowercase. Never spread so far apart that
letters could fit in the gaps. CSS: `letter-spacing: 0.05em` to `0.12em`.

### Kerning — Always On

No exceptions. `font-feature-settings: "kern" 1; text-rendering: optimizeLegibility;`

### Ligatures

Mandatory only when fi/fl visually collide. Check bold and italic too. Otherwise optional.
CSS: `font-feature-settings: "liga" 1`.

### Alternate Figures

Tabular (`"tnum"`) for data tables. Oldstyle (`"onum"`) for body text. Default figures are fine
for most uses. `font-variant-numeric: tabular-nums lining-nums` for numeric tables.

### Font Selection

1. No goofy fonts (novelty, script, handwriting, circus) in professional work
2. No monospaced for body text — code only (and Courier is the worst monospaced)
3. Print body: strongly prefer serif
4. Web body: serif or sans both fine on modern screens
5. Metrics spacing in InDesign, never optical (optical mangles kerning)

### Mixing Fonts

Max 2 fonts. Each gets a consistent role. Can mix serif+serif or sans+sans. Rarely mix within
a paragraph. Lower contrast often more effective than high contrast.

---

## Page Layout

### Body Text First

Set body text BEFORE anything else. Four decisions determine everything: font, point size,
line spacing, line length. All other elements calibrate against these.

### Line Length — 45–90 Characters

The #1 readability factor designers get wrong. The #1 flaw in responsive web layouts.
Measure in characters, not inches. Alphabet test: fit 2–3 lowercase alphabets per line.
CSS: `max-width: 65ch` on text containers.

### Line Spacing — 120–145% of Point Size

`line-height: 1.2` to `1.45`. Single-spaced (~117%) is too tight. Double (~233%) is too loose.
Word processor "Single" and "Double" both miss the optimal range.

### Page Margins

One inch is not enough for proportional fonts. Print: 1.5–2.0″ at 12pt. Web: `max-width` on
text containers plus `padding`. Don't fear white space — generous margins look professional.

### Text Alignment

Left-align for web (default). Justified requires `hyphens: auto` — browser engines are crude.
Centered: sparingly, only for short titles (< 1 line). Never center whole text blocks.

### Paragraph Separation — Indent OR Space, Never Both

**First-line indent**: 1–4× point size. `text-indent: 1.5em`. Optional on first paragraph.
**Space between**: 50–100% of font size. `margin-bottom: 0.75em`. Never double `<br>` tags.

### Headings — Max 3 Levels

1. Don't all-caps headings (unless very short + letterspaced)
2. Don't underline headings
3. Don't center headings (rare exceptions)
4. Emphasize with **space above and below** — subtle and effective
5. Use **bold, not italic** — stands out better
6. Smallest point-size increment needed (body 11pt → heading 13pt, not 18pt)
7. `hyphens: none` on headings
8. Space above > space below (heading relates to text that follows)
9. Keep heading with next paragraph (`page-break-after: avoid`)
10. Tiered numbers (1.1, 2.1) over roman numerals (I.A.1.a.i)

### Block Quotations

Reduce size + line spacing slightly. Indent 2–5em. No quotation marks (indent signals the quote).
Keep line length readable. Use sparingly — long block quotes signal lazy writing.

### Lists

Semantic markup (`<ul>`, `<ol>`), never manual bullets. Prefer hollow bullets. Asterisks are too
small for bullets. Don't over-indent.

### Tables — Remove Borders, Add Padding

Data creates an implied grid. Borders add clutter. Keep only thin rule under header row.
`padding: 0.5em 1em`. Tabular figures for numeric columns. Right-align numbers.

### Rules and Borders

Try space above and below first. Border thickness: 0.5–1pt. No patterned borders. Thick lines
are chartjunk.

### Flow Control

Widows (last line alone at top of page) and orphans (first line alone at bottom). CSS print:
`orphans: 2; widows: 2`. Headings: `page-break-after: avoid`. Soft hyphens `&shy;` for
words that confuse hyphenation engines.

### Columns and Grids

Print columns: 2–3 on letter paper, never 4. Web columns: awkward (indefinite bottom edge).
Grids guide, not guarantee — simpler grids enforce more consistency. Aligning ugly to a grid
still produces ugly.

---

## Responsive Web Typography

**The rules don't change with screen size.** Same line length, line spacing, hierarchy.

1. Scale `font-size` and container `width` together
2. Always `max-width` on text containers — never edge-to-edge text
3. Don't use `ch` unit for exact measurement (only measures zero width)
4. `clamp()` for fluid scaling: `font-size: clamp(16px, 2.5vw, 20px)`
5. Mobile minimum: `padding: 0 1rem` on text containers
6. The common failure: images/nav scale carefully, body text ignored

---

## Screen Considerations

Modern screens render type nearly as well as print. "Sans serif for screens" was true for 72dpi
and is now obsolete. Serif fonts work fine on modern screens. Dark mode: reduce weight slightly.
Test on macOS and Windows (antialiasing differs).

---

## Maxims of Page Layout

1. **Body text first** — its 4 properties determine everything
2. **Foreground vs background** — don't let chrome upstage body text
3. **Smallest visible increments** — half-points matter
4. **When in doubt, try both** — make samples, don't theorize
5. **Consistency** — same things look the same
6. **Relate new to existing** — each element constrains the next
7. **Keep it simple** — 3 colors and 5 fonts? Think again
8. **Imitate what you like** — emulate good typography from the wild


## REF: css-templates.md

# CSS Typography Templates

Read this file when generating CSS for any web project, building a design system, or auditing
existing stylesheets. These templates encode every layout and formatting rule from the skill.

---

## Complete Baseline Template

Copy-paste starting point. Every property maps to a specific typographic rule.

```css
/* =============================================
   TYPOGRAPHY BASELINE
   Rules from Practical Typography (Butterick)
   ============================================= */

*, *::before, *::after { box-sizing: border-box; }

html {
  font-size: clamp(16px, 2.5vw, 20px);       /* 15–25px range, fluid */
  -webkit-text-size-adjust: 100%;              /* prevent iOS resize */
}

body {
  font-family: /* your-font, */ Georgia, 'Times New Roman', serif;
  line-height: 1.38;                           /* 120–145% sweet spot */
  color: #1a1a1a;
  background: #fefefe;
  text-rendering: optimizeLegibility;          /* enables kern + liga */
  font-feature-settings: "kern" 1, "liga" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ---- TEXT CONTAINER: LINE LENGTH CONTROL ---- */

main, article, .prose {
  max-width: min(65ch, 90vw);                  /* 45–90 chars enforced */
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
}

/* ---- PARAGRAPHS ---- */
/* Choose ONE: space-between OR first-line-indent. Never both. */

/* Option A: Space between (default for web) */
p { margin: 0 0 0.75em 0; }                   /* 50–100% of font size */

/* Option B: First-line indent (uncomment to use instead)
p { margin: 0; }
p + p { text-indent: 1.5em; }
*/

/* ---- HEADINGS: SUBTLE, SPACED, BOLD ---- */

h1, h2, h3, h4 {
  line-height: 1.15;                           /* tighter than body */
  hyphens: none;                               /* never hyphenate headings */
  page-break-after: avoid;                     /* keep with next paragraph */
  font-weight: 700;                            /* bold, not italic */
}
h1 {
  font-size: 1.5em;                            /* smallest increment needed */
  margin: 2.5em 0 0.5em;                       /* space above > below */
}
h2 {
  font-size: 1.25em;
  margin: 2em 0 0.4em;
}
h3 {
  font-size: 1.1em;
  margin: 1.5em 0 0.3em;
}

/* ---- EMPHASIS ---- */

em { font-style: italic; }                     /* gentle emphasis (serif) */
strong { font-weight: 700; }                   /* strong emphasis */
/* NEVER: strong em, em strong, or u for emphasis */

/* ---- ALL CAPS: ALWAYS LETTERSPACED ---- */

.caps {
  text-transform: uppercase;
  letter-spacing: 0.06em;                      /* 5–12% range */
  font-feature-settings: "kern" 1;
}

/* ---- SMALL CAPS: REAL ONLY ---- */

.small-caps {
  font-variant-caps: small-caps;               /* requires font with smcp */
  letter-spacing: 0.05em;
  font-feature-settings: "smcp" 1, "kern" 1;
}

/* ---- BLOCK QUOTES ---- */

blockquote {
  margin: 1.5em 2em;                           /* indent 2–5em */
  font-size: 0.92em;                           /* slightly smaller */
  line-height: 1.3;
}

/* ---- TABLES: CLEAN, NOT CLUTTERED ---- */

table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  padding: 0.5em 1em;                          /* generous cell padding */
  text-align: left;
  vertical-align: top;
  border: none;                                /* remove cell borders */
}
thead th {
  border-bottom: 1.5px solid currentColor;     /* thin rule under header */
  font-weight: 600;
}

/* Numeric data tables: tabular lining figures */
.data-table td {
  font-feature-settings: "tnum" 1, "lnum" 1;
  font-variant-numeric: tabular-nums lining-nums;
}

/* ---- LISTS ---- */

ul, ol {
  padding-left: 1.5em;
  margin: 0 0 1em;
}
li { margin-bottom: 0.3em; }

/* ---- HORIZONTAL RULES ---- */

hr {
  border: none;
  border-top: 1px solid currentColor;          /* 0.5–1pt, no patterns */
  opacity: 0.3;
  margin: 2em 0;
}

/* ---- LINKS ---- */

a {
  color: inherit;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;              /* subtle, not heavy */
  text-underline-offset: 2px;
}
a:hover { opacity: 0.8; }

/* ---- CODE ---- */

code {
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 0.88em;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  background: rgba(0,0,0,0.04);
}
pre code {
  display: block;
  padding: 1em;
  overflow-x: auto;
  line-height: 1.5;
}

/* ---- RESPONSIVE ---- */

@media (max-width: 600px) {
  blockquote { margin: 1em 1em; }
  table { font-size: 0.9em; }
  th, td { padding: 0.4em 0.6em; }
}

/* ---- PRINT ---- */

@media print {
  body { font-size: 11pt; line-height: 1.3; }
  main { max-width: none; }
  h1, h2, h3 { page-break-after: avoid; }
  p { orphans: 2; widows: 2; }
}
```

---

## Responsive Typography Patterns

### Fluid Typography with Clamp

```css
body {
  font-size: clamp(16px, 2.5vw, 20px);
}
main {
  max-width: min(65ch, 90vw);
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
}
h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
h2 { font-size: clamp(1.25rem, 3vw, 1.75rem); }
```

### Breakpoint-Based Alternative

```css
body { font-size: 16px; }
@media (min-width: 600px)  { body { font-size: 17px; } }
@media (min-width: 900px)  { body { font-size: 18px; } }
@media (min-width: 1200px) { body { font-size: 19px; } }
```

### Key Principles

1. Scale `font-size` and container `width` together
2. Always `max-width` on text containers — never edge-to-edge
3. Don't use `ch` unit for exact line length (only measures zero width)
4. Use `vw` units with `clamp()` for bounds
5. Mobile minimum: `padding: 0 1rem` on text containers

---

## OpenType Features Reference

```css
/* Body text */
.body {
  font-feature-settings:
    "kern" 1,       /* kerning pairs — always on */
    "liga" 1,       /* standard ligatures */
    "calt" 1;       /* contextual alternates */
}

/* Body text with oldstyle figures */
.prose {
  font-feature-settings:
    "kern" 1, "liga" 1, "calt" 1,
    "onum" 1;       /* oldstyle (lowercase-height) numbers */
}

/* Data tables */
.data-table td {
  font-feature-settings:
    "kern" 1,
    "tnum" 1,       /* tabular (fixed-width) numbers */
    "lnum" 1;       /* lining (capital-height) numbers */
}

/* Small caps */
.small-caps {
  font-feature-settings:
    "kern" 1,
    "smcp" 1;       /* real small caps */
  letter-spacing: 0.05em;
}

/* All caps with capital spacing */
.all-caps {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-feature-settings:
    "kern" 1,
    "cpsp" 1;       /* capital spacing (if font supports) */
}
```

---

## Dark Mode Considerations

```css
@media (prefers-color-scheme: dark) {
  body {
    color: #e0e0e0;
    background: #1a1a1a;
    font-weight: 350;           /* slightly lighter — dark bg makes text appear heavier */
    -webkit-font-smoothing: auto; /* let system decide in dark mode */
  }
}
```

---

## React/JSX Inline Pattern

When generating React components with text, apply entities directly:

```jsx
// WRONG
<h2>IMPORTANT NOTICE</h2>
<p>"Hello," she said. "It's a beautiful day..."</p>
<p>Price: $12 x 4 = $48</p>
<p>Pages 1-10</p>

// RIGHT
<h2 style={{ letterSpacing: '0.05em' }}>IMPORTANT NOTICE</h2>
<p>&ldquo;Hello,&rdquo; she said. &ldquo;It&rsquo;s a beautiful day&hellip;&rdquo;</p>
<p>Price: $12 &times; 4 = $48</p>
<p>Pages 1&ndash;10</p>
```


## REF: html-entities.md

# HTML Entity & Character Reference

Read this file when you need to look up the correct HTML entity for a character, or when auditing
existing HTML for incorrect character usage.

---

## Quick Substitution Table

When generating HTML/JSX, substitute these characters automatically:

| If you see | Replace with | Entity | Rule |
|------------|-------------|--------|------|
| "straight double" | "curly double" | `&ldquo;` `&rdquo;` | Always curly quotes |
| 'straight single' | 'curly single' | `&lsquo;` `&rsquo;` | Always curly quotes |
| it's (straight) | it's (curly) | `&rsquo;` | Apostrophe = closing single quote |
| -- | – | `&ndash;` | En dash for ranges |
| --- | — | `&mdash;` | Em dash for breaks |
| ... | … | `&hellip;` | Single ellipsis character |
| (c) | © | `&copy;` | Real copyright symbol |
| (TM) | ™ | `&trade;` | Real trademark symbol |
| (R) | ® | `&reg;` | Real registered symbol |
| 12 x 34 | 12 × 34 | `&times;` | Real multiplication sign |
| 56 - 12 (math) | 56 − 12 | `&minus;` | Real minus sign |
| 6' 10" (curly, in measurements) | 6' 10" (straight) | `&#39;` `&quot;` | Foot/inch must be straight |

---

## Complete Entity Table

### Quotes and Apostrophes

```
&ldquo;   "   U+201C   opening double quote
&rdquo;   "   U+201D   closing double quote
&lsquo;   '   U+2018   opening single quote
&rsquo;   '   U+2019   closing single quote / apostrophe
&quot;    "   U+0022   straight double quote (inch mark only)
&#39;     '   U+0027   straight single quote (foot mark only)
```

### Dashes

```
-              U+002D   hyphen (compound words, line breaks)
&ndash;   –   U+2013   en dash (ranges: 1–10, connections: Sarbanes–Oxley)
&mdash;   —   U+2014   em dash (sentence breaks—like this)
&shy;          U+00AD   soft/optional hyphen (invisible break suggestion)
```

### Symbols

```
&hellip;  …   U+2026   ellipsis
&times;   ×   U+00D7   multiplication sign
&minus;   −   U+2212   minus sign
&divide;  ÷   U+00F7   division sign
&plusmn;  ±   U+00B1   plus-minus sign
&copy;    ©   U+00A9   copyright
&trade;   ™   U+2122   trademark
&reg;     ®   U+00AE   registered trademark
&para;    ¶   U+00B6   paragraph mark (pilcrow)
&sect;    §   U+00A7   section mark
&amp;     &   U+0026   ampersand
&deg;     °   U+00B0   degree sign
```

### Spaces

```
&nbsp;         U+00A0   nonbreaking space (prevents line break)
&thinsp;       U+2009   thin space (half word-space width)
&ensp;         U+2002   en space (half em width)
&emsp;         U+2003   em space (full em width)
&hairsp;       U+200A   hair space (thinnest space)
```

### Primes (Foot/Inch/Minute/Second)

```
&#39;     '   U+0027   foot mark / minute mark (straight single)
&quot;    "   U+0022   inch mark / second mark (straight double)
&prime;   ′   U+2032   true prime (if font supports — sloped)
&Prime;   ″   U+2033   true double prime (if font supports — sloped)
```

### Arrows and Misc

```
&larr;    ←   U+2190   left arrow
&rarr;    →   U+2192   right arrow
&uarr;    ↑   U+2191   up arrow
&darr;    ↓   U+2193   down arrow
&bull;    •   U+2022   bullet
&middot;  ·   U+00B7   middle dot
&laquo;   «   U+00AB   left guillemet
&raquo;   »   U+00BB   right guillemet
```

---

## Common Accented Characters

Always preserve accents in proper names. These are the most frequently needed:

```
&eacute;  é       &Eacute;  É
&egrave;  è       &Egrave;  È
&aacute;  á       &Aacute;  Á
&agrave;  à       &Agrave;  À
&iacute;  í       &Iacute;  Í
&oacute;  ó       &Oacute;  Ó
&uacute;  ú       &Uacute;  Ú
&uuml;    ü       &Uuml;    Ü
&ouml;    ö       &Ouml;    Ö
&ccedil;  ç       &Ccedil;  Ç
&ntilde;  ñ       &Ntilde;  Ñ
&szlig;   ß       (Eszett — or just use ss)
```

---

## Contextual Usage Patterns

### Quoted Text
```html
<p>&ldquo;She said &lsquo;hello&rsquo; to me,&rdquo; he reported.</p>
```

### Decade Abbreviations (apostrophe pointing down)
```html
<p>In the &rsquo;70s, rock &rsquo;n&rsquo; roll dominated.</p>
```

### Ranges and Connections
```html
<p>Pages 4&ndash;8</p>
<p>The Sarbanes&ndash;Oxley Act</p>
<p>The 2020&ndash;2025 period</p>
```

### Sentence Breaks
```html
<p>The em dash puts a nice pause in text&mdash;and is underused.</p>
```

### Legal/Academic References
```html
<p>Under &sect;&nbsp;1782, the seller may offer a refund.</p>
<p>See &para;&nbsp;49 of the contract.</p>
```

### Copyright and Trademark
```html
<footer>&copy;&nbsp;2025 MegaCorp&trade;</footer>
```

### Measurements
```html
<p>The room is 12&#39;&nbsp;6&quot; &times; 8&#39;&nbsp;10&quot;.</p>
```

### Math
```html
<p>12 &times; 34 &minus; 56 = 352</p>
```

### Ellipsis with Nonbreaking Space
```html
<p>From A&nbsp;&hellip; to Z</p>
```
