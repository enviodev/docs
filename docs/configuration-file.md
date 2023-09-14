---
id: configuration-file
title: Setting up Configuration File
sidebar_label: Setting up Configuration File
slug: /configuration-file
---

# Setting up Configuration File

The `config.yaml` outlines the specifications for the indexer including details including network and contract specifications and the event information to be used in the indexing process.

## Field Descriptions

- `name` - Name of the project
- `description` - Description of the project
- `networks` - Configuration of the blockchain networks that the project is deployed on
  - `id` - Chain identifier of the network
  - `rpc_config` - RPC Config that will be used to subscribe to blockchain data on this network (This is optional and does not need to be specified if the network is supported with [Hypersync](./hypersync.md))
    - `url` - URL of the RPC endpoint
  - `start_block` - Initial block from which the indexer will start listening for events
  - `contracts` - Configuration for each contract deployed on the network
    - `name` - User-defined contract name
    - `abi_file_path` - File location of the contract ABI [Optional]
    - `address` - An array of addresses that the contract is deployed to on the network
    - `handler` - Location of the file that handles the events emitted by this contract
    - `events` - Configuration for each event emitted by this contract that the indexer will listen for
      - `event` - Event signature or name of the event (must match the name in the ABI)
      - `required_entities` - An array of entities that need to loaded and made accessible within the handler function (an empty array indicates that no entities are required)
        - `name` - The name of the required entity (must match an entity defined in `schema.graphql`)
        - `labels` - This is an optional name given for loaded entities in the loaders that can be used in the event handlers (useful in differentiating entities that should be modified differently by the same event)

## Example `config.yaml` from Greeter template using Rescript language:

```yaml
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
    start_block: 45336336
    contracts:
      - name: PolygonGreeter
        abi_file_path: abis/greeter-abi.json
        address: "0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c"
        handler: ./src/EventHandlers.bs.js
        events:
          - event: "NewGreeting"
            requiredEntities:
              - name: "Greeting"
                labels:
                  - "greetingWithChanges"
          - event: "ClearGreeting"
            requiredEntities:
              - name: "Greeting"
                labels:
                  - "greetingWithChanges"
```

After you have set up your config file you can run `envio codegen` to generate the functions that you will use in your handlers.

```bash
envio codegen
```

### Human readable ABI format

In the configuration you can optionally pass the file path to the abi for a contract in the `abi_file_path` field or you can specify the event signature in the event field.

An example is shown below of this feature from the above example

```yaml
events:
  - event: "NewGreeting(address user, string greeting)"
    requiredEntities:
      - name: "Greeting"
        labels:
          - "greetingWithChanges"
  - event: "ClearGreeting(address user)"
    requiredEntities:
      - name: "Greeting"
        labels:
          - "greetingWithChanges"
```

More information on Human Readable ABI parsing is available [here](https://docs.rs/ethers-core/latest/ethers_core/abi/struct.AbiParser.html)

> Dev note: 📢 An error in the ABI or the event signature will result in the events not matching and hence may not reflect in the `raw_events_table` or propagate correctly into the event handler logic.

### Additional guidelines

- Contract name field (`Greeter` in the example above) should contain a single word, as it is used to create a namespace for functions in the indexer.
- Address field should contain the address of the proxy contract, which emits the events on the specified blockchain.
- Should the human readable ABI format not be used, then the ABI which is referenced in config file needs to be copied from the implementation contract into the specified abi directory.
- If an event update an entity in one way only, then `label` in configuration file is not required.
