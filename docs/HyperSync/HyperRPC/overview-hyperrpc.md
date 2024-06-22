---
id: overview-hyperrpc
title: Overview (Alpha available)
sidebar_label: Overview
slug: /overview-hyperrpc
---

HyperRPC is an extremely fast read-only RPC for data-intensive tasks. It is designed to be a drop-in solution with a mind-boggling performance boost.

This unique RPC has been designed from the ground up to optimize for performance of read-only calls. Early results show a potential 5x performance boost in data intensive RPC calls such as `eth_getLogs` compared to traditional nodes (`geth`, `erigon`, `reth` etc).

Its optimizations mean that while it is suitable for heavy-lifting data extraction, it cannot be used for regular RPC calls to post transactions. Currently method support is limited to:

> - `eth_chainId`
> - `eth_blockNumber`
> - `eth_getBlockByNumber`
> - `eth_getBlockByHash`
> - `eth_getTransactionByHash`
> - `eth_getTransactionByBlockHashAndIndex`
> - `eth_getTransactionByBlockNumberAndIndex`
> - `eth_getTransactionReceipt`
> - `eth_getBlockReceipts`
> - `eth_getLogs`
> - `eth_getFilterLogs`
> - `eth_getFilterChanges`
> - `eth_uninstallFilter`
> - `eth_newFilter`

It is recommended for best performance of filter related methods to use the 'stateful' rpc endpoints, since the filter methods are stateful. These include `eth_getFilterLogs`, `eth_getFilterChanges`, `eth_uninstallFilter`, `eth_newFilter`. Please note, the performance of the stateful rpc endpoints might not be quite as good for other calls as the standard rpc endpoint.
These methods are already supported on a wide selection of chains (the most up-to-date list can be found [here](/docs/HyperIndex/hypersync))

Testing the endpoint and providing feedback is hugely valuable. To access these endpoints for free please join our [Discord](https://discord.gg/Q9qt8gZ2fX) and reach out or alternatively log in via GitHub on the main website to access your endpoints.

> ### Disclaimer
>
> - HyperRPC is still under active development to improve performance and stability.
> - It has not been audited for security purposes.
> - It does not support all RPC methods.
> - We appreciate your patience until we get there. Until then, we are happy to answer all questions in our [Discord](https://discord.gg/Q9qt8gZ2fX).

---
