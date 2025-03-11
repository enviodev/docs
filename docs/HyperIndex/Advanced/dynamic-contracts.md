---
id: dynamic-contracts
title: Loading Dynamic Contracts
sidebar_label: Dynamic Contracts / Factories
slug: /dynamic-contracts
---

# Dynamic Contracts / Factories

## Introduction

Many blockchain systems use factory patterns where new contracts are created dynamically. Common examples include:

- DEXes like Uniswap where each trading pair creates a new contract
- NFT platforms that deploy new collection contracts
- Lending protocols that create new markets as isolated contracts

When indexing these systems, you need a way to discover and track these dynamically created contracts. Envio provides powerful tools to handle this use case.

## When to Use Dynamic Contract Registration

Use dynamic contract registration when:

- Your system includes factory contracts that deploy new contracts over time
- You want to index events from all instances of a particular contract type
- The addresses of these contracts aren't known at the time you create your indexer

## Implementation Methods

Envio provides two approaches for dynamic contract registration:

1. **Standard Registration**: Register contracts as they are discovered during normal indexing
2. **Pre-Registration** (Recommended): Scan for all contract instances first, then index from the beginning

### Standard Contract Registration

With standard registration, you add a `contractRegister` function to detect when new contracts are created:

```javascript
<contract-name>.<event-name>.contractRegister(({ event, context }) => {
  context.add<your-contract-name>(<address-of-the-contract>);
});
```

This function will be called whenever the specified event is emitted, allowing you to register new contract instances as they're created.

### Pre-Registration (Recommended)

Pre-registration improves indexing efficiency by:

1. First scanning the blockchain to discover all instances of your contract
2. Then indexing all events from these contracts from the beginning in a single pass

To use pre-registration, enable the `preRegisterDynamicContracts` flag:

```javascript
<contract-name>.<event-name>.contractRegister(
  ({ event, context }) => {
    context.add<your-contract-name>(<address-of-the-contract>);
  },
  {
    preRegisterDynamicContracts: true
  }
);
```

Pre-registration significantly improves performance for factory patterns by allowing batch processing of events rather than fragmenting queries across many small block ranges.

## Example: NFT Factory Pattern

Let's look at a complete example using an NFT factory pattern.

### Scenario

- `NftFactory` contract creates new `SimpleNft` contracts
- We want to index events from all NFTs created by this factory
- Each time a new NFT is created, the factory emits a `SimpleNftCreated` event

### 1. Configure Your Contracts in config.yaml

```yaml
name: nftindexer
description: NFT Factory
networks:
  - id: 1337
    start_block: 0
    contracts:
      - name: NftFactory
        abi_file_path: abis/NftFactory.json
        address: 0x4675a6B115329294e0518A2B7cC12B70987895C4 # Factory address is known
        handler: src/EventHandlers.ts
        events:
          - event: SimpleNftCreated (string name, string symbol, uint256 maxSupply, address contractAddress)

      - name: SimpleNft
        abi_file_path: abis/SimpleNft.json
        # No address field - we'll discover these addresses from events
        handler: src/EventHandlers.ts
        events:
          - event: Transfer (address from, address to, uint256 tokenId)
```

Note that:

- The `NftFactory` contract has a known address specified in the config
- The `SimpleNft` contract has no address, as we'll register instances dynamically

### 2. Create the Contract Registration Handler

In your `src/EventHandlers.ts` file:

```javascript
// Register SimpleNft contracts whenever they're created by the factory
NftFactory.SimpleNftCreated.contractRegister(
  ({ event, context }) => {
    // Register the new NFT contract using its address from the event
    context.addSimpleNft(event.params.contractAddress);

    console.log(`Registered new SimpleNft at ${event.params.contractAddress}`);
  },
  {
    preRegisterDynamicContracts: true, // Enable pre-registration for better performance
  }
);

// Handle Transfer events from all SimpleNft contracts
SimpleNft.Transfer.handler(async ({ event, context }) => {
  // Your event handling logic here
  console.log(
    `NFT Transfer at ${event.srcAddress} - Token ID: ${event.params.tokenId}`
  );

  // Example: Store transfer information in the database
  // ...
});
```

## Important Notes

- **Block Coverage**: When a dynamic contract is registered, Envio will index all events from that contract in the same block where it was created, even if those events happened in transactions before the registration event. This is particularly useful for contracts that emit events during their construction.

- **Performance Considerations**: Pre-registration is strongly recommended for factory patterns as it can dramatically improve indexing performance by allowing batch processing.

- **Handler Organization**: You can register contracts from any event handler. For example, you might register a token contract when you see it being added to a registry, not just when it's created.

## Debugging Tips

- Use logging in your `contractRegister` function to confirm contracts are being registered
- Check your logs for "Registered new contract" messages
- If you're not seeing events from your dynamic contracts, verify they're being properly registered

For more information on writing event handlers, see the [Event Handlers Guide](../Guides/event-handlers.mdx).
