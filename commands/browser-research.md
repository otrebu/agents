---
allowed-tools: Task, Read, Write, Bash(sleep:*)
description: Deep research using Claude.ai in browser via Chrome MCP
argument-hint: "<query>"
---

**Role:** Browser-based deep research specialist using Chrome MCP to interact with Claude.ai

## Prerequisites

This command requires Chrome DevTools MCP server to be installed and enabled. See setup instructions below.

## Your task

You will perform deep research by automating Claude.ai in a browser session.

### Step 1: Validate Chrome DevTools MCP availability

Check if Chrome DevTools MCP tools are available by looking for tools starting with `mcp__chrome_devtools__`.

If Chrome DevTools MCP is not available:
- Inform user that Chrome DevTools MCP must be installed
- Provide setup instructions from the documentation below
- Exit gracefully

### Step 2: Navigate to Claude.ai

Use Chrome DevTools MCP tools to:
1. Create/select page using `navigate_page`
2. Navigate to `https://claude.ai`
3. Use `wait_for` to ensure page loads completely

### Step 3: Start conversation

1. Locate the chat input field (usually a textarea or contenteditable element)
2. Use `click` to focus the input
3. Use `fill` to enter the user's query exactly as provided
4. Use `click` to submit (click send button) or use `evaluate_script` to press Enter

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

**Completion detection using `evaluate_script` (use multiple signals):**
```javascript
// Run via evaluate_script tool
const isComplete = () => {
  const noStopButton = !document.querySelector('[aria-label="Stop"]');
  const sendVisible = document.querySelector('[aria-label="Send"]');
  const notThinking = !document.querySelector('[data-testid="thinking-indicator"]');
  const messages = document.querySelectorAll('[data-testid="message"]');
  const lastMessage = messages[messages.length - 1];
  const hasTimestamp = lastMessage?.querySelector('[data-testid="message-timestamp"]');

  return noStopButton && sendVisible && notThinking && hasTimestamp;
};
```

**Element selectors (may need updates as UI changes):**
- Input: `textarea[placeholder*="Talk"]` or `[contenteditable="true"]`
- Send: `button[aria-label="Send"]`
- Stop: `button[aria-label="Stop"]`
- Messages: `div[data-testid="message"]` or similar

## Chrome DevTools MCP setup

### Installation

Use npx (recommended - always gets latest version):

```bash
# No installation needed - uses npx
npx -y chrome-devtools-mcp@latest
```

### Configuration

Add to `settings.json`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ]
    }
  },
  "enabledMcpjsonServers": [
    "github",
    "memory",
    "chrome-devtools"
  ]
}
```

### Requirements

- Node.js v20.19 or newer LTS version
- Chrome stable or newer
- npm package manager

### Verification

After configuration, restart Claude Code. The following tools should be available (27 total):

**Input Automation:**
- `mcp__chrome_devtools__click`
- `mcp__chrome_devtools__fill`
- `mcp__chrome_devtools__hover`
- `mcp__chrome_devtools__drag`
- `mcp__chrome_devtools__fill_form`
- `mcp__chrome_devtools__handle_dialog`
- `mcp__chrome_devtools__upload_file`

**Navigation:**
- `mcp__chrome_devtools__navigate_page`
- `mcp__chrome_devtools__new_page`
- `mcp__chrome_devtools__close_page`
- `mcp__chrome_devtools__list_pages`
- `mcp__chrome_devtools__select_page`
- `mcp__chrome_devtools__navigate_page_history`
- `mcp__chrome_devtools__wait_for`

**Debugging:**
- `mcp__chrome_devtools__evaluate_script`
- `mcp__chrome_devtools__take_screenshot`
- `mcp__chrome_devtools__take_snapshot`
- `mcp__chrome_devtools__get_console_message`
- `mcp__chrome_devtools__list_console_messages`

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
