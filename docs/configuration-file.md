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
  - `rpc_config` - RPC Config that will be used to subscribe to blockchain data on this network
    - `url` - URL of the RPC endpoint
  - `start_block` - Initial block from which the indexer will start listening for events
  - `contracts` - Configuration for each contract deployed on the network
    - `name` - User-defined contract name
    - `abi_file_path` - File location of the contract ABI
    - `address` - An array of addresses that the contract is deployed to on the network
    - `handler` - Location of the file that handles the events emitted by this contract
    - `events` - Configuration for each event emitted by this contract that the indexer will listen for
      - `event` - Signature or name of the event (must match the name in the ABI)
      - `required_entities` - An array of entities that need to loaded and made accessible within the handler function (an empty array indicates that no entities are required)
        - `name` - The name of the required entity (must match an entity defined in `schema.graphql`)
        - `label` - A user defined label that corresponds to this entity load

## Example `config.yaml` from Greeter template:

```yaml
name: Greeter
description: Greeter indexer
networks:
  - id: 137 # Polygon
    rpc_config:
      url: https://polygon.llamarpc.com # We recommend you change this to a dedicated RPC provider
    start_block: 45336336
    contracts:
      - name: Greeter
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

---
