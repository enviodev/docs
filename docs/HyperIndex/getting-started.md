---
id: getting-started
title: Getting Started with Envio
sidebar_label: Getting Started
slug: /getting-started
description: Get started with Envio indexer setup, templates, and local or hosted deployment quickly.
---

Learn how to create and run an indexer with Envio’s HyperIndex, from initialization to local testing and deployment.

## Indexer Initialization

### Prerequisites

- **[Node.js](https://nodejs.org/en/download/current)** _(v22 or newer recommended)_
- **[pnpm](https://pnpm.io/installation)** _(v8 or newer)_
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** _(required to run the Envio indexer locally)_

> **Note:** Docker is required only if you plan to run your indexer locally. You can skip installing Docker if you'll only be using Envio's hosted service.

#### Additionally for Windows Users:

- **[WSL](https://learn.microsoft.com/en-us/windows/wsl/install)** _Windows Subsystem for Linux_

---

## Initialize Your Indexer

Envio provides several ways to initialize an indexer depending on your needs:

### 1. Quickstart ([recommended →](./contract-import))

Automatically generate an indexer based on one or more smart contracts deployed on a blockchain. Ideal for rapid development.

### 2. Templates

Quickly create an indexer using pre-defined templates:

- **ERC20** Template (Token standard)
- **Greeter** Template ([docs →](./greeter-tutorial))

Run the following command to initialize using a template:

```bash
pnpx envio init
```

Select your preferred template from the interactive prompt.

### 3. Examples

Use existing example indexers as a starting point. You can find these examples in:

- [Envio Explorer](https://envio.dev/explorer)
- [Tutorials](./tutorial-erc20-token-transfers)
- [GitHub Repositories](https://github.com/enviodev)

> **Important:** Always verify the Envio version used by the example indexer matches the [latest npm version](https://www.npmjs.com/package/envio). You may need minor adjustments to ensure compatibility.

<iframe width="560" height="315" src="https://www.youtube.com/embed/LNhaN-Cikis" title="Envio - Getting Started Guide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## Essential Files

After initialization, your indexer will contain three main files that are essential for its operation:

1. **[`config.yaml`](./configuration-file)** – Defines indexing settings such as blockchain endpoints, events to index, and advanced behaviors.
2. **[`schema.graphql`](./schema)** – Defines the GraphQL schema for indexed data and its structure for efficient querying.
3. **[`src/EventHandlers.*`](./event-handlers)** – Contains the logic for processing blockchain events.

> **Note:** The file extension for Event Handlers (`*.ts`, `*.js`, or `*.res`) depends on the programming language chosen (TypeScript, JavaScript, or ReScript).

You can customize your indexer by modifying these files to meet your specific requirements.

---

## Running Your Indexer

### Run Locally

You can easily test and run your indexer locally using Docker and Hasura by following these steps:

1. Navigate to your project directory (if applicable):

```bash
cd your-indexer-directory
```

2. Ensure [Docker](https://www.docker.com/products/docker-desktop/) is running on your machine.

3. Start the indexer by running:

```bash
pnpm dev
```

This command automatically launches your local environment and opens the Hasura dashboard, where you can view indexed blockchain data.

**Local Hasura Admin Password:**

```
testing
```

#### Stopping the Indexer

When you're done, stop and clean up your local environment with:

```bash
pnpm envio stop
```

This will shut down and remove all Docker containers used for your local development environment.

For more detailed instructions, refer to our [guide to running the indexer locally](./running-locally).

### Deploy to Hosted Service

Once you're ready, effortlessly deploy your configured indexer to Envio's hosted service and begin querying your endpoint immediately.

Check out our [hosted service documentation](./hosted-service) for details on deployment and usage.

---

For a complete walkthrough of the process, refer to the [Quickstart guide](./contract-import).
