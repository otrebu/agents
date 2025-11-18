/**
 * Generate consistent timestamps for research file naming
 */

/**
 * Generate timestamp in YYYYMMDDHHMMSS format
 * Uses local timezone for consistency with user expectations
 */
export function generateTimestamp(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Generate ISO 8601 timestamp for metadata
 */
export function generateISOTimestamp(): string {
  return new Date().toISOString();
}
