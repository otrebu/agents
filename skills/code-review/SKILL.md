---
name: code-review
description: Expert code review specialist. Reviews for quality and intent alignment. Use immediately after writing or modifying code, or when user requests code review. Handles both uncommitted changes and targeted file reviews.
allowed-tools: Read, Write, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(pnpm:*), Task, TodoWrite
---

# Code Review

Expert code reviewer with automated pre-review checks (tests, linting, formatting) and optional auto-fix capabilities.

## Parameters

The skill accepts different modes and options:

- **mode**: `changes` | `target`
  - `changes`: Review uncommitted changes (git diff + status)
  - `target`: Review specific files/directories matching glob pattern

- **target**: File path or glob pattern (required if mode=target)
  - Examples: `src/auth`, `**/*.ts`, `lib/utils.ts`

- **intent**: Optional description or file reference
  - Plain text: `"add OAuth2 authentication"`
  - File reference (example): `@docs/requirements.md` (placeholder - replace with actual requirements file)
  - Used for Requirements Alignment section

- **save**: Boolean flag (--save)
  - If true: write review to `docs/CODE_REVIEW.md`
  - Default: show in chat only

## Process Workflow

### 1. Gather Code

**changes mode:**
```bash
git status
git diff HEAD
```

**target mode:**
- Use Glob to find files matching target pattern
- Read matched files
- Exit gracefully if nothing found

### 2. Load Intent (if provided)

- If starts with `@`: Read file at path
- Otherwise: use string as-is
- Store for Requirements Alignment section

### 3. Pre-Review Checks

Run [scripts/pre-review.sh](scripts/pre-review.sh) to check tests, linting, formatting:

```bash
bash scripts/pre-review.sh
```

**Exit codes** (bitwise OR):
- `0`: All passed → proceed to review
- `1`: Lint failed → auto-fix
- `2`: Format failed → auto-fix
- `4`: Tests failed → auto-fix
- `8`: No package.json → skip to review

**Handle failures:**

Exit code 8 (no package.json):
- Skip all checks
- Proceed directly to review

Exit code 1 (lint failed):
- Spawn Task with fix-eslint skill
- Wait for completion
- If auto-fix fails or times out, note the failure and proceed to review anyway
- Re-run pre-review.sh once. If still failing after the second run, proceed to review and note failures in output

Exit code 2 (format failed):
- Run `pnpm format` directly
- Re-run pre-review.sh once. If still failing after the second run, proceed to review and note failures in output

Exit code 4 (tests failed):
- Spawn Task: "Fix failing tests - review test output and fix the code to make tests pass"
- Wait for completion
- If auto-fix fails or times out, note the failure and proceed to review anyway
- Re-run pre-review.sh once. If still failing after the second run, proceed to review and note failures in output

Multiple failures (e.g., 7 = lint + format + tests):
- Handle in sequence: format first, then lint, then tests
- Re-run checks after each fix

**Max attempts:**
- Limit to 2 full pre-review cycles (1 initial run + 1 retry)
- If checks still fail after second run, proceed to review anyway
- Note failures in review output

### 4. Execute Review

Follow [methodology.md](methodology.md) for complete review process and output format.

**Process:**
1. Scan for critical safety/security issues
2. Verify tests & edge cases
3. If intent provided: validate implementation accomplishes goals
4. Note improvements & positives
5. Summarize decision with next steps

**Output format:** Use exact headings from [methodology.md](methodology.md):
- **Critical Issues** - with line numbers (L42, L42-47, file.ts:42)
- **Functional Gaps** - missing tests/handling
- **Requirements Alignment** - only if intent provided
- **Improvements Suggested**
- **Positive Observations**
- **Overall Assessment** - Approve | Request Changes | Comment Only

### 5. Present Review

Always show review in chat, formatted with markdown headings.

### 6. Save (if requested)

If save=true:
- Use Write tool to create/overwrite `docs/CODE_REVIEW.md`
- Include all sections with exact headings
- Preserve markdown formatting

## Examples

**Review uncommitted changes:**
```
mode: changes
intent: null
save: false
```

**Review with intent:**
```
mode: changes
intent: "Implement OAuth2 authentication with secure token storage"
save: false
```

**Review specific files:**
```
mode: target
target: "src/auth/**/*.ts"
intent: "security review"
save: true
```

**Review with file-based requirements:**
```
mode: changes
intent: "@docs/requirements/auth.md"  # Example: replace with actual requirements file path
save: true
```

## Notes

- Use this skill immediately after writing or modifying code
- Gracefully handles projects without package.json (skips checks)
- Auto-fixes: delegates to fix-eslint skill for lint errors, runs pnpm format for format errors
- Intent can be plain text or file reference with @ prefix
- Re-runs checks after auto-fixes, max 2 cycles
- Pre-review script ([scripts/pre-review.sh](scripts/pre-review.sh)) returns bitwise exit codes: 1=lint, 2=format, 4=test, 8=no package.json
