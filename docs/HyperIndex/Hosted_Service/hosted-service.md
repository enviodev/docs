---
id: hosted-service
title: Overview
sidebar_label: Overview
slug: /hosted-service
---

# Envio Hosted Service

Envio offers a fully managed hosting solution for your indexers, providing all the infrastructure, scaling, and monitoring needed to run production-grade indexers without operational overhead.

Our hosted service offers multiple tiers to suit different needs, from free development environments to enterprise-grade dedicated hosting. Each tier includes powerful features like static production endpoints, built-in alerts, and production-ready infrastructure.

## Key Features

- **Git-based Deployments**: Similar to Vercel, deploy your indexer by simply pushing to a designated deployment branch
- **Zero Infrastructure Management**: We handle all the servers, databases, and scaling for you
- **Static Production Endpoints**: Consistent URLs with zero-downtime deployments and instant version switching
- **Built-in Monitoring**: Track logs, sync status, and deployment health in real-time
- **Comprehensive Alerting**: Multi-channel notifications (Discord, Slack, Telegram, Email) for critical issues, performance warnings, and deployment updates
- **Security Features**: IP/Domain whitelisting to control access to your indexer endpoints
- **GraphQL API**: Access your indexed data through a performant, production-ready GraphQL endpoint
- **Multi-chain Support**: Deploy indexers that track multiple networks from a single codebase

## Deployment Model

The Envio Hosted Service provides a seamless GitHub-integrated deployment workflow:

1. **GitHub Integration**: Install the Envio Deployments GitHub App to connect your repositories
2. **Flexible Configuration**: Support for monorepos with configurable root directories, config file locations, and deployment branches
3. **Automatic Deployments**: Push to your deployment branch to trigger builds and deployments
4. **Version Management**: Maintain multiple deployment versions with one-click switching and rollback capabilities
5. **Real-time Monitoring**: Track deployment progress, logs, and sync status through the dashboard

**Multiple Indexers**: Deploy several indexers from a single repository using different configurations, branches, or directories.

You can view and manage your hosted indexers in the [Envio Explorer](https://envio.dev/explorer).

## Deployment Options

Envio provides flexibility in how you deploy and host your indexers:

- **Fully Managed Hosted Service**: Let Envio handle everything (recommended for most users)
- **Self-Hosting**: Run your indexer on your own infrastructure with our Docker container

## Getting Started

- **[Features](./hosted-service-features.md)** - Learn about all available hosted service features
- **[Deployment Guide](./hosted-service-deployment.md)** - Step-by-step instructions for deploying your indexer
- **[Pricing & Billing](./hosted-service-billing.mdx)** - Compare tiers and pricing options
- **[Self-Hosting](./self-hosting.md)** - Run your indexer on your own infrastructure

:::info
For a complete list of CLI commands to control your indexer, see the [CLI Commands documentation](../Guides/cli-commands.md).
:::
