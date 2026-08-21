---
id: solana-client
title: Solana HyperSync Client
sidebar_label: Client
slug: /solana-client
description: The Solana HyperSync client - install, query, stream, decode Arrow, and handle rate limits.
---

# Solana Client

`hypersync-client-solana` is the Rust client for [Solana HyperSync](./solana). It speaks the
Arrow endpoint (`POST /query/arrow`), retries transient failures, waits out rate limits, and
paginates a slot range across many concurrent requests for you.

- [Crates.io](https://crates.io/crates/hypersync-client-solana) - [API docs](https://docs.rs/hypersync-client-solana) - [GitHub](https://github.com/enviodev/hypersync-client-solana)

:::info Use 0.2.0 or newer
`0.2.0` is the first release of the locked query API and fixes a **silent data-loss bug** in
`stream_arrow` / `collect_arrow`: chunks the server truncated (row or time cap) dropped their
tail instead of paginating it, losing up to 99% of rows on dense ranges with no error. If you
stream with an earlier version, upgrade before you trust the row counts.
:::

## Install

```toml
[dependencies]
hypersync-client-solana = "0.2"
tokio = { version = "1", features = ["full"] }
```

## Quick start

```rust
use std::sync::Arc;

use hypersync_client_solana::{config::ClientConfig, Client};
use hypersync_solana_net_types::query::SolanaQuery;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = Arc::new(Client::new(ClientConfig {
        url: "https://solana.hypersync.xyz".into(),
        bearer_token: std::env::var("HYPERSYNC_BEARER_TOKEN").ok(),
        ..Default::default()
    })?);

    let height = client.get_height().await?;

    let query = SolanaQuery {
        from_slot: height.saturating_sub(100),
        to_slot: Some(height),
        include_all_blocks: true,
        ..Default::default()
    };

    let resp = client.get(&query).await?;
    println!("{} blocks, next_slot {}", resp.blocks.len(), resp.next_slot);
    Ok(())
}
```

`ClientConfig` fields: `url`, `bearer_token`, `http_req_timeout` (30s), `max_num_retries`
(12), `retry_base_ms` (500), `retry_ceiling_ms` (5000), and
`proactive_rate_limit_sleep` (`true`). See [API tokens](/docs/HyperSync/api-tokens) for the
bearer token.

## Typed rows or Arrow

Every method comes in two flavors: typed structs, or the raw Arrow record batches the server
sent.

| What you want | Single query | Whole slot range |
|---|---|---|
| Typed structs | `get` | `collect` |
| Arrow record batches | `get_arrow` | `collect_arrow` |

The typed structs live in `hypersync_client_solana::simple_types`: `Block`, `Transaction`,
`InstructionCall`, `Log`, `AccountActivity`, `Reward`, bundled into a `SolanaResponse` with one
`Vec` per table. Arrow responses instead carry `data.tables`, a map keyed by table name
(`blocks`, `transactions`, `instruction_calls`, `logs`, `account_activity`, `rewards`).

Use Arrow when feeding a columnar pipeline (Polars, DataFusion, Parquet); use typed structs for
ordinary application code.

:::note Every field is `Option<T>`
`field_selection` can project any column away, so a `None` means exactly "not selected, or the
source could not supply it" - never zero or false. Addresses, hashes, and signatures are the
base58 newtypes `Address`, `Hash`, and `Signature`, which parse strictly and reject a malformed
value loudly rather than matching nothing. `InstructionCall::stack_height()` is a convenience
view over `instruction_address` (its length, matching Solana's native stack height).
:::

## Streaming a range

`collect` and `collect_arrow` fan a slot range out across concurrent requests and merge the
results; `stream_arrow` gives you the same engine but yields each response as it arrives, in
slot order, through an mpsc receiver.

```rust
use hypersync_client_solana::config::StreamConfig;

let resp = client
    .collect(query, StreamConfig::default())
    .await?;
```

`StreamConfig` for the Solana client:

| Option | Default | What it does |
|---|---|---|
| `concurrency` | `10` | Requests in flight. The main throughput knob, and the lever for making fewer requests per unit time. |
| `batch_size` | `1_000` | Slots per chunk before any response size has been measured. |
| `min_batch_size` | `100` | Lower clamp on the adaptive chunk size. |
| `max_batch_size` | `200_000` | Upper clamp on the adaptive chunk size. |
| `response_bytes_ceiling` | `500_000` | Responses above this shrink the next chunk. |
| `response_bytes_floor` | `250_000` | Responses below this grow the next chunk. |

These are Solana-specific names: the EVM client's `StreamConfig` targets a single
`response_bytes_target` instead of a floor/ceiling pair, so the
[tuning guide](/docs/HyperSync/stream-config-tuning) transfers as advice but not field for
field.

## Pagination and reorgs

A single `get` covers as much of the range as the server's budget allows, so use the response's
`next_slot` as the next request's `from_slot`. `collect` and `stream_arrow` do this for you.

Responses can carry a `rollback_guard` describing the server's in-memory head window, so you
can detect a shallow reorg before committing near-head data. It is absent when the server has
no complete window to describe, and on a paginated `collect` it is the guard of the last page
that carried one.
See [Reorg detection](./solana-query#reorg-detection-rollback_guard) for the algorithm.

## Rate limits

The client waits out rate limits and retries, so a stream slows down rather than failing. To
read the quota yourself, the Solana client exposes the same surface as the EVM client:
`get_with_rate_limit` / `get_arrow_with_rate_limit`, `rate_limit_info()`,
`wait_for_rate_limit()`, and the `proactive_rate_limit_sleep` config field. See
[Inspecting rate limits from your code](/docs/HyperSync/stream-config-tuning#inspecting-rate-limits-from-your-code)
for the fields, the header mapping, and the one behavioral difference from the EVM client
(the Solana `*_with_rate_limit` methods retry a 429; the EVM ones do not).

## Node bindings

The repository also contains napi-rs Node bindings (`node/`), exposing `SolanaClient` with
`getHeight()`, `query()`, `getWithRateLimit()`, `rateLimitInfo()`, and `waitForRateLimit()`.
They are **not published to npm yet**, so build them from source
([repo](https://github.com/enviodev/hypersync-client-solana)); the streaming methods are Rust
only for now. If you use them:

- The query object is camelCase (`fromSlot`, `instructionCalls`, `executingAccount`,
  `fieldSelection`), but `fieldSelection` **values** are the snake_case column names from
  [Available fields](./solana-query#available-fields-by-table), for example
  `{ instructionCall: ["executing_account", "tx_success"] }`.
- `response.tables` is keyed by table name, so instruction rows are under `instruction_calls`.
- `includeAccountActivity` is deprecated; setting it to `true` throws with guidance. Use
  `accountActivity: [{}]`.

## Upgrading to 0.2.0

`0.2.0` locked the query API. The renames are breaking on the **response** side; the request
side still accepts legacy names as aliases. Full mapping (including `is_committed` to
`tx_success` and the `account_activity.owner` split into `pre_owner` / `post_owner`):
[Renamed fields and compatibility](./solana-query#renamed-fields-and-compatibility).
