---
name: parallel-search
description: Comprehensive web research via Parallel Search API. Use when user requests parallel search for deep multi-source research, technical analysis, learning new topics, current events, or comparative studies. Returns LLM-ready ranked URLs with extended excerpts (up to 30K chars). Single API call handles multiple query angles with automatic deduplication.
allowed-tools: Bash(pnpm tsx*)
---

# Parallel Search

Web research using Parallel's Search API with extended excerpts (up to 30K chars per result).

## When to Use

Use for comprehensive research on:
- Technical topics requiring multiple perspectives
- New frameworks, libraries, technologies
- Comparative analysis
- Current events
- Documentation synthesis

## Prerequisites

**Required:**
- `PARALLEL_API_KEY` environment variable
- Get key: https://platform.parallel.ai/

**Dependencies:** Auto-installed via pnpm

## Workflow

When user requests research:

1. Analyze question to identify main objective
2. Generate 3-5 targeted query angles for multi-perspective coverage
3. Execute single bash command with `--objective` and `--queries` parameters
4. API returns deduplicated results from parallel execution
5. Analyze extended excerpts and synthesize findings
6. Save report to `docs/research/parallel/TIMESTAMP-topic.md`

## Usage

### Comprehensive Research (Recommended)

```bash
cd plugins/knowledge-work/skills/parallel-search
pnpm tsx scripts/search.ts \
  --objective "Production RAG system architecture" \
  --queries \
    "RAG chunking strategies" \
    "RAG evaluation metrics" \
    "RAG deployment challenges" \
    "RAG vector database selection"
```

The API executes all queries in parallel and returns deduplicated results automatically.

### Quick Single Query

```bash
pnpm tsx scripts/search.ts --objective "When was the UN founded?"
```

### Processor Levels

```bash
# Default: pro (balanced quality/speed)
pnpm tsx scripts/search.ts --objective "..."

# Ultra: maximum quality for critical research
pnpm tsx scripts/search.ts --objective "..." --processor ultra
```

## Parameters

- `--objective` (required): Main search objective (natural language, be specific)
- `--queries`: Additional query angles (max 5, 200 chars each)
- `--processor`: lite/base/pro/ultra (default: pro)
- `--max-results`: Results per search (default: 15)
- `--max-chars`: Excerpt length per result (default: 5000, max: 30000)

## Output Format

Returns markdown with:
- Search metadata (objective, result count, execution time)
- Top domains distribution
- Ranked results:
  - Title and URL
  - Domain
  - Extended excerpts (joined with double newlines)
  - Rank

## Query Generation Strategy

**For broad topics:** Generate queries covering different aspects

Example: "RAG systems"
- Objective: "Production RAG system architecture overview"
- Queries: "chunking strategies", "evaluation metrics", "deployment patterns", "vector databases"

**For comparisons:** Generate queries for each option plus general comparison

Example: "PostgreSQL vs MongoDB"
- Objective: "PostgreSQL vs MongoDB comparison"
- Queries: "PostgreSQL use cases", "MongoDB use cases", "relational vs document databases"

**For current events:** Use temporal and source diversity

Example: "Latest AI developments"
- Objective: "Recent AI model releases and benchmarks"
- Queries: "GPT-4 updates", "open source LLMs", "AI safety research", "industry adoption"

## Research Persistence

After synthesis, save report:

1. Get timestamp: Use `timestamp` skill for YYYYMMDDHHMMSS format
2. Sanitize topic: Use `sanitizeForFilename` from formatter.ts (kebab-case, 50 char limit)
3. Save to: `docs/research/parallel/TIMESTAMP-topic.md`
4. Include: Findings, sources with URLs, analysis

## Error Handling

**Missing API key:**
```bash
export PARALLEL_API_KEY="your-key-here"
```

**Rate limit exceeded:** Wait for reset time (shown in error message)

**Network errors:** Retry with `--processor lite` for faster response

**Validation errors:** Check constraints (max 5 queries, 200 chars each)

## Constraints

- Max 5 queries per request
- Max 200 chars per query
- Max 30K chars per excerpt (not guaranteed above 30K)
- Rate limits depend on API plan tier
- Requires internet connection

## Best Practices

- Use specific objectives: "Production RAG architecture" > "RAG systems"
- Leverage all 5 query slots for comprehensive coverage
- Use `--max-chars` up to 30000 for deep content analysis
- Adapt processor level to urgency: pro for most, ultra for critical
- Save multi-query research for future reference

## Implementation

**Files:**
- `types.ts` - Interfaces and error types
- `parallel-client.ts` - API client with validation
- `formatter.ts` - Markdown output formatting
- `log.ts` - CLI logging
- `search.ts` - CLI entry point

**Testing:**
```bash
pnpm test
```

---

## Output Schema

All research outputs follow standardized format for cross-skill consistency:

```markdown
# Research: [Topic]

**Metadata:** parallel-search • [Timestamp] • [Duration]s • [N] sources

## Summary

[2-3 sentences describing what was found and key insights]

## Findings

### Top Domains
- domain.com: N results (X%)

### [Ranked Results]
Detailed results with excerpts...

## Sources

### Web
- [Title](url) • domain.com
```

**Metadata fields:**
- skill: parallel-search
- timestamp: YYYYMMDDHHMMSS format (e.g., 20251118143052)
- duration: Execution time in seconds
- sources: Total unique sources found

Reports automatically saved to `docs/research/parallel/TIMESTAMP-topic.md`

---

## Shared Utilities

This skill uses standardized utilities from `@knowledge-work/shared`:

- `generateTimestamp()` - Consistent timestamp format across all research skills
- `sanitizeForFilename()` - Unified filename sanitization rules
- `saveResearchReport()` - Standardized file persistence and naming

**Benefits:**
- Consistent naming across all research outputs
- No duplicate implementations
- Single source of truth for common operations

---

## Cross-Skill Integration

This skill can be orchestrated with others via the `web-research-specialist` agent:

**Example: Comprehensive Research**
```
User: "Research RAG systems comprehensively"
Agent: Launches parallel-search + gh-code-search + gemini-research in parallel
Result: Unified report combining web search, code examples, and Google-grounded research
```

**When to combine:**
- **parallel-search + gh-code-search**: Web overview + real code implementations
- **parallel-search + gemini-research**: Broad search + deep Google-grounded analysis
- **All three**: Maximum coverage for complex topics or comparative analysis

The agent handles deduplication and synthesis across all sources.
