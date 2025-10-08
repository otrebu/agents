---
allowed-tools: Bash(pnpm lint:*), Bash(pnpm exec eslint:*), Bash(eslint:*)
argument-hint: [optional file pattern to fix, e.g., "src/**/*.ts"]
description: Automatically fix ESLint errors by modifying code to comply with linting rules
---

## Context

- Current ESLint errors: !`pnpm lint 2>&1 || true`

## Your task

Fix all ESLint errors in the codebase by modifying the actual code to comply with the linting rules.

**File pattern** (optional via $ARGUMENTS):
- If $ARGUMENTS provided (e.g., "src/**/*.ts"), fix only files matching that pattern by running `pnpm lint $ARGUMENTS`
- If no arguments, fix all ESLint errors in the entire codebase with `pnpm lint`

See @docs/HOW_TO_FIX_ESLINT.md for detailed guidelines, process, and constraints.
