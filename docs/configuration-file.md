---
id: configuration-file
title: Configuration File
sidebar_label: Configuration File
slug: /configuration-file
---



# Configuration File

The `config.yaml` contains various information about the smart contract project, including network specifications and event information to be fed into the indexing process.

Example `config.yaml` from Greeter scenario:

```yaml
name: ERC20
version: 1.0.0
description: ERC-20 indexer
networks:
  - id: 1337
    rpc_config:
      url: http://localhost:8545
    start_block: 0
    contracts:
      - name: ERC20
        abi_file_path: abis/erc20.json
        address: ["0x2B2f78c5BF6D9C12Ee1225D5F374aa91204580c3"]
        handler: ./src/EventHandlers.bs.js
        events:
          - event: "Approval"
            requiredEntities:
              - name: "Account"
                labels:
                  - "ownerAccountChanges"
          - event: "Transfer"
            requiredEntities:
              - name: "Account"
                labels:
                  - "senderAccountChanges"
                  - "receiverAccountChanges"
```

**Field Descriptions**

- `version` - Version of the config schema used by the indexer
- `description` - Description of the project
- `networks` - Configuration of the blockchain networks that the project is deployed on
  - `id` - Chain identifier of the network
  - `rpc_config` - RPC Config that will be used to subscribe to blockchain data on this network
    - `url` -  URL of the RPC endpoint
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

---
