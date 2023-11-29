---
title: Envio Community Update No. 04
sidebar_label: Envio Community Update No.04
slug: /envio-developer-community-update-no-4
---

<img src="/blog-assets/envio-developer-community-update-4.png" alt="Cover Image Envio Developer Community Update No.4" width="100%"/>

<!--truncate-->

Ahoy Developers!

We’re back with our fourth monthly community update, and we're excited to share an insider's view into the fantastic endeavors the Envio team has set sail on over the past month. We'll be unpacking past events, navigating through the latest technical developments, and raising a toast to some exciting milestones.🍻

We’re excited to announce that Envio HyperSync has added significant updates to existing networks and added new and enhanced indexing support for [Arbitrum](https://arbitrum.io/), [Avalanche](https://www.avax.network/), [Base](https://base.org/), [BSC](https://www.bnbchain.org/en), [Gnosis](https://www.gnosis.io/), [Kroma](https://kroma.network/), [Linea](https://linea.build/), [Manta](https://manta.network/), [Metis](https://www.metis.io/), [Optimism](https://www.optimism.io/), [PolygonZkevm](https://polygon.technology/polygon-zkevm), [Scroll](https://scroll.io/), [Sepolia](https://sepolia.etherscan.io/), and [TaikoJolnr](https://taiko.xyz/).

We’re also pleased to announce that Envio has also been officially listed on the [Base](https://base.org/ecosystem?tag=infra), [Cronos](https://discover.cronos.org/projects/envio), [Gnosis](https://gnosischain.world/#Analytics), and [Optimism](https://www.optimism.io/apps/tools) project ecosystem listings. Developers can anticipate an expansion in network support for various EVM-compatible chains soon.

For a full list of currently supported chains on HyperSync visit our [docs](https://docs.envio.dev/docs/hypersync).

This month the team took to the skies and attended various blockchain, Web3, and hackathon events around the globe including [ETH London](https://www.encode.club/eth-london), [ETH Istanbul](https://ethglobal.com/events/istanbul), [Devconnect](https://devconnect.org/), and the [Cardano Community-led Summit](https://summit.cardano.org/) and Celo events that were both hosted in Cape Town. The team participated in various hackathons and hosted various bounty opportunities, workshops, and fun side events.

Congratulations to all the winners who participated in our bounties and a massive thank you to all the hosts and organizers of the events. We would like to also extend our gratitude to all winners and hackers who participated in our bounties and to all the legends who attended our [Ethereum Meetup Revival](https://www.meetup.com/istanbul-ethereum-meetup/events/297237975/) side event in Istanbul, we had such a blast connecting and networking with you all.

In addition, we also celebrated our first bounty graduate this month! 🎉

Congratulations to the very talented "Mogithehurt," who focused on building a multi-chain POAP indexer that indexes the [POAP](https://poap.xyz/) smart contracts, showcasing the true power of Envio's indexing capabilities! ⚡

Read more details [here](https://docs.envio.dev/blog/envio-bounty-graduate-poap-multi-chain-indexer).

Phase 1 of the [Envio bounty program](https://x.com/envio_indexer/status/1704136858874052974?s=20) has seen an incredible display of “Big Dev Energy”, with passionate developers and enthusiasts from our community making significant strides in our bounty program. The response and feedback have been nothing short of inspiring, and the quality of contributions has surpassed our expectations. The dedication and enthusiasm displayed by our community have laid a solid foundation for what lies ahead. We are immensely grateful for the hard work, collaboration, and commitment demonstrated by everyone involved.

We plan to roll out phase 2 of the Envio bounty program in the next few months after the festive season where you can expect to see various bounties that are primarily focused on the creation of interesting use cases and templates so be sure to keep an eye out in our [Discord](https://discord.gg/QdREZ9NPyk) and/or our [Dework](https://app.dework.xyz/envio) profile for new bounty submissions and announcements.

We will continue to run the Envio “[Build Bigger. Ship faster](https://docs.envio.dev/blog/envio-grant-program-now-live)” grant program with a few interesting use cases but feel free to apply your unique ideas by simply reaching out to the team in our Discord.

### Technical Overview 🏗️

**Current release:** v0.0.24 **🚀**

Over the past month, we released four new versions of Envio (v.0.0.20 - v.0.0.24).

### What's changed:

### v0.0.20

**Changes:**

- **Breaking change**: table names now use the same casing as the "@entity" definition in schema.graphql. For Javascript and Typescript projects, the entity property on the handler context now also matches the case of the "@entity" definition.
- Using Viem for parsing event arguments.
- Significantly improved HyperSync performance.
- Added HyperSync support for Goerli testnet and Gnosis.

**Fixes:**

- Database connection breaking PG PASSWORD environment variable is set.
- HyperSync contracts with common events not parsing.
- HyperSync data fetching not handling retries.
- Memory leak in v0.0.18 fixed in release v0.0.19 and v0.0.20.
- CamelCase entities no longer cause issues.

### v0.0.21

**Changes:**

- New feature "Contract Import" for quick-start. Given a network and a contract address, autogenerate a template for an indexer.
- New improved HyperSync support for BSC, Sepolia, Linea, Base, and Optimism
- New feature: "handler context" now has access to context.log to access the logging framework from handlers.
- Used a different default Envio Postgres port to decrease the likelihood that there is a clash with another running Postgres instance.

**Fixes:**

- Object relationship names are now different from the ID field names on the GraphQL API. Allowing bidirectional "derivedFrom" relationships.
- Extra long event names won't break the provisioning of the database.

### v0.0.23

**Changes:**

- **Breaking change: Entities no longer automatically have chain_id and event_id fields appended to them.**

**Contract Import Improvements:**

- New Feature: Generate a starter template from a local ABI file. No need to have a deployed and verified contract to use this feature.
- Contract Import Now handles events that contain tuples in their signature.
- Contract Import via explorer now has more descriptive errors if there is a failure.

**Other improvements:**

- Event signatures with no arguments are now valid and indexable

### v0.0.24

**Changes:**

- New HyperSync support for Scroll, Metis, Celo, Sepolia, PolygonZkevm, Manta, TaikoJolnr, and Kroma
- Updated Greeter template to demo global contract config for the multi-chain use case.
- Deprecate Base Testnet support for HyperSync.

**Fixes:**

- Regression where dynamic contracts without an address in config (registered by factories) would through an error on codegen.

Stay tuned for more monthly updates and hop in our Discord for more up-to-date information. Until next time, keep shining! ⭐

### Ship with us. 🚢

By builders, for builders. [Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio serves as the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

Follow Envio on [X](https://twitter.com/envio_indexer) (formerly Twitter) and/or [Hey](https://hey.xyz/u/envio) (formerly known as Lenster) for updates on new features, or jump into our [Discord](https://discord.gg/2eKRvCRqQw) for any questions.