# Readwise API Reference

Comprehensive reference for Readwise v2 Highlights API and v3 Reader API.

## Authentication

All requests require authorization header:
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

Fetch highlights with optional date filtering.

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

**Example - Fetch Today's Highlights**:
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

## Reader API (v3)

### List Documents

Fetch documents/articles from Reader with filtering.

**Endpoint**: `GET https://readwise.io/api/v3/list/`

**Query Parameters**:
- `updatedAfter`: ISO 8601 datetime (filter updated after date)
- `location`: Filter by location
  - `new`: Newly saved items
  - `later`: Saved for later
  - `archive`: Archived items
  - `feed`: RSS feed items
- `category`: Filter by document type
  - `article`, `pdf`, `epub`, `tweet`, `video`, `highlight`, `note`
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

**Example - Fetch Today's Articles**:
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

## Error Handling

**401 Unauthorized**: Invalid or missing API token

**429 Rate Limited**: Too many requests
- Wait before retrying
- Implement automatic delays

**500 Server Error**: Readwise API issue
- Retry with exponential backoff

## Best Practices

1. **Rate Limiting**: Always implement 3s delays between paginated requests
2. **Error Handling**: Wrap API calls in try-catch, provide user-friendly errors
3. **Token Security**: Never log or expose API tokens
4. **Pagination**: Handle automatically, don't assume single-page results
5. **Date Formats**: Always use ISO 8601 format for dates
6. **Null Handling**: Check for null values in `highlighted_at`, `author`, `note`
