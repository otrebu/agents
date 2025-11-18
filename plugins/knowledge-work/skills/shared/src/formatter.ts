/**
 * Standardized markdown formatting for research outputs
 *
 * Generates consistent structure across all research skills while allowing
 * flexibility in the Findings section for skill-specific content.
 */

import type { ResearchOutput, SourceReference } from './types.js';

/**
 * Format research output as standardized markdown
 *
 * Structure:
 * - Title
 * - Compact metadata line
 * - Summary (2-3 sentences)
 * - Findings (skill-specific, passed as pre-formatted markdown)
 * - Analysis (patterns, recommendations, tradeoffs)
 * - Sources (organized by type)
 */
export function formatResearchMarkdown(data: ResearchOutput): string {
  const sections: string[] = [];

  // Title
  sections.push(`# Research: ${data.metadata.query.original}\n`);

  // Metadata line (compact, high-signal)
  const durationSec = Math.round(data.metadata.execution.durationMs / 1000);
  const mode = data.metadata.execution.mode ? ` • ${data.metadata.execution.mode}` : '';
  sections.push(
    `**Metadata:** ${data.metadata.skill} • ${data.metadata.timestamp} • ${durationSec}s • ${data.metadata.results.sources} sources${mode}\n`
  );

  // Summary
  sections.push('## Summary\n');
  sections.push(`${data.summary}\n`);

  // Findings (skill-specific content, pre-formatted)
  sections.push('## Findings\n');
  sections.push(data.findings);

  // Analysis
  sections.push('\n## Analysis\n');

  if (data.analysis.patterns.length > 0) {
    sections.push('\n**Patterns:**\n');
    data.analysis.patterns.forEach(pattern => {
      sections.push(`- ${pattern}`);
    });
  }

  if (data.analysis.recommendations.length > 0) {
    sections.push('\n\n**Recommendations:**\n');
    data.analysis.recommendations.forEach(rec => {
      sections.push(`- ${rec}`);
    });
  }

  if (data.analysis.tradeoffs && data.analysis.tradeoffs.length > 0) {
    sections.push('\n\n**Trade-offs:**\n');
    data.analysis.tradeoffs.forEach(tradeoff => {
      sections.push(`- ${tradeoff}`);
    });
  }

  // Sources
  sections.push('\n\n## Sources\n');
  sections.push(formatSources(data.sources));

  return sections.join('\n');
}

/**
 * Format source references, organized by type (GitHub vs Web)
 */
function formatSources(sources: SourceReference[]): string {
  const githubSources = sources.filter(s => s.domain.includes('github.com'));
  const webSources = sources.filter(s => !s.domain.includes('github.com'));

  const lines: string[] = [];

  if (githubSources.length > 0) {
    lines.push('### GitHub\n');
    githubSources.forEach(source => {
      lines.push(`- [${source.title}](${source.url})`);
    });
  }

  if (webSources.length > 0) {
    if (githubSources.length > 0) {
      lines.push(''); // Blank line between sections
    }
    lines.push('### Web\n');
    webSources.forEach(source => {
      lines.push(`- [${source.title}](${source.url}) • ${source.domain}`);
    });
  }

  return lines.join('\n');
}

/**
 * Create a minimal metadata-only header (for partial results or errors)
 */
export function formatMetadataHeader(
  skill: string,
  query: string,
  timestamp: string,
  durationMs: number
): string {
  const durationSec = Math.round(durationMs / 1000);
  return `# Research: ${query}\n\n**Metadata:** ${skill} • ${timestamp} • ${durationSec}s\n\n`;
}
