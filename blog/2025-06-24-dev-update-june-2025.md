---
title: Envio Developer Update June 2025
sidebar_label: Envio Developer Update June 2025
slug: /envio-developer-update-june-2025
description: "Catch up on what Envio delivered in June 2025 including new indexer tools, upgraded data pipelines, and expanded network support that simplify multichain development."
---

<img src="/blog-assets/dev-update-june-2025.png" alt="Cover Image Envio Developer Community Update June 2025" width="100%"/>

<!--truncate-->

June, you beauty.

From refining core DX with new helpers and project structure improvements to smarter multi-chain batching and smoother loader behavior, we shipped updates that made indexing with Envio faster, cleaner, and easier to work with.

We also wrapped up Mission 4 with the Monad community, ran another internal hackathon, hit DappCon Berlin, and plenty more. Let’s jump in.


## Latest Releases: v2.22.0 → v2.24.0

*⚠️Note: Current Release is v2.24.0*


### V2.220


Added `context.Entity.getOrCreate` and `context.Entity.getOrThrow` API


```
// Before:
// let pool = await context.Pool.get(poolId);
// if (!pool) {
//  pool = {
//    id: poolId,
//    totalValueLockedETH: 0n
//  }
//  context.Pool.set(pool);
// }
const pool = await context.Pool.getOrCreate({
  id: poolId,
  totalValueLockedETH: 0n
})

// Before:
// const pool = await context.Pool.get(poolId);
// if (!pool) {
//  throw new Error(`Pool with ID ${poolId} is expected.`)
// }
const pool = await context.Pool.getOrThrow(poolId)
// Will throw: Entity 'Pool' with ID '...' is expected to exist.
// Or you can pass a custom message as a second argument:
const pool = await context.Pool.getOrThrow(poolId, `Pool with ID ${poolId} is expected.`)
```


These are additional helpers for DX improvements. Accessible from both handlers and loaders.


### Loaders Consistency

Loaders optimize indexer performance by running twice: first in parallel for all events in the batch, and then just before handler execution to fetch the latest data. While this process remains unchanged, we've made a few improvements:



* If the loader fails on the first run, the error is silently ignored. This can happen if the entity is only available on the second run, so we continue indexing without interruption.

* The HyperIndex test framework now runs the loaders twice to match the actual indexer logic.


Learn more about optimizing database access with loaders in our [docs](https://docs.envio.dev/docs/HyperIndex/loaders).


### Clever Batch Creation for Unordered Multichain Mode

In previous versions, events for Unordered Multichain Mode were batched based on their order on-chain, pulling from all available chains. While this approach worked, it's more efficient for larger indexers relying on loader optimization to batch events from a single chain. This increases the chances of deduplication and batch optimization.

In the latest version, we now prioritize creating processing batches with events from one chain, and only rotate to another chain for the next batch.

Learn more about multi-chain event ordering in our [docs](https://docs.envio.dev/docs/HyperIndex/multichain-indexing#multichain-event-ordering).


### Flexible Project Structure

Previously, to get HyperIndex running, we had a few requirements that limited flexibility and could be confusing:

* It required **<code>pnpm-workspaces.yaml</code>** file
* It required **<code>.npmrc</code>** file with shamefully hoisting dependencies
* It required to have the start script in your **<code>package.json</code>** with <code>ts-<strong>node</strong> <strong>generated</strong>/src/Index.bs.js</code>

With the latest update, none of these are necessary. Feel free to remove them, and instead of using <code>ts-<strong>node</strong> <strong>generated</strong>/src/Index.bs.js</code>, simply replace it with `envio start`.

For more information, view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we’re building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us! ⭐


## Mission 4: Building Visualizers & Dashboards on Monad

<img src="/blog-assets/visualizers-and-dash-monad.png" alt="mission 4" width="100%"/>

As part of Mission 4 with the Monad Developer community, we invited builders to push the limits of real-time dashboards and visualizers on Monad, powered by Envio. The outcome? A wave of standout projects that combined sharp design with serious indexing performance.

Catch the highlights in our [blog](https://docs.envio.dev/blog/how-to-build-visualizers-and-dashboards-on-monad-using-envio).


## Exploring Cross-Chain Arbitrage on Uniswap V4

<img src="/blog-assets/arbitrage-v4.png" alt="v4 arbitrage" width="100%"/>

Curious how much prices diverge across the same Uniswap V4 pools deployed on different chains? One builder tracked ETH/USDC across Ethereum, Base, Arbitrum, and Unichain, building a real-time dashboard that surfaces price discrepancies, trade sizes, and cross-chain spread opportunities as they appear.

[V4](https://www.v4.xyz/) digs into how often mispricings occur, how significant they get, and how quickly they're arbitraged, highlighting the unique challenges of cross-chain arbitrage.

Read more on [X](https://x.com/jonjonclark/status/1936066826149994585 ).


## Internal Hackathon

This month, we wrapped up another internal hackathon. 24 hours, 7 hackers, and a stack of ideas. The goal? Build fast, test new concepts, and push Envio’s tech in new directions.

Take a look at what we shipped by reading this [thread](https://x.com/envio_indexer/status/1929907328163213409).


## How to Index Data on MegaEth Using Envio

<img src="/blog-assets/megaeth.png" alt="index megaeth data" width="100%"/>

When speed is the baseline, precision becomes the edge. Envio proudly supports developers and data analysts building on MegaEth with the most performant real-time indexing stack designed for high-throughput environments. Get fast, reliable access to both real-time and historical data without the usual bottlenecks. 

Learn more about how to efficiently index data on MegaEth in our [blog](https://docs.envio.dev/blog/how-to-index-megaeth-data-using-envio).


## Join Us at Pragma Cannes

<img src="/blog-assets/pragma-jonjon.png" alt="pragma jonjon" width="100%"/>

We’re heading to EthGlobal’s Pragma in Cannes and running a hands-on workshop built for developers. Learn how to easily access, index, and query multi-chain data with Envio.

Still need a ticket? Grab $70 off with our [referral link]( https://ethglobal.com/events/pragma-cannes?ref=JONJONNCE ).


## Analyzing Safe Data in Real-time Using HyperIndex

<img src="/blog-assets/analyzing-safe-data.png" alt="safe data" width="100%"/>


Missed our speaking slot at DappCon? We got you boo! Learn how Envio’s HyperIndex unlocks instant visibility into [Safe](https://safe.global/) transactions, from multisig behavior to governance and fund flows in our [developer workshop](https://www.youtube.com/live/3_5__fpQjKM?t=18381s).



## How to Index Data on Monad Using Envio

<img src="/blog-assets/index-data-on-monad.png" alt="indexing monad" width="100%"/>

Envio is proud to support developers and data analysts building on [Monad](https://www.monad.xyz/) by providing the most efficient and reliable access to real-time and historical data on the Monad network through our modular indexing stack.

Learn more about how to efficiently index data on Monad in our [blog](https://docs.envio.dev/blog/how-to-index-monad-data-using-envio).


## Upcoming Events 🗓️

* WAGMI Sponsors at [EthCC](https://ethcc.io/) Cannes: 30th June → 3rd July 2025
* [Pragma](https://ethglobal.com/events/pragma-cannes) Cannes: July 3rd, 2025
* Devconnect Buenos Aires: 17th → 22nd November 2025


## Featured Developer 🧑‍💻

<img src="/blog-assets/dev-of-the-month-june-2025.png" alt="DOTM June" width="100%"/>

This month’s featured developer is Thalles Passos. He’s a full-stack developer from Brazil who started building professionally at just 17. Thalles began his journey with [Notus Labs](https://notus.team/) and is now working on [Notus API](https://docs.notus.team/docs/guides), where the team is creating a complete suite for account abstraction.

He’s also been an active part of the Envio community, giving thoughtful feedback and pushing our indexing tools in real use cases. 


    ***“Initially, I found Envio's developer experience a bit unusual and wasn't convinced it was the right fit. However, once I gave it a real try, I was absolutely blown away by its speed. What other indexers might take weeks to accomplish, Envio completed in mere days, and that instantly hooked me.***


    ***Their support also truly impressed me. As anyone in web3 knows, getting effective support can be an impossible feat, but Envio completely changed that for me, guiding me through various issues. And as a Brazilian company, where the dollar exchange rate is always a consideration, their pricing structure was incredibly appealing and genuinely surprised us.”*** - *Thalles Passos Full-stack Developer At Notus Labs*

Be sure to follow Thalles on [X](https://x.com/thallescomumh) and check out his work on [GitHub](https://github.com/thallesp) to see what he’s building next.


## Playlist of the Month 🎧️ 

<img src="/blog-assets/june-playlist.png" alt="hjune playlist" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/0YkXxUDzOrUSh2h0eznxu6?si=192e7f80b18e478a)


## Ship With Us 🚢 

Envio is a multi-chain EVM blockchain indexing solution for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)