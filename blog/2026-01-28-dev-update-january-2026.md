---
title: Envio Developer Update Jannuary 2026
Sidebar_label: Envio Developer Jannuary 2026
slug: /blog/envio-developer-update-january-2026
description: "Envio Developer Update January 2026 covers HyperIndex V3 alpha progress, including a new testing framework, Vitest support, init improvements, and recent ecosystem updates."
---

<img src="/blog-assets/dev-update-jan-26.png" alt="Cover Image Envio Developer Update Jan 2026" width="100%"/>

<!--truncate-->

Over the past month, we’ve continued making steady progress on HyperIndex V3, with a strong focus on improving how developers build, test, and operate indexers day to day.

This update covers the latest V3 alpha features including a new testing framework, Vitest adoption, improvements to envio init, configuration and state access updates, and several quality of life enhancements across the CLI and TUI. We’re also sharing recent ecosystem updates, production migration examples, and highlights from teams building with Envio.

As always, these changes are incremental building blocks toward a more reliable and flexible indexing workflow, from local development through to production.


## HyperIndex V3 (alpha): Exciting Feature Updates 


### 🚨BIG feature alert: New Testing Framework (experimental)

V3 supports testing handler logic using real blockchain data, programmatic debugging, & testing block handlers together with event handlers.

The framework also enables LLM workflows using a TDD approach, supports snapshotting indexer behaviour, & runs multiple tests in parallel using isolated worker threads.


```
import { describe, it, expect } from "vitest"
import { createTestIndexer } from "generated"


describe("Indexer Testing", () => {
  it("Should create accounts from ERC20 Transfer events", async () => {
    const indexer = createTestIndexer();

    expect(
      await indexer.process({
        chains: {
          1: {
            startBlock: 10_861_674,
            endBlock: 10_861_674,
          },
        },
      }),
      "Should find the first mint at block 10_861_674"
    ).toMatchInlineSnapshot(`
      {
        "changes": [
          {
            "Account": {
              "sets": [
                {
                  "balance": -1000000000000000000000000000n,
                  "id": "0x0000000000000000000000000000000000000000",
                },
                {
                  "balance": 1000000000000000000000000000n,
                  "id": "0x41653c7d61609d856f29355e404f310ec4142cfb",
                },
              ],
            },
            "block": 10861674,
            "blockHash": "0x32e4dd857b5b7e756551a00271e44b61dbda0a91db951cf79a3e58adb28f5c09",
            "chainId": 1,
            "eventsProcessed": 1,
          },
        ],
      }
    `);
  }
}   
```



### Vitest - Recommended Testing Framework

V3 recommends Vitest as the testing framework for indexer projects.

It replaces **<code>mocha</code>**, **<code>chai</code>**, and **<code>tsx</code>** with a single package that works out of the box, and supports features like snapshot testing.

All envio init templates have been updated to use Vitest, with tests living directly in src and support for handler specific test files.


```
"scripts": {
- "mocha": "tsc --noEmit && NODE_OPTIONS='--no-warnings --import tsx' mocha --exit test/**/*.ts",
- "test": "pnpm mocha",
+ "test": "vitest run"
},
"devDependencies": {
- "@types/chai": "^4.3.11",    
- "@types/mocha": "10.0.6",
- "chai": "4.3.10",
- "tsx": "4.21.0",
- "mocha": "10.2.0"
+ "vitest": "4.0.16"
}
```



### Envio Init Improvements

V3 improves the **<code>envio init</code>** flow to make project setup quicker and smoother.

The ERC20 template has been updated to be multichain and includes the new testing framework as a reference. New projects can also initialize git automatically.

The improved init flow can include additional setup options from upcoming releases, such as configured GitHub CI and an [AGENTS.md](http://agents.md/) file to support LLM-based development.

<img src="/blog-assets/dev-update-jan-26-1.png" alt="Envio init improvements" width="100%"/>


### Expose Indexer Config & State

V3 introduces the indexer value as a replacement for **<code>getGeneratedByChainId</code>**.

It provides typed chains and contract data from config, along with current indexing state such as **<code>isLive</code>** and **<code>addresses</code>**.

New official types are also introduced:

**<code>Indexer</code>**, **<code>EvmChainId</code>**, **<code>FuelChainId</code>**, **<code>SvmChainId</code>**.

<img src="/blog-assets/dev-update-jan-26-2.png" alt="Expose Indexer Config & State" width="100%"/>

### Automatic Contract Configuration

V3 automatically configures all globally defined contracts.

Globally defined contracts are handled automatically, even when they aren’t linked to a specific chain or address.

<img src="/blog-assets/dev-update-jan-26-3.png" alt="Automatic Contract Configuration" width="100%"/>


### Conditional Event Handlers

V3 allows event handlers to be enabled or disabled conditionally.

You can now return a boolean value from the eventFilters function to control whether a handler runs.

<img src="/blog-assets/dev-update-jan-26-4.png" alt="Conditional Event Handlers" width="100%"/>

### TUI Love

V3 brings updates to the TUI, making it even more beautiful & compact.

It uses fewer resources, shares a link to the Hasura playground, and adjusts dynamically to the terminal width.

<img src="/blog-assets/dev-update-jan-26-5.png" alt="TUI" width="100%"/>

### Envio API Token Required

For indexers using HyperSync as a data source, setting an `ENVI0_API_TOKEN` is now required.

You can learn more about API tokens or create one for free at:

[https://envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) 

Alongside this, HyperIndex V3 also supports using [Podman](https://podman.io/) for local development, in addition to Docker.

This is just the beginning for V3. Many of these features are early building blocks, with loads more improvements, refinements, and additions already in underway.

For a deeper dive into everything included so far, be sure to check out the full release notes. More updates coming soon.

👉 See full [release notes](https://github.com/enviodev/hyperindex/releases)

👉 Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐


## Indexing Data on Injective

<img src="/blog-assets/dev-update-jan-26-6.png" alt="Indexing Data on Injective" width="100%"/>

Envio proudly supports developers and analysts building on [Injective](https://injective.com) by providing efficient access to real-time and historical on-chain data to help teams build robust apps on Injective.

With Envio, teams can sync and query Injective data and define fully customizable indexing logic based on their application needs, without managing indexing infrastructure themselves.


## Migrating Production Subgraphs: Polymarket Indexer

<img src="/blog-assets/dev-update-jan-26-7.png" alt="Polymarket indexer" width="100%"/>

A common question we hear is what migrating a real production subgraph setup actually looks like in practice.

This example shows every Polymarket subgraph migrated into a single Envio indexer, providing a concrete reference for teams looking to consolidate or migrate existing subgraph infrastructure.

The full implementation is available here:

[https://github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer) 

*<span style={{textDecoration: 'underline'}}>⚠️ Note: This example is still a work in progress and under active testing</span>*


## Blockchain Indexer For Application Backends

<img src="/blog-assets/blockchain-indexer-backends.png" alt="Blockchain Indexer asset" width="100%"/>

Indexers are a core part of most application backends, sitting between the blockchain and the app. By transforming raw on-chain data into structured, queryable state, indexing removes a lot of complexity from backend logic and makes applications easier to build and scale as they grow. Envio fits into this workflow by providing a consistent indexing layer teams can use from local development through production, without changing how their backend logic is defined.

For more details, read the full [blog](https://docs.envio.dev/blog/blockchain-indexer-application-backends).


## Envio Powers Funnel with Efficient Data Indexing

<img src="/blog-assets/dev-update-jan-26-9.png" alt="Envio & Funnel" width="100%"/>

[Funnel](https://funnel.markets/) is back after completing a successful backend migration to Envio, which has improved the performance and reliability of the on-chain data powering their application heading into 2026.

Funnel uses Envio as its indexing layer to ingest and query on-chain data used across the app, including data supporting trading views and listings built on Hyperliquid.

The migration gives the Funnel team a more robust and maintainable data pipeline, allowing them to focus on shipping product without managing indexing infrastructure.

See this post on [X](https://x.com/funnel_markets/status/2009670839940329711) for more info.


## 🗓️ Current & Upcoming Events & Hackathons

* [EthDenver - Denver](https://ethdenver.com/): Feb 17th → 21st
* [EthCC - Cannes](https://ethcc.io/): March 30th → April 2nd
* [EthConf - New York](https://ethconf.com/): June 8th → 10th 


## 🧑‍💻 Featured Developer: Zod

<img src="/blog-assets/dev-update-jan-26-10.png" alt="DOTM Jan 2026" width="100%"/>

This month’s featured developer is Zod. They’ve been building for a few decades and working on-chain since 2019. Over the past year, they’ve been actively using tools like Cursor and exploring in-the-loop agentic development.

In August 2024, Zod took over [Scale](https://scale.farm/) from [Equalizer](https://migrate.equalizer.exchange/) and began transforming it into what they describe as a MetaIndex. This concept focuses on generating revenue across DeFi, rather than limiting revenue to V2 pools, to reduce fresh emissions by earning treasury revenue through other protocols such as Aerodrome.

Scale continues to emit its own token and run liquidity, while integrating Manual CL as part of this evolution. 

***“To power our instant-on, data-rich experience across millions of transactions, I need fast, real-time data and deep historical depth with tight latency. I run multiple Envio indexers in parallel with an orchestration layer, which gives us exactly that. Having the full source as a git submodule means I can do deep dives when facing issues, and the team has been super helpful. After previously unhappy experiences with other indexers, Envio has been a massive win.” - Zod, Co-Founder & Lead Developer at Scale***

Well done, Zod. Be sure to check out Scale and follow the team on [X](https://x.com/Scale_Farm) to stay up to date with their latest developments.


## 🎧️ Playlist of the Month

<img src="/blog-assets/dev-update-jan-26-11.png" alt="PLOTM Jan 2026" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/3LismooWdej6nDxwY9486d?si=00ab83ef26874d81)


## 🚢 Ship With Us

Envio is a multi-chain EVM blockchain indexer for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
