---
id: whats-new-in-v3
title: What's New in HyperIndex V3
sidebar_label: What's New in V3 ✨
slug: /whats-new-in-v3
description: Discover the new features in HyperIndex V3 — the unified handlers API, ESM and top-level await, automatic handler registration, a new testing framework, ClickHouse storage, Solana support, and more.
image: /docs-assets/og/HyperIndex/whats-new-in-v3.png
---

# What's New in HyperIndex V3

15 full months have passed since the official HyperIndex v2.0.0. Since then, we have shipped [32 minor releases](https://github.com/enviodev/hyperindex/releases) and multiple patches with **zero breaking changes** to the documented API. We also received PRs from 6 external contributors, grew from 1 GitHub star to over 470, and saw many big projects rely on HyperIndex.

HyperIndex V3 focuses on modernizing the codebase and laying the foundation for many more months of development. This page describes everything that's new. To upgrade an existing project from V2, follow the [Migrate to V3](./migrate-to-v3) guide.

<iframe width="560" height="315" src="https://www.youtube.com/embed/UgyO-G5pDtg" title="What's New in HyperIndex V3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Tv6oY2e1Fjs" title="HyperIndex V3 vs V2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## New Features

### Unified Handlers API

In V3 all handler registrations now happen through a single `indexer` value. Contract-specific exports (`ERC20.Transfer.handler`, `UniV3.PoolFactory.contractRegister`, etc.) have been removed in favor of `indexer.onEvent`, `indexer.contractRegister`, and `indexer.onBlock`.

**Event handlers** with `indexer.onEvent`:

```typescript
import { indexer } from "envio";

indexer.onEvent(
  {
    contract: "ERC20",
    event: "Transfer",
    wildcard: true,
    where: ({ chain }) => ({
      params: [
        { from: chain.Safe.addresses },
        { to: chain.Safe.addresses },
      ],
    }),
  },
  async ({ event, context }) => {
    // Handler logic
  },
);
```

**Dynamic contracts** with `indexer.contractRegister`:

```typescript
import { indexer } from "envio";

indexer.contractRegister(
  {
    contract: "UniV3",
    event: "PoolFactory",
  },
  async ({ event, context }) => {
    context.chain.Pool.add(event.params.poolAddress);
  },
);
```

**Block handlers** with `indexer.onBlock` consolidate across chains in a single call:

```typescript
import { indexer } from "envio";

indexer.onBlock(
  { name: "EveryBlock" },
  async ({ block, context }) => {
    // Handler logic
  },
);
```

For chain-specific or interval-based block handlers, use the `where` callback:

```typescript
indexer.onBlock(
  {
    name: "Ranges",
    where: ({ chain }) => {
      if (chain.id !== 1) return false;
      return {
        block: {
          number: {
            _gte: 20_000_000,
            _lte: 22_000_000,
            _every: 100,
          },
        },
      };
    },
  },
  async ({ block, context }) => {
    // Handler logic
  },
);
```

### Per-Event Start Block

Handlers can specify custom start blocks per chain via `where.block.number._gte`, overriding contract and chain configuration:

```typescript
indexer.onEvent(
  {
    contract: "UniV4",
    event: "Pool",
    where: ({ chain }) => {
      let startBlock: number;
      switch (chain.id) {
        case 1:
          startBlock = 18_000_000;
          break;
        case 8453:
          startBlock = 2_000_000;
          break;
        default: {
          const _exhaustive: never = chain.id;
          return false;
        }
      }
      return {
        block: { number: { _gte: startBlock } },
      };
    },
  },
  async ({ event, context }) => {
    // Handler logic
  },
);
```

### CommonJS → ESM

We migrated HyperIndex from CommonJS-only to ESM-only. This enables:

- Using the latest versions of libraries that have long since abandoned CommonJS support
- **Top-level await** in handler files

### Top-Level Await

Thanks to the migration to ESM, you can now use `await` directly in handler and other files:

```typescript
import { indexer } from "envio";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Load data before registering handlers
const addressesFromServer = await loadWhitelistedAddresses();

indexer.onEvent(
  {
    contract: "ERC20",
    event: "Transfer",
    wildcard: true,
    where: {
      params: [
        { from: ZERO_ADDRESS, to: addressesFromServer },
        { from: addressesFromServer, to: ZERO_ADDRESS },
      ],
    },
  },
  async ({ event, context }) => {
    // ... your handler logic
  },
);
```

### 3x Historical Backfill Performance

Achieved by adding chunking logic to request events across multiple ranges at once. This also fixed overfetching for contracts with a much later `start_block` in the config, as well as speeding up dynamic contract registration. If you had data fetching as a bottleneck, 25k events per second is now a standard.

### Automatic Handler Registration (`src/handlers`)

We introduced automatic registration of handler files located in `src/handlers`.

Previously, you needed to specify an explicit path to a handler file for every contract in `config.yaml`. Now you can remove all of the paths from `config.yaml` and simply move the files to `src/handlers`. You can name the files however you want, but we suggest using contract names and having a file per contract.

If you don't like `src/handlers`, use the `handlers` option in `config.yaml` to customize it.

:::note
The explicit `handler` field in `config.yaml` still works, so you don't need to change anything immediately.
:::

### RPC for Realtime Indexing

Built by an external contributor [@cairoeth](https://github.com/cairoeth) to allow specifying `realtime` mode for an RPC data source to embrace low-latency head tracking:

```yaml
rpc:
  - url: https://eth-mainnet.your-rpc-provider.com
    for: realtime
```

In this case, the RPC won't be used for historical sync but will be used as the primary source once the indexer enters realtime mode.

### Chain State on Context

The Handler Context object provides chain state via the `chain` property:

```typescript
import { indexer } from "envio";

indexer.onEvent(
  { contract: "ERC20", event: "Approval" },
  async ({ context }) => {
    console.log(context.chain.id); // 1 - The chain id of the event
    console.log(context.chain.isRealtime); // true - Whether the indexer entered realtime mode
  },
);
```

### Indexer State & Config

As a replacement for the deprecated and removed `getGeneratedByChainId`, we introduce the `indexer` value. It provides nicely typed chains and contract data from your config, as well as the current indexing state, such as `isRealtime` and `addresses`. Use `indexer` either at the top level of the file or directly from handlers. It returns the latest indexer state.

With this change, we also introduce new official types: `Indexer`, `EvmChainId`, `FuelChainId`, and `SvmChainId`.

```typescript
import { indexer } from "envio";

indexer.name; // "uniswap-v4-indexer"
indexer.description; // "Uniswap v4 indexer"
indexer.chainIds; // [1, 42161, 10, 8453, 137, 56]
indexer.chains[1].id; // 1
indexer.chains[1].startBlock; // 0
indexer.chains[1].endBlock; // undefined
indexer.chains[1].isRealtime; // false
indexer.chains[1].PoolManager.name; // "PoolManager"
indexer.chains[1].PoolManager.abi; // unknown[]
indexer.chains[1].PoolManager.addresses; // ["0x000000000004444c5dc75cB358380D2e3dE08A90"]
```

On indexer restart, reading `indexer` at the top level of a handler file returns values restored from the database — including dynamically registered contract addresses — rather than only what's declared in `config.yaml`:

```typescript
import { indexer } from "envio";

// Includes initial + dynamically registered addresses persisted in the DB
console.log(indexer.chains.eth.Pool.addresses);
```

### Conditional Event Handlers

Now it's possible to return a boolean value from the `where` function to disable or enable the handler conditionally.

```typescript
import { indexer } from "envio";

indexer.onEvent(
  {
    contract: "ERC20",
    event: "Transfer",
    wildcard: true,
    where: ({ chain }) => {
      // Skip all ERC20 on Polygon
      if (chain.id === 137) {
        return false;
      }

      // Track all ERC20 on Ethereum Mainnet
      if (chain.id === 1) {
        return true;
      }

      // Track only whitelisted addresses on other chains
      return {
        params: [
          { from: ZERO_ADDRESS, to: WHITELISTED_ADDRESSES[chain.id] },
          { from: WHITELISTED_ADDRESSES[chain.id], to: ZERO_ADDRESS },
        ],
      };
    },
  },
  async ({ event, context }) => {
    // ... your handler logic
  },
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
        address: "0x1F98431c8aD98523631AE4a59f267346ea31F984"
      # UniswapV3Pool no longer needed here - auto-configured from global contracts
  - id: 10
    start_block: 0
    contracts:
      - name: UniswapV3Factory
        address: "0x1F98431c8aD98523631AE4a59f267346ea31F984"
      # UniswapV3Pool no longer needed here - auto-configured from global contracts
```

### ClickHouse Storage (Experimental)

HyperIndex can now run with multiple storage backends at the same time. Postgres remains the primary database, and entities can additionally be written to a ClickHouse database that is restart- and reorg-resistant. Prometheus metrics carry a storage-name label so you can distinguish backends.

Enable backends in `config.yaml` and route each entity explicitly via the `@storage` directive in `schema.graphql`:

```yaml
storage:
  postgres: true
  clickhouse: true
```

```graphql
# Stored in both Postgres and ClickHouse
type Transfer @storage(postgres: true, clickhouse: true) {
  id: ID!
  from: String!
  to: String!
  value: BigInt!
}

# Stored only in ClickHouse
type Snapshot @storage(clickhouse: true) {
  id: ID!
  blockNumber: BigInt!
}
```

Per-entity routing is more verbose but lets you write some entities to Postgres and others to ClickHouse only.

`envio dev` automatically spins up a ClickHouse Docker container for local development with playground-friendly defaults so you can connect to it without configuring a password. For `envio start`, provide your own connection via the environment variables `ENVIO_CLICKHOUSE_HOST`, `ENVIO_CLICKHOUSE_DATABASE`, `ENVIO_CLICKHOUSE_USERNAME`, and `ENVIO_CLICKHOUSE_PASSWORD`.

Envio Cloud currently supports ClickHouse on the Dedicated Plan.

For high-availability ClickHouse setups, HyperIndex supports two additional environment variables:

- `ENVIO_CLICKHOUSE_REPLICATED` — set to `true` to use replicated table engines.
- `ENVIO_CLICKHOUSE_DATABASE_ENGINE` — override the database engine (for example, `Replicated`).

:::warning
Do not run multiple indexers writing to the same ClickHouse database at the same time.
:::

### HyperSync Source Improvements

Multiple updates on the HyperSync side to achieve smaller latency and less traffic:

- Server-Sent Events instead of polling to get updates about new blocks
- CapnProto instead of JSON for query serialization
- Cache for queries with repetitive filters - huge egress saving when indexing thousands of addresses
- Improved connection establishment behind a proxy
- Configurable log level support via `ENVIO_HYPERSYNC_LOG_LEVEL` environment variable
- Automatic rate-limiting handling on the client side
- Better reconnection logic, logging, and fallbacks for HyperSync SSE and RPC WebSocket height streaming for more stable indexing at the chain head

### Fuel Block Handler Support

Block handlers are now supported for Fuel indexing.

### Solana Support (Experimental)

HyperIndex now supports Solana with RPC as a source. This feature is experimental and may undergo minor breaking changes. Solana exposes its block-stream handler as `indexer.onSlot` (rather than `onBlock`) to match Solana's slot-based model.

To initialize a Solana project:

```bash
pnpx envio init svm
```

See the [Solana documentation](/docs/HyperIndex/solana) for more details.

### `pnpx envio init` Improvements

- Removed language selection to prefer TypeScript by default
- Cleaned up templates to follow the latest good practices
- Added new templates to highlight HyperIndex features: `Feature: Factory Contract`, `Feature: External Calls`
- Pre-configured GitHub Actions workflow for running tests and initialized git repository
- Generated projects include Cursor/Claude skills to support agent-driven development

### Block Handler Only Indexers

Now it's possible to create indexers with only block handlers. Previously, it was required to have at least one event handler for it to work. The `contracts` field became optional in `config.yaml`.

### Flexible Entity Fields

We no longer have restrictions on entity field names, such as `type` and others. Shape your entities any way you want. There are also improvements in generating database columns in the same order as they are defined in the `schema.graphql`.

### Unordered Multichain Mode Only

Unordered multichain mode is now the only mode in V3 — events from different chains are processed in parallel without strict cross-chain ordering, which provides better performance for most use cases. The V2 `unordered_multichain_mode` option and the `multichain: ordered` opt-in have been removed.

### Preload Optimization by Default

Preload optimization is now enabled by default, replacing the previous `loaders` and `preload_handlers` options. This improves historical sync performance automatically.

### TUI Improvements

We gave our TUI some love, making it look more beautiful and compact. It also consumes fewer resources, shares a link to the Hasura playground, and dynamically adjusts to the terminal width.

The TUI now shows an **events-per-second** indicator during backfill so you can see indexing throughput at a glance.

The TUI is also auto-disabled in CI environments and when running under AI agents, so logs stay clean without manual configuration. The legacy `TUI_OFF=true` environment variable was renamed to `ENVIO_TUI=false`.

![TUI](/img/sync.gif)

### New Testing Framework

HyperIndex ships a purpose-built testing framework powered by `createTestIndexer()`. Write tests against the same indexer that runs in production — no database, no Docker, no manual mock wiring.

The framework integrates with [Vitest](https://vitest.dev/), replacing the previous mocha/chai setup with a single package that doesn't require configuration by default and includes snapshot testing out-of-the-box. It also provides typed test assertions and utilities to read/write entities in-between processing runs.

#### Three ways to feed events

**1. Auto-exit** — processes the first block with matching events, then exits. Each subsequent call continues where the last one stopped. Zero config needed.

```typescript
import { describe, it } from "vitest";
import { createTestIndexer } from "envio";

describe("ERC20 indexer", () => {
  it("processes the first block with events", async (t) => {
    const indexer = createTestIndexer();

    const result = await indexer.process({ chains: { 1: {} } });

    // Auto-filled by Vitest on first run — just review and commit
    t.expect(result).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "Transfer": {
              "sets": [
                {
                  "blockNumber": 10861674,
                  "from": "0x0000000000000000000000000000000000000000",
                  "id": "1-10861674-23",
                  "to": "0x41653c7d61609D856f29355E404F310Ec4142Cfb",
                  "transactionHash": "0x4b37d2f343608457ca...",
                  "value": 1000000000000000000000000000n,
                },
              ],
            },
            "block": 10861674,
            "chainId": 1,
            "eventsProcessed": 1,
          },
        ],
      }
    `);
  });
});
```

**2. Explicit block range** — pin to specific blocks for deterministic CI snapshots.

```typescript
const result = await indexer.process({
  chains: {
    1: {
      startBlock: 10_861_674,
      endBlock: 10_861_674,
    },
  },
});
```

**3. Simulate** — feed typed synthetic events for pure unit tests. No network, no block ranges.

```typescript
await indexer.process({
  chains: {
    137: {
      simulate: [
        {
          contract: "Greeter",
          event: "NewGreeting",
          params: { greeting: "Hello", user: "0x123..." },
        },
      ],
    },
  },
});
```

#### Key capabilities

- **Snapshot-driven assertions** — `result.changes` captures every entity set/delete per block. Pair with `toMatchInlineSnapshot` for auto-generated, reviewable snapshots.
- **Direct entity access** — `indexer.Entity.get()`, `.getOrThrow()`, `.getAll()`, and `.set()` for reading and presetting state.
- **Real pipeline, real confidence** — tests exercise the full indexer pipeline including dynamic contract registration, multi-chain support, and handler context.
- **Parallel test execution** via worker thread isolation.

The test indexer also exposes chain information:

```typescript
const indexer = createTestIndexer();
indexer.chainIds; // [1, 42161]
indexer.chains[1].id; // 1
indexer.chains[1].startBlock; // 0
indexer.chains[1].ERC20.addresses; // ["0x..."]

// Read/write entities between processing runs
await indexer.Account.set({ id: "0x123...", balance: 100n });
const account = await indexer.Account.get("0x123...");
```

See the [Testing documentation](/docs/HyperIndex/testing) for more details.

### Podman Support

Beyond Docker, HyperIndex now supports [Podman](https://podman.io/) for local development environments. This provides an alternative container runtime for developers who prefer Podman or have it available in their environment.

### Nested Tuples for Contract Import

The `envio init` command now supports contracts with nested tuples in event signatures, which was previously a limitation when importing contracts.

### PostgreSQL Update for Local Docker Compose

The local development Docker Compose setup now uses PostgreSQL 18.1 (upgraded from 17.5).

### `contractName` and `eventName` on Event

Events now include `contractName` and `eventName` fields, making it easier to identify which contract and event you're working with in handlers:

```typescript
import { indexer } from "envio";

indexer.onEvent(
  { contract: "ERC20", event: "Transfer" },
  async ({ event }) => {
    console.log(event.contractName); // "ERC20"
    console.log(event.eventName);    // "Transfer"
  },
);
```

### New Official Exported Types

Generated code now exports official generic types for entities, enums, and events. These replace the previous contract-specific type exports:

```typescript
import type {
  MyEntity,        // Still exported but Entity<"MyEntity"> is preferred
  Entity,          // Generic entity type — use as Entity<"MyEntity">
  Enum,            // Generic enum type — use as Enum<"MyEnum"> (replaces direct MyEnum export)
  EvmEvent,        // Generic event type — use as EvmEvent<"ERC20", "Transfer">
                   // Access specific fields: EvmEvent<"ERC20", "Transfer">["block"]
} from "envio";
```

### Support for DESC Indices

A nice way to improve your query performance as well:

```graphql
type PoolDayData
  @index(fields: ["poolId", ["date", "DESC"]]) {
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
      for: realtime
```

### Prometheus Metrics for Data Providers

Added a Prometheus metric to track requests to data providers, providing better observability into your indexer's data fetching patterns.

### GraphQL-Style `getWhere` API

The `getWhere` query API has been redesigned using GraphQL-style syntax:

```typescript
// Before
const transfers = await context.Transfer.getWhere.from.eq("0x123...");

// After
const transfers = await context.Transfer.getWhere({ from: { _eq: "0x123..." } });
```

Additionally, three new filter operators are available following Hasura-style conventions:

```typescript
context.Entity.getWhere({ amount: { _gte: 100n } })
context.Entity.getWhere({ amount: { _lte: 500n } })
context.Entity.getWhere({ status: { _in: ["active", "pending"] } })
```

### Direct RPC Client

Replaced Ethers.js with a direct RPC client implementation, reducing dependencies and improving performance.

### Block Lag Configuration

A per-chain `block_lag` option to index behind the chain head by a specified number of blocks. Replaces the global `ENVIO_INDEXING_BLOCK_LAG` environment variable. Defaults to 0. This is for advanced use cases — only use it if you know what you're doing.

```yaml
chains:
  - id: 1
    block_lag: 5
```

### Official `/metrics` Endpoint

Prometheus metrics are now official. We cleaned up metric names, switched time units to seconds instead of milliseconds, and followed Prometheus naming conventions more closely. Metrics also cover data points previously available only via the `--bench` feature. A separate `/metrics/runtime` endpoint with a dedicated Prometheus registry is available for runtime metrics, isolated from the default `/metrics` endpoint.

Starting from the v3.0.0 release, Prometheus metrics will follow semver and be documented.

Breaking changes:

- Cleaned up metric names and switched time units from milliseconds to seconds
- Removed [`--bench`](/docs/HyperIndex/benchmarking) support — use the `/metrics` endpoint instead

Use the new `envio metrics` CLI command to fetch the Prometheus metrics of a locally running indexer without curling the endpoint manually.

### Continue on Config Change

HyperIndex can now keep indexing through some `config.yaml` changes — `rpc` configuration is the first to land — instead of erroring out on every restart. Where a change is incompatible, the CLI prints exactly which fields were touched and offers two clear options (revert, or `envio dev -r` to wipe and re-index). More flexibility will be unlocked over time; open a GitHub issue if you need a specific field supported.

### Double Handler Registration

It's now possible to register multiple handlers for the same event with similar filters:

```typescript
import { indexer } from "envio";

indexer.onEvent(
  { contract: "ERC20", event: "Transfer" },
  async ({ event, context }) => {
    // Your logic here
  },
);

indexer.onEvent(
  { contract: "ERC20", event: "Transfer" },
  async ({ event, context }) => {
    // And here
  },
);
```

### Improved Multiple Data-Sources Support

After switching to a fallback source, HyperIndex now attempts to recover to the primary source 60 seconds later. Previously, it would stay on the fallback until the fallback was down or the indexer was restarted. The source selection logic has also been improved for better indexing resilience and stricter enforcement of the `realtime` mode configuration.

### Updated Dev Docker Flow

`envio dev` no longer uses a generated Docker Compose file and manages containers, network, and volumes directly for greater flexibility. For example, disabling Hasura with `ENVIO_HASURA` now prevents `envio dev` from pulling the Hasura image. Use `envio dev --restart` (or `-r`) to forcefully clear the database even if there are no config changes detected.

### Envio Dev Update

`envio dev` no longer automatically resets the database on incompatible config or schema changes. Use `envio dev -r` to explicitly allow this.

### Envio Start Update

`envio start` now has a clear role: to run HyperIndex in the production environment. Use `envio dev` for local development to enable debugging with Dev Console.

### Optimized `envio codegen`

`envio codegen` is now near-instant. We no longer run `pnpm i` for the `generated` package, and we no longer recompile ReScript every time you change `config.yaml` or `schema.graphql`. The output is also a lot quieter.

### `envio skills update` Command

Pull the latest Claude/Cursor skills into your project so agent-driven development stays in sync with the latest HyperIndex APIs:

```bash
pnpx envio skills update
```

### `envio config view` Command (Experimental)

Inspect your fully resolved indexer configuration as JSON — useful for debugging configuration issues and for tooling that needs to consume the resolved config:

```bash
pnpx envio config view
```

### Improved TypeScript Error Messages

When generated types are missing, the TypeScript error now explicitly suggests running `envio codegen` instead of leaving you to puzzle out the cause.

### Smaller `envio` Package (-88MB)

By eliminating dynamically generated ReScript code, we no longer need to ship or run a ReScript compiler at runtime. The published npm package shrank from 141MB to 53MB.

### No Hard pnpm Requirement

Internal use of pnpm is gone. The `generated` package no longer has its own dependency tree, so HyperIndex works with whichever package manager you prefer.

### Bun Support

Run HyperIndex on Bun:

```bash
bun --bun envio dev
```

### Choose Your Package Manager on `envio init`

`envio init` now accepts `--package-manager=pnpm|npm|bun|yarn` so you can scaffold projects without committing to pnpm.

### Better Tuples Developer Experience

Solidity struct components used to be generated as positional tuples in handler params, which made handler code awkward. They are now generated as objects with named fields:

```solidity
struct CreateEventCommon {
  address funder;
  address sender;
  address recipient;
  Lockup.CreateAmounts amounts;
  IERC20 token;
  bool cancelable;
  bool transferable;
  Lockup.Timestamps timestamps;
  string shape;
  address broker;
}

event CreateLockupTranchedStream(
  uint256 indexed streamId,
  Lockup.CreateEventCommon commonParams,
  LockupTranched.Tranche[] tranches
);
```

```typescript
// Before
event.params.commonParams[5];
event.params.commonParams[3][0];

// After
event.params.commonParams.cancelable;
event.params.commonParams.amounts.deposit;
```

### Improved Multichain Backfill

For large multichain indexers, HyperIndex now throttles chains that have already reached the head so they don't compete for resources while the rest finish backfilling. Once every chain has caught up, throttling is lifted and all chains continue indexing equally.

### Toolchain Upgrades

- ReScript upgraded from v11 to v12 (internally and in `envio init` templates)
- TypeScript upgraded from v5 to v6 (internally and in `envio init` templates)

### 2x Cheaper and 2.5x Faster (v3.1)

HyperIndex now requires up to **2x fewer HyperSync queries** during backfill and is **2.5x faster** in many indexing cases. If you had data fetching as a bottleneck, this comes for free on upgrade.

### Descriptions on Entities, Fields, and Relationships (v3.1)

You can now document your entities, fields, and relationships directly in `schema.graphql` using string descriptions. These are exposed through the GraphQL API and appear in introspection:

```graphql
"""
A token transfer between two accounts
"""
type Transfer {
  id: ID!
  "The address the tokens were sent from"
  from: String!
  "The address the tokens were sent to"
  to: String!
  "The amount transferred, in wei"
  value: BigInt!
}
```

Only string descriptions (`"""..."""` or `"..."`) are exposed. Hash (`#`) comments are ignored by the GraphQL parser and do **not** appear in introspection.

### Skip Chains From Indexing (v3.1)

A new `skip` field in `config.yaml` lets you exclude a specific chain from indexing and database migrations without removing it from your config:

```yaml
chains:
  - id: 1
    start_block: 0
    contracts: # ...
  - id: 137
    skip: true
    start_block: 0
    contracts: # ...
```

### Improved Agentic Indexer Development (v3.1)

New CLI subcommands make it easier to build indexers with AI agents:

```bash
envio tools search-docs <query>  # Search the HyperIndex documentation
envio tools fetch-docs <url>     # Fetch documentation from a URL
envio metrics runtime            # Fetch runtime metrics of a local indexer
```

The skills shipped by `envio init` and `envio skills update` were also cleaned up.

### Rate-Limit Info in TUI and Logs (v3.1)

HyperSync rate-limit handling was improved, and rate-limit information is now surfaced in the TUI and logs so you can see when you're being throttled.

### Filter by Multiple Fields with `getWhere` (v3.2)

`getWhere` now supports filtering by multiple fields simultaneously in a single call:

```typescript
await context.Account.getWhere({
  id: { _eq: "0x123..." },
  balance: { _gte: 1_000_000n, _lte: 10_000_000n },
});
```

Single `_eq` or `_in` filters were also optimized to reduce database round trips.

### Default Storage (v3.2)

When running with multiple storage backends, you can now mark a storage as `default` so entities are automatically assigned to it without needing a `@storage` attribute on every entity:

```yaml
storage:
  postgres:
    default: true
  clickhouse:
    default: true
```

### Configurable Column Name Format (v3.2)

You can configure HyperIndex to automatically convert database column names to `snake_case` while keeping the original names in GraphQL and your handler types:

```yaml
storage:
  postgres:
    column_name_format: snake_case
```

### More Experimental Solana Features (v3.2)

Added HyperSync-powered instruction handler support for Solana. This is experimental and we're looking for early testers — see the [Solana documentation](/docs/HyperIndex/solana) to get started.

## Fixes

- Fixed indexer crashes introduced in v3.1, including in-flight batch write flushing before rollback computation and duplicate history rows from concurrent batch writes (v3.2)
- Improved handling of missing transaction data by treating it as a retryable RPC error (v3.2)
- Fixed config path root-relative behavior in the `start` command (v3.2)
- Added duplicate address validation at config parse time (v3.2)
- Fixed indexer startup with 4.5M+ contracts (v3.1)
- Eliminated unnecessary height polling when the buffer reaches the chain head, also resolving related DDoS issues from stale SSE connections (v3.1)
- Fixed an issue where the indexer stops progressing without any error (PostgreSQL client update)
- Fixed checksum for addresses returned by RPC in lowercase
- Fixed incorrect validation of transactions `to` field returned by RPC
- Fixed OOM error on RPC request crashing loop
- Fixed an edge case where a multichain indexer could freeze during a rollback on reorg (also backported to v2.32.10)
- Fixed external Postgres database support via `ENVIO_PG_HOST`
- Fixed `S.nullable` schema type to be `T | null` instead of `T | undefined`

## Release Notes

For detailed release notes, see:

- [v3.2.0](https://github.com/enviodev/hyperindex/releases/tag/v3.2.0)
- [v3.1.0](https://github.com/enviodev/hyperindex/releases/tag/v3.1.0)
- [v3.0.0](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0)
- [v3.0.0-rc.1](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-rc.1)
- [v3.0.0-rc.0](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-rc.0)
- [v3.0.0-alpha.24](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.24)
- [v3.0.0-alpha.23](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.23)
- [v3.0.0-alpha.22](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.22)
- [v3.0.0-alpha.21](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.21)
- [v3.0.0-alpha.20](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.20)
- [v3.0.0-alpha.19](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.19)
- [v3.0.0-alpha.18](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.18)
- [v3.0.0-alpha.17](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.17)
- [v3.0.0-alpha.16](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.16)
- [v3.0.0-alpha.15](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.15)
- [v3.0.0-alpha.14](https://github.com/enviodev/hyperindex/releases/tag/v3.0.0-alpha.14)
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
