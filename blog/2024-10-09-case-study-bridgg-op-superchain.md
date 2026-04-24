---
title: "How Bridgg Unified 12 OP Superchain Networks into One API"
sidebar_label: "How Bridgg Unified 12 OP Superchain Networks into One API"
slug: /case-study-bridgg-op-superchain  
tags: ["case-studies"]  
description: "How Bridgg uses Envio to aggregate deposit and withdrawal data across 12 OP Superchain networks into a single API, indexing 11 million events in one deployment."
image: /blog-assets/case-study-bridgg-op-superchain.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/case-study-bridgg-op-superchain.png" alt="Cover Image Bridgg OP Superchain Case Study" width="100%"/>

<!--truncate-->

:::note TL;DR
- Bridgg, a bridge interface for the OP Superchain, uses Envio's HyperIndex to aggregate deposit and withdrawal data across 12 chains (11 million events) into a single unified API.
- HyperSync replaces standard RPC for data ingestion, delivering faster historical sync and enabling rapid feedback loops for Bridgg's development team.
- All multichain data is consolidated into one database with one API endpoint, eliminating the per-chain infrastructure footprint and cost that would come with separate deployments.
:::

[Brid.gg](http://brid.gg/) is a bridge interface for the OP Superchain that provides users with a unified account history view across Ethereum, OP Mainnet, Base, Zora, Mode Network, Fraxtal, RedStone, and other OP chains. The team built their data layer on Envio's HyperIndex, indexing 11 million events across 12 chains through a single deployment.

## What is the OP Superchain?

Created by [OPLabs](https://www.oplabs.co/), the OP Superchain is a movement that aims to bring native interoperability to the [OP-Stack](https://docs.optimism.io/stack/getting-started) and enhance UX across the Ethereum ecosystem by adopting standardized cross-ecosystem interfaces. Existing chains part of the OP Superchain include OP Mainnet, Base, Zora, Mode, Fraxtal, Cyber, Kroma, RedStone, Lisk, and a lot more.

OPLabs has recognized that standards and tools will also need to be provided to enable app developers to move assets and messages between interoperable chains to achieve this mission. You can read more about this [here](https://blog.oplabs.co/solving-interoperability-for-the-superchain-and-beyond/).

<img src="/blog-assets/case-study-bridgg-op-superchain-1.png" alt="OP Superchain Chains Explorer" width="100%"/>

The rise in the number of L2s has produced multiple co-existing chains, most of which solve for Ethereum scalability while balancing trade-offs around decentralization and security. In parallel, these networks have created and fostered diverse communities and ecosystems of applications that provide value and increase adoption.

The multichain world, however, has also brought its own set of challenges related to liquidity fragmentation and poor user experiences. From the developer's perspective, they experience the "cold start" problem of scaling and growing their app, managing costly multichain infrastructure. They also struggle to create smooth app UX due to complex network switching functionalities. Poor UX and high costs create barriers that significantly hinder the overall app adoption rate.

Cross-chain, abstraction, interoperability, and intents are the emerging approaches that aim to serve as critical pieces to solve these current problems.

## What is Brid.gg?

[Brid.gg](http://bridd.gg/) is a bridge interface that aims to revolutionize the way users interact with the OP Superchain. By simplifying access and usability, Bridgg is committed to making Ethereum's technologies more accessible and user-friendly for everyone, currently supporting transactions between Ethereum, OP Mainnet, Base, Zora, Mode Network, Fraxtal, RedStone, and future upcoming OP Chains.

With user experience as a core focus, Brid.gg allows users to view their past and current interactions with supported contracts, giving users a comprehensive single-pane view such as all deposits and withdrawals, so that users no longer need to visit each chain's block explorer.

<img src="/blog-assets/case-study-bridgg-op-superchain-2.png" alt="Bridgg Account History Feature" width="100%"/>
*Screenshot of Brid.gg's built-in account history dashboard*

Visit [Brid.gg](http://brid.gg/) directly or find them listed in the [Optimism](https://app.optimism.io/bridge/deposit) and [Base](https://docs.base.org/docs/tools/bridges/) docs.

## How Envio Supercharges Brid.gg

The team behind Brid.gg built an impressive multichain indexer using Envio [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview). An important decision in the search for a web3 backend to power their solution was performance, flexibility, and simplicity. Having compared a few solutions to their needs, the team landed on Envio as their weapon of choice.

Brid.gg wanted a solution that simplifies retrieving all the data across the growing list of multiple networks they support. Due to the vast amount of data (e.g. transaction history of deposits and withdrawals across multiple large chains), the team was also seeking a solution that allows indexing the data faster than current solutions available, such as indexers relying on RPC. Having the ability to retrieve historical data quickly, HyperIndex provides faster feedback loops for development, allowing teams to innovate and ship product updates quicker, thereby providing a pleasant developer experience.

HyperIndex has allowed Brid.gg to supercharge its data retrieval by using [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) as its data source instead of using the standard RPC option. Envio's multichain support also allows Brid.gg to aggregate all of its data into a single database, providing Brid.gg with unified data access via a single API and reducing infrastructure footprint and costs. Other indexers require a separate deployment per chain. With Envio, all networks are configured in a single config.yaml.

The Brid.gg [Indexer](https://envio.dev/app/bridgg/bridgg-indexer) currently indexes its data across 12 chains with a collection of 11 million events across the chains.

<img src="/blog-assets/case-study-bridgg-op-superchain-3.png" alt="Envio Explorer" width="100%"/>

## How Envio Powers the OP Superchain

Envio supports indexing any EVM-compatible network, using standard RPC as a data source, which means OP-stack chains can be indexed out-of-the-box. Envio has also added HyperSync to 70+ EVM networks to date, serving as an accelerated data query layer and powering many applications deployed on these chains with more performant data access than RPC.

You can see our supported networks [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).

Examples of amazing applications on the OP Superchain using Envio for their data needs:

- [Velodrome Finance](https://x.com/VelodromeFi), Liquidity Layer, and Multichain Dex on OP Superchain
- [Sablier](https://x.com/Sablier), a token streaming platform on OP, Base, Celo, and more (12+ chains)
- [Limitless](https://x.com/trylimitless), prediction Markets on Base
- [Rhinestone](https://x.com/rhinestonewtf), Modular Smart Accounts on ETH, OP, Base
- [Scope](https://x.com/scope_sh), an AA Block Explorer on ETH, OP, Cyber, Base, Celo, and more (18 chains)
- [ZkPass](https://x.com/zkPass), Onchain Achievements, and Reputation Scoring

These indexers and a lot more can be viewed in the Envio [Explorer](https://envio.dev/explorer).

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
