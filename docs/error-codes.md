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

Use smart contract addresses in the valid format belonging to the correct chain specified.

### `EE101`: Unique Contract Names

The configuration file contains non-unique contract names.

Use unique contract names in the configuration file.

### `EE102`: Reserved Words

Using reserved words in the configuration file.

Avoid using reserved words in the configuration file.

### `EE103`: Parse Event Error

Unable to parse event signature due to an error.

### `EE104`: Resolve Config Path

Failed to resolve the config path.

Ensure correct directory and config file existence.

### `EE105`: Deserialize Config

Failed to deserialize the config file.

Visit documentation for more information.

### `EE106`: Undefined Network Config

Undefined network configuration.

Provide `rpc_config`.

### `EE107`: Hypersync Endpoint Unhealthy

Hypersync endpoint is unhealthy.

Provide `rpc_config` or `hypersync_config`.

### `EE108`: Valid Postgres Database

Provide a valid postgres database name.

### `EE109`: Incorrect RPC URL

The config file contains RPC URLs in an incorrect format.

### `EE200`: Read Schema Error

Failed to read schema file.

Please ensure that the schema file is placed correctly in the directory.

### `EE201`: Parse Schema Error

Failed to parse the schema.

Please ensure that there are no syntax errors in `schema.graphql` file in the directory.

### `EE202`: Multiple DerivedFrom

Cannot use more than one `@derivedFrom` directive on an entity.

### `EE203`: Missing Field Argument

No `field` argument supplied to `@derivedFrom`.

Please provide a `field` value for the `@derivedFrom` directive used.

### `EE204`: Invalid DerivedFrom Argument

`field` argument in `@derivedFrom` needs to contain a string.

### `EE205`: Non-existent Derived Entity

Derived entity does not exist in the schema.

Please use a derived entity that exists in the schema provided.

### `EE206`: Non-existent Derived Field

Derived field does not exist on specified entity.

Please use a field that exists in the specified entity.

### `EE207`: Undefined Type

sdfsd

Failed to parse undefined type in the schema.

Please use one of the following types in the schema:

- `ID`
- `String`
- `Int`
- `Float`
- `Boolean`
- `Bytes`
- `BigInt`

### `EE208`: Unsupported Nullable Scalars

Nullable scalars inside lists are unsupported.

Please include a `!` after your scalar.

### `EE209`: Unsupported Multidimensional Lists

Nullable multi-dimensional list types are unsupported.

Please include a `!` for your inner list type eg. [[Int!]!]

### `EE300`: Event ABI Error

Cannot parse the provided ABI for contract.

Please use an event that belongs in your ABI for the configuration file.

### `EE301`: Missing ABI File Path

Add `abi_file_path` for contract to parse the event.

### `EE302`: Invalid ABI File Path

Provide a valid `abi_file_path` for named events.

### `EE303`: Missing Event In ABI

Unable to find an event named in your ABI.

Please use an event that belongs in your ABI for the configuration file.

### `EE304`: Mismatched Event Signature

Event signature does not exist in provided ABI file.

Please make sure that the same event signature from the ABI is used in the configuration file.

### `EE305`: ABI Config Mismatch

Event signature in ABI does not match the config.

Please make sure that the same event signature from the ABI is used in the configuration file.

### `EE400`: Invalid Directory Name

Specified directory is invalid.

Please use a different directory without special characters.

### `EE401`: Existing Directory

Specified directory already exists.

Please use a different directory for initialization.

# Event Related Errors

### `EE500`: Event Handler File Not Found

Issue importing the Event Handler file.

Please make sure that the file is in the correct directory as per the configuration file.

The Event Handler file should be compiling as well.

### `EE600`: Top Level Error

Hit a top-level error catcher while processing events.

Please contact us on in our [Discord](https://discord.gg/Q9qt8gZ2fX) for further assistance.

# Database Related Errors

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

### `EE807`: Tracking Table

Error in tracking table.

### `EE808`: View Permissions

Error setting up view permissions.

# Contract Related Errors

### `EE900`: Undefined Contract

Undefined contract specified.

### `EE901`: Interface Mapping Error

Unexpected case - contract name not found in interface mapping.

# Network Related Errors

### `EE1000`: Undefined Chain

Undefined chain ID used for chain manager.

Please use a valid chain ID in the configuration file.

# General Errors

### `EE1100`: Promise Timeout

Top-level promise timeout reached.

Please contact us on in our [Discord](https://discord.gg/Q9qt8gZ2fX) for further assistance.

---
