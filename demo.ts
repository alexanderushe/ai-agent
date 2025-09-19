#!/usr/bin/env bun
/**
 * Demo script showcasing the enhanced Code Review Agent capabilities
 * This script demonstrates the complete workflow from code analysis to report generation
 */

import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import {
  getFileChangesInDirectoryTool,
  generateCommitMessageTool,
  writeReviewToMarkdownTool,
} from "./tools";

// Enhanced system prompt for demo
const DEMO_SYSTEM_PROMPT = `You are an expert code reviewer demonstrating advanced code review capabilities.

Your tools allow you to:
1. Analyze git changes in any directory
2. Generate conventional commit messages from staged/unstaged changes
3. Write comprehensive reviews to markdown files

When reviewing code, be thorough but concise. Focus on:
- Code quality and best practices
- Security considerations
- Performance implications
- Maintainability concerns

After your review, always:
1. Generate a commit message suggestion
2. Save the complete review to a markdown file

Be professional, constructive, and educational in your feedback.`;

async function runDemo() {
  console.log("🚀 AI Code Review Agent - Enhanced Demo");
  console.log("==========================================\n");

  // Step 1: Analyze current changes
  console.log("📋 Step 1: Analyzing code changes...");
  try {
    const changes = await getFileChangesInDirectoryTool.execute({
      rootDir: "."
    });

    if (changes.length === 0) {
      console.log("ℹ️  No unstaged changes found. Checking staged changes...");
    } else {
      console.log(`✅ Found ${changes.length} changed files to review`);
      changes.forEach((change, i) => {
        console.log(`   ${i + 1}. ${change.file}`);
      });
    }
  } catch (error) {
    console.log(`❌ Error analyzing changes: ${error}`);
  }

  console.log("");

  // Step 2: Generate commit message
  console.log("💬 Step 2: Generating commit message...");
  try {
    const commitResult = await generateCommitMessageTool.execute({
      rootDir: ".",
      maxLength: 72
    });

    console.log(`✅ Suggested commit: "${commitResult.message}"`);

    if (commitResult.stats) {
      const { totalFiles, totalInsertions, totalDeletions } = commitResult.stats;
      console.log(`📊 Changes: ${totalFiles} files (+${totalInsertions}/-${totalDeletions})`);
    }

    if (commitResult.suggestion) {
      console.log(`💡 ${commitResult.suggestion}`);
    }
  } catch (error) {
    console.log(`❌ Error generating commit message: ${error}`);
  }

  console.log("");

  // Step 3: Run AI Code Review
  console.log("🤖 Step 3: Running AI code review...");
  console.log("(The AI will analyze changes and generate a comprehensive review)\n");

  try {
    const result = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt: `Review all code changes in the current directory. Provide detailed feedback on each modified file.

      Focus on:
      - Code quality and structure
      - Potential bugs or issues
      - Security considerations
      - Performance implications
      - Best practices adherence

      After completing your review:
      1. Generate an appropriate commit message for these changes
      2. Save the complete review to a markdown file named 'demo-review-report.md'

      Make your review comprehensive but concise, suitable for both immediate feedback and documentation.`,
      system: DEMO_SYSTEM_PROMPT,
      tools: {
        getFileChangesInDirectoryTool,
        generateCommitMessageTool,
        writeReviewToMarkdownTool,
      },
      stopWhen: stepCountIs(15),
    });

    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }

    console.log("\n\n✅ AI code review completed!");

  } catch (error) {
    console.log(`❌ Error during AI review: ${error}`);
  }

  // Step 4: Summary
  console.log("\n" + "=".repeat(50));
  console.log("🎉 Demo Complete!");
  console.log("=".repeat(50));
  console.log("\nWhat happened:");
  console.log("1. ✅ Analyzed code changes in the repository");
  console.log("2. ✅ Generated a conventional commit message");
  console.log("3. ✅ AI provided comprehensive code review");
  console.log("4. ✅ Review saved to markdown file (if generated)");

  console.log("\nGenerated files to check:");
  console.log("📄 demo-review-report.md - Complete AI review");
  console.log("📄 test-review.md - Test tool output");

  console.log("\nNext steps:");
  console.log("• Review the generated markdown files");
  console.log("• Use suggested commit message: git commit -m \"[message]\"");
  console.log("• Integrate tools into your workflow");
  console.log("• Customize prompts in prompts.ts for your needs");

  console.log("\nFor more information:");
  console.log("📚 Read USAGE.md for comprehensive documentation");
  console.log("🔧 Check examples.ts for individual tool usage");
  console.log("⚙️  Modify tools.ts to customize behavior");
}

// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the demo
if (import.meta.main) {
  console.log("Starting enhanced Code Review Agent demo...\n");
  await runDemo();
}

export { runDemo };
