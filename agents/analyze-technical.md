---
name: analyze-technical
description: Analyze testing, error handling, CI/CD, and technical implementation quality
tools: Read, Grep, Glob, Bash
model: inherit
---

@docs/codebase-exploration/HOW_TO_ANALYZE_TECHNICAL.md

Read the findings from `01-DISCOVERY.md`, `02-ARCHITECTURE.md`, and `03-FEATURES.md` first to understand the project context.

Then analyze all technical implementation details and create or update the file `04-TECHNICAL.md` in the project root with your complete analysis, then confirm completion.

You may run safe commands like `pnpm test --coverage` or `pnpm lint` to gather actual metrics.
