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
    from: "/docs/hyperindex-basics",
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
  tagline: "Envio's documentation for HyperIndex, HyperSync and HyperRPC. Learn how to index blockchain data, query real-time data and build production-ready applications.",
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
          blogTitle: "Envio Blog",
          blogDescription: "News, announcements, tutorials, and developer updates from the Envio team.",
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
      // Add custom CSS for smaller sidebar text
      stylesheets: [
        {
          href: "/custom.css",
          type: "text/css",
        },
      ],
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
            to: "videos",
            label: "Shipper's Logs",
            position: "left",
          },
          {
            to: "showcase",
            label: "Showcase",
            position: "left",
            className: "navbar__item--showcase",
          },
          {
            to: "/blog",
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
                href: "https://discord.gg/Q9qt8gZ2fX",
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
        excludeRoutes: [
          "/docs/HyperIndex-LLM/**",
          "/docs/HyperSync-LLM/**",
          "/docs/HyperRPC-LLM/**",
        ],
      },
    ],
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

## HyperIndex

### Core

- [Configuration Schema Reference](https://docs.envio.dev/docs/HyperIndex/config-schema-reference.md): Detailed reference for every field and option in the Envio \`config.yaml\` configuration file used to configure HyperIndex indexers.
- [Loading Dynamic Contracts / Factories](https://docs.envio.dev/docs/HyperIndex/dynamic-contracts.md): Learn how to track and index dynamically created contracts from factory contracts.
- [Effect API](https://docs.envio.dev/docs/HyperIndex/effect-api.md): Learn how to use the Effect API for external calls in handlers.
- [Generated Indexing Files](https://docs.envio.dev/docs/HyperIndex/generated-files.md): Learn how generated files handle type-safe data access, event processing, and runtime indexing.
- [HyperSync as Data Source](https://docs.envio.dev/docs/HyperIndex/hypersync.md): Learn how HyperSync is used in HyperIndex to fetch raw blockchain data.
- [Loaders](https://docs.envio.dev/docs/HyperIndex/loaders.md): Learn how Loaders improved database access performance for event handlers.
- [Metadata Query](https://docs.envio.dev/docs/HyperIndex/metadata-query.md): See indexing progress and metadata per chain using HyperIndex _meta query.
- [Multichain Indexing](https://docs.envio.dev/docs/HyperIndex/multichain-indexing.md): Learn how to index and process events across multiple chains with HyperIndex.
- [Benchmarking Your Indexer](https://docs.envio.dev/docs/HyperIndex/benchmarking.md): Learn how to benchmark your indexer to identify bottlenecks and optimize performance.
- [Database Performance Optimization](https://docs.envio.dev/docs/HyperIndex/database-performance-optimization.md): Learn how to optimize HyperIndex databases with indices and schema design for faster queries.
- [Historical Sync](https://docs.envio.dev/docs/HyperIndex/historical-sync.md): Learn how to optimize historical sync with HyperIndex for fast and efficient data retrieval.
- [Performance Optimization](https://docs.envio.dev/docs/HyperIndex/performance.md): Learn how to optimize HyperIndex performance for syncing, indexing, and querying data.
- [Understanding Chain Head Latency](https://docs.envio.dev/docs/HyperIndex/latency-at-head.md): Learn how Envio keeps blockchain indexers updated with low latency and reliable multi-chain sync.
- [Preload Optimization](https://docs.envio.dev/docs/HyperIndex/preload-optimization.md): Learn how preload optimization improves event handlers with batched reads and parallel external calls.
- [Query Conversion Guide](https://docs.envio.dev/docs/HyperIndex/query-conversion.md): Learn how to convert queries from TheGraph's custom GraphQL syntax to Envio's standard GraphQL syntax.
- [Chain Reorganization Support](https://docs.envio.dev/docs/HyperIndex/reorgs-support.md): Learn how to handle chain reorgs and keep your indexed data consistent.
- [RPC as Data Source](https://docs.envio.dev/docs/HyperIndex/rpc-sync.md): Learn how to index any EVM blockchain using RPC and optimize performance with HyperIndex.
- [Terminology & Key Concepts](https://docs.envio.dev/docs/HyperIndex/terminology.md): Explore key terms for fast reference and blockchain indexer development.
- [Using WebSockets with GraphQL](https://docs.envio.dev/docs/HyperIndex/websockets.md): Learn how to use WebSocket connections with your HyperIndex GraphQL endpoint.
- [Wildcard Indexing & Topic Filtering](https://docs.envio.dev/docs/HyperIndex/wildcard-indexing.md): Learn how to index events using wildcard indexing feature and topic based filtering.
- [Block Handlers](https://docs.envio.dev/docs/HyperIndex/block-handlers.md): Learn how to run custom logic on every blockchain block or at set intervals using onBlock.
- [Envio CLI Reference](https://docs.envio.dev/docs/HyperIndex/cli-commands.md): Explore and manage indexer projects with Envio CLI, from setup to development and benchmarking.
- [Configuration File (config.yaml)](https://docs.envio.dev/docs/HyperIndex/configuration-file.md): Learn how to configure HyperIndex with contracts, events, networks, and advanced indexing options.
- [Accessing Contract State in Event Handlers](https://docs.envio.dev/docs/HyperIndex/contract-state.md): Learn how to efficiently fetch and store token contract data from events using RPC, multicall, and caching.
- [Environment Variables](https://docs.envio.dev/docs/HyperIndex/environment-variables.md): Learn how to configure and manage Envio environment variables for your blockchain indexer.
- [Event Handlers (src/EventHandlers.*)](https://docs.envio.dev/docs/HyperIndex/event-handlers.md): Learn how to register and manage event handlers for efficient data indexing.
- [Using IPFS with Envio Indexers](https://docs.envio.dev/docs/HyperIndex/ipfs.md): Learn how to fetch and index NFT metadata from IPFS using Envio for complete on-chain and off-chain data.
- [Navigating Hasura](https://docs.envio.dev/docs/HyperIndex/navigating-hasura.md): Explore and interact with your locally indexed blockchain data using Hasura GraphQL.
- [Running The Indexer Locally](https://docs.envio.dev/docs/HyperIndex/running-locally.md): Learn how to start, run, and manage the Envio indexer locally with Docker and Hasura.
- [Entities Schema (schema.graphql)](https://docs.envio.dev/docs/HyperIndex/schema.md): Learn how to define GraphQL schemas, manage entities, and handle different types in HyperIndex.
- [Testing](https://docs.envio.dev/docs/HyperIndex/testing.md): Learn to test HyperIndex indexers with mock databases, simulated events, and full workflow validation.

### Envio Cloud

- [Pricing & Billing](https://docs.envio.dev/docs/HyperIndex/hosted-service-billing.md): Explore Envio's flexible pricing tiers, from free development plans to scalable production options.
- [Deploying Your Indexer](https://docs.envio.dev/docs/HyperIndex/hosted-service-deployment.md): Learn how to deploy, manage, and version your indexers effortlessly using git workflow.
- [Features](https://docs.envio.dev/docs/HyperIndex/hosted-service-features.md): Explore production-ready features of the Envio Cloud including monitoring, zero-downtime rollbacks, and deployment management.
- [Monitoring Your Indexer](https://docs.envio.dev/docs/HyperIndex/hosted-service-monitoring.md): Monitor your deployed indexer health, sync progress, and performance using the Envio Cloud dashboard.
- [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service.md): Explore Envio's fully managed hosting for indexers with easy Git deployments, monitoring, and multi-chain support.
- [Organisation Setup](https://docs.envio.dev/docs/HyperIndex/organisation-setup.md): Learn how to create an organisation in the Envio Cloud and manage team members.
- [Self-Hosting Guide](https://docs.envio.dev/docs/HyperIndex/self-hosting.md): Learn how to self-host Envio indexers with Docker, PostgreSQL, and Hasura for full control.

### Troubleshooting

- [Common Issues](https://docs.envio.dev/docs/HyperIndex/common-issues.md): Discover quick fixes and proven solutions for setup, runtime, and configuration issues in Envio.
- [Error Codes](https://docs.envio.dev/docs/HyperIndex/error-codes.md): Explore Envio HyperIndex error codes with clear explanations and quick fixes for common issues.
- [Logging](https://docs.envio.dev/docs/HyperIndex/logging.md): Learn how to configure and use Envio HyperIndex logging to monitor performance and troubleshoot efficiently.
- [Reserved Words](https://docs.envio.dev/docs/HyperIndex/reserved-words.md): Learn which reserved words in Envio cause validation errors and how to rename them safely.

### Tutorials & Examples

- [Velodrome & Aerodrome Indexer](https://docs.envio.dev/docs/HyperIndex/example-aerodrome-dex-indexer.md): Explore multi-chain Velodrome & Aerodrome DEX data with real-time tracking of pools, swaps, and liquidity.
- [ENS Indexer](https://docs.envio.dev/docs/HyperIndex/example-ens.md): Explore the ENS indexer built with Envio.
- [Cross-Chain Messaging](https://docs.envio.dev/docs/HyperIndex/example-cross-chain-messaging.md): Explore cross-chain messaging and track events across multiple chains efficiently.
- [Compound V2 Liquidation Metrics](https://docs.envio.dev/docs/HyperIndex/example-liquidation-metrics.md): Explore Compound V2 liquidation metrics across multiple chains with Envio.
- [Sablier Protocol Indexers](https://docs.envio.dev/docs/HyperIndex/example-sablier.md): Explore Sablier protocol indexers to track token streams and distributions across multiple chains.
- [Uniswap V4 Multichain indexer](https://docs.envio.dev/docs/HyperIndex/example-uniswap-v4-multi-chain-indexer.md): Explore real-time Uniswap V4 data across multiple chains with Envio.
- [Indexing Greeter Contract Using Envio](https://docs.envio.dev/docs/HyperIndex/greeter-tutorial.md): Learn how to build and run a multi-chain indexer that tracks Greeter contract events using Envio.
- [Getting Price Data in Your Indexer](https://docs.envio.dev/docs/HyperIndex/price-data.md): Learn how to fetch and integrate token price data in your indexer using oracles, DEX pools, and APIs.
- [Indexing ERC20 Token Transfers on Base](https://docs.envio.dev/docs/HyperIndex/tutorial-erc20-token-transfers.md): Learn how to index and query USDC ERC20 transfers on Base using Envio.
- [Indexing Sway Farm on the Fuel Network](https://docs.envio.dev/docs/HyperIndex/tutorial-indexing-fuel.md): Learn how to index Sway Farm on Fuel and track player events with Envio.
- [Indexing Optimism Bridge Deposits](https://docs.envio.dev/docs/HyperIndex/tutorial-op-bridge-deposits.md): Learn to quickly index Optimism Bridge deposits and explore OP Bridge event data.
- [Scaffold-Eth-2 Envio Extension](https://docs.envio.dev/docs/HyperIndex/scaffold-eth-2-extension-tutorial.md): Scaffold-ETH Extension: Get a boilerplate indexer for your deployed smart contracts and start tracking events instantly.
- [HyperIndex Benchmarks](https://docs.envio.dev/docs/HyperIndex/benchmarks.md): Discover HyperIndex benchmarks and see why it's the fastest blockchain data indexer.
- [HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/contract-import.md): Learn to quickly autogenerate and configure a HyperIndex indexer for any smart contract.
- [Fuel](https://docs.envio.dev/docs/HyperIndex/fuel.md): Explore how to index and query real-time and historical data on Fuel Network with HyperIndex.
- [Getting Started with Envio](https://docs.envio.dev/docs/HyperIndex/getting-started.md): Get started with Envio indexer setup, templates, and local or hosted deployment quickly.
- [Licensing](https://docs.envio.dev/docs/HyperIndex/licensing.md): Learn how Envio's licensing lets developers self-host, use generated code, and stay open while protecting Envio Cloud.
- [Migrate from Alchemy to Envio](https://docs.envio.dev/docs/HyperIndex/migrate-from-alchemy.md): Easily migrate your existing Alchemy subgraphs to Envio for 143x faster indexing than subgraphs, multichain support, and a better developer experience.
- [Migrate to HyperIndex V3 Alpha](https://docs.envio.dev/docs/HyperIndex/migrate-to-v3.md): Learn how to upgrade from HyperIndex V2 to V3 Alpha, featuring ESM support, top-level await, automatic handler registration, and more.
- [Migrate from The Graph to Envio](https://docs.envio.dev/docs/HyperIndex/migration-guide.md): Easily migrate your existing subgraph to HyperIndex for up to 100x faster indexing speeds, multichain support, and a better developer experience.
- [HyperIndex: Fast Multichain Blockchain Indexer](https://docs.envio.dev/docs/HyperIndex/overview.md): Explore HyperIndex, a blazing-fast multichain indexer for real-time blockchain data.
- [Solana](https://docs.envio.dev/docs/HyperIndex/solana.md): Experimental Solana support in HyperIndex. Supports Block Handler, Effect API, and Envio Cloud.

## HyperSync

- [HyperSync](https://docs.envio.dev/docs/HyperSync/overview.md): Explore HyperSync for ultra-fast blockchain data access and flexible queries across 70+ networks.
- [HyperSync Quickstart](https://docs.envio.dev/docs/HyperSync/hypersync-quickstart.md): Get started quickly with HyperSync to stream and filter blockchain events.
- [Using HyperSync](https://docs.envio.dev/docs/HyperSync/hypersync-usage.md): Learn how to fetch, filter, and decode blockchain data using HyperSync.
- [HyperSync Clients](https://docs.envio.dev/docs/HyperSync/hypersync-clients.md): Explore HyperSync clients for fast blockchain data access in Node.js, Python, Rust, and Go.
- [HyperSync Query](https://docs.envio.dev/docs/HyperSync/hypersync-query.md): Explore HyperSync queries to efficiently retrieve, filter, and join blockchain data.
- [Preset Queries](https://docs.envio.dev/docs/HyperSync/hypersync-presets.md): Explore ready-to-use HyperSync query presets to fetch blocks, transactions, and logs efficiently.
- [Using curl with HyperSync](https://docs.envio.dev/docs/HyperSync/hypersync-curl-examples.md): Explore how to quickly fetch blockchain data using curl commands with HyperSync.
- [API Tokens](https://docs.envio.dev/docs/HyperSync/api-tokens.md): Learn how to generate and use HyperSync API tokens for secure access.
- [Supported Networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks.md): See all networks currently supported by HyperSync, including coverage tiers, reliability notes and the criteria we use when adding new chains.
- [Analyzing All Transactions To and From an Address](https://docs.envio.dev/docs/HyperSync/tutorial-address-transactions.md): Explore all transactions, token balances, and approvals for any EVM address with HyperSync.
- [HyperFuel](https://docs.envio.dev/docs/HyperSync/hyperfuel.md): HyperFuel gives you a high performance way to query and sync Fuel network data using HyperSync. Access real-time and historical data with flexible queries across contracts, events and state.
- [HyperFuel Query](https://docs.envio.dev/docs/HyperSync/hyperfuel-query.md): Explore all fields and parameters for HyperFuel queries.

## HyperRPC

- [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc.md): Ultra-fast read-only RPC built on top of HyperSync, offering up to 5x faster performance than traditional nodes for data-intensive operations like eth_getLogs, block queries, and transaction lookups. Use as a drop-in replacement for existing JSON-RPC tooling — no code changes needed. Covers supported methods, API tokens, performance benchmarks, and getting started.

## Supported Networks

- [HyperIndex Supported Networks](https://docs.envio.dev/docs/HyperIndex/supported-networks.md): Full list of networks supported by HyperIndex, including EVM chains, L2s, and testnets. Also covers using any EVM chain via RPC and local development networks.
- [HyperSync Supported Networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks.md): Full list of networks supported by HyperSync, including coverage tiers, reliability notes, and the criteria used when adding new chains.
- [HyperRPC Supported Networks](https://docs.envio.dev/docs/HyperRPC/hyperrpc-supported-networks.md): Full list of networks supported by HyperRPC, including endpoints, network IDs, and trace support.

## Legal

- [Privacy Policy](https://docs.envio.dev/docs/HyperIndex/privacy-policy.md): Read Envio's Privacy Policy covering how we collect, use, store, and protect your personal data when you use our website and services.
- [Terms of Service](https://docs.envio.dev/docs/HyperIndex/terms-of-service.md): Read the Terms and Conditions for using Envio services.
`,
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
      "@docusaurus/plugin-client-redirects",
      {
        redirects: redirectsList,
      },
    ],
  ],
  themes: ["docusaurus-json-schema-plugin"],
};

module.exports = config;