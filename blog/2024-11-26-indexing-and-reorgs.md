---
title: Indexing and Reorgs
sidebar_label: Indexing and Reorgs
slug: /indexing-and-reorgs
description: "Learn how Envio handles blockchain reorgs to maintain data accuracy and consistency when indexing onchain events across multiple networks."
image: /blog-assets/indexing-and-reorgs.png
last_update:
  date: 2026-04-15
---

Author: [Denham Preen](https://x.com/DenhamPreen), Co-Founder at Envio


<img src="/blog-assets/indexing-and-reorgs.png" alt="Envio Cover Photo" width="100%"/>

<!--truncate-->

:::note TL;DR
- Chain reorganizations (reorgs) affect any indexer processing data near the chain head. Stateful indexers (those using updates and deletes) require rollback logic. Stateless ones (create-only) just need orphaned entities deleted.
- Multichain indexers face additional complexity: a reorg on one chain may require rolling back state that was affected by events from other chains.
- Envio handles reorg detection and rollback automatically, so developers do not need to implement rollback logic themselves.
:::

In this article, we unpack the implications of chain reorganizations on consuming and aggregating onchain data, considerations in a multichain environment, and how to design for them.

We assume you have a strong understanding of what a chain reorganization is. If you want a refresher, skip to the [bottom](#what-are-chain-reorgs).

> Note: Handling reorgs is only important if you are indexing at the head, or handling data within the range of the head and the network's finalized block.


## Chain reorgs and independent data

Independent data is data that **does not require the previous state in order to process the current state**. In an indexer, this means only "create" operations. If the only CRUD operations your handlers perform are writing entities, your indexer is handling stateless data, and handling reorgs is straightforward: delete all entities from orphaned blocks and re-ingest them with the canonical block's data. This is possible because stateless data allows for parallel processing.

In practice, we usually need to perform some aggregation on data to turn it into meaningful information. In that context, our indexer is dealing with stateful data.

> Side tangent: Stateless indexing can be handled incredibly fast by parallelization, such as indexers like [Flair](https://flair.dev) that achieve impressive speed with only RPC.


## Chain reorgs and stateful data

Stateful data is data that **depends on the previous state** (think update and delete operations) in order to process the current state. When handling stateful data, your indexer needs to account for the current state of entities, and reorgs become notably more complex.

During a chain reorg, rather than simply replacing orphaned data, you need to **revert previous operations or changes** and ensure that the entity state is rolled back correctly. This requires tracking the history of changes to each entity so that when a reorg occurs, you can accurately undo or adjust state based on the adopted canonical chain's data.

> Note: We can periodically prune the entity history, retaining only the changes relevant to unfinalized blocks.


## Reorgs and multichain indexing

When it comes to multichain indexing, we face additional complexity because we process events from multiple sources that interact and update the same entity state. When one chain undergoes a reorg, we need to roll back the state to a known correct point and reprocess any events from all chains that affected the state after the reorg on the affected chain.


## Reorgs in the wild

In practice, different networks exhibit varying levels of exposure to reorgs based on their design. Some networks, like Base and the [OP stack](https://x.com/ShivanshuMadan/status/1811492866818212024), are largely reorg-resistant with block finality occurring at the head, though [exceptions](https://optimistic.etherscan.io/blocks_forked) do exist. On the other hand, networks like Polygon frequently experience deeper reorgs, where forked chains can extend over 10 blocks deep. One notable instance involved a reorg of [157 blocks](https://forum.polygon.technology/t/157-block-reorg-at-block-height-39599624/11388). Both [Etherscan](https://etherscan.io/blocks_forked) and [Blockscout](https://gnosis.blockscout.com/blocks?tab=reorgs) provide data on reorg occurrences. According to Ethereum Mainnet Etherscan, roughly 1% of blocks undergo reorgs, meaning that, assuming a 50/50 chance of a transaction being included in either the orphaned or canonical chain, about 1 in 200 transactions is likely to be in a reorged block.


## Conclusion

Reorgs are a crucial consideration in blockchain indexing. Understanding their implications and designing with flexibility allows you to properly account for them in your indexer. Envio handles reorg detection and state rollback automatically, so developers building on HyperIndex get correct data at the head without needing to implement rollback logic themselves.

<a id="what-are-chain-reorgs"></a>
## What are chain reorgs?

In order to understand reorgs, let's break down the fundamental concepts and build up to a definition.

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

A chain fork occurs when more than one miner submits a valid block at the same time, causing a split where two valid chains exist simultaneously.

### Orphaned chain and canonical chain

<img src="/blog-assets/indexing-and-reorgs-5.png" alt="Indexing & Reorgs" width="100%"/>

When a chain forks, eventually one chain becomes accepted as the valid chain, known as the canonical chain. The forked chain that is not accepted becomes the orphaned chain. Orphaned blocks cease to exist, and transactions that occurred in those blocks cease to exist as well.

* **Orphaned chain**: The forked chain that is dropped
* **Canonical chain**: The chain adopted as the valid chain

> Info: We do not know which fork will be orphaned and which will become canonical until after the fact.


### Block finality

The minimum number of blocks needed to confirm that blocks will not become part of an orphaned chain.

> Info: Block finality is the reason bridges and centralized exchanges require a confirmation delay after a transaction is confirmed, to ensure blocks will not become orphaned.


### Reorg

A reorg is a set of events that results in a chain rolling back to a previous point in time.

## Frequently asked questions

### Does every blockchain indexer need to handle reorgs?

Not necessarily. If your indexer only processes finalized blocks (past the finality threshold), reorgs are not a concern. Reorg handling is only important if you are indexing at the head or within the range between the head and the network's finalized block.

### What is the difference between stateless and stateful indexing in the context of reorgs?

A stateless indexer only creates new entities. On a reorg, you delete orphaned entities and re-ingest from the canonical chain. A stateful indexer also updates and deletes entities based on previous state, which requires tracking the history of changes so that state can be accurately rolled back when a reorg occurs.

### Which networks experience the most frequent or deepest reorgs?

Polygon is known for frequent and sometimes deep reorgs (a 157-block reorg has been recorded). Base and OP stack chains are largely reorg-resistant due to single-slot finality. Ethereum mainnet sees roughly 1% of blocks affected by reorgs. Networks with faster block times and probabilistic finality tend to have more reorg activity.

### How does Envio handle reorgs automatically?

Envio HyperIndex tracks entity state history for all unfinalized blocks. When a reorg is detected, it rolls back entity state to the correct point and reprocesses events from the canonical chain. This happens automatically and does not require any custom rollback logic in your event handlers.

### How do reorgs affect multichain indexers?

In a multichain indexer, events from multiple chains may update the same entity. If one chain reorgs, any state changes that depended on post-reorg events from that chain must also be rolled back and reprocessed, even if those changes involved events from other chains. This makes multichain reorg handling significantly more complex than single-chain reorg handling.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
