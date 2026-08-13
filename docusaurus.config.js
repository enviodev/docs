const { themes } = require("prism-react-renderer");
const { getBlogLastmodMap } = require("./scripts/blog-lastmod");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const blogLastmod = getBlogLastmodMap();

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
    to: "/docs/HyperIndex/observability",
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

// Chain count for the llms.txt header. network-count.json is regenerated from
// the live chain API on every build, so this tracks reality instead of drifting
// like a hardcoded number does. The count is EVM-only (update-endpoints.js
// filters out Fuel and the -traces endpoint variants), which is why Fuel is
// named separately in the header sentence. Falls back to a deliberately vague
// phrase rather than a stale figure if the file is missing.
const hyperSyncChainCountLabel = networkCountData.hyperSyncChainCount
  ? `${networkCountData.hyperSyncChainCount}+`
  : "many";

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
  // Site-wide structured data. The Organization node is mirrored verbatim from
  // envio.dev (same @id/logo/sameAs) so search + answer engines treat the docs
  // subdomain and the marketing site as one entity. The WebSite node is docs-
  // specific and points back to that shared Organization as its publisher.
  headTags: [
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://envio.dev/#organization",
        name: "Envio",
        url: "https://envio.dev",
        logo: "https://envio.dev/brand-assets/envio-logo-square.png",
        description:
          "Envio is a real-time multichain blockchain indexer. Index, query, and stream onchain data for Web3 apps across any EVM chain, plus Solana and Fuel.",
        sameAs: [
          "https://twitter.com/envio_indexer",
          "https://github.com/enviodev",
          "https://www.linkedin.com/company/envio_indexer",
          "https://discord.gg/envio",
        ],
      }),
    },
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://docs.envio.dev/#website",
        name: "Envio Documentation",
        url: "https://docs.envio.dev",
        description:
          "Envio's documentation for HyperIndex, HyperSync and HyperRPC. Learn how to index blockchain data, query real-time data and build production-ready applications.",
        publisher: { "@id": "https://envio.dev/#organization" },
      }),
    },
  ],
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
          // Every post links to every other post. Older posts had no inbound
          // links except the /blog index, which left them with too little
          // internal link equity for Google to spend crawl budget on them
          // ("Discovered - currently not indexed" in Search Console).
          blogSidebarCount: "ALL",
          blogSidebarTitle: "All posts",
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
          // Google ignores changefreq/priority entirely and uses lastmod as the
          // signal for which URLs are worth recrawling. Without it every URL
          // looked equally stale, so older posts were never crawled at all.
          lastmod: "date",
          ignorePatterns: [
            "/docs/HyperIndex-LLM/**",
            "/docs/HyperSync-LLM/**",
            "/docs/HyperRPC-LLM/**",
            "/docs/EnvioCloud-LLM/**",
            // Legacy v2 docs near-duplicate the live v3 pages; keep them out of
            // the sitemap so they don't compete for the same rankings.
            "/docs/v2/HyperIndex/**",
            // Client-side search results page carries no indexable content.
            "/search",
            // Auto-generated blog index pages carry no unique content. They
            // stay crawlable for link discovery, but listing them in the
            // sitemap spends discovery budget that real articles need.
            "/blog/archive",
            "/blog/author/**",
          ],
          // Docs keep the git-derived lastmod; blog posts use their
          // frontmatter revision date instead. See scripts/blog-lastmod.js.
          async createSitemapItems({ defaultCreateSitemapItems, ...params }) {
            const items = await defaultCreateSitemapItems(params);
            return items.map((item) => {
              const pathname = new URL(item.url).pathname.replace(/\/$/, "");
              const lastmod = blogLastmod.get(pathname);
              return lastmod ? { ...item, lastmod } : item;
            });
          },
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
          // A plain link, not a version dropdown. The dropdown put a sitewide
          // link to `/docs/v2/HyperIndex/overview` on all 282 pages, and that
          // page — like all 64 v2 pages — is `noindex`. Across the whole site
          // 2,596 internal links terminated in that tree, so a large share of
          // the link graph drained into pages Google is told to discard, and
          // v3's own overview never got a top-level sitewide link of its own
          // (the dropdown's parent label is a button, not an anchor).
          //
          // v2 stays published and reachable — see the migration guides, which
          // is where someone on v2 actually starts.
          {
            to: "docs/HyperIndex/overview",
            label: "HyperIndex",
            position: "left",
            activeBaseRegex:
              "^/docs/HyperIndex/(?!(hosted-service|self-hosting|organisation-setup|envio-cloud-cli))",
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
          // Blog and Showcase are now real navbar items on every viewport.
          // They previously carried `navbar__item--mobile-only`, so on desktop
          // their only entry point was the docs sidebar header — which renders
          // on `/docs/*` and nowhere else. Both are content hubs we want
          // crawled, and neither had a sitewide link.
          {
            to: "/blog",
            label: "Blog",
            position: "left",
          },
          {
            to: "/showcase",
            label: "Showcase",
            position: "left",
          },
          // Changelog and Shipper's Logs stay out of the desktop navbar to keep
          // it from wrapping, but they are no longer sidebar-only: the footer
          // below now carries them sitewide.
          {
            href: "https://envio.dev/changelog",
            label: "Changelog",
            position: "left",
            className: "navbar__item--mobile-only",
          },
          {
            to: "/videos",
            label: "Shipper's Logs",
            position: "left",
            className: "navbar__item--mobile-only",
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
      // The footer renders on all ~280 pages, so it is the only surface that
      // can give a page a sitewide link. It previously carried four links
      // (Discord, Twitter, Blog, GitHub), which left every content hub relying
      // on the docs sidebar header — a surface that exists only under /docs/*.
      //
      // The Pricing column is deliberately cross-domain. envio.dev has no
      // footer at all, and /pricing/hypersync, /pricing/hyperrpc and
      // /pricing/services had zero inbound links from anywhere on either site:
      // they existed in envio.dev's sitemap and in no link graph, which is the
      // textbook shape of "Discovered - currently not indexed". Linking them
      // from here gives each one a real inbound edge from every docs page
      // until envio.dev grows a footer of its own.
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              { label: "HyperIndex", to: "/docs/HyperIndex/overview" },
              { label: "HyperSync", to: "/docs/HyperSync/overview" },
              { label: "HyperRPC", to: "/docs/HyperRPC/overview-hyperrpc" },
              { label: "Envio Cloud", to: "/docs/HyperIndex/hosted-service" },
              { label: "Migrate to v3", to: "/docs/HyperIndex/migration-guide" },
            ],
          },
          {
            title: "Resources",
            items: [
              { label: "Blog", to: "/blog" },
              { label: "Showcase", to: "/showcase" },
              { label: "Shipper's Logs", to: "/videos" },
              { label: "Benchmarks", to: "/docs/HyperIndex/benchmarks" },
              {
                label: "Supported Chains",
                href: "https://envio.dev/chains",
              },
              {
                label: "Changelog",
                href: "https://envio.dev/changelog",
              },
            ],
          },
          {
            title: "Pricing",
            items: [
              {
                label: "HyperIndex Hosting",
                href: "https://envio.dev/pricing/hosting",
              },
              {
                label: "HyperSync",
                href: "https://envio.dev/pricing/hypersync",
              },
              {
                label: "HyperRPC",
                href: "https://envio.dev/pricing/hyperrpc",
              },
              {
                label: "Subgraph Hosting",
                href: "https://envio.dev/pricing/subgraphs",
              },
              {
                label: "Support & Services",
                href: "https://envio.dev/pricing/services",
              },
            ],
          },
          {
            title: "Community",
            items: [
              { label: "Discord", href: "https://discord.gg/envio" },
              { label: "Telegram", href: "https://t.me/+BeS5ihVUFONjNGFk" },
              { label: "Twitter", href: "https://twitter.com/envio_indexer" },
              { label: "GitHub", href: "https://github.com/enviodev" },
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
        // Standalone pages and showcase entries are live, sitemapped pages that
        // the docs and blog collectors do not own. Both are read from the same
        // sources that render them, so new entries appear in llms.txt with no
        // second list to maintain.
        pages: { path: "src/pages" },
        showcase: {
          dataPath: "src/pages/showcase/_data.js",
          routeBasePath: "showcase",
        },
        filesConfigs: [
          {
            main: true, // becomes llms.txt
            name: "envio",
            header: `
# Envio: Fast, Multi-Chain Blockchain Indexer

> Envio is a real-time multichain blockchain indexer. HyperIndex is a multichain indexer supporting any EVM chain, plus Solana and Fuel. HyperSync is a high-throughput data layer natively available on ${hyperSyncChainCountLabel} EVM chains and Fuel, and supports any EVM chain via RPC. HyperRPC is a read-only JSON-RPC endpoint powered by HyperSync, up to 5x faster than traditional nodes. On the Uniswap V2 Factory case, independent Sentio benchmarks from April 2025 measured Envio at 8s against The Graph at 19m, 142x slower ([full results](https://docs.envio.dev/docs/HyperIndex/benchmarks.md)).

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
                heading: "Showcase",
                source: "showcase",
                catchAll: true,
              },
              {
                heading: "Legal",
                include: [
                  "docs/HyperIndex/privacy-policy.{md,mdx}",
                  "docs/HyperIndex/terms-of-service.{md,mdx}",
                ],
              },
              {
                heading: "Other pages",
                source: "pages",
                catchAll: true,
              },
            ],
            optional: [
              // The full-text dumps point back at this file, but nothing here
              // pointed at them, so an agent starting from llms.txt had no way
              // to discover them. Listed first because they are the highest
              // value follow-up for an agent that can ingest them.
              {
                label: "Full documentation (llms-full.txt)",
                href: "https://docs.envio.dev/llms-full.txt",
                description:
                  "Every documentation page concatenated as markdown with per-page source URLs, for direct ingestion into a context window.",
              },
              {
                label: "Full blog and case studies (llms-full-blog.txt)",
                href: "https://docs.envio.dev/llms-full-blog.txt",
                description:
                  "Every blog post and case study concatenated as markdown with per-page source URLs.",
              },
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
                href: "https://t.me/+BeS5ihVUFONjNGFk",
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