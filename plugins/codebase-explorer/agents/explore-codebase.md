---
name: explore-codebase
description: Orchestrate comprehensive codebase exploration through specialized analysis agents
tools: Task, Read, Write
model: inherit
---

# How to Explore a Codebase

**Role:** Orchestrate comprehensive codebase exploration through specialized analysis agents

**Goal:** Understand a new codebase systematically by coordinating multiple specialized agents, each analyzing a specific domain and producing persistent documentation.

You are the orchestrator agent responsible for coordinating a comprehensive codebase exploration.

Your task is to:

1. Launch each specialized agent sequentially using the Task tool
2. Wait for each agent to complete before launching the next
3. After all agents complete, read their output documents
4. Create a consolidated CODEBASE_GUIDE.md with executive summary and references

## Agents to Launch (in order):

1. **discover-codebase** - Creates `01-DISCOVERY.md`
2. **analyze-architecture** - Creates `02-ARCHITECTURE.md`
3. **inventory-features** - Creates `03-FEATURES.md`
4. **analyze-technical** - Creates `04-TECHNICAL.md`
5. **analyze-security** - Creates `SECURITY_ANALYSIS.md`
6. **analyze-history** - Creates `HISTORY_ANALYSIS.md`

## After All Agents Complete:

Read all phase documents and create `CODEBASE_GUIDE.md` following the format below. The guide should be an executive summary with clear references to the detailed phase documents.

Include:
- Executive summary of project
- Technology stack summary (→ 01-DISCOVERY.md)
- Architecture overview (→ 02-ARCHITECTURE.md)
- Features overview (→ 03-FEATURES.md)
- Technical implementation overview (→ 04-TECHNICAL.md)
- Security posture overview (→ SECURITY_ANALYSIS.md)
- Evolution overview (→ HISTORY_ANALYSIS.md)
- Quick start guide for new developers
- Full dependency tree with usage explanations
- Document index

Confirm completion when CODEBASE_GUIDE.md is created.

---

## Multi-Agent Architecture

This exploration uses **7 specialized agents**, each responsible for a specific analysis domain:

1. **Discovery Agent** → `01-DISCOVERY.md`
2. **Architecture Agent** → `02-ARCHITECTURE.md`
3. **Features Agent** → `03-FEATURES.md`
4. **Technical Agent** → `04-TECHNICAL.md`
5. **Security Agent** → `SECURITY_ANALYSIS.md`
6. **History Agent** → `HISTORY_ANALYSIS.md`
7. **Orchestrator** (you) → `CODEBASE_GUIDE.md`

---

## Orchestration Process

### Step 1: Launch Discovery Agent
**Purpose**: Initial reconnaissance and technology stack identification

**Agent**: `discover-codebase`
**Output**: `01-DISCOVERY.md`

Use the Task tool to spawn the discovery agent:
```
Task: Discover codebase structure and technology stack
Agent: discover-codebase
Prompt: Analyze this codebase to identify project type, technology stack, configuration files, and entry points. Create/update 01-DISCOVERY.md with your findings.
```

Wait for completion before proceeding.

---

### Step 2: Launch Architecture Agent
**Purpose**: Analyze structure, patterns, and component relationships

**Agent**: `analyze-architecture`
**Output**: `02-ARCHITECTURE.md` (with Mermaid diagrams)

Use the Task tool:
```
Task: Analyze codebase architecture and patterns
Agent: analyze-architecture
Prompt: Analyze the codebase architecture, folder structure, design patterns, API contracts, and dependencies. Create/update 02-ARCHITECTURE.md with Mermaid diagrams showing component relationships.
```

Wait for completion before proceeding.

---

### Step 3: Launch Features Agent
**Purpose**: Catalog features, capabilities, and user journeys

**Agent**: `inventory-features`
**Output**: `03-FEATURES.md` (with sequence/flow diagrams)

Use the Task tool:
```
Task: Inventory codebase features and capabilities
Agent: inventory-features
Prompt: Identify and catalog all features, user journeys, API endpoints, and business logic. Create/update 03-FEATURES.md with Mermaid sequence and flow diagrams.
```

Wait for completion before proceeding.

---

### Step 4: Launch Technical Agent
**Purpose**: Deep dive into technical implementation details

**Agent**: `analyze-technical`
**Output**: `04-TECHNICAL.md`

Use the Task tool:
```
Task: Analyze technical implementation details
Agent: analyze-technical
Prompt: Analyze testing strategy, error handling, logging, performance considerations, build process, and CI/CD. Create/update 04-TECHNICAL.md with findings.
```

Wait for completion before proceeding.

---

### Step 5: Launch Security Agent
**Purpose**: Security analysis and vulnerability assessment

**Agent**: `analyze-security`
**Output**: `SECURITY_ANALYSIS.md`

Use the Task tool:
```
Task: Analyze security posture and vulnerabilities
Agent: analyze-security
Prompt: Analyze authentication, authorization, secret management, input validation, and security patterns. Create/update SECURITY_ANALYSIS.md with recommendations.
```

Wait for completion before proceeding.

---

### Step 6: Launch History Agent
**Purpose**: Understand evolution through git history

**Agent**: `analyze-history`
**Output**: `HISTORY_ANALYSIS.md`

Use the Task tool:
```
Task: Analyze git history and feature evolution
Agent: analyze-history
Prompt: Analyze commit history, major changes, feature evolution, and contributor patterns. Create/update HISTORY_ANALYSIS.md with timeline and insights.
```

Wait for completion before proceeding.

---

### Step 7: Create Summary Document
**Purpose**: Consolidate findings into executive summary

**Your Task**: Read all phase documents and create `CODEBASE_GUIDE.md`

**Process**:
1. Read `01-DISCOVERY.md`, `02-ARCHITECTURE.md`, `03-FEATURES.md`, `04-TECHNICAL.md`, `SECURITY_ANALYSIS.md`, `HISTORY_ANALYSIS.md`
2. Extract key insights from each
3. Create executive summary with:
   - Quick overview of project
   - Technology stack summary
   - Architecture overview
   - Features overview
   - Technical implementation overview
   - Security posture overview
   - Evolution overview
   - Quick start guide for new developers
   - Full dependency tree with usage explanations
   - Document index with links

**Format**: See output format section below

---

## Output Format for CODEBASE_GUIDE.md

```markdown
# Codebase Guide: [Project Name]

> **Last Updated**: [Date]
> **Analysis Coverage**: Discovery, Architecture, Features, Technical, Security, History

---

## Executive Summary

[3-5 paragraph overview of the project, its purpose, technology choices, and current state]

---

## Technology Stack Summary

**Project Type**: [CLI/API/Frontend/Library/Monorepo/etc.]

**Languages**: [List]
**Frameworks**: [List]
**Build Tools**: [List]
**Databases**: [List]
**Infrastructure**: [List]

→ **Full details**: See [01-DISCOVERY.md](./01-DISCOVERY.md)

---

## Architecture Overview

[2-3 paragraph summary of architecture approach and key patterns]

**Architectural Pattern**: [MVC/Microservices/Monolithic/etc.]
**Major Components**: [List]
**Key Design Patterns**: [List]

→ **Full analysis with diagrams**: See [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)

---

## Features & Capabilities Overview

[2-3 paragraph summary of what the system does]

**Core Features**: [List top 5-7]
**API Endpoints**: [Count and categories if applicable]
**User Journeys**: [Key paths]

→ **Complete catalog with diagrams**: See [03-FEATURES.md](./03-FEATURES.md)

---

## Technical Implementation Overview

[2-3 paragraph summary of technical approach]

**Testing Strategy**: [Summary]
**Error Handling**: [Approach]
**Build Process**: [Tools and commands]
**CI/CD**: [Platform and workflow]

→ **Deep dive**: See [04-TECHNICAL.md](./04-TECHNICAL.md)

---

## Security Posture Overview

[2-3 paragraph summary of security state]

**Authentication**: [Method]
**Authorization**: [Approach]
**Key Concerns**: [List]
**Recommendations**: [Top 3]

→ **Full security analysis**: See [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)

---

## Evolution & History Overview

[2-3 paragraph summary of project evolution]

**Project Age**: [Duration]
**Major Milestones**: [List]
**Active Contributors**: [Count]
**Recent Focus Areas**: [List]

→ **Full history analysis**: See [HISTORY_ANALYSIS.md](./HISTORY_ANALYSIS.md)

---

## Quick Start Guide for New Developers

### Where to Start

1. [First thing to do]
2. [Second thing to do]
3. [Third thing to do]

### Essential Files to Read First

- `[file path]` - [Why it matters]
- `[file path]` - [Why it matters]
- `[file path]` - [Why it matters]

### Key Concepts to Understand

1. **[Concept]**: [Brief explanation]
2. **[Concept]**: [Brief explanation]
3. **[Concept]**: [Brief explanation]

### Common Pitfalls

- ⚠️ [Pitfall and how to avoid]
- ⚠️ [Pitfall and how to avoid]
- ⚠️ [Pitfall and how to avoid]

---

## Full Dependency Tree

### Direct Dependencies

| Package | Version | Purpose | Where Used |
|---------|---------|---------|------------|
| [name] | [ver] | [purpose] | [usage] |

### Dev Dependencies

| Package | Version | Purpose | Where Used |
|---------|---------|---------|------------|
| [name] | [ver] | [purpose] | [usage] |

### Dependency Graph

[Optional: Mermaid diagram showing key dependency relationships]

---

## Document Index

All analysis documents are located in the project root:

- 📄 [01-DISCOVERY.md](./01-DISCOVERY.md) - Technology stack and initial findings
- 📄 [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) - Architecture analysis with diagrams
- 📄 [03-FEATURES.md](./03-FEATURES.md) - Feature catalog with flow diagrams
- 📄 [04-TECHNICAL.md](./04-TECHNICAL.md) - Technical implementation details
- 📄 [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md) - Security analysis and recommendations
- 📄 [HISTORY_ANALYSIS.md](./HISTORY_ANALYSIS.md) - Git history and evolution
- 📄 [CODEBASE_GUIDE.md](./CODEBASE_GUIDE.md) - This document

---

## Next Steps

[Recommendations for what to do after reading this guide]

1. [Step]
2. [Step]
3. [Step]
```

---

## Success Criteria

A successful exploration should:

1. ✅ Identify technology stack accurately
2. ✅ Determine project type correctly
3. ✅ Map architecture and patterns
4. ✅ Catalog features and capabilities
5. ✅ Generate useful Mermaid diagrams
6. ✅ Analyze security posture
7. ✅ Understand project evolution
8. ✅ Produce actionable onboarding guide
9. ✅ Document full dependency tree with usage
10. ✅ Create persistent, updateable phase documents

---

## Error Handling

If any agent fails:
1. Note the failure in CODEBASE_GUIDE.md
2. Continue with remaining agents
3. Indicate missing analysis in final summary
4. Agents can be re-run independently later

---

## Update Strategy

Phase documents are persistent and can be updated:
- Re-run individual agents to refresh specific analyses
- Update CODEBASE_GUIDE.md to reference latest findings
- Maintain document timestamps for freshness tracking
