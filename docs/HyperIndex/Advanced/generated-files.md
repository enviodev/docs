---
id: generated-files
title: Generated Indexing Files
sidebar_label: Generated Indexing Files
slug: /generated-files
description: Learn how generated files handle type-safe data access, event processing, and runtime indexing.
---

# Understanding Generated Indexing Files

## Overview

In V3, the local `generated` package is gone. Code generation now writes a single ambient declaration file at `.envio/types.d.ts` (git-ignored) and wires it into your project through a small `envio-env.d.ts` file at the project root. Everything you used to import from `generated` is now exported from the `envio` package.

These generated declarations form the type-level backbone of your blockchain indexer, translating your configuration, schema, and event handlers into the strongly-typed runtime values exposed by `envio`.

> **Important:** The contents of `.envio/` should never be manually edited. Any changes will be overwritten the next time code generation runs.

## What V3 Emits

| File / location               | Purpose                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `.envio/types.d.ts`           | Ambient TypeScript declarations describing your contracts, events, entities, enums, and chains. |
| `envio-env.d.ts` (root)       | Tiny shim that references `.envio/types.d.ts` so the compiler picks it up.                       |
| `.envio/cache/` (optional)    | Local cache of [Effect API](/docs/HyperIndex/effect-api) results, populated via the dev console. |

The `generated/` directory used by V2 (with ReScript sources, JS shims, and a per-project `package.json`) is no longer produced.

## Purpose of Generated Files

Generated files serve several critical functions:

1. **Type-Safe Data Access** - They provide strongly-typed interfaces to interact with your defined entities through `envio`.
2. **Event Processing** - They describe each contract's events so `indexer.onEvent({ contract, event }, ...)` is fully type-checked.
3. **Database Interactions** - They generate the entity types and helper signatures used by `context.<Entity>` and `indexer.<Entity>`.
4. **Runtime Orchestration** - They feed into the `indexer` value (chains, contracts, entities) that orchestrates indexing.

## Real-World Example: Uniswap V4 Indexer

Let's examine how specific elements from a real Uniswap V4 indexer translate into generated declarations.

### From Schema to Generated Types

For a schema entity like this:

```graphql
type Pool {
  id: ID!
  chainId: BigInt!
  currency0: String!
  currency1: String!
  fee: BigInt!
  tickSpacing: BigInt!
  hooks: String!
  numberOfSwaps: BigInt! @index
  createdAtTimestamp: BigInt!
  createdAtBlockNumber: BigInt!
}
```

The codegen process emits a TypeScript type you can import from `envio`:

```typescript
import type { Entity } from "envio";

// Equivalent to importing the `Pool` named type directly.
type Pool = Entity<"Pool">;

// Shape of the generated entity:
// {
//   id: string;
//   chainId: bigint;
//   currency0: string;
//   currency1: string;
//   fee: bigint;
//   tickSpacing: bigint;
//   hooks: string;
//   numberOfSwaps: bigint;
//   createdAtTimestamp: bigint;
//   createdAtBlockNumber: bigint;
// }
```

You read and write `Pool` entities through the type-safe `context` and `indexer` APIs:

```typescript
// Inside a handler
const pool = await context.Pool.get(id);
context.Pool.set({ id, chainId, currency0, currency1, fee, tickSpacing, hooks, numberOfSwaps, createdAtTimestamp, createdAtBlockNumber });

// Inside a test or script
await indexer.Pool.set({ /* ... */ });
const stored = await indexer.Pool.getOrThrow(id);
```

### From Config to Generated Event Handlers

Given a contract event in `config.yaml`:

```yaml
contracts:
  - name: PoolManager
    events:
      - event: Swap(bytes32 indexed id, address indexed sender, int128 amount0, int128 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint24 fee)
```

Codegen widens the `indexer.onEvent` overloads so that the following call is fully typed end-to-end (event params, return type, `context.chain`, etc.):

```typescript
import { indexer } from "envio";
import type { EvmEvent } from "envio";

indexer.onEvent(
  { contract: "PoolManager", event: "Swap" },
  async ({ event, context }) => {
    const { id, sender, amount0, amount1, sqrtPriceX96, liquidity, tick, fee } = event.params;
    // ...
  },
);

// The full event payload type is also available as a generic:
type PoolManagerSwapEvent = EvmEvent<"PoolManager", "Swap">;
type PoolManagerSwapBlock = EvmEvent<"PoolManager", "Swap">["block"];
```

### From Multi-Chain Config to Generated Chain Handlers

Your config has multiple chains:

```yaml
chains:
  - id: 1 # Ethereum Mainnet
    # ...
  - id: 10 # Optimism
    # ...
  - id: 42161 # Arbitrum
    # ...
```

Codegen turns the chain set into a literal `ChainId` union and exposes per-chain helpers under `indexer.chains`:

```typescript
import { indexer } from "envio";
import type { ChainId } from "envio";

// ChainId is `1 | 10 | 42161`
const mainnet = indexer.chains[1];
const optimism = indexer.chains[10];
const arbitrum = indexer.chains[42161];

// `chain.id` is also typed inside handler/where callbacks:
indexer.onBlock(
  {
    name: "Heartbeat",
    where: ({ chain }) => {
      // chain.id is narrowed to the configured ChainId union
      return chain.id === 1;
    },
  },
  async ({ block, context }) => {
    // context.chain.id is typed as well
  },
);
```

`getGeneratedByChainId(...)` from V2 has been replaced by `indexer.chains[chainId]`.

## When to Run Code Generation

You should run code generation using the Envio CLI whenever you:

```bash
pnpm envio codegen
```

Codegen should be run after:

1. Modifying your `config.yaml` file
2. Changing your GraphQL schema
3. Adding or updating event handlers
4. Switching to a new contract or ABI
5. After pulling changes from version control

> Note: changes to handler files in V3 no longer trigger automatic codegen on `pnpm dev`.

## Troubleshooting Generation Errors

When code generation fails, the errors typically point to issues in your setup files. Here are common error patterns and their solutions:

### Configuration Errors

Error messages containing `Config validation failed` typically mean there's an issue in your `config.yaml` file:

- Check for syntax errors in YAML formatting
- Verify that all required fields are present
- Ensure contract addresses are in the correct format
- Confirm that referenced chains are valid

For example, if you see an error about invalid chain IDs, check that all chain IDs in your config are valid:

```yaml
chains:
  - id: 1 # Valid Ethereum mainnet
  - id: 10 # Valid Optimism
  - id: 999 # Might be invalid if this chain ID isn't recognized
```

### Schema Errors

Errors mentioning `Schema parsing error` point to issues in your GraphQL schema:

- Check for invalid GraphQL syntax
- Ensure entity names match those referenced in handlers
- Verify that relationships between entities are properly defined
- Check for unsupported types or directives

For example, if you're using the `@index` directive as in your `Pool` entity's `numberOfSwaps` field, make sure it's correctly placed:

```graphql
type Pool {
  id: ID!
  numberOfSwaps: BigInt! @index # Correct placement of @index directive
}
```

### Handler Errors

If you see `Handler validation failed` errors:

- Check that handler function signatures match expected patterns
- Ensure all referenced entities exist in your schema
- Verify proper import syntax for entities and contract events (everything comes from `envio`)

## Relationship with Setup Files

The generated declarations directly reflect the structure defined in your setup files:

- **config.yaml** → Determines which chains, contracts, and events are indexed
- **schema.graphql** → Defines the entities and relationships that are generated
- **handlers in `src/handlers/`** → Provide the business logic that the generated types describe

## Best Practices

1. **Never modify generated files directly** - Always change the source files
2. **Run codegen before starting your indexer** - Ensure all declarations are up to date
3. **Check error messages carefully** - They often pinpoint issues in your setup files
4. **Commit `envio-env.d.ts` but ignore `.envio/`** - The shim is part of the project; the generated artifacts are not.

## Summary

Generated declarations form the critical bridge between your indexing specifications and the actual runtime execution. While you shouldn't modify them directly, understanding their structure and purpose can help you debug issues and optimize your indexing process.

If you encounter persistent errors related to generated files, ensure your configuration, schema, and handlers follow Envio's best practices, or contact support for assistance.

---
