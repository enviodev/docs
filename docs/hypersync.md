---
id: hypersync
title: HyperSync
sidebar_label: HyperSync
slug: /hypersync
---

# HyperSync

> Beam me up, scotty! 🖖

Envio HyperSync is our blazing-fast indexed layer on top of the blockchain that allows for hyper speed syncing.

What would usually take hours to sync ~100,000 events can now be done in the order of less than a minute.

Since this service is a layer above the blockchain we maintain and host this service for each supported network.

Here is a table of currently supported networks on HyperSync:

| Network Name     | Network ID |
| ---------------- | ---------- |
| Ethereum Mainnet | 1          |
| Goerli           | 5          |
| Optimism         | 10         |
| Flare            | 14         |
| Lukso            | 42         |
| Bsc              | 56         |
| Gnosis           | 100        |
| Polygon          | 137        |
| Manta            | 169        |
| Okbc Testnet     | 195        |
| Fantom           | 250        |
| Kroma            | 255        |
| Boba             | 288        |
| Zksync Era       | 324        |
| Base Sepolia     | 420        |
| PublicGoods      | 424        |
| Metis            | 1088       |
| PolygonzkEVM     | 1101       |
| Moonbeam         | 1284       |
| C1 Milkomeda     | 2001       |
| Mantle           | 5000       |
| Base             | 8453       |
| Gnosis Chiado    | 10200      |
| Holesky          | 17000      |
| Arbitrum One     | 42161      |
| Celo             | 42220      |
| Avalanche        | 43114      |
| Linea            | 59144      |
| Mumbai           | 80001      |
| Taiko Jolnr      | 167007     |
| Scroll           | 534352     |
| Zora             | 7777777    |
| Sepolia          | 11155111   |
| Optimism Sepolia | 11155420   |
| Aurora           | 1313161554 |
| AuroraTestnet    | 1313161555 |
| Harmony          | 1666600000 |


Don't see your network here? Pop us a message in [Discord](https://discord.gg/Q9qt8gZ2fX)

## Greeter example

```yaml
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
    start_block: 0
    contracts:
      - name: PolygonGreeter
        abi_file_path: abis/greeter-abi.json
        address: "0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c"
        handler: ./src/EventHandlers.bs.js
        events:
          - event: "NewGreeting"
            requiredEntities:
              - name: "Greeting"
                labels:
                  - "greetingWithChanges"
          - event: "ClearGreeting"
            requiredEntities:
              - name: "Greeting"
                labels:
                  - "greetingWithChanges"
```

In the example above, absence of `rpc_config` will automatically direct Envio to HyperSync for the defined network (Polygon).

For HyperSync users can use `start_block` of 0 regardless of when the deployments for the contracts to be indexed were, as HyperSync can very quickly detect the first block where it needs to start indexing from automatically.

---
