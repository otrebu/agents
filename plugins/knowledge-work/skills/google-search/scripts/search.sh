#!/usr/bin/env bash
# Google Search via Gemini CLI
# Usage: ./search.sh "your search query"

set -euo pipefail

QUERY="${1:-}"

if [[ -z "$QUERY" ]]; then
  echo "Error: Query required" >&2
  echo "Usage: $0 \"search query\"" >&2
  exit 1
fi

# Run gemini with Google Search grounding
# -o json for structured output
# Explicit prompt to use google_web_search tool
gemini -p "Use google_web_search to search for: ${QUERY}

Provide a concise answer (2-3 paragraphs max) with key facts.
Include 3-5 source URLs at the end." \
  -o json 2>/dev/null | jq -r '.response // .text // .'
