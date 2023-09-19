---
id: hypersync
title: Hypersync
sidebar_label: Hypersync
slug: /hypersync
---

# Hypersync

> Beam me up, scotty! 🖖

Envio hypersync is our blazingly fast indexed layer on top of the blockchain that allows for hyper speed syncing. 

What would usually take hours to sync ~100,000 events can now be done in the order of less than a minute.

Since this service is a layer above the blockchain we maintain and host this service for each supported network. 

Below is a list of networks our hypersync feature supports 

```rust
pub enum SupportedNetwork {
    EthereumMainnet,
    Polygon,
    ArbitrumOne,
    Base,
    BinanceChain,
    AvalancheCChain,
    Optimism,
    Linea,
}

```

> Disclaimer: currently the hypersync feature is not real-time - it intentionally lags 10 blocks behind the latest block to allow for chain reorganizations in the future.

Don't see your network here? Pop us a message in [discord](https://discord.gg/Q9qt8gZ2fX)