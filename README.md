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

## Repository Structure

```
.
├── .claude/                      # Project config (references plugins via absolute paths)
│   └── settings.json             # Simplified plugin-based config
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
│   │   ├── agents/               # deep-research, deep-context-gatherer, high-level-planner, etc.
│   │   ├── skills/               # analyze-size, git-commit, code-review, start-feature, finish-feature, fix-eslint, dev-work-summary
│   │   └── README.md
│   ├── typescript-coding/        # TypeScript/JavaScript development guidance
│   │   ├── .claude-plugin/
│   │   ├── skills/               # typescript-coding
│   │   └── README.md
│   ├── knowledge-work/           # Knowledge capture, web research, ideation
│   │   ├── .claude-plugin/
│   │   ├── skills/               # brainwriting, readwise-api, scratchpad-fetch, web-to-markdown
│   │   └── README.md
│   └── basic-skills/             # Foundational utilities
│       ├── .claude-plugin/
│       ├── skills/               # timestamp
│       └── README.md
├── docs/                         # Project documentation and coding standards
│   ├── CODING_STYLE.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   └── typescript/
│       ├── STACK.md
│       ├── TOOLING.md
│       ├── TESTING.md
│       └── LOGGING.md
├── hooks/                        # Claude Code hooks
│   ├── skill-reminder/          # Contextual skill reminder hook
│   │   └── prompt-hook.sh       # UserPromptSubmit hook
│   └── tts-readback/            # Text-to-speech readback hook
│       ├── stop-hook.ts         # Hook implementation
│       ├── package.json         # Dependencies
│       └── README.md            # Hook documentation
├── CLAUDE.md                     # Global Claude instructions
├── settings.json                 # Claude Code settings
├── setup.sh                      # Automated setup script
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
        "command": "/Users/Uberto.Rapizzi/dev/agents/hooks/skill-reminder/prompt-hook.sh"
      }]
    }]
  }
}
```

**Note:** The paths above are example absolute paths. Replace `/Users/Uberto.Rapizzi/dev/agents` with the actual path to your cloned agents directory. We recommend using `setup-project.sh` instead, which handles path resolution automatically.

### Verifying Setup

Check that plugins are loaded correctly from your project's configuration:

```bash
# Navigate to your project directory
cd /path/to/your-project

# Verify plugins loaded from project settings
claude /skills

# Should show skills from all configured plugins:
# - knowledge-work:brainwriting
# - knowledge-work:readwise-api
# - basic-skills:timestamp
# - development-lifecycle:analyze-size
# - development-lifecycle:git-commit
# - meta-work:skill-creator
# etc.

# Alternative: check if a specific plugin command is available
claude /meta-work:create-command --help
```

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

**knowledge-work** (4 skills):
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
- **CODING_STYLE.md** - Universal coding principles (FP patterns, naming, testing, logging)
- **DEVELOPMENT_WORKFLOW.md** - Testing, commits, branching, documentation guidelines
- **typescript/STACK.md** - TypeScript/JavaScript tech stack overview
- **typescript/TOOLING.md** - Tool usage patterns and configurations
- **typescript/TESTING.md** - Testing patterns with Vitest
- **typescript/LOGGING.md** - Logging strategies (CLI vs services)

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
Software feature development tools with research, planning, implementation, and git workflows:
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
- `@development-lifecycle:deep-context-gatherer gather context for {topic}`
- `@development-lifecycle:high-level-planner design solutions using docs/reports/{topic}.md`
- `@development-lifecycle:commit-planner plan commits using docs/plans/{feature}/option-1.md`
- `/execute-implementation docs/implementation/{feature-slug}`

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
  - `brainwriting` - Structured brainstorming using parallel sub-agents (5 rounds of exploration)
  - `readwise-api` - Fetch and analyze Readwise reading activity for any date range
  - `scratchpad-fetch` - Download and aggregate web pages/docs into timestamped scratchpad files
  - `web-to-markdown` - Batch-process web pages via Playwright, convert HTML to markdown
- Designed for gathering external knowledge and creative ideas into structured formats
- All web fetching skills output to timestamped files for easy reference

**Usage**:
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

This section outlines the planned enhancements to achieve a comprehensive, autonomous AI-powered development workflow.

### Vision

Build an end-to-end AI development infrastructure that handles the complete software lifecycle: research → plan → implement → test → review → document → deploy. The goal is autonomous feature development with human oversight at key decision points.

### Current State Analysis

**What Works Well:**
- ✅ Brainstorming and ideation (brainwriting skill)
- ✅ Web research with synthesis (deep-research agent)
- ✅ Local codebase exploration (Explorer agent, deep-context-gatherer)
- ✅ TypeScript/JavaScript development guidance
- ✅ Feature branch workflow (start-feature, finish-feature)
- ✅ Code quality enforcement (fix-eslint with parallel agents)
- ✅ Code review (technical quality + intent alignment)
- ✅ Git workflow (conventional commits, work summaries)
- ✅ Meta-tooling (create skills/commands/agents/plugins)

**Critical Gaps Identified:**
- 🔴 GitHub code search for real-world examples
- 🔴 Cost-effective external research alternatives
- 🔴 Automated linting/formatting hooks
- 🔴 Test generation and verification
- 🔴 Documentation discrepancy detection
- 🔴 Project scaffolding
- 🔴 Iterative error-fix loops
- 🔴 End-to-end autonomous feature development
- 🔴 Multi-perspective code review (security, performance, etc.)

### Implementation Phases

#### Phase 1: Research Enhancement 🔍

**Goal**: Improve context gathering with practical code examples and cost-effective research.

**Deliverables:**
1. **GitHub Code Search Skill**
   - Search repositories via `gh` CLI for real-world implementations
   - Filter by language, stars, recency
   - Extract and summarize relevant patterns
   - Location: `skills/github-code-search/`

2. **Gemini CLI Integration**
   - Alternative to expensive research APIs
   - Focus on practical code examples (not essays)
   - Integration with existing research workflows
   - Location: `skills/gemini-research/` or integrated into deep-research

3. **Research Orchestrator Enhancement**
   - Unified research combining:
     - Web search (existing)
     - GitHub code search (new)
     - Gemini research (new)
     - Local codebase analysis (existing)
   - Parallel execution across all sources
   - Synthesized, actionable output
   - Enhancement to: `plugins/development-lifecycle/agents/deep-context-gatherer.md`

**Success Criteria:**
- Can find real-world code examples for any common pattern
- Research cost reduced by 70%+ vs Perplexity
- Context quality improved (practical examples vs theoretical essays)

---

#### Phase 2: Foundation (Hooks + Testing) 🧪

**Goal**: Complete the development lifecycle with automated quality gates and testing.

**Deliverables:**
1. **Pre-Commit Hooks**
   - Auto-run linting and formatting
   - Leverage existing fix-eslint skill
   - Block commits with unfixable issues
   - Location: `.claude/hooks/pre-commit-lint-format.ts`

2. **Pre-Push Hooks**
   - Run test suite before push
   - Prevent broken code from reaching remote
   - Location: `.claude/hooks/pre-push-test.ts`

3. **Test-Writer Agent**
   - Generate tests for implementations
   - Identify test scenarios (happy path, edge cases, errors)
   - Follow TESTING.md standards
   - Verify tests pass
   - Location: `plugins/development-lifecycle/skills/test-writer/`

4. **Documentation Reviewer Agent**
   - Run at end of implementation
   - Compare code changes to docs
   - Identify outdated sections
   - Suggest specific updates
   - Location: `plugins/development-lifecycle/agents/doc-reviewer.md`

5. **Project Scaffolding Command**
   - Bootstrap new projects with best practices
   - Create CLAUDE.md with coding standards
   - Set up docs/ and .claude/ structure
   - Template selection by project type
   - Location: `/commands/scaffold-project.md`

**Success Criteria:**
- No commits with linting errors
- No pushes with failing tests
- All implementations have corresponding tests
- Documentation stays in sync with code

---

#### Phase 3: Autonomous Workflows 🤖

**Goal**: Build orchestrators that handle end-to-end development with minimal human intervention.

**Deliverables:**
1. **Skill-Based Planning**
   - Replace archived agents with composable skills
   - **High-level planning skill**: Feature → implementation approaches
   - **Low-level planning skill**: Approaches → commit waves
   - Leverage Phase 1 research improvements
   - Location: `plugins/development-lifecycle/skills/plan-feature/` and `plan-commits/`

2. **Iterative Error-Fix Loop**
   - Run tests/build → analyze errors → fix → retry
   - Like fix-eslint but for any error type
   - Configurable max retries
   - Detailed fix reports
   - Integration with execute-implementation
   - Location: `plugins/development-lifecycle/skills/fix-until-green/`

3. **Multi-Perspective Code Review**
   - Parallel review agents with specialized focuses:
     - Security (OWASP, injection, auth)
     - Performance (complexity, bottlenecks)
     - Accessibility (WCAG if applicable)
     - Architecture (patterns, coupling)
   - Aggregate findings by priority
   - Enhancement to existing code-review skill
   - Location: `plugins/development-lifecycle/skills/code-review/` (with perspective modes)

4. **Autonomous Feature Development Orchestrator**
   - End-to-end workflow combining all skills:
     1. Research orchestrator (gather context)
     2. High-level planner (feature breakdown)
     3. Low-level planner (commit waves)
     4. Execute-implementation (coding)
     5. Test-writer (generate tests)
     6. Fix-until-green (error loop)
     7. Multi-perspective review (quality)
     8. Doc-reviewer (documentation)
     9. Git-commit (conventional commits)
   - Checkpoints at each phase for approval
   - Detailed progress tracking
   - Location: `/commands/develop-feature.md`

**Success Criteria:**
- Can develop complete features from description to merge
- All tests pass, no linting errors
- Code reviewed from multiple perspectives
- Documentation automatically updated
- Human intervention only at decision points

---

#### Phase 4: Expansion (Future) 🚀

**Lower priority enhancements for specialized use cases:**

1. **Refactoring Workflows**
   - Detect refactoring opportunities
   - Safe automated refactoring
   - Preserve behavior with tests

2. **Tech Debt Management**
   - Identify outdated patterns
   - Modernization suggestions
   - Dependency updates

3. **Infrastructure as Code**
   - Terraform/CloudFormation/Pulumi support
   - IaC best practices
   - Security scanning

4. **Browser Automation**
   - Interactive web testing
   - Screenshot comparisons
   - E2E test generation

5. **Changelog Generation**
   - Parse conventional commits
   - Generate comprehensive changelogs
   - Version bump recommendations

---

### Execution Timeline

**Phase 1 (Research)**: 1-2 weeks
- Foundation for all subsequent work
- Research quality directly impacts planning/implementation

**Phase 2 (Foundation)**: 2-3 weeks
- Complete the dev lifecycle
- Enable reliable autonomous execution

**Phase 3 (Autonomous Workflows)**: 3-4 weeks
- Requires Phases 1-2 to be solid
- Most complex integration work

**Phase 4 (Expansion)**: As needed
- Evaluate after Phase 3 completion
- Prioritize based on real usage patterns

---

### Design Principles

1. **Research First**: Quality context → quality code
2. **Skills Over Agents**: Composable, reusable components
3. **Parallel Execution**: Leverage Claude Code's multi-agent capabilities
4. **Human Oversight**: Autonomous execution with decision checkpoints
5. **Testing in the Loop**: Generate tests, verify, fix errors automatically
6. **Multi-Modal Review**: Comprehensive quality checks from multiple angles
7. **Documentation as Code**: Keep docs in sync automatically

---

### References

- Vision Document: `~/Documents/uby_knowledge_vault/🏞️ spaces/💼 work at JT/areas/Move towards AI/How AI at JT.md`
- Inspiration: [Anthropic feature-dev plugin](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
- Inspiration: [Microsoft Amplifier Vision](https://github.com/microsoft/amplifier/blob/main/AMPLIFIER_VISION.md)
- Inspiration: [Personal AI Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure)
