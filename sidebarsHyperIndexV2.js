// Sidebar for HyperIndexV2. Reuses the V3 sidebar but strips categories that
// only exist in V3 (e.g. Streams, Chat Bots).
const v3Sidebar = require("./sidebarsHyperIndex.js");

const V3_ONLY_LABELS = new Set(["Streams", "Chat Bots"]);

const stripV3Only = (items) =>
  items.filter((item) => {
    if (typeof item === "object" && item !== null && item.type === "category") {
      return !V3_ONLY_LABELS.has(item.label);
    }
    return true;
  });

module.exports = {
  someSidebar: stripV3Only(v3Sidebar.someSidebar),
};
