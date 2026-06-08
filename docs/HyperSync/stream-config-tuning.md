---
id: stream-config-tuning
title: Stream Config & Tuning
sidebar_label: Stream Config & Tuning
slug: /stream-config-tuning
description: Configure and tune the HyperSync streaming engine (concurrency, response size targets, batch sizes) and find the best config for your query with the built-in observer.
---

# Stream Config & Tuning

When you `stream` (or `collect`) with a HyperSync client, the engine fans your block
range out across many concurrent HTTP requests, sizes each request automatically, and
delivers results to you **in block order**. `StreamConfig` controls that engine.

:::tip TL;DR
**The defaults are good for most workloads, so you usually don't need to touch this.**
Reach for tuning when you want to squeeze more throughput out of a specific workload, or to
bound memory. The fastest way to find a good config for *your* query is the
[`tune_stream`](#find-the-best-config-for-your-query) tool, which sweeps configs against your
query and prints a comparison table.
:::

## Quick decision guide

| Your situation | Do this |
|---|---|
| Just getting started | Use the defaults. |
| Want maximum throughput on a busy contract (lots of logs) | Raise `concurrency` (for example 20). |
| Scanning a wide range for a rare event | Keep `concurrency` moderate (around 10); a larger `batch_size` helps. |
| Pulling full blocks + all transactions | Defaults are fine; the adaptive buffer handles the large responses. |
| Memory constrained | Set `max_buffered_bytes` to a fixed cap. |
| Hitting API rate limits | The client waits out limits and retries automatically. For higher limits, [upgrade your plan](./api-tokens.mdx). |
| Not sure | Run [`tune_stream`](#find-the-best-config-for-your-query) against your query. |

## How the engine works (the 30-second model)

Two ideas make every knob obvious:

1. **One HTTP request is one unit of work.** The engine sizes each request to land near
   `response_bytes_target` bytes, based on the byte-density it has measured so far. If the
   server returns less than requested (a "truncation"), the leftover range becomes a gap that
   any free worker backfills in parallel.
2. **Delivery is in block order.** Results are buffered and handed to you contiguously, so
   the stream yields one response per HTTP response in ascending (or `reverse`) block order.

So `concurrency` sets how many requests run in parallel, and `response_bytes_target` sets how
big each response is. Because truncations are backfilled automatically, the engine is
forgiving: an over-estimated request size corrects itself rather than failing.

## Configuration options

Field names below are shown in `snake_case` (Rust, Python). **Node and TypeScript use
`camelCase`** (for example `response_bytes_target` becomes `responseBytesTarget`).

| Option | Default | What it does |
|---|---|---|
| `concurrency` | `10` | Number of requests in flight, and your main throughput knob. `0` is an error, `1` streams sequentially, `2` or more uses the parallel scheduler. |
| `response_bytes_target` | `400_000` | Target size in bytes for each response. Each request is sized to aim here. Raise it for fewer, larger responses. |
| `batch_size` | `1_000` | Initial block range for the first wave of requests, before any density has been measured. Also the fallback. |
| `min_batch_size` | `200` | Lower clamp on the projected block count, to avoid tiny ranges. |
| `max_batch_size` | _unset_ | Optional hard cap on blocks per request. Unset means no cap (over-shoot self-corrects via backfill). Set it only if you specifically want to bound blocks per request. |
| `max_buffered_bytes` | _unset_ | Cap on bytes of fetched-but-undelivered data held for re-ordering (consumer backpressure). Unset means adaptive (it grows with the largest response seen) so byte-heavy pulls stay pipelined. Set a fixed value to bound memory. |
| `reverse` | `false` | Stream from the top of the range downward. |
| `max_num_blocks`, `max_num_transactions`, `max_num_logs`, `max_num_traces` | _unset_ | Stop the stream once this many of an entity have been delivered. |
| `column_mapping`, `event_signature`, `hex_output` | none | Output shaping (decoding, hex formatting). Not performance knobs. |

:::info Breaking change in v1.3.0 / streaming v2
`response_bytes_floor` and `response_bytes_ceiling` were replaced by a single
`response_bytes_target`. `max_batch_size` became optional (unset means no cap).
`max_buffered_bytes` was added. If you set the old fields, switch to `response_bytes_target`.
:::

## Tuning recipes

These are good starting points. Confirm against your own query with
[`tune_stream`](#find-the-best-config-for-your-query).

### Dense: busy contracts and all-logs

Lots of matching data per block. Throughput scales with parallelism.

```python
# Python
config = hypersync.StreamConfig(concurrency=20, response_bytes_target=400_000)
```
```typescript
// Node / TypeScript
const config = { concurrency: 20, responseBytesTarget: 400_000 };
```
```rust
// Rust has a ready-made preset
let config = StreamConfig::dense();
```

### Sparse: rare events over a wide range

Most blocks match nothing. Raising concurrency past the default tends to just fragment the
empty range into more, smaller requests without adding throughput, so keep it moderate. A
larger `batch_size` lets the first wave cover more ground.

```python
config = hypersync.StreamConfig(concurrency=10, batch_size=20_000)
```
```typescript
const config = { concurrency: 10, batchSize: 20_000 };
```
```rust
let config = StreamConfig::sparse();
```

### Archival: full blocks and all transactions

Each response is many megabytes, so the run is bound by the re-order buffer rather than
concurrency. Leave `max_buffered_bytes` unset so the adaptive buffer keeps the pipeline full.

```python
config = hypersync.StreamConfig(concurrency=12)
```
```typescript
const config = { concurrency: 12 };
```
```rust
let config = StreamConfig::archival();
```

## Find the best config for your query

Rather than guess, measure. The Rust client ships a standalone **`tune_stream`** example
that runs your query under a grid of configs and prints a comparison table: throughput,
request count, truncation rate, and how close responses land to the target. It takes a query
as JSON, so it works for any query regardless of which client language you use.

### 1. Save your query as JSON

```json title="query.json"
{
  "from_block": 18000000,
  "to_block": 18100000,
  "logs": [
    { "topics": [["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]] }
  ],
  "field_selection": { "log": ["block_number", "log_index", "data", "topic0"] }
}
```

### 2. Run the sweep

```bash
git clone https://github.com/enviodev/hypersync-client-rust
cd hypersync-client-rust

export ENVIO_API_TOKEN=<your-token>
export CHAIN_ID=1   # 1 = Ethereum mainnet

# Sweep a grid of configs and print a comparison table
cargo run -p tune_stream -- query.json

# Or a single detailed run with the default config
cargo run -p tune_stream -- query.json --single
```

The table shows, per config: requests, truncation %, blocks/s, MB/s, the mean
size-vs-target ratio, and the observed buffer and in-flight counts. Pick the config with the
best throughput for your workload.

### 3. Apply the winning config

Copy `response_bytes_target`, `concurrency`, and any other fields from the best row into your
client's `StreamConfig`.

### Rust: attach an observer in your own code

Rust users can read the same metrics live, without the example, via the observer API:

```rust
use std::sync::Arc;
use hypersync_client::{Client, StreamConfig, StreamMetrics, StreamObserver};

let metrics = Arc::new(StreamMetrics::new());
let observer: Arc<dyn StreamObserver> = metrics.clone();

let mut rx = client
    .stream_arrow_with_observer(query, StreamConfig::default(), observer)
    .await?;
while let Some(res) = rx.recv().await {
    let _ = res?; // consume the stream
}

let summary = metrics.summary();
println!(
    "requests={} truncated={:.0}% blocks/s={:.0} mean size ratio={:.2}",
    summary.num_requests,
    summary.truncation_rate * 100.0,
    summary.blocks_per_sec,
    summary.mean_size_ratio,
);
```

The plain `stream` and `stream_arrow` methods do no metrics work; `RequestStats` are only
built when you attach an observer. (Surfacing this handle in the Node and Python clients is a
fast-follow; until then, use `tune_stream` for those languages.)

## Reading the metrics

When tuning, the two numbers worth watching are:

- **Mean size ratio**, which is response size divided by `response_bytes_target`. Around
  `1.0` means responses are landing on target. Well below `1.0` means the server is returning
  smaller responses than your target, which is perfectly normal for selective queries or
  minimal field selections; raising `response_bytes_target` won't change it, and the way to
  go faster is usually more `concurrency`.
- **Blocks per second**, which is the throughput you are tuning for.

Truncation is shown too, but you can usually ignore it. Some truncation is normal and
harmless because the leftover range is backfilled automatically, and a sparse query that
selects only a few fields will often show small, frequently-truncated responses while still
streaming quickly. It is only worth a look if throughput is poor.

## Rate limits

The clients handle rate limits for you: when the server signals a limit (HTTP 429) the client
waits for the window to reset and retries, so a stream slows down rather than failing. If you
want more headroom or higher throughput, [upgrade your plan](./api-tokens.mdx).

If you need the client to make fewer requests per unit time (for example to fit a fixed
request budget), `concurrency` is the lever. It trades throughput for request volume: fewer
requests run in parallel, so fewer go out per unit time. Setting `concurrency = 1` streams
sequentially, one request at a time.

## Full default reference

```text
concurrency           = 10
response_bytes_target = 400_000
batch_size            = 1_000
min_batch_size        = 200
max_batch_size        = unset  (no cap)
max_buffered_bytes    = unset  (adaptive)
reverse               = false
max_num_blocks / transactions / logs / traces = unset
```
