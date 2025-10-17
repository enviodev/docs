---
id: reorgs-support
title: Chain Reorganization Support
sidebar_label: Reorgs Support
slug: /reorgs-support
description: Learn how to handle chain reorgs and keep your indexed data consistent.
---

# Understanding and Handling Chain Reorganizations

## What Are Chain Reorganizations?

Chain reorganizations (reorgs) occur when the blockchain temporarily forks and then resolves to a single chain, causing some previously confirmed blocks to be replaced by different blocks. This is a normal part of blockchain consensus mechanisms, especially in proof-of-work chains.

When a reorg happens:

- Transactions that were previously considered confirmed may be dropped
- New transactions may be added to the blockchain
- The order of transactions might change

For indexers, this presents a challenge: data that was previously indexed may no longer be valid, requiring a rollback and reprocessing of the affected blocks.

## Automatic Reorg Handling in HyperIndex

HyperIndex includes built-in support for handling chain reorganizations, ensuring your indexed data remains consistent with the blockchain's canonical state. This feature is **enabled by default** to protect your data integrity.

## Configuration Options

### Enabling or Disabling Reorg Support

You can control reorg handling through the `rollback_on_reorg` flag in your `config.yaml` file:

```yaml
# Enable reorg handling (default)
rollback_on_reorg: true
networks:
  # network configurations...

# OR

# Disable reorg handling (not recommended for production)
rollback_on_reorg: false
networks:
  # network configurations...
```

### Configuring Confirmation Thresholds

You can customize the number of blocks required before considering a block "confirmed" and no longer subject to reorgs:

```yaml
rollback_on_reorg: true
networks:
  - id: 137 # Polygon
    confirmed_block_threshold: 150
  - id: 1 # Ethereum
    # Using default threshold
```

The `confirmed_block_threshold` defines how many blocks below the chain head are considered safe from reorganizations. Any reorg deeper than this threshold won't trigger a rollback in your indexer.

## Default Confirmation Thresholds

Currently, all chains default to a threshold of **200 blocks**. In future releases, these thresholds will be tailored per chain based on their specific characteristics and historical reorg depths.

| Network Type | Default Threshold | Notes                                           |
| ------------ | ----------------- | ----------------------------------------------- |
| All Networks | 200 blocks        | Will be customized per chain in future releases |

## Technical Details and Limitations

### Guaranteed Detection

Reorg detection is guaranteed when using [HyperSync](/docs/HyperIndex/Advanced/hypersync.md) as your data source. HyperSync's architecture ensures that any reorganization in the blockchain will be properly detected and handled.

### RPC Limitations

When using a [custom RPC endpoint](/docs/HyperIndex/Advanced/rpc-sync.md) as your data source, there are some edge cases where reorgs might go undetected, depending on the RPC provider's implementation and your indexing pattern.

### Scope of Rollbacks

During a reorg-triggered rollback:

✅ **What is rolled back:**

- All entities defined in your schema
- All data that your handlers read or write to the database

❌ **What is not rolled back:**

- Side effects in your handler code (API calls, external services)
- Custom caching mechanisms outside of HyperIndex
- Logs or external files written by your handlers

## Best Practices

1. **Keep reorg support enabled** for production indexers
2. **Use HyperSync** when possible for guaranteed reorg detection
3. **Avoid external side effects** in your handlers that cannot be rolled back
4. **Consider higher thresholds** for high-value applications or networks with historically deep reorgs

## Example Configuration

Here's a complete example showing reorg handling configuration for multiple networks:

```yaml
rollback_on_reorg: true
networks:
  - id: 1 # Ethereum Mainnet
    confirmed_block_threshold: 250 # Higher threshold for Ethereum
    # other network config...

  - id: 137 # Polygon
    confirmed_block_threshold: 150 # Lower threshold for Polygon
    # other network config...

  - id: 42161 # Arbitrum One
    # Using default threshold (200)
    # other network config...
```

By properly configuring reorg support, you ensure that your indexed data remains consistent with the blockchain, even when the chain reorganizes.

---
