---
id: example-liquidation-metrics
title: Compound V2 Liquidation Metrics
sidebar_label: Compound V2 Liquidation Metrics
slug: /example-liquidation-metrics
description: Explore Compound V2 liquidation metrics across multiple chains with Envio.
---

Note: This example is built on version 0.0.21 (current version is >= 0.0.36).

This [repo](https://github.com/enviodev/liquidation-metrics) contains an example Envio indexer built using TypeScript for the Compound V2 forks across multiple chains.

This repo was forked from the [original indexer](https://github.com/JossDuff/liquidation-metrics/) built by Joss Duff, one of Envio's first grantees.

`LiquidateBorrow` event from the pool contracts of below Compound V2 forks are indexed, specifically storing the amount of tokens seized and liquidators.

Addresses of all the pool contracts are stored in the `config.yaml` file.

## Protocols indexed

1. Compound V2 on Ethereum Mainnet
2. Flux Finance on Ethereum Mainnet
3. Iron Bank on Ethereum Mainnet
4. Strike Finance on Ethereum Mainnet
5. Iron Bank on Optimism
6. Sonne Finance on Optimism
7. Benqi Lending on Avalanche C-chain
8. Iron Bank on Avalanche C-chain
9. Venus on BSC

This blockchain indexer has been built using v0.0.21 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/liquidation-metrics)
2. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/HyperIndex/getting-started#prerequisites)
3. Install Envio via `npm i -g envio@v0.0.21`
4. Generate indexing code via `pnpm codegen`
5. Run the indexer via `pnpm dev` (make sure you have Docker running)
6. Stop the indexer via `pnpm envio stop`
