---
allowed-tools: WebSearch, Task, TodoWrite, Write
argument-hint: <research topic>
description: Orchestrate parallel web research agents to investigate a topic from multiple angles
---

## Overview

This command orchestrates parallel web research to investigate a topic comprehensively. It spawns 3-5 specialized research agents, each exploring a different angle, then aggregates findings into a unified report.

**Orchestration Pattern:** Follow the **5-Step Parallel Orchestration** from `@docs/HOW_TO_ORCHESTRATE_AGENTS.md`

**Research Methodology:** Follow research best practices from `@docs/HOW_TO_RESEARCH_DEEP.md` for query design, source evaluation, and synthesis

---

## Your Task

You are the research orchestrator. Your goal is to investigate this topic from multiple angles using parallel web research agents.

**Research Topic:** $ARGUMENTS

---

## Orchestration Steps (Brief)

Follow the 5-step pattern from the orchestration guide. Here are the research-specific details for each step:

### Step 1: Generate Research Angles

**Classify the topic** (see the research guide for details):
- **Broad** → 4-5 angles (landscape, popular options, trends, best practices, integration)
- **Focused** → 3-4 angles (feature comparison, use cases, performance, migration)
- **Very Specific** → 2-3 angles (official docs, community discussions, real examples)

**Generate 2-4 search queries per angle** using natural language. See the research guide for query design principles.

### Step 2: Create Todos

Create one todo per research angle using TodoWrite. See orchestration guide for TodoWrite mechanics.

### Step 3: Spawn All Research Agents

Update all todos to `in_progress`, then spawn ALL agents in ONE message. See orchestration guide for spawning rules.

**Use this task prompt template:**

```markdown
**Research Assignment: {ANGLE NAME}**

Main Topic: {TOPIC}

Your task is to research this specific angle using web searches.

## Search Queries

Run these WebSearch queries (2-4 searches):
1. {query_1}
2. {query_2}
3. {query_3}
[4. {query_4}] (optional)

## Analysis Instructions

See the research guide for source evaluation criteria:
- Prioritize recent sources (2025 first, then 2024)
- Check publication dates
- Prioritize authoritative sources (official docs, experts, surveys)
- Extract data, statistics, quotes with sources
- Look for emerging trends and patterns
- Note contradictions between sources

## Report Format

Use the "Research Agent Report Format" from the research guide:
- Key Findings (3-5 synthesized insights)
- Important Sources (URLs with dates)
- Notable Data & Quotes
- Emerging Trends
- Source Assessment (Recency, Quality, Coverage, Confidence)
- What's Missing
```

### Step 4: Track Completion

Mark each todo as completed immediately when the agent finishes. See orchestration guide for tracking mechanics.

### Step 5: Aggregate & Present

Aggregate findings using the strategy from the research guide:
- Group by theme (not by source)
- Identify consensus and contradictions
- Assess overall confidence
- Present consolidated report

**Present using this format:**

```markdown
# Deep Research: {TOPIC}

> Researched: {Date} | Angles: {N} | Sources: {~X} | Confidence: {High/Medium/Low}

## 🎯 Executive Summary
[2-3 paragraphs synthesizing ALL findings]

## 📊 Key Findings by Theme
[Group insights by theme, not by angle]

## 🔗 Most Valuable Sources
[Top 10-15 URLs with dates and descriptions]

## 📈 Emerging Trends
[Cross-angle patterns]

## 🤝 Consensus vs Contradictions
[What sources agree/disagree on]

## ⚠️ Knowledge Gaps
[What couldn't be answered]

## 📊 Source Assessment
[Aggregate recency, quality, coverage across all angles]

## 🤔 What Would You Like to Explore Deeper?
[Offer follow-up options: deep dive, comparison, examples, save report]
```

---

## Edge Cases

**Very specific topic:** Use 2-3 targeted angles instead of forcing 5

**Very broad topic:** Break into clear domains, ensure no angle overlap

**Limited search results:** Note in reports, suggest alternative angles

---

## Success Criteria

- ✅ Investigate 3-5 diverse angles in parallel
- ✅ Collect 15-25 total sources, prioritize recent (2025, then 2024)
- ✅ Synthesize by theme (not just list sources)
- ✅ Identify consensus and contradictions
- ✅ Note knowledge gaps honestly
- ✅ Complete in 2-5 minutes
