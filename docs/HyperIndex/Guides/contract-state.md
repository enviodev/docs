---
id: contract-state
title: Accessing Contract State in Event Handlers
sidebar_label: Accessing Contract State
slug: /contract-state
description: Learn how to efficiently fetch and store token contract data from events using RPC, multicall, and caching.
---

# Accessing Contract State in Event Handlers

> **Example Repository:** The complete code for this guide can be found [here](https://github.com/enviodev/rpc-token-data-example)

## Introduction

This guide demonstrates how to access on-chain contract state from your event handlers. You'll learn how to:

1. Make RPC calls to external contracts within your event handlers
2. Batch multiple calls using multicall for efficiency
3. Learn about [Preload Optimisation](/docs/HyperIndex/preload-optimization) and how it makes your indexer thousands of times faster
4. Use [Effect API](/docs/HyperIndex/effect-api) with built-in caching and Viem transport level batching
5. Handle common edge cases that arise when accessing token contract data

## The Challenge: Token Data from Pool Creation Events

### Scenario

We want to track token information (name, symbol, decimals) for every token involved in a [Uniswap V3 pool creation event](https://docs.uniswap.org/contracts/v3/reference/core/interfaces/IUniswapV3Factory#poolcreated).

### Problem

The Uniswap V3 factory `PoolCreated` event only provides token addresses, not their metadata:

```yaml
PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)
```

To get the token name, symbol, and decimals, we need to:

1. Extract the token addresses from the event
2. Make RPC calls to each token's contract
3. Store this data alongside our pool information

## Prerequisites

This guide assumes:

- Basic familiarity with Envio indexing
- Understanding of the [viem library](https://viem.sh/) for making contract calls
- Access to an Ethereum RPC endpoint ([dRPC](https://drpc.org/) recommended)

For a gentle introduction to viem with a similar example, check out this [medium article](https://medium.com/@0xape/typescript-and-viem-quickstart-for-blockchain-scripting-3f1846970b6f).

## Implementation Steps

### Step 1: Setup the Indexer Configuration

First, create a new indexer:

```bash
pnpx envio init
```

When prompted, enter the Ethereum mainnet Uniswap V3 Factory address: `0x1F98431c8aD98523631AE4a59f267346ea31F984`

Then modify your configuration to focus only on the PoolCreated event:

```yaml
# config.yaml
name: uniswap-v3-factory-token-indexer
preload_handlers: true
networks:
  - id: 1
    start_block: 0
    contracts:
      - name: UniswapV3Factory
        address:
          - 0x1F98431c8aD98523631AE4a59f267346ea31F984
        handler: src/EventHandlers.ts
        events:
          - event: PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)
```

### Step 2: Define the Schema

Create a schema that captures both pool and token information:

```graphql
# schema.graphql
type Token {
  id: ID! # token address
  name: String!
  symbol: String!
  decimals: Int!
}

type Pool {
  id: ID! # unique identifier
  token0: Token!
  token1: Token!
  fee: BigInt!
  tickSpacing: BigInt!
  pool: String! # pool address
}
```

### Step 3: Implement the Event Handler

The event handler needs to:

1. Create a Pool entity from the event data
2. Make RPC calls to fetch token information for both token0 and token1
3. Create Token entities with the retrieved data

**Important!** Preload optimization makes your handlers run **twice**. So instead of direct RPC calls, we're doing it through `context.effect` - the [Effect API](/docs/HyperIndex/effect-api).

Learn how Preload Optimization works in a [dedicated guide](/docs/HyperIndex/preload-optimization). It might be a new mental model for you, but this is what can make indexing thousands of times faster.

```typescript
// src/EventHandlers.ts
import { UniswapV3Factory } from "generated";
import { getTokenMetadata } from "./tokenMetadata";

UniswapV3Factory.PoolCreated.handler(async ({ event, context }) => {
  // Create Pool entity
  context.Pool.set({
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token0_id: event.params.token0,
    token1_id: event.params.token1,
    fee: event.params.fee,
    tickSpacing: event.params.tickSpacing,
    pool: event.params.pool,
  });

  // Fetch and store token0 information
  try {
    const tokenMetadata0 = await context.effect(getTokenMetadata, {
      tokenAddress: event.params.token0,
      chainId: event.chainId,
    });
    context.Token.set({
      id: event.params.token0,
      name: tokenMetadata0.name,
      symbol: tokenMetadata0.symbol,
      decimals: tokenMetadata0.decimals,
    });
  } catch (error) {
    context.log.error("Failed to fetch token0 metadata", {
      tokenAddress: event.params.token0,
      chainId: event.chainId,
      pool: event.params.pool,
      err: error,
    });
    return;
  }

  // Fetch and store token1 information
  try {
    const tokenMetadata1 = await context.effect(getTokenMetadata, {
      tokenAddress: event.params.token1,
      chainId: event.chainId,
    });
    context.Token.set({
      id: event.params.token1,
      name: tokenMetadata1.name,
      symbol: tokenMetadata1.symbol,
      decimals: tokenMetadata1.decimals,
    });
  } catch (error) {
    context.log.error("Failed to fetch token1 metadata", {
      tokenAddress: event.params.token1,
      chainId: event.chainId,
      pool: event.params.pool,
      err: error,
    });
    return;
  }
});
```

### Step 4: Create the Token Metadata Effect

This is where the magic happens. We need to:

1. Make RPC calls to token contracts
2. Use multicall to batch multiple calls for efficiency
3. Handle edge cases like non-standard ERC20 implementations
4. Cache results to avoid redundant calls

```typescript
// src/tokenDetails.ts
import { createPublicClient, http, hexToString } from "viem";
import { mainnet } from "viem/chains";
import { createEffect, S } from "envio";

import { getERC20BytesContract, getERC20Contract } from "./utils";

const RPC_URL = process.env.RPC_URL;

const client = createPublicClient({
  chain: mainnet,
  batch: { multicall: true }, // Enable multicall batching for efficiency
  transport: http(RPC_URL, { batch: true }), // Thanks to automatic Effect API batching, we can also enable batching for Viem transport level
});

// Use Sury library to define the schema
const tokenMetadataSchema = S.schema({
  name: S.string,
  symbol: S.string,
  decimals: S.number,
});

// Infer the type from the schema
type TokenMetadata = S.Infer<typeof tokenMetadataSchema>;

export const getTokenMetadata = createEffect(
  {
    name: "getTokenMetadata",
    input: {
      tokenAddress: S.string,
      chainId: S.number,
    },
    output: tokenMetadataSchema,
    rateLimit: {
      calls: 5,
      per: "second",
    },
    // Enable caching to avoid duplicated calls
    cache: true,
  },
  async ({ input, context }) => {
    const { tokenAddress, chainId } = input;

    // Prepare contract instances for different token standard variations
    const erc20 = getERC20Contract(tokenAddress as `0x${string}`);
    const erc20Bytes = getERC20BytesContract(tokenAddress as `0x${string}`);
    let results: [number, string, string];
    try {
      // Try standard ERC20 interface first (most common)
      results = await client.multicall({
        allowFailure: false,
        contracts: [
          {
            ...erc20,
            functionName: "decimals",
          },
          {
            ...erc20,
            functionName: "name",
          },
          {
            ...erc20,
            functionName: "symbol",
          },
        ],
      });
    } catch (error) {
      try {
        // Some tokens use bytes32 for name/symbol instead of string
        const alternateResults = await client.multicall({
          allowFailure: false,
          contracts: [
            {
              ...erc20Bytes,
              functionName: "decimals",
            },
            {
              ...erc20Bytes,
              functionName: "name",
            },
            {
              ...erc20Bytes,
              functionName: "symbol",
            },
          ],
        });
        results = [
          alternateResults[0],
          hexToString(alternateResults[1]).replace(/\u0000/g, ""), // Remove null byte padding
          hexToString(alternateResults[2]).replace(/\u0000/g, ""), // Remove null byte padding
        ];
      } catch (alternateError) {
        results = [0, "unknown", "unknown"]; // Fallback for completely non-standard tokens
      }
    }

    const [decimals, name, symbol] = results;

    return {
      name,
      symbol,
      decimals,
    };
  }
);
```

> **Important:** The `hexToString` method from Viem adds byte padding to the string. We remove this padding with `replace(/\u0000/g, '')` to avoid errors when writing to the database.

> **Note:** Read more about Effect API and caching in the [Effect API](/docs/HyperIndex/effect-api) guide.

## Key Considerations

### Understanding Current vs. Historical State

Standard RPC requests return the **current state** of a contract, not the state at a specific historical block. For token metadata (name, symbol, decimals), this isn't typically an issue since these values rarely change.

However, if you need historical state (like an account balance at a specific block), you would need a specialized RPC method like [eth_getBalanceAt](https://docs.etherscan.io/api-pro/api-pro#get-historical-ether-balance-for-a-single-address-by-blockno).

### Handling Rate Limiting

RPC providers often limit the number of requests per time period. To avoid hitting rate limits:

1. **Use multicall** (as shown in our example) to batch multiple contract calls into a single RPC request
2. **Learn about Preload Optimization** to make your indexer thousands of times faster
3. **Enable caching** to avoid redundant requests
4. **Use a paid, unthrottled RPC provider** for production indexers
5. **Implement request throttling** to space out requests when needed
6. **Use multiple RPC providers** and rotate between them for high-volume indexing

## Conclusion

Accessing contract state from your event handlers opens up powerful possibilities for enriching your indexed data. By following the patterns in this guide, you can efficiently retrieve and store contract state while maintaining good performance.

For more advanced techniques, explore:

- Implementing retry logic for failed RPC calls
- Handling complex contract interactions beyond basic ERC20 tokens
