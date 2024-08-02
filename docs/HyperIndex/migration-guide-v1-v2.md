---
id: migration-guide-v1-v2
title: Migration Guide v1 to v2
sidebar_label: Migration Guide v1 to v2
slug: /migration-guide-v1-v2
---

NOTE: v2 is currently in rc phase (release candidate) and is not yet stable. Please refer to the [v1 documentation](https://docs.envio.dev/docs/HyperIndex) for the stable version.

# Introduction

V2 of HyperIndex is about streamlining the process of starting an indexer and optimizing it as you go. There are two big changes:

- Handlers are now asynchronous, and `loaders` became an optional tool for additional optimizations.
- It made [async-mode](/docs/HyperIndex/async-mode) not needed, hence it's removed in v2.
- Loaders (when used) are more expressive and connected via the return type to the context of the handler.
  - In v1, you needed to use linked entities to load entity fields of other entities. This was unintuitive.
    - In v2, you can directly access the fields of the loader the exact same way as you do in the handler, with an async 'get' function.
  - In v1, you needed to call 'load' in the loader, and 'get' in the handler separately (or use labelled fields).
    - In v2, you can use the return type of the loader to directly access the fields in the handler via the context, or you can call 'get' again.
- Fixed indexing params with names that are reserved words in ReScript.
- Validation and autocompletion for `config.yaml`. You can enable it by adding `# yaml-language-server: $schema=./node_modules/envio/evm.schema.json` on top of your `config.yaml` file.

## Changes to Make

### Handlers

- Handlers are now asynchronous - add the `async` keyword and rename `handlerAsync` to `handler`.
- You can use `handlerWithLoader` if you need a loader, otherwise use `handler` directly.
- The 'get' function is now asyncronous, so add an `await` before those functions.
- No labelled entities.

### Loaders

- Loaders are merged into the handlers using `handlerWithLoader`.
- Loading linked entities is done directly with promises in the loader.
- Loaders are completely optional - only use the if you care about high throughput indexing.
- Loaders return the required entities which are then used in the handler.
- The dynamic contract registration moved from loaders to its own `<ContractName>.<EventName>.contractRegister` handler.
- The return type of the loader is used directly in the handler to access the loaded data. No need to re-'get' it again in the handler.

### 'event' parameter

This is common to loaders, handlers, and dynamic contract registration:
- Block and transaction fields on an event are scoped to 'block' or 'transaction'. So for example `event.block.timestamp` instead of `event.blockTimestamp`. 
- `event.address` is now `event.srcAddress`.
<!-- TODO: lots more to put here -->

### Configuration

- There is no async-mode anymore, so you can remove `isAsync: true` from each of the events in your `config.yaml`.
- This is no more 'required_entities' in the config file. This includes subfields such as `label` and `arrayLabels`.

```diff
- isAsync: true
```

- Removed entity labels and required entities.

```diff
- required_entities:
-   - name: User
```

### Miscellaneous breaking changes and deprecations

- The `context.Entity.load` function is deprecated and should be replaced with direct calls to `context.Entity.get` in the loader.
- The `context.ParentEntity.loadField` functions are deprecated and should be replaced with direct calls to `context.ChildEntity.get`.
- Remove the `Contract` and `Entity` suffixes from generated code.
- For JavaScript/TypeScript users:
  - The event param names are not uncapitalized anymore. So you might need to change `event.params.capitalizedParamName` to `event.params.CapitalizedParamName`.
- For ReScript users:
  - We moved to the built-in `bigint` type instead of the `Ethers.BigInt.t`.
  - We migrated to ReScript 11 uncurried mode. Curried mode is not supported anymore. So you need to remove `uncurried: false` from your rescript.json file. Also, we vendored `RescriptMocha` bindings to support uncurried mode. Please use it instead of `rescript-mocha`.
- The config parsing is more strict, unknown fields will result in an error.
  - You can add `# yaml-language-server: $schema=./node_modules/envio/evm.schema.json` at the top of your 'config.yaml' file to get autocomplete and validation for the config file.

<!-- TODO: lots more to put here -->

## Migration Steps

### 1. Update Imports

Replace the old import statements with the new ones.

**Before:**

```typescript
import {
  GreeterContract_NewGreeting_handler,
  // or you aren't using these `_` versions of the imports
  GreeterContract,
  // ...
} from "../generated/src/Handlers.gen"; // Not all imports still look like this, but on old indexers they do.

import {
  GreetingEntity,
  UserEntity,
  // ... other entities
} from "../generated/src/Types.gen";
```

**After:**

```typescript
import {
  Greeter, // the Greeter Contract
  // ...
  Greeting, // the Greeting Entity
  User, // The User Entity
  // ... other entities
} from "generated"; // Note this requires adding the 'generated' folder to your 'optionalDependencies' in your package.json
```

### 2. Update Handler Definitions

**Before:**

```typescript
/// or if your indexer is very old: GreeterContract_Event1_loader
GreeterContract.Event1.loader(({ event, context }) => {
  // Loader code
});
GreeterContract.Event1.handler(({ event, context }) => {
  // Handler code
});
```

**After:**

```typescript
Greeter.Event1.handlerWithLoader({
  loader: async ({ event, context }) => {
    // Loader code
    return {
      /* loaded data, this data is available in the "handler" via the `loaderReturn` parameter */
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
GreeterContract.Event1.handler(({ event, context }) => {
  // Handler code
});
```

**After:**

```typescript
Greeter.Event1.handler(async ({ event, context }) => {
  // Handler code
});
```

### 3. Dynamic Contract Registration

Use `contractRegister` for dynamic contract registration. Assuming there is an event called NewGreeterCreated that creates a contract called Greeter that has the address of the `newGreeter` as a field.

**Before:**

```typescript
GreeterContract.NewGreeterCreated.loader(({ event, context }) => {
  context.contractRegistration.addGreeter(event.params.newGreeter);
});
```

**After:**

```typescript
Greeter.NewGreeterCreated.contractRegister(({ event, context }) => {
  context.addGreeter(event.params.newGreeter);
});
```

### 4. Handling Entities

**Before**

```typescript
const greetingInstance: GreetingEntity = {
  ...currentGreeting,
  // ...loaderReturn
};
context.Greeting.set(greetingInstance);
```

**After**

```typescript
const greetingInstance: Greeting = {
  ...currentGreeting,
  // ...
};
context.Greeting.set(greetingInstance);
```

Only change is in the TypeScript/ReScript type for the entity 💪

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

Before:
```typescript
GreeterContract.Event1.loader(({ event, context }) => {
  context.Entity.load(event.srcAddress.toString(), {
    loadField1: true,
    loadField2: true,
  });
});
```

After:
```typescript
Greeter.Event1.handlerWithLoader({
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

### 7. Config File Changes

Before:
```yaml
contracts:
  - name: Greeter
    sameRandomFieldThatIsntPartOfSchema: true
    handler: src/EventHandlers.ts
    events:
      - event: Greet(address indexed recipient, string greeting)
        isAsync: true
        requiredEntities:
          - name: User
            label: recipient
          - name: Greetings
            arrayLabels: previousGreetings
```

After:
```yaml
contracts:
  - name: Greeter
    handler: src/EventHandlers.ts
    sameRandomFieldThatIsntPartOfSchema: true
    events:
      - event: Greet(address indexed recipient, string greeting)
```
### 8. Update event fields

Before:
```typescript
GreeterContract.Event1.loader(({ event, context }) => {
  console.log("The event timestamp and block number", event.block.timestamp, createdAtBlockNumber: event.block.number);
});
GreeterContract.Event1.handler(({ event, context }) => {
  console.log("The event timestamp and block number", event.block.timestamp, createdAtBlockNumber: event.block.number);
});
```

After:
```typescript
GreeterContract.Event1.contractRegister(({ event, context }) => {
  console.log("These values exist in the contract registration too", event.block.timestamp, createdAtBlockNumber: event.block.number);
});
GreeterContract.Event1.handlerWithLoader({
  loader: async ({ event, context }) => {
    console.log("The event timestamp and block number", event.block.timestamp, createdAtBlockNumber: event.block.number);
  },
  handler: async ({ event, context }) => {
    console.log("The event timestamp and block number", event.block.timestamp, createdAtBlockNumber: event.block.number);
  },
});
```

## Examples

As we upgrade public repos on GitHub, we'll add the commits of the upgrade to this page for reference:

- [Velodrome Indexer Upgrade Commit](https://github.com/enviodev/velodrome-indexer/commit/f1ddb8bef6d2884e7167784303f03fec5e06576e)

### Additional Tips

- Make sure to thoroughly test your migrated code to catch any issues that might arise from the asynchronous nature of the new handlers.
- If performance isn't a massive concern, you can simply use the `handler` function without a loader.
