import { describe, it, expect } from 'vitest';
import {
  generateTimestamp,
  formatMarkdownSection,
} from '../scripts/scrape-and-convert.js';

describe('generateTimestamp', () => {
  it('should format date as YYYYMMDD_HHMMSS', () => {
    const date = new Date('2025-11-03T14:30:52');
    const result = generateTimestamp(date);
    expect(result).toBe('20251103_143052');
  });

  it('should pad single digits with zeros', () => {
    const date = new Date('2025-01-05T09:08:07');
    const result = generateTimestamp(date);
    expect(result).toBe('20250105_090807');
  });

  it('should handle midnight correctly', () => {
    const date = new Date('2025-12-31T00:00:00');
    const result = generateTimestamp(date);
    expect(result).toBe('20251231_000000');
  });
});

describe('formatMarkdownSection', () => {
  it('should format URL and content with header', () => {
    const url = 'https://example.com';
    const content = '# Title\n\nSome content';
    const result = formatMarkdownSection(url, content);

    expect(result).toContain('## 📄 https://example.com');
    expect(result).toContain('# Title');
    expect(result).toContain('Some content');
    expect(result).toContain('---');
  });

  it('should handle empty content', () => {
    const url = 'https://example.com';
    const content = '';
    const result = formatMarkdownSection(url, content);

    expect(result).toContain('## 📄 https://example.com');
    expect(result).toContain('---');
  });

  it('should preserve markdown formatting', () => {
    const url = 'https://example.com';
    const content = '**Bold** and *italic*\n\n- List item';
    const result = formatMarkdownSection(url, content);

    expect(result).toContain('**Bold**');
    expect(result).toContain('*italic*');
    expect(result).toContain('- List item');
  });
});
