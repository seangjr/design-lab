# Design Memory

> This file captures reusable design decisions and patterns for this project.
> It's read by the Design and Refine plugin to skip redundant questions and ensure consistency.

## Brand Tone

### Adjectives
<!-- e.g., Minimal, Trustworthy, Professional, Modern -->

### Voice
<!-- e.g., Confident but not arrogant, technical but approachable -->

### Avoid
<!-- e.g., Avoid playful/casual language, no emoji in UI copy, no jargon -->

---

## Layout & Spacing

### Density
<!-- e.g., Comfortable — balanced spacing with 16px base grid -->

### Grid System
<!-- e.g., 12-column grid, max-width 1280px, responsive breakpoints at 640/768/1024/1280 -->

### Spacing Scale
<!-- e.g., 4px base unit: 4, 8, 12, 16, 24, 32, 48, 64 -->

### Corner Radius
<!-- e.g., 6px for cards, 4px for inputs, 8px for modals, full-round for avatars -->

### Shadows
<!-- e.g., sm: 0 1px 2px rgba(0,0,0,0.05), md: 0 4px 6px rgba(0,0,0,0.07), lg: 0 10px 15px rgba(0,0,0,0.1) -->

---

## Typography

### Font Family
- **Headings:** <!-- e.g., Inter, 600-700 weight, -0.02em tracking -->
- **Body:** <!-- e.g., Inter, 400-500 weight, normal tracking -->
- **Mono:** <!-- e.g., JetBrains Mono, 400 weight, for code blocks -->

### Type Scale
<!-- e.g., xs: 12px, sm: 14px, base: 16px, lg: 18px, xl: 20px, 2xl: 24px, 3xl: 30px -->

### Font Weights
<!-- e.g., Regular: 400, Medium: 500, Semibold: 600, Bold: 700 -->

---

## Color

### Primary Palette
<!-- e.g., Blue-600 #2563EB as primary action, Blue-700 #1D4ED8 hover, Blue-50 #EFF6FF background -->

### Secondary Palette
<!-- e.g., Violet-500 #8B5CF6 for accents, Emerald-500 #10B981 for success states -->

### Neutral Strategy
<!-- e.g., Slate scale from 50-950, Slate-700 for body text, Slate-400 for muted -->

### Semantic Colors
- **Success:** <!-- e.g., Emerald-500 #10B981, Emerald-50 background -->
- **Error:** <!-- e.g., Red-500 #EF4444, Red-50 background -->
- **Warning:** <!-- e.g., Amber-500 #F59E0B, Amber-50 background -->
- **Info:** <!-- e.g., Blue-500 #3B82F6, Blue-50 background -->

### Dark Mode
<!-- e.g., Invert neutral scale, use lower opacity for borders, elevate with lighter bg not shadow -->

---

## Interaction Patterns

### Forms
<!-- e.g., Labels above inputs, inline validation on blur, submit on Enter for single-field forms -->

### Validation
<!-- e.g., Red border + message below field, validate on blur, re-validate on change after first error -->

### Modals & Drawers
<!-- e.g., Centered modal for confirmations, right drawer for detail views, trap focus, Esc to close -->

### Tables & Lists
<!-- e.g., Sticky header, hover row highlight, click row to expand, pagination at bottom -->

### Feedback & Notifications
<!-- e.g., Toast bottom-right for success, inline banner for errors, sonner/toast library -->

### Loading States
<!-- e.g., Skeleton screens for initial load, spinner for actions, progress bar for uploads -->

---

## Accessibility Rules

### Focus Management
<!-- e.g., Visible focus ring (2px offset, primary color), trap focus in modals, restore on close -->

### Labeling Conventions
<!-- e.g., All inputs have visible labels, icon-only buttons use aria-label, images need alt text -->

### Motion Preferences
<!-- e.g., Respect prefers-reduced-motion, provide instant fallbacks for all animations -->

### Color Contrast
<!-- e.g., WCAG AA minimum (4.5:1 text, 3:1 UI), test with Stark or axe DevTools -->

---

## Motion & Animation

### Animation Library
<!-- e.g., Motion (import from "motion/react") — preferred, CSS transitions as fallback, GSAP, none -->

### Timing Conventions
<!-- e.g., 150ms for micro-interactions, 300ms for page transitions -->

### Easing Functions
<!-- e.g., Spring-based preferred: snappy { stiffness: 400, damping: 25 }, smooth { stiffness: 300, damping: 30 }. CSS fallback: ease-out-cubic for entrances, ease-in for exits -->

### Reduced Motion Policy
<!-- e.g., Replace all motion with instant/fade, disable parallax -->

---

## Repo Conventions

### Component Structure
<!-- e.g., components/ComponentName/index.tsx + ComponentName.test.tsx + ComponentName.module.css -->

### File Naming
<!-- e.g., PascalCase for components, kebab-case for utilities, camelCase for hooks -->

### Styling Approach
<!-- e.g., Tailwind utility classes, cn() helper for conditional classes, no inline styles -->

### Existing Primitives
<!-- e.g., Button, Card, Input, Select, Badge, Avatar from shadcn/ui already installed -->

---

## Component Library

### UI Framework
<!-- e.g., shadcn/ui with Radix primitives, custom design system, MUI -->

### Component Config
<!-- e.g., components.json path, style: "default", tailwind prefix, path aliases -->

### Available Primitives
<!-- List installed shadcn components or design system primitives -->
<!-- e.g., Button, Card, Dialog, DropdownMenu, Input, Select, Table, Tabs -->

---

## Do / Don't

### Do
<!-- e.g., Use semantic HTML elements, prefer composition over prop drilling, use CSS variables for theming -->

### Don't
<!-- e.g., Don't use !important, don't inline SVGs larger than 1KB, don't hardcode colors -->

---

## History

| Date | Change | Context |
|------|--------|---------|
| [YYYY-MM-DD] | Initial creation | [project or session context] |

---

*Maintained by Design and Refine plugin*
