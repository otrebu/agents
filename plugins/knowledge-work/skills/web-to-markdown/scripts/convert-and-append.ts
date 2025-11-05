#!/usr/bin/env tsx

import { readFileSync, appendFileSync } from 'node:fs';
import chalk from 'chalk';
import {
  convertHtmlToMarkdown,
  HtmlConversionError,
} from './html-to-markdown.js';

/**
 * Custom error for file operation failures
 */
export class FileOperationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'FileOperationError';
  }
}

/**
 * Configuration for appending markdown content
 */
export interface AppendOptions {
  readonly sourceUrl: string;
  readonly htmlContent: string;
  readonly outputFilePath: string;
}

/**
 * Formats markdown content with URL header for appending
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
 * Reads HTML content from file path
 * Isolated I/O for explicit side effect handling
 *
 * @param filePath - Path to HTML file
 * @returns HTML content as string
 * @throws {FileOperationError} If file cannot be read
 */
export function readHtmlFromFile(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new FileOperationError(
      `Failed to read HTML file: ${filePath}`,
      error
    );
  }
}

/**
 * Appends markdown section to output file
 * Isolated I/O for explicit side effect handling
 *
 * @param content - Markdown content to append
 * @param outputPath - Target file path
 * @throws {FileOperationError} If write fails
 */
export function appendToFile(content: string, outputPath: string): void {
  try {
    appendFileSync(outputPath, content, 'utf-8');
  } catch (error) {
    throw new FileOperationError(
      `Failed to append to file: ${outputPath}`,
      error
    );
  }
}

/**
 * Main conversion and append logic
 * Orchestrates pure functions with side effects at edges
 *
 * @param options - Conversion configuration
 * @throws {HtmlConversionError | FileOperationError} On failure
 */
export function convertAndAppend(options: AppendOptions): void {
  const { sourceUrl, htmlContent, outputFilePath } = options;

  // Convert HTML to markdown (pure function)
  const markdownContent = convertHtmlToMarkdown(htmlContent);

  // Format section with header (pure function)
  const formattedSection = formatMarkdownSection(sourceUrl, markdownContent);

  // Append to file (side effect, isolated)
  appendToFile(formattedSection, outputFilePath);
}

/**
 * Parses CLI arguments
 * Returns configuration object or null if invalid
 */
function parseCliArguments(args: string[]): AppendOptions | null {
  // Expected: convert-and-append.ts <url> <html-file> <output-file>
  if (args.length !== 3) {
    return null;
  }

  const [sourceUrl, htmlFilePath, outputFilePath] = args;

  try {
    const htmlContent = readHtmlFromFile(htmlFilePath);
    return {
      sourceUrl,
      htmlContent,
      outputFilePath,
    };
  } catch (error) {
    console.error(chalk.red('✗ Error reading HTML file:'), htmlFilePath);
    if (error instanceof FileOperationError) {
      console.error(chalk.dim(error.message));
    }
    return null;
  }
}

/**
 * CLI entry point
 * Handles argument parsing, execution, and process exit
 */
function main(): void {
  // Get CLI args (skip node and script paths)
  const args = process.argv.slice(2);

  // Show usage if invalid args
  if (args.length !== 3) {
    console.log(chalk.bold('Usage:'));
    console.log(
      '  convert-and-append.ts <url> <html-file> <output-file>'
    );
    console.log('');
    console.log(chalk.bold('Example:'));
    console.log(
      chalk.dim(
        '  tsx convert-and-append.ts https://example.com page.html output.md'
      )
    );
    process.exit(1);
  }

  const options = parseCliArguments(args);
  if (!options) {
    process.exit(1);
  }

  try {
    // Execute main logic
    convertAndAppend(options);

    // Report success
    console.log(chalk.green('✓'), 'Converted and appended:', options.sourceUrl);
  } catch (error) {
    // Report failure
    console.error(chalk.red('✗'), 'Failed:', options.sourceUrl);

    if (error instanceof HtmlConversionError) {
      console.error(chalk.dim('  Conversion error:'), error.message);
    } else if (error instanceof FileOperationError) {
      console.error(chalk.dim('  File error:'), error.message);
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
