# Parallel Search Skill - Implementation Plan

> **Status:** Planning Phase
> **Created:** 2025-11-10
> **Estimated Effort:** ~1000 LOC
> **Inspiration:** [Parallel Search API](https://parallel.ai/blog/introducing-parallel-search)
> **Replaces:** gemini-research skill (unreliable)

---

## Overview

Build a Claude Code skill that **provides comprehensive web research via Parallel's Search API**. The skill uses the `parallel-web` TypeScript SDK to execute searches and return LLM-ready content with ranked URLs and extended webpage excerpts (up to 30K chars per result).

This is the **primary web research tool** for Claude Code, replacing gemini-research.

### Philosophy: Comprehensive Research via AI-Optimized Search

**This skill is designed for:**
- ✅ Deep multi-source research and analysis
- ✅ Complex topic exploration with multiple perspectives
- ✅ Current events and recent developments
- ✅ Technical documentation and best practices
- ✅ Comparative analysis across sources
- ✅ Academic and professional research
- ✅ Fact-checking with source attribution

**Key Advantages:**
- **Extended excerpts:** Up to 30K chars per result (vs typical search APIs: ~200 chars)
- **LLM-ready formatting:** Pre-processed for optimal Claude consumption
- **Intelligent ranking:** AI-optimized relevance scoring
- **Multi-search orchestration:** Claude runs multiple targeted searches and aggregates results
- **Rich metadata:** Titles, URLs, domains, relevance indicators
- **Persistent research:** Save comprehensive reports to docs/research/

---

## Division of Labor

### Script Responsibilities (Tool Implementation)

1. **Authentication:** Validate `PARALLEL_API_KEY` environment variable
2. **API Integration:** Use `parallel-web` SDK's `beta.search()` method
3. **Request Construction:** Build search requests with configurable parameters
4. **Error Handling:** Handle auth failures, rate limits, network errors
5. **Response Formatting:** Return clean markdown with:
   - Search results with URLs and extended excerpts
   - Source metadata (titles, domains, relevance scores)
   - Result deduplication tracking
   - Search metadata (query, execution time, result count)
6. **Factual Output:** Present data without interpretation

### Claude's Multi-Search Orchestration

**Claude executes sophisticated research workflows:**

1. **Research Strategy Planning:**
   - Analyze user's research question
   - Identify key aspects requiring investigation
   - Plan 3-5 targeted search queries covering different angles
   - Consider complementary search strategies

2. **Sequential Search Execution:**
   - Run initial broad search to understand landscape
   - Execute targeted follow-up searches based on initial findings
   - Adapt search objectives based on intermediate results
   - Track discovered domains and source diversity

3. **Result Aggregation & Deduplication:**
   - Combine results from multiple searches
   - Deduplicate by URL
   - Track which queries found each result (relevance indicator)
   - Maintain source diversity (avoid over-reliance on single domain)

4. **Deep Analysis:**
   - Read all excerpts (30K chars each = substantial content)
   - Extract key claims and evidence
   - Identify consensus vs divergent views
   - Note source credibility indicators (official docs, academic, news, etc.)

5. **Synthesis & Reporting:**
   - Combine findings into comprehensive answer
   - Structure with clear sections and subsections
   - Cite sources with direct URLs
   - Note confidence levels and gaps
   - Highlight trade-offs and different perspectives

6. **Persistent Research:**
   - Save comprehensive research reports to `docs/research/parallel/`
   - Timestamped markdown files for future reference
   - Build searchable knowledge base

---

## Example Workflows

### Workflow 1: Deep Technical Research

**User:** "Research best practices for building production-ready RAG systems"

**Claude's Research Strategy:**
1. Identifies: Complex technical topic requiring multiple perspectives
2. Plans multi-search strategy:
   - Search 1: "Production RAG system architecture best practices"
   - Search 2: "RAG chunking strategies and embedding models"
   - Search 3: "RAG evaluation metrics and benchmarking"
   - Search 4: "RAG system challenges and solutions"

**Execution:**

**Search 1 - Architecture:**
```bash
pnpm tsx scripts/search.ts \
  --objective "Production RAG system architecture best practices" \
  --processor pro --max-results 10
```
- Returns 10 results with extended excerpts
- Sources: blogs, documentation, technical articles

**Search 2 - Chunking:**
```bash
pnpm tsx scripts/search.ts \
  --objective "RAG chunking strategies and embedding models comparison" \
  --queries "chunking strategies RAG" "semantic chunking" \
  --processor pro --max-results 10
```
- Returns focused results on chunking approaches
- Identifies: fixed-size, semantic, hierarchical methods

**Search 3 - Evaluation:**
```bash
pnpm tsx scripts/search.ts \
  --objective "RAG evaluation metrics and benchmarking methods" \
  --processor pro --max-results 10
```
- Returns academic and practical evaluation approaches

**Search 4 - Challenges:**
```bash
pnpm tsx scripts/search.ts \
  --objective "Common RAG system challenges and solutions in production" \
  --processor pro --max-results 10
```
- Returns real-world deployment experiences

**Claude's Analysis & Synthesis:**
1. Reads ~40 unique sources (30K chars each = massive content)
2. Identifies patterns:
   - Architecture: Vector DB + LLM + retrieval layer
   - Chunking: Consensus favors semantic over fixed-size
   - Evaluation: Multiple metrics needed (relevance, faithfulness, answer quality)
   - Challenges: Context window limits, retrieval precision, latency
3. Synthesizes comprehensive report with:
   - Architecture recommendations
   - Trade-offs comparison table
   - Step-by-step implementation guide
   - All sources cited with URLs
4. Saves to `docs/research/parallel/20251110143052-rag-best-practices.md`

---

### Workflow 2: Comparative Analysis

**User:** "Compare Next.js App Router vs Pages Router for a large e-commerce site"

**Claude's Strategy:**
1. Multi-faceted comparison needed
2. Plans 4 searches:
   - Search 1: "Next.js App Router vs Pages Router comparison"
   - Search 2: "App Router performance and scalability"
   - Search 3: "Pages Router production use cases"
   - Search 4: "Next.js e-commerce migration experiences"

**Execution:**
- 4 sequential searches with adaptive queries
- ~35 unique sources across official docs, blogs, case studies
- Extended excerpts include code examples and benchmarks

**Claude's Synthesis:**
1. Creates comparison matrix:
   - Performance: App Router (streaming) vs Pages Router (traditional SSR)
   - Developer experience: App Router (simpler) vs Pages Router (more control)
   - Migration cost: Depends on codebase size
   - Community maturity: Pages Router more established
2. Analyzes e-commerce specific concerns:
   - Product pages: Both work, App Router better for streaming
   - Cart/checkout: Pages Router more predictable
   - SEO: Equivalent
3. Provides recommendation with rationale
4. Cites 15+ sources across official docs, benchmarks, case studies
5. Saves comprehensive comparison report

---

### Workflow 3: Current Developments Research

**User:** "What are the latest developments in AI coding assistants?"

**Claude's Strategy:**
1. Broad + specific searches:
   - Search 1: "Latest AI coding assistant developments 2025"
   - Search 2: "GitHub Copilot recent updates features"
   - Search 3: "Claude Code Cursor new features"
   - Search 4: "AI coding assistant benchmarks evaluation"

**Execution:**
- Parallel Search prioritizes recent content
- Finds: blog posts, release notes, technical papers
- Extended excerpts include feature descriptions and comparisons

**Claude's Synthesis:**
1. Chronological timeline of recent updates
2. Feature comparison across assistants
3. Trend analysis (multi-file editing, autonomous agents, etc.)
4. Performance benchmarks where available
5. All sources cited with publication dates
6. Saves to research directory for reference

---

### Workflow 4: Learning New Framework

**User:** "I need to learn SolidStart - give me a comprehensive guide"

**Claude's Strategy:**
1. Learning-focused searches:
   - Search 1: "SolidStart official documentation getting started"
   - Search 2: "SolidStart routing and data loading patterns"
   - Search 3: "SolidStart vs Next.js comparison"
   - Search 4: "SolidStart production deployment best practices"
   - Search 5: "SolidStart example projects tutorials"

**Execution:**
- 5 searches covering learning path
- Official docs + tutorials + comparisons + real examples
- Extended excerpts provide substantial learning material

**Claude's Synthesis:**
1. Structured learning guide:
   - Introduction (what is SolidStart, why use it)
   - Core concepts (reactivity, server functions, routing)
   - Getting started (setup, project structure)
   - Key patterns (data loading, mutations, SSR)
   - Comparison with familiar frameworks
   - Deployment guide
   - Learning resources with URLs
2. Code examples from multiple sources
3. Common gotchas and solutions
4. Saves comprehensive learning guide

---

## Project Structure

```
plugins/knowledge-work/skills/parallel-search/
├── SKILL.md                      # Skill manifest with frontmatter
├── package.json                  # Dependencies: parallel-web, chalk, ora
├── tsconfig.json                 # TypeScript config (NodeNext, ESM)
├── .gitignore                    # node_modules, dist
├── .eslintrc.json               # ESLint config
├── scripts/
│   ├── search.ts                 # Main CLI entry point
│   ├── parallel-client.ts        # Parallel API wrapper
│   ├── types.ts                  # TypeScript interfaces
│   ├── log.ts                    # Logging utilities (CLI output)
│   ├── formatter.ts              # Result formatting (markdown)
│   └── deduplicator.ts           # URL deduplication logic
└── __tests__/
    ├── formatter.test.ts         # Formatting tests
    └── deduplicator.test.ts      # Deduplication tests
```

---

## Implementation Phases

### Phase 1: Core Infrastructure

**Files:** `types.ts`, `log.ts`, `parallel-client.ts`

**types.ts:**
```typescript
export interface SearchOptions {
  objective?: string
  searchQueries?: string[]
  processor?: 'lite' | 'base' | 'pro' | 'ultra'
  maxResults?: number
  maxCharsPerResult?: number
}

export interface SearchResult {
  url: string
  title: string
  excerpt: string
  rank: number
}

export class ParallelSearchError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'ParallelSearchError'
  }
}

export class AuthError extends ParallelSearchError {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class RateLimitError extends ParallelSearchError {
  constructor(message: string, public resetAt?: Date) {
    super(message)
    this.name = 'RateLimitError'
  }
}
```

**log.ts:**
```typescript
import chalk from 'chalk'

export const log = {
  header: (msg: string) => console.log(chalk.bold.cyan(msg)),
  success: (msg: string) => console.log(chalk.green('✓ ' + msg)),
  error: (msg: string) => console.error(chalk.red('✗ ' + msg)),
  warn: (msg: string) => console.warn(chalk.yellow('⚠ ' + msg)),
  info: (msg: string) => console.log(chalk.blue('ℹ ' + msg)),
  dim: (msg: string) => console.log(chalk.dim(msg)),
  plain: (msg: string) => console.log(msg),
}
```

**parallel-client.ts:**
```typescript
import Parallel from 'parallel-web'
import { AuthError, RateLimitError, ParallelSearchError } from './types.js'
import type { SearchOptions, SearchResult } from './types.js'

export async function executeSearch(options: SearchOptions): Promise<SearchResult[]> {
  // Validate API key
  const apiKey = process.env.PARALLEL_API_KEY
  if (!apiKey) {
    throw new AuthError('PARALLEL_API_KEY environment variable not set')
  }

  // Initialize client
  const client = new Parallel({ apiKey })

  try {
    // Execute search
    const response = await client.beta.search({
      objective: options.objective,
      search_queries: options.searchQueries,
      processor: options.processor || 'pro',  // Default to 'pro' for research quality
      max_results: options.maxResults || 15,
      max_chars_per_result: options.maxCharsPerResult || 5000,  // Larger excerpts for deep research
    })

    // Transform response to our format
    return transformResults(response)
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      throw new AuthError('Invalid API key or unauthorized access')
    }
    if (error.status === 429) {
      throw new RateLimitError('Rate limit exceeded', error.resetAt)
    }
    throw new ParallelSearchError('Search failed', error)
  }
}

function transformResults(response: any): SearchResult[] {
  // Transform Parallel API response to our SearchResult format
  // Implementation depends on actual response shape
  return response.results?.map((r: any, idx: number) => ({
    url: r.url,
    title: r.title,
    excerpt: r.excerpt,
    domain: extractDomain(r.url),
    rank: idx + 1,
  })) || []
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return 'unknown'
  }
}
```

---

### Phase 2: CLI Interface

**File:** `scripts/search.ts`

**Features:**
- Parse command-line arguments (objective, queries, processor, max results)
- Display spinner during search
- Format and display results
- Handle errors with helpful messages

**Argument Parsing:**
```bash
# Objective only
pnpm tsx scripts/search.ts --objective "When was the UN founded?"

# Objective + queries
pnpm tsx scripts/search.ts --objective "Astro SSR docs" --queries "astro ssr" "astro server-side"

# Custom processor and limits
pnpm tsx scripts/search.ts --objective "..." --processor pro --max-results 5

# Stdin support for Claude
echo '{"objective": "..."}' | pnpm tsx scripts/search.ts --stdin
```

**Implementation:**
```typescript
#!/usr/bin/env node
import ora from 'ora'
import { parseArgs } from 'node:util'
import { executeSearch } from './parallel-client.js'
import { formatResults } from './formatter.js'
import { log } from './log.js'

async function main() {
  const startTime = Date.now()

  log.header('\n🔍 Parallel Search\n')

  try {
    // Parse arguments
    const { values } = parseArgs({
      options: {
        objective: { type: 'string' },
        queries: { type: 'string', multiple: true },
        processor: { type: 'string' },
        'max-results': { type: 'string' },
        stdin: { type: 'boolean' },
      },
      allowPositionals: true,
    })

    // Validate input
    if (!values.objective && !values.stdin) {
      log.error('No search objective provided')
      log.dim('\nUsage: pnpm tsx scripts/search.ts --objective "your query"\n')
      process.exit(1)
    }

    // Execute search
    const spinner = ora('Searching...').start()
    const results = await executeSearch({
      objective: values.objective,
      searchQueries: values.queries,
      processor: values.processor as any,
      maxResults: values['max-results'] ? parseInt(values['max-results']) : undefined,
    })
    spinner.succeed(`Found ${results.length} results`)

    // Format and output
    const report = formatResults(results, {
      objective: values.objective || '',
      executionTimeMs: Date.now() - startTime,
    })

    log.plain('\n' + report)

  } catch (error: any) {
    if (error.name === 'AuthError') {
      log.error('\nAuthentication failed')
      log.dim(error.message)
      log.dim('\nGet your API key at: https://platform.parallel.ai/')
      log.dim('Then run: export PARALLEL_API_KEY="your-key-here"\n')
    } else if (error.name === 'RateLimitError') {
      log.error('\nRate limit exceeded')
      log.dim(error.message)
      if (error.resetAt) {
        log.dim(`Resets at: ${error.resetAt.toLocaleString()}\n`)
      }
    } else {
      log.error('\nSearch failed')
      log.dim(error.message || String(error))
    }
    process.exit(1)
  }
}

main()
```

---

### Phase 3: Result Formatting

**File:** `scripts/formatter.ts`

**Purpose:** Format search results as clean markdown for Claude to read

```typescript
import type { SearchResult } from './types.js'

export function formatResults(
  results: SearchResult[],
  metadata: { objective: string; executionTimeMs: number }
): string {
  const sections: string[] = []

  // Header
  sections.push(`# Parallel Search Results\n`)
  sections.push(`**Query:** ${metadata.objective}`)
  sections.push(`**Results:** ${results.length}`)
  sections.push(`**Execution:** ${(metadata.executionTimeMs / 1000).toFixed(1)}s\n`)
  sections.push('---\n')

  // Results
  for (const result of results) {
    sections.push(`## ${result.rank}. [${result.title}](${result.url})\n`)
    sections.push(`**URL:** ${result.url}\n`)
    sections.push(`**Excerpt:**\n`)
    sections.push(result.excerpt)
    sections.push('\n---\n')
  }

  return sections.join('\n')
}
```

---

### Phase 3.5: Deduplication Logic

**File:** `scripts/deduplicator.ts`

**Purpose:** Deduplicate results from multiple searches while tracking source diversity

```typescript
import type { SearchResult } from './types.js'

export interface DeduplicatedResult extends SearchResult {
  foundInSearches: string[]  // Track which queries found this result
  sourceCount: number         // Number of times found (relevance indicator)
}

export function deduplicateResults(
  resultsMap: Map<string, { results: SearchResult[]; query: string }>
): DeduplicatedResult[] {
  const urlMap = new Map<string, DeduplicatedResult>()

  // Aggregate by URL
  for (const [searchId, { results, query }] of resultsMap) {
    for (const result of results) {
      if (urlMap.has(result.url)) {
        const existing = urlMap.get(result.url)!
        existing.foundInSearches.push(query)
        existing.sourceCount++
      } else {
        urlMap.set(result.url, {
          ...result,
          foundInSearches: [query],
          sourceCount: 1,
        })
      }
    }
  }

  // Sort by source count (found in multiple searches = more relevant)
  return Array.from(urlMap.values()).sort((a, b) => b.sourceCount - a.sourceCount)
}

export function checkSourceDiversity(results: DeduplicatedResult[]): {
  domainCounts: Map<string, number>
  isDiverse: boolean
  topDomain: string
  topDomainPercentage: number
} {
  const domainCounts = new Map<string, number>()

  for (const result of results) {
    const count = domainCounts.get(result.domain) || 0
    domainCounts.set(result.domain, count + 1)
  }

  const topDomain = Array.from(domainCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]

  const topDomainPercentage = (topDomain[1] / results.length) * 100

  return {
    domainCounts,
    isDiverse: topDomainPercentage < 40,  // No single domain > 40%
    topDomain: topDomain[0],
    topDomainPercentage,
  }
}
```

---

### Phase 4: Skill Manifest

**File:** `SKILL.md`

```markdown
---
name: parallel-search
description: Comprehensive web research via Parallel Search API. PRIMARY research tool for Claude Code (replaces gemini-research). Use for deep multi-source research, technical analysis, learning new topics, current events, comparative studies, and any web research task. Returns LLM-ready ranked URLs with extended excerpts (up to 30K chars). Claude orchestrates multiple searches for thorough investigation. Saves research reports to docs/research/parallel/.
allowed-tools: Bash(pnpm tsx*)
---

# Parallel Search

**Primary web research skill** for comprehensive, multi-source investigation using Parallel's AI-optimized Search API.

## Overview

This skill replaces `gemini-research` as the main research tool. It excels at:
- Deep technical research requiring multiple perspectives
- Learning new frameworks, libraries, and technologies
- Comparative analysis across sources
- Current events and developments
- Finding and synthesizing documentation
- Academic and professional research

**Key advantage:** Extended excerpts (up to 30K chars) provide substantial content for Claude to analyze, far beyond typical search APIs.

## Prerequisites

**API Key:** Set `PARALLEL_API_KEY` environment variable
- Get key: https://platform.parallel.ai/
- `export PARALLEL_API_KEY="your-key-here"`

**Dependencies:** Auto-installed via pnpm
- parallel-web (TypeScript SDK)
- chalk (terminal colors)
- ora (spinners)

## Usage Philosophy

**Claude orchestrates multi-search workflows:**

1. **Plan research strategy** (3-5 targeted searches)
2. **Execute searches sequentially** (adapt based on findings)
3. **Aggregate and deduplicate** results across searches
4. **Analyze extended excerpts** (substantial content per result)
5. **Synthesize comprehensive answer** with citations
6. **Save research report** to `docs/research/parallel/`

## Basic Usage

### Single Search

```bash
cd plugins/knowledge-work/skills/parallel-search
pnpm install  # First time only
pnpm tsx scripts/search.ts --objective "your search objective"
```

### Multi-Query Search

```bash
pnpm tsx scripts/search.ts \
  --objective "Production RAG system architecture" \
  --queries "RAG vector database" "RAG chunking strategies"
```

### Processor Levels

```bash
# Default: pro (balanced quality/speed for research)
pnpm tsx scripts/search.ts --objective "..."

# Lite: faster, less depth
pnpm tsx scripts/search.ts --objective "..." --processor lite

# Ultra: maximum quality for critical research
pnpm tsx scripts/search.ts --objective "..." --processor ultra
```

## Parameters

- `--objective`: Main search objective (natural language, be specific)
- `--queries`: Additional targeted queries (max 5, 200 chars each)
- `--processor`: lite/base/pro/ultra (default: pro)
- `--max-results`: Results per search (default: 15)
- `--max-chars`: Excerpt length per result (default: 5000, max: 30000)

## Multi-Search Orchestration

**Claude should execute multiple searches for comprehensive research:**

```typescript
// Example: Research RAG systems
// Search 1: Broad overview
pnpm tsx scripts/search.ts --objective "Production RAG system architecture best practices"

// Search 2: Specific aspect
pnpm tsx scripts/search.ts --objective "RAG chunking strategies comparison"

// Search 3: Another angle
pnpm tsx scripts/search.ts --objective "RAG evaluation metrics and benchmarks"

// Search 4: Real-world insights
pnpm tsx scripts/search.ts --objective "RAG deployment challenges and solutions"
```

**Then Claude:**
1. Deduplicates by URL
2. Identifies patterns across ~40+ unique sources
3. Synthesizes comprehensive report
4. Saves to `docs/research/parallel/TIMESTAMP-topic.md`

## Output Format

Returns markdown with:
- Search metadata (query, result count, execution time)
- Ranked results with:
  - Title and URL
  - Domain
  - Extended excerpt (up to 30K chars)
  - Rank score

## Typical Workflows

### Deep Technical Research
Run 4-5 searches covering architecture, implementation, evaluation, challenges.
Result: 30-50 unique sources with substantial content.

### Learning New Framework
Run 5 searches: intro, core concepts, comparison, best practices, examples.
Result: Comprehensive learning guide with official docs + tutorials + real examples.

### Comparative Analysis
Run 3-4 searches: general comparison, option A details, option B details, use cases.
Result: Detailed comparison matrix with trade-offs and recommendations.

### Current Events
Run 2-3 searches: broad developments, specific products/companies, benchmarks.
Result: Timeline of recent updates with source dates.

## Research Persistence

**After comprehensive multi-search research, save the report:**

1. Use `timestamp` skill to get YYYYMMDDHHMMSS format
2. Sanitize topic to kebab-case slug
3. Save to `docs/research/parallel/TIMESTAMP-topic.md`
4. Include all findings, sources (with URLs), and analysis

## Error Handling

**Common errors:**
- **Missing API key:** Set `PARALLEL_API_KEY` environment variable
- **Rate limits:** Depend on plan tier, wait and retry
- **Network errors:** Retry with exponential backoff

## Limitations

- Rate limits based on Parallel plan tier
- Max 5 search queries per request
- Max 30K chars per result (not guaranteed above this)
- Sequential searches take time (10-30s each)

## Best Practices

1. **Be specific in objectives:** "Production RAG architecture" > "RAG systems"
2. **Use multiple searches:** Cover different angles and aspects
3. **Leverage extended excerpts:** Read full content, don't just skim
4. **Track source diversity:** Ensure not over-reliant on single domain
5. **Save comprehensive research:** Persist multi-search findings
6. **Use appropriate processor:** pro for most research, ultra for critical analysis
```

---

### Phase 5: Package Configuration

**File:** `package.json`

```json
{
  "name": "@agents/parallel-search-skill",
  "version": "1.0.0",
  "type": "module",
  "description": "Parallel Search API skill for quick web lookups",
  "scripts": {
    "search": "tsx scripts/search.ts",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint scripts/**/*.ts",
    "format": "prettier --write scripts/**/*.ts"
  },
  "dependencies": {
    "parallel-web": "latest",
    "chalk": "^5.3.0",
    "ora": "^8.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.1.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0"
  }
}
```

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./scripts",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["scripts/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Testing Strategy

### Unit Tests

**File:** `__tests__/formatter.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { formatResults } from '../scripts/formatter.js'

describe('formatResults', () => {
  it('formats empty results', () => {
    const output = formatResults([], { objective: 'test', executionTimeMs: 100 })
    expect(output).toContain('# Parallel Search Results')
    expect(output).toContain('**Results:** 0')
  })

  it('formats single result with rank', () => {
    const results = [{
      url: 'https://example.com',
      title: 'Example',
      excerpt: 'Test excerpt',
      rank: 1,
    }]
    const output = formatResults(results, { objective: 'test', executionTimeMs: 100 })
    expect(output).toContain('## 1. [Example](https://example.com)')
    expect(output).toContain('Test excerpt')
  })

  it('includes metadata', () => {
    const output = formatResults([], { objective: 'test query', executionTimeMs: 1234 })
    expect(output).toContain('**Query:** test query')
    expect(output).toContain('**Execution:** 1.2s')
  })
})
```

### Integration Tests

**Manual testing scenarios:**

1. **Basic search:** Simple objective returns results
2. **Multi-query:** Objective + queries returns relevant results
3. **Error handling:** Invalid API key shows helpful error
4. **Empty results:** No matches returns graceful message
5. **Rate limiting:** Handles 429 errors gracefully

---

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Create project directory structure in `plugins/knowledge-work/skills/parallel-search/`
- [ ] Initialize package.json with dependencies (parallel-web, chalk, ora)
- [ ] Create tsconfig.json with ESM + NodeNext
- [ ] Create .eslintrc.json
- [ ] Implement types.ts (interfaces, errors, SearchResult with domain)
- [ ] Implement log.ts (CLI logging utilities)
- [ ] Implement parallel-client.ts (API wrapper with pro default, 5000 char excerpts)
- [ ] Test authentication with real PARALLEL_API_KEY

### Phase 2: CLI Interface
- [ ] Implement search.ts (main entry point)
- [ ] Add argument parsing (--objective, --queries, --processor, --max-results, --max-chars)
- [ ] Add ora spinners for progress
- [ ] Add comprehensive error handling (auth, rate limits, network)
- [ ] Test with various argument combinations

### Phase 3: Result Formatting
- [ ] Implement formatter.ts
- [ ] Add markdown formatting with domain display
- [ ] Include search metadata (query, count, time, domains)
- [ ] Format extended excerpts properly
- [ ] Test with sample results

### Phase 3.5: Deduplication Logic
- [ ] Implement deduplicator.ts
- [ ] Add deduplicateResults() function
- [ ] Add checkSourceDiversity() function
- [ ] Track which searches found each result
- [ ] Write unit tests for deduplication

### Phase 4: Skill Manifest
- [ ] Write SKILL.md with comprehensive description in frontmatter
- [ ] Document multi-search orchestration workflow
- [ ] Include 4 detailed workflow examples
- [ ] Document all parameters and processor levels
- [ ] Explain research persistence pattern
- [ ] Add best practices section

### Phase 5: Testing
- [ ] Write unit tests for formatter
- [ ] Write unit tests for deduplicator
- [ ] Manual integration testing (single search)
- [ ] Manual testing (multi-search workflow)
- [ ] Test error scenarios (auth, rate limits, network)
- [ ] Validate extended excerpt handling
- [ ] Test with different processors (lite, base, pro, ultra)

### Phase 6: Documentation & Integration
- [ ] Add .gitignore (node_modules, dist)
- [ ] Create README.md if needed
- [ ] Document environment setup
- [ ] Add troubleshooting guide
- [ ] Test full research workflow end-to-end
- [ ] Verify research saving to docs/research/parallel/

---

## Technical Decisions

### Why `parallel-web` SDK vs Direct API?

**Chosen:** TypeScript SDK (`parallel-web`)

**Rationale:**
- Full TypeScript types out of the box
- Built-in error handling and retries
- Maintained by Parallel team
- Cleaner code, less boilerplate
- Future-proof (SDK updates automatically)

### Why `beta.search()` vs Task API?

**Chosen:** Search API (beta.search)

**Rationale:**
- Designed for quick lookups (this skill's purpose)
- Returns ranked URLs with excerpts (LLM-ready)
- Faster than Task API for simple searches
- Simpler interface, fewer parameters
- Task API better for deep research (different use case)

### Why Knowledge Work vs Basic Skills?

**Chosen:** Place in `plugins/knowledge-work/skills/`

**Rationale:**
- Comprehensive research tool (multi-search orchestration)
- Domain-specific: web research and knowledge gathering
- Higher complexity (~1000 LOC including deduplication logic)
- Similar to other knowledge-work skills (gh-code-search, readwise-api)
- Replaces gemini-research as primary research tool

### Processor Selection

**Default:** `pro` processor

**Rationale:**
- Research-quality results (vs quick lookups)
- Better source ranking and relevance
- More comprehensive excerpts
- Worth the cost for deep research tasks
- Users can downgrade to `base` or `lite` for simpler queries
- Can upgrade to `ultra` for critical analysis

---

## Estimated Effort

**Total:** ~1000 LOC

**Breakdown:**
- types.ts: ~100 LOC (extended interfaces with domain, sourceCount)
- log.ts: ~20 LOC
- parallel-client.ts: ~150 LOC (includes domain extraction)
- search.ts (CLI): ~180 LOC (more argument handling)
- formatter.ts: ~120 LOC (richer formatting with domains)
- deduplicator.ts: ~100 LOC (deduplication + diversity checking)
- SKILL.md: ~200 lines (comprehensive documentation)
- Tests: ~150 LOC (vitest - formatter + deduplicator)
- Config files: ~80 LOC (package.json, tsconfig, eslint, gitignore)

**Time Estimate:** 6-8 hours including testing and documentation

---

## Future Enhancements

### v1.1 - Response Caching
- Cache search results locally (15-min TTL)
- Avoid redundant API calls for same query
- Respect rate limits better

### v1.2 - Search History
- Save searches to `docs/research/parallel/`
- Timestamped markdown files
- Reference past searches

### v1.3 - Advanced Filtering
- Domain filtering (include/exclude)
- Date range filtering
- Language preferences

### v1.4 - Batch Operations
- Multiple searches in single invocation
- Parallel execution
- Aggregated results

---

## References

- **Parallel Search API Docs:** https://docs.parallel.ai/search/search-quickstart
- **parallel-web SDK:** https://www.npmjs.com/package/parallel-web
- **Blog Post:** https://parallel.ai/blog/introducing-parallel-search
- **Platform:** https://platform.parallel.ai/
- **SDK Source:** https://github.com/parallel-web/parallel-sdk-typescript

---

## Success Criteria

A successful implementation will:

1. ✅ Execute searches via Parallel API with proper error handling
2. ✅ Return extended excerpts (up to 30K chars) in clean markdown
3. ✅ Handle authentication and rate limit failures gracefully
4. ✅ Support both objective-only and objective+queries modes
5. ✅ Support all processor levels (lite, base, pro, ultra)
6. ✅ Provide helpful CLI interface with comprehensive parameters
7. ✅ Include deduplication logic for multi-search workflows
8. ✅ Include tests for formatting and deduplication
9. ✅ Document comprehensive multi-search research workflows
10. ✅ Complete implementation in ~1000 LOC
11. ✅ Work seamlessly as primary research tool in Claude Code

---

## Notes

### Skill Positioning

**This skill REPLACES:**
- `gemini-research` - Unreliable, being deprecated

**This skill is THE primary web research tool for:**
- Deep multi-source research and analysis
- Learning new technologies and frameworks
- Comparative analysis across sources
- Current events and developments
- Technical documentation synthesis
- Academic and professional research

**Other skills for specific use cases:**
- `gh-code-search`: Finding code examples on GitHub (not web research)
- `readwise-api`: Personal reading data from Readwise (not web search)
- `web-to-markdown`: Full page content extraction (specific URLs, not search)

### API Key Management

**Security:**
- Never commit API keys to git
- Use environment variables only
- Document in .env.example
- Validate at runtime with clear error messages

### Rate Limits

**Parallel API limits:** Vary by plan tier
- Free tier: Limited requests/day
- Paid tiers: Higher limits
- Handle 429 gracefully with retry suggestions
