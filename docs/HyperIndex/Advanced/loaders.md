---
id: loaders
title: Loaders
sidebar_label: Loaders (Removed)
slug: /loaders
description: Historical reference for the V2 Loaders API, replaced by built-in Preload Optimization in V3.
---

# Loaders Optimization (Removed in V3)

:::warning
The `handlerWithLoader` API and the `loaders` flag in `config.yaml` were removed in HyperIndex V3. [Preload Optimization](/docs/HyperIndex/preload-optimization) is now always on — there is no flag to enable or disable it. This page is kept for historical context and to help V2 projects migrate.
:::

## What Were Loaders?

Loaders were a feature in early V2 versions of HyperIndex that significantly improved database access performance for event handlers.

They worked by implementing the [Preload Optimization](/docs/HyperIndex/preload-optimization) - loading required data upfront before processing events.

The preloaded data would then be available to event handlers through a `loaderReturn` object, eliminating the need for individual database queries during event processing.

In V2, handlers with loaders didn't have a Preload Phase and always ran once. In V3, every handler runs through the Preload Phase automatically, so the dedicated `handlerWithLoader` API and the `loaders:` config flag have both been removed.

The V2 shape looked like this (no longer accepted in V3):

```typescript
// V2 only — removed in V3
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

## How It Works in V3

In V3 the optimization is built in. See [Preload Optimization - How It Works?](/docs/HyperIndex/preload-optimization#how-it-works) for the full mechanics. The two-phase execution is identical to what loaders provided, just without a separate API.

For example, this is how a V2 loader is rewritten as a regular V3 handler — the only thing that changed is that the loader code now lives inline at the top of the handler:

```typescript
// V2 — removed
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

// V3 — Preload Optimization is always on
import { indexer } from "envio";

indexer.onEvent(
  { contract: "ERC20", event: "Transfer" },
  async ({ event, context }) => {
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
  },
);
```

If your project still has `loaders: true` or `preload_handlers: true` in `config.yaml`, remove both fields — V3 will reject them.
