---
id: event-handlers
title: Event Handlers
sidebar_label: Event Handlers
slug: /event-handlers
---



# Event Handlers

Once the configuration and schema files are in place, run
```bash
npx envio codegen
``` 
in the project directory.

The entity and event types will then be available in the handler files. 

A user can specify a handler file per contract that processes events emitted by that contract.
Each event requires two functions to be registered:
1. An `<event>LoadEntities` function
2. An `<event>Handler` function

Reason for requiring two functions instead of one for each event is to optimize the indexing speed.

### Gravatar example

Inspecting the `config.yaml` of the `UpdatedGravatar` event, it indicates that there is a defined `requiredEntities` field of the following:

```yaml
events:
  - name: "UpdatedGravatar"
    requiredEntities:
      - name: "Gravatar"
        labels:
          - "gravatarWithChanges"
```
### Example of registering a `LoadEntities` function for the `UpdatedGravatar` event:

```rescript
Handlers.GravatarContract.registerUpdatedGravatarLoadEntities((event, contextUpdator) => {
  contextUpdator.gravatar.gravatarWithChangesLoad(event.params.id->Ethers.BigInt.toString)
})
```


- The load entities function `registerUpdatedGravatarLoadEntities` follows a naming convention for all events: `register<EventName>LoadEntities`. 
- Within the function that is being registered the user must define the criteria for loading the `gravatarWithChanges` entity which corresponds to the label defined in the config. 
- This is made available to the user through the load entity context defined as `contextUpdator`.
- In the case of the above example the `gravatarWithChanges` loads a `Gravatar` entity that corresponds to the id received from the event.

### Example of registering a `Handler` function for the `UpdatedGravatar` event and using the label `gravatarWithChanges`:

```rescript
Handlers.GravatarContract.registerUpdatedGravatarHandler((event, context) => {
  let updatesCount =
    context.gravatar.gravatarWithChanges()->Belt.Option.mapWithDefault(1, gravatar =>
      gravatar.updatesCount + 1
    )

  let gravatar: gravatarEntity = {
    id: event.params.id->Ethers.BigInt.toString,
    owner: event.params.owner->Ethers.ethAddressToString,
    displayName: event.params.displayName,
    imageUrl: event.params.imageUrl,
    updatesCount,
  }

  context.gravatar.update(gravatar)
})
```

- The handler function `registerUpdatedGravatarHandler` also follows a naming convention for all events in the form of: `register<EventName>Handler`.
- Once the user has defined their `loadEntities` function, they are then able to retrieve the loaded entity information via the labels defined in the `config.yaml` file. 
- In the above example, if a `Gravatar` entity is found matching the load criteria in the `loadEntities` function, it will be available via `gravatarWithChanges`. 
- This is made available to the user through the handler context defined simply as `context`. 
- This `context` is the gateway by which the user can interact with the indexer and the underlying database.
- The user can then modify this retrieved entity and subsequently update the `Gravatar` entity in the database. 
- This is done via the `context` using the update function (`context.gravatar.update(gravatar)`).
- The user has access to a `gravatarEntity` type that has all the fields defined in the schema.

This context also provides the following functions per entity that can be used to interact with that entity:

- insert
- update
- delete

---