var { supportedNetworks } = require("./supported-networks.json");

// Plain collapsible category (no `link`) so its caret renders identically to
// every other category. The overview page is preserved as the first item so
// it's still reachable from the sidebar.
const networksSection = {
  type: "category",
  label: "Supported Networks",
  items: [
    { type: "doc", id: "supported-networks/index", label: "Overview" },
    ...supportedNetworks,
  ],
};

module.exports = {
  someSidebar: [
    "overview",
    "contract-import",
    "quickstart-with-ai",
    "whats-new-in-v3",
    "benchmarks",
    {
      type: "category",
      label: "Migrate to Envio",
      collapsed: false,
      items: ["migrate-with-ai", "migration-guide", "migrate-from-ponder", "migrate-from-alchemy", "migrate-to-v3"],
    },

    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: [
        "Guides/configuration-file",
        "Guides/schema-file",
        "Guides/event-handlers",
        "Guides/block-handlers",
        "Advanced/multichain-indexing",
        // "Guides/subgraph-mPigration",
        "Guides/testing",
        "Guides/navigating-hasura",
        "Guides/environment-variables",
      ],
    },
    {
      type: "category",
      label: "Examples",
      collapsed: false,
      items: [
        "Examples/example-uniswap-v4",
        "Examples/example-sablier",
        "Examples/example-velodrome-aerodrome",
        // "Examples/example-cross-chain-messaging",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        "Tutorials/tutorial-op-bridge-deposits",
        "Tutorials/tutorial-erc20-token-transfers",
        "Tutorials/tutorial-indexing-fuel",
        "Tutorials/greeter-tutorial",
        "Tutorials/price-data",
        "Tutorials/tutorial-scaffold-eth-2",
      ],
    },
    {
      type: "category",
      label: "Advanced",
      items: [
        "Advanced/dynamic-contracts",
        "Advanced/wildcard-indexing",
        "Advanced/preload-optimization",
        "Advanced/effect-api",
        "Guides/contract-state",
        "Guides/ipfs",
        "Advanced/hypersync",
        "Advanced/rpc-sync",
        "Advanced/config-schema-reference",
        "Guides/cli-commands",
        "Advanced/reorgs-support",
        "Advanced/generated-files",
        "Advanced/metadata-query",
        "Advanced/terminology",
        "Advanced/performance/database-performance-optimization",
        "Advanced/performance/latency-at-head",
        "Advanced/performance/benchmarking",
        "Advanced/loaders",
        "Advanced/websockets",
        "Advanced/query-conversion",
        "Advanced/mcp-server",
        // {
        //   type: "category",
        //   label: "Performance",
        //   link: {
        //     type: "doc",
        //     id: "Advanced/performance/index",
        //   },
        //   items: [
        //     "Advanced/performance/database-performance-optimization",
        //     // "Advanced/performance/historical-sync",
        //     "Advanced/performance/latency-at-head",
        //     "Advanced/performance/benchmarking",
        //   ],
        // },
      ],
    },
    {
      type: "category",
      label: "Troubleshoot",
      items: [
        "Troubleshoot/logging",
        "Troubleshoot/common-issues",
        "Troubleshoot/error-codes",
        "Troubleshoot/reserved-words",
      ],
    },
    networksSection,
    {
      type: "category",
      label: "Solana",
      link: {
        type: "doc",
        id: "solana/solana",
      },
      items: [
        "solana/solana-getting-started",
        "solana/solana-configuration",
        "solana/solana-instruction-handlers",
        "solana/solana-decoding",
        "solana/solana-slot-handlers",
        "solana/solana-evm-vs-solana",
      ],
    },
    "fuel/fuel",
    // Divider to split off the bottom section (LLM docs + legal), matching the
    // divider under the top quick-links section.
    {
      type: "html",
      value: "<hr />",
      className: "menu-section-divider",
    },
    {
      type: "link",
      label: "Support",
      href: "https://discord.gg/envio",
    },
    {
      type: "link",
      label: "LLM Documentation",
      href: "/docs/HyperIndex-LLM/hyperindex-complete",
    },
    "licensing",
    "terms-of-service",
    "privacy-policy",
    // {
    //   type: "category",
    //   label: "Education",
    //   items: [
    //     "what-is-indexer",
    //     "system-architecture",
    //     "indexing-process",
    //     "litepaper",
    //   ],
    // },
    // "working-with-foundry",
    // "integrating-existing-contract",
    // "migrating-from-the-graph",
    // {
    //   type: "category",
    //   label: "Advanced",
    //   items: [
    //     "runtime",
    //     "using-as-backend",
    //     "using-testing-framework",
    //     "dashboard-alerts",
    //   ],
    // },
  ],

  // Envio Cloud is its own section: the hosted-service pages live here in a
  // dedicated sidebar (not inside the HyperIndex tree). Docusaurus shows this
  // sidebar automatically on any of these pages. URLs are unchanged — this is
  // purely a navigation restructure, no content or slug changes.
  envioCloudSidebar: [
    "Hosted_Service/hosted-service",
    "Hosted_Service/hosted-service-features",
    "Hosted_Service/hosted-service-deployment",
    "Hosted_Service/hosted-service-monitoring",
    "Hosted_Service/envio-cloud-cli",
    "Hosted_Service/hosted-service-billing",
    "Hosted_Service/self-hosting",
    "Hosted_Service/organisation-setup",
    {
      type: "html",
      value: "<hr />",
      className: "menu-section-divider",
    },
    {
      type: "link",
      label: "Support",
      href: "https://discord.gg/envio",
    },
    {
      type: "link",
      label: "LLM Documentation",
      href: "/docs/EnvioCloud-LLM/envio-cloud-complete",
    },
  ],
};
