---
title: Indexing and Reorgs
sidebar_label: Indexing and Reorgs
slug: /indexing-and-reorgs
description: "Learn how Envio handles blockchain reorgs to maintain data accuracy and consistency when indexing on-chain events across multiple networks."
---

<img src="/blog-assets/indexing-and-reorgs.png" alt="Envio Cover Photo" width="100%"/>

<!--truncate-->


# Indexing & Reorgs

In this article, we unpack the implications of chain re-organizations on consuming and aggregating data, considerations in a multichain chain environment, and how we can design for this. 

We assume you have a strong understanding of what a chain reorganization is but if you want to brush up, skip to the bottom [here](#what-are-chain-reorgs).


> Note: Handling reorgs is only important if you’re indexing at the head, or handling data within the range of the head and the network's finalized block.  


## Chain Reorgs & Independent Data

Independent data is data that **doesn’t require the previous state in order to process the current state**. In an indexer, this can quite simply be contextualized as only “create” operations. 

Considering you are ingesting data and the only CRUD (Create, Read, Update & Delete) operations your handlers perform are writing entities, then your indexer is handling stateless data, and the concept of handling reorgs is very simple. Effectively delete all the entities from orphaned blocks and re-ingest them with the canonical blocks data. This is possible since stateless data allows for parallel processing.

Practically speaking we need to perform some form of aggregation on this data to process it into information, in this context our indexer is dealing with stateful data.

> Side tangent: Stateless indexing can be handled incredibly fast by parallelization, such as indexers like [Flair](https://flair.dev) who achieve impressive speed with only RPC.  


## Chain Reorgs and Stateful Data

Stateful data is data that **depends on the previous state**, think update & delete, in order to process the current state. In an indexer, this means that operations such as updates and deletes are required, rather than simply writing new entities. When handling stateful data, your indexer needs to account for the current state of entities, and thus, reorgs become notably more complex.

During a chain reorg, rather than simply replacing orphaned data, you need to **revert previous operations or changes** and ensure that the entity state is rolled back correctly. This requires tracking the history of changes to each entity so that, when a reorg occurs, you can accurately undo or adjust state based on the adopted canonical chain’s data.

> Note: We can periodically prune the entity history, retaining only the changes relevant to unfinalized blocks.


## Reorgs and Multichain Indexing

When it comes to multichain indexing, we face additional complexities as we process events from multiple sources that interact and update the same entity state. When one chain undergoes a reorg, we need to roll back the state to a known correct point and reprocess any events from all chains that affected the state after the reorg on the affected chain.


## Reorgs in the Wild

In practice, different networks exhibit varying levels of exposure to reorgs based on their design. Some networks, like Base and the [OP stack](https://x.com/ShivanshuMadan/status/1811492866818212024), are largely reorg-resistant with block finality occurring at the head, though [exceptions](https://optimistic.etherscan.io/blocks_forked) do exist. On the other hand, networks like Polygon frequently experience deeper reorgs, where forked chains can extend over 10 blocks deep—one notable instance involved a reorg of [157 blocks](https://forum.polygon.technology/t/157-block-reorg-at-block-height-39599624/11388). Both [Etherscan](https://etherscan.io/blocks_forked) and [Blockscout](https://gnosis.blockscout.com/blocks?tab=reorgs) provide data on reorg occurrences. According to Ethereum Mainnet [Etherscan](https://etherscan.io/blocks_forked), roughly 1% of blocks undergo reorgs, meaning that, assuming a 50/50 chance of a transaction being included in either the orphaned or canonical chain, about 1 in 200 transactions is likely to be in a reorg-ed block.


## Conclusion

Ultimately, reorgs are a crucial consideration in blockchain indexing, and by understanding their implications and designing with flexibility, we can properly account for them in our indexer.

<a id="what-are-chain-reorgs"></a>
## What are Chain Reorgs?

In order to understand reorgs, let’s break down the fundamental concepts of a reorg and build up to our definition of a reorg.

**Fundamental concepts:**

* Block
* Chain
* Miners
* Chain fork
* Orphaned chain
* Canonical chain
* Block finality

### Block

A container that stores transactions.

<img src="/blog-assets/indexing-and-reorgs-1.png" alt="Indexing & Reorgs" width="100%"/>

### Chain

A series of sequential blocks.

<img src="/blog-assets/indexing-and-reorgs-2.png" alt="Indexing & Reorgs" width="100%"/>

### Miners

Actors that try to submit the next valid block.

<img src="/blog-assets/indexing-and-reorgs-3.png" alt="Indexing & Reorgs" width="100%"/>

### Chain fork

<img src="/blog-assets/indexing-and-reorgs-4.png" alt="Indexing & Reorgs" width="100%"/>

A chain fork occurs when more than one miner submits a valid block at the same time causing a split and two valid chains to exist.

### Orphaned Chain & Canonical chain

<img src="/blog-assets/indexing-and-reorgs-5.png" alt="Indexing & Reorgs" width="100%"/>

When a chain forks, eventually one of the chains becomes accepted as the valid chain, known as the canonical chain, the forked chain that isn’t accepted becomes the orphaned chain, the orphaned blocks don’t continue existing and the transactions that occur in those blocks cease to exist. 

* **Orphaned chain** - The forked chain that is dropped 
* **Canonical chain** - The chain that is adopted as the valid chain

> Info: It’s worth noting that we don’t know which fork will be the orphaned chain and which will become the canonical chain until after the fact. 


### Block finality

The minimum number of blocks to confirm the blocks will not become part of an orphaned chain.

> Info: Block finality is the reason bridges and centralized exchanges require a delay once the transaction is confirmed to ensure blocks won’t become orphaned blocks


### Reorg

This brings us to our definition of a re-org in the context of data

A reorg is a set of events that results in a chain to rollback to a previous point in time.


## About Envio

[Envio](https://envio.dev/) is a modern, dev-friendly, speed-optimized blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. Blockchain developers and data analysts can harness the power of Envio to overcome the challenges posed by latency, reliability, infrastructure management, and costs across various sources. 

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. 

Join our growing community of Web3 developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
