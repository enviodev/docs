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

### Greeter example

Inspecting the `config.yaml` of the `UpdatedGreeting` event, it indicates that there is a defined `requiredEntities` field of the following:

```yaml
events:
  - name: "UpdateGreeting"
    requiredEntities: []
      - name: "Greeting"
        labels:
          - "greetingWithChanges"
```
### Example of registering a `LoadEntities` function for the `UpdateGreeting` event:

```rescript
Handlers.GreeterContract.registerUpdateGreetingLoadEntities((~event, ~context) => {
  ()
})

```


- The load entities function `registerUpdateGreetingLoadEntities` follows a naming convention for all events: `register<EventName>LoadEntities`. 
- Within the function that is being registered the user must define the criteria for loading the `greetingWithChanges` entity which corresponds to the label defined in the config. 
- This is made available to the user through the load entity context defined as `contextUpdator`.
- In the case of the above example the `greetingWithChanges` loads a `Greeting` entity that corresponds to the id received from the event.

### Example of registering a `Handler` function for the `UpdateGreeting` event and using the label `greetingWithChanges`:

```rescript
Handlers.GreeterContract.registerUpdateGreetingHandler((~event, ~context) => {
  let greetingObject: greetingEntity = {
    id: event.block.timestamp,
    message: event.params.greeting,    
  }

  context.greeting.update(greetingObject)
})
```

- The handler function `registerUpdateGreetingHandler` also follows a naming convention for all events in the form of: `register<EventName>Handler`.
- Once the user has defined their `loadEntities` function, they are then able to retrieve the loaded entity information via the labels defined in the `config.yaml` file. 
- In the above example, if a `Greeting` entity is found matching the load criteria in the `loadEntities` function, it will be available via `greetingWithChanges`. 
- This is made available to the user through the handler context defined simply as `context`. 
- This `context` is the gateway by which the user can interact with the indexer and the underlying database.
- The user can then modify this retrieved entity and subsequently update the `Greeting` entity in the database. 
- This is done via the `context` using the update function (`context.greeting.update(greetingObject)`).
- The user has access to a `greetingEntity` type that has all the fields defined in the schema.

This context also provides the following functions per entity that can be used to interact with that entity:

- insert
- update
- delete

---