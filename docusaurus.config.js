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
  organizationName: "enviodev",
  projectName: "indexer-docs",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/docs/quickstart",
            to: "/docs/overview",
          },
        ],
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
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
            width: 96,
            height: 40,
          },
        },
        items: [
          {
            to: "docs/overview",
            activeBasePath: "docs",
            label: "Docs",
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
      },
      footer: {
        style: "dark",
        links: [
          // {
          //   title: "Docs",
          //   items: [
          //     {
          //       label: "Tutorial",
          //       to: "docs/intro",
          //     },
          //   ],
          // },
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
        additionalLanguages: ['rescript', 'bash', 'diff', 'json', 'javascript', 'typescript'],
      },
    }),
};

module.exports = config;
