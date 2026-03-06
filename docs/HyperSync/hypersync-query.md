---
id: hypersync-query
title: HyperSync Query
sidebar_label: Query & Response Structure
slug: /hypersync-query
description: Explore HyperSync queries to efficiently retrieve, filter, and join blockchain data.
---

# HyperSync Query

This guide explains how to structure queries for HyperSync to efficiently retrieve blockchain data. You'll learn both the basics and advanced techniques to make the most of HyperSync's powerful querying capabilities.

:::note HyperFuel Limitations
Not all features implemented in HyperSync are available in HyperFuel (the Fuel implementation of HyperSync). For example, as of this writing, stream and collect functions aren't implemented in the Fuel client.
:::

## Client Examples

HyperSync offers client libraries in multiple languages, each with its own comprehensive examples. Instead of providing generic examples here, we recommend exploring the language-specific examples:

| Client      | Example Links                                                                                |
| ----------- | -------------------------------------------------------------------------------------------- |
| **Node.js** | [Example Repository](https://github.com/enviodev/hypersync-client-node/tree/main/examples)   |
| **Python**  | [Example Repository](https://github.com/enviodev/hypersync-client-python/tree/main/examples) |
| **Rust**    | [Example Repository](https://github.com/enviodev/hypersync-client-rust/tree/main/examples)   |
| **Go**      | [Example Repository](https://github.com/enviodev/hypersync-client-go/tree/main/examples)     |

Additionally, we maintain a comprehensive collection of real-world examples covering various use cases across different languages:

- [**30 HyperSync Examples**](https://github.com/enviodev/30-hypersync-examples) - A diverse collection of practical examples demonstrating HyperSync's capabilities in Python, JavaScript, TypeScript, Rust, and more.

For more details on client libraries, see the [HyperSync Clients](./hypersync-clients) documentation.

:::tip Visual Query Builder
Need help building queries? Try our **[Intuitive Query Builder](http://builder.hypersync.xyz)** to construct queries visually and see the results in real-time.
:::

:::tip Developer Tip
Set the `RUST_LOG` environment variable to `trace` for more detailed logs when using client libraries.
:::

## Table of Contents

1. [Understanding HyperSync Queries](#understanding-hypersync-queries)
2. [Query Execution Process](#query-execution-process)
3. [Query Structure Reference](#query-structure-reference)
4. [Data Schema](#data-schema)
5. [Response Structure](#response-structure)
6. [Stream and Collect Functions](#stream-and-collect-functions)
7. [Working with Join Modes](#working-with-join-modes)
8. [Best Practices](#best-practices)

## Understanding HyperSync Queries

A HyperSync query defines what blockchain data you want to retrieve and how you want it returned. Unlike regular RPC calls, HyperSync queries offer:

- **Flexible filtering** across logs, transactions, traces, and blocks
- **Field selection** to retrieve only the data you need
- **Automatic pagination** to handle large result sets
- **Join capabilities** that link related blockchain data together

### Core Concepts

- **Selections**: Define criteria for filtering blockchain data (logs, transactions, traces)
- **Field Selection**: Specify which fields to include in the response
- **Limits**: Control query execution time and response size
- **Joins**: Determine how related data is connected in the response

## Query Execution Process

### How Data is Organized

HyperSync organizes blockchain data into groups of contiguous blocks. When executing a query:

1. The server identifies which block group contains the starting block
2. It processes data groups sequentially until it hits a limit
3. Results are returned along with a `next_block` value for pagination

### Query Limits

HyperSync enforces several types of limits to ensure efficient query execution:

| Limit Type        | Description                                      | Behavior                                                  |
| ----------------- | ------------------------------------------------ | --------------------------------------------------------- |
| **Time**          | Server-configured maximum execution time         | May slightly exceed limit to complete current block group |
| **Response Size** | Maximum data returned                            | May slightly exceed limit to complete current block group |
| **to_block**      | User-specified ending block (exclusive)          | Never exceeds this limit                                  |
| **max*num*\***    | User-specified maximum number of results by type | May slightly exceed limit to complete current block group |

### Execution Steps

1. Server receives query and identifies the starting block group
2. It scans each block group, applying selection criteria
3. It joins related data according to the specified join mode
4. When a limit is reached, it finishes processing the current block group
5. It returns results with pagination information

### Understanding Pagination

HyperSync uses a time-based pagination model that differs from traditional RPC calls:

- By default, HyperSync has a **5-second query execution limit**
- Within this time window, it processes as many blocks as possible
- For example, starting with `from_block: 0` might progress to block 10 million in a single request
- Each response includes a `next_block` value indicating where to resume for the next query
- This differs from RPC calls where you typically specify fixed block ranges (e.g., 0-1000)

For most use cases, the `stream` function handles pagination automatically, making it the recommended approach for processing large ranges of blocks.

### Reverse Search

HyperSync supports searching from the head of the chain backwards, which is useful for:

- Block explorers showing the most recent activity
- UIs displaying latest transactions for a user
- Any use case where recent data is more relevant

To use reverse search, add the `reverse: true` parameter to your stream call:

```javascript
// Example of reverse search to get recent transactions
const receiver = await client.stream(query, { reverse: true });

let count = 0;
while (true) {
  let res = await receiver.recv();
  if (res === null) {
    break;
  }
  for (const tx of res.data.transactions) {
    console.log(JSON.stringify(tx, null, 2));
  }
  count += res.data.transactions.length;
  if (count >= 20) {
    break;
  }
}
```

With reverse search, HyperSync starts from the latest block and works backwards, allowing you to efficiently access the most recent blockchain data first.

## Query Structure Reference

A complete HyperSync query can include the following components:

### Core Query Parameters

```rust
struct Query {
    /// The block to start the query from
    from_block: u64,

    /// The block to end the query at (exclusive)
    /// If not specified, the query runs until the end of available data
    to_block: Optional<u64>,

    /// Log selection criteria (OR relationship between selections)
    logs: Array<LogSelection>,

    /// Transaction selection criteria (OR relationship between selections)
    transactions: Array<TransactionSelection>,

    /// Trace selection criteria (OR relationship between selections)
    traces: Array<TraceSelection>,

    /// Whether to include all blocks in the requested range
    /// Default: only return blocks related to matched transactions/logs
    include_all_blocks: bool,

    /// Fields to include in the response
    field_selection: FieldSelection,

    /// Maximum results limits (approximate)
    max_num_blocks: Optional<usize>,
    max_num_transactions: Optional<usize>,
    max_num_logs: Optional<usize>,
    max_num_traces: Optional<usize>,

    /// Data relationship model (Default, JoinAll, or JoinNothing)
    join_mode: JoinMode,
}
```

### Selection Types

#### Log Selection

```rust
struct LogSelection {
    /// Contract addresses to match (empty = match all)
    address: Array<Address>,

    /// Topics to match by position (empty = match all)
    /// Each array element corresponds to a topic position (0-3)
    /// Within each position, any matching value will satisfy the condition
    topics: Array<Array<Topic>>,
}
```

#### Transaction Selection

```rust
struct TransactionSelection {
    /// Sender addresses (empty = match all)
    /// Has AND relationship with 'to' field
    from: Array<Address>,

    /// Recipient addresses (empty = match all)
    /// Has AND relationship with 'from' field
    to: Array<Address>,

    /// Method signatures to match (first 4 bytes of input)
    sighash: Array<Sighash>,

    /// Transaction status to match (1 = success, 0 = failure)
    status: Optional<u8>,

    /// Transaction types to match (e.g., 0 = legacy, 2 = EIP-1559)
    type: Array<u8>,

    /// Created contract addresses to match
    contract_address: Array<Address>,
}
```

#### Block Selection

```rust
struct BlockSelection {
    /// Block hashes to match (empty = match all)
    hash: Array<Hash>,

    /// Miner/validator addresses to match (empty = match all)
    miner: Array<Address>,
}
```

#### Trace Selection

```rust
struct TraceSelection {
    /// Sender addresses (empty = match all)
    /// Has AND relationship with 'to' field
    from: Array<Address>,

    /// Recipient addresses (empty = match all)
    /// Has AND relationship with 'from' field
    to: Array<Address>,

    /// Created contract addresses to match
    address: Array<Address>,

    /// Call types to match (e.g., "call", "delegatecall")
    call_type: Array<String>,

    /// Reward types to match (e.g., "block", "uncle")
    reward_type: Array<String>,

    /// Trace types to match (e.g., "call", "create", "suicide", "reward")
    kind: Array<String>,

    /// Method signatures to match (first 4 bytes of input)
    sighash: Array<Sighash>,
}
```

#### Field Selection

```rust
struct FieldSelection {
    /// Block fields to include in response
    block: Array<String>,

    /// Transaction fields to include in response
    transaction: Array<String>,

    /// Log fields to include in response
    log: Array<String>,

    /// Trace fields to include in response
    trace: Array<String>,
}
```

## Data Schema

HyperSync organizes blockchain data into four main tables. Below are the available fields for each table.

:::info Field Naming
When specifying fields in your query, always use snake_case names (e.g., `block_number`, not `blockNumber`).
:::

### Block Fields

```python
class BlockField(StrEnum):
    NUMBER = 'number'               # Block number
    HASH = 'hash'                   # Block hash
    PARENT_HASH = 'parent_hash'     # Parent block hash
    TIMESTAMP = 'timestamp'         # Block timestamp (Unix time)
    MINER = 'miner'                 # Miner/validator address
    GAS_LIMIT = 'gas_limit'         # Block gas limit
    GAS_USED = 'gas_used'           # Total gas used in block
    BASE_FEE_PER_GAS = 'base_fee_per_gas'  # EIP-1559 base fee
    # Many more fields available...
```

### Transaction Fields

```python
class TransactionField(StrEnum):
    # Block-related fields
    BLOCK_HASH = 'block_hash'           # The Keccak 256-bit hash of the block
    BLOCK_NUMBER = 'block_number'       # Block number containing the transaction

    # Transaction identifiers
    HASH = 'hash'                       # Transaction hash (keccak hash of RLP encoded signed transaction)
    TRANSACTION_INDEX = 'transaction_index' # Index of the transaction in the block

    # Transaction participants
    FROM = 'from'                       # 160-bit address of the sender
    TO = 'to'                           # 160-bit address of the recipient (null for contract creation)

    # Gas information
    GAS = 'gas'                         # Gas limit set by sender
    GAS_PRICE = 'gas_price'             # Wei paid per unit of gas
    GAS_USED = 'gas_used'               # Actual gas used by the transaction
    CUMULATIVE_GAS_USED = 'cumulative_gas_used' # Total gas used in the block up to this transaction
    EFFECTIVE_GAS_PRICE = 'effective_gas_price' # Sum of base fee and tip paid per unit of gas

    # EIP-1559 fields
    MAX_PRIORITY_FEE_PER_GAS = 'max_priority_fee_per_gas' # Max priority fee (a.k.a. GasTipCap)
    MAX_FEE_PER_GAS = 'max_fee_per_gas' # Max fee per gas (a.k.a. GasFeeCap)

    # Transaction data
    INPUT = 'input'                     # Transaction input data or contract initialization code
    VALUE = 'value'                     # Amount of ETH transferred in wei
    NONCE = 'nonce'                     # Number of transactions sent by the sender

    # Signature fields
    V = 'v'                             # Replay protection value (based on chain_id)
    R = 'r'                             # The R field of the signature
    S = 's'                             # The S field of the signature
    Y_PARITY = 'y_parity'               # Signature Y parity
    CHAIN_ID = 'chain_id'               # Chain ID for replay protection (EIP-155)

    # Contract-related fields
    CONTRACT_ADDRESS = 'contract_address' # Address of created contract (for contract creation txs)

    # Transaction result fields
    STATUS = 'status'                   # Success (1) or failure (0)
    LOGS_BLOOM = 'logs_bloom'           # Bloom filter for logs produced by this transaction
    ROOT = 'root'                       # State root (pre-Byzantium)

    # EIP-2930 fields
    ACCESS_LIST = 'access_list'         # List of addresses and storage keys to pre-warm

    # EIP-4844 (blob transactions) fields
    MAX_FEE_PER_BLOB_GAS = 'max_fee_per_blob_gas' # Max fee per data gas (blob fee cap)
    BLOB_VERSIONED_HASHES = 'blob_versioned_hashes' # List of blob versioned hashes

    # Transaction type
    KIND = 'type'                       # Transaction type (0=legacy, 1=EIP-2930, 2=EIP-1559, 3=EIP-4844, 4=EIP-7702) # note - in old versions of the clients this was called 'kind', in newer versions its called 'type'

    # L2-specific fields (for rollups)
    L1_FEE = 'l1_fee'                   # Fee for L1 data (L1GasPrice × L1GasUsed)
    L1_GAS_PRICE = 'l1_gas_price'       # Gas price on L1
    L1_GAS_USED = 'l1_gas_used'         # Amount of gas consumed on L1
    L1_FEE_SCALAR = 'l1_fee_scalar'     # Multiplier for L1 fee calculation
    GAS_USED_FOR_L1 = 'gas_used_for_l1' # Gas spent on L1 calldata in L2 gas units
```

### Log Fields

```python
class LogField(StrEnum):
    # Log identification
    LOG_INDEX = 'log_index'             # Index of the log in the block
    TRANSACTION_INDEX = 'transaction_index' # Index of the transaction in the block

    # Transaction information
    TRANSACTION_HASH = 'transaction_hash' # Hash of the transaction that created this log

    # Block information
    BLOCK_HASH = 'block_hash'           # Hash of the block containing this log
    BLOCK_NUMBER = 'block_number'       # Block number containing this log

    # Log content
    ADDRESS = 'address'                 # Contract address that emitted the event
    DATA = 'data'                       # Non-indexed data from the event

    # Topics (indexed parameters)
    TOPIC0 = 'topic0'                   # Event signature hash
    TOPIC1 = 'topic1'                   # First indexed parameter
    TOPIC2 = 'topic2'                   # Second indexed parameter
    TOPIC3 = 'topic3'                   # Third indexed parameter

    # Reorg information
    REMOVED = 'removed'                 # True if log was removed due to chain reorganization
```

### Trace Fields

```python
class TraceField(StrEnum):
    # Trace identification
    TRANSACTION_HASH = 'transaction_hash'   # Hash of the transaction
    TRANSACTION_POSITION = 'transaction_position' # Index of the transaction in the block
    SUBTRACES = 'subtraces'                 # Number of sub-traces created during execution
    TRACE_ADDRESS = 'trace_address'         # Array indicating position in the trace tree

    # Block information
    BLOCK_HASH = 'block_hash'               # Hash of the block containing this trace
    BLOCK_NUMBER = 'block_number'           # Block number containing this trace

    # Transaction participants
    FROM = 'from'                           # Address of the sender
    TO = 'to'                               # Address of the recipient (null for contract creation)

    # Value and gas
    VALUE = 'value'                         # ETH value transferred (in wei)
    GAS = 'gas'                             # Gas limit
    GAS_USED = 'gas_used'                   # Gas actually used

    # Call data
    INPUT = 'input'                         # Call data for function calls
    INIT = 'init'                           # Initialization code for contract creation
    OUTPUT = 'output'                       # Return data from the call

    # Contract information
    ADDRESS = 'address'                     # Contract address (for creation/destruction)
    CODE = 'code'                           # Contract code

    # Trace types and categorization
    TYPE = 'type'                           # Trace type (call, create, suicide, reward)
    CALL_TYPE = 'call_type'                 # Call type (call, delegatecall, staticcall, etc.)
    REWARD_TYPE = 'reward_type'             # Reward type (block, uncle)

    # Other actors
    AUTHOR = 'author'                       # Address of receiver for reward transactions

    # Result information
    ERROR = 'error'                         # Error message if failed
```

For a complete list of all available fields, refer to the [HyperSync API Reference](https://docs.envio.dev/docs/HyperSync/hypersync-query).

## Response Structure

When you execute a HyperSync query, the response includes both metadata and the requested data:

```rust
struct QueryResponse {
    /// Current height of the blockchain in HyperSync
    archive_height: Optional<u64>,

    /// Block number to use as from_block in your next query for pagination
    next_block: u64,

    /// Query execution time in milliseconds
    total_execution_time: u64,

    /// The actual blockchain data matching your query
    data: ResponseData,

    /// Information to help handle chain reorganizations
    rollback_guard: Optional<RollbackGuard>,
}
```

### Rollback Guard

The `rollback_guard` is returned with every query response and is used to detect chain reorganizations (reorgs). When the blockchain forks, previously returned data may become invalid — the rollback guard gives you the information needed to detect this and re-fetch affected data.

```rust
struct RollbackGuard {
    /// Last block scanned in this query
    block_number: u64,
    /// Timestamp of the last block scanned
    timestamp: i64,
    /// Hash of the last block scanned
    hash: Hash,

    /// First block scanned in this query
    first_block_number: u64,
    /// Parent hash of the first block scanned in this query
    first_parent_hash: Hash,
}
```

#### How HyperSync Handles Reorgs Internally

HyperSync continuously ingests the latest block data. As new blocks arrive, HyperSync validates that each block's `parent_hash` matches the hash of the previous block. If a mismatch is detected — indicating a chain fork — HyperSync re-syncs the affected blocks to stay on the canonical chain.

This means HyperSync always serves the latest canonical data. However, if you previously queried data that was later affected by a reorg, that data is now stale. The rollback guard lets you detect this situation.

#### Data Consistency Within a Query

An important guarantee: **within a single query response, the data is always consistent**. You will never receive data where half comes from one fork and half from another. The rollback guard is relevant for detecting reorgs *between* successive queries.

#### Detecting Reorgs with the Rollback Guard

To detect reorgs, you need to store the rollback guard from each query response and compare it against the next query's rollback guard. Here's how it works:

1. **Store the `hash`** (last block hash) from each query's `rollback_guard`.
2. **On each subsequent query**, check if the `first_parent_hash` of the new response equals the `hash` from your previous response.
3. **If they don't match**, a reorg has occurred — the chain has reorganized since your last query, and some of the data you previously received may now be invalid.

```
Query N response:
  rollback_guard.hash = 0xABC...     ← store this

Query N+1 response:
  rollback_guard.first_parent_hash = 0xABC...  ← matches! No reorg.

                    — OR —

Query N+1 response:
  rollback_guard.first_parent_hash = 0xDEF...  ← mismatch! Reorg detected.
```

#### Handling a Detected Reorg

When a reorg is detected, the rollback guard tells you *that* a reorg happened, but not *which specific block* was reorganized (because the hashes of all subsequent blocks change after a reorg). To handle this:

1. **Store the rollback guard from every recent query** — keep at least enough history to cover the reorg threshold for your chain (e.g., up to 200 blocks for Polygon).
2. **Walk backwards through your stored rollback guards** to find the first query whose block hash no longer matches the chain. This tells you how far back the reorg goes.
3. **Re-query from that point** to get the updated canonical data.
4. **Roll back any downstream state** (database writes, computed state, etc.) that was derived from the now-invalid data, and reprocess with the fresh data.

Here's a simplified example in pseudocode:

```python
# Store rollback guards from recent queries
rollback_history = []  # list of (block_number, hash) tuples

while True:
    response = hypersync_client.get(query)

    if rollback_history:
        last_hash = rollback_history[-1][1]
        if response.rollback_guard.first_parent_hash != last_hash:
            # Reorg detected! Find how far back it goes.
            reorg_start = None
            for i in range(len(rollback_history) - 1, -1, -1):
                stored_block, stored_hash = rollback_history[i]
                # Re-fetch this block's hash from the chain to verify
                chain_hash = get_block_hash_from_hypersync(stored_block)
                if chain_hash == stored_hash:
                    # This block is still valid, reorg starts after this
                    reorg_start = stored_block + 1
                    break

            if reorg_start:
                # Roll back your state to reorg_start
                rollback_state_to(reorg_start)
                # Trim history and re-query from reorg_start
                rollback_history = [
                    (bn, h) for bn, h in rollback_history if bn < reorg_start
                ]
                query.from_block = reorg_start
                continue

    # No reorg — process data normally
    process_data(response.data)

    # Store this query's rollback guard
    rollback_history.append((
        response.rollback_guard.block_number,
        response.rollback_guard.hash
    ))

    # Trim old history beyond reorg threshold
    min_block = response.rollback_guard.block_number - REORG_THRESHOLD
    rollback_history = [
        (bn, h) for bn, h in rollback_history if bn >= min_block
    ]

    query.from_block = response.next_block
```

:::tip Consider HyperIndex
If you need automatic reorg handling, consider using [HyperIndex](/docs/HyperIndex/overview) instead of building this yourself. HyperIndex fetches an array of recent block hashes and numbers to pinpoint exactly where a reorg occurred, then automatically rolls back database state to the correct point. This saves significant implementation effort. HyperSync gives you full flexibility to handle reorgs however you want, but HyperIndex handles this complexity for you out of the box.
:::

## Stream and Collect Functions

For continuous data processing or building data pipelines, client libraries provide `stream` and `collect` functions that wrap the base query functionality.

:::caution Tip of Chain Warning
These functions are not designed for use at the blockchain tip where rollbacks may occur. For real-time data near the chain tip, implement a custom loop using the `get` functions and handle rollbacks manually.
:::

### Stream Function

The `stream` function:

- Runs multiple queries concurrently
- Returns a stream handle that yields results as they're available
- Optimizes performance through pipelined decoding/decompression
- Continues until reaching either `to_block` or the chain height at stream start

### Collect Functions

The `collect` functions:

- Call `stream` internally and aggregate results
- Offer different output formats (JSON, Parquet)
- Handle data that may not fit in memory

:::warning Resource Management
Always call `close()` on stream handles when finished to prevent resource leaks, especially if creating multiple streams.
:::

## Working with Join Modes

HyperSync "joins" connect related blockchain data automatically. Unlike SQL joins that combine rows from different tables, HyperSync joins determine which related records to include in the response.

### Default Join Mode (logs → transactions → traces → blocks)

With the default join mode:

1. When you query logs, you automatically get their associated transactions
2. Those transactions' traces are also included
3. The blocks containing these transactions are included

```
┌───────┐     ┌───────────────┐     ┌───────┐     ┌───────┐
│  Logs │ ──> │ Transactions  │ ──> │ Traces│ ──> │ Blocks│
└───────┘     └───────────────┘     └───────┘     └───────┘
```

### JoinAll Mode

JoinAll creates a more comprehensive network of related data:

```
                 ┌─────────────────────────────┐
                 │                             │
                 ▼                             │
┌───────┐ <──> ┌───────────────┐ <──> ┌───────┐ <──> ┌───────┐
│  Logs │      │ Transactions  │      │ Traces│      │ Blocks│
└───────┘      └───────────────┘      └───────┘      └───────┘
```

For example, if you query a trace:

1. You get the transaction that created it
2. You get ALL logs from that transaction (not just the ones matching your criteria)
3. You get ALL traces from that transaction
4. You get the block containing the transaction

### JoinNothing Mode

JoinNothing is the most restrictive:

```
┌───────┐     ┌───────────────┐     ┌───────┐     ┌───────┐
│  Logs │     │ Transactions  │     │ Traces│     │ Blocks│
└───────┘     └───────────────┘     └───────┘     └───────┘
```

Only data directly matching your selection criteria is returned, with no related records included.

## Best Practices

To get the most out of HyperSync queries:

1. **Minimize field selection** - Only request fields you actually need to improve performance
2. **Use appropriate limits** - Set `max_num_*` parameters to control response size
3. **Choose the right join mode** - Use `JoinNothing` for minimal data, `JoinAll` for complete context
4. **Process in chunks** - For large datasets, use pagination or the `stream` function
5. **Consider Parquet** - For analytical workloads, use `collect_parquet` for efficient storage
6. **Handle chain tip carefully** - Near the chain tip, implement custom rollback handling
