---
title: Envio Developer Update August 2025
sidebar_label: Envio Developer Update August 2025
slug: /envio-developer-update-august-2025
---

<img src="/blog-assets/dev-update-august-2025.png" alt="Cover Image Envio Developer Community Update August 2025" width="100%"/>

<!--truncate-->

Welcome to our August Developer Update.

This month, we shipped preload optimization in v2.27.0, added contract-specific start blocks, and rolled out improved contributing guidelines with built-in Cursor rules. HyperSync also went global, we joined the Mobil3 hackathon in Mexico City, and we built a Telegram-to-Notion sync utility to make CRM management easier. Let’s dive in!


## ⚡ BIG Releases: v2.27.0


#### Preload Optimization

HyperIndex now preloads entities used by handlers via batched database queries, maintaining the original order of event processing. Paired with the Effect API for external calls, this gives big performance gains over other indexing solutions.

Set a single line in your config and make your handlers run multiple times faster without changing a single line of code:


```
preload_handlers: true
```


*⚠️ Note: Preload optimization runs your handlers twice. From **<code>envio@2.27</code>**, all new indexers include it by default.*


#### Contract-specific start block

HyperIndex now supports indexing with start blocks on a per-contract basis (previously, start blocks were only per-network), a highly requested feature contributed by one of our community members, [Rangel Stoilov](https://github.com/rori4).

**Example**: register NFT contracts from a factory but start processing Transfers only from block 30,000,000:


```
name: nft-indexer
description: NFT Factory
networks:
  - id: 1337
    start_block: 0
    contracts:
      - name: NftFactory
        address: 0x4675a6B115329294e0518A2B7cC12B70987895C4
        handler: src/EventHandlers.ts
        events:
          - event: SimpleNftCreated(string name, string symbol, uint256 maxSupply, address contractAddress)

      - name: Nft
        # No address field - we'll discover these addresses from SimpleNftCreated events
        start_block: 
        handler: src/EventHandlers.ts
        start_block: 30000000 # Overwrite the network start block
        events:
          - event: Transfer(address from, address to, uint256 tokenId)
```



####  👷‍♀️👷‍♂️ Contributing Improvements

We’ve updated our **<code>CONTRIBUTING.md</code>** with a detailed guide to navigating the HyperIndex codebase and examples of changes in action. We’ve also added `.cursor` rules to make developing new HyperIndex features easier.


#### Embrace Vibe-Coding

All new projects now include initial `.cursor` rules to help you build indexers with agent support. Got ideas? Send a PR with rule suggestions to improve the experience for everyone. 😉

👉 See full [release notes](https://github.com/enviodev/hyperindex/releases)

👉 Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐


## Introducing Shipper Logs

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/QqbH78CEid8" 
  frameborder="0" 
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>


Our new [YouTube series](https://www.youtube.com/@envio_indexer/playlists) covers release updates, new features, and optimizations. Episode 1 covers preload optimization in the v2.27.0 release and how it speeds up indexing.


## Introducing Chain Pulse

<img src="/blog-assets/chain-pulse.png" alt="chain pulse" width="100%"/>

A simple yet powerful tool to quickly check the pulse of multiple blockchains in real time.

With a single command, you can instantly see:

- 📊 Throughput
- 🔄 Transaction activity
- 👥 Address activity
- 📑 Logs & other key metrics

Chains already cooking include: BNB, MegaETH, Taraxa, Monad, Base, Unichain (Sepolia), and Polygon, with more on the way.

Just run:


```
npx chainpulse
```


👉 Check out the original post on [X](https://x.com/jonjonclark/status/1958497121293787146). 


## Envio Powers Zup Protocol 

<img src="/blog-assets/zup-integration.png" alt="zup" width="100%"/>


Easily search millions of pools across multiple DEXs and chains for the best yield per pair. Really cool tech.

Zup Protocol now connects you to 1M+ pools and 16 protocols across 5 blockchains.

Powered by Envio, you can compare 1,000+ combos in just 10 seconds.

👉 Check out Zup Protocol:[ app.zupprotocol.xyz](https://app.zupprotocol.xyz)


## HyperSync is now Globally Distributed

<img src="/blog-assets/k8gb.png" alt="k8gb" width="100%"/>

We’ve joined the official list of  [K8GB adopters](https://k8gb.io/ADOPTERS/). HyperSync is now served from multiple regions, giving builders faster and more reliable access wherever they are.


## 🇲🇽 Mobil3 Hackathon - Mexico City 

<img src="/blog-assets/mobil3-hackathon.png" alt="mobil3 hackathon" width="100%"/>


We had a great time at the [Mobil3](https://mobil3.xyz/) Hackathon in CDMX!

Envio put up a [$2,000 USD bounty](https://x.com/mobil3_xyz/status/1956083421018833267) for the best real-time payments or consumer fintech dashboards built using Envio.

Co-founder Denham Preen was on-site, leading a workshop on HyperIndex + HyperSync and offering 1:1 mentoring to teams throughout the hackathon.

Big thanks to the Mobil3 organizers, the Monaa Foundation, and all the builders who made it an incredible event!


## 💸 $943M Frozen 

<img src="/blog-assets/banned-list.png" alt="banned list" width="100%"/>

Say hello to the only list you don’t want to be on → [The Banned List](https://thebannedlist.xyz)

This dashboard tracks funds frozen across USDT and USDC on Ethereum mainnet. Right now, over $943M is locked in blacklisted wallets. USDT accounts for $833.78M and USDC makes up $109.73M.

Some of the top wallets hold tens of millions, with one blocked from moving $50.25M. New addresses continue to be blacklisted, including one with $1.37M that keeps trying to move funds out. It’s still not clear why these wallets have been targeted, but the dashboard makes it easy to explore and investigate what’s happening in real time.

👉 Check out the original post on [X](https://x.com/DenhamPreen/status/1956037853927846261). 


## 💧 Introducing Liquidator

<img src="/blog-assets/liquidator.png" alt="liquidator" width="100%"/>

Say hello to Liquidator, a new tool that lets you watch liquidation events unfold live in your terminal.

Powered by Envio, it can cut through more than 10 chains in seconds and surface hundreds of thousands of liquidation events, raw, unfiltered, and in real time.

Liquidator is currently live for Aave, with more protocols coming soon. Which one should we add next? 👀

👉 See the original post on [X](https://x.com/jonjonclark/status/1950609313719783846).


## 📦 Telegram to Notion Sync CRM Tool

Managing endless Telegram groups is a hassle, so we built an open-source CLI tool that syncs your Telegram chats into a Notion database.

It finds all chats with a specific substring, adds new ones automatically, and lets you manage them with Kanban, labels, and reminders.

Credits to [Kenau Vith](https://x.com/KenauVith32)

👉 Check it out on [GitHub](https://github.com/enviodev/telegram-to-notiondb)


## 🗓️ Upcoming Events 

* [Encode London](https://luma.com/Encode-London-25): 24th → 26th October 2025
* [Devconnect Buenos Aires](https://devconnect.org/): 17th → 22nd November 2025


## 🧑‍💻 Featured Developer

<img src="/blog-assets/aug-2025-DOTM.png" alt="Aug 2025 DOTM" width="100%"/>

This month’s featured developer is Mikko Ohtamaa, CEO and Co-Founder of [Trading Strategy](https://tradingstrategy.ai/), a Web3 algorithmic trading protocol. Over the past decade, Mikko has served as CTO at leading blockchain companies like LocalBitcoins (one of the first Bitcoin exchanges) and TokenMarket (one of the first ICO platforms), where he helped build infrastructure for more than $1B in digital assets. He’s also an active voice in digital rights and open-source communities.

Thanks for being an awesome member of our community, Mikko! 


    ***“We use Envio because it's the first indexer that works. Envio is easy to integrate with modern data research and trading pipelines based in Python. This allows us to integrate more chains, faster, go deeper in data, and finally have a developer experience blockchain programmers have craved for.”*** - *Mikko Ohtamaa, CEO & Co-Founder at Trading Strategy*

Be sure to follow them on [X](https://x.com/moo9000) and check out their work on [GitHub](https://github.com/miohtama/) to stay up to date with what they are building.


## 🎧️ Playlist of the Month

<img src="/blog-assets/aug-playlist-2025.png" alt="Aug 2025 Playlist" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/3n3qReuChMo6SEgl0Bso3Z?si=23e45edbfde34be1)


## 🚢 Ship With Us

Envio is a multi-chain EVM blockchain indexing solution for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)

