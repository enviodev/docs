---
id: example-onchain-governance
title: On chain governance
sidebar_label: On Chain governance
slug: /example-onchain-governance
---

# On chain governance indexer

This [repo](https://github.com/enviodev/onchain-governance-indexer) contains an example Envio indexer built in TypeScript for indexing events for OpenZeppelin Governance Contract.

The [Gitcoin](https://etherscan.io/address/0x9d4c63565d5618310271bf3f3c01b2954c1d1639) governance contract deployed on Ethereum Mainnet was used to index events related to proposals, delegates, and votecasts.

The indexer was built using Envio's [contract import feature](https://docs.envio.dev/docs/HyperIndex/contract-import). All of the events from the Governance contract are indexed as entities and the `EventsSummary` entity is defined to track number of each event that the indexer has indexed.

The indexer has been built using 0.0.20 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/onchain-governance-indexer)
1. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
1. Install Envio via `npm i -g envio@v0.0.20`
1. Generate indexing code via `pnpm codegen`
1. Run the indexer via `pnpm dev` (make sure you have Docker running)
1. Stop the indexer via `pnpm envio stop`
