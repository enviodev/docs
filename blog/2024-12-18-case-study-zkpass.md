---
title: "zkPass: Multichain ZKP Identity Verification Powered by Envio"
sidebar_label: "zkPass Case Study: How Envio Indexes 8 EVM Chains for Privacy-Preserving Identity"
slug: /zkpass-shaping-future-of-data-privacy
tags: ["case-studies"]
description: "How zkPass uses zero knowledge proofs with Envio to verify identity and transactions across 8 EVM networks while keeping user data private."
image: /blog-assets/zkpass-casestudy.png
last_update:
  date: 2026-04-15
---

Author: [Jordyn Laurier](https://x.com/j_o_r_d_y_s), Head of Marketing & Operations


<img src="/blog-assets/zkpass-casestudy.png" alt="Cover Image How ZKPs help User Privacy" width="100%"/>

<!--truncate-->

:::note TL;DR
- zkPass uses Envio's HyperIndex to index and verify onchain identity data across 8 EVM networks including Optimism, BNB, Base, Arbitrum, and X Layer, through a single unified API.
- HyperSync replaces traditional RPC for data ingestion, enabling the zkPass engineering team to accelerate development cycles and test product features faster.
- The integration powers transaction count verification, wallet history checks, cross-wallet asset verification, and proof of token holdings without exposing private user data.
:::

[zkPass](https://zkpass.org/) selected [Envio](https://envio.dev/) as its blockchain indexer to power privacy-preserving identity verification across 8 EVM networks. Envio's HyperIndex consolidates onchain data from multiple chains into a single unified API, enabling zkPass to verify wallet history, asset holdings, and transaction counts without requiring users to disclose sensitive personal information.

## What are Zero-Knowledge Proofs (ZKPs)?

ZKPs allow one party (the prover) to prove to another party (the verifier) that they know a specific piece of information without revealing the actual data. It's a system based on trust but with privacy baked in. For example, you could prove your age without sharing your birthdate, or prove you have enough funds for a transaction without showing your full balance.

Although this concept has been around for decades, its practical application in blockchain and Web3 is now gaining momentum. The rise of decentralized systems has created a demand for more secure, private ways of verifying transactions, identities, and sensitive data.

## How do ZKPs Work?

In a ZKP, the prover uses complex cryptographic algorithms to generate a "proof" that can be validated without sharing the original information. Here's a simplified breakdown of how it works:

1. **Prover and Verifier**: Two parties engage in a process. The prover wants to prove they know a certain fact (like a password) without revealing it.
2. **Mathematical Proof**: The prover uses a mathematical algorithm to create a proof that is valid only if the statement is true.
3. **Verification**: The verifier checks the proof without needing to access the sensitive information itself.

This might sound complicated, but the impact is straightforward: sensitive data remains private, yet its validity is verified.

## Why is This Important for User Privacy?

Today, most systems that require identity verification ask for more data than necessary. Think about how often you're asked to provide your personal details: Name, Surname, Age, Physical Address, Identification Number, Bank Statements, Credit Score, etc. This over-sharing of data leads to higher risks of exposure, scams, and breaches.

ZKPs offer a way to get around this, allowing you to share only necessary information, and helping reduce the risk of your data falling into the wrong hands.

## ZKPs Role in Decentralized Identity

One of the biggest opportunities for ZKPs lies in decentralized identity (DID) systems. In a decentralized identity setup, you can control your own digital identity without ever having to rely on a central authority. But you'd still need a way to verify this information and that's where ZKPs come in.

With ZKPs, you can verify parts of your identity, such as age, nationality, or ownership of a digital asset, without revealing your full details to the verifier. This is especially useful in cases like age verification, voting systems, and even background checks.

## Unlocking the Full Potential of ZKPs

The potential for ZKPs extends far beyond decentralized identity systems. Here are a few other use cases where ZKPs can play a critical role:

- **Secure Transactions**: In blockchain-based financial systems, ZKPs enable privacy-preserving transactions. Users can prove they have enough balance to complete a transaction without revealing the entire wallet's contents.
- **Private Voting**: ZKPs can allow people to participate in elections or governance votes without disclosing who they voted for, ensuring privacy and integrity in democratic systems.
- **Supply Chain Verification**: In industries like pharmaceuticals or luxury goods, ZKPs can confirm the authenticity of a product's origin or lifecycle without revealing all the internal supply chain details.

For a more comprehensive look at additional and existing use cases, check out zkPass's [use cases](https://zkpass.gitbook.io/zkpass/overview/use-cases).

## What is zkPass?

[zkPass](https://zkpass.org/) is a decentralized authentication solution that verifies your legal identity without requiring file uploads or the over-disclosure of private information. Through the power of ZKPs, it allows you to selectively prove a wide array of data types without revealing any of your personal information.

At zkPass, user empowerment is at the forefront. Web3 users can manage their credentials and share only the necessary information for specific interactions, giving them greater control over their data and privacy. The platform leverages advanced cryptographic techniques to facilitate seamless and secure verification processes. This not only builds user trust but also enhances their overall experience, enabling them to engage in activities like online voting confidently, and participating with decentralized applications.

By offering a versatile solution for proving identity and qualifications, zkPass is leading the charge toward a more secure and privacy-centric future in digital identity management.

<img src="/blog-assets/zkpass-casestudy-1.png" alt="Screenshot of zkPass App" width="100%"/>

<img src="/blog-assets/zkpass-casestudy-2.png" alt="Screenshot of zkPass App" width="100%"/>

## How Envio Powers zkPass's Privacy Solutions

At the heart of implementing ZKP technology, zkPass recognized the critical need to optimize the data infrastructure necessary for deploying effective ZKP solutions. To achieve this, zkPass chose [Envio](https://envio.dev/) as its blockchain indexer and accelerated data infrastructure partner.

By integrating Envio's capabilities, zkPass can seamlessly operate across various EVM networks, ensuring low-latency performance and reliable access to real-time data. Envio's real-time data indexing and querying empower zkPass to scale its privacy solutions effectively.

Specifically, Envio supports zkPass in:

- **Proof of the Number of Transactions**: Envio enables zkPass to verify the total number of transactions associated with a wallet, enhancing the accuracy of transaction tracking.
- **Wallet History Verification**: With Envio's infrastructure, zkPass can efficiently verify the transaction history of wallets, ensuring integrity and transparency in user activity.
- **Cross-Wallet Asset Verification**: Envio facilitates the verification of assets across multiple wallets, allowing zkPass to confirm asset ownership without compromising user privacy.
- **Proof of Token Holdings**: Envio's capabilities enable zkPass to validate token holdings securely, ensuring that users can prove their ownership without disclosing sensitive information.

## How Envio Enhances zkPass with Multichain Support

zkPass utilizes Envio's [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) to efficiently index and aggregate data across eight EVM networks, including [Optimism](https://www.optimism.io/), [Binance Smart Chain](https://www.bnbchain.org/en), [X Layer](https://www.okx.com/xlayer), [Base](https://www.base.org/), and [Arbitrum](https://arbitrum.io/). This enables zkPass to seamlessly query real-time and historical data from their smart contract deployments, providing a comprehensive view of their application data and user actions.

<img src="/blog-assets/zkpass-casestudy-3.png" alt="GraphQL Playground Example Query" width="100%"/>

Envio's multichain architecture consolidates data from multiple blockchains into a unified database, accessible through a single API. Other indexers require a separate deployment per chain. With Envio, all networks are configured in a single config.yaml. This design simplifies development workflows, reduces infrastructure complexity, and lowers operational costs.

Moreover, by using HyperSync as the data source for HyperIndex (instead of traditional RPC methods), the zkPass engineering team benefits from exceptionally fast indexing performance and reliable data access. This empowers the zkPass team to accelerate their development lifecycle, test product features more rapidly, and drive innovation at a faster pace.


<img src="/blog-assets/zkpass-casestudy-4.png" alt="Indexer Hosted Service" width="100%"/>

## Conclusion

zkPass offers a glimpse into a future where privacy doesn't have to be sacrificed for convenience or verification. By allowing people to prove what they need without over-sharing sensitive details, ZKPs are redefining what's possible in user privacy. As the technology evolves and becomes more scalable, ZKPs could become the go-to solution for a wide range of privacy concerns, from identity verification to secure transactions.

As Envio continues to support decentralized applications like zkPass, we're excited to see how ZKPs will be integrated to empower better privacy and security for all users.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
