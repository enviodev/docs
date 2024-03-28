import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "HyperIndex",
    // Png: require('@site/static/img/envio-white-logo.png').default,
    description: (
      <>
        Index up to 100x faster than existing solution. Use the contract import
        feature for a 2min no-code quickstart.
      </>
    ),
  },
  {
    title: "HyperSync",
    // Png: require('@site/static/img/envio-white-logo.png').default,
    description: (
      <>
        The successor to Json-RPC, HyperSync is a new standard for blockchain
        data reitrival. It's faster and more flexible.
      </>
    ),
  },
  {
    title: "HyperRPC",
    // Png: require('@site/static/img/envio-white-logo.png').default,
    description: (
      <>
        Blazingly fast read-only RPC. A drop in solution for data heavy
        applications.
      </>
    ),
  },
];

function Feature({ Png, Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
        <img src={Png} className={styles.featureImg} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
