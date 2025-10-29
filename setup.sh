#!/usr/bin/env bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Dry run mode flag
DRY_RUN=false

# Get the directory where this script is located (canonical path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

# Calculate relative path from source to target (bash-native)
get_relative_path() {
    local source="$1"
    local target="$2"

    local common_part="$source"
    local result=""

    while [[ "${target#$common_part}" == "${target}" ]]; do
        common_part="$(dirname "$common_part")"
        if [[ -z "$result" ]]; then
            result=".."
        else
            result="../$result"
        fi
    done

    if [[ "$common_part" == "/" ]]; then
        result="$result/"
    fi

    local forward_part="${target#$common_part}"
    if [[ -n "$result" ]] && [[ -n "$forward_part" ]]; then
        result="$result$forward_part"
    elif [[ -n "$forward_part" ]]; then
        result="${forward_part:1}"
    fi

    echo "${result:-.}"
}

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --global              Setup symlinks in ~/.claude"
    echo "  --project <path>      Setup symlinks in <path>/.claude"
    echo "  --dry-run             Show what would be done without making changes"
    echo "  --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --global"
    echo "  $0 --project ~/dev/my-app"
    echo "  $0 --global --dry-run"
}

link_file() {
    local target_dir="$1"
    local source_path="$2"
    local link_name="$3"

    local link_path="${target_dir}/${link_name}"

    # Check if link already exists
    if [ -L "$link_path" ]; then
        echo -e "${YELLOW}⚠${NC}  ${link_name} already exists (symlink), skipping"
        return 0
    fi

    # Check if file/dir already exists
    if [ -e "$link_path" ]; then
        echo -e "${RED}✗${NC}  ${link_name} already exists (not a symlink), skipping"
        return 1
    fi

    # Create the symlink (or show what would be done in dry-run)
    if [ "$DRY_RUN" = true ]; then
        echo -e "${GREEN}[DRY RUN]${NC} Would create ${link_name} -> ${source_path}"
    else
        ln -s "$source_path" "$link_path"
        echo -e "${GREEN}✓${NC}  Created ${link_name} -> ${source_path}"
    fi
}

setup_global() {
    local target_dir="$HOME/.claude"

    echo "Setting up global Claude configuration in ${target_dir}"

    # Create .claude directory if it doesn't exist
    if [ ! -d "$target_dir" ]; then
        if [ "$DRY_RUN" = true ]; then
            echo -e "${GREEN}[DRY RUN]${NC} Would create ${target_dir}"
        else
            mkdir -p "$target_dir"
            echo -e "${GREEN}✓${NC}  Created ${target_dir}"
        fi
    fi

    # Create symlinks with absolute paths for global config
    link_file "$target_dir" "${SCRIPT_DIR}/agents" "agents"
    link_file "$target_dir" "${SCRIPT_DIR}/commands" "commands"
    link_file "$target_dir" "${SCRIPT_DIR}/settings.json" "settings.json"
    link_file "$target_dir" "${SCRIPT_DIR}/docs" "docs"
    link_file "$target_dir" "${SCRIPT_DIR}/skills" "skills"
    link_file "$target_dir" "${SCRIPT_DIR}/CLAUDE.md" "CLAUDE.md"

    echo ""
    if [ "$DRY_RUN" = true ]; then
        echo -e "${GREEN}[DRY RUN]${NC} Global setup preview complete!"
    else
        echo -e "${GREEN}✓${NC}  Global setup complete!"
        echo "Run 'ls -la ~/.claude' to verify"
    fi
}

setup_project() {
    local project_path="$1"
    local target_dir="${project_path}/.claude"

    # Ensure project path exists and get its canonical path
    if [ ! -d "$project_path" ]; then
        echo -e "${RED}✗${NC}  Project directory does not exist: ${project_path}"
        exit 1
    fi

    # Resolve project_path to canonical path (following symlinks)
    project_path="$(cd "$project_path" && pwd -P)"
    target_dir="${project_path}/.claude"

    echo "Setting up project-specific Claude configuration in ${target_dir}"

    # Create .claude directory if it doesn't exist
    if [ ! -d "$target_dir" ]; then
        if [ "$DRY_RUN" = true ]; then
            echo -e "${GREEN}[DRY RUN]${NC} Would create ${target_dir}"
            # For dry-run, create a temporary canonical path for calculation
            local target_dir_canonical="${target_dir}"
        else
            mkdir -p "$target_dir"
            echo -e "${GREEN}✓${NC}  Created ${target_dir}"
        fi
    fi

    # Get canonical path of target_dir (following symlinks)
    local target_dir_canonical
    if [ -d "$target_dir" ]; then
        target_dir_canonical="$(cd "$target_dir" && pwd -P)"
    else
        # If directory doesn't exist yet (dry-run), use the path we would create
        target_dir_canonical="$target_dir"
    fi

    # Calculate relative path from target_dir to SCRIPT_DIR (bash-native)
    local relative_path
    relative_path=$(get_relative_path "$target_dir_canonical" "$SCRIPT_DIR")

    # Create symlinks with relative paths
    link_file "$target_dir" "${relative_path}/agents" "agents"
    link_file "$target_dir" "${relative_path}/commands" "commands"
    link_file "$target_dir" "${relative_path}/settings.json" "settings.json"
    link_file "$target_dir" "${relative_path}/skills" "skills"

    echo ""
    if [ "$DRY_RUN" = true ]; then
        echo -e "${GREEN}[DRY RUN]${NC} Project setup preview complete!"
    else
        echo -e "${GREEN}✓${NC}  Project setup complete!"
        echo "Run 'ls -la ${target_dir}' to verify"
    fi
}

# Parse arguments
if [ $# -eq 0 ]; then
    print_usage
    exit 1
fi

MODE=""
PROJECT_PATH=""

# Parse all arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --global)
            MODE="global"
            shift
            ;;
        --project)
            MODE="project"
            if [ $# -lt 2 ]; then
                echo -e "${RED}✗${NC}  --project requires a path argument"
                print_usage
                exit 1
            fi
            PROJECT_PATH="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help|-h)
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}✗${NC}  Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
done

# Execute based on mode
case "$MODE" in
    global)
        setup_global
        ;;
    project)
        setup_project "$PROJECT_PATH"
        ;;
    *)
        echo -e "${RED}✗${NC}  No mode specified (use --global or --project)"
        print_usage
        exit 1
        ;;
esac
