---
description: Remove all temporary design lab files created during a design-and-refine session
---

# Cleanup Command

Manually clean up all temporary files created during a design-and-refine session.

## Usage

```
/design-and-refine:cleanup
```

## What This Does

Removes all temporary files and directories created during design exploration:

1. **`.claude-design/`** - The main temporary directory containing:
   - Design lab variants
   - Preview files
   - Design brief JSON
   - Run logs

2. **Temporary routes:**
   - `app/design-lab/` (Next.js App Router)
   - `app/design-preview/` (Next.js App Router)
   - `pages/design-lab.tsx` (Next.js Pages Router)
   - `pages/design-preview.tsx` (Next.js Pages Router)

3. **Any App.tsx modifications** (for Vite projects without routers)

## Instructions

When this command is invoked:

1. Check if `.claude-design/` directory exists
2. If it exists, list the contents and ask for confirmation before deleting
3. Check for temporary route files in common locations
4. Delete confirmed files
5. Report what was deleted

**Safety rules:**
- ONLY delete files inside `.claude-design/`
- ONLY delete route files that match the plugin's naming pattern (`design-lab`, `design-preview`)
- Always confirm with the user before deleting
- Never delete user-authored files

## Vite App.tsx Recovery

For Vite projects without a router, the design lab adds a conditional render to `App.tsx`. During cleanup:

1. Check if `App.tsx` was modified by looking for `design-lab` or `design_lab=true` references
2. If found, check for `.claude-design/app-tsx-backup` — if it exists, restore from backup
3. If no backup exists, remove only the design lab conditional block:
   - Remove the import of the design lab component
   - Remove the `if (searchParams.get('design_lab'))` conditional
   - Keep all original App.tsx content intact
4. Verify the file still compiles after modification
