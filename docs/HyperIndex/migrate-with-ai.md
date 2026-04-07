---
id: migrate-with-ai
title: How to Migrate Using AI
sidebar_label: Migrate Using AI
slug: /migrate-with-ai
description: Use Claude Code with built-in HyperIndex skills to automatically migrate your subgraph to Envio HyperIndex.
---

# How to Migrate Using AI

HyperIndex v3 includes built-in Claude skills that guide Claude Code through the entire subgraph migration process, from understanding your subgraph logic to converting handlers and running quality checks. This is the recommended way to migrate complex subgraphs.

## Prerequisites

- Claude Code installed
- pnpm installed
- HyperIndex v3 (Claude skills are only available in v3)

## Step 1: Initialize a Boilerplate HyperIndex Indexer

Create a new HyperIndex indexer that indexes the same contracts and events as the subgraph you are migrating. Run the following in a new directory:

```bash
pnpx envio init
```

Follow the CLI prompts to set up the boilerplate indexer with the same contracts and events as your existing subgraph.

:::caution
The Claude migration skills are only available in HyperIndex v3. If the latest stable version is not v3, you need to specify a v3 version explicitly:

```bash
pnpx envio@3.0.0-alpha.21 init
```

Replace `3.0.0-alpha.21` with the latest available v3 version. You can find the latest releases [here](https://github.com/enviodev/hyperindex/releases).
:::

## Step 2: Set Up a Monorepo Structure

Create a parent directory that contains both your new HyperIndex boilerplate indexer and the existing subgraph repo you want to migrate:

```
my-migration/
├── my-subgraph/          # Your existing subgraph repo
└── my-hyperindex-indexer/ # The boilerplate HyperIndex indexer from Step 1
```

This structure gives Claude Code visibility into both projects so it can read and understand your subgraph logic while writing the HyperIndex implementation.

## Step 3: Run Claude Code

Open Claude Code in the monorepo root directory and provide a prompt like the following (replace the repo names with your own):

```
In this repo I have a subgraph indexer in `my-subgraph/` which I would like
to migrate to a HyperIndex indexer. I've created a HyperIndex boilerplate
indexer using the same contracts in `my-hyperindex-indexer/`.

There are Claude skills available in `.claude/skills/` which explain patterns
and best practices for HyperIndex. Specifically, there is a subgraph migration
skill with step-by-step migration guides, common migration patterns, quality
checks, and a migration checklist.

Please follow the subgraph migration skills step-by-step to completely migrate
the subgraph indexer to HyperIndex. Work slowly and methodically, ensuring all
checks are made and all migration patterns are followed correctly. Start by
reviewing the subgraph repo to understand its logic, then review the HyperIndex
repo and the migration skills, and then begin the migration.
```

:::tip
- Claude will automatically discover and use the `.claude/skills/` directory in the HyperIndex project
- We recommend reviewing Claude's plan before it begins implementation
- After migration, run `pnpm dev` to verify the indexer runs correctly
- Use the Indexer Migration Validator to compare outputs between your subgraph and the new HyperIndex indexer
:::

## Manual Migration

For a detailed manual migration guide covering the step by step conversion of `subgraph.yaml`, schema, and event handlers, see [Migrate from The Graph](./migration-guide).
