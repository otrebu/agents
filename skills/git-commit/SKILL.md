---
name: git-commit
description: Create git commits following conventional commits format. Use when user asks to commit changes, create a commit, or save work to git. Handles staging files, generating commit messages from diffs, and optional push operations.
---

# Git Commit with Conventional Commits

## Overview

Automatically stage changes and create conventional commits based on git diff analysis.

## Workflow

### 1. Gather Context

```bash
git status
git diff HEAD
git branch --show-current
git log --oneline -10
```

### 2. Analyze Changes

Review the diff to determine:
- **Type**: feat, fix, refactor, docs, test, chore
- **Scope**: affected module/component
- **Description**: concise summary in imperative mood

### 3. Stage Files

```bash
git add <relevant-files>
```

**Critical**: NEVER stage:
- `.env` files
- Credential files
- Secret keys
- Token files

### 4. Create Commit

Format:
```
<type>(scope): description

- Detail line 1
- Detail line 2
```

Rules:
- Summary: 50-72 chars
- Imperative mood: "add" not "added"
- Auto-generate from diff (never use user's exact words as message)
- NEVER add Claude signature or co-authorship
- Keep commits atomic and focused

### 5. Post-Commit Actions

Check user's request for post-commit instructions:
- "and push" → `git push`
- "and push origin <branch>" → `git push origin <branch>`
- No instruction → commit only

## Type Reference

- `feat(scope):` - New features
- `fix(scope):` - Bug fixes
- `refactor(scope):` - Code restructuring
- `docs(scope):` - Documentation
- `test(scope):` - Tests
- `chore(scope):` - Maintenance

## Example

```
feat(api): add user authentication endpoint

- Implement JWT token generation
- Add login/logout routes
- Include password hashing with bcrypt
```
