---
name: gemini-research
description: Deep web research using Gemini CLI with Google Search grounding. Returns structured JSON with sources, quotes, and citations. Use when you need cost-effective web research with real-time data (news, docs, code examples). Free tier: 60 rpm, 1000 req/day, 1M-token context.
allowed-tools: Bash(bash:*/gemini-research/*), Bash(gemini:*), Read
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

## Research Modes

### 1. Quick Research (default)

Fast overview with 5-8 sources.

```bash
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "your query here"
```

**Output**: `gemini-research-output.json` with:
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

### Single Research Task

```bash
# 1. Run research
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "Vitest snapshot testing patterns"

# 2. Read output
# Script saves to: gemini-research-output.json

# 3. Claude analyzes JSON and synthesizes findings
```

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
Default: `gemini-research-output.json` (current directory)

Customize via `OUTPUT_FILE` variable in script.

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
- Output saved to `gemini-research-output.json` for Claude analysis
- Script uses `--output-format json` for structured data
