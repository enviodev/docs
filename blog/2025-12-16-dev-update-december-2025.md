---
title: Envio Developer Update December 2025
Sidebar_label: Envio Developer Update December 2025
slug: /blog/dev-update-december-2025
description: "Envio Developer Update December 2025 covering an early look at HyperIndex v3.0.0, early Solana experimentation, Sonic support, Decypted Bytes streams, a USDT0 indexing example, and community updates."
---

<img src="/blog-assets/dev-update-dec-25.png" alt="Cover Image Envio Developer Update Dec 2025" width="100%"/>

<!--truncate-->

As we wrap up the end of the year, December’s developer update shares what’s next for Envio and what we’ve been working on across the product and community.

This month includes an early look at HyperIndex v3.0.0, early experimentation with Solana support, continued support for teams building on Sonic, updates from Decypted Bytes streams, a new USDT0 indexing example, and our featured developer for December, and much more. 

Let’s dive in.


## 🚨 HyperIndex v3.0.0 is Coming

HyperIndex v3.0.0 is an alpha release introducing ESM support with top-level await and automatic handler registration, alongside lower HyperSync latency and faster queries. The release also includes an experimental ClickHouse Sink, cleaner configuration and defaults, and early experimental Solana support, and much more to come.


### CommonJS → ESM

HyperIndex now runs ESM-only.

This unlocks support for modern libraries and enables **top-level await** across handlers, and `envio init` now comes with new templates and an updated `tsconfig.json`.


```
{
  /* For details: https://www.totaltypescript.com/tsconfig-cheat-sheet */
  "compilerOptions": {
    /* Base Options: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    /* For running Envio: */
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,

    /* Code doesn't run in the DOM: */
    "lib": ["es2022"]
  }
}
```



### Top-level await

You can now use top-level await directly in handlers files in HyperIndex V3.

This makes it easy to load things like whitelisted addresses or config from a server instead of hardcoding values into the codebase.


```
import { ERC20 } from "generated";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// THIS IS NEW
const addressesFromServer = await loadWhitelistedAddresses();

ERC20.Transfer.handler(
  async ({ event, context }) => {
    //... your handler logic
  },
  {
 wildcard: true,
 eventFilters: [
      { from: ZERO_ADDRESS, to: addressesFromServer },
      { from: addressesFromServer, to: ZERO_ADDRESS },
    ],
  }
);
```


### src/handlers auto registration

HyperIndex v3 automatically registers handler files from src/handlers. You no longer need to list explicit handler paths in `config.yaml`. Just place your files in src/handlers and they will be picked up automatically.

If you prefer a different structure, you can override this using the handlers option. Explicit handler paths still work as before.

*⚠️ Deprecation: Explicit handler paths are still supported, so no changes are required.*


### Block handler indexers

It is now possible to create indexers using only block handlers. Event handlers are no longer required, and contracts are optional in config.yaml.


### Flexible entity fields

Restrictions on entity field names have been removed. Improvements have also been made to ensure database columns are generated in the same order as they are defined in schema.graphql.



### HyperSync source improvements

Several updates on the HyperSync side reduce latency and unnecessary traffic. These include using server sent events for block updates, more efficient query serialization, and caching for repetitive queries.


### Experimental ClickHouse Sink support

HyperIndex v3 adds experimental ClickHouse Sink support.Postgres remains the primary database. You can additionally sink entities to ClickHouse for restart and reorg resistant workloads.



### Experimental additions: Solana Support

V3 introduces experimental Solana support using RPC as a source. Be sure to check out our [docs](https://docs.envio.dev/docs/HyperIndex/solana) for more information.

Try it out with:


```
pnpx envio@3.0.0-alpha.3 init solana
```


### Cleanups and defaults

Deprecated APIs and legacy options have been removed, defaults have been updated, and Node.js 22 is now the minimum supported version. Internal naming and metrics have also been cleaned up for consistency.


This is just the start, with a lot more to come. Stay tuned! 

👉 See full [release notes](https://github.com/enviodev/hyperindex/releases)

👉 Star us on [GitHub](https://github.com/enviodev/hyperindex) ⭐



## Envio Supports Developers Building on Sonic

<img src="/blog-assets/dev-update-dec-25-1.png" alt="Envio supports Sonic" width="100%"/>

Envio supports developers and analysts building on Sonic by providing access to real-time and historical on-chain data through a reliable indexing layer designed for high-throughput environments.

With Sonic’s fast finality and high transaction volumes, teams need indexing infrastructure that can keep up without adding operational complexity. Envio is built to handle these conditions, allowing developers and analysts to query, monitor, and analyze Sonic data efficiently.

This support makes it easier for teams to build data-heavy applications, analytics dashboards, and monitoring tools on Sonic without having to manage indexing infrastructure themselves.

👉 [Start building on Sonic](https://docs.envio.dev/docs/HyperIndex/sonic)



## Monad Testnet Re-Genesis: Reindex Required for Envio Users

The Monad testnet underwent a full re-genesis, restarting the network from block 1.

For Envio users indexing Monad, this means indexers need to reindex from block 1 now that the refreshed testnet is live. As part of the re-genesis, all existing on-chain state was reset and any deployed contracts needed to be redeployed.

This update removes legacy behaviours from early testnet phases and is expected to reduce state sync time going forward. Teams indexing Monad can continue building against the refreshed testnet.

If you need support reindexing or redeploying after the re-genesis, feel free to reach out to the Envio team in our [Discord](https://discord.gg/RKPAjwUvRr).


## Envio at Solana Breakpoint 2025 in Abu Dhabi

<img src="/blog-assets/dev-update-dec-25-2.png" alt="Solana Breakpoint 2025" width="100%"/>

The Envio team attended [Solana Breakpoint](https://solana.com/breakpoint) in Abu Dhabi this month, spending time with teams across the Solana ecosystem and learning more about their data needs and how they’re building on Solana.

We had a great few days of conversations with builders, protocols, and infrastructure teams, getting a better sense of the tools, patterns, and challenges teams are working through as the ecosystem continues to grow.

Alongside the event, we’ve been experimenting with early, [experimental Solana support](https://docs.envio.dev/docs/HyperIndex/solana) in Envio. These conversations were valuable in helping us better understand Solana use cases and how indexing infrastructure can support developers and analysts building on the network.

Big thanks to everyone we met and spoke with at Solana Breakpoint. We’re looking forward to continuing these conversations as our Solana support evolves. Watch this space.


## Envio Developer Workshops: Decypted Bytes Is Back

<img src="/blog-assets/dev-update-dec-25-3.png" alt="Decrypt Bytes" width="100%"/>

Decypted Bytes streams are back and now running daily at 3:00pm UTC, focused on hands-on developer workflows using Envio.

Recent and upcoming sessions cover practical indexing patterns and data pipelines built with HyperIndex and HyperSync, walking through real examples end-to-end.


#### Recent streams include:

* [Base–Solana Bridge Indexer with HyperIndex](https://www.youtube.com/watch?v=yWfw5gfTibI), showing how to track cross-chain token transfers between Base and Solana

* [DuckDB Sink for HyperSyn](https://www.youtube.com/watch?v=8wNprGmbN24)c, covering how to write indexed blockchain data into DuckDB for local analytics and querying

All stream links, topics, and the full schedule are available via the [Decypted Bytes stream schedule](https://decrypted-bytes.notion.site/2c30f730c03780d8a0a5dfba76689f96?v=2c30f730c03780b7b59b000c65b4467d). Be sure to subscribe to stay up to date with upcoming sessions.


## Envio Adds Support for Tempo

<img src="/blog-assets/dev-update-dec-25-4.png" alt="Envio supports Tempo" width="100%"/>

Envio now supports [Tempo](https://tempo.xyz), giving teams an easier way to index and query data in real-time and build fully customizable data pipelines.

This support makes it simpler for developers to work with Tempo data using [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview), without needing to set up or maintain custom indexing infrastructure. Teams can define their own indexing logic and query patterns while keeping full control over how data flows through their pipelines.

To get started and learn how to index data on Tempo, check out the [setup guide](https://docs.envio.dev/docs/HyperIndex/tempo-testnet) in the Envio docs.


## How to Index Cross-Chain USDT0 Transfers with Envio

<img src="/blog-assets/dev-update-dec-25-5.png" alt="Index USDT0 with Envio" width="100%"/>

Learn how to build a [USDT0](https://usdt0.to) Indexer using Envio by exploring this example repository, which demonstrates how to track USDT0 transfers across multiple chains.

The repository shows how to use Envio and HyperSync to index USDT0 activity across supported networks, providing a practical reference for teams working with cross-chain token flows.

You can explore the full example, code, and setup instructions in the [GitHub repository](https://github.com/enviodev/usdt0-indexer).


## Envio Powers Slab.cash with Efficient Data Indexing

<img src="/blog-assets/dev-update-dec-25-6.png" alt="Slab Cash" width="100%"/>

[Slab.cash](https://slab.cash) recently went live, bringing on-chain collectibles to users.

Envio proudly powers Slab.cash with efficient data indexing, giving the team easy and reliable access to real-time and historical blockchain data so their app can run smoothly as usage grows.

Big congrats to the Slab.cash team on the launch. Be sure to check it out and see what they’ve shipped.



## Getting Started with Envio for the MetaMask Advanced Permissions Hackathon

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/0CeEiNPQRh4"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>


As part of the [MetaMask x Envio Advanced Permissions Hackathon](https://www.hackquest.io/hackathons/MetaMask-Advanced-Permissions-Dev-Cook-Off), we ran a workshop walking developers through how to get started with Envio and how it can be used during the hackathon.

The session covered setting up an indexer, exploring demos and examples, and understanding how Envio can support data needs while building.

The MetaMask Advanced Permissions Hackathon is live and runs until December 31, 2025. If you’re taking part and building with Envio, we’re happy to help support teams throughout the hack.



## 🗓️ Current & Upcoming Events 

* [MetaMask x Envio: Advanced Permissions Dev Cook-Off Hackathon](https://www.hackquest.io/hackathons/MetaMask-Advanced-Permissions-Dev-Cook-Off): 18th Nov → 31st Dec 2025


## 🧑‍💻 Featured Developer: Port

<img src="/blog-assets/dev-update-dec-25-7.png" alt="DOTM Dec 2025" width="100%"/>

This month’s featured developer is Port, a builder who loves experimenting with ideas and shipping fast. His journey into development started a few years ago after a health scare, which pushed him to rethink how he wanted to spend his time. Coming from a non-technical background, he began learning web development through The Odin Project and quickly found his way into Web3.

After discovering Monad, Port became deeply involved in the ecosystem, moving on to Speedrun Ethereum and joining [BuidlGuidl](https://buidlguidl.com). Along the way, he built and contributed to a wide range of open source and community projects, including the block explorer for [Scaffold ETH](https://scaffoldeth.io), [address.vision](https://address.vision), and contributions to [abi.ninja](https://abi.ninja).

Today, Port is part of the Monad devrel team, where he continues to explore what the tech makes possible while building and experimenting whenever he gets the chance. Some of his recent and notable projects include [NFT Snapshot](https://nft-snapshot-beta.vercel.app), [Monad Monitor](https://github.com/portdeveloper/monad-monitor), [Oracle Dashboard](https://oracle-dashboard-seven.vercel.app), [Calculate My PnL](https://calculate-my-pnl.vercel.app), [MonadClip](https://monadclip.fun), [Splait](https://github.com/portdeveloper/splait), [Gulltoppr](https://github.com/portdeveloper/gulltoppr), [ConvertETH](https://github.com/portdeveloper/converteth), [Anvuil](https://github.com/portdeveloper/anvuil), and [Vanitoor](https://github.com/portdeveloper/vanitoor).

***“I had an idea, asked it to Claude, and Claude suggested and built the app with Envio without me interfering at any point. I just added the API key to the env file. It was very easy to build with Envio, and the founders are very responsive so you can just ask them questions about how you should be using it.” - Port, DevRel at Monad***

Be sure to follow them on [X](https://x.com/port_dev) and check out their work on [GitHub](https://github.com/portdeveloper?tab=repositories) to stay up to date with what they are building.


## Merry Xmas from the Envio Team

<img src="/blog-assets/dev-update-dec-25-8.png" alt="Envio Xmas 2025" width="100%"/>

As the year comes to a close, we want to say a big thank you to everyone building with Envio for your contributions, feedback, and continued support throughout the year.

We’re wishing many of you a fantastic time over the festive season. The Envio team will still be fully available throughout the Christmas period, so feel free to reach out if you need support or want to chat about what you’re building.

Merry Xmas from all of us at Envio 🎄


## 🎧️ Playlist of the Month

<img src="/blog-assets/dev-update-dec-25-9.png" alt="PLOTM Dec 2025" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/757HncfHabgU6rpMv9748b?si=94a19e83ccdc4f0d)


## 🚢 Ship With Us

Envio is a multi-chain EVM blockchain indexer for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
