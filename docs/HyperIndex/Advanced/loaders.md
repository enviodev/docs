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

This approach can reduce thousands of database calls to just a handful, dramatically improving indexing performance. And using the Effect API, you can parallelize external calls and make the indexing process more efficient.

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

3. On each event of the batch its loader will be run a second time and then pass the result to the handler. This step is sequential.

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
3. Keep handler functions focused on business logic
4. Use concurrent requests when loading multiple unrelated entities

### Beware of Double Run Footgun

In the example below, the loader will be run twice (once at the start of the batch and once during the processing of each event).
This means that the "sender" `Account` entity may not exist yet on the first run of the loader.

During the processing of the batch, another handler may set it before it is available.

```typescript
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    const sender = await context.Account.get(event.params.from);

    // BE CAREFUL HERE
    // The loader will be run twice and sender may not exist on the first run
    if (!sender) {
      throw new Error(`Sender account not found: ${event.params.from}`);
    }

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

The example above could crash unnecessarily. If you want to achieve this behaviour you should rather throw the error in the handler.

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

Now the indexer behaves as expected. The indexer will only crash if the "sender" `Account` entity was actually not set in an event preceding the one being processed.

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
