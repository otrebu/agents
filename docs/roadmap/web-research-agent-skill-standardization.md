# Web Research Agent + Skill Standardization Plan

**Status:** Planning
**Created:** 2025-11-17
**Goal:** Create unified web research system with consistent output format and orchestrating agent

---

## Executive Summary

Create a web research specialist agent that orchestrates three existing skills (gh-code-search, gemini-research, parallel-search) which currently have inconsistent output formats and workflows. Standardize all three skills to produce consistent markdown, eliminate fragile post-processing patterns, and enable parallel execution with unified synthesis.

**Key Changes:**
- Shared utilities module for timestamp, sanitization, formatting
- Minimal unified output template (high signal-to-noise)
- New orchestrator agent following Anthropic prompting standards
- Remove placeholder pattern from gemini-research
- All skills generate complete markdown (no post-editing)

---

## Background: Current State Analysis

### Existing Skills

**gh-code-search (GitHub Code Search)**
- Purpose: Search GitHub for real-world code examples
- Tech: TypeScript + pnpm + gh CLI + Octokit
- Execution: Claude-orchestrated multi-query workflow (sequential)
- Output: Comprehensive markdown with patterns, trade-offs, recommendations
- Storage: `docs/research/github/TIMESTAMP-topic.md`
- Maturity: Most detailed workflow, best documentation

**gemini-research (Google Search via Gemini)**
- Purpose: Web research with Google Search grounding
- Tech: Bash + Gemini CLI + jq
- Execution: Single script with modes (quick/deep/code)
- Output: JSON + Markdown with PLACEHOLDER for Claude analysis
- Storage: `docs/research/google/TIMESTAMP-topic.md` + temp JSON
- Maturity: Good docs, fragile post-processing requirement

**parallel-search (Parallel API Search)**
- Purpose: Multi-query web search with extended excerpts
- Tech: TypeScript + pnpm + Parallel API
- Execution: Single API call, multi-query support
- Output: Basic markdown with ranked URLs and excerpts
- Storage: `docs/research/parallel/TIMESTAMP-topic.md`
- Maturity: Simplest workflow, least prescriptive

### Critical Inconsistencies

**1. Output Format**
- Three completely different markdown structures
- Different metadata formats
- Inconsistent section headers
- Variable depth of analysis

**2. Workflow Patterns**
- gh-code-search: Claude orchestrates 6-step workflow
- gemini-research: Script generates, Claude must Edit placeholder
- parallel-search: Script generates complete output

**3. Post-Processing**
- gh-code-search: No post-processing needed
- gemini-research: **MUST** Edit placeholder section (brittle, error-prone)
- parallel-search: Optional synthesis (not enforced)

**4. File Naming**
- Three different sanitization implementations
- Inconsistent timestamp sources
- Same query could produce different filenames

**5. Integration Conflicts**
- Unclear which skills need post-processing
- No unified interface for orchestration
- No cross-skill deduplication
- No result merging capability

---

## Design Principles

### Prompting Standards (from meta-work/skills/prompting)

**Context Engineering Core Principles:**
1. Context is finite - optimize signal-to-noise ratio
2. Be direct and specific - imperative voice, no "might/could/should"
3. Use structured markdown sections
4. Progressive discovery - just-in-time loading
5. Sub-agent architecture - delegate with minimal context
6. Clear, minimal language - no verbose explanations
7. Concrete examples - show, don't tell

**Applied to This Project:**
- Agent prompt must be direct, actionable, with concrete examples
- Output template must be minimal (high-signal sections only)
- No redundant information across skills
- Sub-agent orchestration for complex research

---

## Solution Architecture

### Phase 1: Shared Utilities Foundation

**Create:** `plugins/knowledge-work/skills/shared/`

```
shared/
├── package.json              # TypeScript project
├── tsconfig.json
├── src/
│   ├── utils/
│   │   ├── timestamp.ts      # generateTimestamp(): string (YYYYMMDDHHMMSS)
│   │   ├── sanitizer.ts      # sanitizeForFilename(query: string): string
│   │   └── file-saver.ts     # saveResearchReport(content, dir, topic): string
│   ├── types.ts              # Shared interfaces
│   └── formatter.ts          # formatResearchMarkdown(data): string
└── README.md
```

**Key Exports:**

```typescript
// types.ts
export interface ResearchMetadata {
  skill: 'gh-code-search' | 'gemini-research' | 'parallel-search';
  timestamp: string; // YYYYMMDDHHMMSS
  query: {
    original: string;
    sanitized: string;
    queries_executed?: string[];
  };
  execution: {
    startTime: string; // ISO 8601
    endTime: string;
    durationMs: number;
    mode?: string;
  };
  results: {
    count: number;
    sources: number;
  };
}

export interface ResearchOutput {
  metadata: ResearchMetadata;
  summary: string;
  findings: string; // Skill-specific markdown content
  analysis: {
    patterns: string[];
    recommendations: string[];
    tradeoffs?: string[];
  };
  sources: SourceReference[];
}

export interface SourceReference {
  title: string;
  url: string;
  domain: string;
  relevance?: number;
}

// timestamp.ts
export function generateTimestamp(): string {
  // Returns YYYYMMDDHHMMSS format
}

// sanitizer.ts
export function sanitizeForFilename(query: string): string {
  // Rules: lowercase, spaces → hyphens, remove special chars, max 50 chars
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    .replace(/^-|-$/g, '');
}

// file-saver.ts
export function saveResearchReport(
  content: string,
  directory: 'github' | 'google' | 'parallel' | 'unified',
  topic: string
): string {
  const timestamp = generateTimestamp();
  const sanitized = sanitizeForFilename(topic);
  const filename = `${timestamp}-${sanitized}.md`;
  const filepath = `docs/research/${directory}/${filename}`;
  // Write file logic
  return filepath;
}

// formatter.ts
export function formatResearchMarkdown(data: ResearchOutput): string {
  // Generates standardized markdown template
}
```

---

### Phase 2: Standardized Output Template

**Unified Markdown Structure (all skills):**

```markdown
# Research: [Topic]

**Metadata:** [Skill] • [Timestamp] • [Duration]s • [N] sources

## Summary

[2-3 sentences: What was found, key insight, confidence level]

## Findings

[Skill-specific content with variable structure]

### [Skill-Specific Sections]

**gh-code-search:**
- Pattern Analysis
- Common Approaches
- Key Code Examples

**gemini-research:**
- Key Points
- Code Examples (if code mode)
- Contradictions (if deep mode)

**parallel-search:**
- Ranked Results
- Top Domains
- Excerpts

## Analysis

**Patterns:** [What's common across sources]

**Recommendations:** [Actionable next steps, ranked by confidence]

**Trade-offs:** [If comparing approaches, table format]

## Sources

### GitHub
- [repo/file:line](url)

### Web
- [Title](url) • domain.com
```

**Key Features:**
- Metadata in compact single line
- Summary first (high-value info)
- Skill-specific Findings section (flexible)
- Consistent Analysis section (all skills)
- Sources at end (reference material)

**Comparison to Current:**

| Section | Current | New | Rationale |
|---------|---------|-----|-----------|
| Metadata | Verbose block | Compact line | Signal-to-noise |
| Search Strategy | Full section | In metadata | Avoid redundancy |
| Executive Summary | Separate section | Merged to Summary | Eliminate overlap |
| Key Learnings | Subsection | Merged to Analysis | Simplify structure |
| Findings | Inconsistent | Flexible but labeled | Accommodate skill differences |

---

### Phase 3: Web Research Specialist Agent

**File:** `plugins/knowledge-work/agents/web-research-specialist.md`

**Prompt Structure:**

```markdown
---
name: web-research-specialist
description: Orchestrate web research using gh-code-search, gemini-research, and parallel-search skills. Use for debugging issues, finding implementation patterns, comparative analysis, or comprehensive topic research. Executes skills in parallel, deduplicates sources, synthesizes unified report.
model: sonnet
permissionMode: default
skills: gh-code-search, gemini-research, parallel-search
---

# Web Research Specialist

Orchestrate multi-source web research combining GitHub code search, Google Search via Gemini, and parallel web search APIs.

## Available Skills

- `gh-code-search` - GitHub code examples, implementation patterns
- `gemini-research` - Google Search via Gemini (quick/deep/code modes)
- `parallel-search` - Multi-query web search with extended excerpts

## Workflow

1. Analyze request - Identify research type
2. Select skills - Use decision matrix below
3. Execute in parallel - Launch all selected skills simultaneously
4. Aggregate results - Deduplicate sources across skills
5. Synthesize report - Save to `docs/research/unified/TIMESTAMP-topic.md`

## Decision Matrix

| Request Type | Skills | Parallel? |
|--------------|--------|-----------|
| Code examples | gh-code-search | N/A |
| Debugging errors | gemini-research + gh-code-search | Yes |
| General research | gemini-research OR parallel-search | No |
| Comparative analysis | All 3 | Yes |
| Current events | gemini-research + parallel-search | Yes |

## Examples

**Example 1: Debugging**
Input: "Getting 'Module not found' error with webpack 5"
Actions: Launch gemini-research and gh-code-search in parallel, analyze error patterns, deduplicate sources
Output: Unified report with common solutions, code examples, and ranked recommendations

**Example 2: Implementation Research**
Input: "How do people implement infinite scrolling?"
Actions: Launch gh-code-search for real-world implementations, analyze patterns
Output: Report with common approaches, trade-offs, code examples from production repositories

**Example 3: Comparative Analysis**
Input: "Compare state management solutions"
Actions: Launch all 3 skills in parallel, collect data on Redux, MobX, Zustand, Recoil
Output: Unified report with comparison table, use cases, community sentiment, code examples

## Constraints

- Execute skills in parallel when multiple selected
- Deduplicate by exact URL match
- Note sources appearing in multiple outputs (indicates high relevance)
- Maximum 3 skills per request
- Always save unified report

## Error Handling

- Skill failure: Continue with remaining skills, note in report metadata
- No results: Refine queries, try different skill combination
- Rate limits: Note in metadata, suggest retry timing
- Duplicate research: Check existing reports in `docs/research/unified/` first
```

**Key Design Decisions:**

1. **Frontmatter Format** - Uses new subagent structure with `skills` field for auto-loading
2. **Decision Matrix** - Clear rules for skill selection
3. **Parallel Execution** - Explicit when to run concurrent
4. **Concrete Examples** - Three complete scenarios with input/output
5. **Direct Language** - Imperative voice, no verbose descriptions
6. **Sub-Agent Pattern** - Agent orchestrates, skills execute

---

### Phase 4: Skill Updates

#### 4.1 gh-code-search

**Changes:**
- Import shared utils: `import { generateTimestamp, sanitizeForFilename } from '../shared'`
- Update Step 6 in SKILL.md to use shared timestamp
- Update output formatting to match unified template
- Keep existing rich content structure

**Files Modified:**
- `SKILL.md` - Document shared utils usage, add output schema
- `scripts/search.ts` - Import and use shared utilities

**No Breaking Changes:**
- Existing orchestration workflow unchanged
- Still Claude-driven multi-query approach
- Rich output structure preserved

#### 4.2 gemini-research

**Changes (Breaking):**
- **Remove placeholder pattern** - Scripts generate complete markdown
- Claude generates analysis BEFORE calling script (pass as param)
- Import shared utils
- Adopt unified markdown template
- Remove temp JSON output (only markdown)

**Migration:**

**Before:**
```bash
# 1. Run script (generates placeholder)
bash scripts/research.sh "query" quick

# 2. Claude must Edit placeholder (fragile!)
# If interrupted, incomplete markdown
```

**After:**
```bash
# 1. Claude generates analysis first
# 2. Pass to script
bash scripts/research.sh "query" quick --analysis "Claude's analysis text"

# Script generates complete markdown (atomic write)
```

**Files Modified:**
- `SKILL.md` - Remove placeholder workflow, update to new pattern
- `scripts/research.sh` - Accept `--analysis` parameter, remove placeholder
- Update all mode templates (quick/deep/code)

**Benefits:**
- No Edit tool dependency
- Atomic file writes (no incomplete states)
- Robust to workflow interruptions

#### 4.3 parallel-search

**Changes:**
- Import shared utils
- Add auto-save to file (currently just documented)
- Add Analysis section to output
- Adopt unified template

**Files Modified:**
- `SKILL.md` - Document auto-save behavior
- `scripts/search.ts` - Add file persistence using shared utils
- `formatter.ts` - Update markdown template

**Migration:**

**Before:**
```typescript
// Just returns markdown string, Claude must save manually
console.log(markdown);
```

**After:**
```typescript
import { saveResearchReport } from '../../shared';

const filepath = saveResearchReport(markdown, 'parallel', query);
console.log(`Research saved to ${filepath}`);
```

---

### Phase 5: Documentation Updates

**All SKILL.md files get:**

1. **Output Schema section:**
```markdown
## Output Schema

All research outputs follow standardized format:

[Include unified template]

**Metadata fields:**
- skill: [name]
- timestamp: YYYYMMDDHHMMSS format
- duration: Execution time in seconds
- sources: Total unique sources found

**Analysis section:**
Generated by Claude, includes:
- Patterns: Common themes across sources
- Recommendations: Actionable advice ranked by confidence
- Trade-offs: For comparative research
```

2. **Shared Utilities section:**
```markdown
## Shared Utilities

This skill uses standardized utilities from `plugins/knowledge-work/skills/shared/`:

- `generateTimestamp()` - Consistent timestamp format
- `sanitizeForFilename()` - Unified filename rules
- `saveResearchReport()` - Standardized file persistence

See shared module README for details.
```

3. **Cross-Skill Integration section:**
```markdown
## Cross-Skill Integration

This skill can be orchestrated with others via the `web-research-specialist` agent:

[Show example of combined usage]
```

**New Files:**

- `plugins/knowledge-work/skills/shared/README.md` - Shared utilities documentation
- `plugins/knowledge-work/agents/web-research-specialist.md` - Agent prompt

---

## Implementation Plan

### Step 1: Create Shared Module ✅

1. Create directory structure
2. Implement utilities (timestamp, sanitizer, file-saver)
3. Define TypeScript interfaces
4. Write formatter base
5. Add tests
6. Document in README

**Estimated Time:** 2-3 hours

### Step 2: Update parallel-search ✅

Start with simplest skill (no breaking changes):

1. Install shared as dependency
2. Import utilities in scripts/search.ts
3. Add auto-save functionality
4. Update SKILL.md with new sections
5. Test output format

**Estimated Time:** 1-2 hours

### Step 3: Update gh-code-search ✅

1. Install shared as dependency
2. Update Step 6 to use shared timestamp
3. Update SKILL.md with new sections
4. Test orchestration workflow unchanged

**Estimated Time:** 1-2 hours

### Step 4: Update gemini-research (Breaking) ✅

Most complex change due to removing placeholder:

1. Install shared as dependency
2. Modify research.sh to accept --analysis parameter
3. Update all prompt templates (remove placeholder generation)
4. Update SKILL.md (remove Edit workflow)
5. Add migration guide for existing workflows
6. Test all three modes

**Estimated Time:** 3-4 hours

### Step 5: Create Agent ✅

1. Write web-research-specialist.md following prompting standards
2. Add decision matrix
3. Write three concrete examples
4. Document parallel execution pattern
5. Add error handling section

**Estimated Time:** 2-3 hours

### Step 6: Integration Testing ✅

1. Test each skill individually with new format
2. Test agent orchestrating single skill
3. Test agent orchestrating multiple skills in parallel
4. Test deduplication across skills
5. Verify unified report generation

**Estimated Time:** 2-3 hours

### Step 7: Documentation ✅

1. Update all SKILL.md files with new sections
2. Create shared module README
3. Add examples to agent prompt
4. Update integration notes
5. Create migration guide (especially for gemini-research)

**Estimated Time:** 1-2 hours

**Total Estimated Time:** 14-20 hours

---

## Breaking Changes & Migration

### For Users

**gemini-research workflow change:**

**Before:**
```markdown
User asks for research → Claude runs script → Claude must Edit placeholder
Risk: If Claude forgets Edit step, incomplete markdown
```

**After:**
```markdown
User asks for research → Claude analyzes → Claude passes analysis to script → Complete markdown
Benefit: Atomic, robust, no manual Edit step
```

**Action Required:** None (Claude handles new workflow automatically)

### For Developers

**If extending skills:**

**Before:**
- Each skill implemented own timestamp/sanitizer
- Inconsistent file naming logic

**After:**
- Import from shared module
- Single source of truth for common operations

```typescript
// New pattern
import { generateTimestamp, sanitizeForFilename, saveResearchReport } from '../shared';

const filepath = saveResearchReport(markdown, 'github', userQuery);
```

---

## Success Criteria

**Phase 1-4 (Standardization):**
- ✅ All three skills produce consistent markdown structure
- ✅ All use shared utilities (no duplicate implementations)
- ✅ No manual post-processing required (no Edit patterns)
- ✅ File naming consistent across skills
- ✅ Tests pass for all skills

**Phase 5 (Agent):**
- ✅ Agent correctly selects skills based on request type
- ✅ Agent executes multiple skills in parallel when needed
- ✅ Agent deduplicates sources across skill outputs
- ✅ Agent generates unified synthesis report
- ✅ All examples in agent prompt work correctly

**Phase 6 (Documentation):**
- ✅ All SKILL.md files updated with new sections
- ✅ Shared module has README
- ✅ Agent prompt follows prompting standards checklist
- ✅ Migration guide exists for gemini-research

**Quality Gates:**
- Code passes TypeScript compilation
- All tests pass
- Agent prompt validated against prompting standards
- Output format validated against unified template
- Cross-skill integration tested end-to-end

---

## Risks & Mitigations

### Risk 1: Gemini-research breaking change disrupts workflows

**Impact:** High (changes established pattern)
**Mitigation:**
- Add deprecation notice before removing placeholder
- Provide clear migration guide
- Keep old script as backup for one release cycle

### Risk 2: Shared utilities become dependency bottleneck

**Impact:** Medium (all skills depend on it)
**Mitigation:**
- Keep shared module minimal (only common utilities)
- Version independently from skills
- No skill-specific logic in shared module

### Risk 3: Parallel execution conflicts with rate limits

**Impact:** Medium (could hit API limits faster)
**Mitigation:**
- Agent detects rate limit errors
- Falls back to sequential execution
- Documents rate limit considerations per skill

### Risk 4: Unified template too rigid for skill differences

**Impact:** Medium (skills have different output needs)
**Mitigation:**
- Keep "Findings" section flexible (skill-specific)
- Standardize only metadata, summary, analysis, sources
- Allow skill-specific subsections in Findings

---

## Future Enhancements

**Not in scope for v1, but planned:**

1. **Result Caching**
   - Detect duplicate queries
   - Return cached results if recent
   - Save API costs

2. **Quality Scoring**
   - Score source credibility
   - Rank findings by confidence
   - Flag low-quality sources

3. **Progress Indicators**
   - Show real-time progress for long operations
   - Partial results preview
   - Estimated time remaining

4. **Interactive Query Refinement**
   - Agent suggests query improvements
   - User can adjust before execution
   - Iterative research workflow

5. **Cross-Research Analysis**
   - Compare findings across multiple research sessions
   - Identify patterns over time
   - Build knowledge graph

---

## Appendix A: Prompting Standards Checklist

Agent prompt validated against Anthropic standards:

- [x] Uses Markdown headers for organization
- [x] Clear, direct, minimal language
- [x] No redundant information
- [x] Instructions are actionable and specific
- [x] Concrete examples included
- [x] Clear constraints defined
- [x] Uses sub-agent architecture
- [x] Focuses on high-signal tokens only
- [x] Imperative voice (no "might", "could", "should")
- [x] Structured lists for complex info

---

## Appendix B: File Manifest

**New Files:**
```
plugins/knowledge-work/skills/shared/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── utils/
    │   ├── timestamp.ts
    │   ├── sanitizer.ts
    │   └── file-saver.ts
    ├── types.ts
    └── formatter.ts

plugins/knowledge-work/agents/
└── web-research-specialist.md

docs/research/
└── unified/  (new directory)
```

**Modified Files:**
```
plugins/knowledge-work/skills/gh-code-search/
├── SKILL.md
└── scripts/search.ts

plugins/knowledge-work/skills/gemini-research/
├── SKILL.md
└── scripts/research.sh

plugins/knowledge-work/skills/parallel-search/
├── SKILL.md
├── scripts/search.ts
└── formatter.ts
```

---

## Appendix C: References

**Internal:**
- Prompting standards: `plugins/meta-work/skills/prompting/SKILL.md`
- Prompt engineering guide: `plugins/meta-work/docs/HOW_TO_PROMPT_ENGINEERING.md`

**External:**
- Anthropic: "Effective Context Engineering for AI Agents"
- Claude Code best practices

---

**Document Version:** 1.0
**Last Updated:** 2025-11-17
**Status:** Ready for implementation
