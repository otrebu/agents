---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*)
argument-hint: [optional instructions like "and push"]
description: Create a git commit following conventional commits
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits (for style reference): !`git log --oneline -10`

## Your task

Create a single git commit following these rules:

1. **Commit message format**: Use conventional commits format:
   - `feat(scope): description` for new features
   - `fix(scope): description` for bug fixes
   - `refactor(scope): description` for refactoring
   - `docs(scope): description` for documentation
   - `test(scope): description` for tests
   - `chore(scope): description` for maintenance

2. **Message content**:
   - Keep the summary line concise (50-72 chars)
   - Use imperative mood ("add", not "added" or "adds")
   - Include body with details if needed
   - Always auto-generate the commit message based on changes (never use $ARGUMENTS as commit message)

3. **What to commit**:
   - Review the git status and diff above
   - Stage relevant untracked files with `git add`
   - Commit all staged changes together
   - Do NOT commit files that likely contain secrets (.env, credentials, etc)

4. **Important**:
   - NEVER add Claude's signature or co-authorship
   - User wants full credit for commits
   - Keep commits focused and atomic

5. **Additional instructions** (via $ARGUMENTS):
   - Check $ARGUMENTS for post-commit instructions
   - Common instructions: "and push", "and push origin <branch>"
   - Execute instructions after successful commit
   - Examples:
     - `/commit and push` → commit then push to remote
     - `/commit` → commit only, no push

## Example format

```
feat(api): add user authentication endpoint

- Implement JWT token generation
- Add login/logout routes
- Include password hashing with bcrypt
```
