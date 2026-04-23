---
title: Fast Data Indexing on Fuel using Envio
sidebar_label: Fast Data Indexing on Fuel using Envio
slug: /fast-data-indexing-on-fuel-using-envio
description: "Learn how Envio brings fast data indexing to Fuel Network so developers can query real-time and historical onchain data with speed and simplicity."
image: /blog-assets/fuel-envio.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/fuel-envio.png" alt="Cover Image Data Querying on Fuel" width="100%"/>

<!--truncate-->

:::note TL;DR
- The Fuel Network is a high-performance Ethereum rollup OS with the FuelVM and the Sway programming language, purpose-built for parallel execution and scalable dApps.
- Envio supports Fuel with two products: HyperFuel (fast raw data access) and HyperIndex (full GraphQL indexing framework with hosted deployment).
- Unlike The Graph (EVM-only, separate subgraph per chain), Envio's single-config approach supports both Fuel and EVM chains from one indexer.
:::

The [Fuel Network](https://fuel.network/) addresses Ethereum's scalability challenges with a parallelized execution environment and state-minimized architecture. Envio provides the data infrastructure layer for Fuel, giving developers and data analysts efficient access to real-time and historical onchain data through a modular indexing stack.

In this blog, we explore how developers and data analysts can leverage Envio's data stack to index and query data on the Fuel Network.

## What is the Fuel Network?

The [Fuel Network](https://fuel.network/) is a high-performance, modular blockchain infrastructure designed to support scalable and efficient dApps. It combines the Fuel Virtual Machine ([FuelVM](https://docs.fuel.network/docs/intro/what-is-fuel/)) with Optimistic Rollup technology to achieve high transaction throughput and low fees. Fuel also introduces [Sway](https://docs.fuel.network/docs/sway/), a strongly-typed language inspired by Rust designed for smart contract development.

At the heart of Fuel is the FuelVM: an execution environment parallelized for maximum throughput and state-minimized for sustainable state growth. For a technical deep dive into Fuel's architecture, see the [Fuel blog](https://fuel.mirror.xyz/uQxyb1o_Gu4oBSyT1ULuqRu7ffmIXuZtx9ux8ndFMXs).

## What Envio supports on the Fuel Network

### HyperFuel

Envio's [HyperFuel](https://docs.envio.dev/docs/HyperSync/hyperfuel) is a version of [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) specifically adapted for the Fuel Network. It provides a low-level API for developers and data analysts to run flexible, filtered, high-speed queries for smart contract data and large datasets.

HyperFuel acts as a high-performance real-time data archive that accelerates data retrieval on Fuel, enabling efficient parsing, querying, and analysis of Fuel data.

Developers and data analysts can interact with the HyperFuel API using JavaScript, Python, or Rust [clients](https://github.com/enviodev/hyperfuel-json-api), and choose to output data in JSON, Arrow, and Parquet formats.

With HyperFuel, developers can sync large datasets in minutes, eliminating the need to use slow or rate-limited node endpoints. HyperFuel is ideal for developers building dApps, block explorers, wallets, analytics tools, and other data-heavy use cases on Fuel.

### HyperIndex

Envio's [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) is a developer-first, real-time data indexing framework for rapidly building custom GraphQL APIs for smart contract data on Fuel.

[Contract Import](https://docs.envio.dev/docs/HyperIndex/contract-import) is the fastest starting point for most Fuel developers: supply your contract ABI, select the events you want to index, and follow the CLI prompts to generate your first indexer in under a minute.

For a detailed tutorial, see the [Sway Farm indexer tutorial](https://docs.envio.dev/docs/HyperIndex/tutorial-indexing-fuel), which walks through creating an indexer for a real-world onchain farming game on Fuel.

Fuel teams can host their indexer on [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service), a managed platform with guaranteed uptime, so teams can focus on their application rather than infrastructure.

Unlike The Graph (which supports EVM chains only and requires a separate subgraph per network) or Goldsky (which requires separate pipelines), Envio uses a single `config.yaml` for all networks and exposes a single GraphQL endpoint across all chains.

## Data indexer use cases on Fuel using Envio

- [Data Indexer](https://github.com/compolabs/spark-envio-indexer) for [Spark](https://sprk.fi/), a DeFi super app with perpetual contracts, an orderbook, and lending and borrowing features.
- [Data Indexer](https://github.com/enviodev/fuel-thunder-exchange/tree/main) for [Thunder](https://thundernft.market/), an NFT marketplace allowing multiple NFT purchases in a single transaction thanks to Fuel's parallel execution.

## Relevant resources

- [Envio Tutorial: Indexing Sway Farm on the Fuel Network](https://docs.envio.dev/docs/HyperIndex/tutorial-indexing-fuel)
- [Envio HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/getting-started)
- [Envio HyperFuel](https://docs.envio.dev/docs/HyperSync/hyperfuel)
- [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service)

## Frequently asked questions

### What is the difference between HyperFuel and HyperIndex for Fuel development?

HyperFuel is a low-level raw data API for fetching large volumes of Fuel data quickly, suited for custom pipelines and analytics. HyperIndex is a full indexing framework that transforms onchain events into a structured database with a GraphQL API, suited for dApp backends. Many Fuel developers use both.

### Can I use TypeScript to write my Fuel indexer with Envio?

Yes. HyperIndex event handlers are written in TypeScript (JavaScript is also supported). You define your schema in `schema.graphql`, your network config in `config.yaml`, and your handler logic in TypeScript files.

### Does Envio support the Fuel Sway programming language?

Envio indexes the events and logs emitted by Sway contracts on Fuel. You provide the contract ABI (which represents the contract interface) and Envio handles the rest. Sway-specific data types are supported through the HyperFuel and HyperIndex ABIs.

### How does Envio compare to other indexing options for Fuel?

The Graph does not support Fuel. Envio is purpose-built for Fuel with HyperFuel for raw data access and HyperIndex for GraphQL indexing. Envio Cloud includes GitHub-based auto-deployment and managed infrastructure, which is not available from alternatives.

### Is Envio free to use for Fuel indexers?

Envio offers a free development tier for hosted indexers. You can also run indexers locally for free using Docker and `pnpm dev`. Production tiers are available for teams that need guaranteed uptime SLAs.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
