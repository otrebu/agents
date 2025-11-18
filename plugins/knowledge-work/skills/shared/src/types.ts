/**
 * Shared type definitions for knowledge-work research skills
 */

export type SkillName = 'gh-code-search' | 'gemini-research' | 'parallel-search';
export type ResearchDirectory = 'github' | 'google' | 'parallel' | 'unified';
export type ResearchMode = 'quick' | 'deep' | 'code';

export interface ResearchMetadata {
  skill: SkillName;
  timestamp: string; // YYYYMMDDHHMMSS
  query: {
    original: string;
    sanitized: string;
    queries_executed?: string[];
  };
  execution: {
    startTime: string; // ISO 8601
    endTime: string;
    durationMs: number;
    mode?: ResearchMode;
  };
  results: {
    count: number;
    sources: number;
  };
}

export interface SourceReference {
  title: string;
  url: string;
  domain: string;
  relevance?: number;
}

export interface ResearchAnalysis {
  patterns: string[];
  recommendations: string[];
  tradeoffs?: string[];
}

export interface ResearchOutput {
  metadata: ResearchMetadata;
  summary: string;
  findings: string; // Skill-specific markdown content
  analysis: ResearchAnalysis;
  sources: SourceReference[];
}
