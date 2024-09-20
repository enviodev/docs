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

HyperFuel is [HyperSync](/docs/HyperSync/overview) adapted for the [Fuel Network](https://fuel.network/) and is exposed as a low-level API for developers and data analysts to create niche, flexible, high-speed queries for all on-chain data.

Users can interact with the HyperFuel in Rust, Python client, Node Js, or JSON API to extract data into parquet files, arrow format, or as typed data.

Using HyperFuel, application developers can easily sync and search large datasets in a few minutes.

You can integrate with HyperFuel using any of our clients:

- Rust: https://github.com/enviodev/hyperfuel-client-rust
- Python: https://github.com/enviodev/hyperfuel-client-python
- Nodejs: https://github.com/enviodev/hyperfuel-client-node
- JSON API: https://github.com/enviodev/hyperfuel-json-api

> HyperFuel supports Fuel's testnet at the endpoint https://fuel-testnet.hypersync.xyz

Read [HyperFuel documentation](/docs/HyperSync/hyperfuel) to learn more.

## HyperIndex

[HyperIndex](../overview.md) is a real-time indexer built to provide developers with a seamless and efficient indexing solution.

Learn [How to Index Data on Fuel in \<5mins using Envio](../Tutorials/tutorial-indexing-fuel.md) in a step-by-step tutorial.

Or gain inspiration from already running indexers built by other developers on Fuel:

- [Spark](https://sprk.fi/) Orderbook Indexer [`github`](https://github.com/compolabs/spark-envio-indexer)
- Thunder Exchange Indexer [`github`](https://github.com/enviodev/fuel-thunder-exchange)
- Greeter Indexer [`github`](https://github.com/enviodev/fuel-greeter)

### State of the art

`HyperIndex` on Fuel supports all relevant features EVM indexer does, including [Dynamic Contracts / Factories](../Advanced/dynamic-contracts.md), [Testing Framework](/docs/HyperIndex/testing), [No-code Quickstart](/docs/HyperIndex/contract-import), [Hosted Service](../Hosted_Service/hosted-service.md) and more.

Also, compared to EVM, Fuel provides many more kinds of possible events. Now, we support indexing only `LogData` receipts (the `log` calls in a [Sway](https://docs.fuel.network/docs/sway/) contract), but we are working on supporting `Transfer`, `TransferOut`, `Mint`, `Burn`, and `Call` receipts in the near future.

> Join our [Discord](https://discord.com/invite/gt7yEUZKeB) channel to make sure you catch all new releases.

### Migration Guide from the `envio@2.x.x-fuel` version

With the V2.3 release, we merged the Fuel indexer into the main `envio` repo. This means that you can now use the `envio` version to run both Fuel and EVM indexers.

However, if you are using the `envio` version suffixed with `-fuel`, you will need to migrate to the new version. It shouldn't take more than a few minutes to do so.

To migrate, start with updating the package version:

```bash
pnpm i envio@latest
```

> If you installed `envio` globally, you will also need to run `pnpm i -g envio@latest`

Then in your handlers rename `data` to `params`:

```diff
SwayFarmContract.NewPlayer.handler(async ({ event, context }) => {
  context.Player.set({
-   id: event.data.address.payload.bits,
-   createdAt: event.time,
+   id: event.params.address.payload.bits,
+   createdAt: event.block.time,
    ...
  });
});
```

Also, some other event fields were moved:

- `time` -> `block.time`
- `blockHeight` -> `block.height`
- X => `block.id`
- `transactionId` -> `transaction.id`
- `contractId` -> `srcAddress`
- `receiptIndex` -> `logIndex`
- `receiptType` -> removed

These are all Fuel-related changes, but if you use `loaders` follow the [v1 to v2 migration guide](/docs/HyperIndex/migration-guide-v1-v2) to update to the V2 API.

If you need help, create an issue in our [GitHub repository](https://github.com/enviodev/hyperindex). We'll be happy to help!
