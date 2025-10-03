---
id: config-schema-reference
title: Configuration Schema Reference
sidebar_label: Config Schema Reference
slug: /config-schema-reference
---

Static, deep-linkable reference for the `config.yaml` JSON Schema.

> Tip: Use the Table of Contents to jump to a field or definition.


## Top-level Properties

- [description](#description)
- [name](#name) (required)
- [ecosystem](#ecosystem)
- [schema](#schema)
- [output](#output)
- [contracts](#contracts)
- [networks](#networks) (required)
- [unordered_multichain_mode](#unorderedmultichainmode)
- [event_decoder](#eventdecoder)
- [rollback_on_reorg](#rollbackonreorg)
- [save_full_history](#savefullhistory)
- [field_selection](#fieldselection)
- [raw_events](#rawevents)
- [preload_handlers](#preloadhandlers)
- [address_format](#addressformat)

### description {#description}

Description of the project

- **type**: `string | null`


Example (config.yaml):

```yaml
description: Greeter indexer
```

### name {#name}

Name of the project

- **type**: `string`


Example (config.yaml):

```yaml
name: MyIndexer
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

### schema {#schema}

Custom path to schema.graphql file

- **type**: `string | null`


Example (config.yaml):

```yaml
schema: ./schema.graphql
```

### output {#output}

Path where the generated directory will be placed. By default it's 'generated' relative to the current working directory. If set, it'll be a path relative to the config file location.

- **type**: `string | null`


Example (config.yaml):

```yaml
output: ./generated
```

### contracts {#contracts}

Global contract definitions that must contain all definitions except addresses. You can share a single handler/abi/event definitions for contracts across multiple chains.

- **type**: `array | null`


Example (config.yaml):

```yaml
contracts:
  - name: Greeter
    handler: src/EventHandlers.ts
    events:
      - event: "NewGreeting(address user, string greeting)"
```

### networks {#networks}

Configuration of the blockchain networks that the project is deployed on.

- **type**: `array<object<Network>>`
- **items**: `object<Network>`
- **items ref**: [Network](#def-network)


Example (config.yaml):

```yaml
networks:
  - id: 1
    start_block: 0
    contracts:
      - name: Greeter
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
```

### unordered_multichain_mode {#unorderedmultichainmode}

A flag to indicate if the indexer should use a single queue for all chains or a queue per chain (default: false)

- **type**: `boolean | null`


Example (config.yaml):

```yaml
unordered_multichain_mode: true
```

### event_decoder {#eventdecoder}

The event decoder to use for the indexer (default: hypersync-client)

- **type**: `anyOf(object<EventDecoder> | null)`

Variants:
- `1`: [EventDecoder](#def-eventdecoder)
- `2`: `null`


Example (config.yaml):

```yaml
event_decoder: hypersync-client
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

### preload_handlers {#preloadhandlers}

Makes handlers run twice to enable preload optimisations. Removes handlerWithLoader API, since it's not needed. (recommended, default: false)

- **type**: `boolean | null`


### address_format {#addressformat}

Address format for Ethereum addresses: 'checksum' or 'lowercase' (default: checksum)

- **type**: `anyOf(object<AddressFormat> | null)`

Variants:
- `1`: [AddressFormat](#def-addressformat)
- `2`: `null`


## Definitions

### EcosystemTag {#def-ecosystemtag}

- **type**: `enum (1 values)`
- **allowed**: `evm`

Example (config.yaml):

```yaml
ecosystem: evm
```

### GlobalContract_for_ContractConfig {#def-globalcontractforcontractconfig}

- **type**: `object`
- **required**: `name`, `handler`, `events`

Properties:
- `name`: `string` – A unique project-wide name for this contract (no spaces)
- `abi_file_path`: `string | null` – Relative path (from config) to a json abi. If this is used then each configured event should simply be referenced by its name
- `handler`: `string` – The relative path to a file where handlers are registered for the given contract
- `events`: `array<object<EventConfig>>` – A list of events that should be indexed on this contract

Example (config.yaml):

```yaml
contracts:
  - name: Greeter
    handler: src/EventHandlers.ts
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
    handler: src/EventHandlers.ts
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
`transactionIndex`, `hash`, `from`, `to`, `gas`, `gasPrice`, `maxPriorityFeePerGas`, `maxFeePerGas`, `cumulativeGasUsed`, `effectiveGasPrice`, `gasUsed`, `input`, `nonce`, `value`, `v`, `r`, `s`, `contractAddress`, `logsBloom`, `root`, `status`, `yParity`, `chainId`, `accessList`, `maxFeePerBlobGas`, `blobVersionedHashes`, `kind`, `l1Fee`, `l1GasPrice`, `l1GasUsed`, `l1FeeScalar`, `gasUsedForL1`, `authorizationList`
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

### Network {#def-network}

- **type**: `object`
- **required**: `id`, `start_block`, `contracts`

Properties:
- `id`: `integer` – The public blockchain network ID.
- `rpc_config`: `anyOf(object<RpcConfig> | null)` – RPC configuration for utilizing as the network's data-source. Typically optional for chains with HyperSync support, which is highly recommended. HyperSync dramatically enhances performance, providing up to a 1000x speed boost over traditional RPC.
- `rpc`: `anyOf(object<NetworkRpc> | null)` – RPC configuration for your indexer. If not specified otherwise, for networks supported by HyperSync, RPC serves as a fallback for added reliability. For others, it acts as the primary data-source. HyperSync offers significant performance improvements, up to a 1000x faster than traditional RPC.
- `hypersync_config`: `anyOf(object<HypersyncConfig> | null)` – Optional HyperSync Config for additional fine-tuning
- `confirmed_block_threshold`: `integer | null` – The number of blocks from the head that the indexer should account for in case of reorgs.
- `start_block`: `integer` – The block at which the indexer should start ingesting data
- `end_block`: `integer | null` – The block at which the indexer should terminate.
- `contracts`: `array<object<NetworkContract_for_ContractConfig>>` – All the contracts that should be indexed on the given network

Example (config.yaml):

```yaml
networks:
  - id: 1
    start_block: 0
    end_block: 19000000
    contracts:
      - name: Greeter
        address: 0x1111111111111111111111111111111111111111
```

### RpcConfig {#def-rpcconfig}

- **type**: `object`
- **required**: `url`

Properties:
- `url`: `anyOf(string | array<string>)` – URL of the RPC endpoint. Can be a single URL or an array of URLs. If multiple URLs are provided, the first one will be used as the primary RPC endpoint and the rest will be used as fallbacks.
- `initial_block_interval`: `integer | null` – The starting interval in range of blocks per query
- `backoff_multiplicative`: `number | null` – After an RPC error, how much to scale back the number of blocks requested at once
- `acceleration_additive`: `integer | null` – Without RPC errors or timeouts, how much to increase the number of blocks requested by for the next batch
- `interval_ceiling`: `integer | null` – Do not further increase the block interval past this limit
- `backoff_millis`: `integer | null` – After an error, how long to wait before retrying
- `fallback_stall_timeout`: `integer | null` – If a fallback RPC is provided, the amount of time in ms to wait before kicking off the next provider
- `query_timeout_millis`: `integer | null` – How long to wait before cancelling an RPC request

Example (config.yaml):

```yaml
networks:
  - id: 1
    rpc_config:
      url: https://eth.llamarpc.com
      initial_block_interval: 1000
```

### NetworkRpc {#def-networkrpc}

- **type**: `anyOf(string | object<Rpc> | array<object<Rpc>>)`

Variants:
- `1`: `string`
- `2`: [Rpc](#def-rpc)
- `3`: `array<object<Rpc>>`

Example (config.yaml):

```yaml
networks:
  - id: 1
    rpc: https://eth.llamarpc.com
```

### Rpc {#def-rpc}

- **type**: `object`
- **required**: `url`, `for`

Properties:
- `url`: `string` – The RPC endpoint URL.
- `for`: `object<For>` – Determines if this RPC is for historical sync, real-time chain indexing, or as a fallback.
- `initial_block_interval`: `integer | null` – The starting interval in range of blocks per query
- `backoff_multiplicative`: `number | null` – After an RPC error, how much to scale back the number of blocks requested at once
- `acceleration_additive`: `integer | null` – Without RPC errors or timeouts, how much to increase the number of blocks requested by for the next batch
- `interval_ceiling`: `integer | null` – Do not further increase the block interval past this limit
- `backoff_millis`: `integer | null` – After an error, how long to wait before retrying
- `fallback_stall_timeout`: `integer | null` – If a fallback RPC is provided, the amount of time in ms to wait before kicking off the next provider
- `query_timeout_millis`: `integer | null` – How long to wait before cancelling an RPC request

Example (config.yaml):

```yaml
networks:
  - id: 1
    rpc:
      - url: https://eth.llamarpc.com
        for: sync
```

### For {#def-for}

- **type**: `oneOf(const sync | const fallback)`

Variants:
- `1`: `const sync`
- `2`: `const fallback`

### HypersyncConfig {#def-hypersyncconfig}

- **type**: `object`
- **required**: `url`

Properties:
- `url`: `string` – URL of the HyperSync endpoint (default: The most performant HyperSync endpoint for the network)

Example (config.yaml):

```yaml
networks:
  - id: 1
    hypersync_config:
      url: https://eth.hypersync.xyz
```

### NetworkContract_for_ContractConfig {#def-networkcontractforcontractconfig}

- **type**: `object`
- **required**: `name`

Properties:
- `name`: `string` – A unique project-wide name for this contract if events and handler are defined OR a reference to the name of contract defined globally at the top level
- `address`: `object<Addresses>` – A single address or a list of addresses to be indexed. This can be left as null in the case where this contracts addresses will be registered dynamically.
- `start_block`: `integer | null` – The block at which the indexer should start ingesting data for this specific contract. If not specified, uses the network start_block. Can be greater than the network start_block for more specific indexing.
- `abi_file_path`: `string | null` – Relative path (from config) to a json abi. If this is used then each configured event should simply be referenced by its name
- `handler`: `string` – The relative path to a file where handlers are registered for the given contract
- `events`: `array<object<EventConfig>>` – A list of events that should be indexed on this contract

Example (config.yaml):

```yaml
networks:
  - id: 1
    start_block: 0
    contracts:
      - name: Greeter
        address:
          - 0x1111111111111111111111111111111111111111
        handler: src/EventHandlers.ts
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
networks:
  - id: 1
    contracts:
      - name: Greeter
        address:
          - 0x1111111111111111111111111111111111111111
          - 0x2222222222222222222222222222222222222222
```

### EventDecoder {#def-eventdecoder}

- **type**: `enum (2 values)`
- **allowed**: `viem`, `hypersync-client`

Example (config.yaml):

```yaml
event_decoder: hypersync-client
```

### AddressFormat {#def-addressformat}

- **type**: `enum (2 values)`
- **allowed**: `checksum`, `lowercase`

