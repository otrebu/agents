# How to Use Parallel Worktrees for Multi-Agent Experimentation

**Pattern:** Parallel AI experimentation using Git worktrees

**Purpose:** Run multiple Claude Code sessions implementing the same feature specification in parallel, then compare results and merge the best approach.

---

## The Workflow (5 Steps)

**Idea:** 1 plan → N worktrees → N Claude runs → compare → pick winner → merge → prune.

### 1. Create a Feature Specification

Write a detailed spec in `specs/<feature>.md` that defines:
- Requirements and acceptance criteria
- Constraints and trade-offs
- Expected output format
- How success will be measured

**Example:** `specs/api-refactor.md`
```markdown
# API Client Refactor

## Goal
Refactor the API client to use a modern fetch-based approach with better error handling.

## Requirements
- Replace axios with native fetch
- Add retry logic with exponential backoff
- Implement request/response interceptors
- Add TypeScript types for all endpoints
- Maintain backward compatibility with existing code

## Acceptance Criteria
- All existing tests pass
- New tests for retry logic
- Type coverage at 100%
- No breaking changes to public API

## Constraints
- Must work in both Node.js and browser
- Keep bundle size under current size + 2KB
- Response time should not increase
```

### 2. Initialize N Parallel Worktrees

Run the init command to create isolated worktrees:

```bash
/parallel-init api-refactor 3
```

This creates:
```
trees/
├── api-refactor-1/    (branch: api-refactor-1)
├── api-refactor-2/    (branch: api-refactor-2)
└── api-refactor-3/    (branch: api-refactor-3)
```

Each worktree is:
- An isolated Git working directory
- On its own branch derived from current HEAD
- Contains a `RESULTS.md` template
- Shares the same `.git` directory (disk-efficient)

### 3. Run Claude Code in Each Worktree

Open separate Claude Code sessions (terminals/tabs) for each worktree:

**Terminal 1:**
```bash
cd trees/api-refactor-1
# Run Claude Code here
/parallel-exec specs/api-refactor.md 1
```

**Terminal 2:**
```bash
cd trees/api-refactor-2
# Run Claude Code here
/parallel-exec specs/api-refactor.md 2
```

**Terminal 3:**
```bash
cd trees/api-refactor-3
# Run Claude Code here
/parallel-exec specs/api-refactor.md 3
```

Each Claude session will:
- Read the spec from `specs/api-refactor.md`
- Implement the feature independently
- Run tests and validation
- Document approach in `RESULTS.md`
- Commit changes locally

### 4. Compare Results

Review the implementations side-by-side:

**Read the summaries:**
```bash
cat trees/api-refactor-1/RESULTS.md
cat trees/api-refactor-2/RESULTS.md
cat trees/api-refactor-3/RESULTS.md
```

**Compare diffs:**
```bash
# Compare implementation 1 vs 2
git diff api-refactor-1 api-refactor-2

# Compare implementation 2 vs 3
git diff api-refactor-2 api-refactor-3
```

**Run tests in parallel:**
```bash
# Terminal 1
cd trees/api-refactor-1 && pnpm test

# Terminal 2
cd trees/api-refactor-2 && pnpm test

# Terminal 3
cd trees/api-refactor-3 && pnpm test
```

**For apps with dev servers (different ports):**
```bash
# Terminal 1
cd trees/api-refactor-1 && PORT=5174 pnpm dev

# Terminal 2
cd trees/api-refactor-2 && PORT=5175 pnpm dev

# Terminal 3
cd trees/api-refactor-3 && PORT=5176 pnpm dev
```

**Evaluation criteria:**
- Code quality and maintainability
- Test coverage and quality
- Performance characteristics
- Adherence to spec
- Bundle size impact
- Documentation completeness

### 5. Merge Winner and Clean Up

Once you've chosen the best implementation:

**Merge the winner:**
```bash
# Switch to main branch
git checkout main

# Merge the winning branch
git merge api-refactor-2  # assuming #2 won

# Optionally create PR instead
gh pr create --head api-refactor-2
```

**Clean up the other worktrees:**
```bash
# Remove all 3 worktrees and their branches
scripts/wt-clean api-refactor 3

# Or manually remove specific ones
git worktree remove trees/api-refactor-1
git worktree remove trees/api-refactor-3
git branch -D api-refactor-1 api-refactor-3
```

---

## When to Use N>1?

**3-5 worktrees (exploratory design):**
- Multiple UX approaches to the same problem
- API surface design with different paradigms
- Architecture experiments (microservices vs monolith, etc.)
- Different state management strategies

**2-3 worktrees (algorithmic variants):**
- Performance optimization with different algorithms
- Different data structure choices
- Trade-off exploration (speed vs memory)

**1 worktree (deterministic tasks):**
- Typo fixes
- Simple refactors
- Configuration changes
- Documentation updates

---

## Advanced Patterns

### Pattern: Hybrid Approach (Best of Both)

After reviewing all implementations, cherry-pick the best parts:

```bash
# Start with winner as base
git checkout main
git merge api-refactor-2

# Cherry-pick specific commits from others
git cherry-pick api-refactor-1~2  # error handling from #1
git cherry-pick api-refactor-3~1  # test utilities from #3
```

### Pattern: Stacked Experiments

For incremental exploration, stack experiments:

```bash
# Create base experiment
/parallel-init feature-base 1

# After reviewing, create variants
cd trees/feature-base-1
/parallel-init feature-variant 2

# Now you have:
# - feature-base-1 (original)
# - feature-variant-1 (derived from base)
# - feature-variant-2 (derived from base)
```

### Pattern: Spec Evolution

Update the spec between runs based on learnings:

```bash
# Run first batch
/parallel-init api-v1 3
# ... review results ...

# Update spec based on findings
# Edit specs/api-refactor.md

# Run second batch with updated spec
/parallel-init api-v2 3
```

---

## Best Practices

### DO:
✅ Write detailed, unambiguous specs with clear acceptance criteria
✅ Use meaningful feature slugs (kebab-case, 2-4 words)
✅ Document key decisions in each `RESULTS.md`
✅ Run tests before comparing (verify all implementations work)
✅ Clean up worktrees regularly to avoid clutter
✅ Use relative paths in worktrees for portability

### DON'T:
❌ Start experiments without a clear spec
❌ Create too many worktrees (>5) - comparison becomes unwieldy
❌ Leave worktrees lingering after making a decision
❌ Push experiment branches to remote (keep local until decided)
❌ Modify files outside worktree boundaries
❌ Run long-lived dev servers in worktrees (use for build/test only)

---

## Troubleshooting

### "Branch already exists"
```bash
# Check existing worktrees
git worktree list

# Remove stale worktree
git worktree remove trees/feature-1
git worktree prune
```

### "Cannot checkout branch, already checked out"
Each branch can only be checked out once across all worktrees. Use unique branch names or remove the existing worktree first.

### "Changes not showing up in comparison"
Make sure you committed changes in each worktree:
```bash
cd trees/feature-1
git status  # check for uncommitted changes
git add .
git commit -m "feat: implementation variant 1"
```

### "Worktree taking too much disk space"
Worktrees share the `.git` directory, so they're disk-efficient. However:
- Run `pnpm install` only once, then symlink `node_modules` if needed
- With pnpm, most packages are in the global store (already efficient)
- Clean up worktrees when done: `scripts/wt-clean <feature> <n>`

---

## References

- **Git worktree docs:** https://git-scm.com/docs/git-worktree
- **Original inspiration:** Agent Interviews parallel coding article
- **Claude Code slash commands:** https://docs.claude.com/en/docs/claude-code/slash-commands

---

## Example: Real-World Session

```bash
# 1. Write the spec
cat > specs/auth-refactor.md <<EOF
# Authentication System Refactor

## Goal
Modernize auth to use JWT with refresh tokens

## Requirements
- Implement JWT access tokens (15min TTL)
- Add refresh token rotation
- Secure httpOnly cookie storage
- Add token revocation list
...
EOF

# 2. Initialize 3 parallel experiments
/parallel-init auth-refactor 3

# 3. Open 3 Claude Code sessions
# Terminal 1: cd trees/auth-refactor-1 && /parallel-exec specs/auth-refactor.md 1
# Terminal 2: cd trees/auth-refactor-2 && /parallel-exec specs/auth-refactor.md 2
# Terminal 3: cd trees/auth-refactor-3 && /parallel-exec specs/auth-refactor.md 3

# 4. Wait for all to complete, then compare
cat trees/*/RESULTS.md
git diff auth-refactor-1 auth-refactor-2

# 5. Test each
cd trees/auth-refactor-1 && pnpm test
cd trees/auth-refactor-2 && pnpm test
cd trees/auth-refactor-3 && pnpm test

# 6. Merge the winner (#2 had best balance of security + simplicity)
git checkout main
git merge auth-refactor-2 -m "feat(auth): modernize to JWT with refresh tokens"

# 7. Clean up
scripts/wt-clean auth-refactor 3
```

Done! You now have the best implementation merged, and learned from all three approaches.
