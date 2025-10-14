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

### solution-architect
Orchestrates parallel generation of 3-5 diverse implementation approaches with trade-off analysis.

**Usage:**
```
@feature-development:solution-architect design solutions for {feature}
# With deep-context-gatherer report:
@feature-development:solution-architect design solutions using docs/reports/{topic}.md
```

**Tools:** Read, Grep, Glob, Bash, Write, Task

**Output:** `docs/plans/{feature-slug}/COMPARISON.md` + individual option files

**Documentation:** See `@docs/HOW_TO_ARCHITECT_SOLUTIONS.md` for detailed workflow and process

**Key Features:**
- Detects and reuses deep-context-gatherer reports (no redundant analysis)
- Spawns 3-5 parallel sub-agents for diverse solution generation
- Generates comparison matrix with complexity, time, risk, dependencies
- Creates separate detailed plans for each implementation approach

## Features

### Research & Planning Workflow

1. **Deep Context Gathering** - Use `deep-context-gatherer` to research a topic with web + codebase analysis
2. **Solution Architecture** - Use `solution-architect` to generate multiple implementation approaches
3. **Choose & Implement** - Review comparison matrix and select best option for your constraints

### Parallel Processing

All agents use parallel execution where possible:
- `deep-research`: Parallel web searches
- `deep-context-gatherer`: Parallel web searches across phases
- `solution-architect`: Parallel sub-agent spawning for solution generation

## Usage

### Example: Feature Development Workflow

```bash
# Step 1: Gather context about state management
@feature-development:deep-context-gatherer gather context for React state management with XState

# Step 2: Generate implementation options
@feature-development:solution-architect design solutions using docs/reports/react-state-management-with-xstate.md

# Step 3: Review comparison and choose option
# Open docs/plans/{feature-slug}/COMPARISON.md
# Open docs/plans/{feature-slug}/option-N.md for detailed plan

# Step 4: Implement chosen solution
# Follow implementation steps from selected option
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
