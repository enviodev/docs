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

Curl is great for testing; for production, prefer the [Solana client](./solana-client): it is Rust, uses Arrow for faster decoding, and handles pagination, retries, and rate limits for you. Node bindings live in the same repo but are not published yet, and there is no Python client; tell us on Discord which one would unblock you and we will prioritize accordingly.

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

Every response table is an array of row **batches**, so the `jq` below flattens with `[.table[][]]` before indexing or counting. See [Response](./solana-query#response).

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
  "field_selection": {
    "instruction_call": ["slot", "transaction_index", "executing_account", "account_arguments", "data", "d8"],
    "transaction": ["slot", "signatures", "fee_payer", "success", "fee"]
  },
  "instruction_calls": [{
    "executing_account": ["whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"],
    "d8": ["0xf8c69e91e17587c8"]
  }]
}' | jq '{next_slot, sample_instruction: [.instruction_calls[][]][0], sample_tx: [.transactions[][]][0]}'
```

## SPL Token `Transfer` (`d1`)

1-byte discriminator: `0x03` = `Transfer` (hex with or without `0x`). Token movements come from the unified `account_activity` table (`pre_token_balance` / `post_token_balance` are raw base-unit decimal **strings**).

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "field_selection": {
    "instruction_call": ["slot", "executing_account", "account_arguments", "data", "d1"],
    "account_activity": ["slot", "transaction_index", "account", "mint", "pre_owner", "post_owner", "token_state", "pre_token_balance", "post_token_balance"]
  },
  "instruction_calls": [{
    "executing_account": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
    "d1": ["0x03"]
  }]
}'
```

## Wallet activity (native SOL + tokens)

`account` is the wallet on a native row and the token account on a token row, and fields
within one selection are AND-ed, so "everything for wallet W" is **two** selections.

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "field_selection": {
    "account_activity": ["slot", "transaction_id", "account", "pre_balance", "post_balance", "mint", "pre_owner", "post_owner", "token_state", "pre_token_balance", "post_token_balance"]
  },
  "account_activity": [
    { "account": ["MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa"] },
    { "owner": ["MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa"] }
  ]
}'
```

To pull **every** activity row in a range (the replacement for the removed
`include_account_activity` flag), use one empty selection:

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800010,
  "field_selection": { "account_activity": ["slot", "account", "pre_balance", "post_balance"] },
  "account_activity": [{}]
}'
```

## Successful transactions only

`tx_success` filters instruction calls by the success of their parent transaction, server-side.

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "field_selection": {
    "instruction_call": ["slot", "executing_account", "d8", "tx_success", "error", "compute_units_consumed"]
  },
  "instruction_calls": [{
    "executing_account": ["whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"],
    "tx_success": true
  }]
}'
```

## Jupiter **or** Orca (program-only OR)

Each object in `instruction_calls` is OR-ed. This is the “match by program id only” pattern (no discriminator).

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "field_selection": {
    "instruction_call": ["slot", "executing_account", "data", "d8"]
  },
  "instruction_calls": [
    { "executing_account": ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"] },
    { "executing_account": ["whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"] }
  ]
}'
```

## Transactions by fee payer

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "field_selection": {
    "transaction": ["slot", "signatures", "fee_payer", "success", "fee", "compute_units_consumed"],
    "instruction_call": ["slot", "executing_account", "data", "account_arguments"]
  },
  "transactions": [{
    "fee_payer": ["MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa"]
  }]
}'
```

## Pump.fun bonding-curve trades (account index)

`a2` matches the **third account** in the instruction's account metas (`a0` = first). For Pump.fun's buy/sell instructions, the mint is **account index 2 per that program's IDL**—not a Solana-wide rule.

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "field_selection": {
    "instruction_call": ["slot", "executing_account", "account_arguments", "data", "d8", "a2"],
    "transaction": ["slot", "fee_payer", "success"]
  },
  "instruction_calls": [{
    "executing_account": ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"]
  }]
}'
```

## Raydium AMM logs

```bash
curl_query '{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "field_selection": {
    "log": ["slot", "program_id", "kind", "message"],
    "transaction": ["slot", "fee_payer", "success"]
  },
  "logs": [{
    "program_id": ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"]
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
    \"field_selection\": { \"instruction_call\": [\"slot\", \"executing_account\", \"d8\"] },
    \"instruction_calls\": [{ \"executing_account\": [\"whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc\"] }]
  }")
  echo "$RESP" | jq '([.instruction_calls[][]] | length), .next_slot'
  NEXT=$(echo "$RESP" | jq -r .next_slot)
  if [ "$NEXT" -ge "$TO" ] || [ "$NEXT" -le "$SLOT" ]; then
    break
  fi
  SLOT=$NEXT
done
```
