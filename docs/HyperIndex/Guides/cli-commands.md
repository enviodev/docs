---
id: cli-commands
title: Envio CLI
sidebar_label: Envio CLI
slug: /cli-commands
---

# Command-Line Help for `envio`

This document contains the help content for the `envio` command-line program.

**Command Overview:**

* [`envio`↴](#envio)
* [`pnpx envio@latest init`↴](#envio-init)
* [`pnpx envio@latest init template`↴](#envio-init-template)
* [`pnpx envio@latest init contract-import`↴](#envio-init-contract-import)
* [`pnpx envio@latest init contract-import explorer`↴](#envio-init-contract-import-explorer)
* [`pnpx envio@latest init contract-import local`↴](#envio-init-contract-import-local)
* [`pnpx envio@latest init fuel`↴](#envio-init-fuel)
* [`pnpx envio@latest init fuel template`↴](#envio-init-fuel-template)
* [`pnpx envio@latest init fuel contract-import`↴](#envio-init-fuel-contract-import)
* [`pnpx envio@latest init fuel contract-import local`↴](#envio-init-fuel-contract-import-local)
* [`pnpm envio dev`↴](#envio-dev)
* [`pnpm envio stop`↴](#envio-stop)
* [`pnpm envio codegen`↴](#envio-codegen)
* [`pnpm envio local`↴](#envio-local)
* [`pnpm envio local docker`↴](#envio-local-docker)
* [`pnpm envio local docker up`↴](#envio-local-docker-up)
* [`pnpm envio local docker down`↴](#envio-local-docker-down)
* [`pnpm envio local db-migrate`↴](#envio-local-db-migrate)
* [`pnpm envio local db-migrate up`↴](#envio-local-db-migrate-up)
* [`pnpm envio local db-migrate down`↴](#envio-local-db-migrate-down)
* [`pnpm envio local db-migrate setup`↴](#envio-local-db-migrate-setup)
* [`pnpm envio start`↴](#envio-start)

## `envio`

**Usage:** `envio [OPTIONS] <COMMAND>`

###### **Subcommands:**

* `init` — Initialize an indexer with one of the initialization options
* `dev` — Development commands for starting, stopping, and restarting the indexer with automatic codegen for any changed files
* `stop` — Stop the local environment - delete the database and stop all processes (including Docker) for the current directory
* `codegen` — Generate indexing code from user-defined configuration & schema files
* `local` — Prepare local environment for envio testing
* `start` — Start the indexer without any automatic codegen

###### **Options:**

* `-d`, `--directory <DIRECTORY>` — The directory of the project. Defaults to current dir ("./")
* `-o`, `--output-directory <OUTPUT_DIRECTORY>` — The directory within the project that generated code should output to

  Default value: `generated`
* `--config <CONFIG>` — The file in the project containing config

  Default value: `config.yaml`



## `pnpx envio@latest init`

Initialize an indexer with one of the initialization options

**Usage:** `pnpx envio@latest init [OPTIONS] [COMMAND]`

###### **Subcommands:**

* `template` — Initialize Evm indexer from an example template
* `contract-import` — Initialize Evm indexer by importing config from a contract for a given chain
* `fuel` — Initialization option for creating Fuel indexer

###### **Options:**

* `-n`, `--name <NAME>` — The name of your project
* `-l`, `--language <LANGUAGE>` — The language used to write handlers

  Possible values: `javascript`, `typescript`, `rescript`

* `--api-token <API_TOKEN>` — The hypersync API key to be initialized in your templates .env file



## `pnpx envio@latest init template`

Initialize Evm indexer from an example template

**Usage:** `pnpx envio@latest init template [OPTIONS]`

###### **Options:**

* `-t`, `--template <TEMPLATE>` — Name of the template to be used in initialization

  Possible values: `greeter`, `erc20`




## `pnpx envio@latest init contract-import`

Initialize Evm indexer by importing config from a contract for a given chain

**Usage:** `pnpx envio@latest init contract-import [OPTIONS] [COMMAND]`

###### **Subcommands:**

* `explorer` — Initialize by pulling the contract ABI from a block explorer
* `local` — Initialize from a local json ABI file

###### **Options:**

* `-c`, `--contract-address <CONTRACT_ADDRESS>` — Contract address to generate the config from
* `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/networks
* `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract



## `pnpx envio@latest init contract-import explorer`

Initialize by pulling the contract ABI from a block explorer

**Usage:** `pnpx envio@latest init contract-import explorer [OPTIONS]`

###### **Options:**

* `-b`, `--blockchain <BLOCKCHAIN>` — Network from which contract address should be fetched for migration

  Possible values: `ethereum-mainnet`, `goerli`, `optimism`, `base`, `base-sepolia`, `bsc`, `gnosis`, `fantom`, `polygon`, `optimism-goerli`, `optimism-sepolia`, `moonbeam`, `arbitrum-one`, `arbitrum-nova`, `arbitrum-goerli`, `arbitrum-sepolia`, `celo`, `fuji`, `avalanche`, `mumbai`, `sepolia`, `linea`, `polygon-zkevm`, `scroll`, `kroma`, `holesky`, `blast`, `blast-sepolia`, `amoy`




## `pnpx envio@latest init contract-import local`

Initialize from a local json ABI file

**Usage:** `pnpx envio@latest init contract-import local [OPTIONS]`

###### **Options:**

* `-a`, `--abi-file <ABI_FILE>` — The path to a json abi file
* `--contract-name <CONTRACT_NAME>` — The name of the contract
* `-b`, `--blockchain <BLOCKCHAIN>` — Network from which contract address should be fetched for migration
* `-r`, `--rpc-url <RPC_URL>` — The rpc url to use if the network id used is unsupported by our hypersync



## `pnpx envio@latest init fuel`

Initialization option for creating Fuel indexer

**Usage:** `pnpx envio@latest init fuel [COMMAND]`

###### **Subcommands:**

* `template` — Initialize Fuel indexer from an example template
* `contract-import` — Initialize Fuel indexer by importing config from a contract for a given chain



## `pnpx envio@latest init fuel template`

Initialize Fuel indexer from an example template

**Usage:** `pnpx envio@latest init fuel template [OPTIONS]`

###### **Options:**

* `-t`, `--template <TEMPLATE>` — Name of the template to be used in initialization

  Possible values: `greeter`




## `pnpx envio@latest init fuel contract-import`

Initialize Fuel indexer by importing config from a contract for a given chain

**Usage:** `pnpx envio@latest init fuel contract-import [OPTIONS] [COMMAND]`

###### **Subcommands:**

* `local` — Initialize from a local json ABI file

###### **Options:**

* `-c`, `--contract-address <CONTRACT_ADDRESS>` — Contract address to generate the config from
* `--single-contract` — If selected, prompt will not ask for additional contracts/addresses/networks
* `--all-events` — If selected, prompt will not ask to confirm selection of events on a contract



## `pnpx envio@latest init fuel contract-import local`

Initialize from a local json ABI file

**Usage:** `pnpx envio@latest init fuel contract-import local [OPTIONS]`

###### **Options:**

* `-a`, `--abi-file <ABI_FILE>` — The path to a json abi file
* `--contract-name <CONTRACT_NAME>` — The name of the contract



## `pnpm envio dev`

Development commands for starting, stopping, and restarting the indexer with automatic codegen for any changed files

**Usage:** `pnpm envio dev`



## `pnpm envio stop`

Stop the local environment - delete the database and stop all processes (including Docker) for the current directory

**Usage:** `pnpm envio stop`



## `pnpm envio codegen`

Generate indexing code from user-defined configuration & schema files

**Usage:** `pnpm envio codegen`



## `pnpm envio local`

Prepare local environment for envio testing

**Usage:** `pnpm envio local <COMMAND>`

###### **Subcommands:**

* `docker` — Local Envio and ganache environment commands
* `db-migrate` — Local Envio database commands



## `pnpm envio local docker`

Local Envio and ganache environment commands

**Usage:** `pnpm envio local docker <COMMAND>`

###### **Subcommands:**

* `up` — Create docker images required for local environment
* `down` — Delete existing docker images on local environment



## `pnpm envio local docker up`

Create docker images required for local environment

**Usage:** `pnpm envio local docker up`



## `pnpm envio local docker down`

Delete existing docker images on local environment

**Usage:** `pnpm envio local docker down`



## `pnpm envio local db-migrate`

Local Envio database commands

**Usage:** `pnpm envio local db-migrate <COMMAND>`

###### **Subcommands:**

* `up` — Migrate latest schema to database
* `down` — Drop database schema
* `setup` — Setup database by dropping schema and then running migrations



## `pnpm envio local db-migrate up`

Migrate latest schema to database

**Usage:** `pnpm envio local db-migrate up`



## `pnpm envio local db-migrate down`

Drop database schema

**Usage:** `pnpm envio local db-migrate down`



## `pnpm envio local db-migrate setup`

Setup database by dropping schema and then running migrations

**Usage:** `pnpm envio local db-migrate setup`



## `pnpm envio start`

Start the indexer without any automatic codegen

**Usage:** `pnpm envio start [OPTIONS]`

###### **Options:**

* `-r`, `--restart` — Clear your database and restart indexing from scratch




