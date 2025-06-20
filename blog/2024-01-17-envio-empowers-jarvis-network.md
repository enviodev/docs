---
title: "Envio Empowers Jarvis Network: Lightning-Fast Data Indexing for Chainlink Price Feeds"
sidebar_label: "Envio Empowers Jarvis Network: Lightning-Fast Data Indexing for Chainlink Price Feeds"
slug: /envio-empowers-jarvis-network
---

<img src="/blog-assets/envio-empowers-jarvis-network.png" alt="Cover Image Envio Empowers Jarvis Network" width="100%"/>

<!--truncate-->

We’re excited to announce that [Jarvis Network](https://jarvis.network/) has integrated [Envio](https://envio.dev/) and its multi-chain indexing capabilities to streamline the process of accessing and aggregating real-world asset price data secured by [Chainlink’s](https://chain.link/) industry-leading price data feeds across various blockchain networks, including [Polygon](https://polygon.technology/), [Optimism](https://optimism.io/), [BNB](https://www.bnbchain.org/en), and [Arbitrum](https://arbitrum.io/).

Jarvis Network demonstrates a commitment to accurate price data for the creation of its synthetic assets, called jFIATs, by leveraging Chainlink data feeds for real-time exchange rates on fiat currencies. Jarvis Network allows anyone to buy, sell, or exchange jFIATs (fiat stablecoins) on multiple EVM-compatible networks.

*“jFIATS can help solve the liquidity problem for non-USD stablecoins, fostering worldwide inclusion of other global currencies and further increasing DeFi adoption” - Jarvis Network*

## Indexing Chainlink Data Feeds with Envio

Chainlink Data Feeds are validated by Chainlink’s decentralized network of security-reviewed oracle nodes that aggregate data from multiple premium data providers and play an essential component in empowering DeFi Protocols like Jarvis Network to leverage reliable, tamper-proof real-world asset prices.

Data Indexers like [Envio](https://envio.dev/) can organize these data feeds in a way that makes it simple for developers to search for and analyze real-time or historical data from Chainlink’s Data Feeds.  Envio acts as the intermediary, indexing multiple Chainlink data feeds and providing Jarvis Network with a unified API for the efficient retrieval of real-time and historical price information of real-world fiat currencies. This reduces development time and costs and provides a seamless developer experience for querying and aggregating this price information.

This process extends beyond swap pools on multiple networks, including Polygon, Optimism, BNB, and Arbitrum. The overarching goal is to empower users with accurate and timely information, enabling them to make well-informed decisions in the dynamic and fast-paced DeFi space.

## Dynamic Price Charts

The integration of indexed data goes beyond the technicalities. Jarvis Network, leveraging this wealth of data, introduces dynamic 24-hour, weekly (7 days), and monthly (30 days) price charts on the jarvis.money app. This user-centric approach transforms complex market trends into visually intuitive charts, providing traders and investors with a powerful toolset for navigating the DeFi landscape.

<img src="/blog-assets/envio-empowers-jarvis-network-2.png" alt="Cover Image Envio Empowers Jarvis Network" width="100%"/>


*“Envio's innovative Web3 indexing services have been a game-changer for us. This integration has unlocked a realm of opportunities, enabling us to harness our data like never before. With Envio's robust and efficient solutions, we've managed to index multiple smart contracts across five different blockchains seamlessly.” - Asim Ashfaq - Co-Founder at 0xEquity and full-stack Developer at Jarvis Network*

## Liquidity Pool Analysis

In addition to dynamic price charts, Jarvis Network also leverages Envio’s data indexing capabilities to conduct real-time analytics for their jFIAT Liquidity Pool on [Optimism](https://www.optimism.io/) and [Arbitrum](https://arbitrum.io/). This enables Jarvis to effortlessly query and display aggregated information, including current liquidity, deposited liquidity, withdrawn liquidity, and net liquidity, for their jFIAT liquidity pools.

<img src="/blog-assets/envio-empowers-jarvis-network-3.jpg" alt="Envio Empowers Jarvis Network For Liquidity Pool Analytics" width="100%"/>

## Self-Hosting for Customization

Jarvis Network chose to self-host their indexer, granting the team the flexibility to install the TimescaleDB extension for the PostgreSQL database. This decision highlights Envio's commitment to providing flexibility for further customization to meet project-specific needs.

In this specific case, Jarvis Network's decision to use the TimescaleDB extension for PostgreSQL would be advantageous for time-series data, making it well-suited for creating various price charts with different time intervals.

## Envio's Hosted Service

While Jarvis Network took charge of self-hosting, Envio offers a reliable hosted service that simplifies the deployment and maintenance process of managing infrastructure.

Once configured, Envio’s hosted service streamlines deployment, as users are only required to push their latest indexer version to their GitHub repository to auto-deploy their indexer to the hosted service. Developers can easily manage and configure their indexers through the Envio Deployments GitHub app.

Envio offers the easiest way to deploy and host your indexer, handling the entire infrastructure and eliminating worries about complex infrastructure setup and management. This approach allows developers to focus on their dApp's core functionality while ensuring their indexer guarantees performance with production-grade infrastructure.

For more information on how to deploy an indexer to Envio’s hosted service visit our [docs](https://docs.envio.dev/docs/hosted-service).

## Multi-Chain Indexing

Envio's multi-chain indexing empowers developers and data analysts with the means to index and query data stored on multiple blockchains with a single indexer deployment.

In the case of this Jarvis Network, it allows the writing of multiple price feeds for various assets on multiple chains into the same database and accessing this through a unified GraphQL API. This significantly simplifies the development process, reduces costs, and eliminates the need to develop and maintain multiple indexer deployments and databases.

For more information on Envio’s multi-chain indexing, you can view it in the Envio [docs](https://docs.envio.dev/docs/multichain-indexing).

## Why Envio?

Envio is a developer-centric, 3-command init-develop-deploy EVM blockchain data indexing solution that lets you reliably read and process any real-time and historic smart contract data served via query-rich GraphQL API.

Envio supports indexing any EVM blockchain and supports:

- Flexible language support: Configure your event handling in familiar and widely supported languages, such as [JavaScript](https://www.javascript.com/), [TypeScript](https://www.typescriptlang.org/), or [ReScript](https://rescript-lang.org/).
- [HyperSync](https://docs.envio.dev/docs/hypersync): To ensure blazing-fast retrieval of historical on-chain data and a seamless developer experience, Envio’s HyperSync endpoint allows for 100x faster indexing than standard RPC.
- Join on-chain and off-chain data: Connect indexed blockchain data as well as ingest off-chain data to create flexible API for rich data beyond just what is emitted simply from events on-chain. e.g. modules that efficiently index off-chain NFT metadata.

## About Jarvis Network

[Jarvis Network](https://jarvis.network/) represents a suite of Ethereum-based protocols designed to democratize and revolutionize finance, with a specific focus on financial products and markets. Operated by a DAO, Jarvis Network is at the forefront of transforming traditional financial markets into open, transparent, interoperable, and programmable ecosystems, ultimately cutting out the middleman.

By "blockchainizing" conventional financial markets, Jarvis Network enables users to seamlessly access the prices of various financial instruments through margin trading and/or synthetic assets. In simpler terms, users can actively trade, invest, and establish positions in these instruments, while also contributing the essential liquidity needed for the smooth operation of these protocols.

## About Envio

[Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio is the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts. If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further.

Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)