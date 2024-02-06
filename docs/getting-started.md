---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
slug: /getting-started
---

## Installation

### Prerequisites

The following are the prerequisite packages required for Envio:

1. [<ins>Node.js</ins>](https://nodejs.org/en/download/current) (use [v18](https://nodejs.org/download/release/v18.18.0/) or newer)
2. [<ins>pnpm</ins>](https://pnpm.io/installation) (use v8 or newer)
3. [<ins>Docker Desktop</ins>](https://www.docker.com/products/docker-desktop/)

Docker is required specifically for running the Envio indexer locally.

### Install Envio

You can install Envio by running the command below:

```bash
npm i -g envio
```

Command to see available CLI commands for Envio.

```bash
envio --help
```

## Initialize your indexer

Once you have completed the installation step, you can initialize your own indexer via the following options:

### Examples

Clone one of the indexer repos under Examples tab, which have been built to demonstrate the power of Envio indexer.

Please take note of the difference in version of Envio which the indexer was built on and the [latest version on npm](https://www.npmjs.com/package/envio).
There may be some adjustments required to the indexer to be compatible with the latest version of Envio.

### Templates

Select either the `ERC20` or `Greeter` template following the `envio init` command.

More information on the `Greeter` template can be found [here](./greeter-tutorial.md).

### Contract Import

Generate an indexer based on a smart contract deployed on a blockchain.

More information on the Contract Import process can be found [here](./contract-import.md).

### Subgraph Migration

Generate an indexer from a subgraph that is deployed to theGraph's hosted service.

More information on the Subgraph Migration can be found [here](./subgraph-migration.md).

---
