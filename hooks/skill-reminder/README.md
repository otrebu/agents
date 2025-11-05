# Skill Reminder Hook

TypeScript hook that suggests relevant skills based on user prompts in Claude Code.

## How It Works

When you submit a prompt to Claude, this hook:
1. Analyzes your prompt for keywords and patterns
2. Matches against configured skill triggers
3. Outputs suggestions in two ways:
   - **User-visible**: stderr messages showing available skills
   - **Claude context**: JSON injection so Claude knows about relevant skills

## Architecture

### Files

- **`prompt-hook.ts`**: Main hook execution (reads stdin, matches patterns, outputs suggestions)
- **`skill-triggers.ts`**: Skill rule configuration (patterns + skill names)
- **`prompt-hook.test.ts`**: Comprehensive test suite
- **`package.json`**: Dependencies and scripts
- **`tsconfig.json`**: TypeScript configuration

### Design Pattern

Uses **functional composition** pattern:
- Pure data-driven configuration
- Composable matcher function
- Supports both string and regex patterns
- Priority-based ordering

## Adding New Skill Triggers

### 1. Edit `skill-triggers.ts`

Add a new rule to the `SKILL_RULES` array:

```typescript
{
  patterns: [
    'keyword',              // String: substring match
    /regex.*pattern/,       // RegExp: full regex match
    /another.*trigger/,
  ],
  skill: 'plugin-name:skill-name',
  priority: 5,  // Lower = higher priority
}
```

### 2. Add Tests

Update `prompt-hook.test.ts` with test cases:

```typescript
describe('Your skill category', () => {
  it('should match your pattern', () => {
    const skills = matchSkills('User prompt with keyword');
    expect(skills).toContain('plugin-name:skill-name');
  });
});
```

### 3. Run Tests

```bash
cd hooks/skill-reminder
pnpm test
```

## Development

### Install Dependencies

```bash
pnpm install
```

### Run Tests

```bash
pnpm test          # Run once
pnpm test:watch    # Watch mode
```

### Test Hook Manually

```bash
echo '{"prompt":"commit my changes"}' | tsx prompt-hook.ts
```

Expected output:
- stderr: `💡 Skill available: development-lifecycle:git-commit`
- stdout: JSON with `additionalContext`

## Pattern Matching

### String Patterns

Case-insensitive substring matching:
```typescript
patterns: ['commit', 'push']
// Matches: "commit", "COMMIT", "let's commit this"
```

### RegExp Patterns

Case-insensitive regex matching:
```typescript
patterns: [/commit.*work/, /stage.*these/]
// Matches: "commit this work", "stage these files"
```

### Multiple Matches

When multiple skills match, all are returned in priority order:
```typescript
"Create feature and commit it"
// Returns:
// 1. development-lifecycle:start-feature (priority 3)
// 2. development-lifecycle:git-commit (priority 1)
```

## Hybrid Output Strategy

### User Output (stderr)
```
💡 Skill available: development-lifecycle:git-commit
```

### Claude Context (stdout JSON)
```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "[System: Skills available: development-lifecycle:git-commit]"
  }
}
```

Why hybrid?
- stderr is visible to users during execution
- stdout JSON doesn't interfere with terminal output
- Claude receives context injection for better awareness

## Current Skill Triggers

| Pattern | Skill |
|---------|-------|
| commit, push, stage | `development-lifecycle:git-commit` |
| eslint, lint error | `development-lifecycle:fix-eslint` |
| start feature | `development-lifecycle:start-feature` |
| finish feature | `development-lifecycle:finish-feature` |
| review code | `development-lifecycle:code-review` |
| what did i work | `development-lifecycle:dev-work-summary` |
| create skill | `meta-work:skill-creator` |
| create plugin | `meta-work:plugin-creator` |
| permission, sandbox | `meta-work:claude-permissions` |
| typescript project, setup typescript | `typescript-coding:typescript-coding` |

## Troubleshooting

### Hook not triggering?

1. Check `.claude/settings.json` has correct command:
   ```json
   "command": "\"$CLAUDE_PROJECT_DIR\"/hooks/skill-reminder/node_modules/.bin/tsx \"$CLAUDE_PROJECT_DIR\"/hooks/skill-reminder/prompt-hook.ts"
   ```

2. Verify dependencies are installed:
   ```bash
   cd hooks/skill-reminder && pnpm install
   ```

3. Test manually with echo:
   ```bash
   echo '{"prompt":"test commit"}' | tsx prompt-hook.ts
   ```

### Tests failing?

- Ensure all imports use `.js` extension (ESM requirement)
- Check TypeScript version compatibility
- Verify vitest is installed

### No output shown?

- Hook outputs to stderr (user) and stdout (JSON)
- Check your terminal captures both streams
- Verify pattern matching in tests

## Migration from Bash

Previously, this hook was implemented as `prompt-hook.sh`. The TypeScript version:

**Improvements:**
- Type safety with SDK types
- Support for regex patterns (not just strings)
- Multiple skill suggestions (bash only showed one)
- Comprehensive test coverage
- Easier to extend and maintain

**Breaking changes:**
- None - behavior is identical to bash version, just more powerful
