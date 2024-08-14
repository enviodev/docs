---
id: persisted_files
title: Persisted File Changes
sidebar_label: Persisted File Changes
slug: /persisted_files
---

# Persisted File Changes

In Envio, users define four distinct files that dictate the behavior of the indexer:

- Configuration file (`config.yaml`)
- Smart Contract ABI (`contractName.json`)
- Schema (`schema.graphql`)
- Event Handlers (`EventHandlers.\*`)

Envio employs these files to automatically generate and execute the indexing logic.

To enhance user experience and optimize the re-syncing of historical blocks, the indexer identifies the most efficient rerun sequence when any of the above files are modified.

## Rerun sequences

**1. Re-generate All Indexing Code and Re-sync from RPC Nodes:**

Triggered only when the indexing logic needs regeneration due to changes in the configuration file or smart contract ABI.

**2. Re-generate All Indexing Code and Re-sync from Stored Raw Events:**

Activated when the schema is updated but neither the configuration nor smart contract ABI has changed. This allows for faster re-syncing using previously collected event data.

**3. Re-sync from Stored Events:**

Executed when only the event handlers are updated. Utilizes existing event data for re-syncing.

**4. Continue Syncing from RPC Nodes:**

Runs when there are no modifications in any of the user-defined files mentioned above.
