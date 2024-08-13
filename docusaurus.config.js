const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const redirectsList = [
  {
    from: "/",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/quickstart",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/overview",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/getting-started",
    to: "/docs/HyperIndex/getting-started",
  },
  {
    from: "/docs/contract-import",
    to: "/docs/HyperIndex/contract-import",
  },
  {
    from: "/docs/hyperindex-basics",
    to: "/docs/HyperIndex/hyperindex-basics",
  },
  {
    from: "/docs/configuration-file",
    to: "/docs/HyperIndex/configuration-file",
  },
  {
    from: "/docs/schema",
    to: "/docs/HyperIndex/schema",
  },
  {
    from: "/docs/event-handlers",
    to: "/docs/HyperIndex/event-handlers",
  },
  {
    from: "/docs/testing",
    to: "/docs/HyperIndex/testing",
  },
  {
    from: "/docs/running-locally",
    to: "/docs/HyperIndex/running-locally",
  },
  {
    from: "/docs/navigating-hasura",
    to: "/docs/HyperIndex/navigating-hasura",
  },
  {
    from: "/docs/cli-commands",
    to: "/docs/HyperIndex/cli-commands",
  },
  {
    from: "/docs/hosted-service",
    to: "/docs/HyperIndex/hosted-service",
  },
  {
    from: "/docs/hosted-service-deployment",
    to: "/docs/HyperIndex/hosted-service-deployment",
  },
  {
    from: "/docs/hosted-service-billing",
    to: "/docs/HyperIndex/hosted-service-billing",
  },
  {
    from: "/docs/licensing",
    to: "/docs/HyperIndex/licensing",
  },
  {
    from: "/docs/fuel",
    to: "/docs/HyperIndex/fuel",
  },
  {
    from: "/docs/tutorial-op-bridge-deposits",
    to: "/docs/HyperIndex/tutorial-op-bridge-deposits",
  },
  {
    from: "/docs/tutorial-erc20-token-transfers",
    to: "/docs/HyperIndex/tutorial-erc20-token-transfers",
  },
  {
    from: "/docs/tutorial-indexing-fuel",
    to: "/docs/HyperIndex/tutorial-indexing-fuel",
  },
  {
    from: "/docs/greeter-tutorial",
    to: "/docs/HyperIndex/greeter-tutorial",
  },
  {
    from: "/docs/linked-entity-loaders",
    // this has been updated to point to v1 since it doesn't exist in v2.
    to: "/docs/HyperIndex/v1/linked-entity-loaders",
  },
  {
    from: "/docs/HyperIndex/linked-entity-loaders",
    to: "/docs/HyperIndex/v1/linked-entity-loaders",
  },
  {
    from: "/docs/dynamic-contracts",
    to: "/docs/HyperIndex/dynamic-contracts",
  },
  {
    from: "/docs/multichain-indexing",
    to: "/docs/HyperIndex/multichain-indexing",
  },
  {
    from: "/docs/hypersync/",
    to: "/docs/HyperIndex/hypersync",
  },
  {
    from: "/docs/rpc-sync",
    to: "/docs/HyperIndex/rpc-sync",
  },
  {
    from: "/docs/persisted_files",
    to: "/docs/HyperIndex/persisted_files",
  },
  {
    from: "/docs/generated-files",
    to: "/docs/HyperIndex/generated-files",
  },
  {
    from: "/docs/terminology",
    to: "/docs/HyperIndex/terminology",
  },
  {
    from: "/docs/async-mode",
    to: "/docs/HyperIndex/v1/async-mode",
  },
  {
    from: "/docs/HyperIndex/async-mode",
    to: "/docs/HyperIndex/v1/async-mode",
  },
  {
    from: "/docs/labels",
    to: "/docs/HyperIndex/v1/labels",
  },
  {
    from: "/docs/HyperIndex/labels",
    to: "/docs/HyperIndex/v1/labels",
  },
  {
    from: "/docs/performance",
    to: "/docs/HyperIndex/performance",
  },
  {
    from: "/docs/example-sablier-v2",
    to: "/docs/HyperIndex/example-sablier-v2",
  },
  {
    from: "/docs/example-liquidation-metrics",
    to: "/docs/HyperIndex/example-liquidation-metrics",
  },
  {
    from: "/docs/example-uniswap-v3",
    to: "/docs/HyperIndex/example-uniswap-v3",
  },
  {
    from: "/docs/example-ens",
    to: "/docs/HyperIndex/example-ens",
  },
  {
    from: "/docs/logging",
    to: "/docs/HyperIndex/logging",
  },
  {
    from: "/docs/common-issues",
    to: "/docs/HyperIndex/common-issues",
  },
  {
    from: "/docs/error-codes",
    to: "/docs/HyperIndex/error-codes",
  },
  {
    from: "/docs/reserved-words",
    to: "/docs/HyperIndex/reserved-words",
  },
  {
    from: "/docs/hyperfuel",
    to: "/docs/HyperIndex/fuel",
  },
  //// HyperSync
  {
    from: "/docs/overview-hypersync",
    to: "/docs/HyperSync/overview",
  },
  {
    from: "/docs/hypersync-usage",
    to: "/docs/HyperSync/hypersync-usage",
  },
  {
    from: "/docs/hypersync-query",
    to: "/docs/HyperSync/hypersync-query",
  },
  {
    from: "/docs/hypersync-clients",
    to: "/docs/HyperSync/hypersync-clients",
  },
  {
    from: "/docs/hypersync-curl-example",
    to: "/docs/HyperSync/hypersync-curl-examples",
  },
  {
    from: "/docs/hypersync-url-endpoints",
    to: "/docs/HyperSync/hypersync-supported-networks",
  },
  {
    from: "/docs/HyperSync/hypersync-url-endpoints",
    to: "/docs/HyperSync/hypersync-supported-networks",
  },
  {
    from: "/docs/HyperSync/hyperrpc-url-endpoints",
    to: "/docs/HyperSync/hyperrpc-supported-networks",
  },
  {
    from: "/docs/hyperfuel-query",
    to: "/docs/HyperSync/hyperfuel-query",
  },
  {
    from: "/docs/overview-hyperrpc",
    to: "/docs/HyperSync/overview-hyperrpc",
  },
];
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Envio",
  tagline: "The fastest most flexible way to get on-chain data.",
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
        blog: {
          showReadingTime: true,
          blogTitle: "Blog",
          postsPerPage: 9,
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
        },
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "",
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
            to: "docs/HyperIndex/overview",
            label: "HyperIndex Docs",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            docsPluginId: "HyperIndex",
            position: "left",
          },
          {
            to: "docs/HyperSync/overview",
            label: "HyperSync Docs",
            position: "left",
          },
          // //// I will add versioning later - for now - no versioning.
          // {
          //   type: 'docsVersionDropdown',
          //   docsPluginId: 'HyperSync',
          //   position: 'left',
          // },
          {
            to: "blog",
            label: "Blog",
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
        contextualSearch: true, // algolia prioritizes results that are more related to the current section of the docs.
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
                label: "Blog",
                to: "blog",
              },
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
    }),
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperSync",
        path: "docs/HyperSync",
        routeBasePath: "docs/HyperSync",
        sidebarPath: require.resolve("./sidebarsHyperSync.js"),
        editUrl: "https://github.com/enviodev/docs/edit/main/",
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
        // versions: {
        //   current: {
        //     label: 'latest(4.0.0)',
        //     path: '4.0.0',
        //   },
        // },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperIndex",
        path: "docs/HyperIndex",
        routeBasePath: "docs/HyperIndex",
        sidebarPath: require.resolve("./sidebarsHyperIndex.js"),
        editUrl: "https://github.com/enviodev/docs/edit/main/",
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
        versions: {
          current: {
            label: "v2",
            path: "",
          },
          v1: {
            label: "v1",
            path: "v1",
          },
        },
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: redirectsList,
      },
    ],
  ],
  themes: ["docusaurus-json-schema-plugin"],
};

module.exports = config;
