---
allowed-tools: Bash(cloc:*), Bash(which cloc)
description: Analyze codebase size and language distribution using cloc
---

**Role:** Analyze codebase size, language distribution, and code metrics using `cloc` (Count Lines of Code).

**Goal:** Provide a comprehensive understanding of the codebase's scale, primary languages, and code distribution to help assess project complexity and composition.

## Context

Codebase statistics from cloc:

!`cloc . --exclude-dir=node_modules,.git,dist,build,coverage,out,.next,.turbo --quiet 2>/dev/null || echo "cloc not found. Please install: brew install cloc (macOS) or apt-get install cloc (Linux)"`

## Your task

Analyze the cloc output above following this process:

1. **Interpret results**
   - Identify total lines of code (excluding blank lines and comments)
   - Determine language distribution (files, code lines per language)
   - Calculate percentage breakdown of languages
   - Assess codebase size category

2. **Provide analysis** using this format:

```
## Codebase Size Analysis

**Total Lines of Code:** X,XXX lines

**Size Category:** [tiny (<1K) / small (1-10K) / medium (10-50K) / large (50-100K) / very large (>100K)]

**Language Distribution:**
- Language1: XX.X% (X,XXX lines)
- Language2: XX.X% (X,XXX lines)
- ...

**Key Insights:**
- Brief observation about the codebase composition
- Any notable patterns or characteristics (e.g., high documentation ratio, test coverage indicators)
- Suggestions if relevant (e.g., "Primarily a TypeScript/React project")

[Include the raw cloc output table for reference]
```

**Constraints:**
- Focus on source code and meaningful configuration files
- Distinguish between source code, configuration, and documentation
- Provide context-appropriate insights based on the language mix
- If cloc is not installed, inform the user with installation instructions
