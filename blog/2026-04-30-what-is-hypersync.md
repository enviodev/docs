---
title: What is HyperSync?
sidebar_label: What is HyperSync?
slug: /what-is-hypersync
description: "HyperSync is Envio's high-performance blockchain data layer, up to 2000x faster than RPC across dozens of supported chains. Learn what it is, how it works, and how to query it."
image: /blog-assets/what-is-hypersync.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-04-30
  author: Jordyn Laurier
---

![Cover image for the What is HyperSync blog](/blog-assets/what-is-hypersync.png)

:::info TL;DR

- HyperSync is Envio's high-performance blockchain data-retrieval layer.
- Up to 2000x faster than RPC for getting or fetching the logs, transactions, traces, and blocks across <HyperSyncChainCount /> chains.
- Primary data source for HyperIndex and the data layer behind products like [ChainDensity.xyz](https://chaindensity.xyz), [Scope.sh](https://scope.sh), LogTUI, and the Polymarket reference indexer (4 billion events in 6 days).
- Client libraries available for TypeScript/Node.js, Python, Rust, and Go.

:::

Reading onchain data is one of the slowest, most expensive parts of building any Web3 product or service. Standard JSON-RPC endpoints work for one-off lookups, but break down the moment you need fast or filtered historical data, multichain coverage, or anything more than a handful of blocks at a time. HyperSync exists to fix that. This post covers what HyperSync is, why Envio built it, how it works, and how to use it in your own application.

## The Problem with RPC

Reading onchain data over JSON-RPC is the default path most teams start with. It also breaks the moment your needs go beyond a single contract on a single chain.

Three things happen as soon as you scale:

- **Speed.** Backfilling a year of events across an L2 takes hours or days because RPC was designed to serve one request at a time, not stream historical data in bulk.
- **Query Flexibility.** RPC limits you to small block windows, typically 100 to 1000 blocks per request depending on the provider, with strict rate limits and inconsistent behavior across providers. Anything more sophisticated, like fetching every `PoolCreated` event across an entire chain, still requires hundreds or thousands of separate calls and bespoke retry logic.
- **Cost.** Data-intensive workloads on premium RPC providers add up fast, and you are still rate-limited at the moment you most need throughput.

## What HyperSync Is

HyperSync is a purpose-built data retrieval layer that gives developers direct access to blockchain data at speeds RPC cannot match. It is written in Rust, uses optimised binary encoding and parallel fetching, and exposes a query API that is both fast at serving requested data and flexible about how that data can be filtered and shaped.

Where RPC is a single endpoint serving one block of data at a time, HyperSync is a streaming query engine. You describe what you want once, in a single query object, and it streams back exactly that data across whatever block range you asked for.

## Performance, Verified

The numbers below are pulled from the [HyperSync overview](https://docs.envio.dev/docs/HyperSync/overview).

| Task | Traditional RPC | HyperSync | Improvement |
| ----- | ----- | ----- | ----- |
| Scan Arbitrum for sparse log data | Hours to days | 2 seconds | ~2000x faster |
| Fetch all Uniswap v3 `PoolCreated` events on Ethereum | Hours | Seconds | ~500x faster |

HyperSync is also the data layer powering HyperIndex, the fastest blockchain indexer available. Sentio's independent Uniswap V2 Factory benchmark (May 2025) measured HyperIndex completing the test in 1 minute, 143x faster than The Graph and 15x faster than the nearest competitor (Subsquid).

In production, that translates into projects like the Polymarket reference indexer, which synced 4 billion events in 6 days and replaced 8 separate subgraphs with a single HyperIndex deployment powered by HyperSync.

## How HyperSync Works

There are four primitives you need to understand to use HyperSync.

### 1. Queries

A query is a single object that describes the data you want. It includes a block range, a set of filters, and a field selection. You hand it to a HyperSync client and it streams matching results back to you.

Here is a working query in TypeScript that streams every Uniswap v3 event from Ethereum mainnet, starting at genesis. This pattern is taken from the Polymarket trades tutorial and the API Tokens implementation guide.

```ts
import { HypersyncClient, type Query } from "@envio-dev/hypersync-client";
import { keccak256, toHex } from "viem";

const event_signatures = [
  "PoolCreated(address,address,uint24,int24,address)",
  "Burn(address,int24,int24,uint128,uint256,uint256)",
  "Initialize(uint160,int24)",
  "Mint(address,address,int24,int24,uint128,uint256,uint256)",
  "Swap(address,address,int256,int256,uint160,uint128,int24)",
];

const topic0_list = event_signatures.map((sig) => keccak256(toHex(sig)));

const client = new HypersyncClient({
  url: "https://eth.hypersync.xyz",
  apiToken: process.env.ENVIO_API_TOKEN!,
});

const query: Query = {
  fromBlock: 0,
  logs: [{ topics: [topic0_list] }],
  fieldSelection: {
    log: ["Data", "Address", "Topic0", "Topic1", "Topic2", "Topic3"],
  },
};

const stream = await client.stream(query, {});

while (true) {
  const res = await stream.recv();
  if (res === null) break;
  if (res.data?.logs) {
    console.log(`Got ${res.data.logs.length} logs`);
  }
  if (res.nextBlock) {
    query.fromBlock = res.nextBlock;
  }
}
```

### 2. Filters

You can filter on logs, transactions, traces, and blocks, alone or in combination. Filters narrow down what HyperSync streams back, so you only pay for the data you actually need.

```ts
// TypeScript: every USDC Transfer in a given block range
const logSelection = {
  address: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
  topics: [
    ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
  ],
};
```

Trace filters give you access to execution traces and internal transactions, which is the only way to track native ETH transfers since they do not emit event logs. Traces are accessed via a separate trace-enabled endpoint, for example `https://eth-traces.hypersync.xyz`. The [Native ETH Transfers tutorial](/tracking-native-eth-transfers-hypersync) walks through that pattern end to end.

### 3. Field Selection

HyperSync lets you ask for only the fields you need. Smaller responses, less bandwidth, faster downstream processing.

```ts
const fieldSelection = {
  block: ["Number", "Timestamp"],
  transaction: ["Hash", "From", "To"],
  log: ["Address", "Topic0", "Data"],
};
```

### 4. Output Modes

HyperSync gives you three ways to consume results:

- `client.stream(query, config)` for direct in-memory processing.
- `client.collect_json(path, query, config)` for smaller datasets and debugging.
- `client.collect_parquet(path, query, config)` for analytical workloads on large datasets.

Streaming is the right default for indexers and real-time applications. Parquet is the right default for ETL pipelines and data science work.

## Switching Networks

Switching chains is a one-line change. The same client works against any of the <HyperSyncChainCount /> supported networks by changing the URL.

```ts
// Ethereum
const client = new HypersyncClient({
  url: "https://eth.hypersync.xyz",
  apiToken: process.env.ENVIO_API_TOKEN!,
});

// Arbitrum
const client = new HypersyncClient({
  url: "https://arbitrum.hypersync.xyz",
  apiToken: process.env.ENVIO_API_TOKEN!,
});

// Base
const client = new HypersyncClient({
  url: "https://base.hypersync.xyz",
  apiToken: process.env.ENVIO_API_TOKEN!,
});
```

The full list of network URLs is on the [Supported Networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks) page.

## Try HyperSync in 30 Seconds

The fastest way to feel HyperSync is to install nothing.

```sh
pnpx logtui aave arbitrum
```

That command launches LogTUI, a terminal-based blockchain event viewer built on HyperSync, and starts streaming Aave events on Arbitrum into your terminal in real time. LogTUI ships with presets for 20+ protocols including Uniswap, Chainlink, Aave, and ENS.

When you are ready for a real client, clone the hypersync-quickstart repo and run one of the included scripts.

```sh
git clone https://github.com/enviodev/hypersync-quickstart.git
cd hypersync-quickstart
pnpm install
node run-simple.js
```

You will need an API token. Set it as an environment variable.

```sh
export ENVIO_API_TOKEN="your-api-token-here"
```

Generate a token from [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) and read the [API Tokens guide](https://docs.envio.dev/docs/HyperSync/api-tokens) for usage and security best practices.

If you are building a full indexer with schema management, event handlers, and a hosted GraphQL API, jump to the [HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/contract-import).

## Handling Large Backfills

A single HyperSync request has a 5-second processing window. For a fresh historical backfill across a high-volume chain, loop through block ranges by feeding the `nextBlock` from each response back into the next query.

```python
current_block = start_block
while current_block < end_block:
    query.from_block = current_block
    query.to_block = min(current_block + 1_000_000, end_block)
    result = await client.collect_parquet("data", query, config)
    current_block = result.end_block + 1
```

For most use cases, the streaming client handles this automatically.

## Use Cases

HyperSync makes a class of applications practical that traditional RPC cannot reasonably support.

- **Blockchain indexers** that build high-performance data pipelines with minimal infrastructure.
- **Data analytics** that runs complex onchain analysis in seconds instead of days.
- **Block explorers** that serve responsive UIs with comprehensive historical access.
- **Monitoring tools** that track blockchain activity with near real-time updates.
- **Cross-chain applications** that pull unified data across multiple networks from a single query interface.
- **ETL pipelines** that extract onchain data into data warehouses fast.

## What HyperSync Powers

HyperSync is the data engine underneath a growing set of tools and applications.

**HyperIndex** is Envio's full indexing framework. It uses HyperSync as its primary data source, then layers on schema management, event handlers, multichain support, automatic reorg handling, and a hosted GraphQL API. HyperIndex is the fastest blockchain indexer available, 143x faster than The Graph and 15x faster than Subsquid on the Sentio Uniswap V2 Factory benchmark (May 2025).

**[ChainDensity.xyz](https://chaindensity.xyz)** uses HyperSync to render transaction and event density across any address on any supported chain. It generates insights in seconds that would take hours over RPC.

**[Scope.sh](https://scope.sh)** is an Account Abstraction-focused block explorer that uses HyperSync for ultra-fast historical data retrieval.

**LogTUI** is the zero-install event viewer mentioned above. Try `pnpx logtui --help` for the full list of presets.

## When to Use HyperSync vs HyperIndex

A common question. The short answer.

Use **HyperSync** directly when you want raw blockchain data at maximum speed and you are happy to manage your own pipeline, storage, and downstream API. Good fits include analytics scripts, ETL into a data warehouse, custom alert systems, and anything that needs the absolute thinnest layer between you and the data.

Use **HyperIndex** when you want a complete indexing framework with schema management, event handlers, GraphQL output, multichain support, automatic reorg handling, and managed hosting on Envio Cloud. Good fits include application backends, dashboards, and anything where you would otherwise reach for The Graph or Subsquid. HyperIndex is itself powered by HyperSync.

## Common Patterns

Three patterns we see most often from teams adopting HyperSync.

**Pattern 1. Replace a slow RPC backfill.** A team has an existing indexer that takes days to backfill from genesis. Swapping the RPC source for HyperSync brings that down to minutes. The Polymarket case study is the canonical example, with 4 billion events synced in 6 days.

**Pattern 2. Query across many chains in one place.** A team builds a multichain dashboard and is tired of stitching together a dozen RPC providers. HyperSync exposes the same query interface for every supported chain, so the only thing that changes between Ethereum, Arbitrum, Base, and Optimism is the URL.

**Pattern 3. Build a niche analytics tool fast.** ChainDensity, Scope, and LogTUI are all examples. HyperSync makes it cheap to ship the kind of tool that would otherwise need a dedicated data team.

## Pricing and Access

HyperSync requires an API token. API tokens have been required since 3 November 2025. Generate a token at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) and read the [API Tokens documentation](https://docs.envio.dev/docs/HyperSync/api-tokens) for limits, usage tracking (requests and credits), and security best practices. Indexers deployed to Envio Cloud have special access to HyperSync and do not require a custom API token. For production tier options, see the [Envio pricing page](https://envio.dev/pricing).

## Frequently Asked Questions

### How Fast Is HyperSync Compared to RPC?

HyperSync is up to 2000x faster than RPC for sparse log scans. Scanning Arbitrum for sparse log data takes 2 seconds with HyperSync, versus hours or days over RPC. Fetching every Uniswap v3 `PoolCreated` event on Ethereum is roughly 500x faster.

### What Chains Does HyperSync Support?

HyperSync is natively available on <HyperSyncChainCount /> chains, including Fuel, with new networks added regularly. The full list is on the [Supported Networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks) page.

### What Client Libraries Are Available?

HyperSync ships official client libraries in Python, Rust, Node.js, and Go. There is also a curl interface for quick testing.

### Do I Need an API Token?

Yes. API tokens have been required since 3 November 2025. Generate a token at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) and pass it as `apiToken` in TypeScript or `bearer_token` in Python. Indexers deployed to Envio Cloud have special access and do not need a custom token.

### How Is HyperSync Different from HyperIndex?

HyperSync is the raw data layer. HyperIndex is the full indexing framework built on top of it. Use HyperSync directly when you want maximum speed and full control of your pipeline. Use HyperIndex when you want schema management, event handlers, GraphQL APIs, automatic reorg handling, and managed hosting.

### Can I Use HyperSync for Real-Time Data?

Yes. HyperSync streams data continuously and you can poll for new blocks at the head of the chain. The [Polymarket trades tutorial](/track-polymarket-trades-hypersync) is a worked example of real-time streaming.

### Are Traces Supported on Every Chain?

No. Trace filters are accessed via separate trace-enabled HyperSync endpoints, for example `https://eth-traces.hypersync.xyz` for Ethereum mainnet. See the [Supported Networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks) page for trace availability.

## Build With Envio

Envio HyperIndex is independently benchmarked as the fastest EVM blockchain indexer available (Sentio benchmark, May 2025). If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, or come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
