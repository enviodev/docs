---
id: example-reNFT
title: reNFT Contract
sidebar_label: reNFT Contract
slug: /example-reNFT
---

# reNFT Contract

This [repo](https://github.com/enviodev/reNFT-index) contains an example Envio indexer built using TypeScript for the [reNFT contract](https://polygonscan.com/address/0x4e52B73Aa28b7FF84d88eA3A90C0668f46043450) deployed on Polygon.

All of the events from the reNFT contract are indexed as entities and the `EventsSummary` entity is defined to track number of each event that the indexer has indexed.

The indexer has been built using v0.0.21 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/reNFT-index)
1. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
1. Install Envio via `npm i -g envio@v0.0.21`
1. Generate indexing code via `pnpm codegen`
1. Run the indexer via `pnpm dev` (make sure you have Docker running)
1. Stop the indexer via `pnpm envio stop`
