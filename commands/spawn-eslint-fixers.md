---
allowed-tools: Bash(pnpm lint:*), Bash(pnpm exec eslint:*), Bash(eslint:*), Task, TodoWrite
argument-hint: [optional file pattern to fix, e.g., "src/**/*.ts"]
description: Orchestrate parallel fix-eslint agents by directory to fix ESLint errors across the codebase
---

## Overview

This command orchestrates parallel ESLint fixing across directories using the **parallel orchestration pattern**.

**See:** `@docs/HOW_TO_ORCHESTRATE_AGENTS.md` for the complete 5-step parallel pattern this follows.

---

## Context

- Current ESLint errors: !`pnpm lint 2>&1 || true`

## Your Task

You are the orchestrator. You will spawn multiple fix-eslint agents in parallel to fix ESLint errors across the codebase.

**File pattern** (optional via $ARGUMENTS):
- If $ARGUMENTS provided (e.g., "src/**/*.ts"), analyze only files matching that pattern
- If no arguments, analyze all ESLint errors in the entire codebase

**Pattern:** Follow the 5-step parallel orchestration pattern from `@docs/HOW_TO_ORCHESTRATE_AGENTS.md`.

---

## Step 1: Analyze Scope

**Collect ESLint errors:**

```bash
# Get all files with errors
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u

# Group by parent directory to see distribution
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u | xargs -n1 dirname | sort | uniq -c
```

Store the complete results in memory. If $ARGUMENTS is provided, filter to only matching files.

---

## Step 2: Distribute Work

**Group files by directory:**

Create a directory-to-files mapping:
- `src/auth/` → [login.ts, register.ts, session.ts]
- `src/api/` → [users.ts, posts.ts]
- `src/components/` → [Button.tsx, Header.tsx, Footer.tsx]

**Grouping rules:**
- Group by immediate parent directory
- If directory has 10+ files, split into subdirectories
- If only 1 file with errors, skip parallelization and fix directly

**Create todos** (one per directory) using TodoWrite.

---

## Step 3: Spawn Agents

**Update all todos to `in_progress`, then spawn ALL agents in ONE message.**

**Task Prompt Template:**

```markdown
Fix all ESLint errors in the {DIRECTORY} directory.

Files with errors:
- {file1}
- {file2}
- {file3}

See @docs/HOW_TO_FIX_ESLINT.md for detailed guidelines.

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
- Any remaining errors (if unable to fix)
```

**Example:**

```
Task 1: Fix src/auth/ (subagent_type: "general-purpose", description: "Fix auth ESLint errors")
Task 2: Fix src/api/ (subagent_type: "general-purpose", description: "Fix API ESLint errors")
Task 3: Fix src/components/ (subagent_type: "general-purpose", description: "Fix components ESLint errors")
```

---

## Step 4: Track Completion

As each agent completes:
1. Parse the agent's report (files processed, errors fixed)
2. **Immediately** mark corresponding todo as completed
3. Store results for aggregation

---

## Step 5: Aggregate & Present

After ALL agents complete:

**1. Run final verification:**
```bash
pnpm lint 2>&1
```

**2. Aggregate results:**
```markdown
Summary:
- Total directories processed: X
- Total files modified: Y
- Total errors fixed: Z
- Breakdown by directory:
  • src/auth/: 12 errors fixed in 3 files
  • src/api/: 8 errors fixed in 2 files
  • src/components/: 15 errors fixed in 3 files
- Remaining errors: N (if any)
```

**3. Report issues:**
- List files/directories with remaining errors
- Note which rules couldn't be auto-fixed
- Suggest manual review if needed

---

## Edge Cases

**Only 1 file with errors:**
- Skip parallelization, fix directly
- No TodoWrite needed

**Errors spread across 15+ directories:**
- Group by top-level directory only (e.g., `src/`, `tests/`, `lib/`)
- Don't over-split (Claude Code manages up to 10 concurrent agents)

**Large directory (20+ files):**
- Split by subdirectory if they exist
- Or batch into groups of ~5 files each

**Agent reports remaining errors:**
- Include in final summary
- Note specific files/rules that couldn't be auto-fixed

---

## Conflict Prevention

- Each directory/file assigned to EXACTLY ONE agent
- Verify no overlap before spawning
- All Task calls in ONE message (parallel execution)
- Never let two agents modify the same file
