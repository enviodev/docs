---
id: preload-optimization
title: Preload Optimization
sidebar_label: Preload Optimization
slug: /preload-optimization
description: Learn how preload optimization improves event handlers with batched reads and parallel external calls.
---

# Preload Optimization

> **Important!** Preload optimization makes your handlers run **twice**.

Starting from `envio@2.27` all new indexers are created with preload optimization pre-configured by default.

This optimization enables HyperIndex to efficiently preload entities used by handlers through batched database queries, while ensuring events are processed synchronously in their original order. When combined with the [Effect API](/docs/HyperIndex/effect-api) for external calls, this feature delivers performance improvements of multiple orders of magnitude compared to other indexing solutions.

<iframe width="560" height="315" src="https://www.youtube.com/embed/QqbH78CEid8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Configure

Currently, you need to explicitly enable the preloaded configuration in your [`config.yaml`](/docs/HyperIndex/configuration-file) file. In the future, this will be enabled by default.

```yaml
preload_handlers: true
```

## Why Preload?

To ensure reliable data, HyperIndex guarantees that all events will be processed in the same order as they occurred on-chain.

This guarantee is crucial as it allows you to build indexers that depend on the sequential order of events.

However, this leads to a challenge: Handlers must run one at a time, sequentially for each event. Any asynchronous operations will block the entire process.

To solve this, we introduced Preload Optimization.

It combines in-memory storage, batching, deduplication, and the [Effect API](/docs/HyperIndex/effect-api) to parallelize asynchronous operations across batches of events.

## How It Works?

With Preload Optimization handlers run twice per event:

1. **First Run (Preload Phase)**: All event handlers run concurrently for the whole batch of events. During the phase all DB write operations are skipped and only DB read operations and external calls are performed.
2. **Second Run (Processing Phase)**: Each event handler runs sequentially in the on-chain order. During the phase it'll get the data from the in-memory store, reflecting changes made by previously processed events.

This double execution pattern ensures that entities created by earlier events in the batch are available to later events.

### The Database I/O Problem

Consider this common pattern of getting entities in event handlers:

```typescript
ERC20.Transfer.handler(async ({ event, context }) => {
  const sender = await context.Account.get(event.params.from);
  const receiver = await context.Account.get(event.params.to);
  // Process the transfer...
});
```

**Without Preload Optimization:** If you're processing 5,000 transfer events, each with unique `from` and `to` addresses, this results in **10,000 total database roundtrips** (2 per event × 5,000 events). This creates a significant bottleneck that slows down your entire indexing process.

**With Preload Optimization:**

1. During the **Preload Phase**, all 5,000 events are processed in parallel. HyperIndex batches database reads into single queries — one for sender lookups, one for receiver lookups.
2. The loaded accounts are cached in memory.
3. During the **Processing Phase**, handlers run sequentially in on-chain order but retrieve data from the in-memory cache instead of hitting the database.

**Result:** Database roundtrips drop from 10,000 to just 2.

#### Optimizing for Concurrency

You can further optimize performance by requesting multiple entities concurrently:

```typescript
ERC20.Transfer.handler(async ({ event, context }) => {
  // Request sender and receiver concurrently for maximum efficiency
  const [sender, receiver] = await Promise.all([
    context.Account.get(event.params.from),
    context.Account.get(event.params.to),
  ]);
  // Process the transfer...
});
```

This approach can reduce the database roundtrips to just 1 for the entire batch of events!

### The External Calls Problem

Let's say you want to populate your indexer with offchain data:

```typescript
ERC20.Transfer.handler(async ({ event, context }) => {
  // Without Preload: Blocking external calls
  const metadata = await fetch(
    `https://api.example.com/metadata/${event.params.from}`
  );

  // Process the transfer...
});
```

**Without Preload Optimization:** Processing 5,000 transfer events means **5,000 sequential external calls**, each waiting for the previous one to complete. This turns a fast indexing process into a slow, sequential crawl.

**With Preload Optimization:** Since handlers run **twice**, making direct external calls can be problematic. The [Effect API](/docs/HyperIndex/effect-api) solves this:

1. During the **Preload Phase**, it batches all external calls and runs them in parallel.
2. During the **Processing Phase**, handlers run sequentially and retrieve the already-fetched data from the in-memory store.

```typescript
import { S, createEffect } from "envio";

const fetchMetadata = createEffect(
  {
    name: "fetchMetadata",
    input: {
      from: S.string,
    },
    output: {
      decimals: S.number,
      symbol: S.string,
    },
    rateLimit: {
      calls: 5,
      per: "second",
    },
  },
  async ({ input }) => {
    const metadata = await fetch(
      `https://api.example.com/metadata/${input.from}`
    );
    return metadata;
  }
);

ERC20.Transfer.handler(async ({ event, context }) => {
  // With Preload: Performs the call in parallel
  const metadata = await context.effect(fetchMetadata, {
    from: event.params.from,
  });

  // Process the transfer...
});
```

Assuming an average call takes 200ms, this optimization reduces the total processing time for 5,000 events from ~16 minutes to ~200 milliseconds - making it 5,000 times faster!

Learn more about the [Effect API](/docs/HyperIndex/effect-api) in our dedicated guide.

### Preload Phase Behavior

The Preload Phase is a special phase that runs before the actual event processing. It's designed to preload data that will be used during event processing.

Key characteristics of the Preload Phase:

- It runs in parallel for all events in the batch
- Exceptions won't crash the indexer but will silently abort the Preload Phase for that specific event (Starting from `envio@2.23`)
- All storage updates are ignored
- All `context.log` calls are ignored

During the second run (Processing Phase), all operations become fully enabled:

- Exceptions will crash the indexer if not handled
- Entity setting operations will persist to the database
- Logging will output to the console

This two-phase design allows the Preload Phase to optimistically attempt loading data that may not exist yet, while ensuring data consistency during the Processing Phase when all operations are executed normally.

If you're using an earlier version of `envio`, we strongly recommend upgrading to the latest version using `pnpm install envio@latest` to benefit from this improved Preload Phase behavior.

## Double-Run Footgun

As mentioned above, the Preload Phase gives a lot of benefits for the event processing, but also it means that you must be aware of its double-run nature:

- Never call `fetch` or other external calls directly in the handler.
  - Use the [Effect API](/docs/HyperIndex/effect-api) instead.
  - Or use `context.isPreload` to guarantee that the code will run once.

Due to the optimistic nature of the Preload Phase, the Effect API may occasionally execute with stale data, leading to redundant external calls. If you need to ensure that external calls are made with the most up-to-date data, you can use the `context.isPreload` check to restrict execution to only the processing phase.

> Note: This will disable the Preload Optimization for the external calls.

```typescript
ERC20.Transfer.handler(async ({ event, context }) => {
  const sender = await context.Account.get(event.params.from);

  if (context.isPreload) {
    return;
  }

  const metadata = await fetch(
    `https://api.example.com/metadata/${sender.metadataId}`
  );
});
```

## Best Practices

- Use `Promise.all` to load multiple entities concurrently for better performance
- Place database reads and external calls at the beginning of your handler to maximize the benefits of Preload Optimization
- Consider using `context.isPreload` to exit early from the Preload Phase after loading required data

## Migrating from Loaders

The Preload Optimization for handlers was born from a concept we had before called [Loaders](/docs/HyperIndex/loaders). If you're using loaders, we recommend you to migrate to preload optimization by enabling it in the config and moving all your code to the handler.

```typescript
// Before:
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Load sender and receiver accounts efficiently
    const sender = await context.Account.get(event.params.from);
    const receiver = await context.Account.get(event.params.to);

    // Return the loaded data to the handler
    return {
      sender,
      receiver,
    };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { sender, receiver } = loaderReturn;

    // Process the transfer with the pre-loaded data
    // No database lookups needed here!
  },
});

// After:
ERC20.Transfer.handler(async ({ event, context }) => {
  // Load sender and receiver accounts efficiently
  const sender = await context.Account.get(event.params.from);
  const receiver = await context.Account.get(event.params.to);

  // To imitate the behavior of the loader,
  // we can use `context.isPreload` to make next code run only once.
  // Note: This is not required, but might be useful for CPU-intensive operations.
  if (context.isPreload) {
    return;
  }

  // Process the transfer with the pre-loaded data
});
```
