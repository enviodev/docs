---
id: overview
title: "HyperIndex: Fast Multichain Indexer"
sidebar_label: Overview
slug: /overview
description: Explore HyperIndex, a blazing-fast multichain indexer for real-time blockchain data.
---

<Head>
  <meta name="og:image" content="/img/preview-banner.png" />
  <meta name="twitter:image" content="/img/preview-banner.png" />
</Head>


**HyperIndex** is a blazing-fast, developer-friendly multichain indexer, optimized for both local development and reliable hosted deployment. It empowers developers to effortlessly build robust backends for blockchain applications.

![Sync Process](../../static/img/sync.gif)

:::info HyperIndex & HyperSync

**HyperIndex** is Envio's full-featured blockchain indexing framework that transforms on-chain events into structured, queryable databases with GraphQL APIs.

**HyperSync** is the high-performance data engine that powers HyperIndex. It provides the raw blockchain data access layer, delivering up to 2000x faster performance than traditional RPC endpoints.

While HyperIndex gives you a complete indexing solution with schema management and event handling, HyperSync can be used directly for custom data pipelines and specialized applications.
:::

---

## Key Features

- **[Quickstart templates](/docs/HyperIndex/greeter-tutorial)** – Rapidly bootstrap your indexer.
- **[Real-time indexing](/docs/HyperIndex/latency-at-head)** – Instantly track blockchain events.
- **[Multichain indexing](/docs/HyperIndex/multichain-indexing)** – Supports multiple blockchains simultaneously.
- **[Local development](/docs/HyperIndex/running-locally)** – Full-featured local environment with Docker.
- **[Reorg support](/docs/HyperIndex/reorgs-support)** – Gracefully handles blockchain reorganizations.
- **[GraphQL API](/docs/HyperIndex/navigating-hasura)** – Easy-to-query indexed data.
- **[Cross-platform support](/docs/HyperIndex/supported-networks)** – Index any EVM-compatible blockchain and Fuel.
- **[High performance](/docs/HyperIndex/benchmarking)** – Historical backfills at over 5,000+ events per second.
- **[Indexer auto-generation](/docs/HyperIndex/contract-import)** – Generate indexers directly from smart contract addresses.
- **[Flexible language support](/docs/HyperIndex/terminology#programming-languages)** – JavaScript, TypeScript, and ReScript.
- **[Factory contract support](/docs/HyperIndex/dynamic-contracts)** – Index data from 100,000+ factory contracts seamlessly.
- **[On-chain & off-chain data integration](/docs/HyperIndex/contract-state)** – Easily combine multiple data sources.
- **[Self-hosted & managed options](/docs/HyperIndex/hosted-service)** – Run your own setup or use HyperIndex hosted services.
- **[Detailed logging & error reporting](/docs/HyperIndex/logging)** – Debug and optimize with clarity.
- **[External API actions](/docs/HyperIndex/ipfs)** – Trigger external services based on blockchain events.
- **[Wildcard topic indexing](/docs/HyperIndex/wildcard-indexing)** – Flexible indexing based on event topics.
- **[Fallback RPC data sources](/docs/HyperIndex/rpc-sync#improving-resilience-with-rpc-fallback)** – Enhanced reliability with RPC connections.

---

## HyperSync API Token Requirements

HyperSync (the data engine powering HyperIndex) implements rate limits for requests without API tokens. API tokens will be required from **3 November 2025**. Here's what you need to know:

- **Local Development**: An API token will be required. An automatic login feature from the CLI will be available to make this smoother.
- **Self-Hosted Deployments**: API tokens are required for HyperSync access in self-hosted deployments. The token can be set via the `ENVIO_API_TOKEN` environment variable in your indexer configuration. This can be read from the `.env` file in the root of your HyperIndex project.
- **Hosted Service**: Indexers deployed to our hosted service will have special access that doesn't require a custom API token.
- **Future Pricing**: From mid-November 2025 onwards, we will introduce tiered packages for those self-hosting hyperindex and wishing to use hypersync. For preferred introductory pricing based on your specific use case, reach out to us on [Discord](https://discord.gg/Q9qt8gZ2fX).

For more details about API tokens, including how to generate and implement them, see our [API Tokens documentation](/docs/HyperSync/api-tokens).

---

## Feature Roadmap

Upcoming features on our development roadmap:

- **Clickhouse Integration**
- **Solana Slot Handler**
- **New Testing Framework**
- **Isolated Multichain Mode**
- **Top Level Await Support**

---

## 🔗 Quick Links

- [GitHub Repository](https://github.com/enviodev/hyperindex) ⭐
- [Join our Discord Community](https://discord.gg/Q9qt8gZ2fX)
