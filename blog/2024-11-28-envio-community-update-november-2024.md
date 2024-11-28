---
title: Envio Developer Update November 2024
sidebar_label: Envio Developer Update November 2024
slug: /envio-developer-update-november-2024
---

<img src="/blog-assets/envio-developer-community-november-2024.png" alt="Cover Image Envio Developer Community Update November 2024" width="100%"/>

<!--truncate-->

Welcome to our November 2024 update! 

This month, we rolled out v2.9.0, launched our V2 Hosted Service, and celebrated new integrations with Swaylend, Tangle, and more. We also added fresh network support to HyperSync, shared our top AWS cost-saving strategies, and published a Fuel tutorial for building production-ready apps. Plus, we’ll cover some highlights of our time at DevCon and ZuThailand. Let’s dive in! 


## 🚀 HyperIndex Version 2.9.0 is now available 🚀

We’re excited to announce the release of **v.2.9.0**! 

### Environment Variables in the config file:

The Envio config file now supports Environment Variables for greater flexibility. Instead of editing the config file every time, you can quickly switch configurations by setting Environment Variables at runtime.

*⭐ **Note:** Hosted Service users can now set custom Environment Variables.*

Example:

```
networks:
  - id: ${ENVIO_CHAIN_ID:-137}
    start_block: ${ENVIO_START_BLOCK:-45336336}
    contracts:
      - name: Greeter
        address: ${ENVIO_GREETER_ADDRESSES}
```

Run the following command to set the variables:

```
ENVIO_GREETER_ADDRESSES=0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c pnpm dev
```

Alternatively, you can set values via the `.env` file or the Hosted Service indexer settings page.

**Interpolation Syntax:**

To apply interpolation, use the following formats for Environment Variables:

* Direct substitution:  `${VAR}` →  value of `VAR`
* Default value: `${VAR:-default}` → value of `VAR` if set, otherwise `default`
* Alternative default: `${VAR-default}` → value of `VAR` if set, otherwise `default`

For more information, you can view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we’re building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us!  ⭐


## Our V2 Hosted Service is Here! 

<img src="/blog-assets/envio-developer-community-november-2024-1.png" alt="V2 Hosted Service" width="100%"/>

Our V2 Hosted Service has arrived! It’s a significant upgrade that brings you faster build times, enhanced features, and an overall smoother experience. 

All new deployments moving forward will now automatically use V2, offering:

* 10x faster build and deployment times
* Faster indexing speeds
* Improved UI/UX
* New features like direct database connections and advanced analytics

V2 also enhances flexibility, reliability and reduces costs. We’re offering all existing V1 users a 50% discount on any production plan with a 6-month commitment to celebrate this milestone.

For more details, check out our [FAQs](https://envio-dev.notion.site/V2-Hosted-Service-Transition-and-FAQs-12faf438121380c98ec7f7626c9f9f83).


## Exciting De-Fi Integration with Swaylend

<img src="/blog-assets/envio-developer-community-november-2024-2.png" alt="Envio Swaylend Integration" width="100%"/>

We’re thrilled to announce that Envio's efficient indexing solution has been integrated with Swaylend, a lightning-fast & low-cost lending platform. We’re excited to integrate and power real-time insights for the smoothest crypto lending experience on the Fuel Network. ⛽️⚡️

This integration elevates Swaylend's functionality by delivering efficient access to on-chain data, creating a smooth experience for their users.


## Lightning-Fast Data Retrieval Now Supported on Tangle & More!

<img src="/blog-assets/envio-developer-community-november-2024-3.png" alt="HyperSync Supported Networks" width="100%"/>

Build, deploy, and monetize decentralized services effortlessly with Tangle—your gateway to the next era of restaking cloud infrastructure. HyperSync enables applications and data analysts to retrieve data through standard RPC or unlock up to 1000x faster performance with its advanced capabilities. Together, this integration drives innovation, simplifies development, and delivers unmatched performance for users.

Other new networks that were added to HyperSync this month include:

* B2 Testnet
* Galadriel Devnet  
* Lisk
* Morph
* opBNB
* Sophon
* Unichain Sepolia

View all current HyperSync-supported networks in our [docs](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


## Optimizing AWS for Indexer Performance: Strategies to Lower Cloud Costs

<img src="/blog-assets/envio-developer-community-november-2024-4.png" alt="AWS Cost Optimization" width="100%"/>


Reducing AWS costs doesn’t have to come at the expense of performance. By optimizing your network and fine-tuning infrastructure, you can maintain smooth indexer operations while staying within budget. 

Explore our tips for smarter, more efficient AWS spending in our latest [blog](https://docs.envio.dev/blog/cut-aws-cloud-costs).


## Dev Tutorial: Building Decentralized Applications on Fuel

<img src="/blog-assets/envio-developer-community-november-2024-5.png" alt="Envio Fuel Tutorial" width="100%"/>

In our new Fuel tutorial, we guide you through the process of building and deploying a smart contract on a testnet, starting with the fundamentals of Fuel. We then dive into Fuel’s internals and show you how to use Envio to set up a backend indexer, making your app production-ready.

This tutorial is perfect for devs looking to leverage Fuel and Envio to create scalable Web3 applications—check it out on our [YouTube](https://www.youtube.com/watch?v=iikIUP-T7ro&t=13s) channel!


## Highlights from DevCon & ZuThailand. 🇹🇭

<img src="/blog-assets/envio-developer-community-november-2024-6.png" alt="Envio DevCon & ZuThailand" width="100%"/>

We had an incredible time at [Devcon](https://devcon.org/en/) 2024 in Bangkok! Envio had the pleasure of co-hosting the [Data & Chill Café](https://lu.ma/w84y3q08) side event, bringing together top builders from around the world— spanning data, analytics, indexing, block explorers, and more.

It was a great opportunity to network and discuss the future of blockchain data and more. Huge thanks to Noves and [growthepie](https://www.growthepie.xyz/) for being fantastic co-hosts, and to everyone who joined us.

After Devcon, the Envio team continued the momentum at [ZuThailand](https://www.zuthailand.com/), a one-month pop-up city experiment for 300+ deeply technical, curious, and self-driven builders. It was an exciting opportunity to engage with a vibrant community of innovators, share knowledge, and explore the future of decentralized technologies. And the view wasn’t too shabby either!

To stay updated on our upcoming events and where to find us next, check out the schedule below!


## Upcoming Events 🗓️

* [Rootstock Educate: Why Is Blockchain Data So Slow? How to Get It Fast on Rootstock](https://lu.ma/e0514_3111?tk=wnw72A&utm_source=yve8mz) - 10 December 2024


## Featured Developer 🧑‍💻

<img src="/blog-assets/envio-developer-community-november-2024-7.png" alt="Envio Featured Developer" width="100%"/>

This month's featured developer and community member is Chris Koo, a talented developer and crypto enthusiast known for his contributions to the DeFi space. Chris created the [Salt Dex Indexer](https://v2.envio.dev/app/hashscape/salt-dex-indexer-prod), which indexes Uniswap V2 and V3 across all EVM chains, enabling users to easily access decentralized trading through [Salt](https://saltapp.xyz/)—an all-in-one trading service that connects over 30 chains and all major DEXs, allowing you to trade newly created tokens quickly and securely.

***"Envio Indexer’s speed comes from its amazing team. They love solving problems and keep pushing themselves to find better solutions. That’s how Envio stays the top indexer." – Chris Koo***

Explore the full list of deployed indexers in our [explorer](https://v2.envio.dev/explorer).


## Playlist of the Month 🎧️ 

<img src="/blog-assets/envio-developer-community-november-2024-8.png" alt="Envio Playlist" width="100%"/>


▶️ [Open Spotify](https://open.spotify.com/playlist/0AWh4ltYv86dIgdw44tCip?si=b2f8de47dba14ca8)


## Envio Freelancer Network 🌐 

Need an indexer but don’t have the bandwidth? Whether you're looking to find top-notch freelancers or you’re a freelancer seeking new opportunities, we've got you covered. Our thriving Freelancer Network connects skilled contractors with Web3 protocols to service their data needs. ⚡️

Simply fill out the [form](https://noteforms.com/forms/envio-freelancer-network-u9zqbv) to join our freelancer network.


## Ship with us. 🚢 

[Envio](https://envio.dev/) is a modern, multi-chain EVM blockchain indexing framework that is speed-optimized for querying real-time and historical data.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.

[Book a demo](https://cal.com/envio) \


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer) | [GitHub](https://github.com/enviodev)
