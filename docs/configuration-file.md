---
id: configuration-file
title: Configuration File
sidebar_label: Configuration File
slug: /configuration-file
---



# Config File Setup

Example config file from Gravatar scenario:

```yaml
version: 0.0.0
description: Gravatar for Ethereum
repository: https://github.com/graphprotocol/example-subgraph
networks:
  - id: 137
    rpc_url: https://polygon-rpc.com
    start_block: 34316032
    contracts:
      - name: Gravatar
        abi_file_path: abis/gravatar-abi.json
        address: ["0x2E645469f354BB4F5c8a05B3b30A929361cf77eC"]
        handler: ./src/EventHandlers.bs.js
        events:
          - name: "NewGravatar"
            requiredEntities: []
          - name: "UpdatedGravatar"
            requiredEntities:
              - name: "Gravatar"
                labels:
                  - "gravatarWithChanges"
```

**Field Descriptions**

- `version` - Version of the config schema used by the indexer
- `description` - Description of the project
- `repository` - Repository of the project
- `networks` - Configuration of the blockchain networks that the project is deployed on
  - `id` - Chain identifier of the network
  - `rpc_url` - RPC URL that will be used to subscribe to blockchain data on this network
  - `start_block` - Initial block from which the indexer will start listening for events
  - `contracts` - Configuration for each contract deployed on the network
    - `name` - User-defined contract name
    - `abi_file_path` - File location of the contract ABI
    - `address` - An array of addresses that the contract is deployed to on the network
    - `handler` - Location of the file that handles the events emitted by this contract
    - `events` - Configuration for each event emitted by this contract that the indexer will listen for
      - `name` - Name of the event (must match the name in the ABI)
      - `required_entities` - An array of entities that need to loaded and made accessible within the handler function (an empty array indicates that no entities are required)
        - `name` - The name of the required entity (must match an entity defined in `schema.graphql`)
        - `label` - A user defined label that corresponds to this entity load

---