---
id: streams-kafka
title: Kafka
sidebar_label: Kafka
slug: /streams/kafka
description: Stream decoded events from HyperIndex to Apache Kafka using the Effect API.
---

Publish decoded events to one or more Kafka topics. Use a partition key to fan out across partitions (with `unorderedAfterCommit`) or pin the topic to a single partition for strict ordering (with `orderedAfterCommit`).

### Installation

```bash
pnpm add kafkajs
```

### Configure the client

```typescript title="src/clients/kafka.ts"
import { Kafka, Partitioners } from "kafkajs";

export const kafka = new Kafka({
  clientId: "envio-indexer",
  brokers: (process.env.KAFKA_BROKERS ?? "").split(","),
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  allowAutoTopicCreation: false,
});

let connected: Promise<void> | undefined;
export const ensureConnected = () => (connected ??= producer.connect());
```

### Define the effect

Topic name is baked into the effect — `input` carries only the partition key and the per-event payload. The effect serialises to JSON internally; the handler passes raw values.

```typescript title="src/effects/kafka.ts"
import { createEffect, S } from "envio";
import { ensureConnected, producer } from "../clients/kafka";

const TOPIC = "rocketpool.transfers";

export const publishTransfer = createEffect(
  {
    name: "publishTransfer",
    input: {
      key: S.string, // partition key
      from: S.string,
      to: S.string,
      value: S.bigint,
      txHash: S.string,
      blockNumber: S.number,
      chainId: S.number,
    },
    rateLimit: { calls: 200, per: "second" },
    // unordered = parallel dispatch, partition order preserved by `key`
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    await ensureConnected();
    const { key, value, ...rest } = input;
    await producer.send({
      topic: TOPIC,
      acks: -1, // "all"
      messages: [
        {
          key,
          value: JSON.stringify({ ...rest, value: value.toString() }),
        },
      ],
    });
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
streams:
  kafka:
    topics:
      - topic: test-topic
        key: my-routing-key
        events:
          - event_name: Transfer
            conditions:
              - "value": ">=2000000000000000000"
              - "from": "0x0338ce5020c447f7e668dc2ef778025ce3982662"
```

…becomes:

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { publishTransfer } from "../effects/kafka";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;

    if (from.toLowerCase() === WHALE && value >= MIN) {
      context.effect(publishTransfer, {
        key: from, // partition by sender so per-sender order is preserved
        from,
        to,
        value,
        txHash: event.transaction.hash,
        blockNumber: event.block.number,
        chainId: context.chain.id,
      });
    }
  },
);
```

### Mode picker

| You need | Mode |
| --- | --- |
| High throughput, partition by key | `unorderedAfterCommit` |
| Strict global order across the whole topic | `orderedAfterCommit` (and a single-partition topic) |
| Lowest latency, idempotent consumer | `unordered` (parallel, inline) or `ordered` (sequential, inline) — fires before the DB commit |

### Raw `fetch` alternative

If you'd rather not pull in `kafkajs`, point the effect at a Kafka REST proxy (e.g. Confluent REST Proxy) and POST JSON instead.
