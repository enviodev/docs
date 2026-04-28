---
title: Envio Developer Update April 2026
sidebar_label: Envio Developer Update April 2026
slug: /envio-developer-update-april-2026
tags: ["product-updates"]
description: "Envio's April 2026 developer update covering HyperIndex v3 alpha.21 with experimental ClickHouse Sink, the Envio Docs MCP Server, Quickstart with AI guide, Polymarket V2 indexer, Monad traces on HyperSync, Tempo support, and EthCC[9]."
image: /blog-assets/dev-update-april-2026.png
last_update:
  date: 2026-04-28
  author: Jords
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/dev-update-april-2026.png" alt="Cover Image Envio Developer Update April 2026" width="100%"/>

<!--truncate-->

April was a big step forward for AI-assisted indexing on Envio. We launched the Envio Docs MCP Server and a new Quickstart with AI guide for building or migrating indexers with Claude, Cursor, and other AI coding assistants. HyperIndex v3.0.0 alpha.21 ships with an experimental ClickHouse Sink, improved multiple data-sources support, and an updated testing framework with three ways to feed events. We also released the Polymarket V2 Indexer, which is now powering a new data-driven series breaking down the actual top-PnL traders on Polymarket. HyperSync added Monad trace support with full history from block 0, Envio went live on Tempo, and much more. The team was also at EthCC[9] in Cannes.

Let's dive in.

## HyperIndex v3.0.0 Alpha: alpha.20 & alpha.21

Continuing steady progress on V3 across indexing resilience, testing, analytics, and developer experience.

### Improved Multiple Data-Sources Support

HyperIndex now handles data source switching more intelligently.

After switching to a fallback source, HyperIndex automatically attempts to recover to the primary source 60 seconds later, rather than staying stuck on the fallback until it goes down or the indexer is restarted. The logic for choosing which source to use next has also been improved, alongside stricter enforcement of source usage configured for live mode.

The result: better indexing resilience, less vendor lock-in, and more predictable failover behaviour in production.

### Testing Framework Highlights

Our testing framework has matured with three ways to feed events, making it easier to write tests against the same indexer that runs in production. No database, no Docker, no manual mock wiring.

* Auto-exit: zero config, processes the first block with matching events
* Explicit block range: deterministic CI snapshots
* Simulate: typed synthetic events, no network needed

```typescript
import { describe, it } from "vitest";
import { createTestIndexer } from "generated";

describe("ERC20 indexer", () => {
  it("processes the first block with events", async (t) => {
    const indexer = createTestIndexer();

    const result = await indexer.process({ chains: { 1: {} } });

    // Auto-filled by Vitest on first run, just review and commit
    t.expect(result).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "Transfer": {
              "sets": [
                {
                  "blockNumber": 10861674,
                  "from": "0x0000000000000000000000000000000000000000",
                  "id": "1-10861674-23",
                  "to": "0x41653c7d61609D856f29355E404F310Ec4142Cfb",
                  "transactionHash": "0x4b37d2f343608457ca...",
                  "value": 1000000000000000000000000000n,
                },
              ],
            },
            "block": 10861674,
            "chainId": 1,
            "eventsProcessed": 1,
          },
        ],
      }
    `);
  });
});
```

### Experimental ClickHouse Sink

<img src="/blog-assets/dev-update-april-2026-1.png" alt="Experimental ClickHouse Sink" width="100%"/>

HyperIndex V3 Alpha introduces an experimental ClickHouse Sink. Postgres remains the primary database, with your entity data additionally replicated to ClickHouse for analytics workloads.

ClickHouse is a columnar database built for heavy analytical queries on datasets in the 100s of GBs or TBs, a natural fit for onchain data which can easily reach billions of events for a single token. If your indexer is powering a dashboard, leaderboard, historical chart, or any reporting layer on top of a large dataset, ClickHouse is the right tool for that read path.

Enable it on Envio Cloud by setting four environment variables:

* `ENVIO_CLICKHOUSE_SINK_HOST`
* `ENVIO_CLICKHOUSE_SINK_DATABASE`
* `ENVIO_CLICKHOUSE_SINK_USERNAME`
* `ENVIO_CLICKHOUSE_SINK_PASSWORD`

Currently supported on the Dedicated Plan only, and you need to bring your own ClickHouse instance. Managed ClickHouse is coming to Envio Cloud, fill out [this form](https://forms.gle/P19S7KXYfdHQM8J69) to be one of the first users.

Read the full walkthrough here: [https://docs.envio.dev/blog/clickhouse-sink-hyperindex-v3](https://docs.envio.dev/blog/clickhouse-sink-hyperindex-v3)

See the full [release notes](https://github.com/enviodev/hyperindex/releases).
Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐

## The Top Hundred Polymarket Traders

<img src="/blog-assets/dev-update-april-2026-2.png" alt="The Top Hundred Polymarket Traders" width="100%"/>

We released the Polymarket V2 Indexer this month, a drop-in reference for teams wanting to collect all v2 market data. It covers the new v2 markets end-to-end, designed to scale alongside Polymarket's growth.

Check it out on GitHub: [https://github.com/enviodev/polymarket-v2-indexer](https://github.com/enviodev/polymarket-v2-indexer)

Off the back of the release, we kicked off a data-driven series breaking down the actual top-PnL traders on Polymarket. 2.66 million wallets have traded on the platform, and the top 100 captured $853 million in profit between them. None of them are clicking buttons on a phone app between sips of beer.

Day 1 profiles "Bids On Everything", the wallet ranked #24 by realized PnL with roughly $24 million net profit across 2,698,796 fills, 44,954 simultaneous markets, and 289 active days. The strategy in one sentence: post buy orders on every outcome token of every binary market at every price level, then merge YES + NO pairs for one dollar whenever both fill.

It's a strong example of the kind of analysis you can run when you have full historical and real-time access to v2 market data. Stay tuned for more!

Read the full breakdown: [https://x.com/jonjonclark/status/2049067586046816561?s=20](https://x.com/jonjonclark/status/2049067586046816561?s=20)

## Envio Docs MCP Server

<img src="/blog-assets/dev-update-april-2026-3.png" alt="Envio Docs MCP Server" width="100%"/>

Envio docs now speak AI. Plug your AI coding assistant (Claude Code, Cursor, Copilot, and more) straight into our docs with the new Envio Docs MCP Server.

* Always up-to-date
* Instant accurate context
* Easy setup

The biggest shift in AI workflows isn't better prompts, it's better context, and that's exactly what the MCP Server solves. Your assistant pulls live documentation on demand instead of relying on stale training data.

Setup guide and more here: [https://docs.envio.dev/blog/envio-docs-mcp-server](https://docs.envio.dev/blog/envio-docs-mcp-server)

## Quickstart with AI

<img src="/blog-assets/dev-update-april-2026-4.png" alt="Quickstart with AI" width="100%"/>

Build or migrate an indexer end-to-end using Claude, Cursor, or any other AI coding assistant with our new Quickstart with AI guide.

What's included:

* Live docs via MCP
* Non-interactive init
* Built-in Claude skills
* AI-assisted subgraph migration
* Programmatic deploys via the envio-cloud CLI

This pulls everything together into a single agentic workflow, from scaffolding to deployment, without touching a config file manually.

Get started here: [https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai)

## Concentrated Liquidity on Uniswap v4

<iframe width="560" height="315" src="https://www.youtube.com/embed/UZGtLVQGliE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Envio was a Sapphire sponsor of EthCC[9], held at Palais des Festivals in Cannes from March 30 to April 2, 2026.

JonJon took to the Monroe Stage with his talk "From x*y=k to Ticks: Seeing Concentrated Liquidity on Uniswap v4 in Real Time", walking through the jump from x*y=k to ticks on Uniswap v4, with a real-time visual layer tracking active liquidity and pool behaviour across chains.

Big thanks to the EthCC team, sponsors, organisers, and volunteers for putting on such a great event. Had a great time connecting with some incredible teams and builders across the week, and a special thanks to everyone who swung by our booth.

## Monad Traces Live on HyperSync

<img src="/blog-assets/dev-update-april-2026-5.png" alt="Monad Traces Live on HyperSync" width="100%"/>

Monad traces are live on HyperSync, with full history from block 0.

Stream all Monad trace data in minutes and export it to CSV using our new export tool. Ideal for teams running deep onchain analytics, MEV research, or custom pipelines on top of Monad's execution traces.

Export tool on GitHub: [https://github.com/enviodev/export-monad-traces](https://github.com/enviodev/export-monad-traces)

## Envio is Live on Tempo

<img src="/blog-assets/dev-update-april-2026-6.gif" alt="Envio is Live on Tempo" width="100%"/>

Envio is live on Tempo, the blockchain built for stablecoin payments at scale.

Index and query real-time payment data, build fully customisable data pipelines, and query millions of events up to 2000x faster than traditional RPC.

Easy, fast, and fully customisable.

Original post on X: [https://x.com/i/status/2042577679380013222](https://x.com/i/status/2042577679380013222)

## How to Track Native ETH Transfers Using HyperSync

<img src="/blog-assets/dev-update-april-2026-7.png" alt="How to Track Native ETH Transfers Using HyperSync" width="100%"/>

Tracking native ETH transfers onchain is trickier than ERC-20 transfers. There's no event log to index, so you have to parse traces, which is slow over standard RPC.

Our new tutorial walks through how to use HyperSync's native trace filtering to stream transfers by filtering on `call_type=call` with a value threshold. It includes a full working example using the Node.js client in a Bun project, streaming results until 10 transfers above 0.005 ETH are collected.

HyperSync trace support is currently available on Ethereum, Base, Arbitrum, Gnosis, and Monad.

Read the full tutorial: [https://docs.envio.dev/blog/tracking-native-eth-transfers-hypersync](https://docs.envio.dev/blog/tracking-native-eth-transfers-hypersync)

## Current & Upcoming Events & Hackathons

* [ETHConf - New York](https://ethconf.com/): June 8th -> 10th (sponsoring)

## Featured Developer: Claude

<img src="/blog-assets/dev-update-april-2026-8.png" alt="Featured developer Claude" width="100%"/>

This month's featured developer is Claude.

A shoutout to Anthropic's Claude, who has become a familiar name in the developer community and a strong collaborator for teams building with AI assistants. With the launch of the Envio Docs MCP Server and Quickstart with AI guide this month, we're excited to see how the community continues to build with AI alongside Envio.

More to come.

## Playlist of the Month

<img src="/blog-assets/dev-update-april-2026-9.png" alt="Playlist of the month" width="100%"/>

▶ [Open Spotify](https://open.spotify.com/playlist/240pHTCbwvf6kBMdfWGmw9?si=bb40d616e82a49f3)

## Build With Envio

Envio is a multichain EVM blockchain indexer for querying real-time and historical data. If you're working on a Web3 project and want a smoother development process, Envio's got your back(end). Check out our docs, join the community, and let's talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
