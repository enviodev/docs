---
title: "How Envio Indexed 4 Billion Polymarket Events"
sidebar_label: "How Envio Indexed 4 Billion Polymarket Events"
slug: /polymarket-hyperindex-case-study
featured: true
tags: ["case-studies"]
keywords: ["case study", "Polymarket", "blockchain indexer", "HyperIndex", "The Graph migration"]
description: "Envio HyperIndex replaced 8 Polymarket subgraphs with one TypeScript indexer on Polygon, syncing 4 billion events in 6 days. Open source reference included."
image: /blog-assets/polymarket-hyperindex-case-study.png
last_update:
  date: 2026-04-15
  author: Jordyn Laurier
---

Co-authors: [Jordyn Laurier](https://x.com/j_o_r_d_y_s), Head of Marketing & Operations, and [Nikhil Bhintade](https://x.com/nikbhintade), Growth Engineer

<img src="/blog-assets/polymarket-hyperindex-case-study.png" alt="Indexing 4 Billion Polymarket Events Using Envio HyperIndex" width="100%"/>

<!--truncate-->

:::note TL;DR
- Polymarket's 8 independent subgraphs on The Graph were replaced with a single Envio HyperIndex indexer written in TypeScript.
- The unified indexer synced over 4,000,000,000 events from block 3,764,531 on Polygon Mainnet in 6 days.
- Handler merging processes each shared contract event once, updating all relevant domains simultaneously rather than redundantly across multiple subgraphs.
- The full indexer is open source at [github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer).
:::

[Polymarket](https://polymarket.com) is one of the most data-intensive protocols in Web3. Every trade, position, fee, liquidity event, and oracle resolution across its entire prediction market ecosystem lives onchain on Polygon. Querying any of it meaningfully requires a serious blockchain indexer.

For years, Polymarket's data infrastructure relied on 8 independent subgraphs on [The Graph](https://thegraph.com), each written in AssemblyScript, each tracking a separate domain, all running since 2021. This post documents how all 8 were replaced with a single Envio HyperIndex indexer, syncing over 4,000,000,000 events in 6 days on Polygon Mainnet.

The indexer is fully open source: [github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer)

## Envio HyperIndex: The Fastest Blockchain Indexer Available

Envio is a real-time multichain blockchain indexing framework for EVM chains. Developers write event handlers in TypeScript and deploy a single indexer that covers multiple contracts, chains, and domains simultaneously.

HyperIndex is independently benchmarked as the fastest blockchain indexer available. In the Uniswap V2 Factory [benchmark run by Sentio](https://github.com/enviodev/open-indexer-benchmark) in May 2025, HyperIndex completed in 1 minute, 143x faster than The Graph and 15x faster than the nearest competitor. In the LBTC benchmark (April 2025), HyperIndex completed in 3 minutes versus 3 hours 9 minutes for The Graph.

This performance comes from [HyperSync](https://docs.envio.dev/docs/HyperSync/overview), Envio's proprietary data engine. Instead of querying RPC endpoints block by block, HyperSync fetches filtered event data in bulk directly from a purpose-built data lake, delivering up to 2,000x faster data access than standard RPC. Polygon is one of 70+ EVM chains supported with native HyperSync coverage.

See full list of HyperSync supported networks here: [https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks)

| Indexer | Time (Uniswap V2 Factory benchmark, Sentio May 2025) | vs HyperIndex |
|---------|------------------------------------------------------|---------------|
| Envio HyperIndex | 1 minute | baseline |
| Subsquid (SQD) | ~15 minutes | 15x slower |
| The Graph | ~143 minutes | 143x slower |
| Ponder | ~158 minutes | 158x slower |

For a full breakdown of how HyperIndex compares across all major blockchain indexers, see the [complete benchmark comparison](https://docs.envio.dev/docs/HyperIndex/benchmarks).

## The Problem: 8 Subgraphs, One Protocol, 4 Years of Fragmentation

Polymarket's indexing infrastructure grew organically alongside the protocol. By the time the architecture was fully established, 8 independent subgraphs were running in parallel on The Graph:

| Subgraph | Domain |
|----------|--------|
| fee-module | Fee refunds from FeeModule and NegRiskFeeModule |
| sports-oracle | UMA sports oracle games, markets, and scores |
| wallet | Wallet creation (Gnosis Safe proxies) and USDC balances |
| orderbook | Exchange order fills, matches, per-token and global volume |
| open-interest | Global and per-market open interest via splits, merges, and redemptions |
| activity | Splits, merges, redemptions, and neg-risk conversions |
| pnl | User positions, weighted average cost basis, and realized PnL |
| fpmm | Fixed Product Market Maker analytics: AMM pools, liquidity, and pricing |

The core problem with this setup is shared contracts. A single `ConditionalTokens` event was being listened for and processed independently across 3 or 4 separate subgraphs. Every shared event meant redundant processing, redundant infrastructure, and fragmented data that required joining across multiple APIs at query time. Handlers were written in AssemblyScript, a stricter WebAssembly-compiled subset of TypeScript, adding tooling overhead and limiting what logic could run inside a handler.

## The Solution: One HyperIndex Indexer on Polygon

### Handler Merging

The defining architectural decision in this indexer is handler merging. Rather than running separate listeners per domain for the same contract event, a single handler fires and updates all relevant entities simultaneously.

A `ConditionalTokens.PositionSplit` event previously triggered separate processing across the open-interest, activity, and pnl subgraphs. In the unified HyperIndex indexer, one handler fires once and simultaneously updates open interest, records the split activity, and adjusts user PnL positions. The event is processed once. That's it.

The full handler structure:

```text
src/
  handlers/
ConditionalTokens.ts       # Open interest + activity + PnL (merged from 4 subgraphs)
Exchange.ts                # Orderbook + PnL
NegRiskAdapter.ts          # Open interest + activity + PnL
FixedProductMarketMaker.ts # FPMM analytics + PnL + LP tracking
FPMMFactory.ts             # Dynamic contract registration
FeeModule.ts               # Fee refund tracking
UmaSportsOracle.ts         # Sports oracle
Wallet.ts                  # Wallet creation + USDC balances
```

### Contracts Indexed

The indexer covers the full surface area of Polymarket's onchain contracts on Polygon:

- **Exchange + NegRiskExchange**: OrderFilled, OrdersMatched, TokenRegistered
- **ConditionalTokens**: ConditionPreparation, ConditionResolution, PositionSplit, PositionsMerge, PayoutRedemption
- **NegRiskAdapter**: MarketPrepared, QuestionPrepared, PositionSplit, PositionsMerge, PayoutRedemption, PositionsConverted
- **FPMMFactory**: FixedProductMarketMakerCreation, with dynamic contract registration for all FPMM instances
- **FixedProductMarketMaker (dynamic)**: FPMMBuy, FPMMSell, FPMMFundingAdded, FPMMFundingRemoved, Transfer
- **FeeModule + NegRiskFeeModule**: FeeRefunded
- **UmaSportsOracle**: GameCreated, GameSettled, MarketCreated, MarketResolved, and more
- **USDC / RelayHub / SafeProxyFactory**: Transfer, TransactionRelayed, ProxyCreation

Dynamic contract registration is handled through `FPMMFactory`. As new Fixed Product Market Maker instances are created onchain, the indexer registers them automatically without a redeployment.

### Schema: 25+ Entity Types Across All Domains

The schema covers every domain previously spread across 8 separate subgraphs, all queryable from a single GraphQL endpoint:

- **Orderbook**: `OrderFilledEvent`, `OrdersMatchedEvent`, `Orderbook`, `OrdersMatchedGlobal`, `MarketData`
- **Open Interest**: `Condition`, `MarketOpenInterest`, `GlobalOpenInterest`, `NegRiskEvent`
- **Activity**: `Split`, `Merge`, `Redemption`, `NegRiskConversion`, `Position`
- **PnL**: `UserPosition`, tracking amount, average price, realized PnL, and total bought per user per token
- **FPMM**: `FixedProductMarketMaker`, `FpmmTransaction`, `FpmmFundingAddition`, `FpmmFundingRemoval`, `FpmmPoolMembership`, `Collateral`
- **Wallet**: `Wallet`, `GlobalUSDCBalance`
- **Fee Module**: `FeeRefunded`
- **Sports Oracle**: `Game`, `Market`

## Envio HyperIndex vs The Graph: Before and After

| | The Graph (8 subgraphs) | Envio HyperIndex (1 indexer) |
|--|-------------------------|------------------------------|
| Language | AssemblyScript | TypeScript |
| Subgraphs / indexers | 8 | 1 |
| Event processing | Redundant across subgraphs | Once per event, merged handlers |
| Cross-domain queries | Requires joining multiple APIs | Single GraphQL endpoint |
| Deployments to maintain | 8 | 1 |

## The Results

The indexer synced Polymarket's full onchain history on Polygon from block 3,764,531 to 100% sync in 6 days, processing over 4,000,000,000 events. The repo includes 29 tests covering all handler phases, including a HyperSync integration test.

Run it locally with `pnpm dev` and compare the data with data from Polymarket subgraphs.

<img src="/blog-assets/polymarket-hyperindex-case-study-1.png" alt="Polymarket indexer sync results" width="100%"/>

Live deployment: [https://envio.dev/app/moose-code/polymarket-indexer/7cad3ad](https://envio.dev/app/moose-code/polymarket-indexer/7cad3ad)

## Why Teams Migrate to HyperIndex from The Graph

Polymarket's setup before this migration is a pattern that shows up across the ecosystem: multiple subgraphs, shared contracts, AssemblyScript handlers, fragmented data. Here is what changes when teams move to HyperIndex:

**Speed.** HyperIndex is 143x faster than The Graph on independent benchmarks. For protocols with years of history like Polymarket, that directly translates to days versus months on historical sync.

**TypeScript, not AssemblyScript.** Handlers are standard TypeScript with generated types from both the schema and ABIs. Any npm package works. No WebAssembly compilation. No AssemblyScript-specific constraints.

**One codebase.** All domains, all contracts, all chains in a single indexer. One deployment to ship, one codebase to maintain, one endpoint to query.

**Single source of truth.** Cross-domain queries happen at the database level, not at the application layer. No joining across APIs at runtime.

**Dynamic contract registration.** Factory contracts that create new instances onchain register them automatically, without requiring a redeployment.

Envio offers white-glove migration support for teams moving from The Graph or any other indexer. The Polymarket indexer is an open-source reference for what a large-scale migration looks like end to end.

## Frequently Asked Questions

### What Is Polymarket?
Polymarket is the world's largest decentralized prediction market, built on Polygon. Users trade outcome shares on real-world events using USDC. All positions, trades, and settlements are handled entirely onchain via smart contracts with no central custodian.

### What Is a Blockchain Indexer?
A blockchain indexer is a system that listens to onchain events and organises them into a structured, queryable database. Developers use blockchain indexers to build fast backends for DeFi protocols, trading interfaces, analytics tools, and onchain AI agents without querying slow RPC endpoints directly.

### What Is the Fastest Blockchain Indexer?
Envio HyperIndex is independently benchmarked as the fastest blockchain indexer available. In the Uniswap V2 Factory benchmark run by Sentio in May 2025, HyperIndex completed in 1 minute, 143x faster than The Graph and 15x faster than the nearest competitor (Subsquid).

### What Is HyperIndex?
HyperIndex is a multichain blockchain indexing framework for EVM chains built by Envio. Developers write event handlers in TypeScript and deploy a single indexer covering multiple contracts, chains, and domains. It uses HyperSync, Envio's proprietary data engine, for historical sync speeds not achievable through standard RPC polling.

### What Is HyperSync?
HyperSync is Envio's high-performance data engine. Instead of querying RPC endpoints block by block, HyperSync fetches filtered event data in bulk from a purpose-built data lake, delivering up to 2,000x faster data access than traditional RPC. 70+ EVM chains have native HyperSync coverage, with any EVM chain accessible via standard RPC.

### How Do I Index Polymarket Data?
The fastest way to index Polymarket data on Polygon is with Envio HyperIndex and HyperSync. The full open-source reference implementation is available at [github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer). It covers all 8 domains of Polymarket's onchain activity and syncs the full history in 6 days.

### How Long Does It Take to Index Polymarket's Full History on Polygon?
Using Envio HyperIndex with HyperSync, the full historical sync of Polymarket's onchain data on Polygon, over 4,000,000,000 events from block 3,764,531, completed in 6 days.

### How Do I Migrate From The Graph to HyperIndex?
Because HyperIndex handlers are written in TypeScript, and AssemblyScript is a subset of TypeScript, most handler logic can be carried across directly. Envio also provides a full [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide), a CLI validation tool to compare output between both endpoints, and white-glove migration support. The Polymarket indexer is a concrete open-source reference for a large-scale migration from The Graph.

### Does HyperIndex Support Dynamic Contract Registration?
Yes. New contract instances created onchain, like Polymarket's FPMM pools, are registered dynamically by a factory handler without requiring a redeployment.

### What Chains Does Envio Support?
Envio supports any EVM chain. 70+ EVM chains have native HyperSync coverage for maximum speed, including Polygon, Ethereum, Base, Arbitrum, Optimism, and more. Any EVM chain without native HyperSync support can be indexed via standard RPC.

## Get Started

The Polymarket indexer is fully open source and available as a production reference for anyone building on Polygon or migrating from The Graph. For a hands-on guide to streaming Polymarket trade data in real time, see [How to Track Polymarket Trades Using Envio HyperSync](https://docs.envio.dev/blog/track-polymarket-trades-hypersync).

- Repo: [https://github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer)
- Live deployment: [https://envio.dev/app/moose-code/polymarket-indexer/7cad3ad](https://envio.dev/app/moose-code/polymarket-indexer/7cad3ad)
- Envio docs: [https://docs.envio.dev/](https://docs.envio.dev/)
- Discord: [https://discord.com/invite/gt7yEUZKeB](https://discord.com/invite/gt7yEUZKeB)
- Telegram: [https://t.me/+kAIGElzPjApiMjI0](https://t.me/+kAIGElzPjApiMjI0)
- Follow us on X: [https://x.com/envio_indexer](https://x.com/envio_indexer)

## Build With Envio

Envio HyperIndex is independently benchmarked as the fastest EVM blockchain indexer available. The Polymarket indexer is one example of what's possible. If you're building onchain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, or talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)