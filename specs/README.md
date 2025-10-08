# Feature Specifications

This directory contains feature specifications used for parallel worktree experimentation.

## Purpose

When using the parallel worktree workflow (`/parallel-init` and `/parallel-exec`), you create detailed feature specs here that multiple Claude Code sessions can implement independently.

## How to Use

1. **Copy the template:**
   ```bash
   cp specs/TEMPLATE.md specs/your-feature-name.md
   ```

2. **Fill in the spec:**
   - Be specific about requirements and acceptance criteria
   - Define clear constraints and success metrics
   - Provide enough detail for independent implementation

3. **Run parallel experiments:**
   ```bash
   /parallel-init your-feature-name 3
   ```

4. **Reference spec in each worktree:**
   ```bash
   cd trees/your-feature-name-1
   /parallel-exec specs/your-feature-name.md 1
   ```

## What Makes a Good Spec?

**✅ Good specs are:**
- **Specific** - Clear, measurable requirements
- **Complete** - All necessary context included
- **Testable** - Clear acceptance criteria
- **Constrained** - Explicit limits and trade-offs
- **Independent** - Can be implemented without clarification

**❌ Avoid:**
- Vague requirements ("make it better")
- Missing acceptance criteria
- Ambiguous constraints
- Assumptions about implementation details
- Lack of success metrics

## Example Specs

See `TEMPLATE.md` for a comprehensive template with all recommended sections.

## Git Tracking

By default, this directory is ignored in `.gitignore`. If you want to track specs in version control, uncomment the `# specs/` line in `.gitignore`.

**When to track specs:**
- Specs are long-lived and reusable
- Specs document important architectural decisions
- Team collaboration on spec development

**When to ignore specs:**
- One-off experiments
- Personal exploration
- Specs contain sensitive information

## Related Documentation

- `docs/HOW_TO_PARALLEL_WORKTREE.md` - Complete parallel worktree workflow
- `.claude/commands/parallel-init.md` - Init command documentation
- `.claude/commands/parallel-exec.md` - Exec command documentation
