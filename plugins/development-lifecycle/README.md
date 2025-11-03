# Feature Development

Software feature development tools with agents and commands for effective delivery

## Installation

This plugin is part of the otrebu-dev-tools marketplace.

```bash
# Plugin is automatically loaded from marketplace
# Check status
claude --help | grep feature-development
```

## Commands

Currently no commands defined. Add command files to `commands/` directory.

## Agents

### deep-research
Run parallel web searches on a topic and compile findings into an optional report.

**Usage:**
```
@feature-development:deep-research research {topic}
```

**Tools:** WebSearch, Write, Read

### deep-context-gatherer
Multi-phase research agent combining parallel web searches with local codebase analysis.

**Usage:**
```
@feature-development:deep-context-gatherer gather context for {topic}
```

**Tools:** Read, Grep, Glob, Bash, WebSearch, Write

**Output:** `docs/reports/{topic}.md`

### high-level-planner
Orchestrates parallel generation of 3-5 diverse implementation approaches with trade-off analysis and acceptance criteria.

**Usage:**
```
@feature-development:high-level-planner design solutions for {feature}
# With deep-context-gatherer report:
@feature-development:high-level-planner design solutions using docs/reports/{topic}.md
```

**Tools:** Read, Grep, Glob, Bash, Write, Task

**Output:** `docs/plans/{feature-slug}/COMPARISON.md` + individual option files

**Documentation:** See `@docs/HOW_TO_DO_HIGH_LEVEL_PLANNING.md` for detailed workflow and process

**Key Features:**
- Detects and reuses deep-context-gatherer reports (no redundant analysis)
- Spawns 3-5 parallel sub-agents for diverse solution generation
- Generates comparison matrix with complexity, time, risk, dependencies
- Creates separate detailed plans for each implementation approach

### plan-refiner
Refines existing high-level implementation plans based on user feedback, generating variants and hybrids while maintaining structure and updating trade-off analysis.

**Usage:**
```
# Single refinement
@feature-development:plan-refiner refine docs/plans/{feature-slug}/option-2.md to use Redis instead of PostgreSQL

# Generate variants
@feature-development:plan-refiner show me 3 caching strategies for docs/plans/{feature-slug}/option-1.md

# Create hybrid
@feature-development:plan-refiner combine auth from option-1.md with data layer from option-3.md in docs/plans/{feature-slug}/
```

**Tools:** Read, Write, Edit, Glob, Grep

**Output:** Versioned plan files (e.g., `option-2-redis.md`, `option-1-v2.md`, `option-hybrid-*.md`)

**Documentation:** References `@docs/HOW_TO_WRITE_EFFECTIVE_PROMPTS.md` for prompting best practices

**Key Features:**
- Applies specific modifications to existing plans (technology swaps, scope changes)
- Generates multiple variants from a single base plan
- Creates hybrids by combining elements from different options
- Maintains original plan structure and detail level
- Updates trade-off analysis, complexity, and time estimates
- Preserves original files, creates new versioned outputs

**Common Use Cases:**
- "Use X instead of Y" - Technology substitutions
- "Reduce to MVP scope" - Scope adjustments
- "Show me N variants with different {aspect}" - Exploration
- "Combine {aspect} from option X with {aspect} from option Y" - Hybrid approaches

### commit-planner
Transforms high-level plans into atomic commit-level implementations with dependency tracking.

**Usage:**
```
@feature-development:commit-planner plan commits for {feature}
# With high-level-planner plan:
@feature-development:commit-planner plan commits using docs/plans/{feature-slug}/option-N.md
```

**Tools:** Read, Grep, Glob, Bash, Write, Task

**Output:** `docs/implementation/{feature-slug}/00-overview.md` + individual commit files

**Key Features:**
- Repository-aware tooling detection (package manager, tests, git hooks)
- Atomic commit decomposition (smallest meaningful changes)
- Wave-based parallelization (DAG with dependency tracking)
- Conventional commits enforced (non-negotiable)
- Sub-agent coordination (parallel detailed planning per commit)
- Per-commit implementation plans with pre-commit checklists
- Mermaid dependency graphs for visualization

## Skills

### `git-commit`

Create git commits following conventional commits format.

**Use when:** User asks to commit, git commit, commit changes, or create a commit

**Process:**
- Gathers context (git status, diff, branch, recent log)
- Analyzes changes to determine type, scope, description
- Stages relevant files (NEVER stages secrets/credentials)
- Creates atomic commit with conventional format
- Optional: pushes to remote if requested

**Conventional Commit Types:** feat, fix, refactor, docs, test, chore

**Tools:** Bash(git add, status, commit, diff, log, branch, push)

**See:** `plugins/development-lifecycle/skills/SKILL.md`

---

### `start-feature`

Create or switch to feature branches with proper naming conventions.

**Use when:** User wants to start working on a new feature

**Process:**
- Generates `feature/<slug>` branch names from descriptions
- Checks branch existence
- Creates or switches accordingly
- Validates git status before operations

**Tools:** Bash(git status, branch, checkout)

**See:** `plugins/development-lifecycle/skills/start-feature/SKILL.md`

---

### `finish-feature`

Complete feature work and merge back to main branch.

**Use when:** User wants to finish a feature, close a feature, or merge feature branch

**Process:**
- Verifies working directory status
- Switches to main branch
- Pulls latest changes
- Merges feature branch
- Pushes to remote
- Optional: deletes feature branch

**Tools:** Bash(git add, status, commit, diff, log, branch, push, pull, merge, checkout, stash, tag)

**See:** `plugins/development-lifecycle/skills/finish-feature/SKILL.md`

---

### `code-review`

Expert code review with automated pre-review checks.

**Use when:** Immediately after writing/modifying code, or when user requests code review

**Process:**
- Gathers code (uncommitted changes or specific files)
- Runs pre-review checks (tests, linting, formatting via scripts/pre-review.sh)
- Auto-fixes lint/format/test failures (delegates to fix-eslint skill)
- Executes thorough code review following methodology.md
- Reviews for critical issues, functional gaps, requirements alignment
- Optional: saves review to docs/CODE_REVIEW.md

**Tools:** Read, Write, Grep, Glob, Bash(git, pnpm), Task, TodoWrite

**See:** `plugins/development-lifecycle/skills/code-review/SKILL.md`

---

### `fix-eslint`

Automatically fix ESLint errors by modifying code to comply with linting rules.

**Use when:** Linting errors exist and need automated fixing

**Strategy:**
- ≤20 errors: Direct fix
- >20 errors: Spawns parallel agents per directory

**Priorities:**
- Never bypass rules (no eslint-disable comments)
- Fix code to comply with standards
- Preserve functionality

**Tools:** Read, Write, Edit, Grep, Glob, Bash, Task, TodoWrite

**See:** `plugins/development-lifecycle/skills/fix-eslint/SKILL.md`

---

## Features

### Research & Planning Workflow

1. **Deep Context Gathering** - Use `deep-context-gatherer` to research a topic with web + codebase analysis
2. **High-Level Planning** - Use `high-level-planner` to generate multiple implementation approaches
3. **Review & Refine** (Optional) - Use `plan-refiner` to iterate on options, generate variants, or create hybrids
4. **Commit Planning** - Use `commit-planner` to create atomic commit-level plans with dependency tracking
5. **Choose & Implement** - Review comparison matrix, select best option, and follow commit-by-commit plans

### Parallel Processing

All agents use parallel execution where possible:
- `deep-research`: Parallel web searches
- `deep-context-gatherer`: Parallel web searches across phases
- `high-level-planner`: Parallel sub-agent spawning for solution generation
- `commit-planner`: Parallel sub-agent spawning for per-commit detailed planning

## Usage

### Example: Feature Development Workflow

```bash
# Step 1: Gather context about state management
@feature-development:deep-context-gatherer gather context for React state management with XState

# Step 2: Generate implementation options
@feature-development:high-level-planner design solutions using docs/reports/react-state-management-with-xstate.md

# Step 3: Review comparison
# Open docs/plans/{feature-slug}/COMPARISON.md
# Open docs/plans/{feature-slug}/option-N.md for detailed plan

# Step 3.5 (Optional): Refine or create variants
@feature-development:plan-refiner refine docs/plans/{feature-slug}/option-2.md to use Redis instead of PostgreSQL
# OR generate variants:
@feature-development:plan-refiner show me 3 authentication strategies for docs/plans/{feature-slug}/option-1.md

# Step 4: Create commit-level implementation plan
@feature-development:commit-planner plan commits using docs/plans/{feature-slug}/option-1.md

# Step 5: Review commit plan and implement
# Open docs/implementation/{feature-slug}/00-overview.md
# Review dependency graph and wave structure
# Follow commit plans starting with Wave 1
```

## Development

To add commands:
```bash
# Create command files in commands/ directory
touch commands/example.md
```

To add agents:
```bash
# Create agents directory and agent files
mkdir -p agents
touch agents/example.md
```

## License

MIT
