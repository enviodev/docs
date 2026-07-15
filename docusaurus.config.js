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
    to: "/docs/HyperIndex/quickstart",
  },
  {
    from: "/docs/hyperindex-basics",
    to: "/docs/HyperIndex/quickstart",
  },
  {
    from: "/docs/contract-import",
    to: "/docs/HyperIndex/quickstart",
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
    from: "/docs/tutorial-erc20-token-transfers",
    to: "/docs/HyperIndex/tutorial-erc20-token-transfers",
  },
  {
    from: "/docs/tutorial-indexing-fuel",
    to: "/docs/HyperIndex/tutorial-indexing-fuel",
  },
  {
    from: "/docs/linked-entity-loaders",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/HyperIndex/linked-entity-loaders",
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/multichain-indexing",
    to: "/docs/HyperIndex/multichain-indexing",
  },
  {
    from: "/docs/rpc-sync",
    to: "/docs/HyperIndex/rpc-sync",
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
    to: "/docs/HyperIndex/overview",
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
    to: "/docs/HyperIndex/overview",
  },
  {
    from: "/docs/HyperIndex/example-ens",
    to: "/docs/HyperIndex/overview",
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
  //// V2 → V3 redirects for Solana and migration guides
  {
    from: "/docs/v2/HyperIndex/solana",
    to: "/docs/HyperIndex/solana",
  },
  {
    from: "/docs/v2/HyperIndex/migrate-with-ai",
    to: "/docs/HyperIndex/migrate-with-ai",
  },
  {
    from: "/docs/v2/HyperIndex/migration-guide",
    to: "/docs/HyperIndex/migration-guide",
  },
  {
    from: "/docs/v2/HyperIndex/migrate-from-ponder",
    to: "/docs/HyperIndex/migrate-from-ponder",
  },
  {
    from: "/docs/v2/HyperIndex/migrate-from-alchemy",
    to: "/docs/HyperIndex/migrate-from-alchemy",
  },
  {
    from: "/docs/v2/HyperIndex/migrate-to-v3",
    to: "/docs/HyperIndex/migrate-to-v3",
  },
  {
    from: "/docs/v2/HyperIndex/whats-new-in-v3",
    to: "/docs/HyperIndex/whats-new-in-v3",
  },
  // Removed broken `others.md` (empty aggregation stub); send its URL to the
  // supported-networks index rather than 404.
  {
    from: "/docs/HyperIndex/supported-networks/others",
    to: "/docs/HyperIndex/supported-networks",
  },
];
// Load build-time generated network count (written by scripts/update-endpoints.js).
// Falls back to a safe default if the file hasn't been generated yet.
let networkCountData = { hyperSyncChainCount: null };
try {
  networkCountData = require("./src/data/network-count.json");
} catch (e) {
  console.warn(
    "network-count.json not found — run scripts/update-endpoints.js to generate it."
  );
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Envio",
  tagline: "Envio's documentation for HyperIndex, HyperSync and HyperRPC. Learn how to index blockchain data, query real-time data and build production-ready applications.",
  favicon: "img/favicon.ico",
  url: "https://docs.envio.dev",
  baseUrl: "/",
  organizationName: "enviodev",
  projectName: "indexer-docs",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  customFields: {
    hyperSyncChainCount: networkCountData.hyperSyncChainCount,
  },
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
          blogTitle: "Envio Blog",
          blogDescription:
            "Technical articles, case studies, tutorials, product updates, and agentic indexing insights from Envio's blockchain data infrastructure team.",
          postsPerPage: "ALL",
          blogSidebarCount: 0,
          tagsBasePath: 'tag',
        },

        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-J0WZ32ZV5B",
          anonymizeIP: true,
        },
        sitemap: {
          ignorePatterns: [
            "/docs/HyperIndex-LLM/**",
            "/docs/HyperSync-LLM/**",
            "/docs/HyperRPC-LLM/**",
            "/docs/EnvioCloud-LLM/**",
          ],
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&display=swap",
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
      navbar: {
        title: "ENVIO",
        logo: {
          alt: "Envio",
          src: "img/envio-logo.png",
          href: "https://envio.dev",
          style: { display: "none" },
        },
        items: [
          {
            type: "dropdown",
            label: "HyperIndex",
            position: "left",
            items: [
              {
                label: "v3 (latest)",
                to: "docs/HyperIndex/overview",
                activeBaseRegex:
                  "^/docs/HyperIndex/(?!(hosted-service|self-hosting|organisation-setup|envio-cloud-cli))",
              },
              {
                label: "v2",
                to: "docs/v2/HyperIndex/overview",
                activeBaseRegex: "^/docs/v2/HyperIndex/",
              },
            ],
          },
          {
            to: "docs/HyperSync/overview",
            label: "HyperSync",
            position: "left",
            activeBaseRegex: "^/docs/HyperSync/",
          },
          {
            to: "docs/HyperRPC/overview-hyperrpc",
            label: "HyperRPC",
            position: "left",
            activeBaseRegex: "^/docs/HyperRPC/",
          },
          {
            to: "docs/HyperIndex/hosted-service",
            label: "Envio Cloud",
            position: "left",
            activeBaseRegex:
              "^/docs/HyperIndex/(hosted-service|self-hosting|organisation-setup|envio-cloud-cli)",
          },
          {
            href: "https://github.com/enviodev",
            position: "right",
            className: "header-github-link",
            "aria-label": "Envio on GitHub",
          },
          {
            href: "https://envio.dev/app",
            label: "Sign in",
            position: "right",
            className: "navbar__item--signin",
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
              {
                label: "Discord",
                href: "https://discord.gg/envio",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/envio_indexer",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
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
    require.resolve('./plugins/plugin-author-pages'),
    [
      "docusaurus-plugin-mcp-server",
      {
        server: {
          name: "envio-docs",
          version: "1.0.0",
        },
        excludeSelectors: [
          "nav", "header", "footer", "aside",
          '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
          ".hash-link",
        ],
        excludeRoutes: [
          "/blog",
          "/blog/**",
          "/videos",
          "/docs/HyperIndex-LLM/**",
          "/docs/HyperSync-LLM/**",
          "/docs/HyperRPC-LLM/**",
          "/docs/EnvioCloud-LLM/**",
          "/docs/v2/HyperIndex/**",
        ],
      },
    ],
    require.resolve("./plugins/plugin-blog-jsonld"),
    [
      require.resolve("./plugins/plugin-generate-llms"),
      {
        // LLM-mirror plugins are bundled re-exports of other docs — skip them
        // entirely to avoid duplication.
        excludePluginIds: [
          "HyperIndex-LLM",
          "HyperSync-LLM",
          "HyperRPC-LLM",
          "EnvioCloud-LLM",
        ],
        // V2 is listed in llms.txt for discoverability but stays out of
        // llms-full.txt and the per-page .md copies.
        excludeFromFullPluginIds: ["HyperIndexV2"],
        filesConfigs: [
          {
            main: true, // becomes llms.txt
            name: "envio",
            header: `
# Envio: Fast, Multi-Chain Blockchain Indexer

> Envio is a real-time multichain blockchain indexer. HyperIndex is a multichain indexer supporting any EVM chain, plus Solana and Fuel. HyperSync is a high-throughput data layer natively available on 70+ EVM chains and Fuel, and supports any EVM chain via RPC. HyperRPC is a read-only JSON-RPC endpoint powered by HyperSync, up to 5x faster than traditional nodes. Benchmark: Envio 1 min vs The Graph 143 min (Uniswap V2 Factory, [Sentio, May 2025](https://docs.envio.dev/docs/HyperIndex/benchmarks.md)).

This file is generated from page frontmatter at build time and follows the llmstxt.org standard.
`,
            sections: [
              {
                heading: "HyperIndex",
                subsections: [
                  {
                    heading: "Core",
                    include: [
                      "docs/HyperIndex/Advanced/**/*.{md,mdx}",
                      "docs/HyperIndex/Guides/**/*.{md,mdx}",
                    ],
                    // mcp-server lives under Guides but is more useful in the
                    // Optional section as an AI-assistant entry point.
                    exclude: ["**/mcp-server.{md,mdx}"],
                  },
                  {
                    heading: "Envio Cloud",
                    include: ["docs/HyperIndex/Hosted_Service/**/*.{md,mdx}"],
                  },
                  {
                    heading: "Troubleshooting",
                    include: ["docs/HyperIndex/Troubleshoot/**/*.{md,mdx}"],
                  },
                  {
                    heading: "Tutorials & Examples",
                    include: [
                      "docs/HyperIndex/Examples/**/*.{md,mdx}",
                      "docs/HyperIndex/Tutorials/**/*.{md,mdx}",
                      "docs/HyperIndex/overview.{md,mdx}",
                      "docs/HyperIndex/contract-import.{md,mdx}",
                      "docs/HyperIndex/benchmarks.{md,mdx}",
                      "docs/HyperIndex/fuel/**/*.{md,mdx}",
                      "docs/HyperIndex/solana/**/*.{md,mdx}",
                      "docs/HyperIndex/licensing.{md,mdx}",
                      "docs/HyperIndex/whats-new-in-v3.{md,mdx}",
                      "docs/HyperIndex/migrate-to-v3.{md,mdx}",
                      "docs/HyperIndex/migrate-from-alchemy.{md,mdx}",
                      "docs/HyperIndex/migrate-from-ponder.{md,mdx}",
                      "docs/HyperIndex/migrate-with-ai.{md,mdx}",
                      "docs/HyperIndex/migration-guide.{md,mdx}",
                    ],
                  },
                ],
              },
              {
                heading: "HyperSync",
                include: ["docs/HyperSync/**/*.{md,mdx}"],
                // Supported-networks page is grouped under its own heading.
                exclude: ["**/hypersync-supported-networks.{md,mdx}"],
              },
              {
                heading: "HyperRPC",
                include: ["docs/HyperRPC/**/*.{md,mdx}"],
                exclude: ["**/hyperrpc-supported-networks.{md,mdx}"],
              },
              {
                heading: "Supported Networks",
                subsections: [
                  {
                    heading: "Overview",
                    include: [
                      "docs/HyperIndex/supported-networks/index.{md,mdx}",
                      "docs/HyperSync/hypersync-supported-networks.{md,mdx}",
                      "docs/HyperRPC/hyperrpc-supported-networks.{md,mdx}",
                    ],
                  },
                  {
                    // Per-chain reference pages — listed compactly (no
                    // description) so 200+ entries don't blow the 50 KB
                    // llms.txt size threshold.
                    heading: "HyperIndex Chains",
                    include: [
                      "docs/HyperIndex/supported-networks/**/*.{md,mdx}",
                    ],
                    exclude: ["**/index.{md,mdx}"],
                    compact: true,
                  },
                ],
              },
              {
                heading: "Blog",
                source: "blog",
                subsections: [
                  {
                    heading: "Case Studies",
                    source: "blog",
                    tags: ["case-studies"],
                  },
                  {
                    heading: "Tutorials",
                    source: "blog",
                    tags: ["tutorials"],
                  },
                  {
                    heading: "AI",
                    source: "blog",
                    tags: ["ai"],
                  },
                  {
                    heading: "Product Updates",
                    source: "blog",
                    tags: ["product-updates"],
                  },
                  {
                    heading: "Announcements",
                    source: "blog",
                    tags: ["announcements"],
                  },
                  {
                    heading: "Articles",
                    source: "blog",
                    catchAll: true,
                  },
                ],
              },
              {
                heading: "HyperIndex V2 (legacy)",
                subsections: [
                  {
                    heading: "Core",
                    include: [
                      "docs/HyperIndexV2/Advanced/**/*.{md,mdx}",
                      "docs/HyperIndexV2/Guides/**/*.{md,mdx}",
                    ],
                  },
                  {
                    heading: "Envio Cloud",
                    include: [
                      "docs/HyperIndexV2/Hosted_Service/**/*.{md,mdx}",
                    ],
                  },
                  {
                    heading: "Troubleshooting",
                    include: ["docs/HyperIndexV2/Troubleshoot/**/*.{md,mdx}"],
                  },
                  {
                    heading: "Tutorials & Examples",
                    include: [
                      "docs/HyperIndexV2/Examples/**/*.{md,mdx}",
                      "docs/HyperIndexV2/Tutorials/**/*.{md,mdx}",
                      "docs/HyperIndexV2/*.{md,mdx}",
                      "docs/HyperIndexV2/fuel/**/*.{md,mdx}",
                      "docs/HyperIndexV2/solana/**/*.{md,mdx}",
                    ],
                    // Legal/policy pages share a dedicated section.
                    exclude: [
                      "**/privacy-policy.{md,mdx}",
                      "**/terms-of-service.{md,mdx}",
                    ],
                  },
                  {
                    heading: "Chains",
                    include: [
                      "docs/HyperIndexV2/supported-networks/**/*.{md,mdx}",
                    ],
                    compact: true,
                  },
                ],
              },
              {
                heading: "Legal",
                include: [
                  "docs/HyperIndex/privacy-policy.{md,mdx}",
                  "docs/HyperIndex/terms-of-service.{md,mdx}",
                ],
              },
            ],
            optional: [
              {
                label: "Envio website",
                href: "https://envio.dev",
                description: "Product overview and landing page.",
              },
              {
                label: "Envio root llms.txt",
                href: "https://envio.dev/llms.txt",
                description: "Marketing-facing llms.txt summary.",
              },
              {
                label: "Pricing",
                href: "https://envio.dev/pricing",
                description: "Envio Cloud plans and billing.",
              },
              {
                label: "Supported chains overview",
                href: "https://envio.dev/chains",
                description: "Canonical chains page across all products.",
              },
              {
                label: "GitHub organization",
                href: "https://github.com/enviodev",
                description: "Public repositories.",
              },
              {
                label: "HyperIndex repo",
                href: "https://github.com/enviodev/hyperindex",
                description: "Source and issues.",
              },
              {
                label: "Releases",
                href: "https://github.com/enviodev/hyperindex/releases",
                description: "HyperIndex changelog.",
              },
              {
                label: "Quickstart with AI",
                href: "https://docs.envio.dev/docs/HyperIndex/quickstart-with-ai.md",
                description:
                  "End-to-end guide for building an indexer with Claude Code, Cursor, or any MCP-compatible AI coding assistant.",
              },
              {
                label: "MCP Server",
                href: "https://docs.envio.dev/docs/HyperIndex/mcp-server.md",
                description:
                  "Model Context Protocol server for AI coding assistants. Endpoint: https://docs.envio.dev/mcp",
              },
              {
                label: "Telegram",
                href: "https://t.me/+5mI61oZibEM5OGQ8",
                description: "Community chat.",
              },
              {
                label: "Discord",
                href: "https://discord.gg/envio",
                description: "Community support.",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/envio_indexer",
                description: "Company page.",
              },
              {
                label: "YouTube",
                href: "https://www.youtube.com/@envio_indexer",
                description: "Video content.",
              },
            ],
          },
        ],
        blog: true,
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
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "HyperIndexV2",
        path: "docs/HyperIndexV2",
        routeBasePath: "docs/v2/HyperIndex",
        sidebarPath: require.resolve("./sidebarsHyperIndexV2.js"),
        editUrl: "https://github.com/enviodev/docs/edit/main/",
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
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
      "@docusaurus/plugin-content-docs",
      {
        id: "EnvioCloud-LLM",
        path: "docs/EnvioCloud-LLM",
        routeBasePath: "docs/EnvioCloud-LLM",
        sidebarPath: require.resolve("./sidebarsEnvioCloudLLM.js"),
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