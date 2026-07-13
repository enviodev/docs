---
id: solana-getting-started
title: Getting Started on Solana
sidebar_label: Getting Started
slug: /solana/getting-started
description: Scaffold, configure, and run your first Solana indexer with HyperIndex.
---

# Getting Started on Solana

This guide takes you from nothing to a running Solana indexer with a live GraphQL
API. If you've used HyperIndex on EVM the workflow is identical — only the config
and handlers differ.

## Prerequisites

- [Node.js](https://nodejs.org) v20+ and [pnpm](https://pnpm.io) (or npm/yarn/bun)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the local Postgres + GraphQL stack)
- A HyperSync API token — the CLI's login flow sets this up for you, or generate one in the [Envio Cloud portal](https://envio.dev/app/api-tokens). See [API tokens](/docs/HyperSync/api-tokens).

## 1. Scaffold a project

```bash
pnpx envio init
```

Choose **Solana** at the ecosystem prompt, then choose a template:

- **Metaplex Token Metadata (instructions)** — indexes the Metaplex Token Metadata program's `CreateMetadataAccountV3` / `UpdateMetadataAccountV2` instructions. A realistic instruction-indexing starting point.
- **Feature: Block Handler (`onSlot`)** — a minimal [slot handler](/docs/HyperIndex/solana/slot-handlers) that fetches each block over RPC.

Non-interactive equivalents:

```bash
pnpx envio init svm template --template metaplex-token-metadata --name my-indexer
pnpx envio init svm template --template feature-block-handler  --name my-indexer
```

:::note Solana is TypeScript-only
The `--language` flag is ignored for Solana; projects are always scaffolded in
TypeScript. There is no `contract-import` flow for Solana — unlike EVM/Fuel you
wire up programs in `config.yaml` by hand (see [Configuration](/docs/HyperIndex/solana/configuration)).
:::

The template scaffolds:

```
my-indexer/
├── config.yaml          # chain + program/instruction selection
├── schema.graphql       # the entities you index into
├── src/
│   └── handlers/…ts     # your onInstruction / onSlot handlers
├── .env                 # ENVIO_API_TOKEN, RPC URL
└── package.json
```

`envio init` also runs codegen, installs dependencies, and initializes git.

## 2. Pick a start slot

`start_block` in `config.yaml` is a **slot number**, not a block number, and
HyperSync for Solana keeps a rolling window of recent history — so don't hard-code
an old slot. Query the current head and start somewhere sensible below it:

```bash
curl -s https://solana.hypersync.xyz/height
# => {"height": 421234567}
```

Set `start_block` in `config.yaml` to, say, a few thousand slots below the head
for a quick backfill, or to the slot your program was deployed at for a full history
(within the retention window).

## 3. Run it

```bash
pnpm install            # if you didn't let init do it
pnpm envio codegen      # regenerate types from config.yaml + schema.graphql
pnpm envio dev          # start Postgres + the indexer + GraphQL (Docker)
```

`envio dev` brings up the local stack and runs the indexer with hot reload. The
GraphQL playground (Hasura) is at **http://localhost:8080** (default admin
secret `testing`). See [Navigating Hasura](/docs/HyperIndex/navigating-hasura).

To run the pieces separately:

```bash
pnpm envio local docker up   # start Postgres + Hasura
pnpm envio codegen
pnpm envio start             # run the indexer against the running stack
```

:::tip Re-run codegen after config/schema changes
Editing `config.yaml` or `schema.graphql` — including adding a program,
instruction, or IDL — requires `pnpm envio codegen` to regenerate the typed
`envio` module and the entity types in `.envio/`.
:::

## 4. Add your own program

Open `config.yaml` and add a program under `experimental.programs` with the
instructions you want, then write a handler. The shortest path:

1. **Point at an Anchor IDL** if you have one — HyperIndex derives the argument and account layout for you ([IDL decoding](/docs/HyperIndex/solana/decoding#anchor-idls)).
2. **Or declare an inline schema** (`args` + `accounts`) for programs without an IDL ([inline schema](/docs/HyperIndex/solana/decoding#inline-schema-no-idl)).
3. Add a `discriminator` per instruction so HyperIndex knows which instruction to match ([discriminators](/docs/HyperIndex/solana/decoding#discriminators)).
4. Register a handler with [`indexer.onInstruction`](/docs/HyperIndex/solana/instruction-handlers).

```yaml title="config.yaml"
ecosystem: svm
chains:
  - start_block: 417995000
    experimental:
      hypersync_config:
        url: https://solana.hypersync.xyz
      programs:
        - name: TokenMetadata
          program_id: metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s
          instructions:
            - name: CreateMetadataAccountV3
              discriminator: "0x21"
              field_selection:
                transaction_fields:
                  - signatures
```

```typescript title="src/handlers/TokenMetadataHandlers.ts"
import { indexer } from "envio";

indexer.onInstruction(
  { program: "TokenMetadata", instruction: "CreateMetadataAccountV3" },
  async ({ instruction, context }) => {
    const params = instruction.params;
    if (!params) return; // discriminator matched but decode failed - skip

    context.TokenMetadataAccount.set({
      id: params.accounts.metadata,
      mint: params.accounts.mint ?? "",
      createdAtSlot: instruction.block.slot,
      lastTxSignature: instruction.transaction.signatures[0],
    });
  },
);
```

## Next steps

- [Configuration](/docs/HyperIndex/solana/configuration) — every `config.yaml` field for Solana.
- [Instruction Handlers](/docs/HyperIndex/solana/instruction-handlers) — the full instruction object, token balances, CPIs, and testing.
- [Decoding & IDLs](/docs/HyperIndex/solana/decoding) — discriminators, IDLs, inline schemas, supported types.
- [Deploy to Envio Cloud](/docs/HyperIndex/hosted-service) — host your Solana indexer the same way as EVM.
