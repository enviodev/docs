---
id: example-aave-token
title: AAVE Token
sidebar_label: AAVE Token
slug: /example-aave-token
---

# AAVE Token

This [repo](https://github.com/enviodev/aave-token-mainnet-events) contains an example Envio indexer built using TypeScript for the [AAVE Token](https://etherscan.io/address/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9) deployed on Ethereum Mainnet.

All of the events from the AAVE Token contract are indexed as entities and the `EventsSummary` entity is defined to track number of each event that the indexer has indexed.

The indexer has been built using v0.0.21 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/aave-token-mainnet-events)
1. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
1. Install Envio via `npm i -g envio@v0.0.21`
1. Generate indexing code via `pnpm envio codegen`
1. Run the indexer via `pnpm envio dev` (make sure you have Docker running)
1. Stop the indexer via `pnpm envio stop`
