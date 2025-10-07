# How to Create a Command

**Goal:** Generate a complete command suite following the DRY pattern: centralized documentation, optional agent version, and slash command version.

## The Three-Artifact Pattern

1. **Documentation** (`docs/HOW_TO_*.md`)
   - Central source of truth
   - Detailed instructions, examples, constraints
   - Referenced by both agent and command versions

2. **Agent** (`agents/*.md`) — Optional
   - Frontmatter: `name`, `description`, `tools`, `model`
   - References doc with `@docs/HOW_TO_*.md`
   - Adds specific output behavior (e.g., save to file)
   - Tools typically: `Read, Grep, Glob, Bash`

3. **Command** (`commands/*.md`) — Always included
   - Frontmatter: `allowed-tools`, `description`, optional `argument-hint`
   - References doc with `@docs/HOW_TO_*.md`
   - Can include dynamic context via `!`command`` syntax
   - Can run specific bash commands (agents cannot)

## When to Create Each Artifact

| Artifact | When to Create |
|----------|----------------|
| **Doc** | Always — it's the source of truth |
| **Agent** | When task needs: file I/O, complex analysis, report generation, background work |
| **Command** | When user wants: quick invocation, bash execution, context injection, arguments |

## Information Needed

### Required for all:
- **Command name** (kebab-case, e.g., `code-review`)
- **Description** (one sentence, imperative mood)
- **Documentation content** (instructions, format, examples)

### For Agent (if applicable):
- **Tools needed** (default: `Read, Grep, Glob, Bash`)
- **Output behavior** (e.g., "save to X.md", "update Y file")
- **Model override** (usually `inherit`)

### For Command:
- **Allowed bash tools** (e.g., `Bash(git status:*)`, `Bash(git diff:*)`)
- **Argument hint** (e.g., `[optional commit message]`, `<file-pattern>`)
- **Dynamic context** (e.g., `!`git status``, `!`ls src/*``)

## File Structure Templates

### Documentation Template
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

### Agent Template
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

### Command Template (Simple)
```markdown
---
allowed-tools: [list specific bash patterns]
description: [One-sentence description]
---

See @docs/HOW_TO_[COMMAND_NAME].md for the complete checklist and output format.
```

### Command Template (With Context)
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

### Simple Command (code-review pattern)
- **Doc**: Full review checklist
- **Agent**: Reviews code, saves to `CODE_REVIEW.md`
- **Command**: Just references doc, no bash needed

### Command with Context (commit pattern)
- **Doc**: Commit message guidelines
- **No agent**: Commands like git are synchronous, no agent needed
- **Command**: Includes git context, runs git commands, accepts arguments

### Analysis Command (hypothetical `analyze-bundle`)
- **Doc**: Bundle analysis criteria, thresholds, recommendations
- **Agent**: Runs webpack-bundle-analyzer, generates report
- **Command**: Simple invocation with optional `--target` argument

## Best Practices

1. **Keep docs DRY**: Never duplicate instructions between files
2. **Use `@references`**: Let the system expand documentation
3. **Bash in commands only**: Agents read/analyze; commands can run bash
4. **Dynamic context**: Use `!`command`` for fresh data in command context
5. **Argument handling**: Reference `$ARGUMENTS` in command task descriptions
6. **Descriptive names**: Use imperative mood, domain-specific terminology

## Process

1. Define the command's purpose and scope
2. Write the documentation first (source of truth)
3. Decide if an agent is needed (complex analysis/output)
4. Create command version with appropriate tools and context
5. Test all three artifacts together
