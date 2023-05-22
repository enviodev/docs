---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
slug: /
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
PG_PORT:-5433 pnpm start
```


## Smart contract updated after the initial codegen
If smart contract has been changed after the initial codegen, then recreate the ABI for the smart contract.

Re-export smart contract ABI using Hardhat and `pnpm` by running
```
cd contracts
pnpm hardhat export-abi
```
Ensure that the directory for ABI in `config.yaml` is pointing to the correct folder where ABIs have been freshly generated.




---