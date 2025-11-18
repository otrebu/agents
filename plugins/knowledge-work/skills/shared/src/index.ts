/**
 * Shared utilities for knowledge-work research skills
 *
 * Provides:
 * - Consistent timestamp generation
 * - Unified filename sanitization
 * - Standardized file persistence
 * - Common markdown formatting
 * - Shared type definitions
 */

// Type exports
export type {
  SkillName,
  ResearchDirectory,
  ResearchMode,
  ResearchMetadata,
  SourceReference,
  ResearchAnalysis,
  ResearchOutput,
} from './types.js';

// Utility exports
export { generateTimestamp, generateISOTimestamp } from './utils/timestamp.js';
export { sanitizeForFilename, extractDomain } from './utils/sanitizer.js';
export { saveResearchReport, generateFilename } from './utils/file-saver.js';
export { formatResearchMarkdown, formatMetadataHeader } from './formatter.js';
