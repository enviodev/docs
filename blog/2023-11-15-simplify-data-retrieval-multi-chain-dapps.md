---
title: How Envio Simplifies Data Retrieval for Multichain DApps
sidebar_label: How Envio Simplifies Data Retrieval for Multichain DApps
slug: /how-envio-simplifies-data-retrieval-for-multi-chain-dapps
description: "Learn how blockchain indexers like Envio streamline data retrieval for multichain dApps by indexing smart contracts across networks and providing real-time access through a unified query layer."
---


<img src="/blog-assets/envio-simplifies-data-retrieval-for-multi-chain-dapps.png" alt="Cover Image for Simplifying Data Retrieval for Multi-chain dApps" width="100%"/>

<!--truncate-->

The idea that a single blockchain would dominate the digital assets industry was widely accepted in the early days of Web3. It was common to witness debates among ETH and [Bitcoin](https://bitcoin.org/en/) "maxis" arguing over which chain would prevail in Web3. However, fast-forwarding to the present day, the emergence of new Layer-1 networks, Layer-2 scaling solutions, and application-specific chains (referred to as Layer-3s), have paved the way for a multichain future for Web3. This transition introduced new possibilities for scalability, interoperability, and innovation.

Interoperability, in particular, has created opportunities for projects (incl. blue-chip decentralized applications like [AAVE](https://aave.com/), [Uniswap](https://app.uniswap.org/swap), and [Compound](https://compound.finance/)) to access new markets by deploying dApps across multiple chains. For example, Uniswap is currently operational across over 8+ EVM blockchains, including [Ethereum](https://ethereum.org/en/), [Arbitrum](https://arbitrum.io/), [Optimism](https://www.optimism.io/), [Polygon](https://polygon.technology/), [Base](https://base.org/), [Binance](https://www.binance.com/en), [Avalanche](https://www.avax.network/), and [Celo](https://celo.org/). This deployment strategy demonstrates how dApps can improve user acquisition and profitability by leveraging the benefits of multichain technology.

As the multichain universe takes center stage, there is a growing demand for innovative solutions to efficiently manage data across various blockchain networks. For blockchain developers, dealing with fragmented sets of data across multiple blockchains presents a significant challenge. In the case of the Uniswap example, conventional indexing solutions require developers to create separate indexers and, depending on the approach, host individual databases, for each chain deployment. This method can quickly lead to the proliferation of multiple infrastructure components, resulting in increased operational maintenance and higher costs. Additional logic on the client-side application would also be required to aggregate and consolidate the data.

Builders deploying their dApps across multiple chains are seeking swift and optimized solutions for accessing data dispersed across these networks. This is where multichain indexing comes to the rescue by simplifying complexities and expanding developers' horizons in the Web3 ecosystem. Multichain indexing solutions, like Envio, give builders the option to index and aggregate data across multiple networks into a single database, allowing builders to query all of their data with a unified endpoint.

### How Envio's MultiChain Indexer Simplifies Data Retrieval

Envio is thrilled to unveil its latest multichain indexing feature. This groundbreaking feature heralds a new era in Web3 development, offering builders a seamless way to access fragmented data across multiple chains. With this capability, indexing and accessing data from smart contracts on multiple chains becomes effortless through a unified [GraphQL](https://graphql.org/) API.

To witness the power of this advancement in action, let's explore a practical example using Envio’s [Greeter Contract Tutorial](https://docs.envio.dev/docs/greeter-tutorial) further below.

### Multichain Greeter Contract Example

A Greeter contract is a very simple smart contract that allows a user to write a greeting message on the blockchain and is deployed on both the [Polygon](https://polygon.technology/) and the [Linea](https://linea.xyz/) blockchain, respectively. For this example, we will only look at the `NewGreeting` event.

In the `config.yaml` file, a user would specify the networks, contract specifications and event information to be used in the indexing process.

```yaml
name: Greeter
description: Greeter indexer
#Global contract definitions that must contain all definitions except
#addresses. Now you can share a single handler/abi/event definitions
#for contracts across multiple chains
contracts:
- name: Greeter
abi_file_path: ./abis/greeter-abi.json
handler: ./src/EventHandlers.bs.js
events:
- event: "NewGreeting"
requiredEntities:
- name: "User"
networks:
- id: 137 # Polygon
start_block: 45336336
contracts:
- name: Greeter #A reference to the global contract definition
address: "0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c"
- id: 59144 # Linea
start_block: 367801
contracts:
- name: Greeter #A reference to the global contract definition
address: "0xdEe21B97AB77a16B4b236F952e586cf8408CF32A"
```

The Greeter indexer listens to `NewGreeting` events from both the Polygon and Linea [Greeter contracts](https://docs.linea.build/blog/index-greeter-contract-using-envio) to update the Greeting entity.

Through Envio's multichain indexing, builders can specify their event handler to operate against a common schema. The `schema.graphql` file would look like this:

```graphql
type User {
  id: ID!
  greetings: [String!]!
  latestGreeting: String!
  numberOfGreetings: Int!
}
```

Envio allows users to specify a single handler to process common events across contracts deployed on multiple networks. The code snippet example below uses TypeScript as the preferred language.

```typescript
import {
GreeterContract_NewGreeting_loader,
GreeterContract_NewGreeting_handler,
} from "../generated/src/Handlers.gen";

import { GreetingEntity } *from* "../generated/src/Types.gen";

GreeterContract_NewGreeting_loader(({ event, context }) => {

context.User.load(event.params.user.toString());
...
});

GreeterContract_NewGreeting_handler(({ event, context }) => {
let currentUser = context.User.get(event.params.user);
...

});
```

For a more comprehensive walkthrough on this feature, the documentation can be found [here](https://docs.envio.dev/docs/multichain-indexing).

For a more complicated multichain indexing example, builders are encouraged to explore the [Compound V2 Liquidation Metrics](https://docs.envio.dev/docs/example-liquidation-metrics) indexer, built by Envio’s first successful Grantee as part of the [Envio “Build Bigger. Ship Faster” Program](https://docs.envio.dev/blog/envio-grant-program-now-live).

## Conclusion

By gaining a deep understanding of how multichain indexing works, developers can leverage Envio’s multichain indexing solution for a more streamlined and efficient way for blazing-fast retrieval of data across multiple chains. Whether you're developing DeFi aggregators, cross-chain NFT marketplaces, or any Web3 application that requires data from multiple networks, Envio’s multichain indexing simplifies the development process, enhancing the user experience, and fostering cross-chain interoperability.

## About Envio

[Envio](https://envio.dev) is a fast, developer-friendly blockchain indexer and the fastest, most flexible way to get on-chain data, making real-time data accessible for developers across the Web3 ecosystem.

With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing tools supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.

If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)
