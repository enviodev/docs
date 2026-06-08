---
id: migrate-to-v3
title: Migrate to HyperIndex V3
sidebar_label: Migrate to V3 🚀
slug: /migrate-to-v3
description: Step-by-step instructions for upgrading an existing HyperIndex V2 project to V3.
image: /docs-assets/og/HyperIndex/migrate-to-v3.png
---

# Migrate to HyperIndex V3

This guide covers every change required to upgrade a HyperIndex V2 project to V3. For new V3 capabilities, see [What's New in V3](./whats-new-in-v3).

Easiest path — prompt your AI tool (Claude/Cursor/Codex):

```
Upgrade my indexer to V3 by following the migration instructions step by step https://docs.envio.dev/docs/HyperIndex/migrate-to-v3
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/Tv6oY2e1Fjs" title="Migrate to HyperIndex V3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Step 0: Prepare on V2 (Recommended)

While still on V2:

1. Upgrade to `envio@^2.32.6`.
2. Set `preload_handlers: true` in `config.yaml`.
3. If using loaders, migrate them per [Migrating from Loaders](/docs/HyperIndex/preload-optimization#migrating-from-loaders).
4. Verify with `pnpm dev`.

## Step 1: Update Node.js

Use Node.js **22+** (24 recommended). Earlier versions are unsupported.

## Step 2: Update `package.json`

- Add `"type": "module"` (required — without it the project fails to start with ESM errors).
- Set `engines.node` to `>=22.0.0`.
- Update `envio` to the latest v3 release.
- Remove `optionalDependencies.generated` — the local `generated` package no longer exists.

```json
{
  "type": "module",
  "engines": { "node": ">=22.0.0" },
  "dependencies": { "envio": "3.0.0" },
  "devDependencies": {
    "@types/node": "24.12.2",
    "typescript": "6.0.3",
    "vitest": "4.1.0"
  }
}
```

If you used `ts-node` for the start script, replace it with `"start": "envio start"`.

### Test runner

**Option A — Vitest (recommended).**

```bash
pnpm remove ts-mocha ts-node mocha chai @types/mocha @types/chai
pnpm add -D vitest@4.0.16
```

Set `"test": "vitest run"`, then move `test/Test.ts` → `src/indexer.test.ts` and update imports:

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

Update for ESM (copy-paste the file as-is, comments included):

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
`verbatimModuleSyntax` and `noUncheckedIndexedAccess` are optional extra strictness — disable them to simplify migration.
:::

## Step 4: Update `config.yaml`

**Renames:**

- `networks` → `chains`
- `confirmed_block_threshold` → `max_reorg_depth`
- `rpc_config` → `rpc` (now supports multiple URLs, `for: sync | realtime | fallback`, and WebSocket config)

**Remove if present:**

- `unordered_multichain_mode` and any `multichain: ordered` — unordered is the only mode in V3.
- `loaders`, `preload_handlers` — Preload Optimization is always enabled.
- `preRegisterDynamicContracts` — no longer needed.
- `event_decoder` — the Rust decoder is the only implementation.
- `output` — types always emitted to `.envio/`.

**Env var → config:** replace the `MAX_BATCH_SIZE` env var with `full_batch_size: 5000`.

**Optional (recommended):** move handler files to `src/handlers/` and drop the explicit `handler` paths (the `handler` field still works).

## Step 5: Update Environment Variables

**Add** — if using HyperSync (the default), set `ENVIO_API_TOKEN` (get a free token at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens)).

**Remove:**

- `UNSTABLE__TEMP_UNORDERED_HEAD_MODE`
- `UNORDERED_MULTICHAIN_MODE`
- `MAX_BATCH_SIZE` (use `full_batch_size` in `config.yaml`)
- `ENVIO_INDEXING_BLOCK_LAG` (use per-chain `block_lag`)

**Rename:**

- `TUI_OFF=true` → `ENVIO_TUI=false` (TUI also auto-disabled in CI and under AI agents)
- `ENVIO_PG_PUBLIC_SCHEMA` → `ENVIO_PG_SCHEMA` (old name supported until v4)

## Step 6: Update Handler Code

Contract-specific exports are removed. Register handlers through the unified `indexer` from the `envio` package, which replaces `generated`.

### Event handlers

```typescript
// Before
import { ERC20 } from "generated";

ERC20.Transfer.handler(
  async ({ event, context }) => {},
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
  async ({ event, context }) => {},
);
```

- `eventFilters` → `where`. Callback receives `{ chain }` (not `{ chainId }`) and returns `false`, `true`, or `{ params: [...], block?: { number: { _gte, _lte, _every } } }`.
- The top-level array shorthand is gone — wrap it in `{ params: [...] }`.

**Filtering by the contract's own addresses** — V2's `eventFilters` `addresses` argument becomes `chain.<ContractName>.addresses` (kept in sync with `context.chain.<ContractName>.add(...)`):

```typescript
// Before
import { Safe } from "generated";

Safe.Transfer.handler(async ({ event, context }) => {}, {
  wildcard: true,
  eventFilters: ({ addresses }) => [{ from: addresses }, { to: addresses }],
});

// After
import { indexer } from "envio";

indexer.onEvent(
  {
    contract: "Safe",
    event: "Transfer",
    wildcard: true,
    where: ({ chain }) => ({
      params: [{ from: chain.Safe.addresses }, { to: chain.Safe.addresses }],
    }),
  },
  async ({ event, context }) => {},
);
```

### Dynamic contract registration

```typescript
// Before
import { UniV3 } from "generated";

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

`context.add<ContractName>(addr)` → `context.chain.<ContractName>.add(addr)`.

### Block handlers

**Behavior change.** V2's `onBlock` ran on one chain (its `chain` option) with top-level `interval`/`startBlock`/`endBlock`. V3's `indexer.onBlock` runs on **every chain by default**. To restore V2's single-chain + range + interval behavior, pass a `where` callback that returns `false` for unwanted chains and `{ block: { number: { _gte, _lte, _every } } }` for the range/interval.

```typescript
// Before — only chain 1, every 100 blocks, fixed range
import { onBlock } from "generated";

onBlock(
  { name: "Ranges", chain: 1, startBlock: 20_000_000, endBlock: 22_000_000, interval: 100 },
  async ({ block, context }) => {},
);

// After
import { indexer } from "envio";

indexer.onBlock(
  {
    name: "Ranges",
    where: ({ chain }) => {
      if (chain.id !== 1) return false;
      return { block: { number: { _gte: 20_000_000, _lte: 22_000_000, _every: 100 } } };
    },
  },
  async ({ block, context }) => {},
);
```

To run on **every** chain (the new default), omit `where`. Inside the handler, `block.chainId` → `context.chain.id`.

### `getWhere` API

Switch to GraphQL-style filter syntax (new operators: `_gte`, `_lte`, `_in`):

```typescript
// Before
await context.Transfer.getWhere.from.eq("0x123...");
await context.Transfer.getWhere.value.gt(1000n);

// After
await context.Transfer.getWhere({ from: { _eq: "0x123..." } });
await context.Transfer.getWhere({ value: { _gt: 1000n } });
```

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

Other type changes: `Address` is now `` `0x${string}` `` (was `string`); entity array fields are `readonly`; `S.nullable` returns `T | null` (was `T | undefined`); the internal `ContractType` enum was removed.

## Step 7: Remove `generated`

The `generated` package is no longer needed — remove it. Import everything from `"envio"` instead. This works via `envio-env.d.ts`, which is linked automatically (no `tsconfig.json` change needed).

## Step 8: Update Tests

`MockDb` is removed. Use `createTestIndexer()` with `simulate`.

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
+          { contract: "Greeter", event: "NewGreeting", params: { greeting, user: userAddress } },
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

| Old (`MockDb`)                                | New (`createTestIndexer`)                            |
| --------------------------------------------- | ---------------------------------------------------- |
| `MockDb.createMockDb()`                       | `createTestIndexer()`                                |
| `Contract.Event.createMockEvent({...})`       | Inline in `simulate: [{ contract, event, params }]`  |
| `Contract.Event.processEvent({event,mockDb})` | `indexer.process({ chains: { id: { simulate } } })`  |
| `mockDb.entities.Entity.get(id)`              | `await indexer.Entity.getOrThrow(id)`                |
| `mockDb.entities.Entity.set({...})`           | `indexer.Entity.set({...})`                          |
| Manual handler threading & event chaining     | Automatic — pass multiple events in `simulate`       |

## Step 9: Update CLI Usage

- `envio dev` no longer auto-resets the DB — use `envio dev -r` (`--restart`) if you relied on that.
- `envio start` is now production-only; use `envio dev` for local development.
- Handler file changes no longer trigger codegen on `pnpm dev`.

## Step 10: Run Codegen and Verify

```bash
pnpm envio codegen
pnpm dev
```

Postgres column type changes (`raw_events.event_id`: `NUMERIC`→`BIGINT`, `raw_events.serial`: `SERIAL`→`BIGSERIAL`, `envio_chains.events_processed`: `INTEGER`→`BIGINT`, `envio_checkpoints.id`: `INTEGER`→`BIGINT`) apply automatically. The deprecated `envio_chains._num_batches_fetched` always returns `0`.

## Step 11: Update Agent Skills

Refresh the bundled agent skills so agent-driven development stays aligned with V3:

```bash
pnpx envio skills update
```

This populates `.claude/skills` (consumed by Claude, Cursor, and other agentic tooling). Re-run it on each new HyperIndex release.

## Getting Help

Issues during migration? Join our [Discord community](https://discord.gg/envio).
