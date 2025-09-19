#!/usr/bin/env bun
import {
  generateCommitMessageTool,
  writeReviewToMarkdownTool,
  getFileChangesInDirectoryTool
} from "./tools";

async function testTools() {
  console.log("🧪 Testing Code Review Agent Tools\n");

  // Test 1: Get file changes
  console.log("1️⃣ Testing getFileChangesInDirectoryTool...");
  try {
    const changes = await getFileChangesInDirectoryTool.execute({
      rootDir: "."
    });
    console.log(`✅ Found ${changes.length} changed files`);
    changes.slice(0, 3).forEach(change => {
      console.log(`   📄 ${change.file} (${change.diff.split('\n').length} lines)`);
    });
  } catch (error) {
    console.log(`❌ Error: ${error}`);
  }
  console.log("");

  // Test 2: Generate commit message
  console.log("2️⃣ Testing generateCommitMessageTool...");
  try {
    const commitResult = await generateCommitMessageTool.execute({
      rootDir: ".",
      maxLength: 72
    });
    console.log(`✅ Generated commit message: "${commitResult.message}"`);
    if (commitResult.stats) {
      console.log(`   📊 Stats: ${commitResult.stats.totalFiles} files, +${commitResult.stats.totalInsertions}/-${commitResult.stats.totalDeletions}`);
    }
    if (commitResult.suggestion) {
      console.log(`   💡 Suggestion: ${commitResult.suggestion}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error}`);
  }
  console.log("");

  // Test 3: Write review to markdown
  console.log("3️⃣ Testing writeReviewToMarkdownTool...");
  try {
    const sampleReview = `## Test Review

### Summary
This is a test review to verify the markdown writing functionality.

### Files Tested
- \`test-tools.ts\` - New test script for tool verification
- \`tools.ts\` - Enhanced with commit message generation
- \`index.ts\` - Updated with new tool integrations

### Test Results
- ✅ All tools are properly integrated
- ✅ Error handling is working
- ✅ TypeScript types are correct

### Recommendations
1. Continue with comprehensive testing
2. Add unit tests for individual functions
3. Document the new capabilities

**Overall Assessment**: Tools are working correctly and ready for use.`;

    const writeResult = await writeReviewToMarkdownTool.execute({
      content: sampleReview,
      filename: "test-review.md",
      outputDir: ".",
      includeMetadata: true
    });

    if (writeResult.success) {
      console.log(`✅ Review written to: ${writeResult.path}`);
      console.log(`   📏 File size: ${writeResult.size} characters`);
    } else {
      console.log(`❌ Failed to write review: ${writeResult.message}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error}`);
  }
  console.log("");

  console.log("🎉 Tool testing complete!");
  console.log("\n💡 Next steps:");
  console.log("   • Run: bun run index.ts (for full AI code review)");
  console.log("   • Check: test-review.md (generated test report)");
  console.log("   • Read: USAGE.md (comprehensive documentation)");
}

// Run the tests
await testTools();
