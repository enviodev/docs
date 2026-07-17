---
title: Build an AI-Powered App with HyperIndex and Claude
sidebar_label: Build an AI-Powered App with HyperIndex and Claude
slug: /ai-onchain-app-hyperindex-claude
tags: ["ai"]
description: "End-to-end tutorial: scaffold, deploy, and run a multichain HyperIndex indexer with Claude. Real config, real handlers, real CLI, real GraphQL."
image: /blog-assets/ai-onchain-app-hyperindex-claude.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-05-14
  author: Jordyn Laurier
---

<img src="/blog-assets/ai-onchain-app-hyperindex-claude.png" alt="Build an AI-Powered App with HyperIndex and Claude" width="100%"/>

<!--truncate-->

:::note TL;DR

- HyperIndex is Envio's multichain blockchain indexing framework for EVM chains. With Claude Code pointed at a HyperIndex project, the agent has the docs (via the docs MCP server) and the patterns (via the auto-discovered `.claude/skills/` directory shipped with every v3 rc project) to scaffold, code, deploy, and run an indexer end to end.
- The CLI surface is `pnpx envio init` for scaffold, `TUI_OFF=true pnpm dev` for local, and the GitHub-native `envio-cloud indexer add` flow for hosted deployments. Every command is scriptable and agent-friendly.
- The Polymarket reference at [github.com/enviodev/polymarket-indexer](https://github.com/enviodev/polymarket-indexer) is the public production example. 8 subgraphs replaced with 1; the first 4,000,000,000 events synced in 6 days, over 6,500,000,000 indexed to date.
- Anything in this blog is reproducible today against the current HyperIndex release tracked at [github.com/enviodev/hyperindex/releases](https://github.com/enviodev/hyperindex/releases).

:::

This is a practical, end-to-end walkthrough of building a HyperIndex indexer with Claude as a pair programmer. Every command is from the published Envio docs. Every code shape is taken directly from the public Polymarket reference indexer. The aim is to show the shortest reliable path from a blank project to a deployed multichain indexer that an engineer (or an agent) can actually run today.

## What You're Building

A multichain HyperIndex indexer that tracks ERC20 transfers across two chains (Ethereum and Base) and exposes the data through a GraphQL endpoint. Two contracts, one schema, one config, deployed to [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service) and queryable in roughly 30 minutes if you are reading along, or roughly 5 minutes if Claude is driving.

The structure of the project will be three files plus generated TypeScript:

```text
my-erc20-indexer/
  config.yaml          # Networks, contracts, events
  schema.graphql       # Entity model
  src/EventHandlers.ts # The handler logic
```

Source for the three-file structure: [docs.envio.dev/docs/HyperIndex/quickstart-with-ai](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai).

## Step 0: Wire Up Claude

Once. Then never again. The Envio [docs MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server) exposes the live docs to any MCP-capable agent. From the docs MCP server reference, the setup commands are:

For Claude Code:

```bash
claude mcp add --transport http envio-docs https://docs.envio.dev/mcp
```

For Cursor or VS Code, drop this into the MCP config:

```json
{
  "mcpServers": {
    "envio-docs": {
      "url": "https://docs.envio.dev/mcp",
      "transport": "http"
    }
  }
}
```

After this, Claude has two tools available in any session: `docs_search` (semantic search) and `docs_fetch` (retrieve a page). The agent uses these instead of guessing at API surface from training data.

## Step 1: Scaffold the Project

Use the template flow to scaffold an ERC20 indexer in one non-interactive command.

```bash
pnpx envio@3.0.0-rc.0 init template -t erc20 -l typescript -d ./my-indexer --api-token ""
```

This pulls the current HyperIndex v3 release candidate, which ships with the V3 testing framework, the built-in `.claude/skills/` directory, and the current CLI flags. The current release is tracked at [github.com/enviodev/hyperindex/releases](https://github.com/enviodev/hyperindex/releases).

The `--api-token ""` flag tells the init to run non-interactively, with no prompt for an Etherscan-style API token. If an agent is driving, every interactive prompt is a failure mode.

The init produces the three files plus a `package.json`, `tsconfig.json`, an `AGENTS.md` and `CLAUDE.md` documenting the conventions, and an auto-discovered `.claude/skills/` directory. Every project scaffolded with v3 rc ships these skills out of the box, encoding the indexing patterns Claude needs to write idiomatic HyperIndex code without improvising.

## Step 2: Make It Multichain

The init scaffolds for one chain. Adding a second is a config edit, not a fresh project. Open `config.yaml` and add a second chain entry. The shape mirrors the public [Polymarket config](https://github.com/enviodev/polymarket-indexer/blob/main/config.yaml). HyperIndex uses two-tier declaration. Top-level `contracts:` for global event signatures, then a `chains:` array for per-chain addresses and start blocks.

```yaml
# Pattern from: https://github.com/enviodev/polymarket-indexer/blob/main/config.yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: erc20-multichain

contracts:
  - name: USDC
    events:
      - event: "Transfer(address indexed from, address indexed to, uint256 value)"

field_selection:
  transaction_fields:
    - hash
    - from
    - to

chains:
  - id: 1
    start_block: 17000000
    contracts:
      - name: USDC
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  - id: 8453
    start_block: 2000000
    contracts:
      - name: USDC
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
```

Three things to call out:

- `chains:` is the keyword, not `networks:`. Per the AGENTS.md generated into every HyperIndex project: "Uses chains (not networks)." If your editor or an AI agent suggests `networks:`, the schema validation will fail.
- The `handler:` field is optional. Handlers auto-register from `src/handlers/`. Same AGENTS.md.
- `field_selection` controls which transaction fields HyperSync ships down. Asking for fewer fields is faster and uses less memory.

For the current set of supported config options including per-contract `start_block` and environment variable interpolation, the full [configuration reference](https://docs.envio.dev/docs/HyperIndex/configuration-file) lives in the docs.

## Step 3: The Schema

Edit `schema.graphql` to model entities the application will query. The shape uses a `chainId`-first pattern (per-chain entities plus aggregated entities) for clean cross-chain queries:

```graphql
# Pattern from: https://github.com/enviodev/polymarket-indexer/blob/main/schema.graphql
type Transfer
  @index(fields: ["from", ["timestamp", "DESC"]])
  @index(fields: ["to", ["timestamp", "DESC"]])
{
  id: ID!
  from: String! @index
  to: String! @index
  value: BigInt!
  chainId: Int!
  blockNumber: Int!
  timestamp: Int!
}

type AccountBalance {
  id: ID!
  account: String! @index
  chainId: Int!
  balance: BigInt!
  lastUpdated: Int!
}

type AggregateBalance {
  id: ID!
  account: String! @index
  totalAcrossChains: BigInt!
  lastUpdated: Int!
}
```

Two HyperIndex-specific things worth noting in this schema:

- No `@entity` decorator. From the project's `AGENTS.md`: "Unlike TheGraph, schema types have no decorators." Subgraphs put `@entity` on every type. HyperIndex does not.
- `@index` is composable. The [Polymarket schema](https://github.com/enviodev/polymarket-indexer/blob/main/schema.graphql) uses both per-field `@index` and per-type composite indexes like `@index(fields: ["from", ["timestamp", "DESC"]])` to drive the queries the application needs.

`Transfer` carries every transfer event with `chainId` first-class. `AccountBalance` is per-chain. `AggregateBalance` is the cross-chain rollup. The same indexer writes to all three.

After editing the schema, run `pnpm codegen` to regenerate the typed bindings. The project's `AGENTS.md` is explicit that codegen is required after any schema or config change. Types go stale otherwise.

## Step 4: The Handler

In v3 rc, types come from the `envio` package directly. The handler imports `indexer` plus any entity types it needs, then registers handlers as `indexer.onEvent({ contract: "CONTRACT_NAME", event: "EVENT_NAME" }, handler)`.

```typescript
import {
  indexer,
  type Transfer,
  type AccountBalance,
  type AggregateBalance,
} from "envio";

indexer.onEvent(
  { contract: "USDC", event: "Transfer" },
  async ({ event, context }) => {
    const transferId = `${event.chainId}_${event.block.number}_${event.logIndex}`;

    const transfer: Transfer = {
      id: transferId,
      from: event.params.from,
      to: event.params.to,
      value: event.params.value,
      chainId: event.chainId,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
    };
    context.Transfer.set(transfer);

    const fromKey = `${event.chainId}_${event.params.from}`;
    const toKey = `${event.chainId}_${event.params.to}`;

    const fromBal: AccountBalance = (await context.AccountBalance.get(fromKey)) ?? {
      id: fromKey,
      account: event.params.from,
      chainId: event.chainId,
      balance: 0n,
      lastUpdated: event.block.timestamp,
    };
    context.AccountBalance.set({
      ...fromBal,
      balance: fromBal.balance - event.params.value,
      lastUpdated: event.block.timestamp,
    });

    const toBal: AccountBalance = (await context.AccountBalance.get(toKey)) ?? {
      id: toKey,
      account: event.params.to,
      chainId: event.chainId,
      balance: 0n,
      lastUpdated: event.block.timestamp,
    };
    context.AccountBalance.set({
      ...toBal,
      balance: toBal.balance + event.params.value,
      lastUpdated: event.block.timestamp,
    });

    const fromAgg: AggregateBalance = (await context.AggregateBalance.get(event.params.from)) ?? {
      id: event.params.from,
      account: event.params.from,
      totalAcrossChains: 0n,
      lastUpdated: event.block.timestamp,
    };
    context.AggregateBalance.set({
      ...fromAgg,
      totalAcrossChains: fromAgg.totalAcrossChains - event.params.value,
      lastUpdated: event.block.timestamp,
    });

    const toAgg: AggregateBalance = (await context.AggregateBalance.get(event.params.to)) ?? {
      id: event.params.to,
      account: event.params.to,
      totalAcrossChains: 0n,
      lastUpdated: event.block.timestamp,
    };
    context.AggregateBalance.set({
      ...toAgg,
      totalAcrossChains: toAgg.totalAcrossChains + event.params.value,
      lastUpdated: event.block.timestamp,
    });
  },
);
```

Three project-enforced conventions visible in this snippet, all spelled out in the `AGENTS.md` generated into every HyperIndex project:

- **Spread operator for updates.** Entities returned by `context.Entity.get()` are read-only. Always spread: `context.Entity.set({ ...existing, field: newValue })`. Direct mutation throws.
- **Composite IDs for cross-chain uniqueness.** `${event.chainId}_${event.block.number}_${event.logIndex}` is the Polymarket pattern. Without `chainId` in the ID, two chains writing the same `(block, logIndex)` collide.
- **Effect API for any external call.** If the handler needs to fetch Gamma metadata, call an RPC, or hit any other async I/O, use `createEffect` plus `context.effect()`. Never call external services directly. The Polymarket `TokenRegistered` handler shows the pattern with `context.effect(getMarketMetadata, token0Str)`.

This is the structure an agent with the `indexer-handlers` and `indexer-external-calls` skills produces when asked to "write the Transfer handler that updates per-chain and aggregate balances." The skills encode these conventions so the agent does not improvise them wrongly.

## Step 5: Run It Locally

```bash
pnpm install
pnpm codegen          # regenerate types from schema + config
pnpm tsc --noEmit     # type-check without emitting
TUI_OFF=true pnpm dev # run indexer (TUI_OFF gives AI-friendly stdout)
```

Source for these exact commands: [polymarket-indexer/AGENTS.md](https://github.com/enviodev/polymarket-indexer/blob/main/AGENTS.md).

The local dev environment spins up a Postgres and a Hasura GraphQL instance. The indexer starts pulling events from both chains via HyperSync. Sync rates of 25,000 events per second on historical backfill are standard. The [Polymarket case study](https://docs.envio.dev/blog/polymarket-hyperindex-case-study) documents 4,000,000,000 events synced in 6 days on Polygon; the indexer has since indexed over 6,500,000,000 in total.

The Hasura GraphQL endpoint is available locally. Once the indexer is at chain head, queries like:

```graphql
query AggregateBalanceForAccount {
  AggregateBalance(where: { account: { _eq: "0xabc..." } }) {
    account
    totalAcrossChains
    lastUpdated
  }
}
```

return live data.

## Step 6: Deploy to Envio Cloud

Envio Cloud uses a GitHub-native deploy model. An agent commits the indexer to a GitHub repo, pushes to the `envio` branch (the default deploy branch), and registers the indexer with `envio-cloud indexer add`. The Envio GitHub App handles deployments from there. No deploy button, no dashboard step.

Install the CLI and authenticate:

```bash
npm install -g envio-cloud
envio-cloud login
```

Push the project to GitHub on the `envio` branch:

```bash
gh repo create my-erc20-indexer --public
git init && git add . && git commit -m "init"
git push -u origin main
git checkout -b envio && git push -u origin envio
```

Connect the Envio GitHub App to the repo (one-time install at [github.com/apps/envio-deployments](https://github.com/apps/envio-deployments/installations/select_target)), then register the indexer:

```bash
envio-cloud indexer add \
  --name my-erc20-indexer \
  --repo my-erc20-indexer \
  --description "Multichain ERC20 indexer" \
  --branch envio \
  --skip-repo-check \
  --yes
```

The verified CLI surface (from the [agentic indexing blog](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex)) includes:

- `envio-cloud login` authenticates via GitHub
- `envio-cloud indexer add` registers a new indexer pointing at a GitHub repo and branch
- `envio-cloud indexer get` fetches indexer details
- `envio-cloud deployment status` returns the current sync state of a deployment
- `envio-cloud deployment metrics` returns runtime metrics
- `envio-cloud deployment promote` promotes a deployment to production
- `-o json` on any command for parseable output

Track sync progress with `envio-cloud deployment status` and `envio-cloud deployment metrics`. Full reference at [docs.envio.dev/docs/HyperIndex/envio-cloud-cli](https://docs.envio.dev/docs/HyperIndex/envio-cloud-cli).

## Step 7: Test It

`pnpm test` runs the project's Vitest suite. In v3 rc, tests import `createTestIndexer` and `TestHelpers` from the `envio` package directly, so tests use the same types as handlers. The `indexer-testing` skill in `.claude/skills/` encodes the current API surface (mock event factories, test indexer setup, assertion patterns) and the [testing reference docs](https://docs.envio.dev/docs/HyperIndex/testing) cover it end to end.

## What the Stack Looks Like End to End

```text
[Claude Code or Cursor]
         |
         | (reads docs via MCP server, applies built-in Claude skills)
         v
[HyperIndex Project (config.yaml + schema.graphql + handlers)]
         |
         | (pnpm dev locally, or push to GitHub envio branch)
         v
[HyperIndex Runtime + HyperSync]
         |
         | (live indexes EVM chains natively, any EVM via RPC)
         v
[Postgres + Hasura GraphQL endpoint]
         |
         | (queried by application, dashboard, agent, or downstream service)
         v
[Your AI-Powered Onchain App]
```

Each layer is a piece you have full control over. None of them require black-box assumptions about how an indexer behaves under reorgs, source outages, or scale. The [reliability blog](https://docs.envio.dev/blog/production-indexer-reliability-hyperindex) covers what HyperIndex provides at the framework level.

## Get Started

- [HyperIndex Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai)
- [Envio docs MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server)
- [envio-cloud CLI reference](https://docs.envio.dev/docs/HyperIndex/envio-cloud-cli)
- [config.yaml reference](https://docs.envio.dev/docs/HyperIndex/configuration-file)
- [Testing docs (V3 framework)](https://docs.envio.dev/docs/HyperIndex/testing)
- [Polymarket production reference](https://github.com/enviodev/polymarket-indexer)
- [Companion: AI-assisted subgraph migration](https://docs.envio.dev/blog/ai-subgraph-migration-hyperindex-claude)

## Frequently Asked Questions

### What does an AI-powered onchain app stack look like?

The stack is: Claude Code (or another MCP-aware editor) as the development surface, a HyperIndex project with an auto-discovered `.claude/skills/` directory shipped by v3 rc, the HyperIndex runtime with [HyperSync](/docs/HyperSync/overview) as the data engine, Postgres plus Hasura for GraphQL, and the application or agent on top. Every layer is real and shipping today.

### How do I deploy a HyperIndex indexer programmatically?

Install the envio-cloud CLI with `npm install -g envio-cloud` and authenticate with `envio-cloud login`. Push the indexer code to a GitHub repo on the `envio` branch, connect the Envio GitHub App to the repo, then register with `envio-cloud indexer add`. Track sync state with `envio-cloud deployment status` and `envio-cloud deployment metrics`. Every command supports `-o json` for parseable output. Full reference at [docs.envio.dev/docs/HyperIndex/envio-cloud-cli](https://docs.envio.dev/docs/HyperIndex/envio-cloud-cli).

### Can I add a chain to a HyperIndex indexer without redeploying?

Adding a chain requires a config change and a redeploy because the indexer needs to start a new HyperSync stream. The redeploy itself is one CLI command. Adding a contract on an existing chain that uses the factory pattern can be done dynamically without a redeploy. See the `indexer-factory` skill in the project.

### How does HyperIndex compare to subgraphs for an AI workflow?

Subgraphs use AssemblyScript handlers, single-chain config per subgraph, and matchstick for testing. HyperIndex uses TypeScript handlers, multichain config in one file, and Vitest for testing. The TypeScript surface is what makes Claude's involvement straightforward. The migration story is covered in [AI-assisted subgraph migration](https://docs.envio.dev/blog/ai-subgraph-migration-hyperindex-claude).

### Is HyperIndex faster than other indexers in benchmarks?

In Sentio's independent Uniswap V2 Factory benchmark, HyperIndex completed in 8 seconds, 142x faster than The Graph and 15x faster than the nearest competitor.

### Where can I see a public production reference?

The [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer). Synced its first 4,000,000,000 events from block 3,764,531 in 6 days, replacing 8 separate subgraphs, and has indexed over 6,500,000,000 to date. Live at [envio.dev/app/moose-code/polymarket-indexer/7cad3ad](https://envio.dev/app/moose-code/polymarket-indexer/7cad3ad).

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+BeS5ihVUFONjNGFk) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
