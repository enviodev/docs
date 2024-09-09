---
id: rpc-sync
title: RPC as Data Source
sidebar_label: RPC Data Source
slug: /rpc-sync
---

For syncing of events to be indexed, users are required to use RPC endpoints to retrieve events from each different chain.

RPC sync configuration is **optional** for the user, and if not defined, the indexer will use default values for the RPC endpoint.

Users can configure their own sync behaviour for each RPC endpoint used for additional control.

The following attributes can be defined for the sync config of each RPC endpoint:

- `initial_block_interval`: Initial block interval which the indexer will use to make RPC requests
- `backoff_multiplicative`: After an RPC error, factor to scale back the number of blocks requested at once
- `acceleration_additive`: Without RPC errors or timeouts, how much to increase the number of blocks requested for the next batch
- `interval_ceiling`: Maximum block interval that is allowed for any request on the RPC
- `backoff_millis`: After an error, how long to wait before retrying in milliseconds
- `query_timeout_millis`: How long to wait in milliseconds before cancelling an RPC request due to timeout

Sync configuration for each RPC endpoint should be defined in `config.yaml` file.
Below is an example of how sync configuration per RPC endpoint can be defined:

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

---

## Granular RPC caching and failover

For a more granular approach of handling RPC failovers, permenant caching, auto-batching, etc. you can use [eRPC](https://github.com/erpc/erpc) with [envio HyperRPC](http://localhost:3001/docs/HyperSync/overview-hyperrpc) or other rpc endpoints as upstream source.

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

Once configured, all RPC requests will be routed through eRPC, which will manage caching, failover, auto-batching, rate-limiting, auto-discovery of node providers, and more behind the scenes, providing a more resilient and efficient indexing solution as opposed to using a single RPC source. Using HyperSync will still perform indexing faster as opposed to RPC based solutions.
