#!/usr/bin/env bash
#
# Gemini Research - Deep web research with Google Search grounding
#
# Usage:
#   bash research.sh "query" [mode]
#
# Modes:
#   quick (default) - Fast overview with 5-8 sources
#   deep            - Comprehensive with 10-15 sources + contradictions
#   code            - Code examples and implementation patterns
#
# Output: gemini-research-output.json

set -euo pipefail

# Config
OUTPUT_FILE="gemini-research-output.json"
QUERY="${1:-}"
MODE="${2:-quick}"

# Validate input
if [[ -z "$QUERY" ]]; then
  echo "Error: Query required" >&2
  echo "Usage: bash research.sh \"your query\" [quick|deep|code]" >&2
  exit 1
fi

# Check gemini CLI installed
if ! command -v gemini &> /dev/null; then
  echo "Error: gemini CLI not found" >&2
  echo "Install: npm install -g @google/gemini-cli" >&2
  exit 1
fi

# Prompt templates
read -r -d '' QUICK_TEMPLATE <<'EOF' || true
Use google_web_search to research: %QUERY%

Requirements:
1. Execute 2-3 diverse search queries
2. Fetch 5-8 high-quality sources
3. Extract key points with quotes
4. Cite every source with URL

Return strict JSON format:
{
  "queries_used": ["query1", "query2"],
  "sources": [
    {"title": "Source Title", "url": "https://..."}
  ],
  "key_points": [
    "Fact 1 with context",
    "Fact 2 with context"
  ],
  "quotes": [
    {"text": "Direct quote", "source_url": "https://..."}
  ],
  "summary": "3-5 sentence overview synthesizing findings"
}

IMPORTANT: Use google_web_search tool. Include URLs for every source and quote.
EOF

read -r -d '' DEEP_TEMPLATE <<'EOF' || true
Use google_web_search to deeply research: %QUERY%

Requirements:
1. Execute 4-6 diverse search queries (broad + specific)
2. Fetch 10-15 high-quality sources
3. Extract key points with detailed quotes
4. Identify contradictions between sources
5. Note consensus views and information gaps
6. Cite every source with URL

Return strict JSON format:
{
  "queries_used": ["query1", "query2", "query3"],
  "sources": [
    {"title": "Source Title", "url": "https://..."}
  ],
  "key_points": [
    "Detailed fact 1",
    "Detailed fact 2"
  ],
  "quotes": [
    {"text": "Direct quote with context", "source_url": "https://..."}
  ],
  "contradictions": [
    "Source A says X, but Source B says Y (cite both URLs)"
  ],
  "consensus": [
    "Widely agreed point across multiple sources"
  ],
  "gaps": [
    "Area needing more research or missing data"
  ],
  "summary": "5-7 sentence comprehensive overview synthesizing all findings"
}

IMPORTANT: Use google_web_search tool. Include URLs for every source and quote.
EOF

read -r -d '' CODE_TEMPLATE <<'EOF' || true
Use google_web_search to find practical code examples for: %QUERY%

Requirements:
1. Execute 3-4 code-focused queries (GitHub, Stack Overflow, official docs)
2. Fetch 6-10 sources with working code examples
3. Extract actual code snippets with explanations
4. Identify common patterns and anti-patterns
5. List recommended libraries/tools
6. Document known gotchas with solutions
7. Cite every source with URL

Return strict JSON format:
{
  "queries_used": ["query1", "query2"],
  "sources": [
    {"title": "Source Title", "url": "https://..."}
  ],
  "code_snippets": [
    {
      "language": "typescript",
      "code": "actual code here",
      "source_url": "https://...",
      "description": "What this code does"
    }
  ],
  "patterns": [
    "Common pattern 1",
    "Common pattern 2"
  ],
  "libraries": [
    "library-name (purpose)"
  ],
  "gotchas": [
    {
      "issue": "Known problem",
      "solution": "How to fix it"
    }
  ],
  "summary": "3-5 sentence overview of implementation approach"
}

IMPORTANT: Use google_web_search tool. Include actual code snippets and URLs.
EOF

# Select template based on mode
case "$MODE" in
  quick)
    PROMPT="$QUICK_TEMPLATE"
    ;;
  deep)
    PROMPT="$DEEP_TEMPLATE"
    ;;
  code)
    PROMPT="$CODE_TEMPLATE"
    ;;
  *)
    echo "Error: Unknown mode '$MODE'" >&2
    echo "Valid modes: quick, deep, code" >&2
    exit 1
    ;;
esac

# Inject query into prompt
PROMPT="${PROMPT//%QUERY%/$QUERY}"

# Run Gemini CLI
echo "🔍 Running Gemini research ($MODE mode): $QUERY" >&2
echo "⏳ This may take 5-20 seconds..." >&2

# Execute with error handling
if ! RESULT=$(gemini -p "$PROMPT" --output-format json 2>&1); then
  echo "❌ Gemini CLI error:" >&2
  echo "$RESULT" >&2

  # Check for auth issues
  if echo "$RESULT" | grep -qi "not authenticated\|authentication\|login"; then
    echo "" >&2
    echo "💡 Fix: Run 'gemini -p \"test\"' to authenticate with Google" >&2
  fi

  exit 1
fi

# Validate JSON output
if ! echo "$RESULT" | jq . > /dev/null 2>&1; then
  # Sometimes Gemini wraps JSON in markdown code blocks
  # Try extracting JSON from markdown
  if echo "$RESULT" | grep -q '```json'; then
    RESULT=$(echo "$RESULT" | sed -n '/```json/,/```/p' | sed '1d;$d')
  elif echo "$RESULT" | grep -q '```'; then
    RESULT=$(echo "$RESULT" | sed -n '/```/,/```/p' | sed '1d;$d')
  fi

  # Validate again
  if ! echo "$RESULT" | jq . > /dev/null 2>&1; then
    echo "❌ Invalid JSON response from Gemini" >&2
    echo "Raw output:" >&2
    echo "$RESULT" >&2
    exit 1
  fi
fi

# Save to file
echo "$RESULT" | jq . > "$OUTPUT_FILE"

echo "✅ Research complete! Results saved to: $OUTPUT_FILE" >&2
echo "" >&2

# Show summary
SOURCES_COUNT=$(echo "$RESULT" | jq '.sources | length' 2>/dev/null || echo "0")
QUERIES_COUNT=$(echo "$RESULT" | jq '.queries_used | length' 2>/dev/null || echo "0")

echo "📊 Summary:" >&2
echo "   Queries executed: $QUERIES_COUNT" >&2
echo "   Sources found: $SOURCES_COUNT" >&2

# Show first few sources
echo "" >&2
echo "🔗 Top sources:" >&2
echo "$RESULT" | jq -r '.sources[:3][] | "   • \(.title)\n     \(.url)"' 2>/dev/null || true

echo "" >&2
echo "📄 Full results in: $OUTPUT_FILE" >&2
