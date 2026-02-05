---
id: migration-guide
title: Migrate from a Subgraph to HyperIndex
sidebar_label: Migrate from TheGraph
slug: /migration-guide
description: Learn how to migrate your Subgraphs to Envio for faster indexing, multichain support, and a better developer experience.
---


# How to Migrate from TheGraph to Envio

:::info
Please reach out to our team on [Discord](https://discord.gg/envio) for personalized migration assistance.
:::

## Introduction

Migrating from a subgraph to HyperIndex is designed to be a developer-friendly process. HyperIndex draws strong inspiration from TheGraph’s subgraph architecture, which makes the migration simple, especially with the help of coding assistants like Cursor and AI tools (don't forget to use our [ai friendly docs](/docs/HyperIndex-LLM/hyperindex-complete)).

The process is simple but requires a good understanding of the underlying concepts. If you are new to HyperIndex, we recommend starting with the [Getting Started](../HyperIndex/getting-started) guide.

## Why Migrate to HyperIndex?

- **Superior Performance**: Up to 100x faster indexing speeds
- **Lower Costs**: Reduced infrastructure requirements and operational expenses
- **Better Developer Experience**: Simplified configuration and deployment
- **Advanced Features**: Access to capabilities not available in other indexing solutions
- **Seamless Integration**: Easy integration with existing GraphQL APIs and applications

## Subgraph to HyperIndex Migration Overview

Migration consists of three major steps:

1. Subgraph.yaml migration
1. Schema migration - near copy paste
1. Event handler migration

At any point in the migration run

`pnpm envio codegen`

to verify the `config.yaml` and `schema.graphql` files are valid.

or run

`pnpm dev`

to verify the indexer is running and indexing correctly.

### 0.5 Use `npx envio init` to generate a boilerplate

As a first step, we recommend using `npx envio init` to generate a boilerplate for your project. This will handle the creation of the `config.yaml` file and a basic `schema.graphql` file with generic handler functions.

### 1. `subgraph.yaml` → `config.yaml`

`npx envio init` will generate this for you. It's a simple configuration file conversion. Effectively specifying which contracts to index, which networks to index (multiple networks can be specified with envio) and which events from those contracts to index.

Take the following conversion as an example, where the `subgraph.yaml` file is converted to `config.yaml` the below comparisons is for the Uniswap v4 pool manager subgraph.

<div className="row">
<div className="col col--6">
theGraph - `subgraph.yaml`
```yaml
specVersion: 0.0.4
description: Uniswap is a decentralized protocol for automated token exchange on Ethereum.
repository: https://github.com/Uniswap/v4-subgraph
schema:
  file: ./schema.graphql
features:
  - nonFatalErrors
  - grafting
  - kind: ethereum/contract
    name: PositionManager
    network: mainnet
    source:
      abi: PositionManager
      address: "0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e"
      startBlock: 21689089
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      file: ./src/mappings/index.ts
      entities:
        - Position
      abis:
        - name: PositionManager
          file: ./abis/PositionManager.json
      eventHandlers:
        - event: Subscription(indexed uint256,indexed address)
          handler: handleSubscription
        - event: Unsubscription(indexed uint256,indexed address)
          handler: handleUnsubscription
        - event: Transfer(indexed address,indexed address,indexed uint256)
          handler: handleTransfer  
          ```
</div>
<div className="col col--6">
HyperIndex - `config.yaml`
```yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: uni-v4-indexer
networks:
  - id: 1
    start_block: 21689089
    contracts:      
      - name: PositionManager
        address: 0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e
        handler: src/EventHandlers.ts
        events:        
        - event: Subscription(uint256 indexed tokenId, address indexed subscriber)
        - event: Unsubscription(uint256 indexed tokenId, address indexed subscriber)          
        - event: Transfer(address indexed from, address indexed to, uint256 indexed id)
          ```
</div>
</div>

For any potential hurdles, please refer to the [Configuration File](../HyperIndex/configuration-file) documentation.

## 2. Schema migration

`copy` & `paste` the schema from the subgraph to the HyperIndex config file.

Small nuance differences:

- You can remove the `@entity` directive
- [Enums](../HyperIndex/schema#enum-types)
- [BigDecimals](../HyperIndex/schema#working-with-bigdecimal)

## 3. Event handler migration

This consists of two parts

1. Converting assemblyscript to typescript
1. Converting the subgraph syntax to HyperIndex syntax

### 3.1 Converting Assemblyscript to Typescript

The subgraph uses assemblyscript to write event handlers. The HyperIndex syntax is usually in typescript. Since assemblyscript is a subset of typescript, it's quite simple to copy and paste the code, especially so for pure functions.

### 3.2 Converting the subgraph syntax to HyperIndex syntax

There are some subtle differences in the syntax of the subgraph and HyperIndex. Including but not limited to the following:

- Replace Entity.save() with context.Entity.set()
- Convert to async handler functions
- Use `await` for loading entities `const x = await context.Entity.get(id)`
- Use [dynamic contract registration](../HyperIndex/dynamic-contracts) to register contracts

The below code snippets can give you a basic idea of what this difference might look like.

<div className="row">
<div className="col col--6">
theGraph - `eventHandler.ts`

```typescript
export function handleSubscription(event: SubscriptionEvent): void {
  const subscription = new Subscribe(event.transaction.hash + event.logIndex);

  subscription.tokenId = event.params.tokenId;
  subscription.address = event.params.subscriber.toHexString();
  subscription.logIndex = event.logIndex;
  subscription.blockNumber = event.block.number;
  subscription.position = event.params.tokenId;

  subscription.save();
}
```

</div>
<div className="col col--6">
HyperIndex - `eventHandler.ts`
```typescript
PoolManager.Subscription.handler( async (event, context) => {
  const entity = {
    id: event.transaction.hash + event.logIndex,
    tokenId: event.params.tokenId,
    address: event.params.subscriber,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
    position: event.params.tokenId
  }

context.Subscription.set(entity);
})

```

</div>
</div>

## Extra tips

HyperIndex is a powerful tool that can be used to index any contract. There are some features that are especially powerful that go above subgraph implementations and so in some cases you may want to optimise your migration to HyperIndex further to take advantage of these features. Here are some useful tips:

- Use the `field_selection` option to add additional fields to your index. Doc here: [field selection](../HyperIndex/configuration-file#field-selection)
- Use the `unordered_multichain_mode` option to enable unordered multichain mode, this is the most common need for multichain indexing. However comes with tradeoffs worth understanding. Doc here: [unordered multichain mode](../HyperIndex/configuration-file#unordered-multichain-mode)
- Use wildcard indexing to index by event signatures rather than by contract address.
- HyperIndex uses the standard GraphQL query language, whereas TheGraph uses a custom GraphQL syntax. You can read about the differences and how to convert queries in our [Query Conversion Guide](/docs/HyperIndex/query-conversion). We also provide a query converter tool for backwards compatibility with existing TheGraph queries.
- Loaders are a powerful feature to optimize historical sync performance. You can read more about them [here](../HyperIndex/loaders).
- HyperIndex is very flexible and can be used to index offchain data too or send messages to a queue etc for fetching external data, you can further optimise the fetching by using the [effects api](/docs/HyperIndex/effect-api)

## Validating Your Migration

After completing your migration, it's important to verify that your HyperIndex indexer produces the same data as your original subgraph. Use the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) CLI tool to compare results between both endpoints and identify any discrepancies. The tool automatically generates entity configs from your GraphQL schema and provides detailed field-level analysis of differences.

## Share Your Learnings

If you discover helpful tips during your migration, we'd love contributions! Open a [PR](https://github.com/enviodev/docs) to this guide and help future developers.

## Getting Help

**Join Our Discord**: The fastest way to get personalized help is through our [Discord community](https://discord.gg/envio).
```
