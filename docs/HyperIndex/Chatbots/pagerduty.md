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

Routing key, severity, and the alert template are baked into the effect — `input` is just the raw event data.

```typescript title="src/effects/pagerduty.ts"
import { createEffect, S } from "envio";

const formatUnits = (value: bigint, decimals = 18) => {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  if (frac === 0n) return whole.toString();
  return `${whole}.${frac.toString().padStart(decimals, "0").replace(/0+$/, "")}`;
};

export const whaleAlert = createEffect(
  {
    name: "whaleAlert",
    input: {
      from: S.string,
      to: S.string,
      value: S.bigint,
      contract: S.string,
      txHash: S.string,
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
        // Stable dedup_key prevents one alert per event from spamming PagerDuty if you re-run.
        dedup_key: input.txHash,
        payload: {
          summary: `Whale moved ${formatUnits(input.value)} RETH`,
          source: input.contract,
          severity: "critical",
          custom_details: {
            from: input.from,
            to: input.to,
            value: input.value.toString(),
            link: `https://etherscan.io/tx/${input.txHash}`,
          },
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

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { whaleAlert } from "../effects/pagerduty";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;
    if (from.toLowerCase() !== WHALE || value < 10n) return;

    context.effect(whaleAlert, {
      from,
      to,
      value,
      contract: event.srcAddress,
      txHash: event.transaction.hash,
    });
  },
);
```

The `dedup_key` baked into the effect (the tx hash) guarantees at-most-one incident per transaction even across reruns. For incidents that need to fire ASAP, switch the effect to `mode: "ordered"` so the trigger runs inline within the batch — the dedup key still protects you from duplicates if the batch later fails and re-runs.
