---
id: migration-guide-v1-v2
title: Migration Guide v1 to v2
sidebar_label: Migration Guide v1 to v2
slug: /migration-guide-v1-v2
---

# Migration Guide: HyperIndex v1 to v2

## Introduction

Welcome to HyperIndex v2 - a major upgrade that significantly enhances your indexing experience! This new version introduces asynchronous processing, streamlined workflows, and improved flexibility for your indexers. With v2, you'll benefit from faster development, better performance, and a more intuitive API.

While the full release changes can be found in the [v2.0.0 release notes](https://github.com/enviodev/hyperindex/releases/tag/v2.0.0), here are some key highlights before we dive into the comprehensive migration guide:

- Handlers are now asynchronous, with `loaders` becoming an optional tool for additional optimizations.
- [Async-mode](/docs/HyperIndex/v1/async-mode) has been removed as it's no longer needed in v2.
- Loaders (when used) are more expressive and directly connected to the handler context via their return type.
  - In v2, you can access loader fields in the handler the same way you do in the loader, using an async 'get' function.
  - The return type of the loader can be used to directly access loaded data in the handler via the context.
- Indexing parameters with names that are reserved words in ReScript have been fixed.
- Validation and autocompletion for `config.yaml` is now available. Enable it by adding `# yaml-language-server: $schema=./node_modules/envio/evm.schema.json` at the top of your `config.yaml` file.

These changes simplify the development process and provide a more consistent and powerful indexing experience. The following sections will guide you through the necessary steps to migrate your existing v1 indexers to v2.

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

### Configuration

- There is no async-mode anymore, so you can remove `isAsync: true` from each of the events in your `config.yaml`.
- There is no more 'required_entities' in the config file. This includes sub-fields such as `label` and `arrayLabels`.

```diff
- isAsync: true
```

- Removed entity labels and required entities.

```diff
- required_entities:
-   - name: User
```

#### Field Selection and Event Parameter Changes

In v2, the structure of the `event` parameter has changed significantly. Some fields have been moved or renamed, and new fields are available through the `field_selection` configuration.

Field selection allows you to add additional data points to each event that gets passed to your handlers. This feature enhances the flexibility and efficiency of your indexer, as by default you don't fetch data that isn't required.

To use field selection, add a `field_selection` section to your `config.yaml` file. For example:

```yaml
field_selection:
  transaction_fields:
    - "from"
    - "to"
    - "hash"
    - "transactionIndex"
  block_fields:
    # Not required for migration, but more fields can be added here
    - "parentHash"
```

For an exhaustive list of fields that can be added and more detailed information about field selection, please refer to the [Field Selection section in the Configuration File guide](configuration-file#field-selection).

Note: By default, `number`, `hash`, and `timestamp` are already selected for `block_fields` and do not need to be configured.

#### 'event' Parameter Changes

The structure of the `event` parameter has changed in v2. This affects loaders, handlers, and dynamic contract registration. Here are the key changes:

1. Block and transaction fields are now scoped under `event.block` and `event.transaction` respectively.
2. Some field names have changed:
   - `event.txOrigin` is now `event.transaction.from` (requires adding to config)
   - `event.txTo` is now `event.transaction.to` (requires adding to config)
   - `event.txHash` is now `event.transaction.hash` (requires adding to config)
   - `event.blockTimestamp` is now `event.block.timestamp` (no config change)
   - `event.blockNumber` is now `event.block.number` (no config change)
   - `event.blockHash` is now `event.block.hash` (no config change)

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
    events:
      - event: Greet(address indexed recipient, string greeting)
```
### 8. Event Fields

Before (v1):
```typescript
GreeterContract.Event1.handler(({ event, context }) => {
  console.log("The event timestamp and block number",
    event.txOrigin,
    event.txTo,
    event.transactionHash,
    event.transactionIndex,
    event.blockNumber,
    event.blockTimestamp,
    event.blockHash,
  )
});
```

After (v2):
```typescript
Greeter.Event1.handlerWithLoader(async ({ event, context }) => {
  // NOTE: these fields are in the loader and the contractRegister function too
  console.log("The event timestamp and block number",
    event.transaction.from,
    event.transaction.to,
    event.transaction.hash,
    event.transaction.transactionIndex,
    event.block.number,
    event.block.timestamp,
    event.block.hash,
  );
});
```
And in your `config.yaml` file:
```yaml
field_selection:
  transaction_fields:
    - "from"
    - "to"
    - "hash"
    - "transactionIndex"
```

## Examples

As we upgrade public repos on GitHub, we'll add the commits of the upgrade to this page for reference:

- [Velodrome Indexer Upgrade Commit](https://github.com/enviodev/velodrome-indexer/commit/f1ddb8bef6d2884e7167784303f03fec5e06576e)

### Additional Tips

- Make sure to thoroughly test your migrated code to catch any issues that might arise from the asynchronous nature of the new handlers.

- If performance isn't a massive concern, you can simply use the `handler` function without a loader.
