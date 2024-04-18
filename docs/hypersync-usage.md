---
id: hypersync-usage
title: Usage
sidebar_label: Usage
slug: /hypersync-usage
---

### Examples

We've found most developers have enjoyed learning HyperSync by practical example. You will find [examples here](./hypersync-clients.md) in Python, Rust and NodeJs in each section.

### Queries

Using HyperSync primarly revolves around successfully constructing and then executing queries. Queries allow you to essentially filter for blocks, logs, transactions and traces. Hovering over types in your IDE will allow you to see all exhaustive options in order to construct a appropriate query.

```python
class Query(
    from_block: int,
    field_selection: FieldSelection,
    to_block: int | None = None,
    logs: list[LogSelection] | None = None,
    transactions: list[TransactionSelection] | None = None,
    traces: list[TraceSelection] | None = None,
    include_all_blocks: bool | None = None,
    max_num_blocks: int | None = None,
    max_num_transactions: int | None = None,
    max_num_logs: int | None = None,
    max_num_traces: int | None = None
)
```

#### Field Selection

You are able to choose exactly what data you would like to be returned from the request. For example, this is useful when filtering for Logs, but you would also like the block data associated with that log in order to maybe get the timestamp of when that log was emitted.

### Useful tips:

- Run export `export RUST_LOG=trace` to see detiled HyperSync request progress information.
- HyperSync requests have a 5 second time limit. The request will return with the block that it reached during the query allowing you paginate and make the next query. HyperSync generally scans through more than 10m blocks in 5 seconds.
- Modify `batch_size` and `batch_size` params based on your chain and usecase to improve performance in some cases. E.g.

```python
    config = hypersync.ParquetConfig(
        path="data",
        hex_output=True,
        batch_size=1000000,
        concurrency=10,
    )
```
