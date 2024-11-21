/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Test",
  url: "https://docs.envio.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperIndex",
        path: "docs/HyperIndex",
        routeBasePath: "docs/HyperIndex",
        sidebarPath: require.resolve("./sidebarsHyperIndex.js"),
      },
    ],
  ],
};

module.exports = config;
