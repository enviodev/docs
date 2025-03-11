---
id: generated-files
title: Generated Indexing Files
sidebar_label: Generated Indexing Files
slug: /generated-files
---

# Understanding Generated Indexing Files

## Overview

The `/generated` directory contains files automatically created by Envio's code generation system. These files form the backbone of your indexer's runtime operations, translating your configuration, schema, and event handlers into executable code that processes blockchain data.

> **Important:** Generated files should never be manually edited. Any changes will be overwritten the next time code generation runs.

## Purpose of Generated Files

Generated files serve several critical functions:

1. **Type-Safe Data Access** - They provide strongly-typed interfaces to interact with your defined entities
2. **Event Processing** - They contain the logic to decode and process contract events
3. **Database Interactions** - They manage database operations for storing and retrieving indexed data
4. **Runtime Orchestration** - They coordinate the indexing workflow

## Real-World Example: Uniswap V4 Indexer

Let's examine how specific elements from a real Uniswap V4 indexer translate into generated files:

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

The codegen process generates:

1. **Type Definition** in `EntityModels.res`:

   ```rescript
   type pool = {
     id: string,
     chainId: BigInt.t,
     currency0: string,
     currency1: string,
     fee: BigInt.t,
     tickSpacing: BigInt.t,
     hooks: string,
     numberOfSwaps: BigInt.t,
     createdAtTimestamp: BigInt.t,
     createdAtBlockNumber: BigInt.t,
   }
   ```

2. **Constructor Function**:

   ```rescript
   let makePool = (
     ~id: string,
     ~chainId: BigInt.t,
     ~currency0: string,
     ~currency1: string,
     ~fee: BigInt.t,
     ~tickSpacing: BigInt.t,
     ~hooks: string,
     ~numberOfSwaps: BigInt.t,
     ~createdAtTimestamp: BigInt.t,
     ~createdAtBlockNumber: BigInt.t,
   ) => {
     {
       id,
       chainId,
       currency0,
       currency1,
       fee,
       tickSpacing,
       hooks,
       numberOfSwaps,
       createdAtTimestamp,
       createdAtBlockNumber,
     }
   }
   ```

3. **Database Functions** in `Queries.res`:

   ```rescript
   let getPoolById = (id: string): option<EntityModels.pool> => {
     // Database retrieval logic
   }

   let savePool = (entity: EntityModels.pool): unit => {
     // Database save logic
   }
   ```

### From Config to Generated Event Handlers

Given a contract event in `config.yaml`:

```yaml
contracts:
  - name: PoolManager
    handler: src/EventHandlers.ts
    events:
      - event: Swap(bytes32 indexed id, address indexed sender, int128 amount0, int128 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint24 fee)
```

The codegen process generates handler wrappers like:

```rescript
// In Handlers.res
let handlePoolManager_Swap = (
  ~blockHeader: Types.blockHeader,
  ~txHash: string,
  ~logIndex: int,
  ~id: string,
  ~sender: string,
  ~amount0: BigInt.t,
  ~amount1: BigInt.t,
  ~sqrtPriceX96: BigInt.t,
  ~liquidity: BigInt.t,
  ~tick: BigInt.t,
  ~fee: BigInt.t,
): unit => {
  // Call the user-defined handler
  let context = makeEventContext(
    ~blockHeader,
    ~txHash,
    ~logIndex,
    ~eventIdx,
    ~contractName="PoolManager",
    ~eventName="Swap"
  )
  UserHandlers.handlePoolManager_Swap(
    ~context,
    ~id,
    ~sender,
    ~amount0,
    ~amount1,
    ~sqrtPriceX96,
    ~liquidity,
    ~tick,
    ~fee,
  )
}
```

### From Multi-Network Config to Generated Network Handlers

Your config has multiple networks:

```yaml
networks:
  - id: 1 # Ethereum Mainnet
    # ...
  - id: 10 # Optimism
    # ...
  - id: 42161 # Arbitrum
    # ...
```

The generated code will include configuration parsing that handles all three networks:

```rescript
// In Config.res
let networks = [
  {
    id: 1,
    name: "ethereum-mainnet",
    startBlock: 0,
    contracts: [
      {
        name: "PositionManager",
        addresses: ["0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e"],
        // ...
      },
      {
        name: "PoolManager",
        addresses: ["0x000000000004444c5dc75cB358380D2e3dE08A90"],
        // ...
      },
    ],
  },
  {
    id: 10,
    name: "optimism",
    startBlock: 0,
    // Similar contract configuration for Optimism
  },
  {
    id: 42161,
    name: "arbitrum-one",
    startBlock: 0,
    // Similar contract configuration for Arbitrum
  },
]
```

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

## Troubleshooting Generation Errors

When code generation fails, the errors typically point to issues in your setup files. Here are common error patterns and their solutions:

### Configuration Errors

Error messages containing `Config validation failed` typically mean there's an issue in your `config.yaml` file:

- Check for syntax errors in YAML formatting
- Verify that all required fields are present
- Ensure contract addresses are in the correct format
- Confirm that referenced networks are valid

For example, if you see an error about invalid network IDs, check that all network IDs in your config are valid:

```yaml
networks:
  - id: 1 # Valid Ethereum mainnet
  - id: 10 # Valid Optimism
  - id: 999 # Might be invalid if this network ID isn't recognized
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
- Verify proper import syntax for entities and contract events

## Relationship with Setup Files

The generated files directly reflect the structure defined in your setup files:

- **config.yaml** → Determines which networks, contracts, and events are indexed
- **schema.graphql** → Defines the entities and relationships that are generated
- **EventHandlers** → Provides the business logic that the generated code wraps

## Best Practices

1. **Never modify generated files directly** - Always change the source files
2. **Run codegen before starting your indexer** - Ensure all files are up to date
3. **Check error messages carefully** - They often pinpoint issues in your setup files

## Summary

Generated files form the critical bridge between your indexing specifications and the actual runtime execution. While you shouldn't modify them directly, understanding their structure and purpose can help you debug issues and optimize your indexing process.

If you encounter persistent errors in generated files, ensure your configuration, schema, and handlers follow Envio's best practices, or contact support for assistance.

---
