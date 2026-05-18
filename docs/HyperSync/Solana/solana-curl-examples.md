---
id: solana-curl-examples
title: Solana curl Examples
sidebar_label: curl Examples
slug: /solana-curl-examples
description: Copy-paste curl examples for the Solana HyperSync API against real protocols.
---

# Solana curl Examples

:::info Early access
Solana HyperSync is **early** but the query shape used in these examples is stable enough to build against. Only **recent** slots are retained — the floor is a **rolling window** (see [Overview](./solana)); use `GET /height` instead of hard-coding how far back you can query. Working on something specific? [Ping us on Discord](https://discord.gg/envio) — we can often suggest a tighter query for your use case.
:::

Copy-paste examples against **`https://solana.hypersync.xyz`**. Use the same [API token](/docs/HyperSync/api-tokens) as EVM HyperSync: pass `Authorization: Bearer <token>` on **`POST /query`** (and on Arrow). `GET /health`, `GET /height`, and `GET /height/sse` are typically usable without a token, but follow whatever your deployment returns.

Curl is great for testing; for production, prefer one of our clients. The [Rust client](https://github.com/enviodev/hypersync-client-solana) is the most complete today (and uses Arrow for faster decoding); TypeScript and Python clients are in progress — tell us on Discord which one would unblock you and we'll prioritize accordingly.

```bash
export URL=https://solana.hypersync.xyz
export TOKEN="your-api-token"

# JSON POST helper (adds auth + content-type)
curl_query() {
  curl -sS "$URL/query" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$1"
}
```

Discriminator filters accept hex **with or without** a `0x` prefix (`03` and `0x03` are the same). Pipe responses through `jq` or `python3 -m json.tool` for readability.

## Quick checks

```bash
curl -sS "$URL/health"
curl -sS "$URL/height"
```

### Head slot (SSE)

`curl -N` disables buffering so lines arrive as the server pushes them:

```bash
curl -sSN -H "Accept: text/event-stream" "$URL/height/sse"
```

## Orca Whirlpool (`swap` discriminator)

8-byte Anchor discriminator. Example response shape (truncated):

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "instruction": ["slot", "transaction_index", "program_id", "accounts", "data", "d8"],
    "transaction": ["slot", "signatures", "fee_payer", "success", "fee"]
  },
  "instructions": [{
    "program_id": ["whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"],
    "d8": ["0xf8c69e91e17587c8"],
    "include_transaction": true
  }]
}' | jq '{next_slot, sample_instruction: .instructions[0], sample_tx: .transactions[0]}'
```

## SPL Token `Transfer` (`d1`)

1-byte discriminator: `0x03` = `Transfer` (hex with or without `0x`).

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "instruction": ["slot", "program_id", "accounts", "data", "d1"],
    "token_balance": ["slot", "transaction_index", "account", "mint", "owner", "pre_amount", "post_amount"]
  },
  "instructions": [{
    "program_id": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
    "d1": ["0x03"]
  }]
}'
```

## Jupiter **or** Orca (program-only OR)

Each object in `instructions` is OR-ed. This is the “match by program id only” pattern (no discriminator).

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "instruction": ["slot", "program_id", "data", "d8"]
  },
  "instructions": [
    { "program_id": ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"] },
    { "program_id": ["whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"] }
  ]
}'
```

## Transactions by fee payer

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "transaction": ["slot", "signatures", "fee_payer", "success", "fee", "compute_units_consumed"],
    "instruction": ["slot", "program_id", "data", "accounts"]
  },
  "transactions": [{
    "fee_payer": ["MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa"],
    "include_instructions": true
  }]
}'
```

## Pump.fun bonding-curve trades (account index)

`a2` matches the **third account** in the instruction's account metas (`a0` = first). For Pump.fun's buy/sell instructions, the mint is **account index 2 per that program's IDL**—not a Solana-wide rule.

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "instruction": ["slot", "program_id", "accounts", "data", "d8", "a2"],
    "transaction": ["slot", "fee_payer", "success"]
  },
  "instructions": [{
    "program_id": ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
    "include_transaction": true
  }]
}'
```

## Raydium AMM logs

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "log": ["slot", "program_id", "kind", "message"],
    "transaction": ["slot", "fee_payer", "success"]
  },
  "logs": [{
    "program_id": ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"],
    "include_transaction": true
  }]
}'
```

## Paginating a bounded scan

Use the same termination rule as [Query & Response](./solana-query#pagination): stop when `next_slot >= to_slot`, or when `next_slot` does not advance (stuck at head).

```bash
FROM=391800000
TO=391801000
SLOT=$FROM
while [ "$SLOT" -lt "$TO" ]; do
  RESP=$(curl_query "{
    \"from_slot\": $SLOT,
    \"to_slot\": $TO,
    \"fields\": { \"instruction\": [\"slot\", \"program_id\", \"d8\"] },
    \"instructions\": [{ \"program_id\": [\"whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc\"] }]
  }")
  echo "$RESP" | jq '.instructions | length, .next_slot'
  NEXT=$(echo "$RESP" | jq -r .next_slot)
  if [ "$NEXT" -ge "$TO" ] || [ "$NEXT" -le "$SLOT" ]; then
    break
  fi
  SLOT=$NEXT
done
```
