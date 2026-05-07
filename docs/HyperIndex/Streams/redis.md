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

Stream name is static — bake it in. `input` is just event data.

```typescript title="src/effects/redis.ts"
import { createEffect, S } from "envio";
import { redis } from "../clients/redis";

const STREAM = "ethereum_rocketpool_transfer_stream";

export const xaddTransfer = createEffect(
  {
    name: "xaddTransfer",
    input: {
      from: S.string,
      to: S.string,
      value: S.bigint,
      txHash: S.string,
      blockNumber: S.number,
    },
    rateLimit: { calls: 500, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    const data = JSON.stringify({ ...input, value: input.value.toString() });
    await redis.xadd(STREAM, "*", "data", data);
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

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { xaddTransfer } from "../effects/redis";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;
const MAX = 4_000_000_000_000_000_000n;

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;

    if (from.toLowerCase() === WHALE && value >= MIN && value <= MAX) {
      context.effect(xaddTransfer, {
        from,
        to,
        value,
        txHash: event.transaction.hash,
        blockNumber: event.block.number,
      });
    }
  },
);
```

Redis Streams already give you total ordering per stream (the `*` ID is monotonically increasing), so `unorderedAfterCommit` is fine here — concurrent `XADD`s within a batch will simply interleave by arrival time. Use `orderedAfterCommit` only if downstream consumers expect strict handler-order across the batch. For lowest latency, switch to `mode: "unordered"` so the `XADD` runs inline within the batch — fastest, but a failed batch can leave entries in the stream that no longer reflect committed state.
