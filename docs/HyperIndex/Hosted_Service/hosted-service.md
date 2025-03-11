---
id: hosted-service
title: Overview
sidebar_label: Overview
slug: /hosted-service
---

# Envio Hosted Service

Envio offers a fully managed hosting solution for your indexers, providing all the infrastructure, scaling, and monitoring needed to run production-grade indexers without operational overhead.

## Key Features

- **Git-based Deployments**: Similar to Vercel, deploy your indexer by simply pushing to a designated deployment branch
- **Zero Infrastructure Management**: We handle all the servers, databases, and scaling for you
- **Version Management**: Switch between different deployed versions of your indexer with one click
- **Built-in Monitoring**: Track performance, errors, and usage through our dashboard
- **GraphQL API**: Access your indexed data through a performant GraphQL endpoint
- **Multi-chain Support**: Deploy indexers that track multiple networks from a single codebase

## Deployment Model

The Envio Hosted Service connects directly to your GitHub repository:

1. Connect your GitHub repository to the Envio platform
2. Configure your deployment settings (branch, config file location, etc.)
3. Push changes to your deployment branch to trigger automatic deployments
4. View deployment logs and status in real-time
5. Switch between versions or rollback if needed

You can view and manage your hosted indexers in the [Envio Explorer](https://envio.dev/explorer).

## Deployment Options

Envio provides flexibility in how you deploy and host your indexers:

- **Fully Managed Hosted Service**: Let Envio handle everything (recommended for most users)
- **Self-Hosting**: Run your indexer on your own infrastructure with our Docker container

:::info
For self-hosting information and instructions, see our [Self-Hosting Guide](/docs/HyperIndex/self-hosting).
For a complete list of CLI commands to control your indexer, see the [CLI Commands documentation](../Guides/cli-commands.md).
:::
