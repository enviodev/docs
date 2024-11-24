---
id: local-anvil
title: Local network - Anvil
sidebar_label: 👷 Local network - Anvil 👷
slug: /local-anvil
---

# Local network - Anvil

---

A local network can be used as a data source for your indexer. You simply need to specify the local network.

### Defining Network Configurations

```yaml
name: IndexerName # Specify indexer name
description: Indexer Description # Include indexer description
networks:
  - id: 31337 # Local Anvil network default chainId
    rpc_config:
      url: http://localhost:8545 # RPC URL for your local Anvil network
    start_block: START_BLOCK_NUMBER # Specify the starting block
    contracts:
      - name: ContractName
        address:
          - "0xYourContractAddress1"
          - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```

---
