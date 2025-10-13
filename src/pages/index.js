import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} - Documentation`}
      description="The fastest most flexible way to get on-chain data."
    >
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Envio Documentation</h1>
          <p className={styles.subtitle}>
            The fastest most flexible way to get on-chain data.
          </p>

          <div className={styles.docsGrid}>
            <div className={styles.docSection}>
              <h2>Regular Documentation</h2>
              <div className={styles.docLinks}>
                <Link className={styles.docLink} to="/docs/HyperIndex/overview">
                  HyperIndex Docs
                </Link>
                <Link className={styles.docLink} to="/docs/HyperSync/overview">
                  HyperSync Docs
                </Link>
                <Link className={styles.docLink} to="/docs/HyperRPC/overview-hyperrpc">
                  HyperRPC Docs
                </Link>
                <Link className={styles.docLink} to="/docs/HyperIndex/hosted-service">
                  HyperIndex Hosted Service Docs
                </Link>
              </div>
            </div>

            <div className={styles.docSection}>
              <h2>LLM-Friendly Documentation</h2>
              <p className={styles.llmDescription}>
                Single-file consolidated documentation optimized for Large
                Language Models
              </p>
              <div className={styles.docLinks}>
                <Link
                  className={styles.docLink}
                  to="/docs/HyperIndex-LLM/hyperindex-complete"
                >
                  HyperIndex LLM Docs
                </Link>
                <Link
                  className={styles.docLink}
                  to="/docs/HyperSync-LLM/hypersync-complete"
                >
                  HyperSync LLM Docs
                </Link>
                <Link
                  className={styles.docLink}
                  to="/docs/HyperRPC-LLM/hyperrpc-complete"
                >
                  HyperRPC LLM Docs
                </Link>
                <Link
                  className={styles.docLink}
                  to="/docs/HyperIndex-Hosted-LLM/hosted-service-complete"
                >
                  HyperIndex Hosted Service LLM Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
