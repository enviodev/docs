const fs = require("fs");
const path = require("path");

// Function to read a markdown file and extract its content
function readMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Function to process markdown content and extract title and body
function processMarkdownContent(content, filePath) {
  const lines = content.split("\n");
  let title = "";
  let body = "";
  let inFrontMatter = false;
  let frontMatterEnded = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip front matter
    if (line.startsWith("---")) {
      if (!inFrontMatter) {
        inFrontMatter = true;
      } else {
        inFrontMatter = false;
        frontMatterEnded = true;
      }
      continue;
    }

    if (inFrontMatter) {
      continue;
    }

    // Extract title from first heading
    if (!title && line.startsWith("# ")) {
      title = line.replace("# ", "").trim();
      continue;
    }

    // If no title found, use filename
    if (!title && frontMatterEnded && line.trim()) {
      title = path
        .basename(filePath, path.extname(filePath))
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    body += line + "\n";
  }

  return { title, body: body.trim() };
}

// Function to recursively find all markdown files
function findMarkdownFiles(dir) {
  const files = [];

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item.endsWith(".md") || item.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files.sort();
}

// Function to fix internal links in the content
function fixInternalLinks(content, relativePath) {
  // Remove all markdown links that reference other files
  content = content.replace(/\[([^\]]+)\]\([^)]+\.md\)/g, "$1");
  content = content.replace(/\[([^\]]+)\]\([^)]+\.mdx\)/g, "$1");
  content = content.replace(/\[([^\]]+)\]\(\/[^)]+\)/g, "$1");
  content = content.replace(/\[([^\]]+)\]\(\/\.\/[^)]+\)/g, "$1");
  content = content.replace(/\[([^\]]+)\]\(\/\.\.\/[^)]+\)/g, "$1");
  content = content.replace(/\[([^\]]+)\]\(\/docs\/[^)]+\)/g, "$1");
  content = content.replace(/\[([^\]]+)\]\(\/docs\/HyperIndex\/[^)]+\)/g, "$1");
  content = content.replace(/\[([^\]]+)\]\(\/docs\/HyperSync\/[^)]+\)/g, "$1");

  // Remove any remaining markdown links
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove image references that cause errors - be more aggressive
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  content = content.replace(/!\[([^\]]*)\]\([^)]+\.png\)/g, "");
  content = content.replace(/!\[([^\]]*)\]\([^)]+\.jpg\)/g, "");
  content = content.replace(/!\[([^\]]*)\]\([^)]+\.jpeg\)/g, "");
  content = content.replace(/!\[([^\]]*)\]\([^)]+\.gif\)/g, "");
  content = content.replace(/!\[([^\]]*)\]\([^)]+\.webp\)/g, "");

  // Remove MDX imports that cause parsing errors
  content = content.replace(/^import\s+.*\s+from\s+["'][^"']+["'];?\s*$/gm, "");

  // Remove CSS imports
  content = content.replace(/^import\s+["'][^"']*\.css["'];?\s*$/gm, "");

  // Remove HTML elements that cause parsing errors
  content = content.replace(/<[^>]*>/g, "");

  // Remove any remaining problematic syntax
  content = content.replace(/```[^`]*```/g, "");

  // Remove any remaining code blocks that might cause issues
  content = content.replace(/```[\s\S]*?```/g, "");

  // Remove any remaining image references
  content = content.replace(/image\.png/g, "");
  content = content.replace(/image\.jpg/g, "");
  content = content.replace(/image\.jpeg/g, "");
  content = content.replace(/image\.gif/g, "");
  content = content.replace(/image\.webp/g, "");

  return content;
}

// Function to consolidate all HyperIndex docs
function consolidateHyperIndexDocs() {
  const hyperIndexDir = path.join(__dirname, "../docs/HyperIndex");
  const outputFile = path.join(
    __dirname,
    "../docs/HyperIndex-LLM/hyperindex-complete.mdx"
  );

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find all markdown files
  const markdownFiles = findMarkdownFiles(hyperIndexDir);

  console.log(`Found ${markdownFiles.length} markdown files to consolidate`);

  let consolidatedContent = `---
id: hyperindex-complete
title: HyperIndex Complete Documentation
sidebar_label: HyperIndex Complete Documentation
slug: /hyperindex-complete
---

# HyperIndex Complete Documentation

This document contains all HyperIndex documentation consolidated into a single file for LLM consumption.

---

`;

  // Process each file
  for (const filePath of markdownFiles) {
    const relativePath = path.relative(hyperIndexDir, filePath);
    console.log(`Processing: ${relativePath}`);

    const content = readMarkdownFile(filePath);
    if (content) {
      const { title, body } = processMarkdownContent(content, filePath);

      // Fix internal links
      const fixedBody = fixInternalLinks(body, relativePath);

      consolidatedContent += `## ${title}

**File:** \`${relativePath}\`

${fixedBody}

---

`;
    }
  }

  // Write the consolidated file
  fs.writeFileSync(outputFile, consolidatedContent);
  console.log(`Consolidated documentation written to: ${outputFile}`);
}

// Function to consolidate all HyperSync docs
function consolidateHyperSyncDocs() {
  const hyperSyncDir = path.join(__dirname, "../docs/HyperSync");
  const outputFile = path.join(
    __dirname,
    "../docs/HyperSync-LLM/hypersync-complete.mdx"
  );

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find all markdown files
  const markdownFiles = findMarkdownFiles(hyperSyncDir);

  console.log(`Found ${markdownFiles.length} markdown files to consolidate`);

  let consolidatedContent = `---
id: hypersync-complete
title: HyperSync Complete Documentation
sidebar_label: HyperSync Complete Documentation
slug: /hypersync-complete
---

# HyperSync Complete Documentation

This document contains all HyperSync documentation consolidated into a single file for LLM consumption.

---

`;

  // Process each file
  for (const filePath of markdownFiles) {
    const relativePath = path.relative(hyperSyncDir, filePath);
    console.log(`Processing: ${relativePath}`);

    const content = readMarkdownFile(filePath);
    if (content) {
      const { title, body } = processMarkdownContent(content, filePath);

      // Fix internal links
      const fixedBody = fixInternalLinks(body, relativePath);

      consolidatedContent += `## ${title}

**File:** \`${relativePath}\`

${fixedBody}

---

`;
    }
  }

  // Write the consolidated file
  fs.writeFileSync(outputFile, consolidatedContent);
  console.log(`Consolidated documentation written to: ${outputFile}`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--hyperindex") || args.length === 0) {
    console.log("Consolidating HyperIndex documentation...");
    consolidateHyperIndexDocs();
  }

  if (args.includes("--hypersync")) {
    console.log("Consolidating HyperSync documentation...");
    consolidateHyperSyncDocs();
  }

  if (args.includes("--all")) {
    console.log("Consolidating all documentation...");
    consolidateHyperIndexDocs();
    consolidateHyperSyncDocs();
  }
}

module.exports = {
  consolidateHyperIndexDocs,
  consolidateHyperSyncDocs,
};
