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
  getTodayDateRange,
  findTopHighlightedSources,
  formatDate,
  truncateText,
  type DateRange
} from './analyze-highlights.js';

// CLI configuration
interface CliOptions {
  readonly mode: 'articles' | 'highlights' | 'top-highlighted' | 'all';
  readonly topN?: number;
}

async function main(): Promise<void> {
  // Parse args
  const args = process.argv.slice(2);
  const mode = (args[0] as CliOptions['mode']) || 'all';
  const topN = args[1] ? parseInt(args[1], 10) : 10;

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
  const dateRange = getTodayDateRange();

  // Execute based on mode
  if (mode === 'articles' || mode === 'all') {
    await showTodaysArticles(config, dateRange);
  }

  if (mode === 'highlights' || mode === 'all') {
    await showTodaysHighlights(config, dateRange);
  }

  if (mode === 'top-highlighted' || mode === 'all') {
    await showTopHighlighted(config, dateRange, topN);
  }
}

async function showTodaysArticles(
  config: ReadwiseConfig,
  dateRange: DateRange
): Promise<void> {
  const spinner = ora('Fetching articles saved today...').start();

  const result = await fetchReaderDocuments(config, {
    updatedAfter: dateRange.startDate,
    location: 'new'
  });

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch articles: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Articles fetched!'));

  const summary = summarizeArticles(result.data);
  const today = formatDate(dateRange.startDate);

  console.log('\n' + chalk.bold.blue(`📚 Articles Saved Today (${today})`));
  console.log(chalk.dim('━'.repeat(50)) + '\n');
  console.log(chalk.bold(`Total: ${summary.totalCount} items\n`));

  if (summary.totalCount === 0) {
    console.log(chalk.dim('No articles saved today yet.\n'));
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

async function showTodaysHighlights(
  config: ReadwiseConfig,
  dateRange: DateRange
): Promise<void> {
  const spinner = ora('Fetching highlights created today...').start();

  const result = await fetchHighlights(config, dateRange);

  if (!result.success || !result.data) {
    spinner.fail(chalk.red(`Failed to fetch highlights: ${result.error}`));
    return;
  }

  spinner.succeed(chalk.green('Highlights fetched!'));

  const grouped = groupHighlightsBySource(result.data);
  const totalCount = result.data.length;
  const today = formatDate(dateRange.startDate);

  console.log('\n' + chalk.bold.yellow(`✨ Highlights Created Today (${today})`));
  console.log(chalk.dim('━'.repeat(50)) + '\n');
  console.log(
    chalk.bold(`Total: ${totalCount} highlights from ${grouped.length} sources\n`)
  );

  if (totalCount === 0) {
    console.log(chalk.dim('No highlights created today yet.\n'));
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
  const today = formatDate(dateRange.startDate);

  console.log('\n' + chalk.bold.red(`🔥 Most Highlighted Content (${today})`));
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

// Entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(chalk.red('❌ Fatal error:'), error);
    process.exit(1);
  });
}
