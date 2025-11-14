---
title: Envio Celebrates Azuro Indexer Grantee
sidebar_label: Envio Celebrates Azuro Indexer Grantee
slug: /envio-celebrates-azuro-indexer-grantee
description: "See how Envio’s grant program empowered a builder to deliver a multichain indexer for Azuro protocols using the Envio's blockchain indexing solution and unlocking seamless cross-chain data access."
---


<img src="/blog-assets/azuro-multichain-grantee-1.png" alt="Envio Cover Photo" width="100%"/>

<!--truncate-->

We’re thrilled to share that Alex Urban, a Python developer at TradingStrategy, has completed the [Envio and Azuro Indexer Grant](https://docs.envio.dev/blog/envio-azuro-developer-grant-multi-chain-indexer). Alex developed an advanced multichain blockchain indexer for the [Azuro Protocol](https://azuro.org/) using Envio’s SDK, helping to boost the performance of Azuro’s decentralized betting platform. Alex was awarded a $1500 USDC grant for this achievement. This milestone showcases the power of Envio’s multichain data indexing solution for decentralized betting applications like Azuro.


## Grant Overview

Earlier this year, Azuro and Envio launched the developer grant, inviting developers to create an open-source indexer capable of seamlessly aggregating data across multiple blockchain networks. The goal: build a faster, more efficient indexing solution for the Azuro Protocol using Envio’s SDK.

Alex completed this grant by building an indexer capable of processing millions of events from Azuro’s v1, v2, v3, and Mainnet deployments. This reduced indexing times significantly, particularly on the Gnosis blockchain, where the entire event history was indexed in under an hour.


### Technical Scope

The scope of the indexer is limited to [Gnosis](https://www.gnosis.io/) and [Polygon](https://polygon.technology/) production contract deployments.



* The event handlers of the Envio indexer should be written in TypeScript. 

* The indexer involves configuring schema.graphql, config.yaml, and handlers.ts files. 

* Envio SDK version for the indexer should be version 0.0.29 or higher.

For more information about the grant, please see our blog article [here](https://docs.envio.dev/blog/envio-azuro-developer-grant-multi-chain-indexer) 


## Indexing Across Multiple Networks

The Azuro protocol roughly handles over 5.5 million events on the Gnosis blockchain alone and relies on efficient indexing to extract and organize data related to its smart contracts. Alex’s indexer efficiently processes event data from Azuro’s v1, v2, v3, and mainnet, making it fast and efficient to query and analyze this data.

By leveraging Envio’s multichain indexing infrastructure, Alex was able to aggregate data across different blockchain deployments, reducing fragmentation and streamlining access through a unified GraphQL API. This approach simplified the querying process, allowing Alex to retrieve complex betting data with ease.

<img src="/blog-assets/azuro-multichain-grantee-2.png" alt="Envio Cover Photo" width="100%"/>

The Azuro indexer extracts and indexes blockchain data relating to the Azuro protocol. This makes it fast and easy to query and analyze this data. This includes processed event data from v1, v2, v3, and the livecore of Azuro, which amounts to about 5.5 million events for the Gnosis blockchain, as shown in the above screenshot. 

Using Envio's fast data retrieval tech and caching to avoid RPC calls where possible, this indexer runs significantly faster than its Subgraph counterpart. Currently, on the Gnosis chain, it indexes the entire event history in under 1 hour. Envio supports multichain natively—simply add the relevant chain information to the configuration to enable multi-chain functionality.

***"The Envio team was highly responsive in addressing any queries and discussing possible new features that came up during the development process. It was a pleasure to work with them."  *** Alex Urban - Python Developer at [TradingStrategy](https://tradingstrategy.ai/)

Be sure to follow Alex on [X](https://x.com/alexth007) and check out his work on [GitHub](https://github.com/AlexTheLion123) to stay updated on their latest projects and contributions.


## Relevant Resources



* [Azuro Envio Indexer Boilerplate](https://github.com/enviodev/azuro-envio-indexer-boilerplate)
* [Multichain Indexing](https://docs.envio.dev/docs/HyperIndex/multichain-indexing)


## About Azuro

Azuro is a pioneering platform revolutionizing decentralized betting with elements like Prediction Markets, NFTs, and DAO governance. The Liquidity Tree design ensures robust market liquidity, providing users with a seamless experience and a user-friendly interface. Azuro's Frontends serve as decentralized alternatives to traditional online betting, prioritizing transparency and responsibility. Their vision is to create a vibrant, cost-effective, and community-driven betting environment, leveraging blockchain technology to empower players and reshape online betting.


## About Envio

[Envio](https://envio.dev) is a fast, developer friendly blockchain indexer and the fastest, most flexible way to get on-chain data, making real-time data accessible for developers across the Web3 ecosystem.

With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing tools supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.

If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)
