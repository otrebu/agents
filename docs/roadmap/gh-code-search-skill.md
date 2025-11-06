# GitHub Code Search Skill - Implementation Plan

> **Status:** Planning Phase
> **Created:** 2025-11-06
> **Estimated Effort:** ~800 LOC
> **Inspiration:** [johnlindquist/ghx](https://github.com/johnlindquist/ghx)

---

## Overview

Build a Claude Code skill that **fetches real-world code examples from GitHub** for Claude to analyze. The skill handles the mechanical work (search, fetch, rank, extract data), while Claude performs the AI-powered analysis (pattern recognition, synthesis, recommendations).

### Philosophy: Division of Labor

**The Script Does (Computational Excellence):**
- 🔐 Authentication (gh CLI token handling)
- 🔍 Search execution (Octokit API, pagination, text-match)
- ⚡ Parallel fetching (Promise.all for speed)
- 📊 Objective ranking (stars, recency, repo metrics)
- 🎯 Context extraction (relevant code sections with boundaries)
- 🛡️ Error handling (rate limits, network, auth failures)
- 📈 Factual data extraction (imports, syntax counts, metrics)
- 📦 Clean markdown output (code + metadata)

**Claude Does (AI Excellence):**
- 🧠 Domain understanding (research context, understand tech)
- 🎨 Query crafting (natural language → smart GitHub queries)
- 📖 Code reading (comprehend what code actually does)
- 🔬 Pattern recognition (semantic patterns across examples)
- 💡 Synthesis (combine approaches, identify best techniques)
- ✨ Recommendations (suggest solutions based on understanding)

**Key Principle:** Script provides structured data, Claude interprets and draws conclusions.

---

## Example Workflows

### Workflow 1: Finding Claude Code Skill Patterns

**User:** "I want to find out if anyone else has implemented a github search in a claude code skill"

**Claude:**
1. Knows: Claude Code skills use `SKILL.md` with frontmatter (name, description)
2. Crafts query: `filename:SKILL.md github search`
3. Invokes: `cd .claude/skills/gh-code-search && pnpm search "filename:SKILL.md github search"`

**Script:**
1. Authenticates with gh CLI
2. Searches GitHub with Octokit API
3. Ranks by stars + recency
4. Fetches top 10 SKILL.md files (parallel)
5. Extracts factual data (common imports, syntax patterns)
6. Returns markdown report with code + metadata

**Claude:**
1. Reads the actual SKILL.md files
2. Identifies approaches (Octokit, gh CLI, custom APIs)
3. Synthesizes: "Three patterns found: A uses Octokit directly, B wraps gh search, C uses GraphQL"
4. Recommends: "Approach A is best because..." with reasoning
5. Suggests implementation

---

### Workflow 2: Learning New Library Patterns

**User:** "I want to see examples of workflows using: https://useworkflow.dev/"

**Claude:**
1. Uses WebFetch to read workflow.dev docs
2. Learns about `"use workflow";` syntax (unique identifier)
3. Crafts search: `"use workflow" language:typescript`
4. Invokes skill with that query

**Script:**
1. Searches GitHub for `"use workflow"` in TypeScript files
2. Ranks by quality (stars, recency, code structure)
3. Fetches top examples
4. Returns code with factual metadata

**Claude:**
1. Reads the examples
2. Identifies common patterns in how people use the library
3. Notes: "Most examples use X pattern, but repo Y does Z differently"
4. Explains trade-offs
5. Suggests which approach fits user's use case

---

## Project Structure

```
.claude/skills/gh-code-search/
├── SKILL.md                      # Skill manifest
├── package.json                  # Dependencies (no conf)
├── tsconfig.json                 # TypeScript config (NodeNext)
├── scripts/
│   ├── types.ts                  # Interfaces + error classes
│   ├── log.ts                    # CLI logging utility (DRY wrapper)
│   ├── github.ts                 # Auth + search + fetch (consolidated)
│   ├── query.ts                  # Query building helpers (optional)
│   ├── ranker.ts                 # Objective quality metrics
│   ├── analyzer.ts               # Factual data extraction
│   └── main.ts                   # Orchestrator
└── __tests__/
    ├── auth.test.ts              # Auth error handling
    ├── github.test.ts            # Search, fetch, rate limits
    ├── query.test.ts             # Query building
    ├── ranker.test.ts            # Ranking algorithm
    ├── analyzer.test.ts          # Data extraction
    └── integration.test.ts       # Full workflow
```

**Total Modules:** 7 (added log.ts for DRY)
**Total LOC:** ~850 (added ~50 LOC for logging utility)
**Test Coverage:** ~400 LOC

---

## Dependencies & TypeScript Configuration

### Development Standards

**IMPORTANT:** This skill follows the codebase FP-first TypeScript patterns:
- **Stack decisions:** Reference `typescript-coding` skill → `STACK.md` for preferred libraries
- **Tooling setup:** Reference `typescript-coding` skill → `TOOLING.md` for tsconfig, ESLint, pnpm patterns
- **Testing patterns:** Reference `typescript-coding` skill → `TESTING.md` for Vitest parameterized vs individual test decisions
- **Logging strategy:** Reference `typescript-coding` skill → `LOGGING.md` for CLI logging patterns (console + chalk, NOT pino)
- **Universal patterns:** Reference `@docs/CODING_STYLE.md` for FP, naming, error handling
- **Workflow:** Reference `@docs/DEVELOPMENT_WORKFLOW.md` for testing, commits, Definition of Done

### package.json

```json
{
  "name": "gh-code-search",
  "version": "1.0.0",
  "type": "module",
  "description": "Fetch real-world code examples from GitHub for Claude to analyze",
  "scripts": {
    "search": "tsx scripts/main.ts",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint scripts/**/*.ts",
    "lint:fix": "eslint scripts/**/*.ts --fix",
    "format": "prettier --write scripts/**/*.ts",
    "format:check": "prettier --check scripts/**/*.ts"
  },
  "dependencies": {
    "@octokit/rest": "^20.0.2",
    "chalk": "^5.3.0",
    "ora": "^8.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "vitest": "^1.2.0",
    "uba-eslint-config": "latest"
  }
}
```

**Notes:**
- **CLI tool:** Uses `console + chalk + ora` (human-readable terminal output per `typescript-coding/LOGGING.md`)
- **NOT using pino:** This is a CLI tool, not a service (pino is for services/APIs only)
- **ESLint:** Uses `uba-eslint-config` per `typescript-coding/TOOLING.md#eslint`
- **Script naming:** Follows `:fix` and `:check` conventions per `typescript-coding/TOOLING.md#package.json-scripts`
- **No caching in v1:** Removed `conf` dependency for simplicity

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./scripts"
  },
  "include": ["scripts/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

**Note:** Uses `NodeNext` for module resolution (matches codebase standard).

---

## TypeScript Coding Standards for Implementation

**FP-First Patterns (from @docs/CODING_STYLE.md + typescript-coding/TOOLING.md):**

1. **Minimal OOP**: Avoid classes except for custom error types (AuthError, SearchError, etc.)
2. **No `this`, `new`, prototypes**: Use functions, modules, closures instead
3. **Plain objects `{}`**: Not class instances
4. **Small, focused functions**: If >3 params → use single options object
5. **Pure functions**: Isolate side effects (API calls, console.log) at module edges
6. **Immutable returns**: Don't mutate input data
7. **Composition over inheritance**: Build complex logic from small, testable units
8. **Data-first utilities**: Inputs first, options last

**Naming Conventions (from @docs/CODING_STYLE.md):**

- **Self-documenting**: `contextLinesCount` not `lines`, `maxFileSizeBytes` not `max`
- **Include units and domain terms**: `timeoutMs`, `maxFiles`, `contextLinesCount`, `priceGBP`
- **Booleans**: `isAuthenticated`, `hasTextMatches`, `shouldFetchContext`
- **Functions**: Verbs (`fetchCodeFiles`, `rankResults`, `extractFactualData`)
- **Data**: Nouns (`SearchResult`, `CodeFile`, `FactualAnalysis`)
- **Avoid abbreviations** unless industry-standard (id, URL, HTML)

**Comments Explain WHY (from @docs/CODING_STYLE.md):**

```typescript
// ✅ Good: Explains rationale, constraints, trade-offs
// WHY: GitHub API returns fragments without full context, must expand to line boundaries
// WHY: Log scale prevents 100k-star repos from dominating over 1k-star repos

// ❌ Bad: Narrates implementation steps
// Loop through lines and add them to the array
```

**Error Handling (from @docs/CODING_STYLE.md):**

- Use typed error classes (AuthError, SearchError, FetchError, RateLimitError)
- Include actionable context (repository, path, reset time)
- Provide recovery suggestions in error messages

**Logging for CLI Tools (typescript-coding/LOGGING.md#cli-logging):**

- **This is a CLI tool** → Use `console.log()` + `chalk` + `ora` (human-readable)
- **NOT a service** → Do NOT use pino/winston (those are for services/APIs)
- stdout for normal output (`console.log`), stderr for errors (`console.error`)
- Use chalk for colors, ora for spinners
- ESLint: Disable `no-console` rule (only exception for CLI projects per typescript-coding/TOOLING.md#eslint)

**Testing with Vitest (typescript-coding/TESTING.md):**

- **Parameterized tests (`test.each`)**: For pure functions with similar edge cases (validation, formatters, calculations)
- **Individual tests**: For different mocks/setup, distinct business scenarios, complex async operations
- **Hybrid approach**: Group related scenarios with parameterization, separate distinct scenarios
- **Key principle**: Parameterize for data variance, individualize for behavioral variance
- Tests tell a story: `it('warns when rate limit low (<10 remaining)')`
- Update tests when behavior changes (don't force green)

**ESLint (typescript-coding/TOOLING.md#eslint):**

- Use `uba-eslint-config`
- **NEVER disable or modify rules** (fix code to comply)
- **Exception for CLI only**: Disable `no-console` in log.ts ONLY (add `/* eslint-disable no-console */` at top of log.ts)
- All other modules import from log.ts instead of using console directly

**During Implementation:**

1. Consult `typescript-coding/STACK.md` for library choices (pnpm, Vitest, chalk, ora)
2. Reference `typescript-coding/TOOLING.md` for tsconfig patterns, ESLint, pnpm commands
3. Reference `typescript-coding/TESTING.md` for Vitest parameterized vs individual test decisions
4. Reference `typescript-coding/LOGGING.md` for CLI logging patterns (console + chalk + DRY, NOT pino)
5. Reference `@docs/CODING_STYLE.md` for FP patterns, naming, error handling
6. Follow `@docs/DEVELOPMENT_WORKFLOW.md` for testing, commits, Definition of Done
7. Use conventional commits: `feat(github): add parallel file fetching`
8. Create log.ts first (Phase 1) so all other modules can import it

---

## Core Modules

### 1. types.ts - Type Definitions & Errors

**Purpose:** Interfaces for data flow + typed error classes

```typescript
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
  languages: Record<string, number>  // language: count
  commonImports: Array<{ import: string; count: number }>
  syntaxOccurrences: Record<string, number>  // pattern: count
  fileStructure: {
    avgLinesPerFile: number
    avgStarsPerFile: number
    repoDistribution: Record<string, number>  // repo: fileCount
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
```

**Key Changes from Original:**
- Removed "Pattern", "BestPractice", "AnalysisReport" (interpretive)
- Added "FactualAnalysis" (mechanical data extraction)
- Added typed error classes (AuthError, SearchError, FetchError, RateLimitError)

---

### 2. log.ts - CLI Logging Utility (DRY)

**Purpose:** Centralized logging for CLI tool (follows typescript-coding/LOGGING.md#cli-logging)

**Why:** Avoid repeating console.error(chalk.red(...)) everywhere (DRY principle)

```typescript
/* eslint-disable no-console */
import chalk from 'chalk'

// ===== CLI LOGGING UTILITY =====
// WHY: DRY wrapper for console + chalk, avoids repeating styling everywhere
// NOTE: This is a CLI tool, so console.log/console.error are correct (not pino)
// ESLint: no-console disabled ONLY in this file (all other modules import from here)

export const log = {
  // Normal output to stdout
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message)
  },

  success: (message: string) => {
    console.log(chalk.green('✔'), message)
  },

  warn: (message: string) => {
    console.log(chalk.yellow('⚠️ '), message)
  },

  // Error output to stderr
  error: (message: string) => {
    console.error(chalk.red('✖'), message)
  },

  // Dimmed helper text to stderr
  dim: (message: string) => {
    console.error(chalk.dim(message))
  },

  // Plain output (for markdown reports, etc.)
  plain: (message: string) => {
    console.log(message)
  },

  // Headers
  header: (message: string) => {
    console.log(chalk.bold.blue(message))
  }
}
```

**Usage Example:**

```typescript
// Instead of:
console.error(chalk.red('✖'), 'Authentication failed')
console.error(chalk.dim('Run: gh auth login --web'))

// Use:
log.error('Authentication failed')
log.dim('Run: gh auth login --web')
```

**FP Pattern:**
- Plain object with functions (no class, no `this`)
- Side effects isolated in dedicated module
- Single responsibility: CLI output formatting

**ESLint:**
- This module is the ONLY place where `no-console` needs to be disabled
- Everywhere else imports from this module

---

### 3. github.ts - GitHub API Integration

**Purpose:** Consolidated auth + search + fetch (all Octokit interactions)

**Pattern:** Adopted from ghx - delegates auth to gh CLI

```typescript
import { execSync } from 'child_process'
import { Octokit } from '@octokit/rest'
import { log } from './log.js'
import type {
  SearchOptions,
  RawSearchResult,
  SearchResult,
  RankedResult,
  CodeFile,
  TextMatch
} from './types.js'
import {
  AuthError,
  SearchError,
  FetchError,
  RateLimitError
} from './types.js'

// ===== AUTHENTICATION =====

export async function getGitHubToken(): Promise<string> {
  try {
    const token = execSync('gh auth token', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim()

    if (token && token.length > 0) {
      return token
    }

    log.error('GitHub CLI not authenticated')
    log.dim('\nRun: gh auth login --web\n')
    process.exit(1)

  } catch (error) {
    throw new AuthError(
      'GitHub CLI not found or authentication failed. Install: https://cli.github.com/',
      error as Error
    )
  }
}

export function isAuthenticated(): boolean {
  try {
    const token = execSync('gh auth token', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim()
    return token.length > 0
  } catch {
    return false
  }
}

// ===== SEARCH =====

export async function searchGitHubCode(
  token: string,
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const octokit = new Octokit({ auth: token })
  const searchQuery = buildSearchQuery(query, options)

  const limit = options.limit ?? 100
  let allResults: RawSearchResult[] = []
  let page = 1
  let remaining = limit

  while (remaining > 0) {
    const perPage = Math.min(remaining, 100)

    try {
      const response = await octokit.rest.search.code({
        q: searchQuery,
        per_page: perPage,
        page,
        headers: {
          Accept: 'application/vnd.github.v3.text-match+json'
        }
      })

      // Check rate limits
      const rateLimitRemaining = parseInt(response.headers['x-ratelimit-remaining'] || '0')
      const rateLimitReset = parseInt(response.headers['x-ratelimit-reset'] || '0')

      if (rateLimitRemaining < 10) {
        const resetDate = new Date(rateLimitReset * 1000)
        log.warn(`Rate limit low: ${rateLimitRemaining} requests remaining (resets at ${resetDate.toLocaleTimeString()})`)
      }

      const results = response.data.items as unknown as RawSearchResult[]
      allResults = allResults.concat(results)

      if (results.length < perPage) break

      remaining -= results.length
      page++

    } catch (error: any) {
      if (error.status === 403) {
        const resetTime = error.response?.headers?.['x-ratelimit-reset']
        const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : new Date()
        throw new RateLimitError(
          'GitHub API rate limit exceeded',
          resetDate,
          0
        )
      }
      throw new SearchError(`Search failed: ${error.message}`, error)
    }
  }

  return allResults.map(item => ({
    repository: item.repository.full_name,
    path: item.path,
    url: item.html_url,
    score: item.score,
    stars: item.repository.stargazers_count,
    lastPushed: item.repository.pushed_at,
    textMatches: item.text_matches || []
  }))
}

function buildSearchQuery(query: string, options: SearchOptions): string {
  let q = query

  if (options.language) q += ` language:${options.language}`
  if (options.extension) q += ` extension:${options.extension}`
  if (options.filename) q += ` filename:${options.filename}`
  if (options.repo) q += ` repo:${options.repo}`
  if (options.owner) q += ` user:${options.owner}`
  if (options.path) q += ` path:${options.path}`

  return q.trim()
}

// ===== PARALLEL FETCHING =====

export interface FetchCodeFilesOptions {
  token: string
  rankedResults: RankedResult[]
  maxFiles?: number
  contextLinesCount?: number
}

export async function fetchCodeFiles(options: FetchCodeFilesOptions): Promise<CodeFile[]> {
  const { token, rankedResults, maxFiles = 10, contextLinesCount = 20 } = options
  const octokit = new Octokit({ auth: token })

  const fetchPromises = rankedResults.slice(0, maxFiles).map(result =>
    fetchSingleFile({ octokit, result, contextLinesCount })
  )

  const settled = await Promise.allSettled(fetchPromises)

  const successfulFetches = settled
    .filter((r): r is PromiseFulfilledResult<CodeFile> => r.status === 'fulfilled')
    .map(r => r.value)

  const failures = settled
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason)

  if (failures.length > 0) {
    log.warn(`Failed to fetch ${failures.length}/${rankedResults.length} files`)
    failures.slice(0, 3).forEach((err: FetchError) => {
      log.dim(`   - ${err.repository}/${err.path}: ${err.message}`)
    })
  }

  return successfulFetches
}

interface FetchSingleFileOptions {
  octokit: Octokit
  result: RankedResult
  contextLinesCount: number
}

async function fetchSingleFile(options: FetchSingleFileOptions): Promise<CodeFile> {
  const { octokit, result, contextLinesCount } = options
  try {
    const [owner, repo] = result.repository.split('/')

    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: result.path,
      mediaType: { format: 'raw' }
    })

    const content = response.data as unknown as string

    // Extract context around matches (ghx pattern)
    const processedContent = result.textMatches.length > 0
      ? extractMatchesWithContext({ content, textMatches: result.textMatches, contextLinesCount })
      : content

    const language = detectLanguage(result.path)

    // Skip files that are too large (>100KB)
    const maxFileSizeBytes = 100_000
    if (content.length > maxFileSizeBytes) {
      throw new Error(`File too large (>${maxFileSizeBytes / 1000}KB)`)
    }

    return {
      repository: result.repository,
      path: result.path,
      url: result.url,
      content: processedContent,
      lines: processedContent.split('\n').length,
      language,
      stars: result.stars,
      rank: result.rank
    }

  } catch (error: any) {
    throw new FetchError(
      error.message,
      result.repository,
      result.path,
      error
    )
  }
}

// ===== CONTEXT EXTRACTION (ghx pattern) =====
// WHY: GitHub text-match fragments need surrounding lines for proper context

interface ExtractMatchesWithContextOptions {
  content: string
  textMatches: TextMatch[]
  contextLinesCount: number
}

function extractMatchesWithContext(options: ExtractMatchesWithContextOptions): string {
  const { content, textMatches, contextLinesCount } = options
  const fragments: string[] = []

  for (const match of textMatches) {
    if (match.property !== 'content') continue

    const fragment = match.fragment
    const fragmentIndex = content.indexOf(fragment)

    if (fragmentIndex === -1) {
      fragments.push(fragment)
      continue
    }

    // Find line boundaries
    let startPos = content.lastIndexOf('\n', fragmentIndex)
    if (startPos === -1) startPos = 0
    let endPos = content.indexOf('\n', fragmentIndex + fragment.length)
    if (endPos === -1) endPos = content.length

    // Expand context
    let contextStart = startPos
    let lineCount = 0
    while (lineCount < contextLinesCount && contextStart > 0) {
      const newContextStart = content.lastIndexOf('\n', contextStart - 1)
      if (newContextStart === -1) {
        contextStart = 0
        break
      }
      contextStart = newContextStart
      lineCount++
    }

    let contextEnd = endPos
    lineCount = 0
    while (lineCount < contextLinesCount && contextEnd < content.length) {
      const nextNewline = content.indexOf('\n', contextEnd + 1)
      if (nextNewline === -1) {
        contextEnd = content.length
        break
      }
      contextEnd = nextNewline
      lineCount++
    }

    // Adjust to line boundaries
    contextStart = content.lastIndexOf('\n', contextStart) + 1
    if (contextStart < 0) contextStart = 0

    const extractedFragment = content.slice(contextStart, contextEnd)
    fragments.push(extractedFragment.trim())
  }

  return fragments.length > 0 ? fragments.join('\n\n---\n\n') : content
}

function detectLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || ''

  const langMap: Record<string, string> = {
    'ts': 'typescript', 'tsx': 'typescript',
    'js': 'javascript', 'jsx': 'javascript',
    'py': 'python', 'go': 'go', 'rs': 'rust',
    'java': 'java', 'rb': 'ruby', 'php': 'php',
    'yml': 'yaml', 'yaml': 'yaml', 'json': 'json',
    'md': 'markdown', 'sh': 'bash'
  }

  return langMap[ext] || ext
}
```

**Key Features:**
- Consolidated auth + search + fetch (was 3 files, now 1)
- Rate limit inspection and warnings
- Typed errors (AuthError, SearchError, FetchError, RateLimitError)
- Parallel fetching with Promise.allSettled
- Graceful partial failure handling
- Context extraction (ghx pattern)
- File size limits (>100KB skipped)

**FP Patterns Applied:**

1. **Options objects for >3 params**: `fetchCodeFiles(options)`, `fetchSingleFile(options)`
2. **Pure data transformations**: `detectLanguage`, `buildSearchQuery`
3. **Side effects isolated**: Octokit calls, console.warn at function boundaries
4. **Explicit error types**: Each failure mode has typed error class
5. **Immutable data flow**: No mutation of input arrays/objects

---

### 3. query.ts - Query Building Helpers (Optional)

**Purpose:** Help construct effective GitHub search queries

**Note:** This is optional. Claude can craft queries directly. But these helpers make common patterns easier.

```typescript
import type { SearchOptions } from './types.js'

interface QueryIntent {
  query: string
  options: SearchOptions
}

// Common patterns for query enhancement
const PATTERNS: Record<string, Partial<SearchOptions>> = {
  'react hook': { language: 'typescript', extension: 'tsx' },
  'react component': { language: 'typescript', extension: 'tsx' },
  'express middleware': { language: 'javascript' },
  'eslint config': { filename: '.eslintrc' },
  'typescript config': { filename: 'tsconfig.json' },
  'dockerfile': { filename: 'Dockerfile' },
  'github actions': { path: '.github/workflows', extension: 'yml' },
  'claude code skill': { filename: 'SKILL.md' },
}

export function buildQueryIntent(userQuery: string): QueryIntent {
  const lowerQuery = userQuery.toLowerCase()
  let options: SearchOptions = { limit: 100 }
  let query = userQuery

  // Check for pattern matches
  for (const [pattern, opts] of Object.entries(PATTERNS)) {
    if (lowerQuery.includes(pattern)) {
      options = { ...options, ...opts }
      break
    }
  }

  // Extract repo constraint (e.g., "in repo:user/repo")
  const repoMatch = userQuery.match(/(?:in|from|repo:?)\s+([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)/i)
  if (repoMatch) {
    options.repo = repoMatch[1]
    query = query.replace(repoMatch[0], '').trim()
  }

  return { query, options }
}
```

**Why Optional:**
- Claude can craft queries directly without this
- Useful for common patterns but not required
- Can be added later if needed

---

### 4. ranker.ts - Objective Quality Scoring

**Purpose:** Rank results by objective metrics (no interpretation)

**Formula:** stars(40%) + relevance(30%) + recency(20%) + codeQuality(10%)

```typescript
import type { SearchResult, RankedResult } from './types.js'

// WHY: Returns top N results to avoid fetching low-quality files
export function rankResults(
  results: SearchResult[],
  topN = 10
): RankedResult[] {
  return results
    .map(result => ({
      ...result,
      qualityScore: calculateQualityScore(result),
      rank: 0
    }))
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, topN)
    .map((result, index) => ({
      ...result,
      rank: index + 1
    }))
}

// WHY: Weighted scoring balances popularity (stars) with recency and structure
function calculateQualityScore(result: SearchResult): number {
  const starsScore = calculateStarsScore(result.stars)
  const relevanceScore = normalizeScore(result.score, 0, 100)
  const recencyScore = calculateRecencyScore(result.lastPushed)
  const codeQualityScore = calculateCodeQualityScore(result)

  // Weights chosen empirically: stars matter most, then relevance
  return (
    starsScore * 0.4 +
    relevanceScore * 0.3 +
    recencyScore * 0.2 +
    codeQualityScore * 0.1
  )
}

// WHY: Log scale prevents 100k-star repos from dominating over 1k-star repos
function calculateStarsScore(stars: number): number {
  if (stars === 0) return 0.1
  const logStars = Math.log10(stars + 1)
  const maxLogScore = 5 // ~100k stars = score of 1.0
  return Math.min(logStars / maxLogScore, 1)
}

// WHY: Recent activity signals maintained code; decay curve favors <30 days
function calculateRecencyScore(lastPushedISO: string): number {
  const nowMs = Date.now()
  const pushedAtMs = new Date(lastPushedISO).getTime()
  const msPerDay = 1000 * 60 * 60 * 24
  const ageInDays = (nowMs - pushedAtMs) / msPerDay

  if (ageInDays < 7) return 1.0
  if (ageInDays < 30) return 0.9
  if (ageInDays < 90) return 0.7
  if (ageInDays < 180) return 0.5
  if (ageInDays < 365) return 0.3
  return 0.2
}

// WHY: Path structure hints at code quality (src/ good, node_modules/ bad)
function calculateCodeQualityScore(result: SearchResult): number {
  let score = 0.5
  const pathLowercase = result.path.toLowerCase()

  // Positive indicators
  if (pathLowercase.includes('/src/') || pathLowercase.includes('/lib/')) score += 0.2
  if (pathLowercase.endsWith('.ts') || pathLowercase.endsWith('.tsx')) score += 0.1
  if (pathLowercase.includes('/components/') || pathLowercase.includes('/hooks/')) score += 0.1

  // Negative indicators
  if (pathLowercase.includes('node_modules')) score -= 0.5
  if (pathLowercase.includes('/dist/') || pathLowercase.includes('/build/')) score -= 0.3
  if (pathLowercase.split('/').length < 3) score -= 0.2 // Shallow paths often config

  return Math.max(0, Math.min(1, score))
}

function normalizeScore(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}
```

**Key Principle:** Objective metrics only. No "this is good code" judgments.

**FP Patterns:**
- All functions pure (same input → same output)
- No side effects (no logging, no mutations)
- Immutable transformations (`.map`, `.sort`, `.slice`)
- Explicit variable names (`pathLowercase`, `ageInDays`, `maxLogScore`)

---

### 5. analyzer.ts - Factual Data Extraction

**Purpose:** Extract mechanical facts for Claude to interpret

**NOT doing:** Best practices, anti-patterns, recommendations (that's Claude's job)

```typescript
import type { CodeFile, FactualAnalysis } from './types.js'

export function extractFactualData(files: CodeFile[]): FactualAnalysis {
  const totalLines = files.reduce((sum, f) => sum + f.lines, 0)

  return {
    totalFiles: files.length,
    totalLines,
    languages: countLanguages(files),
    commonImports: extractCommonImports(files),
    syntaxOccurrences: extractSyntaxOccurrences(files),
    fileStructure: {
      avgLinesPerFile: Math.round(totalLines / files.length),
      avgStarsPerFile: Math.round(
        files.reduce((sum, f) => sum + f.stars, 0) / files.length
      ),
      repoDistribution: countRepoDistribution(files)
    }
  }
}

function countLanguages(files: CodeFile[]): Record<string, number> {
  const langs: Record<string, number> = {}
  for (const file of files) {
    langs[file.language] = (langs[file.language] || 0) + 1
  }
  return langs
}

function extractCommonImports(files: CodeFile[]): Array<{ import: string; count: number }> {
  const importMap = new Map<string, number>()

  for (const file of files) {
    // Match ES6 imports
    const imports = file.content.match(/import\s+.+\s+from\s+['"]([^'"]+)['"]/g)
    if (!imports) continue

    for (const imp of imports) {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/)
      if (match) {
        const pkg = match[1]
        // Only count external packages (not relative imports)
        if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
          importMap.set(pkg, (importMap.get(pkg) || 0) + 1)
        }
      }
    }
  }

  return Array.from(importMap.entries())
    .map(([imp, count]) => ({ import: imp, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
}

function extractSyntaxOccurrences(files: CodeFile[]): Record<string, number> {
  const patterns: Record<string, RegExp> = {
    'async/await': /async\s+\w+|await\s+/g,
    'try/catch': /try\s*\{|catch\s*\(/g,
    'Promise': /new\s+Promise|Promise\./g,
    '.then/.catch': /\.then\(|\.catch\(/g,
    'useEffect': /useEffect\s*\(/g,
    'useState': /useState\s*\(/g,
    'class': /class\s+\w+/g,
    'interface': /interface\s+\w+/g,
    'type alias': /type\s+\w+\s*=/g,
    'arrow function': /=>\s*\{|=>\s*\(/g,
    'function declaration': /function\s+\w+/g,
    'export': /export\s+(default\s+)?(const|function|class|interface|type)/g,
  }

  const counts: Record<string, number> = {}

  for (const [name, regex] of Object.entries(patterns)) {
    let totalMatches = 0
    for (const file of files) {
      const matches = file.content.match(regex)
      if (matches) {
        totalMatches += matches.length
      }
    }
    counts[name] = totalMatches
  }

  return counts
}

function countRepoDistribution(files: CodeFile[]): Record<string, number> {
  const repos: Record<string, number> = {}
  for (const file of files) {
    repos[file.repository] = (repos[file.repository] || 0) + 1
  }
  return repos
}
```

**What This Provides:**
- Counts (imports, syntax patterns, languages)
- Distributions (repos, file structure)
- Averages (lines per file, stars per file)

**What This Does NOT Provide:**
- "This is a best practice" ❌
- "Use TypeScript" ❌
- "This approach is better" ❌

Claude reads the code and makes those judgments.

---

### 6. main.ts - Orchestrator

**Purpose:** Tie it all together, handle UX, output clean markdown

```typescript
#!/usr/bin/env node

import ora from 'ora'
import { log } from './log.js'
import { getGitHubToken } from './github.js'
import { searchGitHubCode, fetchCodeFiles } from './github.js'
import { buildQueryIntent } from './query.js'
import { rankResults } from './ranker.js'
import { extractFactualData } from './analyzer.js'
import type { SearchStats } from './types.js'
import {
  AuthError,
  SearchError,
  FetchError,
  RateLimitError
} from './types.js'

async function main() {
  const startTime = Date.now()

  log.header('\n🔍 GitHub Code Search\n')

  try {
    // Parse query from args
    const userQuery = process.argv.slice(2).join(' ')
    if (!userQuery || userQuery.trim().length === 0) {
      log.error('No query provided')
      log.dim('\nUsage: pnpm search "your search query"\n')
      process.exit(1)
    }

    // Auth
    const authSpinner = ora('Authenticating with GitHub...').start()
    const token = await getGitHubToken()
    authSpinner.succeed('Authenticated')

    // Build query
    const { query, options } = buildQueryIntent(userQuery)
    log.dim('\nSearch Parameters:')
    log.dim(`  Query: "${query}"`)
    log.dim(`  Filters: ${JSON.stringify(options)}\n`)

    // Search
    const searchSpinner = ora('Searching GitHub...').start()
    const results = await searchGitHubCode(token, query, options)
    searchSpinner.succeed(`Found ${results.length} results`)

    if (results.length === 0) {
      log.warn('No results found')
      log.dim('Try a different query or remove filters.')
      process.exit(0)
    }

    // Rank
    const rankSpinner = ora('Ranking by quality...').start()
    const ranked = rankResults(results, 10)
    rankSpinner.succeed(`Top ${ranked.length} selected`)

    // Fetch
    const fetchSpinner = ora(`Fetching code from ${ranked.length} files...`).start()
    const files = await fetchCodeFiles({
      token,
      rankedResults: ranked,
      maxFiles: 10,
      contextLinesCount: 20
    })
    fetchSpinner.succeed(`Fetched ${files.length} files`)

    // Extract factual data
    const analyzeSpinner = ora('Extracting factual data...').start()
    const analysis = extractFactualData(files)
    analyzeSpinner.succeed('Data extracted')

    // Stats
    const stats: SearchStats = {
      query: userQuery,
      totalResults: results.length,
      analyzedFiles: files.length,
      executionTimeMs: Date.now() - startTime
    }

    // Output clean markdown for Claude
    const report = formatMarkdownReport(analysis, files, stats)

    log.success('\nSearch complete!')
    log.plain('\n' + report)

  } catch (error: any) {
    if (error instanceof AuthError) {
      log.error('\nAuthentication failed')
      log.dim(error.message)
      log.dim('\nInstall gh CLI: https://cli.github.com/')
      log.dim('Then run: gh auth login --web\n')
    } else if (error instanceof RateLimitError) {
      log.error('\nRate limit exceeded')
      log.dim(error.message)
      log.dim(`\nResets at: ${error.resetAt.toLocaleString()}`)
      log.dim(`Remaining requests: ${error.remaining}\n`)
    } else if (error instanceof SearchError) {
      log.error('\nSearch failed')
      log.dim(error.message + '\n')
    } else {
      log.error('\nUnexpected error')
      log.dim(error)
    }
    process.exit(1)
  }
}

function formatMarkdownReport(
  analysis: any,
  files: any[],
  stats: SearchStats
): string {
  const sections: string[] = []

  // Header
  sections.push(`# GitHub Code Search Results\n`)
  sections.push(`**Query:** \`${stats.query}\``)
  sections.push(`**Found:** ${stats.totalResults} results, analyzed top ${stats.analyzedFiles}`)
  sections.push(`**Execution:** ${(stats.executionTimeMs / 1000).toFixed(1)}s\n`)
  sections.push('---\n')

  // Factual data
  sections.push('## 📊 Factual Data\n')
  sections.push(`**Files:** ${analysis.totalFiles}`)
  sections.push(`**Total Lines:** ${analysis.totalLines.toLocaleString()}`)
  sections.push(`**Languages:** ${Object.entries(analysis.languages).map(([lang, count]) => `${lang} (${count})`).join(', ')}`)
  sections.push(`**Avg Lines/File:** ${analysis.fileStructure.avgLinesPerFile}`)
  sections.push(`**Avg Stars/File:** ${analysis.fileStructure.avgStarsPerFile}\n`)

  if (analysis.commonImports.length > 0) {
    sections.push('**Common Imports:**')
    analysis.commonImports.slice(0, 10).forEach((imp: any) => {
      sections.push(`- \`${imp.import}\` (${imp.count} files)`)
    })
    sections.push('')
  }

  if (Object.keys(analysis.syntaxOccurrences).length > 0) {
    sections.push('**Syntax Patterns:**')
    Object.entries(analysis.syntaxOccurrences)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([pattern, count]) => {
        sections.push(`- ${pattern}: ${count} occurrences`)
      })
    sections.push('')
  }

  sections.push('---\n')

  // Code files
  sections.push('## 📂 Top Files\n')
  for (const file of files.slice(0, 5)) {
    sections.push(`### ${file.rank}. [${file.repository}](${file.url}) ⭐ ${formatStars(file.stars)}`)
    sections.push(`**${file.path}** (${file.lines} lines, ${file.language})\n`)

    const snippet = file.content.split('\n').slice(0, 30).join('\n')
    sections.push('```' + file.language)
    sections.push(snippet)
    if (file.lines > 30) sections.push('// ... more code ...')
    sections.push('```\n')
  }

  sections.push('---\n')
  sections.push(`*Fetched ${analysis.totalFiles} files from ${Object.keys(analysis.fileStructure.repoDistribution).length} repositories*\n`)

  return sections.join('\n')
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`
  }
  return stars.toString()
}

main()
```

**Key Features:**
- DRY logging with `log` utility (wraps console + chalk per typescript-coding/LOGGING.md)
- ora spinners for progress indicators
- console.log/console.error centralized in log.ts (stdout/stderr)
- Clean markdown output (code + metadata)
- Comprehensive error handling with typed errors
- Execution time tracking
- Graceful degradation (partial fetch failures)

---

## SKILL.md Specification

```markdown
---
name: gh-code-search
description: Fetch real-world code examples from GitHub for Claude to analyze. Search with smart queries (stars, recency, language), fetch top results in parallel with context extraction, extract factual data (imports, syntax patterns, metrics). Returns clean markdown for Claude to read, identify patterns, synthesize approaches, and suggest solutions. One-shot execution optimized for Claude workflow.
allowed-tools: Bash(gh auth:*), Bash(pnpm:*)
---

# GitHub Code Search

Fetch real-world code examples from GitHub for Claude to analyze.

## Prerequisites

**Required:**
- gh CLI installed and authenticated (`gh auth login --web`)
- Node.js + pnpm

**Validation:**
```bash
gh auth status  # Should show authenticated
```

## Usage

```bash
cd .claude/skills/gh-code-search
pnpm install  # First time only
pnpm search "your query here"
```

## When to Use

**Claude invokes this skill when:**
- User wants real-world examples ("how do people implement X?")
- Learning library patterns ("show me examples of workflow.dev usage")
- Finding implementation approaches ("claude code skills doing github search")
- Researching architectural patterns ("repository pattern in TypeScript")

**Examples:**
- "Find Claude Code skills that do github search"
- "Show me examples of Express error handling middleware"
- "How do people use the Anthropic API in TypeScript?"
- "Examples of GitHub Actions workflows for TypeScript projects"

## How It Works

**Script Responsibilities:**
1. Authenticates with GitHub (gh CLI token)
2. Searches GitHub Code (Octokit API, pagination, text-match)
3. Ranks by quality (stars, recency, code structure)
4. Fetches top 10 files in parallel
5. Extracts factual data (imports, syntax patterns, metrics)
6. Returns clean markdown with code + metadata

**Claude's Responsibilities:**
1. Crafts effective search queries
2. Reads and comprehends the code
3. Identifies semantic patterns
4. Synthesizes findings across examples
5. Suggests solutions and best approaches

## Output

Markdown report with:
- Factual data (imports, syntax patterns, language distribution)
- Top files with full code (up to 30 lines preview)
- Repository metadata (stars, language, lines)

**Claude then:**
- Reads the code
- Identifies patterns
- Explains trade-offs
- Recommends approaches

## Limitations

- GitHub API rate limit: 5,000 req/hr authenticated
- Fetches top 10 results only
- Skips files >100KB
- Provides data, not conclusions (Claude interprets)

## Integration Notes

**How Claude uses this:**

```javascript
// Example: User asks "find Claude Code skills doing github search"

// 1. Claude knows: skills use SKILL.md with frontmatter
// 2. Claude crafts query: "filename:SKILL.md github search"
// 3. Claude invokes:
cd .claude/skills/gh-code-search
pnpm search "filename:SKILL.md github search"

// 4. Script returns markdown with SKILL.md files + data
// 5. Claude reads, analyzes, suggests implementation
```

## Error Handling

- **Auth errors:** Prompts to run `gh auth login --web`
- **Rate limits:** Shows remaining quota, reset time
- **Network failures:** Graceful degradation (partial results OK)
- **No results:** Suggests query refinement

## Typical Execution

10-30 seconds depending on:
- Number of results (100 max)
- File sizes
- Network latency
- API rate limits
```

---

## Testing Strategy

### Unit Tests

**auth.test.ts** - Authentication error handling
```typescript
describe('getGitHubToken', () => {
  it('returns token when gh CLI authenticated')
  it('throws AuthError when gh CLI not installed')
  it('throws AuthError when token empty')
  it('handles execSync failures gracefully')
})
```

**github.test.ts** - Search, fetch, rate limits
```typescript
describe('searchGitHubCode', () => {
  it('searches with correct query parameters')
  it('handles pagination correctly')
  it('includes text-match headers')
  it('throws RateLimitError on 403')
  it('throws SearchError on network failure')
  it('warns when rate limit low (<10 remaining)')
})

describe('fetchCodeFiles', () => {
  it('fetches files in parallel')
  it('handles partial failures gracefully')
  it('skips files >100KB')
  it('extracts context around matches')
  it('throws FetchError with details')
})
```

**ranker.test.ts** - Ranking algorithm
```typescript
describe('rankResults', () => {
  it('ranks by quality score correctly')
  it('returns top N results')
  it('gives higher scores to starred repos')
  it('gives higher scores to recent pushes')
  it('penalizes node_modules/dist paths')
})
```

**analyzer.test.ts** - Data extraction
```typescript
describe('extractFactualData', () => {
  it('counts languages correctly')
  it('extracts common imports (external only)')
  it('counts syntax occurrences')
  it('calculates averages correctly')
  it('handles empty files')
  it('handles files with no imports')
})
```

### Integration Test

**integration.test.ts** - Full workflow
```typescript
describe('full search workflow', () => {
  it('completes search → rank → fetch → analyze → format', async () => {
    // Mock Octokit responses
    // Execute full workflow
    // Verify markdown output format
    // Check all phases executed
  })

  it('handles zero results gracefully')
  it('handles rate limit during search')
  it('handles partial fetch failures')
})
```

### Edge Case Tests

**Context extraction (critical):**
- Unicode/emoji at boundaries
- Empty files
- Single-line files
- Files with only matches (no surrounding context)
- Very long lines (>10k chars)

**Error handling:**
- Auth failures at various stages
- Network timeouts
- Rate limit exhaustion mid-search
- Malformed API responses

---

## Comparison with ghx

| Feature | ghx | gh-code-search |
|---------|-----|----------------|
| **API** | Octokit | Octokit |
| **Auth** | gh CLI token | gh CLI token |
| **Search** | Sequential | Sequential |
| **Fetching** | Sequential | **Parallel** (Promise.all) |
| **Ranking** | GitHub order | **Quality score** (stars, recency, structure) |
| **Analysis** | None | **Factual extraction** (imports, syntax, metrics) |
| **Output** | Files to disk | **Stdout markdown** (Claude-optimized) |
| **Context** | Line boundaries | Line boundaries (same algorithm) |
| **Use Case** | CLI file retrieval | **Claude research workflow** |
| **Error Handling** | Basic | **Typed errors** with recovery suggestions |
| **Rate Limits** | Failure only | **Proactive warnings** + monitoring |

**What We Adopted from ghx:**
1. ✅ GitHub CLI auth pattern (`gh auth token`)
2. ✅ Text-match headers for fragments
3. ✅ Line-boundary context expansion algorithm
4. ✅ Graceful per-file error handling

**What We Improved:**
1. 🚀 Parallel file fetching (performance)
2. 🎯 Quality-based ranking (not just GitHub relevance)
3. 📊 Factual data extraction (for Claude analysis)
4. 📦 Stdout markdown output (Claude workflow)
5. 🛡️ Comprehensive error handling with typed errors
6. ⚠️ Proactive rate limit monitoring

**What We Simplified:**
1. No file I/O (stdout only)
2. No complex query parsing (Claude handles that)
3. No interactive mode (one-shot execution)

---

## Implementation Phases

### Phase 0: Pre-Implementation Prep 🎯
**Deliverables:**
- Review `@docs/CODING_STYLE.md` and `@docs/DEVELOPMENT_WORKFLOW.md`
- Consult `typescript-coding` skill for patterns and tooling
- Create feature branch: `feat/gh-code-search-skill`
- Set up workspace at `.claude/skills/gh-code-search/`

**Validation:**
- Branch created and checked out
- Workspace directory exists
- Standards documentation reviewed

---

### Phase 1: Foundation (FP-First) ⚡
**Deliverables:**
- Create directory structure
- Setup package.json (correct dependencies: octokit, chalk, ora)
- Configure tsconfig.json (NodeNext, strict mode)
- Setup ESLint with uba-eslint-config
- Create types.ts (interfaces + custom error classes)
- Create log.ts (DRY CLI logging utility)

**TypeScript Standards:**
- Use FP patterns (no classes except errors)
- Explicit naming (`contextLinesCount`, `maxFileSizeBytes`)
- Options objects for >3 params
- log.ts: Plain object with functions, no class/this

**Validation:**
- `pnpm typecheck` passes (no errors)
- Package structure matches spec
- Error classes extend Error correctly
- log.ts exports all utility functions

---

### Phase 2: GitHub Integration (Pure Functions + Side Effects) 🔌
**Deliverables:**
- Implement github.ts:
  - `getGitHubToken()` - auth with gh CLI (side effect)
  - `searchGitHubCode(token, query, options)` - search with pagination + text-match
  - `fetchCodeFiles(options)` - parallel fetch + context extraction
  - Rate limit monitoring throughout
- Comprehensive error handling (typed errors)
- WHY comments for complex logic
- Test with real GitHub API

**TypeScript Standards:**
- Isolate side effects (Octokit, execSync, console) at edges
- Pure functions for data transformation (buildSearchQuery, detectLanguage)
- Options objects: `FetchCodeFilesOptions`, `ExtractMatchesWithContextOptions`
- Explicit error context (repository, path, reset time)

**Validation:**
- Auth succeeds with gh CLI token
- Search returns results with text matches
- Parallel fetch works (all files or partial)
- Rate limit warnings appear when <10 remaining
- Errors are typed and actionable
- `pnpm typecheck` and `pnpm lint` pass

---

### Phase 3: Ranking & Analysis (Pure Transformations) 📊
**Deliverables:**
- Implement query.ts (optional helpers - pure functions)
- Implement ranker.ts (quality scoring - all pure)
- Implement analyzer.ts (factual extraction - pure)
- Add WHY comments explaining scoring weights
- Write unit tests for all modules

**TypeScript Standards:**
- All functions pure (no side effects)
- Immutable transformations (map/filter/reduce, no mutations)
- Explicit variable names (`pathLowercase`, `ageInDays`, `maxLogScore`)
- Tests tell a story: `it('ranks recent high-star repos above old low-star repos')`

**Validation:**
- High-quality results ranked first
- Factual data accurate (imports, syntax, metrics)
- No interpretive analysis (just counts/distributions)
- All tests pass (`pnpm test`)

---

### Phase 4: Orchestration & Output (Side Effects Composed) 🎭
**Deliverables:**
- Implement main.ts:
  - clack prompts (intro, spinner, outro)
  - Workflow orchestration (compose all modules)
  - Error handling with recovery suggestions
  - Clean markdown output to stdout
- Test complete workflow
- Use conventional commits: `feat(orchestration): add main workflow`

**TypeScript Standards:**
- CLI logging: chalk for colors, human-readable (not JSON)
- Error messages actionable (tell user how to fix)
- Composition over imperative code
- Follow Definition of Done (tests + docs + commit)

**Validation:**
- UX is smooth (progress indicators)
- Markdown output is clean (Claude-consumable)
- Errors are user-friendly
- Execution completes in <30s
- `pnpm typecheck` and `pnpm lint` pass

---

### Phase 5: Testing & Documentation (Definition of Done ✓) 📝
**Deliverables:**
- Write all unit tests (auth, github, ranker, analyzer)
- Write integration test (full workflow)
- Write SKILL.md (with integration notes, examples, usage)
- Manual testing with example queries
- Update README if needed
- Commit all changes with conventional commits

**TypeScript Standards:**
- Test names tell a story (see @docs/DEVELOPMENT_WORKFLOW.md)
- Update tests when behavior changes (don't force green)
- Mark slow tests as integration tests
- Documentation updated with feature

**Validation:**
- All tests pass (`pnpm test`)
- `pnpm typecheck` and `pnpm lint` pass
- SKILL.md follows format and includes allowed-tools
- Example queries work end-to-end
- Documentation accurate and complete
- Definition of Done ✓ checklist complete

---

## Success Criteria

**Functional:**
1. ✅ All tests pass (unit + integration)
2. ✅ Handles rate limits gracefully with user feedback
3. ✅ Works for any language/framework search
4. ✅ Factual data extraction is accurate
5. ✅ Markdown output is clean and Claude-consumable
6. ✅ Error messages are actionable (tell user how to fix)
7. ✅ Integration with Claude Code is documented
8. ✅ Example queries complete successfully (<30s)
9. ✅ No crashes on edge cases (Unicode, empty files, rate limits)
10. ✅ Claude can read output and perform analysis effectively

**Code Quality (TypeScript Standards):**
11. ✅ FP-first patterns (minimal OOP, pure functions, composition)
12. ✅ Options objects used for >3 params
13. ✅ Explicit, self-documenting names (includes units/domain terms)
14. ✅ WHY comments for complex logic (not HOW comments)
15. ✅ Typed errors with actionable context
16. ✅ Side effects isolated at module boundaries
17. ✅ Immutable data transformations
18. ✅ Tests tell a story (descriptive test names)
19. ✅ Conventional commits used throughout
20. ✅ Definition of Done ✓ met for each phase

---

## Future Enhancements (v2)

**Caching:**
- Add conf dependency back
- Cache search results for 24h
- Reduce API usage for repeat queries

**Advanced Ranking:**
- Code quality signals (tests, docs, CI badges)
- Maintainer reputation
- Issue/PR activity metrics
- Dependency health

**Interactive Mode:**
- Filter results post-fetch
- Drill into specific files
- Export to different formats

**Multi-language AST Parsing:**
- TypeScript: typescript-estree
- Python: tree-sitter-python
- Go: tree-sitter-go
- Deeper semantic analysis

**Performance:**
- Parallel search pagination (if API allows)
- Streaming results (show as fetched)
- Configurable timeout/limits

---

## Estimated Metrics

**Lines of Code:** ~850
**Files:** 7 modules + 6 test files
**Dependencies:** 3 (octokit, chalk, ora)
**Test Coverage Target:** >80%
**Typical Execution:** 10-30 seconds
**GitHub API Usage:** 5-15 requests per search

---

## References

- [ghx repository](https://github.com/johnlindquist/ghx) - Inspiration
- [Octokit documentation](https://octokit.github.io/rest.js/)
- [GitHub Search API](https://docs.github.com/en/rest/search)
- [GitHub CLI](https://cli.github.com/)
- [Claude Code Skills Documentation](https://docs.claude.com/en/docs/claude-code)

---

## Implementation Guidance

**Before Starting:**
1. 📖 Read `@docs/CODING_STYLE.md` (FP patterns, naming, comments, errors)
2. 📖 Read `@docs/DEVELOPMENT_WORKFLOW.md` (testing, commits, branching, Definition of Done)
3. 🎯 Invoke `typescript-coding` skill for stack decisions and best practices
4. 🔀 Create feature branch: `feat/gh-code-search-skill`

**During Implementation:**
1. ✅ Reference `typescript-coding` skill for TypeScript patterns
2. ✅ Follow FP-first approach (pure functions, composition, immutability)
3. ✅ Use options objects when functions have >3 params
4. ✅ Add WHY comments for complex logic (scoring weights, context extraction)
5. ✅ Use typed errors with actionable context
6. ✅ Write tests that tell a story
7. ✅ Make atomic commits with conventional format: `feat(module): description`
8. ✅ Run `pnpm typecheck && pnpm lint && pnpm test` before each commit

**After Each Phase:**
1. ✅ Verify phase validation criteria met
2. ✅ Run all checks (typecheck, lint, test)
3. ✅ Commit with conventional format
4. ✅ Update documentation if needed

**Before Completion:**
1. ✅ All Success Criteria met (functional + code quality)
2. ✅ Definition of Done ✓ checklist complete
3. ✅ SKILL.md written and accurate
4. ✅ Example queries tested end-to-end
5. ✅ Ready for integration with Claude Code

---

**Status:** Ready for implementation
**Philosophy:** Script fetches and extracts facts, Claude reads and analyzes
**Next Step:** Complete Phase 0 (review standards, create branch, set up workspace)
