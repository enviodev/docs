---
id: chatbots
title: Chat Bots
sidebar_label: Overview
slug: /chatbots
description: Send on-chain notifications from HyperIndex to Telegram, Discord, Slack, Twilio, PagerDuty, or OpsGenie.
---

Chat bots in HyperIndex are just [Effects](/docs/HyperIndex/effect-api) running in `orderedAfterCommit` mode that call a chat platform's API. There is no separate templating language and no separate config file — you build your message string with template literals and decide when to send it with normal `if` statements.

### Why `orderedAfterCommit`?

Chat platforms display messages in arrival order to humans, so you almost always want **ordered** delivery. The runtime preserves the order of `context.effect(...)` calls across the entire batch, then dispatches them sequentially after the DB commit. The `AfterCommit` half guarantees you never message users about a state that was rolled back by a reorg or a failed batch.

If you don't care about order across events (e.g. one alert per swap, no relation between alerts), you can use `unorderedAfterCommit` for higher throughput.

### Comparison with rindexer

| rindexer | HyperIndex |
| --- | --- |
| `chat:` block in YAML, one entry per provider | A `createEffect({ mode: "orderedAfterCommit" })` per destination |
| `filter_expression: "value >= 10 && from = '0x…'"` | A regular TypeScript `if` |
| `template_inline` Mustache template | Template literal (full TypeScript expressions inside `${...}`) |
| 10-block max range hard-coded | Use the rate-limit option to tune throughput |

### Supported platforms

- [Telegram](/docs/HyperIndex/chatbots/telegram)
- [Discord](/docs/HyperIndex/chatbots/discord)
- [Slack](/docs/HyperIndex/chatbots/slack)
- [Twilio (SMS)](/docs/HyperIndex/chatbots/twilio)
- [PagerDuty](/docs/HyperIndex/chatbots/pagerduty)
- [OpsGenie](/docs/HyperIndex/chatbots/opsgenie)

### Helper: human-readable token amounts

Most examples below use a small `formatUnits` helper instead of rindexer's `{{format_value(value, 18)}}`:

```typescript title="src/utils/format.ts"
export const formatUnits = (value: bigint, decimals = 18) => {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
};
```
