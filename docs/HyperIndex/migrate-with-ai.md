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

```xml
<context>
This monorepo contains two indexers:
- `my-subgraph/` — an existing Graph Protocol subgraph indexer (source of truth)
- `my-hyperindex-indexer/` — a HyperIndex boilerplate scaffolded from the same
  contracts (migration target)
</context>

<task>
Migrate the subgraph indexer to a fully working HyperIndex indexer.
Follow these phases in order:

Phase 1 — Plan
- Produce a migration plan mapping each subgraph component to its HyperIndex
  equivalent.
- Flag anything that has no direct equivalent and propose a workaround.
- Do NOT write code yet.

Phase 2 — Implement
- Migrate the entire subgraph following the plan and skill guides.
- Process one handler file at a time.
- After each file, run `pnpm envio codegen` to validate, and verify it against
  the migration checklist before moving on.

Phase 3 — Verify
- Walk through every checklist item from the migration skill and confirm it
  passes.
- Run any available build or type check commands.
- List any items you could not complete and why.
</task>

<rules>
- Only modify files in `my-hyperindex-indexer/`. Do not change the subgraph repo.
- Preserve all entity fields and event mappings from the subgraph.
- Do not skip or summarize checklist items — execute every one.
- If you are uncertain about a migration decision, pause and ask me.
</rules>
```

:::tip
- After migration, run `pnpm dev` to verify the indexer runs correctly
- Use the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) to compare outputs between your subgraph and the new HyperIndex indexer
:::

## Manual Migration

For a detailed manual migration guide covering the step by step conversion of subgraph.yaml, schema, and event handlers, see [Migrate from The Graph](./migration-guide).
