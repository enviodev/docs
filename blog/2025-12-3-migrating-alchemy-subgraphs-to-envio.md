---
title: How to Migrate Alchemy Subgraphs to Envio
sidebar_label: How to Migrate Alchemy Subgraphs to Envio
slug: /blog/migrating-alchemy-subgraphs-to-envio
description: "Migrate your Alchemy Subgraphs to Envio’s HyperIndex with a clean four step flow. Keep your existing schema, avoid a full rebuild, and get fast real-time indexing."
---

<img src="/blog-assets/migrating-alchemy-subgraphs.png" alt="Migrating from Alchemy to Envio" width="100%"/>

Alchemy is sunsetting their Subgraph support on the **8th December 2025**. If you are running production workloads or preparing for mainnet, you need a stable home for your data and a migration path that keeps most of your existing work intact.

Envio gives you a clean and fast way to easily migrate your existing Alchemy Subgraphs into Envio’s [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) so your data stays live, stable and real-time. This guide covers exactly how to migrate your Alchemy Subgraph, what changes you need to make and why Envio is the best place to migrate your Alchemy Subgraphs.


## Why Teams are Migrating their Alchemy Subgraphs to Envio:

With Alchemy sunsetting its Subgraph support, a lot of builders are in the same position. You still rely on your data, you still need your indexers, and rebuilding the entire stack is not realistic in the given timeframe. With Envio, you get:

• 143x faster backfills on HyperIndex

• Multichain indexing supported out of the box

• 2 months free hosting for all Alchemy users

• White-glove migration support tailored for Alchemy Subgraphs

• Support for your existing schema

• A migration flow that avoids a full rebuild

• Efficient access to real-time and historical data

• A seamless cutover to production-ready endpoints

• The option to run locally or fully hosted

And much more! 

Most importantly, Envio lets you bring your current indexing logic across and run it on a much faster setup.


## Before you Migrate

Make sure you have:

• Your current Alchemy Subgraph

• Your ABI or contract addresses

• Node.js and pnpm installed

• Docker Desktop if you want to test locally (Windows Users:

[WSL](https://learn.microsoft.com/en-us/windows/wsl/install) Windows Subsystem for Linux)

Envio supports both HyperIndex and HyperSync. For migrations, you will be using HyperIndex.


## How to Migrate from Alchemy to Envio: A Step-by-step Guide

Here is the exact workflow to migrate an Alchemy Subgraph to Envio:


### 1. Generate a new HyperIndex project


Run:




#### 2. Bring over your schema

Take your existing Alchemy Subgraph schema and drop it into your new Envio project under the schema directory. If you need help mapping fields, our migration team can do this for you.


#### 3. Move over your mapping logic

Copy your Subgraph mappings into Envio mapping files. The structure is familiar if you have used The Graph or Alchemy Subgraphs before. Events and handlers work the same way, so this step should feel straightforward.


#### 4. Use migration cursors

Envio has a dedicated migration cursor flow so you do not have to replay your entire chain from block zero. This saves hours for larger projects.

After this, you can run the indexer locally with Docker or deploy directly to [Envio’s hosted service](https://docs.envio.dev/docs/HyperIndex/hosted-service). Once deployed, your indexer will sync with HyperSync-level speed.

If you prefer hands-on help, or would like our team to check your setup, you can book a free migration call [here](https://envio.dev/alchemy-migration). Alternatively, feel free to reach out to us in our [Discord](https://discord.gg/HTuf8Jf9xZ).


## What changes when you leave Alchemy?

Most of your stack stays the same. Here is what changes:


• You are no longer tied to a provider that is ending support

• You get faster indexing with real-time data

• You get an active team supporting your indexers

• You get a future-proof path that consistently scales with you

Your application code stays untouched. Queries stay close to what you already use. And you get more reliability as soon as you deploy.


## Conclusion

Migrate faster, not harder. Alchemy stepping away from Subgraphs does not mean your project has to stop. Migrating to Envio is fast, stable and gives you a more reliable long-term foundation for your data.

Book a [migration call](https://envio.dev/alchemy-migration), move your Subgraphs and keep shipping without interruption.


## About Envio

[Envio](https://envio.dev) is a fast, developer-friendly blockchain indexer that makes real-time data accessible for builders migrating their Subgraphs across from Alchemy and Web3.

With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing solution supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.

If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev)
