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
* [`envio init`↴](#envio-init)
* [`envio dev`↴](#envio-dev)
* [`envio dev restart`↴](#envio-dev-restart)
* [`envio dev stop`↴](#envio-dev-stop)
* [`envio codegen`↴](#envio-codegen)
* [`envio start`↴](#envio-start)

## `envio`

**Usage:** `envio <COMMAND>`

###### **Subcommands:**

* `init` — Initialize a project with a template
* `dev` — Development commands for starting, stopping, and restarting the local environment
* `codegen` — Generate code from a config.yaml & schema.graphql file
* `start` — Start the indexer



## `envio init`

Initialize a project with a template

**Usage:** `envio init [OPTIONS]`

###### **Options:**

* `-d`, `--directory <DIRECTORY>` — The directory of the project
* `-n`, `--name <NAME>`
* `-t`, `--template <TEMPLATE>` — The file in the project containing config

  Possible values: `blank`, `greeter`, `erc20`

* `-s`, `--subgraph-migration <SUBGRAPH_MIGRATION>` — Subgraph ID to start a migration from
* `-l`, `--language <LANGUAGE>`

  Possible values: `javascript`, `typescript`, `rescript`




## `envio dev`

Development commands for starting, stopping, and restarting the local environment

**Usage:** `envio dev [COMMAND]`

###### **Subcommands:**

* `restart` — Restart and resync the local dev environment from scratch
* `stop` — Delete the database and stop all processes



## `envio dev restart`

Restart and resync the local dev environment from scratch

**Usage:** `envio dev restart`



## `envio dev stop`

Delete the database and stop all processes

**Usage:** `envio dev stop`



## `envio codegen`

Generate code from a config.yaml & schema.graphql file

**Usage:** `envio codegen [OPTIONS]`

###### **Options:**

* `-d`, `--directory <DIRECTORY>` — The directory of the project

  Default value: `.`
* `-o`, `--output-directory <OUTPUT_DIRECTORY>` — The directory within the project that generated code should output to

  Default value: `generated/`
* `-c`, `--config <CONFIG>` — The file in the project containing config

  Default value: `config.yaml`



## `envio start`

Start the indexer

**Usage:** `envio start [OPTIONS]`

###### **Options:**

* `-r`, `--restart` — Clear your database and restart indexing from scratch

  Default value: `false`
* `-d`, `--directory <DIRECTORY>` — The directory of the project

  Default value: `.`


