# My Claude Memory

A centralized configuration repository for Claude Code featuring:
- 🤖 **Specialized agents** for code review, ESLint fixing, command creation
- ⚡ **Custom slash commands** for common workflows (commits, branches, code review)
- 🔧 **Meta-command system** to create new commands following DRY principles
- 🔌 **Plugin marketplace** with modular extensions (codebase explorer)
- 📚 **Personal coding standards** (FP-first style, development workflow, tech stack preferences)
- 🔗 **Symlink-based setup** for easy sharing across projects

All configuration can be linked to your global Claude config (`~/.claude`) or individual project `.claude` folders.

## Repository Structure

```
.
├── .claude/                      # Example .claude folder with symlinks
│   ├── agents/                  -> ../agents
│   ├── commands/                -> ../commands
│   └── settings.json            -> ../settings.json
├── .claude-plugin/               # Plugin marketplace definition
│   └── marketplace.json         # Marketplace configuration
├── plugins/                      # Plugin directory
│   ├── codebase-explorer/       # Codebase exploration plugin
│   │   ├── .claude-plugin/      # Plugin manifest
│   │   ├── commands/            # Plugin commands
│   │   ├── agents/              # Plugin agents
│   │   └── README.md            # Plugin documentation
│   └── meta-work/               # Meta-work plugin (command creation, etc.)
│       ├── .claude-plugin/      # Plugin manifest
│       ├── commands/            # Plugin commands
│       ├── agents/              # Plugin agents
│       └── README.md            # Plugin documentation
├── agents/                       # Core reusable agent definitions
│   ├── code-review.md
│   ├── fix-eslint.md
│   └── start-feature.md
├── commands/                     # Core custom slash commands
│   ├── commit.md                # Conventional commits
│   ├── code-review.md           # Code review
│   ├── analyze-size.md          # Codebase size analysis
│   ├── fix-eslint.md            # Fix ESLint errors via agent
│   ├── spawn-eslint-fixers.md   # Orchestrate parallel ESLint fixers
│   └── start-feature.md         # Feature branch workflow
├── docs/                         # Project documentation and coding standards
│   ├── CODING_STYLE.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── typescript/
│   │   ├── STACK.md
│   │   ├── TOOLING.md
│   │   ├── TESTING.md
│   │   └── LOGGING.md
│   ├── HOW_TO_START_FEATURE.md
│   ├── HOW_TO_CODE_REVIEW.md
│   └── HOW_TO_FIX_ESLINT.md
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
- ✓ Create symlinks to agents, commands, settings
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
lrwxr-xr-x  settings.json -> ../settings.json
```

## What's Included

### Core Agents (`/agents`)
Reusable agent definitions for specialized tasks:
- **code-review** - Expert code review specialist
- **fix-eslint** - Automatically fix ESLint errors in specified files/directory
- **start-feature** - Create feature branches based on description

### Core Commands (`/commands`)
Custom slash commands for common workflows:
- `/commit [message]` - Create conventional commits
- `/code-review` - Comprehensive code review
- `/analyze-size` - Analyze codebase size and language distribution using cloc
- `/fix-eslint [pattern]` - Fix ESLint errors via agent orchestration
- `/spawn-eslint-fixers [pattern]` - Orchestrate parallel ESLint fixers by directory
- `/start-feature <description>` - Create or switch to a feature branch

### Plugins (`/plugins`)

#### Codebase Explorer Plugin
**Location**: `plugins/codebase-explorer/`

Comprehensive codebase exploration through specialized analysis agents:
- **Command**: `/explore-codebase` - Orchestrate multi-agent codebase exploration
- **Agents**: 7 specialized agents
  - `explore-codebase` - Orchestrator agent
  - `discover-codebase` - Initial discovery (technology, structure)
  - `analyze-architecture` - Architecture, patterns, component relationships
  - `analyze-technical` - Testing, error handling, CI/CD, technical quality
  - `analyze-security` - Security analysis and vulnerability assessment
  - `analyze-history` - Git history analysis and development patterns
  - `inventory-features` - Features, user journeys, business capabilities
- **Documentation**: 7 comprehensive HOW_TO guides for each analysis domain

**Installation**: Add the plugin via the marketplace or install directly from `plugins/codebase-explorer/`

#### Meta-Work Plugin
**Location**: `plugins/meta-work/`

Tools for managing and creating Claude Code configurations, commands, agents, and plugins. Provides "meta work" capabilities for building and maintaining your custom Claude Code environment.

- **Command**: `/create-command <description>` - Create complete command suites following DRY principles
- **What it does**:
  - Interactively gathers requirements (name, tools, complexity)
  - Decides between Pattern A (standalone) or Pattern B (shared doc)
  - Generates appropriate files in `commands/`, `agents/`, and `docs/`
  - Validates structure and references
- **Patterns**:
  - Pattern A (Standalone): Single command/agent with inline instructions
  - Pattern B (Shared Doc): Both agent and command with shared documentation
- **Future features** (planned): `/create-plugin`, `/analyze-config`, `/audit-commands`, `/update-readme`, and more

**Installation**: Add the plugin via the marketplace or install directly from `plugins/meta-work/`

### Documentation (`/docs`)
- **CODING_STYLE.md** - Universal coding principles (FP patterns, naming, testing, logging)
- **DEVELOPMENT_WORKFLOW.md** - Testing, commits, branching, documentation guidelines
- **typescript/STACK.md** - TypeScript/JavaScript tech stack overview
- **typescript/TOOLING.md** - Tool usage patterns and configurations
- **typescript/TESTING.md** - Testing patterns with Vitest
- **typescript/LOGGING.md** - Logging strategies (CLI vs services)
- **HOW_TO_START_FEATURE.md** - Feature branch workflow and naming conventions
- **HOW_TO_CODE_REVIEW.md** - Code review process and guidelines
- **HOW_TO_FIX_ESLINT.md** - ESLint error fixing workflow

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
- Create complete command suites with `/create-command`
- Follows DRY principles with Pattern A (standalone) and Pattern B (shared doc)
- Validates structure and prevents conflicts
- Future features: plugin creation, config analysis, command auditing, and more

**Usage**: Install the plugin and run `/create-command <description>`

#### Feature Development (`plugins/feature-development/`)
Software feature development tools with research, planning, and implementation agents:
- **deep-research** - Parallel web research with optional report generation
- **deep-context-gatherer** - Web + codebase analysis for comprehensive context (outputs to `docs/reports/`)
- **high-level-planner** - Generates 3-5 diverse implementation approaches with trade-off analysis (outputs to `docs/plans/`)
- **commit-planner** - Atomic commit-level planning with dependency tracking and wave-based parallelization (outputs to `docs/implementation/`)

**Key workflow**:
1. `deep-context-gatherer` → research topic
2. `high-level-planner` → generate implementation options with comparison matrix
3. `commit-planner` → create commit-level plans with dependency tracking
4. Implement following atomic commit plans with pre-commit checklists

The workflow automatically chains outputs: architect detects and reuses context reports, planner detects and uses architect plans.

**Usage**: `@feature-development:commit-planner plan commits using docs/plans/{feature}/option-1.md`

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