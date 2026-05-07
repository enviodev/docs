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

Webhook URL is baked into the effect. The embed is built inside the effect body — `input` is just raw event data.

```typescript title="src/effects/discord.ts"
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
    rateLimit: { calls: 5, per: "second" }, // Discord webhook limit
    mode: "orderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "**New RETH Transfer Event**",
        embeds: [
          {
            title: `${formatUnits(input.value)} RETH transferred`,
            url: `https://etherscan.io/tx/${input.txHash}`,
            fields: [
              { name: "From", value: input.from, inline: true },
              { name: "To", value: input.to, inline: true },
              { name: "Contract", value: input.contract },
            ],
          },
        ],
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

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { notifyTransfer } from "../effects/discord";

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

Discord embeds give you richer formatting than plain text — fields, colors, thumbnails — without any extra dependency. If you'd rather keep things simple, replace `embeds` with a markdown `content` string. For lower latency, switch the effect to `mode: "ordered"` (or `"unordered"` if order doesn't matter) — Discord is rate-limited so the gain is small, but it skips the wait for the DB commit.
