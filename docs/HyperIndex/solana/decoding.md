---
id: solana-decoding
title: Solana Decoding & IDLs
sidebar_label: Decoding & IDLs
slug: /solana/decoding
description: How HyperIndex decodes Solana instructions — discriminators, Anchor IDLs, inline schemas, supported argument types, and the decoded output shape.
---

# Decoding & IDLs

Solana instruction data is a packed [Borsh](https://borsh.io/) byte string with no
self-describing structure — unlike an EVM log, there's no ABI travelling with it.
To turn raw bytes into typed `args` and named `accounts`, HyperIndex needs two
things per instruction:

1. A **discriminator** — the leading bytes that identify which instruction it is.
2. A **schema** — the argument layout and account names, from an Anchor IDL, an
   inline declaration, or a bundled schema.

## Discriminators

The discriminator is the first N bytes of the instruction data. HyperIndex matches
the leading bytes of every instruction in the matched program against the
discriminators you configured; the longest configured length is tried first, so a
program can mix 8-byte Anchor and 1-byte native instructions unambiguously.

- **Format:** hex only, with optional `0x` prefix. Base58 and decimal are not accepted here (base58 is only for `program_id`).
- **Length:** exactly **1, 2, 4, or 8 bytes** (2, 4, 8, or 16 hex digits).
- **Anchor programs:** the discriminator is the 8-byte Anchor sighash —
  `sha256("global:" + snake_case(instructionName))[0..8]`.
- **Native / non-Anchor programs:** whatever leading byte(s) the program uses
  (e.g. SPL Token Transfer is `0x03`; Raydium AMM v4 swap is `0x09`).

```yaml
instructions:
  - name: sharedAccountsRoute
    discriminator: "0xc1209b3341d69c81"  # 8-byte Anchor sighash
  - name: swap
    discriminator: "0x09"                # 1-byte native
```

### Computing an Anchor discriminator

Modern Anchor IDLs (0.30+) embed the discriminator, so HyperIndex reads it from
the IDL automatically. **Legacy Anchor IDLs don't include it**, so you compute it
from the instruction name:

```typescript
import { createHash } from "node:crypto";

function anchorDiscriminator(name: string): string {
  const snake = name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  const hash = createHash("sha256").update(`global:${snake}`).digest();
  return "0x" + hash.subarray(0, 8).toString("hex");
}

anchorDiscriminator("route");               // 0xe517cb977ae3ad2a
anchorDiscriminator("sharedAccountsRoute"); // 0xc1209b3341d69c81
```

## Where the schema comes from

HyperIndex resolves an instruction's argument/account layout in this order:

| Source | When | How to use |
| --- | --- | --- |
| **Anchor IDL** | Program has `idl:` set | HyperIndex derives `args` + `accounts` from the IDL for every instruction. |
| **Inline schema** | Instruction has `args` + `accounts` | You declare the layout directly. Mutually exclusive with `idl`. |
| **Bundled** | Program id matches a built-in schema | Currently only **Metaplex Token Metadata** — no `idl`/inline needed. |
| **None** | No schema available | The instruction still matches and fires the handler, but `decoded` is `undefined` (you can read raw `instruction.data` / `instruction.accounts`). |

### Anchor IDLs

Point a program at a standard Anchor IDL JSON file (relative to `config.yaml`).
Both legacy (no embedded discriminator) and modern (0.30+, with discriminator)
IDLs are supported through the same path. HyperIndex extracts instruction names,
argument layouts, ordered account names (including nested account groups), and the
IDL `types` registry.

```yaml
programs_experimental:
  - name: Jupiter
    program_id: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4
    idl: idls/jupiter.json
    instructions:
      - name: route
        discriminator: "0xe517cb977ae3ad2a" # legacy IDL → supply the sighash
      - name: sharedAccountsRoute
        discriminator: "0xc1209b3341d69c81"
```

With an IDL set, you only list each instruction's `name` (+ `discriminator` for
legacy IDLs) — the args and accounts come from the IDL. Don't add inline
`args`/`accounts`; they're mutually exclusive with `idl`.

### Inline schema (no IDL)

For programs without an IDL, declare the layout yourself. `args` is the Borsh
argument list (in order, after the discriminator); `accounts` is the ordered list
of account names. They must be provided **together**.

```yaml
programs_experimental:
  - name: Raydium
    program_id: 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8
    instructions:
      - name: swap
        discriminator: "0x09"
        args:
          - { name: amountIn, type: u64 }
          - { name: minAmountOut, type: u64 }
        accounts:           # positional: accounts[0] is tokenProgram, etc.
          - tokenProgram
          - amm
          - userSourceTokenAccount
          - userDestTokenAccount
```

:::warning Verify positional layouts
For native programs the account order is the program's canonical layout, not
something HyperIndex can verify. Check it against a real transaction. Trailing
accounts beyond your named list still arrive — see [`extraAccounts`](#decoded-output).
:::

## Supported argument types

Use these in inline `args` (and they're what HyperIndex understands from IDLs).
The right column is how each value appears in `decoded.args`.

| `type` | Rendered in `decoded.args` as |
| --- | --- |
| `bool` | boolean |
| `u8` `u16` `u32`, `i8` `i16` `i32` | number |
| `u64` `u128` `i64` `i128` | **decimal string** (precision-safe) |
| `f32` `f64` | number (`null` if NaN/Inf) |
| `string` | string |
| `bytes` | `0x`-prefixed hex string |
| `pubkey` (alias `publicKey`) | base58 string |
| `{ option: <type> }` | the value, or `null` |
| `{ vec: <type> }` | array |
| `{ array: [<type>, <len>] }` | array — **except `[u8, 32]`, rendered base58 as a pubkey** |
| `{ defined: "<TypeName>" }` | resolved from the IDL's `types` registry |
| `{ struct: [ {name,type}, … ] }` | object |
| `{ enum: [ {name, fields?}, … ] }` | `{ VariantName: { …fields } }` |

```yaml
args:
  - { name: amount,     type: u64 }
  - { name: authority,  type: pubkey }
  - { name: maybeOwner, type: { option: pubkey } }
  - { name: route,      type: { vec: { defined: "RoutePlanStep" } } }
  - { name: seedHash,   type: { array: [u8, 32] } }   # → base58 string
```

## Decoded output

When a schema matches, `event.instruction.decoded` is:

```typescript
type SvmDecodedInstruction = {
  name: string;                          // the instruction name
  args: unknown;                         // object keyed by arg name (typed after codegen)
  accounts: Record<string, string>;      // schema account name -> base58 pubkey
  extraAccounts: readonly string[];      // accounts beyond the named list (base58)
};
```

- **`args`** is keyed by your argument names. After `codegen` it's typed per
  instruction; if you bypass that (see below) it's `unknown` — narrow it with a
  local type and read defensively.
- **`accounts`** maps each schema account name to its base58 pubkey, e.g.
  `decoded.accounts.mint`. Names come from the IDL or your inline `accounts` list.
- **`extraAccounts`** collects accounts present on-chain beyond your named list —
  Anchor `remaining_accounts`, optional accounts, or accounts resolved from an
  address lookup table.

### Reading args safely

Because `args` is loosely typed (and `u64`+ values are strings), read each field
as possibly-absent so one missing field can't throw and kill the handler:

```typescript
import { type SvmDecodedInstruction } from "envio";

interface JupiterRouteArgs {
  inAmount: string;
  quotedOutAmount: string;
}

const bi = (x: unknown) =>
  x === undefined || x === null ? undefined : BigInt(x as string);

function mapRoute(decoded: SvmDecodedInstruction) {
  const a = decoded.args as Partial<JupiterRouteArgs>;
  return {
    inAmount: bi(a.inAmount),
    outAmount: bi(a.quotedOutAmount),
    sourceMint: decoded.accounts.sourceMint,
    destMint: decoded.accounts.destinationMint,
  };
}
```

## When `decoded` is `undefined`

Decoding returns `undefined` (rather than crashing) when:

- the discriminator didn't match a configured instruction with a schema;
- there were too few accounts for the named list;
- the argument bytes didn't decode cleanly (wrong/partial layout).

The indexer keeps running and logs at debug. Always `if (!decoded) return;` before
using it — or fall back to the raw `instruction.data` and `instruction.accounts`.

## Known limitations

- **`[u8; 32]` is always rendered as a base58 pubkey.** A 32-byte hash or Merkle
  root will look like a pubkey string.
- **Account-count tolerance.** Surplus accounts go to `extraAccounts`; too few
  means `decoded` is `undefined`.
- **Address lookup tables.** ALT-resolved addresses are included in the
  instruction's account list and mapped positionally — there's no separate ALT
  handling to configure.
- **Inline nominal types.** Reference IDL `types` via `{ defined: "Name" }`, or
  declare shapes inline with `{ struct: … }` / `{ enum: … }`. A standalone inline
  program-level `types` registry isn't available yet.

## Related

- [Configuration](/docs/HyperIndex/solana/configuration) — where `idl`, `discriminator`, `args`, `accounts` live.
- [Instruction Handlers](/docs/HyperIndex/solana/instruction-handlers) — using `decoded` in handlers.
