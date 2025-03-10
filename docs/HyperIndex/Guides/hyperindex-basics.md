---
id: hyperindex-basics
title: HyperIndex Basics
sidebar_label: HyperIndex Basics
slug: /hyperindex-basics
---

HyperIndex requires three main files to run your indexer. These files are automatically generated when initializing your indexer using:

```bash
pnpx envio init
```

---

## 📁 Required Files

The essential files to run HyperIndex are:

- **Configuration file** (`config.yaml`) – Defines indexing settings such as blockchain details, events to index, and advanced behaviors.
- **GraphQL Schema** (`schema.graphql`) – Defines the structure of your indexed data for efficient querying.
- **Event Handlers** (`src/EventHandlers.*`) – Contains the logic for processing blockchain events.

> **Note:** The file extension for Event Handlers (`*.ts`, `*.js`, or `*.res`) depends on the programming language chosen (TypeScript, JavaScript, or ReScript).

---

## 🚀 Running Your Indexer Locally

After initializing your indexer, you can run it locally using Docker and Hasura. Follow these steps:

### ✅ Starting the Indexer

1. Navigate to your project directory (if applicable):

```bash
cd your-indexer-directory
```

2. Ensure [Docker](https://www.docker.com/products/docker-desktop/) is running on your machine.

3. Start the indexer by running:

```bash
pnpm envio dev
```

This command automatically launches your local environment and opens the Hasura dashboard, where you can view indexed blockchain data.

**Local Hasura Admin Password:**

```
testing
```

---

### 🛑 Stopping the Indexer

When you're done, stop and clean up your local environment with:

```bash
pnpm envio stop
```

This will shut down and remove all Docker containers used for your local development environment.

---

## ☁️ Next Steps: Deploying Your Indexer

Once you've successfully tested your indexer locally, deploy it easily to Envio's cloud infrastructure:

- [Deploying to Envio's Hosted Service](./hosted-service)

---

For a detailed walkthrough, refer to the [Quickstart guide](../contract-import.md).

---
