const v3Sidebar = require("./sidebarsHyperIndex.js");

// Deep-clone the V3 sidebar so we can patch it without mutating the original.
const sidebar = JSON.parse(JSON.stringify(v3Sidebar.someSidebar));

// Replace the `migrate-to-v3` doc reference with an external link to the V3
// page, wherever it appears in the tree. The V2 plugin would otherwise resolve
// it to /docs/v2/HyperIndex/migrate-to-v3, but we want users to land on the
// canonical V3 page.
function replaceMigrateToV3(items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item === "migrate-to-v3") {
      items[i] = {
        type: "link",
        label: "Migrate to V3",
        href: "/docs/HyperIndex/migrate-to-v3",
      };
    } else if (item && typeof item === "object" && Array.isArray(item.items)) {
      replaceMigrateToV3(item.items);
    }
  }
}

replaceMigrateToV3(sidebar);

module.exports = {
  someSidebar: sidebar,
};
