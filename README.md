# 🤖 AI Code Review Agent

An intelligent, extensible code review agent powered by Google's Gemini AI that analyzes git changes, provides expert-level feedback, generates conventional commit messages, and creates comprehensive markdown reports.

## 🌟 Features

- **🔍 Smart Code Analysis**: Deep analysis of git diffs with expert-level feedback on correctness, security, performance, and maintainability
- **💬 Commit Message Generation**: Auto-generates conventional commit messages following best practices
- **📝 Markdown Reports**: Creates structured, professional review reports for documentation and team sharing  
- **🔧 Git Integration**: Seamlessly works with your existing git workflow
- **⚡ Bun-Powered**: Built with Bun for fast execution and modern JavaScript features
- **🎯 Extensible**: Easy to add new tools and customize review behavior
- **🧠 AI-Driven**: Powered by Google Gemini 2.0 for intelligent, context-aware reviews

## 🛠 Technology Stack

- **Runtime**: [Bun](https://bun.com) - Fast all-in-one JavaScript runtime
- **AI Model**: Google Gemini 2.0 Flash Experimental via `@ai-sdk/google`
- **Git Integration**: `simple-git` for repository analysis
- **Type Safety**: TypeScript with Zod for schema validation
- **AI Framework**: Vercel AI SDK for structured AI interactions

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.com) installed on your system
- Git repository with changes to review
- Google AI API access (Gemini models)

### Installation

```bash
# Clone or navigate to the project
cd my-agent

# Install dependencies
bun install
```

### Environment Setup

Ensure you have Google AI API access configured. The agent uses Google Gemini models through the AI SDK.

### Basic Usage

```bash
# Run complete code review with all features
bun run index.ts

# Test individual tools
bun run test-tools.ts

# Run comprehensive demo
bun run demo.ts

# Try examples
bun run examples.ts
```

## 🔧 Core Tools

### 1. 📊 File Changes Analyzer
```typescript
getFileChangesInDirectoryTool.execute({
  rootDir: "./src"
})
```
- Analyzes git diffs in specified directories
- Filters out excluded files (dist, node_modules, etc.)
- Returns structured change data for AI analysis

### 2. 💬 Commit Message Generator
```typescript
generateCommitMessageTool.execute({
  rootDir: ".",
  type: "feat", // Optional: auto-detected if not specified
  maxLength: 72
})
```
- **Auto-Detection**: Intelligently determines commit types based on changes
  - `docs:` for documentation files (.md, README)
  - `test:` for test files (.test., .spec.)
  - `feat:` for new files/features
  - `fix:` for modifications
  - `refactor:` for deletions
- **Conventional Commits**: Follows standard commit message format
- **Smart Stats**: Includes change statistics (+additions/-deletions)
- **Length Control**: Respects maximum message length limits

### 3. 📝 Markdown Report Writer
```typescript
writeReviewToMarkdownTool.execute({
  content: reviewContent,
  filename: "code-review-report.md",
  outputDir: "./reviews",
  includeMetadata: true
})
```
- **Professional Format**: Structured markdown with headers and metadata
- **Timestamp Integration**: Automatic timestamps and review tracking
- **Flexible Output**: Configurable filenames and directories
- **Team Sharing**: Perfect for pull request documentation

## 🎯 Usage Patterns

### Individual Developer Workflow
```bash
# Make changes
git add .

# Generate review and commit message
bun run index.ts

# Use suggested commit message
git commit -m "feat: add new authentication module (+127/-15)"
```

### Team Code Review Process
1. **Pre-PR Review**: Run agent on feature branch
2. **Documentation**: Save reviews as markdown files
3. **Commit Standards**: Use generated conventional commit messages
4. **Knowledge Sharing**: Archive reviews for team learning

### CI/CD Integration
```yaml
# .github/workflows/code-review.yml
- name: AI Code Review
  run: |
    cd code-review-agent
    bun run index.ts
    cat code-review-report.md >> $GITHUB_STEP_SUMMARY
```

## 📋 Example Output

### Generated Commit Message
```
feat: add commit message generation and markdown export tools (+284/-12)
```

### Review Report Structure
```markdown
# Code Review Report

**Generated on:** 2024-01-15T10:30:00.000Z
**Review Agent:** AI Code Reviewer

---

## Files Reviewed
- `tools.ts`: Added commit generation and markdown export functionality
- `index.ts`: Integrated new tools into main agent workflow

## Positive Observations
- ✅ Clean separation of concerns with individual tool functions
- ✅ Proper TypeScript typing with Zod schemas
- ✅ Comprehensive error handling throughout

## Areas for Improvement
- 🔍 Consider adding JSDoc comments for better IDE support
- 📝 The excludeFiles array could be made configurable
- 🧪 Add unit tests for the new tool functions

## Security Considerations
- ✅ File system operations are properly contained
- ✅ No user input validation issues identified

---

*This review was automatically generated by the AI Code Review Agent.*
```

## ⚙️ Configuration

### Customizing Review Focus
Edit `prompts.ts` to adjust the AI's review priorities:
```typescript
export const SYSTEM_PROMPT = `
Focus areas: security, performance, accessibility
Review style: strict, educational, concise
Team standards: React hooks, functional programming
`;
```

### Excluded Files
Modify `tools.ts` to customize which files are ignored:
```typescript
const excludeFiles = ["dist", "bun.lock", "node_modules", "*.log"];
```

### Custom Tool Integration
Add new tools by:
1. Creating tool functions in `tools.ts`
2. Registering in `index.ts` tools object
3. Updating system prompts with tool descriptions

## 📁 Project Structure

```
my-agent/
├── 📜 index.ts              # Main agent with integrated workflow
├── 🔧 tools.ts              # Individual tool implementations
├── 🎯 prompts.ts            # AI system prompts and instructions
├── 📋 examples.ts           # Usage examples for each tool
├── 🧪 test-tools.ts         # Tool verification and testing
├── 🚀 demo.ts               # Complete workflow demonstration
├── 📚 USAGE.md              # Comprehensive usage documentation
├── 📦 package.json          # Dependencies and scripts
└── 📖 README.md             # This file
```

## 🤝 Contributing

### Adding New Tools
1. **Implement**: Add tool functions to `tools.ts`
2. **Integrate**: Register in `index.ts` tools object
3. **Document**: Update prompts and add examples
4. **Test**: Create test cases in `test-tools.ts`

### Customizing AI Behavior
- Modify `prompts.ts` for different review styles
- Adjust model parameters in `index.ts`
- Add domain-specific knowledge to system prompts

## 🐛 Troubleshooting

### "No changes detected"
- Ensure you're in a git repository: `git status`
- Check for staged/unstaged changes
- Verify correct directory path

### "Failed to write review file"  
- Check directory permissions
- Ensure output directory exists
- Verify available disk space

### Git integration issues
- Confirm git is installed and configured
- Verify repository is properly initialized
- Check file permissions

## 📈 Advanced Features

### Pre-commit Integration
```bash
#!/bin/sh
# .git/hooks/pre-commit
cd path/to/agent
bun run index.ts --silent
```

### VS Code Integration
```json
{
  "label": "AI Code Review",
  "type": "shell", 
  "command": "bun run index.ts",
  "group": "build",
  "presentation": {
    "echo": true,
    "reveal": "always"
  }
}
```

## 🎯 Roadmap

- [ ] **Unit Testing**: Comprehensive test suite for all tools
- [ ] **Configuration Files**: Support for `.reviewrc` config files
- [ ] **Multiple AI Models**: Support for OpenAI, Claude, and local models
- [ ] **Plugin System**: Easy third-party tool integration
- [ ] **Web Interface**: Optional web UI for team usage
- [ ] **Metrics Dashboard**: Code quality trends and analytics

## 📄 License

This project is available for use under standard software licensing terms. Built with modern web technologies for the developer community.

## 🙋‍♂️ Support

For questions, issues, or contributions:
- 📖 Check the comprehensive `USAGE.md` guide
- 🧪 Run `test-tools.ts` to verify functionality
- 🔍 Examine tool implementations in `tools.ts`
- 🚀 Try the `demo.ts` for complete workflow examples

---

**Built with ❤️ using Bun, TypeScript, and AI technology**