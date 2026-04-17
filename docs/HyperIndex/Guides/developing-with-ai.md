---
id: developing-with-ai
title: Developing with AI
sidebar_label: Developing with AI
slug: /developing-with-ai
description: Develop HyperIndex indexers with AI agents, using CLI flags for init, Claude skills, the built-in testing framework, and an optional subgraph migration recipe.
---

# Developing with AI

HyperIndex v3 templates include **Claude skills** with packaged guidance for work like **creating indexers**, **running indexers**, and **testing** (agents should pick these up automatically). This guide is written for **agent-driven workflows**, with reproducible commands and clear checkpoints.

## Prerequisites

- An AI programming assistant or agent (for example Cursor or Claude Code)
- [pnpm](https://pnpm.io/installation) installed
- **HyperIndex v3**

:::caution
If your default `envio` version is not v3, pin a v3 release when initializing:

```bash
pnpx envio@3.0.0-alpha.21 init
```

Replace `3.0.0-alpha.21` with the [latest v3 release](https://github.com/enviodev/hyperindex/releases).
:::

## Create an indexer without interactive prompts

**AI agents** can pass init options as **CLI flags** so the initializer runs without prompts. For every command, flag, and ready-made command line, use the **[Envio CLI reference](./cli-commands)**, especially the **[Complete One-Line Examples](./cli-commands#complete-one-line-examples)** section for copy-pastable flows (contract import from an explorer, local ABI, or template).

If you need **multiple contracts**, run **`envio init` once** to **create an indexer** (for example for one contract via flags), then add the remaining contracts, events, and handlers afterward (`config.yaml`, schema, handler code, and helpers). See **[Multiple contracts](./cli-commands#multiple-contracts)** on the CLI page for how that fits the one-address-per-invocation limit.

**CLI flag examples for `envio init contract-import`** (not exhaustive; see the **[Envio CLI](./cli-commands#envio-init-contract-import)** for every option):

| Flag | Role |
|------|------|
| `-n`, `--name` | Project name |
| `-l`, `--language` | `typescript`, `javascript`, or `rescript` |
| `-d`, `--directory` | Output directory for the project |
| `-c`, `--contract-address` | Contract address |
| `-b` | Network / chain identifier (see CLI docs for your chain) |
| `--single-contract` | Do not prompt for additional contracts |
| `--all-events` | Index all events without per-event confirmation |
| `--api-token` | HyperSync API token for generated `.env` |

**Example** (contract import from explorer, same one-liner as the [CLI reference](./cli-commands#contract-import-from-block-explorer); adjust names, address, network, and token).

```bash
pnpx envio init contract-import explorer \
  -n usdc-indexer \
  -c 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 \
  -b ethereum-mainnet \
  --single-contract \
  --all-events \
  -l typescript \
  -d usdc-indexer \
  --api-token "your-api-token" && cd usdc-indexer && pnpm dev
```

## Core agent loop

A practical loop for building or changing an indexer:

1. **Set up the indexer** using **CLI flags** (see [above](#create-an-indexer-without-interactive-prompts) and the **[Envio CLI](./cli-commands)**).
2. **Edit** your indexer.
3. Run **`pnpm codegen`** (or `pnpm envio codegen`) so generated types and helpers stay in sync.
4. Run **`pnpm dev`** to run locally and catch runtime issues.
5. Use the **[built-in testing framework](#verify-with-the-testing-framework)** to run tests and refine behavior.

This matches how agents work best: small edits, regenerate, validate, repeat.

## Verify with the testing framework

HyperIndex v3’s testing stack is **Vitest** plus **`createTestIndexer()`**: tests run against the real indexing pipeline while staying fast to iterate. That setup lends itself well to **agents** for testing and resolving issues **within an indexer**.

Typical flow:

1. Add or update tests under a `test/` folder.
2. Run **`pnpm codegen`** so generated test types and helpers are in sync.
3. Use `createTestIndexer()` in tests and process events with one of these modes:
   - **Auto-exit**: `indexer.process({ chains: { 1: {} } })` (finds next block with events automatically)
   - **Explicit range**: pin `startBlock` and `endBlock` for deterministic CI snapshots
   - **Simulate**: provide typed synthetic events for unit-style tests without live data
4. Assert on `result.changes` with snapshots (`toMatchInlineSnapshot`) and, when needed, read entities directly via `get`, `getOrThrow`, and `getAll`.
5. Run **`pnpm test`** and review snapshot updates before committing.

Example test (v3 framework):

```ts
import { describe, it } from "vitest";
import { createTestIndexer } from "generated";

describe("Indexer Testing", () => {
  it("processes two eventful blocks in auto-exit mode", async (t) => {
    const indexer = createTestIndexer();

    const first = await indexer.process({ chains: { 1: {} } });
    t.expect(first.changes).toMatchInlineSnapshot(``);

    const second = await indexer.process({ chains: { 1: {} } });
    t.expect(second.changes).toMatchInlineSnapshot(``);
  });
});
```

For pure unit-style checks without network calls, use the **simulate** mode:

```ts
await indexer.process({
  chains: {
    1: {
      simulate: [
        {
          contract: "ERC20",
          event: "Transfer",
          params: { from: addr1, to: addr2, value: 100n },
        },
      ],
    },
  },
});
```

This pattern is ideal for agents: implement handler changes, run tests, inspect diffs, and iterate with tight feedback loops.

For the v3 framework details and examples, see **[Migrate to v3: New Testing Framework](./migrate-to-v3#new-testing-framework)**.

## Migrate from a subgraph (recipe)

When you are **converting a Graph Protocol subgraph** to HyperIndex, keep the old indexer and the new one in view so the agent can compare behavior.

### 1. Initialize a matching boilerplate indexer (i.e. add an indexer)

Create a HyperIndex project that indexes the **same contracts and events** as the subgraph. Agents can use the **same CLI flags** as in the [example above](#create-an-indexer-without-interactive-prompts), or follow the full flag list and one-liners in the **[Envio CLI](./cli-commands)** reference (including **[Initialization Commands](./cli-commands#initialization-commands)** and **[Complete One-Line Examples](./cli-commands#complete-one-line-examples)**).

### 2. Monorepo layout

Put the subgraph and the new indexer under one parent folder so one workspace gives the agent access to both codebases:

```
my-migration/
├── my-subgraph/             # Existing subgraph (read-only for the agent)
└── my-hyperindex-indexer/   # HyperIndex project (migration target)
```

### 3. Agent prompt (phased migration)

Open the **parent folder** in your assistant. **Put the agent in plan mode** before you give context and phases, for example:

```xml
<context>
This monorepo contains two indexers:
- `my-subgraph/`: an existing Graph Protocol subgraph indexer (source of truth)
- `my-hyperindex-indexer/`: a HyperIndex indexer created from the same
  contracts (migration target)
</context>

<task>
Migrate the subgraph indexer to a fully working HyperIndex indexer.
Follow these phases in order:

Phase 1: Plan
- Produce a migration plan mapping each subgraph component to its HyperIndex
  equivalent.
- Flag anything that has no direct equivalent and propose a workaround.
- Do NOT write code yet.

Phase 2: Implement
- Migrate the entire subgraph following the plan and skill guides.
- Process one handler file at a time.
- After each file, run `pnpm codegen` to validate, and verify it against
  the migration checklist before moving on.

Phase 3: Verify
- Walk through every checklist item from the migration skill and confirm it
  passes.
- Run any available build or type check commands.
- List any items you could not complete and why.
</task>

<rules>
- Only modify files in `my-hyperindex-indexer/`. Do not change the subgraph repo.
- Preserve all entity fields and event mappings from the subgraph.
- Do not skip or summarize checklist items. Execute every one.
- If you are uncertain about a migration decision, pause and ask me.
</rules>
```

:::tip
- After migration, run **`pnpm dev`** to confirm the indexer runs.
- Use the [Indexer Migration Validator](https://github.com/enviodev/indexer-migration-validator) to compare outputs between the subgraph and HyperIndex.
:::

### Manual migration reference

For a step-by-step manual conversion of `subgraph.yaml`, schema, and handlers, see **[Migrate from The Graph](./migration-guide)**.

## Related docs

- [Getting Started with Envio](./getting-started): overview of init paths and local run
- [Contract import (quickstart)](./contract-import): generate an indexer from contracts
- [Envio CLI](./cli-commands): full command and flag reference
- [Migrate to v3](./migrate-to-v3#new-testing-framework): v3 testing framework (`createTestIndexer`, Vitest, snapshots)
