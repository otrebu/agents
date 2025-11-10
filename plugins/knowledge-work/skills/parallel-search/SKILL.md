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

```bash
# Example: Research RAG systems
# Search 1: Broad overview
pnpm tsx scripts/search.ts --objective "Production RAG system architecture best practices"

# Search 2: Specific aspect
pnpm tsx scripts/search.ts --objective "RAG chunking strategies comparison"

# Search 3: Another angle
pnpm tsx scripts/search.ts --objective "RAG evaluation metrics and benchmarks"

# Search 4: Real-world insights
pnpm tsx scripts/search.ts --objective "RAG deployment challenges and solutions"
```

**Then Claude:**
1. Deduplicates by URL (manually or using deduplicator functions)
2. Identifies patterns across ~40+ unique sources
3. Synthesizes comprehensive report
4. Saves to `docs/research/parallel/TIMESTAMP-topic.md`

## Output Format

Returns markdown with:
- Search metadata (query, result count, execution time)
- Top domains distribution
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
2. Sanitize topic to kebab-case slug (use `sanitizeForFilename` from formatter.ts)
3. Save to `docs/research/parallel/TIMESTAMP-topic.md`
4. Include all findings, sources (with URLs), and analysis

## Error Handling

**Common errors:**
- **Missing API key:** Set `PARALLEL_API_KEY` environment variable
- **Rate limits:** Depend on plan tier, wait and retry
- **Network errors:** Retry with exponential backoff
- **Validation errors:** Check parameter constraints (max queries, char limits)

## Limitations

- Rate limits based on Parallel plan tier
- Max 5 search queries per request
- Max 30K chars per result (not guaranteed above this)
- Sequential searches take time (10-30s each)
- Requires internet connection

## Best Practices

1. **Be specific in objectives:** "Production RAG architecture" > "RAG systems"
2. **Use multiple searches:** Cover different angles and aspects
3. **Leverage extended excerpts:** Read full content, don't just skim
4. **Track source diversity:** Ensure not over-reliant on single domain
5. **Save comprehensive research:** Persist multi-search findings
6. **Use appropriate processor:** pro for most research, ultra for critical analysis
7. **Adapt queries:** Based on initial results, refine subsequent searches

## Deduplication for Multi-Search

When running multiple searches, use the deduplication functions:

```typescript
import { deduplicateResults, checkSourceDiversity } from './scripts/deduplicator.js'

// Collect results from multiple searches
const resultsMap = new Map()
resultsMap.set('search1', { results: results1, query: 'query 1' })
resultsMap.set('search2', { results: results2, query: 'query 2' })

// Deduplicate
const deduplicated = deduplicateResults(resultsMap)

// Check diversity
const diversity = checkSourceDiversity(deduplicated)
if (!diversity.isDiverse) {
  console.log('Warning: Limited source diversity')
}
```

## Troubleshooting

**"PARALLEL_API_KEY not set"**
- Export the environment variable: `export PARALLEL_API_KEY="your-key"`
- Verify: `echo $PARALLEL_API_KEY`

**"No results found"**
- Try broader objective
- Remove or adjust --queries
- Try different processor level

**"Rate limit exceeded"**
- Wait for reset time (shown in error)
- Upgrade Parallel plan for higher limits

**Network timeouts**
- Check internet connection
- Try again with --processor lite for faster response
- Reduce --max-results

## Implementation Details

**Architecture:**
- `types.ts` - TypeScript interfaces and custom errors
- `parallel-client.ts` - API wrapper with validation and error handling
- `formatter.ts` - Markdown output formatting
- `deduplicator.ts` - Multi-search result deduplication
- `log.ts` - CLI logging utilities
- `search.ts` - Main CLI entry point

**Testing:**
- Unit tests for formatter and deduplicator
- Integration testing with real API
- Error scenario testing

**Code Style:**
- Functional programming patterns
- Explicit error types
- Comprehensive JSDoc comments
- Type-safe throughout
