---
id: schema-file
title: Schema File
sidebar_label: Schema File
slug: /schema
---



# Schema File

The `schema.graphql` file contains the definitions of all user-defined entities, which specify the shape of data to be populated from smart contract events. These entity types are then created/modified within the handler files.

Example `schema.graphql` for Greeter scenario:

```graphql
type Greeting @entity {
  id: ID!
  message: String!
}

```

---