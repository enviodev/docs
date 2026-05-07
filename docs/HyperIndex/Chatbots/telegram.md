---
id: chatbots-telegram
title: Telegram
sidebar_label: Telegram
slug: /chatbots/telegram
description: Send Telegram messages from HyperIndex handlers using the Effect API.
---

Send Telegram messages from your handlers via the [Bot API](https://core.telegram.org/bots/api). No SDK required — just `fetch`.

### Bot setup

1. Open [@BotFather](https://t.me/BotFather) in Telegram, run `/newbot`, and copy the bot token.
2. Add the bot to a chat (or DM it) and grab the chat ID. The simplest way is to send any message and visit `https://api.telegram.org/bot<token>/getUpdates` — `chat.id` is in the JSON.
3. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in your `.env`.

### Define the effect

Bot token and chat ID are static — bake them in. The handler hands the effect raw values; the message string is built inside the effect body.

```typescript title="src/effects/telegram.ts"
import { createEffect, S } from "envio";

const ENDPOINT = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

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
    rateLimit: { calls: 25, per: "second" }, // Telegram limits ~30 msg/sec globally
    mode: "orderedAfterCommit", // human-readable feed → keep order
  },
  async ({ input, context }) => {
    const text = [
      `*New RETH Transfer Event*`,
      `from: ${input.from}`,
      `to: ${input.to}`,
      `amount: ${formatUnits(input.value, 18)}`,
      `RETH contract: ${input.contract}`,
      `[etherscan](https://etherscan.io/tx/${input.txHash})`,
    ].join("\n");

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      context.log.error(`Telegram failed: ${res.status} ${await res.text()}`);
      throw new Error(`Telegram ${res.status}`);
    }
  }
);

const formatUnits = (value: bigint, decimals = 18) => {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  if (frac === 0n) return whole.toString();
  return `${whole}.${frac.toString().padStart(decimals, "0").replace(/0+$/, "")}`;
};
```

### Call it from a handler

The rindexer config…

```yaml
chat:
  telegram:
    - bot_token: ${TELEGRAM_BOT_TOKEN}
      chat_id: -4223616270
      messages:
        - event_name: Transfer
          filter_expression: "value >= 10 && value <= 2000000000000000000"
          template_inline: |
            *New RETH Transfer Event*
            from: {{from}}
            to: {{to}}
            amount: {{format_value(value, 18)}}
            RETH contract: {{transaction_information.address}}
            [etherscan](https://etherscan.io/tx/{{transaction_information.transaction_hash}})
```

…becomes a regular handler with a template literal:

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { notifyTransfer } from "../effects/telegram";

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

### Lower latency

If a delay between the on-chain event and the Telegram message is a problem (e.g. you're driving an alerting bot), switch the effect to `mode: "ordered"` — the runtime fires it inline within the batch instead of waiting for the DB commit. The tradeoff: a failed batch may still produce a delivered message, so retries on the next run are duplicates.

### Multiple chats / multiple alerts

If you need to route to different chat IDs, define one effect per destination — each bakes in its own chat ID and message template — and pick the right one in the handler. A small factory keeps this DRY:

```typescript title="src/effects/telegram.ts"
const sendTo = (chatId: string, label: string) =>
  createEffect(
    {
      name: `telegram:${label}`,
      input: { value: S.bigint },
      rateLimit: { calls: 25, per: "second" },
      mode: "orderedAfterCommit",
    },
    async ({ input }) => {
      await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `${label}: ${formatUnits(input.value)} RETH`,
          parse_mode: "Markdown",
        }),
      });
    },
  );

export const whaleAlert = sendTo(process.env.TELEGRAM_WHALE_CHAT_ID!, "🐋 Whale");
export const notableAlert = sendTo(process.env.TELEGRAM_NOTABLE_CHAT_ID!, "Heads up");
```

```typescript title="src/handlers/RocketPoolETH.ts"
if (value >= 1_000_000_000_000_000_000_000n) {
  context.effect(whaleAlert, { value });
} else if (value >= 100_000_000_000_000_000_000n) {
  context.effect(notableAlert, { value });
}
```

Keeping each destination in its own effect avoids passing `chatId` through `input` (which would defeat dedup and clutter the call site).
