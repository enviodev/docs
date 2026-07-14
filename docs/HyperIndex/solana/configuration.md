---
id: solana-configuration
title: Solana Configuration File
sidebar_label: Configuration
slug: /solana/configuration
description: The config.yaml reference for Solana (ecosystem svm) indexers — chains, programs, instructions, discriminators, and field selection.
---

# Solana Configuration File

A Solana indexer is defined by a `config.yaml` with `ecosystem: svm`. It tells
HyperIndex which chain to read, which programs and instructions to match, and how
to decode them. This page is the field-by-field reference; for the *meaning* of
discriminators, IDLs and argument types see [Decoding & IDLs](/docs/HyperIndex/solana/decoding).

Add this line at the top of the file for editor autocompletion and validation:

```yaml
# yaml-language-server: $schema=./node_modules/envio/svm.schema.json
```

## A complete example

```yaml title="config.yaml"
# yaml-language-server: $schema=./node_modules/envio/svm.schema.json
name: my-solana-indexer
description: Index Jupiter swaps and Metaplex NFT mints
ecosystem: svm
chains:
  - start_block: 417995000                 # a SLOT number, not a block
    experimental:
      hypersync_config:
        url: https://solana.hypersync.xyz  # the HyperSync endpoint serving instructions
      programs:
        # --- decoded from an Anchor IDL ---
        - name: Jupiter
          program_id: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4
          idl: idls/jupiter.json
          instructions:
            - name: sharedAccountsRoute
              discriminator: "0xc1209b3341d69c81"
              field_selection:
                token_balance_fields: true
        # --- decoded from an inline schema (no IDL) ---
        - name: Raydium
          program_id: 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8
          instructions:
            - name: swap
              discriminator: "0x09"
              args:
                - { name: amountIn, type: u64 }
                - { name: minAmountOut, type: u64 }
              accounts:
                - tokenProgram
                - amm
                - userSourceTokenAccount
                - userDestTokenAccount
              field_selection:
                token_balance_fields: true
                transaction_fields:
                  - signatures
```

## Top-level fields

| Field | Required | Default | Notes |
| --- | --- | --- | --- |
| `name` | ✅ | — | Project name. |
| `ecosystem` | ✅ | — | Must be `svm`. |
| `chains` | ✅ | — | One or more chains to index (see below). |
| `description` | — | — | Free-text description. |
| `schema` | — | `schema.graphql` | Path to your GraphQL schema. |
| `full_batch_size` | — | `5000` | Batch size for processing. |
| `storage` | — | `postgres: true` | Storage backends (`postgres`, `clickhouse`). |

:::note No EVM-style global fields
For Solana, several EVM top-level fields don't apply: `contracts`,
`rollback_on_reorg`, `save_full_history`, `raw_events`, a global
`field_selection`, and `address_format`. Reorg handling isn't a config knob:
the HyperSync source rolls back on reorg automatically, while the RPC source
indexes finalized data only. Field selection is **per-instruction** only
(see [field selection](#field-selection)).
:::

## `chains`

Each entry is one Solana cluster.

| Field | Required | Default | Notes |
| --- | --- | --- | --- |
| `start_block` | ✅ | - | The **slot** to start indexing from. |
| `experimental` | - | - | HyperSync-backed instruction indexing: `hypersync_config` + `programs` (see below). The key is named `experimental` to signal that this shape is still evolving. |
| `rpc` | - | - | RPC URL. Required only when `experimental` is not set; ignored in favour of the HyperSync source when it is. |
| `end_block` | - | - | Stop at this slot (inclusive of the range processed). Useful for finite backfills and tests. |
| `block_lag` | - | - | Stay this many slots behind the head. |
| `skip` | - | `false` | Skip this chain. |

:::tip EVM difference: no chain `id`
EVM chains require an `id` (the public chain ID). Solana chains have **no `id`** -
the cluster is identified by the endpoints you point at. Inside
handlers the Solana chain id is `0`.
:::

## `experimental`

Everything HyperSync-backed lives under the chain's `experimental` key:

| Field | Required | Default | Notes |
| --- | --- | --- | --- |
| `hypersync_config.url` | ✅ | - | The HyperSync endpoint that serves instructions (e.g. `https://solana.hypersync.xyz`). |
| `programs` | ✅ | - | Solana programs to index on this chain (see below). |

### `programs`

| Field | Required | Default | Notes |
| --- | --- | --- | --- |
| `name` | ✅ | - | A unique name you choose. Used in handlers (`onInstruction({ program: "<name>" })`) and generated types. |
| `program_id` | ✅ | - | The base58 program address. |
| `instructions` | ✅ | - | Instructions to match within this program (see below). |
| `idl` | - | - | Path to an Anchor IDL JSON. If set, HyperIndex derives each instruction's `args` + `accounts` from it. **Mutually exclusive** with per-instruction inline `args`/`accounts`. |
| `handler` | - | auto | Path to the file that registers this program's handlers. By default handler files are auto-loaded. |

## `instructions`

Each entry selects one instruction of the program to index. Only `name` is
required, but in practice you'll add a `discriminator` so HyperIndex can tell your
instruction apart from the program's others.

| Field | Required | Default | Notes |
| --- | --- | --- | --- |
| `name` | ✅ | — | The instruction name. For Anchor IDL programs this should match the IDL instruction (the snake_cased name is used to derive the default discriminator). Also the key in `onInstruction({ instruction: "<name>" })`. |
| `discriminator` | — | — | Hex bytes that identify the instruction (e.g. `"0xc1209b3341d69c81"`). **Modern Anchor IDLs (0.30+) embed it, so HyperIndex reads it automatically; legacy Anchor IDLs and native/inline-schema instructions need it set explicitly.** See [discriminators](/docs/HyperIndex/solana/decoding#discriminators). Without a discriminator (embedded or configured), the instruction matches purely on program + filters and isn't decoded by discriminator. |
| `is_inner` | — | *unset* | `true` = inner (CPI) only, `false` = top-level only, **omitted = matches both**. |
| `args` | — | — | Inline argument schema (Borsh), `{ name, type }` per arg. Requires `accounts` too. Mutually exclusive with the program's `idl`. See [supported types](/docs/HyperIndex/solana/decoding#supported-argument-types). |
| `accounts` | — | — | Inline ordered list of account names. The Nth name labels the Nth account. Requires `args` too. |
| `account_filters` | — | — | Restrict matches by the pubkey in specific account positions (see below). |
| `field_selection` | — | — | Opt into extra data on the event (see below). |

### Field selection

By default a handler receives only the instruction itself, plus its block's
`slot`/`time`/`hash`. Opt into more data per instruction:

| Key | Value | Adds to the handler's `instruction` |
| --- | --- | --- |
| `transaction_fields` | list of field names | `instruction.transaction.<field>` for each selected field: `signatures`, `feePayer`, `success`, `err`, `fee`, `computeUnitsConsumed`, `accountKeys`, `recentBlockhash`, `version`, `transactionIndex`. |
| `block_fields` | list of field names | `instruction.block.<field>` on top of the always-present `slot`/`time`/`hash`: `height`, `parentSlot`, `parentHash`. |
| `token_balance_fields` | `true` | `instruction.transaction.tokenBalances`: pre/post SPL Token balances. Independent of `transaction_fields`. |
| `log_fields` | `true` | `instruction.logs`: program logs scoped to this instruction. |

```yaml
field_selection:
  transaction_fields:
    - signatures
    - feePayer
  block_fields:
    - height
  token_balance_fields: true
  log_fields: true
```

Unselected fields are typed as compile errors in the handler (`FieldNotSelected`),
so reading a field you forgot to select fails at `tsc` time, not silently at
runtime.

### Account filters

Match an instruction only when specific account positions hold specific pubkeys —
useful to index, say, only swaps that touch a particular pool or mint. Positions
are `0`–`5`; within a position `values` are OR-ed, and across positions they are
AND-ed.

```yaml
instructions:
  - name: swap
    discriminator: "0x09"
    account_filters:
      - position: 1
        values:
          - 58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2   # only this pool
```

Use `any_of` to OR several AND-groups together:

```yaml
    account_filters:
      any_of:
        - [ { position: 0, values: [So11111111111111111111111111111111111111112] } ]
        - [ { position: 1, values: [EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v] } ]
```

## Choosing what to index

Solana's highest-frequency programs (SPL Token, System) produce enormous volumes
of instructions. Matching them directly can swamp a backfill. Two practical
patterns:

- **Index DeFi/protocol instructions and read value flow from token balances.**
  Enabling `token_balance_fields` on a protocol instruction gives you the
  transaction's net token movements without indexing every `Transfer`.
- **Scope high-volume instructions with `account_filters` or a tight slot
  window** (`start_block`/`end_block`) when you do need them.

## Related

- [Decoding & IDLs](/docs/HyperIndex/solana/decoding) — discriminators, IDLs, inline schemas, argument types.
- [Instruction Handlers](/docs/HyperIndex/solana/instruction-handlers) — what arrives in the handler.
- [Schema file](/docs/HyperIndex/schema) — defining the entities you write to (same as EVM).
