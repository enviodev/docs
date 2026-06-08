---
id: stream-config-tuning
title: Stream Config & Tuning
sidebar_label: Stream Config & Tuning
slug: /stream-config-tuning
description: Configure and tune the HyperSync streaming engine — concurrency, response size targets, batch sizes, and request-rate (RPM) control — and find the optimal config for your query with the built-in observer.
---

# Stream Config & Tuning

When you `stream` (or `collect`) with a HyperSync client, the engine fans your block
range out across many concurrent HTTP requests, sizes each request automatically, and
delivers results to you **in block order**. `StreamConfig` controls that engine.

:::tip TL;DR
**The defaults are good for most workloads — you usually don't need to touch this.**
Reach for tuning when you want to (a) go faster on a specific workload, (b) **use fewer
requests / stay under an API rate limit**, or (c) bound memory. The fastest way to find a
good config for *your* query is the [`tune_stream` tool](#find-the-best-config-for-your-query),
which sweeps configs against your query and prints a comparison table.
:::

## Quick decision guide

| Your situation | Do this |
|---|---|
| Just getting started | Use the defaults. |
| Hitting API rate limits (429s) | Lower `concurrency`, and/or raise `response_bytes_target`. See [Request-rate control](#request-rate-control-rpm). |
| Want maximum throughput on a busy contract (lots of logs) | Raise `concurrency` (e.g. 20). |
| Scanning a wide range for a rare event | Keep `concurrency` moderate (≈10); a larger `batch_size` helps. |
| Pulling full blocks + all transactions | Defaults are fine; the adaptive buffer handles the large responses. |
| Memory-constrained | Set `max_buffered_bytes` to a fixed cap. |
| Want the lowest possible request rate | Set `concurrency = 1` (a sequential pagination loop). |
| Not sure | Run [`tune_stream`](#find-the-best-config-for-your-query) against your query. |

## How the engine works (the 30-second model)

Understanding two ideas makes every knob obvious:

1. **One HTTP request = one unit of work.** The engine sizes each request to land near
   `response_bytes_target` bytes, based on the byte-density it has measured so far. If the
   server returns less than requested (truncates), the leftover range becomes a gap that
   **any free worker backfills in parallel** — so over-estimating a request size is safe.
2. **Delivery is in block order.** Results are buffered and handed to you contiguously, so
   the stream still yields one response per HTTP response in ascending (or `reverse`) block
   order.

Consequences:

- **`concurrency`** sets how many requests run in parallel → your throughput *and* your
  request rate.
- **`response_bytes_target`** sets how big each response is → bigger target = fewer,
  larger requests.
- Over-estimating sizes never causes a slowdown (truncations are backfilled), so being
  conservative about request count is free.

## Configuration options

Field names below are shown in `snake_case` (Rust, Python). **Node/TypeScript uses
`camelCase`** (e.g. `response_bytes_target` → `responseBytesTarget`).

| Option | Default | What it does |
|---|---|---|
| `concurrency` | `10` | Number of requests in flight. `0` is an error, `1` is a sequential pagination loop, `≥2` uses the parallel scheduler. Your main throughput / RPM dial. |
| `response_bytes_target` | `400_000` | Target size (bytes) for each response. Each request is sized to aim here. Raise it for fewer, larger requests. |
| `batch_size` | `1_000` | Initial (deliberately over-estimated) block range for the first wave of requests, before any density has been measured. Also the fallback. |
| `min_batch_size` | `200` | Lower clamp on the projected block count, to avoid tiny ranges. |
| `max_batch_size` | _unset_ | Optional hard cap on blocks per request. Unset = **no cap** (over-shoot self-corrects via backfill). Set it only if you specifically want to bound blocks/request. |
| `max_buffered_bytes` | _unset_ | Cap on bytes of fetched-but-undelivered data held for re-ordering (consumer backpressure). Unset = **adaptive** (grows with the largest response seen) so byte-heavy pulls stay pipelined. Set a fixed value to bound memory. |
| `reverse` | `false` | Stream from the top of the range downward. |
| `max_num_blocks` / `max_num_transactions` / `max_num_logs` / `max_num_traces` | _unset_ | Stop the stream once this many of an entity have been delivered. |
| `column_mapping`, `event_signature`, `hex_output` | — | Output shaping (decoding, hex formatting). Not performance knobs. |

:::info Breaking change in v1.3.0 / streaming v2
`response_bytes_floor` and `response_bytes_ceiling` were replaced by a single
`response_bytes_target`. `max_batch_size` became optional (unset = no cap). `max_buffered_bytes`
was added. If you set the old fields, switch to `response_bytes_target`.
:::

## Tuning recipes

These are good starting points. Always confirm against your own query with
[`tune_stream`](#find-the-best-config-for-your-query).

### Dense — busy contracts / all-logs

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
// Rust — there's a ready-made preset
let config = StreamConfig::dense();
```

### Sparse — rare events over a wide range

Most blocks match nothing. **Don't over-parallelize** — extra workers just fragment the
empty range into more requests. A larger `batch_size` covers more ground per request.

```python
config = hypersync.StreamConfig(concurrency=10, batch_size=20_000)
```
```typescript
const config = { concurrency: 10, batchSize: 20_000 };
```
```rust
let config = StreamConfig::sparse();
```

### Archival — full blocks + all transactions

Each response is many megabytes; the run is bound by the re-order buffer, not concurrency.
Leave `max_buffered_bytes` unset so the adaptive buffer keeps the pipeline full.

```python
config = hypersync.StreamConfig(concurrency=12)
```
```typescript
const config = { concurrency: 12 };
```
```rust
let config = StreamConfig::archival();
```

## Request-rate control (RPM)

If you're on a limited API tier, the goal is fewer requests per minute, not raw speed. The
streaming engine gives you three levers, and — unlike a naive pagination loop — being
conservative does **not** tank performance:

- **`concurrency`** is the primary dial. It trades throughput for request rate roughly
  linearly. Lower it to fit under your limit.
- **`concurrency = 1`** is a built-in sequential pagination loop — the **lowest possible
  request rate**. Each request goes straight to the upper block limit and the server sizes
  the response, so you make the minimum number of (server-max-sized) requests.
- **`response_bytes_target`** (raise it) → fewer, larger requests for the same data.
- **`max_batch_size`** can be left unset / set large safely: an over-large request is
  truncated by the server and the remainder is backfilled in parallel, so a big request
  size lowers request count without serializing your stream.

:::tip
The clients also proactively wait out rate limits (HTTP 429) and retry, so a stream won't
fail on transient limits — it just slows down. To increase your limits, upgrade your plan
on the [API tokens page](./api-tokens.mdx).
:::

## Find the best config for your query

Rather than guess, measure. The Rust client ships a standalone **`tune_stream`** example
that runs your query under a grid of configs and prints a comparison table — throughput,
request count, truncation rate, and how close responses land to the target. **It takes a
query as JSON, so it works for any query regardless of which client language you use.**

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
size-vs-target ratio, and the observed buffer/in-flight — so you can pick the config with
the throughput you want at the request rate you can afford.

### 3. Apply the winning config

Copy the `response_bytes_target` / `concurrency` (etc.) from the best row into your
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

The plain `stream` / `stream_arrow` methods have **zero** observability overhead — metrics
are only collected when you attach an observer. (Surfacing this handle in the Node and
Python clients is a fast-follow; until then, use `tune_stream` for those languages.)

## What the metrics mean

When tuning, aim for:

- **Mean size ratio ≈ 1.0** — responses are landing near `response_bytes_target`. Much
  below 1.0 means the server is capping responses smaller than your target (raise
  throughput by raising `concurrency`, not the target). Much above 1.0 means responses are
  larger than target (byte-heavy query).
- **Low truncation %** for smooth delivery — though some truncation is normal and harmless
  (it's backfilled). Persistent truncation with *tiny* responses means the server is
  hitting a scan/time limit; narrow the query with more selective filters.
- **Higher blocks/s** at an acceptable **request rate** — the trade-off you're tuning.

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
