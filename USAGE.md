# Code Review Agent Usage Guide

This enhanced Code Review Agent now includes powerful tools for commit message generation and markdown report writing, in addition to its core code review capabilities.

## Features

- **Smart Code Review**: Analyzes git diffs and provides detailed, constructive feedback
- **Commit Message Generation**: Creates conventional commit messages based on your changes
- **Markdown Reports**: Saves reviews to structured markdown files for documentation
- **Git Integration**: Works seamlessly with your git workflow

## Quick Start

### Basic Code Review

```bash
bun run index.ts
```

This will review changes in the specified directory and automatically:
1. Analyze all modified files
2. Generate detailed review feedback
3. Create a commit message suggestion
4. Save the complete review to a markdown file

### Advanced Usage

#### Custom Review with Specific Instructions

```typescript
await codeReviewAgent(
  "Review the changes in './src' directory focusing on security vulnerabilities and performance issues"
);
```

#### Generate Commit Message Only

```typescript
import { generateCommitMessageTool } from "./tools";

const result = await generateCommitMessageTool.execute({
  rootDir: "./my-project",
  type: "feat", // Optional: feat, fix, docs, style, refactor, test, chore
  maxLength: 72
});

console.log("Suggested commit:", result.message);
```

#### Save Review to Custom Location

```typescript
import { writeReviewToMarkdownTool } from "./tools";

await writeReviewToMarkdownTool.execute({
  content: "Your review content here...",
  filename: "sprint-review.md",
  outputDir: "./reviews",
  includeMetadata: true
});
```

## Tool Reference

### 1. getFileChangesInDirectoryTool

Analyzes git differences in a specified directory.

**Parameters:**
- `rootDir` (string): The directory to analyze

**Returns:**
- Array of file changes with diffs

**Example:**
```typescript
const changes = await getFileChangesInDirectoryTool.execute({
  rootDir: "./src"
});
```

### 2. generateCommitMessageTool

Creates conventional commit messages based on staged or unstaged changes.

**Parameters:**
- `rootDir` (string): Repository root directory
- `type` (optional): Commit type (feat, fix, docs, style, refactor, test, chore)
- `maxLength` (optional): Maximum message length (default: 72)

**Returns:**
- Generated commit message
- File change statistics
- Affected files list

**Auto-Detection Logic:**
- Documentation files (.md, README) → `docs:`
- Test files (.test., .spec.) → `test:`
- New files only → `feat:`
- Deletions only → `refactor:`
- Mixed changes → `fix:`

**Example:**
```typescript
const commitMsg = await generateCommitMessageTool.execute({
  rootDir: ".",
  maxLength: 50
});

// Use the generated message
console.log(`git commit -m "${commitMsg.message}"`);
```

### 3. writeReviewToMarkdownTool

Saves review content to a structured markdown file.

**Parameters:**
- `content` (string): The review content
- `filename` (optional): Output filename (default: "code-review.md")
- `outputDir` (optional): Output directory (default: ".")
- `includeMetadata` (optional): Add timestamp and headers (default: true)

**Returns:**
- Success status
- File path
- File size

**Example:**
```typescript
await writeReviewToMarkdownTool.execute({
  content: myReviewContent,
  filename: "feature-branch-review.md",
  outputDir: "./reviews",
  includeMetadata: true
});
```

## Workflow Examples

### Pre-Commit Workflow

1. Make your code changes
2. Stage files: `git add .`
3. Generate commit message: `bun run examples.ts` (uncomment commit message example)
4. Review and commit: `git commit -m "generated-message"`

### Code Review Workflow

1. Create a feature branch
2. Make changes and commits
3. Run comprehensive review: `bun run index.ts`
4. Address feedback from generated markdown report
5. Use for pull request descriptions

### Documentation Workflow

1. Review code changes regularly
2. Save reviews to dated markdown files
3. Build a knowledge base of review patterns
4. Share best practices with team

## Configuration

### Excluded Files

The agent automatically excludes these files from review:
- `dist/`
- `bun.lock`

To customize, edit the `excludeFiles` array in `tools.ts`:

```typescript
const excludeFiles = ["dist", "bun.lock", "node_modules", "*.log"];
```

### Custom Prompts

Modify `prompts.ts` to customize the AI's review style:

```typescript
export const SYSTEM_PROMPT = `
Your custom instructions here...
Focus on: performance, accessibility, etc.
`;
```

## Output Examples

### Generated Commit Message
```
feat: add commit message generation tool (+127/-5)
```

### Review Markdown Structure
```markdown
# Code Review Report

**Generated on:** 2024-01-15T10:30:00.000Z
**Review Agent:** AI Code Reviewer

---

## Files Reviewed
- tools.ts: Added commit generation logic
- index.ts: Integrated new tools

## Positive Observations
- Clean separation of concerns
- Proper error handling

## Areas for Improvement
- Consider adding unit tests
- Document new features

---

*This review was automatically generated by the AI Code Review Agent.*
```

## Tips and Best Practices

### For Better Commit Messages
- Stage only related changes together
- Use descriptive file names
- Avoid staging unrelated changes

### For Better Reviews
- Make focused, single-purpose commits
- Write meaningful variable names
- Include comments for complex logic

### For Team Usage
- Standardize on conventional commit types
- Set up pre-commit hooks
- Archive reviews in version control

## Troubleshooting

### "No changes detected"
- Ensure you're in a git repository
- Check if files are staged: `git status`
- Verify the correct directory path

### "Failed to write review file"
- Check directory permissions
- Ensure output directory exists
- Verify disk space

### Git errors
- Ensure git is installed and configured
- Check if you're in a valid git repository
- Verify repository permissions

## Integration

### With Pre-commit Hooks
```bash
#!/bin/sh
# .git/hooks/pre-commit
cd path/to/agent
bun run examples.ts
```

### With CI/CD
```yaml
# .github/workflows/review.yml
- name: Generate Code Review
  run: |
    cd code-review-agent
    bun run index.ts
    cat code-review.md >> $GITHUB_STEP_SUMMARY
```

### With VS Code
Create a task in `.vscode/tasks.json`:
```json
{
  "label": "Generate Code Review",
  "type": "shell",
  "command": "cd ../code-review-agent && bun run index.ts",
  "group": "build"
}
```

## Contributing

To extend the agent:
1. Add new tools to `tools.ts`
2. Update `prompts.ts` for tool descriptions
3. Register tools in `index.ts`
4. Add examples to `examples.ts`
5. Update this usage guide

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the examples in `examples.ts`
3. Examine the tool implementations in `tools.ts`
4. Test with simple cases first