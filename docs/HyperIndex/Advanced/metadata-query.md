---
id: metadata-query
title: Metadata Query
sidebar_label: Metadata Query
slug: /metadata-query
description: See indexing progress and metadata per chain using HyperIndex _meta query.
---

Starting from `envio@2.28` HyperIndex exposes an official `_meta` query to get indexing metadata per chain.

```graphql
{
  _meta {
    chainId
    progressBlock
    eventsProcessed
    bufferBlock
    firstEventBlock
    sourceBlock
    readyAt
    isReady
    startBlock
    endBlock
  }
}
```

Result:

```json
{
  "data": {
    "_meta": [
      {
        "chainId": 1,
        "progressBlock": 22817138,
        "eventsProcessed": 2380000,
        "bufferBlock": 22820499,
        "firstEventBlock": 21688545,
        "sourceBlock": 23368264,
        "readyAt": null,
        "isReady": false,
        "startBlock": 0,
        "endBlock": null
      },
      {
        "chainId": 10,
        "progressBlock": 137848820,
        "eventsProcessed": 2455000,
        "bufferBlock": 137873621,
        "firstEventBlock": 130990676,
        "sourceBlock": 141168975,
        "readyAt": null,
        "isReady": false,
        "startBlock": 0,
        "endBlock": null
      }
    ]
  }
}
```

## Usage

You can use this query to track the indexing progress for each chain. For example, wait until the block data is ready before querying actuall data, building custom dashboards, health checks or sending notifications.

## Metadata fields

### Configuration

The fields are populated on the indexer startup and don't change during the indexer process.

- `chainId` - Metadata for the Chain ID. The metadata is sorted by chainId in ascending order. You can use `_meta(where: { chainId: { _eq: 1 } })` to get the metadata for a specific chain.
- `startBlock` - Start block number from `config.yaml`
- `endBlock` - End block number from `config.yaml`

### Transactional

The fields are updated in the batch write transaction, and guaranteed to be written to the Database at the same time. This means that the `progressBlock` and `eventsProcessed` will increase at the same time as the data for the processed events is written to the Database and available for querying.

- `progressBlock` - Block number fully processed and written to the DB
- `eventsProcessed` - Number of processed events and written to the DB. (not reorg resistant)

### Throttled

The fields are updated outside of the batch transaction and throttled to avoid performance overhead. There might be a small delay between the event processing and the metadata update.

- `bufferBlock` - Block number of the latest event ready for processing
- `firstEventBlock` - Block number of the first processed event for the chain
- `sourceBlock` - The latest known block number of the actively using data source
- `readyAt` - Timestamp when the chain finished historical sync or reached End Block
- `isReady` - Whether the chain finished historical sync or reached End Block
