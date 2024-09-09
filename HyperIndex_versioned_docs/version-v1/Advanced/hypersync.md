---
id: hypersync
title: HyperSync as Data Source
sidebar_label: HyperSync Data Source
slug: /hypersync
---

> Beam me up, scotty! 🖖

Envio HyperSync is our blazing-fast indexed layer on top of the blockchain that allows for hyper speed syncing.

What would usually take hours to sync ~100,000 events can now be done in the order of less than a minute.

HyperSync is the default method used by HyperIndex for all syncing. Visit [here](/docs/HyperSync/overview) to learn more about using the HyperSync python/ts/rust clients for further more custom needs of extracting data.

Since this service is a layer above the blockchain we maintain and host this service for each supported network.

You can find our list of supported networks [here](/docs/HyperSync/hypersync-supported-networks).

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
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
        handler: ./src/EventHandlers.bs.js
        events:
          - event: NewGreeting
          - event: ClearGreeting
```

In the example above, absence of `rpc_config` will automatically direct Envio to HyperSync for the defined network (Polygon).

For HyperSync users can use `start_block` of 0 regardless of when the deployments for the contracts to be indexed were, as HyperSync can very quickly detect the first block where it needs to start indexing from automatically.

---
