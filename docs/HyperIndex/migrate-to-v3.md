---
id: migrate-to-v3
title: Migrate to HyperIndex V3 Alpha
sidebar_label: Migrate to V3 Alpha
slug: /migrate-to-v3
description: Learn how to upgrade from HyperIndex V2 to V3 Alpha, featuring ESM support, top-level await, automatic handler registration, and more.
---

:::warning
HyperIndex V3 is currently in **alpha**. While we don't plan major API changes, some features may still undergo minor breaking changes and developer experience improvements.
:::

# Migrate to HyperIndex V3 Alpha

15 full months have passed since the official HyperIndex v2.0.0. Since then, we have shipped [32 minor releases](https://github.com/enviodev/hyperindex/releases) and multiple patches with **zero breaking changes** to the documented API. We also received PRs from 6 external contributors, grew from 1 GitHub star to over 470, and saw many big projects rely on HyperIndex.

HyperIndex V3 Alpha focuses on modernizing the codebase and laying the foundation for many more months of development. This guide walks you through upgrading from V2 to V3.

## New Features

### CommonJS → ESM

We migrated HyperIndex from CommonJS-only to ESM-only. This enables:

- Using the latest versions of libraries that have long since abandoned CommonJS support
- **Top-level await** in handler files

### Top-Level Await

Thanks to the migration to ESM, you can now use `await` directly in handler and other files:

```typescript
import { ERC20 } from "generated";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Load data before registering handlers
const addressesFromServer = await loadWhitelistedAddresses();

ERC20.Transfer.handler(
  async ({ event, context }) => {
    // ... your handler logic
  },
  {
    wildcard: true,
    eventFilters: [
      { from: ZERO_ADDRESS, to: addressesFromServer },
      { from: addressesFromServer, to: ZERO_ADDRESS },
    ],
  }
);
```

### Automatic Handler Registration (`src/handlers`)

We introduced automatic registration of handler files located in `src/handlers`.

Previously, you needed to specify an explicit path to a handler file for every contract in `config.yaml`. Now you can remove all of the paths from `config.yaml` and simply move the files to `src/handlers`. You can name the files however you want, but we suggest using contract names and having a file per contract.

If you don't like `src/handlers`, use the `handlers` option in `config.yaml` to customize it.

:::note
The explicit `handler` field in `config.yaml` still works, so you don't need to change anything immediately.
:::

### RPC for Live Indexing

Built by an external contributor [@cairoeth](https://github.com/cairoeth) to allow specifying `live` mode for an RPC data source to embrace low-latency head tracking:

```yaml
rpc:
  - url: https://eth-mainnet.your-rpc-provider.com
    for: live
```

In this case, the RPC won't be used for historical sync but will join the source selection logic when entering live indexing.

### Chain State on Context

The Handler Context object provides chain state via the `chain` property:

```typescript
ERC20.Approval.handler(async ({ context }) => {
  console.log(context.chain.id); // 1 - The chain id of the event
  console.log(context.chain.isLive); // true - Whether the event chain is indexing at the head
});
```

### Indexer State & Config

As a replacement for the deprecated and removed `getGeneratedByChainId`, we introduce the `indexer` value. It provides nicely typed chains and contract data from your config, as well as the current indexing state, such as `isLive` and `addresses`. Use `indexer` either at the top level of the file or directly from handlers. It returns the latest indexer state.

With this change, we also introduce new official types: `Indexer`, `EvmChainId`, `FuelChainId`, and `SvmChainId`.

```typescript
import { indexer } from "generated";

indexer.name; // "uniswap-v4-indexer"
indexer.description; // "Uniswap v4 indexer"
indexer.chainIds; // [1, 42161, 10, 8453, 137, 56]
indexer.chains[1].id; // 1
indexer.chains[1].startBlock; // 0
indexer.chains[1].endBlock; // undefined
indexer.chains[1].isLive; // false
indexer.chains[1].PoolManager.name; // "PoolManager"
indexer.chains[1].PoolManager.abi; // unknown[]
indexer.chains[1].PoolManager.addresses; // ["0x000000000004444c5dc75cB358380D2e3dE08A90"]
```

### Conditional Event Handlers

Now it's possible to return a boolean value from the `eventFilters` function to disable or enable the handler conditionally.

```typescript
ERC20.Transfer.handler(
  async ({ event, context }) => {
    // ... your handler logic
  },
  {
    wildcard: true,
    eventFilters: ({ chainId }) => {
      // Skip all ERC20 on Polygon
      if (chainId === 137) {
        return false;
      }

      // Track all ERC20 on Ethereum Mainnet
      if (chainId === 1) {
        return true;
      }

      // Track only whitelisted addresses on other chains
      return [
        { from: ZERO_ADDRESS, to: WHITELISTED_ADDRESSES[chainId] },
        { from: WHITELISTED_ADDRESSES[chainId], to: ZERO_ADDRESS },
      ];
    },
  }
);
```

### Automatic Contract Configuration

Started automatically configuring all globally defined contracts. This fixes an issue where `addContract` crashed because the contract was defined globally but not linked for a specific chain. Now it's done automatically:

```yaml
contracts:
  - name: UniswapV3Factory
    events: # ...
  - name: UniswapV3Pool
    events: # ...
chains:
  - id: 1
    start_block: 0
    contracts:
      - name: UniswapV3Factory
        address: 0x1F98431c8aD98523631AE4a59f267346ea31F984
      # UniswapV3Pool no longer needed here - auto-configured from global contracts
  - id: 10
    start_block: 0
    contracts:
      - name: UniswapV3Factory
        address: 0x1F98431c8aD98523631AE4a59f267346ea31F984
      # UniswapV3Pool no longer needed here - auto-configured from global contracts
```

### ClickHouse Sink (Experimental)

We added experimental support for a ClickHouse Sink. Postgres still serves as the primary database, and you can additionally sink the entities to a ClickHouse database that is restart- and reorg-resistant.

Configure with environment variables: `ENVIO_CLICKHOUSE_SINK_HOST`, `ENVIO_CLICKHOUSE_SINK_DATABASE`, `ENVIO_CLICKHOUSE_SINK_USERNAME`, `ENVIO_CLICKHOUSE_SINK_PASSWORD`. Currently supported only on Dedicated Plan.

:::warning
Do not run multiple Sinks to the same database at the same time.
:::

### HyperSync Source Improvements

Multiple updates on the HyperSync side to achieve smaller latency and less traffic:

- Server-Sent Events instead of polling to get updates about new blocks
- CapnProto instead of JSON for query serialization
- Cache for queries with repetitive filters - huge egress saving when indexing thousands of addresses

### Fuel Block Handler Support

Block handlers are now supported for Fuel indexing.

### Solana Support (Experimental)

HyperIndex now supports Solana with RPC as a source. This feature is experimental and may undergo minor breaking changes.

To initialize a Solana project:

```bash
pnpx envio@3.0.0-alpha.13 init svm
```

See the [Solana documentation](/docs/HyperIndex/solana) for more details.

### `pnpx envio init` Improvements

- Removed language selection to prefer TypeScript by default
- Cleaned up templates to follow the latest good practices
- Added new templates to highlight HyperIndex features, starting with: `Feature: Factory Contract`
- New projects created with `envio init` now include a pre-configured GitHub Actions workflow for running tests

### Block Handler Only Indexers

Now it's possible to create indexers with only block handlers. Previously, it was required to have at least one event handler for it to work. The `contracts` field became optional in `config.yaml`.

### Flexible Entity Fields

We no longer have restrictions on entity field names, such as `type` and others. Shape your entities any way you want. There are also improvements in generating database columns in the same order as they are defined in the `schema.graphql`.

### Unordered Multichain Mode by Default

Unordered multichain mode is now the default behavior. This provides better performance for most use cases. If you need ordered multichain behavior, you can explicitly set `multichain: ordered` in your config.

### Preload Optimization by Default

Preload optimization is now enabled by default, replacing the previous `loaders` and `preload_handlers` options. This improves historical sync performance automatically.

### TUI Improvements

We gave our TUI some love, making it look more beautiful and compact. It also consumes fewer resources, shares a link to the Hasura playground, and dynamically adjusts to the terminal width.

![TUI](/img/sync.gif)

### New Testing Framework (Experimental)

We introduced a new testing framework that allows you to test handlers' logic using real blockchain data and programmatically debug code without repetitive local runs. Key capabilities include:

- Testing block and event handlers together
- Snapshot testing support
- Parallel test execution via worker thread isolation

The framework integrates with [Vitest](https://vitest.dev/), replacing the previous mocha/chai setup with a single package that doesn't require configuration by default and includes snapshot testing out-of-the-box. It also provides typed test assertions and utilities to read/write entities in-between processing runs.

```typescript
import { describe, it, expect } from "vitest"
import { createTestIndexer } from "generated"

describe("Indexer Testing", () => {
  it("Should create accounts from ERC20 Transfer events", async () => {
    const indexer = createTestIndexer();

    expect(
      await indexer.process({
        chains: {
          1: {
            startBlock: 10_861_674,
            endBlock: 10_861_674,
          },
        },
      }),
      "Should find the first mint at block 10_861_674"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "Account": {
              "sets": [
                {
                  "balance": -1000000000000000000000000000n,
                  "id": "0x0000000000000000000000000000000000000000",
                },
                {
                  "balance": 1000000000000000000000000000n,
                  "id": "0x41653c7d61609d856f29355e404f310ec4142cfb",
                },
              ],
            },
            "block": 10861674,
            "blockHash": "0x32e4dd857b5b7e756551a00271e44b61dbda0a91db951cf79a3e58adb28f5c09",
            "chainId": 1,
            "eventsProcessed": 1,
          },
        ],
      }
    `);
  });
});
```

See the [Testing documentation](/docs/HyperIndex/testing) for more details.

### Podman Support

Beyond Docker, HyperIndex now supports [Podman](https://podman.io/) for local development environments. This provides an alternative container runtime for developers who prefer Podman or have it available in their environment.

### Nested Tuples for Contract Import

The `envio init` command now supports contracts with nested tuples in event signatures, which was previously a limitation when importing contracts.

### PostgreSQL Update for Local Docker Compose

The local development Docker Compose setup now uses PostgreSQL 18.1 (upgraded from 17.5).

### 3x Historical Backfill Performance

Achieved by adding chunking logic to request events across multiple ranges at once. This also fixed overfetching for contracts with a much later `start_block` in the config, as well as speeding up dynamic contract registration. If you had data fetching as a bottleneck, 25k events per second is now a standard.

### Support for DESC Indices

A nice way to improve your query performance as well:

```graphql
type PoolDayData
  @index(fields: ["poolId" ["date", "DESC"]]) {
  id: ID!
  poolId: String!
  date: Timestamp!
}
```

### RPC Source Improvements

Added `polling_interval` option for RPC source configuration. Also added missing support for receipt-only fields (`gasUsed`, `cumulativeGasUsed`, `effectiveGasPrice`) that are not available via `eth_getTransactionByHash`. HyperIndex will additionally perform the `eth_getTransactionReceipt` request when one of the fields is added in `field_selection`.

### WebSocket Support (Experimental)

Experimental WebSocket support for RPC source to improve head latency. Please create a GitHub issue if you come across any problems.

```yaml
chains:
  - id: 1
    rpc:
      url: ${ENVIO_RPC_ENDPOINT}
      ws: ${ENVIO_WS_ENDPOINT}
      for: live
```

### Prometheus Metrics for Data Providers

Added a Prometheus metric to track requests to data providers, providing better observability into your indexer's data fetching patterns.

## Breaking Changes

### Node.js & Runtime

- **Node.js 22** is now the minimum required version, while 24 is the recommended version
- Changes in handler files don't trigger codegen on `pnpm dev`

### Handler API Changes

- Removed `experimental_createEffect` in favor of `createEffect`
- Renamed transaction field `kind` to `type`
- For block handlers: `block.chainId` is removed in favor of `context.chain.id`
- `Address` type changed from `string` to `` `0x${string}` ``
- Removed `transaction.chainId` from field selection — use `context.chain.id` or `event.chainId` instead

### config.yaml Changes

- Renamed `networks` to `chains`
- Renamed `confirmed_block_threshold` to `max_reorg_depth`
- Removed `unordered_multichain_mode` flag, replaced with `multichain: ordered | unordered` (default: `unordered`)
- Removed `loaders` option (now always enabled via Preload Optimization)
- Removed `preload_handlers` option (now always enabled)
- Removed `preRegisterDynamicContracts` option
- Removed `event_decoder` option (the Rust-based decoder is now the only implementation)
- Removed `rpc_config` in favor of `rpc`, which now supports multiple URLs, `for` mode (`sync`, `live`, `fallback`), and WebSocket configuration (see [RPC for Live Indexing](#rpc-for-live-indexing))

### HyperSync API Token Required

Indexers using HyperSync as a data source now require an `ENVIO_API_TOKEN` environment variable. You can obtain a free API token at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens).

```bash
export ENVIO_API_TOKEN=your_token_here
```

### Environment Variable Changes

- Removed `UNSTABLE__TEMP_UNORDERED_HEAD_MODE` environment variable
- Removed `UNORDERED_MULTICHAIN_MODE` environment variable
- Removed `MAX_BATCH_SIZE` environment variable (use `full_batch_size` in config.yaml instead)

### Generated Code Changes

- Removed `chain` type in favor of `ChainId` (now a union type instead of a number)
- Removed internal `ContractType` enum (allows longer contract names)
- Removed `getGeneratedByChainId` (use `indexer` value instead)
- **Lowercased entity types removed**: Generated code no longer exports lowercased entity types (e.g., `transfer`). Use capitalized names instead (e.g., `Transfer`)
- Entity array field values are now typed as `readonly` — update any code that directly mutates array fields

### Metrics Changes

- Renamed `chain_block_height` Prometheus metric to `envio_indexing_known_height`

## Fixes

- Fixed an issue where the indexer stops progressing without any error (PostgreSQL client update)
- Fixed checksum for addresses returned by RPC in lowercase
- Fixed incorrect validation of transactions `to` field returned by RPC
- Fixed OOM error on RPC request crashing loop

## Migration Guide

### Step 0: Prepare on V2 (Recommended)

Before upgrading to V3, we recommend preparing your project while still on V2:

1. **Upgrade to v2.32.6** and enable Preload Optimization:

```yaml
# config.yaml
preload_handlers: true
```

2. **If you were using loaders**, migrate them to Preload Optimization following the [Migrating from Loaders](/docs/HyperIndex/preload-optimization#migrating-from-loaders) guide.

3. **Verify your indexer works correctly** with `pnpm dev` before proceeding to V3.

This step ensures a smoother migration by validating Preload Optimization works with your handlers before the V3 upgrade.

### Step 1: Update Dependencies

#### Node.js

Update Node.js to version 22 or higher.

#### package.json

Update your `package.json` with the following changes:

```json
{
  "type": "module",
  "engines": {
    "node": ">=22.0.0"
  },
  "dependencies": {
    "envio": "3.0.0-alpha.13"
  },
  "devDependencies": {
    "typescript": "^5.7.3"
  }
}
```

:::warning
Adding `"type": "module"` is **required** for V3. Without it, your project will fail to start due to ESM import errors.
:::

**If you use testing with Mocha (recommended: migrate to Vitest):**

We recommend migrating from mocha/chai to [Vitest](https://vitest.dev/), which offers a better testing experience with the new HyperIndex testing framework:

```bash
pnpm remove ts-mocha ts-node mocha chai @types/mocha @types/chai
pnpm add -D vitest@4.0.16
```

Update your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "4.0.16"
  }
}
```

Move and refactor your test files:
- Move `test/Test.ts` to `src/indexer.test.ts`
- Update imports from `mocha`/`chai` to use `vitest`:

```typescript
// Before (mocha/chai)
import { describe, it } from "mocha";
import { expect } from "chai";

// After (vitest)
import { describe, it, expect } from "vitest";
import { createTestIndexer } from "generated";
```

**If you prefer to keep Mocha:**

Remove `ts-mocha` and `ts-node`, then install `tsx`:

```bash
pnpm remove ts-mocha ts-node
pnpm add -D tsx@4.21.0
```

Update your test script in `package.json`:

```json
{
  "scripts": {
    "mocha": "tsc --noEmit && NODE_OPTIONS='--no-warnings --import tsx' mocha --exit test/**/*.ts"
  }
}
```

**If you use `ts-node` for start script:**

Replace with:

```json
{
  "scripts": {
    "start": "envio start"
  }
}
```

### Step 2: Update tsconfig.json

Update your `tsconfig.json` to support ESM:

```json
{
  /* For details: https://www.totaltypescript.com/tsconfig-cheat-sheet */
  "compilerOptions": {
    /* Base Options: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    /* For running Envio: */
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,

    /* Code doesn't run in the DOM: */
    "lib": ["es2022"]
  }
}
```

:::tip
This includes additional strictness options like `verbatimModuleSyntax` and `noUncheckedIndexedAccess`. You can disable them to simplify the migration.
:::

### Step 3: Update config.yaml

**Rename `networks` to `chains`:**

```yaml
# Before
networks:
  - id: 1
    contracts:
      - name: MyContract
        events:
          - event: Transfer(address indexed from, address indexed to, uint256 value)

# After
chains:
  - id: 1
    contracts:
      - name: MyContract
        events:
          - event: Transfer(address indexed from, address indexed to, uint256 value)
```

**Update multichain mode (if applicable):**

If you had `unordered_multichain_mode: true`, remove it — this is now the default. If you need ordered multichain behavior, explicitly set:

```yaml
multichain: ordered
```

**Rename config options:**

- `confirmed_block_threshold` → `max_reorg_depth`

**Remove deprecated options:**

Remove the following options from your config if present:

- `loaders` — now always enabled via Preload Optimization
- `preload_handlers` — now always enabled
- `preRegisterDynamicContracts` — no longer needed
- `unordered_multichain_mode` — replaced with `multichain` option
- `event_decoder` — the Rust-based decoder is now the only implementation
- `rpc_config` — replaced with `rpc` (see [Breaking Changes](#config-yaml-changes))

**New option for batch size:**

If you were using `MAX_BATCH_SIZE` environment variable, use the new config option instead:

```yaml
full_batch_size: 5000
```

**Automatic Handler Registration (optional):**

Optionally move your handler files to `src/handlers/` and remove the explicit `handler` paths from `config.yaml`.

### Step 4: Update Environment Variables

**Add required environment variables:**

If your indexer uses HyperSync (the default data source), you need to set up an API token:

1. Get a free API token at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens)
2. Set the environment variable:

```bash
export ENVIO_API_TOKEN=your_token_here
```

For local development, you can add it to a `.env` file:

```
ENVIO_API_TOKEN=your_token_here
```

**Remove deprecated environment variables if present:**

- `UNSTABLE__TEMP_UNORDERED_HEAD_MODE`
- `UNORDERED_MULTICHAIN_MODE`
- `MAX_BATCH_SIZE` — use `full_batch_size` in config.yaml instead

### Step 5: Update Handler Code

**Rename deprecated APIs:**

| V2 (Deprecated)                     | V3                                    |
| ----------------------------------- | ------------------------------------- |
| `experimental_createEffect`         | `createEffect`                        |
| `block.chainId` (in block handlers) | `context.chain.id`                    |
| `transaction.kind`                  | `transaction.type`                    |
| `chain` type                        | `ChainId`                             |
| `transaction.chainId`               | `context.chain.id` or `event.chainId` |

**Removed APIs:**

- `getGeneratedByChainId` — use the `indexer.chains[chainId]` instead (see [Indexer State & Config](#indexer-state--config))
- Lowercased entity types — use capitalized names instead:

```typescript
// Before
import { transfer, approval } from "generated";

// After
import { Transfer, Approval } from "generated";
```

### Step 6: Test Your Migration

After making all changes, run codegen and start your indexer:

```bash
pnpm envio codegen
pnpm dev
```

## Quick Migration Checklist

**Prepare (on V2):**

- [ ] Upgrade to `envio@2.32.6`
- [ ] Enable `preload_handlers: true` in config.yaml
- [ ] Migrate from loaders if applicable ([guide](/docs/HyperIndex/preload-optimization#migrating-from-loaders))
- [ ] Verify indexer works with `pnpm dev`

**Dependencies:**

- [ ] Update Node.js to >=22
- [ ] **Add `"type": "module"` to `package.json`** ← Required for V3!
- [ ] Update `envio` dependency to latest `3.0.0-alpha.x`
- [ ] Update `engines.node` to `>=22.0.0` in `package.json`
- [ ] Update `tsconfig.json` for ESM support
- [ ] Migrate from mocha/chai to vitest (recommended) or replace `ts-mocha`/`ts-node` with `tsx`

**config.yaml:**

- [ ] Rename `networks` to `chains`
- [ ] Rename `confirmed_block_threshold` to `max_reorg_depth`
- [ ] Replace `rpc_config` with `rpc`
- [ ] Remove `unordered_multichain_mode` (now default)
- [ ] Remove `loaders` and `preload_handlers` options
- [ ] Remove `preRegisterDynamicContracts` option
- [ ] Remove `event_decoder` option

**Environment Variables:**

- [ ] **Set `ENVIO_API_TOKEN`** if using HyperSync ([get token](https://envio.dev/app/api-tokens))
- [ ] Remove `UNSTABLE__TEMP_UNORDERED_HEAD_MODE`
- [ ] Remove `UNORDERED_MULTICHAIN_MODE`
- [ ] Remove `MAX_BATCH_SIZE` (use `full_batch_size` in config.yaml)

**Handler Code:**

- [ ] Replace `experimental_createEffect` with `createEffect`
- [ ] Replace `block.chainId` with `context.chain.id` in block handlers
- [ ] Replace `transaction.kind` with `transaction.type`
- [ ] Update usage of `chain` type to `ChainId`
- [ ] Replace `getGeneratedByChainId` with `indexer.chains[chainId]`
- [ ] Update code expecting `Address` type to be `string` (now `` `0x${string}` ``)
- [ ] Replace `transaction.chainId` with `context.chain.id` or `event.chainId`
- [ ] Replace lowercased entity type imports with capitalized versions (e.g., `transfer` → `Transfer`)

**Verify:**

- [ ] Run `pnpm envio codegen` and `pnpm dev` to verify

## Getting Help

If you encounter any issues during migration, join our [Discord community](https://discord.gg/envio) for support.

## Release Notes

For detailed release notes, see:

- [v3.0.0-alpha.13](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.13)
- [v3.0.0-alpha.12](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.12)
- [v3.0.0-alpha.11](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.11)
- [v3.0.0-alpha.10](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.10)
- [v3.0.0-alpha.9](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.9)
- [v3.0.0-alpha.8](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.8)
- [v3.0.0-alpha.7](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.7)
- [v3.0.0-alpha.6](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.6)
- [v3.0.0-alpha.5](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.5)
- [v3.0.0-alpha.4](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.4)
- [v3.0.0-alpha.3](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.3)
- [v3.0.0-alpha.2](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.2)
- [v3.0.0-alpha.1](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.1)
- [v3.0.0-alpha.0](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.0)
