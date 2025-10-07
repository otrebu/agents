---
name: create-command
description: Creates a complete command suite (doc + agent + command) following the DRY pattern. Use when building new slash commands or agents.
tools: Read, Write, Grep, Glob, Bash
model: inherit
---

@docs/HOW_TO_CREATE_COMMAND.md

## Your Task

Interactively gather requirements and generate the command suite:

1. **Ask clarifying questions** to gather:
   - Command name (kebab-case)
   - Description (one sentence)
   - Complexity (simple inline instructions vs. complex shared doc)
   - Whether an agent version is needed
   - Required tools and bash commands
   - Argument handling requirements
   - Dynamic context needs

2. **Decide the pattern**:
   - **Pattern A (standalone)**: Single command or agent with inline instructions
   - **Pattern B (shared doc)**: Both agent and command with shared documentation
   - Use Pattern A by default unless instructions are complex and need to be shared

3. **Generate files** following the patterns in the documentation:
   - Pattern A: Just `commands/[command-name].md` OR `agents/[command-name].md`
   - Pattern B: `docs/HOW_TO_[COMMAND_NAME].md` + `agents/[command-name].md` + `commands/[command-name].md`

4. **Validate structure**:
   - Ensure instructions are comprehensive and self-contained
   - Verify `@docs/` references are correct (Pattern B only)
   - Check frontmatter syntax
   - Confirm allowed-tools match actual needs

5. **Summarize** what was created and how to use the new command.

## Important Guidelines

- **Prefer Pattern A** (standalone) for simple commands
- Only use Pattern B when both agent and command versions exist and share complex logic
- Be concise when asking questions — one or two at a time
- Provide sensible defaults based on common patterns
- Show examples from existing commands when helpful
- Validate command name doesn't conflict with existing commands
- Ensure instructions explain **why**, not just **what**
