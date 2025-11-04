import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getDateRange,
  formatDateRange,
  getTodayDateRange,
  type DatePreset
} from '../analyze-highlights.js';

describe('Date Range Logic', () => {
  let now: Date;

  beforeEach(() => {
    // Mock current date to 2025-01-15 12:00:00
    now = new Date('2025-01-15T12:00:00.000Z');
    vi.setSystemTime(now);
  });

  describe('getDateRange with presets', () => {
    it('returns today range when preset is today', () => {
      const range = getDateRange('today');

      expect(range.startDate.getFullYear()).toBe(2025);
      expect(range.startDate.getMonth()).toBe(0); // January
      expect(range.startDate.getDate()).toBe(15);
      expect(range.startDate.getHours()).toBe(0);
      expect(range.startDate.getMinutes()).toBe(0);

      expect(range.endDate).toBeDefined();
      expect(range.endDate?.getTime()).toBe(now.getTime());
    });

    it('returns yesterday range when preset is yesterday', () => {
      const range = getDateRange('yesterday');

      expect(range.startDate.getDate()).toBe(14);
      expect(range.endDate?.getDate()).toBe(15);
    });

    it('returns last-week range (7 days)', () => {
      const range = getDateRange('last-week');

      const expectedStart = new Date('2025-01-15T00:00:00.000Z');
      expectedStart.setDate(expectedStart.getDate() - 7);

      expect(range.startDate.getDate()).toBe(8);
      expect(range.endDate?.getTime()).toBe(now.getTime());
    });

    it('returns last-month range (30 days)', () => {
      const range = getDateRange('last-month');

      expect(range.startDate.getDate()).toBe(16);
      expect(range.startDate.getMonth()).toBe(11); // December
      expect(range.endDate?.getTime()).toBe(now.getTime());
    });

    it('defaults to last 7 days when no preset provided', () => {
      const range = getDateRange();

      expect(range.startDate.getDate()).toBe(8);
      expect(range.endDate?.getTime()).toBe(now.getTime());
    });
  });

  describe('getDateRange with custom ranges', () => {
    it('uses custom range when provided', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-07');

      const range = getDateRange(undefined, { startDate: start, endDate: end });

      expect(range.startDate).toBe(start);
      expect(range.endDate).toBe(end);
    });

    it('handles custom range without end date', () => {
      const start = new Date('2025-01-01');

      const range = getDateRange(undefined, { startDate: start });

      expect(range.startDate).toBe(start);
      expect(range.endDate).toBeUndefined();
    });

    it('prefers custom range over preset', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-07');

      const range = getDateRange('today', { startDate: start, endDate: end });

      expect(range.startDate).toBe(start);
      expect(range.endDate).toBe(end);
    });
  });

  describe('getTodayDateRange', () => {
    it('returns today range for backwards compat', () => {
      const range = getTodayDateRange();

      expect(range.startDate.getDate()).toBe(15);
      expect(range.startDate.getHours()).toBe(0);
      expect(range.endDate?.getTime()).toBe(now.getTime());
    });
  });

  describe('formatDateRange', () => {
    it('formats today preset', () => {
      const range = getDateRange('today');
      expect(formatDateRange(range, 'today')).toBe('Today');
    });

    it('formats yesterday preset', () => {
      const range = getDateRange('yesterday');
      expect(formatDateRange(range, 'yesterday')).toBe('Yesterday');
    });

    it('formats last-week preset', () => {
      const range = getDateRange('last-week');
      expect(formatDateRange(range, 'last-week')).toBe('Last 7 days');
    });

    it('formats last-month preset', () => {
      const range = getDateRange('last-month');
      expect(formatDateRange(range, 'last-month')).toBe('Last 30 days');
    });

    it('formats custom range with both dates', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-07');
      const range = { startDate: start, endDate: end };

      const formatted = formatDateRange(range);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('1');
      expect(formatted).toContain('7');
      expect(formatted).toContain('-');
    });

    it('formats custom range without end date', () => {
      const start = new Date('2025-01-01');
      const range = { startDate: start };

      const formatted = formatDateRange(range);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('1');
      expect(formatted).toContain('now');
    });
  });

  describe('Edge cases', () => {
    it('handles month boundaries correctly for yesterday', () => {
      vi.setSystemTime(new Date('2025-02-01T12:00:00.000Z'));

      const range = getDateRange('yesterday');

      expect(range.startDate.getDate()).toBe(31);
      expect(range.startDate.getMonth()).toBe(0); // January
      expect(range.endDate?.getDate()).toBe(1);
      expect(range.endDate?.getMonth()).toBe(1); // February
    });

    it('handles year boundaries correctly for last-month', () => {
      vi.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));

      const range = getDateRange('last-month');

      expect(range.startDate.getMonth()).toBe(11); // December
      expect(range.startDate.getFullYear()).toBe(2024);
      expect(range.endDate?.getMonth()).toBe(0); // January
      expect(range.endDate?.getFullYear()).toBe(2025);
    });
  });
});
