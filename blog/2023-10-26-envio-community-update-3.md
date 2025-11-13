---
title: Envio Developer Update October 2023
sidebar_label: Envio Developer Update October 2023
slug: /envio-developer-community-update-no-3
description: "Catch up on what Envio shipped in October including record breaking sync benchmarks, builder bounties, new hackathon partnerships and developer milestones."
---


<img src="/blog-assets/envio-developer-community-update-3.png" alt="Cover Image Envio Developer Community Update No.3" width="100%"/>

<!--truncate-->

We’re back with our third monthly community update, where we'll give you an exclusive view of what the Envio team has been shipping over the past month. As usual, we’ll be covering upcoming events, technical developments, and exciting milestones. So, grab a cuppa, and let’s get technical! 💃

Our team has been doing some serious benchmarking tests to assess the syncing performance of various web3 indexing solutions. Builders want to move swiftly and iterate fast…and boy-o-boy is Envio F-A-S-T! Envio v0.0.20 ranked as the fastest blockchain indexer out of all the indexing solutions that we battle-tested. Our goal is to develop Envio as a top-tier performance blockchain indexing solution, validating this through rigorous data-driven approaches.

More details about the findings can be found [here](https://docs.envio.dev/blog/indexer-benchmarking-results).

The bounty game was strong this month! 💪

We released another three bounties with a total prize pool of a whopping **$1400 USDC** in our [Discord](https://www.notion.so/9d8e77645e7d4605a9d04c822aec5bba?pvs=21) that were quickly claimed by our builder community. These bounties included migrating the existing [Aave](https://aave.com/) V3 subgraph to an [Envio](https://envio.dev/) Indexer using our [Subgraph Migration Toolkit](https://docs.envio.dev/docs/HyperIndex/migration-guide), an [ENS](https://ens.domains/) multi-chain indexer, and a [POAP](https://poap.xyz/) multi-chain indexer that indexes the POAP smart contracts. We’ve seen some incredible milestones and received loads of valuable feedback. Big ups to all the builders who continue to inspire, participate, and help build Envio. 🙏

Keep an eye out for more exciting bounties in the coming month of November. All Envio bounties are announced in our [bounties](https://discord.gg/Xuy3ub9Q28)💰announcement channel in Discord and on our [Dework](https://app.dework.xyz/envio) profile, so be sure to turn on those notifications. Remember, the early bird catches the worm! 🪱🦅

If you don’t see anything that tickles your fancy, we also have the Envio “[Build Bigger. Ship faster](https://docs.envio.dev/blog/envio-grant-program-now-live)” grant program running with a few interesting use cases where you are more than welcome to apply using your own ideas. Feel free to DM the team or drop your suggestions in our Discord and we’ll get back to you ASAP Rocky!

More details [here](https://x.com/envio_indexer/status/1704136858874052974?s=20).

But wait, there's more! We’re thrilled to announce that Envio has been officially listed on both the [Builda](https://builda.dev/list/envio) and  [The Dapp List](https://thedapplist.com/project/envio) discovery stores. Massive thank you to everyone who upvoted Envio on both platforms, please do keep those votes coming! Later in October, we’ll be joining a Twitter Spaces with the wonderful team from Builda so be sure to check out the upcoming events section below for more details.

We’ve also partnered with the fantastic team at [Encode Club](https://www.encode.club/) for [the ETH London](https://www.encode.club/eth-london) 2023 hackathon where our very own [Jonathan Clark](https://twitter.com/jonjonclark) will be hosting an exclusive blockchain indexing quickstart with Envio workshop. It's the perfect opportunity to learn, gain valuable insights, and supercharge your blockchain development skills. Whether you're a beginner or an experienced developer, there's something here for everyone.

<img src="/blog-assets/envio-encode-club-hackathon.jpeg" alt="Encode Club Hackathon Bounty Announcement" width="100%"/>

In addition, we’ve listed several exciting bounty opportunities for participants to showcase their skills and win a share of our $5.9k bounty pool including:

- **⚡Fast, fresh data? No problem!**: $2k
- **🧙You are a multichain wizard**: $2k
- **🌃Data, data everywhere**: $1.3k

More details [here](https://www.encode.club/eth-london#bounties).

### **Upcoming Events ⭐**

1. **[Cardano Community-led Summit](https://summit.cardano.org/community-led-events/):** Calling all Cape Town frens! Connect with us at the Cardano Center in Cape Town on the 27th of October 2023.
2. **[ETHLondon 3-Day Hackathon & Envio Workshop](https://www.encode.club/eth-london)**: Participate in our bounty opportunities at the ETHLondon 3-Day Hackathon from October 27th-29th 2023. Join us for a blockchain indexing quickstart using Envio workshop on the 28th of October.
3. **Builda Twitter Spaces**: Mark your calendars and join Envio, [DeFi Dude](https://twitter.com/defidude), and the fantastic team from [Builda](https://builda.dev/) for an epic Twitter Spaces on the 30th of October at 7 pm GMT+2. More details dropping soon.
4. **[ETH Istanbul](https://ethglobal.com/events/istanbul):** A couple members of the team will be attending Dev Connect and ETH Istanbul! Come find us, say hi, grab a coffee, and split a baklava from the 13th-19th of November 2023.

### **Technical Overview 🏗️**

**Current release: 🚀**

We’re thrilled to announce that we have released a new version of Envio, [v0.0.20](https://discord.gg/RyGRedQscR)!

**What's changed:**

- Handled BigDecimal from subgraph migration.
- Added error codes to input validation.
- Validated against using language-reserved keywords.
- Reduced default batch sizes.
- Added dynamic contracts to allow loading from all events.
- Improved ERC20 templates with approval entity.
- Handled dynamic contracts in raw events worker.
- Fixed raw events resync.
- Implemented hooks for stop worker.
- Fixed deferred breaking on an empty array.
- Implemented local scope in memory store - this makes the indexer less error-prone, and easier to test and reason about from a developer's point of view.
- Changed db functions to use quotes around table names for case consistency - allowing more diverse names for tables with capitalizations, etc.
- Refactor in memory store to have local state.
- Updated templates with a new layout for capitalization.
- Added Goerli testnet as an option for Hypersync - Goerli will be lightning-fast now.
- Template integration tests - fixed + included in the workflow.
- Improved Hypersync Fetching And Parsing - this is one of the big factors responsible for the speedup of the indexer from v0.0.19 to v0.0.20.
- Update the casing of entities to allow users to choose casing.
- Integration testing using Matrix for test isolation - this means the starter templates will always be tested thoroughly before use.
- Added test to validate that multiple sync sources don’t break.
- Upgraded Ethers to Parse ABI files.
- Hypersync: Gnosis config.
- Event Sync State Table.

Stay tuned for more monthly updates and hop in our Discord for more up-to-date information. Exciting times are ahead, and we’re thrilled to have you along for the ride. Until next time, keep shipping and stay classy San Diego! 🦩

For real-time updates and discussions, join the crew and hop in our [Discord](http://discord.gg/gt7yEUZKeB).

## About Envio

[Envio](https://envio.dev) is a fast, developer friendly blockchain indexer and the fastest, most flexible way to get on-chain data, making real-time data accessible for developers across the Web3 ecosystem.

With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing tools supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.

If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)