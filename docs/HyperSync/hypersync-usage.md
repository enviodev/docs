---
id: hypersync-usage
title: Using HyperSync
sidebar_label: Getting Started
slug: /hypersync-usage
description: Learn how to fetch, filter, and decode blockchain data using HyperSync.
---

# Getting Started with HyperSync

HyperSync is Envio's high-performance blockchain data engine that provides up to 2000x faster access to blockchain data compared to traditional RPC endpoints. This guide will help you understand how to effectively use HyperSync in your applications.

## Quick Start Video

Watch this quick tutorial to see HyperSync in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/S9Z6XkY3aP8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Core Concepts

HyperSync revolves around two main concepts:

1. **Queries** - Define what blockchain data you want to retrieve
2. **Output Configuration** - Specify how you want that data formatted and delivered

Think of queries as your data filter and the output configuration as your data processor.

## Building Effective Queries

Queries are the heart of working with HyperSync. They allow you to filter for specific blocks, logs, transactions, and traces.

### Query Structure

A basic HyperSync query contains:

```python
query = hypersync.Query(
    from_block=12345678,               # Required: Starting block number
    to_block=12345778,                 # Optional: Ending block number
    field_selection=field_selection,   # Required: What fields to return
    logs=[log_selection],              # Optional: Filter for specific logs
    transactions=[tx_selection],       # Optional: Filter for specific transactions
    traces=[trace_selection],          # Optional: Filter for specific traces
    include_all_blocks=False,          # Optional: Include blocks with no matches
    max_num_blocks=1000,               # Optional: Limit number of blocks processed
    max_num_transactions=5000,         # Optional: Limit number of transactions processed
    max_num_logs=5000,                 # Optional: Limit number of logs processed
    max_num_traces=5000                # Optional: Limit number of traces processed
)
```

### Field Selection

Field selection allows you to specify exactly which data fields you want to retrieve. This improves performance by only fetching what you need:

```python
field_selection = hypersync.FieldSelection(
    # Block fields you want to retrieve
    block=[
        BlockField.NUMBER,
        BlockField.TIMESTAMP,
        BlockField.HASH
    ],

    # Transaction fields you want to retrieve
    transaction=[
        TransactionField.HASH,
        TransactionField.FROM,
        TransactionField.TO,
        TransactionField.VALUE
    ],

    # Log fields you want to retrieve
    log=[
        LogField.ADDRESS,
        LogField.TOPIC0,
        LogField.TOPIC1,
        LogField.TOPIC2,
        LogField.TOPIC3,
        LogField.DATA,
        LogField.TRANSACTION_HASH
    ],

    # Trace fields you want to retrieve (if applicable)
    trace=[
        TraceField.ACTION_FROM,
        TraceField.ACTION_TO,
        TraceField.ACTION_VALUE
    ]
)
```

### Filtering for Specific Data

For most use cases, you'll want to filter for specific logs, transactions, or traces:

#### Log Selection Example

```python
# Filter for Transfer events from USDC contract
log_selection = hypersync.LogSelection(
    address=["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],  # USDC contract
    topics=[
        ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]  # Transfer event signature
    ]
)
```

#### Transaction Selection Example

```python
# Filter for transactions to the Uniswap V3 router
tx_selection = hypersync.TransactionSelection(
    to=["0xE592427A0AEce92De3Edee1F18E0157C05861564"]  # Uniswap V3 Router
)
```

## Processing the Results

HyperSync provides multiple ways to process query results:

### Stream to Parquet Files

Parquet is the recommended format for large data sets:

```python
# Configure output format
config = hypersync.StreamConfig(
    hex_output=hypersync.HexOutput.PREFIXED,
    event_signature="Transfer(address indexed from, address indexed to, uint256 value)"
)

# Stream results to a Parquet file
await client.collect_parquet("data_directory", query, config)
```

### Stream to JSON Files

For smaller datasets or debugging:

```python
# Stream results to JSON
await client.collect_json("output.json", query, config)
```

### Process Data in Memory

For immediate processing:

```python
# Process data directly
async for result in client.stream(query, config):
    for log in result.logs:
        # Process each log
        print(f"Transfer from {log.event_params['from']} to {log.event_params['to']}")
```

## Tips and Best Practices

### Performance Optimization

- **Use Appropriate Batch Sizes**: Adjust batch size based on your chain and use case:

  ```python
  config = hypersync.ParquetConfig(
      path="data",
      hex_output=hypersync.HexOutput.PREFIXED,
      batch_size=1000000,  # Process 1M blocks at a time
      concurrency=10,      # Use 10 concurrent workers
  )
  ```

- **Enable Trace Logs**: Set `RUST_LOG=trace` to see detailed progress:

  ```bash
  export RUST_LOG=trace
  ```

- **Paginate Large Queries**: HyperSync requests have a 5-second time limit. For large data sets, paginate results:
  ```python
  current_block = start_block
  while current_block < end_block:
      query.from_block = current_block
      query.to_block = min(current_block + 1000000, end_block)
      result = await client.collect_parquet("data", query, config)
      current_block = result.end_block + 1
  ```

### Network-Specific Considerations

- **High-Volume Networks**: For networks like Ethereum Mainnet, use smaller block ranges or more specific filters
- **Low-Volume Networks**: For smaller chains, you can process the entire chain in one query

## Complete Example

Here's a complete example that fetches all USDC Transfer events:

```python
import hypersync
from hypersync import (
    LogSelection,
    LogField,
    BlockField,
    FieldSelection,
    TransactionField,
    HexOutput
)
import asyncio

async def collect_usdc_transfers():
    # Initialize client
    client = hypersync.HypersyncClient(
        hypersync.ClientConfig(
            url="https://eth.hypersync.xyz",
            bearer_token="your-token-here",  # Get from https://docs.envio.dev/docs/HyperSync/api-tokens
        )
    )

    # Define field selection
    field_selection = hypersync.FieldSelection(
        block=[BlockField.NUMBER, BlockField.TIMESTAMP],
        transaction=[TransactionField.HASH],
        log=[
            LogField.ADDRESS,
            LogField.TOPIC0,
            LogField.TOPIC1,
            LogField.TOPIC2,
            LogField.DATA,
        ]
    )

    # Define query for USDC transfers
    query = hypersync.Query(
        from_block=12000000,
        to_block=12100000,
        field_selection=field_selection,
        logs=[
            LogSelection(
                address=["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],  # USDC contract
                topics=[
                    ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]  # Transfer signature
                ]
            )
        ]
    )

    # Configure output
    config = hypersync.StreamConfig(
        hex_output=HexOutput.PREFIXED,
        event_signature="Transfer(address indexed from, address indexed to, uint256 value)"
    )

    # Collect data to a Parquet file
    result = await client.collect_parquet("usdc_transfers", query, config)
    print(f"Processed blocks {query.from_block} to {result.end_block}")

asyncio.run(collect_usdc_transfers())
```

## Decoding Event Logs

When working with blockchain data, event logs contain encoded data that needs to be properly decoded to extract meaningful information. HyperSync provides powerful decoding capabilities to simplify this process.

### Understanding Log Structure

Event logs in Ethereum have the following structure:

- **Address**: The contract that emitted the event
- **Topic0**: The event signature hash (keccak256 of the event signature)
- **Topics 1-3**: Indexed parameters (up to 3)
- **Data**: Non-indexed parameters packed together

### Using the Decoder

HyperSync's client libraries include a `Decoder` class that can parse these raw logs into structured data:

```javascript
// Create a decoder with event signatures
const decoder = Decoder.fromSignatures([
  "Transfer(address indexed from, address indexed to, uint256 amount)",
  "Approval(address indexed owner, address indexed spender, uint256 amount)",
]);

// Decode logs
const decodedLogs = await decoder.decodeLogs(logs);
```

### Single vs. Multiple Event Types

HyperSync provides flexibility to decode different types of event logs:

- **Single Event Type**: For processing one type of event (e.g., only Swap events)

  - See complete example: [run-decoder.js](https://github.com/enviodev/hypersync-quickstart/blob/main/run-decoder.js)

- **Multiple Event Types**: For processing different events from the same contract (e.g., Transfer and Approval)
  - See complete example: [run-decoder-multi.js](https://github.com/enviodev/hypersync-quickstart/blob/main/run-decoder-multi.js)

### Working with Decoded Data

After decoding, you can access the log parameters in a structured way:

- **Indexed parameters**: Available in `decodedLog.indexed` array
- **Non-indexed parameters**: Available in `decodedLog.body` array

Each parameter object contains:

- **name**: The parameter name from the signature
- **type**: The Solidity type
- **val**: The actual value

For example, to access parameters from a Transfer event:

```javascript
// Access indexed parameters (from, to)
const from = decodedLog.indexed[0]?.val.toString();
const to = decodedLog.indexed[1]?.val.toString();

// Access non-indexed parameters (amount)
const amount = decodedLog.body[0]?.val.toString();
```

### Benefits of Using the Decoder

- **Type Safety**: Values are properly converted to their corresponding types
- **Simplified Access**: Direct access to named parameters
- **Batch Processing**: Decode multiple logs with a single call
- **Multiple Event Support**: Handle different event types in the same processing pipeline

## Next Steps

Now that you understand the basics of using HyperSync:

- Browse the [Python Client](./hypersync-clients.md) or other language-specific clients
- Learn about [advanced query options](./hypersync-query.md)
- See [example queries for common use cases](./hypersync-curl-examples.md)
- [Get your API token](./api-tokens.mdx) to start building

For detailed API references and examples in other languages, check our [client documentation](./hypersync-clients.md).
