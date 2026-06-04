---
id: solana-instruction-handlers
title: Solana Instruction Handlers
sidebar_label: Instruction Handlers
slug: /solana/instruction-handlers
description: Register and write Solana instruction handlers with indexer.onInstruction — the event object, decoded args/accounts, token balances, CPIs, context, and testing.
---

# Instruction Handlers

On Solana you react to **instructions** instead of EVM events. Register a handler
with `indexer.onInstruction`; it fires once for every matched instruction (top-level
or inner) of the configured program.

```typescript
import { indexer } from "envio";

indexer.onInstruction(
  { program: "<PROGRAM_NAME>", instruction: "<INSTRUCTION_NAME>" },
  async ({ event, context }) => {
    // your logic here
  },
);
```

`program` and `instruction` are the `name`s you gave them in `config.yaml` under
`programs_experimental` — not the on-chain program id or IDL name.

:::note Run codegen after config/schema changes
The `envio` module exposes a unified `indexer` value plus types derived from your
`config.yaml` and `schema.graphql`. Run **`pnpm codegen`** whenever you change
either file. After codegen, `program`/`instruction` autocomplete and
`event.instruction.decoded.args` / `.accounts` are typed per instruction.
:::

## A complete handler

```typescript
import { indexer, type TokenMetadataAccount } from "envio";

indexer.onInstruction(
  { program: "TokenMetadata", instruction: "CreateMetadataAccountV3" },
  async ({ event, context }) => {
    const decoded = event.instruction.decoded;
    if (!decoded) return; // discriminator matched but Borsh decode failed

    const { args, accounts } = decoded;
    const metadataPda = accounts.metadata;
    if (!metadataPda) return;

    context.TokenMetadataAccount.set({
      id: metadataPda,
      mint: accounts.mint ?? "",
      updateAuthority: accounts.update_authority,
      createdAtSlot: event.slot,
      lastTxSignature: event.transaction?.signatures[0],
    });
  },
);
```

## The event object

```typescript
type SvmInstructionEvent = {
  contractName: string;   // the program name from config
  eventName: string;      // the instruction name from config
  slot: number;           // always present
  blockTime?: number;     // unix seconds, when available
  instruction: SvmInstruction;
  transaction?: SvmTransaction; // present with transaction_fields / token_balance_fields
  logs?: SvmLog[];              // present with log_fields
};
```

`slot`, `blockTime` and `instruction` are always available. `transaction` and
`logs` appear only when you opt in via
[field selection](/docs/HyperIndex/solana/configuration#field-selection).

### `event.instruction`

```typescript
type SvmInstruction = {
  programId: string;                 // base58
  data: string;                      // 0x-prefixed hex (raw instruction data)
  accounts: readonly string[];       // base58 pubkeys, in on-chain order
  instructionAddress: readonly number[]; // CPI path, e.g. [0] or [0,1]
  isInner: boolean;                  // true => inner (CPI) instruction
  d1?: string; d2?: string; d4?: string; d8?: string; // discriminator prefixes (hex)
  decoded?: SvmDecodedInstruction;   // present when a schema matched (see Decoding)
};
```

- **`decoded`** is the friendly view: `{ name, args, accounts, extraAccounts }`. It's
  optional — always null-check it. See [Decoding & IDLs](/docs/HyperIndex/solana/decoding)
  for the shape of `args` and `accounts`.
- **`accounts`** (raw, positional, base58) is always present even when `decoded` is
  not. `decoded.accounts` is the same list keyed by your schema's account names.
- **`instructionAddress`** locates the instruction in the transaction's call tree —
  see [Inner instructions](#inner-instructions-cpis).

### `event.transaction`

Present when `transaction_fields: true` (or `token_balance_fields: true`):

```typescript
type SvmTransaction = {
  signatures: readonly string[];   // signatures[0] is the transaction id
  feePayer?: string;
  success?: boolean;
  err?: string;
  fee?: bigint;                    // lamports
  computeUnitsConsumed?: bigint;
  accountKeys: readonly string[];
  recentBlockhash?: string;
  version?: string;
  tokenBalances?: readonly SvmTokenBalance[]; // with token_balance_fields
};
```

### Token balances and balance changes

With `token_balance_fields: true`, each event's transaction carries **pre/post SPL
Token (and Token-2022) balance snapshots**. The `postAmount − preAmount` per token
account is the balance *change* — so this is the cleanest way to capture net value
flow without indexing every transfer instruction. The snapshots cover every token
account touched by the transaction.

```typescript
type SvmTokenBalance = {
  account?: string;     // token account (base58)
  mint?: string;
  owner?: string;
  preAmount?: string;   // balance before the tx — u64 as a decimal string
  postAmount?: string;  // balance after the tx  — u64 as a decimal string
};
```

```typescript
indexer.onInstruction(
  { program: "Jupiter", instruction: "sharedAccountsRoute" },
  async ({ event, context }) => {
    const txSig = event.transaction?.signatures[0];
    if (!txSig) return;

    for (const b of event.transaction?.tokenBalances ?? []) {
      if (!b.account) continue;
      const pre = BigInt(b.preAmount ?? "0");
      const post = BigInt(b.postAmount ?? "0");
      context.TokenDelta.set({
        id: `${txSig}:${b.account}`,
        account: b.account,
        mint: b.mint ?? "",
        owner: b.owner,
        delta: post - pre, // signed
      });
    }
  },
);
```

:::tip Amounts are strings
`preAmount`/`postAmount` (and any `u64`+ decoded arg) are **decimal strings** to
avoid precision loss. Wrap them in `BigInt(...)` for arithmetic.
:::

:::note Native SOL balances
Today the handler event surfaces **token** balances. Native SOL (lamport) pre/post
balances are available from [HyperSync for Solana](/docs/HyperSync/solana) directly
(the `balance` table) but are not yet exposed as a handler field-selection toggle —
[let us know](https://discord.gg/envio) if you need them in handlers.
:::

### Logs

With `log_fields: true`, `event.logs` holds the program logs scoped to this
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
const addr = event.instruction.instructionAddress; // e.g. [0, 1]
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
const id = `${event.transaction?.signatures[0]}:${event.instruction.instructionAddress.join(".")}`;
```

## Testing

Solana indexers are tested by running the indexer over a pinned slot window
against live HyperSync and asserting on the changes it produces. Use a
`config.test.yaml` with a finite `end_block`, select it with `ENVIO_CONFIG`, and
drive it with `createTestIndexer`:

```typescript
process.env.ENVIO_CONFIG = "config.test.yaml"; // must be set before importing envio
import { describe, it, expect } from "vitest";
import { createTestIndexer } from "envio";

describe("my solana indexer", () => {
  it("indexes instructions in the pinned window", async () => {
    const indexer = createTestIndexer();
    const result = await indexer.process({ chains: { 0: {} } });

    // result.changes is an array of per-batch checkpoints:
    //   [{ <EntityName>: { sets: [...] }, eventsProcessed }, ...]
    const sets = result.changes.flatMap(
      (c: any) => c.TokenMetadataAccount?.sets ?? [],
    );
    expect(sets.length).toBeGreaterThan(0);
  }, 120_000); // generous timeout — this hits the network
});
```

```yaml title="config.test.yaml"
# same as config.yaml, but a small finite window for determinism
start_block: 417950000
end_block: 417950500
```

Because these tests hit the real endpoint, assert on **shape and invariants**
(e.g. "produced rows", "deltas equal post − pre", "saw ≥ 2 programs") rather than
exact counts.

## Related

- [Decoding & IDLs](/docs/HyperIndex/solana/decoding) — what `decoded.args` / `decoded.accounts` contain.
- [Configuration](/docs/HyperIndex/solana/configuration) — field selection, account filters, `is_inner`.
- [Slot Handlers](/docs/HyperIndex/solana/slot-handlers) — the other Solana handler type.
