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
| `Json`             | JSON object (from envio@2.20)                | `Json`                    | `Js.Json.t`    |

Learn more about GraphQL scalars [here](https://graphql.org/learn/).

---

## Working with BigDecimal

The `BigDecimal` scalar type in HyperIndex is based on the [bignumber.js](https://mikemcl.github.io/bignumber.js/) library, which provides arbitrary-precision decimal arithmetic. This is essential for financial calculations and handling numeric values that exceed JavaScript's native number precision.

### Importing BigDecimal

```typescript
// JavaScript/TypeScript
import { BigDecimal } from "generated";

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
