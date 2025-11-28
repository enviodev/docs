---
id: tutorial-erc20-token-transfers
title: Indexing ERC20 Token Transfers on Base
sidebar_label: Indexing ERC20 Token Transfers on Base
slug: /tutorial-erc20-token-transfers
description: Learn how to index and query USDC ERC20 transfers on Base using Envio.
---

## Introduction

In this tutorial, you'll learn how to index ERC20 token transfers on the Base network using Envio HyperIndex. By leveraging the no-code [contract import](https://docs.envio.dev/docs/HyperIndex/contract-import) feature, you'll be able to quickly analyze USDC transfer activity, including identifying the largest transfers.

We'll create an indexer that tracks all USDC token transfers on Base by extracting the `Transfer` events emitted by the USDC contract. The entire process takes less than 5 minutes to set up and start querying data.

<iframe width="560" height="315" src="https://www.youtube.com/embed/e1xznmKBLa8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prerequisites

Before starting, ensure you have the following installed:

- **[Node.js](https://nodejs.org/en/download/current)** _(v22 or newer recommended)_
- **[pnpm](https://pnpm.io/installation)** _(v8 or newer)_
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** _(required to run the Envio indexer locally)_

> **Note:** Docker is specifically required to run your indexer locally. You can skip Docker installation if you plan only to use Envio's hosted service.

## Step 1: Initialize Your Indexer

1. Open your terminal in an empty directory and run:

```bash
pnpx envio init
```

2. Name your indexer (we'll use "usdc-base-transfer-indexer" in this example):

<img src="/docs-assets/tutorial-base-erc20-transfer-2.png" alt="Naming your indexer" width="100%"/>

3. Choose your preferred language (TypeScript, JavaScript, or ReScript):

<img src="/docs-assets/tutorial-base-erc20-transfer-3.png" alt="Selecting TypeScript" width="100%"/>

## Step 2: Import the USDC Token Contract

1. Select **Contract Import** → **Block Explorer** → **Base**

2. Enter the USDC token contract address on Base:

   ```
   0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
   ```

   [View on BaseScan](https://basescan.org/address/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)

3. Select the `Transfer` event:
   - Navigate using arrow keys (↑↓)
   - Press spacebar to select the event

<img src="/docs-assets/tutorial-base-erc20-transfer-4.png" alt="Selecting Transfer event" width="100%"/>

> **Tip:** You can select multiple events to index simultaneously if needed.

4. When finished adding contracts, select **I'm finished**

<img src="/docs-assets/tutorial-base-erc20-transfer-5.png" alt="Completing contract import" width="100%"/>

## Step 3: Start Your Indexer

1. If you have any running indexers, stop them first:

```bash
pnpm envio stop
```

> **Note:** You can skip this step if this is your first time running an indexer.

2. Start your new indexer:

```bash
pnpm dev
```

This command:

- Starts the required Docker containers
- Sets up your database
- Launches the indexing process
- Opens the Hasura GraphQL interface

## Step 4: Understanding the Generated Code

Let's examine the key files that Envio generated:

### 1. `config.yaml`

This configuration file defines:

- Network to index (Base)
- Starting block for indexing
- Contract address and ABI details
- Events to track (Transfer)

<img src="/docs-assets/tutorial-base-erc20-transfer-6.png" alt="Config YAML file" width="100%"/>

### 2. `schema.graphql`

This schema defines the data structures for the Transfer event:

- Entity types based on event data
- Field types for sender, receiver, and amount
- Any relationships between entities

<img src="/docs-assets/tutorial-base-erc20-transfer-7.png" alt="GraphQL schema file" width="100%"/>

### 3. `src/EventHandlers.*`

This file contains the business logic for processing events:

- Functions that execute when Transfer events are detected
- Data transformation and storage logic
- Entity creation and relationship management

<img src="/docs-assets/tutorial-base-erc20-transfer-8.png" alt="Event handlers file" width="100%"/>

## Step 5: Exploring Your Indexed Data

Now you can interact with your indexed USDC transfer data:

### Accessing Hasura

1. Open Hasura at [http://localhost:8080](http://localhost:8080)
2. When prompted, enter the admin password: `testing`

<img src="/docs-assets/tutorial-base-erc20-transfer-9.png" alt="Hasura login" width="100%"/>

### Monitoring Indexing Progress

1. Click the **Data** tab in the top navigation
2. Find the `_events_sync_state` table to check indexing progress
3. Observe which blocks are currently being processed

<img src="/docs-assets/tutorial-base-erc20-transfer-10.png" alt="Indexing progress" width="100%"/>

> **Note:** Thanks to Envio's [HyperSync](https://docs.envio.dev/docs/hypersync), you can index millions of USDC transfers in just minutes rather than hours or days with traditional methods.

### Querying Indexed Events

1. Click the **API** tab
2. Construct a GraphQL query to explore your data

Here's an example query to fetch the 10 largest USDC transfers:

```graphql
query LargestTransfers {
  FiatTokenV2_2_Transfer(limit: 10, order_by: { value: desc }) {
    from
    to
    value
    blockTimestamp
  }
}
```

3. Click the **Play** button to execute your query

<img src="/docs-assets/tutorial-base-erc20-transfer-11.png" alt="Query results" width="100%"/>

## Conclusion

Congratulations! You've successfully created an indexer for USDC token transfers on Base. In just a few minutes, you've indexed over 3.6 million transfer events and can now query this data in real-time.

### What You've Learned

- How to initialize an indexer using Envio's contract import feature
- How to index ERC20 token transfers on the Base network
- How to query and analyze token transfer data using GraphQL

### Next Steps

- Try customizing the event handlers to add additional logic
- Create aggregated statistics about token transfers
- Add more tokens or events to your indexer
- Deploy your indexer to Envio's hosted service

For more tutorials and advanced features, check out our [documentation](https://docs.envio.dev) or watch our [video walkthrough](https://www.youtube.com/watch?v=e1xznmKBLa8) on YouTube.
