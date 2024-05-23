---
title: How Peppy Finance uses Envio to power its Perpetual Future Markets with Real-Time Data Indexing
sidebar_label: How Peppy Finance uses Envio to power its Perpetual Future Markets with Real-Time Data Indexing
slug: /envio-real-time-indexing-powers-peppy-finance
---

<img src="/blog-assets/case-study-peppy-finance.png" alt="Cover Image for Case Study peppy Finance" width="100%"/>

<!--truncate-->

Legend has it that there is a pot of gold at the end of every rainbow. We’re extremely excited to announce that [Peppy Finance](https://www.peppy.finance/) has integrated [Envio](https://envio.dev/)’s blockchain data indexing capabilities to power its decentralized perpetual future swap exchange on the [Shimmer Network](https://shimmer.network/).

By utilizing Envio’s modern blockchain indexing, Peppy Finance has overcome its challenges with serving real-time data and can now deliver a seamless user experience to its end users. Leveraging TypeScript directly, Envio's indexing framework offers Peppy Finance a straightforward development experience and streamlines the process of accessing, organizing, and querying real-time and historical data for its decentralized perpetual swaps.

# What is Peppy Finance?

Peppy Finance is a decentralized perpetual exchange built on the [Shimmer Network](https://shimmer.network/) from [IOTA](https://www.iota.org/) that allows you to trade BTC, ETH and native Shimmer tokens with up to 100x leverage directly from your wallet. The advantages of using Peppy Finance include:

- **On-chain collateral**: Provides greater assurance that the funds are there to back the contracts.
- **Save on Costs**: Get the lowest transaction fees combined with affordable borrowing rates.
- **Non-custodia**l: Have full control over your assets, minimizing the risk associated with centralization.

## About the Integration

Before integrating Envio, Peppy Finance’s commitment to providing a seamless user experience was hindered by its existing data setup, which utilized TheGraph for data indexing. Peppy Finance faced challenges with data latency—specifically, the time between transaction settlement and data availability on their front end—sometimes experiencing a 10-20 second delay.

As an interim workaround, Peppy Finance implemented custom event listeners that queried an RPC endpoint and merged this live data with the historical data from their indexer, necessitating a significant amount of additional code.

## How Envio Solved This Problem?

Envio's indexing framework, [HyperIndex](https://docs.envio.dev/docs/overview), is designed with out-of-the-box support for building custom APIs for any EVM-compatible network using an RPC URL, including Shimmer Network’s Layer-2 EVM.

Additionally, Envio has integrated [Hypersync](https://docs.envio.dev/docs/hypersync), a data lake that allows for querying historical blockchain data up to 1000 times faster than a standard RPC node, serving as an accelerated data layer. HyperIndex automatically leverages Hypersync for its data indexing, enhancing the developer experience and improving application performance. This embedded architecture provides decentralized finance protocols like Peppy Finance with both real-time on-chain events and unmatched indexing speeds for historical data.

***“Envio enabled us to use the same indexer for historical and real-time data. When building Peppy Finance, we reduced the code size of our data collection modules by over 60% because the Envio indexer is so fast that we could eliminate every manual event listener for live data. Goodbye complicated data merges, hello real-time indexing.”*** *– [Valentin Seehausen](https://x.com/V_Seehausen), Developer at Peppy Finance*

Peppy Finance uses Envio’s indexer to query their application data with [GraphQL](https://graphql.org/) and employs a subscription query, such as the GraphQL client [URQL](https://github.com/urql-graphql/urql), to receive real-time updates. This enables their reactive front end to update in real-time (e.g. displaying open positions, transaction history, updated portfolio values, etc.) whenever an event occurs on the blockchain.

## Envio's Hosted Service

Envio offers a reliable hosted service that simplifies the deployment and maintenance process, eliminating the need for you to manage your own infrastructure.

Envio’s hosted service streamlines development and deployment, by simply pushing your latest project code to a pre-configured GitHub repo to auto-deploy your indexer to the hosted service. 

This approach allows developers to focus on their application’s core functionality while ensuring data indexers deliver guaranteed performance with production-grade infrastructure.

For more information on how to deploy an indexer to Envio’s hosted service visit our [developer docs](https://docs.envio.dev/docs/hosted-service).

## Why Envio?

Envio is a developer-first, modern blockchain data indexing solution that lets developers and data analysts reliably read and process any real-time and historic smart contract data served via query-rich GraphQL API.

Envio supports the [Fuel Network](https://fuel.network/) and any EVM-compatible blockchain network with:

- **Flexible language support:** Configure your event handling in familiar and widely supported languages, such as [JavaScript](https://www.javascript.com/), [TypeScript](https://www.typescriptlang.org/), or [ReScript](https://rescript-lang.org/).
- **[HyperSync](https://docs.envio.dev/docs/overview-hypersync):** To ensure blazing-fast retrieval of historical on-chain data and a seamless developer experience, Envio’s HyperSync endpoint allows up to 1000x faster indexing than standard RPC (use of RPC is optional).
- **[No-code Quickstart](https://docs.envio.dev/docs/contract-import):** Autogenerate the key boilerplate for an entire Indexer project off single or multiple smart contracts. Deploy within minutes.
- **[Multi-chain Support](https://docs.envio.dev/docs/multichain-indexing):** Aggregate data across multiple networks into a single database. Query all your data with a unified GraphQL API.
- **[Join on-chain and off-chain data](https://docs.envio.dev/docs/async-mode):** Connect indexed blockchain data as well as ingest off-chain data to create flexible API for rich data beyond just what is emitted simply from events on-chain. e.g. modules that efficiently index off-chain NFT metadata.
- **[Factory Contracts](https://docs.envio.dev/docs/dynamic-contracts)**: Automatically register and process events emitted by all child contracts that are created by the specified factory / dynamic contract..
- **[Hosted Service](https://docs.envio.dev/docs/hosted-service)**: A managed service platform for building, hosting and querying Envio's Indexers with guaranteed uptime and performance service level agreements.

## Relevant Links

- [Peppy Finance Hosted Indexer](https://envio.dev/app/peppyfinance/peppy%20indexer)
- [Peppy Finance Indexer Github Repository](https://github.com/PeppyFinance/indexer/tree/main)
- [Envio HyperIndex Quickstart](https://docs.envio.dev/docs/contract-import)
- [Envio HyperSync](https://docs.envio.dev/docs/hypersync)

## About Envio

[Envio](https://envio.dev/) is a modern, dev-friendly, speed-optimized blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. Blockchain developers and data analysts can harness the power of Envio to overcome the challenges posed by latency, reliability, infrastructure management, and costs across various sources.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further.

Join our growing community of Web3 developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | 
[X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)