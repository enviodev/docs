---
title: Envio Developer Update October 2024
sidebar_label: Envio Developer Update October 2024
slug: /envio-developer-update-october-2024
description: "What Envio shipped in October 2024: new releases, platform enhancements, and community integrations across the blockchain indexing stack."
image: /blog-assets/envio-developer-community-oct-2024.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/envio-developer-community-oct-2024.png" alt="Cover Image Envio Developer Community Update October 2024" width="100%"/>

<!--truncate-->

Welcome to our October 2024 developer update. This month, we're spotlighting our integrations with MIRA Exchange and Gateway.fm, along with our recent success at the Encode hackathon, where the ModuleScan project stood out. Let's dive in!

## HyperIndex Version 2.6.0 is now available

We are pleased to announce that the current release is **v.2.6.1**!

**Improvements:**

- feat: prompt for start block on RPC URL networks in contract import
- Improve contract import to stop asking for API keys
- Improve crash error
- Add mainnet selection in Fuel contract import
- Improve Batch Set error

For more information, you can view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) in the Envio github.

To stay updated with our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support is greatly appreciated!

## Dynamic Contract Pre-registration

You can now add the **preRegisterDynamicContracts** flag to your event configuration. For events with this flag enabled, the indexer will perform an end-to-end run specifically for these events, executing all relevant **contractRegister** functions to collect dynamic contract addresses. The indexer will then restart with these addresses from the start block configured for the network, rather than from the block where each contract is registered. This approach drastically reduces indexing time for standard factory contract setups, minimizing the need for multiple small block range queries in favor of larger, grouped queries. See the example below.

```typescript
PoolFactory.CreatePool.contractRegister(
  ({ event, context }) => {
    context.addPool(event.params.pool);
    },
    { preRegisterDynamicContracts: true },
);
```

> **Update:** The `preRegisterDynamicContracts` option was deprecated in version `2.19.0` because default contract registration became significantly faster. You no longer need to enable pre-registration explicitly.

## Envio Powers Developers on Fuel Ignition

<img src="/blog-assets/envio-developer-community-oct-2024-2.png" alt="Fuel Envio Indexer Partnership" width="100%"/>

Envio is proud to support applications and developers with the fastest access to real-time and historical data on the [Fuel](https://fuel.network/) Network.

Learn which [Fuel applications](https://x.com/envio_indexer/status/1849103562602655890) we are supporting to date.

## Exciting DeFi Integration with MIRA

<img src="/blog-assets/envio-developer-community-oct-2024-1.png" alt="Mira Exchange on Fuel Envio Partnership" width="100%"/>

Envio's efficient indexing solution has been integrated with [MIRA](https://mira.ly/), an open-source DeFi platform designed to match traders and liquidity providers using the most efficient AMM on the Fuel Network.

This integration enhances the capabilities of MIRA by providing faster and more reliable access to onchain data, ensuring a seamless experience for all users.

## Envio Powers GatewayFM With Efficient Indexing

<img src="/blog-assets/envio-developer-community-oct-2024-3.png" alt="Envio supports RAAS Gateway with Indexing Partnership" width="100%"/>

Envio's modular data indexing solution powers [Gateway](http://gateway.fm/), a pioneering Web3 infrastructure provider. With Gateway, you can deploy zkEVM app rollups in minutes, code-free! With Envio's native support for indexing any EVM-compatible chain, this makes a fruitful partnership.

## Can We Really Predict the Future?

<img src="/blog-assets/case-study-limitless.png" alt="Cover Image Limitless Prediction Markets Case Study" width="100%"/>

As prediction markets reshape media and decision-making, discover how they work and how Envio enhances [Limitless Exchange](https://limitless.exchange/) with real-time data indexing and insights in our latest case study.

Read the [full case study](https://docs.envio.dev/blog/case-study-limitless-prediction-market).

## Enhancing Developer Experience in L2s

<img src="/blog-assets/case-study-bridgg-op-superchain.png" alt="Cover Image Bridgg OP Superchain Case Study" width="100%"/>

Layer 2s have created a multichain ecosystem for Ethereum's scalability, but liquidity fragmentation and poor UX continue to be challenges. Explore how [Brid.gg](http://brid.gg/) is working to transform user interactions with the [OP Superchain](https://www.superchain.eco/), enhancing accessibility in our latest case study.

Read the [full case study](https://docs.envio.dev/blog/case-study-bridgg-op-superchain).

## Encode Hackathon Winner: ModuleScan

<img src="/blog-assets/envio-developer-community-oct-2024-4.png" alt="Encode Club Hackathon Winner Module Scan by Timur" width="100%"/>

Congratulations to [ModuleScan](https://modulescan-ui.vercel.app/) for winning multiple prizes at the Encode hackathon! This innovative indexer tracks historical smart account module activity, showcasing:

- Recently deployed accounts
- Installed and uninstalled modules
- Historical activity for modules and accounts

Using both [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) and [HyperSync](https://docs.envio.dev/docs/HyperSync/overview), ModuleScan delivers some seriously powerful insights.

Explore ModuleScan:

- [Codebase](https://github.com/Destiner/modulescan)
- [YouTube Demo](https://www.youtube.com/watch?v=Jp2jQOioSmk&feature=youtu.be)

We're proud to award ModuleScan:

- Best Use of HyperIndex: $1,500
- Most Creative Application of Envio's Features: $1,000

Kudos to [Timur Badretdinov](https://x.com/DestinerX)!

## Highlights from Zebu Live & Encode London

<img src="/blog-assets/envio-developer-community-oct-2024-5.png" alt="Zebu Live JonJon CoFounder Speaker Photo" width="100%"/>

We had a fantastic time at [Zebu Live](https://www.zebulive.xyz/) and the [Encode London](https://www.encode.club/encodelondon-24/#Prizes) Hackathon & Conference! At both events, we hosted data indexing workshops where blockchain developers could explore faster, smarter ways to access their onchain data, demonstrating how alternative indexers like Envio can improve their data retrieval.

Additionally, we sponsored $4,500 in bounties at the Encode London Conference, encouraging developers to engage with our platform and showcase their skills. A massive thank you to the organizers and to everyone who attended our workshops and participated in our bounties.

For more upcoming events and where to catch us - be sure to check out our upcoming events below.

## Upcoming Events

- [DevCon](https://devcon.org/en/): 12-17 November 2024
- [EthGlobal Bangkok](https://ethglobal.com/events/bangkok): 15-17 November 2024
- [Rootstock Educate: Why Is Blockchain Data So Slow? How to Get It Fast on Rootstock](https://lu.ma/e0514_3111?tk=wnw72A&utm_source=yve8mz) - 10 December 2024

## Featured Developer

<img src="/blog-assets/envio-developer-community-oct-2024-6.png" alt="Developer of the Month" width="100%"/>

This month's featured developer and community member of the month is [Ankush Jha](https://www.noveleader.xyz/), a dedicated developer and crypto native with three years in the space. Known for his sharp research skills and innovative approach, Ankush has made significant contributions to our community as a developer and researcher.

***"Envio is an amazing product. What I like the most about them is their blazing-fast indexing speed. I've never had an experience like this" – Ankush Jha***

Ankush developed a GMX V2 multichain indexer spanning Arbitrum and Avalanche, where GMX data can be queried via a unified API. The code repo is available on [GitHub](https://github.com/Noveleader/gmx-v2-subgraph-envio).

Be sure to follow Ankush on [X](https://x.com/0xnoveleader) and check out his work on [GitHub](https://github.com/noveleader) to stay up-to-date with their latest projects and contributions.

For a full list of deployed indexers visit our [explorer](https://envio.dev/explorer).

## Playlist of the Month

[Open Spotify](https://open.spotify.com/playlist/50pryGy4bfJfqAVKZAojNh?si=19a115a6742e4292)

<img src="/blog-assets/envio-developer-community-oct-2024-7.png" alt="Developer of the Month" width="100%"/>

## Envio Freelancer Network

Need an indexer but don't have the bandwidth? Whether you're looking to find top-notch freelancers or you're a freelancer seeking new opportunities, we've got you covered. Our thriving Freelancer Network connects skilled contractors with Web3 protocols to service their data needs.

Simply fill out the [form](https://noteforms.com/forms/envio-freelancer-network-u9zqbv) to join our freelancer network.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
