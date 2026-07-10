---
title: "Envio vs The Graph"
sidebar_label: Envio vs The Graph
slug: /envio-vs-the-graph
description: "A benchmark-backed, head-to-head comparison of Envio and The Graph. Covers sync speed, TypeScript vs AssemblyScript, multichain indexing, reorg handling, and how to migrate a subgraph."
image: /blog-assets/envio-vs-the-graph.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-07-10
  author: Jords
---

<img src="/blog-assets/envio-vs-the-graph.png" alt="Envio vs The Graph" width="100%"/>

<!--truncate-->

:::note TL;DR
- Envio HyperIndex and The Graph take different approaches to indexing EVM data. This is a sourced, head-to-head comparison of the two.
- Sync speed is the clearest gap. In the independent [Sentio benchmark](/docs/HyperIndex/benchmarks), HyperIndex finished the Uniswap V2 Factory workload in 8 seconds against 19 minutes for The Graph, 142x faster.
- HyperIndex handlers are standard TypeScript in Node with any npm package. The Graph uses AssemblyScript compiled to WebAssembly.
- HyperIndex indexes every chain from one `config.yaml`. The Graph deploys one subgraph per chain.
- If you do decide to switch, migration is a [documented flow](/docs/HyperIndex/migration-guide), your existing subgraph queries keep working through Envio's query converter, and teams like Katana, Revert Finance, and Sablier have already moved. For the wider field, see [Best Blockchain Indexers in 2026](/blog/best-blockchain-indexers-2026).
:::

Most teams reach for The Graph first, because subgraphs are the incumbent way to index EVM data, the approach most developers already know. The questions tend to start later, when syncs drag, a schema change means a long backfill, or you need the same data across several chains. That is usually when Envio HyperIndex comes up.

This is a direct comparison of the two. We put them head to head on what actually separates them, sync speed, the language you write handlers in, multichain support, and reorg handling, then cover what switching involves. For the wider field of indexers, our [2026 indexer comparison](/blog/best-blockchain-indexers-2026) ranks Envio, The Graph, Goldsky, SubQuery, Subsquid, Ormi, and Ponder side by side.

## Sync Speed

Speed is the clearest difference, and it is well documented. HyperIndex pulls data through [HyperSync](/docs/HyperSync/overview), Envio's Rust data engine, which delivers up to 2000x faster data access than standard RPC. HyperIndex can also index over a standard RPC endpoint, either for chains HyperSync does not yet support or if you would rather not use it. The Graph reads through standard RPC only.

In the independent Sentio Uniswap V2 Factory benchmark, HyperIndex finished in 8 seconds against 19 minutes for The Graph, 142x faster. On the Sentio LBTC workload, it finished in 3 minutes against 3 hours 9 minutes. Full methodology is on the [benchmarks page](/docs/HyperIndex/benchmarks), with the raw runs in the [open-indexer-benchmark repo](https://github.com/enviodev/open-indexer-benchmark). Fast sync matters beyond backfills, because a schema change means re-syncing in hours rather than days.

## Handler Language, TypeScript vs AssemblyScript

The Graph's mappings are written in AssemblyScript, a strict subset of TypeScript that compiles to WebAssembly. The syntax looks familiar, but the runtime is not. Standard npm packages do not run, common idioms like optional chaining and class inheritance are restricted, and numbers use AssemblyScript BigInt rather than native JS BigInt.

HyperIndex handlers are standard TypeScript executed in Node. Any npm package works, generated types come from both your GraphQL schema and your contract ABIs, and there is no WebAssembly step. For teams already writing TypeScript across their stack, this is the difference felt every day.

## Multichain Indexing

A subgraph is deployed per chain. Indexing the same protocol on Ethereum and Base means two subgraphs, and cross-chain reads happen in your application layer.

HyperIndex declares every chain under a single `chains` array in one `config.yaml`. Adding a chain is one more entry with a chain ID and address, reusing the same contract definition and event signatures, and cross-chain queries run at the database layer behind one GraphQL endpoint. Sablier runs a single indexer across 27 chains this way.

Read more about [multichain indexing](/docs/HyperIndex/multichain-indexing) in our docs.

## Reorg Handling

Reorgs are the most common chain-level event a production indexer has to survive. On The Graph, graph-node reverts affected entities automatically when a reorg is detected, bounded by its reorg threshold and prune settings, and because each chain is its own subgraph, multichain coverage means handling that across several deployments.

HyperIndex tracks per-entity state history for every unfinalised block at the framework level, with rollback on by default. When a reorg happens, the framework rolls each entity back to its pre-reorg state and reprocesses forward against the canonical chain, then prunes history once a block finalises. No handler code is required. The details are in [Reorgs Support](/docs/HyperIndex/reorgs-support).

## Head-to-Head at a Glance

<div className="scroll-table" tabIndex={0} role="region" aria-label="Envio vs The Graph comparison table">

| Comparison Point | Envio HyperIndex | The Graph |
| --- | --- | --- |
| Handler language | TypeScript in Node, any npm package | AssemblyScript compiled to WebAssembly |
| Multichain | Every chain in one `config.yaml` | One subgraph per chain |
| Data source | HyperSync, up to 2000x faster than RPC, or standard RPC for chains it does not cover | Standard RPC |
| Reorg handling | Framework-level, rollback on by default | Automatic via graph-node, bounded by prune settings |
| Query language | Standard GraphQL, plus a converter for subgraph queries | Custom GraphQL dialect |
| Hosted runtime | Envio Cloud, GitHub-native deploy, or self-host via Docker | Subgraph Studio and the decentralised network |

</div>

## Switching From The Graph

If the comparison points you toward Envio, moving is a [documented flow](/docs/HyperIndex/migration-guide) rather than a rewrite. It comes down to three steps, convert `subgraph.yaml` to `config.yaml`, bring your schema across (close to copy and paste, with the `@entity` directive removed), and port your handlers from AssemblyScript to TypeScript. Running `pnpx envio init` scaffolds the config and schema, your existing subgraph queries keep working through Envio's [query converter](/docs/HyperIndex/query-conversion) tool, and the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) checks both endpoints field-by-field before you cut over.

Because AssemblyScript is a subset of TypeScript, most of the handler work is mechanical, which is why many teams now let an AI assistant do the rewrite. Our [AI migration guide](/docs/HyperIndex/migrate-with-ai) walks Cursor or Claude Code through the port, and [AI-Assisted Subgraph Migration with Claude](/blog/ai-subgraph-migration-hyperindex-claude) shows it end to end.

[Katana](/blog/case-study-katana-sushiswap) moved two production SushiSwap subgraphs off The Graph entity-for-entity. [Revert Finance](/blog/revert-finance-pancakeswap-bnb-hyperindex) had a PancakeSwap V3 subgraph stuck at 70 percent sync on BNB Smart Chain for over two years, and HyperIndex synced it to 100 percent in 10 days across 1.7 billion events. The [Polymarket reference indexer](/blog/polymarket-hyperindex-case-study) consolidated 8 subgraph domains into one indexer that synced 4 billion Polygon events in 6 days. Envio also offers full white-glove migration help.

## The Bottom Line

For most EVM teams, HyperIndex is the stronger choice with faster syncs, TypeScript handlers, multichain from a single config, and a documented path off a subgraph. The one case where The Graph still fits is if you need to consume its existing network of public subgraphs, which is its own ecosystem. For building and running your own indexer, Envio is the better tool.

## Get Started

- [HyperIndex Quickstart](/docs/HyperIndex/quickstart)
- [Migrate from The Graph](/docs/HyperIndex/migration-guide)
- [Migrate using AI](/docs/HyperIndex/migrate-with-ai)
- [Polymarket production reference](/blog/polymarket-hyperindex-case-study)
- [Best Blockchain Indexers in 2026](/blog/best-blockchain-indexers-2026)

## Frequently Asked Questions

### Do My Existing Subgraph GraphQL Queries Work After Switching to Envio?

You do not have to rewrite them by hand. HyperIndex serves standard GraphQL rather than The Graph's dialect, and Envio provides a [query converter tool and conversion guide](/docs/HyperIndex/query-conversion) to translate existing subgraph queries. After switching, the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) compares your new endpoint against the original subgraph field-by-field so you can confirm the data matches before cutting over.

### Can I Keep My Subgraph Schema When Moving to HyperIndex?

Largely yes. Schema migration is close to copy and paste. You remove the `@entity` directive, and there are small nuances around enums and BigDecimals documented in the [schema docs](/docs/HyperIndex/schema). HyperIndex generates its types from the same GraphQL schema and your contract ABIs, so entity definitions and relationships carry across with minimal rework.

### How Long Does a The Graph to Envio Migration Take?

It depends on handler complexity, but the shape is fixed at three steps, config, schema, and handlers. Pure handler logic often copies straight across because AssemblyScript is a subset of TypeScript, and `pnpx envio init` scaffolds the config and schema for you. Teams also use [AI-assisted migration](/docs/HyperIndex/migrate-with-ai) for the rewrite, and Envio offers white-glove help via [Discord](https://discord.gg/envio).

### Can One Envio Indexer Replace Several Per-Chain Subgraphs?

Yes, and it is a common outcome. Because every chain lives in one `config.yaml`, teams routinely consolidate multiple subgraph deployments into a single indexer. Sablier replaced 12 deployments with one indexer across 27 chains, and the [Polymarket reference](/blog/polymarket-hyperindex-case-study) unified 8 subgraph domains into one indexer syncing 4 billion events in 6 days.

### Does Moving to Envio Mean I Lose Access to The Graph's Public Subgraphs?

Yes, and that is the main reason to stay on The Graph. Its decentralised network hosts the largest set of community-maintained subgraphs for major protocols. Envio indexes your own contracts into your own schema, so if your dependency is on consuming those public subgraphs rather than running your own indexer, The Graph is still the right home for that.

### Is HyperIndex Faster Than The Graph in Independent Benchmarks?

Yes. In the independent Sentio Uniswap V2 Factory benchmark, HyperIndex finished in 8 seconds against 19 minutes for The Graph, 142x faster, and on the Sentio LBTC workload it finished in 3 minutes against 3 hours 9 minutes. The gap comes from HyperSync, Envio's Rust data engine, which delivers up to 2000x faster data access than the standard RPC that The Graph reads through. Full methodology is on the [benchmarks page](/docs/HyperIndex/benchmarks) and the raw runs are in the [open-indexer-benchmark repo](https://github.com/enviodev/open-indexer-benchmark).

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use Envio Cloud or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
