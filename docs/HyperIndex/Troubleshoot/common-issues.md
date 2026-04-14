---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
slug: /common-issues
description: Discover quick fixes and proven solutions for setup, runtime, and configuration issues in Envio.
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
- [Debugging a Stuck Indexer](#debugging-a-stuck-indexer)
  - [Indexer Not Making Progress](#indexer-not-making-progress)
- [Rate Limiting on Hosted Service](#rate-limiting-on-hosted-service)
  - [HTTP 429 Errors](#http-429-errors-when-querying-your-endpoint)
- [Hasura Authentication](#hasura-authentication)
  - [Cannot Log In to the Hasura Console](#cannot-log-in-to-the-hasura-console)
- [Infrastructure Conflicts](#infrastructure-conflicts)
  - [Local Postgres Conflicts](#postgres-running-locally)
- [Missing Events](#missing-events)
  - [Events Not Appearing in Indexed Data](#events-not-appearing-in-indexed-data)

## Setup and Configuration Issues

### Cannot find module errors on `pnpm start`

**Problem:** Errors like `Cannot find module` when starting your blockchain indexer indicate missing generated files.

**Cause:** The indexer cannot find necessary files, typically because the code generation step was skipped after cloning the repository.

**Solution:**

1. Delete the `generated` folder if it exists
2. Run the code generation command:

```bash
pnpm codegen
```

> **Important:** Always run `pnpm codegen` immediately after cloning an indexer repository using Envio.

### Using Envio inside a monorepo

**Problem:** Your indexer lives inside a larger monorepo and you see `Cannot find module` or missing-generated-code errors even after running `pnpm codegen`.

**Cause:** `pnpm-workspace.yaml` doesn't include both your indexer root and its generated output directory.

**Solution:** Add both `<envio-indexer>` and `<envio-indexer>/generated` to the `packages` list in `pnpm-workspace.yaml`, for example:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "envio-indexer"
  - "envio-indexer/generated"
```

### Smart contract updated after the initial codegen

**Problem:** Changes to smart contracts aren't reflected in your blockchain indexer.

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

## Debugging a Stuck Indexer

### Indexer not making progress

**Problem:** Your indexer appears frozen — the block counter stops advancing, or sync has been running far longer than expected with no visible progress.

**First step — check the logs:**

The most important thing to do is check your indexer logs for errors or warnings. Logs will almost always point you to the root cause.

- **Locally:** Check the terminal output from `pnpm dev` for error messages or stack traces.
- **Envio Cloud:** Go to your deployment in the [Envio Cloud dashboard](https://envio.dev/app) and open the **Logs** tab.

If the logs don't reveal an obvious error, work through the common causes below:

1. **RPC rate limiting or connectivity issues**
   - If using RPC sync, your provider may be throttling requests. Check your RPC provider's dashboard for 429 errors or usage spikes.
   - Try switching to a different RPC endpoint or using [HyperSync](../Advanced/hypersync.md) if your network is supported.

2. **Large blocks or high event density**
   - Some blocks contain an unusually large number of events (e.g., airdrop blocks, protocol launches). The indexer may appear stuck while processing them.
   - Check the logs for the current block number — if it's advancing slowly rather than frozen, the indexer is likely processing a dense block range.

3. **Handler errors causing silent failures**
   - An unhandled error in your event handler can cause the indexer to stall. Look for error messages or stack traces in the logs that point to a specific handler or event.

4. **Memory pressure**
   - Processing very large datasets or having expensive handler logic (e.g., many `eth_call` requests) can cause memory issues. See the [performance optimization guide](../Advanced/performance/index.md) for tuning options.

**If running on Envio Cloud:**

- Check the deployment logs in the [Envio Cloud dashboard](https://envio.dev/app) for error details.
- If the deployment is unrecoverable, you can delete it and redeploy from the dashboard.
- Consider running the same configuration locally first to reproduce and debug the issue before redeploying.

## Rate Limiting on Hosted Service

### HTTP 429 errors when querying your endpoint

**Problem:** You receive `429 Too Many Requests` responses when querying your hosted GraphQL endpoint, or your queries are being throttled.

**Cause:** Envio Cloud applies rate limits to GraphQL query endpoints based on your plan tier. This protects shared infrastructure and ensures fair usage across all deployments.

**What to check:**

1. **Confirm it's a query rate limit (not an RPC issue)**
   - Rate limiting applies to your _GraphQL query endpoint_, not to the indexer's data ingestion. If your indexer is slow to sync, that's a different issue — see [Debugging a Stuck Indexer](#debugging-a-stuck-indexer).

2. **Check your plan's limits**
   - Review your current plan in the [Envio Cloud dashboard](https://envio.dev/app) under your deployment settings. Higher-tier plans include higher query rate limits. See [Billing & Plans](../Hosted_Service/hosted-service-billing.mdx) for details.

3. **Reduce query frequency from your application**
   - If your frontend or backend polls the endpoint frequently, consider adding caching, reducing poll intervals, or using [WebSocket subscriptions](../Advanced/websockets.md) for real-time updates instead of polling.

4. **Check for unexpected traffic**
   - Ensure your endpoint URL hasn't been shared publicly or isn't being hit by an unintended client. You can restrict access — see the [Hosted Service features](../Hosted_Service/hosted-service-features.md) for endpoint security options.

5. **Upgrade your plan**
   - If you consistently hit rate limits, consider upgrading to a higher tier for increased query throughput.

## Hasura Authentication

### Cannot log in to the Hasura console

**Problem:** You're prompted for an admin secret or password when accessing the Hasura console, and don't know what it is.

**Local development:**

When running locally with `pnpm dev`, the default Hasura admin secret is `testing`. Access the console at `http://localhost:8080` and enter `testing` when prompted.

You can customize this by setting the `ENVIO_PG_PASSWORD` environment variable before starting your indexer.

**Envio Cloud (hosted):**

On Envio Cloud, you **do not need the Hasura admin secret** to query your data. Your deployed indexer exposes a public GraphQL endpoint that you can query directly without authentication:

```
https://indexer.dev.hyperindex.xyz/<your-deployment-id>/v1/graphql
```

The Hasura console UI is not exposed on hosted deployments. To explore your data, use the GraphQL playground available in the [Envio Cloud dashboard](https://envio.dev/app), or query the endpoint directly from your application or tools like Postman.

If you need to restrict access to your endpoint, see the [Hosted Service features](../Hosted_Service/hosted-service-features.md) for security options.

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

## Missing Events

### Events not appearing in indexed data

**Problem:** Some expected events are missing from your indexed data, or event counts don't match what you see on-chain.

**Common causes:**

1. **Incorrect `start_block`**
   - If your `start_block` is set after the block where the event was emitted, it will be missed. Verify that the start block in your `config.yaml` is at or before the contract's deployment block.

2. **ABI mismatch**
   - If the ABI in your config doesn't match the contract's actual event signature, events won't be decoded. Double-check that your ABI file is up to date and matches the deployed contract.

3. **Missing contract address**
   - For multi-address or dynamic contract setups, ensure all relevant addresses are registered. If using [dynamic contracts](../Advanced/dynamic-contracts.md), verify that the `contractRegister` handler is correctly adding addresses.

4. **RPC provider issues**
   - Some RPC providers may return incomplete log data, especially for older blocks. Try switching to a different RPC endpoint or use [HyperSync](../Advanced/hypersync.md) for more reliable data retrieval.

5. **Reorg handling**
   - During chain reorganizations, events from orphaned blocks may temporarily appear and then be removed. If `rollback_on_reorg` is enabled (default), the indexer will handle this automatically. See [Reorg Support](../Advanced/reorgs-support.md).

**How to verify:**

- Check the indexer logs for any skipped blocks or error messages
- Test with a small block range locally to isolate the issue

---
