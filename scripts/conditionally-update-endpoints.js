// Check if we're in LLM mode
if (process.env.DOCS_FOR_LLM !== "true") {
  // Run the regular endpoint update if not in LLM mode
  require("./update-endpoints.js");
  console.log("Generated full documentation with network pages");
} else {
  console.log("Skipping network pages generation for LLM-friendly build");

  // Create a minimal supported-networks.json with just a few essential networks
  const fs = require("fs");
  const minimalNetworks = {
    supportedNetworks: [
      "supported-networks/any-evm-with-rpc",
      "supported-networks/local-anvil",
      "supported-networks/local-hardhat",
      "supported-networks/ethereum",
      "supported-networks/arbitrum",
      "supported-networks/polygon",
      "supported-networks/optimism",
      // Just a few key networks for LLM context efficiency
    ],
  };

  fs.writeFileSync(
    "./supported-networks.json",
    JSON.stringify(minimalNetworks, null, 2)
  );
}
