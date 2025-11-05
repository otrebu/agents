// Readwise API client with pure functions following FP patterns

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
  readonly id: number;
  readonly text: string;
  readonly note: string | null;
  readonly location: number;
  readonly highlightedAt: string | null;
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
  readonly wordCount?: number;
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
    let nextUrl: string | null = buildHighlightsUrl(
      config.baseUrl ?? 'https://readwise.io',
      dateRange
    );

    while (nextUrl) {
      const response = await fetchWithAuth(nextUrl, config.apiToken);
      const data = await response.json();

      // Transform API response to our types
      const transformed = data.results.map((item: any) => ({
        id: item.id,
        text: item.text,
        note: item.note,
        location: item.location,
        highlightedAt: item.highlighted_at,
        url: item.url,
        bookId: item.book_id,
        title: item.book?.title ?? 'Unknown',
        author: item.book?.author ?? 'Unknown'
      }));

      highlights.push(...transformed);
      nextUrl = data.next;

      if (nextUrl) {
        await rateLimitDelay(3000); // 20 req/min = 3s between requests
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
    readonly updatedBefore?: Date;
    readonly location?: 'new' | 'later' | 'archive' | 'feed';
    readonly category?: string;
  }
): Promise<ApiResult<readonly ReaderDocument[]>> {
  try {
    const documents: ReaderDocument[] = [];
    let pageCursor: string | null = null;

    do {
      const url = buildReaderListUrl(
        config.baseUrl ?? 'https://readwise.io',
        {
          ...options,
          pageCursor: pageCursor ?? undefined
        }
      );

      const response = await fetchWithAuth(url, config.apiToken);
      const data = await response.json();

      // Transform API response to our types
      const transformed = data.results.map((item: any) => ({
        id: item.id,
        url: item.url,
        title: item.title,
        author: item.author,
        category: item.category,
        location: item.location,
        tags: item.tags ?? [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        summary: item.summary,
        wordCount: item.word_count
      }));

      documents.push(...transformed);
      pageCursor = data.nextPageCursor;

      if (pageCursor) {
        await rateLimitDelay(3000); // Rate limiting
      }
    } while (pageCursor);

    // Client-side filtering for updatedBefore
    // Reader API doesn't support end date natively, so filter locally
    let filtered = documents;
    if (options?.updatedBefore) {
      const beforeTime = options.updatedBefore.getTime();
      filtered = documents.filter(doc => {
        const docTime = new Date(doc.updatedAt).getTime();
        return docTime <= beforeTime;
      });
    }

    return { success: true, data: filtered };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper functions
function buildHighlightsUrl(
  baseUrl: string,
  dateRange?: DateRange
): string {
  const url = new URL('/api/v2/highlights/', baseUrl);

  if (dateRange?.startDate) {
    url.searchParams.append(
      'highlighted_at__gt',
      dateRange.startDate.toISOString()
    );
  }

  if (dateRange?.endDate) {
    url.searchParams.append(
      'highlighted_at__lt',
      dateRange.endDate.toISOString()
    );
  }

  return url.toString();
}

function buildReaderListUrl(
  baseUrl: string,
  options?: {
    readonly updatedAfter?: Date;
    readonly location?: string;
    readonly category?: string;
    readonly pageCursor?: string;
  }
): string {
  const url = new URL('/api/v3/list/', baseUrl);

  if (options?.updatedAfter) {
    url.searchParams.append('updatedAfter', options.updatedAfter.toISOString());
  }

  if (options?.location) {
    url.searchParams.append('location', options.location);
  }

  if (options?.category) {
    url.searchParams.append('category', options.category);
  }

  if (options?.pageCursor) {
    url.searchParams.append('pageCursor', options.pageCursor);
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
