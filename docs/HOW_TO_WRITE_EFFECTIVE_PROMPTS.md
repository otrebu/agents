# How to Write Effective Prompts for Claude Code

**Purpose:** Universal prompting best practices for Claude Code - applicable to agents, slash commands, CLAUDE.md files, and interactive prompts.

**Based on:** Research from Anthropic's official documentation, Claude Code best practices (2025), and community patterns.

---

## Core Principles

### 1. Use XML Tags for Structure

Claude was trained with XML tags in the training data, making them highly effective for organizing prompts.

**Why it works:** XML provides clear boundaries between different sections, helping Claude understand context and structure.

**Common tags:**
```xml
<role>Define the agent's expertise and perspective</role>
<task>What needs to be accomplished</task>
<context>Background information and constraints</context>
<process>Step-by-step approach</process>
<constraints>Limitations and requirements</constraints>
<example>Concrete examples of expected behavior</example>
<output>Desired format and structure</output>
```

**Example:**
```xml
<role>
You are a senior security auditor specializing in authentication systems.
</role>

<task>
Review the authentication implementation for security vulnerabilities and compliance issues.
</task>

<process>
1. Read the authentication configuration files
2. Check for common vulnerabilities (SQL injection, XSS, CSRF)
3. Validate token management and session handling
4. Review password policies and encryption
5. Generate a prioritized security report
</process>
```

### 2. Be Specific, Not Vague

**❌ Vague:**
- "Be concise"
- "Be thorough"
- "Write good code"
- "Analyze the performance"

**✅ Specific:**
- "Limit response to 2-3 sentences"
- "Include: implementation steps, dependencies, and time estimate"
- "Follow functional programming patterns with pure functions and immutability"
- "Measure API response time (p95) and identify queries >100ms"

**Why it matters:** Claude 4 models are trained for precise instruction following. Specific instructions = predictable, high-quality results.

### 3. Frontload Context for Stateless Agents

**Critical for agents:** Subagents are stateless and cannot ask follow-up questions. Provide ALL necessary context upfront.

**Context checklist:**
- Background/problem statement
- Current state of the system
- Constraints and requirements
- Expected output format
- Success criteria
- Examples (if applicable)

**Example of complete context:**
```markdown
CONTEXT:
- Project: TypeScript monorepo with pnpm workspaces
- Current state: 3 packages, no shared testing utilities
- Problem: Duplicated test helpers across packages
- Constraint: Must maintain existing test structure
- Goal: Create shared test-utils package

YOUR TASK:
Create a test-utils package at packages/test-utils with vitest helpers for:
1. Mock factories for User and Order entities
2. Test database setup/teardown utilities
3. Async testing helpers

OUTPUT:
- package.json with proper dependencies
- src/mocks.ts with factory functions
- src/db.ts with setup/teardown
- src/async.ts with waitFor utilities
- Update root tsconfig.json references
```

### 4. Enable Chain of Thought Reasoning

**Pattern:** Give Claude time to think through responses before producing the final answer.

**Simple trigger:** "Think step by step"

**Advanced pattern:**
```xml
<thinking-instructions>
Before providing your final answer:
1. Break down the problem into components
2. Consider multiple approaches
3. Evaluate trade-offs
4. Identify potential risks
5. Then provide your recommendation with rationale
</thinking-instructions>
```

**Why it works:** Complex reasoning benefits from intermediate steps. Claude's thinking process improves calibration and accuracy.

### 5. Provide Concrete Examples

**Pattern:** Few-shot learning - show Claude what you want rather than just describing it.

**❌ Without examples:**
```markdown
Write conventional commit messages for the changes.
```

**✅ With examples:**
```markdown
Write conventional commit messages following these patterns:

<examples>
feat(auth): add OAuth2 provider support
fix(api): handle null user IDs in session endpoint
docs(readme): update installation instructions
refactor(db): extract query builders to separate module
</examples>
```

**When to use:**
- Output format is specific
- Tone/style matters
- Edge cases need handling
- Domain-specific conventions apply

### 6. Specify Output Format Explicitly

**Don't assume - specify:**
```xml
<output-format>
Generate a JSON report with this exact structure:
{
  "issues": [
    {
      "severity": "high" | "medium" | "low",
      "category": "security" | "performance" | "maintainability",
      "location": "file:line",
      "description": "...",
      "recommendation": "..."
    }
  ],
  "summary": {
    "totalIssues": number,
    "criticalCount": number
  }
}
</output-format>
```

**For markdown:**
```xml
<output-format>
Use this markdown structure:

# Title

## Section 1
- Bullet points for key findings
- Include metrics with units

## Section 2
| Column | Format |
|--------|--------|
| Name   | string |
| Value  | number with units |
</output-format>
```

### 7. Token Efficiency (Critical for Agents)

**Target:** Keep agent prompts under 3k tokens for fast startup and composability.

**Strategies:**
- Remove redundant explanations
- Use concise XML tags
- Leverage `@docs/references.md` instead of repeating context
- Focus on essential instructions only
- Trust Claude's base knowledge (don't over-explain common patterns)

**Example - Verbose (❌):**
```markdown
You need to read files from the filesystem. Files are organized in directories.
You should use the Read tool to read files. After reading, you should analyze
the content carefully. Make sure to understand what the code does before making
changes. Always be careful when modifying code.
```

**Example - Token-efficient (✅):**
```markdown
<process>
1. Read existing files
2. Analyze code structure
3. Apply modifications
4. Validate changes
</process>
```

### 8. Be Explicit About Constraints

**Don't let Claude guess - state constraints clearly:**

```xml
<constraints>
- MUST maintain backward compatibility
- MUST NOT modify files in src/legacy/
- Maximum response time: 200ms (p95)
- Use existing dependencies only (no new npm packages)
- Follow repository coding style (@docs/CODING_STYLE.md)
- All functions must have JSDoc comments
</constraints>
```

**Why:** Constraints prevent incorrect solutions and reduce iteration cycles.

## Agent-Specific Patterns

### Activation Criteria (Description Field)

The `description` field determines when Claude invokes your agent. Make it specific and action-oriented.

**❌ Vague:**
```yaml
description: Helps with code review
```

**✅ Specific with activation triggers:**
```yaml
description: Proactively reviews code for quality, security, and maintainability after code changes. MUST BE USED after writing or modifying code.
```

**Activation keywords:** "proactively", "MUST BE USED", "automatically", "whenever"

### Tool Selection (Minimal Set)

**Principle:** Only include tools actually needed for the task.

**Why:** Reduces token overhead, improves startup time, prevents tool misuse.

**Example:**
```yaml
# ❌ Too many tools
tools: Read, Write, Edit, Glob, Grep, Bash, Task, WebSearch, WebFetch

# ✅ Minimal effective set
tools: Read, Grep, Glob
```

**Common tool combinations:**
- **Read-only analysis:** Read, Grep, Glob
- **File modification:** Read, Edit, Write
- **Code generation:** Read, Write, Glob, Grep
- **Orchestration:** Task, Read, Write
- **Research:** WebSearch, WebFetch, Read, Write

### Model Selection

Match model to task complexity:

- **Haiku:** Simple, repetitive tasks (formatting, linting, basic analysis)
- **Sonnet:** Balanced, general-purpose (most agents use this)
- **Opus:** Complex reasoning, deep analysis, architectural decisions
- **inherit:** Use configured subagent model (recommended default)

```yaml
model: inherit  # Respects user's configuration
```

## Common Anti-Patterns

### ❌ Anti-Pattern 1: Assuming Context

```markdown
# Bad
Review the changes and suggest improvements.
```

**Problem:** What changes? What kind of improvements? What standards?

```markdown
# Good
<context>
Recent commits added OAuth2 authentication to the API.
Current patterns: Express middleware, JWT tokens, Redis sessions.
</context>

<task>
Review authentication implementation for:
- Security vulnerabilities (OWASP Top 10)
- Error handling completeness
- Token expiration logic
- Session management best practices
</task>
```

### ❌ Anti-Pattern 2: Overloading Agents

```markdown
# Bad - Agent tries to do too much
You are responsible for code review, testing, documentation updates,
deployment, monitoring, and security audits.
```

**Problem:** Single agent doing multiple unrelated tasks = poor performance.

**Solution:** Create focused, single-purpose agents that can be chained.

### ❌ Anti-Pattern 3: Ambiguous Success Criteria

```markdown
# Bad
Make the code better.
```

**Problem:** "Better" is subjective and unmeasurable.

```markdown
# Good
<success-criteria>
- Reduce cyclomatic complexity below 10 per function
- Achieve 80%+ test coverage
- Eliminate all ESLint errors
- Add JSDoc comments to public APIs
</success-criteria>
```

### ❌ Anti-Pattern 4: Missing Examples for Complex Formats

```markdown
# Bad
Generate a detailed architectural diagram.
```

**Problem:** Claude doesn't know what format you want.

```markdown
# Good
Generate a markdown architectural diagram like this:

<example>
## System Architecture

┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────▶│   API Layer  │─────▶│  Database   │
│  (React)    │      │  (Express)   │      │ (PostgreSQL)│
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │
       │                     ▼
       │              ┌──────────────┐
       └─────────────▶│    Redis     │
                      │   (Cache)    │
                      └──────────────┘
</example>
```

### ❌ Anti-Pattern 5: Ignoring Token Budget

**Problem:** 10k token agent prompts = slow startup, poor composability.

**Solution:** Aim for <3k tokens. Extract documentation to separate files and reference them with `@docs/file.md`.

## CLAUDE.md Best Practices

Your project's `CLAUDE.md` is the highest-leverage configuration for improving Claude's behavior.

**What belongs in CLAUDE.md:**
- Project-specific coding patterns
- Architectural decisions
- Testing strategies
- Deployment workflows
- File organization conventions
- Common pitfalls to avoid
- Links to important documentation

**What doesn't belong:**
- General programming knowledge
- Tool documentation (Claude knows this)
- Repeated instructions (use agents/commands instead)

**Example structure:**
```markdown
# Project Context

This is a TypeScript monorepo for a SaaS authentication platform.

## Architecture
- Functional programming patterns (no classes except custom errors)
- Pnpm workspaces with project references
- Vitest for testing with parameterized tests for data variance

## Critical Patterns
- All API responses use Result<T, E> type (no throwing errors)
- Database migrations are immutable (never edit existing files)
- Feature flags controlled via LaunchDarkly

## Common Pitfalls
- Don't use `any` type - use `unknown` and type guards
- Don't mutate shared state - return new objects
- Don't skip writing tests (mandatory for all features)

@docs/CODING_STYLE.md
@docs/DEVELOPMENT_WORKFLOW.md
```

## Slash Commands Best Practices

Slash commands should be task-focused wrappers with clear prompts.

**File location:** `.claude/commands/<command-name>.md`

**Structure:**
```markdown
# Command documentation at top (for maintainers)

---

# Actual prompt that gets expanded

<task>
Clear, specific task description
</task>

<process>
1. Step one
2. Step two
3. Step three
</process>

<constraints>
- Constraint 1
- Constraint 2
</constraints>
```

**Example:** `.claude/commands/analyze-security.md`
```markdown
# Analyze Security Command

Performs security audit on the codebase.

---

You are a security auditor analyzing this codebase for vulnerabilities.

<process>
1. Search for common vulnerability patterns (SQL injection, XSS, CSRF, etc.)
2. Review authentication and authorization logic
3. Check for hardcoded secrets or credentials
4. Analyze dependency security (check for known CVEs)
5. Generate prioritized security report
</process>

<output-format>
# Security Audit Report

## Critical Issues
- [Issue with severity, location, and fix recommendation]

## Medium Priority
- [Issue with details]

## Low Priority
- [Issue with details]

## Recommendations
- [Proactive security improvements]
</output-format>
```

## Testing Your Prompts

**Iteration cycle:**
1. Write initial prompt
2. Test with real scenarios
3. Identify failure modes
4. Add specificity/constraints/examples
5. Repeat

**Questions to ask:**
- Does Claude understand the task without clarification?
- Are outputs consistent across multiple runs?
- Are edge cases handled correctly?
- Is the prompt token-efficient?
- Would this work for someone else's codebase?

**Common fixes:**
- Add examples for ambiguous cases
- Specify output format explicitly
- Include constraints that were assumed
- Break complex tasks into steps
- Frontload context that was missing

## Real-World Example: Before and After

### ❌ Before (Vague, Context-Light)
```markdown
Review the code and make improvements. Focus on quality.
```

### ✅ After (Specific, Context-Rich)
```markdown
<role>
You are a senior code reviewer specializing in TypeScript and functional programming.
</role>

<context>
Repository: TypeScript monorepo with pnpm workspaces
Coding style: Functional programming, no classes (except custom errors)
Current task: Review authentication module changes
</context>

<task>
Review recent changes to src/auth/ for:
1. Type safety (no `any` types, proper error handling)
2. Functional patterns (pure functions, immutability)
3. Security (token handling, session management)
4. Test coverage (parameterized tests for edge cases)
</task>

<process>
1. Run git diff to see recent changes
2. Read modified files in src/auth/
3. Check for anti-patterns from @docs/CODING_STYLE.md
4. Verify tests exist for new functionality
5. Generate prioritized feedback report
</process>

<output-format>
# Code Review: Authentication Module

## Critical Issues (Must Fix)
- [Issue with location, explanation, fix recommendation]

## Suggestions (Should Consider)
- [Improvement with rationale]

## Positive Observations
- [What was done well]

## Test Coverage
- [Coverage analysis and gaps]
</output-format>

<constraints>
- Follow @docs/CODING_STYLE.md patterns
- Must not suggest changes that break existing APIs
- Security issues are always critical priority
</constraints>
```

## Summary: The Checklist

Before finalizing any prompt (agent, command, or interactive), verify:

- [ ] Clear role/purpose defined
- [ ] Complete context provided (no assumptions)
- [ ] Specific, measurable instructions (not vague adjectives)
- [ ] Process broken into numbered steps
- [ ] Explicit output format specified
- [ ] Constraints and requirements listed
- [ ] Examples provided for complex patterns
- [ ] XML tags used for structure
- [ ] Token budget <3k (for agents)
- [ ] Success criteria defined

**Remember:** Prompting is an iterative process. Test, observe failures, add specificity, repeat.

---

**Next Steps:**
- Apply these patterns to your agents (@plugins/*/agents/*.md)
- Reference this doc in your agents: `@docs/HOW_TO_WRITE_EFFECTIVE_PROMPTS.md`
- Update CLAUDE.md with project-specific patterns
- Create focused slash commands for repeated workflows
