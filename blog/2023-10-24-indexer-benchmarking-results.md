---
title: "Race to the Blocks: Benchmarking Blockchain Indexer Sync Speeds"
sidebar_label: "Race to the Blocks: Benchmarking Blockchain Indexer Sync Speeds"
slug: /indexer-benchmarking-results
---

<img src="/blog-assets/envio-benchmarking-blockchain-indexing-sync-speeds.png" alt="benchmarking sync speeds" width="100%"/>

<!--truncate-->

## Introduction

This blog article presents the findings from benchmarking tests conducted at Envio to assess the syncing performance of various web3 indexing solutions. At Envio, our goal is to develop a high-performance blockchain indexing solution, and we believe that validating this goal through a rigorous data-driven approach is essential.
Sync speed simply put, is how long it takes for an indexer to catch up to the head of the blockchain using a historical block as a starting point.

**Why is indexing speed important?**

Indexing speed is important because it inherently creates a friction to deploy, debug and iterate on newer versions of the indexer. The longer the total sync time, the longer it takes to innovate and resolve issues on existing deployments.

In summary, we indexed the Uniswap V3 ETH-USDC pool contract on Ethereum Mainnet, starting from its deployment block. This specific smart contract was chosen due to its high event density, providing an ideal testbed for evaluating indexing performance in a high event-density context.

You can review the smart contract on [Etherscan](https://etherscan.io/address/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640).

## Methodology

To ensure that the sync speeds from different indexers were as comparable as possible, we ensured that the configurations of all indexers for different solutions were identical. This included:

- Indexing from the same start block for all indexers (12,376,729 - the deployment block for the contract) until the end block at the time of experimentation (18,342,024), with an approximate total of 5,395,050 raw events indexed (0.9044 events per block).
- Employing the same schema (outlined below).
- Specifying identical event handling logic (explained further).

### Schema screenshot

The schema used for all indexers during benchmarking was defined as follows:

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

### Event handler logic

For this initial iteration, the event handling logic was kept straightforward and lightweight. Indexers would listen to the `Swap` event emitted by the smart contract and append the details of each swap to the `Swap` entity table defined in the schema.

## Indexers Used

We employed 6 separate indexer solutions for this benchmarking test:

- [Envio](https://envio.dev/)
  - v0.0.20
  - v0.0.19
- [Subsquid](https://subsquid.io/)
- Subgraph on [theGraph](https://thegraph.com/hosted-service) hosted solution
- [Ponder](https://ponder.sh/)
- [Subtreams-powered Subgraph](https://thegraph.com/docs/en/cookbook/substreams-powered-subgraphs/) on theGraph hosted solution

## Findings

Below is a the results from the benchmarking tests, measured in number of events indexed per second:

<img src="/blog-assets/envio-univ3-benchmark-results.png" alt="future of blockchain indexing" width="100%"/>

Total sync times (minutes) per indexer are outlined in the table below, sorted from quickest to slowest:

| Indexer                     | Total sync time (minute) |
| --------------------------- | ------------------------ |
| Envio v0.0.20               | 9.67                     |
| Subsquid                    | 20.50                    |
| Envio v0.0.19               | 21                       |
| Ponder                      | 780.37                   |
| theGraph                    | 1,000                    |
| Substreams-powered Subgraph | 1,529.33                 |

**Key takeaways:**

- Envio v0.0.20 ranked the fastest at indexing out of all the indexing solutions used
  - 2.12 times faster than Subsquid
  - 2.17 times faster than Envio v0.0.19
  - 80.6 times faster than Ponder
  - 103.24 times faster than theGraph
  - 157.72 times faster than Substreams-powered subgraph

> Disclaimer: This indexing performance is specific to the Uniswap V3 ETH-USDC pool scenario that was used across all deployments of indexers. The relative performance of different indexers will differ according to the scenario.

### Caveats

It is essential to consider certain caveats while interpreting these results:

- Versions of Envio and Subsquid were run on local machines, while the subgraphs were deployed on a hosted service, introducing potential variations.
- Ponder was deployed onto a virtual machine with 4GB of memory and 80GB disk space.
- Ponder indexing performance was extrapolated based on initial indexing progress when syncing historical blocks.

## What Next?

The logical progression from this benchmarking exercise is to measure the relative syncing times of different indexers across various scenarios.

Variations including but not limited to:

- Number of contracts and events being indexed
- Event density per block
- Number and complexity of entities in the schema
- Complexity of logic in the event handlers, including loading and updating of existing entities

Different indexers may excel under different scenarios, making them more suitable for specific use cases. We encourage our users to suggest new ideas and build out scenarios for future benchmarking.

## Conclusion

In conclusion, this blog article provides a data-driven analysis of the comparative performance of various indexing solutions. The results clearly demonstrate Envio's competitive edge in terms of syncing speed over the alternative indexing solutions. As we continue our journey in the web3 space, we remain committed to delivering the best possible solutions for blockchain developers.

We remain devoted to finding data-driven results and comparisons at Envio, and encourage others to benchmark Envio's performance going forward.

### Ship with us.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Build with Envio, and sail into the future of Web3 applications and dApps. Join our [community](https://discord.gg/mZHNWgNCAc) of elite shippers today and [ship with us](https://lteyv6e0ojf.typeform.com/to/XaGtyQpC)!
