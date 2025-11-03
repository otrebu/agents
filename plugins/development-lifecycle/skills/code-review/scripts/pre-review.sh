#!/bin/bash
#
# Pre-review checks for code-review skill
#
# Exit codes (bitwise OR):
#   0 = all checks passed
#   1 = lint failed
#   2 = format check failed
#   4 = tests failed
#   8 = no package.json (skip checks, proceed to review)
#
# Outputs JSON summary to stdout

set -o pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for package.json
if [[ ! -f "package.json" ]]; then
    echo '{"status":"no_package_json","message":"No package.json found, skipping pre-review checks"}'
    exit 8
fi

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo '{"status":"error","message":"pnpm not found in PATH"}'
    exit 1
fi

# Function to check if a script exists in package.json
script_exists() {
    local script_name="$1"
    node -p "const pkg = require('./package.json'); pkg.scripts && pkg.scripts['$script_name'] ? 'yes' : 'no'" 2>/dev/null | grep -q "yes"
}

EXIT_CODE=0
RESULTS=()

echo -e "${YELLOW}Running pre-review checks...${NC}" >&2
echo "" >&2

# Check and run linter
if script_exists "lint"; then
    echo -e "${YELLOW}▶ Running linter...${NC}" >&2
    if pnpm lint >&2 2>&1; then
        echo -e "${GREEN}✓ Lint passed${NC}" >&2
        RESULTS+=("\"lint\":\"passed\"")
    else
        echo -e "${RED}✗ Lint failed${NC}" >&2
        RESULTS+=("\"lint\":\"failed\"")
        EXIT_CODE=$((EXIT_CODE | 1))
    fi
else
    echo -e "${YELLOW}⊘ No lint script found${NC}" >&2
    RESULTS+=("\"lint\":\"not_found\"")
fi

echo "" >&2

# Check and run format check
if script_exists "format:check"; then
    echo -e "${YELLOW}▶ Running format check...${NC}" >&2
    if pnpm format:check >&2 2>&1; then
        echo -e "${GREEN}✓ Format check passed${NC}" >&2
        RESULTS+=("\"format\":\"passed\"")
    else
        echo -e "${RED}✗ Format check failed${NC}" >&2
        RESULTS+=("\"format\":\"failed\"")
        EXIT_CODE=$((EXIT_CODE | 2))
    fi
elif script_exists "format"; then
    # Fallback: try format script with --check flag if format:check doesn't exist
    echo -e "${YELLOW}▶ Running format check (using format script)...${NC}" >&2
    if pnpm format --check >&2 2>&1; then
        echo -e "${GREEN}✓ Format check passed${NC}" >&2
        RESULTS+=("\"format\":\"passed\"")
    else
        echo -e "${RED}✗ Format check failed${NC}" >&2
        RESULTS+=("\"format\":\"failed\"")
        EXIT_CODE=$((EXIT_CODE | 2))
    fi
else
    echo -e "${YELLOW}⊘ No format:check or format script found${NC}" >&2
    RESULTS+=("\"format\":\"not_found\"")
fi

echo "" >&2

# Check and run tests
if script_exists "test"; then
    echo -e "${YELLOW}▶ Running tests...${NC}" >&2
    if pnpm test >&2 2>&1; then
        echo -e "${GREEN}✓ Tests passed${NC}" >&2
        RESULTS+=("\"tests\":\"passed\"")
    else
        echo -e "${RED}✗ Tests failed${NC}" >&2
        RESULTS+=("\"tests\":\"failed\"")
        EXIT_CODE=$((EXIT_CODE | 4))
    fi
else
    echo -e "${YELLOW}⊘ No test script found${NC}" >&2
    RESULTS+=("\"tests\":\"not_found\"")
fi

echo "" >&2

# Build JSON output
RESULTS_JSON=$(IFS=,; echo "${RESULTS[*]}")
if [[ $EXIT_CODE -eq 0 ]]; then
    echo "{\"status\":\"success\",\"exit_code\":$EXIT_CODE,$RESULTS_JSON}"
else
    echo "{\"status\":\"failed\",\"exit_code\":$EXIT_CODE,$RESULTS_JSON}"
fi

exit $EXIT_CODE
