---
id: xdc-testnet
title: XDC Testnet
description: Start indexing XDC Testnet data with Envio. HyperSync support for XDC Testnet is available on request.
sidebar_label: XDC Testnet
slug: /xdc-testnet
---

# XDC Testnet

## Indexing XDC Testnet Data with Envio

:::info Access on request
HyperSync support for XDC Testnet is available on a request basis. To get access, reach out to us on [Discord](https://discord.gg/envio) and we'll enable it for your project.
:::

| **Field**                     | **Value**                                                                                          |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **XDC Testnet Chain ID**     | 51                                                                                            |
| **HyperSync Access**    | On request — [reach out on Discord](https://discord.gg/envio) |

---

### Overview

Envio is a modular hyper-performant data indexing solution for XDC Testnet, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

XDC Testnet is supported through HyperSync on a request basis. Once access has been granted, HyperIndex uses HyperSync as the data source for XDC Testnet, enabling sync speeds up to 2000x faster than traditional RPC methods.

To get started, see our documentation or follow our quickstart [guide](/docs/HyperIndex/quickstart).

---

### Defining Chain Configurations

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
chains:
  - id: 51 # XDC Testnet
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

With these steps completed, your application will be set to efficiently index XDC Testnet data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](/docs/HyperIndex/configuration-file).

### Support

Request access to XDC Testnet, or ask us anything, on [Discord](https://discord.gg/envio); we’re always happy to help!

---
