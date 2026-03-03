# Design and Refine

Generate UI design variations, collect feedback, synthesize the best elements, and iterate to confident design decisions.

## Installation

### As a Claude Code Plugin
```bash
claude plugin add /path/to/design-and-refine
```

### Development
```bash
git clone https://github.com/khaeli/design-and-refine.git
claude --plugin-dir ./design-and-refine
```

## Commands

### `/design-and-refine:start [target]`

Start a design and refine session.

**Arguments:**
- `target` (optional): Component or page to design/redesign

**Example:**
```
/design-and-refine:start CheckoutSummary
/design-and-refine:start
```

### `/design-and-refine:cleanup`

Remove all temporary design lab files.

## How It Works

1. **Preflight**: Detects framework, package manager, styling system
2. **Style Inference**: Reads your existing design tokens and patterns
3. **Interview**: Asks about requirements, pain points, and direction
4. **Generate**: Creates 5 distinct variations using your project's visual language
5. **Review**: Preview variants side-by-side at `/__design_lab`
6. **Feedback**: Tell me what you like about each variant
7. **Synthesize**: Creates a refined version combining the best elements
8. **Iterate**: Repeat until you're confident
9. **Finalize**: Cleans up temp files, produces `DESIGN_PLAN.md`

## Architecture Note

`FeedbackOverlay.tsx` is the **canonical self-contained source**. It contains all types, utilities, and styles inline for maximum portability — copy this single file to any React project and it works.

The modular files (`types.ts`, `selector-utils.ts`, `format-utils.ts`, `index.ts`) are **reference implementations** that mirror the inlined code for development and testing. Changes should be made to BOTH the self-contained file and the modular files.

To check for divergence, run:
```bash
# TODO: sync-check.sh compares inlined functions against modular files
./scripts/sync-check.sh
```

## Examples

See the [`examples/`](./examples) directory for sample files:
- [`design-brief.json`](./examples/design-brief.json) — Sample design brief input
- [`DESIGN_PLAN.md`](./examples/DESIGN_PLAN.md) — Filled-in implementation plan
- [`DESIGN_MEMORY.md`](./examples/DESIGN_MEMORY.md) — Filled-in design memory

## Supported Frameworks

- Next.js (App Router & Pages Router)
- Vite (React, Vue)
- Remix
- Astro
- Create React App

## Supported Styling

### Primary
- **shadcn/ui + Tailwind CSS** — expected default, optimized path

### Fallback
- CSS Modules
- Material UI
- Chakra UI
- Ant Design
- styled-components
- Emotion

### Animation Library
- **Motion** (`import from "motion/react"`) — micro-interactions woven into every variant axis
- CSS transitions as fallback when Motion is not installed

## Files Created

### Temporary (cleaned up on completion or abort)
- `.claude-design/` - All temporary variants and previews
- `app/__design_lab/` or `pages/__design_lab.tsx` - Lab route
- `app/__design_preview/` or `pages/__design_preview.tsx` - Preview route

### Permanent (kept after finalization)
- `DESIGN_PLAN.md` - Implementation plan for the chosen design
- `DESIGN_MEMORY.md` - Reusable style decisions for future runs

## License

MIT
