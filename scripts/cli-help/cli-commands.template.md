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
    - The curated prose below (intro + Getting Started) lives in this template
      and is safe to edit.
    - The command overview and per-command reference are injected at the
      ENVIO_CLI_HELP marker (further down this file) from hyperindex's
      packages/cli/CommandLineHelp.md, so they always match the real CLI.
      Re-run `yarn update-cli-help` to refresh.
-->

# Envio Command Line Interface

This comprehensive reference guide covers all available commands and options in the Envio CLI tool for HyperIndex **V3**. Use this documentation to explore the full capabilities of the `envio` command and its subcommands for managing your blockchain indexing projects.

:::tip Envio Cloud CLI
Looking to manage your hosted indexers from the command line? See the **[Envio Cloud CLI](/docs/HyperIndex/envio-cloud-cli)** for deployment, monitoring, and management commands for Envio Cloud.
:::

## Getting Started

The Envio CLI provides a powerful set of tools for creating, developing, and managing your blockchain indexers. Whether you're starting a new project, running a development server, or deploying to production, the CLI offers commands to simplify and automate your workflow.

The fastest way to get going is `pnpx envio init`, which scaffolds a project interactively. From there, `envio dev` runs your indexer locally while you iterate, and `envio start` runs it in production.

<!-- ENVIO_CLI_HELP -->
