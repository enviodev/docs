---
id: any-evm-with-rpc
title: Any EVM with RPC
sidebar_label: 👉 Any EVM with RPC 👈
slug: /any-evm-with-rpc
---

# Any EVM with RPC 🐌

---

Any EVM-compatible chain can be indexed using an RPC as a source. This means that you can use any EVM-compatible chain as a data source for your indexer. This is particularly useful for chains that do not have a native HyperSync or HyperRPC solution.

### Defining Network Configurations

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 1234567890
    rpc_config:
      url: https://custom-network-rpc.com # RPC URL for that custom network
    start_block: START_BLOCK_NUMBER # Specify the starting block
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

### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!

:::info
the backbone of hyperindex’s blazing-fast indexing speed lies in using hypersync as a more performant and cost-effective data source to rpc for data retrieval. while rpcs are functional, and can be used in hyperindex as a data source, they are far from efficient when it comes to querying large amounts of data (a time-consuming and resource-intensive endeavour).

hypersync is significantly faster and more cost-effective than traditional rpc methods, allowing the retrieval of multiple blocks at once, and enabling sync speeds up to 1000x faster than rpc.
:::

---
