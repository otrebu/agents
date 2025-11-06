# Gemini Research Skill

Deep web research using Gemini CLI with Google Search grounding.

## Quick Start

```bash
# Install Gemini CLI first
npm install -g @google/gemini-cli

# Authenticate (one-time)
gemini -p "test" --output-format json

# Run research
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "your query" [quick|deep|code]
```

## Modes

- **quick**: Fast overview (5-8 sources) - DEFAULT
- **deep**: Comprehensive (10-15 sources, contradictions, gaps)
- **code**: Code examples and patterns

## Examples

```bash
# Quick research
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "React Server Components"

# Deep analysis
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "TypeScript error handling" deep

# Code examples
bash plugins/knowledge-work/skills/gemini-research/scripts/research.sh "Vitest mocking patterns" code
```

## Output

Results saved to `gemini-research-output.json` with:
- Search queries used
- Sources (title + URL)
- Key points
- Quotes with citations
- Summary

Deep mode adds: contradictions, consensus, gaps
Code mode adds: code_snippets, patterns, libraries, gotchas

## Documentation

See `SKILL.md` for complete instructions.
