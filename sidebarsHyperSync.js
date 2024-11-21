module.exports = {
  someSidebar: [
    "overview",
    "hypersync-usage",
    "hypersync-clients",
    "hypersync-query",
    {
      type: "category",
      label: "Supported Networks",
      items: [
        "supported-networks/hypersync-supported-networks",
        "supported-networks/network-partners",
      ],
    },
    "api-tokens",
    "hypersync-curl-examples",
    {
      type: "category",
      label: "HyperFuel",
      items: [
        "HyperFuel/hyperfuel",
        "HyperFuel/hyperfuel-query",
      ],
    },
    {
      type: "category",
      label: "HyperRPC",
      items: [
        "HyperRPC/overview-hyperrpc",
        "HyperRPC/hyperrpc-supported-networks",
      ],
    },
  ],
};
