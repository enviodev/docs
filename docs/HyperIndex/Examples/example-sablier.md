---
id: example-sablier
title: Sablier Protocol Indexers
sidebar_label: Sablier (Token streaming) ⭐ Recommended
slug: /example-sablier
description: Explore Sablier protocol indexers to track token streams and distributions across multiple chains.
---

# Sablier Protocol Indexers

The following blockchain indexers serve as exceptional reference implementations for the Sablier protocol, showcasing professional development practices and efficient multichain data processing.

## Overview

[Sablier](https://sablier.com/) is a token streaming protocol that enables real-time finance on the blockchain, allowing tokens to be streamed continuously over time. These official Sablier indexers track streaming activity across many EVM-compatible chains, providing comprehensive data through a unified GraphQL API.

## Professional Indexer Suite

Sablier maintains two public indexers, each targeting a specific part of their protocol:

### 1. [Streams Indexer](https://github.com/sablier-labs/indexers/tree/main/envio/streams)

Tracks Sablier's payment-stream data across both the Lockup and Flow products. Lockup covers streams with fixed durations and amounts (creation, cancellation, and withdrawal events), while Flow covers open-ended streaming with dynamic flow rates. For more detail, see the [Lockup indexer docs](https://docs.sablier.com/api/lockup/indexers) and the [Flow indexer docs](https://docs.sablier.com/api/flow/indexers).

### 2. [Airdrops Indexer](https://github.com/sablier-labs/indexers/tree/main/envio/airdrops)

Tracks Sablier's Merkle airdrop campaigns, which enable efficient batch stream creation using cryptographic proofs. This indexer captures data about campaign creation, claims, and related activity, powering both Airstreams and Instant Airdrops. For more detail, see the [Airdrops indexer docs](https://docs.sablier.com/api/airdrops/indexers).

## Key Features

- **Comprehensive Multichain Support**: Indexes data across many EVM-compatible chains
- **Professionally Maintained**: Used in production by the Sablier team and their partners
- **Extensive Test Coverage**: Includes comprehensive testing to ensure data accuracy
- **Optimized Performance**: Implements efficient data processing techniques
- **Well-Documented**: Clear code structure with extensive comments
- **Backward Compatibility**: Carefully manages schema evolution and contract upgrades
- **Cross-chain Architecture**: Envio promotes efficient cross-chain indexing where all networks share the same indexer endpoint

## Best Practices Showcase

These blockchain indexers demonstrate several development best practices:

- **Modular Code Structure**: Well-organized code with clear separation of concerns
- **Consistent Naming Conventions**: Professional and consistent naming throughout
- **Efficient Event Handling**: Optimized processing of blockchain events
- **Comprehensive Entity Relationships**: Well-designed data model with proper relationships
- **Thorough Input Validation**: Robust error handling and input validation
- **Detailed Changelogs**: Documentation of breaking changes and migrations
- **Preload Optimization**: Envio indexers benefit from always-on [Preload Optimization](/docs/HyperIndex/preload-optimization), which batches entity reads and runs external calls in parallel through the Effect API

## Getting Started

To use these indexers as a reference for your own development:

1. Clone the indexer that matches your needs:
   - [Streams Indexer](https://github.com/sablier-labs/indexers/tree/main/envio/streams)
   - [Airdrops Indexer](https://github.com/sablier-labs/indexers/tree/main/envio/airdrops)
2. Review the file structure and implementation patterns
3. Examine the event handlers for efficient data processing techniques
4. Study the schema design for effective entity modeling

For complete API documentation and usage examples, see:

- [Sablier API Overview](https://docs.sablier.com/api/overview#envio)
- [Implementation Caveats](https://docs.sablier.com/api/caveats)

:::note
These are official indexers maintained by the Sablier team and represent production-quality implementations. They serve as an excellent example of professional blockchain indexer development and are regularly updated to support the latest protocol features.
:::
