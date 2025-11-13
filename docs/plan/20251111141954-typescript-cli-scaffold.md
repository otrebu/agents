# TypeScript CLI Scaffold - Comprehensive Plan

**Created:** 2025-11-11
**Timestamp:** 20251111141954
**Topic:** Batteries-Included TypeScript CLI Scaffolding System

---

## Executive Summary

This plan outlines a comprehensive scaffolding system for creating production-ready TypeScript CLI applications with batteries included. The system combines best practices from industry leaders (Heroku, Salesforce), modern tooling (pnpm, Vite, Vitest), and proven architectural patterns (FP-first, modular design).

### Key Goals

1. **Speed:** Generate a production-ready CLI in <30 seconds
2. **Best Practices:** Follow FP patterns, strict typing, comprehensive testing
3. **Batteries Included:** All common CLI needs pre-configured
4. **Maintainable:** Clear structure, excellent DX, easy to extend
5. **Modern:** Latest TypeScript, fast tooling, current ecosystem

---

## Architecture Overview

### Three-Layer Approach

```
┌─────────────────────────────────────────┐
│     Scaffolding Generator (Layer 1)    │  ← What we're building
│  (Hybrid: ts-morph + EJS templates)    │
├─────────────────────────────────────────┤
│    Generated CLI Structure (Layer 2)    │  ← What users get
│  (Commander.js + modular architecture)  │
├─────────────────────────────────────────┤
│   User's Business Logic (Layer 3)       │  ← What users build
│     (Commands they implement)           │
└─────────────────────────────────────────┘
```

---

## Part 1: The Scaffolding System

### Technology Stack

#### Core Framework
- **Approach:** Hybrid (templates + AST manipulation)
- **Template Engine:** EJS (for simple boilerplate)
- **Code Generation:** ts-morph (for complex TypeScript structures)
- **CLI Parser:** Commander.js (for the scaffolder itself)
- **File System:** Node.js fs/promises + glob patterns

**Rationale:**
- Templates are fast for consistent boilerplate (package.json, configs, simple files)
- ts-morph provides type-safe code generation for dynamic structures
- Commander.js is lightweight and widely adopted
- Hybrid approach offers best DX for both developers and users

#### Distribution
- **Package Name:** `create-ts-cli` (or similar)
- **Usage:** `npm init ts-cli` or `pnpm create ts-cli`
- **Registry:** npm
- **Version Management:** semantic-release

### Scaffolder Features

1. **Interactive Prompts** (using inquirer)
   - CLI name
   - Description
   - Author info
   - Package manager (pnpm/npm/yarn/bun)
   - Features to include:
     - [ ] File system operations
     - [ ] HTTP client
     - [ ] Interactive prompts
     - [ ] Config file support
     - [ ] Plugin system
     - [ ] Testing setup
     - [ ] GitHub Actions CI/CD
     - [ ] Docker support

2. **Validation**
   - Package name validity (npm naming rules)
   - Directory doesn't exist (or prompt to overwrite)
   - Node.js version compatibility check

3. **Generation Process**
   - Create directory structure
   - Generate package.json with selected features
   - Create TypeScript configs (tsconfig.json, tsconfig.build.json)
   - Set up tooling configs (ESLint, Prettier, Vitest)
   - Generate command structure
   - Install dependencies (respect user's package manager choice)
   - Initialize git repo
   - Display next steps

---

## Part 2: The Generated CLI Structure

### Directory Layout

```
my-cli/
├── src/
│   ├── commands/           # Command modules (1 file per command)
│   │   ├── hello.ts        # Example command
│   │   └── index.ts        # Command registry
│   ├── lib/                # Shared utilities
│   │   ├── config.ts       # Config file loading
│   │   ├── errors.ts       # Custom error types
│   │   ├── logger.ts       # Logging utilities (chalk + console)
│   │   └── validators.ts   # Input validation helpers
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── cli.ts              # Main CLI entry point
│   └── index.ts            # Programmatic API (optional)
├── tests/                  # Vitest tests
│   ├── commands/
│   │   └── hello.test.ts
│   ├── lib/
│   └── fixtures/           # Test data
├── docs/                   # Documentation
│   └── commands/           # Per-command docs
├── dist/                   # Compiled output (gitignored)
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions
├── .husky/                 # Git hooks
│   └── pre-commit
├── .vscode/                # VS Code settings
│   ├── settings.json
│   └── extensions.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json     # Build-specific config
├── vitest.config.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── .npmignore
├── .nvmrc                  # Node version
├── README.md
└── LICENSE
```

### Core Files

#### package.json

```json
{
  "name": "my-cli",
  "version": "0.1.0",
  "description": "My CLI application",
  "type": "module",
  "bin": {
    "my-cli": "./dist/cli.js"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "tsx src/cli.ts",
    "build": "tsc -p tsconfig.build.json",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src tests --ext .ts",
    "lint:fix": "eslint src tests --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"tests/**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist",
    "prebuild": "pnpm clean",
    "prepare": "husky install",
    "prepublishOnly": "pnpm build && pnpm test"
  },
  "keywords": ["cli"],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "commander": "^11.1.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.1",
    "boxen": "^7.1.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "vitest": "^1.0.4",
    "@vitest/coverage-v8": "^1.0.4",
    "eslint": "^8.55.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "prettier": "^3.1.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "rimraf": "^5.0.5"
  }
}
```

**Conditional dependencies** (based on selected features):
- File operations: `glob`, `chokidar`
- HTTP client: `axios` or `node-fetch`
- Interactive prompts: `inquirer`
- Config files: `cosmiconfig`
- Validation: `zod`

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@commands/*": ["src/commands/*"],
      "@lib/*": ["src/lib/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### tsconfig.build.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "declaration": true,
    "declarationMap": false,
    "removeComments": true
  },
  "exclude": ["node_modules", "dist", "tests", "**/*.test.ts"]
}
```

#### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.test.ts',
        '**/*.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@commands': resolve(__dirname, './src/commands'),
      '@lib': resolve(__dirname, './src/lib'),
      '@types': resolve(__dirname, './src/types'),
    },
  },
});
```

#### .eslintrc.cjs

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'no-console': 'off', // Allowed in CLI apps
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'error',
  },
  env: {
    node: true,
    es2022: true,
  },
};
```

#### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

---

## Part 3: CLI Architecture Pattern

### Functional Programming First

Following the coding style guidelines:
- **No classes** (except custom Error types)
- **Pure functions** where possible
- **Immutable data structures**
- **Composition over inheritance**
- **Side effects at edges** (IO operations in command handlers)

### Command Pattern

Each command is a separate module with a consistent structure:

#### src/commands/hello.ts

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '@lib/logger';

/**
 * Configuration options for the hello command
 */
export interface HelloOptions {
  name: string;
  greeting?: string;
  uppercase?: boolean;
}

/**
 * Pure function: Generate greeting message
 *
 * @param options - Greeting options
 * @returns Formatted greeting string
 */
export const generateGreeting = (options: HelloOptions): string => {
  const greeting = options.greeting ?? 'Hello';
  const message = `${greeting}, ${options.name}!`;
  return options.uppercase ? message.toUpperCase() : message;
};

/**
 * Command handler with side effects
 * Orchestrates the command execution
 *
 * @param options - Command options
 */
export const helloHandler = (options: HelloOptions): void => {
  try {
    const message = generateGreeting(options);
    logger.success(message);
  } catch (error) {
    logger.error('Failed to generate greeting', error);
    process.exit(1);
  }
};

/**
 * Register the hello command with Commander
 *
 * @param program - Commander program instance
 * @returns Configured command
 */
export const registerHelloCommand = (program: Command): Command => {
  return program
    .command('hello')
    .description('Say hello to someone')
    .argument('<name>', 'Name to greet')
    .option('-g, --greeting <greeting>', 'Custom greeting', 'Hello')
    .option('-u, --uppercase', 'Output in uppercase', false)
    .action((name: string, options: Omit<HelloOptions, 'name'>) => {
      helloHandler({ ...options, name });
    });
};
```

### Error Handling Pattern

#### src/lib/errors.ts

```typescript
/**
 * Base error class for CLI errors
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly exitCode: number = 1,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CLIError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for invalid user input
 */
export class ValidationError extends CLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 1, context);
    this.name = 'ValidationError';
  }
}

/**
 * Error for file system operations
 */
export class FileSystemError extends CLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 1, context);
    this.name = 'FileSystemError';
  }
}

/**
 * Error for network operations
 */
export class NetworkError extends CLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 1, context);
    this.name = 'NetworkError';
  }
}

/**
 * Format error for user display
 *
 * @param error - Error to format
 * @returns User-friendly error message
 */
export const formatError = (error: unknown): string => {
  if (error instanceof CLIError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

/**
 * Get exit code from error
 *
 * @param error - Error object
 * @returns Exit code
 */
export const getExitCode = (error: unknown): number => {
  if (error instanceof CLIError) {
    return error.exitCode;
  }
  return 1;
};
```

### Logging Pattern (CLI-Specific)

#### src/lib/logger.ts

```typescript
import chalk from 'chalk';
import ora, { Ora } from 'ora';

/**
 * Log levels for CLI output
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  silent: boolean;
}

/**
 * Log level hierarchy for filtering
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  success: 1,
  warn: 2,
  error: 3,
};

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: 'info',
  silent: false,
};

let config = { ...defaultConfig };

/**
 * Configure logger
 *
 * @param newConfig - Logger configuration
 */
export const configureLogger = (newConfig: Partial<LoggerConfig>): void => {
  config = { ...config, ...newConfig };
};

/**
 * Check if message should be logged based on level
 *
 * @param level - Log level to check
 * @returns True if should log
 */
const shouldLog = (level: LogLevel): boolean => {
  if (config.silent) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[config.level];
};

/**
 * Log debug message (gray text)
 *
 * @param message - Message to log
 * @param data - Optional data to display
 */
export const debug = (message: string, data?: unknown): void => {
  if (!shouldLog('debug')) return;
  console.log(chalk.gray(`[DEBUG] ${message}`));
  if (data !== undefined) {
    console.log(chalk.gray(JSON.stringify(data, null, 2)));
  }
};

/**
 * Log info message (blue text)
 *
 * @param message - Message to log
 */
export const info = (message: string): void => {
  if (!shouldLog('info')) return;
  console.log(chalk.blue(`ℹ ${message}`));
};

/**
 * Log success message (green text)
 *
 * @param message - Message to log
 */
export const success = (message: string): void => {
  if (!shouldLog('success')) return;
  console.log(chalk.green(`✓ ${message}`));
};

/**
 * Log warning message (yellow text)
 *
 * @param message - Message to log
 */
export const warn = (message: string): void => {
  if (!shouldLog('warn')) return;
  console.warn(chalk.yellow(`⚠ ${message}`));
};

/**
 * Log error message (red text)
 *
 * @param message - Message to log
 * @param error - Optional error object
 */
export const error = (message: string, error?: unknown): void => {
  if (!shouldLog('error')) return;
  console.error(chalk.red(`✗ ${message}`));
  if (error instanceof Error && error.stack) {
    console.error(chalk.red(error.stack));
  } else if (error) {
    console.error(chalk.red(String(error)));
  }
};

/**
 * Create a spinner for long-running operations
 *
 * @param text - Spinner text
 * @returns Ora spinner instance
 */
export const spinner = (text: string): Ora => {
  return ora(text);
};

/**
 * Logger object with all methods
 */
export const logger = {
  debug,
  info,
  success,
  warn,
  error,
  spinner,
  configure: configureLogger,
};
```

### Main CLI Entry Point

#### src/cli.ts

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from '@lib/logger';
import { formatError, getExitCode } from '@lib/errors';
import { registerCommands } from '@commands/index';

/**
 * Get package.json data
 * Used for version and description in CLI
 */
const getPackageJson = (): { version: string; description: string } => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packageJsonPath = join(__dirname, '../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return {
    version: packageJson.version,
    description: packageJson.description,
  };
};

/**
 * Main CLI function
 * Sets up Commander and registers commands
 */
const main = async (): Promise<void> => {
  const { version, description } = getPackageJson();

  const program = new Command();

  program
    .name('my-cli')
    .description(description)
    .version(version, '-v, --version', 'Output the version number')
    .option('-d, --debug', 'Enable debug logging', false)
    .option('--silent', 'Suppress all output', false);

  // Register all commands
  registerCommands(program);

  // Parse arguments
  program.parse(process.argv);

  // Configure logger based on global options
  const options = program.opts<{ debug?: boolean; silent?: boolean }>();
  logger.configure({
    level: options.debug ? 'debug' : 'info',
    silent: options.silent ?? false,
  });
};

/**
 * Execute main with error handling
 */
main().catch((error: unknown) => {
  logger.error('Unexpected error', error);
  const errorMessage = formatError(error);
  const exitCode = getExitCode(error);

  console.error(chalk.red(`\nError: ${errorMessage}\n`));
  process.exit(exitCode);
});
```

#### src/commands/index.ts

```typescript
import { Command } from 'commander';
import { registerHelloCommand } from './hello';

/**
 * Register all commands with the CLI program
 *
 * @param program - Commander program instance
 */
export const registerCommands = (program: Command): void => {
  registerHelloCommand(program);
  // Add more commands here as they're created
};
```

---

## Part 4: Testing Strategy

### Test Structure

Following Vitest and FP principles:
- **Unit tests** for pure functions (fast, isolated)
- **Integration tests** for command handlers (test full flow)
- **Test each parameters** for similar cases (pure functions with variations)
- **Individual tests** for different scenarios (mocking, error cases)

#### tests/commands/hello.test.ts

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateGreeting, helloHandler } from '@commands/hello';
import type { HelloOptions } from '@commands/hello';

describe('generateGreeting', () => {
  // Use test.each for pure function with multiple similar cases
  it.each([
    {
      options: { name: 'World', greeting: 'Hello' },
      expected: 'Hello, World!',
      description: 'basic greeting',
    },
    {
      options: { name: 'Alice', greeting: 'Hi' },
      expected: 'Hi, Alice!',
      description: 'custom greeting',
    },
    {
      options: { name: 'Bob', greeting: 'Hey', uppercase: true },
      expected: 'HEY, BOB!',
      description: 'uppercase greeting',
    },
    {
      options: { name: 'Charlie' },
      expected: 'Hello, Charlie!',
      description: 'default greeting',
    },
  ])('should generate $description', ({ options, expected }) => {
    expect(generateGreeting(options)).toBe(expected);
  });
});

describe('helloHandler', () => {
  // Individual tests when mocking is involved
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log success message', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const options: HelloOptions = { name: 'World' };

    helloHandler(options);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Hello, World!'));
    logSpy.mockRestore();
  });

  it('should handle errors gracefully', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    // Force an error by passing invalid data that would break generateGreeting
    vi.spyOn(console, 'log').mockImplementation(() => {
      throw new Error('Logging failed');
    });

    const options: HelloOptions = { name: 'World' };
    helloHandler(options);

    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
```

### Test Coverage Goals

- **Pure functions:** 100% coverage (easy to test)
- **Command handlers:** 80%+ coverage
- **Error paths:** All custom errors tested
- **Overall:** 80%+ coverage

---

## Part 5: Common CLI Features (Batteries Included)

### 1. Config File Support

#### src/lib/config.ts

```typescript
import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';
import { ValidationError } from './errors';

/**
 * Configuration schema
 */
const ConfigSchema = z.object({
  defaultGreeting: z.string().optional(),
  verboseLogging: z.boolean().default(false),
  // Add more config options as needed
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Default configuration
 */
const defaultConfig: Config = {
  verboseLogging: false,
};

/**
 * Load configuration from file or use defaults
 * Searches for .myclirc, .myclirc.json, .myclirc.yaml, mycli.config.js
 *
 * @param searchFrom - Directory to start searching from
 * @returns Configuration object
 */
export const loadConfig = async (searchFrom?: string): Promise<Config> => {
  const explorer = cosmiconfig('mycli');
  const result = await explorer.search(searchFrom);

  if (!result) {
    return defaultConfig;
  }

  // Validate config against schema
  const parseResult = ConfigSchema.safeParse(result.config);

  if (!parseResult.success) {
    throw new ValidationError(
      'Invalid configuration file',
      { errors: parseResult.error.errors }
    );
  }

  return parseResult.data;
};
```

### 2. File System Utilities

#### src/lib/fs-utils.ts

```typescript
import { access, readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { FileSystemError } from './errors';

/**
 * Check if file or directory exists
 *
 * @param path - Path to check
 * @returns True if exists
 */
export const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

/**
 * Read JSON file and parse
 *
 * @param path - Path to JSON file
 * @returns Parsed JSON object
 */
export const readJsonFile = async <T = unknown>(path: string): Promise<T> => {
  try {
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    throw new FileSystemError(`Failed to read JSON file: ${path}`, { error });
  }
};

/**
 * Write JSON file with pretty formatting
 *
 * @param path - Path to write to
 * @param data - Data to write
 */
export const writeJsonFile = async (
  path: string,
  data: unknown
): Promise<void> => {
  try {
    const content = JSON.stringify(data, null, 2);
    await ensureDir(dirname(path));
    await writeFile(path, content, 'utf-8');
  } catch (error) {
    throw new FileSystemError(`Failed to write JSON file: ${path}`, { error });
  }
};

/**
 * Ensure directory exists, create if it doesn't
 *
 * @param path - Directory path
 */
export const ensureDir = async (path: string): Promise<void> => {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    throw new FileSystemError(`Failed to create directory: ${path}`, { error });
  }
};
```

### 3. HTTP Client Utilities

#### src/lib/http-client.ts

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { NetworkError } from './errors';

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Create configured HTTP client
 *
 * @param config - Client configuration
 * @returns Axios instance
 */
export const createHttpClient = (config: HttpClientConfig = {}): AxiosInstance => {
  return axios.create({
    timeout: 30000,
    ...config,
  });
};

/**
 * Perform GET request with error handling
 *
 * @param url - Request URL
 * @param config - Request configuration
 * @returns Response data
 */
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const client = createHttpClient(config);
    const response = await client.get<T>(url);
    return response.data;
  } catch (error) {
    throw new NetworkError(`GET request failed: ${url}`, { error });
  }
};

/**
 * Perform POST request with error handling
 *
 * @param url - Request URL
 * @param data - Request body
 * @param config - Request configuration
 * @returns Response data
 */
export const post = async <T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const client = createHttpClient(config);
    const response = await client.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw new NetworkError(`POST request failed: ${url}`, { error });
  }
};
```

### 4. Input Validation Utilities

#### src/lib/validators.ts

```typescript
import { z } from 'zod';
import { ValidationError } from './errors';

/**
 * Validate data against Zod schema
 *
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError('Validation failed', {
      errors: result.error.errors,
    });
  }

  return result.data;
};

/**
 * Common validators
 */
export const validators = {
  // Email validation
  email: z.string().email(),

  // URL validation
  url: z.string().url(),

  // Port number validation
  port: z.number().int().min(1).max(65535),

  // Non-empty string
  nonEmptyString: z.string().min(1),

  // Positive integer
  positiveInt: z.number().int().positive(),

  // File path (basic check)
  filePath: z.string().min(1).regex(/^[^<>:"|?*]+$/),

  // Semantic version
  semver: z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/),
};
```

---

## Part 6: Developer Experience

### Documentation

#### README.md Template

```markdown
# My CLI

> Description of your CLI

## Installation

```bash
npm install -g my-cli
# or
pnpm add -g my-cli
```

## Usage

```bash
# Basic usage
my-cli hello World

# With options
my-cli hello World --greeting "Hi" --uppercase

# View help
my-cli --help
my-cli hello --help
```

## Commands

### `hello <name>`

Say hello to someone.

**Arguments:**
- `name` - Name to greet

**Options:**
- `-g, --greeting <greeting>` - Custom greeting (default: "Hello")
- `-u, --uppercase` - Output in uppercase

**Examples:**
```bash
my-cli hello World
my-cli hello Alice --greeting "Hi"
my-cli hello Bob --uppercase
```

## Configuration

Create a `.myclirc` file in your project root or home directory:

```json
{
  "defaultGreeting": "Hey",
  "verboseLogging": true
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev hello World

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build
pnpm build
```

## License

MIT
```

### VS Code Configuration

#### .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

#### .vscode/extensions.json

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "vitest.explorer"
  ]
}
```

### Git Hooks (Husky + lint-staged)

#### package.json (lint-staged config)

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write",
      "vitest related --run"
    ]
  }
}
```

#### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

---

## Part 7: CI/CD

### GitHub Actions Workflow

#### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Format check
        run: pnpm format:check

      - name: Test
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.os == 'ubuntu-latest' && matrix.node-version == '20.x'
        with:
          files: ./coverage/coverage-final.json

      - name: Build
        run: pnpm build

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: pnpm semantic-release
```

---

## Part 8: Advanced Features (Optional)

### 1. Plugin System

Allow users to extend the CLI with plugins:

#### src/lib/plugin-loader.ts

```typescript
import { Command } from 'commander';
import { readJsonFile } from './fs-utils';
import { logger } from './logger';

/**
 * Plugin interface
 */
export interface Plugin {
  name: string;
  version: string;
  commands?: Array<(program: Command) => void>;
  hooks?: {
    beforeCommand?: () => Promise<void>;
    afterCommand?: () => Promise<void>;
  };
}

/**
 * Load plugins from package.json
 *
 * @param program - Commander program
 */
export const loadPlugins = async (program: Command): Promise<void> => {
  try {
    const packageJson = await readJsonFile<{ plugins?: string[] }>('./package.json');
    const pluginNames = packageJson.plugins ?? [];

    for (const pluginName of pluginNames) {
      try {
        const plugin = await import(pluginName) as { default: Plugin };

        logger.debug(`Loading plugin: ${plugin.default.name}`);

        // Register commands
        if (plugin.default.commands) {
          for (const registerCommand of plugin.default.commands) {
            registerCommand(program);
          }
        }

        logger.debug(`Plugin loaded: ${plugin.default.name}`);
      } catch (error) {
        logger.warn(`Failed to load plugin: ${pluginName}`, error);
      }
    }
  } catch (error) {
    logger.debug('No plugins configured');
  }
};
```

### 2. Interactive Prompts

#### src/lib/prompts.ts

```typescript
import inquirer from 'inquirer';

/**
 * Prompt for text input
 *
 * @param message - Prompt message
 * @param defaultValue - Default value
 * @returns User input
 */
export const promptText = async (
  message: string,
  defaultValue?: string
): Promise<string> => {
  const { value } = await inquirer.prompt<{ value: string }>([
    {
      type: 'input',
      name: 'value',
      message,
      default: defaultValue,
    },
  ]);
  return value;
};

/**
 * Prompt for confirmation
 *
 * @param message - Prompt message
 * @param defaultValue - Default value
 * @returns User confirmation
 */
export const promptConfirm = async (
  message: string,
  defaultValue = false
): Promise<boolean> => {
  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: defaultValue,
    },
  ]);
  return confirmed;
};

/**
 * Prompt for selection from list
 *
 * @param message - Prompt message
 * @param choices - List of choices
 * @returns Selected choice
 */
export const promptSelect = async <T extends string>(
  message: string,
  choices: T[]
): Promise<T> => {
  const { selected } = await inquirer.prompt<{ selected: T }>([
    {
      type: 'list',
      name: 'selected',
      message,
      choices,
    },
  ]);
  return selected;
};

/**
 * Prompt for multiple selections
 *
 * @param message - Prompt message
 * @param choices - List of choices
 * @returns Selected choices
 */
export const promptMultiSelect = async <T extends string>(
  message: string,
  choices: T[]
): Promise<T[]> => {
  const { selected } = await inquirer.prompt<{ selected: T[] }>([
    {
      type: 'checkbox',
      name: 'selected',
      message,
      choices,
    },
  ]);
  return selected;
};
```

---

## Part 9: Implementation Phases

### Phase 1: Core Scaffolder (Week 1)
- [ ] Set up scaffolder project structure
- [ ] Implement basic CLI with Commander
- [ ] Create interactive prompts (project name, description, author)
- [ ] Generate basic directory structure
- [ ] Template generation for package.json
- [ ] Template generation for tsconfig.json
- [ ] Test scaffolder locally with `npm link`

### Phase 2: Essential Configs (Week 2)
- [ ] ESLint configuration templates
- [ ] Prettier configuration templates
- [ ] Vitest configuration templates
- [ ] Git configuration (.gitignore, .nvmrc)
- [ ] VS Code configuration templates
- [ ] Husky setup and pre-commit hooks
- [ ] Test complete scaffold generation

### Phase 3: CLI Architecture (Week 3)
- [ ] Generate src/cli.ts entry point
- [ ] Generate command structure (src/commands/)
- [ ] Generate utility modules (src/lib/)
- [ ] Generate example hello command
- [ ] Generate error handling system
- [ ] Generate logger module
- [ ] Add shebang injection for compiled output

### Phase 4: Testing Infrastructure (Week 4)
- [ ] Generate test structure (tests/)
- [ ] Generate example tests for hello command
- [ ] Add test utilities
- [ ] Configure coverage reporting
- [ ] Document testing patterns in generated README

### Phase 5: Advanced Features (Week 5-6)
- [ ] Config file support (cosmiconfig)
- [ ] File system utilities
- [ ] HTTP client utilities
- [ ] Validation utilities (zod)
- [ ] Feature flags in scaffolder (optional dependencies)
- [ ] Plugin system template (optional)
- [ ] Interactive prompts utilities (optional)

### Phase 6: CI/CD & Documentation (Week 7)
- [ ] GitHub Actions workflow template
- [ ] README template with examples
- [ ] Per-command documentation
- [ ] Contributing guide template
- [ ] License file generation
- [ ] Semantic release configuration

### Phase 7: Polish & Release (Week 8)
- [ ] End-to-end testing of scaffolder
- [ ] Generate multiple test projects
- [ ] Documentation review and polish
- [ ] Performance optimization
- [ ] Publish scaffolder to npm
- [ ] Create demo video/GIF
- [ ] Announce and gather feedback

---

## Part 10: Success Metrics

### User Experience
- **Time to working CLI:** <30 seconds after running scaffolder
- **First command added:** <5 minutes
- **Test written:** <10 minutes
- **Published to npm:** <15 minutes

### Code Quality
- **Type safety:** 100% TypeScript strict mode
- **Test coverage:** >80% overall
- **Linting:** Zero ESLint errors by default
- **Formatting:** Consistent via Prettier

### Developer Satisfaction
- **Clear errors:** All errors provide actionable messages
- **Documentation:** Every feature documented with examples
- **Discoverability:** `--help` at every level
- **Extensibility:** Easy to add commands, utilities, plugins

---

## Part 11: Future Enhancements

### V2 Features
- [ ] Multiple CLI frameworks (add Yargs, oclif options)
- [ ] Multiple testing frameworks (add Jest option)
- [ ] Database client utilities (Prisma template)
- [ ] Docker/Kubernetes templates
- [ ] Monorepo support (pnpm workspaces)
- [ ] i18n support templates
- [ ] Telemetry/analytics templates
- [ ] Auto-update mechanism

### Community
- [ ] Plugin marketplace
- [ ] Starter templates (API client CLI, file processor CLI, etc.)
- [ ] Video tutorials
- [ ] Blog posts on CLI best practices
- [ ] Discord community

---

## References

### Research Sources
- **Best Practices:** docs/research/parallel/cli-best-practices.md
- **Libraries:** docs/research/parallel/cli-libraries.md
- **Scaffolding:** docs/research/parallel/scaffolding-systems.md

### Key Libraries Documentation
- Commander.js: https://github.com/tj/commander.js/
- ts-morph: https://github.com/dsherret/ts-morph
- Vitest: https://vitest.dev/
- Chalk: https://github.com/chalk/chalk
- Ora: https://github.com/sindresorhus/ora
- Zod: https://zod.dev/

### Coding Standards
- Coding Style: @docs/CODING_STYLE.md
- Development Workflow: @docs/DEVELOPMENT_WORKFLOW.md
- TypeScript Coding Skill: plugins/typescript-coding/

---

## Appendix: Example Generated Projects

### Minimal CLI
```
my-cli/
├── src/
│   ├── commands/
│   │   ├── hello.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── errors.ts
│   │   └── logger.ts
│   └── cli.ts
├── tests/
│   └── commands/
│       └── hello.test.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### Full-Featured CLI
```
my-advanced-cli/
├── src/
│   ├── commands/
│   │   ├── init.ts
│   │   ├── build.ts
│   │   ├── deploy.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── config.ts
│   │   ├── errors.ts
│   │   ├── logger.ts
│   │   ├── fs-utils.ts
│   │   ├── http-client.ts
│   │   ├── validators.ts
│   │   ├── prompts.ts
│   │   └── plugin-loader.ts
│   ├── types/
│   │   └── index.ts
│   ├── cli.ts
│   └── index.ts
├── tests/
│   ├── commands/
│   ├── lib/
│   └── fixtures/
├── docs/
│   └── commands/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   └── pre-commit
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vitest.config.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── .npmignore
├── .nvmrc
├── README.md
└── LICENSE
```

---

## Conclusion

This plan provides a comprehensive, batteries-included approach to TypeScript CLI development. By combining:

1. **Modern tooling** (pnpm, Vite, Vitest, TypeScript 5+)
2. **Best practices** (FP patterns, strict typing, comprehensive testing)
3. **Great DX** (fast feedback, clear errors, excellent documentation)
4. **Industry standards** (used by Heroku, Salesforce, etc.)

We create a scaffolding system that enables developers to go from zero to a production-ready CLI in minutes, not hours or days.

The hybrid approach (templates for boilerplate + ts-morph for code generation) provides the perfect balance of simplicity and power, while the modular architecture ensures the generated CLIs are maintainable and extensible.

**Next Steps:** Begin Phase 1 implementation and iterate based on user feedback.
