# How to Conduct Deep Research

**Role:** Research agent conducting focused web research on a specific angle of a topic

**Goal:** Investigate a topic thoroughly using web searches, evaluate source quality and recency, synthesize findings into actionable insights

---

## Overview

Deep research investigates topics from multiple angles, combining findings into comprehensive understanding. This approach simulates "deep research" features from Claude.ai or ChatGPT by using specialized research agents.

**When to Use Deep Research:**
- Need current information beyond LLM training data
- Want multiple perspectives on a topic
- Researching emerging technologies, trends, or recent developments
- Comparing options or approaches
- Building comprehensive understanding for decision-making

---

## Research Angle Generation

### Determining Topic Scope

First, classify the research topic:

**Broad Topic** (e.g., "TypeScript state management")
- Generate 4-5 angles covering different aspects
- Include: landscape, popular options, trends, best practices, integration

**Focused Topic** (e.g., "Zustand vs Redux")
- Generate 3-4 angles with targeted comparisons
- Include: feature comparison, migration, use cases, performance

**Very Specific Topic** (e.g., "XState v5 breaking changes")
- Generate 2-3 angles or use single agent
- Include: official docs, migration guides, community discussions

---

### Angle Strategy by Topic Type

#### Strategy 1: Broad Technology Survey

**Example Topic:** "TypeScript state management"

**Angles:**
1. **Current Landscape** - What options exist, what's popular
2. **Popular Libraries** - Deep dive into top choices (leverage domain knowledge)
3. **Community & Trends** - What's gaining adoption, surveys, discussions
4. **Best Practices** - How to choose, common patterns, anti-patterns
5. **Modern Stack Integration** - How it works with latest frameworks

#### Strategy 2: Comparison Research

**Example Topic:** "GraphQL vs REST"

**Angles:**
1. **Feature Comparison** - Core differences, strengths, weaknesses
2. **Use Cases** - When to use each, decision criteria
3. **Performance & Scale** - Benchmarks, real-world experiences
4. **Migration Paths** - Moving between approaches, hybrid strategies
5. **Ecosystem & Tooling** - Available tools, community support

#### Strategy 3: Technology Deep Dive

**Example Topic:** "React Server Components"

**Angles:**
1. **Core Concepts** - How it works, benefits, architecture
2. **Adoption & Examples** - Real implementations, case studies
3. **Integration Patterns** - With Next.js, Remix, or standalone
4. **Best Practices** - Common patterns, gotchas, recommendations
5. **Future Direction** - Roadmap, upcoming features

#### Strategy 4: Troubleshooting Research

**Example Topic:** "React performance optimization"

**Angles:**
1. **Common Causes** - Why apps get slow, profiling techniques
2. **Optimization Techniques** - Memoization, lazy loading, code splitting
3. **Tools & Debugging** - React DevTools, Chrome DevTools, profilers
4. **Real Examples** - Case studies, before/after comparisons

---

## Query Design Principles

### Rule 1: Use Natural Language

**DO:** Write queries as you would search on Google
```
✅ "TypeScript state management libraries"
✅ "React Server Components guide"
✅ "Zustand vs Redux comparison"
✅ "how to optimize React performance"
```

**DON'T:** Use keyword stuffing or over-specification
```
❌ "typescript state management libraries frameworks comparison 2024"
❌ "react server components RSC SSR CSR architecture patterns"
❌ "zustand redux bundle size performance benchmarks comparison analysis"
```

---

### Rule 2: No Forced Dates in Queries

**DO:** Let WebSearch handle recency, check dates in analysis phase
```
✅ "React 19 new features"
✅ "state management trends"
✅ "Next.js best practices"
```

**DON'T:** Add date stamps to queries (we're in October 2025, this looks dated)
```
❌ "React 2024 features"
❌ "state management 2024 survey"
❌ "Next.js 2024 patterns"
```

**Exception:** When user explicitly asks for historical context
```
✅ "React evolution 2020 to 2025"
✅ "state management history"
```

---

### Rule 3: Leverage Domain Knowledge

**DO:** Use your knowledge of major players in the space
```
For "state management":
✅ "Redux Toolkit getting started"
✅ "Zustand TypeScript guide"
✅ "XState v5 tutorial"
✅ "Jotai vs Recoil comparison"
```

**DON'T:** Generate generic queries when you know specific technologies
```
❌ "state management library tutorial"
❌ "popular state manager guide"
```

---

### Rule 4: Include Query Variety

For each angle, include different query types:

**Landscape Query** (broad overview)
```
"TypeScript state management libraries"
"React component libraries"
```

**How-To Query** (practical guidance)
```
"how to use Zustand with TypeScript"
"getting started with Tailwind CSS"
```

**Comparison Query** (decision-making)
```
"Zustand vs Redux comparison"
"when to use Tailwind vs CSS Modules"
```

**Best Practices Query** (patterns and anti-patterns)
```
"React state management best practices"
"Tailwind CSS optimization tips"
```

**Community Query** (trends and discussions)
```
"state management developer survey"
"Tailwind CSS Reddit discussions"
```

---

### Query Formula by Angle Type

#### Landscape Angle
```
[Technology] + [Category] + "comparison" | "libraries" | "options"

Examples:
- "TypeScript state management libraries"
- "React component library comparison"
```

#### Deep Dive Angle
```
[Specific Library] + "guide" | "tutorial" | "getting started" | "documentation"

Examples:
- "Zustand TypeScript guide"
- "XState v5 tutorial"
```

#### Trends Angle
```
[Technology] + "survey" | "trends" | "popular" | "adoption"

Examples:
- "JavaScript state management survey"
- "most popular React libraries"
```

#### Best Practices Angle
```
[Technology] + "best practices" | "patterns" | "anti-patterns" | "when to use"

Examples:
- "React state management best practices"
- "when to use Redux vs Zustand"
```

#### Integration Angle
```
[Technology A] + [Technology B] + "integration" | "with" | "setup"

Examples:
- "Zustand with Next.js"
- "Tailwind CSS Vite setup"
```

---

## Source Evaluation

### Recency Assessment

**After searching, check publication dates:**

**Excellent (2025):** Current year, most recent information
**Good (2024):** Recent, likely still relevant
**Acceptable (2023):** May be somewhat dated, verify if still current
**Dated (2022 or older):** Consider carefully, may be outdated

**Note in findings:**
```
✅ "Mostly 2025 sources, very current"
✅ "Mix of 2024-2025, good recency"
⚠️ "Some 2023 sources, verify currency"
⚠️ "Mostly 2022-2023, may be dated"
```

---

### Source Quality Criteria

**High Quality:**
- ✅ Official documentation
- ✅ Maintainer blogs/announcements
- ✅ Well-known tech publications (CSS-Tricks, Smashing Magazine, etc.)
- ✅ Established developer blogs with expertise
- ✅ Conference talks from recognized experts
- ✅ Surveys from reputable organizations (State of JS, Stack Overflow)

**Medium Quality:**
- ⚠️ Tutorial sites (dev.to, Medium) - verify author expertise
- ⚠️ Reddit/HN discussions - look for consensus, not single opinions
- ⚠️ YouTube videos - check creator credentials
- ⚠️ Personal blogs - assess based on content depth

**Low Quality:**
- ❌ Content farms or SEO-driven sites
- ❌ Outdated tutorials (check date!)
- ❌ Single-source opinions without backing
- ❌ AI-generated content without expert review

---

### What to Extract from Sources

**Data & Statistics:**
```
"63% of developers use React" (State of JS 2024)
"Zustand bundle size: 2.9KB vs Redux: 14KB"
"Performance improvement: 40% faster with memo"
```

**Quotes & Insights:**
```
"Server Components fundamentally change how we think about data fetching"
- Dan Abramov, React core team
```

**Code Examples:**
```
(Extract illustrative patterns, not full tutorials)
```

**Trends & Patterns:**
```
"Multiple sources mention increasing Zustand adoption"
"Common pain point: Redux boilerplate"
```

---

## Synthesis Techniques

### Technique 1: Cross-Source Validation

**Look for consensus:**
```
✅ 3 sources say: "Zustand has minimal boilerplate"
✅ 2 surveys show: Redux declining, Zustand growing
✅ Multiple benchmarks: Zustand 2-3KB, Redux 14KB
```

**Note contradictions:**
```
⚠️ Source A: "Redux is dying"
⚠️ Source B: "Redux still dominates large apps"
→ Context matters: Different use cases
```

---

### Technique 2: Thematic Clustering

**Group findings by theme, not by source:**

❌ **By Source (scattered insights):**
```
Source 1 says X about performance and Y about API
Source 2 says Z about performance and W about learning curve
```

✅ **By Theme (coherent insights):**
```
Performance:
- Source 1: X
- Source 2: Z
- Combined insight: ...

API Design:
- Source 1: Y
- Source 3: ...
```

---

### Technique 3: Signal vs Noise

**Signal (valuable insights):**
- ✅ Concrete data (numbers, benchmarks, surveys)
- ✅ Expert opinions with reasoning
- ✅ Documented patterns from real projects
- ✅ Breaking changes or updates
- ✅ Emerging trends backed by evidence

**Noise (less valuable):**
- ❌ Personal preferences without justification
- ❌ "X is better than Y" without context
- ❌ Outdated advice presented as current
- ❌ Marketing language without substance

---

### Technique 4: Context Preservation

**Always capture context:**

❌ **Without context:**
```
"Don't use Redux"
```

✅ **With context:**
```
"Redux may be overkill for small apps with simple state"
(Still appropriate for large apps with complex state)
```

---

## Confidence Assessment

Rate your findings using three dimensions:

### 1. Source Recency
```
High: Mostly 2025, some 2024
Medium: Mix of 2024-2025, some 2023
Low: Mostly 2023 or older
```

### 2. Source Quality
```
High: Official docs, expert blogs, reputable publications
Medium: Mix of quality sources and community content
Low: Mostly tutorials, personal opinions without backing
```

### 3. Coverage Depth
```
Comprehensive: Multiple angles covered, diverse sources, data-backed
Partial: Good coverage but some gaps, limited perspectives
Limited: Few sources, narrow perspective, missing key aspects
```

### Overall Confidence
```
High: Recent sources + High quality + Comprehensive coverage
Medium: 2 of 3 dimensions strong
Low: Only 1 dimension strong or all dimensions weak
```

---

## Research Agent Report Format

Use this structure for individual agent reports:

```markdown
### Key Findings

[3-5 synthesized insights, not just a list of what sources say]

Example:
- Zustand has gained significant adoption (2024 State of JS: 23% usage vs 8% in 2022)
- Major advantage cited: minimal boilerplate compared to Redux (2-3KB vs 14KB bundle)
- Growing use in production apps, particularly for smaller-to-medium projects

### Important Sources

[URLs with dates and brief descriptions]

Example:
- https://stateofjs.com/2024 (Oct 2024) - Developer survey showing adoption trends
- https://zustand-demo.pmnd.rs/ (Updated 2025) - Official documentation and examples
- https://blog.logrocket.com/zustand-vs-redux/ (Jan 2025) - Detailed technical comparison

### Notable Data & Quotes

[Statistics and quotes with attribution]

Example:
- "Zustand bundle size: 2.9KB (gzipped) vs Redux Toolkit: 14KB" - npmjs.com
- "The main benefit is it just feels more natural to write" - Dev survey comment
- 63% of surveyed devs prefer hooks-based state management (State of JS 2024)

### Emerging Trends

[What's changing in this space]

Example:
- Increasing shift toward atomic state management (Jotai, Recoil patterns)
- Redux maintainers focusing Redux Toolkit as simpler API
- Server-side state management gaining attention with RSC

### Source Assessment

**Recency:** [Mostly 2025/2024 / Mixed / Older]
**Quality:** [High (official docs, experts) / Medium / Low]
**Coverage:** [Comprehensive / Partial / Limited]

**Overall Confidence:** [High / Medium / Low]

### What's Missing

[Gaps requiring deeper investigation]

Example:
- Limited benchmarks for large-scale apps (1000+ components)
- Few migration stories from Redux to Zustand in production
- Unclear: How does it compare to XState for complex state machines?
```

---

## Aggregation Strategy

After all research agents complete, aggregate findings:

### Step 1: Read All Agent Reports

Collect findings from all angles (typically 3-5 agents).

---

### Step 2: Identify Cross-Cutting Themes

Look for patterns across multiple angles:

```markdown
## Theme: Performance
- Angle 2 (Popular Libraries): Bundle sizes compared
- Angle 3 (Community): Performance frequently mentioned as deciding factor
- Angle 4 (Best Practices): Performance optimization patterns

Combined insight: Performance (specifically bundle size) is a key differentiator
```

---

### Step 3: Note Consensus vs Contradictions

**Consensus:**
```
✅ All angles agree: Minimal boilerplate is major Zustand advantage
✅ Multiple sources: Redux still preferred for very large apps
```

**Contradictions:**
```
⚠️ Angle 2: "Redux is declining"
⚠️ Angle 3: "Redux still dominates enterprise"
→ Resolution: Context-dependent (app size, team experience)
```

---

### Step 4: Aggregate Data & Statistics

Combine quantitative findings:
```
- Zustand adoption: 23% (2024) vs 8% (2022) [Angle 3]
- Bundle size comparison: 2.9KB vs 14KB [Angle 2]
- Learning curve: 78% say easier than Redux [Angle 3]
```

---

### Step 5: Identify Knowledge Gaps

What couldn't be answered?
```
Gaps found across all angles:
- Enterprise migration case studies (multiple angles noted this)
- Long-term maintainability comparisons (no multi-year studies found)
- Specific guidance for apps with 100+ developers
```

---

### Step 6: Present Consolidated Report

Format the aggregated findings:

```markdown
# Deep Research: {TOPIC}

> **Researched:** October 2025
> **Research Angles:** 5
> **Total Sources:** 18
> **Confidence:** High

## 🎯 Executive Summary

[2-3 paragraphs synthesizing ALL findings across angles]

## 📊 Key Findings by Theme

### Latest Developments
[Aggregated from multiple angles]

### Community Adoption & Sentiment
[Aggregated from community angle]

### Technical Comparison
[Aggregated from technical angles]

### Best Practices & Patterns
[Aggregated from best practices angle]

## 🔗 Most Valuable Sources

[Top 10-15 URLs across all angles]

## 📈 Emerging Trends

[Cross-angle patterns and shifts]

## ⚠️ Knowledge Gaps

[What couldn't be answered, mentioned by multiple angles]

## 🤔 Next Steps

What would you like to explore deeper?
1. Deep dive into [specific aspect]
2. Compare [X vs Y] in detail
3. Find implementation examples for [use case]
4. Research related topic: [suggestion]
```

---

## Follow-Up Research Patterns

After presenting initial findings, offer focused follow-up:

### Pattern 1: Deep Dive

**User picks:** "Deep dive into Zustand performance"

**Generate new angles:**
1. Benchmarks & Performance Tests
2. Real-World Case Studies
3. Optimization Techniques
4. Comparison with Alternatives

### Pattern 2: Targeted Comparison

**User picks:** "Compare Zustand vs XState in detail"

**Generate focused angles:**
1. Use Case Fit (when to use each)
2. API & Developer Experience
3. Performance & Bundle Size
4. Migration & Learning Curve

### Pattern 3: Implementation Focus

**User picks:** "Find implementation examples"

**Generate practical angles:**
1. Getting Started Tutorials
2. Real Project Examples
3. Common Patterns & Recipes
4. Integration with [specific stack]

### Pattern 4: Save Research

**User picks:** "Save this report"

Create file: `RESEARCH_{TOPIC}_{DATE}.md` with full findings

---

## Common Research Scenarios

### Scenario 1: Technology Choice

**Topic:** "Should we use Zustand or Redux?"

**Angle Strategy:**
- Feature comparison
- Use case analysis (when to use each)
- Migration considerations
- Community trends
- Team learning curve

### Scenario 2: Staying Current

**Topic:** "What's new in React 19?"

**Angle Strategy:**
- Official release notes
- Breaking changes & migration
- New features deep dive
- Community reactions & adoption
- Integration with existing projects

### Scenario 3: Problem Solving

**Topic:** "React app performance issues"

**Angle Strategy:**
- Common causes & profiling
- Optimization techniques
- Tools & debugging
- Real examples & case studies

### Scenario 4: Learning New Tech

**Topic:** "Learn React Server Components"

**Angle Strategy:**
- Core concepts & how it works
- Getting started guides
- Best practices & patterns
- Common pitfalls & gotchas
- Real implementations

---

## Quality Checklist

A good research report should:

- [ ] Answer the core question or cover the topic comprehensively
- [ ] Include recent sources (prioritize 2025, then 2024)
- [ ] Cite authoritative sources (official docs, experts, surveys)
- [ ] Provide data and statistics where available
- [ ] Synthesize findings, not just list sources
- [ ] Note consensus across multiple sources
- [ ] Flag contradictions with context
- [ ] Assess confidence level honestly
- [ ] Identify knowledge gaps
- [ ] Offer actionable next steps

---

## Summary

This document provides the research methodology for conducting thorough web-based investigations. It covers angle generation, query design, source evaluation, synthesis techniques, and aggregation strategies.

For practical implementation using this methodology, see the `/deep-research` command.
