#!/usr/bin/env node
/*
 Generates a deep-linkable Markdown reference from the JSON Schema used for config.yaml.
 - Input: static/schemas/config.evm.json
  - Output: docs/HyperIndex/Advanced/config-schema-reference.md
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
const OUTPUT_DOC_PATH = path.resolve(
  ROOT,
  "docs",
  "HyperIndex",
  "Advanced",
  "config-schema-reference.md"
);

// Hand-authored YAML examples for important properties and definitions
const EXAMPLE_SNIPPETS = {
  topLevel: {
    name: "name: MyIndexer",
    description: "description: Greeter indexer",
    ecosystem: "ecosystem: evm",
    schema: "schema: ./schema.graphql",
    output: "output: ./generated",
    contracts: `contracts:\n  - name: Greeter\n    handler: src/EventHandlers.ts\n    events:\n      - event: "NewGreeting(address user, string greeting)"`,
    networks: `networks:\n  - id: 1\n    start_block: 0\n    contracts:\n      - name: Greeter\n        address: 0x9D02A17dE4E68545d3a58D3a20BbBE0399E05c9c`,
    unordered_multichain_mode: "unordered_multichain_mode: true",
    event_decoder: "event_decoder: hypersync-client",
    rollback_on_reorg: "rollback_on_reorg: true",
    save_full_history: "save_full_history: false",
    field_selection: `field_selection:\n  transaction_fields:\n    - hash\n  block_fields:\n    - miner`,
    raw_events: "raw_events: true",
  },
  defs: {
    Network: `networks:\n  - id: 1\n    start_block: 0\n    end_block: 19000000\n    contracts:\n      - name: Greeter\n        address: 0x1111111111111111111111111111111111111111`,
    RpcConfig: `networks:\n  - id: 1\n    rpc_config:\n      url: https://eth.llamarpc.com\n      initial_block_interval: 1000`,
    Rpc: `networks:\n  - id: 1\n    rpc:\n      - url: https://eth.llamarpc.com\n        for: sync`,
    NetworkRpc: `networks:\n  - id: 1\n    rpc: https://eth.llamarpc.com`,
    HypersyncConfig: `networks:\n  - id: 1\n    hypersync_config:\n      url: https://eth.hypersync.xyz`,
    GlobalContract_for_ContractConfig: `contracts:\n  - name: Greeter\n    handler: src/EventHandlers.ts\n    events:\n      - event: "NewGreeting(address user, string greeting)"`,
    NetworkContract_for_ContractConfig: `networks:\n  - id: 1\n    start_block: 0\n    contracts:\n      - name: Greeter\n        address:\n          - 0x1111111111111111111111111111111111111111\n        handler: src/EventHandlers.ts\n        events:\n          - event: Transfer(address indexed from, address indexed to, uint256 value)`,
    Addresses: `networks:\n  - id: 1\n    contracts:\n      - name: Greeter\n        address:\n          - 0x1111111111111111111111111111111111111111\n          - 0x2222222222222222222222222222222222222222`,
    EventConfig: `contracts:\n  - name: Greeter\n    handler: src/EventHandlers.ts\n    events:\n      - event: "Assigned(address indexed recipientId, uint256 amount, address token)"\n        name: Assigned\n        field_selection:\n          transaction_fields:\n            - transactionIndex`,
    EventDecoder: `event_decoder: hypersync-client`,
    EcosystemTag: `ecosystem: evm`,
  },
};

/** Utility functions **/
function slugify(text, preserveUnderscores = false) {
  let result = String(text)
    .trim()
    .toLowerCase();

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

  // Handle $ref first
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
      ? schema.items.map(s => describeType(s, rootSchema)).join(", ")
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
function h3(title) {
  return `\n### ${title}\n`;
}
function h4(title) {
  return `\n#### ${title}\n`;
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

  // $ref
  if (schema.$ref) {
    const target = resolveRef(schema.$ref, rootSchema);
    if (target) {
      // link to defs if available
      const refName = schema.$ref.split("/").slice(-1)[0];
      out += `- **ref**: [${refName}](#def-${slugify(refName)})\n`;
    }
  }

  // Arrays
  if (schema.type === "array" && schema.items) {
    const itemType = Array.isArray(schema.items)
      ? schema.items.map(s => describeType(s, rootSchema)).join(", ")
      : describeType(schema.items, rootSchema);
    out += `- **items**: ${toInlineCode(itemType)}\n`;
    if (!Array.isArray(schema.items) && schema.items.$ref) {
      const refName = schema.items.$ref.split("/").slice(-1)[0];
      out += `- **items ref**: [${refName}](#def-${slugify(refName)})\n`;

      // Special handling for TransactionField and BlockField enums
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

  // Objects
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
          `- ${toInlineCode(propName)}: ${toInlineCode(describeType(prop))}${prop.description ? ` – ${prop.description}` : ""
          }` + "\n";
      });
    }
  }

  // anyOf/oneOf
  if (schema.anyOf || schema.oneOf) {
    const variants = schema.anyOf || schema.oneOf;
    out += `\nVariants:\n`;
    variants.forEach((v, i) => {
      const label = v.$ref ? v.$ref.split("/").slice(-1)[0] : describeType(v, rootSchema);
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

function generateMarkdown(schema) {
  let md = "";
  md += "---\n";
  md += "id: config-schema-reference\n";
  md += "title: Configuration Schema Reference\n";
  md += "sidebar_label: Config Schema Reference\n";
  md += "slug: /config-schema-reference\n";
  md += "---\n\n";

  md +=
    "Static, deep-linkable reference for the `config.yaml` JSON Schema.\n\n";
  md +=
    "> Tip: Use the Table of Contents to jump to a field or definition.\n\n";

  // Top-level properties overview
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

  // Render each top-level property as its own section
  propNames.forEach((name) => {
    md += renderProperty(name, props[name], schema, 3);
    if (EXAMPLE_SNIPPETS.topLevel[name]) {
      md += renderYamlExample(EXAMPLE_SNIPPETS.topLevel[name]);
    }
  });

  // Definitions
  const defs = schema.$defs || {};
  const defNames = Object.keys(defs);
  if (defNames.length) {
    md += h2("Definitions");
    defNames.forEach((defName) => {
      // Skip separate TransactionField and BlockField sections since they're now shown inline in FieldSelection
      if (defName === "TransactionField" || defName === "BlockField") {
        return; // Skip these definitions
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
              `- ${toInlineCode(dpName)}: ${toInlineCode(describeType(dp, schema))}${dp.description ? ` – ${dp.description}` : ""
              }` + "\n";

            // Special handling for TransactionField and BlockField arrays within FieldSelection
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

      // arrays
      if (defSchema.type === "array" && defSchema.items) {
        const itemType = Array.isArray(defSchema.items)
          ? defSchema.items.map(s => describeType(s, schema)).join(", ")
          : describeType(defSchema.items, schema);
        md += `- **items**: ${toInlineCode(itemType)}\n`;
      }

      // anyOf/oneOf on defs
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

      // Example for definition
      if (EXAMPLE_SNIPPETS.defs[defName]) {
        md += renderYamlExample(EXAMPLE_SNIPPETS.defs[defName]);
      }
    });
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
  const schema = JSON.parse(raw);
  const md = generateMarkdown(schema);
  ensureDirSync(OUTPUT_DOC_PATH);
  fs.writeFileSync(OUTPUT_DOC_PATH, md, "utf8");
  console.log(`Wrote schema reference to ${OUTPUT_DOC_PATH}`);
}

main();
