---
id: hypersync-presets
title: Preset Queries
sidebar_label: Preset Queries
slug: /hypersync-presets
description: Explore ready-to-use HyperSync query presets to fetch blocks, transactions, and logs efficiently.
---

# HyperSync Preset Queries

HyperSync's client libraries include helper functions that build common queries. These presets are useful when you need raw blockchain objects without crafting a query manually.

Each preset returns a `Query` object so you can pass it directly to `client.get`, `client.stream`, or `client.collect`.

## Available Presets

### `preset_query_blocks_and_transactions(from_block, to_block)`
Returns every block and all associated transactions within the supplied block range.

```python
import hypersync
import asyncio

async def main():
    client = hypersync.HypersyncClient(hypersync.ClientConfig())

    query = hypersync.preset_query_blocks_and_transactions(17_000_000, 17_000_050)
    result = await client.get(query)
    print(f"Query returned {len(result.data.blocks)} blocks and {len(result.data.transactions)} transactions")

asyncio.run(main())
```

### `preset_query_blocks_and_transaction_hashes(from_block, to_block)`
Returns each block in the range along with only the transaction hashes.

### `preset_query_get_logs(addresses, from_block, to_block)`
Fetches all logs emitted by the provided contract addresses in the given block range.

```python
logs_res = await client.get(
    hypersync.preset_query_get_logs(["0xYourContract"], 17_000_000, 17_000_050)
)
```

### `preset_query_logs(from_block, to_block)`
Fetches every log across the specified blocks.

### `preset_query_logs_of_event(event_signature, from_block, to_block)`
Fetches logs for the specified event signature over the block range.

Client libraries for other languages expose the same presets under similar names. See the [Python](https://github.com/enviodev/hypersync-client-python) and [Node.js](https://github.com/enviodev/hypersync-client-node) example repositories for more details.

Use these helpers whenever you need a quick query without specifying field selections or joins manually.
