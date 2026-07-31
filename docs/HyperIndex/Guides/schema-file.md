---
id: schema-file
title: Entities Schema (schema.graphql)
sidebar_label: Entities Schema (schema.graphql)
slug: /schema
description: Learn how to define GraphQL schemas, manage entities, and handle different types in HyperIndex.
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
  - `ID!`, `String!`, `Int!`, or `BigInt!`
- The `id` field must be non-nullable, must not be a list, and cannot be a [`@derivedFrom`](#relationships-one-to-many-derivedfrom) field.

### Numeric Entity IDs

`ID` is the usual choice and behaves as a string. Since [`v3.5.0`](https://github.com/enviodev/hyperindex/releases/tag/v3.5.0) you can also key an entity on `Int` or `BigInt`, which is a better fit when the identifier is genuinely a number — a block number, an auction id, a sequential position:

```graphql
type Auction {
  id: BigInt! # the on-chain auction id, not a stringified copy of it
  seller: String!
  bids: [Bid!]! @derivedFrom(field: "auction")
}

type Bid {
  id: ID!
  auction: Auction! # inferred as BigInt to match Auction.id
  amount: BigInt!
}
```

Relationship fields adopt the referenced entity's id type automatically, so `Bid.auction` above is typed `bigint` in your handlers rather than `string`. You don't declare the foreign key type — keep the two sides in sync by changing the referenced entity's `id`.

:::note
An `ID` id resolves to `string` on both sides. The numeric types are the only case where a relationship field becomes something other than a string.
:::

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
| `Json`             | JSON object                                  | `Json`                    | `Js.Json.t`    |

Learn more about GraphQL scalars [here](https://graphql.org/learn/).

---

## Working with BigDecimal

The `BigDecimal` scalar type in HyperIndex is based on the [bignumber.js](https://mikemcl.github.io/bignumber.js/) library, which provides arbitrary-precision decimal arithmetic. This is essential for financial calculations and handling numeric values that exceed JavaScript's native number precision.

### Importing BigDecimal

```typescript
// JavaScript/TypeScript
import { BigDecimal } from "envio";

// ReScript
open BigDecimal;
```

### Creating BigDecimal Instances

```typescript
// From string (recommended for precision)
const price = new BigDecimal("123.456789");

// From number (may lose precision for very large values)
const amount = new BigDecimal(123.45);

// From other BigDecimal
const copy = new BigDecimal(price);
```

### Arithmetic Operations

BigDecimal instances are immutable. Operations return new BigDecimal instances:

```typescript
// Basic arithmetic
const a = new BigDecimal("123.45");
const b = new BigDecimal("67.89");

const sum = a.plus(b); // 191.34
const difference = a.minus(b); // 55.56
const product = a.times(b); // 8,381.03
const quotient = a.div(b); // 1.81839...

// Power
const squared = a.pow(2); // 15,239.9025

// Square root
const root = a.sqrt(); // 11.11...

// Absolute value
const abs = new BigDecimal("-123.45").abs(); // 123.45
```

### Comparison Methods

```typescript
const x = new BigDecimal("10.5");
const y = new BigDecimal("10.5");
const z = new BigDecimal("9.9");

x.eq(y); // true (equal)
x.gt(z); // true (greater than)
x.gte(y); // true (greater than or equal)
x.lt(z); // false (less than)
x.lte(y); // true (less than or equal)

// Check for special values
x.isZero(); // false
x.isPositive(); // true
x.isNegative(); // false
x.isFinite(); // true
```

### Rounding and Formatting

```typescript
const value = new BigDecimal("123.456789");

// Get with specific decimal places
value.dp(2); // 123.46 (rounded)
value.dp(2, 1); // 123.45 (rounded down)

// Format as string
value.toString(); // "123.456789"
value.toFixed(2); // "123.46"
value.toExponential(2); // "1.23e+2"
value.toPrecision(5); // "123.46"
```

### Working with Schema-Defined BigDecimal Fields

When you've defined a `BigDecimal` field in your schema:

```graphql
type TokenPair {
  id: ID!
  name: String!
  price: BigDecimal!
  volume: BigDecimal!
}
```

You can use it in your handlers:

```typescript
// In your event handler
context.TokenPair.set({
  id: event.params.pairId,
  name: event.params.name,
  price: new BigDecimal(event.params.price),
  volume: new BigDecimal("0"), // Start with zero volume
});

// Updating a field
const tokenPair = await context.TokenPair.get(pairId);
if (tokenPair) {
  const newVolume = tokenPair.volume.plus(new BigDecimal(tradeAmount));
  context.TokenPair.set({
    ...tokenPair,
    volume: newVolume,
  });
}
```

### Example: Financial Calculation

```typescript
function calculateFee(amount: BigDecimal, feeRate: BigDecimal): BigDecimal {
  // Calculate fee with proper rounding
  return amount.times(feeRate).dp(2);
}

const tradeAmount = new BigDecimal("1250.75");
const feeRate = new BigDecimal("0.0025"); // 0.25%
const fee = calculateFee(tradeAmount, feeRate); // 3.13
```

### Best Practices for BigDecimal

1. **Always use strings for initialization** when precision matters:

   ```typescript
   // Preferred
   const value = new BigDecimal("123.456789");

   // May lose precision
   const value = new BigDecimal(123.456789);
   ```

2. **Set precision explicitly** when doing division:

   ```typescript
   // Set to 8 decimal places for crypto prices
   const price = totalValue.div(tokenAmount).dp(8);
   ```

3. **Handle rounding appropriately** for financial calculations:

   ```typescript
   // Round down (floor) for user-favorable calculations
   const userReceives = amount.dp(2, 1); // ROUND_DOWN

   // Round up (ceil) for protocol-favorable calculations
   const protocolFee = amount.dp(2, 0); // ROUND_UP
   ```

4. **Compare with equals method** instead of `==` or `===`:

   ```typescript
   // Correct
   if (value.eq(new BigDecimal(0))) {
     /* ... */
   }

   // Incorrect - compares object references
   if (value === new BigDecimal(0)) {
     /* ... */
   }
   ```

5. **Chain operations carefully**, remembering that each operation returns a new instance:
   ```typescript
   // Calculate (a + b) * c with proper precision
   const result = a.plus(b).times(c).dp(8);
   ```

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
import { type Enum } from "envio";

let user = {
  id: event.params.id,
  balance: event.params.balance,
  accountType: "USER" satisfies Enum<"AccountType">, // enum as string
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
 - Set relationships in your handlers by assigning `<field>_id` with the related entity's `id`. For example, create or update a `Token` entity with `collection_id: collectionId`.

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
- Since v3.5, `@index` is an optimization rather than a requirement: a `getWhere` query on an unindexed field creates the index on demand. Declaring it up front is still faster, because declared indices are built in one batched pass at the end of the backfill. See [Deferred Index Creation](/docs/HyperIndex/database-performance-optimization#deferred-index-creation).

---

## Choosing a Storage Backend (`@storage`)

When you enable more than one storage backend in `config.yaml`, the `@storage` directive controls where each entity is written:

```graphql
# Queryable over GraphQL and mirrored into ClickHouse for analytics
type Transfer @storage(postgres: true, clickhouse: true) {
  id: ID!
  amount: BigInt!
}
```

Since v3.2 you can mark a backend as `default` in `config.yaml`, and entities without a `@storage` directive go there — you no longer need the directive on every entity. See [`storage`](/docs/HyperIndex/config-schema-reference#storage).

### Per-Entity ClickHouse Tuning

Since [`v3.4.0`](https://github.com/enviodev/hyperindex/releases/tag/v3.4.0), the `clickhouse` argument also accepts an options object that tunes that entity's ClickHouse history table:

```graphql
type Transfer
  @storage(
    postgres: true
    clickhouse: {
      partitionBy: "toYYYYMM(timestamp)"
      orderBy: ["timestamp"]
      ttl: "timestamp + INTERVAL 2 YEAR"
    }
  ) {
  id: ID!
  timestamp: Timestamp!
  amount: BigInt!
}
```

| Option | Type | Description |
|--------|------|-------------|
| `partitionBy` | ClickHouse expression | Emitted as `PARTITION BY <expr>`. Use it to keep queries and TTL deletes inside a partition instead of scanning the whole table. |
| `orderBy` | list of entity field names | Entity fields that lead the table's sorting key, replacing the default `id` prefix. The internal checkpoint column stays appended, so the key becomes `ORDER BY (<orderBy...>, envio_checkpoint_id)`. |
| `ttl` | ClickHouse expression | Emitted as `TTL <expr>`. Ages rows out automatically. |

Rules worth knowing before you reach for these:

- `orderBy` takes **entity field names**, not expressions — unlike `partitionBy` and `ttl`, which are raw ClickHouse expressions passed through as written.
- Don't list `id` in `orderBy`: it's already the default sorting key, and codegen rejects it.
- Nullable fields, list fields and `@derivedFrom` fields can't appear in `orderBy` — ClickHouse doesn't allow them in a sorting key, and codegen catches this rather than letting table creation fail at runtime.
- An entity can carry only one `@storage` directive, and it must enable at least one backend.

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

## Documenting Entities, Fields, and Relationships

You can document your entities, fields, and relationships directly in `schema.graphql` using GraphQL string descriptions. These descriptions are exposed through the generated GraphQL API and appear in introspection, making your API self-documenting.

```graphql
"""
A token transfer between two accounts
"""
type Transfer {
  id: ID!
  "The address the tokens were sent from"
  from: String!
  "The address the tokens were sent to"
  to: String!
  "The amount transferred, in wei"
  value: BigInt!
}
```

Both single-line (`"..."`) and multi-line (`"""..."""`) descriptions are supported.

:::note
Only string descriptions are exposed in introspection. Hash (`#`) comments are ignored by the GraphQL parser and do **not** appear in the API. Descriptions on entities, fields, and relationships were added in HyperIndex v3.1.
:::

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
