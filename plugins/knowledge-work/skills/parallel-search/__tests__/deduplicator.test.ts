import { describe, it, expect } from 'vitest'
import {
  deduplicateResults,
  checkSourceDiversity,
  formatDiversityAnalysis,
} from '../scripts/deduplicator.js'
import type { SearchResult } from '../scripts/types.js'

describe('deduplicateResults', () => {
  it('returns empty array for empty input', () => {
    const resultsMap = new Map()
    const deduplicated = deduplicateResults(resultsMap)
    expect(deduplicated).toEqual([])
  })

  it('preserves unique results', () => {
    const results: SearchResult[] = [
      {
        url: 'https://example.com/1',
        title: 'Article 1',
        excerpt: 'Excerpt 1',
        domain: 'example.com',
        rank: 1,
      },
      {
        url: 'https://example.com/2',
        title: 'Article 2',
        excerpt: 'Excerpt 2',
        domain: 'example.com',
        rank: 2,
      },
    ]
    const resultsMap = new Map([
      ['search1', { results, query: 'test query' }],
    ])
    const deduplicated = deduplicateResults(resultsMap)

    expect(deduplicated).toHaveLength(2)
    expect(deduplicated[0].sourceCount).toBe(1)
    expect(deduplicated[1].sourceCount).toBe(1)
  })

  it('deduplicates by URL across multiple searches', () => {
    const results1: SearchResult[] = [
      {
        url: 'https://example.com/duplicate',
        title: 'Same Article',
        excerpt: 'Excerpt from search 1',
        domain: 'example.com',
        rank: 1,
      },
      {
        url: 'https://example.com/unique1',
        title: 'Unique 1',
        excerpt: 'Unique excerpt 1',
        domain: 'example.com',
        rank: 2,
      },
    ]
    const results2: SearchResult[] = [
      {
        url: 'https://example.com/duplicate',
        title: 'Same Article',
        excerpt: 'Excerpt from search 2',
        domain: 'example.com',
        rank: 1,
      },
      {
        url: 'https://example.com/unique2',
        title: 'Unique 2',
        excerpt: 'Unique excerpt 2',
        domain: 'example.com',
        rank: 2,
      },
    ]
    const resultsMap = new Map([
      ['search1', { results: results1, query: 'query 1' }],
      ['search2', { results: results2, query: 'query 2' }],
    ])
    const deduplicated = deduplicateResults(resultsMap)

    expect(deduplicated).toHaveLength(3)
    const duplicate = deduplicated.find(
      (r) => r.url === 'https://example.com/duplicate'
    )
    expect(duplicate?.sourceCount).toBe(2)
    expect(duplicate?.foundInSearches).toEqual(['query 1', 'query 2'])
  })

  it('sorts by source count descending', () => {
    const results1: SearchResult[] = [
      {
        url: 'https://example.com/common',
        title: 'Common',
        excerpt: 'Found in all',
        domain: 'example.com',
        rank: 1,
      },
      {
        url: 'https://example.com/rare',
        title: 'Rare',
        excerpt: 'Found once',
        domain: 'example.com',
        rank: 2,
      },
    ]
    const results2: SearchResult[] = [
      {
        url: 'https://example.com/common',
        title: 'Common',
        excerpt: 'Found in all',
        domain: 'example.com',
        rank: 1,
      },
    ]
    const results3: SearchResult[] = [
      {
        url: 'https://example.com/common',
        title: 'Common',
        excerpt: 'Found in all',
        domain: 'example.com',
        rank: 1,
      },
    ]
    const resultsMap = new Map([
      ['search1', { results: results1, query: 'query 1' }],
      ['search2', { results: results2, query: 'query 2' }],
      ['search3', { results: results3, query: 'query 3' }],
    ])
    const deduplicated = deduplicateResults(resultsMap)

    expect(deduplicated[0].url).toBe('https://example.com/common')
    expect(deduplicated[0].sourceCount).toBe(3)
    expect(deduplicated[1].url).toBe('https://example.com/rare')
    expect(deduplicated[1].sourceCount).toBe(1)
  })

  it('uses best rank when duplicate found', () => {
    const results1: SearchResult[] = [
      {
        url: 'https://example.com/article',
        title: 'Article',
        excerpt: 'Excerpt',
        domain: 'example.com',
        rank: 5,
      },
    ]
    const results2: SearchResult[] = [
      {
        url: 'https://example.com/article',
        title: 'Article',
        excerpt: 'Excerpt',
        domain: 'example.com',
        rank: 2,
      },
    ]
    const resultsMap = new Map([
      ['search1', { results: results1, query: 'query 1' }],
      ['search2', { results: results2, query: 'query 2' }],
    ])
    const deduplicated = deduplicateResults(resultsMap)

    expect(deduplicated[0].rank).toBe(2)
  })
})

describe('checkSourceDiversity', () => {
  it('handles empty results', () => {
    const diversity = checkSourceDiversity([])

    expect(diversity.isDiverse).toBe(true)
    expect(diversity.topDomain).toBe('')
    expect(diversity.topDomainPercentage).toBe(0)
  })

  it('identifies diverse sources', () => {
    const results = [
      {
        url: 'https://a.com/1',
        title: 'A',
        excerpt: 'A',
        domain: 'a.com',
        rank: 1,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://b.com/1',
        title: 'B',
        excerpt: 'B',
        domain: 'b.com',
        rank: 2,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://c.com/1',
        title: 'C',
        excerpt: 'C',
        domain: 'c.com',
        rank: 3,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://d.com/1',
        title: 'D',
        excerpt: 'D',
        domain: 'd.com',
        rank: 4,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
    ]
    const diversity = checkSourceDiversity(results)

    expect(diversity.isDiverse).toBe(true)
    expect(diversity.topDomainPercentage).toBe(25)
  })

  it('identifies limited diversity', () => {
    const results = [
      {
        url: 'https://example.com/1',
        title: 'A',
        excerpt: 'A',
        domain: 'example.com',
        rank: 1,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://example.com/2',
        title: 'B',
        excerpt: 'B',
        domain: 'example.com',
        rank: 2,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://example.com/3',
        title: 'C',
        excerpt: 'C',
        domain: 'example.com',
        rank: 3,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://other.com/1',
        title: 'D',
        excerpt: 'D',
        domain: 'other.com',
        rank: 4,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
    ]
    const diversity = checkSourceDiversity(results)

    expect(diversity.isDiverse).toBe(false)
    expect(diversity.topDomain).toBe('example.com')
    expect(diversity.topDomainPercentage).toBe(75)
  })

  it('counts domains correctly', () => {
    const results = [
      {
        url: 'https://a.com/1',
        title: 'A1',
        excerpt: 'A1',
        domain: 'a.com',
        rank: 1,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://a.com/2',
        title: 'A2',
        excerpt: 'A2',
        domain: 'a.com',
        rank: 2,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
      {
        url: 'https://b.com/1',
        title: 'B',
        excerpt: 'B',
        domain: 'b.com',
        rank: 3,
        foundInSearches: ['q1'],
        sourceCount: 1,
      },
    ]
    const diversity = checkSourceDiversity(results)

    expect(diversity.domainCounts.get('a.com')).toBe(2)
    expect(diversity.domainCounts.get('b.com')).toBe(1)
  })
})

describe('formatDiversityAnalysis', () => {
  it('formats empty analysis', () => {
    const analysis = {
      domainCounts: new Map(),
      isDiverse: true,
      topDomain: '',
      topDomainPercentage: 0,
    }
    const formatted = formatDiversityAnalysis(analysis)

    expect(formatted).toContain('No results to analyze')
  })

  it('formats diverse analysis', () => {
    const analysis = {
      domainCounts: new Map([
        ['a.com', 2],
        ['b.com', 2],
      ]),
      isDiverse: true,
      topDomain: 'a.com',
      topDomainPercentage: 30,
    }
    const formatted = formatDiversityAnalysis(analysis)

    expect(formatted).toContain('✓ Diverse')
    expect(formatted).toContain('a.com (30%)')
    expect(formatted).not.toContain('Warning')
  })

  it('formats limited diversity with warning', () => {
    const analysis = {
      domainCounts: new Map([['example.com', 8]]),
      isDiverse: false,
      topDomain: 'example.com',
      topDomainPercentage: 80,
    }
    const formatted = formatDiversityAnalysis(analysis)

    expect(formatted).toContain('⚠ Limited')
    expect(formatted).toContain('example.com (80%)')
    expect(formatted).toContain('Warning: Over 40%')
  })
})
