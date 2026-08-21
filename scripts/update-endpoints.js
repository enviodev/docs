const fs = require("fs");
const path = require("path");
const { rpcNetworks } = require("./rpc-networks.json");
const { requestAccessNetworks } = require("./request-access-networks.json");

const URL = "https://chains.hyperquery.xyz/active_chains";

// Load network annotations
let networkAnnotations = {};
try {
  const annotationsPath = path.join(__dirname, "network-annotations.json");
  if (fs.existsSync(annotationsPath)) {
    networkAnnotations = JSON.parse(fs.readFileSync(annotationsPath, "utf8"));
  }
} catch (error) {
  console.warn("Warning: Could not load network annotations:", error.message);
}

const RENAME_CONFIG = {
  eth: "Ethereum Mainnet",
  "polygon-zkevm": "Polygon zkEVM",
  zksync: "ZKsync",
  xdc: "XDC",
  "xdc-testnet": "XDC Testnet",
  // Add other renaming rules here
};

// Filter out staging and fuel chains
const FILTER_ENDPOINTS = [/^staging-/, /fuel/, /temporary/, /delete/];

// Column definitions (no Notes column - using asterisks instead)
const HYPERSYNC_COLUMNS = [
  { name: "Network Name", width: 25 },
  { name: "Network ID", width: 15 },
  { name: "HyperSync URL", width: 88 },
  { name: "HyperRPC URL", width: 88 },
];

const HYPERRPC_COLUMNS = [
  { name: "Network Name", width: 25 },
  { name: "Network ID", width: 15 },
  { name: "URL", width: 88 },
];

const capitalizeAndSplit = (name) => {
  return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const generateCommonTableHeader = (columns) => {
  let header =
    "| " +
    columns.map((col) => col.name.padEnd(col.width)).join(" | ") +
    " |\n";
  header +=
    "| " + columns.map((col) => "-".repeat(col.width)).join(" | ") + " |\n";
  return header;
};

const sortAndFilterChains = (data) => {
  return data
    .sort((a, b) => {
      const nameA = RENAME_CONFIG[a.name] || capitalizeAndSplit(a.name);
      const nameB = RENAME_CONFIG[b.name] || capitalizeAndSplit(b.name);
      return nameA.localeCompare(nameB);
    })
    .filter(
      (chain) => !FILTER_ENDPOINTS.some((regex) => regex.test(chain.name))
    );
};

const getNetworkName = (chain) =>
  RENAME_CONFIG[chain.name] || capitalizeAndSplit(chain.name);

// Request-access networks are listed in the tables, but their endpoints are
// not public — access has to be requested.
const isRequestAccessChain = (chain) =>
  requestAccessNetworks.some(
    (n) => n.name === chain.name || n.chainId === chain.chain_id
  );

const REQUEST_ACCESS_CELL =
  "Access on request — [contact us](https://discord.gg/envio)";

// Some request-access networks are hidden from the chains API even though
// they exist on HyperSync. Merge them in from the config so they still show
// up in the supported-networks tables (with a request-access cell instead of
// endpoint URLs).
const withRequestAccessChains = (data) => {
  const merged = [...data];
  requestAccessNetworks.forEach((n) => {
    if (!merged.some((c) => c.name === n.name || c.chain_id === n.chainId)) {
      merged.push({
        name: n.name,
        tier: "REQUEST_ACCESS",
        chain_id: n.chainId,
        ecosystem: "evm",
      });
    }
  });
  return merged;
};

const TICK = "✔️";

const generateTableRow = (columns, values) => {
  return (
    "| " +
    columns.map((col, index) => values[index].padEnd(col.width)).join(" | ") +
    " |\n"
  );
};

const generateNotesSection = (data) => {
  const chainsWithNotes = sortAndFilterChains(data).filter(
    (chain) => networkAnnotations[chain.name]
  );

  if (chainsWithNotes.length === 0) {
    return "";
  }

  let notesSection = "\n\n**Notes:**\n\n";
  chainsWithNotes.forEach((chain) => {
    const networkName = getNetworkName(chain);
    const annotation = networkAnnotations[chain.name];
    notesSection += `- **${networkName}***: ${annotation.note}\n`;
  });

  return notesSection;
};

const generateHyperSyncTable = (data) => {
  let table = generateCommonTableHeader(HYPERSYNC_COLUMNS);

  sortAndFilterChains(data).forEach((chain) => {
    let networkName = getNetworkName(chain);

    // Add asterisk if this network has annotations
    if (networkAnnotations[chain.name]) {
      networkName += "*";
    }

    // Check if this is a traces network and modify the URL accordingly
    const isTracesNetwork = chain.name.toLowerCase().includes("traces");
    const chainIdSuffix = isTracesNetwork ? `-traces` : "";
    const hypersyncUrl = isRequestAccessChain(chain)
      ? REQUEST_ACCESS_CELL
      : `https://${chain.name}.hypersync.xyz or https://${chain.chain_id}${chainIdSuffix}.hypersync.xyz`;
    const hyperrpcUrl = isRequestAccessChain(chain)
      ? REQUEST_ACCESS_CELL
      : `https://${chain.name}.rpc.hypersync.xyz or https://${chain.chain_id}${chainIdSuffix}.rpc.hypersync.xyz`;

    const rowValues = [
      networkName,
      chain.chain_id.toString(),
      hypersyncUrl,
      hyperrpcUrl,
    ];

    table += generateTableRow(HYPERSYNC_COLUMNS, rowValues);
  });

  return table;
};

const generateHyperRPCTable = (data) => {
  let table = generateCommonTableHeader(HYPERRPC_COLUMNS);

  sortAndFilterChains(data).forEach((chain) => {
    let networkName = getNetworkName(chain);

    // Add asterisk if this network has annotations
    if (networkAnnotations[chain.name]) {
      networkName += "*";
    }

    // Check if this is a traces network and modify the URL accordingly
    const isTracesNetwork = chain.name.toLowerCase().includes("traces");
    const chainIdSuffix = isTracesNetwork ? `-traces` : "";
    const url = isRequestAccessChain(chain)
      ? REQUEST_ACCESS_CELL
      : `https://${chain.name}.rpc.hypersync.xyz or https://${chain.chain_id}${chainIdSuffix}.rpc.hypersync.xyz`;

    const rowValues = [
      networkName,
      chain.chain_id.toString(),
      url,
    ];

    table += generateTableRow(HYPERRPC_COLUMNS, rowValues);
  });

  return table;
};

const updateMarkdownFiles = async () => {
  try {
    const response = await fetch(URL);
    const data = withRequestAccessChains(await response.json());

    // Update HyperSync file
    const hyperSyncTable = generateHyperSyncTable(data);
    const hyperSyncNotes = generateNotesSection(data);
    const HYPERSYNC_FILE_PATH =
      "docs/HyperSync/hypersync-supported-networks.md";
    let hyperSyncContent = fs.readFileSync(HYPERSYNC_FILE_PATH, "utf8");

    // Remove existing notes section if present
    hyperSyncContent = hyperSyncContent.replace(/\n\n\*\*Notes:\*\*[\s\S]*?(?=\n\n---|\n\n$|$)/, "");

    const hyperSyncRegex =
      /([\s\S]*?)\n\| Network Name[\s\S]*?\n\n([\s\S]*|$)/;
    const hyperSyncMatch = hyperSyncContent.match(hyperSyncRegex);

    if (hyperSyncMatch) {
      const updatedHyperSyncContent =
        hyperSyncMatch[1] + "\n" + hyperSyncTable + hyperSyncNotes + "\n" + hyperSyncMatch[2];
      hyperSyncContent = hyperSyncContent.replace(
        hyperSyncRegex,
        updatedHyperSyncContent
      );
      fs.writeFileSync(HYPERSYNC_FILE_PATH, hyperSyncContent, "utf8");
      console.log("HyperSync markdown file updated successfully.");
    } else {
      console.log("HyperSync table not found in the markdown file.");
    }

    // Update HyperRPC file
    const hyperRPCTable = generateHyperRPCTable(data);
    const hyperRPCNotes = generateNotesSection(data);
    const HYPERRPC_FILE_PATH =
      "docs/HyperRPC/hyperrpc-supported-networks.md";
    let hyperRPCContent = fs.readFileSync(HYPERRPC_FILE_PATH, "utf8");

    // Remove existing notes section if present
    hyperRPCContent = hyperRPCContent.replace(/\n\n\*\*Notes:\*\*[\s\S]*?(?=\n\n---|\n\n$|$)/, "");

    const hyperRPCRegex =
      /([\s\S]*?)\n\| Network Name[\s\S]*?(\n\n[\s\S]*|$)/;
    const hyperRPCMatch = hyperRPCContent.match(hyperRPCRegex);

    if (hyperRPCMatch) {
      const updatedHyperRPCContent =
        hyperRPCMatch[1] + "\n" + hyperRPCTable + hyperRPCNotes + "\n" + hyperRPCMatch[2];
      hyperRPCContent = hyperRPCContent.replace(
        hyperRPCRegex,
        updatedHyperRPCContent
      );
      fs.writeFileSync(HYPERRPC_FILE_PATH, hyperRPCContent, "utf8");
      console.log("HyperRPC markdown file updated successfully.");
    } else {
      console.log("HyperRPC table not found in the markdown file.");
    }
  } catch (error) {
    console.error("Error updating markdown files:", error);
  }
};


// Supported networks are documented as a single table rather than one page
// per chain. The per-chain pages were ~300 words each and 61% identical to one
// another, they made up over half of the sitemap, and the equivalent (better
// optimised) pages already live at https://envio.dev/chains/<chain>. Collapsing
// them into one table gives developers a single searchable reference and stops
// the docs competing with the marketing site for the same queries.

const ALL_NETWORKS_COLUMNS = [
  { name: "Network", width: 28 },
  { name: "Chain ID", width: 10 },
  { name: "HyperSync URL", width: 46 },
  { name: "HyperRPC URL", width: 46 },
];

const RPC_ONLY_CELL = "_RPC only_";

// Build one row set covering every network we support, from all three sources:
// the HyperSync chains API, the request-access config, and the RPC-only config.
const collectAllNetworks = (data) => {
  const rows = new Map();

  sortAndFilterChains(withRequestAccessChains(data)).forEach((chain) => {
    const isTraces = chain.name.toLowerCase().includes("traces");
    const suffix = isTraces ? "-traces" : "";
    const requestAccess = isRequestAccessChain(chain);
    rows.set(chain.name, {
      name: getNetworkName(chain) + (networkAnnotations[chain.name] ? "*" : ""),
      chainId: chain.chain_id,
      hyperSync: requestAccess
        ? REQUEST_ACCESS_CELL
        : `https://${chain.chain_id}${suffix}.hypersync.xyz`,
      hyperRPC: requestAccess
        ? REQUEST_ACCESS_CELL
        : `https://${chain.chain_id}${suffix}.rpc.hypersync.xyz`,
    });
  });

  // RPC-only networks have no HyperSync endpoint; they are still supported as
  // an indexing data source, so they belong in the table.
  rpcNetworks.forEach((network) => {
    const slug = sluggifyName(network);
    if (rows.has(network.name) || rows.has(slug)) return;
    if (data.some((c) => c.chain_id === network.chainId)) return;
    rows.set(slug, {
      name: capitalizeAndSplit(network.name),
      chainId: network.chainId,
      hyperSync: RPC_ONLY_CELL,
      hyperRPC: RPC_ONLY_CELL,
    });
  });

  return [...rows.values()].sort((a, b) => a.name.localeCompare(b.name));
};

const generateAllNetworksTable = (data) => {
  let table = generateCommonTableHeader(ALL_NETWORKS_COLUMNS);
  collectAllNetworks(data).forEach((row) => {
    table += generateTableRow(ALL_NETWORKS_COLUMNS, [
      row.name,
      String(row.chainId),
      row.hyperSync,
      row.hyperRPC,
    ]);
  });
  return table;
};

// Replace the generated block in a supported-networks hub page, leaving the
// hand-written prose around it untouched.
const NETWORKS_TABLE_START = "<!-- NETWORKS_TABLE_START -->";
const NETWORKS_TABLE_END = "<!-- NETWORKS_TABLE_END -->";

const writeNetworksTable = (filePath, data) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping networks table, file not found: ${filePath}`);
    return;
  }
  const before = fs.readFileSync(filePath, "utf8");
  const startIdx = before.indexOf(NETWORKS_TABLE_START);
  const endIdx = before.indexOf(NETWORKS_TABLE_END);
  if (startIdx === -1 || endIdx === -1) {
    console.warn(`Skipping networks table, markers missing in: ${filePath}`);
    return;
  }
  const table = generateAllNetworksTable(data);
  const notes = generateNotesSection(data);
  const after =
    before.slice(0, startIdx + NETWORKS_TABLE_START.length) +
    "\n\n" +
    table +
    notes +
    "\n" +
    before.slice(endIdx);
  if (after !== before) {
    fs.writeFileSync(filePath, after, "utf8");
    console.log(`Updated networks table: ${filePath}`);
  }
};

const sluggifyName = (network) => {
  console.log(network.name.toLowerCase().replace(/\s+/g, "-"));
  return network.name.toLowerCase().replace(/\s+/g, "-");
};

// Generate the supported-networks table pages (replaces per-chain page generation)
const generateMarkdownFiles = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    // One table page per docs version, in place of ~236 per-chain pages.
    [
      path.join(__dirname, "../docs/HyperIndex/supported-networks/index.md"),
      path.join(__dirname, "../docs/HyperIndexV2/supported-networks/index.md"),
    ].forEach((file) => writeNetworksTable(file, data));

    const rootDir = path.join(__dirname, "..");

    // Only the hand-written supported-networks pages remain in the sidebar.
    fs.writeFileSync(
      path.join(rootDir, "supported-networks.json"),
      `{
    "supportedNetworks": [
      "supported-networks/any-evm-with-rpc",
      "supported-networks/local-anvil",
      "supported-networks/local-hardhat"]}`,
      "utf8"
    );

    // Generate HyperSync chain count for use across the site.
    // Matches the "first-class" count shown on envio.dev/chains:
    // same base filter as the supported-networks table, minus traces variants
    // (e.g. base-traces, eth-traces) which are alternative endpoints, not distinct chains.
    const hyperSyncChainCount = sortAndFilterChains(data).filter(
      (chain) => !chain.name.toLowerCase().includes("traces")
    ).length;
    const dataDir = path.join(rootDir, "src", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dataDir, "network-count.json"),
      JSON.stringify(
        {
          hyperSyncChainCount,
          generatedAt: new Date().toISOString(),
          source: URL,
        },
        null,
        2
      ) + "\n",
      "utf8"
    );
    console.log(`Wrote HyperSync chain count: ${hyperSyncChainCount}`);

    // Frontmatter/plain-text targets where MDX components can't be used.
    // Allowlist is explicit so we only rewrite known lines.
    const FRONTMATTER_TARGETS = [
      {
        file: "docs/HyperSync/overview.md",
        pattern: /^(description:.*?\b)\d+\+?\s+(networks?|chains?)\b/m,
        label: "HyperSync overview description",
      },
    ];
    FRONTMATTER_TARGETS.forEach(({ file, pattern, label }) => {
      const full = path.join(rootDir, file);
      if (!fs.existsSync(full)) return;
      const before = fs.readFileSync(full, "utf8");
      const after = before.replace(
        pattern,
        (_, prefix, word) => `${prefix}${hyperSyncChainCount}+ ${word}`
      );
      if (after !== before) {
        fs.writeFileSync(full, after, "utf8");
        console.log(`Updated chain count in ${label} (${file})`);
      }
    });

    console.log("Markdown files generated successfully.");
  } catch (error) {
    console.error("Error updating markdown files:", error);
  }
};

generateMarkdownFiles();
updateMarkdownFiles();
