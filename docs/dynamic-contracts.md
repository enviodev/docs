---
id: dynamic-contracts
title: Loading Dynamic Contracts
sidebar_label: Dynamic Contracts / Factories
slug: /dynamic-contracts
---

# Dynamic Contracts / Factories

If you have a system that does not know all the contracts that need indexing at the beginning i.e. you have a factory contract that dynamically creates new contracts over time, - you can use dynamic contracts.

## Loader Function

Contract factories are currently supported in the `loader` function of the event that you want to register the contract in.

You can register a dynamic contract by including the following line inside the loader function:

```javascript
context.contractRegistration.add<your-contract-name>(<address-of-the-contract>)
```

> The syntax is exactly same for JavaScript, TypeScript and ReScript.

## Example using a NFT factory

In the NFT factory example, we want to dynamically register all the `SimpleNft` contracts that get created by the `NftFactory` contract, via `SimpleNftCreated` events.

Both types of contracts will be defined in the configuration file, however address field will be omitted for the `SimpleNft` contract - address values will instead be retrieved from `SimpleNftCreated` event.

### Config file

```yaml
ame: nftindexer
description: NFT Factory
networks:
  - id: 1337
    rpc_config:
      url: http://localhost:8545
    start_block: 0
    contracts:
      - name: NftFactory
        abi_file_path: abis/NftFactory.json
        address: "0x4675a6B115329294e0518A2B7cC12B70987895C4"
        handler: src/EventHandlers.ts
        events:
          - event: "SimpleNftCreated (string name, string symbol, uint256 maxSupply, address contractAddress)"
            requiredEntities: []
      - name: SimpleNft
        abi_file_path: abis/SimpleNft.json
        handler: src/EventHandlers.ts
        events:
          - event: "Transfer"
            requiredEntities:
              - name: "User"
                labels:
                  - "userFrom"
                  - "userTo"
              - name: Nftcollection
                labels:
                  - "nftCollectionUpdated"
              - name: Token
                labels:n
                  - "existingTransferredToken"
```

### Registering `SimpleNft` contracts in loader function for `SimpleNftCreated` event

```javascript
context.contractRegistration.addSimpleNft(event.params.contractAddress);
```

> The syntax is exactly same for JavaScript, TypeScript and ReScript.

For more information on how to write the event handlers file, go [here](./event-handlers.mdx).
