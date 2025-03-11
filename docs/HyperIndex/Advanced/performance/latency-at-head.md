---
id: latency-at-head
title: Latency at the Head
sidebar_label: Latency at the Head (Performance)
slug: /latency-at-head
---

# Latency at the head

Maintaining low latency at the head of the chain is crucial for ensuring timely data updates. Here's an overview of how we handle latency at the head with HyperSync:

### Efficient Block Pulling from HyperSync

- **Efficient Process**: At the head, we currently pull new blocks from HyperSync, which is a highly efficient process. This ensures that we stay up-to-date with the latest blocks with minimal delay.
- **Reliability**: Typically, this process runs smoothly without any significant issues.
- **Backups**: We have an ongoing project to sync new blocks from both RPC and Hypersync to improve the robustness in the unlikely event of a failure in HyperSync.

### Low Latency on Popular Networks

- **Prioritized Networks**: We have put a lot of effort into maintaining extremely low latency on popular networks such as Ethereum, Optimism, and Arbitrum. Users should not experience any noticeable latency on these networks.
- **User Experience**: Our focus on these networks ensures a seamless experience for users relying on timely data updates.

### Smaller Chains

- **Lower Priority**: On some smaller chains, we haven't prioritized low latency to the same extent. As a result, there might be slightly higher latency on these networks.
- **Feedback**: If low latency on smaller chains is a concern for you, please let our team know in Discord. Your feedback helps us prioritize improvements.

### Unordered Multi-Chain Mode

- [**Docs**](./multichain-indexing#unordered-multichain-mode)
- **Multi-Chain Indexes**: For users with extremely multi-chain indexes, we offer an unordered multi-chain mode.
- **Continued Syncing**: In this mode, even if one chain experiences latency, the other chains will continue syncing as normal, ensuring that your data remains up-to-date across multiple networks.

### Reorg Support

- **Reorg Handling**: We have reorg support in place and are currently in the final phases of testing this feature.
- **Concerns**: If reorg support is a concern for you, please reach out to our team on Discord. We will have official documentation for reorgs available shortly.

### Hosted Service

We have ongoing projects to keep improving the sync and build times of the hosted service. Currently, the indexers do run slightly slower on the hosted service than they may on a powerful laptop. If you are looking for a beefy hosting solution please contact us on Discord, and we can discuss our enterprise plans.

By leveraging these features and providing feedback, you can help us maintain and improve the performance of your HyperIndex setup.
