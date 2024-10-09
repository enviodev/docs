---
title: "Bridgg: The Unified Gateway for the OP Superchain, A New Paradigm of Interop Infra"
sidebar_label: "Bridgg: The Unified Gateway for the OP Superchain, A New Paradigm of Interop Infra"
slug: /case-study-bridgg-op-superchain
---

<img src="/blog-assets/case-study-bridgg-op-superchain.png" alt="Cover Image Bridgg OP Superchain Case Study" width="100%"/>

<!--truncate-->

The rise in the number of L2’s has produced multiple co-existing chains - of which most, are solving for the Ethereum scalability while trying to minimize their impact on sacrificing decentralization and security and balancing trade-offs the “blockchain trilemma”. In parallel, these networks have created and fostered diverse communities and ecosystems of applications and use cases that provide value and increase the adoption of its network.

The multi-chain world, however, has also brought its own set of challenges related to liquidity fragmentation and poor user experiences. ***“***From the developer’s perspective, they experience the "cold start" problem of scaling and growing their app, managing costly multi-chain infrastructure. They also struggle to create smooth app UX due to complex network switching functionalities. Poor UX and high costs create barriers that significantly hinder the overall app adoption rate” - OP Labs.

Cross-chain, abstraction, interoperability, and intents are the emerging buzzwords that aim to serve as critical pieces to solve these current problems and have led to the emergence of unifying different chains into a seamless front-end interaction experience. The OP Superchain is one such example.

## What is the OP Superchain?

Created by [OPLabs](https://www.oplabs.co/), the OP Superchain is a movement that aims to bring native interoperability to the [OP-Stack](https://docs.optimism.io/stack/getting-started) and enhance UX across the Ethereum ecosystem by adopting standardized cross-ecosystem interfaces. Existing chains part of the OP Superchain include OP Mainnet, Base, Zora, Mode, Fraxtal, Cyber, Kroma, RedStone, Lisk, and a lot more.

OPLabs has recognized that standards and tools will also need to be provided to enable app developers to move assets and messages between interoperable chains to achieve this mission. You can read more about this [here](https://blog.oplabs.co/solving-interoperability-for-the-superchain-and-beyond/).

<img src="/blog-assets/case-study-bridgg-op-superchain-1.png" alt="OP Superchain Chains Explorer" width="100%"/>


## What is Brid.gg?

An example of such is the recent launch of [Brid.gg](http://bridd.gg/), a bridge interface, that aims to revolutionize the way users interact with OP Superchain. By simplifying access and usability, Bridgg is committed to making Ethereum’s technologies more accessible and user-friendly for everyone, currently supporting transactions between Ethereum, OP Mainnet, Base, Zora, Mode Network, Fraxtal, RedStone, and future upcoming OP Chains.

With user experience as a core focus, Brid.gg allows users to view their past and current interactions with supported contracts, giving users a comprehensive single-pane view such as all deposits and withdrawals, so that users no longer need to visit each chain’s block explorer.

<img src="/blog-assets/case-study-bridgg-op-superchain-2.png" alt="Bridgg Account History Feature" width="100%"/>
*Screenshot of Brid.gg’s built-in account history dashboard*

Visit [Brid.gg](http://brid.gg/) directly or find them listed in the [Optimism](https://app.optimism.io/bridge/deposit) and [Base](https://docs.base.org/docs/tools/bridges/) docs.

## How Envio Supercharges Brid.gg

The team behind Brid.gg, has built an impressive multi-chain indexer using Envio [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview). An important decision in the search for a perfect web3 backend to help power their solution was performance, flexibility, and simplicity. Having compared a few solutions to their needs, the team landed on Envio as their weapon of choice.

Brid.gg wanted a solution that simplifies retrieving all the data across the growing list of multiple networks they support. Due to the vast amount of data, e.g. transaction history of deposits and withdrawals across multiple large chains, the team was also seeking a solution that allows indexing the data faster than current solutions available, such as indexers relying on RPC.  Having the ability to retrieve historical data quickly, HyperIndex provides faster feedback loops for development; allowing teams to innovate and ship product updates quicker, and thereby providing a pleasant developer experience.

HyperIndex has allowed Brid.gg to supercharge its data retrieval by using [Hypersync](https://docs.envio.dev/docs/HyperSync/overview) as its data source instead of using the standard RPC option. Envio’s multi-chain support also allows Brid.gg to aggregate all of its data into a single database, providing Brid.gg with unified data access via a single API and reducing infrastructure footprint and costs.

The Brid.gg [Indexer](https://envio.dev/app/bridgg/bridgg-indexer) currently indexes its data across 12 chains with a collection of 11 million events across the chains.

<img src="/blog-assets/case-study-bridgg-op-superchain-3.png" alt="Envio Explorer" width="100%"/>

## How Envio Powers the OP Superchain

Envio supports indexing any EVM-compatible network, using standard RPC as a data source, which means data OP-stacks can be indexed out-of-the-box. Envio, however, has also added Hypersync to 60+ EVM networks to date, serving as an accelerated data query layer and powering many applications deployed on these chains with more performant data access than RPC.

You can see our supported networks [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).

Examples of amazing applications on the OP Superchain using Envio for their data needs:

- [Velodrome Finance](https://x.com/VelodromeFi), Liquidity Layer, and Multi-chain Dex on OP Superchain
- [Sablier](https://x.com/Sablier), a token streaming platform on OP, Base, Celo, and more (12+ chains)
- [Limitless](https://x.com/trylimitless), prediction Markets on Base
- [Rhinestone](https://x.com/rhinestonewtf), Modular Smart Accounts on ETH, OP, Base
- [Scope](https://x.com/scope_sh), an AA Block Explorer on ETH, OP, Cyber, Base, Celo, and more (18 chains)
- [ZkPass](https://x.com/zkPass), Onchain Achievements, and Reputation Scoring

These indexers & a lot more can be viewed in the Envio [Explorer](https://envio.dev/explorer).

## About Brid.gg

Brid.gg is a user-friendly interface, designed to connect Ethereum with next-generation superchains and efficient Layer 2 solutions. This platform simplifies the transfer of assets and data across networks, providing you with a seamless, secure, and fast transaction experience.

## About Envio

[Envio](https://envio.dev/) is a modern, dev-friendly, speed-optimized blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. Blockchain developers and data analysts can harness the power of Envio to overcome the challenges posed by latency, reliability, infrastructure management, and costs across various sources.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further.

Join our growing community of Web3 developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)