# TTS Readback Hook

Text-to-speech hook that reads Claude Code's responses back to you using **Kokoro.js** (local, pure TypeScript).

## Features

- **100% local**: No API keys, no cloud, no internet required
- **Pure TypeScript**: Uses Kokoro.js (ONNX + WASM)
- **Smart text extraction**: Parses transcript to get actual response text
- **High-quality**: 82M parameter model, natural-sounding
- **Efficient**: Only reads last 20 messages, lazy model initialization
- **Privacy-first**: All audio generation happens on your machine

## Setup

### 1. Install Dependencies

```bash
cd hooks/tts-readback
pnpm install
```

**First run**: Downloads ~350MB model from HuggingFace to cache. Subsequent runs reuse cached model.

### 2. Configure Hook

Hook is already configured in `settings.json`:

```json
{
  "hooks": {
    "Stop": [{
      "type": "command",
      "command": "\"$CLAUDE_PROJECT_DIR\"/hooks/tts-readback/node_modules/.bin/tsx \"$CLAUDE_PROJECT_DIR\"/hooks/tts-readback/stop-hook.ts",
      "timeout": 30
    }]
  }
}
```

### 3. Done!

Hook runs automatically when Claude finishes responding.

## How It Works

1. **Stop hook fires** when Claude finishes responding
2. **Extract text**: Tail last 20 lines from transcript JSONL
3. **Parse**: Filter for `type: "assistant"` with `text` content
4. **TTS**: Generate audio locally using Kokoro.js (q8 ONNX model)
5. **Play**: Save as WAV, play with macOS `afplay`

## Configuration

### Enable/Disable TTS

Toggle via environment variable:

```bash
# Disable TTS
export CLAUDE_CODE_TTS_ENABLED=false

# Re-enable (or unset)
export CLAUDE_CODE_TTS_ENABLED=true
unset CLAUDE_CODE_TTS_ENABLED
```

Add to `~/.zshrc` or `~/.bashrc` for persistence.

### Customize Voice

Edit `stop-hook.ts`:

```typescript
// Line 120: Change voice
voice: "af_heart"  // Options: af_sky, af_bella, af_sarah, am_adam, am_michael, etc.

// Line 121: Change speed
speed: 1.0  // Range: 0.5-2.0
```

Available voices: 54 voices across 8 languages. See [Kokoro.js docs](https://www.npmjs.com/package/kokoro-js) for full list.

## Troubleshooting

**Check logs:**
```bash
cat hooks/tts-readback/logs/tts-hook.log

# Watch real-time:
tail -f hooks/tts-readback/logs/tts-hook.log
```

**No audio plays:**
- Check logs for errors
- Verify first run downloaded model (check cache: `~/.cache/huggingface`)
- Ensure afplay works: `afplay /System/Library/Sounds/Ping.aiff`

**Hook times out:**
- First run slower (model download)
- Increase timeout in settings.json: `"timeout": 60`
- Check disk space (~350MB needed)

**Model download fails:**
- Check internet connection (required for first run only)
- Check HuggingFace status
- Manually download: Visit `https://huggingface.co/onnx-community/Kokoro-82M-ONNX`

**Wrong text read:**
- Check logs for "Extracted text" line
- Increase tail lines in `stop-hook.ts` (line 71): `"-n", "20"` → `"-n", "50"`

## Performance

- **Latency**: ~300-500ms (first call ~2-3s for model load)
- **Network**: Only for first run (model download)
- **Cost**: Free
- **Privacy**: 100% local
- **Quality**: Very good (natural-sounding, ~82M params)

## Architecture

- **TTS Engine**: Kokoro.js (ONNX Runtime + WASM)
- **Model**: Kokoro-82M (q8 quantized)
- **Pattern**: Tail + parse (not full JSONL scan)
- **Hook type**: Stop (fires when Claude completes)
- **Singleton**: Model loaded once, reused across calls

## Logs

All activity logged to `logs/tts-hook.log`:
- Session IDs
- Text extraction
- Model initialization
- Audio generation
- Errors

Logs are append-only. Clean periodically:
```bash
> hooks/tts-readback/logs/tts-hook.log  # Clear log
```

## See Also

- [Claude Code Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [Kokoro.js NPM](https://www.npmjs.com/package/kokoro-js)
- [Kokoro Model (HF)](https://huggingface.co/onnx-community/Kokoro-82M-ONNX)
