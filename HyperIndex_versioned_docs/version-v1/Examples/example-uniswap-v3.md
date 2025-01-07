---
id: example-uniswap-v3
title: Uniswap V3
sidebar_label: Uniswap V3
slug: /example-uniswap-v3
---

# Uniswap V3

> This is a development repo that is undergoing continual changes for benchmarking purposes.

This [repo](https://github.com/enviodev/uniV3-swaps) contains an example Envio indexer built using TypeScript for the [Uniswap V3 USDC / ETH
0.05% pool](https://etherscan.io/address/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640) deployed on Ethereum Mainnet.

`Swap` events from the contract are indexed as entities and the `LiquidityPool` entity is updated on each `Swap` event to track cumulative statistics for the pool.

The indexer has been built using v0.0.21 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/uniV3-swaps)
1. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
1. Install Envio via `npm i -g envio@v0.0.21`
1. Generate indexing code via `envio codegen`
1. Run the indexer via `envio dev` (make sure you have Docker running)
1. Stop the indexer via `pnpm envio stop`
