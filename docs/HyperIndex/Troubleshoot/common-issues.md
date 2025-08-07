---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
slug: /common-issues
---

# Common Issues and Troubleshooting

This guide helps you identify and resolve common issues you might encounter when working with Envio HyperIndex. If you don't find a solution to your problem here, please join our [Discord community](https://discord.gg/DhfFhzuJQh) for additional support.

## Table of Contents

- [Setup and Configuration Issues](#setup-and-configuration-issues)
  - [Module Not Found Errors](#cannot-find-module-errors-on-pnpm-start)
  - [Smart Contract Updates](#smart-contract-updated-after-the-initial-codegen)
  - [Node.js Version Compatibility](#using-the-correct-version-of-nodejs)
  - [PNPM Version Compatibility](#using-the-correct-version-of-pnpm)
- [Runtime Issues](#runtime-issues)
  - [Indexer Start Block Issues](#indexer-not-starting-at-the-specified-start-block)
  - [Tables Not Registered in Hasura](#tables-for-entities-are-not-registered-on-hasura)
  - [RPC-Related Issues](#rpc-related-issues)
- [Infrastructure Conflicts](#infrastructure-conflicts)
  - [Local Postgres Conflicts](#postgres-running-locally)

## Setup and Configuration Issues

### Cannot find module errors on `pnpm start`

**Problem:** Errors like `Cannot find module` when starting your indexer indicate missing generated files.

**Cause:** The indexer cannot find necessary files, typically because the code generation step was skipped after cloning the repository.

**Solution:**

1. Delete the `generated` folder if it exists
2. Run the code generation command:

```bash
pnpm codegen
```

> **Important:** Always run `pnpm codegen` immediately after cloning an indexer repository using Envio.

### Smart contract updated after the initial codegen

**Problem:** Changes to smart contracts aren't reflected in your indexer.

**Cause:** When smart contracts are modified after initial setup, the ABIs need to be regenerated and the indexer needs to be updated.

**Solution:**

1. Re-export smart contract ABIs (example using Hardhat):

```bash
cd contracts/
pnpm hardhat export-abi
```

2. Verify that the ABI directory in `config.yaml` points to the correct location where ABIs were freshly generated
3. Run codegen again:

```bash
pnpm codegen
```

### Using the correct version of Node.js

**Problem:** Compatibility issues or unexpected errors when running the indexer.

**Solution:** Envio requires Node.js v22 or newer. If you're using Node.js v16 or older, please update:

```bash
# Using nvm (recommended)
nvm install 22
nvm use 22

# Or download directly from https://nodejs.org/
```

### Using the correct version of PNPM

**Problem:** Package management issues or build failures.

**Solution:** Envio requires pnpm v8 or newer. If you're using v7.8 or older, please update:

```bash
# Update pnpm
npm install -g pnpm@latest

# Verify version
pnpm --version
```

## Runtime Issues

### Indexer not starting at the specified start block

**Problem:** The indexer runs but doesn't start from the `start_block` defined in your configuration.

**Cause:** This typically happens when the indexer's state is persisted from a previous run.

**Solution:** Stop the indexer completely before restarting:

```bash
# First stop the indexer
pnpm envio stop

# Then restart it
pnpm dev
```

### Tables for entities are not registered on Hasura

**Problem:** Entity tables defined in your schema don't appear in Hasura.

**Cause:** Database schema might be out of sync with your entity definitions.

**Solution:** Reset the indexer environment to recreate the necessary tables:

```bash
# Stop the indexer
pnpm envio stop

# Restart it (this will recreate tables)
pnpm dev
```

### RPC-Related issues

**Problem:** The indexer shows warnings such as:

- `Error getting events, will retry after backoff time`
- `Failed Combined Query Filter from block`
- `Issue while running fetching batch of events from the RPC. Will wait ()ms and try again.`

**Cause:** Issues connecting to or retrieving data from the blockchain RPC endpoint.

**Solutions:**

1. **Recommended:** Use [HyperSync](../Advanced/hypersync.md) if your network is supported, as it provides better performance and reliability

2. If HyperSync isn't an option, try:
   - Using a different RPC endpoint in your `config.yaml`
   - Verifying your RPC endpoint is stable and has archive data if needed
   - Checking if your RPC provider has rate limits you're exceeding

```yaml
# Example of updating RPC in config.yaml
network:
  # Replace with a more reliable RPC
  rpc_url: "https://mainnet.infura.io/v3/YOUR-API-KEY"
```

## Infrastructure Conflicts

### Postgres running locally

**Problem:** Conflicts when Postgres is already running on port 5432.

**Cause:** The default Postgres port (5432) is already in use by another instance.

**Solution:** Configure Envio to use a different port by setting environment variables:

```bash
# Option 1: Set variables inline
ENVIO_PG_PORT=5433 pnpm codegen
ENVIO_PG_PORT=5433 pnpm dev

# Option 2: Export variables for the session
export ENVIO_PG_PORT=5433
pnpm codegen
pnpm dev
```

You can further customize your Postgres connection with these additional environment variables:

- `ENVIO_PG_PASSWORD`: Set a custom password
- `ENVIO_PG_USER`: Set a custom username
- `ENVIO_PG_DATABASE`: Set a custom database name

---
