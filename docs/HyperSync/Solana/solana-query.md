---
id: solana-query
title: Solana Query & Response
sidebar_label: Query & Response
slug: /solana-query
description: Solana HyperSync query schema, filters, field selection, pagination, and reorg handling.
---

# Query & Response

:::warning Experimental
Solana HyperSync is **highly experimental**. Only slots from **`391791680`** onwards are indexed.
:::

A query selects a slot range, filters, and the fields you want back. The server returns matched rows plus a `next_slot` cursor.

## Query Shape

```json
{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "include_all_blocks": false,
  "instructions": [ ... ],
  "transactions": [ ... ],
  "logs": [ ... ],
  "fields": { ... },
  "max_num_blocks": null,
  "max_num_transactions": null,
  "max_num_instructions": null,
  "max_num_logs": null
}
```

- `from_slot` is **inclusive**, `to_slot` is **exclusive**. Omit `to_slot` to run to the head.
- Within a single filter object, all set fields are **AND**-ed.
- Multiple objects in `instructions`, `transactions`, or `logs` are **OR**-ed.
- With no filters set, no rows match unless `include_all_blocks: true`.

## Filters

### InstructionSelection

| Field | Description |
|---|---|
| `program_id` | Match program (base58 pubkeys). |
| `d1` / `d2` / `d4` / `d8` | First N bytes of instruction data (hex, e.g. `"0x03"`, `"0xf8c69e91e17587c8"`). |
| `a0` - `a9` | Account at that position (base58). |
| `is_inner` | `true` = inner only, `false` = outer only, omitted = both. |
| `include_transaction` | Also return the parent transaction. |
| `include_logs` | Also return logs associated with matched instructions. |

### TransactionSelection

| Field | Description |
|---|---|
| `fee_payer` | Match fee payer pubkey. |
| `success` | `true` or `false`. |
| `include_instructions` | Also return all instructions in matched transactions. |

### LogSelection

| Field | Description |
|---|---|
| `program_id` | Match log emitter. |
| `kind` | Log kind (e.g. `"log"`, `"data"`). |
| `include_transaction` | Also return parent transaction. |
| `include_instruction` | Also return instructions associated with matched logs. |

## Field Selection

Use `fields` to pick exactly which columns come back. Omit a table to get all its columns.

```json
{
  "fields": {
    "block": ["slot", "blockhash", "block_time"],
    "instruction": ["slot", "program_id", "data", "d8"],
    "transaction": ["slot", "fee_payer", "success"]
  }
}
```

### Available fields

**block**: `slot`, `blockhash`, `parent_slot`, `parent_blockhash`, `block_time`, `block_height`

**transaction**: `slot`, `transaction_index`, `signatures`, `fee_payer`, `success`, `err`, `fee`, `compute_units_consumed`, `account_keys`, `recent_blockhash`, `version`, `loaded_addresses_writable`, `loaded_addresses_readonly`

**instruction**: `slot`, `transaction_index`, `instruction_address`, `program_id`, `accounts`, `data`, `d1`, `d2`, `d4`, `d8`, `a0`-`a9`, `is_inner`, `is_committed`

**log**: `slot`, `transaction_index`, `instruction_address`, `program_id`, `kind`, `message`

**balance**: `slot`, `transaction_index`, `account`, `pre`, `post`

**token_balance**: `slot`, `transaction_index`, `account`, `mint`, `owner`, `pre_amount`, `post_amount`

**reward**: `slot`, `pubkey`, `lamports`, `post_balance`, `reward_type`, `commission`

## Response

```json
{
  "next_slot": 391800100,
  "total_execution_time_ms": 0,
  "rollback_guard": { ... },
  "blocks": [...],
  "transactions": [...],
  "instructions": [...],
  "logs": [...],
  "balances": [...],
  "token_balances": [...],
  "rewards": [...]
}
```

### Pagination

Use `next_slot` as the next request's `from_slot`. Continue until `next_slot >= to_slot` (or current head).

The server returns at most a few hundred MB and stops at a time budget. A single request may cover much more than the slots you asked for, or much less, depending on filter density.

### Reorg Detection (`rollback_guard`)

Present when the response touches the unfinalized tip. Compare the previous response's `blockhash` to the next response's `first_previous_blockhash`. Mismatch = reorg between the two queries.

```json
{
  "slot_number": 391800099,
  "timestamp": 1731000000,
  "blockhash": "...",
  "first_slot_number": 391800000,
  "first_previous_blockhash": "..."
}
```

## Examples

### All instructions in a slot range (Pump.fun, real-time tip)

```json
{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "instruction": ["slot", "program_id", "data", "d8"],
    "transaction": ["slot", "fee_payer", "success"]
  },
  "instructions": [
    {
      "program_id": ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
      "include_transaction": true
    }
  ]
}
```

### Token transfers for a single mint (USDC SPL)

```json
{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "fields": {
    "token_balance": ["slot", "transaction_index", "account", "mint", "owner", "pre_amount", "post_amount"]
  },
  "instructions": [
    {
      "program_id": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
      "d1": ["0x03"]
    }
  ]
}
```

### All blocks, no filters (Validator analytics)

```json
{
  "from_slot": 391800000,
  "to_slot": 391800010,
  "include_all_blocks": true,
  "fields": {
    "block": ["slot", "blockhash", "block_time", "block_height"]
  }
}
```
