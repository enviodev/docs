---
id: chatbots-twilio
title: Twilio (SMS)
sidebar_label: Twilio (SMS)
slug: /chatbots/twilio
description: Send SMS notifications from HyperIndex handlers using the Effect API and Twilio.
---

Send SMS messages via [Twilio's Programmable Messaging API](https://www.twilio.com/docs/sms). You can use the official SDK or hit the REST endpoint directly with `fetch`.

### Account setup

From the Twilio Console grab:

- `ENVIO_TWILIO_ACCOUNT_SID`
- `ENVIO_TWILIO_AUTH_TOKEN`
- `ENVIO_TWILIO_FROM_NUMBER` (in E.164 format, e.g. `+15551234567`)

### Installation (SDK)

```bash
pnpm add twilio
```

### Configure the client

```typescript title="src/clients/twilio.ts"
import twilio from "twilio";

export const twilioClient = twilio(
  process.env.ENVIO_TWILIO_ACCOUNT_SID!,
  process.env.ENVIO_TWILIO_AUTH_TOKEN!
);
```

### Define the effect

From/to numbers are baked in. The handler hands the effect raw values; the SMS body is built inside.

```typescript title="src/effects/twilio.ts"
import { createEffect, S } from "envio";
import { twilioClient } from "../clients/twilio";

const FROM = process.env.ENVIO_TWILIO_FROM_NUMBER!;
const TO = process.env.ENVIO_TWILIO_TO_NUMBER!;

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
    input: { value: S.bigint },
    rateLimit: { calls: 1, per: "second" }, // Twilio default trial = 1 msg/sec
    mode: "orderedAfterCommit",
  },
  async ({ input }) => {
    await twilioClient.messages.create({
      from: FROM,
      to: TO,
      body: `Transfer detected: ${formatUnits(input.value)} RETH`,
    });
  }
);
```

### Raw `fetch` alternative

If you'd rather skip the SDK:

```typescript
const auth = Buffer.from(
  `${process.env.ENVIO_TWILIO_ACCOUNT_SID}:${process.env.ENVIO_TWILIO_AUTH_TOKEN}`
).toString("base64");

await fetch(
  `https://api.twilio.com/2010-04-01/Accounts/${process.env.ENVIO_TWILIO_ACCOUNT_SID}/Messages.json`,
  {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: process.env.ENVIO_TWILIO_FROM_NUMBER!,
      To: input.to,
      Body: input.body,
    }),
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
chat:
  twilio:
    - account_sid: ${ENVIO_TWILIO_ACCOUNT_SID}
      auth_token: ${ENVIO_TWILIO_AUTH_TOKEN}
      from_number: ${ENVIO_TWILIO_FROM_NUMBER}
      to_number: ${ENVIO_TWILIO_TO_NUMBER}
      messages:
        - event_name: Transfer
          filter_expression: "value >= 10"
          template_inline: "Transfer detected: {{value}} tokens"
```

…becomes:

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { notifyTransfer } from "../effects/twilio";

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { value } = event.params;
    if (value < 10n) return;

    context.effect(notifyTransfer, { value });
  },
);
```

SMS is rate-limited and expensive — keep your conditions strict. For time-sensitive alerts, switch the effect to `mode: "ordered"` so the SMS is dispatched inline rather than after the DB commit.
