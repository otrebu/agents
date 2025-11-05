#!/usr/bin/env tsx

import { readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Cartesia from "@cartesia/cartesia-js";

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

async function extractRecentAssistantText(transcriptPath: string): Promise<string> {
  log(`Extracting text from: ${transcriptPath}`);
  try {
    // Read last 20 lines efficiently (pattern from research)
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
    log(`Extracted text (${result.length} chars): ${result.substring(0, 100)}...`);
    return result;
  } catch (error) {
    log(`Error extracting transcript: ${error}`);
    console.error("Error extracting transcript:", error);
    return "Claude Code finished.";
  }
}

async function textToSpeech(text: string): Promise<void> {
  const apiKey = process.env.CARTESIA_API_KEY;

  if (!apiKey) {
    log("CARTESIA_API_KEY not set, falling back to silent mode");
    console.error("CARTESIA_API_KEY not set, falling back to silent mode");
    return;
  }

  log("Calling Cartesia TTS API...");
  try {
    const client = new Cartesia({ apiKey });

    // Generate speech using Cartesia
    const response = await client.tts.bytes({
      modelId: "sonic-3",
      voice: {
        mode: "id",
        id: "694f9389-aac1-45b6-b726-9d9369183238", // Default voice
      },
      outputFormat: {
        container: "wav",
        encoding: "pcm_s16le",
        sampleRate: 44100,
      },
      transcript: text,
    });

    // Save to temp file
    const audioPath = "/tmp/claude-response.wav";
    const audioBytes = await new Response(response).bytes();
    writeFileSync(audioPath, audioBytes);
    log(`Audio saved to ${audioPath} (${audioBytes.length} bytes)`);

    // Play with afplay (macOS)
    log("Playing audio with afplay...");
    spawn("afplay", [audioPath], { stdio: "inherit" });
  } catch (error) {
    log(`TTS error: ${error}`);
    console.error("TTS error:", error);
    // Non-fatal - don't block Claude
  }
}

async function main() {
  log("=== TTS Hook Started ===");
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

    // Truncate very long responses (optional)
    const maxLength = 500;
    const truncatedText = text.length > maxLength
      ? text.substring(0, maxLength) + "... and more."
      : text;

    if (truncatedText !== text) {
      log(`Truncated to ${maxLength} chars`);
    }

    // Generate and play TTS
    await textToSpeech(truncatedText);

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
