#!/usr/bin/env tsx
import Cartesia from "@cartesia/cartesia-js";
import { writeFileSync } from "fs";

const apiKey = process.env.CARTESIA_API_KEY;
if (!apiKey) {
  console.error("CARTESIA_API_KEY not set");
  process.exit(1);
}

const client = new Cartesia({ apiKey });

const response = await client.tts.bytes({
  model_id: "sonic-3",
  voice: {
    mode: "id",
    id: "1463a4e1-56a1-4b41-b257-728d56e93605",
  },
  output_format: {
    container: "wav",
    encoding: "pcm_s16le",
    sample_rate: 44100,
  },
  transcript: "Testing Cartesia API with fixed parameters",
});

const audioBytes = new Uint8Array(response);
writeFileSync("/tmp/test-cartesia.wav", audioBytes);
console.log(`✓ Saved ${audioBytes.length} bytes to /tmp/test-cartesia.wav`);
