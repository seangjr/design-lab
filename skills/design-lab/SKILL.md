---
name: design-lab
description: Conduct design interviews, generate five distinct UI variations in a temporary design lab, collect feedback, and produce implementation plans. Use when the user wants to explore UI design options, redesign existing components, or create new UI with multiple approaches to compare.
---

# Design Lab Skill

This skill implements a complete design exploration workflow: interview, generate variations, collect feedback, refine, preview, and finalize.

## CRITICAL: Cleanup Behavior

**All temporary files MUST be deleted when the process ends, whether by:**
- User confirms final design → cleanup, then generate plan
- User aborts/cancels → cleanup immediately, no plan generated

**Never leave `.claude-design/` or `design-lab` routes behind.** If the user says "cancel", "abort", "stop", or "nevermind" at any point, confirm and then delete all temporary artifacts.

---

## Phase 0: Preflight Detection

Before starting the interview, automatically detect:

### Package Manager
Check for lock files in the project root:
- `pnpm-lock.yaml` → use `pnpm`
- `yarn.lock` → use `yarn`
- `package-lock.json` → use `npm`
- `bun.lockb` → use `bun`

### Framework Detection
Check for config files:
- `next.config.js` or `next.config.mjs` or `next.config.ts` → **Next.js**
  - Check for `app/` directory → App Router
  - Check for `pages/` directory → Pages Router
- `vite.config.js` or `vite.config.ts` → **Vite**
- `remix.config.js` → **Remix**
- `nuxt.config.js` or `nuxt.config.ts` → **Nuxt**
- `astro.config.mjs` → **Astro**

### Styling System Detection

#### Primary: shadcn/ui + Tailwind CSS (Expected Default)
Check for shadcn/ui first — this is the expected primary styling system:
- `components.json` in project root → **shadcn/ui confirmed**
- `src/components/ui/` or `components/ui/` directory → component location
- `@radix-ui/*` in `package.json` dependencies → Radix UI primitives
- `cn()` or `clsx()` utility function → class merging pattern
- `tailwind.config.js` or `tailwind.config.ts` → **Tailwind CSS** (required for shadcn/ui)

If detected:
- Use existing shadcn components (Button, Input, Card, Dialog, etc.) in variants
- Follow the project's `cn()` utility pattern for class merging
- Reference `components.json` for style configuration (tailwind prefix, aliases)
- Do NOT create competing component primitives

If no styling system detected, **default to Tailwind utility classes**.

#### Fallback: Other Styling Systems
If shadcn/ui + Tailwind is not detected, check for:
- `@mui/material` in dependencies → **Material UI**
- `@chakra-ui/react` in dependencies → **Chakra UI**
- `antd` in dependencies → **Ant Design**
- `styled-components` in dependencies → **styled-components**
- `@emotion/react` in dependencies → **Emotion**
- `.css` or `.module.css` files → **CSS Modules**

These systems are supported but considered fallback paths. Variants will use whatever system the project has, but the plugin is optimized for the shadcn/ui + Tailwind primary path.

### Animation Library Detection
Check `package.json` dependencies for animation libraries:
- `"motion"` in dependencies → **Motion library** (preferred)
  - Import from `"motion/react"`: `motion.div`, `AnimatePresence`, `useReducedMotion`
- `"framer-motion"` in dependencies → **Legacy Framer Motion** (recommend migration to `motion`)
  - Same API, use `import from "motion/react"` when migrating
- Neither detected → **CSS-only animations**; recommend `motion` library in final Design Plan

When Motion library is detected, all variants should use:
- `import { motion, AnimatePresence, useReducedMotion } from "motion/react"`
- `motion.div`, `motion.button`, etc. for animated elements
- `AnimatePresence` for enter/exit animations on conditional renders
- `useReducedMotion()` to respect user accessibility preferences

### Design Memory Check
Look for existing Design Memory file:
- `docs/design-memory.md`
- `DESIGN_MEMORY.md`
- `.claude-design/design-memory.md`

If found, read it and use to prefill defaults and skip redundant questions.

### Design Memory Fast Path

If Design Memory exists, map fields to interview questions:
- `Brand Tone` → Skip Step 1.3 (Brand & Style Direction)
- `Layout & Spacing` → Pre-fill density in Step 1.3
- `Typography` + `Color` → Pre-fill visual style inference
- `Interaction Patterns` → Skip Step 1.2 Question 3 (Functional Inspiration)
- `Accessibility Rules` → Pre-fill constraints in Step 1.5
- `Repo Conventions` → Skip technical constraint detection

Offer a "Skip interview (use Design Memory)" fast-path option at the start.

### Visual Style Inference (CRITICAL)

**DO NOT use generic/predefined styles. Extract visual language from the project:**

**If Tailwind detected**, read `tailwind.config.js` or `tailwind.config.ts`:
This is the expected primary path.
```javascript
// Extract and use:
theme.colors      // Color palette
theme.spacing     // Spacing scale
theme.borderRadius // Radius values
theme.fontFamily  // Typography
theme.boxShadow   // Elevation system
```

**If CSS Variables exist**, read `globals.css`, `variables.css`, or `:root` definitions:
```css
:root {
  --color-*     /* Color tokens */
  --spacing-*   /* Spacing tokens */
  --font-*      /* Typography tokens */
  --radius-*    /* Border radius tokens */
}
```

**If fallback UI library detected** (MUI, Chakra, Ant), read the theme configuration:
- MUI: `theme.ts` or `createTheme()` call
- Chakra: `theme/index.ts` or `extendTheme()` call
- Ant: `ConfigProvider` theme prop

**Always scan existing components** to understand patterns:
- Find 2-3 existing buttons → note their styling patterns
- Find 2-3 existing cards → note padding, borders, shadows
- Find existing forms → note input styles, label placement
- Find existing typography → note heading sizes, body text

**Store inferred styles in the Design Brief** for consistent use across all variants.

---

## Phase 1: Interview

Use the **AskUserQuestion** tool for all interview steps. Adapt questions based on Design Memory if it exists.

### Step 0: Interview Mode

**Question: How thorough should the interview be?**
- Header: "Mode"
- Question: "How would you like to scope the design exploration?"
- Options:
  - "Quick (4 questions)" - Combines scope, goal, constraints, reference into 4 focused questions
  - "Detailed (14 questions)" - Full interview covering all aspects (Recommended)
  - "Skip (use Design Memory)" - Use existing Design Memory + ask for deviations only

If "Quick" selected, combine:
- Q1: Scope + target (component vs page, new vs redesign, file path)
- Q2: Goal + pain points (what's wrong, what should improve)
- Q3: Style direction + constraints (inspiration, brand feel, must-keep elements)
- Q4: Primary user + context (who uses it, desktop vs mobile, key tasks)

If "Skip" selected:
- Verify Design Memory exists
- Display current memory summary
- Ask: "Any deviations from your Design Memory for this specific design?"
- Proceed directly to Phase 2 with memory-derived brief

### Step 1.1: Scope & Target

Ask these questions (can combine into single AskUserQuestion with multiple questions):

**Question 1: Scope**
- Header: "Scope"
- Question: "Are we designing a single component or a full page?"
- Options:
  - "Component" - A reusable UI element (button, card, form, modal, etc.)
  - "Page" - A complete page or screen layout

**Question 2: New or Redesign**
- Header: "Type"
- Question: "Is this a new design or a redesign of something existing?"
- Options:
  - "New" - Creating something from scratch
  - "Redesign" - Improving an existing component/page

If "Redesign" selected, ask:
**Question 3: Existing Path**
- Header: "Location"
- Question: "What is the file path or route of the existing UI?"
- Options: (let user provide via "Other")

If target is unclear, propose a name based on repo patterns and confirm.

### Step 1.2: Pain Points & Inspiration

**Question 1: Pain Points**
- Header: "Problems"
- Question: "What are the top pain points with the current design (or what should this new design avoid)?"
- Options:
  - "Too cluttered/dense" - Information overload, hard to scan
  - "Unclear hierarchy" - Primary actions aren't obvious
  - "Poor mobile experience" - Doesn't work well on small screens
  - "Outdated look" - Feels old or inconsistent with brand
- multiSelect: true

**Question 2: Visual Inspiration**
- Header: "Visual style"
- Question: "What products or brands should I reference for visual inspiration?"
- Options:
  - "Stripe" - Clean, minimal, trustworthy
  - "Linear" - Dense, keyboard-first, developer-focused
  - "Notion" - Flexible, content-focused, playful
  - "Apple" - Premium, spacious, refined
- multiSelect: true

**Question 3: Functional Inspiration**
- Header: "Interactions"
- Question: "What interaction patterns should I emulate?"
- Options:
  - "Inline editing" - Edit in place without modals
  - "Progressive disclosure" - Show more as needed
  - "Optimistic updates" - Instant feedback, sync in background
  - "Keyboard shortcuts" - Power user efficiency

### Step 1.3: Brand & Style Direction

**Question 1: Brand Adjectives**
- Header: "Brand tone"
- Question: "What 3-5 adjectives describe the desired brand feel?"
- Options:
  - "Minimal" - Clean, simple, uncluttered
  - "Premium" - High-end, polished, refined
  - "Playful" - Fun, friendly, approachable
  - "Utilitarian" - Functional, efficient, no-nonsense
- multiSelect: true

**Question 2: Density**
- Header: "Density"
- Question: "What information density do you prefer?"
- Options:
  - "Compact" - More information visible, tighter spacing
  - "Comfortable" - Balanced spacing, easy scanning
  - "Spacious" - Generous whitespace, focused attention

**Question 3: Dark Mode**
- Header: "Dark mode"
- Question: "Is dark mode required?"
- Options:
  - "Yes" - Must support dark mode
  - "No" - Light mode only
  - "Nice to have" - Support if easy, not required

### Step 1.4: Persona & Jobs-to-be-Done

**Question 1: Primary User**
- Header: "User"
- Question: "Who is the primary end user?"
- Options:
  - "Developer" - Technical, keyboard-oriented
  - "Designer" - Visual, detail-oriented
  - "Business user" - Efficiency-focused, less technical
  - "End consumer" - General public, varied technical ability

**Question 2: Context**
- Header: "Context"
- Question: "What's the primary usage context?"
- Options:
  - "Desktop-first" - Primarily used on larger screens
  - "Mobile-first" - Primarily used on phones
  - "Both equally" - Must work well on all devices

**Question 3: Key Tasks**
- Header: "Key tasks"
- Question: "What are the top 3 tasks users must complete?"
- (Let user provide via "Other" - this is open-ended)

### Step 1.5: Constraints

**Question 1: Must-Keep Elements**
- Header: "Keep"
- Question: "Are there elements that must be preserved?"
- Options:
  - "Existing copy/labels" - Keep current text
  - "Current fields/inputs" - Keep form structure
  - "Navigation structure" - Keep current nav
  - "None" - Free to change everything

**Question 2: Technical Constraints**
- Header: "Constraints"
- Question: "Any technical constraints?"
- Options:
  - "No new dependencies" - Use existing libraries only
  - "Use existing components" - Build on current design system
  - "Must be accessible (WCAG)" - Strict accessibility requirements
  - "None" - No special constraints
- multiSelect: true

---

## Phase 2: Generate Design Brief

After the interview, create a structured Design Brief as JSON and save to `.claude-design/design-brief.json`:

```json
{
  "scope": "component|page",
  "isRedesign": true|false,
  "targetPath": "src/components/Example.tsx",
  "targetName": "Example",
  "painPoints": ["Too dense", "Primary action unclear"],
  "inspiration": {
    "visual": ["Stripe", "Linear"],
    "functional": ["Inline validation"]
  },
  "brand": {
    "adjectives": ["minimal", "trustworthy"],
    "density": "comfortable",
    "darkMode": true
  },
  "persona": {
    "primary": "Developer",
    "context": "desktop-first",
    "keyTasks": ["Complete checkout", "Review order", "Apply discount"]
  },
  "constraints": {
    "mustKeep": ["existing fields"],
    "technical": ["no new dependencies", "WCAG accessible"]
  },
  "framework": "nextjs-app",
  "packageManager": "pnpm",
  "stylingSystem": "tailwind",
  "componentLibrary": "shadcn",
  "animationLibrary": "motion"
}
```

Display a summary to the user before proceeding.

---

## Phase 3: Generate Design Lab

### Directory Structure

Create all files under `.claude-design/`:

```
.claude-design/
├── lab/
│   ├── page.tsx                 # Main lab page (framework-specific)
│   ├── variants/
│   │   ├── VariantA.tsx
│   │   ├── VariantB.tsx
│   │   ├── VariantC.tsx
│   │   ├── VariantD.tsx
│   │   └── VariantE.tsx
│   ├── components/
│   │   └── LabShell.tsx         # Lab layout wrapper
│   ├── feedback/                # Interactive feedback system
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── selector-utils.ts    # Element identification
│   │   ├── format-utils.ts      # Feedback formatting
│   │   ├── FeedbackOverlay.tsx  # Main overlay component
│   │   └── index.ts             # Module exports
│   └── data/
│       └── fixtures.ts          # Shared mock data
├── design-brief.json
└── run-log.md
```

### Feedback System Setup (CRITICAL - NEVER SKIP)

**The FeedbackOverlay is the PRIMARY feature of the Design Lab.** Without it, users cannot provide interactive feedback. NEVER generate a Design Lab without the FeedbackOverlay.

**Reliability Strategy:** To avoid import path issues across different project configurations, create the FeedbackOverlay **directly in the route directory** (e.g., `app/design-lab/FeedbackOverlay.tsx`), NOT in `.claude-design/`. This ensures a simple relative import (`./FeedbackOverlay`) always works.

**Required Files in Route Directory:**
```
app/design-lab/           # or app/design-lab/ if underscores work
├── page.tsx              # Main lab page with variants
└── FeedbackOverlay.tsx   # Self-contained overlay component (copy from templates)
```

**Template Source:** `design-lab/templates/feedback/FeedbackOverlay.tsx`

**Why this approach:**
- `.claude-design/` paths can fail due to bundler configurations
- Relative imports from the same directory always work
- The route directory gets deleted during cleanup anyway

### Route Integration

**Next.js App Router:**
Create `app/design-lab/page.tsx` that imports from `.claude-design/lab/`

**Next.js Pages Router:**
Create `pages/design-lab.tsx` that imports from `.claude-design/lab/`

**Vite React:**
- If React Router exists: add route to `/design-lab`
- If no router: create a conditional render in `App.tsx` based on `?design_lab=true` query param

**Other frameworks:**
Create the most appropriate temporary route for the detected framework.

### Variant Generation Guidelines

**IMPORTANT:** Read `DESIGN_PRINCIPLES.md` for UX, interaction, and motion best practices. But **DO NOT use predefined visual styles**—infer them from the project.

**Apply universal principles (from DESIGN_PRINCIPLES.md):**
- **UX**: Nielsen's heuristics, cognitive load reduction, progressive disclosure
- **Component behavior**: Button states, form anatomy, card structure
- **Interaction**: Feedback patterns, state handling, optimistic updates
- **Motion**: Use `motion` library (`import from "motion/react"`) for all animations. Timing tiers: micro 100-150ms, transitions 200-300ms, page 300-400ms, stagger 30-50ms between items. Prefer `type: "spring"` with `bounce: 0.15-0.25` over CSS easing for interactive elements. Always wrap conditional renders in `AnimatePresence`. Always respect `prefers-reduced-motion` via `useReducedMotion()`.
- **Accessibility**: Focus states, ARIA patterns, touch targets (44px min)

**Infer visual styles from the project:**
- Colors → from Tailwind config, CSS variables, or existing components
- Typography → from existing headings, body text in the codebase
- Spacing → from the project's spacing scale or existing patterns
- Border radius → from existing cards, buttons, inputs
- Shadows → from existing elevated components

---

Each variant MUST explore a different design axis. Do not create minor variations—make them meaningfully distinct. **Use the project's existing visual language for all variants.**

**Variant A: Structure** — How content is organized
- Explore different organizational models: list vs cards vs table vs timeline vs masonry
- Focus on information architecture and content grouping
- Test different navigation patterns within the component/page
- **Motion integration:** Use `AnimatePresence` for enter/exit transitions between content sections. Stagger child elements with `staggerChildren: 0.05`. Apply `layout` prop for smooth reflow when content changes.
  ```tsx
  <motion.div layout transition={{ layout: { type: "spring", bounce: 0.2 } }}>
    <AnimatePresence mode="wait">
      {sections.map((section, i) => (
        <motion.section
          key={section.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
          exit={{ opacity: 0 }}
        />
      ))}
    </AnimatePresence>
  </motion.div>
  ```

**Variant B: Hierarchy** — What gets visual emphasis
- Data-forward vs action-forward layouts
- Experiment with which elements are primary, secondary, tertiary
- Test different visual weight distributions
- **Motion integration:** Use `layoutId` for shared element transitions between states. Add scale micro-interactions on CTAs with `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}`. Prefer spring physics for natural feel.
  ```tsx
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  />
  <motion.div layoutId="active-indicator" className="absolute inset-0 bg-primary/10 rounded-md" />
  ```

**Variant C: Rhythm** — Spatial density and pacing
- Compact vs spacious versions using the project's spacing tokens
- Symmetrical vs asymmetric layouts
- Dense data display vs breathing room
- **Motion integration:** Match stagger timing to density — compact layouts use faster timing (30ms stagger, 150ms duration) while spacious layouts use slower timing (60ms stagger, 250ms duration). Use `layout` prop for smooth filter/sort reflow animations.
  ```tsx
  const density = isCompact
    ? { stagger: 0.03, duration: 0.15 }
    : { stagger: 0.06, duration: 0.25 };

  <motion.div layout transition={{ duration: density.duration }}>
    {items.map((item, i) => (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: i * density.stagger } }}
      />
    ))}
  </motion.div>
  ```

**Variant D: Interaction** — Manipulation paradigm
- Inline editing vs modal vs side panel vs drawer vs command palette
- Different form patterns (wizard vs single-page vs inline)
- Hover, click, and keyboard interaction models
- **Motion integration:** Richest motion variant — use `AnimatePresence mode="wait"` for panel/drawer transitions, drag gestures with `drag` prop, `useMotionValue` + `useTransform` for scroll-linked effects, and spring-based dialog entrances.
  ```tsx
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  <AnimatePresence mode="wait">
    {isOpen && (
      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => { if (info.offset.x > 100) close(); }}
      />
    )}
  </AnimatePresence>
  ```

**Variant E: Expression** — Personality level
- Neutral/functional vs distinctive/branded
- Explore different uses of color, typography, and motion
- Minimal vs expressive decoration
- **Motion integration:** Neutral expression uses minimal opacity-only transitions (100-150ms). Expressive expression uses spring physics, parallax effects, hover reveals, SVG path morphs, and `useSpring` for organic feel.
  ```tsx
  // Neutral: subtle opacity only
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} />

  // Expressive: springs, parallax, hover reveals
  const springY = useSpring(0, { stiffness: 300, damping: 20 });

  <motion.div
    style={{ y: springY }}
    whileHover={{ scale: 1.03, rotateZ: 1 }}
    transition={{ type: "spring", bounce: 0.25 }}
  />
  ```

### Variant Distinctiveness Checklist

Before presenting variants, verify each pair differs in at least 2 of:
- [ ] Layout structure (grid vs list vs split)
- [ ] Visual hierarchy (what's emphasized)
- [ ] Information density (compact vs spacious)
- [ ] Interaction model (inline vs modal vs panel)
- [ ] Visual expression (minimal vs branded)

If any two variants are too similar, redesign one to explore a different axis.

### Lab Page Requirements

The Design Lab page must include:

1. **Header** with:
   - Design Brief summary (target, scope, key requirements)
   - Instructions for reviewing

2. **Variant Grid** with:
   - Clear labels (A, B, C, D, E)
   - Brief rationale for each variant ("Why this exists")
   - The actual rendered variant
   - Notes highlighting key differences
   - **IMPORTANT:** Each variant container must have `data-variant="X"` attribute (where X is A, B, C, D, E, or F). This is required for the feedback system to identify which variant comments belong to.

3. **Responsive behavior**:
   - Desktop: side-by-side grid (2-3 columns)
   - Mobile: horizontal scroll or tabs

4. **Shared Data**:
   - All variants use the same fixture data from `data/fixtures.ts`
   - Ensures fair comparison

### Fixture Data Guidelines

- Use realistic data that matches production patterns (names, dates, amounts)
- Include edge cases: empty strings, very long text, zero values, null states
- For redesigns: mirror existing data types and structures from the current implementation
- Include enough items to test pagination/scrolling behavior (15-20 items minimum)
- Use consistent fake data library patterns (e.g., realistic names, not "Test User 1")

5. **Feedback Overlay** (CRITICAL - NEVER OMIT):

   ⚠️ **THIS IS THE MOST IMPORTANT REQUIREMENT** ⚠️

   The FeedbackOverlay enables users to click on elements and leave comments. Without it, the Design Lab is just a static page with no way to collect structured feedback.

   - Create `FeedbackOverlay.tsx` in the SAME directory as `page.tsx`
   - Import with relative path: `import { FeedbackOverlay } from './FeedbackOverlay'`
   - Render at the END of the page, after all variants
   - Pass `targetName` prop with the component/page name

   **Example integration:**

```tsx
import { FeedbackOverlay } from './FeedbackOverlay';  // Relative import - always works

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-background">
      <header>...</header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div data-variant="A">
            <VariantA />
          </div>
          <div data-variant="B">
            <VariantB />
          </div>
          {/* ... more variants */}
        </div>
      </main>

      {/* CRITICAL: FeedbackOverlay must be included */}
      <FeedbackOverlay targetName="ComponentName" />
    </div>
  );
}
```

   **If you forget the FeedbackOverlay, the user CANNOT provide feedback.** This defeats the entire purpose of the Design Lab.

### Code Quality

**Conventions:**
- Follow the project's existing code conventions (file naming, imports, etc.)
- Use the detected styling system (Tailwind, CSS modules, etc.)
- Use existing components from the project where appropriate

**Accessibility (from DESIGN_PRINCIPLES):**
- Semantic HTML: `<button>` not `<div onclick>`, `<nav>`, `<main>`, `<section>`
- Keyboard navigation: all interactive elements focusable and operable
- Focus states: visible `:focus-visible` with 2px ring and offset
- Color contrast: 4.5:1 for text, 3:1 for UI elements
- Touch targets: minimum 44x44px
- ARIA only when HTML semantics aren't enough

**States (every component needs):**
- Default, Hover, Focus, Active, Disabled, Loading, Error, Empty
- See DESIGN_PRINCIPLES "State Handling" section

**Motion (using `motion` library):**

Import patterns — always use `"motion/react"`:
```tsx
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, useSpring, MotionConfig } from "motion/react";
```

Timing rules:
- Micro-interactions (hover, focus, press): 100-150ms
- Element transitions (expand, collapse, toggle): 200-300ms
- Page/route transitions: 300-400ms
- Stagger between list items: 30-50ms

Spring defaults (prefer springs over CSS easing for interactive UI):
- **Snappy** (buttons, toggles): `{ type: "spring", stiffness: 400, damping: 25 }`
- **Smooth** (panels, drawers): `{ type: "spring", stiffness: 300, damping: 30 }`
- **Bouncy** (playful elements): `{ type: "spring", stiffness: 350, damping: 15 }`

Required motion patterns — every variant must include at least 3:

1. **Button micro-interactions:**
```tsx
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} />
```

2. **Conditional content (AnimatePresence):**
```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ type: "spring", bounce: 0.2 }} />
  )}
</AnimatePresence>
```

3. **List stagger:**
```tsx
<motion.ul initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
  {items.map(item => (
    <motion.li key={item.id} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} />
  ))}
</motion.ul>
```

4. **Layout animations:**
```tsx
<motion.div layout transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }} />
```

5. **Reduced motion:**
```tsx
const shouldReduceMotion = useReducedMotion();
<motion.div
  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: shouldReduceMotion ? 0.1 : 0.25 }}
/>
```

shadcn/ui + Motion combination patterns:
- **Dialog** spring entrance: wrap `DialogContent` with `motion.div` using `initial={{ opacity: 0, scale: 0.95 }}` `animate={{ opacity: 1, scale: 1 }}` with spring transition
- **Accordion** height animation: `AnimatePresence` with `motion.div` measuring content height via `useMotionValue`
- **Card** hover lift: `motion.div` with `whileHover={{ y: -2, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}`
- **Toast** entrance: `motion.div` with `initial={{ opacity: 0, y: 50 }}` spring animate
- **Tabs** content switch: `AnimatePresence mode="wait"` on tab panels with cross-fade
- **Dropdown** items stagger: `staggerChildren: 0.03` with `initial={{ opacity: 0, y: -4 }}`

### Next.js App Router: Component Boundaries

- The lab page (`page.tsx`) can be a Server Component for initial HTML
- Variant components that need interactivity → 'use client' directive
- FeedbackOverlay MUST be a Client Component ('use client')
- Fixtures/data files should NOT have 'use client' — they can be imported by both
- If a variant uses hooks (useState, useEffect), it MUST be a Client Component
- Prefer Server Components for static variant shells, Client Components for interactive parts

---

## Phase 4: Present Design Lab to User

After generating the lab files, **immediately** present the lab to the user. Do NOT attempt to:
- Start the dev server yourself (it runs forever and will block)
- Check if ports are open
- Open a browser
- Wait for any server response

### Port Detection

When outputting the lab URL, infer the correct port:
1. Check `.env` / `.env.local` for `PORT=`
2. Check `package.json` scripts for `--port` flags
3. Framework defaults: Next.js → 3000, Vite → 5173, Astro → 4321, Remix → 3000

### What to Do

1. **Output the lab location and URL:**
   ```
   ✅ Design Lab created!

   I've generated 5 design variants in `.claude-design/lab/`

   To view them:
   1. Make sure your dev server is running (run `pnpm dev` if not)
   2. Open: http://localhost:3000/design-lab

   Take your time reviewing the variants side-by-side, then come back and tell me:
   - Which variant wins (A-E)
   - What you like about it
   - What should change
   ```

2. **Immediately proceed to Phase 5** - ask for feedback. Do NOT wait for the user to say they've opened the browser. Just present the feedback questions right away so they're ready when the user returns.

### Why Not Start the Server

Running `pnpm dev` or `npm run dev` starts a long-running process that never exits. If you run it, you'll wait forever. The user likely already has their dev server running, or can start it themselves in another terminal.

---

## Phase 5: Collect Feedback

After presenting the lab URL, the user can provide feedback in two ways:
1. **Interactive Feedback** (recommended): Using the built-in overlay in the browser
2. **Manual Feedback**: Via AskUserQuestion in the terminal

### Interactive Feedback (Primary Method)

The Design Lab includes a Figma-like feedback overlay. When presenting the lab, include these instructions:

```
✅ Design Lab created!

I've generated 5 design variants in `.claude-design/lab/`

To view and provide feedback:
1. Make sure your dev server is running (run `pnpm dev` if not)
2. Open: http://localhost:3000/design-lab

**To add feedback:**
1. Click the "Add Feedback" button (bottom-right corner)
2. Click any element you want to comment on
3. Type your feedback and click "Save"
4. Repeat for all elements you want to comment on
5. Fill in the "Overall Direction" field (required)
6. Click "Submit All Feedback"
7. Paste the copied text here in the terminal

Or just describe your feedback manually below!
```

**When the user pastes feedback**, it will be in this format:

```markdown
## Design Lab Feedback

**Target:** ComponentName
**Comments:** 3

### Variant A
1. **Button** (`[data-testid='submit']`, button with "Submit")
   "Make this more prominent"

### Variant B
1. **Card** (`.product-card`, div with "Product Name")
   "Love this layout"

### Overall Direction
Go with Variant B's structure. Apply Variant A's button styling.
```

**How to parse and act on this feedback:**

1. **Read the Overall Direction** first - this guides your synthesis
2. **For each comment**, locate the element using:
   - Primary: The CSS selector in backticks (e.g., `[data-testid='submit']`)
   - Secondary: The element description (e.g., "button with 'Submit'")
3. **Apply the feedback** by editing the corresponding variant file

### Fallback: Manual Feedback via AskUserQuestion

If the user prefers not to use the interactive overlay (or pastes manual feedback), use the AskUserQuestion flow below:

### Stage 1: Check for a Winner

**Question 1: Ready to pick?**
- Header: "Decision"
- Question: "Is there one variant you like as is?"
- Options:
  - "Yes - I found one I like" - Ready to select a winner and refine
  - "No - I like parts of different ones" - Need to synthesize a new variant

### Stage 2A: If User Found a Winner

If user said "Yes", ask:

**Question 2a: Which one?**
- Header: "Winner"
- Question: "Which variant do you want to go with?"
- Options:
  - "Variant A" - [brief description of A]
  - "Variant B" - [brief description of B]
  - "Variant C" - [brief description of C]
  - "Variant D" - [brief description of D]
  - "Variant E" - [brief description of E]

**Question 3a: Any tweaks?**
- Header: "Tweaks"
- Question: "Any small changes needed, or is it good as is?"
- Options:
  - "Good as is" - No changes needed, proceed to final preview
  - "Minor tweaks needed" - I'll describe what to adjust

If "Minor tweaks needed", ask user to describe changes via text input.

Then proceed to **Phase 7: Final Preview**.

### Stage 2B: If User Wants to Synthesize

If user said "No - I like parts of different ones", ask:

**Question 2b: What do you like about each?**
- Header: "Feedback"
- Question: "What do you like about each variant? (mention specific elements from A, B, C, D, E)"
- (Let user provide detailed feedback via "Other" text input)

Example response format to guide user:
```
- A: Love the card layout and spacing
- B: The color scheme feels right
- C: The interaction on hover is great
- D: Nothing stands out
- E: The typography hierarchy is clearest
```

Then proceed to **Phase 6: Synthesize New Variant**.

---

## Phase 6: Synthesize New Variant

Based on the user's feedback about what they liked from each variant:

1. **Create a new hybrid variant** (Variant F) that combines:
   - The specific elements the user called out from each
   - The best structural decisions across all variants
   - Any patterns that appeared in multiple variants

2. **Replace the Design Lab** with a comparison view:
   - Show the new synthesized Variant F prominently
   - Keep 1-2 of the original variants that were closest for comparison
   - Remove variants that had nothing the user liked

3. **Update the `/design-lab` route** to show the new arrangement

4. **Ask for feedback again:**

**Question: How's the new variant?**
- Header: "Review"
- Question: "How does the synthesized variant (F) look?"
- Options:
  - "This is it!" - Proceed to final preview
  - "Getting closer" - Need another iteration
  - "Went the wrong direction" - Let me clarify what I want

If "Getting closer" or "Went the wrong direction", gather more specific feedback and iterate. Support multiple synthesis passes until user is satisfied.

### Synthesis Iteration Limit

Cap synthesis at 3 iterations. After 3 rounds:
- Present current state clearly
- Offer: "Start fresh with new variants" or "Final polish pass"
- "Start fresh" returns to Phase 3 with updated brief
- "Final polish pass" allows one more round of minor tweaks only

Then proceed to **Phase 7: Final Preview**.

---

## Phase 7: Final Preview

Once user is satisfied:

1. Create `.claude-design/preview/` directory:
   ```
   .claude-design/preview/
   ├── page.tsx                    # Preview page
   └── FinalDesign.tsx             # The winning design
   ```

2. Create route at `/design-preview`

3. For redesigns, include before/after comparison:
   - Toggle switch or split view
   - Show original alongside proposed

4. Ask for final confirmation:

**Question: Confirm final design?**
- Header: "Confirm"
- Question: "Ready to finalize this design?"
- Options:
  - "Yes, finalize it" - Proceed to cleanup and generate implementation plan
  - "No, needs changes" - Tell me what to adjust
  - "Abort - cancel everything" - Delete all temp files, no plan generated

If "No, needs changes": gather feedback and iterate.
If "Abort": proceed to **Abort Handling** below.

---

## Abort Handling

If the user wants to cancel/abort at ANY point during the process (not just final confirmation), they may say things like:
- "cancel"
- "abort"
- "stop"
- "nevermind"
- "forget it"
- "I changed my mind"

When abort is detected:

1. **Confirm the abort:**
   - "Are you sure you want to cancel? This will delete all the design lab files I created."

2. **If confirmed, clean up immediately:**
   - Delete `.claude-design/` directory entirely
   - Delete temporary route files (`app/design-lab/`, etc.)
   - Do NOT generate any implementation plan
   - Do NOT update Design Memory

3. **Acknowledge:**
   - "Design exploration cancelled. All temporary files have been cleaned up. Let me know if you want to start fresh later."

---

## Phase 8: Finalize

When user confirms (selected "Yes, finalize it"):

### 8.1: Cleanup

Delete all temporary files:
- Remove `.claude-design/` directory entirely
- Remove temporary route files:
  - `app/design-lab/` (Next.js App Router)
  - `pages/design-lab.tsx` (Next.js Pages Router)
  - `app/design-preview/`
  - `pages/design-preview.tsx`
  - Revert any `App.tsx` modifications (Vite)

**Safety rules:**
- ONLY delete files inside `.claude-design/`
- ONLY delete route files that the plugin created
- NEVER delete user-authored files
- Verify file paths before deletion

### 8.2: Generate Implementation Plan

Create `DESIGN_PLAN.md` in the project root:

```markdown
# Design Implementation Plan: [TargetName]

## Summary
- **Scope:** [component/page]
- **Target:** [file path]
- **Winner variant:** [A-E]
- **Key improvements:** [from feedback]

## Files to Change
- [ ] `src/components/Example.tsx` - Main component refactor
- [ ] `src/styles/example.css` - Style updates
- [ ] ... (list all affected files)

## Implementation Steps
1. [Specific step with code guidance]
2. [Next step]
3. ...

## Component API
- **Props:**
  - `prop1: type` - description
  - ...
- **State:**
  - Internal state requirements
- **Events:**
  - Callbacks and handlers

## Required UI States
- **Loading:** [description]
- **Empty:** [description]
- **Error:** [description]
- **Disabled:** [description]
- **Validation:** [description]

## Accessibility Checklist
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Labels and aria-* attributes correct
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested

## Testing Checklist
- [ ] Unit tests for logic
- [ ] Component tests for rendering
- [ ] Visual regression tests (if applicable)
- [ ] E2E smoke test (if applicable)

## Design Tokens
- [Any new tokens to add]
- [Existing tokens to use]

## Motion Specifications
- **Library:** `motion` (import from `"motion/react"`)
- **Enter transitions:** [e.g., fade + slide up, spring scale]
- **Exit transitions:** [e.g., fade out, slide in direction of dismissal]
- **Micro-interactions:** [e.g., button scale on hover/tap, card lift on hover]
- **Stagger patterns:** [e.g., list items 40ms delay, grid items 50ms delay]
- **Spring configs:** [e.g., snappy: stiffness 400/damping 25, smooth: 300/30]
- **Reduced motion fallback:** Opacity-only transitions, no springs/slides, instant state changes

---

*Generated by Design Variations plugin*
```

### 8.3: Update Design Memory

Create or update `DESIGN_MEMORY.md`:

If new file:
```markdown
# Design Memory

## Brand Tone
- **Adjectives:** [from interview]
- **Avoid:** [anti-patterns discovered]

## Layout & Spacing
- **Density:** [preference]
- **Grid:** [if established]
- **Corner radius:** [if consistent]
- **Shadows:** [if consistent]

## Typography
- **Headings:** [font, weights used]
- **Body:** [font, size]
- **Emphasis:** [patterns]

## Color
- **Primary:** [color tokens]
- **Secondary:** [color tokens]
- **Neutral strategy:** [approach]
- **Semantic colors:** [error, success, warning]

## Interaction Patterns
- **Forms:** [validation approach, layout]
- **Modals/Drawers:** [when to use which, motion entrance patterns]
- **Tables/Lists:** [preferred patterns, layout animation on sort/filter]
- **Feedback:** [toast with motion entrance, inline, etc.]
- **Animation Library:** `motion` (import from `"motion/react"`) — spring-based micro-interactions on interactive elements

## Accessibility Rules
- **Focus:** [visible focus approach]
- **Labels:** [labeling conventions]
- **Motion:** Use `useReducedMotion()` from `"motion/react"` — replace springs/slides with opacity-only transitions when user prefers reduced motion

## Repo Conventions
- **Component structure:** [file organization]
- **Styling approach:** [Tailwind classes, CSS modules, etc.]
- **Existing primitives:** [Button, Input, Card, etc.]

---

*Updated by Design Variations plugin*
```

If updating existing file:
- Append new patterns discovered
- Update any conflicting guidance with latest decisions
- Keep file concise and actionable

---

## Error Handling Decision Tree

### Framework Not Detected
1. Check if `package.json` exists → if not, this isn't a JS project
2. Check for framework configs manually
3. Ask user: "I couldn't detect your framework. What are you using?"
4. Provide options: Next.js, Vite, Remix, Astro, CRA, Other

### TypeScript Errors in Generated Code
1. Check `tsconfig.json` for strict mode settings
2. Common fixes: add missing type annotations, handle nullable types
3. If persistent: generate `.tsx` files with `// @ts-nocheck` temporarily, note in run-log

### Tailwind Classes Not Applied
1. Verify `content` paths in Tailwind config include `.claude-design/`
2. If not, temporarily add the path and note for cleanup
3. If Tailwind v4: check for `@import` vs `@tailwind` directive differences

### Route Name Conflicts
1. If `design-lab` conflicts with an existing user route, try `design-lab-temp`
2. Document the chosen name in `.claude-design/run-log.md`
3. Note: never use `_` or `__` prefixed folders — Next.js App Router treats these as private folders excluded from routing

### ESLint/Prettier Blocking Build
1. Generated code should follow project's existing lint rules
2. If lint fails, fix automatically where possible
3. For unfixable rules: add `/* eslint-disable */` at file top, note in run-log

### Build Fails After Lab Generation
1. Check for missing dependencies (imports from non-installed packages)
2. Check for path alias issues (@ paths not resolving in .claude-design/)
3. Verify all imports use relative paths from the route directory

---

## Recovery from Crashed Sessions

If a previous session crashed or was interrupted:
1. Check for `.claude-design/` directory — delete if found
2. Check for `design-lab` routes — delete if found
3. Check `app/` and `pages/` for any `design-` prefixed files
4. Check `.claude-design/run-log.md` for the session state
5. If Vite project: check if `App.tsx` was modified (look for design lab conditional)
6. Run `cleanup-check.sh` to verify clean state
7. Inform user of recovered state before starting new session

---

## Configuration Options

The plugin reads configuration from these sources (in priority order):
1. **Environment variables**: `DESIGN_AUTO_IMPLEMENT`, `DESIGN_KEEP_LAB`, `DESIGN_MEMORY_PATH`
2. **`.claude-design/config.json`**: Project-level overrides
3. **Defaults**: `DESIGN_AUTO_IMPLEMENT=false`, `DESIGN_KEEP_LAB=false`, `DESIGN_MEMORY_PATH=DESIGN_MEMORY.md`

### Reading Configuration

At the start of each session, check:
```
const config = {
  autoImplement: process.env.DESIGN_AUTO_IMPLEMENT === 'true',
  keepLab: process.env.DESIGN_KEEP_LAB === 'true',
  memoryPath: process.env.DESIGN_MEMORY_PATH || 'DESIGN_MEMORY.md',
};
```

### Behavior

- `DESIGN_AUTO_IMPLEMENT=true`: After finalization, immediately start implementing the DESIGN_PLAN.md
- `DESIGN_KEEP_LAB=true`: Skip automatic cleanup; user must run `/design-lab:cleanup` manually
- `DESIGN_MEMORY_PATH`: Custom location for Design Memory file (relative to project root)

---

## Example Session Flow

1. User: `/design-variations:design CheckoutSummary`
2. Plugin detects: Next.js App Router, Tailwind, pnpm
3. Plugin finds: No existing Design Memory
4. Plugin asks: Interview questions (5 steps)
5. Plugin generates: Design Brief summary
6. Plugin creates: `.claude-design/lab/` with 5 variants
7. Plugin creates: `app/design-lab/page.tsx`
8. Plugin outputs: Lab URL and review instructions
9. Plugin outputs: "Open http://localhost:3000/design-lab"
10. User reviews variants in browser
11. Plugin asks: "Which variant wins?"
12. User: "Variant C, but change X and Y"
13. Plugin refines: Updates Variant C
14. User: "Looks good"
15. Plugin creates: Final preview at `/design-preview`
16. User: "Confirmed"
17. Plugin: Deletes all temp files
18. Plugin: Generates `DESIGN_PLAN.md`
19. Plugin: Creates `DESIGN_MEMORY.md`
20. Plugin: "Done! See DESIGN_PLAN.md for implementation steps"
