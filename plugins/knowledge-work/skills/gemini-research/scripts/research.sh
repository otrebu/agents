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
ANALYSIS="${3:-}"

# Markdown config
TIMESTAMP=$(date '+%Y%m%d%H%M%S')
RESEARCH_DIR="docs/research/google"
SANITIZED_TOPIC=$(echo "$QUERY" | tr '[:upper:]' '[:lower:]' | tr -cs '[:alnum:]' '-' | sed 's/^-//;s/-$//')
MARKDOWN_FILE="$RESEARCH_DIR/$TIMESTAMP-$SANITIZED_TOPIC.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
Use GoogleSearch to research: %QUERY%

Execute 2-3 diverse queries. Fetch 5-8 high-quality sources with direct quotes. Include URLs for every source and quote.

Return JSON:
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
EOF

read -r -d '' DEEP_TEMPLATE <<'EOF' || true
Use GoogleSearch to deeply research: %QUERY%

Execute 4-6 diverse queries (broad + specific). Fetch 10-15 sources. Extract detailed quotes. Identify contradictions, consensus, and gaps. Include URLs for all sources and quotes.

Return JSON:
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
EOF

read -r -d '' CODE_TEMPLATE <<'EOF' || true
Use GoogleSearch to find practical code examples for: %QUERY%

Execute 3-4 code-focused queries (GitHub, Stack Overflow, official docs). Fetch 6-10 sources with working examples. Extract actual code snippets. Identify patterns, anti-patterns, libraries, and gotchas. Include URLs for all sources.

Return JSON:
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
if ! RESULT=$(gemini --model gemini-2.5-pro -p "$PROMPT" --output-format json 2>&1); then
  echo "❌ Gemini CLI error:" >&2
  echo "$RESULT" >&2

  # Check for auth issues
  if echo "$RESULT" | grep -qi "not authenticated\|authentication\|login"; then
    echo "" >&2
    echo "💡 Fix: Run 'gemini -p \"test\"' to authenticate with Google" >&2
  fi

  exit 1
fi

# Extract response from Gemini CLI wrapper
# Gemini returns: {"response": "...", "stats": {...}}
if ! RESPONSE=$(echo "$RESULT" | jq -r '.response' 2>/dev/null); then
  echo "❌ Failed to extract .response field from Gemini output" >&2
  echo "Raw output:" >&2
  echo "$RESULT" >&2
  exit 1
fi

# Strip markdown code blocks if present
if echo "$RESPONSE" | grep -q '```json'; then
  RESPONSE=$(echo "$RESPONSE" | sed -n '/```json/,/```/p' | sed '1d;$d')
elif echo "$RESPONSE" | grep -q '```'; then
  RESPONSE=$(echo "$RESPONSE" | sed -n '/```/,/```/p' | sed '1d;$d')
fi

# Validate final JSON
if ! echo "$RESPONSE" | jq . > /dev/null 2>&1; then
  echo "❌ Invalid JSON after extraction" >&2
  echo "Extracted content:" >&2
  echo "$RESPONSE" >&2
  exit 1
fi

# Save to file
echo "$RESPONSE" | jq . > "$OUTPUT_FILE"

# Generate markdown
mkdir -p "$RESEARCH_DIR"
if bash "$SCRIPT_DIR/format-markdown.sh" "$OUTPUT_FILE" "$QUERY" "$MODE" "$ANALYSIS" > "$MARKDOWN_FILE"; then
  echo "✅ Research complete!" >&2
  echo "   JSON: $OUTPUT_FILE" >&2
  echo "   Markdown: $MARKDOWN_FILE" >&2
else
  echo "⚠️  Markdown generation failed, but JSON saved to: $OUTPUT_FILE" >&2
fi
echo "" >&2

# Show summary
SOURCES_COUNT=$(echo "$RESPONSE" | jq '.sources | length' 2>/dev/null || echo "0")
QUERIES_COUNT=$(echo "$RESPONSE" | jq '.queries_used | length' 2>/dev/null || echo "0")

echo "📊 Summary:" >&2
echo "   Queries executed: $QUERIES_COUNT" >&2
echo "   Sources found: $SOURCES_COUNT" >&2

# Show first few sources
echo "" >&2
echo "🔗 Top sources:" >&2
echo "$RESPONSE" | jq -r '.sources[:3][] | "   • \(.title)\n     \(.url)"' 2>/dev/null || true

echo "" >&2
echo "📄 Full results:" >&2
echo "   JSON: $OUTPUT_FILE" >&2
echo "   Markdown: $MARKDOWN_FILE" >&2
echo "" >&2
if [[ -z "$ANALYSIS" ]]; then
  echo "ℹ️  Note: No analysis provided. Markdown file is complete but may lack synthesis." >&2
  echo "   Consider providing analysis as 3rd argument for richer output." >&2
  echo "" >&2
fi
