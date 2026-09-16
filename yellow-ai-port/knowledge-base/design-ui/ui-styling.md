# Skill: ui-styling

**Category:** design-ui

**Cursor invoke:** `/ui-styling`

---


## SKILL: SKILL.md

# UI Styling Skill

Comprehensive skill for creating beautiful, accessible user interfaces combining shadcn/ui components, Tailwind CSS utility styling, and canvas-based visual design systems.

## Reference

- shadcn/ui: https://ui.shadcn.com/llms.txt
- Tailwind CSS: https://tailwindcss.com/docs

## When to Use This Skill

Use when:
- Building UI with React-based frameworks (Next.js, Vite, Remix, Astro)
- Implementing accessible components (dialogs, forms, tables, navigation)
- Styling with utility-first CSS approach
- Creating responsive, mobile-first layouts
- Implementing dark mode and theme customization
- Building design systems with consistent tokens
- Generating visual designs, posters, or brand materials
- Rapid prototyping with immediate visual feedback
- Adding complex UI patterns (data tables, charts, command palettes)

## Core Stack

### Component Layer: shadcn/ui
- Pre-built accessible components via Radix UI primitives
- Copy-paste distribution model (components live in your codebase)
- TypeScript-first with full type safety
- Composable primitives for complex UIs
- CLI-based installation and management

### Styling Layer: Tailwind CSS
- Utility-first CSS framework
- Build-time processing with zero runtime overhead
- Mobile-first responsive design
- Consistent design tokens (colors, spacing, typography)
- Automatic dead code elimination

### Visual Design Layer: Canvas
- Museum-quality visual compositions
- Philosophy-driven design approach
- Sophisticated visual communication
- Minimal text, maximum visual impact
- Systematic patterns and refined aesthetics

## Quick Start

### Component + Styling Setup

**Install shadcn/ui with Tailwind:**
```bash
npx shadcn@latest init
```

CLI prompts for framework, TypeScript, paths, and theme preferences. This configures both shadcn/ui and Tailwind CSS.

**Add components:**
```bash
npx shadcn@latest add button card dialog form
```

**Use components with utility styling:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Dashboard() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">View your metrics</p>
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Alternative: Tailwind-Only Setup

**Vite projects:**
```bash
npm install -D tailwindcss @tailwindcss/vite
```

```javascript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default { plugins: [tailwindcss()] }
```

```css
/* src/index.css */
@import "tailwindcss";
```

## Component Library Guide

**Comprehensive component catalog with usage patterns, installation, and composition examples.**

See: `references/shadcn-components.md`

Covers:
- Form & input components (Button, Input, Select, Checkbox, Date Picker, Form validation)
- Layout & navigation (Card, Tabs, Accordion, Navigation Menu)
- Overlays & dialogs (Dialog, Drawer, Popover, Toast, Command)
- Feedback & status (Alert, Progress, Skeleton)
- Display components (Table, Data Table, Avatar, Badge)

## Theme & Customization

**Theme configuration, CSS variables, dark mode implementation, and component customization.**

See: `references/shadcn-theming.md`

Covers:
- Dark mode setup with next-themes
- CSS variable system
- Color customization and palettes
- Component variant customization
- Theme toggle implementation

## Accessibility Patterns

**ARIA patterns, keyboard navigation, screen reader support, and accessible component usage.**

See: `references/shadcn-accessibility.md`

Covers:
- Radix UI accessibility features
- Keyboard navigation patterns
- Focus management
- Screen reader announcements
- Form validation accessibility

## Tailwind Utilities

**Core utility classes for layout, spacing, typography, colors, borders, and shadows.**

See: `references/tailwind-utilities.md`

Covers:
- Layout utilities (Flexbox, Grid, positioning)
- Spacing system (padding, margin, gap)
- Typography (font sizes, weights, alignment, line height)
- Colors and backgrounds
- Borders and shadows
- Arbitrary values for custom styling

## Responsive Design

**Mobile-first breakpoints, responsive utilities, and adaptive layouts.**

See: `references/tailwind-responsive.md`

Covers:
- Mobile-first approach
- Breakpoint system (sm, md, lg, xl, 2xl)
- Responsive utility patterns
- Container queries
- Max-width queries
- Custom breakpoints

## Tailwind Customization

**Config file structure, custom utilities, plugins, and theme extensions.**

See: `references/tailwind-customization.md`

Covers:
- @theme directive for custom tokens
- Custom colors and fonts
- Spacing and breakpoint extensions
- Custom utility creation
- Custom variants
- Layer organization (@layer base, components, utilities)
- Apply directive for component extraction

## Visual Design System

**Canvas-based design philosophy, visual communication principles, and sophisticated compositions.**

See: `references/canvas-design-system.md`

Covers:
- Design philosophy approach
- Visual communication over text
- Systematic patterns and composition
- Color, form, and spatial design
- Minimal text integration
- Museum-quality execution
- Multi-page design systems

## Utility Scripts

**Python automation for component installation and configuration generation.**

### shadcn_add.py
Add shadcn/ui components with dependency handling:
```bash
python scripts/shadcn_add.py button card dialog
```

### tailwind_config_gen.py
Generate tailwind.config.js with custom theme:
```bash
python scripts/tailwind_config_gen.py --colors brand:blue --fonts display:Inter
```

## Best Practices

1. **Component Composition**: Build complex UIs from simple, composable primitives
2. **Utility-First Styling**: Use Tailwind classes directly; extract components only for true repetition
3. **Mobile-First Responsive**: Start with mobile styles, layer responsive variants
4. **Accessibility-First**: Leverage Radix UI primitives, add focus states, use semantic HTML
5. **Design Tokens**: Use consistent spacing scale, color palettes, typography system
6. **Dark Mode Consistency**: Apply dark variants to all themed elements
7. **Performance**: Leverage automatic CSS purging, avoid dynamic class names
8. **TypeScript**: Use full type safety for better DX
9. **Visual Hierarchy**: Let composition guide attention, use spacing and color intentionally
10. **Expert Craftsmanship**: Every detail matters - treat UI as a craft

## Reference Navigation

**Component Library**
- `references/shadcn-components.md` - Complete component catalog
- `references/shadcn-theming.md` - Theming and customization
- `references/shadcn-accessibility.md` - Accessibility patterns

**Styling System**
- `references/tailwind-utilities.md` - Core utility classes
- `references/tailwind-responsive.md` - Responsive design
- `references/tailwind-customization.md` - Configuration and extensions

**Visual Design**
- `references/canvas-design-system.md` - Design philosophy and canvas workflows

**Automation**
- `scripts/shadcn_add.py` - Component installation
- `scripts/tailwind_config_gen.py` - Config generation

## Common Patterns

**Form with validation:**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}
```

**Responsive layout with dark mode:**
```tsx
<div className="min-h-screen bg-white dark:bg-gray-900">
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Content
          </h3>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
```

## Resources

- shadcn/ui Docs: https://ui.shadcn.com
- Tailwind CSS Docs: https://tailwindcss.com
- Radix UI: https://radix-ui.com
- Tailwind UI: https://tailwindui.com
- Headless UI: https://headlessui.com
- v0 (AI UI Generator): https://v0.dev


## REF: LICENSE.txt

Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.


## REF: references/canvas-design-system.md

# Canvas Design System

Visual design philosophy, systematic composition, and sophisticated visual communication.

## Design Philosophy Approach

Canvas design operates through two-phase process:

### Phase 1: Design Philosophy Creation

Create visual philosophy - aesthetic movement expressed through form, space, color, composition. Not layouts or templates, but pure visual philosophy.

**What is created:** Design manifesto emphasizing:
- Visual expression over text
- Spatial communication
- Artistic interpretation
- Minimal words as visual accent

**Philosophy structure (4-6 paragraphs):**
- Space and form principles
- Color and material approach
- Scale and rhythm guidance
- Composition and balance rules
- Visual hierarchy system

### Phase 2: Visual Expression

Express philosophy through canvas artifacts:
- 90% visual design
- 10% essential text
- Museum-quality execution
- Systematic patterns
- Sophisticated composition

## Core Principles

### 1. Visual Communication First

Information lives in design, not paragraphs. Express ideas through:
- Color zones and fields
- Geometric precision
- Spatial relationships
- Visual weight and tension
- Form and structure

### 2. Minimal Text Integration

Text as rare, powerful gesture:
- Never paragraphs
- Only essential words
- Integrated into visual architecture
- Small labels, huge impact
- Typography as visual element

### 3. Expert Craftsmanship

Work must appear:
- Meticulously crafted
- Labored over with care
- Product of countless hours
- From absolute top of field
- Master-level execution

### 4. Systematic Patterns

Use scientific visual language:
- Repeating patterns
- Perfect shapes
- Dense accumulation of marks
- Layered elements
- Patient repetition rewards sustained viewing

## Design Movement Examples

### Concrete Poetry
**Philosophy:** Communication through monumental form and bold geometry.

**Expression:**
- Massive color blocks
- Sculptural typography (huge words, tiny labels)
- Brutalist spatial divisions
- Polish poster energy meets Le Corbusier
- Ideas through visual weight and spatial tension
- Text as rare, powerful gesture

### Chromatic Language
**Philosophy:** Color as primary information system.

**Expression:**
- Geometric precision
- Color zones create meaning
- Typography minimal - small sans-serif labels
- Josef Albers' interaction meets data visualization
- Information encoded spatially and chromatically
- Words only anchor what color shows

### Analog Meditation
**Philosophy:** Quiet visual contemplation through texture and breathing room.

**Expression:**
- Paper grain, ink bleeds
- Vast negative space
- Photography and illustration dominate
- Typography whispered (small, restrained)
- Japanese photobook aesthetic
- Images breathe across pages
- Text appears sparingly - short phrases only

### Organic Systems
**Philosophy:** Natural clustering and modular growth patterns.

**Expression:**
- Rounded forms
- Organic arrangements
- Color from nature through architecture
- Information through visual diagrams
- Spatial relationships and iconography
- Text only for key labels floating in space
- Composition tells story through spatial orchestration

### Geometric Silence
**Philosophy:** Pure order and restraint.

**Expression:**
- Grid-based precision
- Bold photography or stark graphics
- Dramatic negative space
- Typography precise but minimal
- Small essential text, large quiet zones
- Swiss formalism meets Brutalist material honesty
- Structure communicates, not words
- Every alignment from countless refinements

## Implementation Guidelines

### Subtle Reference Integration

Embed conceptual DNA without announcing:
- Niche reference woven invisibly
- Those who know feel it intuitively
- Others experience masterful abstract composition
- Like jazz musician quoting another song
- Sophisticated, never literal
- Reference enhances depth quietly

### Color Approach

**Intentional palette:**
- Limited colors (2-5)
- Cohesive system
- Purposeful relationships
- oklch color space for precision
- Each shade carries meaning

**Example palette:**
```
--color-primary: oklch(0.55 0.22 264)
--color-accent: oklch(0.75 0.18 45)
--color-neutral: oklch(0.90 0.02 264)
--color-dark: oklch(0.25 0.15 264)
```

### Typography System

**Thin fonts preferred:**
- Light weights (200-300)
- Clean sans-serifs
- Geometric precision
- Small sizes for labels
- Large sizes for impact moments

**Font integration:**
- Search `./canvas-fonts` directory
- Download needed fonts
- Bring typography onto canvas
- Part of art, not typeset digitally

### Composition Rules

**Systematic approach:**
- Repeating patterns establish rhythm
- Perfect geometric shapes
- Clinical typography
- Reference markers suggest imaginary discipline
- Dense accumulation builds meaning
- Layered patterns reward attention

**Spacing discipline:**
- Nothing falls off page
- Nothing overlaps
- Every element within canvas boundaries
- Proper margins non-negotiable
- Breathing room and clear separation
- Professional execution mandatory

### Canvas Boundaries

**Technical specs:**
- Single page default (multi-page when requested)
- PDF or PNG output
- High resolution
- Clean margins
- Contained composition
- Flawless formatting

## Multi-Page Design Systems

When creating multiple pages:

### Approach
- Treat first page as single page in coffee table book
- Create more pages along same philosophy
- Distinctly different but cohesive
- Pages tell story tastefully
- Full creative freedom

### Consistency Elements
- Shared color palette
- Consistent typography system
- Related compositional approach
- Visual language continuity
- Philosophical thread throughout

### Variation Strategy
- Unique twist per page
- Different focal points
- Varied spatial arrangements
- Complementary patterns
- Progressive visual narrative

## Execution Checklist

Before finalizing:

- [ ] Philosophy guides every decision
- [ ] 90% visual, 10% text maximum
- [ ] Text minimal and integrated
- [ ] Nothing overlaps or falls off page
- [ ] Margins and spacing pristine
- [ ] Composition cohesive with art
- [ ] Appears meticulously crafted
- [ ] Master-level execution evident
- [ ] Sophisticated, never amateur
- [ ] Could be displayed in museum
- [ ] Proves undeniable expertise
- [ ] Formatting flawless
- [ ] Every detail perfect

## Quality Standards

### What to Avoid
- Cartoony aesthetics
- Amateur execution
- Text-heavy composition
- Random placement
- Overlapping elements
- Inconsistent spacing
- Obvious AI generation
- Lack of refinement

### What to Achieve
- Museum quality
- Magazine worthy
- Art object status
- Countless hours appearance
- Top-of-field craftsmanship
- Philosophical coherence
- Visual sophistication
- Systematic precision

## Refinement Process

### Initial Pass
Create based on philosophy and principles.

### Second Pass (Critical)
- Don't add more graphics
- Refine what exists
- Make extremely crisp
- Respect minimalism philosophy
- Increase cohesion with art
- Make existing elements more artistic
- Polish rather than expand

### Final Verification
User already said: "It isn't perfect enough. Must be pristine, masterpiece of craftsmanship, as if about to be displayed in museum."

Apply this standard before delivery.

## Output Format

**Required files:**
1. Design philosophy (.md file)
2. Visual expression (.pdf or .png)

**Philosophy file contains:**
- Movement name
- 4-6 paragraph philosophy
- Visual principles
- Execution guidance

**Canvas file contains:**
- Visual interpretation
- Minimal text
- Systematic composition
- Expert-level execution

## Use Cases

Apply canvas design for:
- Brand identity systems
- Poster designs
- Visual manifestos
- Design system documentation
- Art pieces and compositions
- Conceptual visual frameworks
- Editorial design
- Exhibition materials
- Coffee table books
- Design philosophy demonstrations


## REF: references/shadcn-accessibility.md

# shadcn/ui Accessibility Patterns

ARIA patterns, keyboard navigation, screen reader support, and accessible component usage.

## Foundation: Radix UI Primitives

shadcn/ui built on Radix UI primitives - unstyled, accessible components following WAI-ARIA design patterns.

Benefits:
- Keyboard navigation built-in
- Screen reader announcements
- Focus management
- ARIA attributes automatically applied
- Tested against accessibility standards

## Keyboard Navigation

### Focus Management

**Focus visible states:**
```tsx
<Button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Accessible Button
</Button>
```

**Skip to content:**
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2">
  Skip to content
</a>

<main id="main-content">
  {/* Content */}
</main>
```

### Dialog/Modal Navigation

Dialogs trap focus automatically via Radix Dialog primitive:

```tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    {/* Focus trapped here */}
    <input />  {/* Auto-focused */}
    <Button>Action</Button>
    {/* Esc to close, Tab to navigate */}
  </DialogContent>
</Dialog>
```

Features:
- Focus trapped within dialog
- Esc key closes
- Tab cycles through focusable elements
- Focus returns to trigger on close

### Dropdown/Menu Navigation

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Keyboard shortcuts:
- `Space/Enter`: Open menu
- `Arrow Up/Down`: Navigate items
- `Esc`: Close menu
- `Tab`: Close and move focus

### Command Palette Navigation

```tsx
import { Command } from "@/components/ui/command"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

Features:
- Type to filter
- Arrow keys to navigate
- Enter to select
- Esc to close

## Screen Reader Support

### Semantic HTML

Use proper HTML elements:

```tsx
// Good: Semantic HTML
<button>Click me</button>
<nav><a href="/">Home</a></nav>

// Avoid: Div soup
<div onClick={handler}>Click me</div>
```

### ARIA Labels

**Label interactive elements:**
```tsx
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

<Input aria-label="Email address" type="email" />
```

**Describe elements:**
```tsx
<Button aria-describedby="delete-description">
  Delete Account
</Button>
<p id="delete-description" className="sr-only">
  This action permanently deletes your account and cannot be undone
</p>
```

### Screen Reader Only Text

Use `sr-only` class for screen reader only content:

```tsx
<Button>
  <Trash className="h-4 w-4" />
  <span className="sr-only">Delete item</span>
</Button>

// CSS for sr-only
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
```

### Live Regions

Announce dynamic content:

```tsx
<div aria-live="polite" aria-atomic="true">
  {message}
</div>

// For urgent updates
<div aria-live="assertive">
  {error}
</div>
```

Toast component includes live region:
```tsx
const { toast } = useToast()

toast({
  title: "Success",
  description: "Profile updated"
})
// Announced to screen readers automatically
```

## Form Accessibility

### Labels and Descriptions

**Always label inputs:**
```tsx
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

**Add descriptions:**
```tsx
import { FormDescription, FormMessage } from "@/components/ui/form"

<FormItem>
  <FormLabel>Username</FormLabel>
  <FormControl>
    <Input {...field} />
  </FormControl>
  <FormDescription>
    Your public display name
  </FormDescription>
  <FormMessage />  {/* Error messages */}
</FormItem>
```

### Error Handling

Announce errors to screen readers:

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input
          {...field}
          aria-invalid={!!fieldState.error}
          aria-describedby={fieldState.error ? "email-error" : undefined}
        />
      </FormControl>
      <FormMessage id="email-error" />
    </FormItem>
  )}
/>
```

### Required Fields

Indicate required fields:

```tsx
<Label htmlFor="name">
  Name <span className="text-destructive">*</span>
  <span className="sr-only">(required)</span>
</Label>
<Input id="name" required />
```

### Fieldset and Legend

Group related fields:

```tsx
<fieldset>
  <legend className="text-lg font-semibold mb-4">
    Contact Information
  </legend>
  <div className="space-y-4">
    <FormField name="email" />
    <FormField name="phone" />
  </div>
</fieldset>
```

## Component-Specific Patterns

### Accordion

```tsx
import { Accordion } from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>
      {/* Includes aria-expanded, aria-controls automatically */}
      Is it accessible?
    </AccordionTrigger>
    <AccordionContent>
      {/* Hidden when collapsed, announced when expanded */}
      Yes. Follows WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Tabs

```tsx
import { Tabs } from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList role="tablist">
    {/* Arrow keys navigate, Space/Enter activates */}
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    {/* Hidden unless selected, aria-labelledby links to trigger */}
    Account content
  </TabsContent>
</Tabs>
```

### Select

```tsx
import { Select } from "@/components/ui/select"

<Select>
  <SelectTrigger aria-label="Choose theme">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    {/* Keyboard navigable, announced to screen readers */}
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox and Radio

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" aria-describedby="terms-description" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
<p id="terms-description" className="text-sm text-muted-foreground">
  You agree to our Terms of Service and Privacy Policy
</p>
```

### Alert

```tsx
import { Alert } from "@/components/ui/alert"

<Alert role="alert">
  {/* Announced immediately to screen readers */}
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired
  </AlertDescription>
</Alert>
```

## Color Contrast

Ensure sufficient contrast between text and background.

**WCAG Requirements:**
- **AA**: 4.5:1 for normal text, 3:1 for large text
- **AAA**: 7:1 for normal text, 4.5:1 for large text

**Check defaults:**
```tsx
// Good: High contrast
<p className="text-gray-900 dark:text-gray-100">Text</p>

// Avoid: Low contrast
<p className="text-gray-400 dark:text-gray-600">Hard to read</p>
```

**Muted text:**
```tsx
// Use semantic muted foreground
<p className="text-muted-foreground">
  Secondary text with accessible contrast
</p>
```

## Focus Indicators

Always provide visible focus indicators:

**Default focus ring:**
```tsx
<Button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Button
</Button>
```

**Custom focus styles:**
```tsx
<a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:underline">
  Link
</a>
```

**Don't remove focus styles:**
```tsx
// Avoid
<button className="focus:outline-none">Bad</button>

// Use focus-visible instead
<button className="focus-visible:ring-2">Good</button>
```

## Motion and Animation

Respect reduced motion preference:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In components:
```tsx
<div className="transition-all motion-reduce:transition-none">
  Respects user preference
</div>
```

## Testing Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader announces all content correctly
- [ ] Form errors announced and associated
- [ ] Color contrast meets WCAG AA
- [ ] Semantic HTML used
- [ ] ARIA labels provided for icon-only buttons
- [ ] Modal/dialog focus trap works
- [ ] Dropdown/select keyboard navigable
- [ ] Live regions announce updates
- [ ] Respects reduced motion preference
- [ ] Works with browser zoom up to 200%
- [ ] Tab order logical
- [ ] Skip links provided for navigation

## Tools

**Testing tools:**
- Lighthouse accessibility audit
- axe DevTools browser extension
- NVDA/JAWS screen readers
- Keyboard-only navigation testing
- Color contrast checkers (Contrast Ratio, WebAIM)

**Automated testing:**
```bash
npm install -D @axe-core/react
```

```tsx
import { useEffect } from 'react'

if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000)
  })
}
```


## REF: references/shadcn-components.md

# shadcn/ui Component Reference

Complete catalog of shadcn/ui components with usage patterns and installation.

## Installation

**Add specific components:**
```bash
npx shadcn@latest add button
npx shadcn@latest add button card dialog  # Multiple
npx shadcn@latest add --all              # All components
```

Components install to `components/ui/` with automatic dependency management.

## Form & Input Components

### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small Outline</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
<Button variant="link">Link Style</Button>
```

Variants: `default | destructive | outline | secondary | ghost | link`
Sizes: `default | sm | lg | icon`

### Input
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Form (with React Hook Form + Zod)
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email()
})

function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", email: "" }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-8">
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox
```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

### Radio Group
```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

### Textarea
```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Type your message here." />
```

### Switch
```tsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
```

### Date Picker
```tsx
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

const [date, setDate] = useState<Date>()

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>
```

## Layout & Navigation

### Card
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>
```

### Accordion
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. Comes with default styles customizable with Tailwind.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Navigation Menu
```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Introduction</NavigationMenuLink>
        <NavigationMenuLink>Installation</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Overlays & Dialogs

### Dialog
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Drawer
```tsx
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
      <DrawerDescription>Description</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Popover
```tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Content here</PopoverContent>
</Popover>
```

### Toast
```tsx
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const { toast } = useToast()

<Button onClick={() => {
  toast({
    title: "Scheduled: Catch up",
    description: "Friday, February 10, 2023 at 5:57 PM"
  })
}}>
  Show Toast
</Button>
```

### Command
```tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### Alert Dialog
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This permanently deletes your account and removes data from servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Feedback & Status

### Alert
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components using CLI.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Session expired. Please log in.</AlertDescription>
</Alert>
```

### Progress
```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={33} />
```

### Skeleton
```tsx
import { Skeleton } from "@/components/ui/skeleton"

<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

## Display Components

### Table
```tsx
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Avatar
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

### Badge
```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```


## REF: references/shadcn-theming.md

# shadcn/ui Theming & Customization

Theme configuration, CSS variables, dark mode, and component customization.

## Dark Mode Setup

### Next.js App Router

**1. Install next-themes:**
```bash
npm install next-themes
```

**2. Create theme provider:**
```tsx
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**3. Wrap app:**
```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**4. Theme toggle component:**
```tsx
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

### Vite / Other Frameworks

Use similar approach with next-themes or implement custom solution:

```javascript
// Store preference
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

// Initialize on load
if (localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}
```

## CSS Variable System

shadcn/ui uses CSS variables for theming. Variables defined in `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

### Color Format

Values use HSL format without `hsl()` wrapper for better opacity control:
```css
--primary: 222.2 47.4% 11.2%;  /* H S L */
```

Usage in Tailwind:
```css
background: hsl(var(--primary));
background: hsl(var(--primary) / 0.5);  /* 50% opacity */
```

## Tailwind Configuration

Map CSS variables to Tailwind utilities:

```ts
// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

## Color Customization

### Method 1: Update CSS Variables

Change colors by modifying CSS variables in `globals.css`:

```css
:root {
  --primary: 262.1 83.3% 57.8%;  /* Purple */
  --primary-foreground: 210 20% 98%;
}

.dark {
  --primary: 263.4 70% 50.4%;  /* Darker purple */
  --primary-foreground: 210 20% 98%;
}
```

### Method 2: Theme Generator

Use shadcn/ui theme generator: https://ui.shadcn.com/themes

Select base color, generate theme, copy CSS variables.

### Method 3: Multiple Themes

Create theme variants with data attributes:

```css
[data-theme="violet"] {
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 20% 98%;
}

[data-theme="rose"] {
  --primary: 346.8 77.2% 49.8%;
  --primary-foreground: 355.7 100% 97.3%;
}
```

Apply theme:
```tsx
<div data-theme="violet">
  <Button>Violet theme</Button>
</div>
```

## Component Customization

Components live in your codebase - modify directly.

### Customize Variants

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        // Add custom variant
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        // Add custom size
        xl: "h-14 rounded-md px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

Usage:
```tsx
<Button variant="gradient" size="xl">Custom Button</Button>
```

### Customize Styles

Modify base styles in component:

```tsx
// components/ui/card.tsx
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-lg",  // Modified
      className
    )}
    {...props}
  />
))
```

### Override with className

Pass additional classes to override:

```tsx
<Card className="border-2 border-purple-500 shadow-2xl hover:scale-105 transition-transform">
  Custom styled card
</Card>
```

## Base Color Presets

shadcn/ui provides base color presets during `init`:

- **Slate**: Cool gray tones
- **Gray**: Neutral gray
- **Zinc**: Warm gray
- **Neutral**: Balanced gray
- **Stone**: Earthy gray

Select during setup or change later by updating CSS variables.

## Style Variants

Two component styles available:

- **Default**: Softer, more rounded
- **New York**: Sharp, more contrast

Select during `init` or in `components.json`:

```json
{
  "style": "new-york",
  "tailwind": {
    "cssVariables": true
  }
}
```

## Radius Customization

Control border radius globally:

```css
:root {
  --radius: 0.5rem;  /* Default */
  --radius: 0rem;    /* Sharp corners */
  --radius: 1rem;    /* Rounded */
}
```

Components use radius variable:
```tsx
className="rounded-lg"  /* Uses var(--radius) */
```

## Best Practices

1. **Use CSS Variables**: Enables runtime theme switching
2. **Consistent Foreground Colors**: Pair each color with appropriate foreground
3. **Test Both Themes**: Verify components in light and dark modes
4. **Semantic Naming**: Use `destructive` not `red`, `muted` not `gray`
5. **Accessibility**: Maintain sufficient color contrast (WCAG AA minimum)
6. **Component Overrides**: Use `className` prop for one-off customization
7. **Extract Patterns**: Create custom variants for repeated customizations


## REF: references/tailwind-customization.md

# Tailwind CSS Customization

Config file structure, custom utilities, plugins, and theme extensions.

## @theme Directive

Modern approach to customize Tailwind using CSS:

```css
@import "tailwindcss";

@theme {
  /* Custom colors */
  --color-brand-50: oklch(0.97 0.02 264);
  --color-brand-500: oklch(0.55 0.22 264);
  --color-brand-900: oklch(0.25 0.15 264);

  /* Custom fonts */
  --font-display: "Satoshi", "Inter", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;

  /* Custom spacing */
  --spacing-18: calc(var(--spacing) * 18);
  --spacing-navbar: 4.5rem;

  /* Custom breakpoints */
  --breakpoint-3xl: 120rem;
  --breakpoint-tablet: 48rem;

  /* Custom shadows */
  --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3);

  /* Custom radius */
  --radius-large: 1.5rem;
}
```

**Usage:**
```html
<div class="bg-brand-500 font-display shadow-glow rounded-large">
  Custom themed element
</div>

<div class="tablet:grid-cols-2 3xl:grid-cols-6">
  Custom breakpoints
</div>
```

## Color Customization

### Custom Color Palette

```css
@theme {
  /* Full color scale */
  --color-primary-50: oklch(0.98 0.02 250);
  --color-primary-100: oklch(0.95 0.05 250);
  --color-primary-200: oklch(0.90 0.10 250);
  --color-primary-300: oklch(0.85 0.15 250);
  --color-primary-400: oklch(0.75 0.18 250);
  --color-primary-500: oklch(0.65 0.22 250);
  --color-primary-600: oklch(0.55 0.22 250);
  --color-primary-700: oklch(0.45 0.20 250);
  --color-primary-800: oklch(0.35 0.18 250);
  --color-primary-900: oklch(0.25 0.15 250);
  --color-primary-950: oklch(0.15 0.10 250);
}
```

### Semantic Colors

```css
@theme {
  --color-success: oklch(0.65 0.18 145);
  --color-warning: oklch(0.75 0.15 85);
  --color-error: oklch(0.60 0.22 25);
  --color-info: oklch(0.65 0.18 240);
}
```

```html
<div class="bg-success text-white">Success message</div>
<div class="border-error">Error state</div>
```

## Typography Customization

### Custom Fonts

```css
@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "Merriweather", Georgia, serif;
  --font-mono: "JetBrains Mono", Consolas, monospace;
  --font-display: "Playfair Display", serif;
}
```

```html
<h1 class="font-display">Display heading</h1>
<p class="font-sans">Body text</p>
<code class="font-mono">Code block</code>
```

### Custom Font Sizes

```css
@theme {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-jumbo: 4rem;
}
```

## Spacing Customization

```css
@theme {
  /* Add custom spacing values */
  --spacing-13: calc(var(--spacing) * 13);
  --spacing-15: calc(var(--spacing) * 15);
  --spacing-18: calc(var(--spacing) * 18);

  /* Named spacing */
  --spacing-header: 4rem;
  --spacing-footer: 3rem;
  --spacing-section: 6rem;
}
```

```html
<div class="p-18">Custom padding</div>
<section class="py-section">Section spacing</section>
```

## Custom Utilities

Create reusable utility classes:

```css
@utility content-auto {
  content-visibility: auto;
}

@utility tab-* {
  tab-size: var(--tab-size-*);
}

@utility glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**Usage:**
```html
<div class="content-auto">Optimized rendering</div>
<pre class="tab-4">Code with 4-space tabs</pre>
<div class="glass">Glassmorphism effect</div>
```

## Custom Variants

Create custom state variants:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
@custom-variant aria-checked (&[aria-checked="true"]);
@custom-variant required (&:required);
```

**Usage:**
```html
<div data-theme="midnight">
  <div class="theme-midnight:bg-navy-900">
    Applies in midnight theme
  </div>
</div>

<input class="required:border-red-500" required />
```

## Layer Organization

Organize CSS into layers:

```css
@layer base {
  h1 {
    @apply text-4xl font-bold tracking-tight;
  }

  h2 {
    @apply text-3xl font-semibold;
  }

  a {
    @apply text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  }

  .card {
    @apply bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow;
  }

  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## @apply Directive

Extract repeated utility patterns:

```css
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300;
}

.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.section-container {
  @apply container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl;
}
```

**Usage:**
```html
<button class="btn-primary">Click me</button>
<input class="input-field" />
<div class="section-container">Content</div>
```

## Plugins

### Official Plugins

```bash
npm install -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/container-queries
```

```javascript
// tailwind.config.js
export default {
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
```

**Typography plugin:**
```html
<article class="prose lg:prose-xl">
  <h1>Styled article</h1>
  <p>Automatically styled prose content</p>
</article>
```

**Forms plugin:**
```html
<!-- Automatically styled form elements -->
<input type="text" />
<select></select>
<textarea></textarea>
```

### Custom Plugin

```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

export default {
  plugins: [
    plugin(function({ addUtilities, addComponents, theme }) {
      // Add utilities
      addUtilities({
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)',
        },
      })

      // Add components
      addComponents({
        '.card-custom': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.md'),
        },
      })
    }),
  ],
}
```

## Configuration Examples

### Complete Tailwind Config

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## Dark Mode Configuration

```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],  // or "media" for automatic
  // ...
}
```

**Usage:**
```html
<!-- Class-based -->
<html class="dark">
  <div class="bg-white dark:bg-gray-900">
    Responds to .dark class
  </div>
</html>

<!-- Media query-based -->
<div class="bg-white dark:bg-gray-900">
  Responds to system preference automatically
</div>
```

## Content Configuration

Specify files to scan for classes:

```javascript
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  // ...
}
```

### Safelist

Preserve dynamic classes:

```javascript
export default {
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    {
      pattern: /bg-(red|green|blue)-(100|500|900)/,
    },
  ],
}
```

## Best Practices

1. **Use @theme for simple customizations**: Prefer CSS-based customization
2. **Extract components sparingly**: Use @apply only for truly repeated patterns
3. **Leverage design tokens**: Define custom tokens in @theme
4. **Layer organization**: Keep base, components, and utilities separate
5. **Plugin for complex logic**: Use plugins for advanced customizations
6. **Test dark mode**: Ensure custom colors work in both themes
7. **Document custom utilities**: Add comments explaining custom classes
8. **Semantic naming**: Use descriptive names (primary not blue)


## REF: references/tailwind-responsive.md

# Tailwind CSS Responsive Design

Mobile-first breakpoints, responsive utilities, and adaptive layouts.

## Mobile-First Approach

Tailwind uses mobile-first responsive design. Base styles apply to all screen sizes, then use breakpoint prefixes to override at larger sizes.

```html
<!-- Base: 1 column (mobile)
     sm: 2 columns (tablet)
     lg: 4 columns (desktop) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

## Breakpoint System

**Default breakpoints:**

| Prefix | Min Width | CSS Media Query |
|--------|-----------|-----------------|
| `sm:` | 640px | `@media (min-width: 640px)` |
| `md:` | 768px | `@media (min-width: 768px)` |
| `lg:` | 1024px | `@media (min-width: 1024px)` |
| `xl:` | 1280px | `@media (min-width: 1280px)` |
| `2xl:` | 1536px | `@media (min-width: 1536px)` |

## Responsive Patterns

### Layout Changes

```html
<!-- Vertical on mobile, horizontal on desktop -->
<div class="flex flex-col lg:flex-row gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- 1 column -> 2 columns -> 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Visibility

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">
  Desktop only content
</div>

<!-- Show on mobile, hide on desktop -->
<div class="block lg:hidden">
  Mobile only content
</div>

<!-- Different content per breakpoint -->
<div class="lg:hidden">Mobile menu</div>
<div class="hidden lg:flex">Desktop navigation</div>
```

### Typography

```html
<!-- Responsive text sizes -->
<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">
  Heading scales with screen size
</h1>

<p class="text-sm md:text-base lg:text-lg">
  Body text scales appropriately
</p>
```

### Spacing

```html
<!-- Responsive padding -->
<div class="p-4 md:p-6 lg:p-8">
  More padding on larger screens
</div>

<!-- Responsive gap -->
<div class="flex gap-2 md:gap-4 lg:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Width

```html
<!-- Full width on mobile, constrained on desktop -->
<div class="w-full lg:w-1/2 xl:w-1/3">
  Responsive width
</div>

<!-- Responsive max-width -->
<div class="max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto">
  Centered with responsive max width
</div>
```

## Common Responsive Layouts

### Sidebar Layout

```html
<div class="flex flex-col lg:flex-row min-h-screen">
  <!-- Sidebar: Full width on mobile, fixed on desktop -->
  <aside class="w-full lg:w-64 bg-gray-100 p-4">
    Sidebar
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-4 md:p-8">
    Main content
  </main>
</div>
```

### Card Grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  <div class="bg-white rounded-lg shadow p-6">Card 1</div>
  <div class="bg-white rounded-lg shadow p-6">Card 2</div>
  <div class="bg-white rounded-lg shadow p-6">Card 3</div>
  <div class="bg-white rounded-lg shadow p-6">Card 4</div>
</div>
```

### Hero Section

```html
<section class="py-12 md:py-20 lg:py-32">
  <div class="container mx-auto px-4">
    <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
      <div class="flex-1 text-center lg:text-left">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Hero Title
        </h1>
        <p class="text-lg md:text-xl mb-6">
          Hero description
        </p>
        <button class="px-6 py-3 md:px-8 md:py-4">
          CTA Button
        </button>
      </div>
      <div class="flex-1">
        <img src="hero.jpg" class="w-full rounded-lg" />
      </div>
    </div>
  </div>
</section>
```

### Navigation

```html
<nav class="bg-white shadow">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="text-xl font-bold">Logo</div>

      <!-- Desktop navigation -->
      <div class="hidden md:flex gap-6">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </div>

      <!-- Mobile menu button -->
      <button class="md:hidden">
        <svg class="w-6 h-6">...</svg>
      </button>
    </div>
  </div>
</nav>
```

## Max-Width Queries

Apply styles only below certain breakpoint using `max-*:` prefix:

```html
<!-- Only on mobile and tablet (below 1024px) -->
<div class="max-lg:text-center">
  Centered on mobile/tablet, left-aligned on desktop
</div>

<!-- Only on mobile (below 640px) -->
<div class="max-sm:hidden">
  Hidden only on mobile
</div>
```

Available: `max-sm:` `max-md:` `max-lg:` `max-xl:` `max-2xl:`

## Range Queries

Apply styles between breakpoints:

```html
<!-- Only on tablets (between md and lg) -->
<div class="md:block lg:hidden">
  Visible only on tablets
</div>

<!-- Between sm and xl -->
<div class="sm:grid-cols-2 xl:grid-cols-4">
  2 columns on tablet, 4 on extra large
</div>
```

## Container Queries

Style elements based on parent container width:

```html
<div class="@container">
  <div class="@md:grid-cols-2 @lg:grid-cols-3">
    Responds to parent width, not viewport
  </div>
</div>
```

Container query breakpoints: `@sm:` `@md:` `@lg:` `@xl:` `@2xl:`

## Custom Breakpoints

Define custom breakpoints in theme:

```css
@theme {
  --breakpoint-3xl: 120rem;  /* 1920px */
  --breakpoint-tablet: 48rem;  /* 768px */
}
```

```html
<div class="tablet:grid-cols-2 3xl:grid-cols-6">
  Uses custom breakpoints
</div>
```

## Responsive State Variants

Combine responsive with hover/focus:

```html
<!-- Hover effect only on desktop -->
<button class="lg:hover:scale-105">
  Scale on hover (desktop only)
</button>

<!-- Different hover colors per breakpoint -->
<a class="hover:text-blue-600 lg:hover:text-purple-600">
  Link
</a>
```

## Best Practices

### 1. Mobile-First Design

Start with mobile styles, add complexity at larger breakpoints:

```html
<!-- Good: Mobile first -->
<div class="text-base md:text-lg lg:text-xl">

<!-- Avoid: Desktop first -->
<div class="text-xl lg:text-base">
```

### 2. Consistent Breakpoint Usage

Use same breakpoints across related elements:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  Spacing scales with layout
</div>
```

### 3. Test at Breakpoint Boundaries

Test at exact breakpoint widths (640px, 768px, 1024px, etc.) to catch edge cases.

### 4. Use Container for Content Width

```html
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl">
    Content with consistent max width
  </div>
</div>
```

### 5. Progressive Enhancement

Ensure core functionality works on mobile, enhance for larger screens:

```html
<!-- Core layout works on mobile -->
<div class="p-4">
  <!-- Enhanced spacing on desktop -->
  <div class="lg:p-8">
    Content
  </div>
</div>
```

### 6. Avoid Too Many Breakpoints

Use 2-3 breakpoints per element for maintainability:

```html
<!-- Good: 2 breakpoints -->
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

<!-- Avoid: Too many breakpoints -->
<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
```

## Common Responsive Utilities

### Responsive Display

```html
<div class="block md:flex lg:grid">
  Changes display type per breakpoint
</div>
```

### Responsive Position

```html
<div class="relative lg:absolute">
  Positioned differently per breakpoint
</div>
```

### Responsive Order

```html
<div class="flex flex-col">
  <div class="order-2 lg:order-1">First on desktop</div>
  <div class="order-1 lg:order-2">First on mobile</div>
</div>
```

### Responsive Overflow

```html
<div class="overflow-auto lg:overflow-visible">
  Scrollable on mobile, expanded on desktop
</div>
```

## Testing Checklist

- [ ] Test at 320px (small mobile)
- [ ] Test at 640px (mobile breakpoint)
- [ ] Test at 768px (tablet breakpoint)
- [ ] Test at 1024px (desktop breakpoint)
- [ ] Test at 1280px (large desktop breakpoint)
- [ ] Test landscape orientation
- [ ] Verify touch targets (min 44x44px)
- [ ] Check text readability at all sizes
- [ ] Verify navigation works on mobile
- [ ] Test with browser zoom


## REF: references/tailwind-utilities.md

# Tailwind CSS Utility Reference

Core utility classes for layout, spacing, typography, colors, borders, and shadows.

## Layout Utilities

### Display

```html
<div class="block">Block</div>
<div class="inline-block">Inline Block</div>
<div class="inline">Inline</div>
<div class="flex">Flexbox</div>
<div class="inline-flex">Inline Flex</div>
<div class="grid">Grid</div>
<div class="inline-grid">Inline Grid</div>
<div class="hidden">Hidden</div>
```

### Flexbox

**Container:**
```html
<div class="flex flex-row">Row (default)</div>
<div class="flex flex-col">Column</div>
<div class="flex flex-row-reverse">Reverse row</div>
<div class="flex flex-col-reverse">Reverse column</div>
```

**Justify (main axis):**
```html
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-end">End</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>
<div class="flex justify-evenly">Space evenly</div>
```

**Align (cross axis):**
```html
<div class="flex items-start">Start</div>
<div class="flex items-center">Center</div>
<div class="flex items-end">End</div>
<div class="flex items-baseline">Baseline</div>
<div class="flex items-stretch">Stretch</div>
```

**Gap:**
```html
<div class="flex gap-4">All sides</div>
<div class="flex gap-x-6 gap-y-2">X and Y</div>
```

**Wrap:**
```html
<div class="flex flex-wrap">Wrap</div>
<div class="flex flex-nowrap">No wrap</div>
```

### Grid

**Columns:**
```html
<div class="grid grid-cols-1">1 column</div>
<div class="grid grid-cols-2">2 columns</div>
<div class="grid grid-cols-3">3 columns</div>
<div class="grid grid-cols-4">4 columns</div>
<div class="grid grid-cols-12">12 columns</div>
<div class="grid grid-cols-[1fr_500px_2fr]">Custom</div>
```

**Rows:**
```html
<div class="grid grid-rows-3">3 rows</div>
<div class="grid grid-rows-[auto_1fr_auto]">Custom</div>
```

**Span:**
```html
<div class="col-span-2">Span 2 columns</div>
<div class="row-span-3">Span 3 rows</div>
```

**Gap:**
```html
<div class="grid gap-4">All sides</div>
<div class="grid gap-x-8 gap-y-4">X and Y</div>
```

### Positioning

```html
<div class="static">Static (default)</div>
<div class="relative">Relative</div>
<div class="absolute">Absolute</div>
<div class="fixed">Fixed</div>
<div class="sticky">Sticky</div>

<!-- Position values -->
<div class="absolute top-0 right-0">Top right</div>
<div class="absolute inset-0">All sides 0</div>
<div class="absolute inset-x-4">Left/right 4</div>
<div class="absolute inset-y-8">Top/bottom 8</div>
```

### Z-Index

```html
<div class="z-0">z-index: 0</div>
<div class="z-10">z-index: 10</div>
<div class="z-20">z-index: 20</div>
<div class="z-50">z-index: 50</div>
```

## Spacing Utilities

### Padding

```html
<div class="p-4">All sides</div>
<div class="px-6">Left and right</div>
<div class="py-3">Top and bottom</div>
<div class="pt-8">Top</div>
<div class="pr-4">Right</div>
<div class="pb-2">Bottom</div>
<div class="pl-6">Left</div>
```

### Margin

```html
<div class="m-4">All sides</div>
<div class="mx-auto">Center horizontally</div>
<div class="my-6">Top and bottom</div>
<div class="mt-8">Top</div>
<div class="-mt-4">Negative top</div>
<div class="ml-auto">Push to right</div>
```

### Space Between

```html
<div class="space-x-4">Horizontal spacing</div>
<div class="space-y-6">Vertical spacing</div>
```

### Spacing Scale

- `0`: 0px
- `px`: 1px
- `0.5`: 0.125rem (2px)
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)
- `24`: 6rem (96px)

## Typography

### Font Size

```html
<p class="text-xs">Extra small (12px)</p>
<p class="text-sm">Small (14px)</p>
<p class="text-base">Base (16px)</p>
<p class="text-lg">Large (18px)</p>
<p class="text-xl">XL (20px)</p>
<p class="text-2xl">2XL (24px)</p>
<p class="text-3xl">3XL (30px)</p>
<p class="text-4xl">4XL (36px)</p>
<p class="text-5xl">5XL (48px)</p>
```

### Font Weight

```html
<p class="font-thin">Thin (100)</p>
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>
<p class="font-black">Black (900)</p>
```

### Text Alignment

```html
<p class="text-left">Left</p>
<p class="text-center">Center</p>
<p class="text-right">Right</p>
<p class="text-justify">Justify</p>
```

### Line Height

```html
<p class="leading-none">1</p>
<p class="leading-tight">1.25</p>
<p class="leading-normal">1.5</p>
<p class="leading-relaxed">1.75</p>
<p class="leading-loose">2</p>
```

### Combined Font Utilities

```html
<h1 class="text-4xl/tight font-bold">
  Font size 4xl with tight line height
</h1>
```

### Text Transform

```html
<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">Capitalize</p>
<p class="normal-case">Normal</p>
```

### Text Decoration

```html
<p class="underline">Underline</p>
<p class="line-through">Line through</p>
<p class="no-underline">No underline</p>
```

### Text Overflow

```html
<p class="truncate">Truncate with ellipsis...</p>
<p class="line-clamp-3">Clamp to 3 lines...</p>
<p class="text-ellipsis overflow-hidden">Ellipsis</p>
```

## Colors

### Text Colors

```html
<p class="text-black">Black</p>
<p class="text-white">White</p>
<p class="text-gray-500">Gray 500</p>
<p class="text-red-600">Red 600</p>
<p class="text-blue-500">Blue 500</p>
<p class="text-green-600">Green 600</p>
```

### Background Colors

```html
<div class="bg-white">White</div>
<div class="bg-gray-100">Gray 100</div>
<div class="bg-blue-500">Blue 500</div>
<div class="bg-red-600">Red 600</div>
```

### Color Scale

Each color has 11 shades (50-950):
- `50`: Lightest
- `100-400`: Light variations
- `500`: Base color
- `600-800`: Dark variations
- `950`: Darkest

### Opacity Modifiers

```html
<div class="bg-black/75">75% opacity</div>
<div class="text-blue-500/30">30% opacity</div>
<div class="bg-purple-500/[0.87]">87% opacity</div>
```

### Gradients

```html
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  Left to right gradient
</div>
<div class="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
  With via color
</div>
```

Directions: `to-t | to-tr | to-r | to-br | to-b | to-bl | to-l | to-tl`

## Borders

### Border Width

```html
<div class="border">1px all sides</div>
<div class="border-2">2px all sides</div>
<div class="border-t">Top only</div>
<div class="border-r-4">Right 4px</div>
<div class="border-b-2">Bottom 2px</div>
<div class="border-l">Left only</div>
<div class="border-0">No border</div>
```

### Border Color

```html
<div class="border border-gray-300">Gray</div>
<div class="border-2 border-blue-500">Blue</div>
<div class="border border-red-600/50">Red with opacity</div>
```

### Border Radius

```html
<div class="rounded">0.25rem</div>
<div class="rounded-md">0.375rem</div>
<div class="rounded-lg">0.5rem</div>
<div class="rounded-xl">0.75rem</div>
<div class="rounded-2xl">1rem</div>
<div class="rounded-full">9999px</div>

<!-- Individual corners -->
<div class="rounded-t-lg">Top corners</div>
<div class="rounded-br-xl">Bottom right</div>
```

### Border Style

```html
<div class="border border-solid">Solid</div>
<div class="border-2 border-dashed">Dashed</div>
<div class="border border-dotted">Dotted</div>
```

## Shadows

```html
<div class="shadow-sm">Small</div>
<div class="shadow">Default</div>
<div class="shadow-md">Medium</div>
<div class="shadow-lg">Large</div>
<div class="shadow-xl">Extra large</div>
<div class="shadow-2xl">2XL</div>
<div class="shadow-none">No shadow</div>
```

### Colored Shadows

```html
<div class="shadow-lg shadow-blue-500/50">Blue shadow</div>
```

## Width & Height

### Width

```html
<div class="w-full">100%</div>
<div class="w-1/2">50%</div>
<div class="w-1/3">33.333%</div>
<div class="w-64">16rem</div>
<div class="w-[500px]">500px</div>
<div class="w-screen">100vw</div>

<!-- Min/Max width -->
<div class="min-w-0">min-width: 0</div>
<div class="max-w-md">max-width: 28rem</div>
<div class="max-w-screen-xl">max-width: 1280px</div>
```

### Height

```html
<div class="h-full">100%</div>
<div class="h-screen">100vh</div>
<div class="h-64">16rem</div>
<div class="h-[500px]">500px</div>

<!-- Min/Max height -->
<div class="min-h-screen">min-height: 100vh</div>
<div class="max-h-96">max-height: 24rem</div>
```

## Arbitrary Values

Use square brackets for custom values:

```html
<!-- Spacing -->
<div class="p-[17px]">Custom padding</div>
<div class="top-[117px]">Custom position</div>

<!-- Colors -->
<div class="bg-[#bada55]">Hex color</div>
<div class="text-[rgb(123,45,67)]">RGB</div>

<!-- Sizes -->
<div class="w-[500px]">Custom width</div>
<div class="text-[22px]">Custom font size</div>

<!-- CSS variables -->
<div class="bg-[var(--brand-color)]">CSS var</div>

<!-- Complex values -->
<div class="grid-cols-[1fr_500px_2fr]">Custom grid</div>
```

## Aspect Ratio

```html
<div class="aspect-square">1:1</div>
<div class="aspect-video">16:9</div>
<div class="aspect-[4/3]">4:3</div>
```

## Overflow

```html
<div class="overflow-auto">Auto scroll</div>
<div class="overflow-hidden">Hidden</div>
<div class="overflow-scroll">Always scroll</div>
<div class="overflow-x-auto">Horizontal scroll</div>
<div class="overflow-y-hidden">No vertical scroll</div>
```

## Opacity

```html
<div class="opacity-0">0%</div>
<div class="opacity-50">50%</div>
<div class="opacity-75">75%</div>
<div class="opacity-100">100%</div>
```

## Cursor

```html
<div class="cursor-pointer">Pointer</div>
<div class="cursor-wait">Wait</div>
<div class="cursor-not-allowed">Not allowed</div>
<div class="cursor-default">Default</div>
```

## User Select

```html
<div class="select-none">No select</div>
<div class="select-text">Text selectable</div>
<div class="select-all">Select all</div>
```


## REF: scripts/requirements.txt

# UI Styling Skill Dependencies
# Python 3.10+ required

# No Python package dependencies - uses only standard library

# Testing dependencies (dev)
pytest>=8.0.0
pytest-cov>=4.1.0
pytest-mock>=3.12.0

# Note: This skill works with shadcn/ui and Tailwind CSS
# Requires Node.js and package managers:
#   - Node.js 18+: https://nodejs.org/
#   - npm (comes with Node.js)
#
# shadcn/ui CLI is installed per-project:
#   npx shadcn-ui@latest init


## REF: scripts/tests/requirements.txt

pytest>=7.4.0
pytest-cov>=4.1.0
pytest-mock>=3.11.1
