---
id: quickstart-with-ai
title: Quickstart with AI
sidebar_label: Quickstart with AI
slug: /quickstart-with-ai
description: Build an Envio HyperIndex indexer with an AI coding assistant using the Envio CLI, the envio-cloud CLI, and the built-in Claude skills in HyperIndex v3.
image: /docs-assets/og/HyperIndex/quickstart-with-ai.png
---

Build an Envio HyperIndex indexer end-to-end with an AI coding assistant.

Most developers now reach for an AI coding assistant before they open a file. This guide walks through an AI-centric flow for creating, developing, and deploying a HyperIndex indexer. It is semi-generic, so any capable AI coding assistant (Cursor, Windsurf, Copilot Agent, Continue, etc.) will work. That said, **we've seen the best results with [Claude Code](https://claude.com/claude-code)** and recommend starting there.

:::tip Prefer the interactive flow?
If you'd rather drive the CLI yourself, see [Getting Started](./getting-started) and the [Quickstart](./contract-import).
:::

---

## Prerequisites

- **[Node.js](https://nodejs.org/en/download/current)** _(v22 or newer)_
- **[pnpm](https://pnpm.io/installation)** _(v8 or newer)_
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** _(only needed to run the indexer locally)_
- An AI coding assistant (we recommend **[Claude Code](https://claude.com/claude-code)**)

---

## Step 1. Initialize The Indexer

Open Claude/Cursor/Codex and prompt:

```bash
pnpx envio@2 init
```

AI will automatically be provided with the commands to run next and the additional tools the Envio CLI provides. You will be automatically asked additional questions by your AI tool to achieve the desired result.

All `init` subcommands and flags are documented in the [Envio CLI reference](./cli-commands).

### About Envio API Token

The **Envio API token** is your **HyperSync API token**. A few things to know:

- The token **can't currently be created programmatically**. You generate one by logging in to [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) and copying it into `ENVIO_API_TOKEN` in your indexer's `.env`.
- It's **only required for local development and self-hosted deployments**. Indexers running on **Envio Cloud** get special access and don't need a custom token.
- It's **required when using Envio as the data provider (HyperSync)**. If you only use an external RPC as the data source, no token is needed — you can pass an empty string to skip the prompt.
- To run `pnpm dev` locally, generate a token from the link above and set `ENVIO_API_TOKEN` in `.env` before starting the indexer.

See [API Tokens](/docs/HyperSync/api-tokens) and [Environment Variables](./environment-variables) for full details.

---

## Step 2. Develop with the Built-in Claude Skills

HyperIndex v3 ships with **Claude skills** that teach AI assistants how HyperIndex works: config, schema, handlers, loaders, dynamic contracts, testing, and migration checklists. When an assistant is attached to a v3 project, it can read these skills directly instead of inventing patterns.

A productive loop with the skills looks like:

1. Describe the behavior you want in plain English.
2. Let the assistant edit `config.yaml`, `schema.graphql`, and `src/EventHandlers.*`.
3. Have it follow a test-driven loop: write a failing test, implement the handler, then run `pnpm test` to validate. See the [Testing guide](./testing) for the full TDD workflow.
4. Iterate on failures together.

The three files your agent will spend most of its time in:

- **[`config.yaml`](./configuration-file)**: networks, contracts, events
- **[`schema.graphql`](./schema)**: entities and relationships
- **[`src/EventHandlers.*`](./event-handlers)**: per-event logic

---

## Step 3. Migrating an Existing Indexer

If you're porting from The Graph, Ponder, or another indexing framework, start with the AI migration workflow. It scales much better than hand-editing handlers.

- **[Migrate Using AI](/docs/HyperIndex/migrate-with-ai)**: the recommended assistant-driven flow. It's written around subgraphs, but the same **monorepo-plus-phased-prompt** pattern works for **Ponder** and other frameworks. Point the assistant at the source project plus a freshly scaffolded HyperIndex indexer and let the skills guide it.
- [Migrate from The Graph (manual)](/docs/HyperIndex/migration-guide)
- [Migrate from Ponder](/docs/HyperIndex/migrate-from-ponder)
- [Migrate from Alchemy](/docs/HyperIndex/migrate-from-alchemy)

---

## Step 4. Deploy Programmatically with `envio-cloud`

Once your indexer runs locally, the [`envio-cloud` CLI](./envio-cloud-cli) lets an assistant (or a CI job) deploy and manage the hosted indexer without opening the dashboard.

```bash
npm install -g envio-cloud

envio-cloud login --token $ENVIO_GITHUB_TOKEN
envio-cloud indexer add --name my-indexer --repo my-repo
envio-cloud deployment status my-indexer <commit> --watch-till-synced
envio-cloud deployment logs my-indexer <commit> --follow
```

Every command supports `-o json`, which makes it easy for assistants and scripts to parse results. Full reference: [Envio Cloud CLI](./envio-cloud-cli).

---

## Related Resources

- [MCP Server](./mcp-server)
- [LLM-friendly docs bundle](/docs/HyperIndex-LLM/hyperindex-complete)
- [Envio CLI reference](./cli-commands)
- [Envio Cloud CLI](./envio-cloud-cli)
- [Migrate Using AI](/docs/HyperIndex/migrate-with-ai)
- [HyperIndex v3 migration](/docs/HyperIndex/migrate-to-v3)
