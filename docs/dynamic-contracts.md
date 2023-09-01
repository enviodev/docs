---
id: dynamic-contracts
title: Loading Dynamic Contracts
sidebar_label: Dynamic Contracts/Factories
slug: /dynamic-contracts
---

# Dynamic Contracts/Factories

If you have a system that doesn't know all the contracts that need indexing at the beginning - for example you have a factory contract that dynamically creates new contracts over time - you'll need to register those contracts here. 

## Loader Function

Contract factories are currently supported in the 'loader' function of the event that you want to register the contract in, you can register a dynamic contract using:

```javascript
context.contractRegistration.add<your-contract-name>(<address-of-the-contract>)
```

The syntax is the exact same for JavaScript, TypesScript and ReScript.

## Important Note

Events may be lost from the newly registered contract if they happen before the event that registers the new contract (even in the same block). For example if there is an event inside the constructor or initializer of the function, and that happens before the event that is used to register the contract, that event will be lost. All other events will be indexed correctly of course.

