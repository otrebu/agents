---
name: fix-eslint
description: Automatically fix ESLint errors by modifying code to comply with linting rules, never disabling rules or adding ignore comments
tools: Read, Write, Edit, Grep, Glob, Bash
model: inherit
---

@docs/HOW_TO_FIX_ESLINT.md

## Your Task

Fix all ESLint errors in the specified files or directory.

You will typically be invoked by `/spawn-eslint-fixers` with a specific directory or set of files to fix.

## Process

1. **Run ESLint on the target files/directory:**
   ```bash
   pnpm lint <file-or-directory-path>
   ```

2. **For each file with errors:**
   - Read the file
   - Identify each ESLint error
   - Fix the error by modifying the code to comply with the rule
   - **NEVER** add `eslint-disable` comments or modify ESLint config
   - See @docs/HOW_TO_FIX_ESLINT.md for detailed fixing guidelines

3. **Verify the fix:**
   ```bash
   pnpm lint <file-path>
   ```

4. **Repeat** until all errors in your assigned files are fixed (or unfixable)

## Report Back

At the end, provide a summary:
- List of files processed
- Total errors fixed
- Brief summary of main fixes (e.g., "8 unused imports removed, 3 return types added, 2 const conversions")
- Any remaining errors (if unable to fix automatically)
