---
allowed-tools: Read, Write, Edit, Glob
description: Create or extract HOW_TO documentation
argument-hint: <name> <description> | from command <name> | from agent <name>
---

# Create Documentation

You are an expert at creating HOW_TO documentation following best practices.

## Mode Detection

Parse `$ARGUMENTS` to determine creation mode:

- **Extract from command**: If `$ARGUMENTS` starts with "from command"
  - Example: `/create-doc from command analyze-size`
  - Example: `/create-doc from command code-review for plugin meta-work`
- **Extract from agent**: If `$ARGUMENTS` starts with "from agent"
  - Example: `/create-doc from agent security-scanner`
  - Example: `/create-doc from agent validate-specs for plugin feature-development`
- **Create mode**: Otherwise
  - Example: `/create-doc CODE_REVIEW comprehensive code review process`
  - Name must be SCREAMING_SNAKE_CASE

## Context

Current state of the codebase:
- Existing docs: !`ls docs/HOW_TO_*.md 2>/dev/null | xargs -n1 basename | sed 's/HOW_TO_//' | sed 's/.md$//' || echo "none"`
- Project commands: !`ls commands/*.md 2>/dev/null | xargs -n1 basename | sed 's/.md$//' || echo "none"`
- Project agents: !`ls agents/*.md 2>/dev/null | xargs -n1 basename | sed 's/.md$//' || echo "none"`
- Available plugins: !`cat .claude-plugin/marketplace.json 2>/dev/null | grep '"name"' | cut -d'"' -f4 | paste -sd ',' - || echo "none"`

## Your Task

### Step 1: Parse Arguments

Based on mode detected, extract:

**Extract modes:**
1. **Source type**: "command" or "agent"
2. **Source name**: kebab-case name (e.g., "analyze-size", "code-review")
3. **Plugin scope** (optional): If contains "for plugin {name}", extract plugin name
4. **Doc name**: Derive from source name in SCREAMING_SNAKE_CASE (e.g., "analyze-size" → "ANALYZE_SIZE")

**Create mode:**
1. **Doc name**: First argument in SCREAMING_SNAKE_CASE (e.g., "CODE_REVIEW")
2. **Description**: Remaining arguments (e.g., "comprehensive code review process")

### Step 2: Validate Source (Extract Modes Only)

**For "from command" mode:**
- Check project commands: !`test -f commands/{name}.md && echo "exists" || echo "missing"`
- If plugin specified: !`test -f plugins/{plugin}/commands/{name}.md && echo "exists" || echo "missing"`
- If source missing: **STOP** and inform user the command doesn't exist

**For "from agent" mode:**
- Check project agents: !`test -f agents/{name}.md && echo "exists" || echo "missing"`
- If plugin specified: !`test -f plugins/{plugin}/agents/{name}.md && echo "exists" || echo "missing"`
- If source missing: **STOP** and inform user the agent doesn't exist

**Validate doc name:**
- Check for conflicts: !`test -f docs/HOW_TO_{DOC_NAME}.md && echo "exists" || echo "available"`
- If exists: Ask user if they want to overwrite or choose different name

### Step 3: Extract Instructions (Extract Modes Only)

**Read source file:**
- Command path: `commands/{name}.md` or `plugins/{plugin}/commands/{name}.md`
- Agent path: `agents/{name}.md` or `plugins/{plugin}/agents/{name}.md`

**Extract content:**
1. Split file at frontmatter end (after closing `---`)
2. Take everything after frontmatter as instructions
3. Remove any references to `$ARGUMENTS` or dynamic context (lines with `` !`command` ``)
4. Clean up any command-specific or agent-specific directives
5. Extract the core reusable instructions

**Analyze structure:**
- Look for sections like "Role:", "Process:", "Priorities:", "Constraints:", "Output Format:"
- If found: Preserve this structure
- If not found: Transform content into standard HOW_TO structure

### Step 4: Generate HOW_TO Structure

Create `docs/HOW_TO_{DOC_NAME}.md` following the canonical template structure.

See @plugins/meta-work/docs/INSTRUCTION_TEMPLATE.md for the complete template and detailed guidelines.

**Content guidelines for each mode:**

**Extract from command:**
- Focus on the task/workflow the command enables
- Remove command-specific elements (bash patterns, dynamic context)
- Generalize the instructions to be reusable
- Keep the core process and constraints

**Extract from agent:**
- Focus on the analysis/research process
- Remove agent-specific elements (tool lists, model settings)
- Keep the analytical framework and output requirements
- Preserve the role definition and priorities

**Create mode:**
- Generate structure based on description provided
- Infer reasonable Role, Priorities, Process from description
- Create a complete HOW_TO that could guide both commands and agents
- Make it specific enough to be useful, general enough to be reusable

### Step 5: Create File

Use Write tool to create `docs/HOW_TO_{DOC_NAME}.md`.

### Step 6: Offer Refactoring (Extract Modes Only)

After successful extraction, ask the user:

```
Created docs/HOW_TO_{DOC_NAME}.md

Would you like to refactor the source file to reference this doc?

This would:
- Replace inline instructions with: @docs/HOW_TO_{DOC_NAME}.md
- Keep source-specific elements (frontmatter, context, task description)
- Make the source file shorter and easier to maintain

Respond:
- "yes" to refactor now
- "no" to keep source as-is
```

Wait for user response. If "yes", proceed to Step 7.

### Step 7: Refactor Source (If User Approves)

**For commands:**
```markdown
---
[keep existing frontmatter]
---

## Context

[keep any dynamic context lines with !`command`]

## Your Task

[Brief task description, can reference $ARGUMENTS if needed]

See @docs/HOW_TO_{DOC_NAME}.md for detailed guidelines.
```

**For agents:**
```markdown
---
[keep existing frontmatter]
---

@docs/HOW_TO_{DOC_NAME}.md

Output a {name}-report.md file in the project root, then confirm creation.
```

Use Edit tool to replace content after frontmatter.

### Step 8: Confirm

Report what was created:

**Extract modes (without refactoring):**
```
Created docs/HOW_TO_{DOC_NAME}.md

Extracted from: {source type} '{source name}'
Location: docs/HOW_TO_{DOC_NAME}.md

The original {source type} file remains unchanged.
You can now reference this doc with: @docs/HOW_TO_{DOC_NAME}.md
```

**Extract modes (with refactoring):**
```
Created docs/HOW_TO_{DOC_NAME}.md
Refactored {source path}

The {source type} now references the shared documentation.
```

**Create mode:**
```
Created docs/HOW_TO_{DOC_NAME}.md

You can now reference this doc in commands and agents with:
@docs/HOW_TO_{DOC_NAME}.md
```

## Examples

### Example 1: Extract from Command
**Input:** `/create-doc from command analyze-size`
**Process:**
1. Read `commands/analyze-size.md`
2. Extract instructions after frontmatter
3. Transform into HOW_TO structure
4. Create `docs/HOW_TO_ANALYZE_SIZE.md`
5. Offer to refactor command to reference doc

### Example 2: Extract from Agent
**Input:** `/create-doc from agent code-reviewer`
**Process:**
1. Read `agents/code-reviewer.md`
2. Extract instructions after frontmatter
3. Preserve Role, Priorities, Process structure
4. Create `docs/HOW_TO_CODE_REVIEW.md`
5. Offer to refactor agent to reference doc

### Example 3: Extract from Plugin Command
**Input:** `/create-doc from command validate-specs for plugin feature-development`
**Process:**
1. Read `plugins/feature-development/commands/validate-specs.md`
2. Extract and generalize instructions
3. Create `docs/HOW_TO_VALIDATE_SPECS.md` (in project root)
4. Offer to refactor plugin command

### Example 4: Create New Doc
**Input:** `/create-doc SECURITY_AUDIT comprehensive security vulnerability scanning`
**Process:**
1. Generate HOW_TO structure from description
2. Infer Role: "Security auditor scanning for vulnerabilities"
3. Create reasonable Process and Constraints
4. Create `docs/HOW_TO_SECURITY_AUDIT.md`

## Best Practices

1. **SCREAMING_SNAKE_CASE for doc names**: HOW_TO_CODE_REVIEW, not how-to-code-review
2. **Generalize extracted content**: Remove source-specific elements
3. **Preserve structure**: Keep Role/Priorities/Process format when present
4. **Make it reusable**: Doc should work for both commands and agents
5. **Clear sections**: Use consistent heading structure
6. **Actionable steps**: Process should be concrete and specific
7. **Output requirements**: Always specify what the output should contain
8. **Constraints matter**: Be explicit about rules and limitations
9. **Refactoring is optional**: Let user decide if they want to update source
10. **Docs live in project root**: Even when extracted from plugin sources
