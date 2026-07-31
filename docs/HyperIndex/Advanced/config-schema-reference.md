---
id: config-schema-reference
title: Configuration Schema Reference
sidebar_label: Config Schema Reference
slug: /config-schema-reference
---

Static, deep-linkable reference for the V3 `config.yaml` schema.

> Tip: Use the Table of Contents to jump to a field or definition.


## Top-level Properties

- [name](#name) (required)
- [description](#description)
- [schema](#schema)
- [handlers](#handlers)
- [full_batch_size](#fullbatchsize)
- [storage](#storage)
- [ecosystem](#ecosystem)
- [contracts](#contracts)
- [chains](#chains) (required)
- [rollback_on_reorg](#rollbackonreorg)
- [save_full_history](#savefullhistory)
- [field_selection](#fieldselection)
- [raw_events](#rawevents)
- [address_format](#addressformat)

### name {#name}

Name of the project

- **type**: `string`


Example (config.yaml):

```yaml
name: MyIndexer
```

### description {#description}

Description of the project

- **type**: `string | null`


Example (config.yaml):

```yaml
description: Greeter indexer
```

### schema {#schema}

Custom path to schema.graphql file

- **type**: `string | null`


Example (config.yaml):

```yaml
schema: ./schema.graphql
```

### handlers {#handlers}

Optional relative path to handlers directory for auto-loading. Defaults to 'src/handlers' if not specified.

- **type**: `string | null`


### full_batch_size {#fullbatchsize}

Target number of events to be processed per batch. Set it to smaller number if you have many Effect API calls which are slow to resolve and can't be batched. (Default: 5000)

- **type**: `integer | null`
- **bounds**: min: 0, format: `uint64`


Example (config.yaml):

```yaml
full_batch_size: 5000
```

### storage {#storage}

Storage backends the indexer writes data to. Defaults to Postgres when omitted. Set `clickhouse: true` to additionally sync the indexed data to ClickHouse. Mark a backend with `default: true` to store entities that don't have an @storage directive in the schema, e.g. `clickhouse: {default: true}`.

- **type**: `anyOf(object<StorageConfig> | null)`

Variants:
- `1`: [StorageConfig](#def-storageconfig)
- `2`: `null`


Example (config.yaml):

```yaml
storage:
  postgres:
    default: true
    column_name_format: snake_case
  clickhouse: true
```

### ecosystem {#ecosystem}

Ecosystem of the project.

- **type**: `anyOf(object<EcosystemTag> | null)`

Variants:
- `1`: [EcosystemTag](#def-ecosystemtag)
- `2`: `null`


Example (config.yaml):

```yaml
ecosystem: evm
```

### contracts {#contracts}

Global contract definitions that must contain all definitions except addresses. You can share a single handler/abi/event definitions for contracts across multiple chains.

- **type**: `array | null`


Example (config.yaml):

```yaml
contracts:
  - name: Greeter
    events:
      - event: "NewGreeting(address user, string greeting)"
```

### chains {#chains}

Configuration of the blockchain chains that the project is deployed on.

- **type**: `array<object<Chain>>`
- **items**: `object<Chain>`
- **items ref**: [Chain](#def-chain)


Example (config.yaml):

```yaml
chains:
  - id: 1
    start_block: 0
    contracts:
      - name: Greeter
        address: "0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c"
```

### rollback_on_reorg {#rollbackonreorg}

A flag to indicate if the indexer should rollback to the last known valid block on a reorg. This currently incurs a performance hit on historical sync and is recommended to turn this off while developing (default: true)

- **type**: `boolean | null`


Example (config.yaml):

```yaml
rollback_on_reorg: true
```

### save_full_history {#savefullhistory}

A flag to indicate if the indexer should save the full history of events. This is useful for debugging but will increase the size of the database (default: false)

- **type**: `boolean | null`


Example (config.yaml):

```yaml
save_full_history: false
```

### field_selection {#fieldselection}

Select the block and transaction fields to include in all events globally

- **type**: `anyOf(object<FieldSelection> | null)`

Variants:
- `1`: [FieldSelection](#def-fieldselection)
- `2`: `null`


Example (config.yaml):

```yaml
field_selection:
  transaction_fields:
    - hash
  block_fields:
    - miner
```

### raw_events {#rawevents}

If true, the indexer will store the raw event data in the database. This is useful for debugging, but will increase the size of the database and the amount of time it takes to process events (default: false)

- **type**: `boolean | null`


Example (config.yaml):

```yaml
raw_events: true
```

### address_format {#addressformat}

Address format for Ethereum addresses: 'checksum' or 'lowercase' (default: checksum)

- **type**: `anyOf(object<AddressFormat> | null)`

Variants:
- `1`: [AddressFormat](#def-addressformat)
- `2`: `null`


## Definitions

### StorageConfig {#def-storageconfig}

- **type**: `allOf(unknown & unknown)`

Properties:
- `postgres`: `anyOf(boolean | null | object)` – Whether to use Postgres as a storage backend (default: true). Accepts a boolean or an options object (the object form implies the backend is enabled).
- `clickhouse`: `anyOf(boolean | null | object)` – Whether to additionally sync the indexed data to ClickHouse. Requires Postgres to be enabled (default: false). Accepts a boolean or an options object (the object form implies the backend is enabled).

Example (config.yaml):

```yaml
storage:
  postgres:
    # Entities without an @storage directive land here
    default: true
    # Columns become snake_case in the database, while GraphQL and
    # handler types keep the schema.graphql casing
    column_name_format: snake_case
  clickhouse:
    default: false
```

### EcosystemTag {#def-ecosystemtag}

- **type**: `enum (1 values)`
- **allowed**: `evm`

Example (config.yaml):

```yaml
ecosystem: evm
```

### GlobalContract {#def-globalcontract}

- **type**: `object`
- **required**: `name`, `events`

Properties:
- `name`: `string` – A unique project-wide name for this contract (no spaces)
- `abi_file_path`: `string | null` – Relative path (from config) to a json abi. If this is used then each configured event should simply be referenced by its name
- `handler`: `string | null` – Optional relative path to a file where handlers are registered for the given contract. If not provided, handlers can be auto-loaded from src directory.
- `events`: `array<object<EventConfig>>` – A list of events that should be indexed on this contract

Example (config.yaml):

```yaml
contracts:
  - name: Greeter
    events:
      - event: "NewGreeting(address user, string greeting)"
```

### EventConfig {#def-eventconfig}

- **type**: `object`
- **required**: `event`

Properties:
- `event`: `string` – The human readable signature of an event 'eg. Transfer(address indexed from, address indexed to, uint256 value)' OR a reference to the name of an event in a json ABI file defined in your contract config. A provided signature will take precedence over what is defined in the json ABI
- `name`: `string | null` – Name of the event in the HyperIndex generated code. When ommitted, the event field will be used. Should be unique per contract
- `field_selection`: `anyOf(object<FieldSelection> | null)` – Select the block and transaction fields to include in the specific event

Example (config.yaml):

```yaml
contracts:
  - name: Greeter
    events:
      - event: "Assigned(address indexed recipientId, uint256 amount, address token)"
        name: Assigned
        field_selection:
          transaction_fields:
            - transactionIndex
```

### FieldSelection {#def-fieldselection}

- **type**: `object`

Properties:
- `transaction_fields`: `array | null` – The transaction fields to include in the event, or in all events if applied globally
  - Available values:
`transactionIndex`, `hash`, `from`, `to`, `gas`, `gasPrice`, `maxPriorityFeePerGas`, `maxFeePerGas`, `cumulativeGasUsed`, `effectiveGasPrice`, `gasUsed`, `input`, `nonce`, `value`, `v`, `r`, `s`, `contractAddress`, `logsBloom`, `root`, `status`, `yParity`, `accessList`, `maxFeePerBlobGas`, `blobVersionedHashes`, `type`, `l1Fee`, `l1GasPrice`, `l1GasUsed`, `l1FeeScalar`, `gasUsedForL1`, `authorizationList`
- `block_fields`: `array | null` – The block fields to include in the event, or in all events if applied globally
  - Available values:
`parentHash`, `nonce`, `sha3Uncles`, `logsBloom`, `transactionsRoot`, `stateRoot`, `receiptsRoot`, `miner`, `difficulty`, `totalDifficulty`, `extraData`, `size`, `gasLimit`, `gasUsed`, `uncles`, `baseFeePerGas`, `blobGasUsed`, `excessBlobGas`, `parentBeaconBlockRoot`, `withdrawalsRoot`, `l1BlockNumber`, `sendCount`, `sendRoot`, `mixHash`

Example (config.yaml):

```yaml
events:
  - event: "Assigned(address indexed user, uint256 amount)"
    # can be within an event as shown here, or globally for all events
    field_selection:
      transaction_fields:
        - transactionIndex
      block_fields:
        - miner
```

### Chain {#def-chain}

- **type**: `object`
- **required**: `id`, `start_block`

Properties:
- `id`: `integer` – The public blockchain chain ID.
- `skip`: `boolean | null` – Excludes the chain from indexing and migrations. Code generation is unaffected. For testing, prefer using a test framework instead.
- `rpc`: `anyOf(object<RpcSelection> | null)` – RPC configuration for your indexer. If not specified otherwise, for chains supported by HyperSync, RPC serves as a fallback for added reliability. For others, it acts as the primary data-source. HyperSync offers significant performance improvements, up to a 1000x faster than traditional RPC.
- `hypersync_config`: `anyOf(object<HypersyncConfig> | null)` – Optional HyperSync Config for additional fine-tuning
- `max_reorg_depth`: `integer | null` – The number of blocks from the head that the indexer should account for in case of reorgs.
- `block_lag`: `integer | null` – The number of blocks behind the chain head that the indexer should lag. Useful for avoiding reorg issues by indexing slightly behind the tip.
- `start_block`: `integer` – The block at which the indexer should start ingesting data
- `end_block`: `integer | null` – The block at which the indexer should terminate.
- `contracts`: `array | null` – All the contracts that should be indexed on the given chain

Example (config.yaml):

```yaml
chains:
  - id: 1
    start_block: 0
    end_block: 19000000
    contracts:
      - name: Greeter
        address: "0x1111111111111111111111111111111111111111"
  # Excluded from indexing and migrations, but still code-generated
  - id: 137
    skip: true
    start_block: 0
```

### RpcSelection {#def-rpcselection}

- **type**: `anyOf(string | object<Rpc> | array<object<Rpc>>)`

Variants:
- `1`: `string`
- `2`: [Rpc](#def-rpc)
- `3`: `array<object<Rpc>>`

### Rpc {#def-rpc}

- **type**: `object`
- **required**: `url`

Properties:
- `url`: `string` – The RPC endpoint URL.
- `for`: `anyOf(object<For> | null)` – Determines if this RPC is for historical sync, real-time chain indexing, or as a fallback. If not specified, defaults to "fallback" when HyperSync is available for the chain, or "sync" otherwise.
- `ws`: `string | null` – Optional WebSocket endpoint URL (wss:// or ws://) for real-time block header notifications via eth_subscribe("newHeads"). Provides lower latency than HTTP polling for detecting new blocks.
- `headers`: `object | null` – Optional HTTP headers sent with every request to this RPC endpoint, e.g. an Authorization bearer token for gated endpoints. Values support `${ENV_VAR}` interpolation.
- `initial_block_interval`: `integer | null` – The starting interval in range of blocks per query
- `backoff_multiplicative`: `number | null` – After an RPC error, how much to scale back the number of blocks requested at once
- `acceleration_additive`: `integer | null` – Without RPC errors or timeouts, how much to increase the number of blocks requested by for the next batch
- `interval_ceiling`: `integer | null` – Do not further increase the block interval past this limit
- `backoff_millis`: `integer | null` – After an error, how long to wait before retrying
- `fallback_stall_timeout`: `integer | null` – If a fallback RPC is provided, the amount of time in ms to wait before kicking off the next provider
- `query_timeout_millis`: `integer | null` – How long to wait before cancelling an RPC request
- `polling_interval`: `integer | null` – How frequently (in milliseconds) to check for new blocks in realtime. Default is 1000ms. Note: Setting this higher than block time does not reduce RPC usage as every block is still fetched to check for reorgs.

Example (config.yaml):

```yaml
chains:
  - id: 1
    rpc:
      - url: https://eth.llamarpc.com
        for: sync
        headers:
          Authorization: "Bearer ${RPC_API_KEY}"
      - url: wss://eth.llamarpc.com
        for: realtime
      - url: https://fallback.example.com
        for: fallback
```

### For {#def-for}

- **type**: `oneOf(const sync | const fallback | const realtime)`

Variants:
- `1`: `const sync`
- `2`: `const fallback`
- `3`: `const realtime`

### HypersyncConfig {#def-hypersyncconfig}

- **type**: `object`
- **required**: `url`

Properties:
- `url`: `string` – URL of the HyperSync endpoint (default: The most performant HyperSync endpoint for the network)

Example (config.yaml):

```yaml
chains:
  - id: 1
    hypersync_config:
      url: https://eth.hypersync.xyz
```

### ChainContract {#def-chaincontract}

- **type**: `object`
- **required**: `name`

Properties:
- `name`: `string` – A unique project-wide name for this contract if events and handler are defined OR a reference to the name of contract defined globally at the top level
- `address`: `object<Addresses>` – A single address or a list of addresses to be indexed. This can be left as null in the case where this contracts addresses will be registered dynamically.
- `start_block`: `integer | null` – The block at which the indexer should start ingesting data for this specific contract. If not specified, uses the chain start_block. Can be greater than the chain start_block for more specific indexing.
- `abi_file_path`: `string | null` – Relative path (from config) to a json abi. If this is used then each configured event should simply be referenced by its name
- `handler`: `string | null` – Optional relative path to a file where handlers are registered for the given contract. If not provided, handlers can be auto-loaded from src directory.
- `events`: `array<object<EventConfig>>` – A list of events that should be indexed on this contract

Example (config.yaml):

```yaml
chains:
  - id: 1
    start_block: 0
    contracts:
      - name: Greeter
        address:
          - "0x1111111111111111111111111111111111111111"
        events:
          - event: Transfer(address indexed from, address indexed to, uint256 value)
```

### Addresses {#def-addresses}

- **type**: `anyOf(anyOf(string | integer) | array<anyOf(string | integer)>)`

Variants:
- `1`: `anyOf(string | integer)`
- `2`: `array<anyOf(string | integer)>`

Example (config.yaml):

```yaml
chains:
  - id: 1
    contracts:
      - name: Greeter
        address:
          - "0x1111111111111111111111111111111111111111"
          - "0x2222222222222222222222222222222222222222"
```

### AddressFormat {#def-addressformat}

- **type**: `enum (2 values)`
- **allowed**: `checksum`, `lowercase`

## Removed in V3

The following V2 options have been removed and are no longer accepted in `config.yaml`:

- `output` — generated types are always emitted to `.envio/`.
- `unordered_multichain_mode` — unordered is now the only mode. The V2 `multichain: ordered` opt-in has also been removed.
- `event_decoder` — the Rust-based decoder is the only implementation.
- `loaders` — Preload Optimization is now always on.
- `preload_handlers` — now always enabled.
- `preRegisterDynamicContracts` — no longer needed.
- `rpc_config` — replaced by `rpc` (see above).
- `networks` — renamed to `chains`.
- `confirmed_block_threshold` — renamed to `max_reorg_depth`.

