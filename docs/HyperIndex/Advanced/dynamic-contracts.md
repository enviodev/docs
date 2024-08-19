---
id: dynamic-contracts
title: Loading Dynamic Contracts
sidebar_label: Dynamic Contracts / Factories
slug: /dynamic-contracts
---

# Dynamic Contracts / Factories

If you have a system that does not know all the contracts that need indexing at the beginning (e.g., a factory contract that dynamically creates new contracts over time), you can use dynamic contracts.

<!--
///TODO: add back a video once it has been updated to v2
<iframe width="560" height="315" src="https://www.youtube.com/embed/O6qPXZ6kjYY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->

## Contract Registration

Contract factories are currently supported in the event's `contractRegister` function that you want to register the contract in.

You can register a dynamic contract by including the following line inside the `contractRegister` function:

```javascript
<contract-name>.<event-name>.contractRegister(({ event, context }) => {
  context.add<your-contract-name>(<address-of-the-contract>);
});
```

> The syntax is exactly the same for JavaScript, TypeScript, and ReScript.

## Contract Registration on Fuel

The HyperIndex on Fuel still uses the v1 API, so the contract registration is done via the `loader` function.

You can register a dynamic contract by including the following line inside the loader function:

```javascript
context.contractRegistration.add<your-contract-name>(<address-of-the-contract>)
```

> The syntax is exactly same for JavaScript, TypeScript and ReScript.

## Example using an NFT factory

In the NFT factory example, we want to dynamically register all the `SimpleNft` contracts that get created by the `NftFactory` contract, via `SimpleNftCreated` events.

Both types of contracts will be defined in the configuration file; however, the address field will be omitted for the `SimpleNft` contract - address values will instead be retrieved from the `SimpleNftCreated` event.

### Config file

```yaml
name: nftindexer
description: NFT Factory
networks:
  - id: 1337
    start_block: 0
    contracts:
      - name: NftFactory
        abi_file_path: abis/NftFactory.json
        address: 0x4675a6B115329294e0518A2B7cC12B70987895C4
        handler: src/EventHandlers.ts
        events:
          - event: SimpleNftCreated (string name, string symbol, uint256 maxSupply, address contractAddress)
      - name: SimpleNft
        abi_file_path: abis/SimpleNft.json
        handler: src/EventHandlers.ts
        events:
          - event: Transfer (address from, address to, uint256 tokenId)
```

### Registering `SimpleNft` contracts in `contractRegister` function for `SimpleNftCreated` event

```javascript
NftFactory.SimpleNftCreated.contractRegister(({ event, context }) => {
  context.addSimpleNft(event.params.contractAddress);
});
```

> The syntax is exactly the same for JavaScript, TypeScript, and ReScript.

For more information on how to write the event handlers file, go [here](../Guides/event-handlers.mdx).

## Important Note

When a dynamic contract is loaded, we load all the events in the block in which the contract was registered (even if they were from a previous transaction). Please let us know if this is an issue for you, as the team also has a solution where it only loads events after the event that loaded the contract. We decided this was better since many contracts emit an event upon creation, and this occurs before the contract is loaded (for example, in Uniswap v2).
