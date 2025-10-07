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

Create a command suite following either Pattern A (standalone) or Pattern B (shared documentation).

If `$ARGUMENTS` is provided, use it as the description/explanation of what the command should do. From this:
- Derive an appropriate command name (kebab-case)
- Decide if Pattern A (standalone inline) or Pattern B (shared doc) is appropriate
- Build the instructions (inline or in separate doc)
- Generate the necessary files

If no arguments provided, ask for a description of what the command should accomplish.

Follow the interactive process outlined in the documentation:
1. Gather requirements (derive name from description, clarify purpose, identify tools needed)
2. Decide pattern: Pattern A by default, Pattern B only if both agent and command need complex shared logic
3. Generate files (Pattern A: just command/agent; Pattern B: doc + agent + command)
4. Validate structure and references
5. Confirm creation

Ensure the new command doesn't conflict with existing commands and follows project conventions.
