---
id: cli-commands
title: Envio CLI Reference
sidebar_label: Envio CLI
slug: /cli-commands
description: Explore and manage indexer projects with Envio CLI, from setup to development and benchmarking.
---

<!--
  DO NOT EDIT THE COMMAND REFERENCE BY HAND.

  This page is assembled by scripts/update-cli-help.js:
    - The curated prose below (intro, overview, reference table, examples)
      lives in this template and is safe to edit.
    - The per-command reference is injected at the ENVIO_CLI_HELP marker
      (further down this file) from hyperindex's packages/cli/CommandLineHelp.md,
      so it always matches the real CLI. Re-run `yarn update-cli-help` to refresh.
-->

# Envio Command Line Interface

This comprehensive reference guide covers all available commands and options in the Envio CLI tool for HyperIndex **V3**. Use this documentation to explore the full capabilities of the `envio` command and its subcommands for managing your blockchain indexing projects.

:::tip Envio Cloud CLI
Looking to manage your hosted indexers from the command line? See the **[Envio Cloud CLI](/docs/HyperIndex/envio-cloud-cli)** for deployment, monitoring, and management commands for Envio Cloud.
:::

## Getting Started

The Envio CLI provides a powerful set of tools for creating, developing, and managing your blockchain indexers. Whether you're starting a new project, running a development server, or deploying to production, the CLI offers commands to simplify and automate your workflow.

The fastest way to get going is `pnpx envio init`, which scaffolds a project interactively. From there, `envio dev` runs your indexer locally while you iterate, and `envio start` runs it in production.

## Command Overview

The commands are organized into the following categories:

### Initialization Commands

- [`envio init`](#envio-init) - Create new indexer projects
- [`envio init contract-import`](#envio-init-contract-import) - Import from existing contracts
- [`envio init template`](#envio-init-template) - Use pre-built templates

### Development Commands

- [`envio dev`](#envio-dev) - Run in development mode (use for local work)
- [`envio codegen`](#envio-codegen) - Generate types into `.envio/` from `config.yaml` and `schema.graphql`
- [`envio start`](#envio-start) - Production-only entrypoint

### Environment Management

- [`envio stop`](#envio-stop) - Stop running processes
- [`envio local`](#envio-local) - Manage local environment
- [`envio local docker`](#envio-local-docker) - Control Docker containers
- [`envio local db-migrate`](#envio-local-db-migrate) - Manage database schema

### Observability

- [`envio metrics`](#envio-metrics) - Fetch raw Prometheus metrics from the running indexer

### AI Coding Assistants

- [`envio skills`](#envio-skills) - Manage Envio-provided Claude Code skills
- [`envio tools search-docs`](#envio-tools-search-docs) - Full-text search across the Envio docs
- [`envio tools fetch-docs`](#envio-tools-fetch-docs) - Fetch a docs page as markdown

### Configuration

- [`envio config view`](#envio-config-view) - Print the resolved indexer config as JSON

## `envio`

**Usage:** `envio [OPTIONS] <COMMAND>`

###### **Subcommands:**

* `init` — Initialize an indexer with one of the initialization options
* `dev` — Development commands for starting, stopping, and restarting the indexer. Runs codegen automatically before launching
* `stop` — Stop the local environment - delete the database and stop all processes (including Docker) for the current directory
* `codegen` — Generate indexing code from user-defined configuration & schema files
* `local` — Prepare local environment for envio testing
* `start` — Start the indexer. Runs codegen automatically before launching so the on-disk types stay in sync with `config.yaml` and `schema.graphql`
* `metrics` — Fetch raw Prometheus metrics from the running indexer's /metrics endpoint
* `skills` — Manage Envio-provided Claude Code skills under `.claude/skills/`
* `tools` — Tools for people and AI agents (search-docs, fetch-docs). Run `envio tools help` for details
* `config` — Inspect the indexer config

###### **Options:**

* `-d`, `--directory <DIRECTORY>` — The directory of the project. Defaults to current dir ("./")
* `--config <CONFIG>` — The file in the project containing the configuration. It can also be set via the `ENVIO_CONFIG` environment variable

  Default value: `config.yaml`



## `envio init`

Initialize an indexer with one of the initialization options

**Usage:** `envio init [OPTIONS] [COMMAND]`

###### **Subcommands:**

* `contract-import` — Initialize Evm indexer by importing config from a contract for a given chain
* `template` — Initialize Evm indexer from an example template
* `svm` — Initialization option for creating Svm indexer
* `fuel` — Initialization option for creating Fuel indexer

###### **Options:**

* `-n`, `--name <NAME>` — The name of your project
* `-l`, `--language <LANGUAGE>` — The language used to write handlers

  Possible values: `typescript`, `rescript`

* `--package-manager <PACKAGE_MANAGER>` — The package manager used for `install` and post-init build steps (default: pnpm)

  Possible values: `pnpm`, `npm`, `yarn`, `bun`

* `--api-token <API_TOKEN>` — The hypersync API key to be initialized in your templates .env file. Falls back to the `ENVIO_API_TOKEN` environment variable



## `envio init contract-import`

Initialize Evm indexer by importing config from a contract for a given chain

**Usage:** `envio init contract-import [OPTIONS] [COMMAND]`

###### **Subcommands:**

* `explorer` — Initialize by pulling the contract ABI from a block explorer
* `local` — Initialize from a local json ABI file

###### **Options:**

* `-c`, `--contract-address <CONTRACT_ADDRESS>` — Contract address to generate the config from
* `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/chains
* `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract



## `envio init contract-import explorer`

Initialize by pulling the contract ABI from a block explorer

**Usage:** `envio init contract-import explorer [OPTIONS]`

###### **Options:**

* `-b`, `--blockchain <BLOCKCHAIN>` — Network to import the contract from

  Possible values: `abstract`, `amoy`, `arbitrum-nova`, `arbitrum-one`, `arbitrum-sepolia`, `arbitrum-testnet`, `aurora`, `aurora-testnet`, `avalanche`, `b2-testnet`, `base`, `base-sepolia`, `berachain`, `blast`, `blast-sepolia`, `boba`, `bsc`, `bsc-testnet`, `celo`, `celo-alfajores`, `celo-baklava`, `citrea-testnet`, `crab`, `curtis`, `ethereum-mainnet`, `evmos`, `fantom`, `fantom-testnet`, `fhenix-helium`, `flare`, `fraxtal`, `fuji`, `galadriel-devnet`, `gnosis`, `gnosis-chiado`, `goerli`, `harmony`, `holesky`, `hoodi`, `hyperliquid`, `kroma`, `linea`, `linea-sepolia`, `lisk`, `lukso`, `lukso-testnet`, `manta`, `mantle`, `mantle-testnet`, `megaeth-testnet2`, `metis`, `mode`, `mode-sepolia`, `monad`, `monad-testnet`, `moonbase-alpha`, `moonbeam`, `moonriver`, `morph`, `morph-testnet`, `neon-evm`, `opbnb`, `optimism`, `optimism-sepolia`, `plasma`, `poa-core`, `poa-sokol`, `polygon`, `polygon-zkevm`, `polygon-zkevm-testnet`, `rsk`, `saakuru`, `scroll`, `scroll-sepolia`, `sei`, `sei-testnet`, `sepolia`, `shimmer-evm`, `sonic`, `sonic-testnet`, `sophon`, `sophon-testnet`, `swell`, `taiko`, `tangle`, `unichain`, `unichain-sepolia`, `worldchain`, `xdc`, `xdc-testnet`, `zeta`, `zksync-era`, `zora`, `zora-sepolia`

* `--api-token <API_TOKEN>` — API token for the block explorer
* `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/chains
* `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract



## `envio init contract-import local`

Initialize from a local json ABI file

**Usage:** `envio init contract-import local [OPTIONS]`

###### **Options:**

* `-a`, `--abi-file <ABI_FILE>` — The path to a json abi file
* `--contract-name <CONTRACT_NAME>` — The name of the contract
* `-b`, `--blockchain <BLOCKCHAIN>` — Name or ID of the contract network
* `-r`, `--rpc-url <RPC_URL>` — The rpc url to use if the network id used is unsupported by our hypersync
* `-s`, `--start-block <START_BLOCK>` — The start block to use on this network
* `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/chains
* `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract



## `envio init template`

Initialize Evm indexer from an example template

**Usage:** `envio init template [OPTIONS]`

###### **Options:**

* `-t`, `--template <TEMPLATE>` — Name of the template to be used in initialization

  Possible values: `greeter`, `erc20`, `feature-external-calls`, `feature-factory`




## `envio init svm`

Initialization option for creating Svm indexer

**Usage:** `envio init svm [COMMAND]`

###### **Subcommands:**

* `template` — Initialize Svm indexer from an example template



## `envio init svm template`

Initialize Svm indexer from an example template

**Usage:** `envio init svm template [OPTIONS]`

###### **Options:**

* `-t`, `--template <TEMPLATE>` — Name of the template to be used in initialization

  Possible values: `feature-block-handler`




## `envio init fuel`

Initialization option for creating Fuel indexer

**Usage:** `envio init fuel [COMMAND]`

###### **Subcommands:**

* `contract-import` — Initialize Fuel indexer by importing config from a contract for a given chain
* `template` — Initialize Fuel indexer from an example template



## `envio init fuel contract-import`

Initialize Fuel indexer by importing config from a contract for a given chain

**Usage:** `envio init fuel contract-import [OPTIONS] [COMMAND]`

###### **Subcommands:**

* `local` — Initialize from a local json ABI file

###### **Options:**

* `-c`, `--contract-address <CONTRACT_ADDRESS>` — Contract address to generate the config from
* `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/chains
* `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract



## `envio init fuel contract-import local`

Initialize from a local json ABI file

**Usage:** `envio init fuel contract-import local [OPTIONS]`

###### **Options:**

* `-a`, `--abi-file <ABI_FILE>` — The path to a json abi file
* `--contract-name <CONTRACT_NAME>` — The name of the contract
* `-b`, `--blockchain <BLOCKCHAIN>` — Which Fuel network to use

  Possible values: `mainnet`, `testnet`

* `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/chains
* `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract



## `envio init fuel template`

Initialize Fuel indexer from an example template

**Usage:** `envio init fuel template [OPTIONS]`

###### **Options:**

* `-t`, `--template <TEMPLATE>` — Name of the template to be used in initialization

  Possible values: `greeter`




## `envio dev`

Development commands for starting, stopping, and restarting the indexer. Runs codegen automatically before launching

**Usage:** `envio dev [OPTIONS]`

###### **Options:**

* `-r`, `--restart` — Force restart: clear the database and re-index from scratch. Required when config/schema/ABI changes are incompatible with the existing indexer state



## `envio stop`

Stop the local environment - delete the database and stop all processes (including Docker) for the current directory

**Usage:** `envio stop`



## `envio codegen`

Generate indexing code from user-defined configuration & schema files

**Usage:** `envio codegen`



## `envio local`

Prepare local environment for envio testing

**Usage:** `envio local <COMMAND>`

###### **Subcommands:**

* `docker` — Local Envio environment commands
* `db-migrate` — Local Envio database commands



## `envio local docker`

Local Envio environment commands

**Usage:** `envio local docker <COMMAND>`

###### **Subcommands:**

* `up` — Start Docker containers (Postgres + Hasura) for local environment
* `down` — Stop and remove Docker containers for local environment



## `envio local docker up`

Start Docker containers (Postgres + Hasura) for local environment

**Usage:** `envio local docker up`



## `envio local docker down`

Stop and remove Docker containers for local environment

**Usage:** `envio local docker down`



## `envio local db-migrate`

Local Envio database commands

**Usage:** `envio local db-migrate <COMMAND>`

###### **Subcommands:**

* `up` — Migrate latest schema to database
* `down` — Drop database schema
* `setup` — Setup database by dropping schema and then running migrations



## `envio local db-migrate up`

Migrate latest schema to database

**Usage:** `envio local db-migrate up`



## `envio local db-migrate down`

Drop database schema

**Usage:** `envio local db-migrate down`



## `envio local db-migrate setup`

Setup database by dropping schema and then running migrations

**Usage:** `envio local db-migrate setup`



## `envio start`

Start the indexer. Runs codegen automatically before launching so the on-disk types stay in sync with `config.yaml` and `schema.graphql`

**Usage:** `envio start [OPTIONS]`

###### **Options:**

* `-r`, `--restart` — Clear your database and restart indexing from scratch



## `envio metrics`

Fetch raw Prometheus metrics from the running indexer's /metrics endpoint

**Usage:** `envio metrics [COMMAND]`

###### **Subcommands:**

* `runtime` — Fetch runtime metrics from the running indexer's /metrics/runtime endpoint



## `envio metrics runtime`

Fetch runtime metrics from the running indexer's /metrics/runtime endpoint

**Usage:** `envio metrics runtime`



## `envio skills`

Manage Envio-provided Claude Code skills under `.claude/skills/`

**Usage:** `envio skills <COMMAND>`

###### **Subcommands:**

* `update` — Re-extract every skill shipped by this CLI version, overwriting the matching directories under `<cwd>/.claude/skills/`. Skills not shipped by envio are left untouched



## `envio skills update`

Re-extract every skill shipped by this CLI version, overwriting the matching directories under `<cwd>/.claude/skills/`. Skills not shipped by envio are left untouched

**Usage:** `envio skills update`



## `envio tools`

Tools for people and AI agents (search-docs, fetch-docs). Run `envio tools help` for details

**Usage:** `envio tools <COMMAND>`

###### **Subcommands:**

* `search-docs` — Full-text search over Envio docs; prints matching titles, URLs, and snippets. Pair with `fetch-docs` to read a hit in full
* `fetch-docs` — Print the full markdown of a docs page by URL. Use a URL returned by `search-docs`



## `envio tools search-docs`

Full-text search over Envio docs; prints matching titles, URLs, and snippets. Pair with `fetch-docs` to read a hit in full

**Usage:** `envio tools search-docs <QUERY>`

###### **Arguments:**

* `<QUERY>` — The search query



## `envio tools fetch-docs`

Print the full markdown of a docs page by URL. Use a URL returned by `search-docs`

**Usage:** `envio tools fetch-docs <URL>`

###### **Arguments:**

* `<URL>` — The full URL of the documentation page to fetch



## `envio config`

Inspect the indexer config

**Usage:** `envio config <COMMAND>`

###### **Subcommands:**

* `view` — Print the resolved indexer config as JSON



## `envio config view`

Print the resolved indexer config as JSON

**Usage:** `envio config view`

## Command Reference Table

| Command                        | Description                   | Common Use Case                                  |
| ------------------------------ | ----------------------------- | ------------------------------------------------ |
| `envio init`                   | Create new indexer            | Starting a new project                           |
| `envio dev`                    | Run in development mode       | All local development                            |
| `envio dev -r`                 | Reset database and re-sync    | After incompatible config/schema/ABI changes     |
| `envio start`                  | Production-only entrypoint    | Envio Cloud / self-hosted production deployments |
| `envio stop`                   | Stop all processes            | Cleaning up environment                          |
| `envio codegen`                | Regenerate types in `.envio/` | After changing `config.yaml` or `schema.graphql` |
| `envio local docker up`        | Start Docker containers       | Setting up environment                           |
| `envio local db-migrate setup` | Initialize database           | Before first run                                 |
| `envio tools search-docs`      | Search the docs from the CLI  | Letting an AI agent find relevant documentation  |

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
