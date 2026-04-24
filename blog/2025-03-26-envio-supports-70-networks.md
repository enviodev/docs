---
title: Envio Now Supports 70+ Blockchains
sidebar_label: Envio Supports 70+ Blockchains Emerging as Web3's Fastest Blockchain Indexer
slug: /envio-hypersync-supports-70-networks
description: "Learn how Envio's HyperSync supports over 70 blockchain networks delivering real-time and historical onchain data with unmatched speed and reliability."
image: /blog-assets/envio-supports-70-networks.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/envio-supports-70-networks.png" alt="Cover Image Envio Developer Community Update February 2025" width="100%"/>

<!--truncate-->

:::note TL;DR
- Envio's HyperSync now supports over 70 EVM-compatible networks plus Fuel, providing reliable real-time data access at speeds up to 2000x faster than standard RPC.
- HyperIndex adds full multichain indexing with a single config.yaml and a single GraphQL endpoint, making it structurally simpler than The Graph or Goldsky for cross-chain data.
- If your network is not yet supported, you can request HyperSync support directly in the Envio Discord.
:::

Envio's HyperSync supports over 70 EVM-compatible networks along with Fuel, providing reliable real-time data access across the Web3 ecosystem. This milestone advances the goal of making decentralized data more efficient and accessible for developers and analysts building across multiple blockchains.

## What is HyperSync?

[HyperSync](https://docs.envio.dev/docs/HyperSync/overview) is Envio's advanced data node, built in Rust to dramatically speed up blockchain data retrieval. It operates as a real-time, high-speed query layer, offering a low-level API compatible with Python, Rust, Node.js, and Go. With HyperSync, you can query millions of events in seconds, delivering sync speeds up to 2000x faster than traditional RPC methods.

HyperSync is well suited for performance-heavy applications like block explorers, data analytics platforms, and blockchain bridges. Traditional syncing methods can be slow and resource-intensive, especially across multiple networks. HyperSync optimizes these processes with intelligent caching and efficient data retrieval, giving you faster access to both real-time and historical blockchain data.

## Multichain indexing support

Envio HyperIndex provides multichain indexing support, enabling you to efficiently index and query multiple blockchains with a single indexer. This eliminates redundant tools, streamlines workflows, and ensures high performance at scale.

Unlike The Graph (which requires a separate subgraph per chain with separate endpoints) or Goldsky (which requires separate pipelines per chain), Envio uses a single `config.yaml` to define all networks and exposes a single GraphQL endpoint. This makes cross-chain data access significantly simpler to build and maintain.

## Supported networks

Envio supports any EVM chain and Fuel with an expanding list of networks, including [Arbitrum](https://arbitrum.io/), [Base](https://www.base.org/), [Blast](https://blast.io/en), [Celo](https://celo.org/), [Chiliz](https://www.chiliz.com/), [Citrea](https://citrea.xyz/), [Darwinia](https://darwinia.network/), [Ethereum](https://ethereum.org/en/), [Gnosis](https://www.gnosis.io/), [Metis](https://www.metis.io/), [Monad](https://www.monad.xyz/), [Morph](https://www.morphl2.io/), [Optimism](https://www.optimism.io/), [Polygon](https://polygon.technology/), [Rootstock](https://rootstock.io/), [Scroll](https://scroll.io/), and many more.

See the full list of supported networks in the [documentation](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).

We are rapidly adding new supported networks. If your network is not listed or you would like HyperSync support added, pop us a message in our [Discord](https://discord.gg/envio).

## Why use Envio?

Envio HyperIndex offers a developer-centric blockchain data indexing solution, empowering you to efficiently access and process both real-time and historical smart contract data served via GraphQL API:

* **Flexible language support**: Configure your event handling in JavaScript, TypeScript, or ReScript.
* **HyperSync**: Delivers up to 2000x faster indexing than standard RPC for historical onchain data. Use of RPC is optional.
* **No-code quickstart**: Autogenerate the key boilerplate for an entire indexer project from single or multiple smart contracts. Deploy within minutes.
* **Multichain support**: Aggregate data across multiple networks into a single database. Query all your data with a unified GraphQL API.
* **Factory contracts**: Automatically register and process events emitted by all child contracts created by a specified factory or dynamic contract.
* **Hosted service**: A managed service platform for building, hosting, and querying Envio's Indexers with guaranteed uptime and performance service level agreements.

## Useful resources

- [Getting started](https://docs.envio.dev/docs/HyperIndex/getting-started)
- [Guides](https://docs.envio.dev/docs/HyperIndex/configuration-file)
- [Tutorials](https://docs.envio.dev/docs/HyperIndex/tutorial-op-bridge-deposits)
- [Get support](https://discord.gg/envio)

## Conclusion

Envio is a powerful alternative to traditional blockchain indexing methods. Its single-config multichain approach simplifies cross-chain data access and eliminates the per-chain overhead that comes with The Graph subgraphs or Goldsky pipelines.

## Frequently asked questions

### How do I check if my network is supported by Envio HyperSync?

Visit the [HyperSync supported networks page](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks) in the documentation. If your network is not listed, you can request support by opening a message in the [Discord](https://discord.gg/envio).

### Can I use Envio on a network that HyperSync does not yet support?

Yes. For networks without HyperSync support, Envio HyperIndex falls back to standard RPC for data retrieval. You provide an RPC URL in your config, and the indexer works the same way, just without the HyperSync speed boost. HyperSync support is added regularly.

### What languages can I use with the HyperSync API?

HyperSync exposes a low-level API with clients for Python, Rust, Node.js, and Go. You can retrieve data in JSON, Arrow, or Parquet formats depending on your pipeline needs.

### How does Envio's multichain support compare to The Graph?

The Graph requires a separate subgraph deployment for each chain, with separate GraphQL endpoints per network. Envio uses a single `config.yaml` to define all networks and a single GraphQL endpoint for all chains. This means less boilerplate, fewer deployments to manage, and simpler cross-chain queries.

### Is HyperSync available as a standalone API, or only through HyperIndex?

HyperSync is available both as the underlying data layer for HyperIndex and as a standalone API. Data analysts can query HyperSync directly using the Python, Rust, Node.js, or Go clients for custom data pipelines, analytics, and research use cases.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
