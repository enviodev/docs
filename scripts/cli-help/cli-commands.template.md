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

<!-- ENVIO_CLI_HELP -->

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
