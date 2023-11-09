---
title: "RPC Endpoints Unveiled: HyperRPC's Performance in the Spotlight"
sidebar_label: "RPC Endpoints Unveiled: HyperRPC's Performance in the Spotlight"
slug: /hyperrpc-benchmarking-results
---

<!-- <img src="/blog-assets/envio-benchmarking-blockchain-indexing-sync-speeds.png" alt="benchmarking sync speeds" width="100%"/> -->

<!--truncate-->

## Introduction

This blog article presents the findings from benchmarking tests conducted on HyperRPC, an extremely fast read-only RPC for data-intensive task. Instead of measuring the pure response times of HyperRPC against some of the alternatives, the benchmarking was done on the sync time of an indexer over a 100,000-block interval, as this would produce a more comparable and practical figure for users of RPC endpoints.
For more information on HyperRPC, please go [here](https://docs.envio.dev/docs/overview-hyperrpc).

**Why is speed important when it comes to RPC requests?**

In order to access on-chain data, users usually have to make RPC requests using designated RPC node providers. Depending on the size and type of request, the responses can take a variable amount of time to come back with the requested data in JSON format.

This turnaround time for RPC requests create an inherent turnaround time for whatever application that is using the delivered data, whether it be an indexer, a trading algorithm or an on-chain analytics tool. Hence, shortening this turnaround time is fundamental to development and optimization of such applications and could lead to not just better user experience, but better developer experience and improved economics depending on the application.

Additionally, any user wanting a reliable RPC end point will need to consider the cost of it at some stage. The longer and more an application uses RPC endpoints to accumulate data, the higher the operational costs related to it will be.

> NOTE: HyperRPC and HyperIndex have no dependency on each other. It was only for benchmarking purposes that a HyperIndex indexer was used to measure the sync times using different RPC endpoints.

## Methodology

To get a sense of what the tangible advantage of using a HyperRPC as opposed to an alternative, we measured the sync time of an indexer (built using [HyperIndex](https://docs.envio.dev/docs/overview)) over 100,000-block intervals with different event densities using different RPC endpoints.

The indexer was for a Uniswap V3 pool contract, that can be found on [Etherscan](https://etherscan.io/address/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640).

Schema was kept constant across the various runs:

```graphql
type Swap {
  id: Bytes!
  sender: Bytes! # address
  recipient: Bytes! # address
  amount0: BigInt! # int256
  amount1: BigInt! # int256
  sqrtPriceX96: BigInt! # uint160
  liquidity: BigInt! # uint128
  tick: Int! # int24
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

Indexer would listen to the `Swap` event emitted by the smart contract and append the details of each swap to the `Swap` entity table defined in the schema.

In particular, the benchmark tests were run over two 100,000-block intervals with distinct event densities:

1. Low event density: [12,376,729, 12,477,364] - 15,506 events (0.15 events per block)
1. High event density: [15,800,000, 15,900,000] - 129,931 (1.30 events per block)

## RPC endpoints used

We employed 4 separate RPC endpoints for this benchmarking test:

- [Envio HyperRPC](https://docs.envio.dev/docs/overview-hyperrpc)
- [RETH node](https://github.com/paradigmxyz/reth)
- [Chainstack](https://chainstack.com/build-better-with-ethereum/)
- [Ankr](https://www.ankr.com/rpc/eth/)

## Experiment 1: Local machine with 500-block interval per RPC request

## Experiment 2: Cloud machine with 500-block interval per RPC request

## Experiment 3: Cloud machine with 10000-block interval per RPC request

> Disclaimer: This indexing performance is specific to the Uniswap V3 ETH-USDC pool scenario that was used across all deployments of indexers. The relative performance of HyperRPC will differ according to the scenario being indexed and the application it is being used for.

### Caveats

It is essential to consider certain caveats while interpreting these results:

- The performance differences observed are applicable in the context of using an indexer which syncs with data retrieved from RPQ requests.
- The absolute performance metrics of each run are specific to the indexer configurations such as the block range, contract indexed, the schema and the event handling logic.

## What Next?

Perform benchmarking of HyperRPC in other aspects such as latency, throughput and success rate. As millions of RPC requests are made, it is important that RPC requests are not just fast, but also reliable and consistent.

Some benchmarking tools already exist in the space that allow users to assess the relative reliability / availability metrics of an RPC endpoint, such as [Flood](https://www.paradigm.xyz/oss/flood) that has been built by Paradigm.

## Conclusion

### Ship with us.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Build with Envio, and sail into the future of Web3 applications and dApps. Join our [community](https://discord.gg/mZHNWgNCAc) of elite shippers today and [ship with us](https://lteyv6e0ojf.typeform.com/to/XaGtyQpC)!
