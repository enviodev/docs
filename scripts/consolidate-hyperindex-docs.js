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

  // Define the logical order based on the HyperIndex sidebar structure
  const fileOrder = [
    "overview.md",
    "getting-started.md",
    "contract-import.md",
    "benchmarks.md",
    "migration-guide.md",
    // Guides category
    "Guides/configuration-file.mdx",
    "Guides/schema-file.md",
    "Guides/event-handlers.mdx",
    "Advanced/multichain-indexing.mdx",
    "Guides/testing.mdx",
    "Guides/navigating-hasura.md",
    "Guides/environment-variables.md",
    // Examples category
    "Examples/example-uniswap-v4.md",
    "Examples/example-sablier.md",
    "Examples/example-aerodrome-velodrome.md",
    // Hosting category
    "Hosted_Service/hosted-service.md",
    "Hosted_Service/hosted-service-deployment.md",
    "Hosted_Service/hosted-service-billing.mdx",
    "Hosted_Service/self-hosting.md",
    // Tutorials category
    "Tutorials/tutorial-op-bridge-deposits.md",
    "Tutorials/tutorial-erc20-token-transfers.md",
    "Tutorials/tutorial-indexing-fuel.md",
    "Tutorials/greeter-tutorial.md",
    "Tutorials/price-data.md",
    // Advanced category
    "Advanced/dynamic-contracts.md",
    "Advanced/wildcard-indexing.mdx",
    "Guides/contract-state.md",
    "Advanced/hypersync.md",
    "Advanced/rpc-sync.md",
    "Guides/ipfs.md",
    "Guides/cli-commands.md",
    "migration-guide-v1-v2.md",
    "Advanced/reorgs-support.md",
    "Advanced/generated-files.md",
    "Advanced/terminology.md",
    "Advanced/loaders.md",
    "Advanced/performance/database-performance-optimization.md",
    "Advanced/performance/latency-at-head.md",
    "Advanced/performance/benchmarking.md",
    // Troubleshoot category
    "Troubleshoot/logging.mdx",
    "Troubleshoot/common-issues.md",
    "Troubleshoot/error-codes.md",
    "Troubleshoot/reserved-words.md",
    // Supported Networks (will be handled separately)
    "fuel/fuel.md",
    "licensing.md",
    "terms-of-service.md",
    "privacy-policy.md",
  ];

  console.log(`Processing HyperIndex documentation in logical order...`);

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

  // Process files in the defined order
  for (const fileName of fileOrder) {
    const filePath = path.join(hyperIndexDir, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Processing: ${fileName}`);

      const content = readMarkdownFile(filePath);
      if (content) {
        const { title, body } = processMarkdownContent(content, filePath);

        // Fix internal links
        const fixedBody = fixInternalLinks(body, fileName);

        consolidatedContent += `## ${title}

**File:** \`${fileName}\`

${fixedBody}

---

`;
      }
    } else {
      console.warn(`Warning: File not found: ${fileName}`);
    }
  }

  // Handle supported networks separately (they're in a category)
  const supportedNetworksDir = path.join(hyperIndexDir, "supported-networks");
  if (fs.existsSync(supportedNetworksDir)) {
    const networkFiles = findMarkdownFiles(supportedNetworksDir);
    for (const networkFile of networkFiles) {
      const relativePath = path.relative(hyperIndexDir, networkFile);
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

  // Define the logical order based on the sidebar structure
  const fileOrder = [
    "overview.md",
    "quickstart.md",
    "hypersync-usage.md",
    "hypersync-clients.md",
    "hypersync-query.md",
    "hypersync-presets.md",
    "hypersync-curl-examples.md",
    "api-tokens.mdx",
    "hypersync-supported-networks.md",
    "tutorial-address-transactions.md",
    "HyperRPC/overview-hyperrpc.md",
    "HyperRPC/hyperrpc-url-endpoints.md",
    "HyperFuel/hyperfuel.md",
    "HyperFuel/hyperfuel-query.md",
  ];

  console.log(`Processing HyperSync documentation in logical order...`);

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

  // Process files in the defined order
  for (const fileName of fileOrder) {
    const filePath = path.join(hyperSyncDir, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Processing: ${fileName}`);

      const content = readMarkdownFile(filePath);
      if (content) {
        const { title, body } = processMarkdownContent(content, filePath);

        // Fix internal links
        const fixedBody = fixInternalLinks(body, fileName);

        consolidatedContent += `## ${title}

**File:** \`${fileName}\`

${fixedBody}

---

`;
      }
    } else {
      console.warn(`Warning: File not found: ${fileName}`);
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
