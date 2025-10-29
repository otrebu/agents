---
name: finish-feature
description: Complete feature work and merge back to main branch. Use when user wants to finish a feature, close a feature, or merge feature branch. Switches to main, pulls latest changes, merges feature branch, and pushes to remote.
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*), Bash(git pull:*), Bash(git merge:*), Bash(git checkout:*), Bash(git stash:*), Bash(git tag:*)
---

# Finish Feature

## Overview

Completes the feature development workflow by merging the feature branch back into the main branch. Ensures working directory is clean, updates main branch, performs merge, and pushes changes to remote.

## Process

### 1. Verify Current Branch

Check the current branch to confirm it's a feature branch:

```bash
git branch --show-current
```

**If on main/master:** Ask user which feature branch to merge.

**If on feature branch:** Confirm this is the branch to finish.

### 2. Check Working Directory Status

Verify there are no uncommitted changes:

```bash
git status
```

**If uncommitted changes exist:**
- Option A: Ask user if they want to commit changes first
- Option B: Stash changes: `git stash`
- User decides which approach

### 3. Get Feature Branch Name

Store the current feature branch name for later merge:

```bash
FEATURE_BRANCH=$(git branch --show-current)
```

### 4. Switch to Main Branch

Determine main branch name (usually `main` or `master`):

```bash
git branch --list main master
```

Switch to main branch:

```bash
git checkout main  # or master
```

### 5. Pull Latest Changes

Update main branch with latest remote changes:

```bash
git pull origin main  # or master
```

**If pull fails:** User needs to resolve upstream issues before proceeding.

### 6. Merge Feature Branch

Merge the feature branch into main:

```bash
git merge $FEATURE_BRANCH --no-ff
```

Uses `--no-ff` to preserve feature branch history as a merge commit.

**If merge conflicts occur:**
- Notify user of conflicts
- List conflicting files: `git status`
- User must resolve conflicts manually
- After resolution: `git add .` and `git commit`

### 7. Push to Remote

Push merged changes to remote:

```bash
git push origin main  # or master
```

### 8. Optional: Delete Feature Branch

Ask user if they want to delete the feature branch:

**Local delete:**
```bash
git branch -d $FEATURE_BRANCH
```

**Remote delete:**
```bash
git push origin --delete $FEATURE_BRANCH
```

### 9. Confirm Completion

Output summary:
- Feature branch merged: `<feature-branch-name>`
- Main branch updated and pushed
- Branch deletion status (if applicable)

## Constraints

- **Never** merge directly without pulling latest main first
- **Always** verify working directory is clean before switching branches
- **Never** force push to main branch
- If conflicts arise, **always** let user resolve them
- **Always** confirm branch deletion with user before proceeding

## Example Usage

**User request:** "Finish the user-auth feature"

**Process:**
1. Verify: currently on `feature/user-auth`
2. Check: `git status` → clean
3. Switch: `git checkout main`
4. Pull: `git pull origin main`
5. Merge: `git merge feature/user-auth --no-ff`
6. Push: `git push origin main`
7. Ask: "Delete feature/user-auth branch? (y/n)"
8. Confirm: "Feature 'user-auth' merged to main and pushed. Feature branch deleted."

## Error Handling

**Uncommitted changes:**
- Offer to commit or stash
- Never proceed without resolving

**Pull conflicts:**
- User must resolve remote conflicts first
- May need to fetch and rebase

**Merge conflicts:**
- List conflicting files
- Wait for user to resolve
- Guide through `git add` + `git commit` after resolution

**Push failures:**
- Check remote permissions
- Verify branch protection rules
- May need pull request instead of direct merge
