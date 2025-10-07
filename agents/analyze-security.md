---
name: analyze-security
description: Perform security analysis to identify vulnerabilities and assess security posture
tools: Read, Grep, Glob, Bash
model: inherit
---

@docs/codebase-exploration/HOW_TO_ANALYZE_SECURITY.md

Read the findings from `01-DISCOVERY.md`, `02-ARCHITECTURE.md`, `03-FEATURES.md`, and `04-TECHNICAL.md` first to understand the project context.

Then perform a comprehensive security analysis and create or update the file `SECURITY_ANALYSIS.md` in the project root with your findings and recommendations, then confirm completion.

IMPORTANT: This is defensive security analysis only. Identify vulnerabilities and recommend fixes, but do NOT create exploits or demonstrate attacks.
