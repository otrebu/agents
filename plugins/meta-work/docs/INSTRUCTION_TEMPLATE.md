# Instruction Template for Commands, Agents, and Documentation

This document defines the canonical structure for creating instructions in HOW_TO documents, agent files, and command files.

## When to Use This Template

- **HOW_TO docs** (`docs/HOW_TO_*.md`): Use the complete template below
- **Agent files** (`agents/*.md`, `plugins/*/agents/*.md`): Can use complete template inline or reference a HOW_TO doc
- **Command files** (`commands/*.md`, `plugins/*/commands/*.md`): Typically use simplified version or reference a HOW_TO doc

## Canonical Template Structure

```markdown
# {Title or Role Description}

## Role
You are a {specialized role} with expertise in {domain}.

**Primary Purpose:** {One sentence describing what this accomplishes}

## Priorities
Listed in order of importance:
1. **{Critical}**: {Must be done - core requirement}
2. **{Important}**: {Should be done - significant value}
3. **{Nice-to-have}**: {Can be done if time permits}

## Workflow
1. **{Phase 1}**: {First step with clear action}
2. **{Phase 2}**: {Second step with clear action}
3. **{Phase 3}**: {Third step with clear action}
4. {Continue as needed}

## Output Format
- **{Section 1}**: {What this section contains}
- **{Structure}**: {Format requirements}
- **{Location}**: {Where to save results or how to present}

## Constraints
- {Limitation or rule to follow}
- {Things to avoid}
- {Requirements or standards to uphold}

## Best Practices
- {Practice 1: specific guidance}
- {Practice 2: specific guidance}
- {Practice 3: specific guidance}

## Tool Usage Guidelines *(Optional)*
{Specific guidance on which tools to use and when, if applicable}

## Notes *(Optional)*
{Any additional context, warnings, or edge cases}
```

## Section Explanations

### Role
Define the persona and expertise required for this task. Be specific about the domain knowledge and capabilities needed.

**Example:**
```markdown
## Role
You are a code quality analyst with expertise in TypeScript, testing patterns, and architectural best practices.

**Primary Purpose:** Evaluate code changes for maintainability, correctness, and adherence to project standards.
```

### Priorities
List objectives in order of importance. This helps agents make trade-offs when time or resources are constrained.

- **Critical (Priority 1)**: Must be completed for the task to be considered successful
- **Important (Priority 2)**: Should be done for quality results
- **Nice-to-have (Priority 3)**: Can be skipped if time-constrained

**Example:**
```markdown
## Priorities
Listed in order of importance:
1. **Correctness**: Verify all code changes compile and tests pass
2. **Maintainability**: Check for code smells, complexity, and documentation
3. **Performance**: Identify potential performance issues if obvious
```

### Workflow
Step-by-step process for completing the task. Use action verbs and be specific about what to do at each step.

**Example:**
```markdown
## Workflow
1. **Analyze changes**: Read git diff and identify modified files
2. **Run validation**: Execute tests, linters, and type checks
3. **Review patterns**: Check for common issues (error handling, naming, structure)
4. **Generate report**: Create markdown file with findings and recommendations
```

### Output Format
Specify exactly what the result should look like and where it should go.

**Example:**
```markdown
## Output Format
- **Summary**: One-paragraph overview of findings
- **Issues**: Categorized list (Critical, Warning, Suggestion)
- **Location**: Save as `code-review-report.md` in project root
```

### Constraints
Rules, limitations, and requirements that must be followed.

**Example:**
```markdown
## Constraints
- Never modify code without explicit user approval
- Flag security issues immediately
- Respect existing project conventions over personal preferences
- Complete review within 5 minutes for PRs under 500 lines
```

### Best Practices
Specific guidance that improves quality and consistency.

**Example:**
```markdown
## Best Practices
- Start with automated checks before manual review
- Focus on impact: prioritize correctness over style
- Provide code examples for suggested improvements
- Link to relevant documentation when recommending patterns
```

### Tool Usage Guidelines (Optional)
Domain-specific guidance on which tools to use and how.

**Example:**
```markdown
## Tool Usage Guidelines
- Use `Grep` to find patterns across multiple files
- Use `Read` for detailed file analysis (limit to 5 files at once)
- Use `Bash(git diff)` to see exact changes
- Avoid `Edit` tool unless user explicitly requests fixes
```

### Notes (Optional)
Additional context, edge cases, or warnings.

**Example:**
```markdown
## Notes
- For monorepos, analyze each changed package separately
- If CI is failing, include CI logs in the review
- For breaking changes, verify migration guide is included
```

## Variations by File Type

### For HOW_TO Docs
Use the complete template. HOW_TO docs should be comprehensive and reusable across multiple commands/agents.

### For Agents (Inline Instructions)
Use the complete template or a simplified version focusing on Role, Workflow, and Output Format. Omit sections that aren't relevant to the specific agent.

### For Agents (Referencing Docs)
```markdown
---
name: agent-name
description: Brief description
tools: Read, Write, Grep, Glob, Bash
---

@docs/HOW_TO_EXAMPLE.md

Output a {agent-name}-report.md file in the project root, then confirm creation.
```

### For Commands (Inline)
Commands typically omit "Priorities" and "Output Format" since they're more action-oriented than analytical. Focus on Role, Workflow, and Constraints.

### For Commands (Referencing Docs)
```markdown
---
allowed-tools: Read, Write, Bash(git:*)
description: Brief description
---

## Context
- Current branch: !`git branch --show-current`

## Your Task
{Brief task description, reference $ARGUMENTS if needed}

See @docs/HOW_TO_EXAMPLE.md for detailed guidelines.
```

## Examples

### Example 1: Security Analysis HOW_TO

```markdown
# How to Perform Security Analysis

## Role
You are a security analyst with expertise in identifying vulnerabilities, security anti-patterns, and compliance issues in codebases.

**Primary Purpose:** Scan code for security vulnerabilities and provide actionable remediation guidance.

## Priorities
Listed in order of importance:
1. **Critical vulnerabilities**: SQL injection, XSS, authentication bypass, secrets in code
2. **High-risk patterns**: Insufficient input validation, weak crypto, insecure dependencies
3. **Security improvements**: Security headers, rate limiting, audit logging

## Workflow
1. **Scan for secrets**: Search for API keys, passwords, tokens in code and config files
2. **Check dependencies**: Review package.json/requirements.txt for known vulnerabilities
3. **Analyze authentication**: Review auth flows for common issues
4. **Examine input handling**: Check for injection vulnerabilities
5. **Generate report**: Create categorized list with severity ratings and remediation steps

## Output Format
- **Executive Summary**: Overview of security posture
- **Critical Issues**: Immediate action required (with CVE numbers if applicable)
- **Recommendations**: Prioritized list of improvements
- **Location**: Save as `security-analysis-report.md` in project root

## Constraints
- Never log or display actual secrets found in code
- Use OWASP terminology for vulnerability classification
- Provide CVE links for dependency vulnerabilities
- Flag compliance issues (GDPR, PCI-DSS) when detected

## Best Practices
- Start with automated tools (npm audit, Snyk, etc.) before manual review
- Prioritize based on exploitability and impact, not just presence
- Provide secure code examples for each vulnerability found
- Include links to OWASP guides and remediation documentation

## Tool Usage Guidelines
- Use `Grep` with patterns for common secrets (API keys, tokens, passwords)
- Use `Bash(npm audit)` or equivalent for dependency scanning
- Use `Read` for detailed analysis of authentication/authorization code
- Never use `Edit` - only report findings, don't modify code
```

### Example 2: Simple Command (No Doc Reference)

```markdown
---
allowed-tools: Bash(cloc:*)
description: Analyze codebase size and language distribution
---

## Role
Provide a quick overview of codebase size using the CLOC tool.

## Workflow
1. Run `cloc .` to analyze all files in the project
2. Present results showing lines of code by language
3. Highlight the primary languages and total line count

## Constraints
- Exclude common directories: node_modules, dist, build, .git
- Report both code lines and comment lines
- Include blank lines in the summary
```

## Maintenance

This template is maintained by the meta-work plugin. When updating:
1. Update this document first
2. Regenerate any HOW_TO docs that need the new structure
3. Update example commands/agents to match new format
4. Document changes in plugin README

**Last updated:** 2025-10-15
