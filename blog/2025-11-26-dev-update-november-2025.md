---
title: Envio Developer Update November 2025
sidebar_label: Envio Developer Update November 2025
slug: /envio-developer-update-november-2025
description: "What Envio shipped in November 2025: v2.32.0, Monad Mainnet indexing, Alchemy Subgraphs migration, HyperSync Sonic results, and new Rootstock tutorials."
image: /blog-assets/dev-update-nov-25.png
last_update:
  date: 2026-04-15
---

Author: [Jordyn Laurier](https://x.com/j_o_r_d_y_s), Head of Marketing & Operations

<img src="/blog-assets/dev-update-nov-25.png" alt="Cover Image Envio Developer Update Nov 2025" width="100%"/>

<!--truncate-->

Welcome to the Envio monthly developer update. Here is what shipped in November 2025.

November was a big month of product updates, mainnet support and ecosystem activity. We shipped v2.32.0 with new Effect API controls, rolled out full indexing support for Monad Mainnet, and published guidance for teams affected by the Alchemy Subgraphs shutdown to help them migrate their subgraphs to Envio. HyperSync delivered strong benchmarking results on Sonic, and we wrapped up multiple hackathons across MetaMask, Monad and Encode. We also spent time with builders across Edge City in Patagonia and Devconnect in Buenos Aires.


## Exciting Release: Version 2.32.0

<iframe width="560" height="315" src="https://www.youtube.com/embed/yvUVzV1ifig" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 


### Effect API: Goodbye Experimental Prefix

We've officially removed the <code>experimental_ <strong>prefix</strong></code> from the Effect API and introduced some major improvements to indexing visibility and query flexibility.

**This update comes with two new features:**

- **<code>RateLimit</code>** option lets you control how often Effects are called, with support for custom durations

- Disable cache for specific Effect calls using <code>context.<strong>cache</strong> = false</code>

Effect API, released on May 8, served us well, and we officially removed the experimental_ prefix from createEffect.


```
export const getMetadata = createEffect(
  {
    name: "getMetadata",
    input: S.string,
    output: S.optional(S.schema({
      description: S.string,
      value: S.bigint,
    })),
    // Protect your API from burst Effect calls
    rateLimit: {
      calls: 5,
      per: "second"
    },
    cache: true,
  },
  async ({ input, context }) => {
    try {
      const response = await fetch(`https://api.example.com/metadata/${input}`);
      const data = await response.json();
      return {
        description: data.description,
        value: data.value,
      };
    } catch(_) {
      // Don't cache failed response
      context.cache = false
      return undefined;
    }
  }
);
```



### Development Console Insights

The Development Console now shows detailed performance metrics for every Effect API execution. You can see execution time, rate limits, and caching behaviour at a glance, making it much easier to debug and fine tune performance. A simple way to get more visibility and improve your indexer.

<img src="/blog-assets/dev-update-nov-25-1.png" alt="Dev console" width="100%"/>


### New getWhere.lt Query

You can now use <code>context.&lt;Entity>.getWhere.&lt;FieldName>.<strong>lt</strong></code> to filter entities where field values are lower than a given value. This adds more flexibility for granular queries and custom data filtering directly within your indexers.

See full [release notes](https://github.com/enviodev/hyperindex/releases)

Star us on [GitHub](https://github.com/enviodev/hyperindex)



## Monad Mainnet Is Live: Learn How to Index Data on Monad

<img src="/blog-assets/dev-update-nov-25-2.png" alt="Envio supports Monad Mainnet" width="100%"/>


Envio is live on [Monad](https://www.monad.xyz) Mainnet. Get easy access to real-time and historical data on Monad through performant syncing and a smooth, high performance indexing experience from day one. We supported teams throughout testnet and continue to provide the same fast, reliable indexing setup for a growing ecosystem on Mainnet.

If you are live or going live on Monad and need help getting set up, chat to us about your data needs in [Discord](https://discord.com/invite/gt7yEUZKeB). For more on how to index data on Monad, read our [blog article](https://docs.envio.dev/blog/how-to-index-monad-data-using-envio).


## How to Migrate Alchemy Subgraphs to Envio

<img src="/blog-assets/dev-update-nov-25-3.png" alt="How to migrate Alchemy Subgraphs to Envio" width="100%"/> 

Alchemy Subgraphs are officially sunsetting on **December 8, 2025**. Many teams relying on their subgraph service will need a new solution before that date to avoid downtime.

Envio is supporting affected teams with **2 months of free hosting**, faster backfills, multichain indexing, and full white-glove migration support to help you move over smoothly. HyperIndex gives you a modern indexing setup with real-time syncing and production ready deployments, making the transition quick and reliable.

If your subgraphs are affected and you need to migrate, chat to our team or check out this [page](https://envio.dev/alchemy-migration) for more information and we will help you get set up.

For a full walkthrough on how to migrate, read our guide on [How to Migrate Alchemy Subgraphs to Envio](https://docs.envio.dev/docs/HyperIndex/migrate-from-alchemy).


## MetaMask x Envio Advanced Permissions Hackathon is Live 

<img src="/blog-assets/dev-update-nov-25-4.png" alt="MetaMask x Envio hackathon" width="100%"/>

We have partnered with MetaMask for the Advanced Permissions Dev Cook-Off hackathon, inviting developers to build with ERC-7715 and ship new agent and automation ideas. The hack is now live with $10,000 in total prizes available.

For full details and registration, check the event page on [HackQuest](https://www.hackquest.io/hackathons/MetaMask-Advanced-Permissions-Dev-Cook-Off).


## Stable Radar: Monitoring USDC Transactions in Real-Time

<img src="/blog-assets/dev-update-nov-25-5.gif" alt="Stable Radar" width="100%"/>

[Stable Radar](https://www.stable-radar.com) is a new live visualisation that tracks USDC transfers per second across multiple chains including Ethereum, Base, Monad, Sonic, HyperEVM, Worldchain, XDC and many more. It gives a clear view of stablecoin activity as it happens and makes it easy to watch real usage and adoption play out in real-time across different networks. Be sure to check out our [showcase](https://docs.envio.dev/showcase) for more examples of Envio in action. 

Check the original post on [X](https://x.com/DenhamPreen/status/1988980819629863208?s=20).


## How to Monetize HyperSync Queries using x402

<img src="/blog-assets/dev-update-nov-25-6.png" alt="Monetize HyperSync Queries using x402" width="100%"/>

A new demo went live this month showing how analysts and builders can monetize their HyperSync queries using [x402](https://www.x402.org). The project combines HyperSync's fast querying and filtering across multiple networks with x402's pay per request model to create simple monetizable blockchain APIs. The example lets users fetch token transfer history for any address across all HyperSync supported networks, with optional filtering by token.

Explore the demo or try it yourself on [GitHub](https://github.com/nikbhintade/x402-hypersync).


## Devconnect and Edge City | Argentina 

<img src="/blog-assets/dev-update-nov-25-7.png" alt="Envio at Devconnect & Edge City" width="100%"/>

The team recently attended [Edge City](https://www.edgecity.live/patagonia) in Patagonia, spending time with builders and getting a closer look at what teams are working on across the ecosystem. It was a good mix of conversations, working sessions and meeting new faces.

From there we headed to Buenos Aires for [Devconnect](https://devconnect.org), catching up with teams throughout the week. We also partnered with Sonic, Pyth and Gelato for an evening [event](https://luma.com/pghidhv5) in the city that brought all of our communities together in one venue.

We wrapped up the month at Devconnect Buenos Aires, taking part in the sessions and connecting with builders across the ecosystem. Big thanks to all the partners, organisers and teams we met along the way.


## Encode Hackathon: Envio's Winners 

<img src="/blog-assets/dev-update-nov-25-8.png" alt="Encode x Envio hackathon" width="100%"/>

Envio partnered with Encode Club at Encode London 2025 and awarded $3,000 in bounties for builders using HyperIndex and HyperSync. The winners included:


* Best Use of HyperIndex ($1,000) → VeriLoan

* Best Use of HyperSync ($1,000) → Sniffer

* HyperIndex Runner-Up ($500) → TradeTrackr


Congratulations to all the builders who took part and big thanks to the Encode team. For the full breakdown of winners and what they built, check our [blog post](https://docs.envio.dev/blog/encode-london-2025).


## High Performance Indexing on Sonic with HyperSync

<img src="/blog-assets/dev-update-nov-25-9.png" alt="ComparNodes HyperSync Sonic benchmark" width="100%"/> 

Building on Sonic? Envio keeps up.

[Compare Nodes](https://www.comparenodes.com/providers/envio/) recently benchmarked Envio's HyperSync on [Sonic](https://www.soniclabs.com) Mainnet and shared the results publicly. HyperSync provides one of the strongest high performance indexing solutions for Sonic data, backed by real benchmarking results. Their tests scaled from 0 to 1,000 RPC requests per second with full success, and later pushed up to 5,000 requests per second across ten methods. Across two runs they processed around 3.3 million requests in just over thirty minutes! 

For the full performance benchmark and breakdown, check Compare Nodes' original post on [X](https://x.com/CompareNodes/status/1991114058771128655?s=20)



## Tutorial: How to Index Rootstock Data with Envio

<iframe width="560" height="315" src="https://www.youtube.com/embed/72ZO0I4hthU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 


[Rootstock](https://rootstock.io) released a new tutorial walking developers through how to use Envio to capture and organize onchain events from smart contracts deployed on Rootstock. The session covers everything from setting up a local environment to writing mappings, generating entities and querying indexed data. It is part of the Hacktivator program and gives builders a full walkthrough of how to index Rootstock data using Envio.

See Rootstock's original post on [X](https://x.com/rootstock_io/status/1991446212256624989?s=20).


## MetaMask Smart Accounts x Monad x Envio Hackathon Winners

<img src="/blog-assets/dev-update-nov-25-10.png" alt="MetaMask x Envio hack winners #1" width="100%"/>

We partnered with [MetaMask](https://metamask.io/en-GB/developer) and [Monad](https://www.monad.xyz/brand-and-media-kit) for the Smart Accounts hackathon, which featured a total prize pool of $15,000. This hackathon focused on the next generation of wallet and smart account experiences. Builders explored account abstraction, modular execution, AI driven automation and real-time blockchain indexing using Envio.

For the full list of winners and a detailed breakdown of their projects, read our [blog](https://docs.envio.dev/blog/metamask-smart-accounts-hackathon-winners).


## Current & Upcoming Events 

* [MetaMask x Envio: Advanced Permissions Dev Cook-Off Hackathon](https://www.hackquest.io/hackathons/MetaMask-Advanced-Permissions-Dev-Cook-Off): 18th Nov → 31st Dec 2025
* [Solana Breakpoint](https://solana.com/breakpoint): 11th → 13th Dec 2025


## Featured Developer: Kevin Lin

<img src="/blog-assets/dev-update-nov-25-11.png" alt="Featured Dev Kevin Lin" width="100%"/> 

This month's featured dev is Kevin Lin, a Web3 engineer from Taiwan who has been building dashboards and analytics tools across identity, x402 community activity and prediction markets. Kevin uses Envio as the indexing layer across several of his projects.

For [Self Protocol](https://self.xyz), he indexes real-time registration and disclosure actions to help the team track user growth and protocol health. In the x402 ecosystem, he built this epic [PING dashboard](https://ping-analytics-web.vercel.app/), which tracks community engagement around the first major x402-era meme, including new addresses, interaction patterns and Uniswap V3 and V4 liquidity pools. 

His latest project, [PolyPilot](https://polypilot.vercel.app/), is a Polymarket analytics tool that pulls candlestick charts from onchain trades and includes a Market Explorer and Trader Explorer, with more smart money analysis on the way.

Big thanks to Kevin for all his amazing contributions, for being an outstanding member of our community and for everything he continues to build with Envio.

***"What I really like about Envio is that the DX is super smooth. The documentation is excellent, with solid templates and multiple examples, so it's very friendly for vibe coders working on side projects. It also scales nicely from internal dashboards to public products, and lets me focus on what the user sees instead of worrying about indexing infra." - Kevin Lin, Integration Engineer at Self Protocol***

Be sure to follow them on [X](https://x.com/Slutsky___) and check out their work on [GitHub](https://github.com/kevinsslin) to stay up to date with what they are building.


## Playlist of the Month

<img src="/blog-assets/dev-update-nov-25-12.png" alt="PLOTM Nov 2025" width="100%"/> 

[Open Spotify](https://open.spotify.com/playlist/5soTYYQq62La4bssYRdwzH?si=d1e1faa2d3bf44bd)


## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
