# My Claude Memory

A centralized configuration repository for Claude Code featuring:
- 🎯 **Specialized skills** for code review, ESLint fixing, git workflows, brainstorming, and more
- 🔌 **Plugin marketplace** with modular extensions (codebase explorer, meta-work, feature development)
- 🔧 **Meta-work tools** to create new commands, agents, docs, and plugins following DRY principles
- 📚 **Personal coding standards** (FP-first style, development workflow, tech stack preferences)
- 🔗 **Symlink-based setup** for easy sharing across projects

All configuration can be linked to your global Claude config (`~/.claude`) or individual project `.claude` folders.

## Repository Structure

```
.
├── .claude/                      # Example .claude folder
│   ├── agents/                  -> ../agents
│   ├── commands/                -> ../commands
│   ├── skills/                   # Specialized skill modules
│   │   ├── analyze-size/
│   │   ├── brainwriting/
│   │   ├── code-review/
│   │   ├── finish-feature/
│   │   ├── fix-eslint/
│   │   ├── git-commit/
│   │   ├── permissions/
│   │   ├── scratchpad-fetch/
│   │   ├── skill-creator/
│   │   └── start-feature/
│   └── settings.json            -> ../settings.json
├── .claude-plugin/               # Plugin marketplace definition
│   └── marketplace.json         # Marketplace configuration
├── plugins/                      # Plugin directory
│   ├── codebase-explorer/       # Codebase exploration plugin
│   │   ├── .claude-plugin/      # Plugin manifest
│   │   ├── commands/            # Plugin commands
│   │   ├── agents/              # Plugin agents
│   │   └── README.md            # Plugin documentation
│   ├── meta-work/               # Meta-work plugin (command creation, etc.)
│   │   ├── .claude-plugin/      # Plugin manifest
│   │   ├── commands/            # Plugin commands
│   │   ├── docs/                # Plugin documentation
│   │   └── README.md            # Plugin documentation
│   └── feature-development/      # Feature development plugin
│       ├── .claude-plugin/      # Plugin manifest
│       ├── commands/            # Plugin commands
│       ├── agents/              # Plugin agents
│       └── README.md            # Plugin documentation
├── skills/                       # Core reusable skill modules
│   ├── analyze-size/
│   ├── brainwriting/
│   ├── code-review/
│   ├── finish-feature/
│   ├── fix-eslint/
│   ├── git-commit/
│   ├── permissions/
│   ├── scratchpad-fetch/
│   ├── skill-creator/
│   └── start-feature/
├── docs/                         # Project documentation and coding standards
│   ├── CODING_STYLE.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── HOW_TO_DEEP_CONTEXT_GATHER.md
│   ├── HOW_TO_DO_HIGH_LEVEL_PLANNING.md
│   ├── HOW_TO_WRITE_EFFECTIVE_PROMPTS.md
│   ├── TOOLING_PATTERNS.md
│   └── typescript/
│       ├── STACK.md
│       ├── TOOLING.md
│       ├── TESTING.md
│       └── LOGGING.md
├── CLAUDE.md                     # Global Claude instructions
├── settings.json                 # Claude Code settings
├── setup.sh                      # Automated setup script
└── README.md
```

## Setup: Linking to Your Projects

You can link this configuration to either your global Claude config (`~/.claude`) or individual project `.claude` folders.

### Quick Setup (Automated)

Use the provided setup script:

```bash
# For global configuration
./setup.sh --global

# For a specific project
./setup.sh --project ~/path/to/your-project

# Preview what would be done (dry run)
./setup.sh --global --dry-run
./setup.sh --project ~/path/to/your-project --dry-run

# Show help
./setup.sh --help
```

The script will:
- ✓ Create `.claude` directory if needed
- ✓ Create symlinks to agents, commands, skills, settings
- ✓ Use relative paths for project configs (portable)
- ✓ Skip existing files/symlinks (safe to re-run)
- ✓ Preview changes with `--dry-run` before applying

### Manual Setup

If you prefer to create symlinks manually:

**✅ Recommended approach:**
1. **Navigate to** the `.claude` folder where you want to create the links
2. **Run `ln -s`** from that location
3. **Use relative paths** when possible (especially for project configs)

**Why this works:**
- Running from the target `.claude` folder makes the command consistent
- Relative paths are portable across different systems/users
- Easier to understand and maintain

#### Global Configuration (Manual)

Link to your global Claude config (`~/.claude`):

```bash
# Navigate to your global .claude folder
cd ~/.claude

# Create symlinks using relative paths
ln -s ~/dev/agents/agents agents
ln -s ~/dev/agents/commands commands
ln -s ~/dev/agents/skills skills
ln -s ~/dev/agents/settings.json settings.json

# Optional: Link documentation
ln -s ~/dev/agents/docs docs
ln -s ~/dev/agents/CLAUDE.md CLAUDE.md
```

#### Project-Specific Configuration (Manual)

Link to a specific project's `.claude` folder:

```bash
# Navigate to your project's .claude folder
cd ~/path/to/your-project/.claude

# Create symlinks using relative paths to this repository
# (adjust the path based on where agents is relative to your project)
ln -s ../../agents/agents agents
ln -s ../../agents/commands commands
ln -s ../../agents/skills skills
ln -s ../../agents/settings.json settings.json
```

### Verifying Symlinks

Check that symlinks are created correctly:

```bash
ls -la ~/.claude          # for global config
# or
ls -la .claude            # for project config
```

You should see output like:
```
lrwxr-xr-x  agents -> ../agents
lrwxr-xr-x  commands -> ../commands
lrwxr-xr-x  skills -> ../skills
lrwxr-xr-x  settings.json -> ../settings.json
```

## What's Included

### Core Skills (`.claude/skills`)
Modular packages providing specialized workflows and domain expertise:
- **analyze-size** - Analyze codebase size and language distribution using cloc
- **brainwriting** - Structured brainstorming using parallel sub-agents to explore idea spaces (5 rounds of parallel agent analysis and refinement)
- **code-review** - Expert code review with automated pre-review checks (tests, lint, format) and auto-fix capabilities
- **finish-feature** - Complete feature work and merge back to main branch
- **fix-eslint** - Automatically fix ESLint errors. Smart routing: direct fix for ≤20 errors, parallel agents for >20 errors
- **git-commit** - Create conventional commits with proper formatting based on git diff analysis
- **permissions** - Configure and manage Claude Code permissions, sandboxing, and tool access
- **scratchpad-fetch** - Download and aggregate web pages/docs into timestamped scratchpad files
- **skill-creator** - Guide for creating effective skills with specialized knowledge, workflows, or tool integrations
- **start-feature** - Create or switch to feature branches with proper naming conventions

### Plugins (`/plugins`)

See [Available Plugins](#available-plugins) section below for detailed information about each plugin.

### Documentation (`/docs`)
- **CODING_STYLE.md** - Universal coding principles (FP patterns, naming, testing, logging)
- **DEVELOPMENT_WORKFLOW.md** - Testing, commits, branching, documentation guidelines
- **HOW_TO_DEEP_CONTEXT_GATHER.md** - Guide for comprehensive context gathering workflows
- **HOW_TO_DO_HIGH_LEVEL_PLANNING.md** - Guide for high-level solution planning and architecture
- **HOW_TO_WRITE_EFFECTIVE_PROMPTS.md** - Best practices for writing effective prompts
- **TOOLING_PATTERNS.md** - Tool usage patterns and configurations
- **typescript/STACK.md** - TypeScript/JavaScript tech stack overview
- **typescript/TOOLING.md** - Tool usage patterns and configurations
- **typescript/TESTING.md** - Testing patterns with Vitest
- **typescript/LOGGING.md** - Logging strategies (CLI vs services)

### Settings (`/settings.json`)
Claude Code configuration including:
- Allowed commands and tool permissions
- Safety and security settings
- Custom configurations

### Global Instructions (`/CLAUDE.md`)
Project context instructions that reference the documentation files.

## Key Features

### Plugin Marketplace
This repository now includes a plugin marketplace system that allows you to organize and distribute Claude Code extensions as modular plugins. Each plugin is self-contained with its own commands, agents, and documentation.

**Marketplace location**: `.claude-plugin/marketplace.json`

### Command Creation System
The `/create-command` command (from the **meta-work plugin**) helps you build new custom commands following DRY principles. It supports two patterns:
- **Pattern A**: Standalone commands with inline documentation (for simple cases)
- **Pattern B**: Shared documentation with agent + command (for complex shared logic)

See the meta-work plugin documentation at `plugins/meta-work/README.md` for details.

### Feature Branch Workflow
The `/start-feature` command creates feature branches following your project's naming conventions and development workflow guidelines.

## Plugin System

### Overview
This repository now includes a plugin marketplace that allows you to organize Claude Code extensions as modular, self-contained packages. Each plugin can include:
- Commands (custom slash commands)
- Agents (specialized AI agents)
- Documentation (HOW_TO guides and references)
- Hooks (event handlers)
- MCP servers (external tool integrations)

### Marketplace Structure
The marketplace is defined in `.claude-plugin/marketplace.json`:
```json
{
  "name": "otrebu-dev-tools",
  "owner": {
    "name": "otrebu",
    "email": "dev@otrebu.me"
  },
  "plugins": [
    {
      "name": "codebase-explorer",
      "source": "./plugins/codebase-explorer",
      "description": "Comprehensive codebase exploration through specialized analysis agents",
      "version": "1.0.0"
    },
    {
      "name": "meta-work",
      "source": "./plugins/meta-work",
      "description": "Tools for managing and creating Claude Code configurations, commands, agents, and plugins",
      "version": "1.0.0"
    }
  ]
}
```

### Available Plugins

#### Codebase Explorer (`plugins/codebase-explorer/`)
Comprehensive codebase exploration through 7 specialized analysis agents:
- Orchestrates multi-agent analysis workflow
- Generates persistent documentation (01-DISCOVERY.md, 02-ARCHITECTURE.md, etc.)
- Analyzes technology stack, architecture, features, security, and history
- Perfect for onboarding, documentation audits, and pre-refactoring assessment

**Usage**: Install the plugin and run `/explore-codebase`

#### Meta-Work (`plugins/meta-work/`)
Tools for managing and creating Claude Code configurations:
- **Commands**: `/create-command`, `/create-agent`, `/create-doc`, `/create-plugin`
- Atomic command design (each command does one thing well)
- Supports inline instructions or shared documentation patterns
- Validates structure and prevents conflicts
- Plugin-scoped support for organizing by domain

**Usage**: Install the plugin and run `/create-command <description>`, `/create-agent <description>`, etc.

#### Feature Development (`plugins/feature-development/`)
Software feature development tools with research, planning, and implementation agents:
- **Command**: `/execute-implementation` - Orchestrate wave-based execution of implementation plans
- **Agents**:
  - `deep-research` - Parallel web research with optional report generation
  - `deep-context-gatherer` - Web + codebase analysis for comprehensive context (outputs to `docs/reports/`)
  - `high-level-planner` - Generates 3-5 diverse implementation approaches with trade-off analysis (outputs to `docs/plans/`)
  - `plan-refiner` - Refines existing plans based on feedback, generates variants and hybrids
  - `commit-planner` - Atomic commit-level planning with dependency tracking and wave-based parallelization (outputs to `docs/implementation/`)
  - `commit-executor` - Implements individual commits following detailed plans

**Key workflow**:
1. `deep-context-gatherer` → research topic
2. `high-level-planner` → generate implementation options with comparison matrix
3. (Optional) `plan-refiner` → refine or create variants/hybrids
4. `commit-planner` → create commit-level plans with dependency tracking
5. `/execute-implementation` → wave-based execution with parallel commits

The workflow automatically chains outputs: architect detects and reuses context reports, planner detects and uses architect plans.

**Usage**: 
- `@feature-development:deep-context-gatherer gather context for {topic}`
- `@feature-development:high-level-planner design solutions using docs/reports/{topic}.md`
- `@feature-development:commit-planner plan commits using docs/plans/{feature}/option-1.md`
- `/execute-implementation docs/implementation/{feature-slug}`

### Creating Your Own Plugins
To create a new plugin:
1. Create a directory under `plugins/`
2. Add `.claude-plugin/plugin.json` manifest
3. Organize your commands, agents, and docs
4. Add entry to `.claude-plugin/marketplace.json`

See [Claude Code Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugins) for details.

## Updating Configuration

Since files are symlinked, any updates to this repository automatically reflect in all linked projects:

```bash
cd ~/dev/agents
git pull origin main
# Changes are immediately available in all linked .claude folders
```