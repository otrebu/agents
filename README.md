# My Claude Memory

A centralized configuration repository for Claude Code featuring:
- 🤖 **10+ specialized agents** for code review, security analysis, architecture exploration
- ⚡ **Custom slash commands** for common workflows (commits, branches, code review)
- 🔧 **Meta-command system** to create new commands following DRY principles
- 📊 **Multi-agent orchestration** for comprehensive codebase exploration
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
├── agents/                       # Reusable agent definitions (10+ specialized agents)
├── commands/                     # Custom slash commands
│   ├── commit.md                # Conventional commits
│   ├── code-review.md           # Code review
│   ├── analyze-size.md          # Codebase size analysis
│   ├── create-command.md        # Meta-command for creating commands
│   ├── start-feature.md         # Feature branch workflow
│   └── explore-codebase.md      # Multi-agent codebase exploration
├── docs/                         # Project documentation and coding standards
│   ├── CODING_STYLE.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── TECH_STACK_PREFERENCES.md
│   ├── TOOLING_PATTERNS.md
│   ├── HOW_TO_CREATE_COMMAND.md
│   ├── HOW_TO_START_FEATURE.md
│   ├── HOW_TO_CODE_REVIEW.md
│   └── codebase-exploration/    # Exploration methodology docs
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
ln -s ~/dev/my-claude-memory/agents agents
ln -s ~/dev/my-claude-memory/commands commands
ln -s ~/dev/my-claude-memory/settings.json settings.json

# Optional: Link documentation
ln -s ~/dev/my-claude-memory/docs docs
ln -s ~/dev/my-claude-memory/CLAUDE.md CLAUDE.md
```

#### Project-Specific Configuration (Manual)

Link to a specific project's `.claude` folder:

```bash
# Navigate to your project's .claude folder
cd ~/path/to/your-project/.claude

# Create symlinks using relative paths to this repository
# (adjust the path based on where my-claude-memory is relative to your project)
ln -s ../../my-claude-memory/agents agents
ln -s ../../my-claude-memory/commands commands
ln -s ../../my-claude-memory/settings.json settings.json
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

### Agents (`/agents`)
Reusable agent definitions for specialized tasks:
- **code-review** - Expert code review specialist
- **create-command** - Create new command suites following DRY pattern
- **start-feature** - Create feature branches based on description
- **explore-codebase** - Orchestrate comprehensive codebase exploration
- **discover-codebase** - Initial codebase discovery (technology, structure)
- **analyze-architecture** - Analyze architecture, patterns, component relationships
- **analyze-technical** - Analyze testing, error handling, CI/CD, technical quality
- **analyze-security** - Security analysis and vulnerability assessment
- **analyze-history** - Git history analysis and development patterns
- **inventory-features** - Catalog features, user journeys, business capabilities

### Commands (`/commands`)
Custom slash commands for common workflows:
- `/commit [message]` - Create conventional commits
- `/code-review` - Comprehensive code review
- `/analyze-size` - Analyze codebase size and language distribution using cloc
- `/create-command <description>` - Create new command suite (doc + agent + command)
- `/start-feature <description>` - Create or switch to a feature branch
- `/explore-codebase` - Run comprehensive multi-agent codebase exploration

### Documentation (`/docs`)
- **CODING_STYLE.md** - Functional programming patterns, naming conventions, import aliases
- **DEVELOPMENT_WORKFLOW.md** - Testing, commits, branching, documentation guidelines
- **TECH_STACK_PREFERENCES.md** - Preferred tech stack choices
- **TOOLING_PATTERNS.md** - Common tools and their usage patterns
- **HOW_TO_CREATE_COMMAND.md** - Pattern system for creating custom commands
- **HOW_TO_START_FEATURE.md** - Feature branch workflow and naming conventions
- **HOW_TO_CODE_REVIEW.md** - Code review process and guidelines
- **codebase-exploration/** - Comprehensive codebase exploration methodology

### Settings (`/settings.json`)
Claude Code configuration including:
- Allowed commands and tool permissions
- Safety and security settings
- Custom configurations

### Global Instructions (`/CLAUDE.md`)
Project context instructions that reference the documentation files.

## Key Features

### Command Creation System
The `/create-command` meta-command helps you build new custom commands following DRY principles. It supports two patterns:
- **Pattern A**: Standalone commands with inline documentation (for simple cases)
- **Pattern B**: Shared documentation with agent + command (for complex shared logic)

See `docs/HOW_TO_CREATE_COMMAND.md` for the complete pattern system and templates.

### Codebase Exploration
The `/explore-codebase` command orchestrates 6 specialized analysis agents to create comprehensive documentation:
1. Discovery → Technology stack and project type
2. Architecture → Structure, patterns, diagrams
3. Features → Capabilities and user journeys
4. Technical → Testing, CI/CD, quality
5. Security → Vulnerabilities and recommendations
6. History → Git evolution and patterns

Generates persistent documentation in `01-DISCOVERY.md`, `02-ARCHITECTURE.md`, `03-FEATURES.md`, `04-TECHNICAL.md`, `SECURITY_ANALYSIS.md`, `HISTORY_ANALYSIS.md`, and a main `CODEBASE_GUIDE.md`.

### Feature Branch Workflow
The `/start-feature` command creates feature branches following your project's naming conventions and development workflow guidelines.

## Updating Configuration

Since files are symlinked, any updates to this repository automatically reflect in all linked projects:

```bash
cd ~/dev/my-claude-memory
git pull origin main
# Changes are immediately available in all linked .claude folders
```