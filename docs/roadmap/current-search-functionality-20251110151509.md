# Current Search and Research Functionality

**Date:** 2025-11-10
**Status:** Inventory of existing capabilities

---

## Overview

Current implementation includes 7 distinct search/research tools and agents across different layers:
- 2 built-in Claude tools (WebSearch, WebFetch)
- 3 specialized skills (gemini-research, gh-code-search, web-to-markdown)
- 2 orchestration agents (deep-research, deep-context-gatherer)

---

## 1. Built-in Claude Tools

### WebSearch
**Type:** Built-in tool provided by Claude
**Purpose:** Basic web search capability
**How it works:**
- Searches web and returns results formatted as search result blocks
- Provides up-to-date information for current events
- Single API call per search
**Limitations:**
- Only available in US
- Basic search, no advanced query strategies
- Limited control over result formatting
- Returns titles only, not full URLs with context

**Usage pattern:**
```typescript
// Direct tool call by Claude
WebSearch({ query: "TypeScript error handling" })
```

### WebFetch
**Type:** Built-in tool provided by Claude
**Purpose:** Fetch content from specific URLs
**How it works:**
- Takes URL and prompt as input
- Fetches URL content, converts HTML to markdown
- Processes content with prompt using small, fast model
- Returns model's response about content
**Limitations:**
- Single URL at a time
- Depends on HTML structure
- May fail on JavaScript-heavy sites
- Read-only (no interaction)

**Usage pattern:**
```typescript
// Direct tool call by Claude
WebFetch({
  url: "https://example.com/docs",
  prompt: "Extract API endpoints and their documentation"
})
```

---

## 2. Specialized Skills

### gemini-research
**Location:** `plugins/knowledge-work/skills/gemini-research/`
**Purpose:** Google Search-powered research via Gemini CLI
**How it works:**
1. Uses Gemini CLI's `google_web_search` tool
2. Free tier: 60 req/min, 1000/day, 1M-token context
3. Returns structured JSON with URLs, quotes, code examples
4. Three modes: quick (5-8 sources), deep (10-15 sources), code (code-focused)

**Key features:**
- ✅ Google Search grounding built-in
- ✅ Citations with URLs and quotes
- ✅ JSON output for programmatic parsing
- ✅ Real-time data: news, docs, code
- ✅ Three specialized modes

**Modes:**
1. **Quick** (default): Fast overview, 5-8 sources
   - Output: queries_used, sources, key_points, quotes, summary
2. **Deep**: Comprehensive analysis, 10-15 sources
   - Adds: contradictions, consensus, gaps
3. **Code**: Practical code snippets
   - Adds: code_snippets, patterns, libraries, gotchas

**Usage pattern:**
```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "query" [mode]
# Outputs: gemini-research-output.json
```

**Performance:** 5-20 seconds depending on mode

**Limitations:**
- Requires Gemini CLI installation and auth
- Free tier may train on data
- Rate limits (60/min, 1000/day)
- Tool call can be flaky (sometimes ignores hints)

---

### gh-code-search
**Location:** `plugins/knowledge-work/skills/gh-code-search/`
**Purpose:** Search GitHub for real-world code examples
**How it works:**
1. Authenticates with GitHub via gh CLI token
2. Single-query execution (Octokit API, pagination, text-match)
3. Ranks by quality (stars, recency, code structure)
4. Fetches top 10 files in parallel
5. Extracts factual data (imports, syntax patterns, metrics)
6. Returns markdown with code + metadata + GitHub URLs

**Key features:**
- ✅ Quality-based ranking (not just GitHub relevance)
- ✅ Parallel file fetching (Promise.all)
- ✅ Factual data extraction (imports, syntax counts)
- ✅ Context extraction (line boundaries)
- ✅ Rate limit monitoring
- ✅ Typed errors with recovery suggestions

**Orchestration model:**
- Tool handles single query execution
- Claude orchestrates 3-5 sequential searches
- Claude aggregates, deduplicates, analyzes patterns
- Claude generates comprehensive summary with trade-offs

**Workflow (Claude-orchestrated):**
1. Generate 3-5 targeted queries (language, file type, specificity variants)
2. Execute searches sequentially, adapt based on results
3. Aggregate and deduplicate by repo+path
4. Extract patterns (imports, architecture, code structure)
5. Generate comprehensive summary with recommendations
6. Save to `docs/research/github/<timestamp>-<query>.md`

**Usage pattern:**
```bash
cd plugins/knowledge-work/skills/gh-code-search
pnpm search "query text"
```

**Performance:** 10-30s per query, 30-150s for full workflow (3-5 queries)

**Limitations:**
- GitHub API rate limit: 5,000 req/hr
- Single query = top 10 files only
- Skips files >100KB
- Sequential execution (no parallel queries)
- Claude must orchestrate multi-query workflow

---

### web-to-markdown
**Location:** `plugins/knowledge-work/skills/web-to-markdown/`
**Purpose:** Batch-process web pages to markdown using headless browser
**How it works:**
1. Launches headless Playwright browser
2. Scrapes each URL sequentially
3. Converts HTML to markdown (Turndown library)
4. Appends all to single timestamped file

**Key features:**
- ✅ Handles JavaScript-rendered content (SPAs)
- ✅ Batch processing (multiple URLs → single file)
- ✅ Self-contained (no MCP dependency)
- ✅ Headless (no visible window)

**Usage pattern:**
```bash
cd skills/web-to-markdown
pnpm tsx scripts/scrape-and-convert.ts <url1> [url2] [url3]...
# Outputs: docs/web-captures/YYYYMMDD_HHMMSS.md
```

**Performance:** ~2-5 seconds per page, sequential processing

**Limitations:**
- Sequential only (one URL at a time)
- 30s timeout per page
- Some sites block headless browsers
- No interaction capability
- Requires Playwright browser installation

---

## 3. Orchestration Agents

### deep-research
**Location:** `plugins/development-lifecycle/agents/deep-research.md`
**Purpose:** Run parallel web searches and compile findings into optional report
**Tools:** WebSearch, Write, Read
**How it works:**
1. Generate 5-7 diverse search keywords covering multiple angles
2. Execute parallel web searches (5-7 simultaneous)
3. Synthesize findings into actionable insights
4. Optionally save to `docs/reports/{topic-slug}.md`

**Key features:**
- ✅ Parallel search execution (5-7 queries in ONE message)
- ✅ Diverse keyword strategies (technical, practical, comparisons, best practices, recent, problems, opinions)
- ✅ Structured output (executive summary, findings, recommendations, sources)
- ✅ Optional file persistence

**Keyword strategies:**
- Technical documentation and specs
- Practical use cases and examples
- Comparisons and alternatives
- Best practices and patterns
- Recent developments (2024-2025)
- Common problems and solutions
- Community discussions and opinions

**Output format:**
1. Executive summary (2-3 paragraphs)
2. Key findings by category
3. Actionable recommendations
4. Source links with context

**Constraints:**
- MUST execute searches in parallel (not sequential)
- DO NOT save unless explicitly requested
- Executive summary ≤ 200 words
- Always include source URLs

**Limitations:**
- Only uses WebSearch (no integration with other skills)
- US-only (WebSearch restriction)
- No GitHub code search integration
- No local codebase integration

---

### deep-context-gatherer
**Location:** `plugins/development-lifecycle/agents/deep-context-gatherer.md`
**Purpose:** Multi-phase research combining parallel web searches with local codebase analysis
**Tools:** Read, Grep, Glob, Bash, WebSearch, Write
**How it works:**
1. Parallel web searches (like deep-research)
2. Local codebase analysis (Grep, Glob)
3. Synthesis of web + local findings
4. Save to `docs/reports/{topic}.md`

**Key features:**
- ✅ Combines external (web) + internal (codebase) research
- ✅ Multi-phase orchestration
- ✅ Progress communication to user
- ✅ Report persistence

**Output location:** `docs/reports/{topic}.md`

**Workflow:**
- Phase 1: Web research (parallel searches)
- Phase 2: Codebase analysis (pattern matching)
- Phase 3: Synthesis and report generation

**Limitations:**
- Only uses WebSearch for web research (no gemini-research or gh-code-search)
- No integration with specialized skills
- Documentation references non-existent file (@docs/HOW_TO_DEEP_CONTEXT_GATHER.md)

---

## 4. Skill Triggers and Reminders

**Location:** `hooks/skill-reminder/skill-triggers.ts`

Automated pattern-based skill suggestions:

| Pattern | Skill | Priority |
|---------|-------|----------|
| google search, search google, research google | gemini-research | 9 |
| github code, code examples github, how people implement | gh-code-search | 10 |
| Various git, lint, feature, commit patterns | development-lifecycle skills | 1-7 |

**How it works:**
- Hook monitors user prompts
- Matches patterns (string or regex, case-insensitive)
- Suggests relevant skills
- Lower priority number = higher priority

---

## 5. Architecture Patterns

### Division of Labor

**Script/Tool Responsibilities:**
- Authentication
- API calls and data fetching
- Pagination and parallel operations
- Objective ranking and metrics
- Factual data extraction
- Error handling and retries
- Output formatting

**Claude Responsibilities:**
- Query crafting and strategy
- Multi-query orchestration
- Pattern recognition across results
- Synthesis and analysis
- Trade-off evaluation
- Recommendations based on context
- Report composition

### Current Integration Points

1. **Skills are single-purpose tools** - Claude orchestrates multiple invocations
2. **Agents are workflow orchestrators** - Combine multiple tools/searches
3. **No skill-to-skill integration** - Each operates independently
4. **Manual orchestration** - Claude decides when/how to combine capabilities

---

## 6. Output Patterns

### File Locations

| Tool/Agent | Output Location | Naming Pattern |
|------------|----------------|----------------|
| gemini-research | `./gemini-research-output.json` | Fixed name (overwritten) |
| gh-code-search | `docs/research/github/` | `<timestamp>-<query>.md` |
| web-to-markdown | `docs/web-captures/` | `YYYYMMDD_HHMMSS.md` |
| deep-research | `docs/reports/` | `{topic-slug}.md` (optional) |
| deep-context-gatherer | `docs/reports/` | `{topic}.md` |

### Format Conventions

**gemini-research:** Structured JSON
```json
{
  "queries_used": [...],
  "sources": [...],
  "key_points": [...],
  "quotes": [...],
  "summary": "..."
}
```

**gh-code-search:** Markdown with sections
- Search strategy executed
- Pattern analysis
- Approaches found
- Trade-offs table
- Recommendations
- Key code sections
- All GitHub files analyzed (with URLs)

**Agents:** Markdown reports
- Executive summary
- Detailed findings
- Sources/references
- Recommendations

---

## 7. Performance Characteristics

| Tool | Speed | Parallelization | Rate Limits |
|------|-------|-----------------|-------------|
| WebSearch | Fast | Yes (via multiple tool calls) | Limited, US-only |
| WebFetch | Fast (~2s) | No (one URL) | Unknown |
| gemini-research | 5-20s | No (sequential within) | 60/min, 1000/day |
| gh-code-search | 10-30s per query | Files only (not queries) | 5,000 req/hr |
| web-to-markdown | 2-5s per page | No (sequential) | None (self-hosted) |
| deep-research | 10-30s | Yes (parallel searches) | WebSearch limits |
| deep-context-gatherer | Variable | Yes (web), No (local) | WebSearch limits |

---

## 8. Key Strengths

1. **Diverse capabilities** - Web search, GitHub code, page scraping, research compilation
2. **Quality-focused** - Ranking algorithms, factual extraction, citation requirements
3. **Structured output** - JSON and markdown formats for programmatic consumption
4. **Orchestration patterns** - Clear division between tool execution and Claude analysis
5. **Error resilience** - Typed errors, graceful degradation, retry logic
6. **Free options** - gemini-research, gh-code-search, web-to-markdown all free

---

## 9. Key Limitations

1. **No cross-skill integration** - Skills can't invoke each other
2. **Manual orchestration** - Claude must coordinate everything
3. **Limited parallelization** - Most tools sequential internally
4. **Fragmented output** - Different locations, formats, naming patterns
5. **No unified research workflow** - Each tool operates independently
6. **Geographic restrictions** - WebSearch US-only
7. **No query strategy templates** - Claude generates from scratch each time
8. **Limited result aggregation** - No automatic deduplication across sources
9. **No research caching** - Re-runs expensive queries for same topics
10. **Missing coordination layer** - No system to decide which tool(s) to use

---

## 10. Technology Stack

**Languages:**
- TypeScript (gh-code-search, web-to-markdown)
- Bash (gemini-research, orchestration)
- Markdown (agents, documentation)

**APIs/Services:**
- GitHub Code Search API (Octokit)
- Gemini CLI with Google Search
- Playwright (headless browser)
- Claude WebSearch/WebFetch

**Libraries:**
- Octokit REST API client
- Turndown (HTML to Markdown)
- Playwright (browser automation)
- chalk/ora (CLI UX)

**Authentication:**
- GitHub: gh CLI token
- Gemini: Google account (browser auth)
- Playwright: None (local)

---

## Summary

**What we have:**
- Comprehensive tooling for web search, GitHub code search, page scraping
- Strong quality focus with ranking and factual extraction
- Clear orchestration patterns with division of responsibilities
- Multiple output formats and persistence options

**What we're missing (preview):**
- Unified research orchestration
- Cross-tool integration
- Query strategy templates
- Result deduplication and aggregation
- Research caching
- Decision layer for tool selection

See `search-improvements-<timestamp>.md` for detailed gap analysis and recommendations.
