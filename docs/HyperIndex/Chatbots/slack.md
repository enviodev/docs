---
id: chatbots-slack
title: Slack
sidebar_label: Slack
slug: /chatbots/slack
description: Send Slack messages from HyperIndex handlers using the Effect API.
---

Post to a Slack channel using either an [incoming webhook](https://api.slack.com/messaging/webhooks) (no SDK needed) or the [Web API](https://api.slack.com/web) with `@slack/web-api`. The webhook flow is shown below.

### Channel setup

1. Create a Slack app and enable **Incoming Webhooks**.
2. Add a new webhook for the target channel and copy the URL.
3. Set `ENVIO_SLACK_WEBHOOK_URL` in your `.env`.

### Define the effect

Webhook URL is baked in. The message string is built inside the effect — `input` is just raw event data.

```typescript title="src/effects/slack.ts"
import { createEffect, S } from "envio";

const formatUnits = (value: bigint, decimals = 18) => {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  if (frac === 0n) return whole.toString();
  return `${whole}.${frac.toString().padStart(decimals, "0").replace(/0+$/, "")}`;
};

export const notifyTransfer = createEffect(
  {
    name: "notifyTransfer",
    input: {
      from: S.string,
      to: S.string,
      value: S.bigint,
      contract: S.string,
      txHash: S.string,
    },
    rateLimit: { calls: 1, per: "second" }, // Slack: ~1 msg/sec/channel
    mode: "orderedAfterCommit",
  },
  async ({ input, context }) => {
    const text = [
      `*New RETH Transfer Event*`,
      `from: ${input.from}`,
      `to: ${input.to}`,
      `amount: ${formatUnits(input.value, 18)}`,
      `RETH contract: ${input.contract}`,
      `<https://etherscan.io/tx/${input.txHash}|etherscan>`,
    ].join("\n");

    const res = await fetch(process.env.ENVIO_SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      context.log.error(`Slack failed: ${res.status} ${await res.text()}`);
      throw new Error(`Slack ${res.status}`);
    }
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
chat:
  slack:
    - bot_token: ${SLACK_BOT_TOKEN}
      channel: "#RethTransferEvents"
      messages:
        - event_name: Transfer
          filter_expression: "value >= 10 && value <= 2000000000000000000"
          template_inline: |
            *New RETH Transfer Event*
            from: {{from}}
            to: {{to}}
            amount: {{format_value(value, 18)}}
            RETH contract: {{transaction_information.address}}
            <https://etherscan.io/tx/{{transaction_information.transaction_hash}}|etherscan>
```

…becomes:

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { notifyTransfer } from "../effects/slack";

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;

    if (value < 10n || value > 2_000_000_000_000_000_000n) return;

    context.effect(notifyTransfer, {
      from,
      to,
      value,
      contract: event.srcAddress,
      txHash: event.transaction.hash,
    });
  },
);
```

For richer layouts (buttons, headers, dividers) build a [Block Kit](https://api.slack.com/block-kit) array inside the effect body and add it to the request as `blocks`. If you need lower latency, switch the effect to `mode: "ordered"` — the message is posted inline within the batch instead of after the DB commit.
