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
          editUrl:
            "https://github.com/Float-Capital/indexer-docs/tree/dev/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
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
            width: 100,
            height: 50,
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
                href: "https://discord.gg/float-capital",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/envio_indexer",
              },
              {
                label: "Lens",
                href: "https://lenster.xyz/u/float.lens",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/Float-Capital/envio",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href='https://envio.dev'>Envio</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
