---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
slug: /getting-started
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/LNhaN-Cikis" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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

### Quickstart

Generate an indexer quickly based on one or more smart contract/s deployed on a blockchain. 

More information on the Quickstart can be found [here](./contract-import).

### Templates

Select either the `ERC20`, `Greeter`, or `Blank` template following the `envio init` command.

More information on the `Greeter` template can be found [here](./greeter-tutorial).

### Examples

Clone one of the example indexers that have been built using Envio. Reference indexers can be found via our [Explorer](https://envio.dev/explorer), [Tutorials](./tutorial-erc20-token-transfers), or in our [GitHub](https://github.com/enviodev).

> Please take note of the difference in the version of Envio which the indexer was built on and the [latest version on npm](https://www.npmjs.com/package/envio). There may be some adjustments required to the indexer to be compatible with the latest version of Envio.

## Indexer Configuration

Indexers generated using  the Quickstart, templates or examples will work without any further configuration.

Users can further configure their indexers to perform custom logic, and the process is done by modifying the 3 files below:

- [`config.yaml`](configuration-file)
- [`schema.graphql`](./schema)
- [`EventHandlers.*`](./event-handlers)

> (\* depending on the language chosen for the indexer)

## Run the Indexer

### Run locally

Users can run the indexer locally without deploying, using [Docker](https://www.docker.com/products/docker-desktop/) and [Hasura](https://hasura.io/).

More information on running the indexer locally can be found [here](./running-locally).

### Deploy to Hosted Service

Once the indexer has been configured, you can easily deploy your indexer to Envio's hosted service and start querying your endpoint. 

More information on the hosted service can be found [here](./hosted-service).

---
