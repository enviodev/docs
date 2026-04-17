---
title: "How Envio Simplifies Data Retrieval for Multichain dApps"
sidebar_label: How Envio Simplifies Data Retrieval for Multichain dApps
slug: /how-envio-simplifies-data-retrieval-for-multi-chain-dapps
description: "How multichain indexing works with Envio HyperIndex, with a practical walkthrough of config, schema, and event handlers for indexing across multiple EVM chains."
image: /blog-assets/envio-simplifies-data-retrieval-for-multi-chain-dapps.png
last_update:
  date: 2026-04-15
---

Author: [Jordyn Laurier](https://x.com/j_o_r_d_y_s), Head of Marketing & Operations

<img src="/blog-assets/envio-simplifies-data-retrieval-for-multi-chain-dapps.png" alt="How Envio Simplifies Data Retrieval for Multichain dApps" width="100%"/>

<!--truncate-->

:::note TL;DR
- Deploying a dApp across multiple chains creates a fragmented data problem. Each chain has its own events, its own state, and no native way to query across them together.
- Envio HyperIndex solves this with a single indexer instance that reads events from multiple networks and exposes everything through one GraphQL endpoint.
- Configuration is a single `config.yaml` file. No separate deployments, no cross-service data joins.
:::

The multichain future is already here. Protocols like [Uniswap](https://app.uniswap.org/), [Aave](https://aave.com/), and [Compound](https://compound.finance/) are deployed across Ethereum, Arbitrum, Optimism, Base, Polygon, and more. Reaching users on multiple chains means accepting the data fragmentation that comes with it.

For developers, this fragmentation is a real infrastructure problem. Traditional indexing approaches require a separate indexer and database per chain. Aggregating that data in your frontend means either stitching together multiple API calls or building additional backend logic to consolidate it. Both approaches add complexity and maintenance overhead.

## The Multichain Data Problem

When a dApp is deployed across multiple chains, every interaction that matters (swaps, transfers, liquidations, mints) is emitted as an event on each respective chain. There is no native cross-chain view of this data.

The conventional approach requires:

- One indexer deployment per chain
- One database per chain
- Custom aggregation logic in the frontend or a separate backend layer

This compounds quickly. A protocol on five chains needs five indexer deployments to maintain, five databases to keep in sync, and aggregation logic that breaks every time a new chain is added.

## Multichain Indexing with Envio HyperIndex

[Envio HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) handles multichain indexing from a single indexer instance. All networks are defined in one `config.yaml`. All indexed data lands in one database. Everything is queryable through one GraphQL endpoint.

Other indexers require a separate subgraph or pipeline per chain. With Envio, adding a new chain is a config change, not a new deployment.

## Example: Greeter Contract on Polygon and Linea

The following example walks through a multichain Greeter indexer that listens for `NewGreeting` events from contracts deployed on both Polygon and Linea.

### config.yaml

```yaml
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
    start_block: 45336336
    contracts:
      - name: Greeter
        abi_file_path: ./abis/greeter-abi.json
        handler: ./src/EventHandlers.ts
        events:
          - event: NewGreeting
  - id: 59144 # Linea
    start_block: 367801
    contracts:
      - name: Greeter
        abi_file_path: ./abis/greeter-abi.json
        handler: ./src/EventHandlers.ts
        events:
          - event: NewGreeting
```

Both networks share the same handler and ABI. Adding a third chain means adding another network block. The handler logic stays unchanged.

### schema.graphql

```graphql
type User {
  id: ID!
  greetings: [String!]!
  latestGreeting: String!
  numberOfGreetings: Int!
}
```

### Event handler

A single TypeScript handler processes `NewGreeting` events from both chains:

```typescript
import { Greeter } from "generated";

Greeter.NewGreeting.handler(async ({ event, context }) => {
  const currentUser = await context.User.get(event.params.user.toString());

  context.User.set({
    id: event.params.user.toString(),
    latestGreeting: event.params.greeting,
    numberOfGreetings: (currentUser?.numberOfGreetings ?? 0) + 1,
    greetings: [...(currentUser?.greetings ?? []), event.params.greeting],
  });
});
```

The handler runs identically for events from any network in the config. Chain-specific context (like `event.chainId`) is available if you need it for cross-chain logic.

For the full multichain indexing documentation, see the [Envio docs](https://docs.envio.dev/docs/HyperIndex/multichain-indexing). For a more complex multichain example, see the [Compound V2 Liquidation Metrics indexer](https://docs.envio.dev/docs/HyperIndex/example-liquidation-metrics).

## Frequently asked questions

### How does Envio handle events from multiple chains in one indexer?

All networks are defined in a single `config.yaml`. HyperIndex processes events from each network in parallel and writes them to a shared database. Your GraphQL API reflects the combined state of all indexed chains.

### Do I need separate deployments for each chain?

No. A single HyperIndex instance handles all configured networks. One deployment, one database, one GraphQL endpoint.

### Can the same handler logic run across different chains?

Yes. A single handler function processes matching events from all networks in your config. If you need to apply chain-specific logic, `event.chainId` is available in the handler context.

### How many chains does Envio support?

HyperSync natively supports 70+ EVM chains. Any supported chain can be added to your `config.yaml`. For chains not yet covered by HyperSync, you can fall back to an RPC endpoint without changing your handler code.

### Where can I see a full multichain indexing example?

The [Greeter tutorial](https://docs.envio.dev/docs/greeter-tutorial) in the Envio docs walks through multichain indexing step by step. The [Compound V2 Liquidation Metrics](https://docs.envio.dev/docs/HyperIndex/example-liquidation-metrics) indexer is a more complex real-world example covering 9 forks across 4 chains.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
