---
allowed-tools: Read, Write, Bash(ls:*), Bash(mkdir:*)
description: Create a new Claude Code plugin with proper structure
argument-hint: <what the plugin does>
---

# Create Plugin

You are an expert at creating Claude Code plugins following best practices.

## Context

Current state of the marketplace:
- Existing plugins: !`cat .claude-plugin/marketplace.json | grep '"name"' || echo "none"`
- Plugin root directory: !`pwd`/plugins

## Your Task

### Step 1: Parse Arguments

From `$ARGUMENTS`, derive:
1. **Plugin name** (kebab-case)
   - Remove filler words: "that", "to", "for", "with", etc.
   - Convert to kebab-case
   - Example: "manages deployment workflows" → "deployment-workflows"
2. **Description** (one-sentence description of plugin purpose)
   - Keep concise and clear
   - Example: "Automated deployment and workflow management tools"
3. **Keywords** (3-5 relevant tags for discovery)
   - Derive from the description
   - Example: ["deployment", "workflows", "automation", "ci-cd"]

### Step 2: Check for Conflicts

Read `.claude-plugin/marketplace.json` and verify:
- ✅ Plugin name doesn't already exist
- ✅ Source path `./plugins/{name}` is available

If conflict exists, stop and ask user for alternative name.

### Step 3: Create Plugin Structure

Create the following directory structure:

```
plugins/{name}/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── README.md
```

Use `Bash(mkdir:*)` to create directories:
```bash
mkdir -p plugins/{name}/.claude-plugin
mkdir -p plugins/{name}/commands
```

### Step 4: Generate plugin.json

Create `plugins/{name}/.claude-plugin/plugin.json`:

```json
{
  "name": "{name}",
  "version": "1.0.0",
  "description": "{derived description}",
  "author": {
    "name": "otrebu",
    "email": "dev@uberto.me"
  },
  "license": "MIT",
  "keywords": [
    "{keyword1}",
    "{keyword2}",
    "{keyword3}"
  ]
}
```

### Step 5: Generate README.md

Create `plugins/{name}/README.md`:

```markdown
# {Plugin Name}

{Description from plugin.json}

## Installation

This plugin is part of the otrebu-dev-tools marketplace.

```bash
# Plugin is automatically loaded from marketplace
# Check status
claude --help | grep {name}
```

## Commands

Currently no commands defined. Add command files to `commands/` directory.

## Features

- TODO: Document features as they are added

## Usage

TODO: Add usage examples

## Development

To add commands:
```bash
# Create command files in commands/ directory
touch commands/example.md
```

To add agents:
```bash
# Create agents directory and agent files
mkdir -p agents
touch agents/example.md
```

## License

MIT
```

### Step 6: Update marketplace.json

Read `.claude-plugin/marketplace.json`, parse the JSON, and add new plugin entry to the `plugins` array:

```json
{
  "name": "{name}",
  "source": "./plugins/{name}",
  "description": "{description}",
  "version": "1.0.0"
}
```

**Important:** Preserve existing plugins and maintain JSON formatting.

### Step 7: Validate

Before writing files, verify:
- ✅ Plugin name is kebab-case (no spaces, no underscores)
- ✅ All paths are relative and start with `./`
- ✅ JSON is valid and properly formatted
- ✅ No duplicate names in marketplace
- ✅ Author matches marketplace owner

### Step 8: Create All Files

Use the Write tool to create all files:
1. `plugins/{name}/.claude-plugin/plugin.json`
2. `plugins/{name}/README.md`
3. Update `.claude-plugin/marketplace.json`

### Step 9: Confirm and Guide

Report what was created and provide next steps:

```
Created plugin: {name}

Structure:
  ✓ plugins/{name}/.claude-plugin/plugin.json
  ✓ plugins/{name}/commands/ (empty)
  ✓ plugins/{name}/README.md
  ✓ Updated .claude-plugin/marketplace.json

Next steps:
  1. Add commands: Create .md files in plugins/{name}/commands/
  2. Add agents: Create agents/ directory and .md files
  3. Add hooks: Create hooks/hooks.json
  4. Add MCP servers: Create .mcp.json

Examples:
  - Create command: touch plugins/{name}/commands/example.md
  - Create agent: mkdir -p plugins/{name}/agents && touch plugins/{name}/agents/example.md

The plugin is now registered in the marketplace and ready for development!
```

## Best Practices

1. **Naming**: Use clear, descriptive kebab-case names
2. **Scope**: One plugin per domain/feature set
3. **Documentation**: Update README as features are added
4. **Versioning**: Follow semantic versioning
5. **Keywords**: Choose discoverable, relevant tags
6. **Structure**: Follow standard directory layout
7. **Marketplace**: Keep entries in sync with plugin.json

## Example

**Input:** `/create-plugin manages database migrations and schema changes`

**Output:**
- Plugin name: `database-migrations`
- Description: "Database migration and schema change management tools"
- Keywords: ["database", "migrations", "schema", "sql"]
- Creates full plugin structure
- Adds to marketplace.json
- Provides next steps for adding commands/agents
