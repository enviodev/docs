---
title: Why AI Agents Acting Onchain Need an Indexer
sidebar_label: Why AI Agents Acting Onchain Need an Indexer
slug: /ai-agents-acting-onchain-indexer
tags: ["ai"]
description: "AI agents that act onchain need reorg-safe, queryable data they can act on. HyperIndex delivers it. Real MCP server, real Claude skills, 400k events in 20 seconds."
image: /blog-assets/ai-agents-acting-onchain-indexer.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-05-14
  author: Jordyn Laurier
---

<img src="/blog-assets/ai-agents-acting-onchain-indexer.png" alt="Envio blog cover: 'Why AI Agents Need an Indexer' with subtitle 'The data layer for onchain agents'" width="100%"/>

<!--truncate-->

:::note TL;DR

- HyperIndex is Envio's multichain blockchain indexing framework for EVM chains. It is the right data layer for AI agents acting onchain because it ships reorg-safe data, structured GraphQL output, an MCP server that exposes the docs to any agent, and a `.claude/skills/` directory that auto-discovers for Cursor, Claude Code, and Codex.
- The published [agentic demo](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex) documents an end-to-end flow where an agent scaffolded, configured, pushed to GitHub, and deployed a wstETH indexer on Monad Mainnet from a single prompt. 400,000 events indexed in approximately 20 seconds.
- The Envio docs MCP server exposes two tools (`docs_search` and `docs_fetch`) over Streamable HTTP at `https://docs.envio.dev/mcp`. Configured into Claude Code, Cursor, or VS Code with one command.
- HyperIndex projects scaffold a `.claude/skills/` directory pre-populated with 14 skills covering config, schema, handler syntax, factory patterns, filters, multichain, performance, traces, transactions, wildcard, blocks, external calls (the Effect API), testing, and subgraph migration.

:::

The agentic-onchain conversation in 2026 has settled into two camps. One says agents need a reconciled SQL warehouse to make sense of raw blockchain data. The other says agents need a programmable indexer that lets them act, not just analyse. Both are right about the diagnosis. Raw RPC is unworkable for an agent. The disagreement is about what replaces it.

This blog is the case for indexers, not warehouses. A SQL warehouse lets an agent ask questions. An indexing framework lets an agent build, deploy, and own new data pipelines mid-session. The first is a query tool, the second is infrastructure. Agents acting onchain need the second. HyperIndex ships it today.

## Why Raw Blockchain Data Breaks Agents

An agent reading from RPC directly hits four problems within minutes.

**1. Reorgs.** A recent block can be reorged. An agent that wrote a record based on an unfinalized block has to either lag the chain head (and miss real-time signals) or roll its own rollback logic (and get it wrong on the next edge case). Neither is acceptable for an agent running in a production environment.

**2. Schema.** RPC returns logs and transactions. It does not return entities, relationships, or aggregations. The agent has to assemble the schema in memory on every query. Cross-contract state, factory pattern instances, and anything time-windowed have to be rebuilt from scratch.

**3. Throughput.** An agent that wants to know the last 1,000 trades on a market has to issue 1,000 `eth_getLogs` calls or hand-tune a paginated request. A historical sweep across a year of activity can take hours to query from RPC.

**4. Multichain.** Most agents that matter operate across at least two chains. Each chain is a separate RPC, separate quirks, separate rate limits. The application code that joins those RPCs is exactly the indexing code an indexer would write for you.

The standard response to "raw RPC is unworkable for agents" is to put a SQL warehouse in front of it. That works for read-only analytical queries. It does not work for an agent that needs to spin up a new product on top of the data within a session.

## What HyperIndex Provides Instead

HyperIndex addresses all four problems by being a blockchain indexing framework rather than a query layer.

- **Reorg safety at the framework level.** Entity state history, automatic rollback, no reorg logic required in handlers. Learn more in [Indexing and Reorgs](https://docs.envio.dev/blog/indexing-and-reorgs).
- **Structured GraphQL output.** Entities, relationships, aggregations, time-windowed views, all queryable from one endpoint. Agents read GraphQL, not raw logs.
- **HyperSync historical throughput.** Up to 2,000x faster than RPC. The Polymarket reference indexer synced its first 4,000,000,000 events in 6 days and has indexed over 6,500,000,000 to date.
- **Multichain in one config.** <HyperSyncChainCount /> have native HyperSync coverage, any EVM chain accessible via standard RPC, all in a single `config.yaml`.

That is the read side. The act side is what makes HyperIndex an agent's infrastructure, not just an agent's data layer.

## The Three Things That Make It Programmable for Agents

### 1. The Envio Docs MCP Server

The [docs MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server) exposes the entire Envio docs site as two MCP tools:

- `docs_search` for semantic search across the docs
- `docs_fetch` to retrieve a docs page by ID

Endpoint: `https://docs.envio.dev/mcp`. Transport: Streamable HTTP.

Setup is one command for Claude Code:

```bash
claude mcp add --transport http envio-docs https://docs.envio.dev/mcp
```

Cursor and VS Code use the JSON config form on the same page. Once added, every agent session in that workspace grounds its answers about HyperIndex in the live docs rather than stale training data.

This matters because agents writing indexer code typically hallucinate APIs that do not exist. The MCP server gives the agent a fresh source of truth on every request, so it cites real HyperIndex syntax instead of guessing.

### 2. Auto-Discovered Skills in `.claude/skills/`

When a HyperIndex project is initialised, it scaffolds a `.claude/skills/` directory pre-populated with skill definitions. Cursor, Claude Code, and Codex all auto-discover skills from this directory at session start. The descriptions load up front, full skill content loads on demand. Confirmed in the public Polymarket reference repo's `CLAUDE.md`:

> Skills in `.claude/skills/` are auto-discovered — descriptions load at startup, full content on demand.

HyperIndex projects scaffolded with v3 rc ship 14 skill definitions:

```text
.claude/skills/
  indexer-blocks/
  indexer-configuration/
  indexer-external-calls/   # Effect API for fetch / RPC / async I/O
  indexer-factory/          # Dynamic contract registration
  indexer-filters/
  indexer-handlers/
  indexer-multichain/
  indexer-performance/
  indexer-schema/
  indexer-testing/          # Vitest patterns for handler tests
  indexer-traces/
  indexer-transactions/
  indexer-wildcard/
  migrate-from-subgraph/    # AssemblyScript-to-TypeScript conversion
```

The canonical skill set lives at [github.com/enviodev/hyperindex/tree/main/packages/cli/templates/static/shared/.claude/skills](https://github.com/enviodev/hyperindex/tree/main/packages/cli/templates/static/shared/.claude/skills) and ships into every new HyperIndex project.

These skills encode the patterns that make a HyperIndex project work. A developer running Claude Code, Cursor, or Codex in a HyperIndex project does not need to teach the agent what HyperIndex is. The skills do that, scoped to the actual conventions the framework expects.

### 3. The envio-cloud CLI

The `envio-cloud` CLI is the GitHub-native deploy surface for HyperIndex indexers running on Envio Cloud. The three core agent-facing commands are:

- `envio-cloud login` to authenticate via GitHub
- `envio-cloud indexer add` to register a new indexer
- `envio-cloud deployment status` to check sync state

Every command supports `-o json` for parseable output. Install with `npm install -g envio-cloud`.

The full [CLI reference](https://docs.envio.dev/docs/HyperIndex/envio-cloud-cli) is in the docs.

The deploy model is GitHub-native. An agent commits the indexer code to a GitHub repo, pushes to the `envio` branch (the default deploy branch), and registers the indexer with `envio-cloud indexer add`. The Envio GitHub App handles deployments from there. No deploy button, no dashboard step.

The published agentic demo did exactly that for a wstETH indexer on Monad Mainnet. 400,000 events indexed in approximately 20 seconds. The agent reads the contract, scaffolds the project from the ERC20 template, configures `config.yaml` for Monad, runs codegen and a type check, pushes to GitHub, and registers the indexer. End to end, no human in the loop after the first prompt. [Loom walkthrough](https://www.loom.com/share/09cdac43b18f4143ad78b18c8c8a492b). [Live deployment](https://envio.dev/app/denhampreen/wsteth-monad-indexer-demo/5d55d35).

That is the *act* in "programmable infrastructure for agents that need to act, not just query."

## A Concrete Example: The Published wstETH-on-Monad Demo

The [agentic indexing blog](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex) documents the full end-to-end flow an agent ran from scaffold to live deployment. This is not a hypothetical. The [live deployment](https://envio.dev/app/denhampreen/wsteth-monad-indexer-demo/5d55d35) and the [Loom walkthrough](https://www.loom.com/share/09cdac43b18f4143ad78b18c8c8a492b) are both public.

The commands the agent ran (from the published blog):

**Step 1: Scaffold from the ERC20 template**

```bash
pnpx envio@3.0.0-rc.0 init template -t erc20 -l typescript -d ./my-indexer --api-token ""
```

The `--api-token ""` makes the init non-interactive. No token is needed at scaffold time; auth is handled at deploy.

**Step 2: Configure for the target chain**

The agent edits `config.yaml` to target the wstETH contract on Monad Mainnet. From the published blog: chain ID 143, contract `0x10Aeaf63194db8d453d4D85a06E5eFE1dd0b5417`, `start_block: 0`.

Then runs codegen and a type check:

```bash
pnpm codegen
pnpm tsc --noEmit
```

**Step 3: Push to GitHub on the deploy branch**

Envio Cloud deploys from the `envio` branch by default:

```bash
gh repo create wsteth-monad-indexer-demo --public
git init && git add . && git commit -m "init"
git push -u origin main
git checkout -b envio && git push -u origin envio
```

**Step 4: Connect the Envio GitHub App to the repo**

A one-time install at [github.com/apps/envio-deployments](https://github.com/apps/envio-deployments/installations/select_target). The app handles the actual deployment when commits land on the `envio` branch.

**Step 5: Register and deploy**

```bash
pnpx envio-cloud login
pnpx envio-cloud indexer add \
  --name wsteth-monad-indexer-demo \
  --repo wsteth-monad-indexer-demo \
  --description "wstETH ERC20 indexer on Monad" \
  --branch envio \
  --skip-repo-check \
  --yes
```

**Step 6: Verify**

```bash
pnpx envio-cloud indexer get wsteth-monad-indexer-demo {org}
pnpx envio-cloud deployment status wsteth-monad-indexer-demo <commit-hash> {org}
```

Once synced, the indexer is at `https://envio.dev/app/{org}/{indexer-name}/{commit-hash}`.

**Result: 400,000 events indexed in ~20 seconds.**

Every command above is taken directly from the published blog. Every flag exists. The flow is what this whole blog is arguing for, an agent that scaffolds, configures, deploys, and verifies an indexer end to end, with no human stepping in. The [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer) is the production-scale reference for what this stack produces at full scale. The wstETH demo is the documented one-prompt run.

## Why This Beats a SQL Warehouse for Agentic Workflows

A SQL warehouse fronted by an LLM is excellent for analysts. The agent reads a question, writes SQL, returns a number. The agent does not change the warehouse, does not deploy new ingestion, does not branch the schema.

An agent acting onchain needs the opposite. It needs to:

- Add a new contract to its data ingestion mid-session
- Branch the schema to add a new entity type for a workflow it is exploring
- Spin up a brand-new indexer for an opportunity it just discovered
- Deploy to a hosted runtime and stream results back

HyperIndex gives the agent that ability. The indexer is a project the agent owns, not a warehouse it queries. The same agent can have ten indexers running at any time, each tracking a different market. None of that is possible if the only interface is read-only SQL.

For analysts: SQL warehouses are the right tool. For agents acting on the data: an indexing framework is the right tool. Both can coexist. The case here is for the agent side, which is the side under-served by the current SQL-warehouse-plus-LLM consensus.

## Get Started

- [HyperIndex Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai)
- [Envio docs MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server)
- [Agentic indexing case (400k events, 20s)](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex)
- [envio-cloud CLI reference](https://docs.envio.dev/docs/HyperIndex/envio-cloud-cli)
- [Polymarket production reference](https://github.com/enviodev/polymarket-indexer)

## Frequently Asked Questions

### Why do AI agents acting onchain need an indexer at all?

Raw RPC has four problems for an agent: reorgs, no schema, low throughput, and per-chain quirks at multichain scale. An indexer addresses all four. HyperIndex addresses them at the framework level, with reorg-safe storage, structured GraphQL output, [HyperSync](/docs/HyperSync/overview) throughput, and a single multichain config.

### What is the Envio docs MCP server?

A Model Context Protocol server at `https://docs.envio.dev/mcp` that exposes the Envio docs as two tools, `docs_search` and `docs_fetch`. Configured into Claude Code, Cursor, or VS Code with one setup command. Announcement blog: [Introducing the Envio Docs MCP Server](https://docs.envio.dev/blog/envio-docs-mcp-server).

### How fast can an AI agent deploy a HyperIndex indexer?

The [agentic indexing blog](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex) documents a single-prompt flow that scaffolds, deploys, and runs an indexer covering 400,000 events on Monad in roughly 20 seconds.

### Does the envio-cloud CLI support agent-driven deploys?

Yes. The CLI surface includes `envio-cloud login`, `envio-cloud indexer add`, `envio-cloud deployment status`, `envio-cloud deployment metrics`, `envio-cloud deployment promote`, with `-o json` on any command for parseable output. Deployments are GitHub-native: an agent commits to the `envio` branch and the registered indexer deploys automatically.

### How does HyperIndex differ from a SQL warehouse for agents?

A SQL warehouse is a read-only query layer. HyperIndex is a programmable indexer the agent can own, branch, and deploy. Both have a place. SQL warehouses suit analytical workflows. Indexers suit agents that need to act, not just query.

### Can an agent register a new contract mid-session without a redeploy?

Yes, when the contract is created by a factory the agent has already configured. HyperIndex's dynamic contract registration is a first-class feature, and the `indexer-factory` skill in `.claude/skills/` is the canonical reference for the pattern. Adding a brand-new chain or an unrelated contract still requires a config change and a redeploy, which the agent can run from the `envio-cloud` CLI in one command.

### Where can I watch an agent run this end-to-end?

The published [Loom walkthrough](https://www.loom.com/share/09cdac43b18f4143ad78b18c8c8a492b) shows the full wstETH-on-Monad demo, scaffold to live deployment. The [live indexer](https://envio.dev/app/denhampreen/wsteth-monad-indexer-demo/5d55d35) is public.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
