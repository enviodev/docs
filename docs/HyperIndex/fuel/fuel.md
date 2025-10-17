---
id: fuel
title: Fuel
sidebar_label: Fuel
slug: /fuel
description: Explore how to index and query real-time and historical data on Fuel Network with HyperIndex.
---

# Indexing on Fuel Network

## Introduction

Envio has expanded its indexing capabilities beyond EVM-compatible blockchains to now fully support the [Fuel Network](https://fuel.network/) (both mainnet and testnet). This documentation covers how to use Envio's products with Fuel's unique architecture and features. ⛽⚡

Fuel offers several advantages as a modular execution layer including:

- Parallel transaction execution
- State-minimized design
- UTXO-based architecture
- Advanced FuelVM capabilities

## HyperIndex for Fuel

[HyperIndex](../overview.md) enables developers to easily index and query real-time and historical data on Fuel Network with the same powerful features available for EVM chains.

### Getting Started with Fuel Indexing

You can start indexing Fuel contracts in two ways:

1. **Quick Start (5-minute tutorial)**: Follow our step-by-step [tutorial](../Tutorials/tutorial-indexing-fuel.md) to create your first Fuel indexer quickly.

2. **No-Code Contract Import**: Use our [Contract Import](../contract-import.md) tool to automatically generate configuration and schema files for your Fuel contracts.

### Example Fuel Indexers

Looking for inspiration? Check out these indexers built by projects in the Fuel ecosystem:

| Project                               | Type             | GitHub Repository                                                                 |
| ------------------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| [Spark](https://sprk.fi/)             | Orderbook DEX    | [github](https://github.com/compolabs/spark-envio-indexer)                        |
| [Mira](https://mira.ly/)              | AMM DEX          | [github](https://github.com/mira-amm/mira-indexer)                                |
| [Thunder](https://thundernft.market/) | NFT Marketplace  | [github](https://github.com/ThunderFuel/thunder-indexer)                          |
| [Swaylend](https://swaylend.com/)     | Lending Protocol | [github](https://github.com/Swaylend/swaylend-monorepo/tree/develop/apps/indexer) |
| Greeter                               | Tutorial         | [github](https://github.com/enviodev/fuel-greeter)                                |

### Features Supported on Fuel

HyperIndex for Fuel supports all the core features available in the EVM version:

- ✅ [No-code Contract Import](../contract-import.md)
- ✅ [Dynamic Contracts / Factory Tracking](../Advanced/dynamic-contracts.md)
- ✅ [Testing Framework](/docs/HyperIndex/testing)
- ✅ [Hosted Service](../Hosted_Service/hosted-service.md)
- ✅ [Wildcard Indexing](../Advanced/wildcard-indexing.mdx)

## Fuel-Specific Event Types

### Understanding Fuel's Event Model

Fuel's event model differs significantly from EVM. Instead of predefined events, Fuel uses a more flexible approach with various receipt types that can be indexed.

### LOG_DATA Receipts (Primary Event Type)

The most common event type in Fuel is the `LOG_DATA` receipt, created by the `log` instruction in [Sway](https://docs.fuel.network/docs/sway/) contracts.

Unlike Solidity's `emit` which requires predefined event structures, Sway's `log` function allows passing any data, providing greater flexibility.

#### Configuration Example:

```yaml
ecosystem: fuel
network:
  name: "fuel_testnet"

contracts:
  - name: SwayContract
    abi_file_path: "./abis/SwayContract.json"
    start_block: 1
    address: "0x123..."
    events:
      - name: NewGreeting
        logId: "8500535089865083573"
```

The `logId` is a unique identifier for the logged struct, which you can find in your contract's ABI file.

#### Auto-detection of logId:

If your event name matches the logged struct name in Sway, you can omit the `logId`:

```yaml
events:
  - name: NewGreeting # Will automatically detect logId if it matches the struct name
```

> **Tip**: Instead of manually configuring events, use the [Contract Import](../contract-import.md) tool which automatically detects events and generates the proper configuration.

### Additional Fuel Event Types

Fuel allows indexing several additional receipt types not available in EVM:

| Event Type | Description                                      | Example Configuration |
| ---------- | ------------------------------------------------ | --------------------- |
| `Mint`     | Triggered when a contract mints tokens           | `- name: Mint`        |
| `Burn`     | Triggered when a contract burns tokens           | `- name: Burn`        |
| `Transfer` | Combines `TRANSFER` and `TRANSFER_OUT` receipts  | `- name: Transfer`    |
| `Call`     | Triggered when a contract calls another contract | `- name: Call`        |

#### Using Custom Names:

You can rename these events while maintaining their type:

```yaml
events:
  - name: MintMyNft # Custom name
    type: mint # Actual event type
```

> **Note**: All event types can be used with [Wildcard Indexing](../Advanced/wildcard-indexing.mdx).

### Transfer Event Specifics

The `Transfer` event type combines two Fuel receipt types:

- `TRANSFER`: Emitted when a contract transfers tokens to another contract
- `TRANSFER_OUT`: Emitted when a contract transfers tokens to a wallet

> **Important**: Transfers between wallets are not included in the `Transfer` event type.

## Event Object Structure in Handlers

When handling Fuel events, the event object structure differs from EVM:

```typescript
// Example Fuel event handler
SwayContract.NewGreeting.handler(async ({ event, context }) => {
  // Access event parameters
  const message = event.params.message;

  // Access block information
  const blockHeight = event.block.height;
  const blockTime = event.block.time;
  const blockId = event.block.id;

  // Access transaction information
  const txId = event.transaction.id;

  // Access source contract address
  const sourceContract = event.srcAddress;

  // Access log position
  const logIndex = event.logIndex;

  // Store data
  context.Greeting.set({
    id: event.transaction.id,
    message: message,
    timestamp: blockTime,
  });
});
```

## Migration Guide from v2.x.x-fuel

Starting with V2.3, the Fuel indexer has been integrated into the main `envio` package. If you were using the Fuel-specific version (`envio@2.x.x-fuel`), follow these steps to migrate:

### 1. Update Package Version

```bash
# Update local dependency
pnpm i envio@latest

# If installed globally
pnpm i -g envio@latest
```

### 2. Update Configuration

Add the `ecosystem: fuel` field to your `config.yaml`:

```yaml
ecosystem: fuel # Required for Fuel indexers
network:
  name: "fuel_testnet"
  # other network config...
```

### 3. Update Event Handler Code

Several field names have changed in the event object:

| Old Field             | New Field              |
| --------------------- | ---------------------- |
| `event.data.x`        | `event.params.x`       |
| `event.time`          | `event.block.time`     |
| `event.blockHeight`   | `event.block.height`   |
| (none)                | `event.block.id`       |
| `event.transactionId` | `event.transaction.id` |
| `event.contractId`    | `event.srcAddress`     |
| `event.receiptIndex`  | `event.logIndex`       |
| `event.receiptType`   | (removed)              |

Example migration:

```diff
SwayContract.NewGreeting.handler(async ({ event, context }) => {
  context.Greeting.set({
-   id: event.data.id,
-   message: event.data.message,
-   createdAt: event.time,
-   blockHeight: event.blockHeight,
+   id: event.params.id,
+   message: event.params.message,
+   createdAt: event.block.time,
+   blockHeight: event.block.height,
    transaction: event.transaction.id,
  });
});
```

> **Note**: If you use loaders, also follow the [v1 to v2 migration guide](../migration-guide-v1-v2.md) for loader-specific changes.

## HyperFuel

[HyperFuel](/docs/HyperSync/hyperfuel) is Envio's low-level data API for the Fuel Network (equivalent to [HyperSync](/docs/HyperSync/overview) for EVM chains).

HyperFuel provides:

- High-performance data access
- Flexible query capabilities
- Multiple data formats (Parquet, Arrow, typed data)
- Complete historical data

### Available Clients

Access HyperFuel data using any of these clients:

- **Rust**: [hyperfuel-client-rust](https://github.com/enviodev/hyperfuel-client-rust)
- **Python**: [hyperfuel-client-python](https://github.com/enviodev/hyperfuel-client-python)
- **Node.js**: [hyperfuel-client-node](https://github.com/enviodev/hyperfuel-client-node)
- **JSON API**: [hyperfuel-json-api](https://github.com/enviodev/hyperfuel-json-api)

### HyperFuel Endpoints

- **Mainnet**: https://fuel.hypersync.xyz
- **Testnet**: https://fuel-testnet.hypersync.xyz

For detailed information, see the [HyperFuel documentation](/docs/HyperSync/hyperfuel).

## About Fuel Network

[Fuel](https://fuel.network/) is an operating system purpose-built for Ethereum rollups with unique architecture focused on:

- **P**arallelization: Execute transactions concurrently for higher throughput
- **S**tate-minimized execution: Efficient storage and computation model
- **I**nteroperability: Seamless integration with other blockchain systems

Powered by the FuelVM, Fuel expands Ethereum's capabilities without compromising security or decentralization.

### Resources

- [Website](https://fuel.network/)
- [Twitter](https://twitter.com/fuel_network)
- [Discord](https://discord.com/invite/xfpK4Pe)
- [Documentation](https://docs.fuel.network/)

## Need Help?

If you encounter any issues with Fuel indexing, please:

1. Check our [Troubleshooting](../Troubleshoot/common-issues.md) guides
2. Join our [Discord](https://discord.com/invite/gt7yEUZKeB) for community support
3. Create an issue in our [GitHub repository](https://github.com/enviodev/hyperindex)
