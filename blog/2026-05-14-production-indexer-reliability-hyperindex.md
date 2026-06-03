---
title: Production Indexer Reliability with HyperIndex
sidebar_label: Production Indexer Reliability with HyperIndex
slug: /production-indexer-reliability-hyperindex
description: "Production indexer reliability with HyperIndex: framework reorg rollback, restart-resistant operation, HyperSync data validation, multi data-source recovery, stable Prometheus metrics."
image: /blog-assets/production-indexer-reliability-hyperindex.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-05-14
  author: Jordyn Laurier
---

<img src="/blog-assets/production-indexer-reliability-hyperindex.png" alt="Production Indexer Reliability with HyperIndex" width="100%"/>

<!--truncate-->

:::note TL;DR

- HyperIndex is Envio's multichain blockchain indexing framework for EVM chains. Production reliability lives at the framework level, not bolted on per indexer.
- Reorg handling is built in. Entity state history is tracked for every unfinalized block; the framework rolls back automatically when a chain re-orgs. No handler code required.
- The indexer is restart-resistant. State (including dynamically registered contracts) is persisted to the database and restored on reboot. If a handler fails, the framework restarts automatically without data loss, the indexer resumes from the last committed block.
- HyperSync, Envio's default data engine, ships a robust set of data validation features that RPC does not: block parent hash verification, fork detection, automatic re-sync. The indexer can trust that no events are silently missed, in contrast to raw RPC which only serves whatever the upstream node currently considers canonical.
- Multi data-source recovery falls back to a secondary source on primary outage and attempts to recover to the primary 60 seconds later. The indexer stays alive through upstream RPC and HyperSync failures.
- Polymarket's HyperIndex reference indexer synced its first 4,000,000,000 events in 6 days on Polygon and has indexed over 6,500,000,000 to date. Public at [github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer).

:::

A production indexer fails in three ways. The chain reorgs and the indexer either misses the rollback or hand-rolls bespoke logic that breaks at the next edge case. The data source goes down and the indexer either stalls silently or fails over and never comes back to primary. The indexer hits a counter ceiling, a memory leak in a long-running handler, or another silent failure, and the operator finds out from a downstream outage instead of an alert.

HyperIndex is Envio's multichain blockchain indexing framework for EVM chains. Reliability lives at the framework level so that any indexer built on it inherits the behaviour without writing operational code. Four guarantees compound to keep an indexer production-correct: framework-level reorg handling, restart-resistant operation, HyperSync data validation, and multi data-source recovery. Observability through Prometheus layers on top.

## Why These Four Reliability Pillars Reinforce Each Other

Reorg handling guarantees your indexer doesn't carry corrupt state forward when a chain rolls back. Restart-resistant operation means a failed indexer process doesn't leak that corruption into a stuck or amnesiac state. HyperSync validation means the data feeding both is the canonical chain, not a stale or partial fork. Multi-source recovery keeps the whole stack live when upstream sources fail. Each pillar protects the rest.

## Reorg Handling at the Framework Level

The reorg architecture is the deepest piece of work HyperIndex's reliability story rests on. To understand why "framework-level" matters, it helps to be precise about what a reorg actually does to an indexer.

A reorg is a chain rolling back to a previous point in time. A recent block (or several) is no longer canonical, and the new canonical chain has different events at those heights. The implications for an indexer split along a single axis, stateless versus stateful.

Stateless indexers only create entities. On a reorg, the fix is mechanical. Delete the entities written from orphaned blocks, re-ingest from the canonical chain, move on. Stateless indexing parallelises well and is fast.

Stateful indexers also update and delete entities based on previous state. An order book's running volume, an account's balance, a market's open interest, all of these aggregate prior state into current state. On a reorg, you cannot just delete and replay. You have to revert previous operations to the entity state at the pre-reorg point, then replay forward against the canonical chain. Doing that correctly requires tracking the history of every change to every entity for the entire unfinalized window.

HyperIndex's framework keeps that entity history for you.

> "Envio HyperIndex tracks entity state history for all unfinalized blocks. When a reorg is detected, it rolls back entity state to the correct point and reprocesses events from the canonical chain. This happens automatically and does not require any custom rollback logic in your event handlers."
>
> Denham Preen, Envio Co-founder

Learn more in our [Indexing and Reorgs](https://docs.envio.dev/blog/indexing-and-reorgs) blog.

Three architectural details worth knowing about that mechanism:

1. **History is per-entity, not per-block.** The framework persists the prior state of each entity each time a handler writes to it within the unfinalized window. On a reorg, the rollback walks the per-entity history backwards to the pre-reorg state, applies it, and reprocesses forward.

2. **History is pruned automatically.** Once a block is finalised, its entries in the entity history are no longer needed. The framework prunes them. The unfinalized window is the only window that ever carries history overhead, which keeps the storage cost bounded regardless of total chain length.

3. **Multichain reorg handling is harder than single-chain, and the framework does it.** When a single entity's state is updated by events from multiple chains, a reorg on chain A may force the framework to also reprocess events on chain B that were applied after the reorg point but depended on the rolled-back state. The reorg blog calls this out explicitly. Hand-rolling correct multichain reorg logic is the kind of thing you do not want any application engineer to have to write.

### Reorgs in the Wild

These are not theoretical edge cases. From the same reorg blog:

- **Polygon** has frequent and sometimes deep reorgs. The forum has documented a single [157-block reorg at block height 39,599,624](https://forum.polygon.technology/t/157-block-reorg-at-block-height-39599624/11388). Polymarket runs on Polygon. Polymarket's reference indexer at [github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer) has stayed correct through every Polygon reorg, including the deep ones, because the framework does the work.
- **Ethereum mainnet** sees roughly 1% of blocks affected by reorgs. Assuming a 50/50 chance of a transaction landing in the orphaned versus canonical fork, that's about 1 in 200 transactions ending up in a reorged block. An indexer that does not roll back state is silently wrong for ~0.5% of the transactions it ingests.
- **Base and OP-stack chains** are largely reorg-resistant due to single-slot finality, with [documented exceptions](https://optimistic.etherscan.io/blocks_forked).

Why this matters operationally:

- **No bespoke per-handler logic.** The most common subgraph reliability bug is a handler that does not handle a reorg correctly because the dev forgot to. With HyperIndex that bug class does not exist.
- **No "wait for N confirmations" delay.** Some indexers paper over reorgs by lagging behind the chain head by N blocks. HyperIndex stays at chain head and rolls back if needed.
- **Multichain stays correct.** A multichain indexer with one chain reorging does not corrupt the cross-chain aggregates. The framework rolls back the dependent state on every other chain too.

## Multi Data-Source Recovery

HyperIndex's multi data-source recovery is documented in the [dev update archive](https://docs.envio.dev/blog) and tracked in the [GitHub releases](https://github.com/enviodev/hyperindex/releases).

The feature has three concrete pieces.

### 1. Smarter source selection

Indexers configured with multiple data sources (a primary plus one or more fallbacks) route requests using selection logic that weights source health. A flapping fallback does not win the rotation purely because it answered fastest.

### 2. Automatic failover within seconds

When the primary source goes down, the indexer fails over to a fallback within seconds. When the primary comes back, [HyperIndex attempts to recover to it 60 seconds later](https://docs.envio.dev/docs/HyperIndex/whats-new-in-v3#improved-multiple-data-sources-support). The indexer does not need to be restarted to return to its preferred source.

### 3. Realtime mode enforcement

Realtime mode means the indexer is at chain head and processing new blocks as they arrive. HyperIndex enforces realtime mode strictly: if the indexer's effective progress is stalling on a degraded source, metrics surface it. Operators see the degradation before downstream consumers do.

This pillar is the one operators feel daily. Most indexer outages in 2025 were not chain outages. They were data-source outages that the indexer did not handle gracefully. Multi data-source recovery removes the operator pager from that loop.

## Resumes Cleanly Across Restarts

A production indexer runs for months. The host will restart. Configs will change. The reliability question isn't whether restarts happen, it's what state the indexer is in when they do.

HyperIndex persists indexer state across restarts. On reboot, state is restored from the database, including dynamically registered contracts. The indexer resumes from the last committed block, not from chain head and not from genesis. Application code does not have to track checkpoints or persist offsets, the framework handles it.

Handler-side failures are caught at the framework level too. If a handler throws an unhandled exception, the indexer restarts automatically without data loss. Application code does not have to wrap handlers in try/catch, implement custom retry logic, or rebuild offsets after a crash. The framework does this for you.

The dev environment also preserves data by default. `envio dev` no longer wipes the database on incompatible config or schema changes; the explicit opt-in is `envio dev -r`. For some config changes (RPC configuration is the first to land), the indexer can continue indexing through the change without erroring out at all.

This complements the reorg story. Reorg handling protects against chain-side rollbacks; restart persistence protects against indexer-side restarts. Together they cover the failure surface a production indexer actually faces.

## HyperSync Data Validation

The data feeding the indexer matters as much as the indexer itself. A reorg-aware framework with restart safety is still only as correct as the events that arrive at the handler.

HyperIndex pulls historical data through HyperSync, Envio's data engine. HyperSync ships a robust set of validation features that raw RPC does not, block parent hash verification, fork detection, automatic re-sync on detected forks. The validation runs at ingestion, not in your handler. The framework's confidence is that no events are silently missed by the data layer.

Raw RPC does not give the same guarantee. A standard RPC endpoint will serve whatever the upstream node currently considers canonical, and a slow rotation between forks (or a single RPC sitting on an orphaned tip) can quietly hand stale events to a downstream indexer. With HyperSync as the data layer, that class of silent corruption is removed before any handler sees it.

For application teams: events that reach your handler are canonical-chain events. For AI agents acting on indexer state: the data they reason over is validated upstream, not a best-effort RPC read.

### Why Data Validity Matters for AI

When an agent acts on indexer data, the agent is only as correct as the data it queries. A missing or stale event in a derivative pricing agent, a position tracker, or a governance bot is not a logging error, it's a financial event. The premise of the AI-onchain stack is that the data layer underneath gives the agent verified, canonical state.

HyperIndex's framework-level guarantees (reorg-aware, restart-persistent, parent-hash-validated upstream) are what let an agent treat indexer output as a stable source of truth rather than a feed to second-guess. The [companion blog on agentic blockchain indexing](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex) covers the agent-side story end to end.

## Observability Through Prometheus

HyperIndex exposes a standard Prometheus `/metrics` endpoint with three properties operators rely on.

- **Semver-stable contract.** Metric names and labels do not change between minor versions. Grafana dashboards built against this endpoint do not need to be rebuilt every release.
- **Time units in seconds.** Every duration metric is in seconds, matching Prometheus convention. Histograms use second-based buckets.
- **Benchmark data points in the standard endpoint.** The data points historically surfaced under a separate benchmark mode are part of the standard `/metrics` output. Continuous benchmarking against a production deployment does not require a separate run mode.

For self-hosted deployments, the endpoint plugs into existing Prometheus infrastructure. For Envio Cloud deployments, alerts are exposed through the standard alert channels (Discord, Slack, Telegram, and Email).

## Reliability on Envio Cloud

The four pillars above are framework guarantees: they hold whether you self-host or deploy to [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service), Envio's fully managed hosting. Envio Cloud adds the operational layer on top.

- **Zero-downtime deployments.** Each indexer gets a static production endpoint. A new version deploys alongside the running one; "promote to production" switches the endpoint instantly, and rolling back to a previous deployment is one click. Consumers see no endpoint change.
- **Built-in alerts.** Paid plans surface indexer health, performance warnings, and deployment events through Discord, Slack, Telegram, and Email, so the reorg, failover, and restart events the framework handles stay visible without wiring up your own monitoring.
- **Built-in monitoring.** Logs, per-chain sync status, and deployment health are tracked in real time from the dashboard.
- **Region choice.** Dedicated plans can pick a primary deployment region (USA or EU) for latency and data-residency needs. Broader cross-region support is in active development.

Self-hosting keeps all four framework pillars. Envio Cloud removes the hosting and the on-call wiring on top of them.

## What This Looks Like in a Real Configuration

The Polymarket reference indexer's `config.yaml` is the public production example. The structural pieces below are drawn from [the canonical file](https://github.com/enviodev/polymarket-indexer/blob/main/config.yaml) (selected events shown for brevity):

```yaml
# Source: https://github.com/enviodev/polymarket-indexer/blob/main/config.yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: polymarket-indexer
description: Unified Polymarket HyperIndex

contracts:
  # Phase 1A: Fee Module
  - name: FeeModule
    abi_file_path: ./abis/FeeModule.json
    events:
      - event: "FeeRefunded(bytes32 indexed orderHash, address indexed to, uint256 id, uint256 refund, uint256 indexed feeCharged)"

  # Phase 2B: Orderbook
  - name: Exchange
    abi_file_path: ./abis/Exchange.json
    events:
      - event: "OrderFilled(bytes32 indexed orderHash, address indexed maker, address indexed taker, uint256 makerAssetId, uint256 takerAssetId, uint256 makerAmountFilled, uint256 takerAmountFilled, uint256 fee)"
      - event: "OrdersMatched(bytes32 indexed takerOrderHash, address indexed takerOrderMaker, uint256 makerAssetId, uint256 takerAssetId, uint256 makerAmountFilled, uint256 takerAmountFilled)"

  # Phase 3: Open Interest + Activity
  - name: ConditionalTokens
    abi_file_path: ./abis/ConditionalTokens.json
    events:
      - event: "PositionSplit(address indexed stakeholder, address collateralToken, bytes32 indexed parentCollectionId, bytes32 indexed conditionId, uint256[] partition, uint256 amount)"
      - event: "PositionsMerge(address indexed stakeholder, address collateralToken, bytes32 indexed parentCollectionId, bytes32 indexed conditionId, uint256[] partition, uint256 amount)"
      - event: "PayoutRedemption(address indexed redeemer, address indexed collateralToken, bytes32 indexed parentCollectionId, bytes32 conditionId, uint256[] indexSets, uint256 payout)"

field_selection:
  transaction_fields:
    - hash
    - from
    - to

chains:
  - id: 137 # Polygon
    start_block: 3764531
    contracts:
      - name: FeeModule
        address:
          - "0xE3f18aCc55091e2c48d883fc8C8413319d4Ab7b0"
          - "0xB768891e3130F6dF18214Ac804d4DB76c2C37730"
        start_block: 75253526
      - name: Exchange
        address:
          - "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
          - "0xC5d563A36AE78145C45a50134d48A1215220f80a"
        start_block: 33605403
      - name: ConditionalTokens
        address: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045"
        start_block: 4023686
```

Three details worth pointing at in this config:

1. **Two-tier declaration.** The top-level `contracts:` block declares the contract name, ABI, and event signatures globally. The `chains:` block (per chain ID) supplies addresses and per-contract `start_block` overrides. This is how the same contract definition gets reused across multiple deployed addresses (Exchange has two production addresses, FeeModule has two) without duplicating the event signatures.
2. **`field_selection`** controls which transaction fields HyperSync ships down to the handler. Polymarket asks for `hash`, `from`, and `to` only. Smaller per-event payload, faster sync, lower memory pressure. Available on every config.
3. **No reorg block.** There is no `rollback_on_reorg` flag set in the config because rollback is the framework default. The handlers in `src/` do not contain reorg logic. They write entities, the framework manages history, the database stays consistent.

The full file declares 9 V1 contracts (FeeModule, UmaSportsOracle, RelayHub, SafeProxyFactory, USDC, Exchange, ConditionalTokens, NegRiskAdapter, FPMMFactory) plus a dynamic FixedProductMarketMaker registered at runtime, and 5 V2 contracts (CTFExchangeV2, PolyUSD, Rewards, CtfCollateralAdapter, NegRiskCtfCollateralAdapter), all routed through merged handlers in a single multichain-capable config. For a true multichain deployment, the same `chains:` array gets additional entries (e.g., `id: 8453` for Base) with their own contracts block.

## Why Reliability Beats Speed When You Are Picking an Indexer

Speed is the easier comparison and the one most blog posts lead with. Sentio's independent Uniswap V2 Factory benchmark put HyperIndex at 8 seconds, 142x faster than The Graph and 15x faster than the nearest competitor. Polymarket synced 4 billion events in 6 days. Our [agentic indexing blog](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex) covers a 400,000-event Monad indexer in roughly 20 seconds.

Reliability is the one that decides whether an indexer stays running for years. The four pillars above (framework reorg handling, restart-resistant operation, HyperSync data validation, and multi data-source recovery) are what separate a production indexer from a benchmark.

Two operational consequences for teams choosing HyperIndex over alternatives:

- **One on-call surface, not three.** The framework handles reorgs, source failover, restart recovery, and observability. The on-call person reads the Prometheus dashboard and the Envio Cloud alerts. They do not also have to maintain custom reorg or checkpoint code.
- **Source diversity without operator overhead.** Adding a fallback source is a config change. Multi data-source recovery does the runtime work. The operator does not author retry policies.

## Get Started

- [What's new in v3](https://docs.envio.dev/docs/HyperIndex/whats-new-in-v3)
- [HyperIndex quickstart](https://docs.envio.dev/docs/HyperIndex/getting-started)
- [Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai)
- [Benchmarks](https://docs.envio.dev/docs/HyperIndex/benchmarks)
- [Reorg handling reference](https://docs.envio.dev/blog/indexing-and-reorgs)
- [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer)
- [Envio Cloud (alerts, hosted reliability)](https://docs.envio.dev/docs/HyperIndex/hosted-service)

## Frequently Asked Questions

### How does Envio HyperIndex handle blockchain reorgs?

HyperIndex tracks entity state history for every unfinalized block at the framework level. When a reorg occurs, the framework walks the per-entity history backwards to the pre-reorg state, applies it, then reprocesses forward against the canonical chain. History is pruned automatically once a block is finalised. No handler code is required.

### How does HyperSync guarantee canonical chain data?

HyperSync ships a robust set of validation features that raw RPC does not, block parent hash verification, fork detection, automatic re-sync on detected forks. The indexer can trust that no events are silently missed by the data layer. The validation runs at ingestion, not in your handler. Raw RPC endpoints serve whatever the upstream node currently considers canonical, which is why a standard RPC-fed indexer can silently ingest stale or orphaned data from a slow-rotating provider.

### How often do reorgs actually happen?

On Ethereum mainnet, roughly 1% of blocks undergo reorgs, meaning approximately 1 in 200 transactions ends up in a reorged block. Polygon experiences deeper reorgs more frequently and has documented a single 157-block reorg at block height 39,599,624. Base and OP-stack chains are largely reorg-resistant due to single-slot finality, with documented exceptions.

### What is multi data-source recovery in HyperIndex?

Multi data-source recovery automatically routes between configured data sources. On primary outage, the indexer fails over to a fallback within seconds. When the primary returns, the indexer attempts to recover to it 60 seconds later, no restart required. Selection logic weights source health, not just first-response. Realtime mode enforcement surfaces through metrics when forward progress slows on a degraded source.

### What happens to the indexer when the process restarts or a handler fails?

HyperIndex is restart-resistant. State persists to the database; on restart, the indexer restores state (including dynamically registered contracts) and resumes from the last committed block. If a handler fails mid-execution, the framework restarts automatically without data loss. Application code does not have to track checkpoints, persist offsets, or wrap handlers in retry logic.

### Is the HyperIndex Prometheus metrics endpoint production-ready?

Yes. The `/metrics` endpoint follows semver, uses second-based time units, and exposes the benchmark data points historically surfaced under a separate run mode as part of the standard endpoint.

### Where can I see the production-scale HyperIndex reference?

The [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer). It synced 4,000,000,000 events from block 3,764,531 on Polygon Mainnet in 6 days, replacing 8 separate subgraphs.

### What alert channels does Envio Cloud support?

Envio Cloud alerts route through the platform's alert channels documented in the [hosted service docs](https://docs.envio.dev/docs/HyperIndex/hosted-service).

### Does HyperIndex stay at chain head or lag for safety?

HyperIndex stays at chain head. Reorgs are handled by rollback, not by lag. There is no "wait N confirmations" mode required for correctness.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
