---
allowed-tools: Bash(pnpm lint:*), Bash(pnpm exec eslint:*), Bash(eslint:*), Task, TodoWrite
argument-hint: [optional file pattern to fix, e.g., "src/**/*.ts"]
description: Orchestrate parallel fix-eslint agents by directory to fix ESLint errors across the codebase
---

## Context

- Current ESLint errors: !`pnpm lint 2>&1 || true`

## Your task

You are the orchestrator. You will spawn multiple fix-eslint agents in parallel to fix ESLint errors across the codebase.

**File pattern** (optional via $ARGUMENTS):
- If $ARGUMENTS provided (e.g., "src/**/*.ts"), analyze only files matching that pattern
- If no arguments, analyze all ESLint errors in the entire codebase

⚠️ **CRITICAL: Follow these steps IN ORDER. DO NOT skip ahead.**

---

### **Step 1: Run ESLint and collect ALL files with errors (BLOCKING)**

⚠️ **You MUST complete this step BEFORE proceeding to Step 2.**

Run ESLint and extract the complete list of files with errors:

```bash
# Get all files with errors
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u

# Group by parent directory to understand distribution
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u | xargs -n1 dirname | sort | uniq -c
```

**Store the complete results in memory.** Do not proceed until you have the full list.

If $ARGUMENTS is provided, filter the results to only include files matching the pattern.

---

### **Step 2: Group files by directory and create todos (BLOCKING)**

⚠️ **You MUST complete this step BEFORE proceeding to Step 3.**

**Parse the output mentally (in-memory)** to create a directory-to-files mapping:
- `src/auth/` → [login.ts, register.ts, session.ts]
- `src/api/` → [users.ts, posts.ts]
- `src/components/` → [Button.tsx, Header.tsx, Footer.tsx]
- `src/utils/` → [dates.ts]

**Grouping rules:**
- Group files by their immediate parent directory
- If a directory has 10+ files, consider splitting into sub-directories or smaller batches
- If all errors are in 1 file, you may skip parallelization and fix directly

Then use TodoWrite to create one todo per directory:

```javascript
TodoWrite: [
  {content: "Fix ESLint errors in src/auth/", activeForm: "Fixing ESLint errors in src/auth/", status: "pending"},
  {content: "Fix ESLint errors in src/api/", activeForm: "Fixing ESLint errors in src/api/", status: "pending"},
  {content: "Fix ESLint errors in src/components/", activeForm: "Fixing ESLint errors in src/components/", status: "pending"},
  {content: "Fix ESLint errors in src/utils/", activeForm: "Fixing ESLint errors in src/utils/", status: "pending"}
]
```

✅ **CHECKPOINT: Verify all todos are created before proceeding to Step 3.**

---

### **Step 3: NOW spawn parallel fix-eslint agents (ONLY AFTER Steps 1-2 complete)**

⚠️ **DO NOT START THIS STEP until Steps 1 and 2 are fully complete.**

Update all todos to in_progress:
```javascript
TodoWrite: [
  {content: "Fix ESLint errors in src/auth/", activeForm: "Fixing ESLint errors in src/auth/", status: "in_progress"},
  {content: "Fix ESLint errors in src/api/", activeForm: "Fixing ESLint errors in src/api/", status: "in_progress"},
  {content: "Fix ESLint errors in src/components/", activeForm: "Fixing ESLint errors in src/components/", status: "in_progress"},
  {content: "Fix ESLint errors in src/utils/", activeForm: "Fixing ESLint errors in src/utils/", status: "in_progress"}
]
```

**IMPORTANT:** Spawn ALL fix-eslint agents in a SINGLE message using multiple Task tool calls.

**Example Task invocations:**

```markdown
Task 1 (src/auth/):
prompt: "Fix all ESLint errors in the src/auth/ directory.

Files with errors:
- src/auth/login.ts
- src/auth/register.ts
- src/auth/session.ts

See @docs/HOW_TO_FIX_ESLINT.md for detailed guidelines.

Process:
1. For each file, run: pnpm lint <file-path>
2. Read the file with errors
3. Fix each error by modifying the code to comply with the rule
4. NEVER add eslint-disable comments or modify eslint config
5. Verify: run pnpm lint <file-path> again to confirm fix

Report back:
- List of files processed
- Total errors fixed
- Brief summary (e.g., '8 unused imports removed, 3 return types added, 2 const conversions')
- Any remaining errors (if unable to fix)"

subagent_type: "general-purpose"
description: "Fix auth directory ESLint errors"
```

```markdown
Task 2 (src/api/):
prompt: "Fix all ESLint errors in the src/api/ directory.

Files with errors:
- src/api/users.ts
- src/api/posts.ts

See @docs/HOW_TO_FIX_ESLINT.md for detailed guidelines.

Process:
1. For each file, run: pnpm lint <file-path>
2. Read the file with errors
3. Fix each error by modifying the code to comply with the rule
4. NEVER add eslint-disable comments or modify eslint config
5. Verify: run pnpm lint <file-path> again to confirm fix

Report back:
- List of files processed
- Total errors fixed
- Brief summary of main fixes
- Any remaining errors"

subagent_type: "general-purpose"
description: "Fix API directory ESLint errors"
```

**Continue this pattern for all directory batches...**

Claude Code will automatically manage parallelism (up to 10 tasks concurrently).

---

### **Step 4: Track agent completion and update todos**

As each agent completes and returns its results:

1. Parse the agent's report (files processed, errors fixed)
2. Update the corresponding todo to completed:

```javascript
TodoWrite: [
  {content: "Fix ESLint errors in src/auth/", activeForm: "Fixing ESLint errors in src/auth/", status: "completed"},
  {content: "Fix ESLint errors in src/api/", activeForm: "Fixing ESLint errors in src/api/", status: "in_progress"},
  {content: "Fix ESLint errors in src/components/", activeForm: "Fixing ESLint errors in src/components/", status: "in_progress"},
  {content: "Fix ESLint errors in src/utils/", activeForm: "Fixing ESLint errors in src/utils/", status: "in_progress"}
]
```

3. Repeat for each agent as they complete

---

### **Step 5: Final verification and summary**

After ALL agents complete:

1. Run final verification:
```bash
pnpm lint 2>&1
```

2. Aggregate results from all agent reports:
```
Summary:
- Total directories processed: X
- Total files modified: Y
- Total errors fixed: Z
- Breakdown by directory:
  • src/auth/: 12 errors fixed in 3 files
  • src/api/: 8 errors fixed in 2 files
  • src/components/: 15 errors fixed in 3 files
  • src/utils/: 2 errors fixed in 1 file
- Remaining errors: N (if any)
```

3. If remaining errors exist, report which files/directories still have issues

---

## Edge Cases

**Only 1 file with errors:**
- Skip parallelization
- Fix directly without spawning agents
- No TodoWrite needed

**Errors spread across many directories (15+):**
- Group by top-level directory only (e.g., `src/`, `tests/`, `lib/`)
- Don't over-split - let Claude Code manage parallelism

**Large directory (20+ files):**
- Split by subdirectory if they exist
- Or batch into groups of ~5 files each with separate Task calls

**Agent reports remaining errors:**
- Include in final summary
- Note which specific files/rules couldn't be auto-fixed
- Suggest manual review

---

## Conflict Prevention

- Each directory/file assigned to EXACTLY ONE agent
- Verify no overlap before spawning
- All Task calls in ONE message for parallel execution
- Never let two agents modify the same file
