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

The most comprehensive and up-to-date benchmarks were conducted by Sentio in April 2025 and are available in the [sentio-benchmark repository](https://github.com/enviodev/sentio-benchmark). These benchmarks compare Envio's HyperIndex against other popular indexers across multiple real-world scenarios:

### Key Performance Highlights

| Case                           | Description                                 | Envio  | Nearest Competitor | TheGraph | Ponder | Advantage vs. Nearest |
| ------------------------------ | ------------------------------------------- | ------ | ------------------ | -------- | ------ | --------------------- |
| LBTC Token Transfers           | Event handling, No RPC calls, Write-only    | 2m     | 8m (Sentio)        | 3h9m     | 1h40m  | 4x faster             |
| LBTC Token with RPC calls      | Event handling, RPC calls, Read-after-write | 15s    | 32m (Subsquid)     | 18h38m   | 4h38m  | 128x faster           |
| Ethereum Block Processing      | 100K blocks with Metadata extraction        | 7.9s   | 1m (Subsquid)      | 10m      | 33m    | 7.5x faster           |
| Ethereum Transaction Gas Usage | Transaction handling, Gas calculations      | 1m 26s | 5m (Subsquid)      | N/A      | 33m    | 3.5x faster           |
| Uniswap V2 Swap Trace Analysis | Transaction trace handling, Swap decoding   | 41s    | 2m (Subsquid)      | 8m       | N/A    | 3x faster             |
| Uniswap V2 Factory             | Event handling, Pair and swap analysis      | 10s    | 2m (Subsquid)      | 19m      | 2h24m  | 12x faster            |

The independent benchmark results demonstrate that HyperIndex consistently outperforms all competitors across every tested scenario. The most significant performance advantage was seen in real-world indexing scenarios with external RPC calls, where HyperIndex was up to 128x faster than the nearest competitor and over 4000x faster than TheGraph.

## Historical Benchmarking Results

Our internal benchmarking from October 2023 showed similar performance advantages. When indexing the Uniswap V3 ETH-USDC pool contract on Ethereum Mainnet, HyperIndex achieved:

- 2.1x faster indexing than the nearest competitor
- Over 100x faster indexing than some popular alternatives

You can read the full details in our [Indexer Benchmarking Results blog post](/blog/indexer-benchmarking-results).

## Verify For Yourself

We encourage developers to run their own benchmarks. You can use the templates provided in the [Sentio benchmark repository](https://github.com/sentioxyz/indexer-benchmark) or our sample indexer implementations for various scenarios.
