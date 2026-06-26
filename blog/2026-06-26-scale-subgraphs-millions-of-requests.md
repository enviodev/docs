---
title: How to Scale Subgraphs to Millions of Requests
sidebar_label: How to Scale Subgraphs to Millions of Requests
tags: [tutorial]
slug: /scale-subgraphs-millions-of-requests
description: "Scaling subgraph-style data to millions of requests is two problems: sync speed and query latency. How HyperIndex handles both while keeping your data model intact."
image: /blog-assets/scale-subgraphs-millions-of-requests.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-06-26
  author: Jordyn Laurier
---

<img src="/blog-assets/scale-subgraphs-millions-of-requests.png" alt="How to Scale Subgraphs to Millions of Requests" width="100%"/>

<!--truncate-->

:::note TL;DR
- "Scale my subgraphs" is two separate problems. Sync speed is how fast events become rows. Query latency is how fast reads return once they are rows. Fixing one does not fix the other.
- On sync speed, HyperIndex is the best indexer in independent testing. See the [Sentio benchmarks](https://docs.envio.dev/docs/HyperIndex/benchmarks) for the numbers.
- On query latency, HyperIndex serves reads from a dedicated Postgres database through your own GraphQL endpoint, not through a shared gateway, so read performance is predictable under load.
- You keep the data model. Katana moved two production SushiSwap subgraphs entity-for-entity: 23 entity types, carried across without schema redesign. Polymarket replaced 8 subgraphs with one indexer that has processed over 6.5 billion events.
- For high-throughput production workloads, Envio Cloud's production plans add higher resource and query rate limits plus zero-downtime deployments, and Dedicated plans carry custom SLAs and SQL access alongside GraphQL.
:::

Subgraphs are usually adopted when an app is small and queries are light. The pain starts later, when the frontend is making millions of requests, and the dashboard needs fresh data under load. At that point, teams search for how to scale their subgraphs, and most of the advice they find addresses the wrong half of the problem.

## Scaling Is Two Problems, Not One

Sync speed and query latency are different bottlenecks with different fixes.

Sync speed determines how quickly onchain events land in your database, which sets data freshness and how painful a re-deploy or backfill is. Query latency determines how fast your API answers once the data is already indexed, which is what your users actually feel.

A subgraph at scale typically hurts on both ends. Backfills take hours or days, and reads route through shared serving infrastructure you do not control and cannot provision for your traffic.

## Sync Speed

HyperIndex pulls data through HyperSync, Envio's Rust data engine, rather than paginated RPC reads. Independent benchmarks put it at 8 seconds for the Uniswap V2 Factory workload, 142x faster than The Graph on the same test. See the [full benchmark methodology](https://docs.envio.dev/docs/HyperIndex/benchmarks). Fast sync at this layer is what makes everything downstream cheap, because a schema change means re-syncing in hours rather than weeks.

## Query Latency: The Half Nobody Benchmarks

HyperIndex processes events into Postgres and serves them through an auto-generated GraphQL API on your own endpoint. Your reads hit a relational database provisioned for your indexer, not a shared gateway. That is what keeps read latency predictable as request volume grows.

The Hasura-powered endpoint supports the full filter and ordering syntax your users need. A dashboard showing a specific address's trade history looks like this:

```graphql
query AddressActivity($address: String!) {
  Trade(
    where: { maker: { _eq: $address } }
    order_by: { blockNumber: desc }
    limit: 100
  ) {
    id
    maker
    amountIn
    amountOut
    blockNumber
  }
}
```

Full query reference at [docs.envio.dev/docs/HyperIndex/navigating-hasura](https://docs.envio.dev/docs/HyperIndex/navigating-hasura).

For traffic in the millions of requests, Envio Cloud production plans are sized for high-throughput indexers, with zero-downtime deployments so a new indexer version promotes to the production endpoint without consumers seeing a change. Dedicated plans add custom SLAs and SQL access alongside GraphQL when an ORM or direct queries fit your backend better.

## You Keep the Data Model

The reason teams hesitate to leave subgraphs is the rebuild. With HyperIndex, the schema migration is close to copy-paste, the [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide) covers the differences, and handlers move from AssemblyScript to plain TypeScript.

Katana migrated two production SushiSwap subgraphs from The Graph with the data model carried over entity-for-entity, all 23 entity types, tracking the Uniswap V3 factory, position manager, and every pool it deploys. Same entities, same shape. Their SushiSwap V3 indexer synced in about two hours. The Sushi staker was done in under 20 seconds. Read the [full case study](https://docs.envio.dev/blog/case-study-katana-sushiswap) on our blog.

The [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) compares both endpoints field by field, so you can prove parity before switching traffic.

## Where to Start

If your subgraph is hitting its ceiling, the path is short. Scaffold an indexer, port the schema, migrate your handlers and config across, following the [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide), then point the migration validator at both endpoints:

```bash
pnpx envio init
```

Envio also offers white-glove migration support for production teams. Reach out on [Discord](https://discord.gg/envio).

## Frequently Asked Questions

### Why Is My Subgraph Slow at High Request Volume?

Usually for two unrelated reasons. Historical sync is slow because data arrives over paginated RPC-style reads. Query latency is variable because reads route through shared serving infrastructure sized for the network rather than your traffic. Diagnose which one you are hitting before paying to fix the wrong one.

### Can a HyperIndex Endpoint Handle Millions of GraphQL Requests?

HyperIndex serves queries from a dedicated Postgres database behind your own GraphQL endpoint, and Envio Cloud production plans are sized for high-throughput workloads, with Dedicated plans adding custom SLAs. The endpoint is yours, not a shared gateway, so read performance does not degrade when your app gets busy.

### Do I Lose My Subgraph Schema When Moving to HyperIndex?

No. The schema migration is close to copy-paste, with small differences like dropping the `@entity` directive. Katana's SushiSwap V3 migration carried 23 entity types across without schema redesign, and the open-source Indexer Migration Validator verifies that both endpoints return matching data before you cut over.

### Does Fast Indexing Actually Improve My API Response Times?

Not directly. Anyone who tells you otherwise is skipping a step. Indexing speed sets data freshness and backfill cost. Response times depend on the serving layer, which for HyperIndex is your own Postgres-backed GraphQL endpoint rather than a shared gateway. You need both halves to scale.

### What Envio Cloud Plan Do I Need for High-Traffic Production Workloads?

For production workloads, use one of the paid plans rather than the dev tier. Paid production plans include zero-downtime deployments, higher limits, and higher query rate limits. Dedicated plans additionally include custom SLAs, isolated infrastructure, and SQL access alongside the GraphQL endpoint. Current [pricing and plan details](https://docs.envio.dev/docs/HyperIndex/hosted-service-billing) can be found in our docs.

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use Envio Cloud or self-host. If you're building onchain, come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev)
