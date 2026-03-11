import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";

export default function ShowcaseDetail({ site }) {
  if (!site) return null;

  const metaDescription = site.longDescription
    ? site.longDescription.slice(0, 160)
    : site.description;

  return (
    <Layout title={`${site.title} — Envio Showcase`} description={metaDescription}>
      <Head>
        <meta property="og:title" content={`${site.title} — Envio Showcase`} />
        <meta property="og:description" content={metaDescription} />
        {site.image && <meta property="og:image" content={site.image} />}
        <meta name="twitter:title" content={`${site.title} — Envio Showcase`} />
        <meta name="twitter:description" content={metaDescription} />
      </Head>

      <main
        className="container"
        style={{ maxWidth: "800px", padding: "3rem 1rem" }}
      >
        <Link
          to="/showcase"
          style={{
            fontSize: "0.875rem",
            color: "var(--ifm-color-emphasis-600)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "2rem",
          }}
        >
          &larr; Back to Showcase
        </Link>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: "0 0 12px" }}>
            {site.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
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
                  letterSpacing: "0.02em",
                }}
              >
                {tag}
              </span>
            ))}

            <span style={{ color: "var(--ifm-color-emphasis-400)" }}>·</span>

            <Link
              to={site.source}
              style={{
                fontSize: "0.875rem",
                color: "var(--ifm-color-emphasis-600)",
              }}
            >
              {site.source.replace(/^https?:\/\/(www\.)?/, "")} ↗
            </Link>
          </div>
        </div>

        <Link
          to={site.source}
          style={{
            display: "block",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #242424",
            marginBottom: "2rem",
            cursor: "pointer",
          }}
        >
          {site.video ? (
            <video
              src={site.video}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", display: "block" }}
            />
          ) : site.image ? (
            <img
              src={site.image}
              alt={site.title}
              style={{ width: "100%", display: "block" }}
            />
          ) : null}
        </Link>

        <div style={{ lineHeight: 1.8, color: "var(--ifm-color-emphasis-700)" }}>
          <p style={{ fontSize: "1rem" }}>
            {site.longDescription || site.description}
          </p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link
            to={site.source}
            style={{
              display: "inline-block",
              padding: "10px 24px",
              borderRadius: "8px",
              background: "linear-gradient(to right, #FF8267, #FDD700)",
              color: "#000",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            Visit {site.title} ↗
          </Link>
        </div>
      </main>
    </Layout>
  );
}
