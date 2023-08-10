---
id: subgraph-migration
title: Migrating Subgraphs
sidebar_label: Migrating Subgraphs
slug: /subgraph-migration
---

<sub><sup> NOTE: Subgraph Migration functionality is in experimental state 👷‍♀️👷 </sup></sub>

This page will show you how to migrate an existing subgraph from theGraph's hosted service onto Envio.

## Migrate the project configuration using Subgraph ID

### Initialize `envio`
```bash
envio init
```

### Name your indexer 

```bash
? Name your indexer:
```

### Choose the project directory (default is the current directory)
```bash
? Set the directory:  (.) .
```

### Select `SubgraphMigration`

```bash
? Would you like to start from a template or migrate from a subgraph?  
  "Template"
> "SubgraphMigration"
[↑↓ to move, enter to select, type to filter]

```

### Enter in the subgraph ID 

```bash
? [BETA VERSION] What is the subgraph ID?  
```

The subgraph ID can be found on [theGraph](https://thegraph.com/hosted-service).

<img src="/img/subgraph-id.png" alt="subgraph-id" width="100%"/>

### Choose a language of your choice for the event handlers

```bash
? Which language would you like to use?
> "Javascript"
  "Typescript"
  "Rescript"
[↑↓ to move, enter to select, type to filter]
```

This will automatically migrate the network (chain ID and start block) and contract information into the configuration file required for indexing on Envio.

The migration will also import schema and ABI files for the associated contracts.

## Write event handlers

Function names for event handlers will be generated from `envio init` and the existing event handlers file for hosted subgraph can be written in the language chosen.

Migration script automatically populates the events section of the config file.
Linking of specific events to entities needs to be done manually. This is required to indicate the entities each event is required to load and update.

## Start the indexer

> Dev note: 📢 make sure you have docker open

The following commands will start the docker and create databases for indexed data, make sure to re-run `dev` if you make changes to the files

Run
```bash
envio dev
```

The indexer will then start indexing the contract specified in the `config.yaml` file from the `start_block` specified.

## Troubleshooting

The subgraph migration functionality may timeout if the fetching from IPFS gateway takes longer than the maximum time.
