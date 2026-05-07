---
id: streams-rabbitmq
title: RabbitMQ
sidebar_label: RabbitMQ
slug: /streams/rabbitmq
description: Stream decoded events from HyperIndex to RabbitMQ exchanges using the Effect API.
---

Publish decoded events to a RabbitMQ exchange — `direct`, `topic`, or `fanout` — using `amqplib`.

### Installation

```bash
pnpm add amqplib
pnpm add -D @types/amqplib
```

### Configure the client

```typescript title="src/clients/rabbitmq.ts"
import amqp from "amqplib";

let chanPromise: Promise<amqp.Channel> | undefined;

export const getChannel = () =>
  (chanPromise ??= (async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL!);
    const ch = await conn.createChannel();
    await ch.assertExchange("transfer", "direct", { durable: true });
    return ch;
  })());
```

### Define the effect

```typescript title="src/effects/rabbitmq.ts"
import { createEffect, S } from "envio";
import { getChannel } from "../clients/rabbitmq";

export const publishToRabbit = createEffect(
  {
    name: "publishToRabbit",
    input: {
      exchange: S.string,
      routingKey: S.string,
      body: S.string,
    },
    rateLimit: { calls: 200, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    const ch = await getChannel();
    ch.publish(
      input.exchange,
      input.routingKey,
      Buffer.from(input.body),
      { contentType: "application/json", persistent: true }
    );
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
streams:
  rabbitmq:
    exchanges:
      - exchange: transfer
        exchange_type: direct
        routing_key: my-routing-key
        events:
          - event_name: Transfer
            conditions:
              - "value": ">=2000000000000000000 && value <=4000000000000000000"
              - "from": "0x0338ce5020c447f7e668dc2ef778025ce3982662"
```

…becomes:

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { publishToRabbit } from "./effects/rabbitmq";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;
const MAX = 4_000_000_000_000_000_000n;

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (from.toLowerCase() === WHALE && value >= MIN && value <= MAX) {
    context.effect(publishToRabbit, {
      exchange: "transfer",
      routingKey: "my-routing-key",
      body: JSON.stringify({
        from,
        to,
        value: value.toString(),
        txHash: event.transaction.hash,
      }),
    });
  }
});
```

Pick `orderedAfterCommit` if your consumer needs strict per-batch ordering. For `fanout` exchanges, leave `routingKey` as an empty string.
