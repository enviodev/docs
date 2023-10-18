---
title: "Race to the Blocks: Benchmarking Blockchain Indexer Sync Speeds"
sidebar_label: "Race to the Blocks: Benchmarking Blockchain Indexer Sync Speeds"
slug: /indexer-benchmarking-results
---

<!--
<img src="/blog-assets/envio-existing-methods-query-blockchain-data.png" alt="future of blockchain indexing" width="100%"/> -->

<!--truncate-->

## Introduction

This blog article presents the findings from benchmarking tests conducted at Envio to assess the syncing performance of various web3 indexing solutions. At Envio, our goal is to develop a high-performance blockchain indexing solution, and we believe that validating this goal through rigorous data-driven testing is essential.
Sync performance simply put, is how long it takes for an indexer to catch up to the head of the blockchain using a historical block as a start point.

In summary, we indexed the Uniswap V3 ETH-USDC pool contract on on Ethereum Mainnet, starting from its deployment block. This specific smart contract was chosen due to its high event density, providing an ideal testbed for evaluating indexing performance in a high event density context.

You can review the smart contract on Etherscan [here](https://etherscan.io/address/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640).

## Methodology

To ensure that the sync speeds from different indexers were as comparable as possible, we ensured that the configurations of all indexers for different solutions were identical. This included:

- Indexing from the same start block for all indexers (12,376,729 - the deployment block for the contract) until the end block at the time of experimentation (18,342,024), with an approximate total of 5,395,050 raw events indexed (0.9044 events per block that is).
- Employing the same schema (outlined below).
- Specifying identical event handler logic (explained further).

### Schema screenshot

The schema used for all indexers during benchmarking was defined as follows:

```graphql
type Swap @entity {
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

### Event handler logic

For this initial iteration, the event handling logic was kept straightforward and lightweight. Indexers would listen to the `Swap` event emitted by the smart contract and append the details of each swap to the `Swap` entity table defined in the schema.

## Indexers Used

We employed four separate indexers for this benchmarking test:

- [Envio](https://envio.dev/)
  - v0.0.20 with hypersync
  - v0.0.20 with RPC sync
  - v0.0.19 with hypersync
- [Subsquid](https://subsquid.io/)
- [theGraph](https://thegraph.com/hosted-service) on hosted solution
- [Ponder](https://ponder.sh/)

## Findings

Below is a table of benchmark results measured per indexer:

| Indexer                     | Events indexed per second |
| --------------------------- | ------------------------- |
| Envio (v0.0.20) - Hypersync | 9,299                     |
| Envio (v0.0.20) - RPC sync  | 93                        |
| Envio (v0.0.19) - Hypersync | 4,282                     |
| Subsquid                    | 4,386                     |
| theGraph                    | 90                        |
| Ponder                      | 20                        |

The results indicate that Envio v0.0.20 on Hypersync performed **at least 100 times faster** than theGraph and **at least 2 times faster** than Subsquid, as measured by relative events indexed per second. Envio v0.0.19 was **around 40 times faster** than theGraph. Notably, Envio v0.0.20's syncing speed was comparable to theGraph when the RPC sync was used instead of Envio's hypersync feature.

### Caveats

It is essential to consider certain caveats while interpreting these results:

Versions of Envio and Subsquid were run on local machines, while theGraph indexer was deployed on a hosted service, introducing potential variations.
Ponder indexing performance was extrapolated based on initial indexing progress when syncing historical blocks.

## Next steps

The logical progression from this benchmarking exercise is to measure the relative syncing times of different indexers across various scenarios. This includes variations in event density per block, different numbers of entities in the schema, and more complex logic in the event handlers. Different indexers may excel under different scenarios, making them more suitable for specific use cases.

## Conclusion

In conclusion, this blog article provides a data-driven analysis of the comparative performance of various indexing solutions. The results clearly demonstrate Envio's competitive edge in terms of syncing speed on hypersync. As we continue our journey in the web3 space, we remain committed to delivering the best possible solutions for blockchain developers.

### Ship with us.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Build with Envio, and sail into the future of Web3 applications and dApps. Join our [community](https://discord.gg/mZHNWgNCAc) of elite shippers today and [ship with us](https://lteyv6e0ojf.typeform.com/to/XaGtyQpC)!
