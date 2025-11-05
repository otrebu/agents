import { describe, it, expect } from 'vitest';
import {
  groupHighlightsByDay,
  findPeakDays,
  inferDomain,
  groupHighlightsByCategory,
  extractKeyInsights,
  generateReadingContextParagraph,
  generateReadingPattern,
  type DailyHighlights,
  type DateRange,
  type Highlight,
  type ReaderDocument
} from '../analyze-highlights.js';

// Test fixtures
const createHighlight = (
  id: number,
  text: string,
  title: string,
  highlightedAt: string
): Highlight => ({
  id,
  text,
  note: null,
  location: 0,
  highlightedAt,
  url: `https://example.com/${id}`,
  bookId: 1,
  title,
  author: 'Test Author'
});

const sampleHighlights: Highlight[] = [
  createHighlight(
    1,
    'Focus on developer experience first when building APIs',
    'API Design Patterns',
    '2025-01-15T10:00:00Z'
  ),
  createHighlight(
    2,
    'Optimize for performance using caching strategies',
    'Performance Guide',
    '2025-01-15T14:00:00Z'
  ),
  createHighlight(
    3,
    'Testing should be part of the development workflow',
    'TDD Handbook',
    '2025-01-16T09:00:00Z'
  ),
  createHighlight(
    4,
    'Security vulnerabilities can be prevented with proper authentication',
    'Security Best Practices',
    '2025-01-16T15:00:00Z'
  ),
  createHighlight(
    5,
    'Understanding cognitive behavior patterns helps in decision making',
    'Psychology of Decisions',
    '2025-01-17T11:00:00Z'
  )
];

const sampleArticles: ReaderDocument[] = [
  {
    id: '1',
    url: 'https://example.com/1',
    title: 'API Design Patterns',
    author: 'Test Author',
    category: 'article',
    location: 'new',
    tags: [],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    summary: null
  }
];

describe('groupHighlightsByDay', () => {
  it('groups highlights by day correctly', () => {
    const dateRange: DateRange = {
      startDate: new Date('2025-01-15T00:00:00Z'),
      endDate: new Date('2025-01-17T23:59:59Z')
    };

    const result = groupHighlightsByDay(sampleHighlights, dateRange);

    expect(result.length).toBe(3);
    expect(result[0].date).toBe('2025-01-15');
    expect(result[0].count).toBe(2);
    expect(result[1].date).toBe('2025-01-16');
    expect(result[1].count).toBe(2);
    expect(result[2].date).toBe('2025-01-17');
    expect(result[2].count).toBe(1);
  });

  it('includes days with zero highlights', () => {
    const dateRange: DateRange = {
      startDate: new Date('2025-01-15T00:00:00Z'),
      endDate: new Date('2025-01-18T23:59:59Z')
    };

    const result = groupHighlightsByDay(sampleHighlights, dateRange);

    expect(result.length).toBe(4);
    expect(result[3].date).toBe('2025-01-18');
    expect(result[3].count).toBe(0);
  });

  it('calculates day of week correctly', () => {
    const dateRange: DateRange = {
      startDate: new Date('2025-01-15T00:00:00Z'),
      endDate: new Date('2025-01-15T23:59:59Z')
    };

    const result = groupHighlightsByDay(sampleHighlights, dateRange);

    expect(result[0].dayOfWeek).toBe('Wed');
  });

  it('handles empty highlights', () => {
    const dateRange: DateRange = {
      startDate: new Date('2025-01-15T00:00:00Z'),
      endDate: new Date('2025-01-15T23:59:59Z')
    };

    const result = groupHighlightsByDay([], dateRange);

    expect(result.length).toBe(1);
    expect(result[0].count).toBe(0);
  });
});

describe('findPeakDays', () => {
  const dailyBreakdown: DailyHighlights[] = [
    { date: '2025-01-15', dayOfWeek: 'Wed', count: 10, highlights: [] },
    { date: '2025-01-16', dayOfWeek: 'Thu', count: 5, highlights: [] },
    { date: '2025-01-17', dayOfWeek: 'Fri', count: 15, highlights: [] },
    { date: '2025-01-18', dayOfWeek: 'Sat', count: 0, highlights: [] }
  ];

  it('finds top N peak days', () => {
    const result = findPeakDays(dailyBreakdown, 2);

    expect(result.length).toBe(2);
    expect(result[0].date).toBe('2025-01-17');
    expect(result[0].count).toBe(15);
    expect(result[1].date).toBe('2025-01-15');
    expect(result[1].count).toBe(10);
  });

  it('calculates percentages correctly', () => {
    const result = findPeakDays(dailyBreakdown, 2);

    expect(result[0].percentage).toBe(50); // 15/30 = 50%
    expect(result[1].percentage).toBeCloseTo(33.33, 1); // 10/30 ≈ 33.33%
  });

  it('excludes days with zero count', () => {
    const result = findPeakDays(dailyBreakdown, 10);

    expect(result.length).toBe(3);
    expect(result.every(d => d.count > 0)).toBe(true);
  });

  it('handles topN greater than available days', () => {
    const result = findPeakDays(dailyBreakdown, 100);

    expect(result.length).toBe(3); // Only 3 days with count > 0
  });
});

describe('inferDomain', () => {
  it('identifies architecture domain', () => {
    expect(inferDomain('This is about software architecture patterns')).toBe('Architecture');
  });

  it('identifies performance domain', () => {
    expect(inferDomain('Optimize for performance and speed')).toBe('Performance');
  });

  it('identifies security domain', () => {
    expect(inferDomain('Authentication and authorization are critical')).toBe('Security');
  });

  it('identifies testing domain', () => {
    expect(inferDomain('Write unit tests for all functions')).toBe('Testing');
  });

  it('identifies API domain', () => {
    expect(inferDomain('RESTful API endpoints should follow conventions')).toBe('API');
  });

  it('identifies psychology domain', () => {
    expect(inferDomain('Cognitive behavior and emotional patterns')).toBe('Psychology');
  });

  it('defaults to General for unknown domains', () => {
    expect(inferDomain('This is about cooking recipes')).toBe('General');
  });

  it('matches first pattern found', () => {
    expect(inferDomain('API architecture design')).toBe('Architecture');
  });
});

describe('groupHighlightsByCategory', () => {
  it('groups highlights by inferred domain', () => {
    const result = groupHighlightsByCategory(sampleHighlights);

    expect(result.length).toBeGreaterThan(0);
    const domains = result.map(c => c.domain);
    // Verify at least some domains are correctly identified
    expect(domains).toContain('Performance');
    expect(domains).toContain('Security');
  });

  it('calculates counts correctly', () => {
    const result = groupHighlightsByCategory(sampleHighlights);

    const totalCount = result.reduce((sum, cat) => sum + cat.count, 0);
    expect(totalCount).toBe(sampleHighlights.length);
  });

  it('calculates percentages correctly', () => {
    const result = groupHighlightsByCategory(sampleHighlights);

    const totalPercentage = result.reduce((sum, cat) => sum + cat.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 0);
  });

  it('sorts by count descending', () => {
    const highlights = [
      ...sampleHighlights,
      createHighlight(
        6,
        'Another API example',
        'API Guide',
        '2025-01-17T12:00:00Z'
      )
    ];

    const result = groupHighlightsByCategory(highlights);

    // Check that counts are in descending order
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].count).toBeGreaterThanOrEqual(result[i].count);
    }
  });

  it('handles empty highlights', () => {
    const result = groupHighlightsByCategory([]);

    expect(result.length).toBe(0);
  });
});

describe('extractKeyInsights', () => {
  it('extracts top N insights', () => {
    const result = extractKeyInsights(sampleHighlights, 3);

    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('assigns domain and emoji to insights', () => {
    const result = extractKeyInsights(sampleHighlights, 5);

    result.forEach(insight => {
      expect(insight.domain).toBeDefined();
      expect(insight.emoji).toBeDefined();
      expect(insight.sourceTitle).toBeDefined();
    });
  });

  it('scores sentences and returns highest scored', () => {
    const result = extractKeyInsights(sampleHighlights, 5);

    // Check that scores are in descending order
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
    }
  });

  it('handles highlights with short text', () => {
    const shortHighlights = [
      createHighlight(1, 'Too short', 'Test', '2025-01-15T10:00:00Z'),
      createHighlight(
        2,
        'This is a longer sentence that should be extracted as an insight',
        'Test',
        '2025-01-15T11:00:00Z'
      )
    ];

    const result = extractKeyInsights(shortHighlights, 5);

    expect(result.length).toBeGreaterThan(0);
  });

  it('handles empty highlights', () => {
    const result = extractKeyInsights([], 5);

    expect(result.length).toBe(0);
  });
});

describe('generateReadingContextParagraph', () => {
  it('generates context for highlights', () => {
    const result = generateReadingContextParagraph(sampleHighlights, sampleArticles);

    expect(result).toContain('5 highlights');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('identifies focus type based on highlights per source', () => {
    const deepDiveHighlights = Array.from({ length: 15 }, (_, i) =>
      createHighlight(
        i,
        'Test highlight about APIs and architecture patterns',
        'Same Source',
        '2025-01-15T10:00:00Z'
      )
    );

    const result = generateReadingContextParagraph(deepDiveHighlights, []);

    expect(result).toContain('Deep dive');
  });

  it('handles empty highlights', () => {
    const result = generateReadingContextParagraph([], []);

    expect(result).toContain('No highlights');
  });

  it('includes article count when provided', () => {
    const result = generateReadingContextParagraph(sampleHighlights, sampleArticles);

    expect(result).toContain('Saved 1 items');
  });
});

describe('generateReadingPattern', () => {
  it('identifies consistent daily reader', () => {
    const dailyBreakdown: DailyHighlights[] = Array.from({ length: 7 }, (_, i) => ({
      date: `2025-01-${15 + i}`,
      dayOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      count: 5,
      highlights: []
    }));

    const result = generateReadingPattern(dailyBreakdown);

    expect(result).toContain('Consistent daily reader');
  });

  it('identifies weekend warrior', () => {
    const dailyBreakdown: DailyHighlights[] = [
      { date: '2025-01-13', dayOfWeek: 'Mon', count: 0, highlights: [] },
      { date: '2025-01-14', dayOfWeek: 'Tue', count: 0, highlights: [] },
      { date: '2025-01-15', dayOfWeek: 'Wed', count: 0, highlights: [] },
      { date: '2025-01-16', dayOfWeek: 'Thu', count: 0, highlights: [] },
      { date: '2025-01-17', dayOfWeek: 'Fri', count: 0, highlights: [] },
      { date: '2025-01-18', dayOfWeek: 'Sat', count: 10, highlights: [] },
      { date: '2025-01-19', dayOfWeek: 'Sun', count: 10, highlights: [] }
    ];

    const result = generateReadingPattern(dailyBreakdown);

    expect(result).toContain('Weekend warrior');
  });

  it('identifies weekday learner', () => {
    // Less than 5 consecutive, only weekdays active
    const dailyBreakdown: DailyHighlights[] = [
      { date: '2025-01-13', dayOfWeek: 'Mon', count: 5, highlights: [] },
      { date: '2025-01-14', dayOfWeek: 'Tue', count: 0, highlights: [] },
      { date: '2025-01-15', dayOfWeek: 'Wed', count: 5, highlights: [] },
      { date: '2025-01-16', dayOfWeek: 'Thu', count: 5, highlights: [] },
      { date: '2025-01-17', dayOfWeek: 'Fri', count: 0, highlights: [] },
      { date: '2025-01-18', dayOfWeek: 'Sat', count: 0, highlights: [] },
      { date: '2025-01-19', dayOfWeek: 'Sun', count: 0, highlights: [] }
    ];

    const result = generateReadingPattern(dailyBreakdown);

    expect(result).toContain('Weekday learner');
  });

  it('identifies steady habit builder for 3+ consecutive days', () => {
    // Exactly 3 consecutive days, with weekends included
    const dailyBreakdown: DailyHighlights[] = [
      { date: '2025-01-15', dayOfWeek: 'Wed', count: 5, highlights: [] },
      { date: '2025-01-16', dayOfWeek: 'Thu', count: 5, highlights: [] },
      { date: '2025-01-17', dayOfWeek: 'Fri', count: 5, highlights: [] },
      { date: '2025-01-18', dayOfWeek: 'Sat', count: 5, highlights: [] }
    ];

    const result = generateReadingPattern(dailyBreakdown);

    expect(result).toContain('Steady habit builder');
  });

  it('identifies burst learner for sporadic reading', () => {
    // No consecutive days, no pattern
    const dailyBreakdown: DailyHighlights[] = [
      { date: '2025-01-15', dayOfWeek: 'Wed', count: 5, highlights: [] },
      { date: '2025-01-16', dayOfWeek: 'Thu', count: 0, highlights: [] },
      { date: '2025-01-17', dayOfWeek: 'Fri', count: 0, highlights: [] },
      { date: '2025-01-18', dayOfWeek: 'Sat', count: 5, highlights: [] },
      { date: '2025-01-19', dayOfWeek: 'Sun', count: 0, highlights: [] }
    ];

    const result = generateReadingPattern(dailyBreakdown);

    expect(result).toContain('Burst learner');
  });
});
