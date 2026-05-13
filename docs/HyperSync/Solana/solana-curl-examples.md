---
id: solana-curl-examples
title: Solana curl Examples
sidebar_label: curl Examples ⭐
slug: /solana-curl-examples
description: Copy-paste curl examples for the Solana HyperSync API against real protocols.
---

# Solana curl Examples

:::warning Experimental
Solana HyperSync is **highly experimental**. Only slots from **`391791680`** onwards are indexed.
:::

Copy-paste curl commands. Set your endpoint once:

```bash
export URL=https://solana.hypersync.xyz
export TOKEN="your-api-token"
```

Pipe to `jq` or `python3 -m json.tool` for readable output.

## Quick checks

```bash
curl $URL/health
curl $URL/height
```

## Orca Whirlpool swaps

8-byte Anchor discriminator for the `swap` instruction.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
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
  }'
```

## Jupiter Aggregator routes

All instructions hitting Jupiter v6.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "from_slot": 391800000,
    "to_slot": 391800100,
    "fields": {
      "instruction": ["slot", "program_id", "data", "d8", "accounts"],
      "transaction": ["slot", "fee_payer", "success", "fee"]
    },
    "instructions": [{
      "program_id": ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],
      "include_transaction": true
    }]
  }'
```

## SPL Token transfers

1-byte discriminator. `0x03` = `Transfer`.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
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

## System Program transfers

4-byte discriminator. `0x02000000` = `Transfer` (little-endian u32).

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "from_slot": 391800000,
    "to_slot": 391800100,
    "fields": {
      "instruction": ["slot", "program_id", "accounts", "data", "d4"]
    },
    "instructions": [{
      "program_id": ["11111111111111111111111111111111"],
      "d4": ["0x02000000"]
    }]
  }'
```

## Jupiter OR Orca (multiple filters)

Each item in `instructions` is OR-ed.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
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

All transactions paid by a wallet, plus their instructions.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
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

## Pump.fun bonding-curve trades

Match by account position - the mint sits at `a2` in `buy`/`sell` instructions.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
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

Logs emitted by a specific program.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
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

## All blocks in a range

No filters; just block headers.

```bash
curl -s "$URL/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "from_slot": 391800000,
    "to_slot": 391800010,
    "include_all_blocks": true,
    "fields": {
      "block": ["slot", "blockhash", "parent_slot", "block_time", "block_height"]
    }
  }'
```

## Paginating a scan

```bash
SLOT=391800000
while true; do
  RESP=$(curl -s "$URL/query" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{
      \"from_slot\": $SLOT,
      \"fields\": { \"instruction\": [\"slot\", \"program_id\", \"d8\"] },
      \"instructions\": [{ \"program_id\": [\"whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc\"] }]
    }")
  NEXT=$(echo "$RESP" | jq .next_slot)
  echo "$RESP" | jq '.instructions | length'
  [ "$NEXT" -le "$SLOT" ] && break
  SLOT=$NEXT
done
```
