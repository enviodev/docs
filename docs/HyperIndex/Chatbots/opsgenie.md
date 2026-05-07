---
id: chatbots-opsgenie
title: OpsGenie
sidebar_label: OpsGenie
slug: /chatbots/opsgenie
description: Create OpsGenie alerts from HyperIndex handlers using the Effect API.
---

Create OpsGenie alerts using the [Alert API](https://docs.opsgenie.com/docs/alert-api). One JSON `POST` — no SDK required.

### Integration setup

1. OpsGenie → **Settings → Integrations → API**, then copy the API key.
2. Set `OPSGENIE_API_KEY` in your `.env`.
3. Use `https://api.opsgenie.com` (US) or `https://api.eu.opsgenie.com` (EU) as the host.

### Define the effect

API key, priority, and the alert template are baked into the effect. `input` is just the raw event data.

```typescript title="src/effects/opsgenie.ts"
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
      txHash: S.string,
      chainId: S.number,
      blockNumber: S.number,
    },
    rateLimit: { calls: 100, per: "minute" },
    mode: "orderedAfterCommit",
  },
  async ({ input, context }) => {
    const res = await fetch("https://api.opsgenie.com/v2/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `GenieKey ${process.env.OPSGENIE_API_KEY}`,
      },
      body: JSON.stringify({
        message: `Whale moved ${formatUnits(input.value)} RETH`,
        priority: "P1",
        // alias deduplicates alerts in OpsGenie — keep it stable per logical event.
        alias: input.txHash,
        description: [
          `from: ${input.from}`,
          `to: ${input.to}`,
          `amount: ${formatUnits(input.value, 18)}`,
          `etherscan: https://etherscan.io/tx/${input.txHash}`,
        ].join("\n"),
        details: {
          chainId: input.chainId,
          block: input.blockNumber,
        },
        source: "hyperindex",
      }),
    });
    if (!res.ok) {
      context.log.error(`OpsGenie failed: ${res.status} ${await res.text()}`);
      throw new Error(`OpsGenie ${res.status}`);
    }
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
chat:
  opsgenie:
    - api_key: ${OPSGENIE_API_KEY}
      priority: P1
      messages:
        - event_name: Transfer
          filter_expression: "from = '0x0338ce5020c447f7e668dc2ef778025ce3982662' && value >= 10"
          template_inline: |
            New RETH Transfer Event
            from: {{from}}
            to: {{to}}
            amount: {{format_value(value, 18)}}
            etherscan: https://etherscan.io/tx/{{transaction_information.transaction_hash}}
```

…becomes:

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { whaleAlert } from "../effects/opsgenie";

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
      txHash: event.transaction.hash,
      chainId: context.chain.id,
      blockNumber: event.block.number,
    });
  },
);
```

For time-sensitive alerts, switch the effect to `mode: "ordered"` so the alert is created inline within the batch; the `alias` still protects you from duplicates if the batch later fails.
