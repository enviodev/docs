---
title: Envio Developer Update September 2025
sidebar_label: Envio Developer Update September 2025
slug: /envio-developer-update-september-2025
description: "Catch the highlights from Envio’s September 2025 developer update including product improvements, new network integrations, and community builder milestones."
---

<img src="/blog-assets/sep-update-2025-0.png" alt="Cover Image Envio Developer Community Update September 2025" width="100%"/>

<!--truncate-->

Welcome to our September Developer Update.

This month, we shipped major new features in v2.28.0 and v2.29.0, introduced Block Handlers and the new `_meta` query, and rolled out significant performance improvements that make indexing even faster and more efficient. We were on the ground at Pragma, ETHGlobal New Delhi, and Sonic Summit in Singapore, explored how AI is shaping blockchain data, and showcased Envio’s indexing support for MegaETH along with how we power tools like Liqo, a liquidations leaderboard.

We also kicked off new hackathons with MetaMask and Monad and confirmed our partnership for Encode London next month. Let’s dive in! 


## ⚡ Big Releases: v2.28.0 → v2.29.0
### V2.28.0

For a visual walkthrough, check out our Shipper Log v2.28.0 on [YouTube](https://www.youtube.com/watch?v=qnYX59jWx_k).


#### Official _meta query

HyperIndex now exposes an official `_meta` query that returns indexing metadata per chain, making it simple to monitor progress and track sync status.


#### 2× faster and cheaper historical sync

Block range selection for log queries has been improved, cutting the number of required requests for some RPC providers in half, making historical sync up to 2x faster. HyperSync responses are now smaller, faster, and simpler, reducing ingress costs while improving performance.


#### Big performance boost for large factories

Indexers handling large numbers of addresses now sync significantly faster. In testing, an indexer with over 2 million addresses synced in about two days instead of four.


#### Subgraph migration Cursor rules cheatsheet 

A new Cursor rule example in our repo helps you quickly migrate existing Subgraphs to HyperIndex.


#### ⚠️Potential breaking change

We’ve refactored internal tables to focus on a single public entry point: `_meta`. Internal tables such as `chain_metadata`, `event_sync_state`, `persisted_state`, <code>end_<strong>of</strong>_block_range_scanned_data</code>, and **<code>dynamic_contract_registry</code>** are now hidden from Hasura, and their internal representations have changed.

If this impacts your setup, reach out, and we’ll help you migrate smoothly.

<img src="/blog-assets/sep-update-2025-1.png" alt="query" width="100%"/>

### V2.29.0

View Shipper Log on [YouTube](https://www.youtube.com/watch?v=q2CNXIxtVjQ)


#### 🆕Block Handlers

You can now run logic on every block or at defined intervals, unlocking new use cases like aggregations, time-series data, and bulk updates using raw SQL.

Example:


```
import { onBlock } from "generated";

onBlock(
  {
    name: "MyBlockHandler",
    chain: 1,
    interval: 10,
    startBlock: 10_000_000,
  },
  async ({ block, context }) => {
    context.log.info(`Processing block ${block.number}`);
  }
);
```


Read our [docs](https://docs.envio.dev/docs/HyperIndex/block-handlers) to learn more about block handlers and the powerful use cases they enable, like:



* Time intervals
* Preset handlers
* Multichain mode
* Different intervals for historical vs. real-time sync

Be sure to check out our [Example Indexer](https://github.com/enviodev/all-contracts-indexer/blob/main/src/EventHandlers.ts) to see Block Handlers combined with Preload Optimization, Effect API queries, and Traces indexing to track all contracts deployed on Mainnet.

👉 See full [release notes](https://github.com/enviodev/hyperindex/releases)

👉 Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐


## Liqo Brings Real-Time Liquidation Insights Across Major DeFi Protocols

<img src="/blog-assets/sep-update-2025-2.png" alt="liqo" width="100%"/>

Track major real-time liquidations in style with [Liqo](https://www.liqo.xyz/), a powerful liquidation leaderboard tool powered by Envio. The new leaderboard gives you a clear view of the most active liquidators across top protocols like [Aave](https://aave.com/), [Morpho](https://morpho.org/), and [Euler](https://euler.finance/), with support for [Twyne](https://twyne.xyz/) coming soon.

It makes exploring liquidation activity across multiple chains and protocols easier than ever, all from one place.

Shoutout to [Saurav](https://x.com/the_truthseekah) for their contributions to the sleek UI upgrade.

Check out the original post on [X](https://x.com/jonjonclark/status/1970164446480695754).


## MetaMask Smart Accounts Hackathon with Monad and Envio

<img src="/blog-assets/sep-update-2025-3.png" alt="metamask hackathon" width="100%"/>

The MetaMask Smart Accounts Hackathon, in collaboration with Monad and Envio, is now live and will run from September 19 to October 20. Builders are invited to create next-level applications on Monad with a focus on account abstraction and user experience.

Envio is putting up $5,000 for builders:

• $2,000 for Best Use of Envio

• $3,000 in bonuses

In total, $15,000 in prizes are up for grabs.

More details on [Hackquest](https://www.hackquest.io/hackathons/MetaMask-Smart-Accounts-x-Monad-Dev-Cook-Off).

Missed our kickoff call and want to learn more? Check out the broadcast on [X](https://x.com/i/broadcasts/1OwxWemMopDGQ).


## Envio at Pragma and ETHGlobal New Delhi

<img src="/blog-assets/sep-update-2025-4.png" alt="ethglobal new dehli" width="100%"/>

The team was in New Delhi for Pragma and ETHGlobal, spending the week with builders, founders, and partners across the ecosystem. Every dapp relies on indexing, but most existing solutions are slow, siloed, and unreliable.

We shared how HyperIndex and HyperSync change that, bringing high performance, multi-chain infrastructure that scales with the modular ecosystem. The result is faster dapps, richer analytics, and a reliable data backbone developers can build on with confidence.

Big thanks to ETHGlobal, the organisers, partners, and everyone who stopped by to chat with us in New Delhi.


## Envio Supports MegaETH Builders with Lightning-Fast On-Chain Data Access

<img src="/blog-assets/sep-update-2025-5.png" alt="megaeth support" width="100%"/>

100k+ TPS, 10+ ggas p/s & &lt;10ms blocks? Envio is built for it. Our indexing framework supports developers building on MegaETH with efficient access to both real-time and historical data.

With Envio, you can sync millions of events up to 2000x faster than RPC, making data access easy, fast, and fully customizable even at massive scale. Our performance and mainnet readiness make Envio the ideal choice for builders looking to ship real-time and performant applications on MegaETH.


## The State of AI in Blockchain Data: Neon x Envio

<img src="/blog-assets/sep-update-2025-6.png" alt="neonevm ama" width="100%"/>

Blockchain generates endless streams of data, and powerful indexers like Envio make it usable. But what happens when AI steps into the picture?

We joined Neon and Subsquid for a live panel to dig into how AI is reshaping the way data is accessed, organized, and understood in Web3. The conversation explored how intelligence layers can boost indexing workflows, change how developers build with on-chain data, and what the future looks like as AI becomes part of the core data stack.

Missed it live? Catch the full recording of the broadcast on [X](https://x.com/i/broadcasts/1BRJjgOnEMjxw).


## Join Envio at Encode London This October

<img src="/blog-assets/sep-update-2025-7.png" alt="encode london 2025" width="100%"/>

We’re excited to be partners at the Encode London Hackathon and Conference, taking place from 24–26 October at the [Encode Hub](https://hub.encode.club/) in Shoreditch, London. This three-day event brings together builders, researchers, and industry leaders for hands-on hacking, talks, and workshops focused on AI and Web3. Our team will be on the ground all weekend supporting builders, so keep an eye out for us throughout the event.

Plus, we’ll be hosting a speaking slot and putting up a couple of bounties with prizes, more details coming soon!

See full event details and get tickets in [Luma](https://luma.com/Encode-London-25).



## Developer Workshop Series: Exploring Aave with Envio

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/pVk7-0T_A_g?list=PLV4hxy8ztIJLP4MSpYUXvzoJWY9wMe2L6" 
  frameborder="0" 
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>

We’ve kicked off a 16-part developer workshop series, starting with a session focused on exploring Aave data using Envio. The series is designed to help developers get hands-on with real on-chain data, showing how to query, index, and build with Aave using Envio.

More workshops are on the way, so be sure to subscribe this YouTube [channel](https://www.youtube.com/@decryptedbytes/playlists)

to follow along and catch every session.


## 🗓️ Upcoming Events 
* [Encode London](https://luma.com/Encode-London-25): 24th → 26th October 2025
* [Devconnect Buenos Aires](https://devconnect.org/): 17th → 22nd November 2025


## 🧑‍💻 Featured Developer

<img src="/blog-assets/sep-update-2025-8.png" alt="DOTM Sep 2025" width="100%"/>

This month’s featured developer is [Ryan Holanda](https://www.linkedin.com/in/ryan-holanda/), Co-founder and CTO of [Zup Protocol](https://zupprotocol.xyz/). A software engineer since the age of 16, Ryan brings advanced expertise across front-end, mobile, blockchain, and design. Driven by a deep passion for DeFi and the Web3 ecosystem, he has dedicated his career to building innovative solutions that empower users and promote financial freedom.

At just 20 years old, Ryan has already won multiple hackathons, contributed to several open source projects, and founded Zup Protocol. He is known for his quick problem-solving skills across a wide range of domains, from Figma design to complex blockchain engineering.

***“Envio is by far the best indexer on the market today. Their innovative approach to indexing blockchain data helped Zup Protocol reduce the sync time for historical liquidity pools data from 3 months with Subgraphs to just 2 days using their hosted service. The Envio team is amazing and always ready to help whenever you need support. If you like great products and cool teams, you should definitely give it a try (pro tip: the migration from Subgraphs is veeeery easy ).”*** - *Ryan Holanda, Co-Founder & CTO of Zup Protocol*

Be sure to follow them on [X](https://x.com/moo9000) and check out their work on [GitHub](https://github.com/RyanHolanda) to stay up to date with what they are building.


## 🎧️ Playlist of the Month

<img src="/blog-assets/sep-update-2025-9.png" alt="PLOTM Sep 2025" width="100%"/>

▶️[ Open Spotify](https://open.spotify.com/playlist/2lOYVNjlopciZGOUGdPED1?si=34ee9820a0db4494)


## 🚢 Ship With Us

Envio is a multi-chain EVM blockchain indexing solution for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
