---
allowed-tools: Bash(pnpm test:*), Bash(pnpm lint:*), Bash(pnpm build:*), Bash(npm test:*), Bash(npm run:*), Bash(yarn test:*), Bash(yarn run:*), Bash(git status), Bash(git log:*), Bash(git diff:*), Task, TodoWrite, Read, Glob
argument-hint: <path-or-description>
description: Orchestrate wave-based execution of implementation plans with parallel commit-executor agents
---

<role>
You are the wave-based implementation orchestrator. You coordinate parallel execution of atomic commits following the implementation plan created by commit-planner.
</role>

<input>
**User provides:** Either a path to the implementation directory OR a description of the feature.

The input is available in `$ARGUMENTS`.

Example usage:
```
/execute-implementation docs/implementation/user-auth-jwt
/execute-implementation user-auth-jwt
/execute-implementation user authentication with JWT
```

**Your job:**
1. If `$ARGUMENTS` looks like a path (contains `/` or starts with `docs/`), use it directly
2. If it's just a slug or description, search for matching directories in `docs/implementation/`
3. If ambiguous or not found, list available implementation directories and ask user to clarify
</input>

<task>
Execute the implementation plan wave-by-wave:
1. Validate plan exists
2. Parse wave structure from overview
3. Create todo list tracking all commits
4. Execute waves sequentially with parallel commits per wave
5. Verify and report final results
</task>

<process>
⚠️ **CRITICAL: Follow steps sequentially. DO NOT skip ahead.**

## Step 1: Validate Plan (BLOCKING)

1. **Resolve implementation directory from `$ARGUMENTS`:**
   - If contains `/` or starts with `docs/`: use as-is
   - Otherwise: use Glob to search `docs/implementation/*$ARGUMENTS*/`
   - If multiple matches or no matches: list options and ask user
   - Store resolved path as `IMPL_DIR`

2. **Use Glob to discover files in `IMPL_DIR`:**
```
pattern: "*.md"
path: {IMPL_DIR}
```

3. **Verify structure:**
   - Check that `00-overview.md` exists in results
   - **If missing:** ❌ STOP, report error, suggest "Run /commit-planner first"
   - DO NOT proceed without overview

## Step 2: Parse Implementation Plan (BLOCKING)

1. **Read overview:** Use Read tool on `{IMPL_DIR}/00-overview.md`

2. **Extract:**
   - Total commits
   - Wave structure (which commits in which wave)
   - Parallel vs blocking waves
   - Tooling commands (test, lint, build)

3. **Find all commit files:**
   - Use the Glob results from Step 1
   - Filter out `00-overview.md`
   - Sort by filename (01-*, 02-*, etc.)

4. **Build wave map:**
```
Wave 1 (Parallel): [01-*.md, 02-*.md]
Wave 2 (Blocking): [03-*.md, 04-*.md]
...
```

## Step 3: Create Todo List (BLOCKING)

Use TodoWrite to create tracking todos:
- One todo per wave (e.g., "Execute Wave 1: Setup (2 commits)")
- One todo per commit (e.g., "Commit 01: chore(deps): install JWT library")
- All start as "pending"

## Step 4: Execute Waves Sequentially

**For each wave:**

### 4.1: Mark wave + commits as in_progress (TodoWrite)

### 4.2: Spawn ALL commit-executors in parallel (ONE message)

For each commit in wave, spawn with Task tool:

```
prompt: "You are a commit-executor worker agent.

Your task: Implement the commit plan at {IMPL_DIR}/{NN-type-scope-slug}.md

Read the plan file, follow all implementation steps, run the pre-commit checklist, and create the commit.

See @plugins/development-lifecycle/agents/commit-executor.md for your full instructions.

Report back with success/failure status and details."

subagent_type: "development-lifecycle:commit-executor"
description: "Execute commit {NN}"
```

**CRITICAL:** Spawn ALL wave commits in ONE message with multiple Task calls.

### 4.3: Track completions

As each agent completes:
- Parse report (success/failure)
- Update todo to "completed"
- **On failure:** ❌ STOP execution, report details

### 4.4: Mark wave completed (TodoWrite)

### 4.5: Verify wave

Run tests:
```bash
pnpm test  # or npm/yarn from overview
```

⚠️ **If tests fail:**
- ❌ STOP - report wave and output
- DO NOT proceed to next wave

✅ **If tests pass:** Continue to next wave (return to 4.1)

## Step 5: Final Verification

After ALL waves complete:

1. **Run full checks:**
```bash
pnpm test
pnpm lint
pnpm build
git status
git log --oneline -n 10
```

2. **Generate summary report** (see output-format below)

3. **Mark all todos completed**
</process>

<output-format>
**Final Summary Report:**

```
✅ Implementation Complete

Implementation directory: {path}

📊 Summary:
- Total commits: {N}
- Total waves: {M}
- All commits: ✅ Successful
- Tests: ✅ Passing
- Linting: ✅ Clean
- Build: ✅ Successful

📝 Commits Created:
{List each commit with message}

🔄 Wave Execution:
- Wave 1: {X} commits (parallel) - ✅ Complete
- Wave 2: {Y} commits (blocking) - ✅ Complete
{...continue for all waves}

⏱️ Next Steps:
1. Review commits: git log
2. Test application functionality
3. Create PR if on feature branch
4. Update remaining documentation
```

**During execution:**
- Report wave starts: "Starting Wave 1: Setup (2 commits)..."
- Report spawning: "Spawning 2 parallel commit-executors..."
- Report completions: "✅ Commit 01 completed"
- Report verifications: "Running tests after Wave 1..."
</output-format>

<constraints>
**Execution rules:**
- Execute waves IN ORDER (1 → 2 → 3...) - never skip or reorder
- Wait for ALL commits in wave before proceeding
- Spawn all wave commits in ONE message (parallel execution)
- STOP on any commit failure
- STOP on test failure after any wave
- Verify tests pass between waves

**Wave types:**
- **Parallel:** Commits independent, execute simultaneously
- **Blocking:** Commits depend on previous wave, execute after verification

**Error handling:**
- **Commit fails:** ❌ Mark todo failed, STOP, report details, suggest manual fix
- **Tests fail:** ❌ STOP, show output, identify wave, suggest review
- **Plan invalid:** ❌ STOP in Step 1, report missing files, suggest /commit-planner

**Edge cases:**
- Single commit in wave: Still spawn commit-executor (consistency)
- Empty wave: Skip to next (shouldn't happen)
- All commits in one wave: Execute all parallel, verify once
- Commit-executor spawns fix-eslint: Allow (trust sub-agent)

**Related workflow:**
- Before: `/commit-planner` creates plan
- After: Review commits, create PR, verify functionality
</constraints>
