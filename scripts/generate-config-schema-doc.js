#!/usr/bin/env node
/*
 Generates two deep-linkable Markdown references from the published config
 JSON Schema:
 - V2 doc: docs/HyperIndexV2/Advanced/config-schema-reference.md, written
   directly from static/schemas/config.evm.json.
 - V3 doc: docs/HyperIndex/Advanced/config-schema-reference.md, written
   from the same schema after applying the V2 → V3 transformations defined
   in `toV3()` below (rename networks → chains, drop removed fields, add
   V3-only fields like storage / full_batch_size, etc.).

 If a published V3 JSON Schema becomes available, replace the `toV3()`
 transform with a direct read of that schema.
*/

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INPUT_SCHEMA_PATH = path.resolve(
  ROOT,
  "static",
  "schemas",
  "config.evm.json"
);

const V2_OUTPUT_PATH = path.resolve(
  ROOT,
  "docs",
  "HyperIndexV2",
  "Advanced",
  "config-schema-reference.md"
);
const V3_OUTPUT_PATH = path.resolve(
  ROOT,
  "docs",
  "HyperIndex",
  "Advanced",
  "config-schema-reference.md"
);

// Hand-authored YAML examples for important properties and definitions
const V2_EXAMPLES = {
  topLevel: {
    name: "name: MyIndexer",
    description: "description: Greeter indexer",
    ecosystem: "ecosystem: evm",
    schema: "schema: ./schema.graphql",
    output: "output: ./generated",
    contracts: `contracts:\n  - name: Greeter\n    handler: src/EventHandlers.ts\n    events:\n      - event: "NewGreeting(address user, string greeting)"`,
    networks: `networks:\n  - id: 1\n    start_block: 0\n    contracts:\n      - name: Greeter\n        address: "0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c"`,
    unordered_multichain_mode: "unordered_multichain_mode: true",
    event_decoder: "event_decoder: hypersync-client",
    rollback_on_reorg: "rollback_on_reorg: true",
    save_full_history: "save_full_history: false",
    field_selection: `field_selection:\n  transaction_fields:\n    - hash\n  block_fields:\n    - miner`,
    raw_events: "raw_events: true",
    preload_handlers: "preload_handlers: true",
  },
  defs: {
    FieldSelection: `# within a contract\nevents:\n  - event: "Assigned(address indexed user, uint256 amount)"\n    # can be within an event as shown here, or globally for all events\n    field_selection:\n      transaction_fields:\n        - transactionIndex\n      block_fields:\n        - miner`,
    Network: `networks:\n  - id: 1\n    start_block: 0\n    end_block: 19000000\n    contracts:\n      - name: Greeter\n        address: "0x1111111111111111111111111111111111111111"`,
    RpcConfig: `networks:\n  - id: 1\n    rpc_config:\n      url: https://eth.llamarpc.com\n      initial_block_interval: 1000`,
    Rpc: `networks:\n  - id: 1\n    rpc:\n      - url: https://eth.llamarpc.com\n        for: sync`,
    NetworkRpc: `networks:\n  - id: 1\n    rpc: https://eth.llamarpc.com`,
    HypersyncConfig: `networks:\n  - id: 1\n    hypersync_config:\n      url: https://eth.hypersync.xyz`,
    GlobalContract_for_ContractConfig: `contracts:\n  - name: Greeter\n    handler: src/EventHandlers.ts\n    events:\n      - event: "NewGreeting(address user, string greeting)"`,
    NetworkContract_for_ContractConfig: `networks:\n  - id: 1\n    start_block: 0\n    contracts:\n      - name: Greeter\n        address:\n          - "0x1111111111111111111111111111111111111111"\n        handler: src/EventHandlers.ts\n        events:\n          - event: Transfer(address indexed from, address indexed to, uint256 value)`,
    Addresses: `networks:\n  - id: 1\n    contracts:\n      - name: Greeter\n        address:\n          - "0x1111111111111111111111111111111111111111"\n          - "0x2222222222222222222222222222222222222222"`,
    EventConfig: `contracts:\n  - name: Greeter\n    handler: src/EventHandlers.ts\n    events:\n      - event: "Assigned(address indexed recipientId, uint256 amount, address token)"\n        name: Assigned\n        field_selection:\n          transaction_fields:\n            - transactionIndex`,
    EventDecoder: `event_decoder: hypersync-client`,
    EcosystemTag: `ecosystem: evm`,
  },
};

const V3_EXAMPLES = {
  topLevel: {
    name: "name: MyIndexer",
    description: "description: Greeter indexer",
    ecosystem: "ecosystem: evm",
    schema: "schema: ./schema.graphql",
    contracts: `contracts:\n  - name: Greeter\n    events:\n      - event: "NewGreeting(address user, string greeting)"`,
    chains: `chains:\n  - id: 1\n    start_block: 0\n    contracts:\n      - name: Greeter\n        address: "0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c"`,
    rollback_on_reorg: "rollback_on_reorg: true",
    save_full_history: "save_full_history: false",
    field_selection: `field_selection:\n  transaction_fields:\n    - hash\n  block_fields:\n    - miner`,
    raw_events: "raw_events: true",
    full_batch_size: "full_batch_size: 5000",
    storage: `storage:\n  postgres: true\n  clickhouse: true`,
  },
  defs: {
    FieldSelection: `events:\n  - event: "Assigned(address indexed user, uint256 amount)"\n    # can be within an event as shown here, or globally for all events\n    field_selection:\n      transaction_fields:\n        - transactionIndex\n      block_fields:\n        - miner`,
    Chain: `chains:\n  - id: 1\n    start_block: 0\n    end_block: 19000000\n    contracts:\n      - name: Greeter\n        address: "0x1111111111111111111111111111111111111111"`,
    Rpc: `chains:\n  - id: 1\n    rpc:\n      - url: https://eth.llamarpc.com\n        for: sync\n      - url: wss://eth.llamarpc.com\n        for: realtime\n      - url: https://fallback.example.com\n        for: fallback`,
    HypersyncConfig: `chains:\n  - id: 1\n    hypersync_config:\n      url: https://eth.hypersync.xyz`,
    GlobalContract_for_ContractConfig: `contracts:\n  - name: Greeter\n    events:\n      - event: "NewGreeting(address user, string greeting)"`,
    NetworkContract_for_ContractConfig: `chains:\n  - id: 1\n    start_block: 0\n    contracts:\n      - name: Greeter\n        address:\n          - "0x1111111111111111111111111111111111111111"\n        events:\n          - event: Transfer(address indexed from, address indexed to, uint256 value)`,
    Addresses: `chains:\n  - id: 1\n    contracts:\n      - name: Greeter\n        address:\n          - "0x1111111111111111111111111111111111111111"\n          - "0x2222222222222222222222222222222222222222"`,
    EventConfig: `contracts:\n  - name: Greeter\n    events:\n      - event: "Assigned(address indexed recipientId, uint256 amount, address token)"\n        name: Assigned\n        field_selection:\n          transaction_fields:\n            - transactionIndex`,
    EcosystemTag: `ecosystem: evm`,
    Storage: `storage:\n  postgres: true\n  clickhouse: true`,
  },
};

// Fields that V3 removed entirely from `config.yaml`.
const V3_REMOVED_FIELDS_NOTE = `\n## Removed in V3\n\nThe following V2 options have been removed and are no longer accepted in \`config.yaml\`:\n\n- \`output\` — generated types are always emitted to \`.envio/\`.\n- \`unordered_multichain_mode\` — unordered is now the only mode. The V2 \`multichain: ordered\` opt-in has also been removed.\n- \`event_decoder\` — the Rust-based decoder is the only implementation.\n- \`loaders\` — Preload Optimization is now always on.\n- \`preload_handlers\` — now always enabled.\n- \`preRegisterDynamicContracts\` — no longer needed.\n- \`rpc_config\` — replaced by \`rpc\` (see above).\n- \`networks\` — renamed to \`chains\`.\n- \`confirmed_block_threshold\` — renamed to \`max_reorg_depth\`.\n`;

/** Deep clone helper. */
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Transform a V2 schema document into the V3 schema shape.
 *
 * V2 → V3 changes applied:
 * - Top-level fields removed: output, unordered_multichain_mode,
 *   event_decoder, preload_handlers.
 * - Top-level field renamed: networks → chains (and `required` updated).
 * - Top-level fields added: full_batch_size, storage.
 * - `$defs.Network` → `$defs.Chain` (and all `$ref`s repointed). Inside it:
 *     - rpc_config removed
 *     - confirmed_block_threshold → max_reorg_depth
 *     - block_lag added
 *     - id / contracts descriptions updated (network → chain)
 *     - The rpc property accepts a string, single Rpc, or array of Rpc.
 * - `$defs` removed: RpcConfig, NetworkRpc, EventDecoder.
 * - `$defs.Storage` added.
 * - `$defs.For` description tightened.
 */
function toV3(originalSchema) {
  const schema = clone(originalSchema);

  // Top-level removals
  const removedTopLevel = [
    "output",
    "unordered_multichain_mode",
    "event_decoder",
    "preload_handlers",
  ];
  for (const key of removedTopLevel) {
    if (schema.properties && schema.properties[key]) {
      delete schema.properties[key];
    }
  }

  // networks → chains, preserve property order (rebuild)
  if (schema.properties && schema.properties.networks) {
    const networks = schema.properties.networks;
    if (networks.items && networks.items.$ref === "#/$defs/Network") {
      networks.items.$ref = "#/$defs/Chain";
    }
    networks.description =
      "Configuration of the blockchain chains that the project is deployed on.";
    const newProps = {};
    for (const k of Object.keys(schema.properties)) {
      if (k === "networks") {
        newProps.chains = networks;
      } else {
        newProps[k] = schema.properties[k];
      }
    }
    schema.properties = newProps;
  }
  if (Array.isArray(schema.required)) {
    schema.required = schema.required.map((r) =>
      r === "networks" ? "chains" : r
    );
  }

  // Top-level additions (slotted before address_format if present)
  schema.properties = schema.properties || {};
  const newTopAdds = {
    full_batch_size: {
      description:
        "Maximum number of events processed per batch. Replaces the V2 `MAX_BATCH_SIZE` environment variable.",
      type: ["integer", "null"],
      format: "uint32",
      minimum: 1,
    },
    storage: {
      description:
        "Configures which storage backends the indexer writes to. Postgres is enabled by default; enable ClickHouse by setting `clickhouse: true`.",
      anyOf: [{ $ref: "#/$defs/Storage" }, { type: "null" }],
    },
  };
  Object.assign(schema.properties, newTopAdds);

  // $defs transformations
  schema.$defs = schema.$defs || {};

  // Rename Network → Chain
  if (schema.$defs.Network) {
    const network = clone(schema.$defs.Network);

    if (network.properties) {
      delete network.properties.rpc_config;

      if (network.properties.confirmed_block_threshold) {
        const cbt = network.properties.confirmed_block_threshold;
        cbt.description =
          "The number of blocks from the head that the indexer should account for in case of reorgs. Replaces the V2 `confirmed_block_threshold` field.";
        network.properties.max_reorg_depth = cbt;
        delete network.properties.confirmed_block_threshold;
      }

      network.properties.block_lag = {
        description:
          "Number of blocks the indexer stays behind the chain head. Replaces the V2 `ENVIO_INDEXING_BLOCK_LAG` environment variable, applied per chain.",
        type: ["integer", "null"],
        format: "uint32",
        minimum: 0,
      };

      if (network.properties.id && network.properties.id.description) {
        network.properties.id.description = "The public blockchain chain ID.";
      }
      if (
        network.properties.contracts &&
        network.properties.contracts.description
      ) {
        network.properties.contracts.description =
          "All the contracts that should be indexed on the given chain";
      }
      if (network.properties.rpc) {
        network.properties.rpc = {
          description:
            "RPC configuration for your indexer. Accepts a single URL, a single Rpc object, or an array of Rpc objects. For chains supported by HyperSync, RPC serves as a fallback for added reliability. For others, it acts as the primary data-source. WebSocket URLs (`wss://...`) are also supported for realtime endpoints.",
          anyOf: [
            { type: "string" },
            { $ref: "#/$defs/Rpc" },
            {
              type: "array",
              items: { $ref: "#/$defs/Rpc" },
            },
            { type: "null" },
          ],
        };
      }
    }

    schema.$defs.Chain = network;
    delete schema.$defs.Network;
  }

  // Remove obsolete $defs
  for (const key of ["RpcConfig", "NetworkRpc", "EventDecoder"]) {
    if (schema.$defs[key]) {
      delete schema.$defs[key];
    }
  }

  // Add Storage def
  schema.$defs.Storage = {
    type: "object",
    properties: {
      postgres: {
        description: "Enable Postgres storage (default: true)",
        type: ["boolean", "null"],
      },
      clickhouse: {
        description:
          "Enable ClickHouse storage in addition to Postgres (default: false). Requires the `ENVIO_CLICKHOUSE_*` environment variables.",
        type: ["boolean", "null"],
      },
    },
    additionalProperties: false,
  };

  // `For` gains `realtime` (V2 only had sync | fallback)
  if (schema.$defs.For && Array.isArray(schema.$defs.For.oneOf)) {
    const hasRealtime = schema.$defs.For.oneOf.some(
      (v) => v && v.const === "realtime"
    );
    if (!hasRealtime) {
      schema.$defs.For.oneOf.splice(1, 0, { const: "realtime" });
    }
  }

  // Rpc.for description: include realtime
  if (
    schema.$defs.Rpc &&
    schema.$defs.Rpc.properties &&
    schema.$defs.Rpc.properties.for
  ) {
    schema.$defs.Rpc.properties.for.description =
      "Determines if this RPC is for historical sync (`sync`), realtime head indexing (`realtime`, supports WebSocket), or as a fallback (`fallback`).";
  }
  if (
    schema.$defs.Rpc &&
    schema.$defs.Rpc.properties &&
    schema.$defs.Rpc.properties.url
  ) {
    schema.$defs.Rpc.properties.url.description =
      "The RPC endpoint URL. WebSocket URLs (`wss://...`) are also supported when paired with `for: realtime`.";
  }

  // Handler is auto-discovered in V3 — relax the requirement and reword the
  // description on both contract definitions.
  for (const defName of [
    "GlobalContract_for_ContractConfig",
    "NetworkContract_for_ContractConfig",
  ]) {
    const def = schema.$defs[defName];
    if (!def) continue;
    if (Array.isArray(def.required)) {
      def.required = def.required.filter((r) => r !== "handler");
    }
    if (def.properties && def.properties.handler) {
      def.properties.handler = {
        description:
          "Optional explicit path to a handler file. If omitted, handlers are auto-discovered from `src/handlers/`.",
        type: ["string", "null"],
      };
    }
    if (
      def.properties &&
      def.properties.start_block &&
      def.properties.start_block.description
    ) {
      def.properties.start_block.description = def.properties.start_block.description
        .replace(/network start_block/g, "chain `start_block`")
        .replace(/network/g, "chain");
    }
  }

  if (
    schema.$defs.HypersyncConfig &&
    schema.$defs.HypersyncConfig.properties &&
    schema.$defs.HypersyncConfig.properties.url &&
    schema.$defs.HypersyncConfig.properties.url.description
  ) {
    schema.$defs.HypersyncConfig.properties.url.description =
      schema.$defs.HypersyncConfig.properties.url.description.replace(
        /network/g,
        "chain"
      );
  }

  // TransactionField enum: kind → type (renamed in V3)
  if (
    schema.$defs.TransactionField &&
    Array.isArray(schema.$defs.TransactionField.enum)
  ) {
    schema.$defs.TransactionField.enum = schema.$defs.TransactionField.enum.map(
      (v) => (v === "kind" ? "type" : v)
    );
  }

  // Repoint any remaining `$ref`s from Network to Chain
  function repointRefs(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(repointRefs);
      return;
    }
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (k === "$ref" && typeof v === "string" && v === "#/$defs/Network") {
        node[k] = "#/$defs/Chain";
      } else {
        repointRefs(v);
      }
    }
  }
  repointRefs(schema);

  return schema;
}

/** Utility functions **/
function slugify(text, preserveUnderscores = false) {
  let result = String(text).trim().toLowerCase();

  if (preserveUnderscores) {
    result = result.replace(/[^a-z0-9\s_-]/g, "");
  } else {
    result = result.replace(/[^a-z0-9\s-]/g, "");
  }

  result = result.replace(/\s+/g, "-").replace(/-+/g, "-");

  return result;
}

function toInlineCode(value) {
  return "`" + String(value) + "`";
}

function ensureDirSync(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Schema helpers **/
function resolveRef(ref, rootSchema) {
  if (!ref.startsWith("#/")) return null;
  const parts = ref.slice(2).split("/");
  let node = rootSchema;
  for (const part of parts) {
    if (node && Object.prototype.hasOwnProperty.call(node, part)) {
      node = node[part];
    } else {
      return null;
    }
  }
  return node;
}

function describeType(schema, rootSchema = null) {
  if (!schema) return "unknown";

  if (schema.$ref && rootSchema) {
    const refName = schema.$ref.split("/").slice(-1)[0];
    const resolved = resolveRef(schema.$ref, rootSchema);
    if (resolved) {
      return `object<${refName}>`;
    }
  }

  if (schema.enum) {
    return `enum (${schema.enum.length} values)`;
  }
  if (schema.const !== undefined) {
    return `const ${String(schema.const)}`;
  }
  if (schema.anyOf) {
    const parts = schema.anyOf.map((s) => describeType(s, rootSchema));
    return `anyOf(${parts.join(" | ")})`;
  }
  if (schema.oneOf) {
    const parts = schema.oneOf.map((s) => describeType(s, rootSchema));
    return `oneOf(${parts.join(" | ")})`;
  }
  if (schema.allOf) {
    const parts = schema.allOf.map((s) => describeType(s, rootSchema));
    return `allOf(${parts.join(" & ")})`;
  }
  if (schema.type === "array") {
    const items = Array.isArray(schema.items)
      ? schema.items.map((s) => describeType(s, rootSchema)).join(", ")
      : describeType(schema.items, rootSchema);
    return `array<${items}>`;
  }
  if (schema.type === "object") {
    return "object";
  }
  if (Array.isArray(schema.type)) {
    return schema.type.join(" | ");
  }
  return schema.type || "unknown";
}

function renderEnumValues(schema) {
  if (!schema || !schema.enum) return "";
  return schema.enum.map(toInlineCode).join(", ");
}

function renderNumberBounds(schema) {
  const parts = [];
  if (schema.minimum !== undefined) parts.push(`min: ${schema.minimum}`);
  if (schema.maximum !== undefined) parts.push(`max: ${schema.maximum}`);
  if (schema.format) parts.push(`format: ${toInlineCode(schema.format)}`);
  return parts.join(", ");
}

function renderRequiredList(requiredArr) {
  if (!Array.isArray(requiredArr) || requiredArr.length === 0) return "";
  return requiredArr.map(toInlineCode).join(", ");
}

/** Markdown builders **/
function h2(title) {
  return `\n## ${title}\n`;
}

function renderYamlExample(yaml) {
  if (!yaml) return "";
  return `\nExample (config.yaml):\n\n\`\`\`yaml\n${yaml}\n\`\`\`\n`;
}

function renderProperty(name, schema, rootSchema, level = 4) {
  const anchor = slugify(name);
  const heading =
    level === 3
      ? `\n### ${name} {#${anchor}}\n`
      : level === 4
        ? `\n#### ${name} {#${anchor}}\n`
        : `\n##### ${name} {#${anchor}}\n`;
  let out = heading;
  if (schema.description) out += `\n${schema.description}\n`;
  out += `\n- **type**: ${toInlineCode(describeType(schema, rootSchema))}\n`;
  if (schema.enum) out += `- **allowed**: ${renderEnumValues(schema)}\n`;
  const nb = renderNumberBounds(schema);
  if (nb) out += `- **bounds**: ${nb}\n`;

  if (schema.$ref) {
    const target = resolveRef(schema.$ref, rootSchema);
    if (target) {
      const refName = schema.$ref.split("/").slice(-1)[0];
      out += `- **ref**: [${refName}](#def-${slugify(refName)})\n`;
    }
  }

  if (schema.type === "array" && schema.items) {
    const itemType = Array.isArray(schema.items)
      ? schema.items.map((s) => describeType(s, rootSchema)).join(", ")
      : describeType(schema.items, rootSchema);
    out += `- **items**: ${toInlineCode(itemType)}\n`;
    if (!Array.isArray(schema.items) && schema.items.$ref) {
      const refName = schema.items.$ref.split("/").slice(-1)[0];
      out += `- **items ref**: [${refName}](#def-${slugify(refName)})\n`;

      if (refName === "TransactionField" || refName === "BlockField") {
        const enumSchema = resolveRef(schema.items.$ref, rootSchema);
        if (enumSchema && enumSchema.enum) {
          out += `\nAvailable ${refName} values:\n`;
          enumSchema.enum.forEach((value, index) => {
            out += `${index + 1}. ${toInlineCode(value)}\n`;
          });
        }
      }
    }
  }

  if (schema.type === "object") {
    const req = renderRequiredList(schema.required);
    if (req) out += `- **required**: ${req}\n`;
    const props = schema.properties || {};
    const propKeys = Object.keys(props);
    if (propKeys.length) {
      out += `\nProperties:\n`;
      propKeys.forEach((propName) => {
        const prop = props[propName];
        out +=
          `- ${toInlineCode(propName)}: ${toInlineCode(describeType(prop))}${
            prop.description ? ` – ${prop.description}` : ""
          }` + "\n";
      });
    }
  }

  if (schema.anyOf || schema.oneOf) {
    const variants = schema.anyOf || schema.oneOf;
    out += `\nVariants:\n`;
    variants.forEach((v, i) => {
      const label = v.$ref
        ? v.$ref.split("/").slice(-1)[0]
        : describeType(v, rootSchema);
      if (v.$ref) {
        out += `- ${toInlineCode(String(i + 1))}: [${label}](#def-${slugify(
          label
        )})\n`;
      } else {
        out += `- ${toInlineCode(String(i + 1))}: ${toInlineCode(
          describeType(v, rootSchema)
        )}\n`;
      }
    });
  }

  return out + "\n";
}

function generateMarkdown(schema, version) {
  const examples = version === "v3" ? V3_EXAMPLES : V2_EXAMPLES;

  let md = "";
  md += "---\n";
  md += "id: config-schema-reference\n";
  md += "title: Configuration Schema Reference\n";
  md += "sidebar_label: Config Schema Reference\n";
  md += "slug: /config-schema-reference\n";
  md += "---\n\n";

  const intro =
    version === "v3"
      ? "Static, deep-linkable reference for the V3 `config.yaml` schema.\n\n"
      : "Static, deep-linkable reference for the `config.yaml` JSON Schema.\n\n";
  md += intro;
  md += "> Tip: Use the Table of Contents to jump to a field or definition.\n\n";

  md += h2("Top-level Properties");
  const props = schema.properties || {};
  const requiredTop = schema.required || [];
  const propNames = Object.keys(props);
  if (!propNames.length) {
    md += "\n_No top-level properties defined._\n";
  } else {
    md += "\n";
    propNames.forEach((name) => {
      const isReq = requiredTop.includes(name) ? " (required)" : "";
      md += `- [${name}](#${slugify(name)})${isReq}\n`;
    });
  }

  propNames.forEach((name) => {
    md += renderProperty(name, props[name], schema, 3);
    if (examples.topLevel[name]) {
      md += renderYamlExample(examples.topLevel[name]);
    }
  });

  const defs = schema.$defs || {};
  const defNames = Object.keys(defs);
  if (defNames.length) {
    md += h2("Definitions");
    defNames.forEach((defName) => {
      if (defName === "TransactionField" || defName === "BlockField") {
        return;
      }

      const defSchema = defs[defName];
      md += `\n### ${defName} {#def-${slugify(defName)}}\n`;
      if (defSchema.description) md += `\n${defSchema.description}\n`;
      md += `\n- **type**: ${toInlineCode(describeType(defSchema, schema))}\n`;
      if (defSchema.enum) {
        md += `- **allowed**: ${renderEnumValues(defSchema)}\n`;
      }
      const nb = renderNumberBounds(defSchema);
      if (nb) md += `- **bounds**: ${nb}\n`;

      if (defSchema.type === "object") {
        const req = renderRequiredList(defSchema.required);
        if (req) md += `- **required**: ${req}\n`;
        const dProps = defSchema.properties || {};
        const dPropNames = Object.keys(dProps);
        if (dPropNames.length) {
          md += "\nProperties:\n";
          dPropNames.forEach((dpName) => {
            const dp = dProps[dpName];
            md +=
              `- ${toInlineCode(dpName)}: ${toInlineCode(
                describeType(dp, schema)
              )}${dp.description ? ` – ${dp.description}` : ""}` + "\n";

            if (dpName === "transaction_fields" || dpName === "block_fields") {
              if (dp.items && dp.items.$ref) {
                const refName = dp.items.$ref.split("/").slice(-1)[0];
                if (refName === "TransactionField" || refName === "BlockField") {
                  const enumSchema = resolveRef(dp.items.$ref, schema);
                  if (enumSchema && enumSchema.enum) {
                    const values = enumSchema.enum.map(toInlineCode).join(", ");
                    md += `  - Available values:
${values}
`;
                  }
                }
              }
            }
          });
        }
      }

      if (defSchema.type === "array" && defSchema.items) {
        const itemType = Array.isArray(defSchema.items)
          ? defSchema.items.map((s) => describeType(s, schema)).join(", ")
          : describeType(defSchema.items, schema);
        md += `- **items**: ${toInlineCode(itemType)}\n`;
      }

      if (defSchema.anyOf || defSchema.oneOf) {
        const variants = defSchema.anyOf || defSchema.oneOf;
        md += `\nVariants:\n`;
        variants.forEach((v, i) => {
          const label = v.$ref
            ? v.$ref.split("/").slice(-1)[0]
            : describeType(v, schema);
          if (v.$ref) {
            md += `- ${toInlineCode(String(i + 1))}: [${label}](#def-${slugify(
              label
            )})\n`;
          } else {
            md += `- ${toInlineCode(String(i + 1))}: ${toInlineCode(
              describeType(v, schema)
            )}\n`;
          }
        });
      }

      if (examples.defs[defName]) {
        md += renderYamlExample(examples.defs[defName]);
      }
    });
  }

  if (version === "v3") {
    md += V3_REMOVED_FIELDS_NOTE;
  }

  md += "\n";
  return md;
}

function main() {
  if (!fs.existsSync(INPUT_SCHEMA_PATH)) {
    console.error(`Schema not found at ${INPUT_SCHEMA_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(INPUT_SCHEMA_PATH, "utf8");
  const v2Schema = JSON.parse(raw);
  const v3Schema = toV3(v2Schema);

  const v2Md = generateMarkdown(v2Schema, "v2");
  ensureDirSync(V2_OUTPUT_PATH);
  fs.writeFileSync(V2_OUTPUT_PATH, v2Md, "utf8");
  console.log(`Wrote V2 schema reference to ${V2_OUTPUT_PATH}`);

  const v3Md = generateMarkdown(v3Schema, "v3");
  ensureDirSync(V3_OUTPUT_PATH);
  fs.writeFileSync(V3_OUTPUT_PATH, v3Md, "utf8");
  console.log(`Wrote V3 schema reference to ${V3_OUTPUT_PATH}`);
}

main();
