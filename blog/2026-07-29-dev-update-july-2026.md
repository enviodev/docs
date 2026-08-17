---
title: Envio Developer Update July 2026
sidebar_label: Envio Developer Update July 2026
slug: /developer-update-july-2026
tags: ["product-updates"]
description: "HyperIndex released four versions from v3.3.0 to v3.4.0, built for huge multichain and factory contract indexers, with unlimited onEvent handlers, a per-chain Effect API, per-entity ClickHouse tuning, and a test framework 12x faster. We released the largest public Polymarket dataset ever, previewed Envio Analytics in alpha, brought Solana indexing to the instruction level, and added three new showcase apps."
image: /blog-assets/dev-update-july-2026.webp
last_update:
  date: 2026-07-29
  author: Jordyn Laurier
authors: ["j_o_r_d_y_s"]
reviewed_by: keenbeen32
---

<img src="/blog-assets/dev-update-july-2026.webp" alt="Cover Image Envio Developer Update July 2026" width="100%"/>

<!--truncate-->

July was a big month for HyperIndex. Four releases took it from v3.2.1 to v3.4.0, built around huge multichain and factory contract indexers, unlimited `onEvent` handlers, per-chain effect caching, and a testing framework that runs 12x faster. We also published the largest public Polymarket dataset ever released, 2.74 billion onchain records free under CC-BY, and began previewing Envio Analytics, an alpha that puts natural-language querying and generated dashboards on top of indexed data.

Alongside that, Solana indexing landed at the instruction level, three new showcase apps went live covering tokenised stocks, Solana DEX activity and Safe multisigs, and we launched a new changelog so every release is tracked in one place.

Let's dive in!

## HyperIndex v3.4.0 & v3.3.0

Four releases this month, from v3.3.0 through to v3.4.0. The theme was scale: large multichain and factory contract indexers, more control over caching and storage, and a much faster feedback loop during development.

### v3.4.0

#### Unlimited `onEvent` Handlers

Previously only a single `onEvent` handler was allowed per event definition, which made it impossible to run different handlers with different filters against the same event. Since v3.4.0 there is no such restriction, so you can handle every ERC20 Transfer in one handler and a USDC-only slice in another.

```typescript
import { indexer } from "envio";

// Track all ERC20 Transfers
indexer.onEvent(
  { contract: "ERC20", event: "Transfer", wildcard: true },
  async ({ event, context }) => {},
);

// And a separate handler for USDC-only is also possible
indexer.onEvent(
  { contract: "ERC20", event: "Transfer", wildcard: true, where: {
      params: [
        { from: USDC_ADDRESS },
        { to: USDC_ADDRESS },
      ],
    },
  },
  async ({ event, context }) => {},
);

// And contractRegister can have a different `where` filter for the same event
indexer.contractRegister(
  { contract: "ERC20", event: "Transfer", wildcard: false /* non-wildcard for contract register */ },
  async ({ event, context }) => {},
);
```

Note that this can result in a single log being processed by different handlers and counted as multiple events in the metric. The same log execution is guaranteed to follow handler registration order inside a file.

#### Per-Entity ClickHouse Tuning

Set partitioning, ordering, and TTL on an entity through the `@storage` directive, so your analytic queries run faster.

```graphql
type Transfer @storage(clickhouse: {
  partitionBy: "toYYYYMM(timestamp)",
  orderBy: ["timestamp"],
  ttl: "timestamp + INTERVAL 2 YEAR"
}) {
  id: ID!
  timestamp: Timestamp!
}
```

Reach out to us for ClickHouse support on [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service).

#### Test Indexer Got 12x Faster

The v3 testing framework now runs as fast as it did before the v3 upgrade, with all the new v3 features on top.

**Indexer tests are now 12x faster.**

If your setup or your agents are not using it yet, the [Testing Guide](https://docs.envio.dev/docs/HyperIndex/testing) is the place to start.

### v3.3.1

v3.3.1 added an `indexer-local-parallel` skill for running multiple indexers locally without collisions, along with reorg threshold handling for indexers with 10M+ addresses, ClickHouse initialisation in replicated mode, and wildcard events always firing a handler even when the same log is consumed by another non-wildcard event.

### v3.3.0

v3.3.0 is built for huge multichain and factory contract indexers, with faster backfill, lower memory usage, better stability, and lower latency at the head.

#### Per-Chain Effect API

The Effect API takes a new `crossChain` option, which controls whether an effect's input is cached and rate-limited globally or separately per chain. It defaults to `true`, a single shared cache across every chain, which suits chain-agnostic calls like token metadata or price by symbol. Set it to `false` and each chain gets its own cache and rate-limit budget, with `context.chain.id` available in the effect handler.

```typescript
// Chain-specific result → crossChain: false, access context.chain.id
const getBalance = createEffect(
  {
    name: "getBalance",
    input: S.string,
    output: S.bigint,
    rateLimit: false,
    crossChain: false,
  },
  async ({ input: account, context }) =>
    rpcFor(context.chain.id).getBalance(account),
);
```

Cross-chain effects can only call other cross-chain effects, since they have no specific chain context, while chain-scoped effects can call either type. Be aware that per-chain effects use a different cache structure, so switching the option requires a cache reset or migration.

Read more in the [Effect API docs](https://docs.envio.dev/docs/HyperIndex/effect-api).

#### Custom HTTP Headers For RPC

Authenticated RPC endpoints now come straight from your config, so bearer tokens and provider auth live alongside everything else with env var interpolation.

```yaml
chains:
  - id: 1
    rpc:
      - url: https://eth-mainnet.your-rpc-provider.com
        for: sync
        headers:
          authorization: "Bearer ${ENVIO_RPC_1_TOKEN}"
```

#### RPC Source Enhancements

The RPC source picked up two capabilities previously only possible with HyperSync: event handlers using an `or` union for `params` filters in `where`, and indexers running multiple `wildcard` events. We also improved how the RPC source handles a provider's response-too-large errors.

#### Nested Env Vars Interpolation In Config

Environment variable interpolation now supports nested fallback values in defaults, so a default can itself reference another environment variable.

See the full [release notes](https://github.com/enviodev/hyperindex/releases)

Star us on [GitHub](https://github.com/enviodev/hyperindex)

## The Largest Public Polymarket Dataset Ever Released

<img src="/blog-assets/dev-update-july-2026-1.webp" alt="The largest public Polymarket dataset ever released" width="100%"/>

We released the complete onchain Polymarket dataset on Hugging Face, free under CC-BY-4.0. It covers every trade, position and payout from the 2020 launch through April 2026, indexed straight off Polygon with HyperIndex.

Most Polymarket datasets stop at trades. This one carries the entire onchain lifecycle, every CLOB fill plus every conditional-token split, merge, redemption and resolution, all the way back to the 2020 AMM era. That is what lets you reconstruct real positions, realised PnL, and exactly who got paid when a market resolved. You can query the whole thing from your terminal with DuckDB without downloading a single file, because it pulls only the byte ranges it needs.

**2.74 billion records, 1.17 billion CLOB trades, $59.9B in lifetime volume, and 2.63 million trader wallets, across 127GB of Parquet.**

None of it is a black box. The open-source indexers that produced it are public, so every number is reproducible from scratch.

Explore the dataset here: [Polymarket onchain dataset on Hugging Face](https://huggingface.co/datasets/moose-code/polymarket-onchain-v1)

## Envio Analytics, Now in Alpha

<div style={{position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden"}}>
  <iframe src="https://www.loom.com/embed/8a0eea55c95d47598f525f9d88497993" title="Envio Analytics alpha demo" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
</div>

An indexer already holds some of the richest, most structured data about a protocol. Once that foundation exists, the next step is making the data easier to explore, question and understand.

We are experimenting with a new analytics feature that combines HyperIndex, ClickHouse as an analytical data store, natural-language querying, and automatically generated charts and dashboards. Co-founder Denham shared a demo interacting with more than 2 billion indexed Polymarket events, asking a simple question: which FIFA World Cup markets have been traded most actively?

The feature is still very much in alpha, but the underlying idea is a powerful one. High-quality indexed data can become an interactive analytics layer for every protocol.

[See original post on X](https://x.com/DenhamPreen/status/2077769360613978504)

## Indexing Solana at the Instruction Level

<img src="/blog-assets/dev-update-july-2026-3.webp" alt="Indexing Solana programs at the instruction level with HyperIndex" width="100%"/>

HyperIndex now indexes Solana programs at the instruction level. You select the programs and instructions you care about, and HyperIndex decodes them, arguments and accounts, using your Anchor IDL or an inline schema, then writes the results to Postgres with an auto-generated GraphQL API.

Inner instructions (CPIs), token balances and balance changes, transaction metadata and program logs are all available. It is powered by [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) for Solana, the same data engine behind our EVM indexing, so historical backfills are fast and you never touch an RPC node for the bulk of indexing. Solana support is still experimental and TypeScript-only, and it is a good time to help shape it, so come and say hello on [Discord](https://discord.gg/envio) if you are building there.

Read the docs: [Solana indexing with HyperIndex](https://docs.envio.dev/docs/HyperIndex/solana)

## Robinhood's Tokenised Stocks Live on v4.xyz

<img src="/blog-assets/dev-update-july-2026-4.webp" alt="Tokenised stocks monitored in real time on v4.xyz" width="100%"/>

Tokenised stocks issued by Robinhood trade around the clock as Uniswap v4 pools, and you can now watch them live at [v4.xyz/stocks](https://v4.xyz/stocks). GME, NVDA and TSLA are priced from onchain swaps, with volume, TVL and trade counts per stock.

**30,771 trades in a single 24 hour window.**

v4.xyz is the central hub for exploring Uniswap V4 hook deployments, pool data and onchain analytics, powered by HyperIndex across 15 chains. The indexer behind it is open source and open to contributions, so you can index Robinhood stocks and much more yourself.

Check it out on GitHub: [the open source Uniswap v4 indexer](https://github.com/enviodev/uniswap-v4-indexer)

More on the showcase page: [v4.xyz on the Envio showcase](https://docs.envio.dev/showcase/v4-xyz)

## Envio vs The Graph

<img src="/blog-assets/dev-update-july-2026-7.webp" alt="Envio vs The Graph" width="100%"/>

A sourced, head-to-head comparison of the two, covering sync speed, handler language, multichain support and reorg handling, then what switching actually involves.

Sync speed is the clearest gap. In the independent Sentio Uniswap V2 Factory benchmark, HyperIndex finished in 8 seconds against 19 minutes for The Graph. On the Sentio LBTC workload it finished in 3 minutes against 3 hours 9 minutes.

**142x faster on the Sentio Uniswap V2 Factory workload.**

Full methodology is on our [benchmarks page](https://docs.envio.dev/docs/HyperIndex/benchmarks), with the raw runs in the [open-indexer-benchmark repo](https://github.com/enviodev/open-indexer-benchmark).

Read the comparison: [Envio vs The Graph](https://docs.envio.dev/blog/envio-vs-the-graph)

## SolSwaps, a Firehose of Solana DEX Activity

<img src="/blog-assets/dev-update-july-2026-5.webp" alt="SolSwaps, a live firehose of Solana DEX activity" width="100%"/>

No RPC, no archive node, no database. SolSwaps streams every DEX swap on Solana into a single live view, covering the network's busiest venues including Jupiter, Pump.fun, Orca and Raydium.

The dashboard tracks swaps per second, estimated SOL moved, aggregated fees, and a running list of the 25 biggest trades as they land, giving traders, researchers and builders a fast picture of where volume is flowing across Solana. It is built entirely on HyperSync, with no infrastructure for you to run.

See it live: [SolSwaps on the Envio showcase](https://docs.envio.dev/showcase/solswaps)

## How to Stream Onchain Events to an AI Trading Agent

<img src="/blog-assets/dev-update-july-2026-9.webp" alt="How to stream onchain events to an AI trading agent" width="100%"/>

Building an AI trading agent? The interesting question is not the model, it is the feed.

An agent needs onchain events fast, structured, and correct through reorgs, and raw RPC gives you none of that out of the box. This guide shows how to wire HyperIndex in as the feed layer, with the schema, queries and reorg handling taken from the published Polymarket reference indexer. It also covers the part that matters most for anything moving money: head-of-chain state is provisional, so act on events from finalised blocks.

Read the full tutorial: [How to stream onchain events to an AI trading agent](https://docs.envio.dev/blog/stream-onchain-events-ai-trading-agent)

## Safescan, One Explorer for Every Safe

<img src="/blog-assets/dev-update-july-2026-6.webp" alt="Safescan, a multichain explorer for Safe multisig wallets" width="100%"/>

Safescan is a multichain explorer purpose-built for Safe multisig wallets. Search by safe address, owner address or transaction hash, and watch creations, proposals, confirmations and executions land live.

Powered by HyperIndex, it indexes Safe wallet creation events, transaction proposals, confirmations and executions across 18 chains in real time and aggregates them into a single interface. At the time of writing it covers more than 5.1 million Safes and 45.7 million executed transactions.

Explore it here: [Safescan on the Envio showcase](https://docs.envio.dev/showcase/safescan)

## How to Build an Open Source RWA Stablecoin Dashboard

<img src="/blog-assets/dev-update-july-2026-10.webp" alt="How to build an open source RWA stablecoin dashboard" width="100%"/>

One event type, all your stablecoin metrics. Total supply, transfer count, transfer amount and volume, mint and burn amounts, and daily snapshots of each, all derived from Transfer events, since mints and burns show up as transfers to and from the zero address. USDT is the exception, so the indexer reads its Issue and Redeem events directly.

The dashboard is backed by a HyperIndex indexer you can run yourself, and the whole thing is open source. Fork it and build your own.

More here: [How to build an open source RWA stablecoin dashboard](https://docs.envio.dev/blog/how-to-build-rwa-dashboard)

## A New Changelog Page

<img src="/blog-assets/dev-update-july-2026-12.webp" alt="The new Envio changelog" width="100%"/>

Our new changelog is live. Every HyperIndex release, feature, fix and improvement is now tracked in one place, so you can see what changed and when without digging through release tags.

Take a look: [the Envio changelog](https://envio.dev/changelog)

## Wildcard Indexing and Topic Filtering

<img src="/blog-assets/dev-update-july-2026-11.webp" alt="Wildcard indexing and topic filtering in HyperIndex" width="100%"/>

Index every ERC20 Transfer onchain without a single contract address. Wildcard indexing matches events by signature rather than by address, so you can capture events from factory-deployed contracts, or from every contract implementing a standard.

Add topic filtering on top to keep only the events you actually want. Both work on HyperSync and RPC.

Learn more here: [Wildcard indexing and topic filtering](https://docs.envio.dev/docs/HyperIndex/wildcard-indexing)

## Stargate's Bus Routes, Visualised

<img src="/blog-assets/dev-update-july-2026-13.webp" alt="A real-time visual of Stargate transfer routes" width="100%"/>

Co-founder Jonjon shared a real-time visual of all the "bus routes" on Stargate Finance, powered by Envio, with Base and Arbitrum comfortably the busiest route.

The distinction it makes visible is a neat one. A taxi transfer leaves immediately, while a bus transfer waits at a stop on the source chain until other transfers board alongside it.

[See original post on X](https://x.com/jonjonclark/status/2079537502902186069)

## Plans, Pricing and Educational Discounts

<img src="/blog-assets/dev-update-july-2026-14.webp" alt="Envio Cloud plans and educational discounts" width="100%"/>

Envio Cloud runs your indexer without you touching infrastructure, from a free Development plan, to Production with static endpoints and zero-downtime deploys, to Dedicated for unlimited scale and a custom SLA.

We also offer educational discounts for students, academic researchers and educational institutions, available for university courses, academic research and non-commercial student projects. Eligibility is verified with a valid academic email or proof of enrolment, and the discount depends on your use case and project scope. Reach out to the team to apply.

For more information, see our [pricing page](https://envio.dev/pricing).

## Migrating From The Graph Without a Rewrite

<img src="/blog-assets/dev-update-july-2026-8.webp" alt="Migrating from The Graph without a rewrite" width="100%"/>

Migrating a subgraph to HyperIndex does not mean starting over. AssemblyScript is a subset of TypeScript, so your event parsing and business logic copy across verbatim, and what changes is mostly the wiring rather than the code doing the work.

Three things change in a well-defined way: `subgraph.yaml` becomes `config.yaml`, your schema sheds the `@entity` decorator, and handlers swap `Entity.save()` for `context.Entity.set()` with async/await. Existing subgraph queries keep working through our [query converter](https://docs.envio.dev/docs/HyperIndex/query-conversion), and the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) diffs entity state between both endpoints before you cut over.

See the side-by-side migration: [the drop-in subgraph replacement walkthrough](https://docs.envio.dev/blog/drop-in-subgraph-replacement)

## Featured Developer: Geauser

<img src="/blog-assets/dev-update-july-2026-15.webp" alt="Featured developer Geauser" width="100%"/>

This month's featured developer is Geauser, a developer and founder currently working on [Umi](https://umi.bot/), a beginner-friendly web-based NFT minting bot. He describes himself as having a renaissance profile, touching a bit of everything rather than just NFTs, though NFTs are where the focus sits right now, and he has been building on HyperSync for around a year and a half.

**What Geauser had to say about Envio:**

> ***"I've been using HyperSync from Envio for almost a year and a half now. It basically solves all my "what happened in the past" problems. What makes HyperSync so great is that I can ask those questions and get answers in milliseconds or seconds rather than minutes. It lets me drastically optimise Umi and run historical analysis across multiple chains without worrying about running my own indexer or dealing with slow archival RPCs that have limited query capabilities. One example: sometimes I need to know if a user minted a particular NFT in a given phase, so I can decide whether to let them mint another one if the collection allows it. With HyperSync, I can check that, in a few hundred milliseconds, which makes my code much cleaner. On top of that, it has wide chain support, so it's perfect for a multichain product like mine. It also lets me run historical analysis, like how Umi performed during a given mint. It's an incredible tool, and I couldn't recommend it enough. You can be sure I'll use Envio in my next ventures as well."***

Well done, Geauser. Be sure to follow him on [X](https://x.com/geauser) and check out his [GitHub](https://github.com/geauser) to stay up to date with his latest developments.

## Playlist of the Month

<img src="/blog-assets/dev-update-july-2026-16.webp" alt="Playlist of the month" width="100%"/>

▶ [Open Spotify](https://open.spotify.com/playlist/5rIdUUbA4jvGWKuI8J6l4T?si=9320cbaddb8543e5)

## Build With Envio

Envio is a multichain EVM blockchain indexer for querying real-time and historical data. If you're working on a Web3 project and want a smoother development process, Envio's got your back(end). Check out our docs, join the community, and let's talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
