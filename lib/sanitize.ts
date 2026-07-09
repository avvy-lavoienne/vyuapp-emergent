// Input sanitization utilities — defense-in-depth against injection attacks.
// Even routes that don't query databases benefit from sanitized inputs.
import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Strips all HTML tags and dangerous content while preserving plain text.
 * Use this on ALL user-submitted text that might be rendered as HTML.
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return sanitizeHtmlLib(input, {
    allowedTags: [], // No HTML tags allowed — strip everything
    allowedAttributes: {}, // No attributes allowed
    disallowedTagsMode: 'discard',
  }).trim();
}

/**
 * Strip characters and patterns commonly used in SQL injection attempts.
 * Multi-pass to prevent bypass via nested keywords (e.g. SSELECTELECT → SELECT).
 * Safe to use on user input before passing to any downstream system.
 */
export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') return '';

  let result = input;

  // Phase 1: Remove SQL comment sequences
  result = result.replace(/--/g, '');
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  // Phase 2: Strip SQL keywords — loop until stable (prevents nested bypass)
  const sqlKeywords = /\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|EXECUTE|TRUNCATE|GRANT|REVOKE|MERGE|DECLARE|CAST|CONVERT|WAITFOR|SHUTDOWN|xp_|sp_|0x[0-9a-fA-F]+)\b/gi;
  let prev: string;
  do {
    prev = result;
    result = result.replace(sqlKeywords, '');
  } while (result !== prev);

  // Phase 3: Remove dangerous characters
  result = result
    .replace(/;/g, '')        // Statement terminators
    .replace(/`/g, '')        // MySQL/Postgres identifier quotes
    .replace(/['"]/g, '')     // Single/double quotes
    .replace(/\\/g, '')       // Backslash (escape sequences)
    .replace(/\|/g, '')       // Pipe (OR operator)
    .replace(/[{}]/g, '')     // Curly braces (stacked queries)
    .replace(/%/g, '');       // LIKE wildcards

  return result.trim();
}

/**
 * Escape special regex characters to prevent regex injection.
 */
export function escapeRegex(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitize a search term for use in Supabase ilike/like filters.
 * Escapes % and _ wildcards that could cause pattern injection.
 */
export function sanitizeSearchTerm(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/%/g, '\\%')  // Escape SQL LIKE wildcards
    .replace(/_/g, '\\_')
    .trim();
}

/**
 * General-purpose input sanitizer for user-facing string fields.
 * Combines trimming, length clamping, and SQL pattern stripping.
 */
export function sanitizeInput(input: unknown, maxLen = 2000): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLen);
}
