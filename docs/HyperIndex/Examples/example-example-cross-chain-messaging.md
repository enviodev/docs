---
id: example-cross-chain-messaging
title: Cross-Chain Messaging
sidebar_label: Cross-Chain Messaging
slug: /example-cross-chain-messaging
description: Explore cross-chain messaging and track events across multiple chains efficiently.
---

# Cross-Chain Messaging Indexer

This blockchain indexer demonstrates how to track and index cross-chain messaging protocols at scale, providing a complete view of message passing across multiple blockchains.

:::warning Targets HyperIndex V2
This example links to a third-party community repository that targets HyperIndex **V2** and is now archived (last updated December 2024), so it does not reflect current V3 APIs. We keep it here as a conceptual reference for cross-chain indexing patterns. If you are starting a new project, build on the current [V3 docs](/docs/HyperIndex/overview) and see [Migrate to V3](/docs/HyperIndex/migrate-to-v3) for the latest syntax.
:::

## Overview

The [ORMP Indexer](https://github.com/ringecosystem/ormpexer/tree/main) showcases advanced multichain indexing techniques for tracking cross-chain communication. It offers a practical example of how to:

- Monitor message passing across 14 different EVM-compatible blockchains
- Combine both HyperSync and RPC data sources for optimal performance
- Create a unified data model for cross-chain events
- Build a scalable indexing solution for complex cross-chain applications

## Key Features

- Comprehensive tracking of cross-chain message delivery and execution
- Efficient data collection using a hybrid approach (HyperSync + RPC)
- Well-structured GraphQL API for querying cross-chain messaging data
- Example implementation that can be adapted for other cross-chain protocols

## Use Cases

This blockchain indexer can serve as a foundation for applications requiring visibility into cross-chain operations, including:

- Cross-chain bridges and token transfer monitoring
- Multichain DeFi dashboards
- Cross-chain governance systems
- Message delivery verification tools

:::note
This blockchain indexer was built by Envio partners and community builders. As noted above it targets HyperIndex V2 and is no longer maintained, so always perform appropriate testing and data validation, and follow the current V3 docs, before using these patterns in production.
:::
