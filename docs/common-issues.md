---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
slug: /
---



# Common issues

## Re-exporting smart contract ABI
If you have updated your smart contract after the initial codegen, then you will have to recreate the ABI for your smart contract.

Run
```
cd contracts
pnpm hardhat export-abi
```
Ensure that the directory for ABI in config.yaml is pointing to the correct folder where ABIs have been freshly generated.


---