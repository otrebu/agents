---
name: readwise-api
description: Fetch and analyze Readwise reading activity. Use when user asks about articles saved today, highlights created today, or most-highlighted content. Requires READWISE_API_TOKEN env var. Connects to Readwise Highlights API (v2) and Reader API (v3).
allowed-tools: Bash(pnpm tsx*)
---

# Readwise API

Connect to Readwise APIs to fetch and analyze reading activity.

## Overview

Fetch today's saved articles, highlights created today, and identify most-highlighted content from user's Readwise account. Uses Readwise v2 Highlights API and v3 Reader API.

## Prerequisites

**API Token**: Set `READWISE_API_TOKEN` environment variable
- Get token: https://readwise.io/access_token
- `export READWISE_API_TOKEN="your_token_here"`

**Dependencies**: Installed via pnpm (auto on first use)
- chalk (terminal colors)
- ora (spinners)
- TypeScript support

## Core Capabilities

### 1. Today's Saved Articles

Fetch articles saved to Reader today with category breakdown.

**Command**:
```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts articles
```

**Output**:
- Total count
- Breakdown by category (article, PDF, tweet, video, etc.)
- List of titles with authors and URLs
- Limited to 10 most recent, with count of additional

**When to use**: User asks "What articles did I save today?" or "Show my Readwise saves"

### 2. Today's Highlights

Fetch all highlights created today, grouped by source book/article.

**Command**:
```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts highlights
```

**Output**:
- Total highlight count
- Grouped by source (book/article)
- Highlight text with notes
- Shows first 3 per source, with count of additional

**When to use**: User asks "Show my highlights from today" or "What did I highlight today?"

### 3. Most Highlighted Content

Identify which content has most highlights today.

**Command**:
```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts top-highlighted 10
```

**Parameters**: Number after command = top N results (default: 10)

**Output**:
- Top N sources ranked by highlight count
- Sample recent highlight from each
- Author and title information

**When to use**: User asks "What am I highlighting the most?" or "My most-highlighted content"

### 4. All Activity (Combined)

Run all three analyses together.

**Command**:
```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts all
```

**When to use**: User asks "Show my Readwise activity" or "What's in my Readwise today?"

## Usage Examples

### Example 1: User asks "What did I save to Readwise today?"

```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts articles
```

Returns list of articles with categories, titles, authors, URLs.

### Example 2: User asks "Show me everything from Readwise today"

```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts all
```

Returns articles, highlights, and top-highlighted content.

### Example 3: User asks "What are my top 5 most highlighted books?"

```bash
pnpm tsx skills/readwise-api/scripts/fetch-todays-activity.ts top-highlighted 5
```

Returns top 5 sources by highlight count.

## Error Handling

**Missing API token**: Clear error with link to get token

**Rate limits**: Automatic 3s delays between paginated requests (20 req/min limit)

**Network errors**: Graceful failure with error messages via spinner

**Empty results**: Friendly "no activity yet" messages

## API Details

**Rate Limits**: 20 requests/minute per access token
- Script auto-throttles with 3s delays between requests
- Pagination handled automatically

**Date Filtering**: "Today" = midnight to now in local timezone

**Pagination**: Automatically follows `next` URLs (v2) and `pageCursor` (v3)

## Implementation

**API Client**: `scripts/readwise-client.ts`
- Pure functions, typed errors
- Handles pagination and rate limiting
- Returns `ApiResult<T>` with success/error

**Analysis**: `scripts/analyze-highlights.ts`
- Pure functions for grouping, sorting, summarizing
- Immutable data transformations

**CLI**: `scripts/fetch-todays-activity.ts`
- Human-readable terminal output
- Colored text via chalk, spinners via ora
- Four modes: articles, highlights, top-highlighted, all

## References

Detailed API documentation: `references/api_reference.md`
- Endpoint details
- Authentication
- Rate limits
- Request/response formats
- Example code
