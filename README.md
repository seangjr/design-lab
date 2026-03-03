# Design Lab

A Claude Code plugin that generates 5 distinct UI design variations, collects your feedback via an interactive overlay, and iterates until you land on the perfect design — then produces an implementation plan.

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
/design-and-refine:start
```

That's it. The plugin detects your framework, styling system, and existing design tokens automatically.

You can also pass a specific target:

```
/design-and-refine:start CheckoutSummary
/design-and-refine:start src/components/Hero.tsx
/design-and-refine:start /dashboard
```

## How It Works

1. **Preflight** — Detects your framework, package manager, and styling system
2. **Interview** — Asks about requirements, pain points, and design direction
3. **Generate** — Creates 5 variations exploring different design axes (structure, hierarchy, rhythm, interaction, expression) with motion micro-interactions
4. **Review** — Opens a temporary design lab route in your project to preview all variants side-by-side
5. **Feedback** — Collects your thoughts via an interactive Figma-like overlay
6. **Synthesize** — Combines the best elements into a refined version
7. **Iterate** — Repeat feedback and synthesis up to 3 times until you're confident
8. **Finalize** — Cleans up all temp files and outputs a `DESIGN_PLAN.md` you can implement

## Commands

| Command | Description |
|---|---|
| `/design-and-refine:start [target]` | Start a design session. Target can be a component name, file path, or route. |
| `/design-and-refine:cleanup` | Remove leftover temporary files from a previous session. |

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

## Configuration

Set via environment variables or `.claude-design/config.json`:

| Variable | Default | Description |
|---|---|---|
| `DESIGN_AUTO_IMPLEMENT` | `false` | Immediately implement the plan after finalization |
| `DESIGN_KEEP_LAB` | `false` | Keep temp files until you run `/design-and-refine:cleanup` |
| `DESIGN_MEMORY_PATH` | `DESIGN_MEMORY.md` | Custom location for the Design Memory file |

## Output Files

After a session completes, you get two files:

- **`DESIGN_PLAN.md`** — Step-by-step implementation plan for the chosen design
- **`DESIGN_MEMORY.md`** — Captured style decisions that future sessions can reuse

All temporary files (`.claude-design/`, lab routes, preview routes) are automatically cleaned up.

## Examples

See [`examples/`](./examples) for sample outputs:

- [`design-brief.json`](./examples/design-brief.json) — Sample design brief
- [`DESIGN_PLAN.md`](./examples/DESIGN_PLAN.md) — Sample implementation plan
- [`DESIGN_MEMORY.md`](./examples/DESIGN_MEMORY.md) — Sample design memory

## License

MIT
