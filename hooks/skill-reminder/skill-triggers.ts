/**
 * Skill trigger rules for pattern-based skill suggestions
 *
 * Pattern matching strategy:
 * - String patterns: case-insensitive substring matching
 * - RegExp patterns: case-insensitive full regex matching
 * - Priority: lower numbers = higher priority (shown first)
 */

export type Pattern = string | RegExp;

export type SkillRule = {
  /** Patterns to match against user prompts */
  patterns: Pattern[];
  /** Fully qualified skill name (e.g., 'development-lifecycle:git-commit') */
  skill: string;
  /** Optional priority for ordering results (lower = higher priority) */
  priority?: number;
};

/**
 * Skill matching rules
 * Convert bash case patterns to TypeScript with support for regex
 */
export const SKILL_RULES: SkillRule[] = [
  // Git commit operations
  {
    patterns: [
      'commit',
      'push',
      /stage.*these/,
      /save.*push/,
      /commit.*work/,
      /create.*commit/,
    ],
    skill: 'development-lifecycle:git-commit',
    priority: 1,
  },

  // ESLint/linting fixes
  {
    patterns: ['eslint', /lint.*error/, /fix.*lint/],
    skill: 'development-lifecycle:fix-eslint',
    priority: 2,
  },

  // Feature branch operations - start
  {
    patterns: [/start.*feature/, /create.*feature/, /new.*feature.*branch/],
    skill: 'development-lifecycle:start-feature',
    priority: 3,
  },

  // Feature branch operations - finish
  {
    patterns: [/finish.*feature/, /close.*feature/, /merge.*feature/],
    skill: 'development-lifecycle:finish-feature',
    priority: 3,
  },

  // Code review
  {
    patterns: [/review.*code/, /code.*review/],
    skill: 'development-lifecycle:code-review',
    priority: 4,
  },

  // Work summary
  {
    patterns: [
      /what.*did.*i.*work/,
      /show.*my.*work/,
      /daily.*summary/,
      /what.*repos/,
    ],
    skill: 'development-lifecycle:dev-work-summary',
    priority: 5,
  },

  // Skill/plugin/command creation
  {
    patterns: [/create.*skill/, /new.*skill/],
    skill: 'meta-work:skill-creator',
    priority: 6,
  },

  {
    patterns: [/create.*plugin/, /new.*plugin/],
    skill: 'meta-work:plugin-creator',
    priority: 6,
  },

  // Permissions management
  {
    patterns: ['permission', 'sandbox', /configure.*access/],
    skill: 'meta-work:claude-permissions',
    priority: 7,
  },

  // TypeScript/JavaScript work (broader pattern)
  {
    patterns: [
      /typescript.*project/,
      /setup.*typescript/,
      /configure.*build/,
      /vite.*setup/,
      /pnpm.*setup/,
    ],
    skill: 'typescript-coding:typescript-coding',
    priority: 8,
  },
];
