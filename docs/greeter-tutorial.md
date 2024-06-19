---
id: greeter-tutorial
title: Indexing Greeter contract using Envio
sidebar_label: Greeter Tutorial
slug: /greeter-tutorial
---

This tutorial will take you through a step by step guide to indexing a live Greeter smart contract using Envio.

## Background

### [Greeter contract](https://github.com/Float-Capital/hardhat-template)

The Greeter contract is a very simple smart contract that allows a user to write a greeting message on the blockchain.

The Greeter contract is deployed on both the Polygon and the Linea blockchain. Following this tutorial will index events from both chains.

### [Envio](https://envio.dev)

Envio is a framework for developing a backend to index and aggregate blockchain data into a graphQL query-able database.

## Prerequisites

### Environment tooling

1. [<ins>Node.js</ins>](https://nodejs.org/en/download/current) we recommend using something like [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to install Node
1. [<ins>pnpm</ins>](https://pnpm.io/installation)
1. [<ins>Docker Desktop</ins>](https://www.docker.com/products/docker-desktop/)

### Install Envio

```bash
npm i -g envio
```

## Step by step instructions

### Initialize the project

Initialize the project using the Greeter template.

Run

```bash
envio init
```

Name your indexer

```bash
? Name your indexer: (My Envio Indexer)
```

Choose the directory where you would like to setup your project (default is the current directory)

```bash
? Set the directory:  (.) .
```

Then choose a language of your choice for the event handlers.

```bash
? Which language would you like to use?
> JavaScript
  TypeScript
  ReScript
[↑↓ to move, enter to select, type to filter]
```

Select to start from a template

```bash
? Choose an initialization option
> Template
  Contract Import
  Subgraph Migration (Experimental)
[↑↓ to move, enter to select, type to filter]
```

Choose `Greeter` when prompted to choose template.

```bash
? Which template would you like to use?
> Greeter
  Erc20
[↑↓ to move, enter to select, type to filter]
```

### Start the indexer

> Dev note: 📢 make sure you have docker open

The following commands will start the docker and create databases for indexed data, make sure to re-run `dev` if you make changes to the files

Run

```bash
envio dev
```

The indexer will then start indexing the contract's specified in the `config.yaml` file from the `start_block` specified for each network.

### Write to the contracts on Polygon and Linea using the block explorers

Once the indexer is running, you can call functions on the Greeter contract that is deployed on Polygon and Linea, using the respective network's blockchain explorer.

For Polygon, navigate to the contract on [Polygonscan](https://polygonscan.com/address/0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c#writeContract) and the call `setGreeting` function.

For Linea, navigate to the contract on [Lineascan](https://lineascan.build/address/0xdEe21B97AB77a16B4b236F952e586cf8408CF32A#writeContract) and call the `setGreeting` function.

In the case of a multi-chain indexing example, you can call the `setGreeting` function on _both_ contracts.

### View the indexed results

You can view the indexed results on a local Hasura server.

```bash
open http://localhost:8080
```

The hasura admin-secret / password is `testing` and the tables can be viewed in the `data` tab or queried from the playground

### Deploy the indexer onto the hosted service

Once you have verified that the indexer is working for the Greeter contracts, then you are ready to deploy the indexer onto our hosted service.

Deploying an indexer onto the hosted service allows you to extract information via graphQL queries into your front-end or some back-end application.

Navigate to the [hosted service](https://envio.dev/app/login) to start deploying your indexer and refer to this [documentation](./hosted-service.md) for more information on deploying your indexer.

### What next?

Once you have successfully finished the Greeter tutorial, you are ready to become a blockchain indexing wizard!

Jump into [Importing Contracts](./contract-import.md) page to generate a basic indexing template for a contract that is deployed on blockchain!

You can also start to modify the handlers to your own custom indexing logic.
