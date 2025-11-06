#!/usr/bin/env node

import ora from 'ora'
import { log } from './log.js'
import { getGitHubToken } from './github.js'
import { searchGitHubCode, fetchCodeFiles } from './github.js'
import { buildQueryIntent } from './query.js'
import { rankResults } from './ranker.js'
import { extractFactualData } from './analyzer.js'
import type { SearchStats, FactualAnalysis, CodeFile } from './types.js'
import {
  AuthError,
  SearchError,
  RateLimitError
} from './types.js'

async function main() {
  const startTime = Date.now()

  log.header('\n🔍 GitHub Code Search\n')

  try {
    // Parse query from args
    const userQuery = process.argv.slice(2).join(' ')
    if (!userQuery || userQuery.trim().length === 0) {
      log.error('No query provided')
      log.dim('\nUsage: pnpm search "your search query"\n')
      process.exit(1)
    }

    // Auth
    const authSpinner = ora('Authenticating with GitHub...').start()
    const token = await getGitHubToken()
    authSpinner.succeed('Authenticated')

    // Build query
    const { query, options } = buildQueryIntent(userQuery)
    log.dim('\nSearch Parameters:')
    log.dim(`  Query: "${query}"`)
    log.dim(`  Filters: ${JSON.stringify(options)}\n`)

    // Search
    const searchSpinner = ora('Searching GitHub...').start()
    const results = await searchGitHubCode(token, query, options)
    searchSpinner.succeed(`Found ${results.length} results`)

    if (results.length === 0) {
      log.warn('No results found')
      log.dim('Try a different query or remove filters.')
      process.exit(0)
    }

    // Rank
    const rankSpinner = ora('Ranking by quality...').start()
    const ranked = rankResults(results, 10)
    rankSpinner.succeed(`Top ${ranked.length} selected`)

    // Fetch
    const fetchSpinner = ora(`Fetching code from ${ranked.length} files...`).start()
    const files = await fetchCodeFiles({
      token,
      rankedResults: ranked,
      maxFiles: 10,
      contextLinesCount: 20
    })
    fetchSpinner.succeed(`Fetched ${files.length} files`)

    // Extract factual data
    const analyzeSpinner = ora('Extracting factual data...').start()
    const analysis = extractFactualData(files)
    analyzeSpinner.succeed('Data extracted')

    // Stats
    const stats: SearchStats = {
      query: userQuery,
      totalResults: results.length,
      analyzedFiles: files.length,
      executionTimeMs: Date.now() - startTime
    }

    // Output clean markdown for Claude
    const report = formatMarkdownReport(analysis, files, stats)

    log.success('\nSearch complete!')
    log.plain('\n' + report)

  } catch (error: any) {
    if (error instanceof AuthError) {
      log.error('\nAuthentication failed')
      log.dim(error.message)
      log.dim('\nInstall gh CLI: https://cli.github.com/')
      log.dim('Then run: gh auth login --web\n')
    } else if (error instanceof RateLimitError) {
      log.error('\nRate limit exceeded')
      log.dim(error.message)
      log.dim(`\nResets at: ${error.resetAt.toLocaleString()}`)
      log.dim(`Remaining requests: ${error.remaining}\n`)
    } else if (error instanceof SearchError) {
      log.error('\nSearch failed')
      log.dim(error.message + '\n')
    } else {
      log.error('\nUnexpected error')
      log.dim(error)
    }
    process.exit(1)
  }
}

function formatMarkdownReport(
  analysis: FactualAnalysis,
  files: CodeFile[],
  stats: SearchStats
): string {
  const sections: string[] = []

  // Header
  sections.push(`# GitHub Code Search Results\n`)
  sections.push(`**Query:** \`${stats.query}\``)
  sections.push(`**Found:** ${stats.totalResults} results, analyzed top ${stats.analyzedFiles}`)
  sections.push(`**Execution:** ${(stats.executionTimeMs / 1000).toFixed(1)}s\n`)
  sections.push('---\n')

  // Factual data
  sections.push('## 📊 Factual Data\n')
  sections.push(`**Files:** ${analysis.totalFiles}`)
  sections.push(`**Total Lines:** ${analysis.totalLines.toLocaleString()}`)
  sections.push(`**Languages:** ${Object.entries(analysis.languages).map(([lang, count]) => `${lang} (${count})`).join(', ')}`)
  sections.push(`**Avg Lines/File:** ${analysis.fileStructure.avgLinesPerFile}`)
  sections.push(`**Avg Stars/File:** ${analysis.fileStructure.avgStarsPerFile}\n`)

  if (analysis.commonImports.length > 0) {
    sections.push('**Common Imports:**')
    analysis.commonImports.slice(0, 10).forEach((imp) => {
      sections.push(`- \`${imp.import}\` (${imp.count} files)`)
    })
    sections.push('')
  }

  if (Object.keys(analysis.syntaxOccurrences).length > 0) {
    sections.push('**Syntax Patterns:**')
    Object.entries(analysis.syntaxOccurrences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([pattern, count]) => {
        sections.push(`- ${pattern}: ${count} occurrences`)
      })
    sections.push('')
  }

  sections.push('---\n')

  // Code files
  sections.push('## 📂 Top Files\n')
  for (const file of files.slice(0, 5)) {
    sections.push(`### ${file.rank}. [${file.repository}](${file.url}) ⭐ ${formatStars(file.stars)}`)
    sections.push(`**${file.path}** (${file.lines} lines, ${file.language})\n`)

    const snippet = file.content.split('\n').slice(0, 30).join('\n')
    sections.push('```' + file.language)
    sections.push(snippet)
    if (file.lines > 30) sections.push('// ... more code ...')
    sections.push('```\n')
  }

  sections.push('---\n')
  sections.push(`*Fetched ${analysis.totalFiles} files from ${Object.keys(analysis.fileStructure.repoDistribution).length} repositories*\n`)

  return sections.join('\n')
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`
  }
  return stars.toString()
}

main()
