---
id: performance
title: Performance Optimization
sidebar_label: Performance
slug: /performance
---

There are different types of performance that you may be concerned about when indexing using HyperIndex. There is the speed of historical sync (populating the db from scratch), the latency of indexing new blocks/transactions, and the speed of querying the data once it is indexed. This page will cover some of the ways you can optimize the performance of your HyperIndex setup.

# Database Performance Optimization

### Creating Custom Indices

Indices are essential for optimizing database performance, especially when dealing with large datasets. By creating indices, you can significantly speed up query times. Here's how to define custom indices in your schema.

#### Single Column Indices

Define an entity and use the `@index` directive on fields you wish to add an index to.

```graphql
type MyEntity {
  id: ID!
  userAddress: String! @index
  tokenAddress: String! @index
}
```

The fields marked with `@index` will create indices in your database, making queries on these fields much faster.

#### Composite Indices

You can also group fields into one composite index:

```graphql
type MyEntity @index(fields: ["userAddress", "tokenAddress"]) {
  id: ID!
  userAddress: String!
  tokenAddress: String!
}
```

This will create a composite index on both of these fields, which is particularly useful for queries that filter on both `userAddress` and `tokenAddress`.

#### Automatic Indices

Please note that all `id` fields and `@derivedFrom` fields already have indices automatically created, so there is no need to add a custom index on them.

#### Example

```graphql
type Token
  @index(fields: ["id", "tokenId"])
  @index(fields: ["tokenId", "collection"]) {
  id: ID!
  tokenId: BigInt! @index
  collection: NftCollection! @index
  owner: User!
}
```

The above example shows how to create single field indices (`@index`) or multi-field indices (`@index(fields: ["id", "tokenId"])`).

### When and Why to Use Indices

#### Single Column Indices

- **When to use**: Use single column indices when you frequently query a table based on a single field.
- **Why to use**: Single column indices improve the performance of queries filtering or sorting on a single column.

#### Composite Indices

- **When to use**: Use composite indices when you frequently query a table based on multiple fields.
- **Why to use**: Composite indices improve the performance of queries that filter or sort on multiple columns simultaneously. They are especially useful when the combined columns are frequently used together in queries.

### Impact on Write Times and Storage

- **Write Times**: Creating indices has a minor impact on write times. Each write operation needs to update the index, but this impact is generally negligible.
- **Storage**: Indices use additional storage. The storage required depends on the number and type of indices created.

### Optimizing Schema and Queries

#### Structuring Schema

- Ensure fields frequently used in queries are indexed.
- Use composite indices for queries filtering on multiple fields.
- Avoid unnecessary indices on fields rarely used in queries.

#### Optimizing Hasura GraphQL Queries

- **Retrieve Changed Entities**: When polling for updates, retrieve only changed entities to minimize data transfer and processing.
- **Use Timestamps**: Utilize timestamps to fetch only the entities that have changed since the last query.

#### Example Query

```graphql
query getUpdatedTokens($lastFetched: timestamptz!) {
  Token(where: { updatedAt: { _gt: $lastFetched } }) {
    id
    tokenId
    collection
    owner
  }
}
```

In this example, `updatedAt` is a timestamp field used to fetch tokens updated since the last fetch.

# Historical Sync

Historical sync is an important aspect of maintaining and populating your database. Here's an overview of how historical sync works with HyperIndex:

## Optimized HyperSync Backend Nodes

- **Fast Retrieval**: Historical sync is fast when retrieving data from our optimized HyperSync backend nodes. These nodes are specifically designed to handle large amounts of historical data efficiently.

## RPC Endpoint Limitations

- **Slow Performance**: Unfortunately, historical sync for chains using RPC endpoints is not fast. The process is slower due to the limitations of RPC endpoints.
- **No Local Caching**: We do not have any form of local caching at the moment. This feature was disabled in a previous release due to stability concerns.

### Loaders and Historical Sync

- **Improved Speed**: Using loaders can improve the speed of historical sync. However, the effectiveness of loaders varies:
  - **Entity Reuse**: Loaders are more beneficial when the same entities are frequently reused and updated.
  - **Performance Impact**: For many indexes, the performance difference with loaders is not very large. Loaders are not highly important unless performance is of the utmost importance.

### Future Improvements (v2)

- **preHandlers**: In version 2, we are restructuring the way loaders work into pre-handlers. This change will make loading entities before the handler in batches more ergonomic using preHandler functions, further enhancing the performance and ease of use for historical sync.

By understanding these factors, you can better optimize the performance of your historical sync processes.

# Latency at the head

Maintaining low latency at the head of the chain is crucial for ensuring timely data updates. Here's an overview of how we handle latency at the head with HyperSync:

### Efficient Block Pulling from HyperSync

- **Efficient Process**: At the head, we currently pull new blocks from HyperSync, which is a highly efficient process. This ensures that we stay up-to-date with the latest blocks with minimal delay.
- **Reliability**: Typically, this process runs smoothly without any significant issues.
- **Backups**: We have an on-going project to sync new blocks from both RPC and Hypersync to improve the robustness in the unlikely event of a failure in HyperSync.

### Low Latency on Popular Networks

- **Prioritized Networks**: We have put a lot of effort into maintaining extremely low latency on popular networks such as Ethereum, Optimism, and Arbitrum. Users should not experience any noticeable latency on these networks.
- **User Experience**: Our focus on these networks ensures a seamless experience for users relying on timely data updates.

### Smaller Chains

- **Lower Priority**: On some smaller chains, we haven't prioritized low latency to the same extent. As a result, there might be slightly higher latency on these networks.
- **Feedback**: If low latency on smaller chains is a concern for you, please let our team know in Discord. Your feedback helps us prioritize improvements.

### Unordered Multi-Chain Mode

- [**Docs**](./multichain-indexing#unordered-multichain-mode)
- **Multi-Chain Indexes**: For users with extremely multi-chain indexes, we offer an unordered multi-chain mode.
- **Continued Syncing**: In this mode, even if one chain experiences latency, the other chains will continue syncing as normal, ensuring that your data remains up-to-date across multiple networks.

### Reorg Support

- **Reorg Handling**: We have reorg support in place and are currently in the final phases of testing this feature.
- **Concerns**: If reorg support is a concern for you, please reach out to our team on Discord. We will have official documentation for reorgs available shortly.

### Hosted Service

We have ongoing projects to keep improving the sync and build times of the hosted service. Currently the indexers do run slightly slower on the hosted service than they may on a powerful laptop. If you are looking for a beefy hosting solution please contact us on Discord, and we can discuss our enterprise plans.

By leveraging these features and providing feedback, you can help us maintain and improve the performance of your HyperIndex setup.
