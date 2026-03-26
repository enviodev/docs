---
title: Envio Developer Update March 2026
sidebar_label: Envio Developer Update March 2026
slug: /envio-developer-update-march-2026
description: "Envio Developer Update March 2026: HyperIndex alpha.15-19, agentic indexing workflows, subgraph hosting, ecosystem highlights, and upcoming events."
image: /blog-assets/dev-update-march-2026.png
---

<img src="/blog-assets/dev-update-march-2026.png" alt="Cover Image Envio Developer Update March 2026" width="100%"/>

<!--truncate-->

March saw continued progress across HyperIndex, tooling, and the wider Envio ecosystem. We shipped multiple alpha releases focused on improving scale, flexibility, testing, and observability, alongside new workflows that make it easier to go from idea to production-ready indexers.

Alongside this, we introduced updates across subgraph hosting, agentic indexing workflows, and new ways to explore and interact with prediction market data. Across the ecosystem, we saw strong developer contributions, new projects being built with Envio, and continued momentum leading into upcoming events.

Let's dive in!

## 💻 Alpha Releases: Alpha.15 -> Alpha.19

Loads of exciting progress landed across the latest alpha releases this month. This stretch focused on improving scale, flexibility, testing, and the overall developer experience across HyperIndex, with a mix of new features, internal improvements, and important updates to observability.

### Alpha.15

#### 🔍 New getWhere operators: <code>_gte</code>, <code>_lte</code>, <code>_in</code>

Three new filter operators have been added for getWhere queries, following Hasura-style conventions:

```
context.Entity.getWhere({ amount: { _gte: 100n } })
context.Entity.getWhere({ amount: { _lte: 500n } })
context.Entity.getWhere({ status: { _in: ["active", "pending"] } })
```

#### 👨‍🚒 Support double handler registration

Allows double handler registration for the same event with similar filters:

```
import { ERC20 } from "generated";

ERC20.Transfer.handler(async ({ event, context }) => {
  // Your logic here
});

ERC20.Transfer.handler(async ({ event, context }) => {
  // And here
});
```

#### 🤖 Other improvements

We consistently improve HyperIndex to make it easier to contribute to for both humans and AI. Recent work includes:

* Restructuring HyperIndex into a pnpm workspace
* Moving tests from mocha/chai to vitest
* Reworking the CI pipeline to run faster and reuse the production artifact for both testing and publishing
* Developing a highly customisable internal testing framework so AI can create reproduction tests for tricky edge cases

### Alpha.18

#### ⚡ Support indexers with 2.1B+ events per chain

Scale indexers approaching int32 limits. Now you can build even larger, more performant indexers with HyperIndex.

#### 🚨 Breaking: Official <code>/metrics</code> endpoint

Existing Prometheus metrics just got a major upgrade.

We cleaned up metric names and measured data, switched time units to seconds instead of milliseconds, and started following Prometheus naming conventions more closely.

We also added metrics for data points previously covered by the `--bench` feature.

Starting with v3.0.0, Prometheus metrics are no longer experimental. The `/metrics` endpoint now follows semver and will be documented.

For more information and to stay up to date with all current and past releases, be sure to check out our release notes below.

👉 See full [release notes](https://github.com/enviodev/hyperindex/releases)  
👉 Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐

## Agentic blockchain indexing with Envio

<img src="/blog-assets/dev-update-march-2026-1.png" alt="Agentic blockchain indexing with Envio" width="100%"/>

We explored what it looks like to go from prompt to production-ready indexers using Envio.

This walkthrough shows how to scaffold an indexer for any EVM-compatible chain, push it to GitHub, and deploy it to Envio's Cloud (previously Hosted Service) without manually touching a config file.

As an example, **400,000+ wstETH events were indexed on Monad in ~20 seconds.**

Use the following command to scaffold your indexer:

```
pnpx envio@3.0.0-alpha.18 init template -t erc20 -l typescript -d ./my-indexer --api-token ""
```

Learn more in our blog and test it yourself here: [https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex)

## Host your subgraphs on Envio

<img src="/blog-assets/dev-update-march-2026-2.png" alt="Host your subgraphs on Envio" width="100%"/>

Deploy and host your subgraphs with HyperIndex, with a fully subgraph-compatible GraphQL endpoint and no client changes required.

Migrate your existing subgraphs and keep the same API, with faster sync, quicker backfills, and deployments live in less than a day.

The process is handled end-to-end, converting your subgraph to HyperIndex and getting it up and running without needing to manage infrastructure.

Learn more here: [https://envio.dev/pricing/subgraphs](https://envio.dev/pricing/subgraphs)  
Get started on Discord - open a support ticket: [https://discord.com/invite/envio](https://discord.com/invite/envio)

## Heatbook: Polymarket Orderbooks as Heatmaps

<img src="/blog-assets/dev-update-march-2026-3.png" alt="Heatbook" width="100%"/>

An interface for visualising Polymarket orderbooks using historical heatmaps. Orderbook heatmaps for prediction markets, with 115M+ fills visualised. View any market and explore activity over time.

Supports [Polymarket](https://polymarket.com/predictions/all), [Limitless](https://limitless.exchange/markets), and more soon.

More here: [https://heatbook.xyz/](https://heatbook.xyz/)  
See original post: [https://x.com/jonjonclark/status/2031016707309949042?s=20](https://x.com/jonjonclark/status/2031016707309949042?s=20)

## EthCC[9]: Sapphire Sponsor

<img src="/blog-assets/dev-update-march-2026-4.png" alt="EthCC sponsorship" width="100%"/>

Envio is a Sapphire sponsor of [EthCC](https://ethcc.io)[9], taking place at Palais des Festivals in Cannes from March 30 to April 2, 2026.

EthCC is an annual Ethereum community conference bringing together developers, researchers, and teams from across the ecosystem.

The team will be there across the week. Catch our [talk](https://ethcc.io/speakers/jonjon-clark) on the Monroe stage and swing by our booth - let's chat about your data needs.

P.S. be sure to get your hands on one of our snazzy Envio caps and stickers.

## Developer contributions: Uniswap CCA indexer

<img src="/blog-assets/dev-update-march-2026-5.png" alt="Uniswap CCA indexer" width="100%"/>

Check out this Uniswap CCA indexer built with HyperIndex to index continuous clearing auction contracts across Ethereum, Base, Arbitrum, and Unichain. It tracks auctions, bids, ticks, steps, and checkpoints, using HyperSync for logs and selective RPC reads for derived onchain state.

Shoutout to [@0xdivergence](https://x.com/0xdivergence) for sharing this and building with Envio.

Check it out on GitHub: [https://github.com/dzmbs/uniswap-cca-indexer](https://github.com/dzmbs/uniswap-cca-indexer)  
Original post on X: [https://x.com/0xdivergence/status/1769735600377133273](https://x.com/0xdivergence/status/1769735600377133273)

## Open Indexer Benchmark

We believe tech should speak for itself.

That's why we started working on and maintaining the Open Indexer Benchmark (originally forked from Sentio).

An honest, objective benchmark for blockchain indexers.

We're reopening it to benchmark new use cases and warmly welcome all contributions:  
[https://github.com/enviodev/open-indexer-benchmark](https://github.com/enviodev/open-indexer-benchmark)

## Wonderland CTF

<img src="/blog-assets/dev-update-march-2026-6.png" alt="Wonderland CTF" width="100%"/>

Envio is a proud sponsor of the Wonderland CTF. The event takes place on April 1, 2026, in person at EthCC[9] in Cannes.

Wonderland CTF is a capture-the-flag event featuring Solidity and Aztec Noir challenges, with tracks ranging from beginner to advanced and teams of 1 to 5 members.

Create your team and learn more here: [https://ctf.wonderland.xyz](https://ctf.wonderland.xyz)

## Polymarket Whale Tracker TUI

<img src="/blog-assets/dev-update-march-2026-7.png" alt="Polymarket Whale Tracker TUI" width="100%"/>

We put together a simple whale tracker using HyperSync to track Polymarket whale activity in real time. It follows large traders on Polymarket and surfaces what they're doing as it happens, making it easier to monitor higher-conviction activity without sifting through smaller trades.

Clean, fast, and easy to plug into your workflows.

More here: [https://github.com/enviodev/poly-whale-tracker](https://github.com/enviodev/poly-whale-tracker)

Run:

```
npx poly-whales
```

For a step-by-step guide on how to build your own, see: [https://docs.envio.dev/blog/track-polymarket-trades-hypersync](https://docs.envio.dev/blog/track-polymarket-trades-hypersync)

## Best blockchain indexers in 2026

<img src="/blog-assets/dev-update-march-2026-8.png" alt="Best blockchain indexers in 2026" width="100%"/>

We put together a benchmark-driven comparison of blockchain indexers, looking at how different solutions perform in practice. The guide focuses on how indexers handle real workloads, comparing performance, sync speeds, and overall reliability across different approaches.

It's a practical breakdown of the trade-offs between tools and what to consider when choosing an indexer for your use case.

Learn and compare in our latest blog: [https://docs.envio.dev/blog/best-blockchain-indexers-2026](https://docs.envio.dev/blog/best-blockchain-indexers-2026)

## 🗓️ Current & Upcoming Events & Hackathons

* [EthCC - Cannes](https://ethcc.io/): March 30th -> April 2nd
* [EthConf - New York](https://ethconf.com/): June 8th -> 10th

## 🧑‍💻 Featured Developer: Praveen Matheesha

<img src="/blog-assets/dev-update-march-2026-9.png" alt="Featured developer Praveen Matheesha" width="100%"/>

This month's featured developer is Praveen Matheesha, a developer focused on building advanced onchain analytics infrastructure. He is currently working on [@paralensdotai](https://x.com/paralensdotai), a next-generation blockchain analytics engine designed to extract economic behavior and strategy-level insights from raw blockchain transactions. His focus is on turning complex onchain data into meaningful signals for traders, researchers, and analysts, with a particular interest in transaction-level intelligence, MEV analysis, and understanding the economic intent behind smart contract interactions.

**What Praveen had to say about Envio:**

* "Before discovering Envio, I was building my own EVM indexer from scratch in Rust. I implemented support for chain reorg handling, historical backfilling, batched RPC ingestion, and WebSocket streams for real-time updates. While it worked, a significant amount of time went into building and maintaining the infrastructure layer itself."
* "When I discovered Envio and HyperSync, it immediately stood out as a much more efficient approach. It solves many of the challenges around reliable, high-performance blockchain data access that developers often end up rebuilding from scratch."
* "If I had found it earlier, I likely could have saved weeks of work and focused more on the actual analytics and business logic rather than the ingestion pipeline."
* "I also wrote a detailed [article](https://medium.com/@hpraveenmatheesha/building-a-production-ready-evm-indexer-in-rust-a-complete-guide-part-01-246d91bfd910) about building a production-ready EVM indexer in Rust, where I mentioned Envio as a great option for developers who want to avoid spending weeks building indexing infrastructure themselves."
* "Overall, HyperSync makes it significantly easier to work with large volumes of on-chain data and allows developers to focus on building insights and applications instead of reinventing core data infrastructure."

Well done, Praveen. Be sure to follow the team on [X](https://x.com/hpmszk) and check out their [GitHub](https://github.com/matheeshame) to stay up to date with their latest developments.

## 🎧️ Playlist of the Month

<img src="/blog-assets/dev-update-march-2026-10.png" alt="Playlist of the month" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/240pHTCbwvf6kBMdfWGmw9?si=bb40d616e82a49f3)

## Build with Envio

Envio is a multi-chain EVM blockchain indexer for querying real-time and historical data. If you're working on a Web3 project and want a smoother development process, Envio's got your back(end). Check out our docs, join the community, and let's talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)

---

Author: [Jords](https://x.com/j_o_r_d_y_s)  
Head of Marketing & Operations
