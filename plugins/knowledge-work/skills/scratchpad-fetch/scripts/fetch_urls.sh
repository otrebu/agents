#!/usr/bin/env bash

# Fetch URLs and append to timestamped scratchpad file
# Usage: fetch_urls.sh <url1> [url2] [url3] ...

set -euo pipefail

# Create timestamp
timestamp=$(date +"%Y%m%d_%H%M%S")

# Ensure scratchpad directory exists
scratchpad_dir="docs/scratchpad"
mkdir -p "$scratchpad_dir"

# Output file
output_file="$scratchpad_dir/${timestamp}.md"

# Write header
echo "# Scratchpad - $(date '+%Y-%m-%d %H:%M:%S')" > "$output_file"
echo "" >> "$output_file"
echo "Fetched $(($# )) URLs:" >> "$output_file"
for url in "$@"; do
  echo "- $url" >> "$output_file"
done
echo "" >> "$output_file"
echo "---" >> "$output_file"
echo "" >> "$output_file"

# Fetch each URL
for url in "$@"; do
  echo "Fetching: $url" >&2

  echo "## Source: $url" >> "$output_file"
  echo "" >> "$output_file"

  if curl -sL "$url" >> "$output_file" 2>/dev/null; then
    echo "✓ Fetched: $url" >&2
  else
    echo "✗ Failed: $url" >&2
    echo "_Failed to fetch this URL_" >> "$output_file"
  fi

  echo "" >> "$output_file"
  echo "---" >> "$output_file"
  echo "" >> "$output_file"
done

echo ""
echo "✓ All URLs saved to: $output_file"
