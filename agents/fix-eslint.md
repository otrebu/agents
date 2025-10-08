---
name: fix-eslint
description: Automatically fix ESLint errors by modifying code to comply with linting rules, never disabling rules or adding ignore comments
tools: Read, Write, Edit, Grep, Glob, Bash, Task
model: inherit
---

@docs/HOW_TO_FIX_ESLINT.md

## Parallel Execution Strategy (Agent-Specific)

When invoked, analyze the error distribution and spawn parallel sub-agents to fix errors by directory.

### **Step 1: Parse ESLint output and group by directory**

Run ESLint and extract files with errors, grouped by directory:

```bash
# Get all files with errors
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u

# Group by parent directory
pnpm lint 2>&1 | grep -E "^\s*/" | sed 's/\s*[0-9]*:[0-9]*.*//' | sort -u | xargs -n1 dirname | sort | uniq -c
```

**Parse the output mentally (in-memory)** to create a directory-to-files mapping:
- `src/auth/` → [login.ts, register.ts, session.ts]
- `src/api/` → [users.ts, posts.ts]
- `src/components/` → [Button.tsx, Header.tsx, Footer.tsx]
- `src/utils/` → [dates.ts]

**Grouping rules:**
- Group files by their immediate parent directory
- If a directory has 10+ files, consider splitting into sub-directories or smaller batches
- If all errors are in 1 file, skip parallelization and fix directly

### **Step 2: Create todos for each directory batch**

Use TodoWrite to create one todo per directory:

```javascript
TodoWrite: [
  {content: "Fix ESLint errors in src/auth/", activeForm: "Fixing ESLint errors in src/auth/", status: "pending"},
  {content: "Fix ESLint errors in src/api/", activeForm: "Fixing ESLint errors in src/api/", status: "pending"},
  {content: "Fix ESLint errors in src/components/", activeForm: "Fixing ESLint errors in src/components/", status: "pending"},
  {content: "Fix ESLint errors in src/utils/", activeForm: "Fixing ESLint errors in src/utils/", status: "pending"}
]
```

### **Step 3: Mark all todos as in_progress and spawn parallel sub-agents**

**IMPORTANT:** Spawn ALL sub-agents in a SINGLE message using multiple Task tool calls.

Update all todos to in_progress:
```javascript
TodoWrite: [
  {content: "Fix ESLint errors in src/auth/", activeForm: "Fixing ESLint errors in src/auth/", status: "in_progress"},
  {content: "Fix ESLint errors in src/api/", activeForm: "Fixing ESLint errors in src/api/", status: "in_progress"},
  {content: "Fix ESLint errors in src/components/", activeForm: "Fixing ESLint errors in src/components/", status: "in_progress"},
  {content: "Fix ESLint errors in src/utils/", activeForm: "Fixing ESLint errors in src/utils/", status: "in_progress"}
]
```

Then immediately spawn all sub-agents:

**Example Task invocations:**

```markdown
Task 1 (src/auth/):
prompt: "Fix all ESLint errors in the src/auth/ directory.

Files with errors:
- src/auth/login.ts
- src/auth/register.ts
- src/auth/session.ts

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

### **Step 4: Track sub-agent completion**

As each sub-agent completes and returns its results:

1. Parse the sub-agent's report (files processed, errors fixed)
2. Update the corresponding todo to completed:

```javascript
TodoWrite: [
  {content: "Fix ESLint errors in src/auth/", activeForm: "Fixing ESLint errors in src/auth/", status: "completed"},
  {content: "Fix ESLint errors in src/api/", activeForm: "Fixing ESLint errors in src/api/", status: "in_progress"},
  {content: "Fix ESLint errors in src/components/", activeForm: "Fixing ESLint errors in src/components/", status: "in_progress"},
  {content: "Fix ESLint errors in src/utils/", activeForm: "Fixing ESLint errors in src/utils/", status: "in_progress"}
]
```

3. Repeat for each sub-agent as they complete

### **Step 5: Final verification and summary**

After ALL sub-agents complete:

1. Run final verification:
```bash
pnpm lint 2>&1
```

2. Aggregate results from all sub-agent reports:
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

### **Edge Cases:**

**Only 1 file with errors:**
- Skip parallelization
- Fix directly without spawning sub-agents
- No TodoWrite needed

**Errors spread across many directories (15+):**
- Group by top-level directory only (e.g., `src/`, `tests/`, `lib/`)
- Don't over-split - let Claude Code manage parallelism

**Large directory (20+ files):**
- Split by subdirectory if they exist
- Or batch into groups of ~5 files each with separate Task calls

**Sub-agent reports remaining errors:**
- Include in final summary
- Note which specific files/rules couldn't be auto-fixed
- Suggest manual review

### **Conflict Prevention:**

- Each directory/file assigned to EXACTLY ONE sub-agent
- Verify no overlap before spawning
- All Task calls in ONE message for parallel execution
- Never let two sub-agents modify the same file
