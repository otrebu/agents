# Codebase Explorer Plugin

A comprehensive codebase exploration plugin for Claude Code that orchestrates multiple specialized analysis agents to create detailed documentation about any codebase.

## Overview

This plugin provides a systematic approach to understanding unfamiliar codebases through multi-agent analysis. It generates persistent, updateable documentation covering all critical aspects of a project.

## Features

### Multi-Agent Orchestration
- **7 specialized agents** working sequentially to analyze different aspects
- **Persistent documentation** that can be updated independently
- **Comprehensive coverage** from technology stack to git history

### Analysis Domains

1. **Discovery** (`discover-codebase`)
   - Technology stack identification
   - Project type detection
   - Configuration file analysis
   - Entry point discovery

2. **Architecture** (`analyze-architecture`)
   - Folder structure analysis
   - Design pattern identification
   - Component relationship mapping
   - Dependency analysis
   - Mermaid architecture diagrams

3. **Features** (`inventory-features`)
   - Feature catalog
   - User journey mapping
   - API endpoint inventory
   - Business logic identification
   - Sequence and flow diagrams

4. **Technical** (`analyze-technical`)
   - Testing strategy analysis
   - Error handling patterns
   - Logging implementation
   - Build process documentation
   - CI/CD pipeline review

5. **Security** (`analyze-security`)
   - Authentication/authorization analysis
   - Secret management review
   - Input validation patterns
   - Security vulnerability identification
   - Remediation recommendations

6. **History** (`analyze-history`)
   - Git history analysis
   - Feature evolution timeline
   - Contributor patterns
   - Major milestone identification
   - Development velocity insights

## Installation

### Via Marketplace
If you have access to the Uberto Claude Plugins marketplace:

```bash
# Add marketplace (if not already added)
claude plugin marketplace add <marketplace-url>

# Install plugin
claude plugin install codebase-explorer
```

### Manual Installation
Copy the plugin directory to your project's plugins folder or add it to your marketplace configuration.

## Usage

### Basic Usage
```bash
/explore-codebase
```

This command will:
1. Launch all 6 specialized analysis agents sequentially
2. Generate 6 detailed analysis documents
3. Create a consolidated CODEBASE_GUIDE.md with executive summary

### Output Files

After running `/explore-codebase`, you'll find these files in your project root:

- `01-DISCOVERY.md` - Technology stack and initial findings
- `02-ARCHITECTURE.md` - Architecture analysis with diagrams
- `03-FEATURES.md` - Feature catalog with flow diagrams
- `04-TECHNICAL.md` - Technical implementation details
- `SECURITY_ANALYSIS.md` - Security analysis and recommendations
- `HISTORY_ANALYSIS.md` - Git history and evolution
- `CODEBASE_GUIDE.md` - Executive summary (main entry point)

### Time Estimates

- **Small projects** (< 10k LOC): 5-10 minutes
- **Medium projects** (10k-50k LOC): 10-20 minutes
- **Large projects** (> 50k LOC): 20-40 minutes

## When to Use

- **First time exploring** a new codebase
- **Onboarding new team members**
- **Documentation audits**
- **Pre-refactoring assessment**
- **Security review preparation**
- **Architecture decision records**
- **Handoff documentation**

## Individual Agent Usage

You can also run individual agents to update specific analyses:

```bash
# Update just the architecture analysis
Task: Analyze codebase architecture
Agent: analyze-architecture
Prompt: Analyze the codebase architecture and update 02-ARCHITECTURE.md

# Update just the security analysis
Task: Analyze security posture
Agent: analyze-security
Prompt: Analyze security patterns and update SECURITY_ANALYSIS.md
```

## Documentation

Each analysis domain has a detailed HOW_TO guide in `docs/`:

- `HOW_TO_EXPLORE_CODEBASE.md` - Orchestration methodology
- `HOW_TO_DISCOVER_CODEBASE.md` - Discovery techniques
- `HOW_TO_ANALYZE_ARCHITECTURE.md` - Architecture analysis approach
- `HOW_TO_INVENTORY_FEATURES.md` - Feature cataloging methods
- `HOW_TO_ANALYZE_TECHNICAL.md` - Technical analysis guidelines
- `HOW_TO_ANALYZE_SECURITY.md` - Security analysis framework
- `HOW_TO_ANALYZE_HISTORY.md` - Git history analysis patterns

## Requirements

- Claude Code CLI
- Git repository (for history analysis)
- Read access to project files

## Plugin Structure

```
codebase-explorer/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   └── explore-codebase.md  # Main orchestrator command
├── agents/
│   ├── explore-codebase.md      # Orchestrator agent
│   ├── discover-codebase.md     # Discovery agent
│   ├── analyze-architecture.md  # Architecture agent
│   ├── analyze-technical.md     # Technical agent
│   ├── inventory-features.md    # Features agent
│   ├── analyze-security.md      # Security agent
│   └── analyze-history.md       # History agent
├── docs/
│   └── (7 HOW_TO guides)
└── README.md
```

## Version History

### 1.0.0 (2025-10-13)
- Initial plugin release
- 7 specialized agents
- Comprehensive documentation generation
- Multi-domain analysis coverage

## License

MIT

## Author

Uberto Rapizzi

## Contributing

This plugin is part of the Uberto Claude Plugins marketplace. Contributions and feedback welcome!
