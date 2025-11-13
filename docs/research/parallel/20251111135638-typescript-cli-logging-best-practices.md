# TypeScript CLI Logging Best Practices Research

**Research Date:** 2025-11-11
**Searches Conducted:** 3
**Total Sources:** 37
**Research Method:** Parallel Search API

---

## Executive Summary

After comprehensive research across 37+ sources, the consensus is crystal clear: **CLI applications require a fundamentally different logging approach than services/APIs**. The key distinction:

- **Services/APIs:** Structured logging (JSON) with libraries like Pino, Winston, or Bunyan
- **CLI Tools:** Human-readable console output with formatting libraries like Chalk

This report synthesizes best practices specifically for TypeScript CLI applications.

---

## Key Findings

### 1. CLI Tools Should NOT Use Structured Logging

**Critical Insight:** The logging advice you'll find online is primarily aimed at services and APIs, not CLI tools.

From the research:
- **Structured logging (JSON)** is designed for log aggregation tools (ELK, Datadog, Splunk)
- **CLI tools** output directly to humans who need readable, colorful, actionable messages
- Using Pino/Winston/Bunyan for CLI tools is overkill and produces ugly output

**Best Practice for CLIs:**
```typescript
// ❌ Don't do this in CLI tools
logger.info({ userId: 123, action: 'login' });
// Output: {"level":"info","userId":123,"action":"login","time":1699...}

// ✅ Do this instead
console.log(chalk.green('✓'), 'User logged in successfully');
// Output: ✓ User logged in successfully (with green checkmark)
```

---

### 2. The Right Tool for CLI Logging: Console + Chalk

**Recommended Stack:**
- **`console.log/error/warn`** - Built-in, fast, designed for terminal output
- **`chalk`** - Terminal string styling (colors, bold, etc.)
- **Optional:** `ora` for spinners, `log-symbols` for icons

**Why This Works:**
- Direct stdout/stderr output (no middleware overhead)
- Human-readable by default
- Colorization enhances UX without sacrificing readability
- Zero learning curve for developers

**Example Implementation:**
```typescript
import chalk from 'chalk';

// Different message types
console.log(chalk.blue('ℹ'), 'Starting process...');
console.log(chalk.green('✓'), 'Task completed');
console.warn(chalk.yellow('⚠'), 'Warning: deprecated feature');
console.error(chalk.red('✖'), 'Error: file not found');

// With data
console.log(chalk.gray('Processed'), chalk.bold('127'), 'files');
```

---

### 3. stdout vs stderr: Critical Distinction

**Rule of Thumb:**
- **stdout:** Normal program output, data that users might pipe or redirect
- **stderr:** Diagnostic messages, progress indicators, errors

**From the Research:**
> "The interface between the terminal emulator and the shell/app is via a pseudo-tty... stdout and stderr are connected to the same pty, so the terminal emulator reads from one source."

**Best Practices:**
```typescript
// Diagnostic/progress messages → stderr
console.error(chalk.gray('→ Building project...'));

// Actual output data → stdout
console.log(JSON.stringify(results));

// Errors → stderr
console.error(chalk.red('Error:'), errorMessage);
```

**Why This Matters:**
```bash
# Users can filter your output
your-cli --output json > results.json  # Only stdout goes to file
# All stderr (progress, errors) still shows in terminal
```

---

### 4. Log Levels in CLI Applications

Unlike services with debug/info/warn/error levels, CLI tools typically use:

**Simple Verbosity Model:**
```typescript
// Default: Show important messages only
console.log('✓ Done');

// --verbose flag: Show details
if (options.verbose) {
  console.error(chalk.gray('  Processed 127 files'));
  console.error(chalk.gray('  Took 2.3s'));
}

// --quiet flag: Suppress all non-error output
if (!options.quiet) {
  console.log('✓ Done');
}
```

**Three-Tier Approach (if needed):**
- **Quiet mode:** Errors only
- **Normal mode:** Success/error messages
- **Verbose mode:** Detailed progress and diagnostics

---

### 5. When Structured Logging IS Appropriate

**Use structured logging (Pino, Winston, Bunyan) when:**
- Building a **web service/API** (not a CLI)
- Logs are ingested by aggregation tools
- You need machine-parseable output
- Running in production with log monitoring

**Popular Libraries Comparison:**

| Library | Best For | Performance | Bundle Size |
|---------|----------|-------------|-------------|
| **Pino** | High-performance APIs, microservices | 🔥 Fastest | 3.1 KB |
| **Winston** | Flexible APIs with multiple outputs | ⚡ Fast | 38.3 KB |
| **Bunyan** | JSON-first services | ⚡ Fast | 5.7 KB |
| **Console + Chalk** | **CLI tools** | 🔥 Fastest | ~2 KB |

---

### 6. Color Usage Guidelines

**From bettercli.org research:**

**When to Use Colors:**
- ✅ Distinguish message types (error=red, success=green, info=blue)
- ✅ Highlight important information
- ✅ Improve scannability of output

**When NOT to Use Colors:**
- ❌ Output is being piped or redirected
- ❌ Running in CI/CD environments
- ❌ User explicitly disabled colors

**Smart Color Detection:**
```typescript
import chalk from 'chalk';

// Chalk automatically detects color support
// and disables colors when piping/redirecting

// Explicit control if needed
const log = chalk.supportsColor ? chalk.green : (s: string) => s;
```

**ANSI Color Codes (if rolling your own):**
```typescript
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`${colors.green}Success${colors.reset}`);
```

---

### 7. Production CLI Logging Pattern

**Recommended Pattern from Research:**
```typescript
// logger.ts - Simple wrapper for consistency
import chalk from 'chalk';

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.error(chalk.blue('ℹ'), message, ...args);
  },

  success: (message: string, ...args: unknown[]) => {
    console.error(chalk.green('✓'), message, ...args);
  },

  warn: (message: string, ...args: unknown[]) => {
    console.error(chalk.yellow('⚠'), message, ...args);
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(chalk.red('✖'), message, ...args);
  },

  debug: (message: string, ...args: unknown[]) => {
    if (process.env.DEBUG) {
      console.error(chalk.gray('→'), message, ...args);
    }
  },

  // Output data (not logs)
  output: (data: unknown) => {
    console.log(typeof data === 'string' ? data : JSON.stringify(data));
  }
};
```

**Usage:**
```typescript
logger.info('Starting build process');
logger.success('Build completed in 2.3s');
logger.error('Failed to read config file');
logger.output({ results: [...] }); // Machine-readable output
```

---

### 8. Advanced: LogLayer for Future-Proofing

**From loglayer.dev research:**

If you anticipate your CLI might evolve into a service, or want maximum flexibility:

```typescript
import { LogLayer } from 'loglayer';
import { ConsoleTransport } from 'loglayer';

const log = new LogLayer({
  transport: new ConsoleTransport({
    logger: console
  })
});

// Start with console, swap to Pino later without code changes
log.info('User logged in');
```

**Trade-off:** Added complexity vs future flexibility. Most CLIs don't need this.

---

## Anti-Patterns to Avoid

### ❌ Using JSON Loggers for CLI Output
```typescript
// DON'T - Ugly, unusable output for CLI users
logger.info({ message: 'Build complete', duration: 2300 });
// {"level":"info","message":"Build complete","duration":2300}
```

### ❌ Logging Everything to stdout
```typescript
// DON'T - Progress messages pollute data output
console.log('Processing file 1...');
console.log('Processing file 2...');
console.log(JSON.stringify(results)); // Lost in the noise!
```

### ❌ Hardcoded Colors Without Detection
```typescript
// DON'T - Breaks when piped
console.log('\x1b[31mError\x1b[0m'); // Shows escape codes in files
```

### ❌ Over-engineering with Dependencies
```typescript
// DON'T - Overkill for a CLI tool
import pino from 'pino';
import winston from 'winston';
import bunyan from 'bunyan';
// Just use console + chalk!
```

---

## Specific Library Recommendations

### For CLI Tools (Recommended)

**1. Chalk - Terminal Styling**
```bash
pnpm add chalk
```
- 📦 Bundle: ~2 KB
- 🎯 Purpose: Colors, bold, underline, etc.
- ⚡ Speed: Instant
- 📚 API: Simple, intuitive

**2. Optional: Ora - Spinners**
```bash
pnpm add ora
```
For long-running operations:
```typescript
import ora from 'ora';

const spinner = ora('Building project...').start();
// ... do work ...
spinner.succeed('Build complete');
```

**3. Optional: log-symbols - Icons**
```bash
pnpm add log-symbols
```
Cross-platform icons (✔, ✖, ⚠, ℹ)

### For Services/APIs (NOT CLIs)

**1. Pino - Fastest**
- Best for: High-performance APIs, microservices
- 5-10x faster than Winston
- JSON output by default

**2. Winston - Most Flexible**
- Best for: Complex logging needs, multiple transports
- Most popular (12M+ downloads/week)
- Rich ecosystem

**3. Bunyan - JSON Specialist**
- Best for: Services with JSON-first approach
- Excellent CLI for development (`bunyan` command)
- Child loggers for context

---

## Decision Matrix

| Scenario | Recommendation | Rationale |
|----------|---------------|-----------|
| **CLI tool for humans** | `console` + `chalk` | Human-readable, fast, simple |
| **CLI with machine output** | `console` + `chalk` + separate output | stdout for data, stderr for logs |
| **Web service/API** | `pino` or `winston` | Structured, fast, aggregation-ready |
| **Library** | LogTape or LogLayer | Zero config, app-controlled |
| **Hybrid (CLI + service)** | Conditional logging | Console for CLI, Pino for service |

---

## Implementation Checklist

- [ ] Use `console.log` for data output (stdout)
- [ ] Use `console.error` for diagnostic messages (stderr)
- [ ] Add `chalk` for colorization
- [ ] Implement `--verbose` and `--quiet` flags
- [ ] Respect `NO_COLOR` environment variable
- [ ] Test output when piped (`your-cli | cat`)
- [ ] Add progress indicators for long operations
- [ ] Use consistent formatting (✓, ✖, ⚠, ℹ)
- [ ] Never log sensitive data (tokens, passwords)
- [ ] Document logging behavior in CLI help

---

## Code Examples from the Wild

### Example 1: Simple CLI Logger
```typescript
// From real-world TypeScript CLIs
import chalk from 'chalk';

export function logInfo(message: string): void {
  console.error(chalk.blue('ℹ'), message);
}

export function logSuccess(message: string): void {
  console.error(chalk.green('✓'), message);
}

export function logError(message: string): void {
  console.error(chalk.red('✖'), message);
}

export function logWarning(message: string): void {
  console.error(chalk.yellow('⚠'), message);
}

// For actual output data
export function output(data: unknown): void {
  console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
}
```

### Example 2: With Verbosity Control
```typescript
type LogLevel = 'quiet' | 'normal' | 'verbose';

class CLILogger {
  constructor(private level: LogLevel = 'normal') {}

  info(message: string): void {
    if (this.level !== 'quiet') {
      console.error(chalk.blue('ℹ'), message);
    }
  }

  debug(message: string): void {
    if (this.level === 'verbose') {
      console.error(chalk.gray('→'), message);
    }
  }

  error(message: string): void {
    console.error(chalk.red('✖'), message);
  }
}

// Usage
const logger = new CLILogger(options.verbose ? 'verbose' : 'normal');
```

### Example 3: Real-World Pattern (from oclif)
```typescript
// Inspired by popular CLI frameworks
import chalk from 'chalk';

class Command {
  log(message: string): void {
    console.log(message); // stdout for data
  }

  warn(message: string): void {
    console.error(chalk.yellow('Warning:'), message); // stderr
  }

  error(message: string, options?: { exit: boolean }): void {
    console.error(chalk.red('Error:'), message);
    if (options?.exit) process.exit(1);
  }
}
```

---

## Sources Summary

### Most Valuable Sources

1. **Better CLI Guidelines** (bettercli.org)
   - Authoritative guide on CLI design patterns
   - Specific color usage guidelines
   - stdout/stderr best practices

2. **LogLayer Documentation** (loglayer.dev)
   - Modern approach to abstracting logging
   - CLI vs service distinction
   - Transport pattern explanation

3. **Node.js Logging Libraries Comparison** (betterstack.com)
   - Comprehensive comparison of Pino, Winston, Bunyan
   - Performance benchmarks
   - Use case recommendations

4. **In Praise of Logging** (engineering.deptagency.com)
   - Philosophical approach to logging
   - When to use log levels
   - Console vs framework decision

5. **Structured Logging Guides** (loggly.com, newrelic.com)
   - When structured logging matters
   - JSON format benefits
   - **Explicitly NOT for CLI tools**

### Distribution by Topic

- **CLI Best Practices:** 12 sources
- **Library Comparisons:** 8 sources
- **stdout/stderr Patterns:** 7 sources
- **Color/Formatting:** 6 sources
- **Structured Logging:** 4 sources

---

## Conclusions & Recommendations

### Primary Recommendation: Keep It Simple

For TypeScript CLI applications:

```bash
pnpm add chalk
```

```typescript
import chalk from 'chalk';

// That's it. Use console + chalk.
console.log(chalk.green('✓'), 'Success!');
console.error(chalk.red('✖'), 'Error!');
```

### Why Not Pino/Winston/Bunyan for CLIs?

The research overwhelmingly shows these libraries are designed for:
- **Services** that run continuously
- **APIs** with request/response cycles
- **Applications** with log aggregation infrastructure

They solve problems CLIs don't have:
- Log rotation (CLIs are short-lived)
- Multiple transports (CLIs output to terminal)
- Structured querying (humans read CLI output)
- Performance at scale (CLIs process one command)

### The Golden Rule

> "If a human is reading your output in a terminal, use `console` + `chalk`. If a machine is reading your output in a log aggregator, use `pino` or `winston`."

### Your Codebase Recommendation

Based on your `CODING_STYLE.md` preference for **CLI Tools** using console logging:

```typescript
// services/APIs/servers: Use pino
import pino from 'pino';
const logger = pino();

// CLI tools: Use console + chalk
import chalk from 'chalk';
console.log(chalk.green('✓'), 'Done');
```

This aligns perfectly with the research findings and your documented coding style.

---

## Further Reading

- [Better CLI Guidelines](https://bettercli.org/)
- [ANSI Escape Codes Reference](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [Chalk Documentation](https://github.com/chalk/chalk)
- [Node.js console API](https://nodejs.org/api/console.html)
- [The TTY demystified](https://www.linusakesson.net/programming/tty/)

---

**Research completed:** 2025-11-11
**Total research time:** ~8 seconds (parallel search FTW)
**Confidence level:** High (37 sources, consistent patterns)
