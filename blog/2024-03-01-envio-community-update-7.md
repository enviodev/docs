---
title: Envio Community Update No. 07
sidebar_label: Envio Community Update No. 07
slug: /envio-community-update-no-7
---

<img src="/blog-assets/envio-developer-community-update-7.jpg" alt="Cover Image Envio Developer Community Update No.7" width="100%"/>

<!--truncate-->

# Envio Community Update No. 07

Greetings developers! We’re excited to be back with our seventh community update and our second one of 2024! As usual, we’ll run through some of the latest activities the Envio team has been up to over the past month, including a detailed look into some features and tech updates.

Notable activities include a double dose of version updates that aim to supercharge your development experience. The team noticed a small regression affecting the [contract import](https://docs.envio.dev/docs/HyperIndex/contract-import) templates, prompting us to roll out two brand-spanking new versions with some exciting additions that can be seen in the technical overview below.

We’re also very excited to announce that [Envio](https://envio.dev/) and [ChainDensity](https://chaindensity.xyz/) are the proud [Gold](https://www.primodata.org/company/envio) and [Bronze](https://www.primodata.org/company/chaindensity) sponsors featured on [Primodata](https://www.primodata.org/), the hub of blockchain data and one of the most comprehensive directories for blockchain data resources on the internet!

## Envio &lt;> Azuro Developer Grant Opportunity 🎰

Envio partnered up with the amazing team at [Azuro](https://azuro.org/) to announce our exciting collaboration that invited blockchain developers from all walks of life to apply for a unique developer grant opportunity! Azuro uses subgraphs (indexing framework from [TheGraph](https://thegraph.com/)), to index and organize data from their smart contracts to query specific information about games, conditions, bets, and bet results.

The challenge involved migrating/replicating the indexing logic from Azuro’s subgraphs to the Envio SDK. The premise is simple yet rewarding: Build an open-source multi-chain indexer for the Azuro Protocol using the Envio SDK and receive a grant of $1500 USDC! 💸

Learn more about the grant opportunity [here](https://docs.envio.dev/blog/envio-azuro-developer-grant-multi-chain-indexer).

## New HyperSync Network Support ⚡[​](https://docs.envio.dev/blog/envio-developer-community-update-no-6#new-hypersync-networks-)

We’re very thrilled to announce that Envio [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) has added even more significant updates to existing networks and added new and enhanced indexing support for developers building on [Arbitrum](https://arbitrum.io/) Sepolia, [Zeta](https://www.zetachain.com/), [RSK](https://rootstock.io/) (Rootstock), [Berachain](https://www.berachain.com/) Artio (testnet), [Shimmer](https://shimmer.network/) and [NeonEVM](https://neonevm.org/) with many more to come!

To see a full list of currently supported chains on HyperSync visit our [docs](https://docs.envio.dev/docs/hypersync).

In addition, we’re very pleased to announce that Envio has also been listed on the official [Arbitrum](https://docs.arbitrum.io/for-devs/third-party-docs/Envio/#envio-examples), [Zeta](https://www.zetachain.com/docs/reference/services/), [Harmony](https://docs.harmony.one/home/developers/tools/envio), and [Metis](https://docs.metis.io/dev/tools/indexers/envio) developer docs as one of the best data indexing solutions including some quickstart tutorials for developers building on their networks. 🚀

## Envio &lt;> Encode Club Bootcamps 👢

Looking to improve your development skills? 👀We’ve partnered with the incredible team from [Encode Club](https://www.encode.club/) to bring you some epic AI and Solidity Bootcamps! ⚡️🦄

**AI Bootcamp:**

Join us for a masterclass in integrating blockchain data into AI to enhance your applications in integrating blockchain data into AI to enhance your projects. 🤖

🗓️Date: 18th Mar, 6 weeks

ℹ️ Apply here: [https://encode.club/ai-bootcamp](https://encode.club/ai-bootcamp)

**Solidity Bootcamp:**

Ready to dive into Smart Contracts with a focus on indexing? Join our [Solidity](https://soliditylang.org/) Bootcamp and be there for our exclusive workshop.

🗓 Date: 11th Mar, 8 weeks

ℹ️ Apply here: [https://www.encode.club/solidity-bootcamps](https://www.encode.club/solidity-bootcamps)

## Tutorials 🍎

Check out our new written and video tutorials! 🧠

- [Indexing OP Bridge Deposits](https://docs.envio.dev/docs/tutorial-op-bridge-deposits) on [Optimism](https://www.optimism.io/) & [Ethereum](https://ethereum.org/) Mainnet (Includes [video tutorial](https://www.youtube.com/watch?v=9U2MTFU9or0))
- [Indexing ERC20 Token Transfers](https://docs.envio.dev/docs/tutorial-erc20-token-transfers) on [Base](https://www.base.org/) (Includes [video tutorial](https://www.youtube.com/watch?v=e1xznmKBLa8))
- [Indexing HRC20 Token Transfers on Harmony using Envio](https://docs.harmony.one/home/developers/tutorials/indexing-hrc20-with-envio)
- [LearnWeb3 - Introduction to Envio](https://learnweb3.io/minis/welcome-to-envio/)

## Developer Workshops 🧑‍💻

Missed our previous developer workshops? We got you.

- [How Envio Supercharges Web3 Data](https://www.youtube.com/watch?v=4E-50YryAWk) - Envio &lt;> [Linea](https://linea.build/) Workshop
- [Data Indexing on Metis with Envio & HyperSync](https://www.youtube.com/watch?v=TZ3CdYYdAB4) - Envio &lt;> [Metis](https://www.metis.io/) Workshop

## Upcoming Events ⭐[​](https://docs.envio.dev/blog/envio-developer-community-update-no-6#upcoming-events-)

- [ETHDenver](https://www.ethdenver.com/): 23rd of February - 3rd March 2024
- [ETHLondon](https://ethglobal.com/events/london2024): 15th - 17th March 2024
- [DAPPCON24](https://www.dappcon.io/): 21st - 23rd May 2024

## Technical Overview 🏗️[​](https://docs.envio.dev/blog/envio-developer-community-update-no-6#technical-overview-%EF%B8%8F)

Current release: v0.0.31 🚀

Over the past month, we released two new versions of Envio (v.0.0.30 → v.0.0.31).

### **What's changed:[​](https://docs.envio.dev/blog/envio-developer-community-update-no-6#whats-changed)**

### **v0.0.30**

Changes:

CLI Enhancements:

- Fixed CLI args printing error message on --help and --version

Metrics on the Go:

- Added hardcoded hypersync API token to track usage metrics.

Logging Upgrade:

- console.log and friends (console.warn, console.error etc) are now powered by [Pino](https://getpino.io/#/), making your logs more accessible and informative in the [hosted service](https://docs.envio.dev/docs/hosted-service).

Performance Boost:

- Introducing optional [Rust](https://www.rust-lang.org/) based event decoding for that extra speed, thanks to the HyperSync client (enabled via [Alloy](https://www.alloy.com/)).

Bug Squashes & Improvements:

- Refined application state structure for better dynamic contract import handling.
- Indexer now halts on errors, ensuring exceptions in async handlers are logged correctly.
- Enhanced error messaging for database write failures.

Breaking Changes:

- Switched from null to undefined for optional fields in [TypeScript](https://www.typescriptlang.org/)/[JavaScript](https://www.javascript.com/).
- Entity name and ID field adjustments for clarity and consistency.
- Soft deprecated subgraph migration, streamlining the codebase.

Code Quality Enhancements:

- Cleaned up codegen and contract import templates.
- Prepared the groundwork for reorg support in upcoming releases.
- Added libssl as a dependency for [Linux](https://www.linux.org/) builds, plus more cleanups.

New Chains:

- [Arbitrum](https://arbitrum.io/) Sepolia
- [Zeta](https://www.zetachain.com/)
- [RSK](https://rootstock.io/) (Rootstock)
- [Berachain](https://www.berachain.com/) Artio (testnet)
- [Neon EVM](https://neonevm.org/)

Migration Guide (See detailed examples at the bottom of the changelog):

- Nullable Fields: Switch your null fields to undefined.
- Entity References: Update your schema and handler code to reflect the new naming conventions.

### **v0.0.31[​](https://docs.envio.dev/blog/envio-developer-community-update-no-6#v0028)**

Changes:

[GraphQL](https://graphql.org/) Enhancements:

- Enums directive support and improved schema validation.

Bug Fixes:

- Addressed a regression affecting one directional ‘derivedFrom’ fields.

Metrics:

- Added [Prometheus](https://prometheus.io/) metrics for the latest fetched height and latest known block height.

Code Quality:

- Standardized string formatting for better readability and some cleanup to the way the schema is parsed and validated.

New Chain Integration:

- [Shimmer EVM](https://shimmer.network/)

## Detailed Migration Guide

Users will need to run <strong><code>rm -rf</code></strong> generated and delete their old generated code.

1. **<span>Nullable Fields in GraphQL Schema</span>**

Issue: If your graphql.schema contains nullable fields, you must now explicitly set them to undefined instead of null in your TypeScript/JavaScript code. This adjustment is a breaking change but aligns with best practices in TypeScript/JavaScript.

**<span>Example Change:</span>**

GraphQL Schema:

```graphql
entity Example {
  exampleField: String
}
```

Before:

```typescript
let exampleEntity: Example = {
  exampleField: null,
};
```

After:

```typescript
let exampleEntity: Example = {
  exampleField: undefined,
};
```

2. **<span >Referencing Other Entities in Your Schema</span>**

Issue: When referencing other entities in your schema, you now need to append \_id to the entity field label in your handler code. This change makes the GraphQL query layer more closely mirror the actual GraphQL schema, moving away from the previous approach that added an 'Object' suffix.

**<span >Example Change:</span>**

GraphQL Schema:

```graphql
entity Example {
  exampleField: String
}
entity Example2 {
  exampleLink: Example!
}
```

Before:

```typescript
let exampleEntity: Example = {
  exampleLink: idForExample,
};
// or
let { exampleLink } = context.Example2.get(example2Id);
```

After:

```typescript
let exampleEntity: Example = {
  exampleLink_id: idForExample,
};
// or
let { exampleLink_id } = context.Example2.get(example2Id);
```

GraphQL Query Layer Change:

Before:

```graphql
{
  Example2 {
    exampleLink
    exampleLinkObject {
      exampleField
    }
  }
}
```

After:

```graphql
{
  Example2 {
    exampleLink_id
    exampleLink {
      exampleField
    }
  }
}
```

If you have any questions or feedback feel free to hop in our [Discord](https://discord.com/invite/gt7yEUZKeB), we’d be happy to help and always appreciate feedback of any kind to improve your developer experience.

Stay tuned for more monthly updates by following us on [X](https://twitter.com/envio_indexer) or by hopping into our Discord for more up-to-date information.

## Ship with us. 🚢[​](https://docs.envio.dev/blog/envio-developer-community-update-no-6#ship-with-us-)

By builders, for builders. [Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio serves as the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
