---
id: solana-evm-vs-solana
title: EVM vs Solana
sidebar_label: EVM vs Solana
slug: /solana/evm-vs-solana
description: Every difference between indexing EVM chains and Solana with HyperIndex — concepts, config, handlers, and what isn't supported yet.
---

# EVM vs Solana

The HyperIndex workflow is the same on both: define a `config.yaml` and
`schema.graphql`, write handlers, run `codegen`, then `dev`/`start`. What changes
is the unit of work — EVM indexes **events** emitted by **contracts**, Solana
indexes **instructions** executed by **programs**. This page collects every
difference in one place.

## Concept mapping

| EVM | Solana |
| --- | --- |
| Smart contract | Program |
| ABI | Anchor IDL (or an inline schema) |
| Event / log | Instruction |
| `indexer.onEvent` | `indexer.onInstruction` |
| `event.params.<name>` | `instruction.params.args.<name>` |
| Event signature / topic0 | Instruction discriminator |
| Indexed event args | Account positions / `account_filters` |
| `indexer.onBlock` | `indexer.onSlot` |
| Block number | Slot number |
| Address `0x…` (20 bytes, hex) | Pubkey (32 bytes, base58) |
| Internal calls (not surfaced) | Inner instructions / CPIs (first-class) |
| `bigint` params | `u64`+ args as **decimal strings** |

## Config differences

| | EVM | Solana |
| --- | --- | --- |
| `ecosystem` | `evm` (default) | `svm` |
| What you list | `contracts` (with `abi_file_path`, `address`, `events`) | `experimental.programs` (with `program_id`, optional `idl`, `instructions`) |
| Chain identity | `chains[].id` (public chain ID, required) | no `id` — identified by the configured endpoints (chain id is `0` in handlers) |
| `start_block` | block number | **slot** number |
| Matching key | event signature (from ABI) | `discriminator` (hex, 1/2/4/8 bytes) |
| Decoding source | ABI | Anchor IDL, inline `args`+`accounts`, or bundled |
| Field selection | global, rich block/transaction field lists | per-instruction: `transaction_fields`/`block_fields` (field name lists), `token_balance_fields`/`log_fields` (`true`) |
| Reorg options | `rollback_on_reorg`, `save_full_history` | not configurable — finalized data only |

:::note `chains`, not `networks`
Current HyperIndex uses `chains` for both EVM and Solana. (Older versions used
`networks` for EVM — if you see that in an old guide, it's the same idea.)
:::

## Handler differences

**EVM:**

```typescript
indexer.onEvent(
  { contract: "ERC20", event: "Transfer" },
  async ({ event, context }) => {
    const from = event.params.from;       // decoded by ABI
    const amount = event.params.value;    // bigint
    const chainId = event.chainId;
    const contract = event.srcAddress;    // 0x… hex
  },
);
```

**Solana:**

```typescript
indexer.onInstruction(
  { program: "Jupiter", instruction: "sharedAccountsRoute" },
  async ({ instruction, context }) => {
    const params = instruction.params;
    if (!params) return;                          // decode can fail: null-check
    const inAmount = BigInt(params.args.inAmount);  // u64 arrives as decimal string
    const sourceMint = params.accounts.sourceMint;  // base58
    const programId = instruction.programId;        // base58
    const slot = instruction.block.slot;
    const txSig = instruction.transaction.signatures[0]; // needs transaction_fields: [signatures]
    const isInner = instruction.isInner;            // CPI?
  },
);
```

Key handler-level differences:

- **`params` is optional.** EVM `event.params` is always populated (the ABI is known); Solana decoding can fail, so always `if (!params) return;`.
- **Numbers as strings.** `u64`/`u128`/`i64`/`i128` arrive as decimal strings — wrap in `BigInt(...)`. (Smaller ints are JS numbers.)
- **Addresses are base58.** No `0x` lowercase/checksum concerns; pubkeys are base58 strings.
- **Opt in to context.** Transaction fields, token balances, and logs require [field selection](/docs/HyperIndex/solana/configuration#field-selection); on EVM the event always carries block/transaction context.
- **Chain id is `0`.** Single-cluster today; `context.chain.id === 0`.

## CPIs vs internal calls

On EVM, a contract calling another contract doesn't emit a separate indexable
event for the internal call. On Solana, **cross-program invocations are real
instructions** — if you index the inner program, you receive them, with
`isInner: true` and an `instructionAddress` path that reconstructs the call tree.
This makes Solana's composability directly indexable (e.g. the Raydium/Orca swaps
underneath a Jupiter route). See
[Inner instructions](/docs/HyperIndex/solana/instruction-handlers#inner-instructions-cpis).

## Token balances & balance changes

Solana instruction events can carry **pre/post SPL Token balance snapshots** for
the whole transaction (`token_balance_fields: true`). This gives you net token
movement (the balance *change*) without indexing every transfer instruction —
there's no direct EVM equivalent built into the event. See
[Token balances](/docs/HyperIndex/solana/instruction-handlers#token-balances-and-balance-changes).

## Slots vs blocks

- `start_block` is a **slot**. Use `GET https://solana.hypersync.xyz/height` to find the current head; HyperSync keeps a rolling window, so don't hard-code an ancient slot.
- Some slots have **no block** (skipped leader). Slot handlers must handle the empty case.
- The handler arg for `onSlot` is `{ slot: number }`, not a `block` object.

## Not supported on Solana (yet)

These EVM features have no Solana equivalent today:

- **Reorg handling** (`rollback_on_reorg`) — Solana indexes finalized data.
- **No-code contract import** — no `envio init svm contract-import`; configure programs by hand.
- **Account-change / log handlers** — no `onAccount`; logs are an event field, not a handler.
- **Dynamic/factory registration** — no Solana equivalent of [dynamic contracts](/docs/HyperIndex/dynamic-contracts) yet.
- **Wildcard indexing** across all programs.
- **ReScript** — Solana indexers are TypeScript only.
- **Per-field selection** — toggles are `true`/absent, not field-name lists.

What's the same: the [schema file](/docs/HyperIndex/schema), the entity
`context` API, the [Effect API](/docs/HyperIndex/effect-api), local Docker dev,
the GraphQL/Hasura layer, [preload optimization](/docs/HyperIndex/preload-optimization),
and [Envio Cloud](/docs/HyperIndex/hosted-service) deployment.

## Related

- [Solana Overview](/docs/HyperIndex/solana)
- [Configuration](/docs/HyperIndex/solana/configuration)
- [Instruction Handlers](/docs/HyperIndex/solana/instruction-handlers)
- [Decoding & IDLs](/docs/HyperIndex/solana/decoding)
