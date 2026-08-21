---
id: solana
title: Solana HyperSync
sidebar_label: Overview
slug: /solana
description: HyperSync for Solana - ultra-fast queries over Solana slots, transactions, instruction calls, logs, and account activity.
---

# Solana HyperSync

:::info Early access, built in the open
Solana HyperSync is **early**. The core query path (slots, transactions, instruction calls, logs, account activity, rewards) is live and ready to test against real workloads. If you're evaluating it for a real project, [say hi on Discord](https://discord.gg/envio) first: we can tell you which parts are stable and often suggest a better data path for your use case.

**Rolling retention window.** Only recent chain data (on the order of tens of millions of slots behind head) is retained; the floor moves forward as new slots are indexed. Use `GET https://solana.hypersync.xyz/height` for the current head and do not hard-code historical lower bounds. Need deeper backfill? Tell us.
:::

HyperSync for Solana exposes **`https://solana.hypersync.xyz`**: one JSON (or Arrow) API over slots, transactions, instruction calls, logs, account activity (native SOL + SPL token), and rewards. Use the [Solana client](./solana-client) or any HTTP client. Details: [Query & Response](./solana-query), [curl Examples](./solana-curl-examples).

**Slots vs blocks:** some slots have no block (skipped leader, etc.), so a query over `[from_slot, to_slot)` can return fewer block rows than the slot span implies.

## Differences vs EVM HyperSync

| Concept | EVM | Solana |
|---|---|---|
| Unit of progress | `block` | `slot` |
| Range bounds | `from_block` / `to_block` | `from_slot` / `to_slot` |
| Primary filter | `logs`, `transactions`, `traces` | `instruction_calls`, `transactions`, `logs`, `account_activity` |
| Match key | event topic + address | program ID + discriminator + account positions |
| Logs | Contract events (topics + structured data) | Program output lines (free-form strings; filter by emitter `program_id` and parsed `kind`) |
| Pagination | `next_block` | `next_slot` |

## Endpoints

| Path | Description |
|---|---|
| `POST /query` | JSON query, JSON response. |
| `POST /query/arrow` | Same query; response is Apache Arrow IPC (smaller and faster to decode than JSON). |
| `GET /height` | Current synced slot. |
| `GET /height/sse` | Server-sent events stream of the head slot (see [curl Examples](./solana-curl-examples#head-slot-sse)). |
| `GET /health` | Health check. |
| `POST /`, `POST /rpc` | **Experimental** Solana JSON-RPC-compatible facade; coverage may be incomplete, so prefer `POST /query` for indexing. |

## Minimal first query

Only recent slots are served, so anchor the range to the current head:

```bash
HEAD=$(curl -sS https://solana.hypersync.xyz/height)
curl -sS "https://solana.hypersync.xyz/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "from_slot": '$((HEAD - 1000))',
    "to_slot": '$((HEAD - 990))',
    "field_selection": { "instruction_call": ["slot", "executing_account", "d8"] },
    "instruction_calls": [
      { "executing_account": ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"] }
    ]
  }'
```

Expect JSON with `instruction_calls` (plus any joined tables you selected), `next_slot`, and an optional `rollback_guard`. [API tokens](/docs/HyperSync/api-tokens) are the same as for EVM HyperSync.

## What's stable vs. what's still evolving

**Stable enough to build on**

- The endpoint and bearer-token auth model.
- The `POST /query` request shape: `from_slot` / `to_slot`, the `instruction_calls` / `transactions` / `logs` / `account_activity` selection arrays, `field_selection`, and the AND-within-object / OR-across-objects semantics.
- The core filter primitives: `executing_account`, discriminators (`d1` / `d2` / `d4` / `d8`), account positions (`a0` to `a9`), `is_inner`, `tx_success`, `success`, `fee_payer`, `transaction_id`, log `kind`.
- The table model: `block`, `transaction`, `instruction_call`, `log`, `account_activity`, `reward`, with the fields in [Query & Response](./solana-query#available-fields-by-table).
- Pagination via `next_slot` and reorg detection via `rollback_guard`.

**Still evolving**

- The historical retention floor (rolling window today; deeper backfill prioritized by demand).
- Decoded / higher-level helpers on top of the raw tables (IDL-aware decoding, common-program shortcuts).
- The JSON-RPC-compatible facade (`POST /` / `POST /rpc`).
- Clients beyond the [Rust client](./solana-client): Node bindings are not published yet; Python is not started.

If you need something from the second list, or hit a missing field, a too-shallow retention window, or a filter you wish existed, tell us on [Discord](https://discord.gg/envio) or file it on [GitHub](https://github.com/enviodev/hypersync-client-solana/issues). Share a sample transaction signature or program ID and we'll map it to a concrete query path. The roadmap here is driven by the use cases people bring us.
