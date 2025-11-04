// Analysis utilities for Readwise highlights and documents
// Pure functions following FP patterns

import type { Highlight, ReaderDocument, DateRange } from './readwise-client.js';

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

// Pure function: group highlights by source book/article
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
    .map(([_key, highlights]) => ({
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

// Pure function: find top N highlighted sources
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

// Pure function: format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Pure function: truncate text to max length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}
