---
title: Envio Developer Update July 2025
sidebar_label: Envio Developer Update July 2025
slug: /envio-developer-update-july-2025
description: "Discover what Envio released in July 2025 including built in cache for effect calls, a one-click indexer generator, internal hackathon highlights, and our Base and Ethereum ecosystem integrations."
---


<img src="/blog-assets/dev-update-july-2025.png" alt="Cover Image Envio Developer Community Update July 2025" width="100%"/>

<!--truncate-->

Welcome to our July Developer Update.

This month, we embraced built-in cache for effect calls, improved loaders, added new testing utilities, and introduced more control over output configuration. We also launched a one-click indexer generator, shipped fresh hacks from our internal hackathon, and kept refining the overall developer experience.

We made stops at EthCC and Pragma Cannes too, catching up with builders from across the space. Let’s dive in!

## Latest Releases: v2.23.0 → v2.26.0

_⚠️Note: Current Release is v2.26.0_

### Built-in Cache for Effect Calls

```
import { experimental_createEffect, S } from "envio";

export const getMetadata = experimental_createEffect(
  {
    name: "getMetadata",
    input: S.string,
    output: {
      description: S.string,
      value: S.bigint,
    },
    cache: true, // Simply set cache to true
  },
  async ({ input, context }) => {}
})
```

Learn more in our [docs](https://docs.envio.dev/docs/HyperIndex/effect-api#persistence) about how to persist the cache on reruns and share it with Hosted Service (alpha).

## V2.23.0

### Embracing loaders

In v2.23.0, we added `context.set`, **<code>context.unsafeDelete</code>**, and **<code>context.getOrCreate</code>** to loaders.

Add **<code>context.isPreload</code>** to distinguish between the first and second loader run. If you are a power user, from now on we recommend going all-in with loaders and keeping your handlers empty.

Learn more in our dedicated loaders [guide](https://docs.envio.dev/docs/HyperIndex/loaders#going-all-in-with-loaders).

For a full list of changes and more information about current and past releases, view the release notes on our [GitHub](https://github.com/enviodev/hyperindex/releases).

Love what we’re building as much as we do and want to stay updated on our latest releases and developments? Give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us! ⭐

## New Feature: Instantly Generate an Indexer from Your Contract Address

<img src="/blog-assets/generate-indexer-contract-address.gif" alt="contract address" width="100%"/>

We’ve refreshed our landing page with a handy new tool. Simply paste your contract address to:

- Get an estimated indexing time
- Receive one command to autogenerate your indexer
- No config files. No guesswork. Just paste and go.

Try it out now by visiting our landing [page](https://envio.dev/).

## Envio Supports Base with Lightning Fast Data Retrieval

<img src="/blog-assets/base-support.png" alt="base support" width="100%"/>

[Base](https://www.base.org/) is booming. Your data should too. Envio’s HyperSync supports Base with the most advanced indexing on the market. Sync historical data in minutes, access it up to 2000x faster than RPC, and query structured logs, traces, events, and functions.

Learn how to index millions of events in Seconds on Base using Envio in this [thread](https://x.com/envio_indexer/status/1943657401506304443).

## Internal Hackathon July 2025

<img src="/blog-assets/internal-hack-turkey.png" alt="internal hack turkey" width="100%"/>

We wrapped up another successful internal hackathon during our team offsite this month. The goal? Build tools that push Envio forward. Some are already live.

We run these every last Thursday of the month, so keep an eye out for more builds. Let us know which one’s your favourite.

Check out this [thread](https://x.com/envio_indexer/status/1950145932516880605) to see what we built in under 24 hours.

## Supercharge Your Ethereum Data With Envio’s HyperSync

<img src="/blog-assets/eth-support.png" alt="eth support" width="100%"/>

[Ethereum](https://ethereum.org/en/) is on fire. ETF inflows are climbing, regulatory clarity is coming, and price action is picking up. The network’s heating up, but can your infrastructure keep up? Envio’s HyperSync lets you index millions of events on Ethereum in seconds. No delays. Just fast, structured access to the data that matters.

Learn how in this [thread](https://x.com/envio_indexer/status/1945849077746327639).

## EthCC & Pragma Cannes 2025 Recap

<img src="/blog-assets/ethcc-pragma.png" alt="ethcc & pragma" width="100%"/>

Yes, we Cannes!

Big shoutout to the [EthCC](https://ethcc.io/) team for an incredible event, and to [ETHGlobal](https://ethglobal.com/) for hosting a packed Pragma. Non-stop energy, great convos, and a stacked builder crowd.

We’re proud to be building alongside some of the sharpest devs and innovators in the space. Huge thanks to everyone who made it happen. Until next time.

Missed our workshop on lightning-fast multi-chain indexing? Catch the replay on [YouTube](https://www.youtube.com/watch?v=-sFCbIVVeRw&list=PLXzKMXK2aHh6jZYPY5-YIBzvMtUT3ajjI).

## Upcoming Events 🗓️

- [Ethereum 10th Anniversary Cape Town](https://lu.ma/ethereum-10y-capetown): → 30th July 2025
- [Devconnect Buenos Aires](https://devconnect.org/): 17th → 22nd November 2025
- [Mobil3 Hackathon Mexico](https://mobil3.xyz/): 20th → 24th August 2025

## Featured Developer 🧑‍💻

<img src="/blog-assets/dev-of-the-month-july-2025.png" alt="july 2025 DOTM" width="100%"/>

This month’s featured developer is Nikhil, a software developer and technical content creator who’s been sharing practical insights with Web3 devs for years. He’s worked with teams like Figment, Celo, and Bitquery, crafting developer-facing content. Nikhil has also contributed as a Solidity developer on smaller DeFi projects and is now focusing on personal projects while exploring new opportunities.

He recently got hands-on with Envio, using our tools live on stream to build a custom database for [Across Protocol](https://x.com/AcrossProtocol). His clear walkthroughs on his YouTube [channel](http://youtube.com/@decryptedbytes) and detailed feedback have helped surface valuable insights and made our tooling more accessible to the wider community.

    ***“I came across Envio through some of the content Jonjon had shared, his projects like [Logtui](https://www.npmjs.com/package/logtui) and [V4](https://www.v4.xyz/), really caught my attention and pushed me to try it out. What I was looking for was a framework that gave me full control and flexibility, and Envio delivers exactly that.***


    ***I’m currently working on a personal project to build an explorer and analytics platform for Across Protocol, so it felt like a good time to dive into Envio. So far, the experience has exceeded expectations. The documentation is solid, it answers almost every question I’ve had while working with it.”*** - *Nikhil, Developer & Web3 Educator*

Be sure to follow Nikhil on [X](https://x.com/nikbhintade) and check out their work on [GitHub](https://github.com/nikbhintade) to see what they’re building next.

## Playlist of the Month 🎧️

<img src="/blog-assets/july-2025-playlist.png" alt="july 2025 playlist" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/1vyctkfc1CrmnVv2dMCrUo?si=84f39e6a4b1d436e)

## Ship With Us 🚢

Envio is a multi-chain EVM blockchain indexing solution for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
