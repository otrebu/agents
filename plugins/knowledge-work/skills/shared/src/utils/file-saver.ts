/**
 * File persistence utilities for research reports
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ResearchDirectory } from '../types.js';
import { generateTimestamp } from './timestamp.js';
import { sanitizeForFilename } from './sanitizer.js';

/**
 * Get the project root directory
 * Navigates up from shared module to project root
 */
function getProjectRoot(): string {
  // This file is in plugins/knowledge-work/skills/shared/src/utils/
  // Need to go up 6 levels to reach project root
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, '..', '..', '..', '..', '..', '..');
}

/**
 * Ensure directory exists, create if needed
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Save research report to appropriate directory with consistent naming
 *
 * @param content - Markdown content to save
 * @param directory - Research subdirectory (github, google, parallel, unified)
 * @param topic - User's original query/topic
 * @returns Absolute path to saved file
 */
export function saveResearchReport(
  content: string,
  directory: ResearchDirectory,
  topic: string
): string {
  const projectRoot = getProjectRoot();
  const timestamp = generateTimestamp();
  const sanitized = sanitizeForFilename(topic);
  const filename = `${timestamp}-${sanitized}.md`;

  const dirPath = join(projectRoot, 'docs', 'research', directory);
  ensureDirectoryExists(dirPath);

  const filepath = join(dirPath, filename);
  writeFileSync(filepath, content, 'utf-8');

  return filepath;
}

/**
 * Generate filename without saving (useful for preview/validation)
 */
export function generateFilename(topic: string): string {
  const timestamp = generateTimestamp();
  const sanitized = sanitizeForFilename(topic);
  return `${timestamp}-${sanitized}.md`;
}
