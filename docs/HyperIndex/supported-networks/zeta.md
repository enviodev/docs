---
id: zeta
title: Zeta
description: Start indexing Zeta data with Envio. A blazing-fast, developer-friendly multichain blockchain indexer.
sidebar_label: Zeta
slug: /zeta
---

# Zeta

## Indexing Zeta Data with Envio

| **Field**                     | **Value**                                                                                          |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **Zeta Chain ID**     | 7000                                                                                            |
| **HyperSync URL Endpoint**    | [https://zeta.hypersync.xyz](https://zeta.hypersync.xyz) or [https://7000.hypersync.xyz](https://7000.hypersync.xyz) |
| **HyperRPC URL Endpoint**     | [https://zeta.rpc.hypersync.xyz](https://zeta.rpc.hypersync.xyz) or [https://7000.rpc.hypersync.xyz](https://7000.rpc.hypersync.xyz) |

---

### Tier

STONE 🪨

### Overview

Envio is a modular hyper-performant data indexing solution for Zeta, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Zeta, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 2000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](/docs/HyperIndex/contract-import).

---

### Defining Network Configurations

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 7000 # Zeta  
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

With these steps completed, your application will be set to efficiently index Zeta data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](/docs/HyperIndex/configuration-file).

### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!

---
