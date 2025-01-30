---
title: Envio Developer Update January 2025
sidebar_label: Envio Developer Update January 2025
slug: /envio-developer-update-january-2025
---

<img src="/blog-assets/envio-developer-community-january-2025.png" alt="Cover Image Envio Developer Community Update January 2025" width="100%"/>

<!--truncate-->


Welcome to our first update of 2025! We’re kicking off the year with a bang!

Learn more about our latest release and new features to make your indexing experience even better. We’ve also rolled out new guides and integrations, making it easier than ever to work with Envio’s tools and solutions. Plus, we’ve got some exciting integrations, partnerships, and events coming up. Let’s dive in! 👇


## 🚀 HyperIndex Version 2.12.0 is now available 🚀

Please note: The latest release is V2.12.1.


<img src="/blog-assets/envio-developer-community-january-2025-1.png" alt="Version 2.12.0" width="100%"/>



Before this big release, the RPC data source in HyperIndex had several limitations and lacked many of the features available in the HyperSync data source. We’re excited to announce that this has now been resolved! 

You’re no longer tied to HyperSync or held back when adding new chains that aren’t supported yet. HyperIndex is now a fully equipped RPC indexer, ready for anything! 💪

**What's changed for the RPC data source?** 

* Wildcard Indexing support for the RPC data source.
* Pre-registration support for the RPC data source.
* Event Filtering support for the RPC data source when applied to a single wildcard event.
* Transaction input and value fields support for the RPC data source.
* Improved RPC retries on block range error.

For more information, you can view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we’re building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us!  ⭐


## Indexing Contract Events with Envio HyperSync 

<img src="/blog-assets/envio-developer-community-january-2025-2.png" alt="Indexing Conract Events" width="100%"/>


Intuition recently shared their experience using Envio HyperSync to index contract events efficiently with Rust. They highlighted how HyperSync’s real-time data extraction, multi-chain support, and extreme speed—scanning 200M blocks in 10 seconds—enhanced their infrastructure.

Their open-source envio-indexer crate enables seamless event indexing, supporting both database storage and direct streaming to SQS. They also provided a Dockerized setup for scalability and portability.

For those looking to build high-performance indexers, their example showcases how HyperSync simplifies the process while ensuring reliability.

Learn more in their latest [blog](https://medium.com/0xintuition/index-contract-events-with-envio-hypersync-and-rust-29451efdcee0).


## New Guide: Getting Price Data in Your Indexer

Need price data in your indexer? Whether it's for historical token transfers or Uniswap TVL calculations, there are three ways to fetch prices: Oracles, DEX pools, and Offchain APIs.



* Oracles (e.g., API3, Chainlink) push price updates on-chain but may lag behind real-time values.

* DEX pools (e.g., Uniswap V3) offer decentralized price data but can be impacted by low liquidity and manipulation.

* Offchain APIs (e.g., CoinGecko) provide broad historical data but come with latency and paywall restrictions.


Each method has trade-offs between speed, accuracy, and decentralization—choose what fits your use case. 🚀

Learn more in our latest [guide](https://docs.envio.dev/docs/HyperIndex/price-data).


## Falcon Gun Integrates Envio to Streamline its Data Retrieval for Enhanced Trading

<img src="/blog-assets/envio-developer-community-january-2025-3.png" alt="Falcon Gun Integrates Envio" width="100%"/>


We’re excited to announce our integration with [Falcon Gun](https://falcongun.com/). Their lightning-fast trading bot terminal now leverages Envio’s indexing solution to streamline data retrieval for faster, more reliable trades. Stay ahead of the crypto market with FalconGun’s powerful sniping tool. 🦅

Learn more [here](https://x.com/FalconGunBot/status/1879860589704745030).


## What is a Blockchain Indexer?


<img src="/blog-assets/envio-developer-community-january-2025-4.png" alt="What is an indexer" width="100%"/>


New to indexing or need a refresher? Check out our latest blog where we explain how blockchain indexers transform complex on-chain data into easy-to-query, actionable insights. Learn how Envio’s tools like HyperSync and multichain support make data retrieval faster and help you build decentralized apps more efficiently.

Read the full [blog](https://docs.envio.dev/blog/what-is-a-blockchain-indexer).


## Envio & ChainDensity: Featured Sponsors in Primo Data's Blockchain Tools Directory

<img src="/blog-assets/envio-developer-community-january-2025-5.png" alt="Envio & ChainDensity Sponsor Primo Data" width="100%"/>


Envio & [ChainDensity](https://chaindensity.xyz/) are proud to sponsor and be featured alongside 300+ leading tools in Primo Data's [directory](https://www.primodata.org/blockchain-data). Explore the most comprehensive blockchain data resources and discover cutting-edge companies and open-source projects building tools to query, analyze, and visualize blockchain data.


## Featured Developer 🧑‍💻

<img src="/blog-assets/envio-developer-community-january-2025-6.png" alt="Jan 2025 Dev of the month" width="100%"/>


This month’s featured developer and community member of the month is Luis Eduardo Boiko Ferreira!

Luis is a senior backend engineer who started in Web3 in 2018. His experience spans everything from building secure enclave code to developing efficient APIs and deploying cloud solutions. Currently, at [Intuition](https://www.intuition.systems/), Luis is leading the development of a contract event ingestion pipeline, handling data indexing, processing, and adding new layers of interpretation. Before Intuition, Luis worked at Bolt Labs, where he developed secure enclave systems for private key management, ensuring they passed rigorous audits. His earlier work includes building settlement engines for gaming businesses and creating multi-step data ingestion pipelines, APIs, CLIs, and TUIs.

In addition, Luis wrote the outstanding blog on indexing contract events using HyperSync mentioned above. A huge shoutout to Luis for the effort he put into crafting such a detailed, insightful deep dive and for being a stellar member of the Envio community.


***"Using Envio HyperSync has been a game-changer for us. Its simplicity and efficiency are outstanding, making our indexing tasks significantly easier. The excellent documentation allowed us to get up to speed quickly, minimizing the learning curve. We tested several other indexing solutions over the past few months, but Envio HyperSync stood out as the best. Its support for a wide array of networks enabled us to create indexers for different networks swiftly and effortlessly. Instead of spending time developing the solution, we were able to focus on the core business logic. I highly recommend Envio HyperSync for anyone looking for a reliable and efficient indexing solution."*** *- Luis Eduardo Boiko Ferreira, Senior Backend Engineer at Intuition*

Follow Luis on [X](https://x.com/lockpickingtux) for more updates and check them out on [GitHub](https://github.com/leboiko).


## Playlist of the Month 🎧️ 

<img src="/blog-assets/envio-developer-community-january-2025-7.png" alt="Jan playlist of the month" width="100%"/>


▶️ [Open Spotify](https://open.spotify.com/playlist/6RrIwtSy6PiKOmUHuPtBFc?si=194fb56ca8da4282)


## Envio Freelancer Network 🌐 

Need an indexer but don’t have the bandwidth? Whether you're looking to find top-notch freelancers or you’re a freelancer seeking new opportunities, we've got you covered. Our thriving Freelancer Network connects skilled contractors with Web3 protocols to service their data needs. ⚡️

Simply fill out the [form](https://noteforms.com/forms/envio-freelancer-network-u9zqbv) to join our freelancer network.


## Ship with us. 🚢 

[Envio](https://envio.dev/) is a modern, multi-chain EVM blockchain indexing framework that is speed-optimized for querying real-time and historical data.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer) | [GitHub](https://github.com/enviodev)
