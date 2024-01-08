module.exports = {
  someSidebar: [
    {
      type: "category",
      label: "HyperIndex (Live)",
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
            "envio-basics",
            "configuration-file",
            "schema-file",
            "event-handlers",
            "supported-networks",
            "testing",
            "subgraph-migration",
            "contract-import",
            "hosted-service",
            "cli-commands",
            "navigating-hasura",
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
            "sync-config",
            "persisted_files",
            "generated-files",
            "terminology",
          ],
        },
        {
          type: "category",
          label: "Troubleshoot",
          items: ["logging", "common-issues", "error-codes", "reserved-words"],
        },
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
      label: "HyperRPC (Alpha available)",
      items: ["overview-hyperrpc"],
    },
    {
      type: "category",
      label: "HyperSync (Alpha available)",
      items: [
        "overview-hypersync",
        "hypersync-clients",
      ],
    },
  ],
};
