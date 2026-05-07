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

Account ID, API token, and queue ID are static — bake them in. `input` is just event data.

```typescript title="src/effects/cloudflare.ts"
import { createEffect, S } from "envio";

const QUEUE_ID = "blockchain-transfers";
const ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${process.env.ENVIO_CLOUDFLARE_ACCOUNT_ID}/queues/${QUEUE_ID}/messages`;

export const sendTransfer = createEffect(
  {
    name: "sendTransfer",
    input: {
      from: S.string,
      to: S.string,
      value: S.bigint,
      txHash: S.string,
      chainId: S.number,
    },
    rateLimit: { calls: 100, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ENVIO_CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify({
        body: { ...input, value: input.value.toString() },
        content_type: "json",
      }),
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

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { sendTransfer } from "../effects/cloudflare";

const MIN = 2_000_000_000_000_000_000n;

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;

    if (value >= MIN) {
      context.effect(sendTransfer, {
        from,
        to,
        value,
        txHash: event.transaction.hash,
        chainId: context.chain.id,
      });
    }
  },
);
```

Use `orderedAfterCommit` if your queue consumer relies on per-batch ordering. For lower latency at the cost of commit-safe delivery, switch to `mode: "unordered"` (or `"ordered"`) — the message is sent inline within the batch.
