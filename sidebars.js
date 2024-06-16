module.exports = {
  someSidebar: [
    // "overview-everything",
    {
      type: "category",
      label: "HyperIndex",
      items: [
        "overview",
        "getting-started",
        "contract-import",
        {
          type: "category",
          label: "Tutorials",
          items: [
            "tutorial-op-bridge-deposits",
            "tutorial-erc20-token-transfers",
            "tutorial-indexing-fuel",
            "greeter-tutorial",
          ],
        },
        {
          type: "category",
          label: "Guides",
          items: [
            "hyperindex-basics",
            "configuration-file",
            "schema-file",
            "event-handlers",
            // "subgraph-migration",
            "testing",
            "running-locally",
            "navigating-hasura",
            {
              type: "category",
              label: "Hosted Service",
              items: [
                "hosted-service",
                "hosted-service-deployment",
                "hosted-service-billing",
              ],
            },
            "cli-commands",
          ],
        },
        {
          type: "category",
          label: "Advanced",
          items: [
            "linked-entity-loaders",
            "dynamic-contracts",
            "multichain-indexing",
            "hypersync",
            "rpc-sync",
            "persisted_files",
            "generated-files",
            "terminology",
            "async-mode",
            "labels",
          ],
        },
        {
          type: "category",
          label: "Examples",
          items: [
            "example-sablier-v2",
            "example-liquidation-metrics",
            "example-uniswap-v3",
            "example-ens",
            // "example-aave-token",
            // "example-reNFT",
            // "example-token-vaults",
          ],
        },
        {
          type: "category",
          label: "Troubleshoot",
          items: ["logging", "common-issues", "error-codes", "reserved-words"],
        },
        "licensing",
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
    },
    {
      type: "category",
      label: "HyperSync",
      items: [
        "overview-hypersync",
        "hypersync-usage",
        "hypersync-query",
        "hypersync-clients",
        "hypersync-curl-examples",
        "hypersync-url-endpoints",
        {
          type: "category",
          label: "HyperFuel",
          items: [
            "hyperfuel",
            "hyperfuel-query"
          ],
        },
      ],
    },
    {
      type: "category",
      label: "HyperRPC",
      items: ["overview-hyperrpc"],
    },
    "fuel",
  ],
};
