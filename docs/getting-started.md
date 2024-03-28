---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
slug: /getting-started
---

## Installation

### Prerequisites

The following are the prerequisite packages required for Envio:

1. [Node.js](https://nodejs.org/en/download/current) (use [v18](https://nodejs.org/download/release/v18.18.0/) or newer)
2. [pnpm](https://pnpm.io/installation) (use v8 or newer)
3. [Docker Desktop](https://www.docker.com/products/docker-desktop/)

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

## Indexer Initalization

Once you have completed the installation step, you can initialize your own indexer via the following options:

### Examples

Clone one of the Example indexers that have been built using Envio.

> Please take note of the difference in version of Envio which the indexer was built on and the [latest version on npm](https://www.npmjs.com/package/envio).
> There may be some adjustments required to the indexer to be compatible with the latest version of Envio.

### Templates

Select either the `ERC20` or `Greeter` template following the `envio init` command.

More information on the `Greeter` template can be found [here](./greeter-tutorial).

### Contract Import

Generate an indexer based on a smart contract deployed on a blockchain.

More information on the Contract Import process can be found [here](./contract-import).

## Indexer Configuration

Indexers generated using examples, templates or the contract import process will work without any further configuration.

Users can further configure their indexers to perform custom logic, and the process is done via modifying the 3 files below:

- [`config.yaml`](./configuration-file)
- [`schema.graphql`](./schema)
- [`EventHandlers.*`](./event-handlers)

> (\* depending on the language chosen for indexer)

## Run the Indexer

### Run locally

Users can run the indexer locally without deploying, using [Docker](https://www.docker.com/products/docker-desktop/) and [Hasura](https://hasura.io/).

More information on running the indexer locally can be found [here](./running-locally).

### Deploy to Hosted Service

Once the indexer has been configured, you can deploy the indexer onto Envio's hosted service, via GitHub login.

More information on the hosted service can be found [here](./hosted-service).

---
