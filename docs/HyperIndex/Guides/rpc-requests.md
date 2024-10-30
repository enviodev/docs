---
id: rpc-requests
title: RPC Requests
sidebar_label: RPC Requests
slug: /rpc-requests
---

# RPC Requests guide

TLDR; The repo for the code base can be found [here](todo_add_link)

What do you do if a specific event handler doesn't have all the information you want to fetch from the blockchain? You can make RPC requests to fetch the information you need. In this guide, we aim to get token information for every token invovled in a Uniswap V3 pool creation event. For each token we should index its name, symbol and decimals.

At first glance this may appear to be a simple task as we are only indexing over one event, the [pool created](https://docs.uniswap.org/contracts/v3/reference/core/interfaces/IUniswapV3Factory#poolcreated) event. However, there is one catch, have a look at the event signature: 

```yaml
PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)
```

The event only provides the token addresses, not the token name, symbol, and decimals. So how are we to fetch this extra information in our event handler? In order to do this, we need to make RPC requests to the token contract.

### Prerequisites

This guide assumes basic familiarity with the viem library for making contract calls. Check out the [viem documentation](https://viem.sh/) for more information. This [medium article](https://medium.com/@0xape/typescript-and-viem-quickstart-for-blockchain-scripting-3f1846970b6f) is highly recommened for a gentle introduction to viem with a very similar example to what we are doing here.

### Part 1: Create our Uniswap V3 `poolcreated` indexer

`npx envio init`
Contract address: `0x1F98431c8aD98523631AE4a59f267346ea31F984`

We then make some light modifications to remove unnecessary events and simplify the schema. The resulting config, schema, and event handlers look as follows:

> config.yaml

:::info
We remove the `FeeAmountEnabled` and `OwnerChanged` events as they are not relevant to our use case.
:::

```yaml
name: uniswap-v3-factory-token-indexer
networks:
- id: 1
  start_block: 12369620
  contracts:
  - name: UniswapV3Factory
    address:
    - 0x1F98431c8aD98523631AE4a59f267346ea31F984
    handler: src/EventHandlers.ts
    events:
    - event: PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)
rollback_on_reorg: false
```

> shema.graphql

:::info
Simply our schema to only include the pool and token information.
:::

```graphql
type Token {
  id: ID! #address
  name: String!
  Symbol: String!
  Decimals: Int!
}

type Pool {
  id: ID! # address
  token0: Token! 
  token1: Token!
  fee: BigInt!
  tickSpacing: BigInt!
  pool: String!
}
```

> src/EventHandlers.ts

```typescript
import {
  UniswapV3Factory,
  Pool,
} from "generated";
import { getTokenDetails } from "./tokenDetails";

UniswapV3Factory.PoolCreated.handler(async ({ event, context }) => {
  const entity: Pool = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token0_id: event.params.token0,
    token1_id: event.params.token1,
    fee: event.params.fee,
    tickSpacing: event.params.tickSpacing,
    pool: event.params.pool,
  };
  context.Pool.set(entity)


  try {
    const {name: name0, symbol: symbol0, decimals: decimals0} = await getTokenDetails(event.params.token0, event.chainId);
    context.Token.set({
      id: event.params.token0,
      name: name0,
      symbol: symbol0,
      decimals: decimals0
    })
  } catch (error) {
    console.log(error)
    return
  }

  try {
    const {name: name1, symbol: symbol1, decimals: decimals1} = await getTokenDetails(event.params.token0, event.chainId);
    context.Token.set({
      id: event.params.token1,
      name: name1,
      symbol: symbol1,
      decimals: decimals1,
    })
  } catch (error) {
    console.log(error)
    return
  }
});

```

### Part 2: Fetch token information

Note how we use the `multicall` feature to batch our 3 queries into one request and help avoid rate limiting. Very useful!

> src/tokenDetails.ts

```typescript
import { createPublicClient, getContract, http } from 'viem'
import { mainnet } from 'viem/chains'
import { Cache, CacheCategory } from "./cache";
import { ERC20ABI } from './constants';

const apiKey = process.env.ALCHEMY_API_KEY;

const client = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`),
  batch: { multicall: true }
})

export async function getTokenDetails(
  contractAddress: string,
  chainId: number
): Promise<{
  readonly name: string,
  readonly symbol: string,
  readonly decimals: number,
}> {
  const cache = await Cache.init(CacheCategory.Token, chainId);
  const token = await cache.read(contractAddress.toLowerCase());

  if (token) {
    return token;
  }

  const contract = getContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20ABI,
    client: { public: client },
  });

  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.decimals(),
    ]);
    console.log(`symbol ${symbol} decimals ${decimals} name ${name}`);

    const entry = {
      name: name?.toString() || "",
      symbol: symbol?.toString() || "",
      decimals: decimals as number,
    } as const;

    cache.add({ [contractAddress.toLowerCase()]: entry as any });

    return entry;
  } catch (err) {
    throw err;
  }
}
```

### Part 3: Cache token information

To highlight how important this step is in our use case, imagine how many Uniswap V3 pools have been created with USDC. It would be a complete waste of time to make an rpc request for USDC every time it was involved in a pool creation event!

Seeing as the token details we care about don't change over time, we can cache this information to avoid making the same rpc request multiple times.  We can do this by creating a simple cache object that stores the token information. In this case, we cache the data in a json file. For use cases with more data, you should consider using a proper database as accessing a large json file repeatedly can be slow. See the [ipfs example](https://docs.envio.dev/docs/HyperIndex/ipfs) for an example of how to cache use a SQLite database.

:::info
our cache implementation is designed to be easily extendable as you can add as many cache categories as you want. Here we only have one category for token information.
:::

> src/cache.ts

```typescript
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

    type S = C extends "token"
      ? ShapeToken
      : ShapeRoot;
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

### Challenges

1. **Historical state**: The rpc requests as shown here function as a regular rpc requests that return the current contract state. They do not fetch historical contract state. In other words, normal rpc requests always return current contract state, not the contract state for the block which your indexer is processing. For our use case, this doesn't matter as the name, symbol, and decimals of a token should not change over time. But let's say you want to fetch the ether balance of an account at a specific historical block, you would a need [special rpc request](https://docs.etherscan.io/api-pro/api-pro#get-historical-ether-balance-for-a-single-address-by-blockno) that is able to fetch historical state.
2. **Rate limiting**: Rate limiting refers to when a server limits the number of requests a client can make in a given amount of time. This is done to prevent abuse of the server. So if you make too many rpc requests in a short period of time to the same server, your requests may be blocked. The simplest way to avoid this is to check the rate limits of the server you are making requests to and adding a sufficient delay between requests. A slightly more complex way is to use multiple RPC URLs and rotate your requests between them. In our use case, the multicall feature to batch our requests was sufficient to avoid rate limiting.