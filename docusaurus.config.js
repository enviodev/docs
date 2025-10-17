const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const redirectsList = [
  {
    from: "/docs",
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
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/HyperIndex/v2/migration-guide-v1-v2",
    to: "/docs/HyperIndex/migration-guide-v1-v2",
  },
  {
    from: "/docs/HyperIndex/linked-entity-loaders",
    to: "/docs/HyperIndex/overview",
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
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/HyperIndex/async-mode",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/labels",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/HyperIndex/labels",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/performance",
    to: "/docs/HyperIndex/performance",
  },
  {
    from: "/docs/example-sablier-v2",
    to: "/docs/HyperIndex/example-sablier",
  },
  {
    from: "/docs/example-liquidation-metrics",
    to: "/docs/HyperIndex/example-liquidation-metrics",
  },
  {
    from: "/docs/example-uniswap-v3",
    to: "/docs/HyperIndex/example-uniswap-v4-multi-chain-indexer",
  },
  {
    from: "/docs/example-uniswap-v4",
    to: "/docs/HyperIndex/example-uniswap-v4-multi-chain-indexer",
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
    to: "/docs/HyperRPC/hyperrpc-supported-networks",
  },
  {
    from: "/docs/hyperfuel-query",
    to: "/docs/HyperSync/hyperfuel-query",
  },
  {
    from: "/docs/overview-hyperrpc",
    to: "/docs/HyperRPC/overview-hyperrpc",
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
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: "hypersync-api-tokens-nov-2025",
        content:
          'HyperSync API tokens required from <strong>3 November 2025</strong>. Ensure you are using one to keep uninterrupted HyperSync access. <a href="/docs/HyperSync/api-tokens" rel="noopener noreferrer">Learn more →</a>',
        backgroundColor: "#fff7e6",
        textColor: "#663c00",
        isCloseable: true,
      },
      // Add custom CSS for smaller sidebar text
      stylesheets: [
        {
          href: "/custom.css",
          type: "text/css",
        },
      ],
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
            to: "docs/HyperSync/overview",
            label: "HyperSync Docs",
            position: "left",
          },
          {
            to: "docs/HyperRPC/overview-hyperrpc",
            label: "HyperRPC Docs",
            position: "left",
          },
          {
            to: "showcase",
            label: "Showcase",
            position: "left",
          },
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
              {
                label: "Discord",
                href: "https://discord.gg/Q9qt8gZ2fX",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/envio_indexer",
              },
              {
                label: "Lens",
                href: "https://lenster.xyz/u/envio.lens",
              },
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
      metadata: [
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@envio_indexer" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en" },
      ],
    }),
  plugins: [
    [
      require.resolve("./plugins/plugin-generate-llms"),
      {
        filesConfigs: [
          {
            main: true, // this will become llms.txt
            name: "envio",
            root: `
# Envio: Fast, Multi-Chain Blockchain Indexer

> Envio.dev is a high-performance, multi-chain blockchain indexing framework designed for developers. It offers real-time and historical data querying via GraphQL APIs, supports automatic reorg handling, and enables rapid deployment with zero-downtime rollbacks. Built for EVM-compatible chains and Fuel, Envio empowers developers to build scalable blockchain applications efficiently.


This file contains links to documentation sections following the llmstxt.org standard.
`,
            includeOrder: [
              "docs/HyperIndex/overview.md",
              "docs/HyperIndex/getting-started.md",
              "docs/HyperIndex/contract-import.md",
              "docs/HyperIndex/benchmarks.md",
              "docs/HyperIndex/migration-guide.md",
              "docs/HyperIndex/Guides/**",
              "docs/HyperIndex/Examples/**",
              "docs/HyperIndex/Hosted_Service/**",
              "docs/HyperIndex/Tutorials/**",
              "docs/HyperIndex/Advanced/**",
              "docs/HyperIndex/Troubleshoot/**",
              "docs/HyperIndex/supported-networks/**",
              "docs/HyperIndex/fuel/**",
              "docs/HyperSync/overview.md",
              "docs/HyperSync/quickstart.md",
              "docs/HyperSync/hypersync-usage.md",
              "docs/HyperSync/hypersync-clients.md",
              "docs/HyperSync/hypersync-query.md",
              "docs/HyperSync/hypersync-presets.md",
              "docs/HyperSync/hypersync-curl-examples.md",
              "docs/HyperSync/api-tokens.mdx",
              "docs/HyperSync/hypersync-supported-networks.md",
              "docs/HyperSync/tutorial-address-transactions.md",
              "docs/HyperSync/HyperFuel/**",
              "docs/HyperRPC/overview-hyperrpc.md",
              "docs/HyperRPC/hyperrpc-supported-networks.md",
            ],
          },
          {
            name: "hyperindex",
            root: `
# HyperIndex Docs

> HyperIndex is a complete indexing framework with schema management, event handling, and GraphQL APIs.

This file contains links to documentation sections following the llmstxt.org standard.
`,
            includeOrder: [
              "docs/HyperIndex/overview.md",
              "docs/HyperIndex/getting-started.md",
              "docs/HyperIndex/contract-import.md",
              "docs/HyperIndex/benchmarks.md",
              "docs/HyperIndex/migration-guide.md",
              "docs/HyperIndex/Guides/**",
              "docs/HyperIndex/Examples/**",
              "docs/HyperIndex/Hosted_Service/**",
              "docs/HyperIndex/Tutorials/**",
              "docs/HyperIndex/Advanced/**",
              "docs/HyperIndex/Troubleshoot/**",
              "docs/HyperIndex/supported-networks/**",
              "docs/HyperIndex/fuel/**",
            ],
          },
          {
            name: "hypersync",
            root: `
# HyperSync Docs

> HyperSync is Envio's high-performance blockchain data engine that serves as a direct replacement for traditional RPC endpoints, delivering up to 2000x faster data access.

This file contains links to documentation sections following the llmstxt.org standard.
`,
            includeOrder: [
              "docs/HyperSync/overview.md",
              "docs/HyperSync/quickstart.md",
              "docs/HyperSync/hypersync-usage.md",
              "docs/HyperSync/hypersync-clients.md",
              "docs/HyperSync/hypersync-query.md",
              "docs/HyperSync/hypersync-presets.md",
              "docs/HyperSync/hypersync-curl-examples.md",
              "docs/HyperSync/api-tokens.mdx",
              "docs/HyperSync/hypersync-supported-networks.md",
              "docs/HyperSync/tutorial-address-transactions.md",
              "docs/HyperSync/HyperFuel/**",
            ],
          },
          {
            name: "hyperrpc",
            root: `
# HyperRPC Docs

> HyperRPC is an extremely fast read-only RPC designed specifically for data-intensive blockchain tasks. It provides simple drop-in replacement for existing RPC-based code.

This file contains links to documentation sections following the llmstxt.org standard.
`,
            includeOrder: [
              "docs/HyperRPC/overview-hyperrpc.md",
              "docs/HyperRPC/hyperrpc-supported-networks.md",
            ],
          },
        ],
      },
    ],
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
        disableVersioning: true,
        // versions: {
        //   current: {
        //     label: "v2",
        //     path: "",
        //   },
        // },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperRPC",
        path: "docs/HyperRPC",
        routeBasePath: "docs/HyperRPC",
        sidebarPath: require.resolve("./sidebarsHyperRPC.js"),
        editUrl: "https://github.com/enviodev/docs/edit/main/",
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
        //disableVersioning: true,
        // versions: {
        //   current: {
        //     label: "v2",
        //     path: "",
        //   },
        // },
      },
    ],
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
