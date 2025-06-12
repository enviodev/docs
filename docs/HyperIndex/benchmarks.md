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

| Case                           | Description                                 | Envio  | Nearest Competitor          | TheGraph            | Ponder               |
| ------------------------------ | ------------------------------------------- | ------ | --------------------------- | ------------------- | -------------------- |
| LBTC Token Transfers           | Event handling, No RPC calls, Write-only    | 3m     | 8m - 2.6x slower (Sentio)   | 3h9m - 3780x slower | 1h40m - 2000x slower |
| LBTC Token with RPC calls      | Event handling, RPC calls, Read-after-write | 1m     | 6m - 6x slower (Sentio)     | 1h3m - 63x slower   | 45m - 45x slower     |
| Ethereum Block Processing      | 100K blocks with Metadata extraction        | 7.9s   | 1m - 7.5x slower (Subsquid) | 10m - 75x slower    | 33m - 250x slower    |
| Ethereum Transaction Gas Usage | Transaction handling, Gas calculations      | 1m 26s | 7m - 4.8x slower (Subsquid) | N/A                 | 33m - 23x slower     |
| Uniswap V2 Swap Trace Analysis | Transaction trace handling, Swap decoding   | 41s    | 2m - 3x slower (Subsquid)   | 8m - 11x slower     | N/A                  |
| Uniswap V2 Factory             | Event handling, Pair and swap analysis      | 8s     | 2m - 15x slower (Subsquid)  | 19m - 142x slower   | 21m - 157x slower    |

The independent benchmark results demonstrate that HyperIndex consistently outperforms all competitors across every tested scenario. This includes the most realistic real-world indexing scenario LBTC Token with RPC calls - where HyperIndex was up to 6x faster than the nearest competitor and over 63x faster than TheGraph.

## Historical Benchmarking Results

Our internal benchmarking from October 2023 showed similar performance advantages. When indexing the Uniswap V3 ETH-USDC pool contract on Ethereum Mainnet, HyperIndex achieved:

- 2.1x faster indexing than the nearest competitor
- Over 100x faster indexing than some popular alternatives

You can read the full details in our [Indexer Benchmarking Results blog post](/blog/indexer-benchmarking-results).

## Verify For Yourself

We encourage developers to run their own benchmarks. You can use the templates provided in the [Sentio benchmark repository](https://github.com/sentioxyz/indexer-benchmark) or our sample indexer implementations for various scenarios.
