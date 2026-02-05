---
id: self-hosting
title: Self-Hosting Guide
sidebar_label: Self-Hosting
slug: /self-hosting
description: Learn how to self-host Envio indexers with Docker, PostgreSQL, and Hasura for full control.
---

# Self-Hosting Your Blockchain Indexer

:::info
This documentation page is actively being improved. Check back regularly for updates and additional information.
:::

While Envio offers a fully managed [Hosted Service](./hosted-service.md), you may prefer to run your blockchain indexer on your own infrastructure. This guide covers everything you need to know about self-hosting Envio indexers.

:::note
We deeply appreciate users who choose our hosted service, as it directly supports our team and helps us continue developing and improving Envio's technology. If your use case allows for it, please consider the hosted option.
:::

## Why Self-Host?

Self-hosting gives you:

- **Complete Control**: Manage your own infrastructure and configurations
- **Data Sovereignty**: Keep all indexed data within your own systems

:::warning Disclaimer
Self Hosting can be done with a variety of different infrastructure, tools and methods. The outline below is merely a starting point and does not offer a full production level solution. In some cases advanced knowledge of infrastructure, database management and networking may be required for a full production level solution.
:::
## Prerequisites

Before self-hosting, ensure you have:

- Docker installed on your host machine
- Sufficient storage for blockchain data and the indexer database
- Adequate CPU and memory resources (requirements vary based on chains and indexing complexity)
- Required HyperSync and/or RPC endpoints
- Envio API token for HyperSync access (`ENVIO_API_TOKEN`) — required for continued access. See [API Tokens](/docs/HyperSync/api-tokens).

## Getting Started

In general, if you want to self-host, you will likely use a Docker setup.
For a working example, check out the [local-docker-example repository](https://github.com/enviodev/local-docker-example).
It contains a minimal `Dockerfile` and `docker-compose.yaml` that configure the Envio indexer together with PostgreSQL and Hasura.

## Configuration Explained

The compose file in that repository sets up three main services:

1. **PostgreSQL Database** (`envio-postgres`): Stores your indexed data
2. **Hasura GraphQL Engine** (`graphql-engine`): Provides the GraphQL API for querying your data
3. **Envio Indexer** (`envio-indexer`): The core indexing service that processes blockchain data

### Environment Variables

The configuration uses environment variables with sensible defaults. For production, you should customize:

- Envio API token (`ENVIO_API_TOKEN`)
- Database credentials (`ENVIO_PG_PASSWORD`, `ENVIO_PG_USER`, etc.)
- Hasura admin secret (`HASURA_GRAPHQL_ADMIN_SECRET`)
- Resource limits based on your workload requirements

## Getting Help

If you encounter issues with self-hosting:

- Check the [Envio GitHub repository](https://github.com/enviodev/hyperindex) for known issues
- Join the [Envio Discord community](https://discord.gg/envio) for community support

:::tip
For most production use cases, we recommend using the [Envio Hosted Service](./hosted-service.md) to benefit from automatic scaling, monitoring, and maintenance.
:::
