---
id: streams-cloudflare-queues
title: Cloudflare Queues
sidebar_label: Cloudflare Queues
slug: /streams/cloudflare-queues
description: Stream decoded events from HyperIndex to Cloudflare Queues using the Effect API.
---

Cloudflare Queues exposes a [REST API](https://developers.cloudflare.com/api/operations/queue-publish-message) for sending messages, so no SDK is required — just `fetch`.

### Installation

Nothing to install.

### Define the effect

```typescript title="src/effects/cloudflare.ts"
import { createEffect, S } from "envio";

const ENDPOINT = (queueId: string) =>
  `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/queues/${queueId}/messages`;

export const sendToCloudflareQueue = createEffect(
  {
    name: "sendToCloudflareQueue",
    input: {
      queueId: S.string,
      body: S.string, // JSON-encoded
    },
    rateLimit: { calls: 100, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch(ENDPOINT(input.queueId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify({ body: input.body, content_type: "json" }),
    });
    if (!res.ok) {
      context.log.error(`CF Queues failed: ${res.status} ${await res.text()}`);
      throw new Error(`CF Queues ${res.status}`);
    }
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
streams:
  cloudflare_queues:
    queues:
      - queue_id: blockchain-transfers
        events:
          - event_name: Transfer
            conditions:
              - "value": ">=2000000000000000000"
```

…becomes:

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { sendToCloudflareQueue } from "./effects/cloudflare";

const MIN = 2_000_000_000_000_000_000n;

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (value >= MIN) {
    context.effect(sendToCloudflareQueue, {
      queueId: "blockchain-transfers",
      body: JSON.stringify({
        from,
        to,
        value: value.toString(),
        txHash: event.transaction.hash,
        chainId: event.chainId,
      }),
    });
  }
});
```

Use `orderedAfterCommit` if your queue consumer relies on per-batch ordering.
