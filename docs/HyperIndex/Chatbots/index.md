---
id: chatbots
title: Chat Bots
sidebar_label: Overview
slug: /chatbots
description: Send on-chain notifications from HyperIndex to Telegram, Discord, Slack, Twilio, PagerDuty, or OpsGenie.
---

Chat bots in HyperIndex are just [Effects](/docs/HyperIndex/effect-api) running in `orderedAfterCommit` mode that call a chat platform's API. There is no separate templating language and no separate config file — you build your message string with template literals and decide when to send it with normal `if` statements.

### Picking a mode

Chat platforms display messages in arrival order to humans, so you almost always want **ordered** delivery. The runtime preserves the order of `context.effect(...)` calls across the entire batch, then dispatches them after the DB commit.

| Mode | When to use |
| --- | --- |
| `orderedAfterCommit` *(default choice for chat bots)* | Single ordered destination (Telegram chat, Slack channel). Won't message users about state that was rolled back. |
| `unorderedAfterCommit` | Independent alerts where order doesn't matter (one alert per swap, fan-out to multiple channels). Higher throughput. |
| `ordered` *(lower latency)* | Need the message out as fast as possible and your operators tolerate the rare duplicate on a failed batch. Inline, sequential, returns a value. |
| `unordered` *(lower latency)* | Same speed/safety tradeoff as `ordered`, but parallel dispatch. Use when alerts are fully independent. |

Use the after-commit modes by default. Switch to `ordered` / `unordered` only when you measure commit latency as the bottleneck — chat platforms are rate-limited anyway, so the gain is usually small.

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

### Pattern

Each effect bakes in its own static config (token, channel, rate limit, message template) and accepts only the per-event values that vary in `input`. That keeps call sites tiny, makes deduplication effective, and means switching destinations later is a one-line change.

The example pages below all use a small `formatUnits` helper inside the effect body to render bigints — equivalent to rindexer's `{{format_value(value, 18)}}`.
