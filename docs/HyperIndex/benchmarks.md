---
id: benchmarks
title: HyperIndex Benchmarks
sidebar_label: Benchmarks
slug: /benchmarks
---

# HyperIndex Performance Benchmarks

## Overview

HyperIndex delivers industry-leading performance for blockchain data indexing. Independent benchmarks have consistently shown Envio's HyperIndex to be the fastest indexing solution available, with dramatic performance advantages over competitive offerings.

## Recent Independent Benchmarks

The most comprehensive and up-to-date benchmarks were conducted by Sentio in April 2025 and are available in the [sentioxyz/indexer-benchmark repository](https://github.com/sentioxyz/indexer-benchmark). These benchmarks compare Envio's HyperIndex against other popular indexers across multiple real-world scenarios:

### Key Performance Highlights

| Case                    | Description              | Envio  | Nearest Competitor | TheGraph | Ponder | Advantage vs. Nearest |
| ----------------------- | ------------------------ | ------ | ------------------ | -------- | ------ | --------------------- |
| LBTC Token Transfers    | Basic event indexing     | 2m     | 8m (Sentio)        | 45m      | 35m    | 4x faster             |
| Full LBTC History       | Complete historical sync | 15m    | 1h 10m (Subsquid)  | 6h 30m   | 4h 45m | 4.7x faster           |
| Block Processing        | 100K Ethereum blocks     | 7.9s   | 4m 30s (Subsquid)  | 10m      | 8m     | 34x faster            |
| Transaction Analysis    | Gas usage analytics      | 1m 26s | 5m (Subsquid)      | 25m      | 20m    | 3.5x faster           |
| Trace Processing        | Uniswap V2 swap analysis | 41s    | 2m (Subsquid)      | 11m      | 8m     | 3x faster             |
| Template-based Indexing | Uniswap V2 template      | 20s    | 2m (Subsquid)      | 12m      | 9m     | 6x faster             |

The independent benchmark results demonstrate that HyperIndex outperforms all competitors across every tested scenario, with the most dramatic advantage in block processing where HyperSync technology delivers up to 76x faster performance compared to TheGraph.

## Historical Benchmarking Results

Our internal benchmarking from October 2023 showed similar performance advantages. When indexing the Uniswap V3 ETH-USDC pool contract on Ethereum Mainnet, HyperIndex achieved:

- 2.1x faster indexing than the nearest competitor
- Over 100x faster indexing than some popular alternatives

You can read the full details in our [Indexer Benchmarking Results blog post](/blog/indexer-benchmarking-results).

## Verify For Yourself

We encourage developers to run their own benchmarks. You can use the templates provided in the [Sentio benchmark repository](https://github.com/sentioxyz/indexer-benchmark) or our sample indexer implementations for various scenarios.
