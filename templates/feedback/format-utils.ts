/**
 * Design Lab Interactive Feedback System - Format Utilities
 *
 * Converts feedback comments into formatted output for:
 * - Markdown (clipboard) - Human-readable, paste-friendly for Claude
 * - JSON (download) - Machine-parseable backup
 */

import type { Comment, FeedbackPayload, VariantId } from './types';

/**
 * Group comments by variant ID for organized display.
 */
function groupByVariant(comments: Comment[]): Map<VariantId, Comment[]> {
  const groups = new Map<VariantId, Comment[]>();

  for (const comment of comments) {
    const existing = groups.get(comment.variant) || [];
    existing.push(comment);
    groups.set(comment.variant, existing);
  }

  // Sort variants alphabetically
  return new Map(
    [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  );
}

/**
 * Format a single comment for markdown output.
 * Includes selector, text content hint, and the user's feedback.
 */
function formatComment(comment: Comment, index: number): string {
  const { element, text } = comment;

  // Build the element identifier string
  const selectorPart = `\`${element.selector}\``;
  const textHint = element.textContent
    ? `, ${element.tagName} with "${element.textContent}"`
    : '';

  return `${index}. **${element.readablePath.split(' > ').slice(-2).join(' > ')}** (${selectorPart}${textHint})
   "${text}"`;
}

/**
 * Format all feedback as Markdown for clipboard.
 *
 * Output format:
 * ```
 * ## Design Lab Feedback
 *
 * **Target:** ComponentName
 * **Comments:** 3
 *
 * ### Variant A
 * 1. **Button** (`[data-testid='submit']`, button with "Submit")
 *    "Make this more prominent"
 *
 * ### Overall Direction
 * User's synthesis guidance here...
 *
 * ---
 * *Feedback from Design Lab interactive overlay*
 * ```
 */
export function formatAsMarkdown(
  comments: Comment[],
  target: string,
  overall: string
): string {
  const lines: string[] = [];

  // Header
  lines.push('## Design Lab Feedback');
  lines.push('');
  lines.push(`**Target:** ${target}`);
  lines.push(`**Comments:** ${comments.length}`);
  lines.push('');

  // Group and format comments by variant
  const grouped = groupByVariant(comments);

  for (const [variantId, variantComments] of grouped) {
    lines.push(`### Variant ${variantId}`);

    variantComments.forEach((comment, index) => {
      lines.push(formatComment(comment, index + 1));
      lines.push('');
    });
  }

  // Overall direction
  if (overall.trim()) {
    lines.push('### Overall Direction');
    lines.push(overall.trim());
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('*Feedback from Design Lab interactive overlay*');

  return lines.join('\n');
}

/**
 * Format all feedback as a structured JSON payload.
 * Used for file download backup.
 */
export function formatAsJSON(
  comments: Comment[],
  target: string,
  overall: string
): FeedbackPayload {
  return {
    version: '1.0',
    target,
    timestamp: new Date().toISOString(),
    comments,
    overall,
  };
}

/**
 * Copy text to clipboard using the Clipboard API.
 * Falls back to creating a textarea for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
    }
  }

  // Fallback: create a temporary textarea
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    return success;
  } catch (err) {
    console.error('Fallback clipboard method failed:', err);
    return false;
  }
}

/**
 * Trigger a JSON file download.
 */
export function downloadJSON(payload: FeedbackPayload, filename: string): void {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Generate a unique ID for a comment.
 */
export function generateId(): string {
  return `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Validate that required fields are present before submission.
 */
export function validateFeedback(
  comments: Comment[],
  overall: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (comments.length === 0 && !overall.trim()) {
    errors.push('Please add at least one comment or provide an overall direction.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
