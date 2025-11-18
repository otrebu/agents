/**
 * Sanitize strings for use in filenames
 *
 * Enforces consistent filename rules across all research skills:
 * - Lowercase
 * - Spaces → hyphens
 * - Remove special characters (keep alphanumeric, spaces, hyphens)
 * - Max 50 characters
 * - No leading/trailing hyphens
 */

const MAX_FILENAME_LENGTH = 50;

export function sanitizeForFilename(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .substring(0, MAX_FILENAME_LENGTH) // Limit length
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract domain from URL for organization
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    // If URL parsing fails, return a safe default
    return 'unknown';
  }
}
