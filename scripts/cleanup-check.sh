#!/bin/bash

# Design and Refine Plugin - Cleanup Check Script
# This runs on session end to check for leftover temporary files

warnings=0

# Check if .claude-design directory exists in current project
if [ -d ".claude-design" ]; then
    echo "[Design Lab] Warning: Temporary design files found in .claude-design/"
    echo "[Design Lab] Run '/design-and-refine:cleanup' to remove them, or delete manually."
    warnings=$((warnings + 1))
fi

# Check for leftover route files (Next.js)
if [ -d "app/__design_lab" ] || [ -d "app/__design_preview" ]; then
    echo "[Design Lab] Warning: Temporary route directories found in app/"
    warnings=$((warnings + 1))
fi

if [ -f "pages/__design_lab.tsx" ] || [ -f "pages/__design_preview.tsx" ]; then
    echo "[Design Lab] Warning: Temporary route files found in pages/"
    warnings=$((warnings + 1))
fi

# Check for feedback JSON files (downloaded backups from interactive feedback)
feedback_files=$(find . -maxdepth 2 -name "feedback-*.json" -type f -not -path '*/node_modules/*' 2>/dev/null)
if [ -n "$feedback_files" ]; then
    echo "[Design Lab] Note: Found feedback backup files:"
    echo "$feedback_files" | while read -r file; do
        echo "  - $file"
    done
    echo "[Design Lab] These can be safely deleted after reviewing."
    warnings=$((warnings + 1))
fi

# Check if temp files are git-tracked
if command -v git &> /dev/null && git rev-parse --is-inside-work-tree &> /dev/null 2>&1; then
    tracked_temp=$(git ls-files --cached .claude-design app/__design_lab app/__design_preview pages/__design_lab.tsx pages/__design_preview.tsx 2>/dev/null)
    if [ -n "$tracked_temp" ]; then
        echo "[Design Lab] WARNING: Temporary design files are tracked by git!"
        echo "$tracked_temp" | while read -r file; do
            echo "  - $file"
        done
        echo "[Design Lab] Run 'git rm --cached <file>' to untrack them."
        warnings=$((warnings + 1))
    fi
fi

if [ "$warnings" -gt 0 ]; then
    exit 1
fi

exit 0
