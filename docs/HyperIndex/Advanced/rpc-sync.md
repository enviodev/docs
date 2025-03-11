---
id: rpc-sync
title: RPC as Data Source
sidebar_label: RPC Data Source
slug: /rpc-sync
---

# Using RPC as Your Indexing Data Source

HyperIndex supports indexing any EVM blockchain using RPC (Remote Procedure Call) as the data source. This page explains when and how to use RPC for your indexing needs.

## When to Use RPC

While [HyperSync](/docs/HyperIndex/hypersync) is the recommended and default data source for optimal performance, there are scenarios where you might need to use RPC instead:

1. **Unsupported Networks**: When indexing a blockchain network that isn't yet supported by HyperSync
2. **Custom Requirements**: When you need specific RPC functionality not available in HyperSync
3. **Private Chains**: When working with private or development EVM chains

> **Note**: For networks that HyperSync supports, we strongly recommend using HyperSync rather than RPC. HyperSync provides significantly faster indexing performance (up to 100x) and doesn't require managing RPC endpoints or worrying about rate limits.

## Configuring RPC in Your Indexer

### Basic Configuration

To use RPC as your data source, you need to add an `rpc_config` section to your network configuration in the `config.yaml` file:

```yaml
networks:
  - id: 1 # Ethereum Mainnet
    rpc_config:
      url: https://eth-mainnet.your-rpc-provider.com # Your RPC endpoint
    start_block: 15000000
    contracts:
      - name: MyContract
        address: "0x1234..."
        # Additional contract configuration...
```

The presence of the `rpc_config` section tells HyperIndex to use RPC instead of HyperSync for this network.

### Advanced RPC Configuration

For more control over how your indexer interacts with the RPC endpoint, you can configure additional parameters:

```yaml
networks:
  - id: 1
    rpc_config:
      url: https://eth-mainnet.your-rpc-provider.com
      initial_block_interval: 10000 # Initial number of blocks to fetch in each request
      backoff_multiplicative: 0.8 # Factor to scale back block request size after errors
      acceleration_additive: 2000 # How many more blocks to request when successful
      interval_ceiling: 10000 # Maximum blocks to request in a single call
      backoff_millis: 5000 # Milliseconds to wait after an error
      query_timeout_millis: 20000 # Milliseconds before timing out a request
    start_block: 15000000
    # Additional network configuration...
```

### Configuration Parameters Explained

| Parameter                | Description                                | Recommended Value   |
| ------------------------ | ------------------------------------------ | ------------------- |
| `url`                    | Your RPC endpoint URL                      | Depends on provider |
| `initial_block_interval` | Starting block batch size                  | 1,000 - 10,000      |
| `backoff_multiplicative` | How much to reduce batch size after errors | 0.5 - 0.9           |
| `acceleration_additive`  | How much to increase batch size on success | 500 - 2,000         |
| `interval_ceiling`       | Maximum blocks per request                 | 5,000 - 10,000      |
| `backoff_millis`         | Wait time after errors (ms)                | 1,000 - 10,000      |
| `query_timeout_millis`   | Request timeout (ms)                       | 10,000 - 30,000     |

The optimal values depend on your RPC provider's performance and limits, as well as the complexity of your contracts and the data being indexed.

## RPC Best Practices

### Selecting an RPC Provider

When choosing an RPC provider, consider:

- **Rate limits**: Most providers have limits on requests per second/minute
- **Node performance**: Some providers offer faster nodes for premium tiers
- **Archive nodes**: Required if you need historical state (e.g., balances at past blocks)
- **Geographic location**: Choose nodes closest to your indexer deployment

### Performance Optimization

To get the best performance when using RPC:

1. **Start from a recent block** if possible, rather than indexing from genesis
2. **Tune batch parameters** based on your provider's capabilities
3. **Use a paid service** for better reliability and higher rate limits
4. **Consider multiple fallback RPCs** for redundancy

## Enhanced RPC with eRPC

For more robust RPC usage, you can implement [eRPC](https://github.com/erpc/erpc) - a fault-tolerant EVM RPC proxy with advanced features like caching and failover.

### What eRPC Provides

- **Permanent caching**: Stores historical responses to reduce redundant requests
- **Auto failover**: Automatically switches between multiple RPC providers
- **Re-org awareness**: Properly handles blockchain reorganizations
- **Auto-batching**: Optimizes requests to minimize network overhead
- **Load balancing**: Distributes requests across multiple providers

### Setting Up eRPC

1. **Create your eRPC configuration file** (`erpc.yaml`):

```yaml
logLevel: debug
projects:
  - id: main
    upstreams:
      # Add HyperRPC as primary source
      - endpoint: evm+envio://rpc.hypersync.xyz
      # Add fallback RPC endpoints
      - endpoint: https://eth-mainnet-provider1.com
      - endpoint: https://eth-mainnet-provider2.com
      - endpoint: https://eth-mainnet-provider3.com
```

2. **Run eRPC using Docker**:

```bash
docker run -v $(pwd)/erpc.yaml:/root/erpc.yaml -p 4000:4000 -p 4001:4001 ghcr.io/erpc/erpc:latest
```

Or add it to your existing Docker Compose setup:

```yaml
services:
  # Your existing services...

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

3. **Configure HyperIndex to use eRPC** in your `config.yaml`:

```yaml
networks:
  - id: 1
    rpc_config:
      url: http://erpc:4000/main/evm/1 # eRPC endpoint for Ethereum Mainnet
    start_block: 15000000
    # Additional network configuration...
```

For more detailed configuration options, refer to the [eRPC documentation](https://docs.erpc.cloud/config/example).

## Comparing HyperSync and RPC

| Feature         | HyperSync                                                          | RPC                          |
| --------------- | ------------------------------------------------------------------ | ---------------------------- |
| Speed           | 10-100x faster                                                     | Baseline                     |
| Configuration   | Minimal                                                            | Requires tuning              |
| Rate Limits     | None                                                               | Depends on provider          |
| Cost            | Included with HyperIndex                                           | Pay per request/subscription |
| Network Support | [Supported networks](/docs/HyperSync/hypersync-supported-networks) | Any EVM network              |
| Maintenance     | Managed by Envio                                                   | Self-managed                 |

## Summary

While RPC provides the flexibility to index any EVM blockchain, it comes with performance limitations and configuration complexity. For supported networks, we recommend using HyperSync as your data source for optimal performance.

If you must use RPC:

- Choose a reliable provider
- Configure your indexer for optimal performance
- Consider implementing eRPC for enhanced reliability and performance
- Start from recent blocks when possible to reduce indexing time

For any questions about using RPC with HyperIndex, please contact the Envio team.
