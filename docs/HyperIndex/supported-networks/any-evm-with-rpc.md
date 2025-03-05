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
The backbone of HyperIndex’s blazing-fast indexing speed lies in using HyperSync as a more performant and cost-effective data source to RPC for data retrieval. While RPCs are functional, and can be used in HyperIndex as a data source, they are far from efficient when it comes to querying large amounts of data (a time-consuming and resource-intensive endeavour).

HyperSync is significantly faster and more cost-effective than traditional RPC methods, allowing the retrieval of multiple blocks at once, and enabling sync speeds up to 1000x faster than RPC.
:::

---
