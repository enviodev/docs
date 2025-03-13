// Always run the regular endpoint update to generate all network files
require("./update-endpoints.js");
console.log("Generated full documentation with network pages");

// Then conditionally filter the networks list for LLM mode
if (process.env.DOCS_FOR_LLM === "true") {
  console.log("Creating LLM-friendly filtered network list");

  const fs = require("fs");
  const path = require("path");

  // Define the minimal list of important networks to include
  const keysNetworks = [
    "supported-networks/any-evm-with-rpc",
    "supported-networks/local-anvil",
    "supported-networks/local-hardhat",
    "supported-networks/arbitrum",
    "supported-networks/polygon",
    "supported-networks/optimism",
    "supported-networks/ethereum",
  ];

  // Read the current networks list that was generated
  const supportedNetworksPath = path.join(
    __dirname,
    "..",
    "supported-networks.json"
  );
  const currentNetworks = JSON.parse(
    fs.readFileSync(supportedNetworksPath, "utf8")
  );

  // Filter to only include the key networks (ensuring they exist in the original list)
  const filteredNetworks = {
    supportedNetworks: keysNetworks.filter((network) =>
      currentNetworks.supportedNetworks.includes(network)
    ),
  };

  // Save the filtered list back to the file
  fs.writeFileSync(
    supportedNetworksPath,
    JSON.stringify(filteredNetworks, null, 2)
  );

  console.log(
    `Filtered network list from ${currentNetworks.supportedNetworks.length} to ${filteredNetworks.supportedNetworks.length} networks for LLM-friendly build`
  );
}
