---
id: contract-import
title: Importing Contracts
sidebar_label: Importing Contracts
slug: /contract-import
---

<sub><sup> NOTE: Contract Import functionality is in experimental state 👷‍♀️👷 </sup></sub>

This page explains how to initialize an indexer using a contract that is already deployed on a blockchain.
This process allows users to quickly and easily start up an indexer with basic logic using Envio given a deployed contract.

## Import the project configuration using contract address

### Initialize `envio`

```bash
envio init
```

### Name your indexer

```bash
? Name your indexer: (My Envio Indexer)
```

### Choose the project directory (default is the current directory)

```bash
? Set the directory:  (.) .
```

### Choose a language of your choice for the event handlers

```bash
? Which language would you like to use?
> "Javascript"
  "Typescript"
  "Rescript"
[↑↓ to move, enter to select, type to filter]
```

### Select `ContractImport` initialization option

```bash
? Choose an initialization option
  Template
  SubgraphMigration
> ContractImport
[↑↓ to move, enter to select, type to filter]
```

### Select `Explorer or Local` option

```bash
? Would you like to import from a block explorer or a local abi?
> Explorer
  Local
```

In this example we will select explorer. If it is a verified, deployed contract on one of our supported chains this is the quickest setup as it will retrieve all needed contract information from a block explorer.

### Select the blockchain that the contract is deployed on

```bash
? Which blockchain would you like to import a contract from?
> etherem_mainnet
  goerli
  optimism
  base
  bsc
  gnosis
  polygon
[↑↓ to move, enter to select, type to filter]
```

List of supported networks:

- `ethereum-mainnet`
- `goerli`
- `optimism`
- `base`
- `bsc`
- `gnosis`
- `polygon`
- `arbitrum-one`
- `avalanche`
- `linea`
- `sepolia`
- `celo`
- `polygon-zkevm`
- `taiko-jolnr`
- `scroll`
- `metis`
- `manta`
- `kroma`

> In the experimental state, this feature supports importing a single contract from a single blockchain.

### Enter in the address of the contract to import

```bash
? What is the address of the contract? (Use the proxy address if your abi is a proxy implementation)
```

Note if you are using a proxy contract with an implementation, the address should be for the proxy.

## Configuration file

The contract-specific details that will be automatically populated in the `config.yaml` file are:

- Network ID
- Start Block
- Contract Name
- Contract Address
- Event Signature (for all events) with requiredEntities

Users can remove the events from the configuration file which do not need to be indexed. By default the contract import process populates the configuration file for all events.

For more information on how to write the configuration file, go [here](./configuration-file.md).

However, users are not required to do make any changes to the `config.yaml` file for the indexer to run.

## Schema

By default, the contract import process will create an entity for each event in the contract.
The fields in these entities will correspond to the parameters that are emitted inside the event.

Additionally, `EventsSummary` entity will be created that:

- Stores a count of how many entities of each type have been created
- Links to a vector of entities of each type that have been created

For more information on how to write the schema file, go [here](./schema.md).

## Event Handlers

Loaders and handlers for each event will be automatically generated.

For all events, the loader function will load `EventsSummary` entity using a fixed key to be updated in the handler.

For all events, the handler function will perform two operations:

- Create an instance of the event-specific entity with all the parameters that have been emitted
- Update the event-specific entity counter in the loaded `EventsSummary` entity

For more information on how to write the event handlers file, go [here](./event-handlers.mdx).

## Start the indexer

> Dev note: 📢 make sure you have docker open

The following command will start the docker and create databases for indexed data.

Run

```bash
envio dev
```

The indexer will then start indexing the contract specified in the `config.yaml` file from the `start_block` specified.

## Troubleshooting

Should the request for the contract details fail, the process will backoff and retry in duration that increases exponentially with each retry.
If the backoff duration exceeds 32 seconds, the process will fail - please contact the team on [Discord](https://discord.gg/mZHNWgNCAc) for more help.
