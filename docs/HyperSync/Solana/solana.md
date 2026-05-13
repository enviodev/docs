---
id: solana
title: Solana HyperSync
sidebar_label: Overview
slug: /solana
description: HyperSync for Solana - ultra-fast queries over Solana blocks, transactions, instructions, and logs.
---

# Solana HyperSync

:::warning Highly experimental
Solana HyperSync is in a **highly experimental** state. The API surface may change without notice and stability is not yet guaranteed.

**Only the most recent blocks are indexed**, from **slot `391791680`** onwards. Queries below that slot will return no data.
:::

HyperSync for Solana is HyperSync adapted to Solana's data model. Query historical slots, transactions, instructions, logs, balances, token balances, and rewards over a single JSON or Arrow IPC API.

:::info
Endpoint: `https://solana.hypersync.xyz`
:::

## What it gives you

- Filter by program ID, instruction discriminator, account positions and account inclusion, fee payer, or log program.
- Join instructions to their parent transaction, or transactions to all their instructions.
- Stream large slot ranges with adaptive batching.
- Detect reorgs near the chain tip via the rollback guard.

## Differences vs EVM HyperSync

| Concept | EVM | Solana |
|---|---|---|
| Unit of progress | `block` | `slot` |
| Range bounds | `from_block` / `to_block` | `from_slot` / `to_slot` |
| Primary filter | `logs`, `transactions`, `traces` | `instructions`, `transactions`, `logs` |
| Match key | event topic + address | program ID + discriminator + account positions |
| Pagination | `next_block` | `next_slot` |

## Endpoints

| Path | Description |
|---|---|
| `POST /query` | JSON query, JSON response. |
| `POST /query/arrow` | JSON query, Arrow IPC response. |
| `GET /height` | Current synced slot. |
| `GET /height/sse` | Server-sent stream of head slot. |
| `GET /health` | Health check. |

## Clients

- Rust: [hypersync-client-solana](https://github.com/enviodev/hypersync-client-solana)
- Direct HTTP: any language via `curl` or HTTP library.

## Examples

```bash
# Current synced slot
curl https://solana.hypersync.xyz/height

# Health
curl https://solana.hypersync.xyz/health
```

## Next

- [Query & Response](./solana-query) - schema, filters, pagination, reorgs.
- [curl Examples](./solana-curl-examples) - copy-paste queries for real protocols.
