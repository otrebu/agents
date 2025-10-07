# How to Create a Command

**Goal:** Generate a command suite with optional documentation: standalone command/agent OR command + agent with shared documentation.

## The Flexible Pattern

You can create commands in two ways:

### Pattern A: Standalone (No shared documentation)
Use for simple, self-contained commands or agents.

1. **Agent** (`agents/*.md`) — OR —
2. **Command** (`commands/*.md`)
   - Frontmatter: `allowed-tools`, `description`, optional `argument-hint`
   - Contains all instructions inline
   - Can include dynamic context via `!`command`` syntax
   - Can run specific bash commands (agents cannot)

### Pattern B: Shared Documentation (Complex commands)
Use when both agent and command versions share the same logic and need detailed, reusable instructions.

1. **Documentation** (`docs/HOW_TO_*.md`) — Optional
   - Central source of truth for complex commands
   - Detailed instructions, examples, constraints
   - Referenced by both agent and command versions

2. **Agent** (`agents/*.md`)
   - Frontmatter: `name`, `description`, `tools`, `model`
   - References doc with `@docs/HOW_TO_*.md`
   - Adds specific output behavior (e.g., save to file)
   - Tools typically: `Read, Grep, Glob, Bash`

3. **Command** (`commands/*.md`)
   - Frontmatter: `allowed-tools`, `description`, optional `argument-hint`
   - References doc with `@docs/HOW_TO_*.md`
   - Can include dynamic context via `!`command`` syntax

## When to Create Each Artifact

| Artifact | When to Create |
|----------|----------------|
| **Doc** | Only when both agent and command need to share complex instructions (DRY principle) |
| **Agent** | When task needs: file I/O, complex analysis, report generation, background work |
| **Command** | When user wants: quick invocation, bash execution, context injection, arguments |

## Information Needed

### Required for all:
- **Command name** (kebab-case, e.g., `code-review`)
- **Description** (one sentence, imperative mood)
- **Instructions** (inline or in separate doc, depending on complexity)

### For Agent (if applicable):
- **Tools needed** (default: `Read, Grep, Glob, Bash`)
- **Output behavior** (e.g., "save to X.md", "update Y file")
- **Model override** (usually `inherit`)

### For Command:
- **Allowed bash tools** (e.g., `Bash(git status:*)`, `Bash(git diff:*)`)
- **Argument hint** (e.g., `[optional commit message]`, `<file-pattern>`)
- **Dynamic context** (e.g., `!`git status``, `!`ls src/*``)

## File Structure Templates

### Standalone Command Template
```markdown
---
allowed-tools: [list specific bash patterns]
description: [One-sentence description]
argument-hint: [optional hint for CLI usage]
---

[Complete instructions inline — role, priorities, process, output format, constraints]

## Context (optional)

- Context item 1: !`bash command here`

## Your task

[Detailed task description referencing $ARGUMENTS if applicable]
```

### Documentation Template (for Pattern B only)
```markdown
**Role:** [Define the role and goal]

**Priorities (in order):**
1. Critical items
2. Important items
3. Nice-to-have items

**Output format:**
- Section 1
- Section 2

**Process:**
1. Step one
2. Step two

**Constraints:** [Any limitations or rules]
```

### Agent Template (Pattern B with shared doc)
```markdown
---
name: [command-name]
description: [One-sentence description]
tools: Read, Grep, Glob, Bash
model: inherit
---

@docs/HOW_TO_[COMMAND_NAME].md

[Additional output instructions, e.g.:]
Output a [FILENAME].md file in the project's root folder, then confirm that you have created the file.
```

### Command Template (Pattern B - references shared doc)
```markdown
---
allowed-tools: [list specific bash patterns]
argument-hint: [hint for CLI usage]
description: [One-sentence description]
---

## Context

- Context item 1: !`bash command here`
- Context item 2: !`another bash command`

## Your task

[Detailed task description referencing $ARGUMENTS if applicable]

See @docs/HOW_TO_[COMMAND_NAME].md for detailed guidelines.
```

## Examples

### Pattern A: Standalone Command (analyze-size)
- **Command only**: Self-contained instructions, runs cloc and analyzes output
- **No doc**: Instructions are simple enough to be inline
- **No agent**: Direct command execution, no background work needed

### Pattern B: Shared Documentation (code-review)
- **Doc**: Full review checklist
- **Agent**: Reviews code, saves to `CODE_REVIEW.md`
- **Command**: References doc, provides context
- **Why shared doc?**: Both agent and command use the same detailed review criteria

### Pattern A: Command with Context (commit - hypothetical without doc)
- **Command only**: Includes git context, commit guidelines inline, runs git commands
- **No agent**: Git commands are synchronous, no agent needed
- **No doc**: If guidelines are concise enough to be inline

## Best Practices

1. **Choose the right pattern**: Use Pattern A (standalone) for simple commands; Pattern B (shared doc) only when both agent and command need the same complex instructions
2. **Keep it DRY**: Never duplicate instructions between files
3. **Use `@references`**: Let the system expand documentation when using Pattern B
4. **Bash in commands only**: Agents read/analyze; commands can run bash
5. **Dynamic context**: Use `!`command`` for fresh data in command context
6. **Argument handling**: Reference `$ARGUMENTS` in command task descriptions
7. **Descriptive names**: Use imperative mood, domain-specific terminology
8. **Inline when simple**: If instructions fit in one screen, keep them inline (Pattern A)

## Process

1. Define the command's purpose and scope
2. Decide the pattern:
   - Pattern A if: single artifact (command OR agent), or simple instructions
   - Pattern B if: both agent and command needed, with complex shared logic
3. Write the instructions (inline or in doc)
4. Create the command/agent file(s)
5. Test the artifacts together
