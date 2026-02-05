---
id: query-conversion
title: Query Conversion Guide
sidebar_label: Query Conversion
slug: /query-conversion
description: Learn how to convert queries from TheGraph's custom GraphQL syntax to Envio's standard GraphQL syntax.
---

# Query Conversion

Envio uses standard GraphQL query language, while TheGraph uses a custom GraphQL syntax. While the queries are very similar, there are some important differences to be aware of when migrating.

This guide covers all the differences between TheGraph's query syntax and Envio's query syntax, with examples for each conversion rule.

## Converter Tool

We've built a [query converter tool](https://github.com/enviodev/subgraph-to-hyperindex-query-converter) that automatically converts TheGraph queries to Envio's GraphQL syntax. You can:

- **Convert and execute**: Provide your Envio GraphQL endpoint and a query written in TheGraph syntax. The tool will convert it, execute it against your endpoint, and return the results
- **Convert only**: Use the tool to convert queries and view the converted output without executing them. To convert queries without executing them, add `/debug` to the converter endpoint and send your query. The response will contain only the converted query without actually running it.

**Repository**: [subgraph-to-hyperindex-query-converter](https://github.com/enviodev/subgraph-to-hyperindex-query-converter)

:::info Availability
The query converter tool is only available to users on paid tiers.
:::

:::info Setup Assistance
If you'd like to use the query converter tool for your indexer, please reach out to our team and we can add an instance of the converter tool to be deployed with your indexer.
:::

:::tip Best Practice
**We strongly recommend converting your queries to use Envio's standard GraphQL syntax** rather than relying on the query converter tool. This ensures better performance, maintainability, and avoids potential conversion limitations. The converter tool is primarily intended for backwards compatibility in cases where you might have external-facing APIs which depend on TheGraph's query syntax.
:::

:::warning Beta Status
This converter tool is still very much in beta. We're actively working on it and discovering new query conversions that need to be handled.  
**If you encounter any conversion failures or incorrect conversions, please [file a GitHub issue](https://github.com/enviodev/subgraph-to-hyperindex-query-converter/issues) in the repository so we can address it.**
:::

### Converter Tool Limitations

The query converter tool has several limitations to be aware of:

- **Rate limits**: The rate limits of your associated tier will still apply when using the converter tool.
- **Beta status and incomplete coverage**: Since the tool is in beta there is a possibility we have missed some conversion patterns. Some queries may still fail to convert correctly or may not be handled at all. If you encounter any conversion failures or incorrect conversions, please [file a GitHub issue](https://github.com/enviodev/subgraph-to-hyperindex-query-converter/issues) in the repository so we can address it.
- **WebSocket subscriptions**: WebSocket subscriptions are not supported. The converter only works with standard HTTP GraphQL queries.
- **Directives not supported**: GraphQL directives (such as `@skip`, `@include`, etc.) are not supported because the converter uses simple string parsing rather than a full GraphQL parser. Directives are ignored or may break parsing.
- **Variables in orderBy/orderDirection**: Variables used in `orderBy` and `orderDirection` parameters are ignored because HyperIndex requires literal field names in `order_by` clauses, and variable values are unknown at conversion time. Queries using variables for ordering will return unordered results.
- **Array filter operators**: The `_containsAny` and `_containsAll` filters are TheGraph-specific array operators that don't have direct Hasura equivalents. The converter explicitly rejects these and returns an `UnsupportedFilter` error. Use `_in` for array matching instead.
- **Meta queries**: Meta queries only support `_meta { block { number } }` because HyperIndex exposes block information differently. Other `_meta` fields (hash, timestamp, deployment, hasIndexingErrors) are not available in HyperIndex's schema and will return a `ComplexMetaQuery` error.
- **Introspection queries**: Introspection queries only work if they use the operation name `"IntrospectionQuery"`. Other introspection queries (like querying `__schema` directly) will fail because they go through normal conversion which doesn't understand introspection syntax.

For production applications, we recommend migrating your queries to Envio's standard GraphQL syntax to avoid these limitations.

---

### 1. Entity Name Conversion

**Rule**: TheGraph uses pluralized entity names (e.g., `pools`, `factories`, `tokens`), while Envio uses the entity name as-is from the schema (singular, PascalCase). When converting, plural entity names are automatically singularized and capitalized to match Envio's schema.

**Example**:

```graphql
# TheGraph
query {
  pools { id }
  factories { id }
  tokens { id }
}

# Envio
query {
  Pool { id }
  Factory { id }
  Token { id }
}
```

Single entity queries use `EntityName_by_pk` (by primary key) in Envio. Alternatively, you could use a `where` clause with the primary key field:

```graphql
# TheGraph
query {
  pool(id: "0x123") { value }
}

# Envio
query {
  Pool_by_pk(id: "0x123") { value }
}
```

Or using a `where` clause:

```graphql
# Envio
query {
  Pool(where: {id: {_eq: "0x123"}}) { value }
}
```

### 2. Pagination Parameters

#### First → Limit

**Rule**: The `first` parameter is converted to `limit`.

**Example**:

```graphql
# TheGraph
query {
  pools(first: 10) { id }
}

# Envio
query {
  Pool(limit: 10) { id }
}
```

#### Skip → Offset

**Rule**: The `skip` parameter is converted to `offset`.

**Example**:

```graphql
# TheGraph
query {
  pools(skip: 20) { id }
}

# Envio
query {
  Pool(offset: 20) { id }
}
```

### 3. Ordering Parameters

#### OrderBy and OrderDirection → Order_by

**Rule**: The `orderBy` and `orderDirection` parameters are combined into a single `order_by: {field: direction}` clause.

**Example**:

```graphql
# TheGraph
query {
  pools(orderBy: name, orderDirection: desc) { id name }
  # Use orderDirection: asc for ascending order
}

# Envio
query {
  Pool(order_by: {name: desc}) { id name }
  # Use asc for ascending order, e.g., order_by: {name: asc}
}
```

### 4. Filter Operators

#### Equality Filter

**Rule**: Simple equality filters are converted to `where: {field: {_eq: value}}` format.

**Example**:

```graphql
# TheGraph
query {
  pools(name: "test") { id name }
}

# Envio
query {
  Pool(where: {name: {_eq: "test"}}) { id name }
}
```

#### Comparison Filters

**Rule**: Comparison filters (`_not`, `_gt`, `_gte`, `_lt`, `_lte`, `_in`, `_not_in`) are converted to their Hasura equivalents.

**Examples**:

```graphql
# TheGraph
query {
  pools(id_not: "0x123") { id }
  pools(amount_gt: 100) { id amount }
  pools(amount_gte: 100) { id amount }
  pools(timestamp_lt: 1650000000) { id timestamp }
  pools(timestamp_lte: 1650000000) { id timestamp }
  pools(id_in: ["1", "2", "3"]) { id name }
  pools(id_not_in: ["1", "2", "3"]) { id name }
}

# Envio
query {
  Pool(where: {id: {_neq: "0x123"}}) { id }
  Pool(where: {amount: {_gt: 100}}) { id amount }
  Pool(where: {amount: {_gte: 100}}) { id amount }
  Pool(where: {timestamp: {_lt: 1650000000}}) { id timestamp }
  Pool(where: {timestamp: {_lte: 1650000000}}) { id timestamp }
  Pool(where: {id: {_in: ["1", "2", "3"]}}) { id name }
  Pool(where: {id: {_nin: ["1", "2", "3"]}}) { id name }
}
```

#### String Filters

**Rule**: String filters (`_contains`, `_starts_with`, `_ends_with`, and their `_not` and `_nocase` variants) are converted to `_ilike` with appropriate wildcards. The `%` symbol represents any text at that position in the pattern.

**Examples**:

```graphql
# TheGraph
query {
  pools(name_contains: "test") { id name }
  pools(name_not_contains: "test") { id name }
  pools(symbol_starts_with: "ABC") { id symbol }
  pools(symbol_ends_with: "XYZ") { id symbol }
  pools(name_not_starts_with: "A") { id name }
  pools(name_not_ends_with: "x") { id name }
  pools(name_contains_nocase: "test") { id name }
  pools(name_starts_with_nocase: "test") { id name }
  pools(name_ends_with_nocase: "test") { id name }
}

# Envio
query {
  Pool(where: {name: {_ilike: "%test%"}}) { id name }
  Pool(where: {_not: {name: {_ilike: "%test%"}}}) { id name }
  Pool(where: {symbol: {_ilike: "ABC%"}}) { id symbol }
  Pool(where: {symbol: {_ilike: "%XYZ"}}) { id symbol }
  Pool(where: {_not: {name: {_ilike: "A%"}}}) { id name }
  Pool(where: {_not: {name: {_ilike: "%x"}}}) { id name }
  Pool(where: {name: {_ilike: "%test%"}}) { id name }
  Pool(where: {name: {_ilike: "test%"}}) { id name }
  Pool(where: {name: {_ilike: "%test"}}) { id name }
}
```

### 5. Variable Type Conversions

#### ID → String

**Rule**: Variable types `ID` and `ID!` are converted to `String` and `String!` respectively.

**Example**:

```graphql
# TheGraph
query getPoolValue($id: ID!) {
  pool(id: $id) { value }
}

# Envio
query getPoolValue($id: String!) {
  Pool_by_pk(id: $id) { value }
}
```

#### Bytes → String

**Rule**: Variable types `Bytes` and `Bytes!` are converted to `String` and `String!` respectively.

**Example**:

```graphql
# TheGraph
query getTokens($id: Bytes) {
  tokens(where: { id: $id }) { id timestamp }
}

# Envio
query getTokens($id: String) {
  Token(where: {id: {_eq: $id}}) { id timestamp }
}
```

#### BigInt → numeric

**Rule**: Variable types `BigInt` and `BigInt!` are converted to `numeric` and `numeric!` respectively.

**Example**:

```graphql
# TheGraph
query GetTokens($amount: BigInt) {
  tokens(where: { amount: $amount }) { id amount }
}

# Envio
query GetTokens($amount: numeric) {
  Token(where: {amount: {_eq: $amount}}) { id amount }
}
```

#### BigDecimal → numeric

**Rule**: Variable types `BigDecimal` and `BigDecimal!` are converted to `numeric` and `numeric!` respectively.

**Example**:

```graphql
# TheGraph
query GetValue($value: BigDecimal!) {
  pools(where: { value: $value }) { id }
}

# Envio
query GetValue($value: numeric!) {
  Pool(where: {value: {_eq: $value}}) { id }
}
```

---

## Summary Table

| Category | TheGraph | Envio | Example |
|----------|-----------|-------|---------|
| **Entity Names** | Plural camelCase | Singular PascalCase (as-is from schema) | `pools` → `Pool` |
| **Pagination** | `first`, `skip` | `limit`, `offset` | `first: 10, skip: 20` → `limit: 10, offset: 20` |
| **Ordering** | `orderBy`, `orderDirection` | `order_by: {field: direction}` | `orderBy: name, orderDirection: desc` → `order_by: {name: desc}` |
| **Equality Filter** | `field: value` | `field: {_eq: value}` | `name: "test"` → `name: {_eq: "test"}` |
| **Comparison Filters** | `field_gt`, `field_gte`, etc. | `field: {_gt: value}`, etc. | `amount_gt: 100` → `amount: {_gt: 100}` |
| **String Filters** | `_contains`, `_starts_with`, etc. | `_ilike` with `%` wildcards | `name_contains: "test"` → `name: {_ilike: "%test%"}` |
| **Variable Types** | `ID`, `Bytes`, `BigInt`, `BigDecimal` | `String`, `numeric` | `$id: ID!` → `$id: String!` |

---

## Getting Help

If you encounter any issues with query conversion or have questions:

- **Converter Issues**: File a [GitHub issue](https://github.com/enviodev/subgraph-to-hyperindex-query-converter/issues) for the converter tool
- **General Questions**: Join our [Discord community](https://discord.gg/envio) for support

