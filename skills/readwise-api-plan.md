# Readwise API Skill - Implementation Plan

## Overview

Create a Claude Code skill that connects to the Readwise API to:
1. Find articles saved today and summarize what they're about
2. Pull highlights created today
3. Identify most-highlighted content

## Skill Structure

```
skills/readwise-api/
├── SKILL.md                          # Main skill documentation
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── scripts/
│   ├── readwise-client.ts           # Core API client (pure functions)
│   ├── fetch-todays-activity.ts     # Main CLI entry point
│   └── analyze-highlights.ts        # Highlight analysis utilities
├── tests/
│   ├── readwise-client.test.ts      # API client tests
│   └── analyze-highlights.test.ts   # Analysis logic tests
└── references/
    └── api-docs.md                  # Readwise API reference

```

## API Endpoints to Use

### 1. Readwise v2 Highlights API
- **Endpoint**: `GET https://readwise.io/api/v2/highlights/`
- **Auth**: Header `Authorization: Token XXX`
- **Rate Limit**: 20 requests/minute per token
- **Key Parameters**:
  - `highlighted_at__gt`: Filter highlights after date (ISO 8601)
  - `highlighted_at__lt`: Filter highlights before date
  - Pagination via `next` field in response

### 2. Readwise v3 Reader API
- **Endpoint**: `GET https://readwise.io/api/v3/list/`
- **Auth**: Header `Authorization: Token XXX`
- **Rate Limit**: 20 requests/minute per token
- **Key Parameters**:
  - `updatedAfter`: ISO 8601 date
  - `location`: new, later, archive, feed
  - `category`: article, pdf, epub, tweet, video, etc.
  - `pageCursor`: For pagination

## Core Features

### Feature 1: Today's Saved Articles
**Command**: Fetch articles saved to Reader today

**Implementation**:
- Call Reader API with `updatedAfter` = today at 00:00:00
- Filter for `location=new` (newly saved)
- Group by category (article, pdf, tweet, etc.)
- Display summary:
  - Total count
  - Breakdown by category
  - List titles with authors
  - URLs for access

**Output Example**:
```
📚 Articles Saved Today (Nov 4, 2025)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 12 items

By Category:
  • Articles: 8
  • PDFs: 2
  • Tweets: 2

Recent Articles:
  1. "The Art of API Design" by John Doe
     https://example.com/api-design

  2. "TypeScript Best Practices" by Jane Smith
     https://example.com/ts-practices
  ...
```

### Feature 2: Today's Highlights
**Command**: Fetch all highlights created today

**Implementation**:
- Call Highlights API with `highlighted_at__gt` = today at 00:00:00
- Group by source book/article
- Display:
  - Total highlight count
  - Grouped by source
  - Text of each highlight
  - Note (if any)

**Output Example**:
```
✨ Highlights Created Today (Nov 4, 2025)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 23 highlights from 5 sources

📖 "Atomic Habits" by James Clear (8 highlights)

  "You do not rise to the level of your goals. You fall to
   the level of your systems."
   📝 Note: Key insight for habit formation

  "Every action you take is a vote for the type of person
   you wish to become."
  ...

📄 "The Art of API Design" (6 highlights)
  ...
```

### Feature 3: Most Highlighted Content
**Command**: Analyze which content has the most highlights

**Implementation**:
- Fetch highlights (today or specified date range)
- Aggregate by source book/article
- Sort by highlight count
- Display top N sources with:
  - Title and author
  - Highlight count
  - Sample of top highlights

**Output Example**:
```
🔥 Most Highlighted Content
━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "Deep Work" by Cal Newport — 42 highlights
   Recent: "The ability to perform deep work is becoming
   increasingly rare..."

2. "Atomic Habits" by James Clear — 38 highlights
   Recent: "You do not rise to the level of your goals..."

3. "The Pragmatic Programmer" — 27 highlights
   Recent: "Don't live with broken windows..."
```

## Implementation Details

### 1. Core API Client (`readwise-client.ts`)

**Pure functions following FP patterns**:

```typescript
// Types
export interface ReadwiseConfig {
  readonly apiToken: string;
  readonly baseUrl?: string;
}

export interface DateRange {
  readonly startDate: Date;
  readonly endDate?: Date;
}

export interface Highlight {
  readonly id: string;
  readonly text: string;
  readonly note: string | null;
  readonly location: number;
  readonly highlightedAt: string;
  readonly url: string;
  readonly bookId: number;
  readonly title: string;
  readonly author: string;
}

export interface ReaderDocument {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly author: string | null;
  readonly category: string;
  readonly location: string;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly summary: string | null;
}

export interface ApiResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

// Custom errors
export class ReadwiseApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ReadwiseApiError';
  }
}

export class RateLimitError extends ReadwiseApiError {
  constructor(message: string = 'Rate limit exceeded (20 req/min)') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

// API functions
export async function fetchHighlights(
  config: ReadwiseConfig,
  dateRange?: DateRange
): Promise<ApiResult<readonly Highlight[]>> {
  try {
    const highlights: Highlight[] = [];
    let nextUrl: string | null = buildHighlightsUrl(config.baseUrl, dateRange);

    while (nextUrl) {
      const response = await fetchWithAuth(nextUrl, config.apiToken);
      const data = await response.json();
      highlights.push(...data.results);
      nextUrl = data.next;

      if (nextUrl) {
        await rateLimitDelay(3000); // 20 req/min = 3s between
      }
    }

    return { success: true, data: highlights };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function fetchReaderDocuments(
  config: ReadwiseConfig,
  options?: {
    readonly updatedAfter?: Date;
    readonly location?: 'new' | 'later' | 'archive' | 'feed';
    readonly category?: string;
  }
): Promise<ApiResult<readonly ReaderDocument[]>> {
  // Similar implementation with pagination
}

// Helper functions
function buildHighlightsUrl(baseUrl: string = 'https://readwise.io', dateRange?: DateRange): string {
  const url = new URL('/api/v2/highlights/', baseUrl);
  if (dateRange?.startDate) {
    url.searchParams.append('highlighted_at__gt', dateRange.startDate.toISOString());
  }
  if (dateRange?.endDate) {
    url.searchParams.append('highlighted_at__lt', dateRange.endDate.toISOString());
  }
  return url.toString();
}

async function fetchWithAuth(url: string, token: string): Promise<Response> {
  const response = await fetch(url, {
    headers: { 'Authorization': `Token ${token}` }
  });

  if (response.status === 429) {
    throw new RateLimitError();
  }

  if (!response.ok) {
    throw new ReadwiseApiError(
      `API request failed: ${response.statusText}`,
      response.status
    );
  }

  return response;
}

async function rateLimitDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 2. Analysis Utilities (`analyze-highlights.ts`)

```typescript
import type { Highlight, ReaderDocument } from './readwise-client.ts';

export interface HighlightsBySource {
  readonly sourceTitle: string;
  readonly sourceAuthor: string;
  readonly highlights: readonly Highlight[];
  readonly count: number;
}

export interface ArticleSummary {
  readonly totalCount: number;
  readonly byCategory: Record<string, number>;
  readonly articles: readonly ReaderDocument[];
}

// Pure function: group highlights by source
export function groupHighlightsBySource(
  highlights: readonly Highlight[]
): readonly HighlightsBySource[] {
  const grouped = new Map<string, Highlight[]>();

  for (const highlight of highlights) {
    const key = `${highlight.title}::${highlight.author}`;
    const existing = grouped.get(key) ?? [];
    grouped.set(key, [...existing, highlight]);
  }

  return Array.from(grouped.entries())
    .map(([key, highlights]) => ({
      sourceTitle: highlights[0].title,
      sourceAuthor: highlights[0].author,
      highlights,
      count: highlights.length
    }))
    .sort((a, b) => b.count - a.count);
}

// Pure function: summarize articles by category
export function summarizeArticles(
  documents: readonly ReaderDocument[]
): ArticleSummary {
  const byCategory: Record<string, number> = {};

  for (const doc of documents) {
    byCategory[doc.category] = (byCategory[doc.category] ?? 0) + 1;
  }

  return {
    totalCount: documents.length,
    byCategory,
    articles: documents
  };
}

// Pure function: find top highlighted sources
export function findTopHighlightedSources(
  groupedHighlights: readonly HighlightsBySource[],
  topN: number = 10
): readonly HighlightsBySource[] {
  return groupedHighlights.slice(0, topN);
}

// Pure function: get date range for "today"
export function getTodayDateRange(): DateRange {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return { startDate: startOfToday, endDate: now };
}
```

### 3. Main CLI Script (`fetch-todays-activity.ts`)

```typescript
import chalk from 'chalk';
import ora from 'ora';
import * as readline from 'readline';
import {
  fetchHighlights,
  fetchReaderDocuments,
  type ReadwiseConfig
} from './readwise-client.ts';
import {
  groupHighlightsBySource,
  summarizeArticles,
  getTodayDateRange,
  findTopHighlightedSources
} from './analyze-highlights.ts';

// CLI configuration
interface CliOptions {
  readonly mode: 'articles' | 'highlights' | 'top-highlighted' | 'all';
  readonly topN?: number;
}

async function main(): Promise<void> {
  // Parse args
  const args = process.argv.slice(2);
  const mode = args[0] as CliOptions['mode'] || 'all';
  const topN = args[1] ? parseInt(args[1], 10) : 10;

  // Get API token from env
  const apiToken = process.env.READWISE_API_TOKEN;
  if (!apiToken) {
    console.error(chalk.red('❌ Error: READWISE_API_TOKEN env var not set'));
    console.log(chalk.dim('Get your token from: https://readwise.io/access_token'));
    process.exit(1);
  }

  const config: ReadwiseConfig = { apiToken };
  const dateRange = getTodayDateRange();

  // Execute based on mode
  if (mode === 'articles' || mode === 'all') {
    await showTodaysArticles(config, dateRange);
  }

  if (mode === 'highlights' || mode === 'all') {
    await showTodaysHighlights(config, dateRange);
  }

  if (mode === 'top-highlighted' || mode === 'all') {
    await showTopHighlighted(config, dateRange, topN);
  }
}

async function showTodaysArticles(config: ReadwiseConfig, dateRange: DateRange): Promise<void> {
  const spinner = ora('Fetching articles saved today...').start();

  const result = await fetchReaderDocuments(config, {
    updatedAfter: dateRange.startDate,
    location: 'new'
  });

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch articles: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Articles fetched!'));

  const summary = summarizeArticles(result.data);

  console.log('\n' + chalk.bold.blue('📚 Articles Saved Today'));
  console.log(chalk.dim('━'.repeat(50)) + '\n');
  console.log(chalk.bold(`Total: ${summary.totalCount} items\n`));

  if (summary.totalCount === 0) {
    console.log(chalk.dim('No articles saved today yet.\n'));
    return;
  }

  console.log(chalk.bold('By Category:'));
  for (const [category, count] of Object.entries(summary.byCategory)) {
    console.log(chalk.dim('  • ') + `${category}: ${count}`);
  }

  console.log('\n' + chalk.bold('Recent Articles:'));
  for (let i = 0; i < Math.min(10, summary.articles.length); i++) {
    const article = summary.articles[i];
    console.log(chalk.dim(`  ${i + 1}. `) + chalk.white.bold(article.title));
    if (article.author) {
      console.log(chalk.dim(`     by ${article.author}`));
    }
    console.log(chalk.dim(`     ${article.url}\n`));
  }
}

async function showTodaysHighlights(config: ReadwiseConfig, dateRange: DateRange): Promise<void> {
  const spinner = ora('Fetching highlights created today...').start();

  const result = await fetchHighlights(config, dateRange);

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch highlights: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Highlights fetched!'));

  const grouped = groupHighlightsBySource(result.data);
  const totalCount = result.data.length;

  console.log('\n' + chalk.bold.yellow('✨ Highlights Created Today'));
  console.log(chalk.dim('━'.repeat(50)) + '\n');
  console.log(chalk.bold(`Total: ${totalCount} highlights from ${grouped.length} sources\n`));

  if (totalCount === 0) {
    console.log(chalk.dim('No highlights created today yet.\n'));
    return;
  }

  for (const source of grouped) {
    console.log(chalk.bold.cyan(`📖 "${source.sourceTitle}"`));
    if (source.sourceAuthor) {
      console.log(chalk.dim(`   by ${source.sourceAuthor}`));
    }
    console.log(chalk.dim(`   ${source.count} highlights\n`));

    // Show first 3 highlights per source
    for (let i = 0; i < Math.min(3, source.highlights.length); i++) {
      const hl = source.highlights[i];
      console.log(chalk.white(`   "${hl.text}"`));
      if (hl.note) {
        console.log(chalk.dim(`   📝 Note: ${hl.note}`));
      }
      console.log();
    }

    if (source.highlights.length > 3) {
      console.log(chalk.dim(`   ... and ${source.highlights.length - 3} more\n`));
    }
  }
}

async function showTopHighlighted(
  config: ReadwiseConfig,
  dateRange: DateRange,
  topN: number
): Promise<void> {
  const spinner = ora('Analyzing most highlighted content...').start();

  const result = await fetchHighlights(config, dateRange);

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch highlights: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Analysis complete!'));

  const grouped = groupHighlightsBySource(result.data);
  const topSources = findTopHighlightedSources(grouped, topN);

  console.log('\n' + chalk.bold.red('🔥 Most Highlighted Content'));
  console.log(chalk.dim('━'.repeat(50)) + '\n');

  if (topSources.length === 0) {
    console.log(chalk.dim('No highlights found.\n'));
    return;
  }

  for (let i = 0; i < topSources.length; i++) {
    const source = topSources[i];
    console.log(
      chalk.bold(`${i + 1}. `) +
      chalk.white.bold(source.sourceTitle)
    );
    if (source.sourceAuthor) {
      console.log(chalk.dim(`   by ${source.sourceAuthor}`));
    }
    console.log(chalk.yellow(`   ${source.count} highlights\n`));

    // Show most recent highlight
    const recent = source.highlights[0];
    console.log(chalk.dim('   Recent: ') + chalk.white(`"${recent.text}"`));
    console.log();
  }
}

// Entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(chalk.red('❌ Fatal error:'), error);
    process.exit(1);
  });
}
```

### 4. SKILL.md

```markdown
---
name: readwise-api
description: Fetch and analyze content from Readwise. Use when user wants to see articles saved today, highlights created today, or most-highlighted content. Supports Reader API (articles) and Highlights API (annotations). Requires READWISE_API_TOKEN env var.
allowed-tools: Bash(*)
---

# Readwise API Skill

Connects to Readwise APIs to fetch and analyze your reading activity.

## Role

Fetch today's saved articles, highlights created today, and identify most-highlighted content from your Readwise account.

## Prerequisites

1. **API Token**: Set `READWISE_API_TOKEN` environment variable
   - Get token: https://readwise.io/access_token
   - `export READWISE_API_TOKEN="your_token_here"`

2. **Dependencies**: Auto-installed on first run
   - chalk (terminal colors)
   - ora (spinners)

## Usage

### Mode 1: Today's Saved Articles

See what you saved to Reader today with category breakdown:

```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts articles
```

**Output**: Total count, category breakdown, list of titles with authors and URLs.

### Mode 2: Today's Highlights

See all highlights you created today, grouped by source:

```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts highlights
```

**Output**: Total highlights, grouped by book/article, with highlight text and notes.

### Mode 3: Most Highlighted Content

Find which content you're highlighting most:

```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts top-highlighted 10
```

**Output**: Top N sources ranked by highlight count with sample highlights.

### Mode 4: All (Default)

Run all three analyses:

```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts all
```

## When to Use

Invoke this skill when user asks:
- "What articles did I save today?"
- "Show my highlights from today"
- "What am I highlighting the most?"
- "What's in my Readwise today?"
- "What have I been reading?"
- "Show my Readwise activity"

## API Details

**Rate Limits**: 20 requests/minute per token. Script auto-throttles with 3s delays.

**Date Filtering**: "Today" = midnight to now in user's local timezone.

## Error Handling

- **Missing token**: Clear error with link to get token
- **Rate limit**: Automatic delays between paginated requests
- **Network errors**: Graceful failure with error messages
- **Empty results**: Friendly "no activity yet" messages

## References

- Readwise API docs: @references/api-docs.md
- API client implementation: @scripts/readwise-client.ts
- Analysis utilities: @scripts/analyze-highlights.ts
```

### 5. API Reference (`references/api-docs.md`)

```markdown
# Readwise API Reference

## Authentication

All requests require header:
```
Authorization: Token YOUR_ACCESS_TOKEN
```

Get token: https://readwise.io/access_token

## Rate Limits

- 20 requests per minute per access token
- Paginated endpoints require multiple requests
- Implement 3s delays between requests (20 req/min = 1 req/3s)

## Highlights API (v2)

### List Highlights

**Endpoint**: `GET https://readwise.io/api/v2/highlights/`

**Query Parameters**:
- `highlighted_at__gt`: ISO 8601 datetime (filter: after this time)
- `highlighted_at__lt`: ISO 8601 datetime (filter: before this time)
- `page_size`: Number of results per page (default: 100)

**Response**:
```json
{
  "count": 1234,
  "next": "https://readwise.io/api/v2/highlights/?page=2",
  "previous": null,
  "results": [
    {
      "id": 123456789,
      "text": "The highlight text",
      "note": "Optional user note",
      "location": 42,
      "location_type": "location",
      "highlighted_at": "2025-11-04T14:23:45Z",
      "url": "https://readwise.io/to_kindle?...",
      "color": "yellow",
      "updated": "2025-11-04T14:23:45Z",
      "book_id": 12345,
      "tags": [],
      "is_favorite": false,
      "is_discard": false,
      "readwise_url": "https://readwise.io/open/123456789",
      "book": {
        "id": 12345,
        "title": "Book Title",
        "author": "Author Name",
        "category": "books",
        "source": "kindle",
        "num_highlights": 15,
        "last_highlight_at": "2025-11-04T14:23:45Z",
        "updated": "2025-11-04T14:23:45Z",
        "cover_image_url": "https://...",
        "highlights_url": "https://readwise.io/api/v2/books/12345/highlights/",
        "source_url": null,
        "asin": "B08ABC1234",
        "tags": []
      }
    }
  ]
}
```

**Pagination**: Follow `next` URL until null.

## Reader API (v3)

### List Documents

**Endpoint**: `GET https://readwise.io/api/v3/list/`

**Query Parameters**:
- `updatedAfter`: ISO 8601 datetime
- `location`: `new`, `later`, `archive`, `feed`
- `category`: `article`, `pdf`, `epub`, `tweet`, `video`, `highlight`, `note`
- `pageCursor`: Pagination cursor from previous response

**Response**:
```json
{
  "count": 456,
  "nextPageCursor": "abc123...",
  "results": [
    {
      "id": "01abc123",
      "url": "https://readwise.io/reader/document_url/...",
      "source_url": "https://example.com/article",
      "title": "Article Title",
      "author": "Author Name",
      "source": "example.com",
      "category": "article",
      "location": "new",
      "tags": ["tag1", "tag2"],
      "site_name": "Example Site",
      "word_count": 1500,
      "created_at": "2025-11-04T10:30:00Z",
      "updated_at": "2025-11-04T14:00:00Z",
      "published_date": "2025-11-03",
      "summary": "Article summary text...",
      "image_url": "https://...",
      "parent_id": null,
      "reading_progress": 0.0
    }
  ]
}
```

**Pagination**: Use `nextPageCursor` in next request. Null when done.

## Example: Fetch Today's Highlights

```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);

const response = await fetch(
  `https://readwise.io/api/v2/highlights/?highlighted_at__gt=${today.toISOString()}`,
  { headers: { Authorization: `Token ${token}` } }
);

const data = await response.json();
// Handle pagination via data.next
```

## Example: Fetch Today's Articles

```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);

let cursor = null;
const documents = [];

do {
  const url = new URL('https://readwise.io/api/v3/list/');
  url.searchParams.set('updatedAfter', today.toISOString());
  url.searchParams.set('location', 'new');
  if (cursor) url.searchParams.set('pageCursor', cursor);

  const response = await fetch(url, {
    headers: { Authorization: `Token ${token}` }
  });

  const data = await response.json();
  documents.push(...data.results);
  cursor = data.nextPageCursor;

  if (cursor) await delay(3000); // Rate limiting
} while (cursor);
```
```

## Testing Strategy

### Unit Tests

**File**: `tests/readwise-client.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchHighlights,
  fetchReaderDocuments,
  buildHighlightsUrl,
  ReadwiseConfig
} from '../scripts/readwise-client.ts';

describe('readwise-client', () => {
  describe('buildHighlightsUrl', () => {
    it.each([
      {
        name: 'builds URL without date range',
        dateRange: undefined,
        expected: 'https://readwise.io/api/v2/highlights/'
      },
      {
        name: 'builds URL with start date',
        dateRange: { startDate: new Date('2025-11-04T00:00:00Z') },
        expected: 'https://readwise.io/api/v2/highlights/?highlighted_at__gt=2025-11-04T00:00:00.000Z'
      }
    ])('$name', ({ dateRange, expected }) => {
      expect(buildHighlightsUrl(undefined, dateRange)).toBe(expected);
    });
  });

  describe('fetchHighlights', () => {
    it('handles successful response with pagination', async () => {
      // Mock fetch, test pagination logic
    });

    it('handles rate limit errors gracefully', async () => {
      // Mock 429 response, verify error handling
    });
  });
});
```

**File**: `tests/analyze-highlights.test.ts`

```typescript
describe('analyze-highlights', () => {
  describe('groupHighlightsBySource', () => {
    it('groups highlights by title and author', () => {
      const highlights = [
        { title: 'Book A', author: 'Author 1', text: 'highlight 1', ... },
        { title: 'Book A', author: 'Author 1', text: 'highlight 2', ... },
        { title: 'Book B', author: 'Author 2', text: 'highlight 3', ... }
      ];

      const grouped = groupHighlightsBySource(highlights);

      expect(grouped).toHaveLength(2);
      expect(grouped[0].count).toBe(2);
      expect(grouped[0].sourceTitle).toBe('Book A');
    });

    it('sorts by highlight count descending', () => {
      // Test sorting logic
    });
  });
});
```

### Integration Test

Manual test with real API (not automated to avoid rate limits):

```bash
# Set token
export READWISE_API_TOKEN="your_test_token"

# Test each mode
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts articles
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts highlights
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts top-highlighted 5
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts all
```

## Dependencies

**package.json**:
```json
{
  "name": "@agents/readwise-api-skill",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "fetch": "tsx scripts/fetch-todays-activity.ts"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "ora": "^8.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.1.0"
  }
}
```

**tsconfig.json**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./scripts",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["scripts/**/*", "tests/**/*"]
}
```

## Implementation Phases

### Phase 1: Core API Client ✓
1. Create directory structure
2. Implement `readwise-client.ts` with typed functions
3. Add custom error classes
4. Implement pagination and rate limiting
5. Write unit tests

### Phase 2: Analysis Utilities ✓
1. Implement `analyze-highlights.ts`
2. Add grouping, sorting, summarizing functions
3. Pure functions following FP patterns
4. Write unit tests

### Phase 3: CLI Script ✓
1. Implement `fetch-todays-activity.ts`
2. Add CLI argument parsing
3. Implement colored output with chalk/ora
4. Handle all three modes + combined mode
5. Error handling and user-friendly messages

### Phase 4: Documentation ✓
1. Write comprehensive SKILL.md
2. Add API reference docs
3. Include usage examples
4. Document error cases and troubleshooting

### Phase 5: Testing & Polish ✓
1. Run unit tests
2. Manual integration testing with real API
3. Refine output formatting
4. Add edge case handling

## Success Criteria

- ✅ Fetches articles saved today with category breakdown
- ✅ Fetches highlights created today, grouped by source
- ✅ Identifies most-highlighted content
- ✅ Handles pagination correctly
- ✅ Respects rate limits with auto-throttling
- ✅ Clear error messages for all failure cases
- ✅ Beautiful terminal output with colors/spinners
- ✅ Pure functions, FP patterns throughout
- ✅ Comprehensive tests (unit + manual integration)
- ✅ Self-documenting code with TypeScript types

## Future Enhancements

Consider adding later:
- Export to markdown/JSON files
- Date range selection (not just "today")
- Search highlights by keyword
- Tag-based filtering
- Integration with other note-taking tools
- Caching to reduce API calls
- Offline mode with cached data
