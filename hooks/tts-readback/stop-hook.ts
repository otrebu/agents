#!/usr/bin/env tsx

import { readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { KokoroTTS } from "kokoro-js";

// Get script directory for relative paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOG_DIR = join(__dirname, "logs");
const LOG_FILE = join(LOG_DIR, "tts-hook.log");

// Ensure logs directory exists
try {
  mkdirSync(LOG_DIR, { recursive: true });
} catch (err) {
  // Directory already exists or can't create - non-fatal
}

function log(message: string) {
  const timestamp = new Date().toISOString();
  try {
    appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
  } catch (err) {
    // Logging failure shouldn't break hook
    console.error("Failed to write log:", err);
  }
}

interface StopHookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: string;
  hook_event_name: string;
  stop_hook_active: boolean;
}

interface TranscriptEntry {
  type: string;
  message?: {
    role: string;
    content: Array<{ type: string; text?: string }>;
  };
}

// Singleton for Kokoro TTS (expensive initialization)
let ttsInstance: KokoroTTS | null = null;

async function getKokoroTTS(): Promise<KokoroTTS> {
  if (!ttsInstance) {
    log("Initializing Kokoro TTS (first call only)...");
    ttsInstance = await KokoroTTS.from_pretrained(
      "onnx-community/Kokoro-82M-ONNX",
      { dtype: "q8", device: "cpu" }
    );
    log("Kokoro TTS initialized");
  }
  return ttsInstance;
}

async function extractRecentAssistantText(
  transcriptPath: string
): Promise<string> {
  log(`Extracting text from: ${transcriptPath}`);
  try {
    // Read last 20 lines efficiently
    const tailCmd = spawn("tail", ["-n", "20", transcriptPath]);

    let output = "";
    for await (const chunk of tailCmd.stdout) {
      output += chunk.toString();
    }

    // Parse JSONL and extract assistant text
    const lines = output.trim().split("\n").filter(Boolean);
    const textParts: string[] = [];

    for (const line of lines) {
      try {
        const entry: TranscriptEntry = JSON.parse(line);

        // Filter for assistant messages
        if (entry.type === "assistant" && entry.message?.role === "assistant") {
          // Extract text content (skip tool uses)
          for (const content of entry.message.content || []) {
            if (content.type === "text" && content.text) {
              textParts.push(content.text);
            }
          }
        }
      } catch (parseError) {
        // Skip malformed lines
        continue;
      }
    }

    const result = textParts.join(" ").trim();
    log(
      `Extracted text (${result.length} chars): ${result.substring(0, 100)}...`
    );
    return result;
  } catch (error) {
    log(`Error extracting transcript: ${error}`);
    console.error("Error extracting transcript:", error);
    return "Claude Code finished.";
  }
}

// Cartesia TTS implementation (preserved for future use)
// Requires: npm install @cartesia/cartesia-js
// Requires: CARTESIA_API_KEY environment variable
async function cartesiaTTS(text: string, apiKey: string): Promise<void> {
  log("Calling Cartesia TTS API...");
  try {
    // Uncomment when ready to use:
    // const Cartesia = (await import("@cartesia/cartesia-js")).default;
    // const client = new Cartesia({ apiKey });
    //
    // const response = await client.tts.bytes({
    //   model_id: "sonic-3",
    //   voice: {
    //     mode: "id",
    //     id: "1463a4e1-56a1-4b41-b257-728d56e93605",
    //   },
    //   output_format: {
    //     container: "wav",
    //     encoding: "pcm_s16le",
    //     sample_rate: 44100,
    //   },
    //   transcript: text,
    // });
    //
    // const audioPath = "/tmp/claude-response.wav";
    // const audioBytes = new Uint8Array(response);
    // writeFileSync(audioPath, audioBytes);
    // log(`Audio saved to ${audioPath} (${audioBytes.length} bytes)`);
    //
    // spawn("afplay", [audioPath], { stdio: "inherit" });
  } catch (error) {
    log(`Cartesia TTS error: ${error}`);
    console.error("Cartesia TTS error:", error);
  }
}

async function kokoroTTS(text: string): Promise<void> {
  log("Calling Kokoro TTS (local)...");
  try {
    const tts = await getKokoroTTS();

    // Generate audio
    const audio = await tts.generate(text, {
      voice: "af_heart",
      speed: 1.0
    });

    // Save to temp file
    const audioPath = "/tmp/claude-response.wav";
    audio.save(audioPath);
    log(`Audio saved to ${audioPath}`);

    // Play with afplay (macOS)
    log("Playing audio with afplay...");
    spawn("afplay", [audioPath], { stdio: "inherit" });
  } catch (error) {
    log(`Kokoro TTS error: ${error}`);
    console.error("Kokoro TTS error:", error);
  }
}

async function textToSpeech(text: string): Promise<void> {
  await kokoroTTS(text);
}

async function main() {
  // Check if TTS is enabled
  if (process.env.CLAUDE_CODE_TTS_ENABLED === 'false') {
    process.exit(0);
  }

  log("=== TTS Hook Started ===");
  log("Using Kokoro TTS (local)");
  try {
    // Read hook input from stdin
    const stdinBuffer = readFileSync(0, "utf-8");
    const hookInput: StopHookInput = JSON.parse(stdinBuffer);
    log(`Session: ${hookInput.session_id}`);

    // Extract recent assistant text from transcript
    const text = await extractRecentAssistantText(hookInput.transcript_path);

    // Skip if no meaningful text found
    if (!text || text.length < 10) {
      log("No significant text to read back (< 10 chars)");
      console.log("No significant text to read back");
      process.exit(0);
    }

    // Generate and play TTS
    await textToSpeech(text);

    log("=== TTS Hook Completed ===");
    // Exit 0 = success, don't block Claude
    process.exit(0);
  } catch (error) {
    log(`Fatal error: ${error}`);
    console.error("Hook error:", error);
    // Exit 0 even on error - don't disrupt Claude
    process.exit(0);
  }
}

main();
