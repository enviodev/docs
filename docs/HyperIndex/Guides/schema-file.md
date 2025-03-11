---
id: schema-file
title: GraphQL Schema (schema.graphql)
sidebar_label: GraphQL Schema (schema.graphql)
slug: /schema
---

The **`schema.graphql`** file defines the data model for your HyperIndex indexer. Each entity type defined in this schema corresponds directly to a database table, with your event handlers responsible for creating and updating the records. HyperIndex automatically generates a GraphQL API based on these entity types, allowing easy access to the indexed data.

---

## Defining Entity Types

Entities in your schema are defined as GraphQL object types:

**Example:**

```graphql
type User {
  id: ID!
  greetings: [String!]!
  latestGreeting: String!
  numberOfGreetings: Int!
}
```

### Requirements:

- Every entity **must** have a unique `id` field, using one of these scalar types:
  - `ID!`, `String!`, `Int!`, `Bytes!`, or `BigInt!`

---

## Scalar Types

Scalar types represent basic data types and map directly to JavaScript, TypeScript, or ReScript types.

| **GraphQL Scalar** | **Description**                              | **JavaScript/TypeScript** | **ReScript**   |
| ------------------ | -------------------------------------------- | ------------------------- | -------------- |
| `ID`               | Unique identifier                            | `string`                  | `string`       |
| `String`           | UTF-8 character sequence                     | `string`                  | `string`       |
| `Int`              | Signed 32-bit integer                        | `number`                  | `int`          |
| `Float`            | Signed floating-point number                 | `number`                  | `float`        |
| `Boolean`          | `true` or `false`                            | `boolean`                 | `bool`         |
| `Bytes`            | UTF-8 character sequence (hex prefixed `0x`) | `string`                  | `string`       |
| `BigInt`           | Signed integer (`int256` in Solidity)        | `bigint`                  | `bigint`       |
| `BigDecimal`       | Arbitrary-size floating-point                | `BigDecimal` (imported)   | `BigDecimal.t` |
| `Timestamp`        | Timestamp with timezone                      | `Date`                    | `Js.Date.t`    |

Learn more about GraphQL scalars [here](https://graphql.org/learn/).

---

## Enum Types

Enums allow fields to accept only a predefined set of values.

**Example:**

```graphql
enum AccountType {
  ADMIN
  USER
}

type User {
  id: ID!
  balance: Int!
  accountType: AccountType!
}
```

Enums translate to string unions (TypeScript/JavaScript) or polymorphic variants (ReScript):

**TypeScript Example:**

```typescript
import { AccountType } from "../generated/src/Enums.gen";

let user = {
  id: event.params.id,
  balance: event.params.balance,
  accountType: "USER", // enum as string
};
```

**ReScript Example:**

```rescript
let user: Types.userEntity = {
  id: event.params.id,
  balance: event.params.balance,
  accountType: #USER, // polymorphic variant
};
```

---

## Relationships: One-to-Many (`@derivedFrom`)

Define relationships between entities using the `@derivedFrom` directive, known as **reverse lookups**.

**Example:**

```graphql
type NftCollection {
  id: ID!
  contractAddress: Bytes!
  name: String!
  symbol: String!
  maxSupply: BigInt!
  currentSupply: Int!
  tokens: [Token!]! @derivedFrom(field: "collection")
}

type Token {
  id: ID!
  tokenId: BigInt!
  collection: NftCollection!
  owner: User!
}
```

- The `tokens` field in `NftCollection` is a virtual field, populated automatically when querying the API.
- Set relationships by referencing the related entity's `id`.

---

## Field Indexing (`@index`)

Add an index to a field for optimized queries and loader performance:

```graphql
type Token {
  id: ID!
  tokenId: BigInt!
  collection: NftCollection!
  owner: User! @index
}
```

- All `id` fields and fields referenced via `@derivedFrom` are indexed automatically.

---

## Advanced: Precision and Scale (`@config` Directive)

Customize the precision and scale for `BigInt` and `BigDecimal` fields using `@config`.

**Syntax:**

- `BigInt` (precision only):

```graphql
amount: BigInt @config(precision: 76)
```

- `BigDecimal` (precision and scale):

```graphql
price: BigDecimal @config(precision: 10, scale: 2)
```

**Example:**

```graphql
type Payment {
  id: ID!
  amount: BigInt @config(precision: 76)
  price: BigDecimal @config(precision: 10, scale: 2)
}
```

This controls PostgreSQL storage allocation and numerical accuracy.

<details>
  <summary>Detailed Example with Arrays</summary>

```graphql
type AdvancedEntity {
  exampleBigInt: BigInt @config(precision: 76)
  exampleBigIntRequired: BigInt! @config(precision: 77)
  exampleBigIntArray: [BigInt!] @config(precision: 78)
  exampleBigIntArrayRequired: [BigInt!]! @config(precision: 79)
  exampleBigDecimal: BigDecimal @config(precision: 10, scale: 5)
  exampleBigDecimalRequired: BigDecimal! @config(precision: 12, scale: 4)
}
```

</details>

---

## Generating Types

Once you've defined your schema, run this command to generate these entity types that can be accessed in your event handlers:

```bash
pnpm envio codegen
```

---

## Best Practices

- Use camelCase for field names (`latestGreeting`, `numberOfGreetings`).
- Keep entity and field names clear, descriptive, and intuitive.

---

You're now ready to define powerful schemas and efficiently query your indexed data with HyperIndex!
