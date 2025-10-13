---
allowed-tools: Read, Write, Glob, Grep, Bash(ls:*), Bash(test:*)
description: Create slash command with optional documentation
argument-hint: [for plugin <name>] [for doc <name>] <what the command should do>
---

# Create Command

You are an expert at creating Claude Code slash commands following best practices.

## Mode Detection

Parse `$ARGUMENTS` to determine creation mode:

- **Pattern C** (plugin command): If `$ARGUMENTS` contains "for plugin" followed by plugin name
  - Example: `/create-command analyzes deployment logs for plugin feature-development`
  - Extract plugin name and validate it exists
  - Can be combined with Pattern D: `/create-command for plugin meta-work for doc VALIDATE_REFERENCES`
- **Pattern D** (reference doc): If `$ARGUMENTS` contains "for doc {name}"
  - Example: `/create-command for doc CODE_REVIEW`
  - Reference existing HOW_TO doc
- **Pattern A** (inline command): Otherwise
  - Example: `/create-command analyzes code size with cloc`

## Context

Current state of the codebase:
- Project commands: !`ls commands/*.md 2>/dev/null | xargs -n1 basename | sed 's/.md$//' || echo "none"`
- Existing docs: !`ls docs/HOW_TO_*.md 2>/dev/null | xargs -n1 basename | sed 's/HOW_TO_//' | sed 's/.md$//' || echo "none"`
- Available plugins: !`cat .claude-plugin/marketplace.json 2>/dev/null | grep '"name"' | cut -d'"' -f4 | paste -sd ',' - || echo "none"`

## Your Task

### Step 1: Parse Arguments

From `$ARGUMENTS`, extract:

1. **Plugin scope** (optional): Look for "for plugin {name}"
   - Extract plugin name
   - Remove "for plugin {name}" from remaining arguments
2. **Doc mode** (optional): Look for "for doc {name}"
   - Extract doc name in SCREAMING_SNAKE_CASE
   - Remove "for doc {name}" from remaining arguments
3. **Command name** (kebab-case, derived from description)
   - Remove filler words: "that", "to", "for", "with", "which", etc.
   - Convert to kebab-case
   - Example: "analyzes code size" → "analyze-size"
4. **Description** (one-sentence, what the command does)
   - Keep concise, imperative mood
   - Example: "Analyze codebase size using cloc"
5. **Tools needed**
   - Specific bash patterns: `Bash(git status:*)`, `Bash(cloc:*)`
   - Other tools: `Read, Write, Grep, Glob` as needed
6. **Arguments** (if command should accept parameters)
   - Example: file pattern, optional flags

### Step 2: Validate

**Check plugin exists (if plugin-scoped):**
- Validate in marketplace: !`cat .claude-plugin/marketplace.json | grep '"name": "{plugin-name}"' && echo "exists" || echo "missing"`
- Check directory: !`test -d plugins/{plugin-name} && echo "exists" || echo "missing"`
- If missing: **STOP** and inform user to run `/create-plugin` first

**Check doc exists (if "for doc" mode):**
- Validate doc file: !`test -f docs/HOW_TO_{DOC_NAME}.md && echo "exists" || echo "missing"`
- If missing: **STOP** and suggest creating doc first with `/create-doc`

**Check for name conflicts:**
- Project scope: !`test -f commands/{name}.md && echo "conflict" || echo "available"`
- Plugin scope: !`test -f plugins/{plugin}/commands/{name}.md && echo "conflict" || echo "available"`
- If conflict: Ask user for alternative name

### Step 3: Generate Command Structure

**Determine output location:**
- Project scope: `commands/{name}.md`
- Plugin scope: `plugins/{plugin}/commands/{name}.md`

#### Pattern A: Inline Command

Create command with complete inline instructions:

```markdown
---
allowed-tools: [specific bash patterns]
description: [One-sentence description]
argument-hint: [optional, e.g., "[file-pattern]" or "<required-arg>"]
---

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

#### Pattern D: Reference Documentation

Create command that references existing HOW_TO doc:

```markdown
---
allowed-tools: [specific bash patterns]
description: [One-sentence description]
argument-hint: [optional]
---

## Context

- Relevant data: !`[bash command for dynamic context]`

## Your Task

[Brief task description. Use $ARGUMENTS if argument-hint is provided]

See @docs/HOW_TO_{DOC_NAME}.md for detailed guidelines.
```

### Step 4: Validate Structure

Before creating files, verify:
- ✅ Frontmatter is valid YAML
- ✅ Description is imperative mood, concise
- ✅ No name conflicts (in project or plugin namespace)
- ✅ Bash tools are specific patterns (e.g., `Bash(git status:*)`, not `Bash(*)`)
- ✅ Doc reference is correct (Pattern D only)
- ✅ Dynamic context uses valid commands
- ✅ Output path is correct (project or plugin)

### Step 5: Create File

Use Write tool to create the command file.

### Step 6: Confirm

Report what was created:

**Pattern A (project):**
```
Created command: {name}
Location: commands/{name}.md

This command has inline instructions and can be invoked with:
/{name}
```

**Pattern A (plugin):**
```
Created plugin command: {name}
Plugin: {plugin-name}
Location: plugins/{plugin}/commands/{name}.md

This command can be invoked with:
/{name}
```

**Pattern D (project):**
```
Created command: {name}
Location: commands/{name}.md
References: docs/HOW_TO_{DOC_NAME}.md

This command references existing documentation and can be invoked with:
/{name}
```

**Pattern D (plugin):**
```
Created plugin command: {name}
Plugin: {plugin-name}
Location: plugins/{plugin}/commands/{name}.md
References: docs/HOW_TO_{DOC_NAME}.md

This command can be invoked with:
/{name}
```

## Examples

### Example 1: Pattern A (Inline)
**Input:** `/create-command analyzes codebase size using cloc`
**Output:**
- Command name: `analyze-size`
- File: `commands/analyze-size.md`
- Complete inline instructions for running cloc
- Invocation: `/analyze-size`

### Example 2: Pattern D (Reference Doc)
**Input:** `/create-command for doc CODE_REVIEW`
**Prerequisites:** `docs/HOW_TO_CODE_REVIEW.md` must exist
**Output:**
- Command name: `code-review`
- File: `commands/code-review.md`
- References existing HOW_TO doc
- Invocation: `/code-review`

### Example 3: Pattern A + Plugin
**Input:** `/create-command analyzes deployment logs for plugin feature-development`
**Output:**
- Command name: `analyze-logs`
- File: `plugins/feature-development/commands/analyze-logs.md`
- Inline instructions for log analysis
- Plugin namespace

### Example 4: Pattern D + Plugin
**Input:** `/create-command for plugin meta-work for doc VALIDATE_REFERENCES`
**Prerequisites:** Plugin exists, doc exists
**Output:**
- Command name: `validate-references`
- File: `plugins/meta-work/commands/validate-references.md`
- References doc in project root
- Plugin namespace

### Example 5: With Arguments
**Input:** `/create-command fixes eslint errors in specified files`
**Output:**
- Command name: `fix-eslint`
- File: `commands/fix-eslint.md`
- Frontmatter includes: `argument-hint: "[file-pattern]"`
- Instructions reference `$ARGUMENTS`
- Invocation: `/fix-eslint src/**/*.ts`

## Best Practices

1. **Keep it focused**: One clear purpose per command
2. **Use specific tool permissions**: `Bash(git status:*)` not `Bash(*)`
3. **Imperative mood**: "Analyze code" not "Analyzes code"
4. **No emojis**: Keep professional, clean formatting
5. **Dynamic context**: Use `` !`command` `` for fresh data
6. **Arguments**: Reference `$ARGUMENTS` when `argument-hint` is provided
7. **DRY with Pattern D**: Reference shared HOW_TO docs for complex workflows
8. **Plugin scoping**: Use "for plugin {name}" for plugin-scoped commands
9. **Validate first**: Check for conflicts and prerequisites before creating
10. **Clear description**: One sentence explaining what the command does

## When to Use Each Pattern

**Pattern A (Inline):**
- Simple, self-contained commands
- Command-specific logic that won't be reused
- Quick utility commands
- Example: `/analyze-size`, `/start-feature`

**Pattern D (Reference Doc):**
- Complex workflows shared between command and agent
- Standardized processes (code review, security audit)
- When multiple commands might use the same guidelines
- Example: `/code-review`, `/fix-eslint`

**For composition, use separate commands:**
- Need command + agent? Create command with `/create-command`, then agent with `/create-agent`
- Need shared doc? Create doc first with `/create-doc`, then reference it
- This keeps each command atomic and focused
