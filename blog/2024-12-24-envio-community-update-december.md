---
title: Envio Developer Update December 2024
sidebar_label: Envio Developer Update December 2024
slug: /envio-developer-update-december-2024
description: "Catch up on what Envio delivered in December 2024 including the HyperSync milestone release DeFi integration with Blocksquare, new tutorials and our community highlights."
---

<img src="/blog-assets/envio-developer-community-december-2024.png" alt="Cover Image Envio Developer Community Update December 2024" width="100%"/>

<!--truncate-->

Welcome to our December 2024 update! It’s the most wonderful time of the year, and we want to take a moment to thank each and every one of you for an incredible 2024. Your support, feedback, and contributions have been at the heart of everything we’ve accomplished, and we couldn’t be more grateful!

This month, we've been busy rolling out new features, integrating with some amazing projects, and continuing to enhance our data indexing solutions. From big milestones with HyperSync to a new DeFi integration with Blocksquare, we’ve got plenty to share. Plus, we’re diving into some exciting updates from our latest tutorials and partnerships.

We’re sending you warm wishes for a joyful, restful holiday season with your loved ones. Stay safe, enjoy the festivities, and we’ll see you in the new year.

Happy holidays from all of us at Envio! ⚡


## HyperSync Milestone ⚡

<img src="/blog-assets/envio-developer-community-december-2024-1.png" alt="HyperSync Milestone #2" width="100%"/>

With nearly 80 billion requests served, [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) is rapidly becoming a top choice as a data source for faster data retrieval than standard RPC. Envio’s indexer, HyperIndex, supports both RPC and HyperSync as sources for ingesting blockchain data.

The traditional method of retrieving blockchain data relies on RPC, which, although functional, becomes inefficient when querying large amounts of data. Hypersync enables data access up to 1000x faster than a standard node and also provides this data free of charge.



## 🚀 HyperIndex Version 2.11.0 is now available 🚀

We’re excited to announce the release of **v.2.11.2**! 


### Field Selection per Event

You can now specify field selection for individual events. This feature optimizes RPC and HyperSync calls by fetching only the data relevant to specific events, avoiding over-fetching.

Example:


```
events:
  - event: "Transfer(address indexed from, address indexed to, uint256 value)"
    field_selection:
      transaction_fields:
        - "to"
        - "from"
```


For more information, you can view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we’re building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us!  ⭐



## Exciting De-Fi Integration with Blocksquare

<img src="/blog-assets/envio-developer-community-december-2024-2.png" alt="Blocksqaure Integration" width="100%"/>

We’re excited to announce that [Blocksquare](https://blocksquare.io/) has integrated Envio’s advanced indexing technology! This integration boosts Blocksquare’s RWA platform, providing faster, more efficient access to on-chain data.

With Envio, tasks like indexing 400,000 Ethereum mainnet events now take under 20 minutes—a huge improvement over traditional methods.

This collaboration powers [Oceanpoint](https://oceanpoint.fi/) and Blocksquare’s white-label real estate marketplace solutions, paving the way for more scalable real estate tokenization.


## Indexing & Reorgs

<img src="/blog-assets/envio-developer-community-december-2024-3.png" alt="Indexing & Reorgs" width="100%"/>

Check out our new article on the impact of chain reorgs on data consumption and aggregation and the challenges of navigating a multichain environment.

Chain reorgs are crucial when indexing data, especially near finalized blocks. How do stateless and stateful data handle reorgs? What are the challenges of multichain indexing? And how do these reorgs play out on networks like Base and Polygon?

Explore the full [blog](https://docs.envio.dev/blog/indexing-and-reorgs).


## Tokenizing RWAs: How Blockchain is Redefining Real Estate Investment

<img src="/blog-assets/envio-developer-community-december-2024-4.png" alt="Tokenizing RWAs" width="100%"/>

What if you could own real estate without the high costs? Blocksquare's tokenized real-world assets (RWAs) are unlocking new investment opportunities. No barriers—just seamless, borderless access to property markets. Welcome to the future of real estate.  

Read the [full case study](https://docs.envio.dev/blog/tokenizing-real-world-assets).


## Dev Tutorial: Indexing Data on Rootstock

<img src="/blog-assets/envio-developer-community-december-2024-5.png" alt="Indexing Data on Rootstock" width="100%"/>

Check out our latest Rootstock Educate workshop with Encode Club—Master smart contract indexing on [Rootstock](https://rootstock.io/) in under 5 minutes with live coding and hands-on examples. Learn how to identify key transactions using Envio’s powerful blockchain indexing solution to handle millions of events in seconds.

For more developer tutorials check out our [YouTube](https://www.youtube.com/@envio_indexer) channel.


## Can ZKPs Redefine User Privacy? How zkPass is Shaping the Future of Data Security

<img src="/blog-assets/envio-developer-community-december-2024-6.png" alt="Redefining Privacy with ZKPs" width="100%"/>

Can zero-knowledge proofs (ZKPs) redefine user privacy? [zkPass](https://zkpass.org/) is revolutionizing privacy by verifying information without exposing sensitive data. With privacy breaches becoming all too common, the question isn’t if your data is exposed, it’s when. Can we protect personal information while still verifying key details?

Read the full [blog](https://docs.envio.dev/blog/zkpass-shaping-future-of-data-privacy).


## Envio Powers BakoID's Handles with Efficient Data Indexing

<img src="/blog-assets/envio-developer-community-december-2024-7.png" alt="Envio Powers Bako" width="100%"/>

We’re excited to partner with Bako, the native naming system for the Fuel ecosystem. Envio powers Bako with faster and more reliable data to power their users' handles.

This integration ensures Bako users benefit from more efficient blockchain data handling and improved performance.

Check it out ➡️ app.bako.id


## Featured Developer 🧑‍💻

<img src="/blog-assets/envio-developer-community-december-2024-8.png" alt="December Featured Dev" width="100%"/>

This month’s Featured Community Member is [Simon Kruse](https://github.com/Simon0x), Head of Web3 Development at Blocksquare. Since 2017, Simon has been active in crypto, specializing in real estate tokenization and DeFi, focusing on borrowing and lending solutions.

Simon’s team operates two of the top-signaled indexers on The Graph but is now consolidating into one unified indexer using Envio for Blocksquare and Oceanpoint. Leveraging Envio’s fast indexing and developer-friendly tools, they’re driving innovation in tokenized real estate and DeFi.

*“Envio is really onto something. Their tech is fascinating, and the developer experience is unparalleled. After years of working with The Graph, it’s refreshing to see new players like Envio pushing the boundaries. The team is responsive, innovative, and a pleasure to work with.” – Simon Kruse, Head of Web3 Development & Governance Board Member at Blocksquare*

Check out Blocksqaure on [X](https://x.com/blocksquare_io) for updates and explore the Blocksquare/Oceanpoint indexer in our [explorer](https://envio.dev/app/blocksquare/blocksquare-oceanpoint).


## Playlist of the Month 🎧️ 

<img src="/blog-assets/envio-developer-community-december-2024-9.png" alt="December Playlist" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/7awVFZ11ewVYCk0KyMYCka?si=c198409b4f9d43c1)


## Envio Freelancer Network 🌐 

Need an indexer but don’t have the bandwidth? Whether you're looking to find top-notch freelancers or you’re a freelancer seeking new opportunities, we've got you covered. Our thriving Freelancer Network connects skilled contractors with Web3 protocols to service their data needs. ⚡️

Simply fill out the [form](https://noteforms.com/forms/envio-freelancer-network-u9zqbv) to join our freelancer network.


## Ship with us. 🚢 

[Envio](https://envio.dev/) is a modern, multi-chain EVM blockchain indexing framework that is speed-optimized for querying real-time and historical data.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information. \


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer) | [GitHub](https://github.com/enviodev)
