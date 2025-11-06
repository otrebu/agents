#!/usr/bin/env bash
# Bootstrap Claude Code config for new projects
# Usage: ./setup-project.sh [path-to-project] [--dry-run]

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Auto-detect agents directory from script location
AGENTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETTINGS_TEMPLATE="${AGENTS_DIR}/settings.json"

# Parse arguments
PROJECT_DIR="${1:-.}"
DRY_RUN=false

if [[ "${2:-}" == "--dry-run" ]] || [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    [[ "${1:-}" == "--dry-run" ]] && PROJECT_DIR="."
fi

echo "🚀 Setting up Claude Code config in: $PROJECT_DIR"
echo "📂 Using agents directory: $AGENTS_DIR"
[[ "$DRY_RUN" == true ]] && echo -e "${YELLOW}🔍 DRY RUN MODE${NC}"

# Check for jq
if ! command -v jq &> /dev/null; then
    echo -e "${RED}✗${NC} jq is required but not installed"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

# Check if settings.json exists
if [[ ! -f "$SETTINGS_TEMPLATE" ]]; then
    echo -e "${RED}✗${NC} Template not found: $SETTINGS_TEMPLATE"
    exit 1
fi

# Validate project directory
if [[ ! -d "$PROJECT_DIR" ]]; then
    echo -e "${RED}✗${NC} Project directory does not exist: $PROJECT_DIR"
    exit 1
fi

# Create .claude directory
if [[ "$DRY_RUN" == false ]]; then
    mkdir -p "$PROJECT_DIR/.claude"
    echo -e "${GREEN}✓${NC} Created $PROJECT_DIR/.claude"
else
    echo -e "${YELLOW}[DRY RUN]${NC} Would create $PROJECT_DIR/.claude"
fi

# Parse and transform settings.json using jq
echo "📝 Generating settings.json from template..."

# Simple: just replace relative paths with absolute paths
NEW_SETTINGS=$(jq --arg agents_dir "$AGENTS_DIR" '
walk(
  if type == "string" and (startswith("plugins/") or startswith("hooks/")) then
    $agents_dir + "/" + .
  else
    .
  end
)
' "$SETTINGS_TEMPLATE")

# Validate that plugin directories exist
echo "$NEW_SETTINGS" | jq -r '.plugins[]' | while read -r plugin; do
    if [[ ! -d "$plugin" ]]; then
        echo -e "${RED}✗${NC} Plugin directory not found: $plugin"
        exit 1
    fi
done

# Write the generated settings
if [[ "$DRY_RUN" == true ]]; then
    echo -e "${YELLOW}[DRY RUN]${NC} Would write to $PROJECT_DIR/.claude/settings.json:"
    echo "$NEW_SETTINGS" | jq .
else
    echo "$NEW_SETTINGS" | jq . > "$PROJECT_DIR/.claude/settings.json"
    echo -e "${GREEN}✓${NC} Created .claude/settings.json"
fi

# Summary
echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo "📦 Plugins enabled:"
echo "$NEW_SETTINGS" | jq -r '.plugins[]' | while read -r plugin; do
    plugin_name=$(basename "$plugin")
    echo "   - $plugin_name"
done
echo ""
echo "🪝 Hooks configured:"
echo "   - Stop: Sound notification"
echo "   - UserPromptSubmit: Skill reminder"
echo ""
echo "💡 Tips:"
echo "   - Customize with .claude/settings.local.json for project-specific overrides"
echo "   - Run with --dry-run to preview changes"
