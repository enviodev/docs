---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
slug: /getting-started
---

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/LNhaN-Cikis" title="Envio - Getting Started Guide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## 🚀 Quick Setup

Follow these simple steps to quickly get started building indexers with **Envio**.

---

## ✅ Prerequisites

Ensure your system meets the following requirements before initializing your indexer:

- **[Node.js](https://nodejs.org/en/download/current)** _(v18 or newer recommended)_
- **[pnpm](https://pnpm.io/installation)** _(v8 or newer)_
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** _(required to run the Envio indexer locally)_

> **Note:** Docker is specifically required to run your indexer locally. You can skip Docker installation if you plan only to use Envio's hosted service.

---

## ⚙️ Initialize Your Indexer

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

---

## 🛠️ Configure Your Indexer

After initialization, you can customize your indexer further by modifying these essential files:

- **[`config.yaml`](./configuration-file)** – Adjust indexing parameters, blockchain endpoints, and more.
- **[`schema.graphql`](./schema)** – Define the GraphQL schema for indexed data.
- **[`EventHandlers.*`](./event-handlers)** – Write custom logic for processing blockchain events.

> The exact naming of `EventHandlers` depends on your selected programming language.

---

## ▶️ Running Your Indexer

### 🖥️ Run Locally ([docs →](./running-locally))

You can easily test and run your indexer locally using:

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**
- **[Hasura](https://hasura.io/)** (provides GraphQL API access)

Follow our [guide to running the indexer locally](./running-locally) for detailed instructions.

### ☁️ Deploy to Hosted Service ([docs →](./hosted-service))

Once you're ready, effortlessly deploy your configured indexer to Envio's hosted service and begin querying your endpoint immediately.

Check out our [hosted service documentation](./hosted-service) for details on deployment and usage.

---

## 🎯 Next Steps

- [Understanding Envio Indexers](./what-is-envio)
- [Advanced Configuration](./advanced-configuration)
- [Best Practices and Performance Tips](./best-practices)
