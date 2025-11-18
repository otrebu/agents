#!/usr/bin/env bash
#
# Format Gemini Research JSON to Markdown
#
# Usage:
#   bash format-markdown.sh <json-file> <topic> <mode> [analysis]
#
# Output: Markdown to stdout

set -euo pipefail

JSON_FILE="${1:-}"
TOPIC="${2:-Research}"
MODE="${3:-quick}"
ANALYSIS="${4:-}"

if [[ -z "$JSON_FILE" || ! -f "$JSON_FILE" ]]; then
  echo "Error: JSON file required" >&2
  echo "Usage: bash format-markdown.sh <json-file> <topic> <mode>" >&2
  exit 1
fi

# Read JSON
JSON=$(cat "$JSON_FILE")

# Extract fields
QUERIES_COUNT=$(echo "$JSON" | jq '.queries_used | length')
SOURCES_COUNT=$(echo "$JSON" | jq '.sources | length')
SUMMARY=$(echo "$JSON" | jq -r '.summary // "No summary available"')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Start markdown (unified template format)
cat <<EOF
# Research: $TOPIC

**Metadata:** gemini-research • $TIMESTAMP • $MODE • $SOURCES_COUNT sources

## Summary

$SUMMARY

## Findings

EOF

# Key points (if present)
if echo "$JSON" | jq -e '.key_points' &>/dev/null; then
  echo "## Key Findings"
  echo ""
  echo "$JSON" | jq -r '.key_points[] | "- \(.)"'
  echo ""
  echo "---"
  echo ""
fi

# Code snippets (code mode)
if echo "$JSON" | jq -e '.code_snippets' &>/dev/null; then
  echo "## Code Examples"
  echo ""

  SNIPPET_COUNT=$(echo "$JSON" | jq '.code_snippets | length')
  for i in $(seq 0 $((SNIPPET_COUNT - 1))); do
    TITLE=$(echo "$JSON" | jq -r ".code_snippets[$i].description // \"Example $((i+1))\"")
    LANG=$(echo "$JSON" | jq -r ".code_snippets[$i].language // \"text\"")
    CODE=$(echo "$JSON" | jq -r ".code_snippets[$i].code")
    SOURCE=$(echo "$JSON" | jq -r ".code_snippets[$i].source_url // \"\"")

    echo "### $TITLE"
    echo ""
    if [[ -n "$SOURCE" ]]; then
      echo "**Source**: $SOURCE"
      echo ""
    fi
    echo '```'"$LANG"
    echo "$CODE"
    echo '```'
    echo ""
  done

  echo "---"
  echo ""
fi

# Patterns (code mode)
if echo "$JSON" | jq -e '.patterns' &>/dev/null; then
  echo "## Patterns & Best Practices"
  echo ""
  echo "$JSON" | jq -r '.patterns[] | "- \(.)"'
  echo ""
  echo "---"
  echo ""
fi

# Libraries (code mode)
if echo "$JSON" | jq -e '.libraries' &>/dev/null; then
  echo "## Recommended Libraries"
  echo ""
  echo "$JSON" | jq -r '.libraries[] | "- **\(.)**"'
  echo ""
  echo "---"
  echo ""
fi

# Gotchas (code mode)
if echo "$JSON" | jq -e '.gotchas' &>/dev/null; then
  echo "## Gotchas & Solutions"
  echo ""

  GOTCHA_COUNT=$(echo "$JSON" | jq '.gotchas | length')
  for i in $(seq 0 $((GOTCHA_COUNT - 1))); do
    ISSUE=$(echo "$JSON" | jq -r ".gotchas[$i].issue")
    SOLUTION=$(echo "$JSON" | jq -r ".gotchas[$i].solution")

    echo "**Issue**: $ISSUE  "
    echo "**Solution**: $SOLUTION"
    echo ""
  done

  echo "---"
  echo ""
fi

# Deep mode sections
if [[ "$MODE" == "deep" ]]; then
  if echo "$JSON" | jq -e '.contradictions or .consensus or .gaps' &>/dev/null; then
    echo "## Deep Analysis"
    echo ""

    if echo "$JSON" | jq -e '.contradictions' &>/dev/null; then
      echo "### Contradictions"
      echo ""
      echo "$JSON" | jq -r '.contradictions[] | "- \(.)"'
      echo ""
    fi

    if echo "$JSON" | jq -e '.consensus' &>/dev/null; then
      echo "### Consensus"
      echo ""
      echo "$JSON" | jq -r '.consensus[] | "- \(.)"'
      echo ""
    fi

    if echo "$JSON" | jq -e '.gaps' &>/dev/null; then
      echo "### Knowledge Gaps"
      echo ""
      echo "$JSON" | jq -r '.gaps[] | "- \(.)"'
      echo ""
    fi

    echo "---"
    echo ""
  fi
fi

# Quotes
if echo "$JSON" | jq -e '.quotes' &>/dev/null; then
  QUOTES_COUNT=$(echo "$JSON" | jq '.quotes | length')
  if [[ "$QUOTES_COUNT" -gt 0 ]]; then
    echo "## Detailed Quotes"
    echo ""

    for i in $(seq 0 $((QUOTES_COUNT - 1))); do
      QUOTE_TEXT=$(echo "$JSON" | jq -r ".quotes[$i].text")
      QUOTE_URL=$(echo "$JSON" | jq -r ".quotes[$i].source_url // \"\"")

      echo "> \"$QUOTE_TEXT\""
      if [[ -n "$QUOTE_URL" ]]; then
        echo "> — [$QUOTE_URL]($QUOTE_URL)"
      fi
      echo ""
    done

    echo "---"
    echo ""
  fi
fi

# Claude's analysis (if provided)
if [[ -n "$ANALYSIS" ]]; then
  cat <<EOF
## Analysis

$ANALYSIS

EOF
else
  cat <<'EOF'
## Analysis

_Analysis not provided. Run with analysis parameter for comprehensive synthesis._

EOF
fi

# Sources section (unified template - always at end)
echo "## Sources"
echo ""
echo "### Web"
echo ""
echo "$JSON" | jq -r '.sources[] | "- [\(.title)](\(.url))"'
echo ""
