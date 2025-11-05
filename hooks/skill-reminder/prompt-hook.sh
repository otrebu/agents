#!/usr/bin/env bash
# UserPromptSubmit hook - remind about relevant skills based on user input

# Read JSON input from stdin
INPUT=$(cat)

# Extract the prompt field from JSON using jq
USER_MESSAGE=$(echo "$INPUT" | jq -r '.prompt // empty')

# Convert to lowercase for case-insensitive matching
USER_MESSAGE_LOWER=$(echo "$USER_MESSAGE" | tr '[:upper:]' '[:lower:]')

# Pattern match against skill trigger words
case "$USER_MESSAGE_LOWER" in
  # Git commit operations
  *commit*|*push*|*stage*these*|*save*push*|*commit*work*|*create*commit*)
    echo ""
    echo "💡 Skill available: development-lifecycle:git-commit"
    ;;

  # ESLint/linting fixes
  *eslint*|*lint*error*|*fix*lint*)
    echo ""
    echo "💡 Skill available: development-lifecycle:fix-eslint"
    ;;

  # Feature branch operations
  *start*feature*|*create*feature*|*new*feature*branch*)
    echo ""
    echo "💡 Skill available: development-lifecycle:start-feature"
    ;;

  *finish*feature*|*close*feature*|*merge*feature*)
    echo ""
    echo "💡 Skill available: development-lifecycle:finish-feature"
    ;;

  # Code review
  *review*code*|*code*review*)
    echo ""
    echo "💡 Skill available: development-lifecycle:code-review"
    ;;

  # Work summary
  *what*did*i*work*|*show*my*work*|*daily*summary*|*what*repos*)
    echo ""
    echo "💡 Skill available: development-lifecycle:dev-work-summary"
    ;;

  # Skill/plugin/command creation
  *create*skill*|*new*skill*)
    echo ""
    echo "💡 Skill available: meta-work:skill-creator"
    ;;

  *create*plugin*|*new*plugin*)
    echo ""
    echo "💡 Skill available: meta-work:plugin-creator"
    ;;

  # Permissions management
  *permission*|*sandbox*|*configure*access*)
    echo ""
    echo "💡 Skill available: meta-work:claude-permissions"
    ;;

  # TypeScript/JavaScript work (broader pattern)
  *typescript*project*|*setup*typescript*|*configure*build*|*vite*setup*|*pnpm*setup*)
    echo ""
    echo "💡 Skill available: typescript-coding:typescript-coding"
    ;;
esac
