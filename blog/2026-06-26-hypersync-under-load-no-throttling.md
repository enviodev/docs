---
title: Why Blockchain Indexers Hit Rate Limits at Scale
sidebar_label: Why Blockchain Indexers Hit Rate Limits at Scale
tags: ["tutorials"]
slug: /hypersync-under-load-no-throttling
authors: j_o_r_d_y_s
image: /blog-assets/hypersync-under-load-no-throttling.png
description: "Blockchain indexers hit rate limits because RPC meters every request. See how HyperSync's bulk-read architecture handles high traffic without throttling, with production-scale numbers."
---

![Cover image for Why Blockchain Indexers Hit Rate Limits at Scale](/blog-assets/hypersync-under-load-no-throttling.png)

<!--truncate-->

:::note TL;DR

- Throttling is a symptom of the per-request RPC model. Providers meter calls because every `eth_getLogs` request costs them node time, so traffic spikes get rate-limited.
- HyperSync replaces thousands of RPC calls with one filtered bulk query. High traffic produces fewer, larger reads instead of a flood of small ones, so the rate-limit problem does not arise in the same form.
- For chains with native HyperSync coverage, HyperIndex developers do not need to manage RPCs or rate limiting at all.
- If a configured data source degrades, HyperIndex fails over to a fallback within seconds and recovers to the primary automatically.

:::

Ask developers why they are shopping for a new blockchain data provider, and a recurring answer is throttling. The dashboard spikes, the app gets popular for an afternoon, and the data layer starts returning 429s exactly when the data matters most.

This blog explains why that happens, why HyperSync's architecture sidesteps it, and what the behaviour looks like at production scale.

## Why Providers Throttle in the First Place

The standard data path is JSON-RPC. Every read is a request, every request hits a node, and nodes are expensive to run. Providers meter usage per request and enforce rate limits to protect shared infrastructure. That is a reasonable response to the economics of RPC. It is also why high traffic and throttling arrive together, the busier your app gets, the more requests you issue, and the closer you run to the ceiling.

The deeper problem is that RPC makes you ask for data in tiny pieces. Reading a year of events for one contract means paginating `eth_getLogs` over block ranges, thousands of calls for one logical question. Your "high traffic" is mostly overhead imposed by the interface.

## What HyperSync Does Differently

[HyperSync](https://docs.envio.dev/docs/HyperSync/overview) is Envio's high-performance data retrieval layer, built in Rust as an alternative to JSON-RPC. You describe what you want once, a block range, a filter across logs, transactions, traces, or blocks, and a field selection that returns only the columns you need. The engine streams the result back.

The shape of the load changes completely. One HyperSync query does the work of the thousands of RPC calls it replaces, and field selection keeps each response small. Under high traffic, you issue fewer, larger reads, which is the access pattern the engine is built for. Scanning Arbitrum for sparse log data takes 2 seconds over HyperSync, a task that can take hours to days over RPC.

This is also why we can make a claim that no RPC-based indexer makes, for chains with native HyperSync coverage, [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) uses it as the default data source, and developers do not additionally need to worry about RPCs or rate limiting. The problem is removed at the data layer rather than managed in application code.

## What It Looks Like at Production Scale

The [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer) processes over 6 billion events on Polygon. [ChainDensity](https://chaindensity.xyz) runs chain-wide scans, the heaviest read pattern there is, and returns density maps in seconds. Every one of those workloads would be a sustained rate-limit fight on a per-request provider.

For repeatable numbers, the Sentio independent benchmarks measured HyperIndex processing 100,000 Ethereum blocks with metadata extraction in 7.9 seconds, against 10 minutes for The Graph on the same workload. The full case suite is in the sentio-benchmark repo, and the [open-indexer-benchmark repo](https://github.com/enviodev/open-indexer-benchmark) gives you templates to run the same tests yourself.

## And When Something Upstream Does Fail

No data source has perfect uptime, so the honest version of "does not throttle" includes what happens when a source degrades. HyperIndex ships multi-data-source recovery. Indexers configured with a fallback fail over automatically when a primary stops returning new blocks, and the indexer attempts to recover to the primary 60 seconds later without a restart. The source selection logic is built for resilience, and data-source activity surfaces in the Prometheus metrics before downstream consumers notice.

Throttling resilience is an architecture property. Failure resilience is a framework property. You want both.

## Test It on Your Heaviest Query

The fastest way to test the claim is to throw your worst read at it. Build a filtered query visually at [builder.hypersync.xyz](https://builder.hypersync.xyz), or scan a chain from your terminal with zero setup:

```sh
pnpx logtui aave arbitrum
```

If you would rather have the full framework, schema, handlers, and a GraphQL API on top of the same engine, scaffold an indexer, and deploy it to Envio Cloud:

```sh
pnpx envio init
```

## Frequently Asked Questions

### Does HyperSync Rate-Limit Queries During High Traffic?

HyperSync is built for bulk retrieval, so the request-flood pattern that triggers rate limiting on RPC providers does not occur in the same form. One filtered query replaces the thousands of paginated RPC calls it would otherwise take, and for chains with native HyperSync coverage, developers do not need to manage RPCs or rate limiting.

### Why Do RPC Providers Throttle During Traffic Spikes?

Because the JSON-RPC model prices and provisions per request. Every read hits node infrastructure, so providers enforce rate limits to protect shared capacity, and those limits bind exactly when your application is busiest. The interface also forces large reads to be split into thousands of small paginated calls, which further inflates request volume.

### What Is the Largest Workload HyperSync Has Handled in Production?

At the time of writing this, the public reference is the Polymarket indexer, which processes over 6 billion events on Polygon.

### What Happens to My Indexer if a Data Source Goes Down Mid-Spike?

HyperIndex fails over to a configured fallback source when a primary stops returning new blocks and attempts to recover to the primary 60 seconds after it returns, with no restart required. The source selection logic is built for resilience, and degradation surfaces in the standard Prometheus metrics endpoint.

### How Do I Benchmark HyperSync Against My Current Provider?

Reproduce your heaviest production query in the visual query builder at [builder.hypersync.xyz](https://builder.hypersync.xyz), or run the open benchmark suite at the [open-indexer-benchmark repo](https://github.com/enviodev/open-indexer-benchmark). Both are public.

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use Envio Cloud or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
