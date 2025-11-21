---
id: migrate-from-alchemy
title: How to Migrate from Alchemy Subgraphs to Envio
sidebar_label: Migrate from Alchemy
slug: /migrate-from-alchemy
description: Learn how to migrate your Alchemy Subgraphs to Envio for faster indexing, multichain support, and a better developer experience.
---

:::note
Note: Alchemy Subgraphs are sunsetting on Dec 8th, 2025. Envio is offering affected Alchemy users 2 months of free hosting on Envio, along with full white-glove migration support to help projects move over smoothly.

For more info on how you can start your free trial or book migration support, visit this [page](https://envio.dev/alchemy-migration) to learn more.
:::

Migrating Alchemy Subgraphs to Envio’s HyperIndex is a simple and developer friendly process. Alchemy Subgraphs follow TheGraph’s model and HyperIndex uses a very similar structure, so most of your existing setup can carry over cleanly.

If you're familiar with TheGraph’s libraries, the migration process should be easy to follow. You can also utilize tools like Cursor to speed things up. If you are new to HyperIndex, we strongly recommend starting with our [Getting Started](https://docs.envio.dev/docs/HyperIndex/getting-started) guide before you begin your migration from Alchemy.

## Why Migrate to Envio’s HyperIndex?
- **High Speed Performance**: 143x faster than Subgraphs
- **Lower Costs**: Reduced infrastructure requirements and operational expenses
- **Better Developer Experience**: Simplified configuration and deployment
- **Multichain Native**: Index data across multiple EVM chains through a single HyperIndex project
- **Local Development**: Run your indexers locally for fast iteration and easier debugging
- **White Glove Migration Support**: Get direct support from the Envio team for a smoother migration. 
- **GitOps Ready Deployments**: Link your GitHub repo and manage multiple deployments in a clean unified workflow
- **Advanced Features**: Access to features like external calls and block handlers
- **Seamless Integration**: Easily integrate existing GraphQL APIs and applications 


## How to Migrate Alchemy’s Subgraphs to Envio in 4 steps

This Migration consists of 4 major steps:

1. Create a HyperIndex Project
2. subgraph.yaml Migration to config.yaml
3. schema.graphql Migration
4. Event Handler Migration


### Create a HyperIndex Project
Start by spinning up a basic HyperIndex project with this command:

```bash
pnpx envio init template --name alchemy-migration --directory alchemy-migration --template  greeter --api-token "YOUR_ENVIO_API_KEY"
```

Once the project is created, drop your API key into the .env file and you’re good to go.

### subgraph.yaml Migration to config.yaml

In HyperIndex, all project configuration lives in `config.yaml`. This is where you define contract addresses, the networks you want to index, and the specific events you want to track from those contracts.

Below is an example showing how a Uniswap V4 subgraph.yaml maps to a HyperIndex `config.yaml` in a real migration.

<div className="row">
<div className="col col--6">
The Graph - `subgraph.yaml`
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

If you hit any issues, check the [Configuration File](https://docs.envio.dev/docs/HyperIndex/configuration-file) docs or reach out to our team in [Discord](https://discord.com/invite/envio).

### schema.graphql Migration

This step is simple. You keep the entire file as is, with one small change: remove all `@entity` directives from your entities. Everything else stays the same.

### Event Handler Migration

This is the final step of the migration which consists of two parts:

- Moving from AssemblyScript to TypeScript
- Updating Subgraph syntax to HyperIndex syntax


#### AssemblyScript to TypeScript
HyperIndex uses TypeScript instead of AssemblyScript. Since AssemblyScript is a subset of TypeScript, you can simply copy most of your code over without worrying about major syntax changes.

#### Subgraph to HyperIndex
The HyperIndex workflow is very similar to Subgraphs, but there are a few important differences to keep in mind:

- Replace `ENTITY.save()` with `context.ENTITY.set(VALUES)`
- Handlers need to be async
- Use `await` when loading entities

As you start using HyperIndex, you’ll pick up the differences quickly.

Here is a code snippet to give you a sense of what these changes look like in practice.

<div className="row">
    <div className="col col--6">
    The Graph - `eventHandler.ts`

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

For a few extra tips on migrating Subgraphs to HyperIndex, check out our other [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide#extra-tips) in our docs.

## Share Your Learnings

If you come across anything useful during your migration, please feel free to contribute. Simply open a [PR](https://github.com/enviodev/docs/pulls) to this guide and help future developers.

## Getting Help

Join our [Discord](https://discord.com/invite/envio) if you need support. It is the fastest way to get direct help from the team and the community.
