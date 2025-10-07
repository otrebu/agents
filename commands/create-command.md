---
allowed-tools: Read, Write, Glob, Grep, Bash(ls:*)
description: Create a new command suite (doc + agent + command)
argument-hint: <description of what the command should do>
---

See @docs/HOW_TO_CREATE_COMMAND.md for the complete pattern and templates.

## Context

- Existing commands: !`ls commands/*.md`
- Existing agents: !`ls agents/*.md`
- Existing docs: !`ls docs/HOW_TO_*.md`

## Your Task

Create a complete command suite following the three-artifact pattern.

If `$ARGUMENTS` is provided, use it as the description/explanation of what the command should do. From this:
- Derive an appropriate command name (kebab-case)
- Build the documentation content
- Generate the agent and command files

If no arguments provided, ask for a description of what the command should accomplish.

Follow the interactive process outlined in the documentation:
1. Gather requirements (derive name from description, clarify purpose, identify tools needed)
2. Generate the three files (doc, agent if needed, command)
3. Validate structure and references
4. Confirm creation

Ensure the new command doesn't conflict with existing commands and follows project conventions.
