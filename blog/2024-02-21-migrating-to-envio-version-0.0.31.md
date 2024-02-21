---
title: Migrating to Envio Version 0.0.31
sidebar_label: Migrating to Envio Version 0.0.31
slug: /migrating-to-envio-version-0.0.31
---

<img src="/blog-assets/place_holder.png" alt="place holder description" width="100%"/>

<!--truncate-->

Envio version `0.0.30` / `0.0.31` comes with a step up in robustness but also some breaking changes to be aware of. This guide should help you migrate your indexer handler code to be able to run with the new version.

## Nullable Fields in GraphQL Schema

If your `graphql.schema` contains nullable fields, you must now explicitly set them to `undefined` instead of `null` in your TypeScript/JavaScript code. This adjustment is a breaking change but aligns with best practices in TypeScript/JavaScript.

### Example Change:

**GraphQL Schema**:

```graphql
entity Example {
  exampleField: String
}
```

**Before**:

```typescript
let exampleEntity: Example = {
  exampleField: null,
};
```

**After**:

```typescript
let exampleEntity: Example = {
  exampleField: undefined,
};
```

## Referencing Other Entities in Your Schema

When referencing other entities in your schema, you now need to append `_id` to the entity field label in your handler code. This change makes the GraphQL query layer more closely mirror the actual GraphQL schema, moving away from the previous approach that added an 'Object' suffix.

### Example Change:

**GraphQL Schema**:

```graphql
entity Example {
  exampleField: String
}
entity Example2 {
  exampleLink: Example!
}
```

**Before**:

```typescript
let exampleEntity: Example = {
  exampleLink: idForExample,
};
// or
let { exampleLink } = context.Example2.get(example2Id);
```

**After**:

```typescript
let exampleEntity: Example = {
  exampleLink_id: idForExample,
};
// or
let { exampleLink_id } = context.Example2.get(example2Id);
```

### GraphQL Query Layer Change:

**Before**:

```graphql
{
  Example2 {
    exampleLink
    exampleLinkObject {
      exampleField
    }
  }
}
```

**After**:

```graphql
{
  Example2 {
    exampleLink_id
    exampleLink {
      exampleField
    }
  }
}
```
