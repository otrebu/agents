# GitHub Code Search Skill - Implementation Plan

> **Status:** Planning Phase
> **Created:** 2025-11-05
> **Estimated Effort:** 1-2 days
> **Inspiration:** [johnlindquist/ghx](https://github.com/johnlindquist/ghx)

## Overview

Build a Claude Code skill that searches GitHub code and provides AI-powered pattern analysis. Unlike existing tools like ghx (which just fetches code), this skill will rank results by quality, analyze patterns across files, identify best practices, and generate actionable recommendations.

**Key Differentiators:**
- Uses Octokit API (modern, not legacy search)
- Ranks by stars, recency, code quality
- Parallel file fetching (ghx is sequential)
- Pattern detection across results
- Best practice identification
- Optimized for Claude workflow (stdout output)

---

## Project Structure

```
.claude/skills/gh-code-search/
├── SKILL.md                      # Skill manifest
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── scripts/
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── auth.ts                   # GitHub authentication
│   ├── search.ts                 # Octokit search wrapper
│   ├── query-builder.ts          # Query intelligence
│   ├── ranker.ts                 # Result scoring
│   ├── fetcher.ts                # Parallel file fetching
│   ├── analyzer.ts               # Pattern detection
│   ├── formatter.ts              # Markdown output
│   └── main.ts                   # Entry point orchestrator
└── __tests__/
    ├── query-builder.test.ts
    ├── ranker.test.ts
    ├── analyzer.test.ts
    └── fetcher.test.ts
```

---

## Dependencies

### package.json

```json
{
  "name": "gh-code-search",
  "version": "1.0.0",
  "type": "module",
  "description": "Search & analyze GitHub code with AI-powered pattern detection",
  "scripts": {
    "search": "tsx scripts/main.ts",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@octokit/rest": "^20.0.2",
    "@clack/prompts": "^0.7.0",
    "chalk": "^5.3.0",
    "conf": "^12.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "vitest": "^1.2.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
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

---

## Core Modules

### 1. types.ts - Type Definitions

```typescript
// Core types for the entire system

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
  contextLines: number
}

export interface Pattern {
  name: string
  description: string
  frequency: number
  percentage: number
  codeSnippet: string
  files: string[]
}

export interface BestPractice {
  title: string
  description: string
  example?: string
}

export interface AnalysisReport {
  totalFiles: number
  totalLines: number
  patterns: Pattern[]
  bestPractices: BestPractice[]
  antiPatterns: BestPractice[]
  commonImports: Array<{ import: string; count: number }>
  recommendations: string[]
}

export interface SearchStats {
  query: string
  totalResults: number
  analyzedFiles: number
  executionTimeMs: number
}
```

### 2. auth.ts - GitHub Authentication

**Pattern:** Adopted from ghx - delegates auth to gh CLI

```typescript
import { execSync } from 'child_process'
import { cancel } from '@clack/prompts'

/**
 * Get GitHub token from gh CLI
 * Falls back to login flow if not authenticated
 */
export async function getGitHubToken(): Promise<string> {
  try {
    const token = execSync('gh auth token', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim()

    if (token && token.length > 0) {
      return token
    }

    cancel('GitHub CLI not authenticated')
    console.log('\nRun: gh auth login --web\n')
    process.exit(1)

  } catch (error) {
    cancel('GitHub CLI not found or authentication failed')
    console.log('\nInstall gh CLI: https://cli.github.com/')
    console.log('Then run: gh auth login --web\n')
    process.exit(1)
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
```

### 3. search.ts - Octokit Search

**Key Features:**
- Uses text-match headers (ghx pattern)
- Handles pagination automatically
- Rate limit error handling

```typescript
import { Octokit } from '@octokit/rest'
import type { SearchOptions, RawSearchResult, SearchResult } from './types.js'

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

      const results = response.data.items as unknown as RawSearchResult[]
      allResults = allResults.concat(results)

      if (results.length < perPage) break

      remaining -= results.length
      page++

    } catch (error: any) {
      if (error.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Wait a few minutes.')
      }
      throw new Error(`Search failed: ${error.message}`)
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
```

### 4. query-builder.ts - Query Intelligence

**Pattern Library:** Maps natural language to GitHub qualifiers

```typescript
import type { SearchOptions } from './types.js'

interface QueryIntent {
  query: string
  options: SearchOptions
}

const PATTERNS: Record<string, Partial<SearchOptions>> = {
  'react hook': { language: 'typescript', extension: 'tsx' },
  'react component': { language: 'typescript', extension: 'tsx' },
  'express': { language: 'javascript', filename: 'server|app|routes' },
  'eslint config': { filename: '.eslintrc' },
  'typescript config': { filename: 'tsconfig.json' },
  'dockerfile': { filename: 'Dockerfile' },
  'github actions': { path: '.github/workflows', extension: 'yml' },
  'django': { language: 'python', filename: 'views|models' },
  'go': { language: 'go' },
}

const ENHANCED_KEYWORDS: Record<string, string> = {
  'custom hook': 'use function export',
  'error handling': 'try catch error throw',
  'authentication': 'auth login token jwt',
  'api': 'fetch request response',
}

export function buildQueryIntent(userQuery: string): QueryIntent {
  const lowerQuery = userQuery.toLowerCase()
  let options: SearchOptions = { limit: 100 }
  let query = userQuery

  for (const [pattern, opts] of Object.entries(PATTERNS)) {
    if (lowerQuery.includes(pattern)) {
      options = { ...options, ...opts }
      break
    }
  }

  for (const [keyword, enhancement] of Object.entries(ENHANCED_KEYWORDS)) {
    if (lowerQuery.includes(keyword)) {
      query = `${query} ${enhancement}`
      break
    }
  }

  const repoMatch = userQuery.match(/(?:in|from|repo:?)\s+([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)/i)
  if (repoMatch) {
    options.repo = repoMatch[1]
    query = query.replace(repoMatch[0], '').trim()
  }

  return { query, options }
}
```

### 5. ranker.ts - Quality Scoring

**Formula:** stars(40%) + relevance(30%) + recency(20%) + codeQuality(10%)

```typescript
import type { SearchResult, RankedResult } from './types.js'

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

function calculateQualityScore(result: SearchResult): number {
  const starsScore = calculateStarsScore(result.stars)
  const relevanceScore = normalizeScore(result.score, 0, 100)
  const recencyScore = calculateRecencyScore(result.lastPushed)
  const codeQualityScore = calculateCodeQualityScore(result)

  return (
    starsScore * 0.4 +
    relevanceScore * 0.3 +
    recencyScore * 0.2 +
    codeQualityScore * 0.1
  )
}

function calculateStarsScore(stars: number): number {
  if (stars === 0) return 0.1
  const logStars = Math.log10(stars + 1)
  return Math.min(logStars / 5, 1)
}

function calculateRecencyScore(lastPushed: string): number {
  const now = Date.now()
  const pushedAt = new Date(lastPushed).getTime()
  const ageInDays = (now - pushedAt) / (1000 * 60 * 60 * 24)

  if (ageInDays < 7) return 1.0
  if (ageInDays < 30) return 0.9
  if (ageInDays < 90) return 0.7
  if (ageInDays < 180) return 0.5
  if (ageInDays < 365) return 0.3
  return 0.2
}

function calculateCodeQualityScore(result: SearchResult): number {
  let score = 0.5
  const path = result.path.toLowerCase()

  if (path.includes('/src/') || path.includes('/lib/')) score += 0.2
  if (path.endsWith('.ts') || path.endsWith('.tsx')) score += 0.1
  if (path.includes('/components/') || path.includes('/hooks/')) score += 0.1

  if (path.includes('node_modules')) score -= 0.5
  if (path.includes('/dist/') || path.includes('/build/')) score -= 0.3
  if (path.split('/').length < 3) score -= 0.2

  return Math.max(0, Math.min(1, score))
}

function normalizeScore(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}
```

### 6. fetcher.ts - Parallel File Fetching

**Improvement over ghx:** Uses `Promise.all()` for parallel fetching

```typescript
import { Octokit } from '@octokit/rest'
import type { RankedResult, CodeFile } from './types.js'

export async function fetchCodeFiles(
  token: string,
  results: RankedResult[],
  maxFiles = 10,
  contextLines = 20
): Promise<CodeFile[]> {
  const octokit = new Octokit({ auth: token })

  const fetchPromises = results.slice(0, maxFiles).map(result =>
    fetchSingleFile(octokit, result, contextLines)
  )

  const settled = await Promise.allSettled(fetchPromises)

  return settled
    .filter((r): r is PromiseFulfilledResult<CodeFile> => r.status === 'fulfilled')
    .map(r => r.value)
}

async function fetchSingleFile(
  octokit: Octokit,
  result: RankedResult,
  contextLines: number
): Promise<CodeFile> {
  try {
    const [owner, repo] = result.repository.split('/')

    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: result.path,
      mediaType: { format: 'raw' }
    })

    const content = response.data as unknown as string

    const processedContent = result.textMatches.length > 0
      ? extractMatchesWithContext(content, result.textMatches, contextLines)
      : content

    const language = detectLanguage(result.path)

    return {
      repository: result.repository,
      path: result.path,
      url: result.url,
      content: processedContent,
      lines: processedContent.split('\n').length,
      language,
      stars: result.stars,
      rank: result.rank,
      contextLines
    }

  } catch (error: any) {
    throw new Error(`Failed to fetch ${result.repository}/${result.path}: ${error.message}`)
  }
}

// Context extraction logic (ghx pattern)
function extractMatchesWithContext(
  content: string,
  textMatches: TextMatch[],
  contextLines: number
): string {
  const fragments: string[] = []

  for (const match of textMatches) {
    if (match.property !== 'content') continue

    const fragment = match.fragment
    const fragmentIndex = content.indexOf(fragment)

    if (fragmentIndex === -1) {
      fragments.push(fragment)
      continue
    }

    // Line-boundary context expansion (ghx pattern)
    let startPos = content.lastIndexOf('\n', fragmentIndex)
    if (startPos === -1) startPos = 0
    let endPos = content.indexOf('\n', fragmentIndex + fragment.length)
    if (endPos === -1) endPos = content.length

    let contextStart = startPos
    let lineCount = 0
    while (lineCount < contextLines && contextStart > 0) {
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
    while (lineCount < contextLines && contextEnd < content.length) {
      const nextNewline = content.indexOf('\n', contextEnd + 1)
      if (nextNewline === -1) {
        contextEnd = content.length
        break
      }
      contextEnd = nextNewline
      lineCount++
    }

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
  }

  return langMap[ext] || ext
}
```

### 7. analyzer.ts - Pattern Detection (SECRET SAUCE)

**This is what sets us apart from ghx!**

```typescript
import type { CodeFile, Pattern, BestPractice, AnalysisReport } from './types.js'

export function analyzePatterns(files: CodeFile[]): AnalysisReport {
  const totalLines = files.reduce((sum, f) => sum + f.lines, 0)

  return {
    totalFiles: files.length,
    totalLines,
    patterns: detectPatterns(files),
    bestPractices: identifyBestPractices(files),
    antiPatterns: identifyAntiPatterns(files),
    commonImports: extractCommonImports(files),
    recommendations: generateRecommendations(files)
  }
}

function detectPatterns(files: CodeFile[]): Pattern[] {
  const patterns: Pattern[] = []

  const cleanupPattern = detectCleanupPattern(files)
  if (cleanupPattern) patterns.push(cleanupPattern)

  const errorPattern = detectErrorHandlingPattern(files)
  if (errorPattern) patterns.push(errorPattern)

  const genericsPattern = detectGenericsPattern(files)
  if (genericsPattern) patterns.push(genericsPattern)

  const asyncPattern = detectAsyncPattern(files)
  if (asyncPattern) patterns.push(asyncPattern)

  return patterns.filter(p => p.frequency > 0)
}

function detectCleanupPattern(files: CodeFile[]): Pattern | null {
  const regex = /useEffect\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?return\s*\(\s*\)\s*=>/g
  const matchingFiles: string[] = []
  let bestExample = ''

  for (const file of files) {
    const matches = file.content.match(regex)
    if (matches && matches.length > 0) {
      matchingFiles.push(`${file.repository}/${file.path}`)
      if (!bestExample && matches[0].length < 300) {
        bestExample = matches[0].trim()
      }
    }
  }

  if (matchingFiles.length === 0) return null

  return {
    name: 'useEffect with Cleanup',
    description: 'Effect hooks that properly clean up subscriptions/timers',
    frequency: matchingFiles.length,
    percentage: Math.round((matchingFiles.length / files.length) * 100),
    codeSnippet: bestExample || 'useEffect(() => {\n  // setup\n  return () => {\n    // cleanup\n  }\n}, [deps])',
    files: matchingFiles.slice(0, 3)
  }
}

// Similar pattern detection functions for:
// - Error handling (try/catch vs .catch())
// - TypeScript generics
// - Async/await vs promises

function extractCommonImports(files: CodeFile[]): Array<{ import: string; count: number }> {
  const importMap = new Map<string, number>()

  for (const file of files) {
    const imports = file.content.match(/import\s+.+\s+from\s+['"]([^'"]+)['"]/g)
    if (!imports) continue

    for (const imp of imports) {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/)
      if (match) {
        const pkg = match[1]
        importMap.set(pkg, (importMap.get(pkg) || 0) + 1)
      }
    }
  }

  return Array.from(importMap.entries())
    .map(([imp, count]) => ({ import: imp, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function identifyBestPractices(files: CodeFile[]): BestPractice[] {
  const practices: BestPractice[] = []

  const tsFiles = files.filter(f => ['typescript', 'tsx'].includes(f.language))
  if (tsFiles.length / files.length > 0.7) {
    practices.push({
      title: 'Strong TypeScript adoption',
      description: `${Math.round((tsFiles.length / files.length) * 100)}% of files use TypeScript`
    })
  }

  const errorHandling = files.filter(f =>
    f.content.includes('try') || f.content.includes('.catch(')
  ).length
  if (errorHandling / files.length > 0.6) {
    practices.push({
      title: 'Comprehensive error handling',
      description: 'Most implementations include explicit error handling'
    })
  }

  return practices
}

function identifyAntiPatterns(files: CodeFile[]): BestPractice[] {
  const antiPatterns: BestPractice[] = []

  const tsIgnoreCount = files.filter(f =>
    f.content.includes('@ts-ignore')
  ).length
  if (tsIgnoreCount > files.length * 0.3) {
    antiPatterns.push({
      title: 'Excessive type suppression',
      description: `${tsIgnoreCount} files use @ts-ignore`
    })
  }

  return antiPatterns
}

function generateRecommendations(files: CodeFile[]): string[] {
  const recs: string[] = []

  if (files.some(f => f.content.includes('return () =>'))) {
    recs.push('Use cleanup functions in useEffect for subscriptions')
  }

  if (files.some(f => /function\s+\w+</.test(f.content))) {
    recs.push('Consider using generics for type-safe reusable functions')
  }

  return recs
}
```

### 8. formatter.ts - Markdown Output

```typescript
import type { AnalysisReport, CodeFile, SearchStats } from './types.js'

export function formatReport(
  analysis: AnalysisReport,
  files: CodeFile[],
  stats: SearchStats
): string {
  const sections: string[] = []

  sections.push(`# GitHub Code Search Results\n`)
  sections.push(`**Query:** \`${stats.query}\``)
  sections.push(`**Found:** ${stats.totalResults} results, analyzed top ${stats.analyzedFiles}`)
  sections.push(`**Time:** ${(stats.executionTimeMs / 1000).toFixed(1)}s\n`)
  sections.push('---\n')

  if (analysis.patterns.length > 0) {
    sections.push('## 📊 Common Patterns\n')
    for (const pattern of analysis.patterns) {
      sections.push(`### ${pattern.name} (${pattern.frequency}/${analysis.totalFiles} files)\n`)
      sections.push(`${pattern.description}\n`)
      if (pattern.codeSnippet) {
        sections.push('```' + (files[0]?.language || 'typescript'))
        sections.push(pattern.codeSnippet)
        sections.push('```\n')
      }
    }
    sections.push('---\n')
  }

  sections.push('## 🌟 Top Examples\n')
  for (const file of files.slice(0, 5)) {
    sections.push(`### ${file.rank}. [${file.repository}](${file.url}) ⭐ ${formatStars(file.stars)}`)
    sections.push(`**${file.path}** (${file.lines} lines)\n`)

    const snippet = file.content.split('\n').slice(0, 15).join('\n')
    sections.push('```' + file.language)
    sections.push(snippet)
    if (file.lines > 15) sections.push('// ... more code ...')
    sections.push('```\n')
  }
  sections.push('---\n')

  if (analysis.bestPractices.length > 0) {
    sections.push('## ✅ Best Practices Identified\n')
    for (const practice of analysis.bestPractices) {
      sections.push(`- **${practice.title}**: ${practice.description}`)
    }
    sections.push('')
  }

  if (analysis.recommendations.length > 0) {
    sections.push('## 💡 Recommendations\n')
    for (const rec of analysis.recommendations) {
      sections.push(`- ${rec}`)
    }
    sections.push('')
  }

  sections.push('---\n')
  sections.push(`**Analysis:** ${analysis.totalFiles} files, ${analysis.totalLines.toLocaleString()} total lines\n`)

  return sections.join('\n')
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`
  }
  return stars.toString()
}
```

### 9. main.ts - Orchestrator

```typescript
#!/usr/bin/env node

import { intro, outro, spinner, cancel, note } from '@clack/prompts'
import chalk from 'chalk'
import { getGitHubToken } from './auth.js'
import { searchGitHubCode } from './search.js'
import { buildQueryIntent } from './query-builder.js'
import { rankResults } from './ranker.js'
import { fetchCodeFiles } from './fetcher.js'
import { analyzePatterns } from './analyzer.js'
import { formatReport } from './formatter.js'
import type { SearchStats } from './types.js'

async function main() {
  const startTime = Date.now()

  intro(chalk.bold('🔍 GitHub Code Search'))

  try {
    const userQuery = process.argv.slice(2).join(' ')
    if (!userQuery || userQuery.trim().length === 0) {
      cancel('No query provided')
      console.log('\nUsage: pnpm search "your search query"\n')
      process.exit(1)
    }

    const s = spinner()
    s.start('Authenticating with GitHub...')
    const token = await getGitHubToken()
    s.stop('Authenticated ✓')

    const { query, options } = buildQueryIntent(userQuery)
    note(`Query: "${query}"\nFilters: ${JSON.stringify(options, null, 2)}`, 'Search Parameters')

    s.start('Searching GitHub...')
    const results = await searchGitHubCode(token, query, options)
    s.stop(`Found ${results.length} results ✓`)

    if (results.length === 0) {
      cancel('No results found')
      process.exit(0)
    }

    s.start('Ranking by quality...')
    const ranked = rankResults(results, 10)
    s.stop(`Top ${ranked.length} selected ✓`)

    s.start(`Fetching code from ${ranked.length} files...`)
    const files = await fetchCodeFiles(token, ranked, 10, 20)
    s.stop(`Fetched ${files.length} files ✓`)

    s.start('Analyzing patterns...')
    const analysis = analyzePatterns(files)
    s.stop(`Found ${analysis.patterns.length} patterns ✓`)

    const stats: SearchStats = {
      query: userQuery,
      totalResults: results.length,
      analyzedFiles: files.length,
      executionTimeMs: Date.now() - startTime
    }

    const report = formatReport(analysis, files, stats)

    outro(chalk.green('Analysis complete! 🎉'))
    console.log('\n' + report)

  } catch (error: any) {
    cancel(`Error: ${error.message}`)
    console.error('\n', error)
    process.exit(1)
  }
}

main()
```

---

## SKILL.md

```markdown
---
name: gh-code-search
description: Search & analyze GitHub code using Octokit API. Use for all-purpose code search: learning patterns (React hooks, error handling), API/library usage research (Stripe, Anthropic), finding reusable snippets/configs (ESLint, tsconfig), architectural exploration. Translates natural language to GitHub search qualifiers, ranks by quality (stars, recency, code quality), fetches full code with context, analyzes patterns across results, identifies best practices and anti-patterns. One-shot execution with comprehensive markdown analysis report.
allowed-tools: Bash(gh auth:*), Bash(pnpm tsx:scripts/main.ts:*), Bash(pnpm install:*)
---

# GitHub Code Search

Search & analyze real-world code examples from GitHub with AI-powered pattern detection.

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

- Learning patterns: "React custom hooks examples"
- API research: "How to use Anthropic API?"
- Config files: "ESLint configs for TypeScript"
- Architecture: "Repository pattern in TypeScript"

## Output

Markdown report with:
- Common patterns with frequency & code snippets
- Top examples from popular repos (with stars)
- Best practices & anti-patterns
- Recommendations

## Typical Execution

15-30 seconds
```

---

## Workflow Diagram

```
User Query: "React custom hooks"
       ↓
┌──────────────────────────────────┐
│ 1. Query Builder                 │
│    NL → GitHub qualifiers        │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│ 2. Search GitHub                 │
│    Octokit API + text-match      │
│    Returns: 127 results          │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│ 3. Rank Results                  │
│    Score: stars(40%) + more      │
│    Select top 10                 │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│ 4. Fetch Files (Parallel)       │
│    Promise.all([...])            │
│    Extract context lines         │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│ 5. Analyze Patterns              │
│    Detect patterns, imports      │
│    Identify best practices       │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│ 6. Format Report                 │
│    Generate markdown             │
│    Output to stdout              │
└──────────────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create skill directory structure
- [ ] Set up package.json with dependencies
- [ ] Configure tsconfig.json
- [ ] Create types.ts with all interfaces

### Phase 2: Core Modules
- [ ] Implement auth.ts (gh CLI auth)
- [ ] Implement search.ts (Octokit wrapper)
- [ ] Implement query-builder.ts (NL → qualifiers)
- [ ] Test basic search functionality

### Phase 3: Intelligence
- [ ] Implement ranker.ts (quality scoring)
- [ ] Implement fetcher.ts (parallel fetching)
- [ ] Test ranking algorithm
- [ ] Test file fetching

### Phase 4: Analysis
- [ ] Implement analyzer.ts (pattern detection)
- [ ] Add cleanup pattern detection
- [ ] Add error handling detection
- [ ] Add generics detection
- [ ] Add best practice identification
- [ ] Add anti-pattern detection

### Phase 5: Output
- [ ] Implement formatter.ts (markdown)
- [ ] Implement main.ts (orchestrator)
- [ ] Add clack prompts for UX
- [ ] Test complete workflow

### Phase 6: Documentation & Testing
- [ ] Write SKILL.md
- [ ] Add unit tests (query-builder, ranker, analyzer)
- [ ] Manual testing with real queries
- [ ] Validate skill structure
- [ ] Update README

---

## Test Queries

**For validation:**
1. "React custom hooks examples"
2. "Express error handling middleware"
3. "TypeScript ESLint config"
4. "Go error handling patterns"
5. "Python FastAPI authentication"

**Expected behavior:**
- Returns relevant results (>5 files)
- Completes in <30s
- Patterns identified correctly
- Output readable & actionable
- Errors handled gracefully

---

## Comparison: This Skill vs ghx

| Feature | ghx | gh-code-search |
|---------|-----|----------------|
| API | Octokit | Octokit |
| Auth | gh CLI token | gh CLI token |
| Search | Sequential | Sequential |
| Fetching | Sequential | **Parallel** |
| Ranking | GitHub order | **Quality score** |
| Analysis | None | **Pattern detection** |
| Best Practices | None | **Identified** |
| Output | Files | **Stdout markdown** |
| Context | Line boundaries | Line boundaries |
| Use Case | Find code | **Understand code** |

---

## Key Learnings from ghx

**What we adopted:**
1. GitHub CLI auth pattern (`gh auth token`)
2. Text-match headers for fragments
3. Line-boundary context expansion
4. Simple query string concatenation
5. Graceful per-file error handling
6. Markdown output format

**What we improved:**
1. Parallel file fetching (Promise.all)
2. Result ranking by quality
3. Pattern analysis across files
4. Best practice identification
5. Stdout output for Claude

---

## Estimated Metrics

**Lines of Code:** ~1,500
**Files:** 15
**Dependencies:** 4 (octokit, clack, chalk, conf)
**Implementation Time:** 1-2 days
**Typical Execution:** 15-30 seconds
**GitHub API Usage:** 10-15 requests per search

---

## Future Enhancements

**Phase 2 (future):**
- [ ] AST parsing for deeper analysis
- [ ] Result caching
- [ ] Interactive refinement mode
- [ ] Support for private repos
- [ ] More language-specific patterns
- [ ] Configurable analysis depth
- [ ] Export to different formats

**Phase 3 (future):**
- [ ] Machine learning for pattern detection
- [ ] Automatic refactoring suggestions
- [ ] Integration with other skills
- [ ] Web UI for results

---

## References

- [ghx repository](https://github.com/johnlindquist/ghx)
- [Octokit documentation](https://octokit.github.io/rest.js/)
- [GitHub Search API](https://docs.github.com/en/rest/search)
- [GitHub CLI](https://cli.github.com/)

---

**Status:** Ready for implementation
**Next Step:** Create skill directory and install dependencies
