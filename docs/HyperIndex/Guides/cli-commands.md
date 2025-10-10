---
id: cli-commands
title: Envio CLI Reference
sidebar_label: Envio CLI
slug: /cli-commands
---

# Envio Command Line Interface

This comprehensive reference guide covers all available commands and options in the Envio CLI tool. Use this documentation to explore the full capabilities of the `envio` command and its subcommands for managing your indexing projects.

## Getting Started

The Envio CLI provides a powerful set of tools for creating, developing, and managing your indexers. Whether you're starting a new project, running a development server, or deploying to production, the CLI offers commands to simplify and automate your workflow.

## Command Overview

The commands are organized into the following categories:

### Initialization Commands

- [`envio init`](#envio-init) - Create new indexer projects
- [`envio init contract-import`](#envio-init-contract-import) - Import from existing contracts
- [`envio init template`](#envio-init-template) - Use pre-built templates

### Development Commands

- [`envio dev`](#envio-dev) - Run in development mode with hot reloading
- [`envio codegen`](#envio-codegen) - Generate code from configuration files
- [`envio start`](#envio-start) - Start the indexer without code generation

### Environment Management

- [`envio stop`](#envio-stop) - Stop running processes
- [`envio local`](#envio-local) - Manage local environment
- [`envio local docker`](#envio-local-docker) - Control Docker containers
- [`envio local db-migrate`](#envio-local-db-migrate) - Manage database schema

### Analysis Tools

- [`envio benchmark-summary`](#envio-benchmark-summary) - View performance data

## Global Command

### `envio`

The base command that provides access to all Envio functionality.

**Usage:** `envio [OPTIONS] <COMMAND>`

###### **Options:**

- `-d`, `--directory <DIRECTORY>` — The directory of the project. Defaults to current dir ("./")
- `-o`, `--output-directory <OUTPUT_DIRECTORY>` — The directory within the project that generated code should output to (Default: `generated`)
- `--config <CONFIG>` — The file in the project containing config (Default: `config.yaml`)

## Initialization Commands

These commands help you create and set up new indexing projects quickly.

### `envio init`

Initialize an indexer with one of the initialization options.

**Usage:** `envio init [OPTIONS] [COMMAND]`

###### **Subcommands:**

- `contract-import` — Initialize Evm indexer by importing config from a contract for a given chain
- `template` — Initialize Evm indexer from an example template
- `fuel` — Initialization option for creating Fuel indexer

###### **Options:**

- `-n`, `--name <NAME>` — The name of your project
- `-l`, `--language <LANGUAGE>` — The language used to write handlers (Options: `javascript`, `typescript`, `rescript`)
- `--api-token <API_TOKEN>` — The hypersync API key to be initialized in your templates .env file

### `envio init contract-import`

Initialize Evm indexer by importing config from a contract for a given chain.

**Usage:** `envio init contract-import [OPTIONS] [COMMAND]`

###### **Subcommands:**

- `explorer` — Initialize by pulling the contract ABI from a block explorer
- `local` — Initialize from a local json ABI file

###### **Options:**

- `-c`, `--contract-address <CONTRACT_ADDRESS>` — Contract address to generate the config from
- `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/networks
- `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract

### `envio init contract-import explorer`

Initialize by pulling the contract ABI from a block explorer.

**Usage:** `envio init contract-import explorer [OPTIONS]`

###### **Options:**

- `-b`, `--blockchain <BLOCKCHAIN>` — Network to import the contract from (Options include `ethereum-mainnet`, `polygon`, `arbitrum-one`, etc. For complete list, run: `envio init contract-import explorer --help`)

### `envio init contract-import local`

Initialize from a local json ABI file.

**Usage:** `envio init contract-import local [OPTIONS]`

###### **Options:**

- `-a`, `--abi-file <ABI_FILE>` — The path to a json abi file
- `--contract-name <CONTRACT_NAME>` — The name of the contract
- `-b`, `--blockchain <BLOCKCHAIN>` — Name or ID of the contract network
- `-r`, `--rpc-url <RPC_URL>` — The rpc url to use if the network id used is unsupported by our hypersync
- `-s`, `--start-block <START_BLOCK>` — The start block to use on this network

### `envio init template`

Initialize Evm indexer from an example template.

**Usage:** `envio init template [OPTIONS]`

###### **Options:**

- `-t`, `--template <TEMPLATE>` — Template to use (Options: `greeter`, `erc20`)

### `envio init fuel`

Initialization option for creating Fuel indexer.

**Usage:** `envio init fuel [COMMAND]`

###### **Subcommands:**

- `contract-import` — Initialize Fuel indexer by importing config from a contract
- `template` — Initialize Fuel indexer from an example template

### `envio init fuel contract-import`

Initialize Fuel indexer by importing config from a contract for a given chain.

**Usage:** `envio init fuel contract-import [OPTIONS] [COMMAND]`

###### **Subcommands:**

- `local` — Initialize from a local json ABI file

###### **Options:**

- `-c`, `--contract-address <CONTRACT_ADDRESS>` — Contract address to generate the config from
- `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/networks
- `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract

### `envio init fuel contract-import local`

Initialize from a local json ABI file.

**Usage:** `envio init fuel contract-import local [OPTIONS]`

###### **Options:**

- `-a`, `--abi-file <ABI_FILE>` — The path to a json abi file
- `--contract-name <CONTRACT_NAME>` — The name of the contract

### `envio init fuel template`

Initialize Fuel indexer from an example template.

**Usage:** `envio init fuel template [OPTIONS]`

###### **Options:**

- `-t`, `--template <TEMPLATE>` — Name of the template (Options: `greeter`)

## Development Commands

These commands help you develop, test, and run your indexers locally.

### `envio dev`

Development commands for starting, stopping, and restarting the indexer with automatic codegen for any changed files.

**Usage:** `envio dev`

### `envio stop`

Stop the local environment - delete the database and stop all processes (including Docker) for the current directory.

**Usage:** `envio stop`

### `envio codegen`

Generate indexing code from user-defined configuration & schema files.

**Usage:** `envio codegen`

### `envio start`

Start the indexer without any automatic codegen.

**Usage:** `envio start [OPTIONS]`

###### **Options:**

- `-r`, `--restart` — Clear your database and restart indexing from scratch
- `-b`, `--bench` — Saves benchmark data to a file during indexing

## Environment Management Commands

These commands help you manage your local development environment.

### `envio local`

Prepare local environment for envio testing.

**Usage:** `envio local <COMMAND>`

###### **Subcommands:**

- `docker` — Local Envio and ganache environment commands
- `db-migrate` — Local Envio database commands

### `envio local docker`

Local Envio and ganache environment commands.

**Usage:** `envio local docker <COMMAND>`

###### **Subcommands:**

- `up` — Create docker images required for local environment
- `down` — Delete existing docker images on local environment

### `envio local docker up`

Create docker images required for local environment.

**Usage:** `envio local docker up`

### `envio local docker down`

Delete existing docker images on local environment.

**Usage:** `envio local docker down`

### `envio local db-migrate`

Local Envio database commands.

**Usage:** `envio local db-migrate <COMMAND>`

###### **Subcommands:**

- `up` — Migrate latest schema to database
- `down` — Drop database schema
- `setup` — Setup database by dropping schema and then running migrations

### `envio local db-migrate up`

Migrate latest schema to database.

**Usage:** `envio local db-migrate up`

### `envio local db-migrate down`

Drop database schema.

**Usage:** `envio local db-migrate down`

### `envio local db-migrate setup`

Setup database by dropping schema and then running migrations.

**Usage:** `envio local db-migrate setup`

## Analysis Tools

These commands help you analyze and optimize your indexer's performance.

### `envio benchmark-summary`

Prints a summary of the benchmark data after running the indexer with envio start --bench flag or setting 'ENVIO_SAVE_BENCHMARK_DATA=true'.

**Usage:** `envio benchmark-summary`

## Command Reference Table

| Command                        | Description             | Common Use Case                   |
| ------------------------------ | ----------------------- | --------------------------------- |
| `envio init`                   | Create new indexer      | Starting a new project            |
| `envio dev`                    | Run in development mode | Local development with hot reload |
| `envio start`                  | Start indexer           | Production or testing runs        |
| `envio stop`                   | Stop all processes      | Cleaning up environment           |
| `envio codegen`                | Generate code           | After changing config or schema   |
| `envio local docker up`        | Start Docker containers | Setting up environment            |
| `envio local db-migrate setup` | Initialize database     | Before first run                  |

## Complete One-Line Examples

These examples show the full command with all options to initialize and start an indexer in one line.

### Contract Import from Block Explorer

Create and start a USDC indexer on Ethereum:

```bash
pnpx envio init contract-import explorer -n usdc-indexer -c 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 -b ethereum-mainnet --single-contract --all-events -l typescript -d usdc-indexer --api-token "your-api-token" && cd usdc-indexer && pnpm dev
```

**What each part does:**
- `pnpx envio init contract-import explorer` - Initialize from block explorer
- `-n usdc-indexer` - Project name
- `-c 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` - USDC contract address
- `-b ethereum-mainnet` - Network
- `--single-contract` - Don't prompt for more contracts
- `--all-events` - Index all events
- `-l typescript` - Use TypeScript
- `-d usdc-indexer` - Output directory
- `--api-token "your-api-token"` - API token
- `&& cd usdc-indexer` - Navigate to project
- `&& pnpm dev` - Start the indexer

### Contract Import from Local ABI

For unverified contracts or custom networks:

```bash
pnpx envio init contract-import local -n my-indexer -a ./abis/MyContract.json -c 0xYourContractAddress -b ethereum-mainnet --contract-name MyContract --single-contract --all-events -l typescript -d my-indexer --api-token "your-api-token" && cd my-indexer && pnpm dev
```

**What each part does:**
- `pnpx envio init contract-import local` - Initialize from local ABI file
- `-a ./abis/MyContract.json` - Path to ABI file
- `--contract-name MyContract` - Name for the contract
- `-b ethereum-mainnet` - Network name (or use chain ID for local import)
- All other flags same as above

### Template Initialization

Quick start with an ERC20 template:

```bash
pnpx envio init template -n erc20-example -t erc20 -l typescript -d erc20-indexer --api-token "your-api-token" && cd erc20-indexer && pnpm dev
```

**What each part does:**
- `pnpx envio init template` - Initialize from template
- `-t erc20` - Use ERC20 template
- Other flags same as above

### Running Benchmarks

```bash
envio start --bench
envio benchmark-summary
```
