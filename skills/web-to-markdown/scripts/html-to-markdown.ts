import TurndownService from 'turndown';

/**
 * Custom error for HTML to markdown conversion failures
 */
export class HtmlConversionError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'HtmlConversionError';
  }
}

/**
 * Configuration for HTML to markdown conversion
 */
export interface ConversionOptions {
  /** Heading style: 'atx' (#) or 'setext' (underline) */
  readonly headingStyle?: 'atx' | 'setext';
  /** Code block style: 'fenced' (```) or 'indented' */
  readonly codeBlockStyle?: 'fenced' | 'indented';
  /** List bullet marker: '-', '*', or '+' */
  readonly bulletListMarker?: '-' | '*' | '+';
}

/**
 * Default conversion configuration optimized for readability
 * - ATX headers for better markdown compatibility
 * - Fenced code blocks for syntax highlighting support
 * - Dash bullets for consistency with standard markdown style guides
 */
const DEFAULT_OPTIONS: Required<ConversionOptions> = {
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
};

/**
 * Creates configured Turndown service instance
 * Separated for testability and reusability
 */
function createTurndownService(
  options: ConversionOptions
): TurndownService {
  return new TurndownService({
    headingStyle: options.headingStyle ?? DEFAULT_OPTIONS.headingStyle,
    codeBlockStyle: options.codeBlockStyle ?? DEFAULT_OPTIONS.codeBlockStyle,
    bulletListMarker:
      options.bulletListMarker ?? DEFAULT_OPTIONS.bulletListMarker,
  });
}

/**
 * Converts HTML string to markdown format
 *
 * Uses Turndown library with opinionated defaults for clean, readable markdown.
 * Removes script/style tags and normalizes whitespace automatically.
 *
 * @param htmlContent - HTML string to convert (can be full page or fragment)
 * @param options - Optional conversion configuration
 * @returns Clean markdown string
 * @throws {HtmlConversionError} If HTML is invalid or conversion fails
 *
 * @example
 * ```ts
 * const html = '<h1>Title</h1><p>Content</p>';
 * const markdown = convertHtmlToMarkdown(html);
 * // Returns: "# Title\n\nContent"
 * ```
 */
export function convertHtmlToMarkdown(
  htmlContent: string,
  options: ConversionOptions = {}
): string {
  // Early validation prevents processing invalid input
  if (typeof htmlContent !== 'string') {
    throw new HtmlConversionError(
      `Expected string, got ${typeof htmlContent}`
    );
  }

  if (htmlContent.trim().length === 0) {
    // Empty input is valid but produces no output
    return '';
  }

  try {
    const turndownService = createTurndownService(options);
    const markdownContent = turndownService.turndown(htmlContent);

    return markdownContent;
  } catch (error) {
    // Wrap library errors for consistent error handling at call site
    throw new HtmlConversionError(
      'Failed to convert HTML to markdown',
      error
    );
  }
}
