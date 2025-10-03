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
        title: "Oracle Wars",
        description:
            "Visualize and compare real-time oracle price data across multiple oracles.",
        image: "/img/showcase/www.oraclewars.xyz_.png",
        source: "https://oraclewars.xyz/",
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
        tags: [tags.hyperindex],
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
];

function ShowcaseCard({ site }) {
    return (
        <div
            className="card margin--md shadow--md"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            <div className="card__image">
                <img src={site.image} alt={site.title} />
            </div>
            <div className="card__body" style={{ flexGrow: 1 }}>
                <h3>{site.title}</h3>
                <p>{site.description}</p>
            </div>
            <div className="card__footer">
                <div className="button-group button-group--block">
                    <Link className="button button--primary" to={site.source}>
                        Check Demo
                    </Link>
                </div>
                <div className="margin-top--sm">
                    {site.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="badge badge--secondary margin-right--sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ShowcaseCards() {
    return (
        <div className="container">
            <div className="row">
                {sites.map((site, idx) => (
                    <div
                        key={idx}
                        className="col col--6 margin-bottom--lg"
                        style={{ display: "flex" }}
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
            <Heading as="h1" style={{ fontSize: "2.5rem" }}>
                {TITLE}
            </Heading>
            <p>{DESCRIPTION}</p>
        </section>
    );
}

export default function Showcase() {
    return (
        <Layout title={TITLE} description={DESCRIPTION}>
            <main className="margin-vert--lg">
                <ShowcaseHeader />

                <ShowcaseCards />
            </main>
        </Layout>
    );
}
