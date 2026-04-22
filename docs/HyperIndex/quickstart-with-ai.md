---
id: quickstart-with-ai
title: Quickstart with AI
sidebar_label: Quickstart with AI
slug: /quickstart-with-ai
description: Build an Envio HyperIndex indexer with an AI coding assistant using the Envio docs MCP server, non-interactive init flags, the envio-cloud CLI, and the built-in Claude skills in HyperIndex v3.
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

:::info HyperIndex v3
Some features below (notably the **built-in Claude skills**) ship with **HyperIndex v3**, which will be released soon. Until v3 is the default stable release, pin to a v3 version explicitly (e.g. `pnpx envio@3.0.0-alpha.21 ...`). See the [v3 migration guide](./migrate-to-v3) for the latest alpha version.
:::

---

## Step 1. Give the Assistant Access to the Envio Docs (MCP)

Envio ships a [Model Context Protocol](./mcp-server) server so your AI assistant can search and read Envio documentation directly instead of guessing from stale training data.

**Claude Code:**

```bash
claude mcp add --transport http envio-docs https://docs.envio.dev/mcp
```

**Cursor / VS Code / other MCP clients**, add the endpoint to your MCP config:

```json
{
  "mcpServers": {
    "envio-docs": {
      "url": "https://docs.envio.dev/mcp"
    }
  }
}
```

Full setup details in the [MCP Server guide](./mcp-server). If your assistant doesn't support MCP, you can still point it at the [LLM-friendly docs bundle](/docs/HyperIndex-LLM/hyperindex-complete).

---

## Step 2. Initialize the Indexer Non-Interactively

`pnpx envio init` normally walks you through an interactive wizard. When an AI assistant is driving the terminal, it's much easier to skip the prompts with flags so the assistant can run the command end-to-end without blocking on human input.

### Option A: Start from a template

```bash
pnpx envio init template \
  -t erc20 \
  -l typescript \
  -d ./working-indexer \
  --api-token ""
```

### Option B: Import a verified contract from an explorer

```bash
pnpx envio init contract-import explorer \
  -n usdc-indexer \
  -c 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 \
  -b ethereum-mainnet \
  --single-contract \
  --all-events \
  -l typescript \
  -d usdc-indexer
```

All `init` subcommands and flags are documented in the [Envio CLI reference](./cli-commands).

### About the `--api-token` flag

`--api-token` is the flag for your **HyperSync API token**. Passing it (even as an empty string, as in Option A above) skips the interactive prompt so the assistant can run `init` unattended. A few things to know:

- The token **can't currently be created programmatically**. You generate one by logging in to [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) and copying it into `ENVIO_API_TOKEN` in your indexer's `.env`.
- It's **only required for local development and self-hosted deployments**. Indexers running on **Envio Cloud** get special access and don't need a custom token.
- If you passed `--api-token ""` during init and want to run `pnpm dev` locally, generate a token from the link above and set `ENVIO_API_TOKEN` in `.env` before starting the indexer.

See [API Tokens](/docs/HyperSync/api-tokens) and [Environment Variables](./environment-variables) for full details.

---

## Step 3. Develop with the Built-in Claude Skills

HyperIndex v3 ships with **Claude skills** that teach AI assistants how HyperIndex works: config, schema, handlers, loaders, dynamic contracts, testing, and migration checklists. When an assistant is attached to a v3 project, it can read these skills directly instead of inventing patterns.

A productive loop with skills + the docs MCP looks like:

1. Describe the behavior you want in plain English.
2. Let the assistant edit `config.yaml`, `schema.graphql`, and `src/EventHandlers.*`.
3. Ask it to run `pnpm envio codegen` and `pnpm dev` to validate.
4. Iterate on failures together.

The three files you'll spend most of your time in:

- **[`config.yaml`](./configuration-file)**: networks, contracts, events
- **[`schema.graphql`](./schema)**: entities and relationships
- **[`src/EventHandlers.*`](./event-handlers)**: per-event logic

---

## Step 4. Migrating an Existing Indexer

If you're porting from The Graph, Ponder, or another indexing framework, start with the AI migration workflow. It scales much better than hand-editing handlers.

- **[Migrate Using AI](./migrate-with-ai)**: the recommended assistant-driven flow. It's written around subgraphs, but the same **monorepo-plus-phased-prompt** pattern works for **Ponder** and other frameworks. Point the assistant at the source project plus a freshly scaffolded HyperIndex indexer and let the skills guide it.
- [Migrate from The Graph (manual)](./migration-guide)
- [Migrate from Ponder](./migrate-from-ponder)
- [Migrate from Alchemy](./migrate-from-alchemy)

---

## Step 5. Deploy Programmatically with `envio-cloud`

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
- [Migrate Using AI](./migrate-with-ai)
- [HyperIndex v3 migration](./migrate-to-v3)
