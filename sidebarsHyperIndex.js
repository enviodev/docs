var { supportedNetworks } = require("./supported-networks.json");

module.exports = {
  someSidebar: [
    "overview",
    "getting-started",
    "contract-import",
    "migration-guide-v1-v2",
    {
      type: "category",
      label: "Supported Networks",
      link: {
        type: "doc",
        id: "supported-networks/index",
      },
      items: supportedNetworks,
    },
    {
      type: "category",
      label: "Guides",
      items: [
        "Guides/hyperindex-basics",
        "Guides/configuration-file",
        "Guides/schema-file",
        "Guides/event-handlers",
        // "Guides/subgraph-migration",
        "Guides/testing",
        "Guides/running-locally",
        "Guides/navigating-hasura",
        "Guides/ipfs",
        "Guides/cli-commands",
        "Guides/contract-state",
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
        "Tutorials/price-data"
      ],
    },
    {
      type: "category",
      label: "Hosted Service",
      items: [
        "Hosted_Service/hosted-service",
        "Hosted_Service/hosted-service-deployment",
        "Hosted_Service/hosted-service-billing",
      ],
    },
    {
      type: "category",
      label: "Advanced",
      items: [
        "Advanced/loaders",
        "Advanced/dynamic-contracts",
        "Advanced/wildcard-indexing",
        "Advanced/multichain-indexing",
        "Advanced/hypersync",
        "Advanced/rpc-sync",
        "Advanced/reorgs-support",
        "Advanced/persisted-files",
        "Advanced/generated-files",
        "Advanced/terminology",
        {
          type: "category",
          label: "Performance",
          link: {
            type: "doc",
            id: "Advanced/performance/index",
          },
          items: [
            "Advanced/performance/database-performance-optimization",
            "Advanced/performance/historical-sync",
            "Advanced/performance/latency-at-head",
            "Advanced/performance/benchmarking",
          ],
        },
      ],
    },
    /* 
    /// TODO: add back once we have some v2 examples.
    {
      type: "category",
      label: "Examples",
      items: [
        "Examples/example-sablier-v2",
        "Examples/example-liquidation-metrics",
        "Examples/example-uniswap-v3",
        "Examples/example-ens",
        // "Examples/example-aave-token",
        // "Examples/example-reNFT",
        // "Examples/example-token-vaults",
      ],
    }, */
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
    "licensing",
    "fuel/fuel",
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
