---
id: chatbots-discord
title: Discord
sidebar_label: Discord
slug: /chatbots/discord
description: Send Discord messages from HyperIndex handlers using the Effect API.
---

Post messages to a Discord channel using either an [incoming webhook](https://support.discord.com/hc/en-us/articles/228383668) (simplest) or a bot token. Both work with raw `fetch`.

### Channel setup

1. Channel **Settings → Integrations → Webhooks → New Webhook**.
2. Copy the webhook URL.
3. Set `DISCORD_WEBHOOK_URL` in your `.env`.

### Define the effect

```typescript title="src/effects/discord.ts"
import { createEffect, S } from "envio";

export const sendDiscord = createEffect(
  {
    name: "sendDiscord",
    input: {
      content: S.string,
      embedsJson: S.optional(S.string), // JSON-encoded embeds array
    },
    rateLimit: { calls: 5, per: "second" }, // Discord webhook limit
    mode: "orderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: input.content,
        embeds: input.embedsJson ? JSON.parse(input.embedsJson) : undefined,
        allowed_mentions: { parse: [] },
      }),
    });
    if (!res.ok) {
      context.log.error(`Discord failed: ${res.status} ${await res.text()}`);
      throw new Error(`Discord ${res.status}`);
    }
  }
);
```

### Call it from a handler

The rindexer template…

```yaml
chat:
  discord:
    - messages:
        - event_name: Transfer
          filter_expression: "value >= 10 && value <= 2000000000000000000"
          template_inline: |
            *New RETH Transfer Event*
            from: {{from}}
            to: {{to}}
            amount: {{format_value(value, 18)}}
            contract: {{transaction_information.address}}
            [etherscan](https://etherscan.io/tx/{{transaction_information.transaction_hash}})
```

…becomes:

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { sendDiscord } from "./effects/discord";
import { formatUnits } from "./utils/format";

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (value < 10n || value > 2_000_000_000_000_000_000n) return;

  context.effect(sendDiscord, {
    content: "**New RETH Transfer Event**",
    embedsJson: JSON.stringify([
      {
        title: `${formatUnits(value)} RETH transferred`,
        url: `https://etherscan.io/tx/${event.transaction.hash}`,
        fields: [
          { name: "From", value: from, inline: true },
          { name: "To", value: to, inline: true },
          { name: "Contract", value: event.srcAddress },
        ],
      },
    ]),
  });
});
```

Discord embeds give you richer formatting than plain text — fields, colors, thumbnails — without any extra dependency. If you'd rather keep things simple, just send `content` as a markdown string and skip `embeds`.
