---
id: streams-redis
title: Redis Streams
sidebar_label: Redis Streams
slug: /streams/redis
description: Stream decoded events from HyperIndex to Redis Streams using the Effect API.
---

Push decoded events into a Redis Stream with `XADD`. Pair with consumer groups on the read side for at-least-once processing.

### Installation

```bash
pnpm add ioredis
```

### Configure the client

```typescript title="src/clients/redis.ts"
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_CONNECTION_URI!);
```

### Define the effect

```typescript title="src/effects/redis.ts"
import { createEffect, S } from "envio";
import { redis } from "../clients/redis";

export const xaddRedis = createEffect(
  {
    name: "xaddRedis",
    input: {
      stream: S.string,
      payload: S.string, // JSON-encoded
    },
    rateLimit: { calls: 500, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    await redis.xadd(input.stream, "*", "data", input.payload);
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
streams:
  redis:
    streams:
      - stream_name: "ethereum_rocketpool_transfer_stream"
        events:
          - event_name: Transfer
            conditions:
              - "value": ">=2000000000000000000 && value <=4000000000000000000"
              - "from": "0x0338ce5020c447f7e668dc2ef778025ce3982662"
```

…becomes:

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { xaddRedis } from "./effects/redis";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;
const MAX = 4_000_000_000_000_000_000n;

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (from.toLowerCase() === WHALE && value >= MIN && value <= MAX) {
    context.effect(xaddRedis, {
      stream: "ethereum_rocketpool_transfer_stream",
      payload: JSON.stringify({
        from,
        to,
        value: value.toString(),
        txHash: event.transaction.hash,
        blockNumber: event.block.number,
      }),
    });
  }
});
```

Redis Streams already give you total ordering per stream (the `*` ID is monotonically increasing), so `unorderedAfterCommit` is fine here — concurrent `XADD`s within a batch will simply interleave by arrival time. Use `orderedAfterCommit` only if downstream consumers expect strict handler-order across the batch.
