const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Envio LLM Documentation",
  tagline: "Complete documentation for LLM consumption",
  favicon: "img/favicon.ico",
  url: "https://docs.envio.dev",
  baseUrl: "/",
  organizationName: "enviodev",
  projectName: "indexer-docs",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false, // Disable blog completely for LLM docs
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-J0WZ32ZV5B",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: "/custom.css",
      type: "text/css",
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/preview-banner.png",
      navbar: {
        title: "Envio LLM Docs",
        logo: {
          alt: "Envio Logo",
          src: "img/envio-logo.png",
          srcDark: "img/envio-logo.png",
          style: {
            maxWidth: 200,
            maxHeight: 40,
          },
          href: "https://envio.dev",
        },
        items: [
          {
            to: "docs/HyperIndex-LLM/hyperindex-complete",
            label: "HyperIndex Docs",
            position: "left",
          },
          {
            to: "docs/HyperSync-LLM/hypersync-complete",
            label: "HyperSync Docs",
            position: "left",
          },
          {
            to: "docs/HyperRPC-LLM/hyperrpc-complete",
            label: "HyperRPC Docs",
            position: "left",
          },

          {
            to: "showcase",
            label: "Showcase",
            position: "left",
          },
          {
            href: "https://github.com/enviodev",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      algolia: {
        apiKey: "0f966036bca0e26d512dc59f023d64c5",
        indexName: "envio",
        appId: "584MK2OMPZ",
        contextualSearch: true,
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              { label: "Discord", href: "https://discord.gg/Q9qt8gZ2fX" },
              { label: "Twitter", href: "https://twitter.com/envio_indexer" },
              { label: "Lens", href: "https://lenster.xyz/u/envio.lens" },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/enviodev",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Envio`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          "rescript",
          "bash",
          "diff",
          "json",
          "javascript",
          "typescript",
        ],
      },
      metadata: [
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@envio_indexer" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en" },
      ],
    }),
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperIndex-LLM",
        path: "docs/HyperIndex-LLM",
        routeBasePath: "docs/HyperIndex-LLM",
        sidebarPath: require.resolve("./sidebarsHyperIndexLLM.js"),
        editUrl: "https://github.com/enviodev/docs/edit/main/",
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperSync-LLM",
        path: "docs/HyperSync-LLM",
        routeBasePath: "docs/HyperSync-LLM",
        sidebarPath: require.resolve("./sidebarsHyperSyncLLM.js"),
        editUrl: "https://github.com/enviodev/docs/edit/main/",
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperRPC-LLM",
        path: "docs/HyperRPC-LLM",
        routeBasePath: "docs/HyperRPC-LLM",
        sidebarPath: require.resolve("./sidebarsHyperRPCLLM.js"),
        editUrl: "https://github.com/enviodev/docs/edit/main/",
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
  ],
  themes: ["docusaurus-json-schema-plugin"],
};

module.exports = config;
