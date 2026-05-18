---
id: solana
title: Solana
sidebar_label: Solana
slug: /solana
description: Early Solana support in HyperIndex. Slot Handler, Effect API, and Envio Cloud today; deeper instruction/log-level handlers in progress.
---

:::info Early — and the right moment to shape it
Solana support in HyperIndex is **early**. The slot handler, the Effect API, and Envio Cloud deployment all work today, and teams are using them for real workloads. The higher-level abstractions (instruction-level handlers, IDL-aware decoding, log handlers) are actively being built, and we'd rather help you pick the right path now than have you fight with an early prototype. **If you're evaluating Solana indexing, [reach out on Discord](https://discord.gg/envio)** — we can tell you which pieces are stable, which are still moving, and often suggest a better data path for your specific use case (NFTs, AMMs, token flows, wallet activity, custom programs, etc.).
:::

## What's supported today

- [Slot Handler](/docs/v2/HyperIndex/block-handlers) — `indexer.onSlot` for slot-driven indexing.
- [Effect API](/docs/v2/HyperIndex/effect-api) — pull additional data on demand from RPC or any source.
- [Envio Cloud](/docs/v2/HyperIndex/hosted-service) — deploy and host Solana indexers the same way as EVM ones.
- **Raw Solana data via [HyperSync](/docs/HyperSync/solana)** — slots, transactions, instructions, logs, balances, token balances, rewards. Today HyperSync is consumed directly (Rust client or HTTP); we recommend it as the starting point for any workload that needs more than slot-level orchestration.

## Quickstart

```bash
pnpx envio init svm
```

## What's stable vs. what's still evolving

**Stable enough to build on**

- The `onSlot` handler API and the project layout produced by `envio init svm`.
- The Effect API for fetching slot data on demand.
- Envio Cloud deployment for Solana indexers.
- The underlying HyperSync query shape and table model (see [HyperSync for Solana](/docs/HyperSync/solana#whats-stable-vs-whats-still-evolving)).

**Still evolving — check in if you depend on these**

- Instruction-level and log-level handlers (today you fetch by slot and decode yourself, or query HyperSync directly).
- IDL-aware decoding and program-aware helpers inside HyperIndex.
- Reorg handling — HyperIndex Solana currently tracks **finalized slots only**, resulting in **~20s latency**.
- HyperSync as a first-class source inside HyperIndex (today the slot handler is RPC-driven; HyperSync is consumed directly).

If the piece you need is in the second list, please talk to us before building around the limitation — there's a good chance we can sequence the work to unblock you, or suggest a HyperSync-direct path that gets you the data you need today.

## Recommended path for new projects

For most Solana use cases today, the fastest path to useful data is:

1. **Start with [HyperSync for Solana](/docs/HyperSync/solana)** to validate that the raw data you need (instructions, accounts, logs, token balances) is available and shaped the way you expect.
2. **Use the HyperIndex `onSlot` handler + Effect API** for orchestration, state, and derived entities on top of that data.
3. **Tell us what you're building** — we'll point you at the right primitive and let you know what's about to land.

## Working with us

This is genuinely a good time to be a design partner on Solana:

- **[Discord](https://discord.gg/envio)** — fastest way to reach the team.
- Share a sample program, transaction signature, or the entities you need to index, and we'll map it to a concrete plan.
- Missing a field, decoder, or handler shape? File it on [GitHub](https://github.com/enviodev/hyperindex/issues) or tell us on Discord — early feedback shapes what ships next.
