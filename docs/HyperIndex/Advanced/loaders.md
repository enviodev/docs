---
id: loaders
title: Loaders
sidebar_label: Loaders (Deprecated)
slug: /loaders
description: Learn how Loaders improved database access performance for event handlers.
---

# Loaders Optimization (Deprecated)

:::warning
Loaders are a predecessor of [Preload Optimization](/docs/HyperIndex/preload-optimization). We recommend using [Preload Optimization](/docs/HyperIndex/preload-optimization) instead of loaders. This guide is kept for historical purposes.
:::

## What Are Loaders?

Loaders were a feature in early versions of HyperIndex that significantly improved database access performance for event handlers.

They worked by implementing the [Preload Optimization](/docs/HyperIndex/preload-optimization) - loading required data upfront before processing events.

The preloaded data would then be available to event handlers through a `loaderReturn` object, eliminating the need for individual database queries during event processing.

Compared to the current [Preload Optimization](/docs/HyperIndex/preload-optimization) approach, handlers with loaders didn't have the Preload Phase, and always ran once.

```typescript
ContractName.EventName.handlerWithLoader({
  // The loader function runs before event processing starts
  loader: async ({ event, context }) => {
    // Load all required data from the database
    // Return the data needed for event processing
    return {}; // This will be available in the handler as loaderReturn
  },

  // The handler function processes each event with pre-loaded data
  handler: async ({ event, context, loaderReturn }) => {
    // Process the event using the data returned by the loader
  },
});
```

## How It Works?

Find more information about how Loaders work by reading the [Preload Optimization - How It Works?](/docs/HyperIndex/preload-optimization#how-it-works) guide. Loaders share the same concept, but with a different API.

For example, this is how a loader can be turned into a handler with Preload Optimization enabled:

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
