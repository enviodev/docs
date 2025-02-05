---
id: tutorial-erc20-token-transfers
title: Indexing ERC20 Token Transfers on Base
sidebar_label: Indexing ERC20 Token Transfers on Base
slug: /tutorial-erc20-token-transfers
---

# Indexing ERC20 Token Transfers on Base

In this tutorial, we'll walk you through the process of quickly and efficiently indexing ERC20 token transfers on the Base network using Envio HyperIndex and no-code [contract import](https://docs.envio.dev/docs/HyperIndex/contract-import) feature, providing real-time insights into metrics such as the largest USDC transfers.

The goal is to create an indexer that tracks and analyzes all USDC token transfers on Base by extracting the `Transfer (index_topic_1 address from, index_topic_2 address to, uint256 value)` logs emitted by the USDC contract.

<iframe width="560" height="315" src="https://www.youtube.com/embed/e1xznmKBLa8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prerequisites

Before we start indexing, you'll need to make sure you have the [prerequisites](https://docs.envio.dev/docs/getting-started) installed.

## Initializing an Indexer

Now that you’re all set up and have installed the prerequisite packages required, let’s jump into the practical steps of initializing the indexer and generating a boilerplate index to index the largest USDC token transfers on Base.

1. Open your terminal in an empty repository and run the command ‘**pnpx envio init.**’

<img src="/docs-assets/tutorial-base-erc20-transfer-1.png" alt="tutorial-base-erc20-transfer-1" width="100%"/>

2. Name your indexer anything you’d like (e.g., “**usdc-base-transfer-indexer”**).

<img src="/docs-assets/tutorial-base-erc20-transfer-2.png" alt="tutorial-base-erc20-transfer-2" width="100%"/>

3. Choose your preferred language (e.g., TypeScript) and select “contract import.”

<img src="/docs-assets/tutorial-base-erc20-transfer-3.png" alt="tutorial-base-erc20-transfer-3" width="100%"/>

> Note: Indexers on Envio can be written in JavaScript, TypeScript, or ReScript.

4. Select `Block Explorer` then navigate to `Base`, and head over to [Basescan](https://basescan.org/), copy and paste the existing contract address, and choose the events you’d like to index. In this example, we’ll be indexing the `Transfer` event.

To select an event navigate using the arrow keys (↑ ↓) and click the space bar once you have made your choice.

> Note: Multiple events can be selected and indexed at the same time.

USDC Token Contract address: [0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913](https://basescan.org/address/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)

<img src="/docs-assets/tutorial-base-erc20-transfer-4.png" alt="tutorial-base-erc20-transfer-4" width="100%"/>

5. Finally, review the configuration and select `I’m finished` to start generating the indexer.

<img src="/docs-assets/tutorial-base-erc20-transfer-5.png" alt="tutorial-base-erc20-transfer-5" width="100%"/>

## Starting the Indexer

Before starting your indexer, run the command below to ensure that no conflicting indexers are running.

### Stopping the indexer

`pnpm envio stop`

> Note: Ignore if you’re a first-time user.

### Start the indexer

`pnpm dev`

Now, let's run our indexer locally by running the command below.

## Overview of Generated Code

Once that’s all done we can take a peek at the files generated by Envio in our source-code editor, in this example, we’re using [VS Code](https://code.visualstudio.com/) (Visual Code Studio).

1. **config.yaml**

This file defines the network, start block, contract address, and events we want to index on Base.

<img src="/docs-assets/tutorial-base-erc20-transfer-6.png" alt="tutorial-base-erc20-transfer-6" width="100%"/>

2. **Schema.graphql**

This file saves and defines the data structures for selected events, such as the `Transfer` event.

<img src="/docs-assets/tutorial-base-erc20-transfer-7.png" alt="tutorial-base-erc20-transfer-7" width="100%"/>

3. **event-handler**

This file defines what happens when an event is emitted and saves what code is going to run, allowing customization in data handling.

<img src="/docs-assets/tutorial-base-erc20-transfer-8.png" alt="tutorial-base-erc20-transfer-8" width="100%"/>

## Exploring the Indexed Data

Well done champions, now let’s explore the indexed data.

1. Head over to Hasura, type in the admin-secret password (“**testing**”), and click “API” in the above column to access the GraphQL endpoint to query real-time data.

<img src="/docs-assets/tutorial-base-erc20-transfer-9.png" alt="tutorial-base-erc20-transfer-9" width="100%"/>

2. Navigate to “Data” in the above column to monitor the indexing progress on Base through the events sync state table to see which block number you are on.

<img src="/docs-assets/tutorial-base-erc20-transfer-10.png" alt="tutorial-base-erc20-transfer-10" width="100%"/>

3. Now let’s analyze some events. Simply head back to “API” in the above column. From there you can run a query-specific event, in this example "**FiatTokenV2_2 Transfer**" to explore details such as amounts, senders, recipients and values.

_Once you have selected your desired events run the query by clicking the play button ( ▶️) to gain access to the real-time indexed data_

**For example:**

Let’s look at getting 10 `FiatTokenV2_2 Transfer` events, and order them by the amount we would like to appear first (in this case: desc = largest amount), who it’s from, who it’s to, and the value being transferred.

<img src="/docs-assets/tutorial-base-erc20-transfer-11.png" alt="tutorial-base-erc20-transfer-11" width="100%"/>

Run queries to explore specific events, such as the largest USDC transfers.

## Conclusion

Congratulations! You've successfully generated an indexer and indexed 3.6 million USDC token transfer events in under 5 minutes on Base.

Be sure to check out our [video walkthrough](https://www.youtube.com/watch?v=e1xznmKBLa8&t=572s) on YouTube, including other tutorials that showcase Envio’s indexing features and capabilities.
