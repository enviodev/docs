---
id: loaders
title: Loaders
sidebar_label: Loaders
slug: /loaders
---

## Overview

Loaders provide an efficient way to define and load entities from the database, optimizing performance by minimizing I/O operations. They also enable you to load arrays of entities based on specific field values.

Loaders are designed to reduce I/O, which is often the primary performance bottleneck in an indexer. By using loaders, you can group multiple requests into a single database round trip before processing a batch of events. The retrieved values are cached in memory, allowing the batch to be processed entirely in memory.

## Example: Refactoring a Simple Handler

Let's explore how to convert a basic handler to use a loader. Below is an example of a handler that loads values at runtime, on demand. Note: Built-in caching still ensures that reloading the same value multiple times in a batch doesn't result in multiple database hits.

```ts
ERC20.Transfer.handler(async ({ event, context }) => {
  const sender = await context.Account.get(event.params.from);
  const receiver = await context.Account.get(event.params.to);
  // ...Logic to update sender and receiver accounts
});
```

### Refactoring with a Loader

Now, let's refactor this handler to use a loader:

```ts
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    const sender = await context.Account.get(event.params.from);
    const receiver = await context.Account.get(event.params.to);
    // Return whatever you like from the loader,
    // it will be the value you get in your loaderReturn
    return {
      sender,
      receiver,
    };
  },
  handler: async ({ event, context, loaderReturn }) => {
    const { sender, receiver } = loaderReturn;
    // ...Logic to update sender and receiver accounts
  },
});
```

In this example, we're using `handlerWithLoader` instead of `handler` and passing it an object with `loader` and `handler` properties. The `loader` is an asynchronous function that receives `event` and `context` as arguments. The `event` is the same value passed to the handler, and you interact with the `context` just as you would in a standard handler. The value returned by the loader is passed to the `loaderReturn` property in the handler.

Before processing a batch of events, all corresponding loaders are executed. The indexer attempts to load all the required entities into memory with as few database round trips as possible. Once all the loaders have run, the handlers for the batch are then executed, using the data loaded into memory.

### Optimizing for Concurrency

We can further improve this by maximizing concurrency. For instance, both the "sender" and "receiver" accounts can be requested concurrently and awaited at the top level. This approach ensures that both requests are made in the same round trip to the database.

```ts
ERC20.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    const [sender, receiver] = await Promise.all([
      context.Account.get(event.params.from),
      context.Account.get(event.params.to),
    ]);
    // Return whatever you like from the loader,
    // it will be the value you get in your loaderReturn
    return {
      sender,
      receiver,
    };
  },
  // ...handler code
});
```

## Querying by Field

Another useful application of loaders is with `getWhere` queries, which allow you to query arrays of entities by field values. These queries can be applied to any entity with a field used as a relationship from a [`@derivedFrom`](schema/#defining-one-to-many-relationships) directive or if the field has an [`@index`](database-performance-optimization/#creating-custom-indices) directive.

For example, to iterate over all `Approval` entities where the `owner_id` field equals a specific value:

```ts
ERC20.Approval.handlerWithLoader({
  loader: async ({ event, context }) => {
    const currentOwnerApprovals = await context.Approval.getWhere.owner_id.eq(
      event.params.owner,
    );

    return { currentOwnerApprovals };
  },
  handler: async ({ event, context, loaderReturn }) => {
    const { currentOwnerApprovals } = loaderReturn;

    for (const ownerApproval of currentOwnerApprovals) {
      // iterate over currentOwnerApprovals
    }
  },
});
```

**Note:** These types of queries can be very resource-intensive and are not recommended for performance-critical applications. They are currently unrestricted, meaning that if a query is too large, it can easily cause an "out of memory" error, as all processing happens in memory.
