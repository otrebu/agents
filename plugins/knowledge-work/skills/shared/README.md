# Shared Research Utilities

Standardized utilities for knowledge-work research skills (`gh-code-search`, `gemini-research`, `parallel-search`).

## Purpose

Eliminates duplicate implementations across research skills by providing:

- **Consistent timestamps** - Single format (YYYYMMDDHHMMSS) across all outputs
- **Unified filename sanitization** - Same rules for all research file naming
- **Standardized markdown formatting** - Common structure with skill-specific flexibility
- **Type safety** - Shared TypeScript interfaces for research outputs

## Installation

```bash
cd plugins/knowledge-work/skills/shared
pnpm install
pnpm build
```

## Usage

### In TypeScript Skills

```typescript
import {
  generateTimestamp,
  sanitizeForFilename,
  saveResearchReport,
  formatResearchMarkdown,
  type ResearchOutput,
} from '../shared/dist/index.js';

// Generate consistent timestamp
const timestamp = generateTimestamp(); // "20251118143052"

// Sanitize query for filename
const sanitized = sanitizeForFilename("How do I debug webpack?");
// "how-do-i-debug-webpack"

// Save research report
const filepath = saveResearchReport(
  markdownContent,
  'github',
  'webpack debugging tips'
);
// docs/research/github/20251118143052-webpack-debugging-tips.md

// Format standardized output
const output: ResearchOutput = {
  metadata: { /* ... */ },
  summary: "...",
  findings: "...",
  analysis: { patterns: [], recommendations: [] },
  sources: []
};
const markdown = formatResearchMarkdown(output);
```

### In Bash Scripts

```bash
# Source the shared utilities (requires Node.js environment)
TIMESTAMP=$(node -e "import('./dist/index.js').then(m => console.log(m.generateTimestamp()))")
```

## Utilities Reference

### Timestamp

- `generateTimestamp()` - Returns YYYYMMDDHHMMSS format
- `generateISOTimestamp()` - Returns ISO 8601 for metadata

### Sanitizer

- `sanitizeForFilename(query)` - Lowercase, spaces→hyphens, max 50 chars
- `extractDomain(url)` - Extract domain from URL (removes www.)

### File Saver

- `saveResearchReport(content, directory, topic)` - Save with consistent naming
- `generateFilename(topic)` - Preview filename without saving

### Formatter

- `formatResearchMarkdown(data)` - Generate standardized markdown structure
- `formatMetadataHeader(skill, query, timestamp, duration)` - Minimal header for errors

## Type Definitions

### ResearchOutput

```typescript
interface ResearchOutput {
  metadata: ResearchMetadata;
  summary: string;
  findings: string; // Skill-specific markdown
  analysis: ResearchAnalysis;
  sources: SourceReference[];
}
```

See `src/types.ts` for complete type definitions.

## Standardized Output Format

All research skills generate this structure:

```markdown
# Research: [Topic]

**Metadata:** [Skill] • [Timestamp] • [Duration]s • [N] sources

## Summary

[2-3 sentences: What was found, key insight, confidence level]

## Findings

[Skill-specific content - flexible structure]

## Analysis

**Patterns:** [Common themes across sources]
**Recommendations:** [Actionable advice, ranked by confidence]
**Trade-offs:** [If comparing approaches]

## Sources

### GitHub
- [repo/file](url)

### Web
- [Title](url) • domain.com
```

## Design Principles

1. **High signal-to-noise** - Compact metadata, no redundant sections
2. **Skill flexibility** - Findings section adapts to skill needs
3. **Consistent structure** - Summary/Analysis/Sources always present
4. **Type safety** - Shared interfaces prevent drift

## Integration

Used by:
- `gh-code-search` - GitHub code pattern research
- `gemini-research` - Google Search via Gemini
- `parallel-search` - Multi-query web search
- `web-research-specialist` (agent) - Orchestrates all three

## Maintenance

When adding new utilities:

1. Add implementation to `src/utils/`
2. Export from `src/index.ts`
3. Update this README
4. Run `pnpm build`
5. Update dependent skills if interface changes
