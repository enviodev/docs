module.exports = {
  someSidebar: [
    "overview",
    "migration-guide-v1-v2",
    "getting-started",
    "contract-import",
    {
      type: "category",
      label: "Tutorials",
      items: [
        "Tutorials/tutorial-op-bridge-deposits",
        "Tutorials/tutorial-erc20-token-transfers",
        "Tutorials/tutorial-indexing-fuel",
        "Tutorials/greeter-tutorial",
      ],
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
        "Guides/cli-commands",
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
        // "Advanced/dynamic-contracts", // TODO: need to add this back and have it correct.
        "Advanced/multichain-indexing",
        "Advanced/hypersync",
        "Advanced/rpc-sync",
        "Advanced/persisted_files",
        "Advanced/generated-files",
        "Advanced/terminology",
        "Advanced/performance/performance",
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
