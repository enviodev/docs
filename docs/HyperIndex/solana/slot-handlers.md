---
id: solana-slot-handlers
title: Solana Slot Handlers
sidebar_label: Slot Handlers
slug: /solana/slot-handlers
description: Run logic on every Solana slot or an interval with indexer.onSlot, and enrich it with RPC data via the Effect API.
---

# Slot Handlers

`indexer.onSlot` runs logic on every slot or at an interval — the Solana
equivalent of EVM [block handlers](/docs/HyperIndex/block-handlers). Use it for
time-series snapshots, periodic aggregations, or pulling extra data from RPC on a
schedule with the [Effect API](/docs/HyperIndex/effect-api). For indexing program
activity, reach for [instruction handlers](/docs/HyperIndex/solana/instruction-handlers)
instead.

```typescript
import { indexer } from "envio";

indexer.onSlot({ name: "MySlotHandler" }, async ({ slot, context }) => {
  context.log.info(`Processing slot ${slot}`);
});
```

Slot handlers **self-register** — they need no entry in `config.yaml` beyond the
chain itself. With no `where`, the handler runs on every slot.

## Options

`indexer.onSlot(options, handler)`:

- **`name`** (required) — unique name, used for logging, metrics, and progress tracking.
- **`where`** (optional) — `({ chain }) => false | true | { slot: { _gte?, _lte?, _every? } }`. Evaluated once per chain at registration to decide which chains the handler runs on and over which slot range/interval.

```typescript
indexer.onSlot(
  {
    name: "SlotSampler",
    where: ({ chain }) =>
      chain.id === 0
        ? {
            slot: {
              _gte: 385_453_000, // start slot (inclusive)
              _lte: 385_500_000, // end slot (inclusive)
              _every: 100,       // every 100th slot
            },
          }
        : false,
  },
  async ({ slot, context }) => {
    context.SlotPing.set({ id: slot.toString(), slot });
  },
);
```

:::note Differences from EVM `onBlock`
- The handler argument is `{ slot: number, context }` — a plain slot number, **not** a `block` object.
- The filter key is `slot` (with `_gte` / `_lte` / `_every`), not `block.number`.
- There's no `interval` option; express intervals with `_every`. `_every` aligns to `_gte` (or the chain start) — it fires when `(slot − _gte) % _every === 0`.
:::

## The handler

The handler receives `{ slot, context }`:

- **`slot`** — the slot number being processed (a plain `number`).
- **`context`** — entity operations (one object per `schema.graphql` entity, with `get` / `getOrThrow` / `getWhere` / `getOrCreate` / `set` / `deleteUnsafe`), plus `context.log`, `context.effect`, `context.chain` (`id` is `0` for Solana), and `context.isPreload`. This is the same context as EVM handlers — see the [Event Handlers context](/docs/HyperIndex/event-handlers#context-object).

## Enriching with RPC data via Effects

A slot number alone is rarely enough — pair `onSlot` with an
[Effect](/docs/HyperIndex/effect-api) to fetch block/transaction/account data from
RPC. Effects are deduplicated and cached, and can be rate-limited so you don't
exhaust your RPC provider. `S` (from `envio`) builds the input/output schemas
(it's the [Sury](https://github.com/DZakh/sury) library).

```typescript
import { indexer, createEffect, S } from "envio";

const blockSchema = S.schema({
  blockhash: S.string,
  blockHeight: S.nullable(S.number),
  blockTime: S.nullable(S.number),
});

const getBlock = createEffect(
  {
    name: "getBlock",
    input: { slot: S.number },
    output: S.nullable(blockSchema),
    rateLimit: { calls: 3, per: "second" },
  },
  async ({ input }) => {
    const res = await fetch(process.env.ENVIO_MAINNET_RPC_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBlock",
        params: [input.slot, { maxSupportedTransactionVersion: 1, transactionDetails: "none" }],
      }),
    });
    const { result } = await res.json();
    return result ?? null;
  },
);

indexer.onSlot({ name: "BlockTracker" }, async ({ slot, context }) => {
  const block = await context.effect(getBlock, { slot });
  if (!block) {
    context.log.info(`Slot ${slot} has no block (skipped leader)`);
    return; // some slots produce no block
  }
  context.BlockInfo.set({
    id: slot.toString(),
    hash: block.blockhash,
    height: block.blockHeight ?? undefined,
    time: block.blockTime ? new Date(block.blockTime * 1000) : undefined,
  });
});
```

:::tip Not every slot has a block
On Solana a slot may be skipped (the leader produced no block). Handle the empty
result rather than assuming `getBlock` always returns data.
:::

### Preload double-run

Like all V3 handlers, slot handlers run twice (a parallel preload pass to warm the
cache, then the ordered pass). Effects are cached across both runs, so reads are
cheap, but guard non-idempotent side effects with `if (context.isPreload) return;`.
See [Preload Optimization](/docs/HyperIndex/preload-optimization).

## Slot handlers vs instruction handlers

| | Slot handler | Instruction handler |
| --- | --- | --- |
| Trigger | Every slot / interval | A matched program instruction |
| Data source | RPC (via Effects) | HyperSync |
| Config needed | None (self-registers) | `experimental.programs` entry |
| Best for | Time-series, snapshots, scheduled pulls | Decoding protocol activity |

Reach for [instruction handlers](/docs/HyperIndex/solana/instruction-handlers) to
index *what programs did*, and slot handlers to do something *on a cadence*. They
compose — an instruction handler can record an event, and a slot handler can
periodically roll those events into a snapshot. For raw, low-level data over large
ranges, query [HyperSync for Solana](/docs/HyperSync/solana) directly.

## Related

- [Instruction Handlers](/docs/HyperIndex/solana/instruction-handlers) — the main Solana handler type.
- [Effect API](/docs/HyperIndex/effect-api) — external/RPC calls, caching, rate limiting.
- [Configuration](/docs/HyperIndex/solana/configuration) — chains, RPC, programs, and start slot.
