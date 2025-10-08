# Execute the plan in a parallel worktree

**Role:** Feature implementation assistant for parallel experimentation

**Purpose:** Implement a feature specification in one worktree instance as part of a parallel experimentation workflow.

## Variables

Parse from `$ARGUMENTS`:
- PLAN_PATH: Path to the feature specification (e.g., "specs/api-refactor.md" or "docs/HOW_TO_API_REFACTOR.md")
- WORKTREE_ID: The worktree identifier (e.g., "1", "2", "3")

## Pre-flight checks

1. **Read the plan**
   - READ: PLAN_PATH
   - Extract: requirements, acceptance criteria, constraints

2. **Verify location**
   - RUN: `pwd`
   - Confirm we're inside a worktree directory (path should contain `trees/`)
   - RUN: `git branch --show-current`
   - Confirm we're on the correct experiment branch

3. **Check worktree state**
   - RUN: `git status`
   - RUN: `git worktree list`

## Instructions

1. **Initialize environment** (if needed)
   - If `package.json` exists and no `node_modules`: run `pnpm install`
   - Copy any necessary config files if missing

2. **Implement the feature** according to PLAN_PATH
   - Follow the specification exactly
   - Implement all required functionality
   - Add/update tests to verify behavior
   - Keep implementation focused and minimal

3. **Verify implementation**
   - Run tests: `pnpm test` (if applicable)
   - Run linter: `pnpm lint` (if applicable)
   - Run type-check: `pnpm build` or `tsc --noEmit` (if applicable)

4. **Document results** in `RESULTS.md`
   - Write concise summary of approach taken
   - Note any key decisions or trade-offs
   - List what was implemented vs. skipped
   - Document how to verify the implementation
   - Note any issues or blockers encountered

5. **Commit changes**
   - Stage all changes: `git add .`
   - Create descriptive commit following conventional commits
   - DO NOT push (changes stay local for comparison)

## Output format

Update `RESULTS.md` with:

```markdown
# Results for [branch-name]

## Approach
[Brief description of implementation strategy]

## What was implemented
- [Feature/component 1]
- [Feature/component 2]
- ...

## Key decisions
- [Decision 1 and rationale]
- [Decision 2 and rationale]

## How to verify
\`\`\`bash
# Commands to run tests or demo
pnpm test
pnpm build
\`\`\`

## Trade-offs
- [Trade-off 1]
- [Trade-off 2]

## Issues encountered
- [Issue 1, if any]
```

## Constraints

- **DO NOT** start long-running dev servers (no `pnpm dev`)
- **DO NOT** push changes to remote
- **DO NOT** modify files outside the current worktree
- **DO NOT** skip tests or documentation
- Focus on completing the implementation within the worktree scope
- If the plan is unclear, document assumptions in RESULTS.md

## Example usage

From within `trees/api-refactor-1/`:
```
/parallel-exec specs/api-refactor.md 1
```

This will:
1. Read `specs/api-refactor.md`
2. Implement the spec in the current worktree
3. Run tests
4. Update `RESULTS.md`
5. Commit changes locally
