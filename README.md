# My Claude Memory


🥚
A centralized configuration repository for Claude Code featuring:
- 🎯 **Specialized skills** for code review, ESLint fixing, git workflows, brainstorming, and more
- 🔌 **Plugin marketplace** with modular extensions (codebase explorer, meta-work, feature development)
- 🔧 **Meta-work tools** to create new commands, agents, docs, and plugins following DRY principles
- 📚 **Personal coding standards** (FP-first style, development workflow, tech stack preferences)
- 🎤 **Custom hooks** for enhanced functionality (TTS readback, audio notifications)
- 🔗 **Symlink-based setup** for easy sharing across projects

All configuration can be linked to your global Claude config (`~/.claude`) or individual project `.claude` folders.

## Repository Structure

```
.
├── .claude/                      # Example .claude folder (symlinked)
│   ├── agents/                  -> ../agents
│   ├── commands/                -> ../commands
│   ├── skills/                  -> ../skills
│   └── settings.json            -> ../settings.json
├── .claude-plugin/               # Plugin marketplace definition
│   └── marketplace.json         # Marketplace configuration
├── plugins/                      # Plugin directory
│   ├── meta-work/               # Meta-work plugin (command creation, etc.)
│   │   ├── .claude-plugin/      # Plugin manifest
│   │   ├── commands/            # Plugin commands
│   │   ├── skills/              # Plugin-scoped skills
│   │   │   ├── prompting/       # Prompt engineering standards
│   │   │   └── skill-creator/   # Skill creation guide
│   │   └── README.md            # Plugin documentation
│   └── development-lifecycle/   # Development lifecycle plugin
│       ├── .claude-plugin/      # Plugin manifest
│       ├── commands/            # Plugin commands
│       ├── agents/              # Plugin agents
│       └── README.md            # Plugin documentation
├── skills/                       # Core reusable skill modules (12 total)
│   ├── analyze-size/
│   ├── brainwriting/
│   ├── claude-permissions/
│   ├── code-review/
│   ├── finish-feature/
│   ├── fix-eslint/
│   ├── git-commit/
│   ├── scratchpad-fetch/
│   ├── start-feature/
│   ├── timestamp/
│   └── typescript-coding/
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

### Core Skills (`.claude/skills`)
Modular packages providing specialized workflows and domain expertise (12 total):
- **analyze-size** - Analyze codebase size and language distribution using cloc
- **brainwriting** - Structured brainstorming using parallel sub-agents (5 rounds of parallel exploration)
- **claude-permissions** - Configure and manage permissions, sandboxing, and tool access
- **code-review** - Expert code review with automated pre-review checks and auto-fix capabilities
- **finish-feature** - Complete feature work and merge back to main branch
- **fix-eslint** - Auto-fix ESLint errors (direct for ≤20, parallel agents for >20)
- **git-commit** - Create conventional commits from git diff analysis
- **scratchpad-fetch** - Download and aggregate web pages/docs into timestamped files
- **start-feature** - Create/switch to feature branches with proper naming
- **timestamp** - Generate deterministic timestamps (YYYYMMDDHHMMSS format)
- **typescript-coding** - Expert TS/JS guidance (stack, tooling, testing, logging patterns)

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
- **Plugin-scoped Skills**:
  - `prompting` - Prompt engineering standards (Anthropic best practices, clarity, structure)
  - `skill-creator` - Guide for creating effective skills with specialized knowledge/workflows
- Atomic command design (each command does one thing well)
- Supports inline instructions or shared documentation patterns
- Validates structure and prevents conflicts
- Plugin-scoped support for organizing by domain

**Usage**: Install plugin → `/create-command <description>` or `Skill(meta-work:prompting)`

#### Development Lifecycle (`plugins/development-lifecycle/`)
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
- `@development-lifecycle:deep-context-gatherer gather context for {topic}`
- `@development-lifecycle:high-level-planner design solutions using docs/reports/{topic}.md`
- `@development-lifecycle:commit-planner plan commits using docs/plans/{feature}/option-1.md`
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
