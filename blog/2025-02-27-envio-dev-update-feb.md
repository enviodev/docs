---
title: Envio Developer Update February 2025
sidebar_label: Envio Developer Update February 2025
slug: /envio-developer-update-february-2025
tags: ["product-updates"]
description: "What Envio shipped in February 2025: new HyperSync network support, product improvements, community highlights, and upcoming builder initiatives."
image: /blog-assets/envio-dev-update-feb-2025.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/envio-dev-update-feb-2025.png" alt="Cover Image Envio Developer Community Update February 2025" width="100%"/>

<!--truncate-->

Welcome to the Envio monthly developer update. Here is what shipped in February 2025.


## HyperSync Milestone

<img src="/blog-assets/envio-dev-update-feb-2025-1.png" alt="HyperSync Milestone" width="100%"/>


Over 115 billion HyperSync requests served across multiple networks. It's becoming the go-to choice for faster data retrieval over standard RPC.

Huge thanks to all the devs building with Envio.


## HyperIndex Version 2.13.0 is now available

<img src="/blog-assets/envio-dev-update-feb-2025-2.png" alt="Version 2.13.0" width="100%"/>


A major milestone for HyperIndex: the first pull request from an external contributor has been merged.

Thanks to this contribution, you can now customize the database schema name using the `ENVIO_PG_PUBLIC_SCHEMA` environment variable, adding more flexibility to your database setup.

A huge shoutout to [Sergey Potekhin](https://x.com/potekhin_sergey) from [Pimlico](https://www.pimlico.io/) and everyone contributing to making Envio even better!

For more information, you can view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we're building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)!


## V4: Get Real-time Analytics for Uniswap V4 Swaps Across Multiple Networks 

<img src="/blog-assets/envio-dev-update-feb-2025-3.png" alt="V4" width="100%"/>

<img src="/blog-assets/envio-dev-update-feb-2025-4.png" alt="V4 Hooks" width="100%"/>


Check out [V4](https://uniswap-v4-analytics.vercel.app/) - powered by HyperIndex - a hub for Uniswap data and hooks that tracks top swaps, pools, and trends in real-time, all displayed in a unified dashboard.

In collaboration with [Silvio Busonero](https://x.com/SilvioBusonero) from [Boost](https://www.boost.xyz/), we've also made onchain analytics for hooks more accessible than ever.


## Oracle Wars: Visualize Onchain Oracle Performance

<img src="/blog-assets/envio-dev-update-feb-2025-5.png" alt="Oracle Wars" width="100%"/>


Introducing [Oracle Wars](https://www.oraclewars.xyz/) - powered by HyperIndex - a live feed showcasing onchain oracle data from multiple providers, including ETH/USD feeds from [RedStone](https://www.redstone.finance/) and [Chainlink](https://chain.link/). This tool helps developers gain insights into how oracles operate in real-world scenarios, especially during periods of market volatility.

By visualizing real-time updates, Oracle Wars empowers developers to make more informed design decisions, enhancing the safety and efficiency of DeFi protocols. Built using Envio for fast data indexing, we plan to expand the platform with more feeds and networks in the future.


## Exciting DeFi Integration With Haha Wallet

<img src="/blog-assets/envio-dev-update-feb-2025-6.png" alt="Haha Wallet" width="100%"/>


Envio's efficient indexing solution has been integrated with [Haha Wallet](https://www.haha.me/) - an innovative smart wallet delivering the best user experience on Monad.

In collaboration with [Kuru](https://www.kuru.io/markets), this integration achieves impressive indexing speeds of 10k TPS, significantly enhancing Haha Wallet's capabilities and ensuring a seamless experience for all users.

See it in action on [X](https://x.com/0xtrojan_/status/1891503860713173456).


## EthDenver: Encode Club Modular DeFi Hackathon & Research Day

<img src="/blog-assets/envio-dev-update-feb-2025-7.png" alt="Encode Hack" width="100%"/>


This month, our team attended [EthDenver](https://www.ethdenver.com/), where we hosted a developer workshop led by our Co-founder [Jonjon](https://x.com/jonjonclark), who built a Uniswap V4 dashboard from scratch in under 15 minutes. We also offered several bounties with a total prize pool of $5k for Encode Club's Modular DeFi Hackathon & Research Day.

A huge thank you to the [Encode](https://www.encode.club/) team for hosting us and organizing such a successful event and hackathon, as well as to all the participants and winners!


## EthDenver: Monad Evm/Accathon

<img src="/blog-assets/envio-dev-update-feb-2025-8.png" alt="Monad Hack" width="100%"/>


This month, we hosted the Envio Bounty Challenge during the first-ever Monad hackathon, the EVM/Accathon, inviting participants to create live analytics dashboards to track Monad's onchain activity using Envio's HyperIndex & HyperSync. The challenge featured a prize of $2,000 USD!

A big thank you to the Monad team for hosting us and coordinating such a fantastic hackathon. We also appreciate all the participants for their innovative submissions. Stay tuned for more details regarding the winner!


## EVM vs AltVM: How the Data Differs?

This month, Co-Founder Jason co-hosted a livestream with Fuel, Pangea, and Indexing Co., discussing the evolution of blockchain data indexing from traditional EVM approaches to modern AltVM solutions. The discussion emphasized the need for robust infrastructure and unique indexing strategies.

Check out the recorded version of the discussion below.

[![Video Thumbnail](https://img.youtube.com/vi/e-gWCDearng/0.jpg)](https://www.youtube.com/watch?v=e-gWCDearng)


## Envio Supports Developers Building on Monad

<img src="/blog-assets/envio-dev-update-feb-2025-9.png" alt="Monad Support" width="100%"/>


Monad's testnet is live and a high-speed chain deserves a high-performance solution.

Envio supports devs building on [Monad](https://www.monad.xyz/) with efficient access to real-time & historical data. With [HyperSync](https://docs.envio.dev/docs/HyperSync/overview), a low-level API, devs can sync large datasets in minutes - bypassing the usual hours or days via RPC.

Learn more in our [thread](https://x.com/envio_indexer/status/1892230056719573193).



## Envio's Open Indexing Framework Supports Devs Building on Berachain

<img src="/blog-assets/envio-dev-update-feb-2025-10.png" alt="Berachain Support" width="100%"/>


Envio's open indexing framework supports devs building on Berachain Mainnet with efficient access to real-time & historical data. Developers can utilize Envio's HyperSync to sync millions of events 1000x faster than RPC. Easy, fast, and fully customizable!


View all current HyperSync-supported networks in our [docs](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


## New Feature Alert: Search Bar Now Live

<img src="/blog-assets/envio-dev-update-feb-2025-11.png" alt="Search Bar" width="100%"/>


The much-anticipated search bar is here, allowing you to easily navigate the 100+ indexers deployed on Envio. Stay tuned for upcoming features, and don't hesitate to share your feedback or suggestions in our Discord!

Test it out yourself in our [Explorer](https://envio.dev/explorer).


## Upcoming Events

* EthGlobal [Pragma Cannes](https://ethglobal.com/events/pragma-cannes): 3rd June 2025
* [DappCon](https://dappcon.io/): 16th → 18th June 2025
* WAGMI Sponsors at [EthCC](https://ethcc.io/): 30th June → 3rd July 2025

## Featured Developer

<img src="/blog-assets/envio-dev-update-feb-2025-12.png" alt="Search Bar" width="100%"/>


This month's featured developer and community member is [Sergey Potekhin](https://www.linkedin.com/in/sergey-potekhin/)!

Sergey is currently building [Pimlico](https://www.pimlico.io/) and is actively engaged with developments in the space, focusing on native Account Abstraction (AA), resource locks, and cross-chain intents. In his spare time, he explores zero-knowledge (ZK) mathematics and works on various related projects. With over 8 years of experience as a blockchain engineer, Sergey is a true tech enthusiast who dedicates significant time to attending meetups and contributing to open-source initiatives. We appreciate his contributions as our first external contributor and his passion for helping us make Envio even better!

Follow Sergey on [GitHub](https://github.com/pavlovdog/) for updates on his latest projects.


## Playlist of the Month

<img src="/blog-assets/envio-dev-update-feb-2025-13.png" alt="Feb Playlist 2025" width="100%"/>


[Open Spotify](https://open.spotify.com/playlist/0yOOvvkHFIDsi2VRHDIrH0?si=7ad749d44b464830)


## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
