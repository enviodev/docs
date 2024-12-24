---
id: pulsechain
title: PulseChain
sidebar_label: PulseChain
slug: /pulsechain
---

# PulseChain

## Indexing PulseChain Data with Envio via RPC

:::warning
RPC as a source is not as fast as HyperSync. It is important in production to source RPC data from reliable sources. We recommend our partners at [drpc.org](https://drpc.org). Below, we have provided a set of free endpoints sourced from chainlist.org. **We don't recommend using these in production** as they may be rate limited. We recommend [tweaking the RPC config](./rpc-sync) to accommodate potential rate limiting.
:::

We suggest getting the latest from [chainlist.org](https://chainlist.org).

### Overview

Envio supports PulseChain through an RPC-based indexing approach. This method allows you to ingest blockchain data via an RPC endpoint by setting the RPC configuration.

---

### Defining Network Configurations

To use PulseChain, define the RPC configuration in your network configuration file as follows:

:::info
You may need to adjust more parameters of the [rpc configuration](./rpc-sync) to support the specific rpc provider. 
:::

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 369 # PulseChain
    rpc_config:
      url: https://rpc.pulsechain.com 
    # url: https://pulsechain-rpc.publicnode.com # alternative,
    # url: https://rpc-pulsechain.g4mm4.io # alternative
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

Want HyperSync for PulseChain? Request network support here [Discord](https://discord.gg/fztEvj79m3)!
