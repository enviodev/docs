---
id: stable
title: Stable
description: Start indexing Stable data with Envio. HyperSync support for Stable is available on request.
sidebar_label: Stable
slug: /stable
---

# Stable

## Indexing Stable Data with Envio

:::info Access on request
HyperSync support for Stable is available on a request basis. To get access, reach out to us on [Discord](https://discord.gg/envio) and we'll enable it for your project.
:::

| **Field**                     | **Value**                                                                                          |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **Stable Chain ID**     | 988                                                                                            |
| **HyperSync Access**    | On request — [reach out on Discord](https://discord.gg/envio) |

---

### Overview

Envio is a modular hyper-performant data indexing solution for Stable, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](/docs/v2/HyperIndex/overview) (a customizable indexing framework), [HyperSync](/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

Stable is supported through HyperSync on a request basis. Once access has been granted, HyperIndex uses HyperSync as the data source for Stable, enabling sync speeds up to 2000x faster than traditional RPC methods.

To get started, see our documentation or follow our quickstart [guide](/docs/v2/HyperIndex/contract-import).

---

### Defining Network Configurations

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 988 # Stable
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
          - "0xYourContractAddress1"
          - "0xYourContractAddress2"
        events:
          - event: Event # Specify event
          - event: Event
```

With these steps completed, your application will be set to efficiently index Stable data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](/docs/v2/HyperIndex/configuration-file).

### Support

Request access to Stable, or ask us anything, on [Discord](https://discord.gg/envio); we’re always happy to help!

---
