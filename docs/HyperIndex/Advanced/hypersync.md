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

HyperSync addresses these limitations by providing a streamlined data access layer that dramatically reduces sync times from days to minutes.

### Default Enablement

**HyperSync is used by default** as the data source for all HyperIndex deployments. This means:

- No additional configuration is required to benefit from its speed
- No need to worry about RPC rate limiting
- No management of multiple RPC providers
- No costs for external RPC services

## Using HyperSync in Your Projects

### Configuration

To use HyperSync (the default), simply omit the `rpc_config` section in your configuration. HyperIndex will automatically use HyperSync for supported networks:

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

### Supported Networks

HyperSync supports numerous EVM networks including Ethereum, Unichain, Arbitrum, Optimism, and more. For a complete and up-to-date list of supported networks, see the [HyperSync Supported Networks](/docs/HyperSync/hypersync-supported-networks) documentation.

### Alternatives

While HyperSync is recommended for optimal performance, you can still use RPCs as your data source if needed. For information on configuring RPC-based indexing, visit the [RPC Sync](/docs/HyperIndex/Advanced/rpc-sync.md) documentation.

## Performance Comparison

| Metric             | Traditional RPC       | HyperSync                |
| ------------------ | --------------------- | ------------------------ |
| Indexing 1M Events | Hours to days         | Minutes                  |
| Resource Usage     | High                  | Optimized                |
| Network Calls      | Many individual calls | Batched for efficiency   |
| Rate Limiting      | Common issue          | Not applicable           |
| Cost               | Pay per API call      | Included with HyperIndex |

## Summary

HyperSync provides a significant competitive advantage for Envio indexers by dramatically reducing sync times, lowering costs, and simplifying configuration. By using HyperSync as your default data source, you'll experience:

- Faster indexing performance
- Reduced operational complexity
- Automatic optimization
- Enhanced reliability

To learn more about HyperSync's underlying technology, visit the [HyperSync documentation](/docs/HyperSync/overview).
