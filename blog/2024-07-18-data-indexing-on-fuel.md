---
title: Envio Supports Fuel With Fast Data Indexing
sidebar_label: Envio Supports Fuel With Fast Data Indexing
slug: /fast-data-indexing-on-fuel-using-envio
---

<img src="/blog-assets/fuel-envio.png" alt="Cover Image Data Querying on Fuel" width="100%"/>

<!--truncate-->

 The [Fuel Network](https://fuel.network/) stands out as a beacon of hope for solving Ethereum's scalability challenges. Ethereum, the leader in security and decentralization, has struggled to scale smoothly in line with user demand as more users and dApps join the network.

The real-world implications of execution bottlenecks are far-reaching, affecting both users and developers. High gas fees, network congestion, and scalability constraints hinder the growth and usability of the Ethereum ecosystem. Addressing these challenges requires innovation and improvements to the execution layer.

At the heart of Fuel is the FuelVM, an execution environment that is parallelized for maximum performance throughput and state-minimized for sustainable state growth. Still leveraging Ethereum’s security and data availability, Fuel aims to be the rollup OS for Ethereum. For a more technical deep dive into Fuel’s mission, you can follow their [blog](https://fuel.mirror.xyz/uQxyb1o_Gu4oBSyT1ULuqRu7ffmIXuZtx9ux8ndFMXs).

Fuel is also shaking up the evm solidity narrative by introducing a new programming language—[Sway](https://docs.fuel.network/docs/sway/). Sway is a strongly-typed programming language written in Rust, serving as a new standard for smart contract development. It takes inspiration from various languages, aiming to incorporate only the best features without limiting itself to any specific language.

Envio plays an integral part in streamlining application development on the Fuel ecosystem. It provides a state-of-the-art SDK for building performant and scalable decentralized applications and serves as the accelerated data query layer. Envio equips developers and projects with the necessary toolkits to query vast amounts of real-time and historical data and extract meaningful insights.

In this blog, we explore how developers and data analysts can leverage Envio’s modular data stack to index and query data on the Fuel Network.

## What is the Fuel Network?

The [Fuel Network](https://fuel.network/) is a high-performance, modular blockchain infrastructure designed to support scalable and efficient dApps. It utilizes a unique combination of Fuel Virtual Machine ([FuelVM](https://docs.fuel.network/docs/intro/what-is-fuel/)) and Optimistic Rollup technology to achieve exceptional transaction throughput and low fees. The network's modular architecture enables developers to customize and optimize various components, enhancing flexibility and performance. With its emphasis on speed, security, and scalability, the Fuel Network is positioned to drive the next generation of blockchain innovations, providing a robust platform for dApps that prioritize efficiency and seamless user experiences.

## What Envio Supports on the Fuel Network

### HyperFuel

Envio’s [HyperFuel](https://docs.envio.dev/docs/HyperIndex/fuel) is a version of [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) specifically adapted for the Fuel Network. It provides a low-level API for developers and data analysts to create flexible, filtered, high-speed, queries for smart contract data and large data sets.

HyperFuel acts as a high-performance real-time data archive that accelerates data retrieval on the Fuel Network, enabling efficient parsing, querying, and analysis of Fuel data.

Developers and data analysts can interact with HyperFuel API using JavaScript, Python, or Rust [clients](https://github.com/enviodev/hyperfuel-json-api), and choose the output their data in JSON, Arrow, and Parquet formats.

With HyperFuel, developers can sync large datasets in minutes, eliminating the need to use slow or rate-limited node endpoints, like RPCs, which would typically take hours or even days to fetch large data sets. HyperFuel is ideal for developers building dApps, block explorers, wallets, analytics, and other data-heavy use cases on the Fuel Network.

### HyperIndex

Envio’s [HyperIndex](https://docs.envio.dev/docs/HyperIndex/v2/overview), is a developer-first, real-time data indexing framework for rapidly building a custom GraphQL APIs for smart contract data.

Envio’s [Contract Import](https://docs.envio.dev/docs/HyperIndex/contract-import) serves as a starting point for most developers building a backend for their decentralized application - a quickstart to effortlessly build and automatically generate a basic Fuel indexer in less than a minute. Developers achieve this by supplying the contract ABI, selecting the events they’re interested in, and following CLI command prompts to create their first indexer.

For a detailed tutorial demonstrating how to leverage this quickstart, explore our [tutorial](https://docs.envio.dev/docs/HyperIndex/tutorial-indexing-fuel) on creating an indexer for [Sway Farm](https://www.swayfarm.xyz/)—a real-world example of an on-chain farming game and how you can create an indexer for its farmer leaderboard.

*⚠️Note: Before diving into this tutorial, ensure you have the necessary [prerequisites](https://docs.envio.dev/docs/HyperIndex/getting-started) installed.*

Fuel application teams also have the option of hosting their indexer and custom application API on Envio’s reliable [Hosted Service](https://docs.envio.dev/docs/HyperIndex/v2/hosted-service), making infrastructure deployment and management a painless and seamless experience, so that teams can focus on the core of their application, and other business functions such as providing seamless user experience, exceptional user support and spending more time on growth strategies for adoption.

## Relevant Resources

- [Envio Tutorial: Indexing Sway Farm on the Fuel Network](https://docs.envio.dev/docs/HyperIndex/tutorial-indexing-fuel)
- [Envio HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/getting-started)
- [Envio HyperFuel](https://docs.envio.dev/docs/HyperSync/hyperfuel)
- [Envio’s Hosted Service](https://docs.envio.dev/docs/HyperIndex/hosted-service)

## Data Indexer Use Cases on Fuel using Envio

- [Data Indexer](https://github.com/compolabs/spark-envio-indexer) for [Spark](https://sprk.fi/), a DeFi super app with perpetual contracts, an orderbook. and as well as lending & borrowing features.
- [Data Indexer](https://github.com/enviodev/fuel-thunder-exchange/tree/main) for [Thunder](https://thundernft.market/), a NFT Marketplace, allowing multiple purchases of NFTs in a single transaction thanks to parallen execution by Fuel.

## Getting Support

Data indexing can be challenging, especially for complex use cases. Our engineers are ready to assist you with your data availability needs.

Join our growing community of elite builders and achieve peace of mind with Envio.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)

Email: [hello@envio.dev](mailto:hello@envio.dev)

## About Envio

[Envio](https://envio.dev/) is a modern, dev-friendly, speed-optimized blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. Fuel developers and data analysts can harness the power of Envio to overcome the challenges posed by latency, reliability, infrastructure management, and costs across various sources.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further.