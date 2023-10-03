---
id: schema-file
title: Defining the Schema
sidebar_label: Defining the Schema
slug: /schema
---

# Defining the Schema

The `schema.graphql` file serves as a representation of your application's data model. It defines entity types that directly correspond to database tables, and the event handlers you create are responsible for creating and updating records within those tables. Additionally, the GraphQL API is automatically generated based on the entity types specified in the `schema.graphql` file, to allow access for the indexed data.

Entity types are identified with the @entity directive within the `schema.graphql` file.

Example schema from the Greeter template:

```graphql
type Greeting @entity {
  id: ID!
  latestGreeting: String!
  numberOfGreetings: Int!
}
```

Every entity type must include an `id` field that is of type `ID!`, `String!`, `Int!`, `Bytes!`, or `BigInt!`. The `id` field serves as a unique identifier for each instance of the entity.

In GraphQL, scalars represent fundamental data types such as strings and numbers. Each GraphQL scalar is mapped to a corresponding JavaScript,TypeScript or ReScript type, which is used in event handler code, depending on the language chosen. The following table provides an overview of the available scalar types, along with their associated JavaScript, TypeScript and ReScript types:

| **Name** | **Description**                                  | **JavaScript Type** | **TypeScript Type** | **ReScript Type** |
| -------- | ------------------------------------------------ | ------------------- | ------------------- | ----------------- |
| ID       | A unique identifier field                        | string              | string              | string            |
| String   | A UTF-8 character sequence                       | string              | string              | string            |
| Int      | A signed 32-bit integer                          | number              | number              | int               |
| Float    | A signed floating-point value                    | number              | number              | float             |
| Boolean  | Represents a true or false value                 | boolean             | boolean             | bool              |
| Bytes    | A UTF-8 character sequence with a 0x prefix      | string              | 0x${string}         | string            |
| BigInt   | A signed integer (equivalent to solidity int256) | bigint              | bigint              | Js.BigInt.t       |

You can find out more on GraphQL [here](https://graphql.org/learn/).

Once you have set up your config and schema file you can run `envio codegen` to generate the functions that you will use in your handlers.

```bash
envio codegen
```

## Defining One-to-Many Relationships

```graphql
type Nftcollection @entity {
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
type Token @entity {
  id: ID!
  tokenId: BigInt!
  collection: NftCollection!
  owner: User!
}
```

Assume that each `Nftcollection` can have multiple `Token` objects. This is represented by the `[Token!]` in `Nftcollection` definition, where the field's type is set to another entity type.

When you create a `Token` entity, the value of the `collection` field is set to the `id` of its associated `Nftcollection` entity.

Note that in the `Nftcollection` schema, the `tokens` field can't be directly accessed or modified. Fields marked with the `@derivedFrom` directive function are virtual fields and are only accessible when executing GraphQL API queries. This is commonly known as **reverse lookup**, as the relationship is established on the "many" end of the association.

## Other design tips

- Use meaningful entity names and only the first letter should be capitalized (i.e. `Nftcollection`).
- Use uncapitalized `camelCase` for field names (i.e. `latestGreeting` and `numberOfGreetings`) inside entities.

---
