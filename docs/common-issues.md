---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
slug: /common-issues
---

# Common issues

## Indexer not starting at the specified start block

If the indexer starts running but does not index the smart contracts from the `start_block` in the configuration file, then the indexer needs to be stopped before starting it again.

Run

```bash
envio stop
```

and then

```bash
envio dev
```

## Tables for entities are not registered on Hasura

Should the tables for the entities outlined in the schema file not show up on Hasura, the database will need to be migrated (deleting previous ones and creating current ones).

Run

```bash
envio stop
```

and then

```bash
envio dev
```

## Postgres running locally

If Postgres is running locally, then make the following change to the `docker-compose.yaml` file inside the generated folder

```yaml
ports:
  - "${PG_PORT:-5433}:5432"
```

Then run

```
PG_PORT:5433 envio codegen
PG_PORT:5433 envio dev
```

## Smart contract updated after the initial codegen

If your smart contracts have been changed after the initial codegen, then you need to recreate the ABI for the smart contracts.

Re-export smart contract ABI's using [Hardhat ABI exporter](https://www.npmjs.com/package/hardhat-abi-exporter) and `pnpm` by running

```
cd contracts/
pnpm hardhat export-abi
```

Ensure that the directory for ABI in `config.yaml` is pointing to the correct folder where ABIs have been freshly generated.

---
