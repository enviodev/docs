---
id: contract-state
title: Accessing Contract State in Event Handlers
sidebar_label: Accessing Contract State
slug: /contract-state
---

# Accessing Contract State in Event Handlers

> **Example Repository:** The complete code for this guide can be found [here](https://github.com/enviodev/rpc-token-data-example)

## Introduction

This guide demonstrates how to access on-chain contract state from your event handlers. You'll learn how to:

1. Make RPC calls to external contracts within your event handlers
2. Batch multiple calls using multicall for efficiency
3. Implement caching to reduce redundant RPC requests
4. Handle common edge cases that arise when accessing token contract data

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
networks:
  - id: 1
    start_block: 21000000 # Starting at a higher block to speed up initial sync
    contracts:
      - name: UniswapV3Factory
        address:
          - 0x1F98431c8aD98523631AE4a59f267346ea31F984
        handler: src/EventHandlers.ts
        events:
          - event: PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)
rollback_on_reorg: false
```

> **Note**: We're starting at block 21,000,000 to reduce initial sync time, as RPC calls can be slow. See the [Rate Limiting](#handling-rate-limiting) section for optimization strategies.

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

```typescript
// src/EventHandlers.ts
import { UniswapV3Factory, Pool } from "generated";
import { getTokenDetails } from "./tokenDetails";

UniswapV3Factory.PoolCreated.handler(async ({ event, context }) => {
  // Create Pool entity
  const entity: Pool = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token0_id: event.params.token0,
    token1_id: event.params.token1,
    fee: event.params.fee,
    tickSpacing: event.params.tickSpacing,
    pool: event.params.pool,
  };
  context.Pool.set(entity);

  // Fetch and store token0 information
  try {
    const {
      name: name0,
      symbol: symbol0,
      decimals: decimals0,
    } = await getTokenDetails(
      event.params.token0,
      event.chainId,
      event.params.pool
    );
    context.Token.set({
      id: event.params.token0,
      name: name0,
      symbol: symbol0,
      decimals: decimals0,
    });
  } catch (error) {
    console.log("failed token0 with address", event.params.token0);
    return;
  }

  // Fetch and store token1 information
  try {
    const {
      name: name1,
      symbol: symbol1,
      decimals: decimals1,
    } = await getTokenDetails(
      event.params.token1,
      event.chainId,
      event.params.pool
    );
    context.Token.set({
      id: event.params.token1,
      name: name1,
      symbol: symbol1,
      decimals: decimals1,
    });
  } catch (error) {
    console.log("failed token1 with address", event.params.token1);
    return;
  }
});
```

### Step 4: Create the Token Details Helper

This is where the magic happens. We need to:

1. Make RPC calls to token contracts
2. Use multicall to batch multiple calls for efficiency
3. Handle edge cases like non-standard ERC20 implementations
4. Cache results to avoid redundant calls

```typescript
// src/tokenDetails.ts
import { createPublicClient, http, hexToString } from "viem";
import { mainnet } from "viem/chains";
import { Cache, CacheCategory } from "./cache";
import { getERC20BytesContract, getERC20Contract } from "./utils";

const RPC_URL = process.env.RPC_URL;

const client = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL),
  batch: { multicall: true }, // Enable multicall batching for efficiency
});

export async function getTokenDetails(
  contractAddress: string,
  chainId: number,
  pool: string
): Promise<{
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
}> {
  // Check cache first to avoid redundant RPC calls
  const cache = await Cache.init(CacheCategory.Token, chainId);
  const token = await cache.read(contractAddress.toLowerCase());

  if (token) {
    return token;
  }

  // Prepare contract instances for different token standard variations
  const erc20 = getERC20Contract(contractAddress as `0x${string}`);
  const erc20Bytes = getERC20BytesContract(contractAddress as `0x${string}`);

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
    console.log("First multicall failed, trying alternate method");
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
      console.error(`Alternate method failed for pool ${pool}:`);
      results = [0, "unknown", "unknown"]; // Fallback for completely non-standard tokens
    }
  }

  const [decimals, name, symbol] = results;

  console.log(
    `Got token details for ${contractAddress}: ${name} (${symbol}) with ${decimals} decimals`
  );

  // Prepare and cache the result
  const entry = {
    name,
    symbol,
    decimals,
  } as const;

  cache.add({ [contractAddress.toLowerCase()]: entry as any });
  return entry;
}
```

> **Important:** The `hexToString` method from Viem adds byte padding to the string. We remove this padding with `replace(/\u0000/g, '')` to avoid errors when writing to the database.

### Step 5: Implement Caching

Caching is crucial for efficiency. Many pools share common tokens (like USDC, WETH, etc.), and we don't want to make redundant RPC calls for the same token addresses.

```typescript
// src/cache.ts
import * as fs from "fs";
import * as path from "path";

export const CacheCategory = {
  Token: "token",
} as const;

export type CacheCategory = (typeof CacheCategory)[keyof typeof CacheCategory];

type Address = string;

type Shape = Record<string, Record<string, string>>;
type ShapeRoot = Shape & Record<Address, { hash: string }>;

type ShapeToken = Shape &
  Record<Address, { decimals: number; name: string; symbol: string }>;

export class Cache {
  static init<C = CacheCategory>(
    category: C,
    chainId: number | string | bigint
  ) {
    if (!Object.values(CacheCategory).find((c) => c === category)) {
      throw new Error("Unsupported cache category");
    }

    type S = C extends "token" ? ShapeToken : ShapeRoot;
    const entry = new Entry<S>(`${category}-${chainId.toString()}`);
    return entry;
  }
}

export class Entry<T extends Shape> {
  private memory: Shape = {};

  static encoding = "utf8" as const;
  static folder = "./.cache" as const;

  public readonly key: string;
  public readonly file: string;

  constructor(key: string) {
    this.key = key;
    this.file = Entry.resolve(key);

    this.preflight();
    this.load();
  }

  public read(key: string) {
    const memory = this.memory || {};
    return memory[key] as T[typeof key];
  }

  public load() {
    try {
      const data = fs.readFileSync(this.file, Entry.encoding);
      this.memory = JSON.parse(data) as T;
    } catch (error) {
      console.error(error);
      this.memory = {};
    }
  }

  public add<N extends T>(fields: N) {
    if (!this.memory || Object.values(this.memory).length === 0) {
      this.memory = fields;
    } else {
      Object.keys(fields).forEach((key) => {
        if (!this.memory[key]) {
          this.memory[key] = {};
        }
        Object.keys(fields[key]).forEach((nested) => {
          this.memory[key][nested] = fields[key][nested];
        });
      });
    }

    this.publish();
  }

  private preflight() {
    /** Ensure cache folder exists */
    if (!fs.existsSync(Entry.folder)) {
      fs.mkdirSync(Entry.folder);
    }
    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, JSON.stringify({}));
    }
  }

  private publish() {
    const prepared = JSON.stringify(this.memory);
    try {
      fs.writeFileSync(this.file, prepared);
    } catch (error) {
      console.error(error);
    }
  }

  static resolve(key: string) {
    return path.join(Entry.folder, key.toLowerCase().concat(".json"));
  }
}
```

> **Note:** The hosted service supports basic JSON file caching in beta. Speak to the team if you want to discuss caching options.

## Key Considerations

### Understanding Current vs. Historical State

Standard RPC requests return the **current state** of a contract, not the state at a specific historical block. For token metadata (name, symbol, decimals), this isn't typically an issue since these values rarely change.

However, if you need historical state (like an account balance at a specific block), you would need a specialized RPC method like [eth_getBalanceAt](https://docs.etherscan.io/api-pro/api-pro#get-historical-ether-balance-for-a-single-address-by-blockno).

### Handling Rate Limiting

RPC providers often limit the number of requests per time period. To avoid hitting rate limits:

1. **Use multicall** (as shown in our example) to batch multiple contract calls into a single RPC request
2. **Implement caching** to avoid redundant requests
3. **Use a paid, unthrottled RPC provider** for production indexers
4. **Implement request throttling** to space out requests when needed
5. **Use multiple RPC providers** and rotate between them for high-volume indexing

## Conclusion

Accessing contract state from your event handlers opens up powerful possibilities for enriching your indexed data. By following the patterns in this guide, you can efficiently retrieve and store contract state while maintaining good performance.

For more advanced techniques, explore:

- Implementing retry logic for failed RPC calls
- Handling complex contract interactions beyond basic ERC20 tokens
