---
id: migration-guide-v1-v2
title: Migration Guide v1 to v2
sidebar_label: Migration Guide v1 to v2
slug: /migration-guide-v1-v2
---

NOTE: v2 is currently in rc phase (release candidate) and is not yet stable. Please refer to the [v1 documentation](https://docs.envio.dev/docs/HyperIndex) for the stable version.

# Introduction

V2 of HyperIndex is about streamlining the process of starting an indexer and optimizing it as you go. There are two big changes:

- Handlers are now asyncronous, and by default 'loaders' aren't required at all - there is no need for the [async-mode](/docs/HyperIndex/async-mode).
- Loaders (when used) are more expressive and connected via the return type to the context of the handler.
  - In v1, you needed to use linked entites to load entity fields of other entities. This was unintuitive.
    - In v2, you can directly access the fields of the loader the exact same way as you do in the handler, with a async 'get' function.
  - In v1, you needed to call 'load' in the loader, and 'get' in the handler separately (or use labelled fields).
    - In v2, you can use the return type of the loader to directly access the fields in the handler via the context, or you can call 'get' again.

## Changes to make

### Handlers

WIP

### Loaders

WIP

### Configuration

WIP

## Example
