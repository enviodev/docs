---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
slug: /common-issues
---

# Common issues

## `Cannot find module` errors on `pnpm envio start`

This error indicates that the indexer is unable to find the necessary files to start the indexer.

Delete the `generated` folder and run

```bash
pnpm envio codegen```

> Always run `pnpm envio codegen` straight after cloning an indexer repo using Envio.

## Indexer not starting at the specified start block

If the indexer starts running but does not index the smart contracts from the `start_block` in the configuration file, then the indexer needs to be stopped before starting it again.

Run

```bash
pnpm envio stop
```

and then

```bash
pnpm envio dev
```

## Tables for entities are not registered on Hasura

Should the tables for the entities outlined in the schema file not show up on Hasura, the database will need to be migrated (deleting previous ones and creating current ones).

Run

```bash
pnpm envio stop
```

and then

```bash
pnpm envio dev
```

## Postgres running locally

If Postgres is running locally on port 5432, then you can run the whole system with a different Postgres port by setting the `PG_PORT` environment variable. For example, if you want to run Postgres on port 5433, then set `PG_PORT` to 5433.

In practice, this could look like this:

```
ENVIO_PG_PORT=5433 pnpm envio codegenENVIO_PG_PORT=5433 pnpm envio dev
```

or

```
export ENVIO_PG_PORT=5433
pnpm envio codegenpnpm envio dev
```

NOTE: you can further customize how you connect to Postgres with these additional environment variables `ENVIO_POSTGRES_PASSWORD`, `ENVIO_PG_USER`, and `ENVIO_PG_DATABASE`.

## Smart contract updated after the initial codegen

If your smart contracts have been changed after the initial codegen, then you need to recreate the ABI for the smart contracts.

Re-export smart contract ABI's using [Hardhat ABI exporter](https://www.npmjs.com/package/hardhat-abi-exporter) and `pnpm` by running

```
cd contracts/
pnpm hardhat export-abi
```

Ensure that the directory for ABI in `config.yaml` is pointing to the correct folder where ABIs have been freshly generated.

## RPC-related issues

If you keep receiving the warning messages below and are unable to see any of the indexed data, there is likely an issue with the RPC endpoint being used.

Warning messages:

- `Error getting events, will retry after backoff time`
- `Failed Combined Query Filter from block`
- `Issue while running fetching batch of events from the RPC. Will wait ()ms and try again.`

It is recommended to use [HyperSync](../Advanced/hypersync.md) instead if the network being indexed from is supported.

Otherwise, use a different RPC endpoint that is valid in the `config.yaml` file.

## Using the correct version of `Node.js`

If you are using a version of Node.js that is v16 or older, please update to v18 or newer.

## Using the correct version of `pnpm`

If you are using a version of `pnpm` that is v7.8 or older, please update to v8 or newer.

---
