# Basic Skills Plugin

**Version:** 1.0.0
**Purpose:** Foundational utilities used across other skills

This plugin provides simple, reusable helper utilities that can be leveraged by other skills and workflows. These are low-level building blocks that solve common problems.

---

## Skills

### timestamp

**Description:** Generate deterministic timestamps in `YYYYMMDDHHMMSS` format using bash.

**When to use:** When you need timestamps for filenames, logging, or any situation requiring consistent timestamp formatting without LLM generation.

**How it works:** Executes a shell script that generates a deterministic timestamp using system time.

**Dependencies:**
- Shell script: `scripts/generate_timestamp.sh`

**Usage:**
```bash
claude skill basic-skills:timestamp
```

**Output format:** `20251105143025` (Year-Month-Day-Hour-Minute-Second)

---

## Installation

This plugin is designed to be referenced via absolute path in your project's `.claude/settings.json`:

```json
{
  "plugins": [
    "/Users/Uberto.Rapizzi/dev/agents/plugins/basic-skills"
  ]
}
```

---

## Future Utilities

This plugin is designed to grow with additional foundational utilities:

- **Path helpers** - Normalize paths, resolve relative paths
- **String utilities** - Slugify, sanitize filenames
- **File helpers** - Check existence, get file info
- **Data formatters** - JSON/YAML conversion, prettification

Keep utilities small, focused, and reusable. If a utility grows complex, consider graduating it to its own plugin.

---

## Philosophy

Basic Skills follows the Unix philosophy: do one thing well, be composable. Each skill should be simple enough to understand in seconds, reliable enough to use without thinking, and generic enough to use everywhere.
