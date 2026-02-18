---
title: Envio Developer Update February 2026
Sidebar_label: Envio Developer Update February 2026
slug: /blog/envio-developer-update-february-2026
description: "Envio Developer Update February 2026: HyperIndex v3 alpha.13 with 3x faster backfills, improved RPC support, MegaETH and Sei indexing, new builder series, and Uniswap v4 alert bots."
---

<img src="/blog-assets/dev-update-feb-26.png" alt="Cover Image Envio Developer Update Feb 2026" width="100%"/>

<!--truncate-->

February brings a couple new HyperIndex V3 alpha release along with expanded network support and feature updates. We shipped HyperIndex v3.0.0 alpha.13 & alpha.14 with 3x faster historical backfills, support for DESC indices, improved RPC source support, experimental WebSocket support, and a breaking configuration change with `rpc_config` removed in favour of `rpc`, new getWhere API, removed ordered multichain mode support, big Cursor/Claude update and much more!

We expanded our indexing support to MegaETH mainnet and Sei. This month also includes a new multi-part YouTube series on building with HyperIndex and updates to our Uniswap v4 alert bots. Let’s dive in! 


## ⚡ New release: HyperIndex v3.0.0 - alpha.13 & alpha.14

### Alpha.14

### 🚨 Breaking: New getWhere API

We updated our getWhere API to enable support for multiple filters at a time in future HyperIndex versions. Instead of chaining, it now uses a single function call with filters that match GraphQL style for familiarity.

```
Old: context.Entity.getWhere.fieldName.eq(value)
New: context.Entity.getWhere({ fieldName: { _eq: value } })
```
### 🔄 Breaking: Removed Ordered Multichain Mode Support

Ordered Multichain Mode forced events across all processed chains into global onchain order, causing significant latency and allowing one bad chain to freeze the entire indexing process.

Events are still processed in on-chain order per chain.
For cross-chain interactions, create a partial entity on one chain and finalize it when the related event arrives on another chain. This provides lower latency and a more reliable system.

### 🤖 Big Cursor/Claude Skills Update

We updated `envio init` to create projects with multiple skills to support agentic driven development.

The LLM landscape changes quickly, so we welcome feedback to improve the skills and the development experience with them.

### ⛓️ Chain Info for Test Indexer

```
const indexer = createTestIndexer();

indexer.chainIds
indexer.chains

indexer.chains[1].id
indexer.chains[1].name
indexer.chains[1].startBlock
indexer.chains[1].endBlock

indexer.chains[1].ERC20.abi
indexer.chains[1].ERC20.addresses // Useful to test dynamic registrations
```

### Alpha.13

This alpha release focused on performance improvements, expanded indexing capabilities, and RPC configuration changes as we continue iterating on V3.

Historical backfills are significantly faster, query flexibility has improved with support for descending indices, RPC sources now expose additional receipt level fields, and configuration has been streamlined with the removal of `rpc_config` in favour of a unified **<code>rpc</code>** structure.



### 🏎️ 3x Historical Backfill Performance

We introduced chunking logic to request events across multiple ranges at once, fixed overfetching for contracts with much later `start_block` values, and sped up dynamic contract registration.

If data fetching was your bottleneck, this release helps.

**<span style={{ textDecoration: 'underline' }}>25k events per second is now standard</span>**


### 📉 Support for DESC Indices

You can now define indices with descending order to improve query performance: 


```
type PoolDayData
  @index(fields: ["poolId", ["date", "DESC"]]) {
  id: ID!
  poolId: String!
  date: Timestamp!
}
```



### ⛽ Improved RPC Source Support

Added support for receipt-only fields:

• **<code>gasUsed</code>**

• **<code>cumulativeGasUsed</code>**

• **<code>effectiveGasPrice</code>**

When one of these fields is added in `field_selection`, HyperIndex will automatically perform an additional `eth_getTransactionReceipt` request.


### 🔌 WebSocket Support for RPC (Experimental)

Experimental WebSocket support for RPC sources to improve head latency.

If you run into issues, please open a GitHub issue. 🙏


```
chains:
  - id: 1
    rpc:
      url: ${ENVIO_RPC_ENDPOINT}
      ws: ${ENVIO_WS_ENDPOINT}
      for: live
```



### 🚨Breaking: rpc_config Removed

`rpc_config` has been removed in favour of **<code>rpc</code>**.


```
- rpc_config
+ rpc:
      url: ${ENVIO_RPC_ENDPOINT}
+     for: sync # Add to force RPC usage instead of HyperSync
```


Additionally, you can specify multiple rpcs by providing a list:


```
rpc:
  - url: ${ENVIO_RPC_ENDPOINT}
    for: sync
  - url: ${ENVIO_RPC_FALLBACK_ENDPOINT}
    for: fallback
```


If **<code>for</code>** is not provided, the RPC URL is used as a fallback for HyperSync or as the main source when HyperSync is not supported.


We recommend migrating to v3.0.0 alpha. 13 to take advantage of the performance improvements and configuration updates. Give it a test and let us know how it goes. We welcome any feedback as we continue refining V3.

For information, be sure to check out the full release notes. More updates coming soon.

👉 See full [release notes](https://github.com/enviodev/hyperindex/releases)

👉 Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐


## Indexing Data on MegaEth Mainnet

<img src="/blog-assets/dev-update-feb-26-1.gif" alt="MegaEth Mainnet" width="100%"/>

[MegaETH](https://rabbithole.megaeth.com) launched its public Mainnet on February 9, 2026, marking the transition from testnet experimentation to a live production network. As a performance focused Ethereum Layer 2, MegaETH is built to support high throughput and low latency execution for onchain applications.

With mainnet now live, developers can deploy and operate applications directly on the network.

Envio proudly supports developers building on MegaETH Mainnet, providing efficient access to real-time and historical data for teams building in the ecosystem.

For more information, see the original [post](https://x.com/envio_indexer/status/2020882703583727665?s=20) on X.


## Building Indexers with HyperIndex

<img src="/blog-assets/dev-update-feb-26-2.png" alt="Building Indexers with HyperIndex" width="100%"/>

Check out Decrypted Bytes’ new multi-part YouTube series that walks through how to build with HyperIndex. The series covers building an indexer using HyperIndex from scratch. It follows the full process in a live coding format, showing how to set up, iterate, and expand an indexer step by step.

If you want to learn how to build with HyperIndex in practice, this series is a great place to start.

Be sure to check out the series on [YouTube](https://www.youtube.com/@decryptedbytes/streams) and subscribe to follow along as more parts are released.


## Tyde Terminal Tide Visualiser

<img src="/blog-assets/dev-update-feb-26-3.gif" alt="Tyde" width="100%"/>


Tyde is an open source terminal based tool that visualises real world tide levels directly in the command line. It renders an animated tide scene with waves, sand, and foam, alongside a 24-hour tide chart showing the current position in the cycle. Sunrise and sunset times are also displayed, with support for a day and night cycle.

Tide predictions are computed locally using harmonic analysis across more than 50 global stations, with no external APIs required.

You can run Tyde directly in your terminal on macOS or Linux, or build it from source.

For more information, see the [GitHub repo](https://github.com/moose-code/tyde) or the original [post](https://x.com/jonjonclark/status/2022313741593858297?s=20) on X. 


## Index Data on Sei

<img src="/blog-assets/dev-update-feb-26-4.png" alt="Index data on Sei" width="100%"/>

Just Sei it.

Build, index & scale high performance apps on [Sei](https://www.sei.io) using Envio.

Instantly access real-time & historical data on one of the fastest L1 EVMs. Sync millions of events in minutes, 2000× faster than RPC.

Easy. Fast. Fully customizable.


For more information, see the original [post](https://x.com/envio_indexer/status/2021981848557986255?s=20 ) on X.


## Envio Alerts: Uniswap v4 Alert Bots

<img src="/blog-assets/dev-update-feb-26-5.png" alt="Envio alert bots" width="100%"/>


Get automated alerts when a Uniswap v4 pool crosses 1m in TVL, including when an MEV bot trade causes the threshold to be hit.

Each alert includes:

* Token pair
* TVL threshold hit
* Chain

The [MEV Alerts bot](https://t.me/+5uldwTve8ns3MDFk) highlights MEV driven TVL events, while the [Liquid Token Alerts bot](https://t.me/+0eUs4YO6HMJlNzBk) tracks pools crossing the 1m TVL mark.

Be sure to join the bot groups on Telegram to receive alerts in real-time and stay up to date on Uniswap v4 pool activity.


## 🗓️ Current & Upcoming Events & Hackathons

* [EthDenver - Denver](https://ethdenver.com/): Feb 17th → 21st
* [EthCC - Cannes](https://ethcc.io/): March 30th → April 2nd
* [EthConf - New York](https://ethconf.com/): June 8th → 10th 


## 🎧️ Playlist of the Month

<img src="/blog-assets/dev-update-feb-26-7.png" alt="PLOTM Feb 2026" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/0CNf2YeAWBGUii76h6xilv?si=575e6a3e76c844b5)


## Build with Envio

Envio is a multi-chain EVM blockchain indexer for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
