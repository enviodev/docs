---
title: Migrate from Ponder to Envio HyperIndex
sidebar_label: Migrate from Ponder to Envio HyperIndex
tags: [tutorial]
slug: /migrate-from-ponder-to-envio
description: "Migrate from Ponder to HyperIndex in three steps. Up to 157x faster sync. Same TypeScript, multichain by default. Real before-and-after code."
image: /blog-assets/migrate-from-ponder-to-envio.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-05-21
  author: Jordyn Laurier
---

<img src="/blog-assets/migrate-from-ponder-to-envio.png" alt="Migrating from Ponder to Envio HyperIndex" width="100%"/>

<!--truncate-->

:::note TL;DR
- Migrating from Ponder to HyperIndex is straightforward. Both frameworks use TypeScript, index EVM events, and expose a GraphQL API.
- Three things change: `ponder.config.ts` becomes `config.yaml`, `ponder.schema.ts` becomes `schema.graphql`, and event handlers adapt to the HyperIndex entity API.
- Up to 157x faster historical sync via HyperSync (Sentio Uniswap V2 Factory benchmark).
- Multichain by default. One config, any number of chains.
- Full migration reference at [docs.envio.dev/docs/HyperIndex/migrate-from-ponder](https://docs.envio.dev/docs/HyperIndex/migrate-from-ponder). AI-assisted migration docs also available for Cursor and Claude Code.
:::

If you are running a Ponder indexer in production, you already know two things. The framework is TypeScript end-to-end, and historical backfills using RPC are the bottleneck. Envio HyperIndex keeps the TypeScript and removes the bottleneck. Up to 157x faster sync via HyperSync, same GraphQL API on top.

This blog walks the three-step migration end to end. Every code block is taken directly from the official migration reference in our docs.

## AI-Assisted Migration

If you prefer not to do the rewrite by hand, HyperIndex ships with built-in Claude skills that guide AI coding assistants through the migration. See our [Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai) guide that walks you through the full setup.

Combined with the Envio docs [MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server), an agent can read your Ponder config, schema, and handlers, and produce the HyperIndex equivalents while you review the diff. Learn more about general AI-assisted migration in our [blog](https://docs.envio.dev/blog). The same flow applies to Ponder migration.

## Migration Overview

Three steps plus a bootstrap:

1. `ponder.config.ts` becomes `config.yaml`
2. `ponder.schema.ts` becomes `schema.graphql`
3. Event handlers adapt syntax and entity operations

At any point during the migration, run:


```bash
pnpm envio codegen   # validate config + schema, regenerate types
pnpm dev             # run the indexer locally
```



If you are new to HyperIndex, see the [Getting Started](https://docs.envio.dev/docs/HyperIndex/getting-started) guide.

## Step 0: Bootstrap the Project


```bash
pnpx envio init
```



Follow the prompts, using your Ponder project as the source of truth for contract addresses, ABIs, and events. This generates a boilerplate indexer you can use as a base to edit.

Convert your ABIs first. Ponder exports ABIs as TypeScript (`as const`). For each contract, strip the `export const ... =` wrapper and the `as const`, and save it as a plain `.json` file in `abis/`. Have these ready before running `envio init`, because the local ABI import asks for the path to each contract's JSON ABI file. If a contract is verified on a block explorer, `envio init` can fetch the ABI for you instead.

## Step 1: `ponder.config.ts` to `config.yaml`

Here is the same indexer configured in both frameworks, taken from the migration docs.

**Ponder:**


```ts
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



**HyperIndex:**


```yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: my-indexer
contracts:
  - name: MyToken
    abi_file_path: ./abis/MyToken.json
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



**Key differences:**

| Concept | Ponder | HyperIndex |
| --- | --- | --- |
| Config format | `ponder.config.ts` (TypeScript) | `config.yaml` (YAML) |
| Chain reference | Named + viem object | Numeric chain ID |
| RPC URL | In config | `ENVIO_RPC_URL_<chainId>` env var |
| ABI source | TypeScript import | JSON file (`abi_file_path`) |
| Events to index | Inferred from handlers | Explicit `events:` list |
| Handler file | Inferred | Auto-discovered from `src/handlers/` |

### Field selection for transaction and block fields

By default, only a minimal set of fields is available on `event.transaction` and `event.block`. Fields like `event.transaction.hash` are undefined unless explicitly requested.

Per-event:


```yaml
events:
  - event: Transfer
    field_selection:
      transaction_fields:
        - hash
```



Or declared once at the top level to apply to all events:


```yaml
name: my-indexer
field_selection:
  transaction_fields:
    - hash
contracts:
  # ...
```



See full list of available fields in [our docs](https://docs.envio.dev/docs/HyperIndex/configuration-file).

## Step 2: `ponder.schema.ts` to `schema.graphql`

**Ponder:**


```ts
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



**HyperIndex:**


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



**Type mapping, taken from the migration docs:**

| Ponder | HyperIndex GraphQL |
| --- | --- |
| `t.hex()` | `String!` |
| `t.text()` | `String!` |
| `t.bigint()` | `BigInt!` |
| `t.integer()` | `Int!` |
| `t.boolean()` | `Boolean!` |
| `t.real()` / `t.doublePrecision()` | `Float!` |
| `t.hex().array()` | `Json!` |

Three more conversion rules.

**Primary keys.** HyperIndex requires a single `id: ID!` string field on every entity. For composite primary keys (e.g. owner + spender), construct the ID string manually: `${owner}_${spender}`.

**Indexes.** Replace Ponder's `index().on(column)` with an `@index` directive on the field.

**Relations.** Replace Ponder's `relations()` call with `@derivedFrom` on the parent entity:


```graphql
type NftCollection {
  id: ID!
  contractAddress: Bytes!
  name: String!
  symbol: String!
  maxSupply: BigInt!
  currentSupply: Int!
  tokens: [Token!]! @derivedFrom(field: "collection")
}

type Token {
  id: ID!
  tokenId: BigInt!
  collection: NftCollection!
  owner: User!
}
```



Full schema reference at [https://docs.envio.dev/docs/HyperIndex/schema](https://docs.envio.dev/docs/HyperIndex/schema).

## Step 3: Event Handlers

Handler registration changes shape.

**Ponder:**


```ts
import { ponder } from "ponder:registry";

ponder.on("MyToken:Transfer", async ({ event, context }) => {
  // ...
});
```



**HyperIndex (v3):**


```ts
import { indexer } from "envio";

indexer.onEvent({ contract: "MyToken", event: "Transfer" }, async ({ event, context }) => {
  // ...
});
```



### Event data access

The accessors are slightly different. Here is the full mapping from the migration docs:

| Data | Ponder | HyperIndex |
| --- | --- | --- |
| Event parameters | `event.args.name` | `event.params.name` |
| Contract address | `event.log.address` | `event.srcAddress` |
| Chain ID | `context.chain.id` | `event.chainId` |
| Block number | `event.block.number` | `event.block.number` |
| Block timestamp | `event.block.timestamp` (bigint) | `event.block.timestamp` (number) |
| Tx hash | `event.transaction.hash` | `event.transaction.hash` (needs `field_selection`) |

### Entity operations

This is the part that takes the most rewriting. The Ponder drizzle-style API maps to a different shape in HyperIndex.

| Intent | Ponder | HyperIndex |
| --- | --- | --- |
| Insert | `context.db.insert(t).values({...})` | `context.Entity.set({ id, ...fields })` |
| Update | `context.db.update(t, pk).set({...})` | `get` → spread → `context.Entity.set({ ...existing, ...changes })` |
| Upsert | `.insert().values().onConflictDoUpdate()` | `context.Entity.getOrCreate({ id, ...defaults })` → `set` |
| Read (nullable) | `context.db.find(table, pk)` | `context.Entity.get(id)` |
| Read (throws) | manual null check | `context.Entity.getOrThrow(id)` |

**Full handler example**

**Ponder:**


```ts
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



**HyperIndex (v3):**


```ts
import { indexer } from "envio";

indexer.onEvent({ contract: "MyToken", event: "Transfer" }, async ({ event, context }) => {
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



**Heads up.** The ID above uses `event.transaction.hash`, which is not available by default. Add `transaction_fields: [hash]` under `field_selection` in `config.yaml` as shown in Step 1, or build the ID from fields that are always available (e.g. `${event.chainId}_${event.block.number}_${event.logIndex}`).

**One rule that catches every team.** Entity objects from `context.Entity.get()` are read-only. Always spread (`...existing`) and set new fields. Never mutate directly.

Full event handlers reference at [https://docs.envio.dev/docs/HyperIndex/event-handlers](https://docs.envio.dev/docs/HyperIndex/event-handlers).

## Factory Contracts (Dynamic Registration)

Ponder uses a `factory()` helper in the config. HyperIndex uses a `contractRegister` handler.


```ts
import { indexer } from "envio";

indexer.contractRegister({ contract: "MyFactory", event: "ContractCreated" }, ({ event, context }) => {
  context.chain.MyContract.add(event.params.contractAddress);
});
```



In `config.yaml`, omit the `address` field for the dynamically registered contract.

The Polymarket reference indexer uses dynamic contract registration for FPMM pools created by FPMMFactory. See [https://github.com/enviodev/polymarket-indexer/blob/main/src/handlers/FPMMFactory.ts](https://github.com/enviodev/polymarket-indexer/blob/main/src/handlers/FPMMFactory.ts) for the production example (note: Polymarket is still on v2 syntax, the v3 equivalent is shown above).

## External Calls (Effect API)

Replace `context.client.readContract(...)` with the Effect API. This isolates external calls (fetch, RPC, async I/O) from the sync path safely.


```ts
import { createEffect, S } from "envio";

export const getSymbol = createEffect(
  {
    name: "getSymbol",
    input: S.string,
    output: S.string,
    cache: true,
    rateLimit: { calls: 5, per: "second" },
  },
  async ({ input }) => {
    // implementation: fetch the symbol from RPC for the given address
  },
);
```


Per the [Effect API guide](https://docs.envio.dev/docs/HyperIndex/effect-api), external calls (fetch, RPC, async I/O) should be wrapped in `createEffect` and invoked via `context.effect`, which provides automatic batching, memoization, deduplication, and rate-limiting.

## What Carries Across, What Changes

A condensed summary.

**Carries across without change:**

- TypeScript handler logic (entity writes, math, conditionals)
- GraphQL API (your frontend queries do not change)
- ABI bytes (just re-serialised as JSON)
- Indexed entities (data model)

**Changes during migration:**

- Config file format (`.ts` to `.yaml`)
- Schema file format (drizzle table builder to GraphQL SDL)
- Entity operation API (`db.insert`/`update` to `context.Entity.set`)
- External calls (use Effect API)
- Factory contract pattern (config `factory()` to handler `indexer.contractRegister`)
- Event parameter access (`event.args` to `event.params`)
- Transaction field access (needs explicit `field_selection`)

For most projects, the body of the work is mechanical translation. Claude with the built-in HyperIndex skills can handle most of it under developer review.

## Why Migrate

From the Sentio Uniswap V2 Factory benchmark:

| Indexer | Time |
| --- | --- |
| Envio HyperIndex | 8 seconds |
| Ponder | ~21 minutes |

HyperIndex completed the workload 157x faster.

Three concrete reasons to migrate.

**Speed.** Up to 157x faster historical sync via HyperSync. For Ponder users running backfills against RPC, that is hours into minutes.

**Multichain by default.** One config covers any number of chains. Ponder's per-chain configuration is replaced by a single `chains:` array.

**Same language.** TypeScript handlers transfer directly. The migration is syntax adjustment, not a language rewrite.

## Get Started

- Full Ponder migration reference: https://docs.envio.dev/docs/HyperIndex/migrate-from-ponder
- Getting Started: https://docs.envio.dev/docs/HyperIndex/getting-started
- Quickstart with AI: https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai
- Configuration reference: https://docs.envio.dev/docs/HyperIndex/configuration-file
- Schema reference: https://docs.envio.dev/docs/HyperIndex/schema
- Event handlers reference: https://docs.envio.dev/docs/HyperIndex/event-handlers
- Polymarket production reference: https://github.com/enviodev/polymarket-indexer
- GitHub releases (current versions): https://github.com/enviodev/hyperindex/releases

For teams affected by the Ponder acquisition looking for a clear path forward, the Envio team supports the migration end-to-end, from planning the rewrite to reviewing the diff to getting the indexer live on Envio Cloud. Reach out on Discord and we will help you scope it.

## Frequently Asked Questions

### How long does a Ponder-to-HyperIndex migration take?

For a small project (one or two contracts, single chain), a manual migration is typically a few hours. With the AI-assisted flow, faster. Larger projects with multiple contracts, factory patterns, and external calls take longer, but the bulk of the work is mechanical translation that Claude can often complete in a few hours to a day, with a developer reviewing the output.

### Is HyperIndex faster than Ponder in production?

Yes. In the Sentio Uniswap V2 Factory benchmark, HyperIndex completed in 8 seconds. Ponder completed in approximately 21 minutes. HyperIndex was 157x faster on that workload. See [benchmark comparison](https://docs.envio.dev/docs/HyperIndex/benchmarks).

### Does HyperIndex support TypeScript like Ponder?

Yes. HyperIndex handlers are standard TypeScript. Both frameworks share the same language and same general shape of code. The differences are the entity operation API, the config format, and the data engine underneath.

### Can I run multiple chains in one HyperIndex indexer?

Yes. A single `config.yaml` declares all chains under a `chains:` array. Multichain is the default. Ponder configures chains separately per setup.

### What does HyperSync replace in a Ponder setup?

Ponder pulls historical data through standard RPC, which is the bottleneck for backfills against high-event contracts. HyperSync replaces that RPC fetch with a purpose-built data lake, delivering up to 2,000x faster data access than RPC. <HyperSyncChainCount /> EVM chains have native HyperSync coverage, so most Ponder workloads can migrate without changing data-source configuration.

### How do I handle reorgs in HyperIndex?

At the framework level. HyperIndex tracks entity state history for every unfinalized block and rolls back automatically on reorg. No handler code is required.

### Can I use HyperIndex with Cursor or Claude Code?

Yes. HyperIndex v3 ships with built-in Claude skills that guide AI coding assistants through building with HyperIndex, plus a docs MCP server for live access to the documentation.

### Where is the production reference for a HyperIndex indexer?

The Polymarket reference indexer. It syncs 4,000,000,000 events on Polygon in 6 days, replacing 8 separate subgraphs on The Graph.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the docs, run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

Subscribe to our newsletter

Website | X | Discord | Telegram | GitHub | YouTube | Reddit
