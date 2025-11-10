# My Claude Memory


🥚
A centralized configuration repository for Claude Code featuring:
- 🎯 **Specialized skills** organized in plugins for code review, ESLint fixing, git workflows, brainstorming, and more
- 🔌 **Plugin marketplace** with modular extensions (meta-work, development-lifecycle, typescript-coding, knowledge-work, basic-skills)
- 🔧 **Meta-work tools** to create new commands, agents, docs, and plugins following DRY principles
- 📚 **Personal coding standards** (FP-first style, development workflow, tech stack preferences)
- 🎤 **Custom hooks** for enhanced functionality (TTS readback, skill reminders)
- 📦 **Plugin-based setup** using absolute paths for reliable config reuse across projects

All configuration can be referenced from your project `.claude` folders using the bootstrap script.

## Philosophy

This configuration embodies several key principles:

1. **Plugin-First Architecture** - Modular, composable extensions over monolithic configs
2. **Absolute Paths** - Reference plugins from single source of truth (`~/dev/agents`)
3. **Skills Over Agents** - Reusable skill blocks for common patterns
4. **Documentation as Code** - Coding standards travel with config
5. **Meta-Tooling** - Tools to create tools (`create-command`, `create-skill`, etc.)
6. **DRY Configuration** - One place to maintain, many places to reference

## Repository Structure

```
.
├── .claude/                      # Project config (references plugins via absolute paths)
│   ├── settings.json             # Simplified plugin-based config
│   └── settings.local.json       # Local overrides (not tracked)
├── .claude-plugin/               # Plugin marketplace definition
│   └── marketplace.json          # Marketplace configuration
├── plugins/                      # All skills organized in plugins
│   ├── meta-work/                # Meta-work: commands, skills, plugins, docs
│   │   ├── .claude-plugin/       # Plugin manifest
│   │   ├── commands/             # /create-command, /create-agent, /create-doc, /create-plugin
│   │   ├── skills/               # prompting, claude-permissions, skill-creator, plugin-creator
│   │   └── README.md
│   ├── development-lifecycle/    # Dev workflow: git, code review, planning
│   │   ├── .claude-plugin/
│   │   ├── commands/             # /execute-implementation
│   │   ├── agents/               # deep-research, deep-context-gatherer
│   │   ├── skills/               # analyze-size, git-commit, code-review, start-feature, finish-feature, fix-eslint, dev-work-summary
│   │   └── README.md
│   ├── typescript-coding/        # TypeScript/JavaScript development guidance
│   │   ├── .claude-plugin/
│   │   ├── skills/
│   │   │   └── typescript-coding/
│   │   │       ├── SKILL.md
│   │   │       ├── STACK.md     # Tech stack overview
│   │   │       ├── TOOLING.md   # Tool usage patterns
│   │   │       ├── TESTING.md   # Testing patterns
│   │   │       └── LOGGING.md   # Logging strategies
│   │   └── README.md
│   ├── knowledge-work/           # Knowledge capture, web research, ideation
│   │   ├── .claude-plugin/
│   │   ├── skills/               # gemini-research, gh-code-search, brainwriting, readwise-api, scratchpad-fetch, web-to-markdown
│   │   └── README.md
│   └── basic-skills/             # Foundational utilities
│       ├── .claude-plugin/
│       ├── skills/               # timestamp
│       └── README.md
├── docs/                         # Project documentation and coding standards
│   ├── CODING_STYLE.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── roadmap/                  # Development roadmap and planning
│   │   └── overview.md
│   ├── scratchpad/               # Web fetched content cache
│   └── web-captures/             # Playwright web-to-markdown captures
├── hooks/                        # Claude Code hooks
│   ├── skill-reminder/           # Contextual skill reminder hook
│   │   └── prompt-hook.ts        # UserPromptSubmit hook (TypeScript)
│   └── tts-readback/             # Text-to-speech readback hook
│       ├── stop-hook.ts          # Hook implementation
│       ├── package.json          # Dependencies
│       └── README.md             # Hook documentation
├── CLAUDE.md                     # Global Claude instructions
├── settings.json                 # Claude Code settings
├── setup-project.sh              # Automated project bootstrap script
└── README.md
```

## Setup: Using This Configuration

### Quick Setup (Automated)

Use the provided bootstrap script to set up new projects:

```bash
# Bootstrap a new project
./setup-project.sh ~/path/to/your-project

# Use current directory
./setup-project.sh .
```

The script will:
- ✓ Create `.claude` directory if needed
- ✓ Create `settings.json` with absolute paths to all plugins
- ✓ Configure hooks (TTS readback, skill reminder)
- ✓ Safe to re-run (won't overwrite existing files)

### Manual Setup

If you prefer manual configuration, create `.claude/settings.json` in your project:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "plugins": [
    "/Users/Uberto.Rapizzi/dev/agents/plugins/meta-work",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/development-lifecycle",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/typescript-coding",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/knowledge-work",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/basic-skills"
  ],
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "/Users/Uberto.Rapizzi/dev/agents/hooks/tts-readback/node_modules/.bin/tsx /Users/Uberto.Rapizzi/dev/agents/hooks/tts-readback/stop-hook.ts",
        "timeout": 30
      }]
    }],
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "node --experimental-strip-types /Users/Uberto.Rapizzi/dev/agents/hooks/skill-reminder/prompt-hook.ts",
        "timeout": 5
      }]
    }]
  }
}
```

**Note:** The paths above are example absolute paths. Replace `/Users/Uberto.Rapizzi/dev/agents` with the actual path to your cloned agents directory. The `setup-project.sh` script automatically resolves these paths for you.

**Hook Details:**
- **prompt-hook.ts**: Uses Node.js native type stripping (Node 22.6+), no build step required
- **stop-hook.ts**: Requires tsx for Kokoro.js TTS library compatibility

### Verifying Setup

After running `setup-project.sh`, verify your configuration:

**1. Plugin Loading:**
```bash
cd /path/to/your-project
claude /skills

# Expected: 19 skills from 5 plugins
# - meta-work (4 skills)
# - development-lifecycle (7 skills)
# - typescript-coding (1 skill)
# - knowledge-work (6 skills)
# - basic-skills (1 skill)
```

**2. Commands Available:**
```bash
claude /meta-work:create-command --help

# Should show usage info, not "command not found"
```

**3. Hooks Configured:**
```bash
# Check hooks in your project settings
cat .claude/settings.json | grep -A 5 hooks

# Should show Stop hook (TTS) and UserPromptSubmit hook (skill-reminder)
```

**4. Documentation Referenced:**
```bash
# Verify CLAUDE.md references global docs
cat .claude/CLAUDE.md 2>/dev/null || cat CLAUDE.md

# Should reference @docs/CODING_STYLE.md and @docs/DEVELOPMENT_WORKFLOW.md
```

**Troubleshooting:**
- If skills don't appear: Check plugin paths are absolute, not relative
- If hooks don't fire: Verify hook script is executable and paths are correct
- If commands fail: Ensure you're in a project with `.claude/settings.json` configured

## What's Included

### Architecture Overview 🏗️

**Skills** = Self-contained modules with SKILL.md frontmatter
- Core skills: `/skills` (shared across projects)
- Plugin-scoped: `plugins/{name}/skills` (domain-specific)
- Invoke: `Skill(name)` or `Skill(plugin:name)`

**Commands** = Slash commands for direct instructions
- Format: `/command-name [args]`
- Simple operations, no complex reasoning

**Agents** = Specialized AI reasoning agents
- Format: `@plugin:agent-name`
- Complex multi-step tasks, parallel execution

**Migration**: Commands/agents → skills architecture

### File Organization Principles

**Commands** (`*/commands/*.md`):
- Direct instructions, minimal reasoning
- Format: `/command-name [args]`
- Inline docs OR reference shared docs

**Skills** (`*/skills/*/SKILL.md`):
- Self-contained modules with frontmatter
- Complex reasoning, reusable patterns
- Invoke: `Skill(name)` or `Skill(plugin:name)`

**Agents** (`*/agents/*.md`):
- Specialized autonomous agents
- Multi-step tasks, parallel execution
- Format: `@plugin:agent-name`

**Docs** (`*/skills/*/docs/HOW_TO_*.md`):
- Shared reference documentation
- Used by multiple commands/skills
- Single source of truth for domain knowledge

### All Skills (Organized by Plugin)

Skills are now organized into semantic plugins for better discoverability and config management:

**development-lifecycle** (7 skills):
- `analyze-size` - Analyze codebase size/language distribution using cloc
- `git-commit` - Create conventional commits from git diff analysis
- `code-review` - Expert code review with automated pre-review checks
- `start-feature` - Create/switch to feature branches
- `finish-feature` - Complete feature work and merge to main
- `fix-eslint` - Auto-fix ESLint errors (parallel agents for >20 errors)
- `dev-work-summary` - Scan ~/dev for today's work across all repos

**knowledge-work** (6 skills):
- `gemini-research` - Google Search-powered research via Gemini CLI with structured JSON output
- `gh-code-search` - Search GitHub for real-world code examples and implementation patterns
- `brainwriting` - Structured brainstorming with parallel sub-agents
- `readwise-api` - Fetch and analyze Readwise reading activity
- `scratchpad-fetch` - Download and aggregate web pages/docs
- `web-to-markdown` - Batch-process web pages to markdown via Playwright

**meta-work** (4 skills):
- `prompting` - Prompt engineering standards (Anthropic best practices)
- `claude-permissions` - Configure permissions, sandboxing, tool access
- `skill-creator` - Guide for creating effective skills
- `plugin-creator` - Create Claude Code plugins with proper structure

**typescript-coding** (1 skill):
- `typescript-coding` - Expert TS/JS guidance (stack, tooling, testing, logging)

**basic-skills** (1 skill):
- `timestamp` - Generate deterministic timestamps (YYYYMMDDHHMMSS format)

### Plugins (`/plugins`)

See [Available Plugins](#available-plugins) section below for detailed information about each plugin.

### Documentation (`/docs`)

**Core Workflow Docs:**
- **CODING_STYLE.md** - Universal coding principles (FP patterns, naming, testing, logging)
- **DEVELOPMENT_WORKFLOW.md** - Testing, commits, branching, documentation guidelines

**Planning & Strategy:**
- **roadmap/overview.md** - Development roadmap, planned phases, and future enhancements

**Auto-Generated Content:**
- **scratchpad/** - Timestamped web content aggregated by scratchpad-fetch skill
- **web-captures/** - HTML-to-markdown conversions from web-to-markdown skill

**TypeScript-Specific Docs:**
See `plugins/typescript-coding/skills/typescript-coding/` for:
- **STACK.md** - Tech stack overview
- **TOOLING.md** - Tool usage patterns
- **TESTING.md** - Testing patterns with Vitest
- **LOGGING.md** - Logging strategies (CLI vs services)

### Hooks (`/hooks`)
Custom Claude Code hooks for enhanced functionality:

#### Skill Reminder (`/hooks/skill-reminder`)
Smart contextual reminders about available skills:
- **Trigger**: UserPromptSubmit (before each message is processed)
- **Features**:
  - Pattern-matches user input against skill trigger words
  - Shows specific skill names only when relevant
  - Silent when no skills match (reduces noise)
  - Covers high-priority skills (git-commit, fix-eslint, code-review, etc.)
- **Usage**: Automatically fires on every user prompt
- **Configuration**: Edit `prompt-hook.sh` to add/modify skill patterns

This hook makes skill usage more discoverable without being annoying.

#### TTS Readback (`/hooks/tts-readback`)
Text-to-speech hook that reads Claude's responses aloud using Kokoro.js (local TTS):
- **Trigger**: Stop hook (when Claude finishes responding)
- **Features**:
  - 100% local - no API keys or cloud services required
  - Pure TypeScript using Kokoro.js (ONNX + WASM)
  - Parses recent transcript messages efficiently
  - High-quality 82M parameter model
  - Privacy-first audio generation
- **Setup**: Run `pnpm install` in hooks/tts-readback (downloads ~350MB model on first run)
- **Usage**: Automatically fires on task completion
- **Docs**: See `hooks/tts-readback/README.md` for full setup

This hook enables multitasking by providing audio notifications of Claude's work.

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

## Known Limitations

- **Archived Components**: Some planning agents (high-level-planner, commit-planner, plan-refiner, commit-executor) are archived pending skill-based redesign
- **In-Flux Architecture**: Development-lifecycle plugin transitioning from agent-based to skill-based planning
- **Local Dependencies**: TTS hook requires ~350MB model download on first use
- **Path Assumptions**: Setup script assumes standard Unix-like environment

## Migration Notes

**Recent Changes:**
- **2024-Q4**: TypeScript documentation moved from `docs/typescript/` to `plugins/typescript-coding/skills/typescript-coding/`
- **2024-Q4**: Planning agents archived, transitioning to skill-based architecture
- **2024-Q4**: Hooks updated to use Node.js native type stripping where possible

**If Upgrading from Earlier Versions:**
1. Re-run `setup-project.sh` to get latest hook configurations
2. Update any manual references to `docs/typescript/*.md` to point to plugin location
3. Remove references to archived planning agents from custom workflows

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
      "name": "meta-work",
      "source": "./plugins/meta-work",
      "description": "Tools for managing and creating Claude Code configurations, commands, agents, and plugins",
      "version": "1.0.0"
    },
    {
      "name": "development-lifecycle",
      "source": "./plugins/development-lifecycle",
      "description": "Software feature development with research, planning, and implementation",
      "version": "1.0.0"
    }
  ]
}
```

### Available Plugins

#### Meta-Work (`plugins/meta-work/`)
Tools for managing and creating Claude Code configurations:
- **Commands**: `/create-command`, `/create-agent`, `/create-doc`, `/create-plugin`
- **Skills**:
  - `prompting` - Prompt engineering standards (Anthropic best practices, clarity, structure)
  - `claude-permissions` - Configure and manage permissions, sandboxing, tool access
  - `skill-creator` - Guide for creating effective skills with specialized knowledge/workflows
  - `plugin-creator` - Create Claude Code plugins with proper structure
- Atomic command design (each command does one thing well)
- Supports inline instructions or shared documentation patterns
- Validates structure and prevents conflicts

**Usage**: `/create-command <description>` or `Skill(meta-work:prompting)`

#### Development Lifecycle (`plugins/development-lifecycle/`)
Software feature development tools with git workflows, code review, and research:

**Commands:**
- `/execute-implementation` - Wave-based execution orchestrator

**Active Agents:**
- `deep-research` - Parallel web research with optional report generation
- `deep-context-gatherer` - Web + codebase analysis (outputs to `docs/reports/`)

**Skills:**
- `analyze-size` - Codebase size/language analysis using cloc
- `git-commit` - Conventional commits from git diff
- `code-review` - Expert code review with quality checks
- `start-feature` - Create/switch to feature branches
- `finish-feature` - Complete and merge feature work
- `fix-eslint` - Auto-fix ESLint errors (parallel for >20 errors)
- `dev-work-summary` - Daily work summary across ~/dev repos

**Note:** High-level planning, plan refinement, and commit planning agents are archived. The development workflow is transitioning to skill-based architecture. See [Development Roadmap](docs/roadmap/overview.md) for future plans.

**Usage:**
- `@development-lifecycle:deep-research <topic>`
- `@development-lifecycle:deep-context-gatherer gather context for {topic}`
- `Skill(development-lifecycle:git-commit)` when ready to commit
- `Skill(development-lifecycle:code-review)` after writing code

#### TypeScript Coding (`plugins/typescript-coding/`)
Expert TypeScript/JavaScript development guidance:
- **Skills**:
  - `typescript-coding` - Comprehensive TS/JS guidance (stack, tooling, testing, logging patterns)
- Covers stack decisions, build tool configuration (pnpm, Vite, TypeScript)
- Testing strategies with Vitest
- Logging patterns (pino for services, chalk/console for CLIs)
- FP-first patterns with React, Tailwind, XState

**Usage**: `Skill(typescript-coding:typescript-coding)` when planning or writing TS/JS code

#### Knowledge Work (`plugins/knowledge-work/`)
Knowledge capture, web research, and ideation workflows:
- **Skills**:
  - `gemini-research` - Google Search-powered research via Gemini CLI with citations, quotes, and structured JSON
  - `gh-code-search` - Search GitHub for real-world code examples with smart ranking (stars, recency, language)
  - `brainwriting` - Structured brainstorming using parallel sub-agents (5 rounds of exploration)
  - `readwise-api` - Fetch and analyze Readwise reading activity for any date range
  - `scratchpad-fetch` - Download and aggregate web pages/docs into timestamped scratchpad files
  - `web-to-markdown` - Batch-process web pages via Playwright, convert HTML to markdown
- Designed for gathering external knowledge and creative ideas into structured formats
- Research skills return structured data; web fetching skills output to timestamped files for easy reference

**Usage**:
- `Skill(knowledge-work:gemini-research)` for web research with Google Search
- `Skill(knowledge-work:gh-code-search)` to find code examples on GitHub
- `Skill(knowledge-work:brainwriting)` for ideation and concept exploration
- `Skill(knowledge-work:web-to-markdown)` to capture web content as markdown
- `Skill(knowledge-work:readwise-api)` to analyze reading habits

#### Basic Skills (`plugins/basic-skills/`)
Foundational utilities used across other skills:
- **Skills**:
  - `timestamp` - Generate deterministic timestamps in YYYYMMDDHHMMSS format
- Simple, reusable helpers for common tasks
- Designed to grow with additional foundational utilities (path helpers, string utilities, etc.)

**Usage**: `Skill(basic-skills:timestamp)` when you need consistent timestamp formatting

### Creating Your Own Plugins
To create a new plugin:
1. Create a directory under `plugins/`
2. Add `.claude-plugin/plugin.json` manifest
3. Organize your commands, agents, and docs
4. Add entry to `.claude-plugin/marketplace.json`

See [Claude Code Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugins) for details.

## Updating Configuration

Since projects reference plugins via absolute paths, any updates to this repository automatically reflect in all projects using these plugins:

```bash
cd ~/dev/agents
git pull origin main
# Changes are immediately available in all projects referencing these plugins
```

**Note:** The plugin-based approach means you edit skills once in `~/dev/agents`, and all projects see the updates immediately. No need to propagate changes to individual projects.

---

## Development Roadmap

This repository follows an evolving roadmap to build comprehensive AI-powered development workflows. For detailed information about planned phases, current gaps, and future enhancements, see:

**📍 [Development Roadmap](docs/roadmap/overview.md)**

**Current Focus:**
- ✅ Phase 0: Core infrastructure (skills, plugins, meta-tooling) - **COMPLETE**
- 🔄 Phase 1: Research enhancement (GitHub code search, cost-effective alternatives)
- 📋 Phase 2: Foundation (hooks, testing, documentation automation)
- 📋 Phase 3: Autonomous workflows (planning skills, error-fix loops, orchestration)
