---
id: solana-instruction-handlers
title: Solana Instruction Handlers
sidebar_label: Instruction Handlers
slug: /solana/instruction-handlers
description: Register and write Solana instruction handlers with indexer.onInstruction - the instruction object, decoded params, token balances, CPIs, context, and testing.
---

# Instruction Handlers

On Solana you react to **instructions** instead of EVM events. Register a handler
with `indexer.onInstruction`; it fires once for every matched instruction (top-level
or inner) of the configured program.

```typescript
import { indexer } from "envio";

indexer.onInstruction(
  { program: "<PROGRAM_NAME>", instruction: "<INSTRUCTION_NAME>" },
  async ({ instruction, context }) => {
    // your logic here
  },
);
```

`program` and `instruction` are the `name`s you gave them in `config.yaml` under
`experimental.programs` - not the on-chain program id or IDL name.

:::note Run codegen after config/schema changes
The `envio` module exposes a unified `indexer` value plus types derived from your
`config.yaml` and `schema.graphql`. Run **`pnpm codegen`** whenever you change
either file. After codegen, `program`/`instruction` autocomplete and
`instruction.params.args` / `.accounts` are typed per instruction.
:::

## A complete handler

```typescript
import { indexer } from "envio";

indexer.onInstruction(
  { program: "TokenMetadata", instruction: "CreateMetadataAccountV3" },
  async ({ instruction, context }) => {
    const params = instruction.params;
    if (!params) return; // discriminator matched but Borsh decode failed

    const { args, accounts } = params;
    const metadataPda = accounts.metadata;
    if (!metadataPda) return;

    context.TokenMetadataAccount.set({
      id: metadataPda,
      mint: accounts.mint ?? "",
      updateAuthority: accounts.update_authority,
      createdAtSlot: instruction.block.slot,
      lastTxSignature: instruction.transaction.signature,
    });
  },
);
```

:::note Reading `instruction.transaction`
`instruction.transaction.signature` is only populated when the instruction opts
into it via [field selection](/docs/HyperIndex/solana/configuration#field-selection)
(`transaction_fields: [signature]` in `config.yaml`). Without it the field is
typed `FieldNotSelected` and won't type-check.
:::

## The instruction object

The handler receives `{ instruction, context }`. The instruction carries its own
fields plus the block, parent transaction, and scoped logs:

```typescript
type SvmInstruction = {
  programName: string;               // the program name from config
  instructionName: string;           // the instruction name from config
  programId: string;                 // base58
  data: string;                      // 0x-prefixed hex (raw instruction data)
  accounts: readonly string[];       // base58 pubkeys, in on-chain order
  instructionAddress: readonly number[]; // CPI path, e.g. [0] or [0,1]
  isInner: boolean;                  // true => inner (CPI) instruction
  d1?: string; d2?: string; d4?: string; d8?: string; // discriminator prefixes (hex)
  params?: SvmInstructionParams;     // present when a schema matched (see Decoding)
  block: { slot: number; time?: number; hash: string /* + block_fields */ };
  transaction: SvmTransaction;       // fields per your transaction_fields selection
  logs?: readonly SvmLog[];          // present with log_fields
};
```

- **`params`** is the Borsh-decoded view: `{ name, args, accounts, extraAccounts }`.
  It's optional - always null-check it. See [Decoding & IDLs](/docs/HyperIndex/solana/decoding)
  for the shape of `args` and `accounts`.
- **`accounts`** (raw, positional, base58) is always present even when `params` is
  not. `params.accounts` is the same list keyed by your schema's account names.
- **`instructionAddress`** locates the instruction in the transaction's call tree -
  see [Inner instructions](#inner-instructions-cpis).
- **`block`** always carries `slot`, `time` (unix seconds, may be `undefined`), and
  `hash`; select `height`/`parentSlot`/`parentHash` via `field_selection.block_fields`.

### `instruction.transaction`

Always present as an object, but each field is only readable when selected via
`field_selection.transaction_fields` (see
[field selection](/docs/HyperIndex/solana/configuration#field-selection)).
Unselected fields are typed as `FieldNotSelected`, so reading one is a compile
error pointing at the config key to add.

```typescript
type SvmTransaction = {
  signature: string;                 // the transaction id, a scalar
  allSignatures: readonly string[];  // every signer's signature; selected separately
  transactionIndex: number;
  feePayer?: string;
  success?: boolean;
  err?: string;
  fee?: bigint;                      // lamports
  computeUnitsConsumed?: bigint;
  accountKeys: readonly string[];
  recentBlockhash?: string;
  version?: string;
  tokenBalances?: readonly SvmTokenBalance[]; // with token_balance_fields: true
};
```

The object itself is always there (`{}` when you selected nothing), so a missing
selection is a compile error on the property, not a crash on `undefined`.

:::tip `signature`, not `signatures[0]`
The identifying signature is the scalar `instruction.transaction.signature`. The
array of every signer's signature is a separate field, `allSignatures`, selected
with its own entry in `transaction_fields` - selecting `signature` does not
give you `allSignatures`. Nearly every handler wants the scalar.
:::

### Token balances and balance changes

With `token_balance_fields: true`, each instruction's transaction carries **pre/post SPL
Token (and Token-2022) balance snapshots**. The `postAmount − preAmount` per token
account is the balance *change* — so this is the cleanest way to capture net value
flow without indexing every transfer instruction. The snapshots cover every token
account touched by the transaction.

```typescript
type SvmTokenBalance = {
  account?: string;     // token account (base58)
  mint?: string;
  owner?: string;       // owner at end of tx; falls back to owner on entry if it was closed
  decimals?: number;    // mint decimals, for scaling the raw amounts
  preAmount?: bigint;   // raw base units before the tx; absent if the account was created in it
  postAmount?: bigint;  // raw base units after the tx;  absent if the account was closed in it
};
```

```typescript
indexer.onInstruction(
  { program: "Jupiter", instruction: "sharedAccountsRoute" },
  async ({ instruction, context }) => {
    const txSig = instruction.transaction.signature;

    for (const b of instruction.transaction.tokenBalances ?? []) {
      if (!b.account) continue;
      const delta = (b.postAmount ?? 0n) - (b.preAmount ?? 0n); // signed
      context.TokenDelta.set({
        id: `${txSig}:${b.account}`,
        account: b.account,
        mint: b.mint ?? "",
        owner: b.owner,
        decimals: b.decimals,
        delta,
      });
    }
  },
);
```

:::tip Amounts are `bigint`, and `decimals` comes with them
`preAmount`/`postAmount` are raw base units typed as **`bigint`** - no
`BigInt(...)` wrapper, and `?? 0n` rather than `?? "0"` for the absent case. Both
being absent means the balance entry carries no movement at all, which is worth
distinguishing from a genuine zero.

`decimals` arrives on the same object, so scaling to a human-readable amount no
longer needs a per-mint lookup.

Two things to watch: don't let a `bigint` reach an entity field typed as a string
in `schema.graphql`, and don't `JSON.stringify` one - that throws.
:::

:::note Native SOL balances
Today the handler surfaces **token** balances. Native SOL (lamport) pre/post
balances are available from [HyperSync for Solana](/docs/HyperSync/solana) directly
(the `balance` table) but are not yet exposed as a handler field-selection toggle —
[let us know](https://discord.gg/envio) if you need them in handlers.
:::

### Logs

With `log_fields: true`, `instruction.logs` holds the program logs scoped to this
instruction:

```typescript
type SvmLog = { kind: string; message: string };
// kind is one of: invoke | success | failure | log | data | other
```

## Inner instructions (CPIs)

HyperIndex decodes inner instructions (instructions invoked by other programs via
cross-program invocation) exactly like top-level ones. Two fields let you
reconstruct the call tree:

- **`isInner`** — `false` for a top-level instruction, `true` for a CPI.
- **`instructionAddress`** — an array describing the path: `[0]` is the first
  top-level instruction, `[0, 1]` is the second inner instruction invoked by it,
  `[0, 1, 2]` one level deeper, and so on.

```typescript
const addr = instruction.instructionAddress;        // e.g. [0, 1]
const path = addr.join(".");                        // "0.1"
const depth = addr.length - 1;                      // 1
const parentPath = addr.length > 1 ? addr.slice(0, -1).join(".") : undefined;
```

By default an instruction config (no `is_inner` set) matches **both** inner and
outer occurrences, so you capture the full tree. Set `is_inner: true`/`false` in
[config](/docs/HyperIndex/solana/configuration#instructions) to narrow it.

:::info EVM difference
EVM "internal calls" aren't surfaced as first-class events. On Solana, CPIs are
real indexable instructions — a Jupiter route's underlying Raydium/Orca swaps are
all visible if you index those programs.
:::

## The context object

The handler's `context` is the same shape as EVM handlers (see the
[Event Handlers context](/docs/HyperIndex/event-handlers#context-object)). For
each entity in `schema.graphql` you get:

```typescript
context.<Entity>.set(entity);                 // insert or update
await context.<Entity>.get(id);               // -> entity | undefined
await context.<Entity>.getOrThrow(id, msg?);  // -> entity (throws if missing)
await context.<Entity>.getOrCreate(entity);   // get, or set+return the default
await context.<Entity>.getWhere({ field: { _eq: v } }); // query @index fields
context.<Entity>.deleteUnsafe(id);
```

Plus:

- `context.log` — structured logger (`info`/`warn`/`error`/`debug`).
- `context.effect` — call an [Effect](/docs/HyperIndex/effect-api) (external/RPC calls, deduped and cached). Works in Solana handlers.
- `context.chain` — `{ id, isRealtime }`. For Solana, `id` is `0`.
- `context.isPreload` — see below.

### Preload optimization (double-run)

Preload optimization is always on in HyperIndex V3, which means **your handler
runs twice** — once in a parallel preload pass to warm the entity cache, then in
order. Reads are idempotent, so this is usually invisible, but guard
non-idempotent side effects (e.g. external POSTs) with `if (context.isPreload) return;`.
See [Preload Optimization](/docs/HyperIndex/preload-optimization).

## Idempotent writes

Backfills and the double-run pass mean handlers should be **idempotent**: build
deterministic entity ids and use `set` (which is insert-or-update). A common
Solana id is the transaction signature combined with the instruction path:

```typescript
const id = `${instruction.transaction.signature}:${instruction.instructionAddress.join(".")}`;
```

## Testing

Solana indexers are tested by running the indexer over a pinned slot window
against live HyperSync and asserting on the changes it produces. Pass the window
as per-chain `startBlock`/`endBlock` overrides to `process` (the Solana chain id
is `0`):

```typescript
import { describe, it, expect } from "vitest";
import { createTestIndexer } from "envio";

describe("my solana indexer", () => {
  it("indexes instructions in the pinned window", async () => {
    const indexer = createTestIndexer();
    await indexer.process({
      chains: { 0: { startBlock: 437_452_000, endBlock: 437_452_060 } },
    });

    // Read the resulting rows straight off the test indexer.
    const rows = await indexer.TokenMetadataAccount.getAll();
    expect(rows.length).toBeGreaterThan(0);
  }, 120_000); // generous timeout - this hits the network
});
```

Each entity on the test indexer exposes `get` / `getOrThrow` / `getAll` /
`getWhere` / `set`. `process` also returns per-batch checkpoints on
`result.changes` (`[{ block, chainId, <EntityName>: { sets, deleted } }, …]`) if
you'd rather assert on what each batch wrote.

To keep a separate test config instead, point the `ENVIO_CONFIG` environment
variable at a `config.test.yaml` (with its own `start_block`/`end_block`) before
importing `envio`. Interpolating an env var into `end_block` in the main
`config.yaml` works too, as long as you set it before the `envio` import.

Two practical notes:

- SVM has **no synthetic/simulate items** in the test harness. Chain overrides
  only accept a slot range, so these tests run the real handlers against a live
  endpoint and need `ENVIO_API_TOKEN`. Without a token, `POST /query` 401s are
  retried rather than failing fast, so a token-less run hangs until the test
  timeout instead of erroring.
- Because they hit the real endpoint, assert on **shape and invariants** ("produced
  rows", "delta equals post minus pre", "saw at least 2 programs") rather than exact
  counts. Zero rows means the build is wrong, and a wrong `discriminator` is the
  usual cause: it fires nothing while every log stays green.

## Related

- [Decoding & IDLs](/docs/HyperIndex/solana/decoding) - what `params.args` / `params.accounts` contain.
- [Configuration](/docs/HyperIndex/solana/configuration) — field selection, account filters, `is_inner`.
- [Slot Handlers](/docs/HyperIndex/solana/slot-handlers) — the other Solana handler type.
