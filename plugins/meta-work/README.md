# Meta-Work Plugin

**Version:** 1.0.0
**Author:** otrebu
**License:** MIT

Tools for managing and creating Claude Code configurations, commands, agents, and plugins. This plugin provides "meta work" capabilities - work about work - helping you build and maintain your custom Claude Code environment.

## What is Meta Work?

Meta work includes activities that manage and maintain your Claude Code configuration itself:
- Creating new commands, agents, and plugins
- Analyzing your existing configuration structure
- Validating command references and configuration integrity
- Scaffolding new projects with proper `.claude` setup
- Maintaining documentation in sync with implementation

## Current Features

### `/create-command <description>`

Create a complete command suite (documentation + agent + command) following DRY principles.

**Usage:**
```bash
/create-command analyze database schema and generate ER diagram
```

**What it does:**
- Interactively gathers requirements (name, tools, complexity)
- Decides between Pattern A (standalone) or Pattern B (shared doc)
- Generates appropriate files in `commands/`, `agents/`, and `docs/`
- Validates structure and references
- Ensures no conflicts with existing commands

**Patterns:**
- **Pattern A (Standalone)**: Single command or agent with inline instructions (for simple cases)
- **Pattern B (Shared Doc)**: Both agent and command with shared documentation (for complex shared logic)

**See also:**
- Command: `commands/create-command.md`
- Agent: `agents/create-command.md`
- Documentation: `docs/HOW_TO_CREATE_COMMAND.md`

---

### `/create-plugin <description>`

Scaffold a complete plugin structure with manifest, folders, and README.

**Usage:**
```bash
/create-plugin manages database migrations and schema changes
```

**What it does:**
- Derives kebab-case plugin name from description
- Creates plugin directory structure (`.claude-plugin/`, `commands/`, README)
- Generates `plugin.json` manifest with proper metadata
- Automatically updates `.claude-plugin/marketplace.json`
- Validates for naming conflicts
- Provides next steps for adding commands, agents, hooks, or MCP servers

**Created structure:**
```
plugins/{name}/
├── .claude-plugin/
│   └── plugin.json
├── commands/
└── README.md
```

**Use case:** "I want to create a new plugin for database migrations"

**See also:**
- Command: `commands/create-plugin.md`

---

## Future Planned Features

The following features are planned for future releases. They represent the full vision of meta-work capabilities but are not yet implemented.

---

### `/analyze-config` [Planned]

**Purpose:** Analyze the current Claude Code configuration and report structure.

**Planned functionality:**
- Scan `.claude/` folder structure
- List all commands, agents, docs
- Check for enabled plugins
- Report settings.json configuration
- Show dynamic context usage (`!`command`` syntax)
- Identify tool permissions and bash patterns
- Display statistics (total commands, agents, docs)

**Output:** Terminal report with comprehensive overview of your Claude Code setup

**Use case:** "What commands and plugins do I currently have installed?"

---

### `/audit-commands` [Planned]

**Purpose:** Validate command/agent integrity and find configuration issues.

**Planned functionality:**
- Check all `@docs/` references resolve correctly
- Validate frontmatter syntax (YAML)
- Ensure allowed-tools match actual usage
- Find orphaned docs (no command/agent references them)
- Detect duplicate command names across core + plugins
- Check for missing argument-hint where `$ARGUMENTS` is used
- Verify agent tools match command allowed-tools for Pattern B
- Report broken symlinks or missing files

**Output:** Detailed report with warnings, errors, and suggestions (saves to `AUDIT_REPORT.md`)

**Use case:** "Are all my command references valid? Any configuration issues?"

---

### `/update-readme` [Planned]

**Purpose:** Auto-update main README from actual configuration.

**Planned functionality:**
- Scan all commands and agents
- Generate "What's Included" section automatically
- Update command list with descriptions from frontmatter
- Update agent list with descriptions
- Maintain user-written sections (don't overwrite custom content)
- Update plugin list from marketplace.json

**Use case:** "Keep my README in sync with actual commands without manual updates"

---

### `/bootstrap-project <path>` [Planned]

**Purpose:** Set up a new project with `.claude` folder and configuration.

**Planned functionality:**
- Create `.claude/` directory structure
- Offer templates: "minimal", "full", "custom"
- Create symlinks to shared agent repository (if available)
- Generate project-specific `settings.json`
- Create `.gitignore` for Claude-specific files
- Initialize with starter commands (commit, code-review, etc.)

**Use case:** "Set up Claude Code for my new TypeScript project"

---

### `/sync-docs` [Planned]

**Purpose:** Ensure documentation matches implementation.

**Planned functionality:**
- Compare command/agent descriptions in frontmatter vs docs
- Check if HOW_TO guides exist for all Pattern B commands
- Verify examples in docs still work
- Flag outdated documentation (based on git history)
- Suggest doc updates when implementation changes

**Use case:** "Make sure my documentation accurately reflects current implementation"

---

### `/migrate-command <name> <source> <target>` [Planned]

**Purpose:** Move commands between core and plugins (or between plugins).

**Planned functionality:**
- Validate source command exists
- Check target location is valid
- Move command, agent, and associated docs
- Update all references (`@docs/` paths)
- Update marketplace.json if moving to/from plugin
- Validate after migration

**Use case:** "Move my custom command into a plugin for better organization"

---

### `/test-command <name>` [Planned]

**Purpose:** Dry-run a command and validate behavior without executing.

**Planned functionality:**
- Parse command file and frontmatter
- Validate YAML syntax
- Check all tool permissions are valid
- Expand dynamic context (`!`command`` without execution)
- Show what would be included in the prompt
- Validate `$ARGUMENTS` substitution
- Check if referenced docs exist and are parseable

**Use case:** "Test my new command before actually running it"

---

## Plugin Structure

```
plugins/meta-work/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── commands/
│   └── create-command.md        # Command definitions
├── agents/
│   └── create-command.md        # Agent definitions
├── docs/
│   └── HOW_TO_CREATE_COMMAND.md # Detailed guides
├── hooks/                        # Reserved for future use
└── README.md                     # This file
```

## Installation

### Via Marketplace (if configured)

```bash
/plugin marketplace add /path/to/agents/.claude-plugin/marketplace.json
/plugin install meta-work@uberto-claude-plugins
```

### Manual Installation

Copy or symlink the plugin directory to your `.claude/plugins/` folder:

```bash
# From within your .claude directory
ln -s /path/to/agents/plugins/meta-work plugins/meta-work
```

## Usage

Once installed, meta-work commands are available in your Claude Code session:

```bash
# Create a new command
/create-command analyze API endpoints and generate OpenAPI spec

# Future commands (when implemented)
/create-plugin my-custom-tools
/analyze-config
/audit-commands
```

## Why a Plugin?

Meta-work functionality is provided as a plugin rather than core commands to:
- **Modularity**: Users who don't need meta-commands can skip the plugin
- **Self-contained**: All meta-work tools in one cohesive package
- **Dogfooding**: Demonstrates plugin best practices
- **Extensibility**: Easier to add new meta tools without cluttering core
- **User choice**: Optional installation based on needs

## Contributing Ideas

Have ideas for additional meta-work features? Consider:
- Configuration diffing and merging
- Command template library
- Interactive command builder (guided wizard)
- Export/import command packs
- Version control integration for .claude folders
- Command usage analytics and recommendations

## Version History

- **1.0.0** (2025-10-13): Initial release with `create-command` migration

## See Also

- [Claude Code Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- Main agents repository: `/agents`
- Codebase Explorer Plugin: `/plugins/codebase-explorer`
