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

---
