---
id: latency-at-head
title: Understanding Chain Head Latency
sidebar_label: Latency at the Head (Performance)
slug: /latency-at-head
description: Learn how Envio keeps blockchain indexers updated with low latency and reliable multi-chain sync.
---

# Understanding Chain Head Latency

Maintaining low latency at the chain head is crucial for ensuring timely data updates in your indexed data. This page explains how HyperSync handles this important aspect of blockchain indexing.

## HyperSync Block Retrieval

- **Efficient Processing**: We pull new blocks from HyperSync using a highly efficient process, ensuring your indexer stays up-to-date with minimal delay.
- **Reliable Operation**: This process typically runs smoothly without significant issues.
- **Redundancy Plans**: We're developing a system to sync new blocks from both RPC and HyperSync simultaneously, improving robustness if one source experiences issues.

## Network-Specific Performance

### Optimized Major Networks

- **Priority Networks**: We've dedicated significant resources to maintaining extremely low latency on popular networks including Ethereum, Optimism, and Arbitrum.
- **User Experience**: Users should experience seamless, near real-time data updates on these networks.

### Smaller Chain Networks

- **Standard Performance**: On smaller chains, latency might be slightly higher as these networks have received less optimization.
- **Improvement Process**: Your feedback helps us prioritize which chains to optimize next. Please let us know in Discord if low latency on specific smaller chains is important for your use case.

## Special Configuration Options

### Multi-Chain Indexing

- **Unordered Multi-Chain Mode**: For applications indexing multiple chains, our [unordered multi-chain mode](./multichain-indexing#unordered-multichain-mode) allows each chain to continue syncing independently.
- **Resilient Design**: With this configuration, even if one chain experiences latency, your other chains will continue syncing normally.

### Chain Reorganization Support

- **Reorg Handling**: Our reorg support system ensures data consistency even when chains reorganize.
- **Documentation**: Contact our team on Discord if you have concerns about reorg support while we finalize documentation.

## Hosted Service Performance

Our hosted service offers reliable performance with ongoing improvements:

- **Continuous Enhancement**: We're actively improving sync and build times on our hosted service.
- **Relative Performance**: Currently, indexers may run slightly slower on the hosted service compared to high-performance local machines.
- **Enterprise Solutions**: For applications requiring exceptional performance, contact us on Discord to discuss our enterprise hosting plans.

By leveraging these features and providing feedback on your specific needs, you can help us continually improve the HyperIndex head latency performance.
