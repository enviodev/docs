---
title: How Katana Migrated SushiSwap Data from The Graph to Envio
sidebar_label: How Katana Migrated SushiSwap Data from The Graph to Envio
tags: ["case-studies"]
slug: case-study-katana-sushiswap
description: "Katana moved two production SushiSwap subgraphs from The Graph to Envio HyperIndex. The data model carried over entity-for-entity, and Katana's app now runs on Envio's native GraphQL endpoint."
image: /blog-assets/katana-sushiswap-case-study.png
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/katana-sushiswap-case-study.png" alt="How Katana Migrated SushiSwap Data from The Graph to Envio" width="100%"/>

<!--truncate-->

:::note TL;DR
- Katana migrated two production subgraphs, SushiSwap V3 and the Sushi staker, from The Graph to Envio HyperIndex while keeping its existing data model intact.
- Katana's existing subgraph-style queries ran against Envio's subgraph-compatible endpoint, and for the full GraphQL feature set its app needed, Katana moved its queries onto Envio's native endpoint. The data model itself carried over unchanged.
- Katana forked the indexer and deployed it on Envio Cloud, and the Envio team assisted with the backend configuration, the subgraph-compatible endpoint, and the cache.
:::

Migrating your data infrastructure from one provider to another is rarely simple, mostly because of everything that has to change around it. Katana is a DeFi network, and its app surfaces SushiSwap data such as V3 pools, swaps, fees, positions, and staking to its users. That data was served by two production subgraphs running on The Graph. Katana wanted to move this data layer to Envio HyperIndex without disrupting the apps that depend on it.

Because this was a live production system rather than a greenfield build, the priority was continuity. The existing queries had to keep working and the data had to stay correct. This case study walks through how the migration came together, from the subgraph-compatible endpoint that kept Katana's queries running to the hands-on support that handled the rest.

## The Challenge: Moving a Production Data Layer Without Disrupting It

Katana's existing subgraph queries were wired into production and had to keep working. Data quality and expected behaviour had to be preserved. And it had to be efficient, a swap, not a multi-week infrastructure project. For DeFi data, correctness and uptime were non-negotiable, because their application and users depended on it.

During development, the team also noticed the existing subgraph data often running around three blocks behind the chain head. For user-facing DeFi data, that kind of freshness gap matters.

## The Solution: A Subgraph-Compatible Path off The Graph

The migration came down to two things. Envio's tooling fit the setup Katana already had, and the support was there at every step.

The foundation was schema parity. The HyperIndex deployment reproduces the original Sushi V3 subgraph entity-for-entity, all 23 entity types, tracking the Uniswap V3 factory, the position manager, and every pool it deploys. Same entities, same shape, so Katana did not have to redesign its data or rebuild against a new model.

Envio exposes two GraphQL endpoints, a subgraph-compatible one that runs existing subgraph-style queries as a drop-in, and a native one with the full query feature set. Katana's standard queries ran against the compatible endpoint, and for the full feature set its app needed, Katana standardised on the native endpoint, with the Envio team working through the move alongside them.

### Contracts Indexed

The SushiSwap V3 indexer runs on Katana mainnet:

| Contract | Address | Start block |
|----------|---------|-------------|
| UniswapV3Factory | `0x203e8740894c8955cb8950759876d7e7e45e04c1` | 1,858,972 |
| NonfungiblePositionManager | `0x2659c6085d26144117d904c46b48b6d180393d27` | 1,860,127 |
| UniswapV3Pool | Dynamic, registered by the factory | When each pool is deployed |

The process was a fork-and-deploy flow. Katana forked the indexer, connected it to Envio Cloud, and deployed, while the Envio team handled the backend configuration, set up the subgraph-compatible endpoint, and managed the caching for the deployment. The team could also validate on a fast instance first. With the most RPC-heavy fields turned off, backfill ran about ten times faster, so they could confirm everything looked right before running the full indexer with every field populated.

The Envio team set up the endpoints, configured the caching, and worked through the query migration directly with Katana's engineers.

## The Results

Katana migrated both production subgraphs, SushiSwap V3 and the Sushi staker, from The Graph to Envio. Its existing queries kept working through the subgraph-compatible endpoint, so the app did not need a rewrite. A third subgraph, a pre-staking one with deprecation already planned, was left as-is by design.

*The SushiSwap V3 indexer on Envio, fully synced (11,473,382 events) in about two hours.*

<img src="/blog-assets/katana-sushiswap-case-study-1.png" alt="Katana SushiSwap V3 indexer synced to 100% on Envio in about two hours, processing 11,473,382 events" width="100%"/>

*The Sushi staker subgraph, fully synced (68,201 events) in under 20 seconds on Envio.*

<img src="/blog-assets/katana-sushiswap-case-study-2.png" alt="Katana Sushi staker indexer synced to 100% on Envio in under 20 seconds, processing 68,201 events" width="100%"/>

With the migration complete, both SushiSwap indexers run on Envio Cloud, serving Katana's app through the same queries it used before. Where the original subgraph had drifted a few blocks behind, the new indexer indexes in real time at the chain head.

<div style={{margin: "2rem 0", padding: "1.5rem 2rem", borderLeft: "4px solid #f97316", background: "rgba(249,115,22,0.06)", borderRadius: "0 8px 8px 0"}}>
  <p style={{fontSize: "1.1rem", fontStyle: "italic", marginBottom: "0.75rem"}}>"The comprehensive resources and proactive support provided by the Envio team made our migration from The Graph remarkably smooth and efficient."</p>
  <p style={{margin: 0, fontWeight: 600}}>Kirienzo, Senior Software Engineer, Katana</p>
</div>

## Before and After the Migration

| | The Graph | Envio |
|--|-----------|-------|
| GraphQL queries | Subgraph | Run against Envio's native GraphQL endpoint |
| Entity schema | Sushi V3 subgraph schema | Reproduced entity-for-entity, 23 types |
| Handler language | AssemblyScript | TypeScript |
| Hosting | The Graph | Envio Cloud (managed) |

## What Carries Over When You Move Off The Graph

A subgraph rarely sits on its own. Queries, dashboards, and app code are all built against its schema, which is what makes moving it feel risky. The part that carries over cleanly is the data model. Because the HyperIndex indexer reproduced the Sushi V3 subgraph entity-for-entity, Katana did not have to redesign its data or rebuild against a new model. On the query side, Envio gives you a subgraph-compatible endpoint for a drop-in start and a native GraphQL endpoint for the full feature set, and Katana's app runs on the native one.

For a team considering a migration off The Graph, Envio's subgraph-compatible endpoint is what makes it a swap rather than a multi-week rebuild.

## Relevant Resources

- [Katana SushiSwap V3 indexer (GitHub)](https://github.com/katana-network/katana-sushi-v3-subgraph)
- [Original Sushi staker subgraph on The Graph](https://thegraph.com/explorer/subgraphs/2hnbrb3a4zWmQDkAbvDmYsBLGMWSaH6vAYcJnUJcLe1B?view=Query&chain=arbitrum-one)
- [Indexing Katana Data with Envio](https://docs.envio.dev/docs/HyperIndex/katana)
- [Migrating from The Graph](https://docs.envio.dev/docs/HyperIndex/migration-guide)
- [HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/contract-import)
- [HyperSync](https://docs.envio.dev/docs/HyperSync/overview)
- [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service)

## Frequently Asked Questions

### What is Katana?

Katana is a DeFi-focused blockchain, designed to concentrate liquidity into a small set of core applications instead of spreading it thin across many. SushiSwap V3 is its spot exchange, which is why the Katana app surfaces SushiSwap data such as pools, swaps, fees, and staking to its users.

### What is SushiSwap?

SushiSwap is a decentralised exchange (DEX). Its V3 deployment, the concentrated-liquidity version, is Katana's spot trading venue, and it generates the pools, positions, swaps, and fees that the migrated subgraphs index.

### What did Katana migrate?

Two production subgraphs, the SushiSwap V3 subgraph and the Sushi staker subgraph, both from The Graph to Envio HyperIndex. A third, pre-staking subgraph scheduled for deprecation was not migrated.

### What did Katana have to change to migrate?

The data model carried over entity-for-entity, so there was no schema rebuild. Katana's existing queries ran against Envio's subgraph-compatible endpoint, and for the full GraphQL feature set its app needed, Katana moved its queries onto Envio's native endpoint, with the Envio team supporting the move.

### What is the subgraph-compatible endpoint?

It is an Envio feature that runs existing The Graph subgraph-style GraphQL queries against a HyperIndex deployment, a drop-in path for standard subgraph queries. For the full GraphQL feature set, Envio also exposes a native endpoint, which is what Katana's app runs on.

### How do I migrate from The Graph to HyperIndex?

HyperIndex handlers are written in TypeScript, and AssemblyScript is a subset of TypeScript, so most handler logic carries across directly. Envio provides a [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide), a subgraph-compatible endpoint that preserves existing queries, and hands-on migration support.

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use Envio Cloud or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://x.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+kAIGElzPjApiMjI0) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
