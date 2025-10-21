# How to Setup Chrome MCP for Browser Research

This guide explains how to install and configure Chrome MCP (Model Context Protocol) to enable browser automation for deep research.

## What is Chrome MCP?

Chrome MCP provides browser automation capabilities via the Model Context Protocol, allowing Claude to:
- Navigate web pages
- Click elements
- Type text
- Extract content
- Take screenshots
- Execute JavaScript in browser context

## Prerequisites

- Node.js 18+ installed
- Claude Code with MCP support
- Chrome or Chromium browser

## Installation Methods

### Method 1: Global Installation (Recommended)

```bash
npm install -g @modelcontextprotocol/server-puppeteer
```

### Method 2: Use via npx (No installation)

```bash
npx -y @modelcontextprotocol/server-puppeteer
```

### Method 3: Local project installation

```bash
pnpm add -D @modelcontextprotocol/server-puppeteer
```

## Configuration

### Step 1: Locate settings.json

Claude Code settings are typically at:
- macOS/Linux: `~/.claude/settings.json`
- Windows: `%USERPROFILE%\.claude\settings.json`

Or in your project root: `/home/user/agents/settings.json`

### Step 2: Add Puppeteer MCP server

Edit `settings.json` and add the puppeteer server configuration:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
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

**Alternative: If installed globally**

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "mcp-server-puppeteer"
    }
  }
}
```

**Alternative: With custom Chrome path**

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ],
      "env": {
        "PUPPETEER_EXECUTABLE_PATH": "/path/to/chrome"
      }
    }
  }
}
```

### Step 3: Restart Claude Code

After modifying settings.json:
1. Exit Claude Code completely
2. Restart Claude Code
3. Verify MCP tools are available

## Verification

### Check available tools

After restart, you should see tools starting with `mcp__puppeteer__`:

```
mcp__puppeteer__navigate
mcp__puppeteer__click
mcp__puppeteer__type
mcp__puppeteer__screenshot
mcp__puppeteer__evaluate
mcp__puppeteer__select
mcp__puppeteer__hover
```

### Test basic navigation

Try a simple command:

```bash
/browser-research "What is the weather today?"
```

## Available MCP Tools

### mcp__puppeteer__navigate

Navigate to a URL.

```typescript
mcp__puppeteer__navigate({
  url: "https://example.com"
})
```

### mcp__puppeteer__click

Click an element by selector.

```typescript
mcp__puppeteer__click({
  selector: "button#submit"
})
```

### mcp__puppeteer__type

Type text into an input field.

```typescript
mcp__puppeteer__type({
  selector: "input[type='text']",
  text: "Hello World"
})
```

### mcp__puppeteer__screenshot

Capture a screenshot.

```typescript
mcp__puppeteer__screenshot({
  path: "/tmp/screenshot.png",
  fullPage: true
})
```

### mcp__puppeteer__evaluate

Execute JavaScript in browser context.

```typescript
mcp__puppeteer__evaluate({
  script: "return document.title"
})
```

### mcp__puppeteer__select

Select option from dropdown.

```typescript
mcp__puppeteer__select({
  selector: "select#country",
  value: "US"
})
```

## Browser Session Management

### Headless vs Headed Mode

**Headless (default):**
- Runs in background
- Faster
- No visual feedback

**Headed (for debugging):**
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer",
        "--headless=false"
      ]
    }
  }
}
```

### Session Persistence

Puppeteer MCP maintains browser session across commands unless explicitly closed.

**Benefits:**
- Faster subsequent commands
- Preserves login state
- Maintains cookies/localStorage

**Caution:**
- Memory usage increases over time
- May need periodic restarts

## Troubleshooting

### Error: "Chrome not found"

**Solution 1: Install Chrome/Chromium**
```bash
# macOS
brew install --cask google-chrome

# Linux (Debian/Ubuntu)
sudo apt-get install chromium-browser

# Linux (Fedora)
sudo dnf install chromium
```

**Solution 2: Specify Chrome path**
```json
{
  "mcpServers": {
    "puppeteer": {
      "env": {
        "PUPPETEER_EXECUTABLE_PATH": "/usr/bin/chromium"
      }
    }
  }
}
```

### Error: "MCP server not responding"

1. Check server is running:
   ```bash
   npx @modelcontextprotocol/server-puppeteer
   ```

2. Verify Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

3. Check logs in Claude Code console

### Error: "Permission denied"

**macOS:**
- Grant accessibility permissions to Terminal/iTerm
- System Preferences > Security & Privacy > Accessibility

**Linux:**
- Ensure Chrome has execute permissions
- Check SELinux/AppArmor policies

### Selector not found

**Common causes:**
- Element not yet loaded (wait longer)
- Incorrect selector syntax
- Page structure changed
- Element in iframe

**Solutions:**
- Add waits before interactions
- Verify selector in browser DevTools
- Use more specific selectors
- Handle iframes explicitly

### Timeout errors

**Increase timeout in settings:**
```json
{
  "mcpServers": {
    "puppeteer": {
      "timeout": 60000  // 60 seconds
    }
  }
}
```

## Security Considerations

### Browser isolation

Puppeteer MCP runs in isolated browser context:
- Separate from your personal browser
- Separate profile/data directory
- No access to your bookmarks/passwords

### Credential handling

**Never:**
- Store credentials in command files
- Log sensitive data
- Share screenshots with credentials visible

**Do:**
- Use environment variables for secrets
- Clear sessions after sensitive operations
- Review screenshots before sharing

### Rate limiting

Respect website rate limits:
- Add delays between requests
- Don't hammer servers
- Respect robots.txt

## Advanced Configuration

### Custom user agent

```json
{
  "mcpServers": {
    "puppeteer": {
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer",
        "--user-agent=MyBot/1.0"
      ]
    }
  }
}
```

### Proxy configuration

```json
{
  "mcpServers": {
    "puppeteer": {
      "env": {
        "HTTP_PROXY": "http://proxy.example.com:8080",
        "HTTPS_PROXY": "http://proxy.example.com:8080"
      }
    }
  }
}
```

### Custom viewport

```json
{
  "mcpServers": {
    "puppeteer": {
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer",
        "--viewport-width=1920",
        "--viewport-height=1080"
      ]
    }
  }
}
```

## Performance Tips

### Reduce resource usage

1. **Use headless mode** (default)
2. **Disable images** for faster loading:
   ```javascript
   // In evaluate script
   await page.setRequestInterception(true);
   page.on('request', (req) => {
     if (req.resourceType() === 'image') {
       req.abort();
     } else {
       req.continue();
     }
   });
   ```

3. **Close tabs when done**
4. **Limit concurrent sessions**

### Optimize polling

- Use progressive intervals
- Exit early on completion
- Don't poll if error detected

## Example: Complete Setup

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Read", "Write", "Bash(*)", "Task", "SlashCommand(*)"]
  },
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ],
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=4096"
      }
    }
  },
  "enabledMcpjsonServers": [
    "github",
    "memory",
    "puppeteer"
  ],
  "enableAllProjectMcpServers": false
}
```

## Testing the Setup

### Basic test

```bash
# Test navigation
/browser-research "test query"
```

### Manual verification

1. Check logs show browser launch
2. Verify no errors in Claude Code console
3. Confirm tools available in tool list

## Next Steps

After setup:
1. Try `/browser-research` command
2. Review browser-researcher agent behavior
3. Customize polling intervals if needed
4. Report issues if selectors break

## Resources

- Puppeteer Documentation: https://pptr.dev/
- MCP Protocol: https://modelcontextprotocol.io/
- Claude Code MCP Guide: https://docs.claude.com/
- Puppeteer MCP Server: https://github.com/modelcontextprotocol/servers

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review Puppeteer MCP server logs
3. Test with minimal configuration
4. Report bugs to MCP server repository
