import chalk from 'chalk'

/**
 * CLI logging utilities for human-readable terminal output
 */
export const log = {
  header: (msg: string) => console.log(chalk.bold.cyan(msg)),
  success: (msg: string) => console.log(chalk.green('✓ ' + msg)),
  error: (msg: string) => console.error(chalk.red('✗ ' + msg)),
  warn: (msg: string) => console.warn(chalk.yellow('⚠ ' + msg)),
  info: (msg: string) => console.log(chalk.blue('ℹ ' + msg)),
  dim: (msg: string) => console.log(chalk.dim(msg)),
  plain: (msg: string) => console.log(msg),
}
