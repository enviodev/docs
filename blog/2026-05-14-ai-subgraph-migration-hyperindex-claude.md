---
title: AI-Assisted Subgraph Migration to HyperIndex with Claude
sidebar_label: AI-Assisted Subgraph Migration to HyperIndex with Claude
slug: /ai-subgraph-migration-hyperindex-claude
tags: ["ai"]
description: "Migrate a subgraph from The Graph to Envio HyperIndex with Claude doing the AssemblyScript-to-TypeScript rewrite. Real config, real handlers, real repo."
image: /blog-assets/ai-subgraph-migration-hyperindex-claude.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-05-14
  author: Jordyn Laurier
---

<img src="/blog-assets/ai-subgraph-migration-hyperindex-claude.png" alt="AI-Assisted Subgraph Migration to HyperIndex with Claude" width="100%"/>

<!--truncate-->

:::note TL;DR

- HyperIndex is Envio's multichain blockchain indexing framework for EVM chains. It accepts subgraph YAML and ABIs as input, scaffolds a HyperIndex project, and ships a TypeScript handler skeleton that AssemblyScript handler logic can be ported into.
- Claude (running with the Envio docs MCP server and the auto-discovered `.claude/skills/` directory, including the dedicated `migrate-from-subgraph` skill) handles the AssemblyScript-to-TypeScript rewrite end to end. Skills auto-discover for Cursor, Claude Code, and Codex.
- The Polymarket reference indexer is the public production-scale example: 8 subgraphs' worth of logic consolidated into one TypeScript indexer that synced 4,000,000,000 events in 6 days on Polygon.

:::

The hardest part of migrating off The Graph to HyperIndex has always been the AssemblyScript rewrite. Subgraphs run handler code in WebAssembly, which means handlers are written in AssemblyScript, a stricter subset of TypeScript with its own constraints, its own tooling, and its own foot-guns. Teams who otherwise live in TypeScript every day end up maintaining one codebase in a language they touch only when their indexer breaks.

The HyperIndex reference indexer for Polymarket demonstrates the consolidation pattern at scale, 8 subgraphs' worth of logic rewritten as a single TypeScript indexer. The full reference is public on [GitHub](https://github.com/enviodev/polymarket-indexer) and is documented in our [Polymarket case study](https://docs.envio.dev/blog/polymarket-hyperindex-case-study).

This blog is about how you can leverage Claude (or any coding agent) to migrate your subgraphs to HyperIndex. The agent does the AssemblyScript-to-TypeScript rewrite; a developer reviews the diff, runs the tests, and ships the indexer.

## What HyperIndex Is and Why the Migration Story Changed

HyperIndex is Envio's multichain blockchain indexing framework for EVM chains. HyperIndex handlers are written in regular TypeScript. Unlike AssemblyScript, which restricts which npm packages handlers can use, HyperIndex lets you bring in any npm package you want. Since handlers are TypeScript, there is no WebAssembly compilation step and no AssemblyScript-specific syntax to learn, you write handlers in the language you already use every day.

Two things changed in the last six months that turned subgraph migration into a tractable AI-assisted workflow:

1. The [HyperIndex docs MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server) went live, exposing the entire docs site as two tools (`docs_search` and `docs_fetch`) over Streamable HTTP at `https://docs.envio.dev/mcp`. Any IDE or assistant that speaks MCP, including Claude Code, Cursor, Codex, and VS Code, can now ground answers about HyperIndex in the live docs rather than stale training data.
2. HyperIndex projects ship a `.claude/skills/` directory that auto-discovers for Cursor, Claude Code, and Codex. The Polymarket reference repo's directory currently ships 14 skills, including a dedicated `migrate-from-subgraph` skill purpose-built for this workflow, plus `indexer-configuration`, `indexer-schema`, `indexer-handlers`, `indexer-factory` (dynamic contracts), `indexer-external-calls` (the Effect API), `indexer-multichain`, `indexer-performance`, `indexer-testing`, `indexer-blocks`, `indexer-filters`, `indexer-traces`, `indexer-transactions`, and `indexer-wildcard`. The full list lives at [the canonical skills directory](https://github.com/enviodev/hyperindex/tree/main/packages/cli/templates/static/shared/.claude/skills).

Combined, these mean a developer can hand the agent a subgraph repo and a working HyperIndex project shell and ask for a migration. The agent has live docs, a project-resident migration skill, and its own validation tooling.

The [Polymarket case study](https://docs.envio.dev/blog/polymarket-hyperindex-case-study) is the production reference for what the end state looks like. The rest of this post walks the AI-assisted version of that same migration on a smaller surface area, anchored to real artifacts in the Polymarket repo.

## The Four Files Claude Needs to See

Every subgraph has the same four primary inputs. Claude reads them in this order.

```text
my-subgraph/
  subgraph.yaml          # contracts, networks, event handlers, start blocks
  schema.graphql         # entity types and relations
  src/mappings/*.ts      # AssemblyScript handler logic (despite the .ts extension)
  abis/*.json            # contract ABIs the handlers parse logs against
```

`subgraph.yaml` carries the network, the contract addresses, the start blocks, and the event-to-handler mapping. `schema.graphql` carries the entity model. The mappings carry the actual logic. The ABIs carry the signatures for the events mappings parse.

HyperIndex needs the same four kinds of input, restructured. The Polymarket reference shows the target shape. From [the canonical config.yaml](https://github.com/enviodev/polymarket-indexer/blob/main/config.yaml) (selected events shown for brevity):

```yaml
# Source: https://github.com/enviodev/polymarket-indexer/blob/main/config.yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: polymarket-indexer
description: Unified Polymarket HyperIndex

contracts:
  - name: Exchange
    abi_file_path: ./abis/Exchange.json
    events:
      - event: "OrderFilled(bytes32 indexed orderHash, address indexed maker, address indexed taker, uint256 makerAssetId, uint256 takerAssetId, uint256 makerAmountFilled, uint256 takerAmountFilled, uint256 fee)"
      - event: "OrdersMatched(...)"
      - event: "TokenRegistered(...)"
  - name: ConditionalTokens
    abi_file_path: ./abis/ConditionalTokens.json
    events:
      - event: "PositionSplit(...)"
      - event: "PositionsMerge(...)"
      - event: "PayoutRedemption(...)"

field_selection:
  transaction_fields:
    - hash
    - from
    - to

chains:
  - id: 137 # Polygon
    start_block: 3764531
    contracts:
      - name: Exchange
        address:
          - "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
          - "0xC5d563A36AE78145C45a50134d48A1215220f80a"
        start_block: 33605403
      - name: ConditionalTokens
        address: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045"
        start_block: 4023686
```

Three small differences from subgraph YAML to know up front: HyperIndex uses `chains:` (not `networks:`), declares contracts once at the top level with addresses supplied per-chain, and auto-registers handlers from `src/handlers/<ContractName>.ts` (subgraphs require explicit handler-to-event mapping).

This single file replaces what would otherwise be eight separate `subgraph.yaml` files. Every shared event (`PositionSplit`, `PositionsMerge`, `PayoutRedemption`) is declared once and routed to a single TypeScript handler that updates every relevant entity in one pass. That architectural detail, "handler merging," is the structural win of the consolidation pattern.

`schema.graphql` carries across with two specific rewrites. Subgraph schemas decorate every type with `@entity`. HyperIndex schemas have no decorators, per the AGENTS.md: "Unlike TheGraph, schema types have no decorators." Subgraph relations like `@derivedFrom` are kept; ID conventions stay; the type body is otherwise identical. The built-in `indexer-schema` skill knows the diffs and applies them.

Handlers are where the migration work happens. The Polymarket reference repo's [`Exchange.ts`](https://github.com/enviodev/polymarket-indexer/blob/main/src/handlers/Exchange.ts) shows the canonical TypeScript shape and the conventions the `migrate-from-subgraph` skill applies (simplified for the post, helper functions inlined):

```typescript
// Source: https://github.com/enviodev/polymarket-indexer/blob/main/src/handlers/Exchange.ts
import { Exchange, type Orderbook } from "generated";
import {
  parseOrderFilled,
  updateUserPositionWithBuy,
  updateUserPositionWithSell,
} from "../utils/pnl.js";
import { COLLATERAL_SCALE } from "../utils/constants.js";
import { scaleBigInt, ZERO_BD } from "../utils/fpmm.js";
import { getMarketMetadata } from "../effects/marketMetadata.js";

const TRADE_TYPE_BUY = "Buy";
const TRADE_TYPE_SELL = "Sell";

Exchange.OrderFilled.handler(async ({ event, context }) => {
  const side = event.params.makerAssetId === 0n ? TRADE_TYPE_BUY : TRADE_TYPE_SELL;
  const tokenId = side === TRADE_TYPE_BUY
    ? event.params.takerAssetId.toString()
    : event.params.makerAssetId.toString();

  // 1. Persist the OrderFilled event (chainId in ID prevents cross-chain collisions)
  context.OrderFilledEvent.set({
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    transactionHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    orderHash: event.params.orderHash,
    maker: event.params.maker,
    taker: event.params.taker,
    // ... rest of the event
  });

  // 2. Read-then-write Orderbook (spread mandatory, returned entities are read-only)
  const orderbook = (await context.Orderbook.get(tokenId)) ?? defaultOrderbook(tokenId);
  context.Orderbook.set({
    ...orderbook,
    tradesQuantity: orderbook.tradesQuantity + 1n,
    collateralVolume: orderbook.collateralVolume + size,
  });

  // 3. PnL update. Handler merged with what was previously a separate pnl subgraph
  const order = parseOrderFilled(event.params);
  if (order.side === "BUY") {
    await updateUserPositionWithBuy(context, order.account, order.positionId, price, order.baseAmount);
  } else {
    await updateUserPositionWithSell(context, order.account, order.positionId, price, order.baseAmount);
  }
});
```

The same handler file also processes `OrdersMatched` and `TokenRegistered`. The `TokenRegistered` handler fetches Polymarket Gamma API metadata via the Effect API:

```typescript
// Same source file, TokenRegistered handler
const metadata = await context.effect(getMarketMetadata, token0Str);
```

`createEffect` plus `context.effect()` is the documented pattern for any external call (fetch, RPC, async I/O). From the project's `AGENTS.md`: "All `fetch`, RPC, or other async I/O must use `createEffect` + `context.effect()`. Never call external services directly in handlers."

The comparable AssemblyScript handler on The Graph would be split across three subgraph repos, each parsing the same OrderFilled log independently, each writing to its own subgraph database, with cross-domain joins happening at query time. Handler merging is the architectural reason the Polymarket reference consolidates 8 subgraphs into 1. It is also the thing that makes AssemblyScript handlers straightforward for an agent to translate: the event parsing is mechanical, the entity writes are explicit, and the conventions are documented in the project-resident skills.

## How the AI-Assisted Migration Workflow Runs

The flow assumes a developer with Claude Code or Cursor installed, the Envio docs MCP server configured, and the HyperIndex CLI on their machine. From the [HyperIndex Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai) the MCP setup is one command for Claude Code:

```bash
claude mcp add --transport http envio-docs https://docs.envio.dev/mcp
```

Cursor or VS Code uses the JSON config form on the same page. Once added, every Claude session in that workspace can query the live docs.

### Step 1: Scaffold a HyperIndex project from a template

Scaffold a fresh HyperIndex project using the template flow. Pass `--api-token ""` so the init runs non-interactively when an agent is driving:

```bash
pnpx envio@3.0.0-rc.0 init template -t erc20 -l typescript -d ./my-indexer --api-token ""
```

This produces a working HyperIndex project shell with `config.yaml`, `schema.graphql`, handler stubs, an `AGENTS.md`, and the auto-discovered `.claude/skills/` directory (including the `migrate-from-subgraph` skill). The current release is tracked at [github.com/enviodev/hyperindex/releases](https://github.com/enviodev/hyperindex/releases).

### Step 2: Hand Claude the AssemblyScript mappings

```text
You: I just initialised a HyperIndex project and the /XYZ folder has my subgraph
could you help me migrate that to my HyperIndex project. The generated
config.yaml and schema.graphql are in place. The original AssemblyScript
mappings are in ../old-subgraph/src/mappings/. Use the migrate-from-subgraph
skill to translate them into TypeScript handlers under src/handlers/. Apply the
project conventions in AGENTS.md: spread operator for entity updates, Effect
API for any external calls, entity_id fields for relationships. Flag anything
that uses nested entity loads or AssemblyScript-specific helpers so I can
review.
```

Claude opens the migration skill, walks the mapping files in dependency order, and produces TypeScript handlers under `src/handlers/`. Every entity load and write is explicit. Every BigInt operation uses native JavaScript `BigInt` rather than the AssemblyScript `BigInt` class. Imports come from the auto-generated types, not from `@graphprotocol/graph-ts`.

### Step 3: Run the indexer locally and compare

```bash
pnpm install
pnpm dev
```

The indexer comes up against a local Postgres and a Hasura GraphQL endpoint. The deployed subgraph endpoint and the local HyperIndex endpoint can be queried side by side for any entity at any block height. Claude knows how to write the comparison queries because the `indexer-testing` skill ships in the project.

### Step 4: Ship to Envio Cloud

Envio Cloud uses a GitHub-native deploy model. Push the indexer to a GitHub repo on the `envio` branch, connect the Envio GitHub App, and register the indexer with `envio-cloud indexer add`. The full flow from the [agentic indexing blog](https://docs.envio.dev/blog/agentic-blockchain-indexing-envio-hyperindex):

```bash
npm install -g envio-cloud
envio-cloud login

# push the migrated indexer to the envio branch
git checkout -b envio && git push -u origin envio

# install the Envio GitHub App on the repo
# https://github.com/apps/envio-deployments/installations/select_target

# register the indexer
envio-cloud indexer add \
  --name my-migrated-indexer \
  --repo my-migrated-indexer \
  --description "Subgraph migrated to HyperIndex" \
  --branch envio \
  --skip-repo-check \
  --yes

# track sync state
envio-cloud deployment status my-migrated-indexer <commit-hash> {org}
```

Every command supports `-o json` for parseable output. The Polymarket reference indexer is live at [envio.dev/app/moose-code/polymarket-indexer/7cad3ad](https://envio.dev/app/moose-code/polymarket-indexer/7cad3ad). Full CLI reference at [docs.envio.dev/docs/HyperIndex/envio-cloud-cli](https://docs.envio.dev/docs/HyperIndex/envio-cloud-cli).

## What the AI Catches and What It Doesn't

After running this workflow on smaller subgraphs internally, here is the honest split.

Claude is reliably good at:

- Translating event parsing and entity writes (the bulk of any handler)
- Replacing AssemblyScript `BigInt` with native JS `BigInt`
- Replacing `@graphprotocol/graph-ts` imports with the HyperIndex generated types
- Stripping the `@entity` decorator from every schema type (HyperIndex schemas have no decorators per AGENTS.md)
- Applying the spread operator pattern on entity updates (mandatory in HyperIndex, returned entities are read-only)
- Wrapping any external call from a mapping in `createEffect` plus `context.effect()` (the Effect API)
- Generating the matching test cases against the Vitest framework HyperIndex ships with

Claude needs human review on:

- **Cross-handler shared state.** Subgraphs sometimes encode shared state in entity IDs in ways that look fine until two handlers race at the same block. Handler merging in HyperIndex usually fixes this, but the migration is the moment to redesign it consciously.

A migration that runs all four steps with Claude driving and a developer reviewing typically turns a multi-week AssemblyScript rewrite into a one or two day exercise. The Polymarket reference is the upper bound: 8 subgraphs' worth of logic, 50+ entities, four years of handler history. Smaller subgraphs are correspondingly faster.

## Why Migrate at All: The Numbers

The reason teams move off The Graph is performance and developer experience. From the public benchmarks:

| Indexer | Time (Sentio Uniswap V2 Factory benchmark) | vs HyperIndex |
| --- | --- | --- |
| Envio HyperIndex | 8 seconds | baseline |
| Subsquid (SQD) | 2 minutes | 15x slower |
| The Graph | 19 minutes | 142x slower |
| Ponder | 21 minutes | 157x slower |

Full benchmark comparison at [docs.envio.dev/docs/HyperIndex/benchmarks](https://docs.envio.dev/docs/HyperIndex/benchmarks).

Polymarket's full historical sync, 4,000,000,000 events on Polygon, completed in 6 days. The same workload on a single subgraph in the Polymarket setup would have been measured in months and would still leave eight separate APIs to query.

Speed is one half of the story. Developer experience is the other. TypeScript handlers, native npm package use, generated types, real test runners, multichain configuration in a single file, dynamic contract registration without redeployment. Once a team has been on HyperIndex for a sprint, the subgraph workflow stops feeling like a viable alternative.

## Frequently Asked Questions

### How long does an AI-assisted subgraph migration to HyperIndex take?

For a single-domain subgraph with one or two contracts, the AI-assisted workflow with Claude typically runs in a few hours. For a complex multi-domain setup at the scale of the Polymarket reference (8 subgraphs' worth of logic, 50+ entities, four years of handler history), the migration with Claude assistance runs in days, not weeks. The bulk of the time is human review, not generation.

### Does HyperIndex support every subgraph schema directive?

Most directives carry across. `@derivedFrom` and ID-based relations have direct HyperIndex equivalents. The biggest difference is decorators: HyperIndex schemas have no `@entity` decorator at all. Per the project's `AGENTS.md`: "Unlike TheGraph, schema types have no decorators." The `indexer-schema` skill knows the translations and the `migrate-from-subgraph` skill applies them. Anything without a direct equivalent gets flagged for manual handling.

### Can I migrate an Alchemy subgraph the same way?

Yes. Alchemy Subgraphs are technically subgraphs, and the same AI-assisted migration flow described in this blog applies, scaffold a HyperIndex project from a template, hand Claude the AssemblyScript mappings, validate locally, and ship.

### What if my subgraph uses dynamic contracts (factory pattern)?

HyperIndex supports dynamic contract registration as a first-class feature. Polymarket uses it for FPMM pools created by `FPMMFactory`. The `indexer-factory` skill in `.claude/skills/` handles the translation. See the Polymarket reference handler at [github.com/enviodev/polymarket-indexer/blob/main/src/handlers/FPMMFactory.ts](https://github.com/enviodev/polymarket-indexer/blob/main/src/handlers/FPMMFactory.ts).

### How do I validate that the migrated indexer matches the original subgraph?

Run both endpoints side by side and query the same entity at the same block. The `indexer-testing` skill in `.claude/skills/` generates the comparison queries. For production migrations, Envio also provides a CLI validation tool that diffs entity state across both endpoints over a block range. The [Polymarket reference repo](https://github.com/enviodev/polymarket-indexer) is the public production example to compare your migrated output against.

### Does the AI workflow work without Claude?

Yes. Skills in `.claude/skills/` auto-discover for Cursor, Claude Code, and Codex per the project's `CLAUDE.md`. The docs MCP server is MCP-standard so any MCP-capable agent works. The setup commands on the [Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai) page cover Claude Code, Cursor, and VS Code explicitly.

### What does HyperIndex do that subgraphs do not?

Single multichain config (subgraphs are single-chain). Native TypeScript handlers (subgraphs require AssemblyScript). 142x faster sync on the Sentio Uniswap V2 Factory benchmark. Framework-level reorg handling with no handler logic required. Self-hostable or deployed to Envio Cloud with a GitHub-native flow (`envio-cloud indexer add` against an `envio` branch).

### Where is the production reference for a large subgraph migration?

The [Polymarket HyperIndex reference indexer](https://github.com/enviodev/polymarket-indexer). 8 subgraphs' worth of logic consolidated into one indexer, 4,000,000,000 events synced in 6 days. The full repo is public on GitHub and the case study can be found in [our blog](https://docs.envio.dev/blog/polymarket-hyperindex-case-study).

## Get Started

Migration starts with two things: an existing subgraph (deployed or local) and a Claude Code or Cursor session pointed at a fresh HyperIndex project.

- [HyperIndex Quickstart with AI](https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai)
- [HyperIndex docs MCP server](https://docs.envio.dev/docs/HyperIndex/mcp-server)
- [Polymarket reference indexer](https://github.com/enviodev/polymarket-indexer)
- [Migration guide (manual reference)](https://docs.envio.dev/docs/HyperIndex/migration-guide)
- [Envio Cloud CLI](https://docs.envio.dev/docs/HyperIndex/envio-cloud-cli)

For larger migrations, the Envio team supports the planning and review pass directly. Reach out via Discord or Telegram.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
