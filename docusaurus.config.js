const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Envio",
  tagline: "A fast, reliable, customizable indexing blockchain solution.",
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
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/Float-Capital/indexer-docs/tree/main/",
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
          src: "img/envio-black-logo.png",
          srcDark: "img/envio-white-logo.png",
          style: {
            width: 96,
            height: 40,
          },
        },
        items: [
          //  {
          //    to: "/",
          //    activeBasePath: "/",
          //    label: "Home",
          //    position: "left",
          //  },
          // {
          //   to: "docs/",
          //   activeBasePath: "docs",
          //   label: "Docs",
          //   position: "left",
          // },
          // {
          //   to: "blog/",
          //   activeBasePath: "blog",
          //   label: "Blog",
          //   position: "left",
          // },
          {
            href: "https://github.com/Float-Capital/envio",
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
                label: "GitHub",
                href: "https://github.com/envio-dev",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Envio`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["rescript"],
      },
    }),
};

module.exports = config;
