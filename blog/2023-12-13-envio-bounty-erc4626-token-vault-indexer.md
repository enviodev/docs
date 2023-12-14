---
title: "Envio Bounty Graduate: ERC4626 Indexer for Tokenized Vault Contracts"
sidebar_label: 'Envio Bounty Graduate: ERC4626 Indexer for Tokenized Vault Contracts'
slug: /envio-bounty-erc4626-tokenized-vault-indexer
---

<img src="/blog-assets/envio-erc4626-indexer-cover.png" alt="Cover Image for Envio Bounty Graduate: ERC4626 Tokenized Vault Indexer" width="100%"/>

<!--truncate-->

We’re excited to announce another significant milestone in Phase 1 of the Envio Bounty Program. We take huge pride in highlighting the latest achievement in our bounty program, where our very talented graduate “en0c” successfully tackled a significant challenge.

In this blog article, we’ll explore their recent accomplishment in building an Envio indexer for [OpenZeppelin’s](https://www.openzeppelin.com/) ERC4626 tokenized vault contracts, showcasing the true power of Envio's hyper-indexing capabilities. ⚡⚡⚡

### User Story

This bounty aimed to tackle the challenges that blockchain developers face when wanting to query and/or present tokenized vault events in their applications. The goal was to enable developers to easily query and/or present tokenized vault events in their applications with custom [GraphQL](https://graphql.org/) APIs.

### Bounty Overview

For blockchain developers seeking an easy and efficient way to access information for tokenized vault contracts in their applications can be quite a cumbersome task. Our recent bounty introduced an indexer template tailored for OpenZeppelin’s ERC4626 tokenized vault contract standard. This template aims to bootstrap development time by indexing token vault events without the need to write the indexing logic by providing a pre-built solution for indexing OpenZeppelins’s token vault events.

The ERC4626 tokenized vault standard extends the functionality of the ERC20 standard by allowing fractionalized token supply through deposits and withdrawals to token vaults. The bounty included the development of a GraphQL schema, config.yaml, and indexing logic in [JavaScript](https://www.javascript.com/). In addition, Envio indexer supports indexing logic in [TypeScript](https://www.typescriptlang.org/) or [Rescript](https://rescript-lang.org/).

The schema includes three main types: `TokenVault`, `Deposit`, and `Withdrawal`. The `TokenVault` entity stores information about the tokenized vault, such as assets, shares, proportions, and exchange rates. `Deposit` and `Withdrawal` entities capture details about corresponding events, including sender, owner, assets, shares, and the associated vault.

**From Development to Deployment**

Our accomplished bounty graduate, "en0c," seamlessly deployed their ERC4626 indexer onto Envio's hosted service by effortlessly pushing the latest version of their [indexer project](https://github.com/en0c-026/erc4626-indexer) to GitHub.

You can now explore the full functionalities of the ERC4626 token vault indexer, accessible in [Envio's Explorer](https://envio.dev/explorer).

<img src="/blog-assets/envio-erc4626-explorer.png" alt="Screenshot of Example Query" width="100%"/>

In addition, our graduate demonstrated what a few GraphQL API queries would look like below:

*Query Example: Get Vault State*
<img src="/blog-assets/envio-erc4626-getvaultstate.png" alt="Screenshot of Example Query" width="100%"/>

*Query Example: Get the latest deposits*
<img src="/blog-assets/envio-erc4626-latestdeposits.png" alt="Screenshot of Example Query" width="100%"/>

*Query Example: Get the latest withdrawals*
<img src="/blog-assets/envio-erc4626-latestwithdrawals.png" alt="Screenshot of Example Query" width="100%"/>

Envio stands out by providing a hassle-free solution for deploying and hosting your indexer. We take care of the entire infrastructure, eliminating the complexities associated with setup and management. This user-centric approach allows developers to channel their focus into refining their application's core functionality, ensuring an unparalleled user experience. For a comprehensive guide on deploying your indexer to Envio's hosted service, explore our [documentation](https://docs.envio.dev/docs/hosted-service).

### Bounty Reward

Acknowledging the task of the given bounty overview, Envio presented an enticing incentive of $100 in USDC for accomplishing the bounty successfully. This gesture not only functions as a gesture of gratitude for the effort and commitment invested in the development but also as a motivator for contributors to remain engaged in upcoming bounties, accessible through Envio's Discord or [Envio’s Dework](https://app.dework.xyz/envio) profile.

### How to Get Involved?

Envio's bounty program welcomes blockchain developers of all skill levels, offering diverse challenges. Whether you're a seasoned developer seeking intricate tasks or a novice looking to embark on your developer journey, our program provides opportunities tailored to your capabilities.

Envio operates on a first-come, first-served basis, ensuring a fair and transparent allocation of bounties. To stay in the loop and get notified promptly, we encourage developers to hop into our vibrant Discord community, head over to our [bounties💰channel](https://discord.com/invite/fAuwWq2uXZ), or follow us on [Dework](https://app.dework.xyz/envio) to stay in the loop on all bounty announcements.

For more information on how to claim a bounty click [here](https://twitter.com/envio_indexer/status/1704136858874052974?s=20).

### About OpenZepplin

[OpenZeppelin](https://www.openzeppelin.com/) is a leading force in blockchain and smart contract development, offering a robust framework for secure and scalable dApps within the Ethereum ecosystem. Renowned for battle-tested smart contract libraries, OpenZeppelin provides developers with secure patterns and auditing services, ensuring the integrity of blockchain applications. With a commitment to security best practices, OpenZeppelin fosters a collaborative community and provides open-source resources for developers, making it a go-to platform for reliable blockchain development.

### About Envio

[Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio is the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts. If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further.

Follow Envio on [X](https://twitter.com/envio_indexer) (Formerly Twitter) and/or [Hey](https://hey.xyz/u/envio) (Formerly Lenster) for updates on new features, or jump into our [Discord](https://discord.com/invite/gt7yEUZKeB) for any questions.