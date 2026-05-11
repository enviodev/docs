---
id: block-handlers
title: Block Handlers
sidebar_label: Block Handlers 🆕
slug: /block-handlers
description: Learn how to run custom logic on every blockchain block or at set intervals using onBlock.
---

# Block Handlers

Run logic on every block or an interval.

---

`indexer.onBlock` lets you run logic on every block or an interval. This is useful for aggregations and time-series logic.

To get started, import the `indexer` value from `envio` and call `onBlock` in one of your handler files.

```typescript
import { indexer } from "envio";

indexer.onBlock(
  {
    name: "MyBlockHandler",
  },
  async ({ block, context }) => {
    context.log.info(`Processing block ${block.number}`);
  }
);
```

> Block handlers don't require any config changes as well as codegen runs.

In the example above, the handler runs on **every** chain configured in `config.yaml` (the V3 default). To restrict it to a single chain, pass a `where` callback — see below.

## Options

`indexer.onBlock` accepts an options object as the first argument with the following properties:

- `name` (required) — The name of the block handler. It's used for logging, debugging and metrics.
- `where` (optional) — A callback `({ chain }) => false | true | { block: { number: { _gte?, _lte?, _every? } } }` that decides which chains the handler runs on and over which block range/interval. Omit it to run on every chain on every block.

To express the V2-era `chain`, `startBlock`, `endBlock`, and `interval` options, return them from `where`:

```typescript
import { indexer } from "envio";

indexer.onBlock(
  {
    name: "MyBlockHandler",
    where: ({ chain }) => {
      if (chain.id !== 1) return false;
      return {
        block: {
          number: {
            _gte: 19_000_000, // start block (inclusive)
            _lte: 20_000_000, // end block (inclusive)
            _every: 100,      // run every Nth block
          },
        },
      };
    },
  },
  async ({ block, context }) => {
    context.log.info(`Processing block ${block.number}`);
  }
);
```

## Handler Function

:::note
Preload Optimization is always enabled in HyperIndex V3 and powers Block Handlers. Don't forget that it makes your handlers run twice.
:::

The second argument is a handler function that receives the block object and the handler context.

- `block` — The block object.
  - `number` — The block number.
  - More fields will be added in the future. Let us know in [Discord](https://discord.gg/envio) if you need any specific fields. You can also use [Effect API](/docs/HyperIndex/effect-api) to get the data from RPC.
- `context` — Exactly the same as the Event Handlers [Context Object](/docs/HyperIndex/event-handlers#context-object). Use `context.chain.id` to read the current chain ID inside the handler.

## Multichain

By default `indexer.onBlock` runs on every chain in your config. To run different parameters per chain, branch inside the `where` callback:

```typescript
import { indexer } from "envio";

const perChain = {
  1: { startBlock: 19783636, interval: (60 * 60) / 12 }, // Every 60 minutes (12s block time)
  10: { startBlock: 119534316, interval: (60 * 60) / 2 }, // Every 60 minutes (2s block time)
} as const;

indexer.onBlock(
  {
    name: "HourlyPrice",
    where: ({ chain }) => {
      const cfg = perChain[chain.id as keyof typeof perChain];
      if (!cfg) return false;
      return {
        block: {
          number: { _gte: cfg.startBlock, _every: cfg.interval },
        },
      };
    },
  },
  async ({ block, context }) => {
    context.log.info(`Processing block ${block.number} on chain ${context.chain.id}`);
  }
);
```

## Time Interval

The `_every` option is a number of blocks. But quite often you want to run some logic on a time interval. To convert time interval to blocks, you can use the following formula:

```typescript
// Every 60 minutes
const timeIntervalInSeconds = 60 * 60;
// 12 seconds per block
const secondsPerBlock = 12;
// 300 blocks per 60 minutes
const blockInterval = timeIntervalInSeconds / secondsPerBlock;
```

## Different Historical and Realtime Intervals

Here's the recipe to speed up your historical sync by increasing the interval for historical blocks.

You can achieve this by registering multiple block handlers with the same handler, but different `_gte`, `_lte`, and `_every` values.

```typescript
import { indexer } from "envio";

const realtimeBlocks = {
  1: 19783636,
  10: 119534316,
} as const;

indexer.onBlock(
  {
    name: "HistoricalBlockHandler",
    where: ({ chain }) => {
      const realtime = realtimeBlocks[chain.id as keyof typeof realtimeBlocks];
      if (!realtime) return false;
      return { block: { number: { _lte: realtime - 1, _every: 1000 } } };
    },
  },
  async ({ block, context }) => {
    context.log.info(`Processing block ${block.number}`);
  }
);

indexer.onBlock(
  {
    name: "RealtimeBlockHandler",
    where: ({ chain }) => {
      const realtime = realtimeBlocks[chain.id as keyof typeof realtimeBlocks];
      if (!realtime) return false;
      return { block: { number: { _gte: realtime } } };
    },
  },
  async ({ block, context }) => {
    context.log.info(`Processing block ${block.number}`);
  }
);
```

In this case we'll run the historical handler on every 1000 blocks and from the realtime block we'll start running the second handler on every block.

> We recommend exploring the approach together with [HyperSync](/docs/HyperSync/overview) client to effectively query data for big block ranges.

## Preset Handler

This is not an official feature, but a creative way to use block handlers. You can define a block handler that runs on a single block at the start of the chain and use it to populate the database with the initial data.

```typescript
import { indexer } from "envio";

indexer.onBlock(
  {
    name: "Preset",
    where: ({ chain }) => {
      if (chain.id !== 1) return false;
      return { block: { number: { _gte: 0, _lte: 0 } } };
    },
  },
  async ({ block, context }) => {
    // You don't need preload optimization here,
    // so don't forget to disable it to prevent double-run.
    if (context.isPreload) return;

    const users = await fetch("https://api.example.com/users");
    users.forEach((user) => {
      context.User.set({
        id: user.id,
        address: user.address,
        name: user.name,
      });
    });
  }
);
```

## Current Limitations

- Only EVM chains are supported. Currently no support for [Fuel](/docs/HyperIndex/fuel/fuel.md) chains.
- No [test framework](/docs/HyperIndex/testing) support.
- Only block number is provided in the block object. We'll definitely add more fields in the future.
