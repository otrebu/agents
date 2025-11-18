import type { SearchResult, SearchMetadata } from './types.js'
import { extractDomain } from '@knowledge-work/shared'
import type { SourceReference } from '@knowledge-work/shared'

/**
 * Format search results as standardized markdown
 * Follows unified template structure for cross-skill consistency
 *
 * @param results Array of search results
 * @param metadata Search execution metadata
 * @param query Original user query
 * @param timestamp Timestamp string (YYYYMMDDHHMMSS)
 * @returns Formatted markdown string
 */
export function formatResults(
  results: SearchResult[],
  metadata: SearchMetadata,
  query: string,
  timestamp: string
): string {
  const durationSec = Math.round(metadata.executionTimeMs / 1000)

  const header = [
    `# Research: ${query}\n`,
    `**Metadata:** parallel-search • ${timestamp} • ${durationSec}s • ${results.length} sources\n`,
  ]

  const summary = [
    '## Summary\n',
    `Found ${results.length} results across ${getUniqueDomainCount(results)} domains via Parallel Search API. Results include extended excerpts for deep content analysis.\n`,
  ]

  const findings = [
    '## Findings\n',
    ...formatFindings(results),
  ]

  const sources = [
    '\n## Sources\n',
    formatSourceReferences(results),
  ]

  return [...header, ...summary, ...findings, ...sources].join('\n')
}

/**
 * Format findings section with ranked results
 */
function formatFindings(results: SearchResult[]): string[] {
  const domainSummary = formatDomainSummary(results)

  const resultSections = results.flatMap((result) => [
    `### ${result.rank}. [${result.title}](${result.url})\n`,
    `**Domain:** ${result.domain}`,
    `**URL:** ${result.url}\n`,
    `**Excerpt:**\n`,
    result.excerpts.join('\n\n'),
    '\n---\n',
  ])

  return [...domainSummary, '\n', ...resultSections]
}

/**
 * Format domain distribution summary
 */
function formatDomainSummary(results: SearchResult[]): string[] {
  const domainCounts = getDomainCounts(results)
  const topDomains = Array.from(domainCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const domainLines = topDomains.map(([domain, count]) => {
    const percentage = ((count / results.length) * 100).toFixed(0)
    return `- ${domain}: ${count} results (${percentage}%)`
  })

  return ['**Top Domains:**', ...domainLines]
}

/**
 * Count results per domain
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
 * Get unique domain count
 */
function getUniqueDomainCount(results: SearchResult[]): number {
  return new Set(results.map(r => r.domain)).size
}

/**
 * Format sources section following unified template
 */
function formatSourceReferences(results: SearchResult[]): string {
  const lines: string[] = ['### Web\n']

  results.forEach(result => {
    lines.push(`- [${result.title}](${result.url}) • ${result.domain}`)
  })

  return lines.join('\n')
}
