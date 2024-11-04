---
id: rpc-sync
title: RPC as Data Source
sidebar_label: RPC Data Source
slug: /rpc-sync
---

HyperIndex natively supports indexing any EVM blockchain using RPC as the data source. See information further below for using RPC as the data source. 

:::info
Are you on this page because Hypersync is not supported on the EVM network you want to index? 

The backbone of HyperIndex’s blazing-fast indexing speed lies in using HyperSync as a more performant and cost-effective data source to RPC for data retrieval. While RPCs are functional, and can be used in HyperIndex as a data source, they are far from efficient when it comes to querying large amounts of data (a time-consuming and resource-intensive endeavour).
:::

If a [network is supported](/docs/HyperSync/hypersync-supported-networks) on HyperSync, then HyperSync is used by default as the data source. This means developers don't additionally need to worry about RPCs, rate-limiting, etc. This is especially valuable for multi-chain apps.

If the EVM network that you want to index is not supported on HyperSync, or you want to use RPC as the data source, you can use the following information and configuration options to use RPC for your EVM chain. 


Sync configuration for each RPC endpoint should be defined in `config.yaml` file. Below is an example of how sync configuration per RPC endpoint can be defined:

```yaml
- id: 1
  rpc_config:
    url: https://eth.com # RPC URL that will be used to subscribe to blockchain data on this network
    initial_block_interval: 10000 # Integer
    backoff_multiplicative: 0.8 # Float
    acceleration_additive: 2000 # Integer
    interval_ceiling: 10000 # Integer
    backoff_millis: 5000 # Integer
    query_timeout_millis: 20000 # Integer
  start_block: 0
```

Users can configure their own sync behaviour for each RPC endpoint used for additional control.

The following attributes can be defined for the sync config of each RPC endpoint:

- `initial_block_interval`: Initial block interval which the indexer will use to make RPC requests
- `backoff_multiplicative`: After an RPC error, factor to scale back the number of blocks requested at once
- `acceleration_additive`: Without RPC errors or timeouts, how much to increase the number of blocks requested for the next batch
- `interval_ceiling`: Maximum block interval that is allowed for any request on the RPC
- `backoff_millis`: After an error, how long to wait before retrying in milliseconds
- `query_timeout_millis`: How long to wait in milliseconds before cancelling an RPC request due to timeout

---

:::info
This is an external integration related supplementary to aforementioned RPC usage.
:::

## Granular RPC caching and failover

For a more granular approach to handling RPC failovers, permanent caching, auto-batching, etc. you can use [eRPC](https://github.com/erpc/erpc) with [envio HyperRPC](/docs/HyperSync/overview-hyperrpc) or other RPC endpoints as the upstream source.

[eRPC](https://github.com/erpc/erpc) is a fault-tolerant EVM RPC proxy and re-org aware permanent caching solution, specifically built for read-heavy use-cases like data indexing and high-load frontend usage.

### Quickstart Guide

1. **Create your [`erpc.yaml`](https://docs.erpc.cloud/config/example) configuration file**:

   ```yaml
   logLevel: debug
   projects:
     - id: main
       upstreams:
         # This will automatically add all supported EVM chains by HyperRPC.
         - endpoint: evm+envio://rpc.hypersync.xyz
         # you can add other rpc endpoints for fallback
         - endpoint: https://eth-1.com
         - endpoint: https://eth-2.com
         - endpoint: https://eth-3.com
   ```

   Refer to [a complete config example](https://docs.erpc.cloud/config/example) for further details and customization options.

2. **Use the Docker image**:

   ```bash
   docker run -v $(pwd)/erpc.yaml:/root/erpc.yaml -p 4000:4000 -p 4001:4001 ghcr.io/erpc/erpc:latest
   ```

   Or run eRPC as a service and as part of your current `docker-compose.yaml` configs.

   ```yaml
   services:
     ...

     erpc:
       image: ghcr.io/erpc/erpc:latest
       platform: linux/amd64
       volumes:
         - "${PWD}/erpc.yaml:/root/erpc.yaml"
       ports:
         - 4000:4000
         - 4001:4001
       restart: always
   ```

3. **Set the eRPC URL in the `envio config yaml`**

```yaml
- id: 1
  rpc_config:
    url: http://erpc:4000/main/evm/1
  start_block: 0
  ...
```

Once configured, all RPC requests will be routed through eRPC, which will manage caching, failover, auto-batching, rate-limiting, auto-discovery of node providers, and more behind the scenes, providing a more resilient and efficient indexing solution as opposed to using a single RPC source. Using HyperSync will still perform indexing faster as opposed to RPC-based solutions.
