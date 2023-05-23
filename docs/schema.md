---
id: schema-file
title: Schema File
sidebar_label: Schema File
slug: /schema
---



# Schema File

The `schema.graphql` file contains the definitions of all user-defined entities, which specifies the shape of the data to be populated from smart contract events. These entity types are then created/modified within the handler files.

Example `schema.graphql` for Gravatar scenario:

```graphql
type Gravatar @entity {
  id: ID!
  owner: Bytes!
  displayName: String!
  imageUrl: String!
  updatesCount: Int!
}
```

---