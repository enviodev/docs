---
title: Envio & Azuro launch Developer Grant for “Multi-chain Indexer” to power Accelerated Decentralized Betting
sidebar_label: Envio & Azuro launch Developer Grant for “Multi-chain Indexer” to power Accelerated Decentralized Betting
slug: /envio-azuro-developer-grant-multi-chain-indexer
---

<img src="/blog-assets/envio-azuro-developer-grant.png" alt="Azuro Envio Developer Grant Cover Image" width="100%"/>

<!--truncate-->

Envio and Azuro are excited to announce a groundbreaking collaboration that invites all passionate blockchain developers who are interested, to apply for a unique grant opportunity! The premise is simple yet handsomely rewarding:

Build an open-source multi-chain indexer for the Azuro Protocol using the Envio SDK and receive a grant of **$1500 USDC**! 💸

## Grant Overview

Azuro uses subgraphs (indexing framework from TheGraph), to index and organize data from Azuro smart contracts to query specific information about games, conditions, bets, and bet results.

The grant challenge involves migrating/replicating the indexing logic from Azuro’s subgraphs to the Envio SDK. The resulting Envio indexer should match the GraphQL API of the subgraphs as closely as possible, by migrating the schema.graphql file.

A strategic difference that needs to be taken into consideration is that Azuro currently uses an individual subgraph for each chain deployment to index and organize data from the Azuro smart contracts. This means there is an individual GraphQL API for each chain deployment to query Azuro data.

Envio’s multi-chain indexing simplifies this process, by empowering developers with a seamless way to aggregate fragmented data stored across multiple chains into the same database using a single indexer deployment. This capability makes accessing Azuro data on multiple blockchains effortless through a single, unified GraphQL API.

The Azuro open-source multi-chain indexer aims to serve as an alternative endpoint to access and query Azuro’s smart contract data.

### Technical Scope

- The scope of the multi-chain indexer is limited to Gnosis and Polygon production contract deployments.
- The event handlers of the Envio indexer should be written in TypeScript.
- The indexer involves configuring schema.graphql, config.yaml, and handlers.ts files
- Envio SDK version for the indexer should be version 0.0.29 or higher.

## How to Apply for a Grant?

If you are keen to take on this opportunity, you can apply by completing the [Google Form](https://forms.gle/F4FCSiTbrYAgnqsn9).

**Please do not start the grant without approval.**

After completing the Google Form, please allow up to 48 hours for your application to be reviewed. The Envio and Azuro teams will review your application and get in touch with you upon acceptance via the contact details provided in the form.

Upon acceptance:

- You will have up to 4 weeks to complete the grant.
- You will be added to a dedicated private support channel in the Envio Discord for support, questions, and communication with the Envio and Azuro team during the duration of the grant.
- You can fork this [starter kit boilerplate](https://github.com/enviodev/azuro-envio-indexer-boilerplate) to start the grant

Please note:

- Developers with prior subgraph/indexer development experience will be given priority.

## Acceptance criteria

- The resulting code should build and run correctly
- The resulting code should have high code quality (readability, simplicity, comments where necessary)
- The resulting code should have basic tests in place to validate events are being processed correctly
- The resulting code should be accompanied by sample GraphQL queries that touch on every schema entity, which can be listed in README.md
- The resulting code should be in a public GitHub repository with a suitable open-source license recognized by the OSI
- The indexer should be deployed to Envio’s hosted service

Upon project submission, please allow up to 3 working days (72 hours) for reviewing the resulting code. If necessary, some additional time will be agreed upon for corrections.

The grantee will be featured in a case study article and also have the opportunity to talk/ present at a community call (TBC).

## Supporting Guides & Knowledge Material

Azuro’s Production Subgraphs

- Gnosis: https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-gnosis-v3

- Polygon: https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-polygon-v3

Azuro’s Subgraphs Repository:

- https://github.com/Azuro-protocol/Azuro-subgraphs/tree/main/api

Azuro’s Smart Contract Overview:

- https://gem.azuro.org/contracts/overview
- https://gem.azuro.org/contracts/deployment-addresses

Envio’s Developer Docs:

- Envio Installation: https://docs.envio.dev/docs/installation
- Envio Multi-chain indexing: https://docs.envio.dev/docs/multichain-indexing
- Envio Factory Contracts: https://docs.envio.dev/docs/dynamic-contracts
- Envio’s Hosted Service: https://docs.envio.dev/docs/hosted-service

The grantee will be added to a dedicated private support channel in the Envio Discord for support, questions, and communication with the Envio and Azuro team during the duration of the grant.

## About Azuro

Azuro is a pioneering platform revolutionizing decentralized betting with elements like Prediction Markets, NFTs, and DAO governance. The Liquidity Tree design ensures robust market liquidity, providing users with a seamless experience and a user-friendly interface. Azuro's Frontends serve as decentralized alternatives to traditional online betting, prioritizing transparency and responsibility. Their vision is to create a vibrant, cost-effective, and community-driven betting environment, leveraging blockchain technology to empower players and reshape online betting.

[Website](https://azuro.org/) | [X](https://twitter.com/azuroprotocol) | [Discord](https://discord.com/invite/azuro) | [Medium](https://azuroprotocol.medium.com/) | [GitHub](https://github.com/Azuro-protocol)

## About Envio

Envio is a dev-friendly, speed-optimized, modern multi-chain EVM blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio is the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Hey](https://hey.xyz/u/envio) | [Medium](https://medium.com/@Envio_Indexer) | [GitHub](https://github.com/enviodev) |  [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
