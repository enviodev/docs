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

```typescript title="src/effects/webhook.ts"
import { createEffect, S } from "envio";

export const sendWebhook = createEffect(
  {
    name: "sendWebhook",
    input: {
      eventName: S.string,
      payload: S.string, // JSON-encoded body
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
      body: input.payload,
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

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { sendWebhook } from "./effects/webhook";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;
const MAX = 4_000_000_000_000_000_000n;

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (from.toLowerCase() === WHALE && value >= MIN && value <= MAX) {
    context.effect(sendWebhook, {
      eventName: "RocketPoolTransfer",
      payload: JSON.stringify({
        network: event.chainId,
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

Because the effect is `unorderedAfterCommit`, the handler returns immediately — the runtime dispatches the webhook in parallel after the batch's DB commit. You only see a delivered request for state that actually persisted.

### Tips

- Switch to `mode: "orderedAfterCommit"` if your downstream consumer requires per-batch ordering.
- Set `cache: true` on the effect if you also want to skip duplicates across full indexer reruns. By default the effect fires every run.
- Use the rate-limit option to stay under your endpoint's throughput cap.
