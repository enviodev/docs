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

A query selects a slot range, optional filters on instructions / transactions / logs / account activity, and the columns you want. The server returns matched rows plus a `next_slot` cursor.

Some slots have **no block**; the `blocks` array can be sparse across the requested slot range.

## Query shape

```json
{
  "from_slot": 391800000,
  "to_slot": 391800100,
  "include_all_blocks": false,
  "instruction_calls": [ ... ],
  "transactions": [ ... ],
  "logs": [ ... ],
  "account_activity": [ ... ],
  "include_account_activity": false,
  "field_selection": { ... }
}
```

- `from_slot` is **inclusive**, `to_slot` is **exclusive**. Omit `to_slot` to run toward the current head.
- Within one selection object, all set fields are **AND**-ed.
- Multiple objects in `instruction_calls`, `transactions`, `logs`, or `account_activity` are **OR**-ed.
- If **`instruction_calls`**, **`transactions`**, **`logs`**, and **`account_activity`** are all absent or empty and **`include_all_blocks`** is false, you get **no matching rows** (empty tables). Set `include_all_blocks: true` to pull block headers across a range without program filters.

:::caution Unknown top-level keys are rejected
The top-level query object and its `field_selection` are strict: an unrecognised key — a table that no longer exists (e.g. the removed `balances` / `token_balances`), or a misspelled `max_num_*` — makes the whole query **fail** rather than being silently ignored. This is deliberate: a dropped table selection would otherwise widen the query to match everything. Individual selection objects (`InstructionSelection`, `AccountActivitySelection`, ...) stay lenient, so an unknown key **inside** a selection is ignored.
:::

:::note Renamed fields (legacy names still accepted)
Several keys were renamed for clarity. Requests using the old names still work — the server accepts them as aliases — but **responses use the new names**. See [Renamed fields and compatibility](#renamed-fields-and-compatibility) for the full mapping. New queries should use the new names shown throughout this page.
:::

## Filters

### InstructionSelection

Selects **instruction calls** — a single program invocation, including inner CPIs. The array key is `instruction_calls` (legacy: `instructions`).

| Field | Description |
|---|---|
| `executing_account` | Match the invoked program (base58 pubkeys). Legacy name: `program_id`. |
| `d1` / `d2` / `d4` / `d8` | First _N_ bytes of instruction data, as hex. **`0x` prefix is optional** (`"0x03"` and `"03"` are equivalent). |
| `a0` - `a9` | Account pubkey at that **index in the instruction's account metas** (`a0` = first account, `a2` = third). Which account is "the mint", "the pool", etc. is **defined by the program's IDL / instruction layout**, not by Solana globally. |
| `is_inner` | `true` = inner only, `false` = outer only, **omitted** = both. |
| `is_committed` | `true` = only instructions of successful transactions, `false` = only instructions of failed transactions, **omitted** = both. See the note below. |

**`is_committed`:** Failed transactions still land on chain, and their instructions (up to the point of failure) are served. `is_committed` is derived from the parent transaction's success, so consumers that count on-chain effects should set `"is_committed": true` to filter failed transactions **server-side** rather than dropping them after the fact.

**`instruction_address`:** This array encodes **where** the instruction sits in the transaction: outer-only indices use one element, e.g. `[2]` = third top-level instruction; inner instructions append an index, e.g. `[2, 0]` = first inner instruction inside that outer instruction.

### TransactionSelection

| Field | Description |
|---|---|
| `fee_payer` | Match fee payer pubkey. |
| `transaction_id` | Match by transaction id (`signatures[0]`, base58) — the canonical Solana transaction signature. |
| `transaction_index` | Match by position within the block (numbers). |
| `success` | `true` = succeeded only, `false` = failed only, **omitted** = both (same pattern as `is_inner`). |

### LogSelection

| Field | Description |
|---|---|
| `program_id` | Match log emitter program. |
| `kind` | Parsed log line category (see below). |

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

### AccountActivitySelection

Selects rows of the unified [`account_activity`](#the-account_activity-table) table (native SOL and SPL token movements). Non-empty fields are AND-ed; an empty selection `{}` matches every row in range. Requesting `account_activity` does **not** force every block in the range to be returned — rows join to their transaction the same way `balances` / `token_balances` used to.

| Field | Description |
|---|---|
| `kind` | Restrict to one side of the merge: `"native"`, `"token"`, or both. `"native"` is exactly the row set the old `balances` table held; `"token"` the row set `token_balances` held. Empty matches every row. |
| `account` | Match by account address. On a **token** row this is the token account (ATA / raw token account); on a **native** row it is the wallet. |
| `transaction_id` | Match by the transaction's base58 `signatures[0]`. |
| `mint` | Match by mint. Only token rows carry a mint, so a non-empty `mint` restricts to token activity. |
| `owner` | Match by owner (wallet) address. |
| `program_id` | Match by token program id (classic SPL Token vs Token-2022); matches either the pre or the post program id. |
| `is_signer` / `is_writable` / `is_fee_payer` / `from_lookup_table` | Header-derived position flags. A **null** flag matches neither `true` nor `false` (unknown is not false). |

Because fields within one selection are AND-ed and `account` means different things on the two sides, "everything for wallet W" is **two** selections: `[{ "account": ["W"] }, { "owner": ["W"] }]`.

## Field selection

Use `field_selection` to choose columns per logical table. Omit a table key to receive **all** columns for that table (when rows are returned).

```json
{
  "field_selection": {
    "block": ["slot", "blockhash", "block_time"],
    "instruction_call": ["slot", "executing_account", "data", "d8"],
    "transaction": ["slot", "fee_payer", "success"]
  }
}
```

### Available fields (by table)

| Table | Fields |
|---|---|
| `block` | `slot`, `blockhash`, `parent_slot`, `parent_blockhash`, `block_time`, `block_height` |
| `transaction` | `slot`, `transaction_index`, `transaction_id`, `signatures`, `fee_payer`, `success`, `err`, `fee`, `compute_units_consumed`, `account_keys`, `recent_blockhash`, `version`, `loaded_addresses_writable`, `loaded_addresses_readonly` |
| `instruction_call` | `slot`, `transaction_index`, `instruction_address`, `executing_account`, `executing_account_index`, `account_arguments`, `account_index_arguments`, `data`, `d1`, `d2`, `d4`, `d8`, `a0`-`a9`, `is_inner`, `is_committed` |
| `log` | `slot`, `transaction_index`, `instruction_address`, `program_id`, `kind`, `message` |
| `account_activity` | `slot`, `transaction_index`, `transaction_id`, `account_index`, `account`, `pre_balance`, `post_balance`, `is_signer`, `is_writable`, `is_fee_payer`, `from_lookup_table`, `mint`, `owner`, `token_decimals`, `pre_token_balance`, `post_token_balance`, `pre_program_id`, `post_program_id` |
| `reward` | `slot`, `pubkey`, `lamports`, `post_balance`, `reward_type`, `commission` |

**`is_committed` (instruction):** `true` when the parent transaction succeeded. Instructions from failed transactions are returned with `is_committed: false` unless you filter them out with `"is_committed": true` in the selection. Interpret it next to `transaction.success` / `transaction.err` when a transaction is included.

**`executing_account_index` / `account_index_arguments` (instruction):** derived columns giving the executing account's and the account arguments' positions within the transaction's resolved account keys. They have no legacy equivalent.

### The account_activity table

`account_activity` is the unified per-(transaction, account) table that replaces the old separate `balance` and `token_balance` tables. Each row is one account's activity in one transaction, carrying the native SOL change, the SPL token balance, or both:

- **Native side** (`pre_balance`, `post_balance`, in lamports) is populated when the account's SOL balance changed in this transaction, null otherwise.
- **Token side** (`mint`, `owner`, `token_decimals`, `pre_token_balance`, `post_token_balance`, `pre_program_id`, `post_program_id`) is populated when the account appears in the transaction's token-balance metadata, null otherwise.

A row commonly carries **both** sides, since a token account also holds lamports; the native and token amounts are independent axes, not two encodings of one value (for wrapped SOL, lamports equal the token amount plus the rent-exempt reserve). `pre_token_balance` / `post_token_balance` are raw base-unit **decimal strings** (scaled by `token_decimals`), not numbers, because Token-2022 amounts can exceed `u64::MAX`. `account_index` is the account's position in the transaction's resolved key list (`account_keys` ++ ALT writable ++ ALT readonly); the flags (`is_signer`, `is_writable`, `is_fee_payer`, `from_lookup_table`) are derived from the message header and are null where a source could not supply them.

## Join behavior

The server automatically joins related rows based on which tables you include in `field_selection`. For example, if your query filters on `instruction_calls` and you also select `transaction` fields, the server returns the parent transaction for each matched instruction — no extra flags needed.

:::note Join modes not yet available
Solana HyperSync currently operates on a single default join mode. More granular control — for example fetching only the directly matched rows with no joins, or fetching all rows belonging to matched transactions — is planned but not yet exposed.

If you have specific join or filtering requirements that the current API cannot satisfy, we would love to hear about your use case. Reach out on [Discord](https://discord.gg/envio) or open an issue on [GitHub](https://github.com/enviodev/hypersync-client-solana/issues).
:::

## Limits (optional)

Advanced knobs (defaults are usually fine):

| Field | Role |
|---|---|
| `max_num_blocks` | Cap rows returned per table (approximate server-side bound). |
| `max_num_transactions` | Same, for `transactions`. |
| `max_num_instructions` | Same, for `instruction_calls`. |
| `max_num_logs` | Same, for `logs`. |
| `max_num_account_activity` | Same, for `account_activity`. |

## Response

Top-level keys include `next_slot`, `total_execution_time_ms`, optional `rollback_guard`, and one array per table when present: `blocks`, `transactions`, `instructions`, `logs`, `account_activity`, `rewards` — each holds **row objects** shaped by your `field_selection`.

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
      "executing_account": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "account_arguments": ["7xK...", "9mY...", "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
      "data": "<opaque encoded payload>",
      "is_committed": true
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

## Renamed fields and compatibility

Several fields were given clearer names. The legacy names are still accepted on input (via aliases), so existing queries keep working, but responses use the new names.

| Location | Legacy name | Current name |
|---|---|---|
| Top-level query | `instructions` | `instruction_calls` |
| `InstructionSelection` | `program_id` | `executing_account` |
| `field_selection` | `instruction` | `instruction_call` |
| `instruction_call` field | `program_id` | `executing_account` |
| `instruction_call` field | `accounts` | `account_arguments` |

The `balance` and `token_balance` field-selection tables were **removed**, not renamed: use `account_activity` instead. Because the query envelope now rejects unknown keys, a query that still selects `balance` / `token_balance` (or the top-level `balances` / `token_balances`) is an error rather than a silently empty result.

## Authentication

Same **Bearer token** model as EVM HyperSync. See [API tokens](/docs/HyperSync/api-tokens).
