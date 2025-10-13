---
allowed-tools: Read, Write, Glob, Grep, Bash(ls:*)
description: Create slash command(s) and optional agent/doc
argument-hint: [and agent] <what the command should do>
---

# Create Command Suite

You are an expert at creating Claude Code slash commands following best practices.

## Mode Detection

Parse `$ARGUMENTS` to determine creation mode:

- **Pattern B** (command + agent + doc): If `$ARGUMENTS` contains "and agent" or "and an agent"
  - Example: `/create-command and agent that analyzes code security`
- **Pattern A** (command only): Otherwise
  - Example: `/create-command analyzes code size with cloc`
  - Example: `/create-command only analyzes code size`

## Context

Current state of the codebase:
- Existing commands: !`ls commands/*.md 2>/dev/null || echo "none"`
- Existing agents: !`ls agents/*.md 2>/dev/null || echo "none"`
- Existing docs: !`ls docs/HOW_TO_*.md 2>/dev/null || echo "none"`

## Your Task

### Step 1: Gather Information

From `$ARGUMENTS`, derive:
1. **Command name** (kebab-case, e.g., `analyze-security`)
   - Remove "and agent", "only", "that", "to", etc.
   - Convert to kebab-case
2. **Purpose** (one-sentence description, imperative mood)
3. **Tools needed**
   - Commands: specific bash patterns like `Bash(git status:*)`, `Bash(cloc:*)`
   - Agents: typically `Read, Grep, Glob, Bash`
4. **Arguments** (if the command should accept parameters)

### Step 2: Check for Conflicts

Verify the derived name doesn't conflict with existing commands/agents listed in Context.

### Step 3: Generate Files

#### Pattern A: Standalone Command

Create **one file**: `commands/{name}.md`

```markdown
---
allowed-tools: [specific bash patterns]
description: [One-sentence description]
argument-hint: [optional, e.g., "[file-pattern]" or "<required-arg>"]
---

[Complete instructions inline]

**Role:** [Define what this command does]

**Process:**
1. [Step one]
2. [Step two]
3. [Output format/results]

**Constraints:**
- [Any limitations]
- [Rules to follow]

## Context (if needed)

- Relevant data: !`[bash command for dynamic context]`

## Your Task

[Detailed instructions. Use $ARGUMENTS if argument-hint is provided]
```

#### Pattern B: Command + Agent + Doc

Create **three files**:

**1. `docs/HOW_TO_{NAME}.md`** (shared instructions)
```markdown
# How to {Task Name}

**Role:** [Define the role and goal]

**Priorities (in order):**
1. [Critical item]
2. [Important item]
3. [Nice-to-have]

**Process:**
1. [Step one]
2. [Step two]
3. [Step three]

**Output Format:**
- [Section 1]
- [Section 2]

**Constraints:**
- [Limitation 1]
- [Limitation 2]
```

**2. `agents/{name}.md`**
```markdown
---
name: {name}
description: [One-sentence description]
tools: Read, Grep, Glob, Bash
model: inherit
---

@docs/HOW_TO_{NAME}.md

Output a {FILENAME}.md file in the project root, then confirm creation.
```

**3. `commands/{name}.md`**
```markdown
---
allowed-tools: [specific bash patterns]
argument-hint: [optional]
description: [One-sentence description]
---

## Context

- Relevant data: !`[bash command]`

## Your Task

[Task description referencing $ARGUMENTS if applicable]

See @docs/HOW_TO_{NAME}.md for detailed guidelines.
```

### Step 4: Validate

Before creating files, check:
- ✅ Frontmatter is complete
- ✅ Description is imperative mood, concise
- ✅ No duplicate names
- ✅ Bash tools are specific patterns (not wildcards)
- ✅ References work correctly (Pattern B only)
- ✅ Dynamic context uses valid commands (commands only)

### Step 5: Create Files

Use the Write tool to create the file(s).

### Step 6: Confirm

Report what was created:
- Pattern A: "Created `commands/{name}.md`"
- Pattern B: "Created command suite: `commands/{name}.md`, `agents/{name}.md`, `docs/HOW_TO_{NAME}.md`"

## Examples

### Example 1: Pattern A
**Input:** `/create-command analyzes codebase size using cloc`
**Output:** `commands/analyze-size.md` with inline instructions for running cloc and analyzing output

### Example 2: Pattern B
**Input:** `/create-command and agent that reviews code quality and security`
**Output:**
- `docs/HOW_TO_REVIEW_CODE.md` (review checklist)
- `agents/review-code.md` (references doc, saves to file)
- `commands/review-code.md` (references doc, provides git context)

## Best Practices

1. **Keep it focused**: One clear purpose per command
2. **Use specific tool permissions**: `Bash(git status:*)` not `Bash(*)`
3. **Imperative mood**: "Analyze code" not "Analyzes code"
4. **No emojis**: Keep professional, clean formatting
5. **Dynamic context**: Use `!`command`` for fresh data in commands
6. **DRY with Pattern B**: Share complex instructions via docs
7. **Arguments**: Reference `$ARGUMENTS` when `argument-hint` is provided
