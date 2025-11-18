---
name: gemini-research
description: Web research via Gemini CLI with Google Search grounding. Generates complete markdown report with optional analysis parameter. Use for real-time data: news, docs, code examples, fact verification.
allowed-tools: Bash(plugins/knowledge-work/skills/gemini-research/scripts/*), Bash(gemini:*), Read
---

# Gemini Research

Deep web research using Gemini CLI with Google Search grounding. Cost-effective alternative to expensive research APIs.

## Overview

Leverage Gemini CLI's built-in Google Search grounding (`google_web_search`) to fetch real-time information with citations. Returns structured JSON for Claude to analyze and synthesize.

**Key advantages:**
- Free tier: 60 requests/min, 1000/day
- 1M-token context window (Gemini 2.5 Pro)
- Built-in Google Search grounding
- Structured JSON output with citations
- Real-time data (news, docs, tutorials)

## Prerequisites

**Gemini CLI installed:**
```bash
npm install -g @google/gemini-cli
```

**Authentication:**
First run requires Google login (any account works):
```bash
gemini -p "test" --output-format json
```
Follow browser auth flow. Free Code Assist license included.

**Verify installation:**
```bash
gemini --version
```

## Usage

When user asks to:
- "Research X using Google Search"
- "Find real-world examples of X"
- "Get latest information about X"
- "Deep research on X with sources"

Run the skill wrapper with appropriate mode.

## Workflow

**Recommended approach for rich analysis:**

1. **Analyze user's request** - Determine research objectives and what insights are needed
2. **Generate preliminary analysis framework** - Prepare key questions and synthesis approach
3. **Execute research with analysis** - Pass analysis to script as 3rd parameter (after mode)
4. **Present findings to user** - Summarize key learnings from complete markdown

### Analysis Format

When providing analysis parameter, structure as markdown:

```markdown
**Patterns:**
- Common theme 1 across multiple sources
- Pattern 2 showing consensus
- Divergence or contradiction noted

**Recommendations:**
- Actionable advice ranked by confidence
- Trade-offs to consider
- Next steps for implementation
```

### Example Usage with Analysis

```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh \
  "TypeScript error handling 2025" \
  quick \
  "**Patterns:**
- Result types (Either, Option) gaining adoption over exceptions
- Zod for runtime validation is standard practice
- Error boundaries at module edges

**Recommendations:**
- Use discriminated unions for expected errors
- Reserve exceptions for truly exceptional cases
- Validate external data at boundaries"
```

**Result**: Complete markdown report with integrated analysis, no post-processing needed.

## Research Modes

### 1. Quick Research (default)

Fast overview with 5-8 sources.

```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "your query here"
```

**Output**:
- **JSON**: `gemini-research-output.json` (for backward compatibility)
- **Markdown**: `docs/research/google/<timestamp>-<topic>.md` (human-readable)

**JSON structure**:
- `queries_used`: Search queries executed
- `sources`: Array of `{title, url}`
- `key_points`: Main findings (5-8 bullets)
- `quotes`: Array of `{text, source_url}`
- `summary`: 3-5 sentence brief

**Example:**
```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "TypeScript error handling patterns 2025"
```

### 2. Deep Research

Comprehensive analysis with 10-15 sources, contradictions identified.

```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "your query" deep
```

**Output**: Extended JSON with:
- All quick mode fields
- `contradictions`: Conflicting info found
- `consensus`: Widely-agreed points
- `gaps`: Areas needing more data

**Example:**
```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "React Server Components best practices" deep
```

### 3. Code Examples

Focus on practical code snippets and real-world implementations.

```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "your query" code
```

**Output**: Code-focused JSON with:
- `sources`: Prioritize GitHub, Stack Overflow, official docs
- `code_snippets`: Array of `{language, code, source_url, description}`
- `patterns`: Common implementation patterns
- `libraries`: Recommended tools/packages
- `gotchas`: Known pitfalls with solutions

**Example:**
```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "Playwright headless browser automation" code
```

## Workflow

### Integration with Deep-Research Agent

The deep-research agent can orchestrate multiple research sources in parallel:

1. **Local codebase** (Explorer agent)
2. **Web search** (existing deep-research)
3. **Gemini research** (this skill) ← NEW
4. **GitHub code search** (future)

Combine all sources for comprehensive context.

## Output Format

### Quick Mode
```json
{
  "queries_used": ["typescript error handling 2025", "typescript custom errors"],
  "sources": [
    {"title": "TypeScript Handbook: Error Handling", "url": "https://..."},
    {"title": "Modern Error Handling in TS", "url": "https://..."}
  ],
  "key_points": [
    "Use typed errors extending Error class",
    "Avoid throwing strings or plain objects",
    "Leverage exhaustive type checking"
  ],
  "quotes": [
    {
      "text": "TypeScript 5.0 introduced better error inference",
      "source_url": "https://..."
    }
  ],
  "summary": "Modern TypeScript error handling favors typed custom errors over generic Error. Key patterns include discriminated unions for error types and exhaustive checking for safety."
}
```

### Deep Mode
Adds:
```json
{
  "contradictions": ["Some sources recommend Error subclassing, others favor plain objects with type guards"],
  "consensus": ["All sources agree: avoid throwing strings"],
  "gaps": ["Limited guidance on async error handling in React Server Components"]
}
```

### Code Mode
Adds:
```json
{
  "code_snippets": [
    {
      "language": "typescript",
      "code": "class ValidationError extends Error { constructor(public field: string) { super(`Invalid: ${field}`); } }",
      "source_url": "https://...",
      "description": "Custom error with field context"
    }
  ],
  "patterns": ["Custom error classes", "Error discriminated unions"],
  "libraries": ["zod (validation)", "neverthrow (Result types)"],
  "gotchas": [
    {
      "issue": "Error.prototype breaks after compilation",
      "solution": "Set prototype manually: Object.setPrototypeOf(this, ValidationError.prototype)"
    }
  ]
}
```

## Error Handling

**Missing API auth:**
```
Error: Not authenticated. Run: gemini -p "test"
```
Solution: Run gemini once manually to auth.

**Rate limits (60/min or 1000/day):**
```
Error: Rate limit exceeded
```
Solution: Wait 1 minute or try next day. Consider Perplexity/Tavily MCP for higher limits.

**No results:**
```json
{"error": "No results found", "suggestion": "Rephrase query or try different keywords"}
```

**Gemini CLI not installed:**
```
Error: gemini command not found
```
Solution: `npm install -g @google/gemini-cli`

## Configuration

**Customize prompts:**
Edit templates in `scripts/research.sh`:
- `QUICK_TEMPLATE`
- `DEEP_TEMPLATE`
- `CODE_TEMPLATE`

**Change output location:**
- JSON (temp): `gemini-research-output.json` (current directory)
- Markdown (permanent): `docs/research/google/<timestamp>-<topic>.md`

Customize via `OUTPUT_FILE` and `RESEARCH_DIR` variables in script.

## Performance

- **Quick mode**: ~5-10 seconds (5-8 sources)
- **Deep mode**: ~10-20 seconds (10-15 sources)
- **Code mode**: ~8-15 seconds (code-focused)

Speed depends on:
- Query complexity
- Number of sources
- Network latency
- Gemini API load

## Comparison with Alternatives

| Feature | gemini-research | Perplexity API | Tavily API | WebSearch (Claude) |
|---------|-----------------|----------------|------------|-------------------|
| Cost | Free (1000/day) | $$ Paid | $$ Paid | Free (limited) |
| Citations | ✅ URLs | ✅ URLs | ✅ URLs | ✅ Titles only |
| Rate limit | 60/min, 1000/day | Higher (paid) | Higher (paid) | Lower |
| Output format | JSON | JSON | JSON | Text |
| Code examples | ✅ Via mode | ❌ | ❌ | ❌ |
| Setup | CLI install | API key | API key | Built-in |

## Tips

**Force Google Search grounding:**
Prompts explicitly say "Use google_web_search" to ensure tool usage.

**Demand citations:**
All prompts require URLs + quotes for verifiability.

**JSON for easy parsing:**
`--output-format json` enables programmatic analysis by Claude.

**Chain research:**
Run multiple queries, Claude synthesizes results.

**Example chaining:**
```bash
# 1. Get overview
bash scripts/research.sh "React Server Components" quick

# 2. Get code examples
bash scripts/research.sh "RSC data fetching patterns" code

# 3. Claude combines both JSONs for implementation
```

## Advanced: Integration Points

### With Deep-Research Agent

`plugins/development-lifecycle/agents/deep-context-gatherer.md` can orchestrate:

```markdown
1. Run local codebase search (Grep, Glob)
2. Run Gemini research (this skill)
3. Run GitHub code search (future)
4. Synthesize all sources
5. Return unified context
```

### With Feature Development

`/commands/develop-feature.md` can include research phase:

```markdown
Phase 1: Research
- Ask user for topic
- Run gemini-research skill
- Extract patterns from JSON
- Proceed to planning
```

## Troubleshooting

**Tool call flakiness:**
Gemini CLI sometimes ignores tool hints. Solution: Make prompts explicit ("Use google_web_search to...").

**Missing URLs:**
If JSON lacks source URLs, check prompt template includes "with citations and URLs".

**Empty results:**
Try broader query or different keywords. Gemini may filter very niche topics.

**JSON parsing errors:**
Gemini occasionally returns markdown-wrapped JSON. Script uses `jq` to extract.

## Notes

- Free tier may train on data (check Google's terms)
- Personal Google account sufficient (no paid plan needed)
- For production/high-volume: consider Perplexity/Tavily MCP
- Outputs:
  - JSON: `gemini-research-output.json` (temp, for backward compatibility)
  - Markdown: `docs/research/google/<timestamp>-<topic>.md` (permanent, human-readable)
- Script uses `--output-format json` for structured data
- Pass analysis as 3rd parameter for complete markdown (recommended)
- Analysis parameter optional but creates richer, more useful reports

---

## Output Schema

Research outputs follow standardized format for cross-skill consistency:

```markdown
# Research: [Topic]

**Metadata:** gemini-research • [Timestamp] • [Mode] • [N] sources

## Summary

[2-3 sentences from Gemini's synthesis of search results]

## Findings

### Key Findings (Quick/Deep mode)
- Fact 1 with context
- Fact 2 with context

### Code Examples (Code mode)
```language
// Working implementation
```

### Patterns & Best Practices (Code mode)
- Pattern 1
- Pattern 2

### Deep Analysis (Deep mode only)
**Contradictions:** Conflicting information found
**Consensus:** Widely-agreed points
**Knowledge Gaps:** Areas needing more research

### Detailed Quotes
> "Direct quote from source"
> — [source.com](url)

## Analysis

**Patterns:** [Claude's synthesis of common themes]
**Recommendations:** [Actionable advice ranked by confidence]
**Trade-offs:** [If comparing approaches]

## Sources

### Web
- [Title](url)
```

**Metadata fields:**
- skill: gemini-research
- timestamp: YYYYMMDDHHMMSS format
- mode: quick/deep/code
- sources: Total sources from Google Search

Reports automatically saved to `docs/research/google/TIMESTAMP-topic.md`

---

## Shared Utilities

This skill uses standardized utilities from `@knowledge-work/shared` (planned integration):

- `generateTimestamp()` - Consistent timestamp format (currently uses bash `date`)
- `sanitizeForFilename()` - Unified filename rules (currently uses bash `tr`)
- Future: Migrate bash timestamp/sanitization to shared TypeScript utilities

**Current implementation:**
```bash
TIMESTAMP=$(date '+%Y%m%d%H%M%S')
SANITIZED=$(echo "$QUERY" | tr '[:upper:]' '[:lower:]' | tr -cs '[:alnum:]' '-')
```

---

## Cross-Skill Integration

This skill can be orchestrated with others via the `web-research-specialist` agent:

**Example: Current Events Research**
```
User: "What's the latest on Anthropic's Claude 3.7?"
Agent: Launches gemini-research (Google-grounded news) + parallel-search (broader coverage) in parallel
Result: Unified report with recent announcements, benchmarks, community reactions, and official sources
```

**When to combine:**
- **gemini-research + gh-code-search**: Documentation + real code implementations
- **gemini-research + parallel-search**: Google results + broader web coverage
- **All three**: Maximum coverage with code, docs, and diverse perspectives

The agent handles deduplication, source ranking, and synthesis across all results.
