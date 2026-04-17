---
title: "How Sablier Streams Tokens Across 27+ Chains with One Envio Indexer"
sidebar_label: "How Sablier Streams Tokens Across 27+ Chains with One Envio Indexer"
slug: /case-study-sablier
tags: ["case-studies"]
description: "How Sablier replaced 12 separate indexer deployments with one Envio multichain indexer, now spanning 27 chains, cutting costs and accelerating feature delivery."
image: /blog-assets/case-study-sablier.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/case-study-sablier.png" alt="Cover Image for Case Study Sablier" width="100%"/>

<!--truncate-->

:::note TL;DR
- Sablier replaced 12 separate indexer deployments with a single Envio HyperIndex deployment, now spanning 27 chains, eliminating fragmented data and per-chain infrastructure overhead.
- Envio's multichain indexing consolidates all token streaming data into one PostgreSQL database accessible through a single GraphQL API, with HyperSync reducing sync times from hours or days to minutes.
- The migration cut infrastructure costs, accelerated Sablier's development lifecycle, and enabled chain-abstracted dashboards for improved UX.
:::

[Sablier](https://sablier.com/), a next-generation token streaming and distribution platform, transitioned to Envio's HyperIndex to replace 12 separate indexer deployments. The single indexer now covers 27 chains, eliminating infrastructure complexity, cutting costs, and significantly reducing data sync times.

## What is Sablier?

Sablier is a DeFi platform offering real-time, blockchain-based money-streaming services. Specializing in onchain token distribution for DAOs, businesses, and individual users, Sablier enables flexible vesting, payroll, airdrops, and grants. Operating through smart contracts on EVM-compatible networks, the Sablier platform facilitates continuous streams of ERC-20 tokens over scheduled periods (seconds, minutes, etc.), enhancing financial efficiency, transparency, and security without intermediaries.

Sablier also integrates seamlessly with other DeFi protocols, providing programmable and scalable payment solutions within the DeFi ecosystem, making it a part of the broader DeFi landscape by enabling real-time, trustless, and automated payment flows.

## Deep Dive into the Integration

Before integrating with Envio HyperIndex, Sablier grappled with the complexity of managing and maintaining 12 separate deployments of indexers across multiple mainnets, including [Optimism](https://www.optimism.io/), [Gnosis](https://www.gnosis.io/), [Polygon](https://polygon.technology/), [zkSync](https://zksync.io/), [Base](https://www.base.org/), [Scroll](https://scroll.io/), and more. With an ambitious growth trajectory and a commitment to providing a seamless user experience while scaling across a diverse array of EVM blockchain networks, Sablier needed to re-evaluate its infrastructure to optimize and support its growth strategy.

With the launch of their new product, Airstreams, in Sablier V2.1 and more recently the introduction of [Sablier V2.2](https://blog.sablier.com/q3-2024-release-notes/) with a specialized contract called LockupTranched, the prospect of updating and re-indexing 12 indexers, or deploying 12 new ones, was daunting. This process would be extremely resource-intensive, both in terms of infrastructure and cost.

In their search for alternatives, Envio stood out due to its robust multichain support, lightning-fast indexing times for fetching historical data, and real-time data synchronization capabilities. Envio's developer-friendly and flexible architecture allows for quick adaptation and support for a wide range of blockchains, perfectly aligning with Sablier's goal of becoming a truly multichain token streaming platform.

> *"Envio has significantly streamlined our workflow, enabling us to build, index, and release new features to our customers faster than ever before. Not only that, but through their multichain querying architecture, they've empowered us to prepare for a future where Sablier could offer chain-abstracted dashboards, paving the way for a vastly improved and less technical UX."*
>
> [Razvan Gabriel](https://x.com/razgraf), Co-founder and CPO at Sablier

## Challenges Faced

- **Operational Complexity**: Managing 12 separate indexer deployments significantly increased the operational burden and introduced numerous potential points of failure. This required meticulous monitoring and proactive infrastructure maintenance to ensure stability and performance.
- **Data Fragmentation**: Sablier had to query data from multiple endpoints and incorporate additional code to aggregate cross-chain data, creating a unified view of activity and analytics. This data fragmentation added complexity to their operations.
- **Sync times:** The lengthy sync and re-sync times for datasets meant that product features and updates took longer to develop and deploy. This hindered Sablier's ability to accelerate its development cycles and respond swiftly to market demands.
- **Scalability Issues**: As Sablier added new networks, the need for additional indexers complicated the infrastructure and increased maintenance costs. This scalability issue posed a significant challenge to their growth strategy.
- **Cost Inefficiencies**: Higher infrastructure maintenance and update costs due to multiple indexers diverted resources from core development activities, reducing overall efficiency.

## Envio as Sablier's new Data API

### Multichain Efficiency

One of the standout features of Envio's SDK that greatly benefited Sablier was its multichain support. This feature eliminated the need for Sablier to deploy separate indexers for each chain and allowed them to write data to a single database for unified data access. Other indexers require a separate deployment per chain. With Envio, all networks are configured in a single config.yaml.

Envio's multichain capability provides developers with an efficient way to access fragmented data across multiple chains. Builders can specify their event handler to operate against a common schema. For Sablier, they could collect and transform data from various sources and aggregate it into a single PostgreSQL database. With all cross-chain data consolidated, Sablier could query this data via a unified GraphQL API instead of requesting the same data via multiple endpoints. This streamlined their operations, making it easier to manage and utilize data from multiple blockchain networks.

<img src="/blog-assets/case-study-sablier-2.png" alt="GraphQL Playground for Query Building" width="100%"/>

When indexing multichain, Envio's SDK offers two options:

1. **Default Mode:** This mode preserves ordering across chains and ensures that events from all chains are ingested and processed in sequence. It is essential if you need to maintain the order across chains and are handling the same data from multiple chains.
2. **Unordered Head Mode:** This mode indexes each chain quickly without preserving order across chains. It is useful if you are indexing at the head and do not want the slow block time of one chain to hinder the optimistic processing of events on other chains.

<img src="/blog-assets/case-study-sablier-3.png" alt="Multichain Indexing Sync Status Progress bars" width="100%"/>

For more information on Envio's multichain indexing capabilities, view our dev docs [here](https://docs.envio.dev/docs/HyperIndex/multichain-indexing).

### Simplified Infrastructure Management

Sablier chose to leverage TypeScript, offering a more straightforward development experience, and once developed and tested, proceeded to deploy their [multichain indexer](https://envio.dev/app/sablier-labs/merkle-envio) to Envio's hosted service. Builders can easily manage and configure their indexers through the Envio Deployments GitHub app, streamlining development and deployment by pushing the latest indexer version to a preconfigured branch to auto-deploy the indexer to the hosted service.

Envio's hosted service allows you to have a static production deployment URL. By pushing your latest project code to a pre-configured GitHub repository, your indexer will be auto-deployed to the hosted service, ensuring a consistent and static URL for your production deployment.

For more information on deploying an indexer to Envio's hosted service, view our dev docs [here](https://docs.envio.dev/docs/HyperIndex/hosted-service).

### Speeding up the Development Lifecycle

Sablier's next major optimization aims to enhance its development workflow, enabling quicker development and testing of new product features while improving reliability by minimizing application downtime. Previously, syncing datasets with their current indexing solution took considerable time, sometimes requiring several hours or even days to fully sync the data.

Envio's indexing framework, HyperIndex, automatically leverages HyperSync for data ingestion as an alternative to RPC. [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) is a specialized data node built in Rust that allows querying historical blockchain data up to 2000x faster than a standard JSON-RPC node. This approach significantly improves over traditional RPC methods, as it retrieves multiple blocks simultaneously, dramatically speeding up the process. Additionally, HyperSync's low-level API enables users to request specific data fields without fetching the entire block. This selective approach reduces the data processing load, making the system more efficient and responsive.

By integrating Envio's HyperIndex, Sablier can significantly reduce data sync times, allowing for faster iteration and deployment of new features. This improvement not only accelerates the development lifecycle but also enhances the reliability and efficiency of their operations across multiple blockchain networks.

> *"At Sablier, we're always striving to enhance UX and ensure maximum uptime. When we integrated Envio's indexing services, we expected improvements, but the results exceeded our expectations. Not only did our app's UX significantly improve, but our development team and integrators also benefited from an incredibly clear, more powerful and efficient development experience (DX). Envio has been a game-changer for us in more ways than one."*
>
> [Paul R Berg](https://x.com/PaulRBerg), Co-Founder and CEO at Sablier

For more information on indexing performance, view the blog article on Envio's performance benchmark [here](https://docs.envio.dev/blog/indexer-benchmarking-results).

Other noticeable features that Sablier has implemented to create a data-rich API:

### Reading Contract Data

Ideally, smart contracts emit event logs containing all the data needed to build your application. However, in practice, developers often forget to include certain event logs or omit them for gas optimization purposes. In most cases, these gaps can be addressed by reading data directly from a contract.

For Sablier's V2 core contracts, a singleton-style architecture is used, where all money streams are managed within the LockupLinear, LockupDynamic, and LockupTranched contracts. Sablier's flagship model, the linear stream, distributes assets on a continuous, by-the-second basis. The sender deposits a specific amount of ERC-20 tokens into a contract, which then progressively allocates these tokens to recipients. The recipients can access their tokens as they become available over time.

To determine the ERC-20 token details, such as its symbol and decimals, Sablier customized their event handlers to perform asynchronous contract calls to smart contract view functions. This retrieves the necessary contract state. Recognizing that contract calls can slow down the indexing process, Sablier decided to cache these requests. Then, the event handler simply loads the information from the cache instead of performing repeated contract calls for the same data.

This approach not only ensures that Sablier can access the required contract state efficiently but also optimizes the indexing process by minimizing redundant contract calls, thereby improving overall performance and responsiveness.

## Conclusion

As Sablier continues to evolve, our collaboration remains a cornerstone of their multichain strategy. We eagerly anticipate how this integration will further their mission and set new standards in the blockchain space. If you want to take a look at Sablier's indexer implementation or their data API, you can view their information in the Sablier developer API docs [here](https://docs.sablier.com/api/overview).

## Relevant Links

- [Sablier Hosted Indexer](https://envio.dev/app/sablier-labs/merkle-envio)
- [Envio HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/contract-import)
- [Envio HyperSync](https://docs.envio.dev/docs/HyperSync/overview)
- [Envio's Multichain Indexing](https://docs.envio.dev/docs/HyperIndex/multichain-indexing)
- [Envio Hosted Service](https://docs.envio.dev/docs/HyperIndex/hosted-service)

## Why Envio?

Envio is a developer-first, modern blockchain data indexing solution that lets developers and data analysts reliably read and process any real-time and historic smart contract data.

Envio supports the [Fuel Network](https://fuel.network/) and any EVM-compatible blockchain network with:

- **Flexible language support:** Configure your event handling in familiar and widely supported languages, such as [JavaScript](https://www.javascript.com/), [TypeScript](https://www.typescriptlang.org/), or [ReScript](https://rescript-lang.org/).
- [**HyperSync**](https://docs.envio.dev/docs/HyperSync/overview): To ensure blazing-fast retrieval of historical onchain data and a seamless developer experience, Envio's HyperSync endpoint allows up to 2000x faster indexing than standard RPC (use of RPC is optional).
- [**No-code Quickstart**](https://docs.envio.dev/docs/HyperIndex/contract-import): Autogenerate the key boilerplate for an entire Indexer project off single or multiple smart contracts. Deploy within minutes.
- [**Multichain Support**](https://docs.envio.dev/docs/HyperIndex/multichain-indexing): Aggregate data across multiple networks into a single database. Query all your data with a unified GraphQL API.
- [**Join onchain and off-chain data**](https://docs.envio.dev/docs/async-mode): Connect indexed blockchain data as well as ingest off-chain data to create flexible API for rich data beyond just what is emitted simply from events onchain. e.g. modules that efficiently index off-chain NFT metadata.
- [**Factory Contracts**](https://docs.envio.dev/docs/dynamic-contracts): Automatically register and process events emitted by all child contracts that are created by the specified factory / dynamic contract.
- [**Hosted Service**](https://docs.envio.dev/docs/HyperIndex/hosted-service): A managed service platform for building, hosting, and querying Envio's Indexers with guaranteed uptime and performance service level agreements.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
