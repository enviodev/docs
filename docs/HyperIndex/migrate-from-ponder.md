---
id: migrate-from-ponder
title: Migrate from Ponder to Envio
sidebar_label: Migrate from Ponder
slug: /migrate-from-ponder
description: Easily migrate your existing subgraph to HyperIndex for up to 100x faster indexing speeds, multichain support, and a better developer experience.
---

# Migrate from Ponder to HyperIndex

> **Need help?** Reach out on [Discord](https://discord.gg/envio) for personalized migration assistance.

Migrating from Ponder to HyperIndex is straightforward — both frameworks use TypeScript, index EVM events, and expose a GraphQL API. The key differences are the config format, schema syntax, and entity operation API.

If you are new to HyperIndex, start with the [Getting Started](/docs/HyperIndex/getting-started) guide first.

## Why Migrate to HyperIndex?

- **Up to 158x faster** historical sync via [HyperSync](/docs/HyperIndex/hypersync)
- **Multichain by default** — index any number of chains in one config
- **No infrastructure to manage** — deploy with `envio deploy`
- **Same language** — your TypeScript logic transfers directly

## Migration Overview

Migration has three steps:

1. `ponder.config.ts` → `config.yaml`
2. `ponder.schema.ts` → `schema.graphql`
3. Event handlers — adapt syntax and entity operations

At any point, run:

```bash
pnpm envio codegen   # validate config + schema, regenerate types
pnpm dev             # run the indexer locally
```

---

## Step 0: Bootstrap the Project

```bash
pnpx envio init
```

This generates a `config.yaml`, a starter `schema.graphql`, and handler stubs. Use your Ponder project as the source of truth for contract addresses, ABIs, and events, then fill in the generated files.

---

## Step 1: `ponder.config.ts` → `config.yaml`

**Ponder**

```typescript
import { createConfig } from "ponder";

export default createConfig({
  chains: {
    mainnet: { id: 1, rpc: process.env.PONDER_RPC_URL_1 },
  },
  contracts: {
    MyToken: {
      abi: myTokenAbi,
      chain: "mainnet",
      address: "0xabc...",
      startBlock: 18000000,
    },
  },
});
```

**HyperIndex (v3)**

```yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: my-indexer

contracts:
  - name: MyToken
    abi_file_path: ./abis/MyToken.json
    handler: ./src/EventHandlers.ts
    events:
      - event: Transfer
      - event: Approval

chains:
  - id: 1
    start_block: 0
    contracts:
      - name: MyToken
        address:
          - 0xabc...
        start_block: 18000000
```

> **v2 note**: HyperIndex v2 uses `networks` instead of `chains`. See the [v2→v3 migration guide](/docs/HyperIndex/migrate-to-v3).

Key differences:

| Concept         | Ponder                          | HyperIndex                       |
| --------------- | ------------------------------- | -------------------------------- |
| Config format   | `ponder.config.ts` (TypeScript) | `config.yaml` (YAML)             |
| Chain reference | Named + viem object             | Numeric chain ID                 |
| RPC URL         | In config                       | `RPC_URL_<chainId>` env var      |
| ABI source      | TypeScript import               | JSON file (`abi_file_path`)      |
| Events to index | Inferred from handlers          | Explicit `events:` list          |
| Handler file    | Inferred                        | Explicit `handler:` per contract |

**Convert your ABI**: Ponder uses TypeScript ABI exports (`as const`). HyperIndex needs a plain JSON file in `abis/`. Strip the `export const ... =` wrapper and `as const` and save as `.json`.

### Field selection — accessing transaction and block fields

By default, only a minimal set of fields is available on `event.transaction` and `event.block`. Fields like `event.transaction.hash` are `undefined` unless explicitly requested.

```yaml
events:
  - event: Transfer
    field_selection:
      transaction_fields:
        - hash
```

Or declare once at the top level to apply to all events:

```yaml
name: my-indexer

field_selection:
  transaction_fields:
    - hash

contracts:
  # ...
```

See the full list of available fields in the [Configuration File](/docs/HyperIndex/config-schema-reference#fieldselection) docs.

---

## Step 2: `ponder.schema.ts` → `schema.graphql`

**Ponder**

```typescript
import { onchainTable, primaryKey, index } from "ponder";

export const token = onchainTable("token", (t) => ({
  address: t.hex().primaryKey(),
  symbol: t.text().notNull(),
  balance: t.bigint().notNull(),
}));

export const transferEvent = onchainTable(
  "transfer_event",
  (t) => ({
    id: t.text().primaryKey(),
    from: t.hex().notNull(),
    to: t.hex().notNull(),
    amount: t.bigint().notNull(),
    timestamp: t.integer().notNull(),
  }),
  (table) => ({
    fromIdx: index().on(table.from),
  }),
);
```

**HyperIndex**

```graphql
type Token {
  id: ID!
  symbol: String!
  balance: BigInt!
}

type TransferEvent {
  id: ID!
  from: String! @index
  to: String!
  amount: BigInt!
  timestamp: Int!
}
```

Type mapping:

| Ponder                             | HyperIndex GraphQL |
| ---------------------------------- | ------------------ |
| `t.hex()`                          | `String!`          |
| `t.text()`                         | `String!`          |
| `t.bigint()`                       | `BigInt!`          |
| `t.integer()`                      | `Int!`             |
| `t.boolean()`                      | `Boolean!`         |
| `t.real()` / `t.doublePrecision()` | `Float!`           |
| `t.hex().array()`                  | `Json!`            |

**Primary keys**: HyperIndex requires a single `id: ID!` string field on every entity. For composite PKs (e.g. `owner + spender`), construct the ID string manually: `` `${owner}_${spender}` ``.

**Indexes**: Replace `index().on(column)` with an [`@index`](/docs/HyperIndex/schema) directive on the field.

**Relations**: Replace Ponder's `relations()` call with [`@derivedFrom`](/docs/HyperIndex/schema) on the parent entity:

```graphql
type Token {
  id: ID!
  transfers: [TransferEvent!]! @derivedFrom(field: "token_id")
}
```

See the full [Schema](/docs/HyperIndex/schema) docs.

## Step 3: Event Handlers

### Handler registration

**Ponder**

```typescript
import { ponder } from "ponder:registry";

ponder.on("MyToken:Transfer", async ({ event, context }) => {
  // ...
});
```

**HyperIndex**

```typescript
import { MyToken } from "generated";

MyToken.Transfer.handler(async ({ event, context }) => {
  // ...
});
```

### Event data access

| Data             | Ponder                           | HyperIndex                                          |
| ---------------- | -------------------------------- | --------------------------------------------------- |
| Event parameters | `event.args.name`                | `event.params.name`                                 |
| Contract address | `event.log.address`              | `event.srcAddress`                                  |
| Chain ID         | `context.chain.id`               | `event.chainId`                                     |
| Block number     | `event.block.number`             | `event.block.number`                                |
| Block timestamp  | `event.block.timestamp` (bigint) | `event.block.timestamp` (number)                    |
| Tx hash          | `event.transaction.hash`         | `event.transaction.hash` ⚠️ needs `field_selection` |

### Entity operations

| Intent          | Ponder                                    | HyperIndex                                                         |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| Insert          | `context.db.insert(t).values({...})`      | `context.Entity.set({ id, ...fields })`                            |
| Update          | `context.db.update(t, pk).set({...})`     | `get` → spread → `context.Entity.set({ ...existing, ...changes })` |
| Upsert          | `.insert().values().onConflictDoUpdate()` | `context.Entity.getOrCreate({ id, ...defaults })` → `set`          |
| Read (nullable) | `context.db.find(table, pk)`              | `context.Entity.get(id)`                                           |
| Read (throws)   | manual null check                         | `context.Entity.getOrThrow(id)`                                    |

**Full handler example**

_Ponder_

```typescript
ponder.on("MyToken:Transfer", async ({ event, context }) => {
  await context.db.insert(transferEvent).values({
    id: event.id,
    from: event.args.from,
    to: event.args.to,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .update(token, { address: event.args.to })
    .set((row) => ({ balance: row.balance + event.args.amount }));
});
```

_HyperIndex_

```typescript
import { MyToken } from "generated";

MyToken.Transfer.handler(async ({ event, context }) => {
  context.TransferEvent.set({
    id: `${event.transaction.hash}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    amount: event.params.amount,
    timestamp: event.block.timestamp,
  });

  const token = await context.Token.getOrThrow(event.params.to);
  context.Token.set({
    ...token,
    balance: token.balance + event.params.amount,
  });
});
```

> **Important**: Entity objects from `context.Entity.get()` are read-only. Always spread (`...existing`) and set new fields — never mutate directly.

See the [Event Handlers](/docs/HyperIndex/event-handlers) docs for the full API reference.


## Extra Tips

### Factory contracts (dynamic registration)

Replace Ponder's `factory()` helper in config with a [`contractRegister`](/docs/HyperIndex/dynamic-contracts) handler:

```typescript
import { MyFactory } from "generated";

// Registers each newly deployed contract for indexing
MyFactory.ContractCreated.contractRegister(({ event, context }) => {
  context.addMyContract(event.params.contractAddress);
});
```

In `config.yaml`, omit the `address` field for the dynamically registered contract.

### External calls

Replace `context.client.readContract(...)` with the [Effect API](/docs/HyperIndex/effect-api) to safely isolate external calls from the sync path:

```typescript
import { createEffect, S } from "envio";

export const getSymbol = createEffect(
  {
    name: "getSymbol",
    input: S.schema({ address: S.string, chainId: S.number }),
    output: S.string,
    cache: true,
  },
  async ({ input }) => {
    /* viem call here */
  },
);

// In handler:
const symbol = await context.effect(getSymbol, {
  address,
  chainId: event.chainId,
});
```

### Multichain

Add multiple entries under `chains:` and namespace your entity IDs by chain to prevent collisions:

```typescript
const id = `${event.chainId}_${event.params.tokenId}`;
```

See [Multichain Indexing](/docs/HyperIndex/multichain-indexing) for configuration details.

### Wildcard indexing

HyperIndex supports [wildcard indexing](/docs/HyperIndex/wildcard-indexing) — index events by signature across all contracts on a chain without specifying addresses.


## Validating Your Migration

Use the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) CLI to compare entity data between your Ponder and HyperIndex endpoints field-by-field.


## Getting Help

- **Discord**: [discord.gg/envio](https://discord.gg/envio) — fastest way to get help
- **Docs**: [docs.envio.dev](/docs/HyperIndex/overview)
- **AI-friendly docs**: [HyperIndex complete reference](/docs/HyperIndex-LLM/hyperindex-complete)
