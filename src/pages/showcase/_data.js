const tags = {
  hyperindex: "HyperIndex",
  hypersync: "HyperSync",
};

const sites = [
  {
    slug: "v4-xyz",
    title: "v4.xyz",
    description: "The hub for Uniswap V4 data, analytics, and insights.",
    longDescription:
      "v4.xyz is the central hub for exploring Uniswap V4 hook deployments, pool data, and on-chain analytics. Built with Envio's HyperIndex, it provides real-time indexing of Uniswap V4 smart contract events across multiple chains, enabling developers and researchers to track pool creation, liquidity positions, swap activity, and hook usage. The platform offers fast, reliable data access through a GraphQL API powered by HyperIndex's multi-chain indexing capabilities.",
    image: "/img/showcase/www.v4.xyz-scroll_original.gif",
    source: "https://v4.xyz",
    tags: [tags.hyperindex],
  },
  {
    slug: "safescan",
    title: "Safescan",
    description:
      "Real-time explorer of Safe multi-signature wallets across multiple chains. Search by safe address, owner address, or transaction hash.",
    longDescription:
      "Safescan is a multi-chain explorer purpose-built for Safe (formerly Gnosis Safe) multi-signature wallets. Powered by Envio's HyperIndex, it indexes Safe wallet creation events, transaction proposals, confirmations, and executions across multiple EVM chains in real time. Users can search by safe address, owner address, or transaction hash to get a comprehensive view of multi-sig activity. HyperIndex's fast syncing and multi-chain support make it possible to aggregate Safe data from numerous networks into a single, unified interface.",
    image: "/img/showcase/safe-scan.xyz_.jpg",
    source: "https://safe-scan.xyz",
    tags: [tags.hyperindex],
  },
  {
    slug: "stable-volume",
    title: "Stable Volume",
    description:
      "A real-time dashboard for monitoring stablecoin transactions across 10+ chains.",
    longDescription:
      "Stable Volume is a real-time analytics dashboard that tracks stablecoin transaction volume across more than 10 blockchain networks. Using Envio's HyperIndex, it indexes transfer events from major stablecoins including USDT, USDC, DAI, and others, providing up-to-date volume metrics, chain-by-chain breakdowns, and historical trend analysis. The platform leverages HyperIndex's multi-chain indexing to deliver a comprehensive cross-chain view of stablecoin activity, helping users understand liquidity flows and adoption trends across the ecosystem.",
    image: "/img/showcase/www.stablevolume.com-scroll_original.gif",
    source: "https://www.stablevolume.com/",
    tags: [tags.hyperindex],
  },
  {
    slug: "liqo",
    title: "Liqo",
    description:
      "A multi-chain liquidation tracking platform for DeFi Lending protocols.",
    longDescription:
      "Liqo is a multi-chain liquidation tracking platform focused on DeFi lending protocols such as Aave, Compound, and others. Built with Envio's HyperIndex, it indexes liquidation events, health factor changes, and collateral positions across multiple chains in real time. The platform provides alerts, historical liquidation data, and protocol-level analytics, giving DeFi users and liquidators the information they need to monitor at-risk positions and understand liquidation dynamics across the lending ecosystem.",
    image: "/img/showcase/www.liqo.xyz_.png",
    source: "https://liqo.xyz",
    tags: [tags.hyperindex],
  },
  {
    slug: "stable-radar",
    title: "Stable Radar",
    description:
      "A real-time dashboard for USDC transaction monitoring across multiple chains.",
    longDescription:
      "Stable Radar is a real-time monitoring dashboard built with Envio's HyperSync that tracks USDC transactions across multiple blockchain networks. HyperSync's high-performance data streaming enables Stable Radar to process and display large volumes of stablecoin transfer data with minimal latency. The dashboard provides live transaction feeds, volume analytics, and cross-chain comparisons, making it a powerful tool for monitoring USDC flows and identifying trends in stablecoin usage across the multi-chain ecosystem.",
    video: "/img/showcase/stable-radar.webm",
    source: "https://stable-radar.com",
    tags: [tags.hypersync],
  },
  {
    slug: "oracle-wars",
    title: "Oracle Wars",
    description:
      "Visualize and compare real-time oracle price data across multiple oracles.",
    longDescription:
      "Oracle Wars is an interactive visualization tool that compares real-time price feed data from multiple blockchain oracle providers including Chainlink, Pyth, and others. Powered by Envio's HyperIndex, it indexes oracle price update events across chains, allowing users to compare price accuracy, update frequency, and deviation between different oracle solutions. The platform helps developers and researchers evaluate oracle reliability and make informed decisions about which price feed providers to integrate into their DeFi applications.",
    image: "/img/showcase/www.oraclewars.xyz_.png",
    source: "https://oraclewars.xyz/",
    tags: [tags.hyperindex],
  },
  {
    slug: "solana-stables",
    title: "Solana Stables",
    description:
      "A real-time dashboard for tracking stablecoin transfers on Solana.",
    longDescription:
      "Solana Stables is a real-time analytics dashboard that tracks stablecoin transfer activity on the Solana blockchain. Built with Envio's HyperIndex, it indexes token transfer events for major stablecoins on Solana, providing live transaction feeds, volume metrics, and historical trend data. The platform demonstrates HyperIndex's capabilities beyond EVM chains, offering fast and reliable indexing of Solana's high-throughput transaction data for stablecoin monitoring and analysis.",
    video: "/img/showcase/solana-stables.webm",
    source: "https://solanastables.com/",
    tags: [tags.hyperindex],
  },
  {
    slug: "the-list",
    title: "The List",
    description:
      "Track addresses banned from using major stablecoins across chains.",
    longDescription:
      "The List (The Banned List) is a transparency tool that tracks wallet addresses that have been blacklisted or banned from using major stablecoins such as USDT and USDC across multiple blockchain networks. Powered by Envio's HyperIndex, it indexes blacklist and ban events emitted by stablecoin smart contracts, providing a comprehensive, up-to-date registry of restricted addresses. The platform serves as a valuable resource for compliance teams, researchers, and DeFi developers who need visibility into stablecoin censorship activity.",
    image: "/img/showcase/thebannedlist.xyz_.png",
    source: "https://thebannedlist.xyz/",
    tags: [tags.hyperindex],
  },
  {
    slug: "cryptokitties-genome-visualiser",
    title: "CryptoKitties Genome Visualiser",
    description:
      "Trace and explore the genetic traits of CryptoKitties from parents to offspring.",
    longDescription:
      "The CryptoKitties Genome Visualiser is an interactive tool that lets users explore the genetic trait system of CryptoKitties NFTs. Built with Envio's HyperIndex, it indexes breeding events, birth events, and genome data from the CryptoKitties smart contracts on Ethereum. Users can trace genetic traits from parent kitties to offspring, visualize trait inheritance patterns, and explore the full genealogy of any CryptoKitty. The project showcases HyperIndex's ability to index complex on-chain data structures and make them accessible through an intuitive interface.",
    image: "/img/showcase/crypto-kitties-genome-visualiser.vercel.app_.png",
    source: "https://crypto-kitties-genome-visualiser.vercel.app/",
    tags: [tags.hyperindex],
  },
  {
    slug: "chain-density",
    title: "Chain Density",
    description:
      "Analyze and visualize transaction and event density for any address across 70+ chains.",
    longDescription:
      "Chain Density is a cross-chain analytics tool that visualizes transaction and event density for any wallet address across more than 70 blockchain networks. Built with Envio's HyperSync, it leverages high-speed data retrieval to quickly scan activity across dozens of chains, generating density maps and activity heatmaps for any given address. The platform is useful for on-chain investigators, portfolio trackers, and anyone looking to understand multi-chain wallet activity patterns without manually checking each network individually.",
    image: "/img/showcase/chaindensity.xyz_.png",
    source: "https://chaindensity.xyz/",
    tags: [tags.hypersync],
  },
  {
    slug: "snubb",
    title: "Snubb",
    description:
      "A TUI tool for scanning token approvals and tracking exposure.",
    longDescription:
      "Snubb is a terminal user interface (TUI) tool built with Envio's HyperSync that scans and analyzes ERC-20 token approval data for any wallet address. Using HyperSync's fast data retrieval, Snubb quickly identifies all active token approvals, their spender contracts, and the approved amounts, helping users understand their exposure to potentially risky smart contract permissions. It's a lightweight, developer-friendly tool for auditing token approvals directly from the command line.",
    image: "/img/showcase/snubb.png",
    source: "https://www.npmjs.com/package/snubb",
    tags: [tags.hypersync],
  },
  {
    slug: "logtui",
    title: "LogTUI",
    description: "A TUI for monitoring blockchain events in real time.",
    longDescription:
      "LogTUI is a terminal user interface tool that provides real-time monitoring of blockchain events directly in your terminal. Powered by Envio's HyperSync, it streams on-chain event logs with minimal latency, allowing developers to watch contract events, debug transactions, and monitor protocol activity from the command line. LogTUI supports filtering by contract address, event signature, and topic, making it a versatile tool for blockchain developers who prefer terminal-based workflows.",
    image: "/img/showcase/logtui.gif",
    source: "https://www.npmjs.com/package/logtui",
    tags: [tags.hypersync],
  },
  {
    slug: "chain-pulse",
    title: "Chain Pulse",
    description:
      "A TUI for tracking EVM chain activity and stats in real time.",
    longDescription:
      "Chain Pulse is a terminal user interface application that displays real-time activity metrics and statistics for EVM-compatible blockchain networks. Built with Envio's HyperSync, it streams block data, transaction counts, gas usage, and event activity in a compact terminal dashboard. Chain Pulse provides a quick, at-a-glance view of chain health and activity, useful for node operators, developers, and researchers who want to monitor network conditions without leaving the terminal.",
    image: "/img/showcase/chainpulse.png",
    source: "https://www.npmjs.com/package/chainpulse",
    tags: [tags.hypersync],
  },
  {
    slug: "hypersync-query-builder",
    title: "HyperSync Query Builder",
    description:
      "Interactive playground for building and running HyperSync queries directly in your browser.",
    longDescription:
      "The HyperSync Query Builder is an interactive browser-based playground for constructing and executing HyperSync queries. It provides a visual interface for building complex data queries against any HyperSync-supported blockchain, with support for filtering by contract address, event signatures, transaction parameters, and block ranges. Users can test queries in real time, inspect results, and export query configurations for use in their own applications. It's an essential tool for developers getting started with HyperSync or prototyping new data pipelines.",
    image: "/img/showcase/builder.hypersync.xyz_.png",
    source: "https://builder.hypersync.xyz",
    tags: [tags.hypersync],
  },
];

export { tags, sites };
