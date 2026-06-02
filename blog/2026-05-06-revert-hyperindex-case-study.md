---
title: How Revert Finance Fixed 2 Years of Unsynced PancakeSwap V3 Data with Envio
sidebar_label: How Revert Finance Fixed 2 Years of Unsynced PancakeSwap V3 Data with Envio
tags: ["case-studies"]
slug: revert-finance-pancakeswap-bnb-hyperindex
description: "Revert Finance's PancakeSwap V3 subgraph on The Graph had been stuck at 70% sync on BNB Smart Chain for over 2 years. Envio HyperIndex synced it to 100% in 10 days, processing 1.7 billion events."
image: /blog-assets/revert-hyperindex-case-study.png
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/revert-hyperindex-case-study.png" alt="How Revert Finance Fixed 2 Years of Unsynced PancakeSwap V3 Data with Envio" width="100%"/>

<!--truncate-->

:::note TL;DR
- Revert Finance's PancakeSwap V3 subgraph on The Graph had been stuck at 70% sync on BNB Smart Chain for over 2 years.
- Envio HyperIndex synced 1,711,569,200 events to 100% in 10 days, solving a problem that had gone unresolved for over 2 years.
- HyperSync eliminates the RPC bottleneck that causes other indexing frameworks to stall on high-throughput chains, like BNB Smart Chain, while HyperIndex's batch processing and caching ensure the indexer keeps up with the throughput.
:::

Revert Finance builds analytics and management tools for AMM liquidity providers across protocols including PancakeSwap, Uniswap, and others. Accurate, real-time onchain data is the foundation of everything they build.

They run several indexers using Envio, spanning multiple chains and contracts. This case study covers one of them: a PancakeSwap V3 indexer on BNB Smart Chain. Their previous subgraph had been stuck at 70% sync for over 2 years, unable to reach the chain's head.

<img src="/blog-assets/revert-hyperindex-case-study-1.png" alt="PancakeSwap V3 subgraph on The Graph stuck at 70% sync on BNB Smart Chain" width="100%"/>

The subgraph instance can be viewed here: [https://thegraph.com/explorer/subgraphs/Hv1GncLY5docZoGtXjo4kwbTvxm3MAhVZqBZE4sUT9eZ?view=Query&chain=bsc](https://thegraph.com/explorer/subgraphs/Hv1GncLY5docZoGtXjo4kwbTvxm3MAhVZqBZE4sUT9eZ?view=Query&chain=bsc)

Envio built a HyperIndex indexer for PancakeSwap V3 on BNB Smart Chain. It synced 1,711,569,200 events to 100% in 10 days.

## The Problem Revert Finance Needed to Solve

Revert Finance requires real-time PancakeSwap V3 position and liquidity data to power its analytics and tooling for liquidity providers. A public subgraph on The Graph's decentralized network had been stuck at 70% sync on BNB Smart Chain for over 2 years, unable to reach chain head.

BNB Smart Chain's high throughput has presented well-documented challenges for RPC-based indexing, with teams reporting sync issues going back to 2021. The volume of events per block outpaces what standard indexing infrastructure can sustain, causing subgraphs to fall progressively further behind until they stall entirely.

A subgraph stuck at 70% sync for over 2 years is effectively unusable.

## The Solution: Envio HyperIndex on BNB Smart Chain

Envio HyperIndex is a real-time multichain blockchain indexing framework for any EVM chain. Developers write event handlers in TypeScript and deploy a single indexer covering multiple contracts and chains simultaneously. It uses HyperSync, Envio's proprietary data engine, which serves filtered event data in bulk directly from a purpose-built data lake, replacing having to poll RPC endpoints block by block. This removes the RPC bottleneck entirely, which is precisely what causes subgraph stalls on BNB Smart Chain.

HyperIndex is independently benchmarked as the fastest blockchain indexer available. In the Uniswap V2 Factory benchmark run by Sentio in May 2025, HyperIndex synced in 8 seconds, 142x faster than The Graph and 15x faster than the nearest competitor. BNB Smart Chain is one of <HyperSyncChainCount /> EVM chains with native HyperSync coverage.

For a full benchmark breakdown see the [complete blockchain indexer comparison](https://docs.envio.dev/docs/HyperIndex/benchmarks).

Envio built a HyperIndex indexer covering PancakeSwap V3 on BNB Smart Chain, tracking Factory, Pool, and NFPM (Non-Fungible Position Manager) contracts from block 26,956,207.

### Contracts Indexed

The indexer covers the full PancakeSwap V3 contract surface on BNB Smart Chain:

- **Factory** (`0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865`): Pool creation and registry
- **Pool** (dynamic): All Pool events across all dynamically registered pool instances
- **NFPM** (`0x46a15b0b27311cedf172ab29e4f4766fbe7f4364`): NFT position management events

Dynamic contract registration handles the Pool contracts. As new PancakeSwap V3 pools are created onchain by the Factory, the indexer registers them automatically without requiring a redeployment.

<img src="/blog-assets/revert-hyperindex-case-study-2.png" alt="Revert Finance PancakeSwap V3 indexer running on Envio" width="100%"/>

## The Results

| Metric | Result |
|--------|--------|
| Chain | BNB Smart Chain (chain ID 56) |
| Events processed | 1,711,569,200 |
| Historical sync time | 10 days |
| Final sync status | 100% at block 88,286,723 |
| Start block | 26,956,207 |

Over 1.7 billion events, fully synced, on a chain where the equivalent subgraph had been stuck for over 2 years. The indexer is hosted on Envio Cloud, Envio's managed hosting platform.

<img src="/blog-assets/revert-hyperindex-case-study-3.png" alt="Revert Finance PancakeSwap V3 indexer synced to 100% on BNB Smart Chain in 10 days" width="100%"/>

<div style={{margin: "2rem 0", padding: "1.5rem 2rem", borderLeft: "4px solid #f97316", background: "rgba(249,115,22,0.06)", borderRadius: "0 8px 8px 0"}}>
  <p style={{fontSize: "1.1rem", fontStyle: "italic", marginBottom: "0.75rem"}}>"We had a problem with our PancakeSwap V3 data on BNB for over two years. The subgraph just would not catch up, and we'd basically given up on it. Envio synced it in 10 days. Great team, great dev experience!"</p>
  <p style={{margin: 0, fontWeight: 600}}>Mario Romero, Founder at Revert Finance</p>
</div>

## Envio vs The Graph on BNB Smart Chain

| | The Graph (subgraph) | Envio HyperIndex |
|--|----------------------|-----------------|
| BNB Smart Chain sync status | Stuck, unable to reach chain head for 2+ years | 100% synced in 10 days |
| Language | AssemblyScript | TypeScript |
| Real-time data availability | No | Yes |

## Why High-Throughput Chains Need HyperSync

BNB Smart Chain is not an edge case. Any high-throughput EVM chain, whether BNB Smart Chain, Polygon, or a high-activity L2, generates event volumes that stress RPC-based indexing. The pattern is the same: subgraph starts syncing, falls progressively further behind, eventually stalls.

HyperSync eliminates this failure mode by removing RPC polling from the historical sync path entirely. Event data is retrieved in bulk from Envio's data lake, meaning sync speed scales with data volume rather than being bottlenecked by RPC rate limits and polling intervals.

For protocols like Revert Finance that require accurate, real-time onchain data to power liquidity analytics, this is the difference between functional infrastructure and a permanently stale data source.

## Get Started

- Quickstart: [https://docs.envio.dev/docs/HyperIndex/contract-import](https://docs.envio.dev/docs/HyperIndex/contract-import)
- Envio docs: [https://docs.envio.dev](https://docs.envio.dev)
- Discord: [https://discord.gg/envio](https://discord.gg/envio)
- Telegram: [https://t.me/+kAIGElzPjApiMjI0](https://t.me/+kAIGElzPjApiMjI0)
- Follow us on X: [https://x.com/envio_indexer](https://x.com/envio_indexer)

## Frequently Asked Questions

### What is Revert Finance?

Revert Finance builds analytics and management tools for liquidity providers in AMM protocols. Its tooling covers position analytics, auto-compounding, and liquidity management across protocols including PancakeSwap, Uniswap, and others.

### What is PancakeSwap V3?

PancakeSwap V3 is the concentrated liquidity version of PancakeSwap, the largest decentralized exchange on BNB Smart Chain. V3 introduces capital-efficient liquidity positions represented as NFTs, managed via the Non-Fungible Position Manager contract.

### What is a blockchain indexer?

A blockchain indexer is a system that listens to onchain events and organises them into a structured, queryable database. Developers use blockchain indexers to build fast backends for DeFi protocols, analytics tools, and trading interfaces without querying slow RPC endpoints directly.

### What is HyperIndex?

Envio HyperIndex is a real-time multichain blockchain indexing framework for EVM chains. Developers write event handlers in TypeScript and deploy a single indexer covering multiple contracts, chains, and domains. It uses HyperSync, Envio's proprietary data engine, to fetch filtered event data in bulk rather than polling RPC endpoints, enabling historical syncs at speeds not achievable through standard RPC.

### What is HyperSync?

HyperSync is Envio's high-performance data engine. Instead of querying RPC endpoints block by block, HyperSync fetches and serves filtered event data in bulk from a purpose-built data lake, delivering up to 2,000x faster data access than traditional RPC. BNB Smart Chain is one of <HyperSyncChainCount /> EVM chains with native HyperSync coverage. Any EVM chain can be indexed via standard RPC.

### What is Envio Cloud?

Envio Cloud is Envio's managed hosting platform for HyperIndex indexers. It handles infrastructure, scaling, and monitoring so teams can run production-ready indexers without managing operational overhead. Revert Finance's PancakeSwap V3 indexer runs on Envio Cloud.

### What chains does Envio support?

Envio supports any EVM chain. <HyperSyncChainCount /> EVM chains have native HyperSync coverage for maximum speed, including BNB Smart Chain, Polygon, Ethereum, Base, Arbitrum, Optimism, and more. Any EVM chain without native HyperSync support can be indexed via standard RPC. See the full list of supported chains at [envio.dev/chains](https://envio.dev/chains).

### How do I migrate from The Graph to HyperIndex?

Because HyperIndex handlers are written in TypeScript and AssemblyScript is a subset of TypeScript, most handler logic can be carried across directly. Envio provides a full [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide), a CLI validation tool to compare output between both endpoints, and white-glove migration support for teams moving from The Graph.

## Build With Envio

Envio is independently benchmarked as the fastest EVM blockchain indexer available. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, or come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://x.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+kAIGElzPjApiMjI0) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
