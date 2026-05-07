---
id: streams-webhooks
title: Webhooks
sidebar_label: Webhooks
slug: /streams/webhooks
description: Stream decoded events from HyperIndex to a webhook endpoint using the Effect API.
---

Send decoded events to any HTTP endpoint when on-chain conditions are met. No extra dependency required — `fetch` is built into Node.

### Installation

Nothing to install. Use the global `fetch`.

### Define the effect

URL, shared secret, and the `eventName` constant are baked into the effect body — only the values that vary per call go in `input`.

```typescript title="src/effects/webhook.ts"
import { createEffect, S } from "envio";

export const notifyTransfer = createEffect(
  {
    name: "notifyTransfer",
    input: {
      from: S.string,
      to: S.string,
      value: S.bigint,
      txHash: S.string,
      blockNumber: S.number,
      chainId: S.number,
    },
    rateLimit: { calls: 25, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch(process.env.WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-envio-shared-secret": process.env.WEBHOOK_SHARED_SECRET ?? "",
      },
      body: JSON.stringify({
        event: "RocketPoolTransfer",
        ...input,
        value: input.value.toString(),
      }),
    });
    if (!res.ok) {
      context.log.error(`Webhook failed: ${res.status} ${res.statusText}`);
      throw new Error(`Webhook ${res.status}`);
    }
  }
);
```

### Call it from a handler

The rindexer YAML below…

```yaml
events:
  - event_name: Transfer
    conditions:
      - "value": ">=2000000000000000000 && value <=4000000000000000000"
      - "from": "0x0338ce5020c447f7e668dc2ef778025ce3982662"
```

…becomes plain TypeScript:

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { notifyTransfer } from "../effects/webhook";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;
const MAX = 4_000_000_000_000_000_000n;

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;

    if (from.toLowerCase() === WHALE && value >= MIN && value <= MAX) {
      context.effect(notifyTransfer, {
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

Because the effect is `unorderedAfterCommit`, the handler returns immediately — the runtime dispatches the webhook in parallel after the batch's DB commit. You only see a delivered request for state that actually persisted.

### Tips

- Switch to `mode: "orderedAfterCommit"` if your downstream consumer requires per-batch ordering.
- Need lower latency than `*AfterCommit`? Use `mode: "unordered"` (or `"ordered"`) to fire inline within the batch — same parallel/sequential semantics, but the call returns a value and runs before the DB commit. Trades commit-safe delivery for speed; pick it only if your endpoint is idempotent.
- Set `cache: true` on the effect if you also want to skip duplicates across full indexer reruns. By default the effect fires every run.
- Use the rate-limit option to stay under your endpoint's throughput cap.
