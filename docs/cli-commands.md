---
id: cli-commands
title: CLI Commands
sidebar_label: CLI Commands
slug: /cli-commands
---



# Command-Line Help for `envio`

This document contains the help content for the `envio` command-line program.

**Command Overview:**

* [`npx envio`↴](#envio)
* [`npx envio init`↴](#envio-init)
* [`npx envio codegen`↴](#envio-codegen)

## `npx envio`

**Usage:** ` npx envio <COMMAND>`

###### **Subcommands:**

* `init` — Initialize a project with a template
* `codegen` — Generate code from a `config.yaml` file



## `npx envio init`

Initialize a project with a template

**Usage:** `npx envio init [OPTIONS]`

###### **Options:**

* `-d`, `--directory <DIRECTORY>` — The directory of the project

  Default value: `./`
* `-t`, `--template <TEMPLATE>` — The file in the project containing config

  Possible values: `gravatar`

* `-f`, `--js-flavor <JS_FLAVOR>`

  Possible values: `javascript`, `typescript`, `rescript`




## `npx envio codegen`

Generate code from a `config.yaml` file

**Usage:** `npx envio codegen [OPTIONS]`

###### **Options:**

* `-d`, `--directory <DIRECTORY>` — The directory of the project

  Default value: `./`
* `-o`, `--output-directory <OUTPUT_DIRECTORY>` — The directory within the project that generated code should output to

  Default value: `generated/`
* `-c`, `--config <CONFIG>` — The file in the project containing config

  Default value: `config.yaml`


---