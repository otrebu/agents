# How to Setup Chrome DevTools MCP for Browser Research

This guide explains how to install and configure Chrome DevTools MCP (Model Context Protocol) to enable browser automation for deep research.

## What is Chrome DevTools MCP?

Chrome DevTools MCP is an official Google tool that provides browser automation capabilities via the Model Context Protocol, allowing Claude to:
- Navigate web pages and control Chrome programmatically
- Click elements, fill forms, and interact with pages
- Execute JavaScript in browser context
- Extract content and analyze DOM/CSS
- Take screenshots and DOM snapshots
- Monitor console messages and network requests
- Analyze performance metrics
- Simulate different network/CPU conditions

## Prerequisites

- **Node.js v20.19** or newer LTS version
- **Chrome stable** or newer browser
- **npm** package manager
- **Claude Code** with MCP support

## Installation

No installation needed! Chrome DevTools MCP uses npx to run the latest version automatically.

### Quick Start

The simplest way is to use npx with `@latest`:

```bash
npx -y chrome-devtools-mcp@latest
```

This approach:
- ✅ Always gets the newest features and bug fixes
- ✅ No global npm pollution
- ✅ No manual updates needed
- ✅ Works across different projects

## Configuration

### Step 1: Locate settings.json

Claude Code settings are typically at:
- **macOS/Linux**: `~/.claude/settings.json`
- **Windows**: `%USERPROFILE%\.claude\settings.json`
- **Project-specific**: `/your-project/.claude/settings.json`

For this repository: `/home/user/agents/settings.json`

### Step 2: Add Chrome DevTools MCP server

Edit `settings.json` and add the chrome-devtools server configuration:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
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

**Note:** The `@latest` tag ensures you always get the newest version.

### Step 3: Restart Claude Code

After modifying settings.json:
1. Exit Claude Code completely
2. Restart Claude Code
3. Verify MCP tools are available (see Verification section below)

## Available MCP Tools (27 total)

After setup, Chrome DevTools MCP provides 27 tools organized into 6 categories:

### Input Automation (7 tools)

Interact with page elements:

- **`mcp__chrome_devtools__click`** - Click elements on the page
- **`mcp__chrome_devtools__drag`** - Drag elements across the page
- **`mcp__chrome_devtools__fill`** - Fill input fields with text
- **`mcp__chrome_devtools__fill_form`** - Complete entire forms at once
- **`mcp__chrome_devtools__handle_dialog`** - Respond to browser dialogs (alerts, confirms)
- **`mcp__chrome_devtools__hover`** - Hover over elements
- **`mcp__chrome_devtools__upload_file`** - Upload files through forms

### Navigation Automation (7 tools)

Control browser tabs and navigation:

- **`mcp__chrome_devtools__close_page`** - Close browser tabs
- **`mcp__chrome_devtools__list_pages`** - Show all open pages
- **`mcp__chrome_devtools__navigate_page`** - Go to URLs
- **`mcp__chrome_devtools__navigate_page_history`** - Move back/forward in history
- **`mcp__chrome_devtools__new_page`** - Open new tabs
- **`mcp__chrome_devtools__select_page`** - Switch between tabs
- **`mcp__chrome_devtools__wait_for`** - Pause for conditions to be met

### Emulation (3 tools)

Simulate different environments:

- **`mcp__chrome_devtools__emulate_cpu`** - Simulate CPU throttling
- **`mcp__chrome_devtools__emulate_network`** - Simulate network conditions (slow 3G, offline, etc.)
- **`mcp__chrome_devtools__resize_page`** - Change viewport dimensions

### Performance (3 tools)

Analyze page performance:

- **`mcp__chrome_devtools__performance_start_trace`** - Begin recording performance data
- **`mcp__chrome_devtools__performance_stop_trace`** - End performance recording
- **`mcp__chrome_devtools__performance_analyze_insight`** - Extract performance metrics (LCP, FCP, etc.)

### Network (2 tools)

Monitor network activity:

- **`mcp__chrome_devtools__get_network_request`** - Retrieve specific request details
- **`mcp__chrome_devtools__list_network_requests`** - View all captured requests

### Debugging (5 tools)

Debug and inspect pages:

- **`mcp__chrome_devtools__evaluate_script`** - Run JavaScript in the page context
- **`mcp__chrome_devtools__get_console_message`** - Retrieve specific console output
- **`mcp__chrome_devtools__list_console_messages`** - View all console logs
- **`mcp__chrome_devtools__take_screenshot`** - Capture page visuals (PNG)
- **`mcp__chrome_devtools__take_snapshot`** - Create DOM snapshots

## Verification

### Test basic setup

After restart, verify tools are available:

```bash
# Try a simple test
/browser-research "test query"
```

The browser-researcher agent should detect Chrome DevTools MCP tools and proceed.

### Manual verification

Check available tools in Claude Code. You should see tools starting with `mcp__chrome_devtools__*`.

## Configuration Options

### Isolated Browser Sessions

For completely isolated browser sessions (no cookies, cache, or history):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--isolated=true"
      ]
    }
  }
}
```

### Custom Chrome Path

If Chrome is installed in a non-standard location:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ],
      "env": {
        "CHROME_PATH": "/path/to/chrome"
      }
    }
  }
}
```

### Headless vs Headed Mode

**Headless (default):**
- Runs in background
- Faster, no visual overhead
- Better for automation

**Headed (for debugging):**
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--headless=false"
      ]
    }
  }
}
```

## Troubleshooting

### Error: "Chrome not found"

**Solution 1: Install Chrome**

```bash
# macOS
brew install --cask google-chrome

# Linux (Debian/Ubuntu)
sudo apt-get install google-chrome-stable

# Linux (Fedora)
sudo dnf install google-chrome-stable
```

**Solution 2: Specify Chrome path**

Use `CHROME_PATH` environment variable (see Configuration Options above).

### Error: "MCP server not responding"

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v20.19 or newer
   ```

2. **Test server manually:**
   ```bash
   npx -y chrome-devtools-mcp@latest
   ```

3. **Check Claude Code logs** for error messages

4. **Restart Claude Code** completely

### Error: "Permission denied"

**macOS:**
- Grant accessibility permissions to Terminal/iTerm
- System Preferences > Security & Privacy > Accessibility

**Linux:**
- Ensure Chrome has execute permissions
- Check SELinux/AppArmor policies

### Selector not found

**Common causes:**
- Element not yet loaded (page still loading)
- Incorrect selector syntax
- Page structure changed
- Element in iframe

**Solutions:**
- Use `wait_for` before interactions
- Verify selector in browser DevTools (F12)
- Use more specific selectors
- Handle iframes explicitly

### Timeout errors

**Increase wait timeout:**

Use `wait_for` tool with longer timeout:
```javascript
mcp__chrome_devtools__wait_for({
  selector: "textarea",
  timeout: 30000  // 30 seconds
})
```

## Security Considerations

### Browser Isolation

Chrome DevTools MCP runs in isolated browser context:
- ✅ Separate from your personal browser
- ✅ Separate profile/data directory
- ✅ No access to your bookmarks/passwords
- ✅ Use `--isolated=true` for complete isolation

### Credential Handling

**Never:**
- ❌ Store credentials in command files
- ❌ Log sensitive data (passwords, tokens)
- ❌ Share screenshots with credentials visible
- ❌ Use personal browser sessions

**Do:**
- ✅ Use environment variables for secrets
- ✅ Clear sessions after sensitive operations
- ✅ Review screenshots before sharing
- ✅ Use isolated browser sessions for sensitive tasks

### Rate Limiting

Respect website rate limits:
- Add delays between requests (use `Bash(sleep:*)`)
- Don't hammer servers
- Respect robots.txt
- Follow website terms of service

## Performance Tips

### Reduce Resource Usage

1. **Use headless mode** (default) - faster, less memory
2. **Close unused tabs** with `close_page`
3. **Limit concurrent sessions** - one browser instance at a time
4. **Disable images** for faster loading:
   ```javascript
   // Use evaluate_script
   await page.setRequestInterception(true);
   page.on('request', (req) => {
     if (req.resourceType() === 'image') {
       req.abort();
     } else {
       req.continue();
     }
   });
   ```

### Optimize Polling

For browser research polling:
- Use progressive intervals (1s → 2s → 3s)
- Exit early on completion detection
- Don't poll if error detected
- Use `wait_for` instead of sleep when possible

## Example: Complete Setup

Here's a complete `settings.json` example:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Bash(*)",
      "Task",
      "SlashCommand(*)"
    ]
  },
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ],
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=4096"
      }
    }
  },
  "enabledMcpjsonServers": [
    "github",
    "memory",
    "chrome-devtools"
  ],
  "enableAllProjectMcpServers": false
}
```

## Testing the Setup

### Basic navigation test

```bash
/browser-research "What is the weather today?"
```

Expected behavior:
1. Launches Chrome
2. Navigates to Claude.ai
3. Enters query
4. Waits for response (polling)
5. Returns formatted result

### Manual test (step by step)

Use Chrome DevTools MCP tools directly:

1. **Navigate:** `mcp__chrome_devtools__navigate_page({ url: "https://example.com" })`
2. **Screenshot:** `mcp__chrome_devtools__take_screenshot({})`
3. **Evaluate:** `mcp__chrome_devtools__evaluate_script({ script: "return document.title" })`

## Advanced Usage

### Multi-page workflows

```javascript
// Open multiple tabs
mcp__chrome_devtools__new_page();
mcp__chrome_devtools__navigate_page({ url: "https://site1.com" });

mcp__chrome_devtools__new_page();
mcp__chrome_devtools__navigate_page({ url: "https://site2.com" });

// List all pages
mcp__chrome_devtools__list_pages();

// Switch between them
mcp__chrome_devtools__select_page({ pageId: "page-id" });
```

### Performance analysis

```javascript
// Start trace
mcp__chrome_devtools__performance_start_trace();

// Navigate and interact
mcp__chrome_devtools__navigate_page({ url: "https://web.dev" });
mcp__chrome_devtools__wait_for({ selector: "main", timeout: 5000 });

// Stop and analyze
mcp__chrome_devtools__performance_stop_trace();
mcp__chrome_devtools__performance_analyze_insight();
```

### Network monitoring

```javascript
// Navigate (network requests auto-captured)
mcp__chrome_devtools__navigate_page({ url: "https://api.example.com" });

// List all requests
mcp__chrome_devtools__list_network_requests();

// Get specific request
mcp__chrome_devtools__get_network_request({ requestId: "request-123" });
```

## Next Steps

After setup:
1. ✅ Try `/browser-research` command
2. ✅ Review browser-researcher agent behavior
3. ✅ Experiment with different queries
4. ✅ Customize polling intervals if needed
5. ✅ Report issues to [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)

## Resources

- **Chrome DevTools MCP GitHub:** https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Official Blog Post:** https://developer.chrome.com/blog/chrome-devtools-mcp
- **MCP Protocol Docs:** https://modelcontextprotocol.io/
- **Claude Code MCP Guide:** https://docs.claude.com/
- **Chrome DevTools Docs:** https://developer.chrome.com/docs/devtools/

## Support

If you encounter issues:
1. ✅ Check this guide's troubleshooting section
2. ✅ Review Chrome DevTools MCP GitHub issues
3. ✅ Test with minimal configuration
4. ✅ Verify Node.js and Chrome versions
5. ✅ Report bugs to [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues)

## Updates

Chrome DevTools MCP is actively developed. Using `@latest` ensures you get:
- ✅ Latest bug fixes
- ✅ New tools and features
- ✅ Performance improvements
- ✅ Security patches

No manual updates needed when using `@latest` with npx!
