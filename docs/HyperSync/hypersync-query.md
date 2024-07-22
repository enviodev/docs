---
id: hypersync-query
title: HyperSync Query
sidebar_label: Hypersync Query
slug: /hypersync-query
---

# Hypersync Query

This page explains how the hypersync query works and how to get the data you need from hypersync.

<b>NOTE</b>: Not all of these features are implemented in Fuel implementation of HyperSync (HyperFuel). For example stream and collect functions aren't implemented on fuel clients as of writing.

## Table of Contents

1. [Introduction](#introduction) (A simple query example for introduction)
2. [Query Execution Explained](#query-execution-explained) (Explanation of how queries work)
3. [Query Structure](#query-fields) (Explanation of all query fields)
4. [Data Schema](#data-schema) (Entire schema for each data table)
5. [Response Structure](#response-structure) (Explanation of all response fields)
6. [Stream and Collect Functions](#stream-and-collect-functions) (Explains the stream and collect functions that are implemented in the client libraries)
7. [Join Modes](#join-modes) (Explains the join modes that are implemented in the client libraries)

## Introduction

This section gives a brief introduction using a simple query example.

Below is an example query that gets some logs and transactions related to a contract at address `0x3f69bb14860f7f3348ac8a5f0d445322143f7fee`.

We will explain the exact semantics of the query in next sections but can just go over the basics here for an introduction.

`logs` is the list of `LogSelection`s we want to pass. The server return all logs that match <b>any</b> of our selections.

Also the transactions for the logs that our query matches will be returned. This is because transactions are joined after querying logs implicitly in hypersync query implementation. Blocks are also joined after transactions but we won't get any blocks because we didn't select any block fields in our `field_selection`.

`field_selection` is for selecting the specific fields we want returned. You can think of it like the part where you list column names in an SQL `SELECT` statement. The available tables are `log`, `transaction`, `block` and `trace`. We will give an exact list of available columns in later sections.

We also have a `max_num_logs` parameter here which means the query execution will stop as soon as the server realizes it reached or exceeded ten logs in the response. So this is not an exact limit, but it can be effective when trying to fine tune the query response size or runtime.

If you want to drive this query until the end of the blockchain height or if you want to build a full data pipeline, it is recommended to use the `collect` and `stream` functions that are implemented in the client libraries.

<b>TIP</b>: set `RUST_LOG` environment variable to `trace` if you want to see more logs when using the client libraries.

```json
{
	"from_block": 0,
	"logs": [
		{
			"address": [
				"0x3f69bb14860f7f3348ac8a5f0d445322143f7fee"
			]
		}
	],
	"field_selection": {
		"log": [
			"address",
			"data",
			"topic0",
			"topic1",
			"topic2",
			"topic3"
		],
		"transaction": [
			"from",
			"to",
			"value",
			"input",
			"output",
			"gas_used",
			"type",
			"block_number"
		]
	},
	"max_num_logs": 10
}
```

## Query Execution Explained

This section explains how the query executes on the server, step-by-step.

#### Preliminary

The data in hypersync server is split into groups by block number. Each groups consists of data for a
 contiguous block range. When the query runs, these groups are always queried atomically, meaning if a group
 is queried it is never queried in half. This is important when considering limit arguments like `max_num_logs`
 or when considering time/response_size limits. If server realzes it reached a limit then it will terminate the
 query after it finishes the current data group it is querying and then return the response to the user. On the
 response it will put `next_block` value which is the block the query stopped at. 

#### Query limits

- <b>Time</b>: There is a server-configured time limit that applies to all queries. This limit can be exceeded slightly by the server, the reason is explained in the preliminary above.
- <b>Response size</b>: There is a server-configured response size limit that applies to all queries. But the user can also set a lower response size limit in their query via max_num_* parameters. This limit can be exceeded slightly by the server, the reason is explained in the preliminary above.
- <b>to_block</b>: This can be set by the user in query. The number is exclusive so the query will go up-to `to_block` but won't include data from this block. This limit won't be exceeded by the server so the query always will stop at this block number and will not include data from this block number or the later blocks. Also the next_block will be equal to this block number if none of the other limits triggered before server reached this block number.

#### Steps

- Server receives the query and checks which block the query starts at.
- It finds the data group it should start from.
- It iterates through the data groups using the query until it hits some limit
- When a limit is hit, the response is serialised and sent back to the client.

## Query Fields

In this section, we show the explanation of each field in the query. We give the content in `rust` style for
 formatting purposes. Field name casing can change based on which language client you are using, e.g. camelCase for nodejs client

```rust
struct Query {
    /// The block to start the query from
    from_block: u64,
    /// The block to end the query at. If not specified, the query will go until the
    ///  end of data. Exclusive, the returned range will be [from_block..to_block).
    ///
    /// The query will return before it reaches this target block if it hits the time limit
    ///  configured on the server. The user should continue their query by putting the
    ///  next_block field in the response into from_block field of their next query. This implements
    ///  pagination.
    to_block: Optional<u64>,
    /// List of log selections, these have an OR relationship between them, so the query will return logs
    /// that match any of these selections.
    logs: Array<LogSelection>,
    /// List of transaction selections, the query will return transactions that match any of these selections and
    ///  it will return transactions that are related to the returned logs.
    transactions: Array<TransactionSelection>,
    /// List of trace selections, the query will return traces that match any of these selections and
    ///  it will re turn traces that are related to the returned logs.
    traces: Array<TraceSelection>,
    /// Weather to include all blocks regardless of if they are related to a returned transaction or log. Normally
    ///  the server will return only the blocks that are related to the transaction or logs in the response. But if this
    ///  is set to true, the server will return data for all blocks in the requested range [from_block, to_block).
    include_all_blocks: bool,
    /// Field selection. The user can select which fields they are interested in, requesting less fields will improve
    ///  query execution time and reduce the payload size so the user should always use a minimal number of fields.
    field_selection: FieldSelection,
    /// Maximum number of blocks that should be returned, the server might return more blocks than this number but
    ///  it won't overshoot by too much.
    max_num_blocks: Optional<usize>,
    /// Maximum number of transactions that should be returned, the server might return more transactions than this number but
    ///  it won't overshoot by too much.
    max_num_transactions: Optional<usize>,
    /// Maximum number of logs that should be returned, the server might return more logs than this number but
    ///  it won't overshoot by too much.
    max_num_logs: Optional<usize>,
    /// Maximum number of traces that should be returned, the server might return more traces than this number but
    ///  it won't overshoot by too much.
    max_num_traces: Optional<usize>,
}

struct LogSelection {
    /// Address of the contract, any logs that has any of these addresses will be returned.
    /// Empty means match all.
    address: Array<Address>,
    /// Topics to match, each member of the top level array is another array, if the nth topic matches any
    ///  topic specified in nth element of topics, the log will be returned. Empty means match all.
    topics: Array<Array<Topic>>,
}

struct TransactionSelection {
    /// Address the transaction should originate from. If transaction.from matches any of these, the transaction
    /// will be returned. Keep in mind that this has an and relationship with `to` filter, so each transaction should
    /// match both of them. Empty means match all.
    from: Array<Address>,
    /// Address the transaction should go to. If transaction.to matches any of these, the transaction will
    /// be returned. Keep in mind that this has an and relationship with `from` filter, so each transaction should
    /// match both of them. Empty means match all.
    to: Array<Address>,
    /// If first 4 bytes of transaction input matches any of these, transaction will be returned. Empty means match all.
    sighash: Array<Sighash>,
    /// If transaction.status matches this value, the transaction will be returned.
    status: Optional<u8>,
    /// If transaction.type matches any of these values, the transaction will be returned.
    #[rename("type")]
    kind: Array<u8>,
    // If transaction.contract_address matches any of these values, the transaction will be returned.
    contract_address: Array<Address>,
}

struct TraceSelection {
    /// Address the trace should originate from. If trace.from matches any of these, the trace
    /// will be returned. Keep in mind that this has an and relationship with `to` filter, so each trace should
    /// match both of them. Empty means match all.
    from: Array<Address>,
    /// Address the trace should go to. If trace.to matches any of these, the trace will
    /// be returned. Keep in mind that this has an and relationship with `from` filter, so each trace should
    /// match both of them. Empty means match all.
    to: Array<Address>,
    /// The trace will be returned if the trace is a contract deployment (create) trace
    /// and the address of the deployed contract matches any of these addresses. Empty means match all.
    address: Array<Address>,
    /// If trace.call_type matches any of these values, the trace will be returned.  Empty means match all.
    /// See ethereum RPC `trace_block` method logs to learn more about this field
    call_type: Array<String>,
    /// If trace.reward_type matches any of these values, the trace will be returned.  Empty means match all.
    /// See ethereum RPC `trace_block` method logs to learn more about this field
    reward_type: Array<String>,
    /// If trace.type matches any of these values, the trace will be returned.  Empty means match all.
    /// For example it can be `reward` or `create`.
    /// See ethereum RPC `trace_block` method logs to learn more about this field
    #[rename("type")]
    kind: Array<String>,
    /// If first 4 bytes of trace input matches any of these, trace will be returned. Empty means match all.
    /// Sighash is a ethereum style hex encoded string of four bytes, e.g. 0xa2b4c6d8
    sighash: Array<Sighash>,
}

struct FieldSelection {
    /// List of names of columns to return from block table
    block: Array<String>,
    /// List of names of columns to return from transaction table
    transaction: Array<String>,
    /// List of names of columns to return from log table
    log: Array<String>,
    /// List of names of columns to return from trace table
    trace: Array<String>,
}
```

## Data Schema

This section is an exhaustive list of all columns of all tables. We give the content in `python` style for
 formatting purposes. Casing is always snake_case when passing raw strings inside field_selection into a client library.

```python
class BlockField(StrEnum):
    """Block field enum"""
    # A scalar value equal to the number of ancestor blocks. The genesis block has a number of zero; formally Hi.
    NUMBER = 'number'
    # The Keccak 256-bit hash of the block
    HASH = 'hash'
    # The Keccak 256-bit hash of the parent block’s header, in its entirety; formally Hp.
    PARENT_HASH = 'parent_hash'
    # A 64-bit value which, combined with the mixhash, proves that a sufficient amount of computation has been carried
    # out on this block; formally Hn.
    NONCE = 'nonce'
    # The Keccak 256-bit hash of the ommers/uncles list portion of this block; formally Ho.
    SHA3_UNCLES = 'sha3_uncles'
    # The Bloom filter composed from indexable information (logger address and log topics)
    # contained in each log entry from the receipt of each transaction in the transactions list;
    # formally Hb.
    LOGS_BLOOM = 'logs_bloom'
    # The Keccak 256-bit hash of the root node of the trie structure populated with each
    # transaction in the transactions list portion of the block; formally Ht.
    TRANSACTIONS_ROOT = 'transactions_root'
    # The Keccak 256-bit hash of the root node of the state trie, after all transactions are
    # executed and finalisations applied; formally Hr.
    STATE_ROOT = 'state_root'
    # The Keccak 256-bit hash of the root node of the trie structure populated with each transaction in the
    # transactions list portion of the block; formally Ht.
    RECEIPTS_ROOT = 'receipts_root'
    # The 160-bit address to which all fees collected from the successful mining of this block
    # be transferred; formally Hc.
    MINER = 'miner'
    # A scalar value corresponding to the difficulty level of this block. This can be calculated
    # from the previous block’s difficulty level and the timestamp; formally Hd.
    DIFFICULTY = 'difficulty'
    # The cumulative sum of the difficulty of all blocks that have been mined in the Ethereum network since the
    # inception of the network It measures the overall security and integrity of the Ethereum network.
    TOTAL_DIFFICULTY = 'total_difficulty'
    # An arbitrary byte array containing data relevant to this block. This must be 32 bytes or
    # fewer; formally Hx.
    EXTRA_DATA = 'extra_data'
    # The size of this block in bytes as an integer value, encoded as hexadecimal.
    SIZE = 'size'
    # A scalar value equal to the current limit of gas expenditure per block; formally Hl.
    GAS_LIMIT = 'gas_limit'
    # A scalar value equal to the total gas used in transactions in this block; formally Hg.
    GAS_USED = 'gas_used'
    # A scalar value equal to the reasonable output of Unix’s time() at this block’s inception; formally Hs.
    TIMESTAMP = 'timestamp'
    # Ommers/uncles header.
    UNCLES = 'uncles'
    # A scalar representing EIP1559 base fee which can move up or down each block according
    # to a formula which is a function of gas used in parent block and gas target
    # (block gas limit divided by elasticity multiplier) of parent block.
    # The algorithm results in the base fee per gas increasing when blocks are
    # above the gas target, and decreasing when blocks are below the gas target. The base fee per gas is burned.
    BASE_FEE_PER_GAS = 'base_fee_per_gas'
    # The total amount of blob gas consumed by the transactions within the block, added in EIP-4844.
    BLOB_GAS_USED = 'blob_gas_used'
    # A running total of blob gas consumed in excess of the target, prior to the block. Blocks
    # with above-target blob gas consumption increase this value, blocks with below-target blob
    # gas consumption decrease it (bounded at 0). This was added in EIP-4844.
    EXCESS_BLOB_GAS = 'excess_blob_gas'
    # The hash of the parent beacon block's root is included in execution blocks, as proposed by
    # EIP-4788.
    # This enables trust-minimized access to consensus state, supporting staking pools, bridges, and more.
    PARENT_BEACON_BLOCK_ROOT = 'parent_beacon_block_root'
    # The Keccak 256-bit hash of the withdrawals list portion of this block.
    # See [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895).
    WITHDRAWALS_ROOT = 'withdrawals_root'
    # Withdrawal represents a validator withdrawal from the consensus layer.
    WITHDRAWALS = 'withdrawals'
    # The L1 block number that would be used for block.number calls.
    L1_BLOCK_NUMBER = 'l1_block_number'
    # The number of L2 to L1 messages since Nitro genesis.
    SEND_COUNT = 'send_count'
    # The Merkle root of the outbox tree state.
    SEND_ROOT = 'send_root'
    # A 256-bit hash which, combined with the nonce, proves that a sufficient amount of computation has
    # been carried out on this block; formally Hm.
    MIX_HASH = 'mix_hash'

class TransactionField(StrEnum):
    """Transaction field enum"""
    # The Keccak 256-bit hash of the block
    BLOCK_HASH = 'block_hash'
    # A scalar value equal to the number of ancestor blocks. The genesis block has a number of
    # zero; formally Hi.
    BLOCK_NUMBER = 'block_number'
    # The 160-bit address of the message call’s sender
    FROM = 'from'
    # A scalar value equal to the maximum amount of gas that should be used in executing
    # this transaction. This is paid up-front, before any computation is done and may not be increased later;
    # formally Tg.
    GAS = 'gas'
    # A scalar value equal to the number of Wei to be paid per unit of gas for all computation
    # costs incurred as a result of the execution of this transaction; formally Tp.
    GAS_PRICE = 'gas_price'
    # A transaction hash is a keccak hash of an RLP encoded signed transaction.
    HASH = 'hash'
    # Input has two uses depending if transaction is Create or Call (if `to` field is None or
    # Some). pub init: An unlimited size byte array specifying the
    # EVM-code for the account initialisation procedure CREATE,
    # data: An unlimited size byte array specifying the
    # input data of the message call, formally Td.
    INPUT = 'input'
    # A scalar value equal to the number of transactions sent by the sender; formally Tn.
    NONCE = 'nonce'
    # The 160-bit address of the message call’s recipient or, for a contract creation
    # transaction, ∅, used here to denote the only member of B0 ; formally Tt.
    TO = 'to'
    # Index of the transaction in the block
    TRANSACTION_INDEX = 'transaction_index'
    # A scalar value equal to the number of Wei to be transferred to the message call’s recipient or,
    # in the case of contract creation, as an endowment to the newly created account; formally Tv.
    VALUE = 'value'
    # Replay protection value based on chain_id. See EIP-155 for more info.
    V = 'v'
    # The R field of the signature; the point on the curve.
    R = 'r'
    # The S field of the signature; the point on the curve.
    S = 's'
    # yParity: Signature Y parity; formally Ty
    Y_PARITY = 'y_parity'
    # Max Priority fee that transaction is paying. This is also known as `GasTipCap`
    MAX_PRIORITY_FEE_PER_GAS = 'max_priority_fee_per_gas'
    # A scalar value equal to the maximum. This is also known as `GasFeeCap`
    MAX_FEE_PER_GAS = 'max_fee_per_gas'
    # Added as EIP-pub 155: Simple replay attack protection
    CHAIN_ID = 'chain_id'
    # The accessList specifies a list of addresses and storage keys;
    # these addresses and storage keys are added into the `accessed_addresses`
    # and `accessed_storage_keys` global sets (introduced in EIP-2929).
    # A gas cost is charged, though at a discount relative to the cost of accessing outside the list.
    ACCESS_LIST = 'access_list'
    # Max fee per data gas aka BlobFeeCap or blobGasFeeCap
    MAX_FEE_PER_BLOB_GAS = 'max_fee_per_blob_gas'
    # It contains a list of fixed size hash(32 bytes)
    BLOB_VERSIONED_HASHES = 'blob_versioned_hashes'
    # The total amount of gas used in the block until this transaction was executed.
    CUMULATIVE_GAS_USED = 'cumulative_gas_used'
    # The sum of the base fee and tip paid per unit of gas.
    EFFECTIVE_GAS_PRICE = 'effective_gas_price'
    # Gas used by transaction
    GAS_USED = 'gas_used'
    # Address of created contract if transaction was a contract creation
    CONTRACT_ADDRESS = 'contract_address'
    # Bloom filter for logs produced by this transaction
    LOGS_BLOOM = 'logs_bloom'
    # Transaction type. For ethereum: Legacy, Eip2930, Eip1559, Eip4844
    KIND = 'type'
    # The Keccak 256-bit hash of the root node of the trie structure populated with each
    # transaction in the transactions list portion of the block; formally Ht.
    ROOT = 'root'
    # If transaction is executed successfully. This is the `statusCode`
    STATUS = 'status'
    # The fee associated with a transaction on the Layer 1, it is calculated as l1GasPrice multiplied by l1GasUsed
    L1_FEE = 'l1_fee'
    # The gas price for transactions on the Layer 1
    L1_GAS_PRICE = 'l1_gas_price'
    # The amount of gas consumed by a transaction on the Layer 1
    L1_GAS_USED = 'l1_gas_used'
    # A multiplier applied to the actual gas usage on Layer 1 to calculate the dynamic costs.
    # If set to 1, it has no impact on the L1 gas usage
    L1_FEE_SCALAR = 'l1_fee_scalar'
    # Amount of gas spent on L1 calldata in units of L2 gas.
    GAS_USED_FOR_L1 = 'gas_used_for_l1'

class LogField(StrEnum):
    """Log filed enum"""
    # The boolean value indicating if the event was removed from the blockchain due
    # to a chain reorganization. True if the log was removed. False if it is a valid log.
    REMOVED = 'removed'
    # The integer identifying the index of the event within the block's list of events.
    LOG_INDEX = 'log_index'
    # The integer index of the transaction within the block's list of transactions.
    TRANSACTION_INDEX = 'transaction_index'
    # The hash of the transaction that triggered the event.
    TRANSACTION_HASH = 'transaction_hash'
    # The hash of the block in which the event was included.
    BLOCK_HASH = 'block_hash'
    # The block number in which the event was included.
    BLOCK_NUMBER = 'block_number'
    # The contract address from which the event originated.
    ADDRESS = 'address'
    # The non-indexed data that was emitted along with the event.
    DATA = 'data'
    # Topic pushed by contract
    TOPIC0 = 'topic0'
    # Topic pushed by contract
    TOPIC1 = 'topic1'
    # Topic pushed by contract
    TOPIC2 = 'topic2'
    # Topic pushed by contract
    TOPIC3 = 'topic3'

class TraceField(StrEnum):
    """Trace field enum"""
    # The address of the sender who initiated the transaction.
    FROM = 'from'
    # The address of the recipient of the transaction if it was a transaction to an address.
    # For contract creation transactions, this field is None.
    TO = 'to'
    # The type of trace, `call` or `delegatecall`, two ways to invoke a function in a smart contract.
    # `call` creates a new environment for the function to work in, so changes made in that
    # function won't affect the environment where the function was called.
    # `delegatecall` doesn't create a new environment. Instead, it runs the function within the
    # environment of the caller, so changes made in that function will affect the caller's environment.
    CALL_TYPE = 'call_type'
    # The units of gas included in the transaction by the sender.
    GAS = 'gas'
    # The optional input data sent with the transaction, usually used to interact with smart contracts.
    INPUT = 'input'
    # The init code.
    INIT = 'init'
    # The value of the native token transferred along with the transaction, in Wei.
    VALUE = 'value'
    # The address of the receiver for reward transaction.
    AUTHOR = 'author'
    # Kind of reward. `Block` reward or `Uncle` reward.
    REWARD_TYPE = 'reward_type'
    # The hash of the block in which the transaction was included.
    BLOCK_HASH = 'block_hash'
    # The number of the block in which the transaction was included.
    BLOCK_NUMBER = 'block_number'
    # Destroyed address.
    ADDRESS = 'address'
    # Contract code.
    CODE = 'code'
    # The total used gas by the call, encoded as hexadecimal.
    GAS_USED = 'gas_used'
    # The return value of the call, encoded as a hexadecimal string.
    OUTPUT = 'output'
    # The number of sub-traces created during execution. When a transaction is executed on the EVM,
    # it may trigger additional sub-executions, such as when a smart contract calls another smart
    # contract or when an external account is accessed.
    SUBTRACES = 'subtraces'
    # An array that indicates the position of the transaction in the trace.
    TRACE_ADDRESS = 'trace_address'
    # The hash of the transaction.
    TRANSACTION_HASH = 'transaction_hash'
    # The index of the transaction in the block.
    TRANSACTION_POSITION = 'transaction_position'
    # The type of action taken by the transaction, `call`, `create`, `reward` and `suicide`.
    # `call` is the most common type of trace and occurs when a smart contract invokes another contract's function.
    # `create` represents the creation of a new smart contract. This type of trace occurs when a smart contract
    # is deployed to the blockchain.
    TYPE = 'type'
    # A string that indicates whether the transaction was successful or not.
    # None if successful, Reverted if not.
    ERROR = 'error'
```

## Response Structure

This section gives explanation of all response fields. We give the content in `rust` style for
 formatting purposes. Field name casing can change based on which language client you are using, e.g. camelCase for nodejs client

```rust
/// Query response from hypersync server.
struct QueryResponse {
    /// Current height of the source hypersync instance.
    /// This number is inclusive. Returns null if the server has no blocks yet.
    archive_height: Optional<u64>,
    /// Next block to query for, the responses are paginated so
    /// the caller should continue the query from this block if they
    /// didn't get responses up to the to_block they specified in the Query.
    next_block: u64,
    /// Total time it took the hypersync instance to execute the query in milliseconds.
    total_execution_time: u64,
    /// Response data
    /// This can be apache arrow formatted data or it can be native struct data based on
    ///  which client and method you are using. 
    data: ResponseData,
    /// Rollback guard, this structure is intended to make rollback handling easy and efficient on client side.
    rollback_guard: Optional<RollbackGuard>,
}

/// This structure is intended to make rollback handling easy and efficient on client side.
/// Here "in memory" refers to data that is only kept in memory and not yet flushed to disk. The data that
///  can be rolled back at any time is kept in memory until it reaches enough block depth so we can be sure
///  it won't be rolled back.
struct RollbackGuard {
    /// Block number of last block scanned in memory
    block_number: u64,
    /// Block timestamp of last block scanned in memory
    timestamp: i64,
    /// Block hash of last block scanned in memory
    hash: Hash,
    /// Block number of first block scanned in memory
    first_block_number: u64,
    /// Parent hash of first block scanned in memory
    first_parent_hash: Hash,
}
```

## Stream and Collect Functions

This section explains how the `stream` and `collect` functions work on the client libraries. These functions run the query multiple times internally so they can be harder to understand compared to how a single query works.

<b>Disclaimer</b>: These functions are not designed to be used in a rollback context, if you are at the tip of the chain we recommend implementing a loop using one of the `get` functions from the client library you are using and handling the rollbacks manually.

#### Stream

Stream function runs many internal queries concurrently and gives back the results as they come. It returns a stream handle that can be used to receive the results. It pipelines decoding/decompressing etc. of response chunks so user can get a very efficient experience out of the box. It will stream data until it reaches query.to_block or if to_block was not speicified in the query, it runs until it reaches chain height at the time of the stream start (it gets height of chain when it is starting the stream and runs until it reaches it).

<b>WARNING</b>: If you are opening/closing many streams in your program, it is recommended to explicitly call `close` function on the stream handle so there is no resource leakage.

#### Collect

The collect function essentially calls `stream` internally and collects all of the data into a single response. The `collect_parquet` function can be used to pipe data into a parquet file, it doesn't accumulate all data in memory so can be used to collect data that doesn't fit in RAM. We still recommend chunking the `collect_parquet` calls so you don't end up with big parquet files.

<b>TIP</b>: set `RUST_LOG` environment variable to `trace` if you want to see more logs when using the client libraries.

## Join Modes

<b>NOTE</b>: The word join does not mean the same as in `SQL` in this context. It means the inclusion of relevant data in the response instead of left/outer joining or similar in `SQL`. You can think of it like you do a select on table `A` and then join in table `B`. In sql this would mean each row contains rows from `A` and `B`. But in hypersync this means you get data for `A` and `B` seperately and the rows you get from `A` mean you will get the joined in rows from `B` as well in the response. 

In the context of Hypersync, joins refer to the implicit linking of different types of blockchain data (logs, transactions, traces, and blocks) based on certain relationships. Here's an explanation of how these joins work:

### Default Join Mechanism

`logs` -> `transactions` -> `traces` -> `blocks`

1. **Logs to Transactions**:
   - When you query logs using `log_selection`, Hypersync automatically retrieves the transactions associated with those logs. This is based on the transaction hash present in each log.
     - Example: If your `log_selection` returns some logs, Hypersync includes the transactions that generated these logs in the response as well.

2. **Transactions to Traces**:
   - After fetching the relevant transactions (either directly through `transaction_selection` or via logs), Hypersync retrieves the associated traces.
     - Example: If your `transaction_selection` returns transactions or if you get some transactions because of your `log_selection`, Hypersync includes traces related to these transactions in the response as well.

And this same scheme goes on from traces into blocks as well. We realize this doesn't cover all use cases. For example the user can't get logs based on their transaction_selection this way. This is why we implemented alternative `join_mode` implementations.

### Alternative Join Modes 

1. **JoinAll**:

   This mode first builds up a list of transactions based on selection of every table. For example the list will include a transaction if your `log_selection` selected a log generated by this transaction.

   Then it includes every object relating to any of these transactions on the list. For example it includes all traces that were generated by any of these transactions on the list.

   For example let's say you selected a trace. It will include the transaction that generated this trace. And then it will include everything related to this transaction including all the logs, traces, the block and the transaction itself.

3. **JoinNothing**:
   This mode completely removes joining so you only get what your selections match. For example if your `log_selection` matches a log then you will only get that log, you will not get the block of the log or the transaction that generated that log.

To use these join modes set `query.join_mode` to the desired value. It defaults to the `Default` mode if it is not specified.
