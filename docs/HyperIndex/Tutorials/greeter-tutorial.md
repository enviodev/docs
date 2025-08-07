---
id: greeter-tutorial
title: Indexing Greeter Contract Using Envio
sidebar_label: Greeter Tutorial
slug: /greeter-tutorial
---

# Indexing a Greeter Contract

## Introduction

This tutorial provides a step-by-step guide to indexing a simple Greeter smart contract deployed on multiple blockchains. You'll learn how to set up and run a multi-chain indexer using Envio's template system.

### What is the Greeter Contract?

The [Greeter contract](https://github.com/Float-Capital/hardhat-template) is a straightforward smart contract that allows users to store greeting messages on the blockchain. For this tutorial, we'll be indexing instances of this contract deployed on both **Polygon** and **Linea** networks.

### What You'll Build

By the end of this tutorial, you'll have:

- A functioning multi-chain indexer that tracks greeting events
- The ability to query these events through a GraphQL endpoint
- Experience with Envio's core indexing functionality

## Prerequisites

Before starting, ensure you have the following installed:

- **[Node.js](https://nodejs.org/en/download/current)** _(v22 or newer recommended)_
- **[pnpm](https://pnpm.io/installation)** _(v8 or newer)_
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** _(required to run the Envio indexer locally)_

> **Note:** Docker is specifically required to run your indexer locally. You can skip Docker installation if you plan only to use Envio's hosted service.

## Step 1: Initialize Your Project

First, let's create a new project using Envio's Greeter template:

1. Open your terminal and run:

```bash
pnpx envio init
```

2. When prompted for a directory, you can press Enter to use the current directory or specify another path:

```
? Set the directory: (.) .
```

3. Choose your preferred programming language for event handlers:

```
? Which language would you like to use?
> JavaScript
  TypeScript
  ReScript
```

4. Select the **Template** initialization option:

```
? Choose an initialization option
> Template
  Contract Import
```

5. Choose the **Greeter** template:

```
? Which template would you like to use?
> Greeter
  Erc20
```

After completing these steps, Envio will generate all the necessary files for your indexer project.

## Step 2: Understanding the Generated Files

Let's examine the key files that were created:

### `config.yaml`

This configuration file defines which networks and contracts to index:

```yaml
# Partial example
envio_node:
  networks:
    - name: polygon
      # ... Polygon network settings
      contracts:
        - name: Greeter
          address: "0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c"
          # ... contract settings
    - name: linea
      # ... Linea network settings
      contracts:
        - name: Greeter
          address: "0xdEe21B97AB77a16B4b236F952e586cf8408CF32A"
          # ... contract settings
```

### `schema.graphql`

This schema defines the data structures for the indexed events:

```graphql
type Greeting {
  id: ID!
  user: String!
  greeting: String!
  blockNumber: Int!
  blockTimestamp: Int!
  transactionHash: String!
}

type User {
  id: ID!
  latestGreeting: String!
  numberOfGreetings: Int!
  greetings: [String!]!
}
```

### `src/EventHandlers.js` (or `.ts`/`.res`)

This file contains the logic to process events emitted by the Greeter contract.

## Step 3: Start Your Indexer

> **Important:** Make sure Docker Desktop is running before proceeding.

1. Start the indexer with:

```bash
pnpm dev
```

This command:

- Launches Docker containers for the database and Hasura
- Sets up your local development environment
- Begins indexing data from the specified contracts
- Opens a terminal UI to monitor indexing progress

The indexer will retrieve data from both Polygon and Linea blockchains, starting from the blocks specified in your `config.yaml` file.

## Step 4: Interact with the Contracts

To see your indexer in action, you can write new greetings to the blockchain:

### For Polygon:

1. Visit the contract on [Polygonscan](https://polygonscan.com/address/0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c#writeContract)
2. Connect your wallet
3. Use the `setGreeting` function to write a new greeting
4. Submit the transaction

### For Linea:

1. Visit the contract on [Lineascan](https://lineascan.build/address/0xdEe21B97AB77a16B4b236F952e586cf8408CF32A#writeContract)
2. Connect your wallet
3. Use the `setGreeting` function to write a new greeting
4. Submit the transaction

Since this is a multi-chain example, you can interact with both contracts to see how Envio handles data from different blockchains simultaneously.

## Step 5: Query the Indexed Data

Now you can explore the data your indexer has captured:

1. Open Hasura at [http://localhost:8080](http://localhost:8080)
2. When prompted for authentication, use the password: `testing`
3. Navigate to the **Data** tab to browse the database tables
4. Or use the **API** tab to write GraphQL queries

### Example Query

Try this query to see the latest greetings:

```graphql
query GetGreetings {
  Greeting(limit: 10, order_by: { blockTimestamp: desc }) {
    id
    user
    greeting
    blockNumber
    blockTimestamp
    transactionHash
  }
}
```

## Step 6: Deploy to Production (Optional)

When you're ready to move from local development to production:

1. Visit the [Envio Hosted Service](https://envio.dev/app/login)
2. Follow the steps to deploy your indexer
3. Get a production GraphQL endpoint for your application

For detailed deployment instructions, see the [Hosted Service documentation](../Hosted_Service/hosted-service.md).

## What You've Learned

By completing this tutorial, you've learned:

- How to initialize an Envio project from a template
- How indexers process data from multiple blockchains
- How to query indexed data using GraphQL
- The basic structure of an Envio indexing project

## Next Steps

Now that you've mastered the basics, you can:

- Try the [Contract Import](../contract-import.md) feature to index any deployed contract
- Customize the event handlers to implement more complex indexing logic
- Add relationships between entities in your schema
- Explore the [Advanced Querying](../Advanced/loaders.md) features
- Create aggregated statistics from your indexed data

For more tutorials and examples, visit the [Envio Documentation](https://docs.envio.dev/) or join our [Discord community](https://discord.gg/envio) for support.
