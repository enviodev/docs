---
id: configuring-schema
title: Configuring the Schema
sidebar_label: Configuring the Schema
slug: /
---

<sub><sup> NOTE: These docs are under active development 👷‍♀️👷 </sup></sub>

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