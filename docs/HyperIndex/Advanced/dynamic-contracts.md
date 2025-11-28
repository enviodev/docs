---
id: dynamic-contracts
title: Loading Dynamic Contracts / Factories 
sidebar_label: Dynamic Contracts / Factories
slug: /dynamic-contracts
description: Learn how to track and index dynamically created contracts from factory contracts.
---

## Introduction

Many blockchain systems use factory patterns where new contracts are created dynamically. Common examples include:

- DEXes like Uniswap where each trading pair creates a new contract
- NFT platforms that deploy new collection contracts
- Lending protocols that create new markets as isolated contracts

When indexing these systems, you need a way to discover and track these dynamically created contracts. Envio provides powerful tools to handle this use case.

### Contract Registration Handler

Instead of a template based approach, we've introduced a `contractRegister` handler that can be added to any event.

This allows you to easily:

- Register contracts from any event handler.
- Use conditions and any logic you want to register contracts.
- Have nested factories which are registered by other factories.

```typescript
<contract-name>.<event-name>.contractRegister(({ event, context }) => {
  context.add<your-contract-name>(<address-of-the-contract>);
});
```

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

```typescript
// Register SimpleNft contracts whenever they're created by the factory
NftFactory.SimpleNftCreated.contractRegister(({ event, context }) => {
  // Register the new NFT contract using its address from the event
  context.addSimpleNft(event.params.contractAddress);

  context.log.info(
    `Registered new SimpleNft at ${event.params.contractAddress}`
  );
});

// Handle Transfer events from all SimpleNft contracts
SimpleNft.Transfer.handler(async ({ event, context }) => {
  // Your event handling logic here
  context.log.info(
    `NFT Transfer at ${event.srcAddress} - Token ID: ${event.params.tokenId}`
  );

  // Example: Store transfer information in the database
  // ...
});
```

## Async Contract Register

As of version `2.21`, you can use async contract registration.

This is a unique feature of Envio that allows you to perform an external call to determine the address of the contract to register.

```typescript
NftFactory.SimpleNftCreated.contractRegister(async ({ event, context }) => {
  const version = await getContractVersion(event.params.contractAddress);
  if (version === "v2") {
    context.addSimpleNftV2(event.params.contractAddress);
  } else {
    context.addSimpleNft(event.params.contractAddress);
  }
});
```

## When to Use Dynamic Contract Registration

Use dynamic contract registration when:

- Your system includes factory contracts that deploy new contracts over time
- You want to index events from all instances of a particular contract type
- The addresses of these contracts aren't known at the time you create your indexer

## Important Notes

- **Block Coverage**: When a dynamic contract is registered, Envio will index all events from that contract in the same block where it was created, even if those events happened in transactions before the registration event. This is particularly useful for contracts that emit events during their construction.

- **Handler Organization**: You can register contracts from any event handler. For example, you might register a token contract when you see it being added to a registry, not just when it's created.

- **Pre-registration**: Pre-registration was a recommended mode to optimize performance. But starting from version `2.19` the option is removed in favor of the default behavior, which got even faster.

## Debugging Tips

- Use logging in your `contractRegister` function to confirm contracts are being registered.
- If you're not seeing events from your dynamic contracts, verify they're being properly registered in database.

For more information on writing event handlers, see the [Event Handlers Guide](../Guides/event-handlers.mdx).
