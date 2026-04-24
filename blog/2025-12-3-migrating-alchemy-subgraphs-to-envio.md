---
title: How to Migrate Alchemy Subgraphs to Envio
sidebar_label: How to Migrate Alchemy Subgraphs to Envio
slug: /migrating-alchemy-subgraphs-to-envio
description: "Migrate Alchemy Subgraphs to Envio HyperIndex with a clean four-step flow. Keep your existing schema, avoid a full rebuild, and get fast real-time indexing."
image: /blog-assets/migrating-alchemy-subgraphs.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s", "nikbhintade"]
---

<img src="/blog-assets/migrating-alchemy-subgraphs.png" alt="Migrating from Alchemy to Envio" width="100%"/>

<!--truncate-->

:::note TL;DR
- Alchemy sunset Subgraph support on December 8th, 2025. Teams need a migration path that preserves their existing indexing logic and keeps data live without a full rebuild.
- Envio's HyperIndex accepts your existing schema and mapping logic, adds 143x faster backfills via HyperSync ([Sentio Uniswap V2 Factory benchmark, May 2025](https://github.com/enviodev/open-indexer-benchmark)), and includes 2 months of free hosting for all Alchemy users.
- The migration takes four steps: generate a new HyperIndex project, bring over your schema, move your mapping logic, and use migration cursors to avoid replaying from block zero.
:::

Alchemy sunset their Subgraph support on the **8th December 2025**. If you are running production workloads or preparing for mainnet, you need a stable home for your data and a migration path that keeps most of your existing work intact.

Envio gives you a clean and fast way to migrate your existing Alchemy Subgraphs into Envio's [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) so your data stays live, stable, and real-time. This guide covers exactly how to migrate your Alchemy Subgraph, what changes you need to make, and why Envio is the right destination for your migration.

## Why teams are migrating their Alchemy Subgraphs to Envio

With Alchemy having sunset its Subgraph support, teams need to move quickly. You still rely on your data, you still need your indexers, and rebuilding the entire stack is not realistic in the given timeframe. With Envio, you get:

- 143x faster backfills via HyperIndex
- Multichain indexing supported out of the box
- 2 months free hosting for all Alchemy users
- White-glove migration support tailored for Alchemy Subgraphs
- Support for your existing schema
- A migration flow that avoids a full rebuild
- Efficient access to real-time and historical data
- A seamless cutover to production-ready endpoints
- The option to run locally or fully hosted

Most importantly, Envio lets you bring your current indexing logic across and run it on a much faster setup.

Compared to The Graph (which Alchemy Subgraphs are based on), Envio uses a single `config.yaml` for all chains, delivers faster historical sync via HyperSync, and provides an active team that supports your migration directly.

## Before you migrate

Make sure you have:

- Your current Alchemy Subgraph
- Your ABI or contract addresses
- Node.js and pnpm installed
- Docker Desktop if you want to test locally (Windows users: [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) Windows Subsystem for Linux)

Envio supports both HyperIndex and HyperSync. For migrations, you will be using HyperIndex.

## How to migrate from Alchemy to Envio: a step-by-step guide

Here is the exact workflow to migrate an Alchemy Subgraph to Envio:

### 1. Generate a new HyperIndex project

Run:

```bash
pnpx envio init template --name alchemy-migration --directory alchemy-migration --template greeter --api-token "YOUR_ENVIO_API_KEY"
```

### 2. Bring over your schema

Take your existing Alchemy Subgraph schema and drop it into your new Envio project under the schema directory. If you need help mapping fields, the Envio migration team can do this for you.

### 3. Move over your mapping logic

Copy your Subgraph mappings into Envio mapping files. The structure is familiar if you have used The Graph or Alchemy Subgraphs before. Events and handlers work the same way, so this step should feel straightforward.

### 4. Use migration cursors

Envio has a dedicated migration cursor flow so you do not have to replay your entire chain from block zero. This saves hours for larger projects.

After this, you can run the indexer locally with Docker or deploy directly to [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service). Once deployed, your indexer will sync with HyperSync-level speed.

If you prefer hands-on help, or would like the team to check your setup, you can book a free migration call [here](https://envio.dev/alchemy-migration). Alternatively, reach out in [Discord](https://discord.gg/envio).

## What changes when you leave Alchemy?

Most of your stack stays the same. Here is what changes:

- You are no longer tied to a provider that is ending support
- You get faster indexing with real-time data
- You get an active team supporting your indexers
- You get a future-proof path that consistently scales with you

Your application code stays untouched. Queries stay close to what you already use. And you get more reliability as soon as you deploy.

## Conclusion

Alchemy stepping away from Subgraphs does not mean your project has to stop. Migrating to Envio is fast, stable, and gives you a more reliable long-term foundation for your data.

Book a [migration call](https://envio.dev/alchemy-migration), move your Subgraphs, and keep shipping without interruption.

## Frequently asked questions

### How long does it take to migrate an Alchemy Subgraph to Envio?

Most straightforward migrations can be completed in a few hours to a day, depending on the complexity of your schema and handler logic. Envio offers white-glove migration support and free migration calls for Alchemy users, and the four-step process is designed to preserve your existing work as much as possible.

### Do I need to re-sync from block zero when migrating?

No. Envio has a dedicated migration cursor flow that lets you continue from your current sync position rather than replaying the entire chain history. This is particularly important for large or long-running indexers where a full resync would take hours or days.

### Will my existing GraphQL queries still work after migrating to Envio?

Queries will be very similar. HyperIndex uses a GraphQL API structure that is familiar to anyone who has used The Graph or Alchemy Subgraphs. Field names and filtering conventions may require minor adjustments, but your application logic generally remains intact.

### How does Envio compare to The Graph as an Alchemy Subgraph replacement?

The Graph is the closest architectural equivalent to Alchemy Subgraphs, but it has the same limitations: separate subgraph per chain, slower historical sync, and no native multichain support. Envio delivers 143x faster backfills via HyperSync, supports multichain indexing from a single config, and includes an active team for migration support.

### Is there a free tier on Envio Cloud for migrating teams?

Yes. Alchemy users get 2 months of free hosting when migrating to Envio. A permanent free development tier is also available for all developers. Production tiers with SLA guarantees are available for teams that need them.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
