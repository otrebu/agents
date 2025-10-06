# My Claude Memory

A centralized configuration repository for Claude Code containing reusable agents, commands, documentation, and settings that can be linked to projects or your global Claude configuration.

## Repository Structure

```
.
├── .claude/              # Example .claude folder with symlinks
│   ├── agents/          -> ../agents
│   ├── commands/        -> ../commands
│   └── settings.json    -> ../settings.json
├── agents/              # Reusable agent definitions
├── commands/            # Custom slash commands
├── docs/                # Project documentation and coding standards
│   ├── CODING_STYLE.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── TECH_STACK_PREFERENCES.md
│   └── TOOLING_PATTERNS.md
├── CLAUDE.md           # Global Claude instructions
├── settings.json       # Claude Code settings
├── setup.sh            # Automated setup script
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
Reusable agent definitions for specialized tasks.

### Commands (`/commands`)
Custom slash commands:
- `/commit` - Create conventional commits
- `/code-review` - Comprehensive code review

### Documentation (`/docs`)
- **CODING_STYLE.md** - Functional programming patterns, naming conventions, import aliases
- **DEVELOPMENT_WORKFLOW.md** - Testing, commits, branching, documentation guidelines
- **TECH_STACK_PREFERENCES.md** - Preferred tech stack choices
- **TOOLING_PATTERNS.md** - Common tools and their usage patterns

### Settings (`/settings.json`)
Claude Code configuration including:
- Allowed commands and tool permissions
- Safety and security settings
- Custom configurations

### Global Instructions (`/CLAUDE.md`)
Project context instructions that reference the documentation files.

## Updating Configuration

Since files are symlinked, any updates to this repository automatically reflect in all linked projects:

```bash
cd ~/dev/my-claude-memory
git pull origin main
# Changes are immediately available in all linked .claude folders
```