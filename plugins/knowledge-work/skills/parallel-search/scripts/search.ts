#!/usr/bin/env node

import ora from 'ora'
import { parseArgs } from 'node:util'
import { executeSearch } from './parallel-client.js'
import { formatResults } from './formatter.js'
import { log } from './log.js'
import {
  AuthError,
  RateLimitError,
  NetworkError,
  ValidationError,
} from './types.js'

async function main() {
  const startTime = Date.now()

  log.header('\n🔍 Parallel Search\n')

  try {
    // Parse command-line arguments
    const { values } = parseArgs({
      options: {
        objective: { type: 'string' },
        queries: { type: 'string', multiple: true },
        processor: { type: 'string' },
        'max-results': { type: 'string' },
        'max-chars': { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
      allowPositionals: false,
    })

    // Show help if requested
    if (values.help) {
      showHelp()
      process.exit(0)
    }

    // Validate input
    if (!values.objective) {
      log.error('No search objective provided')
      log.dim('\nUsage: pnpm tsx scripts/search.ts --objective "your query"')
      log.dim('       pnpm tsx scripts/search.ts --help for more options\n')
      process.exit(1)
    }

    // Parse numeric options
    const maxResults = values['max-results']
      ? parseInt(values['max-results'])
      : undefined
    const maxChars = values['max-chars']
      ? parseInt(values['max-chars'])
      : undefined

    // Validate processor
    const processor = values.processor as
      | 'lite'
      | 'base'
      | 'pro'
      | 'ultra'
      | undefined

    // Show search configuration
    log.dim('Search Configuration:')
    log.dim(`  Objective: "${values.objective}"`)
    if (values.queries && values.queries.length > 0) {
      log.dim(`  Queries: ${values.queries.length}`)
      values.queries.forEach((q, i) => log.dim(`    ${i + 1}. "${q}"`))
    }
    log.dim(`  Processor: ${processor || 'pro (default)'}`)
    log.dim(`  Max Results: ${maxResults || '15 (default)'}`)
    log.dim(`  Max Chars: ${maxChars || '5000 (default)'}\n`)

    // Execute search with spinner
    const spinner = ora('Searching...').start()

    const results = await executeSearch({
      objective: values.objective,
      searchQueries: values.queries,
      processor,
      maxResults,
      maxCharsPerResult: maxChars,
    })

    const executionTimeMs = Date.now() - startTime

    if (results.length === 0) {
      spinner.warn('No results found')
      log.dim(
        '\nTry a different query or adjust your search parameters.\n'
      )
      process.exit(0)
    }

    spinner.succeed(`Found ${results.length} results`)

    // Format and output results
    const report = formatResults(results, {
      objective: values.objective,
      executionTimeMs,
      resultCount: results.length,
    })

    log.plain('\n' + report)

    log.success(
      `\nSearch completed in ${(executionTimeMs / 1000).toFixed(1)}s`
    )
  } catch (error: any) {
    // Handle specific error types with helpful messages
    if (error instanceof AuthError) {
      log.error('\nAuthentication failed')
      log.dim(error.message)
      log.dim('\nGet your API key at: https://platform.parallel.ai/')
      log.dim('Then run: export PARALLEL_API_KEY="your-key-here"\n')
    } else if (error instanceof RateLimitError) {
      log.error('\nRate limit exceeded')
      log.dim(error.message)
      if (error.resetAt) {
        log.dim(`\nResets at: ${error.resetAt.toLocaleString()}`)
      }
      if (error.remaining !== undefined) {
        log.dim(`Remaining requests: ${error.remaining}`)
      }
      log.dim('')
    } else if (error instanceof NetworkError) {
      log.error('\nNetwork error')
      log.dim(error.message)
      log.dim('\nPlease check your internet connection and try again.\n')
    } else if (error instanceof ValidationError) {
      log.error('\nValidation error')
      log.dim(error.message)
      log.dim('\nRun with --help to see valid options.\n')
    } else {
      log.error('\nUnexpected error')
      log.dim(error.message || String(error))
      if (error.stack) {
        log.dim('\n' + error.stack)
      }
      log.dim('')
    }

    process.exit(1)
  }
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
Parallel Search - Comprehensive web research via Parallel Search API

USAGE:
  pnpm tsx scripts/search.ts --objective "your search objective" [OPTIONS]

REQUIRED:
  --objective <string>     Main search objective (natural language)

OPTIONS:
  --queries <string>...    Additional search queries (max 5)
  --processor <string>     Processing level: lite, base, pro, ultra
                          (default: pro)
  --max-results <number>   Maximum results to return (default: 15)
  --max-chars <number>     Max characters per excerpt (default: 5000)
  -h, --help              Show this help message

EXAMPLES:
  # Basic search
  pnpm tsx scripts/search.ts --objective "When was the UN founded?"

  # With additional queries
  pnpm tsx scripts/search.ts \\
    --objective "RAG system architecture" \\
    --queries "RAG chunking" "RAG evaluation"

  # Ultra quality search
  pnpm tsx scripts/search.ts \\
    --objective "Production deployment best practices" \\
    --processor ultra \\
    --max-results 20

PROCESSOR LEVELS:
  lite   - Fastest, less depth
  base   - Balanced speed and quality
  pro    - Research-quality (default)
  ultra  - Maximum quality for critical research

ENVIRONMENT:
  PARALLEL_API_KEY - Required. Get from https://platform.parallel.ai/

For more information, see SKILL.md
`)
}

main()
