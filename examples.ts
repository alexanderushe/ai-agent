import {
  generateCommitMessageTool,
  writeReviewToMarkdownTool,
  getFileChangesInDirectoryTool
} from "./tools";

// Example 1: Generate commit message for staged changes
async function exampleGenerateCommitMessage() {
  console.log("=== Generate Commit Message Example ===");

  const result = await generateCommitMessageTool.execute({
    rootDir: ".",
    type: "feat", // Optional: let AI determine if not specified
    maxLength: 72
  });

  console.log("Generated commit message:", result);
  console.log("");
}

// Example 2: Write a code review to markdown
async function exampleWriteReview() {
  console.log("=== Write Review to Markdown Example ===");

  const sampleReview = `
## Code Review Summary

### Files Reviewed
- \`tools.ts\` - Added new commit message generation functionality
- \`index.ts\` - Updated to include new tools

### Positive Observations
- **Good**: Clean separation of concerns with individual tool functions
- **Good**: Proper error handling in commit message generation
- **Good**: TypeScript schemas provide clear input validation

### Areas for Improvement

#### tools.ts
- **Consider**: Adding JSDoc comments for better IDE support
- **Suggestion**: The \`excludeFiles\` array could be configurable
- **Minor**: Consider using more descriptive variable names in the diff processing

#### index.ts
- **Good**: Tool integration is clean and follows established patterns
- **Suggestion**: Consider adding command-line argument parsing for different review modes

### Security Considerations
- File system operations are properly contained
- No user input validation issues identified

### Performance Notes
- Git operations are async and properly awaited
- File writing uses efficient Node.js APIs

### Overall Assessment
**Rating: 8/10** - Well-structured additions with good error handling. The commit message generation logic is particularly thoughtful in analyzing change patterns.

### Next Steps
1. Consider adding unit tests for the new tools
2. Document the new features in README.md
3. Add configuration file support for customizing behavior
  `;

  const result = await writeReviewToMarkdownTool.execute({
    content: sampleReview,
    filename: "example-review.md",
    outputDir: ".",
    includeMetadata: true
  });

  console.log("Review writing result:", result);
  console.log("");
}

// Example 3: Get file changes in directory
async function exampleGetFileChanges() {
  console.log("=== Get File Changes Example ===");

  const result = await getFileChangesInDirectoryTool.execute({
    rootDir: "."
  });

  console.log(`Found ${result.length} changed files:`);
  result.forEach((change, index) => {
    console.log(`${index + 1}. ${change.file}`);
    console.log(`   Diff preview: ${change.diff.slice(0, 100)}...`);
  });
  console.log("");
}

// Run all examples
async function runExamples() {
  try {
    await exampleGetFileChanges();
    await exampleGenerateCommitMessage();
    await exampleWriteReview();

    console.log("✅ All examples completed successfully!");
    console.log("\nTo run individual examples:");
    console.log("- Uncomment specific function calls below");
    console.log("- Or call them directly: await exampleGenerateCommitMessage()");

  } catch (error) {
    console.error("❌ Error running examples:", error);
  }
}

// Uncomment the line below to run examples
// await runExamples();

// Or run individual examples:
// await exampleGetFileChanges();
// await exampleGenerateCommitMessage();
// await exampleWriteReview();

console.log("🚀 Code Review Agent Examples");
console.log("Uncomment function calls above to test individual tools");
