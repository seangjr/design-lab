# CLAUDE.md — design-lab

## What This Is

A **Claude Code plugin** (not a traditional Node/TS project) that provides an iterative UI design exploration workflow. There is no package.json, no build system, no test framework, and no dependencies to install. It runs entirely as a Claude Code skill/command set.

The plugin generates 5 distinct UI variations in a temporary "Design Lab" route inside the user's project, collects interactive feedback via a Figma-like overlay, synthesizes refinements, and produces a `DESIGN_PLAN.md` implementation plan.

## Development Commands

```bash
# Install as plugin
claude plugin add /path/to/design-lab

# Run in dev mode (loads plugin from local dir)
claude --plugin-dir ./design-lab

# Slash commands (invoked inside Claude Code sessions)
/design-lab:start [target]   # Start a design session
/design-lab:cleanup          # Remove leftover temp files
```

The cleanup script (`scripts/cleanup-check.sh`) runs automatically on session end via `hooks/hooks.json` to warn about leftover temp files.

## Architecture

### Plugin Structure

```
.claude-plugin/plugin.json   # Plugin metadata and config schema
commands/                    # Slash command definitions (start.md, cleanup.md)
skills/design-lab/           # Core workflow and design reference
  SKILL.md                   # The 9-phase workflow (this IS the plugin logic)
  DESIGN_PRINCIPLES.md       # UX/interaction/motion/a11y best practices
templates/                   # Reusable file templates
  feedback/                  # FeedbackOverlay + modular reference files
  DESIGN_PLAN.template.md    # Implementation plan template
  DESIGN_MEMORY.template.md  # Design memory template
hooks/hooks.json             # SessionEnd/Stop cleanup hooks
scripts/cleanup-check.sh     # Detects leftover temp files
examples/                    # Sample outputs (design-brief.json, DESIGN_PLAN.md, DESIGN_MEMORY.md)
```

### The 9-Phase Workflow

Defined in `skills/design-lab/SKILL.md`:

0. **Preflight** — Detect framework, package manager, styling system, existing Design Memory
1. **Interview** — Collect requirements via AskUserQuestion (quick/detailed/skip modes)
2. **Design Brief** — Generate structured JSON brief at `.claude-design/design-brief.json`
3. **Generate Lab** — Create 5 variants (A-E) exploring different design axes (structure, hierarchy, rhythm, interaction, expression), each with axis-appropriate motion micro-interactions using the `motion` library
4. **Present** — Output lab URL; never start the dev server (it blocks forever)
5. **Feedback** — Collect via interactive overlay (primary) or manual AskUserQuestion (fallback)
6. **Synthesize** — Create Variant F combining best elements; cap at 3 iterations
7. **Final Preview** — Show winning design at `/design-preview`; before/after for redesigns
8. **Finalize** — Delete all temp files, generate `DESIGN_PLAN.md` and `DESIGN_MEMORY.md`

Abort at any phase triggers immediate cleanup with no plan generated.

## FeedbackOverlay: Dual-Source Pattern

The feedback system has two representations that **must stay in sync**:

1. **`templates/feedback/FeedbackOverlay.tsx`** — Self-contained canonical file. All types, utilities, and styles are inlined. Copy this single file to any React project and it works. This is what gets copied into the user's route directory during a session.

2. **`templates/feedback/{types,selector-utils,format-utils,index}.ts`** — Modular reference files that mirror the inlined code for development and testing.

**When editing the overlay, update BOTH the self-contained file and the modular files.**

## Temporary vs Permanent Files

### Created During Sessions (auto-cleaned on finalize or abort)
- `.claude-design/` — Variants, preview, design brief, run log
- `app/design-lab/` or `pages/design-lab.tsx` — Lab route in user's project
- `app/design-preview/` or `pages/design-preview.tsx` — Preview route
- `FeedbackOverlay.tsx` copied into the route directory (not from `.claude-design/`)

### Permanent Outputs (kept after finalization)
- `DESIGN_PLAN.md` — Implementation plan for the chosen design
- `DESIGN_MEMORY.md` — Reusable style decisions for future sessions (location configurable)

## Configuration

Set via environment variables or `.claude-design/config.json`:

| Variable | Default | Effect |
|---|---|---|
| `DESIGN_AUTO_IMPLEMENT` | `false` | Immediately implement the plan after finalization |
| `DESIGN_KEEP_LAB` | `false` | Skip auto-cleanup; require manual `/design-lab:cleanup` |
| `DESIGN_MEMORY_PATH` | `DESIGN_MEMORY.md` | Custom location for Design Memory file |

## Supported Targets

**Frameworks:** Next.js (App Router & Pages Router), Vite (React, Vue), Remix, Astro, Create React App

**Styling (primary):** shadcn/ui + Tailwind CSS — the expected default; every variant axis includes motion micro-interactions using the `motion` library

**Styling (fallback):** CSS Modules, Material UI, Chakra UI, Ant Design, styled-components, Emotion

**Animation:** Motion library (`import from "motion/react"`) preferred; CSS transitions as fallback. Motion micro-interactions are woven into every variant axis (structure, hierarchy, rhythm, interaction, expression).
