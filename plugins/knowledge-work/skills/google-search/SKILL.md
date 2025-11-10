---
name: google-search
description: Quick Google searches via Gemini CLI. Use when user asks to "google X", "search for X", "look up X online", or needs fast web lookup. Returns concise answer with sources in <5s.
allowed-tools: Bash(plugins/knowledge-work/skills/google-search/scripts/*), Bash(gemini:*)
---

# Google Search

Fast Google searches via Gemini CLI with Google Search grounding. Simple, conversational answers with sources.

## Overview

Lightweight alternative to gemini-research for quick lookups. When user wants fast answer from web, not deep analysis.

**Use when:**
- User says "google X" or "search for X"
- Need quick fact/definition/status
- Fast lookup (<5s vs 10-20s for research)
- Conversational answer (not JSON)

**Don't use when:**
- Need structured analysis → use `gemini-research` skill
- Need code examples → use `gemini-research` with `code` mode
- Need deep/contradictory sources → use `gemini-research` with `deep` mode

## Quick Start

```bash
bash plugins/knowledge-work/skills/google-search/scripts/search.sh "your query"
```

**Example:**
```bash
bash plugins/knowledge-work/skills/google-search/scripts/search.sh "TypeScript 5.7 release date"
```

**Output:** Concise 2-3 paragraph answer + 3-5 source URLs.

## Usage Patterns

### Simple Lookup
```bash
# User: "Google the capital of Mongolia"
bash plugins/knowledge-work/skills/google-search/scripts/search.sh "capital of Mongolia"
```

### Current Status
```bash
# User: "Look up latest Node.js LTS version"
bash plugins/knowledge-work/skills/google-search/scripts/search.sh "latest Node.js LTS version 2025"
```

### Quick Fact Check
```bash
# User: "Search for Python 3.13 new features"
bash plugins/knowledge-work/skills/google-search/scripts/search.sh "Python 3.13 new features"
```

## How It Works

Script uses Gemini CLI's `google_web_search` grounding:

1. Sends query to Gemini with explicit search instruction
2. Gemini calls Google Search API
3. Returns conversational answer with citations
4. JSON output parsed for response text

**Speed:** ~3-7 seconds (much faster than research modes)

## Output Format

Text response with:
- 2-3 paragraph summary
- Key facts
- 3-5 source URLs at end

**Example output:**
```
TypeScript 5.7 was released on January 15, 2025. Major features include...

The release focuses on improved type inference and performance optimizations...

Sources:
- https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/
- https://github.com/microsoft/TypeScript/releases/tag/v5.7.0
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html
```

## Comparison with gemini-research

| Feature | google-search | gemini-research |
|---------|---------------|-----------------|
| Speed | ~3-7s | ~10-20s |
| Output | Text | Structured JSON |
| Use case | Quick lookups | Deep analysis |
| Sources | 3-5 URLs | 10-15+ with quotes |
| Modes | Single | Quick/Deep/Code |

**Rule of thumb:**
- Quick answer → `google-search`
- Analysis/synthesis → `gemini-research`

## Prerequisites

**Gemini CLI installed:**
```bash
npm install -g @google/gemini-cli
```

**Authentication:**
First run requires Google login:
```bash
gemini -p "test" --output-format json
```

Follow browser auth. Free tier: 60 req/min, 1000/day.

## Error Handling

**Not authenticated:**
```
Error: Not authenticated
```
→ Run `gemini -p "test"` once to auth

**Rate limit:**
```
Error: Rate limit exceeded
```
→ Wait 1min or use next day

**No gemini command:**
```
gemini: command not found
```
→ `npm install -g @google/gemini-cli`

## Tips

**Be specific:** Better queries = better results
- ❌ "react hooks"
- ✅ "react useEffect cleanup pattern 2025"

**Add year for freshness:**
- ✅ "Next.js 15 app router examples 2025"

**Conversational queries work:**
- ✅ "how to fix CORS errors in Express"

## Notes

- Free tier may train on data (check Google terms)
- Personal Google account sufficient
- For production/high-volume: consider paid APIs
- Script outputs to stdout, errors to stderr
