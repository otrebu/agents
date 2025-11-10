import { describe, it, expect } from 'vitest'
import { formatResults, sanitizeForFilename } from '../scripts/formatter.js'
import type { SearchResult, SearchMetadata } from '../scripts/types.js'

describe('formatResults', () => {
  it('formats empty results', () => {
    const metadata: SearchMetadata = {
      objective: 'test query',
      executionTimeMs: 100,
      resultCount: 0,
    }
    const output = formatResults([], metadata)

    expect(output).toContain('# Parallel Search Results')
    expect(output).toContain('**Query:** test query')
    expect(output).toContain('**Results:** 0')
    expect(output).toContain('**Execution:** 0.1s')
  })

  it('formats single result with all fields', () => {
    const results: SearchResult[] = [
      {
        url: 'https://example.com/article',
        title: 'Example Article',
        excerpt: 'This is a test excerpt with important information.',
        domain: 'example.com',
        rank: 1,
      },
    ]
    const metadata: SearchMetadata = {
      objective: 'test',
      executionTimeMs: 250,
      resultCount: 1,
    }
    const output = formatResults(results, metadata)

    expect(output).toContain('## 1. [Example Article](https://example.com/article)')
    expect(output).toContain('**URL:** https://example.com/article')
    expect(output).toContain('**Domain:** example.com')
    expect(output).toContain('This is a test excerpt')
    expect(output).toContain('**Execution:** 0.3s')
  })

  it('includes domain distribution summary', () => {
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
      {
        url: 'https://other.org/1',
        title: 'Article 3',
        excerpt: 'Excerpt 3',
        domain: 'other.org',
        rank: 3,
      },
    ]
    const metadata: SearchMetadata = {
      objective: 'test',
      executionTimeMs: 1000,
      resultCount: 3,
    }
    const output = formatResults(results, metadata)

    expect(output).toContain('**Top Domains:**')
    expect(output).toContain('example.com: 2 results (67%)')
    expect(output).toContain('other.org: 1 results (33%)')
  })

  it('formats multiple results with correct ranking', () => {
    const results: SearchResult[] = [
      {
        url: 'https://first.com',
        title: 'First',
        excerpt: 'First excerpt',
        domain: 'first.com',
        rank: 1,
      },
      {
        url: 'https://second.com',
        title: 'Second',
        excerpt: 'Second excerpt',
        domain: 'second.com',
        rank: 2,
      },
      {
        url: 'https://third.com',
        title: 'Third',
        excerpt: 'Third excerpt',
        domain: 'third.com',
        rank: 3,
      },
    ]
    const metadata: SearchMetadata = {
      objective: 'multi test',
      executionTimeMs: 1500,
      resultCount: 3,
    }
    const output = formatResults(results, metadata)

    expect(output).toContain('## 1. [First](https://first.com)')
    expect(output).toContain('## 2. [Second](https://second.com)')
    expect(output).toContain('## 3. [Third](https://third.com)')
  })

  it('handles long excerpts', () => {
    const longExcerpt = 'A'.repeat(10000)
    const results: SearchResult[] = [
      {
        url: 'https://example.com',
        title: 'Long Article',
        excerpt: longExcerpt,
        domain: 'example.com',
        rank: 1,
      },
    ]
    const metadata: SearchMetadata = {
      objective: 'test',
      executionTimeMs: 500,
      resultCount: 1,
    }
    const output = formatResults(results, metadata)

    expect(output).toContain(longExcerpt)
  })
})

describe('sanitizeForFilename', () => {
  it('converts to lowercase and kebab-case', () => {
    expect(sanitizeForFilename('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(sanitizeForFilename('Test!@#$%^&*()')).toBe('test')
  })

  it('replaces multiple spaces with single hyphen', () => {
    expect(sanitizeForFilename('multiple   spaces   here')).toBe(
      'multiple-spaces-here'
    )
  })

  it('truncates to 50 characters', () => {
    const long = 'a'.repeat(100)
    expect(sanitizeForFilename(long)).toHaveLength(50)
  })

  it('handles mixed case and special chars', () => {
    expect(sanitizeForFilename('RAG System: Best Practices!')).toBe(
      'rag-system-best-practices'
    )
  })

  it('handles leading/trailing spaces', () => {
    expect(sanitizeForFilename('  test query  ')).toBe('test-query')
  })

  it('handles hyphens in input', () => {
    expect(sanitizeForFilename('pre-existing-hyphens')).toBe(
      'pre-existing-hyphens'
    )
  })

  it('collapses multiple hyphens', () => {
    expect(sanitizeForFilename('test---multiple---hyphens')).toBe(
      'test-multiple-hyphens'
    )
  })
})
