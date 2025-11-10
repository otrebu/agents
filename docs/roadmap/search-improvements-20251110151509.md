# Search and Research Improvements

**Date:** 2025-11-10
**Status:** Gap analysis and recommendations
**Reference:** `current-search-functionality-20251110151509.md`

---

## Executive Summary

The web-research-specialist agent demonstrates a sophisticated research methodology that our current implementation partially supports but lacks in key areas:

**What we have:** Strong individual tools (gemini-research, gh-code-search) with good quality focus
**What we're missing:** Unified orchestration, query strategy templates, diverse source integration, systematic compilation

**Key gaps:**
1. No systematic multi-query generation (5-10 variations)
2. Limited source diversity (mostly web search, some GitHub)
3. No Reddit, Stack Overflow, forum-specific searches
4. Fragmented compilation patterns
5. No quality assurance across sources
6. Manual orchestration burden on Claude

---

## Feature Comparison

### 1. Query Generation

#### web-research-specialist
- ✅ Generates 5-10 query variations automatically
- ✅ Covers multiple research angles systematically
- ✅ Includes technical terms, error messages, misspellings
- ✅ Considers how different people describe same issue
- ✅ Searches for both problem AND solutions

#### Current Implementation
- ⚠️ **gh-code-search**: Claude generates 3-5 queries manually (documented pattern)
- ⚠️ **gemini-research**: Single query per invocation
- ⚠️ **deep-research**: Claude generates 5-7 keywords manually
- ❌ No systematic query variation templates
- ❌ No consideration of misspellings or alternative phrasings
- ❌ No automatic problem+solution pairing

**Gap:** Manual query generation, no systematic variation strategy, inconsistent coverage

**Recommendation:**
- Create query strategy templates by research type (debugging, comparison, implementation, etc.)
- Build query variation generator function (synonyms, related terms, error patterns)
- Document systematic approach for each tool/agent

---

### 2. Source Prioritization

#### web-research-specialist
- ✅ GitHub Issues (open and closed)
- ✅ Reddit (r/programming, r/webdev, topic-specific)
- ✅ Stack Overflow and Stack Exchange sites
- ✅ Technical forums and discussion boards
- ✅ Official documentation and changelogs
- ✅ Blog posts and tutorials
- ✅ Hacker News discussions

#### Current Implementation
- ✅ **WebSearch**: General web (no source filtering)
- ✅ **gemini-research**: Google Search (all sources, no prioritization)
- ✅ **gh-code-search**: GitHub repositories only
- ❌ No Reddit-specific searches
- ❌ No Stack Overflow-specific searches
- ❌ No forum-specific searches
- ❌ No Hacker News searches
- ❌ No changelog/release note searches

**Gap:** Limited to general web + GitHub code, missing key developer communities

**Recommendation:**
- Add site-specific search patterns: `site:reddit.com/r/programming`
- Add site-specific search patterns: `site:stackoverflow.com`
- Add site-specific search patterns: `site:news.ycombinator.com`
- Consider GitHub Issues search (not just code)
- Document source prioritization strategy per research type

---

### 3. Information Gathering Methodology

#### web-research-specialist
- ✅ Reads beyond first few results
- ✅ Looks for patterns across sources
- ✅ Pays attention to dates for relevance
- ✅ Notes different approaches to same problem
- ✅ Identifies authoritative sources
- ✅ Distinguishes official vs community solutions

#### Current Implementation
- ✅ **gh-code-search**: Quality ranking (stars, recency, code structure)
- ✅ **gemini-research**: Citations with URLs and quotes
- ✅ **deep-research**: Diverse keyword strategies
- ⚠️ **WebSearch**: Basic results, no deep reading
- ❌ No systematic pattern identification across tools
- ❌ No authority scoring
- ❌ No official vs community distinction
- ❌ No cross-source correlation

**Gap:** Tools gather data well individually, but no unified pattern analysis

**Recommendation:**
- Create pattern identification framework
- Add authority scoring (official docs > verified authors > community)
- Build cross-source correlation logic
- Document when to read deeply vs skim

---

### 4. Compilation Standards

#### web-research-specialist
- ✅ Organize by relevance and reliability
- ✅ Provide direct links to sources
- ✅ Summarize key findings upfront
- ✅ Include relevant code snippets or configs
- ✅ Note conflicting information
- ✅ Highlight most promising solutions
- ✅ Include timestamps/versions

#### Current Implementation
- ✅ **gh-code-search**: Excellent compilation (summary, trade-offs, all URLs)
- ✅ **gemini-research**: Structured JSON with quotes, sources, contradictions (deep mode)
- ⚠️ **deep-research**: Basic compilation, optional file output
- ⚠️ **deep-context-gatherer**: Combined web+local, but limited structure
- ❌ No standardized compilation format across tools
- ❌ No systematic conflict identification in WebSearch results
- ❌ No version/timestamp tracking in web searches

**Gap:** Inconsistent compilation quality, missing standards

**Recommendation:**
- Define unified compilation template for all research outputs
- Add conflict identification to all research workflows
- Require timestamps/versions in all outputs
- Create reliability scoring system

---

### 5. Debugging Assistance

#### web-research-specialist
- ✅ Search exact error messages in quotes
- ✅ Look for issue templates matching problem pattern
- ✅ Find workarounds, not just explanations
- ✅ Check for known bugs with patches/PRs
- ✅ Look for similar issues (not exact matches)

#### Current Implementation
- ✅ **gemini-research**: Can search error messages, find workarounds
- ✅ **gh-code-search**: Can find similar code patterns
- ❌ No systematic debugging workflow
- ❌ No issue template matching
- ❌ No PR/patch identification
- ❌ No similarity search (only exact or broad)

**Gap:** Missing structured debugging research workflow

**Recommendation:**
- Create debugging-specific research agent
- Add GitHub Issues search to gh-code-search
- Build error pattern matching system
- Document debugging research methodology

---

### 6. Comparative Research

#### web-research-specialist
- ✅ Create structured comparisons with clear criteria
- ✅ Find real-world usage examples and case studies
- ✅ Look for performance benchmarks
- ✅ Identify trade-offs and decision factors
- ✅ Include both popular and contrarian views

#### Current Implementation
- ⚠️ **gh-code-search**: Excellent trade-off analysis for code patterns
- ⚠️ **gemini-research**: Deep mode finds contradictions and consensus
- ❌ No structured comparison templates
- ❌ No systematic benchmark gathering
- ❌ No decision matrix generation
- ❌ No contrarian view identification

**Gap:** Tools can gather data, but no standardized comparison methodology

**Recommendation:**
- Create comparison research agent
- Define comparison template (criteria, benchmarks, trade-offs, recommendations)
- Add benchmark search patterns
- Document how to identify and evaluate contrarian views

---

### 7. Quality Assurance

#### web-research-specialist
- ✅ Verify information across multiple sources
- ✅ Clearly indicate speculative/unverified info
- ✅ Date-stamp findings for currency
- ✅ Distinguish official vs community workarounds
- ✅ Note credibility of sources

#### Current Implementation
- ✅ **gh-code-search**: Stars/recency as quality signals
- ✅ **gemini-research**: Citations required, contradictions noted
- ❌ No cross-source verification workflow
- ❌ No speculative info flagging
- ❌ No systematic date-stamping
- ❌ No credibility scoring system
- ❌ No official vs community distinction

**Gap:** Individual tools have quality measures, but no unified QA framework

**Recommendation:**
- Build cross-source verification system
- Create credibility scoring rubric
- Require date-stamps in all outputs
- Add confidence levels (verified, likely, speculative)
- Implement official vs community tagging

---

### 8. Output Format

#### web-research-specialist
Structured as:
1. Executive Summary (key findings in 2-3 sentences)
2. Detailed Findings (organized by relevance/approach)
3. Sources and References (with direct links)
4. Recommendations (if applicable)
5. Additional Notes (caveats, warnings, areas needing more research)

#### Current Implementation
- ✅ **gh-code-search**: Similar structure (summary, analysis, trade-offs, recommendations, all URLs)
- ✅ **gemini-research**: Structured JSON (queries, sources, key_points, quotes, summary)
- ⚠️ **deep-research**: Basic structure (summary, findings, recommendations, sources)
- ❌ No unified output format across all tools
- ❌ No "Additional Notes" section consistently
- ❌ No caveats/warnings section

**Gap:** Inconsistent output formats, missing sections

**Recommendation:**
- Define unified research report template
- Require all 5 sections in every research output
- Add caveats/warnings/limitations section to all outputs
- Create output format validator

---

## Missing Features Summary

### High Priority

1. **Query Strategy Templates** ⭐⭐⭐
   - **What:** Predefined templates for debugging, comparison, implementation research
   - **Why:** Ensures comprehensive coverage, reduces Claude orchestration burden
   - **Effort:** Medium (design templates, document patterns)

2. **Source Diversity** ⭐⭐⭐
   - **What:** Add Reddit, Stack Overflow, Hacker News, forum searches
   - **Why:** Developer communities have unique problem-solving knowledge
   - **Effort:** Low (mostly query patterns, use existing WebSearch/gemini-research)

3. **Unified Compilation Format** ⭐⭐⭐
   - **What:** Standard template for all research outputs
   - **Why:** Consistent quality, easier to consume, systematic completeness
   - **Effort:** Low (define template, update tools)

4. **Cross-Source Verification** ⭐⭐
   - **What:** Compare findings across sources, identify consensus and conflicts
   - **Why:** Quality assurance, confidence in recommendations
   - **Effort:** High (requires coordination layer)

5. **GitHub Issues Integration** ⭐⭐
   - **What:** Search GitHub Issues, not just code
   - **Why:** Bug reports, feature discussions, workarounds documented in issues
   - **Effort:** Medium (extend gh-code-search or create new skill)

### Medium Priority

6. **Debugging Research Workflow** ⭐⭐
   - **What:** Specialized workflow for error debugging
   - **Why:** Common use case, benefits from structured approach
   - **Effort:** Medium (create agent, integrate existing tools)

7. **Comparison Research Agent** ⭐
   - **What:** Structured tool/library comparison workflow
   - **Why:** Frequent developer need, benefits from standardization
   - **Effort:** Medium (create agent, define comparison template)

8. **Authority/Credibility Scoring** ⭐
   - **What:** Score sources by authority (official docs > verified experts > community)
   - **Why:** Helps prioritize trustworthy information
   - **Effort:** High (requires domain knowledge, hard to automate)

9. **Query Variation Generator** ⭐
   - **What:** Automatic generation of query variations (synonyms, misspellings, etc.)
   - **Why:** Increases search coverage, reduces manual work
   - **Effort:** Medium (build generator, integrate with tools)

### Low Priority

10. **Research Caching** ⭐
    - **What:** Cache expensive research results, deduplicate queries
    - **Why:** Performance, cost savings, consistency
    - **Effort:** Medium (implement cache layer, TTL logic)

11. **Tool Selection Logic** ⭐
    - **What:** Automatic selection of appropriate tools for research type
    - **Why:** Reduces orchestration burden, ensures best tool used
    - **Effort:** High (requires decision engine, hard to generalize)

12. **Confidence Levels** ⭐
    - **What:** Tag findings as verified/likely/speculative
    - **Why:** Helps user assess reliability
    - **Effort:** Medium (define criteria, implement tagging)

---

## Streamlining Opportunities

### 1. Consolidate Research Agents

**Current:** Two agents (deep-research, deep-context-gatherer) with overlapping functionality

**Proposal:** Merge into single **unified-research** agent with modes:
- `web-only`: Like current deep-research
- `codebase-only`: Local search only
- `hybrid` (default): Combined web + local
- `debugging`: Error-focused workflow
- `comparison`: Tool/library comparison workflow

**Benefits:**
- Single entry point for research
- Consistent compilation format
- Easier to maintain
- Reduced confusion about which agent to use

**Effort:** Medium (refactor agents, test modes)

---

### 2. Standardize Output Locations

**Current:** Fragmented across `docs/reports/`, `docs/research/github/`, `docs/web-captures/`, `./`

**Proposal:** Unified structure:
```
docs/research/
├── web/              # Web search results
│   └── <timestamp>-<query>.md
├── github/           # GitHub code search results (keep as-is)
│   └── <timestamp>-<query>.md
├── hybrid/           # Combined web+local results
│   └── <timestamp>-<query>.md
└── captures/         # Raw web page captures (from web-to-markdown)
    └── <timestamp>.md
```

**Benefits:**
- Easier to find past research
- Consistent naming patterns
- Better organization by type
- Obvious location for new tools

**Effort:** Low (update paths, migrate existing)

---

### 3. Simplify gemini-research Modes

**Current:** Three modes (quick, deep, code) with overlapping features

**Proposal:** Keep three modes but clarify specialization:
- `quick`: Fast overview only (current)
- `analysis`: Deep analysis with contradictions/consensus (current deep)
- `code`: Code-focused with snippets/gotchas (current code)

Rename "deep" → "analysis" for clarity (avoids confusion with deep-research agent)

**Benefits:**
- Clearer mode purposes
- Less naming confusion
- Same functionality, better UX

**Effort:** Low (rename, update docs)

---

### 4. Remove Redundant Tools (Consider)

**Candidate:** `web-to-markdown` skill

**Rationale:**
- WebFetch already converts HTML to markdown
- Playwright adds complexity (browser install, timeouts)
- Use case (batch scraping) is rare compared to single-page fetch

**Counter-argument:**
- WebFetch may fail on JS-heavy sites
- Batch processing is useful for documentation scraping
- Self-hosted (no API dependency)

**Recommendation:** Keep web-to-markdown for now, document when to use vs WebFetch

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)

**Focus:** Standards, documentation, low-effort improvements

1. ✅ Document current functionality (DONE: current-search-functionality-*.md)
2. ✅ Identify gaps (DONE: this document)
3. ⬜ Define unified compilation template
4. ⬜ Standardize output locations (create dirs, update paths)
5. ⬜ Create query strategy templates document
6. ⬜ Add site-specific search patterns (Reddit, SO, HN)
7. ⬜ Update all tools to use unified output format

**Deliverables:**
- Unified compilation template
- Query strategy guide
- Site-specific search patterns
- Consistent output structure

---

### Phase 2: Integration & Orchestration (2-4 weeks)

**Focus:** Unified research agent, cross-tool coordination

1. ⬜ Merge deep-research + deep-context-gatherer → unified-research agent
2. ⬜ Add modes: web-only, codebase-only, hybrid, debugging, comparison
3. ⬜ Implement query variation generator
4. ⬜ Add GitHub Issues search capability
5. ⬜ Build cross-source verification logic (basic)

**Deliverables:**
- Unified-research agent with 5 modes
- Query variation generator
- GitHub Issues integration
- Basic cross-source verification

---

### Phase 3: Quality & Specialization (3-5 weeks)

**Focus:** Quality assurance, specialized workflows

1. ⬜ Implement credibility scoring system
2. ⬜ Add confidence levels (verified/likely/speculative)
3. ⬜ Create debugging-specific workflow
4. ⬜ Create comparison-specific workflow
5. ⬜ Implement research caching layer
6. ⬜ Build tool selection recommendation logic

**Deliverables:**
- Credibility scoring
- Confidence tagging
- Specialized workflows
- Research cache
- Tool selection guide

---

### Phase 4: Advanced Features (4-6 weeks)

**Focus:** Automation, intelligence, optimization

1. ⬜ Automatic tool selection based on query analysis
2. ⬜ Advanced authority scoring with domain knowledge
3. ⬜ Cross-tool result deduplication
4. ⬜ Research session persistence (continue across chats)
5. ⬜ Performance optimization (parallel where possible)

**Deliverables:**
- Intelligent tool router
- Advanced quality scoring
- Result deduplication
- Session persistence
- Performance improvements

---

## Success Metrics

### Quantitative

1. **Query Coverage:** Average queries per research task should increase from ~3 to 5-10
2. **Source Diversity:** Percentage of research including 3+ distinct source types (web, GitHub, Reddit, SO)
3. **Compilation Consistency:** 100% of research outputs follow unified template
4. **Conflict Identification:** Percentage of research explicitly noting contradictions (target: >50%)
5. **Time Savings:** Reduction in Claude orchestration messages (target: 30% fewer)

### Qualitative

1. **User Satisfaction:** Research feels comprehensive, not piecemeal
2. **Trust:** Users confident in recommendations due to verification
3. **Discoverability:** Clear which tool/agent to use for each research type
4. **Consistency:** All research outputs have similar quality and structure
5. **Maintainability:** Adding new sources/tools is straightforward

---

## Risks & Mitigations

### Risk 1: Over-Engineering
**Problem:** Building complex orchestration that's hard to maintain
**Mitigation:** Start with templates and standards, add automation incrementally

### Risk 2: Tool Fragmentation
**Problem:** Too many specialized tools, confusion about which to use
**Mitigation:** Unified-research agent as single entry point, clear mode documentation

### Risk 3: Performance Degradation
**Problem:** More queries = slower research, higher API costs
**Mitigation:** Caching, early stopping (skip queries if sufficient results), parallel execution

### Risk 4: Quality Dilution
**Problem:** More sources = more noise, harder to identify signal
**Mitigation:** Credibility scoring, source prioritization, manual review step

### Risk 5: Breaking Changes
**Problem:** Refactoring breaks existing workflows
**Mitigation:** Phased rollout, backward compatibility, migration guides

---

## Recommendations Priority

### Immediate (Week 1-2)
1. ✅ Document current state (DONE)
2. ⬜ Define unified compilation template
3. ⬜ Create query strategy guide
4. ⬜ Add site-specific search patterns

### Short-term (Month 1)
5. ⬜ Merge research agents → unified-research
6. ⬜ Standardize output locations
7. ⬜ Add GitHub Issues search

### Medium-term (Months 2-3)
8. ⬜ Implement cross-source verification
9. ⬜ Add specialized workflows (debugging, comparison)
10. ⬜ Build query variation generator

### Long-term (Months 4-6)
11. ⬜ Credibility scoring system
12. ⬜ Research caching
13. ⬜ Automatic tool selection

---

## Questions for Planning Agent

1. **Scope:** Should we focus on standardization first (templates, docs) or new features (GitHub Issues, verification)?
2. **Consolidation:** Merge research agents immediately or wait until unified format defined?
3. **Priorities:** Which missing features have highest ROI? (query templates vs cross-verification vs debugging workflow?)
4. **Dependencies:** Can phases run in parallel or must be sequential?
5. **Backwards compatibility:** How important is maintaining existing tool interfaces?
6. **Testing:** How do we validate research quality improvements?
7. **Incremental value:** What's the smallest change that delivers meaningful improvement?

---

## Next Steps

1. ⬜ Review this analysis with planning agent
2. ⬜ Prioritize improvements based on effort/impact matrix
3. ⬜ Create detailed implementation plan for Phase 1
4. ⬜ Define acceptance criteria for each improvement
5. ⬜ Assign rough time estimates
6. ⬜ Identify any blockers or dependencies
7. ⬜ Get approval to proceed with implementation

---

## Appendix: Feature Matrix

| Feature | web-research-specialist | Current | Gap | Priority |
|---------|------------------------|---------|-----|----------|
| 5-10 query variations | ✅ | ❌ | Manual | ⭐⭐⭐ |
| Reddit search | ✅ | ❌ | Missing | ⭐⭐⭐ |
| Stack Overflow search | ✅ | ❌ | Missing | ⭐⭐⭐ |
| GitHub Issues | ✅ | ❌ | Missing | ⭐⭐ |
| Hacker News | ✅ | ❌ | Missing | ⭐ |
| Cross-source verification | ✅ | ❌ | Missing | ⭐⭐ |
| Authority scoring | ✅ | ❌ | Missing | ⭐⭐ |
| Unified compilation | ✅ | ⚠️ | Inconsistent | ⭐⭐⭐ |
| Debugging workflow | ✅ | ❌ | Missing | ⭐⭐ |
| Comparison workflow | ✅ | ❌ | Missing | ⭐ |
| Confidence tagging | ✅ | ❌ | Missing | ⭐ |
| Date-stamping | ✅ | ⚠️ | Inconsistent | ⭐⭐ |
| Credibility scoring | ✅ | ❌ | Missing | ⭐ |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented
- ⭐⭐⭐ High priority
- ⭐⭐ Medium priority
- ⭐ Low priority
