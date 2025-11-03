import { describe, it, expect } from 'vitest';
import {
  convertHtmlToMarkdown,
  HtmlConversionError,
} from '../scripts/html-to-markdown.js';

describe('convertHtmlToMarkdown', () => {
  describe('basic HTML conversion', () => {
    // Use test.each for pure function with similar test cases
    it.each([
      {
        name: 'converts heading to ATX markdown',
        html: '<h1>Title</h1>',
        expected: '# Title',
      },
      {
        name: 'converts paragraph to plain text',
        html: '<p>Hello world</p>',
        expected: 'Hello world',
      },
      {
        name: 'converts link with href and text',
        html: '<a href="https://example.com">Link</a>',
        expected: '[Link](https://example.com)',
      },
      {
        name: 'converts strong to markdown bold',
        html: '<strong>Bold</strong>',
        expected: '**Bold**',
      },
      {
        name: 'converts em to markdown italic',
        html: '<em>Italic</em>',
        expected: '_Italic_', // Turndown uses underscores for emphasis
      },
      {
        name: 'converts code to inline code',
        html: '<code>const x = 1;</code>',
        expected: '`const x = 1;`',
      },
      {
        name: 'converts pre with code to fenced code block',
        html: '<pre><code>const x = 1;</code></pre>',
        expected: '```\nconst x = 1;\n```',
      },
      {
        name: 'converts unordered list to markdown list',
        html: '<ul><li>Item 1</li><li>Item 2</li></ul>',
        expected: '-   Item 1\n-   Item 2', // Turndown adds extra spaces after marker
      },
      {
        name: 'converts ordered list to numbered list',
        html: '<ol><li>First</li><li>Second</li></ol>',
        expected: '1.  First\n2.  Second', // Turndown adds extra space after number
      },
      {
        name: 'converts blockquote to markdown quote',
        html: '<blockquote>Quote</blockquote>',
        expected: '> Quote',
      },
    ])('$name', ({ html, expected }) => {
      const result = convertHtmlToMarkdown(html);
      expect(result.trim()).toBe(expected);
    });
  });

  describe('complex HTML structures', () => {
    it('converts nested HTML with multiple elements', () => {
      const html = `
        <article>
          <h1>Main Title</h1>
          <p>Introduction paragraph with <strong>bold</strong> text.</p>
          <h2>Section</h2>
          <ul>
            <li>Point one</li>
            <li>Point two</li>
          </ul>
          <p>Link to <a href="https://example.com">example</a>.</p>
        </article>
      `;

      const result = convertHtmlToMarkdown(html);

      expect(result).toContain('# Main Title');
      expect(result).toContain('**bold**');
      expect(result).toContain('## Section');
      expect(result).toContain('-   Point one'); // Turndown adds extra spaces
      expect(result).toContain('[example](https://example.com)');
    });

    it('processes script tags (note: Turndown does not remove scripts by default)', () => {
      const html = `
        <div>
          <p>Content</p>
          <script>alert('hello');</script>
        </div>
      `;

      const result = convertHtmlToMarkdown(html);

      // Turndown includes script content in output by default
      // For production use, consider adding custom rule to remove scripts
      expect(result).toContain('Content');
    });

    it('processes style tags (note: Turndown does not remove styles by default)', () => {
      const html = `
        <div>
          <style>.red { color: red; }</style>
          <p>Content</p>
        </div>
      `;

      const result = convertHtmlToMarkdown(html);

      // Turndown includes style content in output by default
      // For production use, consider adding custom rule to remove styles
      expect(result).toContain('Content');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty HTML input', () => {
      const result = convertHtmlToMarkdown('');
      expect(result).toBe('');
    });

    it('returns empty string for whitespace-only HTML', () => {
      const result = convertHtmlToMarkdown('   \n\t  ');
      expect(result).toBe('');
    });

    it('handles HTML with only whitespace between tags', () => {
      const html = '<p>  \n  </p>';
      const result = convertHtmlToMarkdown(html);
      // Turndown may return empty or minimal whitespace
      expect(result.trim()).toBe('');
    });

    it('throws HtmlConversionError for non-string input', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input type
        convertHtmlToMarkdown(123);
      }).toThrow(HtmlConversionError);

      expect(() => {
        // @ts-expect-error Testing invalid input type
        convertHtmlToMarkdown(null);
      }).toThrow(HtmlConversionError);
    });
  });

  describe('configuration options', () => {
    it('respects custom heading style (setext)', () => {
      const html = '<h1>Title</h1>';
      const result = convertHtmlToMarkdown(html, {
        headingStyle: 'setext',
      });

      // Setext style uses underlines for h1/h2
      expect(result).toContain('Title\n=====');
    });

    it('respects custom code block style (indented)', () => {
      const html = '<pre><code>const x = 1;</code></pre>';
      const result = convertHtmlToMarkdown(html, {
        codeBlockStyle: 'indented',
      });

      // Indented style uses 4 spaces instead of fences
      expect(result).toContain('    const x = 1;');
      expect(result).not.toContain('```');
    });

    it('respects custom bullet list marker (*)', () => {
      const html = '<ul><li>Item</li></ul>';
      const result = convertHtmlToMarkdown(html, {
        bulletListMarker: '*',
      });

      expect(result).toContain('*   Item'); // Turndown adds extra spaces
    });

    it('respects custom bullet list marker (+)', () => {
      const html = '<ul><li>Item</li></ul>';
      const result = convertHtmlToMarkdown(html, {
        bulletListMarker: '+',
      });

      expect(result).toContain('+   Item'); // Turndown adds extra spaces
    });
  });

  describe('error handling', () => {
    it('wraps conversion errors in HtmlConversionError', () => {
      // Turndown is quite robust, but we test error wrapping
      // by verifying the error type for invalid input types
      expect(() => {
        // @ts-expect-error Testing error handling
        convertHtmlToMarkdown({ invalid: 'object' });
      }).toThrow(HtmlConversionError);
    });

    it('includes error message in HtmlConversionError', () => {
      try {
        // @ts-expect-error Testing error handling
        convertHtmlToMarkdown(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(HtmlConversionError);
        expect((error as HtmlConversionError).message).toBeTruthy();
      }
    });
  });

  describe('real-world HTML examples', () => {
    it('converts typical documentation page structure', () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Docs</title>
            <script src="analytics.js"></script>
          </head>
          <body>
            <nav><a href="/">Home</a></nav>
            <main>
              <h1>API Documentation</h1>
              <p>This API provides access to our services.</p>
              <h2>Endpoints</h2>
              <ul>
                <li><code>GET /api/users</code> - List users</li>
                <li><code>POST /api/users</code> - Create user</li>
              </ul>
              <h2>Authentication</h2>
              <p>Use <strong>Bearer tokens</strong> in the Authorization header.</p>
            </main>
            <footer>© 2025</footer>
          </body>
        </html>
      `;

      const result = convertHtmlToMarkdown(html);

      // Should contain main content structure
      expect(result).toContain('# API Documentation');
      expect(result).toContain('## Endpoints');
      expect(result).toContain('`GET /api/users`');
      expect(result).toContain('**Bearer tokens**');

      // Should not contain script tags
      expect(result).not.toContain('analytics.js');
    });
  });
});
