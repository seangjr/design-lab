# Design Memory

> This file captures reusable design decisions and patterns for this project.
> It's read by the Design Lab plugin to skip redundant questions and ensure consistency.

## Brand Tone

### Adjectives
Minimal, Professional, Fast, Trustworthy

### Voice
Confident but not arrogant. Technical but approachable. Short sentences, active voice.

### Avoid
No playful/casual language in UI copy. No emoji in interface elements. No jargon without context.

---

## Layout & Spacing

### Density
Comfortable — balanced spacing with 16px base grid. Content should breathe.

### Grid System
12-column grid, max-width 1280px, responsive breakpoints at 640/768/1024/1280px.

### Spacing Scale
4px base unit: 4, 8, 12, 16, 24, 32, 48, 64

### Corner Radius
6px for cards, 4px for inputs and buttons, 8px for modals/dialogs, full-round for avatars and badges.

### Shadows
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.07)
- lg: 0 10px 15px rgba(0,0,0,0.1)

---

## Typography

### Font Family
- **Headings:** Inter, 600-700 weight, -0.02em tracking
- **Body:** Inter, 400-500 weight, normal tracking
- **Mono:** JetBrains Mono, 400 weight, for code blocks and technical data

### Type Scale
xs: 12px, sm: 14px, base: 16px, lg: 18px, xl: 20px, 2xl: 24px, 3xl: 30px, 4xl: 36px

### Font Weights
Regular: 400, Medium: 500, Semibold: 600, Bold: 700

---

## Color

### Primary Palette
Blue-600 #2563EB as primary action, Blue-700 #1D4ED8 hover, Blue-50 #EFF6FF light background.

### Secondary Palette
Violet-500 #8B5CF6 for accents and tags, Emerald-500 #10B981 for success/positive states.

### Neutral Strategy
Slate scale from 50–950. Slate-900 for headings, Slate-700 for body text, Slate-400 for muted/placeholder text.

### Semantic Colors
- **Success:** Emerald-500 #10B981, Emerald-50 background
- **Error:** Red-500 #EF4444, Red-50 background
- **Warning:** Amber-500 #F59E0B, Amber-50 background
- **Info:** Blue-500 #3B82F6, Blue-50 background

### Dark Mode
Invert neutral scale (Slate-950 background, Slate-100 text). Use lower opacity for borders (slate-700/50). Elevate surfaces with lighter background tints, not shadows.

---

## Interaction Patterns

### Forms
Labels above inputs. Inline validation on blur. Submit on Enter for single-field forms. Disable submit button until required fields are filled.

### Validation
Red border + error message below field. Validate on blur, re-validate on change after first error. Success checkmark for confirmed valid fields.

### Modals & Drawers
Centered modal for confirmations and short forms. Right drawer for detail views and settings. Trap focus inside, close on Esc and overlay click.

### Tables & Lists
Sticky header on scroll. Hover row highlight with subtle background change. Click row to expand or navigate. Pagination at bottom with page size selector.

### Feedback & Notifications
Toast notifications bottom-right for success actions (auto-dismiss 4s). Inline banners for errors that require attention. Using sonner for toast management.

### Loading States
Skeleton screens for initial page load matching final layout shape. Inline spinner for button actions. Progress bar for file uploads and long operations.

---

## Accessibility Rules

### Focus Management
Visible focus ring: 2px offset, primary color. Trap focus in modals and drawers. Restore focus to trigger element on close.

### Labeling Conventions
All inputs have visible labels (no placeholder-only labels). Icon-only buttons use aria-label. Images have descriptive alt text.

### Motion Preferences
Respect prefers-reduced-motion media query. Provide instant/fade fallbacks for all animations. No auto-playing animations.

### Color Contrast
WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text and UI components. Test with axe DevTools.

---

## Motion & Animation

### Animation Library
Motion library (`import from "motion/react"`) for complex animations (layout, presence, springs). CSS transitions for simple hover/focus states.

### Timing Conventions
150ms for micro-interactions (hover, focus). 200ms for element transitions (expand, collapse). 300ms for page/route transitions.

### Easing Functions
Spring-based defaults preferred: snappy `{ type: "spring", stiffness: 400, damping: 25 }` for buttons/toggles, smooth `{ stiffness: 300, damping: 30 }` for panels/drawers. CSS fallback: ease-out-cubic (0.33, 1, 0.68, 1) for entrances, ease-in (0.4, 0, 1, 1) for exits.

### Reduced Motion Policy
Replace all motion with instant state changes or simple opacity fades. Disable parallax and scroll-triggered animations entirely.

---

## Repo Conventions

### Component Structure
`components/ComponentName/index.tsx` + `ComponentName.test.tsx`. Colocate styles and tests with component.

### File Naming
PascalCase for components (`ProjectCard.tsx`), kebab-case for utilities (`format-date.ts`), camelCase for hooks (`useProjectData.ts`).

### Styling Approach
Tailwind utility classes with `cn()` helper (clsx + twMerge) for conditional classes. No inline styles. Design tokens via CSS custom properties.

### Existing Primitives
Button, Card, Input, Select, Badge, Avatar, Dialog, DropdownMenu, Tabs, Table from shadcn/ui.

---

## Component Library

### UI Framework
shadcn/ui with Radix primitives. Components are copied into `src/components/ui/` and customized.

### Component Config
`components.json` at project root. Style: "default", Tailwind CSS, path alias `@/components`.

### Available Primitives
Button, Card, Dialog, DropdownMenu, Input, Label, Select, Separator, Table, Tabs, Toast, Tooltip, Avatar, Badge, Popover, Sheet

---

## Do / Don't

### Do
- Use semantic HTML elements (`nav`, `main`, `section`, `article`)
- Prefer composition over prop drilling
- Use CSS custom properties for theming
- Keep components under 200 lines — extract sub-components if larger
- Use `aria-live` regions for dynamic content updates

### Don't
- Don't use `!important` in styles
- Don't inline SVGs larger than 1KB — use component imports
- Don't hardcode colors — always reference design tokens
- Don't use `any` type — define proper TypeScript interfaces
- Don't nest Tailwind `@apply` — use utility classes directly

---

## History

| Date | Change | Context |
|------|--------|---------|
| 2026-03-03 | Initial creation | Dashboard redesign project |

---

*Maintained by Design Lab plugin*
