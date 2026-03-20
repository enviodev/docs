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

  // Remove any remaining markdown links (but do not touch markdown images: `![alt](...)`)
  content = content.replace(/(?<!\!)\[([^\]]+)\]\([^)]+\)/g, "$1");

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

// LLM frontmatter metadata: keep these in sync with docs/Hyper*-LLM/*-complete.mdx
const hyperIndexDescription =
  "Complete reference documentation for HyperIndex - Envio's blazing-fast multichain blockchain indexer. Covers setup, configuration, event handlers, multichain indexing, GraphQL APIs, and migration from TheGraph, Ponder, SQD, SubQuery, and more.";
const hyperIndexKeywords =
  "[HyperIndex, blockchain indexer, multichain indexing, HyperSync, Envio, GraphQL, TheGraph alternative, EVM indexer, smart contract events, Ponder alternative, SQD alternative, SubQuery alternative]";

const hyperSyncDescription =
  "Complete reference documentation for HyperSync - Envio's ultra-fast blockchain data engine. Covers performance benchmarks, query system, field selection, client libraries (Python, Rust, Node.js, Go), API tokens, supported networks, and advanced data access patterns for EVM chains and Fuel.";
const hyperSyncKeywords =
  "[HyperSync, blockchain data API, fast blockchain indexing, EVM data, Envio, RPC alternative, blockchain analytics, on-chain data, Python blockchain, Rust blockchain, Node.js blockchain, Go blockchain, HyperIndex, real-time blockchain data]";

const hyperRPCDescription =
  "Complete reference documentation for HyperRPC - Envio's ultra-fast read-only JSON-RPC endpoint. A drop-in replacement for traditional RPC nodes, powered by HyperSync, supporting 85+ EVM-compatible networks with up to 5x faster performance for data-intensive blockchain operations.";
const hyperRPCKeywords =
  "[HyperRPC, JSON-RPC, fast RPC, blockchain RPC, Envio, EVM RPC, eth_getLogs, read-only RPC, HyperSync, blockchain data, RPC alternative, drop-in RPC]";

const hyperIndexKeyFactsBlock = [
  "::::info Key Facts - HyperIndex",
  "",
  "| | |",
  "|---|---|",
  "| **What it is** | A blazing-fast, developer-friendly multichain blockchain indexer that transforms on-chain events into structured, queryable databases with GraphQL APIs |",
  "| **Data engine** | Powered by HyperSync - up to 2000x faster than traditional RPC endpoints |",
  "| **Performance** | Ranked #1 fastest indexer in independent Sentio benchmarks (April 2025) - up to 6x faster than the nearest competitor, 63x faster than TheGraph |",
  "| **Supported chains** | 70+ EVM chains and Fuel, with new networks added regularly; all EVM-compatible chains supported via RPC |",
  "| **Languages** | TypeScript, JavaScript, ReScript |",
  "| **Key files** | `config.yaml` (indexer settings), `schema.graphql` (data schema), `src/EventHandlers.*` (event logic) |",
  "| **Prerequisites** | Node.js v22+, pnpm v8+, Docker Desktop (local dev only) |",
  "| **Deployment** | Hosted service (managed, no API token needed) or self-hosted |",
  "| **API token** | Required for local dev and self-hosted deployments from 3 November 2025 via `ENVIO_API_TOKEN` env variable |",
  "| **Query interface** | GraphQL API auto-generated from your schema |",
  "| **Multichain** | Native multichain indexing with `unordered_multichain_mode` support |",
  "| **Wildcard indexing** | Index by event signature rather than contract address |",
  "| **Migration** | Straightforward migration path from TheGraph subgraphs |",
  "| **Get started** | `pnpx envio init` |",
  "| **Support** | [Discord](https://discord.gg/envio) · [GitHub](https://github.com/enviodev) |",
  "",
  "::::",
  "",
  "",
].join("\n");

const hyperIndexFaqBlock = [
  "## Frequently Asked Questions (FAQ)",
  "",
  "### What is HyperIndex?",
  "",
  "HyperIndex is Envio's multichain blockchain indexing framework. It lets developers define which smart contract events to track, automatically transforms those on-chain events into structured data, and exposes them via a GraphQL API - giving you a complete, queryable backend for any blockchain application. It is powered by HyperSync, Envio's high-performance data engine.",
  "",
  "### How fast is HyperIndex compared to other indexers?",
  "",
  "HyperIndex is the fastest blockchain indexer available. In independent benchmarks conducted by Sentio in April 2025, HyperIndex was up to 6x faster than the nearest competitor and over 63x faster than TheGraph in real-world scenarios. For example, indexing LBTC token transfers took 3 minutes with HyperIndex versus 3 hours and 9 minutes with TheGraph.",
  "",
  "### What blockchains does HyperIndex support?",
  "",
  "HyperIndex supports all EVM-compatible chains. Over 70 networks have native HyperSync support for maximum performance. For chains without HyperSync, indexing is available via RPC endpoints.",
  "",
  "### What programming languages can I use?",
  "",
  "HyperIndex supports TypeScript, JavaScript, and ReScript for writing event handlers.",
  "",
  "### What are the prerequisites to run HyperIndex locally?",
  "",
  "You need Node.js v22 or newer, pnpm v8 or newer, and Docker Desktop. Docker is only required for local development - if you use Envio's hosted service, you can skip it. Windows users also need WSL (Windows Subsystem for Linux).",
  "",
  "### Do I need an API token?",
  "",
  "API tokens are required for local development and self-hosted deployments as of 3 November 2025. You can set your token via the `ENVIO_API_TOKEN` environment variable in your project's `.env` file. Indexers deployed to Envio's hosted service have special access and do not require a custom API token.",
  "",
  "### How do I get started?",
  "",
  "Run the following command and follow the prompts - you can have a working indexer in under 5 minutes:",
  "",
  "```bash",
  "pnpx envio init",
  "```",
  "",
  "You can import a contract directly from a block explorer (Etherscan, Blockscout, etc.) or from a local ABI file. HyperIndex will auto-generate your `config.yaml`, `schema.graphql`, and event handler files.",
  "",
  "### What is HyperSync and how does it relate to HyperIndex?",
  "",
  "HyperSync is the high-performance data engine that powers HyperIndex. It provides the raw blockchain data access layer and delivers up to 2000x faster performance than traditional RPC endpoints. HyperIndex uses HyperSync under the hood to give you a complete indexing solution. HyperSync can also be used directly for custom data pipelines and specialised applications.",
  "",
  "### Can HyperIndex handle blockchain reorganisations (reorgs)?",
  "",
  "Yes. HyperIndex automatically handles blockchain reorganisations by default. This behaviour can be configured via the `rollback_on_reorg` flag in your `config.yaml`.",
  "",
  "### Does HyperIndex support multichain indexing?",
  "",
  "Yes. HyperIndex natively supports indexing across multiple chains in a single indexer. For the best multichain performance, you can enable `unordered_multichain_mode` in your configuration - this is the most common setup for multichain indexing, though it comes with tradeoffs worth understanding (see the docs).",
  "",
  "### Can I do wildcard indexing (without a specific contract address)?",
  "",
  "Yes. HyperIndex supports wildcard indexing, which lets you index all events matching a given event signature across any contract on the chain - no contract address required.",
  "",
  "### How do I migrate from TheGraph and other indexing solutions?",
  "",
  "HyperIndex has a dedicated migration guide for TheGraph subgraphs. The three main steps are: (1) convert your `subgraph.yaml` to `config.yaml`, (2) migrate your schema (near copy-paste), and (3) migrate your event handlers. Run `pnpx envio init` to generate a boilerplate, then follow the Migration Guide.",
  "",
  "For developers migrating from other indexing solutions such as Ponder, Ormi, SQD (Subsquid), SubQuery, and others, the core concepts map similarly - define your contracts and events in `config.yaml`, write event handlers, and let HyperIndex generate the GraphQL API. Envio also offers full white glove migration support for teams moving from any indexing stack. Reach out via [Discord](https://discord.gg/envio) to get personalised assistance.",
  "",
  "### What does the hosted service offer?",
  "",
  "Envio's hosted service manages deployment and infrastructure for you. Indexers on the hosted service do not require a custom API token for HyperSync access. For pricing details and self-hosted tiered packages, reach out on Discord.",
  "",
  "### Where can I get help?",
  "",
  "- **Discord**: [discord.gg/envio](https://discord.gg/envio) - the fastest way to get help from the team and community",
  "- **Telegram**: [Envio Telegram](https://t.me/+kAIGElzPjApiMjI0) - the offcial Envio Telegram to get support from the team and community",
  "- **GitHub**: [github.com/enviodev](https://github.com/enviodev)",
  "- **Email**: hello@envio.dev",
  "",
].join("\n");

const hyperSyncKeyFactsBlock = [
  "::::info Key Facts - HyperSync",
  "",
  "| | |",
  "|---|---|",
  "| **What it is** | A purpose-built, high-performance blockchain data retrieval layer built in Rust - a direct alternative to traditional JSON-RPC endpoints |",
  "| **Performance** | Up to 2000x faster than traditional RPC (e.g. scan Arbitrum for sparse log data in 2 seconds vs. hours/days); ~500x faster for event queries |",
  "| **Supported networks** | 70+ EVM chains and Fuel, with new networks added regularly |",
  "| **Client libraries** | Python, Rust, Node.js, Go |",
  "| **API token** | Required - set via `ENVIO_API_TOKEN` environment variable |",
  "| **Data types** | Logs, transactions, traces, blocks - with fine-grained field selection |",
  "| **Query features** | Log filters, transaction filters, trace filters, block filters, field selection, join modes, streaming |",
  "| **Quickstart** | `pnpx logtui aave arbitrum` - zero setup required |",
  "| **Powers** | HyperIndex, ChainDensity.xyz, Scope.sh, LogTUI, and more |",
  "| **Relationship to HyperIndex** | HyperSync is the data engine; HyperIndex is the full indexing framework built on top of it |",
  "| **Support** | [Discord](https://discord.gg/envio) · [GitHub](https://github.com/enviodev) |",
  "",
  "::::",
  "",
  "",
].join("\n");

const hyperSyncFaqBlock = [
  "## Frequently Asked Questions (FAQ)",
  "",
  "### What is HyperSync?",
  "",
  "HyperSync is Envio's purpose-built, high-performance blockchain data retrieval layer, built in Rust. It serves as a direct alternative to traditional JSON-RPC endpoints, providing dramatically faster queries and more flexible data access patterns. Developers use HyperSync to retrieve logs, transactions, traces, and block data at speeds not possible with standard RPC.",
  "",
  "### How much faster is HyperSync than traditional RPC?",
  "",
  "HyperSync is up to 2000x faster than traditional RPC methods. For example, scanning the Arbitrum blockchain for sparse log data takes 2 seconds with HyperSync versus hours or days with traditional RPC. Fetching all Uniswap V3 PoolCreated events on Ethereum takes seconds versus hours - approximately 500x faster.",
  "",
  "### What blockchains does HyperSync support?",
  "",
  "HyperSync supports 70+ EVM-compatible chains and the Fuel Network, with new networks added regularly. You connect to different networks simply by changing the client URL (e.g. `https://eth.hypersync.xyz` for Ethereum, `https://arbitrum.hypersync.xyz` for Arbitrum). See the Supported Networks page for the full list.",
  "",
  "### What client libraries are available?",
  "",
  "HyperSync has official client libraries for Python, Rust, Node.js, and Go.",
  "",
  "### Do I need an API token?",
  "",
  "Yes. An API token is required to use HyperSync. Set it as an environment variable:",
  "",
  "```bash",
  "export ENVIO_API_TOKEN=\"your-api-token-here\"",
  "```",
  "",
  "### How do I get started quickly?",
  "",
  "The fastest way to see HyperSync in action with zero setup is LogTUI:",
  "",
  "```bash",
  "pnpx logtui aave arbitrum",
  "```",
  "",
  "To start building, clone the quickstart repository:",
  "",
  "```bash",
  "git clone https://github.com/enviodev/hypersync-quickstart.git",
  "cd hypersync-quickstart",
  "pnpm install",
  "node run-simple.js",
  "```",
  "",
  "### What types of data can I query with HyperSync?",
  "",
  "HyperSync supports querying four types of blockchain data: logs (events), transactions, traces (internal transactions and state changes - supported on select networks like Ethereum Mainnet), and blocks. Each type supports fine-grained filtering and field selection.",
  "",
  "### What is field selection and why does it matter?",
  "",
  "Field selection lets you specify exactly which fields you want returned in a query (e.g. only `Address`, `Topic0`, and `Data` from logs). This dramatically reduces unnecessary data transfer and improves query performance - you only pay for the data you actually need.",
  "",
  "### What are join modes?",
  "",
  "Join modes control how related data is returned alongside your query results. Options include `JoinNothing` (exact matches only), `JoinAll` (matches plus all related objects), `JoinTransactions` (matches plus their transactions), and the default (a reasonable set of related objects).",
  "",
  "### What is the relationship between HyperSync and HyperIndex?",
  "",
  "HyperSync is the data engine - it provides raw, high-speed access to blockchain data. HyperIndex is the full-featured indexing framework built on top of HyperSync, adding schema management, event handling, and GraphQL APIs. Use HyperSync directly when you need raw blockchain data at maximum speed, or use HyperIndex when you need a complete indexing solution.",
  "",
  "### What is LogTUI?",
  "",
  "LogTUI is a terminal-based blockchain event viewer built on HyperSync. It lets you monitor events from popular protocols (Uniswap, Aave, Chainlink, ENS, and 20+ others) across multiple chains with zero configuration. Run it with a single `pnpx logtui` command.",
  "",
  "### Where can I get help?",
  "",
  "- **Discord**: [discord.gg/envio](https://discord.gg/envio) - the fastest way to get help from the team and community",
  "- **Telegram**: [Envio Telegram](https://t.me/+kAIGElzPjApiMjI0) - the offcial Envio Telegram to get support from the team and community",
  "- **GitHub**: [github.com/enviodev](https://github.com/enviodev)",
  "- **Email**: hello@envio.dev",
  "",
].join("\n");

const hyperRPCKeyFactsBlock = [
  "::::info Key Facts - HyperRPC",
  "",
  "| | |",
  "|---|---|",
  "| **What it is** | An extremely fast read-only JSON-RPC endpoint - a drop-in replacement for traditional RPC nodes, built on top of HyperSync |",
  "| **Performance** | Up to 5x faster than traditional nodes (geth, erigon, reth) for data-intensive operations |",
  "| **Read-only** | Optimised for data retrieval only - cannot send transactions |",
  "| **Supported networks** | 85 EVM-compatible networks, with new networks being added regularly |",
  "| **Endpoint format** | `https://[network].rpc.hypersync.xyz` or `https://[chainid].rpc.hypersync.xyz` |",
  "| **Supported methods** | `eth_chainId`, `eth_blockNumber`, `eth_getBlockByNumber`, `eth_getBlockByHash`, `eth_getBlockReceipts`, `eth_getTransactionByHash`, `eth_getTransactionByBlockHashAndIndex`, `eth_getTransactionByBlockNumberAndIndex`, `eth_getTransactionReceipt`, `eth_getLogs`, `trace_block` (select chains only) |",
  "| **API token** | Recommended - rate limiting starts June 2025 |",
  "| **When to use** | Drop-in replacement for existing RPC-based code; when tools expect standard JSON-RPC interfaces; when you don't have time for a deeper integration |",
  "| **When to use HyperSync instead** | When performance is critical; for new projects; when you need advanced filtering and field selection |",
  "| **Development status** | Under active development; not yet formally security audited; read-only only |",
  "| **Support** | [Discord](https://discord.gg/envio) · [GitHub](https://github.com/enviodev) |",
  "",
  "::::",
  "",
  "",
].join("\n");

const hyperRPCFaqBlock = [
  "## Frequently Asked Questions (FAQ)",
  "",
  "### What is HyperRPC?",
  "",
  "HyperRPC is an ultra-fast, read-only JSON-RPC endpoint built by Envio. It is designed as a drop-in replacement for traditional JSON-RPC nodes, optimised specifically for data-intensive blockchain operations like historical queries, log filtering, and block/transaction retrieval. Behind the scenes, HyperRPC is powered by HyperSync.",
  "",
  "### How does HyperRPC differ from HyperSync?",
  "",
  "HyperRPC uses the standard JSON-RPC interface, making it compatible with existing tools and code that expect standard RPC methods. HyperSync is Envio's more powerful data engine with a custom query interface that offers significantly faster performance and much greater flexibility in how you filter and retrieve blockchain data. HyperRPC actually uses HyperSync under the hood to fulfil requests.",
  "",
  "### When should I use HyperRPC instead of HyperSync?",
  "",
  "Use HyperRPC when you need a simple drop-in replacement for existing RPC-based code, when you don't have time for a deeper integration, or when you're working with tools that expect standard JSON-RPC interfaces. Use HyperSync when performance is critical, when you need advanced filtering capabilities, when you want more control over data formatting and field selection, or for new projects where you're designing the data access layer from scratch.",
  "",
  "### How fast is HyperRPC?",
  "",
  "Early benchmarks show HyperRPC delivers up to 5x performance improvement for data-intensive operations compared to traditional nodes such as geth, erigon, and reth. This improvement is most noticeable for historical data queries, log event filtering, block and transaction retrievals, and analytics applications.",
  "",
  "### What JSON-RPC methods does HyperRPC support?",
  "",
  "HyperRPC supports the following methods: `eth_chainId`, `eth_blockNumber`, `eth_getBlockByNumber`, `eth_getBlockByHash`, `eth_getBlockReceipts`, `eth_getTransactionByHash`, `eth_getTransactionByBlockHashAndIndex`, `eth_getTransactionByBlockNumberAndIndex`, `eth_getTransactionReceipt`, `eth_getLogs`, and `trace_block` (on select chains only). It does not support all standard RPC methods.",
  "",
  "### What networks does HyperRPC support?",
  "",
  "HyperRPC supports 85 EVM-compatible networks including Ethereum Mainnet, Arbitrum, Base, Optimism, Polygon, Avalanche, BSC, and many more. New networks are being added rapidly. See the Supported Networks table in this document for the full list of endpoints.",
  "",
  "### Do I need an API token?",
  "",
  "An API token is recommended. Requests without an API token will be rate limited starting June 2025 (following the same schedule as HyperSync). Append your token to the endpoint URL. You can generate a token through the Envio Dashboard.",
  "",
  "### How do I get started?",
  "",
  "Find the endpoint for your network in the Supported Networks table (format: `https://[network].rpc.hypersync.xyz`), then use it like any standard JSON-RPC endpoint:",
  "",
  "```javascript",
  "const response = await fetch(\"https://100.rpc.hypersync.xyz/\", {",
  "  method: \"POST\",",
  "  headers: { \"Content-Type\": \"application/json\" },",
  "  body: JSON.stringify({",
  "    jsonrpc: \"2.0\",",
  "    id: 1,",
  "    method: \"eth_getLogs\",",
  "    params: [{ fromBlock: \"0x1000000\", toBlock: \"0x1000100\", address: \"0xYourContractAddress\" }],",
  "  }),",
  "});",
  "```",
  "",
  "### Is HyperRPC production-ready?",
  "",
  "HyperRPC is under active development to further improve performance and stability. It has not yet undergone formal security audits and does not support all standard RPC methods. It is designed for read-only operations only. Envio welcomes feedback and questions via [Discord](https://discord.gg/envio).",
  "",
  "### Where can I get help?",
  "",
  "- **Discord**: [discord.gg/envio](https://discord.gg/envio) - the fastest way to get help from the team and community",
  "- **Telegram**: [Envio Telegram](https://t.me/+kAIGElzPjApiMjI0) - the offcial Envio Telegram to get support from the team and community",
  "- **GitHub**: [github.com/enviodev](https://github.com/enviodev)",
  "- **Email**: hello@envio.dev",
  "",
].join("\n");

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
description: ${
  isHyperIndex
    ? hyperIndexDescription
    : isHyperSync
      ? hyperSyncDescription
      : hyperRPCDescription
}
keywords: ${
  isHyperIndex
    ? hyperIndexKeywords
    : isHyperSync
      ? hyperSyncKeywords
      : hyperRPCKeywords
}
robots: noindex, nofollow
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

  // Insert product-specific "Key Facts" right after the intro section.
  if (isHyperIndex) {
    consolidatedContent += hyperIndexKeyFactsBlock;
  } else if (isHyperSync) {
    consolidatedContent += hyperSyncKeyFactsBlock;
  } else if (isHyperRPC) {
    consolidatedContent += hyperRPCKeyFactsBlock;
  }

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

  // Do not append additional supported-network docs beyond sidebar order.

  // Append product-specific FAQs at the very bottom.
  if (isHyperIndex) {
    consolidatedContent += hyperIndexFaqBlock;
  } else if (isHyperSync) {
    consolidatedContent += hyperSyncFaqBlock;
  } else if (isHyperRPC) {
    consolidatedContent += hyperRPCFaqBlock;
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
