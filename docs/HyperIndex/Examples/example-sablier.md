---
id: example-sablier
title: Sablier Protocol Indexers
sidebar_label: Sablier (Token streaming) ⭐ Recommended
slug: /example-sablier
---

# Sablier Protocol Indexers

The following indexers serve as exceptional reference implementations for the Sablier protocol, showcasing professional development practices and efficient multi-chain data processing.

## Overview

[Sablier](https://sablier.com/) is a token streaming protocol that enables real-time finance on the blockchain, allowing tokens to be streamed continuously over time. These official Sablier indexers track streaming activity across 18 different EVM-compatible chains, providing comprehensive data through a unified GraphQL API.

## Professional Indexer Suite

Sablier maintains three specialized indexers, each targeting a specific part of their protocol:

### 1. [Lockup Indexer](https://github.com/sablier-labs/subgraphs/tree/main/apps/lockup-envio)

Tracks the core Sablier lockup contracts, which handle the streaming of tokens with fixed durations and amounts. This indexer provides data about stream creation, cancellation, and withdrawal events. Used primarily for the vesting functionality of Sablier.

### 2. [Flow Indexer](https://github.com/sablier-labs/subgraphs/tree/main/apps/flow-envio)

Monitors Sablier's advanced streaming functionality, allowing for dynamic flow rates and more complex streaming scenarios. This indexer captures stream modifications, batch operations, and other flow-specific events. Powers the payments side of the Sablier application.

### 3. [Merkle Indexer](https://github.com/sablier-labs/subgraphs/tree/main/apps/merkle-envio)

Tracks Sablier's Merkle distribution system, which enables efficient batch stream creation using cryptographic proofs. This indexer provides data about batch creations, claims, and related activities. Used for both Airstreams and Instant Airdrops functionality.

## Key Features

- **Comprehensive Multi-chain Support**: Indexes data across 18 different EVM chains
- **Professionally Maintained**: Used in production by the Sablier team and their partners
- **Extensive Test Coverage**: Includes comprehensive testing to ensure data accuracy
- **Optimized Performance**: Implements efficient data processing techniques
- **Well-Documented**: Clear code structure with extensive comments
- **Backward Compatibility**: Carefully manages schema evolution and contract upgrades
- **Cross-chain Architecture**: Envio promotes efficient cross-chain indexing where all networks share the same indexer endpoint

## Best Practices Showcase

These indexers demonstrate several development best practices:

- **Modular Code Structure**: Well-organized code with clear separation of concerns
- **Consistent Naming Conventions**: Professional and consistent naming throughout
- **Efficient Event Handling**: Optimized processing of blockchain events
- **Comprehensive Entity Relationships**: Well-designed data model with proper relationships
- **Thorough Input Validation**: Robust error handling and input validation
- **Detailed Changelogs**: Documentation of breaking changes and migrations
- **Handler/Loader Pattern**: Envio indexers use an optimized pattern with loaders to pre-fetch entities and handlers to process them

## Getting Started

To use these indexers as a reference for your own development:

1. Clone the specific repository based on your needs:
   - [Lockup Indexer](https://github.com/sablier-labs/subgraphs/tree/main/apps/lockup-envio)
   - [Flow Indexer](https://github.com/sablier-labs/subgraphs/tree/main/apps/flow-envio)
   - [Merkle Indexer](https://github.com/sablier-labs/subgraphs/tree/main/apps/merkle-envio)
2. Review the file structure and implementation patterns
3. Examine the event handlers for efficient data processing techniques
4. Study the schema design for effective entity modeling

For complete API documentation and usage examples, see:

- [Sablier API Overview](https://docs.sablier.com/api/overview#envio)
- [Implementation Caveats](https://docs.sablier.com/api/caveats)

:::note
These are official indexers maintained by the Sablier team and represent production-quality implementations. They serve as excellent examples of professional indexer development and are regularly updated to support the latest protocol features.
:::
