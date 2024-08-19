---
title: Building ChainDensity
sidebar_label: Unveiling Blockchain Activity Patterns with HyperSync
slug: /building-chaindensity
---

<img src="/blog-assets/density1.png" alt="Cover Image for Building ChainDensity" width="100%"/>

# Building ChainDensity: Unveiling Blockchain Activity Patterns with HyperSync

## 1. Introduction: The Genesis of ChainDensity

In the ever-evolving landscape of blockchain technology, understanding the activity patterns of addresses is crucial for developers, analysts, and researchers. Enter ChainDensity, a simple yet powerful tool designed to visualize event and transaction density across Ethereum and other EVM-compatible blockchains.

At its core, ChainDensity offers a unique perspective on blockchain activity by creating density plots that span the entire length of a chain. This visualization allows users to quickly grasp when an address is most active and its total activity over time. You can explore this tool yourself at [https://chaindensity.xyz](https://chaindensity.xyz).

Consider, for instance, the 'Banana Gun: Router' address on Ethereum. ChainDensity reveals all 5.7 million events emitted by the address, providing a clear distribution of activity of the protocol across the chain's lifespan.

<img src="/blog-assets/banana-gun-router.png" alt="Banana Gun Router Event Density" width="100%"/>

### The Dual Lens: Event and Transaction Density

ChainDensity operates in two distinct modes:

1. **Event Density**: This mode illuminates the volume of events emitted by a contract address over time. It's particularly valuable for data indexing projects, as most smart contracts emit events for significant actions like swaps, transfers, mints, or burns.

2. **Transaction Density**: This view showcases the volume of transactions an address participates in over time, offering insights into overall account activity.

### The Data Indexing Dilemma

Event density analysis is a very insightful for blockchain data indexing. Traditionally, retrieving event data has been the Achilles' heel of indexing projects. The process of scanning through hundreds of millions of blocks for events is notoriously slow and resource-intensive.

ChainDensity addresses this challenge head-on. It provides a rapid assessment of the volume of events to be indexed and their distribution across the chain. This information is invaluable for planning indexing projects, estimating timelines, and determining the most appropriate indexing methodologies.

_Pro-tip: indexing millions of events? Consider using HyperIndex (which leverages HyperSync under the hood) to speed up the process._

## 2. The Blockchain Data Retrieval Challenge

The conventional approach to blockchain data retrieval involves running a node and using RPC methods to extract data. This method, while functional, is far from efficient:

- It's a slow process that consumes significant resources.
- Nodes are optimized for maintaining blockchain functionality, not for rapid and flexible data retrieval.
- Replicating ChainDensity's functionality using traditional methods would require tens of thousands of `eth_getLogs` calls, a time-consuming and resource-intensive endeavor.

This inefficiency isn't unique to ChainDensity's use case; it's a common hurdle in various blockchain data applications, from analytics to protocol development.

## 3. Enter HyperSync: Modern Blockchain Data Retrieval

HyperSync emerges as a game-changing solution in the blockchain data retrieval landscape. This highly specialized data node, built with Rust, offers a quantum leap in data retrieval speeds while providing unparalleled flexibility.

### Key Features of HyperSync:

- A powerful API capable of filtering blocks, transactions, logs, and traces.
- Granular control over data retrieval.
- Support for Python, Rust, and NodeJs clients.
- Compatibility with over 50 EVM chains and Fuel.

### HyperSync in Action: The ChainDensity Example

ChainDensity leverages the Python client to interact with HyperSync. This integration transforms what would typically require thousands of `eth_getLogs` calls into a single, efficient query to the HyperSync node.

Moreover, HyperSync's flexibility allows for precise data selection. In ChainDensity's case, we're only interested in the block number associated with each log or transaction. By specifying this in the query, we drastically reduce the data transfer volume, further enhancing performance.

```93:119:app.py
def create_query(address, start_block, request_type):
    if request_type == "event":
        query = hypersync.Query(
            from_block=start_block,
            logs=[LogSelection(
                address=[address],
            )],
            field_selection=FieldSelection(
                log=[
                    LogField.BLOCK_NUMBER,
                ],
            ),
        )
    else:
        query = hypersync.Query(
            from_block=start_block,
            transactions=[
                TransactionSelection(from_=[address]),
                TransactionSelection(to=[address]),
            ],
            field_selection=FieldSelection(
                transaction=[
                    TransactionField.BLOCK_NUMBER,
                ],
            ),
        )
    return query
```

This code snippet demonstrates the elegant simplicity of creating HyperSync queries for both event and transaction data. The queries are concise yet powerful, filtering for specific addresses and selecting only the necessary field (block number) for our density analysis.

## 4. Scalability and Performance: HyperSync's True Power

The true prowess of HyperSync becomes evident when dealing with large-scale data retrieval. Consider the Aave: Pool V3 on Arbitrum:

- 244,532,390 blocks processed
- 9,108,786 events processed
- All accomplished in just 31.51 seconds

This translates to an impressive processing rate of 7,761,296 blocks per second and 289,107 events per second. This level of performance is achievable "cold" (without caching) for any address across more than 50 different chains. Such speed and efficiency open up new possibilities for all kinds of applications previously impossible due to data retrieval limitations.

<img src="/blog-assets/aave-v3-pool.png" alt="Aave v3: Pool" width="100%"/>

## 5. Visualizing Blockchain Activity

ChainDensity's visualization capabilities bring blockchain data to life. The density plots offer intuitive insights into address activity patterns, allowing users to identify:

- Periods of high activity
- Dormant phases
- Overall transaction or event volume trends

Consider this interesting event density plot for the Mutant Ape Yacht Club collection. One can see a massive intial spike in activity (minting) before relatively little activity as users presumably held their NFTs. One can start to see a second spike in activity as users likely started to sell their NFTs. Today activity is minimal as the collection is less popular.

<img src="/blog-assets/mutant-ape-yacht-club.png" alt="Mutant Ape Yacht Club" width="100%"/>

## 6. Future Horizons for ChainDensity

While ChainDensity already offers powerful insights, there's potential for even more advanced features:

- Multi-address analysis: Comparing activity patterns across multiple addresses on a single plot.
- Cross-chain comparisons: Visualizing how an address or contract behaves across different networks.

Why not head over to the repo and make a pull request? https://github.com/enviodev/chain-density

## 7. Use HyperSync yourself

To explore ChainDensity and experience the power of HyperSync firsthand, visit [https://chaindensity.xyz](https://chaindensity.xyz). For those interested in leveraging HyperSync for their own projects, comprehensive documentation and resources are available at [https://docs.envio.dev/docs/HyperSync/overview](https://docs.envio.dev/docs/HyperSync/overview).
