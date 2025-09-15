---
id: block-handlers
title: Block Handlers
sidebar_label: Block Handlers 🆕
slug: /block-handlers
---

# Block Handlers (new in v2.29)

Run logic on every block or an interval.

---

Starting from `envio@2.29` we introduced `onBlock` API to be able to run logic on every block or an interval. This is useful for aggregations, time-series logic, and bulk updates using raw SQL.

To get started, import the `onBlock` function from `generated` module and call it in one of your handler files.

```typescript
import { onBlock } from "generated";

onBlock(
  {
    name: "MyBlockHandler",
    chain: 1,
  },
  async ({ block, context }) => {
    context.log.info(`Processing block ${block.number}`);
  }
);
```

> Block handlers don't require any config changes as well as codegen runs.

In the example above, we'll log the block number for every block happening on the Ethereum mainnet.

## Options

The `onBlock` function accepts an options object as the first argument with the following properties:

- `name` (required) - The name of the block handler. It's used for logging, debugging and metrics.
- `chain` (required) - The chain ID of the blockchain to run the block handler on.
- `interval` - The interval of blocks to run the block handler on. Default is `1` - runs on every block.
- `startBlock` - The block number to start the block handler on. Uses the chain start block by default.
- `endBlock` - The block number to end the block handler on. Uses the chain end block by default.

## Handler Function

:::note
Block Handlers require [Preload Optimization](/docs/HyperIndex/preload-optimization) to be enabled. Make sure to enable it in your `config.yaml` file. And don't forget that it makes your handlers run twice.
:::

The second argument is a handler function that receives the block object and the handler context.

- `block` - The block object.
  - `number` - The block number.
  - `chainId` - The chain ID.
  - More fields will be added in the future. Let us know in [Discord](https://discord.gg/envio) if you need any specific fields. You can also use [Effect API](/docs/HyperIndex/effect-api) to get the data from RPC.
- `context` - Exactly the same as the Event Handlers [Context Object](/docs/HyperIndex/event-handlers#context-object).

## Multichain

Currently there's no special API for multichain block handlers. Although using `forEach` is just as nice.

```typescript
import { onBlock } from "generated";

[
  {
    chain: 1 as const,
    startBlock: 19783636,
    interval: (60 * 60) / 12, // Every 60 minutes (12s block time)
  },
  {
    chain: 10 as const,
    startBlock: 119534316,
    interval: (60 * 60) / 2, // Every 60 minutes (2s block time)
  },
].forEach(({ chain, startBlock, interval }) => {
  onBlock(
    {
      name: "HourlyPrice",
      chain,
      startBlock,
      interval,
    },
    async ({ block, context }) => {
      context.log.info(`Processing block ${block.number}`);
    }
  );
});
```

## Time Interval

The `interval` option is a number of blocks. But quite often you want to run some logic on a time interval. To convert time interval to blocks, you can use the following formula:

```typescript
// Every 60 minutes
const timeIntervalInSeconds = 60 * 60;
// 12 seconds per block
const secondsPerBlock = 12;
// 300 blocks per 60 minutes
const blockInterval = timeIntervalInSeconds / secondsPerBlock;
```

## Different Historical and Realtime Intervals

Here's the receipt how to speed up your historical sync, by increasing the interval for historical blocks.

You can achieve this by registering multiple block handlers with the same handler, but different `startBlock`, `endBlock` and `interval` options.

```typescript
import { onBlock } from "generated";

[
  {
    chain: 1 as const,
    realtimeBlock: 19783636,
  },
  {
    chain: 10 as const,
    realtimeBlock: 119534316,
  },
].forEach(({ chain, realtimeBlock }) => {
  onBlock(
    {
      name: "HistoricalBlockHandler",
      chain,
      endBlock: realtimeBlock - 1,
      interval: 1000,
    },
    async ({ block, context }) => {
      context.log.info(`Processing block ${block.number}`);
    }
  );
  onBlock(
    {
      name: "RealtimeBlockHandler",
      chain,
      startBlock: realtimeBlock,
    },
    async ({ block, context }) => {
      context.log.info(`Processing block ${block.number}`);
    }
  );
});
```

In this case we'll run the block handler on every 1000 blocks and from the realtime block we'll start running it on every block.

> We recommend exploring the approach together with [HyperSync](/docs/HyperSync/overview) client to effectively query data for big block ranges.

## Preset Handler

This is not an official feature, but a creative way to use block handlers. You can define a block handler with the `startBlock` and `endBlock` options equal to the start of the chain and use it to populate the database with the initial data.

```typescript
import { onBlock } from "generated";

onBlock(
  {
    name: "Preset",
    chain: 1,
    startBlock: 0,
    endBlock: 0,
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

- Block Handlers require [Preload Optimization](/docs/HyperIndex/preload-optimization) to be enabled.
- The [Ordered Multichain mode](/docs/HyperIndex/multichain-indexing#ordered-mode) is not supported.
- Only EVM chains are supported. Currently no support for [Fuel](/docs/HyperIndex/fuel/fuel.md) chains.
- No [test framework](/docs/HyperIndex/testing) support.
- Only block number is provided in the block object. We'll definitely add more fields in the future.
