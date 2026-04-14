---
id: running-locally
title: Running The Indexer Locally
sidebar_label: Running The Indexer Locally
slug: /running-locally
description: Learn how to start, run, and manage the Envio indexer locally with Docker and Hasura.
---

## Starting the Indexer

Remember to `cd` into your project directory if you have defined one during `pnpx envio init`.

Before running the Envio CLI command to start the indexer locally, please make sure you have [Docker](https://www.docker.com/products/docker-desktop/) running.

Run the indexer

```bash
pnpm dev
```

This will automatically open up the Hasura dashboard where you can view the data that has been indexed.

Admin-secret / password for local Hasura is `testing`.

## Hot Reload

When running `pnpm dev`, HyperIndex watches for changes to your **event handler** files. When you save a handler file, the indexer will automatically re-process events using your updated logic without needing to restart manually.

**What triggers a hot reload:**
- Changes to event handler files (e.g., `src/EventHandlers.ts`)

**What requires a full restart:**
- Changes to `config.yaml` (adding contracts, events, or networks)
- Changes to `schema.graphql` (adding or modifying entities)
- Changes to ABIs

For config or schema changes, stop the indexer and restart:

```bash
pnpm envio stop
pnpm dev
```

:::tip
If hot reload doesn't seem to be picking up your handler changes, try saving the file again or check the terminal output for compilation errors that may be preventing the reload.
:::

## Avoiding Full Re-indexing During Development

By default, stopping and restarting the indexer will re-index from the start block. This can be slow for large datasets. Here are strategies to iterate faster:

### Use the testing framework

The fastest way to validate handler logic is to skip syncing entirely. Envio's built-in [testing framework](./testing) lets you mock events, simulate database state, and assert handler behavior — all without connecting to a blockchain or waiting for blocks to sync.

```bash
pnpm test
```

This is ideal for iterating on handler logic, catching bugs early, and running tests in CI. See the [Testing guide](./testing) for setup and examples.

### Use a recent start block

During development, temporarily set `start_block` in your `config.yaml` to a recent block number. This lets you test handler logic against fresh data without waiting for a full historical sync:

```yaml
- id: 1 # Ethereum mainnet
  start_block: 19000000 # Recent block for faster dev iteration
```

Remember to set it back to the correct start block before deploying to production.

### Preserve state between restarts

If you only changed handler logic (not schema or config), the hot reload will apply your changes without losing indexed state. Avoid running `pnpm envio stop` unless you need a clean slate.

### Force a clean re-index

If you need to re-index from scratch (e.g., after schema changes or to clear corrupted state):

```bash
pnpm envio stop  # Removes Docker containers and database
pnpm dev          # Fresh start from start_block
```

## Stopping the Indexer

To delete the docker images used for the local development environment, run

```bash
pnpm envio stop
```

## What next?

Once you have successfully run the indexer locally, you can deploy the indexer onto Envio's [Envio Cloud](./hosted-service).
---
