---
name: web-to-markdown
description: Batch-process web pages via headless Playwright browser, extract HTML, convert to markdown using Turndown, and save to timestamped scratchpad file. Use when user asks to "capture these pages as markdown", "save web content", "fetch and convert webpages", or needs clean markdown from HTML. All URLs from one prompt → single file at docs/web-captures/<timestamp>.md.
---

# Web to Markdown

## Overview

Captures web pages using headless Playwright browser automation (handles JavaScript-rendered content), converts HTML to clean markdown via Turndown library, and saves all URLs from a single request into one timestamped file.

**Key features:**
- Headless browser (no visible window)
- Handles JavaScript-rendered content (SPAs, React, Vue, etc.)
- Batch processing multiple URLs → single file
- Self-contained (no MCP dependency)

## Prerequisites

- **Node.js/pnpm** for running TypeScript scripts
- **Dependencies** installed: `cd skills/web-to-markdown && pnpm install`
- Playwright browsers will auto-install on first run

## Usage

When user provides URLs and asks to:
- "capture these pages as markdown"
- "save web content for documentation"
- "fetch and convert these webpages"
- "get markdown from these sites"
- "download and convert to markdown"

**Output:** `docs/web-captures/YYYYMMDD_HHMMSS.md` containing all pages.

## Workflow

### Single Command

```bash
cd skills/web-to-markdown
pnpm tsx scripts/scrape-and-convert.ts <url1> [url2] [url3] ...
```

**That's it!** Script handles:
1. Creates timestamped output file with header
2. Launches headless Playwright browser
3. Scrapes each URL sequentially
4. Converts HTML → markdown (Turndown)
5. Appends to output file with formatted headers
6. Closes browser and reports summary

### Examples

**Single URL:**
```bash
cd skills/web-to-markdown
pnpm tsx scripts/scrape-and-convert.ts https://example.com/docs

# Output: docs/web-captures/20251103_143052.md
```

**Multiple URLs (Batch):**
```bash
cd skills/web-to-markdown
pnpm tsx scripts/scrape-and-convert.ts \
  https://example.com/guide \
  https://example.com/api \
  https://example.com/faq

# Output: docs/web-captures/20251103_143052.md (all 3 pages)
```

**From project root:**
```bash
pnpm --filter @skills/web-to-markdown tsx scripts/scrape-and-convert.ts <urls...>
```

## Output Format

```markdown
# Web Captures - YYYY-MM-DD HH:MM:SS

Generated: YYYYMMDD_HHMMSS
URLs: N

---

## 📄 https://example.com/page1

[Converted markdown content...]

---

## 📄 https://example.com/page2

[Converted markdown content...]

---
```

## Implementation Notes

**TypeScript + FP Patterns:**
- Pure functions (no classes except custom errors)
- Explicit error handling with typed errors: `BrowserError`, `FileError`, `HtmlConversionError`
- Small, focused functions
- Side effects isolated at edges
- CLI-style logging with chalk/ora

**File Structure:**
```
skills/web-to-markdown/
├── SKILL.md                    # This file (workflow instructions)
├── package.json                # pnpm workspace config
├── tsconfig.json               # TypeScript config
├── scripts/
│   ├── scrape-and-convert.ts   # Main CLI (Playwright + Turndown)
│   ├── html-to-markdown.ts     # Pure conversion function (Turndown wrapper)
│   └── convert-and-append.ts   # Legacy CLI (deprecated, kept for reference)
└── tests/
    └── html-to-markdown.test.ts # Unit tests
```

## Error Handling

- **Browser launch failure**: Check Playwright installation, run `pnpm exec playwright install chromium`
- **Page not found (404)**: Logs error, continues with other URLs
- **Timeout (>30s)**: Reports slow page, continues to next URL
- **Navigation error**: Logs error, continues to next URL
- **Conversion failure**: Reports malformed HTML, skips page

## Configuration

Default timeout: 30 seconds per page

To customize, edit `DEFAULT_CONFIG` in `scripts/scrape-and-convert.ts`:

```typescript
const DEFAULT_CONFIG = {
  outputDir: 'docs/web-captures',
  timeout: 30000, // milliseconds
};
```

## Performance

- Headless mode (no GUI overhead)
- Sequential processing (one URL at a time for stability)
- Browser reuse across URLs (faster than launching per-page)
- ~2-5 seconds per page (depends on site complexity)

## Comparison with Alternatives

| Feature | web-to-markdown | scratchpad-fetch | Jina AI Reader |
|---------|-----------------|------------------|----------------|
| Transport | Playwright (headless) | curl (HTTP) | Cloud API |
| JavaScript | ✅ Full rendering | ❌ No | ✅ Server-side |
| Conversion | ✅ Turndown | ❌ Raw HTML | ✅ LLM-powered |
| Self-hosted | ✅ Yes | ✅ Yes | ❌ Cloud only |
| Setup | pnpm install | None | API key |
| Speed | Medium (2-5s/page) | Fast (<1s) | Fast (~2s) |
| Visible browser | ❌ No (headless) | N/A | N/A |

## Troubleshooting

**"Executable doesn't exist" error:**
```bash
cd skills/web-to-markdown
pnpm exec playwright install chromium
```

**Pages timing out:**
- Increase timeout in `DEFAULT_CONFIG`
- Check network connectivity
- Some sites may block automated browsers (use Jina AI Reader alternative)

**Empty markdown output:**
- Site may use heavy client-side rendering
- Try waiting longer (increase timeout)
- Check if site blocks headless browsers (User-Agent detection)

## Notes

- One request = one file (all URLs aggregated)
- Handles JavaScript-rendered content (React, Vue, Angular, etc.)
- Headless by default (no visible browser window)
- Browser auto-installs on first run
- Ideal for documentation scraping and archival
- No external API dependencies
