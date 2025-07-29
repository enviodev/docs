---
id: quickstart
title: HyperSync Quickstart
sidebar_label: Quickstart ⭐ Recommended
slug: /hypersync-quickstart
---

# HyperSync Quickstart

Get up and running with HyperSync in minutes. This guide will help you start accessing blockchain data at unprecedented speeds with minimal setup.

## Quickest Start: Try LogTUI

Want to see HyperSync in action with zero setup? Try LogTUI, a terminal-based blockchain event viewer:

```bash
# Monitor Aave events on Arbitrum (no installation needed)
pnpx logtui aave arbitrum
```

## Clone the Quickstart Repository

The fastest way to get started is to clone our minimal example repository:

```bash
git clone https://github.com/enviodev/hypersync-quickstart.git
cd hypersync-quickstart
```

This repository contains everything you need to start streaming blockchain data using HyperSync.

## Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install
```

## Choose Your Adventure

The repository includes three different script options, all of which retrieve Uniswap V3 events from Ethereum mainnet:

```bash
# Run minimal version (recommended for beginners)
node run-simple.js

# Run full version with progress bar
node run.js

# Run version with terminal UI
node run-tui.js
```

That's it! You're now streaming data directly from Ethereum mainnet through HyperSync! (TUI version below)

![HyperSync in Action](/img/hypersync.gif)

## Understanding the Code

Let's look at the core concepts in the example code:

### 1. Initialize the Client

```javascript
import { HypersyncClient } from "@envio-dev/hypersync-client";

// Initialize Hypersync client
const client = HypersyncClient.new({
  url: "http://eth.hypersync.xyz", // Change this URL for different networks
});
```

> **Note:** To connect to different networks, see the [Supported Networks](/docs/HyperSync/hypersync-supported-networks) page for a complete list of available URLs.

### 2. Build Your Query

The heart of HyperSync is the query object, which defines what data you want to retrieve:

```javascript
let query = {
  fromBlock: 0, // Start block (0 = genesis)
  logs: [
    // Filter for specific events
    {
      topics: [topic0_list], // Event signatures we're interested in
    },
  ],
  fieldSelection: {
    // Only return fields we need
    log: [
      LogField.Data,
      LogField.Address,
      LogField.Topic0,
      LogField.Topic1,
      LogField.Topic2,
      LogField.Topic3,
    ],
  },
  joinMode: JoinMode.JoinTransactions, // How to join related data
};
```

### 3. Stream and Process Results

```javascript
// Start streaming events
const stream = await client.stream(query, {});

while (true) {
  const res = await stream.recv();

  // Process results
  if (res.data && res.data.logs) {
    // Do something with the logs
    totalEvents += res.data.logs.length;
  }

  // Update starting block for next batch
  if (res.nextBlock) {
    query.fromBlock = res.nextBlock;
  }
}
```

## Key Concepts for Building Queries

### Filtering Data

HyperSync lets you filter blockchain data in several ways:

- **Log filters**: Find specific events by contract address and event signature
- **Transaction filters**: Filter by sender/receiver addresses, method signatures, etc.
- **Trace filters**: Access internal transactions and state changes (only supported on select networks like Ethereum Mainnet)
- **Block filters**: Get data from specific block ranges

### Field Selection

One of HyperSync's most powerful features is the ability to retrieve only the fields you need:

```javascript
fieldSelection: {
  // Block fields
  block: [BlockField.Number, BlockField.Timestamp],

  // Log fields
  log: [LogField.Address, LogField.Topic0, LogField.Data],

  // Transaction fields
  transaction: [TransactionField.From, TransactionField.To, TransactionField.Value],
}
```

This selective approach dramatically reduces unnecessary data transfer and improves performance.

### Join Modes

HyperSync allows you to control how related data is joined:

- **JoinNothing**: Return only exact matches
- **JoinAll**: Return matches plus all related objects
- **JoinTransactions**: Return matches plus their transactions
- **Default**: Return a reasonable set of related objects

## Examples

### Finding Uniswap V3 Events

This example (from the quickstart repo) streams all Uniswap V3 events from the beginning of Ethereum:

```javascript
import { keccak256, toHex } from "viem";
import {
  HypersyncClient,
  LogField,
  JoinMode,
} from "@envio-dev/hypersync-client";

// Define Uniswap V3 event signatures
const event_signatures = [
  "PoolCreated(address,address,uint24,int24,address)",
  "Burn(address,int24,int24,uint128,uint256,uint256)",
  "Initialize(uint160,int24)",
  "Mint(address,address,int24,int24,uint128,uint256,uint256)",
  "Swap(address,address,int256,int256,uint160,uint128,int24)",
];

// Create topic0 hashes from event signatures
const topic0_list = event_signatures.map((sig) => keccak256(toHex(sig)));

// Initialize Hypersync client
const client = HypersyncClient.new({
  url: "http://eth.hypersync.xyz",
});

// Define query for Uniswap V3 events
let query = {
  fromBlock: 0,
  logs: [
    {
      topics: [topic0_list],
    },
  ],
  fieldSelection: {
    log: [
      LogField.Data,
      LogField.Address,
      LogField.Topic0,
      LogField.Topic1,
      LogField.Topic2,
      LogField.Topic3,
    ],
  },
  joinMode: JoinMode.JoinTransactions,
};

const main = async () => {
  console.log("Starting Uniswap V3 event scan...");
  const stream = await client.stream(query, {});

  // Process stream...
};

main();
```

## Supported Networks

HyperSync supports 70+ EVM-compatible networks. You can change networks by simply changing the client URL:

```javascript
// Ethereum Mainnet
const client = HypersyncClient.new({ url: "http://eth.hypersync.xyz" });

// Arbitrum
const client = HypersyncClient.new({ url: "http://arbitrum.hypersync.xyz" });

// Base
const client = HypersyncClient.new({ url: "http://base.hypersync.xyz" });
```

See the [Supported Networks](/docs/HyperSync/hypersync-supported-networks) page for a complete list.

## Using LogTUI

This quickstart repository powers [LogTUI](https://www.npmjs.com/package/logtui), a terminal-based blockchain event viewer built on HyperSync. LogTUI lets you monitor events from popular protocols across multiple chains with zero configuration.

Try it with a single command:

```bash
# Monitor Uniswap events on unichain
pnpx logtui uniswap-v4 unichain

# Monitor Aave events on Arbitrum
pnpx logtui aave arbitrum

# See all available options
pnpx logtui --help
```

LogTUI supports scanning historically for any events across all networks supported by HyperSync.

## Next Steps

You're now ready to build with HyperSync! Here are some resources for diving deeper:

- [Client Libraries](/docs/HyperSync/hypersync-clients) - Explore language-specific clients
- [Query Reference](/docs/HyperSync/hypersync-query) - Learn advanced query techniques
- **[Build queries visually](http://builder.hypersync.xyz)** - Use our Intuitive Query Builder
- [curl Examples](/docs/HyperSync/hypersync-curl-examples) - Test queries directly in your terminal
- [Complete Getting Started Guide](/docs/HyperSync/hypersync-usage) - More comprehensive guidance

## API Token for Production Use

For development, you can use HyperSync without an API token. For production applications, you'll need to [get an API token](/docs/HyperSync/api-tokens) and update your client initialization:

```javascript
const client = HypersyncClient.new({
  url: "http://eth.hypersync.xyz",
  bearerToken: "your-api-token-here",
});
```

Congratulations! You've taken your first steps with HyperSync, bringing ultra-fast blockchain data access to your applications. Happy building!
