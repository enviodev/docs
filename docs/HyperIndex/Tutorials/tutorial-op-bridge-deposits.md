---
id: tutorial-op-bridge-deposits
title: Indexing Optimism Bridge Deposits
sidebar_label: Indexing OP Bridge Deposits
slug: /tutorial-op-bridge-deposits
---

# Indexing Optimism Bridge Deposits

## Introduction

This tutorial will guide you through indexing Optimism Standard Bridge deposits in under 5 minutes using Envio HyperIndex's no-code [contract import](https://docs.envio.dev/docs/HyperIndex/contract-import) feature.

The Optimism Standard Bridge enables the movement of ETH and ERC-20 tokens between Ethereum and Optimism. We'll index bridge deposit events by extracting the `DepositFinalized` logs emitted by the bridge contracts on both networks.

<iframe width="560" height="315" src="https://www.youtube.com/embed/9U2MTFU9or0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prerequisites

Before starting, ensure you have the following installed:

- **[Node.js](https://nodejs.org/en/download/current)** _(v18 or newer recommended)_
- **[pnpm](https://pnpm.io/installation)** _(v8 or newer)_
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** _(required to run the Envio indexer locally)_

> **Note:** Docker is specifically required to run your indexer locally. You can skip Docker installation if you plan only to use Envio's hosted service.

## Step 1: Initialize Your Indexer

1. Open your terminal in an empty directory and run:

```bash
pnpx envio init
```

2. Name your indexer (we'll use "optimism-bridge-indexer" in this example):

<img src="/docs-assets/tutorial-op-bridge-2.png" alt="Naming your indexer" width="100%"/>

3. Choose your preferred language (TypeScript, JavaScript, or ReScript):

<img src="/docs-assets/tutorial-op-bridge-3.png" alt="Selecting TypeScript" width="100%"/>

## Step 2: Import the Optimism Bridge Contract

1. Select **Contract Import** → **Block Explorer** → **Optimism**

2. Enter the Optimism bridge contract address:

   ```
   0x4200000000000000000000000000000000000010
   ```

   [View on Optimistic Etherscan](https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000010)

3. Select the `DepositFinalized` event:
   - Navigate using arrow keys (↑↓)
   - Press spacebar to select the event

<img src="/docs-assets/tutorial-op-bridge-4.png" alt="Selecting DepositFinalized event" width="100%"/>

> **Tip:** You can select multiple events to index simultaneously.

## Step 3: Add the Ethereum Mainnet Bridge Contract

1. When prompted, select **Add a new contract**

2. Choose **Block Explorer** → **Ethereum Mainnet**

3. Enter the Ethereum Mainnet gateway contract address:

   ```
   0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1
   ```

   [View on Etherscan](https://etherscan.io/address/0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)

4. Select the `ETHDepositInitiated` event

5. When finished adding contracts, select **I'm finished**

<img src="/docs-assets/tutorial-op-bridge-6.png" alt="Completing contract import" width="100%"/>

## Step 4: Start Your Indexer

1. If you have any running indexers, stop them first:

```bash
pnpm envio stop
```

2. Start your new indexer:

```bash
pnpm dev
```

This command:

- Starts the required Docker containers
- Sets up your database
- Launches the indexing process
- Opens the Hasura GraphQL interface

## Step 5: Understanding the Generated Code

Let's examine the key files that Envio generated:

### 1. `config.yaml`

This configuration file defines:

- Networks to index (Optimism and Ethereum Mainnet)
- Starting blocks for each network
- Contract addresses and ABIs
- Events to track

<img src="/docs-assets/tutorial-op-bridge-7.png" alt="Config YAML file" width="100%"/>

### 2. `schema.graphql`

This schema defines the data structures for our selected events:

- Entity types based on event data
- Field types matching the event parameters
- Relationships between entities (if applicable)

<img src="/docs-assets/tutorial-op-bridge-8.png" alt="GraphQL schema file" width="100%"/>

### 3. `src/EventHandlers.ts`

This file contains the business logic for processing events:

- Functions that execute when events are detected
- Data transformation and storage logic
- Entity creation and relationship management

<img src="/docs-assets/tutorial-op-bridge-9.png" alt="Event handlers file" width="100%"/>

## Step 6: Exploring Your Indexed Data

Now you can interact with your indexed data:

### Accessing Hasura

1. Open Hasura at [http://localhost:8080](http://localhost:8080)
2. When prompted, enter the admin password: `testing`

### Monitoring Indexing Progress

1. Click the **Data** tab in the top navigation
2. Find the `_events_sync_state` table to check indexing progress
3. Observe which blocks are currently being processed

<img src="/docs-assets/tutorial-op-bridge-11.png" alt="Indexing progress" width="100%"/>

> **Note:** Thanks to Envio's [HyperSync](https://docs.envio.dev/docs/hypersync), indexing happens significantly faster than with standard RPC methods.

### Querying Indexed Events

1. Click the **API** tab
2. Construct a GraphQL query to explore your data

Here's an example query to fetch the 10 largest bridge deposits:

```graphql
query LargestDeposits {
  DepositFinalized(limit: 10, order_by: { amount: desc }) {
    l1Token
    l2Token
    from
    to
    amount
    blockTimestamp
  }
}
```

3. Click the **Play** button to execute your query

<img src="/docs-assets/tutorial-op-bridge-13.png" alt="Query results" width="100%"/>

## Conclusion

Congratulations! You've successfully created an indexer for Optimism Bridge deposits across both Ethereum and Optimism networks.

### What You've Learned

- How to initialize a multi-network indexer using Envio
- How to import contracts from different blockchains
- How to query and explore indexed blockchain data

### Next Steps

- Try customizing the event handlers to add additional logic
- Create relationships between events on different networks
- Deploy your indexer to Envio's hosted service

For more tutorials and advanced features, check out our [documentation](https://docs.envio.dev) or watch our [video walkthroughs](https://www.youtube.com/watch?v=9U2MTFU9or0) on YouTube.
