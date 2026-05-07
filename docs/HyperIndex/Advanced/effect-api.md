---
id: effect-api
title: Effect API
sidebar_label: Effect API
slug: /effect-api
description: Learn how to use the Effect API for external calls in handlers.
---

import Video from "@site/src/components/Video";

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
- `output` (required) - the output type of the effect (not required for `unorderedAfterCommit` and `orderedAfterCommit` modes which return `void`)
- `rateLimit` (required) - the maximum calls allowed per timeframe, or `false` to disable
- `cache` (optional) - save effect results in the database to prevent duplicate calls (Starting from `envio@2.26.0`)
- `mode` (optional) - the execution intent of the effect. Defaults to `speculative`. See [Execution Modes](#execution-modes).

The second argument is a function that will be called with the effect's input.

> **Note:** For type definitions, you should use `S` from the `envio` package, which uses [Sury](https://github.com/DZakh/sury) library under the hood.

After defining an effect, you can use `context.effect` to call it from your handler, loader, or another effect.

The `context.effect` function accepts an effect as the first argument and the effect's input as the second argument:

```typescript
import { indexer } from "envio";

indexer.onEvent(
  { contract: "ERC20", event: "Transfer" },
  async ({ event, context }) => {
    const metadata = await context.effect(getMetadata, event.params.from);
    // Process the event with the metadata
  },
);
```

### Reading On-Chain State (eth_call)

The Effect API is how you perform `eth_call`-style reads from your handlers — for example, reading a token balance, fetching a contract's name, or querying any view function at a specific block.

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


### Cache on Envio Cloud

Envio Cloud provides built-in cache management for Effect API results, allowing you to save and restore caches directly from the dashboard without committing files to your repository.

**Key Features:**
- **Save Cache**: Capture effect data from any deployment with one click via Quick Actions
- **Cache Settings**: Manage caches in Settings > Cache - enable/disable caching and select which cache to use
- **Automatic Restore**: New deployments automatically preload effect data from your selected cache

This eliminates the need to commit `.envio/cache` to your repository and removes file size limitations.

For detailed instructions, see the [Effect API Cache documentation](/docs/HyperIndex/hosted-service-features#effect-api-cache).

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

Watch the following video to learn more about createEffect and other updates introduced in [v2.32.0](https://github.com/enviodev/hyperindex/releases/tag/v2.32.0).
<Video id="yvUVzV1ifig" title="Envio v2.32.0" />

### Execution Modes

The `mode` option controls **when** the effect runs, **how** it's ordered relative to other effect calls in the batch, and what `context.effect` returns. One constructor, one call verb — behavior shifts on `mode`.

| Mode | Input | Order | Timing | Returns | Use case |
| --- | --- | --- | --- | --- | --- |
| `speculative` *(default)* | maybe-wrong | unordered | preload (parallel) | value | RPC reads, fetch, IPFS — the default behavior |
| `unordered` | correct | unordered | inline (parallel within batch) | value | parallel reads/writes with verified input where order doesn't matter |
| `ordered` | correct | in-order | inline (sequential pass) | value | low-latency writes where order matters (e.g. depends on prior entity writes in the same batch) |
| `unorderedAfterCommit` | correct | unordered | after DB commit | `void` | high-throughput sends, fire-and-forget webhooks, partitioned Kafka |
| `orderedAfterCommit` | correct | in-order | after DB commit | `void` | sends where order matters (Telegram, ordered streams) |

The two `*AfterCommit` modes are the right choice for **outbound messaging** — Redis, Kafka, RabbitMQ, SNS/SQS, Telegram, Discord, Slack, webhooks. They fire only after the batch's database transaction commits, so a downstream consumer never sees a message for a state that didn't actually persist. They also return `void`, so you don't need to `await` the call from your handler — the runtime takes care of dispatching after commit.

```typescript
import { createEffect, indexer, S } from "envio";

const notifyLargeSwap = createEffect(
  {
    name: "notifyLargeSwap",
    input: { usd: S.bigint, blockNumber: S.number },
    mode: "orderedAfterCommit",
  },
  async ({ input }) => {
    const text = `Large swap: $${input.usd.toLocaleString()} in block ${input.blockNumber}`;
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text,
      }),
    });
  }
);

indexer.onEvent(
  { contract: "Pool", event: "Swap" },
  async ({ event, context }) => {
    const usd = event.params.amount;
    if (usd > 1_000_000n) {
      context.effect(notifyLargeSwap, {
        usd,
        blockNumber: event.block.number,
      });
      // no await — orderedAfterCommit returns void; runtime fires it after the batch's DB commit
    }
  },
);
```

#### When to pick which mode

- **`speculative`** — your call is idempotent, the input may not be final (preloading runs handlers ahead of confirmed state), and you only need a value back. RPC `eth_call`s, `fetch` of IPFS metadata, and any read where retries are cheap belong here.
- **`unordered`** — you've already verified the input (e.g. derived it from a committed entity) and the work is parallel-safe. Use this for batched reads/writes that don't depend on each other.
- **`ordered`** — the effect's correctness depends on something written earlier in the same batch. The runtime will run these calls sequentially in handler order.
- **`unorderedAfterCommit`** — fire-and-forget sends where ordering doesn't matter: partitioned Kafka topics, Redis Streams keyed by tx hash, generic webhooks. Highest throughput, never sends for state that wasn't committed.
- **`orderedAfterCommit`** — sends to a single ordered destination: a Telegram chat, a Slack channel, a single Kafka partition. The runtime preserves handler order across the batch.

For outbound messaging, `*AfterCommit` is the safe default. If you've measured commit latency as the bottleneck and your downstream consumer is idempotent, you can also use the inline `unordered` / `ordered` modes for **lower latency** sends — same parallel/sequential semantics, but they fire before the DB commit and return a value. The tradeoff is weaker delivery: a failed batch can still produce a delivered message, so retries on the next run are duplicates rather than first-time sends.

This is what makes the Effect API a good fit for **streams and chat bots** — you describe what to send and where, the runtime handles batching, ordering, and delivery semantics. See the [Streams](/docs/HyperIndex/streams) and [Chat Bots](/docs/HyperIndex/chatbots) guides for end-to-end examples per provider.

### Sending Notifications (Webhooks)

You can use the Effect API to send push notifications or webhook calls when specific events occur. This is useful for alerting systems, Discord/Slack bots, or triggering downstream workflows.

```typescript
import { createEffect, S } from "envio";

export const sendWebhook = createEffect(
  {
    name: "sendWebhook",
    input: {
      event: S.string,
      data: S.string,
    },
    rateLimit: {
      calls: 10,
      per: "second",
    },
    mode: "unorderedAfterCommit",
  },
  async ({ input, context }) => {
    await fetch("https://your-webhook-url.com/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: input.event, data: input.data }),
    });
  }
);
```

Then call it from your handler:

```typescript
import { indexer } from "envio";

indexer.onEvent(
  { contract: "MyContract", event: "LargeTransfer" },
  async ({ event, context }) => {
    context.effect(sendWebhook, {
      event: "large_transfer",
      data: JSON.stringify({
        from: event.params.from,
        to: event.params.to,
        amount: event.params.value.toString(),
      }),
    });
    // no await — `unorderedAfterCommit` returns void and dispatches after the DB commit
  },
);
```

Because the effect runs **after** the batch's DB commit, the webhook will only fire for state that actually persisted — a reorg or a failed batch never produces a phantom notification. For send-only effects you typically don't need `cache: true`; the mode itself prevents duplicate sends within a successful run.

### Migrate from Experimental

If you're migrating from `experimental_createEffect` to `createEffect`, remove the `experimental_` prefix and add the `rateLimit` option, which is now required. In `experimental_createEffect`, the `rateLimit` option was optional and defaulted to `false`.

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