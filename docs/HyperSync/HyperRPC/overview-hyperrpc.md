---
id: overview-hyperrpc
title: Overview
sidebar_label: Overview
slug: /overview-hyperrpc
---

# HyperRPC: Ultra-Fast Read-Only Blockchain Access

HyperRPC is an extremely fast read-only RPC designed specifically for data-intensive blockchain tasks. Built from the ground up to optimize performance, it offers a simple drop-in solution with dramatic speed improvements over traditional nodes.

## Table of Contents

- [What is HyperRPC?](#what-is-hyperrpc)
- [Performance Advantages](#performance-advantages)
- [Supported Methods](#supported-methods)
- [Supported Networks](#supported-networks)
- [Getting Started](#getting-started)
- [Development Status](#development-status)

## What is HyperRPC?

HyperRPC is a specialized JSON-RPC endpoint that focuses exclusively on **read operations** to deliver exceptional performance. By optimizing specifically for data retrieval workflows, HyperRPC can significantly outperform traditional nodes for data-intensive applications.

Key characteristics:

- **Read-only**: Optimized for data retrieval (cannot send transactions)
- **Drop-in compatible**: Works with existing tooling that uses standard RPC methods
- **Specialized**: Designed specifically for data-intensive operations like `eth_getLogs`

## Performance Advantages

Early benchmarks show that HyperRPC can deliver up to **5x performance improvement** for data-intensive operations compared to traditional nodes like `geth`, `erigon`, and `reth`.

This performance boost is particularly noticeable for:

- Historical data queries
- Log event filtering
- Block and transaction retrievals
- Analytics applications

## Supported Methods

HyperRPC currently supports the following Ethereum JSON-RPC methods:

| Category             | Methods                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chain Data**       | `eth_chainId`, `eth_blockNumber`                                                                                                            |
| **Block Data**       | `eth_getBlockByNumber`, `eth_getBlockByHash`, `eth_getBlockReceipts`                                                                        |
| **Transaction Data** | `eth_getTransactionByHash`, `eth_getTransactionByBlockHashAndIndex`, `eth_getTransactionByBlockNumberAndIndex`, `eth_getTransactionReceipt` |
| **Event Logs**       | `eth_getLogs`                                                                                                                               |
| **Traces**           | `trace_block` (only on [select chains](./hyperrpc-supported-networks))                                                                      |

## Supported Networks

HyperRPC is available across numerous EVM-compatible networks. For the most up-to-date list of supported chains, please see our [Supported Networks](./hyperrpc-supported-networks) page.

## Getting Started

To start using HyperRPC:

1. **Get Access**:

   - Visit our [Supported Networks](./hyperrpc-supported-networks) page to find all available HyperRPC endpoints
   - Each network has a ready-to-use URL that you can start using immediately

2. **Use Like a Standard RPC**:

   ```javascript
   // Example: Fetching logs with HyperRPC
   const response = await fetch("https://eth.rpc.hypersync.xyz", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       jsonrpc: "2.0",
       id: 1,
       method: "eth_getLogs",
       params: [
         {
           fromBlock: "0x1000000",
           toBlock: "0x1000100",
           address: "0xYourContractAddress",
         },
       ],
     }),
   });
   ```

3. **Provide Feedback**:
   Your testing and feedback are incredibly valuable as we continue to improve HyperRPC. Let us know about your experience in our [Discord](https://discord.gg/Q9qt8gZ2fX).

## Development Status

:::caution Important Notice

- HyperRPC is under active development to further improve performance and stability
- It is designed for read-only operations and does not support all standard RPC methods
- It has not yet undergone formal security audits
- We welcome questions and feedback in our [Discord](https://discord.gg/Q9qt8gZ2fX)
  :::

---
