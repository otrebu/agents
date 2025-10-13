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

### Commands

#### `/create-doc`

Create or extract HOW_TO documentation from existing commands/agents.

**Usage:**
```bash
# Create new documentation
/create-doc SECURITY_AUDIT comprehensive security vulnerability scanning

# Extract from existing command
/create-doc from command analyze-size

# Extract from plugin agent
/create-doc from agent validate-specs for plugin feature-development
```

**What it does:**
- Creates HOW_TO documentation in `docs/` directory
- Extracts and generalizes instructions from existing commands/agents
- Offers to refactor source files to reference the new doc
- Validates doc name conflicts

**See:** `plugins/meta-work/commands/create-doc.md`

---

#### `/create-agent`

Create agents with optional documentation.

**Usage:**
```bash
# Inline instructions
/create-agent analyzes API response times and generates report

# Reference existing doc
/create-agent for doc CODE_REVIEW

# Create doc + agent together
/create-agent with doc security scan for vulnerabilities

# Plugin-scoped
/create-agent for plugin meta-work validates command references
```

**What it does:**
- Creates agent files in `agents/` or `plugins/{name}/agents/`
- Supports inline instructions or doc references
- Can create documentation alongside agent
- Validates plugin scope and doc existence

**See:** `plugins/meta-work/commands/create-agent.md`

---

#### `/create-command`

Create slash commands with optional documentation.

**Usage:**
```bash
# Inline instructions
/create-command analyzes code size with cloc

# Reference existing doc
/create-command for doc CODE_REVIEW

# Plugin-scoped
/create-command for plugin feature-development analyzes deployment logs
```

**What it does:**
- Creates command files in `commands/` or `plugins/{name}/commands/`
- Supports inline instructions (Pattern A) or doc references (Pattern D)
- Validates plugin scope, doc existence, and name conflicts
- Configures tool permissions and arguments

**Patterns:**
- **Pattern A (Inline)**: Complete instructions in command file
- **Pattern D (Reference Doc)**: Command references shared HOW_TO doc

**See:** `plugins/meta-work/commands/create-command.md`

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

**See:** `plugins/meta-work/commands/create-plugin.md`

---

## Architecture

The meta-work plugin follows a compositional, atomic command design:

### Atomic Commands

Each command does **one thing well**:
- `/create-doc` - Only creates documentation
- `/create-agent` - Only creates agents
- `/create-command` - Only creates commands
- `/create-plugin` - Only creates plugin scaffolding

This is a significant departure from monolithic "create everything" commands. The atomic approach:
- **Simplifies** each command's logic and maintenance
- **Increases flexibility** through composition
- **Follows YAGNI** - create only what you need, when you need it
- **Supports DRY** - share docs when beneficial, inline when simpler

### Documentation as Contracts

HOW_TO docs serve as **shared specifications**:
- Live in `docs/HOW_TO_{NAME}.md` (always project root)
- Define Role, Priorities, Process, Output Format, Constraints
- Can be referenced by both commands (`@docs/...`) and agents (`@docs/...`)
- Act as a contract between different implementations
- Enable consistent behavior across command/agent pairs

### Composition Patterns

Commands can be combined to create different workflows:

**Pattern 1: Doc-First (Specification-Driven)**
1. Create specification: `/create-doc FEATURE_SPEC defines and validates feature requirements`
2. Create implementations: `/create-agent for doc FEATURE_SPEC`, `/create-command for doc FEATURE_SPEC`
3. Result: Shared spec ensures consistency between command and agent

**Pattern 2: Bottom-Up (YAGNI → DRY)**
1. Start simple: `/create-command analyzes deployment logs` (inline)
2. Realize need to share: `/create-doc from command analyze-logs`
3. Create agent: `/create-agent for doc ANALYZE_LOGS`
4. Result: Extract patterns when duplication becomes apparent

**Pattern 3: Inline-First (Simple and Fast)**
1. Create command: `/create-command checks for dead code`
2. Use it, refine it, keep it simple
3. Only extract doc if/when needed for agent or second command
4. Result: Avoid premature abstraction

### Plugin Scoping

Commands and agents can be scoped to plugins:
- Plugin-scoped: `plugins/{name}/commands/`, `plugins/{name}/agents/`
- Docs always project-level: `docs/HOW_TO_{NAME}.md`
- This allows plugin-specific implementations to share project-wide standards

---

## Workflows

Here are recommended workflows for different scenarios:

### Workflow 1: Doc-First (For Standardized Processes)

**When to use:** Creating standardized processes (code review, security audit, compliance check)

**Steps:**
```bash
# 1. Define the standard/specification
/create-doc CODE_REVIEW comprehensive code review process with security checks

# 2. Create agent that follows the spec
/create-agent for doc CODE_REVIEW

# 3. Create command that follows the spec
/create-command for doc CODE_REVIEW

# Result: Consistent process between command and agent
```

**Benefits:**
- Ensures consistency across implementations
- Doc serves as source of truth
- Easy to update process (change doc, all implementations follow)
- Great for team standards and best practices

---

### Workflow 2: Bottom-Up (Extract When Needed)

**When to use:** Starting with a simple need, extracting patterns as duplication emerges

**Steps:**
```bash
# 1. Start with inline command (quick and simple)
/create-command analyzes database schema and generates ER diagram

# Use it for a while...

# 2. Realize you need an agent too - extract the pattern
/create-doc from command analyze-schema

# 3. Create agent using the extracted doc
/create-agent for doc ANALYZE_SCHEMA

# 4. Optionally refactor command to reference doc (prompted by step 2)
```

**Benefits:**
- YAGNI - don't create abstractions before you need them
- Discover the right abstraction through usage
- Lower upfront cost
- Natural evolution from simple to DRY

---

### Workflow 3: Agent + Doc (Research/Analysis)

**When to use:** Creating analysis agents that might later need command interfaces

**Steps:**
```bash
# 1. Create agent with doc in one step
/create-agent with doc security scan for vulnerabilities

# Use it for a while with @security-scan...

# 2. Later, add command interface when needed
/create-command for doc SECURITY_SCAN

# Result: Agent first, command added when needed
```

**Benefits:**
- Start with exploratory agent
- Add command interface when workflow stabilizes
- Doc captures the research/analysis process
- Supports iterative development

---

### Workflow 4: Plugin Development

**When to use:** Building a cohesive plugin with multiple related commands/agents

**Steps:**
```bash
# 1. Create plugin scaffold
/create-plugin manages feature development workflow

# 2. Add plugin commands
/create-command for plugin feature-development analyzes feature specs
/create-command for plugin feature-development generates acceptance tests

# 3. Add shared documentation
/create-doc FEATURE_VALIDATION validates feature specifications and requirements

# 4. Create plugin agent that uses shared doc
/create-agent for plugin feature-development for doc FEATURE_VALIDATION

# Result: Plugin with multiple commands/agents sharing project-level docs
```

**Benefits:**
- Organized by domain/feature set
- Plugin-scoped implementations
- Shared standards via project-level docs
- Clear plugin boundaries and responsibilities

---

### Workflow 5: Extract and Share (Refactoring)

**When to use:** You have multiple commands/agents with similar instructions

**Steps:**
```bash
# Existing: commands/review-pr.md, agents/code-reviewer.md (both with inline instructions)

# 1. Extract from one source
/create-doc from command review-pr

# Refactor review-pr to reference doc (prompted)

# 2. Manually refactor agent to reference same doc
# Edit agents/code-reviewer.md to reference @docs/HOW_TO_REVIEW_PR.md

# Result: DRY - both command and agent share documentation
```

**Benefits:**
- Refactor existing code to DRY
- Consolidate duplicated instructions
- Improve maintainability
- Single source of truth

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
