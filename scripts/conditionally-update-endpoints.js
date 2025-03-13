// Check if we're in LLM mode
if (process.env.DOCS_FOR_LLM !== "true") {
  // Run the regular endpoint update if not in LLM mode
  require("./update-endpoints.js");
  console.log("Generated full documentation with network pages");
} else {
  console.log("Creating LLM-friendly build with minimal network pages");

  const fs = require("fs");
  const path = require("path");

  // Define the minimal list of networks to include
  const minimalNetworks = {
    supportedNetworks: [
      "supported-networks/any-evm-with-rpc",
      "supported-networks/local-anvil",
      "supported-networks/local-hardhat",
      "supported-networks/arbitrum",
      "supported-networks/polygon",
      "supported-networks/optimism",
      // Just a few key networks for LLM context efficiency
    ],
  };

  // Make sure we're only including network files that actually exist
  const docsDir = path.join(__dirname, "..", "docs", "HyperIndex");
  const networksDir = path.join(docsDir, "supported-networks");

  // Check if each network file exists; if not, remove from the list
  minimalNetworks.supportedNetworks = minimalNetworks.supportedNetworks.filter(
    (network) => {
      const filename = path.basename(network) + ".md";
      return fs.existsSync(path.join(networksDir, filename));
    }
  );

  // Save the filtered minimal networks list
  fs.writeFileSync(
    path.join(__dirname, "..", "supported-networks.json"),
    JSON.stringify(minimalNetworks, null, 2)
  );

  console.log(
    `Created minimal network list with ${minimalNetworks.supportedNetworks.length} networks`
  );
}
