---
id: sync-config
title: RPC Sync Config
sidebar_label: RPC Sync Config
slug: /sync-config
---

# RPC Sync Config

For syncing of events to be indexed, users are required to use RPC endpoints to retrieve events from each different chain.

Sync configuration per RPC endpoint is set to default values, however users can also configure their own sync behaviour for each RPC endpoint used for additional control.

The following attributes can be defined for the sync config of each RPC endpoint:
- `initial_block_interval`: Initial block interval which the indexer will use to make RPC requests
- `backoff_multiplicative`: After an RPC error, factor to scale back the number of blocks requested at once
- `acceleration_additive`: Without RPC errors or timeouts, how much to increase the number of blocks requested by for the next batch
- `interval_ceiling`: Maximum block interval that is allowed for any request on the RPC
- `backoff_millis`: After an error, how long to wait before retrying in milliseconds
- `query_timeout_millis`: How long to wait in milliseconds before cancelling an RPC request due to timeout

Sync configuration for each RPC endpoint should be defined in `config.yaml` file.
Below is an example of how sync configuration per RPC endpoint can be defined:

```yaml
  - id: 1
    rpc_config:
      url: https://eth.com # RPC URL that will be used to subscribe to blockchain data on this network
      unstable__sync_config:
        initial_block_interval: 10000 # Integer
        backoff_multiplicative: 0.8 # Float
        acceleration_additive: 2000 # Integer
        interval_ceiling: 10000 # Integer
        backoff_millis: 5000 # Integer
        query_timeout_millis: 20000 # Integer
    start_block: 0
```

---