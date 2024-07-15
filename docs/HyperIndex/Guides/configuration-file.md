---
id: configuration-file
title: Setting up Configuration File
sidebar_label: Setting up Configuration File
slug: /configuration-file
---

# Setting up Configuration File

The `config.yaml` outlines the specifications for the indexer, including details such as network and contract specifications and the event information to be used in the indexing process.

## Field Descriptions

- `name` - Name of the project
- `description` - Description of the project
- `ecosystem` - Ecosystem the indexer is intended for. The default value is "evm", but it can be set to "fuel".
- `schema` - Custom path to config file
- `contracts` - Global contract definitions that must contain all definitions except addresses. You can share a single handler/abi/event definitions for contracts across multiple chains.
- `networks` - Configuration of the blockchain networks that the project is deployed on
  - `id` - Chain identifier of the network
  - `rpc_config` - RPC Config that will be used to subscribe to blockchain data on this network (TIP: This is optional and in most cases does not need to be specified if the network is supported with [HyperSync](../Advanced/hypersync.md). We recommend using HyperSync instead of RPC for 100x speed-up)
    - `url` - URL of the RPC endpoint. You can provide multiple RPC endpoints for the network, they'll be used as fallbacks in case the primary RPC endpoint is down.
  - `hypersync_config` - Optional HyperSync Config for additional fine-tuning
    - `url` - URL of the HyperSync endpoint (default: The most performant HyperSync endpoint for the network)
  - `start_block` - Initial block from which the indexer will start listening for events
  - `end_block` - An optional field to specify the last block an indexer must index to
  - `contracts` - Configuration for each contract deployed on the network
    - `name` - User-defined contract name
    - `abi_file_path` - File location of the contract ABI [Optional]
    - `address` - An array of addresses that the contract is deployed to on the network
    - `handler` - Location of the file that handles the events emitted by this contract
    - `events` - Configuration for each event emitted by this contract that the indexer will listen for
      - `event` - Event signature or name of the event (must match the name in the ABI)
- `unordered_multichain_mode` - A flag to indicate if the indexer should use a single queue for all chains or a queue per chain (default: false)
- `event_decoder` - The event decoder to use for the indexer (default: hypersync-client)
- `rollback_on_reorg` - A flag to indicate if the indexer should rollback to the last known valid block on a reorg (default: false)
- `save_full_history` - A flag to indicate if the indexer should save the full history of events. This is useful for debugging but will increase the size of the database (default: false)

After you have set up your config file and the scheme, you are ready to generate the indexing code required to write the event handlers.

Run:

```bash
envio codegen
```

## Contract Addresses

For the `address` field in the configuration file, the address that emits the events should be used.

If the contract uses a transparent proxy pattern, the address of the proxy contract should be used in the configuration file as this is the contract that emits the events.
However, the ABI of the contract should be retrieved from the implementation contract.

If the contract does not use a proxy contract, then the same address from which ABI was obtained should be used in the configuration file.

Should there be multiple contract addresses from which events should be indexed from, they can be entered as an array in format `["0xAddress1", "0xAddress2"]` for the `address` field - or via a simple dash denominated list as seen in this [example](https://github.com/enviodev/univ3ethusdc-pool-multichain/blob/main/config.yaml) repo.

## Human readable ABI format

In the configuration you can optionally pass the file path to the abi for a contract in the `abi_file_path` field or you can specify the event signature in the event field.

An example is shown below of this feature from the above example

```yaml
events:
  - event: "NewGreeting(address user, string greeting)"
  - event: "ClearGreeting(address user)"
```

More information on Human Readable ABI parsing is available [here](https://docs.rs/ethers-core/latest/ethers_core/abi/struct.AbiParser.html)

> Dev note: 📢 An error in the ABI or the event signature will result in the events not matching and hence may not reflect in the `raw_events_table` or propagate correctly into the event handler logic.

## Additional guidelines

- Contract name field (`Greeter` in the example above) should contain a single word, as it is used to create a namespace for functions in the indexer.
- Address field should contain the address of the proxy contract, which emits the events on the specified blockchain.
- Should the human readable ABI format not be used, then the ABI which is referenced in config file needs to be copied from the implementation contract into the specified abi directory.

## Example `config.yaml` from Greeter template using ReScript language:

```yaml
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
    start_block: 45336336
    contracts:
      - name: PolygonGreeter
        abi_file_path: abis/greeter-abi.json
        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c
        handler: ./src/EventHandlers.bs.js
        events:
          - event: NewGreeting
          - event: ClearGreeting
```
