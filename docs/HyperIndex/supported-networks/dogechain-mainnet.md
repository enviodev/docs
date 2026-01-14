---
id: dogechain-mainnet
title: Dogechain Mainnet
description: Start indexing Dogechain Mainnet data with Envio. A blazing-fast, developer-friendly multichain blockchain indexer.
sidebar_label: Dogechain Mainnet
slug: /dogechain-mainnet
---

# Dogechain Mainnet

## Indexing Dogechain Mainnet Data with Envio via RPC

:::warning
RPC as a source is not as fast as HyperSync. It is important in production to source RPC data from reliable sources. We recommend our partners at [drpc.org](https://drpc.org). Below, we have provided a set of free endpoints sourced from chainlist.org. **We don't recommend using these in production** as they may be rate limited. We recommend [tweaking the RPC config](./rpc-sync) to accommodate potential rate limiting.
:::

We suggest getting the latest from [chainlist.org](https://chainlist.org).

### Overview

Envio supports Dogechain Mainnet through an RPC-based indexing approach. This method allows you to ingest blockchain data via an RPC endpoint by setting the RPC configuration.

---

### Defining Network Configurations

To use Dogechain Mainnet, define the RPC configuration in your network configuration file as follows:

:::info
You may need to adjust more parameters of the [rpc configuration](./rpc-sync) to support the specific rpc provider. 
:::

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 2000 # Dogechain Mainnet
    rpc_config:
      url: https://rpc02-sg.dogechain.dog 
    # url: https://rpc-us.dogechain.dog # alternative,
    # url: https://rpc.dogechain.dog # alternative
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

Want HyperSync for Dogechain Mainnet? Request network support here [Discord](https://discord.gg/fztEvj79m3)!
