---
description: Start a design and refine session - generate variations, collect feedback, and iterate to the perfect design
---

# Start Design & Refine

Begin an interactive design session that generates UI variations, collects your feedback, and iterates until you're confident in the result.

## Usage

```
/design-lab:start [target] [--figma <url>]
```

**Arguments:**
- `target` (optional): The component or page to design/redesign. If not provided, you'll be asked.
- `--figma <url>` (optional): A Figma file URL or key to import as a design reference. Requires Figma MCP server to be configured. When provided, Variant A will be a faithful implementation of the Figma design.

## What This Does

1. **Detects Figma MCP** and optionally imports design tokens from a Figma file
2. **Interviews you** about requirements, pain points, and style direction
3. **Infers visual styles** from your existing codebase (and Figma tokens if imported)
4. **Generates five distinct variations** in a temporary Design Lab route
5. **Collects your feedback** on what you like about each
6. **Synthesizes a refined version** combining the best elements
7. **Iterates until you're confident** in the final design
8. **Cleans up** all temporary files and produces an implementation plan

## Instructions

When this command is invoked, follow the Design Lab skill workflow exactly. The skill contains:
- The complete interview script
- Framework and styling detection logic
- Visual style inference from the project
- Variant generation guidelines
- Feedback collection and synthesis process
- Cleanup procedures

Begin by running the preflight detection, then start the interview process. Use the AskUserQuestion tool for all interview steps.

## Argument Parsing

`$ARGUMENTS` may contain:
- **A component/page name**: e.g., `CheckoutSummary`, `UserProfile` → use as target name
- **A file path**: e.g., `src/components/Checkout.tsx` → use as target path and derive name
- **A route path**: e.g., `/checkout`, `/dashboard/settings` → find the corresponding file
- **`--figma <url>`**: A Figma file URL or key → auto-select "Yes" for Figma import in Step 0.5, use provided URL in Step 1.0
- **Empty**: prompt user for target in Step 1.1

Examples:
- `/design-lab:start CheckoutSummary` → targetName = "CheckoutSummary"
- `/design-lab:start src/components/Checkout.tsx` → targetPath = "src/components/Checkout.tsx", targetName = "Checkout"
- `/design-lab:start /checkout` → find route handler, targetName = "Checkout"
- `/design-lab:start CheckoutSummary --figma https://www.figma.com/design/abc123/MyFile` → targetName = "CheckoutSummary", auto-import Figma design
