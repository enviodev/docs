---
id: hypersync
title: HyperSync as Data Source
sidebar_label: HyperSync Data Source
slug: /hypersync
---

> Beam me up, Scotty! 🖖

The backbone of HyperIndex’s blazing-fast indexing speed lies in using HyperSync as a more performant and cost-effective data source to RPC for data retrieval. While RPCs are functional, and can be used in HyperIndex as a data source, they are far from efficient when it comes to querying large amounts of data (a time-consuming and resource-intensive endeavour).

HyperSync is used by default as the data source for indexing. This means developers don't additionally need to worry about RPCs, rate-limiting, etc. With HyperSync, what would usually take hours or days to sync millions of events can now be done in minutes! 

Since this service is a layer above the blockchain we maintain and host this service for each supported network. Visit the HyperSync docs to learn more about [HyperSync](/docs/HyperSync/overview) and its [supported networks](/docs/HyperSync/hypersync-supported-networks). 


In the example below, the absence of `rpc_config` will automatically direct Envio to HyperSync for the defined network (Polygon).

```yaml
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
    start_block: 0
    contracts:
      - name: PolygonGreeter
        abi_file_path: abis/greeter-abi.json
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
        handler: ./src/EventHandlers.bs.js
        events:
          - event: NewGreeting
          - event: ClearGreeting
```

For HyperSync users can use `start_block` of 0 regardless of when the deployments for the contracts to be indexed were, as HyperSync can very quickly detect the first block where it needs to start indexing from automatically.

For RPC configuration visit the [RPC Sync](/docs/HyperIndex/Advanced/rpc-sync.md) page. 
