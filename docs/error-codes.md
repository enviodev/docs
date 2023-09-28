---
id: error-codes
title: Error Codes
sidebar_label: Error Codes
slug: /error-codes
---

This section provides an exhaustive list of potential errors you could face while using Envio, along with explanations for each.

# Initialization related errors

### `EE100`: Invalid Addresses

Invalid smart contract addresses present in the configuration file.

Use smart contract addresses in the valid format belonging to the correct chain.

### `EE101`: Unique Contract Names

The configuration file contains non-unique contract names.

Use unique contract names in the configuration file.

### `EE102`: Reserved Words in the Configuration file

Using reserved programming words in the configuration file.

Envio prohibits use of reserved words from JavaScript, TypeScript and ReScript in the configuration file as it may conflict with the auto-generated code.

Some examples of reserved words are `for`, `return`, `require`, `try` etc.

Avoid using reserved words in the configuration file.

### `EE103`: Parse Event Error

Unable to parse event signature due to an error.

Refer to the [<ins>configuration</ins>](./configuration-file) page on how to correctly define a human readable ABI.

### `EE104`: Resolve Config Path

Failed to resolve the config path.

Ensure that the configuration file exists in the correct directory.

### `EE105`: Deserialize Config

Failed to deserialize the config file.

Refer to the [<ins>configuration</ins>](./configuration-file) page for more information.

### `EE106`: Undefined Network Config

Undefined network configuration.

Provide `rpc_config`.

Refer to the [<ins>RPC sync</ins>](./sync-config) page for more information.

### `EE107`: Hypersync Endpoint Unhealthy

Hypersync endpoint is unhealthy.

Provide `rpc_config` or `hypersync_config`.

Refer to the [<ins>RPC sync</ins>](./sync-config) or [<ins>Hypersync</ins>](./hypersync) page for more information.

### `EE108`: Valid Postgres Database

Provide a valid postgres database name.

Requirements for a valid name:

- It must start with a letter or underscore.
- It can contain letters, numbers, and underscores (no spaces).
- It must have a maximum length of 63 characters.

### `EE109`: Incorrect RPC URL

The config file contains RPC URLs in an incorrect format.

The RPC URLs need to start with either `http://` or `https://`.

### `EE200`: Read Schema Error

Failed to read schema file.

Ensure that the schema file is placed in the correct directory.

### `EE201`: Parse Schema Error

Failed to parse the schema.

Ensure that there are no syntax errors in `schema.graphql` file in the directory.

Refer to the [<ins>schema</ins>](./schema) page for more information.

### `EE202`: Multiple `@derivedFrom`

Cannot use more than one `@derivedFrom` directive on an entity.

Refer to the [<ins>schema</ins>](./schema) page for more information.

### `EE203`: Missing Field Argument for `@derivedFrom`

No `field` argument supplied to `@derivedFrom`.

Provide a `field` value for the `@derivedFrom` directive used.

Refer to the [<ins>schema</ins>](./schema) page for more information.

### `EE204`: Invalid `@derivedFrom` Argument

`field` argument in `@derivedFrom` needs to contain a string.

Refer to the [<ins>schema</ins>](./schema) page for more information.

### `EE205`: Non-existent Derived Entity

Derived entity does not exist in the schema.

Use a derived entity that exists in the schema provided.

### `EE206`: Non-existent Derived Field

Derived field does not exist on specified entity.

Use a field that exists in the specified entity.

### `EE207`: Undefined Type

Failed to parse undefined type in the schema.

Use one of the following types in the schema:

- `ID`
- `String`
- `Int`
- `Float`
- `Boolean`
- `Bytes`
- `BigInt`

### `EE208`: Unsupported Nullable Scalars

Nullable scalars inside lists are unsupported.

Include a `!` after your scalar.

### `EE209`: Unsupported Multidimensional Lists

Nullable multi-dimensional list types are unsupported.

Include a `!` for your inner list type eg. `[[Int!]!]`

### `EE210`: Reserved Words in the Schema file

Using reserved programming words in the schema file.

Envio prohibits use of reserved words from JavaScript and ReScript in the schema file as it may conflict with the auto-generated code.

Some examples of reserved words are `catch`, `debugger`, `lazy`, `open` etc.

Avoid using reserved words in the schema file.

### `EE300`: Event ABI Error

Cannot parse the provided ABI for contract.

Use an event that belongs in your ABI for the configuration file.

### `EE301`: Missing ABI File Path

Add `abi_file_path` for contract to parse the event.

### `EE302`: Invalid ABI File Path

Provide a valid `abi_file_path` for named events.

### `EE303`: Missing Event In ABI

Unable to find an event named in your ABI.

Use an event that belongs in your ABI for the configuration file.

### `EE304`: Mismatched Event Signature

Event signature does not exist in provided ABI file.

Ensure that the same event signature from the ABI is used in the configuration file.

### `EE305`: ABI Config Mismatch

Event signature in ABI does not match the config.

Ensure that the same event signature from the ABI is used in the configuration file.

### `EE400`: Invalid Directory Name

Specified directory is invalid.

Use a different directory without special characters such as `/` `\` `:` `*` `?` `"` `<` `>` `|`.

### `EE401`: Existing Directory

Specified directory already exists.

Use a different directory for initialization.

# Event Related Errors

### `EE500`: Event Handler File Not Found

Issue importing the Event Handler file.

Ensure that the file is in the correct directory as per the configuration file.

The Event Handler file should be compiling as well.

Refer to the [<ins>event handlers</ins>](./event-handlers) page for more information.

### `EE600`: Top Level Error

Hit a top-level error catcher while processing events.

Contact us on in our [Discord](https://discord.gg/Q9qt8gZ2fX) for further assistance.

# Database Related Errors

For all of the database related errors, rerun DB migrations using the following command:

```bash
envio local db-migrate setup
```

### `EE700`: Parse DB Row

Unable to parse row from the database.

### `EE800`: Raw Table Creation

Error in creating raw events table.

### `EE801`: Dynamic Contracts Table Creation

Error in creating dynamic contracts table.

### `EE802`: Entity Tables Creation

Error in creating entity tables.

### `EE803`: Tracking Tables Error

Error in tracking tables.

### `EE804`: Drop Entity Tables

Error dropping entity tables.

### `EE805`: Drop Tables Except Raw

Error dropping tables except for raw events.

### `EE806`: Clear Metadata

Error clearing metadata.

Indexing may still work - but you may have issues querying the data in Hasura.

### `EE807`: Tracking a Table

Error in tracking a table.

Indexing may still work - but you may have issues querying the data in Hasura.

### `EE808`: View Permissions

Error setting up view permissions.

Indexing may still work - but you may have issues querying the data in Hasura.

# Contract Related Errors

### `EE900`: Undefined Contract

Undefined contract specified.

Verify that contract name is defined in the configuration file.

### `EE901`: Interface Mapping Error

Unexpected case - contract name not found in interface mapping.

Contact us on in our [Discord](https://discord.gg/Q9qt8gZ2fX) for further assistance.

# Network Related Errors

### `EE1000`: Undefined Chain

Undefined chain ID used for chain manager.

Use a valid chain ID in the configuration file.

# General Errors

### `EE1100`: Promise Timeout

Top-level promise timeout reached.

Contact us on in our [Discord](https://discord.gg/Q9qt8gZ2fX) for further assistance.

---
