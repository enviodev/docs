---
id: solana
title: Solana HyperSync
sidebar_label: Overview
slug: /solana
description: HyperSync for Solana - ultra-fast queries over Solana blocks, transactions, instructions, and logs.
---

# Solana HyperSync

:::warning Highly experimental
Solana HyperSync is **highly experimental**: the API may change without notice and stability is not guaranteed.

Only the **most recent** chain data is retained: a **rolling window**—not a fixed history from one slot forever. The current retention floor is roughly slot `391791680`; as new slots are indexed, older slots fall off. Use `GET https://solana.hypersync.xyz/height` for the current synced head and **do not hard-code** historical lower bounds.
:::

HyperSync for Solana exposes **`https://solana.hypersync.xyz`**: one JSON (or Arrow) API over slots, transactions, instructions, logs, balances, token balances, and rewards. Use the [Rust client](https://github.com/enviodev/hypersync-client-solana) or any HTTP client (for example `curl`). Details: [Query & Response](./solana-query), [curl Examples](./solana-curl-examples).

**Slots vs blocks:** Some slots have **no block** (skipped leader, etc.). A query over `[from_slot, to_slot)` can return **fewer block rows** than the slot span implies; that is normal, not a bug.

## Differences vs EVM HyperSync

| Concept | EVM | Solana |
|---|---|---|
| Unit of progress | `block` | `slot` |
| Range bounds | `from_block` / `to_block` | `from_slot` / `to_slot` |
| Primary filter | `logs`, `transactions`, `traces` | `instructions`, `transactions`, `logs` |
| Match key | event topic + address | program ID + discriminator + account positions |
| Logs | Contract events (topics + structured log data) | Program output lines (free-form strings; filter by emitter `program_id` and parsed `kind`) |
| Pagination | `next_block` | `next_slot` |

## Endpoints

| Path | Description |
|---|---|
| `POST /query` | JSON query, JSON response. |
| `POST /query/arrow` | Same JSON query; response is **Apache Arrow IPC** (stream-encoded record batches—typically smaller and faster to decode than JSON). |
| `GET /height` | Current synced slot (JSON). Example: `curl https://solana.hypersync.xyz/height`. |
| `GET /height/sse` | Server-sent events stream of the head slot (see [curl Examples](./solana-curl-examples#head-slot-sse)). |
| `GET /health` | Health check. |
| `POST /`, `POST /rpc` | **Experimental** Solana JSON-RPC-compatible facade for tooling that already speaks JSON-RPC; coverage may be incomplete—prefer `POST /query` for indexing. |

## Minimal first query

```bash
curl -sS "https://solana.hypersync.xyz/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "from_slot": 391800000,
    "to_slot": 391800010,
    "fields": { "instruction": ["slot", "program_id", "d8"] },
    "instructions": [
      { "program_id": ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"] }
    ]
  }'
```

Expect JSON with `instructions` (and any joined tables you asked for), `next_slot`, optional `rollback_guard`, and other keys empty or omitted. [API tokens](/docs/HyperSync/api-tokens) are the same as for EVM HyperSync (`Authorization: Bearer`).
