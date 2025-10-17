---
id: database-performance-optimization
title: Database Performance Optimization
sidebar_label: Database / Queries (Performance)
slug: /database-performance-optimization
description: Learn how to optimize HyperIndex databases with indices and schema design for faster queries.
---

# Optimizing Database Performance in HyperIndex

## Introduction

As your indexed data grows, database performance becomes critical to maintaining responsive queries and efficient operations. This guide explains how to optimize your HyperIndex database through strategic indexing and schema design to ensure your applications remain fast even as data volume increases.

## Understanding Database Indices

Database indices are special data structures that improve the speed of data retrieval operations. Think of them like the index at the back of a book — rather than scanning every page (row) to find what you're looking for, indices allow the database to quickly locate the relevant data.

### Why Indices Matter

Without proper indices, your database must perform "full table scans" when searching for data, examining every row to find matches. As your data grows, this becomes increasingly inefficient:

| Data Size          | Without Indices | With Proper Indices |
| ------------------ | --------------- | ------------------- |
| 1,000 records      | ~10ms           | ~1ms                |
| 100,000 records    | ~500ms          | ~2ms                |
| 1,000,000+ records | 5+ seconds      | ~5ms                |

_Note: Actual performance varies based on hardware, query complexity, and database load._

## Creating Custom Indices in Your Schema

HyperIndex provides several ways to define indices in your GraphQL schema, giving you control over database performance.

### Single-Column Indices

The simplest form of indexing is on individual fields using the `@index` directive:

```graphql
type Transaction {
  id: ID!
  userAddress: String! @index
  tokenAddress: String! @index
  amount: BigInt!
  timestamp: BigInt! @index
}
```

In this example:

- Queries filtering on `userAddress` (e.g., finding all transactions for a user)
- Queries filtering on `tokenAddress` (e.g., finding all transactions for a token)
- Queries filtering on `timestamp` (e.g., finding transactions in a date range)

All become significantly faster because the database can use the indices to quickly locate matching records.

### Composite Indices for Multi-Field Queries

When you frequently query using multiple fields together, composite indices provide better performance:

```graphql
type Transfer @index(fields: ["from", "to", "tokenId"]) {
  id: ID!
  from: String! @index
  to: String! @index
  tokenId: BigInt!
  value: BigInt!
  timestamp: BigInt!
}
```

This creates:

1. Individual indices on `from` and `to` fields
2. A composite index on the combination of `from`, `to`, and `tokenId`

Composite indices are particularly valuable for complex queries that filter on multiple columns simultaneously, such as "find all transfers from address X to address Y for token Z."

### Automatic Indices

HyperIndex automatically creates indices for:

- All `ID` fields
- All fields marked with `@derivedFrom`

There's no need to manually add indices for these fields.

## Strategic Indexing: When to Use Each Type

### When to Use Single-Column Indices

Use single-column indices when:

- You frequently filter by a specific field
- You sort results by a specific field
- The field has high "cardinality" (many different values)

**Example use case**: Indexing `userAddress` in a transaction table when users frequently look up their transaction history.

### When to Use Composite Indices

Use composite indices when:

- You frequently query using multiple fields together
- Your queries consistently filter on the same combination of fields
- You need to optimize complex queries with multiple conditions

**Example use case**: Indexing `(tokenAddress, timestamp)` together when users frequently view token transaction history within specific time ranges.

## Performance Tradeoffs

While indices improve query performance, they come with tradeoffs:

### Write Performance Impact

Each index requires additional updates when data is inserted or modified:

- **No indices**: Fastest write performance, but slow reads
- **Few targeted indices**: Slight write slowdown (5-10%), much faster reads
- **Many indices**: Noticeable write slowdown (15%+), fastest possible reads

For most applications, the read performance benefits outweigh the write performance costs, especially since blockchain data is primarily read-intensive.

### Storage Considerations

Indices increase database storage requirements:

- Each index typically requires 2-10 bytes per row
- For large datasets (millions of records), this can add up
- Consider storage requirements when designing indices for very large tables

## Practical Examples

### Optimizing Token Transfer Queries

Consider a token transfer entity:

```graphql
type TokenTransfer {
  id: ID!
  token: Token! @index
  from: String! @index
  to: String! @index
  amount: BigInt!
  blockNumber: BigInt! @index
  timestamp: BigInt! @index
}
```

With this schema, the following queries will be optimized:

- Find all transfers for a specific token
- Find all transfers from a specific address
- Find all transfers to a specific address
- Find transfers within a specific block range
- Find transfers within a specific time range

### Optimizing Complex NFT Marketplace Queries

For an NFT marketplace with listings and sales:

```graphql
type NFTListing
  @index(fields: ["collection", "status", "price"])
  @index(fields: ["seller", "status"]) {
  id: ID!
  collection: String! @index
  tokenId: BigInt!
  seller: String! @index
  price: BigInt!
  status: String! @index # "active", "sold", "cancelled"
  createdAt: BigInt! @index
}
```

This schema efficiently supports:

- Finding all active listings for a collection, sorted by price
- Finding all listings by a specific seller with a specific status
- Finding recently created listings across all collections

## Optimizing GraphQL Queries

Beyond schema design, how you write your GraphQL queries affects performance:

### Fetch Only What You Need

Request only the fields you actually need:

```graphql
# Good
query {
  tokenTransfers(where: { token: { _eq: "0x123" } }, limit: 10) {
    id
    amount
  }
}

# Bad - fetches unnecessary fields
query {
  tokenTransfers(where: { token: { _eq: "0x123" } }, limit: 10) {
    id
    amount
    from
    to
    timestamp
    blockNumber
    transactionHash
    # other fields you don't need
  }
}
```

### Use Pagination for Large Result Sets

Always paginate large result sets:

```graphql
query {
  tokenTransfers(
    where: { token: { _eq: "0x123" } }
    limit: 20
    offset: 40 # Skip first 40 results (page 3 with 20 items per page)
  ) {
    id
    amount
  }
}
```

### Use Timestamps for Efficient Polling

When building applications that poll for updates, use timestamps to fetch only new data:

```graphql
query getUpdatedTransfers($lastFetched: BigInt!) {
  tokenTransfers(where: { timestamp: { _gt: $lastFetched } }) {
    id
    from
    to
    amount
  }
}
```

## Summary

Proper database indexing is essential for maintaining performance as your indexed data grows. By strategically placing indices on frequently queried fields and field combinations, you can ensure fast query responses even with large datasets.

**Key takeaways:**

- Use `@index` for frequently filtered or sorted individual fields
- Use composite indices for multi-field query patterns
- Consider performance tradeoffs for write-heavy applications
- Design your schema and queries with performance in mind from the start
- Always use pagination for large result sets
