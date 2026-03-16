# Design Lab

A Claude Code plugin that generates 5 distinct UI design variations, collects your feedback via an interactive overlay, and iterates until you land on the perfect design — then produces an implementation plan. Optionally import from Figma to use an existing design as the starting point.

## Installation

```bash
# Install directly from GitHub
claude plugin add seangjr/design-lab

# Or install from a local clone
git clone https://github.com/seangjr/design-lab.git
claude plugin add ./design-lab
```

## Quick Start

Open Claude Code inside any supported project and run:

```
/design-lab:start
```

That's it. The plugin detects your framework, styling system, and existing design tokens automatically.

You can also pass a specific target:

```
/design-lab:start CheckoutSummary
/design-lab:start src/components/Hero.tsx
/design-lab:start /dashboard
```

To reference an existing Figma design:

```
/design-lab:start CheckoutSummary --figma https://www.figma.com/design/abc123/MyFile
```

## How It Works

1. **Preflight** — Detects your framework, package manager, styling system, and Figma MCP availability
2. **Interview** — Asks about requirements, pain points, and design direction. Optionally imports design tokens from a Figma file.
3. **Generate** — Creates 5 variations exploring different design axes (structure, hierarchy, rhythm, interaction, expression) with motion micro-interactions. When Figma is imported, Variant A is a faithful replica.
4. **Review** — Opens a temporary design lab route in your project to preview all variants side-by-side
5. **Feedback** — Collects your thoughts via draggable, floating feedback panels with a Figma-like overlay
6. **Synthesize** — Combines the best elements into a refined version
7. **Iterate** — Repeat feedback and synthesis up to 3 times until you're confident
8. **Finalize** — Cleans up all temp files and outputs a `DESIGN_PLAN.md` you can implement

## Commands

| Command | Description |
|---|---|
| `/design-lab:start [target] [--figma <url>]` | Start a design session. Target can be a component name, file path, or route. Optionally pass a Figma URL. |
| `/design-lab:cleanup` | Remove leftover temporary files from a previous session. |

## Supported Frameworks

- Next.js (App Router & Pages Router)
- Vite (React, Vue)
- Remix
- Astro
- Create React App

## Supported Styling

| Tier | Systems |
|---|---|
| **Primary** | shadcn/ui + Tailwind CSS (optimized path) |
| **Fallback** | CSS Modules, Material UI, Chakra UI, Ant Design, styled-components, Emotion |
| **Animation** | Motion (`motion/react`) preferred, CSS transitions as fallback |
| **Design Import** | Figma (via MCP server) — extracts tokens and component structure |

## Figma Import

Design Lab can import existing Figma designs to use as a starting point. When a Figma file is provided:

- Design tokens (colors, typography, spacing, radii, shadows) are extracted automatically
- **Variant A** becomes a faithful pixel-close implementation of the Figma design
- **Variants B-E** explore alternatives using the Figma design as their baseline
- The final `DESIGN_PLAN.md` includes a Figma Reference section tracking deviations

**Requirements:** A Figma MCP server must be configured in your Claude Code settings with a valid Figma Personal Access Token. The plugin detects this automatically during preflight — if it's not available, you'll be guided through setup or can proceed without it.

## Configuration

Set via environment variables or `.claude-design/config.json`:

| Variable | Default | Description |
|---|---|---|
| `DESIGN_AUTO_IMPLEMENT` | `false` | Immediately implement the plan after finalization |
| `DESIGN_KEEP_LAB` | `false` | Keep temp files until you run `/design-lab:cleanup` |
| `DESIGN_MEMORY_PATH` | `DESIGN_MEMORY.md` | Custom location for the Design Memory file |
| `DESIGN_FIGMA_MODE` | `prompt` | Figma import behavior: `prompt` (ask each session), `always` (auto-import if MCP available), `never` (skip) |

## Output Files

After a session completes, you get two files:

- **`DESIGN_PLAN.md`** — Step-by-step implementation plan for the chosen design (includes Figma Reference section when imported)
- **`DESIGN_MEMORY.md`** — Captured style decisions that future sessions can reuse (Figma tokens merged when imported)

All temporary files (`.claude-design/`, lab routes, preview routes) are automatically cleaned up.

## Examples

See [`examples/`](./examples) for sample outputs:

- [`design-brief.json`](./examples/design-brief.json) — Sample design brief
- [`DESIGN_PLAN.md`](./examples/DESIGN_PLAN.md) — Sample implementation plan
- [`DESIGN_MEMORY.md`](./examples/DESIGN_MEMORY.md) — Sample design memory

## License

MIT
