---
id: loaders
title: Loaders
sidebar_label: Loaders
slug: /loaders
---

Loaders are a way to define the entities that you want to load from the database in a way that can be optimized. They also provide a way to load arrays of entities based on field values of those entities.

Loaders are designed to minimize I/O which is the biggest performance bottleneck of an indexer. The indexer will process all events in batches and if you load all your entities via a "loader", it will be able to group all of the requests defined in your loader into one round trip to the database before the batch is processed. These values will be cached in an in memory store so the batch can be processed entirely in memory.

Lets look at an example of converting a simple handler to using a loader. Here is a handler which loads in values at runtime, on demand. Note: Caching is built in so reloading the same value multiple times in a batch will not result in multiple hits to the database.

```ts
ERC20.Transfer.handler(async ({ event, context }) => {
  const sender = await context.Account.get(event.params.from);
  const receiver = await context.Account.get(event.params.to);
  // ...Logic to update sender and receiver accounts
});
```

Now lets refactor this to using a loader:

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

In this example we are calling `handlerWithLoader` rather than just `handler` and passing it an object with `loader` and `handler` properties. The `loader` is also an async function that takes an argument with props of event and context. The `event` is the same value that will be passed to the handler. And you interact with the `context` in the same way as you do in a handler. Whatever value is returned from your loader will be the value passed to the `loaderReturn` property in your handler.

Before your each `handler` gets run on a batch of events, each `loader` will be run and the indexer will try to load all the required entities into memory with as few database roundtrips as possible.

We can improve this even further by ensuring that we maximise on concurrency where possible. For example both "receiver" and "sender" accounts can be requested concurrently and then awaited at a top level. This would ensure that both requests are made in the same roundtrip to the database.

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

## Query By Field

Another use case for loaders is `getWhere` queries which allow you to query arrays of entities by field values. These can be applied to any entity that has a field used as a relationship from a [`@derivedFrom`](schema/#defining-one-to-many-relationships) directive or if the field has an [`@index`](database-performance-optimization/#creating-custom-indices) directive. For example if we wanted to iterate over all `Approval` entities where the `owner_id` field is equal to the value passed:

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
      //iterate over currentOwnerApprovals
    }
  },
});
```

Please note that these kinds of queries are very heavy and not recommended for performance. They are also currently unrestricted meaning that if you make a query too large you can quite easily get an "out of memory" error since all processing happens in memory.
