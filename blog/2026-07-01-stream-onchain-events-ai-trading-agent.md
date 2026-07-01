---
title: How to Stream Onchain Events to an AI Trading Agent
sidebar_label: How to Stream Onchain Events to an AI Trading Agent
slug: /stream-onchain-events-ai-trading-agent
tags: [ai]
description: "How to feed real-time onchain events into an AI trading agent's decision loop with HyperIndex, using working schema and queries from the published Polymarket reference indexer."
image: /blog-assets/stream-onchain-events-ai-trading-agent.png
last_update:
  date: 2026-07-01
  author: Jordyn Laurier
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/stream-onchain-events-ai-trading-agent.png" alt="How to Stream Onchain Events to an AI Trading Agent" width="100%"/>

<!--truncate-->

:::note TL;DR
- A trading agent is only as good as its feed. It needs a data source that is as fast and as accurate as possible, including staying correct through reorgs. Raw RPC gives you none of that out of the box.
- One layer does the work. HyperIndex indexes onchain events into GraphQL entities, and it ingests through HyperSync internally with reorg detection built in, so you get speed and rollback safety from a single layer.
- HyperIndex exposes a single GraphQL endpoint. The agent polls it for new events as they land, and queries the same endpoint for historical state: an address's track record, a market's running volume, open positions. No rebuilding history inside the context window.
- Reorgs are a normal part of consensus. HyperIndex rolls entity state back automatically when a chain reorgs, but state at the very head is provisional, so for anything that moves money, the conservative path is to act on events from finalized blocks.
- The schema and queries below come from the published Polymarket reference indexer.
:::

The interesting question about AI trading agents is not the model, it is the feed. An agent reasoning over markets needs to see events with as little latency as possible after they land onchain, in a shape it can reason about, from a source it can trust after a reorg. This guide builds that feed with one layer, then shows where the agent plugs in.

## The Architecture in One Paragraph

One layer, accessed two ways. HyperIndex turns a contract's events into structured entities served over GraphQL. Under the hood, it streams from HyperSync for fast ingestion, while HyperIndex detects reorgs and rolls entity state back when one happens. The agent talks to a single GraphQL endpoint: it polls for new trades as they land, and queries the same endpoint for state, market totals, an address's history, and open positions. There is no separate ingestion pipeline to run and no in-memory state to rebuild.

## Step 1: Index the events once

This is the indexing setup from our [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer), which watches `OrderFilled` events from the Polymarket Exchange contracts on Polygon. You define the contract and event once in `config.yaml`:

```yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: polymarket-indexer
field_selection:
  transaction_fields:
    - hash
contracts:
  - name: Exchange
    abi_file_path: ./abis/Exchange.json
    events:
      - event: "OrderFilled(bytes32 indexed orderHash, address indexed maker, address indexed taker, uint256 makerAssetId, uint256 takerAssetId, uint256 makerAmountFilled, uint256 takerAmountFilled, uint256 fee)"
chains:
  - id: 137 # Polygon
    start_block: 33605403
    contracts:
      - name: Exchange
        address:
          - "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
          - "0xC5d563A36AE78145C45a50134d48A1215220f80a"
```

You define the entities once in `schema.graphql`. One entity for the raw trade the agent reacts to, one aggregate the agent reads for context:

```graphql
type OrderFilledEvent
  @index(fields: ["maker", ["timestamp", "DESC"]])
  @index(fields: ["makerAssetId", ["timestamp", "DESC"]]) {
  id: ID!
  transactionHash: String!
  timestamp: BigInt! @index
  orderHash: String! @index
  maker: String! @index
  taker: String! @index
  makerAssetId: String! @index
  takerAssetId: String! @index
  makerAmountFilled: BigInt!
  takerAmountFilled: BigInt!
  fee: BigInt!
}

type Orderbook {
  id: ID!
  tradesQuantity: BigInt!
  buysQuantity: BigInt!
  sellsQuantity: BigInt!
  collateralVolume: BigInt!
  scaledCollateralVolume: BigDecimal!
}
```

And you map the event to those entities once in the handler. Every field comes straight off the `OrderFilled` event, and the running totals are computed at indexing time so the agent never has to aggregate at query time:

```typescript
import { indexer } from "envio";

indexer.onEvent({ contract: "Exchange", event: "OrderFilled" }, async ({ event, context }) => {
  context.OrderFilledEvent.set({
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    transactionHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    orderHash: event.params.orderHash,
    maker: event.params.maker,
    taker: event.params.taker,
    makerAssetId: event.params.makerAssetId.toString(),
    takerAssetId: event.params.takerAssetId.toString(),
    makerAmountFilled: event.params.makerAmountFilled,
    takerAmountFilled: event.params.takerAmountFilled,
    fee: event.params.fee,
  });
});
```

The same pattern works for DEX swaps, liquidations, or any event family on any HyperSync-supported chain by changing the contract, the event signature, and the chain ID.

## Wake the agent on new trades

A GraphQL subscription is the agent's trigger. The agent holds an open subscription to the endpoint and gets pushed each new `OrderFilledEvent` as it lands, within a block of it happening, already decoded into the fields you defined:

```graphql
subscription LatestTrades {
  OrderFilledEvent(order_by: { timestamp: desc }, limit: 1) {
    maker
    taker
    makerAssetId
    makerAmountFilled
    takerAmountFilled
    timestamp
  }
}
```

If a long-lived subscription does not fit your runtime, the same query polled on a short interval gives you the same trigger with simpler plumbing. Either way the agent reacts to structured trades, not raw logs.

## Step 2: Give the Agent State, Not Just Ticks

A trigger tells the agent what just happened. Trading decisions usually need what has been happening, and rebuilding that from raw events inside a context window wastes tokens and invites errors. Because the handler already wrote the history and the running totals, the agent's pre-decision check is a query, not a computation. Pull a maker's recent track record:

```graphql
query MakerHistory($maker: String!) {
  OrderFilledEvent(
    where: { maker: { _eq: $maker } }
    order_by: { timestamp: desc }
    limit: 100
  ) {
    makerAmountFilled
    takerAmountFilled
    timestamp
  }
}
```

Or read the market's running volume straight off the aggregate, with no runtime aggregation:

```graphql
query MarketVolume {
  Orderbook {
    tradesQuantity
    scaledCollateralVolume
  }
}
```

Computing aggregates at indexing time rather than query time is the recommended pattern, and it is what keeps these reads fast at scale. The [Navigating Hasura](https://docs.envio.dev/docs/HyperIndex/navigating-hasura) guide covers the full query reference.

## Step 3: Take Reorgs Seriously

Reorgs are a normal part of consensus, not an Envio thing and not an edge case you can design away. A chain can fork at the head and resolve to a different set of blocks, and any event read from those orphaned blocks describes something that, as far as the canonical chain is concerned, never happened. This is true of every data source, raw RPC included.

HyperIndex handles the database side for you. Reorg support is on by default, and as long as HyperIndex ingests through HyperSync, reorg detection is guaranteed. When a reorg is detected, entity state is rolled back automatically to the canonical chain, with no rollback logic in your handlers. The full mechanics are in [Understanding and Handling Chain Reorganizations](https://docs.envio.dev/docs/HyperIndex/reorgs-support).

The caveat that matters for a trading agent is this. Rollback corrects the database, it cannot recall a trade. There is a short window at the head where the indexed state can reflect a block that later gets orphaned. An agent that reads in that window and acts on it has already sent the order by the time the rollback fires. The data corrects, the trade does not. A dashboard showing a stale number is harmless; an agent trading on one is not.

So treat the head-of-chain state as provisional. HyperIndex considers a block safe from reorganization once it sits below the confirmation threshold, which defaults to 200 blocks below the head and is configurable per chain via `max_reorg_depth`. For anything that moves money, the conservative path is to act on events from finalized blocks and let the freshest head data inform analysis rather than execution. None of this is specific to Envio. Any trading agent on any stack faces the same finality question, regardless of where its data comes from.

## A Note on the Trading Part

Everything above is the data layer, and it is the part worth automating first. Order execution is where agent autonomy should stop being the default. Keep execution behind explicit limits, position caps, and human-controlled keys, and let the agent's edge be that it sees and understands the market faster, not that it can spend unsupervised.

This blog is an example of what you can build on HyperIndex, not a trading strategy and not financial advice. Whatever you ship on top of it is your own research and your own decision.

## Get Started

- [HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/quickstart)
- [HyperIndex Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai)
- [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer)
- [Understanding and Handling Chain Reorganizations](https://docs.envio.dev/docs/HyperIndex/reorgs-support)
- [Indexing & Reorgs](https://docs.envio.dev/blog/indexing-and-reorgs)

## Frequently Asked Questions

### Should my agent subscribe to the indexer or query it?

Both, for different questions. A GraphQL subscription is the trigger that wakes the agent within a block of an event landing. A GraphQL query is the memory that answers aggregate questions like an address's trade history or a market's running volume without rebuilding state in the agent's context. The stream wakes the agent, the query informs the decision, and both hit the same endpoint.

### What happens if my agent acts on an event that later gets reorged?

That is the failure mode to design against, because the rollback fixes data but cannot recall a trade. HyperIndex rolls indexed entity state back to the canonical chain automatically when a reorg is detected, but an agent that read head-of-chain state and traded on it in the window before detection has already acted. HyperIndex considers a block safe from reorganization at a confirmation threshold that defaults to 200 blocks below the head and is configurable per chain via `max_reorg_depth`. For stateful actions that move money, prefer events from finalized blocks.

### What chains can I stream trading events from?

Any HyperSync-supported network works with the same indexer and a one-line chain change in `config.yaml`. Chains without native HyperSync coverage are reachable through HyperIndex over standard RPC. The same schema and handler carry across chains unchanged.

### How do I handle high-frequency events without overwhelming the agent?

Compute and store aggregates in your handlers at indexing time, then have the agent read those precomputed entities rather than fetching raw rows and summarising inside the context window. Field selection keeps each response small, and the running totals on an aggregate entity like `Orderbook` give the agent market context in a single cheap read.

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service) or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
