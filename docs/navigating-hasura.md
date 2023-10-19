---
id: navigating-hasura
title: Navigating Hasura
sidebar_label: Navigating Hasura
slug: /navigating-hasura
---

> This page is only relevant when testing on local machine or using a self-hosted version of Envio that uses Hasura.

## Introduction

This page explains how to navigate the Hasura dashboard, focusing on two key tabs: the API and Data tabs. These tabs allow you to interact with and view indexed results.

The screenshots provided below come from the [Greeter tutorial](./greeter-tutorial).

## API tab

The API tab lets you execute GraphQL queries and mutations on indexed data. It serves as a GraphQL playground for testing your API calls.

<img src="/img/hasura-api-tab.png" alt="/hasura-api-tab" width="100%"/>

Under the explorer, all entities defined in the `schema.graphql` file should appear.
By default, Envio will also display [`dynamic_contracts`](./dynamic-contracts.md) and `raw_events` that have been used in the indexing process.

In the GraphQL playground, you can structure and test your API calls using the indexed data.

For additional information on GraphQL queries, visit Hasura's [quickstart guide](https://hasura.io/docs/latest/queries/quickstart/).

## Data tab

The Data tab allows you to view and manage your database schema, tables, and relationships, providing crucial insight into the structure of the indexed data.

<img src="/img/hasura-data-tab.png" alt="/hasura-data-tab" width="100%"/>

In the public schema, all indexed tables should appear.
Again, by default, [`dynamic_contracts`](./dynamic-contracts.md) and `raw_events` tables will also be displayed.

To verify that the data has been correctly indexed, it is advisable to check the content of the entity tables and the `db_write_timestamp` values for the rows in each table.

Older `db_write_timestamp` values might signify stale data from a previous indexing run.

---
