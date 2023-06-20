---
id: subgraph-migration-tutorial
title: Subgraph Migration Tutorial
sidebar_label: Subgraph Migration Tutorial
slug: /subgraph-migration-tutorial
---

<sub><sup> NOTE: Subgraph Migration functionality is in beta 👷‍♀️👷 </sup></sub>

## 1. Install Envio and prerequisite libraries 

Install all the packages outlined [here](./installation.md).

## 2. Initialize indexer using Subgraph Migration template

Run `envio init` and choose the `SubgraphMigrationExperimental` template.

After choosing the language, you will be prompted to enter the subgraph ID.

The subgraph ID can be found on [theGraph](https://thegraph.com/hosted-service).

<img src="/img/subgraph-id.png" alt="subgraph-id" width="100%"/>

This will automatically migrate the network (chain ID and start block) and contract information into the configuration file required for indexing on Envio.

The migration will also import schema and ABI files for the associated contracts.

## 3. Generate the required indexing files

Run `envio codegen` in the project directory to generate all the required files for indexing, based on the config and the schema.

## 4. Write event handlers and update the config

Function names for event handlers will be generated from `envio codegen` and the existing event handlers file for hosted subgraph can be manually migrated in the language chosen.

Migration script automatically populates the events section of the config file.
Linking of specific events to entities needs to be done manually. This is required to indicate the entities each event is required to load and update.

## 5. Start the indexer

Run `envio start` and the indexer will begin indexing as per the files migrated from the hosted subgraph.
