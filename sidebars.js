module.exports = {
  someSidebar: [
    // "overview-everything",
    {
      type: "category",
      label: "HyperIndex",
      items: [
        "HyperIndex/overview",
        "HyperIndex/getting-started",
        "HyperIndex/contract-import",
        {
          type: "category",
          label: "Tutorials",
          items: [
            "HyperIndex/Tutorials/tutorial-op-bridge-deposits",
            "HyperIndex/Tutorials/tutorial-erc20-token-transfers",
            "HyperIndex/Tutorials/tutorial-indexing-fuel",
            "HyperIndex/Tutorials/greeter-tutorial",
          ],
        },
        {
          type: "category",
          label: "Guides",
          items: [
            "HyperIndex/Guides/hyperindex-basics",
            "HyperIndex/Guides/configuration-file",
            "HyperIndex/Guides/schema-file",
            "HyperIndex/Guides/event-handlers",
            // "HyperIndex/Guides/subgraph-migration",
            "HyperIndex/Guides/testing",
            "HyperIndex/Guides/running-locally",
            "HyperIndex/Guides/navigating-hasura",
            "HyperIndex/Guides/cli-commands",
          ],
        },
        {
          type: "category",
          label: "Hosted Service",
          items: [
            "HyperIndex/Hosted_Service/hosted-service",
            "HyperIndex/Hosted_Service/hosted-service-deployment",
            "HyperIndex/Hosted_Service/hosted-service-billing",
          ],
        },
        {
          type: "category",
          label: "Advanced",
          items: [
            "HyperIndex/Advanced/linked-entity-loaders",
            "HyperIndex/Advanced/dynamic-contracts",
            "HyperIndex/Advanced/multichain-indexing",
            "HyperIndex/Advanced/hypersync",
            "HyperIndex/Advanced/rpc-sync",
            "HyperIndex/Advanced/persisted_files",
            "HyperIndex/Advanced/generated-files",
            "HyperIndex/Advanced/terminology",
            "HyperIndex/Advanced/async-mode",
            "HyperIndex/Advanced/labels",
          ],
        },
        {
          type: "category",
          label: "Examples",
          items: [
            "HyperIndex/Examples/example-sablier-v2",
            "HyperIndex/Examples/example-liquidation-metrics",
            "HyperIndex/Examples/example-uniswap-v3",
            "HyperIndex/Examples/example-ens",
            // "HyperIndex/Examples/example-aave-token",
            // "HyperIndex/Examples/example-reNFT",
            // "HyperIndex/Examples/example-token-vaults",
          ],
        },
        {
          type: "category",
          label: "Troubleshoot",
          items: [
            "HyperIndex/Troubleshoot/logging",
            "HyperIndex/Troubleshoot/common-issues",
            "HyperIndex/Troubleshoot/error-codes",
            "HyperIndex/Troubleshoot/reserved-words",
          ],
        },
        "HyperIndex/licensing",
        // {
        //   type: "category",
        //   label: "Education",
        //   items: [
        //     "HyperIndex/what-is-indexer",
        //     "HyperIndex/system-architecture",
        //     "HyperIndex/indexing-process",
        //     "HyperIndex/litepaper",
        //   ],
        // },
        // "HyperIndex/working-with-foundry",
        // "HyperIndex/integrating-existing-contract",
        // "HyperIndex/migrating-from-the-graph",
        // {
        //   type: "category",
        //   label: "Advanced",
        //   items: [
        //     "HyperIndex/runtime",
        //     "HyperIndex/using-as-backend",
        //     "HyperIndex/using-testing-framework",
        //     "HyperIndex/dashboard-alerts",
        //   ],
        // },
      ],
    },
    {
      type: "category",
      label: "HyperSync",
      items: [
        "HyperSync/overview-hypersync",
        "HyperSync/hypersync-usage",
        "HyperSync/hypersync-query",
        "HyperSync/hypersync-clients",
        "HyperSync/hypersync-curl-examples",
        "HyperSync/hypersync-url-endpoints",
        {
          type: "category",
          label: "HyperFuel",
          items: [
            "HyperSync/HyperFuel/hyperfuel",
            "HyperSync/HyperFuel/hyperfuel-query",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "HyperRPC",
      items: [
        "HyperRPC/overview-hyperrpc",
      ],
    },
    "fuel/fuel",
  ],
};

