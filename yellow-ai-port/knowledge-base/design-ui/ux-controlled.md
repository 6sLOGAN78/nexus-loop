# Skill: ux-controlled

**Category:** design-ui

**Cursor invoke:** `/ux-controlled`

---


## SKILL: SKILL.md

# UX Designer

Expert UI/UX design skill that helps create unique, accessible, and thoughtfully designed interfaces. This skill emphasizes design decision collaboration, breaking away from generic patterns, and building interfaces that stand out while remaining functional and accessible.

## Core Philosophy

**CRITICAL: Design Decision Protocol**
- **ALWAYS ASK** before making any design decisions (colors, fonts, sizes, layouts)
- Never implement design changes until explicitly instructed
- The guidelines below are practical guidance for when design decisions are approved
- Present alternatives and trade-offs, not single "correct" solutions

## Foundational Design Principles

### Stand Out From Generic Patterns

**Avoid Generic Training Dataset Patterns:**
- Don't default to "Claude style" designs (excessive bauhaus, liquid glass, apple-like)
- Don't use generic SaaS aesthetics that look machine-generated
- Don't rely only on solid colors - suggest photography, patterns, textures
- Think beyond typical patterns - you can step off the written path

**Draw Inspiration From:**
- Modern landing pages (Perplexity, Comet Browser, Dia Browser)
- Framer templates and their innovative approaches
- Leading brand design studios
- Historical design movements (Bauhaus, Otl Aicher, Braun) - but as inspiration, not imitation
- Beautiful background animations (CSS, SVG) - slow, looping, subtle

**Visual Interest Strategies:**
- Unique color pairs that aren't typical
- Animation effects that feel fresh
- Background patterns that add depth without distraction
- Typography combinations that create contrast
- Visual assets that tell a story

### Core Design Philosophy

1. **Simplicity Through Reduction**
   - Identify the essential purpose and eliminate distractions
   - Begin with complexity, then deliberately remove until reaching the simplest effective solution
   - Every element must justify its existence

2. **Material Honesty**
   - Digital materials have unique properties - embrace them
   - Buttons should communicate affordance through color, spacing, and typography (not shadows)
   - Cards use borders and background differentiation (not depth effects)
   - Animations follow real-world physics principles adapted to digital responsiveness

   **Examples:**
   - Clickable: Use distinct colors, hover state changes, cursor feedback
   - Containers: Use subtle borders (1px), background color shifts, or generous padding
   - Hierarchy: Use scale, weight, and spacing rather than elevation

3. **Functional Layering (Not Visual Depth)**
   - Create hierarchy through typography scale, color contrast, and spatial relationships
   - Layer information conceptually (primary → secondary → tertiary)
   - Reject skeuomorphic shadows/gradients that imitate physical depth
   - Embrace functional depth: modals over content, dropdowns over UI

4. **Obsessive Detail**
   - Consider every pixel, interaction, and transition
   - Excellence emerges from hundreds of small, intentional decisions
   - Balance: Details should serve simplicity, not complexity
   - When detail conflicts with clarity, clarity wins

5. **Coherent Design Language**
   - Every element should visually communicate its function
   - Elements should feel part of a unified system
   - Nothing should feel arbitrary

6. **Invisibility of Technology**
   - The best technology disappears
   - Users should focus on content and goals, not on understanding the interface

### What This Means in Practice

**Color Usage:**
- Base palette: 4-5 neutral shades (backgrounds, borders, text)
- Accent palette: 1-3 bold colors (CTAs, status, emphasis)
- Neutrals are slightly desaturated, warm or cool based on brand intent
- Accents are saturated enough to create clear contrast

**Typography:**
- Headlines: Emotional, attention-grabbing (personality over pure legibility)
- Body/UI: Functional, highly legible (clarity over expression)
- 2-3 typefaces maximum
- Clear mathematical scale (e.g., 1.25x between sizes)

**Animation:**
- Purposeful: Guides attention, establishes relationships, provides feedback
- Subtle: Felt rather than seen (100-300ms for most interactions)
- Physics-informed: Natural easing, appropriate mass/momentum

**Spacing:**
- Generous negative space creates clarity and breathing room
- Mathematical relationships (e.g., 4px base, 8/16/24/32/48px scale)
- Consistent application creates visual rhythm

### Design Decision Checklist

Before presenting any design, verify:

1. **Purpose**: Does every element serve a clear function?
2. **Hierarchy**: Is visual importance aligned with content importance?
3. **Consistency**: Do similar elements look and behave similarly?
4. **Accessibility**: Does it meet WCAG AA standards? (contrast, touch targets, keyboard nav)
5. **Responsiveness**: Does it work on mobile, tablet, desktop?
6. **Uniqueness**: Does this break from generic SaaS patterns?
7. **Approval**: Have I asked before implementing colors, fonts, sizes, layouts?

**Design System Framework:**

For understanding what's fixed (universal rules), project-specific (brand personality), and adaptable (context-dependent) in your design system, see DESIGN-SYSTEM-TEMPLATE.md (meta-framework, project templates, decision trees).

## Visual Design Standards

### Color & Contrast

**Color System Architecture:**

Every interface needs two color roles:

1. **Base/Neutral Palette (4-5 colors):**
   - Backgrounds (lightest)
   - Surface colors (cards, inputs)
   - Borders and dividers
   - Text (darkest)
   - Use slightly desaturated, warm or cool greys based on brand

2. **Accent Palette (1-3 colors):**
   - Primary action (CTA buttons)
   - Status indicators (success, warning, error, info)
   - Focus/hover states
   - Use saturated colors for clear contrast against neutrals

**Palette Structure Example:**
```
Neutrals: slate-50, slate-100, slate-300, slate-700, slate-900
Accents: teal-500 (primary), amber-500 (warning), red-500 (error)
```

**Color Application Rules:**

- **Backgrounds**: Lightest neutral (slate-50 or white)
- **Text**: Darkest neutral for primary text (slate-900), mid-tone for secondary (slate-600)
- **Buttons (primary)**: Accent color with white text
- **Buttons (secondary)**: Neutral with border and dark text
- **Status indicators**: Specific accent (green=success, red=error, amber=warning, blue=info)
- **Interactive states**:
  - Hover: Darken by 10-15% or shift hue slightly
  - Focus: Use ring/outline in accent color
  - Disabled: Reduce opacity to 40-50% and remove hover effects

**Color Relationships:**

Choose warm or cool intentionally based on brand:
- **Warm greys** (beige/brown undertones): Organic, approachable, trustworthy
- **Cool greys** (blue undertones): Modern, tech-forward, professional

Accent colors should have clear contrast with both:
- Light backgrounds (for buttons on white)
- Dark text (if used as backgrounds for white text)

**Intentional Color Usage:**
- Every color must serve a purpose (hierarchy, function, status, or action)
- Avoid decorative colors that don't communicate meaning
- Maintain consistency: same color = same meaning throughout

**Accessibility:**
- Ensure sufficient contrast for color-blind users
- Follow WCAG 2.1 AA: minimum 4.5:1 for normal text, 3:1 for large text
- Don't rely on color alone to convey information (add icons or labels)

**Unique Color Strategy:**

To stand out from generic patterns:
- Avoid default SaaS blue (#3B82F6) unless it fits your brand
- Consider unexpected neutrals: warm greys, soft off-whites, deep charcoals
- Pair neutrals with distinctive accents: terracotta + charcoal, sage + navy, coral + slate
- Test combinations against "does this look AI-generated?" filter

### Typography Excellence

**Typography Philosophy:**

Typography is a primary design element that conveys personality and hierarchy.

**Functional vs Emotional Typography:**
- **Headlines/Display**: Prioritize emotion, personality, attention (legibility secondary)
- **Body Text**: Prioritize legibility, reading comfort, accessibility
- **UI/Labels**: Prioritize clarity, scannability, consistency

**Font Selection:**
- Use 2-3 typefaces maximum
- Limit to 3 weights per typeface (e.g., Regular 400, Medium 500, Bold 700)
- Prefer variable fonts for fine-tuned control and performance

**Font Version Usage:**
- **Display version**: Headlines and hero text only
- **Text version**: Paragraphs and long-form content
- **Caption/Micro**: Small UI labels (1-2 lines, non-critical info)

**Recommended Sources:**
- Google Fonts for web (free, well-optimized, reliable)
- System fonts for performance-critical apps (-apple-system, BlinkMacSystemFont, Segoe UI)
- Choose fonts that serve your brand's purpose (not "trending" lists)

**Typographic Scale:**

Use mathematical relationships for size hierarchy:
- **Ratio**: Major third (1.25x) for moderate contrast, Perfect fourth (1.333x) for dramatic
- **Base size**: 16px (1rem) for body text
- **Example scale (1.25x)**:
  ```
  xs:   0.64rem (10px)
  sm:   0.8rem  (13px)
  base: 1rem    (16px)
  lg:   1.25rem (20px)
  xl:   1.563rem (25px)
  2xl:  1.953rem (31px)
  3xl:  2.441rem (39px)
  4xl:  3.052rem (49px)
  5xl:  3.815rem (61px)
  ```

**Typographic Hierarchy:**
- Create clear visual distinction between levels
- Headlines, subheadings, body, captions should each have distinct size/weight
- Use combination of size, weight, and color for hierarchy

**Spacing & Readability:**
- **Line height**: 1.5x font size for body text (e.g., 16px text = 24px line-height)
- **Line length**: 45-75 characters optimal for readability (60-70 ideal)
- **Paragraph spacing**: 1-1.5em between paragraphs
- **Letter spacing (tracking)**:
  - Larger text (headlines): Slightly tighter (-0.02em to -0.05em)
  - Normal text (body): Default (0)
  - Small text (captions): Slightly looser (+0.01em to +0.03em)
  - General rule: As size increases, reduce tracking; as size decreases, increase tracking

**Font Pairing Logic:**

When using multiple typefaces, create contrast through:
- **Category contrast**: Serif + Sans-serif (classic, clear distinction)
- **Weight contrast**: Light + Bold (dynamic, energetic)
- **Personality contrast**: Geometric + Humanist (modern + warm)

Examples:
- Serif headlines + Sans body (editorial, trustworthy)
- Display headlines + System body (distinctive + efficient)
- Bold sans headlines + Light sans body (modern, clean)

**UI Typography:**

Specific guidance for interface elements:
- **Button text**: Semi-Bold (600), 14-16px, consistent casing (all-caps OR title case)
- **Form labels**: Regular (400), 14px, positioned above input
- **Form input text**: Regular (400), 16px minimum (prevents iOS zoom on focus)
- **Placeholder text**: Light (300) or desaturated color, same size as input
- **Error messages**: Regular (400), 12-14px, color-coded (red-ish)

**Responsive Typography:**

Scale type sizes across breakpoints:
```tsx
// Example with Tailwind
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive Headline
</h1>

// Or with CSS clamp (fluid)
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

Reduce sizes on mobile (20-30% smaller than desktop)
Reduce hierarchy levels on small screens (fewer distinct sizes)

### Layout & Spatial Design

**Compositional Balance:**
- Every screen should feel balanced
- Pay attention to visual weight and negative space
- Use generous negative space to focus attention
- Add sufficient margins and paddings for professional, spacious look

**Grid Discipline:**
- Maintain consistent underlying grid system
- Create sense of order while allowing meaningful exceptions
- Use grid/flex wrappers with `gap` for spacing
- Prioritize wrappers over direct margins/padding on children

**Spatial Relationships:**
- Group related elements through proximity, alignment, and shared attributes
- Use size, color, and spacing to highlight important elements
- Guide user focus through visual hierarchy

**Attention Guidance:**
- Design interfaces that guide user attention effectively
- Avoid cluttered interfaces where elements compete
- Create clear paths through the content

## Interaction Design

### Motion & Animation

**Purposeful Animation:**

Every animation must serve a functional purpose:
- **Orient users**: Smooth transitions during navigation changes
- **Establish relationships**: Show how elements connect (expand from source, slide between states)
- **Provide feedback**: Confirm interactions (button press, form submission)
- **Guide attention**: Direct focus to important changes (new messages, errors)

**Animation & Gestalt Principles:**

Motion should reinforce visual relationships:
- **Proximity**: Elements near each other move together (grouped cards animating)
- **Similarity**: Similar elements animate similarly (all buttons have same hover timing)
- **Continuity**: Movement follows natural paths (smooth curves, not jumpy angles)
- **Figure-ground**: Important elements animate while backgrounds stay stable

**Natural Physics:**

Animations should feel organic, not mechanical:
- **Easing**: Use ease-out for entrances (fast start, slow end)
- **Easing**: Use ease-in for exits (slow start, fast end)
- **Easing**: Use ease-in-out for transitions (smooth both ends)
- Avoid linear easing (feels robotic) except for continuous loops
- Apply appropriate mass/momentum (lightweight UI vs weighty modals)

**Subtle Restraint:**
- Animations should be felt rather than seen
- Don't delay user actions unnecessarily (keep under 300ms for interactive feedback)
- Never block critical actions with decorative animations
- Respect `prefers-reduced-motion` media query

**Timing Guidelines:**

- **Micro-interactions** (button press, checkbox toggle): 100-150ms
- **State changes** (expanding accordion, tab switch): 200-300ms
- **Page transitions** (route changes, modal open/close): 300-500ms
- **Attention-directing** (notification appearance, error highlight): 200-400ms

**Physics Profiles:**

Define consistent durations for element types:
- **Lightweight** (icons, small UI): 150ms
- **Standard** (cards, panels): 300ms
- **Weighty** (modals, page transitions): 500ms

**Performance Optimization:**

- Animate `transform` and `opacity` only (GPU-accelerated, smooth 60fps)
- Avoid animating `width`, `height`, `top`, `left`, `margin` (causes reflow/repaint)
- Use `will-change` sparingly for complex animations (pre-allocates GPU resources)
- Test on low-end devices (60fps on powerful hardware ≠ 60fps on mobile)

**Implementation:**
- Use `framer-motion` sparingly and purposefully
- Prefer CSS animations over JavaScript when possible (better performance)
- Use CSS transitions for simple hover/focus states
- Implement `@media (prefers-reduced-motion: reduce)` to disable/reduce animations

**Example:**
```tsx
// Simple hover transition
<button className="
  transition-colors duration-200 ease-out
  bg-blue-600 hover:bg-blue-700
">
  Click me
</button>

// Framer Motion for complex interaction
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>
```

**Motion Specification:**

For detailed motion specs, see MOTION-SPEC.md (easing curves, duration tables, state-specific animations, implementation patterns).

### User Experience Patterns

**Core UX Principles:**

1. **Direct Manipulation**
   - Users interact directly with content, not through abstract controls
   - Examples:
     - Drag & drop to reorder items (not up/down buttons)
     - Inline editing (click to edit, not separate form)
     - Sliders for ranges (not numeric input with +/-)
     - Pinch/zoom gestures on mobile (not +/- buttons)

2. **Immediate Feedback**
   - Every interaction provides instantaneous visual feedback (within 100ms)
   - Types of feedback:
     - **Visual**: Button pressed state, hover effects, color changes
     - **Haptic**: Vibration on mobile (submit, error, success)
     - **Audio**: Subtle sounds for critical actions (optional, user-controlled)
     - **Loading**: Skeleton screens, spinners for >300ms operations
     - **Success**: Checkmarks, green highlights, toast notifications
     - **Error**: Red highlights, inline error messages, shake animations

3. **Consistent Behavior**
   - Similar-looking elements behave similarly
   - Examples:
     - **Visual consistency**: All primary buttons have same colors, sizes, hover states
     - **Behavioral consistency**: All modals close via X button, ESC key, and outside click
     - **Interaction consistency**: All drag targets have same hover state and drop feedback
     - **Pattern consistency**: All forms validate on blur and submit

4. **Forgiveness**
   - Make errors difficult, but recovery easy
   - **Prevention strategies**:
     - Disable invalid actions (grey out unavailable buttons)
     - Validate inputs inline (before submission)
     - Confirm destructive actions (delete, overwrite)
     - Auto-save in background (drafts, progress)
   - **Recovery strategies**:
     - Undo/redo for all state changes
     - Soft deletes (trash/archive before permanent delete)
     - Clear error messages with actionable fixes
     - Preserve user input on errors (don't clear forms)

5. **Progressive Disclosure**
   - Reveal details as needed rather than overwhelming users
   - Levels of disclosure:
     - **Summary**: Show essential info by default (card title, price, rating)
     - **Details**: Expand to show more info (description, specs, reviews)
     - **Advanced**: Hide complex options behind "Advanced settings" toggle
   - Examples:
     - Accordion: Start collapsed, expand on click
     - Search filters: Show 3-5 common filters, hide rest behind "More filters"
     - Settings: Basic settings visible, advanced behind "Show advanced"

**Modern UX Patterns:**

1. **Conversational Interfaces**

   Prioritize natural language interaction where appropriate:

   **Four types:**
   - **Pure chat**: Full conversation (AI assistants, support bots)
   - **Command palette**: Text-based shortcuts (Cmd+K, search everywhere)
   - **Smart search**: Natural language queries (search "meetings next week" vs filtering)
   - **Form alternatives**: Conversational data collection ("What's your name?" vs form fields)

   **When to use:**
   - Complex searches with multiple variables
   - Task guidance (wizards, onboarding)
   - Contextual help
   - Quick actions (command palette)

   **When NOT to use:**
   - Simple forms (just use inputs)
   - Precise control interfaces (design tools, dashboards)
   - High-frequency repetitive tasks

2. **Adaptive Layouts**

   Respond to user context automatically:
   - **Time-based**: Dark mode at night, light during day
   - **Device-based**: Simplified UI on mobile, full features on desktop
   - **Connection-based**: Reduce images/video on slow connections
   - **Usage-based**: Prioritize frequent actions, hide rarely-used features

   Examples:
   - Auto dark/light mode based on time or system preference
   - Simplified mobile navigation (hamburger menu) vs full desktop nav
   - Collapsed sidebar on small screens, expanded on large

3. **Minimal, Flat Design**

   Current aesthetic preference:
   - No drop shadows (except subtle ones for modals/dropdowns)
   - No gradients for depth (use for accents/backgrounds if desired)
   - No glass morphism effects
   - Focus on typography, color, and spacing to create hierarchy
   - Functional depth: Layers of content (modals, sheets) use positioning, not visual depth

**Navigation:**
- Clear structure with intuitive navigation menus
- Implement breadcrumbs for deep hierarchies (more than 2 levels)
- Use standard UI patterns to reduce learning curve (hamburger menu, tab bars)
- Ensure predictable behavior (back button works, links look clickable)
- Maintain navigation context (highlight current page, preserve scroll position)

## Styling Implementation

### Component Library & Tools

**Component Library:**
- Strongly prefer shadcn components (v4, pre-installed in `@/components/ui`)
- Import individually: `import { Button } from "@/components/ui/button";`
- Use over plain HTML elements (`<Button>` over `<button>`)
- Avoid creating custom components with names that clash with shadcn

**Styling Engine:**
- Use Tailwind utility classes exclusively
- Adhere to theme variables in `index.css` via CSS custom properties
- Map variables in `@theme` (see `tailwind.config.js`)
- Use inline styles or CSS modules only when absolutely necessary

**Icons:**
- Use `@phosphor-icons/react` for buttons and inputs
- Example: `import { Plus } from "@phosphor-icons/react"; <Plus />`
- Use color for plain icon buttons
- Don't override default `size` or `weight` unless requested

**Notifications:**
- Use `sonner` for toasts
- Example: `import { toast } from 'sonner'`

**Loading States:**
- Always add loading states, spinners, placeholder animations
- Use skeletons until content renders

### Layout Implementation

**Spacing Strategy:**
- Use grid/flex wrappers with `gap` for spacing
- Prioritize wrappers over direct margins/padding on children
- Nest wrappers as needed for complex layouts

**Conditional Styling:**
- Use ternary operators or clsx/classnames utilities
- Example: `className={clsx('base-class', { 'active-class': isActive })}`

### Responsive Design

**Fluid Layouts:**
- Use relative units (%, em, rem) instead of fixed pixels
- Implement CSS Grid and Flexbox for flexible layouts
- Design mobile-first, then scale up

**Media Queries:**
- Use breakpoints based on content needs, not specific devices
- Test across range of devices and orientations

**Touch Targets:**
- Minimum 44x44 pixels for interactive elements
- Provide adequate spacing between touch targets
- Consider hover states for desktop, focus states for touch/keyboard

**Performance:**
- Optimize assets for mobile networks
- Use CSS animations over JavaScript
- Implement lazy loading for images and videos

## Accessibility Standards

**Core Requirements:**
- Follow WCAG 2.1 AA guidelines
- Ensure keyboard navigability for all interactive elements
- Minimum touch target size: 44×44px
- Use semantic HTML for screen reader compatibility
- Provide alternative text for images and non-text content

**Implementation Details:**
- Use descriptive variable and function names
- Event functions: prefix with "handle" (handleClick, handleKeyDown)
- Add accessibility attributes:
  - `tabindex="0"` for custom interactive elements
  - `aria-label` for buttons without text
  - `role` attributes when semantic HTML isn't sufficient
- Ensure logical tab order
- Provide visible focus states

## Design Process & Testing

### Design Workflow

1. **Understand Context:**
   - What problem are we solving?
   - Who are the users and when will they use this?
   - What are the success criteria?

2. **Explore Options:**
   - Present 2-3 alternative approaches
   - Explain trade-offs of each option
   - Ask which direction resonates

3. **Implement Iteratively:**
   - Start with structure and hierarchy
   - Add visual polish progressively
   - Test at each stage

4. **Validate:**
   - Use playwright MCP to test visual changes
   - Check across different screen sizes
   - Verify accessibility

### Testing Checklist

**Visual Testing:**
- Use playwright MCP when available for automated testing
- Check responsive behavior at common breakpoints
- Verify touch targets on mobile
- Test with different content lengths (short, long, edge cases)

**Accessibility Testing:**
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Ensure focus states are visible

**Cross-Device Testing:**
- Test on actual devices, not just emulators
- Check different browsers (Chrome, Firefox, Safari)
- Verify touch interactions on mobile
- Test landscape and portrait orientations

## Examples

### Example 1: Designing a Button

**Initial Question to Ask:**
```
Before I implement this button, I have a few design questions:
1. What's the primary action you want to emphasize?
2. Do you have brand colors in mind, or should I suggest options?
3. What emotion should this button convey? (urgent, calm, playful, professional)
```

**After Getting Approval, Implementation:**
```tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react";

<Button
  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
>
  Get Started
  <ArrowRight className="ml-2" />
</Button>
```

### Example 2: Typography Hierarchy

**Question First:**
```
For this content hierarchy, I'm thinking:
- Headline: Large, bold, attention-grabbing
- Subheading: Medium, regular weight
- Body: Smaller, optimized for reading

Should we go bold and contemporary, or subtle and refined?
```

**Implementation After Approval:**
```tsx
<div className="space-y-4">
  <h1 className="text-5xl font-bold tracking-tight text-slate-900">
    Headline Here
  </h1>
  <h2 className="text-2xl text-slate-600">
    Supporting subheading
  </h2>
  <p className="text-base leading-relaxed text-slate-700">
    Body text optimized for readability with proper line height.
  </p>
</div>
```

### Example 3: Unique Color Palette Suggestion

**Presenting Options:**
```
I'd like to suggest three color directions that break from typical SaaS patterns:

1. **Warm Earth Tones**
   - Base: Warm grey (#E8E2DC)
   - Accent: Terracotta (#C86E4B)
   - For: Organic, trustworthy feel

2. **Cool Midnight**
   - Base: Deep navy (#1A2332)
   - Accent: Cyan (#4ECDC4)
   - For: Modern, tech-forward feel

3. **Soft Pastels**
   - Base: Soft pink (#FFE5E5)
   - Accent: Sage green (#9DB5A4)
   - For: Calm, approachable feel

Which direction feels right for your brand?
```

## Common Patterns to Avoid

❌ **Don't:**
- Use generic SaaS blue (#3B82F6) without considering alternatives
- Default to shadows and gradients for depth
- Copy Apple's design language
- Use glass morphism effects
- Make design decisions without asking
- Implement typography without considering the font version
- Use animations that delay user actions
- Create cluttered interfaces with competing elements

✅ **Do:**
- Ask before making design decisions
- Suggest unique, contextually appropriate color pairs
- Use flat, minimal design
- Consider unconventional typography choices
- Provide immediate feedback for interactions
- Create generous white space
- Test with real devices
- Validate accessibility

## Version History

- v1.0.0 (2025-10-18): Initial release with comprehensive UI/UX design guidance

## References

For additional context, see:
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Google Fonts: https://fonts.google.com/
- Tailwind CSS Docs: https://tailwindcss.com/docs
- Shadcn UI Components: https://ui.shadcn.com/


## REF: ACCESSIBILITY.md

# Accessibility Reference

Comprehensive guide for implementing accessible interfaces following WCAG 2.1 AA standards.

## Core Principles (POUR)

### Perceivable
Information and UI components must be presentable to users in ways they can perceive.

### Operable
UI components and navigation must be operable by all users.

### Understandable
Information and the operation of UI must be understandable.

### Robust
Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

## Semantic HTML

### Use Appropriate Elements

**Good:**
```tsx
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2025 Company Name</p>
</footer>
```

**Bad:**
```tsx
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
    <div class="link">About</div>
  </div>
</div>
```

### Heading Hierarchy

**Correct hierarchy:**
```tsx
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>
```

**Incorrect (skips levels):**
```tsx
<h1>Page Title</h1>
  <h4>Section 1</h4>  // ❌ Skips h2 and h3
```

## Keyboard Navigation

### Focus Management

```tsx
// Ensure all interactive elements are keyboard accessible
<button
  className="
    px-4 py-2
    focus:outline-none
    focus:ring-4 focus:ring-blue-500
    focus:ring-offset-2
    rounded-lg
  "
  tabIndex={0}
>
  Accessible Button
</button>

// Custom interactive elements need tabindex
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  className="cursor-pointer focus:ring-4 focus:ring-blue-500"
>
  Custom Button
</div>
```

### Tab Order

```tsx
// Use tabIndex to control focus order
<form>
  <input tabIndex={1} aria-label="First name" />
  <input tabIndex={2} aria-label="Last name" />
  <input tabIndex={3} aria-label="Email" />
  <button tabIndex={4}>Submit</button>
</form>

// Use tabIndex={-1} to remove from tab order but allow programmatic focus
<div tabIndex={-1} id="error-message">
  Error details...
</div>
```

### Skip Links

```tsx
// Allow keyboard users to skip to main content
<a
  href="#main-content"
  className="
    sr-only
    focus:not-sr-only
    focus:absolute
    focus:top-4 focus:left-4
    focus:z-50
    focus:px-4 focus:py-2
    focus:bg-blue-600 focus:text-white
    focus:rounded-lg
  "
>
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

## ARIA Attributes

### Common ARIA Roles

```tsx
// Navigation landmark
<nav role="navigation" aria-label="Main navigation">
  {/* Navigation items */}
</nav>

// Banner (header)
<header role="banner">
  {/* Header content */}
</header>

// Main content
<main role="main">
  {/* Main content */}
</main>

// Complementary (sidebar)
<aside role="complementary" aria-label="Related articles">
  {/* Sidebar content */}
</aside>

// Content info (footer)
<footer role="contentinfo">
  {/* Footer content */}
</footer>

// Search
<form role="search" aria-label="Site search">
  <input type="search" aria-label="Search query" />
  <button type="submit">Search</button>
</form>
```

### ARIA Labels

```tsx
// aria-label for elements without visible text
<button aria-label="Close dialog">
  <X size={24} />
</button>

// aria-labelledby to reference another element
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure you want to continue?</p>
</div>

// aria-describedby for additional description
<input
  type="password"
  aria-describedby="password-requirements"
/>
<p id="password-requirements">
  Password must be at least 8 characters
</p>
```

### ARIA States

```tsx
// aria-expanded for expandable elements
<button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={() => setIsOpen(!isOpen)}
>
  Menu {isOpen ? <ChevronUp /> : <ChevronDown />}
</button>
<div id="dropdown-menu" hidden={!isOpen}>
  {/* Dropdown content */}
</div>

// aria-pressed for toggle buttons
<button
  aria-pressed={isPressed}
  onClick={() => setIsPressed(!isPressed)}
>
  {isPressed ? 'Pressed' : 'Not Pressed'}
</button>

// aria-selected for selectable items
<div role="tab" aria-selected={isActive}>
  Tab 1
</div>

// aria-checked for checkboxes/radio buttons
<div
  role="checkbox"
  aria-checked={isChecked}
  tabIndex={0}
  onClick={() => setIsChecked(!isChecked)}
>
  Custom Checkbox
</div>
```

### ARIA Live Regions

```tsx
// Announce changes to screen readers
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>

// For urgent announcements
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  {errorMessage}
</div>

// For form validation
<input
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <p id="email-error" role="alert">
    Please enter a valid email address
  </p>
)}
```

## Color Contrast

### Minimum Contrast Ratios (WCAG AA)

- **Normal text:** 4.5:1
- **Large text (18pt+ or 14pt+ bold):** 3:1
- **UI components and graphics:** 3:1

### Good Contrast Examples

```tsx
// High contrast text
<p className="text-slate-900 bg-white">
  Great contrast (21:1)
</p>

<p className="text-slate-700 bg-white">
  Good contrast (8:1)
</p>

// Button with good contrast
<button className="
  bg-blue-600 text-white
  hover:bg-blue-700
">
  High Contrast Button (4.5:1)
</button>
```

### Poor Contrast Examples (Avoid)

```tsx
// ❌ Insufficient contrast
<p className="text-gray-400 bg-white">
  Poor contrast (2.8:1) - fails WCAG AA
</p>

// ❌ Don't rely on color alone
<button className="bg-red-500 text-white">
  Error Button (color alone indicates state)
</button>

// ✅ Better: Use icons + color
<button className="bg-red-500 text-white flex items-center gap-2">
  <AlertCircle size={20} />
  Error: Fix Issues
</button>
```

### Tools for Checking Contrast

- Chrome DevTools: Inspect element → Accessibility tab
- Online: WebAIM Contrast Checker
- Figma: Stark plugin

## Alternative Text

### Images

```tsx
// Informative images
<img
  src="chart.png"
  alt="Bar chart showing sales increased 40% in Q4 2025"
/>

// Decorative images
<img
  src="decoration.png"
  alt=""
  role="presentation"
/>

// Functional images (buttons)
<button aria-label="Search">
  <img src="search-icon.png" alt="" />
</button>

// Complex images
<figure>
  <img
    src="complex-diagram.png"
    alt="System architecture diagram"
    aria-describedby="diagram-description"
  />
  <figcaption id="diagram-description">
    Detailed description of the system architecture showing
    three main components: frontend, API layer, and database.
    The frontend communicates with the API via REST...
  </figcaption>
</figure>
```

### Icons

```tsx
import { MagnifyingGlass, Bell, User } from '@phosphor-icons/react';

// Decorative icons (with adjacent text)
<button className="flex items-center gap-2">
  <MagnifyingGlass aria-hidden="true" />
  Search
</button>

// Functional icons (no adjacent text)
<button aria-label="Search">
  <MagnifyingGlass />
</button>

// Icons with state
<button aria-label="Notifications (3 unread)">
  <Bell />
  <span className="sr-only">3 unread notifications</span>
  <span aria-hidden="true" className="badge">3</span>
</button>
```

## Forms

### Labels and Instructions

```tsx
// Always associate labels with inputs
<div>
  <label htmlFor="email" className="block mb-1 font-medium">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    className="w-full px-4 py-2 border rounded-lg"
  />
</div>

// Group related inputs
<fieldset>
  <legend className="font-medium mb-2">Contact Preferences</legend>
  <div className="space-y-2">
    <label className="flex items-center gap-2">
      <input type="checkbox" name="email" />
      Email
    </label>
    <label className="flex items-center gap-2">
      <input type="checkbox" name="sms" />
      SMS
    </label>
  </div>
</fieldset>
```

### Error Handling

```tsx
<div>
  <label htmlFor="password" className="block mb-1 font-medium">
    Password
  </label>
  <input
    id="password"
    type="password"
    aria-invalid={hasError}
    aria-describedby="password-requirements password-error"
    className={`
      w-full px-4 py-2 border rounded-lg
      ${hasError ? 'border-red-500' : 'border-slate-300'}
    `}
  />
  <p id="password-requirements" className="text-sm text-slate-600 mt-1">
    Must be at least 8 characters
  </p>
  {hasError && (
    <p id="password-error" role="alert" className="text-sm text-red-600 mt-1">
      <AlertCircle className="inline" size={16} />
      Password is too short
    </p>
  )}
</div>
```

### Required Fields

```tsx
// Indicate required fields clearly
<label htmlFor="name" className="block mb-1 font-medium">
  Full Name
  <span className="text-red-600" aria-label="required">*</span>
</label>
<input
  id="name"
  type="text"
  required
  aria-required="true"
  className="w-full px-4 py-2 border rounded-lg"
/>

// Or use text
<label htmlFor="email" className="block mb-1 font-medium">
  Email
  <span className="text-sm font-normal text-slate-600">(required)</span>
</label>
```

## Screen Reader-Only Content

### sr-only Class

```css
/* Add to your CSS */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Usage Examples

```tsx
// Add context for screen readers
<button>
  <Heart />
  <span className="sr-only">Add to favorites</span>
</button>

// Provide additional context
<div>
  <h2>Products</h2>
  <span className="sr-only">Showing 24 of 100 results</span>
</div>

// Skip link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

## Focus Indicators

### Visible Focus States

```tsx
// Default focus with ring
<button className="
  px-4 py-2 rounded-lg
  bg-blue-600 text-white
  focus:outline-none
  focus:ring-4 focus:ring-blue-500
  focus:ring-offset-2
">
  Click Me
</button>

// Custom focus style
<a
  href="/page"
  className="
    underline
    focus:outline-none
    focus:ring-2 focus:ring-blue-500
    focus:rounded
  "
>
  Link Text
</a>

// Focus within containers
<div className="
  p-4 border border-slate-300 rounded-lg
  focus-within:ring-4 focus-within:ring-blue-500
  focus-within:border-blue-500
">
  <input type="text" className="w-full focus:outline-none" />
</div>
```

### Focus Management in Modals

```tsx
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocus.current = document.activeElement;

      // Focus modal
      modalRef.current?.focus();

      // Trap focus within modal
      const handleTab = (e) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    } else {
      // Restore focus
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="bg-white rounded-lg p-6 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-slate-200 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
```

## Testing Checklist

### Automated Testing

```bash
# Install axe-core for accessibility testing
npm install --save-dev @axe-core/react

# Use in tests
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

**Keyboard Navigation:**
- [ ] Can navigate entire site using Tab key
- [ ] Can activate all interactive elements with Enter/Space
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps
- [ ] Logical tab order

**Screen Reader Testing:**
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All images have appropriate alt text
- [ ] Headings create logical structure
- [ ] Forms have proper labels
- [ ] Dynamic content is announced

**Visual Testing:**
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] UI works at 200% zoom
- [ ] Content reflows properly on mobile
- [ ] No information conveyed by color alone
- [ ] Focus indicators are visible

**Tools to Use:**
- Chrome DevTools Lighthouse
- WAVE browser extension
- axe DevTools browser extension
- Color contrast analyzer
- Screen reader (NVDA/VoiceOver)

## Common Patterns

### Accessible Modal

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  className="fixed inset-0 z-50 flex items-center justify-center"
>
  <div className="fixed inset-0 bg-black/50" onClick={onClose} />
  <div className="relative bg-white rounded-lg p-6 max-w-md">
    <h2 id="modal-title" className="text-xl font-bold mb-2">
      Confirm Action
    </h2>
    <p id="modal-description" className="text-slate-600 mb-4">
      Are you sure you want to proceed?
    </p>
    <div className="flex gap-4">
      <button
        onClick={onConfirm}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Confirm
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 border border-slate-300 rounded-lg"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
```

### Accessible Tabs

```tsx
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div role="tablist" aria-label="Content sections">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            className={`
              px-4 py-2 border-b-2
              ${activeTab === index
                ? 'border-blue-600 font-medium'
                : 'border-transparent'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`panel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeTab !== index}
          className="p-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

### Accessible Tooltip

```tsx
function Tooltip({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div className="relative inline-block">
      <button
        aria-describedby={isVisible ? tooltipId : undefined}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </button>
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="
            absolute z-10 px-3 py-2
            bg-slate-900 text-white text-sm
            rounded-lg
            bottom-full left-1/2 -translate-x-1/2 mb-2
          "
        >
          {text}
        </div>
      )}
    </div>
  );
}
```

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)


## REF: DESIGN-SYSTEM-TEMPLATE.md

# Design System Template

Meta-framework for understanding what's fixed, project-specific, and adaptable in your design system.

## Purpose

This template helps you distinguish between:
- **Fixed Elements**: Universal rules that never change
- **Project-Specific Elements**: Filled in for each project based on brand
- **Adaptable Elements**: Context-dependent implementations

---

## I. FIXED ELEMENTS

These foundations remain consistent across all projects, regardless of brand or context.

### 1. Spacing Scale

**Fixed System:**
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

**Usage:**
- Margins, padding, gaps between elements
- Mathematical relationships ensure visual harmony
- Use multipliers of base unit (4px)

**Why Fixed:**
Consistent spacing creates visual rhythm regardless of brand personality.

### 2. Grid System

**Fixed Structure:**
- **12-column grid** for most layouts (divisible by 2, 3, 4, 6)
- **16-column grid** for data-heavy interfaces
- **Gutters**: 16px (mobile), 24px (tablet), 32px (desktop)

**Why Fixed:**
Grid provides structural order. Brand personality shows through color, typography, content—not grid structure.

### 3. Accessibility Standards

**Fixed Requirements:**
- **WCAG 2.1 AA** compliance minimum
- **Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Touch targets**: Minimum 44×44px
- **Keyboard navigation**: All interactive elements accessible
- **Screen reader**: Semantic HTML, ARIA labels where needed

**Why Fixed:**
Accessibility is not negotiable. It's a baseline requirement for ethical, legal, and usable products.

### 4. Typography Hierarchy Logic

**Fixed Structure:**
- **Mathematical scaling**: 1.25x (major third) or 1.333x (perfect fourth)
- **Hierarchy levels**: Display → H1 → H2 → H3 → Body → Small → Caption
- **Line height**: 1.5x for body text, 1.2-1.3x for headlines
- **Line length**: 45-75 characters optimal

**Why Fixed:**
Mathematical relationships create predictable, harmonious hierarchy. Specific fonts change, but the logic doesn't.

### 5. Component Architecture

**Fixed Patterns:**
- **Button states**: Default, Hover, Active, Focus, Disabled
- **Form structure**: Label above input, error below, helper text optional
- **Modal pattern**: Overlay + centered content + close mechanism
- **Card structure**: Container → Header → Body → Footer (optional)

**Why Fixed:**
Users expect consistent component behavior. Architecture is fixed; appearance is project-specific.

### 6. Animation Timing Framework

**Fixed Physics Profiles:**
- **Lightweight** (icons, chips): 150ms
- **Standard** (cards, panels): 300ms
- **Weighty** (modals, pages): 500ms

**Fixed Easing:**
- **Ease-out**: Entrances (fast start, slow end)
- **Ease-in**: Exits (slow start, fast end)
- **Ease-in-out**: Transitions (smooth both ends)

**Why Fixed:**
Natural physics feel consistent across brands. Duration and easing create that feeling.

---

## II. PROJECT-SPECIFIC ELEMENTS

Fill in these for each project based on brand personality and purpose.

### 1. Brand Color System

**Template Structure:**

```
NEUTRALS (4-5 colors):
- Background lightest: _______ (e.g., slate-50 or warm-white)
- Surface: _______ (e.g., slate-100)
- Border/divider: _______ (e.g., slate-300)
- Text secondary: _______ (e.g., slate-600)
- Text primary: _______ (e.g., slate-900)

ACCENTS (1-3 colors):
- Primary (main CTA): _______ (e.g., teal-500)
- Secondary (alternative action): _______ (optional)
- Status colors:
  - Success: _______ (green-ish)
  - Warning: _______ (amber-ish)
  - Error: _______ (red-ish)
  - Info: _______ (blue-ish)
```

**Questions to Answer:**
- What emotion should the brand evoke? (Trust, excitement, calm, urgency)
- Warm or cool neutrals?
- Conservative or bold accents?

**Examples:**

**Project A: Fintech App**
```
Neutrals: Cool greys (slate-50 → slate-900)
Primary: Deep blue (#0A2463) – trust, professionalism
Success: Muted green (#10B981)
Why: Financial products need trust, not playfulness
```

**Project B: Creative Community**
```
Neutrals: Warm greys with beige undertones
Primary: Coral (#FF6B6B) – energy, creativity
Success: Teal (#06D6A0) – fresh, unexpected
Why: Creative spaces should feel inviting, not corporate
```

**Project C: Healthcare Platform**
```
Neutrals: Pure greys (minimal color temperature)
Primary: Soft blue (#4A90E2) – calm, clinical
Success: Medical green (#38A169)
Why: Healthcare needs clarity and calm, not distraction
```

### 2. Typography Pairing

**Template:**

```
HEADLINE FONT: _______
- Weight: _______ (e.g., Bold 700)
- Use case: H1, H2, display text
- Personality: _______ (geometric/humanist/serif/etc.)

BODY FONT: _______
- Weight: _______ (e.g., Regular 400, Medium 500)
- Use case: Paragraphs, UI text
- Personality: _______ (neutral/readable/efficient)

OPTIONAL ACCENT FONT: _______
- Weight: _______
- Use case: _______ (special headlines, callouts)
```

**Pairing Logic:**
- Serif + Sans-serif (classic, editorial)
- Geometric + Humanist (modern + warm)
- Display + System (distinctive + efficient)

**Examples:**

**Project A: Editorial Platform**
```
Headline: Playfair Display (Serif, Bold 700)
Body: Inter (Sans-serif, Regular 400)
Why: Serif headlines = trustworthy, editorial feel
```

**Project B: Tech Startup**
```
Headline: DM Sans (Sans-serif, Bold 700)
Body: DM Sans (Regular 400, Medium 500)
Why: Single-font system = modern, efficient, cohesive
```

**Project C: Luxury Brand**
```
Headline: Cormorant Garamond (Serif, Light 300)
Body: Lato (Sans-serif, Regular 400)
Why: Elegant serif + readable sans = sophisticated
```

### 3. Tone of Voice

**Template:**

```
BRAND PERSONALITY:
- Formal ↔ Casual: _______ (1-10 scale)
- Professional ↔ Friendly: _______ (1-10 scale)
- Serious ↔ Playful: _______ (1-10 scale)
- Authoritative ↔ Conversational: _______ (1-10 scale)

MICROCOPY EXAMPLES:
- Button label (submit form): _______
- Error message (invalid email): _______
- Success message (saved): _______
- Empty state: _______

ANIMATION PERSONALITY:
- Speed: _______ (quick/moderate/slow)
- Feel: _______ (precise/smooth/bouncy)
```

**Examples:**

**Project A: Banking App**
```
Personality: Formal (8), Professional (9), Serious (8)
Button: "Submit Application"
Error: "Email address format is invalid"
Success: "Application submitted successfully"
Animation: Quick (precise, efficient, no-nonsense)
```

**Project B: Social App**
```
Personality: Casual (8), Friendly (9), Playful (7)
Button: "Let's go!"
Error: "Hmm, that email doesn't look right"
Success: "Nice! You're all set 🎉"
Animation: Moderate (smooth, friendly bounce)
```

### 4. Animation Speed & Feel

**Template:**

```
SPEED PREFERENCE:
- UI interactions: _______ (100-150ms / 150-200ms / 200-300ms)
- State changes: _______ (200ms / 300ms / 400ms)
- Page transitions: _______ (300ms / 500ms / 700ms)

ANIMATION STYLE:
- Easing preference: _______ (sharp / standard / bouncy)
- Movement type: _______ (minimal / smooth / expressive)
```

**Examples:**

**Project A: Trading Platform**
```
Speed: Fast (100ms UI, 200ms states, 300ms pages)
Style: Sharp easing, minimal movement
Why: Traders need speed, not distraction
```

**Project B: Wellness App**
```
Speed: Slow (200ms UI, 400ms states, 500ms pages)
Style: Smooth easing, gentle movement
Why: Calm, relaxing experience matches brand
```

---

## III. ADAPTABLE ELEMENTS

Context-dependent implementations that vary based on use case.

### 1. Component Variations

**Button Variants:**
- **Primary**: Full background color (high emphasis)
- **Secondary**: Outline only (medium emphasis)
- **Tertiary**: Text only (low emphasis)
- **Destructive**: Red-ish (danger actions)
- **Ghost**: Minimal (navigation, toolbars)

**Adaptation Rules:**
- Primary: Main CTA, one per screen section
- Secondary: Alternative actions
- Tertiary: Less important actions, multiple allowed
- Use brand colors, but hierarchy logic is fixed

### 2. Responsive Breakpoints

**Fixed Ranges:**
- XS: 0-479px (small phones)
- SM: 480-767px (large phones)
- MD: 768-1023px (tablets)
- LG: 1024-1439px (laptops)
- XL: 1440px+ (desktop)

**Adaptable Implementations:**

**Simple Content Site:**
```
XS-SM: Single column
MD: 2 columns
LG-XL: 3 columns max
Why: Content-focused, don't overwhelm
```

**Dashboard/Data App:**
```
XS: Collapsed, cards stack
SM: Simplified sidebar
MD: Full sidebar + main content
LG-XL: Sidebar + main + right panel
Why: Data apps need more screen real estate
```

### 3. Dark Mode Palette

**Adaptation Strategy:**

Not a simple inversion. Dark mode needs adjusted contrast:

**Light Mode:**
```
Background: #FFFFFF (white)
Text: #0F172A (slate-900) → 21:1 contrast
```

**Dark Mode (Adapted):**
```
Background: #0F172A (slate-900)
Text: #E2E8F0 (slate-200) → 15.8:1 contrast (still AA, but softer)
```

**Why Adapt:**
Pure white on pure black is too harsh. Dark mode needs slightly lower contrast for eye comfort.

### 4. Loading States

**Context-Dependent:**

**Fast operations (<500ms):**
- No loading indicator (feels instant)

**Medium operations (500ms-2s):**
- Spinner or skeleton screen

**Long operations (>2s):**
- Progress bar with percentage
- Or: Skeleton + estimated time

**Interactive Operations:**
- Button shows spinner inside (don't disable, show state)

### 5. Error Handling Strategy

**Context-Dependent:**

**Form Errors:**
```
Validate: On blur (after user leaves field)
Display: Inline below field
Recovery: Clear error on fix
```

**API Errors:**
```
Transient (network): Show retry button
Permanent (404): Show helpful message + next steps
Critical (500): Contact support option
```

**Data Errors:**
```
Missing: Show empty state with action
Corrupt: Show error boundary with reload
Invalid: Highlight + explain what's wrong
```

---

## DECISION TREE

When implementing a feature, ask:

### Is this...

**FIXED?**
- Does it affect structure, accessibility, or universal UX?
- Examples: Spacing scale, grid, contrast ratios, component architecture
- **Action**: Use the fixed system, no variation

**PROJECT-SPECIFIC?**
- Does it express brand personality or purpose?
- Examples: Colors, typography, tone of voice, animation feel
- **Action**: Fill in the template for this project

**ADAPTABLE?**
- Does it depend on context, content, or use case?
- Examples: Component variants, responsive behavior, error handling
- **Action**: Choose appropriate variation based on context

---

## EXAMPLE: Implementing a "Submit" Button

### Fixed Elements (Always the same):
- Touch target: 44px minimum height
- Padding: 16px horizontal (from spacing scale)
- States: Default, Hover, Active, Focus, Disabled
- Animation: 150ms ease-out (lightweight profile)

### Project-Specific (Filled per project):
- **Project A (Bank)**: Dark blue background, white text, "Submit Application"
- **Project B (Social)**: Coral background, white text, "Let's Go!"
- **Project C (Healthcare)**: Soft blue background, white text, "Continue"

### Adaptable (Context-dependent):
- **Form context**: Primary button (full color)
- **Toolbar context**: Ghost button (text only)
- **Danger context**: Destructive variant (red-ish)

---

## VALIDATION CHECKLIST

Before finalizing a design, check:

### Fixed Elements
- [ ] Uses spacing scale (4/8/12/16/24/32/48/64/96px)
- [ ] Follows grid system (12 or 16 columns)
- [ ] Meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Touch targets ≥ 44px
- [ ] Typography follows mathematical scale
- [ ] Components follow standard architecture

### Project-Specific Elements
- [ ] Brand colors filled in and intentional
- [ ] Typography pairing chosen and justified
- [ ] Tone of voice defined and consistent
- [ ] Animation speed matches brand personality

### Adaptable Elements
- [ ] Component variants appropriate for context
- [ ] Responsive behavior fits content type
- [ ] Loading states match operation duration
- [ ] Error handling fits error type

---

## PROJECT KICKOFF TEMPLATE

Use this to start a new project:

```
PROJECT NAME: _______________________
PURPOSE: ____________________________

BRAND PERSONALITY:
- Primary emotion: _______
- Warm or cool: _______
- Formal or casual: _______
- Conservative or bold: _______

COLORS (fill the template):
- Neutral base: _______
- Primary accent: _______
- Status colors: _______ / _______ / _______

TYPOGRAPHY (fill the template):
- Headline font: _______
- Body font: _______
- Pairing rationale: _______

TONE:
- Button labels style: _______
- Error message style: _______
- Success message style: _______

ANIMATION:
- Speed preference: _______ (fast/moderate/slow)
- Feel preference: _______ (sharp/smooth/bouncy)

TARGET DEVICES:
- Primary: _______ (mobile/desktop/both)
- Secondary: _______
```

---

## MAINTAINING CONSISTENCY

### Documentation
- Keep this template updated as system evolves
- Document WHY choices were made, not just WHAT

### Communication
- Share with designers: "Here's what varies vs. what's fixed"
- Share with developers: "Here are the design tokens"

### Tooling
- Use CSS variables for project-specific values
- Use Tailwind config for spacing scale
- Use design tokens in Figma/Storybook

### Reviews
- Audit: Does new work follow fixed elements?
- Validate: Are project-specific elements intentional?
- Question: Are adaptations justified by context?

---

## EXAMPLES OF COMPLETE SYSTEMS

### System A: B2B SaaS (Conservative)

**Fixed**: Standard spacing, 12-col grid, WCAG AA, major third type scale
**Project-Specific**:
- Colors: Cool greys + corporate blue
- Typography: DM Sans (headlines + body)
- Tone: Professional, formal
- Animation: Quick, precise (150ms)
**Adaptable**:
- Dashboard gets multi-panel layout
- Forms are extensive (use progressive disclosure)
- Errors show detailed technical info

### System B: Consumer Social App (Playful)

**Fixed**: Same spacing/grid/accessibility/type logic
**Project-Specific**:
- Colors: Warm greys + vibrant coral
- Typography: Poppins (headlines) + Inter (body)
- Tone: Casual, friendly, playful
- Animation: Moderate, bouncy (200ms)
**Adaptable**:
- Mobile-first (most users on phones)
- Forms are minimal (progressive profiling)
- Errors are friendly, not technical

### System C: Healthcare Platform (Clinical)

**Fixed**: Same foundational structure
**Project-Specific**:
- Colors: Pure greys + medical blue
- Typography: System fonts (SF Pro / Segoe)
- Tone: Clear, authoritative, calm
- Animation: Slow, smooth (300ms)
**Adaptable**:
- Desktop-first (clinical use at workstations)
- Forms are complex (HIPAA compliance)
- Errors are precise with next steps

---

## KEY TAKEAWAY

**The system flexibility framework lets you:**
- Maintain consistency (fixed elements)
- Express brand personality (project-specific)
- Adapt to context (adaptable elements)

**Without this framework:**
- Designers reinvent spacing every project
- Components feel inconsistent across products
- Brand personality overrides accessibility
- Context-blind implementations feel wrong

**With this framework:**
- Speed: Start from proven foundations
- Consistency: Fixed elements guarantee it
- Flexibility: Express unique brand identity
- Context: Adapt without breaking system


## REF: MOTION-SPEC.md

# Motion Specification Template

Detailed animation specifications for consistent motion design across projects.

## Easing Curves

### Standard Easings

**Ease-out (Entrances)**
```css
cubic-bezier(0.0, 0.0, 0.2, 1)
```
Use for: Elements entering view, expanding, appearing

**Ease-in (Exits)**
```css
cubic-bezier(0.4, 0.0, 1, 1)
```
Use for: Elements leaving view, collapsing, disappearing

**Ease-in-out (Transitions)**
```css
cubic-bezier(0.4, 0.0, 0.2, 1)
```
Use for: State changes, transformations, element swaps

**Linear (Continuous)**
```css
linear
```
Use for: Loading spinners, continuous animations, marquee scrolls

### Custom Easings

**Spring (Bouncy)**
```css
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```
Use for: Playful interactions, game-like UIs, attention-grabbing

**Sharp (Quick snap)**
```css
cubic-bezier(0.4, 0.0, 0.6, 1)
```
Use for: Mechanical interactions, precise movements

## Duration Tables

### By Interaction Type

| Interaction | Duration | Easing | Example |
|-------------|----------|--------|---------|
| Button press | 100ms | ease-out | Background color change |
| Hover state | 150ms | ease-out | Underline appearing |
| Checkbox toggle | 150ms | ease-out | Checkmark animation |
| Tooltip appear | 200ms | ease-out | Tooltip fade in |
| Tab switch | 250ms | ease-in-out | Content swap |
| Accordion expand | 300ms | ease-out | Height animation |
| Modal open | 300ms | ease-out | Fade + scale up |
| Modal close | 250ms | ease-in | Fade + scale down |
| Page transition | 400ms | ease-in-out | Route change |
| Sheet slide-in | 300ms | ease-out | Bottom sheet |
| Toast notification | 300ms | ease-out | Slide in from top |

### By Element Weight

| Element Weight | Duration | Example |
|----------------|----------|---------|
| Lightweight (< 100px) | 150ms | Icons, badges, chips |
| Standard (100-500px) | 300ms | Cards, panels, list items |
| Weighty (> 500px) | 500ms | Modals, full-page transitions |

## State-Specific Animations

### Hover States

**Button Hover:**
```tsx
// Tailwind
<button className="
  bg-blue-600 hover:bg-blue-700
  transition-colors duration-150 ease-out
">
  Hover Me
</button>

// Framer Motion
<motion.button
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
>
  Hover Me
</motion.button>
```

**Link Hover:**
```tsx
<a className="
  underline-offset-4
  hover:underline
  transition-all duration-200 ease-out
">
  Link Text
</a>
```

**Card Hover:**
```tsx
<div className="
  transition-all duration-200 ease-out
  hover:shadow-lg
  hover:scale-[1.02]
">
  Card Content
</div>
```

### Focus States

**Keyboard Focus:**
```tsx
<button className="
  focus:outline-none
  focus:ring-4 focus:ring-blue-500
  focus:ring-offset-2
  transition-all duration-200 ease-out
">
  Focus Me
</button>
```

**Input Focus:**
```tsx
<input className="
  border-2 border-slate-300
  focus:border-blue-500
  focus:ring-4 focus:ring-blue-200
  transition-all duration-200 ease-out
" />
```

### Active/Pressed States

**Button Press:**
```tsx
<motion.button
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.1, ease: "easeIn" }}
>
  Press Me
</motion.button>

// CSS alternative
<button className="
  active:scale-98
  transition-transform duration-100 ease-in
">
  Press Me
</button>
```

### Disabled States

**Disabled Button:**
```tsx
<button
  disabled
  className="
    bg-slate-400 text-slate-600
    opacity-50 cursor-not-allowed
    pointer-events-none
  "
>
  Disabled
</button>
```

### Loading States

**Loading Spinner:**
```tsx
<div className="
  w-8 h-8 border-4 border-slate-300
  border-t-blue-600 rounded-full
  animate-spin
">
</div>

// CSS
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**Skeleton Loader:**
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
</div>

// CSS
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Success Feedback

**Checkmark Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  <CheckCircle className="text-green-600" size={48} />
</motion.div>
```

**Toast Notification:**
```tsx
<motion.div
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -100, opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="bg-green-600 text-white p-4 rounded-lg"
>
  Success! Changes saved.
</motion.div>
```

### Error Feedback

**Shake Animation:**
```tsx
<motion.div
  animate={{ x: [0, -4, 4, -4, 4, 0] }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="border-2 border-red-500"
>
  <input type="text" />
</motion.div>

// CSS alternative
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.shake {
  animation: shake 0.3s ease-in-out;
}
```

**Error Message Slide-in:**
```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
  className="text-red-600 text-sm"
>
  Please enter a valid email address
</motion.div>
```

### Warning Feedback

**Pulse Animation:**
```tsx
<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{
    duration: 0.6,
    ease: "easeInOut",
    repeat: Infinity
  }}
  className="border-2 border-amber-500"
>
  Warning Content
</motion.div>
```

### Form Validation

**Field Validation (On Blur):**
```tsx
// Validate on blur, not during typing
<input
  onBlur={(e) => {
    const isValid = validateEmail(e.target.value);
    setError(!isValid);
  }}
  className={`
    border-2 transition-all duration-200 ease-out
    ${error
      ? 'border-red-500 focus:ring-red-200'
      : 'border-slate-300 focus:ring-blue-200'
    }
  `}
/>

{error && (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-red-600 text-sm mt-1"
  >
    Please enter a valid email
  </motion.p>
)}
```

## Common Animation Patterns

### Fade In
```tsx
// Framer Motion
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>

// CSS
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide Up
```tsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>

// CSS
.slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Scale + Fade (Modal)
```tsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Modal content
</motion.div>
```

### Stagger Children
```tsx
// Framer Motion
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

## Performance Checklist

- [ ] Only animate `transform` and `opacity`
- [ ] Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding`
- [ ] Test on mobile devices (target 60fps)
- [ ] Use `will-change` only for complex animations
- [ ] Implement `prefers-reduced-motion` media query
- [ ] Keep animation duration under 500ms for UI interactions
- [ ] Use CSS animations for simple transitions (better performance)
- [ ] Use JS animation libraries for complex, choreographed sequences

## Accessibility

```css
/* Disable or reduce animations for users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Implementation in React:**
```tsx
import { useReducedMotion } from 'framer-motion';

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.3,
        ease: "easeOut"
      }}
    >
      Content
    </motion.div>
  );
}
```

## Testing Animations

1. **Test at 60fps** on target devices
2. **Test with slow network** (does page still feel responsive?)
3. **Test with reduced motion** preferences enabled
4. **Verify animations don't block** critical user actions
5. **Check that animations add value** (remove if purely decorative)
6. **Test on low-end devices** (not just your development machine)
7. **Measure performance** with Chrome DevTools Performance tab
8. **Check for layout thrashing** (avoid reading and writing to DOM in same frame)

## Animation & Gestalt Principles

### Proximity
Animated elements that are near each other should move together to reinforce grouping:
```tsx
// Animate card and its children together
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <h3>Title</h3>
  <p>Content</p>
  <button>Action</button>
</motion.div>
```

### Similarity
Similar elements should have similar animation characteristics:
```tsx
// All buttons use same hover animation
const buttonAnimation = {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.15, ease: "easeOut" }
};

<motion.button {...buttonAnimation}>Button 1</motion.button>
<motion.button {...buttonAnimation}>Button 2</motion.button>
```

### Continuity
Movement should follow natural, smooth paths:
```tsx
// Smooth curve, not jumpy angles
<motion.div
  animate={{ x: [0, 50, 100], y: [0, -25, 0] }}
  transition={{ duration: 1, ease: "easeInOut" }}
/>
```

### Figure-Ground
Important elements animate while backgrounds stay stable:
```tsx
// Background fades out, modal animates in
<>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.5 }}
    className="fixed inset-0 bg-black"
  />
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed inset-0 flex items-center justify-center"
  >
    Modal Content
  </motion.div>
</>
```

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [CSS Easing Functions](https://easings.net/)
- [Material Design Motion](https://m2.material.io/design/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)


## REF: RESPONSIVE-DESIGN.md

# Responsive Design Reference

Detailed reference for implementing responsive, mobile-first designs.

## Mobile-First Approach

Always start with mobile design, then progressively enhance for larger screens.

**Why Mobile-First:**
- Forces focus on essential content
- Easier to scale up than scale down
- Better performance on mobile devices
- Aligns with usage patterns (mobile-first web)

## Breakpoint Strategy

### Standard Breakpoints

```css
/* Mobile First Approach */
/* Base styles: 0-640px (mobile) */

/* Small tablets and large phones */
@media (min-width: 640px) { }

/* Tablets */
@media (min-width: 768px) { }

/* Small laptops */
@media (min-width: 1024px) { }

/* Desktops */
@media (min-width: 1280px) { }

/* Large desktops */
@media (min-width: 1536px) { }
```

### Specific Breakpoint Ranges

| Range | Pixels | Target Devices | Layout Strategy |
|-------|--------|----------------|-----------------|
| **XS** | 0-479px | Small phones (iPhone SE, older Android) | Single column, stacked navigation, large touch targets (min 44px) |
| **SM** | 480-767px | Large phones (iPhone 14, most modern phones) | Single column, simplified UI, bottom navigation, reduced complexity |
| **MD** | 768-1023px | Tablets (iPad, Android tablets) | 2 columns possible, sidebar navigation, some desktop features |
| **LG** | 1024-1439px | Small laptops, landscape tablets | Multi-column layouts, full navigation, desktop UI patterns |
| **XL** | 1440px+ | Desktop monitors, large screens | Max-width containers, multi-panel layouts, advanced features visible |

**Mobile Simplification Examples:**

- **Navigation**: Hamburger menu (mobile) → Full nav bar (desktop)
- **Forms**: Stacked fields (mobile) → Side-by-side fields (desktop)
- **Content**: Single column (mobile) → Multi-column grid (desktop)
- **Actions**: Fixed bottom bar (mobile) → Inline buttons (desktop)
- **Tables**: Collapsed cards (mobile) → Full data table (desktop)
- **Sidebars**: Hidden/collapsible (mobile) → Always visible (desktop)
- **Filters**: Modal/drawer (mobile) → Sidebar panel (desktop)

### Tailwind Responsive Classes

```tsx
<div className="
  w-full          // mobile: full width
  sm:w-1/2        // small: half width
  md:w-1/3        // medium: third width
  lg:w-1/4        // large: quarter width
">
  Responsive width
</div>
```

## Responsive Images

### Using srcset for Responsive Images

```tsx
<img
  src="image-800w.jpg"
  srcSet="
    image-400w.jpg 400w,
    image-800w.jpg 800w,
    image-1200w.jpg 1200w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Descriptive alt text"
  loading="lazy"
/>
```

### Next.js Image Component

```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={600}
  priority // for above-the-fold images
  className="w-full h-auto"
/>
```

## Responsive Typography

### Fluid Typography with Tailwind

```tsx
<h1 className="
  text-3xl      // mobile: 30px
  sm:text-4xl   // small: 36px
  md:text-5xl   // medium: 48px
  lg:text-6xl   // large: 60px
">
  Responsive Headline
</h1>
```

### Fluid Typography with CSS Clamp

```css
h1 {
  /* min: 2rem (32px), preferred: 5vw, max: 4rem (64px) */
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.2;
}

p {
  /* min: 1rem (16px), preferred: 2.5vw, max: 1.25rem (20px) */
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
}
```

## Responsive Layouts

### CSS Grid Responsive Pattern

```tsx
<div className="
  grid
  grid-cols-1        // mobile: 1 column
  sm:grid-cols-2     // small: 2 columns
  md:grid-cols-3     // medium: 3 columns
  lg:grid-cols-4     // large: 4 columns
  gap-4              // consistent gap
">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

### Flexbox Responsive Pattern

```tsx
<div className="
  flex
  flex-col           // mobile: stack vertically
  md:flex-row        // medium+: horizontal layout
  gap-6
  items-center
">
  <div className="w-full md:w-1/2">Content Left</div>
  <div className="w-full md:w-1/2">Content Right</div>
</div>
```

## Touch-Friendly Interfaces

### Touch Target Sizing

```tsx
// Minimum 44x44px touch targets
<button className="
  min-w-[44px]
  min-h-[44px]
  px-4 py-2
  rounded-lg
  touch-manipulation // prevents 300ms tap delay
">
  Tap Me
</button>
```

### Touch Gestures

```tsx
// Consider common mobile gestures
<div className="
  overflow-x-auto    // horizontal scroll
  snap-x             // snap scrolling
  snap-mandatory
  overscroll-contain // prevent bounce on mobile
">
  {/* Scrollable content */}
</div>
```

## Navigation Patterns

### Mobile Menu Pattern

```tsx
import { useState } from 'react';
import { List, X } from '@phosphor-icons/react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <List size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="
          fixed inset-0 z-50 bg-white
          md:hidden
        ">
          <nav className="p-6 space-y-4">
            {/* Navigation items */}
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden md:flex gap-6">
        {/* Navigation items */}
      </nav>
    </>
  );
}
```

### Sticky Navigation

```tsx
<header className="
  sticky top-0 z-40
  bg-white/80
  backdrop-blur-md
  border-b border-slate-200
">
  <nav className="container mx-auto px-4 py-4">
    {/* Navigation content */}
  </nav>
</header>
```

## Responsive Forms

### Form Layout Pattern

```tsx
<form className="space-y-6">
  {/* Full width on mobile, side-by-side on desktop */}
  <div className="
    grid
    grid-cols-1
    md:grid-cols-2
    gap-4
  ">
    <div>
      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
        First Name
      </label>
      <input
        id="firstName"
        type="text"
        className="
          w-full px-4 py-2
          border border-slate-300
          rounded-lg
          focus:ring-2 focus:ring-blue-500
          touch-manipulation
        "
      />
    </div>

    <div>
      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
        Last Name
      </label>
      <input
        id="lastName"
        type="text"
        className="
          w-full px-4 py-2
          border border-slate-300
          rounded-lg
          focus:ring-2 focus:ring-blue-500
          touch-manipulation
        "
      />
    </div>
  </div>

  {/* Full width textarea */}
  <div>
    <label htmlFor="message" className="block text-sm font-medium mb-1">
      Message
    </label>
    <textarea
      id="message"
      rows={4}
      className="
        w-full px-4 py-2
        border border-slate-300
        rounded-lg
        focus:ring-2 focus:ring-blue-500
        touch-manipulation
      "
    />
  </div>

  <button
    type="submit"
    className="
      w-full md:w-auto
      px-8 py-3
      bg-blue-600 text-white
      rounded-lg
      hover:bg-blue-700
      transition-colors
      touch-manipulation
    "
  >
    Submit
  </button>
</form>
```

## Responsive Content Hiding

### Show/Hide Based on Screen Size

```tsx
<div>
  {/* Show only on mobile */}
  <div className="block md:hidden">
    Mobile content
  </div>

  {/* Show only on tablet and up */}
  <div className="hidden md:block">
    Desktop content
  </div>

  {/* Show only on desktop */}
  <div className="hidden lg:block">
    Large screen content
  </div>
</div>
```

## Performance Optimization

### Lazy Loading Images

```tsx
<img
  src="image.jpg"
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

### Responsive Video

```tsx
<div className="relative aspect-video">
  <video
    className="absolute inset-0 w-full h-full object-cover"
    poster="thumbnail.jpg"
    controls
    preload="metadata"
  >
    <source src="video-mobile.mp4" media="(max-width: 640px)" />
    <source src="video-desktop.mp4" />
  </video>
</div>
```

## Testing Responsive Designs

### Browser DevTools

1. Open Chrome/Firefox DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test common breakpoints:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - iPad Pro (1024px)
   - Desktop (1280px+)

### Real Device Testing

**Essential devices to test:**
- Small phone (iPhone SE, Android small)
- Large phone (iPhone Pro Max, Android large)
- Tablet (iPad, Android tablet)
- Desktop (various resolutions)

### Playwright Testing

```typescript
// Use playwright MCP to test responsive breakpoints
await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
await page.screenshot({ path: 'mobile.png' });

await page.setViewportSize({ width: 768, height: 1024 }); // iPad
await page.screenshot({ path: 'tablet.png' });

await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
await page.screenshot({ path: 'desktop.png' });
```

## Common Responsive Patterns

### Card Grid

```tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-6
  p-4
">
  {items.map(item => (
    <article
      key={item.id}
      className="
        bg-white
        rounded-lg
        border border-slate-200
        overflow-hidden
        hover:shadow-lg
        transition-shadow
      "
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-slate-600">{item.description}</p>
      </div>
    </article>
  ))}
</div>
```

### Hero Section

```tsx
<section className="
  relative
  min-h-screen
  flex items-center
  px-4 sm:px-6 lg:px-8
">
  <div className="
    max-w-7xl mx-auto w-full
    grid grid-cols-1 lg:grid-cols-2
    gap-12
    items-center
  ">
    <div className="space-y-6">
      <h1 className="
        text-4xl sm:text-5xl lg:text-6xl
        font-bold
        tracking-tight
      ">
        Your Headline Here
      </h1>
      <p className="
        text-lg sm:text-xl
        text-slate-600
        max-w-2xl
      ">
        Supporting description that works across all screen sizes.
      </p>
      <div className="
        flex flex-col sm:flex-row
        gap-4
      ">
        <button className="
          px-8 py-3
          bg-blue-600 text-white
          rounded-lg
          hover:bg-blue-700
          transition-colors
        ">
          Primary Action
        </button>
        <button className="
          px-8 py-3
          border-2 border-slate-300
          rounded-lg
          hover:border-slate-400
          transition-colors
        ">
          Secondary Action
        </button>
      </div>
    </div>
    <div className="
      relative
      aspect-square
      rounded-2xl
      overflow-hidden
    ">
      <img
        src="hero-image.jpg"
        alt="Hero"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</section>
```

## Accessibility Considerations

### Focus Management on Mobile

```tsx
<button
  className="
    focus:outline-none
    focus:ring-4 focus:ring-blue-500
    focus:ring-offset-2
    rounded-lg
  "
  aria-label="Descriptive label"
>
  Action
</button>
```

### Skip Links

```tsx
<a
  href="#main-content"
  className="
    sr-only
    focus:not-sr-only
    focus:absolute
    focus:top-4 focus:left-4
    focus:z-50
    focus:px-4 focus:py-2
    focus:bg-blue-600 focus:text-white
    focus:rounded-lg
  "
>
  Skip to main content
</a>
```

## Best Practices Summary

✅ **Do:**
- Start with mobile design first
- Use relative units (rem, em, %) for flexibility
- Test on real devices, not just emulators
- Ensure touch targets are at least 44x44px
- Use semantic HTML for better accessibility
- Implement lazy loading for images and videos
- Optimize assets for mobile networks
- Use CSS Grid and Flexbox for flexible layouts
- Provide adequate spacing between interactive elements

❌ **Don't:**
- Design for desktop first and scale down
- Use fixed pixel widths for layout containers
- Rely solely on browser DevTools for testing
- Make touch targets too small
- Forget keyboard navigation
- Load all images eagerly
- Use large unoptimized images on mobile
- Use complex nested tables for layout
- Place important actions in hard-to-reach areas
