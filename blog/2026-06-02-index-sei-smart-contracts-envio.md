---
title: How to Index Sei Smart Contract Data in Minutes using Envio
sidebar_label: How to Index Sei Smart Contract Data in Minutes using Envio
tags: ["tutorials"]
slug: /index-sei-smart-contracts-envio
description: "A step-by-step guide to indexing a Sei ERC20 contract with Envio HyperIndex. Build a local indexer that streams Sei USDC Transfer and Approval events into Postgres and serves them through a GraphQL API."
image: /blog-assets/index-sei-smart-contracts-envio.png
authors: ["j_o_r_d_y_s"]
last_update:
  date: 2026-06-02
  author: Jordyn Laurier
---

<img src="/blog-assets/index-sei-smart-contracts-envio.png" alt="Envio cover banner with Sei logo and headline 'Indexing Sei Data in Minutes: A step-by-step guide'" width="100%"/>

<!--truncate-->

:::note TL;DR
- Scaffold the ERC20 template with `pnpx envio init template -t erc20 -d ./sei-indexer`
- Point `config.yaml` at Sei mainnet (chain ID `1329`, start block `79123881`) and USDC at `0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392`
- Define an `Account` and `Approval` schema, write `Transfer` and `Approval` handlers in `src/handlers/MyContract.ts`
- Run `pnpm codegen`, then `pnpm dev`, and query live Sei USDC data at `http://localhost:8080/v1/graphql`
:::

This guide walks you through building a HyperIndex indexer for a smart contract on Sei. By the end, you will have a local indexer that streams Sei blockchain data into a Postgres database and serves it through a GraphQL API.

## What you will build

An indexer for USDC on Sei mainnet (Circle's native USDC). It tracks `Transfer` and `Approval` events, keeps a running token balance per account, and records every approval.

Target contract:

- Chain: Sei mainnet, chain ID `1329`
- Contract address: `0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392`
- Explorer: [seitrace.com](https://seitrace.com/address/0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392)

Indexing testnet instead? See the [Indexing on Sei testnet](#indexing-on-sei-testnet) section at the bottom of this guide for the testnet config changes.

## Steps at a glance

1. Scaffold the indexer
2. Configure the indexer for Sei
3. Define the data schema
4. Write the event handler
5. Generate types
6. Run the indexer
7. Query your data
8. Stop the indexer

## Before you begin

Make sure you have the following prerequisites installed. Run each check in a terminal:

- Node.js v22 or later. Check with `node -v`.
- pnpm v8 or later. Check with `pnpm -v`.
- Docker installed and running. Check with `docker ps`.
- A free Envio API token. HyperIndex requires an API token to use HyperSync as a data source. Create one at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens).

## Step 1: Scaffold the indexer

Create a new HyperIndex project from the ERC20 template, then move into the project folder:

```bash
pnpx envio init template -t erc20 -d ./sei-indexer
cd sei-indexer
```

During the init flow you'll be prompted for an Envio API token. Paste an existing one or follow the prompt to create a new one at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens). The CLI writes it to `.env` for you.

A new `sei-indexer` folder is created with `config.yaml`, `schema.graphql`, a `.env` file, and a `src/handlers/` directory. Every file in `src/handlers/` is registered automatically, so there is no central `EventHandlers.ts` file. Generated types are written to the `.envio/` directory.

## Step 2: Configure the indexer for Sei

Replace the contents of `config.yaml` with the configuration below. This points the indexer at Sei mainnet and the USDC contract, and selects the two events to index:

```yaml
# yaml-language-server: $schema=./node_modules/envio/evm.schema.json
name: sei-indexer
description: Sei ERC20 indexer

contracts:
  - name: MyContract
    events:
      - event: Transfer(address indexed from, address indexed to, uint256 value)
      - event: Approval(address indexed owner, address indexed spender, uint256 value)

chains:
  - id: 1329 # Sei mainnet (pacific-1)
    start_block: 79123881
    contracts:
      - name: MyContract
        address:
          - "0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392"
```

Important: `start_block: 79123881` is the first EVM block on Sei mainnet. Earlier blocks are non-EVM and have no Solidity events to index. Setting it to `0` will waste time scanning blocks that can never match. Sei is a supported HyperSync network, so the endpoint resolves automatically from the chain ID. No `hypersync_config` block is needed.

## Step 3: Define the data schema

Replace the contents of `schema.graphql` with the schema below. Each type becomes a database table and a GraphQL query:

```graphql
type Account {
  id: ID!
  balance: BigInt!
  approvals: [Approval!]! @derivedFrom(field: "owner")
}

type Approval {
  id: ID!
  owner: Account!
  spender: String!
  value: BigInt!
  blockNumber: BigInt!
  timestamp: BigInt!
}
```

The `@derivedFrom` directive creates a virtual reverse lookup, so each `Account` exposes its list of approvals without you storing that list explicitly.

## Step 4: Write the event handler

The ERC20 template ships a handler and a test file that both reference the template contract. Remove them first:

```bash
rm -f src/handlers/ERC20.ts src/indexer.test.ts
```

Note: Removing `src/indexer.test.ts` matters. It imports the deleted ERC20 handler, so leaving it in place breaks `pnpm test`.

Now create a new handler file at `src/handlers/MyContract.ts` with the following content:

```typescript
import { indexer } from "envio";

indexer.onEvent(
  { contract: "MyContract", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;

    const sender = await context.Account.get(from);
    context.Account.set({
      id: from,
      balance: (sender?.balance ?? 0n) - value,
    });

    const receiver = await context.Account.get(to);
    context.Account.set({
      id: to,
      balance: (receiver?.balance ?? 0n) + value,
    });
  },
);

indexer.onEvent(
  { contract: "MyContract", event: "Approval" },
  async ({ event, context }) => {
    const { owner, spender, value } = event.params;

    const existing = await context.Account.get(owner);
    context.Account.set({
      id: owner,
      balance: existing?.balance ?? 0n,
    });

    context.Approval.set({
      id: `${event.block.hash}-${event.logIndex}`,
      owner_id: owner,
      spender,
      value,
      blockNumber: BigInt(event.block.number),
      timestamp: BigInt(event.block.timestamp),
    });
  },
);
```

Key points about the handler API:

- Handlers are registered with `indexer.onEvent`, imported from the `envio` package.
- Linked entities are set with the `<field>_id` convention, so the `owner` relation is written as `owner_id`.
- Event metadata is available on the `event` object, including `event.block` (`number`, `timestamp`, `hash`), `event.logIndex`, `event.srcAddress`, and more. See the [Event Handlers](https://docs.envio.dev/docs/HyperIndex/event-handlers) docs for the full list.

## Step 5: Generate types

Generate the typed code from your config and schema:

```bash
pnpm codegen
```

The command reads `config.yaml` and `schema.graphql`, writes typed code into `.envio/`, and exits with no errors. Run this again any time you change the config or schema.

## Step 6: Run the indexer

Start the indexer in development mode:

```bash
pnpm dev
```

Envio starts Postgres and Hasura in Docker, then begins streaming Sei blocks through HyperSync. Indexed data appears within seconds. Leave this terminal running.

You can explore the data in the Envio Console.

## Step 7: Query your data

With the indexer still running, open a new terminal and query the GraphQL API. This asks for the top 3 accounts by USDC balance and the 3 most recent approvals:

```bash
curl -s -X POST http://localhost:8080/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ Account(limit: 3, order_by: { balance: desc }) { id balance } Approval(limit: 3, order_by: { blockNumber: desc }) { id spender value blockNumber } }"}'
```

You will get back JSON with `Account` and `Approval` rows from live Sei USDC activity. If the response is empty, wait a few seconds for the indexer to sync further and run the query again. USDC has six decimals on Sei, so a balance of `1000000` represents 1 USDC.

## Step 8: Stop the indexer

Stop `pnpm dev` with Ctrl+C in its terminal, then clean up the local environment:

```bash
pnpm envio stop
```

Important: This stops the Docker containers and removes the local database. Do not use `docker compose down`. HyperIndex manages its containers directly, so `docker compose down` fails.

## Indexing on Sei testnet

To target Sei testnet (atlantic-2) instead of mainnet, swap three values in the `chains` block of `config.yaml`:

```yaml
chains:
  - id: 1328 # Sei testnet (atlantic-2)
    start_block: 186100000
    contracts:
      - name: MyContract
        address:
          - "0x4fCF1784B31630811181f670Aea7A7bEF803eaED" # Testnet USDC
```

Notes for testnet:

- Chain ID is `1328` (vs. `1329` on mainnet).
- Testnet USDC address: `0x4fCF1784B31630811181f670Aea7A7bEF803eaED` (verified on Seitrace).
- `start_block: 186100000` is the first EVM block on Sei testnet. Earlier blocks are non-EVM.
- The HyperSync endpoint (`https://sei-testnet.hypersync.xyz`) auto-resolves from the chain ID.
- To get testnet USDC, use the Circle Faucet so the contract has activity to index.

Docs: [Sei Testnet on Envio](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks) | [USDC on Sei (Sei docs)](https://docs.sei.io/evm/usdc-on-sei)

## Troubleshooting

- **"An API token is required for using HyperSync as a data-source"**: set `ENVIO_API_TOKEN` in `.env`. The init flow normally prompts for this; if you skipped it, paste a token from [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens) into `.env`.

- **The indexer resumes but makes no progress (progress shows -1)**: the database holds stale state from an earlier aborted run. Run `pnpm envio dev -r` to wipe the database and re-index from scratch.

- **No events showing up on mainnet**: confirm `start_block` is at least `79123881`. Blocks before that are non-EVM on Sei mainnet and contain no Solidity events. On testnet, the equivalent floor is `186100000`.

- **"Failed to automatically find HyperSync endpoint for the chain 1329"**: if the endpoint doesn't auto-resolve for your CLI version, set it explicitly under the chain entry in `config.yaml`:

  ```yaml
  chains:
    - id: 1329
      start_block: 79123881
      hypersync_config:
        url: https://sei.hypersync.xyz
      contracts:
        # ...
  ```

  Use `https://sei-testnet.hypersync.xyz` for testnet (chain `1328`).

## Resources

- [HyperIndex overview](https://docs.envio.dev/docs/HyperIndex/overview)
- [Sei on Envio](https://docs.envio.dev/docs/HyperIndex/sei)
- [HyperSync supported networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks)
- [Configuration file](https://docs.envio.dev/docs/HyperIndex/configuration-file)
- [Schema reference](https://docs.envio.dev/docs/HyperIndex/schema)
- [Event handlers](https://docs.envio.dev/docs/HyperIndex/event-handlers)
- [Envio CLI reference](https://docs.envio.dev/docs/HyperIndex/cli-commands)
- [Running locally](https://docs.envio.dev/docs/HyperIndex/running-locally)
- [USDC on Sei (Sei docs)](https://docs.sei.io/evm/usdc-on-sei)

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use Envio Cloud or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://x.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+kAIGElzPjApiMjI0) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
