---
id: solana-query
title: Solana Query & Response
sidebar_label: Query & Response
slug: /solana-query
description: Solana HyperSync query schema, filters, field selection, pagination, and reorg handling.
---

# Query & Response

:::info Early access
Solana HyperSync is **early** — the query shape, filters, and tables described below are the ones we expect to keep, and they're stable enough to build against today. See [What's stable vs. what's still evolving](./solana#whats-stable-vs-whats-still-evolving) for the current line between the two, and [reach out on Discord](https://discord.gg/envio) if you're planning a real workload — we can usually save you time by suggesting the right query shape for your use case.

Data is kept in a **rolling retention window**; the floor moves forward over time. Use `GET /height` instead of hard-coding how far back you can query.
:::

A query selects a slot range, optional filters on instructions / transactions / logs, and the columns you want. The server returns matched rows plus a `next_slot` cursor.

Some slots have **no block**; the `blocks` array can be sparse across the requested slot range.

## Query shape

```json
{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "include_all_blocks": false,
  "instructions": [ ... ],
  "transactions": [ ... ],
  "logs": [ ... ],
  "fields": { ... }
}
```

- `from_slot` is **inclusive**, `to_slot` is **exclusive**. Omit `to_slot` to run toward the current head.
- Within one selection object, all set fields are **AND**-ed.
- Multiple objects in `instructions`, `transactions`, or `logs` are **OR**-ed.
- If **`instructions`**, **`transactions`**, and **`logs`** are all absent or empty and **`include_all_blocks`** is false, you get **no matching rows** (empty tables). Set `include_all_blocks: true` to pull block headers across a range without program filters.

## Filters

### InstructionSelection

| Field | Description |
|---|---|
| `program_id` | Match program (base58 pubkeys). |
| `d1` / `d2` / `d4` / `d8` | First _N_ bytes of instruction data, as hex. **`0x` prefix is optional** (`"0x03"` and `"03"` are equivalent). |
| `a0` - `a9` | Account pubkey at that **index in the instruction's account metas** (`a0` = first account, `a2` = third). Which account is "the mint", "the pool", etc. is **defined by the program's IDL / instruction layout**, not by Solana globally. |
| `is_inner` | `true` = inner only, `false` = outer only, **omitted** = both. |
| `include_transaction` | Also return the parent transaction row(s). |
| `include_logs` | Also return log rows tied to matched instructions. |

**`instruction_address`:** When you join logs or instructions, this array encodes **where** the instruction sits in the transaction: outer-only indices use one element, e.g. `[2]` = third top-level instruction; inner instructions append an index, e.g. `[2, 0]` = first inner instruction inside that outer instruction.

### TransactionSelection

| Field | Description |
|---|---|
| `fee_payer` | Match fee payer pubkey. |
| `success` | `true` = succeeded only, `false` = failed only, **omitted** = both (same pattern as `is_inner`). |
| `include_instructions` | Also return all instructions in matched transactions. |

### LogSelection

| Field | Description |
|---|---|
| `program_id` | Match log emitter program. |
| `kind` | Parsed log line category (see below). |
| `include_transaction` | Also return parent transaction. |
| `include_instruction` | Also return related instruction rows. |

#### Log `kind` values

These mirror the usual Solana runtime log line shapes (see the [transactions](https://solana.com/docs/core/transactions) docs and your RPC `logsSubscribe` / meta log output for raw strings).

| `kind` | Typical meaning |
|---|---|
| `invoke` | `Program <id> invoke <depth>` |
| `success` | `Program <id> success` |
| `failure` | `Program <id> failed: ...` |
| `log` | `Program log: ...` |
| `data` | `Program data: <base64>` |
| `other` | Anything else the parser did not classify (full text still in `message`) |

## Field selection

Use `fields` to choose columns per logical table. Omit a table key to receive **all** columns for that table (when rows are returned).

```json
{
  "fields": {
    "block": ["slot", "blockhash", "block_time"],
    "instruction": ["slot", "program_id", "data", "d8"],
    "transaction": ["slot", "fee_payer", "success"]
  }
}
```

### Available fields (by table)

| Table | Fields |
|---|---|
| `block` | `slot`, `blockhash`, `parent_slot`, `parent_blockhash`, `block_time`, `block_height` |
| `transaction` | `slot`, `transaction_index`, `signatures`, `fee_payer`, `success`, `err`, `fee`, `compute_units_consumed`, `account_keys`, `recent_blockhash`, `version`, `loaded_addresses_writable`, `loaded_addresses_readonly` |
| `instruction` | `slot`, `transaction_index`, `instruction_address`, `program_id`, `accounts`, `data`, `d1`, `d2`, `d4`, `d8`, `a0`-`a9`, `is_inner`, `is_committed` |
| `log` | `slot`, `transaction_index`, `instruction_address`, `program_id`, `kind`, `message` |
| `balance` | `slot`, `transaction_index`, `account`, `pre`, `post` |
| `token_balance` | `slot`, `transaction_index`, `account`, `mint`, `owner`, `pre_amount`, `post_amount` |
| `reward` | `slot`, `pubkey`, `lamports`, `post_balance`, `reward_type`, `commission` |

**`is_committed` (instruction):** Whether this instruction row is part of the **executed** instruction trace for the landed transaction (as opposed to being present only for structural / edge cases). Always interpret next to `transaction.success` and `transaction.err`: failed transactions can still include instructions up to the failure point.

## Limits (optional)

Advanced knobs (defaults are usually fine):

| Field | Role |
|---|---|
| `max_num_blocks` | Cap rows returned per table (approximate server-side bound). |
| `max_num_transactions` | Same, for `transactions`. |
| `max_num_instructions` | Same, for `instructions`. |
| `max_num_logs` | Same, for `logs`. |

## Response

Top-level keys include `next_slot`, `total_execution_time_ms`, optional `rollback_guard`, and one array per table when present: `blocks`, `transactions`, `instructions`, `logs`, `balances`, `token_balances`, `rewards`—each holds **row objects** shaped by your `fields` selection.

### Example fragment (illustrative)

```json
{
  "next_slot": 391800050,
  "total_execution_time_ms": 12,
  "rollback_guard": null,
  "blocks": [
    {
      "slot": 391800000,
      "blockhash": "8dK...",
      "block_time": 1731000123
    }
  ],
  "instructions": [
    {
      "slot": 391800000,
      "program_id": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "accounts": ["7xK...", "9mY...", "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
      "data": "<opaque encoded payload>"
    }
  ],
  "transactions": []
}
```

- Pubkeys in filters and in many columns are **base58** strings.
- Instruction `data` is an **encoded payload** (treat as opaque unless you decode it); for filtering, prefer the hex **discriminator** fields (`d1` / `d2` / `d4` / `d8`) in the query body.
- On failure, `transaction.err` carries the chain's error structure (object or string depending on field selection).

### Pagination

Use the response's `next_slot` as the **next** request's `from_slot`.

**Bounded scan** (you set `to_slot`): repeat while `next_slot < to_slot`. When `next_slot >= to_slot`, the range `[from_slot, to_slot)` is exhausted.

**Unbounded / to head** (no `to_slot`, or you stop at live head): repeat while `next_slot` **strictly increases** between requests. If `next_slot` is not greater than the previous `from_slot`, you have caught up to the server's head or hit a limit—stop or backoff.

The server may stop early after a time or size budget; a single response can cover more or fewer slots than requested depending on filter density.

### Reorg detection (`rollback_guard`)

`rollback_guard` is **`null`** when the response does **not** overlap the unfinalized / risky tip region. When it is **present**, the fields tie the returned batch to a specific head blockhash so you can detect shallow reorgs between paginated calls.

**Algorithm (defensive):**

1. Let `G` be `rollback_guard` from response _n_. If `G` is null, skip reorg checks for that page (data is from finalized-safe depth).
2. When `G` is present, record `G.blockhash` and `G.first_previous_blockhash` together with the span of slots you believe you have ingested from that page.
3. On response _n+1_, if both pages have a non-null `rollback_guard`, compare response _n_'s **`rollback_guard.blockhash`** to response _n+1_'s **`rollback_guard.first_previous_blockhash`**. They should chain the same parent hash across the gap you queried; if they **differ**, a **reorg** occurred between the two calls—re-sync from a finalized slot or from the parent you still trust.
4. If a reorg **deeper** than your last page (your highest ingested slot is no longer on the winning fork), matching on parent blockhash alone may not fire until you overlap the new tip again—**never assume slot numbers alone are stable identifiers**; always reconcile with `blockhash` / `parent_blockhash` when consuming near-head data.

Example `rollback_guard` payload (field names only—values are illustrative):

```json
{
  "slot_number": 391800099,
  "timestamp": 1731000000,
  "blockhash": "8dK...",
  "first_slot_number": 391800000,
  "first_previous_blockhash": "3nF..."
}
```

## Authentication

Same **Bearer token** model as EVM HyperSync. See [API tokens](/docs/HyperSync/api-tokens).
