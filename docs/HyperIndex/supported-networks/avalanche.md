---
id: avalanche
title: Avalanche
sidebar_label: Avalanche
slug: /avalanche
---

# Avalanche

## Indexing Avalanche Data with Envio

| **Field**                     | **Value**                                                                                          |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **Avalanche Chain ID**        | 43114                                                                                            |
| **HyperSync URL Endpoint**    | [https://avalanche.hypersync.xyz](https://avalanche.hypersync.xyz) or [https://43114.hypersync.xyz](https://43114.hypersync.xyz) |
| **HyperRPC URL Endpoint**     | [https://avalanche.rpc.hypersync.xyz](https://avalanche.rpc.hypersync.xyz) or [https://43114.rpc.hypersync.xyz](https://43114.rpc.hypersync.xyz) |

---

### Overview

Envio is a modular hyper-performant data indexing solution for [Avalanche](https://www.avax.network/), enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](/docs/HyperSync/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Avalanche, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](/docs/HyperIndex/contract-import).

---

### Defining Network Configurations

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 43114 # Avalanche  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index Avalanche data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](docs/HyperIndex/configuration-file).

#### Other Supported Networks: 

* Fuji (Avalanche Testnet)

The full list of HyperSync supported networks can be found [here](docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About Avalanche

Avalanche is a high-speed, scalable blockchain platform tailored for dApps and enterprise solutions. It stands out with its sub-second transaction finality and low transaction fees, making it a robust choice for developers and businesses alike.
