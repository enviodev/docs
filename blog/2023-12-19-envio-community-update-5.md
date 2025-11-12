---
title: Envio Developer Update December 2023
sidebar_label: Envio Developer Update December 2023
slug: /envio-developer-community-update-no-5
description: "Here’s what we shipped in December at Envio including new builder tools community highlights more network support and the progress driving our blockchain indexing solution forward."
---


<img src="/blog-assets/envio-developer-community-update-5.png" alt="Cover Image Envio Developer Community Update No.5" width="100%"/>

<!--truncate-->

Ahoy Buidlers!

Welcome to our fifth and final monthly update of 2023, where we're eager to share the latest from the Envio team over the past month and offer a sneak peek into what's on the horizon for the coming year. As always, we'll be diving into the tech updates, toasting a year of exciting progress, and setting the stage for the developments that lie ahead. 🥂

Since our initial launch in July 2023, Envio has been on a transformative journey, solidifying its position as the fastest blockchain indexer for EVM. This year has been a whirlwind of development, noteworthy releases, engaging grant and bounty programs, strategic partnerships, and networking events.

With each passing month, our community has flourished, and the collaborative spirit has been the driving force behind our forward momentum. As we approach 2024, we’d like to take a moment to reflect on the accomplishments, significant milestones, and our incredible community that has played a pivotal role in our development, and we're excited to share this update as a token of gratitude for your continued support. So, without further ado, let's dive in! 👙

### Reflection

In 2023, our journey was defined by a series of strategic version releases, each contributing to Envio’s evolution.

Versions from v0.0.20 to v0.0.24 showcased our commitment to performance optimization and ecosystem growth. These releases introduced significant improvements in [Hypersync](https://docs.envio.dev/docs/hypersync) performance allowing 100x faster sync speeds than JSON-RPC, and innovative features like our no-code [Contract Import](https://docs.envio.dev/docs/HyperIndex/contract-import) tool that allows users to generate and index an existing contract that has been deployed on the blockchain, and with the addition of expanded support for diverse networks.

Continuing the momentum, v0.0.25 refined existing features, resolving challenges like tuples in event parameters. In addition, the 'envio dev' command was optimized for efficient codegen management, demonstrating Envio's responsiveness to our user's needs.

The latest release, v0.0.26, introduced "TestHelpers" for enhanced unit testing and extended contract-import functionality, supporting multiple contracts across chains and expanding Envio’s ecosystem horizons with the chains supported by Hypersync. We’ve also added significant updates to existing networks and added new and enhanced Hypersync support for [Lukso](https://lukso.network/), [OkbcTestnet](https://www.okx.com/), Holesky, and [GnosisChiado](https://docs.gnosischain.com/about/networks/chiado). ⚡⚡⚡

Envio Hypersync is now supported across 25+ EVM blockchains. For a full list of currently supported chains on Hypersync visit our [docs](https://docs.envio.dev/docs/hypersync).

### Events

From participating in hackathons at [ETH London](https://www.encode.club/eth-london) and [ETH Istanbul](https://ethglobal.com/events/istanbul) to joining the [Cardano Community-led Summit](https://summit.cardano.org/community-led-events/) and [CELO Hackathon](https://celo-cape-town-hackathon.devpost.com/) in Cape Town, our team embraced opportunities for collaboration and knowledge sharing globally.

Envio's presence extended from workshops, such as the [Encode Club](https://www.encode.club/) Hackathon to social networking events, where we facilitated discussions on blockchain indexing and shared valuable insights over a few cold ones. The team also actively participated in hackathons showcasing Envio’s indexing capabilities and strengthening our connections within the blockchain space.

Looking ahead, we remain committed to participating in upcoming events in 2024 that contribute to the growth and innovation of the broader blockchain ecosystem.

### Bounty & Grant Programs

As phase 1 of the [Envio bounty program](https://x.com/envio_indexer/status/1704136858874052974?s=20) comes to a close we are incredibly proud and grateful for all the hard work and dedication would like to personally thank every graduate and participant who took on the challenge and gave us some incredible feedback. Our "[Build Bigger. Ship Faster" Grant Program](https://docs.envio.dev/blog/envio-grant-program-now-live) and phase 1 of our Bounty Program provided various opportunities for developers of all skill sets to showcase their talents. Notable contributions from our bounty graduates include "Mogithehurt" for building a [multi-chain POAP indexer](https://docs.envio.dev/blog/envio-bounty-graduate-poap-multi-chain-indexer) and “en0c” for shipping an [ERC4626 indexer for tokenized vault contracts](https://docs.envio.dev/blog/envio-bounty-erc4626-tokenized-vault-indexer). These initiatives emphasized our commitment to empowering developers, fostering creativity, and rewarding impactful contributions.

We plan to launch phase 2 of the Envio bounty program in Q1 of 2024 where you can expect to see some exciting bounties that are focused on the creation of interesting use cases and templates so be sure to keep an eye out in our [Discord](https://discord.com/invite/Q9qt8gZ2fX) and/or our [Dework](https://app.dework.xyz/envio) profile for new bounty submissions and announcements.

We will continue to run the Envio “Build Bigger. Ship faster” grant program with a few interesting use cases but feel free to apply your unique ideas by simply reaching out to our wonderful team in our Discord.

### Video Tutorials

Unlock the full potential of Envio with our latest video tutorials! These video tutorials showcase the true power of Envio, demonstrating our lightning-fast indexing capabilities by generating indexers for the [ENS](https://ens.domains/), [Friend.Tech](https://www.friend.tech/) and [EigenLayer](https://www.eigenlayer.xyz/) smart contracts.

**🎥 Featured Tutorials:**

- [Indexing the Entire ENS Registrar Smart Contract in 100 seconds](https://youtu.be/JOiLUysZf-s)
- [How to Generate an Indexer and Index Friend.Tech's Entire Contract using HyperIndex](https://youtu.be/tpMoTe1m2To)
- [Indexing EigenLayer's Strategy Manager Contract in under a minute](https://youtu.be/zkVlGgf5XAo)

We're always committed to pushing the boundaries further. Keep an eye out for upcoming speed-run tests and tutorials and stay in the loop by subscribing to our [YouTube channel](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA).

### Technical Overview 🏗️

**Current release:** v0.0.26 **🚀**

Over the past month, we released two new versions of Envio (v.0.0.25 - v.0.0.26).

### What's changed:

### v0.0.25

Changes:

- Fixed and improved Greeter Template.
- Improved ‘envio dev’ command. It should now work efficiently to manage whether or not to rerun codegen, manage database migrations, and spin up/run the indexer event when swapping between projects.
- Tuples in event params are now fixed and working on Contract Import.
- Fixed [TaikoJolnr](https://taiko.xyz/), [Manta](https://manta.network/), [PolygonZkevm](https://polygon.technology/polygon-zkevm), [Kroma](https://kroma.network/), and [Celo](https://celo.org/) endpoints.

### v0.0.26

**Changes:**

New Features:

- "TestHelpers", a code-generated module that helps you write unit tests for your indexer by generating:
  - A MockDb module that allows you to simulate the indexer interacting with a database.
  - A processEvent functions for every contract and event in your project. These functions take a mock event and a MockDb and run the event through your loaders and handlers.
  - A createMockEvent function for each event in your project that allows you to quickly mock events passing in only parameters you care about and defaulting the rest.
- Extended contract-import. You can now import multiple contracts using the contract-import tool and get started incredibly fast with a template customized for multiple contracts across multiple chains.
- Event Selection on contract-import. You can now choose a selection of events.

New Hypersync Chains:

- [Lukso](https://lukso.network/)
- [OkbcTestnet](https://www.okx.com/)
- Holesky
- [GnosisChiado](https://docs.gnosischain.com/about/networks/chiado)

Fixes and other changes:

- Disabled automatic resync from cached events on the ‘envio dev’ command due to the feature being unstable.
- Templates now contain test examples.
- DB-related environment variables are now prepended with ENVIO\_ to avoid collisions with existing databases in a dev environment.
- Fixed a bug that allowed users to define an array of entities in their graphql.schema files.

Stay tuned for more monthly updates and hop in our Discord for more up-to-date information.

Lastly, we’d like to thank you for the most epic year and support. We wish you all a beautiful festive season surrounded by your friends and family. Stay safe, get some rest and we’ll see you in the new year! 🎄

Sincerely,

The Envio team.💙

### Ship with us. 🚢

By builders, for builders. [Envio](https://envio.dev/) is a dev-friendly, speed-optimized, modern blockchain indexing solution that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. By harnessing the power of Envio, developers can overcome the challenges posed by latency, reliability, and costs across various sources. Envio serves as the front door for any application’s need to access, transform, and save real-time or historical data, from any EVM-compatible smart contracts.

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. Join our growing community of elite developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

Follow Envio on [X](https://twitter.com/envio_indexer) (formerly Twitter) and [Hey](https://hey.xyz/u/envio) (formerly known as Lenster) for updates on new features, or jump into our [Discord](https://discord.gg/2eKRvCRqQw) for any questions.
