import type { SearchResult, SearchMetadata } from './types.js'

/**
 * Format search results as clean markdown for Claude to read
 * @param results Array of search results
 * @param metadata Search execution metadata
 * @returns Formatted markdown string
 */
export function formatResults(
  results: SearchResult[],
  metadata: SearchMetadata
): string {
  const sections: string[] = []

  // Header with metadata
  sections.push(`# Parallel Search Results\n`)
  sections.push(`**Query:** ${metadata.objective}`)
  sections.push(`**Results:** ${metadata.resultCount}`)
  sections.push(
    `**Execution:** ${(metadata.executionTimeMs / 1000).toFixed(1)}s\n`
  )

  // Domain distribution summary
  if (results.length > 0) {
    const domainCounts = getDomainCounts(results)
    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    sections.push(`**Top Domains:**`)
    for (const [domain, count] of topDomains) {
      const percentage = ((count / results.length) * 100).toFixed(0)
      sections.push(`- ${domain}: ${count} results (${percentage}%)`)
    }
    sections.push('')
  }

  sections.push('---\n')

  // Individual results
  for (const result of results) {
    sections.push(`## ${result.rank}. [${result.title}](${result.url})\n`)
    sections.push(`**URL:** ${result.url}`)
    sections.push(`**Domain:** ${result.domain}\n`)
    sections.push(`**Excerpt:**\n`)
    sections.push(result.excerpt)
    sections.push('\n---\n')
  }

  return sections.join('\n')
}

/**
 * Count results per domain
 * @param results Array of search results
 * @returns Map of domain to count
 */
function getDomainCounts(results: SearchResult[]): Map<string, number> {
  const counts = new Map<string, number>()

  for (const result of results) {
    const count = counts.get(result.domain) || 0
    counts.set(result.domain, count + 1)
  }

  return counts
}

/**
 * Sanitize a query string for use in filenames
 * @param query Original query string
 * @returns Kebab-cased slug (max 50 chars)
 */
export function sanitizeForFilename(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .substring(0, 50) // Max 50 chars
}
