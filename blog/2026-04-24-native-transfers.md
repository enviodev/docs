---
title: How to Track Native ETH Transfers Using Envio's HyperSync
sidebar_label: How to Track Native ETH Transfers Using Envio's HyperSync
slug: /tracking-native-eth-transfers-hypersync
tags: ["tutorials"]
description: "Native ETH transfers don't emit event logs, so tracking them over RPC means slow trace calls. This guide shows how to stream native transfers efficiently using HyperSync's trace filtering with the Node.js client in a Bun project."
image: /blog-assets/tracking-native-eth-transfers-hypersync.png
authors: ["nikbhintade", "j_o_r_d_y_s"]
last_update:
  date: 2026-04-17
  author: Nikhil Bhintade
---

![Cover image for the blog with title](/blog-assets/tracking-native-eth-transfers-hypersync.png)
:::info TL;DR

- Tracking native ETH transfers onchain requires parsing traces rather than event logs, which is slow over standard RPC.
- HyperSync exposes trace filtering directly, letting you stream native transfers by filtering on `call_type=call` with a value threshold.
- Full working example uses the Node.js client in a Bun project, streaming results until 10 transfers above 0.005 ETH are collected.
- Trace support is available on Ethereum, Base, Arbitrum, Gnosis, and Monad.

:::

Tracking native token transfers onchain is trickier than ERC-20 transfers. There's no event log to index, so you have to dig through traces. With a standard RPC node, that means calling eth_traceBlock and iterating every trace in every block, which is slow.
HyperSync gives you a faster alternative: a data retrieval layer with native trace filtering.


## Prerequisites

We are going to use [Bun](https://bun.com/docs/installation) for this article, so make sure you have it installed. If you want to use another runtime that supports TypeScript, you can do that too.

You will also need an Envio API token to access HyperSync. If you don't have one, go to [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) to create one. Step-by-step instructions are at [docs.envio.dev/docs/HyperSync/api-tokens](https://docs.envio.dev/docs/HyperSync/api-tokens#generating-api-tokens).


## HyperSync & Queries

HyperSync is optimized for data retrieval, not consensus, so it's far faster than RPC nodes. To fetch data, you send a query describing what you want and HyperSync returns only that data.

A typical query looks like this:

```json
{
  "fromBlock": 0,
  "transactions": [
    { "from": ["0x5a830d7a5149b2f1a2e72d15cd51b84379ee81e5"] },
    { "to": ["0x5a830d7a5149b2f1a2e72d15cd51b84379ee81e5"] }
  ],
  "fieldSelection": {
    "transaction": ["BlockNumber", "Hash", "From", "To", "Value"]
  }
}
```

Every query has three main parts: `fromBlock`, a filter section (one of `transactions`, `blocks`, `logs`, or `traces`), and `fieldSelection`. See the [full query reference](https://docs.envio.dev/docs/HyperSync/hypersync-query#query-structure-reference) for all available options.

### Filtering for Native Transfers

Native ETH transfers occur only in traces where `call_type` is `call` — not `staticcall` or `delegatecall`. Filtering on `callType` directly is more efficient than filtering on trace `kind`, since it lets HyperSync skip irrelevant trace types upfront.

## Building the Fetcher

### Setup

Create a new Bun project and install the HyperSync client:

```sh
bun init -y && bun install @envio-dev/hypersync-client
```

Add your API token to a `.env` file. If you don't have one, generate it at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens).

```sh
ENVIO_API_TOKEN=your_token_here
```

> **Note:** HyperSync trace support is currently available on Ethereum, Base, Arbitrum, Gnosis, and Monad. [Reach out](mailto:nikhil@envio.dev) if you need trace support for other chains.

### Imports & Helpers

```ts
import { HypersyncClient, type TraceField } from "@envio-dev/hypersync-client";
```

We'll filter out dust transfers using a minimum threshold and format values as human-readable ETH:

```ts
const THRESHOLD_WEI = BigInt("5000000000000000"); // 0.005 ETH
const WEI_PER_ETH = BigInt("1000000000000000000"); // 1 ETH
const DECIMALS = 6;

function weiToEth(wei: bigint): string {
  const whole = wei / WEI_PER_ETH;
  const remainder = wei % WEI_PER_ETH;
  const remainderStr = remainder.toString().padStart(18, "0").slice(0, DECIMALS);
  return `${whole}.${remainderStr}`;
}
```

### Creating the Client

Use the Ethereum traces endpoint:

```ts
const client = new HypersyncClient({
  url: "https://eth-traces.hypersync.xyz",
  apiToken: process.env.ENVIO_API_TOKEN!,
});
```

### Query

Request only `call` type traces and select the fields we care about:

```ts
const query = {
  fromBlock: 22000000,
  traces: [
    {
      callType: ["call"],
    },
  ],
  fieldSelection: {
    trace: ["From", "To", "Value", "CallType", "BlockNumber"] as TraceField[],
  },
};
```

### Streaming Results

HyperSync offers two fetch modes: `get` (single response) and `stream` (continuous). We'll stream and stop once we've collected 10 transfers above the threshold:

```ts
console.log("Fetching native transfers (call_type=call, value > 0.005 ETH)...\n");

const results: { from: string; to: string; valueEth: string }[] = [];

const stream = await client.stream(query, {});

outer: while (true) {
  const res = await stream.recv();

  if (res === null) break; // stream exhausted

  if (res.data?.traces) {
    for (const trace of res.data.traces) {
      if (trace.value === undefined || trace.value === null) continue;
      if (trace.value <= THRESHOLD_WEI) continue;

      results.push({
        from: trace.from ?? "unknown",
        to: trace.to ?? "unknown",
        valueEth: weiToEth(trace.value),
      });

      if (results.length >= 10) break outer;
    }
  }
}

await stream.close();

if (results.length === 0) {
  console.log("No results found.");
} else {
  console.table(
    results.map((r) => ({
      From: r.from,
      To: r.to,
      "Value (ETH)": r.valueEth,
    }))
  );
}
```

Run it with:

```sh
bun run index.ts
```

![Output table showing native transfers](/blog-assets/native-transfers-cli-output.png)

## Next Steps

We only used callType as a filter here. From this starting point you can track a specific wallet by adding from or to address filters to the trace selection, narrow further using other TraceSelection fields like sighash or kind, or switch the endpoint to another HyperSync trace-enabled network to run the same query across chains. 

See the HyperSync query reference for the full TraceSelection schema and field list.

## Frequently Asked Questions

### What Is HyperSync?
[HyperSync](https://docs.envio.dev/docs/HyperSync/overview) is Envio's high-performance blockchain data retrieval layer, built as an alternative to traditional JSON-RPC endpoints. It gives developers direct access to onchain data up to 2000x faster than standard RPC methods, with client libraries for Python, Rust, Node.js, and Go across 70+ EVM chains.

### Why Can't I Track Native ETH Transfers Using Event Logs?
Native ETH transfers don't emit events. The ERC-20 `Transfer` event is a standard contract event, but native ETH moves at the protocol level and only shows up in transaction traces. To track them, you have to query traces directly.

### What's the Difference Between `call_type` and `kind` When Filtering Traces?
`kind` is the trace type (`call`, `create`, `suicide`, `reward`). `call_type` is the sub-type of a call trace (`call`, `delegatecall`, `staticcall`). Native ETH transfers only occur when `call_type` is `call`, so filtering on `call_type` directly is more efficient than filtering on `kind` and then narrowing down.

### Which Chains Support Trace Queries on HyperSync?
Trace support is currently available on Ethereum, Base, Arbitrum, Gnosis, and Monad. If you need trace support on another chain, reach out at [nikhil@envio.dev](mailto:nikhil@envio.dev).

### How Fast Is HyperSync Compared to RPC for Trace Queries?
HyperSync is up to 2000x faster than standard JSON-RPC for data retrieval workloads. For trace queries specifically, the gap is even wider since RPC trace methods like `eth_traceBlock` are among the slowest calls on most nodes.

### Can I Use This Approach for ERC-20 Transfers Too?
Yes, but for ERC-20 you'd query logs instead of traces since ERC-20 contracts emit a `Transfer` event. Use the `logs` filter with the Transfer event signature as `topic0`. See the [HyperSync query reference](https://docs.envio.dev/docs/HyperSync/hypersync-query) for details.

## Build With Envio
Envio HyperIndex is independently benchmarked as the fastest EVM blockchain indexer available. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, or come talk to us about your data needs.
Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.
[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
