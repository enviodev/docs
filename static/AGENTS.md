# Envio for AI coding agents

> Envio is a real-time multichain blockchain indexer. Index, query, and stream onchain data across any EVM chain, plus Solana and Fuel.

This file helps AI coding assistants build with Envio using these docs. For the full documentation in one file, read [llms-full.txt](https://docs.envio.dev/llms-full.txt); for a shorter index, read [llms.txt](https://docs.envio.dev/llms.txt).

## Prerequisites

- **Node.js** v22 or newer.
- **pnpm** (recommended). Prefix any Envio command with `pnpx` to run it without a global install, for example `pnpx envio init`.
- **Docker Desktop** — required only to run an indexer locally. Not needed if you deploy to Envio Cloud.

## Build an indexer

Most projects use **HyperIndex**, our multichain indexing framework. Index contract events with custom handlers written in TypeScript, JavaScript, or ReScript, and serve the result as a GraphQL API. Historical backfill and live events run in one pipeline, with automatic reorg handling and factory contract support.

1. Follow the [Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai) for an end-to-end walkthrough with an assistant such as Claude Code or Cursor.
2. Scaffold a project with `pnpx envio init` from a contract address, ABI, or template. See [contract import](https://docs.envio.dev/docs/HyperIndex/contract-import).
3. Define your data model in `schema.graphql` and your event logic in the handlers, wired together by `config.yaml`. See the [schema](https://docs.envio.dev/docs/HyperIndex/schema), [configuration file](https://docs.envio.dev/docs/HyperIndex/configuration-file), and [event handlers](https://docs.envio.dev/docs/HyperIndex/event-handlers) guides.
4. Run `pnpx envio dev` to start the indexer locally with hot reloading. Run `pnpx envio codegen` on its own to regenerate types after editing `config.yaml` or `schema.graphql`.
5. Query your indexed data through the generated GraphQL API. See [querying with Hasura](https://docs.envio.dev/docs/HyperIndex/navigating-hasura).
6. Test your handlers with the [testing framework](https://docs.envio.dev/docs/HyperIndex/testing).

Indexing a non-EVM chain? See the [Solana](https://docs.envio.dev/docs/HyperIndex/solana) and [Fuel](https://docs.envio.dev/docs/HyperIndex/fuel) guides.

Migrating from The Graph, Ponder, Subsquid, or Alchemy? Start with the [migration guide](https://docs.envio.dev/docs/HyperIndex/migration-guide).

## MCP server

Connect MCP-compatible clients such as Claude Code or Cursor to the [docs MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server) at `https://docs.envio.dev/mcp` to search and fetch these docs directly.

## Key CLI commands

- `envio init` scaffolds a new indexer from a contract address, ABI, or template.
- `envio dev` runs the indexer locally with hot reloading.
- `envio codegen` regenerates types from `config.yaml` and `schema.graphql`.
- `envio start` is the production entrypoint used by Envio Cloud and self-hosted deployments.

For the full command reference, see the [Envio CLI docs](https://docs.envio.dev/docs/HyperIndex/cli-commands).

## Other products

- **HyperSync** is our high-performance data engine that replaces traditional JSON-RPC, with client libraries in Python, Rust, Node.js, and Go. See the [HyperSync overview](https://docs.envio.dev/docs/HyperSync/overview).
- **HyperRPC** is a read-only JSON-RPC endpoint powered by HyperSync. See the [HyperRPC overview](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc).
- **Envio Cloud** is our fully managed hosting for HyperIndex indexers, with git-based deploys, monitoring, and alerting. See the [Envio Cloud guide](https://docs.envio.dev/docs/HyperIndex/hosted-service).

## Links

- Docs https://docs.envio.dev
- Website https://envio.dev
- Pricing https://envio.dev/pricing and machine-readable [pricing.md](https://envio.dev/pricing.md)
- Supported chains https://envio.dev/chains
- GitHub https://github.com/enviodev
