---
id: reserved-words
title: Reserved Words
sidebar_label: Reserved Words
slug: /reserved-words
---

# Reserved Words in Envio

## Overview

When creating your Envio indexer, certain words cannot be used in entity names, field names, contract names, or event names because they are reserved by the underlying programming languages or by Envio itself. Using these reserved words will trigger validation errors (such as `EE102` for configuration files or `EE210` for schema files).

Reserved words in Envio are taken from JavaScript, TypeScript, and ReScript because Envio generates code in these languages to power your indexer. Using these reserved words would create syntax conflicts in the generated code.

## Why This Matters

When you define names in your:

- `config.yaml` file (for contracts and events)
- `schema.graphql` file (for entities and fields)

Envio automatically generates code based on these names. If you use reserved words, the generated code will contain syntax errors and will not compile, causing your indexer to fail.

## Common Error Scenarios

If you use reserved words, you'll encounter these errors:

- **Error `EE102`**: Reserved words in the configuration file
- **Error `EE210`**: Reserved words in the schema file
- **Error `EE212`**: Reserved enum names that conflict with Envio internal types

## How to Fix Reserved Word Errors

When you encounter these errors, you need to rename the offending identifiers:

1. Identify which names in your configuration or schema are using reserved words
2. Choose alternative names that aren't reserved
3. Update all references to these names in your code
4. Run codegen again to regenerate the code

### Example Problem

```yaml
# In config.yaml
contracts:
  - name: class # Error: 'class' is a reserved word in JavaScript
    abi_file_path: ./abis/MyContract.json
```

```graphql
# In schema.graphql
type interface { # Error: 'interface' is a reserved word in JavaScript and TypeScript
  id: ID!
  name: String!
}
```

### Example Solution

```yaml
# Fixed config.yaml
contracts:
  - name: ClassContract # Good: Not a reserved word
    abi_file_path: ./abis/MyContract.json
```

```graphql
# Fixed schema.graphql
type UserInterface { # Good: Not a reserved word
  id: ID!
  name: String!
}
```

## Tips for Avoiding Reserved Word Conflicts

- Use camelCase or PascalCase for naming (e.g., `userAccount` instead of `class`)
- Add a prefix or suffix to potentially conflicting names (e.g., `userInterface` instead of `interface`)
- Use domain-specific terms that are less likely to be programming keywords
- When in doubt, check against the lists below before finalizing your schema or configuration

## Complete List of Reserved Words

### JavaScript Reserved Words

These keywords cannot be used as identifiers in your Envio configuration or schema:

```
abstract, arguments, await, boolean, break, byte, case, catch, char,
class, const, continue, debugger, default, delete, do, double, else,
enum, eval, export, extends, false, final, finally, float, for, function,
goto, if, implements, import, in, instanceof, int, interface, let, long,
native, new, null, package, private, protected, public, return, short,
static, super, switch, synchronized, this, throw, throws, transient, true,
try, typeof, var, void, volatile, while, with, yield
```

### TypeScript Reserved Words

In addition to JavaScript keywords, these TypeScript-specific keywords are also reserved:

```
any, as, boolean, break, case, catch, class, const, constructor, continue,
declare, default, delete, do, else, enum, export, extends, false, finally,
for, from, function, get, if, implements, import, in, instanceof, interface,
let, module, new, null, number, of, package, private, protected, public,
require, return, set, static, string, super, switch, symbol, this, throw,
true, try, type, typeof, var, void, while, with, yield
```

### ReScript Reserved Words

These ReScript-specific keywords are also reserved:

```
and, as, assert, constraint, else, exception, external, false, for, if, in,
include, lazy, let, module, mutable, of, open, rec, switch, true, try, type,
when, while, with
```

### Envio Internal Reserved Types

These types are used internally by Envio and cannot be used as enum or entity names:

```
EVENT_TYPE
CONTRACT_TYPE
```

## Best Practices

1. **Use descriptive names** that are unlikely to be programming keywords
2. **Check these lists** before finalizing your schema design
3. **Run validation early** with `pnpm codegen` to catch issues before spending time on implementation
4. **Use prefixes for domain entities** (e.g., `TokenTransfer` instead of `Transfer`)

If you encounter persistent issues with reserved words or need help refactoring your schema to avoid them, please reach out for support on our [Discord community](https://discord.gg/DhfFhzuJQh).

---
