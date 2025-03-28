---
title: Envio Developer Update March 2025
sidebar_label: Envio Developer Update March 2025
slug: /envio-developer-update-march-2025
---

<img src="/blog-assets/envio-dev-update-march-2025.png" alt="Cover Image Envio Developer Community Update March 2025" width="100%"/>

<!--truncate-->

March was madness! We’re excited to roll out HyperIndex v2.15.0 with RPC failover support, LogTui for fast chain scans, and integrations with V12, XDC Network, Monad, and Chiliz. With new tools, powerful partnerships, tutorials, and more, we’re empowering developers to build smarter and faster than ever. Let’s dive into the latest updates!


## 🚀 HyperIndex Version 2.14.0 & 2.15.0 is now available 🚀

### Topic Filtering goes Multichain ⛓️
Now the `eventFilters` option can also accept a callback, allowing for building different filters depending on `chainId`:

```
import { ERC20 } from "generated";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const WHITELISTED_ADDRESSES = {
  1: [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  ],
  100: ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"],
};

ERC20.Transfer.handler(
  async ({ event, context }) => {
    //... your handler logic
  },
  {
    wildcard: true,
    eventFilters: ({ chainId }) => [
      { from: ZERO_ADDRESS, to: WHITELISTED_ADDRESSES[chainId] },
      { from: WHITELISTED_ADDRESSES[chainId], to: ZERO_ADDRESS },
    ],
  }
);
```
## Stricter `chainId` type 🔐
The `chainId` type on `event` is now a union of chain ids the event belongs to. This is much safer than a number type used before.


## V2.14.0
HyperIndex v2.14.1 also went live with this update bringing enhanced reliability with RPC failover support—ensuring 100% uptime for your indexer. If HyperSync becomes unavailable, your indexer will automatically switch to an RPC provider.


#### What's new?


* **RPC as a fallback** → If the primary data source doesn’t receive a new block in 20 seconds, your indexer seamlessly switches to an RPC provider.
* **New RPC configuration syntax** → Easily add redundancy with a single field.
* **Advanced control** → Define multiple RPC endpoints, set fallback priorities, and customize block intervals.



#### How to enable it?

Simply add an RPC field to your network configuration:



* If HyperSync is available for a chain, it remains the primary data source, with RPC as a fallback.

For chains without HyperSync support, RPC becomes the primary data source.


```
networks:
  - id: 137 # Polygon
    start_block: 0
+   rpc: https://eth-mainnet.your-rpc-provider.com
    contracts:
      - name: PolygonGreeter
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
```


**Advanced RPC Configuration:**

Want more control? You got it. Now you can explicitly define primary vs. fallback RPC providers:


```
networks:
  - id: 137 # Polygon
    start_block: 0
+   rpc:
+     url: https://eth-mainnet.your-rpc-provider.com
+     for: sync
    contracts:
      - name: PolygonGreeter
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
```


Or specify multiple RPC endpoints with custom settings:


```
networks:
  - id: 137 # Polygon
    start_block: 0
+   rpc:
+     - url: https://eth-mainnet.your-rpc-provider.com?API_KEY={ENVIO_MAINNET_API_KEY}
+       for: fallback
+     - url: https://eth-mainnet.your-free-rpc-provider.com
+       for: fallback
+       initial_block_interval: 1000
    contracts:
      - name: PolygonGreeter
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
```


This update ensures full redundancy, uninterrupted indexing, and complete flexibility.

Try it out & let us know what you think! 🚀

For more information, you can view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we’re building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us!  ⭐


## Introducing LogTui: Scan Entire Chains for Logs in Seconds


<img src="/blog-assets/envio-dev-update-march-2-2025.png" alt="logtui" width="100%"/>

[LogTui](https://www.npmjs.com/package/logtui) is a free CLI tool that lets you scan entire chains for on-chain events with a single command. It supports 70+ networks and comes with presets for major protocols like ERC-20, ERC-721, Aave, and Chainlink. Designed for speed, it can process millions of events in minutes, powered by HyperSync’s efficient filtering to keep data transfer minimal.

For more details check out this [post](https://x.com/jonjonclark/status/1901604311206899760).



## Exciting DeFi Integration V12


<img src="/blog-assets/envio-dev-update-march-3-2025.png" alt="v12" width="100%"/>


We’re excited to announce that Envio’s open-indexing framework has been integrated with V12—an on-chain order book that provides high-speed and precise trading.

With this integration, V12 can seamlessly track key trading metrics, including daily users, orders, and historical trends, all in real time. This improved visibility enhances their analytics and informs ongoing platform optimizations, ensuring a more efficient and data-driven trading experience.


## Envio’s Blockchain Indexing Framework Supports Developers Building on the XDC Network


<img src="/blog-assets/envio-dev-update-march-4-2025.png" alt="xdc" width="100%"/>


Trade moves fast—your data should, too.

We’re excited to announce that Envio’s open indexing framework supports developers building on the [XDC Network](https://xdc.org/)—an EVM-compatible L1 for secure, scalable global trade with efficient and reliable access to real-time & historical data


## Envio Continues to Power a Growing Ecosystem on Monad


<img src="/blog-assets/envio-dev-update-march-5-2025.png" alt="monad ecosystem" width="100%"/>


Indexing 10,000 TPS? No sweat.  

Envio is fueling a thriving ecosystem on [Monad](https://www.monad.xyz/), empowering projects with real-time data retrieval and optimized UX as they prepare for mainnet. From [Kuru Exchange](https://www.kuru.io/markets?marketType=trending&timeInterval=5m) and [HaHa Wallet](https://www.haha.me/) to [Nadradar](https://nadradar.com/), [Nad.fun](https://testnet.nad.fun/), [Monorail](https://testnet-preview.monorail.xyz/), [Revoke Cash](https://revoke.cash/), and more—Envio is at the heart of the next wave of high-performance applications.

Check out this [thread](https://x.com/envio_indexer/status/1900493623784808598) to explore some of the incredible projects we support on Monad.


## Envio x Chiliz: Powering the Future of Sports on Chain



<img src="/blog-assets/envio-dev-update-march-6-2025.png" alt="Envio x Chiliz" width="100%"/>


Game on! Envio’s open-indexing framework now supports developers building on [Chiliz](https://www.chiliz.com/), the leading sports-focused blockchain. With seamless access to real-time and historical data, devs can create high-performance applications that bring fan engagement, sports analytics, and Web3 experiences to the next level. ⚽️🏆


## Developer Tutorials: Monad, Chiliz & Rootstock


### Monad Tutorial


<img src="/blog-assets/envio-dev-update-march-7-2025.png" alt="monad tutorial" width="100%"/>


Build a Telegram bot that tracks $WMON token transfers in real-time on the Monad Testnet using Envio’s open-indexing framework. This tutorial walks you through setting up an indexer, handling live events, and sending instant notifications—all powered by HyperIndex.

Learn more by visiting Monad’s [documentation](https://docs.monad.xyz/guides/tg-bot-using-envio).


### Chiliz Tutorial


<img src="/blog-assets/envio-dev-update-march-8-2025.png" alt="chiliz tutorial" width="100%"/>


Track major Fan Token™ transfers with a Telegram bot in just minutes. Our latest Chiliz indexing tutorial shows you how to monitor high-value moves and stay ahead in the sports-focused blockchain ecosystem.

Learn more by visiting Chiliz [documentation](https://docs.chiliz.com/develop/advanced/how-to-create-telegram-notifications-for-fan-token-transfers).


### Rootstock Tutorial

 <iframe width="560" height="315" src="https://www.youtube.com/embed/Yucbr7SMprg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


Watch our hands-on Rootstock indexing tutorial and learn how to seamlessly retrieve blockchain data for your dApps. We cover the fundamentals of data indexing, why it’s critical for scalable applications, and how to get started from scratch.


## Powering the next-gen Apps on Fuel


<img src="/blog-assets/envio-dev-update-march-9-2025.png" alt="powering apps on fuel" width="100%"/>



Envio proudly supports a rapidly growing ecosystem on the [Fuel Network](https://fuel.network/), providing the most performant and reliable data retrieval to enhance UX across cutting-edge projects like [Swaylend](https://swaylend.com/), [Mira Protocol](https://mira.ly/), [Thunder](https://thundernft.market/), [Props](https://www.propslabs.com/), V12, and more. Building the next big thing on Fuel? Join our Discord and let’s chat.

For more on the projects we’re powering, check out this [thread](https://x.com/envio_indexer/status/1898023661308645818).


## Visualize Any Address Instantly with Chain Density

<img src="/blog-assets/envio-dev-update-march-10-2025.png" alt="chaindensity update" width="100%"/>


Block explorers show raw data—ChainDensity makes it visual. Instantly track on-chain activity for any address and spot trends without complex queries.



* **Estimate Indexing Efforts** – Know event volume before indexing (135M USDC events fetched in 167 sec).

* **Identify Activity Trends** – See contract usage patterns at a glance (e.g., Tornado Cash 100 ETH pool).

Powered by HyperSync, Chain Density delivers fast, intuitive insights. 

[Try it for free](https://chaindensity.xyz/)


## Congratulations to the Modular DeFi Denver Hackathon Winners


<img src="/blog-assets/envio-dev-update-march-11-2025.png" alt="encode winners denver" width="100%"/>


A huge thanks to the Encode Club team for hosting the Modular DeFi Hackathon in Denver! It was amazing to see all the hackers bring their best ideas to life. Big shoutout to everyone for their incredible submissions.

For more details about our winners and prizes, check out this [thread](https://x.com/envio_indexer/status/1900163549105664042).


## What is Multi-chain Indexing?

<img src="/blog-assets/envio-dev-update-march-12-2025.png" alt="what is multi-chain" width="100%"/>


Multi-chain or multi-pain?

Web3 is inherently multi-chain, but navigating networks can be challenging. Learn how to simplify multi-chain data access & query your data without managing multiple infras using Envio in our latest [blog](https://docs.envio.dev/blog/what-is-multi-chain-indexing).


## Upcoming Events 🗓️


* EthGlobal [Pragma Cannes](https://ethglobal.com/events/pragma-cannes): 3rd June 2025
* [DappCon](https://dappcon.io/): 16th → 18th June 2025
* WAGMI Sponsors at [EthCC](https://ethcc.io/)**:** 30th June → 3rd July 2025 



## Featured Developer 🧑‍💻

<img src="/blog-assets/envio-dev-update-march-13-2025.png" alt="dev of the month march 2025" width="100%"/>


This month, we’re thrilled to feature Gabriel Stoica, a passionate developer focused on decentralization, privacy, and bridging the gap between Web2 and Web3. With years of experience crafting smart contracts and building end-to-end dApps, Gabriel has dedicated his work to making Web3 more accessible for all.

Currently leading the development of [Werk](https://www.werk.pro/), a Web3 platform that enables freelancers and entrepreneurs to bring their daily activities on-chain, Gabriel has a knack for designing seamless blockchain integrations. He’s also built tools to help non-crypto natives interact with blockchain technology, especially in the ReFi/DeFi space.


***"I first heard about Envio on social media and was curious whether its impressive speed would truly be felt throughout the entire development process—from setting up an indexer to configuring and deploying it. Like any modern product, Envio wasn’t perfect. I ran into a limitation and decided to reach out on Discord. What surprised me most wasn’t just their responsiveness, but the level of openness and genuine collaboration they brought to the table. Their professionalism is matched by their approachability, making the experience seamless and engaging. At its core, Envio is built on rapid iteration and continuous improvement while staying deeply attuned to its users' needs. I’d highly recommend Envio as the go-to indexer for any crypto project looking to combine speed, efficiency, and top-tier support."*** *- Gabriel Stoica, Lead Developer at Werk*


We appreciate Gabriel Stoica’s contributions and passion for making Web3 more intuitive and practical for real-world use. Keep up the great work!

Make sure to check out Gabriel’s [GitHub](https://github.com/gabrielstoica) and follow them on [X](https://x.com/stoicaxyz) to stay updated on their latest projects and insights.


## Playlist of the Month 🎧️ 

<img src="/blog-assets/envio-dev-update-march-14-2025.png" alt="playlist march 2025" width="100%"/>


▶️ [Open Spotify](https://open.spotify.com/playlist/0KuEG8cv3T7oNV0rtLKaEP?si=e00c3fc7a6f244ca)


## Ship with us. 🚢 

[Envio](https://envio.dev/) is a modern, multi-chain EVM blockchain indexing framework that is speed-optimized for querying real-time and historical data.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [Farcaster](https://warpcast.com/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer) | [GitHub](https://github.com/enviodev)
