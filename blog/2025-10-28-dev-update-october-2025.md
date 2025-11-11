---
title: Envio Developer Update October 2025
sidebar_label: Envio Developer Update October 2025
slug: /envio-developer-update-october-2025
description: "Get the full October 2025 update from Envio including v2.31.0 release focused on rollback and database performance, the new Scaffold ETH 2 extension for quicker indexer setup, and insights from our work at ETHOnline and Encode London."
---


<img src="/blog-assets/dev-update-oct-25.png" alt="Cover Image Envio Developer Community Update October 2025" width="100%"/>

<!--truncate-->

Reliability and performance were the big themes this month, with a focus on making indexing even smoother across the board. We rolled out v2.31.0, shipped key upgrades to rollback handling and database performance, and saw some great contributions from the community.

We dive into how a Uniswap alert system uncovered a MEV bot making millions, introduced a new Scaffold ETH 2 extension for faster indexer setup, and shared a look at the team’s involvement across ETHOnline, Encode London and much more. Let’s dive in!


## ⚡ MAJOR Releases: v2.30.0 → v2.31.0


### V2.30.0: Speed, consistency, and migration-friendly improvements

Version 2.30.0 introduced key performance and compatibility updates focused on reliability at scale.


#### Address Format Configuration 

You can now choose between **<code>checksum</code>** (default) and **<code> lowercase</code>** addresses directly in your config.yaml. The lowercase option makes it easier to migrate existing SubGraphs and can improve performance in some cases.

```
# config.yaml
address_format: lowercase
```

#### Faster Event Decoder for RPC Source

The RPC source now uses the HyperSync event decoder, offering a significant speed boost compared to the previous Viem decoder.

**<span style={{textDecoration: 'underline'}}>Fixes: 
</span>**


* Resolved a regression in 2.29 that affected indexing at the head Prometheus metric.
* Fixed a race condition during Hasura configuration that occasionally prevented certain GraphQL entities from having read permissions.

**<span style={{textDecoration: 'underline'}}>Internal Improvements:
</span>**


* Ensured all events from a single block are processed together for stronger data consistency.
* Optimized JS batch creation logic, improving handling for high-volume indexers (100k+ events/sec).
* Adjusted dynamic address persistence to only store processed events.

These updates laid the groundwork for the reorg refactoring work and further system optimizations in 2.31.0 and upcoming releases.


### <span style={{textDecoration: 'underline'}}>V2.31.0: Big Reliability Release</span>


#### Rollback On Reorg Refactoring

We completely rebuilt our rollback on reorg logic to make indexing more robust, predictable, and faster. This update introduces a range of performance and stability improvements across indexing and database handling.


#### Highlights

* Fixed all known indexing and rollback on reorg issues
* Optimised database writing logic to reduce latency by dozens of milliseconds
* Reduced internal table size for managing reorg and rollback
* Improved Events Processed counter accuracy for verifying data consistency


#### Nice Additions

* Added subgraph migration cursor rule initialisation support
* Exposed chain readiness status through context.chains
* Expanded supported entity name length up to 63 characters

👉 See full [release notes](https://github.com/enviodev/hyperindex/releases)

👉 Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐


## The Uniswap Alert System That Uncovered a MEV Bot Making Millions

<img src="/blog-assets/dev-update-oct-25-1.png" alt="mev bot" width="100%"/>

While testing a Uniswap alert system, the team accidentally uncovered an active MEV bot that has been making millions every week on mainnet! 

The Telegram bot was meant to ping whenever a Uniswap v4 pool hit $1M TVL. The goal was simple: catch hot new tokens early. Instead, the alerts started firing on pools that barely held any TVL at all.

A closer look revealed flash liquidity spikes driven by an MEV bot executing sandwich attacks across v3 and v4 pools. With over 11 million transactions on mainnet, the on-chain data paints a wild picture of just how active these bots are. 

Read the original thread on [X](https://x.com/DenhamPreen/status/1976565715940307345) and join the [Telegram group](https://t.me/+n7KoVuOoOPAzNTJk) to see the alerts in action.


## Getting Started with Envio’s Scaffold ETH 2 Extension

<iframe width="560" height="315" src="https://www.youtube.com/embed/IXfGmc7iCI0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

You can now build [Scaffold ETH 2](https://scaffoldeth.io/extensions) apps that stream real-time data into your frontend without writing any code.

Our curated Envio extension adds automatic indexer generation to your project, making it simple to index all deployed contracts and query their data through a GraphQL API. Your frontend can subscribe to events as they happen, power live dashboards, and stay in sync with the chain with minimal setup.

Check out the [full tutorial](https://docs.envio.dev/docs/HyperIndex/scaffold-eth-2-extension-tutorial) in our documentation.


## ETHGlobal’s ETHOnline Hackathon

<iframe width="560" height="315" src="https://www.youtube.com/embed/24oDMNgZ-so" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

ETHGlobal’s [ETHOnline](https://ethglobal.com/events/ethonline2025/info/start) returned this month, bringing together builders from around the world for one of the largest virtual hackathons of the year.

Envio joined as a proud partner with [$5K in bounties](https://ethglobal.com/events/ethonline2025/prizes#envio) up for grabs. If you’re participating, check out our ETHOnline workshop for an introduction to HyperIndex and HyperSync, how to scaffold, deploy, and stream real-time data, plus past winning hacks, tips, and starter repos to help you ship faster. We look forward to seeing what everyone builds! 

P.S. Our bounties can double as a bonus on top of whatever you’re already building, since our tooling plugs right in if you’re deploying contracts or working with on-chain data. 😎


## Understanding Stablecoin Flows in Real-time

<img src="/blog-assets/dev-update-oct-25-2.gif" alt="stablecoin flows" width="100%"/>

Stablecoins move faster than ever, and understanding that flow in real-time opens up new layers of insight, from transaction velocity to how close we are to Visa or Mastercard throughput.

Co-Founder Jonjon Clark shared an early look at a live dashboard powered by Envio, which tracks stablecoin transfers across chains in real-time. It highlights what’s possible when real-time data meets transparent on-chain finance.

Check out the original post on [X](https://x.com/jonjonclark/status/1973431528228045193).


## Scaling Indexing for the Next Generation of Blockchains | Pragma New Delhi Workshop 

<iframe width="560" height="315" src="https://www.youtube.com/embed/sXqditdZix4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

Blockchain throughput has grown from 15 TPS in early networks to over 400K TPS on chains like Monad, Sonic, and MegaETH. As networks scale execution, Envio focuses on scaling indexing so developers can keep up with real-time data at that speed. 

Co-Founder, [Denham Preen](https://x.com/DenhamPreen), led a workshop at ETHGlobal Pragma New Delhi, sharing how Envio approaches modern blockchain indexing at scale and what it takes to stay in sync with high-performance chains.



## Envio Showcase

<img src="/blog-assets/dev-update-oct-25-3.gif" alt="showcase" width="100%"/>

We launched a new showcase page highlighting live demos built with HyperIndex and HyperSync. From real-time dashboards to on-chain visualizations, it’s a growing collection of projects built by the community and team to show what’s possible with Envio.

Explore the [Showcase](https://docs.envio.dev/showcase) in our documentation.


## Empowering Builders with Real-Time Indexing | Encode London 2025

<img src="/blog-assets/dev-update-oct-25-4.png" alt="encode london 2025" width="100%"/>

Envio joined [Encode London](https://luma.com/Encode-London-25) 2025 as a partner, offering $3K in bounties to support builders throughout the weekend hackathon.

The event brought together developers, founders, and innovators from across the ecosystem for a full weekend of hacking, talks, and late nights at the Hub.

Our Co-Founder, Jonjon Clark, hosted a [workshop](https://x.com/encodeclub/status/1976293549663715658) on real-time blockchain indexing, sharing how developers can move from indexing to streaming data in real-time using Envio’s suite of tools.

Well done to all the builders and a big shoutout to the Encode team and organizers for an incredible event!


## 🗓️ Current/Upcoming Conferences, Events & Hackathons

* [EthOnline Hackathon](https://ethglobal.com/events/ethonline2025/info/start): 10th → 31st October 2025
* [Edge City Patagonia](https://www.edgecity.live/patagonia): 18th October → 15th November, 2025 
* [Devconnect Buenos Aires](https://devconnect.org/): 17th → 22nd November 2025


## 🧑‍💻 Featured Developer

<img src="/blog-assets/dev-update-oct-25-5.png" alt="DOTM 2025" width="100%"/>

This month’s featured developer is Enguerrand, a builder with a strong focus on low level tech and decentralized solutions to real world problems.

As CTO at [LONG()](https://long.xyz), he’s building plug and play monetization rails for platforms. With a few API calls, LONG() lets teams integrate markets for crowdfunding, fair launches, and rewards, powered by transparent and open market mechanics that make Web3 monetization seamless.

Before LONG(), Enguerrand operated one of Ethereum’s earliest mining setups and led engineering at [Lum Network](https://lum.network), contributing to multiple Cosmos based stacks. He’s also worked with Ubisoft on community made multiplayer mods for Watch Dogs Legion and created mods for the Mafia series.

He recently contributed to our latest release by adding the ability to access chain readiness status through context.chains, helping improve transparency and reliability across indexing operations.

Always great seeing developers like Enguerrand push performance and developer experience even further with Envio.

***“What I really appreciated at Envio is 1. the DX is great and super easy to move to, 2. it works flawlessly, 3. its SUPER performant compared to competitors and 4. The team is great, super professional and easy to reach.” - Enguerrand CTO at LONG()***

Be sure to follow them on [X](https://x.com/enguerrandpp) and check out their work on [GitHub](https://github.com/Segfaultd) to stay up to date with what they’re building.


## 🎧️ Playlist of the Month

<img src="/blog-assets/dev-update-oct-25-6.png" alt="PLOTM Oct 2025" width="100%"/>


▶️ [Open Spotify](https://open.spotify.com/playlist/01eyMwoIMDEmcDjuFJsuhm?si=0319312d9a2d4499)


## 🚢 Ship With Us

Envio is a multi-chain EVM blockchain indexing solution for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
