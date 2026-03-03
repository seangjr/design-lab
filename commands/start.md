---
description: Start a design and refine session - generate variations, collect feedback, and iterate to the perfect design
---

# Start Design & Refine

Begin an interactive design session that generates UI variations, collects your feedback, and iterates until you're confident in the result.

## Usage

```
/design-and-refine:start [target]
```

**Arguments:**
- `target` (optional): The component or page to design/redesign. If not provided, you'll be asked.

## What This Does

1. **Interviews you** about requirements, pain points, and style direction
2. **Infers visual styles** from your existing codebase
3. **Generates five distinct variations** in a temporary Design Lab route
4. **Collects your feedback** on what you like about each
5. **Synthesizes a refined version** combining the best elements
6. **Iterates until you're confident** in the final design
7. **Cleans up** all temporary files and produces an implementation plan

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
- **Empty**: prompt user for target in Step 1.1

Examples:
- `/design-and-refine:start CheckoutSummary` → targetName = "CheckoutSummary"
- `/design-and-refine:start src/components/Checkout.tsx` → targetPath = "src/components/Checkout.tsx", targetName = "Checkout"
- `/design-and-refine:start /checkout` → find route handler, targetName = "Checkout"
