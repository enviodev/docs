---
id: migration-guide-v1-v2
title: Migration Guide v1 to v2
sidebar_label: Migration Guide v1 to v2
slug: /migration-guide-v1-v2
---

NOTE: v2 is currently in rc phase (release candidate) and is not yet stable. Please refer to the [v1 documentation](https://docs.envio.dev/docs/HyperIndex) for the stable version.

# Introduction

V2 of HyperIndex is about streamlining the process of starting an indexer and optimizing it as you go. There are two big changes:

- Handlers are now asynchronous, and by default 'loaders' aren't required at all - there is no need for the [async-mode](/docs/HyperIndex/async-mode).
- Loaders (when used) are more expressive and connected via the return type to the context of the handler.
  - In v1, you needed to use linked entities to load entity fields of other entities. This was unintuitive.
    - In v2, you can directly access the fields of the loader the exact same way as you do in the handler, with an async 'get' function.
  - In v1, you needed to call 'load' in the loader, and 'get' in the handler separately (or use labelled fields).
    - In v2, you can use the return type of the loader to directly access the fields in the handler via the context, or you can call 'get' again.

## Changes to Make

### Handlers

- Handlers are now asynchronous (you can add an `async` keyword before it).
- You can use `handlerWithLoader` if you need a loader, otherwise use `handler` directly.
- The 'get' function is now asyncronous, so add an `await` before those functions.
- No labelled entities.

### Loaders

- Loaders are merged into the handlers using `handlerWithLoader`.
- Loading linked entities is done directly with promices in the loader.
- Loaders are completely optional - only use the if you care about high throughput indexing.
- Loaders return the required entities which are then used in the handler.
- `contractRegister` is used for dynamic contract registration. You don't add contracts to the indexer dynamically in the loader anymore.
- The return type of the loader is used directly in the handler to access the loaded data. No need to re-'get' it again in the handler.

### Configuration

- There is no async-mode anymore, so you can remove `isAsync: true` from each of the events in your `config.yaml`.

```diff
- isAsync: true
```

- No entity labels or required entities.

### Miscellaneous breaking changes and deprecations

- For rescript, you need to use the built in bigint type instead of the `Ethers.BigInt` type.
- Upgrade to rescript 11 uncurried mode (and use of newer rescript compiler).
- The `context.Entity.load` function is deprecated and should be replaced with direct calls to `context.Entity.get` in the loader.
- The `context.ParentEntity.loadField` functions are deprecated and should be replaced with direct calls to `context.ChildEntity.get`.
<!-- TODO: lots more to put here -->

## Migration Steps

### 1. Update Imports

Replace the old import statements with the new ones.

**Before:**

```typescript
import {
  SomeContract.Event1.loader,
  SomeContract.Event1.handler,
  // or you aren't using these `_` versions of the imports
  SomeContract,
  // ...
} from "../generated/src/Handlers.gen"; // Not all imports still look like this, but on old indexers they do.

import {
  Event1Entity,
  Event2Entity,
  // ... other entities
} from "../generated/src/Types.gen";
```

**After:**

```typescript
import {
  Some,
  Another,
  // ...
  Event1,
  Event2,
  // ... other entities
} from "generated"; // Note this requires adding the 'generated' folder to your 'optionalDependencies' in your package.json
```

### 2. Update Handler Definitions

**Before:**

```typescript
/// or if your indexer is very old: SomeContract_Event1_loader
SomeContract.Event1.loader(({ event, context }) => {
  // Loader code
});
SomeContract.Event1.handler(({ event, context }) => {
  // Handler code
});
```

**After:**

```typescript
SomeContract.Event1.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Loader code
    return {
      /* loaded data */
    };
  },
  handler: async ({ event, context, loaderReturn }) => {
    // Handler code using loaderReturn
  },
});
```

#### Or without a loader:

**Before:**

```typescript
SomeContract.Event1.handler(({ event, context }) => {
  // Handler code
});
```

**After:**

```typescript
SomeContract.Event1.handler(async ({ event, context, loaderReturn }) => {
  // Handler code
});
```

### 3. Dynamic Contract Registration

Use `contractRegister` for dynamic contract registration.

**Before:**

```typescript
SomeContract.Event1.loader(({ event, context }) => {
  context.contractRegistration.addContract(event.params.contract);
});
```

**After:**

```typescript
SomeContract.Event1.contractRegister(({ event, context }) => {
  context.addContract(event.params.contract);
});
```

### 4. Handling Entities

**Before == After**

```typescript
const entityInstance: EntityType = {
  ...currentEntity,
  // ...
};
context.Entity.set(entityInstance);
```

No changes 💪

### 5. Accessing Loaded Data

#### Access data via asyncronous get functions:

**Before:**

```typescript
let currentEntity = context.Entity.get(event.srcAddress.toString());
```

**After:**

```typescript
let currentEntity = await context.Entity.get(event.srcAddress.toString());
```

#### Access loaded data through the `loaderReturn` if you are using loaders:

**Before:**

```typescript
let currentEntity = context.Entity.get(event.srcAddress.toString());
```

**After:**

```typescript
const { currentEntity } = loaderReturn;
```

### 6. Loading Linked Entities

### Before

```typescript
SomeContract.Event1.loader(({ event, context }) => {
  context.Entity.load(event.srcAddress.toString(), {
    loadField1: true,
    loadField2: true,
  });
});
```

### After:

```typescript
SomeContract.Event1.handlerWithLoader({
  loader: async ({ event, context }) => {
    const currentEntity = await context.Entity.get(event.srcAddress.toString());
    if (currentEntity == undefined) return null;

    const field1Instance = await context.Entity.getField1(
      currentEntity.field1_id
    );
    const field2Instance = await context.Entity.getField2(
      currentEntity.field2_id
    );

    return { currentEntity, field1Instance, field2Instance };
  },
});
```

## Examples

As we upgrade public repos on GitHub, we'll add the commits of the upgrade to this page for reference:

- [Velodrome Indexer Upgrade Commit](https://github.com/enviodev/velodrome-indexer/commit/f1ddb8bef6d2884e7167784303f03fec5e06576e)

### Additional Tips

- Make sure to thoroughly test your migrated code to catch any issues that might arise from the asynchronous nature of the new handlers.
- If performance isn't a massive concern, you can simply use the `handler` function without a loader.
