# How to Orchestrate Agents

**Role:** Orchestrator coordinating multiple specialized agents to accomplish complex multi-faceted tasks

**Goal:** Coordinate parallel or sequential agents efficiently, track progress, and aggregate results into cohesive output

---

## Overview

**What is Agent Orchestration?**

Agent orchestration is the pattern of coordinating multiple specialized agents to work on different aspects of a complex task, then aggregating their results into a unified output.

**When to Orchestrate:**

Use orchestration when:
- Task has multiple independent work units (parallel)
- Task requires sequential phases where later phases depend on earlier results (sequential)
- Each work unit requires focused analysis or action
- Parallelization would significantly reduce completion time
- Results need to be aggregated into coherent summary

**Don't Orchestrate When:**
- Task is simple or single-focus
- Work units heavily interdependent (consider single agent instead)
- Overhead of coordination exceeds benefits

---

## Pattern Selection Decision Tree

```
Can work units be processed independently?
├─ YES → Can they run simultaneously without conflicts?
│  ├─ YES → Use PARALLEL pattern (faster)
│  └─ NO  → Use SEQUENTIAL pattern (safer)
└─ NO  → Each phase depends on previous results?
   ├─ YES → Use SEQUENTIAL pattern
   └─ NO  → Consider single agent instead
```

**Examples:**
- **Parallel:** Fix ESLint errors in different directories (independent, no conflicts)
- **Sequential:** Codebase exploration phases (architecture depends on discovery findings)
- **Single Agent:** Fix ESLint errors in one file (no need for orchestration)

---

## Pattern 1: Parallel Orchestration

**Use when:** Work units are independent and can run simultaneously

**Benefits:** Significantly faster execution (3-5x speedup with 3-5 agents)

### The 5-Step Template

#### Step 1: Analyze Scope (BLOCKING)

**Purpose:** Understand the full scope before distributing work

**Process:**
1. Run analysis commands to collect data
2. Parse output to identify work units
3. Store complete results in memory
4. **Do NOT proceed until analysis is complete**

**Example (spawn-eslint-fixers):**
```bash
# Collect all files with errors
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u

# Group by directory to see distribution
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u | xargs -n1 dirname | sort | uniq -c
```

**Example (deep-research):**
```
Parse topic: "{TOPIC}"
Determine specificity: broad / focused / very specific
Generate angles based on topic scope
Create 2-4 queries per angle
```

---

#### Step 2: Distribute Work + TodoWrite (BLOCKING)

**Purpose:** Break work into units and create visibility

**Process:**
1. Group work units logically (by directory, by angle, by phase)
2. **Verify no overlap** between units (critical for parallel execution)
3. Use TodoWrite to create one todo per work unit
4. **Do NOT proceed until todos are created**

**TodoWrite Format:**
```javascript
[
  {
    content: "Fix ESLint errors in src/auth/",
    activeForm: "Fixing ESLint errors in src/auth/",
    status: "pending"
  },
  {
    content: "Fix ESLint errors in src/api/",
    activeForm: "Fixing ESLint errors in src/api/",
    status: "pending"
  },
  // ... more work units
]
```

**Grouping Rules:**
- Each unit should be substantial enough to justify agent overhead (e.g., 2-5 files, not 1)
- Keep units roughly balanced (avoid one huge unit and several tiny ones)
- If one unit has 10+ items, consider splitting further
- Maximum recommended: 8-10 units (more doesn't add value due to parallelism limits)

---

#### Step 3: Spawn ALL Agents (PARALLEL EXECUTION)

**Purpose:** Launch all agents simultaneously for maximum speed

**CRITICAL RULES:**
1. **Update all todos to `in_progress` first**
2. **Spawn ALL agents in a SINGLE message** with multiple Task tool calls
3. **Never spawn sequentially** (defeats the purpose of parallel orchestration)
4. **Verify no overlap** in agent scopes (two agents must never modify same file)

**Task Call Template:**
```markdown
Task 1:
prompt: "Fix all ESLint errors in the src/auth/ directory.

Files with errors:
- src/auth/login.ts
- src/auth/register.ts
- src/auth/session.ts

Process:
1. For each file, run: pnpm lint <file-path>
2. Read the file with errors
3. Fix each error by modifying code to comply with the rule
4. NEVER add eslint-disable comments or modify eslint config
5. Verify: run pnpm lint <file-path> again to confirm fix

Report back:
- List of files processed
- Total errors fixed
- Brief summary (e.g., '8 unused imports removed, 3 return types added')
- Any remaining errors (if unable to fix)"

subagent_type: "general-purpose"
description: "Fix auth directory ESLint errors"
```

**Multiple Task calls in ONE message:**
```
[Send message with Task 1, Task 2, Task 3, Task 4 all at once]
```

**What happens:**
- Claude Code automatically manages parallelism (up to 10 concurrent agents)
- Agents run simultaneously
- You receive results as each completes
- Much faster than sequential execution

---

#### Step 4: Track Completion

**Purpose:** Maintain progress visibility as agents finish

**Process:**
1. As each agent completes and returns results, **immediately** mark its todo as completed
2. Parse the agent's report (files processed, changes made, errors fixed)
3. Store results for aggregation
4. **Do not wait** to batch-complete todos

**TodoWrite Update (mark one completed):**
```javascript
[
  {
    content: "Fix ESLint errors in src/auth/",
    activeForm: "Fixing ESLint errors in src/auth/",
    status: "completed"
  },
  {
    content: "Fix ESLint errors in src/api/",
    activeForm: "Fixing ESLint errors in src/api/",
    status: "in_progress"
  },
  // ... others still in progress
]
```

**Handling Failures:**
- If agent reports partial completion, keep todo as `in_progress`
- Create new todo for follow-up work if needed
- Note the issue in your aggregation

---

#### Step 5: Aggregate Results + Present Summary

**Purpose:** Combine all agent results into cohesive output

**Process:**
1. After ALL agents complete, run final verification (if applicable)
2. Aggregate results by category/theme
3. Calculate totals and statistics
4. Identify patterns or issues across agents
5. Present consolidated summary to user

**Aggregation Template:**
```markdown
## Summary

**Scope:** {What was orchestrated}
**Agents Launched:** {N}
**Total Items Processed:** {X}
**Results:** {Summary of outcomes}

### Breakdown by Work Unit:
- {Unit 1}: {Result summary}
- {Unit 2}: {Result summary}
- {Unit 3}: {Result summary}

### Overall Findings:
{Patterns, themes, insights across all agents}

### Remaining Issues:
{Any problems or gaps}

### Next Steps:
{Recommendations if applicable}
```

---

## Pattern 2: Sequential Orchestration

**Use when:** Work units depend on previous results or must run in specific order

**Benefits:** Each phase builds on previous findings, ensures correctness

### The Sequential Template

#### Basic Flow

```
Phase 1: Launch Agent 1
  ↓ Wait for completion
  ↓ Read Agent 1 output
  ↓
Phase 2: Launch Agent 2 (using Phase 1 results)
  ↓ Wait for completion
  ↓ Read Agent 2 output
  ↓
Phase 3: Launch Agent 3 (using Phase 1 & 2 results)
  ↓ Wait for completion
  ↓ Read Agent 3 output
  ↓
Final: Consolidate all outputs
```

**Key Differences from Parallel:**
- **Launch one agent at a time** (not all in one message)
- **Wait for completion** before launching next
- **Read output** to inform next agent's prompt
- **No TodoWrite needed** (sequential progress is implicit)
- **Each agent may reference previous outputs**

---

#### Example: Codebase Exploration

**Phase 1: Discovery**
```
Task: Discover codebase structure
Agent: discover-codebase
Output: 01-DISCOVERY.md

Wait for completion → Read 01-DISCOVERY.md
```

**Phase 2: Architecture (depends on Discovery)**
```
Task: Analyze architecture (now knows tech stack from Phase 1)
Agent: analyze-architecture
Output: 02-ARCHITECTURE.md

Wait for completion → Read 02-ARCHITECTURE.md
```

**Phase 3: Features (depends on Architecture)**
```
Task: Inventory features (knows structure from Phase 2)
Agent: inventory-features
Output: 03-FEATURES.md

Wait for completion → Read 03-FEATURES.md
```

**Continue through all phases...**

**Final: Consolidation**
```
Read all phase documents:
- 01-DISCOVERY.md
- 02-ARCHITECTURE.md
- 03-FEATURES.md
- 04-TECHNICAL.md
- SECURITY_ANALYSIS.md
- HISTORY_ANALYSIS.md

Create executive summary: CODEBASE_GUIDE.md
```

---

#### When to Use Sequential vs Parallel

**Use Sequential when:**
- ✅ Phase B needs results from Phase A
- ✅ Order matters for correctness
- ✅ Each phase creates persistent documentation used by next
- ✅ Phases have different analysis depths (discovery → deep dive)

**Use Parallel when:**
- ✅ All work units independent
- ✅ No dependencies between units
- ✅ Speed is important
- ✅ No risk of conflicts

---

## TodoWrite Best Practices

### When to Use TodoWrite

**Use TodoWrite for:**
- ✅ Parallel orchestration (progress visibility across agents)
- ✅ Complex multi-step tasks (3+ steps)
- ✅ Long-running processes (helps user track progress)

**Skip TodoWrite for:**
- ❌ Sequential orchestration (progress is implicit from phase names)
- ❌ Simple 1-2 step tasks
- ❌ Quick operations

### TodoWrite Rules

1. **Create todos BEFORE spawning agents** (Step 2)
2. **Update to in_progress BEFORE launching** (Step 3)
3. **Mark completed IMMEDIATELY after each agent finishes** (Step 4)
4. **Never batch completions** (breaks progress visibility)
5. **Only ONE todo in_progress at a time** for single-agent work
6. **ALL todos in_progress for parallel work** (shows they're all running)

### Todo Status Flow (Parallel)

```
pending → in_progress (all at once) → completed (as each finishes)

Example:
[pending, pending, pending]
  ↓ Step 3: Launch all agents
[in_progress, in_progress, in_progress]
  ↓ Agent 1 finishes
[completed, in_progress, in_progress]
  ↓ Agent 3 finishes
[completed, in_progress, completed]
  ↓ Agent 2 finishes
[completed, completed, completed]
```

---

## Agent Spawning Rules

### Parallel: All-in-One Message

**MUST DO:**
- ✅ Spawn ALL agents in a SINGLE message
- ✅ Use multiple Task tool calls in that message
- ✅ Include complete prompt for each agent
- ✅ Verify no overlap in agent scopes

**NEVER DO:**
- ❌ Spawn agents one-by-one in separate messages
- ❌ Wait for Agent 1 to finish before spawning Agent 2
- ❌ Assume agents will coordinate (they run independently)

**Example Message Structure:**
```
[Message]
  Task tool call 1: Fix src/auth/
  Task tool call 2: Fix src/api/
  Task tool call 3: Fix src/components/
  Task tool call 4: Fix src/utils/
[End message]
```

### Sequential: One-at-a-Time

**MUST DO:**
- ✅ Spawn one agent
- ✅ Wait for completion
- ✅ Read output/results
- ✅ Use results to inform next agent
- ✅ Spawn next agent

**NEVER DO:**
- ❌ Spawn multiple agents in one message
- ❌ Proceed before agent completes
- ❌ Skip reading output

---

## Result Aggregation Patterns

### Pattern A: Simple Summary

For straightforward results (e.g., file counts, error counts):

```markdown
## Summary
- Total directories: X
- Total files fixed: Y
- Total errors fixed: Z
- Time saved by parallelization: ~Nx faster
```

### Pattern B: Breakdown Table

For structured data:

```markdown
| Directory | Files Fixed | Errors Fixed | Notes |
|-----------|-------------|--------------|-------|
| src/auth/ | 3 | 12 | All resolved |
| src/api/ | 2 | 8 | All resolved |
| src/components/ | 3 | 15 | 2 warnings remain |
```

### Pattern C: Thematic Synthesis

For research or analysis (combines findings by theme):

```markdown
## Key Findings by Theme

### Theme 1: Performance
- Agent 1 found: ...
- Agent 3 found: ...
- Combined insight: ...

### Theme 2: Security
- Agent 2 found: ...
- Agent 5 found: ...
- Combined insight: ...
```

### Pattern D: Executive Summary + Details

For comprehensive reports (e.g., codebase exploration):

```markdown
# Executive Summary
[2-3 paragraphs synthesizing ALL findings]

## Detailed Findings
→ See 01-DISCOVERY.md for technology stack
→ See 02-ARCHITECTURE.md for structure details
→ See 03-FEATURES.md for capabilities
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Sequential When Should Be Parallel

**Problem:** Spawning agents one-by-one when they're independent
```
❌ Spawn Agent 1 → Wait → Spawn Agent 2 → Wait → Spawn Agent 3
```

**Solution:** Spawn all in one message
```
✅ Spawn [Agent 1, Agent 2, Agent 3] in single message
```

**Time saved:** 3x faster

---

### Pitfall 2: Overlapping Agent Scopes

**Problem:** Two agents modifying same file simultaneously
```
❌ Agent 1: Fix src/auth/*
❌ Agent 2: Fix src/auth/login.ts
```

**Solution:** Ensure disjoint scopes
```
✅ Agent 1: Fix src/auth/*
✅ Agent 2: Fix src/api/*
```

---

### Pitfall 3: Incomplete Analysis Before Distribution

**Problem:** Starting to spawn agents before understanding full scope

**Solution:** Always complete Step 1 (analysis) fully before Step 2 (distribution)

---

### Pitfall 4: Batching Todo Completions

**Problem:** Marking multiple todos as completed at once
```
❌ Agent 1, 2, 3 finish → mark all 3 completed together
```

**Solution:** Mark completed immediately as each finishes
```
✅ Agent 1 finishes → mark completed
✅ Agent 2 finishes → mark completed
✅ Agent 3 finishes → mark completed
```

---

### Pitfall 5: Forgetting Final Verification

**Problem:** Assuming all agents succeeded without verification

**Solution:** Run final check command after all agents complete
```
✅ After all ESLint agents: pnpm lint 2>&1
✅ After all research agents: Review all reports for gaps
```

---

## Examples from Existing Commands

### Example 1: ESLint Fixing Across Directories (Parallel)

**Pattern:** Parallel Orchestration

**Step 1:** Run `pnpm lint` to collect all files with errors, group by directory

**Step 2:** Create todos for each directory

**Step 3:** Spawn all fix-eslint agents in one message (one per directory)

**Step 4:** Mark todos completed as agents finish

**Step 5:** Run final `pnpm lint` to verify, present summary

---

### Example 2: Codebase Exploration (Sequential)

**Pattern:** Sequential Orchestration

**Phases:**
1. discover-codebase → 01-DISCOVERY.md
2. analyze-architecture → 02-ARCHITECTURE.md (uses discovery findings)
3. inventory-features → 03-FEATURES.md (uses architecture understanding)
4. analyze-technical → 04-TECHNICAL.md
5. analyze-security → SECURITY_ANALYSIS.md
6. analyze-history → HISTORY_ANALYSIS.md
7. Consolidate all → CODEBASE_GUIDE.md

---

### Example 3: Multi-Angle Web Research (Parallel)

**Pattern:** Parallel Orchestration

**Step 1:** Generate 3-5 research angles based on topic

**Step 2:** Create todos for each angle

**Step 3:** Spawn all research agents in one message (one per angle)

**Step 4:** Mark todos completed as agents return findings

**Step 5:** Aggregate findings by theme, present to user, offer follow-up options

---

## Quick Reference

### Parallel Orchestration Checklist

- [ ] Step 1: Analyze scope completely (BLOCKING)
- [ ] Step 2: Distribute work + TodoWrite (BLOCKING)
- [ ] Verify no overlap between work units
- [ ] Step 3: Update all todos to in_progress
- [ ] Step 3: Spawn ALL agents in ONE message
- [ ] Step 4: Mark todos completed as each finishes (not batched)
- [ ] Step 5: Run final verification
- [ ] Step 5: Aggregate results by theme/category
- [ ] Step 5: Present summary with statistics

### Sequential Orchestration Checklist

- [ ] Launch Agent 1
- [ ] Wait for Agent 1 completion
- [ ] Read Agent 1 output
- [ ] Launch Agent 2 (using Agent 1 results)
- [ ] Wait for Agent 2 completion
- [ ] Read Agent 2 output
- [ ] Continue for all phases...
- [ ] Read all outputs
- [ ] Create consolidated summary

---

## Summary

This document defines two orchestration patterns:

**Parallel Orchestration (5-step pattern):**
- Use when work units are independent
- Significantly faster execution
- Requires careful conflict prevention

**Sequential Orchestration:**
- Use when phases depend on previous results
- Ensures correctness through ordered execution
- No TodoWrite needed (progress is implicit)

Both patterns coordinate multiple specialized agents to accomplish complex tasks more efficiently than a single agent could.
