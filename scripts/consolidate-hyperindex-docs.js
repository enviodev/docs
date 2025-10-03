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

  // Remove HTML elements that cause parsing errors (but preserve code blocks)
  content = content.replace(/<(?!\/?(?:code|pre))[^>]*>/g, "");

  // Remove any remaining image references
  content = content.replace(/image\.png/g, "");
  content = content.replace(/image\.jpg/g, "");
  content = content.replace(/image\.jpeg/g, "");
  content = content.replace(/image\.gif/g, "");
  content = content.replace(/image\.webp/g, "");

  return content;
}

// Function to parse sidebar configuration and extract file order
function parseSidebarOrder(sidebarPath) {
  try {
    // Read the sidebar file
    const sidebarContent = fs.readFileSync(sidebarPath, "utf8");

    // Extract the sidebar configuration by evaluating it
    // We need to handle the require statement for supported networks
    const supportedNetworksPath = path.join(
      __dirname,
      "../supported-networks.json"
    );
    const supportedNetworks = JSON.parse(
      fs.readFileSync(supportedNetworksPath, "utf8")
    );

    // Create a mock environment for the sidebar evaluation
    const mockRequire = (modulePath) => {
      if (modulePath === "./supported-networks.json") {
        return supportedNetworks;
      }
      throw new Error(`Unexpected require: ${modulePath}`);
    };

    // Evaluate the sidebar configuration
    const sidebarConfig = eval(`(function() {
      const require = arguments[0];
      const process = { env: { DOCS_FOR_LLM: "true" } };
      ${sidebarContent}
      return module.exports;
    })`)(mockRequire);

    return extractFileOrderFromSidebar(sidebarConfig.someSidebar);
  } catch (error) {
    console.error(`Error parsing sidebar ${sidebarPath}:`, error.message);
    return [];
  }
}

// Function to extract file order from sidebar items
function extractFileOrderFromSidebar(items) {
  const fileOrder = [];

  for (const item of items) {
    if (typeof item === "string") {
      // Direct file reference - try both .md and .mdx extensions
      fileOrder.push(item);
    } else if (item.type === "category" && item.items) {
      // Category with items
      for (const subItem of item.items) {
        if (typeof subItem === "string") {
          fileOrder.push(subItem);
        }
        // Handle nested categories if needed
      }
    }
    // Skip other types like "link"
  }

  return fileOrder;
}

// Function to parse HyperSync sidebar configuration
function parseHyperSyncSidebarOrder(sidebarPath) {
  try {
    const sidebarContent = fs.readFileSync(sidebarPath, "utf8");
    const sidebarConfig = eval(`(function() {
      ${sidebarContent}
      return module.exports;
    })`)();

    return extractFileOrderFromSidebar(sidebarConfig.someSidebar);
  } catch (error) {
    console.error(
      `Error parsing HyperSync sidebar ${sidebarPath}:`,
      error.message
    );
    return [];
  }
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

  // Get file order from sidebar configuration
  const sidebarPath = path.join(__dirname, "../sidebarsHyperIndex.js");
  const fileOrder = parseSidebarOrder(sidebarPath);

  if (fileOrder.length === 0) {
    console.error(
      "Failed to parse sidebar order, falling back to alphabetical order"
    );
    const markdownFiles = findMarkdownFiles(hyperIndexDir);
    const fallbackOrder = markdownFiles.map((file) =>
      path.relative(hyperIndexDir, file)
    );
    return processFilesInOrder(hyperIndexDir, fallbackOrder, outputFile);
  }

  console.log(
    `Processing HyperIndex documentation in logical order from sidebar...`
  );
  return processFilesInOrder(hyperIndexDir, fileOrder, outputFile);
}

// Function to process files in a given order
function processFilesInOrder(sourceDir, fileOrder, outputFile) {
  // Determine if this is HyperIndex, HyperSync, or HyperRPC based on the source directory
  const isHyperIndex = sourceDir.includes("HyperIndex");
  const isHyperSync = sourceDir.includes("HyperSync");
  const isHyperRPC = sourceDir.includes("HyperRPC");

  let consolidatedContent = `---
id: ${isHyperIndex ? "hyperindex-complete" : isHyperSync ? "hypersync-complete" : "hyperrpc-complete"}
title: ${
    isHyperIndex
      ? "HyperIndex Complete Documentation"
      : isHyperSync
      ? "HyperSync Complete Documentation"
      : "HyperRPC Complete Documentation"
  }
sidebar_label: ${
    isHyperIndex
      ? "HyperIndex Complete Documentation"
      : isHyperSync
      ? "HyperSync Complete Documentation"
      : "HyperRPC Complete Documentation"
  }
slug: /${isHyperIndex ? "hyperindex-complete" : isHyperSync ? "hypersync-complete" : "hyperrpc-complete"}
---

# ${
    isHyperIndex
      ? "HyperIndex Complete Documentation"
      : isHyperSync
      ? "HyperSync Complete Documentation"
      : "HyperRPC Complete Documentation"
  }

This document contains all ${
    isHyperIndex ? "HyperIndex" : isHyperSync ? "HyperSync" : "HyperRPC"
  } documentation consolidated into a single file for LLM consumption.

---

`;

  // Process files in the defined order
  for (const fileName of fileOrder) {
    // Try different file extensions
    const possibleExtensions = [".md", ".mdx"];
    let filePath = null;
    let actualFileName = null;

    for (const ext of possibleExtensions) {
      const testPath = path.join(sourceDir, fileName + ext);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        actualFileName = fileName + ext;
        break;
      }
    }

    if (filePath) {
      console.log(`Processing: ${actualFileName}`);

      const content = readMarkdownFile(filePath);
      if (content) {
        const { title, body } = processMarkdownContent(content, filePath);

        // Fix internal links
        const fixedBody = fixInternalLinks(body, actualFileName);

        consolidatedContent += `## ${title}

**File:** \`${actualFileName}\`

${fixedBody}

---

`;
      }
    } else {
      console.warn(
        `Warning: File not found: ${fileName} (tried .md and .mdx extensions)`
      );
    }
  }

  // Handle supported networks separately (they're in a category) - only for HyperIndex
  if (isHyperIndex) {
    const supportedNetworksDir = path.join(sourceDir, "supported-networks");
    if (fs.existsSync(supportedNetworksDir)) {
      const networkFiles = findMarkdownFiles(supportedNetworksDir);

      // Limit to only the first 5 supported network files for HyperIndex complete docs
      const limitedNetworkFiles = networkFiles.slice(0, 5);

      console.log(
        `Processing ${limitedNetworkFiles.length} supported network files (limited from ${networkFiles.length} total)`
      );

      for (const networkFile of limitedNetworkFiles) {
        const relativePath = path.relative(sourceDir, networkFile);
        console.log(`Processing: ${relativePath}`);

        const content = readMarkdownFile(networkFile);
        if (content) {
          const { title, body } = processMarkdownContent(content, networkFile);

          // Fix internal links
          const fixedBody = fixInternalLinks(body, relativePath);

          consolidatedContent += `## ${title}

**File:** \`${relativePath}\`

${fixedBody}

---

`;
        }
      }
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

  // Get file order from sidebar configuration
  const sidebarPath = path.join(__dirname, "../sidebarsHyperSync.js");
  const fileOrder = parseHyperSyncSidebarOrder(sidebarPath);

  if (fileOrder.length === 0) {
    console.error(
      "Failed to parse HyperSync sidebar order, falling back to alphabetical order"
    );
    const markdownFiles = findMarkdownFiles(hyperSyncDir);
    const fallbackOrder = markdownFiles.map((file) =>
      path.relative(hyperSyncDir, file)
    );
    return processFilesInOrder(hyperSyncDir, fallbackOrder, outputFile);
  }

  console.log(
    `Processing HyperSync documentation in logical order from sidebar...`
  );
  return processFilesInOrder(hyperSyncDir, fileOrder, outputFile);
}

// Function to consolidate all HyperRPC docs
function consolidateHyperRPCDocs() {
  const hyperRPCDir = path.join(__dirname, "../docs/HyperRPC");
  const outputFile = path.join(
    __dirname,
    "../docs/HyperRPC-LLM/hyperrpc-complete.mdx"
  );

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get file order from sidebar configuration
  const sidebarPath = path.join(__dirname, "../sidebarsHyperRPC.js");
  const fileOrder = parseHyperSyncSidebarOrder(sidebarPath); // Reuse HyperSync parser since HyperRPC has simple sidebar

  if (fileOrder.length === 0) {
    console.error(
      "Failed to parse HyperRPC sidebar order, falling back to alphabetical order"
    );
    const markdownFiles = findMarkdownFiles(hyperRPCDir);
    const fallbackOrder = markdownFiles.map((file) =>
      path.relative(hyperRPCDir, file)
    );
    return processFilesInOrder(hyperRPCDir, fallbackOrder, outputFile);
  }

  console.log(
    `Processing HyperRPC documentation in logical order from sidebar...`
  );
  return processFilesInOrder(hyperRPCDir, fileOrder, outputFile);
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

  if (args.includes("--hyperrpc")) {
    console.log("Consolidating HyperRPC documentation...");
    consolidateHyperRPCDocs();
  }

  if (args.includes("--all")) {
    console.log("Consolidating all documentation...");
    consolidateHyperIndexDocs();
    consolidateHyperSyncDocs();
    consolidateHyperRPCDocs();
  }
}

module.exports = {
  consolidateHyperIndexDocs,
  consolidateHyperSyncDocs,
  consolidateHyperRPCDocs,
};
