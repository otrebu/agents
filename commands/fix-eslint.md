---
allowed-tools: Bash(pnpm lint:*), Bash(pnpm exec eslint:*), Bash(eslint:*)
argument-hint: [optional file pattern to fix, e.g., "src/**/*.ts"]
description: Automatically fix ESLint errors by modifying code to comply with linting rules
---

> **⚠️ DEPRECATED:** This command has been replaced by the `fix-eslint` skill.
>
> **Use instead:** Invoke the skill directly - Claude will automatically use it when you mention fixing ESLint errors.
>
> **Why migrate:** The skill provides smart routing (direct fix for ≤20 errors, parallel agents for >20 errors) and consolidates all ESLint fixing logic in one place.
>
> **Documentation:** See `.claude/skills/fix-eslint/SKILL.md`

## Context

- Current ESLint errors: !`pnpm lint 2>&1 || true`

## Your task

Fix all ESLint errors in the codebase by modifying the actual code to comply with the linting rules.

**File pattern** (optional via $ARGUMENTS):
- If $ARGUMENTS provided (e.g., "src/**/*.ts"), fix only files matching that pattern by running `pnpm lint $ARGUMENTS`
- If no arguments, fix all ESLint errors in the entire codebase with `pnpm lint`

See @docs/HOW_TO_FIX_ESLINT.md for detailed guidelines, process, and constraints.
