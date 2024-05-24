---
title: Envio Community Update No. 08
sidebar_label: Envio Community Update No. 08
slug: /envio-community-update-no-8
---

<img src="/blog-assets/envio-developer-community-update-8.png" alt="Cover Image Envio Developer Community Update No.8" width="100%"/>

<!--truncate-->

# Envio Community Update No. 08

Welcome back to another juicy community update where we’ll run through some of the latest and greatest activities, features and technical updates that the Envio team has been shipping over March. 🚢

The team has released not one but six new version updates that will certainly turbocharge your overall development experience which can be seen in the technical overview below.

## New HyperSync Network Support ⚡

Excited to announce that Envio [HyperSync](https://docs.envio.dev/docs/overview-hypersync) has added enhanced indexing and contract import support for developers building on [Blast](https://blast.io/en) Mainnet and Blast Sepolia ⚡

To see the full list of currently supported chains on HyperSync visit our [docs](https://docs.envio.dev/docs/hypersync). Please note, that this list is for HyperSync-supported networks only. Envio’s HyperIndex, as the indexing framework, supports any EVM network using RPC. If you would like HyperSync added to a network we don’t support, just let us know!

In addition, we’re very excited to announce that Envio’s HyperSync now provides full support for developers building across ANY Polygon network with our accelerated data query layer providing APIs that bypass traditional RPC for 100x faster syncing of historical data.

Building on Polygon? Check out Envio’s [quickstart tutorial](https://docs.polygon.technology/tools/data/envio/) in the official Polygon developer docs to get started.

To make things even more exciting Envio's hyper-performant indexing solution has also been integrated into Altayer’s tech stack, significantly streamlining the development process by providing a notable enhancement within the [Altlayer](https://altlayer.io/) ecosystem paving the way for a new era of efficiency and performance as one of the best blockchain data indexing solutions on their open and decentralised rollup service. 🚀

## New Feature Alert: Multiple Indexers per GitHub Repository

The hosted service has been updated to allow developers to create multiple indexers per GitHub repository. Previously developers could only create a single indexer per repository, meaning every indexer in an organisation required a new repository for deployment. Now developers with multiple indexers in the same repository can create different indexers on the hosted service for that repository, with each indexer having its own root directory, config file and branch definition. 👩‍💻

To connect a new indexer to an existing repository simply select ‘*+ new indexer*’ on the organisation dashboard page. From there you can connect your repository to a new indexer or configure existing indexers linked to that repository. Selecting connect allows for the creation of a new indexer for that repository. The indexer name must be unique for each indexer created for the repository.

⭐ Note: existing indexers created before this change have the indexer name defaulted to the repository name in line with the previous naming convention, but all new indexers can have any user-defined name.

<img src="/blog-assets/envio-new-feature-multiple-indexers.png" alt="Screenshot of hosted service" width="60%"/>

<img src="/blog-assets/envio-new-feature-multiple-indexer-2.png" alt="Screenshot of hosted service" width="60%"/>

## Proxy HyperRPC

Looking for a fast, cheap, easy RPC? Look no further.

We recently ran an internal hackathon and built Proxy HyperRPC, a local RPC proxy that optionally utilizes HyperSync and HyperRPC. In short,  it’s a local server that accepts RPC requests and maps them into HyperSync requests, eliminating slow heavy payloads travelling over clunky RPC. It allows plug-and-play RPC with the power of HyperSync under the hood. It is feature-rich as unsupported HyperSync requests are ported directly to RPC requests.

P.S. It’s a game changer for Cryo users ([Paradigm](https://www.paradigm.xyz/)) with chunky data capture needs (plus it’s compatible with Mesc). 😉

Check out the GitHub repo and try it yourself [here](https://github.com/enviodev/local-hyperrpc). 👈

## Developer Workshops 🧑‍💻

Missed our previous developer workshops? We got you.

- [Data Indexing on Zetachain](https://www.youtube.com/watch?v=xEsioEpluTA)

## Upcoming Events ⭐

- [DAPPCON24](https://www.dappcon.io/): 21st - 23rd May 2024
- [ETHCC Brussels](https://ethcc.io/) - 8th - 11th July

## Technical Overview 🏗️

Current release: v0.0.37 🚀

Over the past month, we released six new versions of Envio (v.0.0.31 → v.0.0.37).

### What's changed:

### V.0.0.32

**New Features:**

- Introducing Hypersync and contract import support for Blast.
- Optimize your Hypersync experience with our faster hypersync-client event-decoder. Simply set it in your config as event_decoder: hypersync-client or by setting your environment variable USE_HYPERSYNC_CLIENT_DECODER=true.

⭐Note: Once stability is confirmed across all indexer use cases, this will become the default option, allowing you to opt for Viem decoding using event_decoder: viem.

**Changes and Fixes:**

- Improved error logging to provide comprehensive feedback on parsing and decoding issues, ensuring a smoother experience when fetching event ranges.
- Spelling and grammar enhancements in code comments for provided templates... 😅
- Bug fixes enabling support for an optional "removed" field for chains that previously lacked this feature in the event log.

### **V.0.0.33 & V.0.0.34**

We're thrilled to unveil our latest release, featuring a captivating new Terminal UI for visualising indexer progress alongside a few new features and fixes noted in the change log below. 🌟

<img src="/blog-assets/envio-tui.gif" alt="Envio's new CLI look and sync progress bars" width="50%"/> 


⭐Note: We've swiftly addressed a critical race condition bug affecting versions v0.0.30 to v0.0.32, and we highly recommend you upgrade if you are currently using one of these versions.

**Features:**

- **Highlight**: Introducing a new terminal UI for visualising indexer progress! 🌟 Now, tracking your indexer's journey is not only informative but also visually stunning. Keep an eye out for this exciting addition!

⭐Note: you can turn this off by running pnpm start --tui-off or setting env variable TUI_OFF=true)

- **Access Configuration Data**: Handlers can now seamlessly tap into the data stored in config.yaml, making it easier than ever to customise and tailor your experience. 💼🔧
- **Upgrade to ReScript v11**: We've levelled up our tech game with the latest version of ReScript. 💻

**Fixes:**

- **CRITICAL**: 🛑 Race condition bug fixed! Versions v0.0.30 to v0.0.32 are now race condition-free, particularly beneficial for high-volume multi-chain indexers. Upgrade recommended for affected versions to ensure smooth sailing ahead.
- **Database Floats**: 📊 Larger floats are now handled in the database without overflow issues.
- **Minor Tweaks**: We've made adjustments to ensure the order of definitions in generated code remains predictably deterministic, enhancing system stability. ✨
- **Testing Helpers**: Testing helper mock processors now use a default chainId derived from your config rather than defaulting to mainnet. No need to define your chain in the mock processor if mainnet is not part of your config. 🧪
- **Minor patch:** v0.0.34 is out for terminal UIs!
    - Fixed: status bar not turning green when fully synced.

**Breaking Changes:**

- **Unified Handler Syntax:** ReScript and JavaScript handlers now adopt the same syntax as TypeScript handlers. Regardless of the language, use destructured arguments instead of positional arguments for consistency. Refer to your loader and handler using dot syntax, as illustrated below:

```typescript
MyContract.MyEvent.loader({ event, context } => {
    //... loader logic
})
```
```typescript
MyContract.MyEvent.handler({ event, context } => {
    //... handler logic
})
```

Previously, JavaScript handlers and loaders utilised positional arguments:
```typescript
MyContract.MyEvent.handler((event, context) => {
    //... handler logic
})
```

⭐Note: TypeScript's snake_case syntax remains backwards compatible, so `MyContract_MyEvent_handler(({event, context}) => {...` still works but we encourage using dot syntax for consistency.

- **Simplified TypeScript Linked Entity Loader Types:** TypeScript linked entity loader types now remove the extra "loaders" field to align with JavaScript and ReScript types. For example:

```typescript
MyContract_MyEvent_loader(({ event, context }) => {
  context.A.load(event.params.id, {
    loaders: {
      loadB: true,
    },
  });
});
```

Becomes:

```typescript
MyContract.MyEvent.loader(({ event, context }) => {
  context.A.load(event.params.id, {
    loadB: true,
  });
});
```

For further information, refer to our [documentation](https://docs.envio.dev/docs/linked-entity-loaders).

### V.0.0.35

This small patch brought some key enhancements and fixes:

- Upgraded PostgreSQL to v16.
- Improved management of purging generated folders when needed running codegen.
- Improved behaviour of sync status bar in TUI.
- Fixed freezing issue on some environments with the Rescript Format command.

### V.0.0.36 & V.0.0.37

**What's New:**

- New Postgres indexes on "entity" tables now speed up read requests to the database.
- Blast Testnet and Fhenix Testnet are now available.

**Fixes:**

- Fixed contract import in the TypeScript project, resolving issues with incorrectly named entity types.
- Fixed mixed event definition of named and nameless parameters, now normalised to named parameters.

**Small bug fix patch:**

We noticed a casing mismatch for indexers that have entity fields with capital letters in them in Postgres.

**⭐Note: Please upgrade to v0.0.37 if you were affected.**

Got any questions, or have any feedback? We’re all ears! Hop in our [Discord](https://discord.com/invite/gt7yEUZKeB) and let us know, we’d be happy to help and always appreciate feedback of any kind to improve your developer experience.

Stay tuned for more monthly updates by following us on [X](https://twitter.com/envio_indexer) or by hopping into our [Discord](https://discord.com/invite/gt7yEUZKeB) for more up-to-date information.

## Ship with us. 🚢[](https://docs.envio.dev/blog/envio-developer-community-update-no-6#ship-with-us-)

By builders, for builders. [Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio serves as the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)

