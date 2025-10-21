---
allowed-tools: Task, Read, Write, Bash(sleep:*)
description: Deep research using Claude.ai in browser via Chrome MCP
argument-hint: "<query>"
---

**Role:** Browser-based deep research specialist using Chrome MCP to interact with Claude.ai

## Prerequisites

This command requires Chrome MCP server to be installed and enabled. See setup instructions below.

## Your task

You will perform deep research by automating Claude.ai in a browser session.

### Step 1: Validate Chrome MCP availability

Check if Chrome MCP tools are available by looking for tools starting with `mcp__chrome__` or `mcp__puppeteer__`.

If Chrome MCP is not available:
- Inform user that Chrome MCP must be installed
- Provide setup instructions from the documentation below
- Exit gracefully

### Step 2: Navigate to Claude.ai

Use Chrome MCP tools to:
1. Launch browser (or use existing session)
2. Navigate to `https://claude.ai`
3. Wait for page to load completely

### Step 3: Start conversation

1. Locate the chat input field (usually a textarea or contenteditable element)
2. Click on it to focus
3. Type the user's query exactly as provided
4. Submit the query (click send button or press Enter)

### Step 4: Wait for response

Claude.ai responses stream in real-time. You must:

1. **Poll for completion** - Check every 2-3 seconds if response is complete
2. **Detect completion signals**:
   - Stop button disappears
   - Send button reappears
   - Response text stops changing
   - "Thinking" indicator disappears
   - Last message timestamp appears
3. **Timeout handling** - If no response after 3 minutes, report timeout
4. **Handle errors** - Detect error messages or rate limits

### Step 5: Extract response

Once response is complete:
1. Extract the full response text from the last message
2. Capture any code blocks, formatting, or structured content
3. Take a screenshot for verification (optional)

### Step 6: Return results

Format your output:

```markdown
## Query
[Original query]

## Response
[Full response from Claude.ai]

## Metadata
- Duration: [time taken]
- Completion: [successful/timeout/error]
- Screenshot: [path if captured]
```

## Error handling

- **Rate limits**: Report and suggest waiting time
- **Login required**: Inform user browser session needs authentication
- **Network errors**: Report connection issues
- **Timeout**: Report partial response if available

## Implementation notes

**Polling strategy:**
- Initial delay: 2 seconds (for short responses)
- Poll interval: 2-3 seconds
- Max attempts: 60 (3 minutes total)
- Early exit: if completion detected

**Completion detection (use multiple signals):**
```javascript
// Pseudo-code for detection
isComplete = (
  !document.querySelector('[aria-label="Stop"]') &&
  document.querySelector('[aria-label="Send"]') &&
  !document.querySelector('[data-testid="thinking-indicator"]') &&
  lastMessageHasTimestamp()
)
```

**Element selectors (may need updates as UI changes):**
- Input: `textarea[placeholder*="Talk"]` or `[contenteditable="true"]`
- Send: `button[aria-label="Send"]`
- Stop: `button[aria-label="Stop"]`
- Messages: `div[data-testid="message"]` or similar

## Chrome MCP setup

### Installation

```bash
# Install Chrome MCP server (if not already installed)
npm install -g @modelcontextprotocol/server-puppeteer
# OR
npx @modelcontextprotocol/server-puppeteer
```

### Configuration

Add to `settings.json`:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    }
  },
  "enabledMcpjsonServers": [
    "github",
    "memory",
    "puppeteer"
  ]
}
```

### Verification

After configuration, restart Claude Code. The following tools should be available:
- `mcp__puppeteer__navigate`
- `mcp__puppeteer__click`
- `mcp__puppeteer__type`
- `mcp__puppeteer__screenshot`
- `mcp__puppeteer__evaluate`

## Alternative: Use WebFetch as fallback

If Chrome MCP is unavailable, consider suggesting WebFetch + WebSearch as alternatives (though they won't work for Claude.ai due to auth requirements).

## Example usage

```bash
/browser-research "What are the latest advances in quantum computing error correction?"
```

Expected flow:
1. Opens Claude.ai
2. Enters query
3. Waits for complete response (polling)
4. Returns formatted result with full response

## Security notes

- Browser session may contain sensitive data
- Respect user's existing browser state
- Don't modify bookmarks, settings, or other data
- Screenshot only the response area if capturing images
