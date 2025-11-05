#!/usr/bin/env node

// Main CLI entry point for fetching Readwise activity
// CLI tool: use human-readable terminal output

import chalk from 'chalk';
import ora from 'ora';
import {
  fetchHighlights,
  fetchReaderDocuments,
  type ReadwiseConfig
} from './readwise-client.js';
import {
  groupHighlightsBySource,
  summarizeArticles,
  getDateRange,
  findTopHighlightedSources,
  formatDate,
  formatDateRange,
  truncateText,
  groupHighlightsByDay,
  findPeakDays,
  groupHighlightsByCategory,
  extractKeyInsights,
  generateReadingContextParagraph,
  generateReadingPattern,
  type DateRange,
  type DatePreset
} from './analyze-highlights.js';

// CLI configuration
interface CliOptions {
  readonly mode:
    | 'learnings'
    | 'timeline'
    | 'categories'
    | 'dashboard'
    | 'articles'
    | 'highlights'
    | 'top-highlighted'
    | 'all';
  readonly topN?: number;
  readonly preset?: DatePreset;
  readonly customRange?: { startDate: Date; endDate?: Date };
}

async function main(): Promise<void> {
  // Parse args
  const args = process.argv.slice(2);
  const options = parseCliArgs(args);

  // Get API token from env
  const apiToken = process.env.READWISE_API_TOKEN;
  if (!apiToken) {
    console.error(chalk.red('❌ Error: READWISE_API_TOKEN env var not set'));
    console.log(
      chalk.dim('Get your token from: https://readwise.io/access_token')
    );
    process.exit(1);
  }

  const config: ReadwiseConfig = { apiToken };
  const dateRange = getDateRange(options.preset, options.customRange);

  // Execute based on mode
  // New default order: learnings → timeline → categories → dashboard
  if (options.mode === 'learnings' || options.mode === 'all') {
    await showKeyLearnings(config, dateRange, options.preset);
  }

  if (options.mode === 'timeline' || options.mode === 'all') {
    await showActivityTimeline(config, dateRange, options.preset);
  }

  if (options.mode === 'categories' || options.mode === 'all') {
    await showByCategory(config, dateRange, options.preset);
  }

  if (options.mode === 'dashboard' || options.mode === 'all') {
    await showStatsDashboard(config, dateRange, options.preset);
  }

  // Legacy modes (still available individually)
  if (options.mode === 'articles') {
    await showArticles(config, dateRange, options.preset);
  }

  if (options.mode === 'highlights') {
    await showHighlights(config, dateRange, options.preset);
  }

  if (options.mode === 'top-highlighted') {
    await showTopHighlighted(config, dateRange, options.preset, options.topN ?? 10);
  }
}

// Parse CLI arguments into options
function parseCliArgs(args: string[]): CliOptions {
  let mode: CliOptions['mode'] = 'all';
  let topN: number | undefined;
  let preset: DatePreset | undefined;
  let fromDate: Date | undefined;
  let toDate: Date | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Mode args
    if (
      [
        'learnings',
        'timeline',
        'categories',
        'dashboard',
        'articles',
        'highlights',
        'top-highlighted',
        'all'
      ].includes(arg)
    ) {
      mode = arg as CliOptions['mode'];
      continue;
    }

    // Date preset flags
    if (arg === '--today') {
      preset = 'today';
      continue;
    }
    if (arg === '--yesterday') {
      preset = 'yesterday';
      continue;
    }
    if (arg === '--last-week') {
      preset = 'last-week';
      continue;
    }
    if (arg === '--last-month') {
      preset = 'last-month';
      continue;
    }

    // Custom date flags
    if (arg === '--from' && i + 1 < args.length) {
      fromDate = new Date(args[++i]);
      continue;
    }
    if (arg === '--to' && i + 1 < args.length) {
      toDate = new Date(args[++i]);
      continue;
    }

    // TopN number
    const parsed = parseInt(arg, 10);
    if (!isNaN(parsed)) {
      topN = parsed;
    }
  }

  const customRange =
    fromDate || toDate
      ? { startDate: fromDate ?? new Date(), endDate: toDate }
      : undefined;

  return { mode, topN, preset, customRange };
}

// Rendering utilities
function renderActivityBar(count: number, maxCount: number, width: number = 30): string {
  if (maxCount === 0) return '░'.repeat(width);

  const blocks = ['░', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  const ratio = count / maxCount;
  const filled = Math.floor(ratio * width);
  const partial = (ratio * width) % 1;
  const blockIndex = Math.floor(partial * (blocks.length - 1));

  let bar = '█'.repeat(filled);
  if (filled < width && blockIndex > 0) {
    bar += blocks[blockIndex];
  }
  bar += '░'.repeat(Math.max(0, width - bar.length));

  return bar;
}

function renderCategoryBar(count: number, maxCount: number, width: number = 14): string {
  return renderActivityBar(count, maxCount, width);
}

function formatPercentage(value: number): string {
  return value >= 10 ? `${Math.round(value)}%` : `${value.toFixed(1)}%`;
}

async function showArticles(
  config: ReadwiseConfig,
  dateRange: DateRange,
  preset?: DatePreset
): Promise<void> {
  const spinner = ora('Fetching articles...').start();

  const result = await fetchReaderDocuments(config, {
    updatedAfter: dateRange.startDate,
    updatedBefore: dateRange.endDate,
    location: 'new'
  });

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch articles: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Articles fetched!'));

  const summary = summarizeArticles(result.data);
  const dateLabel = formatDateRange(dateRange, preset);

  console.log('\n' + chalk.bold.blue(`📚 Articles Saved (${dateLabel})`));
  console.log(chalk.dim('━'.repeat(50)) + '\n');
  console.log(chalk.bold(`Total: ${summary.totalCount} items\n`));

  if (summary.totalCount === 0) {
    console.log(chalk.dim('No articles saved in this period.\n'));
    return;
  }

  console.log(chalk.bold('By Category:'));
  for (const [category, count] of Object.entries(summary.byCategory)) {
    console.log(chalk.dim('  • ') + `${category}: ${count}`);
  }

  console.log('\n' + chalk.bold('Recent Articles:'));
  for (let i = 0; i < Math.min(10, summary.articles.length); i++) {
    const article = summary.articles[i];
    console.log(
      chalk.dim(`  ${i + 1}. `) + chalk.white.bold(article.title)
    );
    if (article.author) {
      console.log(chalk.dim(`     by ${article.author}`));
    }
    console.log(chalk.dim(`     ${article.url}\n`));
  }

  if (summary.totalCount > 10) {
    console.log(
      chalk.dim(`  ... and ${summary.totalCount - 10} more articles\n`)
    );
  }
}

async function showHighlights(
  config: ReadwiseConfig,
  dateRange: DateRange,
  preset?: DatePreset
): Promise<void> {
  const spinner = ora('Fetching highlights...').start();

  const result = await fetchHighlights(config, dateRange);

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch highlights: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Highlights fetched!'));

  const grouped = groupHighlightsBySource(result.data);
  const totalCount = result.data.length;
  const dateLabel = formatDateRange(dateRange, preset);

  console.log('\n' + chalk.bold.yellow(`✨ Highlights Created (${dateLabel})`));
  console.log(chalk.dim('━'.repeat(50)) + '\n');
  console.log(
    chalk.bold(`Total: ${totalCount} highlights from ${grouped.length} sources\n`)
  );

  if (totalCount === 0) {
    console.log(chalk.dim('No highlights created in this period.\n'));
    return;
  }

  for (const source of grouped) {
    console.log(chalk.bold.cyan(`📖 "${source.sourceTitle}"`));
    if (source.sourceAuthor) {
      console.log(chalk.dim(`   by ${source.sourceAuthor}`));
    }
    console.log(chalk.dim(`   ${source.count} highlights\n`));

    // Show first 3 highlights per source
    for (let i = 0; i < Math.min(3, source.highlights.length); i++) {
      const hl = source.highlights[i];
      const text = truncateText(hl.text, 200);
      console.log(chalk.white(`   "${text}"`));
      if (hl.note) {
        console.log(chalk.dim(`   📝 Note: ${truncateText(hl.note, 150)}`));
      }
      console.log();
    }

    if (source.highlights.length > 3) {
      console.log(
        chalk.dim(`   ... and ${source.highlights.length - 3} more\n`)
      );
    }
  }
}

async function showTopHighlighted(
  config: ReadwiseConfig,
  dateRange: DateRange,
  preset: DatePreset | undefined,
  topN: number
): Promise<void> {
  const spinner = ora('Analyzing most highlighted content...').start();

  const result = await fetchHighlights(config, dateRange);

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch highlights: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Analysis complete!'));

  const grouped = groupHighlightsBySource(result.data);
  const topSources = findTopHighlightedSources(grouped, topN);
  const dateLabel = formatDateRange(dateRange, preset);

  console.log('\n' + chalk.bold.red(`🔥 Most Highlighted Content (${dateLabel})`));
  console.log(chalk.dim('━'.repeat(50)) + '\n');

  if (topSources.length === 0) {
    console.log(chalk.dim('No highlights found.\n'));
    return;
  }

  for (let i = 0; i < topSources.length; i++) {
    const source = topSources[i];
    console.log(
      chalk.bold(`${i + 1}. `) + chalk.white.bold(source.sourceTitle)
    );
    if (source.sourceAuthor) {
      console.log(chalk.dim(`   by ${source.sourceAuthor}`));
    }
    console.log(chalk.yellow(`   ${source.count} highlights\n`));

    // Show most recent highlight
    const recent = source.highlights[0];
    const text = truncateText(recent.text, 150);
    console.log(chalk.dim('   Recent: ') + chalk.white(`"${text}"`));
    console.log();
  }
}

async function showKeyLearnings(
  config: ReadwiseConfig,
  dateRange: DateRange,
  preset?: DatePreset
): Promise<void> {
  const spinner = ora('Extracting insights...').start();

  const [highlightsResult, articlesResult] = await Promise.all([
    fetchHighlights(config, dateRange),
    fetchReaderDocuments(config, {
      updatedAfter: dateRange.startDate,
      updatedBefore: dateRange.endDate,
      location: 'new'
    })
  ]);

  if (!highlightsResult.success || !highlightsResult.data) {
    spinner.fail(chalk.red(`Failed: ${highlightsResult.error}`));
    return;
  }

  spinner.succeed(chalk.green('Insights extracted!'));

  const highlights = highlightsResult.data;
  const articles = articlesResult.data ?? [];
  const dateLabel = formatDateRange(dateRange, preset);

  console.log('\n' + chalk.bold.magenta(`🧠 KEY LEARNINGS (${dateLabel})`));
  console.log(chalk.dim('─'.repeat(50)) + '\n');

  if (highlights.length === 0) {
    console.log(chalk.dim('No highlights in this period.\n'));
    return;
  }

  // Extract insights
  const insights = extractKeyInsights(highlights, 5);

  console.log(chalk.bold('Top insights:\n'));
  for (const insight of insights) {
    console.log(
      chalk.dim('•') +
        ` ${insight.emoji} ${chalk.cyan(insight.domain)}: ${chalk.white(truncateText(insight.text, 120))}`
    );
  }

  // Context paragraph
  const context = generateReadingContextParagraph(highlights, articles);
  console.log('\n' + chalk.dim(context) + '\n');
}

async function showActivityTimeline(
  config: ReadwiseConfig,
  dateRange: DateRange,
  preset?: DatePreset
): Promise<void> {
  const spinner = ora('Analyzing timeline...').start();

  const result = await fetchHighlights(config, dateRange);

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Timeline analyzed!'));

  const highlights = result.data;
  const dateLabel = formatDateRange(dateRange, preset);
  const dailyBreakdown = groupHighlightsByDay(highlights, dateRange);
  const maxCount = Math.max(...dailyBreakdown.map(d => d.count));

  console.log('\n' + chalk.bold.blue(`📈 ACTIVITY TIMELINE (${dateLabel})`));
  console.log(chalk.dim('─'.repeat(50)) + '\n');

  if (highlights.length === 0) {
    console.log(chalk.dim('No activity in this period.\n'));
    return;
  }

  // Daily breakdown
  for (const day of dailyBreakdown) {
    const bar = renderActivityBar(day.count, maxCount, 20);
    const dateStr = formatDate(new Date(day.date + 'T00:00:00')).slice(0, 6); // "Jan 15"
    const pct = maxCount > 0 ? ((day.count / maxCount) * 100).toFixed(0) : '0';

    if (day.count > 0) {
      console.log(
        `${dateStr} ${chalk.cyan(day.dayOfWeek)} │ ${chalk.yellow(bar)} │ ${chalk.white.bold(day.count)} (${pct}%)`
      );
    } else {
      console.log(
        `${dateStr} ${chalk.dim(day.dayOfWeek)} │ ${chalk.dim(bar)} │ ${chalk.dim('0')}`
      );
    }
  }

  // Peak days
  const peaks = findPeakDays(dailyBreakdown, 2);
  if (peaks.length > 0) {
    const peakStr = peaks
      .map(p => `${formatDate(new Date(p.date + 'T00:00:00')).slice(0, 6)} (${p.count})`)
      .join(' | ');
    console.log('\n' + chalk.red('🔥 Peak: ') + chalk.white(peakStr));
  }

  // Pattern
  const pattern = generateReadingPattern(dailyBreakdown);
  console.log(chalk.dim(`Pattern: ${pattern}`) + '\n');
}

async function showByCategory(
  config: ReadwiseConfig,
  dateRange: DateRange,
  preset?: DatePreset
): Promise<void> {
  const spinner = ora('Grouping by category...').start();

  const result = await fetchHighlights(config, dateRange);

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Categories grouped!'));

  const highlights = result.data;
  const dateLabel = formatDateRange(dateRange, preset);
  const categories = groupHighlightsByCategory(highlights);
  const maxCount = Math.max(...categories.map(c => c.count));

  console.log('\n' + chalk.bold.green(`📂 BY CATEGORY (${dateLabel})`));
  console.log(chalk.dim('─'.repeat(50)) + '\n');

  if (highlights.length === 0) {
    console.log(chalk.dim('No highlights to categorize.\n'));
    return;
  }

  for (const category of categories.slice(0, 8)) {
    const bar = renderCategoryBar(category.count, maxCount);
    const pct = formatPercentage(category.percentage);

    console.log(
      `${chalk.cyan(category.domain.padEnd(15))} │ ${chalk.yellow(bar)} │ ${chalk.white.bold(category.count.toString().padStart(3))} ${chalk.dim(`(${pct})`)}`
    );
  }

  // Summary
  const topTwo = categories.slice(0, 2);
  if (topTwo.length > 0) {
    const summary = topTwo.map(c => `${c.domain.toLowerCase()} (${Math.round(c.percentage)}%)`).join(' + ');
    console.log('\n' + chalk.dim(`Focus: ${summary}`) + '\n');
  }
}

async function showStatsDashboard(
  config: ReadwiseConfig,
  dateRange: DateRange,
  preset?: DatePreset
): Promise<void> {
  const spinner = ora('Calculating stats...').start();

  const [highlightsResult, articlesResult] = await Promise.all([
    fetchHighlights(config, dateRange),
    fetchReaderDocuments(config, {
      updatedAfter: dateRange.startDate,
      updatedBefore: dateRange.endDate,
      location: 'new'
    })
  ]);

  if (!highlightsResult.success || !highlightsResult.data) {
    spinner.fail(chalk.red(`Failed: ${highlightsResult.error}`));
    return;
  }

  spinner.succeed(chalk.green('Stats calculated!'));

  const highlights = highlightsResult.data;
  const articles = articlesResult.data ?? [];
  const dateLabel = formatDateRange(dateRange, preset);

  const uniqueSources = new Set(highlights.map(h => h.title)).size;
  const dailyBreakdown = groupHighlightsByDay(highlights, dateRange);
  const daysWithActivity = dailyBreakdown.filter(d => d.count > 0).length;
  const avgPerDay = daysWithActivity > 0 ? highlights.length / daysWithActivity : 0;

  const grouped = groupHighlightsBySource(highlights);
  const topSource = grouped[0];

  console.log('\n' + chalk.bold.cyan('┌─ STATS DASHBOARD ─────────────────┐'));
  console.log(chalk.cyan('│') + '                                   ' + chalk.cyan('│'));
  console.log(
    chalk.cyan('│') +
      ` ${chalk.white('📥 Saved:')}      ${chalk.bold(articles.length.toString().padStart(3))} items          ${chalk.cyan('│')}`
  );
  console.log(
    chalk.cyan('│') +
      ` ${chalk.white('✨ Highlighted:')} ${chalk.bold(highlights.length.toString().padStart(3))} notes         ${chalk.cyan('│')}`
  );
  console.log(
    chalk.cyan('│') +
      ` ${chalk.white('📖 Sources:')}    ${chalk.bold(uniqueSources.toString().padStart(3))} unique        ${chalk.cyan('│')}`
  );
  console.log(
    chalk.cyan('│') +
      ` ${chalk.white('📊 Avg/day:')}    ${chalk.bold(avgPerDay.toFixed(1).padStart(3))} highlights   ${chalk.cyan('│')}`
  );

  if (topSource) {
    console.log(chalk.cyan('│') + '                                   ' + chalk.cyan('│'));
    console.log(
      chalk.cyan('│') +
        ` ${chalk.red('🔥')} ${chalk.white(truncateText(topSource.sourceTitle, 21).padEnd(21))} ${chalk.yellow(topSource.count)} ${chalk.cyan('│')}`
    );
  }

  console.log(chalk.cyan('│') + '                                   ' + chalk.cyan('│'));
  console.log(chalk.cyan('└───────────────────────────────────┘\n'));
}

// Entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(chalk.red('❌ Fatal error:'), error);
    process.exit(1);
  });
}
