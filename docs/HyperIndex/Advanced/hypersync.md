---
id: hypersync
title: HyperSync as Data Source
sidebar_label: HyperSync Data Source
slug: /hypersync
---

# Using HyperSync as Your Indexing Data Source

> **"Beam me up, Scotty!"** 🖖 — Just like the Star Trek transporter, HyperSync delivers your blockchain data at warp speed.

## What is HyperSync?

HyperSync is a purpose built data-node that helps powers the exceptional performance of HyperIndex. It's a specialized data source optimized for indexing that provides:

- **100x faster sync speeds** compared to traditional RPC methods
- **Cost-effective data retrieval** with optimized resource usage
- **Flexibility** with the ability to fetch multiple data points in a single round trip with more complex filtering

## How HyperSync Powers Your Indexers

### The Performance Advantage

Traditional blockchain indexing relies on RPC (Remote Procedure Call) endpoints to query blockchain data. While functional, RPCs become highly inefficient when:

- Indexing millions of events
- Processing historical blockchain data
- Extracting data across multiple networks
- Working with thousands of contracts

HyperSync addresses these limitations by providing a streamlined data access layer that dramatically reduces sync times from days to minutes.

### Default Enablement

**HyperSync is used by default** as the data source for all HyperIndex networks. This means:

- No additional configuration is required to benefit from its speed
- No need to worry about RPC rate limiting
- No management of multiple RPC providers
- No costs for external RPC services

## Using HyperSync in Your Projects

### Configuration

To use HyperSync (the default), simply don't set an RPC for historical sync in your config. HyperIndex will automatically use HyperSync for supported networks:

```yaml
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
    start_block: 0 # With HyperSync, you can use 0 regardless of contract deployment time
    contracts:
      - name: PolygonGreeter
        abi_file_path: abis/greeter-abi.json
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
        handler: ./src/EventHandlers.bs.js
        events:
          - event: NewGreeting
          - event: ClearGreeting
```

### Smart Block Detection

When using HyperSync, you can specify `start_block: 0` in your configuration. HyperSync will automatically:

1. Detect the first block where your contract was deployed
2. Begin indexing from that block
3. Skip unnecessary processing of earlier blocks

This feature eliminates the need to manually determine the deployment block of your contract, saving setup time and reducing configuration errors.

## Availability and Support

HyperSync is maintained and hosted by Envio for all supported networks. We handle the infrastructure, allowing you to focus on building your indexer logic.

### Enhance reliability with the RPC data source

HyperIndex allows you to provide RPC providers specifically for redundancy and failover. This is **recommended** to ensure your indexer has 100% uptime. If something happens with HyperSync, your indexer will automatically switch to RPC.

Add it by providing an `rpc` field in your network configuration. It can be a URL or a list of RPC configuration objects:

```diff
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
+   # Short and simple
+   rpc: https://eth-mainnet.your-rpc-provider.com?API_KEY={ENVIO_MAINNET_API_KEY}
+   # Or provide multiple RPC endpoints with more flexibility
+   rpc:
+     - url: https://eth-mainnet.your-rpc-provider.com?API_KEY={ENVIO_MAINNET_API_KEY}
+       for: fallback
+     - url: https://eth-mainnet.your-free-rpc-provider.com
+       for: fallback
+       initial_block_interval: 1000
    start_block: 0 # With HyperSync, you can use 0 regardless of contract deployment time
    contracts:
      - name: PolygonGreeter
        abi_file_path: abis/greeter-abi.json
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
        handler: ./src/EventHandlers.bs.js
        events:
          - event: NewGreeting
          - event: ClearGreeting
```

:::info
This feature is available starting from version `2.14.0`. The fallback RPC is used when a primary data source doesn't get a new block for more than 20 seconds.
:::

### Supported Networks

HyperSync supports numerous EVM networks including Ethereum, Unichain, Arbitrum, Optimism, and more. For a complete and up-to-date list of supported networks, see the [HyperSync Supported Networks](/docs/HyperSync/hypersync-supported-networks) documentation.

### Alternatives

HyperSync data source is vendorlock-free. While HyperSync is recommended for optimal performance, you can always switch to RPCs without the need to change your indexer code. For information on configuring RPC-based indexing, visit the [RPC Data Source](/docs/HyperIndex/Advanced/rpc-sync.md) documentation.

## Performance Comparison

| Metric             | Traditional RPC       | HyperSync                    |
| ------------------ | --------------------- | ---------------------------- |
| Indexing 1M Events | Hours to days         | Minutes                      |
| Resource Usage     | High                  | Optimized                    |
| Network Calls      | Many individual calls | Batched for efficiency       |
| Rate Limiting      | Common issue          | Not applicable               |
| Cost               | Pay per API call      | Included with Hosted Service |

## Summary

HyperSync provides a significant competitive advantage for Envio indexers by dramatically reducing sync times, lowering costs, and simplifying configuration. By using HyperSync as your default data source, you'll experience:

- Faster indexing performance
- Support for previously impossible indexing cases
- Enhanced reliability
- Reduced operational complexity

To learn more about HyperSync's underlying technology, visit the [HyperSync documentation](/docs/HyperSync/overview).
