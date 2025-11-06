# Development Lifecycle

Software development lifecycle tools with agents, commands, and skills for effective delivery

## Installation

This plugin is part of the otrebu-dev-tools marketplace.

```bash
# Plugin is automatically loaded from marketplace
# Check status
claude --help | grep development-lifecycle
```

## Commands

### `/execute-implementation`

Orchestrate wave-based execution of implementation plans with parallel commit-executor agents.

**Usage:**
```
/development-lifecycle:execute-implementation <path-or-description>
```

**Tools:** Read, Grep, Glob, Bash, Write, Task

**See:** `plugins/development-lifecycle/commands/execute-implementation.md`

## Agents

### deep-research
Run parallel web searches on a topic and compile findings into an optional report.

**Usage:**
```
@development-lifecycle:deep-research research {topic}
```

**Tools:** WebSearch, Write, Read

### deep-context-gatherer
Multi-phase research agent combining parallel web searches with local codebase analysis.

**Usage:**
```
@development-lifecycle:deep-context-gatherer gather context for {topic}
```

**Tools:** Read, Grep, Glob, Bash, WebSearch, Write

**Output:** `docs/reports/{topic}.md`

## Skills

### `analyze-size`

Analyze codebase size and language distribution using cloc.

**Use when:** Starting work on new repos to assess scale, composition, and complexity

**Process:**
- Runs cloc analysis on codebase
- Calculates total LOC (lines of code)
- Determines size category (tiny/small/medium/large/huge)
- Breaks down language distribution by percentage
- Provides insights on primary languages and codebase composition

**Output:**
- Total lines of code
- Size category
- Language breakdown (percentages)
- Key insights about project complexity

**Tools:** Bash(cloc)

**See:** `plugins/development-lifecycle/skills/analyze-size/SKILL.md`

---

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

### `dev-work-summary`

Scan ~/dev recursively for git repos and report today's work.

**Use when:** User asks "what did I work on", "show my work", "daily summary", "what repos did I touch"

**Process:**
- Scans all git repos in ~/dev recursively
- Reports today's activity (since midnight)
- Shows commits, branches, uncommitted changes
- Analyzes file changes (added/modified/deleted)
- Provides aggregated stats

**Output:**
- Repo name and location
- Current branch
- Uncommitted changes
- Commit messages with timestamps
- File-level change summary

**Tools:** Bash(git log, status, diff-tree, ls-files, find)

**See:** `plugins/development-lifecycle/skills/dev-work-summary/SKILL.md`

---

## Features

### Development Lifecycle Workflow

The recommended workflow for feature development using skills:

1. **Analyze** - Use `analyze-size` to assess codebase scale and composition (especially for new repos)
2. **Branch** - Use `start-feature` to create/switch to feature branch
3. **Code** - Implement your feature
4. **Review** - Use `code-review` to validate changes
5. **Commit** - Use `git-commit` to create conventional commits
6. **Finish** - Use `finish-feature` to merge back to main

### Research Workflow

1. **Deep Research** - Use `deep-research` to run parallel web searches on a topic
2. **Deep Context Gathering** - Use `deep-context-gatherer` to research with both web + codebase analysis

### Parallel Processing

Agents use parallel execution where possible:
- `deep-research`: Parallel web searches
- `deep-context-gatherer`: Parallel web searches across phases

## Usage

### Example: Feature Development Workflow

```bash
# Step 1: Analyze codebase (for new repos)
analyze-size

# Step 2: Create feature branch
start-feature "add user authentication"

# Step 3: Implement your feature
# ... code here ...

# Step 4: Review your work
code-review

# Step 5: Commit changes
git-commit

# Step 6: Merge back to main
finish-feature
```

### Example: Research Workflow

```bash
# Gather context about a topic
@development-lifecycle:deep-context-gatherer gather context for React state management with XState

# Or just web research
@development-lifecycle:deep-research research authentication best practices 2025

# Review results
# Open docs/reports/{topic}.md
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
