---
id: example-liquidation-metrics
title: Compound V2 Liquidation Metrics
sidebar_label: Compound V2 Liquidation Metrics
slug: /example-liquidation-metrics
---

# Compound V2 Liquidation Metrics

This [repo](https://github.com/enviodev/liquidation-metrics) contains an example Envio indexer built using TypeScript for the Compound V2 forks across multiple chains.

This repo was forked from the [original indexer](https://github.com/JossDuff/liquidation-metrics/) built by Joss Duff, one of Envio's first grantees.

`LiquidateBorrow` event from the pool contracts of below Compound V2 forks are indexed, specifically storing the amount of tokens seized and liquidators.

Addresses of all the pool contracts are stored in the `config.yaml` file.

## Protocols indexed

1. Compound V2 on Ethereum Mainnet
1. Flux Finance on Ethereum Mainnet
1. Iron Bank on Ethereum Mainnet
1. Strike Finance on Ethereum Mainnet
1. Iron Bank on Optimism
1. Sonne Finance on Optimism
1. Benqi Lending on Avalanche C-chain
1. Iron Bank on Avalanche C-chain
1. Venus on BSC

The indexer has been built using v0.0.21 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/liquidation-metrics)
1. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
1. Install Envio via `npm i -g envio@v0.0.21`
1. Generate indexing code via `envio codegen`
1. Run the indexer via `envio dev` (make sure you have Docker running)
1. Stop the indexer via `envio stop`
