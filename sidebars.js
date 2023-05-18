// Sections to be populated still have been commented out of the sidebar so long
module.exports = {
  someSidebar: [
    "overview",
    "quickstart",
    "installation",
    {
      type: "category",
      label: "Example Scenarios",
      items: [
        {
          type: "doc",
          id: "simple-bank",
        },
        // {
        //   type: "doc",
        //   id: "greeter",
        // },
        // {
        //   type: "doc",
        //   id: "nft-factory",
        // },
        // {
        //   type: "doc",
        //   id: "ploffen",
        // },
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        {
          type: "doc",
          id: "quickstart",
        },
        {
          type: "doc",
          id: "indexer-basics",
        },
        {
          type: "doc",
          id: "configuration-file",
        },
        {
          type: "doc",
          id: "schema-file",
        },
        {
          type: "doc",
          id: "event-handlers",
        },
        {
          type: "doc",
          id: "hardhat-tutorial",
        },
        {
          type: "doc",
          id: "cli-commands",
        },
      ],
    },

    {
      type: "category",
      label: "Troubleshoot",
      items: [
        // {
        //   type: "doc",
        //   id: "faqs",
        // },
        // {
        //   type: "doc",
        //   id: "logging",
        // },
        {
          type: "doc",
          id: "common-issues",
        },
        // {
        //   type: "doc",
        //   id: "error-codes",
        // },
      ],
    },
  ],
};

//   Education: [
//     "what-is-indexer",
//     "system-architecture",
//     "indexing-process",
//     "litepaper",
// ],
// "working-with-foundry",
// "integrating-existing-contract",
// "migrating-from-the-graph",
//   Advanced: [
//     "runtime",
//     "using-as-backend",
//     "using-testing-framework",
//     "dashboard-alerts",
// ],
