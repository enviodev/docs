---
id: solana-query
title: Solana Query & Response
sidebar_label: Query & Response
slug: /solana-query
description: Solana HyperSync query schema, filters, field selection, pagination, and reorg handling.
---

# Query & Response

:::info Early access
Solana HyperSync is early, but the query shape, filters, and tables below are the ones we expect to keep. See [What's stable vs. what's still evolving](./solana#whats-stable-vs-whats-still-evolving), and [reach out on Discord](https://discord.gg/envio) if you're planning a real workload. Data is kept in a **rolling retention window**; use `GET /height` instead of hard-coding how far back you can query.
:::

A query selects a slot range, optional filters on instruction calls / transactions / logs / account activity, and the columns you want. The server returns matched rows plus a `next_slot` cursor. Some slots have no block, so `blocks` can be sparse across the requested range.

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
  "field_selection": { ... }
}
```

- `from_slot` is **inclusive**, `to_slot` is **exclusive**. Omit `to_slot` to run toward the current head.
- Within one selection object, all set fields are **AND**-ed. Multiple objects within one array are **OR**-ed. Different arrays are **AND**-ed against each other (see the warning below).
- If every selection array is absent or empty, the query matches every slot in range: all block rows, plus their `account_activity` and `reward` rows, come back one slot at a time (even when `field_selection` names only `block`). This is heavy; keep the range small. `include_all_blocks: true` returns every block header in range even when filters are set (by default only blocks with a match are returned).

:::warning A second selection array narrows the result, it does not widen it
Selections in **different** arrays are intersected. Adding a `transactions` filter next to an `instruction_calls` filter returns only the instructions whose transaction also matches; a selection that matches nothing zeroes **every** table in the response, with no error or warning.

Measured on slot 437500000:

| Query | Instruction rows |
|---|---|
| `instruction_calls: [{executing_account: [Tokenkeg...], d1: ["03"]}]` alone | 44 |
| `transactions: [{fee_payer: [P]}]` alone, where P paid for one of those transactions | 16 |
| both together | **2** |
| the instruction filter plus `transactions: [{fee_payer: ["1111...1111"]}]` (matches nothing) | **0** |

**For a union, send separate queries and merge.** This is about which rows match; whether a matched row's *related* rows come back is decided by `field_selection` (see [Join behavior](#join-behavior)).
:::

:::caution Unknown top-level keys are rejected
The top-level query object and `field_selection` are strict: an unrecognized key (a removed table such as `balances` / `token_balances`, the removed `include_account_activity` flag, or a misspelled `max_num_*`) fails the whole query rather than silently widening it. Keys **inside** a selection object are still ignored if unknown. To request every activity row in a range, use an empty selection: `"account_activity": [{}]`.
:::

Several keys were renamed; legacy names are still accepted on input, but responses use the new names. See [Renamed fields and compatibility](#renamed-fields-and-compatibility).

## Filters

### InstructionSelection

Selects **instruction calls** (a single program invocation, including inner CPIs). Array key: `instruction_calls` (legacy: `instructions`).

| Field | Description |
|---|---|
| `executing_account` | Match the invoked program (base58 pubkeys). Legacy: `program_id`. |
| `d1` / `d2` / `d4` / `d8` | First _N_ bytes of instruction data as hex; `0x` prefix optional (`"0x03"` and `"03"` are equivalent). |
| `a0` - `a9` | Account pubkey at that **index in the instruction's account metas** (`a0` = first). Which index is "the mint", "the pool", etc. is defined by the program's IDL, not by Solana globally. |
| `is_inner` | `true` = inner only, `false` = outer only, omitted = both. |
| `tx_success` | `true` = instructions of successful transactions only, `false` = failed only, omitted = both. Legacy: `is_committed`. |

`tx_success` is the success of the **parent transaction**, applied to every instruction call of that transaction (Solana metadata only records instructions that actually ran). Set `"tx_success": true` to drop failed transactions server-side. `"tx_success": false` can legitimately match nothing: servers running the failed-transaction trim keep no instruction rows for failed transactions; the transactions themselves are still served (with `err` and `fee`) via the `transactions` table's `success` filter.

### TransactionSelection

| Field | Description |
|---|---|
| `fee_payer` | Match fee payer pubkey. |
| `transaction_id` | Match by `signatures[0]` (base58), the canonical Solana transaction signature. |
| `transaction_index` | Match by `transaction_index`. See [`transaction_index` semantics](#transaction_index-semantics). |
| `success` | `true` = succeeded only, `false` = failed only, omitted = both. |

### LogSelection

| Field | Description |
|---|---|
| `program_id` | Match log emitter program. |
| `kind` | Parsed log line category (below). |

| `kind` | Typical meaning |
|---|---|
| `invoke` | `Program <id> invoke <depth>` |
| `success` | `Program <id> success` |
| `failed` | `Program <id> failed: ...` |
| `consumed` | `Program <id> consumed <n> of <m> compute units` |
| `log` | `Program log: ...` |
| `data` | `Program data: <base64>` |
| `other` | Anything else (full text still in `message`) |

An unknown `kind` in a filter is an error; on the response side an unrecognized value decodes as `other`. Not every range carries the `invoke` / `success` / `failed` / `consumed` lines: SQD-ingested and default RPC-ingested ranges only carry `log` / `data` / `other`, so do not assume every invocation has an `invoke` row.

### AccountActivitySelection

Selects rows of the unified [`account_activity`](#the-account_activity-table) table (native SOL and SPL token movements). An empty selection `{}` matches every row in range without forcing every block into the response.

| Field | Description |
|---|---|
| `kind` | `"native"` (the rows the old `balances` table held), `"token"` (the old `token_balances` rows), or omitted for both. |
| `account` | Match by account address: the token account on a **token** row, the wallet on a **native** row. |
| `transaction_id` | Match by the transaction's base58 `signatures[0]`. |
| `mint` | Match by mint. Only token rows carry a mint, so this restricts to token activity. |
| `owner` | Match by owner (wallet). The stored column is split into `pre_owner` / `post_owner`; this filter matches **either** side, so an in-transaction `SetAuthority(AccountOwner)` change still matches. |
| `program_id` | Match by token program id (SPL Token vs Token-2022), pre or post. |
| `is_signer` / `is_writable` / `is_fee_payer` / `from_lookup_table` | Header-derived position flags. A null flag matches neither `true` nor `false`. |

Because `account` means different things on the two sides, "everything for wallet W" is **two** selections: `[{ "account": ["W"] }, { "owner": ["W"] }]`.

## Field selection

`field_selection` chooses columns per table. Omit a table key to receive **all** columns for that table.

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
| `transaction` | `slot`, `transaction_index`, `transaction_id`, `signatures`, `fee_payer`, `success`, `err`, `fee`, `compute_units_consumed`, `account_keys`, `recent_blockhash`, `version`, `loaded_addresses_writable`, `loaded_addresses_readonly`, `has_dropped_log_messages` |
| `instruction_call` | `slot`, `transaction_index`, `instruction_address`, `executing_account`, `executing_account_index`, `account_arguments`, `account_index_arguments`, `data`, `d1`, `d2`, `d4`, `d8`, `a0`-`a9`, `is_inner`, `tx_success`, `error`, `compute_units_consumed` |
| `log` | `slot`, `transaction_index`, `instruction_address`, `program_id`, `kind`, `message` |
| `account_activity` | `slot`, `transaction_index`, `transaction_id`, `account_index`, `account`, `pre_balance`, `post_balance`, `is_signer`, `is_writable`, `is_fee_payer`, `from_lookup_table`, `mint`, `pre_owner`, `post_owner`, `token_decimals`, `pre_token_balance`, `post_token_balance`, `pre_program_id`, `post_program_id`, `token_state` |
| `reward` | `slot`, `pubkey`, `lamports`, `post_balance`, `reward_type`, `commission` |

Field notes:

- **`tx_success`** (instruction call): see [InstructionSelection](#instructionselection). Legacy column name: `is_committed`.
- **`instruction_address`** (instruction call, log): where the instruction sits in the transaction: `[2]` = third top-level instruction; `[2, 0]` = first inner instruction inside it.
- **`data` / `d1`-`d8`** (instruction call): hex-encoded instruction bytes, without a `0x` prefix in responses even if your filter used one.
- **`executing_account_index` / `account_index_arguments`** (instruction call): positions of the executing account and account arguments in the transaction's resolved key list (`account_keys` ++ ALT writable ++ ALT readonly). Null when the source could not resolve positions.
- **`error` / `compute_units_consumed`** (instruction call): per-invocation failure reason (e.g. `"custom program error: 0x1"`) and compute units. SQD serves both directly; RPC and Firehose ranges derive them from the `Program <id> failed` / `consumed` log lines, so both are null where the source did not record them.
- **`has_dropped_log_messages`** (transaction): `true` when the validator truncated this transaction's logs, so its `logs` rows are incomplete. Null means the source could not say.
- **`transaction_id`** (transaction) and **`token_state`** (account activity) are computed at serving time but selected like any other field. `token_state` is `not_a_token`, `opened` (token account created in this transaction), `closed`, or `persisted`; select it instead of inferring "is this a token row" from null `mint`.

### Value types in responses

- **Every response field is optional.** A missing value means "not selected, or the source could not supply it", never zero or false.
- **Addresses, hashes and signatures are base58 strings**, parsed strictly (32 bytes for a pubkey/blockhash, 64 for a signature). A malformed value in a filter is an error, not a filter that silently matches nothing.
- **Token balances are strings.** `pre_token_balance` / `post_token_balance` are raw base units (scale by `token_decimals`) as decimal strings, so JavaScript consumers don't lose precision above 2^53. Raw SPL amounts are `u64` on-chain in both SPL Token and Token-2022. Lamport fields (`pre_balance` / `post_balance`, `fee`) stay numeric.

### `transaction_index` semantics

`transaction_index` is a dense `0..n` rank over the **stored, non-vote** transactions of a slot, in block order. It is **not** the transaction's original position in the block: vote transactions are excluded at ingest, and every source is renumbered onto the same key. `(slot, transaction_index)` is the join key tying `instruction_calls`, `logs`, and `account_activity` rows to their transaction; do not compare it against an index from an RPC `getBlock` response.

### The account_activity table

`account_activity` replaces the old `balance` and `token_balance` tables. Each row is one account's activity in one transaction:

- **Native side** (`pre_balance`, `post_balance`, lamports): populated when the account's SOL balance changed, null otherwise.
- **Token side** (`mint`, `pre_owner`, `post_owner`, `token_decimals`, `pre_token_balance`, `post_token_balance`, `pre_program_id`, `post_program_id`): populated when the account appears in the transaction's token-balance metadata, null otherwise.

A row commonly carries both sides, since a token account also holds lamports; the two are independent axes (for wrapped SOL, lamports equal the token amount plus the rent-exempt reserve). A null `pre_owner` means the token account was opened in this transaction, a null `post_owner` that it was closed (same convention for `pre_program_id` / `post_program_id`). `account_index` is the account's position in the transaction's resolved key list; the flags (`is_signer`, `is_writable`, `is_fee_payer`, `from_lookup_table`) come from the message header and are null where a source could not supply them.

## Join behavior

The server joins related rows based on which tables you include in `field_selection`: filter on `instruction_calls` and also select `transaction` fields, and you get the parent transaction for each matched instruction. There is currently a single default join mode; finer control (matched rows only, or all rows of matched transactions) is planned. Tell us on [Discord](https://discord.gg/envio) or [GitHub](https://github.com/enviodev/hypersync-client-solana/issues) if you need it.

## Limits (optional)

Approximate server-side caps on rows returned per table: `max_num_blocks`, `max_num_transactions`, `max_num_instructions` (this key keeps the legacy noun; `max_num_instruction_calls` is rejected), `max_num_logs`, `max_num_account_activity`. Defaults are usually fine.

## Response

Top-level keys: `next_slot`, `total_execution_time_ms`, optional `rollback_guard`, and one key per table when present: `blocks`, `transactions`, `instruction_calls`, `logs`, `account_activity`, `rewards`.

:::caution Each table is an array of row **batches**, not a flat array of rows
`instruction_calls` is `[[row, row, ...], ...]`, the same framing EVM HyperSync uses for `data`. A single response is usually one batch, so `table[0]` looks like it works until it hands you a batch instead of a row. Flatten first: in `jq`, `[.instruction_calls[][]]`, and the row count is `[.instruction_calls[][]] | length`. Batches carry no meaning of their own (they do not correspond to blocks or transactions).
:::

```json
{
  "next_slot": 391800050,
  "total_execution_time_ms": 12,
  "rollback_guard": null,
  "blocks": [[{ "slot": 391800000, "blockhash": "8dK...", "block_time": 1731000123 }]],
  "instruction_calls": [[{
    "slot": 391800000,
    "executing_account": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    "account_arguments": ["7xK...", "9mY...", "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
    "data": "33e685a4017f83ad2e0f27c68d080000c61cf79a00000000",
    "tx_success": true
  }]],
  "transactions": []
}
```

Instruction `data` is the raw instruction bytes as hex; for filtering, use the discriminator fields (`d1` / `d2` / `d4` / `d8`). On failure, `transaction.err` is the chain's error structure as a JSON-encoded **string** (e.g. `"{\"InstructionError\":[2,{\"Custom\":2}]}"`), so parse it before inspecting it.

### Pagination

Use the response's `next_slot` as the next request's `from_slot`.

- **Bounded scan** (`to_slot` set): repeat while `next_slot < to_slot`.
- **To head** (no `to_slot`): repeat while `next_slot` strictly increases. If it doesn't, you've caught up to the head or hit a limit; back off.

The server may stop early on a time or size budget, so a single response can cover more or fewer slots than requested.

### Reorg detection (`rollback_guard`)

`rollback_guard` describes the **server's current in-memory head window**, not the slots in the response: `slot_number` / `blockhash` are the last slot in the window and its hash, `first_slot_number` / `first_previous_blockhash` the first slot in the window and its parent hash. It is present on most responses, including ones far behind head, and `null` when the server has no complete window to describe. The shape mirrors the EVM `RollbackGuard` with Solana naming.

```json
{
  "slot_number": 391800099,
  "timestamp": 1731000000,
  "blockhash": "8dK...",
  "first_slot_number": 391800000,
  "first_previous_blockhash": "3nF..."
}
```

Use it to detect a shallow reorg before committing near-head data: if you have already ingested `first_slot_number - 1` or `slot_number`, compare the blockhashes you stored for them against `first_previous_blockhash` / `blockhash`. A mismatch means what you ingested is no longer on the server's head fork; re-sync from a finalized slot or the newest slot whose hash still agrees. The window moves between calls, so do not compare one page's guard against the next page's, and never treat slot numbers alone as stable identifiers near head; reconcile with `blockhash` / `parent_blockhash`.

## Renamed fields and compatibility

Legacy names are still accepted on input, but responses use the new names.

| Location | Legacy name | Current name |
|---|---|---|
| Top-level query | `instructions` | `instruction_calls` |
| `InstructionSelection` | `program_id` | `executing_account` |
| `InstructionSelection` | `is_committed` | `tx_success` |
| `field_selection` | `instruction` | `instruction_call` |
| `instruction_call` field | `program_id` | `executing_account` |
| `instruction_call` field | `accounts` | `account_arguments` |
| `instruction_call` field | `is_committed` | `tx_success` |

**Removed, not renamed** (each is a loud error because the envelope rejects unknown keys):

- The `balance` / `token_balance` field-selection tables and the top-level `balances` / `token_balances` selections: use `account_activity`.
- The top-level `include_account_activity` flag: use `"account_activity": [{}]`.
- The `account_activity.owner` **column**, split into `pre_owner` / `post_owner`. The `owner` **filter** is unchanged and matches either side.

## Authentication

Same **Bearer token** model as EVM HyperSync. See [API tokens](/docs/HyperSync/api-tokens).
