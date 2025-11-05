# Plugin Reorganization Plan

**Created:** 2025-11-05
**Status:** Planned

## 🎯 Goal

Move 6 standalone skills into 3 plugins to enable config reuse via absolute paths (no symlinks).

**Problem:** Symlinks in `.claude/` break path resolution due to Claude Code bugs (#764, #4754, #5433).

**Solution:** Organize all skills into plugins, reference via absolute paths in settings.json.

---

## 📊 Current State

### Existing Plugins
- **meta-work** → 4 skills: prompting, claude-permissions, skill-creator, plugin-creator
- **development-lifecycle** → 6 skills: git-commit, code-review, finish-feature, fix-eslint, start-feature, dev-work-summary
- **typescript-coding** → 1 skill: typescript-coding

### Standalone Skills to Move
```
skills/
├── analyze-size/          → development-lifecycle
├── brainwriting/          → knowledge-work (NEW)
├── readwise-api/          → knowledge-work (NEW)
├── scratchpad-fetch/      → knowledge-work (NEW)
├── timestamp/             → basic-skills (NEW)
└── web-to-markdown/       → knowledge-work (NEW)
```

### Hooks (stays separate)
```
hooks/
├── tts-readback/          (referenced in settings)
└── skill-reminder/        (referenced in settings)
```

---

## 🏗️ Target Structure

```
~/dev/agents/
├── plugins/
│   ├── basic-skills/                      [NEW]
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/
│   │   │   └── timestamp/
│   │   │       ├── scripts/
│   │   │       │   └── generate_timestamp.sh
│   │   │       └── SKILL.md
│   │   └── README.md
│   │
│   ├── development-lifecycle/             [EXPAND]
│   │   ├── skills/
│   │   │   ├── analyze-size/              [ADD]
│   │   │   │   └── SKILL.md
│   │   │   ├── code-review/               [existing]
│   │   │   ├── dev-work-summary/          [existing]
│   │   │   ├── finish-feature/            [existing]
│   │   │   ├── fix-eslint/                [existing]
│   │   │   ├── git-commit/                [existing]
│   │   │   └── start-feature/             [existing]
│   │   └── README.md                      [update]
│   │
│   ├── knowledge-work/                    [NEW]
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/
│   │   │   ├── brainwriting/
│   │   │   │   └── SKILL.md
│   │   │   ├── readwise-api/
│   │   │   │   ├── node_modules/
│   │   │   │   ├── package.json
│   │   │   │   ├── pnpm-lock.yaml
│   │   │   │   ├── references/
│   │   │   │   ├── scripts/
│   │   │   │   ├── SKILL.md
│   │   │   │   └── tsconfig.json
│   │   │   ├── scratchpad-fetch/
│   │   │   │   ├── scripts/
│   │   │   │   │   └── fetch_urls.sh
│   │   │   │   └── SKILL.md
│   │   │   └── web-to-markdown/
│   │   │       ├── node_modules/
│   │   │       ├── package.json
│   │   │       ├── pnpm-lock.yaml
│   │   │       ├── scripts/
│   │   │       ├── tests/
│   │   │       ├── SKILL.md
│   │   │       └── tsconfig.json
│   │   └── README.md
│   │
│   ├── meta-work/                         [existing]
│   └── typescript-coding/                 [existing]
│
├── hooks/                                 [KEEP]
│   ├── skill-reminder/
│   └── tts-readback/
│
└── settings.json                          [UPDATE - template for new projects]
```

---

## 📝 Detailed Implementation Steps

### Phase 1: Create `knowledge-work` Plugin

**Purpose:** Knowledge capture, web research, ideation. Skills for gathering external info (web scraping, doc fetching) and creative exploration (brainwriting, reading analytics).

1. **Scaffold plugin structure:**
   ```bash
   mkdir -p plugins/knowledge-work/.claude-plugin
   mkdir -p plugins/knowledge-work/skills
   ```

2. **Create plugin.json:**
   ```json
   {
     "name": "knowledge-work",
     "version": "1.0.0",
     "description": "Knowledge capture, web research, ideation. Skills for gathering external info (web scraping, doc fetching) and creative exploration (brainwriting, reading analytics).",
     "author": {
       "name": "otrebu",
       "email": "dev@uberto.me"
     },
     "license": "MIT",
     "keywords": ["knowledge", "research", "ideation", "web-scraping", "documentation"]
   }
   ```

3. **Move skills:**
   ```bash
   mv skills/brainwriting plugins/knowledge-work/skills/
   mv skills/readwise-api plugins/knowledge-work/skills/
   mv skills/scratchpad-fetch plugins/knowledge-work/skills/
   mv skills/web-to-markdown plugins/knowledge-work/skills/
   ```

4. **Create README.md** documenting:
   - Plugin purpose and philosophy
   - Each skill: name, description, when to use, basic usage
   - Dependencies (readwise-api and web-to-markdown have node_modules)
   - Installation/setup instructions

### Phase 2: Create `basic-skills` Plugin

**Purpose:** Foundational utilities used across other skills. Simple, reusable helpers.

1. **Scaffold plugin structure:**
   ```bash
   mkdir -p plugins/basic-skills/.claude-plugin
   mkdir -p plugins/basic-skills/skills
   ```

2. **Create plugin.json:**
   ```json
   {
     "name": "basic-skills",
     "version": "1.0.0",
     "description": "Foundational utilities used across other skills. Simple, reusable helpers.",
     "author": {
       "name": "otrebu",
       "email": "dev@uberto.me"
     },
     "license": "MIT",
     "keywords": ["utilities", "helpers", "timestamp"]
   }
   ```

3. **Move skill:**
   ```bash
   mv skills/timestamp plugins/basic-skills/skills/
   ```

4. **Create README.md** documenting:
   - Plugin purpose
   - Timestamp skill usage
   - Future utilities that could fit here

### Phase 3: Expand `development-lifecycle` Plugin

**Purpose:** Add codebase analysis as first step in dev workflow (analyze → branch → code → review → commit).

1. **Move skill:**
   ```bash
   mv skills/analyze-size plugins/development-lifecycle/skills/
   ```

2. **Update `plugins/development-lifecycle/README.md`:**
   - Add `analyze-size` to Skills section
   - Document usage: "Use when starting work on new repos to assess scale/composition"
   - Update workflow description to include analysis as entry point

### Phase 4: Update Root `settings.json` (Template)

This file serves as template for new projects.

**Update permissions (lines 107-114):**
- **Remove:**
  ```json
  "Skill(analyze-size)",
  "Skill(brainwriting)",
  "Skill(scratchpad-fetch)",
  "Skill(web-to-markdown)",
  "Skill(timestamp)",
  ```
- **Add:**
  ```json
  "Skill(knowledge-work:*)",
  "Skill(basic-skills:*)"
  ```

**Update enabledPlugins (lines 222-226):**
```json
"enabledPlugins": {
  "meta-work@otrebu-dev-tools": true,
  "development-lifecycle@otrebu-dev-tools": true,
  "typescript-coding@otrebu-dev-tools": true,
  "knowledge-work@otrebu-dev-tools": true,
  "basic-skills@otrebu-dev-tools": true
}
```

**Keep hooks as-is** (lines 195-217) - uses `$CLAUDE_PROJECT_DIR` for dynamic paths.

### Phase 5: Update Project `.claude/settings.json`

**Replace entire file with plugin-based config:**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "plugins": [
    "/Users/Uberto.Rapizzi/dev/agents/plugins/meta-work",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/development-lifecycle",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/typescript-coding",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/knowledge-work",
    "/Users/Uberto.Rapizzi/dev/agents/plugins/basic-skills"
  ],
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "/Users/Uberto.Rapizzi/dev/agents/hooks/tts-readback/node_modules/.bin/tsx /Users/Uberto.Rapizzi/dev/agents/hooks/tts-readback/stop-hook.ts",
        "timeout": 30
      }]
    }],
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "/Users/Uberto.Rapizzi/dev/agents/hooks/skill-reminder/prompt-hook.sh"
      }]
    }]
  },
  "statusLine": {
    "type": "command",
    "command": "/Users/Uberto.Rapizzi/.claude/statusline-command.sh"
  }
}
```

**Note:** This config inherits permissions from plugins. Much simpler than massive permissions list.

### Phase 6: Cleanup

1. **Delete old standalone skills dir:**
   ```bash
   rm -rf skills/
   ```

2. **Remove `.claude/` symlinks** (if any exist):
   ```bash
   rm .claude/skills .claude/commands .claude/agents .claude/settings.json .claude/hooks.json 2>/dev/null || true
   ```

3. **Update main `README.md`:**
   - Document new plugin structure
   - Update installation instructions
   - Add plugin descriptions
   - Document hooks location

### Phase 7: Create Bootstrap Script

Create `setup-project.sh` in root for easy project onboarding:

```bash
#!/usr/bin/env bash
# Bootstrap Claude Code config for new projects
# Usage: ./setup-project.sh [path-to-project]

set -euo pipefail

PROJECT_DIR="${1:-.}"
AGENTS_DIR="/Users/Uberto.Rapizzi/dev/agents"

echo "🚀 Setting up Claude Code config in: $PROJECT_DIR"

mkdir -p "$PROJECT_DIR/.claude"

cat > "$PROJECT_DIR/.claude/settings.json" <<EOF
{
  "\$schema": "https://json.schemastore.org/claude-code-settings.json",
  "plugins": [
    "$AGENTS_DIR/plugins/meta-work",
    "$AGENTS_DIR/plugins/development-lifecycle",
    "$AGENTS_DIR/plugins/typescript-coding",
    "$AGENTS_DIR/plugins/knowledge-work",
    "$AGENTS_DIR/plugins/basic-skills"
  ],
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "$AGENTS_DIR/hooks/tts-readback/node_modules/.bin/tsx $AGENTS_DIR/hooks/tts-readback/stop-hook.ts",
        "timeout": 30
      }]
    }],
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "$AGENTS_DIR/hooks/skill-reminder/prompt-hook.sh"
      }]
    }]
  }
}
EOF

echo "✅ Created .claude/settings.json"
echo "📦 Plugins enabled: meta-work, development-lifecycle, typescript-coding, knowledge-work, basic-skills"
echo "🪝 Hooks configured: TTS readback, skill reminder"
echo ""
echo "💡 Customize by creating .claude/settings.local.json for project-specific overrides"
```

Make executable:
```bash
chmod +x setup-project.sh
```

---

## ✅ Validation Checklist

After implementation, verify:

- [ ] All 6 skills moved to correct plugins
- [ ] Plugin READMEs created/updated documenting all skills
- [ ] Root settings.json updated (permissions + enabledPlugins)
- [ ] Project .claude/settings.json uses absolute paths only
- [ ] No symlinks remain in .claude/
- [ ] Skills accessible via namespaced names:
  - [ ] `claude skill knowledge-work:brainwriting`
  - [ ] `claude skill knowledge-work:readwise-api`
  - [ ] `claude skill knowledge-work:scratchpad-fetch`
  - [ ] `claude skill knowledge-work:web-to-markdown`
  - [ ] `claude skill basic-skills:timestamp`
  - [ ] `claude skill development-lifecycle:analyze-size`
- [ ] Hooks still work (test Stop hook, UserPromptSubmit hook)
- [ ] Bootstrap script tested on new project
- [ ] README.md reflects new structure
- [ ] Git status clean (all changes committed)

---

## 🎁 Benefits

1. **Edit once, reflect everywhere** - Change skill in `~/dev/agents`, all projects see it immediately
2. **No symlink issues** - Absolute paths bypass Claude Code path resolution bugs
3. **Clean project configs** - Just plugin list + hooks, no massive permissions blocks
4. **Easy onboarding** - Run `setup-project.sh` for new projects
5. **Semantic organization** - Skills grouped by purpose (knowledge work, dev lifecycle, utilities)
6. **Portable config** - One canonical location, reference from anywhere
7. **Cleaner permissions** - Inherited from plugins, not duplicated per project

---

## 🔮 Future Considerations

1. **Environment variable support** - Use `$CLAUDE_AGENTS_DIR` instead of hardcoded path for portability
2. **Plugin versioning** - Consider semantic versioning for plugin changes
3. **Shared hooks plugin** - Move hooks into plugin if Claude Code adds support
4. **Auto-discovery** - Script to detect ~/dev/agents location dynamically
5. **Plugin dependencies** - Document if plugins depend on each other (e.g., knowledge-work uses basic-skills:timestamp)

---

## 📚 Related Issues

- Claude Code #764: Symlink traversal failure
- Claude Code #4754: Relative path resolution inconsistency
- Claude Code #5433: Hook execution failure with symlinked scripts

---

## 🤝 Agent Analysis

This plan synthesized input from 3 agent perspectives:

- **Taxonomist** - Suggested semantic grouping (knowledge-work concept)
- **Pragmatist** - Proposed workflow-based organization (analyze-size → dev-lifecycle)
- **Minimalist** - Warned against premature abstraction (keep it simple)

Final decision balanced semantic clarity with practical workflow integration.