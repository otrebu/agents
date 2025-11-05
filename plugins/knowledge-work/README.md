# Knowledge Work Plugin

**Version:** 1.0.0
**Purpose:** Knowledge capture, web research, and ideation workflows

This plugin provides skills for gathering external information (web scraping, documentation fetching) and creative exploration (brainwriting, reading analytics).

---

## Skills

### brainwriting

**Description:** Facilitate structured brainstorming using parallel sub-agents to explore idea spaces.

**When to use:** For IDEATION/CONCEPTUAL WORK ONLY, NOT for implementation planning. Use when you want to brainstorm, explore ideas, generate concepts, develop vision, or discover creative directions.

**How it works:** Transforms vague ideas into practical, tangible expressions through 5 rounds of parallel agent analysis and refinement.

**Usage:**
```bash
claude skill knowledge-work:brainwriting
```

---

### readwise-api

**Description:** Fetch and analyze Readwise reading activity for any date range.

**When to use:** When you want insights about articles saved, highlights created, or most-highlighted content for today, yesterday, last week, last month, or custom date ranges.

**Dependencies:**
- Requires `READWISE_API_TOKEN` environment variable
- Node.js dependencies (has `node_modules/`, `package.json`, `pnpm-lock.yaml`)

**API connections:**
- Readwise Highlights API (v2)
- Reader API (v3)

**Usage:**
```bash
claude skill knowledge-work:readwise-api
```

---

### scratchpad-fetch

**Description:** Download and aggregate web pages/docs into timestamped scratchpad files.

**When to use:** When you need to "concatenate all these resources", "get all these links", "checkout all these resources", or want to gather fresh context from documentation URLs.

**How it works:** All URLs from one prompt go into single file at `docs/scratchpad/<timestamp>.md`.

**Dependencies:**
- Uses shell script: `scripts/fetch_urls.sh`

**Usage:**
```bash
claude skill knowledge-work:scratchpad-fetch
```

---

### web-to-markdown

**Description:** Batch-process web pages via headless Playwright browser, extract HTML, convert to markdown using Turndown, and save to timestamped scratchpad file.

**When to use:** When you ask to "capture these pages as markdown", "save web content", "fetch and convert webpages", or need clean markdown from HTML.

**How it works:** All URLs from one prompt → single file at `docs/web-captures/<timestamp>.md`.

**Dependencies:**
- Node.js dependencies (has `node_modules/`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`)
- Playwright for browser automation
- Turndown for HTML → Markdown conversion

**Usage:**
```bash
claude skill knowledge-work:web-to-markdown
```

---

## Installation

This plugin is designed to be referenced via absolute path in your project's `.claude/settings.json`:

```json
{
  "plugins": [
    "/Users/Uberto.Rapizzi/dev/agents/plugins/knowledge-work"
  ]
}
```

---

## Setup

### readwise-api Setup

1. Get your Readwise API token from https://readwise.io/access_token
2. Add to your environment:
   ```bash
   export READWISE_API_TOKEN="your-token-here"
   ```

### web-to-markdown Setup

Install dependencies if not already present:

```bash
cd skills/web-to-markdown
pnpm install
```

---

## Philosophy

This plugin embodies the "capture before you forget" principle - gathering external knowledge and creative ideas into structured formats for later processing. Whether you're scraping docs, analyzing reading habits, or exploring conceptual spaces, these skills help externalize and preserve thinking.
