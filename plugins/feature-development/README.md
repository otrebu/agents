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

**Documentation:** See `@docs/HOW_TO_ARCHITECT_SOLUTIONS.md` for detailed workflow and process

**Key Features:**
- Detects and reuses deep-context-gatherer reports (no redundant analysis)
- Spawns 3-5 parallel sub-agents for diverse solution generation
- Generates comparison matrix with complexity, time, risk, dependencies
- Creates separate detailed plans for each implementation approach

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

**Documentation:** See `@docs/HOW_TO_PLAN_COMMITS.md` for detailed process

**Key Features:**
- Repository-aware tooling detection (package manager, tests, git hooks)
- Atomic commit decomposition (smallest meaningful changes)
- Wave-based parallelization (DAG with dependency tracking)
- Conventional commits enforced (non-negotiable)
- Sub-agent coordination (parallel detailed planning per commit)
- Per-commit implementation plans with pre-commit checklists
- Mermaid dependency graphs for visualization

## Features

### Research & Planning Workflow

1. **Deep Context Gathering** - Use `deep-context-gatherer` to research a topic with web + codebase analysis
2. **High-Level Planning** - Use `high-level-planner` to generate multiple implementation approaches
3. **Commit Planning** - Use `commit-planner` to create atomic commit-level plans with dependency tracking
4. **Choose & Implement** - Review comparison matrix, select best option, and follow commit-by-commit plans

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

# Step 3: Review comparison and choose option
# Open docs/plans/{feature-slug}/COMPARISON.md
# Open docs/plans/{feature-slug}/option-N.md for detailed plan

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
