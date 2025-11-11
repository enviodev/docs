---
id: effect-api
title: Effect API
sidebar_label: Effect API
slug: /effect-api
description: Learn how to use the Effect API for external calls in handlers.
---

The Effect API provides a powerful and convenient way to perform external calls from your handlers. It's especially effective when used with [Preload Optimization](/docs/HyperIndex/preload-optimization):

- **Automatic batching**: Calls of the same kind are automatically batched together
- **Intelligent memoization**: Calls are memoized, so you don't need to worry about the handler function being called multiple times
- **Deduplication**: Calls with the same arguments are deduplicated to prevent overfetching
- **Persistence**: Built-in support for result persistence for indexer reruns (opt-in via `cache: true`)
- **Future enhancements**: We're working on automatic retry logic and enhanced caching workflows 🏗️

To use the Effect API, you first need to define an effect using `createEffect` function from the `envio` package:

```typescript
import { createEffect, S } from "envio";

export const getMetadata = createEffect(
  {
    name: "getMetadata",
    input: S.string,
    output: {
      description: S.string,
      value: S.bigint,
    },
    rateLimit: {
      calls: 5,
      per: "second",
    },
    cache: true,
  },
  async ({ input, context }) => {
    const response = await fetch(`https://api.example.com/metadata/${input}`);
    const data = await response.json();
    context.log.info(`Fetched metadata for ${input}`);
    return {
      description: data.description,
      value: data.value,
    };
  }
);
```

The first argument is an options object that describes the effect:

- `name` (required) - the name of the effect used for debugging and logging
- `input` (required) - the input type of the effect
- `output` (required) - the output type of the effect
- `rateLimit` (required) - the maximum calls allowed per timeframe, or false to disable
- `cache` (optional) - save effect results in the database to prevent duplicate calls (Starting from `envio@2.26.0`)

The second argument is a function that will be called with the effect's input.

> **Note:** For type definitions, you should use `S` from the `envio` package, which uses [Sury](https://github.com/DZakh/sury) library under the hood.

After defining an effect, you can use `context.effect` to call it from your handler, loader, or another effect.

The `context.effect` function accepts an effect as the first argument and the effect's input as the second argument:

```typescript
ERC20.Transfer.handler(async ({ event, context }) => {
  const metadata = await context.effect(getMetadata, event.params.from);
  // Process the event with the metadata
});
```

### Viem Transport Batching

You can use `viem` or any other blockchain client inside your effect functions. When doing so, it's highly recommended to enable the `batch` option to group all effect calls into fewer RPC requests:

```typescript
// Create a public client to interact with the blockchain
const client = createPublicClient({
  chain: mainnet,
  // Enable batching to group calls into fewer RPC requests
  transport: http(rpcUrl, { batch: true }),
});

// Get the contract instance for your contract
const lbtcContract = getContract({
  abi: erc20Abi,
  address: "0x8236a87084f8B84306f72007F36F2618A5634494",
  client: client,
});

// Effect to get the balance of a specific address at a specific block
export const getBalance = createEffect(
  {
    name: "getBalance",
    input: {
      address: S.string,
      blockNumber: S.optional(S.bigint),
    },
    output: S.bigint,
    rateLimit: {
      calls: 5,
      per: "second",
    },
    cache: true,
  },
  async ({ input, context }) => {
    try {
      // If blockNumber is provided, use it to get balance at that specific block
      const options = input.blockNumber
        ? { blockNumber: input.blockNumber }
        : undefined;
      const balance = await lbtcContract.read.balanceOf(
        [input.address as `0x${string}`],
        options
      );

      return balance;
    } catch (error) {
      context.log.error(`Error getting balance for ${input.address}: ${error}`);
      // Return 0 on error to prevent processing failures
      return BigInt(0);
    }
  }
);
```

### Persistence

By default, effect results are not persisted in the database. This means if the effect with the same input is called again, the function will be executed the second time.

To persist effect results, you can set the `cache` option to `true` when creating the effect. This will save the effect results in the database and reuse them in future indexer runs. You can also override caching for a specific call by setting `context.cache = false`, which prevents storing results for that execution, especially useful when handling failed responses.

Example setting cache to false with context.cache:

```typescript
export const getBalance = createEffect(
  {
    // effect options
    cache: true,
  },
  async ({ input, context }) => {
    try {
      // your effect logic
    } catch (_) {
      // Don't cache failed response
      context.cache = false;
      return undefined;
    }
  }
);
```

Every effect cache creates a new table in the database `envio_effect_${effectName}`. You can see it and query in Hasura console with admin secret.

Also, use our [Development Console](https://envio.dev/console) to track the cache size and see number of calls which didn't hit the cache.

### Reuse Effect Cache on Indexer Reruns

To prevent invalid data we don't keep the effect cache on indexer reruns. But you can explicitly configure cache, which should be preloaded when the indexer is rerun.

Open [Development Console](https://envio.dev/console) of the running indexer which accumulated the cache. You'll be able to see the `Sync Cache` button right at the `Effects` section. Clicking the button will load the cache from the indexer database to the `.envio/cache` directory in your indexer project.

When the indexer is rerun by using `envio dev` or `envio start -r` call, the initial cache will be loaded from the `.envio/cache` directory and used for the indexer run.

> **Note:** This feature is available starting from `envio@2.26.0`. It also doesn't support rollbacks on reorgs. The support for reorgs will be added in the future.


### Cache on Hosted Service

The same `.envio/cache` can also be used to populate the initial cache on the hosted service.

Although this solution is very limited, and we're actively working on a better integration:

- It requires to commit `.envio/cache` to the GitHub repository, increasing the repository and git history size
- The file size is limited to 100MB, which is not enough for some use cases
- There might be issues with pulling big caches from the GitHub repository

Join our [Discord](https://discord.gg/envio) to get updates on the progress of the hosted service integration.

### Rate Limit

Starting from [`v2.32.0`](https://github.com/enviodev/hyperindex/releases/tag/v2.32.0), the `rateLimit` option was added. It controls how frequently an effect can run within a given timeframe. You can set it to `false` to disable rate limiting or define a custom limit such as calls per second, minute, or a duration in milliseconds.

```typescript
// Effect to get the balance of a specific address at a specific block
export const getBalance = createEffect(
  {
    name: "getBalance",
    input: {
      address: S.string,
      blockNumber: S.optional(S.bigint),
    },
    output: S.bigint,
    // rateLimit: false, // you can set rateLimit to false if needed
    rateLimit: {
      calls: 5,
      per: "second",  // also supports "minute" or a duration in milliseconds
    },
    cache: true,
  },
  async ({ input, context }) => {
      // your effect logic 
  }
);
```

### Migrate from Experimental

If you're using `experimental_createEffect` to migrate to `createEffect`, you need to remove `experimental_` prefix and add `rateLimit` option which now required.

```diff typescript
- export const getBalance = experimental_createEffect(
+ export const getBalance = createEffect(
  {
    name: "getBalance",
    input: {
      address: S.string,
      blockNumber: S.optional(S.bigint),
    },
    output: S.bigint,
+   rateLimit: {
+     calls: 5,
+     per: "second",
+   },
    cache: true,
  },
  async ({ input, context }) => {
    // your effect logic
  }
);
```