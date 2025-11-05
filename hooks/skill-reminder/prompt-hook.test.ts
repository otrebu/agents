import { describe, it, expect } from 'vitest';
import { matchSkills } from './prompt-hook.js';

describe('Skill Reminder Hook', () => {
  describe('Git commit operations', () => {
    it('should match "commit" pattern', () => {
      const skills = matchSkills('I want to commit my changes');
      expect(skills).toContain('development-lifecycle:git-commit');
    });

    it('should match "push" pattern', () => {
      const skills = matchSkills('Please push this to the repo');
      expect(skills).toContain('development-lifecycle:git-commit');
    });

    it('should match "stage these" pattern', () => {
      const skills = matchSkills('Can you stage these files for me?');
      expect(skills).toContain('development-lifecycle:git-commit');
    });

    it('should match "commit work" pattern', () => {
      const skills = matchSkills('Let me commit this work');
      expect(skills).toContain('development-lifecycle:git-commit');
    });

    it('should match "create commit" pattern', () => {
      const skills = matchSkills('Create a commit with these changes');
      expect(skills).toContain('development-lifecycle:git-commit');
    });
  });

  describe('ESLint fixes', () => {
    it('should match "eslint" pattern', () => {
      const skills = matchSkills('Fix the eslint errors');
      expect(skills).toContain('development-lifecycle:fix-eslint');
    });

    it('should match "lint error" pattern', () => {
      const skills = matchSkills('There are lint errors to fix');
      expect(skills).toContain('development-lifecycle:fix-eslint');
    });

    it('should match "fix lint" pattern', () => {
      const skills = matchSkills('Can you fix lint issues?');
      expect(skills).toContain('development-lifecycle:fix-eslint');
    });
  });

  describe('Feature branch operations', () => {
    it('should match "start feature" pattern', () => {
      const skills = matchSkills('Start a new feature branch');
      expect(skills).toContain('development-lifecycle:start-feature');
    });

    it('should match "create feature" pattern', () => {
      const skills = matchSkills('Create a feature for authentication');
      expect(skills).toContain('development-lifecycle:start-feature');
    });

    it('should match "finish feature" pattern', () => {
      const skills = matchSkills('Finish the feature and merge it');
      expect(skills).toContain('development-lifecycle:finish-feature');
    });

    it('should match "close feature" pattern', () => {
      const skills = matchSkills('Close this feature branch');
      expect(skills).toContain('development-lifecycle:finish-feature');
    });
  });

  describe('Code review', () => {
    it('should match "review code" pattern', () => {
      const skills = matchSkills('Please review this code');
      expect(skills).toContain('development-lifecycle:code-review');
    });

    it('should match "code review" pattern', () => {
      const skills = matchSkills('I need a code review');
      expect(skills).toContain('development-lifecycle:code-review');
    });
  });

  describe('Work summary', () => {
    it('should match "what did i work" pattern', () => {
      const skills = matchSkills('What did I work on today?');
      expect(skills).toContain('development-lifecycle:dev-work-summary');
    });

    it('should match "show my work" pattern', () => {
      const skills = matchSkills('Show me my work');
      expect(skills).toContain('development-lifecycle:dev-work-summary');
    });

    it('should match "daily summary" pattern', () => {
      const skills = matchSkills('Give me a daily summary');
      expect(skills).toContain('development-lifecycle:dev-work-summary');
    });
  });

  describe('Skill/Plugin creation', () => {
    it('should match "create skill" pattern', () => {
      const skills = matchSkills('Help me create a new skill');
      expect(skills).toContain('meta-work:skill-creator');
    });

    it('should match "create plugin" pattern', () => {
      const skills = matchSkills('I want to create a plugin');
      expect(skills).toContain('meta-work:plugin-creator');
    });
  });

  describe('Permissions management', () => {
    it('should match "permission" pattern', () => {
      const skills = matchSkills('Configure permissions for this tool');
      expect(skills).toContain('meta-work:claude-permissions');
    });

    it('should match "sandbox" pattern', () => {
      const skills = matchSkills('Set up sandbox mode');
      expect(skills).toContain('meta-work:claude-permissions');
    });
  });

  describe('TypeScript/JavaScript work', () => {
    it('should match "typescript project" pattern', () => {
      const skills = matchSkills('Set up a new TypeScript project');
      expect(skills).toContain('typescript-coding:typescript-coding');
    });

    it('should match "setup typescript" pattern', () => {
      const skills = matchSkills('Help me setup TypeScript');
      expect(skills).toContain('typescript-coding:typescript-coding');
    });

    it('should match "configure build" pattern', () => {
      const skills = matchSkills('I need to configure the build process');
      expect(skills).toContain('typescript-coding:typescript-coding');
    });
  });

  describe('Multiple matches', () => {
    it('should return multiple skills when patterns overlap', () => {
      const skills = matchSkills('Create a new feature and commit it when done');
      expect(skills).toContain('development-lifecycle:start-feature');
      expect(skills).toContain('development-lifecycle:git-commit');
      expect(skills.length).toBeGreaterThanOrEqual(2);
    });

    it('should return skills in priority order', () => {
      const skills = matchSkills('Commit and review the code');
      // git-commit (priority 1) should come before code-review (priority 4)
      const commitIndex = skills.indexOf('development-lifecycle:git-commit');
      const reviewIndex = skills.indexOf('development-lifecycle:code-review');
      expect(commitIndex).toBeLessThan(reviewIndex);
    });
  });

  describe('Case insensitivity', () => {
    it('should match regardless of case', () => {
      expect(matchSkills('COMMIT THIS')).toContain('development-lifecycle:git-commit');
      expect(matchSkills('Commit This')).toContain('development-lifecycle:git-commit');
      expect(matchSkills('commit this')).toContain('development-lifecycle:git-commit');
    });
  });

  describe('Edge cases', () => {
    it('should return empty array for no matches', () => {
      const skills = matchSkills('Hello world');
      expect(skills).toEqual([]);
    });

    it('should return empty array for empty prompt', () => {
      const skills = matchSkills('');
      expect(skills).toEqual([]);
    });

    it('should handle prompts with special characters', () => {
      const skills = matchSkills('Can you commit this (please)?');
      expect(skills).toContain('development-lifecycle:git-commit');
    });
  });
});
