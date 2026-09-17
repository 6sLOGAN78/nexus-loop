# UI Spacing and Alignment Audit

## Current Spacing Problems
1. **Pill Buttons:** The padding on hero pill buttons (`px-6 py-3`) does not match the spec's `padding: 0 20px`. This makes them look too bulky compared to the editorial design.
2. **Nav Links:** Navigation links have inconsistent padding and alignment. The spec calls for a simple `padding 2px 0` in a whisper-quiet transparent top bar.
3. **Floating Product Artifacts:** The internal padding on floating cards is a uniform `20px` (`p-5`), but the spec explicitly requires an asymmetrical `16px 20px 12px 12px` to balance internal content properly.
4. **Neutral Feature Cards:** The cards in the Pipeline section use `p-8 pb-12`, creating uneven internal vertical rhythm. The spec dictates `padding 32px 20px` (`py-8 px-5`).
5. **Section Gaps:** Several sections use `md:py-[120px]`, ignoring the strict `Section gap: 80px` (`py-20`) defined in the spacing scale.
6. **Accent Peach Card:** Uses `md:p-16`, pushing the padding too far out. The spec strictly defines `padding 40px` (`p-10`).

## Root Causes
- Arbitrary overriding of design tokens with utility classes (e.g., using `p-5` instead of specific side paddings).
- Inconsistent application of responsive modifiers (`md:py-[120px]`) that break the defined 80px rhythm on desktop screens.
- Misunderstanding of the base 4px unit multiplier, leading to padding values like `px-6 py-3` instead of the specified `0 20px` (which maps to Tailwind's `px-5 py-2` assuming a height context, or similar).

## Files/Components Needing Changes
- `src/app/page.tsx`: Entire page layout, replacing arbitrary spacing with exact tokens.
  - Navbar: Fix link paddings.
  - Hero: Fix pill button paddings, floating card internal padding (`pt-4 pr-5 pb-3 pl-3`).
  - Feature 1: Normalize grid gaps and neutral card padding (`py-8 px-5`).
  - Accent Section: Fix peach card padding (`p-10`).
  - Feature 2: Fix section gap (`py-20`).
  - Footer: Fix top padding to 80px (`pt-20` instead of `pt-[120px]`).
