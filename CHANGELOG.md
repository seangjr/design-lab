# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-03

### Changed
- Forked from `0xdesigner/design-plugin` to Khaeli Internal
- Updated authorship and plugin metadata

### Fixed
- **FeedbackOverlay**: `nth-child` selector bug — changed to `nth-of-type` for correct same-tag sibling matching
- **FeedbackOverlay**: `data-cy` attribute mismatch — now tracks which attribute was found and uses correct name in selector
- **FeedbackOverlay**: Pin positions break on scroll — changed to `position: fixed` with scroll/resize listeners for recalculation
- **FeedbackOverlay**: DOM mutation via `__feedbackClickInfo` — replaced with `useRef` storage
- **FeedbackOverlay**: Auto-clear after copy destroys feedback — removed auto-clear, added explicit "Clear & Start Over" button
- **FeedbackOverlay**: Submit blocked with only overall direction — enabled submit when `overallDirection` has content
- **FeedbackOverlay**: `isOverlayElement` fails on SVG — uses `getAttribute('class')` instead of `className` property
- **FeedbackOverlay**: Layout thrashing from `getBoundingClientRect` in render — moved to `useEffect` with state map
- **format-utils**: `downloadJSON` URL revocation race — increased timeout to 1500ms
- **format-utils**: `formatComment` only shows last path segment — now keeps last 2 segments
- **selector-utils**: Unreachable `aria-label` fallback in `getElementLabel` input branch
- **cleanup-check.sh**: `find` command now excludes `node_modules`
- **cleanup-check.sh**: Exits with non-zero code when warnings found
- **cleanup-check.sh**: Checks for accidentally git-tracked temp files
- **SKILL.md**: Contradictory example session (pnpm dev) corrected
- **DESIGN_PLAN.template.md**: Replaced Handlebars block syntax with Claude-friendly placeholders

### Added
- Accessibility: `role="dialog"` and `aria-modal` on submit modal
- Accessibility: Focus trap for comment panel and submit modal
- Accessibility: `aria-hidden="true"` on emoji in toggle button
- Accessibility: `:focus-visible` styles on all buttons
- Accessibility: Escape key handler on submit modal
- Accessibility: `prefers-reduced-motion` support
- UX: Keyboard shortcut (`F` key) to toggle feedback mode
- UX: Double-click guard on copy button
- UX: Deduplicated textarea CSS with shared base class
- UX: Replaced inline `commentsByVariant` reduce with existing `groupByVariant` utility
- **SKILL.md**: Port detection logic for Phase 4
- **SKILL.md**: Design Memory skip rules with interview question mapping
- **SKILL.md**: Tiered interview (Quick / Detailed / Skip)
- **SKILL.md**: Orthogonal variant axes (Structure, Hierarchy, Rhythm, Interaction, Expression)
- **SKILL.md**: Variant distinctiveness checklist
- **SKILL.md**: Fixtures generation guidance
- **SKILL.md**: Server Component vs Client Component boundary rules
- **SKILL.md**: Synthesis iteration cap at 3
- **SKILL.md**: Error handling decision tree
- **SKILL.md**: Recovery guidance for crashed sessions
- **SKILL.md**: Configuration env var documentation
- **DESIGN_PRINCIPLES.md**: CSS Container Queries section
- **DESIGN_PRINCIPLES.md**: CSS `@layer` and token architecture section
- **DESIGN_PRINCIPLES.md**: View Transitions API section
- **DESIGN_PRINCIPLES.md**: Popover API section
- **DESIGN_PRINCIPLES.md**: Skeleton screen patterns section
- **DESIGN_PRINCIPLES.md**: `field-sizing: content` for auto-resize textareas
- **DESIGN_PRINCIPLES.md**: Scroll-driven animations section
- **DESIGN_PRINCIPLES.md**: AI-native UI patterns section
- **DESIGN_PRINCIPLES.md**: shadcn/ui + Radix UI patterns section
- **DESIGN_PRINCIPLES.md**: Variable fonts section
- **DESIGN_MEMORY.template.md**: Inline examples for each placeholder
- **DESIGN_MEMORY.template.md**: Motion/animation section
- **DESIGN_MEMORY.template.md**: shadcn/components.json section
- **commands/start.md**: `$ARGUMENTS` parsing guidance
- **commands/cleanup.md**: Backup/restore guidance for Vite App.tsx modifications
- **examples/**: Sample `design-brief.json`, `DESIGN_PLAN.md`, and `DESIGN_MEMORY.md`
- `plugin.json`: `repository`, `homepage`, `configuration`, `peerRequirements` fields

### Removed
- **format-utils**: Dead `parseFeedbackMarkdown` function
- **types.ts**: `formattedOutput` from `FeedbackState` (derived state, computed at use)
- **index.ts**: Dual default+named export — standardized on named export only
- Top-level marketplace structure (now standalone plugin repo)
