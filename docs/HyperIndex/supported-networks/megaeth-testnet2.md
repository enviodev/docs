---
id: megaeth-testnet2
title: Megaeth Testnet2
sidebar_label: Megaeth Testnet2
slug: /megaeth-testnet2
---

# Megaeth Testnet2

## Indexing Megaeth Testnet2 Data with Envio

| **Field**                     | **Value**                                                                                          |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **Megaeth Testnet2 Chain ID**     | 6343                                                                                            |
| **HyperSync URL Endpoint**    | [https://megaeth-testnet2.hypersync.xyz](https://megaeth-testnet2.hypersync.xyz) or [https://6343.hypersync.xyz](https://6343.hypersync.xyz) |
| **HyperRPC URL Endpoint**     | [https://megaeth-testnet2.rpc.hypersync.xyz](https://megaeth-testnet2.rpc.hypersync.xyz) or [https://6343.rpc.hypersync.xyz](https://6343.rpc.hypersync.xyz) |

---

### Tier

SILVER 🥈

### Overview

Envio is a modular hyper-performant data indexing solution for Megaeth Testnet2, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Megaeth Testnet2, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](/docs/HyperIndex/contract-import).

---

### Defining Network Configurations

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 6343 # Megaeth Testnet2  
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

With these steps completed, your application will be set to efficiently index Megaeth Testnet2 data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](/docs/HyperIndex/configuration-file).

### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!

---
