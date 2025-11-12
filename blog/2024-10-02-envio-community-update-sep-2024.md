---
title: Envio Developer Update September 2024
sidebar_label: Envio Developer Update September 2024
slug: /envio-developer-update-september-2024
description: "Explore Envio’s September 2024 developer update covering version 2.3.0 release with Wildcard Indexing and IPFS integration, major event appearances at TOKEN2049 and EthCapeTown, and new HyperSync network support."
---

<img src="/blog-assets/envio-developer-community-sep-2024.png" alt="Cover Image Envio Developer Community Update September 2024" width="100%"/>

<!--truncate-->

Welcome to our September 2024 developer update!

We’re back with another exciting update on the latest and greatest advancements from the Envio team. In this update, we’ll explore our recent release, V2.3.0, highlighting innovative features like [Wildcard Indexing](https://docs.envio.dev/docs/HyperIndex/wildcard-indexing), [IPFS](https://docs.envio.dev/docs/HyperIndex/ipfs) integration, and more. We’ll also recap key updates from September, including our time at [Token2049](https://www.asia.token2049.com/) and [EthCapeTown](https://www.ethcapetown.com/), upcoming events, partnerships, and other important developments.

## 🚀 Version 2.3.0 is now available🚀

We are excited to announce that the current release is **v.2.4.1**!

**What's changed?**

- **Wildcard Indexing**: Index whole chains by event signature without specifying exact contract addresses.
- **Event Filtering**: Filter events by indexed parameters. Simplify your handler's logic or get new indexing possibilities when joined with the Wildcard Indexing feature.
- **Fuel Merge**: The [Fuel](https://fuel.network/) ecosystem indexer has been integrated into the main repository code. This huge refactoring comes with a big list of benefits and opportunities, click [here](https://x.com/envio_indexer/status/1835977029641982080).

*⚡ Both Wildcard Indexing and Event Filters are currently only supported with HyperSync. We are working on adding support for RPC mode in the following versions.*

For more information and to view the full list of current and past release notes, click [here](https://github.com/enviodev/hyperindex/releases).

To stay updated with our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support is greatly appreciated! ⭐

## Wildcard Indexing

Wildcard indexing is a powerful feature that enables you to index all events matching a specified event signature without the need to specify the contract address from which the event was emitted. This capability is particularly beneficial in scenarios where contracts are deployed through factories that do not emit events upon contract creation. Additionally, it facilitates the indexing of events from all contracts implementing a standard, such as ERC20, streamlining the process and enhancing efficiency.

Learn more [here](https://docs.envio.dev/docs/HyperIndex/wildcard-indexing).

## IPFS Guide

Check out our new guide on IPFS, a decentralized network designed for storing and sharing data. This guide walks you through the process of fetching IPFS data into your indexer, providing you with the tools to enhance your applications and leverage the power of decentralized storage.

Learn more [here](https://docs.envio.dev/docs/HyperIndex/ipfs).

## EthGlobal Online Hackathon Winners

<img src="/blog-assets/envio-developer-community-sep-2024-2.png" alt="Cover Image ETHGlobal Online Hackathon Winners" width="100%"/>

We’re excited to share the results of our EthGlobal [EthOnline](https://ethglobal.com/events/ethonline2024/prizes#envio) Hackathon! With 40 submissions, the competition was fierce, showcasing incredible talent and creativity. A huge thank you to the EthGlobal team and all the hackers who participated, making this hackathon a remarkable success!

To learn more about the winning projects, click [here](https://x.com/envio_indexer/status/1836013244164514289).

## Blazing-fast data retrieval now supported on Zircuit, Bartio, Morph, KakarotEVM, and more!

Envio’s modular stack supports developers and data analysts building on [Zircuit](https://www.zircuit.com/)—an EVM-compatible ZK rollup with AI-enabled security at the sequencer level! 

With [Hypersync](https://docs.envio.dev/docs/HyperSync/overview) integrated, applications and data analysts can now fetch their data using standard RPC, or leverage HyperSync as more performant data source for up to a 1000x speed advantage. Apps can now develop, test, and innovate faster than before and deliver cutting-edge performance to their end users. 

<img src="/blog-assets/envio-developer-community-sep-2024-3.png" alt="Cover Image Envio and Zircuit Partnership Announcement" width="100%"/>


Other new networks that were added to HyperSync this month include:
- Berachain Bartio
- Morph Testnet
- Citrea's New Testnet
- Kakarot-EVM Tesnet (Sepolia)
- Merlin Mainnet
- Lukso Testnet

Hypersync supported networks can be viewed [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


## Our Time at Token2049 and EthCapeTown

We had an incredible experience at both Token2049 and EthCapeTown this month! At Token2049, we hosted a "[Run & Chat](https://lu.ma/5v9wgs1n)" side event that allowed us to connect with participants in a relaxed setting while soaking up Singapore's beautiful scenery. At EthCapeTown, our "[Builders’ Happy Hour](https://lu.ma/ta03bb8m)" provided a great opportunity to meet and network with talented builders in the space all before the main event kicked off.

A big thank you to all the attendees, sponsors, and event organizers for making these events possible. For more upcoming events and where to catch us - be sure to check out our upcoming events below.

## Upcoming Events 🗓️

- [Golden Gate Promenade Run with Envio](https://lu.ma/1v6mzzx0) - October 16
- [EthGlobal, EthSanFransisco](https://ethglobal.com/events/sanfrancisco2024) - October 18-20
- [Encode London](https://www.encode.club/encodelondon-24) - October 25-27

## Workshops & Developer Tutorials 🧑‍💻

- [How to Index Data on Fuel In Less Than 5 Minutes](https://www.youtube.com/watch?si=bBKbCvBPYiQzOfKs&v=IEgmHAW0S_A&feature=youtu.be)

<img src="/blog-assets/envio-developer-community-sep-2024-4.png" alt="Cover Image Encode Club Indexing On Fuel" width="100%"/>

- [How to Index Dat on Citrea in < 5mins](https://www.youtube.com/watch?v=rPPxS6ORaEc)

<img src="/blog-assets/envio-developer-community-sep-2024-5.png" alt="Cover Image Indexing On Citrea" width="100%"/>

For more written tutorials visit our [docs](https://docs.envio.dev/docs/tutorial-op-bridge-deposits).

For more video tutorials visit our [YouTube](https://www.youtube.com/@envio_indexer)

## Featured Developer 🧑‍💻

<img src="/blog-assets/envio-developer-community-sep-2024-6.png" alt="Dev of the Month September" width="100%"/>

We're excited to announce our featured developer and community member of the month, Jordan Lesich, a highly experienced builder in the DAO ecosystem. With nearly five years of expertise working on DAO platforms like [DAOhaus](https://daohaus.club/), [Nouns.build](https://nouns.build/), and [DAO Masons](https://www.daomasons.com/), Jord brings a full-stack skill set to the table, engaging in every stage of dApp development—from design and contracts to frontend, backend, and indexers. His dedication to refining the DAO landscape makes him a standout contributor to our community.

***"I have been working on DAO platforms and peripheral tooling for DAOs for nearly five years. I enjoy working in every stage of dApp development (design, contracts, frontend, backend, indexers). Envio makes that process much easier."*** – Jordan Lesich, Co-Founder at DAO Masons

Jord is currently working on [Grant Ships](https://grantships.fun/), an onchain, competitive grants platform, and Chews Protocol, a modular framework for complex voting schemes. We're thrilled to see how these projects evolve and the continued impact they will have on the DAO space, well done Jords!

Explore Jord’s indexers:

- [Grant Ships](https://envio.dev/app/daomasons/grantships-envio)
- [GS Voting](https://envio.dev/app/daomasons/gs-voting-envio)

For a full list of deployed indexers visit our [explorer](https://envio.dev/explorer).

Be sure to follow Jord on [X](https://x.com/JordanLesich) and check out his work on [GitHub](https://github.com/jordanlesich) to stay up-to-date with their latest projects and contributions.

## Community Updates

New merch who dis? Check out our latest batch of merch and be sure to come and find us at our upcoming events and side events to snag one of our very snazzy caps or some of our custom stickers.

<img src="/blog-assets/envio-developer-community-sep-2024-7.png" alt="Picture of Envio Branded Caps" width="100%"/>

## Playlist of the Month 🎧️

▶️ [Open Spotify](https://open.spotify.com/playlist/74X6dI8SMqdrjSl1ECKF5e?si=2d979afa6d6a46ac)

<img src="/blog-assets/envio-developer-community-sep-2024-8.png" alt="Envio Spotify Playlist of the Month" width="100%"/>

## Envio Freelancer Network 🌐

Need an indexer but don’t have the bandwidth? Whether you're looking to find top-notch freelancers or you’re a freelancer seeking new opportunities, we've got you covered. Our thriving Freelancer Network connects skilled contractors with Web3 protocols to service their data needs. ⚡️

Simply fill out the [form](https://noteforms.com/forms/envio-freelancer-network-u9zqbv) to join our freelancer network.

## Ship with us. 🚢

[Envio](https://envio.dev/) is a modern, multi-chain EVM blockchain indexing framework that is speed-optimized for querying real-time and historical data.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.

[Book a demo](https://cal.com/envio)

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer) | [GitHub](https://github.com/enviodev)
