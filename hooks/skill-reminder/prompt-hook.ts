#!/usr/bin/env node
/**
 * UserPromptSubmit hook - suggest relevant skills based on user input
 *
 * Reads JSON from stdin, matches patterns against skill triggers,
 * outputs hybrid format:
 * - stderr: human-readable skill suggestions for user visibility
 * - stdout: JSON with additionalContext for Claude's awareness
 */

import type {
  SyncHookJSONOutput,
  UserPromptSubmitHookInput,
} from "@anthropic-ai/claude-agent-sdk";
import { SKILL_RULES, type Pattern } from "./skill-triggers";

/**
 * Create a matcher function for a specific prompt
 * Functional composition pattern: returns a function that tests patterns
 */
const createMatcher =
  (prompt: string) =>
  (pattern: Pattern): boolean => {
    const lowerPrompt = prompt.toLowerCase();

    // String patterns: substring matching
    if (typeof pattern === "string") {
      return lowerPrompt.includes(pattern);
    }

    // RegExp patterns: case-insensitive full match
    // Convert to case-insensitive if not already
    const flags = pattern.flags.includes("i")
      ? pattern.flags
      : `${pattern.flags}i`;
    const caseInsensitivePattern = new RegExp(pattern.source, flags);
    return caseInsensitivePattern.test(lowerPrompt);
  };

/**
 * Match user prompt against all skill rules
 * Returns array of matched skill names, sorted by priority
 */
export function matchSkills(prompt: string): string[] {
  const matches = createMatcher(prompt);

  return SKILL_RULES.filter((rule) => rule.patterns.some(matches))
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .map((rule) => rule.skill);
}

/**
 * Read JSON from stdin and parse it
 */
async function readInputJson<T>(): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const jsonString = Buffer.concat(chunks).toString("utf-8");
  return JSON.parse(jsonString);
}

/**
 * Log message to stderr (terminal-friendly output that won't interfere with JSON stdout)
 */
function logToUser(message: string): void {
  console.error(message);
}

/**
 * Main hook execution
 */
async function main(): Promise<void> {
  try {
    // Read and parse input
    const input = await readInputJson<UserPromptSubmitHookInput>();

    // Validate input has required prompt field
    if (!input.prompt) {
      // No prompt to analyze, silent exit
      return;
    }

    // Match skills against user prompt
    const matchedSkills = matchSkills(input.prompt);

    // No matches, no output
    if (matchedSkills.length === 0) {
      return;
    }

    // Hybrid output:
    // 1. stderr: User-visible skill suggestions (won't interfere with JSON stdout)
    logToUser("");
    if (matchedSkills.length === 1) {
      logToUser(`💡 Skill available: ${matchedSkills[0]}`);
    } else {
      logToUser("💡 Skills available:");
      matchedSkills.forEach((skill) => {
        logToUser(`   - ${skill}`);
      });
    }

    // 2. stdout: JSON output for Claude's context injection
    const output: SyncHookJSONOutput = {
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: `[System: Skills available for this task: ${matchedSkills.join(
          ", "
        )}]`,
      },
    };

    console.log(JSON.stringify(output));
  } catch (error) {
    // Hooks should fail gracefully - log to stderr but don't crash
    logToUser(
      `Skill reminder hook error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(0); // Exit successfully even on error
  }
}

main();
