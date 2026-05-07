---
id: streams
title: Streams
sidebar_label: Overview
slug: /streams
description: Stream decoded blockchain events from HyperIndex to Webhooks, Kafka, RabbitMQ, SNS/SQS, Redis Streams, or Cloudflare Queues.
---

HyperIndex can publish decoded events to any external system from inside your handlers. Streams are not a separate subsystem — they're [Effects](/docs/HyperIndex/effect-api) running in `unorderedAfterCommit` or `orderedAfterCommit` mode, which means:

- The send fires **after** the batch's database transaction commits, so a reorg or a failed batch never produces a phantom message.
- You write **normal handler code** to decide what to send and when. There is no separate YAML for filters or routing — you call `context.effect(...)` inside an `if` block, just like any other branching logic.
- You can install and configure any client SDK you want (`kafkajs`, `ioredis`, `amqplib`, `@aws-sdk/client-sns`, …) or just use raw `fetch`. The Effect API only cares about the function body.

### Comparison with rindexer

| rindexer | HyperIndex |
| --- | --- |
| YAML `streams:` block per contract | A `createEffect({ mode: "unorderedAfterCommit" \| "orderedAfterCommit" })` definition |
| `conditions:` mini-language with `>=`, `&&`, `\|\|` | Plain TypeScript `if (...)` in your handler |
| `template_inline` Mustache-style templates | Template literals / any string-building code you want |
| Per-provider client baked into the binary | Use any npm package, or raw `fetch` |
| Fires per event, no DB-commit guarantee | Fires after DB commit, so streams reflect persisted state |

### Choosing a mode

- **`unorderedAfterCommit`** — fire-and-forget, parallel dispatch. Best for partitioned destinations (Kafka with a partition key, Redis Streams keyed by tx hash, generic webhooks).
- **`orderedAfterCommit`** — preserves the order in which `context.effect(...)` was called across the batch. Use for single-stream destinations like a Telegram chat, a Slack channel, or a single Kafka partition.

### Supported tools

Each tool has a dedicated page with installation, configuration, and a full handler example:

- [Webhooks](/docs/HyperIndex/streams/webhooks)
- [Kafka](/docs/HyperIndex/streams/kafka)
- [RabbitMQ](/docs/HyperIndex/streams/rabbitmq)
- [AWS SNS / SQS](/docs/HyperIndex/streams/sns-sqs)
- [Redis Streams](/docs/HyperIndex/streams/redis)
- [Cloudflare Queues](/docs/HyperIndex/streams/cloudflare-queues)

Need something else? Anything reachable from Node — gRPC, NATS, Postgres LISTEN/NOTIFY, GCP Pub/Sub, a custom HTTP service — works the same way: install the client, call it from inside an effect.
