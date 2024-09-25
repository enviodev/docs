---
id: database-performance-optimization
title: Database Performance
sidebar_label: Database Performance
slug: /database-performance-optimization
---

## Database Performance Optimization

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

- **When to use**: Use single-column indices when you frequently query a table based on a single field.
- **Why to use**: Single-column indices improve the performance of queries filtering or sorting on a single column.

#### Composite Indices

- **When to use**: Use composite indices when you frequently query a table based on multiple fields.
- **Why to use**: Composite indices improve the performance of queries that filter or sort on multiple columns simultaneously. They are especially useful when the combined columns are frequently used together in queries.

### Impact on Write Times and Storage

- **Write Times**: Creating indices has a minor impact on write times. Each write operation needs to update the index, but this impact is generally negligible.
- **Storage**: Indices use additional storage. The storage required depends on the number and type of indices created.

### Optimizing Schema and Queries

#### Structuring Schema

- Ensure fields frequently used in queries are indexed.
- Use composite indices for query filtering on multiple fields.
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
