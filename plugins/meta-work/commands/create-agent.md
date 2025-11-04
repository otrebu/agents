---
allowed-tools: Read, Write, Glob, Bash(ls:*), Bash(test:*), Bash(cat:*), Bash(sed:*), Bash(grep:*), Bash(cut:*), Bash(paste:*)
description: Create agent with optional documentation
argument-hint: [for plugin <name>] [with doc | for doc <name>] <what the agent does>
---

# Create Agent

Create Claude Code agents following @plugins/meta-work/docs/HOW_TO_PROMPT_ENGINEERING.md principles.

## Mode Detection

Parse `$ARGUMENTS` to determine creation mode:

- **Plugin scope**: If contains "for plugin {name}"
  - Example: `/create-agent for plugin feature-development analyzes deployment logs`
  - Extract plugin name and validate it exists
- **With doc**: If contains "with doc"
  - Example: `/create-agent with doc security scan for vulnerabilities`
  - Create HOW_TO doc first, then agent that references it
- **For doc**: If contains "for doc {name}"
  - Example: `/create-agent for doc CODE_REVIEW`
  - Reference existing HOW_TO doc
- **Inline mode**: Otherwise
  - Example: `/create-agent analyzes API response times and generates performance report`
  - Agent with complete inline instructions

**Note:** Modes can combine: `/create-agent for plugin meta-work with doc validates command references`

## Context

Current state of the codebase:
- Project agents: !`ls agents/*.md 2>/dev/null | sed 's|.*/||; s|\.md$||' || echo "none"`
- Existing docs: !`ls docs/HOW_TO_*.md 2>/dev/null | sed 's|.*/||; s|HOW_TO_||; s|\.md$||' || echo "none"`
- Available plugins: !`cat .claude-plugin/marketplace.json 2>/dev/null | grep '"name"' | cut -d'"' -f4 | paste -sd ',' - || echo "none"`

## Your Task

### Step 1: Parse Arguments

From `$ARGUMENTS`, extract:

1. **Plugin scope** (optional): Look for "for plugin {name}"
   - Extract plugin name
   - Remove "for plugin {name}" from remaining arguments
2. **Doc mode**: Look for "with doc" or "for doc {name}"
   - If "with doc": Extract doc description from remaining arguments
   - If "for doc {name}": Extract doc name in SCREAMING_SNAKE_CASE
   - Remove mode indicator from remaining arguments
3. **Agent name** (kebab-case, derived from description)
   - Remove filler words: "that", "to", "for", "with", "which", "the", etc.
   - Convert to kebab-case
   - Example: "analyzes deployment logs" → "analyze-logs"
4. **Description** (one-sentence, what the agent does)
   - Keep concise and clear
   - Example: "Analyze deployment logs for errors and performance issues"
5. **Tools needed** (standard set for agents)
   - Default: `Read, Grep, Glob, Bash`
   - Add more specific tools if needed based on description

### Step 2: Validate

**If plugin-scoped:**
- Check marketplace: !`cat .claude-plugin/marketplace.json | grep '"name": "{plugin-name}"' && echo "exists" || echo "missing"`
- Check directory: !`test -d plugins/{plugin-name} && echo "exists" || echo "missing"`
- If missing: STOP, tell user to run `/create-plugin` first

**If "for doc" mode:**
- Check doc: !`test -f docs/HOW_TO_{DOC_NAME}.md && echo "exists" || echo "missing"`
- If missing: STOP, suggest "with doc" mode or `/create-doc`

**Check name conflicts:**
- Project: !`test -f agents/{name}.md && echo "conflict" || echo "available"`
- Plugin: !`test -f plugins/{plugin}/agents/{name}.md && echo "conflict" || echo "available"`
- If conflict: Ask for alternative name

### Step 3: Create Documentation (With Doc Mode Only)

If mode is "with doc", create the HOW_TO doc first:

**Derive doc name from agent name:**
- Convert agent name to SCREAMING_SNAKE_CASE
- Example: "security-scanner" → "SECURITY_SCAN"

**Generate HOW_TO structure:**

Create `docs/HOW_TO_{DOC_NAME}.md` following @plugins/meta-work/docs/HOW_TO_PROMPT_ENGINEERING.md.

Use Write tool to create the doc file.

### Step 4: Generate Agent Structure

**Determine output location:**
- Project scope: `agents/{name}.md`
- Plugin scope: `plugins/{plugin}/agents/{name}.md`

**Generate agent file:**

**For "for doc" or "with doc" modes:**
```markdown
---
name: {name}
description: {One-sentence description}
tools: Read, Grep, Glob, Bash
model: inherit
---

@docs/HOW_TO_{DOC_NAME}.md

Output a {name}-report.md file in the project root, then confirm creation.
```

**For inline mode:**
```markdown
---
name: {name}
description: {One-sentence description}
tools: Read, Grep, Glob, Bash
model: inherit
---

{Follow agent template from @plugins/meta-work/docs/HOW_TO_PROMPT_ENGINEERING.md}

{Include sections: Role, Capabilities/Workflow, Output Format, Constraints}
```

Follow @plugins/meta-work/docs/HOW_TO_PROMPT_ENGINEERING.md for structure and style.

### Step 5: Validate Structure

Before writing, verify:
- ✅ Frontmatter is valid YAML
- ✅ Name is kebab-case (no spaces, no underscores)
- ✅ Description is concise, one sentence
- ✅ Tools are appropriate for the task
- ✅ Doc reference is correct (for doc modes)
- ✅ Output path is correct (project or plugin)
- ✅ No name conflicts

### Step 6: Create File(s)

Use Write tool to create:
1. Doc file (if "with doc" mode): `docs/HOW_TO_{DOC_NAME}.md`
2. Agent file: `agents/{name}.md` or `plugins/{plugin}/agents/{name}.md`

### Step 7: Confirm

Report what was created:

**Inline mode:**
```
Created agent: {name}
Location: {path to agent file}

This agent has inline instructions and can be invoked with:
@{name}
```

**For doc mode:**
```
Created agent: {name}
Location: {path to agent file}
References: docs/HOW_TO_{DOC_NAME}.md

This agent references existing documentation and can be invoked with:
@{name}
```

**With doc mode:**
```
Created agent with documentation:
  ✓ docs/HOW_TO_{DOC_NAME}.md (shared instructions)
  ✓ {path to agent file} (references doc)

This agent can be invoked with:
@{name}

The documentation can also be used by commands with:
@docs/HOW_TO_{DOC_NAME}.md
```

**Plugin-scoped:**
```
Created plugin agent: {name}
Plugin: {plugin-name}
Location: plugins/{plugin}/agents/{name}.md
[Additional info based on mode]
```

## Examples

### Example 1: Inline Mode
**Input:** `/create-agent analyzes API response times and generates performance report`
**Output:**
- Agent name: `analyze-response-times`
- File: `agents/analyze-response-times.md`
- Complete inline instructions for API analysis
- Invocation: `@analyze-response-times`

### Example 2: For Doc Mode
**Input:** `/create-agent for doc CODE_REVIEW`
**Prerequisites:** `docs/HOW_TO_CODE_REVIEW.md` must exist
**Output:**
- Agent name: `code-review`
- File: `agents/code-review.md`
- References existing HOW_TO doc
- Invocation: `@code-review`

### Example 3: With Doc Mode
**Input:** `/create-agent with doc security scan for vulnerabilities`
**Output:**
- Doc: `docs/HOW_TO_SECURITY_SCAN.md` (new)
- Agent name: `security-scan`
- File: `agents/security-scan.md` (references doc)
- Invocation: `@security-scan`

### Example 4: Plugin Inline Mode
**Input:** `/create-agent for plugin feature-development analyzes deployment logs`
**Output:**
- Agent name: `analyze-logs`
- File: `plugins/feature-development/agents/analyze-logs.md`
- Inline instructions
- Plugin namespace

### Example 5: Plugin With Doc Mode
**Input:** `/create-agent for plugin meta-work with doc validates command references`
**Output:**
- Doc: `docs/HOW_TO_VALIDATE_REFERENCES.md` (new, in project root)
- Agent: `plugins/meta-work/agents/validate-references.md` (references doc)
- Can be used by both plugin and project commands

### Example 6: Combined Modes
**Input:** `/create-agent for plugin codebase-explorer for doc DEPENDENCY_ANALYSIS`
**Prerequisites:** Plugin exists, doc exists
**Output:**
- Agent: `plugins/codebase-explorer/agents/dependency-analysis.md`
- References existing doc in project root

## Best Practices

1. **Kebab-case names**: use-kebab-case, not snake_case or PascalCase
2. **Concise descriptions**: One sentence, imperative mood
3. **Standard tools**: Most agents use `Read, Grep, Glob, Bash`
4. **Output to file**: Agents should save reports to `{name}-report.md` in project root
5. **Doc references**: Use `@docs/HOW_TO_{NAME}.md` syntax
6. **Plugin isolation**: Plugin agents live in plugin directory
7. **Shared docs**: HOW_TO docs always in project root, never in plugins
8. **Validate first**: Check for conflicts and prerequisites before creating
9. **Clear role**: Define what the agent analyzes or researches
10. **Structured output**: Specify exact format for reports

## Tool Configuration

Explicitly specify tools for clarity and security.

### Default Tool Set

```
tools: Read, Grep, Glob, Bash
```

### Common Tools

- **Read**: Read files
- **Write**: Create files (add if agent generates reports/configs)
- **Edit**: Modify existing files
- **Grep**: Search content with regex
- **Glob**: Find files by pattern
- **Bash**: Run shell commands
- **WebSearch**: Search web for current info
- **WebFetch**: Fetch specific URLs
- **Task**: Delegate to sub-agents

### Start Minimal, Add as Needed

1. Default: `Read, Grep, Glob, Bash`
2. Add `Write` if creating files
3. Add `Edit` if modifying files
4. Add `WebSearch`/`WebFetch` only if external data needed
5. Add `Task` only for orchestrator agents

## Report File Convention

All agents should output a report file named `{agent-name}-report.md` in the project root, regardless of whether the agent is project-scoped or plugin-scoped. This ensures:
- Consistent location for all reports
- Easy to find and review
- No conflicts between plugin and project outputs
- Simple cleanup (delete all `*-report.md` files)
