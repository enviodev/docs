---
title: "Dedicated Hosting for Blockchain Indexers"
sidebar_label: Dedicated Hosting for Blockchain Indexers
slug: /powers-of-dedicated-hosting-for-web3-dapps
description: "What dedicated hosting means for blockchain indexer developers, how Envio Cloud handles infrastructure, and why managed hosting reduces development overhead."
image: /blog-assets/envio-dedicated-hosting.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/envio-dedicated-hosting.png" alt="Dedicated Hosting for Blockchain Indexers" width="100%"/>

<!--truncate-->

:::note TL;DR
- Running a blockchain indexer in production requires a database, a GraphQL API layer, uptime monitoring, and infrastructure that scales with your data.
- Envio Cloud handles all of this as a managed service, so teams can focus on handler logic rather than infrastructure.
- Self-hosting via Docker is also supported for teams that want full infrastructure control.
:::

Deploying a blockchain indexer locally is straightforward. Keeping one running reliably in production is a different problem. You need a database, a GraphQL API layer, uptime guarantees, and a deployment process that does not require manual intervention every time your handler logic changes.

This article covers what a dedicated hosted indexer service provides, how Envio Cloud works, and how to decide between managed hosting and self-hosting.

## What a Hosted Indexer Service Provides

A hosted indexer service takes your indexer configuration, schema, and handler code and runs the full stack for you. This includes:

- **Database**: Storing indexed events and entity tables
- **GraphQL API**: Auto-generated from your schema via Hasura, queryable by your frontend
- **Uptime**: The service monitors availability and handles restarts automatically
- **Deployment**: Syncing from your repository so new versions deploy without manual steps

Without a hosted service, each of these components needs to be provisioned, maintained, and scaled independently. For teams focused on building a product rather than managing infrastructure, this is significant overhead.

## How Envio Cloud Works

[Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service) is the managed hosting option for HyperIndex. It runs on AWS infrastructure with Kubernetes orchestration and Hasura for the GraphQL layer.

Deployment is integrated with GitHub. An Envio GitHub bot monitors your repository and triggers new deployments when changes land in your specified branch. There is no manual deploy step once the integration is configured.

The stack Envio Cloud manages:

- **AWS**: Cloud infrastructure and compute
- **Kubernetes**: Container orchestration and scaling
- **Hasura**: Real-time GraphQL API generation from your schema
- **HyperSync**: The data engine powering historical sync, up to 2000x faster than standard RPC

For local development, the full stack runs with a single `pnpm dev` command using Docker Desktop. The same handler logic runs locally and in production without modification.

## Managed Hosting vs Self-Hosting

HyperIndex supports both options:

| | Envio Cloud | Self-hosted (Docker) |
|---|---|---|
| Infrastructure setup | Handled by Envio | You manage |
| Uptime monitoring | Included | You manage |
| Deployment | GitHub bot auto-deploy | Manual or custom CI |
| Cost | Free tier and paid plans | Your infrastructure costs |
| Control | Standard configuration | Full control |

For most teams, Envio Cloud is the faster path to production. For teams with specific compliance requirements or existing infrastructure preferences, self-hosting via Docker gives full control without changing any handler code.

## Getting Started

Deploy to Envio Cloud from the [hosted service docs](https://docs.envio.dev/docs/HyperIndex/hosted-service). If you do not have an indexer yet, the contract import quickstart generates a working indexer from any deployed contract address in under 5 minutes:

```bash
pnpx envio init
```

## Frequently asked questions

### What infrastructure does Envio Cloud run on?

Envio Cloud uses AWS for compute, Kubernetes for orchestration, and Hasura for the GraphQL API layer. HyperSync powers historical data retrieval for all supported networks.

### How does deployment work with Envio Cloud?

Envio Cloud integrates with GitHub via a bot that monitors your repository. When changes land in your configured branch, a new deployment is triggered automatically.

### Can I self-host HyperIndex instead of using Envio Cloud?

Yes. HyperIndex can be self-hosted using Docker. The same handler logic and schema work identically in both environments. See the [hosting docs](https://docs.envio.dev/docs/HyperIndex/hosted-service) for setup instructions.

### What is included in the free tier?

See the [Envio Cloud docs](https://docs.envio.dev/docs/HyperIndex/hosted-service) for current plan details and limits.

### Does Envio Cloud support multichain indexers?

Yes. A single HyperIndex instance can index multiple networks and all data is queryable through one GraphQL endpoint, whether hosted on Envio Cloud or self-hosted.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
