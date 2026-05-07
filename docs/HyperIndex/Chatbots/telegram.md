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

```typescript title="src/effects/telegram.ts"
import { createEffect, S } from "envio";

export const sendTelegram = createEffect(
  {
    name: "sendTelegram",
    input: { chatId: S.string, text: S.string },
    rateLimit: { calls: 25, per: "second" }, // Telegram limits ~30 msg/sec globally
    mode: "orderedAfterCommit", // human-readable feed → keep order
  },
  async ({ input, context }) => {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: input.chatId,
          text: input.text,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      context.log.error(`Telegram failed: ${res.status} ${await res.text()}`);
      throw new Error(`Telegram ${res.status}`);
    }
  }
);
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

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { sendTelegram } from "./effects/telegram";
import { formatUnits } from "./utils/format";

const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (value < 10n || value > 2_000_000_000_000_000_000n) return;

  const text = [
    `*New RETH Transfer Event*`,
    `from: ${from}`,
    `to: ${to}`,
    `amount: ${formatUnits(value, 18)}`,
    `RETH contract: ${event.srcAddress}`,
    `[etherscan](https://etherscan.io/tx/${event.transaction.hash})`,
  ].join("\n");

  context.effect(sendTelegram, { chatId: CHAT_ID, text });
});
```

### Multiple chats / multiple alerts

Just add more `if` blocks. There's no fixed schema — different events can route to different `chatId`s, and you can build totally different messages for the same event:

```typescript
if (value >= 1_000_000_000_000_000_000_000n) {
  context.effect(sendTelegram, { chatId: WHALE_CHAT, text: `🐋 ${formatUnits(value)}` });
} else if (value >= 100_000_000_000_000_000_000n) {
  context.effect(sendTelegram, { chatId: NOTABLE_CHAT, text: `Heads up: ${formatUnits(value)}` });
}
```
