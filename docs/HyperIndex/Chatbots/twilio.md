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

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (in E.164 format, e.g. `+15551234567`)

### Installation (SDK)

```bash
pnpm add twilio
```

### Configure the client

```typescript title="src/clients/twilio.ts"
import twilio from "twilio";

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);
```

### Define the effect

```typescript title="src/effects/twilio.ts"
import { createEffect, S } from "envio";
import { twilioClient } from "../clients/twilio";

export const sendSms = createEffect(
  {
    name: "sendSms",
    input: { to: S.string, body: S.string },
    rateLimit: { calls: 1, per: "second" }, // Twilio default trial = 1 msg/sec
    mode: "orderedAfterCommit",
  },
  async ({ input }) => {
    await twilioClient.messages.create({
      from: process.env.TWILIO_FROM_NUMBER!,
      to: input.to,
      body: input.body,
    });
  }
);
```

### Raw `fetch` alternative

If you'd rather skip the SDK:

```typescript
const auth = Buffer.from(
  `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
).toString("base64");

await fetch(
  `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
  {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: process.env.TWILIO_FROM_NUMBER!,
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
    - account_sid: ${TWILIO_ACCOUNT_SID}
      auth_token: ${TWILIO_AUTH_TOKEN}
      from_number: ${TWILIO_FROM_NUMBER}
      to_number: ${TWILIO_TO_NUMBER}
      messages:
        - event_name: Transfer
          filter_expression: "value >= 10"
          template_inline: "Transfer detected: {{value}} tokens"
```

…becomes:

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { sendSms } from "./effects/twilio";
import { formatUnits } from "./utils/format";

const TO = process.env.TWILIO_TO_NUMBER!;

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { value } = event.params;
  if (value < 10n) return;

  context.effect(sendSms, {
    to: TO,
    body: `Transfer detected: ${formatUnits(value)} RETH`,
  });
});
```

SMS is rate-limited and expensive — keep your conditions strict.
