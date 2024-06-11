---
id: fuel
title: Fuel
sidebar_label: Fuel
slug: /fuel
---

Until recently, Envio was only available on EVM-compatible blockchains, and now we have extended support to the Fuel Network 🙌

## About Fuel

[Fuel](https://fuel.network/) is an operating system purpose-built for Ethereum rollups. Fuel's unique architecture allows rollups to solve for PSI (parallelization, state minimized execution, interoperability). Powered by the FuelVM, Fuel aims to expand Ethereum's capability set without compromising security or decentralization.

[Website](https://fuel.network/) | [X](https://twitter.com/fuel_network?lang=en) | [Discord](https://discord.com/invite/xfpK4Pe)

## HyperFuel

HyperFuel is [HyperSync](./overview-hypersync.md) adapted for the [Fuel network](https://fuel.network/) and is exposed as a low-level API for developers and data analysts to create niche, flexible, high-speed queries for all on-chain data.

Users can interact with the HyperFuel in Rust, Python client, Node Js, or Json API to extract data into parquet files, arrow format, or as typed data.

Using HyperFuel, application developers can easily sync and search large datasets in a few minutes.

You can integrate with HyperFuel using any of our clients:

- Rust: https://github.com/enviodev/hyperfuel-client-rust
- Python: https://github.com/enviodev/hyperfuel-client-python
- Nodejs: https://github.com/enviodev/hyperfuel-client-node
- Json API: https://github.com/enviodev/hyperfuel-json-api

> HyperFuel supports Fuel's latest testnet.

## HyperIndex

[HyperIndex](./overview.md) is a real-time indexer built to provide developers with a seamless and efficient indexing solution.

Learn [How to Index Data on Fuel in \<5mins using Envio](./tutorial-indexing-fuel.md) in a step-by-step tutorial.

Or gain inspiration from already running indexers built by other developers on Fuel:

- [Spark](https://sprk.fi/) Orderbook Indexer [`github`](https://github.com/compolabs/spark-envio-indexer)
- Thunder Exchange Indexer [`github`](https://github.com/enviodev/fuel-thunder-exchange)
- Greeter Indexer [`github`](https://github.com/enviodev/fuel-greeter)

### State of the art

Currently, `HyperIndex` on Fuel supports the most features EVM indexer does, including advanced features such as [Dynamic Contracts / Factories](./dynamic-contracts.md), [Testing Framework](/docs/testing) and [Hosted Service](./hosted-service.md).

Also, compared to EVM, Fuel provides many more kinds of possible events. Now, we support indexing only `LogData` receipts (the `log` calls in a [Sway](https://docs.fuel.network/docs/sway/) contract), but there's a plan to also support `Transfer`, `TransferOut`, `Mint`, `Burn`, and `Call` receipts in the near future.

We will also work on a [No-code Quickstart](/docs/contract-import), predicates support, and more.

> Join our [Discord](https://discord.com/invite/gt7yEUZKeB) channel to make sure you catch all new releases.
