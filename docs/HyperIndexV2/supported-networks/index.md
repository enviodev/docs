---
id: index
title: Supported Networks
sidebar_label: Supported Networks
slug: /supported-networks
---

HyperIndex natively supports indexing any EVM blockchain out of the box. As a developer you can start indexing and querying your smart contract data across any EVM-compatible L1, L2, or L3 blockchain using HyperIndex.

HyperIndex also supports data indexing on [Fuel](/docs/v2/HyperIndex/fuel).

:::info
The backbone of HyperIndex’s blazing-fast indexing speed lies in using HyperSync as a more performant and cost-effective data source to RPC for data retrieval. While RPCs are functional, and can be used in HyperIndex as a data source, they are far from efficient when it comes to querying large amounts of data (a time-consuming and resource-intensive endeavour).

HyperSync is significantly faster and more cost-effective than traditional RPC methods, allowing the retrieval of multiple blocks at once, and enabling sync speeds up to 1000x faster than RPC.
:::

If a [network is supported](/docs/HyperSync/hypersync-supported-networks) on HyperSync, then HyperSync is used by default as the data source. This means developers don't additionally need to worry about RPCs, rate-limiting, etc. This is especially valuable for multi-chain apps.

If the network that you want to index is not supported on HyperSync, please navigate to [RPC Data Source](/docs/v2/HyperIndex/rpc-sync) for more information to use RPC as a data source.

You can also request a network to be added to HyperSync in the [Discord](https://discord.gg/envio).

### Networks available on request

Some networks are supported on a request basis: HyperSync support exists, but access is enabled per project rather than being publicly available. Reach out to us on [Discord](https://discord.gg/envio) to request access to the following networks:

- [XDC](./xdc.md)
- [XDC Testnet](./xdc-testnet.md)
- [Stable](./stable.md)
- [Zircuit](./zircuit.md)

---
