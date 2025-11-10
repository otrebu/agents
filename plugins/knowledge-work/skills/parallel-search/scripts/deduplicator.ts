import type { SearchResult } from './types.js'

/**
 * Deduplicated search result with additional metadata
 */
export interface DeduplicatedResult extends SearchResult {
  foundInSearches: string[] // Track which queries found this result
  sourceCount: number // Number of times found (relevance indicator)
}

/**
 * Source diversity analysis result
 */
export interface DiversityAnalysis {
  domainCounts: Map<string, number>
  isDiverse: boolean
  topDomain: string
  topDomainPercentage: number
}

/**
 * Deduplicate results from multiple searches by URL
 * @param resultsMap Map of search ID to results and query
 * @returns Deduplicated results sorted by relevance
 */
export function deduplicateResults(
  resultsMap: Map<string, { results: SearchResult[]; query: string }>
): DeduplicatedResult[] {
  const urlMap = new Map<string, DeduplicatedResult>()

  // Aggregate by URL
  for (const [, { results, query }] of resultsMap) {
    for (const result of results) {
      if (urlMap.has(result.url)) {
        // URL already seen - update metadata
        const existing = urlMap.get(result.url)!
        existing.foundInSearches.push(query)
        existing.sourceCount++
        // Keep the higher rank (lower number = better)
        if (result.rank < existing.rank) {
          existing.rank = result.rank
        }
      } else {
        // New URL - add to map
        urlMap.set(result.url, {
          ...result,
          foundInSearches: [query],
          sourceCount: 1,
        })
      }
    }
  }

  // Sort by source count (found in multiple searches = more relevant)
  // Then by rank as tiebreaker
  return Array.from(urlMap.values()).sort((a, b) => {
    if (b.sourceCount !== a.sourceCount) {
      return b.sourceCount - a.sourceCount
    }
    return a.rank - b.rank
  })
}

/**
 * Check source diversity across results
 * @param results Deduplicated search results
 * @returns Diversity analysis
 */
export function checkSourceDiversity(
  results: DeduplicatedResult[]
): DiversityAnalysis {
  if (results.length === 0) {
    return {
      domainCounts: new Map(),
      isDiverse: true,
      topDomain: '',
      topDomainPercentage: 0,
    }
  }

  const domainCounts = new Map<string, number>()

  // Count results per domain
  for (const result of results) {
    const count = domainCounts.get(result.domain) || 0
    domainCounts.set(result.domain, count + 1)
  }

  // Find most common domain
  const sortedDomains = Array.from(domainCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  )
  const topDomain = sortedDomains[0]

  const topDomainPercentage = (topDomain[1] / results.length) * 100

  return {
    domainCounts,
    isDiverse: topDomainPercentage < 40, // No single domain > 40%
    topDomain: topDomain[0],
    topDomainPercentage,
  }
}

/**
 * Format diversity analysis as human-readable text
 * @param analysis Diversity analysis result
 * @returns Formatted string
 */
export function formatDiversityAnalysis(analysis: DiversityAnalysis): string {
  if (analysis.topDomain === '') {
    return 'No results to analyze'
  }

  const lines: string[] = []

  lines.push(`**Source Diversity:** ${analysis.isDiverse ? '✓ Diverse' : '⚠ Limited'}`)
  lines.push(
    `**Top Domain:** ${analysis.topDomain} (${analysis.topDomainPercentage.toFixed(0)}%)`
  )

  if (!analysis.isDiverse) {
    lines.push(
      `\n⚠ Warning: Over 40% of results from single domain. Consider broadening search.`
    )
  }

  return lines.join('\n')
}
