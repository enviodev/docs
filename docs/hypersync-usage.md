---
id: hypersync-usage
title: Usage
sidebar_label: Usage
slug: /hypersync-usage
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/S9Z6XkY3aP8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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

### cURL Query Example

Another way of communicating with HyperSync is via HTTP requests to the endpoint. Below is an example of a POST request to the HyperSync API.

This request retrieves all data specified in the field selection structure, filtering relevant events based on logs.topics and transactions.from/to fields.

```bash
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 0,
    "logs": [
        {
            "topics": [
                [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                ],
                [],
                [
                    "0x0000000000000000000000001e037f97d730Cc881e77F01E409D828b0bb14de0"
                ]
            ]
        },
        {
            "topics": [
                [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                ],
                [
                    "0x0000000000000000000000001e037f97d730Cc881e77F01E409D828b0bb14de0"
                ],
                []
            ]
        }
    ],
    "transactions": [
        {
            "from": [
                "0x1e037f97d730Cc881e77F01E409D828b0bb14de0"
            ]
        },
        {
            "to": [
                "0x1e037f97d730Cc881e77F01E409D828b0bb14de0"
            ]
        }
    ],
    "field_selection": {
        "block": [
            "number",
            "timestamp",
            "hash"
        ],
        "log": [
            "block_number",
            "log_index",
            "transaction_index",
            "data",
            "address",
            "topic0",
            "topic1",
            "topic2",
            "topic3"
        ],
        "transaction": [
            "block_number",
            "transaction_index",
            "hash",
            "from",
            "to",
            "value",
            "input"
        ]
    }
  }'
```