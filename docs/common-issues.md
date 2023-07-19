---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
slug: /common-issues
---



# Common issues

## Postgres running locally
If Postgres is running locally, then make the following change to the `docker-compose.yaml` file
```yaml
ports:
  - "${PG_PORT:-5433}:5432"
```

Then run 
```
PG_PORT:5433 envio codegen
PG_PORT:5433 envio start
```


## Smart contract updated after the initial codegen
If your smart contracts have been changed after the initial codegen, then you need to recreate the ABI for the smart contracts.

Re-export smart contract ABI's using [Hardhat ABI exporter](https://www.npmjs.com/package/hardhat-abi-exporter) and `pnpm` by running
```
pnpm hardhat export-abi
```
Ensure that the directory for ABI in `config.yaml` is pointing to the correct folder where ABIs have been freshly generated.

---