import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Customizable',
    // Png: require('@site/static/img/envio-white-logo.png').default,
    description: (
      <>
        There is disruptive innovation taking place in the blockchain space and every application is trying to bring something fresh, unique and exhilarating to the market. Whether you’re developing a multi-chain NFT marketplace, creating a DAO, in GameFi, or creating the next big P2E (play-to-earn) project on Web3, Envio is a catalyst and the perfect building block in your application development.
      </>
    ),
  },
  {
    title: 'Reliable',
    // Png: require('@site/static/img/envio-white-logo.png').default,
    description: (
      <>
        Envio ensures reliability in terms of data accessibility, performance, and availability. Ease of use providing a user-friendly interface that simplifies the process of accessing data and business logic from smart contracts, making it easy for developers to interact with the blockchain. 
      </>
    ),
  },
  {
    title: 'Scalable',
    // Png: require('@site/static/img/envio-white-logo.png').default,
    description: (
      <>
        Multi-chain indexing for EVM-compatible smart contracts, allowing you to aggregate data from multiple blockchains, into a single unified view. Whether it's for presenting clean information in your front-end, or for data lake and analytics, Envio automatically scales to your workload needs with no need for additional management or provisioning.
      </>
    ),
  },
];

function Feature({Png, Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      <img src={Png} className={styles.featureImg}/>
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
