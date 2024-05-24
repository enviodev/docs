const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Envio",
  tagline: "The fastest most flexible way to get on-chain data.",
  favicon: "img/favicon.ico",
  url: "https://docs.envio.dev",
  baseUrl: "/",
  organizationName: "float-capital",
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

  themeConfig: {
    navbar: {
      title: "",
      logo: {
        alt: "Envio Logo",
        src: "img/envio-logo.png",
        srcDark: "img/envio-logo.png",
        style: {
          width: 96,
          height: 40,
        },
      },
      items: [
        {
          to: 'docs/hypersync/intro',
          label: 'HyperSync Docs',
          position: 'left',
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'hypersync',
          position: 'left',
        },
        {
          to: 'docs/hyperindex/intro',
          label: 'HyperIndex Docs',
          position: 'left',
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'hyperindex',
          position: 'left',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'left',
        },
      ],
    },
    algolia: {
      apiKey: "0f966036bca0e26d512dc59f023d64c5",
      indexName: "envio",
      appId: "584MK2OMPZ",
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            { label: "Discord", href: "https://discord.gg/Q9qt8gZ2fX" },
            { label: "Twitter", href: "https://twitter.com/envio_indexer" },
            { label: "Lens", href: "https://lenster.xyz/u/envio.lens" }
          ],
        },
        { title: "More", items: [{ label: "Blog", to: "blog" }] },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Envio`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['rescript', 'bash', 'diff', 'json', 'javascript', 'typescript'],
    },
  },
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'hypersync',
        path: 'docs/hypersync',
        routeBasePath: 'docs/hypersync',
        sidebarPath: require.resolve('./sidebarsHypersync.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        versions: {
          current: {
            label: '1.0.0',
            path: '1.0.0',
          },
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'hyperindex',
        path: 'docs/hyperindex',
        routeBasePath: 'docs/hyperindex',
        sidebarPath: require.resolve('./sidebarsHyperindex.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        versions: {
          current: {
            label: '1.0.0',
            path: '1.0.0',
          },
          "1.1.0": {
            label: '1.1.0',
            path: '1.1.0',
          },
        },
      },
    ],
  ],
};

module.exports = config;
