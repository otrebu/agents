---
allowed-tools: Task
description: Explore and document a codebase comprehensively using specialized analysis agents
---

## Overview

This command orchestrates a comprehensive codebase exploration through multiple specialized agents, each analyzing a specific domain. The result is a complete understanding of the project captured in persistent documentation.

## What This Does

Launches 6 specialized analysis agents sequentially:

1. **Discovery Agent** → `01-DISCOVERY.md` (Technology stack, project type)
2. **Architecture Agent** → `02-ARCHITECTURE.md` (Structure, patterns, diagrams)
3. **Features Agent** → `03-FEATURES.md` (Capabilities, user journeys)
4. **Technical Agent** → `04-TECHNICAL.md` (Testing, CI/CD, quality)
5. **Security Agent** → `SECURITY_ANALYSIS.md` (Vulnerabilities, recommendations)
6. **History Agent** → `HISTORY_ANALYSIS.md` (Git history, evolution)

Finally, creates `CODEBASE_GUIDE.md` with executive summary and references to all phase documents.

## Expected Output

After completion, you'll have:

- `01-DISCOVERY.md` - Initial findings
- `02-ARCHITECTURE.md` - Architecture with Mermaid diagrams
- `03-FEATURES.md` - Feature catalog with flow diagrams
- `04-TECHNICAL.md` - Technical deep dive
- `SECURITY_ANALYSIS.md` - Security assessment
- `HISTORY_ANALYSIS.md` - Evolution timeline
- `CODEBASE_GUIDE.md` - Executive summary (main entry point)

## Usage

```bash
/explore-codebase
```

No arguments needed - always performs comprehensive analysis.

## Time Estimate

Depending on codebase size:
- Small projects: 5-10 minutes
- Medium projects: 10-20 minutes
- Large projects: 20-40 minutes

## When to Use

- First time exploring a new codebase
- Onboarding new team members
- Documentation audit
- Pre-refactoring assessment
- Security review preparation
- Architecture decision records

## See Also

- Individual agents can be re-run to update specific analyses
- Phase documents are persistent and can be manually edited
- Re-run this command to refresh all documentation

---

See @docs/codebase-exploration/HOW_TO_EXPLORE_CODEBASE.md for detailed methodology.
