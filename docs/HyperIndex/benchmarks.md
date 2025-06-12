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
| LBTC Token Transfers           | Event handling, No RPC calls, Write-only    | 3m     | 8m (Sentio)        | 3h9m     | 1h40m  | 2.6x faster           |
| LBTC Token with RPC calls      | Event handling, RPC calls, Read-after-write | 1m     | 6m (Sentio)        | 1h30m    | 45m    | 6x faster             |
| Ethereum Block Processing      | 100K blocks with Metadata extraction        | 7.9s   | 1m (Subsquid)      | 10m      | 33m    | 7.5x faster           |
| Ethereum Transaction Gas Usage | Transaction handling, Gas calculations      | 1m 26s | 7m (Subsquid)      | N/A      | 33m    | 4.8x faster           |
| Uniswap V2 Swap Trace Analysis | Transaction trace handling, Swap decoding   | 41s    | 2m (Subsquid)      | 8m       | N/A    | 3x faster             |
| Uniswap V2 Factory             | Event handling, Pair and swap analysis      | 8s     | 2m (Subsquid)      | 19m      | 21m    | 15x faster            |

The independent benchmark results demonstrate that HyperIndex consistently outperforms all competitors across every tested scenario. This includes the most realistic real-world indexing scenario LBTC Token with RPC calls - where HyperIndex was up to 6x faster than the nearest competitor and over 90x faster than TheGraph.

## Historical Benchmarking Results

Our internal benchmarking from October 2023 showed similar performance advantages. When indexing the Uniswap V3 ETH-USDC pool contract on Ethereum Mainnet, HyperIndex achieved:

- 2.1x faster indexing than the nearest competitor
- Over 100x faster indexing than some popular alternatives

You can read the full details in our [Indexer Benchmarking Results blog post](/blog/indexer-benchmarking-results).

## Verify For Yourself

We encourage developers to run their own benchmarks. You can use the templates provided in the [Sentio benchmark repository](https://github.com/sentioxyz/indexer-benchmark) or our sample indexer implementations for various scenarios.
