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

Pick by latency vs. delivery semantics:

- **`unorderedAfterCommit`** — fire-and-forget, parallel dispatch, **after** the DB commits. Best for partitioned destinations (Kafka with a partition key, Redis Streams keyed by tx hash, generic webhooks). Highest throughput; messages only fire for state that actually persisted.
- **`orderedAfterCommit`** — preserves the order in which `context.effect(...)` was called across the batch, dispatched **after** the DB commits. Use for single-stream destinations like a Telegram chat, a Slack channel, or a single Kafka partition.
- **`unordered`** *(lower latency)* — same as `unorderedAfterCommit` but fires **inline within the batch**, in parallel, returning a value. Skip this if your stream must never see a message for a state that was rolled back; pick it if you need the fastest possible push (no wait for DB commit) and your downstream tolerates duplicates on retry.
- **`ordered`** *(lower latency)* — same as `orderedAfterCommit` but fires inline, sequentially, returning a value. Useful when a handler needs the response (e.g. a stream-side ID) before continuing, and you're willing to accept that a failed batch may still produce a delivered message.

Rule of thumb: **start with `*AfterCommit`**. Drop down to `unordered` / `ordered` only when you've measured commit latency as the bottleneck and your consumer is idempotent.

### Supported tools

Each tool has a dedicated page with installation, configuration, and a full handler example:

- [Webhooks](/docs/HyperIndex/streams/webhooks)
- [Kafka](/docs/HyperIndex/streams/kafka)
- [RabbitMQ](/docs/HyperIndex/streams/rabbitmq)
- [AWS SNS / SQS](/docs/HyperIndex/streams/sns-sqs)
- [Redis Streams](/docs/HyperIndex/streams/redis)
- [Cloudflare Queues](/docs/HyperIndex/streams/cloudflare-queues)

Need something else? Anything reachable from Node — gRPC, NATS, Postgres LISTEN/NOTIFY, GCP Pub/Sub, a custom HTTP service — works the same way: install the client, call it from inside an effect.
