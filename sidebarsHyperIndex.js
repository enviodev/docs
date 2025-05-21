var { supportedNetworks } = require("./supported-networks.json");

// Direct filtering in the sidebar code
let filteredNetworks = supportedNetworks;

// If in LLM mode, filter the networks directly here
if (process.env.DOCS_FOR_LLM === "true") {
  const keyNetworks = [
    "supported-networks/any-evm-with-rpc",
    "supported-networks/local-anvil",
    "supported-networks/local-hardhat",
    "supported-networks/arbitrum",
    "supported-networks/polygon",
    "supported-networks/optimism",
    "supported-networks/eth",
  ];

  // Filter to only include key networks that exist in the original list
  filteredNetworks = supportedNetworks.filter((network) =>
    keyNetworks.includes(network)
  );

  console.log(
    `Sidebar using filtered networks: ${filteredNetworks.length} (from ${supportedNetworks.length})`
  );
}

const networksSection = {
  type: "category",
  label: "Supported Networks",
  link: {
    type: "doc",
    id: "supported-networks/index",
  },
  items: filteredNetworks,
};

module.exports = {
  someSidebar: [
    "overview",
    "getting-started",
    "contract-import",
    "benchmarks",
    "migration-guide",
    // "migration-guide-v1-v2",
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: [
        "Guides/configuration-file",
        "Guides/schema-file",
        "Guides/event-handlers",
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
        // "Examples/example-liquidation-metrics",
        // "Examples/example-ens",
      ],
    },
    {
      type: "category",
      label: "Hosting",
      collapsed: false,
      items: [
        "Hosted_Service/hosted-service",
        "Hosted_Service/hosted-service-deployment",
        "Hosted_Service/hosted-service-billing",
        "Hosted_Service/self-hosting",
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
      ],
    },
    {
      type: "category",
      label: "Advanced",
      items: [
        "Advanced/dynamic-contracts",
        "Advanced/wildcard-indexing",
        "Guides/contract-state",
        "Advanced/hypersync",
        "Advanced/rpc-sync",
        "Guides/ipfs",
        "Guides/cli-commands",
        "migration-guide-v1-v2",
        "Advanced/reorgs-support",
        // "Advanced/persisted-files",
        "Advanced/generated-files",
        "Advanced/terminology",
        "Advanced/loaders",
        "Advanced/performance/database-performance-optimization",
        "Advanced/performance/latency-at-head",
        "Advanced/performance/benchmarking",
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
    "fuel/fuel",
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
};
