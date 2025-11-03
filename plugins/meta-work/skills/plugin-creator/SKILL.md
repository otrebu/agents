---
name: plugin-creator
description: Create Claude Code plugins with proper structure. Use when user requests "create a plugin" or needs to scaffold a new plugin with metadata, directories, and marketplace registration.
---

# Plugin Creator

Automated plugin scaffolding for Claude Code following official structure and best practices.

## When to Use

- User says "create a plugin"
- User wants to scaffold new plugin structure
- User needs to add plugin to marketplace

## Quick Start

Run the script with plugin description:

```bash
tsx scripts/create-plugin.ts "manages deployment workflows"
```

The script will:
1. Parse description → kebab-case name
2. Extract keywords from description
3. Check for name conflicts in marketplace
4. Create plugin directory structure
5. Generate plugin.json and README.md
6. Update marketplace.json

## Workflow

### Step 1: Parse User Input

From user request, extract plugin description. Examples:
- "create a plugin that manages deployment workflows" → "manages deployment workflows"
- "create plugin for database migrations" → "database migrations"

### Step 2: Run Script

```bash
tsx ./plugins/meta-work/skills/plugin-creator/scripts/create-plugin.ts "<description>"
```

Script handles:
- **Name generation**: Converts to kebab-case, removes filler words
- **Keywords**: Extracts 3-5 relevant terms
- **Conflict checking**: Verifies name availability in marketplace
- **Directory creation**: `plugins/<name>/{.claude-plugin,commands}/`
- **File generation**: plugin.json, README.md
- **Marketplace update**: Adds entry to `.claude-plugin/marketplace.json`

### Step 3: Verify Output

Script prints:
```
✅ Plugin created successfully!

Structure:
  ✓ plugins/<name>/.claude-plugin/plugin.json
  ✓ plugins/<name>/commands/ (empty)
  ✓ plugins/<name>/README.md
  ✓ Updated .claude-plugin/marketplace.json
```

### Step 4: Guide Next Steps

After creation, inform user:
- Plugin scaffolded but empty
- Add commands: `.md` files in `commands/`
- Add agents: create `agents/` directory
- Add hooks: create `hooks/hooks.json`
- Add skills: create `skills/<skill-name>/SKILL.md`
- Update README.md as features added

## Script Details

**Location**: `./scripts/create-plugin.ts`

**No external dependencies** - uses only Node.js built-ins

**Execution**: Requires `tsx` (available via pnpm in this repo)

**Name conversion rules**:
- Removes filler words: "that", "to", "for", "with", "a", "an", "the", etc.
- Converts to lowercase
- Replaces spaces with hyphens
- Removes non-alphanumeric chars (except hyphens)

**Example conversions**:
- "manages deployment workflows" → "manages-deployment-workflows"
- "tool for database migrations" → "database-migrations"
- "API testing utilities" → "api-testing-utilities"

## Error Handling

**Conflict detected**:
```
❌ Plugin "plugin-name" already exists in marketplace
```
Ask user for alternative name, run script again.

**Marketplace not found**:
```
⚠️  Marketplace file not found, will create new entry
```
Script creates new marketplace.json automatically.

## Plugin Structure Created

```
plugins/<name>/
├── .claude-plugin/
│   └── plugin.json          # Metadata, version, keywords
├── commands/                 # Empty, ready for slash commands
└── README.md                 # Template with status and dev instructions
```

## Best Practices

1. **Descriptive names**: Clear, specific descriptions → better names/keywords
2. **Scope**: One plugin per domain/feature set
3. **Immediate docs**: Update README as features added
4. **Versioning**: Follow semantic versioning
5. **Keywords**: Choose discoverable, relevant tags

## Example

**Input**: "create plugin for database schema migrations"

**Execution**:
```bash
tsx scripts/create-plugin.ts "database schema migrations"
```

**Output**:
- Plugin name: `database-schema-migrations`
- Keywords: `["database", "schema", "migrations"]`
- Structure created
- Marketplace updated
- Ready for development
