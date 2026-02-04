---
id: error-codes
title: Error Codes
sidebar_label: Error Codes
slug: /error-codes
description: Explore Envio HyperIndex error codes with clear explanations and quick fixes for common issues.
---

# Envio Error Codes

This guide provides a comprehensive list of error codes you may encounter when using Envio HyperIndex. Each error includes an explanation and recommended actions to resolve the issue.

## How to Use This Guide

When encountering an error in Envio, you'll receive an error code (like `EE101`). Use this guide to:

1. Locate the error code by category or by searching for the specific code
2. Read the explanation to understand what caused the error
3. Follow the recommended steps to resolve the issue

If you can't resolve an error after following the suggestions, please reach out for support on our [Discord community](https://discord.gg/DhfFhzuJQh).

## Error Categories

Envio error codes are categorized by their first digits:

| Error Code Range    | Category                 | Description                                                      |
| ------------------- | ------------------------ | ---------------------------------------------------------------- |
| `EE100` - `EE199`   | Configuration File       | Issues with the configuration file format, parameters, or values |
| `EE200` - `EE299`   | Schema File              | Problems with GraphQL schema definition                          |
| `EE300` - `EE399`   | ABI File                 | Issues with smart contract ABI files or event definitions        |
| `EE400` - `EE499`   | Initialization Arguments | Problems with initialization parameters or directories           |
| `EE500` - `EE599`   | Event Handling           | Issues with event handler files or functions                     |
| `EE600` - `EE699`   | Event Syncing            | Problems with event synchronization process                      |
| `EE700` - `EE799`   | Database Functions       | Issues with database operations                                  |
| `EE800` - `EE899`   | Database Migrations      | Problems with database schema migrations or tracking             |
| `EE900` - `EE999`   | Contract Interface       | Issues related to smart contract interfaces                      |
| `EE1000` - `EE1099` | Chain Manager            | Problems with blockchain network connections                     |
| `EE1100` - `EE1199` | Lazy Loader              | General errors related to the loading process                    |

## Initialization-Related Errors

### Configuration File Errors (EE100-EE111)

#### `EE100`: Invalid Addresses

**Issue**: The configuration file contains invalid smart contract addresses.

**Solution**: Verify all contract addresses in your configuration file. Ensure they:

- Match the correct format for the blockchain (0x-prefixed for EVM chains)
- Are valid addresses for the specified network
- Have the correct length (42 characters including '0x' for EVM)

#### `EE101`: Non-Unique Contract Names

**Issue**: The configuration file contains duplicate contract names.

**Solution**: Each contract in your configuration must have a unique name. Review your config.yaml and ensure all contract names are unique.

#### `EE102`: Reserved Words in Configuration File

**Issue**: Your configuration uses reserved programming words that conflict with Envio's code generation.

**Solution**:

- Review the [reserved words list](./reserved-words) for JavaScript, TypeScript, and ReScript
- Rename any contract or event names that use reserved words
- Choose descriptive names that don't conflict with programming languages

#### `EE103`: Parse Event Error

**Issue**: Envio couldn't parse event signatures in your configuration.

**Solution**:

- Check your event signatures in the configuration file
- Ensure they match the format in your ABI
- Refer to the [configuration guide](configuration-file) for correct event definition syntax

#### `EE104`: Resolve Config Path

**Issue**: Envio couldn't find your configuration file at the specified path.

**Solution**:

- Verify that your configuration file exists in the correct directory
- Ensure the file is named correctly (usually `config.yaml`)
- Check for file permission issues

#### `EE105`: Deserialize Config

**Issue**: Your configuration file contains invalid YAML syntax.

**Solution**:

- Check your YAML file for syntax errors
- Ensure proper indentation and structure
- Validate your YAML using a linter or validator

#### `EE106`: Undefined Network Config

**Issue**: No `hypersync_config` or `rpc_config` defined for the network specified in your configuration.

**Solution**:

- Add either a HyperSync or RPC configuration for your network
- See the [HyperSync Data Source](./hypersync) or [RPC Data Source](./rpc-sync) documentation
- Example:
  ```yaml
  network:
    network_id: 1
    rpc_config:
      rpc_url: "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
  ```

#### `EE108`: Invalid Postgres Database Name

**Issue**: The Postgres database name provided doesn't meet requirements.

**Solution**: Provide a database name that:

- Begins with a letter or underscore
- Contains only letters, numbers, and underscores (no spaces)
- Has a maximum length of 63 characters

#### `EE109`: Incorrect RPC URL Format

**Issue**: The RPC URL in your configuration has an invalid format.

**Solution**:

- Ensure all RPC URLs start with either `http://` or `https://`
- Verify the URL is correctly formatted and accessible
- Example: `https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

#### `EE110`: End Block Not Greater Than Start Block

**Issue**: Your configuration specifies an end block that is less than or equal to the start block.

**Solution**: If providing an end block, ensure it's greater than the start block:

```yaml
start_block: 10000000
end_block: 20000000 # Must be greater than start_block
```

#### `EE111`: Invalid Characters in Contract or Event Names

**Issue**: Contract or event names contain invalid characters.

**Solution**: Use only alphanumeric characters and underscores in contract and event names.

### Schema File Errors (EE200-EE217)

#### `EE200`: Schema File Read Error

**Issue**: Envio couldn't read the schema file.

**Solution**:

- Ensure the schema file exists at the expected location
- Check file permissions
- Verify the file isn't corrupted

#### `EE201`: Schema Parse Error

**Issue**: The schema file contains syntax errors.

**Solution**:

- Check for GraphQL syntax errors in your schema.graphql file
- Ensure all entities and fields are properly defined
- Validate your GraphQL schema with a schema validator

#### `EE202`: Multiple `@derivedFrom` Directives

**Issue**: An entity field has more than one `@derivedFrom` directive.

**Solution**: Use only one `@derivedFrom` directive per entity. Review your schema and remove duplicate directives.

#### `EE203`: Missing Field Argument for `@derivedFrom`

**Issue**: A `@derivedFrom` directive is missing the required `field` argument.

**Solution**: Add the `field` argument to your `@derivedFrom` directive:

```graphql
type User {
  id: ID!
  orders: [Order!]! @derivedFrom(field: "user")
}
```

#### `EE204`: Invalid `@derivedFrom` Argument

**Issue**: The `field` argument in `@derivedFrom` has an invalid value.

**Solution**: Ensure the `field` argument contains a valid string value that matches a field name in the referenced entity.

#### `EE207`: Undefined Type

**Issue**: The schema contains an undefined type.

**Solution**: Use only supported scalar types or defined entity types:

- `ID`
- `String`
- `Int`
- `Float`
- `Boolean`
- `Bytes`
- `BigInt`

#### `EE208`: Unsupported Nullable Scalars

**Issue**: The schema contains nullable scalar types inside lists.

**Solution**: Use non-nullable scalars in lists by adding `!` after the type:

```graphql
# Incorrect
items: [String]

# Correct
items: [String!]!
```

#### `EE209`: Unsupported Multidimensional Lists

**Issue**: The schema contains nullable multidimensional list types.

**Solution**: Ensure inner list types are non-nullable:

```graphql
# Incorrect
matrix: [[Int]]

# Correct
matrix: [[Int!]!]!
```

#### `EE210`: Reserved Words in Schema File

**Issue**: The schema uses reserved programming words.

**Solution**:

- Check the [reserved words list](./reserved-words)
- Rename any entities or fields using reserved words
- Choose alternative descriptive names

#### `EE211`: Unsupported Arrays of Entities

**Issue**: The schema uses unsupported array syntax for entity relationships.

**Solution**: Use one of the supported methods for entity references as outlined in the [schema documentation](../Guides/schema-file.md).

#### `EE212`: Reserved Enum Names

**Issue**: The schema uses enum names that conflict with Envio's internal enums.

**Solution**: Check the [internal reserved types list](./reserved-words#envio-internal-reserved-types) and rename conflicting enums.

#### `EE213`: Duplicate Enum Values

**Issue**: An enum in the schema contains duplicate values.

**Solution**: Ensure all values within each enum type are unique.

#### `EE214`: Naming Conflicts Between Enums and Entities

**Issue**: The schema has enums and entities with the same names.

**Solution**: Ensure all enum and entity names are unique within the schema.

#### `EE215`: Incorrectly Placed Directive

**Issue**: A directive is used in an incorrect location in the schema.

**Solution**: Ensure directives are placed on appropriate schema elements according to GraphQL specifications.

#### `EE216`: Incorrect Directive Parameters

**Issue**: A directive has incorrect parameter labels or count.

**Solution**: Verify that all directive parameters match the expected format and count.

#### `EE217`: Incorrect Directive Parameter Type

**Issue**: A directive parameter has an invalid type.

**Solution**: Ensure parameter values match the expected types for each directive.

### ABI File Errors (EE300-EE305)

#### `EE300`: Event ABI Parse Error

**Issue**: Cannot parse the ABI for specified contract events.

**Solution**:

- Verify the ABI file contains valid JSON
- Ensure the ABI includes all events referenced in your configuration
- Check for syntax errors in your ABI file

#### `EE301`: Missing ABI File Path

**Issue**: No ABI file path specified for a contract.

**Solution**: Add the `abi_file_path` property in your configuration for each contract:

```yaml
contracts:
  - name: MyContract
    abi_file_path: ./abis/MyContract.json
```

#### `EE302`: Invalid ABI File Path

**Issue**: The specified ABI file path is invalid or inaccessible.

**Solution**:

- Verify the ABI file exists at the specified path
- Ensure the path is relative to your project directory
- Check file permissions

#### `EE303`: Missing Event in ABI

**Issue**: An event referenced in your configuration doesn't exist in the ABI.

**Solution**:

- Ensure the event name matches exactly what's in the ABI
- Verify the ABI includes all events you want to track
- If using a human-readable ABI, check event signature formatting

#### `EE304`: Mismatched Event Signature

**Issue**: Event signature in configuration doesn't match the ABI.

**Solution**: Ensure event signatures in your configuration match exactly what's in the ABI file.

#### `EE305`: ABI Config Mismatch

**Issue**: Event parameters in configuration don't match ABI definition.

**Solution**: Verify that event parameters in your configuration match the types and order defined in the ABI.

### Initialization Arguments Errors (EE400-EE402)

#### `EE400`: Invalid Directory Name

**Issue**: A specified directory name contains invalid characters.

**Solution**: Use directory names without special characters like `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`.

#### `EE401`: Directory Already Exists

**Issue**: Trying to create a directory that already exists.

**Solution**: Use a different directory name or remove the existing directory if appropriate.

#### `EE402`: Invalid Subgraph ID

**Issue**: The subgraph ID for migration is invalid.

**Solution**: Provide a valid subgraph ID that starts with "Qm".

## Event-Related Errors

### Event Handling Errors (EE500)

#### `EE500`: Event Handler File Not Found

**Issue**: Envio couldn't find or import the event handler file.

**Solution**:

- Ensure the handler file exists in the correct directory
- Verify the file path in your configuration
- Make sure the handler file is compiled correctly
- Refer to the [event handlers documentation](./event-handlers) for proper setup

### Event Syncing Errors (EE600)

#### `EE600`: Top Level Error During Event Processing

**Issue**: An unexpected error occurred while processing events.

**Solution**:

- Check your event handler logic for errors
- Review recent changes to your blockchain indexer
- If unable to resolve, contact support through [Discord](https://discord.gg/Q9qt8gZ2fX) with error details

## Database-Related Errors

For database-related errors (EE700-EE808), you can often resolve issues by resetting the database migration:

```bash
pnpm envio local db-migrate setup
```

### Database Function Errors (EE700)

#### `EE700`: Database Row Parse Error

**Issue**: Unable to parse rows from the database.

**Solution**:

- Check entity definitions in your schema
- Verify data types match between schema and database
- Reset database migrations using the command above

### Database Migration Errors (EE800-EE808)

#### `EE800`: Raw Table Creation Error

**Issue**: Error creating raw events table in database.

**Solution**: Reset database migrations using the command above.

#### `EE801`: Dynamic Contracts Table Creation Error

**Issue**: Error creating dynamic contracts table.

**Solution**: Reset database migrations using the command above.

#### `EE802`: Entity Tables Creation Error

**Issue**: Error creating entity tables.

**Solution**:

- Check your schema for invalid entity definitions
- Reset database migrations

#### `EE803`: Tracking Tables Error

**Issue**: Error tracking tables in database.

**Solution**: Reset database migrations using the command above.

#### `EE804`: Drop Entity Tables Error

**Issue**: Error dropping entity tables.

**Solution**:

- Check if any other processes are using the database
- Reset database migrations

#### `EE805`: Drop Tables Except Raw Error

**Issue**: Error dropping all tables except raw events table.

**Solution**: Reset database migrations using the command above.

#### `EE806`: Clear Metadata Error

**Issue**: Error clearing metadata.

**Solution**:

- Reset database migrations
- Note: Indexing may still work, but you might have issues querying data in Hasura

#### `EE807`: Table Tracking Error

**Issue**: Error tracking a table in Hasura.

**Solution**:

- Reset database migrations
- Note: Indexing may still work, but you might have issues querying data in Hasura

#### `EE808`: View Permissions Error

**Issue**: Error setting up view permissions.

**Solution**:

- Reset database migrations
- Note: Indexing may still work, but you might have issues querying data in Hasura

## Contract-Related Errors

#### `EE900`: Undefined Contract

**Issue**: Referencing a contract that isn't defined in configuration.

**Solution**:

- Verify all contract names in your handlers match those in the configuration file
- Check for typos in contract names

#### `EE901`: Interface Mapping Error

**Issue**: Contract name not found in interface mapping (unexpected internal error).

**Solution**: Contact support through [Discord](https://discord.gg/Q9qt8gZ2fX) for assistance.

## Network-Related Errors

#### `EE1000`: Undefined Chain

**Issue**: Using a chain ID that isn't defined or supported.

**Solution**:

- Use a valid chain ID in your configuration file
- Check if the network is supported by Envio
- Verify chain ID matches the intended network

## General Errors

#### `EE1100`: Promise Timeout

**Issue**: A long-running operation timed out.

**Solution**:

- Check network connectivity
- Verify RPC endpoint performance
- Consider increasing timeouts if possible
- If persists, contact support through [Discord](https://discord.gg/Q9qt8gZ2fX)

---
