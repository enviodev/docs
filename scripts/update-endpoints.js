const fs = require("fs");
const path = require("path");
const { rpcNetworks } = require("./rpc-networks.json");

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
  { name: "Network Name", width: 25 },
  { name: "Network ID", width: 15 },
  { name: "URL", width: 88 },
  { name: "Tier", width: 4 },
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
    "\n";
  header +=
    "| " + columns.map((col) => "-".repeat(col.width)).join(" | ") + "\n";
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

const TICK = "✔️";

const generateTableRow = (columns, values) => {
  return (
    "| " +
    columns.map((col, index) => values[index].padEnd(col.width)).join(" | ") +
    "\n"
  );
};

const emojiTier = (network) => {
  return (
    {
      gold: "🏅",
      silver: "🥈",
      bronze: "🥉",
      stone: "🪨",
      hidden: "🔒",
      testnet: "🎒",
    }[network.tier.toLowerCase()] || "🏗️"
  );
};

const generateHyperSyncTable = (data) => {
  let table = generateCommonTableHeader(HYPERSYNC_COLUMNS);

  sortAndFilterChains(data).forEach((chain) => {
    const networkName = getNetworkName(chain);

    const tier = emojiTier(chain);

    // Check if this is a traces network and modify the URL accordingly
    const isTracesNetwork = chain.name.toLowerCase().includes("traces");
    const chainIdSuffix = isTracesNetwork ? `-traces` : "";
    const url = `https://${chain.name}.hypersync.xyz or https://${chain.chain_id}${chainIdSuffix}.hypersync.xyz`;

    table += generateTableRow(HYPERSYNC_COLUMNS, [
      networkName,
      chain.chain_id.toString(),
      url,
      tier,
    ]);
  });

  return table;
};

const generateHyperRPCTable = (data) => {
  let table = generateCommonTableHeader(HYPERRPC_COLUMNS);

  sortAndFilterChains(data).forEach((chain) => {
    const networkName = getNetworkName(chain);

    // Check if this is a traces network and modify the URL accordingly
    const isTracesNetwork = chain.name.toLowerCase().includes("traces");
    const chainIdSuffix = isTracesNetwork ? `-traces` : "";
    const url = `https://${chain.name}.rpc.hypersync.xyz or https://${chain.chain_id}${chainIdSuffix}.rpc.hypersync.xyz`;

    table += generateTableRow(HYPERRPC_COLUMNS, [
      networkName,
      chain.chain_id.toString(),
      url,
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
      /([\s\S]*?\n\n)\n*\| Network Name[\s\S]*?\n\n([\s\S]*|$)/;
    const hyperSyncMatch = hyperSyncContent.match(hyperSyncRegex);

    if (hyperSyncMatch) {
      const updatedHyperSyncContent =
        hyperSyncMatch[1] + "\n" + hyperSyncTable + "\n" + hyperSyncMatch[2];
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
    const HYPERRPC_FILE_PATH =
      "docs/HyperRPC/hyperrpc-supported-networks.md";
    let hyperRPCContent = fs.readFileSync(HYPERRPC_FILE_PATH, "utf8");

    const hyperRPCRegex =
      /([\s\S]*?\n\n)\n*\| Network Name[\s\S]*?\n\n([\s\S]*|$)/;
    const hyperRPCMatch = hyperRPCContent.match(hyperRPCRegex);

    if (hyperRPCMatch) {
      const updatedHyperRPCContent =
        hyperRPCMatch[1] + "\n" + hyperRPCTable + "\n" + hyperRPCMatch[2];
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

// Function to generate markdown content
const generateHyperSyncMarkdownContent = (network) => {
  const capitalizedTitle = capitalizeAndSplit(network.name);
  const tier = emojiTier(network);

  const hypersyncUrl = `https://${network.name}.hypersync.xyz`;
  const hyperrpcUrl = `https://${network.name}.rpc.hypersync.xyz`;

  // Check if this is a traces network and modify the URL accordingly
  const isTracesNetwork = network.name.toLowerCase().includes("traces");
  const chainIdSuffix = isTracesNetwork ? `-traces` : "";

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
| **HyperSync URL Endpoint**    | [${hypersyncUrl}](${hypersyncUrl}) or [https://${network.chain_id}${chainIdSuffix}.hypersync.xyz](https://${network.chain_id}${chainIdSuffix}.hypersync.xyz) |
| **HyperRPC URL Endpoint**     | [${hyperrpcUrl}](${hyperrpcUrl}) or [https://${network.chain_id}${chainIdSuffix}.rpc.hypersync.xyz](https://${network.chain_id}${chainIdSuffix}.rpc.hypersync.xyz) |

---

### Tier

${network.tier} ${tier}

### Overview

Envio is a modular hyper-performant data indexing solution for ${capitalizedTitle}, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

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

const sluggifyName = (network) => {
  console.log(network.name.toLowerCase().replace(/\s+/g, "-"));
  return network.name.toLowerCase().replace(/\s+/g, "-");
};
// Function to generate markdown content for RPC networks
const generateRPCMarkdownContent = (network) => {
  let slugFriendlyName = sluggifyName(network);

  return `---
id: ${slugFriendlyName}
title: ${network.name}
sidebar_label: ${network.name}
slug: /${slugFriendlyName}
---

# ${network.name}

## Indexing ${network.name} Data with Envio via RPC

:::warning
RPC as a source is not as fast as HyperSync. It is important in production to source RPC data from reliable sources. We recommend our partners at [drpc.org](https://drpc.org). Below, we have provided a set of free endpoints sourced from chainlist.org. **We don't recommend using these in production** as they may be rate limited. We recommend [tweaking the RPC config](./rpc-sync) to accommodate potential rate limiting.
:::

We suggest getting the latest from [chainlist.org](https://chainlist.org).

### Overview

Envio supports ${
    network.name
  } through an RPC-based indexing approach. This method allows you to ingest blockchain data via an RPC endpoint by setting the RPC configuration.

---

### Defining Network Configurations

To use ${
    network.name
  }, define the RPC configuration in your network configuration file as follows:

:::info
You may need to adjust more parameters of the [rpc configuration](./rpc-sync) to support the specific rpc provider. 
:::

\`\`\`yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: ${network.chainId} # ${network.name}
    rpc_config:
      url: ${network.rpcEndpoints[0]} ${
    network.rpcEndpoints.length <= 1
      ? ""
      : network.rpcEndpoints
          .slice(1)
          .map((url) => `\n    # url: ${url} # alternative`)
  }
    start_block: START_BLOCK_NUMBER # Specify the starting block
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

Want HyperSync for ${
    network.name
  }? Request network support here [Discord](https://discord.gg/fztEvj79m3)!
`;
};

// a function to generate a markdown file for each network with a table of endpoints and basic data about the network
const generateMarkdownFiles = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    // Directory where the markdown files will be saved
    const outputDir = path.join(
      __dirname,
      "../docs/HyperIndex/supported-networks"
    );

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let supportedNetworks = [];

    // Generate HyperSync files
    data.forEach((network) => {
      if (
        network.tier.toLowerCase() !== "hidden" &&
        network.tier.toLowerCase() !== "internal" &&
        !network.name.toLowerCase().includes("traces") // Exclude traces networks from HyperIndex docs
      ) {
        const content = generateHyperSyncMarkdownContent(network);
        const filePath = path.join(outputDir, `${network.name}.md`);
        fs.writeFileSync(filePath, content, "utf8");
        supportedNetworks.push(`"supported-networks/${network.name}"`);
        console.log(`Generated file: ${filePath}`);
      }
    });

    // Generate RPC files
    rpcNetworks.forEach((network) => {
      // if network.chainId exists in data, skip it, implies it's now supported in hypersync
      if (data.find((item) => item.chain_id === network.chainId)) {
        return;
      }
      const content = generateRPCMarkdownContent(network);
      const filePath = path.join(outputDir, `${sluggifyName(network)}.md`);
      fs.writeFileSync(filePath, content, "utf8");
      supportedNetworks.push(`"supported-networks/${sluggifyName(network)}"`);
      console.log(`Generated file: ${filePath}`);
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
      "utf8"
    );

    console.log("Markdown files generated successfully.");
  } catch (error) {
    console.error("Error updating markdown files:", error);
  }
};

generateMarkdownFiles();
updateMarkdownFiles();
