---
id: loaders
title: Loaders
sidebar_label: Loaders (Performance)
slug: /loaders
---

# Optimizing Database Access with Loaders

## What Are Loaders?

Loaders are specialized functions that optimize how your event handlers fetch data from the database. They provide a mechanism to:

- **Batch multiple database requests** into a single operation
- **Cache database results** in memory
- **Reduce I/O operations**, which are often the primary performance bottleneck

By using loaders, you can significantly reduce the number of database roundtrips required to process events, especially when dealing with large batches of events.

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

**The Challenge:** If you're processing 5,000 transfer events, each with unique `from` and `to` addresses, this would result in **10,000 roundtrips** to the database—one for each sender and receiver lookup.

### The External Calls Problem

To ensure consistent and reliable data, all handlers are executed synchronously in the on-chain order. This means that external calls might easily blow up the processing time.

```typescript
// Without loaders: Blocking external calls
ERC20.Transfer.handler(async ({ event, context }) => {
  const metadata = await fetch(
    `https://api.example.com/metadata/${event.params.from}`
  );

  // Process the transfer...
});
```

**The Challenge:** If you're processing 5,000 transfer events, each with an external call, this would result in **5,000 external calls** executed one after another.

### How Loaders Solve This

Loaders address this problem by:

1. **Collecting all database and Effect requests** before processing events
2. **Batching similar requests** into single I/O operations
3. **Caching results** for use during event processing

This approach can reduce thousands of database calls to just a handful, dramatically improving indexing performance. And using the [Effect API](#effect-api-experimental), you can parallelize external calls and make the indexing process more efficient.

## How to Implement Loaders

### Basic Structure

Loaders use the `handlerWithLoader` pattern, which separates data loading from event processing:

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

Let's convert our previous example to use loaders:

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Load sender and receiver accounts
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

1. HyperIndex will create an ordered batch of events from its in memory queue
2. All loader functions will be run concurrently for the batch.

   _**Note:** at this stage, some entities being loaded may not exist yet since the handlers have not been run. [Be careful of throwing errors in loaders when an entity is undefined](#beware-of-double-run-footgun)._

3. On each event of the batch, its loader will be run a **second time** and then pass the result to the handler. This step is sequential.

For our 5,000 transfer events example, this reduces database roundtrips from 10,000 to just 2!

## Advanced Loader Techniques

### Optimizing for Concurrency

You can further optimize by requesting multiple entities concurrently:

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Request sender and receiver concurrently
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

Loaders also support more complex queries using the `getWhere` method, which allows you to retrieve arrays of entities based on field values:

```typescript
ERC20.Approval.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Find all approvals for this owner
    const currentOwnerApprovals = await context.Approval.getWhere.owner_id.eq(
      event.params.owner
    );

    return { currentOwnerApprovals };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { currentOwnerApprovals } = loaderReturn;

    // Process all the owner's approvals
    for (const approval of currentOwnerApprovals) {
      // Process each approval
    }
  },
});
```

This technique works with any entity field that:

- Is used in a relationship with the [`@derivedFrom`](schema/#relationships-one-to-many-derivedfrom) directive
- Has an [`@index`](database-performance-optimization/#creating-custom-indices) directive

## Effect API `experimental`

The Effect API is a convenient way to perform external calls from your handlers. It's especially powerful when used with loaders:

- It automatically batches calls of the same kind
- It memoizes calls, so you don't need to worry about the loader function being called multiple times
- It deduplicates calls with the same arguments so that you won't overfetch
- And we're working on adding support for automatic retrying of failed requests as well as persisting results to use on indexer reruns 🏗️

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
  },
  ({ input, context }) => {
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

The second argument is a function that will be called with the effect's input.

> **Note:** For type definitions, you should use `S` from the `envio` package, which uses [Sury](https://github.com/DZakh/sury) library under the hood.

After you define an effect, you can use `context.effect` to call it from your handler, loader or other effect.

The `context.effect` accepts an effect as the first argument and the effect's input as the second argument:

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

You can use `viem` or any other client inside of your effect function.

In this case, it's really recommended to set the `batch` option to `true`. This way it'll allow to group all effect calls into a few RPC batched calls.

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
```

### Why Experimental?

The Effect API is still experimental, but we don't expect breaking changes in the future. It just means that we are going to iterate on it and add even more features, which can subtly change the indexer behavior. Hopefully, we'll be able to remove the `experimental` tag soon. And your feedback is more than welcome!

## Best Practices

### When to Use Loaders

Loaders provide the most benefit when:

- Processing batches of events that require similar database lookups
- Reading the same entities multiple times across different events
- Performing relationship queries that affect multiple entities

### Performance Considerations

- **Memory Usage**: All loaded entities are stored in memory during batch processing
- **Query Size**: Very large `getWhere` queries might cause memory issues
- **Complexity**: Balance the benefits of batching against code complexity

### Rules of Thumb

1. Use loaders if you are going to index more than say 5 million events
2. Put all database operations in the loader function
3. Wrap all external calls in effects and try to use them in loaders
4. Keep handler functions focused on business logic
5. Use concurrent requests when loading multiple unrelated entities

### Beware of Double Run Footgun

In the example below, the loader will be run twice (once at the start of the batch and once during the processing of each event).
This means that the "sender" `Account` entity may not exist yet on the first run of the loader.

During the processing of the batch, another handler may set it before it is available.

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    // BE CAREFUL HERE
    // The loader will be run twice and sender may not exist on the first run
    const sender = await context.Account.getOrThrow(event.params.from);

    return {
      sender,
    };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { sender } = loaderReturn;
    // ... handler logic
  },
});
```

Starting from `envio@2.22.0` errors on the first loader run will be automatically caught and silently ignored, making your indexer to continue processing the batch.

If you're using an earlier version of `envio`, the example above could crash unnecessarily. If you want to achieve the same behaviour you should rather throw the error in the handler. But better to upgrade your indexer with `pnpm install envio@latest`!

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    const sender = await context.Account.get(event.params.from);
    return {
      sender,
    };
  },
  handler: async ({ event, context, loaderReturn }) => {
    const { sender } = loaderReturn;
    if (!sender) {
      throw new Error(`Sender account not found: ${event.params.from}`);
    }
    // ... handler logic
  },
});
```

The indexer will only crash if the `sender` entity was actually not set in an event preceding the one being processed.

## Limitations

**Note:** The `getWhere` queries can be resource-intensive and should be used carefully:

- They are currently unrestricted
- Large result sets can cause "out of memory" errors
- All processing happens in memory

For performance-critical applications, consider limiting the scope of your queries or processing data in smaller batches.

## Summary

Loaders provide a powerful way to optimize database access in your Envio indexers by:

- Reducing database roundtrips from thousands to just a few
- Automatically batching similar requests
- Caching results in memory for efficient processing

By separating data loading from event processing, loaders allow you to write more efficient and performant indexers while maintaining clean, readable code.
