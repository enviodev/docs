module.exports = {
  someSidebar: [
    "overview",
    "quickstart",
    "hypersync-usage",
    "hypersync-clients",
    "hypersync-query",
    "hypersync-presets",
    "hypersync-curl-examples",
    "api-tokens",
    "hypersync-supported-networks",
    {
      type: "category",
      label: "Tutorials",
      collapsed: false,
      items: ["tutorial-address-transactions"],
    },
    {
      type: "category",
      label: "HyperRPC",
      collapsed: false,
      items: [
        "HyperRPC/overview-hyperrpc",
        "HyperRPC/hyperrpc-supported-networks",
      ],
    },
    {
      type: "category",
      label: "HyperFuel",
      items: ["HyperFuel/hyperfuel", "HyperFuel/hyperfuel-query"],
    },
  ],
};
