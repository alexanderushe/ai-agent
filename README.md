# AI Code Review Agent

An intelligent code review agent that analyzes git changes, provides detailed feedback, generates commit messages, and creates markdown reports.

## Features

✨ **Smart Code Review**: Comprehensive analysis of code changes with expert-level feedback
🤖 **Commit Message Generation**: Auto-generates conventional commit messages from staged changes  
📝 **Markdown Reports**: Saves detailed reviews as structured markdown files
🔧 **Git Integration**: Seamlessly works with your git workflow
🎯 **Extensible Tools**: Easy to add new review capabilities

## Quick Start

### Installation

```bash
bun install
```

### Basic Usage

Review code changes and generate a complete report:

```bash
bun run index.ts
```

This will:
1. Analyze all modified files in the specified directory
2. Provide detailed code review feedback
3. Generate a suggested commit message
4. Save the complete review to `code-review-report.md`

### Individual Tool Usage

Run specific tools independently:

```bash
# Test the tools with examples
bun run examples.ts
```

## Tools Available

### 1. Code Review Analysis
- Analyzes git diffs and provides expert feedback
- Focuses on correctness, maintainability, security, and performance
- Structured file-by-file reviews

### 2. Commit Message Generator
- Creates conventional commit messages (feat, fix, docs, etc.)
- Analyzes staged changes to suggest appropriate commit types
- Respects conventional commit standards and length limits

### 3. Markdown Report Writer  
- Saves reviews as structured markdown files
- Includes metadata, timestamps, and formatted sections
- Perfect for documentation and team sharing

## Advanced Usage

See `USAGE.md` for comprehensive documentation including:
- Detailed tool parameters and options
- Workflow integration examples
- Configuration options
- Troubleshooting guide

## Project Structure

```
├── index.ts          # Main agent with all tools integrated
├── tools.ts          # Individual tool implementations
├── prompts.ts        # AI system prompts and instructions
├── examples.ts       # Example usage of individual tools
├── USAGE.md          # Comprehensive usage guide
└── README.md         # This file
```

## Configuration

The agent can be customized by:
- Modifying `prompts.ts` for different review styles
- Updating `tools.ts` to change excluded files or behavior
- Adjusting the main prompt in `index.ts` for different focus areas

## Requirements

- [Bun](https://bun.com) runtime
- Git repository with changes to review
- Google AI API access (configured in the project)

This project was created using `bun init` and enhanced with AI-powered code review capabilities.
