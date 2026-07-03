---
title: Migrating From The Graph Without a Rewrite
sidebar_label: Migrating From The Graph Without a Rewrite
tags: [tutorial]
slug: /drop-in-subgraph-replacement
description: "Migrating off The Graph keeps your entities and GraphQL shape, with TypeScript instead of AssemblyScript. A side-by-side guide to a drop-in subgraph replacement on Envio HyperIndex."
image: /blog-assets/drop-in-subgraph-replacement.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-06-26
  author: Jordyn Laurier
---

<img src="/blog-assets/drop-in-subgraph-replacement.png" alt="Migrating From The Graph Without a Rewrite" width="100%"/>

<!--truncate-->

:::note TL;DR
- Migrating from The Graph to HyperIndex is not an AssemblyScript rewrite. AssemblyScript is a subset of TypeScript, so your event parsing and business logic copy across verbatim.
- Three things change in a well-defined way. `subgraph.yaml` becomes `config.yaml`, your schema sheds the `@entity` decorator, and handlers swap `Entity.save()` for `context.Entity.set()` with async/await.
- HyperIndex supports multichain in a single config, full TypeScript with any npm package, and framework-level reorg handling with no handler code required.
- In the Sentio Uniswap V2 Factory benchmark (April 2025), HyperIndex completed in 8 seconds. The Graph took 19 minutes, 142x slower on the same workload.
- The Indexer Migration Validator CLI diffs entity state between your subgraph endpoint and your HyperIndex endpoint before you cut over.
:::

Most teams stay on The Graph longer than they want to because of one belief, that moving means rewriting every handler in a new language. It does not.

AssemblyScript is a subset of TypeScript. The event parsing, the conditional logic, the arithmetic, and the helper functions are all valid TypeScript, and they carry across directly. What changes when you migrate to HyperIndex is a small, well-defined set of API calls. Not the logic. The wiring.

This is not theoretical. Katana migrated two production SushiSwap subgraphs exactly this way, entity-for-entity, and now serves its app from Envio. The walkthrough below uses before-and-after code from the canonical [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide), and ends with what that migration looked like in production.

:::tip Prefer an assistant-led migration?
HyperIndex ships [AI-friendly docs](https://docs.envio.dev/docs/HyperIndex-LLM/hyperindex-complete) and a [guided AI migration workflow](https://docs.envio.dev/docs/HyperIndex/migrate-with-ai) that works in both Cursor and Claude Code. The steps below are the same either way, this is what the assistant is doing under the hood.
:::

## What actually changes (and what does not)

It helps to be specific about the surface area before touching any code.

**Carries across without change:**

- Your event parsing logic
- All conditional logic and arithmetic
- Helper functions that do not use `@graphprotocol/graph-ts` types directly
- Your entity model, the fields, the relationships, and the ID conventions

**Changes during migration:**

| Concern | The Graph | HyperIndex |
|---|---|---|
| Config format | `subgraph.yaml` | `config.yaml` |
| Schema | `@entity` on every type | decorator removed |
| Handler registration | `ContractName.EventName.handler(...)` | `indexer.onEvent(...)` |
| Entity writes | `Entity.save()` | `context.Entity.set(...)` |
| Entity reads | synchronous `Entity.load(id)` | `await context.Entity.get(id)` |
| Imports | `@graphprotocol/graph-ts` | `"envio"` generated types |
| Transaction fields | available by default | opt-in via `field_selection` |

Every row is a mechanical swap. The handler body, the part that is the most work to write and the hardest to get right, is the part that does not change.

## Step 0: bootstrap the project

Start by generating a fresh HyperIndex project shell using your existing contract addresses, ABIs, and events as the source of truth:

```bash
pnpx envio init
```

Follow the prompts. The init generates `config.yaml`, `schema.graphql`, and handler stubs. At any point during the migration, validate your changes with:

```bash
pnpm envio codegen   # validate config + schema, regenerate types
pnpm dev             # run the indexer locally
```

## Step 1: subgraph.yaml to config.yaml

The config conversion is a restructure. HyperIndex consolidates contracts and chains into two top-level sections.

The Graph, `subgraph.yaml`:

```yaml
specVersion: 0.0.4
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: PositionManager
    network: mainnet
    source:
      abi: PositionManager
      address: "0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e"
      startBlock: 21689089
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Position
      abis:
        - name: PositionManager
          file: ./abis/PositionManager.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,indexed uint256)
          handler: handleTransfer
        - event: Subscription(indexed uint256,indexed address)
          handler: handleSubscription
```

HyperIndex, `config.yaml`:

```yaml
name: uni-v4-indexer
contracts:
  - name: PositionManager
    abi_file_path: ./abis/PositionManager.json
    events:
      - event: Transfer(address indexed from, address indexed to, uint256 indexed id)
      - event: Subscription(uint256 indexed tokenId, address indexed subscriber)
chains:
  - id: 1
    start_block: 21689089
    contracts:
      - name: PositionManager
        address: "0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e"
```

One thing that trips teams up consistently, HyperIndex uses `chains:` (not `networks:`).

### Transaction and receipt fields

In a subgraph, you opt into receipt data with `receipt: true` in `subgraph.yaml`. In HyperIndex, receipt-level fields like `status` and `gasUsed` are accessed via `field_selection` in `config.yaml`:

```yaml
field_selection:
  transaction_fields:
    - hash
    - status
    - gasUsed
```

Note that `event.transaction.hash` is not available by default, add it to `transaction_fields` before referencing it in a handler.

## Step 2: schema, near copy-paste

Your existing `schema.graphql` carries across almost unchanged. The only required edit is removing the `@entity` decorator from every type.

The Graph:

```graphql
type Transfer @entity {
  id: ID!
  from: String!
  to: String!
  amount: BigInt!
  timestamp: Int!
}
```

HyperIndex:

```graphql
type Transfer {
  id: ID!
  from: String! @index
  to: String!
  amount: BigInt!
  timestamp: Int!
}
```

Field types, `ID!` primary keys, `@derivedFrom` relations, nullable vs non-nullable, and enums all carry across unchanged. After any schema edit, run `pnpm envio codegen` to regenerate the typed bindings before touching handler code.

## Step 3: handlers, four API changes

This is the step teams worry about most, and it is the smallest. Here is the same handler in both frameworks, using the Uniswap V4 Subscription event:

The Graph (AssemblyScript):

```typescript
export function handleSubscription(event: SubscriptionEvent): void {
  const subscription = new Subscribe(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  subscription.tokenId = event.params.tokenId;
  subscription.subscriber = event.params.subscriber.toHexString();
  subscription.logIndex = event.logIndex;
  subscription.blockNumber = event.block.number;
  subscription.save();
}
```

HyperIndex (TypeScript v3):

```typescript
import { indexer } from "envio";

indexer.onEvent(
  { contract: "PositionManager", event: "Subscription" },
  async ({ event, context }) => {
    context.Subscribe.set({
      id: `${event.transaction.hash}_${event.logIndex}`,
      tokenId: event.params.tokenId,
      subscriber: event.params.subscriber,
      logIndex: event.logIndex,
      blockNumber: event.block.number,
    });
  },
);
```

The token ID parsing, the field assignments, and the ID construction are all identical. What changed is the import, the handler registration, `entity.save()` becoming `context.Subscribe.set()`, the async function signature, and `.toHexString()` becoming unnecessary because addresses arrive as strings.

### The one rule that catches every team

Entities returned by `context.Entity.get()` are read-only. When updating an existing entity, always spread the existing object and override fields:

```typescript
const token = await context.Token.get(event.params.to);
if (token) {
  context.Token.set({
    ...token,
    balance: token.balance + event.params.value,
  });
}
```

### Factory contracts (dynamic data sources)

Where The Graph uses `templates:` in `subgraph.yaml`, HyperIndex uses `indexer.contractRegister`:

```typescript
indexer.contractRegister(
  { contract: "Factory", event: "PairCreated" },
  ({ event, context }) => {
    context.chain.Pair.add(event.params.pair);
  },
);
```

## Validating the migration

After running locally against a block range, use the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) CLI to diff entity state between your subgraph endpoint and your HyperIndex endpoint. It generates entity configs automatically from your GraphQL schema and gives field-level analysis of any discrepancies. Running both in parallel over the same block range is the fastest way to confirm correctness before cutting over production traffic.

## GraphQL queries

HyperIndex uses standard GraphQL. The Graph uses a custom dialect with some non-standard filter and ordering syntax. For queries that use Graph-specific syntax, the [Query Conversion Guide](https://docs.envio.dev/docs/HyperIndex/query-conversion) covers the differences. For backwards compatibility, Envio's subgraph-compatible endpoint accepts The Graph's query syntax. Katana's production migration ran against this endpoint, allowing their existing app queries to work without changes while they transitioned to the native endpoint.

## What it looks like in production

Katana migrated two production SushiSwap subgraphs from The Graph to Envio, carrying the data model across entity-for-entity, all 23 entity types, tracking the Uniswap V3 factory, the position manager, and every pool it deploys. Same entities, same shape.

- SushiSwap V3 indexer: 11,473,382 events synced in about two hours
- Sushi staker indexer: 68,201 events synced in under 20 seconds

Full case study: [How Katana migrated SushiSwap data from The Graph to Envio](https://docs.envio.dev/blog/case-study-katana-sushiswap).

## Why bother, the performance case

From the Sentio Uniswap V2 Factory benchmark (April 2025):

| Indexer | Time | vs HyperIndex |
|---|---|---|
| Envio HyperIndex | 8 seconds | baseline |
| Subsquid (SQD) | 2 minutes | 15x slower |
| The Graph | 19 minutes | 142x slower |
| Ponder | 21 minutes | 157x slower |

The pattern holds every time. Your logic is already TypeScript, so it moves. The wiring changes in a handful of well-defined places, the validator confirms the output matches your old subgraph, and you cut over. That is the whole migration.

## Get started

- [Migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide)
- [Query Conversion Guide](https://docs.envio.dev/docs/HyperIndex/query-conversion)
- [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator)
- [Katana case study](https://docs.envio.dev/blog/case-study-katana-sushiswap)
- [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service)

## Frequently asked questions

### Is the AssemblyScript-to-TypeScript conversion really just a copy-paste?

For pure logic functions, yes. AssemblyScript is a subset of TypeScript, so any function that does not import from `@graphprotocol/graph-ts` is valid TypeScript and carries across without changes. The parts that require translation are the imports, the entity save calls, the entity load calls (synchronous becomes async/await), and the handler registration syntax. The event parsing logic, the business logic, and the arithmetic are identical.

### Do I need to handle reorgs in my HyperIndex handlers?

No. HyperIndex handles reorgs at the framework level by tracking entity state history for every unfinalized block and rolling back automatically. You write forward-only handler logic and the framework manages rollback.

### Can I keep my existing GraphQL queries after migrating?

Most queries carry across without change. Envio's subgraph-compatible endpoint accepts The Graph's query syntax as a drop-in, so existing app queries keep working while you transition to the native endpoint. The Query Conversion Guide covers the syntax differences.

### How long does a subgraph migration take?

For a single-contract subgraph with straightforward handlers, the mechanical migration is typically a few hours. Katana migrated two production SushiSwap subgraphs with entity-for-entity parity and had both syncing on Envio within a working session. For multi-subgraph setups, the consolidation into one TypeScript codebase adds time but reduces ongoing maintenance.

### What is the Indexer Migration Validator and how do I use it?

The Indexer Migration Validator is an open-source CLI tool that diffs entity state between a subgraph endpoint and a HyperIndex endpoint. It generates entity configs from your GraphQL schema automatically, runs both endpoints over the same block range in parallel, and produces field-level analysis of any discrepancies.

### Can I run multiple chains in one HyperIndex indexer?

Yes. A single `config.yaml` declares all chains under a `chains:` array. Multichain indexing is the default in V3, with no opt-in required. Each chain-specific entity ID should include `event.chainId` to prevent collisions across chains.

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use Envio Cloud or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://x.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+kAIGElzPjApiMjI0) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
