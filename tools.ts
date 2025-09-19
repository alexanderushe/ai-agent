import { tool } from "ai";
import { simpleGit } from "simple-git";
import { z } from "zod";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const excludeFiles = ["dist", "bun.lock"];

const fileChange = z.object({
  rootDir: z.string().min(1).describe("The root directory"),
});

type FileChange = z.infer<typeof fileChange>;

async function getFileChangesInDirectory({ rootDir }: FileChange) {
  const git = simpleGit(rootDir);
  const summary = await git.diffSummary();
  const diffs: { file: string; diff: string }[] = [];

  for (const file of summary.files) {
    if (excludeFiles.includes(file.file)) continue;
    const diff = await git.diff(["--", file.file]);
    diffs.push({ file: file.file, diff });
  }

  return diffs;
}

export const getFileChangesInDirectoryTool = tool({
  description: "Gets the code changes made in given directory",
  inputSchema: fileChange,
  execute: getFileChangesInDirectory,
});

const commitMessageSchema = z.object({
  rootDir: z.string().min(1).describe("The root directory"),
  type: z
    .enum(["feat", "fix", "docs", "style", "refactor", "test", "chore"])
    .optional()
    .describe("The type of commit (conventional commits)"),
  maxLength: z
    .number()
    .default(72)
    .describe("Maximum length of the commit message"),
});

type CommitMessageInput = z.infer<typeof commitMessageSchema>;

async function generateCommitMessage({
  rootDir,
  type,
  maxLength,
}: CommitMessageInput) {
  const git = simpleGit(rootDir);

  try {
    // Get staged changes
    const stagedSummary = await git.diffSummary(["--cached"]);

    if (stagedSummary.files.length === 0) {
      // If no staged changes, get unstaged changes
      const summary = await git.diffSummary();
      if (summary.files.length === 0) {
        return { message: "No changes detected", files: [] };
      }

      // Analyze unstaged changes
      const changedFiles = summary.files.map((f) => ({
        file: f.file,
        insertions: f.insertions,
        deletions: f.deletions,
        changes: f.changes,
      }));

      return {
        message: `Suggest staging changes first. Found ${summary.files.length} modified files`,
        files: changedFiles,
        suggestion:
          "Use 'git add .' to stage all changes or 'git add <specific-files>' to stage specific files",
      };
    }

    // Analyze staged changes
    const changedFiles = stagedSummary.files.map((f) => ({
      file: f.file,
      insertions: f.insertions,
      deletions: f.deletions,
      changes: f.changes,
    }));

    // Generate commit message based on changes
    let message = "";
    const totalFiles = stagedSummary.files.length;
    const totalInsertions = stagedSummary.insertions;
    const totalDeletions = stagedSummary.deletions;

    // Determine commit type if not provided
    let commitType = type;
    if (!commitType) {
      const hasNewFiles = stagedSummary.files.some(
        (f) => f.insertions > 0 && f.deletions === 0,
      );
      const hasOnlyDeletions = stagedSummary.files.every(
        (f) => f.deletions > 0 && f.insertions === 0,
      );
      const hasTestFiles = stagedSummary.files.some(
        (f) => f.file.includes(".test.") || f.file.includes("spec."),
      );
      const hasDocFiles = stagedSummary.files.some(
        (f) => f.file.endsWith(".md") || f.file.includes("README"),
      );

      if (hasDocFiles && totalFiles === 1) {
        commitType = "docs";
      } else if (hasTestFiles) {
        commitType = "test";
      } else if (hasNewFiles) {
        commitType = "feat";
      } else if (hasOnlyDeletions) {
        commitType = "refactor";
      } else {
        commitType = "fix";
      }
    }

    // Create descriptive message
    if (totalFiles === 1) {
      const file = stagedSummary.files[0];
      const fileName = file.file.split("/").pop() || file.file;
      message = `${commitType}: update ${fileName}`;
    } else {
      message = `${commitType}: update ${totalFiles} files`;
    }

    // Add details if message is short enough
    if (message.length < maxLength - 20) {
      if (totalInsertions > 0 && totalDeletions > 0) {
        message += ` (+${totalInsertions}/-${totalDeletions})`;
      } else if (totalInsertions > 0) {
        message += ` (+${totalInsertions})`;
      } else if (totalDeletions > 0) {
        message += ` (-${totalDeletions})`;
      }
    }

    // Ensure message doesn't exceed max length
    if (message.length > maxLength) {
      message = message.substring(0, maxLength - 3) + "...";
    }

    return {
      message,
      files: changedFiles,
      stats: {
        totalFiles,
        totalInsertions,
        totalDeletions,
      },
    };
  } catch (error) {
    return {
      message: "Error generating commit message",
      error: error instanceof Error ? error.message : "Unknown error",
      files: [],
    };
  }
}

export const generateCommitMessageTool = tool({
  description:
    "Generates a conventional commit message based on staged or unstaged changes in the repository",
  inputSchema: commitMessageSchema,
  execute: generateCommitMessage,
});

const writeReviewSchema = z.object({
  content: z.string().describe("The review content to write"),
  filename: z
    .string()
    .default("code-review.md")
    .describe("The filename for the review"),
  outputDir: z
    .string()
    .default(".")
    .describe("The directory to write the review file to"),
  includeMetadata: z
    .boolean()
    .default(true)
    .describe("Whether to include metadata like timestamp and summary"),
});

type WriteReviewInput = z.infer<typeof writeReviewSchema>;

async function writeReviewToMarkdown({
  content,
  filename,
  outputDir,
  includeMetadata,
}: WriteReviewInput) {
  try {
    const timestamp = new Date().toISOString();
    const outputPath = join(outputDir, filename);

    let reviewContent = "";

    if (includeMetadata) {
      reviewContent += `# Code Review Report\n\n`;
      reviewContent += `**Generated on:** ${timestamp}\n`;
      reviewContent += `**Review Agent:** AI Code Reviewer\n\n`;
      reviewContent += `---\n\n`;
    }

    reviewContent += content;

    if (includeMetadata) {
      reviewContent += `\n\n---\n\n`;
      reviewContent += `*This review was automatically generated by the AI Code Review Agent.*\n`;
    }

    await writeFile(outputPath, reviewContent, "utf-8");

    return {
      success: true,
      message: `Review written to ${outputPath}`,
      path: outputPath,
      size: reviewContent.length,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to write review file",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const writeReviewToMarkdownTool = tool({
  description:
    "Writes code review content to a markdown file with optional metadata",
  inputSchema: writeReviewSchema,
  execute: writeReviewToMarkdown,
});
