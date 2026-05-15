---
id: migrate-to-v3
title: Migrate to HyperIndex V3
sidebar_label: Migrate to V3 🚀
slug: /migrate-to-v3
description: Step-by-step instructions for upgrading an existing HyperIndex V2 project to V3.
---

# Migrate to HyperIndex V3

This guide is a plain, step-by-step checklist of every change required to upgrade an existing HyperIndex V2 project to V3. For an overview of new V3 capabilities, see [What's New in V3](./whats-new-in-v3).

Follow the steps in order. Each step is independent enough to skim, but Step 0 (preparation on V2) is strongly recommended before you start touching V3 code.

## Step 0: Prepare on V2 (Recommended)

Before upgrading to V3, prepare your project while still on V2:

1. Upgrade to `envio@2.32.6`.
2. Enable Preload Optimization in `config.yaml`:

   ```yaml
   preload_handlers: true
   ```

3. If you were using loaders, migrate them to Preload Optimization following the [Migrating from Loaders](/docs/HyperIndex/preload-optimization#migrating-from-loaders) guide.
4. Verify your indexer still works with `pnpm dev`.

## Step 1: Update Node.js

Update Node.js to **22 or higher** (24 is recommended). Earlier versions are no longer supported.

## Step 2: Update `package.json`

1. Add `"type": "module"` (required — without it the project will fail to start with ESM import errors).
2. Set `engines.node` to `>=22.0.0`.
3. Update the `envio` dependency to the latest v3 release.
4. Remove the `optionalDependencies.generated` entry — the local `generated` package no longer exists. Types are emitted to `.envio/types.d.ts` (git-ignored) and wired up via a small `envio-env.d.ts` file at the project root. Everything previously imported from `generated` is now exported from `envio`.

   ```diff
   -  "optionalDependencies": {
   -    "generated": "./generated"
   -  },
   ```

5. Update dev tooling:

   ```json
   {
     "type": "module",
     "engines": {
       "node": ">=22.0.0"
     },
     "dependencies": {
       "envio": "3.0.0"
     },
     "devDependencies": {
       "@types/node": "24.12.2",
       "typescript": "6.0.3",
       "vitest": "4.1.0"
     }
   }
   ```

6. If you used `ts-node` for the start script, replace it with `envio start`:

   ```json
   {
     "scripts": {
       "start": "envio start"
     }
   }
   ```

### Test runner

**Option A — Migrate to Vitest (recommended).**

```bash
pnpm remove ts-mocha ts-node mocha chai @types/mocha @types/chai
pnpm add -D vitest@4.0.16
```

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

Move tests from `test/Test.ts` to `src/indexer.test.ts` and update imports:

```typescript
// Before (mocha/chai)
import { describe, it } from "mocha";
import { expect } from "chai";

// After (vitest)
import { describe, it, expect } from "vitest";
import { createTestIndexer } from "envio";
```

**Option B — Keep Mocha.** Replace `ts-mocha`/`ts-node` with `tsx`:

```bash
pnpm remove ts-mocha ts-node
pnpm add -D tsx@4.21.0
```

```json
{
  "scripts": {
    "mocha": "tsc --noEmit && NODE_OPTIONS='--no-warnings --import tsx' mocha --exit test/**/*.ts"
  }
}
```

## Step 3: Update `tsconfig.json`

Update for ESM:

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
    "lib": ["es2022"],
    "types": ["node"]
  }
}
```

:::tip
`verbatimModuleSyntax` and `noUncheckedIndexedAccess` are extra strictness. You can disable them to simplify the migration.
:::

## Step 4: Update `config.yaml`

### Renames

- `networks` → `chains`
- `confirmed_block_threshold` → `max_reorg_depth`
- `rpc_config` → `rpc` (now supports multiple URLs, `for: sync | realtime | fallback`, and WebSocket configuration)

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

### Removals

Remove these options if present:

- `unordered_multichain_mode` — unordered is now the only mode in V3. The V2 `multichain: ordered` opt-in has also been removed.
- `loaders` — Preload Optimization is now always enabled.
- `preload_handlers` — now always enabled.
- `preRegisterDynamicContracts` — no longer needed.
- `event_decoder` — the Rust-based decoder is now the only implementation.
- `output` — generated types are always emitted to `.envio/`.

### Replacements for environment variables

If you were using the `MAX_BATCH_SIZE` environment variable, switch to the config option:

```yaml
full_batch_size: 5000
```

### Optional: Automatic handler registration

Move handler files to `src/handlers/` and remove the explicit `handler` paths from `config.yaml`. The explicit `handler` field still works if you'd rather not move files immediately.

### Optional: ClickHouse storage

If using ClickHouse, add:

```yaml
storage:
  postgres: true
  clickhouse: true
```

The connection environment variables (`ENVIO_CLICKHOUSE_HOST`, `ENVIO_CLICKHOUSE_DATABASE`, `ENVIO_CLICKHOUSE_USERNAME`, `ENVIO_CLICKHOUSE_PASSWORD`) are still required for `envio start`.

## Step 5: Update Environment Variables

### Add

If your indexer uses HyperSync (the default), set an API token:

1. Get a free API token at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens).
2. Set it in your environment:

   ```bash
   export ENVIO_API_TOKEN=your_token_here
   ```

   Or in a local `.env` file:

   ```env
   ENVIO_API_TOKEN=your_token_here
   ```

### Remove

- `UNSTABLE__TEMP_UNORDERED_HEAD_MODE`
- `UNORDERED_MULTICHAIN_MODE`
- `MAX_BATCH_SIZE` (use `full_batch_size` in `config.yaml` instead)
- `ENVIO_INDEXING_BLOCK_LAG` (use the per-chain `block_lag` config option instead)

### Rename

- `TUI_OFF=true` → `ENVIO_TUI=false` (TUI is also auto-disabled in CI and under AI agents)
- `ENVIO_PG_PUBLIC_SCHEMA` → `ENVIO_PG_SCHEMA` (the old name is still supported until v4)

## Step 6: Update Handler Code

All contract-specific handler exports have been removed. Register every handler through the unified `indexer` value imported from `envio`.

### Migrate event handlers

```typescript
// Before
import { ERC20 } from "generated";

ERC20.Transfer.handler(
  async ({ event, context }) => {
    // ...
  },
  {
    wildcard: true,
    eventFilters: ({ chainId }) => [
      { from: ZERO_ADDRESS, to: WHITELIST[chainId] },
    ],
  }
);

// After
import { indexer } from "envio";

indexer.onEvent(
  {
    contract: "ERC20",
    event: "Transfer",
    wildcard: true,
    where: ({ chain }) => ({
      params: [{ from: ZERO_ADDRESS, to: WHITELIST[chain.id] }],
    }),
  },
  async ({ event, context }) => {
    // ...
  },
);
```

Notes:

- `eventFilters` is renamed to `where`.
- The `where` callback receives `{ chain }` (not `{ chainId }`) and must return `false`, `true`, or `{ params: [...], block?: { number: { _gte, _lte, _every } } }`.
- The previous array shorthand at the top level is no longer accepted — wrap it in `{ params: [...] }`.

#### Filtering by the contract's own addresses

In V2 the addresses configured (or dynamically registered) for the contract were passed into `eventFilters` as the `addresses` argument. In V3 they live on the chain object as `chain.<ContractName>.addresses`, which also stays in sync with anything registered via `context.chain.<ContractName>.add(...)`.

```typescript
// Before
import { Safe } from "generated";

Safe.Transfer.handler(async ({ event, context }) => {}, {
  wildcard: true,
  eventFilters: ({ addresses }) => [
    { from: addresses },
    { to: addresses },
  ],
});

// After
import { indexer } from "envio";

indexer.onEvent(
  {
    contract: "Safe",
    event: "Transfer",
    wildcard: true,
    where: ({ chain }) => ({
      params: [
        { from: chain.Safe.addresses },
        { to: chain.Safe.addresses },
      ],
    }),
  },
  async ({ event, context }) => {},
);
```

### Migrate dynamic contract registration

```typescript
// Before
UniV3.PoolFactory.contractRegister(async ({ event, context }) => {
  context.addPool(event.params.poolAddress);
});

// After
import { indexer } from "envio";

indexer.contractRegister(
  { contract: "UniV3", event: "PoolFactory" },
  async ({ event, context }) => {
    context.chain.Pool.add(event.params.poolAddress);
  },
);
```

`context.add<ContractName>(address)` becomes `context.chain.<ContractName>.add(address)`.

### Migrate block handlers

**Behavior change.** In V2, every `onBlock(...)` call ran on the single chain specified by its `chain` option, and you set `interval`, `startBlock`, and `endBlock` as top-level options. In V3, `indexer.onBlock(...)` runs on **every chain by default**. To match the V2 behavior of "this chain only, in this block range, every N blocks", you have to pass an explicit `where` callback that:

- Returns `false` for chains you don't want to run on (recovering V2's single-chain default).
- Returns `{ block: { number: { _gte, _lte, _every } } }` to express the start block, end block, and interval.

```typescript
// Before — V2 ran this only on chain 1, every 100 blocks, in a fixed range
import { onBlock } from "generated";

onBlock(
  {
    name: "Ranges",
    chain: 1,
    startBlock: 20_000_000,
    endBlock: 22_000_000,
    interval: 100,
  },
  async ({ block, context }) => {
    // ...
  },
);

// After — V3 runs on every chain by default; the where callback narrows
// back down to chain 1 and re-expresses the range/interval via _gte/_lte/_every.
import { indexer } from "envio";

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
    // ...
  },
);
```

If you actually want the handler to run on **every** chain (the new default), simply omit `where`. Inside a block handler, replace `block.chainId` with `context.chain.id`.

### Update the `getWhere` API

Switch to the GraphQL-style filter syntax:

```typescript
// Before
const transfers   = await context.Transfer.getWhere.from.eq("0x123...");
const bigTransfers = await context.Transfer.getWhere.value.gt(1000n);

// After
const transfers    = await context.Transfer.getWhere({ from: { _eq: "0x123..." } });
const bigTransfers = await context.Transfer.getWhere({ value: { _gt: 1000n } });
```

New operators are also available: `_gte`, `_lte`, `_in`.

### Rename and removal cheat sheet

| V2 (removed)                              | V3                                                          |
| ----------------------------------------- | ----------------------------------------------------------- |
| `Contract.Event.handler(...)`             | `indexer.onEvent({ contract, event, ...options }, handler)` |
| `Contract.Event.contractRegister(...)`    | `indexer.contractRegister({ contract, event }, handler)`    |
| `onBlock({ chain, ... }, handler)`        | `indexer.onBlock({ name, where? }, handler)`                |
| `context.add<Contract>(addr)`             | `context.chain.<Contract>.add(addr)`                        |
| `eventFilters` option                     | `where` callback returning `{ params: [...] }`              |
| `experimental_createEffect`               | `createEffect`                                              |
| `block.chainId` (in block handlers)       | `context.chain.id`                                          |
| `transaction.kind`                        | `transaction.type`                                          |
| `transaction.chainId`                     | `context.chain.id` or `event.chainId`                       |
| `chain` type                              | `ChainId` (now a union type)                                |
| `getGeneratedByChainId(...)`              | `indexer.chains[chainId]`                                   |
| `Entity.getWhere.field.eq(value)`         | `Entity.getWhere({ field: { _eq: value } })`                |
| `Entity.getWhere.field.gt(value)`         | `Entity.getWhere({ field: { _gt: value } })`                |
| `Entity.getWhere.field.lt(value)`         | `Entity.getWhere({ field: { _lt: value } })`                |
| Lowercased entity types (e.g. `transfer`) | Capitalized (`Transfer`)                                    |
| `ERC20_Transfer_eventLog`                 | `EvmEvent<"ERC20", "Transfer">`                             |
| `ERC20_Transfer_block`                    | `EvmEvent<"ERC20", "Transfer">["block"]`                    |
| `MyEnum` (direct export)                  | `Enum<"MyEnum">`                                            |
| `MyEntity` (direct export)                | `Entity<"MyEntity">` (preferred; direct still exported)     |

Other type changes:

- `Address` is now `` `0x${string}` `` instead of `string`.
- Entity array fields are typed as `readonly` — update any code that mutates them.
- `S.nullable` schema type now returns `T | null` instead of `T | undefined`.
- The internal `ContractType` enum was removed.

## Step 7: Update Tests

The `MockDb` testing API has been removed. Migrate to `createTestIndexer()` with `simulate`.

```diff
-import { TestHelpers, type User } from "generated";
-const { MockDb, Greeter, Addresses } = TestHelpers;
+import { createTestIndexer, type User, TestHelpers } from "envio";
+const { Addresses } = TestHelpers;

 it("A NewGreeting event creates a User entity", async (t) => {
-  const mockDbInitial = MockDb.createMockDb();
+  const indexer = createTestIndexer();
   const userAddress = Addresses.defaultAddress;
   const greeting = "Hi there";

-  const mockNewGreetingEvent = Greeter.NewGreeting.createMockEvent({
-    greeting: greeting,
-    user: userAddress,
-  });
-
-  const updatedMockDb = await Greeter.NewGreeting.processEvent({
-    event: mockNewGreetingEvent,
-    mockDb: mockDbInitial,
-  });
+  await indexer.process({
+    chains: {
+      137: {
+        simulate: [
+          {
+            contract: "Greeter",
+            event: "NewGreeting",
+            params: { greeting, user: userAddress },
+          },
+        ],
+      },
+    },
+  });

   const expectedUserEntity: User = {
     id: userAddress,
     latestGreeting: greeting,
     numberOfGreetings: 1,
     greetings: [greeting],
   };

-  const actualUserEntity = updatedMockDb.entities.User.get(userAddress);
+  const actualUserEntity = await indexer.User.getOrThrow(userAddress);
   t.expect(actualUserEntity).toEqual(expectedUserEntity);
 });
```

### MockDb migration cheat sheet

| Old (`MockDb`)                              | New (`createTestIndexer`)                                       |
| ------------------------------------------- | --------------------------------------------------------------- |
| `MockDb.createMockDb()`                     | `createTestIndexer()`                                           |
| `Contract.Event.createMockEvent({...})`     | Inline in `simulate: [{ contract, event, params }]`             |
| `Contract.Event.processEvent({event,mockDb})` | `indexer.process({ chains: { id: { simulate } } })`           |
| `mockDb.entities.Entity.get(id)`            | `await indexer.Entity.getOrThrow(id)`                           |
| `mockDb.entities.Entity.set({...})`         | `indexer.Entity.set({...})`                                     |
| Manual handler threading & event chaining   | Automatic — pass multiple events in the `simulate` array        |

## Step 8: Update CLI Usage

- `envio dev` no longer auto-resets the database. If you relied on this, run `envio dev -r` (or `--restart`) explicitly.
- `envio start` is now production-only. Continue using `envio dev` for local development.
- Changes in handler files no longer trigger codegen on `pnpm dev`.

## Step 9: Run Codegen and Verify

```bash
pnpm envio codegen
pnpm dev
```

Postgres column type changes (`raw_events.event_id`: `NUMERIC` → `BIGINT`, `raw_events.serial`: `SERIAL` → `BIGSERIAL`, `envio_chains.events_processed`: `INTEGER` → `BIGINT`, `envio_checkpoints.id`: `INTEGER` → `BIGINT`) are applied automatically — no action required. The deprecated `envio_chains._num_batches_fetched` column always returns `0`.

## Quick Migration Checklist

**Prepare (on V2):**

- [ ] Upgrade to `envio@2.32.6`
- [ ] Enable `preload_handlers: true` in `config.yaml`
- [ ] Migrate from loaders if applicable ([guide](/docs/HyperIndex/preload-optimization#migrating-from-loaders))
- [ ] Verify indexer works with `pnpm dev`

**Dependencies:**

- [ ] Update Node.js to `>=22`
- [ ] **Add `"type": "module"` to `package.json`** ← Required for V3
- [ ] Update `envio` dependency to the latest v3 release
- [ ] Remove `optionalDependencies.generated` from `package.json`
- [ ] Update `engines.node` to `>=22.0.0`
- [ ] Update `tsconfig.json` for ESM support
- [ ] Migrate from mocha/chai to vitest (recommended) or replace `ts-mocha`/`ts-node` with `tsx`

**`config.yaml`:**

- [ ] Rename `networks` → `chains`
- [ ] Rename `confirmed_block_threshold` → `max_reorg_depth`
- [ ] Replace `rpc_config` with `rpc`
- [ ] Remove `unordered_multichain_mode` and any `multichain: ordered` opt-in (unordered is now the only mode)
- [ ] Remove `loaders` and `preload_handlers`
- [ ] Remove `preRegisterDynamicContracts`
- [ ] Remove `event_decoder`
- [ ] Remove `output` (types always written to `.envio/`)
- [ ] If using ClickHouse, add `storage: { postgres: true, clickhouse: true }`

**Environment variables:**

- [ ] Set `ENVIO_API_TOKEN` if using HyperSync ([get token](https://envio.dev/app/api-tokens))
- [ ] Remove `UNSTABLE__TEMP_UNORDERED_HEAD_MODE`
- [ ] Remove `UNORDERED_MULTICHAIN_MODE`
- [ ] Remove `MAX_BATCH_SIZE` (use `full_batch_size`)
- [ ] Remove `ENVIO_INDEXING_BLOCK_LAG` (use per-chain `block_lag`)
- [ ] Rename `TUI_OFF=true` → `ENVIO_TUI=false`
- [ ] Rename `ENVIO_PG_PUBLIC_SCHEMA` → `ENVIO_PG_SCHEMA`

**Handler code:**

- [ ] Migrate event handlers from `Contract.Event.handler(...)` to `indexer.onEvent({ contract, event, ...options }, handler)`
- [ ] Migrate dynamic contract registration to `indexer.contractRegister({ contract, event }, handler)`
- [ ] Replace `context.add<Contract>(addr)` with `context.chain.<Contract>.add(addr)`
- [ ] Convert `eventFilters` to `where` returning `{ params: [...] }`
- [ ] Migrate block handlers to a single `indexer.onBlock` call (use `where` for chain-specific or interval filters)
- [ ] Use `where.block.number._gte` to override per-event start blocks if needed
- [ ] Replace `experimental_createEffect` with `createEffect`
- [ ] Replace `block.chainId` with `context.chain.id`
- [ ] Replace `transaction.kind` with `transaction.type`
- [ ] Replace `transaction.chainId` with `context.chain.id` or `event.chainId`
- [ ] Update `chain` type to `ChainId`
- [ ] Replace `getGeneratedByChainId` with `indexer.chains[chainId]`
- [ ] Update `Address` consumers — type is now `` `0x${string}` ``
- [ ] Replace lowercased entity imports with capitalized versions (e.g. `transfer` → `Transfer`)
- [ ] Update `getWhere` calls to GraphQL-style filter syntax
- [ ] Update any `S.nullable` usage — now returns `null` instead of `undefined`
- [ ] Replace contract-specific type exports with generics (`EvmEvent<"ERC20", "Transfer">`)

**Tests:**

- [ ] Migrate from `MockDb` to `createTestIndexer()`

**CLI:**

- [ ] Use `envio dev -r` if you relied on `envio dev` resetting the DB automatically
- [ ] Use `envio dev` for local development (`envio start` is production-only)

**Verify:**

- [ ] Run `pnpm envio codegen` and `pnpm dev`

## Getting Help

If you encounter any issues during migration, join our [Discord community](https://discord.gg/envio) for support.
