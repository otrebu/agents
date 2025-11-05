#!/usr/bin/env tsx

import { chromium, Browser, Page } from 'playwright';
import { writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import ora from 'ora';
import {
  convertHtmlToMarkdown,
  HtmlConversionError,
} from './html-to-markdown.js';

// Get project root (2 levels up from scripts/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '../../..');

/**
 * Custom error for browser operations
 */
export class BrowserError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'BrowserError';
  }
}

/**
 * Custom error for file operations
 */
export class FileError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'FileError';
  }
}

/**
 * Configuration for scraping operation
 */
export interface ScrapeConfig {
  readonly urls: readonly string[];
  readonly outputDir: string;
  readonly timeout: number;
}

/**
 * Result of scraping a single URL
 */
export interface ScrapeResult {
  readonly url: string;
  readonly success: boolean;
  readonly markdown?: string;
  readonly error?: string;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  outputDir: join(PROJECT_ROOT, 'docs/web-captures'),
  timeout: 30000, // 30 seconds
};

/**
 * Generates timestamp in YYYYMMDD_HHMMSS format
 * Pure function for testability
 */
export function generateTimestamp(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/**
 * Creates output file with header
 * Isolated I/O for explicit side effect handling
 */
export function initializeOutputFile(
  outputPath: string,
  urlCount: number
): void {
  try {
    const timestamp = generateTimestamp();
    const now = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const header = `# Web Captures - ${now}

Generated: ${timestamp}
URLs: ${urlCount}

---
`;

    writeFileSync(outputPath, header, 'utf-8');
  } catch (error) {
    throw new FileError(`Failed to initialize output file: ${outputPath}`, error);
  }
}

/**
 * Formats markdown content with URL header
 * Pure function for testability
 */
export function formatMarkdownSection(
  url: string,
  markdownContent: string
): string {
  return `
## 📄 ${url}

${markdownContent}

---
`;
}

/**
 * Appends markdown section to output file
 * Isolated I/O for explicit side effect handling
 */
export function appendMarkdownToFile(
  content: string,
  outputPath: string
): void {
  try {
    appendFileSync(outputPath, content, 'utf-8');
  } catch (error) {
    throw new FileError(`Failed to append to file: ${outputPath}`, error);
  }
}

/**
 * Scrapes a single URL with headless browser
 * Returns result with success/error status
 */
export async function scrapeUrl(
  browser: Browser,
  url: string,
  timeoutMs: number
): Promise<ScrapeResult> {
  let page: Page | null = null;

  try {
    page = await browser.newPage();

    // Navigate with timeout
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: timeoutMs,
    });

    // Clean HTML: remove scripts, styles, and extract main content
    const html = await page.evaluate(() => {
      // Remove all script and style tags
      document.querySelectorAll('script, style, noscript').forEach(el => el.remove());

      // Try to find main content area (common selectors for docs sites)
      const mainSelectors = [
        'main',
        'article',
        '[role="main"]',
        '.main-content',
        '#main-content',
        '.content',
        '#content',
      ];

      let contentElement = null;
      for (const selector of mainSelectors) {
        contentElement = document.querySelector(selector);
        if (contentElement) break;
      }

      // Return main content if found, otherwise body
      return (contentElement || document.body).innerHTML;
    });

    // Convert to markdown
    const markdown = convertHtmlToMarkdown(html);

    return {
      url,
      success: true,
      markdown,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      url,
      success: false,
      error: errorMessage,
    };
  } finally {
    // Always close page to free resources
    if (page) {
      await page.close().catch(() => {
        // Ignore close errors
      });
    }
  }
}

/**
 * Scrapes multiple URLs and saves to single timestamped file
 * Main orchestration function
 */
export async function scrapeAndConvert(
  config: ScrapeConfig
): Promise<{ outputPath: string; results: readonly ScrapeResult[] }> {
  const { urls, outputDir, timeout } = config;

  // Ensure output directory exists
  try {
    mkdirSync(outputDir, { recursive: true });
  } catch (error) {
    throw new FileError(`Failed to create output directory: ${outputDir}`, error);
  }

  // Generate output file path
  const timestamp = generateTimestamp();
  const outputPath = join(outputDir, `${timestamp}.md`);

  // Initialize output file with header
  initializeOutputFile(outputPath, urls.length);

  // Launch browser once for all URLs
  let browser: Browser | null = null;
  const results: ScrapeResult[] = [];

  try {
    browser = await chromium.launch({ headless: true });

    // Process each URL sequentially
    for (const url of urls) {
      const spinner = ora(`Scraping ${url}`).start();

      const result = await scrapeUrl(browser, url, timeout);
      results.push(result);

      if (result.success && result.markdown) {
        // Format and append to file
        const section = formatMarkdownSection(url, result.markdown);
        appendMarkdownToFile(section, outputPath);
        spinner.succeed(chalk.green(`✓ ${url}`));
      } else {
        spinner.fail(chalk.red(`✗ ${url}: ${result.error}`));
      }
    }

    return { outputPath, results };
  } catch (error) {
    throw new BrowserError('Browser operation failed', error);
  } finally {
    // Always close browser
    if (browser) {
      await browser.close().catch(() => {
        // Ignore close errors
      });
    }
  }
}

/**
 * Parses CLI arguments
 * Returns configuration or null if invalid
 */
function parseCliArguments(args: string[]): ScrapeConfig | null {
  if (args.length === 0) {
    return null;
  }

  return {
    urls: args,
    outputDir: DEFAULT_CONFIG.outputDir,
    timeout: DEFAULT_CONFIG.timeout,
  };
}

/**
 * CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.bold('Usage:'));
    console.log('  scrape-and-convert.ts <url1> [url2] [url3] ...');
    console.log('');
    console.log(chalk.bold('Example:'));
    console.log(
      chalk.dim('  tsx scrape-and-convert.ts https://example.com https://example.org')
    );
    console.log('');
    console.log(chalk.bold('Output:'));
    console.log(chalk.dim('  docs/web-captures/YYYYMMDD_HHMMSS.md'));
    process.exit(1);
  }

  const config = parseCliArguments(args);
  if (!config) {
    process.exit(1);
  }

  console.log(chalk.bold(`\nScraping ${config.urls.length} URL(s)...\n`));

  try {
    const { outputPath, results } = await scrapeAndConvert(config);

    // Summary
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    console.log('');
    console.log(chalk.bold('Summary:'));
    console.log(chalk.green(`  ✓ Success: ${successCount}`));
    if (failureCount > 0) {
      console.log(chalk.red(`  ✗ Failed: ${failureCount}`));
    }
    console.log('');
    console.log(chalk.bold('Output:'));
    console.log(chalk.cyan(`  ${outputPath}`));

    process.exit(failureCount > 0 ? 1 : 0);
  } catch (error) {
    console.error(chalk.red('\n✗ Fatal error:'));

    if (error instanceof BrowserError) {
      console.error(chalk.dim('  Browser error:'), error.message);
    } else if (error instanceof FileError) {
      console.error(chalk.dim('  File error:'), error.message);
    } else if (error instanceof HtmlConversionError) {
      console.error(chalk.dim('  Conversion error:'), error.message);
    } else {
      console.error(chalk.dim('  Unexpected error:'), error);
    }

    process.exit(1);
  }
}

// Run CLI if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
