---
id: schema-file
title: Schema File
sidebar_label: Schema File
slug: /schema
---



# Schema Definition

The `schema.graphql` file contains the definitions of all user-defined entities. These entity types are then created/modified within the handler files.

Example schema definition for Gravatar scenario:

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