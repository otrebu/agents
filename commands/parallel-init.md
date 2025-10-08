# Initialize N worktrees for a feature

**Role:** Parallel worktree initialization assistant

**Purpose:** Create N isolated Git worktrees for parallel experimentation on the same feature specification.

## Variables

Parse from `$ARGUMENTS`:
- FEATURE: Feature slug (kebab-case, e.g., "api-refactor")
- COUNT: Number of parallel worktrees to create (e.g., "3")

## Instructions

1. **Verify current git status** to ensure clean state
   - Run: `git status`
   - Warn if there are uncommitted changes that might be lost

2. **Create worktrees** using the helper script
   - Run: `scripts/wt-parallel FEATURE COUNT`
   - This creates `trees/FEATURE-1`, `trees/FEATURE-2`, ..., `trees/FEATURE-COUNT`
   - Each with its own branch: `FEATURE-1`, `FEATURE-2`, etc.

3. **Verify creation**
   - Run: `git worktree list`
   - Confirm all branches exist: `git branch --list 'FEATURE-*'`

4. **Output confirmation**
   - List the created worktrees and their paths
   - Remind user of next steps:
     * Open a Claude Code session in each worktree directory
     * Use `/parallel-exec` to run the feature plan in each tree
     * Compare results using `RESULTS.md` files

## Example usage

```
/parallel-init api-refactor 3
```

Creates:
- `trees/api-refactor-1` (branch: `api-refactor-1`)
- `trees/api-refactor-2` (branch: `api-refactor-2`)
- `trees/api-refactor-3` (branch: `api-refactor-3`)

## Constraints

- Feature slug must be kebab-case
- Count must be a positive integer (typically 2-5)
- Never initialize worktrees if uncommitted changes exist in current branch
- All worktrees derive from current HEAD
