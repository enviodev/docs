---
title: Envio Developer Update August 2024
sidebar_label: Envio Developer Update August 2024
slug: /envio-developer-update-august-2024
---

<img src="/blog-assets/envio-developer-community-august-2024.png" alt="Cover Image Envio Developer Community Update August 2024" width="100%"/>

<!--truncate-->

Welcome to our August 2024 developer update! 

We’re excited to share the latest and greatest developments from the Envio team. In this edition, we’ll highlight the launch of our latest V2 release, showcasing exciting new features and important fixes. We’ll also cover key updates for August, including upcoming events, partnerships, and more. Let’s dive in!

## HyperSync Milestone ⚡ 

<img src="/blog-assets/envio-developer-community-august-2024-1.png" alt="Cover Image HyperSync Requests" width="100%"/>

HyperSync requests have surpassed 10 billion requests, demonstrating [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) as a clear up-and-coming favourite for faster data indexing compared to RPC. As many of you know, Envio's indexer, [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview), supports both RPC and/or HyperSync as a data source for ingesting blockchain data. 

The traditional approach to blockchain data retrieval uses RPC methods to extract data. This method, while functional, is far from efficient when querying lots of data. More info on this [here](https://docs.envio.dev/blog#the-blockchain-data-retrieval-challenge). 

## Version 2.2.0 now available 🚀

We are excited to announce that the current release is **v.2.2.0**!

**What's changed?**

- By replacing lists with arrays in v2.1.0 it incurred a significant performance regression due to using Array.slice method. We removed the use of Array.slice which significantly improves performance.
- Updated Viem version to the latest V2 to fix type conflicts with the Viem version on user-side. *Be careful if you're using Viem V1 in your indexer handlers. This change might cause unexpected behavior.*
- Bumped Fuel package version to 2.2.3 and work on merging fuel codebase into evm codebase.
- Added script to help update the chain list in Envio CLI for Quickstart.
- Fix codegen with HyperSync/RPC endpoint in the config having a trailing slash.

To stay updated with our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support is greatly appreciated! ⭐

For more information and to view the full list of current and past release notes, click [here](https://github.com/enviodev/hyperindex/releases).

**What's next?**

- Wildcard indexing 👀

## Transition to HyperIndex v2 Hosted Service – Important Updates

With the launch of [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) v2, we're excited to share that the v2 [Hosted Service](https://docs.envio.dev/docs/HyperIndex/hosted-service) is coming soon! Expect significant UI/UX improvements and enhancements to boost stability, reduce build times, and lower costs.

To facilitate this transition, we’re reducing the number of indexers on the v1 Hosted Service.

Specifically, we’ll remove:

- Non-production deployments.
- Indexers older than one month with no recent endpoint requests.
- Indexers using outdated versions (v0.0.x and lower).

**🚨Action Required:**

- Promote any indexers you’re using to production status.
- Ensure your indexer version is >1.x or ideally v2. 😉

For more details on the new pricing tiers, check our initial thoughts [here](https://docs.envio.dev/docs/HyperIndex/hosted-service-billing). We appreciate your cooperation during this transition and look forward to what’s ahead! 🚀

If you need to keep any specific indexers running, please reach out to us in [Discord](https://discord.gg/gfZv3v3FsM). Also, stay up-to-date with our latest version releases by following the “🚨releases” [channel](https://discord.gg/uGVheTdmaH) in Discord for live updates as soon as new versions are available!

## Envio x EthGlobal: EthOnline Hackathon 2024

The [EthGlobal](https://ethglobal.com/events/ethonline2024) ETHOnline Hackathon is officially live and will run until September 13, 2024! 🎉

While applications are now closed, Envio is excited to offer $5,000 in bounties to participants. To help participants succeed, we've curated a comprehensive hacker pack filled with essential resources and tools. For more information, be sure to check out our [hacker pack](https://ethglobal.com/events/ethonline2024/prizes#envio)! We’ll keep the community updated as the hackathon progresses and announce the winners once it's completed. Good luck to all participants!

<img src="/blog-assets/envio-developer-community-august-2024-2.png" alt="Cover Image ETH Online Hackathon Banner" width="100%"/>

## Building ChainDensity

<img src="/blog-assets/envio-developer-community-august-2024-3.png" alt="Cover Image ETH Online Hackathon Banner" width="100%"/>

Understanding address activity in blockchain networks reveals the underlying dynamics of decentralized applications. [ChainDensity](https://chaindensity.xyz/) is a powerful tool designed to visualize event and transaction density across Ethereum and EVM-compatible blockchains.

By transforming raw data into clear visualizations, ChainDensity empowers developers and data analysts to uncover trends and optimize performance. It operates in two modes: **Event Density** and **Transaction Density**, allowing users to assess address activity over time effectively.

Learn more in our full [blog post](https://docs.envio.dev/blog/building-chaindensity).

## Sablier Case Study

We’re excited to announce that [Sablier](https://sablier.com/), a free-to-use infrastructure for money streaming and token distribution, has integrated with Envio's modular data stack to power its next-gen multi-chain token distribution platform!

Learn more in our latest case study [blog](https://docs.envio.dev/blog/case-study-sablier).

<img src="/blog-assets/case-study-sablier.png" alt="Cover Image Sablier Integration" width="100%"/>

## Envio's HyperIndex Repo is Public! 💫

Our HyperIndex repository is now public. Star it on our [GitHub](https://github.com/enviodev/hyperindex) to stay updated with our latest developments!

<img src="/blog-assets/envio-developer-community-august-2024-4.png" alt="Screenshot of Envio" width="100%"/>

## Envio Supports Devs Building on Surge & Citrea!

Envio’s modular data stack now supports developers building on both [Surge](https://surge.build/), a custom Rollup-as-a-service (RaaS) on Bitcoin rails - and [Citrea](https://citrea.xyz/) -  Bitcoin’s first zkRollup. Surge offers a secure and robust foundation for rollups, enhanced by Envio's modern data indexing framework. Meanwhile, Citrea leverages Bitcoin’s security with ZK scalability, empowering developers and data analysts to pioneer innovative solutions on the Bitcoin network.

[Start Shipping](https://envio.dev/). 👈

## Upcoming Events 🗓️

- [Encode x Fuel Educate: How to Index Data on Fuel in Less Than 5 Mins Using Envio](https://lu.ma/E0531_2853?utm_source=fk3mgi) – September 9
- [Token2049 Singapore](https://www.asia.token2049.com/) – September 18-19
- [Envio Builder's Happy Hour at EthCapeTown](https://lu.ma/ta03bb8m) – September 19
- [Envio Run & Chat: Token2049 Side Event](https://lu.ma/5v9wgs1n) - 6km - September 19
- [EthCapeTown](https://www.ethcapetown.com/) – September 20-22
- [Encode London](https://www.encode.club/encodelondon-24) - October 25-27

## Workshops & Developer Tutorials 🧑‍💻

- [Envio: Best Use of HyperIndex - ETHOnline2024](https://www.youtube.com/watch?v=bWpBZU8gPi0)
- [Encode x Fuel Educate: How to Index Data on Fuel in Less Than 5 Mins Using Envio](https://www.youtube.com/watch?v=BqiCjLKorRs)

For more written tutorials visit our [docs](https://docs.envio.dev/docs/tutorial-op-bridge-deposits).

For more video tutorials visit our [YouTube](https://www.youtube.com/@envio_indexer)


## Featured Developer 🧑‍💻

<img src="/blog-assets/envio-developer-community-update-august-2024-dev-spotlight.png" alt="Cover Image of Dev of the Month for August" width="100%"/>

This month, we’re excited to spotlight Martin Domajnko as our Featured community member and Developer of the Month! Martin is a true asset to the Envio community and a dedicated team member of [Lutra Labs](https://lutralabs.io/), a deep tech R&D studio, where he channels his passion for blockchain into crafting innovative and optimized solutions.

Martin has made significant contributions to the blockchain community through impactful projects, including [Swaylend](https://app.swaylend.com/#/dashboard), a lending protocol on the [Fuel Network](https://portfolio.skippy-ai.com/); [Masca.io](http://masca.io/) and [Masca MetaMask Snap](https://snaps.metamask.io/snap/npm/blockchain-lab-um/masca/), decentralized identity solutions within [MetaMask](https://metamask.io/); and [Endorse.fun](https://endorse.fun/?intro=true), an on-chain social endorsement and reputation platform for Web3.

***"I discovered Envio while searching for an indexer to use with Swaylend, the lending protocol our team is developing on Fuel. Given my extensive experience with indexing solutions on other EVM chains, coupled with the excellent support provided by the Envio team, we were able to set up our initial version in less than a day. Kudos to the Envio team for their outstanding product and swift assistance!"*** - Martin Domajnko - Senior Full-Stack Engineer at Lutra Labs

Explore Martin's impressive indexers:

- [Swaylend Monorepo](https://envio.dev/app/swaylend/swaylend-monorepo)
- [Swaylend Monorepo 2](https://envio.dev/app/swaylend/swaylend-monorepo-2)

For a full list of deployed indexers visit our [explorer](https://envio.dev/explorer).

Be sure to follow Martin on [X](https://x.com/MartinesXD) and check out his work on [GitHub](https://github.com/martines3000) to stay updated on his latest projects and contributions.

## Playlist of the Month 🎧️

▶️ [Open Spotify](https://open.spotify.com/playlist/4Psi2qZtzAR5eEtTqiyYlg?si=79390d4ebc194e4f)


<img src="/blog-assets/envio-developer-community-august-2024-5.png" alt="Screenshot of Envio" width="100%"/>

## Envio Freelancer Network 🌐

Need an indexer but don’t have the bandwidth? Whether you're looking to find top-notch freelancers or you’re a freelancer seeking new opportunities, we've got you covered. Our thriving Freelancer Network connects skilled contractors with Web3 protocols to service their data needs. ⚡️

Simply fill out the [form](https://noteforms.com/forms/envio-freelancer-network-u9zqbv) to join our freelancer network.


## Ship with us. 🚢

[Envio](https://envio.dev/) is a modern, multi-chain EVM blockchain indexing framework speed-optimized for querying real-time and historical data.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionise the blockchain world and propel your project to the next level.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X or hopping into our Discord for more up-to-date information.

[Book a demo](https://cal.com/envio)

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
