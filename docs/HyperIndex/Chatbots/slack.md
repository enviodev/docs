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
3. Set `SLACK_WEBHOOK_URL` in your `.env`.

### Define the effect

```typescript title="src/effects/slack.ts"
import { createEffect, S } from "envio";

export const sendSlack = createEffect(
  {
    name: "sendSlack",
    input: {
      text: S.string,
      blocksJson: S.optional(S.string), // JSON-encoded Block Kit array
    },
    rateLimit: { calls: 1, per: "second" }, // Slack: ~1 msg/sec/channel
    mode: "orderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: input.text,
        blocks: input.blocksJson ? JSON.parse(input.blocksJson) : undefined,
      }),
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

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { sendSlack } from "./effects/slack";
import { formatUnits } from "./utils/format";

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (value < 10n || value > 2_000_000_000_000_000_000n) return;

  const text = [
    `*New RETH Transfer Event*`,
    `from: ${from}`,
    `to: ${to}`,
    `amount: ${formatUnits(value, 18)}`,
    `RETH contract: ${event.srcAddress}`,
    `<https://etherscan.io/tx/${event.transaction.hash}|etherscan>`,
  ].join("\n");

  context.effect(sendSlack, { text });
});
```

For richer layouts (buttons, headers, dividers) build a [Block Kit](https://api.slack.com/block-kit) array and pass it as `blocksJson: JSON.stringify(blocks)`.
