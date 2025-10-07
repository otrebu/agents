---
allowed-tools: Bash(git branch:*), Bash(git checkout:*)
argument-hint: <feature description>
description: Create or switch to a feature branch based on description
---

## Context

- Current branch: !`git branch --show-current`
- Existing feature branches: !`git branch --list 'feature/*'`

## Your task

Start work on a new feature described as: $ARGUMENTS

See @docs/HOW_TO_START_FEATURE.md for detailed guidelines on branch naming and workflow.
