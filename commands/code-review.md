---
allowed-tools: Read, Bash(git status:*), Bash(git diff:*), Task
argument-hint: changes [intent] [--save] | target <path> [intent] [--save]
description: Review code for quality and intent alignment
---

Review code changes or existing code against optional requirements/focus areas.

See @docs/HOW_TO_CODE_REVIEW.md for complete review methodology.

## Context (for changes mode)

Current status:
!`git status`

All uncommitted changes (staged + unstaged):
!`git diff HEAD`

## Arguments

$ARGUMENTS

## Task

Parse arguments and invoke code-reviewer agent:

**Mode detection:**
- First word "target" → mode=target, extract path from second word
- Otherwise → mode=changes

**Intent extraction:**
- Everything after mode/path, excluding --save
- If starts with @: file reference

**Save flag:**
- Present anywhere → save=true

**Examples:**
- `changes "add OAuth2"` → mode=changes, intent="add OAuth2", save=false
- `target src/auth "security" --save` → mode=target, target="src/auth", intent="security", save=true

Invoke code-reviewer agent with: mode, target (if applicable), intent, save flag.
