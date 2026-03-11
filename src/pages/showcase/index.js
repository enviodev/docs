import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { sites } from "./_data";

const TITLE = "Envio Showcase";
const DESCRIPTION = "Explore live demos built with HyperIndex and HyperSync.";

function ShowcaseCard({ site }) {
  return (
    <Link
      to={`/showcase/${site.slug}`}
      className="showcase-card"
      style={{
        height: "100%",
        width: "100%",
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
      <div
        style={{
          height: "200px",
          overflow: "hidden",
          borderBottom: "1px solid #242424",
        }}
      >
        {site.video ? (
          <video
            src={site.video}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
          />
        ) : site.image ? (
          <img
            src={site.image}
            alt={site.title}
            style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
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
              fontSize: "0.7rem",
              fontWeight: 400,
              padding: "1px 6px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#737373",
              marginRight: "6px",
              letterSpacing: "0.02em",
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
