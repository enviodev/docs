---
title: "Benchmarking Blockchain Indexer Sync Speeds"
sidebar_label: "Benchmarking Blockchain Indexer Sync Speeds"
slug: /indexer-benchmarking-results
description: "Benchmarking results comparing Envio against Subsquid, The Graph, Ponder, and Substreams across 5 million events on the Uniswap V3 ETH-USDC pool."
image: /blog-assets/envio-benchmarking-blockchain-indexing-sync-speeds.png
last_update:
  date: 2026-04-15
---

<img src="/blog-assets/envio-benchmarking-blockchain-indexing-sync-speeds.png" alt="Benchmarking Blockchain Indexer Sync Speeds" width="100%"/>

<!--truncate-->

:::note TL;DR
- Envio ranked fastest across 6 indexing solutions tested on the Uniswap V3 ETH-USDC pool on Ethereum Mainnet, syncing 5.3 million events in 9.67 minutes.
- The next fastest competitor took 20.5 minutes. The slowest took 1,529 minutes.
- All benchmark code is publicly available. These results reflect Envio v0.0.20. Performance has improved significantly since with HyperSync.
:::

Sync speed is how long it takes an indexer to catch up to the chain head from a historical starting block. It sounds like a narrow metric, but it shapes the entire development loop. Every time you change handler logic, update a schema, or debug an issue on a live contract, you are waiting for a sync before you can see the result. Slow syncs mean slow iteration. Fast syncs mean teams ship faster.

This article presents the findings from benchmarking tests conducted at Envio, comparing six blockchain indexing solutions on a standardised scenario.

## Methodology

To make results as comparable as possible, all indexers were configured identically:

- **Start block:** 12,376,729 (deployment block of the Uniswap V3 ETH-USDC pool)
- **End block:** 18,342,024 (chain head at time of testing)
- **Total events:** approximately 5,395,050 raw events (0.9044 events per block)
- Same schema across all implementations
- Same event handler logic across all implementations

The Uniswap V3 ETH-USDC pool was chosen for its high event density, making it a strong stress test for indexer performance. You can view the contract on [Etherscan](https://etherscan.io/address/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640).

### Schema

```graphql
type Swap {
  id: Bytes!
  sender: Bytes! # address
  recipient: Bytes! # address
  amount0: BigInt! # int256
  amount1: BigInt! # int256
  sqrtPriceX96: BigInt! # uint160
  liquidity: BigInt! # uint128
  tick: Int! # int24
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

### Event handler logic

The handler logic was kept lightweight. Each indexer listened for the `Swap` event and appended event details to the `Swap` entity table. No complex joins or derived fields.

## Indexers Tested

Six indexing solutions were included:

- [Envio](https://envio.dev/) v0.0.20
- [Envio](https://envio.dev/) v0.0.19
- [Subsquid](https://subsquid.io/)
- Subgraph on [The Graph](https://thegraph.com/hosted-service) hosted service
- [Ponder](https://ponder.sh/)
- [Substreams-powered Subgraph](https://thegraph.com/docs/en/cookbook/substreams-powered-subgraphs/) on The Graph hosted service

### Benchmark repositories

All implementations are publicly available for review and reproduction:

- Envio: [uniV3-swaps](https://github.com/enviodev/uniV3-swaps)
- Ponder: [univ3-ponder](https://github.com/enviodev/univ3-ponder)
- Subsquid: [univ3-sqd](https://github.com/enviodev/univ3-sqd)
- Substreams-powered Subgraph: [univ3-substreams](https://github.com/enviodev/univ3-substreams)

## Results

<img src="/blog-assets/envio-univ3-benchmark-results.png" alt="Envio benchmark results chart" width="100%"/>

Total sync times in minutes, sorted fastest to slowest:

| Indexer | Total sync time (mins) |
|---|---|
| Envio v0.0.20 | 9.67 |
| Subsquid | 20.50 |
| Envio v0.0.19 | 21.00 |
| Ponder | 780.37 |
| The Graph | 1,000.00 |
| Substreams-powered Subgraph | 1,529.33 |

### Key takeaways

Envio v0.0.20 ranked fastest across all solutions tested:

- 2.12x faster than Subsquid
- 80.6x faster than Ponder
- 103x faster than The Graph
- 157x faster than Substreams-powered Subgraph

> **Disclaimer:** These results are specific to the Uniswap V3 ETH-USDC pool scenario. Relative performance between indexers will vary by use case.

### Caveats

- Envio and Subsquid were run on local machines. Subgraphs were deployed on a hosted service, which introduces potential variance.
- Ponder was deployed on a virtual machine with 4GB RAM and 80GB disk.
- Ponder's sync time was extrapolated from initial indexing progress rather than measured to completion.

## Performance since these benchmarks

These benchmarks reflect Envio v0.0.20 from late 2023. Since then, Envio has shipped [HyperSync](https://docs.envio.dev/docs/HyperSync/overview), a purpose-built data engine that replaces RPC for historical data retrieval entirely. The 2000x faster figure referenced in Envio's documentation refers to HyperSync vs standard RPC endpoints, not this indexer-to-indexer comparison. Real-world sync times with HyperSync are faster than what these numbers show.

The benchmark data and repositories remain public. We encourage the community to run the tests independently and share results.

## Frequently asked questions

### What was being benchmarked?

Sync speed across six blockchain indexing solutions, using the Uniswap V3 ETH-USDC pool on Ethereum Mainnet as the test contract. All indexers used the same schema, start block, end block, and handler logic.

### How does Envio compare to The Graph?

In this benchmark, Envio v0.0.20 synced in 9.67 minutes vs approximately 1,000 minutes for The Graph's hosted subgraph, roughly 103x faster. These results reflect a specific high event-density scenario and the versions available at the time of testing.

### Are these benchmarks still current?

These benchmarks were run on Envio v0.0.20 in late 2023. Performance has improved significantly since with the introduction of HyperSync. Updated benchmarks covering more indexers and scenarios are planned.

### Where can I verify the results?

All benchmark implementations are publicly available on GitHub. Links to each repository are in the [Benchmark repositories](#benchmark-repositories) section above.

### What scenarios will future benchmarks cover?

Planned variations include different numbers of contracts and events, varying event density per block, more complex schema structures, and handler logic that involves loading and updating existing entities.

## Build With Envio

Envio was the fastest EVM blockchain indexer in the 2023 benchmark above, and more recent independent tests run by Sentio in May 2025 show HyperIndex is still the fastest blockchain indexer available ([Sentio benchmark, May 2025](https://github.com/enviodev/open-indexer-benchmark)). If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
