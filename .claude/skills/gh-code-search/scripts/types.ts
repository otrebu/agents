// ===== DATA INTERFACES =====

export interface SearchOptions {
  language?: string
  extension?: string
  filename?: string
  repo?: string
  owner?: string
  path?: string
  limit?: number
}

export interface TextMatch {
  property: string
  fragment: string
  matches?: Array<{ text: string; indices: number[] }>
}

export interface RawSearchResult {
  path: string
  repository: {
    full_name: string
    html_url: string
    stargazers_count: number
    pushed_at: string
    description?: string
  }
  html_url: string
  score: number
  sha: string
  text_matches?: TextMatch[]
}

export interface SearchResult {
  repository: string
  path: string
  url: string
  score: number
  stars: number
  lastPushed: string
  textMatches: TextMatch[]
}

export interface RankedResult extends SearchResult {
  rank: number
  qualityScore: number
}

export interface CodeFile {
  repository: string
  path: string
  url: string
  content: string
  lines: number
  language: string
  stars: number
  rank: number
}

// ===== FACTUAL ANALYSIS DATA =====
// Script extracts, Claude interprets

export interface FactualAnalysis {
  totalFiles: number
  totalLines: number
  languages: Record<string, number> // language: count
  commonImports: Array<{ import: string; count: number }>
  syntaxOccurrences: Record<string, number> // pattern: count
  fileStructure: {
    avgLinesPerFile: number
    avgStarsPerFile: number
    repoDistribution: Record<string, number> // repo: fileCount
  }
}

export interface SearchStats {
  query: string
  totalResults: number
  analyzedFiles: number
  executionTimeMs: number
}

// ===== ERROR CLASSES =====

export class AuthError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'AuthError'
  }
}

export class SearchError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'SearchError'
  }
}

export class FetchError extends Error {
  constructor(
    message: string,
    public repository: string,
    public path: string,
    public cause?: Error
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetAt: Date,
    public remaining: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}
