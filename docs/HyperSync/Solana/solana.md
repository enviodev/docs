---
id: solana
title: Solana HyperSync
sidebar_label: Overview
slug: /solana
description: HyperSync for Solana - ultra-fast queries over Solana blocks, transactions, instructions, and logs.
---

# Solana HyperSync

:::info Early access — built in the open
Solana HyperSync is **early**. The core query path (slots, transactions, instructions, logs, balances, token balances, rewards) is live and ready to test against real workloads — and we're actively shaping it with the teams using it. If you're evaluating it for a real project, **please [say hi on Discord](https://discord.gg/envio)** before you build a lot on top of it: we can tell you which parts are stable, which parts are still moving, and often suggest a better data path for your specific use case (NFTs, AMMs, token flows, wallet activity, custom programs, etc.).

**Rolling retention window.** Only the most recent chain data is retained — not a fixed history from one slot forever. The current retention floor is roughly slot `391791680`; as new slots are indexed, older slots fall off. Use `GET https://solana.hypersync.xyz/height` for the current synced head and **do not hard-code** historical lower bounds. Need a deeper window for backfill? Tell us — we're prioritizing this based on real use cases.
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

## What's stable vs. what's still evolving

We want you to be able to build against this without guessing what will move under you. As of today:

**Stable enough to build on**

- The **endpoint** (`https://solana.hypersync.xyz`) and **bearer-token auth** model.
- The **request shape** for `POST /query`: `from_slot` / `to_slot`, the `instructions` / `transactions` / `logs` selection arrays, `fields` projection, and the AND-within-object / OR-across-objects semantics.
- The **core filter primitives**: `program_id`, discriminator filters (`d1` / `d2` / `d4` / `d8`), account-position filters (`a0`–`a9`), `is_inner`, `success`, `fee_payer`, log `kind`.
- The **table model**: `block`, `transaction`, `instruction`, `log`, `balance`, `token_balance`, `reward`, with the fields listed in [Query & Response](./solana-query#available-fields-by-table).
- **Pagination** via `next_slot` and **reorg detection** via `rollback_guard`.

**Still evolving — check in if you depend on these**

- The **historical retention floor** (rolling window today; we're prioritizing deeper backfill based on demand).
- Decoded / higher-level helpers built on top of the raw tables (IDL-aware decoding, common-program shortcuts).
- The **JSON-RPC-compatible facade** (`POST /` / `POST /rpc`) — useful for tools that already speak Solana JSON-RPC, but coverage is incomplete; prefer `POST /query` for indexing.
- Client libraries beyond the [Rust client](https://github.com/enviodev/hypersync-client-solana) (TypeScript / Python clients are in progress).

If a piece you need is in the second list, the fastest path is to tell us — most of the roadmap here is being driven by the use cases people bring us.

## Working with us

Solana HyperSync is the right time to be a design partner: the foundation is live, the abstractions on top are being shaped now, and your use case can influence what gets prioritized.

- **[Join us on Discord](https://discord.gg/envio)** — fastest way to reach the team building this.
- Have a specific Solana indexing problem (NFTs, AMM trades, token flows, wallet activity, a custom program)? Share a sample transaction signature or program ID and we'll map it to a concrete query path.
- Hitting a missing field, a too-shallow retention window, or a filter you wish existed? File it on [GitHub](https://github.com/enviodev/hypersync-client-solana/issues) or tell us on Discord — early feedback shapes what ships next.
