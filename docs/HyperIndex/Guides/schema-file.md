---
id: schema-file
title: Defining the Schema
sidebar_label: Defining the Schema
slug: /schema
---

# Defining the Schema

The `schema.graphql` file serves as a representation of your application's data model. It defines entity types that directly correspond to database tables, and the event handlers you create are responsible for creating and updating records within those tables. Additionally, the GraphQL API is automatically generated based on the entity types specified in the `schema.graphql` file, to allow access to the indexed data.

Entity types are identified with the directive within the `schema.graphql` file.

Example schema from the Greeter template:

```graphql
type User {
  id: ID!
  greetings: [String!]!
  latestGreeting: String!
  numberOfGreetings: Int!
}
```

Every entity type must include an `id` field that is of type `ID!`, `String!`, `Int!`, `Bytes!`, or `BigInt!`. The `id` field serves as a unique identifier for each instance of the entity.

### Enums

The schema file also supports the use of enum types. An example of an enum definition and usage within the schema is shown below:

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

Enum types are generated as string union types for TypeScript and JavaScript and as polymorphic variants for ReScript. Therefore to set an enum field in an entity in TypeScript and JavaScript, the string of the enum value is used:

```typescript
import { AccountType } from "../generated/src/Enums.gen";

let accountType: AccountType = "USER";

let user = {
  id: event.params.id,
  balance: event.params.balance,
  accountType,
};
```

For ReScript, we use the polymorphic variant

```rescript
let accountType: Enums.accountType = #USER;

let user: Types.userEntity = {
  id: event.params.id,
  balance: event.params.balance,
  accountType
};
```

### Scalar Types

In GraphQL, scalars represent fundamental data types such as strings and numbers. Each GraphQL scalar is mapped to a corresponding JavaScript, TypeScript, or ReScript type, which is used in event handler code, depending on the language chosen. The following table provides an overview of the available scalar types, along with their associated JavaScript, TypeScript, and ReScript types:

| **Name**   | **Description**                                  | **JavaScript/TypeScript Type**         | **ReScript Type** |
| ---------- | ------------------------------------------------ | -------------------------------------- | ----------------- |
| ID         | A unique identifier field                        | string                                 | string            |
| String     | A UTF-8 character sequence                       | string                                 | string            |
| Int        | A signed 32-bit integer                          | number                                 | int               |
| Float      | A signed floating-point value                    | number                                 | float             |
| Boolean    | Represents a true or false value                 | boolean                                | bool              |
| Bytes      | A UTF-8 character sequence with a 0x prefix      | string                                 | string            |
| BigInt     | A signed integer (equivalent to solidity int256) | bigint                                 | bigint            |
| BigDecimal | An arbitrary size floating point number          | BigDecimal (imported from "generated") | BigDecimal.t      |
| Timestamp  | Timestamp with time zone                         | Date                                   | Js.Date.t         |

You can find out more on GraphQL [here](https://graphql.org/learn/).

Once you have set up your config and schema file you can run `pnpm envio codegen` to generate the functions that you will use in your handlers.

```bash
pnpm envio codegen
```

## Defining One-to-Many Relationships

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
```

```graphql
type Token {
  id: ID!
  tokenId: BigInt!
  collection: NftCollection!
  owner: User!
}
```

Assume that each `NftCollection` can have multiple `Token` objects. This is represented by the `[Token!]` in `NftCollection` definition, where the field's type is set to another entity type.

When you create a `Token` entity, the value of the `collection` field is set to the `id` of its associated `NftCollection` entity.

Note that in the `NftCollection` schema, the `tokens` field can't be directly accessed or modified. Fields marked with the `@derivedFrom` directive function are virtual fields and are only accessible when executing GraphQL API queries. This is commonly known as **reverse lookup**, as the relationship is established on the "many" end of the association.

## Adding Indexes to Fields

Add an index to a field to [improve read performance](database-performance-optimization) and enable field queries in your loaders. <!--TODO add links to field queries doc-->

Indices will automatically be added to all entity `id` fields and all fields referenced using `@derivedFrom` directive.

### Example

```graphql
type Token {
  id: ID!
  tokenId: BigInt!
  collection: NftCollection!
  owner: User! @index
}
```

## Advanced: @config Directive for Decimal Precision of `BigInt` and `BigDecimal` Fields

When working with large integers or high-precision decimal numbers in your application, you might need to customize the precision and scale of your `BigInt` and `BigDecimal` fields. This ensures that your database stores these numbers accurately according to your specific requirements. If you know your numbers will not be too big, you can also optimize the database by not over-allocating on the precision.
### Using the `@config` Directive

The `@config` directive allows you to specify custom configurations for fields. For `BigInt` and `BigDecimal` types, you can define precision and scale parameters.

**Syntax for `BigInt`:**

```graphql
fieldName: BigInt @config(precision: <number_of_digits>)
```

**Syntax for `BigDecimal`:**

```graphql
fieldName: BigDecimal @config(precision: <total_digits>, scale: <decimal_digits>)
```

**Example:**

```graphql
type Entity {
    id: ID!
    amount: BigInt @config(precision: 76)
    price: BigDecimal @config(precision: 10, scale: 2)
}
```

In this example:

- The `amount` field is a `BigInt` with up to 76 digits.
- The `price` field is a `BigDecimal` with a total of 10 digits and 2 decimal places.

<details>
  <summary>Click to expand a complete example of `@config` directive usage</summary>
### Complete Example Usage

```graphql
type Entity {
    id: ID!
    exampleBigInt: BigInt @config(precision: 76)
    exampleBigIntRequired: BigInt! @config(precision: 77)
    exampleBigIntArray: [BigInt!] @config(precision: 78)
    exampleBigIntArrayRequired: [BigInt!]! @config(precision: 79)
    exampleBigDecimal: BigDecimal @config(precision: 80, scale: 5)
    exampleBigDecimalRequired: BigDecimal! @config(precision: 81, scale: 5)
    exampleBigDecimalArray: [BigDecimal!] @config(precision: 82, scale: 5)
    exampleBigDecimalArrayRequired: [BigDecimal!]! @config(precision: 83, scale: 5)
}
```
</details>

### Postgres Precision and Scale Details

<details>
  <summary>Click to expand Postgres precision and scale details</summary>

In PostgreSQL, the `NUMERIC` data type is used to store exact numeric values with user-defined precision and scale. Understanding how these work is crucial when customizing your numeric fields.

- **Precision:** Total number of significant digits in the number (both to the left and right of the decimal point).
- **Scale:** Number of digits after the decimal point.

**Examples:**

- A number `12345.678` has a precision of 8 and a scale of 3.
- With a `NUMERIC(10, 2)` data type, you can store numbers up to `99999999.99`.

**Key Points:**

- **Precision and Scale Limits:**
  - The maximum number of digits to the left of the decimal point is `precision - scale`.
  - The total number of digits cannot exceed the specified precision.

- **Rounding and Truncation:**
  - If you insert a number with more decimal places than the specified scale, PostgreSQL will round it.
  - If the integer part exceeds the allowed digits (precision - scale), PostgreSQL will raise an error.

- **Storage Size:**
  - The storage size of a `NUMERIC` field depends on its declared precision.

By customizing precision and scale in your schema, you directly influence how PostgreSQL stores and validates your numeric data, ensuring data integrity and optimal storage usage.

**Additional Resources:**

- [PostgreSQL Numeric Types Documentation](https://www.postgresql.org/docs/current/datatype-numeric.html)
  
</details>

---

## Other Design Tips

- Use lowercase for the first letter of field names (i.e. `latestGreeting` and `numberOfGreetings`) inside entities.

---
