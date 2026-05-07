---
id: chatbots-pagerduty
title: PagerDuty
sidebar_label: PagerDuty
slug: /chatbots/pagerduty
description: Trigger PagerDuty incidents from HyperIndex handlers using the Effect API.
---

Trigger PagerDuty incidents using the [Events API v2](https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTgw-events-api-v2-overview). No SDK needed — it's a single JSON `POST`.

### Integration setup

1. PagerDuty → **Services → Service Directory → your service → Integrations → Add → Events API v2**.
2. Copy the **Integration Key** (a.k.a. routing key).
3. Set `PAGERDUTY_ROUTING_KEY` in your `.env`.

### Define the effect

```typescript title="src/effects/pagerduty.ts"
import { createEffect, S } from "envio";

type Severity = "info" | "warning" | "error" | "critical";

export const triggerPagerDuty = createEffect(
  {
    name: "triggerPagerDuty",
    input: {
      severity: S.string, // Severity
      summary: S.string,
      source: S.string,
      dedupKey: S.optional(S.string),
      detailsJson: S.optional(S.string), // JSON-encoded custom_details
    },
    rateLimit: { calls: 60, per: "minute" },
    mode: "orderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch("https://events.pagerduty.com/v2/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routing_key: process.env.PAGERDUTY_ROUTING_KEY,
        event_action: "trigger",
        dedup_key: input.dedupKey,
        payload: {
          summary: input.summary,
          source: input.source,
          severity: input.severity as Severity,
          custom_details: input.detailsJson
            ? JSON.parse(input.detailsJson)
            : undefined,
        },
      }),
    });
    if (!res.ok) {
      context.log.error(`PagerDuty failed: ${res.status} ${await res.text()}`);
      throw new Error(`PagerDuty ${res.status}`);
    }
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
chat:
  pagerduty:
    - routing_key: ${PAGERDUTY_ROUTING_KEY}
      severity: critical
      messages:
        - event_name: Transfer
          filter_expression: "from = '0x0338ce5020c447f7e668dc2ef778025ce3982662' && value >= 10"
          template_inline: |
            New RETH Transfer Event
            from: {{from}}
            to: {{to}}
            amount: {{format_value(value, 18)}}
            link: https://etherscan.io/tx/{{transaction_information.transaction_hash}}
```

…becomes:

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { triggerPagerDuty } from "./effects/pagerduty";
import { formatUnits } from "./utils/format";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;
  if (from.toLowerCase() !== WHALE || value < 10n) return;

  context.effect(triggerPagerDuty, {
    severity: "critical",
    summary: `Whale moved ${formatUnits(value)} RETH`,
    source: event.srcAddress,
    // dedup_key prevents one alert per event from spamming PagerDuty if you re-run
    dedupKey: event.transaction.hash,
    detailsJson: JSON.stringify({
      from,
      to,
      value: value.toString(),
      link: `https://etherscan.io/tx/${event.transaction.hash}`,
    }),
  });
});
```

`dedupKey` is the cleanest way to guarantee at-most-one incident per transaction even across reruns.
