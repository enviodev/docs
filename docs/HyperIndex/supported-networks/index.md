---
id: index
title: Supported Networks
sidebar_label: Supported Networks
slug: /supported-networks
---

HyperIndex natively supports indexing any EVM blockchain out of the box. As a developer you can start indexing and querying your smart contract data across any EVM-compatible L1, L2, or L3 blockchain using HyperIndex.

HyperIndex also supports data indexing on [Fuel](/docs/HyperIndex/fuel/fuel.md).

:::info
the backbone of hyperindex’s blazing-fast indexing speed lies in using hypersync as a more performant and cost-effective data source to rpc for data retrieval. while rpcs are functional, and can be used in hyperindex as a data source, they are far from efficient when it comes to querying large amounts of data (a time-consuming and resource-intensive endeavour).

hypersync is significantly faster and more cost-effective than traditional rpc methods, allowing the retrieval of multiple blocks at once, and enabling sync speeds up to 1000x faster than rpc.
:::

If a [network is supported](/docs/HyperSync/hypersync-supported-networks) on HyperSync, then HyperSync is used by default as the data source. This means developers don't additionally need to worry about RPCs, rate-limiting, etc. This is especially valuable for multi-chain apps.

If the network that you want to index is not supported on HyperSync, please navigate to [RPC Sync](/docs/HyperIndex/Advanced/rpc-sync.md) for more information to use RPC as a data source.

You can also request a network to be added to HyperSync in the [Discord](https://discord.gg/Q9qt8gZ2fX).

---
