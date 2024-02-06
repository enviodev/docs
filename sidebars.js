module.exports = {
  someSidebar: [
    {
      type: "category",
      label: "HyperIndex",
      items: [
        "overview",
        {
          type: "category",
          label: "Getting Started",
          items: ["installation", "quickstart", "greeter-tutorial"],
        },
        {
          type: "category",
          label: "Examples",
          items: [
            "example-sablier-v2",
            "example-liquidation-metrics",
            "example-uniswap-v3",
            "example-aave-token",
            "example-reNFT",
            "example-token-vaults",
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
            "contract-import",
            "subgraph-migration",
            "testing",
            "navigating-hasura",
            "hosted-service",
            "cli-commands",
          ],
        },
        {
          type: "category",
          label: "Advanced",
          items: [
            "labels",
            "linked-entity-loaders",
            "dynamic-contracts",
            "multichain-indexing",
            "hypersync",
            "rpc-sync",
            "persisted_files",
            "generated-files",
            "terminology",
            "async-mode",
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
      label: "HyperRPC (alpha)",
      items: ["overview-hyperrpc"],
    },
    {
      type: "category",
      label: "HyperSync (alpha)",
      items: ["overview-hypersync", "hypersync-clients"],
    },
  ],
};
