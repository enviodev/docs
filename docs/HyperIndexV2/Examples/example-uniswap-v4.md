---
id: example-uniswap-v4
title: Uniswap V4 Multichain indexer
sidebar_label: UniswapV4 (DEX) ⭐ Recommended
slug: /example-uniswap-v4-multi-chain-indexer
description: Explore real-time Uniswap V4 data across multiple chains with Envio.
---

# Uniswap V4 Multichain Indexer

The following blockchain indexer example is a reference implementation and can serve as a starting point for applications with similar logic.

This [official Uniswap V4 indexer](https://github.com/enviodev/uniswap-v4-indexer) is a comprehensive implementation for the Uniswap V4 protocol using Envio HyperIndex. This is the same indexer that powers the [v4.xyz](https://v4.xyz) website, providing real-time data for the Uniswap V4 interface.

## Key Features

- **Multichain Support**: Indexes Uniswap V4 deployments across 10 different blockchain networks in real-time
- **Complete Pool Metrics**: Tracks pool statistics including volume, TVL, fees, and other critical metrics
- **Swap Analysis**: Monitors swap events and liquidity changes with high precision
- **Hook Integration**: In-progress support for Uniswap V4 hooks and their events
- **Production Ready**: Powers the official v4.xyz interface with production-grade reliability
- **Ultra-Fast Syncing**: Processes massive amounts of blockchain data significantly faster than alternative blockchain indexing solutions, reducing sync times from days to minutes

![V4 gif](/img/v4.gif)

## Technical Overview

This indexer is built using TypeScript and provides a unified GraphQL API for accessing Uniswap V4 data across all supported networks. The architecture is designed to handle high throughput and maintain consistency across different blockchain networks.

### Performance Advantages

The Envio-powered Uniswap V4 indexer offers extraordinary performance benefits:

- **10-100x Faster Sync Times**: Leveraging Envio's HyperSync technology, this indexer can process historical blockchain data orders of magnitude faster than traditional solutions
- **Real-time Updates**: Maintains low latency for new blocks while efficiently managing historical data

## Use Cases

- Power analytics dashboards and trading interfaces
- Monitor DeFi positions and protocol health
- Track historical performance of Uniswap V4 pools
- Build custom notifications and alerts
- Analyze hook interactions and their impact

## Getting Started

To use this indexer, you can:

1. Clone the [repository](https://github.com/enviodev/uniswap-v4-indexer)
2. Follow the installation instructions in the README
3. Run the indexer locally or deploy it to a production environment
4. Access indexed data through the GraphQL API

## Contribution

The Uniswap V4 indexer is actively maintained and welcomes contributions from the community. If you'd like to contribute or report issues, please visit the [GitHub repository](https://github.com/enviodev/uniswap-v4-indexer).

:::note
This is an official reference implementation that powers the v4.xyz website. While extensively tested in production, remember to validate the data for your specific use case. The indexer is continuously updated to support the latest Uniswap V4 features and optimizations.
:::
