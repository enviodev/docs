---
id: hyperindex-basics
title: HyperIndex Basics
sidebar_label: HyperIndex Basics
slug: /hyperindex-basics
---

The following files are required from the user to run HyperIndex:

- Configuration (defaults to `config.yaml`)
- GraphQL Schema (defaults to `schema.graphql`)
- Event Handlers (defaults to `src/EventHandlers.*` depending on the language chosen)

These files are auto-generated according to the template and language chosen by running the `envio init` command.

Click [<ins>here</ins>](../../HyperIndex/getting-started.md) for a quickstart guide on how to get started.

## Supported Networks

HyperIndex currently supports indexing on:

- Any EVM-compatible network with an RPC endpoint
- [Fuel Network](../../fuel/fuel.md)

The secret of HyperIndex’s sync speed lies in using HyperSync for data retrieval.

Click [<ins>here</ins>](../../HyperIndex/Advanced/hypersync.md) for networks that are supported on HyperSync.

This method is significantly more efficient than traditional RPC methods, as it allows the retrieval of multiple blocks at once, allowing for blazing-fast retrieval of data (100x faster than RPC).

If the network that you want to index from is not supported on HyperSync, please navigate to [RPC Sync](../../HyperIndex/Advanced/rpc-sync.md) for more information.

---
