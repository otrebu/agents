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

export interface DailyHighlights {
  readonly date: string; // YYYY-MM-DD
  readonly dayOfWeek: string; // Mon, Tue, ...
  readonly count: number;
  readonly highlights: readonly Highlight[];
}

export interface CategoryStat {
  readonly domain: string; // Architecture, Performance, etc
  readonly count: number;
  readonly percentage: number;
  readonly highlights: readonly Highlight[];
}

export interface Insight {
  readonly text: string;
  readonly domain: string;
  readonly emoji: string;
  readonly score: number;
  readonly sourceTitle: string;
}

export interface PeakDay {
  readonly date: string;
  readonly dayOfWeek: string;
  readonly count: number;
  readonly percentage: number;
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

// Preset options for common date ranges
export type DatePreset = 'today' | 'yesterday' | 'last-week' | 'last-month';

// Pure function: get date range by preset or custom dates
export function getDateRange(
  preset?: DatePreset,
  customRange?: { startDate: Date; endDate?: Date }
): DateRange {
  if (customRange) {
    return customRange;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'today':
      return { startDate: startOfToday, endDate: now };

    case 'yesterday': {
      const yesterday = new Date(startOfToday);
      yesterday.setDate(yesterday.getDate() - 1);
      return { startDate: yesterday, endDate: startOfToday };
    }

    case 'last-week': {
      const weekAgo = new Date(startOfToday);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { startDate: weekAgo, endDate: now };
    }

    case 'last-month': {
      const monthAgo = new Date(startOfToday);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return { startDate: monthAgo, endDate: now };
    }

    default:
      // Default: last 7 days
      const defaultStart = new Date(startOfToday);
      defaultStart.setDate(defaultStart.getDate() - 7);
      return { startDate: defaultStart, endDate: now };
  }
}

// Legacy helper for backwards compat
export function getTodayDateRange(): DateRange {
  return getDateRange('today');
}

// Pure function: format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Pure function: format date range for display
export function formatDateRange(range: DateRange, preset?: DatePreset): string {
  if (preset === 'today') return 'Today';
  if (preset === 'yesterday') return 'Yesterday';
  if (preset === 'last-week') return 'Last 7 days';
  if (preset === 'last-month') return 'Last 30 days';

  // Custom range
  const start = formatDate(range.startDate);
  const end = range.endDate ? formatDate(range.endDate) : 'now';
  return `${start} - ${end}`;
}

// Pure function: truncate text to max length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

// Pure function: group highlights by day
export function groupHighlightsByDay(
  highlights: readonly Highlight[],
  dateRange: DateRange
): readonly DailyHighlights[] {
  const grouped = new Map<string, Highlight[]>();

  // Get all days in range
  const days: string[] = [];
  const start = new Date(dateRange.startDate);
  const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = formatDateKey(d);
    days.push(key);
    grouped.set(key, []);
  }

  // Group highlights by day
  for (const highlight of highlights) {
    if (!highlight.highlightedAt) continue;

    const date = new Date(highlight.highlightedAt);
    const key = formatDateKey(date);
    const existing = grouped.get(key) ?? [];
    grouped.set(key, [...existing, highlight]);
  }

  return days.map(dateKey => {
    const date = parseDateKey(dateKey);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const highlights = grouped.get(dateKey) ?? [];

    return {
      date: dateKey,
      dayOfWeek,
      count: highlights.length,
      highlights
    };
  });
}

// Pure function: find peak days
export function findPeakDays(
  dailyBreakdown: readonly DailyHighlights[],
  topN: number = 3
): readonly PeakDay[] {
  const totalCount = dailyBreakdown.reduce((sum, day) => sum + day.count, 0);

  return [...dailyBreakdown]
    .filter(day => day.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
    .map(day => ({
      date: day.date,
      dayOfWeek: day.dayOfWeek,
      count: day.count,
      percentage: totalCount > 0 ? (day.count / totalCount) * 100 : 0
    }));
}

// Helper: format date as YYYY-MM-DD
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: parse YYYY-MM-DD to Date
function parseDateKey(dateKey: string): Date {
  return new Date(dateKey + 'T00:00:00');
}

// Pure function: infer domain from text
export function inferDomain(text: string): string {
  const lower = text.toLowerCase();

  const patterns: Record<string, string[]> = {
    'Architecture': ['architecture', 'design pattern', 'structure', 'layering', 'modularity', 'component'],
    'Performance': ['performance', 'optimize', 'speed', 'latency', 'throughput', 'benchmark', 'cache'],
    'Security': ['security', 'authentication', 'authorization', 'encryption', 'vulnerability', 'attack'],
    'Testing': ['test', 'testing', 'tdd', 'unit test', 'integration', 'mock', 'coverage'],
    'API': ['api', 'endpoint', 'rest', 'graphql', 'http', 'request', 'response'],
    'Database': ['database', 'sql', 'query', 'schema', 'migration', 'orm', 'index'],
    'Frontend': ['react', 'vue', 'angular', 'ui', 'ux', 'css', 'html', 'component', 'dom'],
    'Backend': ['server', 'backend', 'nodejs', 'express', 'microservice', 'service'],
    'DevOps': ['devops', 'docker', 'kubernetes', 'ci/cd', 'deploy', 'pipeline', 'infrastructure'],
    'AI/ML': ['ai', 'machine learning', 'neural', 'model', 'training', 'llm', 'gpt', 'claude'],
    'Psychology': ['psychology', 'emotional', 'cognitive', 'behavior', 'mental', 'therapy', 'neurodivergent'],
    'Philosophy': ['philosophy', 'ethics', 'principle', 'moral', 'belief', 'theory'],
    'Productivity': ['productivity', 'workflow', 'efficiency', 'habit', 'time management', 'focus'],
    'Leadership': ['leadership', 'management', 'team', 'communication', 'culture', 'organization']
  };

  for (const [domain, keywords] of Object.entries(patterns)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return domain;
    }
  }

  return 'General';
}

// Pure function: group highlights by category (inferred domain)
export function groupHighlightsByCategory(
  highlights: readonly Highlight[]
): readonly CategoryStat[] {
  const grouped = new Map<string, Highlight[]>();

  for (const highlight of highlights) {
    const domain = inferDomain(highlight.text + ' ' + highlight.title);
    const existing = grouped.get(domain) ?? [];
    grouped.set(domain, [...existing, highlight]);
  }

  const total = highlights.length;

  return Array.from(grouped.entries())
    .map(([domain, hlList]) => ({
      domain,
      count: hlList.length,
      percentage: total > 0 ? (hlList.length / total) * 100 : 0,
      highlights: hlList
    }))
    .sort((a, b) => b.count - a.count);
}

// Helper: get emoji for domain
function getDomainEmoji(domain: string): string {
  const emojiMap: Record<string, string> = {
    'Architecture': '🏗',
    'Performance': '⚡',
    'Security': '🔒',
    'Testing': '🧪',
    'API': '🔌',
    'Database': '💾',
    'Frontend': '🎨',
    'Backend': '⚙️',
    'DevOps': '🚀',
    'AI/ML': '🤖',
    'Psychology': '🧠',
    'Philosophy': '💭',
    'Productivity': '✅',
    'Leadership': '👥',
    'General': '📚'
  };
  return emojiMap[domain] ?? '📌';
}

// Helper: tokenize into sentences
function tokenizeSentences(text: string): string[] {
  // Split on period, question mark, exclamation, but not on abbreviations
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20); // Min 20 chars for a meaningful insight
}

// Helper: score sentence for insight value
function scoreSentence(sentence: string, index: number, total: number): number {
  let score = 0;
  const lower = sentence.toLowerCase();

  // Signal: imperative verbs (action items)
  const imperatives = ['use', 'build', 'avoid', 'learn', 'focus', 'optimize', 'consider', 'ensure', 'implement'];
  if (imperatives.some(v => lower.includes(v))) score += 3;

  // Signal: technical/domain terms (capitalized words, camelCase)
  const technicalPattern = /\b[A-Z][a-z]+[A-Z]\w+\b|"[^"]+"/g;
  const matches = sentence.match(technicalPattern);
  if (matches) score += matches.length;

  // Signal: numbers/metrics
  const numberPattern = /\d+%|\$\d+|\d+ms|\d+x/g;
  if (sentence.match(numberPattern)) score += 2;

  // Signal: emphasis (ALL CAPS words, quotes)
  const emphasisPattern = /\b[A-Z]{2,}\b|"[^"]+"/g;
  if (sentence.match(emphasisPattern)) score += 2;

  // Recency: later highlights = higher weight
  const recencyBoost = (index / total) * 2;
  score += recencyBoost;

  return score;
}

// Pure function: extract key insights from highlights
export function extractKeyInsights(
  highlights: readonly Highlight[],
  topN: number = 5
): readonly Insight[] {
  const insights: Array<{ text: string; score: number; domain: string; sourceTitle: string }> = [];

  // Pass 1: Tokenize and score all sentences
  for (let i = 0; i < highlights.length; i++) {
    const hl = highlights[i];
    const sentences = tokenizeSentences(hl.text);

    for (const sentence of sentences) {
      const score = scoreSentence(sentence, i, highlights.length);
      const domain = inferDomain(sentence);

      insights.push({
        text: sentence,
        score,
        domain,
        sourceTitle: hl.title
      });
    }
  }

  // Pass 2: Simple clustering - remove very similar sentences (keep highest scored)
  const clustered = insights.filter((insight, idx) => {
    // Check if there's a higher-scored similar insight
    for (let j = 0; j < idx; j++) {
      const other = insights[j];
      if (similarity(insight.text, other.text) > 0.7 && other.score > insight.score) {
        return false; // Skip this one
      }
    }
    return true;
  });

  // Pass 3: Sort by score and take top N
  const top = [...clustered]
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return top.map(insight => ({
    ...insight,
    emoji: getDomainEmoji(insight.domain)
  }));
}

// Helper: simple similarity check (Jaccard)
function similarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));

  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

// Pure function: generate reading context paragraph
export function generateReadingContextParagraph(
  highlights: readonly Highlight[],
  articles: readonly ReaderDocument[]
): string {
  const categories = groupHighlightsByCategory(highlights);
  const uniqueSources = new Set(highlights.map(h => h.title)).size;

  if (highlights.length === 0) {
    return 'No highlights in this period.';
  }

  // Get top 2 domains
  const topDomains = categories.slice(0, 2);
  const domainText = topDomains
    .map(c => `${c.domain.toLowerCase()} (${Math.round(c.percentage)}%)`)
    .join(' + ');

  // Identify pattern
  const avgPerSource = highlights.length / Math.max(uniqueSources, 1);
  const focusType = avgPerSource > 10 ? 'Deep dive' : avgPerSource > 5 ? 'Focused reading' : 'Broad exploration';

  return `${focusType} w/ ${highlights.length} highlights across ${uniqueSources} sources. ${domainText}. ${articles.length > 0 ? `Saved ${articles.length} items` : 'Active highlighting'}.`;
}

// Pure function: generate reading pattern
export function generateReadingPattern(dailyBreakdown: readonly DailyHighlights[]): string {
  const workingDays = dailyBreakdown.filter(d =>
    !['Sat', 'Sun'].includes(d.dayOfWeek) && d.count > 0
  ).length;
  const weekendDays = dailyBreakdown.filter(d =>
    ['Sat', 'Sun'].includes(d.dayOfWeek) && d.count > 0
  ).length;

  const consecutive = findConsecutiveDays(dailyBreakdown);

  if (consecutive >= 5) return 'Consistent daily reader 📚✨';
  if (weekendDays > workingDays) return 'Weekend warrior 🏃';
  if (workingDays > 0 && weekendDays === 0) return 'Weekday learner 💼';
  if (consecutive >= 3) return 'Steady habit builder 🌱';
  return 'Burst learner 🚀';
}

// Helper: find longest consecutive streak
function findConsecutiveDays(dailyBreakdown: readonly DailyHighlights[]): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of dailyBreakdown) {
    if (day.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}
