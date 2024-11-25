const fs = require("fs");
const path = require("path");

const URL = "https://chains.hyperquery.xyz/active_chains";

const RENAME_CONFIG = {
  eth: "Ethereum Mainnet",
  "polygon-zkevm": "Polygon zkEVM",
  zksync: "ZKsync",
  // Add other renaming rules here
};

// Filter out staging and fuel chains
const FILTER_ENDPOINTS = [/^staging-/, /fuel/, /temporary/, /delete/];

const HYPERSYNC_COLUMNS = [
  { name: "Network Name", width: 20 },
  { name: "Network ID", width: 10 },
  { name: "URL", width: 83 },
  { name: "Tier", width: 4 },
  { name: "Supports Traces", width: 15 },
];

const HYPERRPC_COLUMNS = [
  { name: "Network Name", width: 20 },
  { name: "Network ID", width: 10 },
  { name: "URL", width: 83 },
  { name: "Supports Traces", width: 15 },
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
      (chain) => !FILTER_ENDPOINTS.some((regex) => regex.test(chain.name)),
    );
};

const getNetworkName = (chain) =>
  RENAME_CONFIG[chain.name] || capitalizeAndSplit(chain.name);

const TICK = "✔️";

const generateTableRow = (columns, values) => {
  return (
    "| " +
    columns.map((col, index) => values[index].padEnd(col.width)).join(" | ") +
    " |\n"
  );
};

const generateHyperSyncTable = (data) => {
  let table = generateCommonTableHeader(HYPERSYNC_COLUMNS);

  sortAndFilterChains(data).forEach((chain) => {
    const networkName = getNetworkName(chain);

    let tier = "🏗️"; // default tier is WIP

    if (chain.tier === "GOLD") {
      // Other emojis that could be considdered: 🏆, 🎖️, 🏅
      tier = "🥇";
    } else if (chain.tier === "SILVER") {
      tier = "🥈";
    } else if (chain.tier === "BRONZE") {
      tier = "🥉";
    } else if (chain.tier === "EXPERIMENTAL") {
      tier = "🧪";
    } else {
      console.log(
        `This chain's is not recognised - reverting to WIP tier: ${chain.name} - ${chain.tier}`,
      );
    }

    const supportsTraces =
      chain.additional_features && chain.additional_features.includes("TRACES")
        ? TICK
        : " ";
    const url = `https://${chain.name}.hypersync.xyz or https://${chain.chain_id}.hypersync.xyz`;

    table += generateTableRow(HYPERSYNC_COLUMNS, [
      networkName,
      chain.chain_id.toString(),
      url,
      tier,
      supportsTraces,
    ]);
  });

  return table;
};

const generateHyperRPCTable = (data) => {
  let table = generateCommonTableHeader(HYPERRPC_COLUMNS);

  sortAndFilterChains(data).forEach((chain) => {
    const networkName = getNetworkName(chain);
    const url = `https://${chain.name}.rpc.hypersync.xyz or https://${chain.chain_id}.rpc.hypersync.xyz`;
    const supportsTraces =
      chain.additional_features && chain.additional_features.includes("TRACES")
        ? TICK
        : " ";

    table += generateTableRow(HYPERRPC_COLUMNS, [
      networkName,
      chain.chain_id.toString(),
      url,
      supportsTraces,
    ]);
  });

  return table;
};

const updateMarkdownFiles = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    // Update HyperSync file
    const hyperSyncTable = generateHyperSyncTable(data);
    const HYPERSYNC_FILE_PATH =
      "docs/HyperSync/hypersync-supported-networks.md";
    let hyperSyncContent = fs.readFileSync(HYPERSYNC_FILE_PATH, "utf8");

    const hyperSyncRegex =
      /([\s\S]*?\n\n)\n*\| Network Name.*\| Supports Traces \|\n\| -+.*\| -+ \|\n[\s\S]*?\n*(\n\n[\s\S]*|$)/;
    const hyperSyncMatch = hyperSyncContent.match(hyperSyncRegex);

    if (hyperSyncMatch) {
      const updatedHyperSyncContent =
        hyperSyncMatch[1] + "\n" + hyperSyncTable + "\n" + hyperSyncMatch[2];
      hyperSyncContent = hyperSyncContent.replace(
        hyperSyncRegex,
        updatedHyperSyncContent,
      );
      fs.writeFileSync(HYPERSYNC_FILE_PATH, hyperSyncContent, "utf8");
      console.log("HyperSync markdown file updated successfully.");
    } else {
      console.log("HyperSync table not found in the markdown file.");
    }

    // Update HyperRPC file
    const hyperRPCTable = generateHyperRPCTable(data);
    const HYPERRPC_FILE_PATH =
      "docs/HyperSync/HyperRPC/hyperrpc-url-endpoints.md";
    let hyperRPCContent = fs.readFileSync(HYPERRPC_FILE_PATH, "utf8");

    const hyperRPCRegex =
      /([\s\S]*?\n\n)\n*\| Network Name.*\| Supports Traces \|\n\| -+.*\| -+ \|\n[\s\S]*?\n*(\n\n[\s\S]*|$)/;
    const hyperRPCMatch = hyperRPCContent.match(hyperRPCRegex);

    if (hyperRPCMatch) {
      const updatedHyperRPCContent =
        hyperRPCMatch[1] + "\n" + hyperRPCTable + "\n" + hyperRPCMatch[2];
      hyperRPCContent = hyperRPCContent.replace(
        hyperRPCRegex,
        updatedHyperRPCContent,
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

// a function to generate a markdown file for each network with a table of endpoints and basic data about the network
const generateMarkdownFiles = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    // Directory where the markdown files will be saved
    const outputDir = path.join(
      __dirname,
      "../docs/HyperIndex/supported-networks",
    );

    // Function to generate markdown content
    const generateMarkdownContent = (network) => {
      const capitalizedTitle = capitalizeAndSplit(network.name);
      const tierEmoji =
        {
          Gold: "🏅",
          Silver: "🥈",
          Bronze: "🥉",
          Hidden: "🔒",
        }[network.tier] || "🏗️";

      const hypersyncUrl = `https://${network.name}.hypersync.xyz`;
      const hyperrpcUrl = `https://${network.name}.rpc.hypersync.xyz`;

      return `---
id: ${network.name}
title: ${capitalizedTitle}
sidebar_label: ${capitalizedTitle}
slug: /${network.name}
---

# ${capitalizedTitle}

## Indexing ${capitalizedTitle} Data with Envio

| **Field**                     | **Value**                                                                                          |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **${capitalizedTitle} Chain ID**     | ${network.chain_id}                                                                                            |
| **HyperSync URL Endpoint**    | [${hypersyncUrl}](${hypersyncUrl}) or [https://${network.chain_id}.hypersync.xyz](https://${network.chain_id}.hypersync.xyz) |
| **HyperRPC URL Endpoint**     | [${hyperrpcUrl}](${hyperrpcUrl}) or [https://${network.chain_id}.rpc.hypersync.xyz](https://${network.chain_id}.rpc.hypersync.xyz) |

---

### Tier

${network.tier} ${tierEmoji}

### Overview

Envio is a modular hyper-performant data indexing solution for ${capitalizedTitle}, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](/docs/HyperSync/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on ${capitalizedTitle}, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](/docs/HyperIndex/contract-import).

---

### Defining Network Configurations

\`\`\`yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: ${network.chain_id} # ${capitalizedTitle}  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
\`\`\`

With these steps completed, your application will be set to efficiently index ${capitalizedTitle} data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](/docs/HyperIndex/configuration-file).

### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!

---
`;
    };

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let supportedNetworks = [];

    // Generate files
    data.forEach((network) => {
      if (
        network.tier.toLowerCase() != "HIDDEN".toLowerCase() ||
        network.tier.toLowerCase() != "INTERNAL".toLowerCase()
      ) {
        const content = generateMarkdownContent(network);
        const filePath = path.join(outputDir, `${network.name}.md`);
        fs.writeFileSync(filePath, content, "utf8");
        supportedNetworks.push(`"supported-networks/${network.name}"`);
        console.log(`Generated file: ${filePath}`);
      }
    });

    const rootDir = path.join(__dirname, "..");

    // Update supported-networks.json
    fs.writeFileSync(
      path.join(rootDir, "supported-networks.json"),
      `{ "supportedNetworks": [
        "supported-networks/any-evm-with-rpc",
        "supported-networks/local-anvil",
        "supported-networks/local-hardhat",
 ${supportedNetworks.sort().join(",")}]}`,
      "utf8",
    );

    console.log("Markdown files generated successfully.");
  } catch (error) {
    console.error("Error updating markdown files:", error);
  }
};

generateMarkdownFiles();
updateMarkdownFiles();
