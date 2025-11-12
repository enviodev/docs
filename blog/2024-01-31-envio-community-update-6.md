---
title: Envio Developer Update January 2024
sidebar_label: Envio Developer Update January 2024
slug: /envio-developer-community-update-no-6
description: "Dive into Envio’s first update of 2024 including new Async-Mode features, 11 new HyperSync networks, the Jarvis integration and our latest developer release milestones."
---

<img src="/blog-assets/envio-developer-community-update-6.png" alt="Cover Image Envio Developer Community Update No.6" width="100%"/>

<!--truncate-->

Great to have you back for our sixth community update and our first one of 2024! Just like the previous updates, we're thrilled to give you an insider's peek into the latest and greatest adventures of what the Envio team has been shipping over the past month.

Notable feature updates include ‘Async Mode’ which eliminates the need for users to add `required_entities` to their config to access them in their loaders. Developers can now define 'Async Mode' to execute custom effects in event handlers, bolt-on async queries like smart contract view functions or fetching data from IPFS. Async mode enables developers to write handlers without loaders, loading directly from within the handler. Chain IDs are now also accessible inside the event handler context (see the technical overview below for more details).

### New HyperSync Networks ⚡

We’re also excited to announce that Envio [HyperSync](https://docs.envio.dev/docs/HyperIndex/overview-hypersync) has added even more significant updates to existing networks and added new and enhanced indexing support for developers building on [Base](https://base.org/) Sepolia, [Optimism](https://www.optimism.io/) Sepolia, [Arbitrum Nova](https://arbitrum.io/anytrust), [Aurora](https://aurora.dev/), Aurora Testnet, [Harmony](https://www.harmony.one/), [ZORA](https://zora.co/), [Public Goods Network](https://publicgoods.network/), [C1 Milkomeda](https://docs.milkomeda.com/cardano/for-developers/overview/), [Flare](https://flare.network/) and [Mantle](https://www.mantle.xyz/) with many more in the pipeline.

For a full list of currently supported chains on HyperSync visit our [docs](https://docs.envio.dev/docs/hypersync).

We’re also incredibly pleased to announce that Envio has been officially listed on the official [Avalanche](https://core.app/discover/project/envio/), [Evmos](https://docs.evmos.org/develop/graphs-indexers), [Celo](https://docs.celo.org/showcase?name=envio), [OKTC](https://www.okx.com/x1/ecosystem) and [Fantom](https://projects.fantom.network/project-detail/659d30f061eefaad12a2bea8) ecosystems as one of the best blockchain indexing solutions for developers building on their networks.

### Case Study: Jarvis Network 📈

In addition, we’re incredibly thrilled to announce that [Jarvis Network](https://jarvis.network/) has integrated Envio and our multi-chain indexing capabilities to streamline their process of accessing and aggregating real-world asset price data secured by [Chainlink’s](https://chain.link/) industry-leading price data feeds across various blockchain networks, including [Polygon](https://polygon.technology/), [Optimism](https://www.optimism.io/), [BNB](https://www.binance.com/), and [Arbitrum](https://arbitrum.io/).

Learn more [here](https://docs.envio.dev/blog/envio-empowers-jarvis-network).

### Upcoming Events ⭐

- **[ETHDenver](https://www.ethdenver.com/): 23rd of February - 3rd March 2024**

### Technical Overview 🏗️

**Current release:** v0.0.29 **🚀**

Over the past month, we released three new versions of Envio (v.0.0.27 → v.0.0.29).

### What's changed:

### v0.0.27

Changes:

- Async handlers allow the fetching or processing of data asynchronously when required. This allows data to be fetched from IPFS, or other contract states to be examined that aren't available in the event.
- We have made the conversion from synchronous to asynchronous handlers extremely easy:
- add `isAsync: true` to the config of any event you want to be asynchronous.
- make the handler function a promise, and `await` any `get` calls on the context since they are promises too in async mode.
- Other notes:
- You cannot have async and sync handlers for the same event.
- Async handlers are potentially less performant than synchronous handlers, so use them only when you need to.
- Async handlers allow 'loaderless' handlers, so you can directly interact with the database. This has some performance costs but is a benefit to users.

**User Experience and Logging Enhancements:**

- Improved user log labels for better clarity for debugging and in the hosted service.
- Added more context to user logs for future UI that can enable future UI improvements.
- Other formatting improvements such as changing `from` to `fromBlock` and `to` to `toBlock` for consistency between logs.

**Contract Import and Error Handling:**

- requiredEntities is optional for all handlers, and when omitted all entities will be available in your handlers.
- Handled params named `id` during contract import process, fixed tests, and removed unused imports.
- Supported nameless params in contract import for flexibility.
- Updated and aligned error codes with documentation for consistency.

**Network and Blockchain Enhancements:**

- Expanded HyperSync support by adding 11 new networks!
- Improved integration tests to ensure new chains work correctly.

**General Improvements and Fixes:**

- Updated entity fields and event parameters to always be uncapitalized for consistency.
- Fixed various tests to ensure reliability.
- Added Chain ID to the event as per documentation, essential for multi-chain indexing. It was a bug that it was omitted.

**Dependency Updates:**

- Updated multiple dependencies across various scenarios and components for security and performance.

### v0.0.28

**Changes:**

- Small patch release fixing issues with contract import of contracts with an event param ID.
- Events with a param name of ID no longer break the contract import functionality, by making the entities param have the name `event_id`.
- Small re-wording to some user-facing logs to make them clearer.

### V0.0.29

**Changes:**

- GraphQL Engine Non-Root Mode: Enhanced security by running the GraphQL engine as a non-root user.
- Improved Logging: More informative logging for fetchers catching up with the chain head.
- NPM Package Installation Ease: Users can now install npm packages in their indexer without the `-w` flag.

**Enhancements and Fixes:**

- Fixed spelling errors in codgen template files.
- Updated error messages for better clarity.
- Fix bug for allowing contract import of contracts with empty tests, and associated testing.
- Updated the Greeter template with fixes and improvements.
- Improved error messages for missing handler or loader specifications.
- Added shamefully-hoist to .npmrc to avoid issues experienced on some setups with generated folder dependencies.
- Resolved issues with contract imports and ABI source descriptors.
- Corrected TypeScript import errors and standardized naming conventions.

Stay tuned for more monthly updates and hop in our Discord for more up-to-date information.

### Ship with us. 🚢

By builders, for builders. [Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio serves as the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
