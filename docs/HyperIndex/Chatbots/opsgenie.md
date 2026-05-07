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

```typescript title="src/effects/opsgenie.ts"
import { createEffect, S } from "envio";

type Priority = "P1" | "P2" | "P3" | "P4" | "P5";

export const createOpsGenieAlert = createEffect(
  {
    name: "createOpsGenieAlert",
    input: {
      message: S.string,
      priority: S.string, // Priority
      alias: S.optional(S.string),
      description: S.optional(S.string),
      detailsJson: S.optional(S.string), // JSON-encoded details map
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
        message: input.message,
        priority: input.priority as Priority,
        alias: input.alias,
        description: input.description,
        details: input.detailsJson ? JSON.parse(input.detailsJson) : undefined,
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

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { createOpsGenieAlert } from "./effects/opsgenie";
import { formatUnits } from "./utils/format";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;
  if (from.toLowerCase() !== WHALE || value < 10n) return;

  context.effect(createOpsGenieAlert, {
    priority: "P1",
    message: `Whale moved ${formatUnits(value)} RETH`,
    alias: event.transaction.hash, // dedup across reruns
    description: [
      `from: ${from}`,
      `to: ${to}`,
      `amount: ${formatUnits(value, 18)}`,
      `etherscan: https://etherscan.io/tx/${event.transaction.hash}`,
    ].join("\n"),
    detailsJson: JSON.stringify({
      chainId: event.chainId,
      block: event.block.number,
    }),
  });
});
```

`alias` deduplicates alerts in OpsGenie — keep it stable per logical event (e.g. the tx hash) to avoid duplicate alerts on indexer reruns.
