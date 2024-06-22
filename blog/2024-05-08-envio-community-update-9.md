---
title: Envio Developer Update April 2024
sidebar_label: Envio Developer Update April 2024
slug: /envio-developer-update-april-2024
---

<img src="/blog-assets/envio-developer-community-update-9.png" alt="Cover Image Envio Developer Community Update No.9" width="100%"/>

<!--truncate-->

Welcome to the latest developer update of April 2024.  Dive into our latest release V.0.0.40 and see what the Envio team has been shipping over the past month including new features and technical updates, upcoming events, developer tutorials and much more. 🚢

## 🚀 New Release: Version 0.0.40 Now Available! 🚀

- New Feature: Add custom indices to your database. (See guide below)
- New Feature: Reference your generated code as a package in your handlers. (See guide below)
- Our fast Hypersync Client Event Decoder now handles string types in events and will be the default event decoder used by the indexer. (To use [Viem](https://viem.sh/) instead, you can set `event_decoder: viem` in your config.yaml file.)
- Fix: Failures on DB migrations now exit with failure code 1.

## Envio HyperSync Expands Support on the Fuel Network

<img src="/blog-assets/envio-partner-fuel.jpeg" alt="Cover Image Envio and Fuel Partnership" width="100%"/>

In addition, we’re excited to announce that Envio has recently fully integrated its Hypersync service on the Fuel Network, a Rollup Operating System purpose-built for Ethereum. Envio’s data infrastructure serves as an accelerated data query layer on top of the Fuel Network allowing application developers and data analysts to easily parse, query, and analyse large datasets on Fuel within seconds! ⚡

Check out [Spark Finance](https://sprk.fi/), the world's fastest on-chain order book built on Fuel VM, is a great case study for utilising Hypersync to present near-instant access to order book information to their traders.

Learn more [here](https://x.com/Sprkfi/status/1777730945853907128).

## New HyperSync Network Support ⚡

We’re excited to announce that Envio [HyperSync](https://docs.envio.dev/docs/HyperIndex/overview-hypersync) has expanded enhanced indexing support for developers building on [Polygon’s](https://polygon.technology/) [Amoy](https://polygon.technology/blog/introducing-the-amoy-testnet-for-polygon-pos) Testnet. ⚡

To see the full list of currently supported chains on HyperSync visit our [docs](https://docs.envio.dev/docs/hypersync).

_⭐Note: This list is for Hypersync-supported networks only. Envio’s HyperIndex, as the indexing framework, supports any EVM network using RPC. If you would like Hypersync added to a network we don’t support, just let us know!_

## Create Custom Indices

Our new exciting feature allows developers to refine an entity and use the `@index` directive on fields they wish to add an index to.

```graphql
type MyEntity {
  id: ID!
  userAddress: String! @index
  tokenAddress: String! @index
}
```

The fields marked with `@index` will now create indices in your database, making querying on these fields much faster.

You can also group fields into one composite index like this:

```graphql
type MyEntity @index(fields: ["userAddress", "tokenAddress"]) {
  id: ID!
  userAddress: String!
  tokenAddress: String!
}
```

This will then create a composite index on both of these fields.

⭐*Note: All `id` fields and `@derivedFrom` fields automatically have indices, so there is no need to add a custom index.*

## Reference Generated Code As a Package

_⭐Note: This is optional and you should be able to continue referencing your generated files as before with no changes._

Previously, you would have to reference the file that gives you handlers and types in your generated folder like this:

```javascript
import { ERC20Contract } from "../generated/src/Handlers.gen";
import { AccountEntity } from "../generated/src/Types.gen";

ERC20Contract.Transfer.handler(({ event, context }) => {...
```

Now you can add your generated code as an optional dependency in your project's package.json like this:

```javascript
{
//... rest of package.json configuration,

"optionalDependencies": {

"generated": "./generated"
}
}
```

From there you can simply reference the functions and types like this:

```javascript
import { ERC20Contract, AccountEntity } from "generated";
ERC20Contract.Transfer.handler(({ event, context }) => {...
```

For handler unit tests, simply import `TestHelpers`:

```javascript
import assert from "assert";

import { TestHelpers, AccountEntity } from "generated";

const { MockDb, ERC20, Addresses } = TestHelpers;

describe("Transfers", () => {

it("Transfer subtracts the from account balance and adds to the to account balance", () => {

//Instantiate a mock DB

const mockDbEmpty = MockDb.createMockDb();

//Get mock addresses from helpers

const userAddress1 = Addresses.mockAddresses[0];

const userAddress2 = Addresses.mockAddresses[1];

//Make a mock entity to set the initial state of the mock db

const mockAccountEntity: AccountEntity = {

id: userAddress1,

balance: 5n,

};
```

## Featured Developer🧑‍💻

<img src="/blog-assets/envio-developer-community-update-9-dev-spotlight.png" alt="Cover Image Envio Developer of the Month Cover" width="100%"/>

This month's featured community member and developer of the month is Valentin Seehausen (AKA valle.xyz) an economist, blockchain developer and smart contact boot camp lead at the [Frankfurt School](https://www.frankfurt-school.de/home/programmes/master). Valentin is an active contributor to our community and a next-level developer who has built three epic indexers using Envio for:

- [TangleSwap](https://www.tangleswap.exchange/), a non-custodial, multi-chain DeFi protocol.
- [Peppy Finance](https://www.peppy.finance/), a decentralized perpetual exchange on [Shimmer](https://shimmer.network/) & [IOTA](https://www.iota.org/).
- [DegenSteaks](https://degen-steaks.vercel.ap/), a prediction market for degens on [Base](https://www.base.org/).

For a full list of deployed indexers visit our [explorer](https://envio.dev/explorer).

Follow Valle on [X](https://twitter.com/V_Seehausen).

## DappCon 2024 Sponsors

<img src="/blog-assets/envio-developer-community-update-9-dappcon.png" alt="Cover Image Envio DappCon 2024 Sponsorship" width="100%"/>

Incredibly excited to announce that Envio has been listed as one of the many proud [sponsors](https://www.dappcon.io/#sponsors) of DappCon 2024! Hosted by [Gnosis](https://www.gnosis.io/) in Berlin, DappCon is an awesome developer conference for [Ethereum](https://ethereum.org/en/) infrastructure and dApps and is a great chance to get your project recognised and to learn from the very best, all while soaking in Berlin’s eclectic atmosphere.

Get your ticket [here](https://www.dappcon.io/#tickets).

## Upcoming Events 🗓️

- [DAPPCON24](https://www.dappcon.io/): 21st - 23rd May, 2024
- [ETHBerlin04](https://visas.ethberlin.org/ethberlin/4/): 24th - 26th May, 2024
- [ETHCC Brussels](https://ethcc.io/): 8th - 11th July, 2024

## Developer Workshops 🧑‍💻

- [Index Smart Contracts on Metis](https://www.youtube.com/watch?v=ZDlL3wQLuGA)

## Developer Tutorials:

**Written Tutorials:**

- LearnWeb3 - [Indexing Greeter contract on Polygon and Linea using Envio](https://learnweb3.io/lessons/indexing-greeter-contract-on-polygon-or-linea-using-envio/)
- LearnWeb3 - [Indexing ERC-20 USDC Token Transfers on Base using Envio's HyperIndex](https://learnweb3.io/lessons/indexing-erc-20-usdc-token-transfers-on-base-using-envios-hyper-index/)
- LearnWeb3 - [Indexing Optimism Bridge deposits using Envio's HyperIndex](https://learnweb3.io/lessons/indexing-optimism-bridge-deposits-using-envios-hyper-index/)

For a full list of written tutorials visit our [docs](https://docs.envio.dev/docs/HyperIndex/overview).

**Envio 101 Video Tutorials:**

- [What is Blockchain Indexing?](https://www.youtube.com/watch?v=cbiiWtxFnMk)
- [How to Set up a Blockchain Indexer | Part 1](https://www.youtube.com/watch?v=LNhaN-Cikis)
- [How to Modify your Blockchain Indexer | Part 2](https://www.youtube.com/watch?v=hO6yHliILNE)
- [How to Index Factory Contracts | Part 3](https://www.youtube.com/watch?v=O6qPXZ6kjYY)
- [Extract Data 100x Faster than RPC | Uniswap V3 Factory Contract | Envio HyperSync Tutorial](https://www.youtube.com/watch?v=S9Z6XkY3aP8)
- [Fetch Every Uniswap V3 Pool Contract on Arbitrum in under 1 min | Envio HyperSync Tutorial](https://www.youtube.com/watch?v=iu_469ELotw)

For a full list of our video tutorials visit our [YouTube](https://www.youtube.com/@envio_indexer).

## Previous Releases 🏗️

⭐Please note our current release is V0.0.40 🚀

Over the past month, we released three new versions of Envio (v.0.0.38 → v.0.0.40).

### **V.0.0.38**

- Visualize your indexer progress easily in our hosted service.

<img src="/blog-assets/envio-developer-community-update-9-hosting-1.png" alt="Screenshot Hosted Service Sync Progress Bars" width="100%"/>

<img src="/blog-assets/envio-developer-community-update-9-hosting-2.png" alt="Screenshot Hosted Service Sync Progress Bars" width="100%"/>

**Fixes:**

- Addressed an issue where the Hypersync client event decoder did not handle address checksumming.

⭐Note: While our Hypersync client event decoder is significantly faster, it remains optional as it currently lacks support for decoding string types in events. We're actively working on implementing this feature, after which it will automatically become the default decoder for the indexer. In the meantime, you can opt-in by adding event_decoder: hypersync-client to your configuration.

### **V.0.0.39**

**Patch updates:**

- New HyperSync support for [Poylgon’s](https://polygon.technology/) [Amoy](https://polygon.technology/blog/introducing-the-amoy-testnet-for-polygon-pos) Testnet.
- Improves crash error logs when deploying to the hosted service & fixes the false error produced by yoga package on the TUI in the instance of an indexer crash.

## Playlist of the month

[Open Spotify](https://open.spotify.com/playlist/5cHTEyusqJKGChzB2NvprZ?si=bdf3b61b428e4a0d&utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post&nd=1&dlsi=3a005ff5d78a435c)

Got any questions, or have any feedback? We’re all ears! Hop in our [Discord](https://discord.com/invite/gt7yEUZKeB) and let us know, we’d be happy to help and always appreciate feedback of any kind to improve your developer experience.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on [X](https://twitter.com/envio_indexer) or hopping into our Discord for more up-to-date information.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post&last_resource_guid=Post%3A06a68369-dd8d-4779-ac94-4994d6a227b5&jwt_token=%7B%7Bjwt_token%7D%7D)

## Ship with us. 🚢

By builders, for builders. [Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio serves as the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionise the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
