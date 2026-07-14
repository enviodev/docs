---
id: solana
title: Solana
sidebar_label: Overview
slug: /solana
description: Index Solana programs with HyperIndex — instruction-level handlers, IDL-aware decoding, CPI/inner-instruction support, token balances & balance changes, and slot handlers.
---

# Indexing on Solana

HyperIndex indexes Solana programs at the **instruction level**. You select the
programs and instructions you care about, HyperIndex decodes them — arguments and
accounts — using your Anchor IDL or an inline schema, and writes the results to
Postgres with an auto-generated GraphQL API. Inner instructions (CPIs), **token
balances and balance changes**, transaction metadata and program logs are all
available.

It is powered by [HyperSync for Solana](/docs/HyperSync/solana), the same
high-performance data engine behind EVM indexing, so historical backfills are
fast and you never touch an RPC node for the bulk of indexing.

:::info Early access — and a good time to shape it
Solana support is **experimental and pre-release**. The program/instruction
config surface (the chain-level `experimental` key) may change, and indexers are
**TypeScript-only**. The APIs documented here are
the latest in active development. If you're building on Solana, say hello on
[Discord](https://discord.gg/envio) — we can tell you which pieces are stable,
which are moving, and often suggest a better data path for your use case.
:::

## Two ways to index Solana

| Approach | API | Data source | Use it for |
| --- | --- | --- | --- |
| **Instruction handlers** | [`indexer.onInstruction`](/docs/HyperIndex/solana/instruction-handlers) | HyperSync | The main path — decode and index program instructions (swaps, deposits, mints, transfers…), including inner/CPI instructions, with token balance changes. |
| **Slot handlers** | [`indexer.onSlot`](/docs/HyperIndex/solana/slot-handlers) | RPC (via the [Effect API](/docs/HyperIndex/effect-api)) | Per-slot orchestration, time-series snapshots, or pulling extra data from RPC on a schedule. |

Most indexers use instruction handlers. Slot handlers are for cases where you
need to run logic on a slot cadence rather than react to a specific instruction.
For raw, low-level data you can also query [HyperSync for Solana](/docs/HyperSync/solana) directly.

## Quickstart

```bash
pnpx envio init
```

Choose **Solana** when prompted, then pick a starter template (a Metaplex NFT
instruction indexer, or a minimal slot handler). See
[Getting Started](/docs/HyperIndex/solana/getting-started) for the full walkthrough.

## Mental model: coming from EVM?

If you've used HyperIndex on EVM, the shift is mostly vocabulary:

| EVM | Solana |
| --- | --- |
| Contract + ABI | Program + IDL |
| Event (`onEvent`) | Instruction (`onInstruction`) |
| `event.params` | `instruction.params.args` |
| Topic0 / event signature | Instruction discriminator |
| Block (`onBlock`) | Slot (`onSlot`) |
| Hex addresses `0x…` | Base58 addresses |
| `start_block` = block number | `start_block` = **slot** number |

See [EVM vs Solana](/docs/HyperIndex/solana/evm-vs-solana) for the full picture.

## What's supported today

- **Instruction indexing** via [`indexer.onInstruction`](/docs/HyperIndex/solana/instruction-handlers) — match by program + discriminator.
- **IDL-aware decoding** — point at a standard Anchor IDL (legacy or 0.30+) and HyperIndex derives the argument and account layout. No IDL? Declare an [inline schema](/docs/HyperIndex/solana/decoding#inline-schema-no-idl).
- **Inner instructions (CPIs)** — decoded the same way as top-level ones, with a full instruction-address path so you can reconstruct the call tree.
- **Token balances & balance changes** — pre/post SPL Token (and Token-2022) balances per transaction, so you get the net token movement without indexing every transfer. See [token balances](/docs/HyperIndex/solana/instruction-handlers#token-balances-and-balance-changes).
- **Transaction metadata & logs** — fee payer, fee, compute units, success, signatures, and per-instruction program logs (opt-in via [field selection](/docs/HyperIndex/solana/configuration#field-selection)).
- **Slot handlers** via [`indexer.onSlot`](/docs/HyperIndex/solana/slot-handlers) + the [Effect API](/docs/HyperIndex/effect-api) for RPC enrichment.
- **Local dev + GraphQL + Envio Cloud** — the same workflow and hosting as EVM.

## What is not supported yet

- **Native SOL balance fields on handlers.** Pre/post **token** balances are surfaced today; native SOL (lamport) balances are available via [HyperSync](/docs/HyperSync/solana) directly but not yet as a handler field-selection toggle.
- **Account-change subscriptions.** There is no `onAccount`/program-account handler. Account *state* is available only as the accounts referenced by an instruction (plus per-transaction token balances).
- **A separate log handler.** Logs are a field on the instruction event, not their own handler.
- **No-code contract import.** Solana has no `contract-import` flow — you configure programs/instructions by hand. (IDLs are wired up in `config.yaml`, not auto-imported.)
- **ReScript.** Solana indexers are TypeScript only.
- **Per-field selection.** Field-selection toggles accept `true` only, not field name lists (yet).

If the piece you need is on this list, [tell us on Discord](https://discord.gg/envio) — there's a good chance we can sequence the work to unblock you, or point you at a [HyperSync-direct](/docs/HyperSync/solana) path that gets the data today.

## In this section

- **[Getting Started](/docs/HyperIndex/solana/getting-started)** — scaffold and run your first Solana indexer.
- **[Configuration](/docs/HyperIndex/solana/configuration)** — the `config.yaml` reference for `ecosystem: svm`.
- **[Instruction Handlers](/docs/HyperIndex/solana/instruction-handlers)** — `onInstruction`, the instruction object, token balances, CPIs, testing.
- **[Decoding & IDLs](/docs/HyperIndex/solana/decoding)** — discriminators, Anchor IDLs, inline schemas, supported types.
- **[Slot Handlers](/docs/HyperIndex/solana/slot-handlers)** — `onSlot` and RPC enrichment.
- **[EVM vs Solana](/docs/HyperIndex/solana/evm-vs-solana)** — every difference in one place.
