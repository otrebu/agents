# TTS Readback Hook

Text-to-speech hook that reads Claude Code's responses back to you using Cartesia AI.

## Features

- **Automatic readback**: Reads Claude's responses when it finishes (Stop hook)
- **Smart text extraction**: Parses transcript to get actual response text
- **High-quality TTS**: Uses Cartesia Sonic-3 model
- **Efficient**: Only reads last 20 messages (no full transcript parsing)
- **Truncation**: Limits to 500 chars to avoid very long playback

## Setup

### 1. Install Dependencies

```bash
cd hooks/tts-readback
pnpm install
```

### 2. Get Cartesia API Key

1. Sign up at [cartesia.ai](https://cartesia.ai)
2. Get your API key from the dashboard
3. Add to your shell profile:

```bash
# Add to ~/.zshrc or ~/.bashrc
export CARTESIA_API_KEY="your-api-key-here"
```

4. Reload shell or run:

```bash
source ~/.zshrc  # or ~/.bashrc
```

### 3. Configure Hook

The hook is already configured in `settings.json`:

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR\"/hooks/tts-readback/node_modules/.bin/tsx \"$CLAUDE_PROJECT_DIR\"/hooks/tts-readback/stop-hook.ts",
        "timeout": 30
      }]
    }]
  }
}
```

Note: Uses local tsx from node_modules (not global installation required).

### 4. Test

Create test input file:

```bash
cat > test-input.json << 'EOF'
{
  "session_id": "test",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/Users/test",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": false
}
EOF
```

Run hook:

```bash
pnpm test
```

## How It Works

1. **Stop hook fires** when Claude finishes responding
2. **Extract text**: Tail last 20 lines from transcript JSONL
3. **Parse**: Filter for `type: "assistant"` with `text` content
4. **Truncate**: Limit to 500 chars (configurable)
5. **TTS**: Send to Cartesia Sonic-3 API
6. **Play**: Save as WAV, play with macOS `afplay`

## Configuration

### Enable/Disable TTS

Toggle TTS via environment variable:

```bash
# Disable TTS
export CLAUDE_CODE_TTS_ENABLED=false

# Re-enable (or unset)
export CLAUDE_CODE_TTS_ENABLED=true
unset CLAUDE_CODE_TTS_ENABLED
```

Add to `~/.zshrc` or `~/.bashrc` for persistence.

### Customize Voice/Behavior

Edit `stop-hook.ts`:

```typescript
// Change voice (line 67)
voice: {
  mode: "id",
  id: "694f9389-aac1-45b6-b726-9d9369183238", // Change voice ID
}

// Change truncation length (line 108)
const maxLength = 500; // Increase/decrease

// Change number of recent lines parsed (line 28)
const tailCmd = spawn("tail", ["-n", "20", transcriptPath]); // Adjust -n value
```

## Troubleshooting

**Check logs first:**
```bash
cat hooks/tts-readback/logs/tts-hook.log
# or watch in real-time:
tail -f hooks/tts-readback/logs/tts-hook.log
```

**No audio plays:**
- Check logs for errors
- Check network connectivity

**Hook times out:**
- Increase timeout in settings.json: `"timeout": 60`
- Check transcript file exists and is readable

**Error in logs:**
- Run with debug: `tsx stop-hook.ts < test-input.json`
- Check stderr output

**Wrong text read:**
- Check logs for "Extracted text" line
- Increase tail lines to capture more context
- Check transcript format with: `tail -5 /path/to/transcript.jsonl | jq`

## Performance

- **Latency**: ~40ms time-to-first-audio (Cartesia)
- **Network**: Requires internet connection
- **Cost**: Pay-per-character (check Cartesia pricing)
- **Efficiency**: Only reads last 20 lines (not full transcript)

## Architecture

Based on community research findings:

- **Pattern**: Tail + parse (not full JSONL scan)
- **Hook type**: Stop (fires when Claude completes)
- **TTS provider**: Cartesia (premium quality)
- **Fallback**: Exits cleanly if API key missing (silent mode)

## See Also

- [Claude Code Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [Cartesia API Docs](https://docs.cartesia.ai/)
- [Research: Hook patterns](https://stacktoheap.com/blog/2025/08/03/having-fun-with-claude-code-hooks/)
