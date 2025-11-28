---
id: overview
title: HyperSync
sidebar_label: Overview
slug: /overview
description: Explore HyperSync for ultra-fast blockchain data access and flexible queries across 70+ networks.
---

# HyperSync: Ultra-Fast & Flexible Data API

## What is HyperSync?

HyperSync is a purpose-built, high-performance data retrieval layer that gives developers unprecedented access to blockchain data. Built from the ground up in Rust, HyperSync serves as an alternative to traditional JSON-RPC endpoints, offering dramatically faster queries and more flexible data access patterns.

:::info HyperSync & HyperIndex

**HyperSync** is Envio's high-performance blockchain data engine that serves as a direct replacement for traditional RPC endpoints, delivering up to 2000x faster data access.

**HyperIndex** is built on top of HyperSync, providing a complete indexing framework with schema management, event handling, and GraphQL APIs.

Use HyperSync directly when you need raw blockchain data at maximum speed, or use HyperIndex when you need a full-featured indexing solution.
:::

## The Problem HyperSync Solves

Traditional blockchain data access through JSON-RPC faces several limitations:

- **Speed constraints**: Retrieving large amounts of historical data can take days
- **Query flexibility**: Complex data analysis requires many separate calls
- **Cost inefficiency**: Expensive for data-intensive applications

## Key Benefits

- **Exceptional Performance**: Retrieve and process blockchain data up to 1000x faster than traditional RPC methods
- **Comprehensive Coverage**: Access data across [70+ EVM chains](/docs/HyperSync/hypersync-supported-networks) and Fuel, with new networks added regularly
- **Flexible Query Capabilities**: Filter, select, and process exactly the data you need with powerful query options
- **Cost Efficiency**: Dramatically reduce infrastructure costs for data-intensive applications
- **Simple Integration**: Client libraries available for Python, Rust, Node.js, and Go

## Performance Benchmarks

HyperSync delivers transformative performance compared to traditional methods:

| Task                                             | Traditional RPC | HyperSync | Improvement   |
| ------------------------------------------------ | --------------- | --------- | ------------- |
| Scan Arbitrum blockchain for sparse log data     | Hours/Days      | 2 seconds | ~2000x faster |
| Fetch all Uniswap v3 PoolCreated events ethereum | Hours           | Seconds   | ~500x faster  |

## Use Cases

HyperSync powers a wide range of blockchain applications, enabling developers to build tools that would be impractical with traditional data access methods:

### General Applications

- **Indexers**: Build high-performance data indexers with minimal infrastructure
- **Data Analytics**: Perform complex on-chain analysis in seconds instead of days
- **Block Explorers**: Create responsive explorers with comprehensive data access
- **Monitoring Tools**: Track blockchain activity with near real-time updates
- **Cross-chain Applications**: Access unified data across multiple networks
- **ETL Pipelines**: Create pipelines to extract and save data fast

### Powered by HyperSync

#### [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview)

- **100x faster blockchain indexing** across 70+ EVM chains and Fuel
- **Powers 100 plus applications** like v4.xyz analytics

#### [ChainDensity.xyz](https://chaindensity.xyz)

- **Fast transaction/event density analysis** for any address
- **Generates insights in seconds** that would take hours with traditional methods

#### [Scope.sh](https://scope.sh)

- **Ultra-fast Account Abstraction (AA) focused block explorer**
- **Fast historical data retrieval** with minimal latency

#### [LogTUI](https://www.npmjs.com/package/logtui)

- **Terminal-based UI** for finding all historical blockchain events
- **Built-in presets** for 20+ protocols (Uniswap, Chainlink, Aave, ENS, etc.)
- **Try it**: `pnpx logtui aave arbitrum` to track Aave events on Arbitrum in your terminal

## See HyperSync in Action

<iframe width="560" height="315" src="https://www.youtube.com/embed/iu_469ELotw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Next Steps

- **[Try the Quick Start Guide](/docs/HyperSync/hypersync-quickstart)** to get up and running in minutes
- **[Build queries visually](http://builder.hypersync.xyz)** with our Intuitive Query Builder
- [Get an API Token](/docs/HyperSync/api-tokens) to access HyperSync services
- [View Supported Networks](/docs/HyperSync/hypersync-supported-networks) to see available chains
- [Check Client Documentation](/docs/HyperSync/hypersync-clients) for language-specific guides
- [Join our Discord](https://discord.gg/Q9qt8gZ2fX) for support and updates

:::note
Our documentation is continuously improving! If you have questions or need assistance, please reach out in our [Discord community](https://discord.gg/Q9qt8gZ2fX).
:::
