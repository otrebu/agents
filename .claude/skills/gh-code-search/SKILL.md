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
