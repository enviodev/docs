---
id: loaders
title: Loaders
sidebar_label: Loaders (Performance)
slug: /loaders
---

# Optimizing Database Access with Loaders

## What Are Loaders?

Loaders are specialized functions that dramatically optimize how your event handlers fetch data from the database. They provide a powerful mechanism to:

- **Batch multiple database requests** into single operations
- **Cache database results** in memory for instant access
- **Reduce I/O operations**, which are typically the primary performance bottleneck in indexing

By using loaders, you can reduce database roundtrips from thousands to just a handful, especially when processing large batches of events.

## Why Use Loaders?

### The Database I/O Problem

Consider this common pattern in event handlers:

```typescript
// Without loaders: Inefficient database access
ERC20.Transfer.handler(async ({ event, context }) => {
  const sender = await context.Account.get(event.params.from);
  const receiver = await context.Account.get(event.params.to);

  // Process the transfer...
});
```

**The Performance Challenge:** If you're processing 5,000 transfer events, each with unique `from` and `to` addresses, this results in **10,000 total database roundtrips**—one for each sender and receiver lookup (2 per event × 5,000 events). This creates a significant bottleneck that slows down your entire indexing process.

### The External Calls Problem

To ensure consistent and reliable data, all handlers execute synchronously in on-chain order. This means external calls can dramatically increase processing time:

```typescript
// Without loaders: Blocking external calls
ERC20.Transfer.handler(async ({ event, context }) => {
  const metadata = await fetch(
    `https://api.example.com/metadata/${event.params.from}`
  );

  // Process the transfer...
});
```

**The Performance Challenge:** If you're processing 5,000 transfer events, each with an external call, this results in **5,000 sequential external calls**—each waiting for the previous one to complete. This can turn a fast indexing process into a slow, sequential crawl.

### How Loaders Solve This

Loaders address these performance bottlenecks through intelligent optimization:

1. **Collect all database and Effect requests** before processing events
2. **Batch similar requests** into single I/O operations
3. **Cache results** in memory for efficient reuse

This approach reduces thousands of database calls to just a handful per batch, dramatically improving indexing performance. When combined with the [Effect API](#effect-api-experimental), you can also parallelize external calls for even greater efficiency.

## How to Implement Loaders

### Basic Structure

Loaders use the `handlerWithLoader` pattern, which elegantly separates data loading from event processing:

```typescript
ContractName.EventName.handlerWithLoader({
  // The loader function runs before event processing starts
  loader: async ({ event, context }) => {
    // Load all required data from the database
    // Return the data needed for event processing
  },

  // The handler function processes each event with pre-loaded data
  handler: async ({ event, context, loaderReturn }) => {
    // Process the event using the data returned by the loader
  },
});
```

### Basic Example: Converting a Simple Handler

Let's convert our previous inefficient example to use loaders:

```typescript
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
```

### How Batching Works

The batching process follows these three key steps:

1. **Batch Creation**: HyperIndex creates an ordered batch of events from the event buffer accumulated in memory
2. **Preload Phase**: All loader functions run concurrently for the entire batch. This is called the `Preload` phase.

   _**Note:** During the preload phase, some entities being loaded may not exist yet since the handlers haven't been executed. This is expected behavior - the loader runs twice per event to ensure data consistency._

3. **Sequential Processing**: For each event in the batch, its loader runs a **second time** and then passes the result to the handler. This step is sequential to maintain order.

For our 5,000 transfer events example, this reduces database roundtrips from 10,000 total calls to just 2!

## Advanced Loader Techniques

### Optimizing for Concurrency

You can further optimize performance by requesting multiple entities concurrently:

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Request sender and receiver concurrently for maximum efficiency
    const [sender, receiver] = await Promise.all([
      context.Account.get(event.params.from),
      context.Account.get(event.params.to),
    ]);

    return { sender, receiver };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { sender, receiver } = loaderReturn;
    // Process with pre-loaded data
  },
});
```

This approach can reduce the database roundtrips to just 1 for the entire batch of events!

### Querying by Field Values

Loaders also support complex queries using the `getWhere` method, which allows you to retrieve arrays of entities based on field values:

```typescript
ERC20.Approval.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Find all approvals for this specific owner
    const currentOwnerApprovals = await context.Approval.getWhere.owner_id.eq(
      event.params.owner
    );

    return { currentOwnerApprovals };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { currentOwnerApprovals } = loaderReturn;

    // Process all the owner's approvals efficiently
    for (const approval of currentOwnerApprovals) {
      // Process each approval
    }
  },
});
```

This technique works with any entity field that:

- Is used in a relationship with the [`@derivedFrom`](schema/#relationships-one-to-many-derivedfrom) directive
- Has an [`@index`](database-performance-optimization/#creating-custom-indices-in-your-schema) directive

## Effect API `experimental`

The Effect API provides a powerful and convenient way to perform external calls from your handlers. It's especially effective when used with loaders:

- **Automatic batching**: Calls of the same kind are automatically batched together
- **Intelligent memoization**: Calls are memoized, so you don't need to worry about the handler function being called multiple times
- **Deduplication**: Calls with the same arguments are deduplicated to prevent overfetching
- **Persistence**: Built-in support for result persistence (opt-in via `cache: true`) for indexer reruns
- **Future enhancements**: We're working on automatic retry logic and enhanced caching workflows 🏗️
To use the Effect API, you first need to define an effect using `experimental_createEffect` function from the `envio` package:

```typescript
import { experimental_createEffect, S } from "envio";

export const getMetadata = experimental_createEffect(
  {
    name: "getMetadata",
    input: S.string,
    output: {
      description: S.string,
      value: S.bigint,
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
- `cache` (optional) - save effect results in the database to prevent duplicate calls (Starting from `envio@2.26.0`)

The second argument is a function that will be called with the effect's input.

> **Note:** For type definitions, you should use `S` from the `envio` package, which uses [Sury](https://github.com/DZakh/sury) library under the hood.

After defining an effect, you can use `context.effect` to call it from your handler, loader, or another effect.

The `context.effect` function accepts an effect as the first argument and the effect's input as the second argument:

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    const metadata = await context.effect(getMetadata, event.params.from);
    return { metadata };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { metadata } = loaderReturn;
    // Process the event with the metadata
  },
});
```

This way for our problem of 5,000 transfer events, we will be able to parallelize all external calls instead of executing them one by one.

### Viem Pro Tip

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
export const getBalance = experimental_createEffect(
  {
    name: "getBalance",
    input: {
      address: S.string,
      blockNumber: S.optional(S.bigint),
    },
    output: S.bigint,
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

To persist effect results, you can set the `cache` option to `true` when creating the effect. This will save the effect results in the database and reuse them in future indexer runs.

Every effect cache creates a new table in the database `envio_effect_${effectName}`. You can see it and query in Hasura console with admin secret.

Also, use our [Development Console](https://envio.dev/console) to track the cache size and see number of calls which didn't hit the cache.

### Reuse Effect Cache on Indexer Reruns

To prevent invalid data we don't keep the effect cache on indexer reruns. But you can explicitly configure cache, which should be preloaded when the indexer is rerun.

Open [Development Console](https://envio.dev/console) of the running indexer which accumulated the cache. You'll be able to see the `Sync Cache` button right at the `Effects` section. Clicking the button will load the cache from the indexer database to the `.envio/cache` directory in your indexer project.

When the indexer is rerun by using `envio dev` or `envio start -r` call, the initial cache will be loaded from the `.envio/cache` directory and used for the indexer run.

> **Note:** This feature is available starting from `envio@2.26.0`. It also doesn't support rollbacks on reorgs. The support for reorgs will be added in the future.

### Cache on Hosted Service

The same `.envio/cache` can be also used to populate the initial cache on the hosted service.

Although this solution is very limited, and we're actively working on a better integration:

- It requires to commit `.envio/cache` to the GitHub repository, increasing the repository and git history size
- The file size is limited to 100MB, which is not enough for some use cases
- There might be issues with pulling big caches from the GitHub repository

Join our [Discord](https://discord.gg/envio) to get updates on the progress of the hosted service integration.

### Why Experimental?

The Effect API is currently marked as experimental, but we don't expect major breaking changes in the future. This designation simply means we're actively iterating on the feature and may add new capabilities that could subtly change indexer behavior. We plan to remove the `experimental` tag soon, and your feedback is invaluable in this process!

## Best Practices

### When to Use Loaders

Loaders provide the most significant benefits when:

- Processing large batches of events that require similar database lookups
- Reading the same entities multiple times across different events
- Performing relationship queries that affect multiple entities
- Building high-performance indexers that need to handle millions of events

### Performance Considerations

When using loaders, keep these performance factors in mind:

- **Memory Usage**: All loaded entities are stored in memory during batch processing
- **Query Size**: Very large `getWhere` queries might cause memory issues
- **Complexity**: Balance the benefits of batching against code complexity
- **Batch Size**: Larger batches provide better performance but use more memory

### Rules of Thumb

Follow these guidelines for optimal loader usage:

1. **Use loaders for large-scale indexing**: Implement loaders if you're indexing more than 1 million events
2. **Centralize database operations**: Put all database operations in the loader function
3. **Wrap external calls in effects**: Use the Effect API for external calls and implement them in loaders
4. **Keep handlers focused**: Reserve handler functions for business logic, not data fetching
5. **Optimize with concurrency**: Use concurrent requests when loading multiple unrelated entities
6. **Monitor memory usage**: Be mindful of memory consumption with large batches

### Understanding Double Run Behavior

Loaders are designed to run twice per event to ensure data consistency across the batch. This is intentional and expected behavior:

1. **First Run (Preload Phase)**: All loaders run concurrently at the start of batch processing
2. **Second Run (Event Processing)**: Each loader runs again sequentially before its corresponding handler

This double execution pattern ensures that:

- Entities created by earlier events in the batch are available to later events
- Data consistency is maintained across the entire batch
- The benefits of batching are preserved while ensuring accurate data access

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    // This loader will run twice per event
    // First run: May not find the sender if it's created by an earlier event in this batch
    // Second run: Will find the sender if it was created by an earlier event
    const sender = await context.Account.getOrThrow(event.params.from);

    return {
      sender,
    };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { sender } = loaderReturn;
    // Process the event with the loaded sender data
  },
});
```

The indexer will only crash if the `sender` entity was actually not set in an event preceding the one being processed, which indicates a genuine data consistency issue.

### Preload Phase Behavior

Starting from `envio@2.23.0`, the preload phase has been enhanced to prevent batch processing failures. During the first run (preload phase), the following operations are silently ignored:

- **Thrown exceptions**: Any errors thrown during the preload phase are caught and ignored
- **Entity setting**: Calls to `context.Entity.set()` and other entity operations are ignored during preload
- **Logging**: Calls to `context.log.*()` are ignored during preload

Only during the second run (actual event processing) are all operations fully enabled:

- Exceptions will crash the indexer if not handled
- Entity setting operations will persist to the database
- Logging will output to the console

This design ensures that the preload phase can safely attempt to load data that may not exist yet, while the actual processing phase handles all operations normally.

If you're using an earlier version of `envio`, we strongly recommend upgrading to the latest version with `pnpm install envio@latest` to take advantage of this improved preload phase behavior.

### Going All-In with Loaders

Starting from `envio@2.23.0`, loaders support setting entities directly, making handlers optional. You can now process all your events entirely within the loader function:

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Load existing data efficiently
    const [sender, receiver] = await Promise.all([
      context.Account.getOrThrow(event.params.from),
      context.Account.getOrThrow(event.params.to),
    ]);

    // Skip expensive operations during preload
    if (context.isPreload) {
      return;
    }

    // CPU-intensive calculations only happen once
    const complexCalculation = performExpensiveOperation(event.params.value); // Placeholder function for demonstration

    // Create or update sender account
    const senderAccount = context.Account.set({
      id: event.params.from,
      balance: sender.balance - event.params.value,
      computedValue: complexCalculation,
    });

    // Create or update receiver account
    const receiverAccount = context.Account.set({
      id: event.params.to,
      balance: receiver.balance + event.params.value,
    });

    // No need to return anything - all work is done in the loader
  },
  handler: async ({ event, context, loaderReturn }) => {
    // Handler can be empty - all logic is handled in the loader
  },
});
```

**For power users, we recommend moving all event processing to the loader function** to take advantage of this enhanced functionality. This approach will be the most compatible with future Envio versions.

If you need to skip the preload phase for CPU-intensive operations or to perform certain actions only once, you can use `context.isPreload`. This allows you to replicate the traditional handler behavior within a loader.

**Note:** While `context.isPreload` can be useful for bypassing double execution, it's recommended to use the [Effect API](#effect-api-experimental) for external calls instead, as it provides automatic batching and memoization benefits.

### Future: Version 3.0 Unified Handler Behavior

In Envio V3, the separation between handlers and loaders will be removed entirely. All handlers will behave like loaders by default, running twice per event to ensure data consistency. This change will:

- **Make many indexers faster by default** without requiring explicit configuration
- **Simplify the mental model** (similar to React's double-render pattern)
- **Provide the benefits of loaders** without requiring explicit configuration

The double execution pattern should be familiar to JavaScript/React developers and will be thoroughly documented to help users understand this new behavior.

## Summary

Loaders provide a powerful and efficient way to optimize database access in your Envio indexers by:

- **Dramatically reducing database roundtrips** from thousands to just a few per batch
- **Automatically batching similar requests** for maximum efficiency
- **Caching results in memory** for instant access during processing

By elegantly separating data loading from event processing, loaders enable you to build more efficient and performant indexers while maintaining clean, readable code. Whether you're processing thousands or millions of events, loaders can transform your indexing performance from slow and sequential to fast and parallel.
