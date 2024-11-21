module.exports = {
  title: "Test",
  url: "https://docs.envio.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "test",
        path: "docs/HyperIndex",
        routeBasePath: "docs/test",
      },
    ],
  ],
};
