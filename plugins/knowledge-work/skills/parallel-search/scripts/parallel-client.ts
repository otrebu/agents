import Parallel from 'parallel-web'
import {
  AuthError,
  RateLimitError,
  NetworkError,
  ParallelSearchError,
  ValidationError,
} from './types.js'
import type { SearchOptions, SearchResult } from './types.js'

/**
 * Execute a search using the Parallel Search API
 * @param options Search configuration
 * @returns Array of search results with metadata
 */
export async function executeSearch(
  options: SearchOptions
): Promise<SearchResult[]> {
  // Validate inputs
  validateSearchOptions(options)

  // Validate API key
  const apiKey = process.env.PARALLEL_API_KEY
  if (!apiKey) {
    throw new AuthError(
      'PARALLEL_API_KEY environment variable not set. Get your API key at https://platform.parallel.ai/'
    )
  }

  // Initialize client
  const client = new Parallel({ apiKey })

  try {
    // Execute search with defaults optimized for research
    const response = await client.beta.search({
      objective: options.objective,
      search_queries: options.searchQueries,
      processor: (options.processor || 'pro') as any, // Default to 'pro' for research quality
      max_results: options.maxResults || 15, // More results for comprehensive research
      max_chars_per_result: options.maxCharsPerResult || 5000, // Larger excerpts for deep research
    })

    // Transform response to our format
    return transformResults(response)
  } catch (error: any) {
    // Handle specific error types
    if (error.status === 401 || error.status === 403) {
      throw new AuthError(
        'Invalid API key or unauthorized access. Check your PARALLEL_API_KEY.'
      )
    }

    if (error.status === 429) {
      const resetAt = error.headers?.['x-ratelimit-reset']
        ? new Date(error.headers['x-ratelimit-reset'] * 1000)
        : undefined
      const remaining = error.headers?.['x-ratelimit-remaining']
        ? parseInt(error.headers['x-ratelimit-remaining'])
        : undefined

      throw new RateLimitError(
        'Rate limit exceeded. Please wait before making more requests.',
        resetAt,
        remaining
      )
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new NetworkError(
        'Network connection failed. Please check your internet connection.',
        error
      )
    }

    // Generic error
    throw new ParallelSearchError(
      `Search failed: ${error.message || 'Unknown error'}`,
      error
    )
  }
}

/**
 * Validate search options
 * @param options Search options to validate
 */
function validateSearchOptions(options: SearchOptions): void {
  // At least one of objective or searchQueries is required
  if (!options.objective && (!options.searchQueries || options.searchQueries.length === 0)) {
    throw new ValidationError(
      'Either objective or searchQueries (or both) must be provided'
    )
  }

  // Validate searchQueries constraints
  if (options.searchQueries) {
    if (options.searchQueries.length > 5) {
      throw new ValidationError(
        'Maximum 5 search queries allowed per request'
      )
    }

    for (const query of options.searchQueries) {
      if (query.length > 200) {
        throw new ValidationError(
          `Search query too long (${query.length} chars). Maximum 200 characters per query.`
        )
      }
    }
  }

  // Validate maxCharsPerResult
  if (
    options.maxCharsPerResult !== undefined &&
    options.maxCharsPerResult < 100
  ) {
    throw new ValidationError(
      'max_chars_per_result must be at least 100 characters'
    )
  }

  // Validate processor
  if (options.processor) {
    const validProcessors = ['lite', 'base', 'pro', 'ultra']
    if (!validProcessors.includes(options.processor)) {
      throw new ValidationError(
        `Invalid processor: ${options.processor}. Must be one of: ${validProcessors.join(', ')}`
      )
    }
  }
}

/**
 * Transform Parallel API response to our SearchResult format
 * @param response Raw API response
 * @returns Array of formatted search results
 */
function transformResults(response: any): SearchResult[] {
  // Handle empty or malformed responses
  if (!response || !response.results || !Array.isArray(response.results)) {
    return []
  }

  return response.results.map((r: any, idx: number) => ({
    url: r.url || '',
    title: r.title || 'Untitled',
    excerpt: r.excerpt || '',
    domain: extractDomain(r.url || ''),
    rank: idx + 1,
  }))
}

/**
 * Extract domain from URL
 * @param url Full URL
 * @returns Domain name or 'unknown' if invalid
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return 'unknown'
  }
}
