import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

const TITLE = "Envio Showcase";
const DESCRIPTION = "Explore live demos built with HyperIndex and HyperSync.";

const tags = {
  hyperindex: "HyperIndex",
  hypersync: "HyperSync",
};

const sites = [
  {
    title: "v4.xyz",
    description: "The hub for Uniswap V4 data, analytics, and insights.",
    image: "/img/showcase/www.v4.xyz-scroll_original.gif",
    source: "https://v4.xyz",
    tags: [tags.hyperindex],
  },
  {
    title: "Safescan",
    description:
      "Real-time explorer of Safe multi-signature wallets across multiple chains. Search by safe address, owner address, or transaction hash.",
    image: "/img/showcase/safe-scan.xyz_.jpg",
    source: "https://safe-scan.xyz",
    tags: [tags.hyperindex],
  },
  {
    title: "Stable Volume",
    description:
      "A real-time dashboard for monitoring stablecoin transactions across 10+ chains.",
    image: "/img/showcase/www.stablevolume.com-scroll_original.gif",
    source: "https://www.stablevolume.com/",
    tags: [tags.hyperindex],
  },
  {
    title: "Liqo",
    description:
      "A multi-chain liquidation tracking platform for DeFi Lending protocols.",
    image: "/img/showcase/www.liqo.xyz_.png",
    source: "https://liqo.xyz",
    tags: [tags.hyperindex],
  },
  {
    title: "Stable Radar",
    description:
      "A real-time dashboard for USDC transaction monitoring across multiple chains.",
    video: "/img/showcase/stable-radar.webm",
    source: "https://stable-radar.com",
    tags: [tags.hypersync],
  },
  {
    title: "Oracle Wars",
    description:
      "Visualize and compare real-time oracle price data across multiple oracles.",
    image: "/img/showcase/www.oraclewars.xyz_.png",
    source: "https://oraclewars.xyz/",
    tags: [tags.hyperindex],
  },
  {
    title: "Solana Stables",
    description:
      "A real-time dashboard for tracking stablecoin transfers on Solana.",
    video: "/img/showcase/solana-stables.webm",
    source: "https://solanastables.com/",
    tags: [tags.hyperindex],
  },
  {
    title: "The List",
    description:
      "Track addresses banned from using major stablecoins across chains.",
    image: "/img/showcase/thebannedlist.xyz_.png",
    source: "https://thebannedlist.xyz/",
    tags: [tags.hyperindex],
  },
  {
    title: "CryptoKitties Genome Visualiser",
    description:
      "Trace and explore the genetic traits of CryptoKitties from parents to offspring.",
    image: "/img/showcase/crypto-kitties-genome-visualiser.vercel.app_.png",
    source: "https://crypto-kitties-genome-visualiser.vercel.app/",
    tags: [tags.hyperindex],
  },
  {
    title: "Chain Density",
    description:
      "Analyze and visualize transaction and event density for any address across 70+ chains.",
    image: "/img/showcase/chaindensity.xyz_.png",
    source: "https://chaindensity.xyz/",
    tags: [tags.hypersync],
  },
  {
    title: "Snubb",
    description:
      "A TUI tool for scanning token approvals and tracking exposure.",
    image: "/img/showcase/snubb.png",
    source: "https://www.npmjs.com/package/snubb",
    tags: [tags.hypersync],
  },
  {
    title: "LogTUI",
    description: "A TUI for monitoring blockchain events in real time.",
    image: "/img/showcase/logtui.gif",
    source: "https://www.npmjs.com/package/logtui",
    tags: [tags.hypersync],
  },
  {
    title: "Chain Pulse",
    description:
      "A TUI for tracking EVM chain activity and stats in real time.",
    image: "/img/showcase/chainpulse.png",
    source: "https://www.npmjs.com/package/chainpulse",
    tags: [tags.hypersync],
  },
  {
    title: "HyperSync Query Builder",
    description:
      "Interactive playground for building and running HyperSync queries directly in your browser.",
    image: "/img/showcase/builder.hypersync.xyz_.png",
    source: "https://builder.hypersync.xyz",
    tags: [tags.hypersync],
  },
];

function ShowcaseCard({ site }) {
  return (
    <Link
      to={site.source}
      className="showcase-card"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        border: "1px solid #242424",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "border-color 0.2s ease, transform 0.2s ease",
      }}
    >
      <div>
        {site.video ? (
          <video
            src={site.video}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        ) : site.image ? (
          <img
            src={site.image}
            alt={site.title}
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        ) : null}
      </div>

      <div style={{ padding: "16px 20px", flexGrow: 1 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 600 }}>
          {site.title}
        </h3>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#a1a1a1", lineHeight: 1.5 }}>
          {site.description}
        </p>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        {site.tags.map((tag, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid #242424",
              color: "#a1a1a1",
              marginRight: "6px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function ShowcaseCards() {
  return (
    <div className="container">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {sites.map((site, idx) => (
          <div
            key={idx}
            style={{ display: "flex", flex: "0 0 calc((100% - 2rem) / 3)" }}
          >
            <ShowcaseCard site={site} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1" style={{ fontSize: "2.5rem", fontWeight: 700 }}>
        {TITLE}
      </Heading>
      <p style={{ color: "#a1a1a1", fontSize: "1.1rem" }}>{DESCRIPTION}</p>
    </section>
  );
}

export default function Showcase() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <style>{`
        .showcase-card:hover {
          border-color: #454545 !important;
          transform: scale(1.02);
        }
      `}</style>
      <main className="margin-vert--lg">
        <ShowcaseHeader />

        <ShowcaseCards />
      </main>
    </Layout>
  );
}
