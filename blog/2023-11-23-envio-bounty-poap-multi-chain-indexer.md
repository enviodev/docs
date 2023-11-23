---
title: "Envio Bounty Graduate: POAP Multi-chain Envio Indexer"
sidebar_label: 'Envio Bounty Graduate: POAP Multi-chain Envio Indexer'
slug: /envio-bounty-graduate-poap-multi-chain-indexer
---

<img src="/blog-assets/envio-bounty-poap-indexer.png" alt="Cover Image for Envio Bounty Graduate: POAP Multi-chain Indexer" width="100%"/>

<!--truncate-->

We are thrilled to announce significant milestone in our Envio Bounty Program. In the ever-evolving world of blockchain development, the importance of seamless access to on-chain data cannot be overstated. [Envio](https://envio.dev/) recently ran an exciting round of bounties. The first bounty was completed by the very talented "Mogithehurt," who focused on building a multi-chain [POAP](https://poap.xyz/) indexer that indexes the POAP smart contracts, showcasing the true power of Envio's indexing capabilities! ⚡

### User Story

The bounty aimed to address the needs of blockchain developers by providing a solution that allowed them to effortlessly query and access insights related to POAP events. The goal was to enable developers to include this information in their applications through a custom GraphQL API. The user story emphasized the importance of creating a user-friendly and efficient system for obtaining on-chain data.

### Bounty Overview

The core of the bounty project involved building a [POAP](https://poap.xyz/) multi-chain indexer that would index the POAP smart contracts on specific chains, namely [Ethereum Mainnet](https://ethereum.org/en/) and [Gnosis Chain](https://www.gnosis.io/).

The queryable information included in the bounty project encompassed essential aspects of POAP events and collections. The indexer needed to provide insights into the number of POAPs, details of individual POAPs, information on POAP transfers, and identification of holders. The implementation required the creation of a comprehensive GraphQL schema, a well-structured config.yaml file, and the development of indexing logic, with options for implementation in [JavaScript](https://www.javascript.com/), [TypeScript](https://www.typescriptlang.org/), or [Rescript](https://rescript-lang.org/).

#### The Benefit of Hypersync

To ensure optimized performance and a seamless developer experience, the use of Envio’s [HyperSync](https://docs.envio.dev/docs/hypersync) endpoint was recommended instead of JSON-RPC endpoint for blazingly fast retrieval of on-chain data. The Hypersync endpoint is automatically utilized in the Envio Indexer for supported networks such as Ethereum Mainnet and Gnosis. This enables the indexing of all POAP events within minutes, a task that would otherwise require several hours or even days!

#### The Benefit of Multi-chain

Envio's multi-chain feature provides builders with a seamless means of accessing fragmented data across multiple chains. With Envio's multi-chain indexing, builders can specify their event handler to operate against a common schema. In the case of this bounty, it allowed the writing of POAP event data into the same database and accessing the data from the POAP smart contracts on Ethereum Mainnet and Gnosis Chain through a unified [GraphQL](https://graphql.org/) API. For more information on Envio’s multi-chain indexing, you can view it in the Envio docs [here](https://docs.envio.dev/docs/multichain-indexing).

#### From Indexer Development to Indexer Deployment

Our bounty participant “Mogithehurt”, then proceeded to deploy their indexer to Envio’s hosted service by pushing their latest version of the [indexer project](https://github.com/mogithehurt/envio-poap-indexer) to GitHub for deployment. The POAP indexer can now be viewed in Envio’s [Explorer](https://envio.dev/explorer). In essence, Envio offers the easiest way to deploy and host your indexer, handling the entire infrastructure and eliminating worries about complex infrastructure setup and management. This approach allows developers to focus on their application’s core functionality, ensuring a top-tier user experience. For more information on how to deploy an indexer to Envio’s hosted service visit our [docs](https://docs.envio.dev/docs/hosted-service).

### Bounty Reward

Recognizing the value of the task at hand, Envio offered an attractive reward of **$200 in USDC** for the successful completion of the bounty. This not only served as a token of appreciation for the hard work and dedication put into the development but also as an encouragement for contributors to continue participating in future bounties which can be followed in the Envio Discord or [Envio’s Dework](https://app.dework.xyz/envio) profile.

### How to Get Involved?

Envio's bounty program welcomes blockchain developers of all skill levels, offering diverse challenges. Whether you're a seasoned developer seeking intricate tasks or a novice looking to embark on your developer journey, our program provides opportunities tailored to your capabilities.

Envio operates on a first-come, first-served basis, ensuring a fair and transparent allocation of bounties. To stay in the loop and get notified promptly, we encourage developers to hop into our vibrant Discord community, head over to our [bounties💰channel](https://discord.gg/fAuwWq2uXZ), or follow us on [Dework](https://app.dework.xyz/envio) to stay in the loop on all bounty announcements.

For more information on how to claim a bounty click [here](https://x.com/envio_indexer/status/1704136858874052974?s=20).

### About POAP

POAP, or Proof of Attendance Protocol, operates within the Ethereum Virtual Machine (EVM) ecosystem. It offers a decentralized solution for proving event attendance and community engagement through unique non-fungible tokens (NFTs). Participants receive POAP tokens as verifiable proof of their presence at events or within specific communities. Built on Ethereum, POAP promotes transparency, and interoperability with other DApps, and serves as a rewarding incentive for active community involvement. Explore more at [poap.xyz](https://poap.xyz/).

### About Envio

[Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio is the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts. If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further.

Follow Envio on [X](https://twitter.com/envio_indexer) (Formerly Twitter) and/or [Hey](https://hey.xyz/u/envio) (Formerly Lenster) for updates on new features, or jump into our [Discord](https://discord.com/invite/gt7yEUZKeB) for any questions.